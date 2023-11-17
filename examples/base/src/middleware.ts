// eslint-disable-next-line import/no-unresolved
import { defineMiddleware } from "astro:middleware"
import { StatusCodes } from "http-status-codes"

export const onRequest = defineMiddleware(async ({ locals, url }, next) => {
	console.log("Running middleware for base")

	// eslint-disable-next-line no-param-reassign
	locals.title = "Example"
	// eslint-disable-next-line no-param-reassign
	locals.rows = Array.from({ length: 100 }).map((_, i) => i + 1)

	if (
		typeof import.meta.env.DOMAIN === "string" &&
		url.host !== import.meta.env.DOMAIN
	) {
		const redirectUrl = new URL(
			`${url.pathname}${url.search}`,
			import.meta.env.DOMAIN,
		)

		console.log(`Redirecting to ${redirectUrl.toString()}`)

		return Response.redirect(redirectUrl, StatusCodes.PERMANENT_REDIRECT)
	}

	// return a Response or the result of calling `next()`
	return next()
})
