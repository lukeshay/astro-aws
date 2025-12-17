import { type Handler } from "aws-lambda"
import { AstroIntegrationLogger } from "astro"

type WithLoggerOptions = {
	logErrors?: boolean
	logEvent?: boolean
	logResult?: boolean
}

const withLogger =
	<TEvent, TResult>(
		logger: AstroIntegrationLogger,
		options: WithLoggerOptions | undefined,
		handler: Handler<TEvent, TResult>,
	): Handler<TEvent, TResult> =>
	async (event, context) => {
		if (options?.logEvent) {
			logger.info(`Lambda invocation event ${JSON.stringify(event)}`)
		}

		let result: TResult

		try {
			// @ts-expect-error - need void
			result = await handler(event, context)
		} catch (error) {
			if (options?.logErrors ?? true) {
				logger.error(`Lambda invocation error ${JSON.stringify(error)}`)
			}

			throw error as Error
		}

		if (options?.logResult) {
			logger.info(`Lambda invocation result ${JSON.stringify(result)}`)
		}

		return result
	}

export { type WithLoggerOptions, withLogger }
