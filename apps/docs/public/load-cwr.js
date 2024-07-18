;(function (n, i, v, r, s, c, x, z) {
	x = window.AwsRumClient = { q: [], n: n, i: i, v: v, r: r, c: c }
	window[n] = function (c, p) {
		x.q.push({ c: c, p: p })
	}
	z = document.createElement("script")
	z.async = true
	z.src = s
	document.head.insertBefore(z, document.head.getElementsByTagName("script")[0])
})(
	"cwr",
	"fbe0adac-0c2a-4780-9bc3-73e032005599",
	"1.0.0",
	"us-east-1",
	"/cwr.js",
	{
		sessionSampleRate: 1,
		identityPoolId: "us-east-1:a32bcdfa-cf9b-4010-9a9d-790b5d92f52a",
		endpoint: "https://dataplane.rum.us-east-1.amazonaws.com",
		telemetries: ["performance", "errors", "http"],
		allowCookies: true,
		enableXRay: true,
	},
)
