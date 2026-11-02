---
title: "04 Glossary"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md"
---

# 04 Glossary

## Purpose

This glossary defines the words used across the repo-wide PRD set, so people and agents read each term the same way. Each term has one meaning, written to match how its owning PRD uses it, and a link to that PRD. When a definition here and the owning PRD differ, the owning PRD wins, and the difference goes into [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md).

The list is in alphabetical order, ignoring code formatting and letter case. Terms in code formatting are exact values, field names or commands. Each kit's own PRD set has its own glossary, such as the [Make Blueprint glossary](../../kits/make-blueprint/docs/prd/04-glossary.md).

## Terms

| Term | Definition | Notes |
| --- | --- | --- |
| Agent tool | An AI coding agent host, such as Claude Code, Codex or GitHub Copilot CLI. The agent tool starts each kit's MCP server and reads the routers. | The Make Docs code calls an agent tool a harness. [05 Kit Conventions](05-kit-conventions.md#rules-for-every-area) |
| `allowWrite` | The MCP tool input that allows a write. A write call without `allowWrite: true` fails before the operation runs. | [05 Kit Conventions](05-kit-conventions.md#mcp-profiles-and-write-permission) |
| `--apply` | The CLI flag that lets a preview-first command write its plan. It is the one flag name for this write in every kit. Its MCP input is `apply: true`, which also needs `allowWrite: true`. | [05 Kit Conventions](05-kit-conventions.md#cli-write-intent), [Q-036](03-open-questions-and-risk-register.md#q-036-preview-first-write-commands) |
| Code owner | A person that `.github/CODEOWNERS` names as the reviewer of a path. In `make-kit`, the owner is the only code owner. | [08 Build and Release](08-build-and-release.md#rulesets-and-ownership), [Q-013](03-open-questions-and-risk-register.md#q-013-code-owners) |
| Content folder | A project folder that holds a kit's project knowledge and that the kit's own PRDs name, such as Make Docs `docs/` and its docs folders, or Make Blueprint `blueprint/` and its top sub-folders. A kit writes routers in its content folders. | [05 Kit Conventions](05-kit-conventions.md#routers-and-managed-blocks), [Q-037](03-open-questions-and-risk-register.md#q-037-router-places-in-kit-terms) |
| Copy day | The day that the latest Make Docs release tag, `v2.0.6` today, is copied into `kits/make-docs/` with `git archive`, and the old repository freezes. | [08 Build and Release](08-build-and-release.md#source-home), [Q-003](03-open-questions-and-risk-register.md#q-003-copy-source-and-freeze) |
| Core | The shared core: one TypeScript library, `@brucewaynedecoy/make-core`, in `packages/core/`. Every kit builds on it. It has no CLI and holds no product content. | Also called the shared core. [06 Shared Core](06-shared-core.md) |
| Core area | One of the eight parts of the core boundary: layout and paths, resource reading, the MCP server and its profiles, the Store base, agent-tool setup, managed blocks, tool discovery, and tool `update` and uninstall. | [06 Shared Core](06-shared-core.md#component-and-capability-map) |
| Deferred obligation | Owed future work with a stable `O-###` number, such as a temporary workaround that must go when its fix ships. Each record names its owner, its trigger and its exit criteria. | [Deferred Obligations](03-open-questions-and-risk-register.md#deferred-obligations) |
| Dist-tag | An npm name that points to one version of a package. `latest` is the default install. `next` holds release candidates. | [08 Build and Release](08-build-and-release.md#release-gate) |
| Docs root | The `docs/` folder of one Make Docs project, `<project>/docs`. Make Docs config cannot rename it. This repository has one docs root for repo-wide work and one for each kit. | [02 Architecture Overview](02-architecture-overview.md#several-docs-roots) |
| Entry | One item in `.make/personas.yaml`, with the fields `slug`, `label`, `description`, `primitive`, `kind` and `kits`. | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md#people-and-roles-entry-fields) |
| Exact pin | A dependency on one exact version of the core, such as `0.1.0`, not a version range. Each kit release on the core has one. | [06 Shared Core](06-shared-core.md#core-versions-and-the-exact-pin) |
| Exit-code table | The one table of exit codes for every kit command: `0` success, `1` failure, `2` input error. | [05 Kit Conventions](05-kit-conventions.md#exit-code-table) |
| Gap | A place where Make Docs at `v2.0.6` differs from a target rule. The register records each gap as confirmed drift with a `D-###` number. | [05 Kit Conventions](05-kit-conventions.md), [Confirmed Drift](03-open-questions-and-risk-register.md#confirmed-drift) |
| Hand-written tool | An MCP tool that a kit writes by hand, outside the operation registry. The six Make Docs hand-written tools only read. | Compare registry-derived tool. [05 Kit Conventions](05-kit-conventions.md#mcp-server) |
| Handoff line | The line in one kit's managed block that names what another kit in the same project owns. | Later Make Docs scope. [01 Product Overview](01-product-overview.md#release-scope) |
| Install check | A check that installs a package from the npm registry on Linux, macOS and Windows, runs `<cli> --version` and sets up a temporary project. | [08 Build and Release](08-build-and-release.md#release-gate) |
| Install manager | The tool that installed a kit on the machine: npm, pnpm, bun or Homebrew. `update` hands the update to it. | [05 Kit Conventions](05-kit-conventions.md#cli-top-level), [06 Shared Core](06-shared-core.md#tool-update-and-uninstall) |
| Intent profile | A named set of MCP tools, such as `core` or `quality`. A profile filters the tools that the server lists and accepts. It never grants access. | [05 Kit Conventions](05-kit-conventions.md#mcp-profiles-and-write-permission) |
| Kit | One Make Kit product with its own npm package and its own CLI, such as Make Docs or Make Blueprint. Each kit installs and runs alone. | [01 Product Overview](01-product-overview.md) |
| Kit names as inputs | The rule that each kit passes its own names to the core, such as its CLI name, its folders, its environment names and its block tag. The core holds no kit name. | [06 Shared Core](06-shared-core.md#kit-names-as-inputs) |
| Link read command | The Make Docs read command that confirms Make Docs work item IDs and doc paths for Make Blueprint. It ships in Make Docs 2.1.0 with the O-004 fix. | [01 Product Overview](01-product-overview.md#release-scope), [Q-020](03-open-questions-and-risk-register.md#q-020-release-of-the-link-read-command) |
| Local copy | An optional copy of a system resource in the project, below `<project tool directory>/system/<type folder>/`. A kit serves the installed body when no valid local copy exists. | [05 Kit Conventions](05-kit-conventions.md#system-resources-and-project-records) |
| Long-running lifecycle command | A top-level command that starts a long-running process, such as a local server. A kit can have at most one, beside the seven top-level commands, and the kit's own PRDs name it. Make Docs has none. The Make Blueprint `serve` command is one. | [05 Kit Conventions](05-kit-conventions.md#cli-top-level), [Q-039](03-open-questions-and-risk-register.md#q-039-long-running-lifecycle-command) |
| Machine folder | The folder where one kit keeps its machine state, `<user-data-root>/.make/<kit>/`, unless `MAKE_<KIT>_HOME` names another folder. Make Docs uses `~/.make-docs/` today. | Also called the Store root. [05 Kit Conventions](05-kit-conventions.md#machine-folders) |
| Make Kit | The whole stack: every kit, the core and the setup tool, in the `make-kit` repository. | [01 Product Overview](01-product-overview.md) |
| Managed block | The part of an instruction file that one kit owns, between `<!-- <kit-cli>:begin -->` and `<!-- <kit-cli>:end -->`. The kit writes only inside its own block. | [05 Kit Conventions](05-kit-conventions.md#routers-and-managed-blocks) |
| Naive UAT | A Make Docs test format for one fresh tester per run. It is out of Step 0, and a later Make Docs wave removes it. | [01 Product Overview](01-product-overview.md#release-scope), [Q-009](03-open-questions-and-risk-register.md#q-009-naive-uat-removal) |
| Nested project | A Make Docs project inside the git repository of another project, such as `kits/make-blueprint/` in `make-kit`. | [02 Architecture Overview](02-architecture-overview.md#several-docs-roots) |
| npm workspace | The one private root `package.json` with the workspaces `packages/*` and `kits/*/packages/*`, and its one lockfile. | [02 Architecture Overview](02-architecture-overview.md#configuration-surfaces) |
| Old repository | The frozen `make-docs` repository, `github.com/brucewaynedecoy/make-docs`. It holds the Make Docs history before copy day. | [08 Build and Release](08-build-and-release.md#old-repository) |
| Operation identifier | The stable name of one kit operation, in the form `domain.verb` or `domain.object.verb`, such as `work.item.resolve`. | [05 Kit Conventions](05-kit-conventions.md#run-command-paths) |
| Operation registry | The one list of a kit's operations. The CLI paths, the usage text, the `run` help and the registry-derived MCP tools come from it. | [05 Kit Conventions](05-kit-conventions.md#run-command-paths), [06 Shared Core](06-shared-core.md#slice-order) |
| Package proof | The CI check that builds one tarball, installs it on Linux, macOS and Windows and compares the results. | [08 Build and Release](08-build-and-release.md#ci) |
| Persona | An audience role in a project: a `user` or `maintainer` entry. Either role can be a person or an agent. | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md#shared-people-and-roles) |
| Preview-first command | A write command that shows its plan and writes nothing by default. It writes only with `--apply`, and `--dry-run` does the same as the default. The kit's own PRDs name each one. Make Docs `project path-hygiene repair` and Make Blueprint `run import v1` are preview-first. | [05 Kit Conventions](05-kit-conventions.md#cli-write-intent), [Q-036](03-open-questions-and-risk-register.md#q-036-preview-first-write-commands) |
| Primitive | The audience role field of an entry: `user` or `maintainer`. There is no `agent` primitive. | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md#people-and-roles-entry-fields) |
| Project record | A plain file in the project, such as a design, plan, PRD or work item. It has no URI, and agents read it by its relative path. | [05 Kit Conventions](05-kit-conventions.md#system-resources-and-project-records) |
| Project tool directory | The folder of one kit in a project, `.make/<kit>/`. It holds the kit config and the optional local copies. Make Docs uses `.make-docs/` today. | [05 Kit Conventions](05-kit-conventions.md#project-config) |
| `projectId` | The key in a kit's project config that holds the project identity. The Store keys the project's records by it. Each nested project has its own `projectId`. | [05 Kit Conventions](05-kit-conventions.md#project-config), [02 Architecture Overview](02-architecture-overview.md#configuration-surfaces) |
| Provenance | A signed npm statement of which repository and workflow built a package. npm makes it only from a public repository. | [08 Build and Release](08-build-and-release.md#publish) |
| Reference kit | The kit whose code is the source of the shared rules. Make Docs is the reference kit. | [05 Kit Conventions](05-kit-conventions.md#purpose) |
| Registry-derived tool | An MCP tool that the server builds from one operation identifier. It runs the same operation as the CLI and takes `dryRun` and `approvals`. | Compare hand-written tool. [05 Kit Conventions](05-kit-conventions.md#mcp-server) |
| Release candidate | A prerelease version, `<version>-rc.<n>`, on the `next` dist-tag. | [08 Build and Release](08-build-and-release.md#release-gate) |
| Release gate | The release steps for a stable version: a dry run in the pull request, a release candidate on `next`, the install check, then the stable version on `latest` and the install check again. | [08 Build and Release](08-build-and-release.md#release-gate), [Q-032](03-open-questions-and-risk-register.md#q-032-release-gate-scope) |
| Release tag | A git tag that names the package and the version, `<package>-v<version>`, such as `make-docs-v2.0.7`. | [08 Build and Release](08-build-and-release.md#release-tags-and-packages) |
| Release-candidate digest | The reviewed SHA-256 of a release tarball, in `.github/release-candidates/<tag>.sha256`. | [08 Build and Release](08-build-and-release.md#release-candidate-digests) |
| Root map | The hand-written part of the root `AGENTS.md` and `CLAUDE.md`, above the Make Docs block. It routes agents to the right project and lists the numbered temporary workarounds. | [02 Architecture Overview](02-architecture-overview.md#several-docs-roots) |
| Router | An instruction file, `AGENTS.md` or `CLAUDE.md`, that points agents to the kit's resources and docs. A kit writes its router text only inside its managed block. | [05 Kit Conventions](05-kit-conventions.md#routers-and-managed-blocks) |
| Routing check | The script in `scripts/routing-check/` that starts fresh read-only agents at the repository root and records whether each one reaches the right router and docs root. | [02 Architecture Overview](02-architecture-overview.md#routing-check), [Q-008](03-open-questions-and-risk-register.md#q-008-routing-check-method) |
| Ruleset | A GitHub rule set that protects `main` and the release tags. | [08 Build and Release](08-build-and-release.md#rulesets-and-ownership) |
| Setup tool | The `make-kit` CLI in `@brucewaynedecoy/make-kit`, from `packages/kit/`. `make-kit setup` sets up any mix of kits with one set of choices. | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) |
| Setup tool wave | The repo-wide wave after Step 0 that builds the setup tool and the shared files. | [01 Product Overview](01-product-overview.md#release-scope), [Q-001](03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope) |
| Shared choices | The setup choices that every kit in a project needs, such as the selected agent tools, kept in `.make/config.yaml`. | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md#shared-setup-choices) |
| Shared files | The two project files that every kit shares, `.make/config.yaml` and `.make/personas.yaml`. The core writes them, and each kit only reads them. | Compare shared router. [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md#project-files) |
| Shared router | The `.make/` router, `.make/AGENTS.md` and `.make/CLAUDE.md`. It holds one managed block for each kit that has a `.make/<kit>/` folder, and each kit writes only its own block. | Compare shared files. [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md#project-files), [Q-037](03-open-questions-and-risk-register.md#q-037-router-places-in-kit-terms) |
| Short-router budget | The rule that a router is a short managed block that points first to a valid local body and then to `<kit-cli> resource read`, and repeats no full procedure. | The design calls this progressive disclosure. [05 Kit Conventions](05-kit-conventions.md#routers-and-managed-blocks) |
| Slice | One step in the build of the core from the Make Docs code. Every slice keeps all Make Docs tests green. | [06 Shared Core](06-shared-core.md#slice-order) |
| Staged publishing | The npm publish path in which the workflow runs `npm stage publish`, and the owner approves the stage on npmjs.com before the version is public. | [08 Build and Release](08-build-and-release.md#publish) |
| Step 0 | The repo-wide release scope before Make Blueprint v2.0: copy day, the public repository, CI, the switch point, Make Docs 2.1.0, the core and Make Docs 2.2.0. | [01 Product Overview](01-product-overview.md#release-scope), [Q-021](03-open-questions-and-risk-register.md#q-021-step-0-sequence) |
| Store | A kit's machine database, a SQLite file in its machine folder, that holds local operational state only. | [05 Kit Conventions](05-kit-conventions.md#store-boundary) |
| Store installation ledger | The Store record of what a kit installed in a project. It is the install record. No kit writes an install record into a project folder. | [05 Kit Conventions](05-kit-conventions.md#store-boundary) |
| Store root | See machine folder. | [05 Kit Conventions](05-kit-conventions.md#machine-folders) |
| Store schema version | The `PRAGMA user_version` of the Store. It is 6 for Make Docs, and every Step 0 release keeps 6. | [06 Shared Core](06-shared-core.md#store-base-and-schema-version-6) |
| Switch point | Make Docs 2.0.7, the first Make Docs release from the `make-kit` repository. It has the same code as 2.0.6. | [08 Build and Release](08-build-and-release.md#switch-point), [Q-002](03-open-questions-and-risk-register.md#q-002-switch-point-before-the-core) |
| Switch test | The six steps that release 2.0.7, from the dry run to `2.0.7` on `latest` and the install check. | [08 Build and Release](08-build-and-release.md#switch-point), [Q-011](03-open-questions-and-risk-register.md#q-011-switch-test) |
| System resource | A contract, prompt, reference or template that the installed kit package serves by the URI `<kit-cli>://system/<type>/<path>`. | [05 Kit Conventions](05-kit-conventions.md#system-resources-and-project-records) |
| Tag-aware managed block | A managed block whose code takes the kit's tag as input and reads and writes only the markers with that tag, so two kits can each keep one block in one file. | [06 Shared Core](06-shared-core.md#core-versions-and-the-exact-pin), [05 Kit Conventions](05-kit-conventions.md#routers-and-managed-blocks) |
| Target rule | The rule that every kit follows in one rule area of Kit Conventions. Each target rule states an observable result. | [05 Kit Conventions](05-kit-conventions.md#scope) |
| Tool discovery | The core area that finds whether another kit is present: its CLI on the machine and its managed block in the project. | [06 Shared Core](06-shared-core.md#tool-discovery) |
| Trusted publisher | The npm setting that lets one GitHub repository and workflow publish a package over OIDC, with no npm token. | [08 Build and Release](08-build-and-release.md#trusted-publisher-settings) |
| Uninstall fix | The Make Docs 2.2.0 fix for kit removal. `setup remove` strips only the Make Docs block from a file with user text and keeps that text (D-030). The `uninstall` help and message match what the Store removal does (D-002). The `setup remove` guard uses the resolved Store root (D-039). | Scope: [Q-035](03-open-questions-and-risk-register.md#q-035-scope-of-the-uninstall-fix-in-220). [06 Shared Core](06-shared-core.md#core-versions-and-the-exact-pin) |
| Workspace link | The npm workspace link from a kit to `packages/core/`. Development builds use it. Release builds never do. | [06 Shared Core](06-shared-core.md#core-versions-and-the-exact-pin) |

## Source Anchors

- `docs/prd/01-product-overview.md` to `docs/prd/08-build-and-release.md`
- `docs/designs/2026-10-30-make-kit-monorepo.md`
- `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md`
- `kits/make-blueprint/docs/prd/04-glossary.md`
