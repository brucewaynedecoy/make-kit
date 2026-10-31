---
title: "Phase 5: Intake and Conversion"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P5"
---

# Phase 5: Intake and Conversion

> **Replaced by `W1 R1`.** The [W1 R1 plan](../../../../docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md) replaces this plan. Its PRD step produced the current PRD set, which `W1 R1` updates. No work backlog was made from this plan. Use the `W1 R1` plan and the PRDs; the phase files here stay only as reference input for the first backlog.

## Purpose

Let people add sources and turn them into text with stable anchors, inside the CLI and with no outside tools.

## Scope

- `run source add` for files in `blueprint/sources/`, with the file hash and the `repo` location type.
- The `local` location type in the data model, with a "missing" state when the file is absent. Full `local` handling may stay minimal in v2.0.
- Git LFS guidance in `setup` and `check` for large originals.
- Built-in converters for docx, xlsx, pptx, pdf, csv, md and txt. The converted text sits next to the original. Other types are marked for an agent or a manual step.
- Stable anchors for each heading, paragraph and row, and a recorded converter version.
- Change detection: when a source hash changes, `check` flags evidence links that point to the old version.

## Deliverables

- Intake and conversion commands with tests on sample files of each type.
- The anchor algorithm, recorded in the owning PRD.

## Owning PRDs

- `docs/prd/12-source-intake-and-conversion.md`

## Human Experience and Evidence

- Promise: evidence links reach the exact place and flag changed sources. Evidence: tests that resolve anchors in converted text, and tests that change a source and expect flagged links.

## Testing Decisions

- Automated Implementation Testing: active. Converter fixtures for each file type and anchor stability tests.
- Performance Testing: `not-needed-now`. Conversion speed cannot change a current decision.
- Guided Progress Review: active for conversion quality. A reviewer compares converted pdf and pptx samples with the originals and records what is lost.
- Unassisted Goal Testing: `not-needed-now`.

## Dependencies

- Phase 4 source record type.

## Exit Criteria

- Each supported file type converts with anchors, and changed sources are flagged.
