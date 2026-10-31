---
title: "14 Fit-Gap and Placement"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 14 Fit-Gap and Placement

## Purpose

This PRD owns the analysis half of the Make Blueprint workflow: the model, compare, place and hand-off stages. After review, a project holds active records about systems, domains and capabilities. Analysis turns those records into answers a client can act on. It shows how well a target system covers each capability of the current systems, which target capabilities have no counterpart, which system should own each capability, how that capability is delivered, and which Make Docs work items carry it forward.

Fit-gap and placement results are records, not agent prose. People and agents query, trace, review and export them like any other record. Every fit-gap record links to evidence in a source, so each verdict can be checked back to the exact place that supports it.

Every capability in this PRD is in the v2.0 release scope unless a line says otherwise. [01 Product Overview](01-product-overview.md) places these stages in the seven-stage workflow, and [02 Architecture Overview](02-architecture-overview.md) shows where they sit in the data flow.

## Scope

Covered here:

- The model stage: merge, re-parent and re-domain operations, the shared domain list, and each system's own status list.
- Comparison records, which name one target system and one or more baseline systems.
- Fit-gap records: their grain, requirement marks and the verdict table, covering capabilities, the meaning of each verdict, confidence, effort, gap detail, migration note and required evidence.
- The fit-gap method: the hand-out of one baseline capability at a time, the written rubric, candidate matches, required fields, consistency checks and out-of-date marks.
- The generation of `target-only` records.
- The coverage read that tells a person what is left to score, place and hand off, including the current integrations that no planned integration replaces.
- Placement records: owning system, delivery value, the integration records of an `integrate` placement, and links to Make Docs work items and docs.
- The hand-off boundary between Make Blueprint and Make Docs.
- The `project check` rules that apply to analysis records.

Covered elsewhere:

- Common fields, record statuses, `id` and `ref`, aliases, facets, the evidence link format and the `project check` command itself: [10 Records and Identity](10-records-and-identity.md).
- The full front matter schema for each record type: [11 Record Types Reference](11-record-types-reference.md).
- Sources, converted text and anchors: [12 Source Intake and Conversion](12-source-intake-and-conversion.md).
- Extraction of systems, domains and capabilities, and the review commands that make drafts `active` or `rejected`: [13 Extraction and Review](13-extraction-and-review.md).
- Export files built from analysis records: [15 Exports](15-exports.md).
- Command names, MCP tool names and the `analyze` profile: [08 CLI and MCP](08-cli-and-mcp.md).
- Locks, the write journal, the record version, the content version and the index text search: [09 Storage and Indexing](09-storage-and-indexing.md).
- The Make Docs link format and how `project check` confirms those links: [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- Integration records, current and planned, and how analysis uses them: [19 System Integrations](19-system-integrations.md).
- The skills for the model, compare, place and hand-off stages: [16 Workflow and Skills](16-workflow-and-skills.md).
- Views of comparisons, fit-gap and placement records in v2.2: [18 Local Server and UI](18-local-server-and-ui.md).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 10: data model for v2.0; section 11: workflow and skills; section 12: relationship with Make Docs; section 16: decisions from the open-question review)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/07-analysis-and-exports.md` (Scope)
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/04-analysis-exports-and-integrations.md` (Updates)
- `blueprint/records/<type>/<id>.md`

## Component and Capability Map

In this PRD, a current record is a record whose status is `draft` or `active`. Records that are `rejected`, `superseded` or `archived` are not current. They never count toward coverage, duplicates or exports.

| Component | Stage | What it does | Main records | Release |
| --- | --- | --- | --- | --- |
| Model operations | Model | Merge, re-parent and re-domain capabilities. Merge systems and domains. Keep the shared domain list and each system's status list in order. | system, domain, capability | v2.0 |
| Comparisons | Compare | Name one target system and one or more baseline systems | comparison | v2.0 |
| Fit-gap scoring | Compare | Hand out one baseline capability at a time and score it against the target system, with a mark for each baseline requirement, a verdict, confidence, effort, gap detail, migration note and evidence | fit-gap | v2.0 |
| Target-only generation | Compare | Create a `target-only` record for each target capability that no fit-gap record uses | fit-gap | v2.0 |
| Coverage read | Compare, Place, Hand off | List what is left to score, to place and to hand off in one comparison, and the current integrations that no planned integration replaces | read only | v2.0 |
| Placement | Place | Record the owning system and the delivery value for one fit-gap record, and the integration records of an `integrate` placement | placement | v2.0 |
| Hand-off links | Hand off | Store Make Docs work item IDs and doc paths on placement records | placement | v2.0 |
| Integration records | Extract, Compare, Place | Record current and planned flows between systems. [19 System Integrations](19-system-integrations.md) owns their behavior. | integration | v2.0 |
| Analysis views | Any stage | View, sort and filter comparisons, fit-gap records and placements in the web app and MCP App views | read only | v2.2, see [18 Local Server and UI](18-local-server-and-ui.md) |

The model, compare and place commands sit in the `run model`, `run compare` and `run place` domains, and their MCP tools sit in the `analyze` profile. Every analysis write tool needs `allowWrite`. [08 CLI and MCP](08-cli-and-mcp.md) owns the verbs and tool names. Commands accept a record's `ref`, `id` or alias, and human output names records by `ref` and title.

### Model Stage

Extraction works one source at a time. The same capability can therefore arrive twice under different names, sit under the wrong parent, or land in the wrong domain. The model stage cleans this up so that systems can be compared fairly. Systems, domains and capabilities come from extraction, or a person creates them directly through the record commands (see [08 CLI and MCP](08-cli-and-mcp.md)).

| Operation | Applies to | Effect |
| --- | --- | --- |
| Merge | Two or more capabilities of one system, two or more systems, or two or more domains | One record survives and keeps its `id`. The other records become `superseded` and name the survivor. Every link to a merged record is rewritten to point at the survivor, and evidence links are combined on the survivor. Looking up a merged record's `ref` finds the superseded record, which names the survivor (see [10 Records and Identity](10-records-and-identity.md)). |
| Re-parent | One or more capabilities | Moves each capability under another capability of the same system, or to the top of that system's tree. Its child capabilities move with it. |
| Re-domain | One or more capabilities | Sets each capability's domain to a domain from the shared domain list, or clears it. |

When systems merge, the capabilities of the merged systems move to the survivor. When domains merge, every capability in a merged domain moves to the survivor.

Requirements:

- A model operation that changes more than one record file is one journaled change. After a crash, the CLI finishes or undoes the whole change (see [09 Storage and Indexing](09-storage-and-indexing.md)).
- A capability merge refuses capabilities from different systems and says why.
- After a merge, no current record links to a record that the merge superseded.
- Re-parent and re-domain each take one or more capabilities in one command: `run model move <capability>...` and `run model set-domain <capability>...`.
- Re-parent refuses a parent in another system and refuses a move that would make a capability its own ancestor.
- `run model move <capability>... --top` moves the capabilities to the top of their system's tree. `--top` and `--parent` cannot be used together, and a command that gives both changes nothing and says why.
- `run model set-domain <capability>... --none` clears the domain of each named capability.
- A system merge refuses to run when a moving capability's `capability_status` is not in the survivor's status list, unless a repeatable `--map-status <old>=<new>` option maps each missing value to a value in that list. The MCP tool takes the same mapping as `statusMap`. The refusal lists the missing values.
- A system merge refuses to run when a comparison would then name the same system as both its target and one of its baselines.
- The output of every model operation names each record it changed by `ref` and title. It also names any fit-gap records that the change turned into duplicates, so the person can resolve them.

### Shared Domain List

A domain is one entry in the project's shared domain list. Each domain has a short `code` and a `name`, such as `BIL` and "Billing". The list belongs to the project, not to one system, so the capabilities of every system use the same domains. That shared list is what lets people group and compare capabilities across systems, and it drives the summary by domain in [15 Exports](15-exports.md). The example fit-gap used 15 shared layer codes in this role.

Requirements:

- Each current domain has a `code` that no other current domain in the project uses. `project check` reports a duplicate code as an error.
- A capability has at most one domain, and that domain is a current domain record. `project check` reports any other value as an error.
- A capability may have no domain. The coverage read lists the active capabilities in a comparison's systems that have no domain, because those capabilities fall into a "No domain" row in the summary by domain.

### System Status Lists

Make Blueprint keeps two kinds of status apart. The record `status` (`draft`, `active`, `rejected`, `superseded` or `archived`) is the same for every record type and says whether the record is trusted. A capability's `capability_status` says how far along the capability is in its own system. Each system defines its own list of these values in its `capability_statuses` field, because systems describe maturity in different words. A custom system that is still being built may use `built`, `in_flight`, `designed` and `sketched`. A vendor product may use `available`, `preview`, `roadmap` and `deferred`.

Requirements:

- A capability's `capability_status` is a value from its own system's `capability_statuses` list. `project check` reports any other value as an error.
- A system may have an empty list. Its capabilities then carry no `capability_status`.
- A command that takes a value out of a system's list refuses to run while capabilities still use that value, unless it is given a mapping to a remaining value. That command is `run record update` on the system, and its repeatable `--map-status <old>=<new>` option, `statusMap` in MCP, gives the mapping. `run model merge` takes the same option for a system merge (see [Model Stage](#model-stage)).
- On a `draft` system, an update with a mapping writes the system and every mapped capability in one journaled change.
- On an `active` system, the update is a pending change, and the pending change keeps the mapping. Approval writes the system and every mapped capability in one journaled change. Until approval, the system and its capabilities keep their old values.

### Comparisons

A comparison names one target system and one or more baseline systems. The target system is the system under study as the future home of the capabilities, such as a vendor product. The baseline systems are the systems whose capabilities the target must cover, such as the client's current systems or a custom solution. One project can hold several comparisons. A system can be the target in one comparison and a baseline in another.

A comparison states the scope a person chose, not a claim from evidence. So `run compare create` makes an `active` comparison that needs no review. The records that a comparison holds are claims from evidence, so fit-gap, `target-only` and placement records still start as `draft` ([Q-034](03-open-questions-and-risk-register.md#q-034-analysis-records-start-as-drafts)).

Requirements:

- `run compare create` creates the comparison with `status: active`.
- A comparison names exactly one `target_system` and at least one system in `baseline_systems`. Each is a current system record, and the target is not one of the baselines. `project check` reports a breach as an error.
- A comparison covers every active capability of each baseline system, parent capabilities included. Each of them needs its own fit-gap record. Scoping a comparison by facet is later scope, not v2.0.
- A command that changes the target system of a comparison refuses to run while current fit-gap records belong to that comparison, and names those records.
- Adding a baseline system to a comparison is allowed. Its active capabilities then appear as unscored in the coverage read.
- A command that drops a baseline system from a comparison refuses to run while current fit-gap records in that comparison score the system's capabilities, and names those records.
- Fit-gap and placement records of one comparison never count toward the coverage or the exports of another comparison.

### Fit-Gap Records

A fit-gap record compares one baseline capability with the whole target system. The grain is the capability, not the requirement. The verdict is backed by a mark for each baseline requirement. Requirements are written in each system's own terms and do not join across systems, while the capability grain worked well in the example fit-gap. One baseline capability is often covered by several target capabilities, so each record lists them in `covering_capabilities`.

Each fit-gap record belongs to one comparison. It has a verdict, a confidence, an effort, a gap detail, a migration note and at least one evidence link. Every record other than a `target-only` record also has requirement marks (see [Requirement Marks](#requirement-marks)). Its summary and Markdown body hold the reasoning behind the verdict.

| Verdict | Meaning | Covering capabilities | Short example |
| --- | --- | --- | --- |
| `native` | The target meets the baseline capability as shipped, with no setup beyond normal use. | One or more | The baseline stores a billing address for each customer. The target has a standard billing address on every customer. |
| `configurable` | The target meets the baseline capability through settings, parameters or setup data, with no code. | One or more | The baseline charges a late fee after 30 days. The target has a late-fee rule with a grace period that a person sets. |
| `partial` | The target covers part of the baseline capability. The rest needs an extension, a build, a process change or another system. | One or more | The baseline routes approvals through three levels. The target supports one approval level. |
| `unreleased` | The target vendor has announced, previewed or planned a capability that would cover the baseline capability, but it is not generally available yet. | One or more, naming the unreleased target capabilities | The baseline needs a mobile inspection app. The target offers one only as a public preview. |
| `gap` | No target capability covers the baseline capability. | None | The baseline runs a customer loyalty program. The target has nothing like it. |
| `target-only` | This verdict does not score a baseline capability. It marks one target capability that no other fit-gap record in the comparison uses. | Exactly one, and no baseline capability | The target includes a supplier self-service portal that no baseline system has. |

| Confidence | Meaning |
| --- | --- |
| `high` | The evidence states the fit directly. |
| `medium` | The evidence supports the verdict, but part of it rests on inference from related material. |
| `low` | The verdict is a working assumption that needs confirmation with the client or the vendor. |

Effort sizes the work needed to deliver the baseline outcome with the target system.

| Effort | Meaning |
| --- | --- |
| `none` | No work beyond normal setup |
| `low` | Small setup or a minor change |
| `medium` | Real design and build work in one area |
| `high` | A major build, a redesign, or work across several areas |
| `unknown` | Not enough information to size the work |

`gap_detail` is plain text that says what is missing or different in the target. It is required for the verdicts `partial`, `unreleased` and `gap`. It carries most of the value of a fit-gap: in the example, 104 of 150 rows were `partial`. For an `unreleased` verdict, it names the release state, such as preview or roadmap, and any known timing.

`migration_note` is plain text that says what moving from the baseline to the target means for data, process or people, such as data that must move, a process step that changes, or training that people need.

Evidence is required. Each fit-gap record carries at least one evidence link in the form `SRC-<code>#<anchor>`, such as `SRC-4hd8x7k2#p-012`, pointing at converted source text. A strong record cites both sides: where the baseline capability is described and where the target's coverage, or lack of it, is described. [10 Records and Identity](10-records-and-identity.md) owns how links are validated, and [12 Source Intake and Conversion](12-source-intake-and-conversion.md) owns anchors and the flag for a changed source.

Requirements:

- The compare commands refuse to create a fit-gap record that has no evidence link, and say why.
- The compare commands create fit-gap records as `draft`. The review commands in [13 Extraction and Review](13-extraction-and-review.md) make them `active` or `rejected`. Approving many records runs in batches, and each batch is one journaled change.
- A comparison holds at most one current fit-gap record for each baseline capability.
- The record rules in [Analysis Check Rules](#analysis-check-rules) hold for every current fit-gap record.

#### Requirement Marks

A requirement mark records how the target meets one baseline requirement. It answers one question: does the target meet this requirement? A mark is about the baseline requirement only. It never names or matches a target requirement, because requirements do not join across systems. The marks sit in a list inside the fit-gap record, `requirement_marks`. They support the verdict and are not a second grain. [11 Record Types Reference](11-record-types-reference.md) defines the fields of one mark.

| Mark | Meaning |
| --- | --- |
| `met` | The target meets the requirement as shipped, with no setup beyond normal use. |
| `configured` | The target meets the requirement through settings, parameters or setup data, with no code. |
| `unreleased` | The target meets the requirement only through a capability that the vendor has announced, previewed or planned but has not made generally available. |
| `partly` | The target meets part of the requirement. |
| `not-met` | The target does not meet the requirement. |

The verdict follows from the marks by this table:

| Marks on the record | Verdict |
| --- | --- |
| Every mark is `met` | `native` |
| Every mark is `met` or `configured`, and at least one is `configured` | `configurable` |
| Every mark is `met`, `configured` or `unreleased`, and at least one is `unreleased` | `unreleased` |
| Every mark is `not-met` | `gap` |
| Any other mix of marks | `partial` |

Requirements:

- A fit-gap record other than `target-only` has one mark for each active requirement of its baseline capability. This holds for every verdict, `native` and `configurable` included. A wrong `native` verdict costs the most, because nobody looks at it again.
- A baseline capability with no active requirements gets one mark for the capability as a whole.
- A `target-only` record has no marks, because it scores no baseline capability.
- Each mark keeps, in its `version` field, the content version of the requirement or capability it marked. A content version is a hash of the fields that carry a requirement's or a capability's meaning, such as its title, summary and body. Tags, facets, `owners`, `stakeholders`, `audience`, links, evidence and timestamps do not change it. [09 Storage and Indexing](09-storage-and-indexing.md#storage-interface) defines the content version and the separate record version, which guards writes only.
- A mark other than `not-met` cites the target capabilities that meet the requirement, source evidence links that show it, or both. A mark never cites a target requirement.
- Every target capability that a mark names is also in the record's `covering_capabilities`, so target-only generation never takes a capability that meets a mark for unused. The compare commands refuse a draft that breaks this and name each missing capability. `project check` reports a stored record that breaks it as the Error `mark-capability-uncovered` (see the [Check Catalog](10-records-and-identity.md#check-catalog) in 10).
- A `not-met` mark carries a short note that says where the agent looked, because an absence cannot be linked.
- A record's verdict is the verdict its marks give. `project check` flags a record whose verdict differs, and the exports show the difference (see [15 Exports](15-exports.md)).

#### The Fit-Gap Method

The CLI controls the fit-gap method, so every run follows the same steps, and the compare skill follows those steps (see [16 Workflow and Skills](16-workflow-and-skills.md)). The baseline pass scores every baseline capability in the comparison. The target-only pass follows it (see [Target-Only Generation](#target-only-generation)).

`run compare next` hands out one baseline capability at a time. With each one it returns the capability's `ref`, title, summary and evidence, its active requirements with their content versions, the capability's own content version when it has no active requirement, and candidate target matches. Progress lives in the fit-gap records, so work resumes in a new session with the next call, and no capability is skipped.

A written rubric fixes when each mark value, verdict, confidence and effort value applies. Make Blueprint ships the rubric, and it is written from the tables in this section and never contradicts them. The compare skill and the review of fit-gap drafts (see [13 Extraction and Review](13-extraction-and-review.md)) show the same rubric, so the agent who scores and the person who reviews judge by the same words.

Requirements:

- `run compare next` hands out baseline capabilities that have no current fit-gap record first, then capabilities whose fit-gap record has out-of-date marks. Parent capabilities are handed out like any other.
- When no capability is left to hand out, `run compare next` writes nothing, says so, and names the next useful action, such as the target-only pass or review.
- Candidate target matches come from the index text search (see [09 Storage and Indexing](09-storage-and-indexing.md)), with the same matching rule as the duplicate hints in [13 Extraction and Review](13-extraction-and-review.md). The search reads target capability names, summaries and requirement text, and lists target capabilities in the baseline capability's domain first.
- Candidates are hints only. The agent may cite any target capability, and a candidate never becomes a covering capability or part of a mark by itself.
- The similar-capabilities check uses the same search and the same match score, so it gives the same flags on every run.
- Candidates and the similar-capabilities check use no embeddings and no network service.
- The compare commands refuse a draft that lacks a field its verdict requires, and name each missing field. Every verdict other than `target-only` requires a mark for each `active` requirement of the baseline capability, or one mark for the capability when it has no `active` requirement, and each `not-met` mark requires its note. `partial`, `unreleased` and `gap` also require `gap_detail`, and `project check` reports a stored record without it as an error (see [Analysis Check Rules](#analysis-check-rules)). Every verdict requires at least one evidence link.
- Consistency checks flag a fit-gap record for review when its verdict differs from the verdict its marks give, when a similar baseline capability in the same comparison has a different verdict, or when its marks are out of date. `run review list` shows flagged records first (see [13 Extraction and Review](13-extraction-and-review.md)).

#### Out-of-Date Marks

A fit-gap record keeps the content version of each requirement it marked, or of the capability when a mark covers the whole capability. Its marks are out of date when the baseline capability has an active requirement with no mark, when a mark names a requirement that is not an active requirement of that capability, or when a mark's version differs from the current content version of what it marked. Only a change to the meaning fields changes a content version, so a new tag, facet code or owner never flags a fit-gap record.

Requirements:

- `project check` flags a fit-gap record whose marks are out of date and names `run compare next` as the next action. The [Check Catalog](10-records-and-identity.md#check-catalog) in 10 holds the code.
- `run compare next` gives that capability out again, with its current requirements and their content versions.
- On an `active` record, the corrected marks go through a pending change on the same record (see [10 Records and Identity](10-records-and-identity.md)). The record keeps its current marks until review approves the change.

### Target-Only Generation

Without `target-only` records, a fit-gap shows only what the target lacks, and the extra value of the target stays invisible. The example fit-gap had 14 such rows out of 150. Make Blueprint generates them by command instead of leaving them to memory.

The generation command looks at one comparison. For each active capability of the target system that no current fit-gap record in that comparison lists in `covering_capabilities`, and that has no current `target-only` record, it creates one `target-only` record. Every capability that a mark names is also in its record's `covering_capabilities` (see [Requirement Marks](#requirement-marks)), so reading `covering_capabilities` alone finds every target capability in use.

The target-only pass follows the baseline pass. Once no baseline capability in the comparison is unscored, `run compare next` and the coverage read name the generation command as the next useful action.

Requirements:

- Each generated record names its comparison and target system, lists the one target capability in `covering_capabilities`, and names no baseline capability.
- Each generated record has no requirement marks.
- Each generated record copies the evidence links of its target capability. When that capability has no evidence link, the command creates no record for it and names it in the output.
- Each generated record starts as `draft`, with confidence `low` and effort `unknown`, until a person or agent sets them.
- Running the command twice in a row with no record changes between the runs creates nothing on the second run.
- A `target-only` record is stale when another current fit-gap record in the same comparison starts to list its target capability. The coverage read lists stale records, `project check` reports each one as a warning, and the generation command marks each one `superseded`, names the fit-gap record that now uses the capability, and lists it in its output.
- One run of the command is one journaled change.

### Coverage Read

The coverage read is one read call, the same in the CLI and in MCP, that reports where one comparison stands. It returns counts and record lists for:

- active baseline capabilities with no current fit-gap record (unscored);
- fit-gap records whose marks are out of date;
- active target capabilities that no current fit-gap record uses and that have no current `target-only` record (target-only candidates);
- stale `target-only` records;
- active capabilities in the comparison's systems that have no domain;
- draft fit-gap and placement records waiting for review;
- active fit-gap records with no current placement;
- active placement records with no Make Docs work item (waiting for hand-off);
- integrations in the state `current` that touch a baseline system of the comparison and that no planned integration replaces. [19 System Integrations](19-system-integrations.md) owns which integrations this list holds.

Requirements:

- A comparison is fully scored when every active baseline capability, parent capabilities included, has a current fit-gap record, so the unscored list is empty, and when its target-only candidate list is empty. The coverage read says so in plain words.
- The coverage read names each listed record by `ref` and title and names the next useful action, such as the command that generates `target-only` records.
- The CLI and MCP return the same data for the same comparison. [08 CLI and MCP](08-cli-and-mcp.md) decides whether `project status` also shows these counts.

### Placement Records

A placement record is linked to one fit-gap record. It records which system owns the capability in the planned state and how the capability is delivered there. The owning system can be the target system, a baseline system that keeps the capability, or any other system record in the project, such as an integration platform or an outside service.

| Delivery | Meaning | Short example |
| --- | --- | --- |
| `configure` | The owning system meets the capability through settings and setup data, with no code. A `native` fit also uses `configure`, with little or nothing to set. | Turn on the target's late-fee rule and set a 30-day grace period. |
| `extend` | Code, extensions or customization go on top of a capability the owning system already has. | Add second and third approval levels to the target's approval feature. |
| `build` | The owning system gets a capability that it does not have today. | Build a loyalty program inside the target. |
| `integrate` | The owning system provides the capability to the other systems in scope through an integration. | Keep the loyalty program in the current marketing system and connect it to the target. |

Requirements:

- Each placement names exactly one `fit_gap`, one `owning_system` that is a current system record, and one `delivery` value from the table above.
- A placement with the delivery `integrate` lists the integration records that deliver it in `integrations`, by `id`. A placement with another delivery value lists none. [19 System Integrations](19-system-integrations.md) owns how those integration records are made and read.
- A fit-gap record has at most one current placement. `project check` reports a second one as an error.
- Any fit-gap verdict can have a placement, including `gap` and `target-only`.
- For a fit-gap record with the verdict `unreleased`, the placement records the delivery planned for when the capability is released. The dependency on the vendor's release stays visible through the linked verdict.
- The place commands create placement records as `draft`, and the review commands make them `active` or `rejected`.

### Hand-Off Boundary

Make Blueprint links to planned work. Make Docs owns it. In the hand-off stage, a person or agent stores Make Docs work item IDs in a placement's `work_items` field and Make Docs doc paths in its `docs` field. Creating, changing or closing a work item is a Make Docs job. The hand-off skill tells the agent to use Make Docs for that work and then to record the resulting IDs and paths on the placement through a place command (see [16 Workflow and Skills](16-workflow-and-skills.md)).

Requirements:

- No command or MCP tool in the model, compare, place or hand-off stages writes a file under `docs/` or runs a Make Docs write command.
- `run place link` stores work item IDs and doc paths on a placement or on an integration record. It writes them at once, also on an `active` record, with no pending change, because a Make Docs link is not a fact about a system.
- A placement may hold several work item IDs and doc paths, and several placements may name the same work item.
- A placement with no work item is valid. The coverage read lists active placements with no work item as waiting for hand-off.
- `project check` skips stored work item IDs and doc paths and reports how many it skipped, until Make Docs ships the read command that confirms them (obligation [O-001](03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check)). [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) owns the link format and the confirmation.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 7: CLI and MCP; section 10: data model for v2.0, fit-gap fields and placement delivery values; section 11: the model, compare, place and hand-off stages; section 12: relationship with Make Docs; section 16: decisions from the open-question review)
- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Alternatives Considered: fit-gap per requirement; only fit, partial and gap verdicts)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/07-analysis-and-exports.md` (Scope, Exit Criteria)
- `docs/prd/03-open-questions-and-risk-register.md` (Q-024, Q-035, Q-057, Q-065 to Q-068, Q-073, Q-076, Q-079, Q-084)
- `blueprint/records/system/<id>.md`
- `blueprint/records/domain/<id>.md`
- `blueprint/records/capability/<id>.md`
- `blueprint/records/comparison/<id>.md`
- `blueprint/records/fit-gap/<id>.md`
- `blueprint/records/placement/<id>.md`
- `blueprint/records/integration/<id>.md`
- `docs/work/`

## Contracts and Data

Every analysis record is one Markdown file with YAML front matter, like every other record. Links between records always use `id`, because `ref` can change. [11 Record Types Reference](11-record-types-reference.md) owns the complete field schema, including the common fields from [10 Records and Identity](10-records-and-identity.md). The examples below show the analysis fields in place. They leave out some common fields, such as `aliases`, `facets` and the timestamps.

### Analysis Fields

| Record type | Field | Meaning |
| --- | --- | --- |
| system | `capability_statuses` | The system's own ordered list of capability status values |
| domain | `code`, `name` | The short code that is unique among current domains, and the readable name |
| capability | `system` | The `id` of the system the capability belongs to |
| capability | `parent` | The `id` of the parent capability in the same system. Left out for a top capability. |
| capability | `domain` | The `id` of one domain from the shared list, or left out |
| capability | `capability_status` | One value from the system's `capability_statuses` list, or left out |
| comparison | `target_system` | The `id` of the one target system |
| comparison | `baseline_systems` | The `id` of each baseline system. Their order sets the order of baseline systems in exports. |
| fit-gap | `comparison` | The `id` of the comparison the record belongs to |
| fit-gap | `baseline_capability` | The `id` of the baseline capability being scored. Left out for `target-only`. |
| fit-gap | `target_system` | The `id` of the comparison's target system |
| fit-gap | `covering_capabilities` | The `id` of each target capability that covers the baseline capability |
| fit-gap | `verdict` | `native`, `configurable`, `partial`, `unreleased`, `gap` or `target-only` |
| fit-gap | `confidence` | `high`, `medium` or `low` |
| fit-gap | `effort` | `none`, `low`, `medium`, `high` or `unknown` |
| fit-gap | `gap_detail` | Plain text: what is missing or different in the target. Required for `partial`, `unreleased` and `gap`. |
| fit-gap | `migration_note` | Plain text: what the move means for data, process or people |
| fit-gap | `requirement_marks` | One mark for each active requirement of the baseline capability, or one mark for a capability with no active requirements. Each mark keeps the content version of what it marked in `version`, and every capability it names is also in `covering_capabilities`. Left out for `target-only`. See [Requirement Marks](#requirement-marks). |
| fit-gap | `evidence` | One or more evidence links, required |
| placement | `fit_gap` | The `id` of the one fit-gap record the placement belongs to |
| placement | `owning_system` | The `id` of the system that owns the capability in the planned state |
| placement | `delivery` | `configure`, `extend`, `build` or `integrate` |
| placement | `integrations` | The `id` of each integration record that delivers an `integrate` placement. Left out for other delivery values. |
| placement | `work_items` | Make Docs work item IDs, in the format [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) defines |
| placement | `docs` | Make Docs doc paths, relative to the project root |

A fit-gap record does not store a direction. The direction follows from the verdict: `target-only` records run from the target, and all other records run from a baseline capability to the target. [15 Exports](15-exports.md) shows it as a column.

### Record Examples

A comparison with two baseline systems:

```markdown
---
id: CMP-8d2qa7k2
ref: CMP-001
type: comparison
title: Target platform against current order systems
status: active
summary: Scores the current order and billing systems against the target platform.
target_system: SYS-k2v9d7k2
baseline_systems:
  - SYS-a7c4m7k2
  - SYS-b3x8r7k2
schema_version: 1
---

Scope notes and agreed rules for this comparison.
```

A fit-gap record with the verdict `partial`. Its three marks are `met`, `partly` and `not-met`, and the verdict table gives `partial` for that mix:

```markdown
---
id: FIT-3m9xk7k2
ref: FIT-014
type: fit-gap
title: Multi-level approval routing
status: draft
summary: The target supports one approval level. The baseline needs three.
comparison: CMP-8d2qa7k2
baseline_capability: CAP-p4t7w7k2
target_system: SYS-k2v9d7k2
covering_capabilities:
  - CAP-7hq3n7k2
verdict: partial
confidence: medium
effort: medium
gap_detail: The target has no second or third approval level and no routing by amount.
migration_note: Open approvals must close before cutover. Approvers need short training.
requirement_marks:
  - requirement: REQ-3wd7h2kp
    version: 6dc4b0f065cacd03da661146f58ca7cd8fc93c1c1adb5ce57182234b5b44c0c6
    mark: met
    capabilities:
      - CAP-7hq3n7k2
    evidence:
      - SRC-9wq2e7k2#p-031
  - requirement: REQ-8mx4t9va
    version: 3dd09f8a4da20d14c8a1e3262c817f1177a617087375ef495b9c54b4ed03f514
    mark: partly
    capabilities:
      - CAP-7hq3n7k2
    note: The target routes a request to one approval level only.
  - requirement: REQ-c5r2n6qe
    version: fc7c740fa8ed0b19b23d961cee522dbde249b97aaf5563e65de33f6c09983b0b
    mark: not-met
    note: Read the target approval guide and its workflow settings. Neither describes a route chosen by amount.
evidence:
  - SRC-4hd8x7k2#p-012
  - SRC-9wq2e7k2#p-031
evidence_versions:
  SRC-4hd8x7k2:
    sha256: ce065c8cde8caa6e51ec405febe6e3d1c39dfcff2602d147670db662f9cbd80d
    converter: docx
    converter_version: "1"
  SRC-9wq2e7k2:
    sha256: 8912b672cd9df10b7d432e0492e0a3a0e0a8c11d6f3ef66d85b0be00ea3a0907
    converter: pdf
    converter_version: "1"
schema_version: 1
---

Reasoning behind the verdict, with notes on each covering capability.
```

A placement for that fit-gap record:

```markdown
---
id: PLC-6tn2c7k2
ref: PLC-009
type: placement
title: Extend target approvals to three levels
status: draft
fit_gap: FIT-3m9xk7k2
owning_system: SYS-k2v9d7k2
delivery: extend
schema_version: 1
---

Why the target owns this capability. The placement has no Make Docs links yet, so `work_items` and `docs` are left out.
```

### Analysis Check Rules

The `project check` command (see [08 CLI and MCP](08-cli-and-mcp.md) and [10 Records and Identity](10-records-and-identity.md)) applies these rules to current analysis records. An error means the record breaks the data model. A warning points at a likely mistake that a person may accept.

| Rule | Level |
| --- | --- |
| A capability's `capability_status` is not in its system's `capability_statuses` list | Error |
| A capability's `parent` is in another system, or the parent chain loops | Error |
| A capability's `domain` is not a current domain record | Error |
| Two current domains share a `code` | Error |
| A comparison has no target, no baseline, or names its target as a baseline | Error |
| A fit-gap record has no evidence link | Error |
| A fit-gap record's `target_system` differs from its comparison's target | Error |
| A fit-gap record's baseline capability does not belong to one of the comparison's baseline systems | Error |
| A covering capability does not belong to the target system | Error |
| A `native`, `configurable`, `partial` or `unreleased` record lists no covering capability | Error |
| A `gap` record lists a covering capability | Error |
| A `target-only` record names a baseline capability, or lists other than exactly one covering capability | Error |
| Two current fit-gap records in one comparison score the same baseline capability | Error |
| A fit-gap record other than `target-only` has no `requirement_marks` | Error |
| A `target-only` record has requirement marks | Error |
| A mark other than `not-met` cites no target capability and no evidence link, or a `not-met` mark has no note | Error |
| A mark cites a capability that does not belong to the target system | Error |
| A mark names a capability that is not in the record's `covering_capabilities` (`mark-capability-uncovered`) | Error |
| A fit-gap record's verdict differs from the verdict its marks give | Warning |
| A fit-gap record's marks are out of date (see [Out-of-Date Marks](#out-of-date-marks)) | Warning |
| Two current fit-gap records in one comparison score baseline capabilities that the similar-capabilities check matches, and their verdicts differ | Warning |
| A `target-only` record is stale | Warning |
| A `native` record has an effort other than `none` | Warning |
| A `gap` record has the effort `none` | Warning |
| A `partial`, `unreleased` or `gap` record has an empty `gap_detail` | Error |
| A placement's `owning_system` is not a current system record, or its `delivery` is not a listed value | Error |
| A placement whose `delivery` is not `integrate` lists `integrations` | Error |
| A fit-gap record has more than one current placement | Error |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 8: storage; section 9: identity; section 10: data model for v2.0; section 16: Q-065 to Q-068)
- `blueprint/records/comparison/<id>.md`
- `blueprint/records/fit-gap/<id>.md`
- `blueprint/records/placement/<id>.md`
- `.make/blueprint/`

## Integrations

| Party | What analysis needs from it, or gives to it | Owner |
| --- | --- | --- |
| Records and identity | Common fields, record statuses, `id` and `ref`, aliases for merged records, facets on analysis records, evidence link validation and the `project check` command | [10 Records and Identity](10-records-and-identity.md) |
| Record types | The full field schema for system, domain, capability, comparison, fit-gap and placement records, including the fields of one requirement mark and the placement `integrations` field | [11 Record Types Reference](11-record-types-reference.md) |
| Source intake | Anchors in converted text, and the flag for evidence links that point at a changed source. Fit-gap evidence gets the same flag as any other evidence. | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| Extraction and review | Systems, domains and capabilities arrive as drafts from extraction. The review commands make draft fit-gap and placement records `active` or `rejected`, list flagged fit-gap drafts first, and show the rubric. | [13 Extraction and Review](13-extraction-and-review.md) |
| Storage | The journal for merges, batched approval and `target-only` generation, the short lock for minting `ref` values, the content version that marks keep, and the index text search behind candidate matches and the similar-capabilities check | [09 Storage and Indexing](09-storage-and-indexing.md) |
| CLI and MCP | The `run model`, `run compare` and `run place` commands, the `analyze` MCP profile, `allowWrite`, and the filter syntax people use to query analysis records | [08 CLI and MCP](08-cli-and-mcp.md) |
| System integrations | Current and planned integration records. The coverage read lists current integrations that no planned integration replaces, and `integrate` placements list their integration records. | [19 System Integrations](19-system-integrations.md) |
| Exports | The comparison's export files, including the fit-gap detail, fit-gap requirements and placements CSV files, the summaries by verdict and by domain, and the workbook, are built from comparison, fit-gap, placement, capability, requirement and domain records | [15 Exports](15-exports.md) |
| Skills | One skill each for the model, compare, place and hand-off stages. The compare skill follows the fit-gap method. The hand-off skill sends the agent to Make Docs to create work items. | [16 Workflow and Skills](16-workflow-and-skills.md) |
| v1 import | BuildOS v1 has no comparison, fit-gap or placement records. Imported systems and capabilities need the model stage, such as status lists and domains, before a comparison. | [17 v1 Import](17-v1-import.md) |
| Make Docs | Owns work items in `docs/work/` and the docs they point to. Make Blueprint stores only their IDs and paths. `project check` skips them and reports how many until the Make Docs read command ships (obligation [O-001](03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check)). | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| Local server and UI | v2.2 views of comparisons, fit-gap and placement records, each fed by one view-model read call | [18 Local Server and UI](18-local-server-and-ui.md) |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 7: CLI and MCP; section 11: workflow and skills; section 12: relationship with Make Docs; section 14: UI; section 16: Q-024, Q-067 and Q-073)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/06-extraction-and-review.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/08-mcp-skills-and-status.md`
- `docs/work/`

## Rebuild Notes

The fit-gap model generalizes one strong example: a capability-level fit-gap of 150 rows that compared a custom system with a vendor product. A rebuild must keep what worked in that example and must not carry over its two-system shape.

| Example fit-gap | Make Blueprint |
| --- | --- |
| Column prefixes `ce_` and `fo_` named two fixed systems | The roles baseline and target. Any system record can play either role, and a comparison can have several baseline systems. |
| Verdict `preview_gap` | Verdict `unreleased`, a word that fits any vendor |
| Verdict `fo_only` and direction `fo_only` | Verdict `target-only`. Direction is not stored; it follows from the verdict. |
| Direction `ce_to_fo` | Every verdict other than `target-only` |
| A long prose `evidence` column with no source references | Required evidence links to anchors in sources. The reasoning moves to the record's summary and body. |
| 15 shared layer codes | Domain records in the project's shared domain list |
| Two different capability status vocabularies, one per system | Each system's own `capability_statuses` list |
| Pipe lists of target capability IDs in one cell | A `covering_capabilities` list of `id` links in front matter |
| Delivery dispositions with system suffixes, such as configure or build in a named system, plus separate dispositions for preview and release-gated work | One `owning_system` plus one `delivery` value. Preview and release gating show through the fit-gap verdict `unreleased`. |
| Several system roles per placement, such as authoritative records, experience and orchestration systems | One owning system per placement. The other systems of an `integrate` placement show through its integration records. |
| Requirement counts on each side, with no tie from a requirement to the verdict | A mark for each baseline requirement, and a fixed table from marks to verdict |

Patterns from the example that a rebuild must keep:

- In the example, `gap` rows never listed target capabilities, `fo_only` rows listed exactly one target capability and no baseline capability, and `native` rows always had the effort `none`. These patterns are the source of the check rules above.
- Requirement counts on both sides gave useful context, but requirements did not join across the two models. Do not move scoring to the requirement grain. Marks back the verdict with one value for each baseline requirement, and they never match a baseline requirement to a target requirement.

Likely mistakes:

- Scoring a baseline capability twice in one comparison, often after a merge. The merge output and `project check` both name the duplicates.
- Letting the verdict and the covering list disagree, for example a `gap` with a covering capability.
- Storing a `ref` in a link field. Links use `id`, so a ref fix never breaks them.
- Leaving `target-only` records stale after a later fit-gap record starts to use the same target capability.
- Letting a model operation, the compare stage or the hand-off skill write Make Docs work items. Make Blueprint only links.
- Treating an export as input. Exports are generated from these records and are never read back (see [15 Exports](15-exports.md)).
- Using `capability_status` and record `status` as one field. They answer different questions.
- Treating marks as a second grain, or matching baseline requirements to target requirements. A mark answers one question about one baseline requirement.
- Skipping marks on `native` and `configurable` records. Those verdicts need marks most, because nobody looks at them again.
- Keeping the method only in the skill. The CLI hands out the work, refuses drafts that lack required fields and flags records whose verdict differs from their marks, so the steps hold on every run.
- Finding candidates with embeddings or a network service. The same records must give the same candidates and the same flags on every run.
- Giving a placement its own list of partner systems. The other ends of an `integrate` placement come from its integration records.

A comparison with several baseline systems is the first real test of this model. Each baseline capability gets its own fit-gap record, even when two baseline systems hold similar capabilities. The shared domain list is how people see that overlap.

Code anchors:

- `<user-home>/Developer/Agents/BuildOS/workspace/datasets/ce-fo-fit-gap-normalized.csv` (column set only)
- `<user-home>/Developer/Agents/BuildOS/workspace/datasets/rental-capability-system-placement-normalized.csv` (column set only)
- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Context: field use so far; Consequences: trade-offs and risks, one example; section 16: Q-057 and Q-065 grain and marks)

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/07-analysis-and-exports.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/04-analysis-exports-and-integrations.md`
- `docs/prd/03-open-questions-and-risk-register.md`
- `<user-home>/Developer/Agents/BuildOS/workspace/datasets/ce-fo-fit-gap-normalized.csv`
- `<user-home>/Developer/Agents/BuildOS/workspace/datasets/rental-capability-system-placement-normalized.csv`
