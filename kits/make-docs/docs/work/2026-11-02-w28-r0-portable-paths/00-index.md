---
title: "Portable Paths"
kind: "work"
status: "draft"
coordinate: "W28 R0"
follow_on:
  route: "implementation-loop"
  next_prompt: ".make-docs/system/references/execution-workflow.md"
  why: "The backlog is the implementation queue for the permanent home-path fix."
  coordinate_handoff: "Carry W28 R0 into phase history records and commits, adding the active P coordinate for each phase."
source:
  type: "prd"
  path: "docs/prd/10-packaging-validation-and-release-reference.md"
---

# Portable Paths

## Purpose

Make Docs output often captures full machine paths, such as `<user-home>/Developer/...`. These paths expose the user name. They also break when the project moves. This backlog makes the fix permanent in 2 layers:

1. **Guard first** (P1): a validation check, a pre-commit hook, and a CI step that reject home paths before a commit.
2. **Source fix** (P2): every Make Docs writer records project-relative paths, so the guard rarely fires.

This backlog is a draft. It was recorded on 2026-11-02 during make-kit W1 R0 P1 (copy day). The copy day found 2 copied files with a home path: a legacy test archive and an evidence screenshot. That cleanup belongs to the make-kit backlog, not to this backlog. A plan and a PRD gap review must come before implementation.

## Human Experience Trace

| Impact or promise | Source design and plan | Owning PRD or preserved boundary | Work phase | Evidence source or selected testing type | Implementation gate | Accepted obligation, if any |
| --- | --- | --- | --- | --- | --- | --- |
| Direct: a user can commit and publish Make Docs output without leaking a home path. | Plan pending | [10](../../prd/10-packaging-validation-and-release-reference.md), [25](../../prd/25-typescript-runtime-cli-mcp-operation-boundaries.md) | [P1](01-home-path-guard.md), [P2](02-portable-path-writers.md) | Automated Implementation Testing with negative fixtures | Plan and PRD gap review accepted | none |
| Direct: MCP app panels and screenshots show no home path. | Plan pending | [51](../../prd/51-backlog-review-and-reporting.md) | [P2](02-portable-path-writers.md) | Automated tests plus agent review of a real panel capture | Plan and PRD gap review accepted | none |

## Phase Map

| File | Purpose |
| --- | --- |
| [01-home-path-guard.md](01-home-path-guard.md) | Detect and reject home paths in text, archives, and source maps. |
| [02-portable-path-writers.md](02-portable-path-writers.md) | Make every writer record project-relative paths. Fix build source maps and panel output. |

## Usage Notes

- Read phases in order. P1 protects the repository while P2 is built.
- Every phase links its source PRD docs.
- Text checks cannot read images. P2 removes the cause for screenshots.
- Do not create `evidence.md` until evidence exists.

## Intended Follow-On

- Route: `implementation-loop`, after a plan and PRD gap review.
- Next step: Write the W28 R0 plan, then start P1.
- Why: The guard gives protection fast. The source fix removes the cause.
