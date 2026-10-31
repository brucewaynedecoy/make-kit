---
title: "06 Project Layout and Instruction Files"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 06 Project Layout and Instruction Files

## Purpose

This document owns where Make Blueprint keeps things. It defines the project tree and the machine tree, what each folder holds, and which folders v2.0 creates. It also owns the agent instruction files: the routers that Make Blueprint writes, and the managed blocks that let Make Blueprint, Make Docs and the person's own text share one `AGENTS.md` or `CLAUDE.md` safely.

A router is an `AGENTS.md` or `CLAUDE.md` file that tells an agent what a folder holds and how to work in it. A managed block is the part of an instruction file between a tool's own begin and end tags. Each tool changes only its own block.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 4: project and machine layout; section 5: agent instruction files)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md`

## Scope

This document covers:

- The project tree under `<project>/` and the machine tree under `~/.make/`.
- What each folder holds, who owns it, and when it is created.
- System docs served by the CLI, and the optional local copy in `.make/blueprint/`.
- Every router location and what each router says.
- The managed-block rules in full: tags, placement, order, content in both instruction files, block hashes, conflicts, malformed tags and uninstall.
- The promise that user text in `AGENTS.md` and `CLAUDE.md` survives setup, update and uninstall of either tool.

Covered elsewhere:

- The handoff line's content and when it appears: [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- The `setup`, `update` and uninstall commands, their output, and agent-tool files such as skill folders and MCP config: [07 Installation and Distribution](07-installation-and-distribution.md).
- The `resource` command surface and the `make-blueprint://system/<type>/<path>` scheme: [08 CLI and MCP](08-cli-and-mcp.md).
- Record files, the local index, locks and the journal: [09 Storage and Indexing](09-storage-and-indexing.md).
- Source files, converted text and git rules for sources: [12 Source Intake and Conversion](12-source-intake-and-conversion.md).
- Export files: [15 Exports](15-exports.md).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, sections 4 and 5)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Human Experience Propagation)

## Component and Capability Map

| Component | What it does | Release | Detail owner |
| --- | --- | --- | --- |
| Project tree | One project folder holds everything for a project in file mode | v2.0, with `runs/` and `playbooks/` in v2.3 | This document |
| Machine tree | Keeps operational state outside the project, in the tool's own folder under `~/.make/` | v2.0 | This document; Store contents in [09 Storage and Indexing](09-storage-and-indexing.md) |
| System docs | Contracts, templates, references and prompts, served by the CLI, with an optional local copy | v2.0 | This document; surface in [08 CLI and MCP](08-cli-and-mcp.md) |
| Routers | Short guidance files in the root, `.make/`, `.make/blueprint/`, `blueprint/` and its top sub-folders | v2.0 | This document |
| Managed blocks | Tagged blocks that keep each tool's content and the person's text apart | Step 0 (core) and v2.0 | This document |

### Project Tree

```text
<project>/
  AGENTS.md, CLAUDE.md          root routers: one block per present tool, plus user text
  .make/
    AGENTS.md, CLAUDE.md        shared router for both tools
    config.yaml                 choices that every kit shares (the core writes it)
    personas.yaml               people and roles for every kit (the core writes it)
    blueprint/
      AGENTS.md, CLAUDE.md      router for Make Blueprint project settings
      config.yaml               Make Blueprint project settings and the project ID
      system/                   optional local copy of system docs
        contracts/
        templates/
        references/
        prompts/
      conflicts/                on demand: Make Blueprint's planned block when a conflict is kept
    docs/                       Make Docs project files, after the Make Docs move (Make Docs owns)
  .make-docs/                   Make Docs project files, before the Make Docs move (Make Docs owns)
  blueprint/
    AGENTS.md, CLAUDE.md
    sources/                    original files and converted text
      .gitignore                managed: source files kept out of git by git level
      .gitattributes            managed: Git LFS rules for large originals
    records/<type>/<id>.md      one Markdown file per record
    exports/                    generated files, tracked by git, never the truth
    runs/                       run notes and evidence files (v2.3)
    playbooks/                  playbooks (v2.3)
  docs/                         Make Docs content (Make Docs owns)
  <agent-tool files>            project-scope skill folders and MCP config (see 07)
```

| Path | Holds | Created | Release | Owner |
| --- | --- | --- | --- | --- |
| `AGENTS.md`, `CLAUDE.md` | Root routers. Each present tool's block, and the person's own text | `setup`, or already present | v2.0 | Shared; each tool owns only its block |
| `.make/` | One folder per ecosystem tool, the shared router, and the two files that every kit shares | `setup` | v2.0 | Shared |
| `.make/config.yaml` | Choices that every kit shares: the selected agent tools, skill install choices and the optional project display `name` | The shared core, at the first kit's `setup` | v2.0 | Shared, written only by the core; see [Project Config](#project-config) and [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| `.make/personas.yaml` | People and roles for every kit, one entry per slug | The shared core | v2.0 | Shared, written only by the core; see [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| `.make/blueprint/` | Make Blueprint's project settings and its router | `setup` | v2.0 | Make Blueprint |
| `.make/blueprint/config.yaml` | Make Blueprint's own declarative settings: the project ID, source and conversion settings, facets, review settings and the codes that the project adds to built-in code lists | `setup` | v2.0 | The project; see [Project Config](#project-config) |
| `.make/blueprint/system/` | An optional local copy of system docs in four typed folders | Only when a person asks for a local copy | v2.0 | Make Blueprint |
| `.make/blueprint/conflicts/` | Copies of Make Blueprint's planned block for each conflict that a person kept, for review | On demand | v2.0 | Make Blueprint |
| `.make/docs/`, `.make-docs/` | Make Docs project files, in its later or earlier layout | Make Docs | Make Docs release | Make Docs |
| `blueprint/` | All Make Blueprint project knowledge | `setup` | v2.0 | Make Blueprint |
| `blueprint/sources/` | Original files and their converted text, plus the Blueprint-managed `.gitignore`, which lists the source files that their git level keeps out of git, and `.gitattributes`, which holds the Git LFS rules for large originals | `setup` | v2.0 | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `blueprint/records/` | One Markdown file per record at `blueprint/records/<type>/<id>.md` | `setup`; each `<type>/` folder when its first record is written | v2.0 | [09 Storage and Indexing](09-storage-and-indexing.md) |
| `blueprint/sources/packages/` | The converted text of sources from system packages, in one folder for each package `name` | `run package add`, when it first writes a source from a package | v2.1 | [20 System Packages](20-system-packages.md) |
| `blueprint/exports/` | Generated CSV files, Markdown documents and the xlsx workbook. Git tracks them. | `setup` | v2.0 | [15 Exports](15-exports.md) |
| `blueprint/runs/` | Run notes and evidence files | `setup` of a v2.3 release | v2.3 | [11 Record Types Reference](11-record-types-reference.md) |
| `blueprint/playbooks/` | Playbooks | `setup` of a v2.3 release | v2.3 | [11 Record Types Reference](11-record-types-reference.md) |
| `docs/` | Designs, plans, PRDs and the work backlog | Make Docs | Make Docs release | Make Docs |

The project tree serves Northstar principle 3 (one folder). In file mode, a fresh clone of the project holds every record, every project setting, and each source's files at its source git level (the rule for which source files git tracks): the original and its converted text at `all`, the default; the converted text only at `converted`; neither at `none`.

Requirements:

- v2.0 `setup` creates `.make/`, `.make/blueprint/` with its `config.yaml`, `blueprint/`, `blueprint/sources/`, `blueprint/records/` and `blueprint/exports/`, and the routers listed in [Routers](#routers). Through the shared core, it also writes the setup choices to `.make/config.yaml`.
- v2.0 `setup` creates no `blueprint/runs/` or `blueprint/playbooks/` folder. Those arrive with v2.3.
- Every folder that `setup` creates holds at least its router, so git keeps the folder in a fresh clone.
- `.make/` and `.make/blueprint/` hold no operational state: no block hashes, locks, journals, receipts, installation records or index files.
- Only the shared core writes `.make/config.yaml` and `.make/personas.yaml`. Make Blueprint reads them and never writes them itself.
- Make Blueprint manages `blueprint/sources/.gitignore` and `blueprint/sources/.gitattributes`. [12 Source Intake and Conversion](12-source-intake-and-conversion.md) owns what they list.
- Git tracks `blueprint/exports/`. Export output is deterministic, so an unchanged export adds no diff. The xlsx workbook is binary, so git shows that it changed but not what changed; the CSV files show the detail.
- Make Blueprint writes nothing under `docs/`, `.make-docs/` or `.make/docs/`.
- Every path that Make Blueprint writes resolves inside the project folder. Make Blueprint refuses a write whose path, after following symbolic links, lies outside the project.
- Paths in config, routers and output use forward slashes and work on macOS, Windows and Linux.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 1, principle 3; section 4; section 16: Q-012, Q-028, Q-029, Q-040, Q-060 and Q-072)
- [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design (Decision, section 6)
- `.make/config.yaml`
- `.make/personas.yaml`
- `.make/blueprint/config.yaml`
- `blueprint/sources/`
- `blueprint/sources/.gitignore`
- `blueprint/sources/.gitattributes`
- `blueprint/records/<type>/<id>.md`
- `blueprint/exports/`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/21-project-tool-directory-and-resource-tiers.md`

### Machine Tree

```text
~/.make/
  blueprint/        Make Blueprint machine Store
  docs/             Make Docs machine Store, after the Make Docs move (Make Docs owns)
~/.make-docs/       Make Docs machine Store, before the Make Docs move (Make Docs owns)
<agent-tool files>  machine-scope skill folders and MCP config (see 07)
```

`~/.make/blueprint/` holds Make Blueprint's Store database and, beside it, the local index, write lock and write journal of each checkout. All of it is operational state only. The Store database keeps project identity, installation records such as managed-block hashes, hashes of MCP connection keys and records of tool operations. Each checkout's index is its own file beside the Store database, not inside it, so deleting or rebuilding an index touches no other Store state. [09 Storage and Indexing](09-storage-and-indexing.md) owns the index, lock and journal, keyed by the project ID in `.make/blueprint/config.yaml` and by checkout.

The environment setting `MAKE_BLUEPRINT_HOME` moves this folder. When it is set, Make Blueprint uses the folder it names in place of `~/.make/blueprint/`, with the same layout inside. It works like the `MAKE_DOCS_HOME` setting of Make Docs.

Requirements:

- Make Blueprint keeps its own Store database in `~/.make/blueprint/` and shares nothing else in `~/.make/` with Make Docs.
- Make Blueprint creates `~/.make/blueprint/` the first time a command needs the Store.
- Deleting the local index in `~/.make/blueprint/` loses no project knowledge. Make Blueprint rebuilds it from the project files.
- On Windows, `~` means the user's profile folder, and the same relative layout applies.
- When `MAKE_BLUEPRINT_HOME` is set, every read and write of machine state uses that folder, and Make Blueprint creates nothing in `~/.make/blueprint/`.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 4: each product keeps its own Store database; section 16: Q-012; Consequences: left for planning, the local index location)
- [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design (Decision, section 7)
- `~/.make/blueprint/`
- `MAKE_BLUEPRINT_HOME`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/store/database.ts`

### System Docs and Local Copy

System docs are the contracts, templates, references and prompts that guide agents in Make Blueprint work. The CLI serves them through `make-blueprint resource read make-blueprint://system/<type>/<path>`, where `<type>` is `contract`, `template`, `reference` or `prompt`. A local copy in the project is optional, as in Make Docs.

Requirements:

- Every system doc is readable through the CLI and through MCP with no local copy in the project.
- A local copy, when a person asks for one, lives in `.make/blueprint/system/` in the typed folders `contracts/`, `templates/`, `references/` and `prompts/`.
- `setup` creates no local copy unless a person asks for one.
- Make Blueprint reads a valid local copy first. A valid local copy is one that the installed version of Make Blueprint wrote and that no one has changed since.
- A local file that a person changed, or that is not from the installed version, never replaces the served doc without a notice that names the file.
- The version and hash of each local copy file live in the Store, not in the project.
- Routers tell agents to read a system doc through the CLI when no valid local copy exists.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 4: system docs served by `make-blueprint resource read`)
- `.make/blueprint/system/`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/21-project-tool-directory-and-resource-tiers.md`

### Routers

Make Blueprint writes routers in the project root, in `.make/`, in `.make/blueprint/`, and in `blueprint/` and each of its top sub-folders. Each router holds Make Blueprint's content inside its managed block, so every router follows the managed-block rules below.

| Router location | Release | What Make Blueprint's block says |
| --- | --- | --- |
| Project root | v2.0 | What Make Blueprint owns (`.make/blueprint/` and `blueprint/`), how to reach the CLI, the MCP server and the stage skills, where to read system docs, and the handoff line when Make Docs is present |
| `.make/` | v2.0 | That `.make/` holds one folder per ecosystem tool, and that Make Blueprint's folder is `.make/blueprint/`. That `.make/config.yaml` holds the choices every kit shares and `.make/personas.yaml` holds people and roles for every kit, and that the shared core writes both |
| `.make/blueprint/` | v2.0 | What `config.yaml` holds, that operational state lives in the Store, and that the local system copy is optional |
| `blueprint/` | v2.0 | What each sub-folder holds, and that record files are the truth |
| `blueprint/sources/` | v2.0 | That sources are added and converted through Make Blueprint commands, and that originals and converted text sit side by side |
| `blueprint/records/` | v2.0 | That each record is one file named by `id`, that writes go through the CLI or MCP, and that a hand edit is followed by the `project check` command (see [08 CLI and MCP](08-cli-and-mcp.md)) |
| `blueprint/exports/` | v2.0 | That exports are generated, are never the truth, and can be made again at any time |
| `blueprint/runs/` | v2.3 | What run notes and evidence files hold |
| `blueprint/playbooks/` | v2.3 | What playbooks hold |

Each router location gets the instruction files for the agent tools selected at `setup`, which `.make/config.yaml` keeps for every kit: `CLAUDE.md` for Claude Code, and `AGENTS.md` for Codex and GitHub Copilot CLI, as in Make Docs. When both files exist in one location, Make Blueprint's block is the same in both.

Requirements:

- v2.0 `setup` writes routers at exactly the v2.0 locations in the table, for each selected agent tool.
- Folders below `blueprint/records/`, such as `blueprint/records/capability/`, get no router.
- Router text is guidance only. It holds no settings, no state and no copy of a system doc.
- Router text names records by role and folder, not by internal ID formats or Store details.
- The `.make/` router carries one block for each ecosystem tool that keeps its folder under `.make/`. Before the Make Docs move, it carries only Make Blueprint's block.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 5: Make Blueprint writes routers in the project root, in `.make/`, in `.make/blueprint/`, and in `blueprint/` and each of its top sub-folders)
- `AGENTS.md`
- `CLAUDE.md`
- `.make/AGENTS.md`
- `blueprint/AGENTS.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/router-paths.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/types.ts`

### Managed Blocks

A person who writes their own text in `AGENTS.md` or `CLAUDE.md` keeps that text through setup, update and uninstall of either tool. This document owns that plan promise. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind it. The block code lives in `packages/core`, and each tool passes its own tags, so Make Docs and Make Blueprint follow the same rules (see [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md)).

#### Tags and Placement

Requirements:

- Make Blueprint's block starts with the line `<!-- make-blueprint:begin -->` and ends with the line `<!-- make-blueprint:end -->`. Make Docs keeps `<!-- make-docs:begin -->` and `<!-- make-docs:end -->`. The tag name is the CLI name. Tags carry no attributes, and each tag sits on its own line.
- A file holds at most one block for each tool.
- When a file has no Make Blueprint block, Make Blueprint adds the block at the bottom of the file, after all existing content, separated from it by one blank line.
- When the file does not exist, Make Blueprint creates it with only its block.
- When the block exists, Make Blueprint replaces only the text between its own tags. Every byte before the begin tag and after the end tag stays the same.
- Blocks keep their existing order and position. Make Blueprint never moves its own block or another tool's block.
- User text can sit above, between or below the blocks, and Make Blueprint keeps it in place.
- Make Blueprint never writes its block inside another tool's block.
- Make Blueprint writes its block with the line endings the file already uses.

#### Same Content in Both Files

Requirements:

- Where a router location has both `AGENTS.md` and `CLAUDE.md`, Make Blueprint writes the same block text into both.
- Make Blueprint uses no `@AGENTS.md` imports, no include syntax and no symbolic link between the two files.

#### Block Hashes and Conflicts

Requirements:

- The Store in `~/.make/blueprint/` keeps a SHA-256 hash of the body of each Make Blueprint block, for each file and project. No block hash is kept in the project folder.
- On `setup`, when the body of a block no longer matches its stored hash, Make Blueprint treats the block as edited by a person and raises a conflict for that file.
- For each conflict, `setup` offers two choices: reassert Make Blueprint's version, or keep the local version.
- Reassert replaces the block body with Make Blueprint's version and stores the new hash. Keep leaves the block exactly as it is and writes Make Blueprint's planned block to a conflict copy in `.make/blueprint/conflicts/` for review.
- A run that cannot ask, such as an agent's non-interactive run, never guesses. Unless it was given an explicit choice, it keeps the local block, writes the conflict copy, finishes its other work, and reports each conflicted file and the command that resolves it.
- An edit outside the block is not a conflict and is never reported as one.
- The conflict check reads only Make Blueprint's own block. An edit inside the Make Docs block is not Make Blueprint's conflict.

#### Malformed Tags

Make Blueprint's tags in a file are malformed when there is a begin tag without an end tag, an end tag without a begin tag, an end tag before its begin tag, more than one pair, or a pair inside another tool's block. The same rules apply to the Make Docs tags, `<!-- make-docs:begin -->` and `<!-- make-docs:end -->`, in any file that Make Blueprint will touch.

Requirements:

- Before it changes any instruction file, `setup` checks every instruction file it will touch. If any file has malformed tags of either tool, `setup` stops, changes no file, and names each file, the line and the problem.
- `setup remove` stops in the same way. `update` touches no instruction file, so it runs no tag check.
- After a person fixes the tags, the same command runs normally with no other repair step.

#### Uninstall

Requirements:

- Project uninstall removes Make Blueprint's block, its tags included, from each instruction file that Make Blueprint manages, and changes nothing else in the file.
- When the block body matches its stored hash, uninstall removes it. When a person edited the block, uninstall asks whether to remove it or keep it. A run that cannot ask keeps the edited block and reports it.
- After the block is gone, uninstall deletes the file only when nothing but whitespace is left. Otherwise it keeps the file, with every other byte unchanged.
- Uninstall never removes or changes another tool's block, even in a file that Make Blueprint created.
- On a file that held user text before `setup`, `setup` followed by uninstall, with no other change, leaves the file byte for byte as it was before `setup`. A file that `setup` created and that holds nothing else afterwards is deleted.
- Uninstall removes the block hashes for the removed blocks from the Store.

#### Safe Writes

Requirements:

- `setup` and `setup remove` hold the Store lock for the project from the time they read the instruction files until they finish writing them. `update` updates only the installed tool and writes no instruction file.
- If an instruction file changes between the read and the write, for example because the other tool wrote it, Make Blueprint does not overwrite it. It reads the file again and plans again, or stops and reports the file.
- Each instruction file write replaces the whole file in one step, so a crash leaves either the old file or the new file.

Evidence: round-trip tests with user text above, between and below both tools' blocks, through `setup`, a second `setup`, conflict, `update` and `setup remove` of each tool, in both install orders (work phases `01-shared-core-adoption.md` and `02-cli-and-packaging.md`).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Human Experience Intent; Decision, section 5)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md` (Scope, Human Experience and Evidence)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/managed-block.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/wizard.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/15-agent-instruction-ownership-and-managed-blocks.md`

## Contracts and Data

### Instruction File Shape

This is a root `AGENTS.md` with both tools present and user text in all three places. Make Docs was installed first, so its block sits above Make Blueprint's block.

```markdown
# Team notes

User text above the blocks.

<!-- make-docs:begin -->
Make Docs routing content.
Make Blueprint owns `blueprint/` and `.make/blueprint/`.
<!-- make-docs:end -->

User text between the blocks.

<!-- make-blueprint:begin -->
Make Blueprint routing content.
Make Docs owns `docs/`, including the work backlog in `docs/work/`.
<!-- make-blueprint:end -->

User text below the blocks.
```

### Block States

| State | Meaning | What `setup` does | What `setup remove` does |
| --- | --- | --- | --- |
| Absent | No Make Blueprint tags in the file | Add the block at the bottom | Nothing |
| Clean | One valid pair, and the body matches the stored hash | Replace the body with the current version | Remove the block |
| Edited | One valid pair, and the body differs from the stored hash | Raise a conflict: reassert or keep | Ask to remove or keep; keep when it cannot ask |
| Malformed | Lone, doubled, reversed or nested tags of either tool | Stop, change no file, and name the file and line | Stop, change no file, and name the file and line |

### Project Config

The project config file is `.make/blueprint/config.yaml`, a YAML file like `.make-docs/config.yaml`. It holds Make Blueprint's own declarative project settings. People may edit it. Make Blueprint never overwrites a person's edits to it without an explicit choice.

| Setting | Meaning | Owner |
| --- | --- | --- |
| Project ID | A random ID made at `setup`. It keys this project's state in the machine Store. | [09 Storage and Indexing](09-storage-and-indexing.md) |
| `sources.git_level` | The project's source git level: `all` (the default), `converted` or `none`. A source can override it with its own `git_level` field. | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `sources.lfs_threshold_mb` | The size in MB from which an original that git tracks goes through Git LFS. The default is `50`. | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `conversion.table_csv_min_rows` | The size above which a table inside a document becomes its own CSV file. Work phase 05 sets the default. | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| Facets | Named value lists, such as legal entity, release or scope | [10 Records and Identity](10-records-and-identity.md) |
| `review.second_reviewer` | Whether the optional second reviewer is on. The default is `false`. | [13 Extraction and Review](13-extraction-and-review.md) |
| `lists.capability_type` | The codes that the project adds to the built-in list of `capability_type` codes on capability records | [11 Record Types Reference](11-record-types-reference.md) |
| `lists.option_scope` | The codes that the project adds to the built-in list of `option_scope` codes on setting requirements | [11 Record Types Reference](11-record-types-reference.md) |
| `lists.integration_method` | The codes that the project adds to the built-in list of `method` codes on integration records | [11 Record Types Reference](11-record-types-reference.md) |

[11 Record Types Reference](11-record-types-reference.md) lists the built-in codes of each of these three lists. Each `lists.*` setting holds only the codes that the project adds, such as domain words for its own kinds of capability.

Choices that every kit shares do not sit in this file. They sit in `.make/config.yaml`, which the shared core reads and writes, and Make Blueprint only reads. A kit set up later reads them, so earlier choices are already selected.

| Setting in `.make/config.yaml` | Meaning | Owner |
| --- | --- | --- |
| Setup choices | The selected agent tools and skill install choices, used by every kit | [07 Installation and Distribution](07-installation-and-distribution.md) |
| `name` | An optional project display name. `project status` shows it, and exports use it in their titles. | [08 CLI and MCP](08-cli-and-mcp.md), [15 Exports](15-exports.md) |

People and roles for every kit sit in `.make/personas.yaml`. [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) owns its entry format, and [10 Records and Identity](10-records-and-identity.md) owns the checks on record fields that name its slugs.

### Store Records for Instruction Files

For each project, the Store keeps one entry per managed instruction file: the project-relative path, the body hash of Make Blueprint's block, and the Make Blueprint version that wrote it. These entries are operational state and never appear in the project.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 5: the Store keeps a hash of each block; section 16: Q-005, Q-009, Q-012, Q-060, Q-072, Q-078 and D-011)
- `.make/blueprint/config.yaml`
- `.make/config.yaml`
- `.make/personas.yaml`
- `.make-docs/config.yaml`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/managed-block.ts`

## Integrations

- `packages/core` provides the layout, resource and managed-block code. Make Blueprint passes its tags, folder names and router text. See [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- Make Docs uses the same managed-block code with its own tags, so both tools keep user text the same way. Make Docs' adoption of the uninstall fix is a dependency listed in [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- [07 Installation and Distribution](07-installation-and-distribution.md) runs the layout and block rules during `setup` and `setup remove`, and owns their output. `update` updates only the installed tool and does not run them.
- [08 CLI and MCP](08-cli-and-mcp.md) serves system docs and reports layout or block problems in the `project status` command.
- [09 Storage and Indexing](09-storage-and-indexing.md) keys the index, lock and journal by the project ID in `.make/blueprint/config.yaml` and by checkout, and keeps them beside the Store database in `~/.make/blueprint/`.

Code anchors:

- `docs/prd/02-architecture-overview.md` (Configuration Surfaces)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md`

## Rebuild Notes

- **Bytes, not lines.** Keep user text byte for byte: prefix, new block, suffix. Do not reformat, trim or re-wrap anything outside the block. The round-trip test compares bytes.
- **The separator belongs to the block.** When the block goes at the bottom of a file, the blank line before it is part of what uninstall removes. Otherwise a setup and uninstall cycle leaves an extra blank line.
- **Make Docs today keeps the whole file on uninstall.** The current Make Docs code keeps the whole file, its block included, when the file has user text. Its PRD 15 says uninstall removes a clean block. The core carries the fix for both tools.
- **Make Docs PRD 15 says uninstall "prunes no shared instruction file".** Make Blueprint deletes a file only when nothing is left in it, which is not a shared file at that point. Keep that distinction exact.
- **Never guess in a non-interactive run.** Agents run `setup` without a terminal. A silent overwrite of an edited block loses the person's text. Keep the local block and report.
- **Two tools, one file.** Make Docs and Make Blueprint can write the same root file in one session. Re-check the file before writing, and write it in one step.
- **Two layouts for Make Docs.** Do not assume `.make/docs/` exists. Before the Make Docs move, its folders are `.make-docs/` and `~/.make-docs/`.
- **No state in the project.** It is tempting to keep block hashes in a project file. Make Docs moved its own state out of the project into its Store. Keep Make Blueprint's in its Store from the start.

Code anchors:

- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/managed-block.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/uninstall.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/15-agent-instruction-ownership-and-managed-blocks.md`

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md`
- `docs/prd/01-product-overview.md`
- `docs/prd/02-architecture-overview.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/managed-block.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/router-paths.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/15-agent-instruction-ownership-and-managed-blocks.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/21-project-tool-directory-and-resource-tiers.md`
