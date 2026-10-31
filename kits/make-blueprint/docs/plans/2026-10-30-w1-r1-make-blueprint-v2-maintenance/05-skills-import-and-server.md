---
title: "Phase 5: Skills, Import and Server"
kind: "plan"
status: "draft"
coordinate: "W1 R1 P5"
---

# Phase 5: Skills, Import and Server

## Purpose

Carry the owner's decisions into the PRDs that own the workflow skills, the v1 import and the later local server and UI.

## Write Scope

`docs/prd/16-workflow-and-skills.md`, `17-v1-import.md` and `18-local-server-and-ui.md`. Use the names fixed in [Phase 2](02-records-and-storage.md#field-and-setting-names).

- Front matter: set `source.path` to `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md` in every PRD you edit. Add no `## Requirement History` section (see the overview).

## Updates

Each row is `update-existing` unless it says `none`.

| Decision | PRD | Sections | Current normative update |
| --- | --- | --- | --- |
| Q-003, Q-009 | 16 | Skill Rules | Running `setup` again refreshes the skills, and `setup remove` removes them from a project. `update` updates only the tool, and `uninstall` never touches a project. |
| Q-024 | 16 | Hand-Off Skill | The skill reports Make Docs links that `project check` skipped, with their count, until the Make Docs read command ships (O-001). |
| Q-032 | 16 | Review Skill; Rebuild Notes | The review skill also decides pending changes. v1 row maintenance maps to pending changes, with supersede only for real replacements. |
| Q-034 | 16 | Review Skill | `none`. |
| Q-041 | 16 | Stage Skills; Commands and Profiles by Skill | `blueprint-review` also lists the `analyze` profile. |
| Q-042, Q-063 | 16 | Purpose; Stage Skills; Compare Skill; Skill Rules; Release Scope; Commands and Profiles by Skill; Integrations (15 row); Rebuild Notes | The seven stage skill names are confirmed, not working names. `blueprint-report` joins them: it drafts export prose into records with a checklist that matches the export layout, and runs the exports. `blueprint-compare` only scores, so it drops `run export fit-gap` and the `export` domain. v2.0 ships eight skills, and the end-to-end evidence covers all eight. The v1 `buildos-reporting` row maps to `blueprint-report`. |
| Q-065, Q-067 | 16 | Compare Skill | The skill follows the fit-gap method: it takes capabilities from `run compare next`, marks every baseline requirement with evidence, takes the verdict from the table and the rubric, treats candidates as hints, and then runs the target-only pass. |
| Q-073, Q-057 | 16 | The Seven Stages; Extract Skill; Place Skill | Extraction yields `integration` records for current integrations. Compare and place create planned integrations. The place skill links integration records on `integrate` placements. |
| Q-074, Q-075 | 16 | Release Scope; Skill Rules | `none`. |
| Q-080 | 16 | Stage Skills; Commands and Profiles by Skill | The `blueprint-convert` skill guides the complex-PDF route: when it is allowed, how to batch pages, keep meaning, links and footnotes, and lay out nested tables. |
| Q-018 | 17 | Examples | Lengthen one short example `id`. |
| Q-019 | 17 | Identity: v1 IDs to Refs | When two v1 rows share an ID, both import; the record created first keeps the `ref`, and the other gets a new `ref` with the old one as an alias. |
| Q-023, Q-045, Q-046, Q-071 | 17 | Purpose; Identity: v1 IDs to Refs; Record Mapping; Common Fields; Status Mapping | `none`. |
| Q-024 | 17 | Integrations (05 row) | Imported Make Docs doc links are skipped with a count until the Make Docs read command ships (O-001). |
| Q-028 | 17 | Scope; Sources, Converted Text and Evidence | v1 sources import at the git level that matches where their originals were: in git at `all`, outside git at `converted` or `none`. Remove `repo` and `local`. |
| Q-043 | 17 | Bulk-Extract Files; End-to-End Check of an Imported Project | The treatment is normative, with no "open question" or "recommended" wording. Staged `updated` candidates become pending changes on the matching records, and the end-to-end check counts them. |
| Q-044, Q-061 | 17 | Purpose; Component and Capability Map; Sources, Converted Text and Evidence | The import writes into the v1 project folder itself, never touches v1 files, and the person deletes the v1 folders after accepting the result. Kept v1 converted text takes the v2 form with `converter: v1`: spreadsheet sheets become table CSV files, and v1 row anchors map to table row positions such as `#t-001:r-0012`. |
| Q-047 | 17 | Integrations (08 row) | The import is also the MCP tool `import_v1` in the `setup` profile, with the write behind `apply: true` and `allowWrite`. |
| Q-048, Q-072 | 17 | Record Mapping (Persona row) | Each imported persona record gets its slug in `.make/personas.yaml`, written through the core. |
| Q-055 | 17 | Items That Do Not Map | "Deferred to v2.2 planning", not an open question. |
| Q-070, Q-072 | 17 | v1 Inputs; Record Mapping (`owners` list row); Integrations | Record `owners` stay in `owners`. The v1 owner list, with names and kinds, becomes `maintainer` entries in `.make/personas.yaml`, written through the core, and is no longer only a follow-up. |
| D-011 | 17 | v1 Inputs; Record Mapping; Common Fields | `instance.name` fills the optional `name` in `.make/config.yaml` when that is empty. |
| Q-020 | 18 | Local Server; Editing Later | One short write lock per checkout, shared by the CLI, the MCP server and the local server. Every write, later UI edits included, checks the record version it read. Stale locks clear themselves, and a busy writer gets `blocked` after a short wait. |
| Q-028 | 18 | Proposed First Views (Source status row) | Git levels and missing kept-out files replace "location" and missing `local` sources. |
| Q-049 | 18 | Integrations (08 row) | `serve` is a top-level command beside `mcp`, reserved in the core for both tools. |
| Q-051 | 18 | Scope; Proposed First Views | The list is deferred to v2.1 planning. The review queue shows flagged records first, and the fit-gap table shows requirement marks. |
| Q-052 to Q-054 | 18 | Purpose; Web App and MCP App Views; Editing Later; Integrations | `none`. |
| Q-080 | 16 | Purpose; Stage Skills; Skill Rules; Release Scope; Commands and Profiles by Skill; Integrations | Register Q-080 detail 5: a ninth skill, `blueprint-convert`, guides the agent route. It is not a stage of its own and serves the intake stage, as `blueprint-report` serves later stages. It lists the `intake` profile. v2.0 ships nine skills, and the end-to-end evidence covers all nine. |
| Q-077 | 17 | v1 Inputs; Record Mapping (`owners` list row); Common Fields | A v1 vendor or organization becomes kind `organization`, a v1 group becomes `team`, and any other v1 kind becomes `team` with the v1 kind kept in the entry's description. The import adds an entry for every owner slug it writes, including slugs the v1 owner list does not name. |
| Q-080 | 17 | Integrations (16 row); Sources, Converted Text and Evidence | All nine skills work on an imported project. Kept v1 converted text keeps `converter: v1`; it takes the agent route only when a person asks. |

## Exit Criteria

- Every row above is done, and no section still calls a closed item open.
- Each PRD's front matter `source.path` names the `W1 R1` plan.
- No short example `id` remains in these PRDs.
