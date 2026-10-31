---
title: "05 Ecosystem and Shared Core"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 05 Ecosystem and Shared Core

## Purpose

Make Blueprint and Make Docs are two products from one owner. They follow one ecosystem pattern for folders, instruction files, the machine Store, CLI shape and MCP profiles. This document owns the rules that keep the two products separate but able to work together.

It owns four things. The first is the separate-or-together rule (Northstar principle 1) as testable requirements. The second is the shared TypeScript package `packages/core`: what it holds, what stays in Make Blueprint, and how Make Blueprint depends on it. The third is the handoff line that each tool's root block carries when the other tool is present. The fourth is the link from Make Blueprint records forward to Make Docs work items and doc paths, with the rule that Make Docs owns the backlog.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 1: Northstar principles; section 3: product boundary and names; section 6: runtime, shared core and distribution; section 12: relationship with Make Docs)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md`

## Scope

This document covers:

- The separate-or-together requirements for a project with Make Blueprint alone, Make Docs alone, or both.
- The contents and boundary of `packages/core`, its release line, and how Make Blueprint pins and links it.
- The handoff line: its content, when it appears and disappears, and what a person sees when the other tool is too old to write it.
- How Make Blueprint finds a Make Docs install (tool discovery).
- The two project files that every kit shares, `.make/config.yaml` and `.make/personas.yaml`, which the core reads and writes.
- Make Docs links on records, and how the `project check` command (see [08 CLI and MCP](08-cli-and-mcp.md)) confirms them, or skips them with a count.
- Backlog ownership and the Azure Boards export.
- The Make Docs capabilities that Make Blueprint depends on.

Covered elsewhere:

- Folder layout, routers and the full managed-block rules: [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md).
- The `setup`, `setup remove`, `update` and `uninstall` commands, agent-tool setup and distribution: [07 Installation and Distribution](07-installation-and-distribution.md).
- Command names, MCP profiles and the `resource` surface: [08 CLI and MCP](08-cli-and-mcp.md).
- The placement record and the hand off stage inside the fit-gap flow: [14 Fit-Gap and Placement](14-fit-gap-and-placement.md). The `work_items` and `docs` field reference: [11 Record Types Reference](11-record-types-reference.md).
- The hand off skill: [16 Workflow and Skills](16-workflow-and-skills.md).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, sections 3, 5, 6 and 12)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Human Experience Propagation, Dependencies)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/04-record-types.md` (Make Docs link checks)

## Component and Capability Map

| Component | What it does | Release | Detail owner |
| --- | --- | --- | --- |
| Separate-or-together rule | Lets each tool install, run and leave a project on its own, and makes handoff work when both are present | Step 0 and v2.0 | This document |
| `packages/core` | Shared code both tools build on, kept in `packages/core/` of the make-kit monorepo and published as `@brucewaynedecoy/make-core` | Step 0 | This document |
| Core dependency line | Pins the published core in Make Blueprint, with a workspace link for development only | v2.0 | This document |
| Tool discovery | Finds the other ecosystem tool on the machine and in the project | Step 0 (core) and v2.0 | This document |
| Handoff line | One line in each root block that names what the other tool owns | Step 0 (core) and v2.0 | This document; block mechanics in [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| Make Docs links | Work item IDs and doc paths on records of any type, checked through `make-docs` | v2.0 | This document; fields in [10 Records and Identity](10-records-and-identity.md) and [11 Record Types Reference](11-record-types-reference.md) |
| Backlog boundary | Keeps the backlog, its edits and its exports in Make Docs | v2.0 | This document |

### Separate or Together

Northstar principle 1 says that Make Docs and Make Blueprint install alone or together, that handoff and links work with no extra setup when both are in one project, and that neither tool is bolted onto the other. This section states that principle as observable outcomes. This document owns the outcome of the plan promise "install alone, Make Docs alone, or both; handoff works with no extra setup" jointly with [07 Installation and Distribution](07-installation-and-distribution.md), which owns the install and uninstall commands that produce it. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind the promise.

A tool is present in a project when its managed block is in the project's root `AGENTS.md` or `CLAUDE.md`. This rule works the same in both Make Docs layouts (`.make-docs/` and `.make/docs/`).

Requirements:

- On a fresh project with no Make Docs, Make Blueprint `setup` succeeds, and every v2.0 command works. The root block carries no handoff line and does not tell agents to use Make Docs.
- Make Blueprint writes no file under `docs/`, `.make-docs/` or `.make/docs/`, and never reads or writes the Make Docs Store (`~/.make-docs/` or `~/.make/docs/`).
- A project with Make Docs alone behaves exactly as Make Docs defines. A Make Blueprint install elsewhere on the same machine changes nothing in that project.
- When both tools are present, each tool's root block carries one handoff line that names what the other tool owns. This is true after either install order, with no extra command and no configuration file to edit.
- When either tool leaves a project through its project uninstall, `setup remove`, the remaining tool's root block no longer carries the handoff line, and the remaining tool's block and all user text are otherwise unchanged.
- Tool uninstall, `uninstall`, takes a tool off the machine and never touches a project. [07 Installation and Distribution](07-installation-and-distribution.md) owns both commands.
- If a tool leaves a project without `setup remove` (for example, its folders and block are deleted by hand), the next `setup` of the remaining tool removes the stale handoff line. `update` updates only the installed tool and does not touch the project.
- Neither tool requires the other to be installed, to run a given version, or to share its CLI. Each tool keeps its own CLI, its own project folder, its own Store and its own managed block.
- A tool set up after the other reads the shared `.make/config.yaml`, so the choices already made, such as the selected agent tools, are preselected. A changed choice is written back there for every kit. [07 Installation and Distribution](07-installation-and-distribution.md) owns the setup steps.
- Both tools read people and roles from the one shared `.make/personas.yaml`, so a Make Docs Persona and a Make Blueprint audience role with the same slug are one entry.
- Make Blueprint works beside Make Docs in either Make Docs layout and does not wait for the Make Docs move to `.make/docs/` and `~/.make/docs/`.

Evidence: the install matrix in [07 Installation and Distribution](07-installation-and-distribution.md) runs on fresh projects for Make Blueprint alone, Make Docs alone, both in each order, and then removes one. It checks that handoff lines appear and disappear. A Human Experience Review covers first-run setup output.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Human Experience Intent; Decision, section 1, principle 1; section 5: handoff line; section 16: Q-003, Q-009 and Q-060)
- [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design (Decision, section 6)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md` (Human Experience and Evidence)
- `AGENTS.md`
- `CLAUDE.md`

### Shared Core

`packages/core` is a TypeScript package in `packages/core/` of the make-kit monorepo, published as `@brucewaynedecoy/make-core`. Make Docs and Make Blueprint both build on it. Each tool passes in its own names, such as its CLI name, its managed-block tags and its folder under `.make/` and `~/.make/`, so the core holds behavior and no product content.

| Core part | What it holds | Detail owner |
| --- | --- | --- |
| Layout and paths | Project and machine folder targets `.make/<tool>/` and `~/.make/<tool>/`, the earlier Make Docs folders as a supported layout, and path handling on macOS, Windows and Linux | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| Resources | Reading system docs (contracts, templates, references and prompts) by stable URI, served from inside the CLI, with an optional local copy read first when it is valid | This document; surface in [08 CLI and MCP](08-cli-and-mcp.md); local copy in [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| MCP server and profiles | The stdio MCP server, the profile system that filters which tools a client sees, and the `allowWrite` gate | [08 CLI and MCP](08-cli-and-mcp.md) |
| Store base | Opening, locking and versioning the tool's machine Store database, project identity, installation records such as managed-block hashes, and records of tool operations | This document; records, index, locks and journal in [09 Storage and Indexing](09-storage-and-indexing.md) |
| Agent-tool setup | Skills install and MCP config for Claude Code, Codex and GitHub Copilot CLI | [07 Installation and Distribution](07-installation-and-distribution.md) |
| Managed blocks | Tag-aware blocks in `AGENTS.md` and `CLAUDE.md`, block hashes, conflicts, malformed-tag checks, writing the handoff line into the block, and uninstall that keeps user text | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) for block mechanics; this document for the handoff line's content and when it appears |
| Tool discovery | Finding the other ecosystem tool's CLI on the machine and its block in the project | This document |
| Update and uninstall | Shared tool update and uninstall behavior, and project uninstall of managed files | [07 Installation and Distribution](07-installation-and-distribution.md) |
| Shared project files | Reading and writing `.make/config.yaml` and `.make/personas.yaml` for every kit | This document; file layout in [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| Reserved command names | The top-level `serve` command name, kept beside `mcp` for both tools | This document; the command in [08 CLI and MCP](08-cli-and-mcp.md) |

`.make/config.yaml` holds the choices that every kit in a project needs, such as the selected agent tools, and an optional project display `name`. Settings for one kit stay in that kit's own file, such as `.make/blueprint/config.yaml`.

`.make/personas.yaml` holds the people and roles for every kit. Each entry has a `slug`, a `name`, a primitive, a kind and the kits it is enabled for. The primitive is `user` or `maintainer`, and either can be a person or an agent. The kind is `person`, `team`, `organization` or `agent`. An entry enabled for Make Docs gets guides written for it. Make Docs keeps its own Persona list in this file too, so the entry format also holds what Make Docs needs: a label, a description, the built-in `user` and `maintainer` entries, and its reserved slugs.

These stay in Make Blueprint, in `kits/make-blueprint/`:

- Records, record types, the storage interface, the file backend, the local index, locks and the write journal for records, and schema upgrades of records ([09 Storage and Indexing](09-storage-and-indexing.md), [10 Records and Identity](10-records-and-identity.md), [11 Record Types Reference](11-record-types-reference.md)).
- Intake, conversion, extraction, review, analysis, exports and the v1 import.
- The Make Blueprint tool set for each MCP profile, the profile names `core`, `setup`, `intake`, `extract`, `analyze` and `all`, and the status read model ([08 CLI and MCP](08-cli-and-mcp.md)).
- The content that Make Blueprint passes to the core: router and block text, system docs, the nine skills (the seven stage skills, `blueprint-report` and `blueprint-convert`), and the `make-blueprint://system/<type>/<path>` resource scheme.
- The Make Docs link check (this document).

Requirements:

- `packages/core` depends on no Make Blueprint module and on no Make Docs product module. Records and storage stay in Make Blueprint.
- The core contains no product content of either tool, such as templates, skills or router text. Each tool passes its own.
- Every core part takes the calling tool's identity as input: CLI name, block tags, project folder, machine folder, resource URI scheme and MCP server name. No core part assumes the name `make-docs`.
- Make Blueprint carries no modified copy of core code. A change to core behavior ships in a core release before a Make Blueprint release uses it.
- Make Docs runs on the same core release line, so both tools share one implementation of managed blocks, layout, resources, the MCP server, agent-tool setup, update and uninstall.
- The core reads and writes `.make/config.yaml` and `.make/personas.yaml`. Each kit only reads them and asks the core for any change.
- The core creates `.make/personas.yaml` on its first write to it. The built-in `user` and `maintainer` entries stay implicit defaults, as in Make Docs today, so the core does not write them.
- A slug is unique across the whole of `.make/personas.yaml`, whatever its primitive. The core refuses a write that would give two entries the same slug. The approval or import that asked for the write returns the `blocked` outcome (see [08 CLI and MCP](08-cli-and-mcp.md)) and names the clash.
- The core's write to `.make/personas.yaml` is part of the same journaled change as the approval or the import that asked for it, so a crash never leaves the file and the records out of step. The write journal lets the CLI finish or undo a change to many files after a crash. [09 Storage and Indexing](09-storage-and-indexing.md) owns it.
- Every entry's kind is `person`, `team`, `organization` or `agent`. [17 v1 Import](17-v1-import.md) maps v1 owner kinds to these four.
- When a reviewer approves a persona record, the core adds the record's entry to `.make/personas.yaml` as a `user` entry, or the record claims an unclaimed `user` entry with the same slug, as [10 Records and Identity](10-records-and-identity.md) defines. The persona record points to that slug. The v1 import writes v1 owners there as `maintainer` entries, through the core ([17 v1 Import](17-v1-import.md)).
- Record fields name entries by slug: `owners` and `stakeholders` point to `maintainer` entries, and `audience` points to `user` entries. [10 Records and Identity](10-records-and-identity.md) owns the checks on these slugs.
- The core reserves the top-level `serve` command for both tools, beside `mcp` and outside each tool's operation catalog. No tool uses the name for anything else.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 6: runtime, shared core and distribution; section 16: Q-001, Q-049, Q-060, Q-070, Q-072, Q-077 and Q-080)
- [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design (Decision, sections 4, 6 and 7)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md` (Scope, Deliverables)
- `.make/config.yaml`
- `.make/personas.yaml`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/managed-block.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/router-paths.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/harness-access/native.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/store/database.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/operations/mcp-metadata.ts`

### Core Dependency Line

Make Blueprint uses the published core package, `@brucewaynedecoy/make-core`. During development it may use a workspace link (the npm workspace link to `packages/core/` in the same monorepo), so work can start while a core release is pending.

Requirements:

- Each Make Blueprint release names one exact published core version. The npm package installs that version, and each signed single file contains that version.
- Development builds may resolve the core through the workspace link.
- A release build (the npm publish and every signed single file) resolves the core only from the published package at the pinned version. The release build fails when the core resolves to a workspace link or to an unpublished version.
- A person or a test can read, from the installed CLI, which Make Blueprint version and which core version it contains.

Code anchors:

- [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design (Decision, section 4: one exact core version per kit release)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Dependencies: phase 02 can start against a local link)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md` (Scope: TypeScript project with `packages/core` as a dependency)

### Tool Discovery

Tool discovery is the core part that tells one tool whether the other is present. It has two checks: whether the other tool's block is in the project's root instruction files, and whether the other tool's CLI can be run on this machine.

Requirements:

- Discovery works offline and never installs, updates or starts a long-running copy of the other tool.
- Discovery finds a Make Docs install in either Make Docs layout.
- When discovery finds the other tool's CLI, it also reads that tool's version, so a caller can tell whether the other tool supports a needed capability.
- Make Blueprint never runs a command of the other tool that changes that tool's install or its packages.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 5: setup and update add or remove the handoff line; section 12: check confirms links when `make-docs` is installed)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/self/install-manager.ts`

### Handoff Line

Each tool's root block says what that tool owns. When the other tool is also present, the block carries one short handoff line that names what the other tool owns. The handoff line lets an agent that reads the root instruction file route work to the right tool without extra setup.

Make Blueprint's root block carries a line such as "Make Docs owns `docs/`, including designs, plans, PRDs and the work backlog in `docs/work/`." Make Docs' root block carries a line such as "Make Blueprint owns `blueprint/` and `.make/blueprint/`." The exact wording is router content and may change; the rule below does not.

Requirements:

- A root block carries exactly one handoff line for each other ecosystem tool that is present, and none for a tool that is absent.
- The handoff line sits inside the tool's own block. Each tool writes only its own block, so Make Blueprint writes the line in its block and Make Docs writes the matching line in its block.
- When both tools are present, both root blocks carry their handoff lines after either tool's `setup`, with no other step by the person.
- When either tool's `setup remove` takes it out of the project, the other tool's root block loses its handoff line, with no other step by the person.
- When the installed Make Docs is too old to write its handoff line, Make Blueprint still writes its own line.
- When the Make Docs block has no handoff line, `setup` output and the `project status` command (see [08 CLI and MCP](08-cli-and-mcp.md)) say so and tell the person to update Make Docs with its own update command and then run `make-blueprint setup` again. That second `setup` sends the refresh request, so the updated Make Docs writes its line. Work phase 01 confirms the exact Make Docs command that the output names.
- The handoff line appears in every root instruction file that carries the tool's block, with the same text.

A tool set up or removed later asks the other tool, through core tool discovery, to refresh only its own root block. The arriving tool's `setup` and the leaving tool's `setup remove` send this refresh request. The request touches only the other tool's root block in the current project. It does not run the other tool's `update` and does not change its install. Each tool still writes only its own block. When the other tool is too old to take the request, the rule above for a too-old tool applies.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 5: agent instruction files)
- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 16: Q-002 and Q-003)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md` (Scope: the handoff-line mechanism)
- `AGENTS.md`
- `CLAUDE.md`

## Contracts and Data

### Make Docs Links

Records of any type carry forward links to Make Docs through two common fields. The `work_items` field holds Make Docs work item IDs. The `docs` field holds paths to any Make Docs doc, such as a design, plan, PRD, work item or guide. [10 Records and Identity](10-records-and-identity.md) and [11 Record Types Reference](11-record-types-reference.md) own the field definitions, and [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) owns when a placement gets them in the hand off stage.

| Link | Form | Example | Format owner |
| --- | --- | --- | --- |
| Work item ID | A Make Docs work coordinate, as Make Docs reports it | `W2 R0 P3` | Make Docs |
| Doc path | A project-relative path to a Make Docs document, optionally with a heading anchor | `docs/prd/14-fit-gap-and-placement.md` | Make Docs |

Make Blueprint stores these values as text and does not parse their meaning. Make Docs owns their format.

Requirements:

- A record of any type is valid with empty `work_items` and `docs`. Make Blueprint works fully without Make Docs, and no stage other than hand off needs it.
- Doc paths are project-relative, use forward slashes on every operating system, and point under `docs/`.
- Make Blueprint never writes a Make Blueprint ID into Make Docs files. Links go forward from Make Blueprint records only.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 10: placement; section 12: relationship with Make Docs)
- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 16: Q-023)
- `blueprint/records/<type>/<id>.md`
- `docs/work/`

### Make Docs Link Check

The `project check` command (see [08 CLI and MCP](08-cli-and-mcp.md)) confirms Make Docs links through one Make Docs read command with JSON output that confirms work item IDs and doc paths. Until Make Docs ships that command, `project check` skips every Make Docs link and says how many it skipped. The skip is a temporary workaround, tracked as the deferred obligation [O-001](03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check) (owed work with a stable number), and must not become the normal behavior. [10 Records and Identity](10-records-and-identity.md) owns the rest of `project check`.

| Situation | What `project check` does | Effect on the check result |
| --- | --- | --- |
| `make-docs` found with the read command | Calls the read command for each work item ID and doc path, and reports each link that does not resolve | A link that does not resolve is a finding, named by record `ref`, field and value |
| `make-docs` not found | Skips every Make Docs link and reports how many it skipped and why | Not a finding and not an error |
| `make-docs` found without the read command | Skips every Make Docs link, reports how many it skipped, and names the Make Docs version that enables the check once one exists. Until the read command ships, every project with `make-docs` is in this row. | Not a finding and not an error |
| Project has no Make Docs block | Treats Make Docs as not present for links and reports skipped links as above | Not a finding and not an error |

Requirements:

- With a `make-docs` that has the read command, a record that links to a work item ID or doc path that does not exist is reported by `project check`, with the record's `ref`, the field and the value.
- Whenever the check skips Make Docs links, `project check` completes, its result is not failed because of Make Docs links, and its output states the number of Make Docs links it did not check and the reason.
- The check reads only. It changes no Make Docs file, no Make Docs Store and no Make Docs work item.
- The check uses Make Docs' machine-readable output, not its human text.
- The check works offline.
- The same check gives the same result through the CLI and through MCP.

The check does not use `make-docs run work item resolve`, because that operation resolves wave and phase coordinates and paths but not every doc path or task-level ID. The one read command ships with the Step 0 Make Docs changes. Once it ships, `project check` confirms Make Docs links through it, and the skip message and skip count go away, as [O-001](03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check) states.

Evidence: automated tests of the Make Docs link check with and without `make-docs` installed, in work phase `04-record-types.md`.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 12; section 16: Q-024)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/04-record-types.md` (Scope and Testing Decisions)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/operations/work/ops/item-resolve.ts`

### Backlog Ownership

Make Docs owns the backlog. Work items live in Make Docs `docs/work/`. Make Blueprint records link forward to them.

Requirements:

- Make Blueprint has no work item record type and no command that creates, edits, closes, orders or exports work items.
- Make Blueprint writes no file under `docs/`.
- The hand off skill tells the agent to use Make Docs to create or change work items, and then to store the resulting IDs and doc paths on placement records through Make Blueprint. [16 Workflow and Skills](16-workflow-and-skills.md) owns the skill.
- Make Blueprint ships no Azure Boards export. The BuildOS v1 Azure Boards export belongs to Make Docs, because Make Docs owns the backlog.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 3: Make Blueprint does not own the backlog; section 12)
- `docs/work/`

## Integrations

### Make Docs Capabilities Make Blueprint Depends On

Make Blueprint depends on these capabilities of the core and Make Docs. Each one ships in a core release or a Make Docs release from the make-kit monorepo, and the repo-wide plan schedules the Step 0 changes.

| Dependency | What Make Blueprint needs | Needed for | Behavior until it ships |
| --- | --- | --- | --- |
| Core release (Step 0) | A published `@brucewaynedecoy/make-core` from `packages/core/` that holds the parts in [Shared Core](#shared-core), takes each tool's own names and tags, supports `.make/<tool>/` and `~/.make/<tool>/` as layout targets, provides tool discovery, and reads and writes `.make/config.yaml` and `.make/personas.yaml` | Every v2.0 release build | Development uses a workspace link. No v2.0 release ships. |
| Make Docs on the core | A Make Docs release that runs on the core with its current behavior, apart from the uninstall block fix | One shared implementation of managed blocks in one file | Make Blueprint can still release on the core, but the two tools use different block code. |
| Handoff line in the Make Docs root block | Make Docs writes its handoff line when Make Blueprint is present, removes it when Make Blueprint leaves, and responds to the refresh request from Make Blueprint | The separate-or-together outcome | Make Blueprint writes its own line. `setup` and `project status` tell the person to update Make Docs with its own update command and then run `make-blueprint setup` again (see [Handoff Line](#handoff-line)). |
| Uninstall block fix | Make Docs uninstall removes only its own block, keeps user text, and deletes a file only when nothing is left | The promise that user text survives uninstall of either tool | Today Make Docs keeps the whole file, its block included, when the file has user text. User text stays safe, but its block stays behind. |
| Move to `.make/docs/` and `~/.make/docs/` | Make Docs project and machine folders under `.make/` | One folder pattern for both tools, and both blocks in `.make/AGENTS.md` and `.make/CLAUDE.md` | Make Blueprint works beside `.make-docs/` and `~/.make-docs/`. It does not wait for the move. |
| Link resolution | One Make Docs read command with JSON output that confirms work item IDs and doc paths, part of the Step 0 Make Docs changes | The Make Docs link check | `project check` skips Make Docs links and says how many and why, tracked as [O-001](03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check). |
| Shared setup choices | Make Docs `setup` reads and writes its shared choices, such as the selected agent tools, in `.make/config.yaml` through the core | Choices made once for every kit | Make Blueprint reads and writes `.make/config.yaml` through the core. Make Docs `setup` asks its own questions again. |
| Personas in `.make/personas.yaml` | Make Docs keeps its Persona list in `.make/personas.yaml`, with its label, description, built-in entries and reserved slugs, in place of `.make-docs/config.yaml` | One list of people and roles for both tools | Make Blueprint uses `.make/personas.yaml` alone. A Persona that Make Docs keeps only in `.make-docs/config.yaml` is not an entry that Make Blueprint records can name. |
| Azure Boards export | The export lives in Make Docs | Clients who track the backlog in Azure Boards | Not offered by Make Blueprint. |

Requirements:

- Make Blueprint v2.0 releases only after the core release it pins is published.
- For every row above, Make Blueprint behaves as the last column states when the installed Make Docs lacks the capability, and it never blocks its own commands on a missing Make Docs capability.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 4: Make Docs moves in its own release; section 12: the Make Docs changes this design needs; section 16: Q-024, Q-060 and Q-072; Consequences: core release friction)
- [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design (Decision, sections 3, 6 and 11)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md` (Dependencies, Exit Criteria)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/15-agent-instruction-ownership-and-managed-blocks.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/uninstall.ts`

### Other Integrations

- [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) uses the core's layout and managed-block parts and defines where each tool's block and handoff line sit.
- [07 Installation and Distribution](07-installation-and-distribution.md) uses the core's agent-tool setup, update and uninstall parts and its shared project files, and runs tool discovery during `setup` and `setup remove`.
- [08 CLI and MCP](08-cli-and-mcp.md) uses the core's MCP server, profile system and resource reading.
- [09 Storage and Indexing](09-storage-and-indexing.md) builds the index, locks and journal on the core's Store base.
- [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) and [16 Workflow and Skills](16-workflow-and-skills.md) use Make Docs links in the hand off stage.

Code anchors:

- `docs/prd/02-architecture-overview.md` (Module Map: core modules)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Phase Map)

## Rebuild Notes

- **Two core versions in one project.** Each tool pins its own core version, so Make Docs and Make Blueprint can run different core versions in the same project. The on-disk contracts that both tools read must stay compatible across core versions: the block tag format, block placement and order, the handoff-line rule, the presence rule and the `.make/` layout. Treat a change to any of them as a breaking core release that both tools adopt.
- **Do not make `update` the refresh trigger by accident.** In Make Docs today, `update` updates the installed tool through its package manager, and project sync is `setup`. A refresh request from the other tool must touch only the root block in the current project. It must not update the other tool's install.
- **Each tool writes only its own block.** It is tempting to let the arriving tool write both handoff lines. Do not. The other tool's block is outside its ownership, and its hash lives in the other tool's Store.
- **Skipped is not passed.** When `project check` skips Make Docs links, say so with a count. A silent skip reads like a clean result.
- **No product content in the core.** Router text, templates and skills belong to each tool. If the core starts to hold one tool's content, the other tool inherits it.
- **Core release friction.** A core change needs a core release before a Make Blueprint release can use it. The monorepo lets the core change and the kit change land together, but the release step stays. Plan core work early, and use the workspace link only for development.
- **Make Docs folder move.** Do not hard-code `.make-docs/` or `.make/docs/`. Use the core's layout part, which knows both.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Alternatives Considered: one merged CLI, Make Blueprint inside the make-docs monorepo; Consequences: core release friction)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/self/update-tool.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/managed-block.ts`

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/04-record-types.md`
- `docs/prd/01-product-overview.md`
- `docs/prd/02-architecture-overview.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/managed-block.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/self/update-tool.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/operations/work/ops/item-resolve.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/15-agent-instruction-ownership-and-managed-blocks.md`
