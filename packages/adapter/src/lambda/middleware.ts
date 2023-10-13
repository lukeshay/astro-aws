import { type Handler } from "aws-lambda"
import { Logger } from "@aws-lambda-powertools/logger"

import { logger, tracer } from "../powertools.js"

type WithTracerOptions = {
	captureResponse?: boolean
}

const withTracer =
	<TEvent, TResult>(
		options: WithTracerOptions | undefined,
		handler: Handler<TEvent, TResult>,
	): Handler<TEvent, TResult> =>
	// eslint-disable-next-line @typescript-eslint/promise-function-async
	(event, context, callback) => {
		if (!tracer.isTracingEnabled()) {
			return handler(event, context, callback)
		}

		return tracer.provider.captureAsyncFunc(
			"### astro-aws",
			async (subsegment) => {
				let result

				try {
					result = await handler(event, context, callback)

					if (options?.captureResponse ?? true) {
						tracer.addResponseAsMetadata(result, "astro-aws")
					}
				} catch (error) {
					tracer.addErrorAsMetadata(error as Error)

					// eslint-disable-next-line @typescript-eslint/no-throw-literal
					throw error
				} finally {
					try {
						subsegment?.close()
					} catch (error) {
						console.warn(
							`Failed to close or serialize segment, ${
								subsegment?.name ?? ""
							}. We are catching the error but data might be lost.`,
							error,
						)
					}
				}

				return result
			},
		) as Promise<TResult>
	}

type WithLoggerOptions = {
	clearState?: boolean
	logErrors?: boolean
	logEvent?: boolean
	logResult?: boolean
}

const withLogger =
	<TEvent, TResult>(
		options: WithLoggerOptions | undefined,
		handler: Handler<TEvent, TResult>,
	): Handler<TEvent, TResult> =>
	async (event, context, callback) => {
		let initialPersistentAttributes = {}

		if (options && options.clearState === true) {
			initialPersistentAttributes = {
				...logger.getPersistentLogAttributes(),
			}
		}

		Logger.injectLambdaContextBefore(logger, event, context, options)

		if (options?.logEvent) {
			logger.info("Lambda invocation event", { event })
		}

		let result: TResult

		try {
			// @ts-expect-error - need void
			result = await handler(event, context, callback)
		} catch (error) {
			if (options?.logErrors ?? true) {
				logger.info("Lambda invocation error", { error })
			}

			throw error as Error
		} finally {
			Logger.injectLambdaContextAfterOrOnError(
				logger,
				initialPersistentAttributes,
				options,
			)
		}

		if (options?.logResult) {
			logger.info("Lambda invocation result", { result })
		}

		return result
	}

export {
	type WithTracerOptions,
	withTracer,
	type WithLoggerOptions,
	withLogger,
}
