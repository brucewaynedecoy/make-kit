---
title: "Phase 7: Analysis and Exports"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P7"
---

# Phase 7: Analysis and Exports

> **Replaced by `W1 R1`.** The [W1 R1 plan](../../../../docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md) replaces this plan. Its PRD step produced the current PRD set, which `W1 R1` updates. No work backlog was made from this plan. Use the `W1 R1` plan and the PRDs; the phase files here stay only as reference input for the first backlog.

## Purpose

Turn reviewed records into comparisons, fit-gap and placement records, and files a client can open.

## Scope

- Model stage commands to clean up systems, capabilities and domains (merge, re-parent, re-domain).
- Comparison records with one target system and one or more baseline systems.
- Fit-gap records: one baseline capability against the target system, covering target capabilities, verdict, confidence, effort, gap detail, migration note and required evidence links.
- A command that creates `target-only` records for target capabilities that no fit-gap record uses.
- Placement records with the owning system, the delivery value (`configure`, `extend`, `build`, `integrate`) and links to Make Docs work items.
- Exports to `blueprint/exports/`: fit-gap detail CSV, summaries by verdict and by domain, capability and requirement CSVs for each system, and one xlsx workbook with all of them.

## Deliverables

- Analysis and export commands with tests.

## Owning PRDs

- `docs/prd/14-fit-gap-and-placement.md`
- `docs/prd/15-exports.md`

## Human Experience and Evidence

- Promise: a fit-gap CSV and xlsx open for a client. Evidence: a test that checks column parity with the example fit-gap, and a Guided Progress Review that opens the workbook in a spreadsheet app.

## Testing Decisions

- Automated Implementation Testing: active. Fit-gap rules, `target-only` generation and export column tests.
- Performance Testing: `not-needed-now`.
- Guided Progress Review: active for the exported workbook.
- Unassisted Goal Testing: `not-needed-now`.

## Dependencies

- Phase 6 extraction and review.

## Exit Criteria

- A comparison with several baseline systems produces fit-gap, placement and export files.
