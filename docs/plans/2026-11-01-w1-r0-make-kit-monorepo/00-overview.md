---
title: "Make Kit Monorepo Baseline Plan"
kind: "plan"
status: "draft"
coordinate: "W1 R0"
source:
  type: "design"
  path: "docs/designs/2026-10-30-make-kit-monorepo.md"
follow_on:
  route: "prd-generation"
  next_prompt: "make-docs://system/prompt/plan-to-prd-green-field.prompt.md"
  why: "The repo-wide project has no PRDs. The root PRDs must own the shared rules before the Step 0 backlog reads them."
  coordinate_handoff: "Carry W1 R0 into the root PRD source links and the Step 0 work backlog."
---

# Make Kit Monorepo Baseline Plan

**Date:** 2026-11-01

**Repository:** `make-kit` (`github.com/brucewaynedecoy/make-kit`), repo-wide docs root `docs/`

## Purpose

This plan turns the [Make Kit Monorepo](../../designs/2026-10-30-make-kit-monorepo.md) design into the first repo-wide PRD set and the Step 0 work backlog. It fixes the PRD catalog, the register seed, how the work splits across workers, and what the Step 0 backlog covers. Step 0 moves Make Docs into this repository, makes the repository public, moves the Make Docs release to this repository, ships the nested-project fixes, and pulls out the shared core.

## Objective

- The root `docs/prd/` holds `00` to `08`, and each shared rule in the design has exactly one owning root PRD.
- `05-kit-conventions.md` states each kit rule from the Make Docs code at `v2.0.6`, with one target rule and a listed gap wherever Make Docs differs from the design.
- `docs/prd/03-open-questions-and-risk-register.md` records the interview decisions Q-001 to Q-026, R-001 and R-002 from the Make Blueprint register, the new Step 0 risks, one `D-###` item for each Kit Conventions gap, and O-001 to O-005 under `## Deferred Obligations`.
- `make-docs run prd authority validate --target-root .` exits 0 from the repository root, and every link resolves, including `../` links into the kit docs.
- The Step 0 work backlog is generated from the root PRDs, with the phases in [06 Work Backlog Scope](06-work-backlog-scope.md).

## Coordinate Decision

- Coordinate: `W1 R0`
- Classification: `new-wave`
- Evidence: The source design's `## Intended Follow-On` names the `baseline-plan` route and leaves the coordinate to the planner. The root `docs/plans/` and `docs/work/` hold only router files, and the root has no history records. The kit coordinates in `kits/make-blueprint/` belong to another Make Docs project and do not count. With no prior entries, the wave model sets `w1-r0`.

## Design Inputs

| Input | Format | Location | Confidence |
| --- | --- | --- | --- |
| Repo-wide design, with the interview decisions Q-001 to Q-026 | Markdown design | [Make Kit Monorepo](../../designs/2026-10-30-make-kit-monorepo.md) | Authoritative |
| Monorepo map and workarounds O-001 to O-005 | Markdown router, outside the Make Docs block | Root `AGENTS.md` and `CLAUDE.md` | Authoritative for the current workarounds |
| Make Blueprint shared-core and ecosystem rules | Markdown PRD | [05 Ecosystem and Shared Core](../../../kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md) | Authoritative today; the root PRDs take over the shared parts |
| Make Blueprint release scope (the Step 0 row) | Markdown PRD | [01 Product Overview](../../../kits/make-blueprint/docs/prd/01-product-overview.md) | Authoritative for Make Blueprint scope |
| R-001 Core Release Friction and R-002 Two Core Versions in One Project | Markdown register items | [Make Blueprint register](../../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md) | Authoritative; they move to the root register |
| Make Docs code, CI and PRDs at the `v2.0.6` tag | Source tree | Local clone `../make-docs` of `github.com/brucewaynedecoy/make-docs`, tag `v2.0.6` (commit `ff0b97dc`) | Authoritative for Kit Conventions and the core boundary |
| Make Docs code facts gathered during the interview | Chat report, not stored | None | Exploratory. It was read from a work branch, not from `v2.0.6`, so the discovery pass checks each fact again. |

Workers read `v2.0.6` from the local clone of the old repository, the sibling folder `../make-docs`, with read-only git commands such as `git -C ../make-docs show v2.0.6:<path>` and `git -C ../make-docs archive v2.0.6`. No worker checks out, fetches, commits or changes a file in that clone, and no worker changes the old repository on GitHub.

Q-026 is closed. On 2026-11-01 the owner deleted the GitHub repository and created it again with the same name. Each commit ID from before the email rewrite now returns "No commit found" on GitHub.

## Human Experience Propagation

Authority: the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md), with the source design's `## Human Experience Intent` as the local outcome authority. Impact stays `direct`. Work phases name the Step 0 backlog phases in [06 Work Backlog Scope](06-work-backlog-scope.md).

| Promise | Owning or planned PRD | Human-facing surface or indirect effect | Work phase | Evidence source or selected testing type | Accepted obligation, if any |
| --- | --- | --- | --- | --- | --- |
| An agent that starts at the repository root can tell which project a task belongs to and reaches that project's routers and docs | `02-architecture-overview.md` (docs roots and routing check), `05-kit-conventions.md` (routers) | Root map in `AGENTS.md` and `CLAUDE.md`, kit routers | `04-routing-check-baseline`, `06-nested-project-fixes` | The routing check in `scripts/routing-check/`: a baseline after the copy and a second run after the fixes, recorded in `docs/assets/maintainer/routing-check/` | None |
| A person who set up one kit sees the earlier agent-tool choices already selected for another kit | `07-setup-tool-and-shared-files.md` | `.make/config.yaml` and each kit's setup prompts | None in Step 0. The later setup tool wave owns it (Q-001). | Planned for that wave: an install test with two kits | None |
| A person runs `make-kit setup` once and gets each chosen kit set up; each kit still sets up alone | `07-setup-tool-and-shared-files.md` | `make-kit setup` and each kit's own `setup` | None in Step 0. The later setup tool wave owns it (Q-001). | Planned for that wave: an install test with two kits | None |
| A Make Docs user sees no change to the npm package name or the install commands after the switch point | `08-build-and-release.md` | npm package page, `npm install -g @brucewaynedecoy/make-docs`, `make-docs --version` | `05-switch-point` | Automated Implementation Testing: the tarball file-list compare of 2.0.7 with 2.0.6, and the install check from npm on Linux, macOS and Windows | None |
| A user who installs from `latest` gets no version from the new release path until that path has passed on `next` | `08-build-and-release.md` | npm dist-tags `next` and `latest` | `05-switch-point` | Automated Implementation Testing: `2.0.7-rc.0` on `next` with the install check, then `2.0.7` on `latest` with the install check again | None |
| Each temporary workaround stays visible, numbered and owned until it is removed | `03-open-questions-and-risk-register.md` (`## Deferred Obligations`), `02-architecture-overview.md` (docs roots) | Root map items 1 to 5 and the O-001 to O-005 records | `06-nested-project-fixes` | Review: each fixed O-number is `Fulfilled` with its version and proof command, and its root map item is gone | O-001 to O-005 |

## Performance Evidence Plan

Authority: the [Performance Evidence Governance Contract](make-docs://system/contract/performance-evidence-governance.md). This plan copies no target.

| Candidate | Base maintenance action | Performance applicability | Target class | Canonical `PERF-###` or next record | Finite budget and stop reference | Lifecycle point |
| --- | --- | --- | --- | --- | --- | --- |
| None. The source design lists no candidate. CI run time on macOS and Windows is a cost, not a product outcome. | `none` | `not-needed` | None | None | Not applicable | None |

## Existing Codebase Context

- Codebase status: `existing-active`. This repository holds `kits/make-blueprint/` (docs only) and the root docs. Make Docs code lives in the old repository until copy day.
- Integration constraints: the npm name `@brucewaynedecoy/make-docs` and its install commands do not change. The Make Docs Store keeps schema version 6 and `projectId` `831ddb50-b97a-47e2-9f2c-f491b27b8759`. Do not change Make Blueprint unless a Step 0 decision needs it.
- Discovery pass required: yes, for `05-kit-conventions.md` and `06-shared-core.md`.
- Discovery scope: the Make Docs tree at `v2.0.6`: `packages/cli/src/` (CLI groups, `run` paths, exit codes, `--json` and `--dry-run`, MCP server and profiles, resources, managed blocks, config, Store paths, Personas), `packages/docs/template/`, the two CI workflows, and the Make Docs PRDs that state the same rules (for example PRD 39, the CLI).

## Output Contract

- Plan directory: `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/`
  - entry point: `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md`
  - phase files: `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/01-product-and-architecture.md` to `06-work-backlog-scope.md`
- PRD core:
  - `docs/prd/00-index.md`
  - `docs/prd/01-product-overview.md`
  - `docs/prd/02-architecture-overview.md`
  - `docs/prd/03-open-questions-and-risk-register.md`
  - `docs/prd/04-glossary.md`
- Adaptive PRDs: `05-kit-conventions.md`, `06-shared-core.md`, `07-setup-tool-and-shared-files.md`, `08-build-and-release.md`
- Implementation work: `docs/work/<generation-date>-w1-r0-make-kit-monorepo/`

## Existing PRD Handling

- Active `docs/prd/` status: router files only (`AGENTS.md`, `CLAUDE.md`). No active namespace exists.
- Eligible mode: `first-namespace`
- Archive step required before execution: no
- Planned archive target if approved: not applicable
- Active root entries to archive: none

## Coordinator Policy

- Highest intended delegation tier: parallel subagents, then sequential subagents, then single-agent fallback.
- Coordinator role: `coordination only`.
- Coordinator write scope: `none` when delegation is available.
- Coordinator responsibilities: preflight, the check that `../make-docs` holds the `v2.0.6` tag, routing, worker spawning, progress tracking, blocker handling and final status.
- Other agents may work in this repository at the same time. Each worker writes only its own files.

## Scope and Phasing

- Phasing strategy: `incremental`. The root PRDs first, then the Make Blueprint change plan, then the Step 0 backlog.
- Phase boundaries driven by: technical dependency. The register and the index need the subject PRDs. The Make Blueprint links need validated root PRDs. The backlog needs all of them.

## Phase Map

| Phase | Summary | Key Deliverables | Dependencies |
| --- | --- | --- | --- |
| [01 Product and Architecture](01-product-and-architecture.md) | What the monorepo is, its users, release scope, layout, docs roots and the routing check | `01-product-overview.md`, `02-architecture-overview.md` | None |
| [02 Kit Conventions](02-kit-conventions.md) | The rules every kit follows, taken from the Make Docs code, with the Make Docs gaps | `05-kit-conventions.md` and a gap list for the register | The discovery pass |
| [03 Core, Setup and Release](03-core-setup-and-release.md) | The shared core, the setup tool and shared files, and the build and release flow | `06-shared-core.md`, `07-setup-tool-and-shared-files.md`, `08-build-and-release.md` | The discovery pass |
| [04 Register and Assembly](04-register-and-assembly.md) | Index, register and glossary, then the validation pass | `00-index.md`, `03-open-questions-and-risk-register.md`, `04-glossary.md`, a validation report | Phases 01 to 03 |
| [05 Make Blueprint Links](05-make-blueprint-links.md) | Scope of the Make Blueprint change plan that turns its shared rules into links | A change plan in `kits/make-blueprint/docs/plans/` | Phase 04 passes |
| [06 Work Backlog Scope](06-work-backlog-scope.md) | Scope and phase map of the Step 0 backlog | `docs/work/<generation-date>-w1-r0-make-kit-monorepo/` | Phase 04 passes |

## Dependencies

- The discovery pass needs the `v2.0.6` tag in the local clone `../make-docs`. The tag is there now.
- The PRDs need nothing else outside this repository. The design already records every interview decision.
- Q-026 is closed. The backlog phase `02-go-public` checks the old commit IDs again before the repository goes public.
- The Make Blueprint backlog phase `01-shared-core-adoption` waits on the Step 0 backlog. Its "too-old" path covers the Make Docs handoff line, which Q-007 moves out of Step 0.

## Proposed Catalog

The tree stays flat. Each adaptive subject fits one document.

| File | Kind | Owns |
| --- | --- | --- |
| `00-index.md` | index | Reading order, document map, audience paths and the link to each kit's PRDs |
| `01-product-overview.md` | overview | The Make Kit stack, its users, the separate-or-together rule, the release scope and current limitations |
| `02-architecture-overview.md` | architecture | Layout, npm workspace, package map, several docs roots, the root map, the routing check, and the monorepo setup option as later scope |
| `03-open-questions-and-risk-register.md` | register | Q-001 to Q-026 and later items, R-001 onward, D-001 onward for Kit Conventions gaps, O-001 to O-005 |
| `04-glossary.md` | glossary | Kit, core, setup tool, switch point, copy day, docs root, root map, routing check, reference kit, release candidate, dist-tag, trusted publisher, provenance |
| `05-kit-conventions.md` | subsystem | CLI shape, outcomes and exit codes, `--json` and `--dry-run`, the MCP server, profiles and `allowWrite`, system resources and project records, routers and managed blocks, `.make/` and `.make/<kit>/` files, `~/.make/<kit>/` and `MAKE_<KIT>_HOME`, and the Store boundary |
| `06-shared-core.md` | subsystem | The eight core areas, kit names as inputs, tool discovery, the slice order, Store schema version 6, the exact version pin, and R-001 and R-002 |
| `07-setup-tool-and-shared-files.md` | subsystem | `make-kit setup`, `.make/config.yaml`, `.make/<kit>/config.yaml`, `.make/personas.yaml` with its fields, and the later wave that builds them |
| `08-build-and-release.md` | subsystem | CI workflows, the shared publish workflow, package-named tags, release-candidate digests, trusted publishing and provenance, the switch test, rulesets, code owners, Dependabot, the license, the public repository and the frozen old repository |

## Worker Ownership

| Worker | Scope | Write Scope | Dependencies | Deliverables |
| --- | --- | --- | --- | --- |
| Discovery | Read the Make Docs tree at `v2.0.6` and report facts with file and line anchors | None in this repository. A report in the coordinator's scratch folder. | The `v2.0.6` tag in `../make-docs` | A fact report for Kit Conventions and the core boundary |
| Product and architecture | [Phase 01](01-product-and-architecture.md) | `docs/prd/01-product-overview.md`, `docs/prd/02-architecture-overview.md` | None | 01, 02 |
| Kit Conventions | [Phase 02](02-kit-conventions.md) | `docs/prd/05-kit-conventions.md` | Discovery | 05 and a gap list in the worker's final report |
| Core, setup and release | [Phase 03](03-core-setup-and-release.md) | `docs/prd/06-shared-core.md`, `docs/prd/07-setup-tool-and-shared-files.md`, `docs/prd/08-build-and-release.md` | Discovery | 06, 07, 08 |
| Assembly and validation | [Phase 04](04-register-and-assembly.md) | `docs/prd/00-index.md`, `docs/prd/03-open-questions-and-risk-register.md`, `docs/prd/04-glossary.md`, then fix-only edits to files that validation flags | All PRD workers | 00, 03, 04 and a validation report |
| Make Blueprint links | [Phase 05](05-make-blueprint-links.md) | `kits/make-blueprint/docs/plans/<date>-w1-r2-shared-rules-links/` | Phase 04 passes; runs as a follow-on step | One Make Blueprint change plan |
| Backlog | [Phase 06](06-work-backlog-scope.md) | `docs/work/<generation-date>-w1-r0-make-kit-monorepo/` | Phase 04 passes; runs as a follow-on step | The Step 0 work backlog |

Merge order: Discovery first. Then the three PRD workers run in parallel. Then Assembly and validation. The Make Blueprint change plan and the backlog come after validation, in either order.

## MCP Strategy

- Preferred servers: the Make Docs MCP server (`resource_read`, `prd_validate`, `performance_validate`, `paths_validate`). Pass the repository root as `targetRoot` for root work, and `kits/make-blueprint` for Make Blueprint work (workaround O-003).
- Fallback: the `make-docs` CLI from the repository root with `--target-root .` for root work, and `--target-root kits/make-blueprint` for kit work (workaround O-002), and plain file reads.
- Links that leave a project with `../` are not checked by Make Docs (workaround O-004). The validation worker checks them with a script that resolves each relative link and anchor.

## Acceptance Criteria Guidance

- Criteria style: checklist. Each criterion names an observable result, such as a command and its exit code, a file and its content, or an npm dist-tag and its version.
- Every subject PRD addresses security (secrets, client data and local paths stay out of the public repository), compatibility (live Make Docs users and Store schema version 6), and platform support (Linux, macOS and Windows).
- Write every PRD in ASD-STE100 Simplified Technical English: short sentences, active voice, one idea per sentence, and exact paths and commands.
- PRDs state the current or target product. Change words such as "add", "move" or "replace" stay in plans, work and history.

## Validation

- Every design section and every interview decision Q-001 to Q-026 has one owning root PRD or register item.
- Every accepted Human Experience promise above has one owning PRD, one work phase or a named later wave, and planned evidence.
- `05-kit-conventions.md` cites a Make Docs `v2.0.6` file for each rule, and each listed gap has one `D-###` item.
- R-001 and R-002 appear in the root register with their full text and a note on where they came from.
- O-001 to O-005 appear under `## Deferred Obligations` with every required field of the [Deferred Obligation Contract](make-docs://system/contract/deferred-obligation-contract.md). The design section 9 table then points to the register.
- `make-docs run prd authority validate --target-root .` and `make-docs run performance evidence validate --target-root .` exit 0 from the repository root.
- The `paths_validate` MCP tool reports no findings for the new files, and no `/Users/` path appears. Write `<user-home>` where a home path is needed.
- Every relative link and anchor resolves, including `../` links into `kits/make-blueprint/docs/`, checked by script (O-004).
- The owner reviews the root PRDs and accepts them.

## Intended Follow-On

This handoff is advisory-default-but-overridable: it is authoritative unless the user explicitly overrides it, and it is not a gate or precondition.

- Route: `prd-generation`
- Next step: Generate the root PRD set from this plan. Read `make-docs://system/prompt/plan-to-prd-green-field.prompt.md` with `make-docs resource read`. After the PRDs pass validation, write the Make Blueprint change plan as [Phase 05](05-make-blueprint-links.md) describes, and generate the Step 0 backlog as [Phase 06](06-work-backlog-scope.md) describes.
- Why: The repo-wide project has no PRDs. The root PRDs must own the shared rules before the Step 0 backlog and the Make Blueprint links read them.
- Coordinate Handoff: Carry `W1 R0` into the root PRD source links and the Step 0 backlog, `docs/work/<generation-date>-w1-r0-make-kit-monorepo/`. The Make Blueprint change plan is a revision in that kit's own project, so it takes the next unused revision of its wave 1 (`W1 R2`).
