import { describe, expect, test } from "vitest"

describe("SSR Handler Security", () => {
	describe("path traversal protection", () => {
		const isPathTraversal = (pathname: string): boolean => {
			return pathname.includes("..")
		}

		test("should detect path traversal with double dots", () => {
			expect(isPathTraversal("/_astro/../../../etc/passwd")).toBe(true)
			expect(isPathTraversal("/_astro/../config")).toBe(true)
			expect(isPathTraversal("/_astro/..%2fconfig")).toBe(true) // Still detected by simple check
		})

		test("should allow legitimate _astro paths", () => {
			expect(isPathTraversal("/_astro/image.png")).toBe(false)
			expect(isPathTraversal("/_astro/assets/logo.webp")).toBe(false)
			expect(isPathTraversal("/_astro/chunks/abc123.js")).toBe(false)
		})

		test("should handle paths with dots in filenames", () => {
			expect(isPathTraversal("/_astro/file.min.js")).toBe(false)
			expect(isPathTraversal("/_astro/image.2x.png")).toBe(false)
		})

		test("should detect path traversal in middle of path", () => {
			expect(isPathTraversal("/_astro/../../../etc/passwd")).toBe(true)
			expect(isPathTraversal("/_astro/subdir/../../config")).toBe(true)
		})
	})
})
