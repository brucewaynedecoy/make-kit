---
title: "Phase 6: Extraction and Review"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P6"
---

# Phase 6: Extraction and Review

> **Replaced by `W1 R1`.** The [W1 R1 plan](../../../../docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md) replaces this plan. Its PRD step produced the current PRD set, which `W1 R1` updates. No work backlog was made from this plan. Use the `W1 R1` plan and the PRDs; the phase files here stay only as reference input for the first backlog.

## Purpose

Give agents a guided, one-source-at-a-time path from converted text to reviewed records, without the staging layer and Python of the old bulk-extract skill.

## Scope

- `run extract next` hands out the next source that needs work.
- Extraction records track coverage and outcome for each part of a source.
- Duplicate hints: before a new record is created, the CLI shows likely matches from the index.
- New records start as `draft`.
- Review commands make drafts `active` or `rejected`. Approving many drafts at once uses the journal from phase 3.
- A project setting turns a required second reviewer on or off.
- Extraction progress feeds the status read model used in phase 8.

## Deliverables

- Extraction and review commands with tests.

## Owning PRDs

- `docs/prd/13-extraction-and-review.md`

## Human Experience and Evidence

- Promise: status shows drafts waiting for review. Evidence: read-model tests here; the status output itself is reviewed in phase 8.

## Testing Decisions

- Automated Implementation Testing: active. Extraction flow tests, duplicate hint tests and crash tests during approval.
- Performance Testing: `not-needed-now`.
- Guided Progress Review: active. A reviewer runs one real-shaped source through extract and review with an agent and records friction.
- Unassisted Goal Testing: `not-needed-now`.

## Dependencies

- Phase 5 intake and conversion.

## Exit Criteria

- An agent can take a source from converted text to reviewed records with coverage recorded.
