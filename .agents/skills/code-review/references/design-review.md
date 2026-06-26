---
name: design-review
description: Use when reviewing pull requests or completed work to evaluate module depth, seam placement, and redesign opportunities — applies the codebase-design skill vocabulary to diffs
---

# Design Review

Evaluate whether changes in a pull request should be **redesigned**, not just whether they are correct. Load `.agents/skills/codebase-design/SKILL.md` before starting — use its glossary and principles throughout.

**Core principle:** Correct code in the wrong shape becomes expensive quickly.

## When to Run

**Mandatory** (alongside correctness review):

- Before merge to main
- After completing a major feature or refactor
- When reviewing any PR that introduces new modules, seams, or adapters

**Especially valuable:**

- New packages or directories appear in the diff
- Interface method count grows faster than hidden behaviour
- Multiple callers gain similar conditional logic
- Tests mock internals or reach past the public interface

## How to Review

**1. Identify modules in the diff**

Scan added/changed files for **modules** (functions, classes, packages, tier-spanning slices). Group related changes into candidate modules — don't review file-by-file in isolation.

**2. Apply the codebase-design lens**

For each candidate module, answer:

| Question       | Shallow signal                                                       | Deep signal                                         |
| -------------- | -------------------------------------------------------------------- | --------------------------------------------------- |
| Interface size | Many methods/params; callers must know ordering, config, error modes | Few entry points; complexity hidden inside          |
| Seam placement | Variation leaks to callers; adapter is a thin pass-through           | Seam cuts where behaviour actually varies           |
| Deletion test  | Removing module changes nothing; logic already lives in callers      | Removing module forces logic back into N call sites |
| Test surface   | Tests stub private methods or inspect internals                      | Tests exercise the same interface callers use       |
| Adapters       | One implementation at a seam (hypothetical)                          | Two+ adapters, or clear future second adapter       |

**3. Classify findings**

- **Redesign recommended** — wrong seam, shallow module earning no leverage, pass-through layer, caller complexity that should be local
- **Deepening opportunity** — module is on the right seam but interface could shrink or behaviour could move inward
- **Shape OK** — depth and seam placement are sound; only correctness/style feedback applies

**4. Report with vocabulary**

Use codebase-design terms in feedback so it is actionable:

- "This is a **shallow module** — the interface exposes X but implementation only passes through to Y."
- "The **seam** should move to Z so callers get more **leverage**."
- "Failing the **deletion test** — removing this wrapper doesn't change caller complexity."
- "Tests cross the **interface** correctly" / "Tests reach past the **interface** into implementation."

## Severity

| Severity  | Meaning                                                | Action                                                     |
| --------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| Critical  | Wrong seam; widespread caller complexity; hard to test | Block merge; redesign                                      |
| Important | Missed deepening; will slow future changes             | Fix before merge or open follow-up with explicit trade-off |
| Minor     | Interface could be smaller; workable as-is             | Note for later                                             |

## Integration with Code Review

Design review runs **in parallel** with correctness review — same diff, different lens:

```
PR diff
├── Correctness review (bugs, requirements, edge cases)
└── Design review (depth, seams, leverage, locality)
```

Do not skip design review because correctness looks fine. Shallow modules merge cleanly and compound cost later.

## Escalation

When redesign scope is large or multiple interfaces could work:

- **Deepening a cluster** — see `codebase-design/DEEPENING.md`
- **Exploring alternatives** — see `codebase-design/DESIGN-IT-TWICE.md`

## Red Flags

**Never:**

- Treat "it works" as sufficient — shape matters
- Suggest redesign without naming the seam, interface, or depth problem
- Recommend a new abstraction layer without the two-adapters rule
- Use vague terms ("component," "service," "boundary") instead of module/interface/seam

**When redesign is not warranted:**

- Small, local change with no new seam
- Interface is already minimal for the behaviour it owns
- Premature abstraction with no second adapter in sight (YAGNI)
