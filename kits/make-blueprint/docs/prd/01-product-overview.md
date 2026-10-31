---
title: "01 Product Overview"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 01 Product Overview

## Purpose

Make Blueprint helps people and agents turn a pile of client sources, such as documents, spreadsheets, slide decks, notes and transcripts, into trusted records about the current and planned states of one or more systems. It then compares those systems capability by capability, records which system should own each capability and how it is delivered, and links that placement forward to planned work in Make Docs.

Make Blueprint is the product formerly named BuildOS. Its command-line tool is `make-blueprint`. It runs as a CLI and as a stdio MCP server (a Model Context Protocol server that talks over standard input and output) that an agent tool, also called a harness, starts and calls. It is a separate product from Make Docs. The two products share one TypeScript package, `packages/core`, so they follow one pattern for folders, instruction files, the machine Store, CLI shape and MCP profiles.

Every record is one Markdown file in the project folder. Every extracted fact links back to an exact place in its source and forward to planned work. People review and merge record changes in git like any other file.

This PRD set describes the whole product. v2.0 is the current release scope. Capabilities for v2.1, v2.2 and v3 appear as planned scope or as current limitations, so each one already has its owning PRD. The source design is [Make Blueprint v2 Architecture](../designs/2026-10-29-make-blueprint-v2-architecture.md), and the plan is [Make Blueprint v2 Owner Decision Maintenance Plan](../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md). [02 Architecture Overview](02-architecture-overview.md) shows how the product is built.

### Northstar Principles

These six principles are fixed. When two requirements in this PRD set conflict, the requirement that serves the earlier principle wins.

1. **Separate or together.** Make Docs and Make Blueprint install alone or together. When both are in one project, handoff and links between them work with no extra setup. Neither tool is bolted onto the other.
2. **Agent first.** The agent tool is the main way people use Make Blueprint.
3. **One folder.** In file mode, one project folder holds everything for a project.
4. **UI optional.** The UI is optional, and no task needs it.
5. **Traceable.** Every extracted fact links back to its source and forward to planned work.
6. **One install.** Make Blueprint needs one approved install. Skills ship no Python and no scripts. They call the Make Blueprint CLI or MCP server.

Requirements:

| Principle | Observable requirement | Owner |
| --- | --- | --- |
| Separate or together | On a fresh project with no Make Docs, Make Blueprint installs and every v2.0 command works. When both tools are installed, each tool's root block carries one handoff line that names what the other tool owns, and agents hand off with no extra configuration. | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md), [07 Installation and Distribution](07-installation-and-distribution.md) |
| Agent first | Every v2.0 capability is reachable from each supported agent tool through the MCP server or the CLI, and each workflow stage has a skill that guides it. | [08 CLI and MCP](08-cli-and-mcp.md), [16 Workflow and Skills](16-workflow-and-skills.md) |
| One folder | A fresh clone of a file-mode project holds every record, every project setting, and each source's files at its source git level (the rule for which source files git tracks): the original and its converted text at `all`, the default; the converted text only at `converted`; neither at `none`. The local index rebuilds from those files with no other input. | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md), [09 Storage and Indexing](09-storage-and-indexing.md) |
| UI optional | Every task in the seven workflow stages completes with no server and no UI running. | [18 Local Server and UI](18-local-server-and-ui.md) |
| Traceable | Records that extraction creates carry evidence links to anchors in converted source text. Every fit-gap record carries evidence links. Placement records carry links to Make Docs work items. `project check` reports broken links and links to a changed source. | [10 Records and Identity](10-records-and-identity.md), [13 Extraction and Review](13-extraction-and-review.md), [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| One install | The npm package, or one signed single file, is the only thing a person installs. No skill contains a script file. With the signed single file installed, every skill works on a machine that has no Python and no Node. | [07 Installation and Distribution](07-installation-and-distribution.md), [16 Workflow and Skills](16-workflow-and-skills.md) |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 1: Northstar principles; section 3: product boundary and names)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Objective)
- `README.md`

## Users

Make Blueprint's Personas are the `user` and `maintainer` entries in `.make/personas.yaml`, the shared people and roles file that every kit in a project reads. A Persona is an audience role for this product. Either role can be filled by a person or by an agent.

| Persona | Concrete roles | What they do with Make Blueprint | Main surfaces |
| --- | --- | --- | --- |
| `user` | Consultants, architects, product owners and stakeholders, and the agents that act for them | Add sources, run extraction, review draft records, model systems, build comparisons, read fit-gap and placement results, and export files that a client opens without Make Blueprint | The agent tool with stage skills, the `project status` and `project check` commands, record files in git, and files in `blueprint/exports/` |
| `maintainer` | People and agents who build, install, operate and upgrade Make Blueprint and Make Docs | Install the CLI, run `setup`, `update` and `uninstall`, get the signed single file approved on locked-down machines, and keep `packages/core` in step across both products | `setup`, `update` and `uninstall` output, agent-tool MCP config, instruction files, and `packages/core` |

A `persona` record is related to a Persona but is not the same thing. It describes a role that uses one or more of a client's systems, and it lives in the project's records with evidence and review. Each persona record points to its slug in `.make/personas.yaml`. When a reviewer approves a persona record, the shared core adds its entry to that file as a `user` entry, so the same client role can also be an audience for the project's docs. "Persona record" means the Make Blueprint record type, and "Persona" means the audience role. See [11 Record Types Reference](11-record-types-reference.md) and [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).

The human goal is this: a person turns a pile of client sources into trusted, traceable records and a fit-gap they can share. They do this from their agent tool, on a locked-down machine if needed, without learning the storage internals and without fighting a second tool.

### Experience Promises

Each promise is an observable capability requirement in its owning PRD. This table is the navigation map. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind them.

| Promise | Owner |
| --- | --- |
| A person installs Make Blueprint alone, Make Docs alone, or both. When both are installed, agents hand off between them with no extra setup. | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md), [07 Installation and Distribution](07-installation-and-distribution.md) |
| On a machine that allows no Python, a person installs one signed file, and every skill works. | [07 Installation and Distribution](07-installation-and-distribution.md) |
| A person follows any record's evidence link to the exact place in its source, and sees a clear flag when the source changed after the link was made. | [10 Records and Identity](10-records-and-identity.md), [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| A reviewer reads a record change as a normal git diff of one Markdown file. | [09 Storage and Indexing](09-storage-and-indexing.md) |
| A person who writes their own text in `AGENTS.md` or `CLAUDE.md` keeps that text through setup, update and uninstall of either tool. | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| One status command shows sources, extraction progress, drafts waiting for review, broken links and ref clashes, and names the next useful action. | [08 CLI and MCP](08-cli-and-mcp.md) |
| When two branches create the same friendly ref, `project check` names the clash, one command fixes it, and the old ref still finds the record. | [10 Records and Identity](10-records-and-identity.md) |
| A consultant exports a fit-gap CSV and an xlsx workbook that a client opens without Make Blueprint. | [15 Exports](15-exports.md) |

### Complexity Kept Out of the Human Path

Requirements:

- Human output names records by `ref` (the friendly counter, such as `REQ-042`) and title. The permanent `id` (such as `REQ-7kq2m7k2`) stays available in machine output and in record detail.
- A person completes daily record work without choosing a storage backend, an MCP profile or a setup. The `all` MCP profile is the default, and record commands give the same results in setups A and B.
- Normal commands never ask a person to manage the local index, locks, the write journal, schema versions, managed-block hashes or Store internals. These appear only in diagnostic output or in an error that needs a person's decision.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Human Experience Intent)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Human Experience Propagation)
- `.make/personas.yaml` (Personas and people for every kit in a project)
- `blueprint/exports/`

## Key Capabilities

Make Blueprint organizes work into seven stages. Each stage has one skill. Two more skills serve stages without being stages of their own. `blueprint-convert` serves the intake stage: it guides an agent that converts a complex PDF, such as one with tables or scanned pages, a few pages at a time. `blueprint-report` drafts the prose that exports use into records and runs the exports. So v2.0 ships nine skills. Every skill is a thin guide that calls CLI commands or MCP tools. See [16 Workflow and Skills](16-workflow-and-skills.md).

### Capabilities by Workflow Stage

| Stage | What a person or agent does | Main records | Release | Owner |
| --- | --- | --- | --- | --- |
| Intake | Add source files and convert them to text with stable anchors, using converters built into the CLI. A complex PDF can take the guided agent route instead: an agent writes the text a few pages at a time, the CLI adds the anchors and checks each page, and a person reviews the text before extraction. | source | v2.0 | [12 Source Intake and Conversion](12-source-intake-and-conversion.md), [16 Workflow and Skills](16-workflow-and-skills.md) |
| Extract | Take the next source, turn it into draft records, see likely duplicates first, and record coverage for each part of the source. Current integrations between systems come from this stage. | extraction, system, domain, capability, requirement, persona, finding, integration | v2.0 | [13 Extraction and Review](13-extraction-and-review.md), [19 System Integrations](19-system-integrations.md) |
| Review | Make each draft record `active` or `rejected`, with an optional second reviewer. Approve or reject pending changes to active records. A pending change is a proposed fix to a fact on an active record, which keeps its old value until review. Accept the text of an agent conversion, or send its pages back to the agent. | any draft record; any active record with a pending change; a source whose agent conversion waits for review | v2.0 | [13 Extraction and Review](13-extraction-and-review.md) |
| Model | Clean up systems, capabilities and domains so they can be compared | system, capability, domain | v2.0 | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| Compare | Create a comparison of one target system against one or more baseline systems, score each baseline capability with a verdict, and list target capabilities that no baseline uses. Planned integrations come from this stage as drafts. | comparison, fit-gap, integration | v2.0 | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), [19 System Integrations](19-system-integrations.md) |
| Place | Record which system owns each capability and how it is delivered. Planned integrations also come from this stage as drafts. | placement, integration | v2.0 | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), [19 System Integrations](19-system-integrations.md) |
| Hand off | Link placements to Make Docs work items and doc paths | placement | v2.0 | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md), [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |

### Foundation Capabilities

| Capability | What it gives people | Release | Owner |
| --- | --- | --- | --- |
| Ecosystem and shared core | Install alone or beside Make Docs, with handoff lines and checked links between the two | Step 0 and v2.0 | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| Project layout and instruction files | One `.make/blueprint/` and `blueprint/` layout, routers, and managed blocks that keep user text safe | v2.0 | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| Installation and distribution | `setup`, skills install, agent-tool MCP config, `update` and `uninstall`, on npm and as signed single files | v2.0 | [07 Installation and Distribution](07-installation-and-distribution.md) |
| CLI, MCP and status | One command shape, one MCP server with profiles, write tools gated by `allowWrite`, one filter syntax, read-only SQL, and the `project status` command | v2.0 | [08 CLI and MCP](08-cli-and-mcp.md) |
| Storage and indexing | Record files as the truth, a derived local index, safe writes and crash recovery | v2.0 (file backend), v3 (database backend) | [09 Storage and Indexing](09-storage-and-indexing.md) |
| Records and identity | Two IDs per record, aliases, facets, evidence links, the `project check` command and a ref-fix command | v2.0 | [10 Records and Identity](10-records-and-identity.md) |
| Record types | Twelve record types in v2.0, and four more planned | v2.0, v2.2 | [11 Record Types Reference](11-record-types-reference.md) |
| System integrations | One `integration` record for each flow of data or events from one system to another. Current integrations come from extraction, and planned ones come from analysis as drafts. Comparisons, placements and the hand-off use them. | v2.0 | [19 System Integrations](19-system-integrations.md) |
| Exports | For each system: capability and requirement CSV files, a capability model document and a data dictionary. For each comparison: a fit-gap detail CSV, summaries by verdict and by domain, the fit-gap requirements, placements and integrations CSV files, a data dictionary, and one xlsx workbook with all of the comparison's tables | v2.0 | [15 Exports](15-exports.md) |
| v1 import | A one-time import of BuildOS v1 projects, where v1 IDs become `ref` values | v2.0 | [17 v1 Import](17-v1-import.md) |
| Local server and UI | A local server, a Svelte web app for viewing, sorting and filtering, then MCP App views | v2.1 | [18 Local Server and UI](18-local-server-and-ui.md) |

### Setups

A setup is a way to run Make Blueprint. It decides whether a server runs and where the data lives.

| Setup | Server | Where data lives | Release |
| --- | --- | --- | --- |
| A | None. The CLI and MCP server work directly on files. | Files in git | v2.0 |
| B | A small local server for each user | Files in git | v2.1 |
| C | A local server for each user | A shared database | v3, designed later |

- Setup A is the most common setup. In file mode the server is optional, and a person starts it only for the UI or for setup C.
- In setup B, the local server listens only on the user's own machine and needs no login.
- The storage interface keeps more setups possible later. See [09 Storage and Indexing](09-storage-and-indexing.md).
- Make Blueprint sends no telemetry (no usage data) in any setup.

### Release Scope

| Step | Content | Status in this PRD set |
| --- | --- | --- |
| Step 0 | Repo-wide work in the make-kit monorepo: copy Make Docs into `kits/make-docs/`, pull the shared core out into `packages/core/`, and pass the switch point (the moment Make Docs releases start to come from the monorepo). The `make-kit` setup tool follows. The core carries managed blocks that take each tool's own tags, and the uninstall fix. | Prerequisite for v2.0. Repo-wide work, planned in the repo-wide plan; it is not a Make Docs release |
| v2.0 | Setup A (file mode), the CLI, the MCP server, nine skills (the seven stage skills, `blueprint-report` and `blueprint-convert`), conversion with the guided agent route for complex PDFs, extraction and review, the twelve v2.0 record types, `project status`, `project check`, exports and the v1 import | Current release scope |
| v2.1 | Setup B (local server), the web app, then MCP App views | Planned scope |
| v2.2 | Test case, run, result and playbook records | Planned scope |
| v3 | Setup C (shared database). Its database type, logins, permissions and file storage are designed at that time. | Planned scope, not yet designed |

BuildOS v1 receives bug fixes only and gets no new features. v1 projects move to Make Blueprint through the v2.0 import. See [17 v1 Import](17-v1-import.md).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 2: setups; section 11: workflow and skills; section 15: release plan and v1; section 16: Q-080)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Phase Map, Proposed Catalog)
- `blueprint/sources/`
- `blueprint/records/<type>/<id>.md`
- `blueprint/exports/`

## System Boundaries

Make Blueprint owns its CLI, its records and its storage. It depends on, or sits beside, five other parties.

| Party | What it owns | How Make Blueprint relates to it |
| --- | --- | --- |
| Make Blueprint | The `make-blueprint` CLI and MCP server, its skills, `.make/blueprint/`, the `blueprint/` tree, its own managed block in instruction files, and its machine Store in `~/.make/blueprint/` | Owner |
| Make Docs | `docs/` content, including designs, plans, PRDs and the work backlog in `docs/work/`; its own managed block; its own project folder and machine Store; the Azure Boards export | Make Blueprint records store Make Docs work item IDs and doc paths. Until Make Docs ships one read command that confirms them, `project check` skips these links and says how many it skipped. This skip is temporary and is tracked as obligation [O-001](03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check). See [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md). |
| `packages/core` | Shared layout and path handling, resource reading, the MCP server and its profiles, the Store base, agent-tool setup, managed blocks, tool discovery, `update` and `uninstall`, and reading and writing the shared `.make/config.yaml` and `.make/personas.yaml` files. It lives in `packages/core/` of the make-kit monorepo and is published as `@brucewaynedecoy/make-core`. | Make Blueprint pins one exact published core version. A core change ships in a core release before a Make Blueprint release can use it. See [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md). |
| Agent tool | The agent session, its skill folders and its MCP client config. Supported tools are Claude Code, Codex and GitHub Copilot CLI. | `setup` installs the skills and writes the MCP config. The agent tool starts the MCP server. See [07 Installation and Distribution](07-installation-and-distribution.md). |
| Git | Version history, branches, review and merge of project files, and Git LFS (a git add-on for big files) when the client allows it | Make Blueprint keeps one record per file so diffs stay small, keeps the derived index out of git, and finds ref clashes after a merge with `project check`. See [09 Storage and Indexing](09-storage-and-indexing.md) and [10 Records and Identity](10-records-and-identity.md). |
| Client systems | The current client systems and target products under study | Make Blueprint has no connection to them. It learns about them only from sources that people add, and represents each one as a `system` record. |

The BuildOS v1 repository (`build-os`) is reference only. Make Blueprint is new code in this repository. Ideas may be copied from v1, and code only after a deliberate review.

Requirements:

- Make Blueprint does not own the backlog. Work items live in Make Docs `docs/work/`, and Make Blueprint records hold their IDs and doc paths as links.
- Make Blueprint changes only its own managed block in instruction files. It never changes the Make Docs block or the user's text.
- Make Blueprint keeps its own Store database under `~/.make/blueprint/` and shares nothing else in `~/.make/` with Make Docs.
- Make Blueprint does not wait for the Make Docs folder move to `.make/docs/` and works beside Make Docs in either folder layout.
- Make Blueprint sends no telemetry.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 3: product boundary; section 4: project and machine layout; section 12: relationship with Make Docs; section 16: Q-001 and Q-024)
- [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design (Decision, sections 3, 4 and 11)
- `.make/blueprint/`
- `blueprint/`
- `~/.make/blueprint/`
- `docs/work/`

## Current Limitations

- **Setup C is not designed.** v2.0 ships only the file backend. The database backend, its database type, logins, permissions and file storage come with setup C in v3. See [09 Storage and Indexing](09-storage-and-indexing.md).
- **No server and no UI in v2.0.** The local server and web app come in v2.1, then MCP App views. The first UI views, sorts and filters records; editing in the UI comes later. See [18 Local Server and UI](18-local-server-and-ui.md).
- **No test records in v2.0.** Test case, run, result and playbook records, with the `blueprint/runs/` and `blueprint/playbooks/` folders, come in v2.2. See [11 Record Types Reference](11-record-types-reference.md).
- **No custom record types.** A project extends records with facets (named value lists such as legal entity, release or scope), not with new types. See [10 Records and Identity](10-records-and-identity.md).
- **Converted text is not secret.** At the `converted` git level the original stays out of git, but its converted text holds the same words and git tracks it. Secret content needs the `none` level. A change of level never takes a file that git already tracks out of git history. See [12 Source Intake and Conversion](12-source-intake-and-conversion.md).
- **Built-in conversion covers seven file types.** The CLI converts docx, xlsx, pptx, pdf, csv, md and txt. Other file types need an agent or a manual step. Built-in pdf and pptx conversion may lose detail compared with outside tools. A complex pdf can take the guided agent route instead, and a person reviews its text before extraction. See [12 Source Intake and Conversion](12-source-intake-and-conversion.md).
- **Some clients forbid Git LFS.** By default, originals of 50 MB or more that git tracks go through Git LFS, with rules in `blueprint/sources/.gitattributes`. Where a client does not allow Git LFS, the project changes the size limit and keeps large originals in plain git, or keeps them out of git with the `converted` or `none` git level. See [12 Source Intake and Conversion](12-source-intake-and-conversion.md).
- **Hand edits are found, not prevented.** People can edit record files by hand. `project check` finds bad edits but cannot stop them. See [10 Records and Identity](10-records-and-identity.md).
- **Make Docs links are not confirmed yet.** Until Make Docs ships one read command with JSON output that confirms work item IDs and doc paths, `project check` skips Make Docs links and says how many it skipped. The skip is temporary and is tracked as obligation [O-001](03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check), a deferred obligation (owed work with a stable number). When `make-docs` is not installed, `project check` also skips these links. See [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- **Claude Code mods are out of the release plan.** A future mod would draw its own elements and get its data from the same view-model calls through the Make Blueprint MCP server. See [18 Local Server and UI](18-local-server-and-ui.md).
- **Two CLIs, not one.** Make Blueprint and Make Docs keep separate CLIs. The shared core keeps one merged CLI possible later.
- **Three agent tools.** v2.0 supports Claude Code, Codex and GitHub Copilot CLI.
- **The fit-gap model rests on one example.** It generalizes from one strong capability-level fit-gap. A comparison with several baseline systems is its first real test. See [14 Fit-Gap and Placement](14-fit-gap-and-placement.md).

Open questions and risks for these limits live in [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, sections 8, 10, 14 and 15; Consequences: trade-offs and risks)
- `blueprint/runs/`
- `blueprint/playbooks/`

## Source Anchors

- `README.md`
- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/09-v1-import-and-release.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/01-product-overview.md`
