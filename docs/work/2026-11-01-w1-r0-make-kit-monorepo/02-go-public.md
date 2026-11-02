---
title: "Phase 2: Go Public"
kind: "work"
status: "active"
coordinate: "W1 R0 P2"
source:
  type: "prd"
  path: "docs/prd/08-build-and-release.md"
---

# Phase 2: Go Public

## Purpose

This phase makes the `make-kit` repository public before the switch point. npm makes provenance only from a public repository, and a private repository on the free GitHub plan gets no rulesets ([Q-004](../../prd/03-open-questions-and-risk-register.md#q-004-public-repository-before-the-switch)). It is step 4 of the Step 0 sequence ([Q-021](../../prd/03-open-questions-and-risk-register.md#q-021-step-0-sequence)).

The phase depends on [Phase 1](01-copy-day.md), because the copied Make Docs tree is part of the history that goes public.

## Overview

A public commit cannot be taken back ([R-004](../../prd/03-open-questions-and-risk-register.md#r-004-exposed-history-in-the-public-repository)). So this phase first adds the root MIT `LICENSE` ([Q-018](../../prd/03-open-questions-and-risk-register.md#q-018-license)), `.github/CODEOWNERS` with the owner only ([Q-013](../../prd/03-open-questions-and-risk-register.md#q-013-code-owners)) and the root Dependabot config. Then it scans every tracked file and every commit, and checks again that each of the 14 old commit IDs returns "No commit found" on GitHub: the 6 from before the email rewrite ([Q-026](../../prd/03-open-questions-and-risk-register.md#q-026-old-commit-ids-on-github)) and the 8 from before the client-name rewrite ([Q-040](../../prd/03-open-questions-and-risk-register.md#q-040-client-names-in-the-committed-history)). Both items are closed: after each rewrite, the owner deleted the GitHub repository and it was created again, on 2026-11-01 and on 2026-11-02. This phase only checks the old IDs again.

After a clean scan, the owner makes the repository public. Then the rulesets go on.

Owner gates in this phase: `t9`, `t11`, `t12` and `t13`. Each one is a GitHub repository, visibility or ruleset change.

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `none`, with a preserved boundary. No experience promise names this phase. The preserved boundary is the security rule of [01 Product Overview, System Boundaries](../../prd/01-product-overview.md#system-boundaries): the public repository holds no secrets, no client data, no local home-folder paths and no work email. The public step is also a precondition of the npm provenance link that Phase 5 shows to Make Docs users ([08 Build and Release, Publish](../../prd/08-build-and-release.md#publish)). The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind the boundary.
- Intended human outcome: a person who opens the public repository or its history finds no private data. A person who reads `LICENSE` at the root finds the MIT license.
- Human-facing surface or indirect effect: the public GitHub repository page, its history and its root `LICENSE`.
- Implementation work: Stage 1 adds the files. Stage 2 scans and checks the old commit IDs. Stage 3 makes the repository public and adds the rulesets.
- Evidence source or testing type selected under current authority: Automated Implementation Testing: the scan of files and history, the commit-email check and the old commit ID checks, with results in the scan report. For the boundary, the evidence is the zero-finding scan report of the commit that goes public.
- Executor: the implementing coding agent runs the scan and the checks. The owner changes the visibility and the rulesets, or gives a clear yes in chat before the agent does.
- Accepted obligation or deferral route: none.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | The decision record is below. |
| Performance Testing | not-needed-now | No performance candidate exists. |
| Guided Progress Review | not-needed-now | No current decision needs a guided review. The owner reads the scan report before the public step, and that read is an owner gate, not a testing type. |
| Unassisted Goal Testing | not-needed-now | No PRD requires it. The phase has no new public path for a person to discover. |

Decision record for Automated Implementation Testing:

| Field | Value |
| --- | --- |
| Testing type | Automated Implementation Testing |
| Decision informed | Whether the owner can make the repository public |
| Reason now | The public step cannot be undone, so the scan must run on the exact history that goes public ([R-004](../../prd/03-open-questions-and-risk-register.md#r-004-exposed-history-in-the-public-repository)) |
| Product maturity | Private repository with a short history and the copied Make Docs tree |
| Scope | Every tracked file, every commit on every ref, commit metadata, and the 14 old commit IDs on GitHub: the 6 from before the email rewrite ([Q-026](../../prd/03-open-questions-and-risk-register.md#q-026-old-commit-ids-on-github)) and the 8 from before the client-name rewrite ([Q-040](../../prd/03-open-questions-and-risk-register.md#q-040-client-names-in-the-committed-history)) |
| Executor | The implementing coding agent |
| Gate effect | Blocking for the public step in Stage 3. Any finding stops the phase until it is fixed. |
| Effort budget | One scan of the phase branch, and one final scan of the merged `main` just before the public step |
| Stop condition | Zero findings on the merged `main`, or a finding that needs a history rewrite. In that case, stop and ask the owner. |
| Evidence retained | The scan report in `docs/assets/maintainer/public-scan/` and the `A201` to `A210` section of `evidence.md` |
| Rerun trigger | Any commit on `main` after the final scan and before the public step |

No performance candidate applies, so this phase records no performance lifecycle fields.

Human Experience Review stays separate. In this phase the agent opens the public repository page after the public step and records what a visitor sees at the root: the README, the `LICENSE` and the folder list.

## Source PRD Docs

- [08 Build and Release](../../prd/08-build-and-release.md)
- [01 Product Overview](../../prd/01-product-overview.md)
- [02 Architecture Overview](../../prd/02-architecture-overview.md)
- [03 Open Questions and Risk Register](../../prd/03-open-questions-and-risk-register.md)

## Source Obligations, Scenarios, And Findings

- Obligations: [O-004](../../prd/03-open-questions-and-risk-register.md#o-004-link-checks-cover-links-between-projects) and [O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root) apply to the validation task only.
- Decisions carried: [Q-004](../../prd/03-open-questions-and-risk-register.md#q-004-public-repository-before-the-switch), [Q-013](../../prd/03-open-questions-and-risk-register.md#q-013-code-owners), [Q-018](../../prd/03-open-questions-and-risk-register.md#q-018-license), [Q-022](../../prd/03-open-questions-and-risk-register.md#q-022-work-email-in-commit-history) and [Q-026](../../prd/03-open-questions-and-risk-register.md#q-026-old-commit-ids-on-github).
- Risks this phase addresses: [R-004](../../prd/03-open-questions-and-risk-register.md#r-004-exposed-history-in-the-public-repository).
- Scenarios: none.
- Findings: none.

## Stage 1 - Repository Files Before the Public Step

### Tasks

- [ ] t1: Add an MIT `LICENSE` at the repository root for the whole Make Kit stack, with the same license text as `kits/make-docs/LICENSE`. Keep `kits/make-docs/LICENSE` in place ([Q-018](../../prd/03-open-questions-and-risk-register.md#q-018-license), [08 Build and Release, License](../../prd/08-build-and-release.md#license)).
- [ ] t2: Add `.github/CODEOWNERS` with the single line `* @brucewaynedecoy` ([Q-013](../../prd/03-open-questions-and-risk-register.md#q-013-code-owners), [08 Build and Release, Rulesets and Ownership](../../prd/08-build-and-release.md#rulesets-and-ownership)).
- [ ] t3: Add `.github/dependabot.yml` that watches the root `package-lock.json` through the npm ecosystem at the folder `/`. Keep the old schedule (weekly on Monday at 09:00 America/Chicago) and the old limit of 5 open pull requests, unless the owner chooses other values ([08 Build and Release, Rulesets and Ownership](../../prd/08-build-and-release.md#rulesets-and-ownership)).
- [ ] t4: Check the commit email. `git log --all --format='%ae%n%ce' | sort -u` must show only the owner's personal email and the GitHub noreply address that GitHub uses for web merges ([08 Build and Release, Public Repository](../../prd/08-build-and-release.md#public-repository), [Q-022](../../prd/03-open-questions-and-risk-register.md#q-022-work-email-in-commit-history)).

### Acceptance criteria

- A201: `LICENSE` at the root holds the MIT license text, and `kits/make-docs/LICENSE` is unchanged from `v2.0.6`.
- A202: `.github/CODEOWNERS` holds exactly one rule, `* @brucewaynedecoy`.
- A203: `.github/dependabot.yml` has one `npm` update entry with `directory: "/"`.
- A204: The commit-email check prints no address other than the owner's personal email and the GitHub noreply address.

### Dependencies

- [Phase 1](01-copy-day.md) is complete.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A201` to `A204` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A201` to `A204` pass.

## Stage 2 - History Scan and Old Commit IDs

### Tasks

- [ ] t5: Check again that each of the 14 old commit IDs returns "No commit found" on GitHub, for example with `gh api repos/brucewaynedecoy/make-kit/commits/<id>` for each ID. The 14 IDs are the 6 from before the email rewrite ([Q-026](../../prd/03-open-questions-and-risk-register.md#q-026-old-commit-ids-on-github)) and the 8 from before the client-name rewrite ([Q-040](../../prd/03-open-questions-and-risk-register.md#q-040-client-names-in-the-committed-history)). This is a read-only check, because both items are closed. No root doc lists the 14 IDs. Get them from the owner, and record the 14 IDs and each result in the scan report ([08 Build and Release, Public Repository](../../prd/08-build-and-release.md#public-repository)).
- [ ] t6: Scan every tracked file and every commit on every ref. Use a secret scanner over the full history, such as `gitleaks git --log-opts="--all"`. Search every commit, for example with `git rev-list --all | xargs git grep -I -n -E <pattern>`, for local home-folder paths on macOS, Linux and Windows, for the work email and for client data. The owner gives the work email and the client terms as local inputs. No repository file holds them ([R-004](../../prd/03-open-questions-and-risk-register.md#r-004-exposed-history-in-the-public-repository)).
- [ ] t7: Run `make-docs project surface ensure assets --target-root .`, then write the scan report at `docs/assets/maintainer/public-scan/<date>-scan.md`. The report states the scanned commit (`git rev-parse main`), the tools and their versions, each check with its result and its count of findings, and the 14 old commit ID results. The report holds no secret, no email address and no client term.
- [ ] t8: Fix each finding in a file with a normal commit on the phase branch, then scan again.
- [ ] t9: Owner gate: the owner's clear yes in chat before any history rewrite or force push to `main`. A finding in an earlier commit needs a history rewrite. After a rewrite, GitHub still opens the commits from before the rewrite by their IDs until the owner chooses how to drop them, as in [Q-026](../../prd/03-open-questions-and-risk-register.md#q-026-old-commit-ids-on-github). Stop the phase until the owner decides.
- [ ] t10: After the phase pull request merges, run the scan of t6 again on the merged `main`, just before the public step. Make sure that no other commit lands on `main` between this scan and Stage 3.

### Acceptance criteria

- A205: Each of the 14 old commit IDs returns "No commit found" on GitHub, and the scan report lists each ID with its result. The 14 IDs are the 6 from before the email rewrite ([Q-026](../../prd/03-open-questions-and-risk-register.md#q-026-old-commit-ids-on-github)) and the 8 from before the client-name rewrite ([Q-040](../../prd/03-open-questions-and-risk-register.md#q-040-client-names-in-the-committed-history)).
- A206: The scan report names the commit of the merged `main` and reports zero findings for secrets, local home-folder paths, the work email and client data.
- A207: `git rev-parse main` at the time of the public step equals the commit in the scan report.

### Dependencies

- Stage 1 of this phase.
- The owner supplies the 14 old commit IDs, the work email and the client terms as local inputs. The 14 IDs are the 6 from before the email rewrite ([Q-026](../../prd/03-open-questions-and-risk-register.md#q-026-old-commit-ids-on-github)) and the 8 from before the client-name rewrite ([Q-040](../../prd/03-open-questions-and-risk-register.md#q-040-client-names-in-the-committed-history)).

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none. The owner gate in t9 applies only when a history rewrite is needed.
- Evidence report: the `A205` to `A207` section of `evidence.md`, with a link to the scan report. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A205` to `A207` pass.

## Stage 3 - Public Step and Rulesets

### Tasks

- [ ] t11: Owner gate: the owner's clear yes in chat before the repository visibility changes. Give the owner the scan report link and the commit it covers. The owner makes `brucewaynedecoy/make-kit` public, or tells the agent to run `gh repo edit brucewaynedecoy/make-kit --visibility public --accept-visibility-change-consequences` ([Q-004](../../prd/03-open-questions-and-risk-register.md#q-004-public-repository-before-the-switch)).
- [ ] t12: Owner gate: the owner's clear yes in chat before any ruleset change. Add a branch ruleset for `main`: changes reach it only through pull requests, a pull request needs 0 approvals, and force pushes and deletion are blocked ([08 Build and Release, Rulesets and Ownership](../../prd/08-build-and-release.md#rulesets-and-ownership)).
- [ ] t13: Owner gate: the owner's clear yes in chat before any ruleset change. Add a tag ruleset for the release tag patterns `make-docs-v*`, `make-core-v*`, `make-kit-v*` and `make-blueprint-v*` from [08 Build and Release, Release Tags and Packages](../../prd/08-build-and-release.md#release-tags-and-packages). A push that moves or deletes a release tag is refused, and only the owner can create a release tag.
- [ ] t14: Read the result with read-only commands: `gh api repos/brucewaynedecoy/make-kit --jq .visibility` and `gh api repos/brucewaynedecoy/make-kit/rulesets`, then each ruleset by its ID.
- [ ] t15: Move [R-004](../../prd/03-open-questions-and-risk-register.md#r-004-exposed-history-in-the-public-repository) to `Closed` in the root register with a resolution that cites `A205` to `A208`. With the PRD change process, update the limitation "The repository is private" in [01 Product Overview, Current Limitations](../../prd/01-product-overview.md#current-limitations).
- [ ] t16: Validate the docs from the repository root: `make-docs run prd authority validate --target-root .`, the link-check script for relative links and heading anchors ([O-004](../../prd/03-open-questions-and-risk-register.md#o-004-link-checks-cover-links-between-projects)), and `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root .` ([O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root)).

### Acceptance criteria

- A208: `gh api repos/brucewaynedecoy/make-kit --jq .visibility` prints `public`.
- A209: The `main` ruleset is active and holds a pull request rule with `required_approving_review_count` 0, a non-fast-forward rule and a deletion rule. The tag ruleset is active for the four release tag patterns, holds update and deletion rules and a creation rule, and lists only the owner as a bypass actor.
- A210: R-004 is `Closed` in the root register. `make-docs run prd authority validate --target-root .` exits 0, the link-check script reports 0 broken links, and the backlog snapshot exits 0 with only `BACKLOG-VAL-010`.

### Dependencies

- Stage 2 of this phase.
- The owner is available for the gates in t11 to t13.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent opens the public repository page and records whether the root shows the README, the `LICENSE` and the folders of the target layout in [02 Architecture Overview, Topology](../../prd/02-architecture-overview.md#topology). Limit: the review cannot prove that copies of the history do not exist elsewhere.
- Optional experience handoff: one step for the owner: open the public repository page signed out and look at the root files and the license badge. Feedback is optional.
- Explicit human acceptance gate: none. The owner gates in t11 to t13 are approvals of actions, not acceptance reviews.
- Evidence report: the `A208` to `A210` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: phase complete when `A201` to `A210` pass. Capability "public repository with provenance" stays partial until the first provenance link appears in Phase 5.
