---
title: "Phase 6: Nested-Project Fixes"
kind: "work"
status: "active"
coordinate: "W1 R0 P6"
source:
  type: "prd"
  path: "docs/prd/03-open-questions-and-risk-register.md"
---

# Phase 6: Nested-Project Fixes

## Purpose

This phase ships Make Docs 2.1.0 with the fixes for the five nested-project workarounds, O-001 to O-005, and then removes the workarounds ([Q-014](../../prd/03-open-questions-and-risk-register.md#q-014-nested-project-fixes)). The same release ships the link read command that Make Blueprint needs ([Q-020](../../prd/03-open-questions-and-risk-register.md#q-020-release-of-the-link-read-command)) and the links from the Make Docs PRDs to [05 Kit Conventions](../../prd/05-kit-conventions.md) ([Q-019](../../prd/03-open-questions-and-risk-register.md#q-019-make-docs-prds-and-kit-conventions)). It is step 8 of the Step 0 sequence ([Q-021](../../prd/03-open-questions-and-risk-register.md#q-021-step-0-sequence)).

The phase depends on [Phase 5](05-switch-point.md). Each O-number lists copy day and the switch point as its dependencies, and 2.1.0 ships after the switch and before the core ([01 Product Overview, Release Scope](../../prd/01-product-overview.md#release-scope)).

## Overview

The fixes are Make Docs work, so their plan and backlog live in the Make Docs project, in `kits/make-docs/docs/`, with one work item and one nested-project test for each O-number ([Q-014](../../prd/03-open-questions-and-risk-register.md#q-014-nested-project-fixes)). The Make Docs project sets its own coordinate for that plan. This phase writes that plan and backlog, carries them out, and releases 2.1.0 through the release gate ([08 Build and Release, Release Gate](../../prd/08-build-and-release.md#release-gate)).

After the owner installs 2.1.0, the phase removes each workaround from the root map, from kit setup and from the validation steps, and marks each O-number `Fulfilled` with its version and its proof command ([02 Architecture Overview, Several Docs Roots](../../prd/02-architecture-overview.md#several-docs-roots)). Then it runs the routing check a second time with the same 9 tasks and compares each task with the baseline ([02 Architecture Overview, Routing Check](../../prd/02-architecture-overview.md#routing-check)).

Each obligation becomes `Fulfilled` only when all four parts of its Acceptance exit criteria hold: its fix ships in 2.1.0 with a nested-project test, its proof command passes without the workaround, its item is gone from the root map, kit setup and the validation steps, and its record states the version and the proof command.

| Obligation | Fix in 2.1.0 | Proof command without the workaround | Root map item removed |
| --- | --- | --- | --- |
| [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-upward-project-search-stops-at-the-nearest-project) | One project-root search that stops at the nearest `.make-docs/config.yaml` ([D-024](../../prd/03-open-questions-and-risk-register.md#d-024-two-project-root-searches)) | The O-001 nested-project test, and a Make Docs command run inside a nested project with no `docs/work/` folder that reports that nested project | Item 1 |
| [O-002](../../prd/03-open-questions-and-risk-register.md#o-002-commands-resolve-the-nearest-project) | Every command resolves the nearest project from the working folder | The O-002 nested-project test, and a Make Docs command run inside `kits/make-blueprint/` with no target flag that reports `kits/make-blueprint` | Item 2 |
| [O-003](../../prd/03-open-questions-and-risk-register.md#o-003-mcp-server-resolves-the-project-from-a-path) | The MCP server resolves the project from a path argument or the nearest project config | The O-003 nested-project test, and a Make Docs MCP call with a path inside a kit and no `targetRoot` that reports the kit project | Item 3 |
| [O-004](../../prd/03-open-questions-and-risk-register.md#o-004-link-checks-cover-links-between-projects) | The link checks validate links that land in another known project, on the same link code as the link read command | The O-004 nested-project test, and the Make Docs link check on this repository that checks each `../` link between projects | Item 4 |
| [O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root) | The backlog snapshot takes last-updated times from git history above the project | `make-docs run work backlog snapshot --target-root kits/make-blueprint` exits 0 from the repository root without `GIT_DIR` | Item 5 |

Until the cleanup in Stage 4, every Make Docs command for a kit in this phase uses `--target-root kits/<kit>`, every Make Docs MCP call for a kit passes the kit folder as `targetRoot`, `../` links are checked by script, and backlog checks use the `GIT_DIR=/dev/null` form.

Owner gates in this phase: `t13`, `t14`, `t17` and `t18`. Each one is an npm publish. Only the owner can create a release tag, under the tag ruleset from Phase 2.

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `direct`. Two promises name this phase. The first is "An agent that starts at the repository root can tell which project a task belongs to and reaches that project's routers and docs", owned by [02 Architecture Overview, Several Docs Roots](../../prd/02-architecture-overview.md#several-docs-roots) and [05 Kit Conventions](../../prd/05-kit-conventions.md#routers-and-managed-blocks). The second is "Each temporary workaround stays visible, numbered and owned until it is removed", owned by [Deferred Obligations](../../prd/03-open-questions-and-risk-register.md#deferred-obligations) and [02 Architecture Overview, Several Docs Roots](../../prd/02-architecture-overview.md#several-docs-roots). The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind both.
- Intended human outcome: an agent at the repository root reads a root map with no numbered workaround list, because Make Docs 2.1.0 resolves the nearest project, checks links between projects and takes backlog times correctly below the git root. Until each fix is installed, its workaround stays in the root map with its O-number.
- Human-facing surface or indirect effect: the root map in `AGENTS.md` and `CLAUDE.md`, the O-001 to O-005 records, the Make Docs CLI and MCP results in a nested project, and the routing check results.
- Implementation work: Stage 1 writes the Make Docs fix plan and backlog. Stage 2 carries out the fixes with their nested-project tests. Stage 3 releases 2.1.0. Stage 4 removes the workarounds and fulfills the obligations. Stage 5 runs the second routing check.
- Evidence source or testing type selected under current authority: for the workaround promise, review: each fixed O-number is `Fulfilled` with its version and its proof command, and its root map item is gone. For the routing promise, the second routing check and its compare with the baseline. The nested-project tests and the release gate are Automated Implementation Testing.
- Executor: the implementing coding agent for the fixes, the tests, the cleanup and the review. The routing-check script for the second check. The owner for the gates and the 2.1.0 install on the maintainer machine.
- Accepted obligation or deferral route: [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-upward-project-search-stops-at-the-nearest-project) to [O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root). This phase fulfills all five.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | The decision record is below. It covers the nested-project tests, the release gate and the second routing check. |
| Performance Testing | not-needed-now | No performance candidate exists. |
| Guided Progress Review | not-needed-now | No current decision needs a guided review. |
| Unassisted Goal Testing | not-needed-now | The routing check is the evidence that [Q-008](../../prd/03-open-questions-and-risk-register.md#q-008-routing-check-method) selects for agent routing. |

Decision record for Automated Implementation Testing:

| Field | Value |
| --- | --- |
| Testing type | Automated Implementation Testing |
| Decision informed | Whether 2.1.0 can go to `latest`, whether each workaround can leave the root map, and whether routing changed after the cleanup |
| Reason now | No nested-project test exists today ([Q-014](../../prd/03-open-questions-and-risk-register.md#q-014-nested-project-fixes)), and agents use the workarounds on every kit task |
| Product maturity | Live product, with a minor release that changes project resolution |
| Scope | One nested-project test for each O-number, all Make Docs tests on the three operating systems, the release gate for 2.1.0, one proof command for each O-number, and 36 routing-check runs |
| Executor | The implementing coding agent, GitHub Actions and the routing-check script |
| Gate effect | Blocking for 2.1.0 on `latest` and for each `Fulfilled` status. The second routing check is advisory, and each miss needs a register item. |
| Effort budget | One release candidate, one proof run for each O-number, and one second routing check |
| Stop condition | All acceptance criteria pass, or a fix needs a Make Docs change that the Make Docs PRDs do not allow. In that case, stop and ask the owner. |
| Evidence retained | Test and workflow run links, proof command outputs and the second routing-check results in the `A601` to `A620` section of `evidence.md` |
| Rerun trigger | A new release candidate number, or a change to the root map before the second check |

No performance candidate applies, so this phase records no performance lifecycle fields.

Human Experience Review stays separate. In this phase the agent reads the cleaned root maps and the second routing-check transcripts, and records a conclusion for each of the two promises.

## Source PRD Docs

- [03 Open Questions and Risk Register, Deferred Obligations](../../prd/03-open-questions-and-risk-register.md#deferred-obligations)
- [02 Architecture Overview](../../prd/02-architecture-overview.md)
- [05 Kit Conventions](../../prd/05-kit-conventions.md)
- [08 Build and Release](../../prd/08-build-and-release.md)
- [01 Product Overview](../../prd/01-product-overview.md)

## Source Obligations, Scenarios, And Findings

- Obligations: [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-upward-project-search-stops-at-the-nearest-project), [O-002](../../prd/03-open-questions-and-risk-register.md#o-002-commands-resolve-the-nearest-project), [O-003](../../prd/03-open-questions-and-risk-register.md#o-003-mcp-server-resolves-the-project-from-a-path), [O-004](../../prd/03-open-questions-and-risk-register.md#o-004-link-checks-cover-links-between-projects) and [O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root), all in the root register `docs/prd/03-open-questions-and-risk-register.md`. The Make Blueprint register `kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md` has its own [O-001](../../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check), whose trigger is the link read command in this release.
- Decisions carried: [Q-014](../../prd/03-open-questions-and-risk-register.md#q-014-nested-project-fixes), [Q-019](../../prd/03-open-questions-and-risk-register.md#q-019-make-docs-prds-and-kit-conventions), [Q-020](../../prd/03-open-questions-and-risk-register.md#q-020-release-of-the-link-read-command) and [Q-032](../../prd/03-open-questions-and-risk-register.md#q-032-release-gate-scope). The link read command answers the Make Blueprint register [Q-024](../../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-024-make-docs-link-check-interface).
- Drift closed with a set release: [D-024](../../prd/03-open-questions-and-risk-register.md#d-024-two-project-root-searches) in Make Docs 2.1.0. [D-023](../../prd/03-open-questions-and-risk-register.md#d-023-target-flags-have-different-names) is related to O-002 but has no release set, and it stays open.
- Risks this phase addresses: [R-005](../../prd/03-open-questions-and-risk-register.md#r-005-agents-pick-the-wrong-project).
- Scenarios: none.
- Findings: the misses from the baseline register items in Phase 4, and any new miss from the second check.

## Stage 1 - Make Docs Fix Plan and Backlog

### Tasks

- [ ] t1: Write the Make Docs nested-project fix plan in `kits/make-docs/docs/plans/`, with the coordinate that the Make Docs project's own wave model gives it. The plan has one work item for each of O-001 to O-005, one for the link read command ([Q-020](../../prd/03-open-questions-and-risk-register.md#q-020-release-of-the-link-read-command)) and one for the Kit Conventions links in the Make Docs PRDs ([Q-019](../../prd/03-open-questions-and-risk-register.md#q-019-make-docs-prds-and-kit-conventions)). Each O work item links its root record by the root register path and its number. Run each Make Docs command for the plan with `--target-root kits/make-docs` ([O-002](../../prd/03-open-questions-and-risk-register.md#o-002-commands-resolve-the-nearest-project)).
- [ ] t2: Write the Make Docs backlog in `kits/make-docs/docs/work/` from that plan. Each O work item has one nested-project test, and names one proof command that the root record can cite ([Q-014](../../prd/03-open-questions-and-risk-register.md#q-014-nested-project-fixes)). The O-004 work item and the link read command share one link-code work item. The O-001 work item also closes [D-024](../../prd/03-open-questions-and-risk-register.md#d-024-two-project-root-searches): one project-root search that stops at the nearest `.make-docs/config.yaml` ([05 Kit Conventions, Project Target](../../prd/05-kit-conventions.md#project-target)).
- [ ] t3: In the root register, set the Target coordinate of each of O-001 to O-005 to the Make Docs plan path and its coordinate.
- [ ] t4: Validate the Make Docs docs from the repository root: `make-docs run prd authority validate --target-root kits/make-docs`, `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root kits/make-docs` ([O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root)), and the link-check script for every `../` link between the Make Docs docs and the root docs ([O-004](../../prd/03-open-questions-and-risk-register.md#o-004-link-checks-cover-links-between-projects)).

### Acceptance criteria

- A601: The Make Docs plan and backlog exist in `kits/make-docs/docs/plans/` and `kits/make-docs/docs/work/`. The backlog has one work item with one nested-project test and one proof command for each of O-001 to O-005, one for the link read command and one for the Kit Conventions links.
- A602: Each of O-001 to O-005 in the root register names the Make Docs plan path and its coordinate as its Target coordinate.
- A603: `make-docs run prd authority validate --target-root kits/make-docs` exits 0. `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root kits/make-docs` exits 0, and its only diagnostic is `BACKLOG-VAL-010`. The link-check script reports 0 broken links.

### Dependencies

- [Phase 5](05-switch-point.md) is complete: `2.0.7` is on `latest`.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage. No surface changes yet.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A601` to `A603` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A601` to `A603` pass.

## Stage 2 - Fixes and Nested-Project Tests

### Tasks

- [ ] t5: Carry out the O-001 work item: the upward project search stops at the nearest `.make-docs/config.yaml`, so a nested project with no `docs/work/` folder resolves to itself ([O-001](../../prd/03-open-questions-and-risk-register.md#o-001-upward-project-search-stops-at-the-nearest-project), [D-024](../../prd/03-open-questions-and-risk-register.md#d-024-two-project-root-searches)).
- [ ] t6: Carry out the O-002 work item: every Make Docs command resolves the nearest project from the working folder ([O-002](../../prd/03-open-questions-and-risk-register.md#o-002-commands-resolve-the-nearest-project)). In a git repository with nested projects, a command for one project changes no file in another project ([05 Kit Conventions, Project Target](../../prd/05-kit-conventions.md#project-target)).
- [ ] t7: Carry out the O-003 work item: the Make Docs MCP server resolves the project from a path argument or from the nearest project config, not from the folder it started in ([O-003](../../prd/03-open-questions-and-risk-register.md#o-003-mcp-server-resolves-the-project-from-a-path)).
- [ ] t8: Carry out the O-004 work item and the link read command on one link code: the Make Docs link checks validate links that leave a project and land in another known project, and Make Blueprint can read Make Docs links through the new command ([O-004](../../prd/03-open-questions-and-risk-register.md#o-004-link-checks-cover-links-between-projects), [Q-020](../../prd/03-open-questions-and-risk-register.md#q-020-release-of-the-link-read-command)).
- [ ] t9: Carry out the O-005 work item: the backlog snapshot and the `backlog_snapshot` MCP tool take a work record's last-updated time from git history when the git root sits above the project ([O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root)).
- [ ] t10: Carry out the Kit Conventions work item: each Make Docs PRD that states a rule from [05 Kit Conventions](../../prd/05-kit-conventions.md) keeps its text and adds a relative link to the root PRD ([Q-019](../../prd/03-open-questions-and-risk-register.md#q-019-make-docs-prds-and-kit-conventions)).
- [ ] t11: Run `npm test` from the repository root and `make-docs-ci.yml` on the pull request. Each nested-project test runs in the Make Docs test suite on Linux, macOS and Windows.

### Acceptance criteria

- A604: Each of the five nested-project tests passes, and each one fails on the 2.0.7 code, as a run of the test against the `make-docs-v2.0.7` tag shows.
- A605: `npm test` from the repository root exits 0, and `make-docs-ci.yml` passes on `ubuntu-latest`, `macos-latest` and `windows-latest`.
- A606: The link read command returns the Make Docs links of a fixture project, and the Make Docs link check reports a broken `../` link from a fixture kit to a fixture root project.
- A607: A search of the Make Docs PRDs finds a relative link to the root Kit Conventions PRD in each PRD that the Make Docs plan lists for Q-019, and `make-docs run prd authority validate --target-root kits/make-docs` exits 0.

### Dependencies

- Stage 1 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage. The installed release is reviewed in Stage 4.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A604` to `A607` section of `evidence.md`, with links to the Make Docs backlog evidence. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A604` to `A607` pass.

## Stage 3 - Make Docs 2.1.0 Through the Release Gate

### Tasks

- [ ] t12: Set the version of `kits/make-docs/packages/cli/package.json` to `2.1.0-rc.0`. In the release pull request, commit `.github/release-candidates/make-docs-v2.1.0-rc.0.sha256`. The pull request runs the package proof and `npm publish --dry-run` ([08 Build and Release, Release Gate](../../prd/08-build-and-release.md#release-gate)).
- [ ] t13: Owner gate: the owner's clear yes in chat before any npm publish. The owner creates the tag `make-docs-v2.1.0-rc.0` and publishes a GitHub prerelease. The shared `publish-npm.yml` stages the tarball on `next`.
- [ ] t14: Owner gate: the owner approves the staged `2.1.0-rc.0` on npmjs.com with two-factor authentication.
- [ ] t15: Check that `npm view @brucewaynedecoy/make-docs dist-tags --json` shows `latest` at `2.0.7` and `next` at `2.1.0-rc.0`. Run the install check for `2.1.0-rc.0` on the three operating systems.
- [ ] t16: Set the version to `2.1.0`, and commit `.github/release-candidates/make-docs-v2.1.0.sha256` in a pull request that runs the package proof and `npm publish --dry-run`. The code is the same as the release candidate.
- [ ] t17: Owner gate: the owner's clear yes in chat before any npm publish. The owner creates the tag `make-docs-v2.1.0` and publishes its GitHub Release. The workflow stages the tarball on `latest`.
- [ ] t18: Owner gate: the owner approves the staged `2.1.0` on npmjs.com with two-factor authentication.
- [ ] t19: Run the install check for `2.1.0` on the three operating systems. Move [D-024](../../prd/03-open-questions-and-risk-register.md#d-024-two-project-root-searches) to `Closed` in the root register, with the release 2.1.0 and the O-001 nested-project test as its resolution.
- [ ] t20: Tell the Make Blueprint project that the link read command shipped in 2.1.0. Record it in the Make Blueprint register against its [O-001](../../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check) and [Q-024](../../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-024-make-docs-link-check-interface), through that project's own change process, with `--target-root kits/make-blueprint` for each Make Docs command. Do not change Make Blueprint scope.

### Acceptance criteria

- A608: While the release candidate's install check has not passed, `npm view @brucewaynedecoy/make-docs dist-tags --json` shows `"latest": "2.0.7"` and `"next": "2.1.0-rc.0"`.
- A609: The install checks of `2.1.0-rc.0` and `2.1.0` pass on the three operating systems, and each log shows `make-docs --version` printing the checked version.
- A610: `npm view @brucewaynedecoy/make-docs dist-tags --json` shows `"latest": "2.1.0"`. `npm view @brucewaynedecoy/make-docs@2.1.0 dependencies --json` lists no `@brucewaynedecoy/make-core` ([02 Architecture Overview, Module Map](../../prd/02-architecture-overview.md#module-map)).
- A611: D-024 is `Closed` in the root register, and the Make Blueprint register records the link read command release against its O-001.

### Dependencies

- Stage 2 of this phase.
- The owner is available for the gates in t13, t14, t17 and t18.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent records whether `latest` stayed at `2.0.7` while the release candidate was on `next`. Limit: the `npm view` outputs are samples.
- Optional experience handoff: not applicable before the owner installs 2.1.0 in Stage 4.
- Explicit human acceptance gate: none.
- Evidence report: the `A608` to `A611` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A608` to `A611` pass.

## Stage 4 - Workaround Cleanup

### Tasks

- [ ] t21: Ask the owner to install 2.1.0 on the maintainer machine with `npm install -g @brucewaynedecoy/make-docs@2.1.0`. The cleanup starts only after `make-docs --version` prints `2.1.0` there ([Q-014](../../prd/03-open-questions-and-risk-register.md#q-014-nested-project-fixes)).
- [ ] t22: Run the proof command of each O-number with 2.1.0 and without its workaround, and record each command and its output. O-005 uses `make-docs run work backlog snapshot --target-root kits/make-blueprint` from the repository root without `GIT_DIR` ([O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root)). O-001 to O-004 use the proof commands from the Make Docs backlog.
- [ ] t23: Remove each numbered workaround from the root map in `AGENTS.md` and in `CLAUDE.md`, with its introduction text. Keep the table and the routing rules the same in both files ([02 Architecture Overview, Several Docs Roots](../../prd/02-architecture-overview.md#several-docs-roots)).
- [ ] t24: Remove each workaround from kit setup and from the validation steps. Search the active routers, the kit setup docs and the open tasks of active backlogs, this backlog included, for each workaround: the kept-empty `docs/work/` folder, the required kit target flag, the required `targetRoot` on MCP calls for a kit, the hand or script check of `../` links, and the `GIT_DIR=/dev/null` form. Update each active instance. Leave dated records such as plans, history and closed tasks as they are.
- [ ] t25: Mark each of O-001 to O-005 `Fulfilled` in the root register. Add the version 2.1.0 and the proof command to each record's History / disposition note ([Deferred Obligations](../../prd/03-open-questions-and-risk-register.md#deferred-obligations)).
- [ ] t26: With the PRD change process, update the limitation "Nested projects need temporary workarounds" in [01 Product Overview, Current Limitations](../../prd/01-product-overview.md#current-limitations), and the Experience Promises release text "Until Make Docs 2.1.0" if it changes meaning.

### Acceptance criteria

- A612: `make-docs --version` prints `2.1.0` on the maintainer machine, as the owner reports.
- A613: Each O-number has a recorded proof command and output that pass without the workaround. `make-docs run work backlog snapshot --target-root kits/make-blueprint` exits 0 from the repository root without `GIT_DIR`.
- A614: `grep -n "O-00[1-5]" AGENTS.md CLAUDE.md` finds no numbered workaround, and the two root maps have the same rows and rules.
- A615: A search of the active routers, the kit setup docs and the open tasks of active backlogs finds no workaround instruction.
- A616: Each of O-001 to O-005 has the status `Fulfilled`, the version 2.1.0 and its proof command in the root register.

### Dependencies

- Stage 3 of this phase: `2.1.0` is on `latest`.
- The owner installs 2.1.0 on the maintainer machine.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads both root maps and the five records, and records a conclusion for the workaround promise: each workaround stayed visible, numbered and owned until its fix was installed, and is now gone. Limit: the review covers this repository's active files only.
- Optional experience handoff: one step for the owner: open the root `AGENTS.md` and see that the map has no workaround list. Feedback is optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A612` to `A616` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A612` to `A616` pass. The workaround promise is capability complete when A616 passes.

## Stage 5 - Second Routing Check

### Tasks

- [ ] t27: Run the routing check from [Phase 4](04-routing-check-baseline.md) again from the repository root, with the same 9 tasks, the same script and the same pass rule, on a clean working tree at a recorded commit after Stage 4. The script writes a dated results file in `docs/assets/maintainer/routing-check/`, for example `<date>-second-check.md` ([02 Architecture Overview, Routing Check](../../prd/02-architecture-overview.md#routing-check)).
- [ ] t28: Compare the result of each task with the baseline, and record the compare in the second results file: the task, the baseline passes, the second-check passes and the change.
- [ ] t29: For each new miss, add a root register item with the next free number, an owner and a link to its row. Move [R-005](../../prd/03-open-questions-and-risk-register.md#r-005-agents-pick-the-wrong-project) to `Closed` when both checks are recorded and each miss has a register item with an owner.
- [ ] t30: Do the Human Experience Review of the routing promise and the workaround promise, and record it in `evidence.md`.
- [ ] t31: Validate the docs from the repository root with the fixed Make Docs: `make-docs run prd authority validate --target-root .`, the Make Docs link check that now covers links between projects, and `make-docs run work backlog snapshot --target-root .` without `GIT_DIR`. Run the link-check script once more and compare its result with the Make Docs link check.

### Acceptance criteria

- A617: The second results file lists 36 runs, each marked `pass` or `miss`, and a compare row for each of the 9 tasks against the baseline.
- A618: After the check, `git status --porcelain` shows only the new results file.
- A619: Each miss of the second check has a root register item with an owner. R-005 is `Closed`, or the register states which miss keeps it open.
- A620: `make-docs run prd authority validate --target-root .` exits 0. `make-docs run work backlog snapshot --target-root .` exits 0 without `GIT_DIR`, and its only diagnostic is `BACKLOG-VAL-010`. The Make Docs link check and the link-check script each report 0 broken links.

### Dependencies

- Stage 4 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent records a conclusion for the routing promise from both checks: which tasks improved, which stayed the same, and which got worse after the workarounds left the root map. Limit: two runs per task and tool is a small sample.
- Optional experience handoff: one step for the owner: read the compare rows in the second results file. Feedback is optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A617` to `A620` section of `evidence.md`, with links to both results files. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: phase complete when `A601` to `A620` pass. O-001 to O-005 are `Fulfilled`, so the workaround capability is complete. The routing promise is complete only when no miss stays without an owner.
