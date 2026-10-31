---
title: "Phase 1: Shared Core Adoption"
kind: "work"
status: "active"
coordinate: "W1 R1 P1"
source:
  type: "prd"
  path: "docs/prd/05-ecosystem-and-shared-core.md"
---

# Phase 1: Shared Core Adoption

## Purpose

This phase makes Make Blueprint a user of the published shared core, `@brucewaynedecoy/make-core`, so it never carries its own copy of core behavior. It creates the Make Blueprint package, pins one exact core version, and builds the thin adapters that pass Make Blueprint's names, tags and content to the core's managed blocks, tool discovery, handoff line and shared project files.

This phase builds no core code. It depends on repo-wide work outside this backlog, set out in the [Make Kit Monorepo](../../../../../docs/designs/2026-10-30-make-kit-monorepo.md#11-order-of-work) design: Step 0, which pulls the core into `packages/core/` and runs Make Docs on it, and the next step, which builds the `make-kit` setup tool and the shared `.make/config.yaml` and `.make/personas.yaml` support in the core.

## Overview

Every later phase builds on what this phase proves. The package pin and the release-build check keep a Make Blueprint release from shipping with a workspace link or an unpublished core. The tool identity makes every core part write Make Blueprint's own tags, folders and URI scheme. The block adapter keeps a person's text in `AGENTS.md` and `CLAUDE.md` byte for byte while two tools share the file. Tool discovery and the handoff line let an agent route work to the right tool with no extra setup. The shared-file adapters let a kit set up second see the choices that the first kit already made.

[Phase 2](02-cli-and-packaging.md) puts these adapters behind `setup`, `setup remove` and the routers, and runs the full install matrix with real commands. [Phase 6](06-extraction-and-review.md) and [Phase 9](09-v1-import-and-release.md) use the shared people and roles adapter when an approval or the v1 import asks the core to write `.make/personas.yaml`.

## Human Experience Outcome

- Impact and governing promise or preserved boundary: `direct`. Two promises from the [plan overview](../../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md#human-experience-propagation) name this phase. The first is "install Make Blueprint alone, Make Docs alone, or both; handoff works with no extra setup", owned by [05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#separate-or-together) with the commands in [07 Installation and Distribution](../../prd/07-installation-and-distribution.md#install-alone-or-together). The second is "user text in `AGENTS.md` and `CLAUDE.md` survives setup, update and uninstall of either tool", owned by [06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#managed-blocks). The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind both.
- Intended human outcome: a person who opens a root instruction file after either tool writes or leaves it finds their own text exactly where they left it, finds one handoff line in each tool's block when both tools are present and none when one is absent, and is never asked to edit a config file to make the tools work together. A person who sets up a second kit sees the agent tools that the first kit chose already selected.
- Human-facing surface or indirect effect: root router blocks in `AGENTS.md` and `CLAUDE.md`, the handoff line inside Make Blueprint's block, and the shared `.make/config.yaml` choices. The command output that shows these results arrives in Phase 2; this phase proves the file results that the output reports.
- Implementation work: Stage 1 pins the core. Stage 2 passes Make Blueprint's identity to the core and guards Make Docs folders. Stage 3 builds the block adapter and its round-trip suite. Stage 4 builds discovery, the handoff line and the refresh request. Stage 5 builds the shared-file adapters and the Make Docs fallback tests.
- Evidence source or testing type selected under current authority: Automated Implementation Testing, as the plan overview selects: byte-for-byte round-trip tests with user text above, between and below both blocks, and a block-level two-tool matrix that includes a kit set up after another reading the shared choices. The Human Experience Review of first-run setup output happens in Phase 2, where the output exists.
- Executor: the implementing coding agent writes and runs the tests in CI, and records the Human Experience Review of the file results.
- Accepted obligation or deferral route: none. Both promises close in Phase 2 with the full install matrix.

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | active | Unit tests of each core adapter, the byte-for-byte block round-trip suite, the malformed-tag fixtures, the concurrent-write test, the cross-version test, the block-level two-tool handoff matrix with a Make Docs stub, and the Make Docs fallback tests. They decide whether Phase 2 can build `setup` and `setup remove` on these adapters. The acceptance criteria in each stage are the decision record. |
| Performance Testing | not-needed-now | No performance candidate sits in this phase. The two current candidates in the plan overview belong to [Phase 2](02-cli-and-packaging.md) and [Phase 3](03-storage-and-identity.md). |
| Guided Progress Review | not-needed-now | No current decision needs a guided review. The person-facing output of these adapters arrives in Phase 2. |
| Unassisted Goal Testing | not-needed-now | No PRD needs it for this phase, and no public path here needs proof of discoverability without help. |

No performance candidate sits in this phase, so it records no performance lifecycle fields.

Human Experience Review stays separate from these four testing types. In this phase the agent inspects the real instruction files that the round-trip and matrix tests leave behind, and records its observations, conclusions and limits for both promises.

## Source PRD Docs

- [05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md)
- [06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md)
- [07 Installation and Distribution](../../prd/07-installation-and-distribution.md)
- [02 Architecture Overview](../../prd/02-architecture-overview.md)

## Source Obligations, Scenarios, And Findings

- Obligations: none. This phase consumes no `O-###` record.
- Risks this phase addresses: [R-001: Core Release Friction](../../prd/03-open-questions-and-risk-register.md#r-001-core-release-friction), [R-002: Two Core Versions in One Project](../../prd/03-open-questions-and-risk-register.md#r-002-two-core-versions-in-one-project) and [R-003: Both Tools Write One Root File at Once](../../prd/03-open-questions-and-risk-register.md#r-003-both-tools-write-one-root-file-at-once).
- Decisions carried: [Q-002](../../prd/03-open-questions-and-risk-register.md#q-002-handoff-line-refresh-mechanism), [Q-005](../../prd/03-open-questions-and-risk-register.md#q-005-broken-tags-in-a-shared-instruction-file), [Q-013](../../prd/03-open-questions-and-risk-register.md#q-013-exact-core-version-pin), [Q-060](../../prd/03-open-questions-and-risk-register.md#q-060-shared-setup-choices-across-kits), [Q-072](../../prd/03-open-questions-and-risk-register.md#q-072-shared-people-and-roles-file) and [Q-084](../../prd/03-open-questions-and-risk-register.md#q-084-small-command-and-status-defaults-found-while-writing-the-work-backlog), for the fix that the missing-handoff fact names.
- Scenarios: none.
- Findings: none.

## Stage 1 - Core Dependency Line

### Tasks

- [ ] t1: Create the Make Blueprint TypeScript package in `kits/make-blueprint/` as `@brucewaynedecoy/make-blueprint`, with the binary name `make-blueprint`, `engines.node` set to Node 24 or later, and a dependency on `@brucewaynedecoy/make-core` at one exact published version with no range operator ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#core-dependency-line)).
- [ ] t2: Configure development builds and tests to resolve the core through the npm workspace link to `packages/core/`, so kit work can start while a core release is pending ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#core-dependency-line)).
- [ ] t3: Write the release-build check that fails the npm publish build and every signed single-file build when the core resolves to a workspace link or to a version that is not published, and that names the cause ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#core-dependency-line)).
- [ ] t4: Write the build-info module that reads, from the installed package, the Make Blueprint version and the core version it contains, for `make-blueprint --version` in Phase 2 and for tests ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#core-dependency-line)).
- [ ] t5: Write a lint check that fails when kit code imports core code by a relative path into `packages/core/`, imports a core path that the core package does not export, or holds a copied or patched core module ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#shared-core)).

### Acceptance criteria

- A101: The kit `package.json` names `@brucewaynedecoy/make-core` with an exact version, and a test fails on a fixture `package.json` that uses a range such as `^` or `~`.
- A102: The release-build check exits nonzero and names the workspace link when the core resolves through it, exits nonzero and names the version when the pinned version is not published, and exits zero with the pinned published version.
- A103: A development build resolves the core through the workspace link, and the kit test suite passes on it.
- A104: A test reads the Make Blueprint version and the core version from the installed package, and the core version equals the pinned version in `package.json`.
- A105: The lint check fails on fixture files that import `../../packages/core/src/managed-block` and a non-exported core path, and passes on the kit source tree.

### Dependencies

- Repo-wide Step 0 in the [Make Kit Monorepo](../../../../../docs/designs/2026-10-30-make-kit-monorepo.md#4-shared-core) design: a published `@brucewaynedecoy/make-core` from `packages/core/`. Until it is published, work uses the workspace link and no release build passes the check in t3.
- No earlier phase in this backlog.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed-now`; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none. No performance candidate applies to the package pin.
- Human Experience Review: not applicable to this stage. The pin has no person-facing surface until `--version` in Phase 2.
- Optional experience handoff: not applicable. No person-facing surface changes in this stage.
- Explicit human acceptance gate: none.
- Evidence report: the `A101` to `A105` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A101` to `A105` pass. R-001 stays open until the pinned core is published before v2.0 release work starts.

## Stage 2 - Tool Identity and Make Docs Folder Guard

### Tasks

- [ ] t6: Define Make Blueprint's tool identity and pass it to every core part it calls: the CLI name `make-blueprint`, the block tags `<!-- make-blueprint:begin -->` and `<!-- make-blueprint:end -->`, the project folder `.make/blueprint/`, the machine folder `~/.make/blueprint/`, the resource URI scheme `make-blueprint://`, and the MCP server name `make-blueprint` ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#shared-core)).
- [ ] t7: Keep all product content in the kit: router and block text, system docs, skills and the `make-blueprint://system/<type>/<path>` scheme live in kit folders and reach the core only as call inputs ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#shared-core)).
- [ ] t8: Build one write guard that every Make Blueprint write passes through. It refuses any path under `docs/`, `.make-docs/` or `.make/docs/`, and any read or write in the Make Docs Store folders `~/.make-docs/` and `~/.make/docs/` ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#separate-or-together)).
- [ ] t9: Find Make Docs folders only through the core's layout part, so both Make Docs layouts (`.make-docs/` and `.make/docs/`) work, and write a lint check that fails on a hard-coded `.make-docs/` or `.make/docs/` literal outside the layout adapter ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#rebuild-notes)).

### Acceptance criteria

- A106: A test runs the core's managed-block, layout and resource parts with the Make Blueprint identity, and every written tag, folder and URI comes from that identity: the block starts with `<!-- make-blueprint:begin -->` and ends with `<!-- make-blueprint:end -->`, each on its own line with no attributes, and no output path contains `make-docs`.
- A107: The write guard refuses writes to `docs/a.md`, `.make-docs/a.md`, `.make/docs/a.md` and a path under a fixture `~/.make-docs/`, and a byte comparison of the fixture trees shows nothing changed.
- A108: The lint check fails on a fixture file with a hard-coded `.make-docs/` literal and passes on the kit source tree.
- A109: On one fixture project in each Make Docs layout, the layout adapter finds the Make Docs project folder.

### Dependencies

- Stage 1 of this phase.
- Repo-wide Step 0 in the [Make Kit Monorepo](../../../../../docs/designs/2026-10-30-make-kit-monorepo.md#4-shared-core) design: core parts that take each tool's identity as input.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed-now`; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: not applicable to this stage. The guard has no person-facing output until Phase 2 reports a refused write.
- Optional experience handoff: not applicable.
- Explicit human acceptance gate: none.
- Evidence report: the `A106` to `A109` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A106` to `A109` pass.

## Stage 3 - Managed Router Blocks Through the Core

### Tasks

- [ ] t10: Build the block adapter on the core's managed-block part. When a file has no Make Blueprint block, it places the block at the bottom after one blank line; when the file is missing, it creates the file with only the block; when the block exists, it replaces only the text between its own tags. It keeps every byte outside the block, keeps the file's line endings, keeps block order and position, and never writes inside another tool's block ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#tags-and-placement)).
- [ ] t11: Write the same block text into both `AGENTS.md` and `CLAUDE.md` wherever one router location has both, with no `@AGENTS.md` import, no include syntax and no symbolic link between the two files ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#same-content-in-both-files)).
- [ ] t12: Keep block records in the Store through the core's Store base: for each managed file and project, the project-relative path, the SHA-256 hash of Make Blueprint's block body and the Make Blueprint version that wrote it, with no hash in the project folder ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#store-records-for-instruction-files)).
- [ ] t13: Build conflict handling. A block body that no longer matches its stored hash raises a conflict for that file. Reassert writes Make Blueprint's version and stores the new hash. Keep leaves the block as it is and writes the planned block to `.make/blueprint/conflicts/`. A run that cannot ask and has no explicit choice keeps the local block, writes the conflict copy, finishes its other work and reports each conflicted file with the command that resolves it. An edit outside the block, or inside the Make Docs block, is never a Make Blueprint conflict ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#block-hashes-and-conflicts)).
- [ ] t14: Build the malformed-tag stop. Before any instruction file changes, check every file the run will touch for malformed tags of either tool: a begin tag without an end tag, an end tag without a begin tag, an end tag before its begin tag, more than one pair, or a pair inside another tool's block. On any finding, change no file and name each file, line and problem. After a person fixes the tags, the same run works with no other repair step ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#malformed-tags)).
- [ ] t15: Build block take-out for project uninstall. Take out Make Blueprint's block with its tags and its separator line, and change nothing else. Take out a clean block; for an edited block, ask, and keep and report it when the run cannot ask. Delete the file only when nothing but whitespace is left. Never touch another tool's block, even in a file Make Blueprint created. Drop the block records from the Store ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#uninstall)).
- [ ] t16: Build safe writes. Hold the core's Store lock for the project from the read of the instruction files until the last write. Read each file again just before writing it, and plan again or stop and report the file when it changed. Replace each file in one step so a crash leaves the old file or the new one ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#safe-writes)).
- [ ] t17: Write the block round-trip suite with user text above, between and below both tools' blocks, using the Make Docs tags written through the core. It runs block write, a second block write, conflict with reassert and with keep, and block take-out of each tool, in both install orders, on LF and CRLF files, and compares bytes ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#managed-blocks)).
- [ ] t18: Write the concurrent-write test for R-003: a second writer changes the root file between Make Blueprint's read and its write ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#safe-writes)).
- [ ] t19: Write the cross-version test for R-002: run the round-trip suite with the Make Docs block written by the core release before the pinned one and by the pinned release ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#rebuild-notes)).

### Acceptance criteria

- A110: In the round-trip suite, a file that held user text before the block write equals its original bytes after block write and take-out, and a file that only the block write created is deleted.
- A111: For each of the five malformed-tag forms, with Make Blueprint tags and with Make Docs tags, the run changes no file, as a byte comparison shows, and its result names the file, the line number and the problem.
- A112: In the conflict fixtures, reassert replaces the block body and stores the new hash; keep leaves the block byte-identical and writes the planned block to `.make/blueprint/conflicts/`; a run that cannot ask and has no choice behaves as keep and its result lists each conflicted file with the resolving command.
- A113: An edit outside Make Blueprint's block and an edit inside the Make Docs block raise no conflict in the result.
- A114: After every test run, a search of the fixture project finds none of the stored block hashes, and the Store holds the path, hash and Make Blueprint version for each managed file.
- A115: Where one router location has both files, `AGENTS.md` and `CLAUDE.md` hold byte-identical Make Blueprint block text, neither holds `@AGENTS.md`, and neither is a symbolic link.
- A116: In the concurrent-write test, Make Blueprint does not overwrite the changed file, its result names the file, and the other writer's text is still in the file.
- A117: The round-trip suite passes when the Make Docs block comes from the earlier core release and from the pinned release.

### Dependencies

- Stage 2 of this phase.
- Repo-wide Step 0 in the [Make Kit Monorepo](../../../../../docs/designs/2026-10-30-make-kit-monorepo.md#4-shared-core) design: the core's tag-aware managed-block part, with the uninstall fix that takes out only the calling tool's block.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed-now`; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent opens the instruction files that the round-trip suite leaves after each step and records, for the user-text promise, whether the person's text sits where they left it and whether each block reads as one tool's content. To be recorded at closeout.
- Optional experience handoff: not applicable. A person reaches these results through `setup` in Phase 2, which holds the handoff.
- Explicit human acceptance gate: none.
- Evidence report: the `A110` to `A117` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A110` to `A117` pass. The user-text promise stays partial until the Phase 2 matrix runs the real commands.

## Stage 4 - Tool Discovery and the Handoff Line

### Tasks

- [ ] t20: Call core tool discovery while planning block writes. It reports whether the Make Docs block is in the root `AGENTS.md` or `CLAUDE.md`, in either Make Docs layout, and whether `make-docs` can run on this machine, with its version. Discovery works offline, never installs, updates or starts a long-running copy of Make Docs, and never runs a Make Docs command that changes its install or packages ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#tool-discovery)).
- [ ] t21: Write Make Blueprint's handoff line inside its own root block when Make Docs is present, with router text such as "Make Docs owns `docs/`, including designs, plans, PRDs and the work backlog in `docs/work/`." Write exactly one line for each other tool that is present and none for an absent tool, with the same text in every root file that carries the block, and drop a stale line on the next block write when Make Docs is gone ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#handoff-line)).
- [ ] t22: Send the refresh request through the core to Make Docs after Make Blueprint writes its root block and after it takes the block out (Q-002). The request touches only the Make Docs root block in the current project and never runs `make-docs update` ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#handoff-line)).
- [ ] t23: Handle a Make Docs that is too old to take the request or to write its line: Make Blueprint still writes its own line and returns a missing-handoff fact that names the Make Docs block and tells the person to update Make Docs with its own update command and then run `make-blueprint setup` again, for `setup` output in Phase 2 and `project status` in Phase 8. Confirm the exact Make Docs update command that the fact names, as 05 asks this phase to do, and record it in 05 through the Make Docs PRD change process before this task closes ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#handoff-line)).
- [ ] t24: Write the block-level two-tool matrix with a Make Docs stub that answers the refresh request through the core: both install orders, both Make Docs layouts, user text in all three places, a stub too old to answer, and a project whose Make Docs block was deleted by hand ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#separate-or-together)).

### Acceptance criteria

- A118: With no Make Docs block and no `make-docs` on the machine, Make Blueprint's root block holds no handoff line and no text that tells agents to use Make Docs.
- A119: With Make Docs present in each layout, Make Blueprint's root block holds exactly one handoff line, and the line is identical in `AGENTS.md` and `CLAUDE.md`.
- A120: After a block write and after a block take-out in a project with the stub, the stub logs exactly one refresh request for the current project, and a process spy records no `make-docs update` and no package manager command.
- A121: Discovery runs with the network disabled and returns the stub's `make-docs` version.
- A122: With the too-old stub, the block write succeeds, Make Blueprint's own line is present, and the result carries the missing-handoff fact, which names the confirmed Make Docs update command and then `make-blueprint setup`. 05 Handoff Line names the same Make Docs command.
- A123: After the Make Docs block is deleted by hand, the next block write drops Make Blueprint's handoff line, and the user text in the file is byte-identical.

### Dependencies

- Stage 3 of this phase.
- Repo-wide Step 0 in the [Make Kit Monorepo](../../../../../docs/designs/2026-10-30-make-kit-monorepo.md#11-order-of-work) design: core tool discovery and the refresh request. A Make Docs release on the core that writes its own handoff line and answers the request; until it ships, the too-old path in t23 applies.

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed-now`; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent reads the root files from each matrix case and records, for the install-together promise, whether an agent reading one root file can tell which tool owns `docs/` and which owns `blueprint/`, and what the too-old case leaves for the person to do. To be recorded at closeout.
- Optional experience handoff: not applicable. Phase 2 holds the handoff for first-run setup.
- Explicit human acceptance gate: none.
- Evidence report: the `A118` to `A123` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the stage closes when `A118` to `A123` pass. The install-together promise stays partial until the Phase 2 matrix passes.

## Stage 5 - Shared Project Files Through the Core

### Tasks

- [ ] t25: Read the shared choices in `.make/config.yaml` through the core: the selected agent tools, the skill install choices and the optional project display `name`. Return them to `setup` as preselected choices, and write a changed choice back only through the core's write call, for every kit (Q-060, D-011) ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#project-config)).
- [ ] t26: Read `.make/personas.yaml` through the core's reader (Q-072). Each entry has a `slug`, a `name`, a primitive (`user` or `maintainer`), a kind (`person`, `team`, `organization` or `agent`) and its enabled kits, and the built-in `user` and `maintainer` entries stay implicit. Expose a lookup by slug for the slug checks in Phase 4 ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#shared-core)).
- [ ] t27: Extend the write guard from t8 so that no Make Blueprint code writes `.make/config.yaml` or `.make/personas.yaml` itself; only the core's own write calls reach them ([06 Project Layout and Instruction Files](../../prd/06-project-layout-and-instruction-files.md#project-tree)).
- [ ] t28: Map the core's refusal of a `.make/personas.yaml` write that would repeat a slug to a typed `blocked` fact that names the clashing slug and entry, for the approval in Phase 6 and the import in Phase 9 ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#shared-core)).
- [ ] t29: Write the shared-choices test with two kits: a `.make/config.yaml` written through the core by another kit's setup fixture is read as preselected choices, a changed choice is written back through the core, and a second kit fixture reads the change ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#separate-or-together)).
- [ ] t30: Write the Make Docs fallback tests for each row of the dependency table: a Make Docs that does not answer the refresh request, keeps its block on uninstall, asks its own setup questions again, or keeps its Personas only in `.make-docs/config.yaml`. In each case Make Blueprint completes its own work with the stated fallback and never blocks on the missing capability ([05 Ecosystem and Shared Core](../../prd/05-ecosystem-and-shared-core.md#make-docs-capabilities-make-blueprint-depends-on)).

### Acceptance criteria

- A124: With a fixture `.make/config.yaml` that selects Claude Code and Codex and sets `name: sample-project`, the adapter returns both agent tools as preselected and `sample-project` as the display name.
- A125: A change of the choice to Claude Code only is written to `.make/config.yaml` through the core, and the second kit fixture then reads Claude Code only.
- A126: A Make Blueprint write to `.make/config.yaml` or `.make/personas.yaml` outside the core is refused, and both files stay byte-identical.
- A127: With no `.make/personas.yaml`, the reader returns the implicit `user` and `maintainer` entries and creates no file; with a fixture file, a lookup by slug returns the entry's primitive and kind.
- A128: A fixture core refusal for a repeated slug becomes a `blocked` fact that names the slug and the entry, and no record and no shared file changes.
- A129: Each fallback test completes with Make Blueprint's block, handoff line and shared choices as the dependency table states, and no Make Blueprint step waits on Make Docs.

### Dependencies

- Stage 2 of this phase for the write guard.
- Repo-wide work after Step 0 in the [Make Kit Monorepo](../../../../../docs/designs/2026-10-30-make-kit-monorepo.md#6-shared-setup-choices) design: the core's reader and writer for `.make/config.yaml` and `.make/personas.yaml`, and the [`make-kit` setup tool](../../../../../docs/designs/2026-10-30-make-kit-monorepo.md#5-the-make-kit-setup-tool).

### Closeout Notes

- Four testing decisions: Automated Implementation Testing active; Performance Testing `not-needed-now`; Guided Progress Review `not-needed-now`; Unassisted Goal Testing `not-needed-now`.
- Performance evidence: none.
- Human Experience Review: the agent inspects the preselected choices that the two-kit test returns and records, for the install-together promise, whether a second kit would show the first kit's agent tools before the person chooses. To be recorded at closeout.
- Optional experience handoff: not applicable. Phase 2 shows these choices in `setup`.
- Explicit human acceptance gate: none.
- Evidence report: the `A124` to `A129` section of `evidence.md` in this backlog folder. To be recorded at closeout.
- Phase / capability status: to be recorded at closeout. Planned: the phase closes when `A101` to `A129` pass. Both promises stay partial until [Phase 2](02-cli-and-packaging.md) runs the install matrix with real commands.
