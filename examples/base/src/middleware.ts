// eslint-disable-next-line import/no-unresolved
import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware(async ({ locals }, next) => {
	// eslint-disable-next-line no-param-reassign
	locals.title = "New title"
	// eslint-disable-next-line no-param-reassign
	locals.rows = Array.from({ length: 100 }).map((_, i) => i + 1)

	// return a Response or the result of calling `next()`
	return next()
})
