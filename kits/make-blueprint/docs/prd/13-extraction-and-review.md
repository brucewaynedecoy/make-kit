---
title: "13 Extraction and Review"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 13 Extraction and Review

## Purpose

Make Blueprint turns converted sources into trusted records in two steps. In extraction, an agent works through one source at a time and turns what it says into draft records, each with evidence links to exact places in that source. Those drafts include `integration` drafts for the integrations between systems that are in place today. In review, a person, or an agent acting for one, makes each draft `active` or `rejected`. Only `active` records feed the later stages: model, compare, place and hand off.

This subsystem owns the extraction unit, the order in which sources are handed out, the extraction record with its coverage and outcome for each part of a source, duplicate hints, draft records, pending changes to `active` records, review, the optional second reviewer, and the extraction numbers that `project status` shows. It is the guided bulk extraction that large projects need. Many sources are worked through one at a time, by one agent or by several in parallel, with every step recorded in records rather than in side files.

## Scope

This PRD covers:

- The extraction unit: one source.
- `run extract next` and the order in which it hands out sources.
- The extraction record, with coverage and outcome for each part of the source.
- Duplicate hints shown before a new record is created.
- Draft records created by extraction, including `integration` drafts for current integrations.
- Pending changes that fix a fact on an `active` record in place, and their review.
- Review of drafts to `active` or `rejected`.
- Review of agent conversions of complex PDFs, which accepts the text or sends pages back to the agent.
- Approval of many drafts at once, in batches that are each one journaled change.
- The project setting that turns a second reviewer on or off.
- The extraction read model that feeds `project status`.

These subjects are covered elsewhere:

- Source records, converted text, parts, anchors and anchor resolution belong to [12 Source Intake and Conversion](12-source-intake-and-conversion.md).
- Common record fields, statuses, `id` and `ref`, evidence link validation and `project check` belong to [10 Records and Identity](10-records-and-identity.md).
- The full field reference for the extraction record and the other record types belongs to [11 Record Types Reference](11-record-types-reference.md).
- The write journal, the short lock and crash recovery belong to [09 Storage and Indexing](09-storage-and-indexing.md).
- The command grammar, the full `run extract` and `run review` verb lists, the filter syntax, the MCP tool list and the `project status` output belong to [08 CLI and MCP](08-cli-and-mcp.md).
- Cleaning up systems, capabilities and domains after review, the drafts that compare, `target-only` generation and place create, the fit-gap rubric and the fit-gap consistency checks belong to [14 Fit-Gap and Placement](14-fit-gap-and-placement.md).
- Integration records, planned integrations and how comparisons and placements use integrations belong to [19 System Integrations](19-system-integrations.md).
- The shared people and roles file `.make/personas.yaml`, and the shared core that writes it, belong to [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- The extract and review skills belong to [16 Workflow and Skills](16-workflow-and-skills.md).
- How v1 extraction files are imported belongs to [17 v1 Import](17-v1-import.md).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 10: extraction record type; section 11: extraction, review and bulk extraction; section 16: Q-020, Q-032, Q-033, Q-034, Q-041, Q-048, Q-061, Q-065, Q-072, Q-073, Q-077 and Q-080)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/06-extraction-and-review.md`
- `blueprint/records/extraction/<id>.md`

## Component and Capability Map

| Component | What it does | Release |
| --- | --- | --- |
| Extraction queue | `run extract next` picks the next source that needs work and opens an extraction for it | v2.0 |
| Extraction record | Tracks one pass over one source: who ran it, the source hash, coverage and outcome for each part, and the records it created or updated | v2.0 |
| Duplicate hints | Shows likely matches from the index before a new record is created by `run extract add` or `run record create` | v2.0 |
| Draft writer | Creates draft records with evidence links into the extraction's source, and adds evidence to existing records | v2.0 |
| Pending changes | Hold a proposed fix to a fact on an `active` record until review approves or rejects it | v2.0 |
| Finish check | Confirms that every part has coverage and an outcome before an extraction is finished | v2.0 |
| Review | Lists drafts, shows each one with its evidence text, makes drafts `active` or `rejected`, and decides pending changes and agent conversions | v2.0 |
| Second reviewer gate | When the project turns it on, stops the person who ran an extraction from approving its drafts | v2.0 |
| Extraction read model | Returns the extraction and review counts that `project status` shows | v2.0 |

Each command named below is a `run extract` or `run review` verb, except `run record create`. [08 CLI and MCP](08-cli-and-mcp.md) publishes the full verb list. Extraction and review tools sit in the `extract` MCP profile. `run review list`, `run review show`, `run review approve` and `run review reject` also sit in the `analyze` profile, because the drafts that analysis creates go through the same review. The review of pending changes sits in the same profiles as review. Write tools need `allowWrite`.

### The Extraction Unit

The unit of extraction work is one source. One extraction is one pass over one source at one version of its original. The extraction covers every part of the source, such as every sheet of a workbook or every slide of a deck, so nothing in the source is skipped without a recorded reason.

Requirements:

- Each extraction names exactly one source and the hash of its original when the extraction opened, in `source_sha256`.
- A source has at most one open extraction at a time.
- An open extraction is tied to one version of its source. When the original changes while the extraction is open, the CLI refuses new drafts and new evidence for that extraction, says the source changed, and names the ways out: finish the extraction as blocked, or convert the source again and start a new extraction.
- The extraction record names who ran it, in `extracted_by`. `run extract next` takes that name from the caller and stops with a clear message when none is given.

### Handing Out the Next Source

`run extract next` hands out one source and opens an extraction for it. Calling it again hands out the next one. One agent can work through a whole project this way, and several agents can work in parallel, because each call hands out a different source.

A source is ready when its conversion status is `converted`, its converted text is on this machine, it has no open extraction, and its latest extraction did not end blocked. A ready source is due when it has never been extracted, when its latest finished extraction left a part with coverage `partial` (partly extracted), or when its current hash differs from the `source_sha256` of its latest finished extraction (changed since extraction).

An agent conversion of a complex PDF is not ready while its `conversion_status` is `agent-in-progress` or `awaiting-review` (see [12 Source Intake and Conversion](12-source-intake-and-conversion.md#agent-conversion-for-complex-pdfs)). Extraction reads agent text only after review accepts it.

Requirements:

- `run extract next` hands out only sources whose `conversion_status` is `converted`, also when the caller names one.
- `run extract next` hands out exactly one due source, in this order: first sources that have never been extracted, then partly extracted sources, then sources that changed since their latest extraction. Within each group, the oldest source comes first, by `created_at` and then by `id`.
- When a partly extracted source is handed out again at the same hash, each part that the earlier extraction covered in full starts with that coverage and outcome, and its note names the earlier extraction. The finish check accepts such a carried part on the strength of the earlier extraction's records.
- The shared filter syntax narrows the pool, for example to sources with one facet value or under one folder of `blueprint/sources/`.
- A caller can name one source instead. Naming a source hands it out even when its latest extraction ended blocked, as long as it is converted, its converted text is on this machine, and it has no open extraction.
- When the caller already has an open extraction, matched by its `extracted_by` name, `run extract next` returns that extraction so the caller resumes it, and opens nothing new. Agents that work in parallel each give their own name.
- `run extract next` opens the extraction under the short write lock, so two calls in one working copy never hand out the same source.
- The call returns the extraction `ref`, the source `ref` and title, the converted text path, the parts of the source with their anchors, and the number of existing records that already cite this source.
- When no source is due, the call writes nothing and says why. It names the next useful action, such as resuming an open extraction, reviewing drafts, or supplying text for sources that need it.
- `run extract show` returns an open or finished extraction with its parts, coverage so far and records, so an agent can resume work in a new session.

### Drafts and Evidence

Extraction creates draft records. A draft is a normal record file at `blueprint/records/<type>/<id>.md` with `status: draft`. It has its `id` and `ref` from the moment it is created, and it shows in queries and in `git diff` like any other record. There is no staging folder and no second copy.

Requirements:

- `run extract add` creates a draft of type system, domain, capability, requirement, persona, integration or finding inside an open extraction.
- An `integration` draft from extraction records an integration that is in place today, so its `state` is `current`. Like every other draft, it carries evidence. Planned integrations come from analysis, not from extraction (see [19 System Integrations](19-system-integrations.md)).
- Every draft created in an extraction carries at least one evidence link to the extraction's source. Each anchor or table position must resolve in the current converted text, which is the main Markdown file or one of its table CSV files, when the draft is created. The draft may carry more evidence links, including links to other sources.
- A draft keeps the links its type needs, such as a requirement's link to its capability. The record it links to may itself be a draft from the same or another extraction.
- Open questions found in a source become finding drafts with `kind` set to `question`, so they are tracked, reviewed and queried like any other record.
- `run extract link` adds an evidence link from the extraction's source to an existing record, draft or `active`, without changing its status or other fields. The extraction lists that record as `updated`. `run extract link` only adds evidence. It never changes a fact on a record.
- Extraction never changes the content or status of an `active` record other than by adding evidence.
- Each draft creation and each evidence link adds an entry to the extraction's `records` list.

A pending change is a proposed fix to a fact on an `active` record, held until review decides it. Facts on `active` records are fixed in place this way, in the same record file. Separately, the model stage merges and cleans up systems, capabilities and domains (see [14 Fit-Gap and Placement](14-fit-gap-and-placement.md)).

Pending changes follow these rules:

- To fix a fact on an `active` record, a person or agent proposes a pending change on that record. The record stays `active` and keeps its old value until review decides the change.
- When review approves the change, it is written into the same record file. The `id`, the `ref` and every link stay the same, and git history keeps the old value.
- When review rejects the change, the record stays unchanged, and the reason for the rejection is kept.
- `run record supersede` is only for real replacements, such as one requirement that splits into two. It is never the way to fix a fact.
- Where a pending change is stored, and the exact commands that propose and review it, are designed before work phase 06 ends. [10 Records and Identity](10-records-and-identity.md) owns the status rules for pending changes.

### Duplicate Hints

Before the CLI creates a new record, inside an extraction through `run extract add` or outside one through `run record create`, it shows records that may already describe the same thing. The agent or person then decides, with that list in view, whether to create the new record or to add evidence to an existing one.

Requirements:

- On each `run extract add` and each `run record create`, the CLI makes the same hint call. It searches the index for records of the same type whose title, summary or aliases are close to the new record's. For capabilities and requirements, it also weighs records under the same system or the same capability. The search uses the index text search, with the one matching rule and stable score that [09 Storage and Indexing](09-storage-and-indexing.md) defines.
- Hints include `draft`, `active` and `rejected` records. A rejected record is marked as rejected, so an agent does not create again what a reviewer turned down.
- Each hint shows the record's `ref`, title, type, status and why it matched.
- When hints exist, the first call writes nothing and returns the hints. A repeat call that names the hints it considered creates the record. When there are no hints, the call creates the record at once.
- Hints never merge, link or reject anything by themselves.
- Review shows each draft's duplicate hints again, worked out from the index at review time.

### Coverage and Outcome per Part

An extraction record lists every part of its source, copied from the converted text when the extraction opens. For each part, the agent records how much it read and what came out of it.

| Field | Values | Meaning |
| --- | --- | --- |
| Coverage | `none`, `partial`, `full` | How much of the part the agent read. `partial` means some of the part still needs reading, so the source comes back through `run extract next`. A part read in full that holds nothing useful is `full` with outcome `no-records`. |
| Outcome | `records`, `no-records`, `blocked` | Whether the part produced records, held nothing to extract, or could not be worked |
| Note | Text | What was not read, why the part held nothing, or what blocked it |

Requirements:

- `run extract part` records the coverage, outcome and note for one part.
- A part with coverage `partial`, or outcome `no-records` or `blocked`, needs a note.
- A part with coverage `none` can only have outcome `blocked`.
- A part with outcome `records` must have at least one record in the extraction's `records` list whose evidence points into that part. A part with outcome `no-records` must have none.
- The CLI works out which part an anchor belongs to from its position in the converted text. Anchors resolve in the main Markdown file or in its table CSV files.
- A table position, such as `#t-001:r-0012:c-003`, belongs to the part that holds the table anchor `t-001`. A part may start at a table anchor, as the one part of a csv original does (see [12 Source Intake and Conversion](12-source-intake-and-conversion.md)).

### Finishing an Extraction

Requirements:

- `run extract finish` refuses while any part has no coverage or no outcome, or while any part breaks the rules above. It lists each problem by part label.
- On finish, the extraction's `outcome` becomes `blocked` when any part is blocked, `records` when the `records` list has entries, and `no-records` otherwise.
- On finish, the source's `extraction_status` becomes `blocked` or `extracted` to match.
- A finished extraction stays `draft` until review (see [Review](#review)).
- An agent that stops part way leaves the extraction open. `project status` lists open extractions so a person or agent can resume one, through `run extract next` under the same name or `run extract show`, or finish it as blocked.

### Review

Review makes drafts trusted. A reviewer reads each draft beside the source text its evidence points to, and approves or rejects it. Any draft can be reviewed, whether extraction created it, analysis created it through compare, `target-only` generation or place (see [14 Fit-Gap and Placement](14-fit-gap-and-placement.md)), or a person created it by hand. Review also decides pending changes to `active` records (see [Drafts and Evidence](#drafts-and-evidence)).

Agent conversions go through review too. An agent conversion is converted text that an agent wrote for a complex PDF through the agent route in [12 Source Intake and Conversion](12-source-intake-and-conversion.md#agent-conversion-for-complex-pdfs). It waits for review with the `conversion_status` `awaiting-review`. Agent conversions are reviewed like drafts, with "unchecked" and flagged pages shown first. An "unchecked" page has no text layer, so the CLI could not check it. A flagged page has a value that the CLI's text-layer check found missing or invented. The source record stays `active` throughout, because review decides its converted text, not the record. Built-in conversions still skip review.

Requirements:

- `run review list` lists drafts waiting for review. Extraction drafts are grouped by extraction, and analysis drafts by comparison, each group then by type. Drafts made outside an extraction or a comparison appear in their own group. Each entry shows `ref`, title, type and the number of evidence links.
- `run review list` shows flagged records first: the records that the fit-gap consistency checks in [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) flag.
- `run review show` shows one draft with each evidence link resolved to its source text (see [12 Source Intake and Conversion](12-source-intake-and-conversion.md)), its current duplicate hints, and the records it links to. For a fit-gap draft, it also gives the written fit-gap rubric from [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), the same rubric the compare skill shows.
- `run review approve` makes drafts `active`. `run review reject` makes drafts `rejected` and needs a short reason. The CLI appends the reason, with the reviewer's name and the date, to the end of each rejected record's body. No front matter field holds it (see [11 Record Types Reference](11-record-types-reference.md#common-fields-and-field-order)).
- Both commands take one draft, a list of drafts, every draft from one extraction, or a filter.
- Both commands record the reviewer's name. When the caller gives none, the command stops and asks for one. The name is a `maintainer` slug from `.make/personas.yaml` when one exists for the reviewer. Free text is still allowed, and `project check` reports it as information with the code `name-not-slug` (see the [Check Catalog](10-records-and-identity.md#check-catalog) in 10).
- `run review list` also lists sources in `awaiting-review`, in their own group. Each entry shows the source `ref` and title and the number of pages, and names the "unchecked" pages and the flagged pages first.
- `run review show <source>` shows an agent conversion page by page, "unchecked" pages and flagged pages first. Each flag names the value and the page, and each page names its place in the original, so the reviewer can compare the two.
- `run review approve <source>` accepts an agent conversion and sets the source's `conversion_status` to `converted`. Extraction can then use it.
- `run review reject <source>` needs a reason. It sends the named pages, or every page when it names none, back to the agent with that reason, and sets the source's `conversion_status` to `agent-in-progress`. `run source pages-next` then hands those pages out again (see [12 Source Intake and Conversion](12-source-intake-and-conversion.md#agent-conversion-for-complex-pdfs)).
- No other command moves a record from `draft` to `active` or `rejected`.
- Approval refuses to make a record `active` while a record it belongs to, such as its system, its capability or its parent capability, is still `draft`, unless the same command approves both.
- Rejection refuses while other drafts belong to the record being rejected, unless the same command rejects them too. The refusal lists those drafts.
- Rejected records stay as files with their evidence. They are left out of the model, compare and place stages and out of exports, and they still appear in duplicate hints.
- When review makes a persona record `active`, the shared core adds the record's entry to `.make/personas.yaml` as a `user` entry under the slug that the record's `slug` field names (see [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) and [11 Record Types Reference](11-record-types-reference.md)). Make Blueprint's own code only reads that file.
- A finished extraction is itself reviewed. Approving an extraction approves its remaining drafts and then the extraction record, in one command. An extraction with no drafts, such as one that ended `no-records`, is approved this way, so a reviewer confirms its coverage notes.
- When the last draft created by a finished extraction is decided, the extraction record becomes `active` in the same journaled change as that decision.
- When an extraction record becomes `active`, `reviewer` is set to the reviewer of that decision and `reviewed_at` to its time.
- The second reviewer rule applies to approving an extraction record as it does to its drafts.

Work phase 06 plans a Guided Progress Review: a reviewer runs one real-shaped source through extraction and review with an agent and records friction. Automated tests cover the extraction flow, duplicate hints, crashes during approval, and an approved pending change that writes one file with the same `id`.

### Second Reviewer

A second reviewer means that the person or agent who ran an extraction cannot also approve its drafts. Each project turns this on or off.

Requirements:

- The setting lives in the project config in `.make/blueprint/` as `review.second_reviewer`, with the values `true` and `false`. It is `false` when absent.
- When the setting is `true`, `run review approve` refuses to approve a draft created in an extraction when the reviewer's name matches that extraction's `extracted_by`. It says that a second reviewer is needed and names who ran the extraction.
- When the setting is `true`, the person who ran an extraction can still reject its drafts, to withdraw them.
- When the setting is `false`, any reviewer can approve any draft, including the person who ran the extraction.
- The setting does not apply to agent conversions. An agent conversion has no `extracted_by`. The model writes the text, the CLI checks it, and any reviewer can approve it (see [12 Source Intake and Conversion](12-source-intake-and-conversion.md#agent-conversion-for-complex-pdfs)).
- The reviewer's name and `extracted_by` each hold a `maintainer` slug from `.make/personas.yaml` when one exists, so the same person or agent gives the same name each time. Free text is still allowed.
- Names are compared after trimming spaces and ignoring letter case.
- `project status` shows whether the setting is on.

The second reviewer is a recorded process check, not access control. In setup A there are no logins, so Make Blueprint records the names that callers give and does not prove who they are.

### Approval of Many Drafts

Approving a review often changes many records at once: every approved draft, and the extraction record when its review completes. A large approval runs in batches. Each batch is one journaled change and must never stop half done.

Requirements:

- A review command that changes more than one record writes the change in batches. Each batch is one journaled change (see [09 Storage and Indexing](09-storage-and-indexing.md)). After a crash, the next command finishes or undoes the batch that was under way, so no batch is left half done.
- Batches keep the order that the review rules need. A record is approved in the same batch as the records it belongs to, or in a later one. A record is rejected in the same batch as the drafts that belong to it, or in a later one. A stop between batches therefore never leaves an `active` record under a `draft` one, or a draft under a `rejected` one.
- A review command checks every draft it names before it writes anything. If the command refuses any draft, for example because of the second reviewer rule or a draft it depends on, it changes nothing and lists every refusal.
- A large approval that stops before its last batch reports `partial`, with the records that its finished batches changed. Running the same command again carries on with the drafts that are still `draft`.
- The command reports how many records it made `active` or `rejected`, by type, and which extractions completed their review.

### Extraction State in Project Status

`project status` shows extraction progress and drafts waiting for review, with the next useful action. [08 CLI and MCP](08-cli-and-mcp.md) owns that promise and the status output. This subsystem supplies the extraction read model: one read call that returns the counts below, with the same meaning in human and machine output.

| Count | Definition |
| --- | --- |
| Not extracted | Ready sources that have no finished extraction |
| Partly extracted | Ready sources whose latest finished extraction left a part with coverage `partial` |
| Changed since extraction | Ready sources whose current hash differs from their latest finished extraction's `source_sha256` |
| Fully extracted | Sources whose latest extraction ended `records` or `no-records` with every part covered in full, and whose hash has not changed since |
| Open extractions | Extractions whose `outcome` is `open`, each with its source, who runs it, and its parts covered out of the total |
| Blocked sources | Sources whose latest extraction ended `blocked` |
| Parts by coverage | Parts with coverage `full`, `partial` and `none`, across the latest extraction of each source |
| Drafts waiting for review | Records with `status: draft`, by type, not counting extraction records |
| Extractions waiting for review | Finished extractions that are still `draft` |
| Second reviewer | Whether `review.second_reviewer` is on, and when it is, the drafts created in extractions, each of which needs a reviewer other than the person who ran its extraction |

Counts for sources that are not yet converted, need manual text, failed conversion or are missing come from [12 Source Intake and Conversion](12-source-intake-and-conversion.md).

Requirements:

- The read model reads the index and does not open every record file.
- The read model offers these next actions to `project status` when they apply: resume or finish an open extraction, review waiting drafts, extract the next due source, continue a partly extracted source, and look at blocked sources. [08 CLI and MCP](08-cli-and-mcp.md) owns the order in which status names them.
- Automated tests check each count against fixture projects. The status output itself has its Human Experience Review in work phase 08.

### Release Scope

Everything in this PRD is v2.0. The v2.1 web app can show drafts and extraction progress for viewing, sorting and filtering. Approving or rejecting drafts in the web app is editing, which comes after the first UI version (see [18 Local Server and UI](18-local-server-and-ui.md)).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 8: storage, journal; section 11: extraction, review, bulk extraction; Alternatives Considered: staging folder and forced second reviewer)
- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Human Experience Intent: status promise)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/06-extraction-and-review.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/08-mcp-skills-and-status.md`
- `blueprint/records/<type>/<id>.md`
- `.make/blueprint/`

## Contracts and Data

### Extraction Record Fields

An extraction record is a record file at `blueprint/records/extraction/<id>.md` with the common fields from [10 Records and Identity](10-records-and-identity.md) and the fields below. [11 Record Types Reference](11-record-types-reference.md) holds the full field reference.

| Field | Meaning |
| --- | --- |
| `source` | The source record `id` |
| `source_sha256` | The hash of the original when the extraction opened |
| `extracted_by` | The name of the person or agent who ran the extraction |
| `parts` | One entry for each part of the source: its label, the anchor that starts it, which may be a table anchor, its coverage, its outcome and its note |
| `outcome` | `open` while the extraction runs, then `records`, `no-records` or `blocked` |
| `records` | One entry for each record the extraction touched: the record `id` and the action, `created` or `updated` |
| `reviewer` | The reviewer of the last review decision that completed the extraction's review |
| `reviewed_at` | When that decision was made |

Statuses follow the common list. An extraction is `draft` while it is open and while its drafts wait for review, and `active` once its review completes.

### Source Extraction Status

The source record's `extraction_status` field, defined in [12 Source Intake and Conversion](12-source-intake-and-conversion.md), takes these values:

| Value | Meaning |
| --- | --- |
| `not-started` | The source has never had an extraction |
| `in-progress` | The source has an open extraction |
| `extracted` | The latest extraction finished with `records` or `no-records` |
| `blocked` | The latest extraction finished `blocked` |

"Partly extracted" and "changed since extraction" are worked out from the latest extraction and the hashes, and are not stored. `project check` reports a source whose `extraction_status` disagrees with its latest extraction record, and reports a source with more than one open extraction, which can happen when two git branches open an extraction for the same source.

### Review Setting

| Setting | Values | Default | Location |
| --- | --- | --- | --- |
| `review.second_reviewer` | `true`, `false` | `false` | Project config in `.make/blueprint/` (see [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md)) |

### Commands

| Command | What it does | MCP profile |
| --- | --- | --- |
| `run extract next` | Hands out the next due source and opens an extraction | `extract` |
| `run extract show` | Shows an extraction with its parts, coverage and records | `extract`, `core` |
| `run extract add` | Creates a draft inside an open extraction, after duplicate hints | `extract` |
| `run extract link` | Adds evidence from the extraction's source to an existing record | `extract` |
| `run extract part` | Records coverage, outcome and note for one part | `extract` |
| `run extract finish` | Checks every part and finishes the extraction | `extract` |
| `run review list` | Lists drafts, pending changes and agent conversions waiting for review | `extract`, `analyze`, `core` |
| `run review show` | Shows one draft with its evidence text and duplicate hints, or one agent conversion with its "unchecked" and flagged pages first | `extract`, `analyze`, `core` |
| `run review approve` | Makes drafts `active`, or accepts an agent conversion and sets it `converted` | `extract`, `analyze` |
| `run review reject` | Makes drafts `rejected`, with a reason, or sends pages of an agent conversion back to the agent, with a reason | `extract`, `analyze` |
| `run record create` | Creates one `draft` record outside an extraction, after the same duplicate hints as `run extract add`. It refuses the types that have their own create command, `source`, `extraction`, `comparison`, `fit-gap` and `placement`, and names that command, as the [`run record` catalog](08-cli-and-mcp.md#run-record) in 08 lists. | `extract`, `analyze` |

The review of pending changes sits in the same profiles as review. The exact commands that propose and review pending changes are designed before work phase 06 ends. [08 CLI and MCP](08-cli-and-mcp.md) owns the final verb names, the MCP tool names and which profiles list each tool.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 10: data model, extraction; section 16: Q-041 MCP profiles; Left for planning: front matter schema for each record type)
- `blueprint/records/extraction/<id>.md`
- `blueprint/records/source/<id>.md`
- `.make/blueprint/`
- `.make/personas.yaml`

## Integrations

| Integration | Connection |
| --- | --- |
| [12 Source Intake and Conversion](12-source-intake-and-conversion.md) | Supplies converted text, its table CSV files, parts, `run source read` for reading one part at a time, anchor and table position resolution for evidence, and the source counts in status. Extraction sets the source's `extraction_status`. Owns the agent route for complex PDFs, its page batches and its text-layer checks. Review accepts an agent conversion in `awaiting-review` or sends its pages back, and `run extract next` hands out only `converted` sources. |
| [09 Storage and Indexing](09-storage-and-indexing.md) | Opening an extraction and minting each draft's `ref` take the short lock. A large approval runs in batches, and each batch is one journaled change. Duplicate hints use the index text search, and the read model queries the index. |
| [10 Records and Identity](10-records-and-identity.md) | Owns statuses, the status rules for pending changes, `id` and `ref`, evidence link validation, record updates and `project check`. |
| [11 Record Types Reference](11-record-types-reference.md) | Holds the fields and required links for every record type that extraction creates, including the persona record's `slug` and the `integration` type. |
| [08 CLI and MCP](08-cli-and-mcp.md) | Owns the command grammar, the filter syntax, the `extract`, `analyze` and `core` profiles, `allowWrite`, and the `project status` output that shows this read model. |
| [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) | The model stage works on `active` records and cleans up systems, capabilities and domains after review. Compare, `target-only` generation and place create drafts that this review decides. Owns the fit-gap rubric that `run review show` gives and the consistency checks that put flagged records first. |
| [19 System Integrations](19-system-integrations.md) | Owns integration records. Extraction creates `integration` drafts for current integrations, with evidence. |
| [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) | Owns `.make/personas.yaml`. The shared core adds a persona record's entry to it when review approves the record. |
| [16 Workflow and Skills](16-workflow-and-skills.md) | The extract skill and the review skill guide people and agents through this subsystem. |
| [17 v1 Import](17-v1-import.md) | Decides how v1 extraction rows and old bulk-extract files become extraction records, drafts and pending changes. |
| [18 Local Server and UI](18-local-server-and-ui.md) | Shows extraction progress and drafts in v2.1 views. |

Code anchors:

- `docs/prd/02-architecture-overview.md` (Data Flow)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/09-v1-import-and-release.md`

## Rebuild Notes

A clean-room rebuild must preserve these properties:

- Progress lives in records. The extraction record and the draft records hold everything another agent needs to resume, so no step depends on side files, scratch notes or an agent's memory.
- A draft is the record. Approval changes only its status, so its `id`, `ref` and file path stay the same from creation through review, and a reviewer reads the change as one git diff.
- A fix to a fact on an `active` record is a pending change on that same record. Approval writes it into the same file, so the `id`, `ref`, file path and links stay the same, and git history keeps the old value.
- Every claim cites an anchor or a table position, and every part of a source ends with a recorded outcome, so coverage can be checked and not just asserted.
- Bulk approval runs in batches, and each batch is all or nothing, through the journal. A large approval that stops reports `partial` and can be run again.

Places where implementers are likely to make mistakes:

- **Handing out a source twice.** Opening an extraction must happen under the lock. Across git branches it cannot be prevented, so `project check` reports a source with more than one open extraction after a merge.
- **Noisy hints.** Duplicate hints that match too loosely train agents to ignore them. Tune them on real-shaped fixtures, and never let them act on their own.
- **Order of approval.** A requirement approved while its capability is still a draft leaves an `active` record linked to an untrusted one. The dependency rule in [Review](#review) prevents this, and the batch order in [Approval of Many Drafts](#approval-of-many-drafts) keeps it true when a large approval stops between batches.
- **Changed sources.** An extraction must not keep adding evidence after its source changes, because those anchors may now point somewhere else.
- **Counting from files.** Status must read the index. Opening thousands of record files for each status call breaks the flow on large projects.
- **Treating names as identity.** The second reviewer rule compares names. It must not be presented as security.

What this keeps from the old `buildos-bulk-extract` skill, for readers who know it:

- One original source is the unit of work, and every part of it, such as every workbook sheet, is accounted for.
- A per-source record of what was covered and what came out. The extraction record does the job that the v1 source review file in `extractions/` did.
- Each part ends as reviewed with records, holding nothing with a reason, or blocked with a reason.
- A check for existing records before a new one is created.
- Every claim cites an anchor in converted text.
- Nothing is trusted until a review step, and the reviewer is recorded.
- Crash-safe, resumable changes to many records.
- No agent-written scripts, worker briefs or decision files.
- Open questions are kept as finding records of kind `question`.
- Parallel agents work on different sources.

What it drops:

- The Python helper script of 1,434 lines and its subcommands. CLI commands and MCP tools do that work.
- The staging folder `extractions/staging/` and its staged copies of rows. Drafts are real records with `status: draft`.
- Two separate agent tasks with two review formats. One extraction record and one review flow replace them.
- A second reviewer forced on every project. Each project turns it on or off.
- Minting IDs at publication. Records get their `id` and `ref` when they are created.
- A separate publish step after approval. Approval is the step that makes a record trusted.
- Editing converted text during extraction to repair conversion loss. Conversion fixes go through `run source convert` (see [12 Source Intake and Conversion](12-source-intake-and-conversion.md)).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Context: field use so far, Client B; Alternatives Considered: staging folder and forced second reviewer, porting the bulk-extract script)
- `<v1-project>/.agents/skills/buildos-bulk-extract/SKILL.md` (in the client-b-v3 project; reference only)
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/entity-records-contract.md`

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/06-extraction-and-review.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/08-mcp-skills-and-status.md`
- `docs/prd/01-product-overview.md`
- `docs/prd/02-architecture-overview.md`
