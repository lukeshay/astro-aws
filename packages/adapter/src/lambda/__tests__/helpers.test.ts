import type { App } from "astro/app";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { faker } from "@faker-js/faker";

import { createLambdaFunctionResponse } from "../helpers.js";

const knownBinaryMediaTypes = new Set(["image/png", "image/jpeg"]);

describe("helpers", () => {
	describe("createFunctionResponse", () => {
		let response: Response,
			app: App,
			fnResponse: Awaited<ReturnType<typeof createLambdaFunctionResponse>>,
			body: string,
			headers: Record<string, string>;

		beforeEach(async () => {
			body = faker.datatype.string();
			headers = {
				"content-type": "text/plain",
			};

			response = new Response(body, {
				headers,
				status: 200,
			});

			app = {
				setCookieHeaders: vi.fn(() => []),
			} as unknown as App;

			fnResponse = await createLambdaFunctionResponse(app, response, knownBinaryMediaTypes);
		});

		test("creates function response", () => {
			expect(app.setCookieHeaders).toHaveBeenCalledTimes(1);
			expect(app.setCookieHeaders).toHaveBeenCalledWith(response);

			expect(fnResponse).toStrictEqual({
				body,
				cookies: [],
				headers,
				isBase64Encoded: false,
				statusCode: 200,
			});
		});
	});
});
