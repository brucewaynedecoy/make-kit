---
title: "Phase 1: Copy Day"
kind: "work"
status: "active"
coordinate: "W1 R0 P1"
source:
  type: "prd"
  path: "docs/prd/08-build-and-release.md"
---

# Phase 1: Copy Day

## Purpose

This phase brings the Make Docs source tree at the tag `v2.0.6` into `kits/make-docs/` and makes it build and test from the root npm workspace. It is step 3 of the Step 0 sequence ([Q-021](../../prd/03-open-questions-and-risk-register.md#q-021-step-0-sequence)). Every later phase works on the copied code.

The phase depends on the validated root PRD set and on the local clone `../make-docs` of the old repository. The clone must hold the tag `v2.0.6` at commit `ff0b97dc`.

## Overview

On copy day the old repository freezes. The freeze is an announcement only. This phase changes nothing in the old repository or in its local clone. The copy reads the clone with `git -C ../make-docs archive v2.0.6`, which is a read-only command ([Q-003](../../prd/03-open-questions-and-risk-register.md#q-003-copy-source-and-freeze)).

The phase merges the old root `package.json` into one private root workspace and builds one root lockfile from the old lockfile, so the dependency versions stay the same ([Q-005](../../prd/03-open-questions-and-risk-register.md#q-005-one-root-npm-workspace), [R-008](../../prd/03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206)). It fixes the `tsup` path for `yaml`, the repository links and the tests that assume the old repository root ([R-006](../../prd/03-open-questions-and-risk-register.md#r-006-make-docs-tests-that-assume-the-repository-root)). It moves the Make Docs Store record to `kits/make-docs/` with `make-docs project checkout-move`, so the project keeps its `projectId` ([Q-017](../../prd/03-open-questions-and-risk-register.md#q-017-make-docs-store-identity)).

The phase also updates the root map row for `kits/make-docs/`, changes the `make-docs v2.0.6:` code anchors in the root PRDs to links, and records three subjects in the Make Docs register: the Naive UAT removal ([Q-009](../../prd/03-open-questions-and-risk-register.md#q-009-naive-uat-removal)), the unmerged branches of the old repository, and the Make Docs PRD text that two root drift items hand to that register.

The copied `kits/make-docs/.github/` folder stays in place until [Phase 3](03-ci.md) builds the root workflows from it and then removes it.

Owner gates in this phase: none. The phase reads the local clone and changes no file in it. The `checkout-move` apply step changes one Store checkout path only.

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `none` for Make Docs users, with a preserved boundary. No npm release happens in this phase, and the old repository stays the Make Docs release source ([08 Build and Release, Source Home](../../prd/08-build-and-release.md#source-home)). The phase also prepares the routing promise of [02 Architecture Overview, Several Docs Roots](../../prd/02-architecture-overview.md#several-docs-roots): it adds the root map row and the kit routers that [Phase 4](04-routing-check-baseline.md) measures. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind both.
- Intended human outcome: a Make Docs user sees no change. `npm view @brucewaynedecoy/make-docs dist-tags --json` shows the same `latest` version before and after the phase. An agent at the repository root finds a root map row for `kits/make-docs/` that names the kit router file.
- Human-facing surface or indirect effect: the root map in `AGENTS.md` and `CLAUDE.md`, and the kit routers `kits/make-docs/AGENTS.md` and `kits/make-docs/CLAUDE.md`. Maintainers get one `npm ci` and one test run for Make Docs from the repository root.
- Implementation work: Stage 1 extracts and checks the tree. Stage 2 builds the root workspace and lockfile. Stage 3 fixes the build, the tests and the repository links. Stage 4 moves the Store record, updates the root map and records the Make Docs register items. Stage 5 changes the PRD code anchors to links and validates the docs.
- Evidence source or testing type selected under current authority: Automated Implementation Testing. The evidence is the `npm ci`, build and test results from the repository root, the lockfile compare, and the `npm pack --dry-run` file-list compare with 2.0.6. For the preserved boundary, the evidence is the unchanged npm dist-tags and the unchanged local clone.
- Executor: the implementing coding agent on the maintainer machine. CI does not exist until Phase 3.
- Accepted obligation or deferral route: none. This phase uses the O-001 workaround ([O-001](../../prd/03-open-questions-and-risk-register.md#o-001-upward-project-search-stops-at-the-nearest-project)) because `kits/make-docs/docs/work/` must exist. It does not change the obligation.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | The decision record is below. The acceptance criteria in each stage name the checks. |
| Performance Testing | not-needed-now | No performance candidate exists. The plan overview records none ([Performance Evidence Plan](../../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md#performance-evidence-plan)). |
| Guided Progress Review | not-needed-now | No current decision needs a guided review. The phase changes no person-facing output. |
| Unassisted Goal Testing | not-needed-now | No PRD requires it here. The routing check in Phase 4 is the evidence for agent routing ([Q-008](../../prd/03-open-questions-and-risk-register.md#q-008-routing-check-method)). |

Decision record for Automated Implementation Testing:

| Field | Value |
| --- | --- |
| Testing type | Automated Implementation Testing |
| Decision informed | Whether the copied tree builds and tests from the root workspace with the same dependencies and the same package files as 2.0.6, so that Phase 2 can scan it and Phase 3 can build CI on it |
| Reason now | Copy day changes the workspace, the lockfile and the build paths. A fault here breaks every later phase ([R-006](../../prd/03-open-questions-and-risk-register.md#r-006-make-docs-tests-that-assume-the-repository-root)). |
| Product maturity | Live product, copied without behavior change |
| Scope | `npm ci`, the build, all Make Docs tests, the lockfile compare and the `npm pack --dry-run` file list, on the maintainer machine |
| Executor | The implementing coding agent |
| Gate effect | Blocking for this phase. The phase does not close until `A105` to `A107` pass. |
| Effort budget | One full test run after the last fix. Re-run only the failed suites while fixing. |
| Stop condition | All acceptance criteria pass, or a fix needs a change to Make Docs behavior. In that case, stop and ask the owner. |
| Evidence retained | Command output summaries and the compare results in the central `evidence.md` report, sections `A101` to `A115` |
| Rerun trigger | Any change to the root `package.json`, the root lockfile or a Make Docs build file before Phase 3 |

No performance candidate applies, so this phase records no performance lifecycle fields.

Human Experience Review stays separate from the four testing types. In this phase the agent reads the updated root map in both router files and records whether an agent can find the `kits/make-docs/` row and its router file name.

## Source PRD Docs

- [08 Build and Release](../../prd/08-build-and-release.md)
- [02 Architecture Overview](../../prd/02-architecture-overview.md)
- [05 Kit Conventions](../../prd/05-kit-conventions.md)
- [01 Product Overview](../../prd/01-product-overview.md)
- [03 Open Questions and Risk Register](../../prd/03-open-questions-and-risk-register.md)

## Source Obligations, Scenarios, And Findings

- Obligations: [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-upward-project-search-stops-at-the-nearest-project) (the kit keeps `docs/work/`), [O-002](../../prd/03-open-questions-and-risk-register.md#o-002-commands-resolve-the-nearest-project) and [O-003](../../prd/03-open-questions-and-risk-register.md#o-003-mcp-server-resolves-the-project-from-a-path) (kit commands and MCP calls name `kits/make-docs`), [O-004](../../prd/03-open-questions-and-risk-register.md#o-004-link-checks-cover-links-between-projects) (links into `kits/make-docs/` are checked by script) and [O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root) (backlog checks use the `GIT_DIR=/dev/null` form). This phase uses the workarounds and changes no record.
- Decisions carried: [Q-003](../../prd/03-open-questions-and-risk-register.md#q-003-copy-source-and-freeze), [Q-005](../../prd/03-open-questions-and-risk-register.md#q-005-one-root-npm-workspace), [Q-009](../../prd/03-open-questions-and-risk-register.md#q-009-naive-uat-removal), [Q-017](../../prd/03-open-questions-and-risk-register.md#q-017-make-docs-store-identity) and [Q-021](../../prd/03-open-questions-and-risk-register.md#q-021-step-0-sequence).
- Risks this phase addresses: [R-006](../../prd/03-open-questions-and-risk-register.md#r-006-make-docs-tests-that-assume-the-repository-root), [R-008](../../prd/03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206) (the lockfile part) and [R-004](../../prd/03-open-questions-and-risk-register.md#r-004-exposed-history-in-the-public-repository) (the scan before the first commit). [R-007](../../prd/03-open-questions-and-risk-register.md#r-007-urgent-fix-during-the-freeze) starts with the freeze.
- Drift items handed to the Make Docs register: [D-002](../../prd/03-open-questions-and-risk-register.md#d-002-uninstall-text-disagrees-with-store-removal) (Make Docs PRD 16 text), [D-010](../../prd/03-open-questions-and-risk-register.md#d-010-uat-validators-exit-0-when-not-passed) (closes with the Naive UAT removal) and [D-036](../../prd/03-open-questions-and-risk-register.md#d-036-prd-21-lists-a-project-skill-root) (Make Docs PRD 21 text).
- Scenarios: none.
- Findings: none.

## Stage 1 - Freeze and Extraction

### Tasks

- [ ] t1: Check the copy source with read-only commands. `git -C ../make-docs rev-parse "v2.0.6^{commit}"` must print a commit ID that starts with `ff0b97dc`. `git ls-remote --tags https://github.com/brucewaynedecoy/make-docs "v*"` must show no release tag later than `v2.0.6`. If a later tag exists, stop and ask the owner, because the copy source is the latest release tag ([Q-003](../../prd/03-open-questions-and-risk-register.md#q-003-copy-source-and-freeze)).
- [ ] t2: Record the state of the local clone before the copy: the output of `git -C ../make-docs rev-parse HEAD` and `git -C ../make-docs status --porcelain`. Do not fetch, check out, commit or change a file in the clone ([08 Build and Release, Source Home](../../prd/08-build-and-release.md#source-home)).
- [ ] t3: Announce the freeze to the owner in chat. State the freeze start date, that the old repository stays the Make Docs release source until [Phase 5](05-switch-point.md), and that an urgent fix before the switch goes into the old repository first and is then ported to `kits/make-docs/` by hand ([R-007](../../prd/03-open-questions-and-risk-register.md#r-007-urgent-fix-during-the-freeze)). Make no change to the old repository or its local clone.
- [ ] t4: Check that `kits/make-docs/` does not exist. Then run `mkdir -p kits/make-docs && git -C ../make-docs archive v2.0.6 | tar -x -C kits/make-docs` from the repository root. This command reads the clone and changes nothing in it ([Q-003](../../prd/03-open-questions-and-risk-register.md#q-003-copy-source-and-freeze)).
- [ ] t5: Compare the extracted file list with `git -C ../make-docs ls-tree -r --name-only v2.0.6`. Check that `kits/make-docs/` holds no `.git` folder, that `kits/make-docs/docs/work/` exists ([O-001](../../prd/03-open-questions-and-risk-register.md#o-001-upward-project-search-stops-at-the-nearest-project)), and that `kits/make-docs/.make-docs/config.yaml` holds `projectId: 831ddb50-b97a-47e2-9f2c-f491b27b8759` ([Q-017](../../prd/03-open-questions-and-risk-register.md#q-017-make-docs-store-identity)).
- [ ] t6: Before the first commit that holds the copied tree, run the file part of the Phase 2 scan on `kits/make-docs/`: secrets, client data, local home-folder paths for macOS, Linux and Windows, and the work email ([08 Build and Release, Public Repository](../../prd/08-build-and-release.md#public-repository)). The owner gives the work email and any client terms to the scan as local inputs, such as environment variables. No repository file holds them. Fix each finding before the first commit, so it never enters the git history ([R-004](../../prd/03-open-questions-and-risk-register.md#r-004-exposed-history-in-the-public-repository)). Record each fix that touches a packed file, for the content compare in Phase 5.

### Acceptance criteria

- A101: The extracted file list equals the `v2.0.6` file list from `git ls-tree`, and `test -e kits/make-docs/.git` exits nonzero.
- A102: `git -C ../make-docs rev-parse HEAD` and `git -C ../make-docs status --porcelain` give the same output at the end of the phase as in t2.
- A103: `kits/make-docs/docs/work/` exists, and `kits/make-docs/.make-docs/config.yaml` holds the `projectId` `831ddb50-b97a-47e2-9f2c-f491b27b8759`.
- A104: The pre-commit scan of `kits/make-docs/` reports zero findings after the fixes, and the evidence lists each fix with its file.

### Dependencies

- The root PRD set passes `make-docs run prd authority validate --target-root .`, and the owner accepts this backlog.
- The local clone `../make-docs` holds the tag `v2.0.6`.
- The Make Docs CLI 2.0.6 is installed on the maintainer machine.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing, Guided Progress Review and Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage. The extraction has no person-facing surface.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A101` to `A104` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A101` to `A104` pass.

## Stage 2 - Root Workspace and Lockfile

### Tasks

- [ ] t7: Write the root `package.json` from the old root `kits/make-docs/package.json`. Set `"private": true` and exactly the workspaces `packages/*` and `kits/*/packages/*`. Keep the old Node engine (`>=24.0.0`), the old dev dependencies and the old scripts (`build`, `test`, `validate:defaults` and the `smoke:pack` scripts), with each script pointed at the Make Docs workspaces ([Q-005](../../prd/03-open-questions-and-risk-register.md#q-005-one-root-npm-workspace), [02 Architecture Overview, Configuration Surfaces](../../prd/02-architecture-overview.md#configuration-surfaces)). Remove `kits/make-docs/package.json`, because no `package.json` below the root declares `workspaces`.
- [ ] t8: Build the root `package-lock.json` from the old lockfile. Move `kits/make-docs/package-lock.json` to the root, change each workspace path such as `packages/cli` to `kits/make-docs/packages/cli`, and run `npm install --package-lock-only --ignore-scripts`. No folder under `kits/` or `packages/` keeps a lockfile ([02 Architecture Overview, Configuration Surfaces](../../prd/02-architecture-overview.md#configuration-surfaces)).
- [ ] t9: Write a compare script that lists each package entry that is not a workspace, with its version and its integrity value, in the `v2.0.6` lockfile and in the new root lockfile. Every entry must be the same ([R-008](../../prd/03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206)). Keep the script with the phase evidence, outside the published package files.
- [ ] t10: Run `npm ci` from the repository root ([08 Build and Release, Build in the Root Workspace](../../prd/08-build-and-release.md#build-in-the-root-workspace)).

### Acceptance criteria

- A105: The root `package.json` has `"private": true` and the workspaces `packages/*` and `kits/*/packages/*` and no other workspace. `find kits packages -name package-lock.json` prints nothing. No `package.json` below the root holds a `workspaces` field.
- A106: The lockfile compare script exits 0 and reports zero version or integrity differences. `npm ci` from the repository root exits 0.

### Dependencies

- Stage 1 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A105` and `A106` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A105` and `A106` pass.

## Stage 3 - Build, Tests and Repository Links

### Tasks

- [ ] t11: Change `kits/make-docs/packages/cli/tsup.config.ts` so the `yaml-browser-entry` plugin resolves `yaml/browser/index.js` through the workspace, for example with Node module resolution from the package folder, and not through the fixed path `repoRoot/node_modules` ([02 Architecture Overview, Configuration Surfaces](../../prd/02-architecture-overview.md#configuration-surfaces), [08 Build and Release, Build in the Root Workspace](../../prd/08-build-and-release.md#build-in-the-root-workspace)).
- [ ] t12: Run the build and all Make Docs tests from the repository root. Fix each test, script and build file that assumes the old repository root, so it passes from `kits/make-docs/` ([R-006](../../prd/03-open-questions-and-risk-register.md#r-006-make-docs-tests-that-assume-the-repository-root)). Do not change Make Docs behavior. `scripts/copy-template-to-cli.mjs` keeps its own `repoRoot`, because that root is `kits/make-docs/` and the script reads no `node_modules` path.
- [ ] t13: In `kits/make-docs/packages/cli/package.json`, set `repository.url` to `git+https://github.com/brucewaynedecoy/make-kit.git` with `repository.directory` set to `kits/make-docs/packages/cli`, `homepage` to the `make-kit` README, and `bugs.url` to the `make-kit` issues page. Change the GitHub links in `kits/make-docs/packages/cli/README.md` to `make-kit`. Keep the npm name, the `bin` name, the `files` list, the Node engine and the version `2.0.6` unchanged ([08 Build and Release, Package Metadata](../../prd/08-build-and-release.md#package-metadata)).
- [ ] t14: Compare the package file list. Run `npm pack --dry-run --json -w kits/make-docs/packages/cli` and `npm pack @brucewaynedecoy/make-docs@2.0.6 --dry-run --json`, and compare the two file lists ([08 Build and Release, Switch Point](../../prd/08-build-and-release.md#switch-point)).

### Acceptance criteria

- A107: `npm run build` and `npm test` from the repository root exit 0 on the maintainer machine.
- A108: The `npm pack --dry-run` file list for `@brucewaynedecoy/make-docs` equals the 2.0.6 file list.
- A109: A diff of `kits/make-docs/packages/cli/package.json` with `git -C ../make-docs show v2.0.6:packages/cli/package.json` shows changes only in `repository`, `homepage` and `bugs`. `grep -n "brucewaynedecoy/make-docs" kits/make-docs/packages/cli/README.md` finds no GitHub link to the old repository.

### Dependencies

- Stage 2 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage. The package README text is reviewed with the 2.0.7 release in Phase 5.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A107` to `A109` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A107` to `A109` pass. R-006 can move to `Closed` in Stage 5.

## Stage 4 - Store Identity, Root Map and Make Docs Register

### Tasks

- [ ] t15: Run `make-docs project checkout-move preview --target-root kits/make-docs --json`. Check that the preview names the `projectId` `831ddb50-b97a-47e2-9f2c-f491b27b8759`, the old checkout in `../make-docs` as the source and `kits/make-docs` as the target. Then run `make-docs project checkout-move apply --source-checkout <id> --source-root ../make-docs --review <digest> --target-root kits/make-docs` with the values from the preview. The apply step changes one Store checkout path and no file ([Q-017](../../prd/03-open-questions-and-risk-register.md#q-017-make-docs-store-identity), [08 Build and Release, Source Home](../../prd/08-build-and-release.md#source-home)).
- [ ] t16: Update the root map row for `kits/make-docs/` in `AGENTS.md` and `CLAUDE.md`. The row says that Make Docs is present and names the kit router with the same file name as the root file: `kits/make-docs/AGENTS.md` in `AGENTS.md` and `kits/make-docs/CLAUDE.md` in `CLAUDE.md`. Both root maps keep the same rows and rules ([02 Architecture Overview, Several Docs Roots](../../prd/02-architecture-overview.md#several-docs-roots)). Do not change the numbered workarounds.
- [ ] t17: Record these items in the Make Docs register `kits/make-docs/docs/prd/03-open-questions-and-risk-register.md`, with the next free numbers of that register and with `--target-root kits/make-docs` for each Make Docs command ([O-002](../../prd/03-open-questions-and-risk-register.md#o-002-commands-resolve-the-nearest-project)): the Naive UAT removal for a later Make Docs wave, which can also close root [D-010](../../prd/03-open-questions-and-risk-register.md#d-010-uat-validators-exit-0-when-not-passed) ([Q-009](../../prd/03-open-questions-and-risk-register.md#q-009-naive-uat-removal)); the Make Docs PRD 16 uninstall text from root [D-002](../../prd/03-open-questions-and-risk-register.md#d-002-uninstall-text-disagrees-with-store-removal); and the Make Docs PRD 21 project Skill root from root [D-036](../../prd/03-open-questions-and-risk-register.md#d-036-prd-21-lists-a-project-skill-root). Each item names the root register path with the root number.
- [ ] t18: List the unmerged branches of the old repository with read-only commands, such as `git ls-remote --heads https://github.com/brucewaynedecoy/make-docs` and `git -C ../make-docs branch -r --no-merged v2.0.6`. Record each branch in the Make Docs register for later porting, with its name and its last commit ID ([Q-003](../../prd/03-open-questions-and-risk-register.md#q-003-copy-source-and-freeze)).

### Acceptance criteria

- A110: After the apply step, `make-docs project checkout-move preview --target-root kits/make-docs --json` shows the Store checkout for `projectId` `831ddb50-b97a-47e2-9f2c-f491b27b8759` at `kits/make-docs`.
- A111: The root map tables in `AGENTS.md` and `CLAUDE.md` have the same rows. The `kits/make-docs/` row in each file names the kit router with that file's own name and holds no "not here yet" text.
- A112: The Make Docs register holds one item for the Naive UAT removal, one for the PRD 16 text, one for the PRD 21 text and one for each unmerged branch. Each item names its root register number with the root register path.

### Dependencies

- Stage 3 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads both root maps and records whether the `kits/make-docs/` row gives an agent the kit router file in one step. Limit: the review reads the text and does not measure agent behavior. Phase 4 measures it.
- Optional experience handoff: not applicable. The root map is maintainer text.
- Explicit human acceptance gate: none.
- Evidence report: the `A110` to `A112` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A110` to `A112` pass.

## Stage 5 - PRD Code Anchors and Validation

### Tasks

- [ ] t19: Change each `make-docs v2.0.6: <path>[:<line>]` code anchor in the root PRDs to a relative link into `kits/make-docs/<path>`, with the PRD change process in `make-docs://system/reference/prd-change-management.md`. Keep the text `make-docs v2.0.6: <path>:<line>` as the link text, so the line number stays a fact of the tag `v2.0.6` after later releases change the file. In the same change, update the PRD text that says the Make Docs code is not in this repository ([01 Product Overview, Current Limitations](../../prd/01-product-overview.md#current-limitations); the Purpose of the [register](../../prd/03-open-questions-and-risk-register.md#purpose); the Scope of [05 Kit Conventions](../../prd/05-kit-conventions.md#scope)).
- [ ] t20: Move [R-006](../../prd/03-open-questions-and-risk-register.md#r-006-make-docs-tests-that-assume-the-repository-root) to `Closed` in the root register with a resolution that cites `A107`.
- [ ] t21: Validate the docs. From the repository root, run `make-docs run prd authority validate --target-root .` and `make-docs run prd authority validate --target-root kits/make-docs`. Run the link-check script that resolves each relative link and heading anchor on the root PRDs, the root `AGENTS.md` and `CLAUDE.md`, and this backlog, because Make Docs does not check `../` links between projects ([O-004](../../prd/03-open-questions-and-risk-register.md#o-004-link-checks-cover-links-between-projects)). Run `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root .` ([O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root)).

### Acceptance criteria

- A113: A search of `docs/prd/*.md` finds no `make-docs v2.0.6:` anchor outside a Markdown link, and each link target exists in `kits/make-docs/`.
- A114: `make-docs run prd authority validate --target-root .` and `make-docs run prd authority validate --target-root kits/make-docs` each exit 0.
- A115: The link-check script reports 0 broken links and 0 missing anchors. `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root .` exits 0, and its only diagnostic is the information code `BACKLOG-VAL-010`.

### Dependencies

- Stage 4 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage. The anchor links are maintainer navigation.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A113` to `A115` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: phase complete when `A101` to `A115` pass. The capability "Make Docs releases from `make-kit`" stays partial until Phase 5.
