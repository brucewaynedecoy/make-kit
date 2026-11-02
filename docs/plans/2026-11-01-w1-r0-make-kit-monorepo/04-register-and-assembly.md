---
title: "Phase 4: Register and Assembly"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P4"
---

# Phase 4: Register and Assembly

## Purpose

Write the shared root PRDs (index, register and glossary), connect them to the subject PRDs, and run the validation pass.

## Write Scope

- `docs/prd/00-index.md`, `docs/prd/03-open-questions-and-risk-register.md` and `docs/prd/04-glossary.md`.
- Fix-only edits to any file that validation flags.
- One sentence in [design section 9](../../designs/2026-10-30-make-kit-monorepo.md#9-temporary-workarounds-as-deferred-obligations) that points to the register records, and one sentence in the root map (outside the Make Docs block of `AGENTS.md` and `CLAUDE.md`) that links the register. Change nothing else in those files.
- Front matter: set `source.type` to `plan` and `source.path` to `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md`.
- Use the `prd-index.md`, `prd-risk-register.md` and `prd-glossary.md` templates, read with `make-docs resource read`.

## Register Rules

- Item shapes follow the [Output Contract](make-docs://system/contract/output-contract.md): numbered `###` headings, a `Status` / `Decision` / `Follow-Up` table, then `Question` or `Issue`, `Why it matters`, `Recommendation`, `To close`, and `Resolution` for closed items.
- `D-###` is for confirmed drift. The interview decisions are `Q-###` items with the numbers they had in the interview.
- `## Deferred Obligations` follows the [Deferred Obligation Contract](make-docs://system/contract/deferred-obligation-contract.md), with every required field.
- The Make Blueprint register has its own Q, R, D and O numbers. When a doc cites a number from either register, it names the register path too.
- Accepted dates: Q-001 to Q-022 on 2026-10-31; Q-023 to Q-026 on 2026-11-01.

## Open Questions

| Item | Title | Status | Decision | Owning PRD |
| --- | --- | --- | --- | --- |
| Q-001 | Step 0 Backlog Scope | Closed | The `W1 R0` backlog covers Step 0 only. The setup tool gets a later wave. | 01 |
| Q-002 | Switch Point Before the Core | Closed | Copy, CI, then the switch with 2.0.7 (same code). The core comes after. | 01, 08 |
| Q-003 | Copy Source and Freeze | Closed | Copy the latest release tag (today `v2.0.6`) with `git archive`. Freeze the old repository on copy day. Port unmerged branch work later. Close the old Dependabot pull requests. | 08 |
| Q-004 | Public Repository Before the Switch | Closed | Make `make-kit` public before the switch, after a scan. History: the owner first chose to stay private, then chose public on the same day. | 08 |
| Q-005 | One Root npm Workspace | Closed | One private root `package.json`, workspaces `packages/*` and `kits/*/packages/*`, one lockfile. Fix the `tsup` path. | 02 |
| Q-006 | Root PRD Set | Closed | `00` to `04`, then `05` to `08`. Root PRDs own the shared rules. R-001 and R-002 move up. A Make Blueprint change plan turns its shared rules into links. | 00 |
| Q-007 | Make Docs Changes in Step 0 | Closed | In Step 0: the core release, Make Docs on the core with tag-aware managed blocks and the uninstall fix, the link read command, and the O-fixes. Later: the handoff line, shared choices, the Persona move, the `.make/docs/` move and the Azure export. | 01 |
| Q-008 | Routing Check Method | Closed | The script method in design section 14. Naive UAT is not used. | 02 |
| Q-009 | Naive UAT Removal | Closed | Out of Step 0. After the copy, record it in `kits/make-docs/docs/prd/03-open-questions-and-risk-register.md`. A later Make Docs wave removes it. The owner notes that the capability came from a misunderstanding and would likely not be missed. | 01 |
| Q-010 | CI Layout and Release Tags | Closed | `make-docs-ci.yml`, one shared `publish-npm.yml`, package-named tags, digests in `.github/release-candidates/`. | 08 |
| Q-011 | Switch Test | Closed | The six steps in design section 3, with `2.0.7-rc.0` on `next` before `2.0.7` on `latest`. | 08 |
| Q-012 | Old Repository Freeze | Closed | Option B: the README banner, no `publish-npm.yml` or `dependabot.yml`, the Dependabot pull requests closed, and no archive. | 08 |
| Q-013 | Code Owners | Closed | Option B: the owner is the only code owner. | 08 |
| Q-014 | Nested-Project Fixes | Closed | One Make Docs plan with one work item and one nested-project test for each O-number. Ship in 2.1.0 after the switch and before the core. Then clean up. | 03 (`## Deferred Obligations`), 01 |
| Q-015 | Kit Conventions Source | Closed | Rules from the Make Docs code. One target rule and a listed gap where Make Docs differs. Each gap gets a `D-###` item. | 05 |
| Q-016 | Core Extraction Order | Closed | Slices from easy to hard, all tests green, kit names as inputs, Store schema version 6, core `0.1.0` with all eight areas, then Make Docs 2.2.0 with an exact pin. | 06 |
| Q-017 | Make Docs Store Identity | Closed | Keep `projectId` `831ddb50-b97a-47e2-9f2c-f491b27b8759`. Run `make-docs project checkout-move` on copy day. | 08 |
| Q-018 | License | Closed | One root MIT `LICENSE` for the whole stack. `kits/make-docs/LICENSE` stays. History: the owner first asked to remove MIT, then chose MIT for the whole stack. | 08 |
| Q-019 | Make Docs PRDs and Kit Conventions | Closed | The Make Docs PRDs keep their text and add a link to the root Kit Conventions PRD, in the nested-project fix plan. | 05 |
| Q-020 | Release of the Link Read Command | Closed | Ship it in 2.1.0 with the O-004 fix. | 01 |
| Q-021 | Step 0 Sequence | Closed | The 10 steps in design section 11. | 01 |
| Q-022 | Work Email in Commit History | Closed | Rewrite the `make-kit` commits to the owner's personal email before the repository goes public. Done on 2026-11-01. | 08 |
| Q-023 | Persona Entry Fields | Closed | `slug`, `label`, `description`, `primitive`, `kind`, `kits`. No `name` field. | 07 |
| Q-024 | Old Make Docs History | Closed | Leave the old history as it is. | 08 |
| Q-025 | Commit Email on the Maintainer Machine | Closed | A git `includeIf` rule gives the owner's personal projects folder the personal email. Done on 2026-11-01. No PRD owns it, because it is machine setup. | None |
| Q-026 | Old Commit IDs on GitHub | Closed | The owner deletes the GitHub repository and creates it again with the same name, while it holds only `main` and no issues, pull requests, CI runs or settings. The other option was to wait until the public step. Done on 2026-11-01: the new repository is private, and each of the 6 old commit IDs returns "No commit found" on GitHub. | 08 |
| Q-027 | Persona List Move for Existing Projects | Deferred | How a project that keeps Personas in `.make-docs/config.yaml` moves them to `.make/personas.yaml`. The setup tool wave answers it. | 07 |

## Rebuild Risks

| Item | Title | Source |
| --- | --- | --- |
| R-001 | Core Release Friction | Copied from the [Make Blueprint register](../../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md) with a note on its origin. The Make Blueprint change plan turns the kit item into a link. |
| R-002 | Two Core Versions in One Project | Same as R-001 |
| R-003 | Broken Release at the Switch Point | Design trade-offs. Mitigation: the release gate in PRD 08. |
| R-004 | Exposed History in the Public Repository | Design trade-offs. Mitigation: the scan, Q-022 and Q-026. |
| R-005 | Agents Pick the Wrong Project | Design trade-offs. Mitigation: the root map and the routing check. |
| R-006 | Make Docs Tests That Assume the Repository Root | Design trade-offs. Mitigation: copy-day test fixes. |
| R-007 | Urgent Fix During the Freeze | Q-003. Mitigation: fix the old repository and port the fix by hand. |

Add any risk that a subject worker reports.

## Confirmed Drift

One `D-###` item for each gap in the Kit Conventions worker's final report, in the order of the rule areas in [Phase 2](02-kit-conventions.md#rule-areas). Each item cites its `v2.0.6` anchor and names the Make Docs fix and its release, or the accepted exception.

## Deferred Obligations

Take O-001 to O-005 from [design section 9](../../designs/2026-10-30-make-kit-monorepo.md#9-temporary-workarounds-as-deferred-obligations).

| Field | Value for O-001 to O-005 |
| --- | --- |
| Status | `Deferred` |
| Source authority | Design section 9, the root map, and Q-014 |
| Owner | The repository owner |
| Target coordinate | The Make Docs nested-project fix plan in `kits/make-docs/docs/plans/`, which sets its own coordinate, for release 2.1.0 |
| Future trigger | Make Docs 2.1.0 ships with the fix |
| Dependencies | Copy day and the switch point |
| Acceptance exit criteria | The fix ships with a nested-project test. The matching item is gone from the root map, from kit setup and from the validation steps. The record is `Fulfilled` with its version and proof command. For O-005, `make-docs run work backlog snapshot --target-root kits/make-blueprint` exits 0 from the repository root without `GIT_DIR`. |
| Related requirements | `02-architecture-overview.md` (docs roots), `05-kit-conventions.md` |

## Index and Glossary

- `00-index.md`: reading order `01`, `02`, `05`, `06`, `07`, `08`, then `03` and `04`. Audience paths for `maintainer` and `user`. Links to each kit's own PRD index: [Make Blueprint](../../../kits/make-blueprint/docs/prd/00-index.md) now, and `kits/make-docs/docs/prd/00-index.md` as code text until copy day.
- `04-glossary.md`: the terms from the subject workers' reports, plus kit, reference kit, core, setup tool, docs root, root map, copy day, switch point, release candidate, dist-tag, trusted publisher, provenance and routing check.

## Validation Pass

1. `make-docs run prd authority validate --target-root .` from the repository root exits 0.
2. `make-docs run performance evidence validate --target-root .` exits 0.
3. The `paths_validate` MCP tool, with the repository root as `targetRoot`, reports no findings for `docs/prd/`.
4. A script resolves every relative link and anchor in `docs/prd/`, this plan and the design, including `../` links into `kits/make-blueprint/docs/` (O-004).
5. Each Human Experience promise in the [overview](00-overview.md#human-experience-propagation) has its owning PRD text.
6. Each Q-number in the table above appears in its owning PRD.

## Exit Criteria

- The validation pass has no failures, and the worker's report lists each check with its result.
- The owner reviews the root PRDs and accepts them.
