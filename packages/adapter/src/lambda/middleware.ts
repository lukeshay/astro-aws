import { type Handler } from "aws-lambda"

type WithLoggerOptions = {
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
		if (options?.logEvent) {
			console.log("Lambda invocation event", { event })
		}

		let result: TResult

		try {
			// @ts-expect-error - need void
			result = await handler(event, context, callback)
		} catch (error) {
			if (options?.logErrors ?? true) {
				console.log("Lambda invocation error", { error })
			}

			throw error as Error
		}

		if (options?.logResult) {
			console.log("Lambda invocation result", { result })
		}

		return result
	}

export { type WithLoggerOptions, withLogger }
