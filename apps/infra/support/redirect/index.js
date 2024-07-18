/* eslint-disable eslint-comments/disable-enable-pair, unicorn/no-abusive-eslint-disable */
/* eslint-disable */

/** @param event {import("aws-lambda").CloudFrontFunctionsEvent}*/
function handler(event) {
	var qs = getURLSearchParams(event.request.querystring)
	return {
		statusCode: 307,
		statusDescription: "Temporary Redirect",
		headers: {
			location: {
				value: "https://www.astro-aws.org" + event.request.uri + qs,
			},
		},
	}
}

/** @param obj {import("aws-lambda").CloudFrontFunctionsEvent["request"]["querystring"]}*/
function getURLSearchParams(obj) {
	var str = []

	for (var param in obj) {
		if (obj[param].multiValue) {
			str.push(
				obj[param].multiValue.map((item) => param + "=" + item.value).join("&"),
			)
		} else if (obj[param].value === "") {
			str.push(param)
		} else {
			str.push(param + "=" + obj[param].value)
		}
	}

	if (str.length) {
		return "?" + str.join("&")
	}

	return ""
}
