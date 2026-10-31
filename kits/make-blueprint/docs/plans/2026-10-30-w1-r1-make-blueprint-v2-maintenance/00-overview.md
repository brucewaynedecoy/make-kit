---
title: "Make Blueprint v2 Owner Decision Maintenance Plan"
kind: "plan"
status: "draft"
coordinate: "W1 R1"
source:
  type: "design"
  path: "docs/designs/2026-10-29-make-blueprint-v2-architecture.md"
follow_on:
  route: "prd-generation"
  next_prompt: "make-docs://system/prompt/plan-to-prd-change.prompt.md"
  why: "The PRDs must carry the owner's decisions before the first work backlog reads them."
  coordinate_handoff: "Carry W1 R1 into the PRD source links and the first work backlog."
---

# Make Blueprint v2 Owner Decision Maintenance Plan

## Purpose

This plan carries the owner's open-question decisions of 2026-10-30 into the active Make Blueprint PRD set. The decisions are recorded in [03 Open Questions and Risk Register](../../prd/03-open-questions-and-risk-register.md) and summarized in section 16 of the [Make Blueprint v2 Architecture](../../designs/2026-10-29-make-blueprint-v2-architecture.md) design. The plan revises the [W1 R0 baseline plan](../../../.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md): it fixes which PRD sections change, how the work splits across workers, and what the first work backlog covers.

## Objective

- Every closed register item has one maintenance decision (`update-existing`, `create`, `link-only` or `none`) with an owner and a reason.
- Every owning PRD states the decided behavior inline, with no remaining "open question" pointers for closed items.
- Every PRD's front matter `source.path` names this plan, and no PRD gains a `## Requirement History` section.
- Every example `id` uses the 8-character random part from Q-018.
- `make-docs run prd authority validate --target-root kits/make-blueprint` and the performance evidence validator exit zero, and no link is broken, including `../` links into the root docs.
- The first Make Blueprint work backlog is generated from the updated PRDs.

Done means all six are true and the register shows every W1 R1 follow-up as carried out.

## Governing Invariant

> `docs/prd/` describes the current authoritative shape of the product. It must never describe the editorial operation used to change that authority.

Change language such as "revise", "add" or "replace" stays in this plan, the work backlog and history records. The PRDs state the current product.

## Coordinate Decision

- Coordinate: `W1 R1`
- Classification: `revision`
- Evidence: The source design's `## Intended Follow-On` names the `change-plan` route and a coordinate handoff that revises `W1 R0` and recommends `W1 R1`. `docs/plans/` holds only the `W1 R0` plan. `docs/work/` holds only router files, so no backlog exists for any coordinate. No history records exist. The owner's decisions revise and finish the `W1 R0` authority, so the wave stays 1 and the revision moves to 1.

## Maintenance Inputs

| Input | Format | Location | Confidence |
| --- | --- | --- | --- |
| Owner decisions, resolutions and addenda | Markdown register | [03 Open Questions and Risk Register](../../prd/03-open-questions-and-risk-register.md) | Authoritative |
| Decision summary | Markdown design, section 16 | [Make Blueprint v2 Architecture](../../designs/2026-10-29-make-blueprint-v2-architecture.md) | Authoritative; the register wins on detail |
| Repo-wide decisions: shared core, `.make/config.yaml`, `.make/personas.yaml`, Step 0 | Markdown design | [Make Kit Monorepo](../../../../../docs/designs/2026-10-30-make-kit-monorepo.md) | Authoritative for cross-kit rules |
| Baseline plan and phase map | Markdown plan | [W1 R0 plan](../../../.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md) | Authoritative for sequencing, revised here |
| Active PRD set | Markdown PRDs | `docs/prd/00-index.md` to `docs/prd/18-local-server-and-ui.md` | Authoritative current product |
| v1 fit-gap example the owner shared | CSV, xlsx and Markdown files kept outside this repository | Owner's local example folder | Reference for export shape only; client data must not enter this repository |

No open input questions remain. Ten items stay `Deferred` in the register (Q-050 to Q-056, Q-059, Q-074 and Q-075), and this plan checks only that the PRDs describe them as later scope.

## Human Experience Propagation

Authority: the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md), with the source design's `## Human Experience Intent` as the local outcome authority. Impact stays `direct`. The owner's decisions keep all eight promises and strengthen three of them; no promise is dropped. Work phases name the first work backlog's phases (see [07 Work Backlog Scope](07-work-backlog-scope.md)).

| Promise | Owning PRD | Human-facing surface or indirect effect | Work phase | Evidence source or selected testing type | Accepted obligation, if any |
| --- | --- | --- | --- | --- | --- |
| Install Make Blueprint alone, Make Docs alone, or both; handoff works with no extra setup | `05-ecosystem-and-shared-core.md`, `07-installation-and-distribution.md` | `setup`, `setup remove` and `uninstall` output, root router blocks, shared `.make/config.yaml` choices | `01-shared-core-adoption`, `02-cli-and-packaging` | Automated Implementation Testing: install matrix on fresh projects, including a kit set up after another reading the shared choices; Human Experience Review of first-run setup | None |
| One signed file works on a machine with no Python | `07-installation-and-distribution.md` | Download, install and every skill | `02-cli-and-packaging`, `09-v1-import-and-release` | Automated Implementation Testing in a clean container with no Python and no Node, on each Q-006 target | None |
| Evidence links reach the exact place in a source and flag changed sources | `10-records-and-identity.md`, `12-source-intake-and-conversion.md` | Evidence fields, `project check` output, Markdown anchors and CSV table, row, column and cell links | `04-record-types`, `05-intake-and-conversion` | Automated Implementation Testing: anchor and CSV position resolution, changed-hash detection, and the missing state for files kept out of git | None |
| A record change reads as a git diff of one Markdown file | `09-storage-and-indexing.md`, `10-records-and-identity.md` | Record files in `blueprint/records/`; a fixed fact keeps its `id`, `ref` and links | `03-storage-and-identity`, `06-extraction-and-review` | Automated Implementation Testing: an approved pending change writes one file with the same `id`; Human Experience Review of a sample diff | None |
| User text in `AGENTS.md` and `CLAUDE.md` survives setup, update and uninstall of either tool | `06-project-layout-and-instruction-files.md` | Instruction files for the selected agent tools only | `01-shared-core-adoption`, `02-cli-and-packaging` | Automated Implementation Testing: round-trip tests with user text above, between and below both blocks | None |
| One status command shows project state and the next useful action | `08-cli-and-mcp.md` | `project status` output in the CLI and MCP, with the project `name` | `08-mcp-skills-and-status` | Human Experience Review of success, partial and blocked output; Automated Implementation Testing of the read model | None |
| A ref clash is named by `project check` and fixed by one command; the old ref still resolves | `10-records-and-identity.md` | `project check` and `run record ref-fix` output | `03-storage-and-identity` | Automated Implementation Testing: two-branch merge test | None |
| A fit-gap CSV and xlsx open for a client without Make Blueprint | `15-exports.md` | The full export set in `blueprint/exports/`, now with the capability model documents, data dictionaries, requirement marks, placements and integrations | `07-analysis-and-exports` | Automated Implementation Testing: column parity with the example fit-gap and golden-file tests from synthetic records; Guided Progress Review of the workbook and one capability model document | None |

Guided Progress Review and Unassisted Goal Testing stay `not-needed-now` for other outcomes unless a work phase records a reason to activate them.

## Performance Evidence Plan

Authority: the [Performance Evidence Governance Contract](make-docs://system/contract/performance-evidence-governance.md). This plan copies no target.

| Candidate | Base maintenance action | Performance applicability | Target class | Canonical `PERF-###` or next record | Finite budget and stop reference | Lifecycle point |
| --- | --- | --- | --- | --- | --- | --- |
| Index rebuild and query on a project the size of client-b-v3, now including the text search behind candidate matches and similar-capability checks (Q-067) | `update-existing` | `characterize-now` | `characterization-baseline` | Next record: one `PERF-###` profile created by work phase `03-storage-and-identity` before its first measurement | Set in that profile under the contract's bounded-work rule | After the file backend, index and text search exist |
| Start time of the single-file CLI and MCP server | `none` | `characterize-now` | `characterization-baseline` | Next record: one `PERF-###` profile created by work phase `02-cli-and-packaging` before its first measurement | Set in that profile under the contract's bounded-work rule | After the first signed single-file build |
| Export build and `project check` for a comparison the size of the v1 fit-gap example (about 150 fit-gap records and 1,100 baseline requirement marks) | `create` | `not-needed` | None | None | Not applicable | None. Reason: no current decision depends on export or check timing, and the index profile covers the reads they use. Revisit if a client project shows slow exports. |

## Active Authority Baseline

- Active `docs/prd/` status: one active namespace, `00-index.md` to `18-local-server-and-ui.md`, which passes `make-docs run prd authority validate`.
- Current index: [00-index.md](../../prd/00-index.md)
- Discovery pass required: no. Three read-only checks on 2026-10-30 mapped every decision to its owning sections; their results are the matrix below and the phase files.
- Known noncompliance or legacy editorial PRDs: none.

## Coordinator Policy

- Highest intended delegation tier: parallel subagents, then sequential subagents, then single-agent fallback.
- Coordinator role: `coordination only`.
- Coordinator write scope: `none` when delegation is available.
- Coordinator responsibilities: preflight, routing, worker spawning, progress tracking, blocker handling and final status.

## Candidate Decision Matrix

Each register item gets one decision. The phase files hold the section-level rows.

| Candidate | Decision | Owning PRDs | Reason |
| --- | --- | --- | --- |
| D-001 to D-010 | `none` | — | Fixed during `W1 R0` validation. |
| D-011 project `name` | `update-existing` | 02, 05, 06, 08, 15, 17 | The setting moves to the shared `.make/config.yaml`. |
| Q-001 core boundary | `update-existing` | 01, 02, 04, 05 | The core lives in the make-kit monorepo. |
| Q-002 handoff refresh | `update-existing` | 05 | 05 still states it as open. |
| Q-003 two uninstalls | `update-existing` | 05, 16 | Wording still mixes project and tool uninstall. |
| Q-004 edited block | `none` | — | Already stated. |
| Q-005 broken tags | `update-existing` | 06, 07 | Must cover both tools' tags. |
| Q-006 single-file targets | `update-existing` | 07 | The targets are fixed. |
| Q-007, Q-008 commands | `update-existing` | 02 | Diagrams say a bare "check". |
| Q-009 `update` | `update-existing` | 02, 04, 05, 06, 07, 08, 09, 10, 16 | `update` updates only the tool; `setup` updates the project. |
| Q-010 exit codes | `none` | — | Already stated. |
| Q-011 source folders | `none` | — | Paths come after work phase 02. |
| Q-012 names | `update-existing` | 02, 04, 06, 07 | Config, conflict and package names are fixed. |
| Q-013 core pin | `none` | — | The pin is unchanged; its location changes under Q-001. |
| Q-014 to Q-017 | `none` | — | Already stated. |
| Q-018 `id` length | `update-existing` | 10, plus examples in 01, 02, 04, 08, 09, 11, 12, 14, 15, 17 | 8 characters, and every example follows. |
| Q-019 ref clashes | `update-existing` | 04, 08, 10, 17 | The record created first keeps the `ref`. |
| Q-020 safe writes | `update-existing` | 09, 13, 14, 18 | Batches, `busy` results and version checks. |
| Q-021 no delete | `update-existing` | 10 | 10 must state it. |
| Q-022 schema authority | `update-existing` | 10 | 10 owns the facet format. |
| Q-023 doc links | `update-existing` | 05, 10, 11 | `docs` and `work_items` become common fields. |
| Q-024 Make Docs link check | `update-existing` | 01, 04, 05, 08, 10, 14, 16, 17 | Skip with a count until the read command ships (O-001). |
| Q-025 hand-off | `none` | — | Already stated. |
| Q-026 anchor marker | `update-existing` | 04, 12 | Still stated as open. |
| Q-027 anchor numbering | `none` | — | Already stated. |
| Q-028 source git levels | `update-existing` | 01, 02, 04, 06, 08, 10, 11, 12, 17, 18 | Replaces the `repo` and `local` location types. |
| Q-029 Git LFS | `update-existing` | 01, 02, 04, 12 | Default at 50 MB instead of opt-in. |
| Q-030, Q-031 | `none` | — | Already stated. |
| Q-032 pending changes | `update-existing` | 01, 02, 08, 10, 13, 16 | Facts are fixed in place, not by supersede. |
| Q-033 duplicate hints | `update-existing` | 13 | Also on `run record create`. |
| Q-034 analysis drafts | `update-existing` | 08, 13 | Review grouping must fit analysis drafts. |
| Q-035 comparison scope | `update-existing` | 14 | "Fully scored" is defined. |
| Q-036, Q-037 | `none` | — | Already stated. |
| Q-038 CSV rules | `update-existing` | 12, 15 | Converted CSV files share the rules and writer. |
| Q-039 formula-like text | `update-existing` | 15 | Still stated as open. |
| Q-040 exports in git | `update-existing` | 06 | 06 must state it. |
| Q-041 MCP profiles | `update-existing` | 08, 13, 16 | Review tools also in `analyze`. |
| Q-042 skills | `update-existing` | 01, 02, 07, 15, 16 | Adds `blueprint-report`. |
| Q-043 bulk-extract files | `update-existing` | 17 | Staged updates become pending changes. |
| Q-044 v1 converted text | `update-existing` | 12, 17 | Same folder; kept text takes `converter: v1`. |
| Q-045, Q-046 | `none` | — | Already stated. |
| Q-047 import MCP tool | `update-existing` | 17 | Still worded as a choice. |
| Q-048 persona records | `update-existing` | 01, 04, 11, 13, 17 | Linked to Personas through slugs (with Q-072). |
| Q-049 `serve` | `update-existing` | 04, 05, 08, 18 | Still stated as open. |
| Q-050, Q-052, Q-053, Q-054, Q-056, Q-059 | `none` | — | Deferred; the text already matches. |
| Q-051 first v2.1 views | `update-existing` | 18 | Deferral wording and the updated view list. |
| Q-055 v2.2 types in the import | `update-existing` | 17 | Deferral wording. |
| Q-057 `integrate` placements | `update-existing` | 11, 14, 16 | `integrations` field; no `partner_systems`. |
| Q-058 placement export | `update-existing` | 01, 02, 08, 15 | Now in v2.0. |
| Q-060 shared setup choices | `update-existing` | 02, 05, 06, 07, 08 | `.make/config.yaml`. |
| Q-061 CSV tables | `update-existing` | 02, 04, 08, 10, 11, 12, 13, 17 | Table anchors and CSV position links. |
| Q-062 export set | `update-existing` | 01, 02, 04, 08, 15 | Capability model documents and data dictionaries. |
| Q-063 repeatable exports | `update-existing` | 15, 16 | Exports built from records only. |
| Q-064 detail fields | `update-existing` | 11, 15 | New optional fields and columns. |
| Q-065 fit-gap method | `update-existing` | 08, 13, 14, 16 | The CLI-controlled method. |
| Q-066 marks and verdicts | `update-existing` | 09, 10, 11, 14 | `requirement_marks` and the verdict table. |
| Q-067 candidates | `update-existing` | 09, 14, 16 | Index text search. |
| Q-068 out-of-date marks | `update-existing` | 08, 09, 10, 11, 14 | Requirement versions on marks. |
| Q-069 mark exports | `update-existing` | 01, 02, 08, 15 | Requirement-level export, gap list and counts. |
| Q-070 people and role fields | `update-existing` | 04, 05, 10, 11, 15, 17 | `owners`, `stakeholders`, `audience`. |
| Q-071 Client C and the import | `none` | — | The import is already in v2.0. |
| Q-072 shared people and roles file | `update-existing` | 01, 02, 04, 05, 06, 08, 09, 10, 11, 13, 17 | `.make/personas.yaml`. |
| Q-073 integration records | `create` and `update-existing` | New 19; 01, 02, 04, 08, 11, 13, 14, 15, 16 | A new record type and capability. |
| Q-074, Q-075 | `none` | — | Deferred; nothing contradicts them. |
| Q-080 complex PDFs | `update-existing` | 01, 02, 05, 07, 08, 11, 12, 13, 16, 17 | A guided agent route for complex PDFs, added to v2.0 on 2026-10-30, with a ninth skill, `blueprint-convert`. |
| Q-076 mark versions | `update-existing` | 08, 09, 10, 11, 14 | Marks keep a content version. |
| Q-077 people file rules | `update-existing` | 05, 10, 11, 13, 17 | Eight rules for entries in `.make/personas.yaml`. |
| Q-078 built-in lists | `update-existing` | 06, 11 | Built-in codes and three `lists.*` settings. |
| Q-079 integration rules | `update-existing` | 10, 11, 14, 19 | The fit-gap record is reached through the placement; every capability a mark names is in `covering_capabilities`. |
| R-024 hand-copied files | `update-existing` | 12 | Originals are ignored by pattern at the levels `converted` and `none`. |
| Q-081 second reviewer | `update-existing` | 13 | The rule does not apply to agent conversions. |
| Q-082 unregistered files | `update-existing` | 10, 12 | The Information code `source-unregistered`. |
| Q-083 git level changes | `update-existing` | 08, 12 | `run source add --git-level` and `run source set-level`. |
| Q-084 small defaults | `update-existing` | 05, 08, 10, 12, 13, 14, 15, 16 | Eight command and status defaults. |
| D-012 backlog fixes | `update-existing` | 06, 07, 08, 09, 10, 12, 13 | Seven fixes found while writing the work backlog. |

Items Q-076 to Q-079, Q-081 to Q-084, D-012 and R-024 were raised during execution. The owner decided them on 2026-10-30.

## Existing PRDs To Update

All 19 existing PRDs change. Each change is surgical: current normative text is updated inline, and unrelated text, anchors and links stay. The phase files list every section.

| Existing PRD | Phase | Main changes |
| --- | --- | --- |
| `00-index.md` | 6 | PRD 19 row; focus text |
| `01-product-overview.md` | 1 | Core location, git levels, skills, record types, export set, personas |
| `02-architecture-overview.md` | 1 | Core source, shared config files, data flow, exports |
| `03-open-questions-and-risk-register.md` | 6 | Follow-ups marked done; risks checked |
| `04-glossary.md` | 6 | Updated and new terms |
| `05-ecosystem-and-shared-core.md` | 1 | Core in make-kit, handoff refresh, shared files, link check |
| `06-project-layout-and-instruction-files.md` | 1 | Shared files, config name, sources rule files, exports in git |
| `07-installation-and-distribution.md` | 1 | `update` versus `setup`, targets, package names, nine skills |
| `08-cli-and-mcp.md` | 1 | `update`, pending changes, profiles, `serve`, exports, compare |
| `09-storage-and-indexing.md` | 2 | Batches, record version, text search, written-file exceptions |
| `10-records-and-identity.md` | 2 | `id` length, ref keeper, common fields, statuses, checks |
| `11-record-types-reference.md` | 2 | New fields, marks, persona slug, `integration` type |
| `12-source-intake-and-conversion.md` | 3 | Anchor marker, git levels, Git LFS default, CSV tables, the agent route for complex PDFs, pattern ignore rules |
| `13-extraction-and-review.md` | 3 | Pending changes, batches, hints, integration drafts |
| `14-fit-gap-and-placement.md` | 4 | Fit-gap method, marks, candidates, placement `integrations` |
| `15-exports.md` | 4 | Full export set, columns, repeatable builds |
| `16-workflow-and-skills.md` | 5 | `blueprint-report`, `blueprint-convert`, compare method, skill refresh |
| `17-v1-import.md` | 5 | Pending changes, shared files, converted text, owners |
| `18-local-server-and-ui.md` | 5 | Shared lock, `serve`, deferred views |

## Genuinely New Product PRDs

| New PRD | Product-oriented kind | Coherent subject | Why no existing owner is suitable |
| --- | --- | --- | --- |
| `docs/prd/19-system-integrations.md` | `subsystem` | Recording integrations between systems and using them in comparisons, placements and the Make Docs hand-off | Integrations cut across extraction, comparison, placement and exports, and the owner expects mapping files and diagrams to grow the area. Putting them in 14 would mix a second record family into the fit-gap PRD. See [Phase 4](04-analysis-exports-and-integrations.md). |

## Requirement History Entries

None. Requirement history keeps earlier rules that someone may have relied on. No code, backlog or other plan has used the `W1 R0` PRDs, so their earlier wording is not a contract anyone depends on. The register and section 16 of the design keep the full decision trail. Each changed PRD instead points its front matter `source.path` at this plan.

## Judgment Calls in This Plan

The owner's decisions left these details open. The plan settles them as follows:

- **Status filter (Q-063).** "From active records alone" means from the records that pass the status filter, which is `active` by default. The filter and its draft option stay, as the Q-037 `about` sheet already names it.
- **Common link fields (Q-023, Q-073).** `docs` and `work_items` both become common fields, because Q-073 gives integration records doc and work item links through the common fields.
- **Record version and content version (Q-020, Q-068, Q-076).** The record version ignores line endings and guards writes. The owner's Q-076 decision gives marks a separate content version, which covers only the fields that carry a requirement's meaning.
- **Large approvals (Q-020).** Each batch is one journaled change; an interrupted large approval reports `partial` and can be run again.
- **Required fit-gap fields (Q-065).** `gap_detail` is required for `partial`, `unreleased` and `gap`, and is refused when missing.
- **Kept v1 text (Q-044, Q-061).** It takes `converter: v1`; spreadsheet sheets become table CSV files, and v1 row anchors map to table row positions.
- **v1 sources (Q-028).** They import at the git level that matches where their originals were.

## Affected Links, Risks, Plans, And Work

| Surface | Artifact | Required maintenance | Authority role |
| --- | --- | --- | --- |
| Links and index | `docs/prd/00-index.md`; every PRD's related links | Add PRD 19; link 11, 13, 14 and 15 to it | Navigation only |
| Risks and decisions | `docs/prd/03-open-questions-and-risk-register.md` | Follow-ups marked done; rebuild risks checked; deferred items and O-001 unchanged | Living risk and decision register |
| Plans | [W1 R0 plan](../../../.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md) | A note at the top of its overview and phase files says this plan replaces it, no backlog was made from it, and readers use this plan and the PRDs. Its phase files stay as reference input for the backlog only. Archive it after the first backlog exists, with the owner's approval | Sequencing and rationale, replaced |
| Plans | Repo-wide plan (not yet written) | Owns Step 0, the shared core, `.make/config.yaml`, `.make/personas.yaml` and the Make Docs Persona move | Sequencing and rationale |
| Work | `docs/work/<generation-date>-w1-r1-make-blueprint-v2/` | The first, full backlog, as [Phase 7](07-work-backlog-scope.md) describes | Implementation queue |
| Design | [Make Blueprint v2 Architecture](../../designs/2026-10-29-make-blueprint-v2-architecture.md) | No edit; section 16 already records every decision | Decision record |
| History | None yet | A history record after execution, if the owner asks for one | Execution provenance |

## Output Contract

- Plan directory: `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/`
  - entry point: `00-overview.md`
  - phase files: `01-product-and-platform.md` to `07-work-backlog-scope.md`
- Existing authoritative PRDs to update: all of `docs/prd/00-index.md` to `18-local-server-and-ui.md`.
- Genuinely new authoritative PRD: `docs/prd/19-system-integrations.md`.
- Requirement-history entries: none.
- Shared PRD surfaces: `00-index.md`, `03-open-questions-and-risk-register.md`, `04-glossary.md`.
- Backlog: a full backlog, not a delta, at `docs/work/<generation-date>-w1-r1-make-blueprint-v2/`.

## Phase Map

| File | Purpose |
| --- | --- |
| [01-product-and-platform.md](01-product-and-platform.md) | Product overview, architecture, shared core, layout, installation and the command surface (PRDs 01, 02, 05 to 08). |
| [02-records-and-storage.md](02-records-and-storage.md) | Storage, identity, statuses, checks and record fields (PRDs 09 to 11); publishes field names first. |
| [03-intake-and-extraction.md](03-intake-and-extraction.md) | Intake, conversion, anchors, extraction and review (PRDs 12, 13). |
| [04-analysis-exports-and-integrations.md](04-analysis-exports-and-integrations.md) | Fit-gap method, placement, exports and the new PRD 19 (PRDs 14, 15, 19). |
| [05-skills-import-and-server.md](05-skills-import-and-server.md) | Skills, the v1 import and the later server and UI (PRDs 16 to 18). |
| [06-shared-surfaces-and-validation.md](06-shared-surfaces-and-validation.md) | Index, register and glossary, then the validation pass. |
| [07-work-backlog-scope.md](07-work-backlog-scope.md) | Scope and phase map of the first, full work backlog. |

## Dependencies

- The PRD changes need nothing outside this kit. The repo-wide design already records the shared core and the shared files.
- The work backlog depends on the repo-wide plan for Step 0, the shared core, `.make/config.yaml`, `.make/personas.yaml` and the Make Docs Persona move. That plan is not written yet, so backlog phase `01-shared-core-adoption` waits on it.
- Obligation O-001 stays open until Make Docs ships its link-check read command.

## Worker Ownership

| Worker | Scope | Write Scope | Dependencies | Deliverables |
| --- | --- | --- | --- | --- |
| Product and platform | [Phase 1](01-product-and-platform.md) | `docs/prd/01-*.md`, `02-*.md`, `05-*.md`, `06-*.md`, `07-*.md`, `08-*.md` | None | Updated 01, 02, 05, 06, 07, 08 |
| Records and storage | [Phase 2](02-records-and-storage.md) | `docs/prd/09-*.md`, `10-*.md`, `11-*.md` | None | Updated 09, 10, 11 |
| Intake and extraction | [Phase 3](03-intake-and-extraction.md) | `docs/prd/12-*.md`, `13-*.md` | None | Updated 12, 13 |
| Analysis, exports and integrations | [Phase 4](04-analysis-exports-and-integrations.md) | `docs/prd/14-*.md`, `15-*.md`, and the new `docs/prd/19-system-integrations.md` | None | Updated 14, 15 and new 19 |
| Skills, import and server | [Phase 5](05-skills-import-and-server.md) | `docs/prd/16-*.md`, `17-*.md`, `18-*.md` | None | Updated 16, 17, 18 |
| Assembly and validation | [Phase 6](06-shared-surfaces-and-validation.md) | `docs/prd/00-index.md`, `03-open-questions-and-risk-register.md`, `04-glossary.md`, then fix-only edits to files that validation flags | All PRD workers | Updated 00, 03, 04 and a validation report |
| Backlog | [Phase 7](07-work-backlog-scope.md) | `docs/work/<generation-date>-w1-r1-make-blueprint-v2/` | Assembly and validation passes; runs as the follow-on step, not in PRD execution | The first work backlog |

Merge order: the five PRD workers run in parallel, using the field and setting names fixed in [Phase 2](02-records-and-storage.md#field-and-setting-names). Then Assembly and validation. Each PRD worker also replaces the short example `id` values in its own files.

## MCP Strategy

- Preferred servers: the Make Docs MCP server (`resource_read`, `prd_validate`, `performance_validate`, `paths_validate`). Pass `targetRoot: kits/make-blueprint` on every call, as the root router's temporary workaround O-003 requires.
- Fallback: the `make-docs` CLI, run from `kits/make-blueprint` or with `--target-root kits/make-blueprint` (workaround O-002), and plain file reads.
- Links that leave the kit with `../` are not checked by Make Docs (workaround O-004). The validation worker checks them with a script.

## Validation

- Every candidate in the matrix has one decision, an owner and a reason, and every `update-existing` row is done.
- Each owning PRD states the decided behavior inline. No PRD still calls a closed item an open question.
- No PRD gains a `## Requirement History` section, and every PRD's front matter `source.path` names this plan.
- No example `id` in `docs/prd/` has a random part shorter than 8 characters.
- `docs/prd/00-index.md` lists PRD 19 with a product-oriented kind, and no PRD is renumbered.
- `make-docs run prd authority validate --target-root kits/make-blueprint` and `make-docs run performance evidence validate --target-root kits/make-blueprint` exit zero.
- All links resolve, including `../` links into the root docs, and no real machine paths appear.
- Each Human Experience promise above still has one owning PRD, one work phase and planned evidence.
- In the register, each item whose follow-up says "The W1 R1 change plan updates the owning PRDs to match" now says the update is done in `W1 R1`.
- The owner reviews the changed PRDs and accepts them.

## Intended Follow-On

This handoff is advisory-default-but-overridable: it is authoritative unless the user explicitly overrides it, and it is not a gate or precondition.

- Route: `prd-generation`
- Next step: Update the PRD set from this plan. Read `make-docs://system/prompt/plan-to-prd-change.prompt.md` with `make-docs resource read`. After the PRDs pass validation, generate the first work backlog as [Phase 7](07-work-backlog-scope.md) describes.
- Why: The PRDs must carry the owner's decisions before the first work backlog reads them.
- Coordinate Handoff: Carry `W1 R1` into the PRD source links and the first work backlog, `docs/work/<generation-date>-w1-r1-make-blueprint-v2/`.
