---
title: "Phase 2: Records and Storage"
kind: "plan"
status: "draft"
coordinate: "W1 R1 P2"
---

# Phase 2: Records and Storage

## Purpose

Carry the owner's decisions into the PRDs that own storage, record identity, statuses, checks and record fields. The field and setting names below are fixed by this plan, so every PRD worker uses them and all five can run at once.

## Write Scope

`docs/prd/09-storage-and-indexing.md`, `10-records-and-identity.md` and `11-record-types-reference.md`.

- Front matter: set `source.path` to `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md` in every PRD you edit. Add no `## Requirement History` section (see the overview).

## Field and Setting Names

Every PRD worker uses these names exactly. 11 defines the fields, 06 lists the settings, and the owning PRDs define the behavior.

| Where | Name | Value |
| --- | --- | --- |
| Every record type | `docs` | List of project-relative paths to Make Docs docs |
| Every record type | `work_items` | List of Make Docs work item IDs |
| Every record type | `owners` | List of `maintainer` slugs from `.make/personas.yaml` |
| Every record type | `stakeholders` | List of `maintainer` slugs, never the same slug as in `owners` |
| Capability, requirement | `audience` | List of `user` slugs from `.make/personas.yaml` |
| Capability | `capability_type` | One code from a list the project can extend |
| Capability | `triggers`, `outcomes`, `entities` | Lists of short text |
| Capability | `depends_on` | List of capability `id` values in the same system |
| Requirement of kind `setting` | `option_values`, `option_default`, `option_scope` | List of text; text; one code from a list the project can extend |
| Persona | `slug` | The persona's slug in `.make/personas.yaml` |
| Source | `git_level` | Optional override: `all`, `converted` or `none` |
| Fit-gap | `requirement_marks` | List of marks, as below |
| One mark | `requirement` | The baseline requirement `id`; for a capability with no requirements, `capability` with the baseline capability `id` instead |
| One mark | `version` | The content version of that requirement or capability when it was marked (Q-076) |
| One mark | `mark` | `met`, `configured`, `unreleased`, `partly` or `not-met` |
| One mark | `capabilities` | Target capability `id` values that meet it, never requirement `id` values |
| One mark | `evidence` | Evidence links into source text |
| One mark | `note` | Text; required for `not-met`, saying where the agent looked |
| Placement | `integrations` | List of integration `id` values, for `delivery: integrate` |
| Integration (`INT`) | `from_system`, `to_system` | System `id` values; one record is one direction |
| Integration | `from_capabilities`, `to_capabilities` | Optional lists of capability `id` values on each side |
| Integration | `payload` | Short text: the data or event that moves |
| Integration | `trigger`, `frequency` | `on-change`, `schedule` or `on-request`; short text |
| Integration | `method` | `api`, `file`, `event`, `isv` or `manual`, a list the project can extend |
| Integration | `state`, `replaces`, `effort` | `current` or `planned`; list of current integration `id` values; the fit-gap effort list |
| Source record | `converter` value `v1` | Converted text that the v1 import keeps |
| Source record | `converter` value `agent`, with `converter_model` and `converted_at` | Converted text that an agent wrote through the complex-PDF route (Q-080); the model name and the date |
| Record storage | Record version | One value per record that ignores line endings, used by write checks |
| Record storage | Content version | A hash of the meaning fields of a requirement or capability, kept by marks (Q-076) |
| Source record | `conversion_status` values `agent-in-progress` and `awaiting-review` | The agent route's states before the text is accepted (Q-080) |
| `.make/personas.yaml` entry | kind | `person`, `team`, `organization` or `agent` (Q-077) |
| `.make/config.yaml` | `name` | Optional project display name |
| `.make/blueprint/config.yaml` | `sources.git_level` | `all` (default), `converted` or `none` |
| `.make/blueprint/config.yaml` | `sources.lfs_threshold_mb` | Default `50` |
| `.make/blueprint/config.yaml` | `conversion.table_csv_min_rows` | The size above which a document table becomes a CSV file; work phase 05 sets the default |
| `.make/blueprint/config.yaml` | `review.second_reviewer` | `false` by default |
| `.make/blueprint/config.yaml` | `lists.capability_type`, `lists.option_scope`, `lists.integration_method` | The codes a project adds to each built-in list (Q-078) |
| `project check` | `mark-capability-uncovered` (Error), `audience-inactive-persona` (Warning), `name-not-slug` (Information) | Codes for Q-079 and Q-077 |
| CLI | `run source pages-next`, `run source pages-write`, `run source convert --agent` | The agent route commands (Q-080); 08 owns the final names |
| Converted text | `<original>.t-001.csv` | One CSV file per extracted table, beside `<original>.md` |

## Updates

Each row is `update-existing` unless it says `none`.

| Decision | PRD | Sections | Current normative update |
| --- | --- | --- | --- |
| Q-009 | 09 | Scope; Schema Versions; Sibling Modules; Rebuild Notes | Record upgrades run when `setup` runs again, not through `update`. |
| Q-017 | 09 | Derived Index; Write Lock; Write Journal; Rebuild Notes | `none`. |
| Q-020 | 09 | Write Lock; Write Journal; Storage Interface; Record Changes Read as One-File Git Diffs | A busy writer gets a `blocked` result (code `busy`) after a short wait, and stale locks clear themselves. Large approvals run in batches; each batch is its own journaled change, and an interrupted large approval reports `partial` and can be run again. |
| Q-020, Q-068 | 09 | Storage Interface | Define one record version value that does not change with line endings (for example a hash of the record's content with LF line endings). Write checks (Q-020) use it. Requirement marks use the content version (Q-076). |
| Q-021 | 09 | Storage Interface | `none`. |
| Q-028, Q-029, Q-072 | 09 | Record Changes Read as One-File Git Diffs | Name the git-tracked files outside `blueprint/records/` that Make Blueprint writes: the managed `blueprint/sources/.gitignore` and `.gitattributes`, and, through the core, `.make/personas.yaml` when a persona record is approved. |
| Q-059 | 09 | Component and Capability Map; Setups | `none`. |
| Q-066 | 09 | Derived Index | The index holds the links inside `requirement_marks`, so evidence checks, reverse links and the out-of-date check see them. |
| Q-067 | 09 | Storage Interface; Derived Index | `search` serves duplicate hints, fit-gap candidates and the similar-capabilities check with one matching rule and a stable score on every run. No embeddings or network services in v2.0. |
| Q-009 | 10 | Check Catalog | `schema-old` names `make-blueprint setup` as the command to run. |
| Q-018 | 10 | The `id`; Common Fields; Rebuild Notes | The random part is 8 lowercase letters and digits with at least one letter, for example `REQ-7kq2m4xa`. State the clash odds for a large project. |
| Q-019 | 10 | `run record ref-fix` | The record created first keeps the `ref` (earliest `created_at`, then lower `id`). Remove the option for a person to name the keeper. |
| Q-021 | 10 | Statuses | v2.0 has no delete command. Records leave use through `archived` or `superseded`. A hand-deleted file shows as `broken-link` on the records that point to it. |
| Q-022 | 10 | Scope; Facets | 10 owns the facet config format. |
| Q-023 | 10 | Common Fields | `docs` and `work_items` are common fields on every record type. `docs` holds paths to any Make Docs doc, such as a design, plan, PRD, work item or guide. |
| Q-024 | 10 | Check Catalog; Integrations | `project check` skips Make Docs links and reports how many, until the Make Docs read command ships (obligation O-001). |
| Q-028 | 10 | Evidence Links Are Checked and Flag Changed Sources; Evidence Links; Check Catalog; Integrations | Remove the `repo` and `local` wording. `unavailable` applies only when the converted text is not on this machine (level `none`). A missing original under `converted` or `none` is information; a missing git-tracked original is the error `source-file-missing`. |
| Q-032 | 10 | Statuses | A fact on an `active` record is fixed in place through a pending change: the old value stays until review, an approved change is written into the same file, and a rejected one keeps its reason. `run record supersede` is only for real replacements, such as a split. 13 designs pending-change storage and review commands before work phase 06 ends. |
| Q-033, Q-050 | 10 | Scope; Statuses; Integrations | `none`. |
| Q-061 | 10 | Evidence Links | The link format adds the `t` kind and the table, row, column and cell forms, with their `malformed` and `broken` states. |
| Q-066 | 10 | Evidence Links; Relation Rules | Source links and capability `id` values inside marks follow the evidence-link and relation rules, `evidence_versions` included. A mark that cites a requirement is refused. |
| Q-068 | 10 | Check Catalog | A new code flags a fit-gap record whose marks no longer match the capability's current requirements, and names the hand-out command. The fix goes through a pending change. |
| Q-070 | 10 | Common Fields | `owners` holds `maintainer` slugs from `.make/personas.yaml`; one owner is a list of one. `stakeholders` holds `maintainer` slugs and never the same entry as `owners` on one record. |
| Q-072 | 10 | Check Catalog | Checks for a slug that is not in `.make/personas.yaml`, a slug of the wrong primitive, and a slug in both `owners` and `stakeholders`. |
| Q-018 | 11 | Type Summary; Source; Capability; Fit-Gap; Placement | Lengthen example `id` values to 8 characters. |
| Q-022, Q-030 | 11 | Purpose; Source | `none`. |
| Q-023, Q-070 | 11 | Common Fields and Field Order; Placement | `docs`, `work_items` and `stakeholders` join the common field order. Remove the placement-only wording for `docs` and `work_items`. |
| Q-028 | 11 | Source | A per-source git level override replaces `location` and the link rule for `path`. Restate "missing". Fix the example. |
| Q-048, Q-072 | 11 | Persona | A persona record is related to a Make Docs Persona, not separate. It carries a field that names its slug in `.make/personas.yaml`, and the core adds that entry when the record is approved. No `docs_persona` field. |
| Q-057 | 11 | Placement; Relation Summary | `integrations` (a list of `INT id`, for `delivery: integrate`) in the field table, "Relations stored here" and the summary. No `partner_systems`. |
| Q-061 | 11 | Source | `converted_path` names the main Markdown file; the table CSV files sit beside it. |
| Q-064, Q-070 | 11 | Capability; Requirement; Relation Summary | Optional capability fields `capability_type`, `triggers`, `outcomes`, `entities` and `depends_on` (capability `id` values in the same system), and `audience` (`user` slugs) on capabilities and requirements. A `setting` requirement adds `option_values`, `option_default` and `option_scope`. |
| Q-065, Q-066, Q-068 | 11 | Fit-Gap | `requirement_marks`: one mark for each baseline requirement, or one for a capability with no requirements, with a value of `met`, `configured`, `unreleased`, `partly` or `not-met`. Evidence is target capability `id` values or source links, never target requirements; a `not-met` mark carries a note on where the agent looked. Marks are required for every verdict and absent on `target-only`. Each mark keeps the `id` and version of the requirement it marked. `gap_detail` is required for `partial`, `unreleased` and `gap`. |
| Q-080 | 11 | Source | The `converter` list includes `agent`. An `agent` conversion also records `converter_model` and `converted_at`. |
| Q-073 | 11 | Purpose; Type Summary; new Integration section; System; Capability; Extraction; Placement; Relation Summary | Type `integration` (`INT`, `blueprint/records/integration/`) with `from_system`, `to_system`, `from_capabilities`, `to_capabilities`, `payload`, `trigger` (`on-change`, `schedule` or `on-request`), `frequency`, `method` (`api`, `file`, `event`, `isv` or `manual`, a list the project can extend), `state` (`current` or `planned`), `replaces` and `effort`. Twelve v2.0 types. Integration joins the extraction `records` targets and the "Linked from" lists. Behavior is owned by the new PRD 19, planned in [Phase 4](04-analysis-exports-and-integrations.md). |
| Q-076 | 09 | Scope; Storage Interface; Derived Index; Integrations | Define the content version beside the record version. It is the SHA-256 hash, with LF line endings, of a fixed serialization of `title`, `summary`, `kind`, `option_values`, `option_default`, `option_scope` and the Markdown body of a requirement, or of `title`, `summary` and the body of a capability. It covers the field values, not their layout in the file. Tags, facets, `owners`, `stakeholders`, `audience`, links, evidence, timestamps and `schema_version` do not change it. Write checks use the record version, and marks use the content version. The index keeps the content version on requirement and capability rows. |
| Q-076 | 10 | Check Catalog (`marks-out-of-date`); Integrations (Storage row) | Out-of-date marks compare content versions, so a tag, facet or owner change never flags a fit-gap record. |
| Q-076 | 11 | Fit-gap (`requirement_marks`, `version`) | A mark's `version` holds the content version, 64 lowercase hexadecimal characters. |
| Q-077 | 10 | People and Role Slugs; Check Catalog | An entry stays when its persona record is archived or superseded. A rejected persona record never has an entry. Warning `audience-inactive-persona`: an `active` record's `audience` names a slug whose persona record is archived or superseded. An approved persona record claims an unclaimed `user` entry with its slug; the approval is refused when another persona record claims the entry or the entry is a `maintainer` entry. Information `name-not-slug`: `extracted_by` or `reviewer` holds free text, not a `maintainer` slug. |
| Q-077 | 11 | Persona; Extraction | Persona: the core adds the entry at approval and keeps it when the record is archived or superseded. Extraction `extracted_by` and `reviewer`: a `maintainer` slug when one exists, else free text. |
| Q-078 | 11 | Lists the Project Can Extend; Capability (`capability_type`); Requirement (`option_scope`); Integration (`method`) | List the built-in codes from register Q-078, and point to the `lists.*` settings in 06. |
| Q-079 | 10 | Check Catalog | Error `mark-capability-uncovered`: a mark names a capability that is not in the record's `covering_capabilities`. |
| Q-079 | 11 | Fit-gap (`covering_capabilities`, `requirement_marks`) | Every capability a mark names is also in `covering_capabilities`. |
| Q-080 | 11 | Source (`conversion_status`, `converter`) | `conversion_status` also takes `agent-in-progress` and `awaiting-review`. An `agent` conversion counts as `converted` while the original's hash matches; a new model or CLI version does not make it stale. |
| Q-082 | 10 | Check Catalog | Information `source-unregistered`: a file in `blueprint/sources/` that no source record names, with `run source add` as the next action. |
| Q-080 | 10 | Evidence Links; Check Catalog (`old-version`) | Each `evidence_versions` entry keeps `converter` as well as `sha256` and `converter_version`. |

## Example IDs

Replace every short example `id`: six in 09, eleven in 10 (including `REQ-7kQ2m` in Rebuild Notes) and 21 in 11.

## Exit Criteria

- Every row above is done, and the PRDs use the names in Field and Setting Names exactly.
- Each PRD's front matter `source.path` names the `W1 R1` plan.
- No short example `id` remains in these PRDs.
