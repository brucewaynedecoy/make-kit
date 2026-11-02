---
title: "Phase 3: Core, Setup and Release"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P3"
---

# Phase 3: Core, Setup and Release

## Purpose

Write the three PRDs for the shared core, the setup tool with its shared files, and the build and release flow.

## Write Scope

`docs/prd/06-shared-core.md`, `docs/prd/07-setup-tool-and-shared-files.md` and `docs/prd/08-build-and-release.md`. Glossary terms and new register items go to [Phase 4](04-register-and-assembly.md) as lists in the worker's final report.

- Front matter: set `source.type` to `plan` and `source.path` to `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md`.
- Use the section headings of the `prd-subsystem.md` template.
- Write Make Docs code anchors as plain code text in the form `make-docs v2.0.6: <path>:<line>`, as [Phase 2](02-kit-conventions.md#source-anchor-format) sets out.

## 06 Shared Core

| Part | Content | Source |
| --- | --- | --- |
| Boundary | Eight areas: layout and paths, resource reading, the MCP server and its profiles (with the operation registry they need), the Store base, agent-tool setup, managed blocks, tool discovery, and tool `update` and uninstall. No product content. | Design section 4; Make Blueprint [05 Ecosystem and Shared Core](../../../kits/make-blueprint/docs/prd/05-ecosystem-and-shared-core.md) |
| Kit names as inputs | Each kit passes its own names to the core: the resource URI prefix, the project folder, the machine folder and its `MAKE_<KIT>_HOME` setting, the MCP server name in agent-tool config, the connection environment names, and the managed-block tag. | Q-016; discovery facts on hard-coded `make-docs` names |
| Tool discovery | The core finds other installed kits. Make Docs has no such code, so this area is new. | Q-016 |
| Slice order | The core is built in slices from the easy parts to the hard parts. Easy: resource reading, the managed-block library, tool update and uninstall. Hard: the operation registry, the Store migrations, and the managed-block merge and remove code. Every slice keeps all Make Docs tests green. | Q-016 |
| Store compatibility | The Store keeps schema version 6. Base tables and kit tables stay readable by Make Docs 2.0.x. | Q-016 |
| Versions | Core `0.1.0` is the first release, with all eight areas. Each kit release pins one exact core version, and a release build fails on an unpublished core. Make Docs 2.2.0 is the first kit release on the core, with tag-aware managed blocks and the uninstall fix. | Q-007, Q-016; design section 4 |
| Risks | R-001 Core Release Friction and R-002 Two Core Versions in One Project, linked to the root register. | Q-006 |

## 07 Setup Tool and Shared Files

| Part | Content | Source |
| --- | --- | --- |
| `make-kit setup` | Four steps: choose kits, choose agent tools, run each chosen kit's own setup, save the choices. It sets up all kits or one kit. It holds no kit logic and calls each kit's setup through the core. It ships with Make Blueprint v2.0, in the setup tool wave after Step 0. | Design section 5; Q-001 |
| `.make/config.yaml` | Choices that every kit needs, such as the agent tools. A kit set up later reads it, and a changed choice is written back for every kit. The core reads and writes it. | Design section 6; Make Blueprint [Q-060](../../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-060-shared-setup-choices-across-kits) |
| `.make/<kit>/config.yaml` | Settings for one kit only | Design section 6 |
| `.make/personas.yaml` | One shared file for people and roles. The core reads and writes it, and each kit only reads it. Fields: `slug`, `label`, `description`, `primitive` (`user` or `maintainer`), `kind` (`person`, `team`, `organization` or `agent`) and `kits`. No `name` field and no `agent` primitive. Built-in `user` and `maintainer` entries stay implicit defaults. A slug is unique across the file. Reserved slugs: `project`, `archive`, `artifacts`, `library`, `playbooks`. The core creates the file on its first write, inside the same journaled change as the kit operation that asked for it. | Design section 6; Q-023; Make Blueprint [Q-072](../../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-072-shared-people-and-roles-file) and [Q-077](../../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-077-shared-people-and-roles-file-details) |
| Make Docs Personas | Make Docs reads its Personas from `.make/personas.yaml` from the setup tool wave on. Until then it reads `.make-docs/config.yaml`. How an existing project moves its list is an open register item for that wave (new Q-027). | Design section 6 |
| Make Blueprint use | `owners` and `stakeholders` point to `maintainer` entries, and `audience` points to `user` entries. | Design section 6 |

## 08 Build and Release

| Part | Content | Source |
| --- | --- | --- |
| Source home | All kit code lives in this repository. Make Docs lives in `kits/make-docs/` and keeps `projectId` `831ddb50-b97a-47e2-9f2c-f491b27b8759`. | Q-003, Q-017 |
| CI | Workflows live in the root `.github/workflows/`. `make-docs-ci.yml` runs on changes under `kits/make-docs/` or `packages/core/` and on root lockfile changes, on Linux, macOS and Windows. | Q-010 |
| Publish | One shared `publish-npm.yml` publishes every package with npm trusted publishing and `--provenance`. Tags name the package, such as `make-docs-v2.0.7` and `make-core-v0.1.0`. Release-candidate digests live in `.github/release-candidates/<tag>.sha256`. | Q-010 |
| Release gate | A pull request runs the package proof and `npm publish --dry-run`. A release candidate goes to the `next` dist-tag first, and the owner approves it on npmjs. CI installs it from npm on Linux, macOS and Windows, runs `<cli> --version` and sets up a temporary project. Only then does the same version go to `latest`, and the install check runs again. | Q-011 |
| Switch point | Make Docs 2.0.7 has the same code as 2.0.6. Its tarball file list matches 2.0.6, except repository links. The npm trusted publisher names the repository `make-kit` and the workflow `publish-npm.yml`. If the release candidate fails, the trusted publisher goes back to `make-docs`. | Q-002, Q-011 |
| Public repository | The repository is public, so npm can make provenance and rulesets work. Before it goes public, a scan of the files and the git history finds no secrets, client data, local `/Users/` paths or work email, and old commit IDs do not open on GitHub. | Q-004, Q-022, Q-026 |
| Rulesets | `main` is protected. Pull requests are required, with 0 approvals. Release tags cannot move. Only the owner creates release tags. | Interview defaults |
| Ownership and updates | The owner is the only code owner. Dependabot watches the root lockfile. Each work backlog phase gets one branch and one pull request. | Q-013; interview defaults |
| License | One root MIT `LICENSE` covers the whole stack. `kits/make-docs/LICENSE` stays. | Q-018 |
| Old repository | After 2.0.7 is on `latest`, the old `make-docs` repository has a README banner that points to `kits/make-docs/` in `make-kit`, no `publish-npm.yml`, no `dependabot.yml` and no open Dependabot pull requests. It is not archived. Its history is not rewritten. Each change to it needs the owner's clear yes. | Q-012, Q-024 |

## Exit Criteria

- Each PRD uses the template headings and states the current or target product, with no change words.
- Each part above appears in its PRD with its Q-number or design section in the text or in `## Source Anchors`.
- PRD 06 links R-001 and R-002 in the root register and does not copy their text.
- The final report lists the glossary terms and the new register items (Q-027 and any new risk).
