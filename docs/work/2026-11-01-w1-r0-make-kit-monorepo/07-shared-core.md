---
title: "Phase 7: Shared Core"
kind: "work"
status: "active"
coordinate: "W1 R0 P7"
source:
  type: "prd"
  path: "docs/prd/06-shared-core.md"
---

# Phase 7: Shared Core

## Purpose

This phase builds the shared core, `@brucewaynedecoy/make-core`, in `packages/core/` from the copied Make Docs code, publishes core `0.1.0`, and releases Make Docs 2.2.0 on that core with an exact pin, tag-aware managed blocks and the uninstall fix ([Q-016](../../prd/03-open-questions-and-risk-register.md#q-016-core-extraction-order), [Q-007](../../prd/03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)). It is step 9 of the Step 0 sequence ([Q-021](../../prd/03-open-questions-and-risk-register.md#q-021-step-0-sequence)).

The phase depends on [Phase 6](06-nested-project-fixes.md). Core `0.1.0` does not ship before Make Docs 2.1.0 is on `latest` ([01 Product Overview, Release Scope](../../prd/01-product-overview.md#release-scope)).

## Overview

The core is built in slices, from the parts that are easy to pull out of Make Docs to the parts that are tangled with Make Docs product code. After each slice, all Make Docs tests pass, and Make Docs behaves as 2.1.0 does ([06 Shared Core, Slice Order](../../prd/06-shared-core.md#slice-order)). Each kit passes its own names to the core, so the core holds no kit name ([06 Shared Core, Kit Names as Inputs](../../prd/06-shared-core.md#kit-names-as-inputs)). Tool discovery is new code ([06 Shared Core, Tool Discovery](../../prd/06-shared-core.md#tool-discovery)). The Store keeps schema version 6 in every Step 0 release ([06 Shared Core, Store Base and Schema Version 6](../../prd/06-shared-core.md#store-base-and-schema-version-6)).

[06 Shared Core, Slice Order](../../prd/06-shared-core.md#slice-order) leaves the exact order of the middle band to this backlog. This backlog sets it in Stage 3: layout and paths, then the Store base without the migrations, then the MCP server and profiles without the registry, then agent-tool setup, then tool discovery. Each later part uses the paths of the first part. The MCP server reads the connection-key hash from the machine folder. Agent-tool setup writes the MCP entries that the server answers. Tool discovery uses the layout part and the block library.

Three open register items gate this phase:

- [Q-034](../../prd/03-open-questions-and-risk-register.md#q-034-ci-for-the-core-and-the-setup-tool) must close (t1) before any CI work in this phase.
- [Q-031](../../prd/03-open-questions-and-risk-register.md#q-031-store-version-counter-for-base-and-kit-tables) must close (t19) before the Store slice (t20), the last-band slice that moves the Store migrations into the core.
- [Q-033](../../prd/03-open-questions-and-risk-register.md#q-033-first-trusted-publish-of-a-new-package) must close (t25) before the core trusted-publisher setup (t26) and the publish of core `0.1.0`.

The Make Docs PRD changes for 2.2.0 go through a Make Docs change plan in `kits/make-docs/docs/`, because the Make Docs PRDs describe live Make Docs code.

Owner gates in this phase: `t7` (only when an urgent fix is needed), `t26`, `t28`, `t29`, `t31`, `t32`, `t33`, `t37`, `t38`, `t40` and `t41`. Each one is an npm publish or a change to the trusted publisher or the npm package settings. Only the owner can create a release tag, under the tag ruleset from Phase 2.

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `none` for the experience promises, with a preserved boundary. No promise row names this phase. The preserved boundary is the rule of [06 Shared Core, Kit Names as Inputs](../../prd/06-shared-core.md#kit-names-as-inputs) and [Store Base and Schema Version 6](../../prd/06-shared-core.md#store-base-and-schema-version-6): after 2.2.0, a live Make Docs user keeps the CLI name, the npm name, the folders, the environment names, the agent-tool entry names, the block markers and the Store. The release gate from the switch point applies again to core `0.1.0` and to 2.2.0 ([Q-032](../../prd/03-open-questions-and-risk-register.md#q-032-release-gate-scope)). The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind the boundary.
- Intended human outcome: a Make Docs user who updates to 2.2.0 sees the same commands, the same agent-tool config and the same Store records. When they run `make-docs setup remove` on a router that also holds their own text, Make Docs strips only its block and keeps their text ([D-030](../../prd/03-open-questions-and-risk-register.md#d-030-setup-remove-keeps-the-kit-block)). The `uninstall` help says that the Store stays unless `--remove-store` is set ([D-002](../../prd/03-open-questions-and-risk-register.md#d-002-uninstall-text-disagrees-with-store-removal)).
- Human-facing surface or indirect effect: the Make Docs CLI and MCP surfaces, the instruction files that `setup remove` changes, the `uninstall` help and message, the npm dist-tags, and the Make Docs Store.
- Implementation work: Stage 1 closes Q-034 and sets up the core package and its guards. Stages 2 to 4 move the core parts in three bands. Stage 5 publishes core `0.1.0`. Stage 6 releases Make Docs 2.2.0 on the core.
- Evidence source or testing type selected under current authority: Automated Implementation Testing: all Make Docs tests after each slice on the three operating systems, the kit-name search, the core dependency check, the Store test with Make Docs 2.0.6 and the new code in turn, the uninstall-fix tests, and the release gate for core `0.1.0` and Make Docs 2.2.0. For the boundary, the evidence is a compare of the 2.2.0 CLI help, MCP tool list and agent-tool entries with 2.1.0.
- Executor: the implementing coding agent and GitHub Actions. The owner for the gates.
- Accepted obligation or deferral route: none. [R-002](../../prd/03-open-questions-and-risk-register.md#r-002-two-core-versions-in-one-project) and [R-011](../../prd/03-open-questions-and-risk-register.md#r-011-project-and-machine-folders-overlap) need a second kit on the core to close. [Phase 8](08-closeout.md) records their owner and target.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | The decision record is below. |
| Performance Testing | not-needed-now | No performance candidate exists. The slices must keep Make Docs behavior, not change its speed. |
| Guided Progress Review | not-needed-now | No current decision needs a guided review. |
| Unassisted Goal Testing | not-needed-now | No PRD requires it, and 2.2.0 adds no new public path for a user to discover. |

Decision record for Automated Implementation Testing:

| Field | Value |
| --- | --- |
| Testing type | Automated Implementation Testing |
| Decision informed | Whether each slice can merge, whether core `0.1.0` can go to `latest`, and whether Make Docs 2.2.0 can go to `latest` |
| Reason now | Live Make Docs users depend on every part that the core takes over ([Q-016](../../prd/03-open-questions-and-risk-register.md#q-016-core-extraction-order)), and a wrong Store change locks Make Docs 2.0.x users out ([R-010](../../prd/03-open-questions-and-risk-register.md#r-010-store-schema-locked-at-version-6)) |
| Product maturity | New library built from live product code |
| Scope | All Make Docs tests and core tests after each slice, on `ubuntu-latest`, `macos-latest` and `windows-latest`; the surface compare with 2.1.0; the Store test; the release gate for two packages |
| Executor | The implementing coding agent, with GitHub Actions |
| Gate effect | Blocking. A slice does not merge while a Make Docs test fails. No core version is published before all eight areas are in `packages/core/`. |
| Effort budget | One full CI run for each slice pull request after its last change, and one release candidate for each package |
| Stop condition | All acceptance criteria pass, or a slice needs a Store change above version 6. In that case, stop and ask the owner. |
| Evidence retained | Run links, compare reports and `npm view` outputs in the `A701` to `A727` section of `evidence.md` |
| Rerun trigger | Any change to a slice that has already merged, and each new release candidate number |

No performance candidate applies, so this phase records no performance lifecycle fields.

Human Experience Review stays separate. In this phase the agent inspects a real router with user text before and after `make-docs setup remove` on 2.2.0, and the real `uninstall` help, and records its conclusions for the preserved boundary and the two fixes.

## Source PRD Docs

- [06 Shared Core](../../prd/06-shared-core.md)
- [05 Kit Conventions](../../prd/05-kit-conventions.md)
- [08 Build and Release](../../prd/08-build-and-release.md)
- [02 Architecture Overview](../../prd/02-architecture-overview.md)
- [01 Product Overview](../../prd/01-product-overview.md)
- [03 Open Questions and Risk Register](../../prd/03-open-questions-and-risk-register.md)

## Source Obligations, Scenarios, And Findings

- Obligations: none. O-001 to O-005 are `Fulfilled` in Phase 6.
- Open items that gate this phase: [Q-031](../../prd/03-open-questions-and-risk-register.md#q-031-store-version-counter-for-base-and-kit-tables), [Q-033](../../prd/03-open-questions-and-risk-register.md#q-033-first-trusted-publish-of-a-new-package) and [Q-034](../../prd/03-open-questions-and-risk-register.md#q-034-ci-for-the-core-and-the-setup-tool).
- Decisions carried: [Q-007](../../prd/03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0), [Q-016](../../prd/03-open-questions-and-risk-register.md#q-016-core-extraction-order), [Q-032](../../prd/03-open-questions-and-risk-register.md#q-032-release-gate-scope) and [Q-035](../../prd/03-open-questions-and-risk-register.md#q-035-scope-of-the-uninstall-fix-in-220).
- Drift closed with a set release: [D-029](../../prd/03-open-questions-and-risk-register.md#d-029-block-markers-are-not-tag-aware), [D-030](../../prd/03-open-questions-and-risk-register.md#d-030-setup-remove-keeps-the-kit-block), [D-002](../../prd/03-open-questions-and-risk-register.md#d-002-uninstall-text-disagrees-with-store-removal) and [D-039](../../prd/03-open-questions-and-risk-register.md#d-039-setup-remove-guard-uses-a-fixed-store-path), all in Make Docs 2.2.0. [D-031](../../prd/03-open-questions-and-risk-register.md#d-031-block-library-reasserts-malformed-blocks) and [D-027](../../prd/03-open-questions-and-risk-register.md#d-027-agent-tool-entries-always-run-profile-all) have no release set. The core keeps the setup behavior for malformed blocks and takes the profile name as an input, and both items stay open.
- Risks this phase addresses: [R-001](../../prd/03-open-questions-and-risk-register.md#r-001-core-release-friction), [R-002](../../prd/03-open-questions-and-risk-register.md#r-002-two-core-versions-in-one-project), [R-009](../../prd/03-open-questions-and-risk-register.md#r-009-urgent-make-docs-fix-during-the-core-slices), [R-010](../../prd/03-open-questions-and-risk-register.md#r-010-store-schema-locked-at-version-6) and [R-011](../../prd/03-open-questions-and-risk-register.md#r-011-project-and-machine-folders-overlap).
- Scenarios: none.
- Findings: none.

## Stage 1 - Open Items, Core Package and Guards

### Tasks

- [ ] t1: Close [Q-034](../../prd/03-open-questions-and-risk-register.md#q-034-ci-for-the-core-and-the-setup-tool) before any CI work in this phase. Give the owner the question and the register recommendation: in Step 0, `make-docs-ci.yml` covers `packages/core/`, because Make Docs is the only kit on the core. Record the owner's answer as the resolution, and state the CI rule for the core in [08 Build and Release, CI](../../prd/08-build-and-release.md#ci) with the PRD change process. Then change CI as the answer says, so the core tests run on Linux, macOS and Windows.
- [ ] t2: Create `packages/core/` as the package `@brucewaynedecoy/make-core` with the version `0.1.0`, an MIT `LICENSE` file in the package folder, the Node engine of Make Docs, and `repository`, `homepage` and `bugs` fields that point to `brucewaynedecoy/make-kit`, with `repository.directory` set to `packages/core` ([06 Shared Core, Core Boundary](../../prd/06-shared-core.md#core-boundary), [08 Build and Release, Package Metadata](../../prd/08-build-and-release.md#package-metadata)). npm takes `LICENSE` from the package folder ([08 Build and Release, Rebuild Notes](../../prd/08-build-and-release.md#rebuild-notes)).
- [ ] t3: Make `kits/make-docs/packages/cli/` depend on `@brucewaynedecoy/make-core` at the exact version `0.1.0`, with no range operator. During the slices, npm resolves it through the workspace link to `packages/core/` ([06 Shared Core, Core Versions and the Exact Pin](../../prd/06-shared-core.md#core-versions-and-the-exact-pin)).
- [ ] t4: Write the release-build check. It fails the Make Docs release build, and names the cause, when the core resolves to a workspace link or to a version that is not published. Run it in the publish workflow before the stage step ([06 Shared Core, Core Versions and the Exact Pin](../../prd/06-shared-core.md#core-versions-and-the-exact-pin), [R-001](../../prd/03-open-questions-and-risk-register.md#r-001-core-release-friction)).
- [ ] t5: Write a core test that searches `packages/core/src/` and the built `packages/core/dist/` for `make-docs`, `make_docs` and `MAKE_DOCS`, and finds none ([06 Shared Core, Kit Names as Inputs](../../prd/06-shared-core.md#kit-names-as-inputs)).
- [ ] t6: Write a core check that `npm ls --workspace packages/core --all` lists no `@brucewaynedecoy/make-docs`, `@brucewaynedecoy/make-blueprint` or `@brucewaynedecoy/make-kit` package, and that `packages/core/` holds no template, system resource body, Skill or router text ([06 Shared Core, Core Boundary](../../prd/06-shared-core.md#core-boundary)).
- [ ] t7: Owner gate, only when an urgent Make Docs fix is needed during the slices: the owner's clear yes in chat before any npm publish. Cut the fix from the tag `make-docs-v2.1.0`, which does not import the core, release it as `2.1.<n>` through the release gate, and port the fix to `main` ([R-009](../../prd/03-open-questions-and-risk-register.md#r-009-urgent-make-docs-fix-during-the-core-slices)).

### Acceptance criteria

- A701: Q-034 is `Closed` in the root register with the owner's answer, and [08 Build and Release, CI](../../prd/08-build-and-release.md#ci) states the CI rule for the core. A pull request that changes only `packages/core/` runs the core tests on the three operating systems.
- A702: `packages/core/package.json` names `@brucewaynedecoy/make-core` at `0.1.0` with `repository.directory` `packages/core`, and `packages/core/LICENSE` holds the MIT text. `kits/make-docs/packages/cli/package.json` names `@brucewaynedecoy/make-core` at exactly `0.1.0`.
- A703: The release-build check exits nonzero and names the workspace link while the core resolves through it, and exits nonzero and names the version when the pinned version is not on npm.
- A704: The kit-name search test and the core dependency check pass.

### Dependencies

- [Phase 6](06-nested-project-fixes.md) is complete: `2.1.0` is on `latest`.
- The owner answers Q-034.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A701` to `A704` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A701` to `A704` pass.

## Stage 2 - First Band Slices

### Tasks

- [ ] t8: Move resource reading into the core. The kit passes its URI prefix, its identity template, its catalog path and its local resource root. Make Docs passes `make-docs://system/`, `make-docs://system/{type}/{path}`, `.make-docs/system-resources.catalog.json` and `.make-docs/system/` ([06 Shared Core, Kit Names as Inputs](../../prd/06-shared-core.md#kit-names-as-inputs), [05 Kit Conventions, System Resources and Project Records](../../prd/05-kit-conventions.md#system-resources-and-project-records)).
- [ ] t9: Move the managed-block library into the core and make it tag-aware. The block code takes each kit's tag as input, and reads and writes only the markers with that tag, so two kits can each keep one block in the same instruction file. Make Docs passes `<!-- make-docs:begin -->` and `<!-- make-docs:end -->` ([06 Shared Core, Core Versions and the Exact Pin](../../prd/06-shared-core.md#core-versions-and-the-exact-pin), [05 Kit Conventions, Block Markers](../../prd/05-kit-conventions.md#block-markers), [D-029](../../prd/03-open-questions-and-risk-register.md#d-029-block-markers-are-not-tag-aware)).
- [ ] t10: Move tool `update` and uninstall into the core. The core finds the install manager from the kit's own package name and executable name, changes no project folder, keeps the kit's machine Store unless the person chooses to remove it, refuses to remove a folder that looks like a project folder, and reports each machine-scope MCP entry and each user Skill folder that still names the kit ([06 Shared Core, Tool Update and Uninstall](../../prd/06-shared-core.md#tool-update-and-uninstall)).
- [ ] t11: Run the slice gate after each of t8 to t10, in its own pull request: `npm test` from the repository root passes, the Make Docs CI workflow passes on Linux, macOS and Windows, and a compare script shows that `make-docs --help`, each group help, the MCP tool list of each profile and the agent-tool entries that `setup` writes are the same as in 2.1.0 ([06 Shared Core, Slice Order](../../prd/06-shared-core.md#slice-order), [Q-016](../../prd/03-open-questions-and-risk-register.md#q-016-core-extraction-order)).

### Acceptance criteria

- A705: The three first-band slices each merge with a green slice gate, and the evidence links each pull request.
- A706: A core test writes one block for each of two fixture tags into one file, updates each one, and leaves every byte outside the two blocks the same.
- A707: A core test of tool uninstall on a fixture machine folder keeps the Store without the remove choice, removes it with the choice, and refuses a folder that holds a project config.

### Dependencies

- Stage 1 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage. The 2.2.0 surface is reviewed in Stage 6.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A705` to `A707` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A705` to `A707` pass.

## Stage 3 - Middle Band Slices

### Tasks

- [ ] t12: Move layout and paths into the core: the project folder and machine folder paths, the router places, and path handling on Linux, macOS and Windows, with `LOCALAPPDATA`, then `APPDATA`, then the home folder as the user data root on Windows ([06 Shared Core, Core Boundary](../../prd/06-shared-core.md#core-boundary)). Make Docs passes `.make-docs`, its router places, `.make-docs` as its machine folder name and `MAKE_DOCS_HOME` as its setting.
- [ ] t13: Move the Store base without the migrations into the core: opening, locking and versioning the kit's machine Store, project identity, installation records and tool-operation records. Keep the project identity rule: `projectId` in the project config first, then the Store ledger ([06 Shared Core, Store Base and Schema Version 6](../../prd/06-shared-core.md#store-base-and-schema-version-6)).
- [ ] t14: Move the MCP server and its profiles without the registry into the core: the stdio server, the profile filter, the `allowWrite` gate and connection-key admission. The kit passes its server name, its version and its connection environment names. Keep the key rules: 32 random bytes in base64url, only the SHA-256 in the machine config, and a timing-safe check. No core file or test fixture holds a real key ([06 Shared Core, Core Boundary](../../prd/06-shared-core.md#core-boundary)).
- [ ] t15: Move agent-tool setup into the core: MCP entries, rules and user Skills for Claude Code, Codex and GitHub Copilot CLI, and the check of the kit executable. The kit passes its entry names, its adapter IDs, its rules file name and its profile name ([06 Shared Core, Kit Names as Inputs](../../prd/06-shared-core.md#kit-names-as-inputs), [06 Shared Core, Rebuild Notes](../../prd/06-shared-core.md#rebuild-notes)).
- [ ] t16: Write tool discovery as new code in the core. It takes the other kit's CLI name, block tag and project folder as input, reads the other kit's version when its CLI runs on the machine, finds the Make Docs block in a project with `.make-docs/` and in a project with `.make/docs/`, works offline, never installs, updates or uninstalls a kit, and gives the same result on Linux, macOS and Windows ([06 Shared Core, Tool Discovery](../../prd/06-shared-core.md#tool-discovery)).
- [ ] t17: Run the slice gate of t11 after each of t12 to t16, in its own pull request and in this order.

### Acceptance criteria

- A708: The five middle-band slices each merge with a green slice gate, in the order t12 to t16, and the evidence links each pull request.
- A709: A core test on each operating system resolves the machine folder from `MAKE_DOCS_HOME` when it is set, and from the user data root when it is not.
- A710: Tool discovery tests pass on the three operating systems for a fixture kit that is present, a fixture kit that is absent, and the Make Docs block in both project folder layouts, with the network off.

### Dependencies

- Stage 2 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A708` to `A710` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A708` to `A710` pass.

## Stage 4 - Last Band Slices and the Make Docs Change Plan

### Tasks

- [ ] t18: Move the operation registry into the core with a point where each kit registers its own operations. Make Docs registers its product operations there. The core imports no Make Docs operation module ([06 Shared Core, Slice Order](../../prd/06-shared-core.md#slice-order)). Run the slice gate of t11.
- [ ] t19: Close [Q-031](../../prd/03-open-questions-and-risk-register.md#q-031-store-version-counter-for-base-and-kit-tables) before the Store slice. Give the owner the question and the register recommendation: keep the single counter at 6, the core owns the counter and the base migrations, and each kit registers its own migrations in a fixed order after the base ones. Record the owner's answer as the resolution, and state the split in [06 Shared Core, Store Base and Schema Version 6](../../prd/06-shared-core.md#store-base-and-schema-version-6) with the PRD change process.
- [ ] t20: Move the Store migrations into the core as Q-031 decides. `user_version` stays 6, and the base tables and the Make Docs product tables keep their schema version 6 shapes. Write the test that Q-031 names: it opens one Store with Make Docs 2.0.6 and with the new code in turn, in both orders, with no `StoreSchemaNewerError` and no migration step ([R-010](../../prd/03-open-questions-and-risk-register.md#r-010-store-schema-locked-at-version-6)). Run the slice gate of t11.
- [ ] t21: Move the managed-block merge and remove code into the core, and keep the setup behavior for a malformed block: stop before any change, name the file and ask for a repair ([06 Shared Core, Rebuild Notes](../../prd/06-shared-core.md#rebuild-notes)). Add the uninstall fix ([Q-035](../../prd/03-open-questions-and-risk-register.md#q-035-scope-of-the-uninstall-fix-in-220)): `setup remove` strips only the Make Docs block from a file that also holds user text, and deletes the file only when nothing is left ([D-030](../../prd/03-open-questions-and-risk-register.md#d-030-setup-remove-keeps-the-kit-block)); the `uninstall` help, its options list and its message state that the Store stays unless `--remove-store` is set ([D-002](../../prd/03-open-questions-and-risk-register.md#d-002-uninstall-text-disagrees-with-store-removal)); and the `setup remove` guard protects the resolved Store root, also when `MAKE_DOCS_HOME` names another folder ([D-039](../../prd/03-open-questions-and-risk-register.md#d-039-setup-remove-guard-uses-a-fixed-store-path)). Run the slice gate of t11, with the uninstall-fix outputs as the only expected differences from 2.1.0.
- [ ] t22: Write a core test with the project root at the home folder, where the project tool directory and the machine folder are the same folder. Make Docs keeps the content check that tells them apart ([R-011](../../prd/03-open-questions-and-risk-register.md#r-011-project-and-machine-folders-overlap)).
- [ ] t23: Write and carry out a Make Docs change plan in `kits/make-docs/docs/plans/`, with `--target-root kits/make-docs`, for the Make Docs PRD changes that 2.2.0 needs: the Make Docs PRDs that describe the managed blocks, `setup remove`, `uninstall`, the operation registry and the Store, and the PRD 16 item that Phase 1 recorded in the Make Docs register for D-002.

### Acceptance criteria

- A711: The three last-band slices each merge with a green slice gate, and the evidence links each pull request. A search of `packages/core/src/` finds no import of a Make Docs operation module.
- A712: Q-031 is `Closed` in the root register with the owner's answer, and 06 states the split.
- A713: The Store test passes: Make Docs 2.0.6 and the new code each open the same Store in both orders, and `PRAGMA user_version` reads 6 after each run.
- A714: A test runs `setup remove` on a router with user text above and below the Make Docs block, and the file afterward holds the user text byte for byte and no Make Docs marker. A test with only the Make Docs block deletes the file.
- A715: `make-docs uninstall --help` lists `--remove-store`, and the uninstall message matches the result with and without the flag. A `setup remove` test with `MAKE_DOCS_HOME` set to another folder leaves that Store folder in place.
- A716: The home-folder test passes, and `make-docs run prd authority validate --target-root kits/make-docs` exits 0 after the Make Docs change plan.

### Dependencies

- Stage 3 of this phase.
- The owner answers Q-031 before t20.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent opens a real router with user text after `setup remove` on the new code and records whether the user text is intact and the Make Docs block is gone. Limit: the review uses fixture text, not a user's files.
- Optional experience handoff: not applicable before the 2.2.0 release.
- Explicit human acceptance gate: none.
- Evidence report: the `A711` to `A716` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A711` to `A716` pass. All eight core areas are in `packages/core/`.

## Stage 5 - Core 0.1.0 Through the Release Gate

### Tasks

- [ ] t24: Check that all eight areas are in `packages/core/` before any core release ([06 Shared Core, Slice Order](../../prd/06-shared-core.md#slice-order)). The code for the shared `.make/` files is not part of `0.1.0`; it ships in the setup tool wave ([Q-001](../../prd/03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope)).
- [ ] t25: Close [Q-033](../../prd/03-open-questions-and-risk-register.md#q-033-first-trusted-publish-of-a-new-package) before core `0.1.0` is published. Confirm on npmjs.com whether a trusted publisher can be set for a package that is not on npm yet. Record the answer as the resolution, and state the first-publish path for a new package and its owner gate in [08 Build and Release, Trusted Publisher Settings](../../prd/08-build-and-release.md#trusted-publisher-settings) with the PRD change process.
- [ ] t26: Owner gate: the owner's clear yes in chat before any trusted-publisher change. The owner sets the trusted publisher of `@brucewaynedecoy/make-core` to the repository `make-kit` and the workflow `publish-npm.yml`, with an empty environment name and `npm stage publish` as the only allowed action, or follows the first-publish path that t25 states ([08 Build and Release, Trusted Publisher Settings](../../prd/08-build-and-release.md#trusted-publisher-settings)).
- [ ] t27: Set the core version to `0.1.0-rc.0`, and keep the Make Docs dependency in step with the core version in the workspace. In the release pull request, commit `.github/release-candidates/make-core-v0.1.0-rc.0.sha256`. The pull request runs the core package proof and `npm publish --dry-run` for the core.
- [ ] t28: Owner gate: the owner's clear yes in chat before any npm publish. The owner creates the tag `make-core-v0.1.0-rc.0` and publishes a GitHub prerelease. The shared `publish-npm.yml` stages the core on `next`.
- [ ] t29: Owner gate: the owner approves the staged `0.1.0-rc.0` on npmjs.com with two-factor authentication. Then run the install check for the core: it installs `@brucewaynedecoy/make-core@0.1.0-rc.0` from npm into a temporary project and loads the package entry point on the three operating systems ([Q-032](../../prd/03-open-questions-and-risk-register.md#q-032-release-gate-scope)).
- [ ] t30: Set the core version to `0.1.0`, and commit `.github/release-candidates/make-core-v0.1.0.sha256` in a pull request that runs the package proof and `npm publish --dry-run`.
- [ ] t31: Owner gate: the owner's clear yes in chat before any npm publish. The owner creates the tag `make-core-v0.1.0` and publishes its GitHub Release. The workflow stages the core on `latest`.
- [ ] t32: Owner gate: the owner approves the staged `0.1.0` on npmjs.com with two-factor authentication. Then run the install check again for `0.1.0`.
- [ ] t33: Owner gate: the owner's clear yes in chat before any npm package setting changes. After the first trusted publish, the owner sets "Require two-factor authentication and disallow tokens" on `@brucewaynedecoy/make-core` ([08 Build and Release, Publish](../../prd/08-build-and-release.md#publish)).
- [ ] t34: Move [R-001](../../prd/03-open-questions-and-risk-register.md#r-001-core-release-friction) to `Closed` in the root register when the pinned core is published and Make Blueprint v2.0 release work has not started.

### Acceptance criteria

- A717: Q-033 is `Closed` in the root register, and 08 states the first-publish path for a new package.
- A718: While the core release candidate's install check has not passed, `npm view @brucewaynedecoy/make-core dist-tags --json` shows no `latest` at `0.1.0`. The install checks of `0.1.0-rc.0` and `0.1.0` pass on the three operating systems, and each log shows the entry point loaded.
- A719: `npm view @brucewaynedecoy/make-core version` prints `0.1.0`, and the npm package page shows a provenance link to `brucewaynedecoy/make-kit` and `publish-npm.yml`.
- A720: The npm settings of `@brucewaynedecoy/make-core` show "Require two-factor authentication and disallow tokens", as the owner reports. R-001 is `Closed`.

### Dependencies

- Stage 4 of this phase.
- Q-033 is closed before t26.
- The owner is available for the gates in t26, t28, t29 and t31 to t33.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage. The core has no human-facing surface of its own.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A717` to `A720` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A717` to `A720` pass.

## Stage 6 - Make Docs 2.2.0 on the Core

### Tasks

- [ ] t35: Point the Make Docs dependency at the published `@brucewaynedecoy/make-core` `0.1.0`, exactly. The release build resolves the core from the npm registry, and the release-build check of t4 passes ([06 Shared Core, Core Versions and the Exact Pin](../../prd/06-shared-core.md#core-versions-and-the-exact-pin), [Q-007](../../prd/03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)).
- [ ] t36: Set the Make Docs version to `2.2.0-rc.0`. In the release pull request, commit `.github/release-candidates/make-docs-v2.2.0-rc.0.sha256`. The pull request runs the package proof and `npm publish --dry-run`.
- [ ] t37: Owner gate: the owner's clear yes in chat before any npm publish. The owner creates the tag `make-docs-v2.2.0-rc.0` and publishes a GitHub prerelease. The workflow stages the tarball on `next`.
- [ ] t38: Owner gate: the owner approves the staged `2.2.0-rc.0` on npmjs.com with two-factor authentication. Then run the install check for `2.2.0-rc.0` on the three operating systems.
- [ ] t39: Set the version to `2.2.0`, and commit `.github/release-candidates/make-docs-v2.2.0.sha256` in a pull request that runs the package proof and `npm publish --dry-run`.
- [ ] t40: Owner gate: the owner's clear yes in chat before any npm publish. The owner creates the tag `make-docs-v2.2.0` and publishes its GitHub Release. The workflow stages the tarball on `latest`.
- [ ] t41: Owner gate: the owner approves the staged `2.2.0` on npmjs.com with two-factor authentication. Then run the install check again for `2.2.0`.
- [ ] t42: Check the result: `npm view @brucewaynedecoy/make-docs@2.2.0 dependencies --json`, `npm view @brucewaynedecoy/make-docs dist-tags --json`, and `PRAGMA user_version` of the Make Docs Store after a run of 2.2.0, read with a read-only SQLite client. Then run Make Docs 2.0.6 against the same Store and check that it reads its records ([06 Shared Core, Store Base and Schema Version 6](../../prd/06-shared-core.md#store-base-and-schema-version-6)).
- [ ] t43: Move [D-029](../../prd/03-open-questions-and-risk-register.md#d-029-block-markers-are-not-tag-aware), [D-030](../../prd/03-open-questions-and-risk-register.md#d-030-setup-remove-keeps-the-kit-block), [D-002](../../prd/03-open-questions-and-risk-register.md#d-002-uninstall-text-disagrees-with-store-removal) and [D-039](../../prd/03-open-questions-and-risk-register.md#d-039-setup-remove-guard-uses-a-fixed-store-path) to `Closed` in the root register, with the release 2.2.0 and the test of each one as the resolution. Move [R-009](../../prd/03-open-questions-and-risk-register.md#r-009-urgent-make-docs-fix-during-the-core-slices) to `Closed`, because 2.2.0 shipped. With the PRD change process, update the current-state text that says the core does not exist in [01 Product Overview](../../prd/01-product-overview.md#current-limitations), [02 Architecture Overview](../../prd/02-architecture-overview.md#topology) and [06 Shared Core](../../prd/06-shared-core.md#purpose).
- [ ] t44: Do the Human Experience Review of the preserved boundary and the two fixes on the installed 2.2.0, and record it in `evidence.md`.
- [ ] t45: Validate the docs from the repository root: `make-docs run prd authority validate --target-root .`, `make-docs run prd authority validate --target-root kits/make-docs`, the Make Docs link check, and `make-docs run work backlog snapshot --target-root .`.

### Acceptance criteria

- A721: `npm view @brucewaynedecoy/make-docs@2.2.0 dependencies --json` shows `"@brucewaynedecoy/make-core": "0.1.0"`, with no range operator.
- A722: While the 2.2.0 release candidate's install check has not passed, `npm view @brucewaynedecoy/make-docs dist-tags --json` shows `"latest": "2.1.0"`. After t41, it shows `"latest": "2.2.0"`.
- A723: The install checks of `2.2.0-rc.0` and `2.2.0` pass on the three operating systems.
- A724: `PRAGMA user_version` of the Make Docs Store reads 6 after a run of 2.2.0, and Make Docs 2.0.6 then opens the same Store with no `StoreSchemaNewerError` and lists its records.
- A725: A compare of the installed 2.2.0 with 2.1.0 shows the same CLI name, npm name, project and machine folders, environment names, agent-tool entry names, block markers and MCP tool list, apart from the uninstall-fix text.
- A726: D-029, D-030, D-002, D-039 and R-009 are `Closed` with resolutions.
- A727: `make-docs run prd authority validate --target-root .` and `--target-root kits/make-docs` exit 0, the Make Docs link check reports 0 broken links, and `make-docs run work backlog snapshot --target-root .` exits 0 with only `BACKLOG-VAL-010`.

### Dependencies

- Stage 5 of this phase: `@brucewaynedecoy/make-core` `0.1.0` is on `latest`.
- The owner is available for the gates in t37, t38, t40 and t41.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent records a conclusion for the preserved boundary from A724 and A725, and for the two fixes from a real `setup remove` and the real `uninstall --help` on the installed 2.2.0. Limit: the review runs on the maintainer machine and hosted runners, not on user machines.
- Optional experience handoff: two steps for the owner: update to 2.2.0 with `npm install -g @brucewaynedecoy/make-docs`, then run `make-docs uninstall --help` and read the Store text. Feedback is optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A721` to `A727` section of `evidence.md`. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: phase complete when `A701` to `A727` pass. The shared core is capability complete for Step 0. R-002 and R-011 stay open until a second kit runs on the core, and Phase 8 records their owner and target.
