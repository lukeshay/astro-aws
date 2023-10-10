import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { URL, fileURLToPath } from "node:url"

import { Construct } from "constructs"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

type Config = {
	output: "hybrid" | "server" | "static"
}

type Args = {
	/** Specifies what media types need to be base64 encoded. */
	binaryMediaTypes: string[]
	/** Configures ESBuild options that are not configured automatically. */
	esBuildOptions: Record<string, unknown>
	/** Specifies where you want your app deployed to. */
	mode: "edge" | "ssr-stream" | "ssr"
}

type Metadata = {
	args: Args
	config: Config
}

type AstroAWSBaseConstructProps = {
	outDir?: string
	websiteDir?: string
}

abstract class AstroAWSBaseConstruct<
	Props extends AstroAWSBaseConstructProps,
	Cdk,
> extends Construct {
	public readonly distDir: string
	public readonly props: Props
	public readonly metadata?: Metadata

	public constructor(scope: Construct, id: string, props: Props) {
		super(scope, id)

		const { outDir, websiteDir = __dirname } = props

		this.props = props

		this.distDir = outDir ? resolve(outDir) : resolve(websiteDir, "dist")

		this.metadata = existsSync(resolve(this.distDir, "metadata.json"))
			? (JSON.parse(
					readFileSync(resolve(this.distDir, "metadata.json")).toString("utf8"),
			  ) as Metadata)
			: undefined
	}

	public get isStatic(): boolean {
		return !this.metadata
	}

	public get isSSR(): boolean {
		return Boolean(this.metadata)
	}

	public abstract get cdk(): Cdk
}

export {
	type Args,
	type Metadata,
	type AstroAWSBaseConstructProps,
	AstroAWSBaseConstruct,
}
