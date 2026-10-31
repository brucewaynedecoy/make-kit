---
title: "Phase 9: v1 Import and Release"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P9"
---

# Phase 9: v1 Import and Release

> **Replaced by `W1 R1`.** The [W1 R1 plan](../../../../docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md) replaces this plan. Its PRD step produced the current PRD set, which `W1 R1` updates. No work backlog was made from this plan. Use the `W1 R1` plan and the PRDs; the phase files here stay only as reference input for the first backlog.

## Purpose

Give v1 projects such as Client C a safe path to v2, prove the whole product on a locked-down machine, and release v2.0.

## Scope

- A one-time import command for v1 projects. It maps JSONL records to record files, v1 IDs such as `REQ-001` to `ref` values, systems in `instance.yaml` to system records, and `references.json` entries to source records. The treatment of old bulk-extract `extractions/` files is decided and recorded here.
- Synthetic or scrubbed fixtures shaped like client-c-implementation and client-b-v3. No client data enters this repository.
- An end-to-end run of all seven stages in a clean container with no Python and no Node.
- Human Experience Review of every promise in the plan overview, with recorded conclusions and limits.
- The v2.0 release: npm package, signed single files and release notes.

## Deliverables

- The import command with fixture tests, an end-to-end report, the review record and the v2.0 release.

## Owning PRDs

- `docs/prd/17-v1-import.md`
- `docs/prd/07-installation-and-distribution.md`

## Human Experience and Evidence

- Promise: one signed file works with no Python. Evidence: the end-to-end run in the clean container.
- All promises: Human Experience Review before release.

## Testing Decisions

- Automated Implementation Testing: active. Import fixture tests and the end-to-end run.
- Performance Testing: re-run the two characterization profiles on the release build and record the results. No targets are set.
- Guided Progress Review: active. A reviewer imports a v1-shaped fixture and checks that names and links still make sense.
- Unassisted Goal Testing: `not-needed-now`.

## Dependencies

- Phase 8.

## Exit Criteria

- A v1-shaped project imports cleanly, the end-to-end run passes, and v2.0 is released.
