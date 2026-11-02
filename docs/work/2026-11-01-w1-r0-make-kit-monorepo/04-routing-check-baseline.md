---
title: "Phase 4: Routing Check Baseline"
kind: "work"
status: "active"
coordinate: "W1 R0 P4"
source:
  type: "prd"
  path: "docs/prd/02-architecture-overview.md"
---

# Phase 4: Routing Check Baseline

## Purpose

This phase builds the routing check and runs it for the first time. The check measures whether agents that start at the repository root land in the right project's docs ([Q-008](../../prd/03-open-questions-and-risk-register.md#q-008-routing-check-method)). It is step 6 of the Step 0 sequence ([Q-021](../../prd/03-open-questions-and-risk-register.md#q-021-step-0-sequence)).

The phase depends on [Phase 1](01-copy-day.md), because the check needs three projects with routers: the root, `kits/make-blueprint/` and `kits/make-docs/`. It runs after [Phase 3](03-ci.md) in the fixed Step 0 order.

## Overview

The repository has several docs roots, and an agent can pick the wrong one ([R-005](../../prd/03-open-questions-and-risk-register.md#r-005-agents-pick-the-wrong-project)). No measurement shows how agents behave here today ([01 Product Overview, Current Limitations](../../prd/01-product-overview.md#current-limitations)). This phase writes `scripts/routing-check/`, which starts fresh read-only agents at the repository root with `claude -p` and `codex exec`. It runs 9 tasks, 3 for Make Docs, 3 for Make Blueprint and 3 repo-wide, twice with each tool, so one check has 36 runs. A run passes when the agent reads the right router and names the right docs root ([02 Architecture Overview, Routing Check](../../prd/02-architecture-overview.md#routing-check)).

The results become the baseline. [Phase 6](06-nested-project-fixes.md) runs the same 9 tasks again after the workaround cleanup and compares each task with this baseline. The baseline is also the input that a later "single project or monorepo" setup option needs ([02 Architecture Overview, Later Scope](../../prd/02-architecture-overview.md#later-scope)).

Naive UAT is not used ([Q-008](../../prd/03-open-questions-and-risk-register.md#q-008-routing-check-method)).

Owner gates in this phase: none.

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `direct`. The promise is "An agent that starts at the repository root can tell which project a task belongs to and reaches that project's routers and docs", owned by [02 Architecture Overview, Several Docs Roots](../../prd/02-architecture-overview.md#several-docs-roots) and [05 Kit Conventions, Routers and Managed Blocks](../../prd/05-kit-conventions.md#routers-and-managed-blocks). The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind it.
- Intended human outcome: for each kit task, a fresh agent reads the root map and then the kit router, and names the kit's docs root. For each repo-wide task, it names the root `docs/`. This phase measures the outcome. It does not change the routers.
- Human-facing surface or indirect effect: the root map in `AGENTS.md` and `CLAUDE.md`, the kit routers, and the docs routers that the agents read.
- Implementation work: Stage 1 writes the tasks, the runner, the grader and the write guard. Stage 2 runs the baseline, records the misses and reviews the result.
- Evidence source or testing type selected under current authority: the routing check, the evidence that [02 Architecture Overview, Routing Check](../../prd/02-architecture-overview.md#routing-check) names. A script runs it with fixed tasks and a fixed pass rule, so this backlog records it under Automated Implementation Testing.
- Executor: the implementing coding agent writes the script. The script starts the routing-check agents, and only the script writes the results file.
- Accepted obligation or deferral route: none. Each miss becomes a root register item with an owner.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | The decision record is below. It covers the grader tests and the baseline run. |
| Performance Testing | not-needed-now | No performance candidate exists. |
| Guided Progress Review | not-needed-now | No current decision needs a guided review. |
| Unassisted Goal Testing | not-needed-now | The owner chose the routing check script, not the Naive UAT format, as the method ([Q-008](../../prd/03-open-questions-and-risk-register.md#q-008-routing-check-method)). The routing check answers the current routing question. |

Decision record for Automated Implementation Testing:

| Field | Value |
| --- | --- |
| Testing type | Automated Implementation Testing |
| Decision informed | Where the root map and the routers fail agents today, and which misses need a register item before the Make Docs 2.1.0 fixes |
| Reason now | The check must run after copy day and before the fixes, so the second check has a baseline ([02 Architecture Overview, Routing Check](../../prd/02-architecture-overview.md#routing-check)) |
| Product maturity | Root map and routers as they are after Phase 3 |
| Scope | 9 tasks × 2 tools × 2 runs = 36 runs at one recorded commit |
| Executor | The routing-check script, with fresh `claude -p` and `codex exec` sessions |
| Gate effect | Advisory for later phases. Each miss needs a register item before this phase closes. |
| Effort budget | One full baseline of 36 runs. Re-run a single run only when the script marks it invalid. |
| Stop condition | 36 valid runs are recorded, or a run writes a file. In that case, stop and fix the read-only setup. |
| Evidence retained | `docs/assets/maintainer/routing-check/<date>-baseline.md`, and inert transcript copies in `evidence/a4nn/` only where a miss needs them |
| Rerun trigger | The second check in Phase 6. A change to the root map before Phase 6 does not trigger a rerun. |

No performance candidate applies, so this phase records no performance lifecycle fields.

Human Experience Review stays separate. In this phase the agent reads the transcripts of the baseline and records, for the routing promise, an observation, a conclusion (`satisfied`, `material gap` or `insufficient evidence`), the limits and the next action.

## Source PRD Docs

- [02 Architecture Overview](../../prd/02-architecture-overview.md)
- [05 Kit Conventions](../../prd/05-kit-conventions.md)
- [01 Product Overview](../../prd/01-product-overview.md)
- [03 Open Questions and Risk Register](../../prd/03-open-questions-and-risk-register.md)

## Source Obligations, Scenarios, And Findings

- Obligations: the baseline measures routing while the workarounds [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-upward-project-search-stops-at-the-nearest-project) to [O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root) are still in the root map. This phase changes no record.
- Decisions carried: [Q-008](../../prd/03-open-questions-and-risk-register.md#q-008-routing-check-method).
- Risks this phase addresses: [R-005](../../prd/03-open-questions-and-risk-register.md#r-005-agents-pick-the-wrong-project).
- Scenarios: none. No `NUAT-###` scenario is activated.
- Findings: each miss becomes a root register item in Stage 2.

## Stage 1 - Routing Check Script

### Tasks

- [ ] t1: Write the 9 tasks in one file in `scripts/routing-check/`, for example `tasks.json`. Write 3 Make Docs tasks, 3 Make Blueprint tasks and 3 repo-wide tasks, each in the words a person would use. For each task, record its ID, its project, the router files that a correct run reads, and the expected docs root: `kits/make-docs/docs/`, `kits/make-blueprint/docs/` or `docs/`. Each task asks the agent to name the docs root it would use and to write no file ([02 Architecture Overview, Routing Check](../../prd/02-architecture-overview.md#routing-check), [Q-008](../../prd/03-open-questions-and-risk-register.md#q-008-routing-check-method)).
- [ ] t2: Write the runner. For each task, each tool and each of 2 runs, it starts one fresh session at the repository root: `claude -p` with a read-only permission mode and a machine-readable transcript, and `codex exec` with a read-only sandbox and a machine-readable transcript. It records the tool name, the tool version and the flags of each run.
- [ ] t3: Keep each run fresh. Start each session with no earlier conversation. Turn off user-level memory and user-level instruction files where the tool allows it, and record in the results file which user-level settings stayed active, so a reader can judge whether the result measures the repository's own routers.
- [ ] t4: Write the grader. A run passes when its transcript shows a read of each expected router file and its final answer names the expected docs root. Any other run is a miss, with a short reason: wrong router, wrong docs root, no docs root named, or a write attempt ([02 Architecture Overview, Routing Check](../../prd/02-architecture-overview.md#routing-check)).
- [ ] t5: Write the write guard. Before and after each run, the script compares `git status --porcelain` and file hashes of the working tree. When a run changes any file, the script marks the run invalid, restores nothing by itself and stops the check. No routing-check agent writes a file in the repository.
- [ ] t6: Write the results writer. Only the script writes `docs/assets/maintainer/routing-check/<date>-baseline.md`. The file lists each of the 36 runs with its task, its project, its tool, its run number and its result, `pass` or `miss`, plus the miss reason, the commit, the tool versions and the active user-level settings ([02 Architecture Overview, Routing Check](../../prd/02-architecture-overview.md#routing-check)).
- [ ] t7: Write grader tests with fixture transcripts: a pass, a wrong router, a wrong docs root, no docs root, and a write attempt.

### Acceptance criteria

- A401: The tasks file holds exactly 9 tasks: 3 with the project Make Docs, 3 with Make Blueprint and 3 repo-wide. Each task names its expected router files and its expected docs root.
- A402: The grader tests pass, and each fixture gets the expected result and reason.
- A403: A test run of the write guard on a fixture run that creates a file marks the run invalid and stops the check.

### Dependencies

- [Phase 1](01-copy-day.md) is complete, so `kits/make-docs/` has its routers.
- `claude` and `codex` are installed and signed in on the machine that runs the check.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage. The script has no result yet.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A401` to `A403` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A401` to `A403` pass.

## Stage 2 - Baseline Run and Register Items

### Tasks

- [ ] t8: Run `make-docs project surface ensure assets --target-root .` if the assets root does not exist yet. Then run the routing check once from the repository root, on a clean working tree at a recorded commit after [Phase 3](03-ci.md).
- [ ] t9: For each miss, add one item to the root register with the next free number in its section, an owner and a link to its row in the results file ([02 Architecture Overview, Routing Check](../../prd/02-architecture-overview.md#routing-check)). When there is no miss, the results file says so.
- [ ] t10: Add the baseline link to the Follow-Up of [R-005](../../prd/03-open-questions-and-risk-register.md#r-005-agents-pick-the-wrong-project). R-005 stays `Open` until the second check in Phase 6.
- [ ] t11: Do the Human Experience Review of the routing promise from the transcripts, and record it in `evidence.md`.
- [ ] t12: Validate the docs from the repository root: `make-docs run prd authority validate --target-root .`, the link-check script for relative links and heading anchors ([O-004](../../prd/03-open-questions-and-risk-register.md#o-004-link-checks-cover-links-between-projects)), and `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root .` ([O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root)).

### Acceptance criteria

- A404: `docs/assets/maintainer/routing-check/<date>-baseline.md` lists 36 runs, 9 tasks × 2 tools × 2 runs, and each run is marked `pass` or `miss`. The file names the commit, the tool versions and the active user-level settings.
- A405: After the check, `git status --porcelain` shows only the new results file and the assets routers, if Make Docs created them.
- A406: Each miss in the results file has a root register item that links its row and names an owner.
- A407: The R-005 Follow-Up links the baseline. `make-docs run prd authority validate --target-root .` exits 0, the link-check script reports 0 broken links, and the backlog snapshot exits 0 with only `BACKLOG-VAL-010`.

### Dependencies

- Stage 1 of this phase.
- [Phase 3](03-ci.md) is complete, as the fixed Step 0 order requires.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent records the routing promise review from the transcripts: which tasks pass, where agents leave the expected path, and whether the root map or a kit router causes each miss. Limit: two runs per task and tool is a small sample, and user-level settings can affect a run.
- Optional experience handoff: one step for the owner: open the baseline file and read the miss reasons. Feedback is optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A404` to `A407` section of `evidence.md`, with a link to the baseline file. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: phase complete when `A401` to `A407` pass. The routing promise stays partial until the second check in Phase 6.
