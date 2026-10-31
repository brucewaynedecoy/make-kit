---
title: "07 Installation and Distribution"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 07 Installation and Distribution

## Purpose

This document owns how a person gets Make Blueprint onto a machine and into a project, keeps it current, and takes it out again. It covers `setup`, agent-tool setup for Claude Code, Codex and GitHub Copilot CLI, skills install, `update`, uninstall, and the two ways Make Blueprint ships: an npm package and signed single-file downloads for macOS, Windows and Linux that need no Node install.

It serves Northstar principle 6 (one install). Make Blueprint needs one approved install, skills ship no Python and no scripts, and the product works offline with no telemetry.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 1, principle 6; section 6: runtime, shared core and distribution)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/09-v1-import-and-release.md`

## Scope

This document covers:

- `setup`: project init, agent-tool selection, MCP config and skills install, and, when it runs again in an installed project, the project update, including the record schema upgrade.
- `update`: tool update only.
- Uninstall: project uninstall and tool uninstall.
- The install matrix for Make Blueprint alone, Make Docs alone and both, shared with [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- Distribution on npm and as signed single files.
- Offline behavior, no telemetry and no Python.
- The start-time performance candidate.

Covered elsewhere:

- The separate-or-together outcomes and the handoff line: [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- Which folders and routers `setup` creates, and the managed-block rules that `setup` and project uninstall follow: [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md).
- Command names, flags, output formats and MCP profiles: [08 CLI and MCP](08-cli-and-mcp.md).
- Record schema versions and the rules for upgrading records: [09 Storage and Indexing](09-storage-and-indexing.md).
- The content of the nine skills (the seven stage skills, `blueprint-report` and `blueprint-convert`): [16 Workflow and Skills](16-workflow-and-skills.md).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, sections 5, 6 and 7)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Human Experience Propagation, Performance Evidence Plan, Acceptance Criteria Guidance)

## Component and Capability Map

| Component | What it does | Release | Built on |
| --- | --- | --- | --- |
| Project setup | Makes a project ready for Make Blueprint, and syncs an installed project to the installed version, including record schema upgrades and new folders | v2.0 | Core layout, managed blocks, agent-tool setup and shared project files, plus Make Blueprint's record upgrade |
| Agent-tool setup | Writes MCP config and installs skills for Claude Code, Codex and GitHub Copilot CLI | v2.0 | Core agent-tool setup |
| Update | Updates the installed tool only, and changes no project | v2.0 | Core update |
| Uninstall | Removes Make Blueprint from a project, or the tool from the machine | v2.0 | Core uninstall |
| npm package | Installs Make Blueprint where Node 24 is available | v2.0 | npm |
| Signed single files | Install Make Blueprint as one approved file with no Node and no Python | v2.0 | Node 24 runtime bundled into one file |

All three commands use `packages/core`. Make Blueprint passes its own CLI name, tags, folders, router text and skills. See [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).

### Setup

`setup` makes the current project ready for Make Blueprint. Run again in an installed project, it syncs that project to the installed version: this rerun is the project update (see [Project Update](#project-update)).

A `setup` run works in this order:

1. Check every instruction file it will touch for malformed tags of both tools, Make Blueprint's and Make Docs'. Stop and change nothing if any are malformed (see [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md)).
2. Find the agent tools on the machine. This is a hint only. It does not limit the person's choice.
3. Take the person's choice of agent tools: Claude Code, Codex, GitHub Copilot CLI, or more than one. Choices already in the shared `.make/config.yaml`, made by an earlier setup of any kit, are preselected.
4. Find Make Docs through core tool discovery (see [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md)).
5. Show the plan: every file and folder it will create or change, and every conflict.
6. Apply the plan: folders, `.make/blueprint/config.yaml` with a new project ID, the shared choices in `.make/config.yaml` through the core, routers and blocks with the handoff line when Make Docs is present, skills, MCP config, and, in an installed project, record schema upgrades.
7. Ask Make Docs, when present, to refresh its own root block.
8. Report the result and the next useful action.

Requirements:

- On a fresh project, `setup` creates the folders, config file and routers that [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) lists for v2.0, installs the nine skills (the seven stage skills, `blueprint-report` and `blueprint-convert`) for each selected agent tool, and writes one MCP config entry for each selected agent tool.
- `setup` preselects the choices in `.make/config.yaml`. A choice the person changes is written back there, through the core, for every kit.
- The `make-kit setup` tool, which ships with Make Blueprint v2.0, can run Make Blueprint's `setup` through the core with the agent tools the person chose there. The result is the same as Make Blueprint's own `setup` with those choices.
- `setup` offers Claude Code, Codex and GitHub Copilot CLI, and accepts any combination of them.
- `setup` has a preview that shows the full plan and writes nothing.
- `setup` can run without a terminal when given explicit approval, so an agent can run it. A run without a terminal never guesses a choice it was not given.
- Running `setup` twice with no change in between changes no file on the second run.
- `setup` makes no network request.

#### Agent-Tool MCP Config

Requirements:

- For each selected agent tool, `setup` writes one MCP server entry that starts `make-blueprint mcp`. The entry is named after the CLI: `make-blueprint`, or `make_blueprint` where the agent tool's format needs it.
- The entry's command is the absolute path of the installed `make-blueprint` executable: the npm-installed binary, or the signed single file.
- The entry carries a connection ID and key in its environment, as Make Docs does. The Store keeps only a hash of the key, and no output prints the key.
- `setup` changes only its own entry in the agent tool's config file and keeps every other entry and setting in that file.
- `setup` writes the entry at the scope the person chooses, machine or project, where the agent tool supports that scope.
- The entry uses the `all` MCP profile unless the person chooses another. [08 CLI and MCP](08-cli-and-mcp.md) owns the profiles.
- For an MCP client that Make Blueprint does not configure itself, Make Blueprint can print a config entry for the person to add by hand.

#### Skills Install

Requirements:

- The nine skills (the seven stage skills, `blueprint-report` and `blueprint-convert`) ship inside the npm package and inside each signed single file. `setup` installs them from there with no network request.
- `setup` installs the skills into the skill folders of the selected agent tools, at project scope or machine scope. One folder holds the files, and the other selected tools' folders link to it. Where links are not allowed, `setup` writes managed copies instead.
- `setup` never overwrites a skill folder that it did not install. When a person changed an installed skill, `setup` treats it as a conflict and offers to replace it or keep it.
- No Make Blueprint skill folder has the same name as a Make Docs skill folder, so both tools' skills can share `.agents/skills/`.
- No installed skill contains a script file. [16 Workflow and Skills](16-workflow-and-skills.md) owns skill content.

#### Setup Output

The first-run setup output is a human-facing result under the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md). It gets a Human Experience Review in work phase `02-cli-and-packaging.md`.

Requirements:

- The output names each file and folder group it created or changed, each file it left alone because of a conflict, and the command that resolves each conflict.
- The output names the agent tools it configured, the skills it installed and the MCP entries it wrote.
- The output says whether Make Docs is present. When it is, the output says whether both root blocks carry their handoff lines. When the Make Docs block has no handoff line, the output tells the person to update Make Docs with its own update command and then run `make-blueprint setup` again, as [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md#handoff-line) defines.
- A person can tell from the output alone whether setup completed, completed with kept conflicts, or stopped with nothing changed.
- The output ends with the next useful action, such as restarting the agent tool so it loads the MCP server, then starting the intake stage.
- Normal output shows no block hashes, Store internals, connection keys or permanent record IDs.
- The machine-readable result carries the same meaning as the human output.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 6: same agent tools as Make Docs; skills ship inside the CLI package; section 16: Q-005, Q-042, Q-060 and Q-080)
- [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design (Decision, sections 5 and 6)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md` (Scope)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/harness-access/registry.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/harness-access/native.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/skill-paths.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/install.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp-connection.ts`

### Update

`update` updates only the installed tool. Tool update replaces the installed Make Blueprint with a newer version and changes no project. Project update brings one project's Make Blueprint files and records to the installed version, and it runs when `setup` runs again in that project, as in Make Docs.

#### Tool Update

Requirements:

- `update` finds how Make Blueprint was installed. For a package manager install, it runs that manager's update command and reports the result. For a package runner, it says that nothing is installed to update. When the install source is a signed single file, or cannot be told, it changes nothing in the install and names the exact steps to update.
- `update` never guesses which package manager owns the install.
- `update` upgrades the machine Store's own schema when needed and keeps all existing Store data.
- `update` changes no project file: no block, router, skill, MCP entry, record or folder.
- After `update` installs a newer version, its output names `make-blueprint setup` as the command that brings each project to that version.

#### Project Update

Requirements:

- `setup` run again in an installed project brings that project to the installed version: Make Blueprint's blocks and routers (following [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md), conflicts included), the handoff line (following [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md)), and the skills and MCP entries installed for this project.
- The project update runs with the installed version. When records are older than that version, `project status` names `make-blueprint setup` as the next action (see [08 CLI and MCP](08-cli-and-mcp.md)).
- `setup` upgrades each record whose schema version is older than the installed version, following the rules in [09 Storage and Indexing](09-storage-and-indexing.md). Each upgraded record shows in git as a change to its own file.
- The output reports how many records were upgraded for each record type, and names any record it could not upgrade and why.
- Running `setup` twice with no change in between changes no file on the second run.
- `setup` of a v2.2 release in a v2.0 project creates the v2.2 folders and routers (`blueprint/runs/` and `blueprint/playbooks/`).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 5: the handoff line; section 8: record upgrades; section 16: Q-009, where `update` updates only the tool and `setup` updates the project)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/self/update-tool.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/self/install-manager.ts`

### Uninstall

Uninstall has two scopes. Project uninstall removes Make Blueprint from one project. Tool uninstall removes the CLI from the machine. Make Docs runs project uninstall as `make-docs setup remove` and tool uninstall as `make-docs uninstall`. [08 CLI and MCP](08-cli-and-mcp.md) owns Make Blueprint's command names.

#### Project Uninstall

Requirements:

- Project uninstall removes Make Blueprint's block from each instruction file it manages, following [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md), and deletes a file only when nothing is left in it.
- It removes the MCP entries and the skills that Make Blueprint installed for this project. It keeps any skill folder a person changed and reports it.
- It removes local system doc copies that Make Blueprint wrote and that no one changed.
- It removes a folder that Make Blueprint created only when the folder is empty.
- It keeps all project knowledge: everything in `blueprint/sources/`, `blueprint/records/` and `blueprint/exports/`, the config file in `.make/blueprint/`, and conflict copies.
- It keeps the shared `.make/config.yaml` and `.make/personas.yaml`, because other kits use them (see [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md)).
- It removes the Store's installation records for what it removed.
- When Make Docs is present, it asks Make Docs to refresh its own root block, so the handoff line goes away (see [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md)).
- Its output lists what it removed, what it kept, and why each kept item was kept.

#### Tool Uninstall

Requirements:

- Tool uninstall removes the installed CLI through the package manager that installed it. For a signed single file, or an install source it cannot tell, it changes nothing and names the file to delete.
- Tool uninstall keeps `~/.make/blueprint/` unless the person separately chooses to remove it. Approval of the uninstall alone never removes the Store.
- Tool uninstall changes no project folder.
- Tool uninstall reports each machine-scope MCP entry and skill folder that still refers to Make Blueprint, and how to remove it.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 5: on uninstall, a tool removes only its own block)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/uninstall.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/self/uninstall-tool.ts`

### Install Alone or Together

This document shares the plan promise "install Make Blueprint alone, Make Docs alone, or both; handoff works with no extra setup" with [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md). 05 owns the outcome. This document owns the commands that produce it and the install matrix that proves it.

| Case | Expected result |
| --- | --- |
| Make Blueprint alone on a fresh project | `setup` succeeds. The root block has no handoff line. Make Blueprint has written no file under `docs/`. |
| Make Docs alone on a fresh project | Make Docs behaves as Make Docs defines. Nothing of Make Blueprint's is present. |
| Make Docs, then Make Blueprint | Both root blocks carry their handoff lines after Make Blueprint's `setup`. |
| Make Blueprint, then Make Docs | Both root blocks carry their handoff lines after Make Docs' setup. |
| Both, then Make Blueprint project uninstall | Make Blueprint's blocks are gone. The Make Docs block has no handoff line. User text and the rest of the Make Docs block are unchanged. |
| Both, then Make Docs project uninstall | The Make Docs blocks are gone. Make Blueprint's block has no handoff line. User text and the rest of Make Blueprint's block are unchanged. |

Requirements:

- Each case passes with user text above, between and below the blocks.
- Each case passes with Make Docs in its earlier layout (`.make-docs/`) and, once Make Docs ships it, in its later layout (`.make/docs/`).
- No case needs a step beyond the tools' own `setup` and uninstall commands.

Evidence: Automated Implementation Testing of the install matrix on fresh projects, in work phases `01-shared-core-adoption.md` and `02-cli-and-packaging.md`, and a Human Experience Review of first-run setup output.

Code anchors:

- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Human Experience Propagation)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md` (Human Experience and Evidence)

### Distribution

Make Blueprint ships in two forms from the same source and version: an npm package, like Make Docs, and signed single-file downloads for macOS, Windows and Linux.

#### npm Package

Requirements:

- Make Blueprint is published on npm as `@brucewaynedecoy/make-blueprint`, with the binary `make-blueprint`.
- The package depends on the shared core, published as `@brucewaynedecoy/make-core`, at one exact pinned version (see [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md)).
- The npm package needs Node 24 or later, for the built-in `node:sqlite` module.
- The package contains the CLI, the MCP server, the pinned core version, the nine skills, all system docs and the built-in converters.

#### Signed Single Files

On a machine that allows no Python, a person installs one signed file, and every skill works. This document owns that plan promise. The same Human Experience Contract is the standard behind it.

Requirements:

- Each release ships one signed single file for each target: macOS on Apple silicon (arm64) and on Intel (x64), Windows on x64, and Linux on x64 and on arm64. Windows on arm64 comes in a later release.
- Work phase 02 builds, signs and tests a file for each target in a clean container before other work depends on it.
- Each file contains the Node 24 runtime, the CLI, the MCP server, the pinned core version, the nine skills, all system docs and the built-in converters.
- With only the signed file installed, every command, the MCP server and every skill work on a machine that has no Python and no Node.
- No command, skill or converter starts Python, Node, a shell script or any other interpreter.
- A person can verify the file's signature with the platform's standard tools before running it.
- On macOS and Windows, the file opens under the platform's default security settings with no override, and an administrator can allow it by its publisher signature.
- When `setup` runs from the signed file, the MCP entries it writes start that same file.
- The signed file and the npm package of the same version give the same results for the same commands.
- Outside the project folder, the signed file writes only to `~/.make/blueprint/`, to the agent-tool files that the person approved in `setup`, and to the operating system's temporary folder for short-lived work files that are not programs.

Evidence: install and `setup` in a clean container with no Python and no Node (work phase `02-cli-and-packaging.md`), then a run of all seven workflow stages in that container on the release build (work phase `09-v1-import-and-release.md`).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Human Experience Intent; Decision, section 6; section 16: Q-006, Q-012, Q-042 and Q-080; Consequences: single-file packaging)
- [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design (Decision, section 7: package names)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md` (Scope: signed single-file downloads)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/09-v1-import-and-release.md` (Scope: end-to-end run with no Python and no Node)

### Offline, No Telemetry and No Python

Requirements:

- After install, every command works with no network connection.
- Make Blueprint itself makes no network request in any command. The only network use is by a package manager that `update` or tool uninstall runs on the person's behalf.
- Make Blueprint sends no telemetry: no usage data, no crash reports and no automatic update checks.
- Skills install from inside the package or file. Make Blueprint has no remote skill source.
- No part of Make Blueprint needs Python, in any install form.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 1, principle 6; section 2: no telemetry)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Acceptance Criteria Guidance)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/skill-resolver.ts`

### Start-Time Performance

Start time of the compiled single-file CLI and MCP server is a performance evidence candidate under the [Performance Evidence Governance Contract](make-docs://system/contract/performance-evidence-governance.md).

| Field | Value |
| --- | --- |
| Candidate | Start time of the compiled single-file CLI and MCP server |
| Performance applicability | `characterize-now` |
| Target class | `characterization-baseline` |
| Protected outcome | Agents can call the CLI many times in one task without slowing the work |
| Decision informed | Whether the TypeScript single-file build is acceptable, given that BuildOS v1 chose Go after a runtime benchmark |
| Canonical owner | One `PERF-###` profile that work phase `02-cli-and-packaging.md` creates before its first measurement, after the first signed single-file build |
| Re-run | On the v2.0 release build, in work phase `09-v1-import-and-release.md` |

This document sets no start-time target or threshold. A characterization baseline is an observed result, not a pass or fail gate. A product target needs an owner-approved requirement in this document first.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Performance Evidence Candidates; Alternatives Considered: Go)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Performance Evidence Plan)

## Contracts and Data

### Install Sources

| Install source | How `update` updates the tool | How tool uninstall removes it |
| --- | --- | --- |
| npm package through a package manager (npm, pnpm or bun) | Runs that manager's update command | Runs that manager's remove command |
| Package runner (npx or dlx) | Nothing to update; the runner fetches the version it is asked for | Nothing installed to remove |
| Signed single file | Changes nothing; names the steps to install a newer signed file | Changes nothing; names the file to delete |
| Cannot be told | Changes nothing; names the candidate commands | Changes nothing; names the candidate commands |

The core's install-source detection comes from Make Docs, which also recognizes Homebrew.

### Agent-Tool Files

The core's agent-tool setup knows where each agent tool keeps its files. These are the current values from Make Docs. The core owns the exact list.

| Agent tool | Instruction file | Project skill folder | Machine skill folder | Project MCP config | Machine MCP config |
| --- | --- | --- | --- | --- | --- |
| Claude Code | `CLAUDE.md` | `.claude/skills/` | `~/.claude/skills/` | `.mcp.json` | `~/.claude.json` |
| Codex | `AGENTS.md` | `.agents/skills/` | `~/.codex/skills/` | `.codex/config.toml` | `~/.codex/config.toml` |
| GitHub Copilot CLI | `AGENTS.md` | `.agents/skills/` | `~/.agents/skills/` | `.copilot/mcp-config.json` | `~/.copilot/mcp-config.json` |

### MCP Config Entry

A Claude Code entry has this shape. Codex uses the same content in TOML under `mcp_servers.make_blueprint`.

```json
{
  "mcpServers": {
    "make-blueprint": {
      "command": "<absolute path to make-blueprint>",
      "args": ["mcp"],
      "env": {
        "<connection ID variable>": "<connection ID>",
        "<connection key variable>": "<connection key>"
      }
    }
  }
}
```

### Config and Store

`setup` records the selected agent tools and skill choices in the shared `.make/config.yaml`, through the core, so every kit set up later sees them (see [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md)). Make Blueprint's own settings stay in `.make/blueprint/config.yaml`. `setup` records what it installed, with hashes, and the hash of each connection key in the Store in `~/.make/blueprint/`.

Code anchors:

- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/self/install-manager.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/harness-access/registry.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/skill-paths.ts`
- `.make/config.yaml`
- `.make/blueprint/config.yaml`
- `~/.make/blueprint/`

## Integrations

- `packages/core` provides agent-tool setup, update, uninstall, layout and managed blocks. See [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- Make Docs: `setup` and project uninstall find it through core tool discovery and ask it to refresh its root block. See [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- Agent tools: Claude Code, Codex and GitHub Copilot CLI own their config files and skill folders. Make Blueprint changes only its own entries and skill folders in them.
- Package managers: npm, pnpm and bun install and update the npm package. `update` and tool uninstall run them only on the person's behalf.
- Platform signing: macOS and Windows code signing needs certificates. Linux signing uses a method chosen in packaging work.
- [08 CLI and MCP](08-cli-and-mcp.md) owns the command names and flags for `setup`, `update` and uninstall, and the MCP profiles.
- [09 Storage and Indexing](09-storage-and-indexing.md) owns the record schema rules that `setup` applies.
- [16 Workflow and Skills](16-workflow-and-skills.md) owns the skills that `setup` installs.

Code anchors:

- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Dependencies: code signing needs certificates)
- `docs/prd/02-architecture-overview.md` (Runtime Boundaries)

## Rebuild Notes

- **Prove the single file early.** Shipping a Node 24 app that uses `node:sqlite` as one signed file for three operating systems is the main packaging risk. v1 chose Go partly for this reason. Build it, sign it and run it in a clean container before other v2.0 work depends on it.
- **Do not unpack helper programs at run time.** Some packagers write executables to a temporary folder and run them. Locked-down machines often block that. Prefer a method that runs from the one signed file.
- **Use an absolute path in MCP config.** Agent tools start the MCP server without the person's shell setup, so a bare command name may not resolve.
- **A running file cannot always replace itself.** On Windows, a running executable cannot overwrite its own file. That is one reason `update` names the steps for a signed single file instead of acting.
- **Symbolic links fail on some machines.** Windows often blocks them without extra rights. Keep the copy fallback for skills.
- **`update` is the tool update in both tools.** In Make Docs and in Make Blueprint, `update` updates the installed tool, and project sync is `setup`. Keep `update` out of every project, and have its output name `setup` as the next step, so a person knows which command changes what.
- **Make Docs takes a project install out with `setup remove`.** Do not confuse project uninstall with tool uninstall. Tool uninstall never touches a project.
- **Never print the connection key.** It sits in the agent tool's config. Output and logs must not repeat it.
- **No install script that downloads.** An npm install script that fetches files breaks offline installs and locked-down approval.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Consequences: single-file packaging)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/self/update-tool.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/install.ts`

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/09-v1-import-and-release.md`
- `docs/prd/01-product-overview.md`
- `docs/prd/02-architecture-overview.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/harness-access/registry.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/self/install-manager.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/self/update-tool.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/self/uninstall-tool.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/skill-paths.ts`
