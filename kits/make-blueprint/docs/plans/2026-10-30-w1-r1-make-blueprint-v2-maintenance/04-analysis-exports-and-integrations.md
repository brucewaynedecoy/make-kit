---
title: "Phase 4: Analysis, Exports and Integrations"
kind: "plan"
status: "draft"
coordinate: "W1 R1 P4"
---

# Phase 4: Analysis, Exports and Integrations

## Purpose

Carry the owner's decisions into the PRDs that own comparisons, the fit-gap method, placement and exports, and create the one new product PRD, for system integrations.

## Write Scope

`docs/prd/14-fit-gap-and-placement.md`, `15-exports.md` and the new `docs/prd/19-system-integrations.md`. Use the names fixed in [Phase 2](02-records-and-storage.md#field-and-setting-names).

- Front matter: set `source.path` to `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md` in every PRD you edit. Add no `## Requirement History` section (see the overview).

## New PRD: 19 System Integrations

- Decision: `create`.
- Kind: `subsystem`, like 14. Template: `make-docs://system/template/prd-subsystem.md`.
- Subject: how Make Blueprint records the integrations between systems and uses them in analysis. Current integrations come from extraction with evidence. Planned integrations come from analysis as drafts that cite evidence or the fit-gap or placement record that calls for them. A planned integration names the current integrations it `replaces`. The coverage read lists current integrations that touch a baseline system and that no planned integration replaces; the exact keep, rebuild and retire rules are designed in work phase 07. An `integrate` placement links its integration records. An integration record links to Make Docs designs, plans and work items, as a natural unit for "build interface X".
- Planned scope, not v2.0: field-level mapping and mapping files (register Q-075) and diagrams (register Q-074).
- Boundaries: 11 owns the fields, 13 owns extraction mechanics, 14 owns comparisons and placement, and 15 owns the export columns. 19 links to each and does not repeat their rules.
- Why no existing owner fits: integrations cut across extraction, comparison, placement and exports, and the owner expects mapping files and diagrams to grow the area. Folding it into 14 would mix a second record family into the fit-gap PRD.

## Updates

Each row is `update-existing` unless it says `none`.

| Decision | PRD | Sections | Current normative update |
| --- | --- | --- | --- |
| Q-018 | 14 | All examples | Lengthen 17 short example `id` values (10 distinct) to 8 characters. |
| Q-020 | 14 | Fit-Gap Records | Approving many records runs in batches, each one journaled change. |
| Q-023, Q-034, Q-036 | 14 | Hand-Off Boundary; Analysis Fields; Fit-Gap Records; Target-Only Generation; Placement Records; Analysis Check Rules | `none`. |
| Q-024 | 14 | Hand-Off Boundary; Integrations (Make Docs row) | `project check` skips Make Docs links and reports how many, until the Make Docs read command ships (O-001). |
| Q-035 | 14 | Comparisons; Coverage Read | "Fully scored" means every active baseline capability, parents included, has a fit-gap record. Facet scoping comes later. |
| Q-057 | 14 | Placement Records; Analysis Fields; Rebuild Notes | An `integrate` placement lists its integration records in `integrations`. There is no `partner_systems` field. |
| Q-065 | 14 | Fit-Gap Records; Target-Only Generation; Analysis Check Rules; Rebuild Notes | Keep "The grain is the capability, not the requirement." and add under it "The verdict is backed by a mark for each baseline requirement." The CLI hands out one baseline capability at a time through `run compare next` and tracks progress. A written rubric fixes when each verdict, confidence and effort applies. The compare commands refuse a draft without its verdict's required fields. A target-only pass follows the baseline pass. Consistency checks flag records for review first. |
| Q-066 | 14 | Fit-Gap Records; Analysis Fields; Record Examples; Analysis Check Rules | Mark values and the verdict table: all `met` gives `native`; all `met` or `configured` with at least one `configured` gives `configurable`; all `met`, `configured` or `unreleased` with at least one `unreleased` gives `unreleased`; all `not-met` gives `gap`; anything else gives `partial`. A capability with no requirements gets one mark; `target-only` records get none. The example shows marks. |
| Q-067 | 14 | Fit-Gap Records | Candidates and the similar-capabilities check use the index text search with the duplicate-hint matching, same domain first, as hints only. No embeddings or network services. |
| Q-068 | 14 | Fit-Gap Records; Analysis Check Rules | The record keeps the version of each requirement it marked. A changed requirement makes `project check` flag the record, and `run compare next` gives the capability out again. The fix goes through a pending change. |
| Q-073 | 14 | Scope; Component and Capability Map; Coverage Read; Integrations | The comparison coverage read includes current integrations with no replacement, and links to 19 for integration behavior. |
| Q-018 | 15 | Examples | Lengthen one short example `id`. |
| Q-037, Q-040, Q-074, Q-075 | 15 | Component and Capability Map; Scope; Integrations | `none`. |
| Q-038 | 15 | Encoding and Format Rules | 12's converted CSV files use the same rules and the same CSV writer. |
| Q-039 | 15 | Encoding and Format Rules; Regeneration; Rebuild Notes | Replace the open question: CSV values stay exact, the run output warns about values that start with `=`, `+`, `-` or `@` and points to the workbook, which writes them as text cells. |
| Q-042 | 15 | Integrations (Skills row) | `blueprint-report` runs exports, not the compare and place skills. |
| Q-058 | 15 | Scope; Component and Capability Map; Location and File Names; Encoding and Format Rules | `<comparison-ref>-placements.csv`, its columns and a workbook sheet are in v2.0. Remove the "A placement export" exclusion. |
| Q-062 | 15 | Scope; Component and Capability Map; Location and File Names; Capability Columns; Column Parity with the Example | `<system-ref>-capability-model.md`, `<system-ref>-data-dictionary.md` and `<comparison-ref>-data-dictionary.md`, with their layouts. The capability CSV gains a section-number column, and the example `doc_ref` maps to it instead of `evidence`. |
| Q-063 | 15 | Purpose; Regeneration; Client Promise | The CLI builds every file, prose included, from the records that pass the status filter (`active` by default) and the export format version alone, so the same records give byte-identical files. Prose comes from reviewed record bodies and finding records. Golden-file tests use synthetic records, and an export check confirms every `id`, section number and count. |
| Q-064, Q-070 | 15 | Capability Columns; Requirement Columns; Column Parity with the Example | Add capability columns `capability_type`, `triggers`, `outcomes`, `entities`, `depends_on`, `owners`, `stakeholders` and `audience`, and requirement columns `option_values`, `option_default`, `option_scope`, `owners`, `stakeholders` and `audience`. `audience` maps to the example `personas` column. Remove "not exported" and "dependencies are requirements of the kind `dependency`". |
| Q-069 | 15 | Scope; Component and Capability Map; Fit-Gap Detail Columns; Encoding and Format Rules; Regeneration | `<comparison-ref>-fit-gap-requirements.csv` and its sheet; a gap list for each requirement; mark counts on fit-gap rows; counts such as "6 of 8 met" for each capability in the workbook and the capability model document, once for each comparison. The `about` sheet explains mark values, and the export flags a verdict that does not match its marks. |
| Q-073 | 15 | Scope; Component and Capability Map; Location and File Names; Encoding and Format Rules | `<comparison-ref>-integrations.csv` and its sheet, a data dictionary entry, and an integration part in each capability model document. |
| D-011 | 15 | Encoding and Format Rules; document layouts | The `about` sheet and document titles use the project `name` when it is set. |
| Q-076 | 14 | Fit-Gap Records; Out-of-Date Marks; Analysis Fields | Marks keep the content version. `run compare next` returns content versions. Out-of-date marks compare content versions, so a tag or owner change never flags a record. |
| Q-079 | 14 | Fit-Gap Records; Target-Only Generation; Analysis Check Rules | Every capability a mark names is in `covering_capabilities`. The compare commands refuse a draft that breaks this, and `project check` reports `mark-capability-uncovered`. |
| Q-079 | 19 | Planned Integrations; Integrations in a Comparison; Integration Check Rules | A planned integration reaches the fit-gap record that calls for it through the placement's `integrations` list. No integration field names the fit-gap record. Until a placement lists it, the planned integration cites its evidence or the record that calls for it. |

## Exit Criteria

- PRD 19 exists, passes the authority validator and links to 11, 13, 14 and 15.
- Every row above is done, and no section still calls a closed item open.
- Each PRD's front matter `source.path` names the `W1 R1` plan, including the new 19.
- No short example `id` remains in these PRDs.
