---
title: "Make Blueprint System Packages Maintenance Plan"
kind: "plan"
status: "draft"
coordinate: "W2 R0"
source:
  type: "design"
  path: "docs/designs/2026-10-31-system-packages.md"
follow_on:
  route: "prd-generation"
  next_prompt: "make-docs://system/prompt/plan-to-prd-change.prompt.md"
  why: "The PRD set must state system packages before a work backlog reads it."
  coordinate_handoff: "Carry W2 R0 into the PRD source links and the W2 R0 work backlog."
---

# Make Blueprint System Packages Maintenance Plan

**Date:** 2026-10-31

**Repository:** `kits/make-blueprint` in the make-kit monorepo

## Purpose

This plan brings system packages into the Make Blueprint PRD set as planned v2.1 scope. A system package is a versioned bundle of one or more systems and their records, which one project makes and other projects take in as a baseline. The [design](../../designs/2026-10-31-system-packages.md) records the decisions, and register items Q-085 to Q-095 hold the owner's answers.

## Objective

- Write one new PRD, [20 System Packages](../../prd/20-system-packages.md), that states the full v2.1 contract.
- Update the existing owners only where packages touch them: the `package` type, the `origin` field, the `run package` domain, the check codes, the source folder and the shared import steps.
- Leave a work backlog scope for `W2 R0`. The backlog itself is written when v2.0 ships (Q-095).

Completion: PRD 20 exists and validates, every candidate below has one decision, and [01 Work Backlog Scope](01-work-backlog-scope.md) names the phases for the later backlog.

## Governing Invariant

> `docs/prd/` describes the current authoritative shape of the product. It must never describe the editorial operation used to change that authority.

Sequencing and editorial language stay in this plan, the later work backlog and history records.

## Coordinate Decision

- Coordinate: `W2 R0`
- Classification: `new-wave`
- Evidence: The owner chose a new wave and ruled out a new `W1` revision (Q-093). The Make Docs wave model starts a new wave for a new end-to-end initiative. v2.0 needs no rebuild for packages, so this work does not revise `W1 R1`.

`W1 R1` took a small change in place, with no new revision: the reserved `run package` domain and `origin` field name, the release labels, and the rebuild note in 17. The [W1 R1 plan](../2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md) records that change.

## Maintenance Inputs

| Input | Format | Location | Confidence |
| --- | --- | --- | --- |
| System packages design | Markdown | [2026-10-31-system-packages.md](../../designs/2026-10-31-system-packages.md) | High: owner-approved |
| Owner decisions Q-085 to Q-095 | Register items | [03 Open Questions and Risk Register](../../prd/03-open-questions-and-risk-register.md#q-085-what-a-system-package-holds) | High: owner-accepted on 2026-10-31 |
| Make Blueprint v2 architecture design | Markdown | [2026-10-29-make-blueprint-v2-architecture.md](../../designs/2026-10-29-make-blueprint-v2-architecture.md) | High |
| Active PRD set | Markdown | [00 Index](../../prd/00-index.md) | High |

## Human Experience Propagation

Authority: the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md), with the design's `## Human Experience Intent` as the local outcome authority. Impact is `direct`. Work phases name the phases in [01 Work Backlog Scope](01-work-backlog-scope.md).

| Promise | Owning PRD | Human-facing surface or indirect effect | Work phase | Evidence source or selected testing type | Accepted obligation, if any |
| --- | --- | --- | --- | --- | --- |
| A person takes in a system baseline from one file and sees the full plan before any write | `20-system-packages.md`, `08-cli-and-mcp.md` | `run package add` dry run and `package_add` | `03-package-add` | Automated Implementation Testing: the dry run and the write share one plan; Human Experience Review of the plan output | None |
| A new version keeps every change that the team made; changes to those records come back for review | `20-system-packages.md`, `13-extraction-and-review.md` | `run package add` on a new version, pending changes, `run package show` | `04-new-versions` | Automated Implementation Testing of each row of the new-version table | None |
| A maker sees every source that will leave the project before the bundle is written | `20-system-packages.md` | `run package make` dry run and `package_make` | `02-package-make` | Automated Implementation Testing of the source list; Human Experience Review of the dry-run output | None |

## Performance Evidence Plan

Authority: the [Performance Evidence Governance Contract](make-docs://system/contract/performance-evidence-governance.md). This plan copies no target.

| Candidate | Base maintenance action | Performance applicability | Target class | Canonical `PERF-###` or next record | Finite budget and stop reference | Lifecycle point |
| --- | --- | --- | --- | --- | --- | --- |
| `run package add` of a large product baseline in one journaled change under the write lock | `create` | `characterize-now` | `characterization-baseline` | Next record: one `PERF-###` profile created by work phase `04-new-versions` before its first measurement | Set in that profile under the contract's bounded-work rule | After the first version and new-version writes exist |

## Active Authority Baseline

- Active `docs/prd/` status: active, 20 PRDs after this plan
- Current index: [00 Index](../../prd/00-index.md)
- Discovery pass required: no
- Known noncompliance or legacy editorial PRDs: none

## Candidate Decision Matrix

| Candidate | Decision | Owning PRD or new product subject | Reason | Evidence |
| --- | --- | --- | --- | --- |
| What a package holds, the bundle, make and take-in commands, new versions, the stamp, sources and merges | `create` | `20-system-packages.md` | A coherent subsystem with no owner | Q-085 to Q-092 |
| The `package` record type | `update-existing` | `11-record-types-reference.md` | 11 owns every type's fields | Q-091 |
| The `origin` common field and the package alias form | `update-existing` | `10-records-and-identity.md` | 10 owns common fields and aliases | Q-088, Q-089 |
| `origin-unknown-package` and `origin-withdrawn` | `update-existing` | `10-records-and-identity.md` | 10 owns the check catalog | Q-092 |
| The `run package` domain and its MCP tools | `update-existing` | `08-cli-and-mcp.md` | 08 owns command and tool names | Q-093 |
| Sources from a package and the missing state | `update-existing` | `12-source-intake-and-conversion.md` | 12 owns git levels and the missing state | Q-086 |
| `run extract next` skips sources from a package | `update-existing` | `13-extraction-and-review.md` | 13 owns the extraction queue | Q-085 |
| `blueprint/sources/packages/` | `update-existing` | `06-project-layout-and-instruction-files.md` | 06 owns the project tree | Q-086 |
| Shared plan and write steps | `update-existing` | `17-v1-import.md` | 17 owns the import steps that packages reuse | Q-093 |
| Release labels and planned scope | `update-existing` | `01-product-overview.md`, `18-local-server-and-ui.md` and every PRD that names a release | 01 owns release scope | Q-094 |
| Module map, glossary and index | `update-existing` | `02-architecture-overview.md`, `04-glossary.md`, `00-index.md` | Navigation and shared terms | Q-095 |

## Existing PRDs To Update

| Existing PRD | Owning sections | Current normative update | Preserved surrounding authority |
| --- | --- | --- | --- |
| `docs/prd/01-product-overview.md` | Release Scope, Foundation Capabilities, Current Limitations | v2.1 system packages row and limitation | All v2.0 scope |
| `docs/prd/08-cli-and-mcp.md` | System Package Commands (v2.1) | Four `run package` commands, tools and profiles; v2.0 reserves the domain | The v2.0 catalog |
| `docs/prd/10-records-and-identity.md` | Common Fields, Aliases and Name Lookup, Check Catalog | `origin` field, package alias, two check codes | Every v2.0 rule |
| `docs/prd/11-record-types-reference.md` | Type Summary, Common Fields and Field Order, Package (v2.1), Relation Summary | `package` type and `origin` order | Twelve v2.0 types |
| `docs/prd/12-source-intake-and-conversion.md` | Source Git Levels and the Missing State | Sources from a package show as missing | Git level rules |
| `docs/prd/13-extraction-and-review.md` | Extraction queue | `run extract next` skips sources from a package | Extraction rules |
| `docs/prd/06-project-layout-and-instruction-files.md` | Project tree table | `blueprint/sources/packages/` | Layout rules |
| `docs/prd/17-v1-import.md` | Rebuild Notes | Shared plan and write steps | Import rules |
| `docs/prd/02-architecture-overview.md`, `docs/prd/04-glossary.md`, `docs/prd/00-index.md` | Module map, terms, reading order and Document Map | New rows and terms | Everything else |

## Genuinely New Product PRDs

| New PRD | Product-oriented kind | Coherent subject | Why no existing owner is suitable |
| --- | --- | --- | --- |
| `docs/prd/20-system-packages.md` | `subsystem` | System packages | No PRD owns moving records between projects. The v1 import is a one-time move from another product, not a versioned exchange between Make Blueprint projects. |

## Requirement History Entries

| Owning PRD | Date / coordinate | Affected requirement or section | Previous contract | Replacement contract | Rationale | Source |
| --- | --- | --- | --- | --- | --- | --- |
| `docs/prd/01-product-overview.md` | 2026-10-31, `W1 R1` | Release Scope | v2.1 was setup B and the UI; v2.2 was test records | v2.1 is system packages; setup B and the UI are v2.2; test records are v2.3 | Q-094 | Register Q-094 |
| `docs/prd/18-local-server-and-ui.md` | 2026-10-31, `W1 R1` | Purpose and Scope | The server and UI were v2.1 | They are v2.2 | Q-094 | Register Q-094 |

## Judgment Calls in This Plan

These rules fill gaps that Q-085 to Q-095 leave. Each one follows from an accepted answer and keeps the feature small. The owner can change any of them before the work backlog is written.

1. Only `current` integrations travel. A planned integration states the maker's own plan, the same reason that analysis stays home (from Q-085).
2. The `origin` stamp never travels, so a system that came in from a package can go into a new package like any other system. No special rule refuses it.
3. `run package add` matches records by the upstream `id` in their stamp, from any package (from Q-089). So a project that took in a package with system A and later takes one with systems A and B updates A and brings in B.
4. When a local persona record already claims a slug, the incoming persona record with that slug is not written, and the plan names both. The role is already described locally (from Q-090).
5. `run package make` writes the bundle into the current folder, or into `--out`. It does not write into `blueprint/exports/`, because `run export all` deletes stale files there.
6. Sources from a package go under `blueprint/sources/packages/<name>/`, and `run extract next` skips them, because the package already holds their records.
7. `run package make` stops when a record that would travel has a `project check` Error, so a baseline never carries a broken record.
8. Facet values and tags from a package are added on each version and never taken away. `aliases` and the Make Docs links `work_items` and `docs` never travel.

## Affected Links, Risks, Plans, And Work

| Surface | Artifact | Required maintenance | Authority role |
| --- | --- | --- | --- |
| Links and index | `docs/prd/00-index.md` | Reading order item and Document Map row for PRD 20 | Navigation only |
| Risks and decisions | `docs/prd/03-open-questions-and-risk-register.md` | Q-085 to Q-095, all `Closed` | Living risk and decision register |
| Plans | `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/` | Rows for the reserved names and the release labels | Sequencing and rationale |
| Work | `docs/work/2026-10-30-w1-r1-make-blueprint-v2/` | Reserve the `run package` domain and the `origin` name in v2.0 work; release labels | Implementation queue |
| History | None yet | None | Execution provenance |

## Output Contract

- Plan directory: `docs/plans/2026-10-31-w2-r0-system-packages/`
  - entry point: `docs/plans/2026-10-31-w2-r0-system-packages/00-overview.md`
  - phase file: `docs/plans/2026-10-31-w2-r0-system-packages/01-work-backlog-scope.md`
- New authoritative PRD: `docs/prd/20-system-packages.md`
- Existing authoritative PRDs to update: those in [Existing PRDs To Update](#existing-prds-to-update)
- Requirement-history entries: 01 and 18
- Shared PRD surfaces: `docs/prd/00-index.md`, `docs/prd/03-open-questions-and-risk-register.md`, `docs/prd/04-glossary.md`
- Delta backlog, written when v2.0 ships: `docs/work/<date>-w2-r0-system-packages/`

## Departure From the Default Arc

The default arc is design, plan, PRD, then work backlog. Here the plan and the PRD changes were written in one pass on 2026-10-31, so the decisions live in product authority at once (Q-095). The work backlog waits until v2.0 ships, so it builds on the v2.0 code as it is then.

## Worker Ownership

| Worker | Scope | Write Scope | Dependencies | Deliverables |
| --- | --- | --- | --- | --- |
| PRD writer | PRD 20 and the existing-owner updates | `docs/prd/` | The design and Q-085 to Q-095 | PRD 20 and the updates listed above |
| Backlog writer, later | The `W2 R0` work backlog | `docs/work/<date>-w2-r0-system-packages/` | v2.0 shipped; PRD 20 as it then stands | One phase file for each phase in [01 Work Backlog Scope](01-work-backlog-scope.md) |
| Validator | Validators and link checks | None | Each writer | Validator results |

## MCP Strategy

- Preferred servers available: the `make-docs` CLI for validators and resource reads.
- Fallback plan if unavailable: read resource bodies with `make-docs resource read`, and check links by hand.

## Validation

- `make-docs run prd authority validate --target-root kits/make-blueprint` exits 0.
- Every relative link and anchor resolves, including the `../` links into the root docs.
- PRD 20 names no client data and no machine paths.
- Every candidate has one decision and a reason, and each promise reaches PRD 20, a work phase and evidence.

## Intended Follow-On

- Route: `prd-generation`
- Next step: The PRD changes are written (see [Departure From the Default Arc](#departure-from-the-default-arc)). When v2.0 ships, check PRD 20 against the v2.0 code, then write the `W2 R0` work backlog from [01 Work Backlog Scope](01-work-backlog-scope.md).
- Why: The PRD set already states system packages, so the backlog reads current authority.
- Coordinate Handoff: Carry `W2 R0` into the work backlog and its history records.
