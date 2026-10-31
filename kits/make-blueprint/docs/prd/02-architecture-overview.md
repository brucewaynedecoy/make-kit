---
title: "02 Architecture Overview"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 02 Architecture Overview

## Purpose

This document shows how Make Blueprint is shaped end to end. It covers the processes that run, the modules and what each one owns, the boundaries between them, how data moves from a source file to a fit-gap export and a Make Docs work item, and the files and settings that change behavior.

It stays at overview level. Each section links to the PRD that owns the detail. [01 Product Overview](01-product-overview.md) explains who uses the product and why.

## Topology

Make Blueprint is one TypeScript program, `make-blueprint`, that runs in two ways. As a CLI, a person or an agent runs one command at a time. As a stdio MCP server, started with `make-blueprint mcp`, an agent tool launches it as a child process and calls its tools over standard input and output. Both ways run the same Make Blueprint operations, and both are built on `packages/core`, the shared core. The core lives in `packages/core/` of the make-kit monorepo and reaches Make Blueprint as a core release, the published `@brucewaynedecoy/make-core` package.

In setup A (v2.0), nothing else runs. The CLI and MCP server read and write project files directly through the file backend, keep a derived SQLite index for fast queries, and keep operational state in the machine Store.

```text
                        Person (user or maintainer)
                                    |
                                    v
     +--------------------------------------------------------------+
     | Agent tool: Claude Code, Codex or GitHub Copilot CLI          |
     | Stage skills: thin guides that call commands, no scripts      |
     +--------------------------------------------------------------+
               | shell command                     | stdio MCP
               v                                   v
     +---------------------+          +-------------------------------+
     | make-blueprint CLI  |          | make-blueprint mcp            |
     | setup, project,     |          | profiles: core, setup,        |
     | resource, run, mcp, |          | intake, extract, analyze, all |
     | update, uninstall   |          | write tools need allowWrite   |
     +---------------------+          +-------------------------------+
               |                                   |
               +-----------------+-----------------+
                                 v
     +--------------------------------------------------------------+
     | Make Blueprint operations                                    |
     | records, intake, extraction, analysis, exports, status       |
     +--------------------------------------------------------------+
     | packages/core (core release from the make-kit monorepo)      |
     | layout, resources, MCP server, Store base, agent-tool setup, |
     | managed blocks, tool discovery, update, uninstall            |
     +--------------------------------------------------------------+
                                 | storage interface
                                 v
                  file backend (v2.0)   [database backend: v3]
                                 |
         +-----------------------+------------------------+
         v                       v                        v
  <project>/blueprint/     local SQLite index       ~/.make/blueprint/
  records, sources,        derived from files,      machine Store
  exports (in git)         not tracked by git       (operational state)

  Beside it, when installed: make-docs CLI. project check calls its read
  command to confirm Make Docs work item IDs and doc paths, and skips
  them with a count until that command ships (O-001).
```

In setup B (v2.1), each user can also start a small local server with `make-blueprint serve`. It serves the Svelte web app to a browser on the same machine. The MCP server serves the same views as MCP App views (HTML views that the MCP server serves and the agent tool shows). Both kinds of view get their data from view-model read calls: one CLI or MCP read call for each view that returns the rows and totals the view shows. Files stay the truth.

```text
  Setup B (v2.1)

  Browser ------ localhost ----> make-blueprint serve --+
                                                        |
  Agent tool, MCP App view ----> make-blueprint mcp ----+--> view-model read calls
                                                                    |
                                                                    v
                                  storage interface --> file backend --> files in git
```

In setup C (v3), the local server for each user reaches a shared database through the database backend. Setup C is designed later.

```text
  Setup C (v3, designed later)

  make-blueprint serve (one per user) --> storage interface --> database backend --> shared database
```

| Setup | Processes | Truth | Release | Owner |
| --- | --- | --- | --- | --- |
| A | CLI calls and the stdio MCP server, started by the agent tool | Record files in git | v2.0 | [09 Storage and Indexing](09-storage-and-indexing.md) |
| B | Setup A plus one local server for each user | Record files in git | v2.1 | [18 Local Server and UI](18-local-server-and-ui.md) |
| C | A local server for each user, using the database backend | A shared database | v3 | [09 Storage and Indexing](09-storage-and-indexing.md) |

Requirements:

- In setup A, Make Blueprint starts no long-running process of its own beyond the MCP server that the agent tool launches, and opens no network port.
- The MCP server talks only over stdio.
- In setup B, the local server accepts connections only from the user's own machine and asks for no login.
- Every view in the web app and every MCP App view gets its data from its view-model read call. That call is a CLI or MCP read call that any client can use.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 2: setups; section 7: CLI and MCP; section 14: UI; section 16: Q-001, Q-007 and Q-008)
- [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design (Decision, sections 2, 4 and 7)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/cli.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/operations/mcp-metadata.ts`

## Module Map

The map names logical modules and their owners. It does not fix source folder names.

### Core Modules

These modules live in `packages/core/` of the make-kit monorepo and reach Make Blueprint as a published core release. Make Docs and Make Blueprint both use them. Each tool passes in its own names, such as its CLI name, its managed-block tags and its folder under `.make/` and `~/.make/`.

| Module | Owns | Owner |
| --- | --- | --- |
| Layout and paths | Project and machine folder targets such as `.make/<tool>/` and `~/.make/<tool>/`, and path handling on macOS, Windows and Linux | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| Resources | Reading system docs (contracts, templates, references and prompts) served by the CLI, with an optional local copy | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| MCP server and profiles | The stdio server and the profile system that filters which tools a client sees | [08 CLI and MCP](08-cli-and-mcp.md) |
| Store base | The machine-level Store database that holds operational state | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| Agent-tool setup | Skills install and MCP config for Claude Code, Codex and GitHub Copilot CLI | [07 Installation and Distribution](07-installation-and-distribution.md) |
| Managed blocks | Tagged blocks in `AGENTS.md` and `CLAUDE.md`, block hashes, conflicts, and uninstall that keeps user text. [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) owns the handoff line's content and when it appears. | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| Tool discovery | Finding the other installed tool, so a tool set up or removed later can ask it to refresh its own root block | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| Shared project files | Reading and writing `.make/config.yaml` and `.make/personas.yaml`, the files that every kit in a project shares | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md), [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| Update and uninstall | Shared `update` and `uninstall` behavior | [07 Installation and Distribution](07-installation-and-distribution.md) |

[05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) owns the full contents of `packages/core` and its release line.

### Make Blueprint Modules

These modules live in this repository.

| Module | Owns | Release | Owner |
| --- | --- | --- | --- |
| CLI commands | The command groups `setup`, `project`, `resource`, `run <domain> <verb>`, `mcp`, `update` and `uninstall`, and human and machine output | v2.0 | [08 CLI and MCP](08-cli-and-mcp.md) |
| MCP profiles | The Make Blueprint tool set in the `core`, `setup`, `intake`, `extract`, `analyze` and `all` profiles, and the `allowWrite` gate | v2.0 | [08 CLI and MCP](08-cli-and-mcp.md) |
| Status | The status read model: sources, extraction progress, drafts waiting for review, broken links, ref clashes and the next useful action | v2.0 | [08 CLI and MCP](08-cli-and-mcp.md) |
| Storage interface | One interface for reading and writing records, with locks, the write journal and schema versions | v2.0 | [09 Storage and Indexing](09-storage-and-indexing.md) |
| File backend | One Markdown file per record at `blueprint/records/<type>/<id>.md` | v2.0 | [09 Storage and Indexing](09-storage-and-indexing.md) |
| Index | The derived local SQLite index, which answers filters and read-only SQL | v2.0 | [09 Storage and Indexing](09-storage-and-indexing.md) |
| Filter syntax and read-only SQL | The filter syntax that the CLI and MCP share, and the read-only SQL command, which the index backs | v2.0 | [08 CLI and MCP](08-cli-and-mcp.md) |
| Records | Common fields, statuses, `id` and `ref`, aliases, facets, evidence links, the `project check` command and ref fixes | v2.0 | [10 Records and Identity](10-records-and-identity.md) |
| Record types | Fields and links for each record type | v2.0, v2.2 | [11 Record Types Reference](11-record-types-reference.md) |
| Make Docs links | Work item IDs and doc paths on records, and their check through `make-docs` | v2.0 | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| Intake and conversion | Source records, source git levels, built-in converters, anchors, and the guided agent route for complex PDFs, in which an agent writes the text a few pages at a time and the CLI adds the anchors and checks each page | v2.0 | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| Extraction and review | `run extract next`, coverage, duplicate hints, drafts and review | v2.0 | [13 Extraction and Review](13-extraction-and-review.md) |
| Analysis | The model, compare and place stages: comparisons, fit-gap records, `target-only` records and placement records | v2.0 | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| Exports | CSV files, Markdown documents (capability model documents and data dictionaries) and the xlsx workbook in `blueprint/exports/` | v2.0 | [15 Exports](15-exports.md) |
| Skills | Nine skills, shipped inside the CLI package: one for each of the seven stages, `blueprint-report` for export prose and exports, and `blueprint-convert`, which serves the intake stage and guides the agent route for complex PDFs | v2.0 | [16 Workflow and Skills](16-workflow-and-skills.md) |
| v1 import | The one-time import of BuildOS v1 projects | v2.0 | [17 v1 Import](17-v1-import.md) |
| Local server | `make-blueprint serve` for setups B and C | v2.1 | [18 Local Server and UI](18-local-server-and-ui.md) |
| UI and view models | The Svelte web app, MCP App views built from the same Svelte view code, and one view-model read call for each view | v2.1 | [18 Local Server and UI](18-local-server-and-ui.md) |
| Database backend | A second backend behind the storage interface for setup C | v3 | [09 Storage and Indexing](09-storage-and-indexing.md) |

Requirements:

- `packages/core` does not depend on any Make Blueprint module. Records and storage stay in Make Blueprint.
- Every module that writes records goes through the storage interface. In file mode, only the file backend writes record files.
- An operation that both the CLI and MCP expose returns the same data and meaning on both surfaces. Only the presentation differs.
- Skills contain guidance only. They reach every capability through CLI commands or MCP tools.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 6: runtime, shared core and distribution; section 8: storage; section 16: Q-080)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/managed-block.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/store/database.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/harness-access/native.ts`

## Runtime Boundaries

| Boundary | Rule | Owner |
| --- | --- | --- |
| Language and runtime | TypeScript on Node 24, using the built-in `node:sqlite` module for the index | [07 Installation and Distribution](07-installation-and-distribution.md) |
| Distribution | An npm package, and signed single-file downloads for macOS, Windows and Linux that need no Node install | [07 Installation and Distribution](07-installation-and-distribution.md) |
| Network | Works offline after install and sends no telemetry | [07 Installation and Distribution](07-installation-and-distribution.md) |
| Agent tool to Make Blueprint | The agent tool reaches Make Blueprint through the stdio MCP server or by running CLI commands. Write tools need `allowWrite`. | [08 CLI and MCP](08-cli-and-mcp.md) |
| Browser to local server | Setup B only. The server listens only on the user's own machine and needs no login. | [18 Local Server and UI](18-local-server-and-ui.md) |
| Operations to storage | All record writes pass through the storage interface. A short lock guards `ref` minting and index updates. A change to many records writes a journal first, so the CLI can finish or undo it after a crash. | [09 Storage and Indexing](09-storage-and-indexing.md) |
| Project folder to machine Store | Project knowledge lives in the project folder. Operational state, such as managed-block hashes, lives in the machine Store under `~/.make/blueprint/`. | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md), [09 Storage and Indexing](09-storage-and-indexing.md) |
| Hand edits | People may edit record files by hand. `project check` finds bad edits, ref clashes, broken links and links to changed sources. | [10 Records and Identity](10-records-and-identity.md) |
| Make Blueprint to Make Docs | Make Blueprint calls `make-docs`, when it is installed, to confirm Make Docs links in `project check`. Until Make Docs ships the read command for this, `project check` skips these links and says how many. It changes only its own managed block and its own Store. | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| Make Blueprint to `packages/core` | Make Blueprint pins one exact published core version. A core change ships in a core release from the make-kit monorepo first. | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |

Requirements:

- The signed single file runs every command, the MCP server and every skill on a machine with no Python and no Node.
- After install, every command works with no network connection.
- Make Blueprint sends no usage data.
- A write tool called without `allowWrite` changes nothing and says why.
- After a crash during a change to many records, the CLI uses the journal to finish or undo that change, so no set of records is left half-changed.
- Paths in records, config and output work on macOS, Windows and Linux.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 2: setups; section 6: runtime; section 8: storage; Consequences: single-file packaging)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Acceptance Criteria Guidance)
- `~/.make/blueprint/`

## Data Flow

The main flow takes one original file through to fit-gap results, Make Docs work items and client exports. Numbers in brackets name the owning PRD.

```text
  original file
  in blueprint/sources/, in git or kept out of git by its source git level
        |
        | intake: add the source, record its file hash, convert it        [12]
        |         (a complex PDF can take the guided agent route,
        |         and its text is reviewed before extraction)
        v
  source record  +  converted text next to the original,
                    with one stable anchor per heading, paragraph or row,
                    and one CSV file per table, with a t table anchor
        |
        | extract: run extract next hands out one source at a time,       [13]
        |          duplicate hints shown before each new record
        v
  extraction record (coverage and outcome per part of the source)
  +  draft records: system, domain, capability, requirement, persona,
     finding, integration
        |
        | review: each draft becomes active or rejected,                   [13]
        |         journaled when many change at once; an approved
        |         pending change is written into the same record file
        v
  active records, each with evidence links such as SRC-4hd8x7k2#p-012      [10]
        |
        | model: clean up systems, capabilities and domains               [14]
        v
  comparison: one target system and one or more baseline systems          [14]
        |
        | compare: one fit-gap record per baseline capability, with
        |          verdict, confidence, effort and evidence links;
        |          target-only records for unused target capabilities
        v
  fit-gap records
        |
        | place: owning system and delivery value                         [14]
        v
  placement records
        |
        | hand off: store Make Docs work item IDs and doc paths           [05]
        v
  Make Docs docs/work/ (owned by Make Docs)

  export, at any time: active records + fit-gap records
        --> blueprint/exports/  CSV files + Markdown documents             [15]
                                + one xlsx workbook per comparison
```

Every write follows the same path. Files are the truth, and the index is derived from them.

```text
  CLI command, or MCP write tool with allowWrite
        |
        v
  operation --short lock------> mint a ref, update the index               [09]
        |   --journal first---> change to many records, finish or undo
        |                       after a crash
        v
  record file: blueprint/records/<type>/<id>.md   (one file, one git diff)
        |
        v
  local SQLite index (derived, rebuilt from files at any time)            [09]
        |
        v
  reads: filter syntax, read-only SQL, status, view models                 [08]

  hand edit of a record file --> project check finds bad edits, ref
                                 clashes, broken links and stale links      [10]
```

Two other flows matter:

- **Status.** The `project status` command reads the index and reports sources, extraction progress, drafts and pending changes waiting for review, broken links and ref clashes, with the next useful action. See [08 CLI and MCP](08-cli-and-mcp.md).
- **v1 import.** A one-time command reads a BuildOS v1 project and writes Make Blueprint records. v1 IDs such as `REQ-001` become `ref` values, so people keep the names they know. See [17 v1 Import](17-v1-import.md).

Requirements:

- Every record that extraction creates starts as `draft`.
- A fact on an `active` record changes only through a pending change, a proposed fix that waits for review while the record keeps its old value. An approved pending change is written into the same record file, so the `id`, the `ref` and every link stay the same. See [13 Extraction and Review](13-extraction-and-review.md).
- Exports are always generated from records. They are CSV files, Markdown documents and one xlsx workbook for each comparison. A person can generate them again at any time, and nothing reads an export back as the truth.
- Deleting the local index loses no data. `make-blueprint` rebuilds it from the record files.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 8: storage; section 9: identity; section 10: data model; section 11: workflow and skills; section 13: exports; section 16: Q-028, Q-032, Q-061, Q-062 and Q-073)
- `blueprint/sources/`
- `blueprint/records/<type>/<id>.md`
- `blueprint/exports/`

## Configuration Surfaces

| Surface | Location | What it holds | Tracked in git | Owner |
| --- | --- | --- | --- | --- |
| Shared project config | `.make/config.yaml` | Choices that every kit in the project shares, such as the selected agent tools, and the optional project display `name`. A kit set up later reads it, so earlier choices are already selected. The shared core writes it. | Yes | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md), [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| Shared people and roles | `.make/personas.yaml` | One entry for each person, team, organization, agent or role, with a slug, a name, a primitive (`user` or `maintainer`), a kind and the kits it is enabled for. Record fields such as `owners`, `stakeholders` and `audience` hold its slugs. The shared core writes it. | Yes | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md), [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md), [10 Records and Identity](10-records-and-identity.md) |
| Project config | `.make/blueprint/config.yaml` | Make Blueprint's own declarative project settings, including facet definitions (named value lists such as legal entity, release or scope), source settings such as `sources.git_level` and `sources.lfs_threshold_mb`, and review settings such as `review.second_reviewer` | Yes | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md), [10 Records and Identity](10-records-and-identity.md), [13 Extraction and Review](13-extraction-and-review.md) |
| Machine Store | `~/.make/blueprint/`, or the folder that `MAKE_BLUEPRINT_HOME` names | Operational state such as managed-block hashes in the Store database, and, beside it, each checkout's local index, write lock and write journal | No | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md), [09 Storage and Indexing](09-storage-and-indexing.md) |
| Instruction files and routers | `AGENTS.md` and `CLAUDE.md` in the project root, `.make/`, `.make/blueprint/`, `blueprint/` and each top sub-folder of `blueprint/` | Router guidance. Make Blueprint writes its content between `<!-- make-blueprint:begin -->` and `<!-- make-blueprint:end -->`. | Yes | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| Agent-tool MCP config | Each agent tool's own MCP client config | One server entry that starts `make-blueprint mcp`, with an optional profile choice | Owned by the agent tool | [07 Installation and Distribution](07-installation-and-distribution.md), [08 CLI and MCP](08-cli-and-mcp.md) |
| Installed skills | The agent tool's skill folders | The nine skills (the seven stage skills, `blueprint-report` and `blueprint-convert`), which `setup` installs from the CLI package | Depends on the agent tool | [07 Installation and Distribution](07-installation-and-distribution.md), [16 Workflow and Skills](16-workflow-and-skills.md) |
| Record schema version | Front matter of each record file | The schema version that `make-blueprint setup` uses, when it runs again in a project, to upgrade old records. `make-blueprint update` updates only the tool. | Yes | [09 Storage and Indexing](09-storage-and-indexing.md) |
| Git rules for sources | `blueprint/sources/.gitignore` and `blueprint/sources/.gitattributes`, both managed by Make Blueprint | The source files that their git level (`all`, `converted` or `none`) keeps out of git, listed at their normal paths with no symlinks, and Git LFS rules for tracked originals of 50 MB or more by default | Yes | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |

Requirements:

- Project config holds declarative settings only. Operational state, such as managed-block hashes, stays out of the project folder, following the Make Docs rule.
- The shared core reads and writes `.make/config.yaml` and `.make/personas.yaml`. Make Blueprint reads both and never writes them itself. When a reviewer approves a persona record, the core adds its entry to `.make/personas.yaml`.
- Settings for Make Blueprint alone stay in `.make/blueprint/config.yaml`. Choices that every kit shares stay in `.make/config.yaml`.
- Make Blueprint changes only its own managed block in each instruction file, and never the Make Docs block or the user's text. [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) owns conflicts, broken tags and uninstall.

The facet config format, the front matter schema for each record type and the final index location are fixed by their owning PRDs: [10 Records and Identity](10-records-and-identity.md), [11 Record Types Reference](11-record-types-reference.md) and [09 Storage and Indexing](09-storage-and-indexing.md).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 4: project and machine layout; section 5: agent instruction files; section 10: facets; section 11: review; section 16: Q-009, Q-012, Q-028, Q-029, Q-042, Q-072, Q-080 and D-011)
- [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design (Decision, sections 6 and 7)
- `.make/config.yaml`
- `.make/personas.yaml`
- `.make/blueprint/config.yaml`
- `~/.make/blueprint/`
- `blueprint/sources/.gitignore`
- `blueprint/sources/.gitattributes`
- `AGENTS.md`
- `CLAUDE.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/router-paths.ts`

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/08-mcp-skills-and-status.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/cli.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp/tools.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/store/database.ts`
