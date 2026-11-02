---
title: "17 v1 Import"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 17 v1 Import

## Purpose

Make Blueprint imports BuildOS v1 projects. One command, `run import v1`, reads a v1 project folder and writes the same knowledge as Make Blueprint records, source records and project settings. It writes into the v1 project folder itself, beside the v1 files, and never changes them. After the person accepts the result, the person deletes the v1 folders. v1 IDs such as `REQ-001` become `ref` values, so people keep the names they already know. Every imported record also gets a new permanent `id`, such as `REQ-7kq2m7k2`, and every link uses that `id`.

The import exists because v1 projects are still in use. BuildOS v1 receives bug fixes only and gets no new features. Client C is the first user of this path. Its project is shaped like the fresh v1 project client-c-implementation, and it keeps producing v1 data while v2.0 is built. So the import handles every shape the v1 contracts allow, including the files of the v1 bulk-extract skill, and it reports anything else it finds instead of dropping it.

The import ships in v2.0. It runs once for each project. It always shows a dry-run report before it writes, and it never changes or deletes a v1 file.

## Scope

This PRD covers:

- the `run import v1` command, with its dry run and its write
- how each v1 shape maps to v2.0 records, refs, evidence and links
- what happens to v1 items that do not map, including the types that arrive in v2.3
- how the import treats the files of the old bulk-extract skill in `extractions/`
- the fixtures the import is tested on, and the end-to-end check of an imported project

Other PRDs own the parts the import relies on:

| Topic | Owner |
| --- | --- |
| Command grammar, option names, and human and JSON output | [08 CLI and MCP](08-cli-and-mcp.md) |
| Record files, the shared write lock, the write journal and the local index | [09 Storage and Indexing](09-storage-and-indexing.md) |
| `id` and `ref` rules, ref counters, aliases, evidence link checks, `project check` and the ref-fix command | [10 Records and Identity](10-records-and-identity.md) |
| Fields and links for each record type | [11 Record Types Reference](11-record-types-reference.md) |
| Source records, source git levels, converted text, anchors and Git LFS | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| Extraction records, part coverage, drafts and review | [13 Extraction and Review](13-extraction-and-review.md) |
| The model stage, which fills system, capability and domain fields | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| Make Docs links, ownership of `docs/`, and the shared `.make/config.yaml` and `.make/personas.yaml` that the core writes | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| Project layout, routers and `setup` | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md), [07 Installation and Distribution](07-installation-and-distribution.md) |

Not in scope:

- Ongoing sync between a v1 project and a Make Blueprint project. The import is one-way and runs once.
- Importing into a project that already holds Make Blueprint records.
- Test case, run, result and playbook records in v2.0. Those types arrive with v2.3. See [Items That Do Not Map](#items-that-do-not-map).
- v1 skills, scripts, contracts and templates. `setup` installs Make Blueprint's own skills. See [07 Installation and Distribution](07-installation-and-distribution.md).
- The v1 Azure Boards export. It belongs to Make Docs, which owns the backlog. See [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 15: release plan and v1; section 16: decisions on the v1 import, the shared files, source git levels and table CSV files; Consequences: Client C on v1, and Left for planning: the detailed v1 import mapping)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/09-v1-import-and-release.md` (Scope)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Design Inputs: open input questions)

## Component and Capability Map

The import has five parts that run in order.

```text
  v1 files in the project folder (read only)
        |
        | 1 read: .os/data, .os/config, .os/indexes, assets,
        |         original files, workspace, extractions
        v
  2 plan: assign refs and new ids, map fields, rewrite links,
          resolve evidence anchors, sort every item into one outcome
        |
        v
  3 dry-run report --- blocking problem? ---> stop and name the fix
        |
        | the person runs the write
        v
  4 write: one journaled change under the shared write lock          [09]
        |
        v
  5 after-import check: rebuild the index, project check,
                        project status                               [08, 10]
```

| Part | What it does | Release |
| --- | --- | --- |
| Reader | Reads every v1 file the import knows, and lists every other file it finds as not imported | v2.0 |
| Planner | Assigns a `ref` and a new `id` to each item, maps fields, rewrites links to new `id` values, resolves evidence anchors, and sorts each item into one outcome | v2.0 |
| Dry-run report | Shows the plan: counts, outcomes, follow-ups and blocking problems. It writes nothing. | v2.0 |
| Writer | Writes records, source records, original files, converted text and project settings as one journaled change. Through the core, it also writes the project `name` in `.make/config.yaml` and the entries in `.make/personas.yaml`. | v2.0 |
| After-import check | Rebuilds the index, runs the `project check` command and shows the `project status` command's output (see [08 CLI and MCP](08-cli-and-mcp.md)) | v2.0 |

Requirements:

- `run import v1 <v1-project>` with no write option is a dry run. It writes no file in the project folder.
- The write needs an explicit write option. [08 CLI and MCP](08-cli-and-mcp.md) names it. The write builds the plan again from the current files and shows the same report before it writes, so its result matches a dry run taken on the same files.
- The import writes into the v1 project folder itself. A person runs `setup` in that folder first, so Make Blueprint's files sit beside the v1 files. In that folder, the import writes only under `blueprint/` and `.make/`, the folders that Make Blueprint and the core own (see [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md)).
- The import never changes, moves or deletes a v1 file.
- After the person accepts the result, the person deletes the v1 folders, such as `.os/`, `assets/`, `workspace/`, `extractions/`, `playbooks/` and the v1 skill folders. The import never deletes them. Until the person does, the v1 files stay in place, and git history keeps them afterwards.
- The project must already have Make Blueprint set up, and it must hold no records. Otherwise the dry run reports a blocking problem and the write refuses. A second import into an imported project refuses for the same reason.
- While any blocking problem remains, the write refuses. The report names each blocking problem and the action that clears it.
- The write is one journaled change under the shared write lock. After a crash, the next command finishes or undoes it, so a project never holds half an import. See [09 Storage and Indexing](09-storage-and-indexing.md).
- The import is deterministic. The same v1 files give the same refs, the same outcomes and the same report on every run. Only the random `id` values differ between two writes.
- After the write, the command rebuilds the index, runs `project check` and shows `project status`. The problems `project check` reports are exactly the follow-ups the import report listed.
- The import works offline, needs no Python, and reads v1 paths correctly on macOS, Windows and Linux.

The import serves these human outcomes, under the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md):

- A person who knew a record as `REQ-014` in v1 finds the same record as `REQ-014` after the import, by `ref`, in every command and export.
- A person who knew a source as `REF-012` in v1 finds its source record by that name, because every v1 reference ID becomes an alias of its source record.
- The dry-run report starts with one summary that says whether the write can run, how many items import cleanly, how many import with a follow-up, how many wait for v2.3 and how many do not import. It ends with the next useful action. Detail for every item is in the same report and in JSON output with the same meaning.
- The report names every v1 item that does not import cleanly by its v1 ID or path, with the reason and the step that settles it. No item is left out of the report.
- After the write, `project status` shows the imported sources, their extraction progress and the drafts waiting for review, so the person picks up the workflow where v1 left off.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 8: storage; section 9: identity; Human Experience Intent)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/09-v1-import-and-release.md` (Testing Decisions: Guided Progress Review)
- `blueprint/records/<type>/<id>.md`
- `blueprint/sources/`
- `.make/blueprint/`

## Contracts and Data

### v1 Inputs

| v1 path | What it holds | Import treatment |
| --- | --- | --- |
| `.os/data/*.jsonl` | Canonical v1 records, one JSON object per line: requirements, capabilities, personas, findings, extractions, test cases, results and runs | Records. See [Record Mapping](#record-mapping). |
| `.os/config/instance.yaml` | Instance name, systems, environments, owners and default scope | System records, project settings, the project `name` in `.make/config.yaml`, and `maintainer` entries in `.make/personas.yaml` for the owners and for every other owner slug that the import writes on a record |
| `.os/indexes/references.json` | One entry per converted part: `REF-NNN`, original path, converted path, hash, type, converter, timestamp and status | Source records |
| `assets/<source-slug>/` | Converted twins (v1 converted text files with YAML front matter) and side files such as images | Converted text of source records |
| The original file named by each reference entry's `source` path | Original source files | Copied into `blueprint/sources/` |
| `workspace/findings/<FIND-NNN>/` | Qualified finding folders, each with `finding.md` and `qualification.md` | Finding records |
| `workspace/runs/<RUN-NNN>/` | Run folders with `run.md`, `evidence/` and `raw-findings.md` | Wait for v2.3 |
| `playbooks/` and `.os/indexes/playbooks.json` | Playbooks and their index | Wait for v2.3 |
| `extractions/` | Per-source review files and staged candidate rows from the bulk-extract skill | See [Bulk-Extract Files](#bulk-extract-files) |
| `.os/indexes/entity-resolution.json` and other generated indexes | Data derived from the JSONL files | Not imported. Make Blueprint builds its own index. |
| `workspace/datasets/` | Tables that people or agents produced, such as CSV files | Not imported as records. The report lists them so a person can add them as sources with `run source add`. |
| `.agents/skills/`, `.os/contracts/`, `.os/templates/`, `.os/scripts/` | v1 tooling | Not imported |
| `docs/` and `.make-docs/` | Make Docs content and config | Left in place. Make Docs owns them. |
| `AGENTS.md` and `CLAUDE.md` | Instruction files | Left in place. v1 text is user text, which `setup` keeps. See [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md). |

### Identity: v1 IDs to Refs

v1 IDs have the form `<PREFIX>-NNN`. v2.0 keeps the v1 prefixes `REQ`, `CAP`, `PER`, `FIND` and `EXT`, so these IDs become `ref` values unchanged. v1 sources and systems have no matching v2 prefix, so they get new refs, and their v1 names become aliases.

| v1 name | v2 `ref` | v2 `id` | Aliases |
| --- | --- | --- | --- |
| `REQ-NNN`, `CAP-NNN`, `PER-NNN`, `FIND-NNN`, `EXT-NNN` | The v1 ID, unchanged | A new random `id` with the same prefix | None |
| A system slug in `instance.yaml` | The next `SYS-NNN`, in config order | A new `SYS-` `id` | The v1 slug |
| All `REF-NNN` entries that share one original file | The next `SRC-NNN`, in order of each source's lowest `REF` number | A new `SRC-` `id` | Every `REF-NNN` of that source |
| A staged candidate with no v1 ID | The next free `ref` of its type, after the imported ones | A new random `id` | None |
| `TC-NNN`, `RUN-NNN`, `RES-NNN`, `PB-NNN` | Not written in v2.0. v2.3 keeps these v1 IDs as refs when it adds the types. | None | None |

Requirements:

- The import never renumbers a v1 ID.
- After the import, the next new `ref` of each type continues after the highest number imported for that type, so a new record never takes a v1 name. [10 Records and Identity](10-records-and-identity.md) owns the counters.
- Every link in the v1 data that names a v1 ID is rewritten to the new `id` of the record it names. No link uses a `ref`.
- When two different v1 rows share a v1 ID, both import. The record created first keeps the v1 ID as its `ref`. The other gets the next free `ref` of its type and keeps the v1 ID as an alias. This is the rule that the ref-fix command (`run record ref-fix`, see [10 Records and Identity](10-records-and-identity.md)) applies after a branch merge. Here, "created first" means the earlier v1 `created_at`. When both rows have the same `created_at`, or none, the row that comes first in the v1 files keeps the `ref`, so the plan is the same on every run. The report names each clash and the `ref` each row gets. Links to that v1 ID stay as text in the body of the records that hold them and appear as follow-ups, because the import cannot tell which row they meant.
- Rows that are exact duplicates import once.
- A link to a v1 ID that has no row stays as text in the record body and appears in the report as a broken link.

### Record Mapping

| v1 shape | v2.0 result | Notes |
| --- | --- | --- |
| Requirement row | Requirement record | `statement` and `rationale` become body sections. `capability` is the one capability whose v1 `supports` list names the requirement. With no such capability, or with several, `capability` stays empty, the candidates become general record links, and the report lists a follow-up. `kind` stays empty, because v1 has none. `acceptance_refs` entries that name findings become links. Entries that name test cases or results stay as text until v2.3. `docs/` paths become Make Docs doc links. |
| Capability row | Capability record | `description` and `limits` become body sections. `system` comes from the row's v1 `systems` list when it names exactly one system, or from `defaults.systems` when the row names none and the default names exactly one. Otherwise `system` stays empty, the named systems become general record links, and the report lists a follow-up. `parent`, `domain` and `capability_status` stay empty for the model stage. `supports` sets each named requirement's `capability`. |
| Persona row | Persona record | The v1 `systems` list becomes the persona's `systems` links. `description`, `goals` and `needs` become body sections. The v1 `identity` key and its reviewer-approved alternate names go to the body, because they are role names, not refs. Each persona record gets a `slug` that names its `user` entry in `.make/personas.yaml`. The slug is made from the persona's title; when two persona records would get the same slug, the later one in v1 ID order also carries its v1 ID, such as `billing-clerk-per-014`. The core writes the entry for an `active` persona record during the import, and for a `draft` one when review approves it, as for any persona record (see [11 Record Types Reference](11-record-types-reference.md) and [13 Extraction and Review](13-extraction-and-review.md)). The report lists each slug. |
| Finding row, finding folder, or both | One finding record for each `FIND` ID | Row fields fill the front matter. `finding.md` becomes the body, and `qualification.md` becomes a "Qualification" body section. `observed` becomes the summary when the row has none, and a body section otherwise. `implications` maps to `implications`. `kind` is `observation`, because a v1 finding is an empirical observation; the report gives the count so a reviewer can change it. `confidence`, `polarity`, `origin_run` and `raw_anchor` go to the body. When a row and a folder disagree, the row wins, the folder's value goes to the body, and the report lists the difference. |
| Extraction row | Extraction record | `source` is the source record whose converted part holds the row's `source_anchor`. `records` lists the `minted` and `updated` IDs, rewritten to new `id` values. A row with no `outcome_contract` keeps its old meaning, where `minted` meant "created or updated", which is what `records` means, so nothing is guessed. `referenced` IDs appear in the body as reused records. `extracted_at` becomes `created_at`, and `extracted_by` goes to the body. `source_sha256` is the source's hash from the reference index. Part coverage comes from a bulk-extract review when one exists. Without one, v1 recorded no coverage, so the parts show no coverage and the source shows as partly extracted. |
| System entry in `instance.yaml` | System record | `name` becomes both `name` and `title`, and `description` becomes the summary. `vendor` and `capability_statuses` stay empty for the model stage. An entry that still holds the v1 starter template's example values is a placeholder. The report lists it, and it is not imported. |
| `environments` list | A facet named `environment` | Each environment becomes one facet value, and each record's `environments` list becomes its values for that facet. An environment's link to its systems has no v2 place, so the report lists it. |
| `owners` list | `maintainer` entries in `.make/personas.yaml`, and owner slugs on records | Each v1 owner becomes one `maintainer` entry in `.make/personas.yaml`, written through the core, with its v1 slug as the entry's slug, its v1 name as the entry's `label` and a kind from its v1 kind (see root [07 People and Roles Entry Fields](../../../../docs/prd/07-setup-tool-and-shared-files.md#people-and-roles-entry-fields) for the entry fields and root [07 Make Blueprint Use](../../../../docs/prd/07-setup-tool-and-shared-files.md#make-blueprint-use) for how Make Blueprint names entries). A v1 kind of `person`, `team`, `organization` or `agent` stays as it is. A v1 `vendor` becomes `organization`, and a v1 `group` becomes `team`. Any other v1 kind becomes `team`, and the entry's description keeps the v1 kind. The report lists each entry whose kind differs from its v1 kind. Each record's v1 `owners` list stays in the record's common `owners` field, which [10 Records and Identity](10-records-and-identity.md) defines. The import adds an entry for every owner slug it writes, so each slug in `owners` names an entry in the file. A record owner slug that the v1 owner list does not name gets a `maintainer` entry too, with the slug as its `label`, the kind `team`, and a description that says the v1 owner list did not name it. The shared-file plan in the report lists each such entry. |
| `instance.name` | Project `name` | Fills the optional `name` in the shared `.make/config.yaml`, written through the core, when that `name` is empty (see [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md)). When a `name` is already set, the import keeps it, and the report shows the v1 name. |
| `defaults` | Not imported | v2 has no default scope. Apart from the capability `system` rule above, the report lists the defaults as not imported. |
| Reference entries and converted twins | Source records | See [Sources, Converted Text and Evidence](#sources-converted-text-and-evidence). |
| Files in `extractions/` | Extraction details, draft records and draft findings | See [Bulk-Extract Files](#bulk-extract-files). |

v1 holds no domain, comparison, fit-gap or placement records, so the import creates none. The model, compare and place stages create them in v2. See [14 Fit-Gap and Placement](14-fit-gap-and-placement.md).

### Common Fields

| v1 field | v2 result |
| --- | --- |
| `id` | `ref`, plus a new `id` |
| `type` | `type` |
| `title` | `title` |
| `summary` | `summary` |
| `status` | `status`. See [Status Mapping](#status-mapping). |
| `source_anchor` and `source_refs` | `evidence`, plus record links for entries that name a record |
| `doc_anchor` | A Make Docs doc link. See [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md). |
| `related` | General record links. See [10 Records and Identity](10-records-and-identity.md). |
| `systems` | The record type's own system link where it has one, and general record links to system records otherwise |
| `environments` | Values of the `environment` facet |
| `owners` | `owners`. Each slug names a `maintainer` entry in `.make/personas.yaml`, which the import adds when the file does not hold it. |
| `tags` | `tags` |
| `redirect` | The successor link of a superseded record. Its `kind`, `decided_at`, `decided_by`, `reason` and `evidence_refs` go to the body. |
| `created_at` and `updated_at` | The same fields. When v1 left one empty, the import sets it to the import time and says so in the body. |
| Long type-specific text, such as `statement` or `description` | A body section named after the v1 field |
| Any other field | The body, under a heading "Imported v1 fields", as a YAML block with the values unchanged |

Every imported record carries the current `schema_version`.

Requirements:

- No v1 field value is lost. A value with no v2 field stays in the record body under "Imported v1 fields", exactly as v1 held it.
- The import fills no v2 field that v1 did not hold, apart from five stated defaults: a capability's `system` from `defaults.systems`, a finding's `kind` of `observation`, empty timestamps set to the import time, the project `name` in `.make/config.yaml` from `instance.name`, and a `maintainer` entry of kind `team` in `.make/personas.yaml` for each record owner slug that the v1 owner list does not name. The report counts each default it applied.

### Status Mapping

| v1 status | v2 status |
| --- | --- |
| `draft` | `draft` |
| `active` | `active` |
| `superseded`, with a `redirect` | `superseded`, linked to its successor |
| `superseded`, with no `redirect` (an older row) | `superseded`, with no successor link. The report lists a follow-up. v1 never guessed a successor, and the import does not either. |
| `archived` | `archived` |
| Finding `qualified` | `active` |
| Finding folder `designed` | `active`. The finding's design links become Make Docs doc links. |
| Run `running`, `closed` or `aborted` | Waits for v2.3 with the runs |

No v1 status maps to `rejected`.

### Sources, Converted Text and Evidence

Requirements:

- The import writes one source record for each distinct original file that the reference index names in its `source` field. All reference entries for that file become parts of one source and aliases of its record.
- Each source imports at the source git level that matches where its original was. [12 Source Intake and Conversion](12-source-intake-and-conversion.md) owns the levels: `all` keeps the original and its converted text in git, `converted` keeps only the converted text in git, and `none` keeps both out of git. The import leaves the project level, `sources.git_level`, as it is, and sets a source's `git_level` override only where the source's level differs from it.
- When git tracks the original in the v1 project, the import copies it into `blueprint/sources/`, and the source takes level `all`. Git LFS applies to it as to any original that git tracks.
- When git does not track the original, because it sits outside the v1 project or git ignores it there, the source keeps the original out of git. It takes level `converted` when git tracks its v1 converted text, and `none` when git does not. The source keeps its normal path under `blueprint/sources/`, and Make Blueprint lists the kept-out files in its managed `blueprint/sources/.gitignore`. When the original is on this machine, the import copies it to that path. Otherwise the original shows as missing, which is information, not an error, and the report lists it with its v1 path.
- `sha256` comes from the reference index. When the copied file's hash differs, the report flags the source as changed since v1 converted it, and `project check` flags its evidence links as it does for any changed source.
- The import keeps the v1 converted text as the source's converted text, in the converted text form that [12 Source Intake and Conversion](12-source-intake-and-conversion.md) defines, with each part in its v1 order. It writes that text next to the source's original path in `blueprint/sources/`. It does not convert the original again. `converter` is `v1`, which marks converted text that the import kept, and `converter_version` records the v1 converter named in the twins' front matter. Kept text is never edited by hand, like any converted text. Side files, such as images, stay with the converted text. A person can convert a source again later with the normal intake command, and `project check` then flags any link whose anchor moved. Kept v1 text keeps `converter: v1`. It takes the agent route for complex PDFs, which [12 Source Intake and Conversion](12-source-intake-and-conversion.md) defines, only when a person asks for it, never on its own.
- Each spreadsheet sheet, and the text of a CSV original, becomes a table CSV file beside the main Markdown file, such as `<original>.t-001.csv`, with the table anchor that [12 Source Intake and Conversion](12-source-intake-and-conversion.md) defines. Other tables stay in the main Markdown file with row anchors.
- The v1 twin status maps to the nearest conversion status that [12 Source Intake and Conversion](12-source-intake-and-conversion.md) defines. The report lists every twin whose v1 status was `candidate` or `rejected`.
- Make Blueprint assigns its anchors to the kept text with the anchor algorithm of [12 Source Intake and Conversion](12-source-intake-and-conversion.md). Each v1 `source_anchor`, of the form `assets/<source-slug>/<asset-slug>.<ext>#<anchor>`, resolves to the v2 anchor of the same heading, paragraph or row in the same part. The evidence link then has the form `SRC-<code>#<anchor>`. A v1 row anchor in a sheet that became a table CSV file maps to that row's position in the table, such as `SRC-<code>#t-001:r-0012`, where rows count from the first data row and the header row is not counted.
- When a v1 anchor matches no v2 anchor, or more than one, the evidence link points to the source with no anchor, the v1 anchor text stays in the body, and the report lists a follow-up. [10 Records and Identity](10-records-and-identity.md) owns whether a link with no anchor passes `project check`.
- Entries in `source_refs` and `basis_refs` of the form `path#anchor` follow the same rules. Entries that name a record become links. Entries that name a run, test case, result or playbook stay as text in the body until v2.3.

### Bulk-Extract Files

The v1 bulk-extract skill writes two kinds of files. Each review file, `extractions/REF-*.json`, covers one original source. It is named by the source's first `REF` and holds candidates, applied outcomes, reuse checks, coverage notes, unresolved notes, the reviewer and the extraction IDs it published. The staging files, `extractions/staging/requirements.jsonl`, `capabilities.jsonl` and `findings.jsonl`, hold candidate rows that are not yet published. Published rows already sit in `.os/data/`.

The import keeps all review work in these files. It uses draft status and pending changes in place of a staging folder, as Make Blueprint does for extraction. A pending change is a proposed fix to a fact on an active record: the record keeps its old value until review, and an approved change is written into the same record file, so its `id`, `ref` and links stay the same.

| v1 content | v2 result |
| --- | --- |
| A published review with no unresolved notes and no held candidates | Merges into the extraction records that its extraction IDs name. `reviewer` and `reviewed_at` come from the named, dated publication review. Coverage notes become part coverage, and reuse checks go to the body. The source shows as fully extracted. |
| Unresolved notes on a review | Each note becomes a `draft` finding of kind `question`, with an evidence link to the source and a link to its extraction. The source shows as partly extracted. |
| Staged candidates with the action `minted` (status `draft`, no v1 ID), whether pending, approved or held | `draft` records of their type, with the next free refs, linked from an extraction record for the source. The v1 review state and notes go to the body. The normal review step makes each one `active` or `rejected`. |
| Staged candidates with the action `referenced` | Listed in the extraction body as reused records |
| Staged candidates with the action `updated` (a proposed change to a published row) | A pending change on the matching record, which is the imported published row. The record keeps its v1 value until a reviewer approves or rejects the change through the review commands (see [13 Extraction and Review](13-extraction-and-review.md)). The v1 review state and notes go with the pending change, and the extraction body lists it. An update whose published row the import cannot find stays in the extraction body, and the report lists it as a follow-up. |
| A publication that started but did not finish | A blocking problem. The person finishes or abandons it in v1 first. |
| Row hashes, base hashes, locks and other staging internals | Not imported |

The import does not ignore `extractions/`, which would keep the published rows but lose unresolved questions, coverage, reviewers and staged work. It does not copy the files as they are either, which would bring back the staging folder that v2 does not use.

### Items That Do Not Map

Every v1 item gets exactly one outcome in the report.

| Outcome | Meaning | Written? |
| --- | --- | --- |
| Imported | The item maps with no change of meaning. | Yes |
| Imported with a follow-up | The item imports with no data lost, and a person finishes it in v2. Examples: an empty field to fill, an evidence link to check, a link to a shared v1 ID to settle. `project check` or `project status` also shows each one. | Yes |
| Waits for v2.3 | Test case, run and result rows, run folders, and playbooks. The import leaves them in the v1 project untouched. Links to them stay as text in the body of the records that hold them. | No |
| Not imported | Derived indexes, v1 tooling, datasets, placeholder config and default scope. The report gives the reason for each. | No |
| Blocking problem | The write cannot run until the person clears it. | No |

The blocking problems are:

- The project has no Make Blueprint setup, or it already holds records.
- The given folder is not a v1 project, because it has no `.os/` folder.
- The given v1 folder is not the project folder the import runs in, because the import writes into the v1 folder itself.
- A v1 file the import must read cannot be parsed, such as a bad JSONL line or bad YAML. The report names the file and line.
- A bulk-extract publication is pending.

Importing the four v2.3 types into a project that was imported in v2.0 is planned scope for v2.3. How that pass runs is deferred to v2.3 planning (see [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md)). Because the import never changes a v1 file, the v1 files stay in place, and in git history after the person deletes them, for that pass.

### Dry-Run Report

The report has the same meaning in human output and in JSON output. It names items by v1 ID, `ref` and path. It never shows new `id` values, because those are random and exist only after the write.

Requirements:

- The first lines give the verdict, ready to write or blocked, and the counts for each outcome.
- A table gives the counts for each v1 shape and each outcome.
- The ref plan lists the v1 IDs kept as refs, the new `SRC` and `SYS` refs, and the next free `ref` of each type.
- The shared-file plan lists the `maintainer` and `user` entries for `.make/personas.yaml` and the project `name` for `.make/config.yaml`.
- The evidence summary counts links resolved to an anchor, links with no anchor, originals that are missing and originals whose hash changed.
- Follow-ups are grouped by kind. Each one gives the v1 ID or path, the reason, and the command or workflow stage that settles it.
- Each blocking problem gives the action that clears it.
- The last line names the next useful action.

Example of the summary, with synthetic numbers:

```text
v1 import dry run: ready to write
  412 items read
  371 import, 29 import with a follow-up, 8 wait for v2.3, 4 not imported
  Refs: REQ-001 to REQ-188 kept; 24 sources become SRC-001 to SRC-024
  Evidence: 336 links reach an anchor, 7 point to a source only
Next: run the import with the write option, then review the 12 imported drafts.
```

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 9: identity; section 10: data model; section 11: extraction and review; Alternatives Considered: a staging folder and a forced second reviewer)
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/entity-records-contract.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/config-contract.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/extraction-contract.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/finding-contract.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/converted-source-contract.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/persona-identity-contract.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/toolkits/buildos-intake/internal/intake/types.go`
- `<v1-project>/.agents/skills/buildos-bulk-extract/scripts/work.py` (as found in client-b-v3)
- `blueprint/sources/`
- `blueprint/records/<type>/<id>.md`

## Integrations

| Party | How the import relates to it |
| --- | --- |
| [08 CLI and MCP](08-cli-and-mcp.md) | Owns the grammar of `run import v1`, the write option's name and the JSON output. The import is also the MCP tool `import_v1` in the `setup` profile. The tool is a dry run by default, and its write needs both `apply: true` and `allowWrite`. |
| [09 Storage and Indexing](09-storage-and-indexing.md) | The write is one journaled change under the shared write lock, and the index is rebuilt after it. |
| [10 Records and Identity](10-records-and-identity.md) | Ref counters, aliases, the ref-fix command, `project check`, evidence link checks, successor links and general record links |
| [11 Record Types Reference](11-record-types-reference.md) | The field names the mapping writes |
| [12 Source Intake and Conversion](12-source-intake-and-conversion.md) | The converted text form, table CSV files, anchors, source git levels, the `v1` converter value, conversion status values and Git LFS |
| [13 Extraction and Review](13-extraction-and-review.md) | Extraction records and parts, drafts, pending changes and review. `run extract next` picks up sources that show as partly extracted. |
| [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) | The model stage fills the system, capability and domain fields that v1 never held |
| [16 Workflow and Skills](16-workflow-and-skills.md) | All nine skills work on an imported project. No skill owns the import. |
| [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) | The import leaves `docs/` untouched. Until `project check` uses the read command that Make Docs 2.1.0 ships, it skips imported Make Docs doc links and reports how many it skipped; obligation O-001 in [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md) tracks that skip. The core writes the import's entries in `.make/personas.yaml` and the project `name` in `.make/config.yaml`, because each kit only reads those shared files. |
| [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) and [07 Installation and Distribution](07-installation-and-distribution.md) | `setup` runs before the import. v1 text in instruction files is user text that `setup` keeps. |
| BuildOS v1 | Read only. v1 receives bug fixes only, so its file shapes stay stable while v2 is built. |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 12: relationship with Make Docs; section 15: release plan and v1)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/09-v1-import-and-release.md` (Dependencies)
- `docs/work/`

## Rebuild Notes

### Fixtures

Requirements:

- Import tests use only synthetic or scrubbed fixtures. No client data, client names, client system names or client source files enter this repository, and no fixture is copied from a client project.
- A fresh-project fixture is shaped like client-c-implementation. It has a starter `instance.yaml` with placeholder values, eight empty JSONL files, playbook category folders, empty runs, findings and datasets folders, a `.agents/skills/` folder and a Make Docs config. Its import writes no records. Its report lists the placeholders and the tooling as not imported.
- A bulk-extract fixture is shaped like client-b-v3. It has several systems, sources with several converted parts (such as a workbook with several sheets and a document with images), rows of every v2.0 type, older and outcome-aware extraction rows, superseded rows with and without `redirect`, qualified finding folders, rows and folders for the four v2.3 types, and review files in each state: published, unresolved, held and staged. It is smaller than the real project but keeps its shape.
- Edge-case fixtures cover duplicate v1 IDs, links to IDs with no row, missing originals, an original that git does not track, an original whose hash changed, an unparseable JSONL line, a pending publication, unknown fields and an unknown file.
- Each fixture carries its expected JSON report and expected record set, so a test compares exact results apart from the random `id` values.

### End-to-End Check of an Imported Project

After the bulk-extract fixture is imported, these results hold:

- Every v1 ID of an imported type finds its record by `ref`. Every `REF-NNN` finds its source record by alias. Every system slug finds its system record by alias.
- Every link in a record file uses an `id`, and every link resolves, apart from the follow-ups the report listed.
- `project check` reports exactly the follow-ups the report listed, and no other problem. Information notes, such as `name-not-slug` for imported free-text names, are not problems.
- `project status` shows the source count, fully, partly and not extracted counts that match the v1 review states, drafts waiting for review equal to the staged new candidates plus the unresolved notes, and pending changes waiting for review equal to the staged `updated` candidates whose published rows the import found.
- `.make/personas.yaml` holds one `maintainer` entry for each v1 owner and for each other owner slug on an imported record, and one `user` entry for each active persona record, and `.make/config.yaml` holds the v1 instance name when no `name` was set.
- Deleting the index and rebuilding it gives the same counts.
- Each evidence link with an anchor opens the same text that its v1 anchor pointed to, including links that map to a row of a table CSV file.
- The skills run on the imported project. `run extract next` hands out a partly extracted source. The review step makes an imported draft `active` and decides an imported pending change. The model stage fills an empty capability `system`. A comparison and a fit-gap export complete.
- No v1 file in the fixture changed, by hash before and after.
- A second import refuses.
- A write stopped by a crash leaves the whole import or none of it after the next command.

This check runs in the clean container with no Python and no Node, as part of the v2.0 end-to-end run in [07 Installation and Distribution](07-installation-and-distribution.md). A reviewer also imports a v1-shaped fixture and records whether names and links still make sense.

### Likely Mistakes

- **Regenerating `REF` numbers.** v1 intake numbers reference entries by their position each time it rebuilds `references.json`, so a `REF` number is stable only within one index file. The import reads the numbers as they stand in `references.json` and in the review file names, and never numbers them again.
- **Guessing.** The import does not choose a requirement `kind`, a capability `parent` or `domain`, or one capability among several. Empty fields and follow-ups are the honest result.
- **Renumbering v1 IDs, or linking by `ref`.** Either breaks the names people know or the links that survive a ref fix.
- **Treating persona alternate names as ref aliases.** v1 persona aliases are role names. Ref aliases are old refs.
- **Porting the bulk-extract script.** The import reads the script's files. It does not run or port the script, which ships Python.
- **Writing record by record.** A crash then leaves half an import. The write is one journaled change.
- **Touching the v1 tree.** Moving originals or editing v1 rows breaks the v2.3 pass and the person's ability to compare.
- **Dropping unknown fields.** v1 treats unknown fields as part of the canonical row, so the import keeps them in the body.

Code anchors:

- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Dependencies: import fixtures)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/09-v1-import-and-release.md` (Testing Decisions; Exit Criteria)
- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Human Experience Intent: evidence required; Consequences: Client C on v1)
- `<user-home>/Developer/Source/Tyler/Projects/build-os/toolkits/buildos-intake/internal/intake/index.go`

### Shared Plan and Write Steps

Keep the import plan and its write steps apart from the v1 reader. In v2.1, `run package add` takes in system packages with the same steps: it builds one plan, shows it as a dry run, and writes it in one journaled change, with the same `id` and `ref` mapping and the same writes through the core. Only its reader differs. See [20 System Packages](20-system-packages.md).

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/09-v1-import-and-release.md`
- `docs/plans/2026-11-01-w1-r2-shared-rules-links/00-overview.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/entity-records-contract.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/config-contract.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/extraction-contract.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/finding-contract.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/run-record-contract.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/playbook-contract.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/toolkits/buildos-intake/internal/intake/types.go`
- `<v1-project>/.agents/skills/buildos-bulk-extract/scripts/work.py`
