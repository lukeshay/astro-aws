import { randomUUID } from "node:crypto"

import {
	ACMClient,
	DescribeCertificateCommand,
	RequestCertificateCommand,
} from "@aws-sdk/client-acm"

/** @type {import("aws-lambda").CdkCustomResourceHandler} */
const onEvent = async (event) => {
	const { region, domainName, alternateNames, idempotencyToken } =
		event.ResourceProperties
	const client = new ACMClient({
		region,
	})

	if (event.RequestType === "Create" || event.RequestType === "Update") {
		const result = await client.send(
			new RequestCertificateCommand({
				DomainName: domainName,
				IdempotencyToken: idempotencyToken,
				SubjectAlternativeNames: alternateNames?.length
					? alternateNames
					: undefined,
				ValidationMethod: "DNS",
			}),
		)

		return {
			Data: {
				alternateNames,
				certificateArn: result.CertificateArn,
				domainName,
				region,
			},
			PhysicalResourceId: result.CertificateArn,
		}
	}

	/*await client.send(
		new DeleteCertificateCommand({
			CertificateArn: event.PhysicalResourceId,
		}),
	)*/

	return {
		Data: {},
		PhysicalResourceId: randomUUID(),
	}
}

/** @type {import("aws-lambda").CdkCustomResourceIsCompleteHandler} */
const isComplete = async (event) => {
	const client = new ACMClient({
		region: event.Data.region,
	})

	if (event.RequestType === "Create" || event.RequestType === "Update") {
		const result = await client.send(
			new DescribeCertificateCommand({
				CertificateArn: event.Data.certificateArn,
			}),
		)

		if (result.Certificate.Status === "ISSUED") {
			return {
				Data: {
					status: result.Certificate.Status,
				},
				IsComplete: true,
			}
		} else if (result.Certificate.Status === "PENDING_VALIDATION") {
			return {
				IsComplete: false,
			}
		}

		throw new Error(
			`Unexpected certificate status: ${result.Certificate.Status}`,
		)
	}

	return {
		IsComplete: true,
	}
}

export { onEvent, isComplete }
