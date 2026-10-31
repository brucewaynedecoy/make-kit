---
title: "Phase 7: Work Backlog Scope"
kind: "plan"
status: "draft"
coordinate: "W1 R1 P7"
---

# Phase 7: Work Backlog Scope

## Purpose

No Make Blueprint work backlog exists yet. This phase fixes what the first backlog covers, so it reads the updated PRDs and not the `W1 R0` phase list alone.

## Backlog Decision

- Backlog type: a full v2.0 backlog, not a delta. A delta needs an earlier backlog to change, and none exists.
- Path: `docs/work/<generation-date>-w1-r1-make-blueprint-v2/`, with `00-index.md` and one file per phase.
- Prompt: `make-docs://system/prompt/prd-to-work-full-prd.prompt.md`, read with `make-docs resource read`.
- Start condition: phase [06 Shared Surfaces and Validation](06-shared-surfaces-and-validation.md) passes. The backlog cites the updated PRDs as its authority, never this plan.

## Phase Map for the Backlog

System packages (Q-085 to Q-095) add three small items in place: phase `02-cli-and-packaging` reserves the `run package` domain beside `serve`, phase `04-record-types` registers the reserved `origin` field, and phase `09-v1-import-and-release` keeps the import planner and writer apart from the v1 reader. The rest of the package work belongs to `W2 R0` ([plan](../2026-10-31-w2-r0-system-packages/00-overview.md)).

The backlog keeps the `W1 R0` phase numbers, because the register and the PRDs name work phases by those numbers. For each phase, take the deliverables, testing decisions and exit criteria from the matching `W1 R0` phase file as changed by this table; the PRDs win wherever they differ. The backlog now exists at [2026-10-30-w1-r1-make-blueprint-v2](../../work/2026-10-30-w1-r1-make-blueprint-v2/00-index.md), and the `W1 R0` plan is archived at `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/`. Phase 01 changes subject: Step 0 is now repo-wide work in the [Make Kit Monorepo](../../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design, so this backlog only adopts the published core.

| Phase | Scope in `W1 R0` | Scope changes from the owner's decisions |
| --- | --- | --- |
| `01-shared-core-adoption` | Step 0: move shared code into `packages/core` | Becomes adoption only: pin one exact core version (Q-013), use the core's managed blocks, handoff refresh (Q-002), broken-tag stop (Q-005), shared `.make/config.yaml` with the optional project `name` (Q-060, D-011) and the shared `.make/personas.yaml` (Q-072). Depends on the repo-wide Step 0 and setup-tool work. |
| `02-cli-and-packaging` | CLI skeleton, `setup`, routers, resources, MCP shell, signed builds | `setup remove` and `uninstall` split (Q-003, Q-004); `update` updates only the tool (Q-009); exit codes (Q-010); single-file targets (Q-006); instruction files only for selected agent tools (Q-016); reserved `serve` command (Q-049). |
| `03-storage-and-identity` | Storage interface, file backend, `id`, `ref`, `check`, locks, journal, index | 8-character `id` (Q-018); first-created record keeps a clashing `ref` (Q-019); per-checkout lock plus record version checks (Q-020); working state in `~/.make/blueprint/` (Q-017); no delete (Q-021); index text search for candidates and similarity (Q-067); the content version that marks keep (Q-076). |
| `04-record-types` | The 11 v2.0 record types, facets, links, Make Docs link checks | Twelve types with `integration` (Q-073); capability and setting-requirement detail fields (Q-064); `owners`, `stakeholders` and `audience` pointing to the shared people and roles file (Q-070, Q-072); `requirement_marks` on fit-gap records (Q-066, Q-068); placement `integrations` (Q-057); doc links on any type (Q-023); Make Docs link-check skip under obligation O-001 (Q-024); built-in code lists and the `lists.*` settings (Q-078); the `organization` entry kind and the slug checks (Q-077). |
| `05-intake-and-conversion` | Source records, location types, converters, anchors, change detection | Source git levels `all`, `converted` and `none` with a managed `.gitignore` (Q-028); Git LFS at 50 MB (Q-029); sources `active` with no review (Q-030); anchor marker and numbering (Q-026, Q-027); CSV files per extracted table with table, row, column and cell links (Q-061); one CSV writer shared with exports (Q-038); the complex-PDF agent route with page batches, text-layer checks and review (Q-080); pattern ignore rules with the hand-copy test (R-024); the `source-unregistered` check (Q-082). |
| `06-extraction-and-review` | Extraction records, `run extract next`, duplicate hints, review | Pending changes that fix a fact in place, designed before the phase ends (Q-032); duplicate hints on `run record create` (Q-033); second reviewer rule (Q-031); extraction of current integrations (Q-073); an approved persona record adds its entry to the shared file (Q-072); review of agent conversions (Q-080); reviewer slugs (Q-077); no second-reviewer rule for agent conversions (Q-081). |
| `07-analysis-and-exports` | Model clean-up, comparisons, fit-gap, placement, exports | The fit-gap method with `run compare next`, requirement marks, the verdict table, candidates, out-of-date marks and consistency checks (Q-065 to Q-068); analysis drafts (Q-034); comparison scope (Q-035); native fits (Q-036); planned integrations and the coverage read of unreplaced current integrations (Q-073); the full export set built from records with golden-file tests (Q-037 to Q-040, Q-058, Q-062 to Q-064, Q-069, Q-070, Q-073); every capability a mark names is in `covering_capabilities` (Q-079). |
| `08-mcp-skills-and-status` | MCP profiles, seven stage skills, status | Review tools also in `analyze` (Q-041); eighth skill `blueprint-report`, and `blueprint-compare` only scores (Q-042); `project status` shows the project `name` (D-011); ninth skill `blueprint-convert` (Q-080). |
| `09-v1-import-and-release` | v1 import, locked-down checks, release | Bulk-extract files, converted text, refs, defaults and the MCP tool (Q-043 to Q-047); v1 record `owners` into `owners` and the v1 owner list into the shared file (Q-070, Q-072); `instance.name` into the project `name` (D-011). Client C starts on v1 and is the real import test (Q-071); an entry for every owner slug, and the owner kind mapping (Q-077). |

## Deferred Scope

The backlog leaves out the ten deferred register items (Q-050 to Q-056, Q-059, Q-074 and Q-075) and v2.2, v2.3 and v3 scope. It keeps obligation O-001 open until Make Docs ships its link-check read command.

## Exit Criteria

- Every backlog phase cites the updated PRDs that constrain it.
- Every task uses `- [ ] t1: ...` checkbox items, and acceptance criteria use plain bullets.
- Each Human Experience promise in the overview maps to the backlog phase and evidence named there.
