---
title: "Make Blueprint v2 Baseline Plan"
kind: "plan"
status: "draft"
coordinate: "W1 R0"
source:
  type: "design"
  path: "docs/designs/2026-10-29-make-blueprint-v2-architecture.md"
follow_on:
  route: "prd-generation"
  next_prompt: "make-docs://system/prompt/plan-to-prd-green-field.prompt.md"
  why: "The plan becomes the first PRD namespace, which is the product contract for the work backlog."
  coordinate_handoff: "Carry W1 R0 into the downstream PRD and work backlog lineage."
---

# Make Blueprint v2 Baseline Plan

> **Replaced by `W1 R1`.** The [W1 R1 plan](../../../../docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md) replaces this plan. Its PRD step produced the current PRD set, which `W1 R1` updates. No work backlog was made from this plan. Use the `W1 R1` plan and the PRDs; the phase files here stay only as reference input for the first backlog.

## Purpose

This plan turns the [Make Blueprint v2 Architecture](../../../../docs/designs/2026-10-29-make-blueprint-v2-architecture.md) design into a first PRD namespace and an implementation backlog for Step 0 and v2.0. It fixes the PRD tree, the implementation phases, the worker split, the evidence for each human promise, and the validation pass before any PRD or work file is written.

## Objective

- Produce the first active PRD namespace in `docs/prd/`: the five core docs plus 14 adaptive docs (see [Proposed Catalog](#proposed-catalog)).
- Describe the whole v2 product in the PRDs. Capabilities for v2.1, v2.2 and v3 appear as planned scope or current limitations, so later waves maintain the same owners.
- Produce one work backlog at `docs/work/2026-10-29-w1-r0-make-blueprint-v2/` that covers Step 0 and v2.0 in the nine phases in the [Phase Map](#phase-map).
- Keep every accepted human promise in the design traceable to one owning PRD, one work phase and planned evidence.

The plan is done when the PRD set and the work backlog exist, pass validation, and the owner accepts them.

## Coordinate Decision

- Coordinate: `W1 R0`
- Classification: `new-wave`
- Evidence: `docs/plans/` and `docs/work/` hold only router files, and there are no history records. The source design uses the `baseline-plan` route and has no coordinate handoff. The wave model's default for a repository with no prior entries is `w1-r0`.

## Design Inputs

| Input | Format | Location | Confidence |
| ----- | ------ | -------- | ---------- |
| Make Blueprint v2 Architecture | Markdown design | [docs/designs/2026-10-29-make-blueprint-v2-architecture.md](../../../../docs/designs/2026-10-29-make-blueprint-v2-architecture.md) | Authoritative |
| Project background and change ideas | Markdown | [README.md](../../../../../../README.md) | Authoritative for intent; superseded by the design where they differ |
| Make Docs CLI, Store, MCP profiles, managed blocks | TypeScript monorepo and docs | `<user-home>/Developer/Source/Tyler/Projects/make-docs` | Authoritative for current Make Docs behavior |
| BuildOS v1 contracts, toolkits, designs and risk register | Go, Markdown, JSONL | `<user-home>/Developer/Source/Tyler/Projects/build-os` | Reference only (clean room) |
| v1 project shapes for import fixtures | Project folders | client-c-implementation and client-b-v3 client folders | Reference only; client data must not be copied into this repository |
| Example capability-level fit-gap | CSV datasets and data dictionary | `workspace/datasets/` in the fit-gap example project | Reference for the fit-gap and export column sets |
| Claude Code mods documentation | Web docs | https://code.claude.com/docs/en/plugins/mods/overview.md | Exploratory; the API can change between releases |

Open input questions to promote into `docs/prd/03-open-questions-and-risk-register.md` during execution:

- The exact boundary of `packages/core` inside the make-docs monorepo, and who schedules the Make Docs changes that Step 0 needs.
- The single-file packaging method for a Node 24 app that uses `node:sqlite`, and code signing on three operating systems.
- The local index location (the design proposes `~/.make/blueprint/`).
- The front matter schema for each record type, the facet config format and the anchor algorithm.
- How the v1 import treats the old bulk-extract `extractions/` files.

## Human Experience Propagation

Authority: the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md), with the source design's `## Human Experience Intent` as the local outcome authority. Impact is `direct`.

| Promise | Owning or planned PRD | Human-facing surface or indirect effect | Work phase | Evidence source or selected testing type | Accepted obligation, if any |
| --- | --- | --- | --- | --- | --- |
| Install Make Blueprint alone, Make Docs alone, or both; handoff works with no extra setup | `05-ecosystem-and-shared-core.md`, `07-installation-and-distribution.md` | `setup` and `uninstall` output, root router blocks | `01-shared-core.md`, `02-cli-and-packaging.md` | Automated Implementation Testing: install matrix on fresh projects; Human Experience Review of first-run setup | None |
| One signed file works on a machine with no Python | `07-installation-and-distribution.md` | Download, install and every skill | `02-cli-and-packaging.md`, `09-v1-import-and-release.md` | Automated Implementation Testing in a clean container with no Python and no Node | None |
| Evidence links reach the exact place in a source and flag changed sources | `10-records-and-identity.md`, `12-source-intake-and-conversion.md` | Record evidence fields and `check` output | `04-record-types.md`, `05-intake-and-conversion.md` | Automated Implementation Testing: anchor resolution and changed-hash detection | None |
| A record change reads as a git diff of one Markdown file | `09-storage-and-indexing.md` | Record files in `blueprint/records/` | `03-storage-and-identity.md` | Automated Implementation Testing; Human Experience Review of a sample diff | None |
| User text in `AGENTS.md` and `CLAUDE.md` survives setup, update and uninstall of either tool | `06-project-layout-and-instruction-files.md` | Instruction and router files | `01-shared-core.md`, `02-cli-and-packaging.md` | Automated Implementation Testing: round-trip tests with user text above, between and below both blocks | None |
| One status command shows project state and the next useful action | `08-cli-and-mcp.md` | `status` output in the CLI and MCP | `08-mcp-skills-and-status.md` | Human Experience Review of success, partial and blocked output; Automated Implementation Testing of the read model | None |
| A ref clash is named by `check` and fixed by one command; the old ref still resolves | `10-records-and-identity.md` | `check` and ref-fix output | `03-storage-and-identity.md` | Automated Implementation Testing: two-branch merge test | None |
| A fit-gap CSV and xlsx open for a client without Make Blueprint | `15-exports.md` | Files in `blueprint/exports/` | `07-analysis-and-exports.md` | Automated Implementation Testing: column parity with the example fit-gap; Guided Progress Review of the workbook | None |

Guided Progress Review and Unassisted Goal Testing are `not-needed-now` for other promises unless a work phase records a reason to activate them.

## Performance Evidence Plan

Authority: the [Performance Evidence Governance Contract](make-docs://system/contract/performance-evidence-governance.md). This plan copies no target.

| Candidate | Base maintenance action | Performance applicability | Target class | Canonical `PERF-###` or next record | Finite budget and stop reference | Lifecycle point |
| --- | --- | --- | --- | --- | --- | --- |
| Index rebuild and query on a project the size of client-b-v3 | `create` | `characterize-now` | `characterization-baseline` | Next record: one `PERF-###` profile created by work phase `03-storage-and-identity.md` before its first measurement | Set in that profile under the contract's bounded-work rule | After the file backend and index exist in phase 03 |
| Start time of the single-file CLI and MCP server | `create` | `characterize-now` | `characterization-baseline` | Next record: one `PERF-###` profile created by work phase `02-cli-and-packaging.md` before its first measurement | Set in that profile under the contract's bounded-work rule | After the first signed single-file build in phase 02 |

## Existing Codebase Context

- Codebase status: greenfield. This repository holds only `README.md`, Make Docs routers and the source design.
- Integration constraints: Make Blueprint must use the published `packages/core` from the make-docs monorepo. It must coexist with Make Docs in one project. It must ship no Python. v1 code is reference only.
- Discovery pass required: yes.
- Discovery scope: the make-docs `packages/cli/src` modules that move into the core (layout and paths, resources, MCP server and profiles, Store base, harness setup, managed blocks, update and uninstall); v1 entity contracts and JSONL shapes for the import; the example fit-gap columns for exports.

## Output Contract

- Plan directory: `docs/plans/2026-10-29-w1-r0-make-blueprint-v2/`
  - entry point: `docs/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
  - phase files: `docs/plans/2026-10-29-w1-r0-make-blueprint-v2/0N-<phase>.md`
- PRD core:
  - `docs/prd/00-index.md`
  - `docs/prd/01-product-overview.md`
  - `docs/prd/02-architecture-overview.md`
  - `docs/prd/03-open-questions-and-risk-register.md`
  - `docs/prd/04-glossary.md`
  - adaptive docs `05` to `18` (see [Proposed Catalog](#proposed-catalog))
- Implementation work:
  - `docs/work/2026-10-29-w1-r0-make-blueprint-v2/`

## Existing PRD Handling

- Active `docs/prd/` status: no active namespace. The folder holds only `AGENTS.md` and `CLAUDE.md` routers.
- Eligible mode: `first-namespace`
- Archive step required before execution: no
- Planned archive target if approved: not applicable
- Active root entries to archive: none

## Coordinator Policy

- Highest intended delegation tier: parallel subagents, then sequential subagents, then single-agent fallback.
- Coordinator role: `coordination only`
- Coordinator write scope: `none` when delegation is available
- Coordinator responsibilities: preflight, approvals, routing, worker spawning, progress tracking, blocker handling, final status reporting

## Scope & Phasing

- Phasing strategy: `mvp-then-iterate`. This wave covers Step 0 and v2.0. v2.1 (local server and UI), v2.2 (test records and playbooks) and v3 (shared database) are later waves that maintain the same PRD owners.
- Phase boundaries driven by: technical dependency first, then risk reduction. Packaging and storage are proven early because the design names them as the main risks.

## Phase Map

| File | Purpose |
| ---- | ------- |
| [01-shared-core.md](01-shared-core.md) | Step 0: move shared code from Make Docs into `packages/core`, with tag-aware managed blocks and the uninstall fix. |
| [02-cli-and-packaging.md](02-cli-and-packaging.md) | Make Blueprint CLI skeleton, `setup`, routers, resources, MCP server shell and signed single-file builds. |
| [03-storage-and-identity.md](03-storage-and-identity.md) | Storage interface, file backend, `id` and `ref`, `check`, locks, journal, schema versions, index and queries. |
| [04-record-types.md](04-record-types.md) | The 11 v2.0 record types, facets, link rules and Make Docs link checks. |
| [05-intake-and-conversion.md](05-intake-and-conversion.md) | Source records, location types, built-in converters, anchors and change detection. |
| [06-extraction-and-review.md](06-extraction-and-review.md) | Extraction records, `run extract next`, duplicate hints, draft review and journaled approval. |
| [07-analysis-and-exports.md](07-analysis-and-exports.md) | Model clean-up, comparisons, fit-gap, placement, handoff links and exports. |
| [08-mcp-skills-and-status.md](08-mcp-skills-and-status.md) | MCP profiles and tools, the seven stage skills, and the status command. |
| [09-v1-import-and-release.md](09-v1-import-and-release.md) | v1 import, end-to-end checks on a locked-down machine, Human Experience Review and the v2.0 release. |

## Proposed Catalog

The tree stays flat. No subsystem is large enough to need a numbered folder.

| PRD | Type | Owns |
| --- | --- | --- |
| `00-index.md` | Index | Reading order, document map, audience paths |
| `01-product-overview.md` | Overview | Users, Northstar principles, key capabilities, setups A to C, release scope, limitations |
| `02-architecture-overview.md` | Architecture | Topology, module map, runtime boundaries, data flow, configuration surfaces |
| `03-open-questions-and-risk-register.md` | Risk register | Open questions, rebuild risks and drift found during execution |
| `04-glossary.md` | Glossary | Terms such as record, `id`, `ref`, facet, anchor, comparison, verdict, placement |
| `05-ecosystem-and-shared-core.md` | Subsystem | Separate-or-together rule, `packages/core` contents, handoff lines, Make Docs links and backlog ownership |
| `06-project-layout-and-instruction-files.md` | Subsystem | `.make/` and `blueprint/` layout, machine folders, routers, managed blocks, conflicts and uninstall |
| `07-installation-and-distribution.md` | Subsystem | `setup`, harness integration, skills install, `update`, `uninstall`, npm and signed single files |
| `08-cli-and-mcp.md` | Subsystem | Command groups, MCP profiles, `allowWrite`, filter syntax, read-only SQL, status |
| `09-storage-and-indexing.md` | Subsystem | Storage interface, file backend, index, locks, journal, schema versions, setups A to C |
| `10-records-and-identity.md` | Subsystem | Common fields, statuses, `id` and `ref`, aliases, facets, evidence links, `check` |
| `11-record-types-reference.md` | Reference | Fields and links for each record type, including later types |
| `12-source-intake-and-conversion.md` | Subsystem | Source records, location types, Git LFS, converters, anchors |
| `13-extraction-and-review.md` | Subsystem | Extraction unit, coverage, duplicates, drafts, review and second reviewer |
| `14-fit-gap-and-placement.md` | Subsystem | Model stage, comparisons, fit-gap verdicts, `target-only`, placement and delivery |
| `15-exports.md` | Subsystem | Export set, columns, xlsx workbook, regeneration rules |
| `16-workflow-and-skills.md` | Subsystem | Seven stages, one skill per stage, skill rules |
| `17-v1-import.md` | Subsystem | v1 import mapping, IDs to refs, fixtures |
| `18-local-server-and-ui.md` | Subsystem | v2.1 server, Svelte web app, MCP App views, view models, mods position |

## Worker Ownership

| Worker | Scope | Write Scope | Dependencies | Deliverables |
| ------ | ----- | ----------- | ------------ | ------------ |
| Discovery | Read make-docs core candidates, v1 contracts and the fit-gap example | None (findings returned to the coordinator) | None | Discovery notes for the other workers |
| Overview | Product and architecture overview | `docs/prd/01-product-overview.md`, `docs/prd/02-architecture-overview.md` | Discovery | 01, 02 |
| Ecosystem | Ecosystem, layout and installation | `docs/prd/05-*.md`, `docs/prd/06-*.md`, `docs/prd/07-*.md` | Overview | 05, 06, 07 |
| Surfaces | CLI and MCP | `docs/prd/08-*.md` | Overview | 08 |
| Data | Storage, records and types | `docs/prd/09-*.md`, `docs/prd/10-*.md`, `docs/prd/11-*.md` | Overview | 09, 10, 11 |
| Workflow | Intake, extraction and skills | `docs/prd/12-*.md`, `docs/prd/13-*.md`, `docs/prd/16-*.md` | Data | 12, 13, 16 |
| Analysis | Fit-gap, placement and exports | `docs/prd/14-*.md`, `docs/prd/15-*.md` | Data | 14, 15 |
| Migration and UI | v1 import and the later UI | `docs/prd/17-*.md`, `docs/prd/18-*.md` | Data | 17, 18 |
| Assembly | Shared docs and, in the next step, the backlog | `docs/prd/00-index.md`, `docs/prd/03-open-questions-and-risk-register.md`, `docs/prd/04-glossary.md`, `docs/work/2026-10-29-w1-r0-make-blueprint-v2/` | All PRD workers | 00, 03, 04, work backlog |
| Validation | Contract, link and authority checks, then fixes | Fix-only edits to files flagged by validation | Assembly | Validation report |

Merge order: Discovery, then Overview, then the PRD workers in parallel (Workflow, Analysis and Migration and UI start after Data publishes its record vocabulary), then Assembly, then Validation.

## MCP Strategy

- Preferred servers available: the Make Docs MCP server (`resource_read`, `prd_validate`, `paths_validate`) for system resources and checks; jCodeMunch and jDocMunch for reading the reference repositories.
- Fallback plan if unavailable: the `make-docs` CLI (`make-docs resource read`, `make-docs run prd authority validate`) and plain file reads.

## Acceptance Criteria Guidance

- Criteria style: checklist of observable results. "Easy to use" or "intuitive" is not a criterion.
- Non-functional requirements to address in every feature PRD: works offline, no Python, safe writes and recovery, Windows, macOS and Linux paths, human and machine output from the same meaning, no telemetry.

## Dependencies

- Step 0 changes the make-docs repository. The Make Docs owner must schedule and release `packages/core` before phase 02 can depend on it. Phase 02 can start against a local link to the core while the release is pending.
- Code signing needs certificates for macOS and Windows.
- Import fixtures must be synthetic or scrubbed copies shaped like the client projects. No client data enters this repository.

## Validation

- Every design decision is accounted for in at least one PRD, and every adaptive PRD traces back to the design.
- Every promise in [Human Experience Propagation](#human-experience-propagation) has one owning PRD, one work phase and planned evidence.
- `make-docs run prd authority validate` passes on the new namespace.
- All internal links resolve, and no real machine paths appear outside allowed placeholders.
- The work backlog covers every PRD with no orphaned items, and every phase records its four testing-type decisions.
- Open questions are captured in the risk register, and none blocks backlog generation without explicit acknowledgment.
- The owner reviews the PRD set and the backlog and accepts them.

## Intended Follow-On

This handoff is advisory-default-but-overridable: it is authoritative unless the user explicitly overrides it, and it is not a gate or precondition.

- Route: `prd-generation`
- Next step: Generate the first PRD set from this plan. Read `make-docs://system/prompt/plan-to-prd-green-field.prompt.md` with `make-docs resource read`.
- Why: The plan should become the product contract before work backlog generation.
- Coordinate Handoff: Carry `W1 R0` into the downstream PRD and work backlog lineage.
