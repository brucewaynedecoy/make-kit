---
title: "02 Architecture Overview"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md"
---

# 02 Architecture Overview

## Purpose

This document shows how the `make-kit` repository is laid out from end to end. It covers the folders, the npm workspace, the packages and what each one owns, the boundaries between the kits, the core and the setup tool, the flow of shared setup choices, and the configuration files that control each project.

It also owns how agents find the right docs in a repository with several docs roots, the hand-written root map that routes them, and the routing check that measures the result. [01 Product Overview](01-product-overview.md) says what each product is and when each release ships.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 2 and 8)
- `AGENTS.md` and `CLAUDE.md` (the monorepo map)

## Topology

The repository has this target layout:

```text
make-kit/
  AGENTS.md, CLAUDE.md      monorepo map (hand-written) plus the Make Docs block
  README.md                 the repository front page
  LICENSE                   MIT, for the whole stack
  package.json              private npm workspace root
  package-lock.json         the only lockfile
  .make-docs/config.yaml    the root Make Docs project config
  .github/                  CI for each kit, one shared publish workflow
  scripts/routing-check/    the routing check
  docs/                     repo-wide docs: core, setup tool, shared rules
  packages/core/            the shared core
  packages/kit/             the make-kit setup tool
  kits/make-docs/           Make Docs: its packages, its docs/, its routers
  kits/make-blueprint/      Make Blueprint: its packages, its docs/, its routers
```

Not every part exists today. This table shows the state on 2026-11-02 and the point from which each part exists.

| Path | State on 2026-11-02 | Exists from | Owner |
| --- | --- | --- | --- |
| `AGENTS.md`, `CLAUDE.md` | Present, with the hand-written map and the Make Docs block | Now | This document |
| `README.md` | Present | Now | The repository owner |
| `.make-docs/config.yaml` | Present | Now | This document |
| `docs/` | Present | Now | This PRD set |
| `kits/make-blueprint/` | Present, with docs and routers only | Now. Its packages come with the Make Blueprint v2.0 work. | The Make Blueprint PRD set |
| `kits/make-docs/` | Present, copied from the tag `v2.0.6` | Copy day ([Q-003 Copy Source and Freeze](03-open-questions-and-risk-register.md#q-003-copy-source-and-freeze)) | The Make Docs PRD set and [08 Build and Release](08-build-and-release.md) |
| `package.json`, `package-lock.json` | Present | Copy day ([Q-005 One Root npm Workspace](03-open-questions-and-risk-register.md#q-005-one-root-npm-workspace)) | This document |
| `LICENSE` | Absent | The public step ([Q-018 License](03-open-questions-and-risk-register.md#q-018-license)) | [08 Build and Release](08-build-and-release.md) |
| `.github/` | Absent | The public step and the CI step ([Q-010 CI Layout and Release Tags](03-open-questions-and-risk-register.md#q-010-ci-layout-and-release-tags)) | [08 Build and Release](08-build-and-release.md) |
| `scripts/routing-check/` | Absent | The first routing check | This document, [Routing Check](#routing-check) |
| `packages/core/` | Absent | The core work in Step 0 | [06 Shared Core](06-shared-core.md) |
| `packages/kit/` | Absent | The setup tool wave | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) |

Requirements:

- Every workflow lives in the root `.github/workflows/`, because GitHub reads workflows only at the git root. No folder under `kits/` holds a `.github/` folder.
- Each kit folder holds its own packages, its own `docs/`, its own `.make-docs/config.yaml` and its own routers.
- The root `docs/` holds only repo-wide docs.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 2, 8 and 12)
- `.make-docs/config.yaml`
- `kits/make-blueprint/`

### Several Docs Roots

The repository root and each kit folder are separate Make Docs projects. Make Docs always uses `<project>/docs` as the docs root, and its config cannot rename that folder. Nested Make Docs projects in one git repository work. The Store identifies each project by the `projectId` in its config. Setup never writes outside its own target folder.

| Project | Docs root | Project config | Routers | What it owns |
| --- | --- | --- | --- | --- |
| Repo-wide | `docs/` | `.make-docs/config.yaml` | Root `AGENTS.md` and `CLAUDE.md`, and the routers in `docs/` | The shared core, the setup tool, the shared `.make/` rules, the build and release flow, and decisions that cross kits |
| Make Blueprint | `kits/make-blueprint/docs/` | `kits/make-blueprint/.make-docs/config.yaml` | `kits/make-blueprint/AGENTS.md` and `kits/make-blueprint/CLAUDE.md`, and the routers in its `docs/` | Every Make Blueprint design, plan, PRD and work doc |
| Make Docs | `kits/make-docs/docs/` | `kits/make-docs/.make-docs/config.yaml` | `kits/make-docs/AGENTS.md` and `kits/make-docs/CLAUDE.md`, and the routers in its `docs/` | Every Make Docs design, plan, PRD and work doc |

The root map is a hand-written part of the root `AGENTS.md` and `CLAUDE.md`, outside the Make Docs block. Make Docs does not manage it. The root map has these parts:

- A table that lists each kit, its folder and the file to read first.
- A rule for kit work: use the kit's own routers and its `docs/`.
- A rule for repo-wide work: use the root `docs/`.
- A rule for an unclear task: ask the person which project it belongs to before you write anything.
- A numbered list of the temporary workarounds for nested projects.

Requirements:

- An agent that starts at the repository root can tell which project a task belongs to, and reaches that project's routers and docs before it writes a file. The [Routing Check](#routing-check) is the evidence for this outcome. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind it.
- The root map has one row for the root `docs/`, one row for each folder under `packages/`, and one row for each kit folder. A row for a folder that does not exist yet says so.
- The root map in `AGENTS.md` and the root map in `CLAUDE.md` have the same rows and the same rules. Each one points to the kit router file with its own name, so `AGENTS.md` points to `kits/<kit>/AGENTS.md` and `CLAUDE.md` points to `kits/<kit>/CLAUDE.md`.
- Kit design, plan, PRD and work docs live only in `kits/<kit>/docs/`. The root `docs/` holds no kit docs.
- Each temporary workaround stays visible, numbered and owned until it is removed. The root map labels each workaround as temporary, names its O-number, and links the root register. Each O-number has one record under [Deferred Obligations](03-open-questions-and-risk-register.md#deferred-obligations), with the repository owner as its owner and a Make Docs fix as its trigger.
- When a Make Docs release ships the fix for a workaround and the owner installs that release, the workaround is no longer in the root map or in the validation steps, and its record is `Fulfilled` with its version and its proof command.
- This PRD does not hold the workaround details. The records under [Deferred Obligations](03-open-questions-and-risk-register.md#deferred-obligations) hold them.
- The Make Blueprint register has its own O, Q, R and D numbers. A doc that cites a number from either register names that register's path too.
- Links between the docs of two projects are relative `../` links, and each one resolves to an existing file and heading.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Context; Decision, sections 8 and 9)
- `AGENTS.md` and `CLAUDE.md` (the root map and the numbered workarounds)
- `.make-docs/config.yaml`
- `kits/make-blueprint/.make-docs/config.yaml`
- `kits/make-blueprint/AGENTS.md` and `kits/make-blueprint/CLAUDE.md`

### Routing Check

The routing check measures whether agents that start at the repository root land in the right project's docs ([Q-008 Routing Check Method](03-open-questions-and-risk-register.md#q-008-routing-check-method)). Naive UAT is not used for it. The check exists because agents can pick the wrong project in a repository with several docs roots ([R-005 Agents Pick the Wrong Project](03-open-questions-and-risk-register.md#r-005-agents-pick-the-wrong-project)).

| Part | Rule |
| --- | --- |
| Script | `scripts/routing-check/` starts fresh read-only agents at the repository root, with `claude -p` and `codex exec`. |
| Tasks | 9 tasks: 3 for Make Docs, 3 for Make Blueprint and 3 repo-wide |
| Runs | Each task runs twice with each tool, so one check has 36 runs. |
| Pass rule | A run passes when the agent reads the right router and names the right docs root. |
| Results | `docs/assets/maintainer/routing-check/<date>-baseline.md` holds the baseline. |
| Misses | Each miss is an item in the root register. |
| Schedule | The first check runs after copy day. The second check runs after the Make Docs 2.1.0 workaround cleanup. Both checks use the same 9 tasks. |

Requirements:

- The results file lists each of the 36 runs with its task, its tool and its result, `pass` or `miss`.
- No routing-check agent writes a file in the repository. Only the script writes the results file.
- Each miss has an item in [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md).
- The second check writes a dated results file in `docs/assets/maintainer/routing-check/` and compares the result of each task with the baseline.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Human Experience Intent: evidence required; Decision, section 14)
- `scripts/routing-check/`
- `docs/assets/maintainer/routing-check/`

### Later Scope

A "single project or monorepo" setup option for Make Kit, Make Docs or Make Blueprint is later scope. This repository is the test bed for it. The option gets its own design after the routing check baseline exists. It is not part of Step 0 or of the setup tool wave.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, section 10; Consequences: left open)

## Module Map

| Folder | npm package | Kind | What it owns | Owner |
| --- | --- | --- | --- | --- |
| `packages/core/` | `@brucewaynedecoy/make-core` | Published library. It has no CLI. | Eight areas: layout and paths, resource reading, the MCP server and its profiles, the Store base, agent-tool setup, managed blocks, tool discovery, and tool `update` and uninstall. It also reads and writes the shared `.make/` files. It holds no product content. | [06 Shared Core](06-shared-core.md), [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) |
| `packages/kit/` | `@brucewaynedecoy/make-kit` | Published CLI, `make-kit` | `make-kit setup`. It holds no kit logic. | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) |
| `kits/make-docs/packages/cli/` | `@brucewaynedecoy/make-docs` | Published CLI, `make-docs`, with its MCP server | The Make Docs product | The Make Docs PRD set; shared rules in [05 Kit Conventions](05-kit-conventions.md) |
| `kits/make-docs/packages/docs/` | `@make-docs/template` | Private workspace part. It is not published alone. | The Make Docs template content | The Make Docs PRD set |
| `kits/make-docs/packages/skills/` | `@make-docs/skills` | Private workspace part. It is not published alone. | The Make Docs skills | The Make Docs PRD set |
| `kits/make-blueprint/packages/*` | `@brucewaynedecoy/make-blueprint` | Published CLI, `make-blueprint`, with its MCP server | The Make Blueprint product. Its own [Module Map](../../kits/make-blueprint/docs/prd/02-architecture-overview.md#module-map) names its parts. | The Make Blueprint PRD set |

Dependency rules:

```text
packages/kit ----> packages/core <---- kits/make-docs/packages/cli   (from Make Docs 2.2.0)
                        ^
                        +------------- kits/make-blueprint/packages/*
```

Requirements:

- Each kit release on the core depends on one exact version of `@brucewaynedecoy/make-core`, not a version range. A release build fails when the core resolves to a workspace link or to an unpublished version. [06 Shared Core](06-shared-core.md) owns this rule and the risks [R-001 Core Release Friction](03-open-questions-and-risk-register.md#r-001-core-release-friction) and [R-002 Two Core Versions in One Project](03-open-questions-and-risk-register.md#r-002-two-core-versions-in-one-project).
- Development builds can resolve the core through the npm workspace link to `packages/core/`.
- The core depends on no kit package and holds no kit content. Each kit passes its own names to the core.
- No kit package depends on another kit package.
- The setup tool holds no kit logic. It calls each kit's own setup through the core.
- Make Docs 2.0.7 and 2.1.0 do not depend on the core. Make Docs 2.2.0 is the first kit release on the core.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 2, 4, 5 and 7)
- [`make-docs v2.0.6: packages/cli/package.json:2`](../../kits/make-docs/packages/cli/package.json) (`@brucewaynedecoy/make-docs`)
- [`make-docs v2.0.6: packages/cli/package.json:15`](../../kits/make-docs/packages/cli/package.json) (the `make-docs` bin)
- [`make-docs v2.0.6: packages/docs/package.json:2`](../../kits/make-docs/packages/docs/package.json) (`@make-docs/template`, private)
- [`make-docs v2.0.6: packages/skills/package.json:2`](../../kits/make-docs/packages/skills/package.json) (`@make-docs/skills`, private)

## Runtime Boundaries

| Boundary | Rule | Owner |
| --- | --- | --- |
| Kit CLI and kit CLI | Each kit CLI runs alone. No kit CLI needs another kit CLI to run. | [01 Product Overview](01-product-overview.md#separate-or-together), [05 Kit Conventions](05-kit-conventions.md) |
| Kit and core | The core is a library inside each kit's process. It is not a CLI and not a separate server. It holds the MCP server code, and each kit runs its own MCP server under its own name. | [06 Shared Core](06-shared-core.md) |
| Setup tool and kits | `make-kit setup` calls each chosen kit's own setup through the core. Each kit's setup also runs alone with its own CLI. | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) |
| Agent tool and kit | The agent tool starts each kit's MCP server over stdio. Each kit has its own MCP server and its own profiles. | [05 Kit Conventions](05-kit-conventions.md) |
| Kit and machine Store | Each kit keeps its own machine folder and its own Store. No kit reads or writes another kit's Store. | [05 Kit Conventions](05-kit-conventions.md), [06 Shared Core](06-shared-core.md) |
| Kit and project files | Each kit writes only its own project folder and its own managed block. The core reads and writes the shared `.make/` files. Each kit only reads them and asks the core for a change. | [05 Kit Conventions](05-kit-conventions.md), [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) |
| Project and nested project | Each Make Docs project in this repository is separate. A command for one project changes no file in another project. | [Several Docs Roots](#several-docs-roots), [05 Kit Conventions](05-kit-conventions.md) |

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Context; Decision, sections 4, 5, 6 and 7)

## Data Flow

Five flows connect the parts of Make Kit.

```text
1. Shared choices   .make/config.yaml ---(core)---> each kit's setup
                    a changed choice  ---(core)---> .make/config.yaml (for every kit)
2. People and roles .make/personas.yaml ---(core)---> each kit (read only)
3. Kit settings     .make/<kit>/config.yaml --------> that kit only
4. Core version     packages/core ---> @brucewaynedecoy/make-core on npm ---> exact pin in each kit release on the core
5. Agent routing    repository root ---> root map ---> project routers ---> that project's docs/
```

- **Shared choices.** A kit set up later reads `.make/config.yaml` through the core, so earlier choices, such as the selected agent tools, are already selected. A changed choice is written back for every kit. This flow exists from the setup tool wave.
- **People and roles.** Each kit reads its people and roles from `.make/personas.yaml` through the core. The core writes the file. This flow exists from the setup tool wave.
- **Kit settings.** Settings for one kit stay in `.make/<kit>/config.yaml`, and only that kit reads them.
- **Core version.** A core change ships in a core release before a kit release uses it. [06 Shared Core](06-shared-core.md) and [08 Build and Release](08-build-and-release.md) own this flow.
- **Agent routing.** An agent at the repository root reads the root map, then the router of the project that owns the task, then that project's `docs/`. [Several Docs Roots](#several-docs-roots) owns this flow.

[07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) owns the fields of the shared files and the rules for their writes.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 4, 6 and 8)
- `.make/config.yaml`
- `.make/<kit>/config.yaml`
- `.make/personas.yaml`

## Configuration Surfaces

| Surface | Path | What it controls | Exists from | Owner |
| --- | --- | --- | --- | --- |
| Root workspace manifest | `package.json` | A private npm workspace root with the workspaces `packages/*` and `kits/*/packages/*` | Copy day | This document ([Q-005 One Root npm Workspace](03-open-questions-and-risk-register.md#q-005-one-root-npm-workspace)) |
| Root lockfile | `package-lock.json` | The only lockfile in the repository. Dependabot watches it. | Copy day | This document; Dependabot in [08 Build and Release](08-build-and-release.md) |
| Make Docs build config | `kits/make-docs/packages/cli/tsup.config.ts` | Loads `yaml` through the workspace, not through a fixed path | Copy day | This document |
| Root Make Docs project | `.make-docs/config.yaml` | The root `projectId` `5275b2af-166a-4ba5-86e6-27e6616aa2d8` and the agent-tool integrations | Now | This document |
| Make Blueprint Make Docs project | `kits/make-blueprint/.make-docs/config.yaml` | The Make Blueprint docs `projectId` `ca26b07b-5b6f-4368-bd41-8642eeeca9e4` | Now | The Make Blueprint PRD set |
| Make Docs Make Docs project | `kits/make-docs/.make-docs/config.yaml` | The Make Docs docs `projectId` `831ddb50-b97a-47e2-9f2c-f491b27b8759`, the same value as in the old repository ([Q-017 Make Docs Store Identity](03-open-questions-and-risk-register.md#q-017-make-docs-store-identity)) | Copy day | [08 Build and Release](08-build-and-release.md) |
| Root map | The hand-written part of `AGENTS.md` and `CLAUDE.md` | Agent routing and the numbered temporary workarounds | Now | This document, [Several Docs Roots](#several-docs-roots) |
| CI and release | `.github/workflows/make-docs-ci.yml`, `.github/workflows/publish-npm.yml`, `.github/release-candidates/<tag>.sha256` and the Dependabot config | CI, publish and release-candidate digests | The public step and the CI step | [08 Build and Release](08-build-and-release.md) |
| Routing check | `scripts/routing-check/` | The 9 tasks, the 2 tools and the pass rule | The first routing check | This document, [Routing Check](#routing-check) |
| Shared kit files in a user project | `.make/config.yaml`, `.make/<kit>/config.yaml` and `.make/personas.yaml` | Shared choices, kit settings, and people and roles | The setup tool wave | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) |
| Machine folders | `~/.make/<kit>/` with a `MAKE_<KIT>_HOME` setting for each kit | Where each kit keeps its Store | Each kit's own release | [05 Kit Conventions](05-kit-conventions.md) |

Requirements:

- The root `package.json` has `"private": true` and exactly the workspaces `packages/*` and `kits/*/packages/*`.
- The root holds the only `package-lock.json`. No folder under `kits/` or `packages/` holds a lockfile.
- No `package.json` below the repository root declares `workspaces`, because npm cannot nest one workspace root inside another.
- `npm ci`, the build and all Make Docs tests pass when they run from the repository root.
- The Make Docs `tsup` config resolves `yaml` through the workspace. The copy in `kits/make-docs/` resolves `yaml` through Node module resolution from the package folder. At `v2.0.6` the config resolves `yaml` from a fixed path below the package's repository root ([`make-docs v2.0.6: packages/cli/tsup.config.ts:7`](../../kits/make-docs/packages/cli/tsup.config.ts) and [`make-docs v2.0.6: packages/cli/tsup.config.ts:27`](../../kits/make-docs/packages/cli/tsup.config.ts)), and that path does not exist inside `kits/make-docs/`.
- Make Docs tests and scripts that assume they run at the repository root pass from `kits/make-docs/` ([R-006 Make Docs Tests That Assume the Repository Root](03-open-questions-and-risk-register.md#r-006-make-docs-tests-that-assume-the-repository-root)).
- Each Make Docs project config in the repository has a different `projectId`.
- No configuration file in the repository holds a secret or a local home-folder path.
- [05 Kit Conventions](05-kit-conventions.md) owns the project folder and machine folder rules for each kit, including the Make Docs gaps.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Context; Decision, sections 2, 3, 6, 7, 8 and 12)
- `.make-docs/config.yaml`
- `kits/make-blueprint/.make-docs/config.yaml`
- [`make-docs v2.0.6: package.json:10`](https://github.com/brucewaynedecoy/make-docs/blob/v2.0.6/package.json) (the old repository's own workspace root, `packages/*`)
- [`make-docs v2.0.6: packages/cli/tsup.config.ts:27`](../../kits/make-docs/packages/cli/tsup.config.ts)
- [`make-docs v2.0.6: .make-docs/config.yaml:1`](../../kits/make-docs/.make-docs/config.yaml) (the Make Docs `projectId`)

## Source Anchors

- [Make Kit Monorepo](../designs/2026-10-30-make-kit-monorepo.md) design, sections 2, 4 to 10 and 14
- [Make Kit Monorepo Baseline Plan](../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md)
- The root map in [AGENTS.md](../../AGENTS.md) and [CLAUDE.md](../../CLAUDE.md), above the Make Docs block
- Make Docs path and folder facts: [05 Kit Conventions](05-kit-conventions.md)
- [Make Blueprint 02 Architecture Overview](../../kits/make-blueprint/docs/prd/02-architecture-overview.md)
- [`make-docs v2.0.6: package.json`](https://github.com/brucewaynedecoy/make-docs/blob/v2.0.6/package.json)
- [`make-docs v2.0.6: packages/cli/package.json`](../../kits/make-docs/packages/cli/package.json)
- [`make-docs v2.0.6: packages/cli/tsup.config.ts`](../../kits/make-docs/packages/cli/tsup.config.ts)
