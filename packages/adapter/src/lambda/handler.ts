import type { App } from "astro/app";
import type { APIGatewayProxyEventV2, CloudFrontRequestEvent } from "aws-lambda";

import type { Args } from "../args.js";
import { log } from "../log.js";

import { createLambdaEdgeFunctionResponse, createLambdaFunctionResponse, createRequestBody } from "./helpers.js";

const clientAddressSymbol = Symbol.for("astro.clientAddress");

export const createHandler =
	(app: App, knownBinaryMediaTypes: Set<string>, { logFnResponse, logFnRequest }: Args) =>
	async (originalEvent: APIGatewayProxyEventV2 | CloudFrontRequestEvent) => {
		if (logFnRequest) {
			log("function request", JSON.stringify(originalEvent, undefined, 2));
		}

		if ("Records" in originalEvent) {
			const event = originalEvent as CloudFrontRequestEvent;

			const cloudfrontRequest = event.Records[0]!.cf.request;

			const { body: requestBody, headers: eventHeaders, querystring, uri, method, origin } = cloudfrontRequest;

			const headers = new Headers(
				Object.fromEntries(
					Object.entries(eventHeaders).map(([key, value]) => [value[0]?.key ?? key, value[0]?.value]),
				) as HeadersInit,
			);

			const init: RequestInit = {
				body: requestBody ? createRequestBody(method, requestBody.data, requestBody.encoding) : undefined,
				headers,
				method,
				referrer:
					headers.get("referrer") ??
					[origin?.custom?.protocol ?? "https", "://", origin?.custom?.domainName ?? "example.com"].join(""),
			};

			const url = new URL(`${uri}?${decodeURIComponent(querystring)}`, init.referrer);

			const request = new Request(url, init);
			const routeData = app.match(request, { matchNotFound: true });

			if (!routeData) {
				return cloudfrontRequest;
			}

			const ip = headers.get("x-forwarded-for");

			Reflect.set(request, clientAddressSymbol, ip);

			const response = await app.render(request, routeData);
			const fnResponse = await createLambdaEdgeFunctionResponse(app, response, knownBinaryMediaTypes);

			if (logFnResponse) {
				log("function response", JSON.stringify(fnResponse, undefined, 2));
			}

			return fnResponse;
		} else {
			const event = originalEvent as APIGatewayProxyEventV2;

			const {
				body: requestBody,
				cookies,
				headers: eventHeaders,
				isBase64Encoded,
				queryStringParameters = {},
				rawPath,
				requestContext: {
					domainName,
					http: { method },
				},
			} = event;

			const headers = new Headers({
				...eventHeaders,
				cookie: cookies?.join("; ") ?? "",
			});

			const init: RequestInit = {
				body: createRequestBody(method, requestBody, isBase64Encoded),
				headers,
				method,
				referrer: headers.get("referrer") ?? `https://${domainName}`,
			};

			const url = new URL(rawPath, init.referrer);

			Object.entries(queryStringParameters).forEach(([key, value]) => {
				if (value) {
					url.searchParams.set(key, value);
				}
			});

			const request = new Request(url, init);
			const routeData = app.match(request, { matchNotFound: true });

			if (!routeData) {
				return {
					body: "Not found",
					statusCode: 404,
				};
			}

			const ip = headers.get("x-forwarded-for");

			Reflect.set(request, clientAddressSymbol, ip);

			const response = await app.render(request, routeData);
			const fnResponse = await createLambdaFunctionResponse(app, response, knownBinaryMediaTypes);

			if (logFnResponse) {
				log("function response", JSON.stringify(fnResponse, undefined, 2));
			}

			return fnResponse;
		}
	};
