---
name: code-review
description: Code review practices with technical rigor, design review, and verification gates. Use for receiving feedback, requesting code-reviewer subagent reviews, evaluating whether PR changes need redesign, or preventing false completion claims in pull requests.
license: MIT
---

# Code Review

Guide proper code review practices emphasizing technical rigor, evidence-based claims, and verification over performative responses.

## Overview

Code review requires four distinct practices:

1. **Receiving feedback** - Technical evaluation over performative agreement
2. **Requesting reviews** - Systematic review via code-reviewer subagent
3. **Design review** - Deep-module evaluation for redesign opportunities
4. **Verification gates** - Evidence before any completion claims

Each practice has specific triggers and protocols detailed in reference files.

## Core Principle

**Technical correctness over social comfort.** Verify before implementing. Ask before assuming. Evidence before claims.

## When to Use This Skill

### Receiving Feedback

Trigger when:

- Receiving code review comments from any source
- Feedback seems unclear or technically questionable
- Multiple review items need prioritization
- External reviewer lacks full context
- Suggestion conflicts with existing decisions

**Reference:** `references/code-review-reception.md`

### Requesting Review

Trigger when:

- Completing tasks in subagent-driven development (after EACH task)
- Finishing major features or refactors
- Before merging to main branch
- Stuck and need fresh perspective
- After fixing complex bugs

**Reference:** `references/requesting-code-review.md`

### Design Review

Trigger when:

- Reviewing a pull request or completed feature (alongside correctness review)
- New modules, seams, or adapters appear in the diff
- Interface surface area grows faster than behaviour behind it
- Logic spreads across callers instead of concentrating in one module
- Tests reach past the public interface into implementation details

**Skill:** Load and follow `.agents/skills/codebase-design/SKILL.md`. Use its glossary (module, interface, depth, seam, adapter, leverage, locality) and principles (deletion test, interface-as-test-surface, two-adapters rule).

**Reference:** `references/design-review.md`

### Verification Gates

Trigger when:

- About to claim tests pass, build succeeds, or work is complete
- Before committing, pushing, or creating PRs
- Moving to next task
- Any statement suggesting success/completion
- Expressing satisfaction with work

**Reference:** `references/verification-before-completion.md`

## Quick Decision Tree

```
SITUATION?
│
├─ Received feedback
│  ├─ Unclear items? → STOP, ask for clarification first
│  ├─ From human partner? → Understand, then implement
│  └─ From external reviewer? → Verify technically before implementing
│
├─ Completed work
│  ├─ Major feature/task? → Request code-reviewer subagent review + design review
│  └─ Before merge? → Request code-reviewer subagent review + design review
│
├─ Reviewing a PR diff
│  └─ Load codebase-design skill → flag shallow modules, misplaced seams, redesign opportunities
│
└─ About to claim status
   ├─ Have fresh verification? → State claim WITH evidence
   └─ No fresh verification? → RUN verification command first
```

## Receiving Feedback Protocol

### Response Pattern

READ → UNDERSTAND → VERIFY → EVALUATE → RESPOND → IMPLEMENT

### Key Rules

- ❌ No performative agreement: "You're absolutely right!", "Great point!", "Thanks for [anything]"
- ❌ No implementation before verification
- ✅ Restate requirement, ask questions, push back with technical reasoning, or just start working
- ✅ If unclear: STOP and ask for clarification on ALL unclear items first
- ✅ YAGNI check: grep for usage before implementing suggested "proper" features

### Source Handling

- **Human partner:** Trusted - implement after understanding, no performative agreement
- **External reviewers:** Verify technically correct, check for breakage, push back if wrong

**Full protocol:** `references/code-review-reception.md`

## Requesting Review Protocol

### When to Request

- After each task in subagent-driven development
- After major feature completion
- Before merge to main

### Process

1. Get git SHAs: `BASE_SHA=$(git rev-parse HEAD~1)` and `HEAD_SHA=$(git rev-parse HEAD)`
2. Dispatch code-reviewer subagent via Task tool with: WHAT_WAS_IMPLEMENTED, PLAN_OR_REQUIREMENTS, BASE_SHA, HEAD_SHA, DESCRIPTION
3. Run design review (see below) on the same diff — correctness and shape are separate lenses
4. Act on feedback: Fix Critical immediately, Important before proceeding, note Minor for later

**Full protocol:** `references/requesting-code-review.md`

## Design Review Protocol

Apply whenever reviewing changes — not only after major features. Load `.agents/skills/codebase-design/SKILL.md` first.

### What to look for in the diff

For each new or changed **module** (function, class, package, or tier-spanning slice):

1. **Depth** — Is behaviour concentrated behind a small **interface**, or is the interface nearly as complex as the implementation (shallow)?
2. **Seam placement** — Is the **seam** where variation actually lives? Would a different seam give callers more **leverage** and maintainers more **locality**?
3. **Deletion test** — If this module vanished, would complexity reappear across N callers (earning its keep) or vanish (pass-through)?
4. **Test surface** — Do tests cross the same seam callers use, or do they reach past the interface?
5. **Adapter discipline** — Is there a real seam (two adapters) or a hypothetical one (one adapter)?

### When to recommend redesign

Flag for redesign (not just style nits) when:

- A shallow module adds interface methods without hiding complexity
- Callers duplicate logic the module should own
- A seam splits what varies from what doesn't (wrong cut)
- Tests require mocking internals instead of exercising the public interface
- New layers wrap without deepening (pass-through adapters)

### Severity

- **Critical** — Wrong seam forces widespread caller complexity; fix before merge
- **Important** — Missed deepening opportunity; module will be costly to extend or test
- **Minor** — Interface could be smaller but current shape is workable

For large redesign questions, see `codebase-design/DEEPENING.md` and `codebase-design/DESIGN-IT-TWICE.md`.

**Full protocol:** `references/design-review.md`

## Verification Gates Protocol

### The Iron Law

**NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE**

### Gate Function

IDENTIFY command → RUN full command → READ output → VERIFY confirms claim → THEN claim

Skip any step = lying, not verifying

### Requirements

- Tests pass: `bun run test` — 0 failures
- Format clean: `bun run format` — exit 0
- Type/Astro checks pass where available: `bun --cwd apps/docs run check` and/or `bun --cwd examples/base run check` — exit 0
- Build succeeds: `bun run build` — exit 0
- Bug fixed: Test original symptom passes
- Requirements met: Line-by-line checklist verified

### Verification Commands

Use **Bun** (see root `package.json`). Run the checks relevant to the files you changed before claiming work is complete:

```bash
bun run format                    # prettier --write --check
bun run test                      # turbo run test
bun run build                     # turbo run build
bun --cwd apps/docs run check     # astro check && tsc
bun --cwd examples/base run check # astro check && tsc
```

### Red Flags - STOP

Using "should"/"probably"/"seems to", expressing satisfaction before verification, committing without verification, trusting agent reports, ANY wording implying success without running verification

**Full protocol:** `references/verification-before-completion.md`

## Integration with Workflows

- **Subagent-Driven:** Review after EACH task, verify before moving to next
- **Pull Requests:** Run the applicable verification commands (`bun run format`, `bun run test`, `bun run build`, and package `check` scripts where relevant), request code-reviewer review and design review before merge
- **General:** Apply verification gates before any status claims, push back on invalid feedback

## Bottom Line

1. Technical rigor over social performance - No performative agreement
2. Systematic review processes - Use code-reviewer subagent
3. Shape matters - Load codebase-design skill; flag redesign opportunities in every PR review
4. Evidence before claims - Verification gates always

Verify. Question. Evaluate depth and seams. Then implement. Evidence. Then claim.
