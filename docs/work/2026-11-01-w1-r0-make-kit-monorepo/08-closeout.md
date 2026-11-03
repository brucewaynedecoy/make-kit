---
title: "Phase 8: Closeout"
kind: "work"
status: "active"
coordinate: "W1 R0 P8"
source:
  type: "prd"
  path: "docs/prd/03-open-questions-and-risk-register.md"
---

# Phase 8: Closeout

## Purpose

This phase closes Step 0. It checks every Q, R, D and O item in the root register for its final status, confirms that Make Blueprint phase `01-shared-core-adoption` can start, and writes the closeout history record. It is step 10 of the Step 0 sequence ([Q-021](../../prd/03-open-questions-and-risk-register.md#q-021-step-0-sequence), [01 Product Overview, Release Scope](../../prd/01-product-overview.md#release-scope)).

The phase depends on [Phase 7](07-shared-core.md): Make Docs 2.2.0 is on `latest` and depends on exactly core `0.1.0`.

## Overview

The register audit gives each item one of two results. Either the item is `Closed` or `Fulfilled` with a resolution and its evidence, or it stays `Open` or `Deferred` with an owner and a target. No Step 0 item stays open without an owner and a target. The audit includes the orphan audit of the [Deferred Obligation Contract](make-docs://system/contract/deferred-obligation-contract.md): each accepted future outcome, deferred finding or narrowed claim is routed.

The closeout states phase status and capability status separately. `Phase complete` means a phase finished its approved scope. `Capability complete` means no accepted required outcome for that capability stays open, deferred or unrouted. A phase can be complete while its capability stays partial.

Make Blueprint is a separate project. This phase reads the Make Blueprint backlog and changes no Make Blueprint file.

Owner gates in this phase: none.

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `direct`. This phase rolls up the Human Experience Review of all six promises in [01 Product Overview, Experience Promises](../../prd/01-product-overview.md#experience-promises). Four promises have Step 0 work: routing, the npm package name, `latest` only after `next`, and the visible workarounds. Two promises belong to the setup tool wave and have no Step 0 work ([Q-001](../../prd/03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope)). The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind them.
- Intended human outcome: the owner reads one closeout record and sees, for each promise and each capability, whether it is complete, partial or routed to a later wave, with the next owner and target.
- Human-facing surface or indirect effect: the root register, the closeout history record, and the root PRD release scope.
- Implementation work: Stage 1 audits the register. Stage 2 checks the Make Blueprint start conditions. Stage 3 writes the closeout record and runs the final validation.
- Evidence source or testing type selected under current authority: review of the register and of the central `evidence.md` report of this backlog. The final validation commands are Automated Implementation Testing.
- Executor: the implementing coding agent.
- Accepted obligation or deferral route: none new. The audit confirms that O-001 to O-005 are `Fulfilled`, that O-006 is `Fulfilled` or carried forward by the owner with a recorded reason, and that each open item names an owner and a target.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | The decision record is below. It covers the final validation commands only. |
| Performance Testing | not-needed-now | No performance candidate exists. |
| Guided Progress Review | not-needed-now | No current decision needs a guided review. The owner reads the closeout record as a normal report. |
| Unassisted Goal Testing | not-needed-now | No PRD requires it. The routing checks in Phases 4 and 6 answer the routing question. |

Decision record for Automated Implementation Testing:

| Field | Value |
| --- | --- |
| Testing type | Automated Implementation Testing |
| Decision informed | Whether the root docs are valid at Step 0 closeout, so Make Blueprint and the setup tool wave can read them as authority |
| Reason now | The closeout changes the register and the release scope text |
| Product maturity | Step 0 releases shipped |
| Scope | `make-docs run prd authority validate`, the Make Docs link check, `make-docs run work backlog snapshot` and the `paths_validate` MCP tool, for the root project |
| Executor | The implementing coding agent |
| Gate effect | Blocking for the phase close |
| Effort budget | One run of each command after the last edit |
| Stop condition | All commands pass |
| Evidence retained | Command outputs in the `A801` to `A810` section of `evidence.md` |
| Rerun trigger | Any change to the root PRDs or this backlog after the run |

No performance candidate applies, so this phase records no performance lifecycle fields.

Human Experience Review stays separate. In this phase the agent rolls up the per-promise reviews from Phases 4 to 7 and records one final conclusion for each promise, with its evidence and limits.

## Source PRD Docs

- [03 Open Questions and Risk Register](../../prd/03-open-questions-and-risk-register.md)
- [01 Product Overview](../../prd/01-product-overview.md)
- [02 Architecture Overview](../../prd/02-architecture-overview.md)
- [06 Shared Core](../../prd/06-shared-core.md)

## Source Obligations, Scenarios, And Findings

- Obligations: [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-upward-project-search-stops-at-the-nearest-project), [O-002](../../prd/03-open-questions-and-risk-register.md#o-002-commands-resolve-the-nearest-project), [O-003](../../prd/03-open-questions-and-risk-register.md#o-003-mcp-server-resolves-the-project-from-a-path), [O-004](../../prd/03-open-questions-and-risk-register.md#o-004-link-checks-cover-links-between-projects) and [O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root), each audited for `Fulfilled`. [O-006](../../prd/03-open-questions-and-risk-register.md#o-006-client-data-in-the-old-make-docs-repository) is audited for `Fulfilled` or for a carry-forward by the owner with a recorded reason.
- Register sections audited: [Confirmed Drift](../../prd/03-open-questions-and-risk-register.md#confirmed-drift) (D-001 to D-041), [Open Questions](../../prd/03-open-questions-and-risk-register.md#open-questions) (Q-001 to Q-035 and any later item), [Rebuild Risks](../../prd/03-open-questions-and-risk-register.md#rebuild-risks) (R-001 to R-011 and any later item) and [Deferred Obligations](../../prd/03-open-questions-and-risk-register.md#deferred-obligations).
- Scenarios: none. No `NUAT-###` scenario was activated in Step 0.
- Findings: the routing-check misses from Phases 4 and 6, each with its register item.

## Stage 1 - Register Audit

### Tasks

- [ ] t1: Audit Q-001 to Q-035 and each later Q item. Each item is `Closed` with a resolution, or `Open` or `Deferred` with an owner and a target. Q-031, Q-033 and Q-034 are `Closed` from Phase 7. Q-027 to Q-030 stay `Deferred` with the setup tool wave as their target ([Q-001](../../prd/03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope)).
- [ ] t2: Audit R-001 to R-011 and each later R item. Check the risks that Step 0 closes: [R-001](../../prd/03-open-questions-and-risk-register.md#r-001-core-release-friction), [R-003](../../prd/03-open-questions-and-risk-register.md#r-003-broken-release-at-the-switch-point), [R-004](../../prd/03-open-questions-and-risk-register.md#r-004-exposed-history-in-the-public-repository), [R-005](../../prd/03-open-questions-and-risk-register.md#r-005-agents-pick-the-wrong-project), [R-006](../../prd/03-open-questions-and-risk-register.md#r-006-make-docs-tests-that-assume-the-repository-root), [R-007](../../prd/03-open-questions-and-risk-register.md#r-007-urgent-fix-during-the-freeze), [R-008](../../prd/03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206) and [R-009](../../prd/03-open-questions-and-risk-register.md#r-009-urgent-make-docs-fix-during-the-core-slices). For each risk that stays open, record an owner and a target in its Follow-Up: [R-002](../../prd/03-open-questions-and-risk-register.md#r-002-two-core-versions-in-one-project) and [R-011](../../prd/03-open-questions-and-risk-register.md#r-011-project-and-machine-folders-overlap) need a second kit on the core, and [R-010](../../prd/03-open-questions-and-risk-register.md#r-010-store-schema-locked-at-version-6) needs a design or an owner decision.
- [ ] t3: Audit D-001 to D-041. Check that the items with a set release are `Closed` with that release and its evidence: [D-024](../../prd/03-open-questions-and-risk-register.md#d-024-two-project-root-searches) in 2.1.0, and [D-029](../../prd/03-open-questions-and-risk-register.md#d-029-block-markers-are-not-tag-aware), [D-030](../../prd/03-open-questions-and-risk-register.md#d-030-setup-remove-keeps-the-kit-block), [D-002](../../prd/03-open-questions-and-risk-register.md#d-002-uninstall-text-disagrees-with-store-removal) and [D-039](../../prd/03-open-questions-and-risk-register.md#d-039-setup-remove-guard-uses-a-fixed-store-path) in 2.2.0. For each item with no release set, record its owner and an owner-routed target in its Follow-Up, such as a later Make Docs wave or the Make Docs register item from Phase 1. [D-010](../../prd/03-open-questions-and-risk-register.md#d-010-uat-validators-exit-0-when-not-passed) points to the Naive UAT removal item in the Make Docs register.
- [ ] t4: Audit O-001 to O-005. Each record has the status `Fulfilled`, the version 2.1.0 and its proof command, and the root map has no numbered workaround ([Deferred Obligations](../../prd/03-open-questions-and-risk-register.md#deferred-obligations)). Also audit [O-006](../../prd/03-open-questions-and-risk-register.md#o-006-client-data-in-the-old-make-docs-repository): it is `Fulfilled`, or it stays `Deferred` because the owner carried it forward, with the reason in its history note.
- [ ] t5: Run the orphan audit. Check that each accepted future outcome, deferred finding and narrowed claim of Step 0 is routed to an owner and a target: the two setup tool promises, the Naive UAT removal, the porting of the unmerged branches of the old repository, each routing-check miss, and the later Make Docs scope in [01 Product Overview, Release Scope](../../prd/01-product-overview.md#release-scope).
- [ ] t6: Write the phase and capability status table: for each of Phases 1 to 8, its phase status; and for each capability in [01 Product Overview, Capabilities](../../prd/01-product-overview.md#capabilities) and each experience promise, its capability status (`complete`, `partial` or `routed`) with the reason.

### Acceptance criteria

- A801: A script lists every Q, R, D and O heading in the root register with its status. Each item with the status `Open` or `Deferred` names an owner and a target in its Follow-Up.
- A802: D-024, D-029, D-030, D-002 and D-039 are `Closed`, each with its release and evidence. O-001 to O-005 are `Fulfilled`, each with the version 2.1.0 and its proof command. O-006 is `Fulfilled`, or it stays `Deferred` with the owner's recorded reason for the carry-forward.
- A803: The orphan audit lists each routed outcome with its owner and target, and finds no unrouted item.
- A804: The status table gives each phase a phase status and each capability and promise a separate capability status.

### Dependencies

- [Phase 7](07-shared-core.md) is complete.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage. The roll-up is in Stage 3.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A801` to `A804` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A801` to `A804` pass.

## Stage 2 - Make Blueprint Start Check

### Tasks

- [ ] t7: Read the Dependencies of each stage of the Make Blueprint phase [01 Shared Core Adoption](../../../kits/make-blueprint/docs/work/2026-10-30-w1-r1-make-blueprint-v2/01-shared-core-adoption.md). Check each dependency that Step 0 owns: `@brucewaynedecoy/make-core` is published, its parts take each kit's names as input, its managed blocks are tag-aware, and its uninstall fix takes out only the calling kit's block ([06 Shared Core, Core Versions and the Exact Pin](../../prd/06-shared-core.md#core-versions-and-the-exact-pin)).
- [ ] t8: Name each Make Blueprint phase 01 dependency that Step 0 does not own, such as the shared `.make/config.yaml` and `.make/personas.yaml` support of the setup tool wave, with its owner.
- [ ] t9: Tell the owner in chat whether Make Blueprint phase `01-shared-core-adoption` can start, and which of its stages wait for the setup tool wave. Change no Make Blueprint file.

### Acceptance criteria

- A805: The evidence lists each Make Blueprint phase 01 dependency with its owner and its state: met by Step 0, or owned by the setup tool wave.
- A806: `git status --porcelain kits/make-blueprint` shows no change from this phase.

### Dependencies

- Stage 1 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A805` and `A806` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A805` and `A806` pass.

## Stage 3 - Closeout Record and Final Validation

### Tasks

- [ ] t10: With the PRD change process, update the status text of the Step 0 releases in [01 Product Overview, Release Scope](../../prd/01-product-overview.md#release-scope), and each limitation in [Current Limitations](../../prd/01-product-overview.md#current-limitations) that Step 0 ended.
- [ ] t11: Roll up the Human Experience Review of the six promises from Phases 4 to 7, and record one final conclusion for each promise in `evidence.md`, with its evidence, its limits and its next action. The two setup tool promises get the conclusion that they are routed to the setup tool wave, not satisfied.
- [ ] t12: Run `make-docs project surface ensure archive --target-root .`. Then write the closeout history record `.make-docs/archive/history/<date>-w1-r0-p8-step-0-closeout.md` with the coordinate `W1 R0 P8`, as `make-docs://system/contract/history-record-contract.md` and its template require. The record links this backlog, the central `evidence.md` report, the status table of t6 and the Make Blueprint start check.
- [ ] t13: Link the central `evidence.md` report from [the index](00-index.md) of this backlog, and check that it holds a section for each acceptance ID from A101 to A810 or a reason why no record is needed.
- [ ] t14: Run the final validation from the repository root: `make-docs run prd authority validate --target-root .`, the Make Docs link check, `make-docs run work backlog snapshot --target-root .`, and the `paths_validate` MCP tool with the repository root as `targetRoot`.

### Acceptance criteria

- A807: 01 Product Overview states the shipped status of Make Docs 2.0.7, 2.1.0 and 2.2.0 and core `0.1.0`, and `make-docs run prd authority validate --target-root .` exits 0.
- A808: `evidence.md` holds one final conclusion for each of the six promises, and the index links `evidence.md`.
- A809: The closeout history record exists at `.make-docs/archive/history/` with the coordinate `W1 R0 P8`, and every link in it resolves.
- A810: The Make Docs link check reports 0 broken links. `make-docs run work backlog snapshot --target-root .` exits 0, and its only diagnostic is `BACKLOG-VAL-010`. The `paths_validate` MCP tool reports no findings.

### Dependencies

- Stage 2 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the roll-up of t11. Limit: the conclusions rest on the evidence of Phases 4 to 7 and on agent review. They do not claim a person's lived experience.
- Optional experience handoff: one step for the owner: read the closeout history record and the status table. Feedback is optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A807` to `A810` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: phase complete when `A801` to `A810` pass. Step 0 is phase complete. The setup tool capability and its two promises stay `routed` to the setup tool wave, so the Make Kit stack is not capability complete at Step 0.
