---
title: "Phase 8: MCP, Skills and Status"
kind: "work"
status: "active"
coordinate: "W1 R1 P8"
source:
  type: "prd"
  path: "docs/prd/16-workflow-and-skills.md"
---

# Phase 8: MCP, Skills and Status

## Purpose

This phase finishes the agent-facing surface. Every command from phases 3 to 7 becomes reachable through the right MCP profile, every stage gets its skill, and one status command orients people and agents. The agent tool is the main way people use Make Blueprint, so the skills and `project status` are the main path through the product.

It depends on the operation catalog, the MCP server shell, the `allowWrite` gate and skills install from [Phase 2](02-cli-and-packaging.md), and on the commands that [Phase 3](03-storage-and-identity.md) to [Phase 7](07-analysis-and-exports.md) build. Skills are written after the command list exists, so they never describe a command that is not built.

## Overview

The tool list work assigns every catalog operation its MCP profiles, tests that the CLI, the catalog and the MCP tool list match in both directions, and tests profile membership, tool titles, read-only hints and the `allowWrite` input.

The status work builds the `project status` read model, its seven sections with the project `name`, the ordered next-action rules, and the ready, needs attention, blocked and failed states in human and machine output. Status and `project check` read the same problem facts, so their counts agree.

The skill work ships nine skills inside the CLI: `blueprint-intake`, `blueprint-convert`, `blueprint-extract`, `blueprint-review`, `blueprint-model`, `blueprint-compare`, `blueprint-place`, `blueprint-hand-off` and `blueprint-report`. Each owns one job, holds no script, and reaches Make Blueprint only through CLI commands or MCP tools. A lint test fails the build on any script, executable bit, `#!` line or unknown command or tool. End-to-end evidence covers all nine skills on a synthetic sample project.

[Phase 9](09-v1-import-and-release.md) runs all seven stages and all nine skills on the release build in a clean container with no Python and no Node.

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `direct`. Promise: one status command shows project state and the next useful action, owned by [08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status) under the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md).
- Intended human outcome: a person tells ready, needs attention, blocked and failed apart from the first line of `project status`, finds the action that clears a needs-attention or blocked state on the "Next" line, and sees the project `name`, sources, extraction progress, drafts waiting for review, broken links and ref clashes without learning the index, locks, the journal or block hashes. An agent on any profile gets the same facts from `project_status`.
- Human-facing surface or indirect effect: `project status` output in the CLI and through the MCP tool `project_status`, with the project `name`; the bare `make-blueprint` command in a set-up project; and the report that each of the nine skills ends with, which passes on the next useful action from status.
- Implementation work: Stages 2 and 3 build the status read model, the next-action rules and the renderers. Stages 4 to 6 build the skills that end with status.
- Evidence source or testing type selected under current authority: Automated Implementation Testing of the read model (one fixture for each next-action rule, and status and check count agreement), and a Human Experience Review of success, partial and blocked output, as the plan overview selects. The Guided Progress Review of all nine skills also shows how each skill passes on the next action.
- Executor: the implementing coding agent runs the automated tests and performs the Human Experience Review on real output. The Guided Progress Review is run by a person the owner names, working with an agent; the agent records the observations.
- Accepted obligation or deferral route: none for this promise. [O-001](../../prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check) stays open for the Make Docs links that status counts and the hand-off skill reports as skipped.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | Catalog and tool list parity tests, profile membership tests, tool metadata tests, status fixtures for every next-action rule, status and check count agreement tests, skill lint tests and the automated skill walk-through. The acceptance criteria in each stage below are the decision record. |
| Performance Testing | active | This phase adds no performance candidate and no profile. It runs only the status read model workload of the index characterization profile that [Phase 3](03-storage-and-identity.md) creates, because that workload needs `project status`, which this phase builds. That baseline sets no status target. Stage 3 holds the run. |
| Guided Progress Review | active | A reviewer runs all nine skills end to end with an agent on a synthetic sample project, as [16 Workflow and Skills](../../prd/16-workflow-and-skills.md#skill-rules) plans. Stage 6 holds the review. |
| Unassisted Goal Testing | not-needed-now | No PRD needs it in v2.0. The Guided Progress Review and the Human Experience Review answer the current decisions. Revisit before v2.2, when the web app adds a new human path. |

- Base maintenance action: `none`
- Performance applicability: `characterize-now`, for the status read model workload of the Phase 3 index profile only
- Canonical `PERF-###` profile link or `none`: the index profile that [Phase 3](03-storage-and-identity.md) creates and owns. Link it here once it exists.
- Finite evidence budget and stop-rule reference or `not-applicable`: the remaining budget and the stop rules of that profile
- Execution packet link or `not-applicable`: the packet rendered in Stage 3 for this workload. To be recorded at closeout.
- Outcome and evidence handoff or `none`: the result record and the `A815` to `A818` section of `evidence.md`. To be recorded at closeout.
- Gate disposition and supported-scope limit or `not-applicable`: the gate rejects a missing, invalid or unrun status workload result. The supported scope is the scope that the profile states.

## Source PRD Docs

- [16 Workflow and Skills](../../prd/16-workflow-and-skills.md)
- [08 CLI and MCP](../../prd/08-cli-and-mcp.md) for the MCP tool list, the profiles and `project status`
- [07 Installation and Distribution](../../prd/07-installation-and-distribution.md) for skills install
- [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md), [13 Extraction and Review](../../prd/13-extraction-and-review.md), [14 Fit-Gap and Placement](../../prd/14-fit-gap-and-placement.md), [15 Exports](../../prd/15-exports.md) and [19 System Integrations](../../prd/19-system-integrations.md) for what each skill does to records

## Source Obligations, Scenarios, And Findings

- Obligation: [O-001 Confirm Make Docs Links in Project Check](../../prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check). The hand-off skill tells the person which Make Docs links it stored and how many `project check` skipped, so the person knows they are not yet confirmed.
- Risk: [R-010 Status and Check Disagree](../../prd/03-open-questions-and-risk-register.md#r-010-status-and-check-disagree). Stage 3 tests equal counts.
- Risk: [R-014 Duplicate MCP Tool Names Across Servers](../../prd/03-open-questions-and-risk-register.md#r-014-duplicate-mcp-tool-names-across-servers). Stage 1 tests every tool title.
- Risk: [R-013 `make-blueprint://` URIs in Make Docs Link Checks](../../prd/03-open-questions-and-risk-register.md#r-013-make-blueprint-uris-in-make-docs-link-checks). Skill lint keeps `make-blueprint://` URIs in inline code.
- Decisions carried in: [Q-041](../../prd/03-open-questions-and-risk-register.md#q-041-mcp-tool-list-for-each-profile), [Q-042](../../prd/03-open-questions-and-risk-register.md#q-042-stage-skill-names-and-content), [Q-080](../../prd/03-open-questions-and-risk-register.md#q-080-agent-conversion-for-complex-pdfs), [D-011](../../prd/03-open-questions-and-risk-register.md#d-011-project-display-name-from-the-v1-import), [Q-083](../../prd/03-open-questions-and-risk-register.md#q-083-changing-the-git-level-of-a-source) for the `source_set_level` tool, and [Q-084](../../prd/03-open-questions-and-risk-register.md#q-084-small-command-and-status-defaults-found-while-writing-the-work-backlog) for the missing-handoff fix and the `run place link` targets.
- Scenarios: None.
- Findings: None.

## Stage 1 - Tool List and Profiles

### Tasks

- [ ] t1: Set the profiles of every catalog operation from the 08 catalog tables: `core`, `setup`, `intake`, `extract` and `analyze`, with `all` as their union. Put `project_status`, `record_show` and `record_list` in every intent profile; `review_list`, `review_show`, `review_approve` and `review_reject` in both `extract` and `analyze`; `source_set_level`, `source_pages_next` and `source_pages_write` in `intake`; the three `export_` tools in `analyze`; `import_v1`, `record_ref_fix`, `project_reindex`, `project_recover` and `resource_ensure` in `setup`; and the one tool outside the catalog, `setup_plan`, in `setup`. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#mcp-server-and-profiles))
- [ ] t2: Write the catalog parity test. It checks in both directions that every catalog operation has exactly one CLI command and exactly one MCP tool, that every CLI command in the catalog and every MCP tool has a catalog operation, and that each tool name is the operation ID with each `.` and `-` replaced by `_`. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#command-catalog))
- [ ] t3: Write the profile membership tests. A stored expected tool list for each of the six profiles is compared with what `make-blueprint mcp --profile <name>` lists. The tests fail when a tool belongs to no intent profile, or when `all` holds a tool outside the union of the five intent profiles. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#mcp-server-and-profiles))
- [ ] t4: Extend the profile tests to the full v2.0 tool list. For each of the five intent profiles, start the server with that profile and check that every tool outside it is not listed and that a call to it returns an unknown-tool error. [Phase 2](02-cli-and-packaging.md) built the profile mechanism and the `--profile` value check; this task covers every real tool. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#mcp-server-and-profiles))
- [ ] t5: Run the tool metadata checks over every v2.0 tool, on top of the metadata and the `allowWrite` gate that [Phase 2](02-cli-and-packaging.md) built. Every tool title starts with "Make Blueprint"; read tools carry the MCP read-only hint and write tools do not; every write tool's input schema includes `allowWrite` and no read or `derived` tool's schema does; a tool in several profiles has one name, one input schema and one description; and a `failed` outcome sets the MCP error flag while `success`, `partial` and `blocked` do not. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#write-permission-allowwrite))
- [ ] t6: Write the surface parity test. For every catalog operation, it runs the CLI command with `--json` and the MCP tool with the same input on one fixture and checks that both return the same result object, apart from fields the result schema marks as specific to one surface. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#human-and-machine-output))

### Acceptance criteria

- A801: The catalog parity test passes and lists zero catalog operations without a CLI command or MCP tool, and zero CLI commands or MCP tools without a catalog operation. `compare.target-only` maps to `compare_target_only` and `record.ref-fix` maps to `record_ref_fix`.
- A802: The profile membership tests pass for all six profiles. `make-blueprint mcp --profile analyze` lists `review_approve`, `review_reject`, `export_fit_gap`, `project_status`, `record_show` and `record_list`, and does not list `source_add` or `import_v1`. `make-blueprint mcp --profile intake` lists `source_set_level`.
- A803: Removing one tool from every intent profile in a test build makes the membership test fail and name that tool.
- A804: On a server started with each intent profile, every tool outside that profile is absent from the tool list, and a call to `source_add` on a server started with `--profile analyze` returns an unknown-tool error.
- A805: The tool metadata tests pass: every tool title starts with "Make Blueprint", every write tool has `allowWrite` in its input schema, no read or `derived` tool has it, and only read tools carry the read-only hint.
- A806: The surface parity test passes for every catalog operation on the fixture.

### Dependencies

- [Phase 2](02-cli-and-packaging.md): the operation catalog, the MCP server shell, the profile mechanism and `--profile` check, tool metadata, the `allowWrite` gate, the result envelope and `setup_plan`.
- [Phase 3](03-storage-and-identity.md) to [Phase 7](07-analysis-and-exports.md): the catalog operations that these tests cover.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed-now`; Guided Progress Review not used in this stage; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent lists the tools that one agent tool shows with both the Make Docs and the Make Blueprint servers configured, and records whether the two `project_status` tools can be told apart by title. To be recorded at closeout.
- Optional experience handoff: not applicable. This stage changes no output a person reads directly.
- Explicit human acceptance gate: none.
- Evidence report: the `A801` to `A806` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 2 - Project Status Read Model

### Tasks

- [ ] t7: Build the `project.status` result `data` with one object for each section, in order: `project`, `sources`, `extraction`, `review`, `comparisons`, `needsAttention` and `nextActions`. Each count carries the filter or command that lists the counted records, so an agent can go from a number to its records in one call. Counts come from the index. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#status-result))
- [ ] t8: Fill the Project section: the optional project `name` from `.make/config.yaml`, the project root, the setup (A in v2.0), the CLI version, whether record files are at the current format, whether Make Docs is installed, and whether its block carries the handoff line. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status))
- [ ] t9: Fill the Sources, Extraction and Review sections: source totals with counts for each conversion status and git level, originals that their git level keeps out of git and that are missing on this machine (shown as information, not as a problem), and sources whose original changed after conversion; sources not started, in progress and done, with parts covered out of the total for each extraction in progress; drafts waiting by type and by extraction or comparison, pending changes waiting, sources in `awaiting-review`, and drafts waiting for a second reviewer when that setting is on. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status))
- [ ] t10: Fill the Comparisons section, shown only when the project has one or more comparisons: for each comparison, baseline capabilities scored out of the total, target-only candidates, fit-gap counts by verdict, placements made and placements linked to Make Docs, all from the same reads as the coverage read. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status))
- [ ] t11: Fill the Needs attention section from the same problem facts that `project check` reads: ref clashes, broken links, stale evidence links by source, missing originals that git tracks, record files that fail checks, failed conversions, broken Make Docs links, records in an older format, and a missing handoff line in the Make Docs block, with the fix from [Phase 1](01-shared-core-adoption.md): update Make Docs with its own update command, then run `make-blueprint setup` again. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status))
- [ ] t12: Build the next-action rules: the 20 rules of the order table, from "not a set-up project" to `make-blueprint run export all`. Status picks the first rule that applies and puts it in `nextAction`. `nextActions` lists every applicable action in the same order, with the first one equal to `nextAction`. Each action carries a plain sentence that says what to do and why, the exact CLI command with its arguments filled in, and the matching MCP tool name and arguments. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status))
- [ ] t13: Map status to its states. Ready is `success` (exit 0), needs attention is `partial` (exit 1), blocked is `blocked` (exit 3), and a status that cannot run is `failed` (exit 2) and says what failed and how to retry. Human output starts with "Make Blueprint status:" and one of "ready", "needs attention", "blocked" or "failed". ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status))
- [ ] t14: Build the human renderer for status in the shape of the three 08 examples: the state line, the project line, one line for each section, the "Needs attention" list with each problem and its count, and a "Next:" line with the command, then a "Then:" line when a second action applies. It names records by `ref` and title and never asks a person to manage the index, locks, the journal or block hashes. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status))
- [ ] t15: Keep status read-only and portable. It changes no project file and no Store state, apart from bringing the derived index up to date. It works offline, without Make Docs and without a server. `project_status` sits in every MCP profile and returns the same result as `project status --json`. In a set-up project, bare `make-blueprint` with no command prints the same output as `make-blueprint project status`. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status))

### Acceptance criteria

- A807: `make-blueprint project status --json` on the sample project prints one JSON document whose `data` holds the seven sections in order, and each count in it carries a filter or command that, when run, lists exactly that many records.
- A808: With `name: sample-project` in `.make/config.yaml`, the human output's Project line starts with `sample-project`, and the JSON `data.project.name` is `sample-project`. With no `name`, the Project line shows the project root and no empty name.
- A809: On a project with a source at the git level `converted` whose original is absent, status lists it as missing information, its outcome stays `success`, and the Needs attention section does not list it.
- A810: On a project with no comparison, status has no Comparisons section. After `run compare create`, the section shows the comparison's `ref` with scored and total baseline capabilities that equal the coverage read's counts.
- A811: Every `nextActions` entry carries a sentence, a reason, a CLI command with filled-in arguments and an MCP tool name with arguments, and the first entry equals `nextAction`.
- A812: Human output for a ready, a needs-attention, a blocked and a failed fixture starts with "Make Blueprint status: ready", "Make Blueprint status: needs attention", "Make Blueprint status: blocked" and "Make Blueprint status: failed", and the exit codes are 0, 1, 3 and 2.
- A813: A test hashes every project file and the machine Store before and after `project status` and finds no change apart from the derived index. Status run with the network disabled, with no `make-docs` on the path and with no server running returns the same result.
- A814: `project_status` called through each of the six profiles returns the same object as `project status --json` on the same fixture. In a set-up project, `make-blueprint` with no command prints the same output as `make-blueprint project status`.
- A831: On a fixture with a Make Docs block that has no handoff line, `project status` lists the missing handoff line under Needs attention and tells the person to run the Make Docs update command that Phase 1 confirmed, then `make-blueprint setup` again.

### Dependencies

- Stage 1 of this phase.
- [Phase 1](01-shared-core-adoption.md): reading the project `name` and the handoff line state through the core, and the missing-handoff fact with the confirmed Make Docs update command.
- [Phase 3](03-storage-and-identity.md): the index and the freshness check that status reads.
- [Phase 4](04-record-types.md) and [Phase 5](05-intake-and-conversion.md): the problem facts of `project check` and the source states.
- [Phase 6](06-extraction-and-review.md) and [Phase 7](07-analysis-and-exports.md): extraction, review and coverage read counts.
- [Phase 2](02-cli-and-packaging.md): the bare `make-blueprint` command in a folder that is not set up, which this stage extends to print status in a set-up project.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed-now`; Guided Progress Review not used in this stage; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none in this stage. Stage 3 runs the status read model workload of the index profile that [Phase 3](03-storage-and-identity.md) owns.
- Human Experience Review: held in Stage 3 on the finished output.
- Optional experience handoff: held in Stage 3.
- Explicit human acceptance gate: none.
- Evidence report: the `A807` to `A814` and `A831` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 3 - Status Fixtures and Review

### Tasks

- [ ] t16: Build one fixture project for each of the 20 next-action rules, each set up so that its rule is the first that applies. The test checks the chosen action's command and MCP tool, and checks that `nextActions` lists the other applicable actions in table order. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status))
- [ ] t17: Write the status and check agreement test. On fixtures with a ref clash, broken links and stale evidence links, it checks that `project status` reports the same counts that `project check` reports on the same files. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status))
- [ ] t18: Perform the Human Experience Review of real status output. The agent runs the installed CLI on the ready, needs-attention, blocked and failed fixtures, reads the human and JSON output side by side, and records for each state whether the first line tells the state apart, whether the "Next" line names the clearing action, whether records appear by `ref` and title, and whether human and machine output carry the same meaning. ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status))
- [ ] t19: Run the status read model workload of the index characterization profile that [Phase 3](03-storage-and-identity.md) created, now that `project status` exists. Render a finite execution packet from that profile for this workload only, on the synthetic project from the Phase 3 generator, and run it inside the profile's remaining budget. Write the result record with the observed distribution, uncertainty, evidence fingerprint, budget ledger and one outcome, link the packet and result from the Stage 3 closeout, and state no target. Then run `make-docs run performance evidence validate --target-root kits/make-blueprint` from the repository root ([09 Storage and Indexing](../../prd/09-storage-and-indexing.md#index-rebuild-and-query-characterization); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status)).

### Acceptance criteria

- A815: The 20 rule fixtures pass: each returns its rule's action as `nextAction`, with the exact command, such as `make-blueprint run record ref-fix REQ-088` on the ref clash fixture and `make-blueprint run compare next CMP-001` on the unscored comparison fixture.
- A816: The agreement test passes: on each fixture, the ref clash, broken link and stale evidence link counts in `project status` equal those in `project check`.
- A817: The Human Experience Review record in `evidence.md` holds, for each of the ready, needs-attention, blocked and failed states, the observed first line, the "Next" line, a human and JSON comparison, a conclusion of `satisfied`, `material gap` or `insufficient evidence`, the limits and the next action.
- A818: The result record for the status read model workload binds the Phase 3 index profile ID, version and digest, the build, the evidence fingerprint and the budget ledger, records exactly one outcome from `pass`, `fail`, `revise`, `blocked` and `waived`, shows budget use inside the profile's remaining budget, and names the Phase 3 result record that marked this workload as not yet run. The performance evidence validator exits zero with `status: passed`.

### Dependencies

- Stage 2 of this phase.
- [Phase 3](03-storage-and-identity.md): the index profile, its synthetic project generator, its remaining budget and the result record that marks the status workload as not yet run.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing active for the status read model workload of the Phase 3 index profile; Guided Progress Review not used in this stage; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: base action `none`; applicability `characterize-now` for the status workload only; the profile link, packet, result, fingerprint, budget used and remaining, and outcome to be recorded at closeout. No target, finding, waiver or expiry is planned.
- Human Experience Review: the review in t18 covers the status promise. It records the observations, conclusion, reviewer and limits, such as agent tools that did not show the output. To be recorded at closeout.
- Optional experience handoff: run `make-blueprint project status` on the sample project before and after you create a ref clash, and notice whether the first line and the "Next" line tell you what to do. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A815` to `A818` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 4 - Skill Packaging and Lint

### Tasks

- [ ] t20: Build the skill source tree inside the CLI package. Each of the nine skills is one folder named `blueprint-<name>` that holds `SKILL.md` with `name` and `description` front matter, optional `references/*.md` and optional `agents/*.yaml` or `agents/*.json`. The `name` matches the folder name, the `description` says when to use the skill in words a person would use, and each skill carries the CLI's version. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#skill-folder))
- [ ] t21: Write the skill structure lint. It fails on any file other than `SKILL.md`, Markdown references and YAML or JSON agent-tool metadata, on any file with an executable bit, on any file that starts with a `#!` line, on a `name` that does not match its folder, and on a skill folder whose name does not start with `blueprint-` or matches a Make Docs skill folder name. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#skill-rules))
- [ ] t22: Write the skill content lint. It checks that each `SKILL.md` has the six parts Job, When to use, Inputs, Steps, Done when and Report, in that order; that every command and MCP tool it names is in the operation catalog; that each step names both its CLI command and its MCP tool; that it names its MCP profiles and says what to tell the person when a tool is not in the configured profile or `allowWrite` is off; that it uses no pipe or here-document; that `make-blueprint://` URIs appear only in inline code; and that the Report part ends by running `project status`. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#skill-content))
- [ ] t23: Extend the content lint with the guidance rules: no step tells the agent to write or edit record files, converted text or config by hand, to create side files such as scratch notes or decision files, to write under `docs/`, to create, change or close Make Docs work items, or to stage or commit in git unless the person asks. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#skill-rules))
- [ ] t24: Make the skill lint part of the build, so a failing skill fails it. Write a package test that checks the npm package and each signed single file carry exactly the nine skills at the CLI's version, and that `setup` installs exactly the nine for Claude Code, Codex and GitHub Copilot CLI from inside the package with no network request, and refreshes them when it runs again. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#skill-rules))

### Acceptance criteria

- A819: The package skill tree holds exactly the nine folders `blueprint-intake`, `blueprint-convert`, `blueprint-extract`, `blueprint-review`, `blueprint-model`, `blueprint-compare`, `blueprint-place`, `blueprint-hand-off` and `blueprint-report`, each with a `SKILL.md` whose `name` equals its folder name.
- A820: A test skill folder with a `.sh` file, a file with an executable bit, a Markdown file that starts with `#!`, or a step that names `run source import` (a command the CLI does not have) fails the lint and the build, and the lint names the file and the rule.
- A821: The content lint fails a test skill whose step uses a pipe, names a CLI command without its MCP tool, links a `make-blueprint://` URI as a Markdown link target, or tells the agent to edit a record file by hand.
- A822: The package test passes: the npm package and each single file carry nine skills at the CLI's version, and `setup` with the network disabled installs the nine skills for each of the three agent tools.

### Dependencies

- Stage 1 of this phase, for the catalog that the lint reads.
- [Phase 2](02-cli-and-packaging.md): the skills install in `setup`, the shared skill folder with links or managed copies, and the single-file build.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed-now`; Guided Progress Review in Stage 6; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads the lint output for a failing skill and records whether a maintainer can find the file, the rule and the fix. To be recorded at closeout.
- Optional experience handoff: not applicable. The lint is maintainer tooling with no end-user output.
- Explicit human acceptance gate: none.
- Evidence report: the `A819` to `A822` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 5 - The Nine Skills

### Tasks

- [ ] t25: Review the inventory of the 19 BuildOS v1 skills in 16 and record, for each one, the Make Blueprint skill, command or later release that holds its job. Copy no v1 skill text or script. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#rebuild-notes))
- [ ] t26: Write `blueprint-intake`. It takes the files a person names to source records with converted, anchored text through `run source add` (`source_add`), `run source convert` (`source_convert`, including supplied text on standard input), `run source list` (`source_list`), `run source show` (`source_show`), `project check` and `project status`, on the `intake` and `core` profiles. It hands a PDF with a trouble signal, or one the person names for the agent route, to `blueprint-convert`. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#intake-skill))
- [ ] t27: Write `blueprint-convert`. It takes one PDF through the agent route with `run source convert <source> --agent [--reason <text>]` (`source_convert` with `agent: true`), `run source pages-next <source> [--file]` (`source_pages_next`), `run source pages-write <source> --pages <range>` (`source_pages_write`), `run source show` and `project status`, one page batch at a time. It starts the route with no trouble signal only on the person's word and passes on the person's reason. It keeps meaning, links and footnotes, writes one CSV file per nested table level joined by a key column, writes no anchors or front matter, passes on every flag and "unchecked" page, and hands the source to `blueprint-review` once it is `awaiting-review`. It never approves its own conversion. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#convert-skill))
- [ ] t28: Write `blueprint-extract`. It works one source at a time with `run extract next` (`extract_next`), `run extract show`, `run source read`, `run extract add`, `run extract link`, `run extract part`, `run extract finish` and `project status`, on the `extract` and `core` profiles. It weighs duplicate hints before each new record, records open questions as `question` findings, and records each current flow between systems as one `integration` draft with state `current` for each direction. It resumes its own open extraction when called again under the same name. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#extract-skill))
- [ ] t29: Write `blueprint-review`. It shows each draft, pending change and agent conversion in scope beside its source text with `run review list`, `run review show`, `run source show` and `project status`, takes flagged records first, shows the old value beside the new one for a pending change, shows the rubric for a fit-gap draft, and calls `run review approve` or `run review reject` only on a person's decision or a decision the person delegated. A rejection always carries the person's reason. It runs on the `extract`, `analyze` and `core` profiles. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#review-skill))
- [ ] t30: Write `blueprint-model`. It makes the systems in scope ready to compare with `run model tree`, `run model merge`, `run model move`, `run model set-domain`, `run record show`, `run record list`, `project check` and `project status`, on the `analyze` and `core` profiles, until every active capability in scope has one system, a domain and a status from its system's list. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#model-skill))
- [ ] t31: Write `blueprint-compare`. It follows the fit-gap method in the order 16 gives, with `run compare create`, `run compare next`, `run compare score`, `run compare target-only`, `run compare show`, `run record create` for planned integration drafts, `project check` and `project status`: it marks every baseline requirement with evidence, takes the verdict from the verdict table, treats candidates as hints only, and runs the target-only pass last. It writes no export files and hands over to `blueprint-report` when the person asks for files. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#compare-skill))
- [ ] t32: Write `blueprint-place`. It creates one placement for each fit-gap record in scope with `run place next`, `run place set`, `run compare show`, `run record create` for planned integration drafts, `run record link` for the `integrations` field, `project check` and `project status`, and links one or more integration records on every `integrate` placement. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#place-skill))
- [ ] t33: Write `blueprint-hand-off`. It stores Make Docs work item IDs and doc paths with `run place link`, which takes a placement or an integration record and writes the links at once, also on an `active` record, on the placements in scope and on the integration records those placements list, using `run compare show`, `project check` and `project status`. It sends the agent to Make Docs to create the work items, reports the links it stored and how many `project check` skipped, and says that Make Docs owns the backlog when Make Docs is absent. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#hand-off-skill))
- [ ] t34: Write `blueprint-report`. Its checklist follows the export layout in 15 part by part and names the record that holds each part's prose: the system body for the About part, each domain body for its part, capability and requirement bodies for the sections, and finding records for principles, contradictions and reading notes. It drafts missing prose into records with `run record create` for finding drafts and `run record update` or a pending change, then writes the files with `run export system`, `run export fit-gap` or `run export all`, and passes on every export warning. It never writes text into an export file. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#report-skill))

### Acceptance criteria

- A823: The v1 inventory review record in `evidence.md` lists all 19 v1 skills, each with its Make Blueprint home, and a text comparison finds no v1 skill text in the nine skills.
- A824: Each of the nine `SKILL.md` files passes the structure and content lint, names the MCP profiles from the 16 skill table, and ends its Report part with `project status`.
- A825: `blueprint-convert`'s steps name `--reason` for a PDF with no trouble signal, name `run source pages-next` with `--file` for an agent tool that cannot read a page range, and name `blueprint-review` as the hand-over once the source is `awaiting-review`.
- A826: `blueprint-compare` names no `run export` command, and its steps put marking every requirement before taking the verdict. `blueprint-report` names all three `run export` commands and no step that writes into `blueprint/exports/`.
- A827: `blueprint-hand-off` names no Make Docs write command and no path under `docs/`, names `run place link` for both placements and integration records, and its Report part names the `make-docs-skipped` count.

### Dependencies

- Stage 4 of this phase.
- [Phase 5](05-intake-and-conversion.md): the source commands and the agent route.
- [Phase 6](06-extraction-and-review.md): the extract and review commands and pending changes.
- [Phase 7](07-analysis-and-exports.md): the model, compare, place and export commands, the coverage read and the rubric.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed-now`; Guided Progress Review in Stage 6; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads each `SKILL.md` as an agent would and records whether its job, its neighbour skill and its done state are clear, and whether it names records by `ref` and title in what it tells a person. To be recorded at closeout.
- Optional experience handoff: held in Stage 6.
- Explicit human acceptance gate: none.
- Evidence report: the `A823` to `A827` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout.

## Stage 6 - End-to-End Skill Evidence

### Tasks

- [ ] t35: Build the synthetic skill sample project. It holds original files of the built-in types, one complex PDF with a table and a page with no text layer, sources that describe one target and two baseline systems with current integrations between them, and no client data, client names or client files. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#skill-rules))
- [ ] t36: Write the automated skill walk-through. For each of the nine skills, in stage order, it runs the CLI commands that the skill's steps name on the sample project, and then the same steps through the MCP tools on a server started only with the profiles the skill names. It checks the skill's "Done when" state and the next action that `project status` names at the end of each skill. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#commands-and-profiles-by-skill))
- [ ] t37: Run the Guided Progress Review. A reviewer the owner names runs all nine skills end to end with an agent on the sample project: once with an agent tool that reaches Make Blueprint through MCP, and once with an agent tool that uses the shell. The record names the agent tools, and for each skill whether it reached its done state, where the agent left the skill's path, what the agent told the person, and the next action it passed on. ([16 Workflow and Skills](../../prd/16-workflow-and-skills.md#skill-rules))

### Acceptance criteria

- A828: A scan of the sample project finds no client data, client name or client file.
- A829: The automated walk-through passes for all nine skills through the CLI and through MCP with each skill's named profiles only, and each skill's last step returns a `project status` next action that the test records.
- A830: The Guided Progress Review record in `evidence.md` covers all nine skills on both the MCP path and the shell path, and for each skill records the done state reached or not reached, any step where the agent left the skill's path, and the next action it passed on.

### Dependencies

- Stage 5 of this phase.
- [Phase 9](09-v1-import-and-release.md) runs all nine skills again on the release build in the clean container.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed-now`; Guided Progress Review active and held in t37; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reviews the Guided Progress Review record and the walk-through results against the status promise and the skill rules, and records an observation, a conclusion, the limits, such as agent tools not covered, and the next action. To be recorded at closeout.
- Optional experience handoff: in your agent tool, ask it to "convert these files" for the sample project's folder, then to "review the drafts", and notice whether each skill ends by telling you the next useful action. Feedback is welcome and optional.
- Explicit human acceptance gate: none. The Guided Progress Review is a selected testing activity, not a human acceptance gate.
- Evidence report: the `A828` to `A830` section of `evidence.md` in this backlog folder, including the Guided Progress Review record. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. The phase closes when an agent can run every stage through the skills and MCP, and the status review is recorded.
