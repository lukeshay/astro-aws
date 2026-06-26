---
name: fix-pr
description: >-
  Triage and address unresolved GitHub PR review comments and fix failing CI
  checks: validate feedback (do not assume comments are correct), mark with
  eyes, thumbs up/down for address vs push back, implement fixes, commit and
  push. Use when the user asks to address PR comments, triage review feedback,
  fix failing checks, respond to PR review, or invokes /fix-pr.
---

# Address PR Comments & CI

Workflow for unresolved PR feedback and failing checks on the current branch (or a given PR number/URL).

**Do not treat comments as truth.** Read the referenced code and validate each suggestion before acting. If a comment is wrong, outdated, or based on a misunderstanding, mark 👎 and reply on the thread with a clear explanation — cite the relevant code or behavior. Only implement changes you agree are correct.

## Prerequisites

- `gh` authenticated (`gh auth status`)
- On the PR branch, or pass PR number/URL explicitly
- Read project rules (`AGENTS.md`, commit/PR user rules) before pushing

## Workflow

Copy this checklist and track progress:

```
- [ ] 1. Fetch unresolved comments (no 👀) + failing CI checks
- [ ] 2. Mark each comment with 👀 (EYES)
- [ ] 3. Triage comments: 👍 address / 👎 push back with reply
- [ ] 4. Implement 👍 items; reply on thread when done
- [ ] 5. Fix failing checks (in scope)
- [ ] 6. Commit and push
```

Process comments **one at a time** in thread order (oldest first). Do not batch-react without reading each comment body.

Fix failing checks **one at a time** — reproduce locally, fix root cause, re-run the matching local command before moving on.

---

## Step 1 — Fetch unresolved comments and failing checks

Resolve repo + PR:

```bash
OWNER=$(gh repo view --json owner -q .owner.login)
REPO=$(gh repo view --json name -q .name)
PR=$(gh pr view --json number -q .number)   # or: gh pr view 42 --json number -q .number
```

### 1a — Inline review threads (unresolved only)

```bash
gh api graphql -f query='
query($owner: String!, $repo: String!, $pr: Int!) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      reviewThreads(first: 100) {
        nodes {
          id
          isResolved
          path
          line
          comments(first: 50) {
            nodes {
              id
              databaseId
              body
              author { login }
              createdAt
              reactions(first: 30) {
                nodes { content user { login } }
              }
            }
          }
        }
      }
    }
  }
}' -f owner="$OWNER" -f repo="$REPO" -F pr="$PR"
```

### 1b — Top-level PR conversation comments

```bash
gh api graphql -f query='
query($owner: String!, $repo: String!, $pr: Int!) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      comments(first: 100) {
        nodes {
          id
          databaseId
          body
          author { login }
          createdAt
          reactions(first: 30) {
            nodes { content user { login } }
          }
        }
      }
    }
  }
}' -f owner="$OWNER" -f repo="$REPO" -F pr="$PR"
```

### 1c — Failing CI checks

```bash
gh pr checks "$PR" --json name,bucket,state,link,description \
  --jq '.[] | select(.bucket == "fail")'
```

Also note merge state (branch may be behind base):

```bash
gh pr view "$PR" --json mergeable,mergeStateStatus,baseRefName,statusCheckRollup \
  --jq '{mergeable, mergeStateStatus, baseRefName, checks: [.statusCheckRollup[] | {name, state, conclusion}]}'
```

If checks are **pending**, snapshot status once and note in output — do not watch. Fix only checks already in `fail` state.

### Comment filter rules

Include a comment/thread when **all** of:

| Rule       | Detail                                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------------------- |
| Unresolved | Review thread: `isResolved == false`. Top-level: not a bot-only status comment you already handled.       |
| No 👀 yet  | No `EYES` reaction on the **latest comment in the thread** (review) or on the comment itself (top-level). |
| Actionable | Human or bot feedback requesting a change, question, or concern — not pure approval or "LGTM".            |

**Read only** `body`, `path`, `line`, `author`, `id`, and reaction data. Do not load full diffs or entire JSON blobs into context unless needed to act.

Skip threads already marked 👀 (already triaged or in progress).

### CI scope rules

| Do fix                                                         | Do not fix                                              |
| -------------------------------------------------------------- | ------------------------------------------------------- |
| Failures caused by this PR's code (lint, test, build, types)   | Changing CI/workflows just to make checks pass          |
| Regressions introduced on the branch                           | Unrelated production bugs outside PR scope              |
| Branch behind base — merge/rebase base first, then re-check CI | Failures on base branch too — report, don't hack around |

---

## Step 2 — Mark with eyes

For each comment to process, add `EYES`:

```bash
gh api graphql -f query='
mutation($subjectId: ID!) {
  addReaction(input: { subjectId: $subjectId, content: EYES }) {
    reaction { content }
  }
}' -f subjectId="COMMENT_NODE_ID"
```

Use the GraphQL `id` field (e.g. `PRRC_...` or `IC_...`), not `databaseId`.

Mark 👀 **before** triage so parallel agents or re-runs skip in-progress items.

---

## Step 3 — Triage: address or push back

Read the referenced file/line and surrounding code **before** triaging. Comments — including Bugbot — are hypotheses until verified.

### 👍 THUMBS_UP — address

Only after validation: real bug, correct suggestion, missing test, docs drift, security concern, or reviewer question that genuinely needs a code/docs change.

```bash
gh api graphql -f query='
mutation($subjectId: ID!) {
  addReaction(input: { subjectId: $subjectId, content: THUMBS_UP }) {
    reaction { content }
  }
}' -f subjectId="COMMENT_NODE_ID"
```

### 👎 THUMBS_DOWN — push back (no code change)

Use when the comment is **incorrect** or not worth acting on: already fixed, factually wrong, misreads the code, out of scope, rejected stylistic preference, or based on a false assumption.

**Always reply on the thread** explaining why — point to the code, prior fix, or reasoning. Do not silently skip. Do not change code to appease a wrong comment.

```bash
gh api graphql -f query='
mutation($subjectId: ID!) {
  addReaction(input: { subjectId: $subjectId, content: THUMBS_DOWN }) {
    reaction { content }
  }
}' -f subjectId="COMMENT_NODE_ID"
```

### Triage notes

- **Bugbot / automated review**: treat like any other comment — verify against the code. 👍 only when the finding is real; 👎 + reply when it misread the diff or flagged a non-issue.
- **Human reviewers**: same bar. Agreeing by default is wrong. Push back respectfully when they missed context.
- **Uncertain**: 👎 with a reply asking for clarification — do not guess and implement.
- One comment → one triage outcome. Do not 👍 and 👎 the same comment.

---

## Step 4 — Address comments

### 👍 items — implement

1. Read the file/line referenced (`path`, `line` from thread).
2. Make the minimal correct fix. Match repo conventions (`AGENTS.md`).
3. Run project checks before commit:
   ```bash
   pnpm run lint && pnpm run format && pnpm run test && pnpm run build
   ```
4. Reply on the thread when the fix is pushed (or in the same commit if replying before push):

**Review thread reply:**

```bash
gh api graphql -f query='
mutation($threadId: ID!, $body: String!) {
  addPullRequestReviewThreadReply(input: { pullRequestReviewThreadId: $threadId, body: $body }) {
    comment { url }
  }
}' -f threadId="THREAD_NODE_ID" -f body="Fixed in <sha-short>: <one-line summary>"
```

**Top-level PR comment reply:**

```bash
gh pr comment "$PR" --body "Re: <quote snippet> — <response>"
```

**Resolve thread** after fix is confirmed (optional but preferred for inline review):

```bash
gh api graphql -f query='
mutation($threadId: ID!) {
  resolveReviewThread(input: { threadId: $threadId }) {
    thread { isResolved }
  }
}' -f threadId="THREAD_NODE_ID"
```

### 👎 items — reply with reasoning

Reply on the thread (required). Explain **why** the comment does not need a change:

- What the code actually does vs what the comment assumes
- Why the suggested change would be wrong or unnecessary
- Link to line/commit if already addressed elsewhere

Keep it concise and factual — not defensive. Do not change code. Resolve the thread if the pushback is complete and no further discussion is expected.

**Example reply body:** `This looks like a false positive — \`foo\` is already guarded by the check on line 42. The handler only runs when \`bar\` is set, so the nil case can't happen here.`

---

## Step 5 — Fix failing checks

For each failing check from step 1c:

1. **Fetch logs** — parse run/job IDs from the check `link`:

   ```bash
   LINK="<check link from gh pr checks>"
   RUN_ID=$(echo "$LINK" | sed -n 's|.*/runs/\([0-9]*\)/.*|\1|p')
   JOB_ID=$(echo "$LINK" | sed -n 's|.*/job/\([0-9]*\).*|\1|p')
   gh run view "$RUN_ID" --job "$JOB_ID" --log-failed
   ```

   Read only the failing step output — not the full log unless needed.

2. **Reproduce locally** — map check name to project commands (adjust per repo):
   | Check pattern | Local command |
   | ------------------ | -------------------- |
   | lint | `pnpm run lint` |
   | format | `pnpm run format` |
   | test | `pnpm run test` |
   | build | `pnpm run build` |
   | unknown | read CI workflow YAML |

3. **Fix root cause** — minimal diff in PR scope. Do not weaken assertions, skip tests, or edit workflow files to silence failures.

4. **Re-run** the local command until it passes before moving to the next failing check.

### Branch behind base

If failures look unrelated or `mergeStateStatus` is `BEHIND`:

```bash
BASE=$(gh pr view "$PR" --json baseRefName -q .baseRefName)
git fetch origin "$BASE"
git merge "origin/$BASE"   # or rebase if branch policy prefers it
```

Re-run step 1c after merge. Some failures may clear without code changes.

---

## Step 6 — Commit and push

Only after 👍 items are implemented and local checks pass.

```bash
git status
git diff
git log -3 --oneline
```

Stage relevant files, commit with a message focused on **why** (HEREDOC):

```bash
git add <files>
git commit -m "$(cat <<'EOF'
fix: address PR review feedback and CI failures

<short summary of comments resolved and checks fixed>
EOF
)"
git push
```

If the branch has no upstream: `git push -u origin HEAD`.

Do not watch CI after push — report current check status from a one-shot `gh pr checks` if needed. Re-run step 1 after push to catch any new unresolved comments without 👀.

---

## Output format

When finished (or blocked), report:

```markdown
## PR triage — #<number>

### Comments

| Comment                | Author | Triage | Action                        |
| ---------------------- | ------ | ------ | ----------------------------- |
| <path:line or snippet> | @user  | 👍/👎  | fixed / pushed back / skipped |

### CI

| Check  | Status                          | Action    |
| ------ | ------------------------------- | --------- |
| <name> | fixed / still failing / pending | <summary> |

**Commit:** <sha or "none">
**Pushed:** yes/no
**CI:** green / pending / failing (<names>)
**Remaining unresolved comments (no 👀):** <count>
```

## Stop conditions

- **Merge conflicts** on push or after merging base: stop, report, ask user.
- **Failing CI out of scope** (base branch broken, infra flake, needs workflow change): report with check name + log excerpt; do not hack around.
- **Conflicting reviewer intent**: stop and ask user before picking a side.
