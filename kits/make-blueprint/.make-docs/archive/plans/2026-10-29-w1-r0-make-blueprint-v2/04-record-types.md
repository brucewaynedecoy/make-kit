---
title: "Phase 4: Record Types"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P4"
---

# Phase 4: Record Types

> **Replaced by `W1 R1`.** The [W1 R1 plan](../../../../docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md) replaces this plan. Its PRD step produced the current PRD set, which `W1 R1` updates. No work backlog was made from this plan. Use the `W1 R1` plan and the PRDs; the phase files here stay only as reference input for the first backlog.

## Purpose

Define the 11 v2.0 record types on top of the storage layer, so every later stage writes records with fixed fields and checked links.

## Scope

- Schemas for source, system, domain, capability, requirement, persona, finding, extraction, comparison, fit-gap and placement.
- Common fields: `id`, `ref`, `type`, `title`, `status` (`draft`, `active`, `rejected`, `superseded`, `archived`), summary, evidence links, links, facet values, aliases and schema version.
- Facets: the project config format for named value lists, and validation of facet values.
- Link rules for each type, such as a capability belonging to one system and a requirement belonging to one capability.
- System status lists for capabilities, and the shared domain list.
- Evidence link format (`SRC-<code>#<anchor>`) and its validation in `check`. Anchor resolution itself comes in phase 5.
- Links to Make Docs work items and doc paths, confirmed by `check` through `make-docs` when it is installed and skipped when it is not.
- The `run record` commands for create, read, update, list and link, using the filter syntax.

## Deliverables

- Record schemas, validation and record commands with tests.
- A fixture set of sample records for later phases.

## Owning PRDs

- `docs/prd/10-records-and-identity.md`
- `docs/prd/11-record-types-reference.md`
- `docs/prd/05-ecosystem-and-shared-core.md` (Make Docs links)

## Human Experience and Evidence

- Promise: evidence links reach the exact place in a source. Evidence: validation tests for the link format and for links to missing sources.

## Testing Decisions

- Automated Implementation Testing: active. Schema, link and facet tests, and Make Docs link checks with and without `make-docs` installed.
- Performance Testing: `not-needed-now`.
- Guided Progress Review: `not-needed-now`.
- Unassisted Goal Testing: `not-needed-now`.

## Dependencies

- Phase 3 storage and identity.

## Exit Criteria

- All 11 types can be created, linked, filtered and checked through the CLI.
