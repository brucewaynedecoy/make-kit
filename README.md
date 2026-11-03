# Make Kit

Make Kit is a small family of command-line tools for working on a project with AI agents. Each tool is called a kit. A kit runs as a CLI and as an MCP server that your agent tool starts, and it adds its own block to the agent instruction files, such as `AGENTS.md` and `CLAUDE.md`, so agents know how to use it. Every kit installs and runs on its own, and kits installed together will share one core library and a couple of project settings files.

This repository holds the kits, the shared core and the setup tool. Apart from Make Docs, most of it is still on paper. Nothing is released from here yet.

## The kits

**Make Docs** keeps a project's designs, plans, PRDs and work backlog under `docs/`, and gives agents one path from an idea to finished, recorded work. It's a live product, published on npm as `@brucewaynedecoy/make-docs`. Its code has lived in `kits/make-docs/` since copy day, copied from the `v2.0.6` tag. Until the switch point, its releases still come from the old `make-docs` repository. The npm package name and the install commands stay the same.

**Make Blueprint** turns a pile of client sources, such as documents, spreadsheets, slide decks, notes and meeting transcripts, into records about the systems a client runs today and the ones it plans to run. Every fact links back to the exact place in its source. From those records it compares systems capability by capability, records which system should own each capability and how it gets delivered, and links that decision to planned work in Make Docs. Each record is one Markdown file, so changes get reviewed in git like code.

Make Blueprint used to be called BuildOS. Version 2.0 is designed and planned in `kits/make-blueprint/`, down to a phased work backlog, but no code is written yet. BuildOS v1 stays in its own `build-os` repository and only gets bug fixes. A one-time import in 2.0 brings v1 projects across.

## Layout

```text
AGENTS.md, CLAUDE.md    map of the repo for agents, plus the Make Docs block
docs/                   repo-wide docs: the core, the setup tool, rules shared by kits
kits/make-blueprint/    Make Blueprint, with its own docs/
kits/make-docs/         Make Docs, copied from v2.0.6, with its own docs/
packages/core/          the shared core (planned)
packages/kit/           the make-kit setup tool (planned)
```

Each kit folder is its own Make Docs project, with its own `docs/` folder and config. The root `docs/` is only for work that crosses kits.

## What comes next

The [monorepo design](docs/designs/2026-10-30-make-kit-monorepo.md) sets the order:

1. **Step 0.** Copy Make Docs into `kits/make-docs/` without its git history, move its CI here, and pull the shared core out into `packages/core/` as `@brucewaynedecoy/make-core`. At the switch point, Make Docs releases start coming from this repository. The npm package name and the install commands stay the same.
2. **The setup tool.** `make-kit setup` asks which kits and agent tools you want, once, then runs each kit's own setup. Kits read those choices from `.make/config.yaml`, and people and roles from `.make/personas.yaml`.
3. **Make Blueprint 2.0.** It supports Claude Code, Codex and GitHub Copilot CLI, and the setup tool ships with it.

Make Blueprint's later releases are planned too. In 2.1, one project can bundle a system and hand it to another project as a baseline. A local server and web app follow in 2.2, and test records in 2.3. A shared-database setup is planned for v3, with no design yet.

## Finding your way around

Agents should start with the root `AGENTS.md` or `CLAUDE.md`. It says which project a task belongs to and lists the temporary workarounds, O-001 to O-005, that nested Make Docs projects need until Make Docs fixes them.

For the reasoning behind all of this, read the [monorepo design](docs/designs/2026-10-30-make-kit-monorepo.md) first. Then go to Make Blueprint's [PRD index](kits/make-blueprint/docs/prd/00-index.md) and its [architecture design](kits/make-blueprint/docs/designs/2026-10-29-make-blueprint-v2-architecture.md).
