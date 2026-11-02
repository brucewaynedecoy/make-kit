---
title: "Phase 2: Kit Conventions"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P2"
---

# Phase 2: Kit Conventions

## Purpose

Write `05-kit-conventions.md`: the rules that every kit follows. Make Docs is the reference kit. Each rule comes from the Make Docs code at `v2.0.6`, not from the Make Blueprint PRDs (Q-015).

## Write Scope

`docs/prd/05-kit-conventions.md` only. The worker's final report lists each Make Docs gap for the register in [Phase 4](04-register-and-assembly.md), and each glossary term.

- Front matter: set `source.type` to `plan` and `source.path` to `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md`.
- Use the section headings of the `prd-subsystem.md` template: `## Purpose`, `## Scope`, `## Component and Capability Map`, `## Contracts and Data`, `## Integrations`, `## Rebuild Notes`, `## Source Anchors`.

## Rule Shape

For each rule, the PRD states:

1. The target rule that every kit follows.
2. What Make Docs does today, with a `v2.0.6` file anchor.
3. The gap, when the two differ. Each gap names its later Make Docs fix or says that Make Docs keeps its current behavior as an allowed exception.

Where this design sets a target (for example `.make/<kit>/`), the target wins. Where Make Docs is not consistent with itself, the PRD picks one target rule and records the gap. The PRD states rules, not change steps.

## Source Anchor Format

The Make Docs code is not in this repository until copy day. Write each code anchor as plain code text, not as a link, in this form: `make-docs v2.0.6: packages/cli/src/cli.ts:121`. The copy-day backlog phase changes each anchor to a link into `kits/make-docs/`.

## Rule Areas

The facts below come from the interview. They were read from a work branch, so the discovery pass checks each one at `v2.0.6` before the worker writes it.

| Area | Facts to check at `v2.0.6` | Known gap |
| --- | --- | --- |
| CLI top level | Seven groups: `setup`, `project`, `resource`, `run`, `mcp`, `update`, `uninstall`. A bare command shows status. (`packages/cli/src/cli.ts`, Make Docs PRD 39) | None |
| `run <domain> <verb>` | Paths come from `ADMITTED_CLI_PATHS` in `packages/cli/src/operations/registry.ts`. Identifiers use `domain.verb` or `domain.object.verb`. | The `run` help example and `packages/cli/src/README.md` still name retired domains. |
| Outcomes and exit codes | 0 on success and 1 on a thrown error. A JSON error is `{ok:false, code, message}` on stderr, with the default code `operation-error`. Validators exit 1 when the status is not `passed`. Path hygiene uses 0, 1 and 2. Store codes are scoped to one operation. | No single exit-code table. The target rule is one table for every kit. |
| `--json` and `--dry-run` | `run` gives JSON with `--json` or with non-TTY output. `resource` uses `--format json`. `setup backup` and `setup remove` have neither flag. `run` has no `--dry-run`. | Three gaps: `--format json` on `resource`, no flags on `setup backup` and `setup remove`, and no `--dry-run` on `run`. |
| MCP server | `make-docs mcp [--profile]` over stdio, default profile `all`. Harness entries run the verified executable with the connection id and key in the environment. | None |
| MCP profiles and `allowWrite` | Profiles `core`, `setup`, `workflow`, `quality` and `backlog`, plus `all`. Profiles filter what is shown and never grant access. Only write tools take `allowWrite`, and a write without it fails. `dryRun` and `approvals` pass on every tool. | None |
| System resources and project records | System resources use `make-docs://system/{contract,prompt,reference,template}/<path>`, served from the installed package. A local copy under `.make-docs/system/` is optional. Project records are plain files with no URI. | None |
| Routers and managed blocks | One `<!-- make-docs:begin -->` and `<!-- make-docs:end -->` pair per file. Any other count is malformed. Upsert results: `inserted`, `updated`, `reasserted`, `noop`. Sync removal keeps the text outside the block. Routers use progressive disclosure: a short router points to resources. | Block markers are not tag-aware, so two kits cannot share one instruction file safely. Make Docs 2.2.0 fixes this on the core (Q-007). |
| Project config | Target: shared `.make/config.yaml` and each kit's `.make/<kit>/config.yaml`. Make Docs today: `.make-docs/config.yaml` with `projectId`, `labels`, `personas`, `generatedProse`, `harnessCapabilities`, `harnessIntegrations` and `prd_authority`. | Make Docs uses `.make-docs/`, not `.make/docs/`. The `.make/docs/` move is a later Make Docs wave. |
| Machine folders | Target: `~/.make/<kit>/` with a `MAKE_<KIT>_HOME` setting. Make Docs today: `~/.make-docs/` (under `LOCALAPPDATA` on Windows), with `MAKE_DOCS_HOME` or an explicit Store root. | Make Docs uses `~/.make-docs/`, not `~/.make/docs/`. |
| Store boundary | Project knowledge lives in git. The Store holds only operational state: installation ledgers, checkouts, locks, operations, the project registry mirror, lifecycle runs and evidence, migration receipts, the tool-operations journal and the backlog cache. | The Store README still calls `.make-docs/manifest.json` canonical. |

## Exit Criteria

- Every rule area above has a target rule, the Make Docs behavior with a `v2.0.6` anchor, and a gap or "None".
- The PRD names Make Docs as the reference kit.
- The final report lists every gap with its rule area, its anchor and the Make Docs fix or exception, so Phase 4 can write one `D-###` item for each.
- No rule comes only from a Make Blueprint PRD.
