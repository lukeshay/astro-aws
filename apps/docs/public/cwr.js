/*! License information can be found in LICENSE and LICENSE-THIRD-PARTY */
!(function () {
	var e = {
			446: function (e, t, n) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.AwsCrc32 = void 0)
				var r = n(655),
					o = n(359),
					i = n(79),
					a = (function () {
						function e() {
							this.crc32 = new i.Crc32()
						}
						return (
							(e.prototype.update = function (e) {
								;(0, o.isEmptyData)(e) ||
									this.crc32.update((0, o.convertToBuffer)(e))
							}),
							(e.prototype.digest = function () {
								return r.__awaiter(this, void 0, void 0, function () {
									return r.__generator(this, function (e) {
										return [2, (0, o.numToUint8)(this.crc32.digest())]
									})
								})
							}),
							(e.prototype.reset = function () {
								this.crc32 = new i.Crc32()
							}),
							e
						)
					})()
				t.AwsCrc32 = a
			},
			79: function (e, t, n) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.AwsCrc32 = t.Crc32 = t.crc32 = void 0)
				var r = n(655),
					o = n(359)
				t.crc32 = function (e) {
					return new i().update(e).digest()
				}
				var i = (function () {
					function e() {
						this.checksum = 4294967295
					}
					return (
						(e.prototype.update = function (e) {
							var t, n
							try {
								for (
									var o = r.__values(e), i = o.next();
									!i.done;
									i = o.next()
								) {
									var s = i.value
									this.checksum =
										(this.checksum >>> 8) ^ a[255 & (this.checksum ^ s)]
								}
							} catch (e) {
								t = { error: e }
							} finally {
								try {
									i && !i.done && (n = o.return) && n.call(o)
								} finally {
									if (t) throw t.error
								}
							}
							return this
						}),
						(e.prototype.digest = function () {
							return (4294967295 ^ this.checksum) >>> 0
						}),
						e
					)
				})()
				t.Crc32 = i
				var a = (0, o.uint32ArrayFrom)([
						0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615,
						3915621685, 2657392035, 249268274, 2044508324, 3772115230,
						2547177864, 162941995, 2125561021, 3887607047, 2428444049,
						498536548, 1789927666, 4089016648, 2227061214, 450548861,
						1843258603, 4107580753, 2211677639, 325883990, 1684777152,
						4251122042, 2321926636, 335633487, 1661365465, 4195302755,
						2366115317, 997073096, 1281953886, 3579855332, 2724688242,
						1006888145, 1258607687, 3524101629, 2768942443, 901097722,
						1119000684, 3686517206, 2898065728, 853044451, 1172266101,
						3705015759, 2882616665, 651767980, 1373503546, 3369554304,
						3218104598, 565507253, 1454621731, 3485111705, 3099436303,
						671266974, 1594198024, 3322730930, 2970347812, 795835527,
						1483230225, 3244367275, 3060149565, 1994146192, 31158534,
						2563907772, 4023717930, 1907459465, 112637215, 2680153253,
						3904427059, 2013776290, 251722036, 2517215374, 3775830040,
						2137656763, 141376813, 2439277719, 3865271297, 1802195444,
						476864866, 2238001368, 4066508878, 1812370925, 453092731,
						2181625025, 4111451223, 1706088902, 314042704, 2344532202,
						4240017532, 1658658271, 366619977, 2362670323, 4224994405,
						1303535960, 984961486, 2747007092, 3569037538, 1256170817,
						1037604311, 2765210733, 3554079995, 1131014506, 879679996,
						2909243462, 3663771856, 1141124467, 855842277, 2852801631,
						3708648649, 1342533948, 654459306, 3188396048, 3373015174,
						1466479909, 544179635, 3110523913, 3462522015, 1591671054,
						702138776, 2966460450, 3352799412, 1504918807, 783551873,
						3082640443, 3233442989, 3988292384, 2596254646, 62317068,
						1957810842, 3939845945, 2647816111, 81470997, 1943803523,
						3814918930, 2489596804, 225274430, 2053790376, 3826175755,
						2466906013, 167816743, 2097651377, 4027552580, 2265490386,
						503444072, 1762050814, 4150417245, 2154129355, 426522225,
						1852507879, 4275313526, 2312317920, 282753626, 1742555852,
						4189708143, 2394877945, 397917763, 1622183637, 3604390888,
						2714866558, 953729732, 1340076626, 3518719985, 2797360999,
						1068828381, 1219638859, 3624741850, 2936675148, 906185462,
						1090812512, 3747672003, 2825379669, 829329135, 1181335161,
						3412177804, 3160834842, 628085408, 1382605366, 3423369109,
						3138078467, 570562233, 1426400815, 3317316542, 2998733608,
						733239954, 1555261956, 3268935591, 3050360625, 752459403,
						1541320221, 2607071920, 3965973030, 1969922972, 40735498,
						2617837225, 3943577151, 1913087877, 83908371, 2512341634,
						3803740692, 2075208622, 213261112, 2463272603, 3855990285,
						2094854071, 198958881, 2262029012, 4057260610, 1759359992,
						534414190, 2176718541, 4139329115, 1873836001, 414664567,
						2282248934, 4279200368, 1711684554, 285281116, 2405801727,
						4167216745, 1634467795, 376229701, 2685067896, 3608007406,
						1308918612, 956543938, 2808555105, 3495958263, 1231636301,
						1047427035, 2932959818, 3654703836, 1088359270, 936918e3,
						2847714899, 3736837829, 1202900863, 817233897, 3183342108,
						3401237130, 1404277552, 615818150, 3134207493, 3453421203,
						1423857449, 601450431, 3009837614, 3294710456, 1567103746,
						711928724, 3020668471, 3272380065, 1510334235, 755167117,
					]),
					s = n(446)
				Object.defineProperty(t, "AwsCrc32", {
					enumerable: !0,
					get: function () {
						return s.AwsCrc32
					},
				})
			},
			229: function (e, t, n) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.convertToBuffer = void 0)
				var r = n(758),
					o =
						"undefined" != typeof Buffer && Buffer.from
							? function (e) {
									return Buffer.from(e, "utf8")
								}
							: r.fromUtf8
				t.convertToBuffer = function (e) {
					return e instanceof Uint8Array
						? e
						: "string" == typeof e
							? o(e)
							: ArrayBuffer.isView(e)
								? new Uint8Array(
										e.buffer,
										e.byteOffset,
										e.byteLength / Uint8Array.BYTES_PER_ELEMENT,
									)
								: new Uint8Array(e)
				}
			},
			359: function (e, t, n) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.uint32ArrayFrom =
						t.numToUint8 =
						t.isEmptyData =
						t.convertToBuffer =
							void 0)
				var r = n(229)
				Object.defineProperty(t, "convertToBuffer", {
					enumerable: !0,
					get: function () {
						return r.convertToBuffer
					},
				})
				var o = n(701)
				Object.defineProperty(t, "isEmptyData", {
					enumerable: !0,
					get: function () {
						return o.isEmptyData
					},
				})
				var i = n(251)
				Object.defineProperty(t, "numToUint8", {
					enumerable: !0,
					get: function () {
						return i.numToUint8
					},
				})
				var a = n(340)
				Object.defineProperty(t, "uint32ArrayFrom", {
					enumerable: !0,
					get: function () {
						return a.uint32ArrayFrom
					},
				})
			},
			701: function (e, t) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.isEmptyData = void 0),
					(t.isEmptyData = function (e) {
						return "string" == typeof e ? 0 === e.length : 0 === e.byteLength
					})
			},
			251: function (e, t) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.numToUint8 = void 0),
					(t.numToUint8 = function (e) {
						return new Uint8Array([
							(4278190080 & e) >> 24,
							(16711680 & e) >> 16,
							(65280 & e) >> 8,
							255 & e,
						])
					})
			},
			340: function (e, t) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.uint32ArrayFrom = void 0),
					(t.uint32ArrayFrom = function (e) {
						if (!Uint32Array.from) {
							for (var t = new Uint32Array(e.length), n = 0; n < e.length; )
								(t[n] = e[n]), (n += 1)
							return t
						}
						return Uint32Array.from(e)
					})
			},
			914: function (e, t, n) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.RawSha256 = void 0)
				var r = n(945),
					o = (function () {
						function e() {
							;(this.state = Int32Array.from(r.INIT)),
								(this.temp = new Int32Array(64)),
								(this.buffer = new Uint8Array(64)),
								(this.bufferLength = 0),
								(this.bytesHashed = 0),
								(this.finished = !1)
						}
						return (
							(e.prototype.update = function (e) {
								if (this.finished)
									throw new Error(
										"Attempted to update an already finished hash.",
									)
								var t = 0,
									n = e.byteLength
								if (
									((this.bytesHashed += n),
									8 * this.bytesHashed > r.MAX_HASHABLE_LENGTH)
								)
									throw new Error("Cannot hash more than 2^53 - 1 bits")
								for (; n > 0; )
									(this.buffer[this.bufferLength++] = e[t++]),
										n--,
										this.bufferLength === r.BLOCK_SIZE &&
											(this.hashBuffer(), (this.bufferLength = 0))
							}),
							(e.prototype.digest = function () {
								if (!this.finished) {
									var e = 8 * this.bytesHashed,
										t = new DataView(
											this.buffer.buffer,
											this.buffer.byteOffset,
											this.buffer.byteLength,
										),
										n = this.bufferLength
									if (
										(t.setUint8(this.bufferLength++, 128),
										n % r.BLOCK_SIZE >= r.BLOCK_SIZE - 8)
									) {
										for (var o = this.bufferLength; o < r.BLOCK_SIZE; o++)
											t.setUint8(o, 0)
										this.hashBuffer(), (this.bufferLength = 0)
									}
									for (o = this.bufferLength; o < r.BLOCK_SIZE - 8; o++)
										t.setUint8(o, 0)
									t.setUint32(r.BLOCK_SIZE - 8, Math.floor(e / 4294967296), !0),
										t.setUint32(r.BLOCK_SIZE - 4, e),
										this.hashBuffer(),
										(this.finished = !0)
								}
								var i = new Uint8Array(r.DIGEST_LENGTH)
								for (o = 0; o < 8; o++)
									(i[4 * o] = (this.state[o] >>> 24) & 255),
										(i[4 * o + 1] = (this.state[o] >>> 16) & 255),
										(i[4 * o + 2] = (this.state[o] >>> 8) & 255),
										(i[4 * o + 3] = (this.state[o] >>> 0) & 255)
								return i
							}),
							(e.prototype.hashBuffer = function () {
								for (
									var e = this.buffer,
										t = this.state,
										n = t[0],
										o = t[1],
										i = t[2],
										a = t[3],
										s = t[4],
										c = t[5],
										u = t[6],
										l = t[7],
										f = 0;
									f < r.BLOCK_SIZE;
									f++
								) {
									if (f < 16)
										this.temp[f] =
											((255 & e[4 * f]) << 24) |
											((255 & e[4 * f + 1]) << 16) |
											((255 & e[4 * f + 2]) << 8) |
											(255 & e[4 * f + 3])
									else {
										var d = this.temp[f - 2],
											h =
												((d >>> 17) | (d << 15)) ^
												((d >>> 19) | (d << 13)) ^
												(d >>> 10),
											p =
												(((d = this.temp[f - 15]) >>> 7) | (d << 25)) ^
												((d >>> 18) | (d << 14)) ^
												(d >>> 3)
										this.temp[f] =
											((h + this.temp[f - 7]) | 0) +
											((p + this.temp[f - 16]) | 0)
									}
									var v =
											((((((s >>> 6) | (s << 26)) ^
												((s >>> 11) | (s << 21)) ^
												((s >>> 25) | (s << 7))) +
												((s & c) ^ (~s & u))) |
												0) +
												((l + ((r.KEY[f] + this.temp[f]) | 0)) | 0)) |
											0,
										y =
											((((n >>> 2) | (n << 30)) ^
												((n >>> 13) | (n << 19)) ^
												((n >>> 22) | (n << 10))) +
												((n & o) ^ (n & i) ^ (o & i))) |
											0
									;(l = u),
										(u = c),
										(c = s),
										(s = (a + v) | 0),
										(a = i),
										(i = o),
										(o = n),
										(n = (v + y) | 0)
								}
								;(t[0] += n),
									(t[1] += o),
									(t[2] += i),
									(t[3] += a),
									(t[4] += s),
									(t[5] += c),
									(t[6] += u),
									(t[7] += l)
							}),
							e
						)
					})()
				t.RawSha256 = o
			},
			945: function (e, t) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.MAX_HASHABLE_LENGTH =
						t.INIT =
						t.KEY =
						t.DIGEST_LENGTH =
						t.BLOCK_SIZE =
							void 0),
					(t.BLOCK_SIZE = 64),
					(t.DIGEST_LENGTH = 32),
					(t.KEY = new Uint32Array([
						1116352408, 1899447441, 3049323471, 3921009573, 961987163,
						1508970993, 2453635748, 2870763221, 3624381080, 310598401,
						607225278, 1426881987, 1925078388, 2162078206, 2614888103,
						3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983,
						1249150122, 1555081692, 1996064986, 2554220882, 2821834349,
						2952996808, 3210313671, 3336571891, 3584528711, 113926993,
						338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700,
						1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
						3259730800, 3345764771, 3516065817, 3600352804, 4094571909,
						275423344, 430227734, 506948616, 659060556, 883997877, 958139571,
						1322822218, 1537002063, 1747873779, 1955562222, 2024104815,
						2227730452, 2361852424, 2428436474, 2756734187, 3204031479,
						3329325298,
					])),
					(t.INIT = [
						1779033703, 3144134277, 1013904242, 2773480762, 1359893119,
						2600822924, 528734635, 1541459225,
					]),
					(t.MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1)
			},
			938: function (e, t, n) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					n(655).__exportStar(n(430), t)
			},
			430: function (e, t, n) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.Sha256 = void 0)
				var r = n(655),
					o = n(945),
					i = n(914),
					a = n(658),
					s = (function () {
						function e(e) {
							if (((this.hash = new i.RawSha256()), e)) {
								this.outer = new i.RawSha256()
								var t = (function (e) {
										var t = (0, a.convertToBuffer)(e)
										if (t.byteLength > o.BLOCK_SIZE) {
											var n = new i.RawSha256()
											n.update(t), (t = n.digest())
										}
										var r = new Uint8Array(o.BLOCK_SIZE)
										return r.set(t), r
									})(e),
									n = new Uint8Array(o.BLOCK_SIZE)
								n.set(t)
								for (var r = 0; r < o.BLOCK_SIZE; r++)
									(t[r] ^= 54), (n[r] ^= 92)
								this.hash.update(t), this.outer.update(n)
								for (r = 0; r < t.byteLength; r++) t[r] = 0
							}
						}
						return (
							(e.prototype.update = function (e) {
								if (!(0, a.isEmptyData)(e) && !this.error)
									try {
										this.hash.update((0, a.convertToBuffer)(e))
									} catch (e) {
										this.error = e
									}
							}),
							(e.prototype.digestSync = function () {
								if (this.error) throw this.error
								return this.outer
									? (this.outer.finished ||
											this.outer.update(this.hash.digest()),
										this.outer.digest())
									: this.hash.digest()
							}),
							(e.prototype.digest = function () {
								return r.__awaiter(this, void 0, void 0, function () {
									return r.__generator(this, function (e) {
										return [2, this.digestSync()]
									})
								})
							}),
							e
						)
					})()
				t.Sha256 = s
			},
			106: function (e, t, n) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.convertToBuffer = void 0)
				var r = n(758),
					o =
						"undefined" != typeof Buffer && Buffer.from
							? function (e) {
									return Buffer.from(e, "utf8")
								}
							: r.fromUtf8
				t.convertToBuffer = function (e) {
					return e instanceof Uint8Array
						? e
						: "string" == typeof e
							? o(e)
							: ArrayBuffer.isView(e)
								? new Uint8Array(
										e.buffer,
										e.byteOffset,
										e.byteLength / Uint8Array.BYTES_PER_ELEMENT,
									)
								: new Uint8Array(e)
				}
			},
			658: function (e, t, n) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.uint32ArrayFrom =
						t.numToUint8 =
						t.isEmptyData =
						t.convertToBuffer =
							void 0)
				var r = n(106)
				Object.defineProperty(t, "convertToBuffer", {
					enumerable: !0,
					get: function () {
						return r.convertToBuffer
					},
				})
				var o = n(304)
				Object.defineProperty(t, "isEmptyData", {
					enumerable: !0,
					get: function () {
						return o.isEmptyData
					},
				})
				var i = n(174)
				Object.defineProperty(t, "numToUint8", {
					enumerable: !0,
					get: function () {
						return i.numToUint8
					},
				})
				var a = n(558)
				Object.defineProperty(t, "uint32ArrayFrom", {
					enumerable: !0,
					get: function () {
						return a.uint32ArrayFrom
					},
				})
			},
			304: function (e, t) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.isEmptyData = void 0),
					(t.isEmptyData = function (e) {
						return "string" == typeof e ? 0 === e.length : 0 === e.byteLength
					})
			},
			174: function (e, t) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.numToUint8 = void 0),
					(t.numToUint8 = function (e) {
						return new Uint8Array([
							(4278190080 & e) >> 24,
							(16711680 & e) >> 16,
							(65280 & e) >> 8,
							255 & e,
						])
					})
			},
			558: function (e, t) {
				"use strict"
				Object.defineProperty(t, "__esModule", { value: !0 }),
					(t.uint32ArrayFrom = void 0),
					(t.uint32ArrayFrom = function (e) {
						if (!Uint32Array.from) {
							for (var t = new Uint32Array(e.length), n = 0; n < e.length; )
								(t[n] = e[n]), (n += 1)
							return t
						}
						return Uint32Array.from(e)
					})
			},
			758: function (e, t, n) {
				"use strict"
				n.r(t),
					n.d(t, {
						fromUtf8: function () {
							return r
						},
						toUtf8: function () {
							return o
						},
					})
				var r = function (e) {
						return "function" == typeof TextEncoder
							? (function (e) {
									return new TextEncoder().encode(e)
								})(e)
							: (function (e) {
									for (var t = [], n = 0, r = e.length; n < r; n++) {
										var o = e.charCodeAt(n)
										if (o < 128) t.push(o)
										else if (o < 2048) t.push((o >> 6) | 192, (63 & o) | 128)
										else if (
											n + 1 < e.length &&
											55296 == (64512 & o) &&
											56320 == (64512 & e.charCodeAt(n + 1))
										) {
											var i =
												65536 + ((1023 & o) << 10) + (1023 & e.charCodeAt(++n))
											t.push(
												(i >> 18) | 240,
												((i >> 12) & 63) | 128,
												((i >> 6) & 63) | 128,
												(63 & i) | 128,
											)
										} else
											t.push(
												(o >> 12) | 224,
												((o >> 6) & 63) | 128,
												(63 & o) | 128,
											)
									}
									return Uint8Array.from(t)
								})(e)
					},
					o = function (e) {
						return "function" == typeof TextDecoder
							? (function (e) {
									return new TextDecoder("utf-8").decode(e)
								})(e)
							: (function (e) {
									for (var t = "", n = 0, r = e.length; n < r; n++) {
										var o = e[n]
										if (o < 128) t += String.fromCharCode(o)
										else if (192 <= o && o < 224) {
											var i = e[++n]
											t += String.fromCharCode(((31 & o) << 6) | (63 & i))
										} else if (240 <= o && o < 365) {
											var a =
												"%" +
												[o, e[++n], e[++n], e[++n]]
													.map(function (e) {
														return e.toString(16)
													})
													.join("%")
											t += decodeURIComponent(a)
										} else
											t += String.fromCharCode(
												((15 & o) << 12) | ((63 & e[++n]) << 6) | (63 & e[++n]),
											)
									}
									return t
								})(e)
					}
			},
			372: function (e) {
				"use strict"
				function t(e) {
					return "function" == typeof e
				}
				var n = console.error.bind(console)
				function r(e, t, n) {
					var r = !!e[t] && e.propertyIsEnumerable(t)
					Object.defineProperty(e, t, {
						configurable: !0,
						enumerable: r,
						writable: !0,
						value: n,
					})
				}
				function o(e) {
					e &&
						e.logger &&
						(t(e.logger)
							? (n = e.logger)
							: n("new logger isn't a function, not replacing"))
				}
				function i(e, o, i) {
					if (e && e[o]) {
						if (!i) return n("no wrapper function"), void n(new Error().stack)
						if (t(e[o]) && t(i)) {
							var a = e[o],
								s = i(a, o)
							return (
								r(s, "__original", a),
								r(s, "__unwrap", function () {
									e[o] === s && r(e, o, a)
								}),
								r(s, "__wrapped", !0),
								r(e, o, s),
								s
							)
						}
						n("original object and wrapper must be functions")
					} else n("no original function " + o + " to wrap")
				}
				function a(e, t) {
					return e && e[t]
						? e[t].__unwrap
							? e[t].__unwrap()
							: void n(
									"no original to unwrap to -- has " +
										t +
										" already been unwrapped?",
								)
						: (n("no function to unwrap."), void n(new Error().stack))
				}
				;(o.wrap = i),
					(o.massWrap = function (e, t, r) {
						if (!e)
							return (
								n("must provide one or more modules to patch"),
								void n(new Error().stack)
							)
						Array.isArray(e) || (e = [e]),
							t && Array.isArray(t)
								? e.forEach(function (e) {
										t.forEach(function (t) {
											i(e, t, r)
										})
									})
								: n("must provide one or more functions to wrap on modules")
					}),
					(o.unwrap = a),
					(o.massUnwrap = function (e, t) {
						if (!e)
							return (
								n("must provide one or more modules to patch"),
								void n(new Error().stack)
							)
						Array.isArray(e) || (e = [e]),
							t && Array.isArray(t)
								? e.forEach(function (e) {
										t.forEach(function (t) {
											a(e, t)
										})
									})
								: n("must provide one or more functions to unwrap on modules")
					}),
					(e.exports = o)
			},
			655: function (e, t, n) {
				"use strict"
				n.r(t),
					n.d(t, {
						__assign: function () {
							return i
						},
						__asyncDelegator: function () {
							return w
						},
						__asyncGenerator: function () {
							return b
						},
						__asyncValues: function () {
							return E
						},
						__await: function () {
							return m
						},
						__awaiter: function () {
							return l
						},
						__classPrivateFieldGet: function () {
							return _
						},
						__classPrivateFieldSet: function () {
							return A
						},
						__createBinding: function () {
							return d
						},
						__decorate: function () {
							return s
						},
						__exportStar: function () {
							return h
						},
						__extends: function () {
							return o
						},
						__generator: function () {
							return f
						},
						__importDefault: function () {
							return C
						},
						__importStar: function () {
							return T
						},
						__makeTemplateObject: function () {
							return S
						},
						__metadata: function () {
							return u
						},
						__param: function () {
							return c
						},
						__read: function () {
							return v
						},
						__rest: function () {
							return a
						},
						__spread: function () {
							return y
						},
						__spreadArrays: function () {
							return g
						},
						__values: function () {
							return p
						},
					})
				var r = function (e, t) {
					return (
						(r =
							Object.setPrototypeOf ||
							({ __proto__: [] } instanceof Array &&
								function (e, t) {
									e.__proto__ = t
								}) ||
							function (e, t) {
								for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
							}),
						r(e, t)
					)
				}
				function o(e, t) {
					function n() {
						this.constructor = e
					}
					r(e, t),
						(e.prototype =
							null === t
								? Object.create(t)
								: ((n.prototype = t.prototype), new n()))
				}
				var i = function () {
					return (
						(i =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						i.apply(this, arguments)
					)
				}
				function a(e, t) {
					var n = {}
					for (var r in e)
						Object.prototype.hasOwnProperty.call(e, r) &&
							t.indexOf(r) < 0 &&
							(n[r] = e[r])
					if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
						var o = 0
						for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
							t.indexOf(r[o]) < 0 &&
								Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
								(n[r[o]] = e[r[o]])
					}
					return n
				}
				function s(e, t, n, r) {
					var o,
						i = arguments.length,
						a =
							i < 3
								? t
								: null === r
									? (r = Object.getOwnPropertyDescriptor(t, n))
									: r
					if (
						"object" == typeof Reflect &&
						"function" == typeof Reflect.decorate
					)
						a = Reflect.decorate(e, t, n, r)
					else
						for (var s = e.length - 1; s >= 0; s--)
							(o = e[s]) &&
								(a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a)
					return i > 3 && a && Object.defineProperty(t, n, a), a
				}
				function c(e, t) {
					return function (n, r) {
						t(n, r, e)
					}
				}
				function u(e, t) {
					if (
						"object" == typeof Reflect &&
						"function" == typeof Reflect.metadata
					)
						return Reflect.metadata(e, t)
				}
				function l(e, t, n, r) {
					return new (n || (n = Promise))(function (o, i) {
						function a(e) {
							try {
								c(r.next(e))
							} catch (e) {
								i(e)
							}
						}
						function s(e) {
							try {
								c(r.throw(e))
							} catch (e) {
								i(e)
							}
						}
						function c(e) {
							var t
							e.done
								? o(e.value)
								: ((t = e.value),
									t instanceof n
										? t
										: new n(function (e) {
												e(t)
											})).then(a, s)
						}
						c((r = r.apply(e, t || [])).next())
					})
				}
				function f(e, t) {
					var n,
						r,
						o,
						i,
						a = {
							label: 0,
							sent: function () {
								if (1 & o[0]) throw o[1]
								return o[1]
							},
							trys: [],
							ops: [],
						}
					return (
						(i = { next: s(0), throw: s(1), return: s(2) }),
						"function" == typeof Symbol &&
							(i[Symbol.iterator] = function () {
								return this
							}),
						i
					)
					function s(i) {
						return function (s) {
							return (function (i) {
								if (n) throw new TypeError("Generator is already executing.")
								for (; a; )
									try {
										if (
											((n = 1),
											r &&
												(o =
													2 & i[0]
														? r.return
														: i[0]
															? r.throw || ((o = r.return) && o.call(r), 0)
															: r.next) &&
												!(o = o.call(r, i[1])).done)
										)
											return o
										switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
											case 0:
											case 1:
												o = i
												break
											case 4:
												return a.label++, { value: i[1], done: !1 }
											case 5:
												a.label++, (r = i[1]), (i = [0])
												continue
											case 7:
												;(i = a.ops.pop()), a.trys.pop()
												continue
											default:
												if (
													!((o = a.trys),
													(o = o.length > 0 && o[o.length - 1]) ||
														(6 !== i[0] && 2 !== i[0]))
												) {
													a = 0
													continue
												}
												if (
													3 === i[0] &&
													(!o || (i[1] > o[0] && i[1] < o[3]))
												) {
													a.label = i[1]
													break
												}
												if (6 === i[0] && a.label < o[1]) {
													;(a.label = o[1]), (o = i)
													break
												}
												if (o && a.label < o[2]) {
													;(a.label = o[2]), a.ops.push(i)
													break
												}
												o[2] && a.ops.pop(), a.trys.pop()
												continue
										}
										i = t.call(e, a)
									} catch (e) {
										;(i = [6, e]), (r = 0)
									} finally {
										n = o = 0
									}
								if (5 & i[0]) throw i[1]
								return { value: i[0] ? i[1] : void 0, done: !0 }
							})([i, s])
						}
					}
				}
				function d(e, t, n, r) {
					void 0 === r && (r = n), (e[r] = t[n])
				}
				function h(e, t) {
					for (var n in e)
						"default" === n || t.hasOwnProperty(n) || (t[n] = e[n])
				}
				function p(e) {
					var t = "function" == typeof Symbol && Symbol.iterator,
						n = t && e[t],
						r = 0
					if (n) return n.call(e)
					if (e && "number" == typeof e.length)
						return {
							next: function () {
								return (
									e && r >= e.length && (e = void 0),
									{ value: e && e[r++], done: !e }
								)
							},
						}
					throw new TypeError(
						t ? "Object is not iterable." : "Symbol.iterator is not defined.",
					)
				}
				function v(e, t) {
					var n = "function" == typeof Symbol && e[Symbol.iterator]
					if (!n) return e
					var r,
						o,
						i = n.call(e),
						a = []
					try {
						for (; (void 0 === t || t-- > 0) && !(r = i.next()).done; )
							a.push(r.value)
					} catch (e) {
						o = { error: e }
					} finally {
						try {
							r && !r.done && (n = i.return) && n.call(i)
						} finally {
							if (o) throw o.error
						}
					}
					return a
				}
				function y() {
					for (var e = [], t = 0; t < arguments.length; t++)
						e = e.concat(v(arguments[t]))
					return e
				}
				function g() {
					for (var e = 0, t = 0, n = arguments.length; t < n; t++)
						e += arguments[t].length
					var r = Array(e),
						o = 0
					for (t = 0; t < n; t++)
						for (var i = arguments[t], a = 0, s = i.length; a < s; a++, o++)
							r[o] = i[a]
					return r
				}
				function m(e) {
					return this instanceof m ? ((this.v = e), this) : new m(e)
				}
				function b(e, t, n) {
					if (!Symbol.asyncIterator)
						throw new TypeError("Symbol.asyncIterator is not defined.")
					var r,
						o = n.apply(e, t || []),
						i = []
					return (
						(r = {}),
						a("next"),
						a("throw"),
						a("return"),
						(r[Symbol.asyncIterator] = function () {
							return this
						}),
						r
					)
					function a(e) {
						o[e] &&
							(r[e] = function (t) {
								return new Promise(function (n, r) {
									i.push([e, t, n, r]) > 1 || s(e, t)
								})
							})
					}
					function s(e, t) {
						try {
							;(n = o[e](t)).value instanceof m
								? Promise.resolve(n.value.v).then(c, u)
								: l(i[0][2], n)
						} catch (e) {
							l(i[0][3], e)
						}
						var n
					}
					function c(e) {
						s("next", e)
					}
					function u(e) {
						s("throw", e)
					}
					function l(e, t) {
						e(t), i.shift(), i.length && s(i[0][0], i[0][1])
					}
				}
				function w(e) {
					var t, n
					return (
						(t = {}),
						r("next"),
						r("throw", function (e) {
							throw e
						}),
						r("return"),
						(t[Symbol.iterator] = function () {
							return this
						}),
						t
					)
					function r(r, o) {
						t[r] = e[r]
							? function (t) {
									return (n = !n)
										? { value: m(e[r](t)), done: "return" === r }
										: o
											? o(t)
											: t
								}
							: o
					}
				}
				function E(e) {
					if (!Symbol.asyncIterator)
						throw new TypeError("Symbol.asyncIterator is not defined.")
					var t,
						n = e[Symbol.asyncIterator]
					return n
						? n.call(e)
						: ((e = p(e)),
							(t = {}),
							r("next"),
							r("throw"),
							r("return"),
							(t[Symbol.asyncIterator] = function () {
								return this
							}),
							t)
					function r(n) {
						t[n] =
							e[n] &&
							function (t) {
								return new Promise(function (r, o) {
									;(function (e, t, n, r) {
										Promise.resolve(r).then(function (t) {
											e({ value: t, done: n })
										}, t)
									})(r, o, (t = e[n](t)).done, t.value)
								})
							}
					}
				}
				function S(e, t) {
					return (
						Object.defineProperty
							? Object.defineProperty(e, "raw", { value: t })
							: (e.raw = t),
						e
					)
				}
				function T(e) {
					if (e && e.__esModule) return e
					var t = {}
					if (null != e)
						for (var n in e) Object.hasOwnProperty.call(e, n) && (t[n] = e[n])
					return (t.default = e), t
				}
				function C(e) {
					return e && e.__esModule ? e : { default: e }
				}
				function _(e, t) {
					if (!t.has(e))
						throw new TypeError(
							"attempted to get private field on non-instance",
						)
					return t.get(e)
				}
				function A(e, t, n) {
					if (!t.has(e))
						throw new TypeError(
							"attempted to set private field on non-instance",
						)
					return t.set(e, n), n
				}
			},
			238: function (e, t, n) {
				var r
				!(function (o, i) {
					"use strict"
					var a = "function",
						s = "undefined",
						c = "object",
						u = "string",
						l = "model",
						f = "name",
						d = "type",
						h = "vendor",
						p = "version",
						v = "architecture",
						y = "console",
						g = "mobile",
						m = "tablet",
						b = "smarttv",
						w = "wearable",
						E = "embedded",
						S = "Amazon",
						T = "Apple",
						C = "ASUS",
						_ = "BlackBerry",
						A = "Firefox",
						O = "Google",
						I = "Huawei",
						P = "LG",
						x = "Microsoft",
						k = "Motorola",
						L = "Opera",
						R = "Samsung",
						j = "Sharp",
						M = "Sony",
						U = "Xiaomi",
						D = "Zebra",
						H = "Facebook",
						q = function (e) {
							for (var t = {}, n = 0; n < e.length; n++)
								t[e[n].toUpperCase()] = e[n]
							return t
						},
						B = function (e, t) {
							return typeof e === u && -1 !== N(t).indexOf(N(e))
						},
						N = function (e) {
							return e.toLowerCase()
						},
						F = function (e, t) {
							if (typeof e === u)
								return (
									(e = e.replace(/^\s\s*/, "")),
									typeof t === s ? e : e.substring(0, 350)
								)
						},
						z = function (e, t) {
							for (var n, r, o, s, u, l, f = 0; f < t.length && !u; ) {
								var d = t[f],
									h = t[f + 1]
								for (n = r = 0; n < d.length && !u; )
									if ((u = d[n++].exec(e)))
										for (o = 0; o < h.length; o++)
											(l = u[++r]),
												typeof (s = h[o]) === c && s.length > 0
													? 2 === s.length
														? typeof s[1] == a
															? (this[s[0]] = s[1].call(this, l))
															: (this[s[0]] = s[1])
														: 3 === s.length
															? typeof s[1] !== a || (s[1].exec && s[1].test)
																? (this[s[0]] = l ? l.replace(s[1], s[2]) : i)
																: (this[s[0]] = l
																		? s[1].call(this, l, s[2])
																		: i)
															: 4 === s.length &&
																(this[s[0]] = l
																	? s[3].call(this, l.replace(s[1], s[2]))
																	: i)
													: (this[s] = l || i)
								f += 2
							}
						},
						$ = function (e, t) {
							for (var n in t)
								if (typeof t[n] === c && t[n].length > 0) {
									for (var r = 0; r < t[n].length; r++)
										if (B(t[n][r], e)) return "?" === n ? i : n
								} else if (B(t[n], e)) return "?" === n ? i : n
							return e
						},
						V = {
							ME: "4.90",
							"NT 3.11": "NT3.51",
							"NT 4.0": "NT4.0",
							2e3: "NT 5.0",
							XP: ["NT 5.1", "NT 5.2"],
							Vista: "NT 6.0",
							7: "NT 6.1",
							8: "NT 6.2",
							8.1: "NT 6.3",
							10: ["NT 6.4", "NT 10.0"],
							RT: "ARM",
						},
						W = {
							browser: [
								[/\b(?:crmo|crios)\/([\w\.]+)/i],
								[p, [f, "Chrome"]],
								[/edg(?:e|ios|a)?\/([\w\.]+)/i],
								[p, [f, "Edge"]],
								[
									/(opera mini)\/([-\w\.]+)/i,
									/(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
									/(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i,
								],
								[f, p],
								[/opios[\/ ]+([\w\.]+)/i],
								[p, [f, "Opera Mini"]],
								[/\bopr\/([\w\.]+)/i],
								[p, [f, L]],
								[
									/(kindle)\/([\w\.]+)/i,
									/(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,
									/(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,
									/(ba?idubrowser)[\/ ]?([\w\.]+)/i,
									/(?:ms|\()(ie) ([\w\.]+)/i,
									/(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
									/(weibo)__([\d\.]+)/i,
								],
								[f, p],
								[/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],
								[p, [f, "UCBrowser"]],
								[
									/microm.+\bqbcore\/([\w\.]+)/i,
									/\bqbcore\/([\w\.]+).+microm/i,
								],
								[p, [f, "WeChat(Win) Desktop"]],
								[/micromessenger\/([\w\.]+)/i],
								[p, [f, "WeChat"]],
								[/konqueror\/([\w\.]+)/i],
								[p, [f, "Konqueror"]],
								[/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],
								[p, [f, "IE"]],
								[/yabrowser\/([\w\.]+)/i],
								[p, [f, "Yandex"]],
								[/(avast|avg)\/([\w\.]+)/i],
								[[f, /(.+)/, "$1 Secure Browser"], p],
								[/\bfocus\/([\w\.]+)/i],
								[p, [f, "Firefox Focus"]],
								[/\bopt\/([\w\.]+)/i],
								[p, [f, "Opera Touch"]],
								[/coc_coc\w+\/([\w\.]+)/i],
								[p, [f, "Coc Coc"]],
								[/dolfin\/([\w\.]+)/i],
								[p, [f, "Dolphin"]],
								[/coast\/([\w\.]+)/i],
								[p, [f, "Opera Coast"]],
								[/miuibrowser\/([\w\.]+)/i],
								[p, [f, "MIUI Browser"]],
								[/fxios\/([-\w\.]+)/i],
								[p, [f, A]],
								[/\bqihu|(qi?ho?o?|360)browser/i],
								[[f, "360 Browser"]],
								[/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i],
								[[f, /(.+)/, "$1 Browser"], p],
								[/(comodo_dragon)\/([\w\.]+)/i],
								[[f, /_/g, " "], p],
								[
									/(electron)\/([\w\.]+) safari/i,
									/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
									/m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i,
								],
								[f, p],
								[
									/(metasr)[\/ ]?([\w\.]+)/i,
									/(lbbrowser)/i,
									/\[(linkedin)app\]/i,
								],
								[f],
								[/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],
								[[f, H], p],
								[
									/safari (line)\/([\w\.]+)/i,
									/\b(line)\/([\w\.]+)\/iab/i,
									/(chromium|instagram)[\/ ]([-\w\.]+)/i,
								],
								[f, p],
								[/\bgsa\/([\w\.]+) .*safari\//i],
								[p, [f, "GSA"]],
								[/headlesschrome(?:\/([\w\.]+)| )/i],
								[p, [f, "Chrome Headless"]],
								[/ wv\).+(chrome)\/([\w\.]+)/i],
								[[f, "Chrome WebView"], p],
								[/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],
								[p, [f, "Android Browser"]],
								[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],
								[f, p],
								[/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i],
								[p, [f, "Mobile Safari"]],
								[/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i],
								[p, f],
								[/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],
								[
									f,
									[
										p,
										$,
										{
											"1.0": "/8",
											1.2: "/1",
											1.3: "/3",
											"2.0": "/412",
											"2.0.2": "/416",
											"2.0.3": "/417",
											"2.0.4": "/419",
											"?": "/",
										},
									],
								],
								[/(webkit|khtml)\/([\w\.]+)/i],
								[f, p],
								[/(navigator|netscape\d?)\/([-\w\.]+)/i],
								[[f, "Netscape"], p],
								[/mobile vr; rv:([\w\.]+)\).+firefox/i],
								[p, [f, "Firefox Reality"]],
								[
									/ekiohf.+(flow)\/([\w\.]+)/i,
									/(swiftfox)/i,
									/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
									/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
									/(firefox)\/([\w\.]+)/i,
									/(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
									/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
									/(links) \(([\w\.]+)/i,
								],
								[f, p],
								[/(cobalt)\/([\w\.]+)/i],
								[f, [p, /master.|lts./, ""]],
							],
							cpu: [
								[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],
								[[v, "amd64"]],
								[/(ia32(?=;))/i],
								[[v, N]],
								[/((?:i[346]|x)86)[;\)]/i],
								[[v, "ia32"]],
								[/\b(aarch64|arm(v?8e?l?|_?64))\b/i],
								[[v, "arm64"]],
								[/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],
								[[v, "armhf"]],
								[/windows (ce|mobile); ppc;/i],
								[[v, "arm"]],
								[/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],
								[[v, /ower/, "", N]],
								[/(sun4\w)[;\)]/i],
								[[v, "sparc"]],
								[
									/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i,
								],
								[[v, N]],
							],
							device: [
								[
									/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i,
								],
								[l, [h, R], [d, m]],
								[
									/\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i,
									/samsung[- ]([-\w]+)/i,
									/sec-(sgh\w+)/i,
								],
								[l, [h, R], [d, g]],
								[/\((ip(?:hone|od)[\w ]*);/i],
								[l, [h, T], [d, g]],
								[
									/\((ipad);[-\w\),; ]+apple/i,
									/applecoremedia\/[\w\.]+ \((ipad)/i,
									/\b(ipad)\d\d?,\d\d?[;\]].+ios/i,
								],
								[l, [h, T], [d, m]],
								[/(macintosh);/i],
								[l, [h, T]],
								[/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],
								[l, [h, I], [d, m]],
								[
									/(?:huawei|honor)([-\w ]+)[;\)]/i,
									/\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i,
								],
								[l, [h, I], [d, g]],
								[
									/\b(poco[\w ]+)(?: bui|\))/i,
									/\b; (\w+) build\/hm\1/i,
									/\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
									/\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
									/\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i,
								],
								[
									[l, /_/g, " "],
									[h, U],
									[d, g],
								],
								[/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i],
								[
									[l, /_/g, " "],
									[h, U],
									[d, m],
								],
								[
									/; (\w+) bui.+ oppo/i,
									/\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i,
								],
								[l, [h, "OPPO"], [d, g]],
								[/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i],
								[l, [h, "Vivo"], [d, g]],
								[/\b(rmx[12]\d{3})(?: bui|;|\))/i],
								[l, [h, "Realme"], [d, g]],
								[
									/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
									/\bmot(?:orola)?[- ](\w*)/i,
									/((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i,
								],
								[l, [h, k], [d, g]],
								[/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
								[l, [h, k], [d, m]],
								[
									/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i,
								],
								[l, [h, P], [d, m]],
								[
									/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
									/\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
									/\blg-?([\d\w]+) bui/i,
								],
								[l, [h, P], [d, g]],
								[
									/(ideatab[-\w ]+)/i,
									/lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i,
								],
								[l, [h, "Lenovo"], [d, m]],
								[
									/(?:maemo|nokia).*(n900|lumia \d+)/i,
									/nokia[-_ ]?([-\w\.]*)/i,
								],
								[
									[l, /_/g, " "],
									[h, "Nokia"],
									[d, g],
								],
								[/(pixel c)\b/i],
								[l, [h, O], [d, m]],
								[/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],
								[l, [h, O], [d, g]],
								[
									/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i,
								],
								[l, [h, M], [d, g]],
								[/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i],
								[
									[l, "Xperia Tablet"],
									[h, M],
									[d, m],
								],
								[
									/ (kb2005|in20[12]5|be20[12][59])\b/i,
									/(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i,
								],
								[l, [h, "OnePlus"], [d, g]],
								[
									/(alexa)webm/i,
									/(kf[a-z]{2}wi)( bui|\))/i,
									/(kf[a-z]+)( bui|\)).+silk\//i,
								],
								[l, [h, S], [d, m]],
								[/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],
								[
									[l, /(.+)/g, "Fire Phone $1"],
									[h, S],
									[d, g],
								],
								[/(playbook);[-\w\),; ]+(rim)/i],
								[l, h, [d, m]],
								[/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i],
								[l, [h, _], [d, g]],
								[
									/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i,
								],
								[l, [h, C], [d, m]],
								[/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
								[l, [h, C], [d, g]],
								[/(nexus 9)/i],
								[l, [h, "HTC"], [d, m]],
								[
									/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
									/(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
									/(alcatel|geeksphone|nexian|panasonic|sony(?!-bra))[-_ ]?([-\w]*)/i,
								],
								[h, [l, /_/g, " "], [d, g]],
								[/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],
								[l, [h, "Acer"], [d, m]],
								[/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i],
								[l, [h, "Meizu"], [d, g]],
								[/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],
								[l, [h, j], [d, g]],
								[
									/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,
									/(hp) ([\w ]+\w)/i,
									/(asus)-?(\w+)/i,
									/(microsoft); (lumia[\w ]+)/i,
									/(lenovo)[-_ ]?([-\w]+)/i,
									/(jolla)/i,
									/(oppo) ?([\w ]+) bui/i,
								],
								[h, l, [d, g]],
								[
									/(archos) (gamepad2?)/i,
									/(hp).+(touchpad(?!.+tablet)|tablet)/i,
									/(kindle)\/([\w\.]+)/i,
									/(nook)[\w ]+build\/(\w+)/i,
									/(dell) (strea[kpr\d ]*[\dko])/i,
									/(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
									/(trinity)[- ]*(t\d{3}) bui/i,
									/(gigaset)[- ]+(q\w{1,9}) bui/i,
									/(vodafone) ([\w ]+)(?:\)| bui)/i,
								],
								[h, l, [d, m]],
								[/(surface duo)/i],
								[l, [h, x], [d, m]],
								[/droid [\d\.]+; (fp\du?)(?: b|\))/i],
								[l, [h, "Fairphone"], [d, g]],
								[/(u304aa)/i],
								[l, [h, "AT&T"], [d, g]],
								[/\bsie-(\w*)/i],
								[l, [h, "Siemens"], [d, g]],
								[/\b(rct\w+) b/i],
								[l, [h, "RCA"], [d, m]],
								[/\b(venue[\d ]{2,7}) b/i],
								[l, [h, "Dell"], [d, m]],
								[/\b(q(?:mv|ta)\w+) b/i],
								[l, [h, "Verizon"], [d, m]],
								[/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],
								[l, [h, "Barnes & Noble"], [d, m]],
								[/\b(tm\d{3}\w+) b/i],
								[l, [h, "NuVision"], [d, m]],
								[/\b(k88) b/i],
								[l, [h, "ZTE"], [d, m]],
								[/\b(nx\d{3}j) b/i],
								[l, [h, "ZTE"], [d, g]],
								[/\b(gen\d{3}) b.+49h/i],
								[l, [h, "Swiss"], [d, g]],
								[/\b(zur\d{3}) b/i],
								[l, [h, "Swiss"], [d, m]],
								[/\b((zeki)?tb.*\b) b/i],
								[l, [h, "Zeki"], [d, m]],
								[/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i],
								[[h, "Dragon Touch"], l, [d, m]],
								[/\b(ns-?\w{0,9}) b/i],
								[l, [h, "Insignia"], [d, m]],
								[/\b((nxa|next)-?\w{0,9}) b/i],
								[l, [h, "NextBook"], [d, m]],
								[/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],
								[[h, "Voice"], l, [d, g]],
								[/\b(lvtel\-)?(v1[12]) b/i],
								[[h, "LvTel"], l, [d, g]],
								[/\b(ph-1) /i],
								[l, [h, "Essential"], [d, g]],
								[/\b(v(100md|700na|7011|917g).*\b) b/i],
								[l, [h, "Envizen"], [d, m]],
								[/\b(trio[-\w\. ]+) b/i],
								[l, [h, "MachSpeed"], [d, m]],
								[/\btu_(1491) b/i],
								[l, [h, "Rotor"], [d, m]],
								[/(shield[\w ]+) b/i],
								[l, [h, "Nvidia"], [d, m]],
								[/(sprint) (\w+)/i],
								[h, l, [d, g]],
								[/(kin\.[onetw]{3})/i],
								[
									[l, /\./g, " "],
									[h, x],
									[d, g],
								],
								[/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
								[l, [h, D], [d, m]],
								[/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
								[l, [h, D], [d, g]],
								[/(ouya)/i, /(nintendo) ([wids3utch]+)/i],
								[h, l, [d, y]],
								[/droid.+; (shield) bui/i],
								[l, [h, "Nvidia"], [d, y]],
								[/(playstation [345portablevi]+)/i],
								[l, [h, M], [d, y]],
								[/\b(xbox(?: one)?(?!; xbox))[\); ]/i],
								[l, [h, x], [d, y]],
								[/smart-tv.+(samsung)/i],
								[h, [d, b]],
								[/hbbtv.+maple;(\d+)/i],
								[
									[l, /^/, "SmartTV"],
									[h, R],
									[d, b],
								],
								[/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],
								[
									[h, P],
									[d, b],
								],
								[/(apple) ?tv/i],
								[h, [l, "Apple TV"], [d, b]],
								[/crkey/i],
								[
									[l, "Chromecast"],
									[h, O],
									[d, b],
								],
								[/droid.+aft(\w)( bui|\))/i],
								[l, [h, S], [d, b]],
								[/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i],
								[l, [h, j], [d, b]],
								[/(bravia[\w ]+)( bui|\))/i],
								[l, [h, M], [d, b]],
								[/(mitv-\w{5}) bui/i],
								[l, [h, U], [d, b]],
								[
									/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
									/hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i,
								],
								[
									[h, F],
									[l, F],
									[d, b],
								],
								[/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],
								[[d, b]],
								[/((pebble))app/i],
								[h, l, [d, w]],
								[/droid.+; (glass) \d/i],
								[l, [h, O], [d, w]],
								[/droid.+; (wt63?0{2,3})\)/i],
								[l, [h, D], [d, w]],
								[/(quest( 2)?)/i],
								[l, [h, H], [d, w]],
								[/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],
								[h, [d, E]],
								[/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i],
								[l, [d, g]],
								[/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],
								[l, [d, m]],
								[/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],
								[[d, m]],
								[
									/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i,
								],
								[[d, g]],
								[/(android[-\w\. ]{0,9});.+buil/i],
								[l, [h, "Generic"]],
							],
							engine: [
								[/windows.+ edge\/([\w\.]+)/i],
								[p, [f, "EdgeHTML"]],
								[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
								[p, [f, "Blink"]],
								[
									/(presto)\/([\w\.]+)/i,
									/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
									/ekioh(flow)\/([\w\.]+)/i,
									/(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
									/(icab)[\/ ]([23]\.[\d\.]+)/i,
								],
								[f, p],
								[/rv\:([\w\.]{1,9})\b.+(gecko)/i],
								[p, f],
							],
							os: [
								[/microsoft (windows) (vista|xp)/i],
								[f, p],
								[
									/(windows) nt 6\.2; (arm)/i,
									/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,
									/(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
								],
								[f, [p, $, V]],
								[/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i],
								[
									[f, "Windows"],
									[p, $, V],
								],
								[
									/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
									/cfnetwork\/.+darwin/i,
								],
								[
									[p, /_/g, "."],
									[f, "iOS"],
								],
								[
									/(mac os x) ?([\w\. ]*)/i,
									/(macintosh|mac_powerpc\b)(?!.+haiku)/i,
								],
								[
									[f, "Mac OS"],
									[p, /_/g, "."],
								],
								[/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i],
								[p, f],
								[
									/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
									/(blackberry)\w*\/([\w\.]*)/i,
									/(tizen|kaios)[\/ ]([\w\.]+)/i,
									/\((series40);/i,
								],
								[f, p],
								[/\(bb(10);/i],
								[p, [f, _]],
								[/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],
								[p, [f, "Symbian"]],
								[
									/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i,
								],
								[p, [f, "Firefox OS"]],
								[/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],
								[p, [f, "webOS"]],
								[/crkey\/([\d\.]+)/i],
								[p, [f, "Chromecast"]],
								[/(cros) [\w]+ ([\w\.]+\w)/i],
								[[f, "Chromium OS"], p],
								[
									/(nintendo|playstation) ([wids345portablevuch]+)/i,
									/(xbox); +xbox ([^\);]+)/i,
									/\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
									/(mint)[\/\(\) ]?(\w*)/i,
									/(mageia|vectorlinux)[; ]/i,
									/([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
									/(hurd|linux) ?([\w\.]*)/i,
									/(gnu) ?([\w\.]*)/i,
									/\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
									/(haiku) (\w+)/i,
								],
								[f, p],
								[/(sunos) ?([\w\.\d]*)/i],
								[[f, "Solaris"], p],
								[
									/((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
									/(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
									/\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i,
									/(unix) ?([\w\.]*)/i,
								],
								[f, p],
							],
						},
						K = function (e, t) {
							if ((typeof e === c && ((t = e), (e = i)), !(this instanceof K)))
								return new K(e, t).getResult()
							var n =
									e ||
									(typeof o !== s && o.navigator && o.navigator.userAgent
										? o.navigator.userAgent
										: ""),
								r = t
									? (function (e, t) {
											var n = {}
											for (var r in e)
												t[r] && t[r].length % 2 == 0
													? (n[r] = t[r].concat(e[r]))
													: (n[r] = e[r])
											return n
										})(W, t)
									: W
							return (
								(this.getBrowser = function () {
									var e,
										t = {}
									return (
										(t.name = i),
										(t.version = i),
										z.call(t, n, r.browser),
										(t.major =
											typeof (e = t.version) === u
												? e.replace(/[^\d\.]/g, "").split(".")[0]
												: i),
										t
									)
								}),
								(this.getCPU = function () {
									var e = {}
									return (e.architecture = i), z.call(e, n, r.cpu), e
								}),
								(this.getDevice = function () {
									var e = {}
									return (
										(e.vendor = i),
										(e.model = i),
										(e.type = i),
										z.call(e, n, r.device),
										e
									)
								}),
								(this.getEngine = function () {
									var e = {}
									return (
										(e.name = i), (e.version = i), z.call(e, n, r.engine), e
									)
								}),
								(this.getOS = function () {
									var e = {}
									return (e.name = i), (e.version = i), z.call(e, n, r.os), e
								}),
								(this.getResult = function () {
									return {
										ua: this.getUA(),
										browser: this.getBrowser(),
										engine: this.getEngine(),
										os: this.getOS(),
										device: this.getDevice(),
										cpu: this.getCPU(),
									}
								}),
								(this.getUA = function () {
									return n
								}),
								(this.setUA = function (e) {
									return (
										(n = typeof e === u && e.length > 350 ? F(e, 350) : e), this
									)
								}),
								this.setUA(n),
								this
							)
						}
					;(K.VERSION = "1.0.33"),
						(K.BROWSER = q([f, p, "major"])),
						(K.CPU = q([v])),
						(K.DEVICE = q([l, h, d, y, g, b, m, w, E])),
						(K.ENGINE = K.OS = q([f, p])),
						typeof t !== s
							? (e.exports && (t = e.exports = K), (t.UAParser = K))
							: n.amdO
								? (r = function () {
										return K
									}.call(t, n, t, e)) === i || (e.exports = r)
								: typeof o !== s && (o.UAParser = K)
					var X = typeof o !== s && (o.jQuery || o.Zepto)
					if (X && !X.ua) {
						var G = new K()
						;(X.ua = G.getResult()),
							(X.ua.get = function () {
								return G.getUA()
							}),
							(X.ua.set = function (e) {
								G.setUA(e)
								var t = G.getResult()
								for (var n in t) X.ua[n] = t[n]
							})
					}
				})("object" == typeof window ? window : this)
			},
		},
		t = {}
	function n(r) {
		var o = t[r]
		if (void 0 !== o) return o.exports
		var i = (t[r] = { exports: {} })
		return e[r].call(i.exports, i, i.exports, n), i.exports
	}
	;(n.amdO = {}),
		(n.d = function (e, t) {
			for (var r in t)
				n.o(t, r) &&
					!n.o(e, r) &&
					Object.defineProperty(e, r, { enumerable: !0, get: t[r] })
		}),
		(n.o = function (e, t) {
			return Object.prototype.hasOwnProperty.call(e, t)
		}),
		(n.r = function (e) {
			"undefined" != typeof Symbol &&
				Symbol.toStringTag &&
				Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
				Object.defineProperty(e, "__esModule", { value: !0 })
		}),
		(function () {
			"use strict"
			var e,
				t = "cwr_c",
				r = "cwr_i",
				o = "cwr_s",
				i = "cwr_u",
				a = "arw-script"
			!(function (e) {
				;(e[(e.HEADER = 0)] = "HEADER"), (e[(e.TRAILER = 1)] = "TRAILER")
			})(e || (e = {}))
			class s {
				constructor(e) {
					;(this.method = e.method || "GET"),
						(this.hostname = e.hostname || "localhost"),
						(this.port = e.port),
						(this.query = e.query || {}),
						(this.headers = e.headers || {}),
						(this.body = e.body),
						(this.protocol = e.protocol
							? ":" !== e.protocol.slice(-1)
								? `${e.protocol}:`
								: e.protocol
							: "https:"),
						(this.path = e.path
							? "/" !== e.path.charAt(0)
								? `/${e.path}`
								: e.path
							: "/"),
						(this.username = e.username),
						(this.password = e.password),
						(this.fragment = e.fragment)
				}
				static isInstance(e) {
					if (!e) return !1
					const t = e
					return (
						"method" in t &&
						"protocol" in t &&
						"hostname" in t &&
						"path" in t &&
						"object" == typeof t.query &&
						"object" == typeof t.headers
					)
				}
				clone() {
					const e = new s({ ...this, headers: { ...this.headers } })
					var t
					return (
						e.query &&
							(e.query =
								((t = e.query),
								Object.keys(t).reduce((e, n) => {
									const r = t[n]
									return { ...e, [n]: Array.isArray(r) ? [...r] : r }
								}, {}))),
						e
					)
				}
			}
			class c {
				constructor(e) {
					;(this.statusCode = e.statusCode),
						(this.reason = e.reason),
						(this.headers = e.headers || {}),
						(this.body = e.body)
				}
				static isInstance(e) {
					if (!e) return !1
					const t = e
					return "number" == typeof t.statusCode && "object" == typeof t.headers
				}
			}
			const u = (e) => encodeURIComponent(e).replace(/[!'()*]/g, l),
				l = (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`
			function f(e) {
				const t = []
				for (let n of Object.keys(e).sort()) {
					const r = e[n]
					if (((n = u(n)), Array.isArray(r)))
						for (let e = 0, o = r.length; e < o; e++) t.push(`${n}=${u(r[e])}`)
					else {
						let e = n
						;(r || "string" == typeof r) && (e += `=${u(r)}`), t.push(e)
					}
				}
				return t.join("&")
			}
			function d() {
				let e =
					arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0
				return new Promise((t, n) => {
					e &&
						setTimeout(() => {
							const t = new Error(`Request did not complete within ${e} ms`)
							;(t.name = "TimeoutError"), n(t)
						}, e)
				})
			}
			class h {
				constructor(e) {
					"function" == typeof e
						? (this.configProvider = e().then((e) => e || {}))
						: ((this.config = e ?? {}),
							(this.configProvider = Promise.resolve(this.config)))
				}
				destroy() {}
				async handle(e) {
					let { abortSignal: t } =
						arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
					this.config || (this.config = await this.configProvider)
					const n = this.config.requestTimeout
					if (null != t && t.aborted) {
						const e = new Error("Request aborted")
						return (e.name = "AbortError"), Promise.reject(e)
					}
					let r = e.path
					const o = f(e.query || {})
					o && (r += `?${o}`), e.fragment && (r += `#${e.fragment}`)
					let i = ""
					if (null != e.username || null != e.password) {
						i = `${e.username ?? ""}:${e.password ?? ""}@`
					}
					const { port: a, method: s } = e,
						u = `${e.protocol}//${i}${e.hostname}${a ? `:${a}` : ""}${r}`,
						l = {
							body: "GET" === s || "HEAD" === s ? void 0 : e.body,
							headers: new Headers(e.headers),
							method: s,
						}
					"undefined" != typeof AbortController && (l.signal = t)
					const h = new Request(u, l),
						p = [
							fetch(h).then((e) => {
								const t = e.headers,
									n = {}
								for (const e of t.entries()) n[e[0]] = e[1]
								return null != e.body
									? {
											response: new c({
												headers: n,
												reason: e.statusText,
												statusCode: e.status,
												body: e.body,
											}),
										}
									: e.blob().then((t) => ({
											response: new c({
												headers: n,
												reason: e.statusText,
												statusCode: e.status,
												body: t,
											}),
										}))
							}),
							d(n),
						]
					return (
						t &&
							p.push(
								new Promise((e, n) => {
									t.onabort = () => {
										const e = new Error("Request aborted")
										;(e.name = "AbortError"), n(e)
									}
								}),
							),
						Promise.race(p)
					)
				}
			}
			const p = {},
				v = new Array(64)
			for (
				let e = 0, t = "A".charCodeAt(0), n = "Z".charCodeAt(0);
				e + t <= n;
				e++
			) {
				const n = String.fromCharCode(e + t)
				;(p[n] = e), (v[e] = n)
			}
			for (
				let e = 0, t = "a".charCodeAt(0), n = "z".charCodeAt(0);
				e + t <= n;
				e++
			) {
				const n = String.fromCharCode(e + t),
					r = e + 26
				;(p[n] = r), (v[r] = n)
			}
			for (let e = 0; e < 10; e++) {
				p[e.toString(10)] = e + 52
				const t = e.toString(10),
					n = e + 52
				;(p[t] = n), (v[n] = t)
			}
			;(p["+"] = 62), (v[62] = "+"), (p["/"] = 63), (v[63] = "/")
			var y,
				g = function (e, t, n, r) {
					return new (n || (n = Promise))(function (o, i) {
						function a(e) {
							try {
								c(r.next(e))
							} catch (e) {
								i(e)
							}
						}
						function s(e) {
							try {
								c(r.throw(e))
							} catch (e) {
								i(e)
							}
						}
						function c(e) {
							var t
							e.done
								? o(e.value)
								: ((t = e.value),
									t instanceof n
										? t
										: new n(function (e) {
												e(t)
											})).then(a, s)
						}
						c((r = r.apply(e, t || [])).next())
					})
				},
				m = function (e, t) {
					var n,
						r,
						o,
						i,
						a = {
							label: 0,
							sent: function () {
								if (1 & o[0]) throw o[1]
								return o[1]
							},
							trys: [],
							ops: [],
						}
					return (
						(i = { next: s(0), throw: s(1), return: s(2) }),
						"function" == typeof Symbol &&
							(i[Symbol.iterator] = function () {
								return this
							}),
						i
					)
					function s(i) {
						return function (s) {
							return (function (i) {
								if (n) throw new TypeError("Generator is already executing.")
								for (; a; )
									try {
										if (
											((n = 1),
											r &&
												(o =
													2 & i[0]
														? r.return
														: i[0]
															? r.throw || ((o = r.return) && o.call(r), 0)
															: r.next) &&
												!(o = o.call(r, i[1])).done)
										)
											return o
										switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
											case 0:
											case 1:
												o = i
												break
											case 4:
												return a.label++, { value: i[1], done: !1 }
											case 5:
												a.label++, (r = i[1]), (i = [0])
												continue
											case 7:
												;(i = a.ops.pop()), a.trys.pop()
												continue
											default:
												if (
													!((o = a.trys),
													(o = o.length > 0 && o[o.length - 1]) ||
														(6 !== i[0] && 2 !== i[0]))
												) {
													a = 0
													continue
												}
												if (
													3 === i[0] &&
													(!o || (i[1] > o[0] && i[1] < o[3]))
												) {
													a.label = i[1]
													break
												}
												if (6 === i[0] && a.label < o[1]) {
													;(a.label = o[1]), (o = i)
													break
												}
												if (o && a.label < o[2]) {
													;(a.label = o[2]), a.ops.push(i)
													break
												}
												o[2] && a.ops.pop(), a.trys.pop()
												continue
										}
										i = t.call(e, a)
									} catch (e) {
										;(i = [6, e]), (r = 0)
									} finally {
										n = o = 0
									}
								if (5 & i[0]) throw i[1]
								return { value: i[0] ? i[1] : void 0, done: !0 }
							})([i, s])
						}
					}
				},
				b = function (e) {
					return g(void 0, void 0, void 0, function () {
						var t
						return m(this, function (n) {
							switch (n.label) {
								case 0:
									return [4, e.body.getReader().read()]
								case 1:
									return (
										(t = n.sent().value),
										[2, JSON.parse(String.fromCharCode.apply(null, t))]
									)
							}
						})
					})
				},
				w = function (e) {
					return g(void 0, void 0, void 0, function () {
						var t
						return m(this, function (n) {
							switch (n.label) {
								case 0:
									return [4, e.body.getReader().read()]
								case 1:
									return (
										(t = n.sent().value),
										[2, String.fromCharCode.apply(null, t)]
									)
							}
						})
					})
				},
				E = function () {
					return (
						(E =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						E.apply(this, arguments)
					)
				},
				S = function (e, t, n, r) {
					return new (n || (n = Promise))(function (o, i) {
						function a(e) {
							try {
								c(r.next(e))
							} catch (e) {
								i(e)
							}
						}
						function s(e) {
							try {
								c(r.throw(e))
							} catch (e) {
								i(e)
							}
						}
						function c(e) {
							var t
							e.done
								? o(e.value)
								: ((t = e.value),
									t instanceof n
										? t
										: new n(function (e) {
												e(t)
											})).then(a, s)
						}
						c((r = r.apply(e, t || [])).next())
					})
				},
				T = function (e, t) {
					var n,
						r,
						o,
						i,
						a = {
							label: 0,
							sent: function () {
								if (1 & o[0]) throw o[1]
								return o[1]
							},
							trys: [],
							ops: [],
						}
					return (
						(i = { next: s(0), throw: s(1), return: s(2) }),
						"function" == typeof Symbol &&
							(i[Symbol.iterator] = function () {
								return this
							}),
						i
					)
					function s(i) {
						return function (s) {
							return (function (i) {
								if (n) throw new TypeError("Generator is already executing.")
								for (; a; )
									try {
										if (
											((n = 1),
											r &&
												(o =
													2 & i[0]
														? r.return
														: i[0]
															? r.throw || ((o = r.return) && o.call(r), 0)
															: r.next) &&
												!(o = o.call(r, i[1])).done)
										)
											return o
										switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
											case 0:
											case 1:
												o = i
												break
											case 4:
												return a.label++, { value: i[1], done: !1 }
											case 5:
												a.label++, (r = i[1]), (i = [0])
												continue
											case 7:
												;(i = a.ops.pop()), a.trys.pop()
												continue
											default:
												if (
													!((o = a.trys),
													(o = o.length > 0 && o[o.length - 1]) ||
														(6 !== i[0] && 2 !== i[0]))
												) {
													a = 0
													continue
												}
												if (
													3 === i[0] &&
													(!o || (i[1] > o[0] && i[1] < o[3]))
												) {
													a.label = i[1]
													break
												}
												if (6 === i[0] && a.label < o[1]) {
													;(a.label = o[1]), (o = i)
													break
												}
												if (o && a.label < o[2]) {
													;(a.label = o[2]), a.ops.push(i)
													break
												}
												o[2] && a.ops.pop(), a.trys.pop()
												continue
										}
										i = t.call(e, a)
									} catch (e) {
										;(i = [6, e]), (r = 0)
									} finally {
										n = o = 0
									}
								if (5 & i[0]) throw i[1]
								return { value: i[0] ? i[1] : void 0, done: !0 }
							})([i, s])
						}
					}
				},
				C = function (e) {
					var t = this
					;(this.assumeRoleWithWebIdentity = function (e) {
						return S(t, void 0, void 0, function () {
							var t, n, r, o, i, a
							return T(this, function (c) {
								switch (c.label) {
									case 0:
										return (
											c.trys.push([0, 3, , 4]),
											(t = E(E({}, e), {
												Action: "AssumeRoleWithWebIdentity",
												Version: "2011-06-15",
											})),
											(n = new URLSearchParams(Object.entries(t)).toString()),
											(r = new s({
												method: "POST",
												headers: {
													"content-type": "application/x-www-form-urlencoded",
													host: this.hostname,
												},
												protocol: "https:",
												hostname: this.hostname,
												body: n,
											})),
											[4, this.fetchRequestHandler.handle(r)]
										)
									case 1:
										return (o = c.sent().response), [4, w(o)]
									case 2:
										return [
											2,
											{
												accessKeyId: (i = c.sent())
													.split("<AccessKeyId>")[1]
													.split("</AccessKeyId>")[0],
												secretAccessKey: i
													.split("<SecretAccessKey>")[1]
													.split("</SecretAccessKey>")[0],
												sessionToken: i
													.split("<SessionToken>")[1]
													.split("</SessionToken>")[0],
												expiration: new Date(
													i.split("<Expiration>")[1].split("</Expiration>")[0],
												),
											},
										]
									case 3:
										throw (
											((a = c.sent()),
											new Error(
												"CWR: Failed to retrieve credentials from STS: ".concat(
													a,
												),
											))
										)
									case 4:
										return [2]
								}
							})
						})
					}),
						(this.hostname = "sts.".concat(e.region, ".amazonaws.com")),
						(this.fetchRequestHandler = e.fetchRequestHandler)
				},
				_ = function (e, t, n, r) {
					return new (n || (n = Promise))(function (o, i) {
						function a(e) {
							try {
								c(r.next(e))
							} catch (e) {
								i(e)
							}
						}
						function s(e) {
							try {
								c(r.throw(e))
							} catch (e) {
								i(e)
							}
						}
						function c(e) {
							var t
							e.done
								? o(e.value)
								: ((t = e.value),
									t instanceof n
										? t
										: new n(function (e) {
												e(t)
											})).then(a, s)
						}
						c((r = r.apply(e, t || [])).next())
					})
				},
				A = function (e, t) {
					var n,
						r,
						o,
						i,
						a = {
							label: 0,
							sent: function () {
								if (1 & o[0]) throw o[1]
								return o[1]
							},
							trys: [],
							ops: [],
						}
					return (
						(i = { next: s(0), throw: s(1), return: s(2) }),
						"function" == typeof Symbol &&
							(i[Symbol.iterator] = function () {
								return this
							}),
						i
					)
					function s(i) {
						return function (s) {
							return (function (i) {
								if (n) throw new TypeError("Generator is already executing.")
								for (; a; )
									try {
										if (
											((n = 1),
											r &&
												(o =
													2 & i[0]
														? r.return
														: i[0]
															? r.throw || ((o = r.return) && o.call(r), 0)
															: r.next) &&
												!(o = o.call(r, i[1])).done)
										)
											return o
										switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
											case 0:
											case 1:
												o = i
												break
											case 4:
												return a.label++, { value: i[1], done: !1 }
											case 5:
												a.label++, (r = i[1]), (i = [0])
												continue
											case 7:
												;(i = a.ops.pop()), a.trys.pop()
												continue
											default:
												if (
													!((o = a.trys),
													(o = o.length > 0 && o[o.length - 1]) ||
														(6 !== i[0] && 2 !== i[0]))
												) {
													a = 0
													continue
												}
												if (
													3 === i[0] &&
													(!o || (i[1] > o[0] && i[1] < o[3]))
												) {
													a.label = i[1]
													break
												}
												if (6 === i[0] && a.label < o[1]) {
													;(a.label = o[1]), (o = i)
													break
												}
												if (o && a.label < o[2]) {
													;(a.label = o[2]), a.ops.push(i)
													break
												}
												o[2] && a.ops.pop(), a.trys.pop()
												continue
										}
										i = t.call(e, a)
									} catch (e) {
										;(i = [6, e]), (r = 0)
									} finally {
										n = o = 0
									}
								if (5 & i[0]) throw i[1]
								return { value: i[0] ? i[1] : void 0, done: !0 }
							})([i, s])
						}
					}
				},
				O = function (e) {
					var t,
						n = this
					;(this.getId = function (e) {
						return _(n, void 0, void 0, function () {
							var t, n, r, o, i, a
							return A(this, function (s) {
								switch (s.label) {
									case 0:
										t = null
										try {
											t = JSON.parse(
												localStorage.getItem(this.identityStorageKey),
											)
										} catch (e) {}
										if (t && t.IdentityId) return [2, Promise.resolve(t)]
										s.label = 1
									case 1:
										return (
											s.trys.push([1, 4, , 5]),
											(n = JSON.stringify(e)),
											(r = this.getHttpRequest(
												"AWSCognitoIdentityService.GetId",
												n,
											)),
											(i = b),
											[4, this.fetchRequestHandler.handle(r)]
										)
									case 2:
										return [4, i.apply(void 0, [s.sent().response])]
									case 3:
										o = s.sent()
										try {
											localStorage.setItem(
												this.identityStorageKey,
												JSON.stringify({ IdentityId: o.IdentityId }),
											)
										} catch (e) {}
										return [2, o]
									case 4:
										throw (
											((a = s.sent()),
											new Error(
												"CWR: Failed to retrieve Cognito identity: ".concat(a),
											))
										)
									case 5:
										return [2]
								}
							})
						})
					}),
						(this.getOpenIdToken = function (e) {
							return _(n, void 0, void 0, function () {
								var t, n, r, o, i
								return A(this, function (a) {
									switch (a.label) {
										case 0:
											return (
												a.trys.push([0, 3, , 4]),
												(t = JSON.stringify(e)),
												(n = this.getHttpRequest(
													"AWSCognitoIdentityService.GetOpenIdToken",
													t,
												)),
												[4, this.fetchRequestHandler.handle(n)]
											)
										case 1:
											return (
												(r = a.sent().response),
												(o = this.validateOpenIdTokenResponse),
												[4, b(r)]
											)
										case 2:
											return [2, o.apply(this, [a.sent()])]
										case 3:
											throw (
												((i = a.sent()),
												localStorage.removeItem(this.identityStorageKey),
												new Error(
													"CWR: Failed to retrieve Cognito OpenId token: ".concat(
														i,
													),
												))
											)
										case 4:
											return [2]
									}
								})
							})
						}),
						(this.getCredentialsForIdentity = function (e) {
							return _(n, void 0, void 0, function () {
								var t, n, r, o, i, a, s, c, u, l
								return A(this, function (f) {
									switch (f.label) {
										case 0:
											return (
												f.trys.push([0, 3, , 4]),
												(t = JSON.stringify({ IdentityId: e })),
												(n = this.getHttpRequest(
													"AWSCognitoIdentityService.GetCredentialsForIdentity",
													t,
												)),
												[4, this.fetchRequestHandler.handle(n)]
											)
										case 1:
											return (
												(r = f.sent().response),
												(u = this.validateCredenentialsResponse),
												[4, b(r)]
											)
										case 2:
											return (
												(o = u.apply(this, [f.sent()])),
												(i = o.AccessKeyId),
												(a = o.Expiration),
												(s = o.SecretKey),
												(c = o.SessionToken),
												[
													2,
													{
														accessKeyId: i,
														secretAccessKey: s,
														sessionToken: c,
														expiration: new Date(1e3 * a),
													},
												]
											)
										case 3:
											throw (
												((l = f.sent()),
												localStorage.removeItem(this.identityStorageKey),
												new Error(
													"CWR: Failed to retrieve credentials for Cognito identity: ".concat(
														l,
													),
												))
											)
										case 4:
											return [2]
									}
								})
							})
						}),
						(this.validateOpenIdTokenResponse = function (e) {
							if ("IdentityId" in e && "Token" in e) return e
							throw e && "__type" in e && "message" in e
								? new Error("".concat(e.__type, ": ").concat(e.message))
								: new Error("Unknown OpenIdToken response")
						}),
						(this.validateCredenentialsResponse = function (e) {
							if ("IdentityId" in e && "Credentials" in e) return e.Credentials
							throw e && "__type" in e && "message" in e
								? new Error("".concat(e.__type, ": ").concat(e.message))
								: new Error("Unknown Credentials response")
						}),
						(this.getHttpRequest = function (e, t) {
							return new s({
								method: "POST",
								headers: {
									"content-type": "application/x-amz-json-1.1",
									"x-amz-target": e,
								},
								protocol: "https:",
								hostname: n.hostname,
								body: t,
							})
						}),
						(this.hostname = "cognito-identity.".concat(
							e.region,
							".amazonaws.com",
						)),
						(this.fetchRequestHandler = e.fetchRequestHandler),
						(this.identityStorageKey = (
							null === (t = e.clientConfig) || void 0 === t
								? void 0
								: t.cookieAttributes.unique
						)
							? "".concat(r, "_").concat(e.applicationId)
							: r)
				},
				I = function () {
					return (
						(I =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						I.apply(this, arguments)
					)
				},
				P = function (e, t, n, r) {
					return new (n || (n = Promise))(function (o, i) {
						function a(e) {
							try {
								c(r.next(e))
							} catch (e) {
								i(e)
							}
						}
						function s(e) {
							try {
								c(r.throw(e))
							} catch (e) {
								i(e)
							}
						}
						function c(e) {
							var t
							e.done
								? o(e.value)
								: ((t = e.value),
									t instanceof n
										? t
										: new n(function (e) {
												e(t)
											})).then(a, s)
						}
						c((r = r.apply(e, t || [])).next())
					})
				},
				x = function (e, t) {
					var n,
						r,
						o,
						i,
						a = {
							label: 0,
							sent: function () {
								if (1 & o[0]) throw o[1]
								return o[1]
							},
							trys: [],
							ops: [],
						}
					return (
						(i = { next: s(0), throw: s(1), return: s(2) }),
						"function" == typeof Symbol &&
							(i[Symbol.iterator] = function () {
								return this
							}),
						i
					)
					function s(i) {
						return function (s) {
							return (function (i) {
								if (n) throw new TypeError("Generator is already executing.")
								for (; a; )
									try {
										if (
											((n = 1),
											r &&
												(o =
													2 & i[0]
														? r.return
														: i[0]
															? r.throw || ((o = r.return) && o.call(r), 0)
															: r.next) &&
												!(o = o.call(r, i[1])).done)
										)
											return o
										switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
											case 0:
											case 1:
												o = i
												break
											case 4:
												return a.label++, { value: i[1], done: !1 }
											case 5:
												a.label++, (r = i[1]), (i = [0])
												continue
											case 7:
												;(i = a.ops.pop()), a.trys.pop()
												continue
											default:
												if (
													!((o = a.trys),
													(o = o.length > 0 && o[o.length - 1]) ||
														(6 !== i[0] && 2 !== i[0]))
												) {
													a = 0
													continue
												}
												if (
													3 === i[0] &&
													(!o || (i[1] > o[0] && i[1] < o[3]))
												) {
													a.label = i[1]
													break
												}
												if (6 === i[0] && a.label < o[1]) {
													;(a.label = o[1]), (o = i)
													break
												}
												if (o && a.label < o[2]) {
													;(a.label = o[2]), a.ops.push(i)
													break
												}
												o[2] && a.ops.pop(), a.trys.pop()
												continue
										}
										i = t.call(e, a)
									} catch (e) {
										;(i = [6, e]), (r = 0)
									} finally {
										n = o = 0
									}
								if (5 & i[0]) throw i[1]
								return { value: i[0] ? i[1] : void 0, done: !0 }
							})([i, s])
						}
					}
				},
				k = (function () {
					function e(e, n) {
						var r = this
						;(this.ChainAnonymousCredentialsProvider = function () {
							return P(r, void 0, void 0, function () {
								return x(this, function (e) {
									return [
										2,
										this.AnonymousCredentialsProvider()
											.catch(this.AnonymousStorageCredentialsProvider)
											.catch(this.AnonymousCognitoCredentialsProvider),
									]
								})
							})
						}),
							(this.AnonymousCredentialsProvider = function () {
								return P(r, void 0, void 0, function () {
									var e = this
									return x(this, function (t) {
										return [
											2,
											new Promise(function (t, n) {
												if (e.renewCredentials()) return n()
												t(e.credentials)
											}),
										]
									})
								})
							}),
							(this.AnonymousStorageCredentialsProvider = function () {
								return P(r, void 0, void 0, function () {
									var e = this
									return x(this, function (t) {
										return [
											2,
											new Promise(function (t, n) {
												var r
												try {
													r = JSON.parse(
														localStorage.getItem(e.credentialStorageKey),
													)
												} catch (e) {
													return n()
												}
												if (
													((e.credentials = I(I({}, r), {
														expiration: new Date(r.expiration),
													})),
													e.renewCredentials())
												)
													return n()
												t(e.credentials)
											}),
										]
									})
								})
							})
						var o = e.identityPoolId.split(":")[0]
						;(this.config = e),
							(this.cognitoIdentityClient = new O({
								fetchRequestHandler: new h(),
								region: o,
								clientConfig: e,
								applicationId: n,
							})),
							(this.credentialStorageKey = this.config.cookieAttributes.unique
								? "".concat(t, "_").concat(n)
								: t)
					}
					return (
						(e.prototype.renewCredentials = function () {
							if (!this.credentials || !this.credentials.expiration) return !0
							var e = new Date(this.credentials.expiration.getTime() - 3e4)
							return new Date() > e
						}),
						e
					)
				})(),
				L =
					((y = function (e, t) {
						return (
							(y =
								Object.setPrototypeOf ||
								({ __proto__: [] } instanceof Array &&
									function (e, t) {
										e.__proto__ = t
									}) ||
								function (e, t) {
									for (var n in t)
										Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
								}),
							y(e, t)
						)
					}),
					function (e, t) {
						if ("function" != typeof t && null !== t)
							throw new TypeError(
								"Class extends value " +
									String(t) +
									" is not a constructor or null",
							)
						function n() {
							this.constructor = e
						}
						y(e, t),
							(e.prototype =
								null === t
									? Object.create(t)
									: ((n.prototype = t.prototype), new n()))
					}),
				R = function (e, t, n, r) {
					return new (n || (n = Promise))(function (o, i) {
						function a(e) {
							try {
								c(r.next(e))
							} catch (e) {
								i(e)
							}
						}
						function s(e) {
							try {
								c(r.throw(e))
							} catch (e) {
								i(e)
							}
						}
						function c(e) {
							var t
							e.done
								? o(e.value)
								: ((t = e.value),
									t instanceof n
										? t
										: new n(function (e) {
												e(t)
											})).then(a, s)
						}
						c((r = r.apply(e, t || [])).next())
					})
				},
				j = function (e, t) {
					var n,
						r,
						o,
						i,
						a = {
							label: 0,
							sent: function () {
								if (1 & o[0]) throw o[1]
								return o[1]
							},
							trys: [],
							ops: [],
						}
					return (
						(i = { next: s(0), throw: s(1), return: s(2) }),
						"function" == typeof Symbol &&
							(i[Symbol.iterator] = function () {
								return this
							}),
						i
					)
					function s(i) {
						return function (s) {
							return (function (i) {
								if (n) throw new TypeError("Generator is already executing.")
								for (; a; )
									try {
										if (
											((n = 1),
											r &&
												(o =
													2 & i[0]
														? r.return
														: i[0]
															? r.throw || ((o = r.return) && o.call(r), 0)
															: r.next) &&
												!(o = o.call(r, i[1])).done)
										)
											return o
										switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
											case 0:
											case 1:
												o = i
												break
											case 4:
												return a.label++, { value: i[1], done: !1 }
											case 5:
												a.label++, (r = i[1]), (i = [0])
												continue
											case 7:
												;(i = a.ops.pop()), a.trys.pop()
												continue
											default:
												if (
													!((o = a.trys),
													(o = o.length > 0 && o[o.length - 1]) ||
														(6 !== i[0] && 2 !== i[0]))
												) {
													a = 0
													continue
												}
												if (
													3 === i[0] &&
													(!o || (i[1] > o[0] && i[1] < o[3]))
												) {
													a.label = i[1]
													break
												}
												if (6 === i[0] && a.label < o[1]) {
													;(a.label = o[1]), (o = i)
													break
												}
												if (o && a.label < o[2]) {
													;(a.label = o[2]), a.ops.push(i)
													break
												}
												o[2] && a.ops.pop(), a.trys.pop()
												continue
										}
										i = t.call(e, a)
									} catch (e) {
										;(i = [6, e]), (r = 0)
									} finally {
										n = o = 0
									}
								if (5 & i[0]) throw i[1]
								return { value: i[0] ? i[1] : void 0, done: !0 }
							})([i, s])
						}
					}
				},
				M = (function (e) {
					function t(t, n) {
						var r = e.call(this, t, n) || this
						r.AnonymousCognitoCredentialsProvider = function () {
							return R(r, void 0, void 0, function () {
								var e, t, n, r, o
								return j(this, function (i) {
									switch (i.label) {
										case 0:
											;(e = 1), (i.label = 1)
										case 1:
											0, (i.label = 2)
										case 2:
											return (
												i.trys.push([2, 6, , 7]),
												[
													4,
													this.cognitoIdentityClient.getId({
														IdentityPoolId: this.config.identityPoolId,
													}),
												]
											)
										case 3:
											return (
												(t = i.sent()),
												[4, this.cognitoIdentityClient.getOpenIdToken(t)]
											)
										case 4:
											return (
												(n = i.sent()),
												[
													4,
													this.stsClient.assumeRoleWithWebIdentity({
														RoleArn: this.config.guestRoleArn,
														RoleSessionName: "cwr",
														WebIdentityToken: n.Token,
													}),
												]
											)
										case 5:
											;(r = i.sent()), (this.credentials = r)
											try {
												localStorage.setItem(
													this.credentialStorageKey,
													JSON.stringify(r),
												)
											} catch (e) {}
											return [2, r]
										case 6:
											if (((o = i.sent()), !e)) throw o
											return e--, [3, 7]
										case 7:
											return [3, 1]
										case 8:
											return [2]
									}
								})
							})
						}
						var o = t.identityPoolId.split(":")[0]
						return (
							(r.stsClient = new C({
								fetchRequestHandler: new h(),
								region: o,
							})),
							r
						)
					}
					return L(t, e), t
				})(k),
				U = (function () {
					var e = function (t, n) {
						return (
							(e =
								Object.setPrototypeOf ||
								({ __proto__: [] } instanceof Array &&
									function (e, t) {
										e.__proto__ = t
									}) ||
								function (e, t) {
									for (var n in t)
										Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
								}),
							e(t, n)
						)
					}
					return function (t, n) {
						if ("function" != typeof n && null !== n)
							throw new TypeError(
								"Class extends value " +
									String(n) +
									" is not a constructor or null",
							)
						function r() {
							this.constructor = t
						}
						e(t, n),
							(t.prototype =
								null === n
									? Object.create(n)
									: ((r.prototype = n.prototype), new r()))
					}
				})(),
				D = function (e, t, n, r) {
					return new (n || (n = Promise))(function (o, i) {
						function a(e) {
							try {
								c(r.next(e))
							} catch (e) {
								i(e)
							}
						}
						function s(e) {
							try {
								c(r.throw(e))
							} catch (e) {
								i(e)
							}
						}
						function c(e) {
							var t
							e.done
								? o(e.value)
								: ((t = e.value),
									t instanceof n
										? t
										: new n(function (e) {
												e(t)
											})).then(a, s)
						}
						c((r = r.apply(e, t || [])).next())
					})
				},
				H = function (e, t) {
					var n,
						r,
						o,
						i,
						a = {
							label: 0,
							sent: function () {
								if (1 & o[0]) throw o[1]
								return o[1]
							},
							trys: [],
							ops: [],
						}
					return (
						(i = { next: s(0), throw: s(1), return: s(2) }),
						"function" == typeof Symbol &&
							(i[Symbol.iterator] = function () {
								return this
							}),
						i
					)
					function s(i) {
						return function (s) {
							return (function (i) {
								if (n) throw new TypeError("Generator is already executing.")
								for (; a; )
									try {
										if (
											((n = 1),
											r &&
												(o =
													2 & i[0]
														? r.return
														: i[0]
															? r.throw || ((o = r.return) && o.call(r), 0)
															: r.next) &&
												!(o = o.call(r, i[1])).done)
										)
											return o
										switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
											case 0:
											case 1:
												o = i
												break
											case 4:
												return a.label++, { value: i[1], done: !1 }
											case 5:
												a.label++, (r = i[1]), (i = [0])
												continue
											case 7:
												;(i = a.ops.pop()), a.trys.pop()
												continue
											default:
												if (
													!((o = a.trys),
													(o = o.length > 0 && o[o.length - 1]) ||
														(6 !== i[0] && 2 !== i[0]))
												) {
													a = 0
													continue
												}
												if (
													3 === i[0] &&
													(!o || (i[1] > o[0] && i[1] < o[3]))
												) {
													a.label = i[1]
													break
												}
												if (6 === i[0] && a.label < o[1]) {
													;(a.label = o[1]), (o = i)
													break
												}
												if (o && a.label < o[2]) {
													;(a.label = o[2]), a.ops.push(i)
													break
												}
												o[2] && a.ops.pop(), a.trys.pop()
												continue
										}
										i = t.call(e, a)
									} catch (e) {
										;(i = [6, e]), (r = 0)
									} finally {
										n = o = 0
									}
								if (5 & i[0]) throw i[1]
								return { value: i[0] ? i[1] : void 0, done: !0 }
							})([i, s])
						}
					}
				},
				q = (function (e) {
					function t(t, n) {
						var r = e.call(this, t, n) || this
						return (
							(r.AnonymousCognitoCredentialsProvider = function () {
								return D(r, void 0, void 0, function () {
									var e, t, n, r
									return H(this, function (o) {
										switch (o.label) {
											case 0:
												;(e = 1), (o.label = 1)
											case 1:
												0, (o.label = 2)
											case 2:
												return (
													o.trys.push([2, 5, , 6]),
													[
														4,
														this.cognitoIdentityClient.getId({
															IdentityPoolId: this.config.identityPoolId,
														}),
													]
												)
											case 3:
												return (
													(t = o.sent()),
													[
														4,
														this.cognitoIdentityClient.getCredentialsForIdentity(
															t.IdentityId,
														),
													]
												)
											case 4:
												;(n = o.sent()), (this.credentials = n)
												try {
													localStorage.setItem(
														this.credentialStorageKey,
														JSON.stringify(n),
													)
												} catch (e) {}
												return [2, n]
											case 5:
												if (((r = o.sent()), !e)) throw r
												return e--, [3, 6]
											case 6:
												return [3, 1]
											case 7:
												return [2]
										}
									})
								})
							}),
							r
						)
					}
					return U(t, e), t
				})(k),
				B = "com.amazon.rum",
				N = "".concat(B, ".http_event"),
				F = "".concat(B, ".xray_trace_event"),
				z = "".concat(B, ".largest_contentful_paint_event"),
				$ = "".concat(B, ".first_input_delay_event"),
				V = "".concat(B, ".cumulative_layout_shift_event"),
				W = "".concat(B, ".performance_navigation_event"),
				K = "".concat(B, ".performance_resource_event"),
				X = "".concat(B, ".dom_event"),
				G = "".concat(B, ".js_error_event"),
				Z = "".concat(B, ".page_view_event"),
				J =
					("".concat(B, ".session_start_event"),
					"".concat(B, ".time_to_interactive_event"),
					(function () {
						function e(t) {
							;(this.enabled = !0), (this.pluginId = e.generatePluginId(t))
						}
						return (
							(e.generatePluginId = function (t) {
								return "".concat(e.idPrefix, ".").concat(t)
							}),
							(e.prototype.load = function (e) {
								var t
								;(this.context = e),
									null === (t = this.onload) || void 0 === t || t.call(this)
							}),
							(e.prototype.getPluginId = function () {
								return this.pluginId
							}),
							(e.idPrefix = "com.amazonaws.rum"),
							e
						)
					})()),
				Y = (function () {
					function e(e) {
						;(this.context = e), (this.plugins = new Map())
					}
					return (
						(e.prototype.addPlugin = function (e) {
							var t = e.getPluginId()
							if (this.hasPlugin(t))
								throw new Error(
									'Plugin "'.concat(
										t,
										'" already defined in the PluginManager',
									),
								)
							this.plugins.set(t, e), e.load(this.context)
						}),
						(e.prototype.updatePlugin = function (e, t) {
							var n,
								r = this.getPlugin(e)
							null === (n = null == r ? void 0 : r.update) ||
								void 0 === n ||
								n.call(r, t)
						}),
						(e.prototype.enable = function () {
							this.plugins.forEach(function (e) {
								return e.enable()
							})
						}),
						(e.prototype.disable = function () {
							this.plugins.forEach(function (e) {
								return e.disable()
							})
						}),
						(e.prototype.hasPlugin = function (e) {
							return Boolean(this.getPlugin(e))
						}),
						(e.prototype.record = function (e, t) {
							var n = this.getPlugin(e)
							if (!((null == n ? void 0 : n.record) instanceof Function))
								throw new Error("AWS RUM Client record: Invalid plugin ID")
							n.record(t)
						}),
						(e.prototype.getPlugin = function (e) {
							var t
							return null !== (t = this.plugins.get(e)) && void 0 !== t
								? t
								: this.plugins.get(J.generatePluginId(e))
						}),
						e
					)
				})(),
				Q = (function () {
					var e = function (t, n) {
						return (
							(e =
								Object.setPrototypeOf ||
								({ __proto__: [] } instanceof Array &&
									function (e, t) {
										e.__proto__ = t
									}) ||
								function (e, t) {
									for (var n in t)
										Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
								}),
							e(t, n)
						)
					}
					return function (t, n) {
						if ("function" != typeof n && null !== n)
							throw new TypeError(
								"Class extends value " +
									String(n) +
									" is not a constructor or null",
							)
						function r() {
							this.constructor = t
						}
						e(t, n),
							(t.prototype =
								null === n
									? Object.create(n)
									: ((r.prototype = n.prototype), new r()))
					}
				})(),
				ee = function () {
					return (
						(ee =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						ee.apply(this, arguments)
					)
				},
				te = "dom-event",
				ne = {
					interactionId: function () {
						return ""
					},
					enableMutationObserver: !1,
					events: [],
				},
				re = (function (e) {
					function t(t) {
						var n = e.call(this, te) || this
						return (
							(n.enabled = !1),
							(n.eventListenerMap = new Map()),
							(n.config = ee(ee({}, ne), t)),
							n
						)
					}
					return (
						Q(t, e),
						(t.getElementInfo = function (e) {
							var t = { name: "UNKNOWN" }
							return (
								e.target instanceof Node && (t.name = e.target.nodeName),
								e.target instanceof Element &&
									e.target.id &&
									(t.id = e.target.id),
								t
							)
						}),
						(t.prototype.enable = function () {
							var e = this
							"complete" === document.readyState
								? this.enabled ||
									(this.addListeners(),
									this.config.enableMutationObserver &&
										this.observeDOMMutation(),
									(this.enabled = !0))
								: window.addEventListener("load", function () {
										return e.enable()
									})
						}),
						(t.prototype.disable = function () {
							this.enabled &&
								(this.removeListeners(),
								this.observer && this.observer.disconnect(),
								(this.enabled = !1))
						}),
						(t.prototype.update = function (e) {
							var t = this
							e.forEach(function (e) {
								t.addEventHandler(e), t.config.events.push(e)
							})
						}),
						(t.prototype.onload = function () {
							this.enable()
						}),
						(t.prototype.removeListeners = function () {
							var e = this
							this.config.events.forEach(function (t) {
								return e.removeEventHandler(t)
							})
						}),
						(t.prototype.addListeners = function () {
							var e = this
							this.config.events.forEach(function (t) {
								return e.addEventHandler(t)
							})
						}),
						(t.prototype.getEventListener = function (e) {
							var n = this
							return function (r) {
								var o,
									i = t.getElementInfo(r),
									a = n.config.interactionId(r),
									s = ee(
										ee(
											ee(
												{ version: "1.1.0", event: r.type, element: i.name },
												i.id ? { elementId: i.id } : {},
											),
											a ? { interactionId: a } : {},
										),
										e ? { cssLocator: e } : {},
									)
								;(null === (o = n.context) || void 0 === o
									? void 0
									: o.record) && n.context.record(X, s)
							}
						}),
						(t.prototype.addEventHandler = function (e) {
							var t = e.event,
								n = this.getEventListener(e.cssLocator),
								r = [],
								o = this.eventListenerMap.has(e)
									? this.eventListenerMap.get(e)
									: []
							if (e.cssLocator)
								document.querySelectorAll(e.cssLocator).forEach(function (e) {
									r.push(e)
								})
							else if (e.elementId) {
								var i = document.getElementById(e.elementId)
								i && r.push(i)
							} else e.element && r.push(e.element)
							r.forEach(function (e) {
								e.addEventListener(t, n),
									o.push({ element: e, eventListener: n })
							}),
								this.eventListenerMap.set(e, o)
						}),
						(t.prototype.removeEventHandler = function (e) {
							var t = this.eventListenerMap.get(e)
							t &&
								(t.forEach(function (t) {
									var n = t.element,
										r = t.eventListener
									n.removeEventListener(e.event, r)
								}),
								this.eventListenerMap.delete(e))
						}),
						(t.prototype.observeDOMMutation = function () {
							var e = this
							;(this.observer = new MutationObserver(function () {
								e.removeListeners(), e.addListeners()
							})),
								this.observer.observe(document, { childList: !0, subtree: !0 })
						}),
						t
					)
				})(J),
				oe = function (e) {
					return e !== Object(e) && null != e
				},
				ie = function (e, t) {
					var n = (function (e) {
							var t = {
								version: "1.0.0",
								type: "undefined",
								message: "undefined",
							}
							return (
								void 0 !== e.type && (t.type = e.type),
								void 0 !== e.message && (t.message = e.message),
								void 0 !== e.filename && (t.filename = e.filename),
								void 0 !== e.lineno && (t.lineno = e.lineno),
								void 0 !== e.colno && (t.colno = e.colno),
								t
							)
						})(e),
						r = e.error
					return (
						!(function (e) {
							var t = typeof e
							return ("object" === t || "function" === t) && !!e
						})(r)
							? oe(r) &&
								(function (e, t) {
									"unhandledrejection" !== e.type && (e.type = t.toString()),
										(e.message = t.toString())
								})(n, r)
							: (function (e, t, n) {
									t.name && (e.type = t.name),
										t.message && (e.message = t.message),
										t.fileName && (e.filename = t.fileName),
										t.lineNumber && (e.lineno = t.lineNumber),
										t.columnNumber && (e.colno = t.columnNumber),
										n &&
											t.stack &&
											(e.stack =
												t.stack.length > n
													? t.stack.substring(0, n) + "..."
													: t.stack)
								})(n, r, t),
						n
					)
				},
				ae = (function () {
					var e = function (t, n) {
						return (
							(e =
								Object.setPrototypeOf ||
								({ __proto__: [] } instanceof Array &&
									function (e, t) {
										e.__proto__ = t
									}) ||
								function (e, t) {
									for (var n in t)
										Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
								}),
							e(t, n)
						)
					}
					return function (t, n) {
						if ("function" != typeof n && null !== n)
							throw new TypeError(
								"Class extends value " +
									String(n) +
									" is not a constructor or null",
							)
						function r() {
							this.constructor = t
						}
						e(t, n),
							(t.prototype =
								null === n
									? Object.create(n)
									: ((r.prototype = n.prototype), new r()))
					}
				})(),
				se = function () {
					return (
						(se =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						se.apply(this, arguments)
					)
				},
				ce = "js-error",
				ue = {
					stackTraceLength: 1e3,
					ignore: function () {
						return !1
					},
				},
				le = (function (e) {
					function t(t) {
						var n = e.call(this, ce) || this
						return (
							(n.eventHandler = function (e) {
								n.config.ignore(e) || n.recordJsErrorEvent(e)
							}),
							(n.promiseRejectEventHandler = function (e) {
								n.config.ignore(e) ||
									n.recordJsErrorEvent({ type: e.type, error: e.reason })
							}),
							(n.config = se(se({}, ue), t)),
							n
						)
					}
					return (
						ae(t, e),
						(t.prototype.enable = function () {
							this.enabled || (this.addEventHandler(), (this.enabled = !0))
						}),
						(t.prototype.disable = function () {
							this.enabled && (this.removeEventHandler(), (this.enabled = !1))
						}),
						(t.prototype.record = function (e) {
							e instanceof ErrorEvent
								? this.recordJsErrorEvent(e)
								: this.recordJsErrorEvent({ type: "error", error: e })
						}),
						(t.prototype.onload = function () {
							this.addEventHandler()
						}),
						(t.prototype.recordJsErrorEvent = function (e) {
							var t
							null === (t = this.context) ||
								void 0 === t ||
								t.record(G, ie(e, this.config.stackTraceLength))
						}),
						(t.prototype.addEventHandler = function () {
							window.addEventListener("error", this.eventHandler),
								window.addEventListener(
									"unhandledrejection",
									this.promiseRejectEventHandler,
								)
						}),
						(t.prototype.removeEventHandler = function () {
							window.removeEventListener("error", this.eventHandler),
								window.removeEventListener(
									"unhandledrejection",
									this.promiseRejectEventHandler,
								)
						}),
						t
					)
				})(J),
				fe = function (e, t, n, r, o) {
					var i = e + "="
					;(i += t || ""),
						void 0 !== o
							? (i += "; Expires=".concat(o.toUTCString()))
							: void 0 !== r && (i += "; Expires=".concat(de(r).toUTCString())),
						(i += "; Domain=".concat(n.domain)),
						(i += "; Path=".concat(n.path)),
						(i += "; SameSite=".concat(n.sameSite)),
						(i += n.secure ? "; Secure" : ""),
						(document.cookie = i)
				},
				de = function (e) {
					return new Date(new Date().getTime() + 1e3 * e)
				},
				he = function (e) {
					for (var t = 0, n = document.cookie.split("; "); t < n.length; t++) {
						var r = n[t].split("=")
						if (r[0] === e) return r[1]
					}
					return ""
				}
			var pe = {
				randomUUID:
					"undefined" != typeof crypto &&
					crypto.randomUUID &&
					crypto.randomUUID.bind(crypto),
			}
			let ve
			const ye = new Uint8Array(16)
			function ge() {
				if (
					!ve &&
					((ve =
						"undefined" != typeof crypto &&
						crypto.getRandomValues &&
						crypto.getRandomValues.bind(crypto)),
					!ve)
				)
					throw new Error(
						"crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported",
					)
				return ve(ye)
			}
			const me = []
			for (let e = 0; e < 256; ++e) me.push((e + 256).toString(16).slice(1))
			function be(e, t = 0) {
				return (
					me[e[t + 0]] +
					me[e[t + 1]] +
					me[e[t + 2]] +
					me[e[t + 3]] +
					"-" +
					me[e[t + 4]] +
					me[e[t + 5]] +
					"-" +
					me[e[t + 6]] +
					me[e[t + 7]] +
					"-" +
					me[e[t + 8]] +
					me[e[t + 9]] +
					"-" +
					me[e[t + 10]] +
					me[e[t + 11]] +
					me[e[t + 12]] +
					me[e[t + 13]] +
					me[e[t + 14]] +
					me[e[t + 15]]
				).toLowerCase()
			}
			var we,
				Ee = function (e, t, n) {
					if (pe.randomUUID && !t && !e) return pe.randomUUID()
					const r = (e = e || {}).random || (e.rng || ge)()
					if (((r[6] = (15 & r[6]) | 64), (r[8] = (63 & r[8]) | 128), t)) {
						n = n || 0
						for (let e = 0; e < 16; ++e) t[n + e] = r[e]
						return t
					}
					return be(r)
				},
				Se = n(238),
				Te = function () {
					return (
						(Te =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						Te.apply(this, arguments)
					)
				},
				Ce = "00000000-0000-0000-0000-000000000000",
				_e = "unknown",
				Ae = (function () {
					function e(e, t, n, r) {
						;(this.appMonitorDetails = e),
							(this.config = t),
							(this.record = n),
							(this.pageManager = r),
							(this.sessionCookieName = this.config.cookieAttributes.unique
								? "".concat(o, "_").concat(this.appMonitorDetails.id)
								: o),
							(this.session = {
								sessionId: Ce,
								record: this.sample(),
								eventCount: 0,
							}),
							this.initializeUser(),
							this.collectAttributes(),
							this.addSessionAttributes(this.config.sessionAttributes),
							this.getSessionFromCookie()
					}
					return (
						(e.prototype.isSampled = function () {
							return this.session.record
						}),
						(e.prototype.getSession = function () {
							return (
								(this.session.sessionId === Ce ||
									(this.session.sessionId !== Ce &&
										new Date() > this.sessionExpiry)) &&
									this.createSession(),
								this.session
							)
						}),
						(e.prototype.getAttributes = function () {
							return this.attributes
						}),
						(e.prototype.addSessionAttributes = function (e) {
							this.attributes = Te(Te({}, this.attributes), e)
						}),
						(e.prototype.getUserId = function () {
							return this.useCookies() ? this.userId : Ce
						}),
						(e.prototype.incrementSessionEventCount = function () {
							this.session.eventCount++, this.renewSession()
						}),
						(e.prototype.initializeUser = function () {
							var e = ""
							;(this.userExpiry = new Date()),
								this.userExpiry.setDate(
									this.userExpiry.getDate() + this.config.userIdRetentionDays,
								),
								this.config.userIdRetentionDays <= 0
									? (this.userId = "00000000-0000-0000-0000-000000000000")
									: this.useCookies()
										? ((e = this.getUserIdCookie()),
											(this.userId = e || Ee()),
											this.createOrRenewUserCookie(e, this.userExpiry))
										: (this.userId = Ee())
						}),
						(e.prototype.createOrRenewSessionCookie = function (e, t) {
							btoa &&
								fe(
									this.sessionCookieName,
									btoa(JSON.stringify(e)),
									this.config.cookieAttributes,
									void 0,
									t,
								)
						}),
						(e.prototype.createOrRenewUserCookie = function (e, t) {
							fe(i, e, this.config.cookieAttributes, void 0, t)
						}),
						(e.prototype.getUserIdCookie = function () {
							return he(i)
						}),
						(e.prototype.getSessionFromCookie = function () {
							if (this.useCookies()) {
								var e = he(this.sessionCookieName)
								if (e && atob)
									try {
										;(this.session = JSON.parse(atob(e))),
											this.pageManager.resumeSession(this.session.page)
									} catch (e) {}
							}
						}),
						(e.prototype.storeSessionAsCookie = function () {
							this.useCookies() &&
								this.config.userIdRetentionDays > 0 &&
								this.createOrRenewUserCookie(this.userId, this.userExpiry),
								this.useCookies() &&
									this.createOrRenewSessionCookie(
										this.session,
										this.sessionExpiry,
									)
						}),
						(e.prototype.createSession = function () {
							;(this.session = {
								sessionId: Ee(),
								record:
									this.session.sessionId === Ce
										? this.session.record
										: this.sample(),
								eventCount: 0,
							}),
								(this.session.page = this.pageManager.getPage()),
								(this.sessionExpiry = new Date(
									new Date().getTime() + 1e3 * this.config.sessionLengthSeconds,
								)),
								this.storeSessionAsCookie(),
								this.record(
									this.session,
									"com.amazon.rum.session_start_event",
									{ version: "1.0.0" },
								)
						}),
						(e.prototype.renewSession = function () {
							;(this.sessionExpiry = new Date(
								new Date().getTime() + 1e3 * this.config.sessionLengthSeconds,
							)),
								(this.session.page = this.pageManager.getPage()),
								this.storeSessionAsCookie()
						}),
						(e.prototype.collectAttributes = function () {
							var e = new Se.UAParser(navigator.userAgent).getResult()
							this.attributes = {
								browserLanguage: navigator.language,
								browserName: e.browser.name ? e.browser.name : _e,
								browserVersion: e.browser.version ? e.browser.version : _e,
								osName: e.os.name ? e.os.name : _e,
								osVersion: e.os.version ? e.os.version : _e,
								deviceType: e.device.type ? e.device.type : "desktop",
								platformType: "web",
								domain: window.location.hostname,
							}
						}),
						(e.prototype.useCookies = function () {
							return navigator.cookieEnabled && this.config.allowCookies
						}),
						(e.prototype.sample = function () {
							return Math.random() < this.config.sessionSampleRate
						}),
						e
					)
				})(),
				Oe = n(372),
				Ie = (function () {
					var e = function (t, n) {
						return (
							(e =
								Object.setPrototypeOf ||
								({ __proto__: [] } instanceof Array &&
									function (e, t) {
										e.__proto__ = t
									}) ||
								function (e, t) {
									for (var n in t)
										Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
								}),
							e(t, n)
						)
					}
					return function (t, n) {
						if ("function" != typeof n && null !== n)
							throw new TypeError(
								"Class extends value " +
									String(n) +
									" is not a constructor or null",
							)
						function r() {
							this.constructor = t
						}
						e(t, n),
							(t.prototype =
								null === n
									? Object.create(n)
									: ((r.prototype = n.prototype), new r()))
					}
				})(),
				Pe = (function (e) {
					function t() {
						var t = (null !== e && e.apply(this, arguments)) || this
						return (
							(t.enable = t.patch.bind(t, !0)),
							(t.disable = t.patch.bind(t, !1)),
							(t.enabled = !1),
							t
						)
					}
					return (
						Ie(t, e),
						(t.prototype.patchAll = function () {
							for (
								var e = Oe.wrap.bind(Oe), t = 0, n = this.patches;
								t < n.length;
								t++
							) {
								var r = n[t]
								e(r.nodule, r.name, r.wrapper())
							}
						}),
						(t.prototype.unpatchAll = function () {
							for (
								var e = Oe.unwrap.bind(Oe), t = 0, n = this.patches;
								t < n.length;
								t++
							) {
								var r = n[t]
								e(r.nodule, r.name)
							}
						}),
						(t.prototype.patch = function (e) {
							void 0 === e && (e = !0),
								this.enabled !== e &&
									((this.enabled = e), e ? this.patchAll() : this.unpatchAll())
						}),
						t
					)
				})(J),
				xe = (function () {
					var e = function (t, n) {
						return (
							(e =
								Object.setPrototypeOf ||
								({ __proto__: [] } instanceof Array &&
									function (e, t) {
										e.__proto__ = t
									}) ||
								function (e, t) {
									for (var n in t)
										Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
								}),
							e(t, n)
						)
					}
					return function (t, n) {
						if ("function" != typeof n && null !== n)
							throw new TypeError(
								"Class extends value " +
									String(n) +
									" is not a constructor or null",
							)
						function r() {
							this.constructor = t
						}
						e(t, n),
							(t.prototype =
								null === n
									? Object.create(n)
									: ((r.prototype = n.prototype), new r()))
					}
				})(),
				ke = (function (e) {
					function t(t, n, r) {
						var o = e.call(this, "virtual-page-load-timer") || this
						return (
							(o.sendWrapper = function () {
								var e = o
								return function (t) {
									return function () {
										return (
											e.recordXhr(this),
											this.addEventListener("loadend", e.endTracking),
											t.apply(this, arguments)
										)
									}
								}
							}),
							(o.endTracking = function (e) {
								var t = Date.now(),
									n = e.target
								n.removeEventListener("loadend", o.endTracking),
									o.removeXhr(n, t)
							}),
							(o.fetch = function (e, t, n) {
								return e
									.apply(t, n)
									.catch(function (e) {
										throw e
									})
									.finally(o.decrementFetchCounter)
							}),
							(o.fetchWrapper = function () {
								var e = o
								return function (t) {
									return function (n, r) {
										return (e.fetchCounter += 1), e.fetch(t, this, arguments)
									}
								}
							}),
							(o.decrementFetchCounter = function () {
								o.isPageLoaded || (o.latestEndTime = Date.now()),
									(o.fetchCounter -= 1)
							}),
							(o.checkLoadStatus = function () {
								0 === o.ongoingRequests.size &&
									0 === o.fetchCounter &&
									(clearInterval(o.periodicCheckerId),
									clearTimeout(o.timeoutCheckerId),
									o.domMutationObserver.disconnect(),
									o.recordRouteChangeNavigationEvent(o.pageManager.getPage()),
									(o.periodicCheckerId = void 0),
									(o.timeoutCheckerId = void 0),
									(o.isPageLoaded = !0))
							}),
							(o.declareTimeout = function () {
								clearInterval(o.periodicCheckerId),
									(o.periodicCheckerId = void 0),
									(o.timeoutCheckerId = void 0),
									o.domMutationObserver.disconnect(),
									(o.isPageLoaded = !0)
							}),
							(o.resetInterval = function () {
								;(o.latestEndTime = Date.now()),
									clearInterval(o.periodicCheckerId),
									(o.periodicCheckerId = setInterval(
										o.checkLoadStatus,
										o.config.routeChangeComplete,
									))
							}),
							(o.moveItemsFromBuffer = function (e) {
								o.ongoingRequests.add(e)
							}),
							(o.updateLatestInteractionTime = function (e) {
								o.latestInteractionTime = Date.now()
							}),
							(o.periodicCheckerId = void 0),
							(o.timeoutCheckerId = void 0),
							(o.domMutationObserver = new MutationObserver(o.resetInterval)),
							(o.ongoingRequests = new Set()),
							(o.requestBuffer = new Set()),
							(o.fetchCounter = 0),
							(o.isPageLoaded = !0),
							(o.latestEndTime = 0),
							(o.latestInteractionTime = 0),
							(o.config = n),
							(o.pageManager = t),
							(o.record = r),
							o.enable(),
							document.addEventListener(
								"mousedown",
								o.updateLatestInteractionTime,
							),
							document.addEventListener(
								"keydown",
								o.updateLatestInteractionTime,
							),
							o
						)
					}
					return (
						xe(t, e),
						Object.defineProperty(t.prototype, "patches", {
							get: function () {
								return [
									{
										nodule: XMLHttpRequest.prototype,
										name: "send",
										wrapper: this.sendWrapper,
									},
									{ nodule: window, name: "fetch", wrapper: this.fetchWrapper },
								]
							},
							enumerable: !1,
							configurable: !0,
						}),
						(t.prototype.startTiming = function () {
							;(this.latestEndTime = Date.now()),
								this.periodicCheckerId && clearInterval(this.periodicCheckerId),
								this.timeoutCheckerId && clearTimeout(this.timeoutCheckerId),
								this.domMutationObserver.disconnect(),
								(this.periodicCheckerId = setInterval(
									this.checkLoadStatus,
									this.config.routeChangeComplete,
								)),
								(this.timeoutCheckerId = setTimeout(
									this.declareTimeout,
									this.config.routeChangeTimeout,
								)),
								this.domMutationObserver.observe(document, {
									subtree: !0,
									childList: !0,
									attributes: !1,
									characterData: !1,
								}),
								(this.isPageLoaded = !1),
								this.requestBuffer.forEach(this.moveItemsFromBuffer),
								this.requestBuffer.clear()
						}),
						(t.prototype.recordXhr = function (e) {
							this.pageManager.getPage() && !1 === this.isPageLoaded
								? this.ongoingRequests.add(e)
								: this.requestBuffer.add(e)
						}),
						(t.prototype.removeXhr = function (e, t) {
							this.pageManager.getPage() && this.ongoingRequests.has(e)
								? (this.ongoingRequests.delete(e), (this.latestEndTime = t))
								: this.requestBuffer.has(e) && this.requestBuffer.delete(e)
						}),
						(t.prototype.recordRouteChangeNavigationEvent = function (e) {
							var t = {
								version: "1.0.0",
								initiatorType: "route_change",
								navigationType: "navigate",
								startTime: e.start,
								duration: this.latestEndTime - e.start,
							}
							this.record && this.record(W, t)
						}),
						t
					)
				})(Pe),
				Le = function () {
					return (
						(Le =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						Le.apply(this, arguments)
					)
				},
				Re = (function () {
					function e(e, t) {
						;(this.TIMEOUT = 1e3),
							(this.config = e),
							(this.record = t),
							(this.page = void 0),
							(this.resumed = !1),
							(this.recordInteraction = !1),
							(this.virtualPageLoadTimer = new ke(this, e, t))
					}
					return (
						(e.prototype.getPage = function () {
							return this.page
						}),
						(e.prototype.getAttributes = function () {
							return this.attributes
						}),
						(e.prototype.resumeSession = function (e) {
							;(this.recordInteraction = !0),
								e && ((this.page = e), (this.resumed = !0))
						}),
						(e.prototype.recordPageView = function (e) {
							var t
							if (
								((t = "string" == typeof e ? e : e.pageId),
								this.useCookies() && (this.recordInteraction = !0),
								this.page)
							) {
								if (this.page.pageId === t)
									return this.resumed
										? void this.collectAttributes(
												this.page,
												"object" == typeof e ? e : void 0,
											)
										: void 0
								this.createNextPage(this.page, t)
							} else this.createLandingPage(t)
							this.collectAttributes(
								this.page,
								"object" == typeof e ? e : void 0,
							),
								this.recordPageViewEvent(this.page)
						}),
						(e.prototype.createNextPage = function (e, t) {
							var n = Date.now(),
								r = this.virtualPageLoadTimer.latestInteractionTime
							!this.resumed &&
								n - r <= this.TIMEOUT &&
								((n = r), this.virtualPageLoadTimer.startTiming()),
								(this.timeOnParentPage = n - e.start),
								(this.resumed = !1),
								(this.page = {
									pageId: t,
									parentPageId: e.pageId,
									interaction: e.interaction + 1,
									referrer: document.referrer,
									referrerDomain: this.getDomainFromReferrer(),
									start: n,
								})
						}),
						(e.prototype.createLandingPage = function (e) {
							this.page = {
								pageId: e,
								interaction: 0,
								referrer: document.referrer,
								referrerDomain: this.getDomainFromReferrer(),
								start: Date.now(),
							}
						}),
						(e.prototype.collectAttributes = function (e, t) {
							var n
							;(this.attributes = {
								title: (
									null === (n = null == t ? void 0 : t.pageAttributes) ||
									void 0 === n
										? void 0
										: n.title
								)
									? t.pageAttributes.title
									: document.title,
								pageId: e.pageId,
							}),
								this.recordInteraction &&
									((this.attributes.interaction = e.interaction),
									void 0 !== e.parentPageId &&
										(this.attributes.parentPageId = e.parentPageId)),
								(null == t ? void 0 : t.pageTags) &&
									(this.attributes.pageTags = t.pageTags),
								(null == t ? void 0 : t.pageAttributes) &&
									(this.attributes = Le(
										Le({}, t.pageAttributes),
										this.attributes,
									))
						}),
						(e.prototype.createPageViewEvent = function (e) {
							var t = { version: "1.0.0", pageId: e.pageId }
							return (
								this.recordInteraction &&
									((t.interaction = e.interaction),
									(t.pageInteractionId = e.pageId + "-" + e.interaction),
									void 0 !== e.parentPageId &&
										((t.parentPageInteractionId =
											e.parentPageId + "-" + (e.interaction - 1)),
										(t.timeOnParentPage = this.timeOnParentPage)),
									(t.referrer = document.referrer),
									(t.referrerDomain = this.getDomainFromReferrer())),
								t
							)
						}),
						(e.prototype.recordPageViewEvent = function (e) {
							this.record(Z, this.createPageViewEvent(e))
						}),
						(e.prototype.useCookies = function () {
							return navigator.cookieEnabled && this.config.allowCookies
						}),
						(e.prototype.getDomainFromReferrer = function () {
							try {
								return new URL(document.referrer).hostname
							} catch (e) {
								return "localhost" === document.referrer
									? document.referrer
									: ""
							}
						}),
						e
					)
				})()
			!(function (e) {
				e.EVENT = "event"
			})(we || (we = {}))
			var je = (function () {
					function e() {
						this.subscribers = new Map()
					}
					return (
						(e.prototype.subscribe = function (e, t) {
							var n,
								r =
									null !== (n = this.subscribers.get(e)) && void 0 !== n
										? n
										: []
							r.length || this.subscribers.set(e, r), r.push(t)
						}),
						(e.prototype.unsubscribe = function (e, t) {
							var n = this.subscribers.get(e)
							if (n)
								for (var r = 0; r < n.length; r++)
									if (n[r] === t) return n.splice(r, 1), !0
							return !1
						}),
						(e.prototype.dispatch = function (e, t) {
							var n = this.subscribers.get(e)
							if (n)
								for (var r = 0, o = n; r < o.length; r++) {
									;(0, o[r])(t)
								}
						}),
						e
					)
				})(),
				Me = je,
				Ue = function () {
					return (
						(Ue =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						Ue.apply(this, arguments)
					)
				},
				De = (function () {
					function e(e, t, n) {
						void 0 === n && (n = new Me())
						var r = this
						;(this.eventBus = n),
							(this.events = []),
							(this.recordPageView = function (e) {
								r.isCurrentUrlAllowed() && r.pageManager.recordPageView(e)
							}),
							(this.recordEvent = function (e, t) {
								if (r.enabled && r.isCurrentUrlAllowed()) {
									var n = r.sessionManager.getSession()
									r.sessionManager.incrementSessionEventCount(),
										r.canRecord(n) && r.addRecordToCache(e, t)
								}
							}),
							(this.getSession = function () {
								if (r.isCurrentUrlAllowed())
									return r.sessionManager.getSession()
							}),
							(this.recordSessionInitEvent = function (e, t, n) {
								r.enabled &&
									(r.sessionManager.incrementSessionEventCount(),
									r.canRecord(e) && r.addRecordToCache(t, n))
							}),
							(this.canRecord = function (e) {
								return (
									e.record &&
									(e.eventCount <= r.config.sessionEventLimit ||
										r.config.sessionEventLimit <= 0)
								)
							}),
							(this.addRecordToCache = function (e, t) {
								if (r.enabled && r.events.length !== r.config.eventCacheSize) {
									var n = Ue(
											Ue(
												Ue({}, r.sessionManager.getAttributes()),
												r.pageManager.getAttributes(),
											),
											{
												version: "1.0.0",
												"aws:client": r.installationMethod,
												"aws:clientVersion": "1.19.0",
											},
										),
										o = { id: Ee(), timestamp: new Date(), type: e }
									r.eventBus.dispatch(
										we.EVENT,
										Ue(Ue({}, o), { details: t, metadata: n }),
									),
										r.events.push(
											Ue(Ue({}, o), {
												details: JSON.stringify(t),
												metadata: JSON.stringify(n),
											}),
										)
								}
							}),
							(this.appMonitorDetails = e),
							(this.config = t),
							(this.enabled = !0),
							(this.pageManager = new Re(t, this.recordEvent)),
							(this.sessionManager = new Ae(
								e,
								t,
								this.recordSessionInitEvent,
								this.pageManager,
							)),
							(this.installationMethod = t.client)
					}
					return (
						(e.prototype.enable = function () {
							this.enabled = !0
						}),
						(e.prototype.disable = function () {
							this.enabled = !1
						}),
						(e.prototype.isSessionSampled = function () {
							return this.sessionManager.isSampled()
						}),
						(e.prototype.hasEvents = function () {
							return 0 !== this.events.length
						}),
						(e.prototype.getEventBatch = function () {
							var e = []
							return (
								0 === this.events.length ||
									(this.events.length <= this.config.batchLimit
										? ((e = this.events), (this.events = []))
										: (e = this.events.splice(0, this.config.batchLimit))),
								e
							)
						}),
						(e.prototype.getAppMonitorDetails = function () {
							return this.appMonitorDetails
						}),
						(e.prototype.getUserDetails = function () {
							return {
								userId: this.sessionManager.getUserId(),
								sessionId: this.sessionManager.getSession().sessionId,
							}
						}),
						(e.prototype.addSessionAttributes = function (e) {
							this.sessionManager.addSessionAttributes(e)
						}),
						(e.prototype.isCurrentUrlAllowed = function () {
							var e = document.location.toString(),
								t = this.config.pagesToExclude.some(function (t) {
									return t.test(e)
								})
							return (
								this.config.pagesToInclude.some(function (t) {
									return t.test(e)
								}) && !t
							)
						}),
						e
					)
				})()
			const He = {},
				qe = {}
			for (let e = 0; e < 256; e++) {
				let t = e.toString(16).toLowerCase()
				1 === t.length && (t = `0${t}`), (He[e] = t), (qe[t] = e)
			}
			function Be(e) {
				let t = ""
				for (let n = 0; n < e.byteLength; n++) t += He[e[n]]
				return t
			}
			var Ne
			n(79)
			class Fe {
				constructor(e) {
					if (((this.bytes = e), 8 !== e.byteLength))
						throw new Error("Int64 buffers must be exactly 8 bytes")
				}
				static fromNumber(e) {
					if (e > 0x8000000000000000 || e < -0x8000000000000000)
						throw new Error(
							`${e} is too large (or, if negative, too small) to represent as an Int64`,
						)
					const t = new Uint8Array(8)
					for (
						let n = 7, r = Math.abs(Math.round(e));
						n > -1 && r > 0;
						n--, r /= 256
					)
						t[n] = r
					return e < 0 && ze(t), new Fe(t)
				}
				valueOf() {
					const e = this.bytes.slice(0),
						t = 128 & e[0]
					return t && ze(e), parseInt(Be(e), 16) * (t ? -1 : 1)
				}
				toString() {
					return String(this.valueOf())
				}
			}
			function ze(e) {
				for (let t = 0; t < 8; t++) e[t] ^= 255
				for (let t = 7; t > -1 && (e[t]++, 0 === e[t]); t--);
			}
			class $e {
				constructor(e, t) {
					;(this.toUtf8 = e), (this.fromUtf8 = t)
				}
				format(e) {
					const t = []
					for (const n of Object.keys(e)) {
						const r = this.fromUtf8(n)
						t.push(
							Uint8Array.from([r.byteLength]),
							r,
							this.formatHeaderValue(e[n]),
						)
					}
					const n = new Uint8Array(t.reduce((e, t) => e + t.byteLength, 0))
					let r = 0
					for (const e of t) n.set(e, r), (r += e.byteLength)
					return n
				}
				formatHeaderValue(e) {
					switch (e.type) {
						case "boolean":
							return Uint8Array.from([e.value ? 0 : 1])
						case "byte":
							return Uint8Array.from([2, e.value])
						case "short":
							const t = new DataView(new ArrayBuffer(3))
							return (
								t.setUint8(0, 3),
								t.setInt16(1, e.value, !1),
								new Uint8Array(t.buffer)
							)
						case "integer":
							const n = new DataView(new ArrayBuffer(5))
							return (
								n.setUint8(0, 4),
								n.setInt32(1, e.value, !1),
								new Uint8Array(n.buffer)
							)
						case "long":
							const r = new Uint8Array(9)
							return (r[0] = 5), r.set(e.value.bytes, 1), r
						case "binary":
							const o = new DataView(new ArrayBuffer(3 + e.value.byteLength))
							o.setUint8(0, 6), o.setUint16(1, e.value.byteLength, !1)
							const i = new Uint8Array(o.buffer)
							return i.set(e.value, 3), i
						case "string":
							const a = this.fromUtf8(e.value),
								s = new DataView(new ArrayBuffer(3 + a.byteLength))
							s.setUint8(0, 7), s.setUint16(1, a.byteLength, !1)
							const c = new Uint8Array(s.buffer)
							return c.set(a, 3), c
						case "timestamp":
							const u = new Uint8Array(9)
							return (
								(u[0] = 8), u.set(Fe.fromNumber(e.value.valueOf()).bytes, 1), u
							)
						case "uuid":
							if (!et.test(e.value))
								throw new Error(`Invalid UUID received: ${e.value}`)
							const l = new Uint8Array(17)
							return (
								(l[0] = 9),
								l.set(
									(function (e) {
										if (e.length % 2 != 0)
											throw new Error(
												"Hex encoded strings must have an even number length",
											)
										const t = new Uint8Array(e.length / 2)
										for (let n = 0; n < e.length; n += 2) {
											const r = e.slice(n, n + 2).toLowerCase()
											if (!(r in qe))
												throw new Error(
													`Cannot decode unrecognized sequence ${r} as hexadecimal`,
												)
											t[n / 2] = qe[r]
										}
										return t
									})(e.value.replace(/\-/g, "")),
									1,
								),
								l
							)
					}
				}
				parse(e) {
					const t = {}
					let n = 0
					for (; n < e.byteLength; ) {
						const r = e.getUint8(n++),
							o = this.toUtf8(new Uint8Array(e.buffer, e.byteOffset + n, r))
						switch (((n += r), e.getUint8(n++))) {
							case 0:
								t[o] = { type: Ve, value: !0 }
								break
							case 1:
								t[o] = { type: Ve, value: !1 }
								break
							case 2:
								t[o] = { type: We, value: e.getInt8(n++) }
								break
							case 3:
								;(t[o] = { type: Ke, value: e.getInt16(n, !1) }), (n += 2)
								break
							case 4:
								;(t[o] = { type: Xe, value: e.getInt32(n, !1) }), (n += 4)
								break
							case 5:
								;(t[o] = {
									type: Ge,
									value: new Fe(new Uint8Array(e.buffer, e.byteOffset + n, 8)),
								}),
									(n += 8)
								break
							case 6:
								const r = e.getUint16(n, !1)
								;(n += 2),
									(t[o] = {
										type: Ze,
										value: new Uint8Array(e.buffer, e.byteOffset + n, r),
									}),
									(n += r)
								break
							case 7:
								const i = e.getUint16(n, !1)
								;(n += 2),
									(t[o] = {
										type: Je,
										value: this.toUtf8(
											new Uint8Array(e.buffer, e.byteOffset + n, i),
										),
									}),
									(n += i)
								break
							case 8:
								;(t[o] = {
									type: Ye,
									value: new Date(
										new Fe(
											new Uint8Array(e.buffer, e.byteOffset + n, 8),
										).valueOf(),
									),
								}),
									(n += 8)
								break
							case 9:
								const a = new Uint8Array(e.buffer, e.byteOffset + n, 16)
								;(n += 16),
									(t[o] = {
										type: Qe,
										value: `${Be(a.subarray(0, 4))}-${Be(a.subarray(4, 6))}-${Be(a.subarray(6, 8))}-${Be(a.subarray(8, 10))}-${Be(a.subarray(10))}`,
									})
								break
							default:
								throw new Error("Unrecognized header type tag")
						}
					}
					return t
				}
			}
			!(function (e) {
				;(e[(e.boolTrue = 0)] = "boolTrue"),
					(e[(e.boolFalse = 1)] = "boolFalse"),
					(e[(e.byte = 2)] = "byte"),
					(e[(e.short = 3)] = "short"),
					(e[(e.integer = 4)] = "integer"),
					(e[(e.long = 5)] = "long"),
					(e[(e.byteArray = 6)] = "byteArray"),
					(e[(e.string = 7)] = "string"),
					(e[(e.timestamp = 8)] = "timestamp"),
					(e[(e.uuid = 9)] = "uuid")
			})(Ne || (Ne = {}))
			const Ve = "boolean",
				We = "byte",
				Ke = "short",
				Xe = "integer",
				Ge = "long",
				Ze = "binary",
				Je = "string",
				Ye = "timestamp",
				Qe = "uuid",
				et = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
			Symbol.asyncIterator
			Symbol.asyncIterator
			Symbol.asyncIterator
			Symbol.asyncIterator
			const tt = (e) => {
					if ("function" == typeof e) return e
					const t = Promise.resolve(e)
					return () => t
				},
				nt = (e) => new TextDecoder("utf-8").decode(e),
				rt = (e) => new TextEncoder().encode(e),
				ot = (e) =>
					"string" == typeof e
						? rt(e)
						: ArrayBuffer.isView(e)
							? new Uint8Array(
									e.buffer,
									e.byteOffset,
									e.byteLength / Uint8Array.BYTES_PER_ELEMENT,
								)
							: new Uint8Array(e),
				it = "X-Amz-Date",
				at = "X-Amz-Signature",
				st = "X-Amz-Security-Token",
				ct = "authorization",
				ut = it.toLowerCase(),
				lt = [ct, ut, "date"],
				ft = at.toLowerCase(),
				dt = "x-amz-content-sha256",
				ht = st.toLowerCase(),
				pt = {
					authorization: !0,
					"cache-control": !0,
					connection: !0,
					expect: !0,
					from: !0,
					"keep-alive": !0,
					"max-forwards": !0,
					pragma: !0,
					referer: !0,
					te: !0,
					trailer: !0,
					"transfer-encoding": !0,
					upgrade: !0,
					"user-agent": !0,
					"x-amzn-trace-id": !0,
				},
				vt = /^proxy-/,
				yt = /^sec-/,
				gt = "AWS4-HMAC-SHA256",
				mt = "AWS4-HMAC-SHA256-PAYLOAD",
				bt = "aws4_request",
				wt = {},
				Et = [],
				St = (e, t, n) => `${e}/${t}/${n}/aws4_request`,
				Tt = (e, t, n) => {
					const r = new e(t)
					return r.update(ot(n)), r.digest()
				},
				Ct = (e, t, n) => {
					let { headers: r } = e
					const o = {}
					for (const e of Object.keys(r).sort()) {
						if (null == r[e]) continue
						const i = e.toLowerCase()
						;((i in pt ||
							(null != t && t.has(i)) ||
							vt.test(i) ||
							yt.test(i)) &&
							(!n || (n && !n.has(i)))) ||
							(o[i] = r[e].trim().replace(/\s+/g, " "))
					}
					return o
				},
				_t = async (e, t) => {
					let { headers: n, body: r } = e
					for (const e of Object.keys(n))
						if (e.toLowerCase() === dt) return n[e]
					if (null == r)
						return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
					if (
						"string" == typeof r ||
						ArrayBuffer.isView(r) ||
						((o = r),
						("function" == typeof ArrayBuffer && o instanceof ArrayBuffer) ||
							"[object ArrayBuffer]" === Object.prototype.toString.call(o))
					) {
						const e = new t()
						return e.update(ot(r)), Be(await e.digest())
					}
					var o
					return "UNSIGNED-PAYLOAD"
				},
				At = (e) => {
					let { headers: t, query: n, ...r } = e
					return { ...r, headers: { ...t }, query: n ? Ot(n) : void 0 }
				},
				Ot = (e) =>
					Object.keys(e).reduce((t, n) => {
						const r = e[n]
						return { ...t, [n]: Array.isArray(r) ? [...r] : r }
					}, {}),
				It = (e) => {
					e = "function" == typeof e.clone ? e.clone() : At(e)
					for (const t of Object.keys(e.headers))
						lt.indexOf(t.toLowerCase()) > -1 && delete e.headers[t]
					return e
				},
				Pt = (e) =>
					"number" == typeof e
						? new Date(1e3 * e)
						: "string" == typeof e
							? Number(e)
								? new Date(1e3 * Number(e))
								: new Date(e)
							: e
			class xt {
				constructor(e) {
					let {
						applyChecksum: t,
						credentials: n,
						region: r,
						service: o,
						sha256: i,
						uriEscapePath: a = !0,
					} = e
					;(this.headerMarshaller = new $e(nt, rt)),
						(this.service = o),
						(this.sha256 = i),
						(this.uriEscapePath = a),
						(this.applyChecksum = "boolean" != typeof t || t),
						(this.regionProvider = tt(r)),
						(this.credentialProvider = tt(n))
				}
				async presign(e) {
					let t =
						arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
					const {
							signingDate: n = new Date(),
							expiresIn: r = 3600,
							unsignableHeaders: o,
							unhoistableHeaders: i,
							signableHeaders: a,
							signingRegion: s,
							signingService: c,
						} = t,
						u = await this.credentialProvider()
					this.validateResolvedCredentials(u)
					const l = s ?? (await this.regionProvider()),
						{ longDate: f, shortDate: d } = kt(n)
					if (r > 604800)
						return Promise.reject(
							"Signature version 4 presigned URLs must have an expiration date less than one week in the future",
						)
					const h = St(d, l, c ?? this.service),
						p = (function (e) {
							let t =
								arguments.length > 1 && void 0 !== arguments[1]
									? arguments[1]
									: {}
							const { headers: n, query: r = {} } =
								"function" == typeof e.clone ? e.clone() : At(e)
							for (const e of Object.keys(n)) {
								var o
								const i = e.toLowerCase()
								"x-amz-" !== i.slice(0, 6) ||
									(null !== (o = t.unhoistableHeaders) &&
										void 0 !== o &&
										o.has(i)) ||
									((r[e] = n[e]), delete n[e])
							}
							return { ...e, headers: n, query: r }
						})(It(e), { unhoistableHeaders: i })
					u.sessionToken && (p.query[st] = u.sessionToken),
						(p.query["X-Amz-Algorithm"] = gt),
						(p.query["X-Amz-Credential"] = `${u.accessKeyId}/${h}`),
						(p.query["X-Amz-Date"] = f),
						(p.query["X-Amz-Expires"] = r.toString(10))
					const v = Ct(p, o, a)
					return (
						(p.query["X-Amz-SignedHeaders"] = Lt(v)),
						(p.query["X-Amz-Signature"] = await this.getSignature(
							f,
							h,
							this.getSigningKey(u, l, d, c),
							this.createCanonicalRequest(p, v, await _t(e, this.sha256)),
						)),
						p
					)
				}
				async sign(e, t) {
					return "string" == typeof e
						? this.signString(e, t)
						: e.headers && e.payload
							? this.signEvent(e, t)
							: e.message
								? this.signMessage(e, t)
								: this.signRequest(e, t)
				}
				async signEvent(e, t) {
					let { headers: n, payload: r } = e,
						{
							signingDate: o = new Date(),
							priorSignature: i,
							signingRegion: a,
							signingService: s,
						} = t
					const c = a ?? (await this.regionProvider()),
						{ shortDate: u, longDate: l } = kt(o),
						f = St(u, c, s ?? this.service),
						d = await _t({ headers: {}, body: r }, this.sha256),
						h = new this.sha256()
					h.update(n)
					const p = Be(await h.digest()),
						v = [mt, l, f, i, p, d].join("\n")
					return this.signString(v, {
						signingDate: o,
						signingRegion: c,
						signingService: s,
					})
				}
				async signMessage(e, t) {
					let {
						signingDate: n = new Date(),
						signingRegion: r,
						signingService: o,
					} = t
					return this.signEvent(
						{
							headers: this.headerMarshaller.format(e.message.headers),
							payload: e.message.body,
						},
						{
							signingDate: n,
							signingRegion: r,
							signingService: o,
							priorSignature: e.priorSignature,
						},
					).then((t) => ({ message: e.message, signature: t }))
				}
				async signString(e) {
					let {
						signingDate: t = new Date(),
						signingRegion: n,
						signingService: r,
					} = arguments.length > 1 && void 0 !== arguments[1]
						? arguments[1]
						: {}
					const o = await this.credentialProvider()
					this.validateResolvedCredentials(o)
					const i = n ?? (await this.regionProvider()),
						{ shortDate: a } = kt(t),
						s = new this.sha256(await this.getSigningKey(o, i, a, r))
					return s.update(ot(e)), Be(await s.digest())
				}
				async signRequest(e) {
					let {
						signingDate: t = new Date(),
						signableHeaders: n,
						unsignableHeaders: r,
						signingRegion: o,
						signingService: i,
					} = arguments.length > 1 && void 0 !== arguments[1]
						? arguments[1]
						: {}
					const a = await this.credentialProvider()
					this.validateResolvedCredentials(a)
					const s = o ?? (await this.regionProvider()),
						c = It(e),
						{ longDate: u, shortDate: l } = kt(t),
						f = St(l, s, i ?? this.service)
					;(c.headers[ut] = u),
						a.sessionToken && (c.headers[ht] = a.sessionToken)
					const d = await _t(c, this.sha256)
					!((e, t) => {
						e = e.toLowerCase()
						for (const n of Object.keys(t)) if (e === n.toLowerCase()) return !0
						return !1
					})(dt, c.headers) &&
						this.applyChecksum &&
						(c.headers[dt] = d)
					const h = Ct(c, r, n),
						p = await this.getSignature(
							u,
							f,
							this.getSigningKey(a, s, l, i),
							this.createCanonicalRequest(c, h, d),
						)
					return (
						(c.headers[ct] =
							`AWS4-HMAC-SHA256 Credential=${a.accessKeyId}/${f}, SignedHeaders=${Lt(h)}, Signature=${p}`),
						c
					)
				}
				createCanonicalRequest(e, t, n) {
					const r = Object.keys(t).sort()
					return `${e.method}\n${this.getCanonicalPath(e)}\n${((e) => {
						let { query: t = {} } = e
						const n = [],
							r = {}
						for (const e of Object.keys(t).sort()) {
							if (e.toLowerCase() === ft) continue
							n.push(e)
							const o = t[e]
							"string" == typeof o
								? (r[e] = `${u(e)}=${u(o)}`)
								: Array.isArray(o) &&
									(r[e] = o
										.slice(0)
										.sort()
										.reduce((t, n) => t.concat([`${u(e)}=${u(n)}`]), [])
										.join("&"))
						}
						return n
							.map((e) => r[e])
							.filter((e) => e)
							.join("&")
					})(
						e,
					)}\n${r.map((e) => `${e}:${t[e]}`).join("\n")}\n\n${r.join(";")}\n${n}`
				}
				async createStringToSign(e, t, n) {
					const r = new this.sha256()
					r.update(ot(n))
					return `AWS4-HMAC-SHA256\n${e}\n${t}\n${Be(await r.digest())}`
				}
				getCanonicalPath(e) {
					let { path: t } = e
					if (this.uriEscapePath) {
						const e = []
						for (const n of t.split("/"))
							0 !== (null == n ? void 0 : n.length) &&
								"." !== n &&
								(".." === n ? e.pop() : e.push(n))
						const n = `${null != t && t.startsWith("/") ? "/" : ""}${e.join("/")}${e.length > 0 && null != t && t.endsWith("/") ? "/" : ""}`
						return encodeURIComponent(n).replace(/%2F/g, "/")
					}
					return t
				}
				async getSignature(e, t, n, r) {
					const o = await this.createStringToSign(e, t, r),
						i = new this.sha256(await n)
					return i.update(ot(o)), Be(await i.digest())
				}
				getSigningKey(e, t, n, r) {
					return (async (e, t, n, r, o) => {
						const i = `${n}:${r}:${o}:${Be(await Tt(e, t.secretAccessKey, t.accessKeyId))}:${t.sessionToken}`
						if (i in wt) return wt[i]
						for (Et.push(i); Et.length > 50; ) delete wt[Et.shift()]
						let a = `AWS4${t.secretAccessKey}`
						for (const t of [n, r, o, bt]) a = await Tt(e, a, t)
						return (wt[i] = a)
					})(this.sha256, e, n, t, r || this.service)
				}
				validateResolvedCredentials(e) {
					if (
						"object" != typeof e ||
						"string" != typeof e.accessKeyId ||
						"string" != typeof e.secretAccessKey
					)
						throw new Error("Resolved credential object is not valid")
				}
			}
			const kt = (e) => {
					const t = ((n = e),
					Pt(n)
						.toISOString()
						.replace(/\.\d{3}Z$/, "Z")).replace(/[\-:]/g, "")
					var n
					return { longDate: t, shortDate: t.slice(0, 8) }
				},
				Lt = (e) => Object.keys(e).sort().join(";")
			for (
				var Rt = n(938),
					jt = function () {
						return (
							(jt =
								Object.assign ||
								function (e) {
									for (var t, n = 1, r = arguments.length; n < r; n++)
										for (var o in (t = arguments[n]))
											Object.prototype.hasOwnProperty.call(t, o) &&
												(e[o] = t[o])
									return e
								}),
							jt.apply(this, arguments)
						)
					},
					Mt = function (e, t, n, r) {
						return new (n || (n = Promise))(function (o, i) {
							function a(e) {
								try {
									c(r.next(e))
								} catch (e) {
									i(e)
								}
							}
							function s(e) {
								try {
									c(r.throw(e))
								} catch (e) {
									i(e)
								}
							}
							function c(e) {
								var t
								e.done
									? o(e.value)
									: ((t = e.value),
										t instanceof n
											? t
											: new n(function (e) {
													e(t)
												})).then(a, s)
							}
							c((r = r.apply(e, t || [])).next())
						})
					},
					Ut = function (e, t) {
						var n,
							r,
							o,
							i,
							a = {
								label: 0,
								sent: function () {
									if (1 & o[0]) throw o[1]
									return o[1]
								},
								trys: [],
								ops: [],
							}
						return (
							(i = { next: s(0), throw: s(1), return: s(2) }),
							"function" == typeof Symbol &&
								(i[Symbol.iterator] = function () {
									return this
								}),
							i
						)
						function s(i) {
							return function (s) {
								return (function (i) {
									if (n) throw new TypeError("Generator is already executing.")
									for (; a; )
										try {
											if (
												((n = 1),
												r &&
													(o =
														2 & i[0]
															? r.return
															: i[0]
																? r.throw || ((o = r.return) && o.call(r), 0)
																: r.next) &&
													!(o = o.call(r, i[1])).done)
											)
												return o
											switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
												case 0:
												case 1:
													o = i
													break
												case 4:
													return a.label++, { value: i[1], done: !1 }
												case 5:
													a.label++, (r = i[1]), (i = [0])
													continue
												case 7:
													;(i = a.ops.pop()), a.trys.pop()
													continue
												default:
													if (
														!((o = a.trys),
														(o = o.length > 0 && o[o.length - 1]) ||
															(6 !== i[0] && 2 !== i[0]))
													) {
														a = 0
														continue
													}
													if (
														3 === i[0] &&
														(!o || (i[1] > o[0] && i[1] < o[3]))
													) {
														a.label = i[1]
														break
													}
													if (6 === i[0] && a.label < o[1]) {
														;(a.label = o[1]), (o = i)
														break
													}
													if (o && a.label < o[2]) {
														;(a.label = o[2]), a.ops.push(i)
														break
													}
													o[2] && a.ops.pop(), a.trys.pop()
													continue
											}
											i = t.call(e, a)
										} catch (e) {
											;(i = [6, e]), (r = 0)
										} finally {
											n = o = 0
										}
									if (5 & i[0]) throw i[1]
									return { value: i[0] ? i[1] : void 0, done: !0 }
								})([i, s])
							}
						}
					},
					Dt = { expiresIn: 60 },
					Ht = function (e) {
						var t = this
						;(this.sendFetch = function (e) {
							return Mt(t, void 0, void 0, function () {
								var t, n
								return Ut(this, function (r) {
									switch (r.label) {
										case 0:
											return [
												4,
												this.getHttpRequestOptions(e, "application/json"),
											]
										case 1:
											return (
												(t = r.sent()),
												(n = new s(t)),
												this.awsSigV4 ? [4, this.awsSigV4.sign(n)] : [3, 3]
											)
										case 2:
											;(n = r.sent()), (r.label = 3)
										case 3:
											return [2, this.config.fetchRequestHandler.handle(n)]
									}
								})
							})
						}),
							(this.sendBeacon = function (e) {
								return Mt(t, void 0, void 0, function () {
									var t, n
									return Ut(this, function (r) {
										switch (r.label) {
											case 0:
												return [
													4,
													this.getHttpRequestOptions(
														e,
														"text/plain;charset=UTF-8",
													),
												]
											case 1:
												return (
													(t = r.sent()),
													(n = new s(t)),
													this.awsSigV4
														? [4, this.awsSigV4.presign(n, Dt)]
														: [3, 3]
												)
											case 2:
												;(n = r.sent()), (r.label = 3)
											case 3:
												return [2, this.config.beaconRequestHandler.handle(n)]
										}
									})
								})
							}),
							(this.getHttpRequestOptions = function (e, n) {
								return Mt(t, void 0, void 0, function () {
									var t, r, o, i, a, s, c, u
									return Ut(this, function (l) {
										switch (l.label) {
											case 0:
												return (
													(t = JSON.stringify(qt(e))),
													(r = this.config.endpoint.pathname.replace(
														/\/$/,
														"",
													)),
													(o = {
														method: "POST",
														protocol: this.config.endpoint.protocol,
														headers: {
															"content-type": n,
															host: this.config.endpoint.host,
														},
														hostname: this.config.endpoint.hostname,
														path: ""
															.concat(r, "/appmonitors/")
															.concat(e.AppMonitorDetails.id),
														body: t,
													}),
													this.awsSigV4
														? ((i = [jt({}, o)]),
															(c = {}),
															(a = [jt({}, o.headers)]),
															(u = {}),
															(s = "X-Amz-Content-Sha256"),
															[4, Nt(t)])
														: [3, 2]
												)
											case 1:
												return [
													2,
													jt.apply(
														void 0,
														i.concat([
															((c.headers = jt.apply(
																void 0,
																a.concat([((u[s] = l.sent()), u)]),
															)),
															c),
														]),
													),
												]
											case 2:
												return [2, o]
										}
									})
								})
							}),
							(this.config = e),
							e.credentials &&
								(this.awsSigV4 = new xt({
									applyChecksum: !0,
									credentials: e.credentials,
									region: e.region,
									service: "rum",
									uriEscapePath: !0,
									sha256: Rt.Sha256,
								}))
					},
					qt = function (e) {
						var t = []
						return (
							e.RumEvents.forEach(function (e) {
								return t.push(Bt(e))
							}),
							{
								BatchId: e.BatchId,
								AppMonitorDetails: e.AppMonitorDetails,
								UserDetails: e.UserDetails,
								RumEvents: t,
							}
						)
					},
					Bt = function (e) {
						return {
							id: e.id,
							timestamp: Math.round(e.timestamp.getTime() / 1e3),
							type: e.type,
							metadata: e.metadata,
							details: e.details,
						}
					},
					Nt = function (e) {
						return Mt(void 0, void 0, void 0, function () {
							var t, n
							return Ut(this, function (r) {
								switch (r.label) {
									case 0:
										return (
											(t = new Rt.Sha256()).update(e), (n = Be), [4, t.digest()]
										)
									case 1:
										return [2, n.apply(void 0, [r.sent()]).toLowerCase()]
								}
							})
						})
					},
					Ft = (function () {
						function e() {}
						return (
							(e.prototype.handle = function (e) {
								var t = this.sendBeacon(e)
								return new Promise(function (e, n) {
									t ? e({ response: new c({ statusCode: 200 }) }) : n()
								})
							}),
							(e.prototype.sendBeacon = function (e) {
								var t = e.path
								if (e.query) {
									var n = f(e.query)
									n && (t += "?".concat(n))
								}
								var r = e.port,
									o = ""
										.concat(e.protocol, "//")
										.concat(e.hostname)
										.concat(r ? ":".concat(r) : "")
										.concat(t)
								return navigator.sendBeacon(o, e.body)
							}),
							e
						)
					})(),
					zt = (function () {
						function e(e) {
							var t = void 0 === e ? {} : e,
								n = t.fetchFunction,
								r = t.requestTimeout
							;(this.requestTimeout = r), (this.fetchFunction = n)
						}
						return (
							(e.prototype.destroy = function () {}),
							(e.prototype.handle = function (e, t) {
								var n = (void 0 === t ? {} : t).abortSignal,
									r = this.requestTimeout
								if (null == n ? void 0 : n.aborted) {
									var o = new Error("Request aborted")
									return (o.name = "AbortError"), Promise.reject(o)
								}
								var i = e.path
								if (e.query) {
									var a = f(e.query)
									a && (i += "?".concat(a))
								}
								var s = e.port,
									u = e.method,
									l = ""
										.concat(e.protocol, "//")
										.concat(e.hostname)
										.concat(s ? ":".concat(s) : "")
										.concat(i),
									d = {
										body: "GET" === u || "HEAD" === u ? void 0 : e.body,
										headers: new Headers(e.headers),
										method: u,
									}
								"undefined" != typeof AbortController && (d.signal = n)
								var h,
									p = new Request(l, d),
									v = [
										this.fetchFunction.apply(window, [p]).then(function (e) {
											for (
												var t = e.headers, n = {}, r = 0, o = t.entries();
												r < o.length;
												r++
											) {
												var i = o[r]
												n[i[0]] = i[1]
											}
											return void 0 !== e.body
												? {
														response: new c({
															headers: n,
															statusCode: e.status,
															body: e.body,
														}),
													}
												: e.blob().then(function (t) {
														return {
															response: new c({
																headers: n,
																statusCode: e.status,
																body: t,
															}),
														}
													})
										}),
										((h = r),
										void 0 === h && (h = 0),
										new Promise(function (e, t) {
											h &&
												setTimeout(function () {
													var e = new Error(
														"Request did not complete within ".concat(h, " ms"),
													)
													;(e.name = "TimeoutError"), t(e)
												}, h)
										})),
									]
								return (
									n &&
										v.push(
											new Promise(function (e, t) {
												n.onabort = function () {
													var e = new Error("Request aborted")
													;(e.name = "AbortError"), t(e)
												}
											}),
										),
									Promise.race(v)
								)
							}),
							e
						)
					})(),
					$t = function (e) {
						if (crypto) return crypto.getRandomValues(e)
						if (msCrypto) return msCrypto.getRandomValues(e)
						throw new Error("No crypto library found.")
					},
					Vt = [],
					Wt = 0;
				Wt < 256;
				Wt++
			)
				Vt[Wt] = (Wt + 256).toString(16).substr(1)
			var Kt,
				Xt,
				Gt = "X-Amzn-Trace-Id",
				Zt = function (e, t) {
					return Array.isArray(t)
						? t.some(function (t) {
								return t.test(e)
							})
						: t
				},
				Jt = {
					logicalServiceName: "rum.aws.amazon.com",
					urlsToInclude: [/.*/],
					urlsToExclude: [
						/cognito\-identity\.([^\.]*\.)?amazonaws\.com/,
						/sts\.([^\.]*\.)?amazonaws\.com/,
					],
					stackTraceLength: 200,
					recordAllRequests: !1,
					addXRayTraceIdHeader: !1,
				},
				Yt = function (e) {
					return 4 === Math.floor(e / 100)
				},
				Qt = function (e) {
					return 5 === Math.floor(e / 100)
				},
				en = function (e) {
					return 429 === e
				},
				tn = function (e, t) {
					var n = t.urlsToInclude.some(function (t) {
							return t.test(e)
						}),
						r = t.urlsToExclude.some(function (t) {
							return t.test(e)
						})
					return n && !r
				},
				nn = function () {
					return Date.now() / 1e3
				},
				rn = function (e, t, n) {
					var r = {
						version: "1.0.0",
						name: e,
						origin: "AWS::RUM::AppMonitor",
						id: ln(),
						start_time: t,
						trace_id: un(),
						end_time: void 0,
						subsegments: [],
						in_progress: !1,
					}
					return n && (r.http = n), r
				},
				on = function (e, t, n) {
					var r = {
						id: ln(),
						name: e,
						start_time: t,
						end_time: void 0,
						in_progress: !1,
						namespace: e.endsWith("amazonaws.com") ? "aws" : "remote",
					}
					return n && (r.http = n), r
				},
				an = function (e) {
					try {
						return e.hostname
							? e.hostname
							: e.url
								? new URL(e.url).hostname
								: new URL(e.toString()).hostname
					} catch (e) {
						return window.location.hostname
					}
				},
				sn = function (e, t) {
					return "Root=" + e + ";Parent=" + t + ";Sampled=1"
				},
				cn = function (e) {
					return e.url ? e.url : e.toString()
				},
				un = function () {
					return "1-".concat(fn(), "-").concat(dn())
				},
				ln = function () {
					var e = new Uint8Array(8)
					return $t(e), hn(e)
				},
				fn = function () {
					return Math.floor(Date.now() / 1e3).toString(16)
				},
				dn = function () {
					var e = new Uint8Array(12)
					return $t(e), hn(e)
				},
				hn = function (e) {
					for (var t = "", n = 0; n < e.length; n++) t += Vt[e[n]]
					return t
				},
				pn = function (e, t, n, r) {
					return new (n || (n = Promise))(function (o, i) {
						function a(e) {
							try {
								c(r.next(e))
							} catch (e) {
								i(e)
							}
						}
						function s(e) {
							try {
								c(r.throw(e))
							} catch (e) {
								i(e)
							}
						}
						function c(e) {
							var t
							e.done
								? o(e.value)
								: ((t = e.value),
									t instanceof n
										? t
										: new n(function (e) {
												e(t)
											})).then(a, s)
						}
						c((r = r.apply(e, t || [])).next())
					})
				},
				vn = function (e, t) {
					var n,
						r,
						o,
						i,
						a = {
							label: 0,
							sent: function () {
								if (1 & o[0]) throw o[1]
								return o[1]
							},
							trys: [],
							ops: [],
						}
					return (
						(i = { next: s(0), throw: s(1), return: s(2) }),
						"function" == typeof Symbol &&
							(i[Symbol.iterator] = function () {
								return this
							}),
						i
					)
					function s(i) {
						return function (s) {
							return (function (i) {
								if (n) throw new TypeError("Generator is already executing.")
								for (; a; )
									try {
										if (
											((n = 1),
											r &&
												(o =
													2 & i[0]
														? r.return
														: i[0]
															? r.throw || ((o = r.return) && o.call(r), 0)
															: r.next) &&
												!(o = o.call(r, i[1])).done)
										)
											return o
										switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
											case 0:
											case 1:
												o = i
												break
											case 4:
												return a.label++, { value: i[1], done: !1 }
											case 5:
												a.label++, (r = i[1]), (i = [0])
												continue
											case 7:
												;(i = a.ops.pop()), a.trys.pop()
												continue
											default:
												if (
													!((o = a.trys),
													(o = o.length > 0 && o[o.length - 1]) ||
														(6 !== i[0] && 2 !== i[0]))
												) {
													a = 0
													continue
												}
												if (
													3 === i[0] &&
													(!o || (i[1] > o[0] && i[1] < o[3]))
												) {
													a.label = i[1]
													break
												}
												if (6 === i[0] && a.label < o[1]) {
													;(a.label = o[1]), (o = i)
													break
												}
												if (o && a.label < o[2]) {
													;(a.label = o[2]), a.ops.push(i)
													break
												}
												o[2] && a.ops.pop(), a.trys.pop()
												continue
										}
										i = t.call(e, a)
									} catch (e) {
										;(i = [6, e]), (r = 0)
									} finally {
										n = o = 0
									}
								if (5 & i[0]) throw i[1]
								return { value: i[0] ? i[1] : void 0, done: !0 }
							})([i, s])
						}
					}
				},
				yn = (function () {
					function e(e, t, n) {
						void 0 === n &&
							(n = function (e) {
								return 2e3 * Math.pow(2, e - 1)
							}),
							(this.handler = e),
							(this.retries = t),
							(this.backoff = n)
					}
					return (
						(e.prototype.handle = function (e) {
							return pn(this, void 0, void 0, function () {
								var t, n, r
								return vn(this, function (o) {
									switch (o.label) {
										case 0:
											;(t = this.retries), (o.label = 1)
										case 1:
											0, (o.label = 2)
										case 2:
											return (
												o.trys.push([2, 4, , 6]), [4, this.handler.handle(e)]
											)
										case 3:
											if (
												((n = o.sent()),
												200 <= (i = n.response.statusCode) && i < 300)
											)
												return [2, n]
											throw n.response.statusCode
										case 4:
											if ("number" == typeof (r = o.sent()) && !en(r) && !Qt(r))
												throw new Error("".concat(r))
											if (t <= 0) throw r
											return (
												t--, [4, this.sleep(this.backoff(this.retries - t))]
											)
										case 5:
											return o.sent(), [3, 6]
										case 6:
											return [3, 1]
										case 7:
											return [2]
									}
									var i
								})
							})
						}),
						(e.prototype.sleep = function (e) {
							return pn(this, void 0, void 0, function () {
								return vn(this, function (t) {
									return [
										2,
										new Promise(function (t) {
											return setTimeout(t, e)
										}),
									]
								})
							})
						}),
						e
					)
				})(),
				gn = function (e, t, n, r) {
					return new (n || (n = Promise))(function (o, i) {
						function a(e) {
							try {
								c(r.next(e))
							} catch (e) {
								i(e)
							}
						}
						function s(e) {
							try {
								c(r.throw(e))
							} catch (e) {
								i(e)
							}
						}
						function c(e) {
							var t
							e.done
								? o(e.value)
								: ((t = e.value),
									t instanceof n
										? t
										: new n(function (e) {
												e(t)
											})).then(a, s)
						}
						c((r = r.apply(e, t || [])).next())
					})
				},
				mn = function (e, t) {
					var n,
						r,
						o,
						i,
						a = {
							label: 0,
							sent: function () {
								if (1 & o[0]) throw o[1]
								return o[1]
							},
							trys: [],
							ops: [],
						}
					return (
						(i = { next: s(0), throw: s(1), return: s(2) }),
						"function" == typeof Symbol &&
							(i[Symbol.iterator] = function () {
								return this
							}),
						i
					)
					function s(i) {
						return function (s) {
							return (function (i) {
								if (n) throw new TypeError("Generator is already executing.")
								for (; a; )
									try {
										if (
											((n = 1),
											r &&
												(o =
													2 & i[0]
														? r.return
														: i[0]
															? r.throw || ((o = r.return) && o.call(r), 0)
															: r.next) &&
												!(o = o.call(r, i[1])).done)
										)
											return o
										switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
											case 0:
											case 1:
												o = i
												break
											case 4:
												return a.label++, { value: i[1], done: !1 }
											case 5:
												a.label++, (r = i[1]), (i = [0])
												continue
											case 7:
												;(i = a.ops.pop()), a.trys.pop()
												continue
											default:
												if (
													!((o = a.trys),
													(o = o.length > 0 && o[o.length - 1]) ||
														(6 !== i[0] && 2 !== i[0]))
												) {
													a = 0
													continue
												}
												if (
													3 === i[0] &&
													(!o || (i[1] > o[0] && i[1] < o[3]))
												) {
													a.label = i[1]
													break
												}
												if (6 === i[0] && a.label < o[1]) {
													;(a.label = o[1]), (o = i)
													break
												}
												if (o && a.label < o[2]) {
													;(a.label = o[2]), a.ops.push(i)
													break
												}
												o[2] && a.ops.pop(), a.trys.pop()
												continue
										}
										i = t.call(e, a)
									} catch (e) {
										;(i = [6, e]), (r = 0)
									} finally {
										n = o = 0
									}
								if (5 & i[0]) throw i[1]
								return { value: i[0] ? i[1] : void 0, done: !0 }
							})([i, s])
						}
					}
				},
				bn = "CWR: Cannot dispatch; no AWS credentials.",
				wn = (function () {
					function e(e, t, n, r) {
						var o = this
						;(this.disableCodes = ["403", "404"]),
							(this.dispatchFetch = function () {
								return gn(o, void 0, void 0, function () {
									return mn(this, function (e) {
										return this.doRequest()
											? [
													2,
													this.rum
														.sendFetch(this.createRequest())
														.catch(this.handleReject),
												]
											: [2]
									})
								})
							}),
							(this.dispatchBeacon = function () {
								return gn(o, void 0, void 0, function () {
									var e,
										t = this
									return mn(this, function (n) {
										return this.doRequest()
											? ((e = this.createRequest()),
												[
													2,
													this.rum.sendBeacon(e).catch(function () {
														return t.rum.sendFetch(e)
													}),
												])
											: [2]
									})
								})
							}),
							(this.dispatchFetchFailSilent = function () {
								return gn(o, void 0, void 0, function () {
									return mn(this, function (e) {
										return [2, this.dispatchFetch().catch(function () {})]
									})
								})
							}),
							(this.dispatchBeaconFailSilent = function () {
								return gn(o, void 0, void 0, function () {
									return mn(this, function (e) {
										return [2, this.dispatchBeacon().catch(function () {})]
									})
								})
							}),
							(this.handleReject = function (e) {
								throw (
									(e instanceof Error &&
										o.disableCodes.includes(e.message) &&
										o.disable(),
									e)
								)
							}),
							(this.defaultClientBuilder = function (e, t, n) {
								return new Ht({
									fetchRequestHandler: new yn(
										new zt({ fetchFunction: o.config.fetchFunction }),
										o.config.retries,
									),
									beaconRequestHandler: new Ft(),
									endpoint: e,
									region: t,
									credentials: n,
								})
							}),
							(this.region = e),
							(this.endpoint = t),
							(this.eventCache = n),
							(this.enabled = !0),
							(this.buildClient = r.clientBuilder || this.defaultClientBuilder),
							(this.config = r),
							this.startDispatchTimer(),
							r.signing
								? (this.rum = {
										sendFetch: function () {
											return Promise.reject(new Error(bn))
										},
										sendBeacon: function () {
											return Promise.reject(new Error(bn))
										},
									})
								: (this.rum = this.buildClient(
										this.endpoint,
										this.region,
										void 0,
									))
					}
					return (
						(e.prototype.enable = function () {
							;(this.enabled = !0), this.startDispatchTimer()
						}),
						(e.prototype.disable = function () {
							this.stopDispatchTimer(), (this.enabled = !1)
						}),
						(e.prototype.setAwsCredentials = function (e) {
							;(this.rum = this.buildClient(this.endpoint, this.region, e)),
								"function" == typeof e && e()
						}),
						(e.prototype.startDispatchTimer = function () {
							document.addEventListener(
								"visibilitychange",
								this.config.useBeacon
									? this.dispatchBeaconFailSilent
									: this.dispatchFetchFailSilent,
							),
								document.addEventListener(
									"pagehide",
									this.config.useBeacon
										? this.dispatchBeaconFailSilent
										: this.dispatchFetchFailSilent,
								),
								this.config.dispatchInterval <= 0 ||
									this.dispatchTimerId ||
									(this.dispatchTimerId = window.setInterval(
										this.dispatchFetchFailSilent,
										this.config.dispatchInterval,
									))
						}),
						(e.prototype.stopDispatchTimer = function () {
							document.removeEventListener(
								"visibilitychange",
								this.config.useBeacon
									? this.dispatchBeaconFailSilent
									: this.dispatchFetchFailSilent,
							),
								document.removeEventListener(
									"pagehide",
									this.config.useBeacon
										? this.dispatchBeaconFailSilent
										: this.dispatchFetchFailSilent,
								),
								this.dispatchTimerId &&
									(window.clearInterval(this.dispatchTimerId),
									(this.dispatchTimerId = void 0))
						}),
						(e.prototype.doRequest = function () {
							return this.enabled && this.eventCache.hasEvents()
						}),
						(e.prototype.createRequest = function () {
							return {
								BatchId: Ee(),
								AppMonitorDetails: this.eventCache.getAppMonitorDetails(),
								UserDetails: this.eventCache.getUserDetails(),
								RumEvents: this.eventCache.getEventBatch(),
							}
						}),
						e
					)
				})()
			!(function (e) {
				;(e.OTHER = "other"),
					(e.STYLESHEET = "stylesheet"),
					(e.DOCUMENT = "document"),
					(e.SCRIPT = "script"),
					(e.IMAGE = "image"),
					(e.FONT = "font")
			})(Kt || (Kt = {})),
				(function (e) {
					;(e.IMG = "img"),
						(e.IMAGE = "image"),
						(e.INPUT = "input"),
						(e.IFRAME = "iframe"),
						(e.FRAME = "frame"),
						(e.SCRIPT = "script"),
						(e.CSS = "css")
				})(Xt || (Xt = {}))
			var En,
				Sn,
				Tn,
				Cn,
				_n,
				An,
				On = function (e) {
					return [e.startTime, e.duration].join("#")
				},
				In = [
					{ name: Kt.STYLESHEET, list: ["css", "less"] },
					{
						name: Kt.DOCUMENT,
						list: ["htm", "html", "ts", "doc", "docx", "pdf", "xls", "xlsx"],
					},
					{ name: Kt.SCRIPT, list: ["js"] },
					{
						name: Kt.IMAGE,
						list: [
							"ai",
							"bmp",
							"gif",
							"ico",
							"jpeg",
							"jpg",
							"png",
							"ps",
							"psd",
							"svg",
							"tif",
							"tiff",
						],
					},
					{ name: Kt.FONT, list: ["fnt", "fon", "otf", "ttf", "woff"] },
				],
				Pn = function (e, t) {
					var n = Kt.OTHER
					if (e) {
						var r = e.substring(e.lastIndexOf("/") + 1),
							o = r.substring(r.lastIndexOf(".") + 1).split(/[?#]/)[0]
						In.forEach(function (e) {
							e.list.indexOf(o) > -1 && (n = e.name)
						})
					}
					if (t && n === Kt.OTHER)
						switch (t) {
							case Xt.IMAGE:
							case Xt.IMG:
							case Xt.INPUT:
								n = Kt.IMAGE
								break
							case Xt.IFRAME:
							case Xt.FRAME:
								n = Kt.DOCUMENT
								break
							case Xt.SCRIPT:
								n = Kt.SCRIPT
								break
							case Xt.CSS:
								n = Kt.STYLESHEET
						}
					return n
				},
				xn =
					/.*\/application\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/events/,
				kn = {
					eventLimit: 10,
					ignore: function (e) {
						return (
							"resource" === e.entryType &&
							(!/^https?:/.test(e.name) ||
								/^(fetch|xmlhttprequest)$/.test(e.initiatorType))
						)
					},
					recordAllTypes: [Kt.DOCUMENT, Kt.SCRIPT, Kt.STYLESHEET, Kt.FONT],
					sampleTypes: [Kt.IMAGE, Kt.OTHER],
				},
				Ln = (function () {
					var e = function (t, n) {
						return (
							(e =
								Object.setPrototypeOf ||
								({ __proto__: [] } instanceof Array &&
									function (e, t) {
										e.__proto__ = t
									}) ||
								function (e, t) {
									for (var n in t)
										Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
								}),
							e(t, n)
						)
					}
					return function (t, n) {
						if ("function" != typeof n && null !== n)
							throw new TypeError(
								"Class extends value " +
									String(n) +
									" is not a constructor or null",
							)
						function r() {
							this.constructor = t
						}
						e(t, n),
							(t.prototype =
								null === n
									? Object.create(n)
									: ((r.prototype = n.prototype), new r()))
					}
				})(),
				Rn = function () {
					return (
						(Rn =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						Rn.apply(this, arguments)
					)
				},
				jn = "navigation",
				Mn = "load",
				Un = (function (e) {
					function t(t) {
						var n = e.call(this, "navigation") || this
						return (
							(n.eventListener = function () {
								if (0 === performance.getEntriesByType(jn).length)
									n.performanceNavigationEventHandlerTimingLevel1()
								else {
									var e = new PerformanceObserver(function (e) {
										e.getEntries()
											.filter(function (e) {
												return e.entryType === jn
											})
											.filter(function (e) {
												return !n.config.ignore(e)
											})
											.forEach(function (e) {
												n.performanceNavigationEventHandlerTimingLevel2(e)
											})
									})
									e.observe({ entryTypes: [jn] })
								}
							}),
							(n.performanceNavigationEventHandlerTimingLevel1 = function () {
								setTimeout(function () {
									var e,
										t = performance.timing,
										r = t.navigationStart,
										o = {
											version: "1.0.0",
											initiatorType: "navigation",
											startTime: 0,
											unloadEventStart:
												t.unloadEventStart > 0 ? t.unloadEventStart - r : 0,
											promptForUnload: t.unloadEventEnd - t.unloadEventStart,
											redirectStart:
												t.redirectStart > 0 ? t.redirectStart - r : 0,
											redirectTime: t.redirectEnd - t.redirectStart,
											fetchStart: t.fetchStart > 0 ? t.fetchStart - r : 0,
											domainLookupStart:
												t.domainLookupStart > 0 ? t.domainLookupStart - r : 0,
											dns: t.domainLookupEnd - t.domainLookupStart,
											connectStart: t.connectStart > 0 ? t.connectStart - r : 0,
											connect: t.connectEnd - t.connectStart,
											secureConnectionStart:
												t.secureConnectionStart > 0
													? t.secureConnectionStart - r
													: 0,
											tlsTime:
												t.secureConnectionStart > 0
													? t.connectEnd - t.secureConnectionStart
													: 0,
											requestStart: t.requestStart > 0 ? t.requestStart - r : 0,
											timeToFirstByte: t.responseStart - t.requestStart,
											responseStart:
												t.responseStart > 0 ? t.responseStart - r : 0,
											responseTime:
												t.responseStart > 0
													? t.responseEnd - t.responseStart
													: 0,
											domInteractive:
												t.domInteractive > 0 ? t.domInteractive - r : 0,
											domContentLoadedEventStart:
												t.domContentLoadedEventStart > 0
													? t.domContentLoadedEventStart - r
													: 0,
											domContentLoaded:
												t.domContentLoadedEventEnd -
												t.domContentLoadedEventStart,
											domComplete: t.domComplete > 0 ? t.domComplete - r : 0,
											domProcessingTime: t.loadEventStart - t.responseEnd,
											loadEventStart:
												t.loadEventStart > 0 ? t.loadEventStart - r : 0,
											loadEventTime: t.loadEventEnd - t.loadEventStart,
											duration: t.loadEventEnd - t.navigationStart,
											navigationTimingLevel: 1,
										}
									;(null === (e = n.context) || void 0 === e
										? void 0
										: e.record) && n.context.record(W, o)
								}, 0)
							}),
							(n.performanceNavigationEventHandlerTimingLevel2 = function (e) {
								var t,
									r = {
										version: "1.0.0",
										initiatorType: e.initiatorType,
										navigationType: e.type,
										startTime: e.startTime,
										unloadEventStart: e.unloadEventStart,
										promptForUnload: e.unloadEventEnd - e.unloadEventStart,
										redirectCount: e.redirectCount,
										redirectStart: e.redirectStart,
										redirectTime: e.redirectEnd - e.redirectStart,
										workerStart: e.workerStart,
										workerTime:
											e.workerStart > 0 ? e.fetchStart - e.workerStart : 0,
										fetchStart: e.fetchStart,
										domainLookupStart: e.domainLookupStart,
										dns: e.domainLookupEnd - e.domainLookupStart,
										nextHopProtocol: e.nextHopProtocol,
										connectStart: e.connectStart,
										connect: e.connectEnd - e.connectStart,
										secureConnectionStart: e.secureConnectionStart,
										tlsTime:
											e.secureConnectionStart > 0
												? e.connectEnd - e.secureConnectionStart
												: 0,
										requestStart: e.requestStart,
										timeToFirstByte: e.responseStart - e.requestStart,
										responseStart: e.responseStart,
										responseTime:
											e.responseStart > 0 ? e.responseEnd - e.responseStart : 0,
										domInteractive: e.domInteractive,
										domContentLoadedEventStart: e.domContentLoadedEventStart,
										domContentLoaded:
											e.domContentLoadedEventEnd - e.domContentLoadedEventStart,
										domComplete: e.domComplete,
										domProcessingTime: e.loadEventStart - e.responseEnd,
										loadEventStart: e.loadEventStart,
										loadEventTime: e.loadEventEnd - e.loadEventStart,
										duration: e.duration,
										headerSize:
											e.transferSize > 0
												? e.transferSize - e.encodedBodySize
												: 0,
										transferSize: e.transferSize,
										compressionRatio:
											e.encodedBodySize > 0
												? e.decodedBodySize / e.encodedBodySize
												: 0,
										navigationTimingLevel: 2,
									}
								;(null === (t = n.context) || void 0 === t
									? void 0
									: t.record) && n.context.record(W, r)
							}),
							(n.config = Rn(Rn({}, kn), t)),
							n
						)
					}
					return (
						Ln(t, e),
						(t.prototype.enable = function () {
							this.enabled ||
								((this.enabled = !0),
								window.addEventListener(Mn, this.eventListener))
						}),
						(t.prototype.disable = function () {
							this.enabled &&
								((this.enabled = !1),
								this.eventListener &&
									window.removeEventListener(Mn, this.eventListener))
						}),
						(t.prototype.hasTheWindowLoadEventFired = function () {
							if (
								window.performance &&
								window.performance.getEntriesByType(jn).length
							) {
								var e = window.performance.getEntriesByType(jn)[0]
								return Boolean(e.loadEventEnd)
							}
							return !1
						}),
						(t.prototype.onload = function () {
							var e = this
							this.enabled &&
								(this.hasTheWindowLoadEventFired()
									? window.performance
											.getEntriesByType(jn)
											.filter(function (t) {
												return !e.config.ignore(t)
											})
											.forEach(function (t) {
												return e.performanceNavigationEventHandlerTimingLevel2(
													t,
												)
											})
									: window.addEventListener(Mn, this.eventListener))
						}),
						t
					)
				})(J),
				Dn = (function () {
					var e = function (t, n) {
						return (
							(e =
								Object.setPrototypeOf ||
								({ __proto__: [] } instanceof Array &&
									function (e, t) {
										e.__proto__ = t
									}) ||
								function (e, t) {
									for (var n in t)
										Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
								}),
							e(t, n)
						)
					}
					return function (t, n) {
						if ("function" != typeof n && null !== n)
							throw new TypeError(
								"Class extends value " +
									String(n) +
									" is not a constructor or null",
							)
						function r() {
							this.constructor = t
						}
						e(t, n),
							(t.prototype =
								null === n
									? Object.create(n)
									: ((r.prototype = n.prototype), new r()))
					}
				})(),
				Hn = function () {
					return (
						(Hn =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						Hn.apply(this, arguments)
					)
				},
				qn = "resource",
				Bn = (function (e) {
					function t(t) {
						var n = e.call(this, "resource") || this
						return (
							(n.performanceEntryHandler = function (e) {
								n.recordPerformanceEntries(e.getEntries())
							}),
							(n.recordPerformanceEntries = function (e) {
								var t = [],
									r = []
								for (
									e
										.filter(function (e) {
											return e.entryType === qn
										})
										.filter(function (e) {
											return !n.config.ignore(e)
										})
										.forEach(function (e) {
											var o = e,
												i = o.name,
												a = o.initiatorType,
												s = Pn(i, a)
											n.config.recordAllTypes.includes(s)
												? t.push(e)
												: n.config.sampleTypes.includes(s) && r.push(e)
										}),
										t.forEach(function (e) {
											return n.recordResourceEvent(e)
										}),
										(function (e) {
											for (var t = e.length - 1; t > 0; t--) {
												var n = Math.floor(Math.random() * (t + 1)),
													r = e[t]
												;(e[t] = e[n]), (e[n] = r)
											}
										})(r);
									r.length > 0 && n.eventCount < n.config.eventLimit;

								)
									n.recordResourceEvent(r.pop()), n.eventCount++
							}),
							(n.recordResourceEvent = function (e) {
								var t,
									r = e.name,
									o = e.startTime,
									i = e.initiatorType,
									a = e.duration,
									s = e.transferSize
								if (
									!(function (e, t) {
										try {
											return new URL(e).hostname === t && xn.test(e)
										} catch (e) {
											return !1
										}
									})(r, n.context.config.endpointUrl.hostname) &&
									(null === (t = n.context) || void 0 === t ? void 0 : t.record)
								) {
									var c = {
										version: "1.0.0",
										initiatorType: i,
										startTime: o,
										duration: a,
										fileType: Pn(r, i),
										transferSize: s,
									}
									n.context.config.recordResourceUrl && (c.targetUrl = r),
										n.context.record(K, c)
								}
							}),
							(n.config = Hn(Hn({}, kn), t)),
							(n.eventCount = 0),
							(n.resourceObserver = new PerformanceObserver(
								n.performanceEntryHandler,
							)),
							n
						)
					}
					return (
						Dn(t, e),
						(t.prototype.enable = function () {
							this.enabled ||
								((this.enabled = !0),
								this.resourceObserver.observe({ type: qn, buffered: !0 }))
						}),
						(t.prototype.disable = function () {
							this.enabled &&
								((this.enabled = !1), this.resourceObserver.disconnect())
						}),
						(t.prototype.onload = function () {
							this.resourceObserver.observe({ type: qn, buffered: !0 })
						}),
						t
					)
				})(J),
				Nn = function () {
					return (
						window.performance &&
						performance.getEntriesByType &&
						performance.getEntriesByType("navigation")[0]
					)
				},
				Fn = function (e) {
					if ("loading" === document.readyState) return "loading"
					var t = Nn()
					if (t) {
						if (e < t.domInteractive) return "loading"
						if (
							0 === t.domContentLoadedEventStart ||
							e < t.domContentLoadedEventStart
						)
							return "dom-interactive"
						if (0 === t.domComplete || e < t.domComplete)
							return "dom-content-loaded"
					}
					return "complete"
				},
				zn = function (e) {
					var t = e.nodeName
					return 1 === e.nodeType
						? t.toLowerCase()
						: t.toUpperCase().replace(/^#/, "")
				},
				$n = function (e, t) {
					var n = ""
					try {
						for (; e && 9 !== e.nodeType; ) {
							var r = e,
								o = r.id
									? "#" + r.id
									: zn(r) +
										(r.className && r.className.length
											? "." + r.className.replace(/\s+/g, ".")
											: "")
							if (n.length + o.length > (t || 100) - 1) return n || o
							if (((n = n ? o + ">" + n : o), r.id)) break
							e = r.parentNode
						}
					} catch (e) {}
					return n
				},
				Vn = -1,
				Wn = function () {
					return Vn
				},
				Kn = function (e) {
					addEventListener(
						"pageshow",
						function (t) {
							t.persisted && ((Vn = t.timeStamp), e(t))
						},
						!0,
					)
				},
				Xn = function () {
					var e = Nn()
					return (e && e.activationStart) || 0
				},
				Gn = function (e, t) {
					var n = Nn(),
						r = "navigate"
					return (
						Wn() >= 0
							? (r = "back-forward-cache")
							: n &&
								(r =
									document.prerendering || Xn() > 0
										? "prerender"
										: n.type.replace(/_/g, "-")),
						{
							name: e,
							value: void 0 === t ? -1 : t,
							rating: "good",
							delta: 0,
							entries: [],
							id: "v3-"
								.concat(Date.now(), "-")
								.concat(Math.floor(8999999999999 * Math.random()) + 1e12),
							navigationType: r,
						}
					)
				},
				Zn = function (e, t, n) {
					try {
						if (PerformanceObserver.supportedEntryTypes.includes(e)) {
							var r = new PerformanceObserver(function (e) {
								t(e.getEntries())
							})
							return (
								r.observe(Object.assign({ type: e, buffered: !0 }, n || {})), r
							)
						}
					} catch (e) {}
				},
				Jn = function (e, t) {
					var n = function n(r) {
						;("pagehide" !== r.type && "hidden" !== document.visibilityState) ||
							(e(r),
							t &&
								(removeEventListener("visibilitychange", n, !0),
								removeEventListener("pagehide", n, !0)))
					}
					addEventListener("visibilitychange", n, !0),
						addEventListener("pagehide", n, !0)
				},
				Yn = function (e, t, n, r) {
					var o, i
					return function (a) {
						t.value >= 0 &&
							(a || r) &&
							((i = t.value - (o || 0)) || void 0 === o) &&
							((o = t.value),
							(t.delta = i),
							(t.rating = (function (e, t) {
								return e > t[1]
									? "poor"
									: e > t[0]
										? "needs-improvement"
										: "good"
							})(t.value, n)),
							e(t))
					}
				},
				Qn = -1,
				er = function () {
					return "hidden" !== document.visibilityState || document.prerendering
						? 1 / 0
						: 0
				},
				tr = function () {
					Jn(function (e) {
						var t = e.timeStamp
						Qn = t
					}, !0)
				},
				nr = function () {
					return (
						Qn < 0 &&
							((Qn = er()),
							tr(),
							Kn(function () {
								setTimeout(function () {
									;(Qn = er()), tr()
								}, 0)
							})),
						{
							get firstHiddenTime() {
								return Qn
							},
						}
					)
				},
				rr = function (e, t) {
					t = t || {}
					var n,
						r = [1800, 3e3],
						o = nr(),
						i = Gn("FCP"),
						a = function (e) {
							e.forEach(function (e) {
								"first-contentful-paint" === e.name &&
									(c && c.disconnect(),
									e.startTime < o.firstHiddenTime &&
										((i.value = e.startTime - Xn()), i.entries.push(e), n(!0)))
							})
						},
						s =
							window.performance &&
							window.performance.getEntriesByName &&
							window.performance.getEntriesByName("first-contentful-paint")[0],
						c = s ? null : Zn("paint", a)
					;(s || c) &&
						((n = Yn(e, i, r, t.reportAllChanges)),
						s && a([s]),
						Kn(function (o) {
							;(i = Gn("FCP")),
								(n = Yn(e, i, r, t.reportAllChanges)),
								requestAnimationFrame(function () {
									requestAnimationFrame(function () {
										;(i.value = performance.now() - o.timeStamp), n(!0)
									})
								})
						}))
				},
				or = !1,
				ir = -1,
				ar = { passive: !0, capture: !0 },
				sr = new Date(),
				cr = function (e, t) {
					En ||
						((En = t),
						(Sn = e),
						(Tn = new Date()),
						fr(removeEventListener),
						ur())
				},
				ur = function () {
					if (Sn >= 0 && Sn < Tn - sr) {
						var e = {
							entryType: "first-input",
							name: En.type,
							target: En.target,
							cancelable: En.cancelable,
							startTime: En.timeStamp,
							processingStart: En.timeStamp + Sn,
						}
						Cn.forEach(function (t) {
							t(e)
						}),
							(Cn = [])
					}
				},
				lr = function (e) {
					if (e.cancelable) {
						var t =
							(e.timeStamp > 1e12 ? new Date() : performance.now()) -
							e.timeStamp
						"pointerdown" == e.type
							? (function (e, t) {
									var n = function () {
											cr(e, t), o()
										},
										r = function () {
											o()
										},
										o = function () {
											removeEventListener("pointerup", n, ar),
												removeEventListener("pointercancel", r, ar)
										}
									addEventListener("pointerup", n, ar),
										addEventListener("pointercancel", r, ar)
								})(t, e)
							: cr(t, e)
					}
				},
				fr = function (e) {
					;["mousedown", "keydown", "touchstart", "pointerdown"].forEach(
						function (t) {
							return e(t, lr, ar)
						},
					)
				},
				dr = function (e, t) {
					t = t || {}
					var n,
						r = [100, 300],
						o = nr(),
						i = Gn("FID"),
						a = function (e) {
							e.startTime < o.firstHiddenTime &&
								((i.value = e.processingStart - e.startTime),
								i.entries.push(e),
								n(!0))
						},
						s = function (e) {
							e.forEach(a)
						},
						c = Zn("first-input", s)
					;(n = Yn(e, i, r, t.reportAllChanges)),
						c &&
							Jn(function () {
								s(c.takeRecords()), c.disconnect()
							}, !0),
						c &&
							Kn(function () {
								var o
								;(i = Gn("FID")),
									(n = Yn(e, i, r, t.reportAllChanges)),
									(Cn = []),
									(Sn = -1),
									(En = null),
									fr(addEventListener),
									(o = a),
									Cn.push(o),
									ur()
							})
				},
				hr = {},
				pr = (function () {
					var e = function (t, n) {
						return (
							(e =
								Object.setPrototypeOf ||
								({ __proto__: [] } instanceof Array &&
									function (e, t) {
										e.__proto__ = t
									}) ||
								function (e, t) {
									for (var n in t)
										Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
								}),
							e(t, n)
						)
					}
					return function (t, n) {
						if ("function" != typeof n && null !== n)
							throw new TypeError(
								"Class extends value " +
									String(n) +
									" is not a constructor or null",
							)
						function r() {
							this.constructor = t
						}
						e(t, n),
							(t.prototype =
								null === n
									? Object.create(n)
									: ((r.prototype = n.prototype), new r()))
					}
				})(),
				vr = (function (e) {
					function t() {
						var t = e.call(this, "web-vitals") || this
						return (
							(t.resourceEventIds = new Map()),
							(t.cacheLCPCandidates =
								PerformanceObserver.supportedEntryTypes.includes(
									"largest-contentful-paint",
								)),
							(t.handleEvent = function (e) {
								switch (e.type) {
									case K:
										var n = e.details
										t.cacheLCPCandidates &&
											n.fileType === Kt.IMAGE &&
											t.resourceEventIds.set(On(e.details), e.id)
										break
									case W:
										t.navigationEventId = e.id
								}
							}),
							t
						)
					}
					return (
						pr(t, e),
						(t.prototype.enable = function () {}),
						(t.prototype.disable = function () {}),
						(t.prototype.configure = function (e) {}),
						(t.prototype.onload = function () {
							var e = this
							this.context.eventBus.subscribe(we.EVENT, this.handleEvent),
								(function (e, t) {
									!(function (e, t) {
										t = t || {}
										var n,
											r = [2500, 4e3],
											o = nr(),
											i = Gn("LCP"),
											a = function (e) {
												var t = e[e.length - 1]
												if (t) {
													var r = t.startTime - Xn()
													r < o.firstHiddenTime &&
														((i.value = r), (i.entries = [t]), n())
												}
											},
											s = Zn("largest-contentful-paint", a)
										if (s) {
											n = Yn(e, i, r, t.reportAllChanges)
											var c = function () {
												hr[i.id] ||
													(a(s.takeRecords()),
													s.disconnect(),
													(hr[i.id] = !0),
													n(!0))
											}
											;["keydown", "click"].forEach(function (e) {
												addEventListener(e, c, { once: !0, capture: !0 })
											}),
												Jn(c, !0),
												Kn(function (o) {
													;(i = Gn("LCP")),
														(n = Yn(e, i, r, t.reportAllChanges)),
														requestAnimationFrame(function () {
															requestAnimationFrame(function () {
																;(i.value = performance.now() - o.timeStamp),
																	(hr[i.id] = !0),
																	n(!0)
															})
														})
												})
										}
									})(function (t) {
										!(function (e) {
											if (e.entries.length) {
												var t = Nn()
												if (t) {
													var n = t.activationStart || 0,
														r = e.entries[e.entries.length - 1],
														o =
															r.url &&
															performance
																.getEntriesByType("resource")
																.filter(function (e) {
																	return e.name === r.url
																})[0],
														i = Math.max(0, t.responseStart - n),
														a = Math.max(
															i,
															o ? (o.requestStart || o.startTime) - n : 0,
														),
														s = Math.max(a, o ? o.responseEnd - n : 0),
														c = Math.max(s, r ? r.startTime - n : 0),
														u = {
															element: $n(r.element),
															timeToFirstByte: i,
															resourceLoadDelay: a - i,
															resourceLoadTime: s - a,
															elementRenderDelay: c - s,
															navigationEntry: t,
															lcpEntry: r,
														}
													r.url && (u.url = r.url),
														o && (u.lcpResourceEntry = o),
														(e.attribution = u)
												}
											} else
												e.attribution = {
													timeToFirstByte: 0,
													resourceLoadDelay: 0,
													resourceLoadTime: 0,
													elementRenderDelay: e.value,
												}
										})(t),
											e(t)
									}, t)
								})(function (t) {
									return e.handleLCP(t)
								}),
								(function (e, t) {
									dr(function (t) {
										!(function (e) {
											var t = e.entries[0]
											e.attribution = {
												eventTarget: $n(t.target),
												eventType: t.name,
												eventTime: t.startTime,
												eventEntry: t,
												loadState: Fn(t.startTime),
											}
										})(t),
											e(t)
									}, t)
								})(function (t) {
									return e.handleFID(t)
								}),
								(function (e, t) {
									!(function (e, t) {
										t = t || {}
										var n = [0.1, 0.25]
										or ||
											(rr(function (e) {
												ir = e.value
											}),
											(or = !0))
										var r,
											o = function (t) {
												ir > -1 && e(t)
											},
											i = Gn("CLS", 0),
											a = 0,
											s = [],
											c = function (e) {
												e.forEach(function (e) {
													if (!e.hadRecentInput) {
														var t = s[0],
															n = s[s.length - 1]
														a &&
														e.startTime - n.startTime < 1e3 &&
														e.startTime - t.startTime < 5e3
															? ((a += e.value), s.push(e))
															: ((a = e.value), (s = [e])),
															a > i.value &&
																((i.value = a), (i.entries = s), r())
													}
												})
											},
											u = Zn("layout-shift", c)
										u &&
											((r = Yn(o, i, n, t.reportAllChanges)),
											Jn(function () {
												c(u.takeRecords()), r(!0)
											}),
											Kn(function () {
												;(a = 0),
													(ir = -1),
													(i = Gn("CLS", 0)),
													(r = Yn(o, i, n, t.reportAllChanges))
											}))
									})(function (t) {
										!(function (e) {
											if (e.entries.length) {
												var t = e.entries.reduce(function (e, t) {
													return e && e.value > t.value ? e : t
												})
												if (t && t.sources && t.sources.length) {
													var n =
														(r = t.sources).find(function (e) {
															return e.node && 1 === e.node.nodeType
														}) || r[0]
													n &&
														(e.attribution = {
															largestShiftTarget: $n(n.node),
															largestShiftTime: t.startTime,
															largestShiftValue: t.value,
															largestShiftSource: n,
															largestShiftEntry: t,
															loadState: Fn(t.startTime),
														})
												}
											} else e.attribution = {}
											var r
										})(t),
											e(t)
									}, t)
								})(function (t) {
									return e.handleCLS(t)
								})
						}),
						(t.prototype.handleLCP = function (e) {
							var t,
								n,
								r = e.attribution,
								o = {
									element: r.element,
									url: r.url,
									timeToFirstByte: r.timeToFirstByte,
									resourceLoadDelay: r.resourceLoadDelay,
									resourceLoadTime: r.resourceLoadTime,
									elementRenderDelay: r.elementRenderDelay,
								}
							if (r.lcpResourceEntry) {
								var i = On(r.lcpResourceEntry)
								o.lcpResourceEntry = this.resourceEventIds.get(i)
							}
							this.navigationEventId &&
								(o.navigationEntry = this.navigationEventId),
								null === (t = this.context) ||
									void 0 === t ||
									t.record(z, {
										version: "1.0.0",
										value: e.value,
										attribution: o,
									}),
								null === (n = this.context) ||
									void 0 === n ||
									n.eventBus.unsubscribe(we.EVENT, this.handleEvent),
								this.resourceEventIds.clear(),
								(this.navigationEventId = void 0)
						}),
						(t.prototype.handleCLS = function (e) {
							var t,
								n = e.attribution
							null === (t = this.context) ||
								void 0 === t ||
								t.record(V, {
									version: "1.0.0",
									value: e.value,
									attribution: {
										largestShiftTarget: n.largestShiftTarget,
										largestShiftValue: n.largestShiftValue,
										largestShiftTime: n.largestShiftTime,
										loadState: n.loadState,
									},
								})
						}),
						(t.prototype.handleFID = function (e) {
							var t,
								n = e.attribution
							null === (t = this.context) ||
								void 0 === t ||
								t.record($, {
									version: "1.0.0",
									value: e.value,
									attribution: {
										eventTarget: n.eventTarget,
										eventType: n.eventType,
										eventTime: n.eventTime,
										loadState: n.loadState,
									},
								})
						}),
						t
					)
				})(J),
				yr = (function () {
					var e = function (t, n) {
						return (
							(e =
								Object.setPrototypeOf ||
								({ __proto__: [] } instanceof Array &&
									function (e, t) {
										e.__proto__ = t
									}) ||
								function (e, t) {
									for (var n in t)
										Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
								}),
							e(t, n)
						)
					}
					return function (t, n) {
						if ("function" != typeof n && null !== n)
							throw new TypeError(
								"Class extends value " +
									String(n) +
									" is not a constructor or null",
							)
						function r() {
							this.constructor = t
						}
						e(t, n),
							(t.prototype =
								null === n
									? Object.create(n)
									: ((r.prototype = n.prototype), new r()))
					}
				})(),
				gr = (function (e) {
					function t(t) {
						var n = e.call(this, t) || this
						return (n.name = "XMLHttpRequest error"), n
					}
					return yr(t, e), t
				})(Error),
				mr = (function () {
					var e = function (t, n) {
						return (
							(e =
								Object.setPrototypeOf ||
								({ __proto__: [] } instanceof Array &&
									function (e, t) {
										e.__proto__ = t
									}) ||
								function (e, t) {
									for (var n in t)
										Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
								}),
							e(t, n)
						)
					}
					return function (t, n) {
						if ("function" != typeof n && null !== n)
							throw new TypeError(
								"Class extends value " +
									String(n) +
									" is not a constructor or null",
							)
						function r() {
							this.constructor = t
						}
						e(t, n),
							(t.prototype =
								null === n
									? Object.create(n)
									: ((r.prototype = n.prototype), new r()))
					}
				})(),
				br = function () {
					return (
						(br =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						br.apply(this, arguments)
					)
				},
				wr = (function (e) {
					function t(t) {
						var n = e.call(this, "xhr") || this
						return (
							(n.addXRayTraceIdHeader = function (e) {
								return Zt(e, n.config.addXRayTraceIdHeader)
							}),
							(n.isTracingEnabled = function () {
								return n.context.config.enableXRay
							}),
							(n.isSessionRecorded = function () {
								var e
								return (
									(null === (e = n.context.getSession()) || void 0 === e
										? void 0
										: e.record) || !1
								)
							}),
							(n.handleXhrLoadEvent = function (e) {
								var t = e.target,
									r = n.xhrMap.get(t)
								if (r) {
									var o = nn()
									;(r.trace.end_time = o),
										(r.trace.subsegments[0].end_time = o),
										(r.trace.subsegments[0].http.response = {
											status: t.status,
										}),
										en(t.status)
											? ((r.trace.subsegments[0].throttle = !0),
												(r.trace.throttle = !0))
											: Yt(t.status)
												? ((r.trace.subsegments[0].error = !0),
													(r.trace.error = !0))
												: Qt(t.status) &&
													((r.trace.subsegments[0].fault = !0),
													(r.trace.fault = !0))
									var i = t.getResponseHeader("Content-Length"),
										a = i ? parseInt(i, 10) : NaN
									isNaN(a) ||
										(r.trace.subsegments[0].http.response.content_length = a),
										n.recordTraceEvent(r.trace),
										n.recordHttpEventWithResponse(r, t)
								}
							}),
							(n.handleXhrErrorEvent = function (e) {
								var t = e.target,
									r = n.xhrMap.get(t),
									o = t.statusText
										? t.status.toString() + ": " + t.statusText
										: t.status.toString()
								if (r) {
									var i = nn()
									;(r.trace.fault = !0),
										(r.trace.end_time = i),
										(r.trace.subsegments[0].end_time = i),
										(r.trace.subsegments[0].fault = !0),
										(r.trace.subsegments[0].cause = {
											exceptions: [
												{ type: "XMLHttpRequest error", message: o },
											],
										}),
										n.recordTraceEvent(r.trace),
										n.recordHttpEventWithError(r, t, new gr(o))
								}
							}),
							(n.handleXhrAbortEvent = function (e) {
								var t = e.target,
									r = n.xhrMap.get(t)
								r && n.handleXhrDetailsOnError(r, t, "XMLHttpRequest abort")
							}),
							(n.handleXhrTimeoutEvent = function (e) {
								var t = e.target,
									r = n.xhrMap.get(t)
								n.handleXhrDetailsOnError(r, t, "XMLHttpRequest timeout")
							}),
							(n.initializeTrace = function (e) {
								var t = nn()
								;(e.trace = rn(n.config.logicalServiceName, t)),
									e.trace.subsegments.push(
										on(an(e.url), t, {
											request: { method: e.method, url: e.url, traced: !0 },
										}),
									)
							}),
							(n.sendWrapper = function () {
								var e = n
								return function (t) {
									return function () {
										var n = e.xhrMap.get(this)
										return (
											n &&
												(this.addEventListener("load", e.handleXhrLoadEvent),
												this.addEventListener("error", e.handleXhrErrorEvent),
												this.addEventListener("abort", e.handleXhrAbortEvent),
												this.addEventListener(
													"timeout",
													e.handleXhrTimeoutEvent,
												),
												e.initializeTrace(n),
												!e.isSyntheticsUA &&
													e.isTracingEnabled() &&
													e.addXRayTraceIdHeader(n.url) &&
													e.isSessionRecorded() &&
													this.setRequestHeader(
														Gt,
														sn(n.trace.trace_id, n.trace.subsegments[0].id),
													)),
											t.apply(this, arguments)
										)
									}
								}
							}),
							(n.openWrapper = function () {
								var e = n
								return function (t) {
									return function (n, r, o) {
										return (
											tn(r, e.config) &&
												e.xhrMap.set(this, { url: r, method: n, async: o }),
											t.apply(this, arguments)
										)
									}
								}
							}),
							(n.config = br(br({}, Jt), t)),
							(n.xhrMap = new Map()),
							(n.isSyntheticsUA = navigator.userAgent.includes(
								"CloudWatchSynthetics",
							)),
							n
						)
					}
					return (
						mr(t, e),
						(t.prototype.onload = function () {
							this.enable()
						}),
						Object.defineProperty(t.prototype, "patches", {
							get: function () {
								return [
									{
										nodule: XMLHttpRequest.prototype,
										name: "send",
										wrapper: this.sendWrapper,
									},
									{
										nodule: XMLHttpRequest.prototype,
										name: "open",
										wrapper: this.openWrapper,
									},
								]
							},
							enumerable: !1,
							configurable: !0,
						}),
						(t.prototype.handleXhrDetailsOnError = function (e, t, n) {
							if (e) {
								var r = nn()
								;(e.trace.end_time = r),
									(e.trace.subsegments[0].end_time = r),
									(e.trace.subsegments[0].error = !0),
									(e.trace.subsegments[0].cause = {
										exceptions: [{ type: n }],
									}),
									this.recordTraceEvent(e.trace),
									this.recordHttpEventWithError(e, t, n)
							}
						}),
						(t.prototype.statusOk = function (e) {
							return e >= 200 && e < 300
						}),
						(t.prototype.recordHttpEventWithResponse = function (e, t) {
							this.xhrMap.delete(t)
							var n = {
								version: "1.0.0",
								request: { method: e.method, url: e.url },
								response: { status: t.status, statusText: t.statusText },
							}
							this.isTracingEnabled() &&
								((n.trace_id = e.trace.trace_id),
								(n.segment_id = e.trace.subsegments[0].id)),
								(!this.config.recordAllRequests && this.statusOk(t.status)) ||
									this.context.record(N, n)
						}),
						(t.prototype.recordHttpEventWithError = function (e, t, n) {
							this.xhrMap.delete(t)
							var r = {
								version: "1.0.0",
								request: { method: e.method, url: e.url },
								error: ie(
									{ type: "error", error: n },
									this.config.stackTraceLength,
								),
							}
							this.isTracingEnabled() &&
								((r.trace_id = e.trace.trace_id),
								(r.segment_id = e.trace.subsegments[0].id)),
								this.context.record(N, r)
						}),
						(t.prototype.recordTraceEvent = function (e) {
							!this.isSyntheticsUA &&
								this.isTracingEnabled() &&
								this.isSessionRecorded() &&
								this.context.record(F, e)
						}),
						t
					)
				})(Pe),
				Er = (function () {
					var e = function (t, n) {
						return (
							(e =
								Object.setPrototypeOf ||
								({ __proto__: [] } instanceof Array &&
									function (e, t) {
										e.__proto__ = t
									}) ||
								function (e, t) {
									for (var n in t)
										Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
								}),
							e(t, n)
						)
					}
					return function (t, n) {
						if ("function" != typeof n && null !== n)
							throw new TypeError(
								"Class extends value " +
									String(n) +
									" is not a constructor or null",
							)
						function r() {
							this.constructor = t
						}
						e(t, n),
							(t.prototype =
								null === n
									? Object.create(n)
									: ((r.prototype = n.prototype), new r()))
					}
				})(),
				Sr = function () {
					return (
						(Sr =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						Sr.apply(this, arguments)
					)
				},
				Tr = (function (e) {
					function t(t) {
						var n = e.call(this, "fetch") || this
						return (
							(n.isTracingEnabled = function () {
								return n.context.config.enableXRay
							}),
							(n.isSessionRecorded = function () {
								var e
								return (
									(null === (e = n.context.getSession()) || void 0 === e
										? void 0
										: e.record) || !1
								)
							}),
							(n.beginTrace = function (e, t, r) {
								var o = nn(),
									i = (function (e, t, n) {
										var r = { request: {} }
										return (
											(r.request.method = (null == t ? void 0 : t.method)
												? t.method
												: "GET"),
											(r.request.traced = n),
											(r.request.url = cn(e)),
											r
										)
									})(e, t, !0),
									a = rn(n.config.logicalServiceName, o),
									s = on(an(e), o, i)
								return (
									a.subsegments.push(s),
									n.isTraceIdHeaderEnabled(e) &&
										n.addXRayTraceIdHeader(e, t, r, a),
									a
								)
							}),
							(n.addXRayTraceIdHeader = function (e, t, n, r) {
								if (e.headers)
									return (
										(o = e.headers),
										(i = r.trace_id),
										(a = r.subsegments[0].id),
										void o.set(Gt, sn(i, a))
									)
								var o, i, a
								t || ((t = {}), [].push.call(n, t)),
									(function (e, t, n) {
										e.headers || (e.headers = {}), (e.headers[Gt] = sn(t, n))
									})(t, r.trace_id, r.subsegments[0].id)
							}),
							(n.endTrace = function (e, t, r) {
								if (e) {
									var o = nn()
									if (((e.subsegments[0].end_time = o), (e.end_time = o), t)) {
										;(e.subsegments[0].http.response = { status: t.status }),
											en(t.status)
												? ((e.subsegments[0].throttle = !0), (e.throttle = !0))
												: Yt(t.status)
													? ((e.subsegments[0].error = !0), (e.error = !0))
													: Qt(t.status) &&
														((e.subsegments[0].fault = !0), (e.fault = !0))
										var i = t.headers.get("Content-Length"),
											a = i ? parseInt(i, 10) : NaN
										isNaN(a) ||
											(e.subsegments[0].http.response.content_length = a)
									}
									r &&
										((e.fault = !0),
										(e.subsegments[0].fault = !0),
										r instanceof Object
											? n.appendErrorCauseFromObject(e.subsegments[0], r)
											: oe(r) &&
												n.appendErrorCauseFromPrimitive(
													e.subsegments[0],
													r.toString(),
												)),
										n.context.record(F, e)
								}
							}),
							(n.createHttpEvent = function (e, t) {
								var n = e
								return {
									version: "1.0.0",
									request: {
										url: cn(e),
										method: (null == t ? void 0 : t.method)
											? t.method
											: n.method
												? n.method
												: "GET",
									},
								}
							}),
							(n.recordHttpEventWithResponse = function (e, t) {
								;(!n.config.recordAllRequests && t.ok) ||
									((e.response = {
										status: t.status,
										statusText: t.statusText,
									}),
									n.context.record(N, e))
							}),
							(n.recordHttpEventWithError = function (e, t) {
								;(e.error = ie(
									{ type: "error", error: t },
									n.config.stackTraceLength,
								)),
									n.context.record(N, e)
							}),
							(n.fetch = function (e, t, r, o, i) {
								var a,
									s = n.createHttpEvent(o, i)
								if (!tn(cn(o), n.config)) return e.apply(t, r)
								var c = (function (e) {
									var t,
										n = {}
									if (e) {
										var r =
											null === (t = e.get(Gt)) || void 0 === t
												? void 0
												: t.split(";")
										3 === (null == r ? void 0 : r.length) &&
											((n.traceId = r[0].split("Root=")[1]),
											(n.segmentId = r[1].split("Parent=")[1]))
									}
									return n
								})(o.headers)
								return (
									c.traceId && c.segmentId
										? ((s.trace_id = c.traceId), (s.segment_id = c.segmentId))
										: n.isTracingEnabled() &&
											n.isSessionRecorded() &&
											((a = n.beginTrace(o, i, r)),
											(s.trace_id = a.trace_id),
											(s.segment_id = a.subsegments[0].id)),
									e
										.apply(t, r)
										.then(function (e) {
											return (
												n.endTrace(a, e, void 0),
												n.recordHttpEventWithResponse(s, e),
												e
											)
										})
										.catch(function (e) {
											throw (
												(n.endTrace(a, void 0, e),
												n.recordHttpEventWithError(s, e),
												e)
											)
										})
								)
							}),
							(n.fetchWrapper = function () {
								var e = n
								return function (t) {
									return function (n, r) {
										return e.fetch(t, this, arguments, n, r)
									}
								}
							}),
							(n.config = Sr(Sr({}, Jt), t)),
							n
						)
					}
					return (
						Er(t, e),
						Object.defineProperty(t.prototype, "patches", {
							get: function () {
								return [
									{ nodule: window, name: "fetch", wrapper: this.fetchWrapper },
								]
							},
							enumerable: !1,
							configurable: !0,
						}),
						(t.prototype.onload = function () {
							this.enable()
						}),
						(t.prototype.isTraceIdHeaderEnabled = function (e) {
							var t = cn(e)
							return Zt(t, this.config.addXRayTraceIdHeader)
						}),
						(t.prototype.appendErrorCauseFromPrimitive = function (e, t) {
							e.cause = { exceptions: [{ type: t }] }
						}),
						(t.prototype.appendErrorCauseFromObject = function (e, t) {
							e.cause = { exceptions: [{ type: t.name, message: t.message }] }
						}),
						t
					)
				})(Pe),
				Cr = (function () {
					var e = function (t, n) {
						return (
							(e =
								Object.setPrototypeOf ||
								({ __proto__: [] } instanceof Array &&
									function (e, t) {
										e.__proto__ = t
									}) ||
								function (e, t) {
									for (var n in t)
										Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
								}),
							e(t, n)
						)
					}
					return function (t, n) {
						if ("function" != typeof n && null !== n)
							throw new TypeError(
								"Class extends value " +
									String(n) +
									" is not a constructor or null",
							)
						function r() {
							this.constructor = t
						}
						e(t, n),
							(t.prototype =
								null === n
									? Object.create(n)
									: ((r.prototype = n.prototype), new r()))
					}
				})(),
				_r = (function (e) {
					function t() {
						var t = e.call(this, "page-view") || this
						return (
							(t.pushState = function () {
								var e = t
								return function (t) {
									return function (n, r, o) {
										var i = t.apply(this, arguments)
										return e.recordPageView(), i
									}
								}
							}),
							(t.replaceState = function () {
								var e = t
								return function (t) {
									return function (n, r, o) {
										var i = t.apply(this, arguments)
										return e.recordPageView(), i
									}
								}
							}),
							(t.popstateListener = function (e) {
								t.recordPageView()
							}),
							(t.recordPageView = function () {
								t.context.recordPageView(t.createIdForCurrentPage())
							}),
							t.enable(),
							t
						)
					}
					return (
						Cr(t, e),
						(t.prototype.onload = function () {
							this.addListener(), this.recordPageView()
						}),
						Object.defineProperty(t.prototype, "patches", {
							get: function () {
								return [
									{
										nodule: History.prototype,
										name: "pushState",
										wrapper: this.pushState,
									},
									{
										nodule: History.prototype,
										name: "replaceState",
										wrapper: this.replaceState,
									},
								]
							},
							enumerable: !1,
							configurable: !0,
						}),
						(t.prototype.addListener = function () {
							window.addEventListener("popstate", this.popstateListener)
						}),
						(t.prototype.createIdForCurrentPage = function () {
							var e = window.location.pathname,
								t = window.location.hash
							switch (this.context.config.pageIdFormat) {
								case An.PathAndHash:
									return e && t ? e + t : e || t || ""
								case An.Hash:
									return t || ""
								case An.Path:
								default:
									return e || ""
							}
						}),
						t
					)
				})(Pe),
				Ar = function () {
					return (
						(Ar =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						Ar.apply(this, arguments)
					)
				},
				Or = function (e, t) {
					var n = {}
					for (var r in e)
						Object.prototype.hasOwnProperty.call(e, r) &&
							t.indexOf(r) < 0 &&
							(n[r] = e[r])
					if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
						var o = 0
						for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
							t.indexOf(r[o]) < 0 &&
								Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
								(n[r[o]] = e[r[o]])
					}
					return n
				},
				Ir = function (e, t, n) {
					if (n || 2 === arguments.length)
						for (var r, o = 0, i = t.length; o < i; o++)
							(!r && o in t) ||
								(r || (r = Array.prototype.slice.call(t, 0, o)), (r[o] = t[o]))
					return e.concat(r || Array.prototype.slice.call(t))
				},
				Pr = "us-west-2",
				xr = "https://dataplane.rum.".concat(Pr, ".amazonaws.com")
			!(function (e) {
				;(e.Errors = "errors"),
					(e.Performance = "performance"),
					(e.Interaction = "interaction"),
					(e.Http = "http")
			})(_n || (_n = {})),
				(function (e) {
					;(e.Path = "PATH"),
						(e.Hash = "HASH"),
						(e.PathAndHash = "PATH_AND_HASH")
				})(An || (An = {}))
			var kr = (function () {
					function e(e, t, n, r) {
						void 0 === r && (r = {})
						var o = r.cookieAttributes,
							i = Or(r, ["cookieAttributes"])
						;(this.eventBus = new Me()), void 0 === n && (n = "us-west-2")
						var a = Ar(
							Ar(
								{},
								{
									unique: !1,
									domain: window.location.hostname,
									path: "/",
									sameSite: "Strict",
									secure: !0,
								},
							),
							o,
						)
						;(this.config = Ar(
							Ar(
								{ fetchFunction: fetch },
								(function (e) {
									return {
										allowCookies: !1,
										batchLimit: 100,
										client: "arw-module",
										cookieAttributes: e,
										disableAutoPageView: !1,
										dispatchInterval: 5e3,
										enableRumClient: !0,
										enableXRay: !1,
										endpoint: xr,
										endpointUrl: new URL(xr),
										eventCacheSize: 200,
										eventPluginsToLoad: [],
										pageIdFormat: An.Path,
										pagesToExclude: [],
										pagesToInclude: [/.*/],
										signing: !0,
										recordResourceUrl: !0,
										retries: 2,
										routeChangeComplete: 100,
										routeChangeTimeout: 1e4,
										sessionAttributes: {},
										sessionEventLimit: 200,
										sessionLengthSeconds: 1800,
										sessionSampleRate: 1,
										telemetries: [],
										useBeacon: !0,
										userIdRetentionDays: 30,
									}
								})(a),
							),
							i,
						)),
							(this.config.endpoint = this.getDataPlaneEndpoint(n, i)),
							(this.config.endpointUrl = new URL(this.config.endpoint)),
							(this.eventCache = this.initEventCache(e, t)),
							(this.dispatchManager = this.initDispatch(n, e)),
							(this.pluginManager = this.initPluginManager(e, t)),
							this.config.enableRumClient ? this.enable() : this.disable()
					}
					return (
						(e.prototype.setAwsCredentials = function (e) {
							this.dispatchManager.setAwsCredentials(e)
						}),
						(e.prototype.addSessionAttributes = function (e) {
							this.eventCache.addSessionAttributes(e)
						}),
						(e.prototype.addPlugin = function (e) {
							this.pluginManager.addPlugin(e)
						}),
						(e.prototype.dispatch = function () {
							this.dispatchManager.dispatchFetch()
						}),
						(e.prototype.dispatchBeacon = function () {
							this.dispatchManager.dispatchBeacon()
						}),
						(e.prototype.enable = function () {
							this.eventCache.enable(),
								this.pluginManager.enable(),
								this.dispatchManager.enable()
						}),
						(e.prototype.disable = function () {
							this.dispatchManager.disable(),
								this.pluginManager.disable(),
								this.eventCache.disable()
						}),
						(e.prototype.allowCookies = function (e) {
							this.config.allowCookies = e
						}),
						(e.prototype.recordPageView = function (e) {
							this.eventCache.recordPageView(e)
						}),
						(e.prototype.recordError = function (e) {
							this.pluginManager.record(ce, e)
						}),
						(e.prototype.registerDomEvents = function (e) {
							this.pluginManager.updatePlugin(te, e)
						}),
						(e.prototype.recordEvent = function (e, t) {
							this.eventCache.recordEvent(e, t)
						}),
						(e.prototype.initEventCache = function (e, t) {
							return new De({ id: e, version: t }, this.config, this.eventBus)
						}),
						(e.prototype.initDispatch = function (e, t) {
							var n = new wn(
								e,
								this.config.endpointUrl,
								this.eventCache,
								this.config,
							)
							return this.eventCache.isSessionSampled()
								? (this.config.identityPoolId && this.config.guestRoleArn
										? n.setAwsCredentials(
												new M(this.config, t).ChainAnonymousCredentialsProvider,
											)
										: this.config.identityPoolId &&
											n.setAwsCredentials(
												new q(this.config, t).ChainAnonymousCredentialsProvider,
											),
									n)
								: n
						}),
						(e.prototype.initPluginManager = function (e, t) {
							var n = this.constructBuiltinPlugins(),
								r = Ir(Ir([], n, !0), this.config.eventPluginsToLoad, !0),
								o = {
									applicationId: e,
									applicationVersion: t,
									config: this.config,
									record: this.eventCache.recordEvent,
									recordPageView: this.eventCache.recordPageView,
									getSession: this.eventCache.getSession,
									eventBus: this.eventBus,
								},
								i = new Y(o)
							return (
								this.config.disableAutoPageView || i.addPlugin(new _r()),
								r.forEach(function (e) {
									i.addPlugin(e)
								}),
								i
							)
						}),
						(e.prototype.constructBuiltinPlugins = function () {
							var e = [],
								t = this.telemetryFunctor()
							return (
								this.config.telemetries.forEach(function (n) {
									"string" == typeof n && t[n.toLowerCase()]
										? (e = Ir(Ir([], e, !0), t[n.toLowerCase()]({}), !0))
										: Array.isArray(n) &&
											t[n[0].toLowerCase()] &&
											(e = Ir(Ir([], e, !0), t[n[0].toLowerCase()](n[1]), !0))
								}),
								e
							)
						}),
						(e.prototype.getDataPlaneEndpoint = function (e, t) {
							return t.endpoint ? t.endpoint : xr.replace(Pr, e)
						}),
						(e.prototype.telemetryFunctor = function () {
							var e
							return (
								((e = {})[_n.Errors] = function (e) {
									return [new le(e)]
								}),
								(e[_n.Performance] = function (e) {
									return [new Un(e), new Bn(e), new vr()]
								}),
								(e[_n.Interaction] = function (e) {
									return [new re(e)]
								}),
								(e[_n.Http] = function (e) {
									return [new wr(e), new Tr(e)]
								}),
								e
							)
						}),
						e
					)
				})(),
				Lr = function () {
					return (
						(Lr =
							Object.assign ||
							function (e) {
								for (var t, n = 1, r = arguments.length; n < r; n++)
									for (var o in (t = arguments[n]))
										Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o])
								return e
							}),
						Lr.apply(this, arguments)
					)
				},
				Rr = function (e, t, n, r) {
					return new (n || (n = Promise))(function (o, i) {
						function a(e) {
							try {
								c(r.next(e))
							} catch (e) {
								i(e)
							}
						}
						function s(e) {
							try {
								c(r.throw(e))
							} catch (e) {
								i(e)
							}
						}
						function c(e) {
							var t
							e.done
								? o(e.value)
								: ((t = e.value),
									t instanceof n
										? t
										: new n(function (e) {
												e(t)
											})).then(a, s)
						}
						c((r = r.apply(e, t || [])).next())
					})
				},
				jr = function (e, t) {
					var n,
						r,
						o,
						i,
						a = {
							label: 0,
							sent: function () {
								if (1 & o[0]) throw o[1]
								return o[1]
							},
							trys: [],
							ops: [],
						}
					return (
						(i = { next: s(0), throw: s(1), return: s(2) }),
						"function" == typeof Symbol &&
							(i[Symbol.iterator] = function () {
								return this
							}),
						i
					)
					function s(i) {
						return function (s) {
							return (function (i) {
								if (n) throw new TypeError("Generator is already executing.")
								for (; a; )
									try {
										if (
											((n = 1),
											r &&
												(o =
													2 & i[0]
														? r.return
														: i[0]
															? r.throw || ((o = r.return) && o.call(r), 0)
															: r.next) &&
												!(o = o.call(r, i[1])).done)
										)
											return o
										switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
											case 0:
											case 1:
												o = i
												break
											case 4:
												return a.label++, { value: i[1], done: !1 }
											case 5:
												a.label++, (r = i[1]), (i = [0])
												continue
											case 7:
												;(i = a.ops.pop()), a.trys.pop()
												continue
											default:
												if (
													!((o = a.trys),
													(o = o.length > 0 && o[o.length - 1]) ||
														(6 !== i[0] && 2 !== i[0]))
												) {
													a = 0
													continue
												}
												if (
													3 === i[0] &&
													(!o || (i[1] > o[0] && i[1] < o[3]))
												) {
													a.label = i[1]
													break
												}
												if (6 === i[0] && a.label < o[1]) {
													;(a.label = o[1]), (o = i)
													break
												}
												if (o && a.label < o[2]) {
													;(a.label = o[2]), a.ops.push(i)
													break
												}
												o[2] && a.ops.pop(), a.trys.pop()
												continue
										}
										i = t.call(e, a)
									} catch (e) {
										;(i = [6, e]), (r = 0)
									} finally {
										n = o = 0
									}
								if (5 & i[0]) throw i[1]
								return { value: i[0] ? i[1] : void 0, done: !0 }
							})([i, s])
						}
					}
				},
				Mr = function (e) {
					return Rr(void 0, void 0, void 0, function () {
						var t, n
						return jr(this, function (r) {
							switch (r.label) {
								case 0:
									return (
										(t = {}),
										(n = {}),
										void 0 === e.u
											? [3, 2]
											: [
													4,
													((o = e.u),
													Rr(void 0, void 0, void 0, function () {
														var e
														return jr(this, function (t) {
															switch (t.label) {
																case 0:
																	return (
																		t.trys.push([0, 3, , 4]),
																		[
																			4,
																			fetch(o, {
																				mode: "cors",
																				method: "GET",
																				headers: {
																					Accept: "application/json",
																					"Content-Type": "application/json",
																				},
																			}),
																		]
																	)
																case 1:
																	return [4, t.sent().json()]
																case 2:
																	return [2, t.sent()]
																case 3:
																	throw (
																		((e = t.sent()),
																		new Error(
																			"CWR: Failed to load remote config: ".concat(
																				e,
																			),
																		))
																	)
																case 4:
																	return [2]
															}
														})
													})),
												]
									)
								case 1:
									return (
										(n = r.sent()),
										(t = Lr(Lr({}, n.clientConfig), e.c)),
										[3, 3]
									)
								case 2:
									void 0 !== e.c && (t = e.c), (r.label = 3)
								case 3:
									return [2, t]
							}
							var o
						})
					})
				},
				Ur = function (e, t, n, r) {
					return new (n || (n = Promise))(function (o, i) {
						function a(e) {
							try {
								c(r.next(e))
							} catch (e) {
								i(e)
							}
						}
						function s(e) {
							try {
								c(r.throw(e))
							} catch (e) {
								i(e)
							}
						}
						function c(e) {
							var t
							e.done
								? o(e.value)
								: ((t = e.value),
									t instanceof n
										? t
										: new n(function (e) {
												e(t)
											})).then(a, s)
						}
						c((r = r.apply(e, t || [])).next())
					})
				},
				Dr = function (e, t) {
					var n,
						r,
						o,
						i,
						a = {
							label: 0,
							sent: function () {
								if (1 & o[0]) throw o[1]
								return o[1]
							},
							trys: [],
							ops: [],
						}
					return (
						(i = { next: s(0), throw: s(1), return: s(2) }),
						"function" == typeof Symbol &&
							(i[Symbol.iterator] = function () {
								return this
							}),
						i
					)
					function s(i) {
						return function (s) {
							return (function (i) {
								if (n) throw new TypeError("Generator is already executing.")
								for (; a; )
									try {
										if (
											((n = 1),
											r &&
												(o =
													2 & i[0]
														? r.return
														: i[0]
															? r.throw || ((o = r.return) && o.call(r), 0)
															: r.next) &&
												!(o = o.call(r, i[1])).done)
										)
											return o
										switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
											case 0:
											case 1:
												o = i
												break
											case 4:
												return a.label++, { value: i[1], done: !1 }
											case 5:
												a.label++, (r = i[1]), (i = [0])
												continue
											case 7:
												;(i = a.ops.pop()), a.trys.pop()
												continue
											default:
												if (
													!((o = a.trys),
													(o = o.length > 0 && o[o.length - 1]) ||
														(6 !== i[0] && 2 !== i[0]))
												) {
													a = 0
													continue
												}
												if (
													3 === i[0] &&
													(!o || (i[1] > o[0] && i[1] < o[3]))
												) {
													a.label = i[1]
													break
												}
												if (6 === i[0] && a.label < o[1]) {
													;(a.label = o[1]), (o = i)
													break
												}
												if (o && a.label < o[2]) {
													;(a.label = o[2]), a.ops.push(i)
													break
												}
												o[2] && a.ops.pop(), a.trys.pop()
												continue
										}
										i = t.call(e, a)
									} catch (e) {
										;(i = [6, e]), (r = 0)
									} finally {
										n = o = 0
									}
								if (5 & i[0]) throw i[1]
								return { value: i[0] ? i[1] : void 0, done: !0 }
							})([i, s])
						}
					}
				},
				Hr = (function () {
					function e() {
						var e = this
						this.commandHandlerMap = {
							setAwsCredentials: function (t) {
								e.orchestration.setAwsCredentials(t)
							},
							addSessionAttributes: function (t) {
								e.orchestration.addSessionAttributes(t)
							},
							recordPageView: function (t) {
								e.orchestration.recordPageView(t)
							},
							recordError: function (t) {
								e.orchestration.recordError(t)
							},
							registerDomEvents: function (t) {
								e.orchestration.registerDomEvents(t)
							},
							recordEvent: function (t) {
								if (
									"object" != typeof t ||
									"string" != typeof t.type ||
									"object" != typeof t.data
								)
									throw new Error("IncorrectParametersException")
								e.orchestration.recordEvent(t.type, t.data)
							},
							dispatch: function () {
								e.orchestration.dispatch()
							},
							dispatchBeacon: function () {
								e.orchestration.dispatchBeacon()
							},
							enable: function () {
								e.orchestration.enable()
							},
							disable: function () {
								e.orchestration.disable()
							},
							allowCookies: function (t) {
								if ("boolean" != typeof t)
									throw new Error("IncorrectParametersException")
								e.orchestration.allowCookies(t)
							},
						}
					}
					return (
						(e.prototype.init = function (e) {
							return Ur(this, void 0, void 0, function () {
								var t
								return Dr(this, function (n) {
									switch (n.label) {
										case 0:
											return void 0 === e.u ? [3, 2] : [4, Mr(e)]
										case 1:
											return (t = n.sent()), (e.c = t), this.initCwr(e), [3, 3]
										case 2:
											this.initCwr(e), (n.label = 3)
										case 3:
											return [2]
									}
								})
							})
						}),
						(e.prototype.push = function (e) {
							return Ur(this, void 0, void 0, function () {
								var t
								return Dr(this, function (n) {
									if (!(t = this.commandHandlerMap[e.c]))
										throw new Error(
											"CWR: UnsupportedOperationException: ".concat(e.c),
										)
									return t(e.p), [2]
								})
							})
						}),
						(e.prototype.initCwr = function (e) {
							var t = this
							e.c ? (e.c.client = a) : (e.c = { client: a }),
								(this.orchestration = new kr(e.i, e.v, e.r, e.c)),
								(window[e.n] = function (e, n) {
									t.push({ c: e, p: n })
								}),
								e.q.forEach(function (e) {
									t.push(e)
								}),
								(e.q = [])
						}),
						e
					)
				})()
			!window.AwsRumClient &&
				window.AwsNexusTelemetry &&
				(window.AwsRumClient = window.AwsNexusTelemetry),
				"function" == typeof fetch && "function" == typeof navigator.sendBeacon
					? new Hr().init(window.AwsRumClient)
					: (window[window.AwsRumClient.n] = function () {})
		})()
})()
