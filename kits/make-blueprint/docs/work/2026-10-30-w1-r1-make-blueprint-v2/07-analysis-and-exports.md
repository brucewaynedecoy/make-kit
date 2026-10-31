---
title: "Phase 7: Analysis and Exports"
kind: "work"
status: "active"
coordinate: "W1 R1 P7"
source:
  type: "prd"
  path: "docs/prd/14-fit-gap-and-placement.md"
---

# Phase 7: Analysis and Exports

## Purpose

This phase turns reviewed records into answers a client can act on. It builds the model, compare, place and hand-off stages, the planned integrations and the coverage read, and the full export set that a client opens without Make Blueprint.

It depends on the storage interface, the content version and the index text search from [Phase 3](03-storage-and-identity.md), the twelve record types and their field and type-rule checks from [Phase 4](04-record-types.md), the shared CSV writer from [Phase 5](05-intake-and-conversion.md), and the review commands, pending changes and duplicate-hint matching from [Phase 6](06-extraction-and-review.md).

## Overview

The model stage cleans up systems, capabilities and domains with merge, re-parent and re-domain commands. The compare stage runs the fit-gap method: `run compare next` hands out one baseline capability at a time, the agent marks every baseline requirement, the verdict follows from the marks by the verdict table, and the CLI refuses a draft that lacks what its verdict needs. Each mark keeps the content version of what it marked, so a change in meaning flags the record and sends the capability out again. A target-only pass then records target capabilities that no fit-gap record uses.

The coverage read tells a person what is left to score, place and hand off in one comparison, including the current integrations that no planned integration replaces. The place stage records the owning system and delivery for each fit-gap record and links the integration records of an `integrate` placement. The hand-off stage stores Make Docs work item IDs and doc paths and never writes Make Docs work.

The export engine builds every CSV file, Markdown document and xlsx workbook from records and the export format version alone, so the same records give byte-identical files. Golden-file tests built from synthetic records fix the shape of every file. No client data enters the repository. The v1 fit-gap example stays outside the repository as a column reference and is never copied.

[Phase 8](08-mcp-skills-and-status.md) builds the model, compare, place, hand-off and report skills on these commands and shows the comparison counts in `project status`. [Phase 9](09-v1-import-and-release.md) runs a comparison and an export on an imported project and in the clean container.

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `direct`. Promise: a fit-gap CSV and an xlsx workbook open for a client without Make Blueprint, owned by [15 Exports](../../prd/15-exports.md#client-promise) under the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md).
- Intended human outcome: a client opens the fit-gap detail CSV and the workbook in Excel, LibreOffice Calc, Apple Numbers or Google Sheets with no import step, sees each column in its own column and every character correctly, and understands each row without Make Blueprint, because each `ref` sits beside a name and the `about` sheet explains every value. A client reads one capability model document in any text editor or Markdown viewer.
- Human-facing surface or indirect effect: the full export set in `blueprint/exports/`, now with the capability model documents, data dictionaries, requirement marks, placements and integrations. Secondary surfaces: the output of the model commands and the coverage read, which name records by `ref` and title and name the next useful action.
- Implementation work: Stages 6 to 9 build the export engine, the comparison files, the system files and the golden-file, column parity and encoding tests. Stages 1 to 5 build the records those files read.
- Evidence source or testing type selected under current authority: Automated Implementation Testing (column parity with the example fit-gap, and golden-file tests from synthetic records) and a Guided Progress Review of the workbook and one capability model document, as the plan overview selects.
- Executor: the implementing coding agent runs the automated tests. The Guided Progress Review is run by a person the owner names, who opens the workbook in a spreadsheet app; the agent prepares the files and records the observations.
- Accepted obligation or deferral route: none for this promise. [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check) stays open for the Make Docs links that placements and integrations store.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | Unit and fixture tests for the model commands, the fit-gap method, the verdict table, out-of-date marks, target-only generation, the coverage read and placements; golden-file, column parity, encoding and workbook tests for every export file. The acceptance criteria in each stage below are the decision record. |
| Performance Testing | not-needed | The export build and `project check` for a comparison the size of the v1 fit-gap example is a candidate with no current decision behind it. No current decision depends on export or check timing, and the index profile that [Phase 3](03-storage-and-identity.md) creates covers the reads they use. Revisit if a client project shows slow exports. |
| Guided Progress Review | active | A reviewer opens the workbook in a spreadsheet app and records the sheet list, the columns of each sheet, the characters and whether the `about` sheet explains the values, and reads one capability model document, as [15 Exports](../../prd/15-exports.md#client-promise) states. Stage 9 holds the review. |
| Unassisted Goal Testing | not-needed-now | No PRD needs it for this phase. The Guided Progress Review answers the current decision about the client files, and no new public path needs proof of discoverability without help. |

- Base maintenance action: `create`
- Performance applicability: `not-needed`
- Canonical `PERF-###` profile link or `none`: none
- Finite evidence budget and stop-rule reference or `not-applicable`: `not-applicable`
- Execution packet link or `not-applicable`: `not-applicable`
- Outcome and evidence handoff or `none`: none
- Gate disposition and supported-scope limit or `not-applicable`: `not-applicable`

## Source PRD Docs

- [14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md)
- [15 Exports](../../prd/15-exports.md)
- [19 System Integrations](../../prd/19-system-integrations.md)
- [08 CLI and MCP](../../prd/08-cli-and-mcp.md) for the `run model`, `run compare`, `run place` and `run export` command and tool names
- [10 Records and Identity](../../prd/10-records-and-identity.md) for the `marks-out-of-date` code and `type-rule` reporting
- [11 Record Types Reference](../../prd/11-record-types-reference.md) for the comparison, fit-gap, placement and integration fields
- [09 Storage and Indexing](../../prd/09-storage-and-indexing.md) for the content version, the write journal and the index text search
- [13 Extraction and Review](../../prd/13-extraction-and-review.md) for the review of analysis drafts

## Source Obligations, Scenarios, And Findings

- Obligation: [O-001 Confirm Make Docs Links in Project Check](../../prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check). Placements and integrations store Make Docs work item IDs and doc paths, and `project check` skips them with a count until Make Docs ships its read command. This phase keeps the skip as built in [Phase 4](04-record-types.md) and does not treat it as the lasting behavior.
- Risk: [R-019 The Fit-Gap Model Rests on One Example](../../prd/03-open-questions-and-risk-register.md#r-019-the-fit-gap-model-rests-on-one-example). Stage 9 tests a synthetic comparison with several baseline systems.
- Risk: [R-020 Comma-Decimal Locales](../../prd/03-open-questions-and-risk-register.md#r-020-comma-decimal-locales). Stage 9 checks the workbook in a comma-decimal locale.
- Decisions carried in: [Q-034](../../prd/03-open-questions-and-risk-register.md#q-034-analysis-records-start-as-drafts) to [Q-040](../../prd/03-open-questions-and-risk-register.md#q-040-exports-tracked-in-git), [Q-058](../../prd/03-open-questions-and-risk-register.md#q-058-placement-export-and-setting-options), [Q-062](../../prd/03-open-questions-and-risk-register.md#q-062-export-set-for-each-system-and-comparison) to [Q-070](../../prd/03-open-questions-and-risk-register.md#q-070-explicit-people-and-role-fields), [Q-073](../../prd/03-open-questions-and-risk-register.md#q-073-integration-records), [Q-076](../../prd/03-open-questions-and-risk-register.md#q-076-version-that-requirement-marks-keep), [Q-079](../../prd/03-open-questions-and-risk-register.md#q-079-integration-record-detail-rules) and [Q-084](../../prd/03-open-questions-and-risk-register.md#q-084-small-command-and-status-defaults-found-while-writing-the-work-backlog), which sets the model command forms, the status mapping option, the export draft option, the `active` comparison and the `run place link` targets.
- Scenarios: None.
- Findings: None.

## Stage 1 - Model Stage

### Tasks

- [ ] t1: Build `run model tree <system>` (MCP `model_tree`, kind `read`, profile `analyze`). It prints the system's capability tree with each capability's `ref`, title, domain code and `capability_status`, and lists the system's active capabilities that have no domain. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-model))
- [ ] t2: Build capability merge in `run model merge <record> --into <record>` (MCP `model_merge`). The survivor keeps its `id`. Each merged capability becomes `superseded` with `superseded_by` naming the survivor, every link to a merged record is rewritten to the survivor's `id`, evidence links are combined on the survivor, and the whole change is one journaled change. The command refuses capabilities from different systems and says why. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#model-stage))
- [ ] t3: Extend `run model merge` to systems and domains. A system merge moves the merged systems' capabilities to the survivor; a domain merge moves every capability in a merged domain to the survivor. A system merge refuses when a moving capability's `capability_status` is not in the survivor's `capability_statuses` list, unless the repeatable `--map-status <old>=<new>` option (MCP `statusMap`) maps each missing value to a value in that list, and the refusal lists the missing values. A system merge also refuses when a comparison would then name the same system as its target and one of its baselines. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#model-stage))
- [ ] t4: Make every model operation name each record it changed by `ref` and title, and name each fit-gap record that the change turned into a duplicate in one comparison, in both human and JSON output. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#model-stage))
- [ ] t5: Build `run model move <capability>... --parent <capability>` and `run model move <capability>... --top` (MCP `model_move`). It moves one or more capabilities, with their children, under another capability of the same system, or with `--top` to the top of that system's tree, in one journaled change. It refuses `--top` and `--parent` together, a parent in another system, and a move that would make a capability its own ancestor. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#model-stage); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-model))
- [ ] t6: Build `run model set-domain <capability>... <domain>` and `run model set-domain <capability>... --none` (MCP `model_set_domain`). It sets each named capability's `domain` to one current domain from the shared domain list and refuses any other value, or with `--none` clears the domain of each named capability. A call that changes more than one capability is one journaled change. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#model-stage); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-model))
- [ ] t7: Guard a system's `capability_statuses` list. `run record update` on a system that drops values from the list refuses while capabilities still use a dropped value, unless the repeatable `--map-status <old>=<new>` option (MCP `statusMap`) maps each such value to a value that stays in the list. On a `draft` system, the update with a mapping writes the system and every mapped capability in one journaled change. On an `active` system, the update is a pending change that keeps the mapping, and approval writes the system and every mapped capability in one journaled change. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#system-status-lists); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-record))
- [ ] t8: Write crash tests for each multi-record model operation. Stop the process at each step of the journaled change and check that the records end fully merged or fully unmerged, and that no current record links to a record that the merge superseded. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#model-stage))

### Acceptance criteria

- A701: On a fixture with two capabilities of one system that share requirements and evidence, `run model merge CAP-002 --into CAP-001` exits 0. The survivor keeps its `id` and holds both records' evidence links, `CAP-002` is `superseded` with `superseded_by` set to the survivor's `id`, every record that linked to `CAP-002` now links to the survivor's `id`, and a lookup of `CAP-002` returns the superseded record, which names the survivor.
- A702: `run model merge` on two capabilities of different systems changes no file and names both systems in its output. A system merge whose moving capabilities use a `capability_status` missing from the survivor's list changes no file, returns `blocked`, and lists each missing value; the same merge with `--map-status` for each value succeeds and sets the mapped values.
- A703: A system merge that would make a comparison's target also one of its baselines changes no file and names the comparison by `ref` and title.
- A704: After a merge that makes two current fit-gap records in one comparison score the same baseline capability, the merge output names both fit-gap records by `ref` and title, in human output and in JSON output.
- A705: `run model move` refuses a parent in another system and a parent that is the capability's own descendant, changing no file in either case. A move under a valid parent moves the capability's children with it, and `run model tree` shows the new tree.
- A706: `run model set-domain` with a domain that is `rejected`, `superseded` or `archived` changes no file. With a current domain, the capability file is the only file that changes, as a one-file git diff.
- A707: `run record update` that takes `in_flight` out of a `draft` system's `capability_statuses` while two capabilities use it changes no file and names both capabilities. With `--map-status in_flight=designed`, the system and both capabilities carry the new values after one journaled change.
- A708: The model crash tests stop the process at every journal step of a capability merge, a system merge and a status-list mapping, and each run ends with the records fully changed or fully unchanged.
- A764: `run model move CAP-003 CAP-004 --top` moves both capabilities, with their children, to the top of their system's tree in one journaled change, and `run model tree` shows both as top capabilities. `run model move CAP-003 --top --parent CAP-001` changes no file and says that `--top` and `--parent` cannot be used together.
- A765: `run model set-domain CAP-003 CAP-004 DOM-002` sets the domain of both capabilities in one journaled change. `run model set-domain CAP-003 --none` leaves `CAP-003` with no `domain`, and `run model tree` lists it among the capabilities with no domain.
- A766: On an `active` system, `run record update` that takes `in_flight` out of `capability_statuses` with `--map-status in_flight=designed` leaves the system and both capability files byte-identical and records a pending change that keeps the mapping. After `run review approve`, the system and both capabilities carry the new values, written in one journaled change, and a crash test at each journal step of the approval ends with all three files fully changed or fully unchanged.

### Dependencies

- [Phase 3](03-storage-and-identity.md): storage interface, write lock, write journal and crash recovery, the `superseded_by` rules, aliases and the `tree-loop` check.
- [Phase 4](04-record-types.md): the system, domain and capability types and the model `type-rule` checks.
- [Phase 6](06-extraction-and-review.md): extraction and review that make systems, domains and capabilities `active`, and the pending change that keeps a `--map-status` mapping on an `active` system.
- [Phase 2](02-cli-and-packaging.md): command grammar, outcomes, exit codes and the result envelope.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed`; Guided Progress Review not used in this stage; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none. No performance candidate applies to the model commands.
- Human Experience Review: the agent inspects real `run model merge` and `run model move` output on the fixture and records whether each changed record and each new duplicate appears by `ref` and title before any `id`, with its limits. To be recorded at closeout.
- Optional experience handoff: run `make-blueprint run model tree <system>` on the sample project, merge two duplicate capabilities, and notice that the output names each changed record and any new duplicate fit-gap. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A701` to `A708` and `A764` to `A766` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 2 - Comparisons and the Fit-Gap Method

### Tasks

- [ ] t9: Build `run compare create --target <system> --baseline <system>...` (MCP `compare_create`, profile `analyze`). It creates one comparison record with `status: active`, one `target_system` and one or more systems in `baseline_systems`, in the order given, and refuses a target that is also a baseline. The comparison needs no review, because it states the scope a person chose, not a claim from evidence; the fit-gap, `target-only` and placement records it holds still start as `draft` ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#comparisons); [Q-034](../../prd/03-open-questions-and-risk-register.md#q-034-analysis-records-start-as-drafts))
- [ ] t10: Guard comparison changes made through `run record update`, `run record link` and `run record unlink`. A change of `target_system` refuses while current fit-gap records belong to the comparison and names them. Adding a baseline system is allowed. Dropping a baseline system refuses while current fit-gap records in the comparison score its capabilities and names them. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#comparisons))
- [ ] t11: Build the verdict table as one shared function that `run compare score`, the consistency check and the export column `marks_verdict` all call. Every mark `met` gives `native`; every mark `met` or `configured`, with one or more `configured`, gives `configurable`; every mark `met`, `configured` or `unreleased`, with one or more `unreleased`, gives `unreleased`; every mark `not-met` gives `gap`; any other mix gives `partial`. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#requirement-marks))
- [ ] t12: Write the fit-gap rubric and ship it inside the CLI as one system reference resource. 14 names no URI, so this task proposes `make-blueprint://system/reference/fit-gap-rubric.md` and records it in the resource list. The rubric is written from the mark, verdict, confidence and effort tables in 14 and never contradicts them. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#the-fit-gap-method))
- [ ] t13: Build `run compare next <comparison>` (MCP `compare_next`, kind `read`). It hands out baseline capabilities that have no current fit-gap record first, then capabilities whose fit-gap record has out-of-date marks, parent capabilities included. With each one it returns the capability's `ref`, title, summary and evidence, its active requirements with their content versions, the capability's own content version when it has no active requirement, the candidate target matches and the rubric. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#the-fit-gap-method))
- [ ] t14: When no capability is left, make `run compare next` write nothing, say so in plain words, and name the next useful action: `run compare target-only <comparison>` when target-only candidates or stale `target-only` records remain, otherwise `run review list`. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#the-fit-gap-method))
- [ ] t15: Build candidate target matches from the index text search, with the same matching rule as the duplicate hints. The search reads target capability names, summaries and requirement text, and lists target capabilities in the baseline capability's domain first. It uses no embeddings and no network service. Candidates are hints only and never become covering capabilities or mark capabilities by themselves. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#the-fit-gap-method))
- [ ] t16: Build `run compare score <comparison> <capability>` (MCP `compare_score`). It creates the fit-gap record for one baseline capability as `draft`, or updates it; an update to an `active` record becomes a pending change on the same record. It writes each mark's `version` from the content version that the storage interface computes for the marked requirement or capability. It reuses the Phase 4 write refusals for field shape, covering counts, `gap_detail` and `mark-capability-uncovered`, and names each missing capability. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#fit-gap-records))
- [ ] t17: Add the method refusals to `run compare score`. It refuses a draft with no evidence link, a draft that lacks one mark for each `active` requirement of the baseline capability, a draft for a capability with no `active` requirement that lacks its one capability mark, a mark for a requirement that is not an `active` requirement of that capability, and a `not-met` mark with no note. It names each missing field, requirement or mark. It never stores a verdict in place of the one the agent gave. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#the-fit-gap-method))
- [ ] t18: Build the out-of-date mark rule as `marks-out-of-date` (Warning) in `project check`. A record's marks are out of date when the baseline capability has an `active` requirement with no mark, when a mark names a requirement that is no longer an `active` requirement of that capability, or when a mark's `version` differs from the current content version of what it marked. The finding names `run compare next` as the next action. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#out-of-date-marks))
- [ ] t19: Build the consistency checks as `type-rule` warnings in `project check`: a fit-gap record whose verdict differs from the verdict its marks give; two current fit-gap records in one comparison that score baseline capabilities the similar-capabilities check matches and that have different verdicts; a `native` record whose effort is not `none`; and a `gap` record whose effort is `none`. The similar-capabilities check uses the same index search and match score as the candidates, so it gives the same flags on every run. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#analysis-check-rules))
- [ ] t20: Feed the flag set from t18 and t19 into the ordering slot that `run review list` keeps for flagged records, so flagged fit-gap records come first. Make `run review show` return the rubric from t12 for a fit-gap draft. ([13 Extraction and Review](../../prd/13-extraction-and-review.md#review))

### Acceptance criteria

- A709: `run compare create --target SYS-001 --baseline SYS-001` changes no file. `run compare create --target SYS-001 --baseline SYS-002 --baseline SYS-003` creates one comparison with `status: active` whose `baseline_systems` lists both systems in that order, and `run review list` does not list it.
- A710: On a comparison with two current fit-gap records, an attempt to change `target_system` changes no file and names both records by `ref` and title. Adding a third baseline system succeeds, and the coverage read then lists that system's active capabilities as unscored.
- A711: A unit test covers every row of the verdict table: all `met` gives `native`; `met` and `configured` give `configurable`; `configured` and `unreleased` give `unreleased`; all `not-met` gives `gap`; and `met`, `partly` and `not-met` give `partial`.
- A712: `make-blueprint resource read make-blueprint://system/reference/fit-gap-rubric.md` prints the rubric, and the same text is in the `run compare next` result and in `run review show` for a fit-gap draft.
- A713: On a synthetic comparison, repeated `run compare next` and `run compare score` calls score every active baseline capability, parents included, with no capability handed out twice. Stopping after three scores and calling `run compare next` in a new process hands out the fourth unscored capability.
- A714: The `run compare next` result for a capability with three active requirements lists each requirement with a 64-character lowercase hexadecimal content version. For a capability with no active requirement, it carries the capability's own content version.
- A715: When every baseline capability is scored and no marks are out of date, `run compare next` changes no file, says that nothing is left to score, and names `run compare target-only` with the comparison's `ref` as the next action.
- A716: The candidate list for a baseline capability puts target capabilities in the same domain first, and two runs on the same records return the same candidates in the same order. A test with the network disabled returns the same list.
- A717: `run compare score` refuses, and writes no file, for a draft with no evidence link, a draft missing a mark for one active requirement (named in the output), a `not-met` mark with no note, a `partial` draft with no `gap_detail`, and a mark that names a target capability missing from `covering_capabilities` (named in the output).
- A718: `run compare score` on an `active` fit-gap record leaves the record file's marks unchanged and records a pending change on the same record, with the same `id` and `ref`, that `run review list` shows.
- A719: Changing a baseline requirement's summary makes `project check` report `marks-out-of-date` on the fit-gap record that marked it and name `run compare next`; `run compare next` then hands that capability out again. Adding a tag, a facet code or an owner to the same requirement makes no `marks-out-of-date` finding.
- A720: `project check` reports a `type-rule` warning for a record whose stored verdict differs from its marks' verdict, for two similar baseline capabilities in one comparison with different verdicts, for a `native` record with effort `low`, and for a `gap` record with effort `none`. Two runs on the same records report the same flags.
- A721: `run review list` on a comparison with one flagged and two unflagged fit-gap drafts lists the flagged draft first.

### Dependencies

- Stage 1 of this phase.
- [Phase 3](03-storage-and-identity.md): the content version that marks keep, the index text search and the write journal.
- [Phase 4](04-record-types.md): the comparison and fit-gap types, the `requirement_marks` schema, and the write refusals and `type-rule` checks for fit-gap fields, covering counts and `mark-capability-uncovered`.
- [Phase 6](06-extraction-and-review.md): the duplicate-hint matching rule, pending changes, and the ordering slot for flagged records in `run review list`.
- [Phase 2](02-cli-and-packaging.md): system resources and `resource read`.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed`; Guided Progress Review not used in this stage; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none. The text search behind candidates and the similar-capabilities check is measured in the index profile that [Phase 3](03-storage-and-identity.md) owns.
- Human Experience Review: the agent inspects real `run compare next` and `run compare score` output, including a refusal and the nothing-left result, and records whether a person can tell what to score next and why a draft was refused without reading machine detail. To be recorded at closeout.
- Optional experience handoff: run `make-blueprint run compare next <comparison>` on the sample project, score one capability with a `not-met` mark and no note, and notice how the refusal names what is missing. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A709` to `A721` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 3 - Target-Only Generation and the Coverage Read

### Tasks

- [ ] t21: Build `run compare target-only <comparison>` (MCP `compare_target_only`). For each active capability of the target system that no current fit-gap record in the comparison lists in `covering_capabilities` and that has no current `target-only` record, it creates one `draft` fit-gap record with verdict `target-only`, the comparison and target system, that one capability in `covering_capabilities`, no baseline capability, no marks, the target capability's evidence links, confidence `low` and effort `unknown`. It creates no record for a capability with no evidence link and names it in the output. One run is one journaled change. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#target-only-generation))
- [ ] t22: Handle stale `target-only` records. A `target-only` record is stale when another current fit-gap record in the comparison starts to list its target capability. `project check` reports each stale record as a `type-rule` warning, and `run compare target-only` marks each one `superseded`, names the fit-gap record that now uses the capability, and lists it in its output. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#target-only-generation))
- [ ] t23: Build the coverage read in `run compare show <comparison>` (MCP `compare_show`, kind `read`). It returns counts and record lists for unscored baseline capabilities, fit-gap records with out-of-date marks, target-only candidates, stale `target-only` records, active capabilities in the comparison's systems with no domain, draft fit-gap and placement records waiting for review, active fit-gap records with no current placement, and active placements with no Make Docs work item, plus counts by verdict and by domain. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#coverage-read))
- [ ] t24: Make the coverage read say in plain words whether the comparison is fully scored (the unscored list and the target-only candidate list are both empty), name each listed record by `ref` and title, and name the next useful action, such as `run compare target-only` once no baseline capability is unscored. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#coverage-read))
- [ ] t25: Write a parity test that runs the coverage read through the CLI with `--json` and through the MCP tool `compare_show` on the same comparison and compares the two `data` objects. Include a project with two comparisons and check that one comparison's fit-gap and placement records never count toward the other. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#comparisons))

### Acceptance criteria

- A722: On a synthetic comparison whose target has five active capabilities, three of them covered by fit-gap records and one with no evidence link, `run compare target-only` creates exactly one `draft` `target-only` record with confidence `low`, effort `unknown`, no `baseline_capability`, no `requirement_marks` and the target capability's evidence links, and names the capability with no evidence link in its output.
- A723: Running `run compare target-only` a second time with no record change in between creates no record and changes no file.
- A724: After a new fit-gap record lists the target capability of an existing `target-only` record, `project check` reports the stale record as a warning, and the next `run compare target-only` run marks it `superseded` and names the fit-gap record that now uses the capability.
- A725: `run compare show` on a fixture with known counts reports each of the coverage lists with the expected count and names every listed record by `ref` and title.
- A726: On a comparison whose unscored list and target-only candidate list are empty, the coverage read says the comparison is fully scored. On one with unscored capabilities, it names `run compare next` with the comparison's `ref`.
- A727: The CLI `--json` result and the MCP `compare_show` result for the same comparison carry the same `data`, and the counts for one of two comparisons in a project do not change when records are added to the other.

### Dependencies

- Stage 2 of this phase.
- [Phase 3](03-storage-and-identity.md): the write journal and the index reads behind the counts.
- [Phase 4](04-record-types.md): the stale-`target-only` warning slot under `type-rule`.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed`; Guided Progress Review not used in this stage; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent inspects real coverage read output for a partly scored, a fully scored and a stale-record comparison, and records whether the state and the next useful action are clear from the first lines. To be recorded at closeout.
- Optional experience handoff: run `make-blueprint run compare show <comparison>` after the baseline pass, run the target-only pass, and notice how the coverage read changes from unscored to fully scored. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A722` to `A727` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 4 - Planned Integrations in a Comparison

### Tasks

- [ ] t26: Design the rules for keeping, rebuilding and retiring a current integration in a comparison, as 19 asks this phase to do. Write them as a short design in `docs/designs/`, take them to the owner, and once the owner accepts them, carry them into 19 through the PRD change process before the coverage read applies them. Do not hard-code a rule before that. ([19 System Integrations](../../prd/19-system-integrations.md#integrations-in-a-comparison))
- [ ] t27: Add the integration list to the coverage read. It lists each `current` integration with status `active` that touches a baseline system of the comparison and that no `planned` integration with status `draft` or `active` lists in `replaces`. It names each integration by `ref` and title with its `from_system`, `to_system` and `payload`, names the next useful action for each one, counts an integration between two baseline systems once, and is worked out from the records on every read. The list never changes whether the comparison is fully scored. ([19 System Integrations](../../prd/19-system-integrations.md#integrations-in-a-comparison))
- [ ] t28: Make planned integration drafts work for the compare and place stages through `run record create --type integration` with `state: planned`. A planned integration starts as `draft` whichever command creates it, its `replaces` lists current integrations by `id`, and its `effort` uses the fit-gap effort list. ([19 System Integrations](../../prd/19-system-integrations.md#planned-integrations))
- [ ] t29: Make `run record show <integration>` show the fit-gap record behind a planned integration by following each placement that lists the integration in `integrations` to that placement's `fit_gap`, and show the reverse of `replaces` (the planned integrations that replace a current one) worked out at read time. No integration field names a fit-gap record, and no record stores a replacement flag. ([19 System Integrations](../../prd/19-system-integrations.md#planned-integrations))

### Acceptance criteria

- A728: 19's [Integrations in a Comparison](../../prd/19-system-integrations.md#integrations-in-a-comparison) section states owner-accepted keep, rebuild and retire rules, and the coverage read tests hold one case for each rule.
- A729: On a fixture with three active current integrations that touch a baseline system, one replaced by a `draft` planned integration and one running between two baseline systems, the coverage read lists exactly two integrations, each by `ref` and title with its systems and payload, and lists the integration between two baseline systems once.
- A730: Rejecting the planned integration in A729 makes the next coverage read list the replaced current integration again, and no record file changed apart from the planned integration's status.
- A731: A planned integration made with `run record create --type integration` is `draft`, and `run record show` on it names the fit-gap record behind it once a placement lists it in `integrations`, and names none before.
- A732: `run record show` on a current integration lists the planned integrations whose `replaces` names it, and no current integration record file holds a `replaced_by` field.

### Dependencies

- Stage 3 of this phase.
- [Phase 4](04-record-types.md): the integration type, its fields and the eight integration check rules from 19.
- [Phase 6](06-extraction-and-review.md): current integration drafts from `run extract add`, and the review that makes planned integration drafts `active` or `rejected`.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed`; Guided Progress Review not used in this stage; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent inspects the coverage read's integration list on the fixture and records whether a person can see what the move may break or must rebuild, and what to do for each item. To be recorded at closeout.
- Optional experience handoff: run `make-blueprint run compare show <comparison>` on the sample project, record a planned integration that replaces one listed current integration, and notice that the list shrinks. Feedback is welcome and optional.
- Explicit human acceptance gate: none. The owner's acceptance of the keep, rebuild and retire rules in t26 is normal product authority, not a Human Experience gate.
- Evidence report: the `A728` to `A732` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 5 - Placement and Hand-Off Links

### Tasks

- [ ] t30: Build `run place next <comparison>` (MCP `place_next`, kind `read`). It hands out the next active fit-gap record in the comparison that has no current placement, with its verdict, baseline capability, covering capabilities and `gap_detail`, and says so when none is left. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-place))
- [ ] t31: Build `run place set <fit-gap>` (MCP `place_set`). It creates the placement for one fit-gap record as `draft`, with one `owning_system` and one `delivery` value, or updates it; an update to an `active` placement becomes a pending change. It accepts any fit-gap verdict, `gap` and `target-only` included. It reuses the Phase 4 refusals for the owning system, the delivery value, `integrations` on a placement that is not `integrate`, and a second current placement for one fit-gap record. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#placement-records))
- [ ] t32: Link integration records to an `integrate` placement through `run record link <placement> integrations <integration>`, by `id`. A placement may list a current integration that stays, a planned integration, or both, and several placements may list one integration. ([19 System Integrations](../../prd/19-system-integrations.md#placements-that-integrate))
- [ ] t33: Build `run place link <placement-or-integration>` (MCP `place_link`). It takes a placement or an integration record and stores Make Docs work item IDs in `work_items` and Make Docs doc paths in `docs`, several of each, in the format that 05 defines. It writes them at once, also on an `active` record, with no pending change, because Make Docs links are not facts. A placement with no work item stays valid. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#hand-off-boundary); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-place); [19 System Integrations](../../prd/19-system-integrations.md#make-docs-links))
- [ ] t34: Write a boundary test that runs every model, compare, place and hand-off command and MCP tool on a fixture with a `docs/` folder and a fake `make-docs` on the path. The test fails when any of them writes or changes a file under `docs/` or starts a Make Docs write command. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#hand-off-boundary))

### Acceptance criteria

- A733: `run place next` on a comparison with two active fit-gap records and one placement hands out the fit-gap record with no placement, and after `run place set` on it, says that no fit-gap record is left to place.
- A734: `run place set` creates a `draft` placement for a `gap` record and for a `target-only` record. A second `run place set` on an `active` placement leaves the file's `owning_system` and `delivery` unchanged and records a pending change on the same record.
- A735: An `integrate` placement that lists one current and one planned integration by `id` passes `project check` with no error, and a `build` placement given an `integrations` entry is refused.
- A736: `run place link PLC-001` with two work item IDs and one doc path stores them in `work_items` and `docs`, and `project check` then reports `make-docs-skipped` with the count of skipped links.
- A737: The boundary test passes: no model, compare, place or hand-off command or MCP tool changes a file under `docs/` or starts a Make Docs write command.
- A767: `run place link` on an `active` placement and on an `active` integration record writes the given `work_items` and `docs` into each record file at once. Both records stay `active`, and `run review list` shows no pending change for either one.

### Dependencies

- Stage 4 of this phase.
- [Phase 4](04-record-types.md): the placement type, the placement and integration check rules and the `make-docs-skipped` report for [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check).
- [Phase 6](06-extraction-and-review.md): pending changes and the review of placement drafts.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed`; Guided Progress Review not used in this stage; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent inspects `run place next`, `run place set` and `run place link` output and records whether a person can see which fit-gap record is being placed and that the stored Make Docs links are not yet confirmed. To be recorded at closeout.
- Optional experience handoff: place one fit-gap record on the sample project, link it to a known work item, and notice the skipped-link count in `project check`. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A733` to `A737` and `A767` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. O-001 stays open.

## Stage 6 - Export Engine and Format Rules

### Tasks

- [ ] t35: Build the export run core: the export format version that names the layout of every file and ships with the CLI; the status filter (`active` by default, `--include-drafts` on `run export fit-gap`, `run export system` and `run export all`, or `includeDrafts: true` on their MCP tools, to add `draft`, and never `rejected`, `superseded` or `archived`), applied to every row, count and Markdown document in a run; and file names built from the comparison or system `ref` at run time, using only ASCII letters, digits, hyphens and one dot. ([15 Exports](../../prd/15-exports.md#status-filter); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-export))
- [ ] t36: Build the three export scopes: `run export fit-gap <comparison>` (MCP `export_fit_gap`) writes the comparison files and the system files of its target and each baseline system; `run export system <system>` (MCP `export_system`) writes the system files; and `run export all` (MCP `export_all`) writes every comparison's and every system's files, including systems in no comparison. All three are write tools that need `allowWrite`. ([15 Exports](../../prd/15-exports.md#component-and-capability-map))
- [ ] t37: Build the export check and safe writes. Before it writes any file, the run checks that every `id`, section number and count in the content it built matches the records. A failed check fails the run, names the file and the value, and leaves the previous files in place. Each file is written in full or not at all. An export run never changes a record and never reads an export file. ([15 Exports](../../prd/15-exports.md#regeneration))
- [ ] t38: Make a full run leave `blueprint/exports/` holding exactly the current export set, the router files `AGENTS.md` and `CLAUDE.md`, and any file whose name does not match an export file name. It deletes stale export files, such as files named after a `ref` that a ref fix replaced, and lists them in its output. No run changes or deletes the router files. ([15 Exports](../../prd/15-exports.md#regeneration))
- [ ] t39: Build the run output: each file written with its row count, the records left out by reason (such as "12 draft fit-gap records left out"), and warnings for a cut cell, a `project check` error on an exported record, an exported capability with no domain, a fit-gap record whose verdict differs from its marks' verdict, and each CSV text value that starts with `=`, `+`, `-` or `@`, named by file, column and record, with a pointer to the workbook. Warnings do not stop the run, and human and JSON output carry the same meaning. ([15 Exports](../../prd/15-exports.md#regeneration))
- [ ] t40: Wire the export CSV files to the shared CSV writer from Phase 5 with the export rules: UTF-8 with a byte order mark, a comma delimiter in every locale, a header row first, RFC 4180 quoting, LF row endings, empty cells for empty values, list cells joined with ` | ` in a stable order, plain whole-number counts and no formulas. CSV values stay exact, formula-like text included. ([15 Exports](../../prd/15-exports.md#encoding-and-format-rules))
- [ ] t41: Build the shared column rules: each row carries its own record's `ref` and `id`; each capability a row names appears by `ref` and `id`; systems and domains appear by `ref` and name, and domains also by `code`; facet columns named `facet_<facet name>` follow the fixed columns in the fit-gap detail, capability and requirement exports, in project config order; and `evidence_sources` lists each distinct source by `ref`, a space and title, in order of first use. ([15 Exports](../../prd/15-exports.md#shared-column-rules))

### Acceptance criteria

- A738: An export run with the default filter writes no `draft`, `rejected`, `superseded` or `archived` record; with `--include-drafts`, and through MCP with `includeDrafts: true`, draft rows appear with `draft` in the `status` column and every count includes them.
- A739: `run export fit-gap CMP-001` writes the eight comparison files and the four system files of each of its systems. `run export system SYS-004` writes only the four system files of `SYS-004`. Each MCP export tool called without `allowWrite: true` writes nothing and returns `blocked` with `write-not-allowed`.
- A740: A test that corrupts one count in the built content before writing fails the run, names the file and the value, and leaves every previous export file byte for byte unchanged. No record file changes during any export run.
- A741: After a ref fix renames `SYS-002` to `SYS-005`, `run export all` writes the `SYS-005` files, deletes the `SYS-002` files and lists them as stale, and leaves `AGENTS.md`, `CLAUDE.md` and an unrelated file such as `notes.txt` in place.
- A742: The run output names each file with its row count, reports "12 draft fit-gap records left out" on a fixture with 12 drafts, and warns about a text value `=SUM(A1)` by file, column and record while the CSV cell keeps `=SUM(A1)` exactly.
- A743: Every CSV export file starts with the bytes `EF BB BF`, uses commas and LF row endings, quotes values with commas, quotes and line breaks by RFC 4180, writes empty values as empty cells, and joins list cells with ` | `.
- A744: On a project with two facets, the fit-gap detail, capability and requirement files carry `facet_<name>` columns after their fixed columns in config order, and the summaries carry none.

### Dependencies

- Stages 2 to 5 of this phase for the records the files read.
- [Phase 5](05-intake-and-conversion.md): the shared CSV writer.
- [Phase 2](02-cli-and-packaging.md): the `blueprint/exports/` folder and its routers, the project `name` read from `.make/config.yaml`, the result envelope and the `allowWrite` gate.
- [Phase 3](03-storage-and-identity.md): reads through the storage interface and the index.
- [Phase 4](04-record-types.md): facets, `owners`, `stakeholders` and `audience` slugs.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed` with the reason in Current Testing Decisions; Guided Progress Review in Stage 9; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent inspects real export run output with drafts left out and formula-like values, and records whether a person can tell what was written, what was left out and what to check. To be recorded at closeout.
- Optional experience handoff: not applicable until Stage 9 completes the client files.
- Explicit human acceptance gate: none.
- Evidence report: the `A738` to `A744` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 7 - Comparison Exports

### Tasks

- [ ] t42: Build `<comparison-ref>-fit-gap.csv` with the 41 columns of the fit-gap detail table, in order. `baseline-to-target` rows come first, by baseline system in the comparison's order, then baseline domain `code` with "No domain" last, then baseline capability `ref`; `target-only` rows follow, by target domain `code`, then target capability `ref`. On `target-only` rows, every `baseline_` column and columns 32 to 41 are empty. `marks_verdict` comes from the shared verdict table, and `mark_summary` counts `met` and `configured` as met. ([15 Exports](../../prd/15-exports.md#fit-gap-detail-columns))
- [ ] t43: Build `<comparison-ref>-fit-gap-requirements.csv` with its 21 columns: one row for each requirement mark on each exported fit-gap record, in fit-gap detail order, then requirement `ref` order. A mark on a capability with no requirements leaves the `requirement_` columns empty. ([15 Exports](../../prd/15-exports.md#fit-gap-requirement-columns))
- [ ] t44: Build `<comparison-ref>-fit-gap-by-verdict.csv` (11 columns, one row for each of the six verdicts in the fixed order, zero counts included) and `<comparison-ref>-fit-gap-by-domain.csv` (19 columns, one row for each domain that passes the filter in `code` order, plus a "No domain" row when needed). A `baseline-to-target` row counts under its baseline capability's domain and a `target-only` row under its target capability's domain. ([15 Exports](../../prd/15-exports.md#summary-columns))
- [ ] t45: Build `<comparison-ref>-placements.csv` (21 columns, rows in fit-gap detail order) and `<comparison-ref>-integrations.csv` (29 columns). The integrations file holds each exported integration whose `from_system` or `to_system` is the target or a baseline system, `current` rows first, then `planned`, each by `from_system` `ref`, `to_system` `ref` and integration `ref`. `replaced_by_refs` is worked out at run time from the exported planned integrations' `replaces` lists. ([15 Exports](../../prd/15-exports.md#integration-columns))
- [ ] t46: Build `<comparison-ref>-data-dictionary.md`: the title, export format version and status filter; each comparison file with a one-line description and row count; every column of each CSV file with its meaning; the verdict, confidence, effort, mark and delivery lists and the integration `state`, `trigger` and `method` lists, each with its count; the table that turns marks into a verdict; the join rules; and the encoding notes. Its entry for the integrations file says that one row is one flow in one direction. ([15 Exports](../../prd/15-exports.md#data-dictionaries))
- [ ] t47: Build the xlsx writer with no Python and no outside tool, inside the npm package and the single file. It writes one Office Open XML file with no macros, no formulas and no links to other files; text values as text cells and counts as number cells; a bold, frozen header row with a filter on each data sheet; text longer than 32,767 characters cut to fit and ending with `[truncated]`, with the record named in the run output; and document properties and zip entry times taken from the latest `updated_at` of the exported records. ([15 Exports](../../prd/15-exports.md#encoding-and-format-rules))
- [ ] t48: Build `<comparison-ref>-fit-gap.xlsx`. Sheets come in the order `about`, `fit-gap`, `fit-gap-requirements`, `by-verdict`, `by-domain`, `placements`, `integrations`, then `<system-ref> capabilities` and `<system-ref> requirements` for the target and then each baseline system. Sheet names use only letters, digits, spaces and hyphens and stay inside Excel's 31-character sheet name limit, and each data sheet holds the same columns and rows as its CSV file. The `about` sheet holds every item that 15 lists, including the project `name` when set, the status filter, "Records as of", each sheet with its row count, the verdict counts, the meaning of every value and the verdict table, and the note that the workbook is not the truth. ([15 Exports](../../prd/15-exports.md#encoding-and-format-rules))

### Acceptance criteria

- A745: On the several-baseline fixture, the fit-gap detail header is exactly the 41 column names in table order, the rows follow the stated order, and every `target-only` row has empty `baseline_` and mark columns. A record whose stored verdict differs from its marks shows both values and the run warns about it.
- A746: The fit-gap requirements file has one row for each mark on each exported record and none for `target-only` records, and its row count equals the sum of `mark_count` in the fit-gap detail file.
- A747: The summary by verdict has exactly six rows in the order `native`, `configurable`, `partial`, `unreleased`, `gap`, `target-only`. In both summaries, each row's verdict, confidence and effort counts add up to its `fit_gap_count`, and `fit_gap_count` over all rows equals the number of rows in the fit-gap detail file and the count that `run record list --filter 'type:fit-gap comparison:CMP-001'` returns with the same status filter.
- A748: The integrations file lists `current` rows before `planned` rows, and a current integration that a planned one replaces shows that planned integration's `ref` in `replaced_by_refs`; one that nothing replaces has an empty cell.
- A749: The comparison data dictionary lists every column of the six comparison CSV files in file order, each value list with its count, and the verdict table.
- A750: An automated workbook test unzips `CMP-001-fit-gap.xlsx` and finds no `vbaProject.bin`, no formula element, no external link part, text cells for values that start with `=`, frozen and filtered header rows, the sheet order above with names of 31 characters or fewer, and a 40,000-character value cut to 32,767 characters ending with `[truncated]`.
- A751: Running `run export fit-gap CMP-001` twice with no record change writes byte-identical CSV, Markdown and xlsx files.

### Dependencies

- Stage 6 of this phase.
- [Phase 2](02-cli-and-packaging.md): the npm package and the single-file build that carry the xlsx writer.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed`; Guided Progress Review in Stage 9; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent opens the built CSV and Markdown files as text and inspects the workbook's sheets, and records whether each `ref` sits beside a readable name and each evidence link beside its source title. To be recorded at closeout.
- Optional experience handoff: not applicable until Stage 9.
- Explicit human acceptance gate: none.
- Evidence report: the `A745` to `A751` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 8 - System Exports

### Tasks

- [ ] t49: Build `<system-ref>-capabilities.csv` with the 28 columns of the capability table. Rows follow the capability tree: each top capability in `ref` order, then its children in `ref` order, depth first; a capability whose parent is not in the export follows the top capabilities in `ref` order and keeps its `parent_ref`. `owners`, `stakeholders` and `audience` hold slugs from `.make/personas.yaml`, and an unset field is an empty cell. ([15 Exports](../../prd/15-exports.md#capability-columns))
- [ ] t50: Build `<system-ref>-requirements.csv` with the 23 columns of the requirement table, in capability export order, then requirement `ref` order. The option columns hold values only for `setting` requirements. ([15 Exports](../../prd/15-exports.md#requirement-columns))
- [ ] t51: Build one section-number computation that both the capability CSV's `section_number` and the capability model document use: domain parts numbered from 1 in domain `code` order with "No domain" last, and each capability's section number as the part number, a dot and its place in the part. ([15 Exports](../../prd/15-exports.md#capability-model-document))
- [ ] t52: Build `<system-ref>-capability-model.md` with its six parts in order: About, the domain parts, the capability sections, Integrations, the capability inventory table, and findings and source notes. The H1 title starts with the project `name` when set, then the system `ref` and name and "capability model". All prose comes from the system, domain, capability, requirement and finding record bodies. For each comparison in which the system is a baseline, in comparison `ref` order, each section gives the verdict, the mark counts such as "6 of 8 met", and the gap list. A pipe inside a table value is written as `\|`, and with the draft option each draft record shows `draft` beside its title, here and in both data dictionaries. ([15 Exports](../../prd/15-exports.md#capability-model-document))
- [ ] t53: Build `<system-ref>-data-dictionary.md`: the title, export format version and status filter; the four system files with descriptions and row counts; the model shape with counts; every column of each CSV file; every value list with its row counts, such as capability statuses, requirement kinds, domain codes, capability types and option scopes; the join rules, such as `capability_id` between the capability and requirement files; and the encoding notes, including that the workbook opens correctly in every locale. ([15 Exports](../../prd/15-exports.md#data-dictionaries))

### Acceptance criteria

- A752: The capabilities file header is exactly the 28 column names in table order, its rows follow the depth-first tree order, and an orphan capability whose parent is `archived` follows the top capabilities and keeps its `parent_ref`.
- A753: The requirements file header is exactly the 23 column names in table order, and the option columns are empty on every requirement whose kind is not `setting`.
- A754: For every capability, the `section_number` in the capabilities file equals the section number in the capability model document, and the export check fails the run when a test forces them apart.
- A755: The capability model document for a system that is a baseline in two comparisons shows each capability's verdict, mark counts and gap list once for each comparison, in comparison `ref` order, and its H1 title starts with the project `name` when `.make/config.yaml` sets one and with the system `ref` when it does not.
- A756: A text search of the capability model document and data dictionary finds no sentence that is not in a record body, a finding record or the fixed headings and labels of the export format version.
- A757: The system data dictionary lists every column of both system CSV files and every value list with counts that equal the matching row counts in those files.

### Dependencies

- Stage 6 of this phase.
- [Phase 4](04-record-types.md): the capability and requirement detail fields and the built-in code lists.
- [Phase 8](08-mcp-skills-and-status.md) uses these files in the `blueprint-report` checklist.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed`; Guided Progress Review in Stage 9; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads one built capability model document from top to bottom and records whether a reader can find a capability, its requirements, its verdict in each comparison and its sources without Make Blueprint. To be recorded at closeout.
- Optional experience handoff: not applicable until Stage 9.
- Explicit human acceptance gate: none.
- Evidence report: the `A752` to `A757` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 9 - Golden Files, Column Parity and Client Review

### Tasks

- [ ] t54: Build the synthetic export fixture from scratch, shaped like the example fit-gap but holding no client data, client names, client system names or client values. It holds a comparison with one target and several baseline systems, every verdict, every mark value, `target-only` records, a record whose verdict differs from its marks, drafts, placements of every delivery value, current and planned integrations, two facets, `owners`, `stakeholders` and `audience` slugs, accented letters, curly quotes and dashes, formula-like text, a value longer than the Excel cell limit, and a ref fix. The v1 example files stay outside the repository and are never copied in. ([15 Exports](../../prd/15-exports.md#client-promise))
- [ ] t55: Write the golden-file tests. They build every export file of the fixture, the CSV files, Markdown documents and workbook, and compare each byte for byte with a stored expected file under the test fixtures. A second run with no record change must match too. ([15 Exports](../../prd/15-exports.md#client-promise))
- [ ] t56: Write the column parity test. The column map comes only from the "Example column" entries in 15's column tables, typed into the test. The test runs a comparison export of the fixture and checks that every example column of the fit-gap detail, the two summaries, the capability file and the requirement file has its mapped export column, in the order listed, and checks the value maps `ce_to_fo` to `baseline-to-target`, `fo_only` to `target-only` for direction and verdict, and `preview_gap` to `unreleased`. It compares columns and values, never client rows. ([15 Exports](../../prd/15-exports.md#column-parity-with-the-example))
- [ ] t57: Write the encoding and workbook-open tests: a BOM-aware read of each CSV file returns the header names with no stray character; a strict Office Open XML validation of the workbook reports no error; and the workbook opens in LibreOffice Calc in a headless test with no repair message. ([15 Exports](../../prd/15-exports.md#client-promise))
- [ ] t58: Write the several-baseline end-to-end test: on the synthetic fixture, run the model, compare, target-only, place, hand-off and export commands from a clean project and check that the comparison produces fit-gap, placement and export files with no `project check` error on the exported records. ([14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#rebuild-notes))
- [ ] t59: Run the Guided Progress Review. A reviewer the owner names opens `CMP-001-fit-gap.xlsx` and `CMP-001-fit-gap.csv` from the fixture in a spreadsheet app, and opens the workbook again with a comma-decimal locale set. The reviewer records the sheet list, the columns of each sheet, whether every character shows correctly, and whether the `about` sheet explains each value, then reads one capability model document. The agent writes the record into `evidence.md`. ([15 Exports](../../prd/15-exports.md#client-promise))

### Acceptance criteria

- A758: A scan of the test fixtures finds none of the example files' client rows, names or values, and the repository holds no copy of any file from the v1 example.
- A759: The golden-file tests pass for every export file of the fixture, and a deliberate one-character change in any record makes one or more golden-file tests fail.
- A760: The column parity test passes: every example column has its mapped export column in order, and the three value maps hold.
- A761: A BOM-aware CSV reader reads `comparison_ref` as the first header of `CMP-001-fit-gap.csv`, the strict workbook validation reports no error, and the headless LibreOffice open reports no repair.
- A762: The several-baseline end-to-end test passes: one comparison with three baseline systems produces fit-gap, placement and export files, and `project check` reports no error on the exported records.
- A763: The Guided Progress Review record in `evidence.md` names the spreadsheet app, its version and the locales used, lists the sheets and columns seen, and records for each of these whether it held: each column in its own column, every character correct, the `about` sheet explaining each value, the workbook correct in the comma-decimal locale, and the capability model document readable with no Make Blueprint.

### Dependencies

- Stages 6 to 8 of this phase.
- [Phase 8](08-mcp-skills-and-status.md) and [Phase 9](09-v1-import-and-release.md) run these exports through `blueprint-report` and in the clean container.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed`; Guided Progress Review active and held in t59; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none. Export and check timing stays `not-needed` unless a client project shows slow exports.
- Human Experience Review: the agent reviews the client promise against the Guided Progress Review record, the golden files and the parity test, and records an observation, a conclusion (`satisfied`, `material gap` or `insufficient evidence`), the limits, such as apps that were not opened, and the next action. To be recorded at closeout.
- Optional experience handoff: open `CMP-001-fit-gap.xlsx` from the fixture in your own spreadsheet app, read the `about` sheet, and notice whether each verdict and mark is explained. Feedback is welcome and optional.
- Explicit human acceptance gate: none. The Guided Progress Review is a selected testing activity, not a human acceptance gate.
- Evidence report: the `A758` to `A763` section of `evidence.md` in this backlog folder, including the Guided Progress Review record. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. The phase closes when a comparison with several baseline systems produces fit-gap, placement and export files and the client promise review is recorded.
