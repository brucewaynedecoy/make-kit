---
title: "15 Exports"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 15 Exports

## Purpose

Exports turn Make Blueprint records into files that people outside Make Blueprint can open: CSV files, Markdown documents and one xlsx workbook for each comparison. A consultant sends them to a client, who opens them in an ordinary spreadsheet app, text editor or Markdown viewer. The files live in `blueprint/exports/`.

Exports are generated output. They are never the truth. The records in `blueprint/records/` are the truth, and a command makes the exports again from those records at any time. Nothing in Make Blueprint reads an export back.

The CLI builds every export file, prose included, from the records that pass the status filter and the export format version alone. The status filter is `active` by default (see [Status Filter](#status-filter)). The export format version names the layout of every export file and ships with Make Blueprint. The same records therefore give byte-identical files on every run, and no agent writes export text at export time. The prose comes from reviewed record bodies and finding records. The `blueprint-report` skill helps an agent draft that prose into records before an export runs (see [16 Workflow and Skills](16-workflow-and-skills.md)).

Every capability in this PRD is in the v2.0 release scope unless a line says otherwise.

## Scope

Covered here:

- The v2.0 export set. For each comparison: a fit-gap detail CSV, a fit-gap requirements CSV, a summary by verdict, a summary by domain, a placements CSV, an integrations CSV, a data dictionary, and one xlsx workbook with one sheet for each of its CSV exports. For each system: a capability CSV, a requirement CSV, a capability model document and a data dictionary.
- The column list of each CSV export, and how it maps to the columns of the example fit-gap.
- The layout of each Markdown document.
- File names and their location in `blueprint/exports/`.
- Regeneration by command from records alone, the export check, and the rule that exports are never the truth.
- Encoding, delimiter, Markdown and workbook rules that let the files open in common apps.
- The promise that a client opens the fit-gap CSV and the workbook without Make Blueprint.

Covered elsewhere:

- The comparison, fit-gap, placement, capability and domain records that exports read, the requirement marks and the verdict table, and the meaning of each verdict, confidence, effort, mark and delivery value: [14 Fit-Gap and Placement](14-fit-gap-and-placement.md).
- Integration records and which integrations touch a comparison: [19 System Integrations](19-system-integrations.md).
- Record fields: [11 Record Types Reference](11-record-types-reference.md). Record statuses, `id`, `ref` and facets: [10 Records and Identity](10-records-and-identity.md).
- The `blueprint/exports/` folder, its router files and whether git tracks it, and the project `name` in `.make/config.yaml`: [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md).
- The `run export` commands, their options and the export MCP tool: [08 CLI and MCP](08-cli-and-mcp.md).
- The `blueprint-report` skill, which drafts export prose into records and runs the exports: [16 Workflow and Skills](16-workflow-and-skills.md).
- Backlog exports, such as the Azure Boards export, belong to Make Docs: [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- Viewing, sorting and filtering fit-gap records in the v2.1 web app and MCP App views: [18 Local Server and UI](18-local-server-and-ui.md).

Not in the v2.0 export set:

- Summaries for each system by domain and capability status, which the example fit-gap kept as separate files. The capability CSV of each system holds the data for them.
- Any import from an export. A change made in an exported file is lost on the next run.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 13: exports; section 16: Q-058, Q-062, Q-063, Q-069 and Q-073; Human Experience Intent)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/07-analysis-and-exports.md` (Scope)
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/04-analysis-exports-and-integrations.md` (Updates)
- `blueprint/exports/`

## Component and Capability Map

| Export | One for each | File name | Rows | Release |
| --- | --- | --- | --- | --- |
| Fit-gap detail | Comparison | `<comparison-ref>-fit-gap.csv` | One for each exported fit-gap record | v2.0 |
| Fit-gap requirements | Comparison | `<comparison-ref>-fit-gap-requirements.csv` | One for each requirement mark on an exported fit-gap record | v2.0 |
| Summary by verdict | Comparison | `<comparison-ref>-fit-gap-by-verdict.csv` | One for each of the six verdicts | v2.0 |
| Summary by domain | Comparison | `<comparison-ref>-fit-gap-by-domain.csv` | One for each domain that passes the status filter, plus a "No domain" row when needed | v2.0 |
| Placements | Comparison | `<comparison-ref>-placements.csv` | One for each exported placement | v2.0 |
| Integrations | Comparison | `<comparison-ref>-integrations.csv` | One for each exported integration that touches the comparison's target or baseline systems | v2.0 |
| Comparison data dictionary | Comparison | `<comparison-ref>-data-dictionary.md` | A Markdown document | v2.0 |
| Workbook | Comparison | `<comparison-ref>-fit-gap.xlsx` | An `about` sheet, then one sheet for each CSV export of the comparison | v2.0 |
| Capabilities | System | `<system-ref>-capabilities.csv` | One for each exported capability of the system | v2.0 |
| Requirements | System | `<system-ref>-requirements.csv` | One for each exported requirement of the system | v2.0 |
| Capability model | System | `<system-ref>-capability-model.md` | A Markdown document | v2.0 |
| System data dictionary | System | `<system-ref>-data-dictionary.md` | A Markdown document | v2.0 |

The comparison files are the eight comparison exports above. The system files are the four system exports.

An export run has one of three scopes. [08 CLI and MCP](08-cli-and-mcp.md) owns the command names, such as `run export fit-gap`, and their options.

| Scope | Files the run writes |
| --- | --- |
| One comparison | The comparison files, plus the system files of its target system and each baseline system |
| One system | The system files |
| Full | Every comparison's files and every system's files, including systems that are in no comparison. A full run also deletes stale export files. |

### Client Promise

A consultant exports a fit-gap CSV and an xlsx workbook that a client opens without Make Blueprint. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind this promise.

Requirements:

- The fit-gap detail CSV and the workbook open in Microsoft Excel on Windows and macOS, LibreOffice Calc, Apple Numbers and Google Sheets with no import step and no import setting. Each column lands in its own column, the header row comes first, and every character shows correctly, including accented letters, curly quotes and dashes. For a CSV opened in Excel, this holds where the system list separator is a comma. The workbook holds in every locale.
- Excel opens the workbook with no repair message and no security prompt. The workbook holds no macros, no formulas and no links to other files.
- A reader understands each row without Make Blueprint. Each `ref` sits beside a readable name or title, each evidence link comes with the `ref` and title of its source, and the `about` sheet explains every verdict, confidence, effort, mark, delivery and integration value.
- Each Markdown document reads in any text editor or Markdown viewer, and a reader follows it without Make Blueprint.
- No export needs Make Blueprint, a macro, an add-in or a network connection to open.

Evidence for this promise, from work phase 07:

- Automated Implementation Testing checks column parity with the example fit-gap (see [Column Parity with the Example](#column-parity-with-the-example)) and checks the encoding and workbook rules below.
- Golden-file tests build every export file from synthetic records and compare it byte for byte with a stored expected file, so the shape of every CSV file, Markdown document and workbook stays fixed. No client data enters the test fixtures.
- A Guided Progress Review opens the workbook in a spreadsheet app and records what a reader sees: the sheet list, the columns of each sheet, the characters, and whether the `about` sheet explains the values. The same review reads one capability model document.

### Regeneration

Requirements:

- Exports are made only when a person or agent runs an export command. Nothing makes them in the background.
- Each run builds every file, prose included, from the records that pass the status filter and the export format version alone. No command reads an export file as input, and no agent writes export text during a run.
- An export run never changes a record.
- Running an export twice with no record changes between the runs writes byte-identical files: CSV files, Markdown documents, and workbooks with the same sheet names, sheet order and cell values.
- An export check confirms that every `id`, section number and count in the built files matches the records. The run checks the content it built before it writes any file, so it never reads an export back. A failed check fails the run, names the file and the value, and leaves the previous files in place.
- Each file is written in full or not at all. If a run fails partway, the previous version of each file it did not finish stays in place.
- A full run leaves `blueprint/exports/` holding exactly the current export set, the folder's router files and any file whose name does not match an export file name. A stale export file is a file whose name matches an export file name but names a comparison or system `ref` that the run did not produce, for example after a ref fix. A full run deletes stale export files and lists them in its output.
- An export run never changes or deletes the router files `AGENTS.md` and `CLAUDE.md` in `blueprint/exports/`.
- The output names each file written with its row count, counts the records left out by reason (for example "12 draft fit-gap records left out"), and lists warnings, such as a cut cell, a `project check` error on an exported record, an exported capability with no domain, or a fit-gap record whose verdict differs from the verdict its marks give. Warnings do not stop the run. Human output and JSON output carry the same meaning.
- When a CSV file holds a text value that starts with `=`, `+`, `-` or `@`, the output warns, names the file, the column and the record, and points the reader to the workbook, which writes such values as text cells. The CSV value stays exact.
- Exports run offline, need no Python and no spreadsheet app, and work in the signed single file (see [07 Installation and Distribution](07-installation-and-distribution.md)).
- The export MCP tool writes files, so it is a write tool that needs `allowWrite` (see [08 CLI and MCP](08-cli-and-mcp.md)).

### Status Filter

By default, an export holds only `active` records. The option `--include-drafts` adds `draft` records, so a consultant can share work in progress, and the `status` column marks each draft row. `rejected`, `superseded` and `archived` records never appear in an export.

Requirements:

- `run export fit-gap`, `run export system` and `run export all` each take `--include-drafts`. The matching MCP tools take `includeDrafts: true`. [08 CLI and MCP](08-cli-and-mcp.md#run-export) owns the command forms.
- One status filter applies to every row, every count and every Markdown document in a run. Requirement counts and summary counts include only records that pass the filter.
- The `about` sheet and each data dictionary name the status filter the run used.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 4: project and machine layout; section 13: exports; section 16: Q-039 and Q-063; Human Experience Intent: experience promises and evidence required)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Human Experience Propagation)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/07-analysis-and-exports.md` (Human Experience and Evidence, Testing Decisions)
- `blueprint/exports/`

## Contracts and Data

### Location and File Names

All exports go to `blueprint/exports/`, in one flat folder. File names start with the `ref` of the comparison or system the file belongs to, so a file still says what it holds when it is attached to an email.

```text
blueprint/exports/
  AGENTS.md, CLAUDE.md               routers (see 06); an export run never touches them
  CMP-001-fit-gap.csv                fit-gap detail for comparison CMP-001
  CMP-001-fit-gap-requirements.csv   one row for each requirement mark
  CMP-001-fit-gap-by-verdict.csv     summary by verdict
  CMP-001-fit-gap-by-domain.csv      summary by domain
  CMP-001-placements.csv             placements
  CMP-001-integrations.csv           integrations that touch the comparison's systems
  CMP-001-data-dictionary.md         data dictionary for the comparison files
  CMP-001-fit-gap.xlsx               workbook for CMP-001
  SYS-001-capabilities.csv           capabilities of system SYS-001
  SYS-001-requirements.csv           requirements of system SYS-001
  SYS-001-capability-model.md        capability model document for SYS-001
  SYS-001-data-dictionary.md         data dictionary for the system files of SYS-001
  SYS-002-capabilities.csv
  SYS-002-requirements.csv
  SYS-002-capability-model.md
  SYS-002-data-dictionary.md
```

Requirements:

- File names use only ASCII letters, digits, hyphens and one dot, so they are valid on macOS, Windows and Linux.
- File names use each record's `ref` at the time of the run. After a ref fix, the next run writes the new name, and the next full run deletes the old file.

### Encoding and Format Rules

CSV files:

- Text is UTF-8 and starts with a byte order mark (BOM), so Excel reads accented letters and symbols correctly.
- The delimiter is always a comma, on every machine and in every locale.
- The first line is the header row, with the column names listed below in the order listed.
- Quoting follows RFC 4180. A value that holds a comma, a double quote or a line break is wrapped in double quotes, and a double quote inside it is written twice.
- Rows end with a line feed (LF). A line break inside a value stays a line feed inside the quotes.
- An empty value is an empty cell. Exports never write placeholders such as `null` or `N/A`.
- A list cell joins its values with a space, a pipe and a space (` | `), in a stable order. Refs, ids, codes, status values and evidence links never hold a pipe. A list of names is for reading; a program reads the matching list of refs or ids, which has the same order.
- Counts are plain whole numbers with no thousands separator.
- Make Blueprint writes no formulas. CSV values stay exact, including text that begins with `=`, `+`, `-` or `@`. The run output warns about such values and points to the workbook (see [Regeneration](#regeneration)).
- The converted CSV files in [12 Source Intake and Conversion](12-source-intake-and-conversion.md) use these same rules and the same CSV writer.

Markdown documents:

- Text is UTF-8 with LF line endings.
- Each document starts with one H1 title. When the project `name` in `.make/config.yaml` is set (see [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md)), the title starts with it, followed by the system or comparison `ref` and name and the kind of document, such as `<project name>: SYS-001 <system name> capability model`. Without a `name`, the title starts with the `ref`.
- All prose comes from record bodies and finding records, as each layout below lists. A document holds no text that an agent wrote at export time. Fixed headings and labels come from the export format version.
- Records appear by `ref` and title. Each evidence link appears with the `ref` and title of its source.
- Tables use the Markdown pipe table form with one header row. A pipe inside a value is written as `\|`.
- With `--include-drafts`, each draft record shows `draft` beside its title.

The workbook:

- The workbook is one Office Open XML file (`.xlsx`) with no macros.
- Sheets come in this order: `about`, `fit-gap`, `fit-gap-requirements`, `by-verdict`, `by-domain`, `placements`, `integrations`, then `<system-ref> capabilities` and `<system-ref> requirements` for the target system, then for each baseline system in the comparison's order.
- Sheet names use only letters, digits, spaces and hyphens, and stay within Excel's limit of 31 characters.
- Each data sheet holds the same columns and rows, in the same order, as its matching CSV file.
- The header row on each data sheet is bold, frozen in place and has a filter.
- Text values are text cells, never formulas, including text that begins with `=`, `+`, `-` or `@`. Counts are number cells.
- A text value longer than Excel's limit of 32,767 characters is cut to fit and ends with `[truncated]`, and the run output names the record. The matching CSV file keeps the full value.
- The workbook's document properties and internal file times come from the latest `updated_at` of the exported records, not from the time of the run, so a run with no record changes writes the same file.

The `about` sheet holds:

- the project `name` from `.make/config.yaml`, when it is set;
- the comparison's `ref` and title;
- the target system and each baseline system, by `ref` and name;
- the status filter the run used;
- the export format version;
- "Records as of", the latest `updated_at` of the exported records;
- each other sheet's name, a one-line description and its row count;
- the count of fit-gap records for each verdict;
- the meaning of each verdict, confidence, effort, mark and delivery value, and the table that gives a verdict from marks, as [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) defines them;
- the meaning of each integration `state`, `trigger` and `method` value, as [11 Record Types Reference](11-record-types-reference.md) and [19 System Integrations](19-system-integrations.md) define them;
- a note that Make Blueprint generated the workbook from project records, that the workbook is not the truth, and that changes belong in the records, followed by a new export.

### Capability Model Document

`<system-ref>-capability-model.md` is the narrative document for one system. A client reads it first. Its parts come in this order:

1. **About.** The title, then the system record's body. Then the counts of exported capabilities, requirements and integrations, and each comparison in which the system is a baseline, by `ref` and title.
2. **Domain parts.** One numbered part for each domain that holds an exported capability of the system, in domain `code` order, with a "No domain" part last when needed. Parts are numbered from 1. Each part opens with the domain record's body.
3. **Capability sections.** Inside each domain part, one numbered section for each of its capabilities, in the order of the capability export. A section number is the part number, a dot and the section's place in the part, such as `3.2`. A section holds the capability's `ref`, title, `capability_status`, summary and body, and its detail fields when they are set. It lists each requirement of the capability with its `ref`, title, kind, summary and body, and the option fields of a `setting` requirement. For each comparison in which the system is a baseline, the section gives the fit-gap verdict, the mark counts, such as "6 of 8 met", and the gap list: the requirements whose mark is `partly`, `unreleased` or `not-met`, each with its mark and note. The section ends with the sources its evidence names.
4. **Integrations.** One entry for each exported integration whose `from_system` or `to_system` is this system: its `ref`, title and `state`, the other system, whether the flow leaves or enters this system, and its payload, trigger, frequency and method. A planned integration also names the current integrations it replaces.
5. **Capability inventory.** One table of every exported capability: section number, `ref`, name, domain code, `capability_status` and requirement count.
6. **Findings and source notes.** The finding records whose `implications` name the system or one of its capabilities, each with its kind, title and body. These carry the cross-cutting principles, recorded contradictions and reading notes. Then every source that the system's exported records cite, by `ref` and title, in `ref` order.

In the mark counts, "met" counts `met` and `configured` marks, and the total counts every mark on the record. A system can be the baseline in more than one comparison, so a section shows the results once for each such comparison, in comparison `ref` order.

### Data Dictionaries

`<system-ref>-data-dictionary.md` explains one system's export files, so a reader can use the CSV files without help. It holds, in order:

- the title, the export format version and the status filter;
- the files: each system file's name, a one-line description and its row count;
- the model shape: how the system's domains, capabilities and requirements relate, with their counts;
- every column of each CSV file, in file order, with its meaning;
- every value list that a column uses, such as capability statuses, requirement kinds, domain codes, capability types and option scopes, with the count of rows for each value;
- the join rules: which columns join the files to each other, such as `capability_id` between the capability and requirement files, and the matching columns in the comparison files;
- encoding notes: the CSV rules above, the list cell separator, and the note that the workbook is the file that opens correctly in every locale.

`<comparison-ref>-data-dictionary.md` does the same for the comparison files. Its value lists include the verdict, confidence, effort, mark and delivery lists and the integration `state`, `trigger` and `method` lists, each with its count, and it gives the table that turns marks into a verdict. Its entry for the integrations file explains that one row is one flow in one direction.

### Shared Column Rules

- Each row carries the `ref` and `id` of its own record. Each capability that a row names also appears by both `ref` and `id`. Systems and domains appear by `ref` and name, and domains also by `code`.
- Facet columns come after the fixed columns in the fit-gap detail, capability and requirement exports. There is one column for each facet the project defines, in the order of the project config, named `facet_<facet name>` and holding the record's values as a list cell (see [10 Records and Identity](10-records-and-identity.md)). Summaries have no facet columns.
- `evidence_sources` lists each distinct source that the row's evidence links name, as the source `ref`, a space and the source title, in the order of first use.

### Fit-Gap Detail Columns

There is one row for each fit-gap record in the comparison that passes the status filter. Rows with the direction `baseline-to-target` come first, ordered by baseline system in the comparison's order, then by baseline domain `code` with "No domain" last, then by baseline capability `ref`. `target-only` rows follow, ordered by target domain `code`, then by target capability `ref`. On `target-only` rows, every `baseline_` column and every mark column (32 to 41) is empty.

| # | Column | Meaning | Example column |
| --- | --- | --- | --- |
| 1 | `comparison_ref` | The comparison's `ref` | None |
| 2 | `fit_gap_ref` | The fit-gap record's `ref` | None |
| 3 | `fit_gap_id` | The fit-gap record's `id` | None |
| 4 | `status` | The fit-gap record's status | None |
| 5 | `direction` | `baseline-to-target` or `target-only`, from the verdict | `direction` |
| 6 | `baseline_system_ref` | The baseline system's `ref` | None |
| 7 | `baseline_system_name` | The baseline system's name | None |
| 8 | `baseline_capability_ref` | The baseline capability's `ref` | `ce_capability_id` |
| 9 | `baseline_capability_id` | The baseline capability's `id` | `ce_capability_id` |
| 10 | `baseline_capability_name` | The baseline capability's title | `ce_name` |
| 11 | `baseline_domain_ref` | The baseline capability's domain `ref` | `ce_layer_id` |
| 12 | `baseline_domain_code` | That domain's `code` | `ce_layer_code` |
| 13 | `baseline_domain_name` | That domain's name | `ce_layer_name` |
| 14 | `baseline_capability_status` | The baseline capability's `capability_status`, from its system's list | `ce_status` |
| 15 | `baseline_requirement_count` | The number of exported requirements of the baseline capability | `ce_requirement_count` |
| 16 | `verdict` | The verdict | `verdict` |
| 17 | `confidence` | The confidence | `confidence` |
| 18 | `effort` | The effort | `effort` |
| 19 | `target_system_ref` | The target system's `ref` | None |
| 20 | `target_system_name` | The target system's name | None |
| 21 | `target_capability_refs` | List of the covering capabilities' `ref` values | `fo_capability_ids` |
| 22 | `target_capability_ids` | List of the covering capabilities' `id` values, in the same order | `fo_capability_ids` |
| 23 | `target_capability_names` | List of the covering capabilities' titles, in the same order | `fo_capability_names` |
| 24 | `target_domain_codes` | List of the distinct domain codes of the covering capabilities, in code order | `fo_layer_codes` |
| 25 | `target_capability_statuses` | List of the distinct `capability_status` values of the covering capabilities, in the target system's list order | `fo_statuses` |
| 26 | `target_requirement_count` | The number of exported requirements across the covering capabilities | `fo_requirement_count` |
| 27 | `summary` | The fit-gap record's summary, the short reasoning behind the verdict | `evidence`, which held prose reasoning |
| 28 | `evidence` | List of the record's evidence links, such as `SRC-4hd8x7k2#p-012` | `evidence` |
| 29 | `evidence_sources` | List of the sources the evidence links name | None |
| 30 | `gap_detail` | The gap detail | `gap_detail` |
| 31 | `migration_note` | The migration note | `migration_note` |
| 32 | `mark_count` | The number of requirement marks on the record | None |
| 33 | `marks_met` | The number of `met` marks | None |
| 34 | `marks_configured` | The number of `configured` marks | None |
| 35 | `marks_unreleased` | The number of `unreleased` marks | None |
| 36 | `marks_partly` | The number of `partly` marks | None |
| 37 | `marks_not_met` | The number of `not-met` marks | None |
| 38 | `mark_summary` | The counts in words, such as "6 of 8 met", where "met" counts `met` and `configured` marks | None |
| 39 | `marks_verdict` | The verdict the marks give under the verdict table in [14 Fit-Gap and Placement](14-fit-gap-and-placement.md). It differs from `verdict` only on a flagged record. | None |
| 40 | `gap_requirement_refs` | The gap list: the `ref` of each baseline requirement whose mark is `partly`, `unreleased` or `not-met`, in requirement `ref` order | None |
| 41 | `gap_requirement_titles` | The titles of the same requirements, in the same order | None |

### Fit-Gap Requirement Columns

There is one row for each requirement mark on each fit-gap record in the fit-gap detail export. A `target-only` record has no marks, so it has no rows. Rows follow the order of the fit-gap detail rows, then requirement `ref` order within each record. For a mark on a capability with no requirements, the `requirement_` columns are empty.

| # | Column | Meaning |
| --- | --- | --- |
| 1 | `comparison_ref` | The comparison's `ref` |
| 2 | `fit_gap_ref` | The fit-gap record's `ref` |
| 3 | `fit_gap_id` | The fit-gap record's `id` |
| 4 | `status` | The fit-gap record's status |
| 5 | `verdict` | The fit-gap record's verdict |
| 6 | `baseline_system_ref` | The baseline system's `ref` |
| 7 | `baseline_system_name` | The baseline system's name |
| 8 | `baseline_capability_ref` | The baseline capability's `ref` |
| 9 | `baseline_capability_id` | The baseline capability's `id` |
| 10 | `baseline_capability_name` | The baseline capability's title |
| 11 | `requirement_ref` | The marked requirement's `ref` |
| 12 | `requirement_id` | The marked requirement's `id` |
| 13 | `requirement_title` | The marked requirement's title |
| 14 | `requirement_kind` | The marked requirement's kind |
| 15 | `mark` | `met`, `configured`, `unreleased`, `partly` or `not-met` |
| 16 | `target_capability_refs` | List of the `ref` values of the target capabilities the mark cites |
| 17 | `target_capability_ids` | List of the same capabilities' `id` values, in the same order |
| 18 | `target_capability_names` | List of the same capabilities' titles, in the same order |
| 19 | `evidence` | List of the mark's evidence links |
| 20 | `evidence_sources` | List of the sources the mark's evidence links name |
| 21 | `note` | The mark's note, which says what is missing or where the agent looked |

### Summary Columns

The summary by verdict has one row for each verdict, in the order `native`, `configurable`, `partial`, `unreleased`, `gap`, `target-only`. Every verdict has a row, even when its count is zero.

| # | Column | Meaning | Example column |
| --- | --- | --- | --- |
| 1 | `comparison_ref` | The comparison's `ref` | None |
| 2 | `verdict` | The verdict this row counts | `verdict` |
| 3 | `fit_gap_count` | The number of fit-gap rows with this verdict | `mapping_count` |
| 4 to 6 | `confidence_high`, `confidence_medium`, `confidence_low` | Those rows counted by confidence | `confidence_high`, `confidence_medium`, `confidence_low` |
| 7 to 11 | `effort_none`, `effort_low`, `effort_medium`, `effort_high`, `effort_unknown` | Those rows counted by effort | `effort_none`, `effort_low`, `effort_medium`, `effort_high`, `effort_unknown` |

The summary by domain has one row for each domain that passes the status filter, in `code` order, even when its count is zero. When some fit-gap rows have no domain, one more row follows with an empty `domain_ref` and `domain_code` and the `domain_name` "No domain". A `baseline-to-target` row counts under its baseline capability's domain. A `target-only` row counts under its target capability's domain.

| # | Column | Meaning | Example column |
| --- | --- | --- | --- |
| 1 | `comparison_ref` | The comparison's `ref` | None |
| 2 | `domain_ref` | The domain's `ref` | None |
| 3 | `domain_code` | The domain's `code` | `layer_code` |
| 4 | `domain_name` | The domain's name | `layer_name` |
| 5 | `fit_gap_count` | The number of fit-gap rows in this domain | `mapping_count` |
| 6 to 11 | `verdict_native`, `verdict_configurable`, `verdict_partial`, `verdict_unreleased`, `verdict_gap`, `verdict_target_only` | Those rows counted by verdict | `verdict_native`, `verdict_configurable`, `verdict_partial`, `verdict_preview_gap`, `verdict_gap`; the example had no column for its `fo_only` rows |
| 12 to 14 | `confidence_high`, `confidence_medium`, `confidence_low` | Those rows counted by confidence | Same names |
| 15 to 19 | `effort_none`, `effort_low`, `effort_medium`, `effort_high`, `effort_unknown` | Those rows counted by effort | Same names |

Requirements:

- In each summary, the verdict, confidence and effort counts of a row each add up to its `fit_gap_count`.
- Across all rows of each summary, `fit_gap_count` adds up to the number of rows in the fit-gap detail CSV of the same run.
- The counts equal the counts that a filter query over the same comparison's fit-gap records returns with the same status filter (see [08 CLI and MCP](08-cli-and-mcp.md)).

### Placement Columns

There is one row for each placement in the comparison that passes the status filter. Rows follow the order of their fit-gap records in the fit-gap detail export. [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) owns the placement rules and the delivery values.

| # | Column | Meaning |
| --- | --- | --- |
| 1 | `comparison_ref` | The comparison's `ref` |
| 2 | `placement_ref` | The placement's `ref` |
| 3 | `placement_id` | The placement's `id` |
| 4 | `status` | The placement's status |
| 5 | `fit_gap_ref` | The fit-gap record's `ref` |
| 6 | `fit_gap_id` | The fit-gap record's `id` |
| 7 | `verdict` | The fit-gap record's verdict |
| 8 | `baseline_capability_ref` | The baseline capability's `ref`; empty for a `target-only` fit-gap record |
| 9 | `baseline_capability_id` | The baseline capability's `id` |
| 10 | `baseline_capability_name` | The baseline capability's title |
| 11 | `target_capability_refs` | List of the fit-gap record's covering capabilities' `ref` values |
| 12 | `target_capability_ids` | List of the same capabilities' `id` values, in the same order |
| 13 | `target_capability_names` | List of the same capabilities' titles, in the same order |
| 14 | `owning_system_ref` | The owning system's `ref` |
| 15 | `owning_system_name` | The owning system's name |
| 16 | `delivery` | `configure`, `extend`, `build` or `integrate` |
| 17 | `integration_refs` | List of the `ref` values of the placement's integration records; empty unless the delivery is `integrate` |
| 18 | `integration_ids` | List of the same records' `id` values, in the same order |
| 19 | `summary` | The placement's summary |
| 20 | `work_items` | List of Make Docs work item IDs |
| 21 | `docs` | List of Make Docs doc paths |

### Integration Columns

There is one row for each integration record that passes the status filter and whose `from_system` or `to_system` is the comparison's target system or one of its baseline systems. `current` rows come first, then `planned` rows. Within each state, rows follow the `from_system` `ref`, then the `to_system` `ref`, then the integration `ref`. [19 System Integrations](19-system-integrations.md) owns what an integration record means.

| # | Column | Meaning |
| --- | --- | --- |
| 1 | `comparison_ref` | The comparison's `ref` |
| 2 | `integration_ref` | The integration's `ref` |
| 3 | `integration_id` | The integration's `id` |
| 4 | `status` | The integration's record status |
| 5 | `title` | The integration's title |
| 6 | `state` | `current` or `planned` |
| 7 | `from_system_ref` | The `ref` of the system the flow leaves |
| 8 | `from_system_name` | That system's name |
| 9 | `from_capability_refs` | List of the `ref` values of the capabilities on the `from` side |
| 10 | `from_capability_ids` | List of the same capabilities' `id` values, in the same order |
| 11 | `from_capability_names` | List of the same capabilities' titles, in the same order |
| 12 | `to_system_ref` | The `ref` of the system the flow enters |
| 13 | `to_system_name` | That system's name |
| 14 | `to_capability_refs` | List of the `ref` values of the capabilities on the `to` side |
| 15 | `to_capability_ids` | List of the same capabilities' `id` values, in the same order |
| 16 | `to_capability_names` | List of the same capabilities' titles, in the same order |
| 17 | `payload` | The data or event that moves |
| 18 | `trigger` | `on-change`, `schedule` or `on-request` |
| 19 | `frequency` | The timing in words, such as nightly |
| 20 | `method` | The method code, such as `api` or `file` |
| 21 | `effort` | The effort of a planned integration |
| 22 | `replaces_refs` | For a planned integration, list of the `ref` values of the current integrations it replaces |
| 23 | `replaces_ids` | List of the same integrations' `id` values, in the same order |
| 24 | `replaced_by_refs` | For a current integration, list of the `ref` values of the exported planned integrations that replace it. An empty cell means that no planned integration replaces it. |
| 25 | `summary` | The integration's summary |
| 26 | `evidence` | List of the integration's evidence links |
| 27 | `evidence_sources` | List of the sources the evidence links name |
| 28 | `work_items` | List of Make Docs work item IDs |
| 29 | `docs` | List of Make Docs doc paths |

### Capability Columns

There is one row for each capability of the system that passes the status filter. Rows follow the capability tree: each top capability in `ref` order, followed by its children in `ref` order, depth first. A capability whose parent is not in the export follows the top capabilities in `ref` order and keeps its `parent_ref`.

| # | Column | Meaning | Example column |
| --- | --- | --- | --- |
| 1 | `system_ref` | The system's `ref` | None |
| 2 | `system_name` | The system's name | None |
| 3 | `capability_ref` | The capability's `ref` | `capability_id` |
| 4 | `capability_id` | The capability's `id` | `capability_id` |
| 5 | `level` | The depth in the tree, where a top capability is 1 | None |
| 6 | `parent_ref` | The parent capability's `ref` | `parent_id` |
| 7 | `parent_id` | The parent capability's `id` | `parent_id` |
| 8 | `name` | The capability's title | `name` |
| 9 | `status` | The record status | None |
| 10 | `capability_status` | The value from the system's own status list | `status` |
| 11 | `domain_ref` | The domain's `ref` | `layer_id` |
| 12 | `domain_code` | The domain's `code` | `layer_code` |
| 13 | `domain_name` | The domain's name | `layer_name` |
| 14 | `summary` | The capability's summary | `summary` |
| 15 | `requirement_count` | The number of exported requirements of the capability | `requirement_count` |
| 16 | `evidence` | List of evidence links | `provenance` |
| 17 | `evidence_sources` | List of the sources the evidence links name | `source` |
| 18 | `tags` | List of tags | `tags` |
| 19 | `section_number` | The capability's section number in the system's capability model document, such as `3.2` | `doc_ref` |
| 20 | `capability_type` | The capability type code | `capability_type` |
| 21 | `triggers` | List of what starts the capability | `triggers` |
| 22 | `outcomes` | List of what the capability produces | `outcomes` |
| 23 | `entities` | List of the business entities the capability works on | `entities` |
| 24 | `depends_on_refs` | List of the `ref` values of the capabilities in the same system that this one depends on | `dependencies` |
| 25 | `depends_on_ids` | List of the same capabilities' `id` values, in the same order | `dependencies` |
| 26 | `owners` | List of the `maintainer` slugs in `owners` | None |
| 27 | `stakeholders` | List of the `maintainer` slugs in `stakeholders` | None |
| 28 | `audience` | List of the `user` slugs in `audience` | `personas` |

Columns 20 to 25 and 28 come from the optional capability fields in [11 Record Types Reference](11-record-types-reference.md), and `owners` and `stakeholders` from the common fields in [10 Records and Identity](10-records-and-identity.md). The slugs name entries in `.make/personas.yaml`. A field that is not set gives an empty cell.

### Requirement Columns

There is one row for each requirement of the system's capabilities that passes the status filter. Rows follow the capability order of the capability export, then requirement `ref` order within each capability.

| # | Column | Meaning | Example column |
| --- | --- | --- | --- |
| 1 | `system_ref` | The system's `ref` | None |
| 2 | `system_name` | The system's name | None |
| 3 | `requirement_ref` | The requirement's `ref` | `requirement_id` |
| 4 | `requirement_id` | The requirement's `id` | `requirement_id` |
| 5 | `capability_ref` | The capability's `ref` | `capability_id` |
| 6 | `capability_id` | The capability's `id` | `capability_id` |
| 7 | `capability_name` | The capability's title | `capability_name` |
| 8 | `domain_ref` | The capability's domain `ref` | `layer_id` |
| 9 | `domain_code` | That domain's `code` | `layer_code` |
| 10 | `domain_name` | That domain's name | `layer_name` |
| 11 | `kind` | `setting`, `rule`, `behavior`, `data` or `dependency` | `requirement_kind` |
| 12 | `status` | The record status | `status` |
| 13 | `title` | The requirement's title | `text` |
| 14 | `summary` | The requirement's summary | `text` |
| 15 | `evidence` | List of evidence links | `doc_ref` |
| 16 | `evidence_sources` | List of the sources the evidence links name | None |
| 17 | `tags` | List of tags | None |
| 18 | `option_values` | For a `setting` requirement, list of the values the setting allows | `option_values` |
| 19 | `option_default` | For a `setting` requirement, the default value | `option_default` |
| 20 | `option_scope` | For a `setting` requirement, the scope code | `option_scope` |
| 21 | `owners` | List of the `maintainer` slugs in `owners` | None |
| 22 | `stakeholders` | List of the `maintainer` slugs in `stakeholders` | None |
| 23 | `audience` | List of the `user` slugs in `audience` | None |

The option columns are empty for requirements of other kinds.

### Column Parity with the Example

The column tables above are the parity map. Each column of the example fit-gap detail, summaries, capability and requirement files maps to one or more export columns. The example capability column `doc_ref` held a section reference into the narrative document, so it maps to `section_number`.

The fit-gap requirements, placements and integrations files have no column map. The example placement file used delivery dispositions with system suffixes and several system roles, which [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) maps to one owning system, one delivery value and the integration records of an `integrate` placement.

Requirements:

- An automated test builds synthetic records shaped like the example fit-gap, runs a comparison export, and checks that every column of the example files has its mapped export column, in the order listed.
- The same test checks the value maps: `ce_to_fo` to `baseline-to-target`, `fo_only` to `target-only` for both direction and verdict, and `preview_gap` to `unreleased`.
- The test compares columns and values, never client rows. No client data enters the test fixtures.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 9: identity; section 10: data model for v2.0; section 13: exports; section 16: Q-038, Q-058, Q-062, Q-064, Q-069, Q-070, Q-073 and D-011; Human Experience Intent: evidence required, fit-gap export test)
- `blueprint/exports/<comparison-ref>-fit-gap.csv`
- `blueprint/exports/<comparison-ref>-fit-gap-requirements.csv`
- `blueprint/exports/<comparison-ref>-fit-gap-by-verdict.csv`
- `blueprint/exports/<comparison-ref>-fit-gap-by-domain.csv`
- `blueprint/exports/<comparison-ref>-placements.csv`
- `blueprint/exports/<comparison-ref>-integrations.csv`
- `blueprint/exports/<comparison-ref>-data-dictionary.md`
- `blueprint/exports/<comparison-ref>-fit-gap.xlsx`
- `blueprint/exports/<system-ref>-capabilities.csv`
- `blueprint/exports/<system-ref>-requirements.csv`
- `blueprint/exports/<system-ref>-capability-model.md`
- `blueprint/exports/<system-ref>-data-dictionary.md`

## Integrations

| Party | What exports need from it, or give to it | Owner |
| --- | --- | --- |
| Fit-gap and placement | Comparison, fit-gap and placement records, requirement marks and the verdict table, their rules, and the meaning of each verdict, confidence, effort, mark and delivery value shown on the `about` sheet | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| System integrations | Integration records, which integrations touch a comparison, and the meaning of each integration value | [19 System Integrations](19-system-integrations.md) |
| Records and identity | `id`, `ref`, record statuses, facets and the `owners` and `stakeholders` fields, which drive file names, the status filter, facet columns and people columns | [10 Records and Identity](10-records-and-identity.md) |
| Record types | The fields behind every column | [11 Record Types Reference](11-record-types-reference.md) |
| Source intake | Source `ref` values and titles for `evidence_sources`. Converted CSV files use the same CSV rules and writer. | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| Storage and indexing | Exports read records through the storage interface and the local index, and write no records | [09 Storage and Indexing](09-storage-and-indexing.md) |
| Project layout | The `blueprint/exports/` folder, its router files, whether git tracks the folder, and the project `name` in `.make/config.yaml` that titles use | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| CLI and MCP | The `run export` commands and options, the export MCP tool, `allowWrite`, and the filter queries whose counts the summaries match | [08 CLI and MCP](08-cli-and-mcp.md) |
| Installation and distribution | The CSV, Markdown and xlsx writers ship inside the npm package and the signed single file, with no Python and no outside tool | [07 Installation and Distribution](07-installation-and-distribution.md) |
| Skills | The `blueprint-report` skill drafts the prose that exports read from records, with a checklist that matches the export layout, and runs the exports. The compare and place skills do not run exports. | [16 Workflow and Skills](16-workflow-and-skills.md) |
| Local server and UI | v2.1 fit-gap views use the same row and count definitions, so a view's totals match the summaries | [18 Local Server and UI](18-local-server-and-ui.md) |
| Make Docs | Owns backlog exports, such as the Azure Boards export. Make Blueprint exports no backlog. | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 6: runtime and distribution; section 12: relationship with Make Docs; section 14: UI)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md`
- `blueprint/exports/`

## Rebuild Notes

What a rebuild must preserve:

- Exports are output only. The records are the truth, every run rebuilds files from records, and nothing reads a file back. A rebuild that lets a person edit an export and "sync" it back breaks this rule.
- Every file, prose included, comes from records and the export format version alone. A rebuild that lets a skill or an agent write an export file at export time breaks byte-identical output. Prose is drafted into records first and goes through review.
- The fit-gap detail keeps every column of the example fit-gap, under baseline and target names. Parity is about columns and values, not rows.
- The example's `evidence` column held long prose with no source references. In Make Blueprint, `evidence` holds required links to anchors, and the prose goes to `summary`. A parity test must not expect prose in `evidence`.
- The example's summary by layer had no column for its `fo_only` rows. The summary by domain has `verdict_target_only`, so every row's verdict counts add up to its `fit_gap_count`.

Where implementers are likely to make mistakes:

- **Byte order mark.** Excel needs the BOM to read UTF-8 CSV files correctly. Some program readers then see the BOM as part of the first column name, so programs should read the files with BOM-aware decoding. The example files were not consistent: some had a BOM and some did not.
- **Locale delimiters.** In locales where the decimal mark is a comma, Excel expects semicolons when a person double-clicks a CSV file, so a comma file opens in one column. Do not switch the delimiter by machine; that breaks byte-identical output. Do not write a `sep=` hint line; other readers then show it as data. The workbook is the file that opens correctly in every locale.
- **Formula-like text.** A text value that starts with `=`, `+`, `-` or `@` can run as a formula when a spreadsheet app opens a CSV file. The workbook is safe because it writes text cells. CSV files keep such values exact, because a changed value breaks exact data. The run output warns about them and points the reader to the workbook. Do not prefix or quote such values to hide them.
- **Section numbers.** The capability CSV's `section_number` and the capability model document must take the number from one computation, or the export check fails.
- **Verdicts that differ from their marks.** The export shows the stored verdict and the verdict the marks give, and warns. It never changes the stored verdict.
- **Reverse links.** `replaced_by_refs` is worked out at run time from the planned integrations' `replaces` lists. It is never stored on a current integration record.
- **Stable workbooks.** An xlsx file is a zip archive. Its entry times and document properties change on every run unless the writer fixes them, which breaks byte-identical output.
- **Excel limits.** A cell holds at most 32,767 characters, and a sheet name at most 31 characters with no `:`, `\`, `/`, `?`, `*`, `[` or `]`. Sheet names built from `ref` values stay short and safe.
- **Router files.** `blueprint/exports/` holds router files. A full run that empties the folder before writing deletes them.
- **Refs in file names.** A ref fix changes file names. The old files remain until the next full run deletes them as stale export files.

Code anchors:

- `<user-home>/Developer/Agents/BuildOS/workspace/datasets/ce-fo-fit-gap-normalized.csv` (column set only)
- `<user-home>/Developer/Agents/BuildOS/workspace/datasets/ce-fo-fit-gap-verdict-summary-normalized.csv` (column set only)
- `<user-home>/Developer/Agents/BuildOS/workspace/datasets/ce-fo-fit-gap-layer-summary-normalized.csv` (column set only)
- `<user-home>/Developer/Agents/BuildOS/workspace/datasets/fo-rental-capabilities-normalized.csv` (column set only)
- `<user-home>/Developer/Agents/BuildOS/workspace/datasets/fo-rental-requirements-normalized.csv` (column set only)

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/07-analysis-and-exports.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/04-analysis-exports-and-integrations.md`
- `docs/prd/03-open-questions-and-risk-register.md`
- `<user-home>/Developer/Agents/BuildOS/workspace/datasets/ce-fo-fit-gap-normalized.csv`
- `<user-home>/Developer/Agents/BuildOS/workspace/datasets/ce-fo-fit-gap-verdict-summary-normalized.csv`
- `<user-home>/Developer/Agents/BuildOS/workspace/datasets/ce-fo-fit-gap-layer-summary-normalized.csv`
