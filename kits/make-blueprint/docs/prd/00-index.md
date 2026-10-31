---
title: "Make Blueprint PRD Index"
kind: "prd"
status: "active"
follow_on:
  route: "work-backlog-generation"
  next_prompt: "make-docs://system/prompt/prd-to-work-full-prd.prompt.md"
  why: "The PRD set is the product contract that the v2.0 work backlog must follow, so the backlog is generated from it before any implementation phase starts."
  coordinate_handoff: "Carry W1 R1 from the plan into docs/work/<generation-date>-w1-r1-make-blueprint-v2/."
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# Make Blueprint PRD Index

## Purpose

This PRD set is the product contract for Make Blueprint, the product formerly named BuildOS. Make Blueprint helps people and agents turn client sources into trusted, traceable records about one or more systems, compare those systems capability by capability, place each capability with an owning system, and link that placement forward to planned work in Make Docs.

The set describes the whole product. v2.0 is the current release scope, and Step 0 is its prerequisite. Step 0 is repo-wide work in the make-kit monorepo that pulls the shared core out into `packages/core/`, planned in the repo-wide plan. Capabilities for v2.2, v2.3 and v3 appear in their owning PRDs as planned scope or as current limitations.

The set is for the two Personas, the `user` and `maintainer` entries in the shared people and roles file, `.make/personas.yaml`. A Persona is an audience role for this product: `user` for the people and agents who do client work with Make Blueprint, and `maintainer` for the people and agents who build, install, operate and upgrade it. See [Audience Paths](#audience-paths).

This index maps the current authoritative shape of the product. It never catalogs the editorial operations used to change that authority.

## Reading Order

1. [01 Product Overview](01-product-overview.md): users, the six Northstar principles, the seven workflow stages, setups A to C, release scope and current limitations.
2. [02 Architecture Overview](02-architecture-overview.md): processes, modules and owners, runtime boundaries, data flow and configuration surfaces.
3. [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md): open questions in the order they block the work backlog, rebuild risks and drift between PRDs.
4. [04 Glossary](04-glossary.md): one alphabetical list of terms, each linked to the PRD that owns it.
5. [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md): how Make Blueprint installs alone or beside Make Docs, what `packages/core` holds, the shared `.make/config.yaml` and `.make/personas.yaml`, the handoff line, and Make Docs links.
6. [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md): the `.make/blueprint/` and `blueprint/` folders, the shared `.make/` files, the machine folder, routers and managed blocks.
7. [07 Installation and Distribution](07-installation-and-distribution.md): `setup`, `update`, uninstall, agent-tool setup, npm and signed single files.
8. [08 CLI and MCP](08-cli-and-mcp.md): the command grammar and catalog, outcomes, MCP profiles, `allowWrite`, filters, read-only SQL, system resources and `project status`.
9. [09 Storage and Indexing](09-storage-and-indexing.md): the storage interface, the record version and the content version, record files, the derived index, the write lock, the write journal and schema versions.
10. [10 Records and Identity](10-records-and-identity.md): common fields, people and role slugs, statuses, `id` and `ref`, aliases, facets, evidence links, relation rules and the `project check` catalog.
11. [11 Record Types Reference](11-record-types-reference.md): fields and links for every record type, as a lookup table.
12. [12 Source Intake and Conversion](12-source-intake-and-conversion.md): source records, source git levels, Git LFS, built-in converters, the agent route for complex PDFs, anchors, table CSV files and change detection.
13. [13 Extraction and Review](13-extraction-and-review.md): the extraction unit, part coverage, duplicate hints, drafts, pending changes, review and the second reviewer.
14. [14 Fit-Gap and Placement](14-fit-gap-and-placement.md): the model stage, comparisons, the fit-gap method, requirement marks, verdicts, `target-only`, placement, delivery and the hand-off boundary.
15. [15 Exports](15-exports.md): the export set of CSV files, Markdown documents and the xlsx workbook, their columns and layouts, and regeneration.
16. [16 Workflow and Skills](16-workflow-and-skills.md): the seven stages as one workflow, and the rules for the seven stage skills, `blueprint-convert` and `blueprint-report`.
17. [17 v1 Import](17-v1-import.md): how one BuildOS v1 project becomes Make Blueprint records.
18. [18 Local Server and UI](18-local-server-and-ui.md): the v2.2 local server, web app, MCP App views and view models.
19. [19 System Integrations](19-system-integrations.md): integration records, current and planned integrations, and how comparisons, placements and the hand-off use them.
20. [20 System Packages](20-system-packages.md): the v2.1 bundles that carry systems and their records from one project to another, and how a project takes in new versions.

PRDs 05 to 08 set the ground that every later PRD builds on. PRDs 09 to 11 fix the record model. PRDs 12 to 16 follow the workflow from intake to hand off. PRDs 17 and 18 cover the v1 path and the later UI. PRD 19 covers the integrations between systems across the extract, compare, place and hand-off stages. PRD 20 covers the v2.1 system packages that carry systems from one project to another.

## Document Map

| Document | Kind | Status | Release scope | Related Docs | Focus |
| --- | --- | --- | --- | --- | --- |
| [Make Blueprint PRD Index](00-index.md) | `core` | `active` | All releases | `—` | Explain the PRD set, its reading order and audience paths |
| [01 Product Overview](01-product-overview.md) | `core` | `active` | Step 0 to v3 | [02](02-architecture-overview.md), [05](05-ecosystem-and-shared-core.md), [16](16-workflow-and-skills.md) | Users and Personas, Northstar principles, key capabilities, setups A to C, release scope, system boundaries and limitations |
| [02 Architecture Overview](02-architecture-overview.md) | `core` | `active` | v2.0, with v2.2 and v3 shown as planned | [01](01-product-overview.md), [05](05-ecosystem-and-shared-core.md), [09](09-storage-and-indexing.md) | Topology, module map and owners, runtime boundaries, data flow and configuration surfaces |
| [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md) | `core` | `active` | All releases | Every PRD | Open questions, rebuild risks, drift between PRDs and deferred obligations, each with an owning PRD |
| [04 Glossary](04-glossary.md) | `core` | `active` | All releases | Every PRD | Canonical terms, including the shared record vocabulary |
| [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) | `subsystem` | `active` | Step 0 and v2.0, with the shared `.make/config.yaml` and `.make/personas.yaml` | [06](06-project-layout-and-instruction-files.md), [07](07-installation-and-distribution.md), [14](14-fit-gap-and-placement.md) | Separate-or-together rule, `packages/core` contents and pin, the shared setup choices and people and roles files, tool discovery, the handoff line, Make Docs links and backlog ownership |
| [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) | `subsystem` | `active` | v2.0; `blueprint/runs/` and `blueprint/playbooks/` in v2.3 | [05](05-ecosystem-and-shared-core.md), [07](07-installation-and-distribution.md), [09](09-storage-and-indexing.md) | Project tree, machine tree, system docs and local copy, routers, managed blocks, conflicts and the project config |
| [07 Installation and Distribution](07-installation-and-distribution.md) | `subsystem` | `active` | v2.0 | [05](05-ecosystem-and-shared-core.md), [06](06-project-layout-and-instruction-files.md), [08](08-cli-and-mcp.md) | `setup`, agent-tool setup and skills install, tool and project update, project and tool uninstall, npm and signed single files, offline use, start-time characterization |
| [08 CLI and MCP](08-cli-and-mcp.md) | `subsystem` | `active` | v2.0; `serve` and the `view` domain in v2.2 | [09](09-storage-and-indexing.md), [10](10-records-and-identity.md), [16](16-workflow-and-skills.md) | Command groups and catalog, human and machine output, outcomes, MCP profiles, `allowWrite`, filter syntax, read-only SQL, system resources and `project status` |
| [09 Storage and Indexing](09-storage-and-indexing.md) | `subsystem` | `active` | v2.0 file backend; setup B lock sharing in v2.2; database backend in v3 | [06](06-project-layout-and-instruction-files.md), [10](10-records-and-identity.md), [18](18-local-server-and-ui.md) | Storage interface, record version and content version, file backend, record files, derived index and text search, write lock, write journal and batches, schema versions and index characterization |
| [10 Records and Identity](10-records-and-identity.md) | `subsystem` | `active` | v2.0 | [09](09-storage-and-indexing.md), [11](11-record-types-reference.md), [12](12-source-intake-and-conversion.md) | Common fields, people and role slugs, statuses and pending changes, `id` and `ref`, aliases, `run record ref-fix`, facets, evidence links, relation rules and the `project check` catalog |
| [11 Record Types Reference](11-record-types-reference.md) | `reference` | `active` | v2.0 for 12 types, `integration` included; v2.3 for test case, run, result and playbook | [10](10-records-and-identity.md), [13](13-extraction-and-review.md), [14](14-fit-gap-and-placement.md), [19](19-system-integrations.md) | Prefix, folder, fields, allowed values and relations for every record type |
| [12 Source Intake and Conversion](12-source-intake-and-conversion.md) | `subsystem` | `active` | v2.0, with all three source git levels | [10](10-records-and-identity.md), [13](13-extraction-and-review.md), [17](17-v1-import.md) | Source records, source git levels and the missing state, hashing, Git LFS, built-in converters, the agent route for complex PDFs, converted text and table CSV files, anchors and table positions, and change detection |
| [13 Extraction and Review](13-extraction-and-review.md) | `subsystem` | `active` | v2.0 | [12](12-source-intake-and-conversion.md), [10](10-records-and-identity.md), [16](16-workflow-and-skills.md), [19](19-system-integrations.md) | Extraction unit, `run extract next`, part coverage and outcome, duplicate hints, drafts, pending changes, review and the second reviewer |
| [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) | `subsystem` | `active` | v2.0, with requirement-level marks behind each verdict | [11](11-record-types-reference.md), [15](15-exports.md), [05](05-ecosystem-and-shared-core.md), [19](19-system-integrations.md) | Model stage, comparisons, the fit-gap method, requirement marks and the verdict table, confidence and effort, out-of-date marks, `target-only`, coverage read, placement, delivery and the hand-off boundary |
| [15 Exports](15-exports.md) | `subsystem` | `active` | v2.0, with the full export set for each system and comparison | [14](14-fit-gap-and-placement.md), [06](06-project-layout-and-instruction-files.md), [08](08-cli-and-mcp.md), [19](19-system-integrations.md) | Export set of CSV files, capability model documents, data dictionaries and the xlsx workbook, file names, columns, encoding, the status filter, the export check and regeneration |
| [16 Workflow and Skills](16-workflow-and-skills.md) | `subsystem` | `active` | v2.0 | [08](08-cli-and-mcp.md), [12](12-source-intake-and-conversion.md), [13](13-extraction-and-review.md), [14](14-fit-gap-and-placement.md) | The seven stages, the seven stage skills, `blueprint-convert` for complex PDFs, `blueprint-report` for exports, and the rules every skill follows |
| [17 v1 Import](17-v1-import.md) | `subsystem` | `active` | v2.0; a pass for the v2.3 types is planned scope | [10](10-records-and-identity.md), [12](12-source-intake-and-conversion.md), [13](13-extraction-and-review.md) | `run import v1`, its dry run, the v1 to v2 mapping, v1 IDs as refs, bulk-extract files and fixtures |
| [18 Local Server and UI](18-local-server-and-ui.md) | `subsystem` | `active` | v2.2 planned scope; UI editing later; mods outside the release plan | [08](08-cli-and-mcp.md), [09](09-storage-and-indexing.md), [01](01-product-overview.md) | Setup B local server, Svelte web app, MCP App views, view models and the position on Claude Code mods |
| [19 System Integrations](19-system-integrations.md) | `subsystem` | `active` | v2.0; field-level mapping and diagrams later | [11](11-record-types-reference.md), [13](13-extraction-and-review.md), [14](14-fit-gap-and-placement.md), [15](15-exports.md) | Recording the integrations between systems, one flow in one direction, and analyzing them in comparisons, placements and the hand-off |
| [20 System Packages](20-system-packages.md) | `subsystem` | `active` | v2.1 planned scope | [10](10-records-and-identity.md), [11](11-record-types-reference.md), [12](12-source-intake-and-conversion.md), [17](17-v1-import.md) | Making a versioned bundle of one or more systems and their records, taking it in as a baseline in another project, and taking in new versions without losing the team's own changes |

## Source Anchors

The set traces to the Make Blueprint design, the repo-wide design and two plans. The Make Blueprint design is the authority for every decision, and the register records the owner's decisions in detail. The baseline plan fixed the PRD catalog, the work phases and the evidence for each human promise. The maintenance plan carries the owner's decisions into the set and fixes the scope of the first work backlog.

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` ([Make Blueprint v2 Architecture](../designs/2026-10-29-make-blueprint-v2-architecture.md))
- The repo-wide [Make Kit Monorepo](../../../../docs/designs/2026-10-30-make-kit-monorepo.md) design, in the repository root's `docs/designs/` folder
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` ([Make Blueprint v2 Baseline Plan](../../.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md))
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/01-shared-core.md` to `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/09-v1-import-and-release.md` (phase files, each naming its owning PRDs)
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md` ([Make Blueprint v2 Owner Decision Maintenance Plan](../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md))
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/07-work-backlog-scope.md` (phase map of the first work backlog)
- `README.md`
- `.make-docs/config.yaml` (effective Personas for this repository)

## Audience Paths

### `user` Persona

Consultants, architects, product owners and stakeholders, and the agents that act for them. They add sources, extract and review records, build comparisons and placements, and export files for clients.

1. [01 Product Overview](01-product-overview.md), for the seven stages and what each release offers.
2. [16 Workflow and Skills](16-workflow-and-skills.md), for the stage skills that guide the work.
3. [12 Source Intake and Conversion](12-source-intake-and-conversion.md) and [13 Extraction and Review](13-extraction-and-review.md), for intake, extraction and review.
4. [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), [19 System Integrations](19-system-integrations.md) and [15 Exports](15-exports.md), for comparisons, verdicts, placements, integrations and the files a client opens.
5. [10 Records and Identity](10-records-and-identity.md), for refs, evidence links and what `project check` reports.
6. [Project Status](08-cli-and-mcp.md#project-status) in [08 CLI and MCP](08-cli-and-mcp.md), for the one command that shows where a project stands.
7. [04 Glossary](04-glossary.md), whenever a term is unclear.

People who hold a BuildOS v1 project read [17 v1 Import](17-v1-import.md) next. People who want the later browser views read [18 Local Server and UI](18-local-server-and-ui.md).

### `maintainer` Persona

People and agents who build, install, operate and upgrade Make Blueprint, and who keep `packages/core` in step with Make Docs.

1. [01 Product Overview](01-product-overview.md) and [02 Architecture Overview](02-architecture-overview.md), for the product boundary and the module map.
2. [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md), for the choices still open and the risks to guard against.
3. [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md), [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) and [07 Installation and Distribution](07-installation-and-distribution.md), for the shared core, the shared `.make/` files, the folders, managed blocks and installs.
4. [08 CLI and MCP](08-cli-and-mcp.md), for the command catalog and MCP profiles.
5. [09 Storage and Indexing](09-storage-and-indexing.md), [10 Records and Identity](10-records-and-identity.md) and [11 Record Types Reference](11-record-types-reference.md), for the record model.
6. PRDs 12 to 17 and [19 System Integrations](19-system-integrations.md), in order, for the stage behavior that the commands carry out.
7. [18 Local Server and UI](18-local-server-and-ui.md), before any v2.2 work.

An agent that implements one phase of the first work backlog reads that phase's owning PRDs first. The backlog keeps the baseline plan's phase numbers.

| Work phase | Owning PRDs |
| --- | --- |
| `01-shared-core-adoption` | [05](05-ecosystem-and-shared-core.md), [06](06-project-layout-and-instruction-files.md) |
| `02-cli-and-packaging` | [06](06-project-layout-and-instruction-files.md), [07](07-installation-and-distribution.md), [08](08-cli-and-mcp.md) |
| `03-storage-and-identity` | [09](09-storage-and-indexing.md), [10](10-records-and-identity.md) |
| `04-record-types` | [10](10-records-and-identity.md), [11](11-record-types-reference.md), [05](05-ecosystem-and-shared-core.md) for Make Docs links and the shared people and roles file |
| `05-intake-and-conversion` | [12](12-source-intake-and-conversion.md) |
| `06-extraction-and-review` | [13](13-extraction-and-review.md), [19](19-system-integrations.md) for current integrations |
| `07-analysis-and-exports` | [14](14-fit-gap-and-placement.md), [15](15-exports.md), [19](19-system-integrations.md) |
| `08-mcp-skills-and-status` | [08](08-cli-and-mcp.md), [16](16-workflow-and-skills.md) |
| `09-v1-import-and-release` | [17](17-v1-import.md), [07](07-installation-and-distribution.md) |

## Intended Follow-On

This handoff is advisory-default-but-overridable: it is authoritative unless the user explicitly overrides it, and it is not a gate or precondition.

- Route: `work-backlog-generation`
- Next step: Generate the first full work backlog for v2.0 from this PRD set, at `docs/work/<generation-date>-w1-r1-make-blueprint-v2/`, in the nine work phases above. Read `make-docs://system/prompt/prd-to-work-full-prd.prompt.md` with `make-docs resource read` and follow it. Before you start, read the items still open in [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md), because some of them must be decided before the work phases they name.
- Why: The PRD set is the product contract. The backlog must follow it, so each phase task traces to an owning PRD before implementation starts.
- Coordinate Handoff: `W1 R1`. Carry it from the plan into `docs/work/<generation-date>-w1-r1-make-blueprint-v2/`.
