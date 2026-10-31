---
title: "Phase 8: MCP, Skills and Status"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P8"
---

# Phase 8: MCP, Skills and Status

> **Replaced by `W1 R1`.** The [W1 R1 plan](../../../../docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md) replaces this plan. Its PRD step produced the current PRD set, which `W1 R1` updates. No work backlog was made from this plan. Use the `W1 R1` plan and the PRDs; the phase files here stay only as reference input for the first backlog.

## Purpose

Finish the agent-facing surface: every command reachable through the right MCP profile, one skill per stage, and one status command that orients people.

## Scope

- Map every command from phases 3 to 7 to MCP tools in the `core`, `setup`, `intake`, `extract`, `analyze` and `all` profiles. Write tools need `allowWrite`.
- Review the 18 old skills only to list the jobs worth keeping.
- Write seven stage skills (intake, extract, review, model, compare, place, hand off). Each owns one job, ships no scripts and calls commands. `setup` installs them.
- The `status` command in the CLI and MCP: sources, extraction progress, drafts waiting for review, broken links and ref clashes, with the next useful action. Human output and machine output carry the same meaning.

## Deliverables

- The complete MCP tool set, seven skills and the status command.

## Owning PRDs

- `docs/prd/08-cli-and-mcp.md`
- `docs/prd/16-workflow-and-skills.md`

## Human Experience and Evidence

- Promise: one status command shows project state and the next useful action. Evidence: Human Experience Review of success, partial and blocked status output, and tests of the read model.

## Testing Decisions

- Automated Implementation Testing: active. Profile membership tests and skill lint checks for no scripts.
- Performance Testing: `not-needed-now`.
- Guided Progress Review: active. A reviewer runs the seven skills end to end with an agent on a sample project.
- Unassisted Goal Testing: `not-needed-now` for this wave. Revisit before v2.1 when the UI adds a new human path.

## Dependencies

- Phases 3 to 7.

## Exit Criteria

- An agent can run every stage through skills and MCP, and the status output passes its review.
