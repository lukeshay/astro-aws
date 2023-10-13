import { Logger } from "@aws-lambda-powertools/logger"
import { Metrics } from "@aws-lambda-powertools/metrics"
import { Tracer } from "@aws-lambda-powertools/tracer"

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (global.window) {
	throw new Error("@astro-aws/adapter/powertools can only be used in Node.js")
}

/* eslint-disable import/no-mutable-exports */
let logger = new Logger()
let metrics = new Metrics()
let tracer = new Tracer()
/* eslint-enable import/no-mutable-exports */

const setLogger = (newLogger: Logger) => {
	logger = newLogger
}

const setMetrics = (newMetrics: Metrics) => {
	metrics = newMetrics
}

const setTracer = (newTracer: Tracer) => {
	tracer = newTracer
}

export { tracer, metrics, logger, setLogger, setMetrics, setTracer }
