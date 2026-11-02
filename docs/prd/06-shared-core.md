---
title: "06 Shared Core"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md"
---

# 06 Shared Core

## Purpose

The shared core is one TypeScript library, `@brucewaynedecoy/make-core`, in `packages/core/`. Every kit builds on it, so every kit uses one implementation of the behavior that kits share. The core has no CLI and holds no product content. Each kit passes its own names and its own content to the core.

This document owns the core boundary, the kit names that each kit passes to the core, tool discovery, the order in which the core is built, Store compatibility, the core versions and the exact version pin, and the core risks. [05 Kit Conventions](05-kit-conventions.md) owns the rules that the core puts into effect for every kit. [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) owns the fields of the shared `.make/` files that the core reads and writes.

On 2026-11-01 the core does not exist. `packages/core/` is not in the repository, and `@brucewaynedecoy/make-core` is not on npm. Until Make Docs 2.2.0, the behavior that the core holds lives in the Make Docs code, which this document cites at the `v2.0.6` tag. Terms are in [04 Glossary](04-glossary.md).

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 4 and 6)
- `kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md` (Shared Core)
- `packages/core/`

## Scope

This document covers:

- The core boundary: eight areas, the code for the shared `.make/` files, and what stays out of the core.
- The kit names that each kit passes to the core, with the names that Make Docs hard-codes today.
- Tool discovery, which has no source in Make Docs.
- The slice order in which the core is built from the Make Docs code.
- Store compatibility with Make Docs 2.0.x and Store schema version 6.
- Core `0.1.0`, the exact version pin in each kit release on the core, and Make Docs 2.2.0 as the first kit release on the core.
- The risks R-001 and R-002.

Covered elsewhere:

| Subject | Owner |
| --- | --- |
| The rules every kit follows: CLI shape, outcomes, MCP profiles, system resources, routers and managed blocks, project and machine folders, the Store boundary | [05 Kit Conventions](05-kit-conventions.md) |
| The fields of `.make/config.yaml`, `.make/<kit>/config.yaml` and `.make/personas.yaml`, and the `make-kit setup` steps | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) |
| The core release tag, the publish workflow and the release gate | [08 Build and Release](08-build-and-release.md) |
| The package map and the dependency rules between packages | [02 Architecture Overview](02-architecture-overview.md#module-map) |
| The release order of core `0.1.0` and Make Docs 2.2.0 | [01 Product Overview](01-product-overview.md#release-scope) |
| Make Blueprint content, records, storage and its `serve` command | The [Make Blueprint PRD set](../../kits/make-blueprint/docs/prd/00-index.md) |

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 4, 6, 11 and 13)
- `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/03-core-setup-and-release.md` (06 Shared Core)

## Component and Capability Map

The core has eight areas. It also holds the code that reads and writes the shared `.make/` files. The table names the Make Docs code that holds each part at `v2.0.6`.

| Core part | What it holds | Make Docs code at `v2.0.6` | Built from |
| --- | --- | --- | --- |
| Layout and paths | Project folder and machine folder paths, router places, and path handling on Linux, macOS and Windows | `make-docs v2.0.6: packages/cli/src/tool-directory.ts:7`, `make-docs v2.0.6: packages/cli/src/router-paths.ts:36`, `make-docs v2.0.6: packages/cli/src/store/paths.ts:36`, `make-docs v2.0.6: packages/cli/src/platform.ts:267` | Make Docs code |
| Resource reading | Reading system resources by stable URI from the installed package, with an optional valid local copy read first | `make-docs v2.0.6: packages/cli/src/operations/resource/identity.ts:48`, `make-docs v2.0.6: packages/cli/src/operations/resource/provider.ts:54`, `make-docs v2.0.6: packages/cli/src/operations/resource/resolver.ts:76` | Make Docs code |
| MCP server and profiles | The stdio MCP server, the profile filter, the `allowWrite` gate, connection-key admission, and the operation registry from which the CLI and MCP surfaces are built | `make-docs v2.0.6: packages/cli/src/mcp/server.ts:24`, `make-docs v2.0.6: packages/cli/src/mcp/tools.ts:309`, `make-docs v2.0.6: packages/cli/src/operations/registry.ts:506`, `make-docs v2.0.6: packages/cli/src/operations/mcp-metadata.ts:2` | Make Docs code |
| Store base | Opening, locking and versioning the kit's machine Store, project identity, installation records and tool-operation records | `make-docs v2.0.6: packages/cli/src/store/database.ts:556`, `make-docs v2.0.6: packages/cli/src/store/database.ts:1420`, `make-docs v2.0.6: packages/cli/src/store/tool-operations.ts:103` | Make Docs code |
| Agent-tool setup | MCP entries, rules and user Skills for Claude Code, Codex and GitHub Copilot CLI, and the check of the kit executable | `make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:109`, `make-docs v2.0.6: packages/cli/src/harness-access/native.ts:105`, `make-docs v2.0.6: packages/cli/src/setup-system.ts:59`, `make-docs v2.0.6: packages/cli/src/skill-paths.ts:13` | Make Docs code |
| Managed blocks | The block library, and the code that merges, repairs and removes a kit's block in an instruction file | `make-docs v2.0.6: packages/cli/src/managed-block.ts:1`, `make-docs v2.0.6: packages/cli/src/planner.ts:1770`, `make-docs v2.0.6: packages/cli/src/audit.ts:326` | Make Docs code |
| Tool discovery | Finding another installed kit on the machine and in the project | None. See [Tool Discovery](#tool-discovery). | New code |
| Tool `update` and uninstall | Finding the install manager, handing the update or uninstall to it, and removing the machine Store on request | `make-docs v2.0.6: packages/cli/src/self/install-manager.ts:80`, `make-docs v2.0.6: packages/cli/src/self/update-tool.ts:178`, `make-docs v2.0.6: packages/cli/src/self/uninstall-tool.ts:60`, `make-docs v2.0.6: packages/cli/src/store/lifecycle.ts:167` | Make Docs code |
| Shared `.make/` files | Reading and writing `.make/config.yaml` and `.make/personas.yaml` for every kit | None. Make Docs keeps its agent-tool choices and Personas in `.make-docs/config.yaml` (`make-docs v2.0.6: packages/cli/src/config.ts:95`). | New code, in the setup tool wave |

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Context; Decision, sections 4 and 6)
- `kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md` (Shared Core)

### Core Boundary

The eight areas come from the boundary that the owner accepted for Make Blueprint. The operation registry is part of the MCP server area, because the MCP tools and the CLI paths are built from it. The [Make Blueprint Shared Core](../../kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md#shared-core) table also lists the shared project files. The shared project files are the ninth core part in the table above. The Make Blueprint `serve` command is the long-running lifecycle command of that kit ([05 Kit Conventions, CLI Top Level](05-kit-conventions.md#cli-top-level)). It is not a core part.

Requirements:

- `packages/core/` holds the eight areas and the code for the shared `.make/` files, and nothing else.
- The core depends on no kit package. `npm ls --workspace packages/core` lists no `@brucewaynedecoy/make-docs`, `@brucewaynedecoy/make-blueprint` or `@brucewaynedecoy/make-kit` package.
- The core holds no product content: no template, no system resource body, no Skill, no router text and no product operation. Each kit passes its own content to the core.
- The core has no CLI and reserves no command name. Each kit owns its own commands, and [05 Kit Conventions](05-kit-conventions.md) owns the shared CLI shape.
- The core runs inside each kit's process. Each kit runs its own MCP server, under its own name, through the core.
- The core reads and writes only the kit's own folders, the kit's own Store, the kit's own managed block, the agent-tool files for that kit's entries, and the shared `.make/` files.
- The core supports Linux, macOS and Windows. On Windows, the user data root is `LOCALAPPDATA`, then `APPDATA`, then the home folder, as in Make Docs today (`make-docs v2.0.6: packages/cli/src/platform.ts:271`).
- The core keeps the MCP connection-key rules of Make Docs: the key is 32 random bytes in base64url, the machine config keeps only its SHA-256, and the key check is timing-safe (`make-docs v2.0.6: packages/cli/src/mcp-connection.ts:15`, `make-docs v2.0.6: packages/cli/src/mcp-connection.ts:59`). No core file and no core test fixture holds a real key.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, section 4)
- `kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md` (Shared Core)
- `make-docs v2.0.6: packages/cli/src/operations/registry.ts:321`
- `make-docs v2.0.6: packages/cli/src/managed-block.ts:1`

### Tool Discovery

Tool discovery tells one kit whether another kit is present. It has two checks: whether the other kit's CLI runs on this machine, and whether the other kit's managed block is in the project's root instruction files. No Make Docs code at `v2.0.6` finds another installed kit, so this area has no Make Docs source ([Q-016 Core Extraction Order](03-open-questions-and-risk-register.md#q-016-core-extraction-order)). The nearest Make Docs pieces are these:

- `platform.findExecutable` is a `PATH` lookup. Make Docs uses it only to detect agent tools through their `executableNames` (`make-docs v2.0.6: packages/cli/src/platform.ts:306`, `make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:45`).
- `detectInstallSource` finds only the Make Docs binary. It needs the `make-docs` substring in the path (`make-docs v2.0.6: packages/cli/src/self/install-manager.ts:194`).

Requirements:

- Tool discovery takes the other kit's names as input: its CLI name, its managed-block tag and its project folder. It holds no kit name.
- When the other kit's CLI runs on this machine, tool discovery reads its version, so the caller can tell whether that kit supports a needed capability.
- Tool discovery finds the Make Docs block in a project that uses the current `.make-docs/` folder and in a project that uses the target `.make/docs/` folder from [05 Kit Conventions](05-kit-conventions.md).
- Tool discovery works offline. It never installs, updates or uninstalls a kit, and it never starts a long-running copy of a kit.
- Tool discovery gives the same result on Linux, macOS and Windows for the same installed kits.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Context: no Make Docs code finds another installed tool)
- `kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md` (Tool Discovery)
- `make-docs v2.0.6: packages/cli/src/platform.ts:306`
- `make-docs v2.0.6: packages/cli/src/self/install-manager.ts:194`

### Tool Update and Uninstall

Make Docs `update` finds the install manager and hands the update to it. The managers are npm, pnpm, bun and Homebrew (`make-docs v2.0.6: packages/cli/src/self/install-manager.ts:80`). `uninstall` keeps the Store unless the person asks to remove it. The core holds this behavior for every kit.

Requirements:

- The core finds the install manager from the kit's own package name and executable name, not from a fixed `make-docs` string.
- Tool update and tool uninstall change no project folder.
- Tool uninstall keeps the kit's machine Store unless the person chooses to remove it.
- Store removal refuses a folder that looks like a project folder, as Make Docs does today (`make-docs v2.0.6: packages/cli/src/store/lifecycle.ts:131`).
- Tool uninstall reports each machine-scope MCP entry and each user Skill folder that still names the kit, and says how to remove it. Make Docs has no such code at `v2.0.6`. Make Blueprint needs it ([Make Blueprint Tool Uninstall](../../kits/make-blueprint/docs/prd/07-installation-and-distribution.md#tool-uninstall)).

Code anchors:

- `make-docs v2.0.6: packages/cli/src/self/index.ts:10`
- `make-docs v2.0.6: packages/cli/src/self/update-tool.ts:114`
- `make-docs v2.0.6: packages/cli/src/self/uninstall-tool.ts:60`
- `make-docs v2.0.6: docs/prd/39-cli-command-model-and-operation-registry.md` (Tool Self-Management)

### Slice Order

The core is built from the copied Make Docs code inside this repository, after the switch point and after Make Docs 2.1.0 ([Q-002 Switch Point Before the Core](03-open-questions-and-risk-register.md#q-002-switch-point-before-the-core), [Q-021 Step 0 Sequence](03-open-questions-and-risk-register.md#q-021-step-0-sequence)). It is built in slices, from the parts that are easy to pull out of Make Docs to the parts that are tangled with Make Docs product code ([Q-016 Core Extraction Order](03-open-questions-and-risk-register.md#q-016-core-extraction-order)).

| Band | Parts | Why |
| --- | --- | --- |
| First | Resource reading, the managed-block library, tool `update` and uninstall | Few product ties. The block library has no product imports and no Store use (`make-docs v2.0.6: packages/cli/src/managed-block.ts:1`). |
| Between | Layout and paths, the MCP server and profiles without the registry, the Store base without the migrations, agent-tool setup, tool discovery | Some product ties, such as router paths that read Make Docs capabilities (`make-docs v2.0.6: packages/cli/src/router-paths.ts:42`). The Step 0 work backlog sets their exact order. |
| Last | The operation registry, the Store migrations, the managed-block merge and remove code | Tangled with product code. See the reasons below. |

The three hard parts are tangled for these reasons:

- **Operation registry.** `assembleRegistry` imports the Make Docs product operation modules by name (`make-docs v2.0.6: packages/cli/src/operations/registry.ts:321`). The identifier, path and usage lists are fixed product lists (`make-docs v2.0.6: packages/cli/src/operations/registry.ts:130`). The MCP name map is a fixed list (`make-docs v2.0.6: packages/cli/src/mcp/tools.ts:137`). The core registry needs a point where each kit registers its own operations.
- **Store migrations.** Base tables and Make Docs product tables share one ordered migration list and one `PRAGMA user_version` counter (`make-docs v2.0.6: packages/cli/src/store/database.ts:86`). See [Store Base and Schema Version 6](#store-base-and-schema-version-6).
- **Managed-block merge and remove code.** It is spread across product files: the planner (`make-docs v2.0.6: packages/cli/src/planner.ts:1770`, `make-docs v2.0.6: packages/cli/src/planner.ts:716`), install (`make-docs v2.0.6: packages/cli/src/install.ts:467`), audit (`make-docs v2.0.6: packages/cli/src/audit.ts:326`), the manifest block hash (`make-docs v2.0.6: packages/cli/src/manifest.ts:130`) and the Store installation state (`make-docs v2.0.6: packages/cli/src/store/installation-state.ts:10`).

Requirements:

- After each slice, `npm test` from the repository root passes, and the Make Docs CI workflow passes on Linux, macOS and Windows.
- After each slice, Make Docs behaves as Make Docs 2.1.0 does, apart from the two fixes that ship in Make Docs 2.2.0.
- During the slices, Make Docs reaches the core only through the npm workspace link to `packages/core/`. No core version is published before all eight areas are in `packages/core/`. An urgent Make Docs fix during the slices is a tracked risk ([R-009 Urgent Make Docs Fix During the Core Slices](03-open-questions-and-risk-register.md#r-009-urgent-make-docs-fix-during-the-core-slices)).

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Context: easy and tangled parts; Decision, sections 4 and 11)
- `make-docs v2.0.6: packages/cli/src/operations/registry.ts:321`
- `make-docs v2.0.6: packages/cli/src/store/database.ts:86`
- `make-docs v2.0.6: packages/cli/src/planner.ts:1770`

## Contracts and Data

### Kit Names as Inputs

Each kit passes its own names to the core ([Q-016 Core Extraction Order](03-open-questions-and-risk-register.md#q-016-core-extraction-order)). The core holds no kit name. Make Docs hard-codes these names at `v2.0.6`. Each one is a core input.

| Input | Make Docs value at `v2.0.6` | Anchor |
| --- | --- | --- |
| CLI name | `make-docs`, the package bin. The CLI path text in the registry is `make-docs ${root} ${cliPath}`. | `make-docs v2.0.6: packages/cli/package.json:15`, `make-docs v2.0.6: packages/cli/src/operations/registry.ts:278` |
| npm package name | `@brucewaynedecoy/make-docs`, also the fallback in `SELF_PACKAGE_NAME` and the package marker `@brucewaynedecoy/make-docs:package-bin` | `make-docs v2.0.6: packages/cli/src/self/install-manager.ts:60`, `make-docs v2.0.6: packages/cli/src/harness-access/contract.ts:32` |
| Resource URI prefix | `make-docs://system/`, with the identity template `make-docs://system/{type}/{path}` | `make-docs v2.0.6: packages/cli/src/operations/resource/identity.ts:9`, `make-docs v2.0.6: packages/cli/src/operations/resource/provider.ts:243` |
| Other URI families | `make-docs://store/migration/backup/<id>` in migration records, and `ui://make-docs/` for the MCP app resource | `make-docs v2.0.6: packages/cli/src/migration.ts:619`, `make-docs v2.0.6: packages/cli/src/mcp/resource-profiles.ts:11` |
| Project folder | `.make-docs`, with `.make-docs/system/{contracts,prompts,references,templates}`, the local resource root `.make-docs/system/` and the catalog `.make-docs/system-resources.catalog.json` | `make-docs v2.0.6: packages/cli/src/tool-directory.ts:7`, `make-docs v2.0.6: packages/cli/src/operations/resource/resolver.ts:1117`, `make-docs v2.0.6: packages/cli/src/operations/resource/provider.ts:52` |
| Router places | The root, `docs/`, `.make-docs/`, `.make-docs/system/` and its four folders, and `docs/{designs,plans,prd,work}` | `make-docs v2.0.6: packages/cli/src/router-paths.ts:17` |
| Machine folder and its setting | `<user data root>/.make-docs`. `MAKE_DOCS_HOME` sets another folder. One `setup remove` guard uses a fixed `<home>/.make-docs` path. | `make-docs v2.0.6: packages/cli/src/store/paths.ts:12`, `make-docs v2.0.6: packages/cli/src/store/paths.ts:36`, `make-docs v2.0.6: packages/cli/src/uninstall.ts:161` |
| MCP server name in agent-tool config | `mcpServers.make-docs` for Claude Code, Copilot and generic JSON clients, and `mcp_servers.make_docs` for Codex TOML | `make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:50`, `make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:74`, `make-docs v2.0.6: packages/cli/src/generic-mcp-setup.ts:110` |
| MCP protocol server name | `@brucewaynedecoy/make-docs`, the npm package name | `make-docs v2.0.6: packages/cli/src/mcp/server.ts:35` |
| Connection environment names | `MAKE_DOCS_MCP_CONNECTION_ID`, `MAKE_DOCS_MCP_CONNECTION_KEY`, `MAKE_DOCS_HARNESS_CALLER_IDENTITY`, and the flags `--make-docs-harness-caller` and `--make-docs-harness-caller-ref` | `make-docs v2.0.6: packages/cli/src/mcp-connection.ts:4`, `make-docs v2.0.6: packages/cli/src/harness-access/contract.ts:39`, `make-docs v2.0.6: packages/cli/src/mcp/tools.ts:448` |
| Managed-block tag | `<!-- make-docs:begin -->` and `<!-- make-docs:end -->`, the Codex TOML markers `# make-docs:begin harness-access codex mcp` and `# make-docs:end harness-access codex mcp`, and the wording "make-docs managed block" | `make-docs v2.0.6: packages/cli/src/managed-block.ts:1`, `make-docs v2.0.6: packages/cli/src/harness-access/native.ts:102`, `make-docs v2.0.6: packages/cli/src/planner.ts:1651` |
| Agent-tool names | The adapter IDs `make-docs.codex`, `make-docs.claude-code` and `make-docs.github-copilot`, the rules file `.codex/rules/make-docs.rules` and `permissions.allow.make-docs` | `make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:41`, `make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:55`, `make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:81` |
| Install-source markers | The `make-docs` path substring, the `/Cellar/make-docs/` marker, and `brew uninstall make-docs` and `brew upgrade make-docs` | `make-docs v2.0.6: packages/cli/src/self/install-manager.ts:194`, `make-docs v2.0.6: packages/cli/src/self/install-manager.ts:114` |
| Error text | "Unknown make-docs MCP profile" and "Unknown make-docs MCP tool" | `make-docs v2.0.6: packages/cli/src/operations/mcp-metadata.ts:20`, `make-docs v2.0.6: packages/cli/src/mcp/tools.ts:397` |

Requirements:

- Every core part takes the calling kit's names from the table above as input.
- The core's `src/` files and its published `dist/` files hold no `make-docs`, `make_docs` or `MAKE_DOCS` string. A core test searches them and finds none.
- Make Docs 2.2.0 passes the values in the table to the core. Its CLI name, npm name, folders, environment names, agent-tool entry names and block markers stay the same as in 2.0.6, so a live Make Docs project and its agent-tool config keep working.
- Two kits on one machine get separate MCP entries, separate connection environment names and separate block tags, because each kit passes its own names.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 4 and 7)
- `kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md` (Shared Core: every core part takes the calling tool's identity)
- `make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:41`
- `make-docs v2.0.6: packages/cli/src/mcp-connection.ts:4`

### Store Base and Schema Version 6

Make Docs sets `CURRENT_STORE_SCHEMA_VERSION = 6` (`make-docs v2.0.6: packages/cli/src/store/database.ts:43`). `STORE_MIGRATIONS` is one ordered list under one `PRAGMA user_version` (`make-docs v2.0.6: packages/cli/src/store/database.ts:86`). Make Docs refuses a Store whose `user_version` is above 6 with `StoreSchemaNewerError`, and it never reads that Store (`make-docs v2.0.6: packages/cli/src/store/database.ts:575`). So a core change that raises `user_version` above 6 locks every Make Docs 2.0.x user out of their Store. No path to version 7 exists yet ([R-010 Store Schema Locked at Version 6](03-open-questions-and-risk-register.md#r-010-store-schema-locked-at-version-6)).

The Make Docs code does not split base tables from product tables. This document sets the split. The core owns the base tables. Each kit owns its product tables. How the core splits the base and kit migrations under the one counter is open ([Q-031 Store Version Counter for Base and Kit Tables](03-open-questions-and-risk-register.md#q-031-store-version-counter-for-base-and-kit-tables)). It must close before the Store slice.

| Owner | Tables at schema version 6 |
| --- | --- |
| Core Store base | `installation_checkouts`, `installation_ledgers`, `installation_operations`, `installation_steps`, `installation_locks`, `installation_migration_records`, `installation_transfers`, `tool_operations`, `store_schema_journal`, `store_migration_receipts`, `projects` |
| Make Docs product | `runs`, `run_evidence`, `work_evidence`, `backlog_review_cache`, `store_checkpoint_journal`, and the legacy `playbook_runs` |

Two base tables still carry Make Docs shapes. `installation_ledgers.manifest_json` holds the Make Docs manifest shape (`make-docs v2.0.6: packages/cli/src/store/database.ts:196`). `PROJECT_STATE_TABLE_ROLES` names Make Docs product tables (`make-docs v2.0.6: packages/cli/src/store/project-state.ts:45`).

Requirements:

- The Make Docs Store keeps `user_version` 6 in every Step 0 release ([Q-016 Core Extraction Order](03-open-questions-and-risk-register.md#q-016-core-extraction-order)).
- The base tables and the Make Docs product tables keep their schema version 6 shapes.
- After a person runs Make Docs 2.2.0 on a machine, Make Docs 2.0.6 opens the same Store with no `StoreSchemaNewerError` and reads its records.
- Make Docs 2.2.0 opens a Store that Make Docs 2.0.6 wrote, with no migration step.
- Each kit keeps its own Store in its own machine folder. No kit opens another kit's Store.
- The core Store base keeps the project identity rule of Make Docs: `projectId` in the project config first, then the Store ledger (`make-docs v2.0.6: packages/cli/src/store/project-identity.ts:28`).

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, section 4: the Store keeps schema version 6)
- `make-docs v2.0.6: packages/cli/src/store/database.ts:43`
- `make-docs v2.0.6: packages/cli/src/store/database.ts:86`
- `make-docs v2.0.6: packages/cli/src/store/database.ts:575`
- `make-docs v2.0.6: packages/cli/src/store/database.ts:1128`
- `make-docs v2.0.6: docs/prd/38-global-store-and-project-state.md` (The SQLite Database)

### Core Versions and the Exact Pin

Requirements:

- Core `0.1.0` is the first core release. It holds all eight areas ([Q-016 Core Extraction Order](03-open-questions-and-risk-register.md#q-016-core-extraction-order)).
- The code for the shared `.make/` files ships in a later core release, in the setup tool wave ([Q-001 Step 0 Backlog Scope](03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope)).
- Each kit release on the core depends on one exact core version, not a version range. `npm view @brucewaynedecoy/make-docs@2.2.0 dependencies` shows `0.1.0` for `@brucewaynedecoy/make-core`.
- A release build resolves the core only from the published package at the pinned version. The release build fails when the core resolves to a workspace link or to an unpublished version.
- Development builds can resolve the core through the npm workspace link to `packages/core/`.
- A core change ships in a core release before a kit release uses it.
- Make Docs 2.0.7 and 2.1.0 do not depend on the core. Make Docs 2.2.0 is the first kit release on the core ([Q-007 Make Docs Changes in Step 0](03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)).
- Make Docs 2.2.0 has tag-aware managed blocks. The block code takes each kit's tag as input and reads and writes only the markers with that tag, so two kits can each keep one block in the same instruction file. Make Docs keeps the markers `<!-- make-docs:begin -->` and `<!-- make-docs:end -->`. At `v2.0.6` the markers are fixed strings (`make-docs v2.0.6: packages/cli/src/managed-block.ts:1`), and no caller passes other markers. The library already takes a `markers` option (`make-docs v2.0.6: packages/cli/src/managed-block.ts:22`). [05 Kit Conventions](05-kit-conventions.md) owns the marker format.
- Make Docs 2.2.0 has the uninstall fix. When an instruction file holds the Make Docs block and user text, `setup remove` strips only the Make Docs block and keeps the user text. It deletes the file only when nothing is left. At `v2.0.6`, `setup remove` keeps the whole file, Make Docs block included, when the file has user text (`make-docs v2.0.6: packages/cli/src/audit.ts:330`).
- The uninstall fix also covers two more gaps ([Q-035 Scope of the Uninstall Fix in 2.2.0](03-open-questions-and-risk-register.md#q-035-scope-of-the-uninstall-fix-in-220)). The `uninstall` help, its options list and its message state that the Store stays unless `--remove-store` is set ([D-002](03-open-questions-and-risk-register.md#d-002-uninstall-text-disagrees-with-store-removal)). The `setup remove` guard protects the resolved Store root, also when `MAKE_DOCS_HOME` names another folder ([D-039](03-open-questions-and-risk-register.md#d-039-setup-remove-guard-uses-a-fixed-store-path)).

Two root register risks apply to these rules. [R-001 Core Release Friction](03-open-questions-and-risk-register.md#r-001-core-release-friction) covers the release step between a core change and a kit release. [R-002 Two Core Versions in One Project](03-open-questions-and-risk-register.md#r-002-two-core-versions-in-one-project) covers kits that pin different core versions in one project. The register holds their full text.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 4 and 11)
- `kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md` (Core Dependency Line)
- `make-docs v2.0.6: packages/cli/src/managed-block.ts:22`
- `make-docs v2.0.6: packages/cli/src/audit.ts:330`

## Integrations

| Party | What it uses from the core | From |
| --- | --- | --- |
| Make Docs, `kits/make-docs/packages/cli/` | All eight areas, through an exact pin | Make Docs 2.2.0 on core `0.1.0` |
| Make Blueprint, `kits/make-blueprint/packages/` | All eight areas and the shared `.make/` files, through an exact pin | Make Blueprint v2.0 |
| Setup tool, `packages/kit/` | Tool discovery, each kit's setup call, and the shared `.make/` files | The setup tool wave |
| Agent tools: Claude Code, Codex and GitHub Copilot CLI | MCP entries, rules and user Skills that the core writes for each kit | Make Docs 2.2.0 |
| npm | `@brucewaynedecoy/make-core`, published from the shared publish workflow with the tag `make-core-v<version>` | Core `0.1.0` |

The Make Docs PRDs at `v2.0.6` state the current rules that the core takes over. They keep their text, because they describe live code:

- `make-docs v2.0.6: docs/prd/39-cli-command-model-and-operation-registry.md` (The Operation Registry and Shared Core)
- `make-docs v2.0.6: docs/prd/25-typescript-runtime-cli-mcp-operation-boundaries.md` (MCP Profile Exposure)
- `make-docs v2.0.6: docs/prd/15-agent-instruction-ownership-and-managed-blocks.md` (Managed-Block Conflict Resolution)
- `make-docs v2.0.6: docs/prd/38-global-store-and-project-state.md` (Store Location and Contents)
- `make-docs v2.0.6: docs/prd/28-shared-agentics-installation-and-harness-exposure.md` (Harness Connection Methods)

Related owners: [05 Kit Conventions](05-kit-conventions.md) for the rules that the core puts into effect, [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) for the shared files, and [08 Build and Release](08-build-and-release.md) for the core release.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 4, 5 and 12)
- `make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:109`

## Rebuild Notes

- **Do not raise the Store schema version.** A `user_version` above 6 locks Make Docs 2.0.x out of the Store (`make-docs v2.0.6: packages/cli/src/store/database.ts:575`). A base-table change that needs a new version is outside Step 0.
- **The registry needs a plug-in point first.** Do not pull the registry out with the Make Docs operation imports inside it (`make-docs v2.0.6: packages/cli/src/operations/registry.ts:321`).
- **Kit names hide in text.** The kit name appears in URI families, error text, block wording, install-source markers and a fixed home path, not only in constants. Use the table in [Kit Names as Inputs](#kit-names-as-inputs) as the search list.
- **The project folder and the machine folder share a name in Make Docs.** Both are `.make-docs`, and a marker check tells them apart (`make-docs v2.0.6: packages/cli/src/store/lifecycle.ts:131`). Keep that check in the core.
- **Agent-tool entries run profile `all` at `v2.0.6`.** Make Docs writes no `--profile` into the entry (`make-docs v2.0.6: packages/cli/src/harness-access/native.ts:619`). The target rule in [05 Kit Conventions](05-kit-conventions.md#mcp-server) is that each entry runs `mcp --profile <name>`, and the gap is [D-027](03-open-questions-and-risk-register.md#d-027-agent-tool-entries-always-run-profile-all). The core agent-tool setup takes the profile name as an input, so that each kit can meet that rule.
- **The library repairs a malformed block, and setup refuses it.** The block library reasserts a malformed block (`make-docs v2.0.6: packages/cli/src/managed-block.ts:136`). The setup planner skips the file and asks for a repair (`make-docs v2.0.6: packages/cli/src/planner.ts:367`). Keep the setup behavior when the merge code goes into the core.
- **Do not make `update` sync a project.** In Make Docs, `update` updates the installed tool through its install manager, and `setup` syncs a project (`make-docs v2.0.6: packages/cli/src/self/update-tool.ts:178`).
- **On-disk contracts cross core versions.** Two kits in one project can pin different core versions. A change to the block tag format or to the shared `.make/` files is a breaking core change for both kits ([R-002 Two Core Versions in One Project](03-open-questions-and-risk-register.md#r-002-two-core-versions-in-one-project)).

Code anchors:

- `make-docs v2.0.6: packages/cli/src/store/database.ts:575`
- `make-docs v2.0.6: packages/cli/src/operations/registry.ts:321`
- `make-docs v2.0.6: packages/cli/src/store/lifecycle.ts:131`
- `make-docs v2.0.6: packages/cli/src/managed-block.ts:136`

## Source Anchors

- [Make Kit Monorepo](../designs/2026-10-30-make-kit-monorepo.md) design, sections 4, 6 and 11
- [Make Kit Monorepo Baseline Plan](../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md) and its [Phase 3](../plans/2026-11-01-w1-r0-make-kit-monorepo/03-core-setup-and-release.md)
- [Make Blueprint 05 Ecosystem and Shared Core](../../kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md)
- [Q-016 Core Extraction Order](03-open-questions-and-risk-register.md#q-016-core-extraction-order), [Q-007 Make Docs Changes in Step 0](03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)
- `make-docs v2.0.6: packages/cli/src/store/database.ts`
- `make-docs v2.0.6: packages/cli/src/operations/registry.ts`
- `make-docs v2.0.6: packages/cli/src/managed-block.ts`
- `make-docs v2.0.6: packages/cli/src/harness-access/registry.ts`
- `make-docs v2.0.6: packages/cli/src/self/install-manager.ts`
