---
title: "Phase 6: Extraction and Review"
kind: "work"
status: "active"
coordinate: "W1 R1 P6"
source:
  type: "prd"
  path: "docs/prd/13-extraction-and-review.md"
---

# Phase 6: Extraction and Review

## Purpose

This phase gives agents a guided, one-source-at-a-time path from converted text to reviewed records, with every step kept in records and no side files. It builds on the converted text, parts, evidence resolution and agent route from [Phase 5](05-intake-and-conversion.md), on the record types, `run record create` and evidence link rules from [Phase 4](04-record-types.md), and on the write lock, write journal, index text search and record versions from [Phase 3](03-storage-and-identity.md).

## Overview

The phase starts by designing pending changes, the way a fact on an `active` record is fixed in place, because register Q-032 requires that design before this phase ends. It then builds `run extract next` and the extraction record with coverage and outcome for each part, duplicate hints on `run extract add` and `run record create`, draft records including `integration` drafts for current integrations, review of drafts to `active` or `rejected`, the persona approval that asks the shared core to write `.make/personas.yaml`, reviewer slugs, the optional second reviewer, approval in journaled batches, pending changes and their review, review of agent conversions of complex PDFs, and the extraction read model that `project status` shows. It ends with a Guided Progress Review of one real-shaped source through extraction and review.

The phase map comes from [07 Work Backlog Scope](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/07-work-backlog-scope.md) in the `W1 R1` plan. The PRDs below are the authority.

Analysis drafts from compare, `target-only` generation and place come in [Phase 7](07-analysis-and-exports.md), which also supplies the fit-gap rubric and the flags that put records first in `run review list`. The `project status` output and the extract, review and convert skills come in [Phase 8](08-mcp-skills-and-status.md).

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `direct`. Promise: "A record change reads as a git diff of one Markdown file", owned by [09 Storage and Indexing](../../prd/09-storage-and-indexing.md#record-changes-read-as-one-file-git-diffs) and by [10 Records and Identity](../../prd/10-records-and-identity.md#statuses) for fixing a fact in place, under the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md). [Phase 3](03-storage-and-identity.md) builds the serializer and the diff tests. This phase makes approval of drafts and of pending changes keep that promise.
- Intended human outcome: A reviewer who approves a draft or a pending change sees exactly one record file change in `git diff`, with the same `id`, `ref` and links, and only the changed lines plus `updated_at`. A rejected pending change leaves the record file unchanged and keeps the reason.
- Human-facing surface or indirect effect: Record files in `blueprint/records/`, `run review list`, `run review show`, `run review approve` and `run review reject` output, and the git diff a reviewer reads after review.
- Implementation work: Stage 1 designs pending changes. Stage 5 makes approval change only a draft's status. Stage 6 keeps batched approval diffs equal to one-run diffs. Stage 7 builds pending changes so approval writes into the same file.
- Evidence source or testing type selected under current authority: Automated Implementation Testing: an approved pending change writes one file with the same `id`, and batched approval gives the same diffs as one run. Human Experience Review of a sample pending-change diff by the agent. Guided Progress Review of one real-shaped source through extraction and review, as PRD 13 plans.
- Executor: The implementing coding agent runs the tests and records the Human Experience Review. A human reviewer named when Stage 9 starts runs the Guided Progress Review with an agent.
- Accepted obligation or deferral route: None.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | See the decision records below. |
| Performance Testing | `not-needed-now` | The `W1 R1` plan names no performance candidate for this phase. Duplicate hints use the index text search, which the index profile from [Phase 3](03-storage-and-identity.md) characterizes. Register R-018 is addressed by hint tuning on fixtures in t31, which needs no timing target. |
| Guided Progress Review | active | PRD 13 plans it for this phase. See the decision records below. |
| Unassisted Goal Testing | `not-needed-now` | No PRD asks for it, and no current human-experience question needs an unassisted attempt. |

Decision records:

| Field | Automated Implementation Testing | Guided Progress Review |
| --- | --- | --- |
| Decision informed | Whether extraction, review, pending changes and the read model are ready for analysis in Phase 7 and the skills in Phase 8 | Where extraction and review cause friction that needs a fix before the Phase 8 skills are written |
| Reason now | PRD 13 names automated tests for the extraction flow, duplicate hints, crashes during approval and an approved pending change that writes one file with the same `id` | PRD 13 Review plans it in this phase |
| Product maturity | v2.0 prerelease | v2.0 prerelease |
| Scope | Every command, check and read-model count in this phase, on fixture projects | One real-shaped synthetic source with no client data, taken from `run extract next` to `run review approve` |
| Executor | The implementing coding agent | A human reviewer named when Stage 9 starts, working with an agent |
| Gate effect | Blocks phase close while any test in scope fails | Advisory. Each friction item becomes a finding with a next action. It does not block phase close. |
| Effort budget | One test suite in the repository's test runner, run on every change | One session for one source, and one rerun only after fixes |
| Stop condition | Every acceptance criterion below has a passing test | The source's extraction is approved or finished as blocked, and each friction item is recorded |
| Evidence retained | Test names and results in the backlog's central `evidence.md` report | The friction list, the source used, the reviewer and the limits in the central `evidence.md` report |
| Rerun trigger | Any change to an extract or review command, pending changes or the read model | A change to the output of `run extract` or `run review` commands |

Performance candidate lifecycle fields:

- Base maintenance action: `none`
- Performance applicability: `not-needed`
- Canonical `PERF-###` profile link or `none`: none
- Finite evidence budget and stop-rule reference or `not-applicable`: `not-applicable`
- Execution packet link or `not-applicable`: `not-applicable`
- Outcome and evidence handoff or `none`: none
- Gate disposition and supported-scope limit or `not-applicable`: `not-applicable`

Human Experience Review is separate agent review work, not a testing type. The agent inspects real review output and the git diffs it produces, and records observations, conclusions, limits and next actions.

## Source PRD Docs

- [13 Extraction and Review](../../prd/13-extraction-and-review.md)
- [10 Records and Identity](../../prd/10-records-and-identity.md): pending changes and review status rules, reviewer slugs and the extraction check codes
- [09 Storage and Indexing](../../prd/09-storage-and-indexing.md): the one-file diff promise and the batched journal
- [11 Record Types Reference](../../prd/11-record-types-reference.md): the extraction record and persona record fields
- [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md): agent conversions waiting for review
- [19 System Integrations](../../prd/19-system-integrations.md): current integrations from extraction
- [05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md): the core write to `.make/personas.yaml`
- [08 CLI and MCP](../../prd/08-cli-and-mcp.md): the `run extract` and `run review` command and MCP tool names

## Source Obligations, Scenarios, And Findings

- Obligations: None. This phase does not touch Make Docs link checks.
- Risks this phase addresses: [R-018 Duplicate-Hint Calls Slow Bulk Extraction](../../prd/03-open-questions-and-risk-register.md#r-018-duplicate-hint-calls-slow-bulk-extraction).
- Register decisions this phase builds: [Q-031: Meaning of the Second Reviewer](../../prd/03-open-questions-and-risk-register.md#q-031-meaning-of-the-second-reviewer), [Q-032: Correcting Evidence on Active Records](../../prd/03-open-questions-and-risk-register.md#q-032-correcting-evidence-on-active-records) (its design is due before this phase ends), [Q-033](../../prd/03-open-questions-and-risk-register.md#q-033-duplicate-hints-for-run-record-create), [Q-072](../../prd/03-open-questions-and-risk-register.md#q-072-shared-people-and-roles-file), [Q-073](../../prd/03-open-questions-and-risk-register.md#q-073-integration-records), [Q-077](../../prd/03-open-questions-and-risk-register.md#q-077-shared-people-and-roles-file-details), [Q-080](../../prd/03-open-questions-and-risk-register.md#q-080-agent-conversion-for-complex-pdfs) and [Q-081: Second Reviewer for Agent Conversions](../../prd/03-open-questions-and-risk-register.md#q-081-second-reviewer-for-agent-conversions).
- Unassisted Goal Testing scenarios: None.
- Findings: None.

## Stage 1 - Pending Change Design

### Tasks

- [ ] t1: Write a design in `docs/designs/` through the Make Docs design workflow, with its `## Human Experience Intent`, that settles: where a pending change is stored, with the `--map-status` mapping that a pending change on an `active` system keeps, so the record file keeps its old value until approval and an approved change lands as a diff of that one file, or, for a status mapping, as one journaled change to the system and every mapped capability; how `run record update` on an `active` record proposes one; how `run review list`, `run review show`, `run review approve` and `run review reject` name a pending change; which direct edits `run record update` may make on an `active` record without review, such as Make Docs links on record types other than placements and integrations. The design does not cover a source's `git_level`, which `run source set-level` changes at once ([Q-083](../../prd/03-open-questions-and-risk-register.md#q-083-changing-the-git-level-of-a-source)), or Make Docs links on placements and integrations, which `run place link` writes at once ([Q-084](../../prd/03-open-questions-and-risk-register.md#q-084-small-command-and-status-defaults-found-while-writing-the-work-backlog)). It also settles where the reason for a rejected pending change is kept, and how pending changes meet record version conflicts, `project check`, the `marks-out-of-date` and `mark-capability-uncovered` fixes on `active` fit-gap records, and the `project status` count ([13 Extraction and Review](../../prd/13-extraction-and-review.md#drafts-and-evidence); [Q-032](../../prd/03-open-questions-and-risk-register.md#q-032-correcting-evidence-on-active-records))
- [ ] t2: After the owner accepts the design, carry its decisions into PRD 13 Drafts and Evidence and Commands, the PRD 08 `run record` and `run review` rows, PRD 10 Statuses and register Q-032 through the Make Docs PRD change process ([13 Extraction and Review](../../prd/13-extraction-and-review.md#commands); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-review))

### Acceptance criteria

- A601: The design file sits in `docs/designs/`, holds exactly one `## Human Experience Intent` after `## Context` and before `## Decision`, and gives one answer to each of the six questions in t1.
- A602: PRD 13, PRD 08 and PRD 10 state the storage, the command shapes, the direct edits and the home of the rejection reason. Register Q-032 records the design as done. `make-docs run prd authority validate --target-root kits/make-blueprint` exits 0.

### Dependencies

- The owner's acceptance of the design. This is a product decision, not a human acceptance gate.
- [Phase 4](04-record-types.md): `run record update`, which stays draft-only until Stage 7.
- [Phase 3](03-storage-and-identity.md): the record version used for write checks.
- Used by [Phase 7](07-analysis-and-exports.md) for the pending change that keeps a `--map-status` mapping on an `active` system.

### Closeout Notes

- Four testing decisions: All four types are `not-needed-now` for this design stage. Automated Implementation Testing covers the design once Stage 7 builds it.
- Performance evidence: none.
- Human Experience Review: The agent checks that the design keeps the one-file diff promise for approve and reject, and records the conclusion. Reviewer: the implementing agent. Limit: the design is not yet built.
- Optional experience handoff: Not applicable.
- Explicit human acceptance gate: None.
- Evidence report: No durable evidence record is needed. The design, PRD and register text are the record.
- Phase / capability status: To be recorded at closeout. This stage must be done before the phase closes.

## Stage 2 - Extraction Queue

### Tasks

- [ ] t3: Build `run extract next` with the MCP tool `extract_next`. A source is ready when its `conversion_status` is `converted`, its converted text is on this machine, it has no open extraction, and its latest extraction did not end blocked. It hands out exactly one due source: first never-extracted sources, then partly extracted sources, then sources changed since their latest finished extraction, each group oldest first by `created_at` and then `id`. The shared filter syntax narrows the pool. A named source is handed out even when its latest extraction ended blocked, but never when it is not `converted`, as for `agent-in-progress` and `awaiting-review` sources ([13 Extraction and Review](../../prd/13-extraction-and-review.md#handing-out-the-next-source))
- [ ] t4: Make `run extract next` take the caller's name for `extracted_by` and return `blocked` naming the flag when none is given; return the caller's own open extraction, matched by that name, without opening a new one; open the extraction under the short write lock; return the extraction `ref`, the source `ref` and title, the converted text path, the parts with their anchors and the number of records that already cite the source; and, when no source is due, write nothing, say why, and name the next useful action ([13 Extraction and Review](../../prd/13-extraction-and-review.md#handing-out-the-next-source); [13 Extraction and Review](../../prd/13-extraction-and-review.md#the-extraction-unit))
- [ ] t5: Open an extraction as an extraction record with `status: draft`, `outcome: open`, `source_sha256` from the source and `parts` copied from the converted text front matter, and set the source's `extraction_status: in-progress`. A source has one open extraction at a time. When a partly extracted source goes out again at the same hash, each part that the earlier extraction covered in full starts with that coverage and outcome and a note that names the earlier extraction ([13 Extraction and Review](../../prd/13-extraction-and-review.md#handing-out-the-next-source); [13 Extraction and Review](../../prd/13-extraction-and-review.md#extraction-record-fields))
- [ ] t6: Build `run extract show <extraction>` with the MCP tool `extract_show`, returning the extraction with its parts, coverage so far and records so an agent can resume in a new session. While an open extraction's original has changed, refuse new drafts and new evidence for it, say that the source changed, and name the ways out: finish the extraction as blocked, or convert the source again and start a new extraction ([13 Extraction and Review](../../prd/13-extraction-and-review.md#the-extraction-unit))

### Acceptance criteria

- A603: On a fixture with two never-extracted sources created at different times, one partly extracted source, one changed source and one blocked source, five `run extract next` calls under five names hand out the older never-extracted source, the newer one, the partly extracted one and the changed one in that order, and the fifth call hands out nothing. Naming the blocked source hands it out. Naming a source in `awaiting-review` refuses and names its conversion status.
- A604: `run extract next` with no name returns `blocked` with exit code 1 and names the flag. A second call with the same name returns the same extraction and leaves `git status --porcelain` unchanged. Two processes that call `run extract next` at the same time in one checkout get different sources.
- A605: The result names the extraction `ref`, the source `ref` and title, the converted text path, the parts with anchors and the citing record count. The new extraction record has `status: draft`, `outcome: open`, `source_sha256` equal to the source's `sha256` and `parts` equal to the converted text's `parts`, and the source has `extraction_status: in-progress`.
- A606: A partly extracted source handed out again at the same hash starts its fully covered parts with the earlier coverage and outcome, and each such part's note names the earlier extraction by `ref`.
- A607: When nothing is due, `run extract next` leaves `git status --porcelain` empty, says why, and names a next action such as `run review list`.
- A608: After an open extraction's original changes, `run extract add` and `run extract link` for that extraction refuse, say that the source changed, and name finishing as blocked and converting again.
- A609: `run extract show` in a new process returns the same parts, coverage and records that the earlier session left.

### Dependencies

- [Phase 5](05-intake-and-conversion.md): converted text with `parts`, availability on this machine and change detection.
- [Phase 3](03-storage-and-identity.md): the short write lock and the filter syntax.
- [Phase 4](04-record-types.md): the extraction record type.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Guided Progress Review active in Stage 9 only; Performance Testing and Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: The agent reads the A607 and A608 output and records whether a person can tell why nothing was handed out or why work stopped, and what to run next. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Run `make-blueprint run extract next` with your name on a project with converted sources. Notice the parts list and the count of records that already cite the source. Feedback is welcome and not required.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the backlog's central `evidence.md` report, under Phase 6, cases A603 to A609.
- Phase / capability status: To be recorded at closeout.

## Stage 3 - Drafts, Evidence and Duplicate Hints

### Tasks

- [ ] t7: Build the duplicate hint call: it searches the index through the Phase 3 `search` operation for records of the same type whose title, summary or aliases are close to the new record's, and for capabilities and requirements also weighs records under the same system or the same capability. Hints include `draft`, `active` and `rejected` records, with rejected ones marked, and each hint shows `ref`, title, type, status and why it matched. When hints exist, the first call writes nothing and returns them, and a repeat call that names the hints it considered creates the record. With no hints, the record is created at once. Hints never merge, link or reject anything ([13 Extraction and Review](../../prd/13-extraction-and-review.md#duplicate-hints))
- [ ] t8: Put the same hint call in front of the Phase 4 `run record create`, so both creation paths give the same hints for the same input ([13 Extraction and Review](../../prd/13-extraction-and-review.md#duplicate-hints); [Q-033](../../prd/03-open-questions-and-risk-register.md#q-033-duplicate-hints-for-run-record-create))
- [ ] t9: Build `run extract add <extraction> --type <type>` with the MCP tool `extract_add` for the types system, domain, capability, requirement, persona, integration and finding, including finding drafts with `kind: question` for open questions. Each draft is a normal record file with `status: draft` and one or more evidence links to the extraction's source whose anchor or table position resolves in the current converted text. It may carry more links, including links to other sources, and the links its type needs, which may point to other drafts. Each draft adds an entry with `action: created` to the extraction's `records` ([13 Extraction and Review](../../prd/13-extraction-and-review.md#drafts-and-evidence))
- [ ] t10: Make an `integration` draft from `run extract add` carry `state: current` and refuse `state: planned`, naming the compare and place stages as the source of planned integrations ([13 Extraction and Review](../../prd/13-extraction-and-review.md#drafts-and-evidence); [19 System Integrations](../../prd/19-system-integrations.md#current-integrations))
- [ ] t11: Build `run extract link <extraction> <record>` with the MCP tool `extract_link`. It adds an evidence link from the extraction's source to an existing `draft` or `active` record, with its `evidence_versions` entry, and changes no status or other field. The extraction lists the record with `action: updated`. Extraction never changes an `active` record other than by adding evidence ([13 Extraction and Review](../../prd/13-extraction-and-review.md#drafts-and-evidence))

### Acceptance criteria

- A610: On a fixture with an `active` capability "Invoice approval limits" and a `rejected` capability "Invoice approval limit" in the same system, `run extract add --type capability` titled "Invoice approval limits" leaves `git status --porcelain` empty and returns both as hints, each with `ref`, title, type, status and the reason it matched, the rejected one marked as rejected. The repeat call that names both hints creates the draft. A title with no close record creates the draft on the first call.
- A611: `run record create` with the same type and fields as A610 returns the same hints in the same order as `run extract add`.
- A612: `run extract add` without a link to the extraction's source is refused, and a link whose anchor is not in the current converted text is refused. A draft with one valid link and one link to another source is created, and the extraction's `records` gains its `id` with `action: created`.
- A613: An `integration` draft from `run extract add` has `state: current`. The same call with `state: planned` is refused and names the compare and place stages.
- A614: `run extract link` on an `active` capability changes only the `evidence`, `evidence_versions` and `updated_at` lines of its file, leaves `status` as `active`, and adds the capability to the extraction's `records` with `action: updated`.

### Dependencies

- Stage 2 of this phase.
- [Phase 3](03-storage-and-identity.md): the index text search with its one matching rule and stable scores.
- [Phase 4](04-record-types.md): `run record create`, the record types and the evidence link rules.
- [Phase 5](05-intake-and-conversion.md): anchor and table position resolution.
- Used later by [Phase 7](07-analysis-and-exports.md), whose `run record create` for planned integration drafts shows the same hints.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now` for this stage.
- Performance evidence: none.
- Human Experience Review: The agent reads the A610 hint output and records whether each hint says why it matched, whether a rejected record is plain to see, and whether the way to go ahead is clear. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Run `make-blueprint run extract add <extraction> --type capability` with a title close to an existing record. Notice the hints and the repeat call that creates the draft. Feedback is welcome and not required.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A610 to A614.
- Phase / capability status: To be recorded at closeout.

## Stage 4 - Coverage and Finishing

### Tasks

- [ ] t12: Build `run extract part <extraction> <part>` with the MCP tool `extract_part`, recording coverage, outcome and note for one part. A part with coverage `partial` or outcome `no-records` or `blocked` needs a note. A part with coverage `none` can only be `blocked`. A part with outcome `records` has one or more records in the extraction's `records` whose evidence points into that part, and a part with outcome `no-records` has none. The CLI works out an anchor's part from its position, and a table position belongs to the part that holds its table anchor ([13 Extraction and Review](../../prd/13-extraction-and-review.md#coverage-and-outcome-per-part))
- [ ] t13: Build `run extract finish <extraction>` with the MCP tool `extract_finish`. It refuses while any part lacks coverage or outcome or breaks the part rules, and lists each problem by part label. On finish, the extraction's `outcome` becomes `blocked` when any part is blocked, `records` when `records` has entries, and `no-records` otherwise, and the source's `extraction_status` becomes `blocked` or `extracted` to match. The extraction stays `draft` until review. An extraction that is not finished stays open ([13 Extraction and Review](../../prd/13-extraction-and-review.md#finishing-an-extraction))
- [ ] t14: Register `extraction-status-mismatch` as a warning for a source whose `extraction_status` disagrees with its latest extraction record, and `extraction-open-twice` as a warning for a source with more than one open extraction ([13 Extraction and Review](../../prd/13-extraction-and-review.md#source-extraction-status); [10 Records and Identity](../../prd/10-records-and-identity.md#check-catalog))
- [ ] t15: Store `extracted_by` and `reviewer` as a `maintainer` slug from `.make/personas.yaml` when the caller's name is one, and as free text otherwise, never refusing free text. Register `name-not-slug` as information for free text in these fields. Compare names after trimming spaces and ignoring letter case ([10 Records and Identity](../../prd/10-records-and-identity.md#people-and-role-slugs); [Q-077](../../prd/03-open-questions-and-risk-register.md#q-077-shared-people-and-roles-file-details))

### Acceptance criteria

- A615: `run extract part` with coverage `partial` and no note is refused. Outcome `records` for a part with no record evidence in it is refused. A draft whose only link is `#t-001:r-0012:c-003` counts toward the part that holds `t-001`.
- A616: `run extract finish` on an extraction with two parts left blank is refused and names both part labels. After the parts are filled with one blocked part, finish sets `outcome: blocked`, the source gets `extraction_status: blocked`, and the extraction stays `draft`.
- A617: After a merge of two branches that each opened an extraction for one source, `project check` reports `extraction-open-twice` as a warning. A hand edit of a source's `extraction_status` gives `extraction-status-mismatch`.
- A618: `run extract next` with the name `Jane D.` stores it as free text, and `project check` reports `name-not-slug` as information. With the name `jane-doe`, which `.make/personas.yaml` holds as a `maintainer` entry, it stores the slug and `project check` reports nothing for the field.

### Dependencies

- Stage 3 of this phase.
- [Phase 4](04-record-types.md): the extraction record fields and the `.make/personas.yaml` reader.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now` for this stage.
- Performance evidence: none.
- Human Experience Review: The agent reads the A616 refusal and records whether a person can find each unfinished part by its label. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Not applicable. The Guided Progress Review in Stage 9 covers the flow with a person.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A615 to A618.
- Phase / capability status: To be recorded at closeout.

## Stage 5 - Review of Drafts

### Tasks

- [ ] t16: Build `run review list [--filter <expr>]` with the MCP tool `review_list`. It lists drafts waiting for review, with extraction drafts grouped by extraction, analysis drafts by comparison, and other drafts in their own group, each group then by type. Each entry shows `ref`, title, type and the number of evidence links. Records that a check flags come first, through an ordering slot that Phase 7 fills with the fit-gap consistency flags ([13 Extraction and Review](../../prd/13-extraction-and-review.md#review))
- [ ] t17: Build `run review show <record>` with the MCP tool `review_show`. It shows one draft with each evidence link resolved to its source text through the Phase 5 resolver, its duplicate hints worked out again at review time, and the records it links to, with a slot for the fit-gap rubric that Phase 7 supplies ([13 Extraction and Review](../../prd/13-extraction-and-review.md#review); [13 Extraction and Review](../../prd/13-extraction-and-review.md#duplicate-hints))
- [ ] t18: Build `run review approve <record>...` and `run review reject <record>... --reason <text>` with the MCP tools `review_approve` and `review_reject`. Both take one draft, a list, every draft of one extraction, or a filter, and both need the reviewer's name, returning `blocked` and naming the flag when it is missing. Reject needs a reason and appends it, with the reviewer's name and the date, to the end of each rejected record's body, with no front matter field. Approval refuses while a record that the draft belongs to, such as its system, capability or parent capability, is still `draft`, unless the same command approves both. Rejection refuses while other drafts belong to the record, unless the same command rejects them and lists them otherwise. The command checks every named draft before it writes, and on any refusal it changes nothing and lists every refusal. No other command moves a record from `draft` to `active` or `rejected` ([13 Extraction and Review](../../prd/13-extraction-and-review.md#review))
- [ ] t19: Build extraction review completion: approving an extraction approves its remaining drafts and then the extraction record in one command, including an extraction with no drafts; when the last draft that a finished extraction created is decided, the extraction record becomes `active` in the same journaled change; and `reviewer` and `reviewed_at` are set from that decision ([13 Extraction and Review](../../prd/13-extraction-and-review.md#review))
- [ ] t20: When review makes a persona record `active`, ask the shared core to add a `user` entry under the record's `slug` to `.make/personas.yaml`, or to let the record claim an unclaimed `user` entry with that slug, in the same journaled change as the approval. Refuse the approval when the slug names a `maintainer` entry or an entry that another `active` persona record claims, naming the entry and that record and leaving the draft `draft`. When the core reports a slug clash, return `blocked` and name the clash ([13 Extraction and Review](../../prd/13-extraction-and-review.md#review); [05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#shared-core); [10 Records and Identity](../../prd/10-records-and-identity.md#people-and-role-slugs))
- [ ] t21: Build one shared selector that returns only `active` records for the model, compare and place stages and for exports, so `rejected` records stay as files with their evidence but feed no later stage, while duplicate hints still list them. Phase 7 uses the selector ([13 Extraction and Review](../../prd/13-extraction-and-review.md#review))

### Acceptance criteria

- A619: On a fixture with drafts from two extractions, one comparison and one hand-made draft, `run review list` shows four groups, each ordered by type, with `ref`, title, type and evidence link count for each entry. A test flag set on one record puts it first.
- A620: `run review show` for a requirement draft shows the source text of each evidence link, its current duplicate hints and its capability.
- A621: `run review approve` without a reviewer name returns `blocked` with exit code 1 and names the flag. `run review reject REQ-042 --reason "Duplicate of REQ-017"` makes the draft `rejected` and its file ends with the reason, the reviewer's name and the date, and no front matter field changes other than `status` and `updated_at`.
- A622: Approving a requirement whose capability is still `draft` is refused unless the same command names the capability. Rejecting a capability with a draft requirement is refused and lists the requirement. When one of five named drafts is refused, `git status --porcelain` stays empty and the output lists every refusal.
- A623: `run review approve --extraction EXT-014` makes its remaining drafts and the extraction record `active` in one command and sets `reviewer` and `reviewed_at`. An extraction that ended `no-records` is approved the same way. Deciding the last draft of a finished extraction one at a time makes the extraction `active` in the same journaled change.
- A624: Approving a persona record whose slug the file does not hold makes the core write a `user` entry, and a crash test shows the entry and the `active` record land together or not at all. A slug held as an unclaimed `user` entry is claimed with no file change. A slug held as a `maintainer` entry, or claimed by another `active` persona record, is refused with the entry and the record named, and the draft stays `draft`.
- A625: The shared selector returns no `draft`, `rejected`, `superseded` or `archived` record, and the A610 hint test still lists the rejected record.

### Dependencies

- Stages 2 to 4 of this phase.
- [Phase 5](05-intake-and-conversion.md): the evidence resolver.
- [Phase 1](01-shared-core-adoption.md): the shared core write to `.make/personas.yaml`.
- [Phase 3](03-storage-and-identity.md): a journaled `apply` that includes the core's `.make/personas.yaml` write.
- Used later by [Phase 7](07-analysis-and-exports.md), which fills the flag slot and the rubric slot, reviews analysis drafts with these verbs, and uses the shared selector.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now` for this stage.
- Performance evidence: none.
- Human Experience Review: For the one-file diff promise, the agent approves one draft and rejects another on a fixture and records whether each `git diff` shows one file with only the `status` and `updated_at` lines, plus the reason lines for the rejected one. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Run `make-blueprint run review list`, then `make-blueprint run review show <ref>` and `make-blueprint run review approve <ref>`, then `git diff`. Notice that one file changed. Feedback is welcome and not required.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A619 to A625.
- Phase / capability status: To be recorded at closeout.

## Stage 6 - Second Reviewer and Approval Batches

### Tasks

- [ ] t22: Build the second reviewer rule: read `review.second_reviewer` from `.make/blueprint/config.yaml` (`true` or `false`, `false` when absent). When it is `true`, `run review approve` refuses a draft created in an extraction, and the extraction record itself, when the reviewer's name matches the extraction's `extracted_by`, and says that a second reviewer is needed and who ran the extraction. The person who ran it can still reject its drafts. When it is `false`, any reviewer approves any draft. The rule never applies to agent conversions ([13 Extraction and Review](../../prd/13-extraction-and-review.md#second-reviewer); [Q-031](../../prd/03-open-questions-and-risk-register.md#q-031-meaning-of-the-second-reviewer); [Q-081](../../prd/03-open-questions-and-risk-register.md#q-081-second-reviewer-for-agent-conversions))
- [ ] t23: Write a review command that changes more than one record in batches, each batch one journaled `apply`, in an order where a record is approved in the same batch as the records it belongs to or later, and rejected in the same batch as the drafts that belong to it or later. A large approval that stops before its last batch reports `partial` with the records its finished batches changed, and running the same command again carries on. The command reports how many records it made `active` or `rejected` by type and which extractions completed their review ([13 Extraction and Review](../../prd/13-extraction-and-review.md#approval-of-many-drafts))

### Acceptance criteria

- A626: With `review.second_reviewer: true`, `run review approve` by ` Jane-Doe ` of a draft from an extraction with `extracted_by: jane-doe` is refused and names `jane-doe` as the person who ran it. The same reviewer can reject the draft. Another reviewer can approve it. The extraction record follows the same rule. With the setting absent, the first approval succeeds. Any reviewer can approve an agent conversion whatever the setting.
- A627: Approving 120 drafts runs in more than one batch. A crash test that stops between batches gives `partial`, names the records written and the drafts still waiting, and leaves no `active` record under a `draft` one. Running the command again approves the rest. The final `git diff` equals the diff of the same approval run in one process with no stop.
- A628: The final report counts the records made `active` by type and names each extraction that completed its review.

### Dependencies

- Stage 5 of this phase.
- [Phase 3](03-storage-and-identity.md): the write journal and batch `apply`.
- Used later by [Phase 8](08-mcp-skills-and-status.md), where `project status` shows whether the second reviewer is on.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now` for this stage.
- Performance evidence: none.
- Human Experience Review: The agent reads the A626 refusal and the A627 `partial` output and records whether a person can tell who must approve instead, what was written and what to run next. The agent also checks that no output presents the second reviewer as security, since setup A records names without logins. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Not applicable. The Guided Progress Review in Stage 9 covers review with a person.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A626 to A628.
- Phase / capability status: To be recorded at closeout.

## Stage 7 - Pending Changes

### Tasks

- [ ] t24: Make `run record update` on an `active` record record a pending change at the location the Stage 1 design names, keeping the record file and its old value unchanged, and apply at once only the direct edits that the design allows ([13 Extraction and Review](../../prd/13-extraction-and-review.md#drafts-and-evidence); [10 Records and Identity](../../prd/10-records-and-identity.md#statuses))
- [ ] t25: Make the review verbs decide pending changes by the shape the design names: `run review list` lists them, `run review show` shows old and new values, `run review approve` writes the change into the same record file with the same `id`, `ref` and links, and `run review reject` leaves the record unchanged and keeps the reason where the design says. A pending change never changes `status`. Approval of a change whose record changed after the proposal is refused through the record version check and writes nothing ([13 Extraction and Review](../../prd/13-extraction-and-review.md#drafts-and-evidence); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-review))
- [ ] t26: Build the promise test: approving a pending change writes exactly one file under `blueprint/records/`, keeps its `id`, and its diff shows only the changed lines and `updated_at` ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#record-changes-read-as-one-file-git-diffs))

### Acceptance criteria

- A629: `run record update` of an `active` capability's `summary` leaves its file byte-identical, stores the pending change where the design says, and `run review list` lists the change.
- A630: `run review show` of the change shows the old and new `summary`. After `run review approve`, `git diff --stat` shows one changed file, the record keeps its `id`, `ref` and links, `status` stays `active`, and the diff shows only the `summary` lines and `updated_at`.
- A631: `run review reject` of a second change leaves the record byte-identical and the reason is readable where the design keeps it. A direct edit that the design allows, such as a new `docs` entry, writes at once.
- A632: When the record file is edited by hand after a proposal, `run review approve` of the change writes nothing and names the conflict.

### Dependencies

- Stage 1 of this phase for the design, and Stage 5 for the review verbs.
- [Phase 3](03-storage-and-identity.md): the `modify` operation and the record version.
- [Phase 4](04-record-types.md): `run record update` on drafts.
- Used later by [Phase 7](07-analysis-and-exports.md) for fixes to `active` fit-gap records, and by [Phase 9](09-v1-import-and-release.md), where staged v1 updates become pending changes.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now` for this stage.
- Performance evidence: none.
- Human Experience Review: For the one-file diff promise, the agent reads the A630 sample diff as a reviewer would and records whether the fixed fact, and only that fact, is plain in it. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Run `make-blueprint run record update <active ref>` with a new summary, then `make-blueprint run review approve` on the change and `git diff`. Notice the one-file diff with the same `id`. Feedback is welcome and not required.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A629 to A632, with the A630 sample diff.
- Phase / capability status: To be recorded at closeout.

## Stage 8 - Review of Agent Conversions

### Tasks

- [ ] t27: List sources in `awaiting-review` in `run review list` in their own group, each with the source `ref`, title and number of pages, naming the "unchecked" pages and the flagged pages first ([13 Extraction and Review](../../prd/13-extraction-and-review.md#review))
- [ ] t28: Make `run review show <source>` show an agent conversion page by page, "unchecked" and flagged pages first. Each flag names the value and the page, and each page names its place in the original so the reviewer can compare them ([13 Extraction and Review](../../prd/13-extraction-and-review.md#review))
- [ ] t29: Make `run review approve <source>` accept the agent conversion and set `conversion_status: converted`, and `run review reject <source> [--pages <range>] --reason <text>` send the named pages, or every page, back to the agent through the Phase 5 send-back call and set `conversion_status: agent-in-progress`. The source record stays `active`, and the second reviewer rule does not apply ([13 Extraction and Review](../../prd/13-extraction-and-review.md#review); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#agent-conversion-for-complex-pdfs))

### Acceptance criteria

- A633: `run review list` on a fixture with one source in `awaiting-review` shows a conversion group with the source `ref`, title and page count, and names its "unchecked" page and its flagged page before the rest.
- A634: `run review show <source>` lists the "unchecked" and flagged pages first, each flag with its value and page, and each page with its page number in the original.
- A635: `run review approve <source>` sets `conversion_status: converted`, the record stays `active`, and `run extract next` can then hand the source out. `run review reject <source> --pages 3-4 --reason "Table split wrong"` sets `agent-in-progress`, and `run source pages-next` hands out pages 3 and 4 with that reason. Reject without `--reason` returns `blocked`.

### Dependencies

- Stage 5 of this phase.
- [Phase 5](05-intake-and-conversion.md): the agent route, its flags and "unchecked" marks, and the send-back call.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now` for this stage.
- Performance evidence: none.
- Human Experience Review: The agent reviews a synthetic agent conversion with one flagged and one unchecked page and records whether the reviewer sees those pages first and can find each flagged value in the original. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Run `make-blueprint run review show <source>` on a converted PDF in `awaiting-review`. Notice the flagged and unchecked pages at the top. Feedback is welcome and not required.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A633 to A635.
- Phase / capability status: To be recorded at closeout.

## Stage 9 - Extraction Read Model and Guided Review

### Tasks

- [ ] t30: Build the extraction read model as one read call over the index that returns: not extracted, partly extracted, changed since extraction and fully extracted sources; open extractions, each with its source, who runs it and its parts covered out of the total; blocked sources; parts by coverage; drafts waiting for review by type, not counting extraction records; extractions waiting for review; pending changes waiting for review; and whether `review.second_reviewer` is on, with the drafts that need a reviewer other than the person who ran their extraction. It offers the next actions to resume or finish an open extraction, review waiting drafts, extract the next due source, continue a partly extracted source, and look at blocked sources ([13 Extraction and Review](../../prd/13-extraction-and-review.md#extraction-state-in-project-status))
- [ ] t31: Tune the duplicate hint call on real-shaped synthetic fixtures with no client data, record the hints per draft and the close matches that were not duplicates before and after tuning, and give the results to register R-018 through the Make Docs PRD change process ([13 Extraction and Review](../../prd/13-extraction-and-review.md#rebuild-notes); [R-018](../../prd/03-open-questions-and-risk-register.md#r-018-duplicate-hint-calls-slow-bulk-extraction))
- [ ] t32: Run the Guided Progress Review: a human reviewer and an agent take one real-shaped synthetic source from `run extract next` through `run review approve`, and record each point of friction with a next action ([13 Extraction and Review](../../prd/13-extraction-and-review.md#review))

### Acceptance criteria

- A636: On fixture projects built for each count, the read model returns the expected value for every count in t30, with the same meaning in human and machine output, and a test shows that the call opens no record file.
- A637: The central `evidence.md` report holds the hint tuning results: fixture names, hints per draft and the non-duplicate matches before and after tuning. Register R-018 cites them, and `make-docs run prd authority validate --target-root kits/make-blueprint` exits 0.
- A638: The central `evidence.md` report holds a Phase 6 Guided Progress Review section that names the source used, the steps taken, each friction item with its next action, the reviewer and the limits of the review.

### Dependencies

- Stages 2 to 8 of this phase.
- [Phase 3](03-storage-and-identity.md): the index.
- A human reviewer for t32.
- Used later by [Phase 8](08-mcp-skills-and-status.md), which shows these counts in `project status`, holds the Human Experience Review of the status output, and writes the extract and review skills.

### Closeout Notes

- Four testing decisions: Guided Progress Review active for t32 under the decision record above; Automated Implementation Testing active for t30 and t31; Performance Testing and Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: The agent summarizes the Guided Progress Review against the one-file diff promise and records any friction that touches it. Reviewer: the implementing agent. Limit: the human reviewer's observations are evidence from that reviewer only.
- Optional experience handoff: Not applicable. The Guided Progress Review already holds the human's observations.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A636 to A638.
- Phase / capability status: To be recorded at closeout. The phase can close when A601 to A638 pass and the Stage 1 design is accepted.
