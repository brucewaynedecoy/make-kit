---
title: "Make Blueprint Shared Rule Links Maintenance Plan"
kind: "plan"
status: "draft"
coordinate: "W1 R2"
source:
  type: "plan"
  path: "../../docs/plans/2026-11-01-w1-r0-make-kit-monorepo/05-make-blueprint-links.md"
follow_on:
  route: "prd-generation"
  next_prompt: "make-docs://system/prompt/plan-to-prd-change.prompt.md"
  why: "Each shared rule must have one owner before work phase 01 of the W1 R1 backlog starts."
  coordinate_handoff: "Carry W1 R2 into the Requirement History entries and the Source Anchors of the changed PRDs. The W1 R1 backlog keeps its directory and takes in-place edits."
---

# Make Blueprint Shared Rule Links Maintenance Plan

**Date:** 2026-11-01

**Repository:** `kits/make-blueprint` in the make-kit monorepo

## Purpose

The root project now has its own PRD set, and that set owns the rules that every kit shares. Root decision [Q-006 Root PRD Set](../../../../../docs/prd/03-open-questions-and-risk-register.md#q-006-root-prd-set) says that a small Make Blueprint change plan turns the shared parts of Make Blueprint PRDs 05 to 09 into links to the root PRDs, so each rule has one owner. This is that plan. Its scope comes from root plan phase [05 Make Blueprint Links](../../../../../docs/plans/2026-11-01-w1-r0-make-kit-monorepo/05-make-blueprint-links.md). It also carries the Make Blueprint wording that root decisions Q-007, Q-020 and Q-023 change.

While it checked each scope row against the current text, this plan found Make Blueprint passages that disagree with a root rule. A link alone cannot fix them. The plan aligns the clear ones and asks the owner seven questions about the rest (see [Owner Questions](#owner-questions)).

## Objective

- Every candidate row has one decision (`update-existing`, `link-only`, `create` or `none`), an owner and a reason. The phase files hold 93 rows.
- Each shared rule has one owner. Where Make Blueprint restates a root rule, its text points to the root section and keeps only what Make Blueprint itself needs: its commands, record types, settings and its use of `owners`, `stakeholders` and `audience`.
- In the kit register, R-001 and R-002 keep their numbers and point to the root items. The O-001 trigger is Make Docs 2.1.0. Q-072 follows root Q-023: `label` in place of `name`, and four entry kinds.
- The W1 R1 backlog says that the Make Docs handoff line comes from a later Make Docs release, not from Step 0. The too-old path stays.
- The owner answers OQ-1, OQ-2 and OQ-3 before the rows that they gate run.
- Every check in [Validation](#validation) passes.

Done means all six are true and the owner accepts the changed PRDs.

## Governing Invariant

> `docs/prd/` describes the current authoritative shape of the product. It must never describe the editorial operation used to change that authority.

Words such as "move", "replace" and "align" stay in this plan, the backlog edits and any history record. The PRDs state the current product.

## Coordinate Decision

- Coordinate: `W1 R2`
- Classification: `revision`
- Evidence: Source lineage sets the coordinate. Every Make Blueprint PRD names the [W1 R1 plan](../2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md) as its `source.path`, and this plan changes shared-rule text that W1 R1 wrote. So the wave stays 1, and the revision takes the next free number. The kit holds no `W1 R2` record: `docs/plans/` holds only `2026-10-30-w1-r1-make-blueprint-v2-maintenance/` and `2026-10-31-w2-r0-system-packages/`; `docs/work/` holds only `2026-10-30-w1-r1-make-blueprint-v2/`; `.make-docs/archive/` holds only `plans/2026-10-29-w1-r0-make-blueprint-v2/` and has no history folder; and a text search of the kit finds no `w1-r2` or `W1 R2`. The [root PRD index](../../../../../docs/prd/00-index.md#intended-follow-on) gives the same coordinate in its Coordinate Handoff. `W2 R0` is the unrelated system packages wave, so the highest-wave fallback does not apply.

The coordinate identifies this maintenance plan. The PRDs carry it only in Requirement History entries and Source Anchors.

## Maintenance Inputs

| Input | Format | Location | Confidence |
| --- | --- | --- | --- |
| Root decision Q-006 and the related root items Q-001, Q-002, Q-007, Q-020, Q-021, Q-023, R-001 and R-002 | Markdown register | [Root register](../../../../../docs/prd/03-open-questions-and-risk-register.md) | Authoritative |
| Scope, coordinate and candidate table | Markdown plan phase | [Root plan phase 05](../../../../../docs/plans/2026-11-01-w1-r0-make-kit-monorepo/05-make-blueprint-links.md) | Authoritative for scope. This plan checked each row against the current text. |
| Shared rules for every kit | Markdown PRDs | Root [00](../../../../../docs/prd/00-index.md), [01](../../../../../docs/prd/01-product-overview.md), [05](../../../../../docs/prd/05-kit-conventions.md), [06](../../../../../docs/prd/06-shared-core.md), [07](../../../../../docs/prd/07-setup-tool-and-shared-files.md) and [08](../../../../../docs/prd/08-build-and-release.md) | Authoritative. The files are not committed on 2026-11-01, so execution checks the root links again. |
| Make Blueprint PRDs | Markdown PRDs | [00 Index](../../prd/00-index.md) and PRDs 01 to 20 | Current Make Blueprint authority |
| Kit register items R-001, R-002, O-001, Q-010, Q-047, Q-049, Q-060, Q-072, Q-077 and D-011 | Markdown register | [Kit register](../../prd/03-open-questions-and-risk-register.md) | Authoritative |
| W1 R1 work backlog | Markdown work | [Backlog index](../../work/2026-10-30-w1-r1-make-blueprint-v2/00-index.md) | Implementation queue. No task is started. |

## Human Experience Propagation

Authority: the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md). No design feeds this plan, so the plan classifies the change itself. Impact: `direct`. Most rows change only the owner of a rule and leave the product the same. A few rows change planned Make Blueprint surfaces before any code exists: the MCP entry in each agent tool, the Windows machine folder, two flags and, with the owner's answers, the exit codes and the bare command. The W1 R1 promises keep their owners, work phases and evidence.

| Promise | Owning PRD | Human-facing surface or indirect effect | Work phase | Evidence source or selected testing type | Accepted obligation, if any |
| --- | --- | --- | --- | --- | --- |
| Install Make Blueprint alone, Make Docs alone, or both; handoff works with no extra setup | `05-ecosystem-and-shared-core.md`, `07-installation-and-distribution.md`, with root 01 and root 07 for the rules for every kit | `setup` output, root blocks, `.make/config.yaml` choices, and the MCP entry that `setup` writes: `make-blueprint` in every agent tool, run with `--profile` | `01-shared-core-adoption` Stage 4, `02-cli-and-packaging` Stages 6 and 8 | Automated Implementation Testing: the install matrix, A234 and a Codex run that loads the entry (C87); Human Experience Review of first-run setup output. The Make Docs cases stay open until the later Make Docs release, as the backlog already says. | None |
| User text in `AGENTS.md` and `CLAUDE.md` survives setup, update and uninstall of either tool | `06-project-layout-and-instruction-files.md`, with root 05 for the block rules for every kit | Instruction files. No behavior changes. | `01-shared-core-adoption` Stage 3, `02-cli-and-packaging` Stage 8 | Automated Implementation Testing: the round-trip suite, unchanged; validation step 8 shows that 06 keeps every Make Blueprint block rule | None |
| One status command shows project state and the next useful action | `08-cli-and-mcp.md` | `project status`, the bare `make-blueprint` command (OQ-3) and the exit codes (OQ-1) | `02-cli-and-packaging` Stage 2, `08-mcp-skills-and-status` | Human Experience Review of success, partial, blocked and failed output; Automated Implementation Testing of t12, A212 and A812 as the answers set them | None |
| A person on Windows finds the Make Blueprint machine folder where every kit keeps its folder | `06-project-layout-and-instruction-files.md`, with root 05 Machine Folders | The machine folder and the help text that names it | `02-cli-and-packaging` Stage 3 | Automated Implementation Testing on the Windows CI runner with the new Stage 3 criterion (C86) | None |
| A maintainer or an agent who reads a shared rule in a Make Blueprint PRD reaches its one owner through one working link | Make Blueprint PRDs 01, 05 to 09 and the register, with root PRDs 05 to 08 as the rule owners | The PRD and register text. Indirect effect: no two copies of one rule drift apart. | None in the backlog. Phases 1 and 2 of this plan. | Validation steps 5, 6 and 8 in [Phase 3](03-backlog-and-validation.md#validation-steps) | None |

The other W1 R1 promises keep their text and evidence: one signed file with no Python, evidence links to the exact place, one-file record diffs, ref clashes fixed by one command, and fit-gap files that open without Make Blueprint. Proof: no row in this plan changes their owning sections (PRDs 10 to 16 and 19), and validation step 8 records it.

## Performance Evidence Plan

Authority: the [Performance Evidence Governance Contract](make-docs://system/contract/performance-evidence-governance.md). This plan copies no target.

| Candidate | Base maintenance action | Performance applicability | Target class | Canonical `PERF-###` or next record | Finite budget and stop reference | Lifecycle point |
| --- | --- | --- | --- | --- | --- | --- |
| None. The start-time candidate in 07 and the index candidate in 09 keep their text. | `none` | `not-needed` | None | None | Not applicable | None. Validation step 2 runs the performance validator to show that the candidates are unchanged. |

## Active Authority Baseline

- Active `docs/prd/` status: one active namespace, [00 Index](../../prd/00-index.md) and PRDs 01 to 20. On 2026-11-01 `make-docs run prd authority validate --target-root kits/make-blueprint` passed, with 43 Markdown files and no diagnostic. The backlog snapshot gave only `BACKLOG-VAL-010`.
- Current index: [00 Index](../../prd/00-index.md)
- Discovery pass required: no. This plan read every section that the matrix names, beside its root section.
- Known noncompliance or legacy editorial PRDs: none.

## Candidate Decision Matrix

The phase files hold the 93 section-level rows: C01 to C62 in [Phase 1](01-prd-links.md#decision-matrix), C63 to C81 in [Phase 2](02-register-and-shared-surfaces.md#decision-matrix) and C82 to C93 in [Phase 3](03-backlog-and-validation.md#backlog-matrix). Each row names the exact Make Blueprint file and section, the root section it links to and the reason.

This table confirms each row of the root scope table against the current text.

| Scope row | Scope decision | Confirmed decision | Rows | Note |
| --- | --- | --- | --- | --- |
| Shared-core boundary, version pin and core release rules (05) | `link-only` | `link-only`, with one `update-existing` | C09, C13, C15, C21; C10 | C10 removes the `serve` reservation, which root 06 does not allow. |
| `.make/config.yaml` and `.make/personas.yaml` rules (05, 06) | `link-only` | `link-only`, with one `update-existing` | C08, C11, C14, C23; C35 | C35: 06 names 05 as the entry-format owner. Root 07 owns it. |
| Persona entry `name` used as a display name (05, Q-072) | `update-existing` | `update-existing` | C12, C66; also C74, C76, C79, C84, C85 | The `name` field also appears in 02, 04, 17 and backlog tasks t26 (phase 01) and t11 (phase 09). |
| CLI shape, MCP profiles, routers, managed blocks, machine folders and the Store boundary (06 to 09) | `link-only` | `link-only` for most rows; `update-existing` or `none` where the text disagrees with root 05 | Link rows C22 to C62; disagreements C26, C30, C36, C38, C47, C48, C50, C53, C54 | See [Owner Questions](#owner-questions) and [Judgment Calls](#judgment-calls-in-this-plan). |
| R-001 and R-002 (register) | `update-existing` | `update-existing` | C63, C64 | Closed as moved. See judgment call 2. |
| O-001 trigger | `update-existing` | `update-existing` | C65; also C04, C18, C89 | The 01 limitation, the 05 link check and the phase 04 dependency name Make Docs 2.1.0 too. |
| Make Docs handoff line said to come from Step 0 (05, backlog phases 01 and 02) | `update-existing` | `update-existing` | C06, C17, C20, C82, C83 | In backlog phase 01 the text is in Stage 4, not Stage 3. Stage 3 names only the block code and the uninstall fix, which root 06 puts in Step 0. |
| Make Blueprint release scope row for Step 0 (01) | `update-existing` | `update-existing` | C02 | Adds a "Setup tool wave" row. |
| Shared-core part list (05) | `link-only` | `link-only` | C09 | The `serve` row goes under C10. |

Decision counts for the recommended answers:

| Decision | Phase 1 | Phase 2 | Phase 3 | Total |
| --- | --- | --- | --- | --- |
| `update-existing` | 19 | 12 | 9 | 40 |
| `link-only` | 37 | 5 | 2 | 44 |
| `none` | 6 | 2 | 1 | 9 |
| `create` | 0 | 0 | 0 | 0 |

When the owner picks the other option: OQ-1 moves C50, C71 and the OQ-1 part of C92 to `none`; OQ-2 moves C53, C72, C81 and C93 to `update-existing`; OQ-3 moves C47 and the OQ-3 part of C92 to `none`; OQ-4 option A moves C30 to `update-existing`; OQ-5 option A moves C36 to `update-existing`.

## Owner Questions

The owner answers OQ-1, OQ-2 and OQ-3 before execution, because they gate rows in all three phases. OQ-4 and OQ-5 gate rows only when the owner picks option A. OQ-6 and OQ-7 do not block this plan. The Phase 2 worker records each question as a kit register item, Q-096 to Q-102 (C73).

### OQ-1 Exit Codes and Result Shapes

- Make Blueprint text: [08 Outcomes and Exit Codes](../../prd/08-cli-and-mcp.md#outcomes-and-exit-codes) maps `success` 0, `partial` 1, `failed` 2 and `blocked` 3, as the owner accepted in [kit Q-010](../../prd/03-open-questions-and-risk-register.md#q-010-exit-codes). The [08 Result Envelope](../../prd/08-cli-and-mcp.md#result-envelope) has no `ok` field.
- Root rule: the [root 05 Exit-Code Table](../../../../../docs/prd/05-kit-conventions.md#exit-code-table) has codes 0, 1 and 2, and a `blocked` result exits 1. [Root 05 Result and Error Shapes](../../../../../docs/prd/05-kit-conventions.md#result-and-error-shapes) puts `ok: true` on a success and the error shape on stderr.
- Why it matters: a script that runs two kits reads two exit-code tables. Backlog task t5 and five acceptance criteria in phases 04, 05, 06 and 08 use code 3.
- Options: A. Make Blueprint follows root 05. B. Keep kit Q-010, and root 05 adds code 3 for `blocked` for every kit, with a new Make Docs gap.
- Recommendation: A. Skills read the `outcome` field, so code 3 adds little, and one table serves every kit. Under A: `success` 0; `partial` 1; `blocked` 1; `failed` 2 when the command could not start (a bad flag or argument, an unknown record, an unreadable file) and 1 for an internal fault. The envelope gains `ok`, which is `true` for `success`, `partial` and `blocked`. A `failed` result uses the root error shape on stderr. A missing `allowWrite` stays `blocked` with `write-not-allowed`, because the operation does not run.
- Rows: C50, C71, C92; notes in C40 and C52; entry H4.
- Owner answer (2026-11-01): option A. Register item: [kit Q-096](../../prd/03-open-questions-and-risk-register.md#q-096-exit-codes-follow-the-root-table).

### OQ-2 Preview-First Commands

- Make Blueprint text: `run import v1`, `run package make` and `run package add` are dry runs by default and write only with `--apply`. Their MCP tools need `apply: true` and `allowWrite` ([08 run import](../../prd/08-cli-and-mcp.md#run-import), [08 System Package Commands (v2.1)](../../prd/08-cli-and-mcp.md#system-package-commands-v21), [20 System Packages](../../prd/20-system-packages.md), [kit Q-047](../../prd/03-open-questions-and-risk-register.md#q-047-v1-import-as-an-mcp-tool)). In 20, the person's `--apply` after the plan is the review.
- Root rule: [root 05 CLI Write Intent](../../../../../docs/prd/05-kit-conventions.md#cli-write-intent) says that a write command writes with no `--allow-write` or `--apply` flag, and that `--dry-run` is the one way to run it with no write. Root [D-021](../../../../../docs/prd/03-open-questions-and-risk-register.md#d-021-path-hygiene-uses-its-own-output-and-write-flags) counts the Make Docs `repair --apply` as a gap.
- Why it matters: under the root rule, a person who runs the import or a package take-in with no flag writes at once and skips the plan review.
- Options: A. Follow root 05: these commands write by default, `--dry-run` previews, and the skills run the dry run first. B. Keep the preview-first form, and root 05 adds a rule for a write whose plan is the review step, with one flag name for every kit.
- Recommendation: B. The plan review is a promise of 17 and 20. Root D-021 then needs a second look in the root register.
- Rows: C53, C72, C81, C93; entry H5 only under A.
- Owner answer (2026-11-01): option B. Register item: [kit Q-097](../../prd/03-open-questions-and-risk-register.md#q-097-preview-first-write-commands).

### OQ-3 Bare Command With No Install

- Make Blueprint text: in a folder that is not set up, bare `make-blueprint` names `make-blueprint setup`, never writes and never offers setup ([08 Command Groups](../../prd/08-cli-and-mcp.md#command-groups)).
- Root rule: with no install and a TTY, the bare command starts guided setup. With no TTY, it prints a hint and exits 0 ([root 05 CLI Top Level](../../../../../docs/prd/05-kit-conventions.md#cli-top-level)).
- Why it matters: a person who knows Make Docs expects the same first step from every kit.
- Options: A. Follow root 05. B. Keep the Make Blueprint rule, and root 05 changes.
- Recommendation: A. Guided `setup` shows the full plan and asks before it writes, so the person stays in control.
- Rows: C47, C92 (t12, A212); entry H6.
- Owner answer (2026-11-01): option A. Register item: [kit Q-098](../../prd/03-open-questions-and-risk-register.md#q-098-bare-command-with-no-install).

### OQ-4 Router Places and the Shared `.make/` Router

- Make Blueprint text: [06 Routers](../../prd/06-project-layout-and-instruction-files.md#routers) writes routers in the root, `.make/`, `.make/blueprint/`, `blueprint/` and its top sub-folders. It writes nothing under `docs/` and puts no router in `.make/blueprint/system/`. The [06 Project Tree](../../prd/06-project-layout-and-instruction-files.md#project-tree) has `.make/AGENTS.md` and `.make/CLAUDE.md`, with one block for each kit.
- Root rule: [root 05 Routers and Managed Blocks](../../../../../docs/prd/05-kit-conventions.md#routers-and-managed-blocks) lists the project root, `docs/`, the project tool directory, `system/` and its four type folders, and each selected docs folder. [Root 07 Project Files](../../../../../docs/prd/07-setup-tool-and-shared-files.md#project-files) has no `.make/` router.
- Why it matters: the root list reads as the Make Docs places. Every kit with a `.make/<kit>/` folder writes a block in the `.make/` router, but no root PRD owns it.
- Options: A. Make Blueprint adds routers in `.make/blueprint/system/` and its four type folders. B. Root 05 states the router places in kit terms (the root, the kit's tool directory and the kit's own content folders), and root 07 adds the `.make/` router to its project files.
- Recommendation: B. Make Blueprint keeps its list.
- Rows: C25 and C30 stay `none` under B.
- Owner answer (2026-11-01): option B. Register item: [kit Q-099](../../prd/03-open-questions-and-risk-register.md#q-099-router-places-in-kit-terms).

### OQ-5 Nested Config Key Style

- Make Blueprint text: [06 Project Config](../../prd/06-project-layout-and-instruction-files.md#project-config) uses `sources.git_level`, `sources.lfs_threshold_mb`, `conversion.table_csv_min_rows`, `review.second_reviewer`, `lists.capability_type`, `lists.option_scope` and `lists.integration_method`. The top-level keys are single words.
- Root rule: "Config keys use camelCase" ([root 05 Project Config](../../../../../docs/prd/05-kit-conventions.md#project-config)). Root [D-034](../../../../../docs/prd/03-open-questions-and-risk-register.md#d-034-config-key-styles-are-mixed) counts the top-level Make Docs key `prd_authority`.
- Why it matters: when the rule covers nested keys, seven Make Blueprint settings change, with every PRD and task that names them.
- Options: A. Rename the nested keys to camelCase, such as `sources.gitLevel`. B. Root 05 says that the rule covers top-level keys and that each kit sets the style of its nested keys. Make Blueprint keeps snake_case to match record fields such as `git_level`.
- Recommendation: B.
- Rows: C36 stays `none` under B.
- Owner answer (2026-11-01): option B. Register item: [kit Q-100](../../prd/03-open-questions-and-risk-register.md#q-100-nested-config-key-style).

### OQ-6 `serve` as an Eighth Top-Level Command

- Make Blueprint text: [08 The `serve` Command (v2.2)](../../prd/08-cli-and-mcp.md#the-serve-command-v22) adds `make-blueprint serve` beside `mcp` in v2.2 ([kit Q-049](../../prd/03-open-questions-and-risk-register.md#q-049-where-serve-sits)).
- Root rule: `<kit-cli> --help` lists exactly seven top-level commands ([root 05 CLI Top Level](../../../../../docs/prd/05-kit-conventions.md#cli-top-level)), and the core reserves no command name ([root 06 Core Boundary](../../../../../docs/prd/06-shared-core.md#core-boundary)).
- Why it matters: v2.2 would break the seven-command rule.
- Options: A. Put the server under an existing command, such as `mcp`. B. Root 05 lets a kit add a top-level lifecycle command that starts a long-running process, named in that kit's PRDs.
- Recommendation: B. The v2.0 help still lists seven commands. C10, C56, C70 and C80 remove the core reservation under either option.
- Rows: none gated.
- Owner answer (2026-11-01): option B. Register item: [kit Q-101](../../prd/03-open-questions-and-risk-register.md#q-101-long-running-lifecycle-command).

### OQ-7 When O-001 Can Close

- Make Blueprint text: the [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check) target is the first plan revision after the Make Docs release with the read command. Backlog phase [04](../../work/2026-10-30-w1-r1-make-blueprint-v2/04-record-types.md) builds only the skip, and phase [09](../../work/2026-10-30-w1-r1-make-blueprint-v2/09-v1-import-and-release.md) says that v2.0 ships with the skip.
- Root rule: [root Q-020](../../../../../docs/prd/03-open-questions-and-risk-register.md#q-020-release-of-the-link-read-command) ships the read command in Make Docs 2.1.0, release 2 of Step 0. [Root 01 Release Scope](../../../../../docs/prd/01-product-overview.md#release-scope) starts Make Blueprint v2.0 work after Step 0 closeout. So the read command exists before v2.0 work starts.
- Why it matters: v2.0 could confirm Make Docs links, and keep the skip only when `make-docs` is absent or older than 2.1.0.
- Options: A. When Make Docs 2.1.0 is on `latest`, a later Make Blueprint plan revision consumes O-001 before work phase 04 closes. B. Keep the v2.0 scope, and close O-001 after v2.0.
- Recommendation: A, after the JSON output of the 2.1.0 read command is known.
- Rows: none gated. C65 sets the trigger under either option, and C89 notes the question.
- Owner answer (2026-11-01): option A. Register item: [kit Q-102](../../prd/03-open-questions-and-risk-register.md#q-102-when-o-001-closes).

## Existing PRDs To Update

| Existing PRD | Phase | Main changes |
| --- | --- | --- |
| `docs/prd/00-index.md` | 2 | Purpose pointer to the root PRD set; 05 focus text |
| `docs/prd/01-product-overview.md` | 1 | Step 0 row and a setup tool wave row; core boundary link; Make Docs 2.1.0 in a limitation |
| `docs/prd/02-architecture-overview.md` | 2 | Core module owner; `label` in Configuration Surfaces |
| `docs/prd/03-open-questions-and-risk-register.md` | 2 | R-001, R-002, O-001, Q-010, Q-049, Q-060, Q-072, Q-077 and D-011; new Q-096 to Q-102 |
| `docs/prd/04-glossary.md` | 2 | `label`, `serve`, Step 0, `projectId` and root owners |
| `docs/prd/05-ecosystem-and-shared-core.md` | 1 | Purpose and scope; links for the core, the shared files, the pin and discovery; no `serve` reservation; `label`; release names in the dependency table; entry H3 |
| `docs/prd/06-project-layout-and-instruction-files.md` | 1 | Links for blocks, routers, resources and folders; Windows Store root; `projectId`; entry H1 |
| `docs/prd/07-installation-and-distribution.md` | 1 | MCP entry name and arguments; links for update, uninstall, install sources and the npm release |
| `docs/prd/08-cli-and-mcp.md` | 1 | MCP entry; `uninstall --dry-run`; `--target-root`; `serve`; links; gated exit codes and bare command; entries H2, H4 and H6 |
| `docs/prd/09-storage-and-indexing.md` | 1 | Owner links for the shared file, the Store base and the Store boundary |
| `docs/prd/10-records-and-identity.md` | 2 | File pointer to root 07 |
| `docs/prd/17-v1-import.md` | 2 | `label` for imported owner entries |
| `docs/prd/18-local-server-and-ui.md` | 2 | No `serve` reservation in the core |

`docs/prd/20-system-packages.md` changes only under option A of OQ-2.

## Genuinely New Product PRDs

None. Every changed rule already has a Make Blueprint owner or a root owner. The plan makes no PRD whose subject is the link change.

## Requirement History Entries

The [Phase 1 table](01-prd-links.md#requirement-history-entries) holds the entries. An entry is needed only where a Make Blueprint behavior changes and the W1 R1 backlog already builds on the earlier behavior. A row that only moves a rule's owner gets no entry, because the rule itself does not change, and root Q-006 and the register keep the trail.

| ID | Owning PRD | Date / coordinate | Affected section | Gate |
| --- | --- | --- | --- | --- |
| H1 | `docs/prd/06-project-layout-and-instruction-files.md` | 2026-11-01, `W1 R2` | Machine Tree (Windows Store root) | None |
| H2 | `docs/prd/08-cli-and-mcp.md` | 2026-11-01, `W1 R2` | Agent-Tool Registration (entry name and arguments) | None |
| H3 | `docs/prd/05-ecosystem-and-shared-core.md` | 2026-11-01, `W1 R2` | Shared Core (`label`, no `name`) | None |
| H4 | `docs/prd/08-cli-and-mcp.md` | 2026-11-01, `W1 R2` | Outcomes and Exit Codes | OQ-1 option A |
| H5 | `docs/prd/08-cli-and-mcp.md` | 2026-11-01, `W1 R2` | Command Catalog (`run import v1`) | OQ-2 option A |
| H6 | `docs/prd/08-cli-and-mcp.md` | 2026-11-01, `W1 R2` | Command Groups (bare command) | OQ-3 option A |

## Judgment Calls in This Plan

1. **Two link decisions.** `link-only` means that the root rule is correct and the Make Blueprint text agrees, so the text becomes a pointer plus the Make Blueprint detail. `update-existing` means that the Make Blueprint text disagrees with a root rule or a root decision, so its normative text changes.
2. **R-001 and R-002 close as moved.** Two open copies of one risk would split its status. The kit items become `Closed` with the Decision "Moved to root R-00N", and the root items stay `Open`. The numbers stay, so old links resolve.
3. **Clear disagreements align without a question.** Root 05 states these rules without an exception, and Make Blueprint has no code yet: the MCP entry name and arguments (C38, C54), the Windows Store root (C26), `uninstall --dry-run` and `--target-root` on `setup` and `setup remove` (C48), and the `projectId` key (C34).
4. **The Codex key takes a hyphen.** A TOML bare key can hold `-`, so `[mcp_servers.make-blueprint]` is valid TOML. C87 adds a Codex load test. When Codex refuses the key, C38 and C54 go back to the owner as a root 05 question.
5. **One entry shape in the kit.** The 07 MCP config example becomes a link to 08 MCP Server Entry (C38), so one Make Blueprint section shows the shape.
6. **Front matter stays.** Each changed PRD keeps its `source.path`, and its `## Source Anchors` list gains this plan.
7. **05 keeps the persona approval rule.** Root 07 Make Blueprint Use links to the 05 Shared Core section for it, so the rule and the heading stay in 05 (C14).
8. **Accepted register text stays.** Q-010, Q-049, Q-072 and Q-077 keep their accepted text and take an Update paragraph, as the register already does.

## Affected Links, Risks, Plans, And Work

| Surface | Artifact | Required maintenance | Authority role |
| --- | --- | --- | --- |
| Links and index | `docs/prd/00-index.md`, and the root files that link to Make Blueprint headings: root `00-index.md`, `01-product-overview.md`, `06-shared-core.md`, `07-setup-tool-and-shared-files.md` | Purpose pointer; no heading change in 01 and 05 to 09, so every root link still resolves | Navigation only |
| Risks and decisions | `docs/prd/03-open-questions-and-risk-register.md` | Rows C63 to C73 | Living risk and decision register |
| Plans | [W1 R1 plan](../2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md), [W2 R0 plan](../2026-10-31-w2-r0-system-packages/00-overview.md) | None. They record their own decisions. | Sequencing and rationale |
| Work | `docs/work/2026-10-30-w1-r1-make-blueprint-v2/` | In-place edits, rows C82 to C93 | Implementation queue |
| History | None yet | A history record after execution, when the owner asks for one | Execution provenance |

## Backlog Scope

The W1 R1 backlog has 397 open tasks and no done task. A delta backlog would leave two queues for the same phases, and an implementer would have to merge them. So the [Phase 3](03-backlog-and-validation.md) worker edits the affected tasks and criteria in place, keeps every ID and adds one criterion (C86). The backlog keeps its `W1 R1` directory. No `docs/work/<date>-w1-r2-.../` directory is made.

## Root-Side Follow-Ups

This plan writes only inside `kits/make-blueprint/`. These items belong to the root project, and the owner routes them:

- A root register item and a root 05 or 07 change for each owner question that the owner answers by changing a root rule: OQ-1 or OQ-3 option B, OQ-2 option B (with root D-021), OQ-4 option B, OQ-5 option B and OQ-6 option B.
- Root 07 Make Blueprint Use states that `owners` and `stakeholders` point to `maintainer` entries and `audience` points to `user` entries. Make Blueprint 05 and 10 own that rule, so root 07 could point to them.

## Out of Scope

- The `<user-home>/.../make-docs/` and `<user-home>/.../build-os/` code anchors in Make Blueprint PRDs. Root PRDs cite Make Docs code as `make-docs v2.0.6: <path>`. A later change can align them after copy day.
- Any root file, any Make Docs file and the root Step 0 backlog, which another worker writes at the same time.
- Make Blueprint PRDs 11 to 16 and 19, which state no shared rule.

## Output Contract

- Plan directory: `docs/plans/2026-11-01-w1-r2-shared-rules-links/`
  - entry point: `docs/plans/2026-11-01-w1-r2-shared-rules-links/00-overview.md`
  - phase files: `01-prd-links.md`, `02-register-and-shared-surfaces.md`, `03-backlog-and-validation.md`
- Existing authoritative PRDs to update: those in [Existing PRDs To Update](#existing-prds-to-update).
- Genuinely new authoritative PRDs: none.
- Requirement-history entries: H1 to H3 in 05, 06 and 08; H4 to H6 in 08 under the gates.
- Shared PRD surfaces: `docs/prd/00-index.md`, `docs/prd/03-open-questions-and-risk-register.md`, `docs/prd/04-glossary.md`.
- Backlog: in-place edits to `docs/work/2026-10-30-w1-r1-make-blueprint-v2/`. No delta backlog.

## Departure From the Default Arc

The default arc is design, plan, PRD, then work backlog. This plan departs from it in four ways:

- No design feeds it. Root decision Q-006 and root plan phase 05 are the inputs, and the Make Blueprint design does not change.
- The coordinator asked for the plan as files. The planning workflow first shows a plan in chat and writes it after approval. This plan stays `draft`, and execution starts only after the owner approves it and answers OQ-1 to OQ-3.
- The backlog takes in-place edits in place of a delta backlog (see [Backlog Scope](#backlog-scope)).
- The plan sets the Human Experience impact from the change itself, because no design intent exists.

## Phase Map

| File | Purpose |
| --- | --- |
| [01-prd-links.md](01-prd-links.md) | Rows C01 to C62 and entries H1 to H6 for PRDs 01 and 05 to 09 |
| [02-register-and-shared-surfaces.md](02-register-and-shared-surfaces.md) | Rows C63 to C81 for the register, the index, the glossary, and 02, 10, 17 and 18 |
| [03-backlog-and-validation.md](03-backlog-and-validation.md) | Rows C82 to C93 for the W1 R1 backlog, then the validation steps |

## Coordinator Policy

- Highest intended delegation tier: parallel subagents, then sequential subagents, then single-agent fallback.
- Coordinator role: `coordination only`.
- Coordinator write scope: `none` when delegation is available.
- Coordinator responsibilities: preflight, the owner answers, worker spawning, progress tracking, blocker handling and the final status.

## Worker Ownership

All paths are inside `kits/make-blueprint/`.

| Worker | Scope | Write Scope | Dependencies | Deliverables |
| --- | --- | --- | --- | --- |
| PRD links | [Phase 1](01-prd-links.md) | `docs/prd/01-*.md`, `05-*.md`, `06-*.md`, `07-*.md`, `08-*.md`, `09-*.md` | Owner answers to OQ-1 to OQ-3 for the gated rows | Rows C01 to C62 and entries H1 to H6 |
| Register and shared surfaces | [Phase 2](02-register-and-shared-surfaces.md) | `docs/prd/00-index.md`, `02-*.md`, `03-*.md`, `04-*.md`, `10-*.md`, `17-*.md`, `18-*.md`, and `20-*.md` only under OQ-2 option A | The same owner answers | Rows C63 to C81 |
| Backlog wording | [Phase 3](03-backlog-and-validation.md#backlog-matrix) | `docs/work/2026-10-30-w1-r1-make-blueprint-v2/*.md` | The same owner answers | Rows C82 to C93 |
| Validation and fix | [Phase 3](03-backlog-and-validation.md#validation-steps) | Fix-only edits inside the three write scopes above | All three writers | The validation report |

Merge order: the three writers run in parallel, because no heading changes and their write scopes do not overlap. Then the validation and fix worker runs.

## MCP Strategy

- Preferred servers available: the Make Docs MCP server (`resource_read`, `prd_validate`, `paths_validate`). Pass `targetRoot: kits/make-blueprint` on every call (workaround O-003 in the root map).
- Fallback plan if unavailable: the `make-docs` CLI from the repository root with `--target-root kits/make-blueprint` (workaround O-002). Check the `../` links into the root docs with a script (workaround O-004). Check the backlog with `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root kits/make-blueprint`, because the MCP tool `backlog_snapshot` has no workaround (O-005).

## Dependencies

- The root PRD set 00 to 08 and its register, with the headings that this plan links. They passed validation, but they are not committed yet. When a root heading changes before execution, the validation worker runs the link check again first.
- The owner answers to OQ-1, OQ-2 and OQ-3.
- Nothing in the root Step 0 backlog, which another worker writes at the same time.

## Validation

[Phase 3](03-backlog-and-validation.md#validation-steps) lists the ten steps. In short:

- The PRD authority validator, the performance validator and the backlog snapshot pass (steps 1 to 3).
- `paths_validate` and the link-check script find nothing, also for the root files that link to Make Blueprint headings (steps 4 to 6).
- A text search finds no old wording, and a side-by-side read shows that no shared rule is stated in full in both PRD sets (steps 7 and 8).
- No changed file holds a machine path or an email address (step 9).
- Human Experience proof: each promise above keeps one owning PRD, one work phase and its planned evidence, and the backlog tasks that C86, C87 and C92 change name that evidence (step 10).
- The owner reviews the changed PRDs and accepts them.

## Intended Follow-On

This handoff is advisory-default-but-overridable: it is authoritative unless the user explicitly overrides it, and it is not a gate or precondition.

- Route: `prd-generation`
- Next step: The owner answers OQ-1 to OQ-3 and routes OQ-4 to OQ-7. Then the workers update the PRDs, the register and the backlog from this plan. Read `make-docs://system/prompt/plan-to-prd-change.prompt.md` with `make-docs resource read`.
- Why: Each shared rule must have one owner in the PRDs before work phase 01 of the W1 R1 backlog reads them.
- Coordinate Handoff: Carry `W1 R2` into the Requirement History entries and the Source Anchors of the changed PRDs. The W1 R1 backlog keeps its directory and coordinate, and takes in-place edits.
