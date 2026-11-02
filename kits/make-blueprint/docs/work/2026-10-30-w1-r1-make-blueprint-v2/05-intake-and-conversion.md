---
title: "Phase 5: Intake and Conversion"
kind: "work"
status: "active"
coordinate: "W1 R1 P5"
source:
  type: "prd"
  path: "docs/prd/12-source-intake-and-conversion.md"
---

# Phase 5: Intake and Conversion

## Purpose

This phase lets people bring original files into a project and turn them into converted text with stable anchors, inside the CLI and with no outside program. It builds on the source record type, the evidence link states and the fixture project from [Phase 4](04-record-types.md), and on the storage interface, write journal, write lock, index and machine folder `~/.make/blueprint/` from [Phase 3](03-storage-and-identity.md).

## Overview

The phase builds `run source add` with streaming hashes, the source git levels `all`, `converted` and `none` with `run source add --git-level` and `run source set-level`, the managed `blueprint/sources/.gitignore` and its pattern rule for hand-copied files, Git LFS rules in the managed `blueprint/sources/.gitattributes`, the seven built-in converters, the anchor writer, one table CSV file for each extracted table through one CSV writer that exports share, supplied text, evidence link resolution, change detection, and the source checks in `project check`, including `source-unregistered`. It also builds the guided agent route for complex PDFs: page batches, the CLI checks against the PDF text layer, and the `agent-in-progress` and `awaiting-review` states. It ends with a Guided Progress Review of built-in pdf and pptx conversion quality.

The phase map comes from [07 Work Backlog Scope](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/07-work-backlog-scope.md) in the `W1 R1` plan. The PRDs below are the authority.

Several details are left to this phase by the PRDs and the register: the default of `conversion.table_csv_min_rows`, the row counting rules, the exact pdf trouble signals, the agent route batch size, and where the CLI keeps page progress. Stage 3 settles them with the owner and records them in the PRDs before the converters and the agent route are built. Review of agent conversions comes in [Phase 6](06-extraction-and-review.md). The `blueprint-convert` skill and the `project status` output come in [Phase 8](08-mcp-skills-and-status.md).

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `direct`. Promise: "Evidence links reach the exact place in a source and flag changed sources", owned for the anchor half by [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#reading-sources-and-following-evidence-links), with the link-validation half in [10 Records and Identity](../../prd/10-records-and-identity.md#evidence-links-are-checked-and-flag-changed-sources), under the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md). [Phase 4](04-record-types.md) built the link-validation half.
- Intended human outcome: A person follows any evidence link with `run source show` to the exact heading, paragraph, row, table, column or cell, sees `path:line` to open in an editor, and sees in plain words when the source changed after the link was made. A source whose files are kept out of git shows as missing on a machine that does not hold them, not as broken.
- Human-facing surface or indirect effect: Markdown anchors and table CSV files under `blueprint/sources/`, `run source show`, `run source read` and `run source list` output, the source findings in `project check`, and the managed `blueprint/sources/.gitignore`.
- Implementation work: Stages 4 and 6 build anchors, table positions and link resolution. Stage 7 builds change detection. Stage 2 builds the git levels and the missing state.
- Evidence source or testing type selected under current authority: Automated Implementation Testing for anchor and table position resolution on converted fixtures of each type, changed-hash detection, and the missing state for files kept out of git. Guided Progress Review of built-in pdf and pptx conversion quality, as PRD 12 plans. Human Experience Review of `run source show` output by the agent.
- Executor: The implementing coding agent runs the tests and records the Human Experience Review. A human reviewer named when Stage 9 starts runs the Guided Progress Review with the agent.
- Accepted obligation or deferral route: None.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | See the decision record below. |
| Performance Testing | `not-needed-now` | Conversion and hashing speed cannot change a current decision, and the `W1 R1` plan names no performance candidate for this phase. Hashing large originals is a correctness rule here, tested with a memory limit, not a timing target. |
| Guided Progress Review | active | PRD 12 plans it for this phase. See the decision record below. |
| Unassisted Goal Testing | `not-needed-now` | No PRD asks for it, and no current human-experience question needs an unassisted attempt. |

Decision records:

| Field | Automated Implementation Testing | Guided Progress Review |
| --- | --- | --- |
| Decision informed | Whether intake, conversion, anchors, the git levels and the agent route are ready for Phase 6 extraction | Which losses of the built-in pdf and pptx converters are current limits to record in PRD 12, and which need the agent route or supplied text |
| Reason now | PRD 10 and PRD 12 name these tests as the evidence for the promise, and register R-024 closes only when the hand-copy test passes | PRD 12 Built-In Conversion plans the review in this phase, and register R-016 is open |
| Product maturity | v2.0 prerelease | v2.0 prerelease |
| Scope | Every command and check in this phase, on converter fixtures of each file type and on git fixture repositories | The synthetic pdf and pptx sample set from t39, converted by the built-in converters |
| Executor | The implementing coding agent | A human reviewer named when Stage 9 starts, working with the implementing agent |
| Gate effect | Blocks phase close while any test in scope fails | Advisory. Each confirmed loss becomes a recorded limit in PRD 12. It does not block phase close. |
| Effort budget | One test suite in the repository's test runner, run on every change | One review session over the sample set, and one rerun only after a converter fix |
| Stop condition | Every acceptance criterion below has a passing test | Every sample is compared with its original and each loss is recorded or dismissed with a reason |
| Evidence retained | Test names and results in the backlog's central `evidence.md` report | The loss list, sample names, reviewer and limits in the central `evidence.md` report |
| Rerun trigger | Any change to a converter, the anchor writer, the CSV writer, the git rules or the agent route | A new pdf or pptx converter version |

Performance candidate lifecycle fields:

- Base maintenance action: `none`
- Performance applicability: `not-needed`
- Canonical `PERF-###` profile link or `none`: none
- Finite evidence budget and stop-rule reference or `not-applicable`: `not-applicable`
- Execution packet link or `not-applicable`: `not-applicable`
- Outcome and evidence handoff or `none`: none
- Gate disposition and supported-scope limit or `not-applicable`: `not-applicable`

Human Experience Review is separate agent review work, not a testing type. The agent inspects real `run source show`, `run source list` and `project check` output on converted fixtures and records observations, conclusions, limits and next actions.

## Source PRD Docs

- [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md)
- [10 Records and Identity](../../prd/10-records-and-identity.md): the source check codes and the `broken` and `unavailable` link states
- [11 Record Types Reference](../../prd/11-record-types-reference.md): the source record fields
- [06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md): the `sources.*` and `conversion.*` settings
- [08 CLI and MCP](../../prd/08-cli-and-mcp.md): the `run source` command and MCP tool names
- [15 Exports](../../prd/15-exports.md): the CSV rules that table CSV files share

## Source Obligations, Scenarios, And Findings

- Obligations: None. This phase does not touch Make Docs link checks.
- Risks this phase addresses: [R-016 Conversion Quality and Moving Anchors](../../prd/03-open-questions-and-risk-register.md#r-016-conversion-quality-and-moving-anchors), [R-017 Git LFS Limits and Repository Size](../../prd/03-open-questions-and-risk-register.md#r-017-git-lfs-limits-and-repository-size) (shared with Phase 9) and [R-024 Hand-Copied Files Reach Git Before Registration](../../prd/03-open-questions-and-risk-register.md#r-024-hand-copied-files-reach-git-before-registration).
- Register decisions this phase builds: [Q-026](../../prd/03-open-questions-and-risk-register.md#q-026-anchor-marker-syntax), [Q-027](../../prd/03-open-questions-and-risk-register.md#q-027-anchor-numbering-and-converted-text-shape), [Q-028](../../prd/03-open-questions-and-risk-register.md#q-028-local-sources), [Q-029](../../prd/03-open-questions-and-risk-register.md#q-029-git-lfs-setting-and-size-threshold), [Q-030](../../prd/03-open-questions-and-risk-register.md#q-030-source-records-skip-review), [Q-038](../../prd/03-open-questions-and-risk-register.md#q-038-csv-encoding-rules), [Q-061](../../prd/03-open-questions-and-risk-register.md#q-061-converted-csv-files-and-table-links), [Q-080 Agent Conversion for Complex PDFs](../../prd/03-open-questions-and-risk-register.md#q-080-agent-conversion-for-complex-pdfs) (its open details are settled in Stage 3), [Q-082 Files in the Sources Folder That No Source Record Names](../../prd/03-open-questions-and-risk-register.md#q-082-files-in-the-sources-folder-that-no-source-record-names), [Q-083 Changing the Git Level of a Source](../../prd/03-open-questions-and-risk-register.md#q-083-changing-the-git-level-of-a-source) and the `source-unregistered` note of [Q-084](../../prd/03-open-questions-and-risk-register.md#q-084-small-command-and-status-defaults-found-while-writing-the-work-backlog).
- Unassisted Goal Testing scenarios: None.
- Findings: None.

## Stage 1 - Source Intake and Hashing

### Tasks

- [ ] t1: Build the source hasher: SHA-256 over the exact bytes of an original, written as 64 lowercase hexadecimal characters, read by streaming so a source folder of 226 megabytes never sits in memory at once. Only `run source add` and `run source convert` set `sha256`, and the main converted file keeps the same value in `source_sha256` ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#hashing))
- [ ] t2: Build `run source add <path>...` with the MCP tool `source_add`. It takes files and folders, and for a folder registers every file inside that is not already a source. A file under `blueprint/sources/` is registered where it is. A file outside is copied in with its file name and is never moved or deleted, and a name clash stops that file and names the clash. Each new source record is `active` from the start, with its title from the file name, its `sha256`, and `extraction_status: not-started`. Store paths project-relative with forward slashes, and compare file names in a way that works on case-insensitive file systems ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#source-intake))
- [ ] t3: Make `run source add` skip router files (`AGENTS.md`, `CLAUDE.md`), git rule files, converted Markdown files, recognized by their front matter, and table CSV files, recognized by the converted Markdown file that links to them. A second run on an original with the same bytes changes nothing and reports the existing source by `ref`. A file whose hash matches a source at another path creates no record and reports the existing source and the matching path ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#source-intake))
- [ ] t4: Make a call that registers many files one journaled change, and report for each file the source `ref`, title and conversion status, then a count by conversion status and the next useful action. A call that registers some files and not others returns `partial` with each missed file named ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#source-intake); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#outcomes-and-exit-codes))
- [ ] t5: Build `run source list [--filter <expr>]` with the MCP tool `source_list`, showing each source's git level, availability, conversion status and extraction status, and `run source show <source>` with the MCP tool `source_show` for one source's detail ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#commands); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-source))

### Acceptance criteria

- A501: `make-blueprint run source add blueprint/sources/workshops` on a folder of three files writes three source records with `status: active` and `extraction_status: not-started`, each `sha256` equal to `shasum -a 256` of its file, and each title equal to its file name. The output names each source by `ref` and title with its conversion status, then a count by conversion status and the next action.
- A502: `run source add` given a file outside the project copies it into `blueprint/sources/` with the same name, and the outside file keeps its bytes and modification time. When the name clashes with an existing file, that file is not copied, the output names the clash, the other files register, and the outcome is `partial` with exit code 1.
- A503: A second `run source add` on the same folder leaves `git status --porcelain` empty and reports each existing source by `ref`. A byte-identical copy at another path creates no record and the output names the existing source and the matching path.
- A504: `run source add blueprint/sources` never registers `AGENTS.md`, `CLAUDE.md`, `.gitignore`, `.gitattributes`, a converted `.md` file or a table CSV file. A person's own Markdown file without converted-text front matter is registered.
- A505: A crash test stops `run source add` part way through a 10-file call. The next command finishes or undoes the change, and afterward no source record lacks its original and no original is half registered.
- A506: The hasher returns the `shasum -a 256` value for a synthetic 300-megabyte file while the process runs with a heap limit smaller than the file.
- A507: `run source list --filter 'conversion_status:needs-manual'` lists only sources in that state, each with its git level, availability, conversion status and extraction status, and the CLI `--json` result equals the `source_list` MCP result.

### Dependencies

- [Phase 4](04-record-types.md): the source record type and the fixture project.
- [Phase 3](03-storage-and-identity.md): the storage `create` and `apply` operations, the write journal and the filter syntax.
- [Phase 2](02-cli-and-packaging.md): `setup`, which creates `blueprint/sources/` with its router files, and the operation catalog.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Guided Progress Review active in Stage 9 only; Performance Testing and Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: The agent runs `run source add` on a folder with one clashing file and records whether the output leads with what was registered, names the clash in terms of the person's files and names the next action. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Run `make-blueprint run source add <folder>` on a small folder. Notice the count by conversion status and the next action at the end. Feedback is welcome and not required.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the backlog's central `evidence.md` report, under Phase 5, cases A501 to A507.
- Phase / capability status: To be recorded at closeout.

## Stage 2 - Source Git Levels and Git LFS

### Tasks

- [ ] t6: Read the project setting `sources.git_level` (`all`, `converted` or `none`, `all` when absent) from `.make/blueprint/config.yaml`, and work out each source's level from its optional `git_level` field or the project level. A source's own level is set through the commands in t43, at once and with no pending change ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#source-git-levels-and-the-missing-state))
- [ ] t43: Build `run source add --git-level <level>` and `run source set-level <source>... <level>`, with the MCP tool `source_set_level` of kind `write` in the `intake` profile. `--git-level` gives each source that the call registers its own `git_level`, and the call writes the source records and the managed `.gitignore` in the same journaled change, so a file meant for `none` is never registered at the project level first. `run source set-level` writes each named source record and the managed `blueprint/sources/.gitignore` in one journaled change, at once, with no review and no pending change, because a git level is a storage setting, not a claim from evidence. It gives the history warning from t8 when a tracked source moves to a level that keeps it out of git ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#source-git-levels-and-the-missing-state); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-source); [Q-083](../../prd/03-open-questions-and-risk-register.md#q-083-changing-the-git-level-of-a-source))
- [ ] t7: Write the managed `blueprint/sources/.gitignore` at the project level `all`: it lists by path exactly the files that source overrides keep out of git, which are the original of each source at `converted`, and the original, the converted text and the table CSV files of each source at `none` ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#source-git-levels-and-the-missing-state))
- [ ] t8: Write the managed `blueprint/sources/.gitignore` at the project levels `converted` and `none`: it ignores every file under `blueprint/sources/` by a file pattern, never a folder pattern, and keeps by path only the router files, the git rule files, the converted text and table CSV files of each source at `all` or `converted`, and the original of each source at `all`. Keep each file by its path, never by its extension. Update the file in the same change as `run source add` and as any change to a source's level or the project level. Warn, when a tracked source moves to a level that keeps it out of git, that the file stays in git history, and never rewrite history. Never touch the root git files or global git config ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#source-git-levels-and-the-missing-state); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#rebuild-notes))
- [ ] t9: Build the R-024 hand-copy test in the test suite: at the project levels `converted` and `none`, copy a file into `blueprint/sources/` and into a subfolder of it by hand, without `run source add`, and confirm through git that git ignores both files ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#source-git-levels-and-the-missing-state); [R-024](../../prd/03-open-questions-and-risk-register.md#r-024-hand-copied-files-reach-git-before-registration))
- [ ] t10: Work out each source's availability on this machine on every read and never store it. Show a source whose kept-out file is absent as missing in `run source list`, `run source show`, `project check` and the source counts for `project status`. Register `source-not-here` as information, `source-file-missing` as an error for an absent original at the level `all`, and `converted-missing` as an error for an absent converted text at the level `all` or `converted` ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#source-git-levels-and-the-missing-state); [10 Records and Identity](../../prd/10-records-and-identity.md#check-catalog))
- [ ] t11: Register `source-unregistered` as information for each file in `blueprint/sources/` that no source record names, with `run source add` as the next action. Leave out the folder's router files (`AGENTS.md`, `CLAUDE.md`), converted text, table CSV files, files that converted text links to, such as the images that v1 converted text keeps beside it, and the managed `.gitignore` and `.gitattributes` ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#source-git-levels-and-the-missing-state); [Q-082](../../prd/03-open-questions-and-risk-register.md#q-082-files-in-the-sources-folder-that-no-source-record-names))
- [ ] t12: Build the Git LFS rules: read `sources.lfs_threshold_mb` with the default `50`; when an original at or above the limit is registered and git tracks it, write its rule into `blueprint/sources/.gitattributes`; write no rule for an original that its level keeps out of git; never edit root git files, never install Git LFS, never run `git lfs install`, and keep `setup` free of any Git LFS question. `project check` reports each large tracked original that no Git LFS rule covers as the warning `source-no-lfs`, naming the file and how to track it, and reports a Git LFS pointer file whose content was not fetched as the information code `source-lfs-not-fetched` instead of reporting the source as changed ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#large-originals-and-git-lfs); [R-017](../../prd/03-open-questions-and-risk-register.md#r-017-git-lfs-limits-and-repository-size))

### Acceptance criteria

- A508: In a git fixture at the project level `all` with one source at `git_level: converted` and one at `none`, `blueprint/sources/.gitignore` lists the first source's original and the second source's original, converted text and table CSV files by path, and nothing else. `git check-ignore -v` confirms each listed file.
- A509: In a git fixture at the project level `converted` with a `pricing.csv` original, `git status --porcelain` shows the converted text and table CSV files as tracked candidates and does not show `pricing.csv`, also when the source sits in a subfolder of `blueprint/sources/`.
- A510: The R-024 hand-copy test passes at the levels `converted` and `none`: after the hand copy, `git status --porcelain --ignored` lists each copied file as ignored, and `git add -A` stages neither file.
- A511: `run source set-level <source> converted` on a tracked source at `all` prints a warning that the file stays in git history. The commit count is the same afterward, and the root `.gitignore`, the root `.gitattributes` and `git config --global --list` are byte-identical.
- A512: In a second clone that lacks a `converted` source's original, `run source list` shows the source as missing, `project check` reports `source-not-here` as information with the outcome `success`, and every record file is byte-identical to the first clone's. Deleting an original at the level `all` gives `source-file-missing` as an error, and deleting the converted text of a source at `converted` gives `converted-missing` as an error.
- A513: A file copied by hand into `blueprint/sources/` at the level `converted` gets `source-unregistered` as information, with the file path and `run source add`. Converted text, table CSV files, an image file that a converted text links to, `.gitignore`, `.gitattributes` and the router files are not reported.
- A514: A synthetic 51-megabyte original at the level `all` gets a Git LFS rule for its path in `blueprint/sources/.gitattributes`. The same file at `converted` gets none. With `sources.lfs_threshold_mb: 10`, a 12-megabyte original gets a rule. A large tracked original whose rule was deleted by hand gets a `project check` warning that names the file and how to track it. A Git LFS pointer file whose content was not fetched is reported as not fetched, not as `source-changed`. A test that records spawned processes finds no `git lfs install`, and `setup` on a fresh project asks no Git LFS question.
- A547: `run source set-level SRC-001 SRC-002 none` on two `active` source records at the project level `all` sets `git_level: none` in both record files and lists each source's original, converted text and table CSV files in `blueprint/sources/.gitignore`, in one journaled change. Both records stay `active`, and `run review list` shows no pending change. A crash test that stops the call part way leaves both records and the `.gitignore` fully changed or fully unchanged. `make-blueprint mcp --profile intake` lists `source_set_level`, and a call without `allowWrite: true` returns `blocked` with `write-not-allowed`.
- A548: At the project level `all`, `run source add --git-level none` given a file outside the project copies it into `blueprint/sources/` and writes a source record with `git_level: none`, and `blueprint/sources/.gitignore` lists the copied original and its converted text in the same change. `git status --porcelain` never shows the copied file.

### Dependencies

- Stage 1 of this phase.
- [Phase 3](03-storage-and-identity.md): the write journal, so the `.gitignore` and `.gitattributes` writes land in the same change as the record writes.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now` for this stage.
- Performance evidence: none.
- Human Experience Review: The agent reads `run source list` and `project check` output in the clone that lacks kept-out files and records whether missing reads as a normal state with no error, and whether the history warning in A511 says what stays in git. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Set `sources.git_level: converted`, copy a file into `blueprint/sources/` by hand and run `git status`. Notice that git ignores it and that `make-blueprint project check` names it with `run source add`. Feedback is welcome and not required.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A508 to A514, A547 and A548. The A510 result closes register risk R-024.
- Phase / capability status: To be recorded at closeout.

## Stage 3 - Conversion Decisions

### Tasks

- [ ] t13: Settle with the owner, and record in PRD 12 and the PRD 06 project config table through the Make Docs PRD change process: the default of `conversion.table_csv_min_rows`; the row counting rules for csv, xlsx and document tables, covering header rows, empty rows, merged cells and hidden rows, and which row becomes the header row of a table CSV file; the exact trouble signals of the built-in pdf converter; and the digit width of row anchors and row positions, since the PRD rule says three or more digits while every row example uses four ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#built-in-conversion); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#rebuild-notes))
- [ ] t14: Settle with the owner, and record in PRD 12 and register Q-080 through the same process: the page batch size of the agent route, and whether the CLI keeps page progress in the machine Store under `~/.make/blueprint/` or in the source record ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#agent-conversion-for-complex-pdfs); [Q-080](../../prd/03-open-questions-and-risk-register.md#q-080-agent-conversion-for-complex-pdfs))

### Acceptance criteria

- A515: PRD 12 states the default of `conversion.table_csv_min_rows`, the row counting rules, the pdf trouble signals and the row anchor digit width, and the PRD 06 project config row names the same default. `make-docs run prd authority validate --target-root kits/make-blueprint` exits 0.
- A516: PRD 12 states the batch size and where page progress lives, and register Q-080 marks both open details as settled. The same validator exits 0.

### Dependencies

- The owner's choice on each detail. The agent proposes options with their effects. This is a product decision, not a human acceptance gate.

### Closeout Notes

- Four testing decisions: All four types are `not-needed-now` for this decision stage. Automated Implementation Testing covers the settled rules once Stages 4 and 8 build them.
- Performance evidence: none.
- Human Experience Review: Not applicable. This stage changes PRD text only.
- Optional experience handoff: Not applicable.
- Explicit human acceptance gate: None.
- Evidence report: No durable evidence record is needed. The PRD and register text are the record.
- Phase / capability status: To be recorded at closeout.

## Stage 4 - Built-In Converters and Anchors

### Tasks

- [ ] t15: Build the one CSV writer that table CSV files and exports share: UTF-8 with a byte order mark, commas, RFC 4180 quoting and LF line endings, values written exactly, and the same bytes for the same rows ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#built-in-conversion); [Q-038](../../prd/03-open-questions-and-risk-register.md#q-038-csv-encoding-rules))
- [ ] t16: Build the anchor writer: the kinds `h`, `p`, `r` and `t`, each numbered on its own from 1 in reading order with the digit width from t13, growing past it when a file needs more; unique in one converted text; the marker `<a id="p-012"></a>` at the start of each element; and each extracted table written as `<original file name>.t-001.csv` beside the main file, with an element in the main file that starts with the table anchor and links to the CSV file ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#anchor-format-and-algorithm); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#converted-text-file))
- [ ] t17: Build the converted text writer: the main file `<original file name>.md` next to the original, with the front matter keys `source` (the source `id`), `source_sha256`, `converter`, `converter_version` and `parts`, and no timestamp or other value that changes between runs. Write the main file, every table CSV file and the source record update as one journaled change. Write no file when the original and the converter version have not changed ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#converted-text-file); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#built-in-conversion))
- [ ] t18: Build the parts rules for each file type, including a file with no headings as one part labeled with its file name that starts at its first anchor, which can be `t-001`, and each extracted table with its positions belonging to the part that holds its table anchor ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#parts-and-anchors-by-file-type))
- [ ] t19: Build the docx converter: document headings, paragraphs, list items and image placeholders, rows of tables below `conversion.table_csv_min_rows` as Markdown rows with row anchors, and larger tables as table CSV files ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#parts-and-anchors-by-file-type))
- [ ] t20: Build the xlsx converter: one part and one heading for each sheet, hidden sheets included and marked as hidden, each sheet written as a table CSV file, and cell values written as a person sees them, such as a formula's cached result and a formatted date ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#parts-and-anchors-by-file-type); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#rebuild-notes))
- [ ] t21: Build the pptx converter: one part for each slide with a heading from the slide number and title, text boxes, list items and speaker notes as paragraphs, and tables by the size setting ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#parts-and-anchors-by-file-type))
- [ ] t22: Build the pdf converter: one part for each page with a heading from the page number, blocks of text as paragraphs, and no tables. A pdf with no text layer sets `conversion_status: failed` with the reason in the record body and writes no partial text. Report each trouble signal from t13 with its pages and name `run source convert <source> --agent` as the next action ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#built-in-conversion))
- [ ] t23: Build the csv converter (one table CSV file `t-001` for the whole file), the md converter (headings, paragraphs, list items and tables, with an original's own front matter and HTML kept as body text so the converted text has one front matter block), and the txt converter (blocks separated by blank lines) ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#parts-and-anchors-by-file-type); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#rebuild-notes))
- [ ] t24: Build `run source convert <source>...` with the MCP tool `source_convert` for converting again, and register `converter-old` as information for a source converted with an older built-in converter version, with the command to convert it again and never for `agent` or `v1` text, and `converted-mismatch` as an error for converted text whose front matter `source`, `source_sha256` or `converter_version` disagrees with its source record. A newer converter version that arrives through `update` never rewrites existing converted text by itself ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#built-in-conversion); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#change-detection))

### Acceptance criteria

- A517: The CSV writer's output starts with the bytes `EF BB BF`, uses commas and LF line endings, quotes a value that holds a comma, a quote or a line break by RFC 4180, and writes the value `=SUM(A1)` unchanged.
- A518: For a fixture of each of the seven types, converting twice gives a main file and table CSV files with equal `sha256` values, and the converted text holds no timestamp. A test that records spawned processes and network calls finds none during conversion.
- A519: In a converted docx fixture, each anchor marker appears exactly once, and each kind is numbered from 1 in reading order on its own. A table at or above `conversion.table_csv_min_rows` becomes `<original>.t-001.csv` and the main file holds an element that starts with `t-001` and links to it.
- A520: An xlsx fixture with a hidden sheet, a formula cell and a date cell converts to one part for each sheet, with the hidden sheet marked as hidden, one table CSV file for each sheet, the formula's cached result and the date as formatted in the workbook.
- A521: A pptx fixture converts to one part for each slide with a heading from the slide number and title, and its speaker notes appear as paragraphs with `p` anchors.
- A522: A pdf fixture with no text layer gets `conversion_status: failed`, the reason in the record body and no converted file. A pdf fixture with a table reports the trouble signal with its page numbers and names `run source convert <source> --agent`.
- A523: A crash test stops conversion after the main file is written and before the record update. The next command finishes or undoes the change, and the record's `sha256` equals the converted text's `source_sha256`.
- A524: `run source convert` on an unchanged source leaves `git status --porcelain` empty. A fixture converted with an older docx converter version gets `converter-old` as information with the convert command, and fixtures with `converter: agent` and `converter: v1` do not. A hand edit to `source_sha256` in converted text gives `converted-mismatch` as an error. After a test bumps the docx converter version, no converted file changes until `run source convert` runs.
- A525: An md original with its own front matter and an HTML block converts to a file with one front matter block, the original's front matter and HTML in the body as text, and unique anchor markers.

### Dependencies

- Stage 3 of this phase for the settled defaults and signals.
- [Phase 3](03-storage-and-identity.md): the write journal.
- Used later by [Phase 7](07-analysis-and-exports.md), whose exports reuse the CSV writer, and by [Phase 9](09-v1-import-and-release.md), which keeps v1 converted text with `converter: v1` and bundles the converters into the release build.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Guided Progress Review follows in Stage 9; the other two `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: The agent opens converted docx, xlsx and pdf fixtures in a text editor and records whether each sheet, slide and page starts with a heading a reader can find, and whether the table CSV files open with their header row first. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Run `make-blueprint run source add` on a small workbook and open the converted `.md` file beside it. Notice the heading for each sheet and the link to each sheet's CSV file. Feedback is welcome and not required.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A517 to A525.
- Phase / capability status: To be recorded at closeout.

## Stage 5 - Supplied Text

### Tasks

- [ ] t25: Make `run source add` register a file with no built-in converter, such as an image, an email file or HTML, with its hash, no converted text and `conversion_status: needs-manual`. Make `run source convert` take supplied text on standard input or through a `source_convert` tool argument for a source in `needs-manual` or `failed`, or for any source when the caller asks to replace a poor conversion. The CLI anchors it by the md rules, writes it next to the original, and sets `converter: manual` and `conversion_status: converted` ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#unsupported-types-and-failed-conversions))

### Acceptance criteria

- A526: A `.png` file registers with `conversion_status: needs-manual` and no converted file. `run source convert <source>` with Markdown on standard input writes `<file>.png.md` with anchors, `converter: manual` and `conversion_status: converted`. The `source_convert` MCP tool given the same text writes byte-identical files.
- A527: `run source convert` with supplied text on a `converted` docx source returns `blocked` and names the flag that asks to replace the conversion. With that flag, the supplied text replaces the converted text, and links made against the earlier text get `evidence-old-version`.

### Dependencies

- Stage 4 of this phase for the md anchoring rules.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now` for this stage.
- Performance evidence: none.
- Human Experience Review: The agent reads the A527 refusal and records whether it names the flag and what replacing the conversion does to existing links. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Not applicable.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A526 and A527.
- Phase / capability status: To be recorded at closeout.

## Stage 6 - Reading Sources and Following Evidence Links

### Tasks

- [ ] t26: Build the anchor and position resolver: an anchor resolves to its line in the main file and to its part; a table anchor resolves to its table CSV file; a row position counts from the first data row with the header row not counted; a column position counts from the first column; and a cell is one value. Every anchor and position in a link made against the current hash, converter and converter version resolves to exactly one element, table, row, column or cell ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#reading-sources-and-following-evidence-links); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#anchor-format-and-algorithm))
- [ ] t27: Extend `run source show <source-or-link>` (`source_show`) to evidence links. It returns the source `ref` and title, the original path, the converted text path, the line of the anchor as `path:line` in human output, the part, and the text of the element, plus the table CSV path and the values for a table position. When the caller names the record the link comes from and that record's links were made against an older version, it says so in plain words, names the version the link was made against, and shows the current text marked as from a newer version. When the anchor is not in the current text, it says so and names the command that lists the source's parts. When the original is not here, it says so, resolves through the converted text at the level `converted`, and says the link cannot be checked here at the level `none` ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#reading-sources-and-following-evidence-links))
- [ ] t28: Build `run source read <source> [<part-or-range>]` with the MCP tool `source_read`. It returns the converted text of one part or one anchor range with its anchors, and the rows of a table from its CSV file for a table anchor, so an agent reads a large source part by part ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#reading-sources-and-following-evidence-links))
- [ ] t29: Fill the Phase 4 link state hook with `broken` (the anchor is not in the current converted text, the table CSV file is absent, or a position is outside the table) and `unavailable` (the converted text is not on this machine because the source's level is `none`), and register `evidence-broken` as an error and `evidence-unavailable` as information. Under the level `converted`, a link still resolves through the converted text without the original ([10 Records and Identity](../../prd/10-records-and-identity.md#evidence-links); [10 Records and Identity](../../prd/10-records-and-identity.md#evidence-links-are-checked-and-flag-changed-sources))

### Acceptance criteria

- A528: For converted fixtures of each type, every anchor listed in the converted text resolves to exactly one element. In an xlsx fixture, `#t-001` resolves to the sheet's CSV file, `#t-001:r-0012` to the twelfth data row with the header row not counted, `#t-001:c-003` to the third column, and `#t-001:r-0012:c-003` to one cell value that equals the value in the workbook.
- A529: `run source show SRC-4hd8x7k2#p-012` prints the source `ref` and title, the original path, the converted text location as `path:line`, the part label and the paragraph text, and `--json` carries the same facts as fields.
- A530: `run source show` for a link from a record made against an older hash says in plain words that the source changed after the link was made, names the hash and converter version the link was made against, and shows the current text marked as from a newer version.
- A531: A link to an anchor that is not in the current text gets `evidence-broken` from `project check`, and `run source show` says the anchor was not found and names the command that lists the parts. A position past the last row and a link whose table CSV file is absent also get `evidence-broken`.
- A532: On a clone without a `converted` source's original, `run source show` resolves the link through the converted text and says the original is not on this machine. On a clone without a `none` source's files, it says the link cannot be checked here, and `project check` reports `evidence-unavailable` as information, not `evidence-broken`.
- A533: `run source read SRC-4hd8x7k2 "Sheet: Terms"` returns only that part's text with its anchors, and reading `t-002` returns that sheet's rows from its CSV file.

### Dependencies

- Stages 2 and 4 of this phase.
- [Phase 4](04-record-types.md): the link state engine and `evidence_versions`.
- Used later by [Phase 6](06-extraction-and-review.md), where `run review show` and extraction resolve evidence through this resolver.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now` for this stage.
- Performance evidence: none.
- Human Experience Review: For the evidence promise, the agent follows five links of different forms with `run source show`, opens each `path:line` in an editor, and records whether each lands on the linked element, whether a changed source reads clearly as changed, and whether the missing state reads as normal. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Run `make-blueprint run source show <link>` for one evidence link on a capability and open the printed `path:line`. Notice that the cursor lands on the linked paragraph or row. Feedback is welcome and not required.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A528 to A533.
- Phase / capability status: To be recorded at closeout.

## Stage 7 - Change Detection and Source Counts

### Tasks

- [ ] t30: Register `source-changed` as a warning: `project check` hashes each available original and compares it with the source's `sha256`, reporting a difference as "changed since conversion" with the source `ref` and `run source convert <source>`. Keep the last size and modification time of each original in the index so `project check` skips hashing files that have not changed ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#change-detection); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#integrations))
- [ ] t31: Make `run source convert` on a changed original update `sha256`, write the new converted text, and report how many evidence links, in how many records, now point to an old version ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#change-detection))
- [ ] t32: Build the source read model for `project status`: the total, the count for each conversion status and each git level, sources missing on this machine, sources changed since conversion, evidence links that point to an old version by source, and the next useful action for sources that need manual text, failed, or sit in `agent-in-progress` or `awaiting-review`. It reads the index and does not open every record file. Phase 8 renders it ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#change-detection); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#project-status))

### Acceptance criteria

- A534: After an original's bytes change, `project check` reports `source-changed` as a warning with the source `ref` and `run source convert <ref>`, and each record that links to the source gets `evidence-old-version`.
- A535: `run source convert` on that source updates `sha256` and prints the number of links and records that now point to an old version, and both numbers match the fixture.
- A536: A second `project check` with no file changed computes no hash, as a test that counts hasher calls shows.
- A537: On a fixture project, the source read model returns the expected count for each conversion status and git level, one missing source, one changed source and the old-version links for it, and a next action for each of the states `needs-manual`, `failed`, `agent-in-progress` and `awaiting-review`.

### Dependencies

- Stages 4 and 6 of this phase.
- [Phase 3](03-storage-and-identity.md): the index, which holds the last size and modification time.
- Used later by [Phase 6](06-extraction-and-review.md), where a changed source becomes due for extraction again, and by [Phase 8](08-mcp-skills-and-status.md), which shows these counts in `project status`.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now` for this stage.
- Performance evidence: none. The index profile from Phase 3 covers index reads.
- Human Experience Review: The agent replaces one fixture original and records whether `project check` and `run source convert` tell a person what changed, how many links it affects and what to run next. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Edit one original, then run `make-blueprint project check` and `make-blueprint run source convert <source>`. Notice the count of links that now point to an old version. Feedback is welcome and not required.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A534 to A537.
- Phase / capability status: To be recorded at closeout.

## Stage 8 - Agent Conversion for Complex PDFs

### Tasks

- [ ] t33: Build `run source convert <source> --agent [--reason <text>]` as `source_convert` with `agent: true`. It returns `failed` with the reason for a source that is not a PDF. It starts without a reason when the built-in pdf converter reported a trouble signal for the file, and otherwise returns `blocked` and names `--reason`. It keeps a given reason in the source record body, sets `conversion_status: agent-in-progress`, and leaves the record `active` ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#agent-conversion-for-complex-pdfs); [08 CLI and MCP](../../prd/08-cli-and-mcp.md#run-source))
- [ ] t34: Build `run source pages-next <source> [--file]` with the MCP tool `source_pages_next`. It hands out the next page batch as page numbers, with the batch size and page progress location from t14. It splits pages with the same JavaScript PDF reader that the built-in pdf converter uses. A batch that was handed out and never written goes out again on a later call, and pages that review sends back go out again with the reviewer's reason. With `--file`, it also writes a PDF of only those pages to `~/.make/blueprint/`, never into the project ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#agent-conversion-for-complex-pdfs))
- [ ] t35: Build `run source pages-write <source> --pages <range>` with the MCP tool `source_pages_write`. It takes Markdown for the prose and one CSV file for each table, for pages that are out in a batch, and refuses a batch that leaves out a page in the range. It writes the batch into the converted text in page order, starts each page with a heading from its page number, numbers the anchors over the whole converted text by the anchor rules, and writes the table CSV files through the CSV writer, each level of a nested table as its own table CSV file ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#agent-conversion-for-complex-pdfs); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#converted-text-file))
- [ ] t36: Build the text-layer check in `pages-write`: where a page has a text layer, compare the numbers and words in the agent's text with it, and flag each value the agent's text leaves out and each value the text layer does not hold, without refusing the batch. Mark a page with no text layer "unchecked". Keep the flags and the "unchecked" marks with the page progress so review can show them. The same agent text and original always give the same anchors and flags ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#agent-conversion-for-complex-pdfs))
- [ ] t37: When every page is written, set `conversion_status: awaiting-review`, and set `converter: agent`, `converter_model` from the caller, `converted_at` to the date of the last batch, and `converter_version` to the route's version. Count accepted agent text as `converted` while the original's hash matches `sha256`. Make agent text again only when a person asks or the original changes, never for a new model or a new CLI version. When agent text replaces earlier converted text, links made against the earlier text point to an old version through the `converter` in `evidence_versions` ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#agent-conversion-for-complex-pdfs); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#change-detection))
- [ ] t38: Build the send-back call that Phase 6's `run review reject <source>` and `run review approve <source>` use: reject queues the named pages, or every page, with the reason and sets `conversion_status: agent-in-progress`; approve sets `conversion_status: converted`. Neither changes the record's `status` ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#agent-conversion-for-complex-pdfs))

### Acceptance criteria

- A538: `run source convert <docx source> --agent` returns `failed` with exit code 2 and says the route takes PDFs only. On a pdf with a trouble signal, it sets `conversion_status: agent-in-progress` and the record stays `active`. On a pdf with no trouble signal and no `--reason`, it returns `blocked` with exit code 1 and names `--reason`. With `--reason`, it starts and the reason appears in the record body.
- A539: `run source pages-next` returns batches of the size set in t14. After every batch is out and one is still unwritten, the next call returns that batch again. Page progress survives a new process. With `--file`, a PDF with exactly the batch's pages appears under `~/.make/blueprint/` and `git status --porcelain` stays empty.
- A540: `run source pages-write --pages 9-12` whose text leaves out page 11 is refused and names page 11. A range that is not out is refused. An accepted batch puts a page heading before each page in page order, and anchors run without gaps over the whole converted text. Writing the same agent text for the same original twice gives byte-identical converted text and the same flags.
- A541: On a fixture page whose text layer holds `1,250.00` and whose agent text holds `1,520.00`, `pages-write` flags both values and accepts the batch. A scanned fixture page with no text layer is marked "unchecked".
- A542: After the last batch, the source has `conversion_status: awaiting-review`, `converter: agent`, the given `converter_model`, `converted_at` set to that day and the route's `converter_version`. After the CLI version changes, `project check` reports no `converter-old` and no `evidence-old-version` for links to that text.
- A543: The send-back call with pages 3 to 4 and a reason sets `conversion_status: agent-in-progress`, and the next `pages-next` hands out pages 3 and 4 with the reason.

### Dependencies

- Stages 3, 4 and 7 of this phase.
- [Phase 3](03-storage-and-identity.md): the machine Store under `~/.make/blueprint/` when t14 keeps page progress there.
- Used later by [Phase 6](06-extraction-and-review.md), which reviews agent conversions, and by [Phase 8](08-mcp-skills-and-status.md), which ships the `blueprint-convert` skill and places `source_pages_next` and `source_pages_write` in the `intake` profile.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; the other three `not-needed-now` for this stage.
- Performance evidence: none.
- Human Experience Review: The agent runs the route on a synthetic three-page PDF with a table and a scanned page, and records whether each command says which pages are out, which are written, which are flagged and what comes next. Reviewer: the implementing agent. Limit: no lived human feedback.
- Optional experience handoff: Run `make-blueprint run source convert <pdf> --agent --reason "test"` on a small PDF, then `make-blueprint run source pages-next <pdf>`. Notice the page numbers and the next step. Feedback is welcome and not required.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A538 to A543.
- Phase / capability status: To be recorded at closeout. Review of agent conversions completes in Phase 6.

## Stage 9 - Conversion Quality Review

### Tasks

- [ ] t39: Build a synthetic pdf and pptx sample set with no client data, covering tables, two-column pages, repeated page headers and footers, hyphenated line breaks, slide shapes, slide tables and speaker notes ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#built-in-conversion); [12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#rebuild-notes))
- [ ] t40: Run the Guided Progress Review: a human reviewer and the agent compare each converted sample with its original and record what is lost ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#built-in-conversion))
- [ ] t41: Record each confirmed loss as a current limit of the converters in the PRD 12 Built-In Conversion section through the Make Docs PRD change process, and give register R-016 the test results that its close needs ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#built-in-conversion); [R-016](../../prd/03-open-questions-and-risk-register.md#r-016-conversion-quality-and-moving-anchors))
- [ ] t42: Build the cross-type converter fixture suite and anchor stability tests: each type converted twice gives the same bytes, and a converter version change flags the links made with the older version ([12 Source Intake and Conversion](../../prd/12-source-intake-and-conversion.md#built-in-conversion))

### Acceptance criteria

- A544: The central `evidence.md` report holds a Phase 5 Guided Progress Review section that lists each sample, each loss found, its decision (recorded as a limit, fixed, or dismissed with a reason), the reviewer and the limits of the review.
- A545: PRD 12 Built-In Conversion lists each confirmed loss as a current limit, and `make-docs run prd authority validate --target-root kits/make-blueprint` exits 0.
- A546: The t42 converter fixture suite passes for all seven types, and a test that bumps the docx converter version makes `project check` report `evidence-old-version` for links made with the older version.

### Dependencies

- Stages 4 and 7 of this phase.
- A human reviewer for t40.

### Closeout Notes

- Four testing decisions: Guided Progress Review active for t40 under the decision record above; Automated Implementation Testing active for t42; the other two `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: The agent summarizes the review's losses against the evidence promise and records whether any loss stops a link from reaching an exact place. Reviewer: the implementing agent. Limit: the human reviewer's observations are evidence from that reviewer only.
- Optional experience handoff: Not applicable. The Guided Progress Review already holds the human's observations.
- Explicit human acceptance gate: None.
- Evidence report: To be recorded at closeout in the central `evidence.md` report, cases A544 to A546.
- Phase / capability status: To be recorded at closeout. The phase can close when A501 to A546 pass, with Guided Progress Review findings recorded.
