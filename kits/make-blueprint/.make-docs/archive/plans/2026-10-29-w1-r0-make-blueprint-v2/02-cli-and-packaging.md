---
title: "Phase 2: CLI and Packaging"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P2"
---

# Phase 2: CLI and Packaging

> **Replaced by `W1 R1`.** The [W1 R1 plan](../../../../docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md) replaces this plan. Its PRD step produced the current PRD set, which `W1 R1` updates. No work backlog was made from this plan. Use the `W1 R1` plan and the PRDs; the phase files here stay only as reference input for the first backlog.

## Purpose

Stand up the Make Blueprint CLI on the shared core, make `setup` create a working project, and prove early that one signed single file runs on locked-down machines.

## Scope

- Create the TypeScript project in this repository with `packages/core` as a dependency.
- Add the command groups `setup`, `project`, `resource`, `run <domain> <verb>`, `mcp`, `update` and `uninstall`.
- Make `setup` create `.make/blueprint/`, the `blueprint/` tree, the routers in the root, `.make/`, `.make/blueprint/` and `blueprint/` sub-folders, and MCP config for each selected agent tool.
- Serve Make Blueprint system docs (contracts, templates, references, prompts) through `make-blueprint resource read`.
- Start the stdio MCP server shell with the profile set `core`, `setup`, `intake`, `extract`, `analyze` and `all`. Later phases add tools to it.
- Build signed single-file downloads for macOS, Windows and Linux, and an npm publish pipeline.
- Create the `PERF-###` profile for start time and run its first characterization.

## Deliverables

- An installable `make-blueprint` on npm and as signed single files.
- `setup` and `uninstall` that work on a fresh project, alone or beside Make Docs.
- A start-time characterization record.

## Owning PRDs

- `docs/prd/06-project-layout-and-instruction-files.md`
- `docs/prd/07-installation-and-distribution.md`
- `docs/prd/08-cli-and-mcp.md`

## Human Experience and Evidence

- Promise: install alone or together, with handoff. Evidence: an install matrix on fresh projects (Make Blueprint alone, Make Docs alone, both, then remove one) that checks the handoff line appears and disappears. Human Experience Review of first-run setup output.
- Promise: one signed file with no Python. Evidence: install and `setup` in a clean container with no Python and no Node.

## Testing Decisions

- Automated Implementation Testing: active. Install matrix, router tests and build tests for three operating systems.
- Performance Testing: active as a characterization baseline for start time, under its `PERF-###` profile.
- Guided Progress Review: `not-needed-now`.
- Unassisted Goal Testing: `not-needed-now`.

## Dependencies

- Phase 1 core, or a local link to it while its release is pending.
- Code-signing certificates for macOS and Windows.

## Exit Criteria

- A signed single file installs and runs `setup` on all three operating systems, and the start-time baseline is recorded.
