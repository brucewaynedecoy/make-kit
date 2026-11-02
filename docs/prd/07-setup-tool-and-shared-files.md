---
title: "07 Setup Tool and Shared Files"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md"
---

# 07 Setup Tool and Shared Files

## Purpose

The setup tool, `make-kit setup`, lets a person set up any mix of kits in a project with one set of choices. It ships in the npm package `@brucewaynedecoy/make-kit`, from `packages/kit/`. Kits in one project share two project files: `.make/config.yaml` for the choices that every kit needs, and `.make/personas.yaml` for the people and roles of every kit. Settings for one kit stay in that kit's own file, `.make/<kit>/config.yaml`. Each kit with a `.make/<kit>/` folder also keeps its own block in the shared `.make/` router.

This document owns the setup tool steps, the fields of the three project files, the rules for reading and writing them, the shared `.make/` router, where Make Docs reads its Personas, and how Make Blueprint uses the shared people and roles. [06 Shared Core](06-shared-core.md) owns the core code that reads and writes the shared files. Terms are in [04 Glossary](04-glossary.md).

The setup tool and the shared files ship in the setup tool wave, a repo-wide wave after Step 0 ([Q-001 Step 0 Backlog Scope](03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope)). The setup tool ships with Make Blueprint v2.0. On 2026-11-01 none of these exist. `packages/kit/` is not in the repository, and each kit sets up alone with its own CLI. Make Docs keeps its agent-tool choices and its Personas in `.make-docs/config.yaml` (`make-docs v2.0.6: packages/cli/src/config.ts:95`).

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 5 and 6)
- `packages/kit/`
- `.make/config.yaml`
- `.make/personas.yaml`

## Scope

This document covers:

- The four steps of `make-kit setup`, and what it holds and does not hold.
- `.make/config.yaml`: the shared choices, and how a kit set up later reads them.
- `.make/<kit>/config.yaml`: the settings for one kit.
- `.make/personas.yaml`: the entry fields, the slug rules, the built-in entries and the write rules.
- The shared `.make/` router, `.make/AGENTS.md` and `.make/CLAUDE.md`, and who writes its blocks.
- The Persona source of Make Docs before and from the setup tool wave.
- How Make Blueprint record fields name `.make/personas.yaml` entries.

Covered elsewhere:

| Subject | Owner |
| --- | --- |
| The core code that reads and writes the shared files, tool discovery and the exact core pin | [06 Shared Core](06-shared-core.md) |
| The `.make/<kit>/` and `~/.make/<kit>/` folder rule, `MAKE_<KIT>_HOME`, and the Make Docs `.make-docs/` gap | [05 Kit Conventions](05-kit-conventions.md) |
| Each kit's own setup questions, agent-tool entries and Skills install | Each kit's PRD set, such as [Make Blueprint 07 Installation and Distribution](../../kits/make-blueprint/docs/prd/07-installation-and-distribution.md) |
| Make Blueprint persona records and the checks on slugs in record fields | [Make Blueprint 10 Records and Identity](../../kits/make-blueprint/docs/prd/10-records-and-identity.md) |
| The release of `@brucewaynedecoy/make-kit` | [08 Build and Release](08-build-and-release.md) |
| A "single project or monorepo" setup option | [02 Architecture Overview](02-architecture-overview.md#later-scope). It is not part of the setup tool wave. |

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 5, 6, 10 and 11)
- `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/03-core-setup-and-release.md` (07 Setup Tool and Shared Files)

## Component and Capability Map

| Component | What it does | Who writes it | Release |
| --- | --- | --- | --- |
| `make-kit setup` | Asks for the kits and the agent tools once, runs each chosen kit's own setup, and saves the choices | Not applicable | Setup tool wave, with Make Blueprint v2.0 |
| `.make/config.yaml` | Holds the choices that every kit in the project needs | The core only | Setup tool wave |
| `.make/<kit>/config.yaml` | Holds the settings for one kit | That kit only | Each kit's own release. Make Docs keeps `.make-docs/config.yaml` until a later Make Docs wave ships its `.make/docs/` folder ([Q-007 Make Docs Changes in Step 0](03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)). |
| `.make/personas.yaml` | Holds the people and roles for every kit | The core only | Setup tool wave |
| `.make/` router | `.make/AGENTS.md` and `.make/CLAUDE.md`, with one managed block for each kit that has a `.make/<kit>/` folder | Each such kit, its own block only | Make Blueprint v2.0. Make Docs writes its block when its `.make/docs/` folder ships ([D-033 Make Docs Project Folder Name](03-open-questions-and-risk-register.md#d-033-make-docs-project-folder-name)). |
| Make Docs Persona source | Make Docs reads its Personas from `.make/personas.yaml` | Not applicable | Setup tool wave |

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 5, 6 and 11)
- `kits/make-blueprint/docs/prd/06-project-layout-and-instruction-files.md` (Project Tree)

### `make-kit setup`

`make-kit setup` has four steps, in this order:

1. The person chooses the kits to set up.
2. The person chooses the agent tools.
3. The setup tool runs each chosen kit's own setup with those choices.
4. The setup tool saves the choices in `.make/config.yaml`.

The setup tool stays thin. It holds no kit logic. It finds each kit through core tool discovery and calls each kit's own setup through the core ([06 Shared Core](06-shared-core.md#tool-discovery)).

A person runs `make-kit setup`, chooses kits and agent tools once, and gets each chosen kit set up. Each kit still sets up alone with its own CLI. This is an observable outcome of the setup tool. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind it.

Requirements:

- A person can choose all available kits or one kit in one `make-kit setup` run.
- `make-kit setup` asks for the agent tools once. No chosen kit's setup asks for the agent tools again in the same run.
- After `make-kit setup` finishes, each chosen kit's own status output reports the project as set up, and `.make/config.yaml` holds the chosen agent tools.
- `make-kit setup` output names each chosen kit and each chosen agent tool, and it states the result for each kit. It does not show how the setup tool calls each kit's setup.
- `make-kit setup` writes no kit file itself. Each kit's own setup writes that kit's folder, its managed block and its agent-tool entries.
- `make-docs setup` and `make-blueprint setup` work in a project with no `make-kit` install.
- No kit needs `make-kit` to be installed.
- `make-kit setup` gives the same result on Linux, macOS and Windows.

Evidence: an install test of `make-kit setup` with two kits in a fresh project. It confirms that the shared choices are read and written.

What `make-kit setup` does when a chosen kit is not installed, or when the setup of one kit fails, is open ([Q-030 Setup With a Missing or Failed Kit](03-open-questions-and-risk-register.md#q-030-setup-with-a-missing-or-failed-kit)). The setup tool wave answers it.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Human Experience Intent; Decision, section 5)
- `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md` (Human Experience Propagation)
- `make-docs v2.0.6: packages/cli/src/setup-system.ts:59` (the Make Docs setup that `make-kit setup` calls)

### Shared Setup Choices

`.make/config.yaml` holds the choices that every kit in a project needs. A kit set up later reads the file, so the earlier choices are already selected. A changed choice is written back for every kit (Make Blueprint register [Q-060](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-060-shared-setup-choices-across-kits)).

A person who set up one kit in a project sees the earlier agent-tool choices already selected when they set up another kit. This is an observable outcome of the shared choices. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind it.

Requirements:

- In a project where a person set up one kit and chose Claude Code and Codex, the next kit's `setup` shows Claude Code and Codex already selected. The person can keep them with no new choice.
- When a person changes the agent tools during any kit's `setup`, `.make/config.yaml` holds the new choice, and the next `setup` of any kit shows it.
- From the setup tool wave on, Make Docs `setup` reads and writes its agent-tool choices in `.make/config.yaml` through the core. Until then, Make Docs keeps them in `.make-docs/config.yaml` under `harnessIntegrations` (`make-docs v2.0.6: packages/cli/src/config.ts:104`). How the choices of an existing Make Docs project reach `.make/config.yaml` is open ([Q-029 Agent-Tool Choices for Existing Make Docs Projects](03-open-questions-and-risk-register.md#q-029-agent-tool-choices-for-existing-make-docs-projects)).
- `.make/config.yaml` holds no kit-only setting.
- `.make/config.yaml` holds no secret. It holds no MCP connection key, no key hash and no local home-folder path. Each kit keeps its machine approvals and its MCP connection record in its own Store, as Make Docs does in its machine `config.json` (`make-docs v2.0.6: packages/cli/src/store/global-config.ts:45`).

Evidence: the same install test with two kits.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Human Experience Intent; Decision, section 6)
- `kits/make-blueprint/docs/prd/06-project-layout-and-instruction-files.md` (Project Config)
- `make-docs v2.0.6: packages/cli/src/config.ts:104`
- `make-docs v2.0.6: .make-docs/config.yaml:2` (`harnessIntegrations` in the Make Docs project)

### Shared People and Roles

`.make/personas.yaml` holds the people and roles for every kit in one list. A Make Docs Persona and a Make Blueprint audience role with the same slug are one entry. The entry fields are in [People and Roles Entry Fields](#people-and-roles-entry-fields) ([Q-023 Persona Entry Fields](03-open-questions-and-risk-register.md#q-023-persona-entry-fields)). The rules come from Make Blueprint register [Q-072](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-072-shared-people-and-roles-file) and [Q-077](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-077-shared-people-and-roles-file-details).

Requirements:

- The core reads and writes `.make/personas.yaml`. Each kit only reads it and asks the core for a change.
- The core creates the file on its first write. Its write is part of the same journaled change as the kit operation that asked for it, so a crash never leaves the file and that kit's records out of step.
- The built-in `user` and `maintainer` entries stay implicit defaults, as in Make Docs today. The core does not write them. An entry with the slug `user` or `maintainer` can set display fields, and its primitive stays fixed. Make Docs PRD 24 states this rule today, in its Persona Configuration section (`make-docs v2.0.6: docs/prd/24-project-configuration-and-convention-overlay.md`).
- A slug is unique across the whole file, whatever its primitive. The core refuses a write that gives two entries the same slug. The kit operation that asked for that write returns the `blocked` outcome and names the clash.
- The core refuses an entry with a reserved slug: `project`, `archive`, `artifacts`, `library` or `playbooks` (`make-docs v2.0.6: packages/cli/src/config.ts:14`).
- When the core writes the file, it keeps the project's comments and the other entries, as Make Docs keeps comments and unrelated fields in its config today.
- An absent file gives the built-in entries only. No kit fails because the file is absent.
- An entry enabled for Make Docs is a Make Docs Persona.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, section 6)
- `kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md` (Shared Core)
- `make-docs v2.0.6: packages/cli/src/config.ts:14`
- `make-docs v2.0.6: packages/cli/src/config.ts:164`
- `make-docs v2.0.6: packages/cli/src/config.ts:259`

### Make Docs Personas

Make Docs keeps its Persona list in `.make-docs/config.yaml` under `personas` at `v2.0.6`. Each entry has `slug`, `label`, `description` and `primitive` (`make-docs v2.0.6: packages/cli/src/config.ts:164`). The primitives are `user` and `maintainer` (`make-docs v2.0.6: packages/cli/src/config.ts:13`). Make Docs merges the configured entries with the built-in `user` and `maintainer` entries by slug (`make-docs v2.0.6: packages/cli/src/config.ts:259`), and it reports a duplicate slug as `duplicate-persona-slug` (`make-docs v2.0.6: packages/cli/src/config.ts:717`). `make-docs project persona list` shows the effective set.

Requirements:

- Until the setup tool wave, Make Docs reads its Personas from `.make-docs/config.yaml`.
- From the setup tool wave on, Make Docs reads its Personas from `.make/personas.yaml`. Its effective set is the built-in `user` and `maintainer` entries plus each entry enabled for Make Docs.
- `make-docs project persona list` shows the same effective set from `.make/personas.yaml` as it showed from `.make-docs/config.yaml` for a project with the same entries.
- How a project that keeps Personas in `.make-docs/config.yaml` reaches `.make/personas.yaml` is open ([Q-027 Persona List Move for Existing Projects](03-open-questions-and-risk-register.md#q-027-persona-list-move-for-existing-projects)). The setup tool wave answers it.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, section 6; Consequences: left open)
- `make-docs v2.0.6: packages/cli/src/config.ts:164`
- `make-docs v2.0.6: docs/prd/24-project-configuration-and-convention-overlay.md` (Persona Configuration)

### Make Blueprint Use

Make Blueprint record fields name `.make/personas.yaml` entries by slug. The Make Blueprint PRDs own which primitive each field names, such as `maintainer` entries for `owners`: [Make Blueprint 05 Ecosystem and Shared Core](../../kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md#shared-core) states the rule, and [Make Blueprint 10 Records and Identity, People and Role Slugs](../../kits/make-blueprint/docs/prd/10-records-and-identity.md#people-and-role-slugs) owns the field table and its checks.

Requirements:

- Each Make Blueprint slug field names an entry with the primitive that the Make Blueprint PRDs give for that field.
- When a reviewer approves a Make Blueprint persona record, the core writes the record's entry as a `user` entry, as [Make Blueprint 05 Ecosystem and Shared Core](../../kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md#shared-core) defines. Client roles found in sources stay Make Blueprint persona records until that approval.
- Make Blueprint text that names a persona display name uses `label`. There is no `name` field.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, section 6)
- `kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md` (Shared Core)
- `kits/make-blueprint/docs/prd/10-records-and-identity.md` (People and Role Slugs)

## Contracts and Data

### Project Files

```text
<project>/
  .make/
    AGENTS.md          shared router: one block for each kit with a .make/<kit>/ folder
    CLAUDE.md          shared router: the same blocks, for Claude Code
    config.yaml        choices that every kit shares (written by the core)
    personas.yaml      people and roles for every kit (written by the core)
    <kit>/
      config.yaml      settings for one kit (written by that kit)
```

`<kit>` is the kit's own folder name under `.make/`, such as `blueprint` for Make Blueprint and `docs` for Make Docs. [05 Kit Conventions](05-kit-conventions.md) owns that folder rule.

| File | Writer | Readers | Created |
| --- | --- | --- | --- |
| `.make/AGENTS.md`, `.make/CLAUDE.md` | Each kit that has a `.make/<kit>/` folder, its own block only | Agent tools | At the first `setup` of a kit that has a `.make/<kit>/` folder |
| `.make/config.yaml` | The core, for any kit | Every kit, through the core | At the first kit setup that saves a shared choice |
| `.make/personas.yaml` | The core, for any kit | Every kit, through the core | At the first write of an entry |
| `.make/<kit>/config.yaml` | That kit | That kit | At that kit's `setup` |

Requirements:

- Each file lives in the project's git repository. `.make/config.yaml`, `.make/personas.yaml` and each `.make/<kit>/config.yaml` are YAML.
- No kit writes `.make/config.yaml`, `.make/personas.yaml` or another kit's `.make/<kit>/config.yaml` itself.
- `.make/AGENTS.md` and `.make/CLAUDE.md` are the shared `.make/` router. Each file exists for the agent tools that `.make/config.yaml` selects: `AGENTS.md` for Codex and GitHub Copilot CLI, `CLAUDE.md` for Claude Code ([05 Kit Conventions, Routers and Managed Blocks](05-kit-conventions.md#routers-and-managed-blocks)).
- The `.make/` router holds one tag-aware managed block for each kit that has a `.make/<kit>/` folder. Each kit writes and removes only its own block, by the rules in [05 Kit Conventions, Routers and Managed Blocks](05-kit-conventions.md#routers-and-managed-blocks). When one kit is removed from the project, the blocks of the other kits stay byte for byte.
- Each kit's own PRDs state the text of its block in the `.make/` router, such as [Make Blueprint 06 Routers](../../kits/make-blueprint/docs/prd/06-project-layout-and-instruction-files.md#routers).
- Make Docs writes no block in the `.make/` router until its project tool directory is `.make/docs/` ([D-033 Make Docs Project Folder Name](03-open-questions-and-risk-register.md#d-033-make-docs-project-folder-name)).
- The key names, the top-level shape and the format version of `.make/config.yaml` and `.make/personas.yaml` are open ([Q-028 Shared File Schema Details](03-open-questions-and-risk-register.md#q-028-shared-file-schema-details)). The setup tool wave answers it.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, section 6)
- `kits/make-blueprint/docs/prd/06-project-layout-and-instruction-files.md` (Project Tree, Routers, Project Config)
- `.make/AGENTS.md`
- `.make/CLAUDE.md`

### Shared Choices Settings

| Setting in `.make/config.yaml` | Meaning | Source |
| --- | --- | --- |
| Agent tools | The agent tools that the project uses, such as Claude Code, Codex and GitHub Copilot CLI, for every kit | Design section 6; Make Blueprint register [Q-060](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-060-shared-setup-choices-across-kits) |
| Skill install choices | How each kit installs its agent Skills, used by every kit | [Make Blueprint Project Config](../../kits/make-blueprint/docs/prd/06-project-layout-and-instruction-files.md#project-config) |
| `name` | An optional project display name. A kit can show it, such as in a status command or an export title. | Make Blueprint register [D-011](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#d-011-project-display-name-from-the-v1-import) |

### Kit Settings

`.make/<kit>/config.yaml` holds the settings that only one kit uses, such as that kit's project ID. Make Blueprint keeps its settings in `.make/blueprint/config.yaml` ([Make Blueprint Project Config](../../kits/make-blueprint/docs/prd/06-project-layout-and-instruction-files.md#project-config)). Make Docs keeps its settings in `.make-docs/config.yaml` at `v2.0.6`. Its allowed top-level keys are `projectId`, `labels`, `personas`, `generatedProse`, `harnessCapabilities`, `harnessIntegrations` and `prd_authority` (`make-docs v2.0.6: packages/cli/src/config.ts:154`). Two of these keys hold data that the target keeps in the shared files. `harnessIntegrations` holds the agent-tool choices that belong in `.make/config.yaml`. `personas` holds the entries that belong in `.make/personas.yaml`.

Requirements:

- Each kit's project ID sits in that kit's own config, so each kit keeps its own project identity in the Store.
- A kit reads only its own `.make/<kit>/config.yaml`.

### People and Roles Entry Fields

| Field | Meaning | Values |
| --- | --- | --- |
| `slug` | The identifier that data and code use | Unique across the file. Not a reserved slug. |
| `label` | The name that people read | Text |
| `description` | What the entry is for and when to use it, mainly for agents | Text |
| `primitive` | The audience role | `user` or `maintainer`. Either can be a person or an agent. There is no `agent` primitive. |
| `kind` | What the entry stands for | `person`, `team`, `organization` or `agent` |
| `kits` | The kits for which the entry is enabled | One or more kits |

Requirements:

- An entry has no `name` field, because two identifier fields could disagree. `label` is the display name.
- An entry with a `primitive` other than `user` or `maintainer`, or a `kind` other than the four above, is invalid. The core refuses to write it, and a kit that reads it reports a diagnostic.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, section 6; Alternatives Considered: a separate `name` field)
- `make-docs v2.0.6: packages/cli/src/config.ts:13`
- `make-docs v2.0.6: packages/cli/src/config.ts:14`

## Integrations

| Party | How it connects | From |
| --- | --- | --- |
| [06 Shared Core](06-shared-core.md) | Reads and writes `.make/config.yaml` and `.make/personas.yaml`. Gives the setup tool tool discovery and each kit's setup call. | The core release of the setup tool wave |
| Make Docs `setup` | `make-kit setup` calls it through the core. It reads the shared choices and its Personas through the core. | Setup tool wave |
| Make Blueprint `setup` | `make-kit setup` calls it through the core. It reads the shared choices and the people and roles through the core. | Make Blueprint v2.0 |
| Agent tools: Claude Code, Codex and GitHub Copilot CLI | The agent-tool choice in `.make/config.yaml` names them. Each kit's own setup writes the agent-tool entries. | Setup tool wave |
| npm | Ships `@brucewaynedecoy/make-kit` with the `make-kit` CLI. [08 Build and Release](08-build-and-release.md) owns its release. | With Make Blueprint v2.0 |

The current Make Docs rules for its project config and Personas are in `make-docs v2.0.6: docs/prd/24-project-configuration-and-convention-overlay.md` (Persona Configuration, Harness Capability Records) and `make-docs v2.0.6: docs/prd/47-persona-model.md`.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 5 and 6)
- `kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md` (Make Docs Capabilities Make Blueprint Depends On)
- `make-docs v2.0.6: packages/cli/src/setup-system.ts:59`

## Rebuild Notes

- **One identifier field.** An entry has `slug` as its only identifier. A `name` field beside it could disagree with it. Make Blueprint text calls the display field `label`.
- **Do not write the built-in entries.** They stay implicit, so an absent file still gives `user` and `maintainer`.
- **Two core versions read the same files.** Each kit pins its own core version, so two core versions can read and write `.make/config.yaml` and `.make/personas.yaml` in one project. A change to their format is a breaking core change ([R-002 Two Core Versions in One Project](03-open-questions-and-risk-register.md#r-002-two-core-versions-in-one-project)).
- **Keep kit settings out of the shared file.** Make Docs mixes shared and kit-only settings in one file today (`make-docs v2.0.6: packages/cli/src/config.ts:95`). The target splits them.
- **Keep secrets out of project files.** The shared files are in git, and many projects are public. MCP keys and key hashes stay in each kit's Store.
- **Project folder and machine folder at the home folder.** When the project root is the home folder, `.make/<kit>/` and `~/.make/<kit>/` are the same folder. Make Docs has the same overlap with `.make-docs` and tells the two apart with a marker check (`make-docs v2.0.6: packages/cli/src/store/lifecycle.ts:131`). The overlap is a tracked risk ([R-011 Project and Machine Folders Overlap](03-open-questions-and-risk-register.md#r-011-project-and-machine-folders-overlap)).
- **Make Docs key style is mixed.** The top-level key `prd_authority` is snake_case, and the other top-level keys are camelCase (`make-docs v2.0.6: packages/cli/src/config.ts:161`). [05 Kit Conventions](05-kit-conventions.md#project-config) owns the top-level key style. Each kit sets the style of its nested keys in its own PRDs.

Code anchors:

- `make-docs v2.0.6: packages/cli/src/config.ts:95`
- `make-docs v2.0.6: packages/cli/src/store/lifecycle.ts:131`
- `make-docs v2.0.6: packages/cli/src/config.ts:161`

## Source Anchors

- [Make Kit Monorepo](../designs/2026-10-30-make-kit-monorepo.md) design, sections 5, 6 and 11
- [Make Kit Monorepo Baseline Plan](../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md) and its [Phase 3](../plans/2026-11-01-w1-r0-make-kit-monorepo/03-core-setup-and-release.md)
- [Q-001 Step 0 Backlog Scope](03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope), [Q-023 Persona Entry Fields](03-open-questions-and-risk-register.md#q-023-persona-entry-fields), [Q-027 Persona List Move for Existing Projects](03-open-questions-and-risk-register.md#q-027-persona-list-move-for-existing-projects), [Q-037 Router Places in Kit Terms](03-open-questions-and-risk-register.md#q-037-router-places-in-kit-terms)
- Make Blueprint register [Q-060](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-060-shared-setup-choices-across-kits), [Q-072](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-072-shared-people-and-roles-file), [Q-077](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-077-shared-people-and-roles-file-details) and [D-011](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#d-011-project-display-name-from-the-v1-import)
- [Make Blueprint 05 Ecosystem and Shared Core](../../kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md), [Make Blueprint 06 Project Layout and Instruction Files](../../kits/make-blueprint/docs/prd/06-project-layout-and-instruction-files.md), [Make Blueprint 10 Records and Identity](../../kits/make-blueprint/docs/prd/10-records-and-identity.md)
- `make-docs v2.0.6: packages/cli/src/config.ts`
- `make-docs v2.0.6: docs/prd/24-project-configuration-and-convention-overlay.md`
