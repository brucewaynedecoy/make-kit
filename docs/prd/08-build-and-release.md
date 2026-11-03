---
title: "08 Build and Release"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md"
---

# 08 Build and Release

## Purpose

This document owns how every package in the `make-kit` repository is built, tested and released to npm. It covers the source home of each kit, the CI workflows, the shared publish workflow, release tags and release-candidate digests, npm trusted publishing and provenance, the release gate, the switch point, the public repository, the rulesets, code owners, Dependabot, the license, and the frozen old `make-docs` repository.

Each part has two states. The target state is the build and release flow in this repository. The current state is what Make Docs does at the `v2.0.6` tag in the old repository, `github.com/brucewaynedecoy/make-docs`. On 2026-11-02 the Make Docs code is in `kits/make-docs/`, copied from the tag `v2.0.6`, and this repository has the root `package.json` and `package-lock.json`. This repository has no root `.github/` folder and no root `LICENSE`. Make Docs releases from the old repository until the switch point. Terms are in [04 Glossary](04-glossary.md).

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 1, 3 and 12)
- [`make-docs v2.0.6: .github/workflows/platform-safety.yml`](../../kits/make-docs/.github/workflows/platform-safety.yml)
- [`make-docs v2.0.6: .github/workflows/publish-npm.yml`](../../kits/make-docs/.github/workflows/publish-npm.yml)
- [`make-docs v2.0.6: RELEASING.md`](../../kits/make-docs/RELEASING.md)

## Scope

This document covers:

- The source home of all kit code, and the Make Docs project identity in it.
- Build commands in the root npm workspace.
- The CI workflow for each kit, starting with `make-docs-ci.yml`.
- The shared `publish-npm.yml`, package-named release tags and release-candidate digests.
- npm trusted publishing, provenance and staged approval.
- The release gate through the `next` dist-tag, and the switch point with Make Docs 2.0.7.
- The public repository and the scan before it goes public.
- Rulesets, code owners, Dependabot and branch use.
- The license.
- The frozen old repository.

Covered elsewhere:

| Subject | Owner |
| --- | --- |
| The root workspace manifest, the lockfile and the `tsup` rule for `yaml` | [02 Architecture Overview](02-architecture-overview.md#configuration-surfaces) |
| The exact core pin and the release build check on the core | [06 Shared Core](06-shared-core.md#core-versions-and-the-exact-pin) |
| The release order across kits | [01 Product Overview](01-product-overview.md#release-scope) |
| The rules every kit follows, such as the CLI shape and the Store boundary | [05 Kit Conventions](05-kit-conventions.md) |
| Make Blueprint signed single-file downloads | [Make Blueprint 07 Installation and Distribution](../../kits/make-blueprint/docs/prd/07-installation-and-distribution.md) |
| The routing check | [02 Architecture Overview](02-architecture-overview.md#routing-check) |

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 1, 3, 11 and 12)
- `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/03-core-setup-and-release.md` (08 Build and Release)

## Component and Capability Map

| Part | Make Docs at `v2.0.6` | Target in `make-kit` | Source |
| --- | --- | --- | --- |
| Source home | The `make-docs` repository | All kit code in this repository. Make Docs in `kits/make-docs/`. | [Q-003](03-open-questions-and-risk-register.md#q-003-copy-source-and-freeze), [Q-017](03-open-questions-and-risk-register.md#q-017-make-docs-store-identity) |
| CI workflow | `platform-safety.yml` on `pull_request` and `workflow_dispatch`, with an in-job `git diff` | `make-docs-ci.yml` in the root `.github/workflows/`, on changes under `kits/make-docs/` or `packages/core/` and on root lockfile changes | [Q-010](03-open-questions-and-risk-register.md#q-010-ci-layout-and-release-tags) |
| Publish workflow | `publish-npm.yml` for one package, `@brucewaynedecoy/make-docs` | One shared `publish-npm.yml` for every package | [Q-010](03-open-questions-and-risk-register.md#q-010-ci-layout-and-release-tags) |
| Release tags | `v<version>` | `<package>-v<version>`, such as `make-docs-v2.0.7` and `make-core-v0.1.0` | [Q-010](03-open-questions-and-risk-register.md#q-010-ci-layout-and-release-tags) |
| Release-candidate digests | `<tag>.sha256` in publish, `v<version>.sha256` in CI | `.github/release-candidates/<tag>.sha256` in both | [Q-010](03-open-questions-and-risk-register.md#q-010-ci-layout-and-release-tags) |
| Release gate | A stable version goes straight to `latest`. No dry run in CI. No install from npm in CI. | Dry run in the pull request, a release candidate on `next`, an install check from npm, then `latest` and the install check again | [Q-011](03-open-questions-and-risk-register.md#q-011-switch-test) |
| Trusted publisher | Repository `make-docs`, workflow `publish-npm.yml` | Repository `make-kit`, workflow `publish-npm.yml`, for each package | [Q-002](03-open-questions-and-risk-register.md#q-002-switch-point-before-the-core), [Q-011](03-open-questions-and-risk-register.md#q-011-switch-test) |
| Repository visibility | Public | Public before the switch point, after a scan | [Q-004](03-open-questions-and-risk-register.md#q-004-public-repository-before-the-switch), [Q-022](03-open-questions-and-risk-register.md#q-022-work-email-in-commit-history), [Q-026](03-open-questions-and-risk-register.md#q-026-old-commit-ids-on-github) |
| Rulesets | `main` needs pull requests and blocks force pushes and deletion | The same for `main`, plus fixed release tags that only the owner creates | Design section 12 |
| Code owners | Three code owners | The owner only | [Q-013](03-open-questions-and-risk-register.md#q-013-code-owners) |
| Dependabot | npm at `/` in the old repository | npm on the root lockfile | Design section 12 |
| License | MIT at the root and in `packages/cli/` | One root MIT `LICENSE` for the whole stack. `kits/make-docs/LICENSE` stays. | [Q-018](03-open-questions-and-risk-register.md#q-018-license) |
| Old repository | The live release source | Frozen after 2.0.7 is on `latest`, not archived, history not rewritten | [Q-012](03-open-questions-and-risk-register.md#q-012-old-repository-freeze), [Q-024](03-open-questions-and-risk-register.md#q-024-old-make-docs-history) |

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 1, 3 and 12)
- [`make-docs v2.0.6: .github/workflows/platform-safety.yml:3`](../../kits/make-docs/.github/workflows/platform-safety.yml)
- [`make-docs v2.0.6: .github/workflows/publish-npm.yml:3`](../../kits/make-docs/.github/workflows/publish-npm.yml)

### Source Home

All kit code lives in this repository. On copy day the old repository freezes, and its latest release tag, `v2.0.6` today, is copied into `kits/make-docs/` with `git archive`. The copy holds only tracked files and no git history. Work on unmerged branches in the old repository is ported here later ([Q-003 Copy Source and Freeze](03-open-questions-and-risk-register.md#q-003-copy-source-and-freeze)).

Requirements:

- `kits/make-docs/` holds the tracked files of the copied release tag, with no `.git` folder and no `.github/` folder.
- `kits/make-docs/.make-docs/config.yaml` has `projectId: 831ddb50-b97a-47e2-9f2c-f491b27b8759`, the same value as in the old repository ([`make-docs v2.0.6: .make-docs/config.yaml:1`](../../kits/make-docs/.make-docs/config.yaml)) ([Q-017 Make Docs Store Identity](03-open-questions-and-risk-register.md#q-017-make-docs-store-identity)).
- A Make Docs Store checkout record for that `projectId` points to `kits/make-docs/`, so the Store history and pending runs stay with the project. `make-docs project checkout-register` adds this record on copy day and changes no project file. A `checkout-move` is blocked, because the old clone stays in place ([Q-017 Make Docs Store Identity](03-open-questions-and-risk-register.md#q-017-make-docs-store-identity)).
- Until the switch point, the old repository is the Make Docs release source. An urgent fix before the switch goes into the old repository first, and a maintainer then ports it to `kits/make-docs/` by hand ([R-007 Urgent Fix During the Freeze](03-open-questions-and-risk-register.md#r-007-urgent-fix-during-the-freeze)).
- From the switch point on, all Make Docs work happens in this repository.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, section 3)
- [`make-docs v2.0.6: .make-docs/config.yaml:1`](../../kits/make-docs/.make-docs/config.yaml)

### Build in the Root Workspace

The repository has one private npm workspace and one lockfile ([Q-005 One Root npm Workspace](03-open-questions-and-risk-register.md#q-005-one-root-npm-workspace)). [02 Architecture Overview](02-architecture-overview.md#configuration-surfaces) owns its shape. At `v2.0.6` the old repository has its own workspace root, `make-docs-monorepo`, with the workspaces `packages/*`, Node `>=24.0.0`, and the scripts `build`, `test`, `validate:defaults` and the `smoke:pack` scripts ([`make-docs v2.0.6: package.json:2`](https://github.com/brucewaynedecoy/make-docs/blob/v2.0.6/package.json), [`make-docs v2.0.6: package.json:8`](https://github.com/brucewaynedecoy/make-docs/blob/v2.0.6/package.json), [`make-docs v2.0.6: package.json:10`](https://github.com/brucewaynedecoy/make-docs/blob/v2.0.6/package.json), [`make-docs v2.0.6: package.json:13`](https://github.com/brucewaynedecoy/make-docs/blob/v2.0.6/package.json)).

Two Make Docs build files find the repository root from their own folder:

- `tsup.config.ts` sets `repoRoot = path.resolve(packageDir, "../..")` ([`make-docs v2.0.6: packages/cli/tsup.config.ts:7`](../../kits/make-docs/packages/cli/tsup.config.ts)). Its `yaml-browser-entry` plugin loads `yaml` from `path.join(repoRoot, "node_modules/yaml/browser/index.js")` ([`make-docs v2.0.6: packages/cli/tsup.config.ts:27`](../../kits/make-docs/packages/cli/tsup.config.ts)). Under `kits/make-docs/packages/cli/`, `repoRoot` is `kits/make-docs/`. The root workspace hoists `node_modules` to the repository root, so `kits/make-docs/node_modules/yaml/` does not exist and the `v2.0.6` build fails. The copy in `kits/make-docs/` resolves `yaml` through Node module resolution from the package folder, so the build passes from the repository root ([R-006 Make Docs Tests That Assume the Repository Root](03-open-questions-and-risk-register.md#r-006-make-docs-tests-that-assume-the-repository-root)).
- `scripts/copy-template-to-cli.mjs` also finds `repoRoot` from its own folder ([`make-docs v2.0.6: scripts/copy-template-to-cli.mjs:7`](../../kits/make-docs/scripts/copy-template-to-cli.mjs)). Under `kits/make-docs/scripts/`, `repoRoot` is `kits/make-docs/`, which holds `packages/docs/template/`. This script reads no `node_modules` path, so the root workspace does not break it.

Requirements:

- `npm ci` from the repository root installs every workspace from the root `package-lock.json`.
- The build and all Make Docs tests pass from the repository root on Linux, macOS and Windows.
- The Make Docs build resolves `yaml` through the workspace, not through a fixed `node_modules` path.
- Every workflow uses Node 24, as Make Docs CI does today ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:65`](../../kits/make-docs/.github/workflows/platform-safety.yml)).

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Context; Decision, section 2)
- [`make-docs v2.0.6: packages/cli/tsup.config.ts:7`](../../kits/make-docs/packages/cli/tsup.config.ts)
- [`make-docs v2.0.6: packages/cli/tsup.config.ts:27`](../../kits/make-docs/packages/cli/tsup.config.ts)
- [`make-docs v2.0.6: scripts/copy-template-to-cli.mjs:7`](../../kits/make-docs/scripts/copy-template-to-cli.mjs)

### CI

GitHub reads workflows only at the git root, so every workflow lives in the root `.github/workflows/` ([Q-010 CI Layout and Release Tags](03-open-questions-and-risk-register.md#q-010-ci-layout-and-release-tags)). Each kit has its own CI workflow.

At `v2.0.6`, Make Docs CI is `platform-safety.yml`. There is no `make-docs-ci.yml`.

- It runs on `pull_request` and `workflow_dispatch`. It has no push trigger and no `on.paths` filter ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:3`](../../kits/make-docs/.github/workflows/platform-safety.yml)).
- A `changes` job runs `git diff HEAD^1 HEAD` over a fixed path list to decide whether the package jobs run ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:31`](../../kits/make-docs/.github/workflows/platform-safety.yml)).
- `platform-contract` runs on `ubuntu-latest`, `macos-latest` and `windows-latest`. On Windows it runs the tests with `--no-file-parallelism --maxWorkers=1` ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:43`](../../kits/make-docs/.github/workflows/platform-safety.yml)).
- `package-candidate` builds one tarball on Ubuntu and records its identity with the package proof script ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:97`](../../kits/make-docs/.github/workflows/platform-safety.yml), [`make-docs v2.0.6: .github/workflows/platform-safety.yml:140`](../../kits/make-docs/.github/workflows/platform-safety.yml)).
- `installed-package` installs that tarball on the three operating systems ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:172`](../../kits/make-docs/.github/workflows/platform-safety.yml)). `compare-installed-package` compares the results ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:249`](../../kits/make-docs/.github/workflows/platform-safety.yml)).
- `pr-merge-gate` is the single result job ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:284`](../../kits/make-docs/.github/workflows/platform-safety.yml)).

Requirements:

- `.github/workflows/make-docs-ci.yml` runs when a pull request changes a file under `kits/make-docs/` or `packages/core/`, or changes the root `package-lock.json`.
- `make-docs-ci.yml` runs the Make Docs tests on `ubuntu-latest`, `macos-latest` and `windows-latest`.
- `make-docs-ci.yml` runs the package proof: it builds one tarball, installs it on the three operating systems and compares the results.
- Every path in `make-docs-ci.yml` resolves inside this repository. The `v2.0.6` paths that need the `kits/make-docs/` prefix are the diff path list ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:32`](../../kits/make-docs/.github/workflows/platform-safety.yml)), `packages/cli/tsconfig.json` ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:72`](../../kits/make-docs/.github/workflows/platform-safety.yml)), the proof script ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:140`](../../kits/make-docs/.github/workflows/platform-safety.yml)) and `packages/cli/package.json` ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:150`](../../kits/make-docs/.github/workflows/platform-safety.yml)).
- Each workflow has `contents: read` as its default permission.

Whether the core and the setup tool get their own CI workflows is open ([Q-034 CI for the Core and the Setup Tool](03-open-questions-and-risk-register.md#q-034-ci-for-the-core-and-the-setup-tool)).

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, section 12)
- [`make-docs v2.0.6: .github/workflows/platform-safety.yml:3`](../../kits/make-docs/.github/workflows/platform-safety.yml)
- [`make-docs v2.0.6: .github/workflows/platform-safety.yml:31`](../../kits/make-docs/.github/workflows/platform-safety.yml)

### Publish

One shared `.github/workflows/publish-npm.yml` publishes every package. Each npm package trusts that same workflow file ([Q-010 CI Layout and Release Tags](03-open-questions-and-risk-register.md#q-010-ci-layout-and-release-tags)).

At `v2.0.6`, `publish-npm.yml` publishes only `@brucewaynedecoy/make-docs`:

- A published GitHub Release starts it ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:3`](../../kits/make-docs/.github/workflows/publish-npm.yml)).
- It gets a short-lived npm identity over OIDC with `id-token: write` ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:16`](../../kits/make-docs/.github/workflows/publish-npm.yml)). It pins npm 11.17.0 ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:32`](../../kits/make-docs/.github/workflows/publish-npm.yml)). It uses no npm token ([`make-docs v2.0.6: RELEASING.md:19`](../../kits/make-docs/RELEASING.md)).
- It checks that the tag is on `origin/main` ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:40`](../../kits/make-docs/.github/workflows/publish-npm.yml)), that the package name is `@brucewaynedecoy/make-docs` ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:46`](../../kits/make-docs/.github/workflows/publish-npm.yml)), that the tag is `v<version>` ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:47`](../../kits/make-docs/.github/workflows/publish-npm.yml), [`make-docs v2.0.6: .github/workflows/publish-npm.yml:50`](../../kits/make-docs/.github/workflows/publish-npm.yml)), that the prerelease flag matches a hyphen in the version ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:51`](../../kits/make-docs/.github/workflows/publish-npm.yml)), and that the version is not on npm yet ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:54`](../../kits/make-docs/.github/workflows/publish-npm.yml)).
- It builds, tests and packs the tarball, and it checks that the tarball holds `LICENSE` ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:68`](../../kits/make-docs/.github/workflows/publish-npm.yml), [`make-docs v2.0.6: .github/workflows/publish-npm.yml:89`](../../kits/make-docs/.github/workflows/publish-npm.yml)).
- It matches the tarball against `.github/release-candidates/${RELEASE_TAG}.sha256` ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:102`](../../kits/make-docs/.github/workflows/publish-npm.yml)).
- It runs `npm stage publish "$TARBALL" --access public --tag "$DIST_TAG" --provenance` ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:119`](../../kits/make-docs/.github/workflows/publish-npm.yml)). This is staged publishing. A maintainer approves the stage on npmjs.com with two-factor authentication before the version is public ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:121`](../../kits/make-docs/.github/workflows/publish-npm.yml), [`make-docs v2.0.6: RELEASING.md:28`](../../kits/make-docs/RELEASING.md)).
- A prerelease is staged with the `next` dist-tag, and a stable version with `latest` ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:94`](../../kits/make-docs/.github/workflows/publish-npm.yml)).

Requirements:

- A published GitHub Release with a release tag starts the shared `publish-npm.yml`. The tag prefix selects one package, as [Release Tags and Packages](#release-tags-and-packages) shows.
- The workflow publishes with npm trusted publishing over OIDC and with `--provenance`. No workflow and no repository secret holds an npm token.
- The workflow keeps every `v2.0.6` check for the selected package: the tag is on `origin/main`, the package name matches the tag prefix, the version matches the tag, the prerelease flag matches the version, the version is not on npm yet, the tarball holds `LICENSE`, and the tarball matches its reviewed digest.
- The workflow stages the tarball with `npm stage publish`. The owner approves the stage on npmjs.com before the version is public.
- After its first trusted publish, each package has the npm setting "Require two-factor authentication and disallow tokens", as Make Docs has today ([`make-docs v2.0.6: RELEASING.md:35`](../../kits/make-docs/RELEASING.md)).
- Each npm package page shows a provenance link to `brucewaynedecoy/make-kit` and the workflow `publish-npm.yml`.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Context: provenance needs a public repository; Decision, section 12)
- [`make-docs v2.0.6: .github/workflows/publish-npm.yml:119`](../../kits/make-docs/.github/workflows/publish-npm.yml)
- [`make-docs v2.0.6: RELEASING.md:12`](../../kits/make-docs/RELEASING.md)

### Release Gate

The release gate keeps a release from a new path off `latest` until it has passed on `next` ([Q-011 Switch Test](03-open-questions-and-risk-register.md#q-011-switch-test)). It applies to every stable release of every package ([Q-032 Release Gate Scope](03-open-questions-and-risk-register.md#q-032-release-gate-scope)). The switch point release, Make Docs 2.0.7, is its first use.

At `v2.0.6`, no workflow runs `npm publish --dry-run`. It is only a local step in the Make Docs maintainer notes ([`make-docs v2.0.6: packages/cli/src/README.md:215`](../../kits/make-docs/packages/cli/src/README.md)). A stable version is staged straight to `latest` ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:94`](../../kits/make-docs/.github/workflows/publish-npm.yml)). No CI job installs the package from npm after it is published. The Make Docs release channels are `next` for release candidates and `latest` for stable versions ([`make-docs v2.0.6: docs/prd/16-package-runtime-and-deployment-boundaries.md:33`](../../kits/make-docs/docs/prd/16-package-runtime-and-deployment-boundaries.md)).

The gate has these steps, in order:

1. A pull request runs the package proof and `npm publish --dry-run` for the package.
2. A release candidate, `<version>-rc.<n>`, is published on the `next` dist-tag, and the owner approves it on npmjs.com.
3. CI installs the release candidate from npm on Linux, macOS and Windows, runs `<cli> --version` and sets up a temporary project.
4. Only then is `<version>` published on `latest`, with the same code as the release candidate, and the owner approves it on npmjs.com.
5. The install check of step 3 runs again for `<version>`.

Requirements:

- While a release candidate is on `next` and its install check has not passed, `npm view <package> dist-tags --json` shows `latest` at the earlier stable version.
- `latest` points to `<version>` only after the install check of its release candidate has passed on Linux, macOS and Windows.
- The install check installs the package from the npm registry, not from a local tarball.
- The install check for a CLI package prints the expected version from `<cli> --version` on each operating system.
- For the core, which has no CLI, the install check installs the release candidate from npm into a temporary project and loads the package entry point in place of `<cli> --version`.

A Make Docs user who installs from `latest` gets no version from the new release path until that path has passed on the `next` dist-tag. This is an observable outcome of the release gate. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind it. Evidence: Automated Implementation Testing, with `2.0.7-rc.0` on `next` and its install check, then `2.0.7` on `latest` and the install check again.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Human Experience Intent; Decision, section 3: the switch test)
- [`make-docs v2.0.6: .github/workflows/publish-npm.yml:94`](../../kits/make-docs/.github/workflows/publish-npm.yml)
- [`make-docs v2.0.6: packages/cli/src/README.md:215`](../../kits/make-docs/packages/cli/src/README.md)

### Switch Point

The switch point is Make Docs 2.0.7, the first Make Docs release from this repository. It comes before the core ([Q-002 Switch Point Before the Core](03-open-questions-and-risk-register.md#q-002-switch-point-before-the-core)). Make Docs 2.0.7 has the same code as 2.0.6.

The switch test has these steps, in order ([Q-011 Switch Test](03-open-questions-and-risk-register.md#q-011-switch-test)):

1. A pull request runs the package proof and `npm publish --dry-run`.
2. The 2.0.7 tarball is compared with the 2.0.6 tarball.
3. The owner sets the npm trusted publisher of `@brucewaynedecoy/make-docs` to the repository `make-kit` and the workflow `publish-npm.yml`.
4. `2.0.7-rc.0` is published on the `next` dist-tag, and the owner approves it on npmjs.com.
5. CI installs it from npm on Linux, macOS and Windows, runs `make-docs --version`, and sets up a temporary project.
6. `2.0.7` is published on `latest`, and the install check runs again.

Requirements:

- The 2.0.7 tarball has the same file list as the 2.0.6 tarball. The compare ignores the content-hash part of each `dist/<name>-<hash>.js` and `dist/<name>-<hash>.js.map` name ([R-008 Build Output of 2.0.7 Differs From 2.0.6](03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206)).
- Apart from the version number, the 2.0.7 files differ from 2.0.6 only in repository links. Repository links are the `repository`, `homepage` and `bugs` fields of `package.json` ([`make-docs v2.0.6: packages/cli/package.json:8`](../../kits/make-docs/packages/cli/package.json), [`make-docs v2.0.6: packages/cli/package.json:10`](../../kits/make-docs/packages/cli/package.json), [`make-docs v2.0.6: packages/cli/package.json:12`](../../kits/make-docs/packages/cli/package.json)) and the GitHub links in the tarball `README.md` ([`make-docs v2.0.6: packages/cli/README.md:50`](../../kits/make-docs/packages/cli/README.md)).
- If the release candidate fails, the owner sets the trusted publisher back to the repository `make-docs`, and the old repository stays the release source.
- After the switch point, `npm view @brucewaynedecoy/make-docs@2.0.7 name` prints `@brucewaynedecoy/make-docs`, and `npm install -g @brucewaynedecoy/make-docs` installs a CLI named `make-docs`.

A Make Docs user sees no change to the npm package name or the install commands after the switch point. This is an observable outcome of the switch point. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind it. Evidence: Automated Implementation Testing, with the tarball compare of 2.0.7 with 2.0.6 and the install check from npm on Linux, macOS and Windows. A broken release at the switch point is a tracked risk ([R-003 Broken Release at the Switch Point](03-open-questions-and-risk-register.md#r-003-broken-release-at-the-switch-point)). A 2.0.7 build output that differs from 2.0.6 in more than repository links is also a tracked risk ([R-008 Build Output of 2.0.7 Differs From 2.0.6](03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206)).

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Human Experience Intent; Decision, section 3)
- [`make-docs v2.0.6: packages/cli/package.json:2`](../../kits/make-docs/packages/cli/package.json)
- [`make-docs v2.0.6: packages/cli/README.md:50`](../../kits/make-docs/packages/cli/README.md)
- [`make-docs v2.0.6: RELEASING.md:12`](../../kits/make-docs/RELEASING.md)

### Public Repository

The repository is public before the switch point ([Q-004 Public Repository Before the Switch](03-open-questions-and-risk-register.md#q-004-public-repository-before-the-switch)). npm makes provenance only from a public repository, and a private repository on the free GitHub plan gets no rulesets.

Two steps before the public step are done. On 2026-11-01 the `make-kit` commits were rewritten to the owner's personal email ([Q-022 Work Email in Commit History](03-open-questions-and-risk-register.md#q-022-work-email-in-commit-history)). On 2026-11-01 the owner deleted the GitHub repository and created it again with the same name, so each of the 6 commit IDs from before the email rewrite returns "No commit found" on GitHub ([Q-026 Old Commit IDs on GitHub](03-open-questions-and-risk-register.md#q-026-old-commit-ids-on-github)).

Requirements:

- Before the repository goes public, a scan of every tracked file and every commit in the git history finds no secret, no client data, no local home-folder path and no work email address.
- Before the repository goes public, each of the 14 old commit IDs still returns "No commit found" on GitHub: the 6 from before the email rewrite ([Q-026 Old Commit IDs on GitHub](03-open-questions-and-risk-register.md#q-026-old-commit-ids-on-github)) and the 8 from before the client-name rewrite ([Q-040 Client Names in the Committed History](03-open-questions-and-risk-register.md#q-040-client-names-in-the-committed-history)).
- Commits in this repository use the owner's personal email, or a GitHub noreply or bot address, such as the address that GitHub uses for web merges or the Dependabot address ([Q-041 Dependabot Pull Requests Before the Public Step](03-open-questions-and-risk-register.md#q-041-dependabot-pull-requests-before-the-public-step)). No commit uses the work email ([Q-022 Work Email in Commit History](03-open-questions-and-risk-register.md#q-022-work-email-in-commit-history)).
- The repository stays public from the public step on.

Exposed history is a tracked risk ([R-004 Exposed History in the Public Repository](03-open-questions-and-risk-register.md#r-004-exposed-history-in-the-public-repository)).

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Context; Decision, section 1; Consequences: trade-offs and risks)

### Rulesets and Ownership

The rulesets match the old repository, with release tag rules beside them. At `v2.0.6`, `main` in the old repository requires pull requests and blocks force pushes and deletion. Merging needs no approval and no passing check ([`make-docs v2.0.6: RELEASING.md:9`](../../kits/make-docs/RELEASING.md)). The old repository has three code owners ([`make-docs v2.0.6: .github/CODEOWNERS:1`](../../kits/make-docs/.github/CODEOWNERS)). Its Dependabot config watches npm at `/`, weekly on Monday at 09:00 America/Chicago, with at most 5 open pull requests, and has no `github-actions` entry ([`make-docs v2.0.6: .github/dependabot.yml:3`](../../kits/make-docs/.github/dependabot.yml)).

Requirements:

- A ruleset protects `main`: changes reach it only through pull requests, and force pushes and deletion are blocked.
- A pull request to `main` needs 0 approvals, so the owner can merge their own pull requests.
- A push that moves or deletes an existing release tag is refused.
- Only the owner can create a release tag.
- `.github/CODEOWNERS` names the owner as the only code owner, with the line `* @brucewaynedecoy` ([Q-013 Code Owners](03-open-questions-and-risk-register.md#q-013-code-owners)).
- `.github/dependabot.yml` watches the root `package-lock.json` through the npm ecosystem at the folder `/`.
- Each work backlog phase uses one branch and one pull request.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 1 and 12)
- [`make-docs v2.0.6: RELEASING.md:9`](../../kits/make-docs/RELEASING.md)
- [`make-docs v2.0.6: .github/CODEOWNERS:1`](../../kits/make-docs/.github/CODEOWNERS)
- [`make-docs v2.0.6: .github/dependabot.yml:3`](../../kits/make-docs/.github/dependabot.yml)

### License

One root MIT `LICENSE` covers the whole Make Kit stack: the core, the setup tool and every kit ([Q-018 License](03-open-questions-and-risk-register.md#q-018-license)). At `v2.0.6` the old repository has two identical MIT files, the root `LICENSE` and `packages/cli/LICENSE`. The tarball ships `packages/cli/LICENSE` ([`make-docs v2.0.6: LICENSE:3`](../../kits/make-docs/LICENSE), [`make-docs v2.0.6: packages/cli/LICENSE:3`](../../kits/make-docs/packages/cli/LICENSE)). The earlier `1.0.0-rc.1` release stays under Apache-2.0 ([`make-docs v2.0.6: RELEASING.md:5`](../../kits/make-docs/RELEASING.md)).

Requirements:

- The repository root holds an MIT `LICENSE`.
- `kits/make-docs/LICENSE` stays in place.
- Every published tarball holds an MIT `LICENSE` file.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, section 1)
- [`make-docs v2.0.6: LICENSE:3`](../../kits/make-docs/LICENSE)
- [`make-docs v2.0.6: packages/cli/LICENSE:3`](../../kits/make-docs/packages/cli/LICENSE)

### Old Repository

After `2.0.7` is on `latest`, the old `make-docs` repository is frozen ([Q-012 Old Repository Freeze](03-open-questions-and-risk-register.md#q-012-old-repository-freeze)). It stays readable for its history. The client-data cleanup of the old repository is deferred as [O-006 Client Data in the Old Make Docs Repository](03-open-questions-and-risk-register.md#o-006-client-data-in-the-old-make-docs-repository), and cleanup option A needs a change to the rule below that the old history is not rewritten and to [Q-024 Old Make Docs History](03-open-questions-and-risk-register.md#q-024-old-make-docs-history) first.

Requirements:

- The old repository README has a banner that points to `kits/make-docs/` in `make-kit`.
- The old repository has no `.github/workflows/publish-npm.yml` and no `.github/dependabot.yml`.
- The old repository has no open Dependabot pull requests.
- The old repository is not archived.
- The old repository history is not rewritten ([Q-024 Old Make Docs History](03-open-questions-and-risk-register.md#q-024-old-make-docs-history)).
- Each change to the old repository needs the owner's clear yes.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 1 and 3)
- [`make-docs v2.0.6: .github/workflows/publish-npm.yml`](../../kits/make-docs/.github/workflows/publish-npm.yml)
- [`make-docs v2.0.6: .github/dependabot.yml`](../../kits/make-docs/.github/dependabot.yml)

## Contracts and Data

### Release Tags and Packages

A release tag names the package: `<package>-v<version>`. `<version>` is a semantic version, with an optional prerelease part such as `-rc.0`.

| Tag prefix | Package folder | npm package | Example tag |
| --- | --- | --- | --- |
| `make-docs` | `kits/make-docs/packages/cli/` | `@brucewaynedecoy/make-docs` | `make-docs-v2.0.7` |
| `make-core` | `packages/core/` | `@brucewaynedecoy/make-core` | `make-core-v0.1.0` |
| `make-kit` | `packages/kit/` | `@brucewaynedecoy/make-kit` | None yet |
| `make-blueprint` | The Make Blueprint CLI folder in [Make Blueprint 02 Architecture Overview](../../kits/make-blueprint/docs/prd/02-architecture-overview.md#module-map) | `@brucewaynedecoy/make-blueprint` | None yet |

Requirements:

- The publish workflow refuses a tag whose prefix is not in the table.
- The publish workflow refuses a tag whose version differs from the `version` field of the selected package.
- A tag with a prerelease part publishes on `next`. A tag with no prerelease part publishes on `latest`.

### Release-Candidate Digests

A release-candidate digest is the SHA-256 of the reviewed tarball, as one lowercase hex line. It is reviewed in a pull request before the release, as Make Docs does today ([`make-docs v2.0.6: RELEASING.md:24`](../../kits/make-docs/RELEASING.md)).

| Use | `v2.0.6` file name | Target file name |
| --- | --- | --- |
| CI package check | `.github/release-candidates/v<version>.sha256` ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:151`](../../kits/make-docs/.github/workflows/platform-safety.yml)) | `.github/release-candidates/<tag>.sha256` |
| Publish check | `.github/release-candidates/<tag>.sha256` ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:102`](../../kits/make-docs/.github/workflows/publish-npm.yml)) | `.github/release-candidates/<tag>.sha256` |

At `v2.0.6` the two names are the same only because the tag is `v<version>`. The only digest file at `v2.0.6` is [`make-docs v2.0.6: .github/release-candidates/v2.0.6.sha256:1`](../../kits/make-docs/.github/release-candidates/v2.0.6.sha256).

Requirements:

- CI and the publish workflow read the same digest file, `.github/release-candidates/<tag>.sha256`, such as `.github/release-candidates/make-docs-v2.0.7-rc.0.sha256`.
- A release candidate and its stable version each have their own digest file.

### Package Metadata

At `v2.0.6` the Make Docs package metadata points to the old repository: `repository.url` is `git+https://github.com/brucewaynedecoy/make-docs.git`, `homepage` is `https://github.com/brucewaynedecoy/make-docs#readme`, and `bugs.url` is `https://github.com/brucewaynedecoy/make-docs/issues` ([`make-docs v2.0.6: packages/cli/package.json:8`](../../kits/make-docs/packages/cli/package.json), [`make-docs v2.0.6: packages/cli/package.json:10`](../../kits/make-docs/packages/cli/package.json), [`make-docs v2.0.6: packages/cli/package.json:12`](../../kits/make-docs/packages/cli/package.json)). The package `files` are `dist`, `template`, `skill-registry.json`, `skill-registry.schema.json` and `README.md`. npm adds `LICENSE` ([`make-docs v2.0.6: packages/cli/package.json:18`](../../kits/make-docs/packages/cli/package.json)).

Requirements:

- From 2.0.7 on, `repository.url`, `homepage` and `bugs.url` of every published package point to `github.com/brucewaynedecoy/make-kit`.
- The GitHub links in each published `README.md` point to `github.com/brucewaynedecoy/make-kit`.
- The npm name, the `bin` name, the `files` list and the Node engine of `@brucewaynedecoy/make-docs` stay the same in 2.0.7.

### Trusted Publisher Settings

| Setting on npmjs.com | `@brucewaynedecoy/make-docs` at `v2.0.6` | Target for each package |
| --- | --- | --- |
| Organization or user | `brucewaynedecoy` | `brucewaynedecoy` |
| Repository | `make-docs` | `make-kit` |
| Workflow filename | `publish-npm.yml` | `publish-npm.yml` |
| Environment name | Empty | Empty, as today |
| Allowed actions | `npm stage publish` only. Direct `npm publish` is not allowed. | The same as today |

Source: [`make-docs v2.0.6: RELEASING.md:12`](../../kits/make-docs/RELEASING.md).

Whether a trusted publisher can be set for a package that is not on npm yet is open ([Q-033 First Trusted Publish of a New Package](03-open-questions-and-risk-register.md#q-033-first-trusted-publish-of-a-new-package)). It must be confirmed before the core release.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 3, 7 and 12)
- [`make-docs v2.0.6: .github/workflows/publish-npm.yml:47`](../../kits/make-docs/.github/workflows/publish-npm.yml)
- [`make-docs v2.0.6: .github/workflows/publish-npm.yml:102`](../../kits/make-docs/.github/workflows/publish-npm.yml)
- [`make-docs v2.0.6: .github/workflows/platform-safety.yml:151`](../../kits/make-docs/.github/workflows/platform-safety.yml)

## Integrations

| Party | What this flow uses | Rule owner |
| --- | --- | --- |
| GitHub Actions | The root `.github/workflows/`, hosted runners for `ubuntu-latest`, `macos-latest` and `windows-latest`, and an OIDC token for the publish job | This document |
| GitHub Releases | A published release with a release tag starts the publish workflow. Published releases are immutable ([`make-docs v2.0.6: RELEASING.md:26`](../../kits/make-docs/RELEASING.md)). | This document |
| GitHub rulesets | Protect `main` and the release tags | This document |
| npm | Trusted publishing, staged packages, the `next` and `latest` dist-tags, and provenance | This document |
| Root npm workspace | `npm ci`, the build and the tests from the repository root | [02 Architecture Overview](02-architecture-overview.md#configuration-surfaces) |
| The core | Each kit release on the core pins one exact published core version, and the release build fails on an unpublished core | [06 Shared Core](06-shared-core.md#core-versions-and-the-exact-pin) |
| Make Docs maintainer notes | `RELEASING.md`, copied into `kits/make-docs/` on copy day | The Make Docs PRD set |
| The old repository | The release source until the switch point, then frozen | This document |

The Make Docs PRDs at `v2.0.6` state the current release rules: [`make-docs v2.0.6: docs/prd/10-packaging-validation-and-release-reference.md`](../../kits/make-docs/docs/prd/10-packaging-validation-and-release-reference.md) (Maintainer Release Procedure; Candidate Artifact and Publication Identity) and [`make-docs v2.0.6: docs/prd/16-package-runtime-and-deployment-boundaries.md`](../../kits/make-docs/docs/prd/16-package-runtime-and-deployment-boundaries.md) (Requirements).

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, section 12)
- [`make-docs v2.0.6: RELEASING.md:26`](../../kits/make-docs/RELEASING.md)

## Rebuild Notes

- **Use one digest name.** CI and publish name the digest file differently at `v2.0.6` ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:151`](../../kits/make-docs/.github/workflows/platform-safety.yml), [`make-docs v2.0.6: .github/workflows/publish-npm.yml:102`](../../kits/make-docs/.github/workflows/publish-npm.yml)). With package-named tags, the two names differ, and the CI check fails.
- **Fix every fixed path.** The publish workflow reads `packages/cli/package.json` and runs `cd packages/cli` ([`make-docs v2.0.6: .github/workflows/publish-npm.yml:43`](../../kits/make-docs/.github/workflows/publish-npm.yml), [`make-docs v2.0.6: .github/workflows/publish-npm.yml:58`](../../kits/make-docs/.github/workflows/publish-npm.yml), [`make-docs v2.0.6: .github/workflows/publish-npm.yml:80`](../../kits/make-docs/.github/workflows/publish-npm.yml), [`make-docs v2.0.6: .github/workflows/publish-npm.yml:86`](../../kits/make-docs/.github/workflows/publish-npm.yml)). CI also uses workspace names such as `npm run prepack -w packages/cli`. Each path needs the package folder from the tag table.
- **The `tsup` path breaks under the root workspace.** See [Build in the Root Workspace](#build-in-the-root-workspace).
- **Provenance checks the repository link.** npm compares `repository.url` in `package.json` with the repository in the provenance statement. A package that still names `make-docs` fails to publish from `make-kit`.
- **Bundle text can carry paths.** The Make Docs build bundles `yaml`, `zod` and `@clack/*` and writes source maps ([`make-docs v2.0.6: packages/cli/tsup.config.ts:20`](../../kits/make-docs/packages/cli/tsup.config.ts)). A changed `node_modules` path or a changed dependency version in the root lockfile changes the bundle and map text. The 2.0.7 compare with 2.0.6 then shows more than repository links.
- **A path-filtered workflow can block a required check.** A workflow that a path filter skips reports no result. If a ruleset ever requires its check, the `v2.0.6` pattern of one result job that always runs ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:284`](../../kits/make-docs/.github/workflows/platform-safety.yml)) avoids a check that waits forever.
- **A Make Docs patch during the core slices needs its own path.** A release build fails on an unpublished core, so a 2.1.x fix cannot ship from `main` while Make Docs uses the workspace link ([R-009 Urgent Make Docs Fix During the Core Slices](03-open-questions-and-risk-register.md#r-009-urgent-make-docs-fix-during-the-core-slices)).
- **Windows tests run one at a time.** Keep `--no-file-parallelism --maxWorkers=1` on Windows ([`make-docs v2.0.6: .github/workflows/platform-safety.yml:43`](../../kits/make-docs/.github/workflows/platform-safety.yml)).
- **npm takes `LICENSE` from the package folder.** A root `LICENSE` alone does not reach a tarball. Each published package folder needs its own `LICENSE`.
- **A rejected stage leaves the GitHub Release.** Use a new version and a new tag for a corrected release ([`make-docs v2.0.6: RELEASING.md:31`](../../kits/make-docs/RELEASING.md)).
- **The copied `RELEASING.md` describes the old flow.** After copy day, `kits/make-docs/RELEASING.md` still names the repository `make-docs` and `v<version>` tags ([`make-docs v2.0.6: RELEASING.md:12`](../../kits/make-docs/RELEASING.md), [`make-docs v2.0.6: RELEASING.md:25`](../../kits/make-docs/RELEASING.md)).

Code anchors:

- [`make-docs v2.0.6: .github/workflows/platform-safety.yml:151`](../../kits/make-docs/.github/workflows/platform-safety.yml)
- [`make-docs v2.0.6: .github/workflows/publish-npm.yml:102`](../../kits/make-docs/.github/workflows/publish-npm.yml)
- [`make-docs v2.0.6: packages/cli/tsup.config.ts:20`](../../kits/make-docs/packages/cli/tsup.config.ts)
- [`make-docs v2.0.6: RELEASING.md:31`](../../kits/make-docs/RELEASING.md)

## Source Anchors

- [Make Kit Monorepo](../designs/2026-10-30-make-kit-monorepo.md) design, sections 1, 3, 11 and 12
- [Make Kit Monorepo Baseline Plan](../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md) and its [Phase 3](../plans/2026-11-01-w1-r0-make-kit-monorepo/03-core-setup-and-release.md)
- [Q-010 CI Layout and Release Tags](03-open-questions-and-risk-register.md#q-010-ci-layout-and-release-tags), [Q-011 Switch Test](03-open-questions-and-risk-register.md#q-011-switch-test), [Q-012 Old Repository Freeze](03-open-questions-and-risk-register.md#q-012-old-repository-freeze)
- [`make-docs v2.0.6: .github/workflows/platform-safety.yml`](../../kits/make-docs/.github/workflows/platform-safety.yml)
- [`make-docs v2.0.6: .github/workflows/publish-npm.yml`](../../kits/make-docs/.github/workflows/publish-npm.yml)
- [`make-docs v2.0.6: .github/CODEOWNERS`](../../kits/make-docs/.github/CODEOWNERS)
- [`make-docs v2.0.6: .github/dependabot.yml`](../../kits/make-docs/.github/dependabot.yml)
- [`make-docs v2.0.6: RELEASING.md`](../../kits/make-docs/RELEASING.md)
- [`make-docs v2.0.6: packages/cli/package.json`](../../kits/make-docs/packages/cli/package.json)
- [`make-docs v2.0.6: packages/cli/tsup.config.ts`](../../kits/make-docs/packages/cli/tsup.config.ts)
