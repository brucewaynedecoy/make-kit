---
title: "Make Kit Monorepo"
kind: "design"
status: "draft"
follow_on:
  route: "baseline-plan"
  next_prompt: "make-docs://system/prompt/designs-to-plan.prompt.md"
  why: "First design for the repo-wide project, which has no plan or PRD yet."
  coordinate_handoff: "Not applicable for baseline-plan. The planner assigns the first repo-wide coordinate."
---

# Make Kit Monorepo

## Purpose

This design records the decision to make this repository the `make-kit` monorepo: one home for every Make Kit product (called a kit), the shared core they use, and a thin setup tool that installs any mix of kits. It captures the decisions reached in the follow-up design interview held on 2026-10-30. It covers the repository layout, how Make Docs comes into the repository, the shared core, the `make-kit` setup tool, shared setup choices, package names, the pattern for several docs roots in one repository, and the temporary workarounds that pattern needs. Each kit's own product design stays in that kit's own docs.

## Context

This repository started as the clean-room home for BuildOS v2, now named Make Blueprint. Its first design, [Make Blueprint v2 Architecture](../../kits/make-blueprint/docs/designs/2026-10-29-make-blueprint-v2-architecture.md), placed the shared TypeScript core in the make-docs monorepo. That choice had a known cost: a change to the core needed a Make Docs release before Make Blueprint could use it.

While working through the open questions of that design, the owner proposed a single home for the whole stack, plus one setup tool that lets a person choose kits and agent tools once and then installs each chosen kit. The owner also asked that a kit set up second should already know the choices made for the first.

Facts that shape this design:

- This repository has no commits and no remote, so renaming it and changing its layout costs nothing now.
- Make Docs is a live product. Its repository has 654 commits, a GitHub remote, two CI workflows (`platform-safety.yml` and `publish-npm.yml`) and the npm package `@brucewaynedecoy/make-docs`.
- Make Docs always uses `<project>/docs` as the docs root, and config cannot rename it. Nested Make Docs projects in one git repository work: the Store identifies each project by the `projectId` in its config, and setup never writes outside its own target folder.
- Make Docs has weak spots with nested projects. Some commands search upward until they find a folder with `docs/work` or `.git`, so a nested project without `docs/work` resolves to its parent. The MCP server uses the folder it started in unless a call passes `targetRoot`. Make Docs does not check `../` links that leave a project. No Make Docs test covers nested projects.
- The owner has no baseline yet for how agents behave in a repository with several docs roots.

## Human Experience Intent

Impact: `direct`

Affected humans: `maintainer` people and agents who build and release kits in this repository; `user` people who install and set up one or more kits in their own projects, and the agents that act for them.

Human goal or effect: A maintainer builds, tests and releases every kit from one place, and an agent dropped into the repository finds the right project's docs without help. A user sets up any mix of kits with one set of choices.

Experience promises:

- An agent that starts at the repository root can tell which project a task belongs to and reaches that project's routers and docs.
- A person who has set up one kit in a project sees the earlier agent-tool choices already selected when setting up another kit.
- A person runs `make-kit setup`, chooses kits and agent tools once, and gets each chosen kit set up. Each kit can still be set up alone with its own CLI.
- A Make Docs user sees no change to the npm package name or the install commands after the switch point.
- Each temporary workaround stays visible, numbered and owned until it is removed.

Complexity kept out of the human path:

- Nested project configs, one `projectId` per kit, and the core package boundary.
- How the setup tool calls each kit's own setup.
- The mechanics of the temporary workarounds, beyond the short rules in the root map.

Evidence required:

- A routing check: agents started at the repository root with kit tasks and repo-wide tasks land in the right docs. The results become the baseline that a future monorepo setup option needs.
- An install test of `make-kit setup` with two kits that confirms the shared choices are read and written.
- A Make Docs release from this repository's CI that publishes the same package name, followed by an install check from npm.
- The root register lists O-001 to O-005 as open until each matching Make Docs fix ships.

## Performance Evidence Candidates

| Candidate | Base maintenance action | Performance applicability | Protected outcome | Decision informed | Canonical owner or next record |
| --- | --- | --- | --- | --- | --- |
| None for this design | `none` | `not-needed` | None | None | None |

## Decision

### 1. One repository for the whole stack

- This repository is the `make-kit` monorepo. The owner renames its folder from `buildos` to `make-kit` after the current session, and creates its GitHub repository later.
- No CLI is named `make`, because that name clashes with the standard `make` build tool.
- Every kit stays a separate product. Each kit has its own npm package and its own CLI, and installs and runs alone. The first Northstar principle of the Make Blueprint design (separate or together) applies to every kit.

### 2. Layout

```text
make-kit/
  AGENTS.md, CLAUDE.md      monorepo map (hand-written) plus the Make Docs block
  docs/                     repo-wide docs: core, setup tool, shared rules
  packages/core/            the shared core
  packages/kit/             the make-kit setup tool
  kits/make-docs/           Make Docs: its packages, its docs/, its routers
  kits/make-blueprint/      Make Blueprint: its packages, its docs/, its routers
```

### 3. How Make Docs comes in

- In Step 0, Make Docs packages and files are copied into `kits/make-docs/`, with no git history.
- From that switch point on, all Make Docs work happens in this repository. The old `make-docs` repository is frozen: its README points to the new home, and it stays readable for its history.
- The npm name `@brucewaynedecoy/make-docs` stays the same. Releases come from this repository's CI.
- Until the switch point, the old repository stays the release source.

### 4. Shared core

- The shared core lives in `packages/core/`. It is pulled out of the copied Make Docs code after the copy, inside this repository.
- Its boundary is the one the owner accepted for Make Blueprint: layout and paths, resource reading, the MCP server and its profiles, the Store base, agent-tool setup, managed blocks, tool discovery, and `update` and uninstall, with no product content.
- The core is published as its own package. Each kit release pins one exact core version, and a release build fails on an unpublished core.

### 5. The `make-kit` setup tool

- `make-kit setup` does four things: the person chooses kits, the person chooses agent tools, the tool runs each chosen kit's own setup, and the tool saves the choices in `.make/config.yaml`.
- It can set up all kits or one kit. It stays thin: it holds no kit logic and calls each kit's setup through the core.
- It ships with Make Blueprint v2.0.

### 6. Shared setup choices

- Kits share one project file, `.make/config.yaml`, for choices that every kit needs, such as the selected agent tools.
- A kit set up later reads that file, so earlier choices are already selected. A changed choice is written back for every kit.
- Settings for one kit stay in that kit's own file, `.make/<kit>/config.yaml`.
- The core holds the code that reads and writes the shared file.
- People and roles for every kit live in one more shared file, `.make/personas.yaml`. The core reads and writes it, and each kit only reads it. Each entry has a slug, a name, a primitive (`user` or `maintainer`, and either can be a person or an agent), a kind (`person`, `team`, `organization` or `agent`) and the kits it is enabled for. There is no `agent` primitive.
- The core creates `.make/personas.yaml` on its first write. The built-in `user` and `maintainer` entries stay implicit defaults, as in Make Docs today. A slug is unique across the whole file, whatever its primitive, and the core refuses a clash. The core's write to the file is part of the same journaled change as the kit operation that asked for it, so a crash never leaves the file and the kit's records out of step. See [Q-077](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-077-shared-people-and-roles-file-details) in the Make Blueprint register.
- Make Docs' own Persona list moves from `.make-docs/config.yaml` into `.make/personas.yaml`. This is a Make Docs change, made in the monorepo. The entry format must still hold what Make Docs needs today: a label and a description, the built-in `user` and `maintainer` entries, and the reserved slugs.
- Make Blueprint uses the same file: `owners` and `stakeholders` point to `maintainer` entries, and `audience` points to `user` entries. Client roles found in sources stay Make Blueprint persona records, and the core adds an entry when one is approved. See [Q-072](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-072-shared-people-and-roles-file) in the Make Blueprint register.

### 7. Package names and home folders

- npm packages: `@brucewaynedecoy/make-kit`, `@brucewaynedecoy/make-core`, `@brucewaynedecoy/make-blueprint` and `@brucewaynedecoy/make-docs`.
- Each kit's machine folder can be moved with its own setting, such as `MAKE_BLUEPRINT_HOME` beside the existing `MAKE_DOCS_HOME`.

### 8. Several docs roots in one repository

- The repository root and each kit folder are separate Make Docs projects. The root keeps its `.make-docs/config.yaml` and its `docs/` for repo-wide docs. Each kit has its own `.make-docs/config.yaml` (with its own `projectId`), its own `docs/` and its own routers.
- The root `AGENTS.md` and `CLAUDE.md` carry a hand-written monorepo map outside the Make Docs block. The map lists each kit, its folder and its docs, and tells agents to use a kit's own routers for kit work and the root `docs/` for repo-wide work.
- Kit design, plan, PRD and work docs live in `kits/<kit>/docs/`. The root `docs/` holds only repo-wide docs.

### 9. Temporary workarounds as deferred obligations

Each workaround is a deferred obligation (owed work with a stable `O-###` number) in the root PRD register, which is created with the root PRDs. Each obligation names its owner (the repository owner), its trigger (the Make Docs fix shipping), and its exit criteria (the workaround is removed from the root map, from kit setup and from the validation steps). The root map labels each workaround as temporary and names its number. Each matching fix goes into the Make Docs backlog as a work item that links to the same number.

| Number | Workaround | Make Docs fix that removes it |
| --- | --- | --- |
| O-001 | Every kit keeps a `docs/work/` folder so the upward search stops at the kit | The upward search stops at the nearest `.make-docs/config.yaml` |
| O-002 | Run kit commands from the kit folder, or pass `--repo-root` or `--target-root` | Every command resolves the nearest project from the working folder |
| O-003 | Pass the kit folder as `targetRoot` on every Make Docs MCP call for a kit | The MCP server resolves the project from a path argument or the nearest project config |
| O-004 | Check `../` links between projects by hand during validation | The link checks validate links that leave a project and land in another known project |
| O-005 | Check a kit's backlog with `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root kits/<kit>`, because the snapshot and the `backlog_snapshot` MCP tool fail with `operation-error` once the repository has git history | The snapshot takes a work record's last-updated time from git history when the git root sits above the project. This fix comes after Make Docs moves into `kits/make-docs/`. |

Cleanup when a fix ships: the numbered list in the root `AGENTS.md` and `CLAUDE.md` names each workaround by its number, and this table holds the records until the root register exists. When the root register is created, it takes O-001 to O-005 from this table, with the owner, trigger and exit criteria above. The Make Docs work item for each fix links its number, deletes the matching item from both root files, and marks the obligation `Fulfilled`. O-005 is fulfilled when `make-docs run work backlog snapshot --target-root kits/make-blueprint` exits 0 from the repository root without `GIT_DIR`.

### 10. Monorepo as a setup option

Turning "single project or monorepo" into a setup option for Make Kit, Make Docs or Make Blueprint is deferred. This repository is the test bed. The routing check in the evidence list builds the baseline, and the option gets its own design once that baseline exists.

### 11. Order of work

1. Step 0: copy Make Docs into `kits/make-docs/`, set up its CI here, pull the core out into `packages/core/`, run Make Docs on the core, and pass the switch point.
2. Build the `make-kit` setup tool and the shared setup choices, including `.make/personas.yaml` and the Make Docs change that moves its Persona list there.
3. Make Blueprint v2.0 follows its own revised plan, which depends on Step 0.

## Alternatives Considered

| Alternative | Why it was not chosen |
| --- | --- |
| Keep this repository for Make Blueprint only, with the core in the make-docs monorepo | It keeps the release delay between the core and Make Blueprint, and it leaves the setup tool without a natural home. |
| Move Make Docs with its full git history | More work for little gain. The old repository keeps the history and stays readable. |
| Keep the old `make-docs` repository live beside the copy | Two live copies drift apart. One switch point keeps one source of truth. |
| One shared PRD namespace with a numbered folder for each product | Make Docs keeps one active PRD namespace per docs root, so product authorities would mix, and agents would mix kit work with repo work. |
| Build the monorepo setup option now | There is no baseline yet for how agents behave in a repository with several docs roots. |
| Name the setup CLI `make` | It clashes with the standard `make` build tool. |
| A separate people and roles list for each kit | Two lists drift apart. One shared file keeps one source of truth. |

## Consequences

### What gets better

- A change to the core and the kits that use it can land in one change, with no release delay between repositories.
- The setup tool and the shared setup choices have one natural home.
- Every kit follows one pattern for folders, routers, the Store, the CLI shape and MCP profiles.
- Kits installed together can be checked together. Make Blueprint records can link to any Make Docs doc, such as a design, plan, PRD, work item or guide, so deterministic checks could measure how well the docs cover the Blueprint data. One example: requirement records link to PRDs, and those PRDs link to the work that builds them, so a check could report which requirements are planned, built, or missing. This is an opportunity, not a committed capability.

### Trade-offs and risks

- Step 0 grows. It now includes copying Make Docs, rebuilding its CI and release flow here, and the switch point. A broken release at the switch point would hurt live Make Docs users, so the switch needs a dry-run publish and an install check first.
- Make Docs tests or scripts that assume they run at the repository root may need changes to run from `kits/make-docs/`.
- The nested-project weak spots stay until Make Docs fixes them. The workarounds are tracked as O-001 to O-005 so they do not become permanent.
- Agents may still pick the wrong project in a repository with several docs roots. The routing check exists to find out.

### Left for planning

- The exact Step 0 sequence, including how the Make Docs CI moves and how the switch point is tested.
- The npm workspace setup at the repository root.
- The repo-wide PRD set: which parts of the Make Blueprint PRDs on the shared core, the setup tool and the `.make/` rules move up to repo-wide PRDs.
- A repo-wide Kit Conventions PRD: the rules every kit follows, written from the Make Docs code during Step 0. It covers the CLI shape (the seven top-level groups, `run <domain> <verb>`, outcomes and exit codes, `--json` and `--dry-run`), the MCP server, its profiles and `allowWrite`, system resources served by URI compared with project records, routers and managed blocks with progressive disclosure, the shared `.make/` files compared with each kit's `.make/<kit>/` config, the `~/.make/<kit>/` machine folders with a `MAKE_<KIT>_HOME` setting for each kit, and the rule that project knowledge lives in git while the Store holds only operational state. The Make Blueprint PRDs that state these rules today, 05 to 09, then link to it.
- The routing check method and where its results are recorded.
- The Make Docs Persona move: how the entry format holds the Make Docs label, description, built-in entries and reserved slugs, and how a project that keeps Personas in `.make-docs/config.yaml` moves to `.make/personas.yaml`.

## Design Lineage

- Update Mode: `new-doc-related`
- Prior Design Docs: [Make Blueprint v2 Architecture](../../kits/make-blueprint/docs/designs/2026-10-29-make-blueprint-v2-architecture.md)
- Reason: This design moves the shared core, Step 0 and the setup tool from the Make Blueprint design to the repository level, and adds the setup tool, shared choices and the docs-root pattern. The Make Blueprint design is updated in place to point here.

## Intended Follow-On

- Route: `baseline-plan`
- Next Prompt: [designs-to-plan.prompt.md](make-docs://system/prompt/designs-to-plan.prompt.md). Read `make-docs://system/prompt/designs-to-plan.prompt.md` with `make-docs resource read`.
- Why: The repo-wide project has no plan or PRD yet, so its planning starts a new baseline: Step 0, the shared core, the setup tool and the shared rules.
- Coordinate Handoff: Not applicable for `baseline-plan`. The planner assigns the first repo-wide coordinate.
