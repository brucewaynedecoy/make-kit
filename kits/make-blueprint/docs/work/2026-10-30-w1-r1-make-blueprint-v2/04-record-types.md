---
title: "Phase 4: Record Types"
kind: "work"
status: "active"
coordinate: "W1 R1 P4"
source:
  type: "prd"
  path: "docs/prd/11-record-types-reference.md"
---

# Phase 4: Record Types

## Purpose

This phase gives Make Blueprint its twelve v2.0 record types, so every later stage writes records with fixed fields, checked values, checked people slugs and checked evidence links. It builds on the storage interface, the record type registry, the `project check` engine and the filter syntax from [Phase 3](03-storage-and-identity.md), on the shared core reader for `.make/personas.yaml` from [Phase 1](01-shared-core-adoption.md), and on the command grammar and operation catalog from [Phase 2](02-cli-and-packaging.md).

## Overview

The phase registers the twelve types with their fields, field order and relation fields, and the built-in code lists that a project can extend through `lists.*` settings. It builds facets, the slug rules for `owners`, `stakeholders`, `audience` and the persona record `slug`, the evidence link format with its `evidence_versions` and link states, and the Make Docs link fields `work_items` and `docs` with the temporary `make-docs-skipped` skip under obligation O-001. It builds the type rules that PRD 11 and PRD 19 state, and the field-level rules in the PRD 14 analysis check table that restate PRD 11. It ships the `run record` commands for create, show, list, update on drafts, link, unlink, archive, supersede, confirm-evidence and schema, and a shared fixture project that phases 05 to 07 load.

The phase map comes from [07 Work Backlog Scope](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/07-work-backlog-scope.md) in the `W1 R1` plan. The PRDs below are the authority.

Phase 3 builds `id` and `ref` minting, name lookup, the status change table, `run record ref-fix`, `run record query`, and the relation codes such as `broken-link` and `link-type`. This phase supplies the type data those codes read. The anchor half of evidence links, with the `broken` and `unavailable` states, comes in [Phase 5](05-intake-and-conversion.md). Pending changes on `active` records come in [Phase 6](06-extraction-and-review.md). The fit-gap method checks, such as `marks-out-of-date` and the verdict from the marks, come in [Phase 7](07-analysis-and-exports.md).

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `direct`. Promise: "Evidence links reach the exact place in a source and flag changed sources", owned for link validation by [10 Records and Identity](../../prd/10-records-and-identity.md#evidence-links-are-checked-and-flag-changed-sources), under the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md). This phase builds the link-validation half. [Phase 5](05-intake-and-conversion.md) builds the anchor half.
- Intended human outcome: A person who reads `project check` or `run record show` sees each evidence link with its state in plain words, the record and the source named by `ref` and title, and the next command. A link made against an older source hash, converter or converter version is always flagged until someone runs `run record confirm-evidence`.
- Human-facing surface or indirect effect: The `evidence` and `evidence_versions` fields in record files, `project check` output, `run record show` output, `run record confirm-evidence` output, and the `make-docs-skipped` line in `project check`.
- Implementation work: Stage 5 builds the link parser, `evidence_versions`, the link states, `run record confirm-evidence` and the flagged-link messages. Stage 6 shows the link states in `run record show`.
- Evidence source or testing type selected under current authority: Automated Implementation Testing for the link format, including table, row, column and cell positions, links to missing sources, links to a changed source, links to a source converted again with a newer converter, and the Make Docs link skip with and without `make-docs` installed. Human Experience Review of the flagged-link output by the agent.
- Executor: The implementing coding agent runs the tests and records the Human Experience Review.
- Accepted obligation or deferral route: [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check) for confirming Make Docs links through the Make Docs read command. None for the evidence promise.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | See the decision record below. |
| Performance Testing | `not-needed-now` | The `W1 R1` plan names no performance candidate for record validation. Validation timing cannot change a current decision, and the index profile from [Phase 3](03-storage-and-identity.md) covers the reads that checks use. |
| Guided Progress Review | `not-needed-now` | The automated tests and the agent's Human Experience Review of real `project check` and `run record show` output answer the promise. No current decision waits on a guided human run. |
| Unassisted Goal Testing | `not-needed-now` | No PRD asks for it, and no current human-experience question needs an unassisted attempt. |

Automated Implementation Testing decision record:

| Field | Value |
| --- | --- |
| Testing type | Automated Implementation Testing |
| Decision informed | Whether the twelve types, their rules and their check codes are ready for phases 05 to 09 to write records |
| Reason now | Every later stage writes these records, and PRD 05 and PRD 10 name automated tests in this phase as the evidence |
| Product maturity | v2.0 prerelease |
| Scope | Write refusals, check codes, record commands and their MCP tools on the shared fixture project |
| Executor | The implementing coding agent |
| Gate effect | Blocks phase close while any test in scope fails |
| Effort budget | One test suite in the repository's test runner, run on every change |
| Stop condition | Every acceptance criterion below has a passing test |
| Evidence retained | Test names and results in the backlog's central `evidence.md` report |
| Rerun trigger | Any change to the type registry, a check code or a `run record` command |

Performance candidate lifecycle fields:

- Base maintenance action: `none`
- Performance applicability: `not-needed`
- Canonical `PERF-###` profile link or `none`: none
- Finite evidence budget and stop-rule reference or `not-applicable`: `not-applicable`
- Execution packet link or `not-applicable`: `not-applicable`
- Outcome and evidence handoff or `none`: none
- Gate disposition and supported-scope limit or `not-applicable`: `not-applicable`

Human Experience Review is separate agent review work, not a testing type. The agent inspects real `project check` and `run record show` output on the fixture project and records observations, conclusions, limits and next actions.

## Source PRD Docs

- [11 Record Types Reference](../../prd/11-record-types-reference.md)
- [10 Records and Identity](../../prd/10-records-and-identity.md): common fields, people and role slugs, facets, evidence links and the check catalog codes for fields
- [19 System Integrations](../../prd/19-system-integrations.md): integration record fields and check rules
- [05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md): Make Docs link format and check
- [06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md): the `lists.*` and facet settings in the project config
- [14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md): the field-level analysis check rules
- [08 CLI and MCP](../../prd/08-cli-and-mcp.md): the `run record` command and MCP tool names

## Source Obligations, Scenarios, And Findings

- Obligation: [O-001 Confirm Make Docs Links in Project Check](../../prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check). This phase builds the skip and its count. The confirmation stays owed until Make Docs ships its read command.
- Register decisions this phase builds: [Q-023](../../prd/03-open-questions-and-risk-register.md#q-023-field-homes-for-imported-links-and-owners), [Q-024](../../prd/03-open-questions-and-risk-register.md#q-024-make-docs-link-check-interface), [Q-064](../../prd/03-open-questions-and-risk-register.md#q-064-capability-and-requirement-detail-fields), [Q-070](../../prd/03-open-questions-and-risk-register.md#q-070-explicit-people-and-role-fields), [Q-073](../../prd/03-open-questions-and-risk-register.md#q-073-integration-records), [Q-077](../../prd/03-open-questions-and-risk-register.md#q-077-shared-people-and-roles-file-details), [Q-078](../../prd/03-open-questions-and-risk-register.md#q-078-built-in-code-lists-and-their-extension-setting), [Q-079](../../prd/03-open-questions-and-risk-register.md#q-079-integration-record-detail-rules) and [Q-084](../../prd/03-open-questions-and-risk-register.md#q-084-small-command-and-status-defaults-found-while-writing-the-work-backlog), for the types that `run record create` refuses.
- Risks: none that the register assigns to this phase.
- Unassisted Goal Testing scenarios: None.
- Findings: None.

## Stage 1 - Type Registry and Common Fields

### Tasks

- [ ] t1: Register the twelve v2.0 types in the Phase 3 type registry: `source` (`SRC`), `system` (`SYS`), `domain` (`DOM`), `capability` (`CAP`), `requirement` (`REQ`), `persona` (`PER`), `finding` (`FIND`), `extraction` (`EXT`), `comparison` (`CMP`), `fit-gap` (`FIT`), `placement` (`PLC`) and `integration` (`INT`), each with its folder under `blueprint/records/` and `schema_version` 1 ([11 Record Types Reference](../../prd/11-record-types-reference.md#type-summary))
- [ ] t2: Reserve the v2.3 prefixes `TC`, `RUN`, `RES` and `PB` so that v2.0 never creates, reads or checks records of the types `test-case`, `run`, `result` and `playbook` ([11 Record Types Reference](../../prd/11-record-types-reference.md#later-types-v23))
- [ ] t3: Register every relation field with its target types, its cardinality and its stored side from the relation summary, including the tree field `parent`, the list-entry relations in extraction `records` and in fit-gap `requirement_marks`, and `related` to any type, so the Phase 3 relation codes apply to the real types ([11 Record Types Reference](../../prd/11-record-types-reference.md#relation-summary))
- [ ] t4: Register each type's field order: the common fields `id`, `ref`, `type`, `title`, `status`, `summary`, then the type's own fields in table order, then `evidence`, `evidence_versions`, `facets`, `related`, `work_items`, `docs`, `superseded_by`, `aliases`, `owners`, `stakeholders`, `tags`, then the reserved `origin`, then `schema_version`, `created_at`, `updated_at`, then unknown fields in the order found. v2.0 reads and keeps `origin`, never writes it, and does not report it as `unknown-field` (Q-093; [10 Records and Identity](../../prd/10-records-and-identity.md#common-fields)) ([11 Record Types Reference](../../prd/11-record-types-reference.md#common-fields-and-field-order))
- [ ] t5: Build the need engine for Required, Required when active, Conditional and Optional fields, so a write refuses a record that breaks a need and lists each problem, and `project check` reports `missing-field` as an error and `unknown-field` as a warning ([11 Record Types Reference](../../prd/11-record-types-reference.md#how-to-read-the-field-tables))
- [ ] t6: Build the common field value rules: `title` is one line and not empty, `summary` is required when `active` and may be empty while `draft`, `tags` hold lowercase letters, digits and hyphens, and a value of the wrong kind or outside its allowed values is refused on write and reported as `bad-value` ([10 Records and Identity](../../prd/10-records-and-identity.md#common-fields))
- [ ] t7: Build the built-in code lists for capability `capability_type`, requirement `option_scope` and integration `method`, and read the project's own codes from `lists.capability_type`, `lists.option_scope` and `lists.integration_method` in `.make/blueprint/config.yaml`. A code uses lowercase letters, digits, hyphens and underscores. A write refuses any other code and names the allowed codes. `project check` reports a stored record with such a code, including a code that the setting no longer lists, as `bad-value` ([11 Record Types Reference](../../prd/11-record-types-reference.md#lists-the-project-can-extend); [06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#project-config))

### Acceptance criteria

- A401: A test registers all twelve types and confirms that each prefix, folder and `type` value matches the PRD 11 type summary, and that each new record carries `schema_version: 1`.
- A402: `make-blueprint run record create --type test-case` returns the outcome `failed`, exit code 2, and a message that the type comes in a later release. No file is written.
- A403: A fixture record with a requirement whose `capability` names a system `id` gets `link-type` from `project check`, which shows that the relation registry is wired to the Phase 3 relation codes.
- A404: A record written by the CLI lists its fields in the PRD 11 order. A hand-edited file with an unknown field `colour` keeps the field after the known fields on the next write, and `project check` reports `unknown-field` as a warning for it. A hand-edited `origin` mapping stays unchanged after the field `tags` on the next write, and `project check` reports no `unknown-field` for it.
- A405: A write of an `active` capability with an empty `summary` is refused and the output names `summary`. The same record as a `draft` is written.
- A406: With `lists.capability_type: [pricing_class]` in `.make/blueprint/config.yaml`, a write of `capability_type: pricing_class` succeeds and a write of `capability_type: pricing-clas` is refused with the allowed codes listed. After the owner drops `pricing_class` from the setting, `project check` reports `bad-value` on each record that still uses it.

### Dependencies

- [Phase 3](03-storage-and-identity.md): the type registry interface, the serializer, the relation codes and the `project check` engine.
- [Phase 2](02-cli-and-packaging.md): the `.make/blueprint/config.yaml` file that `setup` writes, and the command outcomes and exit codes.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing, Guided Progress Review and Unassisted Goal Testing `not-needed-now`, as recorded above.
- Performance evidence: none. No performance candidate in this stage.
- Human Experience Review: The agent reads the refusal text of A402, A405 and A406 and records whether each names the field, the problem and the allowed values. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Not applicable. This stage has no surface a person uses on its own.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the backlog's central `evidence.md` report, under Phase 4, cases A401 to A406.
- Phase / capability status: To be recorded at closeout.

## Stage 2 - Facets

### Tasks

- [ ] t8: Read and validate the `facets` block in `.make/blueprint/config.yaml`: a facet name is lowercase snake_case and unique, `label` is optional, a facet lists one or more values, and each value is a plain code or a mapping with `code` and an optional `label`, with codes in lowercase letters, digits, hyphens and underscores and unique in the facet ([10 Records and Identity](../../prd/10-records-and-identity.md#facets))
- [ ] t9: Validate a record's `facets` mapping on every write: each name is a configured facet, each list has one or more listed codes, and no code repeats. A write refuses a breach and names it ([10 Records and Identity](../../prd/10-records-and-identity.md#facets))
- [ ] t10: Register the check codes `facet-unknown` and `facet-value` as errors, and report each stored record that still uses a facet or a value after the config drops it ([10 Records and Identity](../../prd/10-records-and-identity.md#check-catalog))

### Acceptance criteria

- A407: With the PRD 10 example config, a write of `facets: {legal_entity: [us-east, canada], release: [r2]}` succeeds. A write of `facets: {region: [north]}` is refused and names `region` as an undefined facet. A write of `facets: {release: [r9]}` is refused and names `r9` as a code that `release` does not list.
- A408: After `canada` is dropped from `legal_entity` in the config, `project check` reports `facet-value` as an error on each record that holds `canada`, names the record by `ref` and title, and names the field `facets`.
- A409: A config with the facet name `Legal-Entity` or a repeated code makes the facet validation return each problem with the facet name.

### Dependencies

- Stage 1 of this phase.
- [Phase 3](03-storage-and-identity.md): the index of the `facets` mapping and the `facet.<name>:<value>` filter term.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: The agent reads the A407 and A408 messages and records whether a person can tell which facet or code is wrong and where to fix it. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Not applicable.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A407 to A409.
- Phase / capability status: To be recorded at closeout.

## Stage 3 - Type Fields and Type Rules

### Tasks

- [ ] t11: Build the source record fields: optional `git_level` of `all`, `converted` or `none`; `path` as a project-relative path with forward slashes under `blueprint/sources/`, never absolute; `sha256` as 64 lowercase hexadecimal characters; `converted_path` present only when `conversion_status` is `converted`, `agent-in-progress` or `awaiting-review`; `converter` from `docx`, `xlsx`, `pptx`, `pdf`, `csv`, `md`, `txt`, `manual`, `agent` and `v1` under the same condition; `converter_version` when `converter` is present; `converter_model` and `converted_at` only when `converter` is `agent`; `conversion_status` and `extraction_status` from their value lists; and no `evidence` on a source record. Phase 5 and Phase 6 own the behavior ([11 Record Types Reference](../../prd/11-record-types-reference.md#source))
- [ ] t12: Build the system fields `name`, `vendor` and `capability_statuses` (unique codes), and the domain fields `code` (uppercase letters and digits) and `name`. Report two current domains with one `code` as a `type-rule` error ([11 Record Types Reference](../../prd/11-record-types-reference.md#system); [14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#shared-domain-list))
- [ ] t13: Build the capability fields `system`, `parent`, `domain`, `capability_status`, `capability_type`, `triggers`, `outcomes`, `entities`, `depends_on` and `audience`. Refuse on write, and report as `type-rule` errors: a `parent` or a `depends_on` entry in another system, a `domain` that is not a current domain, and a `capability_status` that is not in the `capability_statuses` list of the capability's system. `triggers`, `outcomes` and `entities` hold one-line texts that are unique in each list ([11 Record Types Reference](../../prd/11-record-types-reference.md#capability); [14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#system-status-lists))
- [ ] t14: Build the requirement fields `capability`, `kind` (`setting`, `rule`, `behavior`, `data` or `dependency`), `option_values`, `option_default`, `option_scope` and `audience`. A write refuses `option_values`, `option_default` or `option_scope` on a requirement whose `kind` is not `setting`, and `project check` reports a stored one as `type-rule` ([11 Record Types Reference](../../prd/11-record-types-reference.md#requirement))
- [ ] t15: Build the persona fields `systems` (one or more, required when active) and `slug` (required when active), and the finding fields `kind` (`gap`, `risk`, `question` or `observation`) and `implications` (any type) ([11 Record Types Reference](../../prd/11-record-types-reference.md#persona); [11 Record Types Reference](../../prd/11-record-types-reference.md#finding))
- [ ] t16: Build the extraction record fields and entry shapes: `source`, `source_sha256`, `extracted_by`, `parts` entries with `label`, `anchor`, `coverage`, `outcome` and `note`, `outcome` (`open`, `records`, `no-records` or `blocked`), `records` entries with an `id` of a system, domain, capability, requirement, persona, finding or integration record and an `action` of `created` or `updated`, `reviewer` and `reviewed_at`. A part with coverage `none` can only be `blocked`, and a part with coverage `partial` or outcome `no-records` or `blocked` needs a note. An extraction record carries no `evidence`. Phase 6 owns when each value is set ([11 Record Types Reference](../../prd/11-record-types-reference.md#extraction))
- [ ] t17: Build the comparison fields `target_system` and `baseline_systems` (one or more, target not among them, each a current system), and the fit-gap fields `comparison`, `baseline_capability`, `target_system`, `covering_capabilities`, `verdict`, `confidence`, `effort`, `gap_detail` and `migration_note`. Refuse on write, and report as `type-rule` errors: a `target_system` that differs from the comparison's; a baseline capability outside the comparison's baseline systems; a covering capability outside the target system; no covering capability for `native`, `configurable`, `partial` or `unreleased`; a covering capability on `gap`; a `target-only` record with a baseline capability or with other than exactly one covering capability; two current fit-gap records in one comparison for one baseline capability; and an empty `gap_detail` for `partial`, `unreleased` or `gap`. Report a fit-gap record with no evidence link as `evidence-required` ([11 Record Types Reference](../../prd/11-record-types-reference.md#fit-gap); [14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#analysis-check-rules))
- [ ] t18: Build the shape of `requirement_marks` entries: marks are present on every verdict except `target-only` and absent on `target-only`; each mark has either `requirement` or `capability`; `version` is 64 lowercase hexadecimal characters; `mark` is `met`, `configured`, `unreleased`, `partly` or `not-met`; `capabilities` names target-system capabilities only, and a write refuses a requirement `id` there (`link-type`); a `not-met` mark has a `note`; any other mark has a capability or an evidence link; a requirement has zero or one mark in a record. Report a mark capability that is not in `covering_capabilities` as `mark-capability-uncovered`. Phase 7 checks the marks against the capability's current requirements and versions ([11 Record Types Reference](../../prd/11-record-types-reference.md#fit-gap); [10 Records and Identity](../../prd/10-records-and-identity.md#check-catalog))
- [ ] t19: Build the placement fields `fit_gap`, `owning_system` (a current system), `delivery` (`configure`, `extend`, `build` or `integrate`) and `integrations`. `integrations` is allowed only for `integrate`, an `active` `integrate` placement lists one or more, and a `draft` may leave it out. Report a second current placement for one fit-gap record as a `type-rule` error ([11 Record Types Reference](../../prd/11-record-types-reference.md#placement); [14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md#placement-records))
- [ ] t20: Build the integration fields `from_system`, `to_system`, `from_capabilities`, `to_capabilities`, `payload`, `trigger` (`on-change`, `schedule` or `on-request`), `frequency`, `method`, `state` (`current` or `planned`), `replaces` and `effort`, with `payload`, `trigger` and `method` required when active, and with no direction field ([11 Record Types Reference](../../prd/11-record-types-reference.md#integration); [19 System Integrations](../../prd/19-system-integrations.md#one-flow-in-one-direction))
- [ ] t21: Build the eight integration check rules as `type-rule` checks on `draft` and `active` integrations, with their levels: the same system at both ends (error); a capability on the wrong side's system (error); a `current` integration with `replaces` (error); a `replaces` entry that is not `current` (error); a `current` integration with no evidence link (warning); a `current` integration with `effort` (warning); a `planned` integration with no evidence link and no `draft` or `active` placement that lists it (warning); and an integration listed by an `integrate` placement that does not touch the placement's owning system (warning) ([19 System Integrations](../../prd/19-system-integrations.md#integration-check-rules))

### Acceptance criteria

- A410: A fixture source record with `converter: agent` and no `converter_model` gets `missing-field` from `project check`, and a fixture source with `converter_model` and `converter: docx` gets `type-rule` naming `converter_model`.
- A411: A write of a capability whose `parent` is in another system is refused and names both systems by `ref`. A hand-edited fixture with the same fault gets a `type-rule` error from `project check`.
- A412: A write of a requirement with `kind: rule` and `option_scope: role` is refused. A hand-edited fixture with the same fields gets `type-rule` from `project check`.
- A413: For each of the eight PRD 14 fit-gap rules in t17, a fixture that breaks it gets a `type-rule` error that names the fit-gap record by `ref` and title and the field. A fixture fit-gap record with no evidence link gets `evidence-required`.
- A414: A fixture fit-gap record whose mark lists `CAP-4rd7m7k2` in `capabilities` while `covering_capabilities` does not list it gets `mark-capability-uncovered` as an error. A write of a mark that names a requirement `id` in `capabilities` is refused with `link-type`.
- A415: A write of an `active` placement with `delivery: integrate` and no `integrations` is refused. A placement with `delivery: extend` and an `integrations` list is refused.
- A416: Each of the eight integration check rules has a fixture that breaks it, and `project check` reports `type-rule` at the level that PRD 19 gives for each.
- A417: A write of an extraction record part with coverage `none` and outcome `records` is refused and names the part label.

### Dependencies

- Stage 1 of this phase.
- [Phase 3](03-storage-and-identity.md): the content version used in each mark's `version` field.
- Used later by [Phase 5](05-intake-and-conversion.md) for source records, [Phase 6](06-extraction-and-review.md) for extraction records and drafts, and [Phase 7](07-analysis-and-exports.md), whose compare and place commands reuse these write refusals.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: The agent reads the A411, A413 and A416 messages and records whether each names the record by `ref` and title, the field, the rule in plain words and the fix. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Not applicable. People meet these rules through later stage commands.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A410 to A417.
- Phase / capability status: To be recorded at closeout.

## Stage 4 - People and Role Slugs

### Tasks

- [ ] t22: Read `.make/personas.yaml` through the shared core reader, with each entry's `slug`, primitive (`user` or `maintainer`) and kind (`person`, `team`, `organization` or `agent`), and treat the core's implicit built-in `user` and `maintainer` entries as the core reports them. Make Blueprint never writes the file ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#shared-core); [10 Records and Identity](../../prd/10-records-and-identity.md#people-and-role-slugs))
- [ ] t23: Validate `owners` and `stakeholders` as `maintainer` slugs and capability and requirement `audience` as `user` slugs. A write refuses a slug the file does not hold, a slug with the wrong primitive, a slug repeated in one list, and a slug in both `owners` and `stakeholders`. Register `slug-unknown`, `slug-primitive` and `slug-repeated` as errors ([10 Records and Identity](../../prd/10-records-and-identity.md#people-and-role-slugs))
- [ ] t24: Validate the persona record `slug`: a `draft` may name a slug the file does not hold yet; an `active` persona's slug names a `user` entry; one slug in the `slug` of two current persona records is `slug-repeated`. Build one read function that says whether an entry is claimed, meaning an `active` persona record names it, for Phase 6 approval to call ([10 Records and Identity](../../prd/10-records-and-identity.md#people-and-role-slugs); [11 Record Types Reference](../../prd/11-record-types-reference.md#persona))
- [ ] t25: Register `audience-inactive-persona` as a warning: an `active` record's `audience` names a slug that no `active` persona record claims and whose persona record is `archived` or `superseded`. The finding names that persona record and its replacement when there is one ([10 Records and Identity](../../prd/10-records-and-identity.md#check-catalog))

### Acceptance criteria

- A418: With a fixture `.make/personas.yaml` that holds `ops-lead` as `maintainer` (kind `organization`) and `billing-clerk` as `user`, a write with `owners: [ops-lead]` and `audience: [billing-clerk]` succeeds. `owners: [billing-clerk]` is refused with `slug-primitive`, and `owners: [nobody]` is refused with `slug-unknown`.
- A419: A write with `owners: [ops-lead]` and `stakeholders: [ops-lead]` on one record is refused with `slug-repeated`.
- A420: A `draft` persona record with `slug: new-role`, which the file does not hold, is written. `project check` reports no slug problem for it. The same record set to `active` by a hand edit gets `slug-unknown`.
- A421: A fixture capability with `audience: [billing-clerk]`, whose only persona record is `superseded` by another persona record that names a different slug, gets `audience-inactive-persona` as a warning that names both persona records by `ref` and title.
- A422: A test confirms that no Make Blueprint code path opens `.make/personas.yaml` for writing.

### Dependencies

- [Phase 1](01-shared-core-adoption.md): the shared core reader for `.make/personas.yaml`.
- Stage 3 of this phase for the persona record type.
- Used later by [Phase 6](06-extraction-and-review.md), where approval of a persona record asks the core to write the entry, and where `extracted_by` and `reviewer` slugs and `name-not-slug` are built.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: The agent reads the A418 and A421 messages and records whether a person can tell which slug is wrong and what the file holds instead. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Not applicable.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A418 to A422.
- Phase / capability status: To be recorded at closeout.

## Stage 5 - Evidence Links and Make Docs Links

### Tasks

- [ ] t26: Build the evidence link parser for the six forms `<source id>#<anchor>`, `<source id>#<table anchor>`, `<source id>#<table anchor>:<row>`, `<source id>#<table anchor>:<column>`, `<source id>#<table anchor>:<row>:<column>` and `<source id>`. A row or column position appears only after a table anchor, and a cell link puts the row before the column. A link names its source by `id`, so a command that is given a source `ref` or alias stores the `id`. Links are unique in one list and keep their stored order ([10 Records and Identity](../../prd/10-records-and-identity.md#evidence-links))
- [ ] t27: Maintain `evidence_versions`: one entry for each source that the record's links name, in `evidence` and in fit-gap `requirement_marks`, holding that source's `sha256`, `converter` and `converter_version` when the links were made or last confirmed. The CLI writes the entry whenever it writes a link and drops entries that no link uses. A command that adds a link to a source whose entry is older than the source's current version refuses and names the record's other links to that source to confirm first ([10 Records and Identity](../../prd/10-records-and-identity.md#evidence-links))
- [ ] t28: Build `run record confirm-evidence <record> <source>` with the MCP tool `record_confirm_evidence`. It sets the record's entry for that source to the source's current version and changes nothing else. No other command moves a link to the current version ([10 Records and Identity](../../prd/10-records-and-identity.md#evidence-links); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-record))
- [ ] t29: Build the link states that the records alone decide: `malformed`, `unknown-source`, `no-anchor`, `not-converted`, `old-version`, `unconfirmed` and `ok`, with every state that applies listed most serious first. Register `evidence-malformed`, `evidence-unknown-source` and `evidence-not-converted` as errors and `evidence-no-anchor`, `evidence-old-version` and `evidence-unconfirmed` as warnings. Leave a hook for the `broken` and `unavailable` states that Phase 5 resolves ([10 Records and Identity](../../prd/10-records-and-identity.md#evidence-links))
- [ ] t30: Build `evidence-required` for a current record that an extraction created or updated and that has no link to that extraction's source, beside the fit-gap rule from t17 ([10 Records and Identity](../../prd/10-records-and-identity.md#evidence-links))
- [ ] t31: Write the flagged-link message for `project check` and record detail: the record by `ref` and title, the link, the source by `ref` and title, the state in plain words such as "the source changed after this link was made", and the next useful action, such as `run record confirm-evidence <record> <source>`. Machine output carries the code, level, record `id` and `ref`, file path, field and next action ([10 Records and Identity](../../prd/10-records-and-identity.md#evidence-links-are-checked-and-flag-changed-sources); [10 Records and Identity](../../prd/10-records-and-identity.md#check-catalog))
- [ ] t32: Validate the Make Docs link fields on every type: `work_items` holds unique work item IDs as text, such as `W2 R0 P3`, and `docs` holds unique project-relative paths with forward slashes under `docs/`, optionally with a heading anchor. Make Blueprint stores them as text and never parses their meaning. A record is valid with both lists empty. Links go forward only: no Make Blueprint code path writes a Make Blueprint ID into a Make Docs file ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#make-docs-links); [10 Records and Identity](../../prd/10-records-and-identity.md#common-fields))
- [ ] t33: Build the temporary Make Docs link skip tracked by O-001. `project check` detects whether `make-docs` is installed and whether the project has a Make Docs block. Because the Make Docs read command has not shipped, it skips every Make Docs link on every record and reports `make-docs-skipped` once, as information, with the number of skipped links and the reason for the matching situation row. The skip never fails the check, works offline, changes no Make Docs file, and gives the same result through the CLI and MCP. Register `make-docs-link` in the catalog but report it only after the read command ships, as O-001 states ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#make-docs-link-check); [10 Records and Identity](../../prd/10-records-and-identity.md#check-catalog))

### Acceptance criteria

- A423: Parser tests accept `SRC-4hd8x7k2#p-012`, `SRC-4hd8x7k2#t-001`, `SRC-4hd8x7k2#t-001:r-0012`, `SRC-4hd8x7k2#t-001:c-003`, `SRC-4hd8x7k2#t-001:r-0012:c-003` and `SRC-4hd8x7k2`, and give `malformed` for `SRC-4hd8x7k2#p-012:r-0001` and `SRC-4hd8x7k2#r-0457:c-001`, which put a position after an anchor that is not a table, and for `SRC-4hd8x7k2#t-001:c-003:r-0012`, which puts the column before the row.
- A424: `run record link` given the source `ref` `SRC-007` stores `SRC-4hd8x7k2` in `evidence`, and the record's `evidence_versions` gains an entry with that source's `sha256`, `converter` and `converter_version`.
- A425: After a fixture source's `sha256` changes, `project check` reports `evidence-old-version` as a warning on each record that links to it. The message names the record by `ref` and title, the link, the source by `ref` and title, says "the source changed after this link was made" or the same meaning, and names `run record confirm-evidence`. After `run record confirm-evidence <record> <source>`, the warning is gone for that record, and the record file diff shows only the `evidence_versions` entry lines and `updated_at`.
- A426: A fixture source whose `converter` changes from `pdf` to `agent` while its `sha256` and `converter_version` stay the same flags the old links as `old-version`.
- A427: A hand-edited record with a link and no `evidence_versions` entry gets `evidence-unconfirmed`. A link `SRC-zzzzzzzz#p-001` to no source gets `evidence-unknown-source`. A link to a fixture source with `conversion_status: needs-manual` gets `evidence-not-converted`. A link with no anchor gets `evidence-no-anchor`.
- A428: A fixture capability listed as `created` in an extraction's `records` with no link to that extraction's source gets `evidence-required` as an error.
- A429: With `make-docs` absent from `PATH`, `project check` on a fixture with five `docs` and `work_items` values reports `make-docs-skipped` once, says that 5 links were not checked and why, and its outcome is not made `partial` or `failed` by those links. With a stub `make-docs` on `PATH`, the same check reports `make-docs-skipped` with 5 links and the reason that Make Docs has not shipped its read command. The CLI `--json` result and the `project_check` MCP result carry the same skip count.
- A430: A write of `docs: [/srv/docs/a.md]` or `docs: [docs\prd\a.md]` is refused with `bad-value`. A write of `docs: [docs/designs/2026-12-01-approval-limits.md]` succeeds. A test that runs every `run record` write on the fixture project confirms that no file under `docs/` changes.

### Dependencies

- Stage 3 of this phase for source and fit-gap records.
- [Phase 3](03-storage-and-identity.md): name lookup for source refs and the check engine.
- [Phase 5](05-intake-and-conversion.md) fills the `broken` and `unavailable` states and resolves anchors, which completes the evidence promise.
- The Make Docs read command from the repo-wide Step 0 Make Docs changes, which O-001 waits on. This phase does not wait for it.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: The agent runs `project check` on the fixture project with changed, unconfirmed and unknown-source links, and records for the evidence promise whether each finding names the record, the source, the state in plain words and the next command, and whether machine detail stays in `--json`. Reviewer: the implementing agent. Limits: no lived human feedback; the anchor half waits for Phase 5.
- Optional experience handoff: Run `make-blueprint project check` on the fixture project after changing one fixture source's hash. Notice that each flagged link names the record, the source and `run record confirm-evidence`. Feedback is welcome and not required.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A423 to A430.
- Phase / capability status: Phase status is set at closeout. Capability status stays partial for Make Docs link confirmation, which O-001 keeps owed.

## Stage 6 - Record Commands and Fixtures

### Tasks

- [ ] t34: Build `run record create --type <type>` with the MCP tool `record_create`. It takes the type's field values, creates the record as `draft` through the storage `create` operation, prints the new `ref` and title, and returns `id` and `ref` in machine output. It accepts `--dry-run`. It refuses the types that have their own create command and names that command: `run source add` for `source`, `run extract next` for `extraction`, `run compare create` for `comparison`, `run compare score` or `run compare target-only` for `fit-gap`, and `run place set` for `placement`. Phase 6 puts the duplicate-hint step in front of it ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-record); [13 Extraction and Review](../../prd/13-extraction-and-review.md#commands); [10 Records and Identity](../../prd/10-records-and-identity.md#statuses))
- [ ] t35: Build `run record show <record>` with the MCP tool `record_show`. It shows the record's fields, body, the records it links to and the records that link to it, and each evidence link with its link states next to it ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-record); [10 Records and Identity](../../prd/10-records-and-identity.md#evidence-links-are-checked-and-flag-changed-sources))
- [ ] t36: Build `run record list [--filter <expr>]` with the MCP tool `record_list`, wiring the Phase 3 filter syntax, `--sort`, `--limit` and `--fields`, the total count, the cut-short flag and the default limit of 50 ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-record); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#command-catalog))
- [ ] t37: Build `run record update <record>` with the MCP tool `record_update` for `draft` records: it changes fields or the body and never changes `id`, `ref`, `type` or `status`. On an `active` record it changes no field at once; until Phase 6 builds pending changes, it returns `blocked` and changes nothing ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#command-catalog); [10 Records and Identity](../../prd/10-records-and-identity.md#statuses))
- [ ] t38: Build `run record link <record> <field> <target>` and `run record unlink <record> <field> <target>` with the MCP tools `record_link` and `record_unlink`. They accept any name for the target, store the `id`, put a new list item at the end, and refuse a field that is not a relation field of the type ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-record); [10 Records and Identity](../../prd/10-records-and-identity.md#relation-rules))
- [ ] t39: Build `run record archive <record>` and `run record supersede <record> --by <record>` with the MCP tools `record_archive` and `record_supersede`, through the Phase 3 status rules: `--by` names an existing record of the same type, the `superseded_by` chain ends at a record that is not `superseded`, and a refused change names the statuses the record can move to ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-record); [10 Records and Identity](../../prd/10-records-and-identity.md#statuses))
- [ ] t40: Build `run record schema [<type>]` with the MCP tool `record_schema`. It shows each type's fields with need, values and relation targets, the project's facet lists, and the built-in and project codes of the three extendable lists ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-record))
- [ ] t41: Build the shared fixture project: one or more valid records of each of the twelve types, linked as PRD 11's examples link them, plus one hand-edited fault for each check code this phase registers, with a fixture `.make/personas.yaml` and `.make/blueprint/config.yaml`. Phases 05 to 07 load it ([11 Record Types Reference](../../prd/11-record-types-reference.md#relation-summary))

### Acceptance criteria

- A431: `make-blueprint run record create --type capability` with a title and a system `ref` writes one file at `blueprint/records/capability/<id>.md` with `status: draft`, prints the new `ref` and title, and `--json` carries both `id` and `ref`. With `--dry-run`, the same call writes no file and lists the same change.
- A432: `run record show CAP-118` on the fixture shows the capability's requirements as records that link to it, and shows each evidence link with its state, such as `old-version`, beside the link.
- A433: `run record list --filter 'type:requirement status:draft' --limit 2` returns two results, the total count and `truncated: true` in `--json`.
- A434: `run record update` on an `active` fixture record returns `blocked`, exit code 3, names the reason, and the record file is byte-identical afterward. On a `draft`, a change to `title` changes only the `title` and `updated_at` lines in the file diff.
- A435: `run record supersede REQ-042 --by CAP-118` is refused because the types differ. `run record archive` on a `rejected` record is refused and the output says that `rejected` is an end state.
- A436: `run record schema fit-gap` lists every fit-gap field from PRD 11 with its need and allowed values, and `run record schema capability` lists the built-in `capability_type` codes and the project's own codes.
- A437: `project check` on the fixture project reports each planted fault with its expected code, and reports nothing on the valid records.
- A438: For each command in this stage, a test calls the CLI with `--json` and the matching MCP tool with the same input and gets the same result object.
- A439: `run record create` with each of `--type source`, `--type extraction`, `--type comparison`, `--type fit-gap` and `--type placement` is refused and writes no file, and each refusal names that type's own create command. `run record create --type integration` still creates a `draft` integration.

### Dependencies

- Stages 1 to 5 of this phase.
- [Phase 3](03-storage-and-identity.md): the storage `create`, `modify`, `query` and `links` operations, name lookup, status rules and the filter syntax.
- [Phase 2](02-cli-and-packaging.md): the operation catalog, which gives each command exactly one MCP tool, and `--json`, `--dry-run` and `--target-root`.
- Used later by [Phase 6](06-extraction-and-review.md) for duplicate hints and pending changes, and by [Phase 8](08-mcp-skills-and-status.md), which places these tools in the MCP profiles.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: The agent runs `run record create`, `run record show` and `run record list` on the fixture project and records whether human output leads with the outcome and names records by `ref` and title before machine detail, and whether `run record show` puts each link state next to its link. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Run `make-blueprint run record show CAP-118` on the fixture project. Notice the evidence link states beside each link and the records that link to the capability. Feedback is welcome and not required.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A431 to A439.
- Phase / capability status: To be recorded at closeout. The phase can close when A401 to A439 pass. The capability stays partial for O-001.
