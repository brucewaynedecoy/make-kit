---
title: "Phase 5: Switch Point"
kind: "work"
status: "active"
coordinate: "W1 R0 P5"
source:
  type: "prd"
  path: "docs/prd/08-build-and-release.md"
---

# Phase 5: Switch Point

## Purpose

This phase releases Make Docs 2.0.7 from this repository. 2.0.7 has the same code as 2.0.6. It is the switch point and the first use of the release gate ([Q-011](../../prd/03-open-questions-and-risk-register.md#q-011-switch-test), [Q-032](../../prd/03-open-questions-and-risk-register.md#q-032-release-gate-scope)). After 2.0.7 is on `latest`, the phase freezes the old repository ([Q-012](../../prd/03-open-questions-and-risk-register.md#q-012-old-repository-freeze)). It is step 7 of the Step 0 sequence ([Q-021](../../prd/03-open-questions-and-risk-register.md#q-021-step-0-sequence)).

The phase depends on [Phase 3](03-ci.md) for the workflows and the install check, on [Phase 2](02-go-public.md) for the public repository that provenance needs, and on [Phase 4](04-routing-check-baseline.md) in the fixed Step 0 order. The switch point comes before the core ([Q-002](../../prd/03-open-questions-and-risk-register.md#q-002-switch-point-before-the-core)).

## Overview

The switch test has six steps, in order: a dry run in a pull request, the compare of the 2.0.7 tarball with 2.0.6, the move of the npm trusted publisher, `2.0.7-rc.0` on `next`, the install check from npm on Linux, macOS and Windows, and then `2.0.7` on `latest` with the install check again ([08 Build and Release, Switch Point](../../prd/08-build-and-release.md#switch-point)). If the release candidate fails, the owner sets the trusted publisher back to the repository `make-docs`, and the old repository stays the release source.

After `2.0.7` is on `latest`, the old repository gets a README banner, loses `publish-npm.yml` and `dependabot.yml`, and has its Dependabot pull requests closed. It is not archived, and its history is not rewritten ([08 Build and Release, Old Repository](../../prd/08-build-and-release.md#old-repository)).

Owner gates in this phase: `t6`, `t7`, `t8`, `t11`, `t13`, `t14`, `t18`, `t19` and `t20`. Each one is an npm publish, a trusted-publisher change or a change to the old repository. Only the owner can create a release tag, under the tag ruleset from Phase 2.

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `direct`. Two promises name this phase. The first is "A Make Docs user sees no change to the npm package name or the install commands after the switch point", owned by [08 Build and Release, Switch Point](../../prd/08-build-and-release.md#switch-point). The second is "A Make Docs user who installs from `latest` gets no version from the new release path until that path has passed on the `next` dist-tag", owned by [08 Build and Release, Release Gate](../../prd/08-build-and-release.md#release-gate). The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind both.
- Intended human outcome: a Make Docs user runs `npm install -g @brucewaynedecoy/make-docs` as before and gets a CLI named `make-docs`. While `2.0.7-rc.0` is on `next` and its install check has not passed, `latest` stays at `2.0.6`. The npm package page of 2.0.7 shows a provenance link to `brucewaynedecoy/make-kit`.
- Human-facing surface or indirect effect: the npm package page, the `next` and `latest` dist-tags, `npm install -g @brucewaynedecoy/make-docs`, `make-docs --version`, and the README banner of the old repository.
- Implementation work: Stage 1 prepares the release candidate and compares the tarball. Stage 2 moves the trusted publisher and releases `2.0.7-rc.0` on `next`. Stage 3 releases `2.0.7` on `latest`. Stage 4 freezes the old repository and closes the switch risks.
- Evidence source or testing type selected under current authority: Automated Implementation Testing, as [08 Build and Release](../../prd/08-build-and-release.md#switch-point) selects: the tarball file-list and content compare of 2.0.7 with 2.0.6, `2.0.7-rc.0` on `next` with the install check from npm on three operating systems, then `2.0.7` on `latest` with the install check again.
- Executor: the implementing coding agent prepares each pull request and runs each check. The owner creates the release tags, moves the trusted publisher and approves each stage on npmjs.com.
- Accepted obligation or deferral route: none. Both promises close in this phase.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | The decision record is below. |
| Performance Testing | not-needed-now | No performance candidate exists. |
| Guided Progress Review | not-needed-now | No current decision needs a guided review. The owner approvals are owner gates, not a testing type. |
| Unassisted Goal Testing | not-needed-now | The install commands do not change, so no new public path needs proof of discoverability. The install check answers the current question. |

Decision record for Automated Implementation Testing:

| Field | Value |
| --- | --- |
| Testing type | Automated Implementation Testing |
| Decision informed | Whether `2.0.7` can go to `latest`, and whether the owner must set the trusted publisher back |
| Reason now | 2.0.7 is the first release from a new repository, a new CI and a new publish workflow ([R-003](../../prd/03-open-questions-and-risk-register.md#r-003-broken-release-at-the-switch-point)) |
| Product maturity | Live product with live users on `latest` |
| Scope | The tarball compare, and the install check from npm on `ubuntu-latest`, `macos-latest` and `windows-latest` for `2.0.7-rc.0` and `2.0.7` |
| Executor | The implementing coding agent, with the install-check workflow from Phase 3 |
| Gate effect | Blocking. `2.0.7` is not published until the release candidate's install check passes on the three operating systems. |
| Effort budget | One release candidate. A failed candidate takes a new prerelease number after the fix. |
| Stop condition | `2.0.7` passes its install check, or the release candidate fails and the owner sets the trusted publisher back |
| Evidence retained | The compare report, the install-check run links and the `npm view` outputs in the `A501` to `A515` section of `evidence.md` |
| Rerun trigger | A new release candidate number |

No performance candidate applies, so this phase records no performance lifecycle fields.

Human Experience Review stays separate. In this phase the agent inspects the real npm package page and the install-check logs, and records a conclusion for each of the two promises.

## Source PRD Docs

- [08 Build and Release](../../prd/08-build-and-release.md)
- [01 Product Overview](../../prd/01-product-overview.md)
- [03 Open Questions and Risk Register](../../prd/03-open-questions-and-risk-register.md)

## Source Obligations, Scenarios, And Findings

- Obligations: [O-004](../../prd/03-open-questions-and-risk-register.md#o-004-link-checks-cover-links-between-projects) and [O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root) apply to the validation task only. The switch point is a dependency of [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-upward-project-search-stops-at-the-nearest-project) to O-005.
- Decisions carried: [Q-002](../../prd/03-open-questions-and-risk-register.md#q-002-switch-point-before-the-core), [Q-011](../../prd/03-open-questions-and-risk-register.md#q-011-switch-test), [Q-012](../../prd/03-open-questions-and-risk-register.md#q-012-old-repository-freeze), [Q-024](../../prd/03-open-questions-and-risk-register.md#q-024-old-make-docs-history) and [Q-032](../../prd/03-open-questions-and-risk-register.md#q-032-release-gate-scope).
- Risks this phase addresses: [R-003](../../prd/03-open-questions-and-risk-register.md#r-003-broken-release-at-the-switch-point), [R-007](../../prd/03-open-questions-and-risk-register.md#r-007-urgent-fix-during-the-freeze) and [R-008](../../prd/03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206).
- Scenarios: none.
- Findings: none.

## Stage 1 - Release Candidate Preparation

### Tasks

- [ ] t1: Check that no fix landed in only one repository during the freeze ([R-007](../../prd/03-open-questions-and-risk-register.md#r-007-urgent-fix-during-the-freeze)). `git ls-remote https://github.com/brucewaynedecoy/make-docs refs/heads/main` must print the commit of `v2.0.6`, `ff0b97dc`, or each later commit must already be ported to `kits/make-docs/` by hand. This is a read-only check.
- [ ] t2: Set the version of `kits/make-docs/packages/cli/package.json` to `2.0.7-rc.0`, and update its workspace entry in the root lockfile.
- [ ] t3: Compare the release candidate tarball with 2.0.6. Build the tarball with the CI package proof, and get the 2.0.6 tarball with `npm pack @brucewaynedecoy/make-docs@2.0.6`. This is step 2 of the switch test ([Q-011](../../prd/03-open-questions-and-risk-register.md#q-011-switch-test)). The file lists must be the same. A script unpacks both tarballs and diffs each file. Apart from the version number, the only differences are the repository links: the `repository`, `homepage` and `bugs` fields of `package.json` and the GitHub links in the tarball `README.md` ([08 Build and Release, Switch Point](../../prd/08-build-and-release.md#switch-point), [R-008](../../prd/03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206)).
- [ ] t4: Owner decision: list each other difference from t3, such as bundle or source-map text, for the owner. The phase stops until the owner accepts each difference in chat or a fix removes it ([R-008](../../prd/03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206)).
- [ ] t5: In the release pull request, commit `.github/release-candidates/make-docs-v2.0.7-rc.0.sha256` with the SHA-256 of the reviewed tarball as one lowercase hex line. The pull request runs the package proof and `npm publish --dry-run` ([08 Build and Release, Release-Candidate Digests](../../prd/08-build-and-release.md#release-candidate-digests), [08 Build and Release, Release Gate](../../prd/08-build-and-release.md#release-gate)).

### Acceptance criteria

- A501: The `git ls-remote` output shows `ff0b97dc` for the old `main`, or the evidence lists each later commit with its ported commit in this repository.
- A502: The 2.0.7-rc.0 and 2.0.6 tarballs have the same file list. The content diff shows only the version and the repository links, or the owner accepted each other difference in chat and the evidence lists it.
- A503: The release pull request passes `make-docs-ci.yml`, and the CI digest check matches `.github/release-candidates/make-docs-v2.0.7-rc.0.sha256`.

### Dependencies

- [Phase 3](03-ci.md) and [Phase 4](04-routing-check-baseline.md) are complete.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage. No user surface changes yet.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: the owner decision in t4 on any compare difference that is not a repository link, from [R-008](../../prd/03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206). Scope: the 2.0.7 tarball content. Reviewer: the owner. Effect: Stage 2 does not start until the owner accepts or a fix removes each difference.
- Evidence report: the `A501` to `A503` section of `evidence.md`, with the compare report. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A501` to `A503` pass.

## Stage 2 - Trusted Publisher and Release Candidate on next

### Tasks

- [ ] t6: Owner gate: the owner's clear yes in chat before the trusted publisher changes. The owner sets the npm trusted publisher of `@brucewaynedecoy/make-docs` to the user `brucewaynedecoy`, the repository `make-kit`, the workflow `publish-npm.yml` and an empty environment name, with `npm stage publish` as the only allowed action ([08 Build and Release, Trusted Publisher Settings](../../prd/08-build-and-release.md#trusted-publisher-settings)). The agent does not change the setting.
- [ ] t7: Owner gate: the owner's clear yes in chat before any npm publish. The owner creates the tag `make-docs-v2.0.7-rc.0` on `main` and publishes a GitHub prerelease for it. The shared `publish-npm.yml` stages the tarball with the `next` dist-tag ([08 Build and Release, Publish](../../prd/08-build-and-release.md#publish), [Q-010](../../prd/03-open-questions-and-risk-register.md#q-010-ci-layout-and-release-tags), [Q-011](../../prd/03-open-questions-and-risk-register.md#q-011-switch-test)).
- [ ] t8: Owner gate: the owner approves the staged `2.0.7-rc.0` on npmjs.com with two-factor authentication. Nothing is public before this approval.
- [ ] t9: Check the dist-tags while the release candidate is on `next`: `npm view @brucewaynedecoy/make-docs dist-tags --json` shows `latest` at `2.0.6` and `next` at `2.0.7-rc.0` ([08 Build and Release, Release Gate](../../prd/08-build-and-release.md#release-gate)).
- [ ] t10: Run the install check for `@brucewaynedecoy/make-docs@2.0.7-rc.0` on `ubuntu-latest`, `macos-latest` and `windows-latest`. It installs from npm, runs `make-docs --version` and sets up a temporary project ([08 Build and Release, Switch Point](../../prd/08-build-and-release.md#switch-point)).
- [ ] t11: Owner gate: when any step of this stage fails, the owner's clear yes in chat before the trusted publisher changes again. The owner sets the trusted publisher back to the repository `make-docs`, and the old repository stays the release source ([08 Build and Release, Switch Point](../../prd/08-build-and-release.md#switch-point)). Record the failure. A corrected release uses a new prerelease number and a new tag, because a rejected stage leaves its GitHub Release ([08 Build and Release, Rebuild Notes](../../prd/08-build-and-release.md#rebuild-notes)).

### Acceptance criteria

- A504: The npm trusted publisher of `@brucewaynedecoy/make-docs` names the repository `make-kit` and the workflow `publish-npm.yml`, as the owner reports or a screenshot shows.
- A505: While the release candidate's install check has not passed, `npm view @brucewaynedecoy/make-docs dist-tags --json` shows `"latest": "2.0.6"` and `"next": "2.0.7-rc.0"`.
- A506: The install check passes on the three operating systems, and each log shows `make-docs --version` printing `2.0.7-rc.0` and a completed setup in a temporary project.

### Dependencies

- Stage 1 of this phase.
- The owner is available for the gates in t6 to t8.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent records whether `latest` stayed at `2.0.6` for the whole time the release candidate was on `next`, from the `npm view` outputs with their times. Limit: the outputs are samples, not a continuous record.
- Optional experience handoff: not applicable before the stable release.
- Explicit human acceptance gate: none. The owner gates approve actions.
- Evidence report: the `A504` to `A506` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A504` to `A506` pass.

## Stage 3 - Stable 2.0.7 on latest

### Tasks

- [ ] t12: Set the version to `2.0.7` and commit `.github/release-candidates/make-docs-v2.0.7.sha256` in a pull request that runs the package proof and `npm publish --dry-run`. The code is the same as the release candidate: a diff of the `make-docs-v2.0.7-rc.0` tag with this commit touches only the version fields and the digest file ([08 Build and Release, Release Gate](../../prd/08-build-and-release.md#release-gate)).
- [ ] t13: Owner gate: the owner's clear yes in chat before any npm publish. The owner creates the tag `make-docs-v2.0.7` and publishes its GitHub Release. The workflow stages the tarball with the `latest` dist-tag.
- [ ] t14: Owner gate: the owner approves the staged `2.0.7` on npmjs.com with two-factor authentication.
- [ ] t15: Run the install check again for `@brucewaynedecoy/make-docs@2.0.7` on the three operating systems.
- [ ] t16: Check the result: `npm view @brucewaynedecoy/make-docs dist-tags --json`, `npm view @brucewaynedecoy/make-docs@2.0.7 name`, and `npm view @brucewaynedecoy/make-docs@2.0.7 dist.attestations --json`. Open the npm package page of 2.0.7 and read its provenance link. Check that the package keeps the npm setting "Require two-factor authentication and disallow tokens" ([08 Build and Release, Publish](../../prd/08-build-and-release.md#publish)).
- [ ] t17: Do the Human Experience Review of the two npm promises from the real npm page, the dist-tag outputs and the install-check logs, and record it in `evidence.md`.

### Acceptance criteria

- A507: `npm view @brucewaynedecoy/make-docs dist-tags --json` shows `"latest": "2.0.7"`.
- A508: `npm view @brucewaynedecoy/make-docs@2.0.7 name` prints `@brucewaynedecoy/make-docs`. The install check of 2.0.7 passes on the three operating systems, and `npm install -g @brucewaynedecoy/make-docs` installs a CLI named `make-docs` that prints `2.0.7`.
- A509: `npm view @brucewaynedecoy/make-docs@2.0.7 dist.attestations --json` lists a provenance attestation, and the npm package page shows a provenance link to `brucewaynedecoy/make-kit` and the workflow `publish-npm.yml`.
- A510: The diff of the `make-docs-v2.0.7-rc.0` tag with the `make-docs-v2.0.7` tag touches only the version fields and the digest files.

### Dependencies

- Stage 2 of this phase, with its install check passed.
- The owner is available for the gates in t13 and t14.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent records one conclusion for each promise. Package name and install commands: the evidence is A508 and the unchanged README install text. `latest` only after `next`: the evidence is A505 and A507. Limit: the install check runs on hosted runners, not on user machines.
- Optional experience handoff: two steps for the owner: run `npm install -g @brucewaynedecoy/make-docs` and `make-docs --version`, then open the npm package page and look at the provenance link. Feedback is optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A507` to `A510` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A507` to `A510` pass.

## Stage 4 - Old Repository Freeze

### Tasks

- [ ] t18: Owner gate: the owner's clear yes in chat before any change to the old `make-docs` repository. Add a README banner to the old repository that points to `kits/make-docs/` in `make-kit` ([Q-012](../../prd/03-open-questions-and-risk-register.md#q-012-old-repository-freeze)). Make the change on GitHub through a pull request in the old repository, not in the local clone `../make-docs`.
- [ ] t19: Owner gate: the owner's clear yes in chat before any change to the old `make-docs` repository. Remove `.github/workflows/publish-npm.yml` and `.github/dependabot.yml` from the old repository ([08 Build and Release, Old Repository](../../prd/08-build-and-release.md#old-repository), [Q-012](../../prd/03-open-questions-and-risk-register.md#q-012-old-repository-freeze)).
- [ ] t20: Owner gate: the owner's clear yes in chat before any change to the old `make-docs` repository. Close each open Dependabot pull request in the old repository ([Q-003](../../prd/03-open-questions-and-risk-register.md#q-003-copy-source-and-freeze), [Q-012](../../prd/03-open-questions-and-risk-register.md#q-012-old-repository-freeze)).
- [ ] t21: Check the old repository with read-only commands: `gh api repos/brucewaynedecoy/make-docs --jq .archived` prints `false`, the two files are gone from its `main`, `gh pr list --repo brucewaynedecoy/make-docs --author app/dependabot --state open` lists nothing, and `git ls-remote https://github.com/brucewaynedecoy/make-docs refs/tags/v2.0.6` still shows `ff0b97dc` ([Q-024](../../prd/03-open-questions-and-risk-register.md#q-024-old-make-docs-history)).
- [ ] t22: Move [R-003](../../prd/03-open-questions-and-risk-register.md#r-003-broken-release-at-the-switch-point), [R-007](../../prd/03-open-questions-and-risk-register.md#r-007-urgent-fix-during-the-freeze) and [R-008](../../prd/03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206) to `Closed` in the root register, each with a resolution that cites its acceptance IDs. With the PRD change process, update the current-state text that the switch point changes in [01 Product Overview](../../prd/01-product-overview.md#purpose) and [08 Build and Release](../../prd/08-build-and-release.md#purpose).
- [ ] t23: Validate the docs from the repository root: `make-docs run prd authority validate --target-root .`, the link-check script for relative links and heading anchors ([O-004](../../prd/03-open-questions-and-risk-register.md#o-004-link-checks-cover-links-between-projects)), and `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root .` ([O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root)).

### Acceptance criteria

- A511: The old repository README shows a banner that points to `kits/make-docs/` in `make-kit`.
- A512: The old repository `main` holds no `.github/workflows/publish-npm.yml` and no `.github/dependabot.yml`, and it has no open Dependabot pull request.
- A513: `gh api repos/brucewaynedecoy/make-docs --jq .archived` prints `false`, and the tag `v2.0.6` still points to `ff0b97dc`.
- A514: The local clone `../make-docs` gives the same `git rev-parse HEAD` and `git status --porcelain` output as in Phase 1.
- A515: R-003, R-007 and R-008 are `Closed` with resolutions. `make-docs run prd authority validate --target-root .` exits 0, the link-check script reports 0 broken links, and the backlog snapshot exits 0 with only `BACKLOG-VAL-010`.

### Dependencies

- Stage 3 of this phase: `2.0.7` is on `latest`.
- The owner is available for the gates in t18 to t20.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent opens the old repository page and records whether a visitor can find the new home of Make Docs from the README banner. Limit: the review reads the page, and no visitor test runs.
- Optional experience handoff: one step for the owner: open the old repository page signed out and follow the banner link. Feedback is optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A511` to `A515` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: phase complete when `A501` to `A515` pass. The two npm promises are capability complete for the switch point. The release gate stays in use for 2.1.0, core 0.1.0 and 2.2.0.
