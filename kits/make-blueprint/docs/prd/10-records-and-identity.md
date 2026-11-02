---
title: "10 Records and Identity"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 10 Records and Identity

## Purpose

Every Make Blueprint record follows the same rules, whatever its type. This PRD owns those shared rules: the common fields, what each status means and how a record moves between statuses, the two IDs that every record carries (`id` and `ref`), aliases and how a name finds a record, facets, the evidence link format and its validation, the relation rules that all types share, and the full catalog of what the `project check` command checks. It also owns the `run record ref-fix` command, which fixes ref clashes.

These rules let people name records in a friendly way, let branches merge without losing links, and let every fact trace back to an exact place in a source.

## Scope

This PRD covers:

- The common front matter fields and their rules, including the people fields `owners` and `stakeholders` and the Make Docs link fields `docs` and `work_items`.
- Status meanings, the allowed status changes, how a fact on an `active` record is fixed, and how a record leaves use.
- `id` and `ref` rules, aliases, name lookup, ref clash detection and `run record ref-fix`.
- Facets: the facet config format and its validation. This PRD is the authority for the facet format.
- The evidence link format and its validation. This is the link-validation half of the evidence promise.
- Relation rules shared by all record types.
- The full catalog of `project check` checks.

Other PRDs own these related topics:

| Topic | Owner |
| --- | --- |
| Type-specific fields, relations, cardinality and field order | [11 Record Types Reference](11-record-types-reference.md) |
| Record files, the index, the write lock, the journal and schema versions | [09 Storage and Indexing](09-storage-and-indexing.md) |
| Command names, flags, output formats, exit codes and the `status` read model | [08 CLI and MCP](08-cli-and-mcp.md) |
| Anchors, converted text, following a link to its place, and source change detection (the anchor half of the evidence promise) | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| The review flow, the optional second reviewer, duplicate hints, and where pending changes are stored and reviewed | [13 Extraction and Review](13-extraction-and-review.md) |
| Fit-gap, comparison, placement and model-stage rules | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| The format of Make Docs work item IDs and doc paths, and their check through `make-docs` | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| The shared people and roles file, `.make/personas.yaml`: its entry format and the core code that writes it | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| How v1 IDs become refs and aliases | [17 v1 Import](17-v1-import.md) |
| The project config file's name and place | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 9: identity; section 10: data model for v2.0, facets and evidence links)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/04-record-types.md`
- `blueprint/records/<type>/<id>.md`

## Component and Capability Map

| Capability | What it gives people | Release |
| --- | --- | --- |
| Common fields | The same core fields on every record, so any record can be filtered, traced and exported the same way | v2.0 |
| Statuses | One shared meaning of draft, active, rejected, superseded and archived, with guarded changes | v2.0 |
| Two IDs | A permanent `id` that links use, and a friendly `ref` that people use | v2.0 |
| Aliases and lookup | Old refs and imported names keep finding their record | v2.0 |
| Ref clash fix | `run record ref-fix` settles clashes after a merge in one command | v2.0 |
| Facets | Project-defined value lists, such as legal entity, release or scope, on any record | v2.0 |
| Evidence links | Links from a record to an exact place in a source, with a clear flag when the source changed | v2.0 |
| Relation rules | Links between records that stay valid across merges and renames | v2.0 |
| `project check` | One read-only command that finds bad hand edits, ref clashes, broken links and links to changed sources | v2.0 |

Two observable promises from the plan live here. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind both.

### A Ref Clash Is Named and Fixed by One Command

When two branches each create a record with the same `ref`, a person learns about it from `project check`, fixes it with one command, and still finds the renamed record by its old `ref`.

Requirements:

- After a git merge in which two branches each created a record with the `ref` `REQ-042`, `project check` reports one `ref-clash` problem. It names `REQ-042`, each record by title, `id` and file path, and the command `run record ref-fix REQ-042`.
- `project status` counts ref clashes and names the same command (see [08 CLI and MCP](08-cli-and-mcp.md)).
- `run record ref-fix REQ-042` fixes that clash as one journaled change (see [09 Storage and Indexing](09-storage-and-indexing.md)).
- For each clash, the record created first keeps the `ref`. Every other record in the clash gets a newly minted `ref`, and the old `ref` goes at the end of its `aliases`.
- Only the renamed records' files change. Each one's diff shows the `ref`, `aliases` and `updated_at` lines.
- The output names each renamed record by title, with its old and new `ref`, and says that the old `ref` still finds it.
- After the fix, `project check` reports no clash. The new `ref` finds the renamed record. The old `ref` finds the record that kept it, and the same answer names the renamed record as also known by that `ref`.
- No relation field and no evidence link changes, because they use `id`.
- Running `run record ref-fix` on a `ref` that no two records share changes nothing and says so.
- Evidence: an automated two-branch merge test in which both branches create records (work phase 03).

### Evidence Links Are Checked and Flag Changed Sources

A person follows a record's evidence link to the exact place in its source and sees a clear flag when the source changed after the link was made. This PRD owns the link-validation half. [12 Source Intake and Conversion](12-source-intake-and-conversion.md) owns the anchor half: anchors, resolving a link to its place, and detecting a changed original.

Requirements:

- Every evidence link on every current record gets its link states (see [Evidence Links](#evidence-links)) from `project check`, and the same states appear next to each link in record detail output, not only in `project check`.
- Each flagged link in output names the record by `ref` and title, the link, the source by `ref` and title, the state in plain words (such as "the source changed after this link was made"), and the next useful action.
- A link made against an older source hash or an older converter version is always flagged. Make Blueprint never marks it current without an explicit confirm.
- A link to a source whose converted text is not on this machine shows as unavailable on this machine, not as broken. A source's git level says which of its files git tracks: `all` (the original and the converted text), `converted` (the converted text only) or `none` (neither), as [12 Source Intake and Conversion](12-source-intake-and-conversion.md) defines. A link shows as unavailable only at the level `none`.
- Under the git level `converted`, a link still resolves through the converted text in git, even on a machine that does not hold the original.
- Links into table CSV files reach the exact table, row, column or cell, and get the same states as other links.
- Evidence: automated tests for the link format, including table, row, column and cell positions, links to missing sources, links to a changed source, links to a source converted again with a newer converter, and links to a source whose converted text is not on this machine (work phases 04 and 05).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Human Experience Intent: evidence links and ref clashes; Decision, section 9: identity)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Human Experience Propagation)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md` (Human Experience and Evidence)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/04-record-types.md` (Human Experience and Evidence)

## Contracts and Data

### Common Fields

Every record has these front matter fields. Field names use snake_case. The Markdown body holds long prose. [11 Record Types Reference](11-record-types-reference.md) adds the fields for each type and fixes the field order.

| Field | Need | Value | Rules | Set by |
| --- | --- | --- | --- | --- |
| `id` | Required | `<PREFIX>-<code>`, with an 8-character code, such as `REQ-7kq2m7k2` | Permanent. Names the file. Every link uses it. See [The `id`](#the-id). | The CLI, at create |
| `ref` | Required | `<PREFIX>-<number>`, such as `REQ-042` | Friendly name for people. See [The `ref`](#the-ref). | The CLI, at create; then only `run record ref-fix` |
| `type` | Required | A type value from [11 Record Types Reference](11-record-types-reference.md), such as `capability` | Matches the file's folder and the `id` prefix | The CLI, at create |
| `title` | Required | One line of plain text | Not empty | A person or agent |
| `status` | Required | `draft`, `active`, `rejected`, `superseded` or `archived` | See [Statuses](#statuses) | The command that changes status |
| `summary` | Required when `active` | One paragraph of plain text | May be empty while `draft` | A person or agent |
| `evidence` | Optional, unless the type or rule needs it | A list of evidence links | See [Evidence Links](#evidence-links) | A person or agent |
| `evidence_versions` | Present when the record has evidence links | A mapping from source `id` to that source's version | One entry for each source that the record's evidence links name, in `evidence` and, on a fit-gap record, in `requirement_marks`. A missing entry makes the links `unconfirmed`. See [Evidence Links](#evidence-links). | The CLI |
| `facets` | Optional | A mapping from facet name to a list of value codes | See [Facets](#facets) | A person or agent |
| `related` | Optional | A list of record `id` values of any type | Loose links with no fixed meaning. No stage depends on them. | A person or agent |
| `work_items` | Optional | A list of Make Docs work item IDs, in the form Make Docs reports, such as `W2 R0 P3` | Make Docs links, not relation fields. Unique within the list. [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) owns the format and the check. | A person or agent |
| `docs` | Optional | A list of project-relative paths to Make Docs docs, with forward slashes | Any Make Docs doc, such as a design, plan, PRD, work item or guide. Make Docs links, not relation fields. Unique within the list. [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) owns the format and the check. | A person or agent |
| `superseded_by` | Only when `superseded` | One record `id` of the same type | Names the record that replaced this one | The command that supersedes |
| `aliases` | Optional | A list of names | Former refs and imported names. See [Aliases and Name Lookup](#aliases-and-name-lookup). | `run record ref-fix`, the v1 import, or a person |
| `owners` | Optional | A list of `maintainer` slugs from `.make/personas.yaml` | The people, teams, organizations or agents responsible for the record. One owner is a list of one. Each slug names a `maintainer` entry. See [People and Role Slugs](#people-and-role-slugs). | A person or agent |
| `stakeholders` | Optional | A list of `maintainer` slugs from `.make/personas.yaml` | The people, teams, organizations or agents who have a stake in the record but do not own it. Never holds a slug that `owners` holds on the same record. See [People and Role Slugs](#people-and-role-slugs). | A person or agent |
| `tags` | Optional | A list of short lowercase words | Letters, digits and hyphens. Free classification, unlike facets. | A person or agent |
| `origin` | Only on a record from a system package (v2.1) | A mapping with `package`, `version`, `id` and `hash` | Marks a record that came from a system package, so a new version finds it. Only `run package add` writes it. See [20 System Packages](20-system-packages.md#the-origin-stamp). v2.0 reserves the name: it reads and keeps the field and never writes it. | `run package add` |
| `schema_version` | Required | A whole number | The schema version of this record's type (see [09 Storage and Indexing](09-storage-and-indexing.md)) | The CLI |
| `created_at` | Required | UTC timestamp, such as `2026-11-02T14:05:11Z` | Never changes | The CLI |
| `updated_at` | Required | UTC timestamp | Changes on every write | The CLI |

A current record is one whose status is `draft` or `active`. Rules about uniqueness, duplicates and links in this PRD set count only current records.

Requirements:

- Every write checks these rules and refuses a record that breaks them, listing each problem.
- `project check` reports a record file that breaks them, with the codes in [Check Catalog](#check-catalog).
- Human output names records by `ref` and title. Machine output also carries `id`.

### People and Role Slugs

People and roles for every Make Kit tool live in one shared project file, `.make/personas.yaml`. The shared core reads and writes it, and Make Blueprint only reads it (see root [07 Shared People and Roles](../../../../docs/prd/07-setup-tool-and-shared-files.md#shared-people-and-roles)). Each entry has a slug, which is its short unique name, and a primitive: `user` for people or agents that use the project, or `maintainer` for people or agents that build, operate, maintain or extend it.

Records name entries by slug:

| Field | Where | Entry primitive |
| --- | --- | --- |
| `owners` | Any record | `maintainer` |
| `stakeholders` | Any record | `maintainer` |
| `audience` | Capability and requirement records (see [11 Record Types Reference](11-record-types-reference.md)) | `user` |
| `slug` | Persona records (see [11 Record Types Reference](11-record-types-reference.md)) | `user` |
| `extracted_by`, `reviewer` | Extraction records (see [11 Record Types Reference](11-record-types-reference.md)) | `maintainer`, or free text |

Requirements:

- A slug field holds slugs, never record `id` values, so it is not a relation field.
- Each slug in `owners`, `stakeholders` and `audience` names an entry in `.make/personas.yaml` with the primitive the table gives. A write refuses a slug that the file does not hold or that has the wrong primitive.
- A slug is never repeated within one list. A slug is never in both `owners` and `stakeholders` on one record.
- A `draft` persona record may name a slug that the file does not hold yet, because the core adds the entry when review approves the record. An `active` persona record's slug names a `user` entry.
- A persona record claims the entry that its `slug` names while the record is `active`. An entry that no `active` persona record names in `slug` is unclaimed.
- When review approves a persona record whose slug the file already holds, the record claims that entry if it is an unclaimed `user` entry. The approval is refused when another persona record already claims the entry, or when the entry is a `maintainer` entry. The refusal names the entry and the persona record that claims it, and the draft stays `draft` (see [13 Extraction and Review](13-extraction-and-review.md)).
- An entry stays in the file when its persona record is later archived or superseded, so every `audience` list that names the slug still resolves. `project check` warns when an `active` record's `audience` names such a slug.
- A rejected persona record never has an entry, because the core adds the entry only when review approves the record.
- `extracted_by` and `reviewer` on an extraction record hold a `maintainer` slug when the person or agent has a `maintainer` entry. Free text is still allowed, and a write never refuses it. `project check` reports free text in these fields as information.
- `project check` reports a slug that breaks these rules, with the people and roles codes in [Check Catalog](#check-catalog).

### Statuses

| Status | Meaning |
| --- | --- |
| `draft` | Created, but not reviewed yet. It is not a trusted fact. Every record that extraction creates starts here. |
| `active` | Reviewed and in use. It is a trusted fact. |
| `rejected` | Reviewed and turned down. It stays for traceability, such as extraction coverage and duplicate hints. Its body ends with the reason the reviewer gave (see [13 Extraction and Review](13-extraction-and-review.md#review)). |
| `superseded` | Replaced by another record, which `superseded_by` names. Links to it still resolve. |
| `archived` | No longer in use, with no replacement. It stays for history. |

Record status says whether a record is trusted. It is not a capability's `capability_status`, which says how far a capability has come in its own system, and it is not a fit-gap verdict.

Allowed status changes, with the commands that make them (see [08 CLI and MCP](08-cli-and-mcp.md)):

| From | To | When | Commands |
| --- | --- | --- | --- |
| `draft` | `active` | Review approves the record (see [13 Extraction and Review](13-extraction-and-review.md)). | `run review approve` |
| `draft` | `rejected` | Review turns the record down. | `run review reject` |
| `draft` | `superseded` | The draft duplicates another record, which replaces it. | `run record supersede`, `run model merge` |
| `active` | `superseded` | Another record really replaces it, such as the survivor of a model merge (see [14 Fit-Gap and Placement](14-fit-gap-and-placement.md)) or a new record when one requirement splits into two. | `run record supersede`, `run model merge` |
| `active` | `archived` | The record goes out of use. | `run record archive` |

`rejected`, `superseded` and `archived` are end states in v2.0. No command moves a record out of them. A person who needs to bring a record back edits its file by hand, and `project check` then checks the result.

v2.0 has no delete command, and the storage interface has no delete operation (see [09 Storage and Indexing](09-storage-and-indexing.md)). A record leaves use through `archived` or `superseded`, so every link and evidence trail to it still resolves. A record file that someone deletes by hand shows as `broken-link` on every record whose relation fields point to it. A hand-deleted source record also shows as `evidence-unknown-source` on every record whose evidence links name it.

A fact on an `active` record is fixed in place, through a pending change on the same record. A pending change is a proposed change to the fields or body of an `active` record that waits for review:

- A person or agent proposes the pending change. The record stays `active`, with its old value, until review.
- When a reviewer approves the change, it is written into the same record file. The `id`, the `ref` and every link stay the same, and git history keeps the old value. The diff shows exactly what changed.
- When a reviewer rejects the change, the record stays unchanged, and the reason is kept.
- A pending change never changes `status`.
- `run record supersede` is only for a real replacement, such as one requirement that splits into two. It is never the way to fix a fact.

[13 Extraction and Review](13-extraction-and-review.md) owns where pending changes are stored and the commands that review them, and designs both before work phase 06 ends.

Requirements:

- Every record that extraction or `run record create` creates starts as `draft`. Other create commands start a record as `draft` or `active`, as the stage PRD that owns the command says.
- A command refuses a status change that the table does not allow, and names the statuses the record can move to.
- `run record update` never changes `status`. On an `active` record, a change to a fact goes through a pending change, as above.
- A command that makes a record `superseded` needs `superseded_by`. It names an existing record of the same type, and following `superseded_by` from record to record ends at a record that is not `superseded`, with no loop.
- `superseded_by` appears only on a `superseded` record.
- A hand edit can set any status. `project check` sees only the result, not the change, and checks the status rules above. The git diff shows the change.

### The `id`

Requirements:

- An `id` is the type prefix from [11 Record Types Reference](11-record-types-reference.md), a hyphen and a random code, as in `REQ-7kq2m7k2`.
- The code is exactly 8 characters long. It uses only lowercase ASCII letters and digits, and always holds at least one letter. So an `id` is safe in file names on case-insensitive file systems, and it never looks like a `ref`.
- The `id` never changes. It names the record file, and every relation field and evidence link uses it.
- One alphabet and one code length apply to every type, so each type has about 2.8 trillion possible codes: 36 to the power of 8, less the 10 to the power of 8 codes with no letter.
- A clash between independent mints, on different branches or by different database users in setup C, is not expected in the life of a project. For a large project with 10,000 records of one type, the chance that any two of them share an `id` is about 1 in 56,000. For 100,000 records of one type, it is about 1 in 560. These odds are an upper bound, because only records minted apart, such as on two branches, can clash.
- Before it writes a new record, `create` checks that no record file and no index entry in the checkout uses the new `id`, and mints again if one does.
- If two branches ever mint the same `id` for the same type, git reports a conflict on that record's file when they merge, and `project check` reports it as `merge-conflict`.

### The `ref`

Requirements:

- A `ref` is the same prefix as the record's `id`, a hyphen and a decimal number, as in `REQ-042`.
- A minted `ref` has at least three digits, padded with zeros, and grows past three digits when needed, as in `REQ-1204`. Refs from the v1 import keep their v1 form (see [17 v1 Import](17-v1-import.md)).
- A new `ref` is one more than the highest number in any `ref` or alias with that type's prefix in the checkout. So a new record never takes a number that an old `ref` or an imported name already holds.
- Minting happens under the write lock (see [09 Storage and Indexing](09-storage-and-indexing.md)), so two processes in one checkout never mint the same `ref`.
- Two branches can mint the same `ref`. `project check` reports it as `ref-clash`.
- A `ref` changes only through `run record ref-fix`, which moves the old `ref` into `aliases`.

### Aliases and Name Lookup

`aliases` holds the former refs of a record and other names that should still find it, such as the v1 reference IDs and system slugs that [17 v1 Import](17-v1-import.md) keeps.

Requirements:

- Each alias is one word of letters, digits, hyphens, underscores or dots, with no spaces.
- An alias is never repeated within one record and never equals the record's own `ref`. Two records may share an alias.
- Aliases are kept for good. `ref` minting never reuses a number that an alias holds.
- Every command that takes a record name accepts an `id`, a `ref` or an alias, and ignores letter case.
- In v2.1, a record from a system package keeps its upstream ref as an alias with the package name and a dot in front, such as `acme-erp.CAP-118` (see [20 System Packages](20-system-packages.md#identity)).

A name finds records in this order:

| Step | The name | Result |
| --- | --- | --- |
| 1 | Has the form of an `id`, and a record has that `id` | That record |
| 2 | Is the current `ref` of exactly one record | That record. When other records hold the same name as an alias, the answer names them too, so a person who meant a renamed record finds it. |
| 3 | Is the current `ref` of two or more records | A ref clash. The command stops with `ambiguous-ref`, lists the records and names `run record ref-fix` with that `ref`. |
| 4 | Is no current `ref`, but an alias of exactly one record | That record, with its current `ref` shown |
| 5 | Is an alias of two or more records, and no current `ref` | The command stops with `ambiguous-ref` and lists the records. |
| 6 | Matches nothing | The command fails with `unknown-record`. |

Machine output says whether a name matched as an `id`, a `ref` or an alias. [08 CLI and MCP](08-cli-and-mcp.md) owns the problem codes `ambiguous-ref` and `unknown-record`.

### `run record ref-fix`

[08 CLI and MCP](08-cli-and-mcp.md) owns the command's arguments and output format. The command takes the clashing `ref`, as in `run record ref-fix REQ-042`.

Requirements:

- The command fixes the clash on the `ref` it is given, whether two or more records share it.
- The record created first keeps the `ref`: the record with the earliest `created_at`, and, when two records have the same `created_at`, the one with the lower `id`, compared as text. No person or option chooses another keeper.
- The same checkout content gives the same result on every machine, so two people who run the fix after the same merge make the same change.
- Every other record in the clash gets a newly minted `ref`, and the old `ref` goes at the end of its `aliases`.
- The whole fix is one journaled change.
- The command does not rewrite prose in record bodies that mentions the old `ref`. Name lookup keeps such text useful.

### Facets

A facet is a named value list that a project defines, such as legal entity, release or scope. Any record of any type can carry values from these lists. Facets are how a project extends records in v2.0; there are no custom record types.

This PRD owns the facet config format. [11 Record Types Reference](11-record-types-reference.md) owns the record fields, and [12 Source Intake and Conversion](12-source-intake-and-conversion.md) owns the anchors. Facets are defined in the project config file, `.make/blueprint/config.yaml` (see [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md)):

```yaml
facets:
  legal_entity:
    label: Legal entity
    values:
      - code: us-east
        label: US East
      - code: canada
        label: Canada
  release:
    label: Release
    values: [r1, r2, r3]
  scope:
    values: [in-scope, out-of-scope, later]
```

A record carries facet values like this:

```yaml
facets:
  legal_entity: [us-east, canada]
  release: [r2]
```

Requirements:

- A facet name is lowercase snake_case and unique in the project. `label` is optional display text.
- A facet has one or more values. Each value is a code, written as plain text or as a mapping with `code` and an optional `label`. A code uses lowercase letters, digits, hyphens and underscores, and is unique within its facet.
- On a record, `facets` maps each facet name to a list of one or more codes, with no code repeated.
- A write refuses a facet name that the config does not define, and a code that its facet does not list.
- When the config drops a facet or a value that records still use, `project check` reports each of those records.
- [08 CLI and MCP](08-cli-and-mcp.md) owns filtering by facet, and [15 Exports](15-exports.md) owns facet columns in exports.

### Evidence Links

An evidence link points from a record to an exact place in a source. It is the source record's `id`, a `#`, and an anchor in the source's converted text, as in `SRC-4hd8x7k2#p-012`. [12 Source Intake and Conversion](12-source-intake-and-conversion.md) owns anchors, such as `h-003` for a heading, `p-012` for a paragraph, `r-0457` for a row and `t-001` for a table, and how tables, rows and columns are numbered.

A table anchor (kind `t`) names a table that conversion wrote as its own CSV file beside the main converted Markdown file. A link into such a table can add positions inside it, each after a `:`. Rows count from the first data row, and the header row is not counted.

| Form | Points to | Example |
| --- | --- | --- |
| `<source id>#<anchor>` | One anchored element, such as a heading, paragraph, row or table | `SRC-4hd8x7k2#p-012` |
| `<source id>#<table anchor>` | A whole table in its CSV file | `SRC-4hd8x7k2#t-001` |
| `<source id>#<table anchor>:<row>` | One data row of the table | `SRC-4hd8x7k2#t-001:r-0012` |
| `<source id>#<table anchor>:<column>` | One column of the table | `SRC-4hd8x7k2#t-001:c-003` |
| `<source id>#<table anchor>:<row>:<column>` | One cell of the table | `SRC-4hd8x7k2#t-001:r-0012:c-003` |
| `<source id>` | The source as a whole, with no exact place | `SRC-4hd8x7k2` |

Each record keeps its links in `evidence` and, in `evidence_versions`, the version of each source that its links were made against:

```yaml
evidence:
  - SRC-4hd8x7k2#p-012
  - SRC-4hd8x7k2#r-0457
  - SRC-9wq2e7k2#h-003
evidence_versions:
  SRC-4hd8x7k2:
    sha256: d5fd20e081e5a152ac41c4e0111055d73171e91d42603eb49eefbb7a7cf2f876
    converter: docx
    converter_version: "1"
  SRC-9wq2e7k2:
    sha256: 6c1e0f4a9b8d7c2e5f3a1b0d9e8c7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e
    converter: pdf
    converter_version: "1"
```

Requirements:

- A link names the source by `id`, never by `ref` or alias. A command that is given a source `ref` stores the `id`.
- A link normally has an anchor. A link with no anchor, such as `SRC-4hd8x7k2`, is valid but does not reach an exact place, so `project check` flags it. Such links come from the v1 import when a v1 anchor cannot be matched (see [17 v1 Import](17-v1-import.md)).
- Links are unique within one list and keep their stored order.
- A row or column position appears only after a table anchor. In a cell link, the row comes before the column.
- The evidence links in a fit-gap record's `requirement_marks` (see [11 Record Types Reference](11-record-types-reference.md)) are evidence links of that record. They follow every rule in this section, `project check` gives them the same states as the links in `evidence`, and the record's `evidence_versions` holds an entry for each source they name.
- `evidence_versions` has one entry for each source that the record's evidence links name. Each entry holds the source's `sha256`, `converter` and `converter_version` from the time the links to that source were made or last confirmed. The CLI writes the entry whenever it writes a link, and drops entries that no link uses.
- A command that adds a link to a source whose entry in this record is older than the source's current version refuses, and names the record's other links to that source to confirm first.
- Confirming a record's links to one source, after a person or agent has read the linked text again, sets that source's entry to its current version. The command is `run record confirm-evidence <record> <source>` (see [08 CLI and MCP](08-cli-and-mcp.md)).
- Every fit-gap record carries at least one evidence link (see [14 Fit-Gap and Placement](14-fit-gap-and-placement.md)).
- A current record that an extraction created or updated carries at least one evidence link to that extraction's source.

Link states:

| State | When it applies | Level in `project check` |
| --- | --- | --- |
| `malformed` | The link does not have one of the link forms above, such as a row or column position with no table anchor before it, a position after an anchor that is not a table, or a cell link with the column before the row | Error |
| `unknown-source` | No source record has that `id` | Error |
| `unavailable` | The source's converted text is not on this machine, because the source's git level is `none`. The rest of the link cannot be checked here. | Information |
| `no-anchor` | The link names a source with no anchor | Warning |
| `not-converted` | The source has no converted text | Error |
| `broken` | The anchor is not in the source's current converted text, the table's CSV file is absent, or a row or column position is outside the table | Error |
| `old-version` | The record's entry for the source differs from the source's current `sha256`, `converter` or `converter_version` | Warning |
| `unconfirmed` | The record has no entry for the source, for example after a hand edit | Warning |
| `ok` | None of the above | None |

A link can have more than one state, such as `broken` and `old-version` when an anchor moved because the source changed. Output lists every state that applies, most serious first.

### Relation Rules

A relation field is a front matter field whose value is one record `id`, a list of them, or a list of entries that each hold one or more, such as an extraction's `records` or a fit-gap record's `requirement_marks`. [11 Record Types Reference](11-record-types-reference.md) lists every relation field with its target types and cardinality. These rules apply to all of them.

Requirements:

- A relation field stores `id` values, never refs or aliases. Commands accept any name and store the `id`.
- Each relation is stored on one side only, the side that [11 Record Types Reference](11-record-types-reference.md) names. The other direction comes from the index (see [09 Storage and Indexing](09-storage-and-indexing.md)). For example, a requirement stores its `capability`, and a capability does not list its requirements.
- A to-one field holds exactly one `id` when it is present. A to-many field holds a list of unique `id` values in stored order.
- Every target exists and has a type that the field allows.
- A record never links to itself.
- A tree field, such as a capability's `parent`, never forms a loop.
- A current record that links to a `rejected` or `archived` record gets a warning. A current record that links to a `superseded` record gets a warning that names the record at the end of the `superseded_by` chain.
- `related` links any type to any type and carries no meaning that a stage relies on.
- In each entry of a fit-gap record's `requirement_marks`, `requirement`, `capability` and `capabilities` are relation fields and follow these rules. `capabilities` holds target capability `id` values only. A write refuses a mark that cites a requirement in `capabilities`, and `project check` reports one as `link-type`.
- Evidence links, Make Docs links (`work_items` and `docs`, see [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md)) and the slugs in [People and Role Slugs](#people-and-role-slugs) are not relation fields and follow their own rules.

### Check Catalog

`project check` checks every record file in the checkout through the index (see [09 Storage and Indexing](09-storage-and-indexing.md)). Each problem has a stable code, a level and the next useful action.

| Level | Meaning |
| --- | --- |
| Error | The data breaks a rule. `project check` ends with the outcome `partial` and exit code 1 (see [08 CLI and MCP](08-cli-and-mcp.md#outcomes-and-exit-codes)). |
| Warning | A likely mistake that a person may accept |
| Information | Something worth knowing, such as a checkout that does not hold a file that git does not track |

Record files and form:

| Code | What it finds | Level | Rule owner |
| --- | --- | --- | --- |
| `merge-conflict` | Git conflict markers in a record file | Error | [09 Storage and Indexing](09-storage-and-indexing.md) |
| `parse-error` | Missing or unreadable YAML front matter | Error | [09 Storage and Indexing](09-storage-and-indexing.md) |
| `not-canonical` | A valid file that is not in the serializer's form, so the next write will reformat it | Information | [09 Storage and Indexing](09-storage-and-indexing.md) |
| `unknown-field` | A front matter field that the type does not define | Warning | [11 Record Types Reference](11-record-types-reference.md) |
| `origin-unknown-package` | v2.1: a record whose `origin` names no `package` record | Error | [20 System Packages](20-system-packages.md) |
| `origin-withdrawn` | v2.1: a record from a system package that the package's last version no longer holds, which stayed `active` because the team changed it or another record links to it | Warning | [20 System Packages](20-system-packages.md) |
| `missing-field` | A required field is missing or empty | Error | This PRD, [11 Record Types Reference](11-record-types-reference.md) |
| `bad-value` | A value of the wrong kind, or outside its allowed values | Error | This PRD, [11 Record Types Reference](11-record-types-reference.md) |
| `schema-old` | A record on an older schema version. Names `make-blueprint setup` as the command to run. | Information | [09 Storage and Indexing](09-storage-and-indexing.md) |
| `schema-newer` | A record on a newer schema version than this Make Blueprint knows | Warning | [09 Storage and Indexing](09-storage-and-indexing.md) |
| `journal-pending` | An interrupted change waits for a person's decision | Error | [09 Storage and Indexing](09-storage-and-indexing.md) |

Identity:

| Code | What it finds | Level |
| --- | --- | --- |
| `id-format` | An `id` without the `id` form, or with a prefix that does not match `type` | Error |
| `id-file-mismatch` | A file whose name is not `<id>.md`, or whose folder is not its type | Error |
| `duplicate-id` | Two files that carry the same `id` | Error |
| `ref-format` | A `ref` without the `ref` form, or with a prefix that differs from the `id` prefix | Error |
| `ref-clash` | Two or more records that hold the same current `ref`. Names `run record ref-fix` with that `ref`. | Error |
| `alias-format` | A malformed alias, an alias repeated in one record, or an alias equal to the record's own `ref` | Warning |

Status:

| Code | What it finds | Level |
| --- | --- | --- |
| `superseded-target` | `superseded_by` on a record that is not `superseded`, or naming a missing record, a record of another type, or a loop | Error |
| `superseded-no-target` | A `superseded` record with no `superseded_by`, such as an older v1 row | Warning |

Relations:

| Code | What it finds | Level | Rule owner |
| --- | --- | --- | --- |
| `broken-link` | A relation field names an `id` that no record has | Error | This PRD |
| `link-not-id` | A relation field holds a `ref` or alias. The finding names the `id` it resolves to. | Error | This PRD |
| `link-type` | A relation target has a type that the field does not allow | Error | This PRD, [11 Record Types Reference](11-record-types-reference.md) |
| `link-cardinality` | A list where one value belongs, or a repeated `id` | Error | This PRD, [11 Record Types Reference](11-record-types-reference.md) |
| `self-link` | A record that links to itself | Error | This PRD |
| `tree-loop` | A tree field, such as a capability's `parent`, that loops | Error | This PRD |
| `inactive-link` | A current record that links to a `rejected` or `archived` record | Warning | This PRD |
| `superseded-link` | A current record that links to a `superseded` record. Names the replacement. | Warning | This PRD |
| `type-rule` | A type-specific rule fails, such as a fit-gap whose covering capability is not in the target system | Error or warning, as the owner sets | [11 Record Types Reference](11-record-types-reference.md), [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |

Facets:

| Code | What it finds | Level |
| --- | --- | --- |
| `facet-unknown` | A facet name that the project config does not define | Error |
| `facet-value` | A code that its facet does not list, or a repeated code | Error |

Evidence:

| Code | What it finds | Level | Rule owner |
| --- | --- | --- | --- |
| `evidence-malformed` | A link in the `malformed` state | Error | This PRD |
| `evidence-unknown-source` | A link in the `unknown-source` state | Error | This PRD |
| `evidence-unavailable` | A link in the `unavailable` state | Information | This PRD, [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `evidence-no-anchor` | A link in the `no-anchor` state | Warning | This PRD |
| `evidence-not-converted` | A link in the `not-converted` state | Error | This PRD |
| `evidence-broken` | A link in the `broken` state | Error | This PRD, [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `evidence-old-version` | A link in the `old-version` state | Warning | This PRD, [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `evidence-unconfirmed` | A link in the `unconfirmed` state | Warning | This PRD |
| `evidence-required` | A fit-gap with no evidence link, or a current record that an extraction created or updated with no link to that extraction's source | Error | This PRD |

Sources and extraction:

| Code | What it finds | Level | Rule owner |
| --- | --- | --- | --- |
| `source-changed` | An original whose hash differs from its source record's `sha256` ("changed since conversion") | Warning | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `source-file-missing` | A source whose original git tracks, at the git level `all`, and whose original file is absent | Error | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `source-not-here` | A file that the source's git level keeps out of git is not on this machine: the original at the level `converted` or `none`, or the converted text at the level `none`. The source shows as missing. | Information | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `source-no-lfs` | A large original that git tracks and that no Git LFS rule covers. It names the file and how to track it. | Warning | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `source-lfs-not-fetched` | An original that is a Git LFS pointer file whose content was not fetched. The source is not reported as changed. | Information | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `source-unregistered` | A file in `blueprint/sources/` that no source record names, other than the router files (`AGENTS.md`, `CLAUDE.md`), converted text, table CSV files, files that converted text links to, such as the images that v1 converted text keeps beside it, and the managed `.gitignore` and `.gitattributes` files. The next action is `run source add`. | Information | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `converted-missing` | A source whose converted text git tracks, at the git level `all` or `converted`, and whose `converted_path` names a file that is absent | Error | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `converted-mismatch` | Converted text whose front matter disagrees with its source record | Error | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `converter-old` | A source converted with an older version of a built-in converter, with the command to convert it again. Text with the converter `agent` or `v1` never gets this code. | Information | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `extraction-status-mismatch` | A source whose `extraction_status` disagrees with its latest extraction record | Warning | [13 Extraction and Review](13-extraction-and-review.md) |
| `extraction-open-twice` | A source with more than one open extraction, as can happen when two branches each open one | Warning | [13 Extraction and Review](13-extraction-and-review.md) |

Make Docs links:

| Code | What it finds | Level | Rule owner |
| --- | --- | --- | --- |
| `make-docs-link` | A work item ID or doc path that the Make Docs read command cannot resolve. Reported only after `project check` uses the read command that Make Docs 2.1.0 ships, and only when `make-docs` is installed. | Error | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| `make-docs-skipped` | Make Docs links were not checked, because `project check` does not yet use the read command that Make Docs 2.1.0 ships for work item IDs and doc paths, or because `make-docs` is not installed. Says how many links it skipped. | Information | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |

People and roles (see [People and Role Slugs](#people-and-role-slugs)):

| Code | What it finds | Level | Rule owner |
| --- | --- | --- | --- |
| `slug-unknown` | A slug in `owners`, `stakeholders` or `audience`, or an `active` persona record's `slug`, that `.make/personas.yaml` does not hold | Error | This PRD, [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| `slug-primitive` | A slug whose entry has the wrong primitive: a `user` entry in `owners` or `stakeholders`, or a `maintainer` entry in `audience` or a persona record's `slug` | Error | This PRD, [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| `slug-repeated` | A slug in both `owners` and `stakeholders` on one record, a slug repeated within one list, or one slug in the `slug` of two current persona records | Error | This PRD |
| `audience-inactive-persona` | An `active` record's `audience` names a slug that no `active` persona record claims, and whose persona record is `archived` or `superseded`. Names that persona record and, when there is one, its replacement. | Warning | This PRD |
| `name-not-slug` | `extracted_by` or `reviewer` on an extraction record holds free text, not a `maintainer` slug | Information | This PRD, [13 Extraction and Review](13-extraction-and-review.md) |

Fit-gap marks:

| Code | What it finds | Level | Rule owner |
| --- | --- | --- | --- |
| `marks-out-of-date` | A fit-gap record whose `requirement_marks` no longer match its baseline capability's current requirements: an `active` requirement with no mark, a mark for a requirement that is no longer `active` or no longer belongs to the capability, or a mark whose `version` differs from the current content version of the requirement or capability it marked (see [09 Storage and Indexing](09-storage-and-indexing.md#storage-interface)). A change to tags, facets, `owners` or any other field outside the content version never flags a record. Names `run compare next`, which hands the capability out again. On an `active` fit-gap record, the fix goes through a pending change (see [Statuses](#statuses)). | Warning | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| `mark-capability-uncovered` | A mark names a target capability in `capabilities` that is not in the record's `covering_capabilities`, so target-only generation would treat that capability as unused. On an `active` fit-gap record, the fix goes through a pending change. | Error | [11 Record Types Reference](11-record-types-reference.md), [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |

Requirements:

- `project check` never changes a file. Fixes come from other commands, such as `run record ref-fix`, `run source convert`, `run compare next` and `setup`.
- It reports every problem it finds in one run and does not stop at the first.
- It works with no network connection.
- Make Docs 2.1.0 ships the read command that confirms work item IDs and doc paths ([root Q-020](../../../../docs/prd/03-open-questions-and-risk-register.md#q-020-release-of-the-link-read-command)). Until `project check` uses that command, it skips every Make Docs link on every record and reports `make-docs-skipped` once, with the number of links it skipped. This skip is a temporary workaround, tracked as obligation [O-001](03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check), and it is not the intended lasting behavior. After `project check` starts to use the command, it confirms each link through the command when `make-docs` is installed, reports `make-docs-link` for a link it cannot resolve, and reports `make-docs-skipped` with the count only when `make-docs` is not installed (see [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md)).
- Each problem names the record by `ref` and title, its `id` and file path, the field when there is one, the problem in plain words, and the next useful action.
- Machine output carries, for each problem, the code, the level, the record `id` and `ref`, the file path, the field and the next action.
- A stage PRD that adds a check rule adds it under `type-rule` or a code listed here, so this catalog stays complete.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 8: hand edits and `check`; section 9: identity; section 10: facets and evidence links; section 12: Make Docs links; section 16: Q-018 to Q-024, Q-028, Q-032, Q-061, Q-066, Q-068, Q-070, Q-072, Q-076, Q-077, Q-079)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md` (Scope)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/04-record-types.md` (Scope)
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/02-records-and-storage.md` (Field and Setting Names)
- `.make/blueprint/`
- `.make/personas.yaml`
- `blueprint/records/<type>/<id>.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/entity-records-contract.md`

## Integrations

| Party | What this PRD gives it, or needs from it | Owner |
| --- | --- | --- |
| Storage and indexing | `id` and `ref` minting inside `create`, the write lock for minting, the journal for `run record ref-fix`, the record version that write checks use, the content version that marks keep, and the index that `project check` and name lookup read | [09 Storage and Indexing](09-storage-and-indexing.md) |
| Record types | Type prefixes, type fields, relation targets, cardinality and type rules | [11 Record Types Reference](11-record-types-reference.md) |
| CLI and MCP | The `project check` and `run record ref-fix` commands, `run record confirm-evidence`, output formats, and the `status` counts of clashes and flagged links | [08 CLI and MCP](08-cli-and-mcp.md) |
| Source intake | Anchors, table CSV files, source hashes, converter versions, git levels, link resolution and the missing state of files kept out of git | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| Extraction and review | Draft creation, the `draft` to `active` and `rejected` changes, pending changes and their review, the second reviewer and duplicate hints | [13 Extraction and Review](13-extraction-and-review.md) |
| Fit-gap and placement | Merges that supersede records, required fit-gap evidence, requirement marks, `run compare next`, and the analysis rules reported as `type-rule` | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| Make Docs | Work item IDs and doc paths on any record. `project check` skips them, and says how many, until it uses the read command that Make Docs 2.1.0 ships (obligation O-001); then it confirms them through that command when `make-docs` is installed. | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| Shared core | `.make/personas.yaml`, which the slugs in `owners`, `stakeholders`, `audience`, a persona record's `slug`, and an extraction record's `extracted_by` and `reviewer` are checked against | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| v1 import | v1 IDs that become refs and aliases, ref clashes among imported rows, links with no anchor, and superseded rows with no successor | [17 v1 Import](17-v1-import.md) |
| Exports | Facet values and evidence links as export columns | [15 Exports](15-exports.md) |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, sections 9, 10 and 12)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/04-record-types.md`

## Rebuild Notes

- **Never link by `ref`.** A `ref` can change. Links, file names and evidence use `id`. It is easy to store whatever name a person typed. Always resolve it to an `id` first.
- **Keep `id` and `ref` apart by shape.** An `id` code always has a letter, and a `ref` number never does. Without that rule, a random code such as `48213` reads as a `ref`.
- **Lowercase codes.** Case-insensitive file systems on macOS and Windows treat `REQ-7kQ2m7k2.md` and `REQ-7kq2m7k2.md` as one file.
- **Long enough codes.** A 5-character code gives about 60 million codes per type, so a project with 10,000 records of one type would more likely than not hold two branches' mints with the same `id`. Eight characters make such a clash not expected.
- **Mint past aliases.** Minting from current refs only would hand out a number that an alias still holds, so two records would answer to it.
- **One rule for the keeper.** A ref fix that picks the keeper by chance, by file order or by a person's choice makes two people's fixes differ and creates a new clash on the next merge.
- **Fix facts in place.** Fixing a fact by superseding the record with a new one changes the `id`, breaks links and spreads one change over two files. A pending change on the same record keeps the one-file diff.
- **No silent confirm.** Rewriting `evidence_versions` on every save would hide a changed source. Only an explicit confirm moves a link to the current version.
- **`project check` only reads.** A check that fixes things quietly makes hand edits and merges impossible to review. Fix commands make their changes as normal diffs.
- **Transitions live in commands.** A hand edit can set any status. Do not try to infer the earlier status from git history in `project check`.
- **Superseded links.** v1 kept a `redirect` object on superseded rows. Here `superseded_by` names the successor, and older rows without one import with a warning.
- **Facets are not tags.** Tags are free text. Facets come from the project config and are checked.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Consequences: two IDs, hand edits)
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/entity-records-contract.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/entity-consolidation-contract.md`

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/04-record-types.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/02-records-and-storage.md`
- `docs/plans/2026-11-01-w1-r2-shared-rules-links/00-overview.md`
- `docs/prd/01-product-overview.md`
- `docs/prd/02-architecture-overview.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/entity-records-contract.md`
