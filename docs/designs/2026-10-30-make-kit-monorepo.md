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

It also records the decisions of the Step 0 design interview, held from 2026-10-31 to 2026-11-01. Each of those decisions has a number from Q-001 to Q-026. The root register records each one as an item under `## Open Questions` with the same number, when the register is created with the root PRDs. The register keeps `D-###` numbers for confirmed drift.

## Context

This repository started as the clean-room home for BuildOS v2, now named Make Blueprint. Its first design, [Make Blueprint v2 Architecture](../../kits/make-blueprint/docs/designs/2026-10-29-make-blueprint-v2-architecture.md), placed the shared TypeScript core in the make-docs monorepo. That choice had a known cost: a change to the core needed a Make Docs release before Make Blueprint could use it.

While working through the open questions of that design, the owner proposed a single home for the whole stack, plus one setup tool that lets a person choose kits and agent tools once and then installs each chosen kit. The owner also asked that a kit set up second should already know the choices made for the first.

Facts that shape this design:

- This repository has a short git history and the GitHub remote `brucewaynedecoy/make-kit`. The remote is private today.
- Make Docs is a live product. Its repository has 659 commits, a public GitHub remote, two CI workflows (`platform-safety.yml` and `publish-npm.yml`) and the npm package `@brucewaynedecoy/make-docs`. Its latest release is 2.0.6, with the tag `v2.0.6`.
- npm trusted publishing for Make Docs is set to the repository `make-docs` and the workflow `publish-npm.yml`. npm makes provenance (a signed proof of which repository built a package) only from a public repository.
- Make Docs always uses `<project>/docs` as the docs root, and config cannot rename it. Nested Make Docs projects in one git repository work: the Store identifies each project by the `projectId` in its config, and setup never writes outside its own target folder.
- Make Docs has weak spots with nested projects. Some commands search upward until they find a folder with `docs/work` or `.git`, so a nested project without `docs/work` resolves to its parent. The MCP server uses the folder it started in unless a call passes `targetRoot`. Make Docs does not check `../` links that leave a project. The backlog snapshot fails when the git root sits above the project. No Make Docs test covers nested projects.
- npm cannot nest one workspace root inside another. The Make Docs file `packages/cli/tsup.config.ts` loads `yaml` by a fixed path, and that path breaks when the packages move.
- Some parts of the core are easy to pull out of Make Docs: resource reading, the managed-block library, and tool update and uninstall. Three parts are tangled with Make Docs product code: the operation registry, the Store migrations, and the code that merges and removes managed blocks. No Make Docs code finds another installed tool, so tool discovery is new code.
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
- A Make Docs user who installs from `latest` gets no version from the new release path until that path has passed on the `next` dist-tag.
- Each temporary workaround stays visible, numbered and owned until it is removed.

Complexity kept out of the human path:

- Nested project configs, one `projectId` per kit, and the core package boundary.
- How the setup tool calls each kit's own setup.
- The mechanics of the temporary workarounds, beyond the short rules in the root map.

Evidence required:

- A routing check: agents started at the repository root with kit tasks and repo-wide tasks land in the right docs. The method is in section 14. The results become the baseline that a future monorepo setup option needs.
- An install test of `make-kit setup` with two kits that confirms the shared choices are read and written.
- A Make Docs release candidate from this repository's CI on the `next` dist-tag, then the same version on `latest`, each followed by an install check from npm on Linux, macOS and Windows.
- The root register lists O-001 to O-005 as open until each matching Make Docs fix ships.

## Performance Evidence Candidates

| Candidate | Base maintenance action | Performance applicability | Protected outcome | Decision informed | Canonical owner or next record |
| --- | --- | --- | --- | --- | --- |
| None for this design | `none` | `not-needed` | None | None | None |

## Decision

### 1. One repository for the whole stack

- This repository is the `make-kit` monorepo, with the GitHub repository `brucewaynedecoy/make-kit`.
- The repository becomes public before the switch point (Q-004). Before that, a scan checks the files and the git history for secrets, client data and `/Users/` paths. The commit IDs from before the email rewrite (Q-022) must not open on GitHub. To drop them, the owner deletes the GitHub repository and creates it again with the same name while it holds only `main` (Q-026). The new repository stays private until the public step.
- One root MIT `LICENSE` covers the whole Make Kit stack: the core, the setup tool and every kit (Q-018). `kits/make-docs/LICENSE` stays.
- Commits in this repository use the owner's personal email, not a work email (Q-022). The old `make-docs` history is not rewritten (Q-024).
- The owner is the only code owner for the whole repository (Q-013).
- No CLI is named `make`, because that name clashes with the standard `make` build tool.
- Every kit stays a separate product. Each kit has its own npm package and its own CLI, and installs and runs alone. The first Northstar principle of the Make Blueprint design (separate or together) applies to every kit.

### 2. Layout

```text
make-kit/
  AGENTS.md, CLAUDE.md      monorepo map (hand-written) plus the Make Docs block
  LICENSE                   MIT, for the whole stack
  package.json              private npm workspace root, with one lockfile
  .github/                  CI for each kit, one shared publish workflow
  scripts/routing-check/    the routing check
  docs/                     repo-wide docs: core, setup tool, shared rules
  packages/core/            the shared core
  packages/kit/             the make-kit setup tool
  kits/make-docs/           Make Docs: its packages, its docs/, its routers
  kits/make-blueprint/      Make Blueprint: its packages, its docs/, its routers
```

The repository has one npm workspace (Q-005). The root `package.json` is private. Its workspaces are `packages/*` and `kits/*/packages/*`. The root holds the only lockfile, so no kit keeps its own npm root. The Make Docs `tsup` config loads `yaml` through the workspace, not through a fixed path.

### 3. How Make Docs comes in

- Copy day (Q-003): the old repository freezes. Its latest release tag (today `v2.0.6`) is copied into `kits/make-docs/` with `git archive`, which takes only tracked files and no git history. Work on unmerged branches in the old repository is ported here later.
- The Make Docs project keeps its `projectId` (Q-017). On copy day, `make-docs project checkout-move` moves its Store record from the old folder to `kits/make-docs/`, so the Store history and pending runs stay with the project.
- Naive UAT stays out of Step 0 (Q-009). After the copy, its removal is recorded in `kits/make-docs/docs/prd/03-open-questions-and-risk-register.md`, and a later Make Docs wave removes it.
- The switch point comes before the core (Q-002). Release 2.0.7 has the same code as 2.0.6 and ships from this repository. From that point on, all Make Docs work happens in this repository.
- The npm name `@brucewaynedecoy/make-docs` stays the same. Releases come from this repository's CI. At the switch point, the owner moves the npm trusted publisher to the repository `make-kit` and the workflow `publish-npm.yml`.
- Until the switch point, the old repository stays the release source. An urgent fix before the switch goes into the old repository, and is then ported here by hand.
- The switch test (Q-011) has these steps, in order:
  1. A pull request runs the package proof and `npm publish --dry-run`.
  2. The 2.0.7 tarball file list is compared with 2.0.6. Only repository links can change.
  3. The owner moves the npm trusted publisher.
  4. `2.0.7-rc.0` is released on the `next` dist-tag, and the owner approves it on npmjs.
  5. CI installs it from npm on Linux, macOS and Windows, runs `make-docs --version`, and sets up a temporary project.
  6. `2.0.7` is released on `latest`, and the install check runs again.
- If the release candidate fails, the owner points the trusted publisher back to `make-docs`.
- After 2.0.7 is on `latest`, the old repository is frozen (Q-012). Its README gets a banner that points to `kits/make-docs/` in `make-kit`. Its `publish-npm.yml` and `dependabot.yml` are removed, and its open Dependabot pull requests are closed. It is not archived, and it stays readable for its history. Each change to the old repository needs the owner's clear yes.

### 4. Shared core

- The shared core lives in `packages/core/`. It is pulled out of the copied Make Docs code after the switch point, inside this repository.
- Its boundary is the one the owner accepted for Make Blueprint: layout and paths, resource reading, the MCP server and its profiles, the Store base, agent-tool setup, managed blocks, tool discovery, and `update` and uninstall, with no product content.
- The core moves in slices, from the easy parts to the hard parts (Q-016). Every slice keeps all Make Docs tests green. Kit names become inputs to the core. The Store keeps schema version 6 for live users.
- Core `0.1.0` is published when all eight areas are in. Then Make Docs 2.2.0 ships on the core, with tag-aware managed blocks and the uninstall fix (Q-007).
- The uninstall fix covers the gaps D-030, D-002 and D-039 in the [root register](../prd/03-open-questions-and-risk-register.md#q-035-scope-of-the-uninstall-fix-in-220) (Q-035).
- The core is published as its own package. Each kit release on the core pins one exact core version, and a release build fails on an unpublished core.

### 5. The `make-kit` setup tool

- `make-kit setup` does four things: the person chooses kits, the person chooses agent tools, the tool runs each chosen kit's own setup, and the tool saves the choices in `.make/config.yaml`.
- It can set up all kits or one kit. It stays thin: it holds no kit logic and calls each kit's setup through the core.
- It is not part of Step 0. It gets a later repo-wide wave (Q-001).
- It ships with Make Blueprint v2.0.

### 6. Shared setup choices

- Kits share one project file, `.make/config.yaml`, for choices that every kit needs, such as the selected agent tools.
- A kit set up later reads that file, so earlier choices are already selected. A changed choice is written back for every kit.
- Settings for one kit stay in that kit's own file, `.make/<kit>/config.yaml`.
- The core holds the code that reads and writes the shared file.
- People and roles for every kit live in one more shared file, `.make/personas.yaml`. The core reads and writes it, and each kit only reads it.
- Each entry has these fields (Q-023):
  - `slug`: the identifier that data and code use.
  - `label`: the name that people read.
  - `description`: what the entry is for and when to use it, mainly for agents.
  - `primitive`: `user` or `maintainer`. Either can be a person or an agent. There is no `agent` primitive.
  - `kind`: `person`, `team`, `organization` or `agent`.
  - `kits`: the kits the entry is enabled for.
- There is no separate `name` field, because two identifier fields could disagree. Make Blueprint text that uses `name` as a display name changes to `label` in the Make Blueprint change plan.
- The core creates `.make/personas.yaml` on its first write. The built-in `user` and `maintainer` entries stay implicit defaults, as in Make Docs today. A slug is unique across the whole file, whatever its primitive, and the core refuses a clash. The core's write to the file is part of the same journaled change as the kit operation that asked for it, so a crash never leaves the file and the kit's records out of step. See [Q-077](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-077-shared-people-and-roles-file-details) in the Make Blueprint register.
- Make Docs' own Persona list moves from `.make-docs/config.yaml` into `.make/personas.yaml`. This is a Make Docs change, made in the monorepo during the setup tool wave. Make Docs already uses `slug`, `label` and `description`, so the entry format holds what Make Docs needs: those fields, the built-in `user` and `maintainer` entries, and the reserved slugs `project`, `archive`, `artifacts`, `library` and `playbooks`. How an existing project moves its list is an open question for that wave in the root register.
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

The Make Blueprint register has its own O-001. To keep the two apart, docs always write the register path together with the number.

| Number | Workaround | Make Docs fix that removes it |
| --- | --- | --- |
| O-001 | Every kit keeps a `docs/work/` folder so the upward search stops at the kit | The upward search stops at the nearest `.make-docs/config.yaml` |
| O-002 | Run kit commands from the kit folder, or pass `--repo-root` or `--target-root` | Every command resolves the nearest project from the working folder |
| O-003 | Pass the kit folder as `targetRoot` on every Make Docs MCP call for a kit | The MCP server resolves the project from a path argument or the nearest project config |
| O-004 | Check `../` links between projects by hand during validation | The link checks validate links that leave a project and land in another known project |
| O-005 | Check a kit's backlog with `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root kits/<kit>`, because the snapshot and the `backlog_snapshot` MCP tool fail with `operation-error` once the repository has git history | The snapshot takes a work record's last-updated time from git history when the git root sits above the project. This fix comes after Make Docs moves into `kits/make-docs/`. |

The full records of O-001 to O-005 are under [Deferred Obligations](../prd/03-open-questions-and-risk-register.md#deferred-obligations) in the root register.

How the fixes ship (Q-014):

- One Make Docs plan and backlog in `kits/make-docs/docs/` holds the fixes, with one work item for each O-number.
- Each work item adds a nested-project test, because none exists today.
- The fixes ship in Make Docs 2.1.0, after the switch point and before the core work. The same release ships the link read command that Make Blueprint needs ([Q-024](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-024-make-docs-link-check-interface)), because it uses the same link code as the O-004 fix (Q-020). It also adds the links from the Make Docs PRDs to the root Kit Conventions PRD (Q-019).

Cleanup when a fix ships: the numbered list in the root `AGENTS.md` and `CLAUDE.md` names each workaround by its number, and this table holds the records until the root register exists. When the root register is created, it takes O-001 to O-005 from this table, with the owner, trigger and exit criteria above. After the owner installs 2.1.0, the cleanup deletes each numbered item from both root files, removes the workaround from the validation steps, and marks the obligation `Fulfilled` with its version and proof command. O-005 is fulfilled when `make-docs run work backlog snapshot --target-root kits/make-blueprint` exits 0 from the repository root without `GIT_DIR`.

### 10. Monorepo as a setup option

Turning "single project or monorepo" into a setup option for Make Kit, Make Docs or Make Blueprint is deferred. This repository is the test bed. The routing check in section 14 builds the baseline, and the option gets its own design once that baseline exists.

### 11. Order of work

Step 0 has these 10 steps, in order (Q-021). The switch point comes before the core (Q-002).

1. Root docs: update this design, write the plan, write root PRDs `00` to `08` with the root register, and validate them. Then a Make Blueprint change plan turns its shared rules into links.
2. Write the Step 0 work backlog.
3. Copy day: the old repository freezes. Copy the latest release tag into `kits/make-docs/`, run `checkout-move`, add the root workspace, and fix the `tsup` path, the repository URLs and the tests. Build and tests pass on the maintainer's machine.
4. Scan the repository for secrets, client data and `/Users/` paths, git history included. The owner makes the repository public. Add the root `LICENSE` and the rulesets.
5. CI: `make-docs-ci.yml` and `publish-npm.yml`. CI passes on Linux, macOS and Windows.
6. The first routing check.
7. The switch point with release 2.0.7. Then the old repository gets its README banner, its publish workflow is removed, and its Dependabot pull requests are closed.
8. Make Docs 2.1.0: the O-fixes, the link read command and the Kit Conventions links. Then clean up the workarounds and run the routing check again.
9. The core moves in slices. Core `0.1.0` is published. Then Make Docs 2.2.0 ships on the core, with tag-aware managed blocks and the uninstall fix.
10. Closeout. Make Blueprint phase 01 can start.

After Step 0:

- A later repo-wide wave builds the `make-kit` setup tool and the shared setup choices, including `.make/personas.yaml` and the Make Docs change that moves its Persona list there.
- Make Blueprint v2.0 follows its own revised plan, which depends on Step 0.
- The handoff line, the `.make/docs/` move and the Azure export are Make Docs changes for later waves (Q-007).

### 12. CI and release

- GitHub reads workflows only at the git root, so all workflows live in the root `.github/workflows/` (Q-010).
- `make-docs-ci.yml` runs on changes under `kits/make-docs/` or `packages/core/`, and on changes to the root lockfile.
- One shared `publish-npm.yml` publishes every package. Each npm package trusts that same workflow file.
- Release tags name the package, for example `make-docs-v2.0.7` and `make-core-v0.1.0`. Release-candidate digests go in `.github/release-candidates/<tag>.sha256`.
- The release gate (a dry run, a release candidate on `next`, an install check, then `latest`) applies to every stable release of every package (Q-032).
- After the repository is public, rulesets match the old repository: `main` is protected, pull requests are required with 0 approvals, release tags cannot move, and only the owner creates release tags. With 0 approvals, the owner can merge their own pull requests.
- Dependabot watches the root lockfile.
- Each work backlog phase gets one branch and one pull request.

### 13. Repo-wide PRDs and Kit Conventions

- The root PRD set has the fixed files `00` to `04`, then `05-kit-conventions`, `06-shared-core`, `07-setup-tool-and-shared-files` and `08-build-and-release` (Q-006).
- Root PRDs own the shared rules. R-001 Core Release Friction and R-002 Two Core Versions in One Project move from the Make Blueprint register to the root register.
- After the root PRDs pass validation, a small Make Blueprint change plan turns the shared parts of Make Blueprint PRDs 05 to 09 into links to the root PRDs.
- The Make Docs PRDs keep their text, because they describe live code. They only add a link to the root Kit Conventions PRD (Q-019). Kit Conventions names Make Docs as the reference kit.
- Kit Conventions takes each rule from the Make Docs code (Q-015). Where this design sets another target, or where Make Docs is not consistent, Kit Conventions states one target rule and lists the Make Docs gap. Each gap gets a root register item. Two known gaps: Make Docs uses `.make-docs/` and `~/.make-docs/` where this design sets `.make/<kit>/` and `~/.make/<kit>/`, and Make Docs has no single exit-code table and no `--dry-run` on `run`.
- Kit Conventions covers the CLI shape (the seven top-level groups, `run <domain> <verb>`, outcomes and exit codes, `--json` and `--dry-run`), the MCP server, its profiles and `allowWrite`, system resources served by URI compared with project records, routers and managed blocks with progressive disclosure, the shared `.make/` files compared with each kit's `.make/<kit>/` config, the `~/.make/<kit>/` machine folders with a `MAKE_<KIT>_HOME` setting for each kit, and the rule that project knowledge lives in git while the Store holds only operational state.

### 14. Routing check

- A script in `scripts/routing-check/` starts fresh read-only agents at the repository root, with `claude -p` and `codex exec` (Q-008).
- It runs 9 tasks: 3 for Make Docs, 3 for Make Blueprint and 3 repo-wide. Each task runs twice with each tool.
- A run passes when the agent reads the right router and names the right docs root.
- Results go in `docs/assets/maintainer/routing-check/<date>-baseline.md`. Each miss goes in the root register.
- The check runs after the copy, and again after the O-fixes. The same tasks each time let the second run compare with the first.

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
| Pull out the core before the switch point | The old repository stays frozen for weeks, and a core bug could block the switch. |
| Keep `make-kit` private and publish without provenance | Users lose provenance and a public source, and a private repository on the free plan gets no rulesets. |
| A separate npm root and lockfile for each kit | The core links in only with a `file:` path, and each kit needs its own install. |
| Copy the shared rules into the root PRDs and keep the Make Blueprint text too | Two copies of a rule drift apart. |
| Release 2.0.7 straight to `latest` after a dry run | Users on `latest` would get a broken release if the new path fails. |
| Archive the old repository | The owner chose to keep it unarchived. The banner and the removed publish workflow show that it is frozen. |
| Move all eight core areas in one change | One change is too large to review and test. |
| Give `kits/make-docs/` a new `projectId` | The Store history and pending runs would not stay with the project. |
| A separate `name` field beside `slug` in `.make/personas.yaml` | Two identifier fields could disagree. |

## Consequences

### What gets better

- A change to the core and the kits that use it can land in one change, with no release delay between repositories.
- The setup tool and the shared setup choices have one natural home.
- Every kit follows one pattern for folders, routers, the Store, the CLI shape and MCP profiles.
- Kits installed together can be checked together. Make Blueprint records can link to any Make Docs doc, such as a design, plan, PRD, work item or guide, so deterministic checks could measure how well the docs cover the Blueprint data. One example: requirement records link to PRDs, and those PRDs link to the work that builds them, so a check could report which requirements are planned, built, or missing. This is an opportunity, not a committed capability.
- The switch point tests only one change, the new home, so the old repository stays frozen for days, not weeks.

### Trade-offs and risks

- Step 0 grows. It now includes copying Make Docs, rebuilding its CI and release flow here, the switch point, the O-fix release and the core. A broken release at the switch point would hurt live Make Docs users, so the switch needs a dry-run publish, a release candidate on `next`, and install checks first.
- Make Docs tests or scripts that assume they run at the repository root may need changes to run from `kits/make-docs/`.
- The nested-project weak spots stay until Make Docs 2.1.0. The workarounds are tracked as O-001 to O-005 so they do not become permanent.
- Agents may still pick the wrong project in a repository with several docs roots. The routing check exists to find out.
- Making the repository public exposes its whole history. The scan and the email rewrite exist to keep secrets, client data, local paths and the work email out of it.
- macOS and Windows CI jobs cost more time than Linux jobs. They still run, because Make Docs supports all three.

### Left open

- How an existing project moves its Personas from `.make-docs/config.yaml` to `.make/personas.yaml`. This is a root register question for the setup tool wave.
- The monorepo setup option in section 10, after the routing check baseline exists.

## Design Lineage

- Update Mode: `new-doc-related`
- Prior Design Docs: [Make Blueprint v2 Architecture](../../kits/make-blueprint/docs/designs/2026-10-29-make-blueprint-v2-architecture.md)
- Reason: This design moves the shared core, Step 0 and the setup tool from the Make Blueprint design to the repository level, and adds the setup tool, shared choices and the docs-root pattern. The Make Blueprint design is updated in place to point here. On 2026-11-01 this design was updated in place with the Step 0 interview decisions Q-001 to Q-026. They change the order of work in section 11 (the switch point now comes before the core), set the Persona entry fields in section 6, and add sections 12 to 14.

## Intended Follow-On

- Route: `baseline-plan`
- Next Prompt: [designs-to-plan.prompt.md](make-docs://system/prompt/designs-to-plan.prompt.md). Read `make-docs://system/prompt/designs-to-plan.prompt.md` with `make-docs resource read`.
- Why: The repo-wide project has no plan or PRD yet, so its planning starts a new baseline: Step 0, the shared core, the setup tool and the shared rules.
- Coordinate Handoff: Not applicable for `baseline-plan`. The planner assigns the first repo-wide coordinate.
