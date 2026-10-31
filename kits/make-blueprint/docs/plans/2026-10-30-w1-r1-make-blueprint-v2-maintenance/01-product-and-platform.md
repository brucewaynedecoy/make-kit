---
title: "Phase 1: Product and Platform"
kind: "plan"
status: "draft"
coordinate: "W1 R1 P1"
---

# Phase 1: Product and Platform

## Purpose

Carry the owner's decisions into the PRDs that describe the product, its architecture, the shared core, the project layout, installation and the command surface.

## Write Scope

`docs/prd/01-product-overview.md`, `02-architecture-overview.md`, `05-ecosystem-and-shared-core.md`, `06-project-layout-and-instruction-files.md`, `07-installation-and-distribution.md` and `08-cli-and-mcp.md`. Glossary changes for these decisions belong to [Phase 6](06-shared-surfaces-and-validation.md). Use the names fixed in [Phase 2](02-records-and-storage.md#field-and-setting-names).

- Front matter: set `source.path` to `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md` in every PRD you edit. Add no `## Requirement History` section (see the overview).

## Updates

Each row is `update-existing` unless it says `none`. Copy section headings exactly when editing.

| Decision | PRD | Sections | Current normative update |
| --- | --- | --- | --- |
| Q-001 | 01 | System Boundaries; Release Scope | The core lives in `packages/core/` of the make-kit monorepo. Step 0 is repo-wide work: copy Make Docs in, pull the core out, pass the switch point, then the `make-kit` tool. It is not a Make Docs release. |
| Q-024 | 01 | System Boundaries; Current Limitations | `project check` skips Make Docs links and says how many, until Make Docs ships its read command (obligation O-001). |
| Q-028, Q-029 | 01 | Northstar Principles (one-folder row); Current Limitations | Three source git levels (`all` by default, `converted`, `none`), all in v2.0; `none` for secret content. Git LFS is the default for originals of 50 MB or more. Remove "local-only sources are minimal" and the `repo` source wording. |
| Q-032 | 01 | Capabilities by Workflow Stage | The Review stage also approves or rejects pending changes to active records. |
| Q-042 | 01 | Key Capabilities; Release Scope | Seven stage skills plus `blueprint-report`. |
| Q-048, Q-072 | 01 | Users; Complexity Kept Out of the Human Path | Personas are the `user` and `maintainer` entries in `.make/personas.yaml`. A persona record is related to them and points to its slug. Replace the `.make-docs/config.yaml` anchor. |
| Q-073 | 01 | Capabilities by Workflow Stage; Foundation Capabilities; Release Scope | Twelve v2.0 record types. Current integrations come from Extract; planned ones come from Compare and Place as drafts. |
| Q-058, Q-062, Q-069, Q-073 | 01 | Foundation Capabilities (Exports row) | The export set adds the capability model document and data dictionary for each system, the comparison data dictionary, and the fit-gap requirements, placements and integrations CSV files. |
| Q-071 | 01 | Release Scope | `none`. The import is already in v2.0. |
| Q-001 | 02 | Topology; Core Modules; Runtime Boundaries | The core comes from the make-kit monorepo, released as a core release. Add tool discovery to the module table and the diagram. |
| Q-007, Q-008 | 02 | Topology; Data Flow | Diagrams say `project check`, not a bare "check". |
| Q-009 | 02 | Configuration Surfaces | Rerunning `setup` upgrades records; `update` does not. |
| Q-011 | 02 | Module Map | `none`. Paths come after work phase 02. |
| Q-028, Q-029 | 02 | Data Flow; Configuration Surfaces | Source git levels, the Blueprint-managed `blueprint/sources/.gitignore` and the `.gitattributes` Git LFS rules replace the `repo` and `local` location types and ignored links. |
| Q-012, Q-060, Q-072, D-011 | 02 | Configuration Surfaces; Core Modules | Rows for `.make/config.yaml` (shared choices, optional `name`) and `.make/personas.yaml`, both written by the core. Project config is `.make/blueprint/config.yaml`. `MAKE_BLUEPRINT_HOME` moves `~/.make/blueprint/`. |
| Q-042 | 02 | Make Blueprint Modules; Configuration Surfaces | Seven stage skills plus `blueprint-report`. |
| Q-061, Q-073 | 02 | Data Flow | Converted text gains `t` table anchors with one CSV file per table. The draft record list includes `integration`. |
| Q-058, Q-062, Q-069, Q-073 | 02 | Make Blueprint Modules (Exports row); Data Flow | Exports are CSV files, Markdown documents and the workbook. |
| Q-032 | 02 | Data Flow | An approved pending change is written into the same record file. |
| Q-001, Q-013 | 05 | Shared Core; Core Dependency Line; Make Docs Capabilities Make Blueprint Depends On; Rebuild Notes | The core is make-kit `packages/core/`, published as `@brucewaynedecoy/make-core`. A local link means a workspace link. The exact pin is unchanged. |
| Q-002 | 05 | Handoff Line | Replace the open-question text: a tool set up or removed later asks the other, through the core, to refresh only its own root block. |
| Q-003 | 05 | Separate or Together; Handoff Line | Project uninstall is `setup remove`. Tool uninstall never touches a project. |
| Q-009 | 05 | Separate or Together | The next `setup`, not `update`, drops a stale handoff line. |
| Q-023 | 05 | Make Docs Links; Component and Capability Map | Any record type can link to any Make Docs doc, not placements only. |
| Q-024 | 05 | Make Docs Link Check; Make Docs Capabilities Make Blueprint Depends On | One Make Docs JSON read command confirms work item IDs and doc paths. Until it ships, the check skips them with a count (O-001). |
| Q-025 | 05 | Backlog Ownership | `none`. |
| Q-049 | 05 | Shared Core | The core reserves `serve` for both tools. |
| Q-060, Q-070, Q-072, D-011 | 05 | Shared Core; Separate or Together; Make Docs Capabilities Make Blueprint Depends On | The core reads and writes `.make/config.yaml` and `.make/personas.yaml`; kits only read them. A personas entry has a slug, a name, a primitive (`user` or `maintainer`), a kind (`person`, `team` or `agent`) and its enabled kits. The core adds an entry when a persona record is approved. The Make Docs Persona list moves into the same file. `owners` and `stakeholders` point to `maintainer` entries, and `audience` to `user` entries. |
| Q-005 | 06 | Malformed Tags; Block States | Broken tags of either tool stop setup and change nothing. |
| Q-009 | 06 | Block Hashes and Conflicts; Malformed Tags; Safe Writes; Block States; Integrations | Block handling runs in `setup` and `setup remove`, not `update`. |
| Q-012 | 06 | Project Tree; Project Config; Machine Tree | The project config file is `config.yaml`; drop "name and format are open". Add `MAKE_BLUEPRINT_HOME`. |
| Q-060, Q-072, D-011 | 06 | Project Tree; Routers; Project Config | `.make/config.yaml` (agent tools, optional `name`) and `.make/personas.yaml` join the tree. Setup choices move out of the kit config. The `.make/` router names both shared files. |
| Q-028, Q-029 | 06 | Project Tree | `blueprint/sources/` holds a Blueprint-managed `.gitignore` and `.gitattributes`. The one-folder sentence uses git levels. |
| Q-040 | 06 | Project Tree | Git tracks `blueprint/exports/`, which also holds Markdown documents. |
| Q-004, Q-014 to Q-017 | 06 | Uninstall; System Docs and Local Copy; Project Tree; Routers; Machine Tree | `none`. |
| Q-005 | 07 | Setup | Step 1 checks both tools' tags. |
| Q-006 | 07 | Signed Single Files | Targets: macOS arm64 and x64, Windows x64, Linux x64 and arm64; Windows arm64 later. Work phase 02 proves them. |
| Q-009 | 07 | Scope; Component and Capability Map; Update; Tool Update; Project Update; Rebuild Notes | `update` updates only the tool. Project sync, record upgrades and new folders come from rerunning `setup`. |
| Q-012 | 07 | npm Package | Packages `@brucewaynedecoy/make-blueprint` and `@brucewaynedecoy/make-core`. |
| Q-042 | 07 | Setup; Skills Install; npm Package; Signed Single Files | Eight skills. |
| Q-060 | 07 | Setup; Config and Store | Setup preselects choices from `.make/config.yaml` and writes changes back there for every kit. `make-kit setup` can run it. |
| Q-002 to Q-004, Q-013, Q-016 | 07 | Setup; Uninstall | `none`. |
| Q-007, Q-008, Q-010, Q-014, Q-047 | 08 | Command Groups; Outcomes and Exit Codes; System Resources; `run import` | `none`. |
| Q-009 | 08 | Command Groups; Lifecycle Commands; Project Status | `update` is the tool update only. The next action for older records is `make-blueprint setup`. |
| Q-019 | 08 | `run record` (ref-fix row) | The record created first keeps the `ref`; the other gets a new one and keeps the old one as an alias. |
| Q-024 | 08 | Integrations | Make Docs links are skipped with a count until the read command ships (O-001). |
| Q-028 | 08 | `run source`; Project Status | Git levels and missing kept-out files replace "location" and missing `local` sources. |
| Q-032 | 08 | `run record`; `run review`; Project Status | A fact change on an active record is a pending change. The review verbs list, approve and reject pending changes; the exact command shape is set before work phase 06 ends. Status counts waiting pending changes. |
| Q-034 | 08 | `run review` | Review groups drafts by extraction, and analysis drafts by comparison. |
| Q-041 | 08 | `run review`; MCP Server and Profiles | `review_approve` and `review_reject` also sit in `analyze`. Pending-change review sits wherever review sits. |
| Q-049 | 08 | The `serve` Command (v2.1) | Replace the options with the decision: a top-level `serve` beside `mcp`, outside the operation catalog, reserved in the core. |
| Q-060, D-011 | 08 | Lifecycle Commands; Project Status | `--agent` defaults to the `.make/config.yaml` choices. The project section shows the optional `name`. |
| Q-061 | 08 | `run source`; Filter Syntax; Filter Grammar | `links:` and `run source show` accept table positions such as `#t-001:r-0012:c-003`, and the grammar allows `:` inside that value. |
| Q-058, Q-062, Q-069, Q-073 | 08 | `run export` | `export fit-gap` adds the comparison data dictionary and the fit-gap requirements, placements and integrations CSV files. `export system` adds the capability model document and data dictionary. |
| Q-065, Q-068, Q-073 | 08 | `run compare` | `compare next` also hands out capabilities whose marks are out of date. `compare score` takes a mark for every baseline requirement. `compare show` lists current integrations that touch a baseline system and have no replacement. |
| Q-072 | 08 | Command Catalog (kind definitions) | The `write` kind also covers the core adding a `.make/personas.yaml` entry when a persona record is approved. |
| Q-080 | 01 | Key Capabilities; Release Scope | v2.0 ships nine skills: the seven stage skills, `blueprint-report` and `blueprint-convert`. Complex PDFs can take the guided agent route, with review. |
| Q-080 | 02 | Make Blueprint Modules; Configuration Surfaces (Installed skills) | The installed skills include `blueprint-convert`. |
| Q-077 | 05 | The section that owns `.make/personas.yaml` | Core rules 1, 2, 5 and 6 from register Q-077: the core creates the file on its first write and leaves the built-in `user` and `maintainer` entries implicit; a slug is unique across the file, and a clash reports `blocked`; the core's write is part of the caller's journaled change; entry kinds are `person`, `team`, `organization` and `agent`. |
| Q-080 | 05 | Content passed to the core | The skills passed to the core include `blueprint-convert`. |
| Q-078 | 06 | Project Config | `lists.capability_type`, `lists.option_scope` and `lists.integration_method`: each holds the codes the project adds to the built-in list in 11. |
| Q-080 | 07 | Setup; Skills Install; npm Package; Signed Single Files | Nine skills. |
| Q-080 | 08 | `run source`; `run review`; MCP tools and profiles | `run source convert <source> --agent [--reason <text>]` starts the agent route for one PDF, and `--reason` is required when the built-in converter reported no trouble signal. `run source pages-next <source> [--file]` hands out the next page batch; `--file` also writes a page-range PDF to `~/.make/blueprint/`. `run source pages-write <source> --pages <range>` takes one batch's Markdown and table CSV files and runs the CLI checks. `run review list`, `show`, `approve` and `reject` also take sources in `awaiting-review`; a rejection sends the named pages, or every page, back to the agent. The MCP tools `source_pages_next` and `source_pages_write` are in the `intake` profile. |
| Q-076 | 08 | `run compare` | `run compare next` returns each requirement's content version. |

## Example IDs

Replace example `id` values that have a random part shorter than 8 characters: one in 01, one in 02 and five in 08.

## Exit Criteria

- Every row above is done, and no section in these PRDs still calls a closed item open.
- Each PRD's front matter `source.path` names the `W1 R1` plan.
- No short example `id` remains in these PRDs.
