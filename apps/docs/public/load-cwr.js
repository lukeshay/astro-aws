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
	"341397f3-08be-42a7-9f67-b34b7d457199",
	"1.0.0",
	"us-west-2",
	"/cwr.js",
	{
		sessionSampleRate: 0.1,
		identityPoolId: "us-west-2:1571621c-f990-4e9c-88e9-dbb067c679a6",
		endpoint: "https://dataplane.rum.us-west-2.amazonaws.com",
		telemetries: ["performance", "errors", "http"],
		allowCookies: true,
		enableXRay: false,
		signing: true, // If you have a public resource policy and wish to send unsigned requests please set this to false
	},
)
