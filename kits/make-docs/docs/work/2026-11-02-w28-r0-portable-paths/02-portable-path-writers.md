---
title: "Phase 2: Portable Path Writers"
kind: "work"
status: "draft"
coordinate: "W28 R0 P2"
source:
  type: "prd"
  path: "docs/prd/25-typescript-runtime-cli-mcp-operation-boundaries.md"
---

# Phase 2: Portable Path Writers

## Purpose

Remove the cause. Make Docs writers must record project-relative paths by default.

## Overview

Add one shared helper, for example `toPortablePath()`. A path inside the project becomes relative. A path outside the project becomes `<user-home>/...` or `<outside-project>`. Route every writer through it. Fix build source maps and MCP app panels.

## Human Experience Outcome

- Impact and promise: direct; Make Docs output and panels show no home path.
- Intended human outcome: the user can share docs, evidence, and screenshots without a cleanup step.
- Surface: evidence records, backlog snapshots, UAT records, MCP app Data panels, and the built package.
- Evidence: unit tests for the helper, writer tests, and agent review of a real panel capture.
- Obligation route: none.
- Authority: [Human Experience Contract](../../../.make-docs/system/contracts/human-experience-contract.md).

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | Planned | Helper tests plus one test for each writer. Run the P1 detector over test output. |
| Performance Testing | not-needed-now | No speed claim. |
| Guided Progress Review | Optional | Offer a panel check after the change. |
| Unassisted Goal Testing | not-needed-now | Automated proof and agent review answer the question. |

## Source PRD Docs

- [25 TypeScript Runtime, CLI, and MCP Operation Boundaries](../../prd/25-typescript-runtime-cli-mcp-operation-boundaries.md)
- [16 Package Runtime and Deployment Boundaries](../../prd/16-package-runtime-and-deployment-boundaries.md)
- [51 Backlog Review and Reporting](../../prd/51-backlog-review-and-reporting.md)

## Source Obligations, Scenarios, And Findings

- `none`

## Stage 1 - Helper and Writers

### Tasks

- [ ] t1: Add `toPortablePath()` with tests for inside, outside, and Windows paths.
- [ ] t2: Find every writer that records a path. Include evidence, backlog snapshot, UAT, Store, and lifecycle records.
- [ ] t3: Route each writer through the helper. Keep absolute paths only where the runtime needs them, and never write them to docs.

### Acceptance criteria

- A6: Each writer test output passes the P1 detector.
- A7: Existing records with absolute paths still read correctly.

## Stage 2 - Builds, Panels, and Agent Rules

### Tasks

- [ ] t4: Set relative source-map paths in the shared `tsup` config.
- [ ] t5: Show `targetRoot` in MCP app panels as a relative path or a project name.
- [ ] t6: Add one rule to the managed agent instructions: write paths relative to the project root, and never write a home path.

### Acceptance criteria

- A8: The built package has no home path. The P1 detector proves it.
- A9: A real Data panel capture shows no home path. An agent reviews the capture.

### Dependencies

- P1 detector.
