import { env } from "node:process"

import { pino } from "pino"

export const logger = pino({
	level: env.ASTRO_AWS_LOG_LEVEL ?? "fatal",
})
