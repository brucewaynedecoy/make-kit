---
title: "Make Blueprint v2.0 Work Backlog"
kind: "work"
status: "active"
coordinate: "W1 R1"
follow_on:
  route: "implementation-loop"
  next_prompt: ".make-docs/system/references/execution-workflow.md"
  why: "The backlog is the implementation queue derived from the plan and PRD contract."
  coordinate_handoff: "Carry this backlog's W/R coordinate into phase history records and commits, adding the active P coordinate for each phase."
source:
  type: "prd"
  path: "docs/prd/00-index.md"
---

# Make Blueprint v2.0 Work Backlog

## Purpose

This backlog is the implementation queue for all v2.0 scope in the Make Blueprint PRD set, as the [PRD index](../../prd/00-index.md) maps it. It is the work queue for the `W1 R1` plan, the [Make Blueprint v2 Owner Decision Maintenance Plan](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md), whose [Work Backlog Scope](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/07-work-backlog-scope.md) phase fixed what this backlog covers.

The PRDs are the authority. The plan fixed the scope and the phase map, but it is not a requirement source. Where a phase file and a PRD differ, the PRD wins, and the gap goes to the [open questions and risk register](../../prd/03-open-questions-and-risk-register.md) through the Make Docs PRD change process.

Out of scope: the ten deferred register items Q-050 to Q-056, Q-059, Q-074 and Q-075, and all v2.1, v2.2 and v3 scope. PRD 18 enters v2.0 only through the shared write lock in [Phase 3](03-storage-and-identity.md) and the reserved `serve` command in [Phase 2](02-cli-and-packaging.md).

Phase 01 depends on repo-wide work outside this backlog: Step 0 and the `make-kit` setup tool work in the [Make Kit Monorepo](../../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design. That work pulls the shared core into `packages/core/` and builds the shared `.make/config.yaml` and `.make/personas.yaml` support that this backlog adopts.

Read the phase files in order, from 01 to 09. Each phase file names its owning PRDs, its Human Experience outcome, its four testing decisions and its stages in dependency order. Task IDs start at `t1` in each file. Acceptance IDs take the form `A<phase><nn>`, such as `A301`, and are unique across the backlog.

## Human Experience Trace

Authority: the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md), with the source design's `## Human Experience Intent` as the local outcome authority. Impact is `direct` for all eight promises. Each implementation gate lists the acceptance IDs that must pass before the promise counts as kept.

| Impact or promise | Source design and plan | Owning PRD or preserved boundary | Work phase | Evidence source or selected testing type | Implementation gate | Accepted obligation, if any |
| --- | --- | --- | --- | --- | --- | --- |
| Install Make Blueprint alone, Make Docs alone, or both; handoff works with no extra setup | [v2 architecture design](../../designs/2026-10-29-make-blueprint-v2-architecture.md#human-experience-intent); [W1 R1 plan](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md#human-experience-propagation) | [05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#separate-or-together); [07 Installation and Distribution](../../prd/07-installation-and-distribution.md#install-alone-or-together) | [01 Shared Core Adoption](01-shared-core-adoption.md); [02 CLI and Packaging](02-cli-and-packaging.md) | Automated Implementation Testing: install matrix on fresh projects, including a kit set up after another reading the shared choices; Human Experience Review of first-run setup | Phase 1: `A118` to `A125` and `A129`. Phase 2: `A237`, `A238`, `A243`, `A244`, `A246`, `A247` and `A259`. | None |
| One signed file works on a machine with no Python | [v2 architecture design](../../designs/2026-10-29-make-blueprint-v2-architecture.md#human-experience-intent); [W1 R1 plan](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md#human-experience-propagation) | [07 Installation and Distribution](../../prd/07-installation-and-distribution.md#signed-single-files) | [02 CLI and Packaging](02-cli-and-packaging.md); [09 v1 Import and Release](09-v1-import-and-release.md) | Automated Implementation Testing in a clean container with no Python and no Node, on each Q-006 target | Phase 2: `A248` to `A253`. Phase 9: `A934` to `A936`. | None |
| Evidence links reach the exact place in a source and flag changed sources | [v2 architecture design](../../designs/2026-10-29-make-blueprint-v2-architecture.md#human-experience-intent); [W1 R1 plan](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md#human-experience-propagation) | [10 Records and Identity](../../prd/10-records-and-identity.md#evidence-links-are-checked-and-flag-changed-sources); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#reading-sources-and-following-evidence-links) | [04 Record Types](04-record-types.md); [05 Intake and Conversion](05-intake-and-conversion.md) | Automated Implementation Testing: anchor and CSV position resolution, changed-hash detection, and the missing state for files kept out of git | Phase 4: `A423` to `A428`. Phase 5: `A512`, `A528` to `A532`, `A534` and `A535`. | None |
| A record change reads as a git diff of one Markdown file | [v2 architecture design](../../designs/2026-10-29-make-blueprint-v2-architecture.md#human-experience-intent); [W1 R1 plan](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md#human-experience-propagation) | [09 Storage and Indexing](../../prd/09-storage-and-indexing.md#record-changes-read-as-one-file-git-diffs); [10 Records and Identity](../../prd/10-records-and-identity.md#statuses) | [03 Storage and Identity](03-storage-and-identity.md) for the serializer side; [06 Extraction and Review](06-extraction-and-review.md) for review and the approved pending change | Automated Implementation Testing: an approved pending change writes one file with the same `id`; Human Experience Review of a sample diff | Phase 3: `A305`, `A309` and `A353`. Phase 6: `A627`, `A630` and `A631`. | None |
| User text in `AGENTS.md` and `CLAUDE.md` survives setup, update and uninstall of either tool | [v2 architecture design](../../designs/2026-10-29-make-blueprint-v2-architecture.md#human-experience-intent); [W1 R1 plan](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md#human-experience-propagation) | [06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#managed-blocks) | [01 Shared Core Adoption](01-shared-core-adoption.md); [02 CLI and Packaging](02-cli-and-packaging.md) | Automated Implementation Testing: round-trip tests with user text above, between and below both blocks | Phase 1: `A110` to `A117`. Phase 2: `A239` and `A245`. | None |
| One status command shows project state and the next useful action | [v2 architecture design](../../designs/2026-10-29-make-blueprint-v2-architecture.md#human-experience-intent); [W1 R1 plan](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md#human-experience-propagation) | [08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status) | [08 MCP, Skills and Status](08-mcp-skills-and-status.md) | Human Experience Review of success, partial and blocked output; Automated Implementation Testing of the read model | Phase 8: `A807` to `A817` and `A831`. | None |
| A ref clash is named by `project check` and fixed by one command; the old ref still resolves | [v2 architecture design](../../designs/2026-10-29-make-blueprint-v2-architecture.md#human-experience-intent); [W1 R1 plan](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md#human-experience-propagation) | [10 Records and Identity](../../prd/10-records-and-identity.md#a-ref-clash-is-named-and-fixed-by-one-command) | [03 Storage and Identity](03-storage-and-identity.md) | Automated Implementation Testing: two-branch merge test | Phase 3: `A347` to `A352` and `A354`. | None |
| A fit-gap CSV and xlsx open for a client without Make Blueprint | [v2 architecture design](../../designs/2026-10-29-make-blueprint-v2-architecture.md#human-experience-intent); [W1 R1 plan](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md#human-experience-propagation) | [15 Exports](../../prd/15-exports.md#client-promise) | [07 Analysis and Exports](07-analysis-and-exports.md) | Automated Implementation Testing: column parity with the example fit-gap and golden-file tests from synthetic records; Guided Progress Review of the workbook and one capability model document | Phase 7: `A743`, `A745`, `A750`, `A755`, `A759` to `A761` and `A763`. | None |

The release check in [Phase 9](09-v1-import-and-release.md) rolls up the Human Experience Review of all eight promises in `A938`.

## Phase Map

| File | Purpose |
| --- | --- |
| [01 Shared Core Adoption](01-shared-core-adoption.md) | Makes Make Blueprint a user of the published shared core, `@brucewaynedecoy/make-core`, so it never carries its own copy of core behavior. |
| [02 CLI and Packaging](02-cli-and-packaging.md) | Stands up the `make-blueprint` CLI and its stdio MCP server shell, with `setup`, `setup remove`, `update`, `uninstall` and one signed single file that runs with no Python and no Node. |
| [03 Storage and Identity](03-storage-and-identity.md) | Builds the storage layer that every later phase reads and writes through: the file backend, the derived index and its text search, the write lock and journal, the two record IDs and the `project check` engine. |
| [04 Record Types](04-record-types.md) | Gives Make Blueprint its twelve v2.0 record types, so every later stage writes records with fixed fields, checked values, checked people slugs and checked evidence links. |
| [05 Intake and Conversion](05-intake-and-conversion.md) | Lets people bring original files into a project and turn them into converted text with stable anchors, inside the CLI and with no outside program. |
| [06 Extraction and Review](06-extraction-and-review.md) | Gives agents a guided, one-source-at-a-time path from converted text to reviewed records, with every step kept in records and no side files. |
| [07 Analysis and Exports](07-analysis-and-exports.md) | Turns reviewed records into answers a client can act on, through the model, compare, place and hand-off stages and the full export set that a client opens without Make Blueprint. |
| [08 MCP, Skills and Status](08-mcp-skills-and-status.md) | Finishes the agent-facing surface, so every command is reachable through the right MCP profile, every stage has its skill, and one status command orients people and agents. |
| [09 v1 Import and Release](09-v1-import-and-release.md) | Gives BuildOS v1 projects a safe one-time path to Make Blueprint, proves the whole product on the release build on a machine with no Python and no Node, and releases v2.0. |

## Usage Notes

- Read phases in order unless otherwise noted.
- Keep phase files dependency-ordered.
- Every phase file must include `## Source PRD Docs`.
- Link every phase back to the relevant PRD docs.
- Keep each accepted Human Experience promise traceable through its owning phase, evidence decision, implementation gate, and any accepted obligation.
- When this backlog retains evidence for acceptance or review, create or update its central `evidence.md` report and add a relative link to it in this index. Follow the Acceptance-Case Evidence Retention section of the coverage pass contract (`make-docs://system/contract/coverage-pass-contract.md`). The report explains the findings and links supporting evidence, including evidence already stored elsewhere. Do not create an empty report or link to a report that does not exist.
- Keep the obligation and scenario inventory below current when a phase changes an obligation or activates Unassisted Goal Testing.

## Obligations, Scenarios, And Findings Inventory

| Item | Source | Carrying phase | Expected phase status | Expected capability status |
| --- | --- | --- | --- | --- |
| `O-001` Confirm Make Docs links in project check | [Kit register](../../prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check) | [04 Record Types](04-record-types.md) builds the temporary skip and the `make-docs-skipped` report (`A429`). [07 Analysis and Exports](07-analysis-and-exports.md) and [08 MCP, Skills and Status](08-mcp-skills-and-status.md) report the skipped links, and [09 v1 Import and Release](09-v1-import-and-release.md) names the skip in the release notes (`A939`). | Each phase can close with the skip in place. | Partial. `O-001` stays open, also after the v2.0 release, until Make Docs ships its link-check read command. |
| Unassisted Goal Testing scenarios | None | None | `not-needed-now` in every phase | No `NUAT-###` scenario is activated. |
| Findings | None | None | None | None |

## Intended Follow-On

This handoff is advisory-default-but-overridable: it is authoritative unless the user explicitly overrides it, and it is not a gate or precondition.

- Route: `implementation-loop`
- Next step: Start with the first applicable phase in this backlog and continue phase-by-phase.
- Why: The backlog is the implementation queue derived from the plan and PRD contract.
- Coordinate Handoff: Carry this backlog's W/R coordinate into phase history records and commits, adding the active P coordinate for each phase.
