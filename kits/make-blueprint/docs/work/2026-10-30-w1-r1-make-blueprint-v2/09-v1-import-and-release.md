---
title: "Phase 9: v1 Import and Release"
kind: "work"
status: "active"
coordinate: "W1 R1 P9"
source:
  type: "prd"
  path: "docs/prd/17-v1-import.md"
---

# Phase 9: v1 Import and Release

## Purpose

This phase gives BuildOS v1 projects a safe one-time path to Make Blueprint, proves the whole product on the release build on a machine with no Python and no Node, and releases v2.0. Client C starts its work on v1 and moves to v2 with this import, so its project is the real import test ([Q-071](../../prd/03-open-questions-and-risk-register.md#q-071-v1-import-release-and-client-c)).

It depends on every earlier phase: the shared core and its shared files from [Phase 1](01-shared-core-adoption.md), the CLI, `setup`, the first signed single-file build and the start-time profile from [Phase 2](02-cli-and-packaging.md), storage, records, intake, extraction, review and analysis from [Phase 3](03-storage-and-identity.md) to [Phase 7](07-analysis-and-exports.md), and the MCP tool list, `project status` and the nine skills from [Phase 8](08-mcp-skills-and-status.md).

## Overview

The import work builds `run import v1` in five parts that run in order: the reader, the planner, the dry-run report, the writer and the after-import check. It maps every v1 shape to v2.0 records, refs, evidence and links, keeps v1 IDs as refs, keeps v1 converted text, turns the bulk-extract files into extraction detail, drafts and pending changes, and gives every item exactly one outcome in the report. It writes into the v1 project folder beside the v1 files, as one journaled change, and never changes a v1 file. Tests use only synthetic or scrubbed fixtures shaped like client-c-implementation and client-b-v3. No client data, client names or client files enter the repository.

The release work builds the v2.0 npm package and the signed single files for each target, runs all seven stages and all nine skills on the release build in a clean container with no Python and no Node, re-runs the start-time characterization on the release build, collects the Human Experience Review of every plan promise, and publishes v2.0 with release notes that claim only what the recorded evidence shows.

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `direct`. Promise: on a machine that allows no Python, a person installs one signed file and every skill works, owned by [07 Installation and Distribution](../../prd/07-installation-and-distribution.md#signed-single-files) under the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md). This phase also carries the human outcomes that [17 v1 Import](../../prd/17-v1-import.md#component-and-capability-map) states for the import.
- Intended human outcome: a person downloads one signed file for their platform, verifies its signature with the platform's own tools, opens it under default security settings, and runs `setup`, every command, the MCP server and every skill with no Python, no Node and no network. A person who knew a record as `REQ-014` or a source as `REF-012` in v1 finds it by that name after the import, reads a dry-run report that says first whether the write can run and how many items need a follow-up, and picks up the workflow from `project status`.
- Human-facing surface or indirect effect: the signed single files and the npm package, their install and `setup` output, every skill on the release build, the `run import v1` dry-run report and write output, and `project status` after an import.
- Implementation work: Stages 1 to 6 build and test the import. Stage 7 builds the release, runs the clean-container end-to-end check and publishes v2.0.
- Evidence source or testing type selected under current authority: Automated Implementation Testing in a clean container with no Python and no Node, on each Q-006 target, as the plan overview selects. For the import: Automated Implementation Testing on the fixtures and the end-to-end check of an imported project, and a Guided Progress Review in which a reviewer imports a v1-shaped fixture, as [17 v1 Import](../../prd/17-v1-import.md#end-to-end-check-of-an-imported-project) states.
- Executor: the implementing coding agent runs the automated tests and the release check. A person the owner names runs the import Guided Progress Review. The owner approves and runs the publish.
- Accepted obligation or deferral route: none for this promise. [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check) stays open at release, and the release notes say so.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | Import fixture tests with expected reports and record sets, crash tests of the import write, the end-to-end check of an imported project, the release check, and the clean-container run of all seven stages and all nine skills on each target. The acceptance criteria in each stage below are the decision record. |
| Performance Testing | active | Re-run the start-time characterization on the v2.0 release build, as [07 Installation and Distribution](../../prd/07-installation-and-distribution.md#start-time-performance) and [R-004](../../prd/03-open-questions-and-risk-register.md#r-004-start-time-of-the-single-file-cli-and-mcp-server) require. It uses the start-time `PERF-###` profile that [Phase 2](02-cli-and-packaging.md) creates and sets no target. No PRD calls for a re-run of the index profile from [Phase 3](03-storage-and-identity.md), so this phase runs none. |
| Guided Progress Review | active | A reviewer imports a v1-shaped fixture and records whether names and links still make sense, as [17 v1 Import](../../prd/17-v1-import.md#end-to-end-check-of-an-imported-project) states. Stage 6 holds the review. |
| Unassisted Goal Testing | not-needed-now | No PRD needs it in v2.0. The import has a dry-run report and a Guided Progress Review, and the release run is automated. No current decision depends on proof that a person finds the path with no help. |

- Base maintenance action: `update-existing`. This phase records a new result under the start-time profile that [Phase 2](02-cli-and-packaging.md) creates. It raises the profile's `profile_version` only when the method, environment or workload changes.
- Performance applicability: `characterize-now`
- Canonical `PERF-###` profile link or `none`: the start-time `PERF-###` profile created in [Phase 2](02-cli-and-packaging.md). Its number and path are recorded there.
- Finite evidence budget and stop-rule reference or `not-applicable`: the budget and stop rule set in that profile. This phase's run is the one bounded re-run on the release build that 07 authorizes, and it spends no budget beyond the profile's limits.
- Execution packet link or `not-applicable`: rendered from the profile for the release build at the start of t35, and linked from `evidence.md`.
- Outcome and evidence handoff or `none`: to be recorded at closeout, as an observed distribution with stated uncertainty bound to the profile ID, version, digest and the release build fingerprint, handed to the owner, who decides whether a start-time target is needed.
- Gate disposition and supported-scope limit or `not-applicable`: `characterization-baseline` with no pass or fail target, so the result does not gate the release. Supported scope: the v2.0 release build on the targets measured.

## Source PRD Docs

- [17 v1 Import](../../prd/17-v1-import.md)
- [07 Installation and Distribution](../../prd/07-installation-and-distribution.md) for the signed single files, the npm package, offline behavior and the start-time re-run
- [01 Product Overview](../../prd/01-product-overview.md) for the v2.0 release scope and the current limitations
- [05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md) for the core dependency line that release builds follow
- [08 CLI and MCP](../../prd/08-cli-and-mcp.md) for `run import v1` and the `import_v1` tool
- [16 Workflow and Skills](../../prd/16-workflow-and-skills.md) for the end-to-end run of all nine skills

## Source Obligations, Scenarios, And Findings

- Obligation: [O-001 Confirm Make Docs Links in Project Check](../../prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check). Imported Make Docs doc links are skipped by `project check` with a count, and v2.0 ships with the skip still in place. The release notes name it as a current limit.
- Risk: [R-021 Client C v1 Data Shapes](../../prd/03-open-questions-and-risk-register.md#r-021-client-c-v1-data-shapes). Stage 6 runs a dry run on a scrubbed Client C copy kept outside the repository before release.
- Risk: [R-004 Start Time of the Single-File CLI and MCP Server](../../prd/03-open-questions-and-risk-register.md#r-004-start-time-of-the-single-file-cli-and-mcp-server). Stage 7 re-runs the profile on the release build.
- Risk: [R-005 Packagers That Unpack to a Temporary Folder](../../prd/03-open-questions-and-risk-register.md#r-005-packagers-that-unpack-to-a-temporary-folder). The clean-container run checks that the release file starts no unpacked program.
- Decisions carried in: [Q-043](../../prd/03-open-questions-and-risk-register.md#q-043-v1-bulk-extract-files) to [Q-047](../../prd/03-open-questions-and-risk-register.md#q-047-v1-import-as-an-mcp-tool), [Q-070](../../prd/03-open-questions-and-risk-register.md#q-070-explicit-people-and-role-fields), [Q-071](../../prd/03-open-questions-and-risk-register.md#q-071-v1-import-release-and-client-c), [Q-072](../../prd/03-open-questions-and-risk-register.md#q-072-shared-people-and-roles-file), [Q-077](../../prd/03-open-questions-and-risk-register.md#q-077-shared-people-and-roles-file-details), [D-011](../../prd/03-open-questions-and-risk-register.md#d-011-project-display-name-from-the-v1-import) and the `source-unregistered` note of [Q-084](../../prd/03-open-questions-and-risk-register.md#q-084-small-command-and-status-defaults-found-while-writing-the-work-backlog).
- Scenarios: None.
- Findings: None.

## Stage 1 - v1 Reader and Fixtures

### Tasks

- [ ] t1: Build the synthetic fresh-project fixture, shaped like client-c-implementation: a starter `instance.yaml` with placeholder values, eight empty JSONL files, playbook category folders, empty runs, findings and datasets folders, a `.agents/skills/` folder and a Make Docs config. Store its expected JSON report and its expected empty record set. No file is copied from a client project. ([17 v1 Import](../../prd/17-v1-import.md#fixtures))
- [ ] t2: Build the synthetic bulk-extract fixture, shaped like client-b-v3 but smaller: several systems; sources with several converted parts, such as a workbook with several sheets and a document with images; rows of every v2.0 type; older and outcome-aware extraction rows; superseded rows with and without `redirect`; qualified finding folders; rows and folders for the four v2.2 types; and review files in each state: published, unresolved, held and staged. Store its expected JSON report and expected record set. ([17 v1 Import](../../prd/17-v1-import.md#fixtures))
- [ ] t3: Build the edge-case fixtures, each with its expected report: duplicate v1 IDs, links to IDs with no row, a missing original, an original that git does not track, an original whose hash changed, an unparseable JSONL line, a pending publication, unknown fields and an unknown file. ([17 v1 Import](../../prd/17-v1-import.md#fixtures))
- [ ] t4: Build the import reader. It reads `.os/data/*.jsonl`, `.os/config/instance.yaml`, `.os/indexes/references.json`, `assets/<source-slug>/`, the originals each reference entry names, `workspace/findings/`, `workspace/runs/`, `playbooks/`, `.os/indexes/playbooks.json` and `extractions/`, and lists every other file it finds as not imported with a reason. It reads v1 paths correctly on macOS, Windows and Linux, and a parse error names the file and line. ([17 v1 Import](../../prd/17-v1-import.md#v1-inputs))
- [ ] t5: Build the precondition checks as blocking problems: the project has no Make Blueprint setup or already holds records; the folder has no `.os/` folder; the given v1 folder is not the project folder the command runs in; a v1 file the import must read cannot be parsed; or a bulk-extract publication is pending. Each blocking problem names the action that clears it. ([17 v1 Import](../../prd/17-v1-import.md#items-that-do-not-map))

### Acceptance criteria

- A901: A scan of the import fixtures finds no client data, client name, client system name or client source file, and each fixture holds its expected JSON report and expected record set.
- A902: On the bulk-extract fixture, the reader lists `.os/indexes/entity-resolution.json`, the v1 tooling folders and `workspace/datasets/` as not imported, each with its reason, and lists an unknown file at the project root as not imported.
- A903: On the unparseable-line fixture, the dry run names `.os/data/requirements.jsonl` and the bad line number as a blocking problem, and the write refuses.
- A904: The dry run reports a blocking problem, and the write refuses, on a project with no setup, on a project that already holds a record, on a folder with no `.os/` folder, when the given folder is not the current project folder, and on the pending-publication fixture.

### Dependencies

- [Phase 2](02-cli-and-packaging.md): `setup`, which runs in the v1 folder first, and the command grammar.
- [Phase 3](03-storage-and-identity.md): the storage interface and the "holds no records" check.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review in Stage 6; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none in this stage.
- Human Experience Review: the agent inspects the blocking-problem output for each refused case and records whether the person can tell why the import cannot run and what clears it. To be recorded at closeout.
- Optional experience handoff: not applicable until the report exists in Stage 5.
- Explicit human acceptance gate: none.
- Evidence report: the `A901` to `A904` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 2 - Identity and Record Mapping

### Tasks

- [ ] t6: Build the ref plan. `REQ`, `CAP`, `PER`, `FIND` and `EXT` IDs become `ref` values unchanged with a new random `id` of the same prefix. Each system slug in `instance.yaml` gets the next `SYS-NNN` in config order, with the slug as an alias. All `REF-NNN` entries that share one original become one source with the next `SRC-NNN`, in order of each source's lowest `REF` number, with every `REF-NNN` as an alias. Staged candidates with no v1 ID get the next free refs. `TC`, `RUN`, `RES` and `PB` IDs are not written. The next new `ref` of each type continues after the highest imported number, and the import never renumbers a v1 ID. ([17 v1 Import](../../prd/17-v1-import.md#identity-v1-ids-to-refs))
- [ ] t7: Handle shared and missing v1 IDs. When two different rows share a v1 ID, both import: the row with the earlier v1 `created_at` keeps the `ref`, or the row first in the v1 files when the times tie or are absent, and the other gets the next free `ref` with the v1 ID as an alias. Links to that shared ID stay as text in the body and appear as follow-ups. Exact duplicate rows import once. A link to a v1 ID with no row stays as text and appears as a broken link. ([17 v1 Import](../../prd/17-v1-import.md#identity-v1-ids-to-refs))
- [ ] t8: Rewrite every v1 link that names a v1 ID to the new `id` of the record it names, so no link uses a `ref`. ([17 v1 Import](../../prd/17-v1-import.md#identity-v1-ids-to-refs))
- [ ] t9: Build the record mapping for requirement, capability, persona, finding, extraction and system rows as the Record Mapping table states, including: a requirement's `capability` only from exactly one capability whose `supports` names it; a capability's `system` from exactly one named system or from `defaults.systems`; a persona `slug` from its title, with the v1 ID added to the later one in v1 ID order on a clash, and a `user` entry in `.make/personas.yaml` written through the core for each `active` persona record (a `draft` persona gets its entry when review approves it); one finding record per `FIND` ID from the row, the folder or both, with the row winning on a difference; `kind: observation` on findings; and placeholder systems from the v1 starter template left out. A field the mapping cannot fill stays empty with a follow-up, and the import never guesses. ([17 v1 Import](../../prd/17-v1-import.md#record-mapping))
- [ ] t10: Map the v1 `environments` list to a facet named `environment`, with each record's environments as its values, and list each environment's link to its systems as not imported. List `defaults` as not imported, apart from the capability `system` rule. ([17 v1 Import](../../prd/17-v1-import.md#record-mapping))
- [ ] t11: Map v1 owners through the core. Each v1 owner becomes one `maintainer` entry in `.make/personas.yaml` with its v1 slug, name and kind: `person`, `team`, `organization` and `agent` stay, `vendor` becomes `organization`, `group` becomes `team`, and any other kind becomes `team` with the v1 kind kept in the description. Each record's v1 `owners` list stays in its common `owners` field. A record owner slug that the v1 owner list does not name gets a `maintainer` entry with the slug as its name, kind `team` and a description that says so. ([17 v1 Import](../../prd/17-v1-import.md#record-mapping))
- [ ] t12: Map `instance.name` to the project `name` in the shared `.make/config.yaml`, written through the core, only when that `name` is empty. When a `name` is already set, keep it and show the v1 name in the report. ([17 v1 Import](../../prd/17-v1-import.md#record-mapping))
- [ ] t13: Build the common field and status mapping. Long type-specific text becomes body sections named after the v1 field, any field with no v2 home goes to the body under "Imported v1 fields" as an unchanged YAML block, empty timestamps are set to the import time and noted in the body, every record carries the current `schema_version`, and v1 statuses map as the Status Mapping table states, with no status mapped to `rejected`. The report counts each of the five stated defaults it applied. ([17 v1 Import](../../prd/17-v1-import.md#common-fields))

### Acceptance criteria

- A905: On the bulk-extract fixture, every imported `REQ`, `CAP`, `PER`, `FIND` and `EXT` record has its v1 ID as its `ref`, every source lists all its `REF-NNN` names as aliases, every system lists its v1 slug as an alias, and a record created after the import gets a `ref` one higher than the highest imported number of its type.
- A906: On the duplicate-ID fixture, both rows import, the row with the earlier `created_at` keeps the v1 ID, the other carries it as an alias, and the report names the clash and the `ref` each row got.
- A907: A scan of every imported record file finds no link field that holds a `ref` or alias, and every link to a missing v1 ID stays in the body and appears in the report as a broken link.
- A908: A requirement named by two capabilities' `supports` lists imports with an empty `capability`, both candidates as general record links, and a follow-up in the report. No imported requirement carries a `kind`.
- A909: On a fixture with v1 owners of kind `person`, `vendor`, `group` and `contractor`, `.make/personas.yaml` holds `maintainer` entries of kind `person`, `organization`, `team` and `team`, the `contractor` entry's description keeps `contractor`, and the report lists the three entries whose kind changed. A record owner slug missing from the v1 owner list has its own `maintainer` entry of kind `team`.
- A910: With no `name` set, the import writes the v1 instance name to `name` in `.make/config.yaml`. With `name` already set, the file keeps its value and the report shows the v1 name.
- A911: A v1 row with an unknown field imports with that field and its value under "Imported v1 fields" in the body, byte for byte as YAML, and the report counts each stated default it applied.

### Dependencies

- Stage 1 of this phase.
- [Phase 1](01-shared-core-adoption.md): the core's writes to `.make/personas.yaml` and `.make/config.yaml`.
- [Phase 3](03-storage-and-identity.md): `id` minting, ref counters and aliases.
- [Phase 4](04-record-types.md): the record fields, the `environment` facet, `owners` and slug checks.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review in Stage 6; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none in this stage.
- Human Experience Review: the agent compares imported records with their v1 rows on the bulk-extract fixture and records whether a person who knew the v1 names finds each record by the same name. To be recorded at closeout.
- Optional experience handoff: not applicable until the report exists in Stage 5.
- Explicit human acceptance gate: none.
- Evidence report: the `A905` to `A911` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 3 - Sources, Converted Text and Evidence

### Tasks

- [ ] t14: Settle the `converter_version` value for text with `converter: v1`, as [Q-044](../../prd/03-open-questions-and-risk-register.md#q-044-v1-converted-text-and-import-target-folder) asks this phase to do. Propose the value, take it to the owner, and carry the accepted value into 17 and 12 through the PRD change process before the writer uses it. Until then, the planner records the v1 converter named in the twins' front matter. ([17 v1 Import](../../prd/17-v1-import.md#sources-converted-text-and-evidence))
- [ ] t15: Build source records: one for each distinct original that the reference index names, with all its reference entries as parts and aliases. Each source takes the git level that matches where its original was: `all` when git tracks the original, which the import copies into `blueprint/sources/`; otherwise `converted` when git tracks its v1 converted text and `none` when it does not, with the kept-out files listed in the managed `blueprint/sources/.gitignore`. The import sets a source's `git_level` override only where it differs from `sources.git_level`. A missing original shows as missing information, listed with its v1 path. `sha256` comes from the reference index, and a differing copied hash is flagged as changed. ([17 v1 Import](../../prd/17-v1-import.md#sources-converted-text-and-evidence))
- [ ] t16: Keep the v1 converted text as each source's converted text, in the 12 converted text form, next to the source's original path, with each part in v1 order, `converter: v1`, its side files, such as images, beside it, and no new conversion. `project check` does not report a side file that the converted text links to as `source-unregistered` ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#source-git-levels-and-the-missing-state)). Each spreadsheet sheet and the text of each CSV original becomes a table CSV file, such as `<original>.t-001.csv`, with its table anchor. Map each v1 twin status to the nearest conversion status and list every twin whose v1 status was `candidate` or `rejected`. ([17 v1 Import](../../prd/17-v1-import.md#sources-converted-text-and-evidence))
- [ ] t17: Resolve evidence. Assign anchors to the kept text with the 12 anchor algorithm. Each v1 `source_anchor` of the form `assets/<source-slug>/<asset-slug>.<ext>#<anchor>` resolves to the v2 anchor of the same heading, paragraph or row in the same part, as `SRC-<code>#<anchor>`. A v1 row anchor in a sheet that became a table CSV file maps to the row's table position, such as `SRC-<code>#t-001:r-0012`, counting from the first data row. A v1 anchor that matches no v2 anchor, or several, gives a link to the source with no anchor, keeps the v1 anchor text in the body and adds a follow-up. `source_refs` and `basis_refs` follow the same rules. ([17 v1 Import](../../prd/17-v1-import.md#sources-converted-text-and-evidence))

### Acceptance criteria

- A912: The register entry Q-044 or PRD 17 states the owner-accepted `converter_version` value for `converter: v1` text, and every imported source record and converted text file carries `converter: v1` with that value.
- A913: On the bulk-extract fixture, an original that git tracks lands in `blueprint/sources/` at level `all`; an original that git ignores lands at level `converted` and is listed in the managed `.gitignore`; and a missing original shows in `project status` as missing information, not as a problem.
- A914: On the changed-hash fixture, the report flags the source as changed since v1 converted it, and `project check` reports `source-changed` for it.
- A915: For each evidence link with an anchor on the bulk-extract fixture, `run source show <link>` returns the same text that its v1 anchor pointed to, including links that map to a row of a table CSV file.
- A916: A v1 anchor that matches two v2 anchors gives an evidence link with no anchor, the v1 anchor text in the record body, and a follow-up in the report.
- A941: After the import of the bulk-extract fixture, whose document with images keeps its image side files beside its converted text, `project check` reports no `source-unregistered` finding for any side file that the converted text links to.

### Dependencies

- Stage 2 of this phase.
- [Phase 5](05-intake-and-conversion.md): source records, the converted text form, table CSV files, the anchor algorithm, source git levels, the managed `.gitignore`, Git LFS and the `source-unregistered` check.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review in Stage 6; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none in this stage.
- Human Experience Review: the agent follows a sample of imported evidence links to their text and records whether each opens the place its v1 anchor named. To be recorded at closeout.
- Optional experience handoff: not applicable until Stage 5.
- Explicit human acceptance gate: none. The owner's acceptance of the `converter_version` value in t14 is normal product authority.
- Evidence report: the `A912` to `A916` and `A941` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 4 - Bulk-Extract Files

### Tasks

- [ ] t18: Map the review files in `extractions/REF-*.json`. A published review with no unresolved notes and no held candidates merges into the extraction records its extraction IDs name, with `reviewer` and `reviewed_at` from its publication review, coverage notes as part coverage and reuse checks in the body, and the source shows as fully extracted. Each unresolved note becomes a `draft` finding of kind `question` with an evidence link to the source and a link to its extraction, and the source shows as partly extracted. A publication that started but did not finish is a blocking problem. Row hashes, base hashes, locks and other staging internals are not imported. ([17 v1 Import](../../prd/17-v1-import.md#bulk-extract-files))
- [ ] t19: Map the staging files in `extractions/staging/`. Staged candidates with the action `minted` become `draft` records of their type with the next free refs, linked from an extraction record for the source, with the v1 review state and notes in the body. `referenced` candidates are listed in the extraction body as reused records. `updated` candidates become a pending change on the matching imported record, with the v1 review state and notes, and an update whose published row the import cannot find stays in the extraction body with a follow-up. ([17 v1 Import](../../prd/17-v1-import.md#bulk-extract-files))

### Acceptance criteria

- A917: On the bulk-extract fixture, the published review's source shows as fully extracted with part coverage from its coverage notes, and the source with an unresolved note shows as partly extracted with one `draft` `question` finding per note.
- A918: Each staged `minted` candidate is a `draft` record with a new `ref`, each `updated` candidate is a pending change on its imported record while the record file keeps its v1 value, and an `updated` candidate with no published row appears as a follow-up.
- A919: No imported record or file holds a v1 row hash, base hash or staging lock value.

### Dependencies

- Stage 3 of this phase.
- [Phase 6](06-extraction-and-review.md): extraction records and parts, drafts and pending changes.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review in Stage 6; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none in this stage.
- Human Experience Review: the agent checks that every piece of v1 review work in the fixture, such as unresolved notes and staged updates, appears in v2 as a draft, a pending change or extraction detail, and records any that a reviewer could miss. To be recorded at closeout.
- Optional experience handoff: not applicable until Stage 5.
- Explicit human acceptance gate: none.
- Evidence report: the `A917` to `A919` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 5 - Dry-Run Report, Write and After-Import Check

### Tasks

- [ ] t20: Give every v1 item exactly one outcome: imported, imported with a follow-up, waits for v2.2, not imported, or blocking problem. Test cases, runs, results, run folders and playbooks wait for v2.2, stay untouched in the v1 project, and keep links to them as text in the body of the records that hold them. ([17 v1 Import](../../prd/17-v1-import.md#items-that-do-not-map))
- [ ] t21: Build the dry-run report in human and JSON output with the same meaning: first the verdict (ready to write or blocked) and the counts for each outcome; a table of counts by v1 shape and outcome; the ref plan; the shared-file plan for `.make/personas.yaml` and `.make/config.yaml`; the evidence summary; follow-ups grouped by kind, each with the v1 ID or path, the reason and the command or stage that settles it; each blocking problem with its clearing action; and a last line that names the next useful action. It names items by v1 ID, `ref` and path and never shows a new `id`. ([17 v1 Import](../../prd/17-v1-import.md#dry-run-report))
- [ ] t22: Build `run import v1 <v1-project>` (MCP `import_v1`, profile `setup`). With no write option it is a dry run that writes no file. `--apply` builds the plan again from the current files, shows the same report, and writes. The MCP tool is a dry run by default, and its write needs `apply: true` and `allowWrite: true`. The command refuses any folder other than the current project folder. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-import))
- [ ] t23: Build the writer as one journaled change under the shared write lock. It writes records, source records, originals, converted text and project settings only under `blueprint/` and `.make/`, and the core's writes to `.make/personas.yaml` and `.make/config.yaml` join the same journaled change. It never changes, moves or deletes a v1 file. After a crash, the next command finishes or undoes the whole import. ([17 v1 Import](../../prd/17-v1-import.md#component-and-capability-map))
- [ ] t24: Build the after-import check. After the write, the command rebuilds the index, runs `project check` and shows `project status`. The problems `project check` reports are exactly the follow-ups the report listed, and information notes such as `name-not-slug` are not counted as problems. ([17 v1 Import](../../prd/17-v1-import.md#component-and-capability-map))
- [ ] t25: Write the determinism and crash tests. Two dry runs and two writes on copies of the same fixture give the same refs, outcomes and report, apart from random `id` values. Stopping the write at each journal step leaves the whole import or none of it after the next command. ([17 v1 Import](../../prd/17-v1-import.md#component-and-capability-map))

### Acceptance criteria

- A920: The JSON report of each fixture equals its stored expected report, and every v1 item in the fixture has exactly one outcome in it.
- A921: The human dry-run report's first line reads "v1 import dry run: ready to write" or "v1 import dry run: blocked", the counts for each outcome follow, the last line starts with "Next:", and no line shows a new `id`.
- A922: `run import v1 .` with no option writes no file, by hash of the whole project folder before and after. The MCP `import_v1` call with `apply: true` and no `allowWrite` returns `blocked` with `write-not-allowed` and writes nothing. `run import v1 ../other-folder` refuses.
- A923: After `run import v1 . --apply` on the bulk-extract fixture, every v1 file has the same hash as before the import, and every new or changed file sits under `blueprint/` or `.make/`.
- A924: The crash tests stop the write at each journal step, and after the next command the project holds either every imported record and the shared-file entries or none of them.
- A925: After the write, the problems that `project check` reports equal the follow-ups in the report, one for one, and `project status` shows the imported sources and the drafts waiting for review.
- A926: A second `run import v1 . --apply` on the imported project refuses and changes no file.

### Dependencies

- Stages 1 to 4 of this phase.
- [Phase 3](03-storage-and-identity.md): the write journal, the shared write lock and index rebuild.
- [Phase 8](08-mcp-skills-and-status.md): `project status`, the `setup` profile and the `import_v1` tool listing.
- [Phase 2](02-cli-and-packaging.md): the `allowWrite` gate.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review in Stage 6; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none in this stage.
- Human Experience Review: the agent reads the human dry-run report of the bulk-extract fixture from top to bottom and records whether a person can tell from the first lines whether the write can run, how many items need a follow-up, and what to do next. To be recorded at closeout.
- Optional experience handoff: in a copy of the bulk-extract fixture, run `make-blueprint run import v1 .`, read the first lines and the "Next:" line, then run it with `--apply` and read `project status`. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A920` to `A926` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 6 - Imported Project Checks and the Client C Import

### Tasks

- [ ] t26: Write the end-to-end check of an imported project on the bulk-extract fixture. It checks every result that 17 lists: v1 IDs found by `ref`, `REF-NNN` names and system slugs found by alias, every link an `id` that resolves apart from listed follow-ups, `project check` reporting exactly the listed follow-ups, `project status` counts that match the v1 review states, the `.make/personas.yaml` and `.make/config.yaml` entries, equal counts after deleting and rebuilding the index, evidence links that open their v1 text, unchanged v1 files, and a second import that refuses. ([17 v1 Import](../../prd/17-v1-import.md#end-to-end-check-of-an-imported-project))
- [ ] t27: Extend the end-to-end check with the skills on the imported project: `run extract next` hands out a partly extracted source, review makes an imported draft `active` and decides an imported pending change, the model stage fills an empty capability `system`, and a comparison and a fit-gap export complete. ([17 v1 Import](../../prd/17-v1-import.md#end-to-end-check-of-an-imported-project))
- [ ] t28: Run the Guided Progress Review. A reviewer the owner names imports a v1-shaped fixture in a fresh copy, reads the dry-run report, runs the write, and records whether record names, source names, links and evidence still make sense, and which follow-ups were unclear. The agent writes the record into `evidence.md`. ([17 v1 Import](../../prd/17-v1-import.md#end-to-end-check-of-an-imported-project))
- [ ] t29: Run the Client C dry run before release. With the owner, run `run import v1` with no write option on a scrubbed copy of the Client C project kept outside this repository, and settle every shape the report does not handle by a fix and a new edge-case fixture written from scratch. Record in `evidence.md` only shape names, counts and outcome categories. No Client C file, value, name beyond the company name, or report enters the repository. ([03 Open Questions and Risk Register](../../prd/03-open-questions-and-risk-register.md#r-021-client-c-v1-data-shapes))
- [ ] t30: Run the real Client C import when Client C moves to v2.0. With the owner, in the Client C project folder, run `setup`, the dry run and the write, and record the outcome counts and whether `project check` reports exactly the follow-ups the report listed. The results stay outside the repository apart from the counts in `evidence.md`. ([03 Open Questions and Risk Register](../../prd/03-open-questions-and-risk-register.md#q-071-v1-import-release-and-client-c))

### Acceptance criteria

- A927: The end-to-end check of the imported bulk-extract fixture passes every item in t26 and t27.
- A928: The Guided Progress Review record in `evidence.md` names the fixture and the reviewer's role, records the observations on names, links and evidence, lists any unclear follow-up, and gives a conclusion and its limits.
- A929: The Client C dry run on the scrubbed copy reports no unhandled shape: every item has one of the five outcomes, and the `evidence.md` entry holds only shape names, counts and outcome categories.
- A930: A scan of the repository finds no Client C file, value or report.
- A931: After the real Client C import, the `evidence.md` entry records the outcome counts and that `project check` reported exactly the listed follow-ups, or names each difference.

### Dependencies

- Stage 5 of this phase.
- [Phase 7](07-analysis-and-exports.md) and [Phase 8](08-mcp-skills-and-status.md): the comparison, export and skills used on the imported project.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review active and held in t28; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none in this stage.
- Human Experience Review: the agent reviews the import outcomes in 17 against the end-to-end check and the Guided Progress Review record, and records an observation, a conclusion, the limits and the next action for each. To be recorded at closeout.
- Optional experience handoff: not applicable beyond the handoff in Stage 5.
- Explicit human acceptance gate: none. The owner takes part in t29 and t30 because the Client C copy stays outside the repository; that is access, not a Human Experience gate.
- Evidence report: the `A927` to `A931` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. When v2.0 ships before Client C moves, t30 stays open; the phase then records partial capability status and the owner chooses the route for the real import.

## Stage 7 - Release Builds and the Release Check

### Tasks

- [ ] t31: Build the v2.0 npm package `@brucewaynedecoy/make-blueprint` with the binary `make-blueprint`, requiring Node 24 or later, holding the CLI, the MCP server, the pinned core version, the nine skills, all system docs and the built-in converters, with no install script that downloads anything. ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#npm-package))
- [ ] t32: Build and sign the v2.0 single file for each target: macOS on arm64 and on x64, Windows on x64, and Linux on x64 and on arm64. Each file holds the Node 24 runtime, the CLI, the MCP server, the pinned core version, the nine skills, all system docs and the built-in converters, and runs from the one file without unpacking a program at run time. ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#signed-single-files))
- [ ] t33: Build the release check as one pipeline job that fails the release on any failed step: the core resolves only from the published `@brucewaynedecoy/make-core` at the pinned version, never a workspace link; the installed CLI reports its own version and its core version; each signed file's signature verifies with the platform's standard tools; on macOS and Windows each file opens under the default security settings with no override; the PRD and performance evidence validators exit zero; and the full test suite, skill lint and golden-file tests pass on the release build. ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#core-dependency-line))
- [ ] t34: Run the clean-container end-to-end check on each target, in a clean container or, where the platform has none, a clean virtual machine, with no Python, no Node and no network. Install only the signed file, run `setup`, run all seven stages and the command path of all nine skills on the synthetic sample project, run the imported-project check from Stage 6, and check that no command, skill or converter starts Python, Node, a shell script or any other interpreter, that the MCP entries `setup` wrote start that same file, and that outside the project the file wrote only to `~/.make/blueprint/`, the approved agent-tool files and short-lived non-program files in the temporary folder. ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#signed-single-files))
- [ ] t35: Re-run the start-time characterization on the release build. Render the execution packet from the start-time `PERF-###` profile that [Phase 2](02-cli-and-packaging.md) created, run it once on the release build under the budget and stop rule that the profile sets, and record the result bound to the profile ID, version, digest and the release build fingerprint, with its observed distribution and uncertainty. Set no target. ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#start-time-performance))
- [ ] t36: Write the parity test between the signed file and the npm package of the same version: the same commands on the same fixture give the same results. ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#signed-single-files))
- [ ] t37: Collect the Human Experience Review of every plan promise. For each of the eight promises in the plan overview, gather the review that its phase recorded, and record in `evidence.md` the promise, the evidence used, the conclusion (`satisfied`, `material gap` or `insufficient evidence`), the limits and the next action. A promise with a `material gap` blocks an unqualified claim about it in the release notes. ([01 Product Overview](../../prd/01-product-overview.md#experience-promises))
- [ ] t38: Write the v2.0 release notes from the v2.0 row of the 01 release scope and its current limitations: setup A, the CLI, the MCP server, the nine skills, conversion with the agent route for complex PDFs, extraction and review, the twelve record types, `project status`, `project check`, exports and the v1 import; the five targets, with Windows on arm64 in a later release; the Make Docs link skip under O-001; and no claim about v2.1, v2.2 or v3 scope or beyond the evidence in t37. ([01 Product Overview](../../prd/01-product-overview.md#release-scope))
- [ ] t39: Publish v2.0 once the owner approves: the npm package and the five signed files from the same source and version, with the release notes. ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#distribution))

### Acceptance criteria

- A932: `npm pack` of the release build lists the CLI, the nine skill folders, the system docs and the converters, its `package.json` names `@brucewaynedecoy/make-core` at one exact version and Node 24 or later, and holds no install script.
- A933: The release check passes on the release build, and a test build that resolves the core through the workspace link fails it at the core step.
- A934: `make-blueprint --version` on each signed file prints the Make Blueprint version and the core version, and each file's signature verifies with `codesign --verify` on macOS, `signtool verify` on Windows, and the chosen Linux method.
- A935: The clean-container end-to-end check passes on each of the five targets: `command -v python3 python node` finds nothing, all seven stages and the nine skills' command paths complete, the imported-project check passes, an exec trace shows no interpreter or unpacked program started, and a file system diff outside the project shows writes only in the allowed places.
- A936: The parity test passes: the signed file and the npm package give the same results for every command in the test.
- A937: The start-time result in `evidence.md` names the profile ID, version and digest, the release build fingerprint, the targets measured, the observed distribution and its uncertainty, and the budget used, and states that no target applies.
- A938: The Human Experience Review roll-up in `evidence.md` holds one entry for each of the eight plan promises with its evidence, conclusion, limits and next action.
- A939: The release notes name each v2.0 capability in the 01 release scope, the five targets, the O-001 skip, and no capability of a later release, and every claim in them traces to an entry in the roll-up or the release check.
- A940: The npm registry shows `@brucewaynedecoy/make-blueprint` at v2.0 and the release page holds the five signed files of the same version.

### Dependencies

- Stages 1 to 6 of this phase.
- [Phase 1](01-shared-core-adoption.md): the exact core pin and the published core release.
- [Phase 2](02-cli-and-packaging.md): the single-file build and signing pipeline, the platform signing certificates, and the start-time `PERF-###` profile.
- [Phase 7](07-analysis-and-exports.md) and [Phase 8](08-mcp-skills-and-status.md): the golden-file tests, skill lint and the synthetic sample project.
- Every earlier phase: the Human Experience Review that each recorded.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing active for the start-time re-run only; Guided Progress Review not used in this stage; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: base action `update-existing`; applicability `characterize-now`; the start-time `PERF-###` profile from [Phase 2](02-cli-and-packaging.md); packet rendered in t35; result, budget used, fingerprint and expiry to be recorded at closeout; no finding or waiver expected; gate `characterization-baseline` with no pass or fail target; supported scope limited to the release build on the measured targets.
- Human Experience Review: t37 records the review of every plan promise. For the signed-file promise, the agent inspects the clean-container run on each target and records the observation, conclusion, limits, such as targets run in a virtual machine, and the next action. To be recorded at closeout.
- Optional experience handoff: download the signed file for your platform, verify its signature, run `make-blueprint setup` in a fresh folder, and notice whether every skill works with no Python or Node installed. Feedback is welcome and optional.
- Explicit human acceptance gate: none defined by current authority. Publishing in t39 waits for the owner's approval as the release owner.
- Evidence report: the `A932` to `A940` section of `evidence.md` in this backlog folder, including the Human Experience Review roll-up and the start-time result. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. v2.0 is released when A932 to A940 hold. O-001 stays open after release.
