---
title: "Phase 6: Work Backlog Scope"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P6"
---

# Phase 6: Work Backlog Scope

## Purpose

Fix what the Step 0 work backlog covers, so it reads the root PRDs and follows the order in design section 11 (Q-021).

## Backlog Decision

- Backlog type: a full Step 0 backlog (Q-001). The setup tool and the shared files get a later wave.
- Path: `docs/work/<generation-date>-w1-r0-make-kit-monorepo/`, with `00-index.md` and one file per phase.
- Prompt: `make-docs://system/prompt/prd-to-work-full-prd.prompt.md`, read with `make-docs resource read`.
- Start condition: [Phase 4](04-register-and-assembly.md) passes. The backlog cites the root PRDs as its authority, never this plan.
- Steps 1 and 2 of design section 11 (root docs and this backlog) are planning work, so the backlog starts at copy day.
- Each phase gets one branch and one pull request. Commits happen only when the owner asks.

## Owner Gates

These actions need the owner's clear yes in chat, each time, before an agent acts. The backlog marks each one in its task text.

- Any change to the old `make-docs` repository or its local clone.
- Any npm publish, and any change to npm dist-tags or the trusted publisher.
- Any change to GitHub repository visibility, rulesets, or the delete and re-create in Q-026.

## Phase Map for the Backlog

| Phase | Scope | Owning PRDs | Exit criteria |
| --- | --- | --- | --- |
| `01-copy-day` | Freeze the old repository (announce only; no change to it). Extract `v2.0.6` from the local clone into `kits/make-docs/` with `git -C ../make-docs archive v2.0.6 \| tar -x -C kits/make-docs`, which reads the clone and changes nothing in it. Merge the old root `package.json` into the root workspace and build one root lockfile from the old lockfile, so dependency versions stay the same. Fix the `tsup` `yaml` path, the repository URLs (with a `directory` field) and tests that assume the repository root. Run `make-docs project checkout-move` (preview, then apply) so `kits/make-docs/` keeps its `projectId`; it changes only the Store. Update the root map row for `kits/make-docs/`. Change the `make-docs v2.0.6:` code anchors in the root PRDs to links. Record the Naive UAT removal in the Make Docs register (Q-009). Record the old repository's unmerged branches in the Make Docs register for later porting. | 02, 05, 08 | `npm ci`, the build and all Make Docs tests pass at the root. `npm pack --dry-run` for `@brucewaynedecoy/make-docs` lists the same files as 2.0.6. `make-docs run prd authority validate --target-root kits/make-docs` exits 0. |
| `02-go-public` | Check again that each old commit ID returns "not found" on GitHub (Q-026). Scan the files and the full git history for secrets, client data, `/Users/` paths and the work email. Add the root MIT `LICENSE` (Q-018), `CODEOWNERS` with the owner only (Q-013) and the root Dependabot config before the repository goes public. The owner makes the repository public. Add the rulesets. | 08 | The scan report has no findings. Each old commit ID returns "not found" on GitHub. The repository is public with the rulesets on. |
| `03-ci` | Root `.github/workflows/make-docs-ci.yml` from the old `platform-safety.yml`, and the shared `publish-npm.yml` with package-named tags and release-candidate digests (Q-010). Remove the copied workflows under `kits/make-docs/.github/`. Rewrite `kits/make-docs/RELEASING.md` for this repository and the package-named tags. No publish yet. | 08 | `make-docs-ci.yml` passes on Linux, macOS and Windows on a pull request. |
| `04-routing-check-baseline` | Build `scripts/routing-check/` and run the first check (Q-008). Record misses in the root register. | 02 | `docs/assets/maintainer/routing-check/<date>-baseline.md` holds 9 tasks × 2 tools × 2 runs, each marked pass or miss. |
| `05-switch-point` | The release gate for 2.0.7 (Q-011): dry run, tarball compare with 2.0.6, the owner moves the trusted publisher, `2.0.7-rc.0` on `next`, the install check on three systems, `2.0.7` on `latest`, the install check again. Then freeze the old repository (Q-012): the README banner, remove `publish-npm.yml` and `dependabot.yml`, close the Dependabot pull requests. | 08 | `npm view @brucewaynedecoy/make-docs dist-tags` shows `latest: 2.0.7`, with provenance from `make-kit`. The old repository has the banner and no publish workflow. |
| `06-nested-project-fixes` | Write the Make Docs plan and backlog in `kits/make-docs/docs/` for O-001 to O-005, the link read command (Q-020) and the Kit Conventions links in the Make Docs PRDs (Q-019), and carry it out (Q-014). Release 2.1.0 through the release gate. After the owner installs it, remove each workaround from the root map and the validation steps, mark each O-number `Fulfilled`, and run the routing check again. | 02, 03, 05, 08 | O-001 to O-005 are `Fulfilled` with their version and proof command. The second routing check result is recorded and compared with the baseline. |
| `07-shared-core` | Build `packages/core/` in slices from easy to hard, with all Make Docs tests green after each slice (Q-016). Add tool discovery as new code. Publish core `0.1.0` through the release gate. Release Make Docs 2.2.0 on the core with an exact pin, tag-aware managed blocks and the uninstall fix (Q-007). Make Docs PRD changes for 2.2.0 go through a Make Docs change plan in `kits/make-docs/docs/`. | 06, 05, 08 | `npm view @brucewaynedecoy/make-core version` shows `0.1.0`. Make Docs 2.2.0 is on `latest` and depends on exactly `0.1.0`. The Store stays at schema version 6. |
| `08-closeout` | Check every Q, R, D and O item for its final status. Confirm that Make Blueprint phase `01-shared-core-adoption` can start. Write the closeout history record. | 01, 03 | No Step 0 item is open without an owner and a target. Capability status is stated separately from phase status. |

## Human Experience Mapping

Each phase carries the promise rows from the [overview](00-overview.md#human-experience-propagation) that name it: `04-routing-check-baseline` and `06-nested-project-fixes` for the routing promise, `05-switch-point` for the two npm promises, and `06-nested-project-fixes` for the workaround promise.

## Exit Criteria

- Every backlog phase cites the root PRDs that constrain it in `## Source PRD Docs`.
- Every task uses `- [ ] t1: ...` checkbox items, and acceptance criteria use plain bullets.
- Every owner gate above is marked in its task text.
- `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root .` exits 0 from the repository root, with only the information code `BACKLOG-VAL-010` (O-005).
