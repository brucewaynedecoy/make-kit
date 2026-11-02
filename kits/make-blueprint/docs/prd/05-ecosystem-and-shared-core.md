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

Make Blueprint and Make Docs are two products from one owner. They follow one ecosystem pattern for folders, instruction files, the machine Store, CLI shape and MCP profiles. The root [05 Kit Conventions](../../../../docs/prd/05-kit-conventions.md#purpose) owns that pattern for every kit. This document owns the Make Blueprint rules that keep the two products separate but able to work together.

It owns four things. The first is the separate-or-together rule (Northstar principle 1) as testable Make Blueprint outcomes. The second is Make Blueprint's use of the shared TypeScript package `packages/core`: the names that Make Blueprint gives to the core, what stays in Make Blueprint, and how Make Blueprint depends on the core. The root [06 Shared Core](../../../../docs/prd/06-shared-core.md#purpose) owns what the core holds, and the root [07 Setup Tool and Shared Files](../../../../docs/prd/07-setup-tool-and-shared-files.md#purpose) owns the shared `.make/config.yaml` and `.make/personas.yaml` files ([root Q-006 Root PRD Set](../../../../docs/prd/03-open-questions-and-risk-register.md#q-006-root-prd-set)). The third is the handoff line that each tool's root block carries when the other tool is present. The fourth is the link from Make Blueprint records forward to Make Docs work items and doc paths, with the rule that Make Docs owns the backlog.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 1: Northstar principles; section 3: product boundary and names; section 6: runtime, shared core and distribution; section 12: relationship with Make Docs)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md`

## Scope

This document covers:

- The separate-or-together requirements for a project with Make Blueprint alone, Make Docs alone, or both.
- Make Blueprint's use of `packages/core`: the names that Make Blueprint gives to the core, what stays in Make Blueprint, and the Make Blueprint parts of the core pin.
- The handoff line: its content, when it appears and disappears, and what a person sees when the other tool is too old to write it.
- How Make Blueprint uses tool discovery to find a Make Docs install.
- Make Blueprint's use of the two project files that every kit shares, `.make/config.yaml` and `.make/personas.yaml`.
- Make Docs links on records, and how the `project check` command (see [08 CLI and MCP](08-cli-and-mcp.md)) confirms them, or skips them with a count.
- Backlog ownership and the Azure Boards export.
- The Make Docs capabilities that Make Blueprint depends on.

Covered elsewhere:

- The rules that every kit follows for the CLI shape, outcomes and exit codes, the MCP server and its profiles, resource URIs, routers and managed blocks, project and machine folders, and the Store boundary: the root [05 Kit Conventions](../../../../docs/prd/05-kit-conventions.md).
- What the core holds, its boundary, the kit names that each kit gives to it, tool discovery, the Store base and the exact core pin: the root [06 Shared Core](../../../../docs/prd/06-shared-core.md).
- The `make-kit` setup tool, and the fields and write rules of `.make/config.yaml` and `.make/personas.yaml`: the root [07 Setup Tool and Shared Files](../../../../docs/prd/07-setup-tool-and-shared-files.md).
- Package names, release tags and the shared publish workflow: the root [08 Build and Release](../../../../docs/prd/08-build-and-release.md).
- Folder layout, routers and Make Blueprint's managed-block rules: [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md).
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
| `packages/core` | Shared code both tools build on, kept in `packages/core/` of the make-kit monorepo and published as `@brucewaynedecoy/make-core` | Step 0, with the code for the shared `.make/` files in the setup tool wave | Root [06 Shared Core](../../../../docs/prd/06-shared-core.md#component-and-capability-map); Make Blueprint's use in this document |
| Core dependency line | Pins the published core in Make Blueprint, with a workspace link for development only | v2.0 | This document |
| Tool discovery | Finds the other ecosystem tool on the machine and in the project | Step 0 (core) and v2.0 | Root [06 Tool Discovery](../../../../docs/prd/06-shared-core.md#tool-discovery); Make Blueprint's use in this document |
| Handoff line | One line in each root block that names what the other tool owns | v2.0 for the Make Blueprint line; a later Make Docs release for the Make Docs line ([root Q-007](../../../../docs/prd/03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)) | This document; block mechanics in [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
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
- Make Blueprint follows the rule for every kit in the root [Separate or Together](../../../../docs/prd/01-product-overview.md#separate-or-together) section.
- Make Blueprint `setup` preselects the choices in the shared `.make/config.yaml`, as the root [Shared Setup Choices](../../../../docs/prd/07-setup-tool-and-shared-files.md#shared-setup-choices) section states. [07 Installation and Distribution](07-installation-and-distribution.md) owns the setup steps.
- Make Blueprint reads people and roles from the shared `.make/personas.yaml`, as the root [Shared People and Roles](../../../../docs/prd/07-setup-tool-and-shared-files.md#shared-people-and-roles) section states.
- Make Blueprint works beside Make Docs in either Make Docs layout and does not wait for the Make Docs move to `.make/docs/` and `~/.make/docs/`.

Evidence: the install matrix in [07 Installation and Distribution](07-installation-and-distribution.md) runs on fresh projects for Make Blueprint alone, Make Docs alone, both in each order, and then removes one. It checks that handoff lines appear and disappear. A Human Experience Review covers first-run setup output.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Human Experience Intent; Decision, section 1, principle 1; section 5: handoff line; section 16: Q-003, Q-009 and Q-060)
- [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design (Decision, section 6)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md` (Human Experience and Evidence)
- `AGENTS.md`
- `CLAUDE.md`

### Shared Core

`packages/core` is a TypeScript package in `packages/core/` of the make-kit monorepo, published as `@brucewaynedecoy/make-core`. Make Docs and Make Blueprint both build on it. The root [06 Shared Core](../../../../docs/prd/06-shared-core.md#component-and-capability-map) owns its parts and its [boundary](../../../../docs/prd/06-shared-core.md#core-boundary), and the rule that each kit gives its own names to the core ([Kit Names as Inputs](../../../../docs/prd/06-shared-core.md#kit-names-as-inputs)). Make Blueprint gives these names to the core:

| Core input | Make Blueprint value |
| --- | --- |
| CLI name | `make-blueprint` |
| npm package name | `@brucewaynedecoy/make-blueprint` |
| Resource URI prefix | `make-blueprint://system/` |
| Links to Store records | `make-blueprint://store/` |
| MCP app resources | `ui://make-blueprint/` |
| Project folder | `.make/blueprint/` |
| Machine folder and its setting | `~/.make/blueprint/`, and `MAKE_BLUEPRINT_HOME` to set another folder |
| MCP entry name and MCP server name | `make-blueprint` |
| Connection environment names | `MAKE_BLUEPRINT_MCP_CONNECTION_ID` and `MAKE_BLUEPRINT_MCP_CONNECTION_KEY` |
| Managed-block tag | `<!-- make-blueprint:begin -->` and `<!-- make-blueprint:end -->` |

The root [Shared Setup Choices](../../../../docs/prd/07-setup-tool-and-shared-files.md#shared-setup-choices) and [Shared Choices Settings](../../../../docs/prd/07-setup-tool-and-shared-files.md#shared-choices-settings) sections own `.make/config.yaml` and its settings. Make Blueprint shows the optional project `name` from that file in `project status` and in export titles ([06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md#project-config), [08 CLI and MCP](08-cli-and-mcp.md#project-status), [15 Exports](15-exports.md)).

`.make/personas.yaml` holds the people and roles for every kit. The root [Shared People and Roles](../../../../docs/prd/07-setup-tool-and-shared-files.md#shared-people-and-roles) section owns the file, and the root [People and Roles Entry Fields](../../../../docs/prd/07-setup-tool-and-shared-files.md#people-and-roles-entry-fields) section owns its entry fields. Make Blueprint names the display name of an entry by its `label` field.

These stay in Make Blueprint, in `kits/make-blueprint/`:

- Records, record types, the storage interface, the file backend, the local index, locks and the write journal for records, and schema upgrades of records ([09 Storage and Indexing](09-storage-and-indexing.md), [10 Records and Identity](10-records-and-identity.md), [11 Record Types Reference](11-record-types-reference.md)).
- Intake, conversion, extraction, review, analysis, exports and the v1 import.
- The Make Blueprint tool set for each MCP profile, the profile names `core`, `setup`, `intake`, `extract`, `analyze` and `all`, and the status read model ([08 CLI and MCP](08-cli-and-mcp.md)).
- The content that Make Blueprint passes to the core: router and block text, system docs, the nine skills (the seven stage skills, `blueprint-report` and `blueprint-convert`), and the `make-blueprint://system/<type>/<path>` resource scheme.
- The Make Docs link check (this document).
- The `serve` command (v2.2). It is a Make Blueprint command, and [08 CLI and MCP](08-cli-and-mcp.md#the-serve-command-v22) owns it. The core reserves no command name ([root Core Boundary](../../../../docs/prd/06-shared-core.md#core-boundary)).

Requirements:

- The core follows the root [Core Boundary](../../../../docs/prd/06-shared-core.md#core-boundary) and [Kit Names as Inputs](../../../../docs/prd/06-shared-core.md#kit-names-as-inputs) rules, with the Make Blueprint names in the table above.
- Make Blueprint carries no modified copy of core code.
- The core writes `.make/config.yaml` and `.make/personas.yaml` for Make Blueprint by the rules in the root [Shared Setup Choices](../../../../docs/prd/07-setup-tool-and-shared-files.md#shared-setup-choices), [Shared People and Roles](../../../../docs/prd/07-setup-tool-and-shared-files.md#shared-people-and-roles) and [People and Roles Entry Fields](../../../../docs/prd/07-setup-tool-and-shared-files.md#people-and-roles-entry-fields) sections.
- When the core refuses a write to `.make/personas.yaml` because two entries would have the same slug, the approval or the import that asked for the write returns the `blocked` outcome (see [08 CLI and MCP](08-cli-and-mcp.md)) and names the clash.
- When a reviewer approves a persona record, the core adds the record's entry to `.make/personas.yaml` as a `user` entry, or the record claims an unclaimed `user` entry with the same slug, as [10 Records and Identity](10-records-and-identity.md) defines. The persona record points to that slug. The v1 import writes v1 owners there as `maintainer` entries, through the core, and [17 v1 Import](17-v1-import.md) maps v1 owner kinds to the entry kinds.
- Record fields name entries by slug: `owners` and `stakeholders` point to `maintainer` entries, and `audience` points to `user` entries. [10 Records and Identity](10-records-and-identity.md) owns the checks on these slugs.

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

Make Blueprint uses the published core package, `@brucewaynedecoy/make-core`, at one exact version. The root [Core Versions and the Exact Pin](../../../../docs/prd/06-shared-core.md#core-versions-and-the-exact-pin) section owns the exact pin, the workspace link for development builds, and the release build that fails when the core resolves to a workspace link or to an unpublished version.

Requirements:

- Each signed single file contains the pinned core version, as the npm package does. A release build of a signed single file follows the same pin rule as the npm publish.
- A person or a test can read, from the installed CLI, which Make Blueprint version and which core version it contains.

Code anchors:

- [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design (Decision, section 4: one exact core version per kit release)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Dependencies: phase 02 can start against a local link)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md` (Scope: TypeScript project with `packages/core` as a dependency)

### Tool Discovery

Tool discovery is the core part that tells one tool whether the other is present. The root [Tool Discovery](../../../../docs/prd/06-shared-core.md#tool-discovery) section owns its two checks, its offline work, its work in both Make Docs layouts and the version read.

Requirements:

- `setup`, `setup remove` and `project check` run tool discovery to find Make Docs.
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
- Make Docs writes its handoff line from a later Make Docs release that has no number yet ([root Release Scope](../../../../docs/prd/01-product-overview.md#release-scope), [root Q-007](../../../../docs/prd/03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)). Until that release, every Make Docs install takes the too-old path.
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

The `project check` command (see [08 CLI and MCP](08-cli-and-mcp.md)) confirms Make Docs links through one Make Docs read command with JSON output that confirms work item IDs and doc paths. Make Docs 2.1.0 ships that command ([root Q-020](../../../../docs/prd/03-open-questions-and-risk-register.md#q-020-release-of-the-link-read-command)). Until `project check` confirms links through it, `project check` skips every Make Docs link and says how many it skipped. The skip is a temporary workaround, tracked as the deferred obligation [O-001](03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check) (owed work with a stable number), and must not become the normal behavior. [10 Records and Identity](10-records-and-identity.md) owns the rest of `project check`.

| Situation | What `project check` does | Effect on the check result |
| --- | --- | --- |
| `make-docs` found with the read command | Calls the read command for each work item ID and doc path, and reports each link that does not resolve | A link that does not resolve is a finding, named by record `ref`, field and value |
| `make-docs` not found | Skips every Make Docs link and reports how many it skipped and why | Not a finding and not an error |
| `make-docs` found without the read command | Skips every Make Docs link, reports how many it skipped, and names Make Docs 2.1.0 as the version that ships the read command. Until `project check` confirms links through that command, every project with `make-docs` is in this row. | Not a finding and not an error |
| Project has no Make Docs block | Treats Make Docs as not present for links and reports skipped links as above | Not a finding and not an error |

Requirements:

- With a `make-docs` that has the read command, a record that links to a work item ID or doc path that does not exist is reported by `project check`, with the record's `ref`, the field and the value.
- Whenever the check skips Make Docs links, `project check` completes, its result is not failed because of Make Docs links, and its output states the number of Make Docs links it did not check and the reason.
- The check reads only. It changes no Make Docs file, no Make Docs Store and no Make Docs work item.
- The check uses Make Docs' machine-readable output, not its human text.
- The check works offline.
- The same check gives the same result through the CLI and through MCP.

The check does not use `make-docs run work item resolve`, because that operation resolves wave and phase coordinates and paths but not every doc path or task-level ID. The read command ships in Make Docs 2.1.0, release 2 of the Step 0 order in the root [Release Scope](../../../../docs/prd/01-product-overview.md#release-scope). When `project check` confirms Make Docs links through it, the skip message and skip count go away, as [O-001](03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check) states.

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
- Make Blueprint ships no Azure Boards export. The BuildOS v1 Azure Boards export belongs to Make Docs, because Make Docs owns the backlog. The root [Release Scope](../../../../docs/prd/01-product-overview.md#release-scope) lists it as later Make Docs scope.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 3: Make Blueprint does not own the backlog; section 12)
- `docs/work/`

## Integrations

### Make Docs Capabilities Make Blueprint Depends On

Make Blueprint depends on these capabilities of the core and Make Docs. Each one ships in a core release, a Make Docs release or the setup tool wave from the make-kit monorepo. The root [Release Scope](../../../../docs/prd/01-product-overview.md#release-scope) sets their order.

| Dependency | Release | What Make Blueprint needs | Needed for | Behavior until it ships |
| --- | --- | --- | --- | --- |
| Core release | Core 0.1.0, in Step 0 ([root Core Versions and the Exact Pin](../../../../docs/prd/06-shared-core.md#core-versions-and-the-exact-pin)) | A published `@brucewaynedecoy/make-core` from `packages/core/` that holds the eight core areas, takes each tool's own names and tags, supports `.make/<tool>/` and `~/.make/<tool>/` as layout targets, and provides tool discovery. Core 0.1.0 holds no code for the shared `.make/` files. | Every v2.0 release build | Development uses a workspace link. No v2.0 release ships. |
| Core code for the shared `.make/` files | A later core release, in the setup tool wave | A published core release that reads and writes `.make/config.yaml` and `.make/personas.yaml` | Every v2.0 release build | Development uses a workspace link. No v2.0 release ships. |
| Make Docs on the core, with tag-aware blocks and the uninstall fix | Make Docs 2.2.0 ([root Q-007](../../../../docs/prd/03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0), [root Q-035](../../../../docs/prd/03-open-questions-and-risk-register.md#q-035-scope-of-the-uninstall-fix-in-220)) | A Make Docs release that runs on the core with its current behavior and tag-aware managed blocks, and whose uninstall removes only its own block, keeps user text, and deletes a file only when nothing is left | One shared implementation of managed blocks in one file, and the promise that user text survives uninstall of either tool | Make Blueprint can still release on the core, but the two tools use different block code. Make Docs keeps the whole file, its block included, when the file has user text. User text stays safe, but the Make Docs block stays behind. |
| Handoff line in the Make Docs root block | A later Make Docs release, with no number yet ([root Q-007](../../../../docs/prd/03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)) | Make Docs writes its handoff line when Make Blueprint is present, removes it when Make Blueprint leaves, and responds to the refresh request from Make Blueprint | The separate-or-together outcome | Make Blueprint writes its own line. `setup` and `project status` tell the person to update Make Docs with its own update command and then run `make-blueprint setup` again (see [Handoff Line](#handoff-line)). |
| Move to `.make/docs/` and `~/.make/docs/` | A later Make Docs release, with no number yet ([root D-033](../../../../docs/prd/03-open-questions-and-risk-register.md#d-033-make-docs-project-folder-name), [root D-037](../../../../docs/prd/03-open-questions-and-risk-register.md#d-037-make-docs-machine-folder-name)) | Make Docs project and machine folders under `.make/` | One folder pattern for both tools, and both blocks in `.make/AGENTS.md` and `.make/CLAUDE.md` | Make Blueprint works beside `.make-docs/` and `~/.make-docs/`. It does not wait for the move. |
| Link resolution | Make Docs 2.1.0 ([root Q-020](../../../../docs/prd/03-open-questions-and-risk-register.md#q-020-release-of-the-link-read-command)) | One Make Docs read command with JSON output that confirms work item IDs and doc paths | The Make Docs link check | `project check` skips Make Docs links and says how many and why, tracked as [O-001](03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check). |
| Shared setup choices | Setup tool wave | Make Docs `setup` reads and writes its shared choices, such as the selected agent tools, in `.make/config.yaml` through the core | Choices made once for every kit | Make Blueprint reads and writes `.make/config.yaml` through the core. Make Docs `setup` asks its own questions again. |
| Personas in `.make/personas.yaml` | Setup tool wave ([root Make Docs Personas](../../../../docs/prd/07-setup-tool-and-shared-files.md#make-docs-personas)) | Make Docs keeps its Persona list in `.make/personas.yaml`, with its label, description, built-in entries and reserved slugs, in place of `.make-docs/config.yaml` | One list of people and roles for both tools | Make Blueprint uses `.make/personas.yaml` alone. A Persona that Make Docs keeps only in `.make-docs/config.yaml` is not an entry that Make Blueprint records can name. |
| Azure Boards export | A later Make Docs release, with no number yet | The export lives in Make Docs | Clients who track the backlog in Azure Boards | Not offered by Make Blueprint. |

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

- **Two core versions in one project.** Make Docs and Make Blueprint can run different core versions in one project, so a change to an on-disk contract that both tools read is a breaking core release ([root R-002 Two Core Versions in One Project](../../../../docs/prd/03-open-questions-and-risk-register.md#r-002-two-core-versions-in-one-project)).
- **Do not make `update` the refresh trigger by accident.** In Make Docs today, `update` updates the installed tool through its package manager, and project sync is `setup`. A refresh request from the other tool must touch only the root block in the current project. It must not update the other tool's install.
- **Each tool writes only its own block.** It is tempting to let the arriving tool write both handoff lines. Do not. The other tool's block is outside its ownership, and its hash lives in the other tool's Store.
- **Skipped is not passed.** When `project check` skips Make Docs links, say so with a count. A silent skip reads like a clean result.
- **No product content in the core.** Router text, templates and skills belong to each tool, as the root [Core Boundary](../../../../docs/prd/06-shared-core.md#core-boundary) and [Rebuild Notes](../../../../docs/prd/06-shared-core.md#rebuild-notes) state.
- **Core release friction.** A core change needs a core release before a Make Blueprint release can use it ([root R-001 Core Release Friction](../../../../docs/prd/03-open-questions-and-risk-register.md#r-001-core-release-friction)).
- **Make Docs folder move.** Use the core's layout part, which knows both Make Docs folders, and do not hard-code `.make-docs/` or `.make/docs/` ([root D-033 Make Docs Project Folder Name](../../../../docs/prd/03-open-questions-and-risk-register.md#d-033-make-docs-project-folder-name)).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Alternatives Considered: one merged CLI, Make Blueprint inside the make-docs monorepo; Consequences: core release friction)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/self/update-tool.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/managed-block.ts`

## Requirement History

### 2026-11-01 — W1 R2

- Affected requirement or section: `Shared Core`
- Previous contract: A `.make/personas.yaml` entry had a `slug`, a `name`, a primitive, a kind and the kits that it is enabled for.
- Replacement contract: The root [People and Roles Entry Fields](../../../../docs/prd/07-setup-tool-and-shared-files.md#people-and-roles-entry-fields) section owns the entry fields: `slug`, `label`, `description`, `primitive`, `kind` and `kits`. `label` is the display name, and an entry has no `name` field.
- Rationale: Two identifier fields on one entry could disagree, so the root register sets one identifier field and one display field for every kit ([root Q-023 Persona Entry Fields](../../../../docs/prd/03-open-questions-and-risk-register.md#q-023-persona-entry-fields)).
- Source: [Make Blueprint Shared Rule Links Maintenance Plan](../plans/2026-11-01-w1-r2-shared-rules-links/00-overview.md)

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/04-record-types.md`
- `docs/plans/2026-11-01-w1-r2-shared-rules-links/00-overview.md`
- `docs/prd/01-product-overview.md`
- `docs/prd/02-architecture-overview.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/managed-block.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/self/update-tool.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/operations/work/ops/item-resolve.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/15-agent-instruction-ownership-and-managed-blocks.md`
