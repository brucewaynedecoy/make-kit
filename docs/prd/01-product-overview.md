---
title: "01 Product Overview"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md"
---

# 01 Product Overview

## Purpose

Make Kit is a family of command-line tools for work on a project with AI agents. Each tool is a kit. The `make-kit` repository (`github.com/brucewaynedecoy/make-kit`) is the one home for every kit, for the shared core that the kits use, and for the `make-kit` setup tool that sets up any mix of kits.

| Product | npm package | CLI | Home in this repository | Status on 2026-11-02 |
| --- | --- | --- | --- | --- |
| Make Docs | `@brucewaynedecoy/make-docs` | `make-docs` | `kits/make-docs/` | Live product. The latest release is 2.0.6, with the tag `v2.0.6`. Its code is in `kits/make-docs/`, copied from the tag `v2.0.6`. It releases from the old `make-docs` repository until the switch point. |
| Make Blueprint | `@brucewaynedecoy/make-blueprint` | `make-blueprint` | `kits/make-blueprint/` | Designed and planned for v2.0. The folder holds docs only. No code is written yet. |
| Shared core | `@brucewaynedecoy/make-core` | None. The core is a library. | `packages/core/` | Planned for Step 0. The folder does not exist yet. |
| Setup tool | `@brucewaynedecoy/make-kit` | `make-kit` | `packages/kit/` | Planned for the setup tool wave after Step 0. The folder does not exist yet. |

This PRD set is the repo-wide product authority. It owns the rules that every kit shares and the release order across kits. Each kit's own product stays in that kit's own PRD set, for example the [Make Blueprint PRD index](../../kits/make-blueprint/docs/prd/00-index.md). [02 Architecture Overview](02-architecture-overview.md) shows how the repository is laid out.

One home gives these results:

- A change to the core and to the kits that use it lands in one pull request. No release delay between repositories blocks it.
- The setup tool and the shared setup choices have one home.
- Every kit follows one pattern for folders, routers, the Store, the CLI shape and MCP profiles. [05 Kit Conventions](05-kit-conventions.md) owns that pattern.
- Kits installed together can be checked together. For example, a check could report which Make Blueprint requirements have a Make Docs PRD and planned work. This is an opportunity, not a committed capability.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Purpose; Context; Decision, sections 1, 2 and 7; Consequences)
- `README.md`
- `AGENTS.md` and `CLAUDE.md` (the hand-written monorepo map)

## Users

The root project uses the two built-in Make Docs Personas, `user` and `maintainer`. Either role can be a person or an agent.

| Persona | Concrete roles | What they do with Make Kit | Main surfaces |
| --- | --- | --- | --- |
| `maintainer` | The repository owner, and the people and agents who build, test and release kits in this repository | Build and test every kit from one npm workspace. Release each package from this repository's CI. Keep the root map and the shared rules correct. Run the routing check. | The root map in `AGENTS.md` and `CLAUDE.md`, the root `docs/`, each kit's `docs/`, the root `package.json`, `.github/workflows/` and `scripts/routing-check/` |
| `user` | People who install one or more kits in their own projects, and the agents that act for them | Install a kit from npm and run its setup. In the setup tool wave, run `make-kit setup` to set up a mix of kits with one set of choices. | npm package pages, `npm install -g @brucewaynedecoy/make-docs` and the other kit install commands, each kit's `setup`, `make-kit setup`, `.make/config.yaml` and `.make/personas.yaml` |

The human goal is this: a maintainer builds, tests and releases every kit from one place, and an agent that starts in this repository finds the right project's docs without help. A user sets up any mix of kits with one set of choices.

### Experience Promises

Each promise is an observable requirement in its owning PRD. This table is the navigation map. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind the promises. The plan's [Human Experience Propagation](../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md#human-experience-propagation) table maps each promise to its work phase and its evidence.

| Promise | Owner | Release |
| --- | --- | --- |
| An agent that starts at the repository root can tell which project a task belongs to and reaches that project's routers and docs. | [02 Architecture Overview](02-architecture-overview.md#several-docs-roots), [05 Kit Conventions](05-kit-conventions.md) | Step 0 |
| A person who set up one kit in a project sees the earlier agent-tool choices already selected when they set up another kit. | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) | Setup tool wave |
| A person runs `make-kit setup`, chooses kits and agent tools once, and gets each chosen kit set up. Each kit still sets up alone with its own CLI. | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) | Setup tool wave |
| A Make Docs user sees no change to the npm package name or the install commands after the switch point. | [08 Build and Release](08-build-and-release.md) | Make Docs 2.0.7 |
| A Make Docs user who installs from `latest` gets no version from the new release path until that path has passed on the `next` dist-tag. | [08 Build and Release](08-build-and-release.md) | Make Docs 2.0.7 |
| Each temporary workaround stays visible, numbered and owned until it is removed. | [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md#deferred-obligations), [02 Architecture Overview](02-architecture-overview.md#several-docs-roots) | Until Make Docs 2.1.0 |

### Complexity Kept Out of the Human Path

Requirements:

- Kit install and setup output does not ask a user for a `projectId`, a core version or a package path.
- `make-kit setup` output names the kits and the agent tools. It does not show how the setup tool calls each kit's own setup.
- An agent at the repository root needs only the short numbered rules in the root map to work around the nested-project weak spots. The full record of each workaround stays in the register.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Human Experience Intent)
- `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md` (Human Experience Propagation)
- `.make-docs/config.yaml` (the root project uses the built-in Personas)

## Key Capabilities

### Separate or Together

Every kit is a separate product. The first Northstar principle of Make Blueprint, separate or together ([Make Blueprint 01 Product Overview](../../kits/make-blueprint/docs/prd/01-product-overview.md#northstar-principles)), applies to every kit.

Requirements:

- Each kit has its own npm package and its own CLI.
- A user installs and runs each kit alone, with no other kit installed.
- No kit needs another kit to be installed, to run a given version, or to share its CLI.
- Every kit builds on the shared core. Each kit release on the core pins one exact core version. [06 Shared Core](06-shared-core.md) owns the pin rule.
- Kits in one project share two project files, `.make/config.yaml` and `.make/personas.yaml`. Settings for one kit stay in `.make/<kit>/config.yaml`. [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) owns these files.

### Capabilities

| Capability | What it gives people | Release | Owner |
| --- | --- | --- | --- |
| Kit Conventions | One pattern for every kit: the CLI shape, outcomes and exit codes, `--json` and `--dry-run`, the MCP server and its profiles, system resources, routers and managed blocks, project and machine folders, and the Store boundary. Make Docs is the reference kit. | The rules apply from Step 0. Each Make Docs gap has one `D-###` item under [Confirmed Drift](03-open-questions-and-risk-register.md#confirmed-drift) in the register. A gap closes in a named Make Docs release only where an accepted decision sets one. The register tracks every gap with no release set. | [05 Kit Conventions](05-kit-conventions.md) |
| Shared core | One TypeScript library, `@brucewaynedecoy/make-core`, with eight areas and no product content | Core 0.1.0, in Step 0 | [06 Shared Core](06-shared-core.md) |
| Setup tool and shared files | `make-kit setup` asks for the kits and the agent tools once and runs each chosen kit's own setup. `.make/config.yaml` holds the shared choices, and `.make/personas.yaml` holds the people and roles for every kit. | Setup tool wave. The setup tool ships with Make Blueprint v2.0. | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) |
| Build and release | One npm workspace, CI on Linux, macOS and Windows, one shared publish workflow with npm trusted publishing and provenance, a release gate through the `next` dist-tag, and a public repository | Step 0 | [08 Build and Release](08-build-and-release.md), [02 Architecture Overview](02-architecture-overview.md) |
| Several docs roots | The root and each kit are separate Make Docs projects. A hand-written root map routes agents to the right project. A routing check measures how agents route. | Step 0 | [02 Architecture Overview](02-architecture-overview.md#several-docs-roots) |

### Release Scope

Step 0 is the repo-wide release scope. At the end of Step 0, Make Docs lives in `kits/make-docs/`. It releases from this repository's CI under its unchanged npm name, and it runs on the published core. Step 0 has 10 steps in a fixed order ([Q-021 Step 0 Sequence](03-open-questions-and-risk-register.md#q-021-step-0-sequence)): the root docs, the Step 0 work backlog, copy day, the public repository, CI, the first routing check, the switch point, Make Docs 2.1.0, the core with Make Docs 2.2.0, and closeout. The switch point comes before the core ([Q-002 Switch Point Before the Core](03-open-questions-and-risk-register.md#q-002-switch-point-before-the-core)). The `W1 R0` work backlog covers Step 0 only ([Q-001 Step 0 Backlog Scope](03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope)).

| Order | Release | Content | Status in this PRD set |
| --- | --- | --- | --- |
| 1 | Make Docs 2.0.7 | The switch point. 2.0.7 has the same code as 2.0.6. It ships from this repository's CI under the npm name `@brucewaynedecoy/make-docs`, first as `2.0.7-rc.0` on the `next` dist-tag and then as `2.0.7` on `latest` ([Q-011 Switch Test](03-open-questions-and-risk-register.md#q-011-switch-test)). From this release on, all Make Docs work happens in this repository. | Step 0 |
| 2 | Make Docs 2.1.0 | The nested-project fixes for O-001 to O-005, with one nested-project test for each fix ([Q-014 Nested-Project Fixes](03-open-questions-and-risk-register.md#q-014-nested-project-fixes)). The link read command that Make Blueprint needs, which uses the same link code as the O-004 fix ([Q-020 Release of the Link Read Command](03-open-questions-and-risk-register.md#q-020-release-of-the-link-read-command); Make Blueprint register [Q-024](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-024-make-docs-link-check-interface)). Links from the Make Docs PRDs to [05 Kit Conventions](05-kit-conventions.md) ([Q-019 Make Docs PRDs and Kit Conventions](03-open-questions-and-risk-register.md#q-019-make-docs-prds-and-kit-conventions)). | Step 0 |
| 3 | Core 0.1.0 | `@brucewaynedecoy/make-core` with all eight core areas. The core is built in slices from the easy parts to the hard parts. Every slice keeps all Make Docs tests green ([Q-016 Core Extraction Order](03-open-questions-and-risk-register.md#q-016-core-extraction-order)). | Step 0 |
| 4 | Make Docs 2.2.0 | Make Docs on the core, with an exact pin on core 0.1.0, tag-aware managed blocks and the uninstall fix ([Q-007 Make Docs Changes in Step 0](03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)). The uninstall fix covers D-030, D-002 and D-039 ([Q-035 Scope of the Uninstall Fix in 2.2.0](03-open-questions-and-risk-register.md#q-035-scope-of-the-uninstall-fix-in-220)). | Step 0 |
| 5 | Setup tool wave | `@brucewaynedecoy/make-kit` with `make-kit setup`, `.make/config.yaml`, `.make/<kit>/config.yaml` and `.make/personas.yaml`. In this wave, Make Docs reads its Persona list from `.make/personas.yaml`. | Planned scope. A later repo-wide wave after Step 0 ([Q-001 Step 0 Backlog Scope](03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope)). The setup tool ships with Make Blueprint v2.0. |
| 6 | Make Blueprint v2.0 | The v2.0 scope in the [Make Blueprint release scope](../../kits/make-blueprint/docs/prd/01-product-overview.md#release-scope). Its work starts after Step 0 closeout, with its phase `01-shared-core-adoption`. | Planned scope. The Make Blueprint PRD set owns it. |

Later Make Docs scope, with no release number yet ([Q-007 Make Docs Changes in Step 0](03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)):

- The handoff line in the Make Docs root block when Make Blueprint is in the same project. Until it ships, Make Blueprint follows its rule for a Make Docs that is too old to write the line ([Make Blueprint Handoff Line](../../kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md#handoff-line)).
- The Make Docs project folder at `.make/docs/` and its machine folder at `~/.make/docs/`. [05 Kit Conventions](05-kit-conventions.md) lists this gap.
- The Azure Boards export in Make Docs.
- Make Docs without the Naive UAT capability. This is out of Step 0 ([Q-009 Naive UAT Removal](03-open-questions-and-risk-register.md#q-009-naive-uat-removal)). After copy day, the Make Docs register `kits/make-docs/docs/prd/03-open-questions-and-risk-register.md` records it, and a later Make Docs wave owns it.

Requirements:

- The Step 0 releases ship in the order of the table. Core 0.1.0 does not ship before Make Docs 2.1.0 is on `latest`.
- The npm package names in the [Purpose](#purpose) table stay the same in every release.
- The `latest` dist-tag of `@brucewaynedecoy/make-docs` points to `2.0.7` only after `2.0.7-rc.0` has passed the install check on `next`. [08 Build and Release](08-build-and-release.md) owns the release gate.
- `npm view @brucewaynedecoy/make-docs@2.2.0 dependencies` shows the exact version `0.1.0` for `@brucewaynedecoy/make-core`.
- The Make Docs Store keeps schema version 6 in every Step 0 release, so live Make Docs users keep their Store. [06 Shared Core](06-shared-core.md) owns this rule.
- A broken release at the switch point is a tracked risk ([R-003 Broken Release at the Switch Point](03-open-questions-and-risk-register.md#r-003-broken-release-at-the-switch-point)).

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 3, 4, 5, 9 and 11)
- `kits/make-blueprint/docs/prd/01-product-overview.md` (Release Scope)
- [`make-docs v2.0.6: packages/cli/package.json:2`](../../kits/make-docs/packages/cli/package.json) (the npm name `@brucewaynedecoy/make-docs`)
- [`make-docs v2.0.6: packages/cli/package.json:3`](../../kits/make-docs/packages/cli/package.json) (version 2.0.6)

## System Boundaries

The Make Kit repository owns the kits, the core, the setup tool and the repo-wide docs. It depends on, or sits beside, these parties.

| Party | What it owns | How Make Kit relates to it |
| --- | --- | --- |
| Root `docs/` | Repo-wide docs only: the shared core, the setup tool, the shared `.make/` rules, the build and release flow, and decisions that cross kits | This PRD set and the root register |
| `kits/<kit>/docs/` | Every design, plan, PRD and work doc for one kit | That kit's own Make Docs project. See [02 Architecture Overview](02-architecture-overview.md#several-docs-roots). |
| The old `make-docs` repository (`github.com/brucewaynedecoy/make-docs`) | The Make Docs history before copy day, and the Make Docs release source until the switch point | Frozen after the switch point. See the requirements below and [08 Build and Release](08-build-and-release.md). |
| npm | The published packages, the `next` and `latest` dist-tags, the trusted publisher setting and provenance | Every package publishes from this repository's CI. See [08 Build and Release](08-build-and-release.md). |
| GitHub | The repository, its visibility, its workflows and its rulesets | See [08 Build and Release](08-build-and-release.md). |
| Agent tools | The agent session, its skill folders and its MCP client config | Each kit's setup writes the agent-tool config, and the agent tool starts the kit's MCP server. Each kit names the agent tools that it supports. |
| Operating systems | Linux, macOS and Windows | Every kit supports all three. CI runs on all three. |

Requirements:

- No kit design, plan, PRD or work doc lives in the root `docs/`.
- No CLI in Make Kit is named `make`, because that name clashes with the standard `make` build tool.
- Until the switch point, the old repository is the Make Docs release source. An urgent Make Docs fix before the switch goes into the old repository first, and a maintainer then ports it to `kits/make-docs/` by hand ([R-007 Urgent Fix During the Freeze](03-open-questions-and-risk-register.md#r-007-urgent-fix-during-the-freeze)).
- After `2.0.7` is on `latest`, the old repository is frozen and read-only in practice, but it is not archived ([Q-012 Old Repository Freeze](03-open-questions-and-risk-register.md#q-012-old-repository-freeze)). Its README has a banner that points to `kits/make-docs/` in `make-kit`. It has no `publish-npm.yml`, no `dependabot.yml` and no open Dependabot pull requests. Its history stays readable and is not rewritten. Each change to it needs the owner's clear yes.
- The repository is public before the switch point, because npm makes provenance only from a public repository ([Q-004 Public Repository Before the Switch](03-open-questions-and-risk-register.md#q-004-public-repository-before-the-switch)).
- The public repository holds no secrets, no client data, no local home-folder paths and no work email, in its files or in its git history ([R-004 Exposed History in the Public Repository](03-open-questions-and-risk-register.md#r-004-exposed-history-in-the-public-repository)). [08 Build and Release](08-build-and-release.md) owns the scan.
- Live Make Docs users keep the npm name `@brucewaynedecoy/make-docs` and the install command `npm install -g @brucewaynedecoy/make-docs` after the switch point.
- One root MIT `LICENSE` covers the whole stack. [08 Build and Release](08-build-and-release.md) owns the license rule.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 1, 3, 8 and 12; Consequences: trade-offs and risks)
- `AGENTS.md` and `CLAUDE.md` (the monorepo map: repo-wide work in `docs/`, kit work in `kits/<kit>/docs/`)
- [`make-docs v2.0.6: .github/workflows/publish-npm.yml`](../../kits/make-docs/.github/workflows/publish-npm.yml)
- [`make-docs v2.0.6: LICENSE`](../../kits/make-docs/LICENSE)

## Current Limitations

These limits are true on 2026-11-02.

- **Make Docs does not release from this repository yet.** Its code is in `kits/make-docs/`, copied from the tag `v2.0.6` ([Q-003 Copy Source and Freeze](03-open-questions-and-risk-register.md#q-003-copy-source-and-freeze)). Its two CI workflows do not run in this repository until the CI step. Its release flow stays in the old `make-docs` repository until the switch point ([08 Build and Release](08-build-and-release.md)).
- **The core does not exist yet.** `packages/core/` is not in the repository, and `@brucewaynedecoy/make-core` is not on npm. Until Make Docs 2.2.0, the behavior that the core will hold lives in Make Docs code. See [06 Shared Core](06-shared-core.md).
- **No setup tool in Step 0.** `make-kit setup`, `.make/config.yaml` and `.make/personas.yaml` belong to a later repo-wide wave ([Q-001 Step 0 Backlog Scope](03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope)). Until that wave, each kit sets up alone with its own CLI, and Make Docs reads its Personas from `.make-docs/config.yaml`. How an existing project's Persona list reaches `.make/personas.yaml` is open ([Q-027 Persona List Move for Existing Projects](03-open-questions-and-risk-register.md#q-027-persona-list-move-for-existing-projects)).
- **The repository is private.** It stays private until the public step in Step 0 ([Q-004 Public Repository Before the Switch](03-open-questions-and-risk-register.md#q-004-public-repository-before-the-switch)).
- **Nested projects need temporary workarounds.** Make Docs has weak spots when one git repository holds several Make Docs projects. Until Make Docs 2.1.0, the root map lists five numbered workarounds, O-001 to O-005. The register records each one under [Deferred Obligations](03-open-questions-and-risk-register.md#deferred-obligations). [02 Architecture Overview](02-architecture-overview.md#several-docs-roots) owns how agents see them.
- **No routing baseline yet.** No measurement shows how agents behave in a repository with several docs roots. The first routing check runs after copy day ([02 Architecture Overview](02-architecture-overview.md#routing-check)). Agents may pick the wrong project until then ([R-005 Agents Pick the Wrong Project](03-open-questions-and-risk-register.md#r-005-agents-pick-the-wrong-project)).
- **No monorepo setup option.** No kit offers "single project or monorepo" as a setup choice. This option waits for the routing check baseline ([02 Architecture Overview](02-architecture-overview.md#later-scope)).
- **Make Docs 2.0.x still has Naive UAT.** Make Docs without Naive UAT is later Make Docs scope, out of Step 0 ([Q-009 Naive UAT Removal](03-open-questions-and-risk-register.md#q-009-naive-uat-removal)).
- **Make Blueprint does not run yet.** `kits/make-blueprint/` holds docs only. Its v2.0 work starts after Step 0 closeout.

Open questions and risks for these limits live in [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md).

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Context; Decision, sections 9, 10 and 11; Consequences: left open)
- `AGENTS.md` and `CLAUDE.md` (the numbered temporary workarounds)
- `kits/make-blueprint/`

## Source Anchors

- [Make Kit Monorepo](../designs/2026-10-30-make-kit-monorepo.md) design, with the interview decisions Q-001 to Q-026
- [Make Kit Monorepo Baseline Plan](../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md)
- The root map in [AGENTS.md](../../AGENTS.md) and [CLAUDE.md](../../CLAUDE.md), above the Make Docs block
- The Make Blueprint release scope in [01 Product Overview](../../kits/make-blueprint/docs/prd/01-product-overview.md#release-scope)
- [README.md](../../README.md)
- [`make-docs v2.0.6: packages/cli/package.json`](../../kits/make-docs/packages/cli/package.json)
