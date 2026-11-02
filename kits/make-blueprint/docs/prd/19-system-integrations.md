---
title: "19 System Integrations"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 19 System Integrations

## Purpose

This PRD owns how Make Blueprint records the integrations between systems and how analysis uses them. An integration is one flow of data or events from one system to another, such as a nightly file of shipped orders that an order system sends to a billing system. Each integration is one record of the type `integration`, with the `id` prefix `INT`.

An integration record has one of two states. A current integration runs today. It comes from extraction, with evidence in a source. A planned integration is one that the planned state needs. It comes from analysis as a draft, and it cites the evidence or the analysis record that calls for it. A planned integration names the current integrations it replaces.

With integrations as records, people and agents can count them, find the high-effort ones, see which current integrations a comparison may break or must rebuild, and hand one interface to Make Docs as one unit of work. Without them, integrations would live only in prose, in a capability's type or in the `integrate` delivery value, which says neither which systems nor how.

Every capability in this PRD is in the v2.0 release scope unless a line says otherwise. Field-level mapping and diagrams are later scope (see [Later Scope](#later-scope)).

## Scope

Covered here:

- What one integration record means: one flow in one direction between two systems.
- Current integrations from extraction, with evidence.
- Planned integrations from analysis, as drafts that cite what calls for them.
- The `replaces` link from a planned integration to the current integrations it takes over.
- Which integrations the comparison coverage read lists.
- How an `integrate` placement uses its integration records.
- Make Docs doc and work item links on integration records.
- The `project check` rules for integration records.
- The later scope for field-level mapping and diagrams.

Covered elsewhere:

- The integration fields, their values, required links and field order: [11 Record Types Reference](11-record-types-reference.md).
- Common fields, including `docs`, `work_items`, `owners` and `stakeholders`, record statuses, `id` and `ref`, evidence links, pending changes and the `project check` catalog: [10 Records and Identity](10-records-and-identity.md).
- How `run extract add` creates integration drafts, and how review makes drafts `active` or `rejected`: [13 Extraction and Review](13-extraction-and-review.md).
- Comparisons, the coverage read, placement records, the delivery values and the effort list: [14 Fit-Gap and Placement](14-fit-gap-and-placement.md).
- The integrations CSV, its workbook sheet, its data dictionary entry and the integration part of each capability model document: [15 Exports](15-exports.md).
- Command names, MCP tool names and profiles: [08 CLI and MCP](08-cli-and-mcp.md).
- The Make Docs link format and how `project check` confirms those links: [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- The skills that create and link integration records: [16 Workflow and Skills](16-workflow-and-skills.md).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 10: data model for v2.0; section 16: Q-057, Q-073, and deferred mapping and diagrams)
- `docs/prd/03-open-questions-and-risk-register.md` (Q-057, Q-073, Q-074, Q-075, Q-079)
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/04-analysis-exports-and-integrations.md` (New PRD: 19 System Integrations)
- `blueprint/records/integration/<id>.md`

## Component and Capability Map

| Component | Stage | What it does | Main records | Release |
| --- | --- | --- | --- | --- |
| Current integrations | Extract, Review | Record each flow that runs today, with evidence in a source | integration | v2.0 |
| Planned integrations | Compare, Place, Review | Record each flow that the planned state needs, as a draft that cites what calls for it | integration | v2.0 |
| Replacement links | Compare, Place | A planned integration names the current integrations it replaces | integration | v2.0 |
| Integrations in the coverage read | Compare, Place | List the current integrations that touch a baseline system and that no planned integration replaces | read only | v2.0 |
| Placement links | Place | An `integrate` placement lists the integration records that deliver it | placement, integration | v2.0 |
| Hand-off links | Hand off | An integration record holds Make Docs doc paths and work item IDs for the interface work | integration | v2.0 |
| Integration exports | Any stage | The integrations CSV and its sheet, the data dictionary entry and the integration part of each capability model document, built from records (see [15 Exports](15-exports.md)) | read only | v2.0 |
| Field-level mapping | — | Mapping of each source field to a target field, with mapping file exports | integration | Later |
| Integration diagrams | — | Diagrams of integration flows and system landscapes | read only | Later |

Integration records are created and changed through the record commands and `run extract add`, and they are reviewed with the review commands. [08 CLI and MCP](08-cli-and-mcp.md) owns the verbs and tool names. Every MCP write tool needs `allowWrite`. Commands accept a record's `ref`, `id` or alias, and human output names records by `ref` and title.

In this PRD, `current` and `planned` name an integration's `state`. A record's status (`draft`, `active`, `rejected`, `superseded` or `archived`) is a separate field, and this PRD names it in full.

### One Flow in One Direction

An integration record describes one flow from its `from_system` to its `to_system`. A two-way exchange is two records, one for each direction, because each direction can have its own method and timing. So no record needs a direction field.

Requirements:

- An integration names one `from_system` and one `to_system`. Each is a current system record, and the two are different systems.
- Each capability in `from_capabilities` belongs to `from_system`, and each capability in `to_capabilities` belongs to `to_system`. Both lists are optional. They hold the link across systems that a capability's `depends_on` field cannot hold, because `depends_on` stays inside one system.
- `payload` says in short text what data or event moves.
- `trigger` says what starts the flow: `on-change`, `schedule` or `on-request`. `frequency` gives the timing in short words, such as nightly.
- `method` says how the flow moves: `api`, `file`, `event`, `isv` (a connector product from an independent software vendor) or `manual`. A project can extend this list.
- An integration touches a system when that system is its `from_system` or its `to_system`.

### Current Integrations

A current integration describes a flow that runs today, as a source shows it. Current integrations come from extraction: `run extract add` creates them as drafts with evidence links to the extraction's source (see [13 Extraction and Review](13-extraction-and-review.md)). Review makes each draft `active` or `rejected`.

Requirements:

- A current integration has `state: current`.
- A current integration cites at least one evidence link. `project check` warns about one that has none, such as one a person recorded outside an extraction.
- A current integration lists no `replaces` and carries no `effort`.
- A fact on an `active` current integration is fixed through a pending change on the same record (see [10 Records and Identity](10-records-and-identity.md)).

### Planned Integrations

A planned integration describes a flow that the planned state needs. Planned integrations come from analysis, in the compare and place stages. Each one rests on what calls for it: evidence links into sources, a placement that lists it in `integrations`, or both. A placement names its fit-gap record, so the fit-gap record that calls for the integration is reached through that placement's `integrations` list. No integration field names a fit-gap record.

Requirements:

- A read that shows the fit-gap record behind a planned integration follows each placement that lists the integration in `integrations` to that placement's `fit_gap`.
- Until a placement lists it, a planned integration cites its evidence links into sources, or names the record that calls for it in its body. Only evidence links and a listing placement count for the check in [Integration Check Rules](#integration-check-rules).

- A planned integration has `state: planned`.
- A planned integration starts as `draft`, whichever command creates it. The review commands in [13 Extraction and Review](13-extraction-and-review.md) make it `active` or `rejected`.
- `replaces` lists the current integrations that the planned integration takes over, by `id`. Each listed record is a current integration. A planned integration may replace several current integrations, and several planned integrations may replace one current integration.
- A planned integration that replaces nothing is valid. It is a flow that the planned state needs and that has no counterpart today.
- `effort` sizes the work to build the planned integration, with the effort list in [14 Fit-Gap and Placement](14-fit-gap-and-placement.md#fit-gap-records).

### Integrations in a Comparison

The coverage read of a comparison (see [14 Fit-Gap and Placement](14-fit-gap-and-placement.md#coverage-read)) lists each `current` integration with the status `active` that touches one of the comparison's baseline systems, and that no `planned` integration with the status `draft` or `active` lists in `replaces`. This list shows what the move to the target system may break or must rebuild.

Requirements:

- The list names each integration by `ref` and title, with its `from_system`, `to_system` and `payload`.
- The list names the next useful action for each integration, such as recording the planned integration that replaces it.
- A current integration between two baseline systems counts once, not once for each system it touches.
- The list is worked out from the records on every read. No record stores whether a current integration has a replacement.
- The CLI and MCP return the same list for the same comparison.
- The list does not change whether a comparison is fully scored. 14 owns that rule.
- A planned integration counts as a replacement in this list whether or not a placement lists it yet. Where a read shows the fit-gap record behind a replacement, it reaches that record only through a placement that lists the integration in `integrations`, because no integration field names a fit-gap record.

Work phase 07 designs the exact rules for keeping, rebuilding and retiring a current integration, and the coverage read applies them.

### Placements That Integrate

A placement with the delivery `integrate` says that its owning system provides the capability to the other systems in scope through an integration. Its `integrations` field lists the integration records that do this, so the other ends of the integration are recorded and checked. [14 Fit-Gap and Placement](14-fit-gap-and-placement.md#placement-records) owns the placement rules, including the rule that only an `integrate` placement lists `integrations`.

Requirements:

- A placement's `integrations` entries name integration records, by `id`.
- Each integration that an `integrate` placement lists touches the placement's owning system.
- An `integrate` placement may list a current integration that stays in the planned state, a planned integration, or both.
- Several placements may list the same integration record.

### Make Docs Links

An integration is a natural unit for Make Docs work, such as "build interface X". An integration record holds Make Docs doc paths in its `docs` field and Make Docs work item IDs in its `work_items` field, as every record type does (see [10 Records and Identity](10-records-and-identity.md)). A doc path can point to any Make Docs doc, such as a design, plan, PRD, work item or guide.

Requirements:

- Make Blueprint only links to Make Docs work. Creating, changing or closing a work item, and writing any doc, is a Make Docs job, as the [Hand-Off Boundary](14-fit-gap-and-placement.md#hand-off-boundary) in 14 states.
- An integration record may hold several doc paths and work item IDs, and several records may name the same work item.
- `project check` skips these links and reports how many it skipped, until it uses the read command that Make Docs 2.1.0 ships to confirm them ([root Q-020](../../../../docs/prd/03-open-questions-and-risk-register.md#q-020-release-of-the-link-read-command), obligation [O-001](03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check)). [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) owns the link format and the confirmation.

### Later Scope

These are not v2.0 requirements:

- **Field-level mapping.** In v2.0, `payload` is short text. A later release adds field-level mapping on integration records, which pairs each source field with a target field and its transform, and a mapping file export. The register tracks it as [Q-075](03-open-questions-and-risk-register.md#q-075-field-level-integration-mapping).
- **Diagrams.** Integration flows and system landscapes are easier to review as diagrams. A later optional skill guides an agent to draw them with the Eraser Diagrams tool. That tool uses Chromium, so it stays an add-on outside the signed single-file CLI. The register tracks it as [Q-074](03-open-questions-and-risk-register.md#q-074-diagram-skill-with-eraser-diagrams).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 11: workflow and skills; section 12: relationship with Make Docs; section 16: Q-024, Q-057 and Q-073)
- `blueprint/records/integration/<id>.md`
- `blueprint/records/placement/<id>.md`
- `docs/work/`

## Contracts and Data

Every integration record is one Markdown file with YAML front matter, like every other record. Links between records always use `id`. [11 Record Types Reference](11-record-types-reference.md) owns the complete field schema and field order. This PRD owns the behavior behind those fields.

### Integration Fields

| Field | Meaning | Behavior here |
| --- | --- | --- |
| `from_system`, `to_system` | The `id` of the system the flow leaves and the system it enters | [One Flow in One Direction](#one-flow-in-one-direction) |
| `from_capabilities`, `to_capabilities` | The `id` of each capability on each side, optional | [One Flow in One Direction](#one-flow-in-one-direction) |
| `payload` | Short text: the data or event that moves | [One Flow in One Direction](#one-flow-in-one-direction) |
| `trigger`, `frequency` | What starts the flow, and its timing in words | [One Flow in One Direction](#one-flow-in-one-direction) |
| `method` | How the flow moves | [One Flow in One Direction](#one-flow-in-one-direction) |
| `state` | `current` or `planned` | [Current Integrations](#current-integrations), [Planned Integrations](#planned-integrations) |
| `replaces` | The `id` of each current integration a planned one takes over | [Planned Integrations](#planned-integrations) |
| `effort` | The effort of a planned integration | [Planned Integrations](#planned-integrations) |
| `docs`, `work_items` | Make Docs doc paths and work item IDs, as common fields | [Make Docs Links](#make-docs-links) |

A placement's `integrations` field is the other link into integration records. [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) lists it with the analysis fields.

### Record Examples

The examples below leave out some common fields, such as `aliases`, `facets` and the timestamps. They use the systems from the examples in [14 Fit-Gap and Placement](14-fit-gap-and-placement.md#record-examples): the target platform `SYS-k2v9d7k2` and the current order and billing systems `SYS-a7c4m7k2` and `SYS-b3x8r7k2`.

A current integration that a source describes:

```markdown
---
id: INT-5c8rw2ma
ref: INT-003
type: integration
title: Shipped orders to billing
status: active
summary: The order system sends a nightly file of shipped orders to the billing system.
from_system: SYS-a7c4m7k2
to_system: SYS-b3x8r7k2
payload: Shipped orders with lines, prices and customer account numbers
trigger: schedule
frequency: Nightly
method: file
state: current
evidence:
  - SRC-4hd8x7k2#p-027
evidence_versions:
  SRC-4hd8x7k2:
    sha256: ce065c8cde8caa6e51ec405febe6e3d1c39dfcff2602d147670db662f9cbd80d
    converter: docx
    converter_version: "1"
schema_version: 1
---

How the file is built, where it lands and what the billing system does when it is late.
```

A planned integration that replaces it, because the target platform takes over orders and billing stays in its current system:

```markdown
---
id: INT-9tf4kx3b
ref: INT-011
type: integration
title: Shipped orders from the target to billing
status: draft
summary: The target platform sends each shipped order to the billing system as it ships.
from_system: SYS-k2v9d7k2
to_system: SYS-b3x8r7k2
payload: One shipped order with its lines, prices and customer account number
trigger: on-change
frequency: As each order ships
method: api
state: planned
replaces:
  - INT-5c8rw2ma
effort: medium
schema_version: 1
---

Why the flow moves to an API call, and what the billing system must accept.
```

The placement that calls for the planned integration:

```markdown
---
id: PLC-2hb7q4zn
ref: PLC-021
type: placement
title: Keep invoicing in the billing system
status: draft
fit_gap: FIT-6wy3m8ke
owning_system: SYS-b3x8r7k2
delivery: integrate
integrations:
  - INT-9tf4kx3b
schema_version: 1
---

Why billing keeps invoicing and how the target feeds it.
```

### Integration Check Rules

The `project check` command (see [08 CLI and MCP](08-cli-and-mcp.md) and [10 Records and Identity](10-records-and-identity.md)) applies these rules to integration records whose status is `draft` or `active`, and reports them as `type-rule`. Link types, such as a placement `integrations` entry that names a record of another type, follow the relation rules in 10. An error means the record breaks the data model. A warning points at a likely mistake that a person may accept.

| Rule | Level |
| --- | --- |
| An integration's `from_system` and `to_system` are the same system | Error |
| A capability in `from_capabilities` does not belong to `from_system`, or one in `to_capabilities` does not belong to `to_system` | Error |
| A `current` integration lists `replaces` | Error |
| A `replaces` entry names an integration whose `state` is not `current` | Error |
| A `current` integration has no evidence link | Warning |
| A `current` integration carries an `effort` | Warning |
| A `planned` integration has no evidence link, and no placement with the status `draft` or `active` lists it in `integrations`, so nothing shows what calls for it | Warning |
| An integration that an `integrate` placement lists does not touch the placement's owning system | Warning |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 9: identity; section 10: data model for v2.0; section 16: Q-057 and Q-073)
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/02-records-and-storage.md` (Field and Setting Names: integration)
- `blueprint/records/integration/<id>.md`
- `blueprint/records/placement/<id>.md`

## Integrations

| Party | What integration records need from it, or give to it | Owner |
| --- | --- | --- |
| Record types | The integration fields, their values, required links and field order, and the placement `integrations` field | [11 Record Types Reference](11-record-types-reference.md) |
| Records and identity | Common fields, record statuses, `id` and `ref`, evidence link validation, pending changes and the `project check` catalog | [10 Records and Identity](10-records-and-identity.md) |
| Extraction and review | `run extract add` creates current integration drafts with evidence. The review commands make current and planned drafts `active` or `rejected`. | [13 Extraction and Review](13-extraction-and-review.md) |
| Fit-gap and placement | The coverage read that shows current integrations with no replacement, `integrate` placements that list integration records, the effort list and the hand-off boundary | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| Exports | The integrations CSV and its workbook sheet, the data dictionary entry and the integration part of each capability model document | [15 Exports](15-exports.md) |
| CLI and MCP | The record, extract, review and compare commands, the MCP profiles and `allowWrite` | [08 CLI and MCP](08-cli-and-mcp.md) |
| Storage and indexing | The index answers the coverage read's integration list and the reverse lookup of `replaces` | [09 Storage and Indexing](09-storage-and-indexing.md) |
| Skills | The extract skill records current integrations. The compare and place skills record planned integrations, and the place skill links them on `integrate` placements. | [16 Workflow and Skills](16-workflow-and-skills.md) |
| Make Docs | Owns the designs, plans and work items for interface work. Make Blueprint stores only their paths and IDs on integration records. | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 7: CLI and MCP; section 11: workflow and skills; section 12: relationship with Make Docs; section 13: exports)
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md` (Genuinely New Product PRDs)
- `blueprint/exports/<comparison-ref>-integrations.csv`
- `docs/work/`

## Rebuild Notes

In BuildOS v1 and the example fit-gap, integrations showed up only as text: rows in v1 files, a `capability_type` of `integration`, a requirement of the kind `dependency`, and the `integrate` delivery value. Nothing recorded "system A sends X to system B", so nobody could count integrations, find the high-effort ones or see which ones a move would break.

What a rebuild must preserve:

- One record is one flow in one direction. A two-way exchange is two records.
- `current` and `planned` stay apart. Current integrations come from sources with evidence. Planned integrations come from analysis as drafts and cite what calls for them.
- `replaces` runs from a planned integration to current ones. The reverse link is worked out when it is read and never stored.
- The coverage read's integration list comes from records on every read.
- Make Blueprint only links to Make Docs work for an integration. Make Docs creates and changes it.
- In v2.0, `payload` stays short text.

Where implementers are likely to make mistakes:

- **A direction field.** One record already has one direction. A direction field invites a record that claims both.
- **Cross-system `depends_on`.** A capability's `depends_on` stays inside its own system. A link to a capability in another system belongs in an integration record's `from_capabilities` or `to_capabilities`.
- **Stored replacement flags.** A `replaced_by` field or a "has replacement" flag on a current integration goes stale when a planned integration changes. Work it out from `replaces`.
- **A planned integration that replaces a planned one.** `replaces` names only current integrations.
- **Partner systems on placements.** The other ends of an `integrate` placement come from its integration records, not from a list of systems on the placement.
- **Mapping detail in `payload`.** Field-by-field mapping is later scope. Long mapping text in `payload` makes the exports hard to read and cannot be checked.
- **Guessed keep, rebuild and retire rules.** Work phase 07 designs them, and the coverage read applies them. Do not hard-code such a rule in the coverage read before that design exists.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Context: field use so far; section 16: Q-073 and deferred mapping and diagrams)
- `docs/prd/03-open-questions-and-risk-register.md` (Q-073 Why it matters)

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/04-analysis-exports-and-integrations.md`
- `docs/prd/03-open-questions-and-risk-register.md`
