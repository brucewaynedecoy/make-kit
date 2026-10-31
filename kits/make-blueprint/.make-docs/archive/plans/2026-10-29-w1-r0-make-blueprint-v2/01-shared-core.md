---
title: "Phase 1: Shared Core"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P1"
---

# Phase 1: Shared Core

> **Replaced by `W1 R1`.** The [W1 R1 plan](../../../../docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md) replaces this plan. Its PRD step produced the current PRD set, which `W1 R1` updates. No work backlog was made from this plan. Use the `W1 R1` plan and the PRDs; the phase files here stay only as reference input for the first backlog.

## Purpose

Step 0 of the release plan. Move the code that both products need out of the Make Docs CLI into a published `packages/core` in the make-docs monorepo, so Make Blueprint can build on it and both tools follow one pattern.

## Scope

- Create `packages/core` in the make-docs monorepo and publish it as a package.
- Move these parts into the core: layout and path handling, resource reading, the MCP server and its profile system, the base of the Store, agent-tool setup (skills install and MCP config for Claude Code, Codex and GitHub Copilot CLI), managed blocks, and `update` and `uninstall`.
- Make the managed-block code take each tool's own tag names, and change only that tool's block.
- Add the handoff-line mechanism: a tool's root block gains or loses one line when the other tool is detected.
- Fix uninstall so a tool removes only its own block, keeps user text, and deletes a file only when nothing is left.
- Support the `.make/<tool>/` project folder and the `~/.make/<tool>/` machine folder as layout targets. The Make Docs move to those folders is its own release and is not part of this phase.
- Refactor the Make Docs CLI onto the core with no change to its current behavior, apart from the uninstall fix.

## Deliverables

- A published `packages/core` package with tests.
- A Make Docs release that uses the core.
- A short core API note for Make Blueprint (exported modules and their contracts).

## Owning PRDs

- `docs/prd/05-ecosystem-and-shared-core.md`
- `docs/prd/06-project-layout-and-instruction-files.md`

## Human Experience and Evidence

- Promise: user text in `AGENTS.md` and `CLAUDE.md` survives both tools. Evidence: round-trip tests with user text above, between and below two tools' blocks, through setup, update, conflict and uninstall.
- Promise: the tools install alone or together. Evidence: the existing Make Docs install tests still pass on the core, plus a test with a second tool's block in the same file.

## Testing Decisions

- Automated Implementation Testing: active. Core unit tests, managed-block round-trip tests and the existing Make Docs suite.
- Performance Testing: `not-needed-now`. No performance candidate sits in this phase.
- Guided Progress Review: `not-needed-now`.
- Unassisted Goal Testing: `not-needed-now`.

## Dependencies

- The Make Docs owner schedules and approves the make-docs changes and release.

## Exit Criteria

- The core package is published, Make Docs runs on it, and the managed-block tests pass for two tools in one file.
