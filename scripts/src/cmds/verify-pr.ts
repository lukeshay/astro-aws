import { Command } from "commander"
import { $, file } from "bun"
import * as v from "valibot"

const ReleaseTypeSchema = v.picklist(["major", "minor", "patch", "none"])

const ChangesetReleaseSchema = v.object({
	name: v.string(),
	type: ReleaseTypeSchema,
})

const ChangesetSchema = v.object({
	releases: v.array(ChangesetReleaseSchema),
	summary: v.string(),
	id: v.string(),
})

const ReleaseSchema = v.object({
	name: v.string(),
	type: ReleaseTypeSchema,
	oldVersion: v.string(),
	changesets: v.array(v.string()),
	newVersion: v.string(),
})

const ChangesetStatusSchema = v.object({
	changesets: v.array(ChangesetSchema),
	releases: v.array(ReleaseSchema),
})
type ChangesetStatusSchema = v.InferOutput<typeof ChangesetStatusSchema>

const PullRequestSchema = v.object({
	closingIssuesReferences: v.array(
		v.object({
			number: v.number(),
			repository: v.object({
				name: v.string(),
				owner: v.object({
					login: v.string(),
				}),
			}),
		}),
	),
})
type PullRequestSchema = v.InferOutput<typeof PullRequestSchema>

const IssueSchema = v.object({
	number: v.number(),
	labels: v.array(
		v.object({
			name: v.string(),
		}),
	),
})
type IssueSchema = v.InferOutput<typeof IssueSchema>

/**
 * Returns a message stating which packages the issue requires a changeset for. If there is a changeset, returns undefined.
 * @param issue The issue to check.
 * @param changesetStatus The changesets since main.
 * @returns A message stating which packages the issue requires a changeset for. If there is a changeset, returns undefined.
 */
const getRequiredChangesetsMessage = (
	issue: IssueSchema,
	changesetStatus: ChangesetStatusSchema,
) => {
	console.log("Checking issue:", issue.number)
	console.log(
		"Issue labels:",
		issue.labels.map((label) => label.name),
	)

	const requiresChangeset = issue.labels.some(
		(label) => label.name === "enhancement" || label.name === "bug",
	)

	if (!requiresChangeset) {
		return undefined
	}

	const packages = issue.labels
		.filter((label) => label.name.startsWith("@astro-aws/"))
		.map((label) => label.name)

	console.log("Packages:", packages)

	if (packages.length === 0) {
		return undefined
	}

	// Check if ALL packages have changesets
	const packagesWithoutChangesets = packages.filter(
		(pkg) =>
			!changesetStatus.changesets.some((changeset) =>
				changeset.releases.some((release) => release.name === pkg),
			),
	)

	console.log("Packages without changesets:", packagesWithoutChangesets)

	return packagesWithoutChangesets.length > 0
		? `#${issue.number}: \`${packagesWithoutChangesets.join(", ")}\``
		: undefined
}

const getIssueNotReadyMessage = (issue: IssueSchema) => {
	const notReady = issue.labels.find(
		(label) =>
			label.name === "needs triage" || label.name === "needs more info",
	)

	return notReady ? `#${issue.number}: \`${notReady.name}\`` : undefined
}

const verifyPRCommand = new Command("verify-pr")
	.description(
		"Verifies a pull request is linked to an issue and has a changeset if required.",
	)
	.argument("[prNumber]", "Pull request number to verify.", "123")
	.action(async (prNumber: string) => {
		const tempFile = "diff.tmp"
		await $`bunx changeset status --since main --output ${tempFile}`
		const changesetStatus = v.parse(
			ChangesetStatusSchema,
			await file(tempFile).json(),
		)

		// Get the issues linked to the pull request and verify there is at least one. If there is no issues, request changes on the PR. Use the gh cli to request changes.
		const issues =
			await $`gh pr view ${prNumber} --json closingIssuesReferences`.json()
		const linkedIssueReferences = v
			.parse(PullRequestSchema, issues)
			.closingIssuesReferences.filter(
				(issue) =>
					issue.repository.owner.login === "lukeshay" &&
					issue.repository.name === "astro-aws",
			)
		if (!linkedIssueReferences.length) {
			console.log("No issues linked to the pull request.")
			process.exit(0)
		}

		console.log(
			"Linked issues:",
			linkedIssueReferences.map((issue) => issue.number),
		)

		const linkedIssues = await Promise.all(
			linkedIssueReferences.map(async (issueRef) => {
				const issue =
					await $`gh issue view ${issueRef.number} --json labels,number`.json()
				return v.parse(IssueSchema, issue)
			}),
		)

		// If any of the linked issues have the label "enhancement" or "bug", verify there is a changeset. Each issue also has a label for the associated package, "@astro-aws/adapter" or "@astro-aws/constructs". If there is no changeset, request changes on the PR. Use the gh cli to request changes.
		const requiredChangesets: Array<string> = []
		const notReady: Array<string> = []

		for (const issue of linkedIssues) {
			const requiredChangesetsMessage = getRequiredChangesetsMessage(
				issue,
				changesetStatus,
			)
			const notReadyMessage = getIssueNotReadyMessage(issue)

			if (requiredChangesetsMessage) {
				requiredChangesets.push(requiredChangesetsMessage)
			}
			if (notReadyMessage) {
				notReady.push(notReadyMessage)
			}
		}

		const allIssues = [...requiredChangesets, ...notReady]

		if (allIssues.length) {
			const body = `<!-- ISSUE_CHECK_COMMENT -->
### The following issues are not ready for pull requests

- ${notReady.join("\n- ")}
			
### Missing changesets for the following issues
			
- ${requiredChangesets.join("\n- ")}

<!-- Updated at ${new Date().toISOString()} -->`

			await Bun.write("body.tmp", body)

			// Check if a comment with the marker already exists
			// Get PR number to fetch issue comments (PRs are issues in GitHub API)
			const prData = await $`gh pr view ${prNumber} --json number`.json()
			const comments =
				await $`gh api repos/lukeshay/astro-aws/issues/${prData.number}/comments`.json()
			const existingComment = Array.isArray(comments)
				? comments.find((comment: { body: string }) =>
						comment.body.includes("<!-- ISSUE_CHECK_COMMENT -->"),
					)
				: null

			if (existingComment) {
				// Update existing comment
				await $`gh api repos/lukeshay/astro-aws/issues/comments/${existingComment.id} -X PATCH -f body=${body}`
			} else {
				// Create new comment
				await $`gh pr comment ${prNumber} --body-file body.tmp`
			}

			throw new Error(body)
		}
	})

export { verifyPRCommand }
