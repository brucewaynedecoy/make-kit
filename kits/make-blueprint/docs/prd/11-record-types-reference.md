---
title: "11 Record Types Reference"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 11 Record Types Reference

## Purpose

This reference lists every Make Blueprint record type: its `id` prefix, its folder, its purpose, every field with whether it is required, the allowed values, and the relations it stores with their cardinality. It covers the 12 v2.0 types and marks the four v2.3 types as later.

It stays separate from the subsystem PRDs so that people and agents can look up one field fast. The rules shared by every type, such as common fields, statuses, `id` and `ref`, facets, evidence links and relation rules, live in [10 Records and Identity](10-records-and-identity.md). How each type is used lives in the stage PRDs that this reference links to.

## Reference

### Type Summary

| Type value | Prefix | Folder | Purpose | Release | Stage owner |
| --- | --- | --- | --- | --- | --- |
| `source` | `SRC` | `blueprint/records/source/` | One original file | v2.0 | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| `system` | `SYS` | `blueprint/records/system/` | One system in scope, such as a current client system or a target product | v2.0 | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| `domain` | `DOM` | `blueprint/records/domain/` | One entry in the project's shared domain list | v2.0 | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| `capability` | `CAP` | `blueprint/records/capability/` | One capability of one system | v2.0 | [13 Extraction and Review](13-extraction-and-review.md), [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| `requirement` | `REQ` | `blueprint/records/requirement/` | One requirement of one capability | v2.0 | [13 Extraction and Review](13-extraction-and-review.md) |
| `persona` | `PER` | `blueprint/records/persona/` | A role in a client's systems that uses one or more systems | v2.0 | [13 Extraction and Review](13-extraction-and-review.md) |
| `finding` | `FIND` | `blueprint/records/finding/` | An observation, gap, risk or question found in sources or analysis | v2.0 | [13 Extraction and Review](13-extraction-and-review.md) |
| `extraction` | `EXT` | `blueprint/records/extraction/` | One pass over one source | v2.0 | [13 Extraction and Review](13-extraction-and-review.md) |
| `comparison` | `CMP` | `blueprint/records/comparison/` | One target system compared with one or more baseline systems | v2.0 | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| `fit-gap` | `FIT` | `blueprint/records/fit-gap/` | One baseline capability scored against the target system | v2.0 | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| `placement` | `PLC` | `blueprint/records/placement/` | Which system owns a capability and how it is delivered | v2.0 | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| `integration` | `INT` | `blueprint/records/integration/` | One flow of data or events from one system to another, in one direction | v2.0 | [19 System Integrations](19-system-integrations.md) |
| `package` | `PKG` | `blueprint/records/package/` | One system package that the project took in | v2.1 | [20 System Packages](20-system-packages.md) |
| `test-case` | `TC` | `blueprint/records/test-case/` | A test that checks requirements or capabilities | v2.3, later | Not yet assigned |
| `run` | `RUN` | `blueprint/records/run/` | One run of tests or of a playbook | v2.3, later | Not yet assigned |
| `result` | `RES` | `blueprint/records/result/` | The outcome of one test case in one run | v2.3, later | Not yet assigned |
| `playbook` | `PB` | `blueprint/records/playbook/` | A reusable procedure | v2.3, later | Not yet assigned |

Each record file is `<folder><id>.md`, such as `blueprint/records/fit-gap/FIT-6pq2z7k2.md` (see [09 Storage and Indexing](09-storage-and-indexing.md)). There are no custom record types in v2.0. A project extends records with facets (see [10 Records and Identity](10-records-and-identity.md)).

### How to Read the Field Tables

| Need | Meaning |
| --- | --- |
| Required | Every record of the type has the field. |
| Required when active | A `draft` may leave the field out. An `active` record has it. |
| Conditional | Whether the field is present depends on another field. The rule says how. |
| Optional | The field may be left out. The CLI leaves out optional fields that have no value. |

A value written as `SYS id` means the `id` of one record of that type. A value written as `list of CAP id` means a list of such `id` values. Every relation field stores `id` values, never refs (see [10 Records and Identity](10-records-and-identity.md)).

A value written as `user` slug or `maintainer` slug means the slug of an entry with that primitive in the shared people and roles file, `.make/personas.yaml`. Slug fields are not relation fields. [10 Records and Identity](10-records-and-identity.md#people-and-role-slugs) owns their rules and checks.

A list the project can extend is a built-in list of codes that a project may add its own codes to. Codes use lowercase letters, digits, hyphens and underscores. [Lists the Project Can Extend](#lists-the-project-can-extend) names each such list, its built-in codes and its setting.

### Lists the Project Can Extend

Three fields take one code from a list the project can extend. Make Blueprint ships the built-in codes below. A project adds its own codes, such as a domain word like a pricing class, in the matching `lists.*` setting in `.make/blueprint/config.yaml` (see [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md#project-config)).

| Field | Built-in codes | Setting for the project's own codes |
| --- | --- | --- |
| Capability `capability_type` | `capability`, `configuration`, `process`, `workflow`, `integration`, `report`, `data_entity`, `state_model`, `document`, `architecture` | `lists.capability_type` |
| Requirement `option_scope` | `global`, `location`, `role`, `account`, `agreement`, `transaction`, `rule`, `multi` | `lists.option_scope` |
| Integration `method` | `api`, `file`, `event`, `isv`, `manual` | `lists.integration_method` |

Requirements:

- A field's allowed codes are its built-in codes and the codes that its setting lists.
- A write refuses any other code, and `project check` reports a stored record with one as `bad-value` (see [10 Records and Identity](10-records-and-identity.md#check-catalog)). So a write can tell a project's own code from a typo.
- When a setting drops a code that records still use, `project check` reports each of those records as `bad-value`.

### Common Fields and Field Order

Every type has the common fields that [10 Records and Identity](10-records-and-identity.md) defines. The serializer writes fields in this order:

1. `id`, `ref`, `type`, `title`, `status`, `summary`
2. The type's own fields, in the order of its table below
3. `evidence`, `evidence_versions`, `facets`, `related`, `work_items`, `docs`, `superseded_by`, `aliases`, `owners`, `stakeholders`, `tags`, `origin` (v2.1)
4. `schema_version`, `created_at`, `updated_at`
5. Any field that Make Blueprint does not know, in the order found

Unless a type section says otherwise, `evidence` is optional, and a record that an extraction created or updated carries at least one link to that extraction's source.

Every type can carry the Make Docs link fields `work_items` and `docs` and the people fields `owners` and `stakeholders`. `docs` can name any Make Docs doc, such as a design, plan, PRD, work item or guide. [10 Records and Identity](10-records-and-identity.md) defines these fields, and [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) owns the format and check of Make Docs links.

No field holds a review decision's reason. When `run review reject` makes a record `rejected`, the CLI appends the reason to the end of the record body (see [13 Extraction and Review](13-extraction-and-review.md#review)).

Every type starts at `schema_version` 1 in v2.0.

### Source

One original file, such as a document, workbook, slide deck, pdf, csv or text file. A source record states that a file exists. It makes no claim about a system, so it is `active` from the start (see [12 Source Intake and Conversion](12-source-intake-and-conversion.md)). It stays `active` through an agent conversion too: the review of agent text shows in `conversion_status`, not in the record's status.

| Field | Need | Value | Rules |
| --- | --- | --- | --- |
| `git_level` | Optional | `all`, `converted` or `none` | Overrides the project's `sources.git_level` setting for this source. `all`: git tracks the original and the converted text. `converted`: git tracks the converted text only. `none`: git tracks neither. Left out, the source follows the project setting. [12 Source Intake and Conversion](12-source-intake-and-conversion.md) owns what each level does. |
| `path` | Required | Project-relative path with forward slashes, under `blueprint/sources/` | The path of the original, at every git level. A file that the git level keeps out of git stays at this normal path, listed in the managed `blueprint/sources/.gitignore`. Never an absolute path. |
| `sha256` | Required | 64 lowercase hexadecimal characters | SHA-256 of the original's bytes when it was last registered or converted |
| `converted_path` | Conditional | Project-relative path | Present when `conversion_status` is `converted`, `agent-in-progress` or `awaiting-review`. It names the main converted Markdown file, which sits next to the original as `<original file name>.md`. Each table that conversion writes as a CSV file sits beside it, as `<original file name>.t-001.csv` for the table `t-001` (see [12 Source Intake and Conversion](12-source-intake-and-conversion.md)). |
| `converter` | Conditional | `docx`, `xlsx`, `pptx`, `pdf`, `csv`, `md`, `txt`, `manual`, `agent` or `v1` | Present when `conversion_status` is `converted`, `agent-in-progress` or `awaiting-review`. `manual` means an agent or person supplied the text. `agent` means an agent read the pages of a pdf through the guided agent route for complex PDFs, and the CLI checked the text and wrote its anchors (see [12 Source Intake and Conversion](12-source-intake-and-conversion.md)). `v1` means converted text that the v1 import kept from a v1 project (see [17 v1 Import](17-v1-import.md)). |
| `converter_version` | Conditional | Version text, such as `"1"` | Present when `converter` is present |
| `converter_model` | Conditional | Text | Present only when `converter` is `agent`: the name of the model that read the pages |
| `converted_at` | Conditional | UTC timestamp | Present only when `converter` is `agent`: the date and time of the agent conversion |
| `conversion_status` | Required | `converted`, `needs-manual`, `failed`, `agent-in-progress` or `awaiting-review` | `needs-manual`: no built-in converter handles the type. `failed`: the built-in converter could not read the file, and the reason is in the body. `agent-in-progress`: the agent route is under way, and page batches are out. `awaiting-review`: the agent has written every page, and the text waits for review (see [13 Extraction and Review](13-extraction-and-review.md)). Extraction waits until the status is `converted`. An `agent` conversion counts as `converted` while the original's hash matches `sha256`. A new model or a new CLI version never makes it stale. |
| `extraction_status` | Required | `not-started`, `in-progress`, `extracted` or `blocked` | Where the source stands in extraction. [13 Extraction and Review](13-extraction-and-review.md) owns the meaning of each value and when it is set. |

Relations stored here: none. Linked from: extraction `source`, and evidence links on any record. A source record carries no `evidence` of its own.

"Missing" (a file that the source's git level keeps out of git and that is not on this machine) and "changed since conversion" are worked out on each machine and never stored (see [12 Source Intake and Conversion](12-source-intake-and-conversion.md)).

This example follows the project's git level, so it leaves out `git_level`.

```yaml
---
id: SRC-4hd8x7k2
ref: SRC-007
type: source
title: billing-workshop.docx
status: active
summary: Notes from the billing process workshop.
path: blueprint/sources/workshops/billing-workshop.docx
sha256: d5fd20e081e5a152ac41c4e0111055d73171e91d42603eb49eefbb7a7cf2f876
converted_path: blueprint/sources/workshops/billing-workshop.docx.md
converter: docx
converter_version: "1"
conversion_status: converted
extraction_status: extracted
facets:
  release: [r1]
schema_version: 1
created_at: 2026-11-02T14:05:11Z
updated_at: 2026-11-03T09:12:40Z
---
```

### System

One system in scope, such as a current client system or a target product. It holds the status list that its capabilities use.

| Field | Need | Value | Rules |
| --- | --- | --- | --- |
| `name` | Required | Text | The system's own name, as sources use it |
| `vendor` | Optional | Text | The company that makes the system, when there is one |
| `capability_statuses` | Optional | Ordered list of codes | The system's own capability status list, such as `built`, `in_flight`, `designed` and `sketched` for a custom build. Codes use lowercase letters, digits, hyphens and underscores, and are unique. With no list, the system's capabilities carry no `capability_status`. |

Relations stored here: none. Linked from: capability `system`, persona `systems`, comparison `target_system` and `baseline_systems`, fit-gap `target_system`, placement `owning_system`, integration `from_system` and `to_system`.

### Domain

One entry in the project's shared domain list, such as `BIL` for billing. Domains let people group and compare capabilities across systems (see [14 Fit-Gap and Placement](14-fit-gap-and-placement.md)).

| Field | Need | Value | Rules |
| --- | --- | --- | --- |
| `code` | Required | A short code of uppercase letters and digits, such as `BIL` | Unique among current domains |
| `name` | Required | Text | The readable name, such as "Billing" |

Relations stored here: none. Linked from: capability `domain`.

### Capability

One capability of one system. Capabilities form a tree inside their system.

| Field | Need | Value | Rules |
| --- | --- | --- | --- |
| `system` | Required | `SYS id` | The system this capability belongs to |
| `parent` | Optional | `CAP id` | The parent capability, in the same system. The parent chain never loops. Left out for a top capability. |
| `domain` | Optional | `DOM id` | One current domain. A capability has at most one. |
| `capability_status` | Optional | One code | A code from the `capability_statuses` list of its `system` |
| `capability_type` | Optional | One code from the `capability_type` list in [Lists the Project Can Extend](#lists-the-project-can-extend) | What kind of capability it is, such as `workflow` or `report` |
| `triggers` | Optional | List of short text | What starts the capability, such as "an invoice arrives". One line each, unique within the list. |
| `outcomes` | Optional | List of short text | What the capability produces, such as "an approved invoice". One line each, unique within the list. |
| `entities` | Optional | List of short text | The business data the capability works on, such as "invoice" or "approval limit". One line each, unique within the list. |
| `depends_on` | Optional | List of `CAP id` | Other capabilities in the same system that this one needs. A link to a capability of another system belongs in an integration record (see [Integration](#integration)). |
| `audience` | Optional | List of `user` slugs | The user roles this capability serves, from `.make/personas.yaml`. A persona record names its slug, so `audience` can point to the roles found in sources. |

Relations stored here: `system`, `parent`, `domain`, `depends_on`. Linked from: capability `parent` and `depends_on`; requirement `capability`; fit-gap `baseline_capability`, `covering_capabilities`, and the `capability` and `capabilities` of each `requirement_marks` entry; integration `from_capabilities` and `to_capabilities`; extraction `records`. `audience` holds slugs, not relations.

```yaml
---
id: CAP-9xw3p7k2
ref: CAP-118
type: capability
title: Invoice approval limits
status: active
summary: Invoices above a set amount need approval before posting.
system: SYS-8ce4r7k2
parent: CAP-2hs6v7k2
domain: DOM-5bl1t7k2
capability_status: built
evidence:
  - SRC-4hd8x7k2#h-004
  - SRC-4hd8x7k2#p-012
evidence_versions:
  SRC-4hd8x7k2:
    sha256: d5fd20e081e5a152ac41c4e0111055d73171e91d42603eb49eefbb7a7cf2f876
    converter: docx
    converter_version: "1"
schema_version: 1
created_at: 2026-11-03T10:20:00Z
updated_at: 2026-11-04T08:45:31Z
---
```

### Requirement

One requirement of one capability, in its own system's terms. Requirements do not link across systems.

| Field | Need | Value | Rules |
| --- | --- | --- | --- |
| `capability` | Required | `CAP id` | The capability this requirement belongs to |
| `kind` | Required | `setting`, `rule`, `behavior`, `data` or `dependency` | `setting`: an option that people set. `rule`: a business rule or limit. `behavior`: something the system does. `data`: data the system holds or exchanges. `dependency`: something the capability needs from another system or party. |
| `option_values` | Optional | List of text | Only when `kind` is `setting`: the values a person can choose, in stored order |
| `option_default` | Optional | Text | Only when `kind` is `setting`: the value that applies when nobody sets one |
| `option_scope` | Optional | One code from the `option_scope` list in [Lists the Project Can Extend](#lists-the-project-can-extend) | Only when `kind` is `setting`: the level at which the setting applies, such as `global` for the whole system or `role` for each role |
| `audience` | Optional | List of `user` slugs | The user roles this requirement serves, from `.make/personas.yaml` |

A requirement of another kind never carries `option_values`, `option_default` or `option_scope`. A write refuses them, and `project check` reports them as `type-rule`.

Relations stored here: `capability`. Linked from: extraction `records`, finding `implications`, the `requirement` of each fit-gap `requirement_marks` entry, any `related`. `audience` holds slugs, not relations.

### Persona

A role in a client's systems that uses one or more systems. A persona record is related to a Make Docs Persona, not separate from it. A Make Docs Persona is an audience role that a project writes docs for (see [01 Product Overview](01-product-overview.md)), and a client role found in sources can be such an audience too. "Persona record" means this Make Blueprint type, and "Persona" means the Make Docs role.

Each persona record names its entry in the shared people and roles file, `.make/personas.yaml`, by `slug`. That entry is a `user` entry, so capability and requirement `audience` lists can point to the role. When review approves a persona record, the shared core adds its entry to `.make/personas.yaml` if the file does not already hold that slug (see [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) and [13 Extraction and Review](13-extraction-and-review.md)). When the file already holds the slug as an unclaimed `user` entry, the record claims that entry instead. The entry stays when the persona record is later archived or superseded, so every `audience` list that names the slug still resolves. A rejected persona record never has an entry, because the core adds entries only at approval. Make Blueprint never writes the file itself. [10 Records and Identity](10-records-and-identity.md#people-and-role-slugs) owns the rules for claiming an entry and their checks.

| Field | Need | Value | Rules |
| --- | --- | --- | --- |
| `systems` | Required when active | List of `SYS id`, one or more | The systems this role uses |
| `slug` | Required when active | One `user` slug | The persona's slug in `.make/personas.yaml`, in the slug form that file uses. Unique among current persona records. A `draft` may name a slug that the file does not hold yet. Review refuses to approve a record whose slug names a `maintainer` entry or an entry that another persona record claims. |

Relations stored here: `systems`. Linked from: extraction `records`, finding `implications`, any `related`. Capability and requirement `audience` lists name its `slug`, not its `id`.

### Finding

An observation, gap, risk or question found in sources or in analysis.

| Field | Need | Value | Rules |
| --- | --- | --- | --- |
| `kind` | Required | `gap`, `risk`, `question` or `observation` | What sort of finding it is |
| `implications` | Optional | List of `id` of any type | The records this finding affects |

Relations stored here: `implications`. Linked from: extraction `records`, any `related`.

### Extraction

One pass over one source. It records what was covered in each part of the source and what came out of it. [13 Extraction and Review](13-extraction-and-review.md) owns how a pass runs and when each value is set. [12 Source Intake and Conversion](12-source-intake-and-conversion.md) owns what a part is.

| Field | Need | Value | Rules |
| --- | --- | --- | --- |
| `source` | Required | `SRC id` | The source this pass covers |
| `source_sha256` | Required | 64 lowercase hexadecimal characters | The source's `sha256` when the extraction opened |
| `extracted_by` | Required | A `maintainer` slug, or free text | The person or agent who runs the extraction: their `maintainer` slug from `.make/personas.yaml` when they have one, else free text, such as a name or handle. `project check` reports free text as information (see [10 Records and Identity](10-records-and-identity.md#people-and-role-slugs)). With the second reviewer on, the reviewer of its drafts must have another name. |
| `parts` | Required | List of part entries, below | One entry for each part listed in the converted text, in reading order |
| `outcome` | Required | `open`, `records`, `no-records` or `blocked` | `open` while the extraction runs. On finish, `records` when it produced records, `no-records` when it held nothing to extract, or `blocked` when it could not be worked. |
| `records` | Optional | List of record entries, below | One entry for each record the extraction created or updated |
| `reviewer` | Optional | A `maintainer` slug, or free text | The reviewer of the last decision that completed the extraction's review: their `maintainer` slug when they have one, else free text. `project check` reports free text as information. |
| `reviewed_at` | Optional | UTC timestamp | When that decision was made |

Each part entry:

| Key | Need | Value | Rules |
| --- | --- | --- | --- |
| `label` | Required | Text | The part's label from the converted text, such as a sheet name or slide number |
| `anchor` | Required | An anchor, such as `h-003` | The anchor that starts the part, as the converted text lists it |
| `coverage` | Required to finish | `none`, `partial` or `full` | How much of the part was read |
| `outcome` | Required to finish | `records`, `no-records` or `blocked` | What the part produced. A part with coverage `none` can only be `blocked`. |
| `note` | Conditional | Text | Needed when coverage is `partial` or the outcome is `no-records` or `blocked` |

Each record entry:

| Key | Need | Value | Rules |
| --- | --- | --- | --- |
| `id` | Required | `id` of a `system`, `domain`, `capability`, `requirement`, `persona`, `finding` or `integration` record | The record the extraction touched |
| `action` | Required | `created` or `updated` | `created` for a draft made in the extraction. `updated` for an existing record that gained evidence from it. |

[13 Extraction and Review](13-extraction-and-review.md) owns the rules for coverage, outcomes, finishing and review. An extraction is `draft` while it is open and while its drafts wait for review, and `active` once its review completes.

Relations stored here: `source`, and the `id` in each `records` entry. Linked from: none. An extraction record carries no `evidence`; its `source` field ties it to its source.

### Comparison

One target system compared with one or more baseline systems. A project can hold more than one comparison.

| Field | Need | Value | Rules |
| --- | --- | --- | --- |
| `target_system` | Required | `SYS id` | The one target system |
| `baseline_systems` | Required | List of `SYS id`, one or more | The baseline systems. The target is not one of them. Their order sets the order of baseline systems in exports. |

Relations stored here: `target_system`, `baseline_systems`. Linked from: fit-gap `comparison`.

### Fit-Gap

One baseline capability in one comparison, scored against the whole target system. A `target-only` record instead marks one target capability that no other fit-gap record in the comparison uses. [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) owns the meaning of each value and the analysis check rules, which `project check` reports as `type-rule`.

| Field | Need | Value | Rules |
| --- | --- | --- | --- |
| `comparison` | Required | `CMP id` | The comparison this record belongs to |
| `baseline_capability` | Conditional | `CAP id` | Present unless `verdict` is `target-only`. A capability of one of the comparison's baseline systems. One current fit-gap record per baseline capability in a comparison. |
| `target_system` | Required | `SYS id` | The same system as the comparison's `target_system` |
| `covering_capabilities` | Conditional | List of `CAP id` | Capabilities of the target system. One or more for `native`, `configurable`, `partial` and `unreleased`. None for `gap`. Exactly one for `target-only`. Every capability that a mark names in `capabilities` is also in this list, so target-only generation never treats it as unused. |
| `verdict` | Required | `native`, `configurable`, `partial`, `unreleased`, `gap` or `target-only` | See [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| `confidence` | Required | `high`, `medium` or `low` | How strongly the evidence supports the verdict |
| `effort` | Required | `none`, `low`, `medium`, `high` or `unknown` | The work needed to deliver the baseline outcome with the target |
| `gap_detail` | Conditional | Text | What is missing or different in the target. Required, and not empty, for `partial`, `unreleased` and `gap`. The compare commands refuse a draft without it, and `project check` reports a stored record without it as an error (see [14 Fit-Gap and Placement](14-fit-gap-and-placement.md#analysis-check-rules)). Optional for other verdicts. |
| `migration_note` | Optional | Text | What the move means for data, process or people |
| `requirement_marks` | Conditional | List of mark entries, below | Required for every verdict except `target-only`, and left out for `target-only`. One mark for each `active` requirement of the baseline capability. When the baseline capability has no `active` requirement, exactly one mark for the capability as a whole. The marks back the verdict; the record stays one per baseline capability. |

Each mark entry answers one question about one baseline requirement, or about a baseline capability that has no requirements: does the target meet this? [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) owns the meaning of each value and the table that gives the verdict from the marks.

| Key | Need | Value | Rules |
| --- | --- | --- | --- |
| `requirement` | Conditional | `REQ id` | The baseline requirement this mark is about: an `active` requirement of the record's `baseline_capability`. Present on every mark except the one mark for a capability with no `active` requirement. A requirement has at most one mark in a record. |
| `capability` | Conditional | `CAP id` | Present only on the one mark for a baseline capability with no `active` requirement, in place of `requirement`. The record's `baseline_capability`. |
| `version` | Required | A content version, 64 lowercase hexadecimal characters | The content version of the requirement, or of the capability, when it was marked (see [09 Storage and Indexing](09-storage-and-indexing.md#storage-interface)). The content version is a hash of the fields that carry the marked record's meaning, so a new tag, facet code or owner never changes it. `project check` flags the record when the meaning of the marked record has changed since. |
| `mark` | Required | `met`, `configured`, `unreleased`, `partly` or `not-met` | `met`: met as shipped. `configured`: met through settings or setup data. `unreleased`: met only in a version that is not generally available yet. `partly`: met in part. `not-met`: not met. |
| `capabilities` | Optional | List of `CAP id` | The target capabilities that meet it, from the target system. Never requirement `id` values: a write refuses a mark that cites a requirement. Each one is also in the record's `covering_capabilities`. The compare commands refuse a draft that breaks this, and `project check` reports a stored record that breaks it as `mark-capability-uncovered` (see [10 Records and Identity](10-records-and-identity.md#check-catalog)). |
| `evidence` | Optional | List of evidence links | Links into source text that support the mark. They follow the evidence link rules in [10 Records and Identity](10-records-and-identity.md), and the record's `evidence_versions` covers their sources. |
| `note` | Conditional | Text | Required for `not-met`: where the agent looked, because the absence of a fit cannot be linked. Optional for other marks. |

A mark other than `not-met` has at least one target capability in `capabilities` or one link in `evidence`. Requirements are never matched across systems, so no mark names a target requirement.

`evidence` is required on every fit-gap record: at least one link.

Relations stored here: `comparison`, `baseline_capability`, `target_system`, `covering_capabilities`, and the `requirement`, `capability` and `capabilities` of each `requirement_marks` entry. Linked from: placement `fit_gap`.

In this example, the baseline capability has three active requirements. The target meets one in part, meets one and does not meet one, so the verdict is `partial`.

```yaml
---
id: FIT-6pq2z7k2
ref: FIT-031
type: fit-gap
title: Invoice approval limits
status: active
summary: The target approves invoices by amount, but not for each legal entity.
comparison: CMP-3nv6h7k2
baseline_capability: CAP-9xw3p7k2
target_system: SYS-2mk7q7k2
covering_capabilities:
  - CAP-4rd7m7k2
verdict: partial
confidence: medium
effort: medium
gap_detail: Approval limits are set for each company, not for each legal entity.
migration_note: Each legal entity limit maps to a company-level rule before cutover.
requirement_marks:
  - requirement: REQ-7kq2m7k2
    version: 3ee1c47748122f7fa126db286e7cc92d6ee037f084c79c64099a9afa31f107dc
    mark: partly
    capabilities:
      - CAP-4rd7m7k2
    evidence:
      - SRC-7tc3j7k2#r-0041
  - requirement: REQ-5hw2c8nd
    version: 0a2b3bb6f53cc3162344c2367d93a2149aeb75ecfd399899a960ec7933919373
    mark: met
    capabilities:
      - CAP-4rd7m7k2
  - requirement: REQ-9tg4b1vq
    version: 66eb34438a96b99e528939b2d6f7b66e0182b0db2d1b3ab618b2e13de9bf0ea7
    mark: not-met
    note: Searched the target's approval and reporting guides. No report groups approvals by legal entity.
evidence:
  - SRC-4hd8x7k2#p-012
  - SRC-7tc3j7k2#r-0041
evidence_versions:
  SRC-4hd8x7k2:
    sha256: d5fd20e081e5a152ac41c4e0111055d73171e91d42603eb49eefbb7a7cf2f876
    converter: docx
    converter_version: "1"
  SRC-7tc3j7k2:
    sha256: 0b9e4c2a7d1f8e6b3c5a9d0f2e4b6c8a1d3f5e7b9c0a2e4d6f8b1c3e5a7d9f0b
    converter: pdf
    converter_version: "1"
facets:
  release: [r2]
schema_version: 1
created_at: 2026-11-10T15:02:44Z
updated_at: 2026-11-11T09:30:12Z
---
```

### Placement

Which system owns a capability in the planned state, and how it is delivered. Like every record, it can link to the Make Docs work items and docs it leads to, through the common `work_items` and `docs` fields. Make Docs owns those work items (see [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md)).

| Field | Need | Value | Rules |
| --- | --- | --- | --- |
| `fit_gap` | Required | `FIT id` | The one fit-gap record this placement belongs to. A fit-gap record has at most one current placement. |
| `owning_system` | Required | `SYS id` | A current system record that owns the capability |
| `delivery` | Required | `configure`, `extend`, `build` or `integrate` | How the capability is delivered, applied to the owning system |
| `integrations` | Conditional | List of `INT id` | Only for `delivery: integrate`: the integration records that deliver the capability. An `active` placement with `integrate` lists one or more. A `draft` may leave it out. Left out for every other delivery value. |

A placement names its other systems through its integration records, which hold both ends of each flow. It has no separate list of partner systems.

Relations stored here: `fit_gap`, `owning_system`, `integrations`. Linked from: none.

```yaml
---
id: PLC-1ty8k7k2
ref: PLC-014
type: placement
title: Extend target approvals to legal entities
status: active
summary: The target owns approval limits, extended to hold a limit for each legal entity.
fit_gap: FIT-6pq2z7k2
owning_system: SYS-2mk7q7k2
delivery: extend
work_items:
  - W2 R0 P3
docs:
  - docs/designs/2026-12-01-approval-limits.md
schema_version: 1
created_at: 2026-11-12T11:00:05Z
updated_at: 2026-11-14T16:41:27Z
---
```

### Integration

One flow of data or events from one system to another, in one direction, such as "the billing system sends approved invoices to the general ledger each night". A two-way exchange is two records, each with its own method and timing, so an integration has no direction field. [19 System Integrations](19-system-integrations.md) owns how integration records are created and used: current integrations from extraction, planned integrations from analysis, and their part in comparisons, placements and the Make Docs hand-off.

| Field | Need | Value | Rules |
| --- | --- | --- | --- |
| `from_system` | Required | `SYS id` | The system the data or event leaves |
| `to_system` | Required | `SYS id` | The system it arrives in. Never the same as `from_system`. |
| `from_capabilities` | Optional | List of `CAP id` | Capabilities of `from_system` that send it |
| `to_capabilities` | Optional | List of `CAP id` | Capabilities of `to_system` that receive it. With `from_capabilities`, this is the link across systems that a capability's `depends_on` cannot hold. |
| `payload` | Required when active | Short text | The data or event that moves, such as "approved invoices" |
| `trigger` | Required when active | `on-change`, `schedule` or `on-request` | What starts each run. `on-change`: a change to the data. `schedule`: set times. `on-request`: a person or system asks for it. |
| `frequency` | Optional | Short text | How often it runs, such as "nightly" or "within a minute of a change" |
| `method` | Required when active | `api`, `file`, `event`, `isv` or `manual`, a list the project can extend (see [Lists the Project Can Extend](#lists-the-project-can-extend)) | How it moves. `api`: calls to an interface. `file`: a file transfer. `event`: event messages. `isv`: a product from an independent software vendor (a third party) that connects the systems. `manual`: a person moves it. |
| `state` | Required | `current` or `planned` | `current`: the flow runs today. `planned`: the flow is part of the planned state. |
| `replaces` | Optional | List of `INT id` | Only on a `planned` integration: the `current` integrations it takes over |
| `effort` | Optional | `none`, `low`, `medium`, `high` or `unknown` | Only on a `planned` integration: the work needed to build it, on the same list as fit-gap `effort` (see [14 Fit-Gap and Placement](14-fit-gap-and-placement.md)) |

A `current` integration that an extraction created carries evidence from that extraction's source, as for every record. Integration records also carry the common fields, such as `owners`, `stakeholders`, `docs` and `work_items`, so an integration can link to the Make Docs design, plan or work item that builds it.

Relations stored here: `from_system`, `to_system`, `from_capabilities`, `to_capabilities`, `replaces`. Linked from: placement `integrations`, integration `replaces`, extraction `records`, finding `implications`, any `related`.

```yaml
---
id: INT-3qx8m2fa
ref: INT-004
type: integration
title: Approved invoices to the general ledger
status: active
summary: The billing system sends approved invoices to the general ledger each night as a file.
from_system: SYS-8ce4r7k2
to_system: SYS-6dn3w8ph
from_capabilities:
  - CAP-2hs6v7k2
payload: Approved invoices, with amount, legal entity and approver
trigger: schedule
frequency: Nightly
method: file
state: current
evidence:
  - SRC-4hd8x7k2#p-018
evidence_versions:
  SRC-4hd8x7k2:
    sha256: d5fd20e081e5a152ac41c4e0111055d73171e91d42603eb49eefbb7a7cf2f876
    converter: docx
    converter_version: "1"
schema_version: 1
created_at: 2026-11-05T13:22:09Z
updated_at: 2026-11-06T10:04:51Z
---
```

### Package (v2.1)

One system package that the project took in. Only `run package add` creates and writes it, `active` and with no review. A new version of the package writes the same record. See [20 System Packages](20-system-packages.md).

| Field | Need | Value | Rules |
| --- | --- | --- | --- |
| `name` | Required | The package name from the manifest, such as `acme-erp` | Lowercase letters, digits and hyphens. Unique among `package` records. |
| `version` | Required | `MAJOR.MINOR.PATCH`, such as `2.3.0` | The version that the project holds |
| `publisher` | Required | Text | The publisher from the manifest |
| `systems` | Required | List of `SYS id`, one or more | The systems that the package brought into the project |
| `bundle_sha256` | Required | 64 lowercase hexadecimal characters | SHA-256 of the manifest of the version that the project holds |
| `made_at` | Required | UTC timestamp | When the maker wrote the bundle |
| `made_with` | Required | Text | The Make Blueprint version that wrote the bundle |

Relations stored here: `systems`. Linked from: the `origin` stamp of each record from the package, which names this record's `id`.

### Relation Summary

| From | Field | To | This side | Other side |
| --- | --- | --- | --- | --- |
| capability | `system` | system | Exactly one | Zero or more capabilities per system |
| capability | `parent` | capability in the same system | Zero or one | Zero or more children |
| capability | `domain` | domain | Zero or one | Zero or more capabilities per domain |
| capability | `depends_on` | capability in the same system | Zero or more | Zero or more capabilities that depend on it |
| requirement | `capability` | capability | Exactly one | Zero or more requirements per capability |
| persona | `systems` | system | One or more when active | Zero or more personas per system |
| finding | `implications` | any type | Zero or more | Zero or more findings per record |
| extraction | `source` | source | Exactly one | Zero or more extractions per source |
| extraction | `records`, the `id` of each entry | system, domain, capability, requirement, persona, finding or integration | Zero or more | Zero or more extractions per record |
| comparison | `target_system` | system | Exactly one | Zero or more comparisons per system |
| comparison | `baseline_systems` | system | One or more | Zero or more comparisons per system |
| fit-gap | `comparison` | comparison | Exactly one | Zero or more fit-gap records per comparison |
| fit-gap | `baseline_capability` | capability | Exactly one, or none for `target-only` | At most one current fit-gap record per capability in each comparison |
| fit-gap | `target_system` | system | Exactly one | Zero or more fit-gap records per system |
| fit-gap | `covering_capabilities` | capability | Set by the verdict | Zero or more fit-gap records per capability |
| fit-gap | `requirement_marks`, the `requirement` of each entry | requirement of the baseline capability | One for each `active` requirement, or none for `target-only` | At most one mark per requirement in each fit-gap record |
| fit-gap | `requirement_marks`, the `capability` of each entry | the baseline capability | Exactly one mark when the capability has no `active` requirement, otherwise none | At most one such mark per fit-gap record |
| fit-gap | `requirement_marks`, the `capabilities` of each entry | capability of the target system | Zero or more per mark | Zero or more marks per capability |
| placement | `fit_gap` | fit-gap | Exactly one | At most one current placement per fit-gap record |
| placement | `owning_system` | system | Exactly one | Zero or more placements per system |
| placement | `integrations` | integration | One or more for an active `integrate` placement, otherwise none | Zero or more placements per integration |
| integration | `from_system` | system | Exactly one | Zero or more integrations from each system |
| integration | `to_system` | system | Exactly one | Zero or more integrations to each system |
| integration | `from_capabilities` | capability of `from_system` | Zero or more | Zero or more integrations per capability |
| integration | `to_capabilities` | capability of `to_system` | Zero or more | Zero or more integrations per capability |
| integration | `replaces` | `current` integration | Zero or more, only on a `planned` integration | Zero or more planned integrations per current integration |
| package | `systems` | system | One or more | Zero or more packages per system |
| any type | `related` | any type | Zero or more | Zero or more |
| any type | `superseded_by` | the same type | Exactly one when `superseded`, otherwise none | Zero or more superseded records per record |

`owners`, `stakeholders`, `audience` and a persona record's `slug` hold slugs from `.make/personas.yaml`, an extraction record's `extracted_by` and `reviewer` hold a `maintainer` slug or free text, and `work_items` and `docs` hold Make Docs links. None of them is a relation field, so none appears in this table.

### Later Types (v2.3)

Test case, run, result and playbook records come in v2.3. Their prefixes are fixed now, and they match the v1 prefixes, so the v1 import keeps v1 IDs of these types as refs (see [17 v1 Import](17-v1-import.md)). v2.0 does not create, read or check records of these types. Their fields are fixed when v2.3 is planned. The relations below come from v1 and show the expected shape only.

| Type | Prefix | Purpose | Expected relations, from v1 |
| --- | --- | --- | --- |
| `test-case` | `TC` | A test that checks one or more requirements or capabilities | Verifies requirements and capabilities |
| `run` | `RUN` | One run of test cases or of a playbook, with run notes and evidence files in `blueprint/runs/` | Holds results; may follow a playbook |
| `result` | `RES` | The outcome of one test case in one run | Names one test case and one run |
| `playbook` | `PB` | A reusable procedure, kept in `blueprint/playbooks/` | Used by runs |

The folders `blueprint/runs/` and `blueprint/playbooks/` arrive with v2.3 (see [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md)).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 9: identity; section 10: data model for v2.0, fit-gap fields, placement delivery values and later record types; section 16: Q-023, Q-028, Q-048, Q-057, Q-061, Q-064 to Q-066, Q-068, Q-070, Q-072, Q-073, Q-076 to Q-080)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/04-record-types.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/02-records-and-storage.md` (Field and Setting Names)
- `blueprint/records/<type>/<id>.md`
- `blueprint/records/integration/`
- `blueprint/sources/`
- `blueprint/sources/.gitignore`
- `.make/personas.yaml`
- `.make/blueprint/config.yaml`
- `blueprint/runs/`
- `blueprint/playbooks/`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/entity-records-contract.md`

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/04-record-types.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/02-records-and-storage.md`
- `docs/prd/10-records-and-identity.md`
- `docs/prd/12-source-intake-and-conversion.md`
- `docs/prd/14-fit-gap-and-placement.md`
- `docs/prd/19-system-integrations.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/entity-records-contract.md`
