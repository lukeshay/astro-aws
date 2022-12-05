import type { App } from "astro/app";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

import type { Args } from "../args.js";
import { log } from "../log.js";

import { createFunctionResponse, createRequestBody } from "./helpers.js";

const clientAddressSymbol = Symbol.for("astro.clientAddress");

export const createHandler =
	(app: App, knownBinaryMediaTypes: Set<string>, { logFnResponse, logFnRequest }: Args): APIGatewayProxyHandlerV2 =>
	async (event) => {
		if (logFnRequest) log("function request", JSON.stringify(event, undefined, 2));

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
		const fnResponse = await createFunctionResponse(app, response, knownBinaryMediaTypes);

		if (logFnResponse) log("function response", JSON.stringify(fnResponse, undefined, 2));

		return fnResponse;
	};
