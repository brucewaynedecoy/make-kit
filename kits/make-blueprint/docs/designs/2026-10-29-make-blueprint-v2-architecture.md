---
title: "Make Blueprint v2 Architecture"
kind: "design"
status: "draft"
follow_on:
  route: "change-plan"
  next_prompt: "make-docs://system/prompt/designs-to-plan-change.prompt.md"
  why: "The W1 R0 plan and PRD set exist; the monorepo move and the open-question answers revise them."
  coordinate_handoff: "Revises W1 R0 (plan .make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/); recommended downstream coordinate W1 R1."
---

# Make Blueprint v2 Architecture

## Purpose

This design records the architecture for BuildOS v2, which is renamed Make Blueprint. It captures the decisions reached in a structured design interview held on 2026-10-28 and 2026-10-29. It exists so planning can start from one agreed shape instead of from the cracks in the first-generation system.

The design covers the product boundary, names and folder layout, agent instruction files, the runtime and shared core, the CLI and MCP surfaces, storage, identity, the data model, the workflow and skills, the relationship with Make Docs, exports, the UI, and the release order. It does not define the CLI command list, the MCP tool list, the skill set, or the shared-database setup. Those items are listed under [Consequences](#consequences) as work for planning or for a later design.

## Context

### What BuildOS is

BuildOS v1 (the `build-os` repository) is a folder-based system where people and agents collect sources such as files, notes and transcripts, and turn them into structured records about the current and planned states of one or more systems. Records trace back to their sources and forward to planned work. Agents read and reason over those records.

### Field use so far

- **Client A.** BuildOS compared a first-party Dynamics 365 FO rental solution with a custom CE solution. It worked well. A separate agent, working from a plain prompt with no BuildOS guidance, also produced a strong capability-level fit-gap. That fit-gap is the model for the fit-gap record in this design.
- **Client B.** This project has many more systems, legal entities and project scopes. It showed the need for guided bulk extraction. The experimental `buildos-bulk-extract` skill grew to one Python script of 1,434 lines with 2 stages, 15 steps, staging files and two review formats. At the time of this design, 33 of 280 sources were processed, about 560 requirements, capabilities and findings were published, and the original files took 226 MB.
- **Client C.** This engagement is about to start a fit-gap of the Client A vendor module against the client's existing systems, plus a roadmap and an initial feature-level backlog. It runs on v1.

### v1 facts that shape this design

- Install is a manual copy of a `system/` package. There is no installer and no upgrade path.
- There are four separate Go CLIs. The unified `buildos` CLI is only a seed. There is no MCP server and no UI.
- Canonical records are JSONL files in `.os/data/`, with JSON indexes in `.os/indexes/`, Markdown folders for runs and findings, and YAML config. Systems are config entries, and sources live in one index file. There is no backlog record; the backlog lives in Make Docs `docs/work/`.
- Writes are atomic per file, but there are no locks across files.
- A fresh project (client-c-implementation) carries 19 skills. 18 of them have no source in the `build-os` repository, and they overlap heavily.
- Make Docs was bolted onto v1 because it was the easiest way to ship both tools.
- v1 design docs already proposed one binary with a headless core, a CLI and an MCP server, files as the truth with SQLite derived from them, and Go after a runtime benchmark. Those docs are input to this design, not authority over it.

### Make Docs facts that shape this design

- Make Docs is a TypeScript CLI, published to npm as `@brucewaynedecoy/make-docs` with the binary `make-docs`. It needs Node 24 for the built-in `node:sqlite` module.
- Its top-level command groups are `setup`, `project`, `resource`, `run <domain> <verb>`, `mcp`, `update` and `uninstall`.
- Its global Store lives in `~/.make-docs/` and holds operational state only. Project knowledge stays in the repository.
- It runs one stdio MCP server, filtered by `--profile` (`core`, `setup`, `workflow`, `quality`, `backlog`, `all`). Write tools need `allowWrite`.
- The CLI serves system docs (contracts, templates, references, prompts). A local copy in the project is optional.
- It writes managed blocks between `<!-- make-docs:begin -->` and `<!-- make-docs:end -->` into `AGENTS.md` and `CLAUDE.md`. The Store keeps a hash of each block. Edits inside a block raise a conflict, and broken or doubled tags stop setup. Its PRD 15 says uninstall removes a clean block, but the code keeps the whole file when the file has user text.
- Its backlog review UI is an MCP App view (an HTML resource served by the MCP server).
- Some of its skills still ship Python. Moving that logic into the CLI is on the Make Docs roadmap.

### Other constraints

- Enterprise client machines may forbid arbitrary Python or other scripts.
- Some clients want their data centralized and protected, not stored in git.
- One owner holds both products and wants them to follow one ecosystem pattern.
- Claude Code mods are plugins whose JS or TS hook code returns trees of fixed elements that each app draws. They do not render HTML or CSS. They can call MCP servers that their manifest lists, and their API can change between releases.

## Human Experience Intent

Impact: `direct`

Affected humans: `user` people and agents, such as consultants, architects, product owners and stakeholders who add sources, review records and read fit-gap results, and the agents that act for them; and `maintainer` people and agents who build, install, operate and upgrade Make Blueprint and Make Docs.

Human goal or effect: A person can turn a pile of client sources into trusted, traceable records and a fit-gap they can share. They do this from their agent tool, on a locked-down machine if needed, without learning the storage internals and without fighting a second tool.

Experience promises:

- A person installs Make Blueprint alone, Make Docs alone, or both. When both are installed, agents hand off between them with no extra setup.
- On a machine that allows no Python, a person installs one signed file, and every skill works.
- A person follows any record's evidence link to the exact place in its source. They see a clear flag when the source changed after the link was made.
- A reviewer reads a record change as a normal git diff of one Markdown file.
- A person who writes their own text in `AGENTS.md` or `CLAUDE.md` keeps that text through setup, update and uninstall of either tool.
- A person sees project state from one status command: sources, extraction progress, drafts waiting for review, broken links and ref clashes. The output names the next useful action.
- When two branches create the same friendly ref, `make-blueprint check` names the clash, and one command fixes it. The old ref still finds the record.
- A consultant exports a fit-gap CSV and an xlsx workbook that a client can open without Make Blueprint.

Complexity kept out of the human path:

- Random permanent IDs, the SQLite index, locks, the write journal, schema versions, block hashes and Store internals.
- Which MCP profile holds which tool, and how a storage backend works.
- The difference between setups A, B and C during daily record work.

Evidence required:

- Install tests on a fresh project for Make Blueprint alone, Make Docs alone and both together, including handoff lines that appear and disappear when the other tool comes or goes.
- An install and a full-workflow run on a machine or container with no Python and no Node.
- Round-trip tests for instruction files with user text above, between and below both tools' blocks, through setup, update, conflict and uninstall.
- A two-branch merge test where both branches create records, and the ref clash is found and fixed by command.
- A v1 import test on fixtures shaped like client-c-implementation and client-b-v3.
- A fit-gap export test that reproduces the column set of the example fit-gap.
- Human Experience Review of first-run setup, the status output and the review flow.

## Performance Evidence Candidates

| Candidate | Base maintenance action | Performance applicability | Protected outcome | Decision informed | Canonical owner or next record |
| --- | --- | --- | --- | --- | --- |
| Rebuilding and querying the local index from record files on a project the size of client-b-v3 (about 280 sources and several thousand records) | `create` | `characterize-now` | People and agents get status and query answers in file mode without waits that break their flow | Whether one file per record with a rebuilt index holds at that size, or needs incremental indexing | The baseline plan's storage phase, which creates the `PERF-###` profile |
| Start time of the compiled single-file CLI and MCP server | `create` | `characterize-now` | Agents can call the CLI many times in one task without slowing the work | Whether the TypeScript single-file build is acceptable, given that v1 chose Go after a runtime benchmark | The baseline plan's Step 0 or packaging phase, which creates the `PERF-###` profile |

## Decision

### 1. Northstar principles

These principles are fixed. When two decisions conflict, the first principle wins.

1. **Separate or together.** Make Docs and Make Blueprint install alone or together. When both are in one project, handoff and links between them work with no extra setup. Neither tool is bolted onto the other.
2. **Agent first.** The agent tool (harness) is the main way people use Make Blueprint.
3. **One folder.** In file mode, one project folder holds everything for a project.
4. **UI optional.** The UI is optional, and no task needs it.
5. **Traceable.** Every extracted fact links back to its source and forward to planned work.
6. **One install.** Make Blueprint needs one approved install. Skills ship no Python and no scripts; they call the Make Blueprint CLI or MCP server.

### 2. Setups

| Setup | Server | Where data lives | Release |
| --- | --- | --- | --- |
| A | None. The CLI and MCP server work directly on files. | Files in git | v2.0 |
| B | A small local server for each user | Files in git | v2.1 |
| C | A local server for each user | A shared database | v3, designed later |

- Setup A is the most common setup. The server is optional in file mode. A person starts it only for the UI or for setup C.
- More setups may come later. The storage interface (section 8) keeps them possible.
- In setup B, the local server listens only on the user's own machine and needs no login.
- Make Blueprint sends no telemetry (no usage data), like Make Docs.

### 3. Product boundary and names

- The product is **Make Blueprint**, and its CLI is `make-blueprint`. It replaces BuildOS. It is a separate product from Make Docs.
- The two products share one TypeScript package, `packages/core` (section 6). They do not share one CLI for now, but the shared core keeps that option open.
- v2 is a clean room. It is new code in this repository. The `build-os` repository is reference only; we copy ideas, and we copy code only after a deliberate review.
- Make Blueprint does not own the backlog. The backlog stays in Make Docs `docs/work/` (section 12).

### 4. Project and machine layout

```text
<project>/
  AGENTS.md, CLAUDE.md          shared routers with tagged blocks (section 5)
  .make/
    config.yaml                 choices shared by every kit, such as agent tools
    AGENTS.md, CLAUDE.md        shared router for both tools
    blueprint/                  Make Blueprint config and project state
    docs/                       Make Docs system files, after its own move
  blueprint/
    sources/                    original files and converted text
    records/<type>/<id>.md      one Markdown file per record
    runs/                       run notes and evidence files (v2.2)
    playbooks/                  playbooks (v2.2)
    exports/                    generated files, never the truth
  docs/                         Make Docs content

~/.make/
  blueprint/                    Make Blueprint machine-level Store
  docs/                         Make Docs machine-level Store, after its own move
```

- System docs (contracts, templates, references and prompts) are served by the CLI through `make-blueprint resource read`. A local copy in the project is optional, as in Make Docs.
- Each product keeps its own Store database in its own folder under `~/.make/`. They share nothing else there for now.
- Make Docs moves from `.make-docs/` to `.make/docs/`, and from `~/.make-docs/` to `~/.make/docs/`, in its own release. Make Blueprint does not wait for that move.

### 5. Agent instruction files

- Make Blueprint writes its content between `<!-- make-blueprint:begin -->` and `<!-- make-blueprint:end -->`. Make Docs keeps `<!-- make-docs:begin -->` and `<!-- make-docs:end -->`. The tag name is the CLI name.
- The block code moves into `packages/core`. Each tool passes its own tag names. Each tool changes only its own block, and never the other tool's block or the user's text.
- A missing block is added at the bottom of the file. The existing order of blocks is kept. User text can sit above, between or below the blocks.
- Make Blueprint writes only the instruction files for the selected agent tools: `CLAUDE.md` for Claude Code, and `AGENTS.md` for Codex and GitHub Copilot CLI, like Make Docs. Every file that carries the block gets the same block content. It does not use `@AGENTS.md` imports for now.
- Make Blueprint writes routers in the project root, in `.make/`, in `.make/blueprint/`, and in `blueprint/` and its v2.0 sub-folders (`sources/`, `records/` and `exports/`). `runs/` and `playbooks/` arrive with v2.2.
- Each tool's root block says what that tool owns. When the other tool is also installed, the block adds one short handoff line, such as "Make Docs owns `docs/`". When a tool is set up or removed later, its setup or uninstall asks the other tool, through the core, to refresh only that tool's own root block. If the other tool is too old to do this, the setup output and `project status` name the one command to run. The next setup drops a stale line. Make Docs needs the same change.
- The Store keeps a hash of each block. If a person edits inside a block, setup offers to reassert the tool's version or keep the local version. Broken or doubled tags of either tool stop setup, change nothing, and name the file and the line to fix.
- Project uninstall (`setup remove`) removes only the tool's own block and keeps the user's text. It asks before it removes a block that a person edited, and keeps that block when it cannot ask. It deletes a file only when nothing is left in it. Tool uninstall (`uninstall`) removes the tool from the machine and never touches a project. Through the core, Make Docs gets the same fix, which also brings its code in line with its PRD 15.

### 6. Runtime, shared core and distribution

- Make Blueprint is written in TypeScript, like Make Docs.
- The shared core lives in `packages/core/` of the `make-kit` monorepo, and Make Blueprint lives in `kits/make-blueprint/` of the same repository (see [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md)). The core is published as `@brucewaynedecoy/make-core`, and each Make Blueprint release pins one exact core version.
- The core holds layout and path handling, resource reading, the MCP server and its profiles, the base of the Store, agent-tool setup (installing skills and writing MCP config), managed blocks, and `update` and `uninstall`. Records and storage stay in Make Blueprint.
- Make Blueprint ships on npm as `@brucewaynedecoy/make-blueprint`, like Make Docs. It also ships as signed single-file downloads for macOS (Apple silicon and Intel), Windows (x64) and Linux (x64 and arm64), so a client does not need to install Node. Windows on arm64 comes later.
- It supports the same agent tools as Make Docs: Claude Code, Codex and GitHub Copilot CLI.
- Skills ship inside the CLI package, and `setup` installs them, like Make Docs.

### 7. CLI and MCP

- The CLI has the same top-level groups as Make Docs: `setup`, `project`, `resource`, `run <domain> <verb>`, `mcp`, `update` and `uninstall`.
- There is one stdio MCP server with these profiles:

| Profile | Tools for |
| --- | --- |
| `core` | Reading records, search, status and resources |
| `setup` | Project and agent-tool setup |
| `intake` | Adding and converting sources |
| `extract` | Extraction and review |
| `analyze` | Model, compare and place |
| `all` | Every tool (the default) |

- Write tools need `allowWrite`, like Make Docs.
- The CLI and MCP share one filter syntax. It filters records by type, field, facet, status and link. For hard questions, a person or agent can run read-only SQL on the local index.

### 8. Storage

- There is one data model and one storage interface. The interface has two backends: files and a database. v2.0 ships only the file backend. The database backend comes with setup C in v3, and the interface is built so that backend can plug in.
- In the file backend, each record is one Markdown file with YAML front matter (a block of fields at the top of the file). The file lives at `blueprint/records/<type>/<id>.md`. Files are named by `id`, because `ref` can change.
- The files are the truth. A local SQLite index is built from them for fast queries. Git does not track the index, and `make-blueprint` can rebuild it at any time.
- Normal writes go through the CLI or MCP server. People can also edit a record file by hand, and `make-blueprint check` finds bad hand edits.
- The CLI takes a short lock when it makes a `ref` or updates the index. A change to many records at once, such as approving a review, writes a small journal first. After a crash, the CLI uses the journal to finish or undo the change.
- Each record file carries a schema version. Running `make-blueprint setup` again in a project upgrades old records. `make-blueprint update` updates only the tool, like Make Docs.

### 9. Identity

Every record has two IDs.

| Field | Example | Meaning |
| --- | --- | --- |
| `id` | `REQ-7kq2m` | A type prefix plus a short random code. It is permanent, it names the file, and every link uses it. Two branches or two database users never make the same `id`. |
| `ref` | `REQ-042` | A friendly counter for people. If two branches make the same `ref`, `make-blueprint check` finds the clash, and a fix command gives one record a new `ref`. The old `ref` stays as an alias, so it still finds the record. |

### 10. Data model for v2.0

Every record has `id`, `ref`, `type`, `title`, `status`, a summary, evidence links, links to other records, facet values, aliases and a schema version. Status is one of `draft`, `active`, `rejected`, `superseded` or `archived`.

| Record type | Purpose and key fields |
| --- | --- |
| Source | One original file. It has a location type (`repo` or `local`), the file hash, the converted text, a conversion status and an extraction status. |
| System | One system in scope, such as a current client system or a target product. It holds the status list that its capabilities use. |
| Domain | One entry in the project's shared domain list, such as the 15 layer codes in the example fit-gap. Domains let people compare and group across systems. |
| Capability | Belongs to one system. It has a parent capability (so capabilities form a tree), a status from its system's status list, and a domain. |
| Requirement | Belongs to one capability. It has a kind: setting, rule, behavior, data or dependency. |
| Persona | A role that uses one or more systems. |
| Finding | An observation, gap, risk or question found in sources or analysis. |
| Extraction | One pass over one source. It records what was covered in each part of the source and what came out of it. |
| Comparison | Names one target system and one or more baseline systems. One project can hold more than one comparison. |
| Fit-gap | Belongs to one comparison. It compares one baseline capability with the target system and lists the target capabilities that cover it. |
| Placement | Linked to one fit-gap record. It records which system owns the capability, how it is delivered, and the Make Docs work items it leads to. |

Fit-gap fields:

- **Verdict:** `native`, `configurable`, `partial`, `unreleased`, `gap` or `target-only`. "Unreleased" replaces the example's "preview gap", so the word fits any vendor. Each target capability that no fit-gap record uses gets a `target-only` record.
- **Confidence:** `high`, `medium` or `low`.
- **Effort:** `none`, `low`, `medium`, `high` or `unknown`.
- **Gap detail** and **migration note** as text.
- **Evidence links** to sources. These are required, which fixes the one weakness of the example fit-gap.

Placement delivery values are `configure`, `extend`, `build` and `integrate`, applied to the owning system.

Other data model rules:

- **Facets.** A project can define named value lists, such as legal entity, release or scope. Any record can carry values from these lists. There are no custom record types in v2.0.
- **Evidence links.** Converted text gets stable anchors, one for each heading, paragraph or row. An evidence link is a source `id` plus an anchor, such as `SRC-4hd8x#p-012`. When a source file changes, `make-blueprint check` flags links that point to the old version.
- **Original files.** Originals live in git under `blueprint/sources/`. Large files use Git LFS (a git add-on for big files) when the client allows it. Each source record keeps the file hash, so a file can also live somewhere else.
- **Local-only sources.** A `local` source links to a file outside git, and git ignores that link. On a machine without the file, the source shows as "missing", not as an error. The location field is in the v2.0 data model; full `local` handling is a nice-to-have that can come later.
- **Later record types.** Test case, run, result and playbook come in v2.2.

### 11. Workflow and skills

The workflow has seven stages:

| Stage | What happens |
| --- | --- |
| Intake | Add sources and convert them to text. |
| Extract | Turn one source at a time into draft records. |
| Review | Make draft records `active` or `rejected`. |
| Model | Clean up systems, capabilities and domains. |
| Compare | Create fit-gap records inside a comparison. |
| Place | Create placement records. |
| Hand off | Link placements to Make Docs work items and docs. |

- **Conversion.** The CLI converts docx, xlsx, pptx, pdf, csv, md and txt files with code built into the CLI. The converted text sits next to the original. Other file types need an agent or a manual step.
- **Extraction.** The unit of work is one source. `run extract next` hands out the next source. An extraction record tracks coverage and outcome for each part of the source. Before it creates a new record, the CLI shows possible duplicates. New records start as `draft`.
- **Review.** A review step makes each draft `active` or `rejected`. There is no separate staging folder. A second reviewer is optional, and each project turns it on or off.
- **Skills.** Each stage gets one skill, so every skill owns one clear job. Skills are designed after the CLI command list exists. Each skill is a thin guide that calls commands and ships no scripts. The 18 old skills are reviewed only to find which jobs to keep; none is ported.
- **Bulk extraction** is part of the v2 core. It is designed fresh from the needs above, not ported from `buildos-bulk-extract`.

### 12. Relationship with Make Docs

- The backlog stays in Make Docs `docs/work/`. Make Blueprint records link forward to it.
- Make Blueprint records store Make Docs work item IDs and doc paths. When `make-docs` is installed, `make-blueprint check` confirms those links. When it is not installed, the check skips them.
- The v1 Azure Boards export moves to Make Docs, because Make Docs owns the backlog.
- This design needs these Make Docs changes, which now happen inside the `make-kit` monorepo: moving shared code into `packages/core`, the move to `.make/docs/` and `~/.make/docs/`, the handoff line in its root block, and the uninstall fix for managed blocks.

### 13. Exports

- v2.0 exports a fit-gap detail CSV, summaries by verdict and by domain, capability and requirement CSVs for each system, and one xlsx workbook that holds all of them.
- Exports go to `blueprint/exports/`. A command makes them again at any time. They are never the truth.

### 14. UI

- In v2.1, the web app that `make-blueprint serve` starts comes first. MCP App views come next. Both use the same Svelte view code.
- The first UI version is for viewing, sorting and filtering. Editing comes later.
- Each view gets a view model: one CLI or MCP read call that returns the rows and totals that the view shows. The web app, the MCP views and any future client use that call.
- Claude Code mods are out of the release plan for now. A future mod would draw its own elements and get its data from the same view-model calls through the Make Blueprint MCP server.

### 15. Release plan and v1

| Step | Content |
| --- | --- |
| Step 0 | Repo-wide work in the `make-kit` monorepo: copy Make Docs in, pull the shared core out into `packages/core/`, and pass the Make Docs switch point. The `make-kit` setup tool follows. See the [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design. |
| v2.0 | Setup A (file mode), the CLI, the MCP server, skills, conversion, extraction and review, the v2.0 record types, exports and the v1 import. |
| v2.1 | Setup B (local server), the web app, then MCP App views. |
| v2.2 | Test case, run, result and playbook records. |
| v3 | Setup C (shared database). Its database type, logins, permissions and file storage are designed at that time. |

- v1 gets bug fixes only, for Client C. It gets no new features.
- v2.0 ships a one-time import command for v1 projects. Client C uses it to move to v2. v1 IDs such as `REQ-001` become `ref` values, so people keep the names they already know.

### 16. Decisions from the open-question review (2026-10-30)

The owner settled these items from the PRD risk register. They update the sections above where the wording differs, and the W1 R1 change plan carries them into the PRDs.

- **Q-001 core boundary.** The core holds layout and paths, resources, the MCP server and profiles, the Store base, agent-tool setup, managed blocks, tool discovery, and `update` and uninstall, with no product content. It now lives in the `make-kit` monorepo, and Step 0 is repo-wide work.
- **Q-002 handoff refresh.** A tool set up or removed later asks the other tool, through the core, to refresh only that tool's own root block (section 5).
- **Q-003 two kinds of uninstall.** `setup remove` takes Make Blueprint out of one project and keeps all records. `uninstall` removes the tool from the machine, never touches a project, and deletes `~/.make/blueprint/` only with an extra flag.
- **Q-004 edited block at uninstall.** Uninstall asks before it removes an edited block and keeps it when it cannot ask.
- **Q-005 broken tags.** Broken tags of either tool stop setup and change nothing.
- **Q-006 single-file targets.** macOS on Apple silicon and Intel, Windows on x64, Linux on x64 and arm64; Windows on arm64 later. Work phase 02 proves them first.
- **Q-007 and Q-008 commands.** The command catalog in PRD 08 is the command list. Where this design says `make-blueprint check` or "status", it means `make-blueprint project check` and `make-blueprint project status`.
- **Q-009 update.** `update` updates only the tool. Running `setup` again updates the project, including blocks, routers, skills, handoff lines and record upgrades.
- **Q-010 exit codes.** 0 success, 1 partial, 2 failed, 3 blocked. Skills read the `outcome` field.
- **Q-011 source folders.** Work phase 02 fixes the source code folders, then PRD 02 names the module paths.
- **Q-012 names.** Project config `.make/blueprint/config.yaml`; conflict copies in `.make/blueprint/conflicts/`; npm packages `@brucewaynedecoy/make-blueprint` and `@brucewaynedecoy/make-core`; `MAKE_BLUEPRINT_HOME` moves `~/.make/blueprint/`.
- **Q-013 core pin.** Each release pins one exact core version and fails on a local or unpublished core.
- **Q-014 system docs.** PRD 08 owns `resource` and the `make-blueprint://system/<type>/<path>` scheme; PRD 06 owns the optional local copy in `.make/blueprint/system/`.
- **Q-015 v2.0 folders.** `sources/`, `records/` and `exports/` in v2.0; `runs/` and `playbooks/` in v2.2.
- **Q-016 instruction files.** Only the files for the selected agent tools (section 5).
- **Shared setup choices.** Every kit shares `.make/config.yaml` for choices such as the selected agent tools. A kit set up later reads it, so earlier choices are already selected. Settings for one kit stay in `.make/<kit>/config.yaml`.
- **Q-017 working state.** The index, write lock and write journal live in `~/.make/blueprint/`, keyed by project ID and checkout, never in the project folder.
- **Q-018 `id` length.** The random part is 8 lowercase letters and digits with at least one letter, for example `REQ-7kq2m4xa`. Shorter examples in this design are illustrative.
- **Q-019 ref clashes.** The record created first keeps the `ref`; the other gets a new one and keeps the old one as an alias.
- **Q-020 safe writes.** Setup B is setup A plus one local server. Each checkout has one short write lock shared by the CLI, the MCP server and the local server. Every write also checks the record version it read, stale locks clear themselves, a busy writer gets a `blocked` result after a short wait, and large approvals run in batches.
- **Q-021 no delete.** v2.0 has no delete command; records leave use through `archived` or `superseded`.
- **Q-022 schema authority.** PRD 11 owns the record fields, PRD 10 the facet format and PRD 12 the anchors.
- **Q-023 doc links.** Any record type can link to Make Docs doc paths. A path can point to any Make Docs doc, such as a design, plan, PRD, work item or guide; PRDs are one example, not a limit.
- **Q-024 Make Docs link checks.** Make Docs gets a read command that confirms work item IDs and doc paths. Until it ships, `project check` skips those links and says how many, tracked as obligation O-001 in the Make Blueprint register.
- **Q-025 hand-off.** Make Blueprint only links to Make Docs work items; Make Docs creates them.
- **Q-026 anchor marker.** Converted text marks each element with `<a id="p-012"></a>` at its start. This applies only to Make Blueprint converted sources. Make Docs product docs do not use it, and any later move to do so needs its own deliberate design decision.
- **Q-027 anchor numbering.** One counter per kind (`h`, `p`, `r`), at least three digits, and parts by file type. How CSV tables are converted and linked is Q-061.
- **Q-028 sources kept out of git.** One project setting has three levels: `all` (originals and converted files in git, the default), `converted` (originals stay on the machine, converted files in git) and `none` (both stay on the machine). Each source can override it. Files kept out of git keep their normal paths under `blueprint/sources/` and are listed in a Blueprint-managed `blueprint/sources/.gitignore`, with no symlinks. A file that is not on a machine shows as missing. All three levels ship in v2.0. Converted text holds the same words as the original, so secret content needs `none`, and a new level never removes a file from git history.
- **Q-029 Git LFS.** Originals of 50 MB or more use Git LFS by default, with rules in `blueprint/sources/.gitattributes`. Each project can change the limit.
- **Q-030 sources.** Source records are `active` from creation, with no review.
- **Q-031 second reviewer.** When `review.second_reviewer` is on, the approver must not be the person in `extracted_by`. It is off by default and covers extraction drafts only.
- **Q-032 fixing an active record.** A fact on an active record is fixed in place. Someone proposes a pending change on the same record; the record keeps its old value until review; an approved change is written into the same file, so the `id`, `ref` and links stay the same and git history keeps the old value; a rejected proposal keeps its reason. `run record supersede` is only for real replacements, such as one requirement split into two. Where pending changes are stored and which commands review them is designed before work phase 06 ends.
- **Q-033 duplicate hints.** `run record create` shows duplicate hints with the same check as extraction.
- **Q-061 CSV tables.** Each original keeps one main converted Markdown file. Each extracted table gets a table anchor such as `t-001` and its own CSV file, `<original>.t-001.csv`, which the Markdown file links to. Spreadsheet sheets and CSV originals always become CSV files; a table in a document becomes one only above a size threshold. Links use positions: `#t-001` (table), `#t-001:r-0012` (row), `#t-001:c-003` (column) and `#t-001:r-0012:c-003` (cell), with the header row not counted.
- **Q-034 analysis drafts.** Compare, `target-only` generation and place create drafts, and the review commands make them `active` or `rejected`.
- **Q-035 comparison scope.** In v2.0 every active baseline capability, parents included, gets a fit-gap record. Scoping by facet comes later.
- **Q-036 native fits.** A `native` fit takes delivery `configure` with effort `none`.
- **Q-037 workbooks.** One workbook for each comparison, with one sheet per export and an `about` sheet. The full export set is Q-062.
- **Q-038 CSV rules.** UTF-8 with a byte order mark, commas, RFC 4180 quoting and LF line endings, for exports and converted CSV files alike.
- **Q-039 formula-like text.** CSV values stay exact. The export output warns about values that start with `=`, `+`, `-` or `@` and points to the workbook, which writes them as text.
- **Q-040 exports in git.** Git tracks `blueprint/exports/`.
- **Q-062 export set.** Each system also gets `<system-ref>-capability-model.md` (a narrative document with numbered sections) and `<system-ref>-data-dictionary.md`, and each comparison gets `<comparison-ref>-data-dictionary.md`. Each capability CSV row carries its section number in the narrative document.
- **Q-063 repeatable exports.** The CLI builds every export file, prose included, from active records alone. All prose lives in reviewed records, a skill helps agents draft it, golden-file tests fix the shape, and an export check confirms every `id`, section number and count.
- **Q-064 detail fields.** Capabilities gain optional `capability_type`, `personas`, `triggers`, `outcomes`, `entities` and `depends_on`. Setting requirements gain optional `option_values`, `option_default` and `option_scope`. The exports carry them as columns.
- **Q-065 fit-gap method.** The CLI hands out baseline capabilities one at a time and tracks progress. Agents mark each requirement met, partly met or not met, with evidence, and the verdict follows from the marks under a written rubric. Each verdict has required fields, a target-only pass follows, and consistency checks flag records for review first.
- **Q-065 grain and marks (owner addendum).** The grain stays the capability: PRD 14 keeps "The grain is the capability, not the requirement." and adds "The verdict is backed by a mark for each baseline requirement." The v1 example had one row per baseline capability, and requirements never join across systems, because they come from different sources at different levels of detail. Each mark is about one baseline requirement only and answers "Does the target meet this?" Its evidence points at target capabilities or sources, never at target requirements. The marks are a list inside the fit-gap record; they support the verdict and are not a new grain. Marks are required on every baseline requirement for every verdict, `native` and `configurable` included, because a wrong `native` verdict costs the most. Each mark is one value plus evidence.
- **Q-066 mark values and verdict table.** A mark is `met` (as shipped), `configured`, `unreleased`, `partly` or `not-met`. All `met` gives `native`; all `met` or `configured` with at least one `configured` gives `configurable`; all `met`, `configured` or `unreleased` with at least one `unreleased` gives `unreleased`; all `not-met` gives `gap`; anything else gives `partial`. A capability with no requirements of its own gets one mark for the whole capability. A `not-met` mark carries a short note on where the agent looked.
- **Q-067 candidates.** Candidate target matches and the similar-capabilities check use the index text search, with the same matching as duplicate hints. No embeddings or network services in v2.0.
- **Q-068 out-of-date marks.** A fit-gap record keeps the version of each requirement it marked. Changed requirements make `project check` flag the record, and the hand-out command gives the capability out again.
- **Q-069 mark exports.** `<comparison-ref>-fit-gap-requirements.csv` and a workbook sheet show every mark. The exports also gain a gap list for each requirement, counts for each capability such as "6 of 8 met" in the workbook and the capability model document, and the check that flags a verdict that does not match its marks.
- **Q-041 MCP profiles.** PRD 08's profile lists stand, and the review approve and reject tools also sit in `analyze`, because analysis drafts use the same review.
- **Q-042 skills.** The seven stage skills keep their names, and `blueprint-report` joins them: it drafts export prose into records and runs the exports, so `blueprint-compare` only scores.
- **Q-043 to Q-047 v1 import.** v1 review files merge into extraction records, open notes become draft `question` findings, staged rows become drafts and staged updates become pending changes. The import keeps v1 converted text, writes into the same folder without touching v1 files, keeps v1 names as aliases, never guesses a parent link, applies only four stated defaults, and is also an MCP tool behind `apply: true` and `allowWrite`. Whether the import ships in v2.0 is open as Q-071.
- **Q-049 `serve`.** A top-level `serve` command beside `mcp`, reserved in the core for both tools.
- **Q-048 persona records and Personas.** Persona records and Make Docs Personas are related, not separate: a client role can also be an audience for the project's docs. Each persona record points to its slug in the shared people and roles file (Q-072), which replaced the earlier `docs_persona` field. "Persona record" means the Make Blueprint type and "Persona" the Make Docs role.
- **Q-071 Client C.** v2.0 cannot be ready by 2026-11-03, so Client C starts on v1 and moves to v2 through the v1 import, which stays in v2.0.
- **Q-070 people and role fields.** Each kind of link has its own field. `owners` lists the `maintainer` entries responsible for a record, with one owner as a list of one. `stakeholders` lists `maintainer` entries that have a stake but are not owners, never the same entry as `owners` on one record. `audience` lists `user` entries on capabilities and requirements and replaces the `personas` field from Q-064. The parent link keeps the field names `system` and `capability`, because a capability's `parent` already names its parent capability.
- **Q-072 shared people and roles file.** One shared file, `.make/personas.yaml`, holds people and roles for every kit. The core reads and writes it; each kit only reads it. Each entry has a slug, a name, a primitive (`user` or `maintainer`, either a person or an agent), a kind (`person`, `team` or `agent`) and the kits it is enabled for. Client roles found in sources stay persona records with evidence and review, each pointing to its slug, and the core adds the entry when the record is approved. Make Docs' own Persona list moves into the same file, a Make Docs change made in the monorepo (see the [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design). Separate lists for each kit were not chosen, because they drift apart.
- **D-011 project name.** An optional project `name` sits in the shared `.make/config.yaml`. `project status` shows it, exports use it in titles, and the v1 import fills it from `instance.name`.
- **Q-058 placement export.** v2.0 adds `<comparison-ref>-placements.csv` and a workbook sheet. Setting options are covered by Q-064.
- **Deferred items.** Q-050 to Q-056 and Q-059 stay deferred, confirmed by the owner. Q-051's first v2.1 views now include requirement marks and flagged records first.
- **Q-073 integration records.** v2.0 adds an `integration` record type (`INT`). One record is one flow in one direction, from `from_system` to `to_system`, with optional capabilities on each side, a payload, a trigger, a frequency, a method, a `current` or `planned` state, the current integrations a planned one `replaces`, an effort, evidence and doc links. Current integrations come from extraction; planned ones come from analysis as drafts. The coverage read lists current integrations that touch a baseline system and have no replacement. Exports add an integrations CSV, a workbook sheet, a data dictionary entry and an integration part in each capability model document.
- **Q-057 placements that integrate.** A placement with delivery `integrate` links its integration records in an `integrations` field. No `partner_systems` field is added.
- **Deferred: mapping and diagrams.** Field-level mapping files are Q-075. Diagrams are Q-074: an agent pointed at Eraser Diagrams and flow data already draws good diagrams, and a later optional skill adds guidance on detail and diagram type.
- **Q-080 complex PDFs.** A guided agent route converts complex PDFs; the CLI gets no PDF libraries. It runs only for PDFs, when the built-in converter reports a table, a scanned page with no text layer or a complex layout, or when a person asks. The CLI hands out a few pages at a time and tracks them. The agent writes Markdown for prose and CSV for tables, one CSV file per level of a nested table, joined by a key column, and keeps links and footnotes. The CLI adds the anchors, confirms page coverage and, where a text layer exists, flags missing or invented numbers and words. The source record names the converter `agent`, with the model name and the date. Agent conversions are reviewed like drafts, flagged pages first; built-in conversions still skip review. A drafting skill guides the route. Page splitting, text-layer checks, anchors, hashes and change detection stay deterministic.
- **Q-080 details.** The source record stays `active`. `conversion_status` takes `agent-in-progress` while page batches are out and `awaiting-review` when every page is written, and extraction waits for `converted`. The same-text rule covers built-in converters only: accepted agent text is kept, and is made again only when a person asks or the original changes. The CLI hands out page numbers and the agent reads the pages with its own tool; when that tool cannot read a page range, the CLI writes a small page-range PDF to `~/.make/blueprint/`, never to git. Pages with no text layer are marked "unchecked" and shown first in review. A ninth skill, `blueprint-convert`, guides the route and serves the intake stage. Where page progress is kept is left for work phase 05.
- **Q-076 mark versions.** A requirement mark keeps a content version: a hash of the fields that carry the requirement's meaning (`title`, `summary`, `kind`, the setting option fields and the body). Tags, facets, people fields, links, evidence, timestamps and schema upgrades do not change it. The record version stays for safe writes.
- **Q-077 people file rules.** The core creates `.make/personas.yaml` on its first write, and the built-in `user` and `maintainer` entries stay implicit. Slugs are unique across the file, and a clash blocks the write. An entry stays when its persona record is archived or superseded. An approved persona claims an unclaimed `user` entry with its slug. The core's write joins the same journaled change. Entry kinds are `person`, `team`, `organization` and `agent`. `extracted_by` and `reviewer` take a `maintainer` slug when one exists. The v1 import adds an entry for every owner slug it writes.
- **Q-078 built-in lists.** 11 lists the built-in codes of `capability_type`, `option_scope` and integration `method`. A project adds its own codes with `lists.capability_type`, `lists.option_scope` and `lists.integration_method` in `.make/blueprint/config.yaml`.
- **Q-079 integration rules.** A planned integration reaches the fit-gap record that calls for it through the placement. Every capability that a requirement mark names is also in `covering_capabilities`.
- **R-024 hand-copied files.** At the levels `converted` and `none`, the managed `blueprint/sources/.gitignore` ignores originals by pattern and lists only the files to keep, so a file copied in by hand is ignored at once.
- **Q-081 second reviewer.** The second-reviewer rule does not apply to agent conversions in v2.0.
- **Q-082 unregistered files.** `project check` reports each file in `blueprint/sources/` that no source record names, with the Information code `source-unregistered` and `run source add` as the next action.
- **Evidence converter.** Each `evidence_versions` entry keeps the source's `converter`, so agent text that replaces built-in text flags old evidence links.
- **Q-083 git level changes.** A source's git level changes at once, not through review: `run source add --git-level <level>` and `run source set-level <source>... <level>` write the record and the managed `.gitignore` in one journaled change.
- **Q-084 small defaults.** `run model move --top`, `--map-status` on merges and status list changes, `--include-drafts` on exports, `run compare create` makes an `active` comparison, `run record create` refuses types that have their own create command, `run place link` also links integration records, a missing handoff line points to the Make Docs update and `setup` again, and bare `make-blueprint` never offers setup.
- **D-012 backlog fixes.** Seven PRD disagreements found while writing the work backlog are fixed, as the register lists.
- **Q-085 to Q-095 system packages (2026-10-31).** One project can make a versioned bundle of one or more systems and their `active` records, and other projects take it in as a baseline. The [System Packages design](2026-10-31-system-packages.md) records the decisions. System packages are v2.1 and the new wave `W2 R0`. So the release labels in section 15 move: the local server, the web app and MCP App views are v2.2, and test records are v2.3. v2.0 reserves the `run package` domain and the `origin` field name.

## Alternatives Considered

| Alternative | Why it was not chosen |
| --- | --- |
| Refactor v1 in place | v1 has no installer, a different layout and four CLIs. A clean room avoids carrying its cracks forward. |
| One merged CLI for both products | Not needed now. The shared core keeps it possible later. |
| Put Make Blueprint inside the make-docs monorepo | It would blur the two products. The cost of the chosen option is that a core change needs a make-docs release first. |
| Go, as v1's runtime benchmark chose | It blocks code sharing with Make Docs. Start time is tracked as a performance candidate instead. |
| `.paper/` or `.buildos/` folder names | `.make/` matches the Make Docs name and is the final choice. |
| One JSONL file per record type, as in v1 | Two people adding rows to one file often clash in git, and diffs are hard to read. |
| A database as the truth in file mode | It would break git review and merge. The index is derived instead. |
| Build both storage backends at once | It doubles the hardest work. The interface keeps setup C open. |
| A server in every setup | It would make setup A heavier and the UI less optional. |
| Counter IDs only, or random IDs only | Counters clash across branches. Random IDs alone are unfriendly to people. |
| Fit-gap per requirement | Requirements do not link across systems. The capability grain worked in the example. |
| Only fit, partial and gap verdicts | Too coarse. The example needed native, configurable and unreleased as well. |
| A staging folder and a forced second reviewer | This was the main source of complexity in the old bulk-extract skill. Draft status does the same job. |
| Port the old skills or the bulk-extract script | They overlap and ship Python. Redesigning by stage gives clean jobs. |
| Separate MCP servers for each domain | One server with profiles gives each client a short tool list with simpler setup. |
| Plain HTML views, like Make Docs | Sortable and filterable tables grow quickly. Svelte compiles to small files. |
| Build mods from the Svelte views | Mods draw fixed elements and do not render HTML. Shared view models keep a mod possible. |
| Systems as config entries, as in v1 | Fit-gap needs links to systems, and the UI needs their fields. |
| Original files outside git by default | It would break the one-folder principle. Local-only sources remain an option. |

## Consequences

### What gets better

- Both tools follow one pattern for folders, routers, the Store, CLI shape and MCP profiles, so a person who knows one tool can use the other.
- Locked-down clients can approve one signed file. No skill needs Python.
- Record changes review and merge cleanly in git, and every fact can be checked back to its source.
- Fit-gap and placement become records that people and agents can query, trace and export, instead of agent prose.
- People keep their own text in instruction files.

### Trade-offs and risks

- **Step 0 on the critical path.** The monorepo removes the release delay between the core and Make Blueprint, but Step 0 and the other Make Docs changes in section 12 still sit on the critical path for v2.0.
- **Single-file packaging.** Shipping a Node 24 app that uses `node:sqlite` as one signed file for three operating systems must be proven early, including enterprise approval. v1 chose Go partly for this reason.
- **Conversion quality.** Built-in TypeScript conversion of pdf and pptx may lose detail compared with outside tools, and extraction quality depends on it. A new converter version can move anchors; `check` flags the affected links.
- **File count.** One file per record grows to thousands of files on large projects. The index must stay quick to rebuild (see the first performance candidate).
- **Git LFS limits.** Some clients may not allow Git LFS. Large originals then go in plain git or become `local` sources.
- **Two IDs.** Two IDs add one concept. People mostly see `ref`; `id` stays in the background.
- **Hand edits.** People can still break a record by hand. `check` finds the problem but cannot prevent it.
- **One example.** The fit-gap model generalizes from one strong example. Client C, with several baseline systems, is its first real test.
- **Interface without a second backend.** The storage interface is built before the database backend exists, so database needs may leak in late. Planning should test the interface against a second, simple backend.
- **Mods API.** The mods API may change between releases. Nothing in v2 depends on it.
- **Client C on v1.** Client C produces v1 data while v2 is built, so the v1 import must handle whatever Client C creates.

### Left for planning or a later design

- The CLI command list and the verbs for each `run` domain.
- The MCP tool list for each profile.
- The skill for each stage and its content.
- The front matter schema for each record type, the facet config format and the anchor algorithm.
- Where the local index lives. The proposed default is under `~/.make/blueprint/`, following the Make Docs rule that operational state stays out of project folders.
- The detailed v1 import mapping, including how `extractions/` files from the old bulk-extract skill are handled.
- The list of views for v2.1.
- The setup C design, for v3.

## Design Lineage

- Update Mode: `updated-existing`
- Prior Design Docs: this document as written on 2026-10-29, updated in place; related: [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md)
- Reason: The owner moved the project into the `make-kit` monorepo, which moves the shared core, Step 0 and the setup tool to the repository level, and settled open questions Q-001 to Q-016 plus shared setup choices (section 16). Sections 4 to 8, 12 and 15 were updated to match.

## Intended Follow-On

- Route: `change-plan`
- Next Prompt: [designs-to-plan-change.prompt.md](make-docs://system/prompt/designs-to-plan-change.prompt.md). Read `make-docs://system/prompt/designs-to-plan-change.prompt.md` with `make-docs resource read`.
- Why: A W1 R0 plan and an active PRD set already exist. The monorepo move and the answers in section 16 revise them, so planning maintains the existing PRD owners instead of starting a new baseline. Step 0 leaves this plan and moves to the repo-wide plan.
- Coordinate Handoff: Revises `W1 R0` ([plan](../../.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md)). Recommended downstream coordinate: `W1 R1`, because this corrects the same wave's plan before any work started.
