---
title: "Phase 1: Product and Architecture"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P1"
---

# Phase 1: Product and Architecture

## Purpose

Write the two PRDs that tell a reader what the Make Kit monorepo is, who it is for, what each release holds, and how the repository is laid out.

## Write Scope

`docs/prd/01-product-overview.md` and `docs/prd/02-architecture-overview.md`. Glossary terms go to [Phase 4](04-register-and-assembly.md) as a list in the worker's final report.

- Front matter: set `source.type` to `plan` and `source.path` to `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md`.
- Use the section headings of the `prd-overview.md` and `prd-architecture.md` templates, read with `make-docs resource read`.

## 01 Product Overview

| Section | Content | Source |
| --- | --- | --- |
| `## Purpose` | One home for every kit, the shared core and the setup tool | Design sections 1 and 2 |
| `## Users` | `maintainer` people and agents who build and release kits here; `user` people who install kits, and the agents that act for them | Design `## Human Experience Intent` |
| `## Key Capabilities` | Separate or together: each kit has its own npm package and CLI and runs alone. One shared core. One setup tool. Shared setup choices. Releases from this repository's CI under unchanged npm names. | Design sections 1, 3 to 7 |
| `## System Boundaries` | Repo-wide work lives in the root `docs/`; kit work lives in `kits/<kit>/docs/`. The old `make-docs` repository is frozen and read-only in practice after the switch point, but not archived (Q-012). No CLI is named `make`. | Design sections 1, 3 and 8 |
| Release Scope (a `###` part of Key Capabilities) | A table: Make Docs 2.0.7 (the switch point, same code as 2.0.6), Make Docs 2.1.0 (nested-project fixes, the link read command, Kit Conventions links), core 0.1.0, Make Docs 2.2.0 (on the core, with tag-aware managed blocks and the uninstall fix), then the setup tool wave, then Make Blueprint v2.0. The Make Docs Persona move belongs to the setup tool wave. Later Make Docs scope: the handoff line, the `.make/docs/` move, the Azure export and the Naive UAT removal. | Design section 11; Q-002, Q-007, Q-009, Q-014, Q-016, Q-020 |
| `## Current Limitations` | Workarounds O-001 to O-005 until Make Docs 2.1.0. The core is not out yet. The setup tool is a later wave (Q-001). The repository is private until the public step (Q-004). | Design sections 9 and 11 |
| `## Source Anchors` | The design, the root map, and the Make Blueprint release scope in [01 Product Overview](../../../kits/make-blueprint/docs/prd/01-product-overview.md) | |

## 02 Architecture Overview

| Section | Content | Source |
| --- | --- | --- |
| `## Purpose` | How the repository is laid out and how agents find the right docs | Design sections 2 and 8 |
| `## Topology` | The layout tree from design section 2, with `LICENSE`, `package.json`, `.github/` and `scripts/routing-check/` | Design section 2 |
| `## Module Map` | `packages/core/` (`@brucewaynedecoy/make-core`), `packages/kit/` (`@brucewaynedecoy/make-kit`), `kits/make-docs/packages/*` (`@brucewaynedecoy/make-docs` and its parts), `kits/make-blueprint/packages/*` (`@brucewaynedecoy/make-blueprint`). Each kit depends on one exact core version. | Design sections 2, 4 and 7 |
| `## Runtime Boundaries` | Each kit CLI runs alone. The core is a library, not a CLI. The setup tool calls each kit's setup through the core. Each kit keeps its own machine folder and Store. | Design sections 4, 5 and 7 |
| `## Data Flow` | Setup choices flow from `.make/config.yaml` to each kit's setup. People and roles flow from `.make/personas.yaml` to each kit. Link details belong to PRD 07. | Design section 6 |
| `## Configuration Surfaces` | One private root `package.json` with workspaces `packages/*` and `kits/*/packages/*` and one root lockfile (Q-005). One `.make-docs/config.yaml` for each Make Docs project, each with its own `projectId`. Shared `.make/` files belong to PRD 07, and machine folders belong to PRD 05. | Design sections 2, 6 and 8 |
| Several docs roots (a `###` part of Topology) | The root and each kit are separate Make Docs projects. The hand-written root map in `AGENTS.md` and `CLAUDE.md` lists each kit and tells agents where to go. Kit docs never live in the root `docs/`. Workarounds O-001 to O-005 apply until 2.1.0; link the register records, do not restate them. | Design sections 8 and 9 |
| Routing check (a `###` part of Topology) | The method from design section 14 (Q-008): fresh read-only agents with `claude -p` and `codex exec`, 9 tasks (3 Make Docs, 3 Make Blueprint, 3 repo-wide), 2 runs for each task and tool, the pass rule, the results path `docs/assets/maintainer/routing-check/<date>-baseline.md`, misses into the register, and the two runs (after the copy, after the fixes). | Design section 14 |
| Later scope (a `###` part of Topology) | The monorepo setup option waits for the routing check baseline. | Design section 10 |
| `## Source Anchors` | The design and the root map. Make Docs path facts link to `05-kit-conventions.md` in the root PRD set. | |

## Exit Criteria

- Both PRDs use the template headings and state the current or target product, with no change words.
- Every Q-number cited in the tables above appears in the PRD text that owns it.
- The worker's final report lists the glossary terms that the two PRDs use.
