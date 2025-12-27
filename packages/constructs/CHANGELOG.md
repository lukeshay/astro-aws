# @astro-aws/constructs

## 0.12.0

### Minor Changes

- 0453b85: Default lambda runtimes to Nodejs 24
- 0453b85: Upgrade dependencies
- 0453b85: Remove usage of deprecated constructs

## 0.11.0

### Minor Changes

- f5a23a3: Upgrade dependencies

### Patch Changes

- 3d0dbd7: Add support for Node.js 24
- 888385b: Upgrade dependencies

## 0.8.0

### Minor Changes

- 3fc8a7f: Add support for node 22
- 3fc8a7f: Remove support for node 18

## 0.7.0

### Minor Changes

- b4bcad7: Upgrade dependencies

### Patch Changes

- 48af5d1: Fixed circular reference in S3 bucket construct which prevented configuration of the S3 part of the infrastructure.
- 48e4410: Updated dependencies

## 0.6.0

### Minor Changes

- 839b188: Added support for response streaming
- 3f1e6cb: Updated dependencies
- 3f1e6cb: Support Astro v4
- 839b188: Added support for 404 pages

### Patch Changes

- 3f1e6cb: Use flatted to handle circular json

## 0.5.0

### Minor Changes

- 942d062: Added support for AWS Lambda response streaming
- 51c3296: Added support for response streaming
- 48d293a: Added support for 404 pages

### Patch Changes

- a96a6c4: Use metadata file from adapter to configure constructs
- 374f1b9: Upgraded dependencies

## 0.4.0

### Minor Changes

- e2adca1: Upgraded dependencies
- e2adca1: Support hybrid output

## 0.3.0

### Minor Changes

- [#43](https://github.com/lukeshay/astro-aws/pull/43) [`81e10bc`](https://github.com/lukeshay/astro-aws/commit/81e10bc93d6febcdb1571150c29af5c63239b9a6) Thanks [@lukeshay](https://github.com/lukeshay)! - Restructured props and resource access

- [#43](https://github.com/lukeshay/astro-aws/pull/43) [`81e10bc`](https://github.com/lukeshay/astro-aws/commit/81e10bc93d6febcdb1571150c29af5c63239b9a6) Thanks [@lukeshay](https://github.com/lukeshay)! - Added support for edge deployment

- [#29](https://github.com/lukeshay/astro-aws/pull/29) [`d17b2a7`](https://github.com/lukeshay/astro-aws/commit/d17b2a7cf7c1c8ee0ca4acc1d610c8ee040969c4) Thanks [@lukeshay](https://github.com/lukeshay)! - Renamed resources and removed the bare construct

### Patch Changes

- [`08476a0`](https://github.com/lukeshay/astro-aws/commit/08476a081c2c6bbac8b5beab1ca2afea6e7e2c60) Thanks [@lukeshay](https://github.com/lukeshay)! - Upgraded dependencies

- [#26](https://github.com/lukeshay/astro-aws/pull/26) [`cf09511`](https://github.com/lukeshay/astro-aws/commit/cf09511345e0ac932d518f9cc3561abe106ae4ec) Thanks [@lukeshay](https://github.com/lukeshay)! - Raised default lambda memory to 512mb

## 0.2.0

### Minor Changes

- [#19](https://github.com/lukeshay/astro-aws/pull/19) [`303cf98`](https://github.com/lukeshay/astro-aws/commit/303cf98e055330e811744f18645d7936c80a0a5c) Thanks [@lukeshay](https://github.com/lukeshay)! - Added support for static deployments

## 0.0.4

### Patch Changes

- [#7](https://github.com/lukeshay/astro-aws/pull/7) [`646915f`](https://github.com/lukeshay/astro-aws/commit/646915f227c27af02084e7fe7b1c1e69c9ad9e7d) Thanks [@lukeshay](https://github.com/lukeshay)! - Upgraded dependencies

- [#14](https://github.com/lukeshay/astro-aws/pull/14) [`d7e5a17`](https://github.com/lukeshay/astro-aws/commit/d7e5a17337537343a4302920f8fbde1ba60c8e2c) Thanks [@lukeshay](https://github.com/lukeshay)! - Default to Node.js 18 runtime

- [`12f4c9f`](https://github.com/lukeshay/astro-aws/commit/12f4c9ff03e368307895fd06c9ee35ad5958bfb0) Thanks [@lukeshay](https://github.com/lukeshay)! - Allow configuration of /api behavior

- [`7dc5da2`](https://github.com/lukeshay/astro-aws/commit/7dc5da287af714b83e39b13a59eb2839d65c16d1) Thanks [@lukeshay](https://github.com/lukeshay)! - Upgraded dependencies

## 0.0.4-next.1

### Patch Changes

- [#7](https://github.com/lukeshay/astro-aws/pull/7) [`646915f`](https://github.com/lukeshay/astro-aws/commit/646915f227c27af02084e7fe7b1c1e69c9ad9e7d) Thanks [@lukeshay](https://github.com/lukeshay)! - Upgraded dependencies

- [`7dc5da2`](https://github.com/lukeshay/astro-aws/commit/7dc5da287af714b83e39b13a59eb2839d65c16d1) Thanks [@lukeshay](https://github.com/lukeshay)! - Upgraded dependencies

## 0.0.4-next.0

### Patch Changes

- Allow configuration of /api behavior

## 0.0.3

### Patch Changes

- [`dee988a`](https://github.com/lukeshay/astro-aws/commit/dee988a8c32edc15a62a17e3a053b9a333bf2f80) Thanks [@lukeshay](https://github.com/lukeshay)! - Allow more configuration of resources

## 0.0.2

### Patch Changes

- [`f76a300`](https://github.com/lukeshay/astro-aws/commit/f76a30043aad8cd8a43973f4f9b93d45427dc406) Thanks [@lukeshay](https://github.com/lukeshay)! - Made createBucketDeployment public

- [`f76a300`](https://github.com/lukeshay/astro-aws/commit/f76a30043aad8cd8a43973f4f9b93d45427dc406) Thanks [@lukeshay](https://github.com/lukeshay)! - Allow deployment to be skipped when using AstroAWSConstruct

- [`d4e13a0`](https://github.com/lukeshay/astro-aws/commit/d4e13a060f30702d50e3cd2d3d076549b6aa4da9) Thanks [@lukeshay](https://github.com/lukeshay)! - Allow POST requests to /api/\*

## 0.0.1

### Patch Changes

- [#3](https://github.com/lukeshay/astro-aws/pull/3) [`68377c6`](https://github.com/lukeshay/astro-aws/commit/68377c6e2d5b3cf6fe53f706421d95161aba91f7) Thanks [@lukeshay](https://github.com/lukeshay)! - Initial release
