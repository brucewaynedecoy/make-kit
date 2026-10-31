---
title: "09 Storage and Indexing"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 09 Storage and Indexing

## Purpose

Make Blueprint keeps each record as one Markdown file in the project folder, and it answers questions about records from a local SQLite index built from those files. This PRD owns the storage interface that every record read and write passes through, the file backend that ships in v2.0, the layout and form of record files, the derived index, the short write lock, the write journal and crash recovery, record schema versions, and what setups A, B and C mean for storage.

Storage keeps two things true at once. Records stay plain files that people review and merge in git. People and agents still get fast answers about thousands of records. The storage interface also keeps a shared database backend possible for setup C in v3, with no change to the data model or to the commands above the interface.

## Scope

This PRD covers:

- The storage interface: its operations, its errors, and the rule that every record read and write goes through it.
- The record version, the value that write checks use to tell whether a record file changed.
- The content version, the value that fit-gap requirement marks keep to tell whether the meaning of a requirement or capability changed.
- The file backend (v2.0): the record file path, YAML front matter, the Markdown body, and the rules that keep each change a small git diff.
- The derived index: what it holds, where it lives, how it stays fresh and how it is rebuilt.
- What the index provides to the shared filter syntax, to read-only SQL and to text search.
- The short write lock for `ref` minting, record writes and index updates.
- The write journal for changes to many records, batches for large approvals, and crash recovery.
- Record schema versions, and their upgrade when `setup` runs again in a project.
- Storage in setups A, B and C, including the one shared write lock in setup B.
- The conformance tests that run the interface against a second, simple backend.
- The index rebuild and query characterization baseline.

Other PRDs own these related topics:

| Topic | Owner |
| --- | --- |
| Common fields, statuses, `id` and `ref` rules, aliases, facets, evidence links, relation rules and the catalog of the `project check` command | [10 Records and Identity](10-records-and-identity.md) |
| Fields, relations and field order for each record type | [11 Record Types Reference](11-record-types-reference.md) |
| The filter syntax, the read-only SQL command, the `run` verbs, output formats and the `status` read model | [08 CLI and MCP](08-cli-and-mcp.md) |
| The `.make/blueprint/` and `blueprint/` folders, the machine Store folder, the project config file and the project ID | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| The `setup` and `update` commands as a whole | [07 Installation and Distribution](07-installation-and-distribution.md) |
| The shared `.make/personas.yaml` file and the core code that writes it | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| Original files, converted text and anchors under `blueprint/sources/` | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| The Store base in `packages/core` | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| The local server and its views | [18 Local Server and UI](18-local-server-and-ui.md) |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 2: setups; section 8: storage; section 16: Q-009, Q-020, Q-067, Q-076; Consequences: file count, interface without a second backend; Left for planning: where the local index lives)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/02-records-and-storage.md` (Field and Setting Names: record version, content version)
- `blueprint/records/<type>/<id>.md`
- `~/.make/blueprint/`

## Component and Capability Map

| Component | What it does | Release |
| --- | --- | --- |
| Storage interface | The one way Make Blueprint operations read, find, create and change records | v2.0 |
| File backend | Stores each record as `blueprint/records/<type>/<id>.md`. It is the only code that writes record files. | v2.0 |
| Record serializer | Reads record files and writes them in one canonical form | v2.0 |
| Index | A SQLite database, derived from record files, that answers filters, link lookups, text search and read-only SQL | v2.0 |
| Write lock | A short lock for each checkout that guards `ref` minting, record writes and index updates | v2.0 |
| Write journal | A note of a change to many records, written before the first file changes, and used to finish or undo that change after a crash | v2.0 |
| Schema upgrader | Steps that move records from an older schema version to the current one | v2.0 |
| In-memory backend | A second, simple backend that keeps records in memory. It runs the interface conformance tests. It is not a setup that people use. | v2.0, tests only |
| Database backend | A backend that keeps records in a shared database for setup C | v3, designed later |

A checkout is one working folder of a project on one machine, such as a clone or a git worktree. Two checkouts of one project share its project ID, but they can hold different record files, because each can sit on a different branch.

Requirements:

- Every Make Blueprint operation that reads or writes records goes through the storage interface. No code above the interface reads or writes record files, the index, the lock or the journal directly.
- In file mode, only the file backend writes files under `blueprint/records/`.
- One conformance test suite runs against the file backend and against the in-memory backend. Every operation above the interface gives the same results on both.
- The in-memory backend is its own implementation, not a wrapper of the file backend, so that file-only assumptions in the interface fail its tests.
- The record files are the truth. Deleting the index, the lock or the journal folder for a checkout loses no record data.

### Record Changes Read as One-File Git Diffs

This PRD owns the promise that a reviewer reads a record change as a normal git diff of one Markdown file. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind it.

Requirements:

- A change to one record changes exactly one git-tracked file under `blueprint/records/`: that record's file. Make Blueprint keeps no counter file, registry, manifest or index of records in git.
- Creating a record changes no other record's file. Each relation is stored on one side only, as [10 Records and Identity](10-records-and-identity.md) defines, and the reverse direction comes from the index.
- The serializer writes the same bytes for the same record content on macOS, Windows and Linux.
- Changing one front matter field changes only the lines of that field and the `updated_at` line. Changing the body changes only the body lines that changed.
- The serializer keeps the field order that [11 Record Types Reference](11-record-types-reference.md) lists, and keeps list items in their stored order. A new list item goes at the end of its list.
- A record file holds only text that reads plainly in a diff viewer: YAML front matter and a Markdown body, with no encoded or binary content.
- A record write never regenerates exports. Outside the record files and the originals and converted text under `blueprint/sources/`, Make Blueprint's record and source writes change only these git-tracked files, each as its own small diff:
  - The managed `blueprint/sources/.gitignore`, which lists the files that a source's git level keeps out of git (see [12 Source Intake and Conversion](12-source-intake-and-conversion.md)).
  - The managed `blueprint/sources/.gitattributes`, which holds the Git LFS rules for large originals (see [12 Source Intake and Conversion](12-source-intake-and-conversion.md)).
  - `.make/personas.yaml`, the shared people and roles file. When review approves a persona record, the shared core adds that record's entry to it (see [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) and [11 Record Types Reference](11-record-types-reference.md)). Make Blueprint never writes this file itself.
- When many records change at once, such as when a review approves 40 drafts, each record's change is still its own small diff in its own file. A large approval that runs in batches (see [Write Journal](#write-journal)) gives the same diffs as one that runs at once.
- Evidence: automated tests on written files compare the git diff of each single-field change with the expected two changed lines, and work phase 03 holds a Human Experience Review of a sample review-approval diff.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Human Experience Intent: a reviewer reads a record change as a normal git diff of one Markdown file; Alternatives Considered: one JSONL file per record type)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Human Experience Propagation)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md` (Human Experience and Evidence)
- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (section 16: Q-020, Q-028, Q-029, Q-072)
- `blueprint/records/<type>/<id>.md`
- `blueprint/sources/.gitignore`
- `blueprint/sources/.gitattributes`
- `.make/personas.yaml`

## Contracts and Data

### Storage Interface

The interface is a set of logical operations. The names below describe each operation. The code may name them differently.

| Operation | What it does | Takes the lock | Uses the journal |
| --- | --- | --- | --- |
| `read` | Returns one record by `id`, with its record version and, for a requirement or capability, its content version | No | No |
| `resolve` | Turns an `id`, `ref` or alias into record IDs, by the rules in [10 Records and Identity](10-records-and-identity.md) | No | No |
| `query` | Returns records that match a filter on type, field, facet, status and link, with a sort order and paging | No | No |
| `links` | Returns the records that link to or from one record, by relation field | No | No |
| `search` | Returns records whose title, summary or body match a text, each with a match score | No | No |
| `create` | Mints an `id` and a `ref`, sets `schema_version`, `created_at` and `updated_at`, validates the record and writes it | Yes | No |
| `modify` | Changes fields or the body of one record, given the version the caller read | Yes | No |
| `apply` | Creates and changes many records as one change that lands whole or not at all. One call is one batch. | Yes | Yes |
| `run_sql` | Runs one read-only SQL statement on the index | No | No |
| `refresh_index` | Brings the index up to date with the record files | Yes | No |
| `rebuild_index` | Builds the index again from the record files | Yes | No |
| `upgrade_schema` | Moves every record on an older schema version to the current one, in batches | Yes | Yes |
| `recover` | Finishes or undoes a change that a crash interrupted | Yes | Yes |
| `describe` | Reports the backend, the index state, any waiting journal and the schema versions in use | No | No |

Make Blueprint works out two version values. Neither is stored in the record file. Both are SHA-256 hashes, written as 64 lowercase hexadecimal characters, and both read every line ending as LF.

A record version is one value for each record that changes whenever the record's stored content changes, and never because of line endings alone. It is the SHA-256 hash of the record file's content with every line ending read as LF. So a file that git checks out with CRLF line endings on one machine and LF on another has the same version on both. Write checks use it: a caller passes the record version it read back to `modify` and `apply`.

A content version is one value for each requirement and each capability that changes only when the meaning of that record changes. It is the SHA-256 hash, with LF line endings, of a fixed serialization of the record's meaning fields. A fixed serialization writes those fields in one set order and one set form before the hash is taken, whatever order and quoting the file uses. The meaning fields are these:

| Record type | Fields the content version covers |
| --- | --- |
| `requirement` | `title`, `summary`, `kind`, `option_values`, `option_default`, `option_scope` and the Markdown body |
| `capability` | `title`, `summary` and the Markdown body |

The content version covers the values of these fields, not their layout in the file. Tags, facets, `owners`, `stakeholders`, `audience`, links, evidence, timestamps and `schema_version` do not change it. So a new tag, a facet code, a new owner or a schema upgrade when `setup` runs again leaves it as it was. Each mark on a fit-gap record keeps the content version of the requirement or capability it marked, so `project check` can tell when the meaning of the marked record changed (see [10 Records and Identity](10-records-and-identity.md) and [11 Record Types Reference](11-record-types-reference.md)).

Write checks use the record version, and marks use the content version. Neither value stands in for the other.

Every backend returns these errors with the same meaning:

| Error | Meaning |
| --- | --- |
| `not-found` | No record has that `id`, `ref` or alias. |
| `ambiguous` | A name matches more than one record. The error lists them. |
| `invalid` | The record breaks a field, identity or relation rule. The error lists each problem. Nothing was written. |
| `conflict` | The record changed after the caller read it, by hand or through another process. Nothing was written. |
| `busy` | Another process held the write lock for longer than the short wait. Nothing was written. The command's outcome is `blocked`, with the code `busy` (see [08 CLI and MCP](08-cli-and-mcp.md)). |
| `newer-schema` | The record was written by a newer Make Blueprint. It can be read, but not changed. |
| `recovery-needed` | An interrupted change needs a person's decision before writes continue. |

Requirements:

- Every write operation checks fields, allowed values, identity rules and relation targets against [10 Records and Identity](10-records-and-identity.md) and [11 Record Types Reference](11-record-types-reference.md) before it writes. A write that fails changes nothing and returns every problem it found.
- `modify` and `apply` refuse to write when the stored version of any record differs from the version the caller passed, and return `conflict`. This check protects people's work: a write based on a stale read never lands. The write lock only keeps writes in order.
- One rule works out the content version for every caller. The same field values give the same content version in `read`, the index, `run compare next` and `project check`, on every machine, however the file lays the fields out.
- One `apply` call lands one batch. A change too large for one short hold of the lock, such as approving a large review, runs as several `apply` calls, one for each batch, as [Write Journal](#write-journal) describes.
- `search` uses one matching rule for every caller: duplicate hints (see [13 Extraction and Review](13-extraction-and-review.md)), fit-gap candidate matches and the similar-capabilities check (see [14 Fit-Gap and Placement](14-fit-gap-and-placement.md)). For the same record files and the same text, it returns the same records in the same order with the same scores on every run and every machine.
- `search` runs on the local index alone. v2.0 uses no embeddings and no network service for it.
- No operation outside the file backend depends on a record's file path. Callers address records by `id`.
- Reads do not wait for the write lock. A read sees each record as it was either before or after a write, never half written.
- A read that runs during a change to many records sees all of those records as they were before the change, or all of them as they are after it.
- While another process holds the write lock, a read answers from the index as that process last left it. The process that holds the lock brings the index up to date before it releases the lock.
- The interface has no delete operation in v2.0. A record leaves use through its status, as [10 Records and Identity](10-records-and-identity.md) defines.

### Record Files

Each record lives at `blueprint/records/<type>/<id>.md`. `<type>` is the record's type value from [11 Record Types Reference](11-record-types-reference.md), such as `requirement` or `fit-gap`. `<id>` is the record's permanent `id`. Files are named by `id`, because `ref` can change. For example, the requirement with `id` `REQ-7kq2m7k2` lives at `blueprint/records/requirement/REQ-7kq2m7k2.md`.

A record file has YAML front matter (a block of fields between two `---` lines at the top) and a Markdown body after it. The body holds long prose.

```markdown
---
id: REQ-7kq2m7k2
ref: REQ-042
type: requirement
title: Approve invoices above a set amount
status: draft
summary: Invoices above the approval limit need a second approver.
capability: CAP-9xw3p7k2
kind: rule
evidence:
  - SRC-4hd8x7k2#p-012
evidence_versions:
  SRC-4hd8x7k2:
    sha256: d5fd20e081e5a152ac41c4e0111055d73171e91d42603eb49eefbb7a7cf2f876
    converter: docx
    converter_version: "1"
schema_version: 1
created_at: 2026-11-02T14:05:11Z
updated_at: 2026-11-02T14:05:11Z
---

The workshop agreed that the limit is set for each legal entity.
```

Requirements:

- Text is UTF-8 with no byte order mark. Make Blueprint reads files with LF or CRLF line endings, keeps the style a file already has, and writes new files with LF.
- The serializer writes fields in the fixed order from [11 Record Types Reference](11-record-types-reference.md). It always writes required fields and leaves out optional fields that have no value.
- Values use plain YAML: text, numbers, true or false, lists and mappings. The serializer quotes text only when YAML would otherwise read it as another kind of value, and writes text with line breaks as a literal block. It never writes YAML anchors, aliases or tags.
- Timestamps are UTC in ISO 8601 form with seconds, such as `2026-11-02T14:05:11Z`.
- Paths in record fields are project-relative and use forward slashes on every operating system. A record file never holds an absolute machine path.
- A write keeps the body byte for byte unless the write changes the body.
- A write keeps a front matter field that Make Blueprint does not know, after the known fields, and [10 Records and Identity](10-records-and-identity.md) reports it in `project check`.
- A record file write is atomic. The new content goes to a temporary file in the same folder, which then replaces the old file in one step. A crash never leaves a half-written record file.
- People may edit record files by hand. A file that does not parse is left out of the index and listed as a problem. One bad file never stops a read, a rebuild or `project check`.

### Derived Index

The index is a SQLite database built with the built-in `node:sqlite` module. It is derived from the record files, and git does not track it.

| Content | Used for |
| --- | --- |
| One row per record: `id`, `ref`, `type`, `status`, `title`, `summary`, `schema_version`, timestamps, the record version, every front matter field, and, on requirement and capability rows, the content version | Filters on any field, sorting, status counts, and the content versions that `run compare next` hands out and the out-of-date check compares |
| Aliases | Name resolution |
| Relations: the record, the field, the target `id` and the position in the list, including the `requirement`, `capability` and `capabilities` of each entry in a fit-gap record's `requirement_marks` | Link filters and reverse links |
| Evidence links: the record, the source `id`, the anchor, and the recorded source version, including the links in `requirement_marks` | Evidence checks and finding the records that cite a source |
| Requirement marks: the fit-gap record, the requirement or capability each mark names, the content version the mark recorded in `version`, and the `mark` value | The check for marks that no longer match their capability's requirements, which compares each mark's `version` with the content version on the marked record's row (see [10 Records and Identity](10-records-and-identity.md)) |
| Facet values | Facet filters |
| Title, summary and body text | `search`, with one matching rule for duplicate hints, fit-gap candidates and the similar-capabilities check |
| Problems: files that do not parse, with the reason | `project check` and `project status` |

The index lives in the machine Store under `~/.make/blueprint/`, keyed by the project ID in the `.make/blueprint/` config and by checkout. Each checkout has its own index file, separate from the Store database, so that deleting or rebuilding it touches no other Store state. [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) owns the exact folder and any override of the Store location.

Requirements:

- One index serves one checkout. Two checkouts of one project on one machine never read or write each other's index.
- Before it answers a read, Make Blueprint makes sure the index matches the record files in the checkout, including hand edits and the changes that a git checkout, pull or merge makes. A person never runs a command to make results current. The one exception is a read during another process's write, described in [Storage Interface](#storage-interface).
- When no record file has changed, the freshness check does not read record contents.
- `project reindex` builds the index again from the record files (see [08 CLI and MCP](08-cli-and-mcp.md)). Make Blueprint also rebuilds the index, without asking, when it is missing, cannot be read, or was built by a different index schema. When the index cannot be used for another reason, the error names `project reindex`.
- The index has its own schema version, separate from record schema versions. A change to the index schema never changes a record file.
- Deleting the index loses no data. The next read rebuilds it.
- When the Store cannot be written, read commands still answer by building a temporary index for that command, and the output says the index could not be saved.
- The index and the journal hold copies of record content. They stay on the user's machine and are never sent anywhere.
- The links inside `requirement_marks` are held like every other link, so evidence checks, reverse links and the check for out-of-date marks all see them.
- The index works out the content version of each requirement and capability when it indexes the record file. A write that changes only fields outside the content version leaves the content version on the row as it was.
- Text search scores are worked out from the index content alone, so the same record files give the same scores. An index rebuilt from the same files gives the same search results.

### What Backs the Filter Syntax and Read-Only SQL

[08 CLI and MCP](08-cli-and-mcp.md) owns the filter syntax and the SQL command. The index answers both.

- **Filters.** Each filter term maps to the index: type, any front matter field, facet name and value, status, and link (a relation field to or from a record). A filter with several terms runs as one index query.
- **Read-only SQL.** `run record query` runs SQL against a documented set of read views: `records`, `record_aliases`, `record_links`, `record_evidence`, `record_facets` and `record_problems`. The views are the supported query surface, and Make Blueprint publishes their columns as a reference resource through the `resource` surface. Tables behind them can change between versions.

Requirements:

- The CLI and MCP give the same results for the same filter, because both run it through the same index query.
- The index offers SQL a connection that cannot write, so a statement that would change data fails and changes nothing, even if it gets past the command's own check.
- SQL results come from a fresh index, like every other read.
- A change to the columns of a documented view is a breaking change, named in the release notes of the version that makes it.

### Index Rebuild and Query Characterization

This is a performance evidence candidate from the source design, handled under the [Performance Evidence Governance Contract](make-docs://system/contract/performance-evidence-governance.md).

| Item | Value |
| --- | --- |
| Protected outcome | People and agents get status and query answers in file mode with no waits that break their flow. |
| Workload | A synthetic project the size of client-b-v3: about 280 sources and several thousand records. No client data. |
| What is measured | A full rebuild, a freshness check when nothing changed, a freshness check after a merge that changes many files, common filter queries, the text search behind candidate matches and the similar-capabilities check, and the status read model |
| Target class | `characterization-baseline`: an observed baseline with stated uncertainty, not a pass or fail gate |
| Canonical owner | One `PERF-###` profile that work phase 03 creates before its first measurement. The profile sets the finite budget and stop rule. |
| Decision informed | Whether one file per record with a rebuilt index holds at that size, or the index needs to change only the rows for changed files |

This PRD sets no performance target. A target becomes a product requirement only when the owner approves it and this PRD states it.

### Write Lock

Each checkout has one write lock in the machine Store, next to its index.

Requirements:

- Every Make Blueprint process that writes records or updates the index for a checkout takes the same lock: CLI commands, the MCP server, and in setup B the local server.
- A process holds the lock only while it mints refs, writes the files of one change and updates the index. It never holds the lock while it waits for a person or an agent.
- A process that finds the lock held waits for a short, bounded time. If the lock is still held, the command returns the outcome `blocked` with the code `busy`, names the process that holds it, and changes nothing. Running the command again later is safe.
- A lock is stale when the process that holds it is no longer running. A stale lock clears itself: the next process takes the lock over with no step by a person, and notes it in diagnostic output.
- A lock guards one checkout and never crosses checkouts.
- Two processes that create records in one checkout at the same time never mint the same `ref`.
- The lock only keeps writes in order. The record version check in [Storage Interface](#storage-interface) is what protects people's work from a write based on a stale read.

The lock guards one checkout. It cannot stop two branches from minting the same `ref`. `project check` finds those clashes after a merge, and `run record ref-fix` fixes them (see [10 Records and Identity](10-records-and-identity.md)).

### Write Journal

A change to many records at once goes through the journal. Examples are approving a review, which runs in batches when it is large (see below), `run record ref-fix`, a model merge, a schema upgrade and the v1 import. The journal for a checkout lives in the machine Store, keyed like the index.

A journaled change runs in this order:

1. Take the write lock.
2. Write the journal: for every file in the change, its path, its version and full content before the change (or a note that it is new), and its full content after the change. Make sure the journal is on disk.
3. Write each record file atomically.
4. Update the index in one transaction.
5. Mark the journal done, delete it, and release the lock.

Before any other write, the next write command for the checkout looks for a journal that was not marked done. `project recover` runs the same step on its own (see [08 CLI and MCP](08-cli-and-mcp.md)).

| What it finds | What happens |
| --- | --- |
| The journal itself is incomplete, because the crash came while it was being written | No record file was touched. The journal is discarded. |
| The journal is complete, and every file in it is in its before state or its after state | The command finishes the change, says so in one line, and goes on. |
| A write failed during the change, for example because the disk is full | The command undoes the files it already changed, from their before content, and reports the failure. |
| A file is in neither its before state nor its after state, for example after a hand edit or a branch switch | The command changes nothing, names each such file, returns `recovery-needed`, and names `project recover`, which offers to finish the change, undo it, or keep the files as they are. |

Requirements:

- After a crash at any point in a change to many records, the records end up fully changed or fully unchanged, unless a file changed outside the change. In that case Make Blueprint stops and asks before it touches that file.
- Undo uses the before content in the journal, so it does not depend on git.
- `project status` and `project check` report a journal that waits for a person's decision.
- Evidence: automated crash tests stop the process at each step of a journaled change and check the result (work phase 03).

Large approvals run in batches, so that no process holds the write lock for long. A batch is a set of records small enough to write under one short hold of the lock. The batch size is an implementation choice.

- Each batch is its own journaled change, with the steps above. A batch lands whole or not at all.
- The lock is released between batches, so other writers and readers are not held up for the whole approval.
- Each batch checks the record versions it read, like any other write.
- When a batch cannot land, for example because a record changed after it was read or the lock stayed busy, the batches already written stay written. The command stops, reports `partial`, names the records it wrote and the records still waiting, and names the same command as the next action.
- Running the same approval again goes on with the records still waiting. It never writes a record twice.
- After a crash in the middle of a large approval, recovery finishes or undoes only the batch that was in progress, as the table above describes.

### Schema Versions

Every record file carries `schema_version`, a whole number. Each record type has its own version line, so a change to one type's schema touches only records of that type.

Requirements:

- Every change to a type's schema ships an upgrade step from one version to the next. Steps run in order, keep fields that Make Blueprint does not know, and keep the body.
- Record upgrades run when `make-blueprint setup` runs again in a project, never through `update`, which updates only the installed tool (see [07 Installation and Distribution](07-installation-and-distribution.md)). `setup` shows how many records of each type are on an older version, then upgrades them in batches, as a large approval runs (see [Write Journal](#write-journal)). Each batch is its own journaled change, and each upgraded record is its own one-file diff. When an upgrade stops part-way, the records already upgraded stay upgraded, and running `setup` again upgrades the rest.
- Make Blueprint reads a record on any older version it knows by upgrading it in memory. A normal write of that record writes it at the current version.
- A record on a newer version than this Make Blueprint knows can be listed and shown, but never changed. A write returns `newer-schema`, and `project check` and `project status` say that the installed Make Blueprint needs an `update`.
- When a merge brings in records on an older version from another branch, `project check` reports them, and running `setup` again upgrades them.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 8: storage; Consequences: file count, hand edits; Left for planning: where the local index lives; Performance Evidence Candidates)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md` (Scope, Testing Decisions)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Performance Evidence Plan)
- `blueprint/records/<type>/<id>.md`
- `.make/blueprint/`
- `~/.make/blueprint/`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/store/database.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/store/json-files.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/store/README.md`

## Integrations

### Setups

| Setup | Truth | Who writes | Index | Lock and journal | Release |
| --- | --- | --- | --- | --- | --- |
| A | Record files in git | CLI commands and the MCP server process, each through the file backend | One for each checkout, in the machine Store | One lock and one journal for each checkout, shared by every process | v2.0 |
| B | Record files in git | The setup A writers and the local server for each user | As in setup A. The server keeps it fresh with the same freshness check before each read. | The CLI, the MCP server and the local server share one write lock for each checkout. | v2.1 |
| C | A shared database | The local server for each user, through the database backend | Designed in v3 | Designed in v3 | v3 |

Requirements:

- In setup A, no process holds the lock between commands, and storage needs no long-running Make Blueprint process.
- In setup B, the CLI, the MCP server and the local server use one shared write lock for a checkout. The server takes it for each index update and each write, like the CLI, and never holds it between requests. [18 Local Server and UI](18-local-server-and-ui.md) states the same rule from the server side.
- In setup B, the local server reads and writes through the same storage interface and file backend as the CLI. A record that any of them writes is visible to the others on their next read.
- Record operations give the same results in setups A and B.
- Setup C is designed in v3, including its database type, logins, permissions and file storage. A database backend implements the same interface, returns the same errors and passes the same conformance suite as the file backend. The data model and the `id` rule, which keeps two database users from making the same `id`, stay the same.
- More setups can come later through the same interface.

### Sibling Modules

| Module | How it uses storage | Owner |
| --- | --- | --- |
| Records and identity | Mints `id` and `ref` inside `create`, resolves names, reads index problems and content versions for `project check`, and runs `run record ref-fix` through `apply` | [10 Records and Identity](10-records-and-identity.md) |
| Record types | Supplies the fields, relations and field order that the serializer and validation use | [11 Record Types Reference](11-record-types-reference.md) |
| CLI and MCP | Exposes queries, SQL, the rebuild command and the status read model | [08 CLI and MCP](08-cli-and-mcp.md) |
| Installation and distribution | Calls `upgrade_schema` when `setup` runs again in a project. `update` never calls it. | [07 Installation and Distribution](07-installation-and-distribution.md) |
| Project layout | Supplies the Store folder and the project ID | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| Shared core | Supplies the Store base. The index, lock, journal and record storage stay in Make Blueprint. | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| Source intake | Writes source records through the interface. Original files and converted text under `blueprint/sources/` are not records. | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| Extraction and review | Writes extraction and draft records, finds duplicate hints through `search`, and approves or rejects many drafts through `apply`, in batches | [13 Extraction and Review](13-extraction-and-review.md) |
| Fit-gap and placement | Runs merges and `target-only` generation through `apply`, finds candidate matches and similar capabilities through `search`, and reads requirement marks and content versions for `run compare next` and the out-of-date check | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| Shared core | Adds a persona record's entry to `.make/personas.yaml` when review approves the record | [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| Exports | Reads records through the interface. Record writes never change exports. | [15 Exports](15-exports.md) |
| v1 import | Writes a whole import as one journaled change | [17 v1 Import](17-v1-import.md) |
| Local server and UI | Reads view models through the interface and shares the write lock | [18 Local Server and UI](18-local-server-and-ui.md) |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 2: setups; section 6: the core holds the Store base, and records and storage stay in Make Blueprint; section 15: release plan)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md`
- `~/.make/blueprint/`

## Rebuild Notes

- **No counters in git.** A tracked "next number" file makes every branch that creates a record conflict on merge. Mint `ref` values from the index under the lock instead.
- **One-sided relations.** Storing reverse links, such as a capability that lists its requirements, makes every create edit two files and breaks the one-file diff promise.
- **Deterministic output.** Many YAML libraries reorder keys, change quoting or wrap long lines. The serializer must control its output and be tested for byte equality across operating systems.
- **Timestamp conflicts.** Two branches that change different fields of the same record both change `updated_at`, so git reports a conflict on that line. Expect it and make it easy to resolve. [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md) tracks how.
- **Freshness traps.** A git checkout or merge can change many files at once and can set modification times in ways that a simple size and time check misses, such as two edits in one second that keep the size. The freshness check must not trust size and time alone when they cannot prove a file is unchanged.
- **Checkout, not project.** Two worktrees of one project share a project ID. Keying the index by project ID alone mixes their records.
- **State outside the project.** Lock and journal files inside the project folder get committed by mistake. They live in the machine Store.
- **Windows file replacement.** Replacing a file that another program has open can fail on Windows. Atomic writes need a short retry, and a failed replace must leave the old file whole.
- **Interface leaks.** An interface that returns file paths, assumes git, or relies on a directory scan cannot take a database backend. The in-memory backend exists to catch these leaks early.
- **Upgrade noise.** A normal write of a record on an older schema version also upgrades it, so that one diff shows the upgrade lines too. Running `setup` again after each tool `update` keeps later diffs clean. `update` changes only the tool, so it never upgrades records.
- **Line endings in the version.** A version taken from raw file bytes changes when git checks a file out with other line endings, so every record would look changed on another machine, every write check would fail, and every requirement mark would go stale. The record version and the content version both read every line ending as LF.
- **Marks on the whole file.** A mark that keeps the hash of the whole record file goes stale on any write to it, such as a new tag, a facet code or a schema upgrade. The false flags hide real changes and send capabilities out for scoring again for no reason. Marks keep the content version, which covers only the fields that carry meaning.
- **Long holds of the lock.** One journaled change for thousands of records holds the lock long enough to block every other writer, and a crash in it leaves a large recovery. Large approvals run in batches, and each batch is its own journaled change.
- **Matching that drifts.** Duplicate hints, candidate matches and the similar-capabilities check must agree with each other and repeat on every run. Separate matching code for each, or a match score that depends on a network service, would break both.
- **Lessons from v1.** v1 kept one JSONL file per record type, which clashed in git and made diffs hard to read. It also had no locks across files. Both drove this design.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Context: v1 facts that shape this design; Alternatives Considered; Consequences: trade-offs and risks)
- `<user-home>/Developer/Source/Tyler/Projects/build-os/docs/prd/03-open-questions-and-risk-register.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/store/global-asset-lock.ts`

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md`
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/02-records-and-storage.md`
- `docs/prd/01-product-overview.md`
- `docs/prd/02-architecture-overview.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/store/README.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/store/database.ts`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/system/.os/contracts/entity-records-contract.md`
