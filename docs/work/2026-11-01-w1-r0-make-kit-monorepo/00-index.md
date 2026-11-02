---
title: "Make Kit Step 0 Work Backlog"
kind: "work"
status: "active"
coordinate: "W1 R0"
follow_on:
  route: "implementation-loop"
  next_prompt: ".make-docs/system/references/execution-workflow.md"
  why: "The backlog is the implementation queue derived from the plan and PRD contract."
  coordinate_handoff: "Carry this backlog's W/R coordinate into phase history records and commits, adding the active P coordinate for each phase."
source:
  type: "prd"
  path: "docs/prd/00-index.md"
---

# Make Kit Step 0 Work Backlog

## Purpose

This backlog is the implementation queue for Step 0 of the `make-kit` monorepo, the repo-wide release scope in [01 Product Overview, Release Scope](../../prd/01-product-overview.md#release-scope). At the end of Step 0, Make Docs lives in `kits/make-docs/`, releases from this repository's CI under its unchanged npm name, and runs on the published shared core.

Sources:

- Source design: [Make Kit Monorepo](../../designs/2026-10-30-make-kit-monorepo.md), with its [order of work](../../designs/2026-10-30-make-kit-monorepo.md#11-order-of-work) and its [Human Experience Intent](../../designs/2026-10-30-make-kit-monorepo.md#human-experience-intent).
- Source plan: [Make Kit Monorepo Baseline Plan](../../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md), coordinate `W1 R0`, whose [Work Backlog Scope](../../plans/2026-11-01-w1-r0-make-kit-monorepo/06-work-backlog-scope.md) phase fixed what this backlog covers.
- Source PRDs: the root PRD set from the [PRD index](../../prd/00-index.md): [01 Product Overview](../../prd/01-product-overview.md), [02 Architecture Overview](../../prd/02-architecture-overview.md), [03 Open Questions and Risk Register](../../prd/03-open-questions-and-risk-register.md), [04 Glossary](../../prd/04-glossary.md), [05 Kit Conventions](../../prd/05-kit-conventions.md), [06 Shared Core](../../prd/06-shared-core.md), [07 Setup Tool and Shared Files](../../prd/07-setup-tool-and-shared-files.md) and [08 Build and Release](../../prd/08-build-and-release.md).

The PRDs are the authority. The plan fixed the scope and the phase order, but it is not a requirement source. Where a phase file and a PRD differ, the PRD wins, and the gap goes to the root register through the PRD change process.

Out of scope: the `make-kit` setup tool and the shared `.make/` files, which get a later repo-wide wave ([Q-001](../../prd/03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope)); the later Make Docs scope in [01 Product Overview, Release Scope](../../prd/01-product-overview.md#release-scope); and Make Blueprint v2.0. Steps 1 and 2 of the Step 0 sequence, the root docs and this backlog, are planning work, so the backlog starts at copy day ([Q-021](../../prd/03-open-questions-and-risk-register.md#q-021-step-0-sequence)).

Read the phase files in order, from 01 to 08. Each phase file names its owning PRDs, its Human Experience outcome, its four testing decisions and its stages in dependency order. Task IDs start at `t1` in each file, so a task is cited as `w1 r0 p<phase> t<task>`. Acceptance IDs take the form `A<phase><nn>`, such as `A301`, and are unique across the backlog.

## Human Experience Trace

Authority: the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md), with the source design's [Human Experience Intent](../../designs/2026-10-30-make-kit-monorepo.md#human-experience-intent) as the local outcome authority and the plan's [Human Experience Propagation](../../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md#human-experience-propagation) as the mapping. Impact is `direct`. The owning PRDs list the promises in [01 Product Overview, Experience Promises](../../prd/01-product-overview.md#experience-promises). Each implementation gate lists the acceptance IDs that must pass before the promise counts as kept.

| Impact or promise | Source design and plan | Owning PRD or preserved boundary | Work phase | Evidence source or selected testing type | Implementation gate | Accepted obligation, if any |
| --- | --- | --- | --- | --- | --- | --- |
| An agent that starts at the repository root can tell which project a task belongs to and reaches that project's routers and docs | [Design](../../designs/2026-10-30-make-kit-monorepo.md#human-experience-intent); [W1 R0 plan](../../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md#human-experience-propagation) | [02 Architecture Overview, Several Docs Roots](../../prd/02-architecture-overview.md#several-docs-roots) and [Routing Check](../../prd/02-architecture-overview.md#routing-check); [05 Kit Conventions, Routers and Managed Blocks](../../prd/05-kit-conventions.md#routers-and-managed-blocks) | [04 Routing Check Baseline](04-routing-check-baseline.md); [06 Nested-Project Fixes](06-nested-project-fixes.md) | The routing check in `scripts/routing-check/`: a baseline after copy day and a second run after the fixes, in `docs/assets/maintainer/routing-check/`. Recorded under Automated Implementation Testing. | Phase 4: `A404` to `A406`. Phase 6: `A617` to `A619`. Phase 1 adds the root map row in `A111`. | None |
| A person who set up one kit sees the earlier agent-tool choices already selected for another kit | [Design](../../designs/2026-10-30-make-kit-monorepo.md#human-experience-intent); [W1 R0 plan](../../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md#human-experience-propagation) | [07 Setup Tool and Shared Files](../../prd/07-setup-tool-and-shared-files.md#shared-setup-choices) | None in Step 0. The setup tool wave owns it ([Q-001](../../prd/03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope)). | Planned for that wave: an install test with two kits | None in this backlog. Phase 8 checks the routing in `A803`. | None |
| A person runs `make-kit setup` once and gets each chosen kit set up; each kit still sets up alone | [Design](../../designs/2026-10-30-make-kit-monorepo.md#human-experience-intent); [W1 R0 plan](../../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md#human-experience-propagation) | [07 Setup Tool and Shared Files](../../prd/07-setup-tool-and-shared-files.md#make-kit-setup) | None in Step 0. The setup tool wave owns it ([Q-001](../../prd/03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope)). | Planned for that wave: an install test with two kits | None in this backlog. Phase 8 checks the routing in `A803`. | None |
| A Make Docs user sees no change to the npm package name or the install commands after the switch point | [Design](../../designs/2026-10-30-make-kit-monorepo.md#human-experience-intent); [W1 R0 plan](../../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md#human-experience-propagation) | [08 Build and Release, Switch Point](../../prd/08-build-and-release.md#switch-point) | [05 Switch Point](05-switch-point.md) | Automated Implementation Testing: the tarball file-list and content compare of 2.0.7 with 2.0.6, and the install check from npm on Linux, macOS and Windows | Phase 5: `A502`, `A508` and `A509`. Phase 1 prepares the package in `A108` and `A109`. | None |
| A user who installs from `latest` gets no version from the new release path until that path has passed on `next` | [Design](../../designs/2026-10-30-make-kit-monorepo.md#human-experience-intent); [W1 R0 plan](../../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md#human-experience-propagation) | [08 Build and Release, Release Gate](../../prd/08-build-and-release.md#release-gate) | [05 Switch Point](05-switch-point.md). The same gate runs again in [06 Nested-Project Fixes](06-nested-project-fixes.md) and [07 Shared Core](07-shared-core.md) ([Q-032](../../prd/03-open-questions-and-risk-register.md#q-032-release-gate-scope)). | Automated Implementation Testing: `2.0.7-rc.0` on `next` with the install check, then `2.0.7` on `latest` with the install check again | Phase 5: `A505` to `A507`. Later uses: `A608`, `A718` and `A722`. | None |
| Each temporary workaround stays visible, numbered and owned until it is removed | [Design](../../designs/2026-10-30-make-kit-monorepo.md#9-temporary-workarounds-as-deferred-obligations); [W1 R0 plan](../../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md#human-experience-propagation) | [03 Open Questions and Risk Register, Deferred Obligations](../../prd/03-open-questions-and-risk-register.md#deferred-obligations); [02 Architecture Overview, Several Docs Roots](../../prd/02-architecture-overview.md#several-docs-roots) | [06 Nested-Project Fixes](06-nested-project-fixes.md) | Review: each fixed O-number is `Fulfilled` with its version and proof command, and its root map item is gone | Phase 6: `A613` to `A616`. Phase 8: `A802`. | O-001 to O-005 |

Phase 8 rolls up the Human Experience Review of all six promises in `A808`.

## Phase Map

| File | Purpose |
| --- | --- |
| [01 Copy Day](01-copy-day.md) | Extracts `v2.0.6` into `kits/make-docs/`, builds one root workspace and lockfile, fixes the build, tests and repository links, keeps the Make Docs `projectId`, and records the Make Docs register items. |
| [02 Go Public](02-go-public.md) | Adds the root `LICENSE`, `CODEOWNERS` and Dependabot config, scans the files and the history, checks the old commit IDs again, makes the repository public and adds the rulesets. |
| [03 CI](03-ci.md) | Builds `make-docs-ci.yml`, the shared `publish-npm.yml` and the install check, removes the copied workflows and rewrites `RELEASING.md`, with no publish. |
| [04 Routing Check Baseline](04-routing-check-baseline.md) | Builds `scripts/routing-check/`, runs the first check and records each miss. |
| [05 Switch Point](05-switch-point.md) | Releases Make Docs 2.0.7 through the release gate from this repository, then freezes the old repository. |
| [06 Nested-Project Fixes](06-nested-project-fixes.md) | Writes and carries out the Make Docs fix plan for O-001 to O-005, the link read command and the Kit Conventions links, releases 2.1.0, removes the workarounds and runs the second routing check. |
| [07 Shared Core](07-shared-core.md) | Builds `packages/core/` in slices, publishes core `0.1.0`, and releases Make Docs 2.2.0 on the core with the exact pin, tag-aware managed blocks and the uninstall fix. |
| [08 Closeout](08-closeout.md) | Audits every Q, R, D and O item, checks that Make Blueprint phase `01-shared-core-adoption` can start, and writes the closeout history record. |

## Phase Exit Criteria

Each phase names its owning PRDs and its exit criteria. A phase closes only when its exit criteria and the acceptance criteria of its stages pass.

| Phase | Owning PRDs | Exit criteria |
| --- | --- | --- |
| 01 Copy Day | [02](../../prd/02-architecture-overview.md), [05](../../prd/05-kit-conventions.md), [08](../../prd/08-build-and-release.md) | `npm ci`, the build and all Make Docs tests pass at the root. `npm pack --dry-run` for `@brucewaynedecoy/make-docs` lists the same files as 2.0.6. `make-docs run prd authority validate --target-root kits/make-docs` exits 0. |
| 02 Go Public | [08](../../prd/08-build-and-release.md) | The scan report has no findings. Each old commit ID returns "No commit found" on GitHub. The repository is public with the rulesets on. |
| 03 CI | [08](../../prd/08-build-and-release.md) | `make-docs-ci.yml` passes on Linux, macOS and Windows on a pull request. |
| 04 Routing Check Baseline | [02](../../prd/02-architecture-overview.md) | `docs/assets/maintainer/routing-check/<date>-baseline.md` holds 9 tasks × 2 tools × 2 runs, each marked `pass` or `miss`. |
| 05 Switch Point | [08](../../prd/08-build-and-release.md) | `npm view @brucewaynedecoy/make-docs dist-tags` shows `latest: 2.0.7`, with provenance from `make-kit`. The old repository has the banner and no publish workflow. |
| 06 Nested-Project Fixes | [02](../../prd/02-architecture-overview.md), [03](../../prd/03-open-questions-and-risk-register.md), [05](../../prd/05-kit-conventions.md), [08](../../prd/08-build-and-release.md) | O-001 to O-005 are `Fulfilled` with their version and proof command. The second routing check result is recorded and compared with the baseline. |
| 07 Shared Core | [06](../../prd/06-shared-core.md), [05](../../prd/05-kit-conventions.md), [08](../../prd/08-build-and-release.md) | `npm view @brucewaynedecoy/make-core version` shows `0.1.0`. Make Docs 2.2.0 is on `latest` and depends on exactly `0.1.0`. The Store stays at schema version 6. |
| 08 Closeout | [01](../../prd/01-product-overview.md), [03](../../prd/03-open-questions-and-risk-register.md) | No Step 0 item is open without an owner and a target. Capability status is stated separately from phase status. |

## Evidence Decisions

Each phase records the four testing decisions in its own file. Human Experience Review stays a separate agent-owned review lens, not a fifth testing type.

| Phase | Automated Implementation Testing | Performance Testing | Guided Progress Review | Unassisted Goal Testing | Human Experience Review |
| --- | --- | --- | --- | --- | --- |
| 01 Copy Day | active: root build and tests, lockfile compare, package file-list compare | not-needed-now | not-needed-now | not-needed-now | Root map row for `kits/make-docs/` |
| 02 Go Public | active: file and history scan, commit-email check, old commit ID checks | not-needed-now | not-needed-now | not-needed-now | Public repository root page |
| 03 CI | active: pull request run on three operating systems, publish tag-check fixtures, install check on 2.0.6 | not-needed-now | not-needed-now | not-needed-now | Pull request check list and `RELEASING.md` |
| 04 Routing Check Baseline | active: grader tests and the 36-run baseline | not-needed-now | not-needed-now | not-needed-now, by [Q-008](../../prd/03-open-questions-and-risk-register.md#q-008-routing-check-method) | Routing promise, from the transcripts |
| 05 Switch Point | active: tarball compare and the release gate for 2.0.7 | not-needed-now | not-needed-now | not-needed-now | The two npm promises, from the npm page and the install logs |
| 06 Nested-Project Fixes | active: nested-project tests, release gate for 2.1.0, proof commands, second routing check | not-needed-now | not-needed-now | not-needed-now | Routing promise and workaround promise |
| 07 Shared Core | active: slice gates, Store test, uninstall-fix tests, release gate for core `0.1.0` and 2.2.0 | not-needed-now | not-needed-now | not-needed-now | Preserved boundary and the two 2.2.0 fixes |
| 08 Closeout | active: final validation commands | not-needed-now | not-needed-now | not-needed-now | Roll-up of all six promises |

No performance candidate exists for Step 0. The plan's [Performance Evidence Plan](../../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md#performance-evidence-plan) records none, so no phase records performance lifecycle fields.

The central evidence report of this backlog is `evidence.md` in this folder. It does not exist yet. The first phase that retains evidence creates it and adds a link to it here. Phase 8 checks the link in `A808`.

## Owner Gates

Each task below needs the owner's clear yes in chat, each time, before an agent acts. The task text marks each one with "Owner gate". Reading the local clone with commands such as `git -C ../make-docs archive v2.0.6` or `git -C ../make-docs show` is not a change and needs no gate.

| Phase | Tasks | What the gate covers |
| --- | --- | --- |
| 01 Copy Day | None | The phase reads the local clone and changes no file in it. |
| 02 Go Public | `t9` (only when a history rewrite is needed), `t11`, `t12`, `t13` | A force push to `main`, the repository visibility, the `main` ruleset and the release tag ruleset |
| 03 CI | None | No publish, no npm setting and no GitHub setting changes |
| 04 Routing Check Baseline | None | |
| 05 Switch Point | `t6`, `t7`, `t8`, `t11` (only when the release candidate fails), `t13`, `t14`, `t18`, `t19`, `t20` | The trusted publisher of `@brucewaynedecoy/make-docs`, the publishes and stage approvals of `2.0.7-rc.0` and `2.0.7`, and each change to the old `make-docs` repository |
| 06 Nested-Project Fixes | `t13`, `t14`, `t17`, `t18` | The publishes and stage approvals of `2.1.0-rc.0` and `2.1.0` |
| 07 Shared Core | `t7` (only for an urgent fix), `t26`, `t28`, `t29`, `t31`, `t32`, `t33`, `t37`, `t38`, `t40`, `t41` | A `2.1.<n>` patch release, the trusted publisher of `@brucewaynedecoy/make-core`, the publishes and stage approvals of core `0.1.0-rc.0`, `0.1.0`, `2.2.0-rc.0` and `2.2.0`, and the npm security setting of the core |
| 08 Closeout | None | |

Phase 5 `t4` is also an owner decision: the owner accepts each 2.0.7 tarball difference that is not a version or a repository link ([R-008](../../prd/03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206)).

## Open Items That Gate Phases

| Item | Gates | Where it closes |
| --- | --- | --- |
| [Q-034 CI for the Core and the Setup Tool](../../prd/03-open-questions-and-risk-register.md#q-034-ci-for-the-core-and-the-setup-tool) | Any CI work in Phase 7. It does not block Phase 3. | [Phase 7](07-shared-core.md) `t1` |
| [Q-031 Store Version Counter for Base and Kit Tables](../../prd/03-open-questions-and-risk-register.md#q-031-store-version-counter-for-base-and-kit-tables) | The Store slice of the core work, Phase 7 `t20` | [Phase 7](07-shared-core.md) `t19` |
| [Q-033 First Trusted Publish of a New Package](../../prd/03-open-questions-and-risk-register.md#q-033-first-trusted-publish-of-a-new-package) | The core trusted-publisher setup and the publish of core `0.1.0`, Phase 7 `t26` onward | [Phase 7](07-shared-core.md) `t25` |

## Usage Notes

- Read phases in order unless otherwise noted.
- Keep phase files dependency-ordered.
- Every phase file must include `## Source PRD Docs`.
- Link every phase back to the relevant PRD docs.
- Keep each accepted Human Experience promise traceable through its owning phase, evidence decision, implementation gate, and any accepted obligation.
- When this backlog retains evidence for acceptance or review, create or update its central `evidence.md` report and add a relative link to it in this index. Follow the Acceptance-Case Evidence Retention section of the coverage pass contract (`make-docs://system/contract/coverage-pass-contract.md`). The report explains the findings and links supporting evidence, including evidence already stored elsewhere. Do not create an empty report or link to a report that does not exist.
- Keep the obligation and scenario inventory below current when a phase changes an obligation or activates Unassisted Goal Testing.
- Each phase uses one branch and one pull request ([08 Build and Release, Rulesets and Ownership](../../prd/08-build-and-release.md#rulesets-and-ownership)). Commit only when the owner asks.
- Until [Phase 6](06-nested-project-fixes.md) marks O-001 to O-005 `Fulfilled`, use the workarounds in the root map: run root commands from the repository root with `--target-root .`; run kit commands with `--target-root kits/<kit>`; pass the kit folder as `targetRoot` on each Make Docs MCP call for a kit; check `../` links between projects with a script that resolves each relative link and heading anchor; and check backlogs with `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root <project>`. A valid backlog exits 0, and its only diagnostic is the information code `BACKLOG-VAL-010`.
- Kit work stays in the kit project. Make Docs plans, backlogs and PRD changes go in `kits/make-docs/docs/`, and Make Blueprint changes go through the Make Blueprint project. Each doc that cites a register number names the register path with it, because the Make Blueprint register has its own numbers.
- No doc in this repository holds a local home-folder path, an email address, a secret or a client term. Write `<user-home>` where a home path is needed.

## Obligations, Scenarios, And Findings Inventory

| Item | Source | Carrying phase | Expected phase status | Expected capability status |
| --- | --- | --- | --- | --- |
| `O-001` Upward project search stops at the nearest project | [Root register](../../prd/03-open-questions-and-risk-register.md#o-001-upward-project-search-stops-at-the-nearest-project); its code cause is [D-024](../../prd/03-open-questions-and-risk-register.md#d-024-two-project-root-searches) | Used in Phases 1 to 5. Fixed and fulfilled in [Phase 6](06-nested-project-fixes.md) (`A604`, `A613` to `A616`). Audited in Phase 8 (`A802`). | Phases 1 to 5 close with the workaround in place. | Partial until Phase 6, then complete: `Fulfilled` with 2.1.0 and its proof command. |
| `O-002` Commands resolve the nearest project | [Root register](../../prd/03-open-questions-and-risk-register.md#o-002-commands-resolve-the-nearest-project) | Used in Phases 1 to 5. Fixed and fulfilled in Phase 6. Audited in Phase 8. | Phases 1 to 5 close with the workaround in place. | Partial until Phase 6, then complete. [D-023](../../prd/03-open-questions-and-risk-register.md#d-023-target-flags-have-different-names) stays a separate open drift item. |
| `O-003` MCP server resolves the project from a path | [Root register](../../prd/03-open-questions-and-risk-register.md#o-003-mcp-server-resolves-the-project-from-a-path) | Used in Phases 1 to 5. Fixed and fulfilled in Phase 6. Audited in Phase 8. | Phases 1 to 5 close with the workaround in place. | Partial until Phase 6, then complete. |
| `O-004` Link checks cover links between projects | [Root register](../../prd/03-open-questions-and-risk-register.md#o-004-link-checks-cover-links-between-projects) | Used in every validation task of Phases 1 to 6. Fixed with the link read command and fulfilled in Phase 6. Audited in Phase 8. | Phases 1 to 5 close with the script check in place. | Partial until Phase 6, then complete. |
| `O-005` Backlog snapshot works below the git root | [Root register](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root) | Used in every validation task of Phases 1 to 6. Fixed and fulfilled in Phase 6 (`A613`). Audited in Phase 8. | Phases 1 to 5 close with the `GIT_DIR=/dev/null` form. | Partial until Phase 6, then complete: `make-docs run work backlog snapshot --target-root kits/make-blueprint` exits 0 without `GIT_DIR`. |
| Make Blueprint register `O-001` Confirm Make Docs links in project check | [Make Blueprint register](../../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check). This is not a root obligation. | Phase 6 `t20` tells the Make Blueprint project that its trigger, the link read command, shipped in 2.1.0. | Not owned by this backlog. | The Make Blueprint project decides its status. |
| Unassisted Goal Testing scenarios | None | None | `not-needed-now` in every phase | No `NUAT-###` scenario is activated. |
| Findings | The routing-check misses of Phases 4 and 6 | Each miss becomes a root register item with an owner. | None open without an owner at Phase 8. | Recorded in the Phase 8 status table. |

## Intended Follow-On

This handoff is advisory-default-but-overridable: it is authoritative unless the user explicitly overrides it, and it is not a gate or precondition.

- Route: `implementation-loop`
- Next step: Start with the first applicable phase in this backlog, [01 Copy Day](01-copy-day.md), and continue phase-by-phase.
- Why: The backlog is the implementation queue derived from the plan and PRD contract.
- Coordinate Handoff: Carry this backlog's W/R coordinate into phase history records and commits, adding the active P coordinate for each phase.
