import { Construct } from "constructs"

export abstract class AstroAWSBaseConstruct<Props, Cdk> extends Construct {
	#props: Props

	public constructor(scope: Construct, id: string, props: Props) {
		super(scope, id)

		this.#props = props
	}

	public get props(): Props {
		return this.#props
	}

	public abstract get cdk(): Cdk
}
