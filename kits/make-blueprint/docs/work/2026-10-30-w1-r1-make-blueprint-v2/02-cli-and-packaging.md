---
title: "Phase 2: CLI and Packaging"
kind: "work"
status: "active"
coordinate: "W1 R1 P2"
source:
  type: "prd"
  path: "docs/prd/07-installation-and-distribution.md"
---

# Phase 2: CLI and Packaging

## Purpose

This phase stands up the `make-blueprint` CLI and its stdio MCP server shell on the core adapters from [Phase 1](01-shared-core-adoption.md). It makes `setup` create a working project, `setup remove` take Make Blueprint out of a project, `update` update only the tool, and `uninstall` take the tool off the machine. It proves early that one signed single file runs on a machine with no Python and no Node, and it creates the start-time performance profile before the first start-time measurement.

It depends on the pinned core, the tool identity, the block adapter, tool discovery, the handoff line and the shared-file adapters from Phase 1.

## Overview

The operation catalog is the single source for every CLI command and MCP tool, so the two surfaces cannot drift. The result envelope, the four outcomes and their exit codes, and the human and machine output rules give every later command the same shape. The command grammar fixes the seven groups, the nine `run` domains, the lifecycle command names and the reserved `serve` command. The layout, routers and project config give each project the v2.0 folders. The resource surface serves Make Blueprint's system docs. The MCP server shell carries the profile mechanism, the `allowWrite` gate and the connection check that later tools inherit.

`setup`, `setup remove`, `update` and `uninstall` then run the Phase 1 adapters as real commands, and the install matrix proves the two install promises on fresh projects. The signed single files for the five Q-006 targets, tested in clean containers, remove the main packaging risk before other work depends on it.

Later phases fill the catalog: [Phase 3](03-storage-and-identity.md) the `project` repair commands, the filter syntax and read-only SQL, [Phase 4](04-record-types.md) to [Phase 7](07-analysis-and-exports.md) the `run` verbs, and [Phase 8](08-mcp-skills-and-status.md) the final tool list for each profile, `project status`, the nine skills and the v2.0 resource set. [Phase 9](09-v1-import-and-release.md) publishes the release and runs the start-time profile again on the release build.

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `direct`. Three promises from the [plan overview](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md#human-experience-propagation) name this phase. "Install Make Blueprint alone, Make Docs alone, or both; handoff works with no extra setup" is owned by [05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#separate-or-together) with the commands in [07 Installation and Distribution](../../prd/07-installation-and-distribution.md#install-alone-or-together). "One signed file works on a machine with no Python" is owned by [07 Installation and Distribution](../../prd/07-installation-and-distribution.md#signed-single-files). "User text in `AGENTS.md` and `CLAUDE.md` survives setup, update and uninstall of either tool" is owned by [06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#managed-blocks). The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind all three.
- Intended human outcome: a person runs `make-blueprint setup` alone or beside Make Docs, in either order, and can tell from the output alone whether setup completed, completed with kept conflicts, or stopped with nothing changed, which agent tools and MCP entries it configured, whether both root blocks carry their handoff lines, and what to do next. A person on a locked-down machine installs one signed file and runs every command with no Python and no Node. A person's own text in the instruction files survives `setup`, a second `setup`, `update` and `setup remove` of either tool.
- Human-facing surface or indirect effect: `setup`, `setup remove`, `update` and `uninstall` output, the root and folder routers for the selected agent tools only, the shared `.make/config.yaml` choices, the signed single-file download and install, and the CLI help, version and error output.
- Implementation work: Stages 1 and 2 build the catalog, envelope, outcomes, output and grammar. Stage 3 builds the layout and routers. Stage 4 builds the resource surface. Stage 5 builds the MCP server shell. Stages 6 and 7 build `setup`, `setup remove`, `update` and `uninstall`. Stage 8 runs the install matrix and the Human Experience Review of first-run setup. Stage 9 builds the npm package and the signed single files. Stage 10 characterizes start time.
- Evidence source or testing type selected under current authority: Automated Implementation Testing, as the plan overview selects: the install matrix on fresh projects, including a kit set up after another reading the shared choices; round-trip tests with user text above, between and below both blocks; and install and `setup` in a clean container with no Python and no Node on each Q-006 target. Human Experience Review of first-run setup output.
- Executor: the implementing coding agent builds and runs the tests in CI and in the clean containers, and records the Human Experience Review. The owner supplies the code-signing certificates.
- Accepted obligation or deferral route: none. The full run of all seven workflow stages in the clean container on the release build belongs to [Phase 9](09-v1-import-and-release.md) as planned work, not as a deferral.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | Catalog parity tests in both directions, envelope and exit-code tests, grammar and help tests, layout and router tests, resource tests, MCP shell tests, `setup` and uninstall tests, the install matrix on fresh projects, the user-text round-trip through real commands, build and signature tests for the five targets, and clean-container tests with no Python and no Node. They decide whether later phases can add commands to this CLI and whether the single-file build is fit to carry them. The acceptance criteria in each stage are the decision record. |
| Performance Testing | active | `characterize-now` start-time baseline of the single-file CLI and MCP server, under one `PERF-###` profile that t50 creates before the first measurement, as [07 Installation and Distribution](../../prd/07-installation-and-distribution.md#start-time-performance) states. It informs whether the TypeScript single-file build is acceptable. It is not a pass or fail gate on the product. |
| Guided Progress Review | not-needed-now | The install matrix and the agent's Human Experience Review of real setup output answer the current decisions. No PRD names a guided review here. |
| Unassisted Goal Testing | not-needed-now | No PRD needs it for this phase, and no current decision depends on proof that a person finds setup without help. |

Start-time candidate:

- Base maintenance action: `none`
- Performance applicability: `characterize-now`
- Canonical `PERF-###` profile link or `none`: none yet. Task t50 writes the profile, with the next free `PERF-###` ID, in its own characterization record under `docs/assets/project/performance/` before the first measurement. This work phase owns it.
- Finite evidence budget and stop-rule reference or `not-applicable`: set in that profile under the contract's bounded-work rule before any run. This phase grants no budget beyond the profile's finite limits.
- Execution packet link or `not-applicable`: none yet. Task t52 renders a finite packet from the profile and links it from the Stage 10 closeout.
- Outcome and evidence handoff or `none`: none yet. The result record and the `A255` to `A258` section of `evidence.md` carry the outcome. [Phase 9](09-v1-import-and-release.md) runs the profile again on the release build.
- Gate disposition and supported-scope limit or `not-applicable`: a `characterization-baseline`, so it gates no product claim. The Stage 10 gate rejects a missing, expired, invalid, non-comparable or unrun characterization and records one of `pass`, `fail`, `revise`, `blocked` or `waived`. The result covers only the measured signed files on the measured targets and supports no start-time claim.

Human Experience Review stays separate from these four testing types. In this phase the agent reviews the real first-run `setup` output in Stage 8 and the real instruction files the matrix leaves, and records observations, conclusions, limits and next actions for each promise.

## Source PRD Docs

- [07 Installation and Distribution](../../prd/07-installation-and-distribution.md)
- [08 CLI and MCP](../../prd/08-cli-and-mcp.md)
- [06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md)
- [05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md)
- [02 Architecture Overview](../../prd/02-architecture-overview.md)
- [18 Local Server and UI](../../prd/18-local-server-and-ui.md), for the reserved `serve` command only

## Source Obligations, Scenarios, And Findings

- Obligations: none. This phase consumes no `O-###` record.
- Risks this phase addresses: [R-002 Two Core Versions in One Project](../../prd/03-open-questions-and-risk-register.md#r-002-two-core-versions-in-one-project), [R-003 Both Tools Write One Root File at Once](../../prd/03-open-questions-and-risk-register.md#r-003-both-tools-write-one-root-file-at-once), [R-004 Start Time of the Single-File CLI and MCP Server](../../prd/03-open-questions-and-risk-register.md#r-004-start-time-of-the-single-file-cli-and-mcp-server), [R-005 Packagers That Unpack to a Temporary Folder](../../prd/03-open-questions-and-risk-register.md#r-005-packagers-that-unpack-to-a-temporary-folder) and [R-013 `make-blueprint://` URIs in Make Docs Link Checks](../../prd/03-open-questions-and-risk-register.md#r-013-make-blueprint-uris-in-make-docs-link-checks). R-014 is started here by the tool-title rule and closed in [Phase 8](08-mcp-skills-and-status.md).
- Decisions carried: [Q-003](../../prd/03-open-questions-and-risk-register.md#q-003-project-uninstall-and-tool-uninstall), [Q-004](../../prd/03-open-questions-and-risk-register.md#q-004-uninstall-of-an-edited-block-and-an-emptied-file), [Q-006](../../prd/03-open-questions-and-risk-register.md#q-006-single-file-packaging-and-code-signing), [Q-009](../../prd/03-open-questions-and-risk-register.md#q-009-what-update-does), [Q-010](../../prd/03-open-questions-and-risk-register.md#q-010-exit-codes), [Q-011](../../prd/03-open-questions-and-risk-register.md#q-011-source-tree-folders), [Q-012](../../prd/03-open-questions-and-risk-register.md#q-012-config-file-name-conflicts-folder-package-names-and-store-override), [Q-016](../../prd/03-open-questions-and-risk-register.md#q-016-instruction-files-for-the-selected-agent-tools), [Q-049](../../prd/03-open-questions-and-risk-register.md#q-049-where-serve-sits) and [Q-084](../../prd/03-open-questions-and-risk-register.md#q-084-small-command-and-status-defaults-found-while-writing-the-work-backlog), for bare `make-blueprint` and the missing-handoff fix in setup output.
- Scenarios: none.
- Findings: none.

## Stage 1 - Operation Catalog, Results and Output

### Tasks

- [ ] t1: Fix the kit source folders for the CLI, the operation catalog, the MCP server, storage, records and each later module (Q-011), and record each module's source path in the Stage 1 closeout so the [02 Architecture Overview](../../prd/02-architecture-overview.md#make-blueprint-modules) module map can name it ([02 Architecture Overview](../../prd/02-architecture-overview.md#module-map)).
- [ ] t2: Build the operation catalog. Each entry declares the operation ID as `<domain>.<verb>`, the CLI command, the MCP tool name made by replacing each `.` and `-` with `_`, the kind (`read`, `derived` or `write`), its profiles, its input schema, its result schema and its behavior owner. An ID is never reused for another operation ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#operation-catalog-entry)).
- [ ] t3: Generate the CLI commands and the MCP tools from the catalog, and write the parity test that checks the catalog against the CLI and against the MCP tool list in both directions ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#command-catalog)).
- [ ] t4: Build the result envelope with `resultVersion`, `operation`, `outcome`, `summary`, `dryRun`, `changes`, `problems` (stable kebab-case code, severity, message, record or path, and fix), `nextAction` (sentence, reason, CLI command, MCP tool and arguments) and `data`, and publish the envelope as a reference resource ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#result-envelope)).
- [ ] t5: Map the four outcomes to exit codes (Q-010): `success` 0, `partial` 1, `failed` 2 and `blocked` 3. Every `partial`, `blocked` and `failed` result names one or more next actions ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#outcomes-and-exit-codes)).
- [ ] t6: Build human and machine output. A terminal gets human output; `--json` or a non-terminal gets machine output, with exactly one JSON document on standard output and progress on standard error. Human output leads with the outcome and what changed, then problems, then the next action, names records by `ref` and title, and keeps words such as index, lock, journal or hash to diagnostic detail. Machine output carries `id` and `ref`. Paths are project-relative with `/`. The MCP result is the same object as `--json` output ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#human-and-machine-output)).
- [ ] t7: Build the common options. `--json` works on every command. `--target-root` works on every catalog command and defaults to the nearest folder upward that holds `.make/blueprint/`; when no such folder exists, a command that needs a project returns the problem code `not-set-up` and names `make-blueprint setup`. `--dry-run` works on every write command and returns the same changes list as the write with no file or Store change. No command waits for input when standard input is not a terminal or `--json` is set; a missing choice returns `blocked` and names its flag. A list result reports the total and whether it was cut, with a default limit of 50 ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#command-catalog)).
- [ ] t8: Write the backlog-boundary test: it fails when any catalog operation creates, edits, closes, orders or exports Make Docs work items ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#backlog-ownership)).

### Acceptance criteria

- A201: The parity test passes on the catalog, and fails on fixture catalogs with an entry that lacks its CLI command or its MCP tool.
- A202: Fixture operations that end `success`, `partial`, `failed` and `blocked` exit 0, 1, 2 and 3, and only the `failed` MCP result sets the error flag.
- A203: A `--json` run prints exactly one JSON document on standard output that validates against the envelope schema, and progress lines appear only on standard error.
- A204: For the same fixture input, human output and machine output carry the same outcome, changes, problems and next action, as a comparison test shows.
- A205: A fixture write command run with `--dry-run` returns the same `changes` list as the real run and leaves the project and the Store byte-identical.
- A206: A fixture command that needs a choice, run with standard input not a terminal and no flag for the choice, returns `blocked` at once and names the flag; a fixture catalog command run in a folder with no `.make/blueprint/` above it returns the problem code `not-set-up` and names `make-blueprint setup`.
- A207: A naming test maps `compare.target-only` to `compare_target_only` and `record.ref-fix` to `record_ref_fix`.
- A208: The backlog-boundary test fails on a fixture operation `work.create` and passes on the catalog.

### Dependencies

- [Phase 1](01-shared-core-adoption.md) Stage 1 for the package and the pinned core.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent runs fixture commands for each outcome and records whether the first line of human output states the outcome and the result before any internal detail, with its limits. To be recorded at closeout.
- Optional experience handoff: not applicable. No user command exists yet beyond fixtures.
- Explicit human acceptance gate: none.
- Evidence report: the `A201` to `A208` section of `evidence.md` in this backlog folder, plus the module path list for t1. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A201` to `A208` pass.

## Stage 2 - Command Grammar

### Tasks

- [ ] t9: Build the seven top-level groups `setup`, `project`, `resource`, `run`, `mcp`, `update` and `uninstall`, the nine `run` domains `source`, `record`, `extract`, `review`, `model`, `compare`, `place`, `export` and `import`, and the listings: `make-blueprint run` lists the domains, and `make-blueprint run <domain>` lists that domain's verbs, each with a one-line description. v2.0 has no `view` domain ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#command-groups)).
- [ ] t10: Make `--help` on every command print usage, options and one or more examples, and make `--help` and `--version` work in any folder with no project and no machine Store. `--version` prints the Make Blueprint version and the core version from the Phase 1 build info ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#command-groups)).
- [ ] t11: Return `failed` with `unknown-command` for an unknown group, domain or verb, change nothing, and name the closest valid command. `make-blueprint status` names `make-blueprint project status` and `make-blueprint check` names `make-blueprint project check`; there are no top-level aliases ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#command-groups)).
- [ ] t12: Make bare `make-blueprint` in a folder that is not set up say what Make Blueprint is and name `make-blueprint setup` as the next action. It never writes, so it never offers to start setup and asks no question. Phase 8 makes the same command print `project status` in a set-up project ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#command-groups)).
- [ ] t13: Reserve `serve` (Q-049): register the name with the core as a top-level command beside `mcp` and outside the catalog, and make `make-blueprint serve` in v2.0 return `failed` and say the local server comes in v2.2. v2.0 has no `serve` option and no `serve` MCP tool ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#the-serve-command-v22)). Reserve the `run package` domain the same way (Q-093): `make-blueprint run package` in v2.0 returns `failed` and says system packages come in v2.1, and `make-blueprint run` does not list it ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#system-package-commands-v21)).
- [ ] t14: Fix the lifecycle command names and flags: `setup` with `--agent <claude-code,codex,copilot-cli>` defaulting to the choices in `.make/config.yaml`, `--scope <project,machine>`, `--mcp-profile <name>`, `--generic-mcp-client <label>`, `--dry-run`, `--yes` and `--json`; `setup remove` and `update` with `--dry-run`, `--yes` and `--json`; `uninstall` with `--remove-store`, `--yes` and `--json`; and `mcp` with `--profile <name>` ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#lifecycle-commands)).

### Acceptance criteria

- A209: `make-blueprint --help` lists exactly the seven groups, and `make-blueprint run` lists exactly the nine domains and no `view`.
- A210: In an empty folder, with `MAKE_BLUEPRINT_HOME` set to a folder that does not exist, `make-blueprint --help` and `make-blueprint --version` succeed and create no folder, and `--version` shows both versions.
- A211: `make-blueprint status` exits 2 with `unknown-command`, names `make-blueprint project status`, and a byte comparison shows the folder unchanged.
- A212: Bare `make-blueprint` in a folder that is not set up names `make-blueprint setup`, offers no setup and waits for no input, also in a terminal, and the folder is unchanged.
- A213: `make-blueprint serve` exits 2 with a summary that says the local server comes in v2.2, and the MCP tool list holds no `serve` tool. `make-blueprint run package` exits 2 with a summary that says system packages come in v2.1, and the MCP tool list holds no `package_` tool.
- A214: A generated test over the catalog and the lifecycle commands confirms that each `--help` output has a usage line, an options list and one or more examples.

### Dependencies

- Stage 1 of this phase.
- [Phase 1](01-shared-core-adoption.md) Stage 1 for the build info that `--version` prints.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent runs `make-blueprint`, `make-blueprint status` and `make-blueprint serve` in a fresh folder and records whether each tells a newcomer what to run next without knowing the command catalog. To be recorded at closeout.
- Optional experience handoff: run `make-blueprint --help`, then `make-blueprint status`, and notice that the error names the command you meant. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A209` to `A214` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A209` to `A214` pass.

## Stage 3 - Project Layout, Machine Folder and Routers

### Tasks

- [ ] t15: Create the v2.0 project tree (Q-015): `.make/`, `.make/blueprint/` with its `config.yaml`, `blueprint/`, `blueprint/sources/`, `blueprint/records/` and `blueprint/exports/`, with a router in each folder so git keeps it, and no `blueprint/runs/` or `blueprint/playbooks/` ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#project-tree)).
- [ ] t16: Write `.make/blueprint/config.yaml` (Q-012) at first `setup` with a random project ID, keep a person's edits to it unless they make an explicit choice, and keep all operational state out of `.make/` and `.make/blueprint/`: no block hashes, locks, journals, receipts, installation records or index files ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#project-config)).
- [ ] t17: Refuse any write whose path, after following symbolic links, lies outside the project folder, and write paths in config, routers and output with forward slashes on macOS, Windows and Linux ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#project-tree)).
- [ ] t18: Build the machine folder: create `~/.make/blueprint/` the first time a command needs the Store, keep Make Blueprint's own Store database there and share nothing else in `~/.make/` with Make Docs, read `~` as the user's profile folder on Windows, and make `MAKE_BLUEPRINT_HOME` move every machine read and write to the folder it names ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#machine-tree)).
- [ ] t19: Write Make Blueprint's router block, through the Phase 1 block adapter, at exactly the v2.0 router locations: the project root, `.make/`, `.make/blueprint/`, `blueprint/`, `blueprint/sources/`, `blueprint/records/` and `blueprint/exports/`, with the content the router table gives each one and no router below `blueprint/records/`. Router text is guidance only, names records by role and folder, and holds no settings, state or copy of a system doc. The `.make/` router carries only Make Blueprint's block before the Make Docs move ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#routers)).
- [ ] t20: Write routers only for the agent tools selected at `setup` (Q-016): `CLAUDE.md` for Claude Code, and `AGENTS.md` for Codex and GitHub Copilot CLI ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#routers)).
- [ ] t21: Cite every `make-blueprint://` URI in routers in inline code, never as a Markdown link target (R-013) ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#system-resources)).

### Acceptance criteria

- A215: On a fresh fixture project, `setup --yes --agent claude-code,codex` creates exactly the v2.0 folder set, each with a router, and no `blueprint/runs/` or `blueprint/playbooks/`.
- A216: With `--agent claude-code`, every router location holds `CLAUDE.md` and no `AGENTS.md`; with `--agent codex`, every location holds `AGENTS.md` and no `CLAUDE.md`.
- A217: After `setup`, a search of `.make/` and `.make/blueprint/` finds no block hash, lock, journal, receipt, installation record or index file.
- A218: A write through a symbolic link that points outside the project is refused, and nothing changes outside the project.
- A219: With `MAKE_BLUEPRINT_HOME` set to a temporary folder, `setup` writes machine state only there and creates nothing in `~/.make/blueprint/`.
- A220: In a fixture project that also has Make Docs, `make-docs` path validation passes on every Make Blueprint router, and no router holds a Markdown link whose target starts with `make-blueprint://`.

### Dependencies

- Stage 2 of this phase.
- [Phase 1](01-shared-core-adoption.md) Stages 2 and 3 for the tool identity and the block adapter.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads the created tree and each router and records whether a maintainer can tell which folders hold project knowledge, which are generated and where the truth lives, with its limits. To be recorded at closeout.
- Optional experience handoff: not applicable until `setup` is complete in Stage 6.
- Explicit human acceptance gate: none.
- Evidence report: the `A215` to `A220` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A215` to `A220` pass.

## Stage 4 - System Resources

### Tasks

- [ ] t22: Build the `make-blueprint://system/<type>/<path>` resolver, with `<type>` one of `contract`, `template`, `reference` or `prompt` and `<path>` a relative POSIX path with no `.` or `..` segment. An unknown scheme, type or path returns `failed` with `unknown-resource` and the valid form, and changes nothing ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#resource-uri)).
- [ ] t23: Build `resource list [--type <type>]`, sorted by URI with each resource's type, version and origin, and `resource read <uri>`, which prints only the resource's bytes in human output and returns the URI, origin, version and content in machine output. Both change nothing, need no machine Store and work offline ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#system-resources)).
- [ ] t24: Build the local copy: `resource ensure <uri>` writes exactly one copy into the typed folder under `.make/blueprint/system/`; `resource read` reads a valid local copy first, one that the installed version wrote and that no one changed; a changed or other-version local file never replaces the served doc without a notice that names the file; the version and hash of each local copy live in the Store; `setup` writes no local copy unless a person asks ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#system-docs-and-local-copy)).

### Acceptance criteria

- A221: `resource list` output is sorted by URI, and `resource read` of a known URI in a project with no local copy returns `origin: installed`.
- A222: After `resource ensure`, `resource read` of the same URI returns `origin: local`; after a hand edit of that local file, it returns the installed body and a notice that names the file.
- A223: `resource read make-blueprint://system/other/a.md` exits 2 with `unknown-resource` and the valid URI form.
- A224: With the network disabled and no machine Store folder, `resource list` and `resource read` succeed and create no Store folder.

### Dependencies

- Stage 3 of this phase.
- [Phase 8](08-mcp-skills-and-status.md) lists the v2.0 resource set (Q-014). This stage serves the resources that exist when it runs, starting with the envelope reference from t4.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads the `resource read` notice for a changed local copy and records whether it names the file and says which body was served. To be recorded at closeout.
- Optional experience handoff: not applicable. Agents are the main readers of this surface, and the notice is checked by the review above.
- Explicit human acceptance gate: none.
- Evidence report: the `A221` to `A224` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A221` to `A224` pass.

## Stage 5 - MCP Server Shell and Write Gate

### Tasks

- [ ] t25: Start the stdio MCP server from the core with `make-blueprint mcp [--profile <name>]`. The default profile is `all`; `--profile` accepts only `core`, `setup`, `intake`, `extract`, `analyze` and `all`, and any other value stops the server before it starts with exit code 2 and the allowed list. The server writes only protocol messages to standard output, logs to standard error, and opens no network port ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#mcp-server-and-profiles)).
- [ ] t26: Build the profile mechanism from the catalog's profile field: a tool outside the active profile is not listed and a call to it returns an unknown-tool error; a tool in several profiles keeps one name, schema, description and behavior; `all` is exactly the union of the five intent profiles; a test fails when a tool has no profile. Phase 8 fixes the final tool list for each profile ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#mcp-server-and-profiles)).
- [ ] t27: Set tool metadata: every tool title starts with "Make Blueprint", read tools carry the MCP read-only hint and write tools do not, and a `failed` outcome sets the MCP error flag. Serve system resources as native MCP resources in every profile through the t22 resolver ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#mcp-server-and-profiles)).
- [ ] t28: Build the `allowWrite` gate. Every write tool's input schema includes `allowWrite`, and read and `derived` tools do not. A write call without `allowWrite: true` changes nothing and returns `blocked` with `write-not-allowed`, naming the argument and what the call would have changed. A call with `dryRun: true` needs no `allowWrite`. `allowWrite` covers only its own call, and the CLI has no `allowWrite` flag ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#write-permission-allowwrite)).
- [ ] t29: Build connection registration and checks. The connection ID is a random UUID and the key holds 256 or more random bits, passed in `MAKE_BLUEPRINT_MCP_CONNECTION_ID` and `MAKE_BLUEPRINT_MCP_CONNECTION_KEY`. The Store keeps only the SHA-256 hash of the key with the connection ID, agent tool and active flag, and compares hashes in constant time. Output, logs and Store records show the key redacted, except the entry printed for another MCP client. Without a recognized ID and key, tools that need the Store return `blocked` with `connection-not-recognized` and name `make-blueprint setup`, `resource_list` and `resource_read` still work, and the server keeps running. The CLI needs no key ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#agent-tool-registration)).

### Acceptance criteria

- A225: `make-blueprint mcp --profile bogus` exits 2 before the server starts and lists the six allowed profiles.
- A226: In a scripted MCP session, every line on standard output parses as an MCP protocol message, log lines appear only on standard error, and an operating-system listener check shows no open port for the process.
- A227: A fixture write tool called without `allowWrite` returns `blocked` with `write-not-allowed` and the project is byte-identical; called with `dryRun: true` and no `allowWrite`, it returns its changes and writes nothing.
- A228: A server started without connection variables answers a Store-backed fixture tool with `blocked`, `connection-not-recognized` and `make-blueprint setup`, answers `resource_list` normally, and is still running afterwards.
- A229: A search of test output, logs and Store tables for a test connection key finds only its SHA-256 hash.
- A230: Every listed tool title starts with "Make Blueprint", and a fixture catalog entry with no profile fails the profile test.

### Dependencies

- Stages 1 and 4 of this phase.
- [Phase 1](01-shared-core-adoption.md) Stage 2 for the MCP server name in the tool identity.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads the `write-not-allowed` and `connection-not-recognized` results and records whether each names the argument or command that clears it. To be recorded at closeout.
- Optional experience handoff: not applicable. The agent tool is the caller; Stage 6 holds the handoff for setup.
- Explicit human acceptance gate: none.
- Evidence report: the `A225` to `A230` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A225` to `A230` pass.

## Stage 6 - Setup and Agent-Tool Setup

### Tasks

- [ ] t30: Build `setup` in this order: check every instruction file it will touch for malformed tags of both tools and stop with no change on a finding; find the agent tools on the machine as a hint only; take the person's choice of agent tools with the `.make/config.yaml` choices preselected; find Make Docs through core tool discovery; show the plan of every file, folder and conflict; apply it; ask Make Docs, when present, to refresh its own root block; report the result and the next useful action. `--dry-run` shows the full plan and writes nothing. With `--yes` and full choices it runs with no terminal and never guesses a missing choice. A second run with no change in between changes no file. `setup` makes no network request ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#setup)).
- [ ] t31: Write one MCP server entry for each selected agent tool. It is named `make-blueprint`, or `make_blueprint` where the format needs it; its command is the absolute path of the installed `make-blueprint` executable; its arguments are `["mcp"]`, or `["mcp", "--profile", "<name>"]` when a person picks a profile; and its environment holds both connection variables. Codex gets `[mcp_servers.make_blueprint]` in TOML and GitHub Copilot CLI gets `type: "local"` and `tools: ["*"]`. `setup` changes only its own entry, writes it at the machine or project scope the person chooses where the agent tool supports it, uses the `all` profile by default, and prints an entry for another MCP client with `--generic-mcp-client <label>` ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#agent-tool-mcp-config)).
- [ ] t32: Build skills install from inside the npm package or signed file with no network request: install into the selected agent tools' skill folders at project or machine scope, keep one folder with the files and link the others to it, write managed copies where links are not allowed, never overwrite a skill folder that `setup` did not install, treat a changed installed skill as a conflict with replace or keep, and refuse a skill folder name that a Make Docs skill folder uses or a skill that holds a script file. [Phase 8](08-mcp-skills-and-status.md) supplies the content of the nine skills ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#skills-install)).
- [ ] t33: Build the `setup_plan` MCP tool in the `setup` profile, which returns the same plan that `make-blueprint setup --dry-run --json` prints ([08 CLI and MCP](../../prd/08-cli-and-mcp.md#mcp-server-and-profiles)).
- [ ] t34: Build setup output. It names each file and folder group created or changed, each file left alone because of a conflict with the command that resolves it, the agent tools configured, the skills installed and the MCP entries written. It says whether Make Docs is present and, when it is, whether both root blocks carry their handoff lines. When the Make Docs block has no handoff line, it tells the person to update Make Docs with its own update command, named from the Phase 1 missing-handoff fact, and then run `make-blueprint setup` again. Its first lines tell completed, completed with kept conflicts, or stopped with nothing changed apart. It ends with the next useful action, such as restarting the agent tool so it loads the MCP server and then starting the intake stage. Normal output shows no block hashes, Store internals, connection keys or permanent record IDs, and the machine result carries the same meaning ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#setup-output)).
- [ ] t35: Register Make Blueprint's `setup` with the core so that the `make-kit setup` tool runs it with the agent tools the person chose there, with the same result as Make Blueprint's own `setup` with those choices ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#setup)).
- [ ] t36: Build the project update: `setup` run again in an installed project brings Make Blueprint's blocks and routers, conflicts included, the handoff line, and the skills and MCP entries for this project to the installed version. [Phase 3](03-storage-and-identity.md) adds the record schema upgrade step to this run ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#project-update)).

### Acceptance criteria

- A231: A second `setup --yes` with no change in between leaves `git status` of the fixture project clean and the Store block records unchanged.
- A232: For the same input, `setup --dry-run --json` output equals the `setup_plan` result, and the project is byte-identical after both.
- A233: With an existing `.mcp.json` that holds another server entry, `setup` writes only the `make-blueprint` entry, the other entry is byte-identical, and the entry's command is an absolute path to an executable that exists.
- A234: Codex config holds `[mcp_servers.make_blueprint]` with `args = ["mcp"]` and both connection variables, and the GitHub Copilot CLI entry holds `type: "local"` and `tools: ["*"]`.
- A235: With the network disabled, `setup --yes --agent claude-code,codex,copilot-cli` succeeds and installs the bundled skills.
- A236: Where symbolic links are refused, skills install as managed copies; a hand-changed installed skill produces a conflict with replace and keep; no installed skill folder holds a script file, and none has the name of a Make Docs skill folder.
- A237: Setup output fixtures for completed, completed with kept conflicts, and stopped with nothing changed each state their case in the first line, end with a next action, and hold no block hash, connection key or record `id`.
- A238: `make-kit setup` with Claude Code on a fresh fixture project produces the same file tree as `make-blueprint setup --agent claude-code --yes` on another fresh fixture.
- A259: Setup output beside a Make Docs stub whose block has no handoff line says that the Make Docs block has no handoff line and tells the person to run the Make Docs update command that Phase 1 confirmed, then `make-blueprint setup` again.

### Dependencies

- Stages 3 to 5 of this phase.
- [Phase 1](01-shared-core-adoption.md) Stages 3 to 5 for the block adapter, discovery, the handoff line and the shared choices.
- Repo-wide work in the [Make Kit Monorepo](../../../../../docs/designs/2026-10-30-make-kit-monorepo.md#5-the-make-kit-setup-tool) design: the `make-kit setup` tool and the core call it uses.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: Stage 8 holds the review of real first-run output. Here the agent checks the output fixtures against t34. To be recorded at closeout.
- Optional experience handoff: run `make-blueprint setup --dry-run` in a scratch project, then `make-blueprint setup`, and notice whether the output tells you what changed, which agent tools it set up, and what to do next. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A231` to `A238` and `A259` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A231` to `A238` and `A259` pass.

## Stage 7 - Update and Uninstall

### Tasks

- [ ] t37: Build `update` as tool update only (Q-009). It finds how Make Blueprint was installed: for npm, pnpm or bun it runs that manager's update command and reports the result; for a package runner it says nothing is installed; for a signed single file, or a source it cannot tell, it changes nothing and names the exact steps. It never guesses the package manager, upgrades the machine Store's own schema while keeping its data, changes no project file, and names `make-blueprint setup` as the command that brings each project to the new version ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#tool-update)).
- [ ] t38: Build `setup remove` as project uninstall (Q-003, Q-004). It stops on malformed tags like `setup`, takes out Make Blueprint's blocks through the Phase 1 adapter, takes out the MCP entries and skills it installed for this project while keeping and reporting a changed skill, takes out unchanged local system doc copies, takes out a folder it created only when the folder is empty, and drops its Store installation records. It keeps `blueprint/sources/`, `blueprint/records/`, `blueprint/exports/`, `.make/blueprint/config.yaml`, conflict copies, `.make/config.yaml` and `.make/personas.yaml`. It asks Make Docs, when present, to refresh its root block, and its output lists what it took out, what it kept, and why ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#project-uninstall)).
- [ ] t39: Build `uninstall` as tool uninstall. It takes the CLI off the machine through the package manager that installed it; for a signed single file or an unknown source it changes nothing and names the file to delete. It keeps `~/.make/blueprint/` unless `--remove-store` is given, changes no project folder, and reports each machine-scope MCP entry and skill folder that still refers to Make Blueprint with how to take it out ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#tool-uninstall)).

### Acceptance criteria

- A239: After `update` in a set-up fixture project, the project tree is byte-identical, and the output names `make-blueprint setup`.
- A240: `update` from a signed-file install changes nothing in the install and prints the update steps.
- A241: After `setup remove --yes`, record, source, export and `.make/blueprint/config.yaml` files are byte-identical, `.make/config.yaml` and `.make/personas.yaml` still exist, and the output lists each kept item with its reason.
- A242: `uninstall --yes` without `--remove-store` leaves the machine folder in place, with `--remove-store` the machine folder is gone, and no project folder changes in either case.

### Dependencies

- Stage 6 of this phase.
- [Phase 1](01-shared-core-adoption.md) Stage 3 for block take-out.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads real `setup remove` and `update` output and records whether a person can tell which command changed the project and which changed only the tool, and what was kept and why. To be recorded at closeout.
- Optional experience handoff: run `make-blueprint setup remove --dry-run` in a set-up scratch project and notice whether the list of kept items matches what you expect to keep. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A239` to `A242` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A239` to `A242` pass.

## Stage 8 - Install Matrix and First-Run Review

### Tasks

- [ ] t40: Run the install matrix on fresh projects for the six cases in the install table: Make Blueprint alone, Make Docs alone, Make Docs then Make Blueprint, Make Blueprint then Make Docs, both then Make Blueprint's `setup remove`, and both then Make Docs' project uninstall. Each case runs with user text above, between and below the blocks, with Make Docs in its earlier layout and, once Make Docs ships it, its later layout, with no step beyond the tools' own `setup` and uninstall commands, and with a kit set up after another reading the shared choices ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#install-alone-or-together)).
- [ ] t41: Run the user-text round-trip through real commands: `setup`, a second `setup`, conflict, `update` and `setup remove` of each tool, in both install orders, comparing bytes ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#managed-blocks)).
- [ ] t42: Run the cross-version matrix case for R-002, with Make Docs on a core release other than the one Make Blueprint pins ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#rebuild-notes)).
- [ ] t43: Prepare and record the Human Experience Review of first-run `setup` output for four cases: Make Blueprint alone, beside Make Docs with both handoff lines, beside a Make Docs too old to write its line, and with a kept conflict. Record the observation, conclusion, limit and next action for each promise in `evidence.md` ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#setup-output)).

### Acceptance criteria

- A243: All six matrix cases pass in the earlier Make Docs layout, and each case's check confirms that the handoff lines appear and disappear as the install table states.
- A244: In the "Make Blueprint alone" case, no file under `docs/` exists, and the root block holds no handoff line.
- A245: The user-text round-trip leaves each fixture file that held user text before `setup` byte-identical after `setup remove` of both tools, and `update` touches no instruction file.
- A246: The cross-version case passes.
- A247: `evidence.md` holds the review of the four first-run cases with an observation, conclusion, limit and next action for each promise.

### Dependencies

- Stages 6 and 7 of this phase.
- A Make Docs release on the core that writes its handoff line and answers the refresh request, from repo-wide Step 0 in the [Make Kit Monorepo](../../../../../docs/designs/2026-10-30-make-kit-monorepo.md#11-order-of-work) design. Until it ships, the matrix runs the Make Docs cases against the Phase 1 stub and the too-old path, and those cases stay open.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing not used in this stage; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent records per-promise observations, conclusions, limits and next actions for the install-together and user-text promises from the real first-run output and the real files the matrix leaves. The review cannot claim a person's ease; it states what the output shows. To be recorded at closeout.
- Optional experience handoff: in a scratch project with Make Docs set up, run `make-blueprint setup`, open the root `AGENTS.md` or `CLAUDE.md`, and notice whether each tool's block names what the other owns and your own text is where you left it. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A243` to `A247` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the install-together and user-text promises are complete when `A243` to `A247` pass with a released Make Docs on the core; until then they stay partial with the open cases named.

## Stage 9 - npm Package and Signed Single Files

### Tasks

- [ ] t44: Build the npm package `@brucewaynedecoy/make-blueprint` with the binary `make-blueprint`, the pinned core, the CLI, the MCP server, the bundled skills, all system docs and the built-in converters as they exist, Node 24 or later, and no install script that downloads files. Run the publish pipeline as a dry run; [Phase 9](09-v1-import-and-release.md) publishes ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#npm-package)).
- [ ] t45: Build one single file for each Q-006 target, macOS on arm64 and x64, Windows on x64, and Linux on x64 and arm64, each holding the Node 24 runtime, the CLI, the MCP server, the pinned core, the bundled skills, all system docs and the built-in converters. Choose a build method that runs from the one file and unpacks no program to a temporary folder (R-005) ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#signed-single-files)).
- [ ] t46: Sign each file: macOS and Windows with the owner's code-signing certificates, and Linux with a method chosen and recorded in this stage, so a person can verify each signature with the platform's standard tools and macOS and Windows open the file under default security settings with no override ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#signed-single-files)).
- [ ] t47: Test each signed file in a clean container or virtual machine for its target with no Python and no Node: install the file, then run `--version`, `setup --yes` on a fresh project, and the MCP server with a scripted resource read ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#signed-single-files)).
- [ ] t48: Make `setup` run from the signed file write MCP entries that start that same file, and write a parity test that runs the same commands through the npm package and the signed file. Confirm that outside the project folder the signed file writes only to `~/.make/blueprint/`, the agent-tool files the person approved and the operating system's temporary folder for short-lived files that are not programs ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#signed-single-files)).
- [ ] t49: Write the offline and no-telemetry tests: every command works with the network blocked, no command makes a network request or sends usage data, crash reports or update checks, and no command, skill or converter starts Python, Node, a shell script or another interpreter ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#offline-no-telemetry-and-no-python)).

### Acceptance criteria

- A248: For each of the five targets, the build produces a signed file whose signature verifies with the platform's standard tool, and the chosen Linux method is recorded in the Stage 9 closeout.
- A249: In a clean environment for each target with no `python`, `python3` or `node` on the path, `--version`, `setup --yes` on a fresh project and the MCP server with a scripted resource read all succeed.
- A250: A process audit during each clean-environment run records no child process for Python, Node, a shell or another interpreter, and no executable file written to the temporary folder.
- A251: `setup` run from a signed file writes MCP entries whose command is that file's absolute path.
- A252: The parity test gives identical `--json` results from the npm package and the signed file for the same commands, apart from fields the result schema marks as specific to one surface.
- A253: With the network blocked at the operating-system level, the command test suite passes, and the network monitor records no connection attempt.
- A254: `npm pack --dry-run` shows no install script, and the package declares Node 24 or later.

### Dependencies

- Stages 1 to 7 of this phase.
- [Phase 1](01-shared-core-adoption.md) Stage 1 for the release-build check, which every signed build runs.
- Code-signing certificates for macOS and Windows from the owner.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing starts in Stage 10 on these builds; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none in this stage. Stage 10 measures these builds.
- Human Experience Review: the agent follows the install steps for one signed file as a person would, from download to `setup`, and records for the one-file promise whether any step needs Python, Node, an override of platform security or a network connection. The locked-down machine check stays with [Phase 9](09-v1-import-and-release.md). To be recorded at closeout.
- Optional experience handoff: download the signed file for your machine, verify its signature, and run `make-blueprint setup` in a scratch project. Notice whether anything asks you to install Python or Node. Feedback is welcome and optional.
- Explicit human acceptance gate: none.
- Evidence report: the `A248` to `A254` section of `evidence.md` in this backlog folder, with the Linux signing method. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the one-file promise is partial at this stage close; it completes when Phase 9 runs all seven workflow stages in the clean container on the release build.

## Stage 10 - Start-Time Characterization

### Tasks

- [ ] t50: Before the first measurement, write the start-time profile with the next free `PERF-###` ID in its own characterization record under `docs/assets/project/performance/`, from `make-docs://system/template/performance-evidence-profile.md`. Record base action `none`, applicability `characterize-now`, target class `characterization-baseline`, the protected outcome and decision informed from 07, this work phase as the canonical owner and the repository owner as approver, the supported scope (start of the CLI and of the MCP server from the signed files), the environment, workload and measurement protocol, finite limits for passes, correction attempts, review cycles, elapsed time, compute and spend, the stop rules, and the outcome rules. State no target ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#start-time-performance)).
- [ ] t51: Validate the fixture and the measurement seam before measuring: the Stage 9 clean-environment tests pass on the build under test, and the measurement starts and stops where the profile says ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#start-time-performance)).
- [ ] t52: Render a finite execution packet from the profile, with build, environment, workload, measurement, correctness, budget, fingerprint, reuse, stop and evidence fields, and run the characterization inside the profile's budget on the first signed single-file build. Write the result record, with the observed distribution, uncertainty, fingerprint, budget ledger and one outcome, and link the packet and result from the Stage 10 closeout ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#start-time-performance)).
- [ ] t53: Run `make-docs run performance evidence validate --target-root kits/make-blueprint` from the repository root after the profile and the result exist, and route the owner's decision on whether a start-time target is needed to R-004 ([07 Installation and Distribution](../../prd/07-installation-and-distribution.md#start-time-performance)).

### Acceptance criteria

- A255: The profile file exists, in git history, before any start-time result is recorded, names `characterization-baseline`, and states no target.
- A256: The profile names a finite limit for each of passes, correction attempts, review cycles, elapsed time, compute and spend, and a stop rule for budget exhaustion and diminishing return.
- A257: The result record binds the profile ID, version and digest, the build, the evidence fingerprint and the budget ledger, and records exactly one outcome from `pass`, `fail`, `revise`, `blocked` and `waived`.
- A258: The performance evidence validator exits zero with `status: passed`.

### Dependencies

- Stage 9 of this phase for the first signed single-file build.
- [Phase 9](09-v1-import-and-release.md) runs this profile again on the release build, inside the profile's remaining or newly authorized budget.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing active as a `characterize-now` baseline; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: base action `none`; applicability `characterize-now`; profile, packet, result, fingerprint, budget used and remaining, outcome and supported scope to be recorded at closeout. No finding, waiver or expiry is planned. The gate rejects a missing, invalid, non-comparable or unrun characterization.
- Human Experience Review: not applicable. The characterization is indirect evidence for the decision in R-004 and makes no human-outcome claim.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none. The owner's decision on a start-time target is a product decision routed to R-004, not a gate on this stage.
- Evidence report: the `A255` to `A258` section of `evidence.md` in this backlog folder, linking the profile, packet and result. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the phase closes when `A201` to `A258` pass, with the install-together promise partial only for Make Docs cases that wait on a Make Docs release, and the one-file promise partial until Phase 9.
