---
title: "Phase 3: Storage and Identity"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P3"
---

# Phase 3: Storage and Identity

> **Replaced by `W1 R1`.** The [W1 R1 plan](../../../../docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md) replaces this plan. Its PRD step produced the current PRD set, which `W1 R1` updates. No work backlog was made from this plan. Use the `W1 R1` plan and the PRDs; the phase files here stay only as reference input for the first backlog.

## Purpose

Build the storage layer that every later phase writes through: one interface, the file backend, two IDs per record, safe writes and a fast derived index.

## Scope

- Define the data model base and the storage interface. Test the interface against the file backend and a second, simple in-memory backend, so database needs do not leak in late.
- File backend: one Markdown file with YAML front matter per record at `blueprint/records/<type>/<id>.md`.
- Identity: `id` (type prefix plus short random code) and `ref` (friendly counter), aliases, and a ref-fix command.
- `make-blueprint check` for bad hand edits, ref clashes and broken links.
- Safe writes: a short lock for `ref` minting and index updates, and a journal for changes to many records, with crash recovery.
- A schema version in every record, and upgrades through `make-blueprint update`.
- The derived SQLite index, the shared filter syntax, and read-only SQL.
- Decide and record the index location (proposed: `~/.make/blueprint/`).
- Create the `PERF-###` profile for index rebuild and query, and run its first characterization on a synthetic project the size of client-b-v3.

## Deliverables

- The storage interface, file backend, index and query features with tests.
- An index characterization record.

## Owning PRDs

- `docs/prd/09-storage-and-indexing.md`
- `docs/prd/10-records-and-identity.md`

## Human Experience and Evidence

- Promise: a record change reads as a git diff of one file. Evidence: tests on the written files, and Human Experience Review of a sample diff.
- Promise: a ref clash is named and fixed by one command. Evidence: a two-branch merge test where both branches create records.

## Testing Decisions

- Automated Implementation Testing: active. Interface tests on two backends, lock and journal crash tests, merge tests.
- Performance Testing: active as a characterization baseline for index rebuild and query, under its `PERF-###` profile.
- Guided Progress Review: `not-needed-now`.
- Unassisted Goal Testing: `not-needed-now`.

## Dependencies

- Phase 2 CLI skeleton.

## Exit Criteria

- Records can be created, changed, checked, merged and queried safely, and the index baseline is recorded.
