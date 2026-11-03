---
title: "Make Kit PRD Index"
kind: "prd"
status: "active"
follow_on:
  route: "work-backlog-generation"
  next_prompt: "make-docs://system/prompt/prd-to-work-full-prd.prompt.md"
  why: "The root PRD set is the contract for Step 0, so the Step 0 work backlog is generated from it before any Step 0 phase starts."
  coordinate_handoff: "Carry W1 R0 from the plan into docs/work/<generation-date>-w1-r0-make-kit-monorepo/."
source:
  type: "plan"
  path: "docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md"
---

# Make Kit PRD Index

## Purpose

This PRD set is the repo-wide product authority for Make Kit, the family of command-line tools for work on a project with AI agents. Each tool is a kit. The set owns the rules that every kit shares, the shared core, the `make-kit` setup tool and the shared `.make/` files, the build and release flow, the layout of the `make-kit` repository, and the release order across kits. Step 0 is its current release scope.

The set has the fixed files `00` to `04` and the subject PRDs `05` to `08` ([Q-006 Root PRD Set](03-open-questions-and-risk-register.md#q-006-root-prd-set)). Each shared rule has one owning PRD in this set. Each kit's own product stays in that kit's own PRD set, below `kits/<kit>/docs/prd/`.

The set is for the two built-in Make Docs Personas of the root project, `maintainer` and `user`. Either role can be a person or an agent. See [Audience Paths](#audience-paths).

This index maps the current authoritative shape of the product. It never catalogs the editorial operations used to change that authority.

## Reading Order

1. [01 Product Overview](01-product-overview.md)
2. [02 Architecture Overview](02-architecture-overview.md)
3. [05 Kit Conventions](05-kit-conventions.md)
4. [06 Shared Core](06-shared-core.md)
5. [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md)
6. [08 Build and Release](08-build-and-release.md)
7. [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md)
8. [04 Glossary](04-glossary.md)

Read 01 and 02 first for the products, the release order and the repository layout. Read 05 to 08 for the shared rules. Read 03 for the decisions, gaps, risks and temporary workarounds, and 04 for the terms.

Each kit has its own PRD index:

| Kit | PRD index |
| --- | --- |
| Make Blueprint | [Make Blueprint PRD Index](../../kits/make-blueprint/docs/prd/00-index.md) |
| Make Docs | [Make Docs PRD Index](../../kits/make-docs/docs/prd/00-index.md) |

## Document Map

| Document | Kind | Status | Related Docs | Focus |
| --- | --- | --- | --- | --- |
| [00 Make Kit PRD Index](00-index.md) | `core` | `active` | `—` | The PRD set, its reading order and its audience paths |
| [01 Product Overview](01-product-overview.md) | `core` | `active` | 02, 03 | The Make Kit products, their users, the separate-or-together rule, the Step 0 release scope and the current limitations |
| [02 Architecture Overview](02-architecture-overview.md) | `core` | `active` | 01, 05, 06, 07, 08 | The repository layout, the npm workspace, the package map, the docs roots, the root map and the routing check |
| [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md) | `core` | `active` | All | Confirmed drift D-001 to D-041, questions Q-001 to Q-041, rebuild risks R-001 to R-011 and deferred obligations O-001 to O-006 |
| [04 Glossary](04-glossary.md) | `core` | `active` | All | The canonical terms of this set |
| [05 Kit Conventions](05-kit-conventions.md) | `subsystem` | `active` | 02, 03, 06, 07 | The rules that every kit follows, taken from the Make Docs code at `v2.0.6`, with each Make Docs gap |
| [06 Shared Core](06-shared-core.md) | `subsystem` | `active` | 05, 07, 08 | The eight core areas, kit names as inputs, tool discovery, the slice order, Store schema version 6 and the exact core pin |
| [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) | `subsystem` | `active` | 05, 06 | `make-kit setup`, `.make/config.yaml`, `.make/<kit>/config.yaml` and `.make/personas.yaml` |
| [08 Build and Release](08-build-and-release.md) | `subsystem` | `active` | 02, 06 | CI, the shared publish workflow, release tags and digests, trusted publishing, the release gate, the switch point, the public repository, the license and the old repository |

## Source Anchors

- `README.md`
- `AGENTS.md` and `CLAUDE.md` (the hand-written root map, above the Make Docs block)
- `.make-docs/config.yaml` (the root Make Docs project)
- `docs/designs/2026-10-30-make-kit-monorepo.md`
- `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md`
- `kits/make-blueprint/docs/prd/00-index.md`
- [`make-docs v2.0.6: packages/cli/`](../../kits/make-docs/packages/cli/), the Make Docs source tree in `kits/make-docs/`, copied from the tag `v2.0.6`

## Audience Paths

### `maintainer` Persona

The repository owner, and the people and agents who build, test and release kits in this repository.

1. [01 Product Overview](01-product-overview.md) for the products, the [Release Scope](01-product-overview.md#release-scope) of Step 0 and the [Current Limitations](01-product-overview.md#current-limitations).
2. [02 Architecture Overview](02-architecture-overview.md) for the layout, the [Several Docs Roots](02-architecture-overview.md#several-docs-roots) rule and the [Routing Check](02-architecture-overview.md#routing-check).
3. [08 Build and Release](08-build-and-release.md) for CI, the release gate and the switch point.
4. [06 Shared Core](06-shared-core.md) for the core boundary and the slice order.
5. [05 Kit Conventions](05-kit-conventions.md) for the rules that each kit follows.
6. [Deferred Obligations](03-open-questions-and-risk-register.md#deferred-obligations) in the register for the temporary workarounds O-001 to O-005.

An agent that starts at the repository root reads the root map in `AGENTS.md` or `CLAUDE.md` first. For work on one kit, it reads that kit's router and uses that kit's `docs/`. For repo-wide work, it uses this set.

### `user` Persona

The people who install one or more kits in their own projects, and the agents that act for them.

1. [01 Product Overview](01-product-overview.md) for the products, the npm package names and the [Separate or Together](01-product-overview.md#separate-or-together) rule.
2. [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) for `make-kit setup` and the shared `.make/` files, which ship in the setup tool wave.
3. [05 Kit Conventions](05-kit-conventions.md) for the CLI shape, the exit codes, `--json`, the MCP profiles and the project and machine folders that every kit shares.
4. [08 Build and Release](08-build-and-release.md#switch-point) for what a Make Docs user sees at the switch point.

## Intended Follow-On

This handoff is advisory-default-but-overridable: it is authoritative unless the user explicitly overrides it, and it is not a gate or precondition.

- Route: `work-backlog-generation`
- Next step: Generate the Step 0 work backlog from this PRD set in `docs/work/<generation-date>-w1-r0-make-kit-monorepo/`. Read the prompt `make-docs://system/prompt/prd-to-work-full-prd.prompt.md` with `make-docs resource read`, and follow the phase map in plan phase [06 Work Backlog Scope](../plans/2026-11-01-w1-r0-make-kit-monorepo/06-work-backlog-scope.md). Also write the Make Blueprint change plan that turns the shared Make Blueprint rules into links to this set, as plan phase [05 Make Blueprint Links](../plans/2026-11-01-w1-r0-make-kit-monorepo/05-make-blueprint-links.md) describes. The two steps can run in either order.
- Why: This PRD set is the contract for Step 0. The backlog and the Make Blueprint links must read a validated set before any Step 0 phase starts.
- Coordinate Handoff: Carry `W1 R0` into `docs/work/<generation-date>-w1-r0-make-kit-monorepo/`. Each backlog phase that consumes an O-number links its record under [Deferred Obligations](03-open-questions-and-risk-register.md#deferred-obligations). The Make Blueprint change plan is a revision in that kit's own project, so it takes `W1 R2` there.
