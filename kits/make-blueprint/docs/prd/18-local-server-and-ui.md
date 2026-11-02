---
title: "18 Local Server and UI"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 18 Local Server and UI

## Purpose

This PRD owns the optional local server and user interface of Make Blueprint. They are planned scope for v2.2, which delivers setup B. v2.0 has no server and no UI, and that is a current limitation, not a gap in any v2.0 task.

In setup B, each user can start a small local server with the `serve` command (v2.2). It listens only on the user's own machine, needs no login, and serves a Svelte web app to a browser on that machine. After the web app, the same Svelte view code ships as MCP App views (HTML views that the MCP server serves and the agent tool shows). Every view gets its data from its view model: one CLI or MCP read call that returns the rows and totals the view shows. The first version is for viewing, sorting and filtering. Editing comes later.

The UI is optional. The fourth Northstar principle says no task needs it, and this PRD keeps that true. See [01 Product Overview](01-product-overview.md).

## Scope

This PRD covers, as v2.2 planned scope:

- the local server for setup B, its network boundary and its share of the write lock
- the Svelte web app, which comes first
- MCP App views, which come next and use the same view code
- view models, and the rule that every client reads through them
- the read-only first version, and the line to later editing
- a proposed first list of views, which v2.2 planning fixes
- the position on Claude Code mods

Other PRDs own related parts:

| Topic | Owner |
| --- | --- |
| Where the `serve` command sits in the command grammar, the names of view-model calls, MCP profiles and the shared filter syntax | [08 CLI and MCP](08-cli-and-mcp.md) |
| The write lock, the write journal, index freshness, and the database backend for setup C | [09 Storage and Indexing](09-storage-and-indexing.md) |
| Record fields that views show | [10 Records and Identity](10-records-and-identity.md), [11 Record Types Reference](11-record-types-reference.md) |
| Packaging the compiled view files into the npm package and the signed single file | [07 Installation and Distribution](07-installation-and-distribution.md) |
| The shared MCP server in `packages/core`, which serves MCP App resources | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |

Not in scope:

- Editing records in the UI. It comes after the first version, in a release not yet planned.
- Setup C logins, permissions and shared database access. They are designed with setup C in v3.
- Access from another machine. The server never accepts it.
- Claude Code mods. They are out of the release plan. See [Claude Code Mods](#claude-code-mods).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 1: Northstar principles; section 2: setups; section 14: UI; section 15: release plan)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Scope & Phasing: the server release is a later wave that maintains the same PRD owners)

## Component and Capability Map

```text
  Browser on the same machine                Agent tool
        |                                         |
        | loopback only, no login                 | stdio MCP
        v                                         v
  make-blueprint serve (v2.2)            make-blueprint mcp
  serves the web app                     serves MCP App views (after the web app)
        |                                         |
        +------------------+----------------------+
                           v
                view-model read calls  <---- CLI read call for each view
                           |                (same rows and totals)
                           v
             storage interface --> file backend --> record files in git
                           |
                 one write lock per checkout, shared with the CLI and MCP server
```

| Component | What it does | Release |
| --- | --- | --- |
| Local server | Started by the `serve` command (v2.2). Listens only on the user's machine, needs no login, serves the web app, and answers view-model calls for it. | v2.2 |
| Web app | The Svelte views in a browser on the same machine | v2.2, first |
| MCP App views | The same Svelte views, served by the MCP server as HTML resources and shown inside the agent tool | v2.2, after the web app |
| View models | One read call for each view that returns its rows and totals, available through the CLI and the MCP server | v2.2 |
| Shared Svelte view code | One set of view components, built once for the web app and once as MCP App resources | v2.2 |
| Future mod | A Claude Code mod that draws its own elements from the same view models | Out of the release plan |

### UI Optional

Requirements:

- Every task in the seven workflow stages completes with no server and no UI running.
- No v2.0 command needs the server, and no command starts it except the `serve` command (v2.2).
- Every row and total a view shows is also available from its view-model read call in the CLI and the MCP server.
- In setup A, nothing listens on a network port. See [02 Architecture Overview](02-architecture-overview.md).

### Local Server

Requirements:

- The server binds only to loopback addresses on the user's own machine. It never binds to an address that another machine can reach.
- It asks for no login.
- It rejects any request whose `Host` header is not the loopback address and port it serves, and it allows no cross-origin reads, so a web page from another site cannot read project data through it.
- It prints the address it serves when it starts. When its port is busy, it says so and names how to choose another port.
- It runs until the person stops it, and stopping it loses no data.
- Each checkout has one short write lock, shared by the CLI, the MCP server and the local server. Locks never cross checkouts. The server takes the lock for every index update, and for every write once editing exists. It never holds the lock between requests, so an idle server never blocks a CLI or MCP write. See [09 Storage and Indexing](09-storage-and-indexing.md).
- A lock left behind by a process that stopped clears itself. A writer that finds the lock busy waits a short time and then gets a `blocked` result with the code `busy`, so no write waits forever.
- Every write checks the record version it read, and refuses when the record changed since that read. A record version is one value for each record that does not change with line endings, which [09 Storage and Indexing](09-storage-and-indexing.md) defines. The lock only keeps writes in order; the version check protects people's work.
- It writes no record files in the first version.
- A view-model read during a journaled change to many records sees the records as they were before the change or after it, never half changed.
- After a CLI or MCP write completes, the next view-model read shows it.
- Files stay the truth. The server keeps no copy of record data that outlives the derived index.
- It works offline. The compiled view files ship inside the npm package and the signed single file, and the server loads nothing from the internet.
- It sends no telemetry.

### Web App and MCP App Views

The web app comes first. MCP App views come next and reuse the same Svelte view components. Svelte compiles to small files, which matters because sortable and filterable tables grow quickly. Make Docs' backlog review view is a plain HTML MCP App view. Make Blueprint uses Svelte instead, for that reason.

Requirements:

- The web app and the MCP App views use the same Svelte view components. Only a thin host layer differs: in the web app it calls the local server, and in an MCP App view it calls the view-model MCP tool through the agent tool.
- An MCP App view gets all its data from its view-model MCP tool and reaches no network address.
- When an agent tool cannot show MCP App views, nothing breaks. The agent calls the same view-model tool and gets the same rows and totals as data.
- The first version shows no edit controls, so no one expects a change to be saved.
- Sorting and filtering pass through to the view-model call. The rows and totals a view shows always equal what the same view-model call returns with the same filter and sort.

The views serve these human outcomes, under the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md):

- Each view shows what it covers: the project, the record type or comparison, the filter in the shared filter syntax, and totals for the whole filtered set, such as "50 of 312 requirements shown". A person can run the same filter as a CLI read call and get the same rows.
- Records appear by `ref` and title. The permanent `id` stays available in record detail.
- Each view tells apart loading, no records, no records that match the filter, an index being rebuilt, and an error. An error names the CLI command that helps, such as the `project check` command (see [08 CLI and MCP](08-cli-and-mcp.md)).
- Tables use real table markup with header cells, sorting works from the keyboard, and no state is shown by color alone.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 2: setups; section 14: UI; Alternatives Considered: a server in every setup, plain HTML views like Make Docs)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp/resource-profiles.ts`
- `~/.make/blueprint/`

## Contracts and Data

### View Models

A view model is one read call for one view. It returns the rows and totals that the view shows. The web app, the MCP App views, the CLI and any future client use that same call. [08 CLI and MCP](08-cli-and-mcp.md) names the CLI and MCP forms of each call.

| Part | Contents |
| --- | --- |
| Input | The view name, a filter in the shared filter syntax, a sort, and a page of rows |
| Rows | One object for each row, with `id`, `ref`, `title` and the columns the view shows |
| Totals | The counts the view shows, computed over the whole filtered set, not only the current page |
| Context | The filter and sort that were applied, the total row count, and when the index was last brought up to date |
| Warnings | Problems that affect the result, such as record files that failed to parse and were left out |

Requirements:

- Each view has exactly one view-model call, and the view makes no other data call.
- View models are computed in the Make Blueprint operations that the CLI and MCP server share, not in Svelte code. CLI JSON output, the MCP tool result and the local server's answer for the same input are identical.
- View models return plain data with no HTML, so any client can draw them.
- View-model calls are read-only and need no `allowWrite`.
- View models read through the storage interface, so the same calls can work over the database backend in setup C.
- The CLI's human output for a view model shows the same rows and totals as a table.
- The local server's own web requests are internal to the web app. The stable contract for other clients is the CLI and MCP view-model call.

### Proposed First Views

The first list of views is deferred to v2.2 planning, which fixes it in this PRD (see [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md)). This is the proposed list:

| View | Rows | Totals | Main filters | Data owner |
| --- | --- | --- | --- | --- |
| Source status | Source records, with source git level (`all`, `converted` or `none`), conversion status, extraction status and a flag when a source changed after links were made | Counts by git level, conversion status and extraction status, and files kept out of git that are missing on this machine | Git level, status, facet | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| Extraction progress | Sources with their extraction records and the coverage of each part | Sources fully, partly and not extracted, and parts covered | Status, reviewer, facet | [13 Extraction and Review](13-extraction-and-review.md) |
| Review queue | Draft records and pending changes waiting for review, flagged records first, with type, source and extraction | Drafts by type, pending changes, flagged records, and drafts waiting for a second reviewer | Type, source, facet | [13 Extraction and Review](13-extraction-and-review.md) |
| Fit-gap table | Fit-gap records of one comparison: baseline capability, verdict, confidence, effort, covering target capabilities, domain, evidence count, and the requirement marks with their counts, such as "6 of 8 met" | Counts by verdict and by domain, matching the summary exports | Verdict, confidence, effort, domain, facet | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), [15 Exports](15-exports.md) |

Two more candidates are a record browser for any type, with record detail whose evidence links open the converted source text at the anchor, and a check view that lists broken links, links to changed sources and ref clashes.

### Editing Later

The first version is read-only. When editing comes:

- UI edits use the same write operations as the CLI and MCP server, through the storage interface, the write lock of the checkout and the write journal.
- Every UI edit checks the record version that the view read, as every write does. An edit made on a view of a record that has changed since is refused, so it never overwrites someone else's work.
- The UI never writes a record file directly.
- How the UI asks for write permission with no login is decided at that time.

### Claude Code Mods

Claude Code mods are out of the release plan. A mod is a Claude Code plugin whose JS or TS hook code returns trees of fixed elements, such as boxes, text, buttons, inputs, Markdown, code and images, that each app draws. A mod does not render HTML, CSS or a DOM, so it cannot reuse the Svelte views. A mod can call only the MCP servers its manifest lists, and its events and methods can change between releases.

A future mod would draw its own elements and get its data from the same view-model calls through the Make Blueprint MCP server. Because view models return plain data, nothing in v2 needs to change for that. Nothing in v2 depends on the mods API.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 7: CLI and MCP; section 14: UI; Context: other constraints; Alternatives Considered: build mods from the Svelte views; Consequences: mods API; Left for planning: the list of views for v2.2)
- [Claude Code mods overview](https://code.claude.com/docs/en/plugins/mods/overview.md)
- `blueprint/records/<type>/<id>.md`

## Integrations

| Party | How the server and UI relate to it |
| --- | --- |
| [08 CLI and MCP](08-cli-and-mcp.md) | `serve` is a top-level Make Blueprint command beside `mcp`, outside the operation catalog. The core reserves no command name (see root [06 Core Boundary](../../../../docs/prd/06-shared-core.md#core-boundary)). 08 owns its grammar and options. It also owns the names of view-model calls, the profile that holds them and their MCP App resources, and the shared filter syntax. The `core` profile, which holds reading, search and status, is the natural home. |
| [09 Storage and Indexing](09-storage-and-indexing.md) | Owns the shared write lock, the write journal and how the index learns about changed files. In setup C, the local server for each user reaches the shared database through the database backend. |
| [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) | The MCP server in `packages/core` serves MCP App resources, as it does for Make Docs' backlog review view. |
| [07 Installation and Distribution](07-installation-and-distribution.md) | The compiled view files ship inside the npm package and the signed single file. The server needs no Node on a machine that runs the single file. |
| [12 Source Intake and Conversion](12-source-intake-and-conversion.md), [13 Extraction and Review](13-extraction-and-review.md), [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), [15 Exports](15-exports.md) | Supply the data and meanings that views show. Fit-gap totals match the summary exports. |
| Browser | A current browser on the same machine opens the address that `serve` prints |
| Agent tools | Claude Code, Codex and GitHub Copilot CLI start the MCP server. Each shows MCP App views only if it supports them. |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 6: runtime, shared core and distribution; section 8: storage)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp/resource-profiles.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/operations/mcp-metadata.ts`

## Rebuild Notes

- **Keep view models out of the view code.** If the Svelte code queries or totals records itself, the CLI, the MCP tools and a future mod drift apart. Parity tests compare the CLI JSON, the MCP result and the server answer for the same input.
- **Bind to loopback, and check the host.** Binding to all addresses, or skipping the `Host` header check, exposes project data to other machines or to other web pages.
- **Release the lock between requests.** A server that holds the lock while idle blocks every CLI and MCP write.
- **Keep setup A free of the server.** No v2.0 feature may wait for v2.2. Every task stays possible with no server running.
- **Build the views once.** Separate web and MCP App versions of the same view drift. One component set with a thin host layer stays in step.
- **Ship the compiled files.** Loading scripts, styles or fonts from the internet breaks offline use and locked-down machines.
- **Compute totals over the filtered set.** Totals over one page mislead a person who reads them as project counts.
- **Do not build on the mods API.** It can change between releases. Plain-data view models keep a mod possible without that risk.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Consequences: trade-offs and risks)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Acceptance Criteria Guidance: non-functional requirements)

## Requirement History

### 2026-10-31 — W1 R1

- Affected requirement or section: `Purpose and Scope`
- Previous contract: The local server, the web app and MCP App views were planned scope for v2.1.
- Replacement contract: They are planned scope for v2.2. v2.1 carries system packages (see [20 System Packages](20-system-packages.md)).
- Rationale: System packages are the main reason for v2, and they need only the CLI and the MCP server that v2.0 builds, so they ship before the server and the web app.
- Source: [Q-094 Release That Carries System Packages](03-open-questions-and-risk-register.md#q-094-release-that-carries-system-packages)

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `docs/prd/01-product-overview.md`
- `docs/prd/02-architecture-overview.md`
- `docs/plans/2026-11-01-w1-r2-shared-rules-links/00-overview.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp/resource-profiles.ts`
- [Claude Code mods overview](https://code.claude.com/docs/en/plugins/mods/overview.md)
