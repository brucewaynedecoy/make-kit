---
title: "03 Open Questions and Risk Register"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 03 Open Questions and Risk Register

## Purpose

This register keeps drift between PRDs, open questions, decisions waiting for the owner, and rebuild risks in one place, so they stay visible instead of being buried in subsystem PRDs. Every item names the PRD that owns it.

This is the living register of the active PRD namespace. When agents find or settle a gap, drift, open question, risk, decision or closeout finding, they update this document directly. They do not create separate question, decision, risk, gap or architecture-decision files unless the user asks.

Each item under `## Confirmed Drift`, `## Open Questions` and `## Rebuild Risks` has one numbered `###` heading, a `Status` / `Decision` / `Follow-Up` table, and the fields **Question** or **Issue**, **Why it matters**, **Recommendation** and **To close**. Drift items use `D-001`, `D-002` and so on, open questions use `Q-001`, and rebuild risks use `R-001`. New items take the next free number in their section. Numbers never change, even when an item moves to `Closed`. Status is one of `Open`, `Confirming`, `Deferred` or `Closed`. A closed item also carries **Resolution**.

Status meanings in this register:

- `Open`: no answer yet. The owning PRD states the requirement only at the level the design fixes.
- `Confirming`: the owning PRD, or a coordinator interpretation, states a recommended answer. The owner confirms it or chooses another.
- `Deferred`: the answer belongs to a later release and does not block the Step 0 and v2.0 backlog.
- `Closed`: settled, with a resolution.

## Confirmed Drift

Each item is a place where two PRDs in this set disagree. When the owning PRDs agree again, the item moves to `Closed` with a resolution. Closed items keep their place and number.

### D-001 Index File Inside or Beside the Store Database

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Follow 09: the index, lock and journal sit beside the Store database | None |

**Issue**: [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) says the Store database keeps each project's local index, locks and journal. [09 Storage and Indexing](09-storage-and-indexing.md) says each checkout has its own index file in the machine Store, separate from the Store database, keyed by project ID and checkout.

**Why it matters**: Work phase 03 builds the index. One answer decides whether a rebuild or a delete can touch other Store state.

**Recommendation**: Follow 09. 06 says the index, lock and journal for each checkout sit in `~/.make/blueprint/` beside the Store database, not inside it.

**To close**: 06 and 09 give the same location and keying.

**Resolution**: 06 says that `~/.make/blueprint/` holds the Store database and, beside it, each checkout's index, write lock and write journal, keyed by the project ID and by checkout. 02's Configuration Surfaces table says the same. 06, 09 and 02 agree.

### D-002 Status Time Budget

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | No status time limit until the owner approves a target | None |

**Issue**: The [Project Status](08-cli-and-mcp.md#project-status) requirements in 08 say status answers "within the budget" that the index performance profile sets. [09 Storage and Indexing](09-storage-and-indexing.md) and the plan set a characterization baseline with no target, so no budget exists.

**Why it matters**: A requirement that points to a budget nobody approved cannot be tested, and it reads like a pass or fail gate that the performance governance rules forbid without an owner-approved target.

**Recommendation**: 08 states that status is measured in the index characterization baseline that 09 owns, and sets no time limit until the owner approves a target.

**To close**: 08 carries no budget wording, or the owner approves a target and 09 states it.

**Resolution**: 08's [Project Status](08-cli-and-mcp.md#project-status) requirement says status is one of the workloads in the index characterization baseline that 09 owns, and sets no time limit until the owner approves a target and 09 states it.

### D-003 Outcome of a Write After an Interrupted Change

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | The 08 example uses the case 09 blocks on | None |

**Issue**: An outcome example in 08 has `run review approve --extraction` return `blocked`, with nothing approved, while an earlier change to many records is unfinished. 09 says the next write first finishes or undoes a safe journal by itself, and returns `recovery-needed` only when a file is in neither its before state nor its after state.

**Why it matters**: Status, skills and tests read the outcome. Two stories about the same case give two behaviors.

**Recommendation**: The 08 example uses the case 09 blocks on: a file in neither state, `recovery-needed`, and `project recover` as the next action.

**To close**: 08's example and 09's journal rules describe the same behavior.

**Resolution**: 08's outcome example has `run review approve --extraction` return `blocked` with code `recovery-needed` only when a file in the earlier change is in neither its before state nor its after state, and says that a safe interrupted change is finished or undone by the next write. The status order rule and the blocked status example match.

### D-004 Empty Optional Fields and `evidence_versions` in Record Examples

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Examples drop empty lists and show `evidence_versions` | None |

**Issue**: The record examples in 14 write `work_items: []` and `docs: []` and leave out `evidence_versions`. [11 Record Types Reference](11-record-types-reference.md) says the CLI leaves out optional fields with no value. [10 Records and Identity](10-records-and-identity.md) requires one `evidence_versions` entry for every source that `evidence` names.

**Why it matters**: Implementers copy examples. A wrong example breaks the byte-stable serializer and the one-file diff promise.

**Recommendation**: 14's examples drop empty lists and show `evidence_versions` next to `evidence`.

**To close**: Every record example in the set matches the serializer rules in 09, 10 and 11.

**Resolution**: 14's fit-gap example shows `evidence_versions` beside `evidence`, and its placement example leaves out `work_items` and `docs`. 14's field table and 12's source field table say "left out" instead of "empty". Every record example in the set has `evidence_versions` wherever it has `evidence`, and no empty list.

### D-005 Command That Confirms Evidence Links

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | `run record confirm-evidence <record> <source>` | None |

**Issue**: 10 says a person or agent confirms a record's links to one source after reading the linked text again, and that 08 names the command. The 08 command catalog has no such verb.

**Why it matters**: Without the command, an `old-version` link can never return to `ok` except by hand edit, so the changed-source promise has no way out.

**Recommendation**: 08 lists a `run record` verb such as `run record confirm-evidence <record> <source>`, a write in the `extract` and `analyze` profiles.

**To close**: 08 names the verb and 10 links to it.

**Resolution**: 08's `run record` table lists `run record confirm-evidence <record> <source>`, MCP tool `record_confirm_evidence`, a write in the `extract` and `analyze` profiles. 10's Evidence Links requirements and 12's Change Detection section name it.

### D-006 Where a Rejection Reason Is Kept

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | The reason goes at the end of the record body | None |

**Issue**: 13 says `run review reject` needs a short reason, which the CLI writes into each rejected record. Neither 10 nor 11 defines a field for it.

**Why it matters**: Work phase 06 cannot write the reason, and `project check` cannot validate it, until it has a home.

**Recommendation**: 11 defines one optional common field for the reason, set only on `rejected` records, or 13 says the reason goes into a fixed body section.

**To close**: 11 or 10 names the field, and 13 links to it.

**Resolution**: 13 says `run review reject` appends the reason, with the reviewer's name and the date, to the end of each rejected record's body, and that no front matter field holds it. 11 (Common Fields and Field Order) and 10 (Statuses) state the same. This follows the pattern the set already uses for a failed conversion's reason.

### D-007 Owner Values From the v1 Import

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | 17 keeps only the slugs and reports names and kinds | None |

**Issue**: 17 sends v1 owner names and kinds to project settings "in the form 10 defines for owner values". 10 defines `owners` only as a list of names or handles and defines no owner settings.

**Why it matters**: The import cannot write a setting that has no defined form, and v1 owner data would be lost or invented.

**Recommendation**: Either 10 defines an optional owner list in the project config, or 17 keeps only the slugs in `owners` and reports the names and kinds as import follow-ups.

**To close**: 10 and 17 agree on where v1 owner names and kinds go.

**Resolution**: 17's Record Mapping keeps v1 owner slugs in `owners` and lists each owner's v1 name and kind as an import follow-up. It writes them to no field or setting, so 10 needs no owner setting.

**Update (2026-10-30)**: [Q-070](#q-070-explicit-people-and-role-fields) and [Q-072](#q-072-shared-people-and-roles-file) place v1 owners: record `owners` stay in `owners`, and the v1 owner list, with names and kinds, becomes `maintainer` entries in `.make/personas.yaml`, which the core writes (see [17 v1 Import](17-v1-import.md)).

### D-008 Owner of the Filter Syntax and Read-Only SQL in the Module Map

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | 08 owns the filter syntax and SQL command, 09 the index behind them | None |

**Issue**: The module map in 02 puts the shared filter syntax and read-only SQL in the Index module owned by [09 Storage and Indexing](09-storage-and-indexing.md). [08 CLI and MCP](08-cli-and-mcp.md) owns the user-facing filter syntax and the SQL command, and 09 owns what backs them.

**Why it matters**: The backlog assigns tasks by owning PRD. A wrong owner splits one parser across two phases.

**Recommendation**: 02 names 08 for the filter syntax and SQL command and 09 for the index that backs them.

**To close**: 02, 08 and 09 name the same owners.

**Resolution**: 02's Make Blueprint module table has a separate "Filter syntax and read-only SQL" row owned by 08, and its Index row, owned by 09, says the index answers filters and read-only SQL. 02, 08 and 09 agree.

### D-009 Owner of the Handoff Line in the Module Map

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | 05 owns the handoff line, 06 the block mechanics | None |

**Issue**: The core module table in 02 lists handoff lines under managed blocks, owned by [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md). [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) owns the handoff line's content and timing, and 06 owns only the block mechanics.

**Why it matters**: The handoff line is the hardest Step 0 requirement (see [Q-002](#q-002-handoff-line-refresh-mechanism)). Its owner must be clear.

**Recommendation**: 02 names 05 for the handoff line and 06 for block mechanics.

**To close**: 02, 05 and 06 name the same owners.

**Resolution**: 02's core module table and 05's core contents table name 06 for block mechanics and 05 for the handoff line's content and when it appears. 02, 05 and 06 agree.

### D-010 Verbs for Supplied Text and Review in the Command Catalog

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Supplied text goes through `run source convert` | None |

**Issue**: An early reading of 08 had its status table name `run source attach-text`, while its verb table put supplied text on `run source convert`, and it had no `run review next` for 13 to use.

**Why it matters**: Status names the next action. A next action that names a missing verb sends people to a dead end.

**Recommendation**: One verb for supplied text, and no `run review next`.

**To close**: 08's tables and 12 and 13 use the same verbs.

**Resolution**: 08's status table and verb table both put supplied text on `run source convert`. No PRD names `run source attach-text` or `run review next`. 13 resumes work through `run extract next`, which returns the caller's own open extraction.

### D-011 Project Display Name From the v1 Import

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | An optional project `name` in the shared `.make/config.yaml` | Owner: [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) for the project config, with the mapping in [17 v1 Import](17-v1-import.md). Done in W1 R1. |

**Issue**: 17 writes v1 `instance.name` as "the project's display name in project settings" and counts it as one of four stated defaults. The [Project Config](06-project-layout-and-instruction-files.md#project-config) table in 06 has no display name setting, so the value has no home.

**Why it matters**: The import cannot write a setting that the config does not define, and the v1 name would be lost or written to an unchecked key.

**Recommendation**: 06 adds an optional project display name, `name`, in the shared `.make/config.yaml` from [Q-060](#q-060-shared-setup-choices-across-kits), so every kit can show the same name. `project status` shows it, and the exports use it in their titles, such as the workbook `about` sheet and the documents from [Q-062](#q-062-export-set-for-each-system-and-comparison). The v1 import writes `instance.name` there, as [Q-046](#q-046-v2-fields-that-v1-lacks-and-stated-defaults) lists. The other option keeps `instance.name` only in the import report and drops it from the stated defaults.

**To close**: 06 and 17 agree on where the v1 instance name goes, and [Q-046](#q-046-v2-fields-that-v1-lacks-and-stated-defaults) lists the same defaults.

**Resolution**: Owner accepted on 2026-10-30. `project status` shows the name, exports use it in their titles, and the v1 import writes `instance.name` there.

Code anchors:

- `docs/prd/02-architecture-overview.md` (Module Map, Configuration Surfaces)
- `docs/prd/05-ecosystem-and-shared-core.md` (Shared Core)
- `docs/prd/06-project-layout-and-instruction-files.md` (Machine Tree, Project Config)
- `docs/prd/08-cli-and-mcp.md` (Command Catalog, Outcomes and Exit Codes, Project Status)
- `docs/prd/09-storage-and-indexing.md` (Derived Index, Write Journal, Index Rebuild and Query Characterization)
- `docs/prd/10-records-and-identity.md` (Statuses, Evidence Links)
- `docs/prd/11-record-types-reference.md` (Common Fields and Field Order)
- `docs/prd/12-source-intake-and-conversion.md` (Source Record Fields, Change Detection)
- `docs/prd/13-extraction-and-review.md` (Review)
- `docs/prd/14-fit-gap-and-placement.md` (Analysis Fields, Record Examples)
- `docs/prd/17-v1-import.md` (Record Mapping)

### D-012 Gaps Found While Writing the Work Backlog

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Seven fixes, each with one answer from the existing PRDs and register | Owner: [09 Storage and Indexing](09-storage-and-indexing.md), [10 Records and Identity](10-records-and-identity.md), [12 Source Intake and Conversion](12-source-intake-and-conversion.md), with matching lines in 06, 07, 08 and 13. Done in W1 R1. |

**Issue**: The workers who wrote the first work backlog found seven places where the PRDs disagreed with each other or left a check without a code:

1. 12 had two large-original checks with no code in the 10 check catalog.
2. The `source-unregistered` check ([Q-082](#q-082-files-in-the-sources-folder-that-no-source-record-names)) would always report the router files in `blueprint/sources/`.
3. 12 said anchor numbers have at least three digits, but every row example has four, as the [Q-061](#q-061-converted-csv-files-and-table-links) decision does.
4. No PRD said that `run record create` makes a `draft`, though every PRD that uses it treats the result as a draft.
5. 10 said `project check` ends with "a failure status", but 08 gives `partial`.
6. 09 ran the schema upgrade as one journaled change, against its own rule that large changes run in batches.
7. 06 and 07 named the work phase `01-shared-core.md`, which is now `01-shared-core-adoption`.

**Why it matters**: A builder cannot follow two rules that disagree, and a check without a code cannot be listed or filtered.

**Recommendation**: Fix each one to match the decision it follows.

**To close**: The PRDs agree.

**Resolution**: Fixed on 2026-10-30. 10 lists `source-no-lfs` (Warning) and `source-lfs-not-fetched` (Information), and 12 names them. `source-unregistered` skips `AGENTS.md` and `CLAUDE.md`. A row number has at least four digits, and every other anchor number at least three. `run record create` makes a `draft` (10, 08 and 13). `project check` ends with `partial` and exit code 1. The schema upgrade runs in batches, and running `setup` again finishes a stopped upgrade. 06 and 07 name `01-shared-core-adoption.md`.

## Open Questions

Questions are in the order they block the work backlog. Items near the top block Step 0 and the first work phases. Items near the bottom block only later releases. The five design inputs that the plan names as open input questions are marked "Plan design input".

### Q-001 Shared Core Boundary and Step 0 Scheduling

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted the 05 boundary; the core now lives in the make-kit monorepo | Done in W1 R1. |

**Question**: Plan design input. What is the exact boundary of `packages/core` inside the make-docs monorepo, and who schedules the Make Docs changes that Step 0 needs?

**Why it matters**: Every v2.0 release build pins a published core. Work phase 01 cannot be sized until the boundary is fixed, and phase 02 can only use a local link until the core ships.

**Recommendation**: Use the Shared Core list in 05 as the boundary: layout and paths, resources, the MCP server and profiles, the Store base, agent-tool setup, managed blocks, tool discovery, `update` and uninstall, with no product content. The Make Docs owner schedules the five Make Docs changes that 05 lists: the core release, Make Docs on the core, the handoff line, the uninstall block fix and a link-resolution read operation.

**To close**: The owner accepts the boundary, and the Make Docs releases that carry Step 0 are scheduled.

**Resolution**: Owner accepted the boundary on 2026-10-30. The [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design moves the core to `packages/core/` and makes Step 0 repo-wide work that the owner schedules there.

### Q-002 Handoff Line Refresh Mechanism

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted as recommended | Done in W1 R1. |

**Question**: Each tool writes only its own managed block. How does the first tool's block gain or lose its handoff line when the second tool arrives or leaves later, with no extra step by the person?

**Why it matters**: It decides whether the first Northstar principle and its human promise ("handoff works with no extra setup") can hold. It also shapes the core's tool discovery in Step 0.

**Recommendation**: The coordinator interpretation: the arriving tool's `setup` and the leaving tool's uninstall call the other tool through core tool discovery, so each tool still writes only its own block. If the other tool is too old, `setup` output and `project status` name the one command to run. 05 narrows the call: it is a narrow "refresh root block" request that touches only the current project's root block, not the other tool's `update`, because Make Docs `update` updates the installed tool. The next `setup` or `update` also drops a stale line when a tool left without its uninstall.

**To close**: The owner confirms the mechanism, and the Step 0 core exposes the refresh request for both tools.

**Resolution**: Owner accepted on 2026-10-30: the arriving or leaving tool asks the other tool, through the core, to refresh only that tool's own root block; a too-old tool gets the one command named in setup output and `project status`.

### Q-003 Project Uninstall and Tool Uninstall

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted: follow Make Docs | Done in W1 R1. |

**Question**: The design says "uninstall" for taking Make Blueprint out of a project. Make Docs runs that as `setup remove` and keeps `uninstall` for taking the tool off the machine. Which shape does Make Blueprint use?

**Why it matters**: The uninstall code moves into the core in Step 0, and the promise that user text survives uninstall is tested on it.

**Recommendation**: Follow Make Docs. `setup remove` is project uninstall and keeps all project knowledge. `uninstall` is tool uninstall, never touches a project, and removes `~/.make/blueprint/` only with `--remove-store`.

**To close**: The owner confirms, and 07 and 08 keep the split.

**Resolution**: Owner accepted on 2026-10-30: `setup remove` is project uninstall and keeps all records; `uninstall` is tool uninstall, never touches a project, and deletes `~/.make/blueprint/` only with an extra flag.

### Q-004 Uninstall of an Edited Block and an Emptied File

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted as recommended | Done in W1 R1. |

**Question**: The design does not say what uninstall does with a block that a person edited. It also says a file is deleted only when nothing is left in it, while Make Docs today keeps any instruction file that holds user text, its own block included.

**Why it matters**: Both rules sit in the Step 0 uninstall block fix and in the promise that user text survives setup, update and uninstall of either tool.

**Recommendation**: Uninstall asks before it takes out an edited block, and keeps the block when the run cannot ask, as Make Docs does. Uninstall takes out only the tool's own block, keeps all user text, and deletes a file only when nothing is left in it.

**To close**: The owner confirms, and round-trip tests with user text above, between and below both blocks pass on the core.

**Resolution**: Owner accepted on 2026-10-30: uninstall asks before it removes an edited block, keeps it when it cannot ask, removes only its own block and deletes a file only when it is empty.

### Q-005 Broken Tags in a Shared Instruction File

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted as recommended | Done in W1 R1. |

**Question**: What does Make Blueprint `setup` do when the Make Docs begin and end tags in a shared `AGENTS.md` or `CLAUDE.md` are broken?

**Why it matters**: Writing next to a broken block risks damage to the other tool's block or to user text.

**Recommendation**: `setup` stops when either tool's tags are broken, changes nothing, and names the file and the line to fix.

**To close**: The owner confirms, and the core's malformed-tag check covers both tools' tags.

**Resolution**: Owner accepted on 2026-10-30: broken tags of either tool stop setup, change nothing, and name the file and line.

### Q-006 Single-File Packaging and Code Signing

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted with fixed targets | Done in W1 R1. |

**Question**: Plan design input. How is a Node 24 app that uses `node:sqlite` built into one signed file for macOS, Windows and Linux, and how is each signed? Still open: the build method, the CPU architectures, the Linux signing method, and where the macOS and Windows certificates come from.

**Why it matters**: The one-install principle and the "one signed file works on a machine with no Python" promise rest on it. v1 chose Go partly for this reason. See [R-005](#r-005-packagers-that-unpack-to-a-temporary-folder).

**Recommendation**: Work phase 02 builds and signs one file for each operating system before other phases depend on it, tests it in a clean container with no Python and no Node, and records the method in 07.

**To close**: A signed single file runs every v2.0 command on all three operating systems, and 07 names the build and signing method.

**Resolution**: Owner accepted on 2026-10-30: work phase 02 builds and signs single files for macOS on Apple silicon and Intel, Windows on x64, and Linux on x64 and arm64, and tests them in a clean container first. Windows on arm64 comes later.

### Q-007 Command List and `run` Verbs

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted the 08 command catalog | Done in W1 R1. |

**Question**: The design leaves the command list and the verbs of each `run` domain to planning. Is the v2.0 command catalog in 08 the list to build?

**Why it matters**: Every phase from 02 on builds commands from this catalog, and skills and status name its verbs.

**Recommendation**: Accept the [Command Catalog](08-cli-and-mcp.md#command-catalog) in 08: the seven top-level groups, the nine `run` domains (`source`, `record`, `extract`, `review`, `model`, `compare`, `place`, `export`, `import`) and their verbs. Drift found later goes into this register as a `D-` item.

**To close**: The owner accepts the catalog.

**Resolution**: Owner accepted on 2026-10-30.

### Q-008 `check` and `status` in the Command Grammar

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted: `project check` and `project status` | Done in W1 R1. |

**Question**: The design fixes the same seven top-level groups as Make Docs, but writes `make-blueprint check` and `make-blueprint status` as if they were top-level commands. Where do they sit?

**Why it matters**: Skills, status output and every PRD name these commands.

**Recommendation**: The coordinator interpretation: the shorthand means `make-blueprint project check` and `make-blueprint project status`, matching the Make Docs `project` group, with no top-level aliases.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30: no top-level aliases.

### Q-009 What `update` Does

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Option A: `update` updates only the tool | Done in W1 R1. |

**Question**: The design has `update` add and remove handoff lines and upgrade records. In Make Docs, `update` updates the installed tool and project sync is `setup`. What does Make Blueprint `update` do?

**Why it matters**: The update code moves into the core, and a person expects one command to bring a project current after a release.

**Recommendation**: `update` runs a tool update, then a project update for the current project: blocks, routers, skills, handoff lines and record schema upgrades. It never updates the other tool's install (see [Q-002](#q-002-handoff-line-refresh-mechanism)). For a signed single file, `update` downloads nothing and names the manual steps.

**To close**: The owner confirms, including the signed-file behavior.

**Resolution**: Owner chose on 2026-10-30 to follow Make Docs: `update` updates only the tool, and running `setup` again updates the project, including blocks, routers, skills, handoff lines and record schema upgrades.

### Q-010 Exit Codes

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted the 08 mapping | Done in W1 R1. |

**Question**: 08 maps outcomes to exit codes: 0 `success`, 1 `partial`, 2 `failed`, 3 `blocked`. Make Docs `project state status` uses 1 for blocked. Which mapping holds?

**Why it matters**: Scripts and skills that read exit codes break if the two tools differ without notice.

**Recommendation**: Keep the 08 mapping, and have skills read the `outcome` field of the result rather than the exit code.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30: 0 success, 1 partial, 2 failed, 3 blocked; skills read the `outcome` field.

### Q-011 Source Tree Folders

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted as recommended | Done in W1 R1. |

**Question**: The module map names logical modules only. What are the source folders of the Make Blueprint repository?

**Why it matters**: Code anchors in every PRD point at design sections and product paths until real source paths exist.

**Recommendation**: Work phase 02 fixes the source folders when it builds the CLI skeleton. 02 then names the path of each module, and the other PRDs add code anchors.

**To close**: 02's module map names a source path for each module.

**Resolution**: Owner accepted on 2026-10-30: work phase 02 fixes the source folders, then 02 names module paths.

### Q-012 Config File Name, Conflicts Folder, Package Names and Store Override

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted with fixed names | Done in W1 R1. |

**Question**: What is the project config file's name and format, is `.make/blueprint/conflicts/` the folder for kept-conflict copies, what are the npm package names, and is there a setting that moves the machine Store away from the home folder?

**Why it matters**: `setup` writes these paths in phase 02, and later changes would move files in every project.

**Recommendation**: `config.yaml` in YAML, matching `.make-docs/config.yaml`; `.make/blueprint/conflicts/` as 06 states; npm names chosen with the Make Docs owner in phase 02; a home-folder override only if the core already supports one.

**To close**: 06 and 07 name each choice.

**Resolution**: Owner accepted on 2026-10-30: `.make/blueprint/config.yaml`; `.make/blueprint/conflicts/`; npm packages `@brucewaynedecoy/make-blueprint` and `@brucewaynedecoy/make-core` (plus `@brucewaynedecoy/make-kit` for the setup tool); `MAKE_BLUEPRINT_HOME` moves `~/.make/blueprint/`.

### Q-013 Exact Core Version Pin

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted as recommended | Done in W1 R1. |

**Question**: Does each Make Blueprint release pin one exact published core version, or a version range?

**Why it matters**: A range lets a core release change Make Blueprint's behavior without a Make Blueprint release.

**Recommendation**: Pin one exact version, as 05 states. Release builds fail on a local link or an unpublished core.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30.

### Q-014 System Resources: Set and Ownership

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted as recommended | Done in W1 R1. |

**Question**: Which PRD owns Make Blueprint's system resources (contracts, templates, references and prompts) and their URI scheme, and which resources ship in v2.0?

**Why it matters**: Skills and routers point agents at these resources, and phase 02 builds the `resource` group.

**Recommendation**: 08 owns the `resource` surface and the `make-blueprint://system/<type>/<path>` scheme. 06 owns the local copy in `.make/blueprint/system/`. 05 owns the core's resource reading. The v2.0 resource set is listed in 08 when work phase 08 writes the skills.

**To close**: The owner confirms the split, and 08 lists the v2.0 resources.

**Resolution**: Owner accepted on 2026-10-30: work phase 08 lists the v2.0 resource set.

### Q-015 Folders That v2.0 Creates

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted as recommended | Done in W1 R1. |

**Question**: The design puts a router in "each top sub-folder" of `blueprint/`. Does v2.0 create `blueprint/runs/` and `blueprint/playbooks/`, which hold v2.3 content?

**Why it matters**: Empty folders for later releases confuse people and agents, and their routers would describe content that does not exist yet.

**Recommendation**: The coordinator interpretation: v2.0 creates `blueprint/sources/`, `blueprint/records/` and `blueprint/exports/` with routers. `blueprint/runs/` and `blueprint/playbooks/` arrive with v2.3.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30.

### Q-016 Instruction Files for the Selected Agent Tools

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted, plus shared setup choices | Done in W1 R1. |

**Question**: The design says to write the same content into `AGENTS.md` and `CLAUDE.md`. Make Docs writes only the files for the agent tools a person selects. Which rule holds?

**Why it matters**: It decides which files `setup` creates in a fresh project.

**Recommendation**: Follow Make Docs: write the files for the selected agent tools, and give every file that carries the block the same block content.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30, and added that kits share setup choices; see [Q-060](#q-060-shared-setup-choices-across-kits).

### Q-017 Index, Lock and Journal Location

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted: machine folder, keyed by project ID and checkout | Done in W1 R1. |

**Question**: Plan design input. Where do the local index, the write lock and the write journal live? The design proposes `~/.make/blueprint/` for the index only.

**Why it matters**: Operational state must stay out of project folders, and crash recovery depends on where the journal is.

**Recommendation**: The coordinator interpretation: all three live in the machine Store under `~/.make/blueprint/`, keyed by the project ID in the `.make/blueprint/` config. 09 adds the checkout to the key, because two worktrees of one project share a project ID, and keeps one index file per checkout.

**To close**: The owner confirms. The drift between 06 and 09 is closed in [D-001](#d-001-index-file-inside-or-beside-the-store-database).

**Resolution**: Owner accepted on 2026-10-30: the index, write lock and write journal live in `~/.make/blueprint/` beside the Store database, keyed by project ID and checkout, never in the project folder.

### Q-018 `id` Alphabet and Length

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Lowercase letters and digits, at least one letter, 8 characters | Done in W1 R1. |

**Question**: Which alphabet and code length does the random part of an `id` use? The design's examples use a random part of five characters.

**Why it matters**: The `id` names the record file and every link, and it never changes. At five characters, clashes between independent mints on different branches are not negligible at scale.

**Recommendation**: Lowercase ASCII letters and digits, at least one letter, about eight characters. Record the choice here and in 10.

**To close**: 10 states the alphabet and length, and the clash odds for a large project are written down.

**Resolution**: Owner accepted on 2026-10-30, for example `REQ-7kq2m4xa`. The design's 5-character examples are illustrative only.

### Q-019 Which Record Keeps a Clashing Ref

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted as recommended | Done in W1 R1. |

**Question**: When two branches mint the same `ref`, which record keeps it after `run record ref-fix`? The design's "the old ref still finds the record" is unclear when both records held that ref.

**Why it matters**: People and links that use the old ref must reach a predictable record.

**Recommendation**: The record with the earliest `created_at` keeps the `ref`, then the lower `id`. The renamed record keeps the old `ref` as an alias, and a lookup by that name returns the holder and names the renamed record too.

**To close**: The owner confirms, and the two-branch merge test passes.

**Resolution**: Owner accepted on 2026-10-30: the record created first keeps the `ref`, then the lower `id`; the other record gets a new `ref` and keeps the old one as an alias, and a lookup by the old `ref` returns the holder and names the renamed record.

**Update (2026-10-30)**: In the v1 import, when two v1 rows with the same v1 ID tie on `created_at` or have none, the row that comes first in the v1 files keeps the `ref`, so the dry run gives the same result every time (see [17 v1 Import](17-v1-import.md)).

### Q-020 Setup B Shape and Its Shared Write Lock

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Revised by the owner: per-checkout lock plus record version checks | Done in W1 R1. |

**Question**: Is setup B setup A plus the `serve` command, and how do the CLI, the MCP server and the local server avoid writing at the same moment?

**Why it matters**: The lock built in phase 03 must already serve a third process in v2.2.

**Recommendation**: The coordinator interpretation: setup B is setup A plus one local server, and in setup B the CLI, the MCP server and the local server share one write lock for each checkout. The server never holds the lock between requests.

**To close**: The owner confirms.

**Resolution**: Owner accepted a revised rule on 2026-10-30. Setup B is setup A plus one local server. In every file setup, each checkout has one short write lock shared by the CLI, the MCP server and the local server, and locks never cross checkouts. Every write also checks the record version it read, so a write based on a stale read is refused. Stale locks clear themselves, a busy writer gets a `blocked` result after a short wait, and large approvals run in batches. The version check protects people's work; the lock only keeps writes in order.

### Q-021 Deleting Records

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted: no delete command in v2.0 | Done in W1 R1. |

**Question**: The design says nothing about deleting records, and the storage interface has no delete operation. Can a record be deleted?

**Why it matters**: Deleting a record breaks links and evidence trails. A delete added later changes the storage interface.

**Recommendation**: No delete operation in v2.0. A record leaves use through `archived` or `superseded`. A file deleted by hand is found by `project check` through the links that point at it.

**To close**: 09 and 10 state the rule.

**Resolution**: Owner accepted on 2026-10-30.

### Q-022 Record Schema, Facet Format and Anchor Algorithm

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted 11, 10 and 12 as the schema, facet and anchor authority | Done in W1 R1. |

**Question**: Plan design input. What is the front matter schema for each record type, the facet config format, and the anchor algorithm?

**Why it matters**: Every record write, check and export depends on them.

**Recommendation**: Accept the field tables in 11, the facet format in 10 and the anchor format and rules in 12. The choices still open inside them are [Q-018](#q-018-id-alphabet-and-length), [Q-023](#q-023-field-homes-for-imported-links-and-owners), [Q-026](#q-026-anchor-marker-syntax) and [Q-027](#q-027-anchor-numbering-and-converted-text-shape).

**To close**: The owner accepts the schema, and the open sub-choices close.

**Resolution**: Owner accepted on 2026-10-30; the open choices inside them are Q-018, Q-023, Q-026 and Q-027.

### Q-023 Field Homes for Imported Links and Owners

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Make Docs doc links allowed on any record type | Done in W1 R1. |

**Question**: The v1 import needs homes for general links, a successor link, evidence links with no anchor, an owner list, Make Docs doc links on any record type, and records an extraction reused.

**Why it matters**: The design says every record has "links to other records", but a field with no home cannot be written or checked.

**Recommendation**: Keep what 10 and 11 define: `related`, `superseded_by`, `owners`, anchorless evidence links that `project check` flags, and extraction `records` entries with an action. Decide whether `docs` links sit only on placements, as 11 states, or on any record type.

**To close**: 11 defines every field the import writes.

**Resolution**: Owner accepted on 2026-10-30: any record type can carry Make Docs doc paths, and 11 changes to allow it. A doc path can point to any Make Docs doc, for example a design, plan, PRD, work item or guide; PRDs are one example, not a limit. `related`, `superseded_by`, `owners`, anchorless evidence links flagged by `project check`, and extraction `records` entries stay as 10 and 11 define them.

### Q-024 Make Docs Link Check Interface

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Make Docs read command; skip until then, tracked as O-001 | Done in W1 R1. |

**Question**: `make-docs run work item resolve` resolves wave and phase coordinates and paths, but not every doc path or task-level ID. Which call does `project check` use to confirm Make Docs links?

**Why it matters**: The traceable principle needs forward links that are checked. Until a call exists, `project check` skips them.

**Recommendation**: Make Docs offers one read operation with JSON output that confirms work item IDs and doc paths. Until it ships, `project check` skips Make Docs links and says how many it skipped.

**To close**: The operation is in a scheduled Make Docs release, and 05 names it.

**Resolution**: Owner accepted on 2026-10-30: Make Docs gets one read command with JSON output as part of the Step 0 Make Docs changes. Until it ships, `project check` skips Make Docs links and reports how many it skipped. The skip is a temporary workaround tracked as [O-001](#o-001-confirm-make-docs-links-in-project-check).

### Q-025 Hand-Off Write Authority

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Accepted: Make Blueprint only links | Done in W1 R1. |

**Question**: May Make Blueprint or its hand-off skill create or change Make Docs work items, or only link to them?

**Why it matters**: Make Docs owns the backlog. Two writers would break that ownership.

**Recommendation**: The coordinator interpretation: Make Blueprint only links to Make Docs work items and docs. Creating or changing work items is a Make Docs job, and the hand-off skill tells the agent to use Make Docs for it.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30.

### Q-026 Anchor Marker Syntax

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | `<a id="p-012"></a>` at the start of each element, in Make Blueprint converted text only | Done in W1 R1. |

**Question**: How is an anchor written into converted Markdown, so that a plain text search finds exactly one place?

**Why it matters**: Every evidence link resolves through this marker, and changing it later moves every anchor.

**Recommendation**: `<a id="p-012"></a>` at the start of each element.

**To close**: 12 states the marker, and converter tests check it.

**Resolution**: Owner accepted on 2026-10-30, with a scope limit. The marker applies only to converted sources in Make Blueprint. Make Docs product docs do not use it. Any move to use the same pattern in Make Docs docs needs its own deliberate design decision, not gradual drift. Links into converted CSV files are [Q-061](#q-061-converted-csv-files-and-table-links).

### Q-027 Anchor Numbering and Converted Text Shape

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | One counter per kind, at least three digits, parts by file type | Done in W1 R1. |

**Question**: Is each anchor kind (`h`, `p`, `r`) numbered on its own with at least three digits, and is converted text one `<original>.md` file next to the original, with a `parts` list in its front matter?

**Why it matters**: Converters, the extraction part model and the v1 anchor mapping all depend on this shape.

**Recommendation**: Accept 12: one counter per kind, at least three digits, one converted file beside each original, and parts by file type (sheet, slide, page or top-level section).

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30 for converted Markdown. Whether converted text also includes CSV files beside the Markdown file, and how links reach their rows, columns and cells, is [Q-061](#q-061-converted-csv-files-and-table-links).

### Q-028 `local` Sources

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Three source git levels (`all`, `converted`, `none`), all in v2.0 | Owner: [12 Source Intake and Conversion](12-source-intake-and-conversion.md), with the limitation in [01 Product Overview](01-product-overview.md). Done in W1 R1. |

**Question**: In v2.0, `local` sources exist only in the data model and show as missing when absent. When can they be registered and converted, where does their converted text go, and how is it kept out of git? The design says "git ignores that link" but does not name the mechanism, and symlinks are a problem on Windows.

**Why it matters**: The design names `local` sources as the fallback when a client forbids Git LFS, so v2.0 users may need them. 01 and 12 state that fallback only for once full `local` handling ships.

**Recommendation**: Add a project setting with three source git levels: `all` (originals and converted text in git, the default), `converted` (originals stay on the machine, converted text in git) and `none` (both stay on the machine). Each source can override the project level. Files that stay on the machine keep their normal paths under `blueprint/sources/`, and Blueprint lists them in a managed `blueprint/sources/.gitignore`, with no symlinks. Under `converted`, a machine without the original shows the original as missing, but evidence links still resolve through the converted text. Ship all three levels in v2.0.

**To close**: The owner sets a release, and 12 states the mechanism.

**Owner input (2026-10-30)**: The owner meant that original files can stay out of git while converted files stay in the repository. The owner also wants levels of control over what goes into git: all source files, converted files only, or no source files. The owner accepts no symlinks and the missing state on machines without the file.

**Cautions**: Converted text holds the same words as the original, so `converted` keeps the original bytes out of git but does not keep the content secret; use `none` for secret content. Moving a file that git already tracks to an ignored level does not remove it from git history; Blueprint warns and never rewrites history.

**Resolution**: Owner accepted the recommendation on 2026-10-30. The project setting has three levels: `all` (the default), `converted` and `none`, and each source can override it. Files kept out of git stay at their normal paths under `blueprint/sources/` and are listed in a Blueprint-managed `blueprint/sources/.gitignore`, with no symlinks. All three levels ship in v2.0. 12 replaces the `local` location and the git-ignored link with these levels, and 01 drops the limitation.

### Q-029 Git LFS Setting and Size Threshold

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Git LFS for originals of 50 MB or more, with rules in `blueprint/sources/.gitattributes` | Done in W1 R1. 12 names the setting `sources.lfs_threshold_mb` in `.make/blueprint/config.yaml`. |

**Question**: What is the setting name, and what default size makes an original go through Git LFS?

**Why it matters**: Large originals bloat a repository that cannot be cleaned later. See [R-017](#r-017-git-lfs-limits-and-repository-size).

**Recommendation**: A default threshold of about 50 MB, with LFS rules in `blueprint/sources/.gitattributes`.

**To close**: 12 names the setting and default.

**Resolution**: Owner accepted on 2026-10-30. The default threshold is 50 MB, and each project can change it. Git LFS applies only to originals that git tracks.

### Q-030 Source Records Skip Review

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Source records are `active` from creation, with no review | Done in W1 R1. |

**Question**: Source records are `active` from creation, with no review step. Is that right?

**Why it matters**: Extraction hands out only ready sources, so a review gate on sources would hold up all extraction.

**Recommendation**: Keep it. A source record states a file and its hash, not a claim that needs review.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30.

### Q-031 Meaning of the Second Reviewer

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | The approver must not be the person in `extracted_by`, when `review.second_reviewer` is on | Done in W1 R1. |

**Question**: Does "second reviewer" mean an approver other than the extractor, or two approvals?

**Why it matters**: It changes the review commands and the data each draft carries.

**Recommendation**: The approver must not be the person in the extraction's `extracted_by`. The setting `review.second_reviewer` is off by default and covers extraction drafts only.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30. `review.second_reviewer` is off by default and covers extraction drafts only.

### Q-032 Correcting Evidence on Active Records

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Fix in place through a pending change on the same record | Owner: [13 Extraction and Review](13-extraction-and-review.md), with status rules in [10 Records and Identity](10-records-and-identity.md). Design where a pending change is stored and which review commands handle it before work phase 06 ends. Done in W1 R1. |

**Question**: `run extract link` adds evidence to an active record with no review. How is a wrong fact on an active record corrected through review?

**Why it matters**: Unreviewed changes to trusted records weaken the review promise.

**Recommendation**: Keep `run extract link` for evidence only, and correct facts through a new draft that supersedes the active record on approval. Design the superseding draft before phase 06 ends.

**To close**: 13 states how an active record is corrected.

**Resolution**: Owner decided on 2026-10-30, in place of the superseding-draft recommendation:

- To fix a fact on an active record, a person or agent proposes a pending change on the same record. The record stays active with its old value until review.
- When a reviewer approves the change, it is written into the same file. The `id`, the `ref` and all links stay the same, and git history keeps the old value.
- A rejected proposal leaves the record unchanged and keeps the reason.
- `run extract link` still only adds evidence.
- `run record supersede` stays only for real replacements, for example when one requirement splits into two.

Reason: the git diff shows exactly what changed, no link breaks, and a record change still reads as a git diff of one file.

**Update (2026-10-30)**: The pending-change design that comes before work phase 06 ends also settles which direct edits `run record update` may make on an `active` record, such as storing Make Docs links, and where the reason for a rejected pending change is kept, because [11 Record Types Reference](11-record-types-reference.md) has no field for a review decision's reason.

### Q-033 Duplicate Hints for `run record create`

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Duplicate hints also show for `run record create`, with the same hint call | Done in W1 R1. |

**Question**: Duplicate hints show before `run extract add` creates a draft. Do they also show for `run record create`?

**Why it matters**: Records made outside extraction can still duplicate existing ones.

**Recommendation**: Yes, with the same hint call, so one rule covers every create.

**To close**: 13 states the rule.

**Resolution**: Owner accepted on 2026-10-30.

### Q-034 Analysis Records Start as Drafts

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Compare, `target-only` generation and place create drafts that the review commands approve | Done in W1 R1. |

**Question**: The design says new records start as `draft` only for extraction. Do compare, `target-only` generation and place also create drafts that the review commands approve?

**Why it matters**: It decides which records reach exports, which hold only `active` records by default.

**Recommendation**: Yes, as 14 states. The review commands in 13 make them `active` or `rejected`.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30.

### Q-035 Comparison Scope

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Every active baseline capability, parents included, gets a fit-gap record in v2.0 | Done in W1 R1. |

**Question**: Must every active baseline capability, parents included, get a fit-gap record in a comparison?

**Why it matters**: It sets when a comparison is complete in the coverage read and in status.

**Recommendation**: Yes for v2.0. Scoping a comparison by facet comes later.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30. Scoping a comparison by facet comes later.

### Q-036 Delivery Value for a Native Fit

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | A `native` fit takes `configure` with effort `none` | Done in W1 R1. |

**Question**: The delivery values have no "use as is". Which value does a `native` fit take?

**Why it matters**: Placement counts and exports group by delivery.

**Recommendation**: `configure`, with little or nothing to set, as 14 states. The alternative is a fifth value such as `adopt`.

**To close**: The owner confirms or picks the fifth value.

**Resolution**: Owner accepted on 2026-10-30. No fifth delivery value is added.

### Q-037 Workbook Scope

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | One workbook for each comparison, with one sheet per export and an `about` sheet | Done in W1 R1. |

**Question**: The design says "one xlsx workbook that holds all of them" but does not say what happens with several comparisons.

**Why it matters**: A client opens one workbook. Mixing comparisons in one file confuses the reader.

**Recommendation**: One workbook for each comparison, with one sheet per export and an `about` sheet that names the status filter and run details.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30. The owner also asked that the full export set be designed from the v1 fit-gap example and be repeatable, grounded in record data and consistent in shape and quality. That work is [Q-062](#q-062-export-set-for-each-system-and-comparison).

### Q-038 CSV Encoding Rules

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | UTF-8 with a byte order mark, commas, RFC 4180 quoting and LF line endings, for exports and converted CSV files | Done in W1 R1. |

**Question**: Are UTF-8 with a byte order mark, a comma delimiter, RFC 4180 quoting and LF line endings the CSV rules?

**Why it matters**: The client promise is that files open in a common spreadsheet app without Make Blueprint. See [R-020](#r-020-comma-decimal-locales).

**Recommendation**: Accept 15's rules.

**To close**: The owner confirms, and the column parity test with the example fit-gap passes.

**Resolution**: Owner accepted on 2026-10-30. The converted CSV files from [Q-061](#q-061-converted-csv-files-and-table-links) use the same rules, so one CSV writer serves both.

### Q-039 Formula-Like Text in CSV Files

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | CSV values stay exact; the export output warns about formula-like values and points to the workbook | Done in W1 R1. |

**Question**: A text value that starts with `=`, `+`, `-` or `@` can run as a formula when a spreadsheet app opens a CSV file. How do CSV exports treat such values?

**Why it matters**: A client opening an export could run a formula that came from source text. Changing values breaks exact data.

**Recommendation**: Keep CSV values exact, warn in the export output when such values exist, and point clients to the workbook, which writes text cells.

**To close**: 15 states the rule.

**Resolution**: Owner accepted on 2026-10-30. The workbook writes such values as text cells.

### Q-040 Exports Tracked in Git

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Git tracks `blueprint/exports/` | Done in W1 R1. |

**Question**: Does git track `blueprint/exports/`?

**Why it matters**: Tracked exports put generated files in every review. Untracked exports cannot be shared through the repository.

**Recommendation**: Track them. Export output is deterministic, so diffs stay small. 06 states it.

**To close**: 06 states whether git tracks the folder.

**Resolution**: Owner accepted on 2026-10-30. Deterministic output means an unchanged export adds no diff. The xlsx workbook is binary, so git shows that it changed but not what changed; the CSV files show the detail.

### Q-041 MCP Tool List for Each Profile

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | 08's profile lists, with the review tools also in `analyze` | Owner: [08 CLI and MCP](08-cli-and-mcp.md). Done in W1 R1. |

**Question**: The design leaves the MCP tool list for each profile to planning and leaves out exports, the v1 import and general record writes. Where do they go?

**Why it matters**: An agent on one profile sees only that profile's tools.

**Recommendation**: Accept 08: exports in `analyze`; `run import v1` and `run record ref-fix` in `setup`; general record writes in both `extract` and `analyze`; `project_status`, `record_show` and `record_list` in every profile. One change: `review_approve` and `review_reject` sit only in `extract` today, but [Q-034](#q-034-analysis-records-start-as-drafts) has the same review commands approve fit-gap and placement drafts, so both tools also go in `analyze`. The pending-change review from [Q-032](#q-032-correcting-evidence-on-active-records) goes wherever review goes.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30.

### Q-042 Stage Skill Names and Content

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | 16's seven stage skills plus `blueprint-report` | Owner: [16 Workflow and Skills](16-workflow-and-skills.md). Done in W1 R1. |

**Question**: The design leaves the skill for each stage and its content to planning. Are `blueprint-intake`, `blueprint-extract`, `blueprint-review`, `blueprint-model`, `blueprint-compare`, `blueprint-place` and `blueprint-hand-off` the names?

**Why it matters**: `setup` installs these folders, and the names must never clash with Make Docs skill folders.

**Recommendation**: Accept 16's names and the job, inputs, commands and profile it gives each skill, and add one skill, `blueprint-report`. Under [Q-063](#q-063-repeatable-export-quality), export prose lives in records, so `blueprint-report` drafts that prose (the system about part, domain openings and reading-note findings) with a checklist that matches the export layout, and runs the exports. `blueprint-compare` then only scores, following the [Q-065](#q-065-fixed-fit-gap-method) method, which keeps each skill to one job.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30. `blueprint-report` drafts export prose into records and runs the exports; `blueprint-compare` only scores.

### Q-043 v1 Bulk-Extract Files

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Merge reviews, keep notes as findings, staged rows as drafts and staged updates as pending changes | Owner: [17 v1 Import](17-v1-import.md). Done in W1 R1. |

**Question**: Plan design input. How does the v1 import treat the `extractions/` files of the old bulk-extract skill? The rest of the detailed v1 mapping is in 17 and in Q-044 to Q-047.

**Why it matters**: A project started on v1 can hold review work in these files, and ignoring them loses it. Client C had only set up its project folder as of 2026-10-30, so it holds no such work yet.

**Recommendation**: Published reviews merge into extraction records. Unresolved notes become draft `question` findings. Staged new candidates become drafts. Staged updates to published rows become pending changes on the matching records, the fix-in-place flow from [Q-032](#q-032-correcting-evidence-on-active-records), so the review work is kept and goes through review. A pending publication blocks the write.

**To close**: 17 states the treatment, and the Client C-shaped fixture passes.

**Resolution**: Owner accepted on 2026-10-30. When the import ships is [Q-071](#q-071-v1-import-release-and-client-c).

### Q-044 v1 Converted Text and Import Target Folder

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Keep v1 converted text and import into the same folder without touching v1 files | Owner: [17 v1 Import](17-v1-import.md). Done in W1 R1. |

**Question**: Does the import keep v1 converted text or convert originals again, and does it write into the v1 project folder or a new one?

**Why it matters**: Converting again can move anchors and break v1 evidence.

**Recommendation**: Keep the v1 converted text, and let `project check` flag any anchor a later conversion moves. Import into the same folder, never touch v1 files, and let the person delete v1 folders after accepting the result.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30. When the import ships is [Q-071](#q-071-v1-import-release-and-client-c).

**Update (2026-10-30)**: Work phase 09 sets the `converter_version` value for `converter: v1` text. Until then, [17 v1 Import](17-v1-import.md) records the v1 converter named in the twins' front matter.

### Q-045 v1 Refs for Sources and Systems, and Single-Owner Links

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | New refs with v1 names as aliases; a single v1 parent is kept, and several leave the field empty | Owner: [17 v1 Import](17-v1-import.md). Done in W1 R1. |

**Question**: v1 IDs become refs unchanged only where prefixes match. v1 sources have many `REF-NNN` entries per file and systems use slugs. v1 also links many to many, while v2 gives each requirement one capability and each capability one system. How are these mapped?

**Why it matters**: People must still find records by their v1 names, and links must not be guessed.

**Recommendation**: Sources and systems get new refs, with every `REF-NNN` and slug kept as an alias. A requirement or capability with exactly one v1 owner takes it. Otherwise the field stays empty, candidates become `related` links, and the import lists a follow-up.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30. The owner noted that several v1 parents told people that each of them had a stake in the record, so how v2 records people and roles is [Q-070](#q-070-explicit-people-and-role-fields). When the import ships is [Q-071](#q-071-v1-import-release-and-client-c).

### Q-046 v2 Fields That v1 Lacks, and Stated Defaults

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Missing fields are follow-ups, and only four stated defaults apply | Owner: [17 v1 Import](17-v1-import.md), with fields in [11 Record Types Reference](11-record-types-reference.md). See [D-011](#d-011-project-display-name-from-the-v1-import) for the display name. Done in W1 R1. |

**Question**: v1 lacks requirement `kind` and `capability`, and capability `system`, `parent` and `domain`. Does the import fail on them, and which defaults may it apply?

**Why it matters**: Failing on them would block every real v1 project.

**Recommendation**: `project check` lists missing fields as follow-ups, not errors. The import applies only four stated defaults: capability `system` from `defaults.systems`, finding `kind: observation`, empty timestamps set to the import time, and the project display name.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30. When the import ships is [Q-071](#q-071-v1-import-release-and-client-c).

### Q-047 v1 Import as an MCP Tool

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Keep `import_v1` in `setup`, behind `apply: true` and `allowWrite` | Owner: [08 CLI and MCP](08-cli-and-mcp.md), with behavior in [17 v1 Import](17-v1-import.md). Done in W1 R1. |

**Question**: 08 offers `import_v1` in the `setup` profile, with the write behind `apply: true` and `allowWrite`. The import worker suggested CLI only. Which holds?

**Why it matters**: A one-time import that writes many records is a risky agent action.

**Recommendation**: Keep 08's tool. The agent-first principle favors it, and the dry-run default plus `allowWrite` protect the write.

**To close**: The owner confirms.

**Resolution**: Owner accepted on 2026-10-30. When the import ships is [Q-071](#q-071-v1-import-release-and-client-c).

### Q-048 Persona and Persona Record

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Persona records link to Make Docs Personas; under [Q-072](#q-072-shared-people-and-roles-file) the link is a slug in the shared people and roles file | Owner: [01 Product Overview](01-product-overview.md) for Personas, [11 Record Types Reference](11-record-types-reference.md) for the record type, [04 Glossary](04-glossary.md) for terms, with Make Docs links in [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md). Done in W1 R1. |

**Question**: The `persona` record type shares its name with the Make Docs Persona (an audience role). How do PRDs, skills and output keep them apart?

**Why it matters**: Agents read both words in one session and may confuse an audience role with a client role.

**Recommendation**: Treat the two as related, not separate. A persona record is a role in the client's systems. When a project builds or configures a system for that role, the same role is also an audience for the project's docs. Add an optional `docs_persona` field on persona records that names a Make Docs Persona slug. Make Docs creates the Persona, because Make Blueprint only links (see [Q-025](#q-025-hand-off-write-authority)), and the hand-off can offer persona records as candidates for custom Personas. `project check` confirms the slug through the same Make Docs read command as other doc links (see [Q-024](#q-024-make-docs-link-check-interface)). Keep the writing rule only to say which kit a sentence means: "persona record" for Make Blueprint and "Persona" for Make Docs.

**To close**: The owner confirms.

**Owner input (2026-10-30)**: A Make Docs project can hold Persona-specific docs, guides and assets. A Make Blueprint persona, a user type or role in a system, could also have docs written for it, so the two should not be kept strictly apart. Make Docs 2.0.5 has two Persona primitives, `user` and `maintainer`, and either can be a person or an agent.

**Resolution**: Owner accepted the recommendation on 2026-10-30. Persona records are the user roles that the `audience` field in [Q-070](#q-070-explicit-people-and-role-fields) points to.

**Update (2026-10-30)**: [Q-072](#q-072-shared-people-and-roles-file) replaces the `docs_persona` field. Each persona record points to its slug in `.make/personas.yaml`, and an entry enabled for Make Docs gets guides written for it.

### Q-049 Where `serve` Sits

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | A top-level `serve` command beside `mcp`, reserved in the core for both tools | Owner: [08 CLI and MCP](08-cli-and-mcp.md) and [18 Local Server and UI](18-local-server-and-ui.md). Done in W1 R1. |

**Question**: The design fixes seven top-level groups that match Make Docs, but also names `make-blueprint serve`. Where does the `serve` command (v2.2) sit?

**Why it matters**: v2.0 reserves the name and returns `failed` for it. The core may need to reserve it for both tools.

**Recommendation**: A top-level `serve` lifecycle command beside `mcp`, outside the operation catalog, reserved in the core for both tools.

**To close**: The owner decides, and 08 states it.

**Resolution**: Owner accepted on 2026-10-30.

### Q-050 Bringing a Record Back From an End State

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | v2.0 accepts hand edits | Owner: [10 Records and Identity](10-records-and-identity.md). Revisit after v2.0. |

**Question**: `rejected`, `superseded` and `archived` are end states, and no command moves a record out of them. Should one exist?

**Why it matters**: People make mistakes in review. A hand edit is the only way back in v2.0.

**Recommendation**: Accept hand edits checked by `project check` in v2.0, and add a restore or reopen command later if field use needs it.

**To close**: The owner decides after v2.0 field use.

**Deferral confirmed**: The owner confirmed on 2026-10-30 that this stays deferred.

### Q-051 First v2.2 Views

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | Deferred to v2.2 planning | Owner: [18 Local Server and UI](18-local-server-and-ui.md). |

**Question**: The design leaves the list of v2.2 views to planning. Which views come first?

**Why it matters**: Each view needs a view-model call in 08 and data from its owning PRD.

**Recommendation**: Source status, extraction progress, review queue (with flagged records first, as [Q-065](#q-065-fixed-fit-gap-method) asks) and the fit-gap table with its requirement marks, then a record browser and a check view.

**To close**: v2.2 planning fixes the list in 18.

**Deferral confirmed**: The owner confirmed on 2026-10-30 that this stays deferred.

### Q-052 One Local Server per User or per Project

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | Deferred to v2.2 planning | Owner: [18 Local Server and UI](18-local-server-and-ui.md), with wording in [02 Architecture Overview](02-architecture-overview.md). |

**Question**: "A local server for each user" could mean one server per user or one per project folder.

**Why it matters**: It decides how the server finds projects and how the lock is shared.

**Recommendation**: One server per project folder in setup B.

**To close**: v2.2 planning decides, and 02 and 18 use the same wording.

**Deferral confirmed**: The owner confirmed on 2026-10-30 that this stays deferred.

### Q-053 MCP App Views in Codex and GitHub Copilot CLI

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | Deferred to v2.2 | Owner: [18 Local Server and UI](18-local-server-and-ui.md). |

**Question**: Do Codex and GitHub Copilot CLI show MCP App views?

**Why it matters**: Views that only one agent tool can show split the experience.

**Recommendation**: Fall back to the plain view-model tool where an agent tool cannot show the view, as 18 states.

**To close**: v2.2 tests each agent tool.

**Deferral confirmed**: The owner confirmed on 2026-10-30 that this stays deferred.

### Q-054 Write Permission for UI Edits

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | Deferred until UI editing is planned | Owner: [18 Local Server and UI](18-local-server-and-ui.md). |

**Question**: The local server needs no login. How do edits in the UI get write permission?

**Why it matters**: Any page that can reach the server could write records.

**Recommendation**: Decide when editing is planned.

**To close**: The release that plans UI editing decides.

**Deferral confirmed**: The owner confirmed on 2026-10-30 that this stays deferred.

### Q-055 v2.3 Types in the v1 Import

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | Deferred to v2.3 | Owner: [17 v1 Import](17-v1-import.md). |

**Question**: How are v1 test cases, runs, results and playbooks imported into a project imported in v2.0?

**Why it matters**: v1 projects keep this data, and the v2.0 import leaves it in place.

**Recommendation**: A v2.3 pass of `run import v1` for only these types, matched by ref.

**To close**: v2.3 planning decides.

**Deferral confirmed**: The owner confirmed on 2026-10-30 that this stays deferred.

### Q-056 v2.3 Verbs and Profile

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | Deferred to v2.3 | Owner: [08 CLI and MCP](08-cli-and-mcp.md), with fields in [11 Record Types Reference](11-record-types-reference.md). |

**Question**: Which verbs and which MCP profile serve test case, run, result and playbook records?

**Why it matters**: The command grammar and profiles must leave room for them.

**Recommendation**: Decide in v2.3 planning, within the existing grammar.

**To close**: v2.3 planning decides.

**Deferral confirmed**: The owner confirmed on 2026-10-30 that this stays deferred.

### Q-057 Partner Systems for `integrate`

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Replaced by integration links from [Q-073](#q-073-integration-records) | Owner: [11 Record Types Reference](11-record-types-reference.md), with delivery in [14 Fit-Gap and Placement](14-fit-gap-and-placement.md). Done in W1 R1. |

**Question**: A placement names one owning system. The example fit-gap tracked several system roles. How does an `integrate` placement name its partner systems?

**Why it matters**: Integration work needs both ends.

**Recommendation**: Add an optional `partner_systems` field on placement records in v2.0: a list of system `id` values for the other ends of an `integrate` placement. It follows the explicit-field rule from [Q-070](#q-070-explicit-people-and-role-fields), and adding it now avoids a schema change after real placements exist.

**To close**: The owner decides, and 11 defines the field.

**Owner input (2026-10-30)**: "Sort of, maybe." The owner noted that Make Blueprint has no model for system integrations and proposed an integration record type, which is [Q-073](#q-073-integration-records). If Q-073 is accepted, a placement links integration records in place of a `partner_systems` list.

**Resolution**: Closed on 2026-10-30 by [Q-073](#q-073-integration-records). A placement with delivery `integrate` links its integration records in an `integrations` field, and no `partner_systems` field is added.

### Q-058 Placement Export and Setting Options

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Setting options are covered by Q-064; add a placement CSV and workbook sheet in v2.0 | Owner: [15 Exports](15-exports.md). Done in W1 R1. |

**Question**: The v2.0 export set has no placement file and no columns for setting options, though the example fit-gap had a placement file.

**Why it matters**: Clients may ask for placements in a spreadsheet.

**Recommendation**: Setting options are covered: [Q-064](#q-064-capability-and-requirement-detail-fields) adds `option_values`, `option_default` and `option_scope` columns. Add `<comparison-ref>-placements.csv` and a matching workbook sheet to v2.0, because placement records exist in v2.0 and the export code is shared.

**To close**: v2.2 planning decides.

**Resolution**: Owner accepted on 2026-10-30.

### Q-059 Setup C Design

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | Deferred to v3 | Owner: [09 Storage and Indexing](09-storage-and-indexing.md), with setups in [01 Product Overview](01-product-overview.md). |

**Question**: The design leaves setup C (a shared database) to v3: its database type, logins, permissions and file storage.

**Why it matters**: The storage interface must not block it. See [R-007](#r-007-interface-built-before-a-second-real-backend).

**Recommendation**: Design setup C in v3. Keep the interface free of file paths, git and directory scans until then.

**To close**: A v3 design exists.

**Deferral confirmed**: The owner confirmed on 2026-10-30 that this stays deferred.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, sections 2 to 15; Consequences: left for planning or a later design)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Design Inputs, Dependencies)
- `.make/blueprint/`
- `blueprint/records/<type>/<id>.md`
- `blueprint/sources/`
- `blueprint/exports/`
- `~/.make/blueprint/`

### Q-060 Shared Setup Choices Across Kits

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Kits share `.make/config.yaml` for common choices | Done in W1 R1 for 05, 06 and 07; the core work belongs to the repo-wide plan. |

**Question**: When Make Docs, Make Blueprint or another kit is set up in a project after another kit, how does it know the choices already made, such as the selected agent tools?

**Why it matters**: A person should not have to repeat choices, and kits should not disagree about which agent tools a project uses.

**Recommendation**: Kits share one project file, `.make/config.yaml`, for choices that every kit needs. A kit set up later reads it, so earlier choices are already selected, and a changed choice is written back for every kit. Settings for one kit stay in `.make/<kit>/config.yaml`. The core reads and writes the shared file.

**To close**: The owner accepts the shared file.

**Resolution**: Owner accepted on 2026-10-30, as recorded in the [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design.

- `.make/config.yaml`
- `.make/blueprint/config.yaml`

### Q-061 Converted CSV Files and Table Links

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | One CSV file per extracted table, linked by table, row, column and cell positions | Owner: [12 Source Intake and Conversion](12-source-intake-and-conversion.md), with the link format in [10 Records and Identity](10-records-and-identity.md). 12 sets the size threshold in work phase 05. Done in W1 R1. |

**Question**: Converted text can include CSV files for structured data, such as each sheet of a spreadsheet or a large table in a PDF or Word file. CSV cannot hold an anchor marker. How does an evidence link point to a table, a row, a column or a single cell in a converted CSV file?

**Why it matters**: 12 today writes every table as rows in the converted Markdown, so links reach rows but not columns or cells. Spreadsheets are a main source type, and a fact often lives in one cell.

**Recommendation**: Each original keeps one main converted Markdown file. Each extracted table gets a table anchor (`t-001`) and its own CSV file beside the Markdown file, named `<original>.t-001.csv`, and the Markdown file links to it under a heading. Spreadsheet sheets and CSV originals always become CSV files; a table inside a document becomes a CSV file when it passes a size threshold, and otherwise stays a Markdown table with row anchors. Links use positions inside the table: `SRC-4hd8x7k2#t-001` (table), `SRC-4hd8x7k2#t-001:r-0012` (row), `SRC-4hd8x7k2#t-001:c-003` (column) and `SRC-4hd8x7k2#t-001:r-0012:c-003` (cell). Rows count from the first data row, and the header row is not counted. Positions stay valid for the same reason anchors do: the same original bytes and converter version always give the same file, and `project check` flags links made against an older version.

**To close**: 12 states the CSV output rule and the threshold, and 10 states the table, row, column and cell link forms.

**Resolution**: Owner accepted the recommendation on 2026-10-30. A table anchor (`t`) joins the anchor kinds. Links use `SRC-4hd8x7k2#t-001`, `#t-001:r-0012`, `#t-001:c-003` and `#t-001:r-0012:c-003`, and the header row is not counted. The CSV link standard RFC 7111 was not chosen, because few tools use it and its form does not match the other evidence links. The built-in PDF converter does not find tables yet.

### Q-062 Export Set for Each System and Comparison

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Add a capability model document and a data dictionary for each system, and a data dictionary for each comparison | Owner: [15 Exports](15-exports.md). Done in W1 R1. |

**Question**: The v1 fit-gap example the owner shared, which stays outside this repository, holds for each system a capability CSV, a requirement CSV, a data dictionary and a narrative Markdown document, plus the fit-gap workbook. The owner rates those files as excellent. 15's v2.0 set has no data dictionary and no narrative document. Do they join the export set?

**Why it matters**: A client reads the narrative document first. The data dictionary explains every column, every value list and how the files join, so a client can use the CSV files without help.

**Recommendation**: Add three exports. For each system, `<system-ref>-capability-model.md`: an about part, one part for each domain, one numbered section for each capability with its requirements, a capability inventory table and source notes. For each system, `<system-ref>-data-dictionary.md`: the files, the model shape with counts, every column, every value list with counts, join rules and encoding notes. For each comparison, `<comparison-ref>-data-dictionary.md`: the same for the fit-gap files, with the verdict, confidence and effort lists and their counts. Each capability CSV row carries its section number in the narrative document, as the example's `doc_ref` did.

**To close**: 15 lists the three exports, their file names and their layout.

**Resolution**: Owner accepted the recommendation on 2026-10-30.

### Q-063 Repeatable Export Quality

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | The CLI builds every export from records; prose lives in reviewed records; a skill drafts that prose | Owner: [15 Exports](15-exports.md), with the drafting skill in [16 Workflow and Skills](16-workflow-and-skills.md). Done in W1 R1. |

**Question**: In v1, an agent wrote the example exports from prompts and made most of the choices itself. How does v2 give the same shape and quality on every run, grounded in real record data?

**Why it matters**: The owner wants exports that are repeatable, grounded in real data, and consistent in shape and quality, whether that comes from a skill, deterministic CLI logic or both.

**Recommendation**: Both, with a clear split. The CLI builds every export file, prose included, from active records and the export format version alone, so the same records always give byte-identical files and no agent writes text at export time. All prose lives in records and goes through review like any other draft: the system record body gives the about part, each domain record body opens its part, capability and requirement bodies fill the sections, and finding records give cross-cutting principles, recorded contradictions and reading notes. A skill helps an agent draft that prose into records, with a checklist that matches the export layout. Golden-file tests built from synthetic records fix the shape, with no client data. An export check confirms that every `id`, section number and count in the files matches the records.

**To close**: 15 states the split and the checks, and 16 names the drafting skill.

**Resolution**: Owner accepted the recommendation on 2026-10-30. A skill that writes export files at export time was not chosen, because it does not give the same files on every run.

### Q-064 Capability and Requirement Detail Fields

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Optional capability and setting-requirement detail fields, exported as columns | Owner: [11 Record Types Reference](11-record-types-reference.md), with export columns in [15 Exports](15-exports.md). Decide before work phase 04. Done in W1 R1. |

**Question**: 15 leaves out the example columns `capability_type`, `personas`, `triggers`, `outcomes`, `entities`, `dependencies`, `option_values`, `option_default` and `option_scope`, because v2.0 records have no fields for them. Should records have them?

**Why it matters**: In the example these columns were well filled, and the spread of option scopes was itself a key finding. Text in a Markdown body cannot be counted, filtered or exported as a column.

**Recommendation**: Add them as optional fields. A capability gets `capability_type` (one code from a list the project can extend), `personas` (persona record `id` values), `triggers`, `outcomes` and `entities` (lists of short text) and `depends_on` (capability `id` values in the same system). A `setting` requirement gets `option_values` (a list), `option_default` and `option_scope` (one code from a list the project can extend). The capability and requirement exports gain the matching columns, so column parity covers every example column.

**To close**: 11 defines the fields, and 15 adds the columns.

**Resolution**: Owner accepted the recommendation on 2026-10-30.

### Q-065 Fixed Fit-Gap Method

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | A CLI-controlled, requirement-level fit-gap method that a skill follows | Owner: [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), with the skill in [16 Workflow and Skills](16-workflow-and-skills.md) and export changes in [15 Exports](15-exports.md). Done in W1 R1. |

**Question**: Q-063 makes exports repeatable, but what makes agents do the fit-gap analysis itself in a consistent, methodical and complete way?

**Why it matters**: Completeness, fixed value lists, required evidence and review do not say how a verdict is reached, so two runs can judge the same capability differently.

**Recommendation**: The CLI hands out one baseline capability at a time, with its requirements and candidate target matches, and tracks progress so nothing is skipped and work can resume. The agent marks each baseline requirement as met, partly met or not met in the target, with evidence, and the verdict follows from those marks. A written rubric fixes when each verdict, confidence and effort value applies, and the skill and the review view show the same rubric. Each verdict has required fields, for example `gap_detail` for `gap` and `partial`, and the CLI refuses a draft without them. After the baseline pass, the CLI lists target capabilities that no fit-gap record cites, for a target-only pass. Consistency checks flag verdicts that do not match the requirement marks and similar capabilities with different verdicts, and reviewers see flagged records first.

**To close**: 14 states the method, rubric, required fields and checks, and 16 names the skill that follows it.

**Resolution**: Owner accepted on 2026-10-30. Keeping the method only in a skill was not chosen, because nothing would enforce the steps.

Owner addendum on 2026-10-30:

- 14 keeps the sentence "The grain is the capability, not the requirement." The W1 R1 change plan adds one sentence under it: "The verdict is backed by a mark for each baseline requirement."
- Why the grain stays: the v1 fit-gap example had one row for each baseline capability. Its data dictionary says requirements do not join across the two systems, because they came from different sources at different levels of detail (about 8 requirements per capability on one side and 11.6 on the other). Requirements are never matched across systems.
- Each mark is about one baseline requirement only, and answers one question: does the target meet this? Its evidence points at target capabilities or sources, never at target requirements.
- The marks are a list inside the fit-gap record. They support the verdict. They are not a new grain.
- Marks are required on every baseline requirement, for every verdict, `native` and `configurable` included. A wrong `native` verdict costs the most, because nobody looks at it again. Each mark is short: one value plus evidence. A `target-only` record has no baseline capability, so it has no marks.
- The W1 R1 change plan adds to 15: a gap list for each requirement that shows exactly what is missing; counts for each capability, such as "6 of 8 met", in the workbook and the capability model document; and the Q-065 check that flags a verdict that does not match its marks.

### Q-066 Requirement Marks and the Verdict Rule

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | One mark value per baseline requirement, and a fixed table from marks to verdict | Owner: [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), with the field in [11 Record Types Reference](11-record-types-reference.md). Done in W1 R1. |

**Question**: Q-065 has the agent mark each baseline requirement as met, partly met or not met, and the verdict follows from the marks. Those three marks cannot tell `native` from `configurable`, or `unreleased` from `gap`. Where do marks live, what makes a verdict follow from them, and what does a capability with no requirements get?

**Why it matters**: If the verdict does not follow from the marks by a fixed rule, two runs can still judge the same capability differently, which is the problem Q-065 solves.

**Recommendation**: Each mark has two parts: whether the requirement is met (met, partly met or not met), and for a met or partly met requirement, how (as shipped, by configuration, or only in an unreleased version). A fixed table in 14 gives the verdict from the marks: all met as shipped gives `native`; all met with at least one by configuration gives `configurable`; all met with at least one only in an unreleased version gives `unreleased`; none met gives `gap`; anything else gives `partial`. Marks live in a `requirement_marks` list on the fit-gap record, so the record stays one per baseline capability. A capability with no requirements of its own gets one mark for the capability as a whole. Met and partly met marks need an evidence link; a not-met mark needs a short note on where the agent looked, because absence cannot be linked. Confidence and effort stay judgments that follow the rubric.

**To close**: 14 states the mark parts, the verdict table and the evidence rule, and 11 defines `requirement_marks`.

**Resolution**: Owner accepted on 2026-10-30. Under the [Q-065](#q-065-fixed-fit-gap-method) addendum, a mark is one value plus evidence, so the two parts of the recommendation join into one value: `met` (met as shipped), `configured`, `unreleased`, `partly` or `not-met`. The verdict table reads: all `met` gives `native`; all `met` or `configured`, with at least one `configured`, gives `configurable`; all `met`, `configured` or `unreleased`, with at least one `unreleased`, gives `unreleased`; all `not-met` gives `gap`; anything else gives `partial`. Mark evidence is target capability `id` values or source evidence links, never target requirements. A `not-met` mark carries a short note on where the agent looked in place of a link.

### Q-067 Candidate Matches and Similar Capabilities

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Candidates and similarity use the index text search, with the duplicate-hint matching | Owner: [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), with text search in [09 Storage and Indexing](09-storage-and-indexing.md). Done in W1 R1. |

**Question**: Q-065 has the CLI hand out candidate target matches and flag similar capabilities with different verdicts. How are candidates and similar capabilities found?

**Why it matters**: A method that changes between runs, or needs a network service, would undo the repeatability that Q-065 asks for.

**Recommendation**: Use the text search that the local index already has, with the same matching as the duplicate hints in [Q-033](#q-033-duplicate-hints-for-run-record-create). Candidates come from target capability names, summaries and requirement text, with the same domain first. Candidates are hints only, and the agent can cite any target capability. The similar-capabilities check uses the same match score, so it gives the same flags on every run. No embeddings or network services in v2.0.

**To close**: 14 states the candidate and similarity rules.

**Resolution**: Owner accepted on 2026-10-30.

### Q-068 Marks That Go Out of Date

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Fit-gap records keep the requirement versions they marked; changed requirements flag the record and send it out again | Owner: [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), with the check catalog in [10 Records and Identity](10-records-and-identity.md#check-catalog). Done in W1 R1. |

**Question**: What happens to a fit-gap record when its baseline capability gains, loses or changes a requirement after the marks were made?

**Why it matters**: Marks that no longer match the requirements make the verdict look complete when it is not.

**Recommendation**: The record keeps the version of each requirement it marked. `project check` flags a fit-gap record whose marks no longer match the capability's current requirements, and the hand-out command gives that capability out again. The fix goes through the pending-change flow from [Q-032](#q-032-correcting-evidence-on-active-records).

**To close**: 14 states the rule, and the check reports it.

**Resolution**: Owner accepted on 2026-10-30.

### Q-069 Requirement-Level Fit-Gap Export

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Add `<comparison-ref>-fit-gap-requirements.csv`, a workbook sheet and mark counts | Owner: [15 Exports](15-exports.md). Done in W1 R1. |

**Question**: Requirement marks hold the most detailed judgment in a comparison. Do exports show them?

**Why it matters**: A client who asks why a capability is `partial` should see which requirements are not met without opening the records.

**Recommendation**: Add `<comparison-ref>-fit-gap-requirements.csv`, with one row for each baseline requirement and its mark, and a matching sheet in the workbook. The fit-gap detail export gains counts of met, partly met and not-met requirements. The comparison data dictionary from [Q-062](#q-062-export-set-for-each-system-and-comparison) describes the new file.

**To close**: 15 lists the export and its columns.

**Resolution**: Owner accepted on 2026-10-30. The export additions in the [Q-065](#q-065-fixed-fit-gap-method) addendum also apply: a gap list for each requirement, counts for each capability such as "6 of 8 met" in the workbook and the capability model document, and the check that flags a verdict that does not match its marks. A system can be the baseline in more than one comparison, so its capability model document shows the counts for each comparison.

### Q-070 Explicit People and Role Fields

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Explicit `owners`, `stakeholders` and `audience` fields that point to the shared people and roles file | Owner: [10 Records and Identity](10-records-and-identity.md) for the common fields, [11 Record Types Reference](11-record-types-reference.md) for `audience`, with the import in [17 v1 Import](17-v1-import.md) and columns in [15 Exports](15-exports.md). Decide before work phase 04. Done in W1 R1. |

**Question**: Which explicit fields say who owns a record, who has a stake in it and which user roles it serves, and how do they differ from the parent link?

**Why it matters**: One field that mixes systems, capabilities and roles cannot be filtered or checked by meaning. The owner wants each kind of link in its own field.

**Recommendation**: Use the owner's model with three link fields. `owners` lists the `maintainer` entries responsible for the record; a single owner is a list of one, so there is no second `owner` field. `stakeholders` lists `maintainer` entries that have a stake but are not owners, and an entry is never in both lists on one record. `audience` lists `user` entries, the user roles the record serves, on capabilities and requirements; it replaces the `personas` field from [Q-064](#q-064-capability-and-requirement-detail-fields). All three hold slugs from the shared file in [Q-072](#q-072-shared-people-and-roles-file). The parent link keeps its current field names, `system` on a capability and `capability` on a requirement, because a capability's `parent` field already names its parent capability in the tree. Extra v1 parent links stay `related` links, as [Q-045](#q-045-v1-refs-for-sources-and-systems-and-single-owner-links) states, and v1 record `owners` lists go into `owners`. The capability and requirement exports carry `owners`, `stakeholders` and `audience` columns.

**Owner input (2026-10-30)**: Different kinds of links need explicit fields. The v1 `owners` list in `instance.yaml` should have been named `stakeholders`; its entries are Maintainers, borrowing the Make Docs Persona primitive. Persona records are Users, borrowing the other primitive. An `owner` is one Maintainer, and `owners` is a list of Maintainers. `audience` is a list of one or more user personas. The parent link is the system a capability belongs to, or the capability a requirement belongs to. `stakeholders` is an optional list of Maintainers who are not owners but have a stake.

**Resolution**: Owner accepted on 2026-10-30, with the slugs held in the shared file from [Q-072](#q-072-shared-people-and-roles-file). The owner confirmed it in this session on 2026-10-30: "I explicitly asked the other chat to share this message/proposal and I approve the other chat's message."

**To close**: 10 defines the field, and 15 and 17 use it.

### Q-071 v1 Import Release and Client C

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Client C starts on v1 on 2026-11-03, and the v1 import stays in v2.0 | Owner: [17 v1 Import](17-v1-import.md), with release scope in [01 Product Overview](01-product-overview.md). Done in W1 R1. |

**Question**: v1 never had a public release, only a couple of projects used it, and a direct upgrade from v1 is unlikely. Client C has only set up its project folder and could start on v2 if v2 worked before Tuesday 2026-11-03. Does the v1 import stay in v2.0?

**Why it matters**: The import is a large part of work phase 09. v2.0 needs Step 0 and nine work phases, none of them built, so v2.0 cannot be ready by 2026-11-03.

**Recommendation**: Client C starts on v1 on 2026-11-03, and the v1 import stays in v2.0, so Client C moves to v2 when v2.0 is ready and its project becomes the real import test. If Client C can wait for v2 intake and extraction instead, it gathers its source files only, the v1 import moves to a later release, and [Q-043](#q-043-v1-bulk-extract-files) to [Q-047](#q-047-v1-import-as-an-mcp-tool) become deferred.

**To close**: The owner picks, and 01 and 17 state the release.

**Resolution**: Owner accepted option one on 2026-10-30. Client C starts its blueprint work on v1 and moves to v2 with the v1 import when v2.0 is ready, so Client C's project is the real import test. [Q-043](#q-043-v1-bulk-extract-files) to [Q-047](#q-047-v1-import-as-an-mcp-tool) stay in v2.0 scope.

### Q-072 Shared People and Roles File

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | One shared `.make/personas.yaml` for every kit, written by the core and read by each kit | Owner: [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) for the shared file, [10 Records and Identity](10-records-and-identity.md) for checks, [11 Record Types Reference](11-record-types-reference.md) for persona records, with the import in [17 v1 Import](17-v1-import.md). The Make Docs Persona move belongs to the repo-wide plan in the [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design. Done in W1 R1. The open details are [Q-077](#q-077-shared-people-and-roles-file-details). |

**Question**: `owners`, `stakeholders` and `audience` name people and roles, and Make Docs keeps its own Persona list. Where are people and roles defined, so that every kit reads the same list?

**Why it matters**: Without one list, a typo in a name creates a new person, the v1 import has nowhere to put each owner's name and kind (see 17), and a Make Blueprint list and a Make Docs list would drift apart.

**Recommendation**: One shared file, `.make/personas.yaml`, holds people and roles for every kit. The shared core reads and writes it, and each kit only reads it, which keeps the [Q-025](#q-025-hand-off-write-authority) write rule. Each entry has a `slug`, a `name`, a primitive (`user` or `maintainer`), a kind (`person`, `team` or `agent`) and the kits it is enabled for, for example Make Blueprint only, or Make Docs too so that guides are written for it. There are only two primitives, and both can be people or agents. `owners` and `stakeholders` point to `maintainer` entries, and `audience` points to `user` entries. Client roles found in sources stay persona records with evidence and review; each points to its slug in the shared file, and when a persona record is approved the core adds its entry. `project check` reports a slug that is not in the file, a slug of the wrong primitive, and a slug that is in both `owners` and `stakeholders` on one record. The v1 import writes the v1 owner list, with names and kinds, into the shared file as `maintainer` entries. This replaces a `maintainers` list in `.make/blueprint/config.yaml` and the `docs_persona` field from [Q-048](#q-048-persona-and-persona-record). Make Docs' own Persona list moves into the shared file too, which is a Make Docs change made in the monorepo. Separate lists for each kit were not chosen, because two lists can drift apart.

**To close**: 05 and 10 state the shared file and its checks, 11 states the persona record link, and 17 maps the v1 owner list.

**Owner input (2026-10-30)**: The owner approved this proposal in a forked session. That session relayed the owner's words: "On the two decisions: I agree with your recommendations." and "Yes, please send this proposal to Grill me." The owner confirmed it in this session on 2026-10-30: "I explicitly asked the other chat to share this message/proposal and I approve the other chat's message."

**Open details for planning**: Make Docs Personas also carry a `label` and a `description`, and Make Docs keeps the built-in `user` and `maintainer` entries and its reserved slugs, so the entry format must hold them. Projects that keep Personas in `.make-docs/config.yaml` need a move path. What happens to an entry when its persona record is later rejected, archived or superseded also needs a rule.

**Resolution**: Owner accepted on 2026-10-30, as above. The open details for planning stay with the W1 R1 change plan and the repo-wide plan.

### Q-073 Integration Records

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | An `integration` record type in v2.0, one flow in one direction, with exports | Owner: [11 Record Types Reference](11-record-types-reference.md) for the type, [13 Extraction and Review](13-extraction-and-review.md) for extraction, [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) for coverage and placement, and [15 Exports](15-exports.md) for exports. Decide before work phase 04. Done in W1 R1. |

**Question**: Should Make Blueprint model system integrations as their own record type in v2.0, and what does an integration record hold?

**Why it matters**: Today integrations appear only as text: v1 rows, a `capability_type` of `integration`, a `dependency` requirement, and the `integrate` delivery value, which does not say which systems or how. Nothing records "system A sends X to system B". A capability belongs to one system and `depends_on` stays inside it, so a link across systems has nowhere to go. A baseline's current integrations are not data, so a fit-gap cannot say which integration breaks or must be rebuilt. Nobody can count integrations or find the high-effort ones. An integration is a natural unit for a Make Docs design, plan or work item, and clients usually ask for an interface list, but no record or export exists.

**Recommendation**: Add an `integration` record type, with the prefix `INT`, in v2.0. One record is one flow in one direction, from `from_system` to `to_system`, so a two-way exchange is two records, each with its own method and timing, and no separate `direction` field is needed. Fields: optional `from_capabilities` and `to_capabilities` (capability `id` values on each side, the cross-system link that `depends_on` cannot hold); `payload` (short text: the data or event that moves); `trigger` (`on-change`, `schedule` or `on-request`) and `frequency` (short text, such as nightly); `method` (`api`, `file`, `event`, `isv` or `manual`, a list the project can extend); `state` (`current` or `planned`); `replaces` (the current integrations a planned one takes over); and `effort` (the fit-gap effort list, for planned ones). The common fields add evidence, doc and work item links, `owners` and `stakeholders`. Current integrations come from extraction with evidence. Planned integrations come from analysis as drafts and cite evidence or the fit-gap or placement record that calls for them. The coverage read lists current integrations that touch a baseline system and that no planned integration replaces, so a comparison shows what may break or must be rebuilt; the exact keep, rebuild and retire rules are designed in work phase 07. A placement with delivery `integrate` links its integration records in an `integrations` field, which replaces `partner_systems` from [Q-057](#q-057-partner-systems-for-integrate). Exports gain `<comparison-ref>-integrations.csv`, a workbook sheet, a data dictionary entry and an integration part in each system's capability model document, all built from records. Field-level mapping is [Q-075](#q-075-field-level-integration-mapping), and diagrams are [Q-074](#q-074-diagram-skill-with-eraser-diagrams).

**To close**: 11 defines the type, 13 and 14 state how integration records are created and read, and 15 lists the exports.

**Owner input (2026-10-30)**: The owner proposed this record type, with `from_system`, `to_system`, `direction`, `payload`, `method`, `state`, evidence and doc links, an export and a data dictionary entry, and asked for review. The owner listed trigger and frequency among the needs. The refinements above drop `direction`, because one record is one direction, add `trigger`, `frequency`, the capability links, `replaces` and `effort`, and replace `partner_systems`.

**Resolution**: Owner accepted the recommendation with its refinements on 2026-10-30.

### Q-074 Diagram Skill With Eraser Diagrams

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | Track as an optional add-on after v2.0 exports work | Owner: [16 Workflow and Skills](16-workflow-and-skills.md), with diagram exports in [15 Exports](15-exports.md). Revisit when integration exports exist or a client asks for diagrams. |

**Question**: The owner wants the open-source Eraser Diagrams project (`eraserlabs/eraser-diagrams` on GitHub) included, possibly as an optional skill or set of skills that create advanced diagrams from JSON as HTML, PNG or SVG files, shared on their own or embedded in exports. How does it fit?

**Why it matters**: Integration flows, system landscapes and processes are easier to review as diagrams than as tables, and reviewers settle the blueprint before the Make Docs hand-off.

**Recommendation**: Defer. In the owner's testing, an agent pointed at the tool and at data that shows a process or flow draws good diagrams. A later optional skill adds guidance, such as how much detail to capture and which kind of diagram fits the situation. Eraser Diagrams uses Chromium to measure and render, so it stays an add-on outside the signed single-file CLI. Whether the CLI should also write diagram JSON from records, for diagrams that repeat exactly in exports under [Q-063](#q-063-repeatable-export-quality), is decided when the skill is planned. Make Docs could use the same skill, so it may become a shared Make Kit skill. The project is young (last pushed 2026-10-29), so check its stability when the work starts.

**To close**: A later plan decides the add-on's form and the first diagram types, such as integration sequence diagrams and system landscapes.

**Owner input (2026-10-30)**: Defer it. Pointing an agent at the tool and at flow data already works fairly well. A future optional skill could add guidance on the right amount of detail and the right kind of diagram. None of it is critical now.

### Q-075 Field-Level Integration Mapping

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | Deferred after v2.0 | Owner: [11 Record Types Reference](11-record-types-reference.md), with mapping exports in [15 Exports](15-exports.md). Revisit when an engagement needs field mappings. |

**Question**: Integration work often needs mapping files that pair each source field with a target field, with transforms. How does Make Blueprint record and export them?

**Why it matters**: Mapping files are a common review item before an integration is built, and the owner named them as a likely export.

**Recommendation**: Defer. In v2.0 an integration record's `payload` is short text. A later release adds field-level mapping on integration records and a mapping file export.

**To close**: A later plan decides the mapping shape and export.

### Q-076 Version That Requirement Marks Keep

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Marks keep a content version; the record version stays for safe writes | Owner: [09 Storage and Indexing](09-storage-and-indexing.md), [10 Records and Identity](10-records-and-identity.md), [11 Record Types Reference](11-record-types-reference.md) and [14 Fit-Gap and Placement](14-fit-gap-and-placement.md). Done in W1 R1. |

**Issue**: A requirement mark keeps the record version of the requirement it marked. The record version in [09 Storage and Indexing](09-storage-and-indexing.md#storage-interface) is the SHA-256 hash of the record file with LF line endings, so it changes on any write to the file, such as a new tag, a facet code or a schema upgrade when `setup` runs again. Each such write flags as out of date every fit-gap record that marked the requirement.

**Why it matters**: Noisy flags hide real changes, and `run compare next` sends capabilities out for scoring again for no reason.

**Recommendation**: Marks keep a content version: a hash, with LF line endings, of the fields that carry the requirement's meaning. These are `title`, `summary`, `kind`, the setting option fields (`option_values`, `option_default` and `option_scope`) and the Markdown body. For a mark on a whole capability, the hash covers the capability's `title`, `summary` and body. Tags, facets, `owners`, `stakeholders`, `audience`, links, evidence, timestamps and `schema_version` do not change it. The record version stays for safe writes.

**To close**: The owner decides, and 09, 10, 11 and 14 state it.

**Resolution**: Owner accepted the recommendation on 2026-10-30. 09 defines both values. The record version guards writes, and the content version is what a mark keeps. This replaces the W1 R1 plan's earlier call that one version value serves both.

### Q-077 Shared People and Roles File Details

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Eight rules for creating, claiming and keeping entries in `.make/personas.yaml` | Owner: [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md), [10 Records and Identity](10-records-and-identity.md), [11 Record Types Reference](11-record-types-reference.md), [13 Extraction and Review](13-extraction-and-review.md) and [17 v1 Import](17-v1-import.md), with the file itself in the repo-wide plan for the [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design. Done in W1 R1 for the Make Blueprint PRDs. The repo-wide plan carries rules 1, 2, 5 and 6 into the core. |

**Question**: [Q-072](#q-072-shared-people-and-roles-file) settles one shared `.make/personas.yaml`. Which details of that file are still open? These are the open details:

- When the core creates the file, and whether it writes the built-in `user` and `maintainer` entries.
- What happens when a `user` slug and a `maintainer` slug clash.
- What happens to an entry when its persona record is later rejected, archived or superseded.
- What happens when a persona record is approved and its slug already exists in the file.
- Whether the core's write to the file is part of the same journaled change as the approval or the import.
- Where v1 owner kinds outside `person`, `team` and `agent`, such as organization or vendor, are kept. 17 maps them to `team`, and the v1 kind is kept nowhere after the import report.
- Whether `extracted_by` and `reviewer` on extraction records in 11 become `maintainer` slugs. Also: 17 keeps v1 record `owners` slugs, but 10 refuses a slug that is not in `.make/personas.yaml`, so the import must add an entry for every owner slug it writes, including slugs that the v1 owner list does not name.

**Why it matters**: These details affect crash safety, review and the v1 import.

**Recommendation**: One rule for each detail:

1. The core creates the file on its first write. The built-in `user` and `maintainer` entries stay implicit defaults, as in Make Docs today, so the core does not write them.
2. A slug is unique across the whole file, whatever its primitive. The core refuses a clash, and the approval or import that caused it reports `blocked` and names the clash.
3. An entry stays when its persona record is archived or superseded, so every link to the slug still resolves. `project check` warns when an `active` record's `audience` names such a slug. A rejected persona record never has an entry, because the core adds the entry only at approval.
4. When a persona record is approved and its slug already exists: the record claims an unclaimed `user` entry. The approval is refused when another persona record already claims the entry, or when the entry is a `maintainer` entry.
5. The core's write to the file is part of the same journaled change as the approval or the import, so a crash never leaves the file and the records out of step.
6. The entry kinds are `person`, `team`, `organization` and `agent`. A v1 vendor or organization becomes `organization`, a v1 group becomes `team`, and any other v1 kind becomes `team` with the v1 kind kept in the entry's description.
7. `extracted_by` and `reviewer` hold a `maintainer` slug when one exists. Free text is still allowed, and `project check` reports it as information.
8. The v1 import adds an entry for every owner slug it writes, including slugs that the v1 owner list does not name.

The core rules (1, 2, 5 and 6) go into the repo-wide plan for the shared file. Each kit keeps its own rules in its own PRDs.

**To close**: Each detail has an owner and a rule.

**Resolution**: Owner accepted the eight rules on 2026-10-30. 05 states rules 1, 2, 5 and 6 as core behavior. 10 states rules 3, 4 and 7 as checks. 11 states the persona record link and the extraction fields. 13 states the reviewer rule. 17 states rules 6 and 8 for the import.

**Update (2026-10-30)**: The owner accepted two details that the PRD workers settled. A persona record claims its entry only while the record is `active`, so a record that supersedes it can claim the same entry ([10 Records and Identity](10-records-and-identity.md#people-and-role-slugs)). The v1 import gives an owner slug that the v1 owner list does not name a `maintainer` entry, with the slug as its name and the kind `team` ([17 v1 Import](17-v1-import.md)).

### Q-078 Built-In Code Lists and Their Extension Setting

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | 11 lists the built-in codes; three `lists.*` settings in `.make/blueprint/config.yaml` extend them | Owner: [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) and [11 Record Types Reference](11-record-types-reference.md). Done in W1 R1. |

**Question**: `capability_type`, `option_scope` and integration `method` each take a code from a list the project can extend. 11 names the built-in `method` values, but no PRD names the built-in values of `capability_type` and `option_scope`, and no PRD names the setting a project uses to extend any of the three lists. What are they?

**Why it matters**: Work phase 04 builds the field checks. A write cannot tell a project's own code from a typo until the lists and the setting exist, and the data dictionaries list every value with its count.

**Recommendation**: 11 lists the built-in values. For `capability_type`, they are the values used in the v1 fit-gap example: `capability`, `configuration`, `process`, `workflow`, `integration`, `report`, `data_entity`, `state_model`, `document` and `architecture`. For `option_scope`, they are `global`, `location`, `role`, `account`, `agreement`, `transaction`, `rule` and `multi`. For `method`, they stay `api`, `file`, `event`, `isv` and `manual`. Domain words, such as a pricing class, are the project's own codes. 06 names one setting under `.make/blueprint/config.yaml` that extends each list: `lists.capability_type`, `lists.option_scope` and `lists.integration_method`.

**To close**: 06 and 11 state them.

**Resolution**: Owner accepted the recommendation on 2026-10-30.

### Q-079 Integration Record Detail Rules

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Reach the fit-gap record through the placement; every capability a mark names is in `covering_capabilities` | Owner: [11 Record Types Reference](11-record-types-reference.md), [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) and [19 System Integrations](19-system-integrations.md). Done in W1 R1. |

**Question**: Two details are open. First, no field lets a planned integration name the fit-gap record that calls for it; [19 System Integrations](19-system-integrations.md) reaches that record through the placement's `integrations` list. Second, it is not decided whether every target capability that a requirement mark names must also be in the fit-gap record's `covering_capabilities`, which target-only generation reads.

**Why it matters**: A planned integration that no placement lists yet shows no fit-gap record behind it. A target capability that meets a mark but is missing from `covering_capabilities` looks unused, so target-only generation creates a `target-only` record for it.

**Recommendation**: Keep reaching the fit-gap record through the placement. Require every capability a mark names to be in `covering_capabilities`, so target-only generation stays correct.

**To close**: 11, 14 and 19 state both rules.

**Resolution**: Owner accepted the recommendation on 2026-10-30. The compare commands refuse a draft whose marks name a capability that is not in `covering_capabilities`, and `project check` reports the same fault on a hand edit with the Error code `mark-capability-uncovered`.

### Q-080 Agent Conversion for Complex PDFs

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | A guided agent route converts complex PDFs; no PDF libraries in the CLI | Owner: [12 Source Intake and Conversion](12-source-intake-and-conversion.md), with the `blueprint-convert` skill in [16 Workflow and Skills](16-workflow-and-skills.md), the review rules in [13 Extraction and Review](13-extraction-and-review.md), the source fields in [11 Record Types Reference](11-record-types-reference.md) and the command names in [08 CLI and MCP](08-cli-and-mcp.md). Done in W1 R1. Decide the open details in work phase 05. |

**Question**: The built-in PDF converter does not find tables, and it cannot read scanned pages. How does Make Blueprint convert complex PDFs while keeping the text, its meaning, links and table data intact, including nested tables?

**Why it matters**: Complex PDFs are common client sources. In v1, a multi-modal model looked at complex PDFs and wrote clean Markdown or CSV. This was the only conversion done this way. No skill guided it, but it worked moderately well.

**Recommendation**: Build out a guided agent route. Do not add PDF libraries to the CLI. Good PDF table tools (pdfplumber, Camelot, Tabula) need Python or Java, and the CLI is one signed file with no Python. Libraries still break on nested tables, merged cells and scanned pages, which are the hard cases, and the model route already works better in practice. The agent does not need to be repeatable; only its accepted output does. An accepted converted file is fixed to the source's hash, so anchors and evidence links stay stable, as they do for any converted text. The route builds on the `manual` converter and `run source convert` for supplied text.

**To close**: 12 states the route and its rules, 13 states the review, 16 names the drafting skill, and 11 lists the `agent` converter value and its provenance fields.

**Resolution**: Owner decided on 2026-10-30. The rules:

1. When it is allowed. Only for PDFs. Only when the built-in converter reports a table, a scanned page with no text layer, or a complex layout, or when a person asks for it.
2. Small batches. The CLI hands out a few pages at a time and tracks which pages are done. A large PDF never goes to the model in one piece, and work can resume after a stop.
3. Clean output. The agent writes Markdown for prose and CSV for tables, using the table files from [Q-061](#q-061-converted-csv-files-and-table-links). A nested table becomes one CSV file per level, joined by a key column. Links and footnotes are kept.
4. CLI checks. The CLI adds the anchors itself and confirms that every page is covered. Where the PDF has a text layer, it compares numbers and words against it and flags missing or invented values.
5. Provenance. The source record names the converter as `agent`, with the model name and the date.
6. Review. Agent conversions are reviewed like drafts, with flagged pages shown first. Built-in conversions still skip review ([Q-030](#q-030-source-records-skip-review)).
7. Skill. A drafting skill explains when the route is allowed and how to batch pages, keep meaning and links, and lay out nested tables.

What stays deterministic: page splitting, the text-layer checks, anchors, hashes and change detection. Only reading the page is left to the model. Bundling PDF libraries into the CLI was not chosen: it breaks the no-Python single-file rule and still fails on the hardest PDFs. Open detail for work phase 05: the exact trouble signals the built-in converter reports, and the batch size.

**Detail rules (2026-10-30)**: The owner accepted five details that fit the route into the PRDs:

1. Status. The source record stays `active`, so [Q-030](#q-030-source-records-skip-review) still holds. `conversion_status` takes `agent-in-progress` while page batches are out, and `awaiting-review` when every page is written. Extraction waits until the status is `converted`.
2. Repeat runs. The rule that the same file and converter give the same text applies to built-in converters only. Accepted agent text is kept as it is. `run source convert` makes it again only when a person asks, or when the original changes. A new model or a new CLI version never makes it again.
3. Page access. The CLI cannot call a model. It hands out page numbers, and the agent reads those pages from the original with its own tool. When that tool cannot read a page range, the CLI writes a small PDF of only those pages to `~/.make/blueprint/`, never to git. The CLI splits pages with the same JavaScript PDF reader that the built-in converter uses.
4. Scanned pages. A page with no text layer cannot be checked against one. The CLI marks it "unchecked", and review shows it first.
5. Skill. A ninth skill, `blueprint-convert`, guides the route. It is not a stage of its own. It serves the intake stage. Folding the guidance into `blueprint-intake` was not chosen, because each skill owns one clear job.

Open detail for work phase 05: where the CLI keeps page progress, in the Store or in the source record.

**Update (2026-10-30)**: The owner accepted one more detail. Each `evidence_versions` entry keeps the source's `converter` as well as its `sha256` and `converter_version`. Agent text can replace built-in text while the original's hash and the version text stay the same, so without the converter an old evidence link would not be flagged ([10 Records and Identity](10-records-and-identity.md#evidence-links)).

### Q-081 Second Reviewer for Agent Conversions

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | The second-reviewer rule does not apply to agent conversions in v2.0 | Owner: [13 Extraction and Review](13-extraction-and-review.md). Done in W1 R1. |

**Question**: The second-reviewer setting `review.second_reviewer` stops a person from approving drafts from an extraction that they ran. Does the same rule apply to agent conversions from [Q-080](#q-080-agent-conversion-for-complex-pdfs)?

**Why it matters**: An agent conversion has no `extracted_by` field, so the rule has nothing to compare. Without a decision, work phase 06 cannot build the check.

**Recommendation**: The rule does not apply to agent conversions in v2.0. The model writes the text, and the CLI checks it against the text layer. A person who reviews the conversion is not the writer.

**To close**: 13 states the rule.

**Resolution**: Owner accepted the recommendation on 2026-10-30.

### Q-082 Files in the Sources Folder That No Source Record Names

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | `project check` reports unregistered files with the Information code `source-unregistered` | Owner: [12 Source Intake and Conversion](12-source-intake-and-conversion.md), with the check code in [10 Records and Identity](10-records-and-identity.md). Done in W1 R1. |

**Question**: The [R-024](#r-024-hand-copied-files-reach-git-before-registration) rule makes git ignore a file that a person copies into `blueprint/sources/` by hand. Then the file does not show in `git status`, and no command lists it. How does a person find files that they forgot to register?

**Why it matters**: A forgotten file is never converted or extracted, so its content is missing from the analysis, and nothing warns about it.

**Recommendation**: `project check` reports each file in `blueprint/sources/` that no source record names, with the Information code `source-unregistered` and `run source add` as the next action. Converted text, table CSV files and the managed `.gitignore` and `.gitattributes` files are not reported.

**To close**: 12 states the rule, and 10 lists the code.

**Resolution**: Owner accepted the recommendation on 2026-10-30.

### Q-083 Changing the Git Level of a Source

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | A git level changes at once, through `run source add --git-level` and `run source set-level` | Owner: [12 Source Intake and Conversion](12-source-intake-and-conversion.md), with the command names in [08 CLI and MCP](08-cli-and-mcp.md). Done in W1 R1. |

**Question**: 12 says a source's `git_level` changes "through a record update". Every source record is `active` ([Q-030](#q-030-source-records-skip-review)), and on an `active` record `run record update` only records a pending change ([Q-032](#q-032-correcting-evidence-on-active-records)). How does a person change a source's git level?

**Why it matters**: Until a pending change is approved, the managed `.gitignore` does not change. A file meant for the level `none`, such as a secret original, stays open to `git add` while review waits. Make Blueprint never rewrites git history ([Q-028](#q-028-local-sources)). `run source add` also takes no level option, so a file meant for `none` is first registered at the project level.

**Recommendation**: A git level changes at once, not through review. `run source add` takes `--git-level <level>`. A new `run source set-level <source>... <level>` writes each source record and the `.gitignore` in one journaled change. A git level is a storage setting, not a claim from evidence, which is the same reason source records skip review. The other choice keeps level changes as pending changes and leaves the file open to git until approval.

**To close**: 12 and 08 state the commands.

**Resolution**: Owner accepted the recommendation on 2026-10-30.

### Q-084 Small Command and Status Defaults Found While Writing the Work Backlog

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Eight defaults that the backlog workers proposed | Owner: [08 CLI and MCP](08-cli-and-mcp.md) for command forms, with [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md), [12 Source Intake and Conversion](12-source-intake-and-conversion.md), [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), [15 Exports](15-exports.md) and [16 Workflow and Skills](16-workflow-and-skills.md). Done in W1 R1. |

**Question**: The PRDs state eight behaviors with no command form or no stated rule. What are the defaults?

**Why it matters**: Work phases cannot build or test a behavior that has no command form.

**Recommendation**:

1. `run model move <capability>... --top` moves capabilities to the top of their system's tree, and `--top` and `--parent` cannot be used together. `run model move` and `run model set-domain` take one or more capabilities, and `run model set-domain <capability>... --none` clears a domain (14 Model Stage).
2. A repeatable `--map-status <old>=<new>` option (MCP `statusMap`, in camelCase like `allowWrite`) gives the status mapping on `run model merge`, and on `run record update` when an update drops values from a system's `capability_statuses`. On an `active` system, the pending change keeps the mapping, and approval writes the system and every mapped capability in one journaled change (14 System Status Lists).
3. `--include-drafts` (MCP `includeDrafts: true`) on `run export fit-gap`, `run export system` and `run export all` adds `draft` records to an export (15 Status Filter).
4. `run compare create` makes an `active` comparison. A comparison states the scope a person chose, not a claim from evidence. Fit-gap, `target-only` and placement records still start as `draft` ([Q-034](#q-034-analysis-records-start-as-drafts)).
5. `run record create` refuses the types that have their own create command (`source`, `extraction`, `comparison`, `fit-gap` and `placement`) and names that command.
6. `run place link` takes a placement or an integration record and stores `work_items` and `docs` at once on either one, also on an `active` record, because Make Docs links are not facts (16 Hand-Off Skill).
7. When the Make Docs block has no handoff line, `setup` and `project status` tell the person to update Make Docs with its own update command and then run `make-blueprint setup` again. Work phase 01 confirms the exact Make Docs command (05 Handoff Line).
8. Bare `make-blueprint` never offers to start setup, because it never writes. In a folder that is not set up, it names `make-blueprint setup` as the next action (08).

Also: `source-unregistered` skips files that converted text links to, such as the images that v1 converted text keeps beside it (17).

**To close**: The owner confirms, and 05, 08, 12, 14, 15 and 16 state each default.

**Resolution**: Owner accepted all eight defaults and the `source-unregistered` note on 2026-10-30.

### Q-085 What a System Package Holds

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | A system package holds the model of its systems, and only `active` records | Owner: a system packages PRD, which does not exist yet. [Q-093](#q-093-where-system-package-work-goes) places the work, and [Q-095](#q-095-documents-written-now-for-system-packages) sets when the PRD is written. |

**Question**: A team that builds a product models it as one or more systems in its own Make Blueprint project. Other teams want that model as a baseline in their own projects, so they do not start from nothing. A system package is a versioned bundle of one or more systems and their data, which one project makes and other projects take in. Which records does a package hold?

**Why it matters**: Too little, and the other team rebuilds the model by hand. Too much, and the package carries the maker's own analysis and internal notes into other teams' projects.

**Recommendation**: A package holds the model only, and only `active` records: the chosen systems, their capabilities and requirements, the domains those capabilities use, the persona records for those systems, and the integrations whose two ends are both in the package. Findings, extractions, comparisons, fit-gap records and placements stay in the maker's project. `draft`, `rejected`, `superseded` and `archived` records also stay. The other choice takes every record that links to the systems, analysis too. The analysis states the maker's own decisions, and the other team makes its own comparisons.

**To close**: The system packages PRD lists the record types and statuses that a package holds.

**Resolution**: Owner accepted the recommendation on 2026-10-31.

### Q-086 Sources and Evidence in a System Package

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Source records and their converted text travel; original files never do | Owner: a system packages PRD, which does not exist yet. [Q-093](#q-093-where-system-package-work-goes) places the work, and [Q-095](#q-095-documents-written-now-for-system-packages) sets when the PRD is written. |

**Question**: Records in a package keep their evidence links, and each link names a source and an anchor in its converted text. What does a package carry for sources?

**Why it matters**: Without the converted text, the other project cannot check evidence links. Originals can be large, and they can hold more than the maker wants to share.

**Recommendation**: A package carries the source record and the converted text of each source that its records' evidence names. It never carries an original file. A source at the git level `none` travels as a source record with no text, and its evidence links stay. Before the package is made, the maker sees every source that will go out and confirms the list. The other choice carries the originals too.

**To close**: The system packages PRD states what a package carries for each git level, and 12 states how a source from a package shows in the other project.

**Resolution**: Owner accepted the recommendation on 2026-10-31. Note: no new check code is needed. In the other project, each source from a package takes the git level `converted`, or keeps `none`. The original is then a file kept out of git that is absent, which is the normal "missing" state in [12 Source Intake and Conversion](12-source-intake-and-conversion.md#source-git-levels-and-the-missing-state).

### Q-087 System Package Format

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | One versioned bundle file that holds a plain folder; no live pull from another project | Owner: a system packages PRD, which does not exist yet. [Q-093](#q-093-where-system-package-work-goes) places the work, and [Q-095](#q-095-documents-written-now-for-system-packages) sets when the PRD is written. |

**Question**: Does a package travel as one bundle file or as a folder of files? Can a project also pull systems straight from another project's folder?

**Why it matters**: Packages go to other machines and other companies. A pull from a live project takes half-done work and gives later versions nothing to compare against.

**Recommendation**: A package is one versioned bundle file, such as `acme-erp-2.3.0.blueprint.zip`. Inside is a plain folder: a `manifest.yaml`, the record files in the same format as `blueprint/records/`, and the converted text. The step that takes a package in also reads the unzipped folder, so a team can keep packages in git or on a shared drive. No command pulls straight from another project's live folder. A version is a fixed snapshot that the maker chose to release. The other choice is a live pull from the other project's folder.

**To close**: The system packages PRD states the bundle layout, the manifest fields and the file name.

**Resolution**: Owner accepted the recommendation on 2026-10-31.

### Q-088 Changes to Records From a System Package

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | The taking project owns editable copies with an `origin` stamp; a new version reaches changed copies as pending changes | Owner: a system packages PRD, which does not exist yet. [Q-093](#q-093-where-system-package-work-goes) places the work, and [Q-095](#q-095-documents-written-now-for-system-packages) sets when the PRD is written. |

**Question**: After a project takes in a package, can its team change those records? What happens when the maker releases a new version?

**Why it matters**: Teams must fix and tune a baseline for their own needs. A new version must not wipe out their changes, and it must not need a review of every record.

**Recommendation**: Yes. Each record from a package is `active`, and it is an ordinary record that the team can change. It carries an `origin` stamp that names the package, the version and the upstream `id`. With a new version, a record that the team did not change takes the new version at once. A record that the team did change gets the upstream change as a pending change for review (see [Q-032](#q-032-correcting-evidence-on-active-records)). The team's own records, such as new capabilities and requirements under a system from the package, are never touched. A change to tags, facets or owners does not count as a change. The other choice locks records from a package, so the team can only put its own records around them.

**To close**: The system packages PRD states the `origin` stamp and the rules for a new version, and 10 lists `origin` with the common fields.

**Resolution**: Owner accepted the recommendation on 2026-10-31.

### Q-089 Ids and Refs of Records From a System Package

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Keep the upstream `id` when it is free; mint a new local `ref`; keep the upstream ref as an alias with the package name in front | Owner: a system packages PRD, which does not exist yet. [Q-093](#q-093-where-system-package-work-goes) places the work, and [Q-095](#q-095-documents-written-now-for-system-packages) sets when the PRD is written. |

**Question**: Records from a package already have an `id` and a `ref` from the maker's project. Which ones do they keep in the taking project?

**Why it matters**: Refs are numbers that each project mints, so `CAP-118` can name a different record in each project. A changed `id` would force every relation field and evidence link to be written again.

**Recommendation**: A record keeps its upstream `id` when no record in the taking project uses it. Otherwise it gets a new `id`. The `origin` stamp always keeps the upstream `id`, so a new version finds its records through the stamp. Each record gets a new local `ref` from the project's own counters. Its upstream ref becomes an alias with the package name and a dot in front, such as `acme-erp.CAP-118`, which the alias rules in [10 Records and Identity](10-records-and-identity.md#aliases-and-name-lookup) allow. The other choice mints a new `id` for every record.

**To close**: The system packages PRD states the rules, and 10 states that a package alias is kept for good like any alias.

**Resolution**: Owner accepted the recommendation on 2026-10-31.

### Q-090 Shared Lists and People From a System Package

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Lists merge by code; `audience` slugs get `user` entries; upstream owners and stakeholders are dropped | Owner: a system packages PRD, which does not exist yet. [Q-093](#q-093-where-system-package-work-goes) places the work, and [Q-095](#q-095-documents-written-now-for-system-packages) sets when the PRD is written. |

**Question**: A package uses lists and names that the taking project also has: domains, `lists.*` codes, facets, tags and slugs from `.make/personas.yaml`. How do they merge?

**Why it matters**: Teams compare systems by domain. Separate lists for each package break those comparisons. Upstream owner slugs name people in another team or company.

**Recommendation**: Lists merge by code. A domain from the package joins the local domain with the same code, or is created when no local domain has that code. Codes that the project does not list go into the `lists.*` settings in `.make/blueprint/config.yaml`. Each `audience` slug gets a `user` entry in `.make/personas.yaml`, written through the core, as in the v1 import. Upstream `owners` and `stakeholders` are dropped. Facets and tags stay in the maker's project unless the maker names them when the package is made. The plan shows every merge, and a code that has a different name on each side gives a Warning. The other choice keeps each package's lists apart with a prefix, such as the domain `ACME-BIL`.

**To close**: The system packages PRD states the merge rules and the Warning code.

**Resolution**: Owner accepted the recommendation on 2026-10-31.

### Q-091 Record That Tracks a System Package

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | A new record type `package`, prefix `PKG` | Owner: a system packages PRD, which does not exist yet. [Q-093](#q-093-where-system-package-work-goes) places the work, and [Q-095](#q-095-documents-written-now-for-system-packages) sets when the PRD is written. |

**Question**: A taking project must know which packages it holds, at which version, and which records came from each. Where does it keep that?

**Why it matters**: A new version needs the old version to compare against. A person needs to see in git when a package changed.

**Recommendation**: A new record type `package`, with the prefix `PKG`, in `blueprint/records/package/`. It holds one record for each package that the project took in, with the package `name`, the `version`, the `publisher`, the systems it brought and the bundle's SHA-256 hash. A new version writes the same record, so the git diff shows the change. The `origin` stamp of each record from the package names the `PKG` id. The other choice is a `packages:` list in `.make/blueprint/config.yaml`. Config holds settings that a person chooses, not data that the tool writes.

**To close**: The owner confirms, and the system packages PRD and 11 state the type.

**Resolution**: Owner accepted the recommendation on 2026-10-31.

### Q-092 A New Version of a System Package

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Show a plan, then write it in one journaled change; review only what the team changed | Owner: a system packages PRD, which does not exist yet. [Q-093](#q-093-where-system-package-work-goes) places the work, and [Q-095](#q-095-documents-written-now-for-system-packages) sets when the PRD is written. |

**Question**: What happens when a project takes in a new version of a package that it already holds?

**Why it matters**: A new version can change hundreds of records. A review of each one buries the person, but changes that touch the team's own work must not go through silently.

**Recommendation**: The command shows a plan first and then writes it in one journaled change, as the v1 import does. A record that is new upstream arrives `active`. A record that changed upstream and that the team did not change is written at once; the person's approval of the plan is its review. A record that the team changed gets the upstream change as a pending change. A record that is gone upstream becomes `archived` when the team did not change it and no local record links to it. Otherwise it stays `active` with a Warning, and the person decides. Fit-gap marks on changed requirements show through the current `marks-out-of-date` Warning. The command refuses a version that is the same as or lower than the one the project holds. The `origin` stamp keeps a hash of the fields that the package carries, so the command can tell what the team changed. The other choice sends every upstream change through review.

**To close**: The owner confirms, and the system packages PRD states the rules.

**Resolution**: Owner accepted the recommendation on 2026-10-31.

### Q-093 Where System Package Work Goes

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | A new wave, `W2 R0`; `W1 R1` takes only a small change in place | Owner: [01 Product Overview](01-product-overview.md#release-scope), with [08 CLI and MCP](08-cli-and-mcp.md), [10 Records and Identity](10-records-and-identity.md) and [17 v1 Import](17-v1-import.md). |

**Question**: Do system packages join the `W1 R1` work, so v2.0 ships with them, or do they start a new wave?

**Why it matters**: A new phase in `W1 R1` holds back v2.0. A new wave must not miss anything that v2.0 has to build first.

**Recommendation**: System packages start a new wave, `W2 R0`. The Make Docs wave model starts a new wave for a new end-to-end piece of work. v2.0 needs no rebuild for packages: ids are random, so they stay safe across projects; each record is one file, so it copies cleanly; the content version ([Q-076](#q-076-version-that-requirement-marks-keep)) shows changes in meaning; pending changes give a new version a review path; and the v1 import already shows a plan before it writes. `W1 R1` takes a small change in place, with no new revision: a planned-scope row in [01 Product Overview](01-product-overview.md#release-scope), the reserved `run package` command group in [08 CLI and MCP](08-cli-and-mcp.md), which answers that it is planned, the way `serve` does, the reserved `origin` field name, and a rebuild note in [17 v1 Import](17-v1-import.md) that keeps the import plan and write steps apart from the v1 reader so that the package import can use them. The other choice is a new phase in `W1 R1`.

**To close**: The owner confirms, and 01, 08, 10 and 17 state the reserved names and the planned scope.

**Resolution**: Owner accepted the recommendation on 2026-10-31.

### Q-094 Release That Carries System Packages

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | System packages are v2.1; the local server and UI move to v2.2, and test records move to v2.3 | Owner: [01 Product Overview](01-product-overview.md#release-scope), with every PRD that names a release. |

**Question**: Releases v2.1 (local server and UI) and v2.2 (test records) are already planned. Which release carries system packages?

**Why it matters**: Packages are the main reason for v2. They need only the CLI and the MCP server, which v2.0 builds, so they can ship sooner than a server and a web app.

**Recommendation**: System packages are v2.1. The local server, the web app and MCP App views move to v2.2. Test case, run, result and playbook records move to v2.3. Setup C stays v3. Every release label in the PRD set and this register moves with them. The other choice keeps the current numbers and makes packages v2.3.

**To close**: The owner confirms, and every PRD shows the new release labels.

**Resolution**: Owner accepted the recommendation on 2026-10-31.

### Q-095 Documents Written Now for System Packages

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Now: the design, the PRD and the `W2 R0` plan; the `W2 R0` work backlog when v2.0 ships | Owner: the system packages design and the `W2 R0` plan, which do not exist yet. |

**Question**: Which documents for system packages are written now, and which wait?

**Why it matters**: Decisions that live only in a chat are lost. A work backlog written long before the code it builds on tends to go out of date.

**Recommendation**: Now: a design at `docs/designs/2026-10-31-system-packages.md`, a new PRD `20-system-packages.md` that states the planned v2.1 scope, the small `W1 R1` change from [Q-093](#q-093-where-system-package-work-goes), and the `W2 R0` plan under `docs/plans/`. When v2.0 ships: the `W2 R0` work backlog, written from the PRD as it then stands. The other choice also writes the `W2 R0` work backlog now.

**To close**: The owner confirms, and each document exists at its path.

**Resolution**: Owner accepted the recommendation on 2026-10-31.

## Rebuild Risks

### R-001 Core Release Friction

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md). Work phase 01. |

**Issue**: A core change needs a core release of `@brucewaynedecoy/make-core`, from `packages/core/` in the make-kit monorepo, before a Make Blueprint release can use it. Step 0, which is repo-wide work, and the Make Docs changes that Make Blueprint needs sit on the critical path for v2.0.

**Why it matters**: A late core release holds every v2.0 release build.

**Recommendation**: Plan core work first, use the workspace link only in development, and have release builds fail on a workspace link or an unpublished core.

**To close**: The pinned core is published before v2.0 release work starts.

### R-002 Two Core Versions in One Project

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md). Work phase 01. |

**Issue**: Each tool pins its own core, so Make Docs and Make Blueprint can run different core versions in one project.

**Why it matters**: A change to the block tag format, block order, the handoff-line rule, the presence rule, the `.make/` layout or the format of the shared `.make/config.yaml` and `.make/personas.yaml` in one core version breaks the other tool.

**Recommendation**: Treat those on-disk contracts as breaking changes, and test both tools on different core versions.

**To close**: A cross-version test runs in the install matrix.

### R-003 Both Tools Write One Root File at Once

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md). Work phases 01 and 02. |

**Issue**: Make Docs and Make Blueprint may write the same root `AGENTS.md` or `CLAUDE.md` at the same moment.

**Why it matters**: One write can drop the other tool's block or user text.

**Recommendation**: Make Blueprint reads the file again just before it writes, and refuses when the file changed since it planned the write.

**To close**: A concurrent-write test passes.

### R-004 Start Time of the Single-File CLI and MCP Server

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | Performance candidate, no target | Owner: [07 Installation and Distribution](07-installation-and-distribution.md). Work phase 02 creates the `PERF-###` profile after the first signed single-file build; work phase 09 runs it again on the release build. |

**Issue**: Agents call the CLI many times in one task. A slow start in the compiled single file slows every task. v1 chose Go after a runtime benchmark.

**Why it matters**: It decides whether the TypeScript single-file build is acceptable.

**Recommendation**: Characterize start time as a baseline under the [Performance Evidence Governance Contract](make-docs://system/contract/performance-evidence-governance.md). This register sets no target.

**To close**: The `PERF-###` profile records the baseline, and the owner decides whether a target is needed.

### R-005 Packagers That Unpack to a Temporary Folder

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [07 Installation and Distribution](07-installation-and-distribution.md). Work phase 02. See [Q-006](#q-006-single-file-packaging-and-code-signing). |

**Issue**: Some single-file packagers unpack programs into a temporary folder at start.

**Why it matters**: Locked-down machines often block programs that run from temporary folders, which breaks the one-install promise.

**Recommendation**: Choose a build method that runs from the signed file itself, and test it on a locked-down machine.

**To close**: The chosen method passes the locked-down machine check in work phase 09.

### R-006 Index Rebuild and Query at Large Project Size

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | Performance candidate, no target | Owner: [09 Storage and Indexing](09-storage-and-indexing.md). Work phase 03 creates the `PERF-###` profile before its first measurement. |

**Issue**: One file per record grows to thousands of files. A project the size of client-b-v3 has about 280 sources and several thousand records.

**Why it matters**: Status and query answers must come without waits that break a person's flow. It decides whether a full rebuild holds or the index must change only rows for changed files.

**Recommendation**: Characterize rebuild, freshness checks and common queries on a synthetic project of that size, as a baseline under the [Performance Evidence Governance Contract](make-docs://system/contract/performance-evidence-governance.md). This register sets no target.

**To close**: The `PERF-###` profile records the baseline, and the owner decides whether a target is needed.

### R-007 Interface Built Before a Second Real Backend

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [09 Storage and Indexing](09-storage-and-indexing.md). Work phase 03. |

**Issue**: The storage interface is built before the database backend exists.

**Why it matters**: An interface that returns file paths, assumes git or relies on directory scans cannot take the setup C backend.

**Recommendation**: Run the interface conformance tests against the in-memory backend from the start.

**To close**: The in-memory backend passes the same conformance tests as the file backend.

### R-008 `updated_at` Conflicts on Merge

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [09 Storage and Indexing](09-storage-and-indexing.md). Work phase 03. |

**Issue**: Two branches that change different fields of one record both change `updated_at`, so git reports a conflict on that line.

**Why it matters**: Every such merge needs a hand fix, which wears down the git review promise.

**Recommendation**: Offer a merge helper for the timestamp line, or derive the time from git history.

**To close**: 09 names the approach, and a two-branch test merges cleanly.

### R-009 Journal Lost With the Store

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [09 Storage and Indexing](09-storage-and-indexing.md). Work phase 03. |

**Issue**: The write journal lives in the machine Store. If the Store is lost after a crash, a half-done change cannot be found.

**Why it matters**: Records could stay half changed with no warning. The risk is low.

**Recommendation**: Have `project check` flag record sets that look half changed, such as a merge with links left on both records.

**To close**: The owner accepts the risk or 10 adds a check.

### R-010 Status and Check Disagree

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [08 CLI and MCP](08-cli-and-mcp.md), [09 Storage and Indexing](09-storage-and-indexing.md) and [10 Records and Identity](10-records-and-identity.md). Work phases 03 and 08. |

**Issue**: `project status` shows counts of ref clashes, broken links and stale evidence, and `project check` reports the same problems.

**Why it matters**: Different counts in two commands destroy trust in both.

**Recommendation**: Hold anchors and source hashes in the index so both commands read one source of counts, and test that they agree.

**To close**: A test shows equal counts on fixtures with each problem.

### R-011 Two IDs for One Record

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [10 Records and Identity](10-records-and-identity.md). Work phase 03. |

**Issue**: Each record has a permanent `id` and a friendly `ref`, which adds one concept.

**Why it matters**: People confused by two names may link by `ref` in hand edits.

**Recommendation**: Show `ref` and title in human output, keep `id` in machine output and record detail, and accept any name in commands.

**To close**: Human Experience Review of status and record output in work phase 09.

### R-012 Hand Edits

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [10 Records and Identity](10-records-and-identity.md). Work phase 03. |

**Issue**: People can edit record files by hand. `project check` finds bad edits but cannot stop them.

**Why it matters**: A bad edit can break links or status rules until someone runs `project check`.

**Recommendation**: Run the freshness check and the relevant checks on every read, and name the fix for each problem.

**To close**: `project check` catches every hand-edit case in its catalog on fixtures.

### R-013 `make-blueprint://` URIs in Make Docs Link Checks

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [08 CLI and MCP](08-cli-and-mcp.md). Work phase 02. |

**Issue**: Make Docs link rules accept only http, https, mailto and `make-docs` as link targets.

**Why it matters**: A Markdown link to a `make-blueprint://` URI fails Make Docs validation in a shared project.

**Recommendation**: Write `make-blueprint://` URIs as inline code only, and have the core accept each installed tool's scheme.

**To close**: Routers and skills pass Make Docs path validation.

### R-014 Duplicate MCP Tool Names Across Servers

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [08 CLI and MCP](08-cli-and-mcp.md). Work phase 08. |

**Issue**: `project_status`, `resource_list` and `resource_read` exist on both the Make Docs and Make Blueprint MCP servers.

**Why it matters**: An agent with both servers may call the wrong tool.

**Recommendation**: Start every Make Blueprint tool title with "Make Blueprint", as 08 requires.

**To close**: Tests check every tool title.

### R-015 Runaway Read-Only SQL

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [08 CLI and MCP](08-cli-and-mcp.md), with the index in [09 Storage and Indexing](09-storage-and-indexing.md). Work phase 03. |

**Issue**: Read-only SQL has a row cap but no time limit.

**Why it matters**: One slow query can hang an agent session.

**Recommendation**: Add a time or step limit if the `node:sqlite` runtime allows one.

**To close**: 08 states the limit, or the owner accepts the risk.

### R-016 Conversion Quality and Moving Anchors

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [12 Source Intake and Conversion](12-source-intake-and-conversion.md). Work phase 05. |

**Issue**: Built-in TypeScript conversion of pdf and pptx may lose detail compared with outside tools, and a new converter version can move anchors and table positions.

**Why it matters**: Extraction quality depends on conversion, and moved anchors break evidence links.

**Recommendation**: Keep supplied text as a way around weak conversion, version every converter, and have `project check` flag links made with an older version.

**To close**: Converter tests on fixtures of each type pass, and the changed-version check works.

### R-017 Git LFS Limits and Repository Size

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [12 Source Intake and Conversion](12-source-intake-and-conversion.md), with imported originals in [17 v1 Import](17-v1-import.md). Work phases 05 and 09. |

**Issue**: Some clients do not allow Git LFS. Imported originals sit beside v1 `assets/`, and client-b-v3 is 226 MB.

**Why it matters**: Large plain-git repositories are slow to clone and cannot be shrunk without rewriting history.

**Recommendation**: Use Git LFS where allowed, which is the default for originals of 50 MB or more that git tracks (see [Q-029](#q-029-git-lfs-setting-and-size-threshold)). Where it is not allowed, keep large originals out of git with the source git level `converted` or `none` (see [Q-028](#q-028-local-sources)). Delete v1 assets after the import is accepted.

**To close**: 12 and 17 give the guidance, and the import report names the size.

### R-018 Duplicate-Hint Calls Slow Bulk Extraction

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [13 Extraction and Review](13-extraction-and-review.md). Work phase 06. |

**Issue**: Showing duplicate hints before each create needs two calls per record.

**Why it matters**: Bulk extraction over hundreds of sources may slow down.

**Recommendation**: Tune the hint call on fixtures, and let one call return hints for several candidates.

**To close**: Fixture runs show acceptable extraction pace.

### R-019 The Fit-Gap Model Rests on One Example

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [14 Fit-Gap and Placement](14-fit-gap-and-placement.md). Work phase 07. |

**Issue**: The model generalizes from one strong capability-level fit-gap. Client C starts on v1 and moves to v2 with the v1 import (see [Q-071](#q-071-v1-import-release-and-client-c)), so its first v2 comparison with several baseline systems is the model's first real test. The requirement marks and the verdict table from [Q-066](#q-066-requirement-marks-and-the-verdict-rule) are untested on real data too.

**Why it matters**: Verdicts, delivery values or export columns may not fit a comparison with several baselines.

**Recommendation**: Test a fixture with several baseline systems in phase 07, and review the model after Client C's first v2 comparison.

**To close**: The several-baseline fixture passes, and Client C's comparison is reviewed.

### R-020 Comma-Decimal Locales

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [15 Exports](15-exports.md). Work phase 07. |

**Issue**: Where the decimal mark is a comma, Excel opens a comma-delimited CSV file in one column.

**Why it matters**: Clients in those locales see a broken file.

**Recommendation**: Point those clients to the xlsx workbook, which opens the same in every locale.

**To close**: 15 states the guidance, and the workbook is checked in a comma-decimal locale.

### R-021 Client C v1 Data Shapes

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [17 v1 Import](17-v1-import.md). Work phase 09. |

**Issue**: Client C starts its blueprint work on v1 on 2026-11-03 and produces v1 data while v2 is built, so its project may hold shapes no fixture covers. As of 2026-10-30 it has only set up its project folder.

**Why it matters**: The import must handle whatever Client C creates, or Client C's knowledge is lost.

**Recommendation**: Run a dry run on a scrubbed Client C copy, kept outside the repository, before release, and report every unknown shape instead of dropping it.

**To close**: The dry run reports no unhandled shape.

### R-022 No Login on a Shared Machine

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [18 Local Server and UI](18-local-server-and-ui.md). v2.2. |

**Issue**: The local server needs no login. Other users on the same machine can reach a loopback port.

**Why it matters**: They can read project data through the server.

**Recommendation**: Print a URL that carries a random token, and refuse requests without it.

**To close**: 18 states the rule for v2.2.

### R-023 Mods API Changes

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [18 Local Server and UI](18-local-server-and-ui.md). Outside the release plan. |

**Issue**: The Claude Code mods API may change between releases.

**Why it matters**: Anything built on it may break without notice.

**Recommendation**: Build nothing on it. A future mod gets its data from the same view-model calls.

**To close**: Nothing in v2 depends on the mods API.

### R-024 Hand-Copied Files Reach Git Before Registration

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | Ignore originals by pattern at the levels `converted` and `none` | Owner: [12 Source Intake and Conversion](12-source-intake-and-conversion.md). 12 states the rule. The test is built in work phase 05. |

**Issue**: The managed `blueprint/sources/.gitignore` lists files by name, so a file that a person copies into `blueprint/sources/` by hand is not ignored until `run source add` registers it. Under the levels `converted` and `none`, a secret original can be committed before that.

**Why it matters**: A file that reaches git stays in its history, and Make Blueprint never rewrites history (see [Q-028](#q-028-local-sources)).

**Recommendation**: When the project level is `converted` or `none`, the managed `.gitignore` ignores originals by pattern and lists only the files to keep, such as the converted text at `converted`, so a hand-copied original is ignored at once.

**To close**: 12 states the rule, and a test copies a file by hand and confirms that git ignores it.

**Owner input (2026-10-30)**: The owner accepted the recommendation. The risk stays open until the work phase 05 test passes.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Performance Evidence Candidates; Consequences: trade-offs and risks)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Performance Evidence Plan, Dependencies)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md`
- `~/.make/blueprint/`
- `blueprint/exports/`

## Deferred Obligations

### O-001 Confirm Make Docs Links in Project Check

| Field | Value |
| --- | --- |
| ID | O-001 |
| Title | Confirm Make Docs links in project check |
| Status | Deferred |
| Summary | `project check` confirms Make Docs work item IDs and doc paths through a Make Docs read command and stops skipping them. |
| Source authority | [Q-024](#q-024-make-docs-link-check-interface); [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md); [10 Records and Identity](10-records-and-identity.md) |
| Owner | The Make Kit repository owner |
| Target coordinate | Owner-routed: the first Make Blueprint plan revision after the Make Docs release that carries the read command |
| Future trigger | Make Docs ships one read command with JSON output that confirms work item IDs and doc paths |
| Dependencies | The Step 0 Make Docs changes in the repo-wide plan |
| Acceptance exit criteria | `project check` confirms Make Docs links through that command; the skip message and skip count are gone; tests cover a project with and without Make Docs installed |
| Related requirements and findings | Make Docs link rules in 05 and the `project check` catalog in 10 |
| History / disposition note | Created on 2026-10-30 from the owner's answer to Q-024. The skip is a temporary workaround and must not become the normal behavior. |

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md`
- `docs/prd/01-product-overview.md` to `docs/prd/19-system-integrations.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/15-agent-instruction-ownership-and-managed-blocks.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/docs/prd/03-open-questions-and-risk-register.md`
