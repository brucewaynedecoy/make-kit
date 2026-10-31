# Make Kit Monorepo Map

This repository is the `make-kit` monorepo. Its folder may still be named `buildos` until the owner renames it. It holds several products, called kits, and the code they share. This section is written by hand. Make Docs does not manage it.

| Folder | What it holds | Where to read first |
| --- | --- | --- |
| `docs/` | Repo-wide docs: the shared core, the `make-kit` setup tool, the shared `.make/` rules and decisions that cross kits | The Make Docs block below and `docs/CLAUDE.md` |
| `packages/core/` | The shared core (planned for Step 0; not here yet) | Repo-wide docs |
| `packages/kit/` | The `make-kit` setup tool (planned; not here yet) | Repo-wide docs |
| `kits/make-blueprint/` | Make Blueprint, formerly BuildOS v2 | `kits/make-blueprint/CLAUDE.md` |
| `kits/make-docs/` | Make Docs (copied in at Step 0; not here yet) | `kits/make-docs/CLAUDE.md` |

Where to go:

- For work on one kit, read that kit's own `CLAUDE.md` or `AGENTS.md` first and use that kit's `docs/` folder. Each kit folder is its own Make Docs project with its own `.make-docs/config.yaml`.
- For repo-wide work or work that crosses kits, use the root `docs/` folder and the Make Docs block below.
- If you cannot tell which project a task belongs to, ask the person before you write anything.

Temporary workarounds. Each one is a planned deferred obligation in the root PRD register, which is created with the root PRDs. Remove each workaround when Make Docs ships its fix; do not treat any of them as the normal way of working.

1. Every kit keeps a `docs/work/` folder, even when it is empty, so the Make Docs upward folder search stops at the kit. (O-001)
2. Run `make-docs` commands for a kit from inside the kit folder, or pass the kit folder with `--repo-root` or `--target-root`. (O-002)
3. Pass the kit folder as `targetRoot` on every Make Docs MCP call for a kit. (O-003)
4. Links between a kit's docs and the root docs use `../` paths. Make Docs does not check those links, so check them by hand during validation. (O-004)

<!-- make-docs:begin -->
# Agent Instructions

- When asked to create documentation for this project that is not `README.md`, read the same-named instruction file in `docs/` before writing.
- For documentation lifecycle order or skip/reorder/revisit decisions, use a valid local `.make-docs/system/references/lifecycle.md` first. If that body is absent, read `make-docs://system/reference/lifecycle.md` with `make-docs resource read`, and surface departures from the default arc.
- For governed work and material task updates, decisions, recommendations, error or limit reports, and completion replies, use the applicable lifecycle guidance plus valid local bodies for `.make-docs/system/contracts/human-experience-contract.md` and `.make-docs/system/references/human-experience.md`. If a body is absent, read its matching `make-docs://system/contract/human-experience-contract.md` or `make-docs://system/reference/human-experience.md` resource with `make-docs resource read`.
- A project can use Make Docs without Store access. If a Store-backed operation reports `store-not-configured`, `store-unavailable`, `store-unsafe`, or `store-denied`, stop only that operation, report its exact action, and continue independent Store-free work. Refresh access and retry only that operation after setup or repair. When the task repairs Make Docs setup, MCP, or Store access, missing Store or MCP access is evidence and must not block the repair.
- Before staging or committing changes, use a valid local `.make-docs/system/contracts/commit-message-convention.md` first. If that body is absent, read `make-docs://system/contract/commit-message-convention.md` with `make-docs resource read`.
- Do not infer optional Skills, plugins, Playbooks, Protocols, or unavailable policy from this router.
<!-- make-docs:end -->
