---
title: "Phase 6: Shared Surfaces and Validation"
kind: "plan"
status: "draft"
coordinate: "W1 R1 P6"
---

# Phase 6: Shared Surfaces and Validation

## Purpose

Update the shared PRD surfaces after the PRD workers finish, then prove the whole set is consistent.

## Write Scope

`docs/prd/00-index.md`, `03-open-questions-and-risk-register.md` and `04-glossary.md`, then fix-only edits to any file that validation flags.

## Index

- Add `19-system-integrations.md` to the Document Map with kind `subsystem`, status `active`, release scope "v2.0; field-level mapping and diagrams later", related docs 11, 13, 14 and 15, and a focus line on recording and analyzing integrations between systems.
- Update the release scope and focus cells that the decisions change: 05 (shared `.make/config.yaml` and `.make/personas.yaml`), 11 (twelve v2.0 types), 12 (source git levels in v2.0, replacing "full `local` source handling not yet scheduled"), 14 (requirement-level marks behind each verdict) and 15 (the full export set).
- Update the focus text of 16 to name the seven stage skills, `blueprint-report` and `blueprint-convert` (Q-080).
- Renumber nothing.

## Glossary

Each row is `update-existing`.

| Decision | Terms | Current normative update |
| --- | --- | --- |
| Q-001 | `packages/core`; Local link; Step 0 | The core is in the make-kit monorepo; a local link is a workspace link; Step 0 is repo-wide work. |
| Q-009 | Project update; Tool update; Schema version; `setup` | `update` updates the tool only. Running `setup` again updates the project and upgrades records. |
| Q-012 | Project config | `.make/blueprint/config.yaml`; drop "still open". |
| Q-018 | `id` | A prefix plus 8 lowercase letters and digits with at least one letter. |
| Q-019 | Ref fix | The record created first keeps the `ref`. |
| Q-024 | Make Docs link | Skipped with a count until the Make Docs read command ships (O-001). |
| Q-026 | Anchor | The marker is `<a id="p-012"></a>`, in Make Blueprint converted text only. |
| Q-028 | Location type; Missing; `source` | Replace Location type with Source git levels (`all`, `converted`, `none`). Missing means a file kept out of git that is not on this machine. |
| Q-029 | Git LFS | The default for originals of 50 MB or more, with rules in `blueprint/sources/.gitattributes`. |
| Q-032 | Pending change (new) | A reviewed proposal that fixes a fact on an active record in place. |
| Q-042 | `blueprint-report` (new) | The skill that drafts export prose into records and runs exports. |
| Q-048, Q-070, Q-072 | Persona; `persona`; shared people and roles file, Maintainer entry, User entry, `owners`, `stakeholders`, `audience` (new) | A persona record points to its slug in `.make/personas.yaml`. Replace "never stand for each other". Define each new term. |
| Q-049 | `serve` | A top-level lifecycle command beside `mcp`, reserved in the core; drop "open". |
| Q-060, D-011 | Shared setup choices; project `name` (new) | `.make/config.yaml` holds choices that every kit shares, including the optional project `name`. |
| Q-061 | Anchor; Converted text; Evidence link; Table anchor (new) | The `t` kind, table, row, column and cell positions, and `<original>.t-001.csv`. |
| Q-063 | Status filter; `active` | `none` for the status filter, which stays. Exports read the records that pass it, `active` by default. |
| Q-065, Q-066 | `fit-gap`; Verdict; Requirement mark (new) | A requirement mark is `met`, `configured`, `unreleased`, `partly` or `not-met`, and the verdict follows from the marks. |
| Q-062, Q-069, Q-058 | Export; Capability model document and Data dictionary export (new) | Exports include Markdown documents as well as CSV files and the workbook. |
| Q-073, Q-057 | Record type; `integrate`; `placement`; Coverage read; `integration` (new) | Twelve types. An integration record is one flow in one direction between two systems. Placements carry `integrations`. The coverage read lists current integrations with no replacement. |
| Q-076 | Content version (new); Record version; Requirement mark; Out-of-date marks | A mark keeps the content version: a hash of a requirement's meaning fields. The record version guards writes only. |
| Q-077 | Shared people and roles file | Entry kinds are `person`, `team`, `organization` and `agent`. An entry stays when its persona record is archived or superseded. |
| Q-078 | List the project can extend | 11 lists the built-in codes. The `lists.*` settings in `.make/blueprint/config.yaml` add the project's own. |
| Q-080 | Agent conversion (new); `blueprint-convert` (new); Page batch (new); Conversion status; `blueprint-report` | The agent route for complex PDFs, its page batches, its two status values and its review, and the ninth skill. Describe `blueprint-report` by its job, not as "the eighth skill". |

Set the front matter `source.path` of 00, 03 and 04 to the `W1 R1` plan overview.

## Register

- For each item whose follow-up says "The W1 R1 change plan updates the owning PRDs to match", replace that sentence with "Done in W1 R1." once its rows are done.
- Check the rebuild risks (`R-###`) for text that a decision changed, and update them.
- Leave the ten deferred items and obligation O-001 as they are.

## Validation Checks

1. Every row in Phases 1 to 5 and this phase is done, or the worker recorded why not.
2. No PRD calls a closed register item an open question. Search for "open question" and "open in 03".
3. No PRD has a `## Requirement History` section, and every PRD's front matter `source.path` names the `W1 R1` plan overview.
4. No example `id` in `docs/prd/` has a random part shorter than 8 characters.
5. Cross-PRD terms match: the names fixed in Phase 2, the twelve record types, the nine skills, the export file names, `setup` versus `update`, and the git levels.
6. `make-docs run prd authority validate --target-root kits/make-blueprint` exits zero.
7. `make-docs run performance evidence validate --target-root kits/make-blueprint` exits zero.
8. All Markdown links resolve, including `../` links into the root docs, which Make Docs does not check (workaround O-004). No real machine paths appear.

The worker writes a short validation report for the coordinator, listing each check, its result and any fix it made.

## Exit Criteria

- All eight checks pass.
- The owner reviews the changed PRDs and accepts them.
