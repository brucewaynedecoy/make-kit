---
title: "Phase 3: Storage and Identity"
kind: "work"
status: "active"
coordinate: "W1 R1 P3"
source:
  type: "prd"
  path: "docs/prd/09-storage-and-indexing.md"
---

# Phase 3: Storage and Identity

## Purpose

This phase builds the storage layer that every later phase reads and writes through: one storage interface, the file backend that keeps one Markdown file per record, the derived SQLite index with its text search, the short write lock, the write journal, schema versions, the two IDs that every record carries, and the `project check` engine. It also fixes the two version values that the rest of the product relies on: the record version that guards writes and the content version that requirement marks keep.

It depends on the CLI skeleton, the operation catalog, the result envelope, the machine folder and `setup` from [Phase 2](02-cli-and-packaging.md), and on the core's Store base and the shared-file adapters from [Phase 1](01-shared-core-adoption.md).

## Overview

Record files stay the truth, so a person reviews and merges records in git as plain files. The index answers filters, reverse links, text search and read-only SQL from those files, keeps itself fresh after hand edits, checkouts and merges, and can always be rebuilt. The write lock keeps writes in one checkout in order, and the record version check keeps a write based on a stale read from landing. The journal makes a change to many records land whole or not at all, even after a crash, and runs large changes in batches so no writer holds the lock for long.

Every record gets a permanent 8-character `id` and a friendly `ref`. Name lookup accepts either, or an alias, and a ref clash after a merge is named by `project check` and fixed by `run record ref-fix` while the old `ref` still finds the record. The `project check` engine holds a check registry that later phases plug their codes into, and this phase registers the file, identity, status, relation, schema and journal codes.

This phase builds no `run record` verb except `ref-fix` and `query`. [Phase 4](04-record-types.md) registers the twelve record types in the type registry and builds `run record create`, `show`, `list`, `update`, `link`, `unlink`, `archive`, `supersede`, `confirm-evidence` and `schema` on this interface. [Phase 6](06-extraction-and-review.md) uses the batches, the shared people and roles journal entry and text search for duplicate hints. [Phase 7](07-analysis-and-exports.md) uses the content version, the requirement-marks index and text search for candidate matches. [Phase 8](08-mcp-skills-and-status.md) reads the index problem facts for `project status`. [Phase 9](09-v1-import-and-release.md) writes the v1 import as one journaled change.

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `direct`. Two promises from the [plan overview](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md#human-experience-propagation) name this phase. "A record change reads as a git diff of one Markdown file" is owned by [09 Storage and Indexing](../../prd/09-storage-and-indexing.md#record-changes-read-as-one-file-git-diffs) with [10 Records and Identity](../../prd/10-records-and-identity.md#statuses). "A ref clash is named by `project check` and fixed by one command; the old ref still resolves" is owned by [10 Records and Identity](../../prd/10-records-and-identity.md#a-ref-clash-is-named-and-fixed-by-one-command). The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind both.
- Intended human outcome: a reviewer reads any record change as a normal git diff of one Markdown file, where a single-field change shows only that field's line and the `updated_at` line, and a change to many records shows one small diff per record file. After a merge in which two branches minted the same `ref`, a person learns of the clash from `project check`, which names the `ref`, each record by title and the one command that fixes it, runs that command, and still finds the renamed record by its old `ref`.
- Human-facing surface or indirect effect: record files in `blueprint/records/<type>/<id>.md` and their git diffs; `project check`, `project reindex`, `project recover` and `run record ref-fix` output. Indirect effects: no lost or half-changed records after a crash, and no stale read that overwrites a person's edit.
- Implementation work: Stages 1 and 2 build the interface, the type registry and the file backend. Stages 3 and 4 build the index and the write lock. Stage 5 builds identity and name lookup. Stage 6 builds the status rules. Stage 7 builds the journal, batches and recovery. Stage 8 builds schema upgrades. Stage 9 builds text search, the filter syntax and read-only SQL. Stage 10 builds the `project check` engine, its codes and the ref fix. Stage 11 holds the Human Experience Review. Stage 12 characterizes index rebuild and query.
- Evidence source or testing type selected under current authority: Automated Implementation Testing, as the plan overview selects: diff tests on written files, the two-branch merge test for ref clashes, interface conformance tests on two backends, and lock and journal crash tests. Human Experience Review of a sample diff, here a sample approval-shaped diff made through the storage interface. The approved pending change that writes one file with the same `id` is tested in [Phase 6](06-extraction-and-review.md).
- Executor: the implementing coding agent writes and runs the tests in CI on macOS, Windows and Linux runners, and records the Human Experience Review.
- Accepted obligation or deferral route: none. The pending-change part of the one-file diff promise is planned work in Phase 6, not a deferral.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | Interface conformance tests on the file backend and the in-memory backend; serializer byte-equality tests on three operating systems; one-file diff tests on the serializer side only, since the approved pending change test belongs to [Phase 6](06-extraction-and-review.md); index freshness, rebuild and version tests; lock, version-check and concurrency tests; journal crash tests at every step; batch and recovery tests; schema upgrade tests; filter, search and SQL tests; the `project check` code fixtures; and the two-branch merge test with the ref fix. They decide whether later phases can write records through this interface. The acceptance criteria in each stage are the decision record. |
| Performance Testing | active | `characterize-now` baseline for index rebuild and query on a synthetic project the size of client-b-v3, under one `PERF-###` profile that t60 creates before the first measurement, as [09 Storage and Indexing](../../prd/09-storage-and-indexing.md#index-rebuild-and-query-characterization) states. It informs whether one file per record with a rebuilt index holds at that size or the index must change only the rows for changed files. It is not a pass or fail gate on the product. |
| Guided Progress Review | not-needed-now | The automated tests and the agent's Human Experience Review of real diffs and real check output answer the current decisions. No PRD names a guided review here. |
| Unassisted Goal Testing | not-needed-now | No PRD needs it for this phase, and no current decision depends on proof that a person finds the ref fix without help. |

Index rebuild and query candidate:

- Base maintenance action: `update-existing`
- Performance applicability: `characterize-now`
- Canonical `PERF-###` profile link or `none`: none yet. Task t60 writes the profile, with the next free `PERF-###` ID, in its own characterization record under `docs/assets/project/performance/` before the first measurement. This work phase owns it.
- Finite evidence budget and stop-rule reference or `not-applicable`: set in that profile under the contract's bounded-work rule before any run. This phase grants no budget beyond the profile's finite limits.
- Execution packet link or `not-applicable`: none yet. Task t62 renders a finite packet from the profile and links it from the Stage 12 closeout.
- Outcome and evidence handoff or `none`: none yet. The result record and the `A355` to `A360` section of `evidence.md` carry the outcome, and the owner's decision on the index design goes to R-006. [Phase 8](08-mcp-skills-and-status.md) runs the profile's status read model workload once status exists, inside the profile's remaining budget.
- Gate disposition and supported-scope limit or `not-applicable`: a `characterization-baseline`, so it gates no product claim. The Stage 12 gate rejects a missing, expired, invalid, non-comparable or unrun characterization and records one of `pass`, `fail`, `revise`, `blocked` or `waived`. The result covers only the synthetic project and the measured runners, and supports no speed claim for client projects.

Human Experience Review stays separate from these four testing types. In this phase the agent reviews real record diffs and real `project check` and `run record ref-fix` output in Stage 11, and records observations, conclusions, limits and next actions for both promises.

## Source PRD Docs

- [09 Storage and Indexing](../../prd/09-storage-and-indexing.md)
- [10 Records and Identity](../../prd/10-records-and-identity.md)
- [08 CLI and MCP](../../prd/08-cli-and-mcp.md), for the filter syntax, read-only SQL and the `project` commands
- [07 Installation and Distribution](../../prd/07-installation-and-distribution.md), for the record upgrade in the project update
- [05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md), for the journaled write to `.make/personas.yaml`
- [18 Local Server and UI](../../prd/18-local-server-and-ui.md), for the one write lock shared with the v2.2 local server

## Source Obligations, Scenarios, And Findings

- Obligations: none in this phase. [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check) stays with [Phase 4](04-record-types.md), which plugs the Make Docs link skip into the check engine built here.
- Risks this phase addresses: [R-006 Index Rebuild and Query at Large Project Size](../../prd/03-open-questions-and-risk-register.md#r-006-index-rebuild-and-query-at-large-project-size), [R-007 Interface Built Before a Second Real Backend](../../prd/03-open-questions-and-risk-register.md#r-007-interface-built-before-a-second-real-backend), [R-008 `updated_at` Conflicts on Merge](../../prd/03-open-questions-and-risk-register.md#r-008-updated_at-conflicts-on-merge), [R-009 Journal Lost With the Store](../../prd/03-open-questions-and-risk-register.md#r-009-journal-lost-with-the-store), [R-010 Status and Check Disagree](../../prd/03-open-questions-and-risk-register.md#r-010-status-and-check-disagree), [R-011 Two IDs for One Record](../../prd/03-open-questions-and-risk-register.md#r-011-two-ids-for-one-record), [R-012 Hand Edits](../../prd/03-open-questions-and-risk-register.md#r-012-hand-edits) and [R-015 Runaway Read-Only SQL](../../prd/03-open-questions-and-risk-register.md#r-015-runaway-read-only-sql). R-008, R-009 and R-015 need an owner decision; this phase supplies the evidence and does not choose for the owner.
- Decisions carried: [Q-017](../../prd/03-open-questions-and-risk-register.md#q-017-index-lock-and-journal-location), [Q-018](../../prd/03-open-questions-and-risk-register.md#q-018-id-alphabet-and-length), [Q-019](../../prd/03-open-questions-and-risk-register.md#q-019-which-record-keeps-a-clashing-ref), [Q-020](../../prd/03-open-questions-and-risk-register.md#q-020-setup-b-shape-and-its-shared-write-lock), [Q-021](../../prd/03-open-questions-and-risk-register.md#q-021-deleting-records), [Q-067](../../prd/03-open-questions-and-risk-register.md#q-067-candidate-matches-and-similar-capabilities) and [Q-076](../../prd/03-open-questions-and-risk-register.md#q-076-version-that-requirement-marks-keep).
- Scenarios: none.
- Findings: none.

## Stage 1 - Storage Interface, Type Registry and Conformance

### Tasks

- [ ] t1: Define the storage interface with typed inputs and results for `read`, `resolve`, `query`, `links`, `search`, `create`, `modify`, `apply`, `run_sql`, `refresh_index`, `rebuild_index`, `upgrade_schema`, `recover` and `describe`, and the errors `not-found`, `ambiguous`, `invalid`, `conflict`, `busy`, `newer-schema` and `recovery-needed`. It has no delete operation (Q-021), callers address records by `id`, and no result carries a file path ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#storage-interface)).
- [ ] t2: Define the record type registry that the serializer, validation and index read: each type's value and `id` prefix, its fields with need and allowed values, its fixed field order, its relation fields with target types and cardinality, its tree fields, relation fields inside list entries such as `requirement_marks`, the fields its content version covers, and its schema version line with upgrade steps. Test it with fixture types only; the registry refuses a work item type. [Phase 4](04-record-types.md) registers the twelve v2.0 types ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#sibling-modules)).
- [ ] t3: Build the in-memory backend as its own implementation, not a wrapper of the file backend, for the conformance tests only (R-007) ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#component-and-capability-map)).
- [ ] t4: Write the conformance suite that runs every interface operation and every error against the file backend and the in-memory backend and compares their results ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#component-and-capability-map)).
- [ ] t5: Write an import-boundary check that fails when code above the interface reads or writes record files, the index, the lock or the journal directly ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#component-and-capability-map)).

### Acceptance criteria

- A301: The conformance suite passes on both backends with identical results, and fails when a fixture change makes an interface result carry a file path.
- A302: A snapshot test of the interface's public surface shows no delete operation, and a registry test refuses a fixture work item type.
- A303: The import-boundary check fails on a fixture module above the interface that imports the file backend or reads `blueprint/records/` with `node:fs`, and passes on the kit source tree.

### Dependencies

- [Phase 2](02-cli-and-packaging.md) Stage 1 for the source folders and the operation catalog.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable. The interface has no person-facing surface.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A301` to `A303` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A301` to `A303` pass. R-007 closes when the in-memory backend passes the same suite as the file backend.

## Stage 2 - File Backend and Record Serializer

### Tasks

- [ ] t6: Build the file backend: each record lives at `blueprint/records/<type>/<id>.md`, each `<type>/` folder appears with its first record, and only the file backend writes under `blueprint/records/` ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#record-files)).
- [ ] t7: Build the record serializer: UTF-8 with no byte order mark; read LF or CRLF, keep the style a file has and write new files with LF; write fields in the registry's fixed order, always write required fields and leave out optional fields with no value; write plain YAML that quotes text only when YAML would read it as another kind of value, writes text with line breaks as a literal block, and never writes anchors, aliases or tags; write UTC ISO 8601 timestamps with seconds; and write project-relative paths with forward slashes, never an absolute machine path ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#record-files)).
- [ ] t8: Keep the body byte for byte unless the write changes it, keep a front matter field that Make Blueprint does not know after the known fields, keep list items in stored order, and put a new list item at the end of its list ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#record-changes-read-as-one-file-git-diffs)).
- [ ] t9: Write each record file atomically: write a temporary file in the same folder and replace the old file in one step, with a short retry for Windows replace failures that leaves the old file whole ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#record-files)).
- [ ] t10: Leave a record file that does not parse out of the index and list it as a problem, so one bad file never stops a read, a rebuild or `project check` ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#record-files)).
- [ ] t11: Write the one-file diff tests: a change to one record changes exactly one git-tracked file, a single front matter field change touches only that field's line and the `updated_at` line, a body change touches only the changed body lines, creating a record changes no other record's file, and git holds no counter, registry, manifest or index file of records ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#record-changes-read-as-one-file-git-diffs)).

### Acceptance criteria

- A304: Serializing the same fixture records on macOS, Windows and Linux CI runners gives byte-identical files.
- A305: For each single-field change in the diff fixtures, `git diff` shows exactly two changed lines: that field and `updated_at`.
- A306: A fixture record file with CRLF line endings keeps CRLF after a write, and a newly created record file uses LF.
- A307: A process killed between the temporary write and the replace leaves the old record file whole and no half-written file in the folder.
- A308: In a fixture with one unparseable record file, a rebuild completes, the other records are indexed, and the problem list names the bad file.
- A309: After records are created on one branch, `git status` lists only the new record files.

### Dependencies

- Stage 1 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: Stage 11 reviews real diffs. Here the agent checks the diff fixtures against t11. To be recorded at closeout.
- Optional experience handoff: not applicable until Stage 11.
- Explicit human acceptance gate: none.
- Evidence report: the `A304` to `A309` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A304` to `A309` pass.

## Stage 3 - Derived Index, Freshness and Versions

### Tasks

- [ ] t12: Build the index on the built-in `node:sqlite` module with its own index schema version, separate from record schema versions, so a change to the index schema never changes a record file: one row per record with `id`, `ref`, `type`, `status`, `title`, `summary`, `schema_version`, timestamps, the record version, every front matter field and, on requirement and capability rows, the content version; aliases; relations with record, field, target `id` and list position, including those inside `requirement_marks` entries; evidence links with record, source `id`, anchor and recorded source version, including those in `requirement_marks`; requirement marks with the fit-gap record, the marked record, the recorded `version` and the `mark` value; facet values; title, summary and body text; and problems, such as files that do not parse ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#derived-index)).
- [ ] t13: Keep the index in the machine Store folder (Q-017), `~/.make/blueprint/` or the folder `MAKE_BLUEPRINT_HOME` names, keyed by the project ID in `.make/blueprint/config.yaml` and by checkout, as its own file beside the Store database, so two checkouts never share an index and deleting it touches no other Store state ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#derived-index)).
- [ ] t14: Build the freshness check that runs before every read and catches hand edits and the changes of a git checkout, pull or merge. It reads no record contents when no file changed, and it does not trust size and modification time alone when they cannot prove a file unchanged ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#derived-index)).
- [ ] t15: Rebuild the index without asking when it is missing, cannot be read or has another index schema; name `project reindex` when it cannot be used for another reason; and when the Store cannot be written, answer reads from a temporary index for that command and say the index could not be saved ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#derived-index)).
- [ ] t16: Build `project reindex` (MCP `project_reindex`, kind `derived`), which builds the index again from the record files ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#project)).
- [ ] t17: Work out the record version as the SHA-256 hash of the record file's content with every line ending read as LF, written as 64 lowercase hexadecimal characters, and return it from `read` ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#storage-interface)).
- [ ] t18: Work out the content version (Q-076) as the SHA-256 hash, with LF line endings, of one fixed serialization of the meaning fields: for a requirement `title`, `summary`, `kind`, `option_values`, `option_default`, `option_scope` and the body, and for a capability `title`, `summary` and the body. Field order, quoting and layout in the file do not change it, nor do tags, facets, `owners`, `stakeholders`, `audience`, links, evidence, timestamps or `schema_version`. One function serves `read`, the index, `run compare next` and `project check` ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#storage-interface)).
- [ ] t19: Build the `links` operation, which returns the records that link to or from one record by relation field, with the reverse direction from the index ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#storage-interface)).

### Acceptance criteria

- A310: After the index file is deleted, the next read rebuilds it and returns the same results as before.
- A311: Two git worktrees of one fixture project on one machine each get their own index file, and a record created in one does not appear in a query in the other.
- A312: After a fixture `git checkout` changes record files while keeping their sizes and moving their modification times by less than one second, the next query returns the new content.
- A313: With no record file changed, a file-access spy shows that the freshness check opens no record file.
- A314: The same requirement written with CRLF and with LF gives one record version and one content version; written with its fields in another order and quoting, it gives the same content version and a different record version.
- A315: Adding a tag, a facet code or an owner to a fixture requirement leaves its content version unchanged, and changing its `summary` changes it.
- A316: With a read-only Store folder, a fixture query succeeds and its output says the index could not be saved.

### Dependencies

- Stage 2 of this phase.
- [Phase 2](02-cli-and-packaging.md) Stage 3 for the machine folder, `MAKE_BLUEPRINT_HOME` and the project ID.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing measures this index in Stage 12; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none in this stage.
- Human Experience Review: not applicable. A person never runs a command to make results current; the freshness tests are the evidence of that indirect effect.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A310` to `A316` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A310` to `A316` pass.

## Stage 4 - Write Lock and Record Version Checks

### Tasks

- [ ] t20: Build one write lock for each checkout (Q-020) in the machine Store next to its index. Every process that writes records or updates the index for that checkout takes it: CLI commands, the MCP server, and in v2.2 the local server. A process holds it only while it mints refs, writes the files of one change and updates the index, never while it waits for a person or an agent, and a lock never crosses checkouts ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#write-lock)).
- [ ] t21: Make a process that finds the lock held wait a short, bounded time, then return `blocked` with code `busy`, name the process that holds it, and change nothing ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#write-lock)).
- [ ] t22: Clear a stale lock, one whose holding process no longer runs: the next process takes it over with no step by a person and notes it in diagnostic output ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#write-lock)).
- [ ] t23: Make `modify` and `apply` refuse with `conflict` and write nothing when the stored record version of any record differs from the version the caller passed ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#storage-interface)).
- [ ] t24: Make reads never wait for the lock. A read sees each record as it was before or after a write, never half written; a read during a change to many records sees all of them before or all of them after; while another process holds the lock, a read answers from the index as that process last left it; and the holder brings the index up to date before it releases the lock ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#storage-interface)).

### Acceptance criteria

- A317: A CLI process and an MCP server process that write in one checkout at the same time both land their writes in order, and neither sees a half-written file.
- A318: With the lock held by a live test process past the wait, a write returns `blocked` with `busy`, names the process, and the project is byte-identical.
- A319: With a lock left by a killed process, the next write takes the lock, succeeds, and its diagnostic output notes the takeover.
- A320: A `modify` that passes a record version read before a hand edit returns `conflict` and writes nothing.
- A321: Writes in two checkouts of one project run at the same time without waiting on each other.
- A322: A read during a journaled fixture change of several records sees either all old values or all new values.

### Dependencies

- Stage 3 of this phase.
- [Phase 1](01-shared-core-adoption.md) Stage 1 and the core's Store base, on which the lock sits.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads the `busy` result and records whether it says what is blocked, who holds the lock and that running the command again later is safe, with its limits. To be recorded at closeout.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A317` to `A322` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A317` to `A322` pass.

## Stage 5 - Identity and Name Lookup

### Tasks

- [ ] t25: Mint each `id` (Q-018) as the type prefix, a hyphen and an 8-character code of lowercase ASCII letters and digits with one or more letters, with one alphabet and one length for every type. Before `create` writes a new record, it checks the record files and the index in the checkout for the new `id` and mints again on a hit ([10 Records and Identity](../../prd/10-records-and-identity.md#the-id)).
- [ ] t26: Mint each `ref` under the write lock as the same prefix, a hyphen and a decimal number of three or more digits, padded with zeros and growing past three digits when needed, one more than the highest number in any `ref` or alias with that prefix in the checkout ([10 Records and Identity](../../prd/10-records-and-identity.md#the-ref)).
- [ ] t27: Build `create`: mint the `id` and `ref`, set `schema_version`, `created_at` and `updated_at`, validate the record against the registry, and write it ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#storage-interface)).
- [ ] t28: Enforce alias rules: each alias is one word of letters, digits, hyphens, underscores or dots; it is not repeated in one record and never equals the record's own `ref`; two records may share an alias; aliases are kept for good ([10 Records and Identity](../../prd/10-records-and-identity.md#aliases-and-name-lookup)).
- [ ] t29: Build `resolve`, the one name lookup that every command argument naming a record uses. It ignores letter case and follows the six steps in order: an `id`, the `ref` of one record (naming any records that hold it as an alias), a ref clash (`ambiguous-ref`, listing the records by `id` and title and naming `run record ref-fix <ref>`), the alias of one record, an alias of several records (`ambiguous-ref`), and no match (`unknown-record`). Machine output says whether the name matched as an `id`, a `ref` or an alias ([10 Records and Identity](../../prd/10-records-and-identity.md#aliases-and-name-lookup)).

### Acceptance criteria

- A323: A property test over many mints finds every `id` code 8 characters long, made only of lowercase letters and digits, with one or more letters.
- A324: With a seeded random source that first returns a code already in use, `create` mints again and writes the second code.
- A325: Two processes that create records in one checkout at the same time never mint the same `ref`.
- A326: With `REQ-040` as the highest `ref` and `REQ-041` held as an alias, the next minted `ref` is `REQ-042`.
- A327: Name-lookup fixtures for each of the six steps return the expected record or problem code, and machine output names the match kind.

### Dependencies

- Stage 4 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads the `ambiguous-ref` and `unknown-record` results and records whether a person can tell which records are meant and what to run, without first learning the `id` format. To be recorded at closeout.
- Optional experience handoff: not applicable until Stage 10.
- Explicit human acceptance gate: none.
- Evidence report: the `A323` to `A327` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A323` to `A327` pass.

## Stage 6 - Status Rules

### Tasks

- [ ] t30: Enforce the status table inside storage validation for every status change: `draft` to `active`, `rejected` or `superseded`, `active` to `superseded` or `archived`, and no change out of the end states `rejected`, `superseded` and `archived`. A refused change names the statuses the record can move to. The commands that make these changes come in [Phase 4](04-record-types.md), [Phase 6](06-extraction-and-review.md) and [Phase 7](07-analysis-and-exports.md) ([10 Records and Identity](../../prd/10-records-and-identity.md#statuses)).
- [ ] t31: Enforce `superseded_by`: a change to `superseded` needs it; it names an existing record of the same type; following it from record to record ends at a record that is not `superseded`, with no loop; and it appears only on a `superseded` record ([10 Records and Identity](../../prd/10-records-and-identity.md#statuses)).
- [ ] t32: Make storage refuse a change to a record's `id`, `type` or `created_at`, and allow a change to its `ref` only from the ref fix ([10 Records and Identity](../../prd/10-records-and-identity.md#the-ref)).

### Acceptance criteria

- A328: For each pair of the five statuses, a fixture status change succeeds when the table allows it and is otherwise refused with a problem that names the allowed statuses, and a refused change leaves the file byte-identical.
- A329: A change to `superseded` with no `superseded_by`, with a `superseded_by` of another type, or with a loop is refused, and a `modify` that changes `id`, `type`, `created_at` or `ref` is refused.

### Dependencies

- Stage 5 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads a refused status change and records whether it names the statuses the record can move to. To be recorded at closeout.
- Optional experience handoff: not applicable. Phase 4 builds the commands a person runs.
- Explicit human acceptance gate: none.
- Evidence report: the `A328` and `A329` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A328` and `A329` pass.

## Stage 7 - Write Journal, Batches and Recovery

### Tasks

- [ ] t33: Build `apply` as one journaled change, one batch per call: take the write lock; write the journal with each file's path, version and full content before the change, or a note that it is new, and its full content after; make sure the journal is on disk; write each record file atomically; update the index in one transaction; mark the journal done, delete it and release the lock ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#write-journal)).
- [ ] t34: Build the recovery step that every write command runs first, before any other write in the checkout. It discards an incomplete journal, finishes a complete journal whose files are all in their before or after state and says so in one line, undoes a failed write from the before content without git, and, when a file is in neither state, changes nothing, names each such file and returns `recovery-needed` with `project recover` as the next action ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#write-journal)).
- [ ] t35: Build `project recover` (MCP `project_recover`, kind `write`), which runs the same step on its own and offers to finish the change, undo it, or keep the files as they are ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#project)).
- [ ] t36: Build the batch runner for large changes: each batch is its own journaled change that checks the record versions it read, the lock is released between batches, a batch that cannot land stops the run with `partial` naming the records written and the records still waiting and the same command as the next action, a rerun goes on with the waiting records and never writes a record twice, and a crash recovers only the batch in progress. [Phase 6](06-extraction-and-review.md) runs large approvals through it ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#write-journal)).
- [ ] t37: Let one journaled change hold, beside record files, the other project files that the same change writes, so they never fall out of step with the records after a crash: the core's writes to `.make/personas.yaml` and `.make/config.yaml`, and files under `blueprint/sources/` such as converted text, table CSV files and the managed `.gitignore` and `.gitattributes`. Record files still go only through the file backend. [Phase 5](05-intake-and-conversion.md) uses it for intake and conversion, [Phase 6](06-extraction-and-review.md) for persona approvals and [Phase 9](09-v1-import-and-release.md) for the v1 import ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#shared-core)).
- [ ] t38: Write the crash tests that stop the process at each of the five steps of a journaled change, and a disk-full test during the file writes ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#write-journal)).

### Acceptance criteria

- A330: For a crash at each of the five steps, after restart the fixture records are all in their old state or all in their new state, or the next write reports `recovery-needed` naming the hand-changed file.
- A331: A simulated disk-full failure during the file writes leaves every changed file at its before content and returns `failed`.
- A332: On a fixture with a hand-changed file in an interrupted change, `project recover` offers finish, undo and keep, and each choice leaves the files in the expected state.
- A333: In a batch run where a record changes by hand after it was read, the run stops with `partial` and lists the written and waiting records; the rerun writes only the waiting records; the per-file diffs equal those of the same change run as one batch.
- A334: A journaled fixture change that holds a core write to `.make/personas.yaml`, a write to `blueprint/sources/.gitignore` and two records, crashed after the journal is on disk, leaves both files and both records all old or all new after recovery.
- A335: Undo after a crash works in a fixture folder that is not a git repository.

### Dependencies

- Stages 4 to 6 of this phase.
- [Phase 1](01-shared-core-adoption.md) Stage 5 for the core's write call for `.make/personas.yaml`.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads real `recovery-needed` and `project recover` output and records whether a person can tell what stopped, which file changed and what each choice will do. To be recorded at closeout.
- Optional experience handoff: not applicable. A person reaches recovery only after a crash; the review above covers its output.
- Explicit human acceptance gate: none.
- Evidence report: the `A330` to `A335` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A330` to `A335` pass. R-009 stays open for the owner's decision.

## Stage 8 - Schema Versions and the Record Upgrade

### Tasks

- [ ] t39: Build schema versions: every record carries `schema_version`, each type has its own version line, every schema change ships an upgrade step from one version to the next, and steps run in order, keep unknown fields and keep the body. A record on an older version that this release knows is read by upgrading it in memory, and a normal write of it writes the current version ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#schema-versions)).
- [ ] t40: Make a record on a newer schema version than this release knows readable and listable but never changed: a write returns `newer-schema` ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#schema-versions)).
- [ ] t41: Add the record upgrade to the project update in `setup` from Phase 2, never to `update`: show how many records of each type are on an older version, upgrade them through `upgrade_schema` as one journaled change, report the count upgraded for each type, and name any record it could not upgrade and why ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#project-update)).

### Acceptance criteria

- A336: In a fixture project with records on version 1 of a fixture type now at version 2, `setup --yes` reports the count for that type, upgrades every such record, and `git diff --stat` shows one changed file for each upgraded record.
- A337: A fixture record on a newer schema version is returned by `read`, and a `modify` of it returns `newer-schema` and writes nothing.
- A338: After `update`, the fixture records keep their old schema version.

### Dependencies

- Stage 7 of this phase.
- [Phase 2](02-cli-and-packaging.md) Stages 6 and 7 for `setup` and `update`.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads real `setup` output after an upgrade and records whether it says how many records of each type changed and names any it could not upgrade. To be recorded at closeout.
- Optional experience handoff: not applicable. The first real schema change arrives after v2.0.
- Explicit human acceptance gate: none.
- Evidence report: the `A336` to `A338` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A336` to `A338` pass.

## Stage 9 - Text Search, Filter Syntax and Read-Only SQL

### Tasks

- [ ] t42: Build `search` (Q-067): match a text against record titles, summaries and bodies and give each match a score worked out from the index content alone, with one matching rule for every caller, the same records, order and scores for the same files and text on every run and machine, and no embeddings or network service. [Phase 6](06-extraction-and-review.md) uses it for duplicate hints and [Phase 7](07-analysis-and-exports.md) for candidate matches and the similar-capabilities check ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#storage-interface)).
- [ ] t43: Build the filter parser, one for the CLI and MCP, from the filter grammar: terms separated by spaces; `type:`, `status:`, `<field>:`, `<link-field>:<record>`, `facet.<name>:<value>`, `links:` with an anchor or a table position, `has:` and `text:`; `>`, `>=`, `<` and `<=` for dates and numbers; commas for alternatives, a leading `-` for negation and double quotes for values with spaces; only the first `:` of a term ends its key ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#filter-grammar)).
- [ ] t44: Run each filter as one index query through `query`. A link field, `id`, `ref` and `links` accept an `id`, `ref` or alias and match by the permanent `id`; a field term with no `type` term applies to every type with that field; values match exactly and enumerated values ignore case; an unknown key, facet or value returns `failed` with `unknown-filter-key` or `unknown-filter-value`, names the term, and lists the valid keys or values ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#filter-syntax)).
- [ ] t45: Publish the syntax as `make-blueprint://system/reference/filter-syntax.md` ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#filter-syntax)).
- [ ] t46: Build the read views `records`, `record_aliases`, `record_links`, `record_evidence`, `record_facets` and `record_problems` as the supported SQL surface, publish their columns as a reference resource, and treat a column change as a breaking change named in the release notes ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#what-backs-the-filter-syntax-and-read-only-sql)).
- [ ] t47: Build `run_sql` and `run record query <sql>` (MCP `record_query` with a `sql` argument, kind `read`). It brings the index up to date, opens it through a separate read-only connection, accepts one statement that is a `SELECT` or a `WITH` ending in a `SELECT`, and returns `failed` with `sql-not-read-only` and runs nothing for a statement that would change data or schema, attach a database, load an extension or change a setting. It returns up to 1,000 rows by default, changed by `--limit`, says when rows were cut, shows a table in human output and column names and rows in machine output, and reads only the index ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#read-only-sql)).
- [ ] t48: Find out whether `node:sqlite` offers a time or step limit that can stop a slow query, and record the finding in R-015 for the owner's decision ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#read-only-sql)).

### Acceptance criteria

- A339: A fixed search fixture returns the same records, order and scores on three runs and on macOS, Windows and Linux runners, with the network blocked.
- A340: Each example filter in the 08 examples table parses and selects the expected fixture records, and the same filter given to the CLI and to MCP selects the same records in the same order.
- A341: A filter that names a record by its old `ref` after a ref fix still matches that record.
- A342: The filter `type:requirement colour:red` returns `failed` with `unknown-filter-key`, names `colour`, and lists the valid keys for requirement records.
- A343: Each of `INSERT`, `UPDATE`, `DELETE`, `REPLACE`, `CREATE`, `DROP`, `ALTER`, `ATTACH`, `VACUUM` and a `PRAGMA` that sets a value returns `failed` with `sql-not-read-only`, and the index file and every record file are byte-identical afterwards.
- A344: A query that matches more rows than the cap returns the cap and says rows were cut, and `SELECT name, sql FROM sqlite_schema` lists the six documented views.

### Dependencies

- Stages 3 and 5 of this phase.
- [Phase 2](02-cli-and-packaging.md) Stages 1 and 4 for the catalog and the resource surface.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing measures search and filters in Stage 12; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none in this stage.
- Human Experience Review: the agent reads the `unknown-filter-key` and `sql-not-read-only` results and records whether each names the bad term and the valid form. To be recorded at closeout.
- Optional experience handoff: run `make-blueprint run record query 'SELECT type, count(*) FROM records GROUP BY type'` in a sample project and notice whether the table answers the question. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A339` to `A344` section of `evidence.md` in this backlog folder, with the R-015 finding. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A339` to `A344` pass. R-015 stays open for the owner's decision.

## Stage 10 - Project Check Engine and Ref Fix

### Tasks

- [ ] t49: Build the `project check [--filter <expr>]` engine (MCP `project_check`, kind `read`) with a check registry in which each check declares its code, its level (`error`, `warning` or `information`), its rule owner and its next action, so later phases plug their codes in. It checks every record file through the index, reports every problem in one run, never changes a file and works offline. Each problem names the record by `ref` and title, its `id` and path, the field, the problem in plain words and the next action; machine output carries the code, level, `id`, `ref`, path, field and next action. Any error ends the run `partial`; warnings and information alone end it `success`. The problem facts live in the index, so `project status` in [Phase 8](08-mcp-skills-and-status.md) reads the same counts (R-010) ([10 Records and Identity](../../prd/10-records-and-identity.md#check-catalog)).
- [ ] t50: Register the record file and form codes `merge-conflict`, `parse-error`, `not-canonical`, `schema-old` (naming `make-blueprint setup`), `schema-newer` and `journal-pending` ([10 Records and Identity](../../prd/10-records-and-identity.md#check-catalog)).
- [ ] t51: Register the identity codes `id-format`, `id-file-mismatch`, `duplicate-id`, `ref-format`, `ref-clash` (naming `run record ref-fix <ref>`) and `alias-format` ([10 Records and Identity](../../prd/10-records-and-identity.md#check-catalog)).
- [ ] t52: Register the status codes `superseded-target` and `superseded-no-target`, which judge only the result of a hand edit ([10 Records and Identity](../../prd/10-records-and-identity.md#statuses)).
- [ ] t53: Build the relation rules from the registry, in write validation and as the codes `broken-link`, `link-not-id` (naming the `id` it resolves to), `link-type`, `link-cardinality`, `self-link`, `tree-loop`, `inactive-link` and `superseded-link` (naming the record at the end of the `superseded_by` chain). Relation fields store `id` values, each relation sits on one side only, and `requirement`, `capability` and `capabilities` inside `requirement_marks` entries follow the same rules ([10 Records and Identity](../../prd/10-records-and-identity.md#relation-rules)).
- [ ] t54: Build `run record ref-fix <ref>` (Q-019; MCP `record_ref_fix`, kind `write`). The record created first, by earliest `created_at` and then lower `id` compared as text, keeps the `ref`; each other record gets a newly minted `ref` with the old one at the end of its `aliases`; the whole fix is one journaled change that changes only the renamed records' `ref`, `aliases` and `updated_at` lines, no relation, no evidence link and no prose; the same checkout content gives the same result on every machine; the output names each renamed record by title with its old and new `ref` and says the old `ref` still finds it; a `ref` that no two records share changes nothing and says so ([10 Records and Identity](../../prd/10-records-and-identity.md#run-record-ref-fix)).
- [ ] t55: Write the two-branch merge test: both branches create a record that mints `REQ-042`, the branches merge, `project check` runs, `run record ref-fix REQ-042` runs, and `project check` and name lookup run again. A second case mints the same `id` on both branches and expects `merge-conflict` ([10 Records and Identity](../../prd/10-records-and-identity.md#a-ref-clash-is-named-and-fixed-by-one-command)).
- [ ] t56: Write a two-branch test that changes different fields of one record on each branch, record whether the `updated_at` line conflicts on merge, and route the result to R-008 for the owner's choice of approach ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#rebuild-notes)).

### Acceptance criteria

- A345: A fixture set with one case for each code that this phase registers makes one `project check` run report every code at its level, with every machine field filled, and the fixture files are byte-identical after the run.
- A346: A fixture with only warnings ends `success` with exit code 0 and lists the warnings; a fixture with one error ends `partial` with exit code 1.
- A347: In the merge test, `project check` reports exactly one `ref-clash` for `REQ-042`, naming both records by title, `id` and path, and the command `run record ref-fix REQ-042`.
- A348: After `run record ref-fix REQ-042`, only the renamed record's file changed, and its diff shows only the `ref`, `aliases` and `updated_at` lines; `project check` reports no clash; `REQ-042` finds the keeper and names the renamed record as also known by it; and the new `ref` finds the renamed record.
- A349: The ref fix run on macOS and Linux runners after the same merge gives byte-identical diffs.
- A350: `run record ref-fix REQ-007` with no clash ends `success`, changes nothing, and says no two records share it.
- A351: The human output of the ref fix names each renamed record by title with its old and new `ref`, and shows no `id`.
- A352: The same-`id` merge case reports `merge-conflict` on that record file.

### Dependencies

- Stages 2 to 9 of this phase.
- [Phase 4](04-record-types.md) plugs the field, slug, evidence, type-rule and Make Docs link codes into this engine, and [Phase 5](05-intake-and-conversion.md) to [Phase 7](07-analysis-and-exports.md) plug in their source, extraction and fit-gap mark codes.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: Stage 11 reviews the real ref-clash and ref-fix output. Here the agent checks the code fixtures against t49. To be recorded at closeout.
- Optional experience handoff: in a scratch project, create a record on two branches, merge them, run `make-blueprint project check`, then the command it names, and notice whether you can still find the renamed record by its old `ref`. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A345` to `A352` section of `evidence.md` in this backlog folder, with the R-008 result. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A345` to `A352` pass. R-012 closes for this phase's codes when `A345` passes; later phases close it for theirs.

## Stage 11 - Record Diff and Ref Fix Review

### Tasks

- [ ] t57: Prepare and record the Human Experience Review of a sample approval-shaped diff: an `apply` that sets several fixture drafts to `active` and changes one field on another record. Read the real `git diff` and record, for the one-file diff promise, the observation, conclusion, limit and next action in `evidence.md`. [Phase 6](06-extraction-and-review.md) reviews the diff of a real review approval and of an approved pending change ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#record-changes-read-as-one-file-git-diffs)).
- [ ] t58: Prepare and record the Human Experience Review of the real `project check` output for the merged ref clash and of the real `run record ref-fix` output, in human and machine form, for the ref-clash promise ([10 Records and Identity](../../prd/10-records-and-identity.md#a-ref-clash-is-named-and-fixed-by-one-command)).

### Acceptance criteria

- A353: `evidence.md` holds the review of the sample diff with an observation, conclusion, limit and next action for the one-file diff promise.
- A354: `evidence.md` holds the review of the ref-clash and ref-fix output with an observation, conclusion, limit and next action for the ref-clash promise, and states that the review makes no claim about a person's ease.

### Dependencies

- Stages 7 and 10 of this phase.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: this stage is the review. The agent records per-promise observations, conclusions, limits and next actions from the real diffs and output; the limit is that a sample diff stands in for a real review approval until Phase 6. To be recorded at closeout.
- Optional experience handoff: open the sample approval diff in your usual git tool and notice whether each record's change reads on its own. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A353` and `A354` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the ref-clash promise is complete when `A347` to `A354` pass; the one-file diff promise stays partial until Phase 6 tests the approved pending change.

## Stage 12 - Index Rebuild and Query Characterization

### Tasks

- [ ] t59: Build a deterministic generator for a synthetic project the size of client-b-v3, about 280 sources and several thousand records, from a fixed seed and fixture types shaped like source, requirement and capability records, with no client data ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#index-rebuild-and-query-characterization)).
- [ ] t60: Before the first measurement, write the index profile with the next free `PERF-###` ID in its own characterization record under `docs/assets/project/performance/`, from `make-docs://system/template/performance-evidence-profile.md`. Record base action `update-existing`, applicability `characterize-now`, target class `characterization-baseline`, the protected outcome and decision informed from 09, this work phase as the canonical owner and the repository owner as approver, the supported scope, the environment and the synthetic workload, and the workloads: a full rebuild, a freshness check when nothing changed, a freshness check after a merge that changes many files, common filter queries, the text search behind candidate matches and the similar-capabilities check, and the status read model. Record finite limits for passes, correction attempts, review cycles, elapsed time, compute and spend, the stop rules and the outcome rules. State no target ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#index-rebuild-and-query-characterization)).
- [ ] t61: Validate the fixture and the measurement seam before measuring: the conformance suite and the index tests pass on the synthetic project, and each workload starts and stops where the profile says ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#index-rebuild-and-query-characterization)).
- [ ] t62: Render a finite execution packet from the profile and run every workload except the status read model inside the profile's budget. Write the result record, with the observed distributions, uncertainty, fingerprint, budget ledger and one outcome, link the packet and result from the Stage 12 closeout, and route the owner's decision on the index design to R-006. The status read model workload runs in [Phase 8](08-mcp-skills-and-status.md) inside the remaining budget; when Phase 4 registers the real types, only the affected checks run again ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#index-rebuild-and-query-characterization)).
- [ ] t63: Run `make-docs run performance evidence validate --target-root kits/make-blueprint` from the repository root after the profile and the result exist ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#index-rebuild-and-query-characterization)).

### Acceptance criteria

- A355: The generator gives output with the same digest on two runs from the same seed, and the output holds only synthetic names.
- A356: The profile file exists, in git history, before any index result is recorded, names `characterization-baseline`, lists the six workloads, and states no target.
- A357: The profile names a finite limit for each of passes, correction attempts, review cycles, elapsed time, compute and spend, and a stop rule for budget exhaustion and diminishing return.
- A358: The result record binds the profile ID, version and digest, the build, the evidence fingerprint and the budget ledger, and records exactly one outcome from `pass`, `fail`, `revise`, `blocked` and `waived`.
- A359: The result record marks the status read model workload as not yet run and names Phase 8 as where it runs.
- A360: The performance evidence validator exits zero with `status: passed`.

### Dependencies

- Stages 3, 9 and 10 of this phase.
- [Phase 8](08-mcp-skills-and-status.md) runs the status read model workload of this profile once status exists.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing active as a `characterize-now` baseline; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: base action `update-existing`; applicability `characterize-now`; profile, packet, result, fingerprint, budget used and remaining, outcome and supported scope to be recorded at closeout. No finding, waiver or expiry is planned. The gate rejects a missing, invalid, non-comparable or unrun characterization for the workloads this phase runs.
- Human Experience Review: not applicable. The characterization is indirect evidence for the decision in R-006 and makes no human-outcome claim.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none. The owner's decision on the index design is a product decision routed to R-006, not a gate on this stage.
- Evidence report: the `A355` to `A360` section of `evidence.md` in this backlog folder, linking the profile, packet and result. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the phase closes when `A301` to `A360` pass, with the one-file diff promise partial until Phase 6 and the status workload of the profile open until Phase 8.
