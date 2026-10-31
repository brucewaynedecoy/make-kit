---
title: "Phase 1: Work Backlog Scope"
kind: "plan"
status: "draft"
coordinate: "W2 R0 P1"
source:
  type: "design"
  path: "docs/designs/2026-10-31-system-packages.md"
---

# Phase 1: Work Backlog Scope

## Purpose

This phase names the work phases of the later `W2 R0` work backlog. The backlog is written when v2.0 ships (Q-095). Every phase reads [20 System Packages](../../prd/20-system-packages.md) first.

## Phase Map

| Work phase | What it builds | Owning PRDs | Depends on |
| --- | --- | --- | --- |
| `01-bundle-format` | The bundle zip and folder reader and writer, the manifest, file hashes, `package-damaged`, and the `format` check | [20](../../prd/20-system-packages.md#bundle-file), [09](../../prd/09-storage-and-indexing.md) | v2.0 |
| `02-package-make` | `run package make` and `package_make`: record selection, fields that travel, the source list in the dry run, the `project check` gate and the atomic bundle write | [20](../../prd/20-system-packages.md#making-a-package), [08](../../prd/08-cli-and-mcp.md#system-package-commands-v21) | `01-bundle-format` |
| `03-package-add` | `run package add` and `package_add` for a first version: the shared plan and write steps from the v1 import, identity, merges, the `package` record, the `origin` stamp, sources under `blueprint/sources/packages/`, `run package list` and `run package show` | [20](../../prd/20-system-packages.md#taking-a-package-in), [10](../../prd/10-records-and-identity.md), [11](../../prd/11-record-types-reference.md#package-v21), [12](../../prd/12-source-intake-and-conversion.md), [17](../../prd/17-v1-import.md) | `01-bundle-format` |
| `04-new-versions` | New versions: matching by upstream `id`, the change hash, pending changes, `archived` and `origin-withdrawn`, `origin-unknown-package`, `run extract next` and `project status` for sources from a package, and the performance profile for a large write | [20](../../prd/20-system-packages.md#a-new-version), [10](../../prd/10-records-and-identity.md#check-catalog), [13](../../prd/13-extraction-and-review.md) | `03-package-add` |
| `05-release` | Documentation of the commands, the round-trip test across two synthetic projects, and the v2.1 release | [20](../../prd/20-system-packages.md), [07](../../prd/07-installation-and-distribution.md) | `02-package-make`, `04-new-versions` |

## Testing Decisions

- Automated Implementation Testing in every phase, with synthetic making projects and no client data.
- Human Experience Review of the dry-run output of `run package make` and `run package add` in phases `02-package-make` and `03-package-add`.
- Performance: phase `04-new-versions` creates the `PERF-###` profile for a large `run package add` before its first measurement.
- Guided Progress Review and Unassisted Goal Testing: `not-needed-now`.

## Exit Criteria

- Each work phase in the map has one phase file in the `W2 R0` work backlog, and each task links to a section of PRD 20 or another owning PRD.
