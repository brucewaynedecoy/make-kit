---
title: "05 Kit Conventions"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md"
---

# 05 Kit Conventions

## Purpose

This document owns the rules that every kit in Make Kit follows. A kit that follows them has the same CLI shape, exit codes, JSON output, MCP server shape, resource URIs, managed blocks, project and machine folders, and Store boundary as every other kit.

Make Docs is the reference kit ([Q-015 Kit Conventions Source](03-open-questions-and-risk-register.md#q-015-kit-conventions-source), [Q-019 Make Docs PRDs and Kit Conventions](03-open-questions-and-risk-register.md#q-019-make-docs-prds-and-kit-conventions)). Each rule comes from the Make Docs code at the tag `v2.0.6` (commit `ff0b97dc`). Where the [Make Kit Monorepo](../designs/2026-10-30-make-kit-monorepo.md#13-repo-wide-prds-and-kit-conventions) design sets a different target, the design target is the rule. Where Make Docs is not consistent with itself, this document states one target rule.

Each place where Make Docs at `v2.0.6` differs from a target rule is a gap. Each gap has one `D-###` item under Confirmed Drift in [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md). The Make Docs PRDs keep their own text, because they describe live code. From Make Docs 2.1.0, they link to this document (Q-019).

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Decision, sections 6, 7 and 13)
- `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/02-kit-conventions.md`
- `make-docs v2.0.6: packages/cli/src/cli.ts:120`

## Scope

This document covers these rules:

- The CLI: the top level, the `run` command paths, outcomes and exit codes, `--json` and `--dry-run`, CLI write intent, and the project target.
- The MCP server, its profiles and `allowWrite`.
- System resources compared with project records.
- Routers and managed blocks.
- Project config, machine folders and the Store boundary.

Other documents own these subjects:

| Subject | Owner |
| --- | --- |
| The code that carries these rules for every kit, kit names as inputs to that code, tool discovery, and Store schema version 6 | [06 Shared Core](06-shared-core.md) |
| `make-kit setup`, and the fields and write rules of `.make/config.yaml`, `.make/<kit>/config.yaml` and `.make/personas.yaml` | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) |
| Package names, CI, release tags and the publish workflow | [08 Build and Release](08-build-and-release.md) |
| Docs roots, the root map and the routing check | [02 Architecture Overview](02-architecture-overview.md#several-docs-roots) |
| The temporary nested-project workarounds O-001 to O-005 | [Deferred Obligations](03-open-questions-and-risk-register.md#deferred-obligations) in the register |
| Each kit's own commands, operation domains and product records | That kit's own PRD set |

Each rule area below has three parts:

1. **Target rule.** The rule that every kit follows. Each bullet states an observable result.
2. **Make Docs at `v2.0.6`.** What the reference kit does, with a code anchor.
3. **Gaps.** Each difference, with its `D-###` item and its fix, or "None".

Each code anchor is plain code text in the form `make-docs v2.0.6: packages/cli/src/cli.ts:120`. The path is relative to the root of the Make Docs source tree at the tag `v2.0.6`. The Make Docs code is not in this repository on 2026-11-01, so the anchors are not links.

A gap names a Make Docs release only where an accepted decision sets one. Every other gap has no release set yet, and the register tracks it.

Code anchors:

- `make-docs v2.0.6: packages/cli/src/`
- `make-docs v2.0.6: packages/docs/template/`
- `make-docs v2.0.6: docs/prd/`

## Component and Capability Map

| Rule area | What it covers | Gaps |
| --- | --- | --- |
| [CLI Top Level](#cli-top-level) | The seven top-level commands, the long-running lifecycle command, the bare command, `--version` and help | D-001 to D-003 |
| [Run Command Paths](#run-command-paths) | Operation identifiers, CLI paths, usage text and MCP tool names | D-004 to D-007 |
| [Outcomes and Exit Codes](#outcomes-and-exit-codes) | Exit codes, result and error shapes, Store codes | D-008 to D-014 |
| [JSON Output and Dry Run](#json-output-and-dry-run) | `--json`, non-TTY output and `--dry-run` | D-015 to D-021 |
| [CLI Write Intent](#cli-write-intent) | How a CLI command gets permission to write, and preview-first commands | D-022 |
| [Project Target](#project-target) | The target flag names and the project-root search | D-023, D-024 |
| [MCP Server](#mcp-server) | `<kit-cli> mcp`, the server name, the tools and the agent-tool entries | D-025 to D-028 |
| [MCP Profiles and Write Permission](#mcp-profiles-and-write-permission) | Intent profiles, `allowWrite`, `dryRun` and `approvals` | None |
| [System Resources and Project Records](#system-resources-and-project-records) | Resource URIs, the catalog, local copies and project records | None |
| [Routers and Managed Blocks](#routers-and-managed-blocks) | Router places, block markers, block results, block removal and the short-router budget | D-029 to D-032 |
| [Project Config](#project-config) | `.make/` shared files, `.make/<kit>/` kit config, config key styles and the project tool directory | D-033 to D-036, D-041 |
| [Machine Folders](#machine-folders) | `~/.make/<kit>/`, `MAKE_<KIT>_HOME` and the Store root on each operating system | D-037 to D-039 |
| [Store Boundary](#store-boundary) | Project knowledge in git, operational state in the Store | D-040 |

### Rules for Every Area

- Each kit follows these rules alone. No rule needs another kit to be installed ([Separate or Together](01-product-overview.md#separate-or-together)).
- Where a rule here does not state a detail, the behavior of the reference kit at the cited anchor is the rule.
- The help text, the package README, the source READMEs, the MCP tool descriptions and the kit's own PRDs state the behavior of the code in the same release. Each place where they differ from the code is a gap.
- Rules use the placeholders `<kit-cli>`, `<kit>` and `<KIT>` from [Name Placeholders](#name-placeholders).
- This document says "agent tool" for an AI coding agent such as Codex, Claude Code or GitHub Copilot. The Make Docs code calls an agent tool a harness.

### CLI Top Level

Target rule:

- `<kit-cli> --help` lists the seven top-level commands: `setup`, `project`, `resource`, `run`, `mcp`, `update` and `uninstall`. When the kit has a long-running lifecycle command, the help also lists that command.
- A kit can add at most one more top-level command. That command is a lifecycle command that starts a long-running process, such as a local server. The kit's own PRDs name it. A kit adds no other top-level command.
- `setup` sets up the kit in one project. `setup remove` removes the kit from one project. `uninstall` removes the kit from the machine.
- `uninstall` keeps the kit's Store unless the person passes `--remove-store`.
- `update` finds the install manager that installed the kit and hands the update to it.
- `<kit-cli> --version` and `<kit-cli> -v` print the kit version and do nothing else.
- Bare `<kit-cli>`, with the kit installed in the target project, prints status and help and changes no file.
- Bare `<kit-cli>`, with no install and a TTY, starts guided setup. With no install and no TTY, it prints a hint and exits 0.
- Bare `<kit-cli>` accepts only the project target flag and `--help`.
- A retired command fails, and its message names the current spelling.
- The top-level help and the help of each group list every command path that the kit admits in that group.

Make Docs at `v2.0.6`:

- The CLI has the seven top-level commands. `make-docs v2.0.6: packages/cli/src/cli.ts:120` (type at `make-docs v2.0.6: packages/cli/src/cli.ts:122`, parser at `make-docs v2.0.6: packages/cli/src/cli.ts:2224`). The Make Docs rule is R-TOP-1, `make-docs v2.0.6: docs/prd/39-cli-command-model-and-operation-registry.md:35`. Make Docs has no long-running lifecycle command.
- `setup` has the subcommands `system`, `reconfigure`, `skills`, `backup` and `remove`. `make-docs v2.0.6: packages/cli/src/cli.ts:130`.
- `--version` and `-v` print the version before the parser runs. `make-docs v2.0.6: packages/cli/src/cli.ts:350`.
- The bare command is context-aware. With an install, it prints status and help and never syncs (`make-docs v2.0.6: packages/cli/src/cli.ts:511`, `printInstallStatus` at `make-docs v2.0.6: packages/cli/src/cli.ts:517`). With no install and no TTY, it prints a hint and exits 0 (`make-docs v2.0.6: packages/cli/src/cli.ts:524`). It accepts only `--target` and `--help` (`make-docs v2.0.6: packages/cli/src/cli.ts:2770`). The Make Docs rule is R-BARE-1, `make-docs v2.0.6: docs/prd/39-cli-command-model-and-operation-registry.md:41`.
- The removed commands `init`, `reconfigure`, `skills`, `backup` and `operations` fail and name the current spelling. `make-docs v2.0.6: packages/cli/src/cli.ts:2540`.
- `uninstall` keeps the Store unless `--remove-store` is set (`make-docs v2.0.6: packages/cli/src/self/uninstall-tool.ts:84`, `make-docs v2.0.6: packages/cli/src/self/uninstall-tool.ts:128`). The Make Docs rule is R-SELF-1, `make-docs v2.0.6: docs/prd/39-cli-command-model-and-operation-registry.md:77`.
- `update` records a tool operation and hands the update to the install manager (`make-docs v2.0.6: packages/cli/src/self/update-tool.ts:178`). The install managers are npm, pnpm, bun and Homebrew (`make-docs v2.0.6: packages/cli/src/self/install-manager.ts:80`).

Gaps:

| Gap | Make Docs at `v2.0.6` | Fix |
| --- | --- | --- |
| [D-001 Top-Level Help Hides Project Commands](03-open-questions-and-risk-register.md#d-001-top-level-help-hides-project-commands) | The top-level help lists only four `project` paths (`make-docs v2.0.6: packages/cli/src/cli.ts:3673`). `project --help` lists only path hygiene (`make-docs v2.0.6: packages/cli/src/cli.ts:3547`). The CLI also admits `project persona list`, the four `project layout` verbs, `project checkout-move` and `project checkout-register` (`make-docs v2.0.6: packages/cli/src/run/root-operations.ts:220`, `make-docs v2.0.6: packages/cli/src/operations/registry.ts:190`). | No release is set yet. The register tracks it. |
| [D-002 Uninstall Text Disagrees With Store Removal](03-open-questions-and-risk-register.md#d-002-uninstall-text-disagrees-with-store-removal) | The `uninstall` help says that it removes "the global store at ~/.make-docs/" (`make-docs v2.0.6: packages/cli/src/cli.ts:3652`). Its options list leaves out `--remove-store` (`make-docs v2.0.6: packages/cli/src/cli.ts:3662`). The command prints "The global Store is preserved" also when `--remove-store` is set (`make-docs v2.0.6: packages/cli/src/self/uninstall-tool.ts:126`). Make Docs PRD 16 says that `uninstall` removes the Store (`make-docs v2.0.6: docs/prd/16-package-runtime-and-deployment-boundaries.md:18`), but R-SELF-1 keeps it. | Make Docs 2.2.0 on the core, with the uninstall fix ([Q-035 Scope of the Uninstall Fix in 2.2.0](03-open-questions-and-risk-register.md#q-035-scope-of-the-uninstall-fix-in-220)). |
| [D-003 Package README Names an Old Version](03-open-questions-and-risk-register.md#d-003-package-readme-names-an-old-version) | The README in the 2.0.6 package says "Make Docs 2.0.4 needs Node.js 24". `make-docs v2.0.6: packages/cli/README.md:7`. | No release is set yet. The register tracks it. |

### Run Command Paths

Target rule:

- Each kit has one operation registry. The CLI paths, the usage text, the `run` help and every registry-derived MCP tool come from that registry.
- Each operation identifier has the form `domain.verb` or `domain.object.verb`. Each segment is lowercase. A segment with more than one word uses hyphens, for example `work.backlog-cache.lookup`.
- Identifiers are stable and append-only.
- The registry maps each identifier to one CLI root, `run`, `project` or `resource`, and to one command path below that root.
- The usage text shows both path shapes: `<kit-cli> run <domain> <verb>` and `<kit-cli> run <domain> <object> <verb>`.
- Each example in the help runs a current identifier.
- Each identifier has a CLI adapter. A call to an identifier with no adapter fails, and the message names the identifier.
- Each registry-derived MCP tool name comes from one name map beside the registry. The tool name keeps the verb of its identifier.

Make Docs at `v2.0.6`:

- The registry admits 43 identifiers. `make-docs v2.0.6: packages/cli/src/operations/registry.ts:130`.
- `ADMITTED_CLI_PATHS` maps each identifier to a CLI root and a path: 26 below `run`, 14 below `project` and 3 below `resource`. `make-docs v2.0.6: packages/cli/src/operations/registry.ts:176`. The fixed usage strings are at `make-docs v2.0.6: packages/cli/src/operations/registry.ts:222`, and the fallback path rule is at `make-docs v2.0.6: packages/cli/src/operations/registry.ts:263`.
- The identifier pattern is at `make-docs v2.0.6: packages/cli/src/operations/registry.ts:127`, and the registry enforces it at `make-docs v2.0.6: packages/cli/src/operations/registry.ts:335`.
- The source README says that identifiers are stable, lowercase, dot-separated and append-only. `make-docs v2.0.6: packages/cli/src/README.md:41`.
- `run` builds its help from the registry. Its example `run work item resolve` runs `work.item.resolve`. `make-docs v2.0.6: packages/cli/src/run/cli.ts:449`.
- A call to an identifier with no CLI adapter fails loudly (`make-docs v2.0.6: packages/cli/src/run/cli.ts:512`). The table of intent-named spellings is empty (`make-docs v2.0.6: packages/cli/src/run/cli.ts:59`).
- The MCP tool names come from the hand-written map `MCP_TOOL_NAME_BY_OPERATION`. `make-docs v2.0.6: packages/cli/src/mcp/tools.ts:137`.

Gaps:

| Gap | Make Docs at `v2.0.6` | Fix |
| --- | --- | --- |
| [D-004 Run Help Names a Retired Domain](03-open-questions-and-risk-register.md#d-004-run-help-names-a-retired-domain) | The hand-written `run` help shows the example `make-docs run package plan --harness codex ...` (`make-docs v2.0.6: packages/cli/src/cli.ts:3591`). Make Docs R-GRAM-1 says that `run package` is not a current surface (`make-docs v2.0.6: docs/prd/39-cli-command-model-and-operation-registry.md:275`). | No release is set yet. The register tracks it. |
| [D-005 CLI Source Notes Name Retired Domains](03-open-questions-and-risk-register.md#d-005-cli-source-notes-name-retired-domains) | The CLI source README names `playbook` and `package` as the registered domains. It leaves out `prd`, `performance`, `backlog`, `resource`, `project`, `lifecycle` and `uat` (`make-docs v2.0.6: packages/cli/src/README.md:41`). It says that the `lifecycle` dispatcher was pruned, but `lifecycle` is a live domain (`make-docs v2.0.6: packages/cli/src/README.md:47`). A code comment points to the removed `src/operations/cli.ts` (`make-docs v2.0.6: packages/cli/src/operations/cli-options.ts:5`). The type `OperationDomainName` lists only `closeout`, `work`, `lifecycle` and `prd` (`make-docs v2.0.6: packages/cli/src/operations/types.ts:16`). | No release is set yet. The register tracks it. |
| [D-006 Run Usage Shows Two Segments](03-open-questions-and-risk-register.md#d-006-run-usage-shows-two-segments) | The usage text shows `make-docs run <domain> <verb>` (`make-docs v2.0.6: packages/cli/src/cli.ts:3586`, `make-docs v2.0.6: packages/cli/src/cli.ts:2547`). Most `run` paths have three segments. | No release is set yet. The register tracks it. |
| [D-007 MCP Tool Names Change the Operation Verb](03-open-questions-and-risk-register.md#d-007-mcp-tool-names-change-the-operation-verb) | Some tool names change or drop the verb of the identifier. `work.backlog-cache.lookup` is `backlog_cache_read`, and `project.persona.list` is `personas`. `make-docs v2.0.6: packages/cli/src/mcp/tools.ts:137`. | No release is set yet. The register tracks it. |

### Outcomes and Exit Codes

Target rule:

- Each command of each kit exits with a code from the [Exit-Code Table](#exit-code-table). The kit sets the exit code in one place, from the result status.
- A validator exits 1 when its status is not `passed`.
- A command that does not finish its work exits 1. Examples: the person cancels it, a non-interactive run refuses it, or a manual step is left.
- A machine-readable result goes to stdout. A machine-readable error goes to stderr. Both use the shapes in [Result and Error Shapes](#result-and-error-shapes).
- Each kind of error has its own stable `code`. The code `operation-error` is only for an error with no more exact kind.
- A Store error applies to one operation only. It carries `scope: "operation"` and `taskCanContinue: true`, and the task continues with its Store-free work.
- An MCP tool error is `isError: true` with the same fields as the CLI error.

Make Docs at `v2.0.6`:

- The entry returns 0 on success and 1 on a thrown error (`make-docs v2.0.6: packages/cli/src/run/entry.ts:21`). An exit code that a command set earlier stays (`make-docs v2.0.6: packages/cli/src/index.ts:10`).
- A machine-readable error is `{ok:false, code, message, ...}` on stderr (`make-docs v2.0.6: packages/cli/src/run/entry.ts:13`). Error output is machine-readable when stdout is not a TTY, or with `--json`, or with `--format json` (`make-docs v2.0.6: packages/cli/src/run/entry.ts:33`).
- The default code is `operation-error` (`make-docs v2.0.6: packages/cli/src/operations/context.ts:203`). The optional fields are `operation`, `reason`, `nextAction`, `scope`, `taskCanContinue`, `details`, `uri`, `path`, `runId` and `issue`.
- Only `prd.authority.validate` and `performance.evidence.validate` exit 1 when the status is not `passed`. `make-docs v2.0.6: packages/cli/src/run/cli.ts:583`.
- Path hygiene exits 0 when the files are clean, 1 on findings, and 2 on read errors or a thrown error. `make-docs v2.0.6: packages/cli/src/cli.ts:1845`, `make-docs v2.0.6: packages/cli/src/cli.ts:1848`.
- `project layout` and `project persona` exit 1 when the result status is `blocked`. `make-docs v2.0.6: packages/cli/src/run/root-operations.ts:485`.
- The Store codes are `store-not-configured`, `store-unavailable`, `store-unsafe` and `store-denied` (`make-docs v2.0.6: packages/cli/src/operations/store-access.ts:3`). Each one carries `scope: "operation"` and `taskCanContinue: true` (`make-docs v2.0.6: packages/cli/src/operations/store-access.ts:12`).
- An MCP tool error is `isError: true` with the same serialized fields and no `ok` field. `make-docs v2.0.6: packages/cli/src/mcp/server.ts:108`.

Gaps:

| Gap | Make Docs at `v2.0.6` | Fix |
| --- | --- | --- |
| [D-008 No Single Exit-Code Table](03-open-questions-and-risk-register.md#d-008-no-single-exit-code-table) | Four places set exit codes: `make-docs v2.0.6: packages/cli/src/run/entry.ts:21`, `make-docs v2.0.6: packages/cli/src/run/cli.ts:583`, `make-docs v2.0.6: packages/cli/src/cli.ts:1845` and `make-docs v2.0.6: packages/cli/src/run/root-operations.ts:485`. | No release is set yet. The register tracks it. |
| [D-009 Update and Uninstall Exit 0 When Not Finished](03-open-questions-and-risk-register.md#d-009-update-and-uninstall-exit-0-when-not-finished) | `update` and `uninstall` return `refused-non-interactive`, `cancelled`, `manual-binary-removal-required`, `delegate-failed` or `manual-update-required` without an error. The CLI does not use the result for the exit code, so they exit 0. `make-docs v2.0.6: packages/cli/src/cli.ts:389`, `make-docs v2.0.6: packages/cli/src/self/uninstall-tool.ts:103`, `make-docs v2.0.6: packages/cli/src/self/update-tool.ts:189`. | No release is set yet. The register tracks it. |
| [D-010 UAT Validators Exit 0 When Not Passed](03-open-questions-and-risk-register.md#d-010-uat-validators-exit-0-when-not-passed) | The six `uat.*.validate` operations exit 0 when the status is not `passed`. `make-docs v2.0.6: packages/cli/src/run/cli.ts:583`. | No release is set yet. The register tracks it. |
| [D-011 Input Errors Exit 1 Outside Path Hygiene](03-open-questions-and-risk-register.md#d-011-input-errors-exit-1-outside-path-hygiene) | Outside path hygiene, an input error throws and exits 1 (`make-docs v2.0.6: packages/cli/src/run/entry.ts:21`). Path hygiene exits 2 on read errors and also on every other thrown error (`make-docs v2.0.6: packages/cli/src/cli.ts:1848`). | No release is set yet. The register tracks it. |
| [D-012 Path Hygiene Errors Skip the JSON Error Shape](03-open-questions-and-risk-register.md#d-012-path-hygiene-errors-skip-the-json-error-shape) | A path-hygiene error prints the plain text `Path check error: ...`, also in JSON mode. `make-docs v2.0.6: packages/cli/src/cli.ts:1847`. | No release is set yet. The register tracks it. |
| [D-013 Success JSON Has No `ok` Field](03-open-questions-and-risk-register.md#d-013-success-json-has-no-ok-field) | `run` prints the raw result with no `ok` field (`make-docs v2.0.6: packages/cli/src/run/cli.ts:578`). Only the error shape has `ok`. | No release is set yet. The register tracks it. |
| [D-014 Gate Errors Share One Code](03-open-questions-and-risk-register.md#d-014-gate-errors-share-one-code) | A refused write and a missing approval each have their own error class but no `code`, so both serialize as `operation-error`. `make-docs v2.0.6: packages/cli/src/operations/context.ts:110`, `make-docs v2.0.6: packages/cli/src/operations/context.ts:117`, `make-docs v2.0.6: packages/cli/src/operations/registry.ts:520`. A pending operation has its own code, `operation-pending` (`make-docs v2.0.6: packages/cli/src/operations/context.ts:130`). | No release is set yet. The register tracks it. |

### JSON Output and Dry Run

Target rule:

- Each command that prints a result prints JSON when `--json` is set or when stdout is not a TTY. On a TTY without `--json`, it prints text for people.
- `--json` is the only flag that asks for JSON. No command uses `--format json`.
- Each command that writes a project file, the Store or an agent-tool config file takes `--dry-run`. With `--dry-run`, the command reports the result that it would give and writes nothing.
- `--dry-run` is a boolean flag. It takes no value.
- A preview-first command also takes `--dry-run`. On a preview-first command, `--dry-run` does the same as the default run. [CLI Write Intent](#cli-write-intent) owns the preview-first rule.
- A command whose verb names a preview, such as `preview` or `plan`, never writes. It needs no `--dry-run`.

Make Docs at `v2.0.6`:

- `run` prints JSON with `--json` or when stdout is not a TTY. `make-docs v2.0.6: packages/cli/src/run/cli.ts:566`, `make-docs v2.0.6: packages/cli/src/run/render.ts:10`.
- `setup` and `setup reconfigure` print JSON with `--json` or on a non-TTY (`make-docs v2.0.6: packages/cli/src/cli.ts:502`). `setup system` does the same (`make-docs v2.0.6: packages/cli/src/cli.ts:447`).
- `resource ensure` takes `--dry-run`, `--allow-write` and `--approve`. `make-docs v2.0.6: packages/cli/src/run/root-operations.ts:76`.
- `project state recover` takes `--dry-run` and `--json`. `make-docs v2.0.6: packages/cli/src/cli.ts:3673`.

Gaps:

| Gap | Make Docs at `v2.0.6` | Fix |
| --- | --- | --- |
| [D-015 Resource Commands Use a Format Flag for JSON](03-open-questions-and-risk-register.md#d-015-resource-commands-use-a-format-flag-for-json) | `resource list` uses `--format table\|json`, and `resource read` uses `--format raw\|json`. The defaults are `table` and `raw`. Neither command prints JSON on a non-TTY. `make-docs v2.0.6: packages/cli/src/run/root-operations.ts:69`, `make-docs v2.0.6: packages/cli/src/run/root-operations.ts:143`. | No release is set yet. The register tracks it. |
| [D-016 Setup Backup and Remove Lack JSON and Dry Run](03-open-questions-and-risk-register.md#d-016-setup-backup-and-remove-lack-json-and-dry-run) | `setup backup` and `setup remove` reject `--json` (`make-docs v2.0.6: packages/cli/src/cli.ts:2749`) and `--dry-run` (`make-docs v2.0.6: packages/cli/src/cli.ts:2787`). | No release is set yet. The register tracks it. |
| [D-017 Run Has No Dry Run](03-open-questions-and-risk-register.md#d-017-run-has-no-dry-run) | `--dry-run` is not in `BOOLEAN_FLAGS` (`make-docs v2.0.6: packages/cli/src/operations/cli-options.ts:17`), so `run` reads it as a flag that needs a value. Dry run is off unless a command spelling sets it (`make-docs v2.0.6: packages/cli/src/run/cli.ts:555`). | No release is set yet. The register tracks it. |
| [D-018 Setup Skills Has No JSON Output](03-open-questions-and-risk-register.md#d-018-setup-skills-has-no-json-output) | `setup skills` takes `--dry-run` but rejects `--json`. `make-docs v2.0.6: packages/cli/src/cli.ts:2749`. | No release is set yet. The register tracks it. |
| [D-019 Update and Uninstall Lack JSON and Dry Run](03-open-questions-and-risk-register.md#d-019-update-and-uninstall-lack-json-and-dry-run) | The `update` and `uninstall` parser accepts only `--help`, `--yes`, `--remove-store` and `--target`. `make-docs v2.0.6: packages/cli/src/cli.ts:2252`. | No release is set yet. The register tracks it. |
| [D-020 Project Commands Ignore a Non-TTY](03-open-questions-and-risk-register.md#d-020-project-commands-ignore-a-non-tty) | `project` commands print JSON only with an explicit `--json` (`make-docs v2.0.6: packages/cli/src/run/root-operations.ts:307`, `:361`, `:408`, `:486`, `:567`). On a non-TTY, their success output is text, but their error output is JSON (`make-docs v2.0.6: packages/cli/src/run/entry.ts:34`). | No release is set yet. The register tracks it. |
| [D-021 Path Hygiene Uses Its Own Output and Write Flags](03-open-questions-and-risk-register.md#d-021-path-hygiene-uses-its-own-output-and-write-flags) | Path hygiene uses `--format text\|json`, with JSON as the default also on a TTY (`make-docs v2.0.6: packages/cli/src/cli.ts:1770`, `make-docs v2.0.6: packages/cli/src/cli.ts:1802`). `repair` meets the preview-first rule in [CLI Write Intent](#cli-write-intent) (`make-docs v2.0.6: packages/cli/src/cli.ts:1806`), but the Make Docs PRDs do not name it as a preview-first command. | No release is set yet. The register tracks it. |

### CLI Write Intent

Target rule:

- On the CLI, the command that a person or an agent runs is the write intent. A command whose verb writes, writes without a separate permission flag such as `--allow-write` or `--apply`. A preview-first command is the one exception.
- `--dry-run` is the one way to run a write command with no write. A preview-first command also writes nothing by default.
- A kit can make a write command preview-first when a person must review a plan before a large write. The kit's own PRDs name each preview-first command.
- A preview-first command shows its plan and writes nothing by default. It writes only with `--apply`. `--apply` is the one flag name for this write in every kit, and no other command takes it.
- A preview-first command accepts `--dry-run`, and `--dry-run` does the same as the default run: the command shows its plan and writes nothing. `--apply` together with `--dry-run` is an input error, and the command writes nothing.
- The MCP tool of a preview-first command takes `apply`. The tool writes only when the call has both `apply: true` and `allowWrite: true`. A call without `apply: true` writes nothing.
- A person who runs a preview-first command with no flag sees the plan, and no file changes until the person runs the command again with `--apply`.
- Kit setup writes the agent-tool command rules, and the operation registry is their source. These rules control which kit commands an agent tool runs.
- On MCP, each write needs `allowWrite`. [MCP Profiles and Write Permission](#mcp-profiles-and-write-permission) owns that rule.

Make Docs at `v2.0.6`:

- `run` always allows writes. `make-docs v2.0.6: packages/cli/src/run/cli.ts:553`.
- `project` commands set write permission from the verb. `make-docs v2.0.6: packages/cli/src/run/root-operations.ts:302`, `:359`, `:405`, `:482`, `:564`.
- `resource ensure` writes only with an explicit `--allow-write`. `make-docs v2.0.6: packages/cli/src/run/root-operations.ts:195`.
- `project path-hygiene repair` is the one Make Docs command that takes `--apply`. It previews by default, writes only with `--apply`, takes `--dry-run` for the preview, and fails when `--apply` and `--dry-run` are both set (`make-docs v2.0.6: packages/cli/src/cli.ts:1806`, `make-docs v2.0.6: packages/cli/src/cli.ts:1814`). Its help says "Repair previews by default" (`make-docs v2.0.6: packages/cli/src/cli.ts:3552`). Its MCP tool `paths_repair` writes only with `apply: true`, `allowWrite` and no `dryRun` (`make-docs v2.0.6: packages/cli/src/operations/project/ops.ts:415`). The Make Docs PRDs do not name the command.
- The agent-tool command rules come from the registry (`make-docs v2.0.6: packages/cli/src/operations/registry.ts:400`). Setup writes them to `.codex/rules/make-docs.rules` and to `permissions.allow` for Claude Code (`make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:55`, `make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:81`).

Gaps:

| Gap | Make Docs at `v2.0.6` | Fix |
| --- | --- | --- |
| [D-022 CLI Write Permission Works Three Ways](03-open-questions-and-risk-register.md#d-022-cli-write-permission-works-three-ways) | `run` always allows writes, `project` commands decide by verb, and `resource ensure` needs `--allow-write` (anchors above). The path-hygiene `repair --apply` flag meets the preview-first rule. The Make Docs PRDs do not name `repair` as a preview-first command, and D-021 tracks that difference. | No release is set yet. The register tracks it. |

### Project Target

Target rule:

- Each CLI command that acts on a project takes the project folder as `--target-root <path>`. No CLI command uses another name for it.
- Each MCP tool that acts on a project takes the project folder as `targetRoot`.
- With no target, every command and every MCP tool uses the same search. The search starts at the working folder and walks up. It stops at the first folder that holds the kit's project config. When no folder holds it, the kit uses the working folder.
- In a git repository with nested projects, a command for one project changes no file in another project ([Runtime Boundaries](02-architecture-overview.md#runtime-boundaries)).
- The temporary workarounds for nested projects are records under [Deferred Obligations](03-open-questions-and-risk-register.md#deferred-obligations). This document does not repeat them.

Make Docs at `v2.0.6`:

- `setup` and `update` take `--target`. `make-docs v2.0.6: packages/cli/src/cli.ts:2306`, `make-docs v2.0.6: packages/cli/src/cli.ts:2267`.
- `resource` and path hygiene take `--target` or `--target-root`. `make-docs v2.0.6: packages/cli/src/run/root-operations.ts:43`, `make-docs v2.0.6: packages/cli/src/cli.ts:1780`. The other `project` commands take `--target-root`.
- Inside `run`, some operations take `--repo-root` (`make-docs v2.0.6: packages/cli/src/run/cli.ts:89`), and others take `--target-root` (`make-docs v2.0.6: packages/cli/src/run/cli.ts:215`).
- On MCP, the hand-written tools take `targetDir` (`make-docs v2.0.6: packages/cli/src/mcp/tools.ts:63`), and the registry-derived tools take `targetRoot`.
- The `run` default for `--repo-root` walks up to the nearest `.make-docs/config.yaml`. With none, it uses the working folder. `make-docs v2.0.6: packages/cli/src/run/cli.ts:73`.
- `findRepoRoot` walks up to the nearest `docs/work` folder or `.git`. `make-docs v2.0.6: packages/cli/src/operations/shared.ts:6`.

Gaps:

| Gap | Make Docs at `v2.0.6` | Fix |
| --- | --- | --- |
| [D-023 Target Flags Have Different Names](03-open-questions-and-risk-register.md#d-023-target-flags-have-different-names) | The CLI uses `--target`, `--target-root` and `--repo-root`. MCP uses `targetDir` and `targetRoot`. Anchors above. | No release is set yet. The register tracks it. |
| [D-024 Two Project Root Searches](03-open-questions-and-risk-register.md#d-024-two-project-root-searches) | The `run` default stops at `.make-docs/config.yaml` (`make-docs v2.0.6: packages/cli/src/run/cli.ts:73`). `findRepoRoot` stops at `docs/work` or `.git` (`make-docs v2.0.6: packages/cli/src/operations/shared.ts:6`). The second search is the cause of the O-001 workaround ([Deferred Obligations](03-open-questions-and-risk-register.md#deferred-obligations)). | Make Docs 2.1.0, with the nested-project fixes ([Q-014 Nested-Project Fixes](03-open-questions-and-risk-register.md#q-014-nested-project-fixes)). |

### MCP Server

Target rule:

- `<kit-cli> mcp` starts the kit's MCP server over stdio.
- `--profile <name>` selects one profile. It appears at most once and needs a value. An unknown name fails. With no `--profile`, the server uses the profile `all`.
- The MCP server name is `<kit-cli>`. The server version is the kit package version.
- The server lists the kit's hand-written tools and one registry-derived tool for each operation identifier. A registry-derived tool runs the same operation as the CLI.
- Each kit runs its own MCP server with its own profiles. The agent tool starts the server.
- Kit setup writes one entry for the kit in the MCP config of each selected agent tool. The entry name is `<kit-cli>` in every agent tool.
- The entry runs the verified kit executable with the arguments `mcp` and `--profile <name>`.
- The entry puts the connection id in `MAKE_<KIT>_MCP_CONNECTION_ID` and the connection key in `MAKE_<KIT>_MCP_CONNECTION_KEY`.
- The connection key is 32 random bytes in base64url. The machine config holds only the SHA-256 hash of the key. The server compares keys in constant time.
- No project file holds a connection key.

Make Docs at `v2.0.6`:

- `make-docs mcp [--profile <name>]` uses `all` as the default (`make-docs v2.0.6: packages/cli/src/cli.ts:383`). `--profile` appears at most once, needs a value and is validated (`make-docs v2.0.6: packages/cli/src/cli.ts:2287`).
- The transport is stdio only (`make-docs v2.0.6: packages/cli/src/mcp/server.ts:80`). Make Docs PRD 25 allows optional `/mcp/<profile>` HTTP paths (`make-docs v2.0.6: docs/prd/25-typescript-runtime-cli-mcp-operation-boundaries.md:67`), but no HTTP code exists.
- The server name and version come from the npm package. `make-docs v2.0.6: packages/cli/src/mcp/server.ts:34`.
- The server has six hand-written tools, `domains`, `install_status`, `manifest`, `config`, `compatibility` and `install_plan` (`make-docs v2.0.6: packages/cli/src/mcp/tools.ts:79`), and one registry-derived tool for each of the 43 identifiers.
- The server has native resources and one app resource, `ui://make-docs/backlog-review/v1.html`. `make-docs v2.0.6: packages/cli/src/mcp/resource-profiles.ts:11`, `make-docs v2.0.6: packages/cli/src/mcp/server.ts:62`.
- Agent-tool entries run the verified executable with `args: ["mcp"]` and put `MAKE_DOCS_MCP_CONNECTION_ID` and `MAKE_DOCS_MCP_CONNECTION_KEY` in the environment. Codex: `make-docs v2.0.6: packages/cli/src/harness-access/native.ts:612`. Copilot: `make-docs v2.0.6: packages/cli/src/harness-access/native.ts:627`. Claude Code: `make-docs v2.0.6: packages/cli/src/harness-access/native.ts:643`. The names are defined at `make-docs v2.0.6: packages/cli/src/mcp-connection.ts:4`. The executable check is at `make-docs v2.0.6: packages/cli/src/harness-access/contract.ts:346`. The server reads the environment at `make-docs v2.0.6: packages/cli/src/mcp/tools.ts:448`.
- The connection key is 32 random bytes in base64url. The machine config stores only its SHA-256 hash, and the match is timing-safe. `make-docs v2.0.6: packages/cli/src/mcp-connection.ts:15`, `make-docs v2.0.6: packages/cli/src/mcp-connection.ts:59`.

Gaps:

| Gap | Make Docs at `v2.0.6` | Fix |
| --- | --- | --- |
| [D-025 Agent-Tool Entry Name Has Two Spellings](03-open-questions-and-risk-register.md#d-025-agent-tool-entry-name-has-two-spellings) | Codex uses `mcp_servers.make_docs` (`make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:50`, `make-docs v2.0.6: packages/cli/src/harness-access/native.ts:617`). Claude Code, Copilot and generic clients use `mcpServers.make-docs` (`make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:74`, `make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:104`, `make-docs v2.0.6: packages/cli/src/generic-mcp-setup.ts:110`). | No release is set yet. The register tracks it. |
| [D-026 MCP Server Name Is the npm Package Name](03-open-questions-and-risk-register.md#d-026-mcp-server-name-is-the-npm-package-name) | The server name is `@brucewaynedecoy/make-docs`, not `make-docs`. `make-docs v2.0.6: packages/cli/src/mcp/server.ts:35`. | No release is set yet. The register tracks it. |
| [D-027 Agent-Tool Entries Always Run Profile All](03-open-questions-and-risk-register.md#d-027-agent-tool-entries-always-run-profile-all) | Each entry writes `args = ["mcp"]` with no `--profile`, so every entry runs the default profile `all`. `make-docs v2.0.6: packages/cli/src/harness-access/native.ts:619`. | No release is set yet. The register tracks it. |
| [D-028 Manifest Tool Description Names a Legacy File](03-open-questions-and-risk-register.md#d-028-manifest-tool-description-names-a-legacy-file) | The `manifest` tool says that it reads `.make-docs/manifest.json` (`make-docs v2.0.6: packages/cli/src/mcp/tools.ts:102`). `loadManifest` reads the Store installation ledger (`make-docs v2.0.6: packages/cli/src/manifest.ts:155`). | No release is set yet. The register tracks it. |

### MCP Profiles and Write Permission

Target rule:

- Each kit declares its intent profiles and the profile `all`. The profile `all` shows every tool.
- A profile filters the tools that the server lists and accepts. A call to a tool outside the active profile fails as an unknown tool.
- A profile never grants access. The operation status and the host access alone decide whether a call is admitted.
- An unknown profile name fails. The message lists the allowed names.
- Each tool whose operation writes takes `allowWrite`. A write call without `allowWrite: true` fails before the operation runs. The required approvals are checked next.
- Each registry-derived tool takes `dryRun` and `approvals`, and the server passes them to the operation.
- A hand-written tool that only reads needs no `allowWrite`, `dryRun` or `approvals`.

Make Docs at `v2.0.6`:

- The intent profiles are `core`, `setup`, `workflow`, `quality` and `backlog`, plus `all`. `make-docs v2.0.6: packages/cli/src/operations/mcp-metadata.ts:2`, `make-docs v2.0.6: packages/cli/src/operations/mcp-metadata.ts:6`. An unknown profile fails with the allowed list (`make-docs v2.0.6: packages/cli/src/operations/mcp-metadata.ts:15`).
- A call to a hidden tool fails as "Unknown make-docs MCP tool" (`make-docs v2.0.6: packages/cli/src/mcp/tools.ts:396`, `make-docs v2.0.6: packages/cli/src/mcp/tools.ts:397`). MCP admission depends on status and host access, never on the profile (`make-docs v2.0.6: packages/cli/src/operations/registry.ts:293`).
- `allowWrite` appears only on tools whose operation writes (`make-docs v2.0.6: packages/cli/src/mcp/tools.ts:229`). A write without it throws `OperationWriteDeniedError` (`make-docs v2.0.6: packages/cli/src/operations/registry.ts:520`). The required approvals are checked next (`make-docs v2.0.6: packages/cli/src/operations/registry.ts:526`).
- `dryRun` and `approvals` are on every registry-derived tool (`make-docs v2.0.6: packages/cli/src/mcp/tools.ts:230`), and the server passes them to the execution context (`make-docs v2.0.6: packages/cli/src/mcp/tools.ts:439`).
- The six hand-written tools take only `targetDir` or nothing (`make-docs v2.0.6: packages/cli/src/mcp/tools.ts:79`). They read state and write nothing. `install_plan` makes a plan with no file writes.
- The Make Docs rules are R-MCP-PROFILE-1 to R-MCP-PROFILE-5. `make-docs v2.0.6: docs/prd/25-typescript-runtime-cli-mcp-operation-boundaries.md:62`.

Gaps: None. The hand-written tools take no `dryRun` or `approvals`, but they do not write, so the target rule does not require them.

### System Resources and Project Records

Target rule:

- Each system resource has the URI `<kit-cli>://system/<type>/<path>`. The type is `contract`, `prompt`, `reference` or `template`. The path is a POSIX relative path.
- The installed kit package serves each system resource through a catalog in the package. Each catalog entry uses the identity template `<kit-cli>://system/{type}/{path}`.
- A local copy in the project is optional. Its absence does not stop the kit from serving the installed body.
- A local copy lives below the kit's project tool directory in `system/<type folder>/`. One table in the kit maps each singular URI type to its plural folder. [Resource Identity](#resource-identity) shows the map.
- `<kit-cli> resource list` lists the resources, and `<kit-cli> resource read <uri>` reads one.
- Project records are plain files in the project, such as designs, plans, PRDs and work. They have no URI. Agents read them by their relative path.
- Each URI that a kit makes starts with the kit's own name: `<kit-cli>://system/` for system resources, `<kit-cli>://store/` for links to Store records, and `ui://<kit-cli>/` for MCP app resources.

Make Docs at `v2.0.6`:

- The URI prefix is `make-docs://system/` (`make-docs v2.0.6: packages/cli/src/operations/resource/identity.ts:9`). The types are `contract`, `prompt`, `reference` and `template` (`make-docs v2.0.6: packages/cli/src/operations/resource/types.ts:4`). The catalog must use the identity template `make-docs://system/{type}/{path}` (`make-docs v2.0.6: packages/cli/src/operations/resource/provider.ts:243`).
- The provider loads the template root with the package name and version (`make-docs v2.0.6: packages/cli/src/operations/resource/provider.ts:183`). It reads the catalog at `.make-docs/system-resources.catalog.json` (`make-docs v2.0.6: packages/cli/src/operations/resource/provider.ts:52`), which has 62 entries in the template (`make-docs v2.0.6: packages/docs/template/.make-docs/system-resources.catalog.json:1`).
- The origins are `effective`, which is the default, `local` and `installed` (`make-docs v2.0.6: packages/cli/src/operations/resource/resolver.ts:76`). Local copies live in `.make-docs/system/<plural>/` (`make-docs v2.0.6: packages/cli/src/operations/resource/resolver.ts:844`). Local copies are optional (`make-docs v2.0.6: docs/prd/17-system-asset-materialization-and-local-bootstrap.md:33`).
- The type-to-folder map is one table. `make-docs v2.0.6: packages/cli/src/operations/resource/types.ts:13`.
- Project records have no URI. `make-docs v2.0.6: docs/prd/21-project-tool-directory-and-resource-tiers.md:42`.
- Migration records link to backups as `make-docs://store/migration/backup/<id>` (`make-docs v2.0.6: packages/cli/src/migration.ts:619`). The app resource is `ui://make-docs/backlog-review/v1.html` (`make-docs v2.0.6: packages/cli/src/mcp/resource-profiles.ts:11`).

Gaps: None. The singular URI types and the plural folders follow one map table, so they meet the target rule. Make Docs writes its own name in these URIs as code text. [06 Shared Core](06-shared-core.md) owns how a kit gives its name to the shared code.

### Routers and Managed Blocks

Target rule:

- A kit writes its text in an instruction file only inside its own managed block. Every byte outside that block stays the same.
- The block markers carry the kit's CLI name: `<!-- <kit-cli>:begin -->` and `<!-- <kit-cli>:end -->`. A file holds at most one block for each kit.
- A kit reads and writes only the block with its own name. Another kit's block is outside text for it.
- A block is valid only when exactly one begin marker comes before exactly one end marker for that kit. Any other count, a reversed pair or a pair inside another kit's block is malformed.
- When a block is malformed, the kit stops before it changes any file and names the file. It does not repair the block itself.
- A block write gives one of these results: `inserted` (the file had no block), `updated` (the block body changed) or `noop` (the block body is already current).
- `setup remove` and sync removal delete only the kit's block. The text before and after the block stays byte for byte.
- A managed block in a TOML file uses the same kit name and the same block code, with TOML comment lines as markers.
- The hand-written root map in a repository root router sits outside every kit block. No kit writes it or removes it.
- A kit writes routers in the project root, in its project tool directory, and in the content folders that the kit's own PRDs name. The kit's own PRDs can also name folders below its project tool directory. Each router file name comes from the agent tool: `AGENTS.md` for Codex and Copilot, `CLAUDE.md` for Claude Code.
- For Make Docs, the router places are the project root, `docs/`, the project tool directory, `system/` and its four type folders, and each selected docs folder.
- A kit whose project tool directory is `.make/<kit>/` also writes its block in the shared `.make/` router. [07 Setup Tool and Shared Files, Project Files](07-setup-tool-and-shared-files.md#project-files) owns that router.
- Each router stays within the short-router budget. A router is a short managed block. It points first to a valid local body and then to `<kit-cli> resource read <kit-cli>://system/...`. It repeats no full procedure.
- An agent that reaches a kit router can tell, from the router text, which docs root belongs to the kit and where to read its resources. The [Human Experience Contract](make-docs://system/contract/human-experience-contract.md) is the standard behind this outcome. The [Routing Check](02-architecture-overview.md#routing-check) is its evidence.

The design calls the router rule progressive disclosure. Make Docs uses that term only for human output, so this document uses the Make Docs term, short-router budget.

Make Docs at `v2.0.6`:

- The markers are `<!-- make-docs:begin -->` and `<!-- make-docs:end -->`. `make-docs v2.0.6: packages/cli/src/managed-block.ts:1`.
- A file is valid only with exactly one begin marker before exactly one end marker (`make-docs v2.0.6: packages/cli/src/managed-block.ts:68`). Any other count is malformed (`make-docs v2.0.6: packages/cli/src/managed-block.ts:85`).
- Make Docs PRD 15 says that missing, malformed, nested, duplicated or contradictory markers fail closed before a change. `make-docs v2.0.6: docs/prd/15-agent-instruction-ownership-and-managed-blocks.md:69`.
- The upsert results are `inserted`, `updated`, `reasserted` (for a malformed block) and `noop` (`make-docs v2.0.6: packages/cli/src/managed-block.ts:11`, logic at `make-docs v2.0.6: packages/cli/src/managed-block.ts:101`).
- The block library accepts custom markers (`make-docs v2.0.6: packages/cli/src/managed-block.ts:22`), but every caller uses the defaults.
- Sync removal strips a clean block and keeps the text before and after it (`make-docs v2.0.6: packages/cli/src/planner.ts:716`, applied at `make-docs v2.0.6: packages/cli/src/install.ts:467`).
- The router places are the root, `docs/`, `.make-docs/`, `.make-docs/system/` and its four folders, and the selected `docs/{designs,plans,prd,work}` folders (`make-docs v2.0.6: packages/cli/src/router-paths.ts:4`). The on-demand `.make-docs/archive/` and `docs/assets/` folders get a router when they are created (`make-docs v2.0.6: packages/cli/src/router-paths.ts:24`). Make Docs PRD 17 names these places (`make-docs v2.0.6: docs/prd/17-system-asset-materialization-and-local-bootstrap.md:26`). The router file names come from each agent tool (`make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:46`, `:67`, `:100`).
- Make Docs writes no block in a `.make/` router, because its project tool directory is `.make-docs/` ([D-033 Make Docs Project Folder Name](03-open-questions-and-risk-register.md#d-033-make-docs-project-folder-name)).
- The template root router is one short managed block of 10 lines. It points first to a valid local body and then to `make-docs resource read make-docs://system/...`. `make-docs v2.0.6: packages/docs/template/AGENTS.md:1`.
- The Make Docs rule is the short-router budget (`make-docs v2.0.6: docs/prd/15-agent-instruction-ownership-and-managed-blocks.md:110`, `make-docs v2.0.6: docs/prd/17-system-asset-materialization-and-local-bootstrap.md:36`). The term progressive disclosure appears only for human output (`make-docs v2.0.6: docs/prd/49-human-experience-standard-and-intent.md:109`).

Gaps:

| Gap | Make Docs at `v2.0.6` | Fix |
| --- | --- | --- |
| [D-029 Block Markers Are Not Tag-Aware](03-open-questions-and-risk-register.md#d-029-block-markers-are-not-tag-aware) | The markers are fixed strings (`make-docs v2.0.6: packages/cli/src/managed-block.ts:1`). Callers such as `make-docs v2.0.6: packages/cli/src/planner.ts:1780` and `make-docs v2.0.6: packages/cli/src/operations/project/ops.ts:272` pass no markers. A second kit that uses this code writes `make-docs` markers, so two kits cannot share one instruction file safely. | Make Docs 2.2.0 on the core, with tag-aware managed blocks ([Q-007 Make Docs Changes in Step 0](03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)). |
| [D-030 Setup Remove Keeps the Kit Block](03-open-questions-and-risk-register.md#d-030-setup-remove-keeps-the-kit-block) | When a router also holds user text, `setup remove` keeps the whole file, the Make Docs block included (`make-docs v2.0.6: packages/cli/src/audit.ts:330`). Sync removal strips only the block (`make-docs v2.0.6: packages/cli/src/planner.ts:716`). | Make Docs 2.2.0 on the core, with the `setup remove` and uninstall fix ([Q-007 Make Docs Changes in Step 0](03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)). The uninstall fix also covers D-002 and D-039 ([Q-035 Scope of the Uninstall Fix in 2.2.0](03-open-questions-and-risk-register.md#q-035-scope-of-the-uninstall-fix-in-220)). |
| [D-031 Block Library Reasserts Malformed Blocks](03-open-questions-and-risk-register.md#d-031-block-library-reasserts-malformed-blocks) | The block library reasserts a malformed block (`make-docs v2.0.6: packages/cli/src/managed-block.ts:136`). The setup planner skips the file with "Repair it before setup can continue" (`make-docs v2.0.6: packages/cli/src/planner.ts:367`). | No release is set yet. The register tracks it. |
| [D-032 Codex TOML Uses a Second Block Format](03-open-questions-and-risk-register.md#d-032-codex-toml-uses-a-second-block-format) | The Codex config uses `# make-docs:begin harness-access codex mcp` and `# make-docs:end harness-access codex mcp`, outside the block library. `make-docs v2.0.6: packages/cli/src/harness-access/native.ts:102`. | No release is set yet. The register tracks it. |

### Project Config

Target rule:

- Each kit has one project tool directory in a project: `.make/<kit>/`.
- `.make/<kit>/config.yaml` holds the settings for that kit only, including its `projectId`. Only that kit reads it.
- `.make/config.yaml` holds the choices that every kit shares, such as the selected agent tools. `.make/personas.yaml` holds the people and roles for every kit. The core reads and writes these two files. Each kit only reads them and asks the core for a change. [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) owns their fields.
- Project config is optional and project-owned. It holds declarative identity and desired settings only. It holds no operational state.
- The kit reads the project identity from `projectId` in its project config first, and from its Store next. Each nested project has its own `projectId`.
- Each kit declares one set of allowed top-level config keys and one list of retired keys.
- Top-level config keys use camelCase.
- Each kit sets the style of its nested config keys, the keys below a top-level key, in its own PRDs.
- The project tool directory holds the kit config, the optional local system copies and kit-owned project folders such as the Make Docs archive. It holds no Store record and no Skill root.

Make Docs at `v2.0.6`:

- The project tool directory is `.make-docs/` (`make-docs v2.0.6: packages/cli/src/tool-directory.ts:7`), and the config is `.make-docs/config.yaml` (`make-docs v2.0.6: packages/cli/src/tool-directory.ts:11`, `make-docs v2.0.6: packages/cli/src/config.ts:227`). The file is optional and owned by the project (`make-docs v2.0.6: docs/prd/24-project-configuration-and-convention-overlay.md:18`).
- The allowed top-level keys are `projectId`, `labels`, `personas`, `generatedProse`, `harnessCapabilities`, `harnessIntegrations` and `prd_authority` (`make-docs v2.0.6: packages/cli/src/config.ts:154`). The retired keys are at `make-docs v2.0.6: packages/cli/src/config.ts:173`.
- Most nested keys use camelCase, such as `labels.documentKinds` (`make-docs v2.0.6: packages/cli/src/config.ts:163`) and `accessCeiling` in `harnessIntegrations` (`make-docs v2.0.6: packages/cli/src/config.ts:172`). The nested key `prd_authority.markdown_sources` uses snake_case (`make-docs v2.0.6: docs/prd/24-project-configuration-and-convention-overlay.md:57`). The Make Docs PRDs set no style for nested keys.
- The Persona keys are `slug`, `label`, `description` and `primitive` (`make-docs v2.0.6: packages/cli/src/config.ts:164`). The primitives are `user` and `maintainer` (`make-docs v2.0.6: packages/cli/src/config.ts:13`). The reserved slugs are `project`, `archive`, `artifacts`, `library` and `playbooks` (`make-docs v2.0.6: packages/cli/src/config.ts:14`). The built-in `user` and `maintainer` entries are defaults (`make-docs v2.0.6: packages/cli/src/config.ts:259`).
- The project identity comes from `projectId` in `config.yaml` first and from the Store ledger next. `make-docs v2.0.6: packages/cli/src/store/project-identity.ts:28`.
- Make Docs PRD 24 R-CONFIG-STATE-7 says that a monorepo root and a separately configured kit are separate targets with separate identities. `make-docs v2.0.6: docs/prd/24-project-configuration-and-convention-overlay.md:31`.
- The code treats `.make-docs/agentics/skills` and `.make-docs/agentics/plugins` as a retired layout (`make-docs v2.0.6: packages/cli/src/tool-directory.ts:24`). The skills README says "Never create an active `.make-docs/agentics` Skill root" (`make-docs v2.0.6: packages/skills/README.md:5`).

Gaps:

| Gap | Make Docs at `v2.0.6` | Fix |
| --- | --- | --- |
| [D-033 Make Docs Project Folder Name](03-open-questions-and-risk-register.md#d-033-make-docs-project-folder-name) | The project tool directory is `.make-docs/`, not `.make/docs/`. `make-docs v2.0.6: packages/cli/src/tool-directory.ts:7`. | A later Make Docs wave sets the folder to `.make/docs/` ([Q-007 Make Docs Changes in Step 0](03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)). No release is set yet. |
| [D-034 Config Key Styles Are Mixed](03-open-questions-and-risk-register.md#d-034-config-key-styles-are-mixed) | The top-level key `prd_authority` uses snake_case, and the other top-level keys use camelCase. `make-docs v2.0.6: packages/cli/src/config.ts:161`. | No release is set yet. The register tracks it. |
| [D-035 Shared and Kit-Only Settings Share One File](03-open-questions-and-risk-register.md#d-035-shared-and-kit-only-settings-share-one-file) | `harnessIntegrations` and `harnessCapabilities`, which belong in `.make/config.yaml`, and `personas`, which belongs in `.make/personas.yaml`, sit beside the kit-only `labels`, `generatedProse` and `prd_authority`. `make-docs v2.0.6: packages/cli/src/config.ts:95`. | The setup tool wave owns the shared files ([Q-001 Step 0 Backlog Scope](03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope), [Q-007 Make Docs Changes in Step 0](03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)). No release is set yet. The register tracks it. |
| [D-036 PRD 21 Lists a Project Skill Root](03-open-questions-and-risk-register.md#d-036-prd-21-lists-a-project-skill-root) | The folder model in Make Docs PRD 21 lists `.make-docs/agentics/skills/` (`make-docs v2.0.6: docs/prd/21-project-tool-directory-and-resource-tiers.md:29`). The code and the skills README treat that root as retired. | No release is set yet. The register tracks it. |
| [D-041 Make Docs Sets No Nested Config Key Style](03-open-questions-and-risk-register.md#d-041-make-docs-sets-no-nested-config-key-style) | The Make Docs PRDs set no style for nested config keys, and the nested keys mix two styles. `prd_authority.markdown_sources` uses snake_case (`make-docs v2.0.6: docs/prd/24-project-configuration-and-convention-overlay.md:57`), and `labels.documentKinds` uses camelCase (`make-docs v2.0.6: packages/cli/src/config.ts:163`). | No release is set yet. The register tracks it. |

### Machine Folders

Target rule:

- Each kit keeps its machine state in its own machine folder, the Store root. No kit reads or writes the machine folder of another kit.
- The kit finds its Store root in this order: an explicit Store root from the caller, then the `MAKE_<KIT>_HOME` setting, then `<user-data-root>/.make/<kit>/`.
- `<user-data-root>` is the home folder on Linux and macOS. On Windows, it is `LOCALAPPDATA`, then `APPDATA`, then the home folder.
- When `MAKE_<KIT>_HOME` is set, every read and write of machine state uses the folder that it names.
- The kit tells its Store root from a project tool directory by the folder contents, not by the folder name or a fixed path. Store removal refuses a folder that looks like a project tool directory.
- The help and the READMEs name the Store root for each operating system.
- Agent-tool config files and Skill folders belong to the agent tools. A kit writes only its own entries in them.

Make Docs at `v2.0.6`:

- An explicit `storeRoot` wins, then `MAKE_DOCS_HOME`, then `<user data root>/.make-docs`. `make-docs v2.0.6: packages/cli/src/store/paths.ts:9`, `make-docs v2.0.6: packages/cli/src/store/paths.ts:36`.
- The user data root is the home folder on Linux and macOS. On Windows, it is `LOCALAPPDATA`, then `APPDATA`, then the home folder. `make-docs v2.0.6: packages/cli/src/platform.ts:267`, `make-docs v2.0.6: packages/cli/src/platform.ts:271`.
- Store removal refuses a root that holds the markers of a project `.make-docs/` folder. `make-docs v2.0.6: packages/cli/src/store/lifecycle.ts:131`.
- The MCP config files are `~/.claude.json`, `~/.codex/config.toml` and `~/.copilot/mcp-config.json` (`make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:49`, `:73`, `:103`). The user Skill folders are `~/.agents/skills`, `$CODEX_HOME` or `~/.codex/skills`, and `$CLAUDE_CONFIG_DIR` or `~/.claude/skills` (`make-docs v2.0.6: packages/cli/src/skill-paths.ts:13`).
- [Machine Folder Layout](#machine-folder-layout) lists the Store files.

Gaps:

| Gap | Make Docs at `v2.0.6` | Fix |
| --- | --- | --- |
| [D-037 Make Docs Machine Folder Name](03-open-questions-and-risk-register.md#d-037-make-docs-machine-folder-name) | The Store root is `~/.make-docs/`, not `~/.make/docs/`. `make-docs v2.0.6: packages/cli/src/store/paths.ts:12`. | A later Make Docs wave sets the folder to `~/.make/docs/` ([Q-007 Make Docs Changes in Step 0](03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0)). No release is set yet. |
| [D-038 Help and README Give One Store Path for Every OS](03-open-questions-and-risk-register.md#d-038-help-and-readme-give-one-store-path-for-every-os) | The help and the Store README give `~/.make-docs` for every operating system. `make-docs v2.0.6: packages/cli/src/cli.ts:3652`, `make-docs v2.0.6: packages/cli/src/store/README.md:16`. | No release is set yet. The register tracks it. |
| [D-039 Setup Remove Guard Uses a Fixed Store Path](03-open-questions-and-risk-register.md#d-039-setup-remove-guard-uses-a-fixed-store-path) | `setup remove` skips the pruning of `<home>/.make-docs` by a fixed path and ignores `MAKE_DOCS_HOME`. `make-docs v2.0.6: packages/cli/src/uninstall.ts:161`. | Make Docs 2.2.0 on the core, with the uninstall fix ([Q-035 Scope of the Uninstall Fix in 2.2.0](03-open-questions-and-risk-register.md#q-035-scope-of-the-uninstall-fix-in-220)). |

The project tool directory and the Store root have the same name in Make Docs, `.make-docs`. The target names `.make/<kit>/` and `~/.make/<kit>/` are the same path when the project root is the home folder. The content check in the target rule keeps the two apart in both cases. The overlap is a tracked risk ([R-011 Project and Machine Folders Overlap](03-open-questions-and-risk-register.md#r-011-project-and-machine-folders-overlap)).

### Store Boundary

Target rule:

- Project knowledge and desired state live in the project, in git: designs, plans, PRDs, work, routers and project config.
- The Store holds only local operational state and the minimum last-applied ownership. [Store Contents](#store-contents) lists what that state is.
- The install record of a project is the Store installation ledger. No kit writes an install record, a block hash, a lock, a journal or a receipt into a project folder.
- A kit reads a legacy project record, such as `.make-docs/manifest.json`, only as migration input. It never writes one.
- The machine config in the Store holds the agent-tool choices of the machine and the MCP connection records, with key hashes only.
- [06 Shared Core](06-shared-core.md) owns the Store schema version and the split between the base tables and the kit tables.

Make Docs at `v2.0.6`:

- The Make Docs rule is that project knowledge and desired state stay in the repository, and local operational state and the minimum last-applied ownership stay in the Store. `make-docs v2.0.6: docs/prd/38-global-store-and-project-state.md:34` (R-BND-1, R-BND-2).
- Schema 6 has 16 tables. `make-docs v2.0.6: packages/cli/src/store/database.ts:1128`.
- The install record is the Store installation ledger (`make-docs v2.0.6: packages/cli/src/manifest.ts:155`, `make-docs v2.0.6: packages/cli/src/store/registry-mirror.ts:91`). `.make-docs/manifest.json`, `.make-docs/conflicts` and `.make-docs/runs` are legacy input locations only (`make-docs v2.0.6: packages/cli/src/tool-directory.ts:28`, `make-docs v2.0.6: packages/cli/src/manifest.ts:160`, `make-docs v2.0.6: docs/prd/17-system-asset-materialization-and-local-bootstrap.md:29`).
- The machine `config.json` holds the intent for each agent tool and its MCP connection record with the key hash. `make-docs v2.0.6: packages/cli/src/store/global-config.ts:45`.

Gaps:

| Gap | Make Docs at `v2.0.6` | Fix |
| --- | --- | --- |
| [D-040 Store README Calls the Project Manifest Canonical](03-open-questions-and-risk-register.md#d-040-store-readme-calls-the-project-manifest-canonical) | The Store README calls `.make-docs/manifest.json` the canonical install record (`make-docs v2.0.6: packages/cli/src/store/README.md:37`, again at `:104`). It says that the identity is minted into the manifest (`:41`). It also names a v5 backup file (`:14`), cites the missing `operations/playbook-packaging/registration-seam.ts` (`:36`) and says that the model "stays on schema version 1" (`:59`). | No release is set yet. The register tracks it. |

Code anchors:

- `make-docs v2.0.6: packages/cli/src/cli.ts`
- `make-docs v2.0.6: packages/cli/src/run/`
- `make-docs v2.0.6: packages/cli/src/operations/registry.ts`
- `make-docs v2.0.6: packages/cli/src/mcp/`
- `make-docs v2.0.6: packages/cli/src/managed-block.ts`
- `make-docs v2.0.6: packages/cli/src/config.ts`
- `make-docs v2.0.6: packages/cli/src/store/`

## Contracts and Data

### Name Placeholders

| Placeholder | Meaning | Make Docs | Make Blueprint |
| --- | --- | --- | --- |
| `<kit-cli>` | The kit CLI name. It is also the npm package name without its scope. | `make-docs` | `make-blueprint` |
| `<kit>` | `<kit-cli>` without the `make-` prefix | `docs` | `blueprint` |
| `<KIT>` | `<kit>` in upper case, with `_` in place of `-` | `DOCS` | `BLUEPRINT` |

### Exit-Code Table

| Code | Name | Meaning |
| --- | --- | --- |
| `0` | Success | The command finished, and its result is a success. A validator status is `passed`. A write applied, or it had nothing to do. |
| `1` | Failure | The command did not reach a success. Examples: a finding, a validator status other than `passed`, a `blocked` result, a refused or cancelled run, a manual step left, or an operation error, such as a Store error. |
| `2` | Input error | The command could not start its work. A flag or an argument is not valid, or a file or folder that the command must read cannot be read. |

### Result and Error Shapes

| Shape | Stream | Fields |
| --- | --- | --- |
| CLI success | stdout | `ok: true`, then the result fields of the operation |
| CLI error | stderr | `ok: false`, `code`, `message`, and the optional fields `operation`, `reason`, `nextAction`, `scope`, `taskCanContinue`, `details`, `uri`, `path`, `runId` and `issue` |
| MCP tool error | MCP result | `isError: true`, with the same fields as the CLI error and no `ok` field |

The Store codes are `store-not-configured`, `store-unavailable`, `store-unsafe` and `store-denied`. Each Store error carries `scope: "operation"` and `taskCanContinue: true`.

### Flags and Tool Inputs

| Flag or input | Surface | Rule |
| --- | --- | --- |
| `--help`, `-h` | CLI | Shows the help for a command. |
| `--version`, `-v` | CLI | Prints the kit version. |
| `--json` | CLI | Prints JSON. A non-TTY stdout gives the same result. |
| `--dry-run` | CLI | Reports the result of a write command and writes nothing. It takes no value. On a preview-first command, it does the same as the default run. |
| `--apply` | CLI, each preview-first command | Lets a preview-first command write its plan. Without it, the command writes nothing. With `--dry-run`, it is an input error. No other command takes it. |
| `--target-root <path>` | CLI | Names the project folder. |
| `--yes` | CLI, `update` and `uninstall` | Confirms the command without an interactive prompt. |
| `--remove-store` | CLI, `uninstall` | Also removes the kit's Store. |
| `--profile <name>` | CLI, `<kit-cli> mcp` | Selects one MCP profile. The default is `all`. |
| `targetRoot` | MCP | Names the project folder. |
| `allowWrite` | MCP, each write tool | Allows the write. A write without `allowWrite: true` fails. |
| `dryRun` | MCP, each registry-derived tool | Reports the result and writes nothing. |
| `apply` | MCP, the tool of each preview-first command | Lets the tool write its plan. The tool writes only when the call has both `apply: true` and `allowWrite: true`. |
| `approvals` | MCP, each registry-derived tool | Gives the approvals that the operation requires. |

### Resource Identity

The URI of a system resource is `<kit-cli>://system/<type>/<path>`.

| URI type | Local folder below `<project tool directory>/system/` |
| --- | --- |
| `contract` | `contracts/` |
| `prompt` | `prompts/` |
| `reference` | `references/` |
| `template` | `templates/` |

| Origin | Body that the kit reads |
| --- | --- |
| `effective` | The default. A trusted local copy when one is present, and the installed body when none is present |
| `local` | The local copy in the project only |
| `installed` | The body in the installed package only |

| URI family | Use | Make Docs at `v2.0.6` |
| --- | --- | --- |
| `<kit-cli>://system/<type>/<path>` | System resources | `make-docs://system/...` |
| `<kit-cli>://store/<path>` | Links to Store records inside Store records | `make-docs://store/migration/backup/<id>` |
| `ui://<kit-cli>/<path>` | MCP app resources | `ui://make-docs/backlog-review/v1.html` |

Project records have no URI.

### Block Markers

| File type | Begin marker | End marker |
| --- | --- | --- |
| Markdown | `<!-- <kit-cli>:begin -->` | `<!-- <kit-cli>:end -->` |
| TOML | `# <kit-cli>:begin <label>` | `# <kit-cli>:end <label>` |

The label in a TOML marker names the entry. Make Docs at `v2.0.6` uses the label `harness-access codex mcp`.

| Block write result | Meaning |
| --- | --- |
| `inserted` | The file had no block for the kit. The kit wrote one. |
| `updated` | The block body was different. The kit wrote the current body. |
| `noop` | The block body was already current. Nothing changed. |

A malformed block gives no write result. The command stops and names the file.

### Project Files

| Path | What it holds | Field owner | Make Docs at `v2.0.6` |
| --- | --- | --- | --- |
| `.make/config.yaml` | The choices that every kit shares, such as the selected agent tools | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) | `harnessIntegrations` and `harnessCapabilities` in `.make-docs/config.yaml` |
| `.make/personas.yaml` | The people and roles for every kit | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) | `personas` in `.make-docs/config.yaml` |
| `.make/AGENTS.md`, `.make/CLAUDE.md` | The shared `.make/` router, with one managed block for each kit that has a `.make/<kit>/` folder | [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md#project-files) | None. Make Docs writes no block there. |
| `.make/<kit>/config.yaml` | Kit-only settings and the kit's `projectId` | The kit's own PRD set | `.make-docs/config.yaml` |
| `.make/<kit>/system/<type folder>/` | Optional local copies of system resources | This document | `.make-docs/system/<type folder>/` |

### Machine Folder Layout

| Order | Store root source |
| --- | --- |
| 1 | An explicit Store root from the caller |
| 2 | `MAKE_<KIT>_HOME` |
| 3 | `<user-data-root>/.make/<kit>/` |

The Make Docs Store root at `v2.0.6` holds these files:

| File | Anchor |
| --- | --- |
| `config.json`, `manifest.json`, `store.db` | `make-docs v2.0.6: packages/cli/src/store/paths.ts:15` |
| `removal.lock` | `make-docs v2.0.6: packages/cli/src/store/tool-operations.ts:103` |
| `installation-bootstrap.lock` | `make-docs v2.0.6: packages/cli/src/store/installation-state.ts:488` |
| `global-assets.lock` | `make-docs v2.0.6: packages/cli/src/store/global-asset-lock.ts:7` |
| `store.db.bridge-v<N>-to-v6-<uuid>.backup` | `make-docs v2.0.6: packages/cli/src/store/database.ts:1569` |

### Store Contents

The Make Docs Store at schema version 6 has these tables. Each one holds operational state.

| Group | Tables |
| --- | --- |
| Installation | `installation_checkouts`, `installation_ledgers`, `installation_operations`, `installation_steps`, `installation_locks`, `installation_migration_records`, `installation_transfers` |
| Journals and receipts | `tool_operations`, `store_schema_journal`, `store_checkpoint_journal`, `store_migration_receipts` |
| Project registry mirror | `projects` |
| Lifecycle runs and evidence | `runs`, `run_evidence`, `work_evidence` |
| Cache | `backlog_review_cache` |
| Legacy | `playbook_runs` |

Code anchors:

- `make-docs v2.0.6: packages/cli/src/run/entry.ts:13`
- `make-docs v2.0.6: packages/cli/src/operations/context.ts:203`
- `make-docs v2.0.6: packages/cli/src/operations/resource/types.ts:13`
- `make-docs v2.0.6: packages/cli/src/managed-block.ts:1`
- `make-docs v2.0.6: packages/cli/src/harness-access/native.ts:102`
- `make-docs v2.0.6: packages/cli/src/store/paths.ts:9`
- `make-docs v2.0.6: packages/cli/src/store/database.ts:1128`

## Integrations

| Integration | How it relates to these rules |
| --- | --- |
| [06 Shared Core](06-shared-core.md) | The core holds the shared code for paths, resource reading, the MCP server and its profiles, the Store base, agent-tool setup, managed blocks, tool discovery, and `update` and uninstall. Each kit gives its own names to that code. The names that Make Docs writes as code text, such as `make-docs://`, `ui://make-docs/`, `MAKE_DOCS_HOME`, `MAKE_DOCS_MCP_CONNECTION_*` and the block markers, are these kit names. |
| [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md) | 07 owns the fields of `.make/config.yaml`, `.make/<kit>/config.yaml` and `.make/personas.yaml`, including the Persona fields ([Q-023 Persona Entry Fields](03-open-questions-and-risk-register.md#q-023-persona-entry-fields)). This document owns where each kind of setting lives. |
| [08 Build and Release](08-build-and-release.md) | 08 owns the package names, CI on Linux, macOS and Windows, and the release of each Make Docs fix. |
| [02 Architecture Overview](02-architecture-overview.md#several-docs-roots) | 02 owns the docs roots, the root map and the routing check. The project-target rule here keeps nested projects apart. |
| [Deferred Obligations](03-open-questions-and-risk-register.md#deferred-obligations) | The records of the nested-project workarounds. [D-024 Two Project Root Searches](03-open-questions-and-risk-register.md#d-024-two-project-root-searches) is the code cause of O-001. |
| Agent tools | Codex, Claude Code and GitHub Copilot read the kit entry from their own MCP config and start the kit's MCP server. They read the routers by their own file names, `AGENTS.md` or `CLAUDE.md`. |
| Make Docs PRDs | The Make Docs PRDs that state these rules at `v2.0.6` are PRD 39 (CLI command model), PRD 25 (MCP surface and profiles), PRD 15 (managed blocks), PRD 17 (local bootstrap and routers), PRD 21 (project tool directory and resources), PRD 24 (project config), PRD 38 (Store), PRD 28 (agent-tool exposure), PRD 16 (package runtime), PRD 07 (CLI command surface), PRD 05 (install profile and manifest) and PRD 49 (human experience). From Make Docs 2.1.0, they link to this document ([Q-019 Make Docs PRDs and Kit Conventions](03-open-questions-and-risk-register.md#q-019-make-docs-prds-and-kit-conventions)). |
| Make Blueprint | Make Blueprint follows these rules. Its own PRDs, such as [06 Project Layout and Instruction Files](../../kits/make-blueprint/docs/prd/06-project-layout-and-instruction-files.md) and [08 CLI and MCP](../../kits/make-blueprint/docs/prd/08-cli-and-mcp.md), state its product detail. A Make Blueprint change plan turns their shared parts into links to the root PRDs. |
| [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md) | Each gap in this document is one `D-###` item under Confirmed Drift. |
| [04 Glossary](04-glossary.md) | The glossary defines reference kit, managed block, short-router budget and the other terms here. |

Code anchors:

- `make-docs v2.0.6: packages/cli/src/harness-access/registry.ts`
- `make-docs v2.0.6: packages/cli/src/harness-access/native.ts`
- `make-docs v2.0.6: docs/prd/39-cli-command-model-and-operation-registry.md`
- `make-docs v2.0.6: docs/prd/25-typescript-runtime-cli-mcp-operation-boundaries.md`
- `make-docs v2.0.6: docs/prd/15-agent-instruction-ownership-and-managed-blocks.md`
- `make-docs v2.0.6: docs/prd/38-global-store-and-project-state.md`

## Rebuild Notes

These names are live for Make Docs users and their agents. A gap fix that changes one of them changes what live users see:

- The CLI `make-docs` and the npm name `@brucewaynedecoy/make-docs`.
- `MAKE_DOCS_HOME`, `MAKE_DOCS_MCP_CONNECTION_ID` and `MAKE_DOCS_MCP_CONNECTION_KEY`.
- `.make-docs/config.yaml`, with its `projectId`, and the Store root `~/.make-docs/` at Store schema version 6.
- The MCP tool names, the `make-docs://system/` URIs and the markers `<!-- make-docs:begin -->` and `<!-- make-docs:end -->`.

Gaps with a decided fix:

| Gap | Fix | Decision |
| --- | --- | --- |
| D-024 | Make Docs 2.1.0 | [Q-014 Nested-Project Fixes](03-open-questions-and-risk-register.md#q-014-nested-project-fixes) |
| D-029, D-030 | Make Docs 2.2.0 on the core | [Q-007 Make Docs Changes in Step 0](03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0) |
| D-002, D-039 | Make Docs 2.2.0 on the core, with the uninstall fix | [Q-035 Scope of the Uninstall Fix in 2.2.0](03-open-questions-and-risk-register.md#q-035-scope-of-the-uninstall-fix-in-220) |
| D-033, D-037 | A later Make Docs wave, with no release number | [Q-007 Make Docs Changes in Step 0](03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0) |
| D-035 | The setup tool wave, with no release number | [Q-001 Step 0 Backlog Scope](03-open-questions-and-risk-register.md#q-001-step-0-backlog-scope), [Q-007 Make Docs Changes in Step 0](03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0) |

All other gaps have no release set yet. The register tracks them.

Places where a rebuild often goes wrong:

- The bare command is not status-only. Without an install, it starts guided setup on a TTY.
- `ADMITTED_CLI_PATHS` maps to three CLI roots, `run`, `project` and `resource`, not only to `run`.
- A profile filters tools. It never grants access.
- `dryRun` and `approvals` are on the registry-derived tools only.
- A preview-first command writes nothing without `--apply`. On it, `--dry-run` does the same as no flag.
- `uninstall` keeps the Store by default. Only `--remove-store` removes it.
- `run` and `findRepoRoot` search for the project root in two different ways.
- `.make-docs/manifest.json` is legacy input, not the install record.
- Make Docs has two block formats, Markdown and Codex TOML.
- The Windows Store root is below `LOCALAPPDATA`, then `APPDATA`, then the home folder.
- The project tool directory and the Store root can have the same name.

Security requirements:

- No project file, router or project config holds a connection key, a secret, client data or a local home-folder path.
- The machine config holds only the SHA-256 hash of each MCP connection key.
- Store removal never deletes a folder that looks like a project tool directory.

Compatibility requirements:

- Each Step 0 Make Docs release keeps Store schema version 6. [06 Shared Core](06-shared-core.md) owns this rule.
- Each Make Docs release keeps the npm name `@brucewaynedecoy/make-docs`. [08 Build and Release](08-build-and-release.md) owns this rule.

Platform requirements:

- Each kit finds its Store root on Linux, macOS and Windows by the order in [Machine Folder Layout](#machine-folder-layout).
- Each rule here holds on Linux, macOS and Windows. CI runs on all three ([08 Build and Release](08-build-and-release.md)).

Code anchors:

- `make-docs v2.0.6: packages/cli/src/platform.ts:271`
- `make-docs v2.0.6: packages/cli/src/store/lifecycle.ts:131`
- `make-docs v2.0.6: packages/cli/src/mcp-connection.ts:59`
- `make-docs v2.0.6: packages/cli/src/store/database.ts:575`

## Source Anchors

- [Make Kit Monorepo](../designs/2026-10-30-make-kit-monorepo.md) design, sections [6](../designs/2026-10-30-make-kit-monorepo.md#6-shared-setup-choices), [7](../designs/2026-10-30-make-kit-monorepo.md#7-package-names-and-home-folders), [12](../designs/2026-10-30-make-kit-monorepo.md#12-ci-and-release) and [13](../designs/2026-10-30-make-kit-monorepo.md#13-repo-wide-prds-and-kit-conventions)
- [Make Kit Monorepo Baseline Plan](../plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md)
- [Phase 2: Kit Conventions](../plans/2026-11-01-w1-r0-make-kit-monorepo/02-kit-conventions.md#rule-areas)
- [01 Product Overview](01-product-overview.md) and [02 Architecture Overview](02-architecture-overview.md)
- `make-docs v2.0.6: packages/cli/src/cli.ts`
- `make-docs v2.0.6: packages/cli/src/run/entry.ts`
- `make-docs v2.0.6: packages/cli/src/run/cli.ts`
- `make-docs v2.0.6: packages/cli/src/run/root-operations.ts`
- `make-docs v2.0.6: packages/cli/src/operations/registry.ts`
- `make-docs v2.0.6: packages/cli/src/operations/context.ts`
- `make-docs v2.0.6: packages/cli/src/operations/mcp-metadata.ts`
- `make-docs v2.0.6: packages/cli/src/operations/resource/`
- `make-docs v2.0.6: packages/cli/src/mcp/server.ts`
- `make-docs v2.0.6: packages/cli/src/mcp/tools.ts`
- `make-docs v2.0.6: packages/cli/src/managed-block.ts`
- `make-docs v2.0.6: packages/cli/src/router-paths.ts`
- `make-docs v2.0.6: packages/cli/src/config.ts`
- `make-docs v2.0.6: packages/cli/src/tool-directory.ts`
- `make-docs v2.0.6: packages/cli/src/store/paths.ts`
- `make-docs v2.0.6: packages/cli/src/store/database.ts`
- `make-docs v2.0.6: packages/docs/template/AGENTS.md`
- `make-docs v2.0.6: docs/prd/39-cli-command-model-and-operation-registry.md`
- `make-docs v2.0.6: docs/prd/25-typescript-runtime-cli-mcp-operation-boundaries.md`
- `make-docs v2.0.6: docs/prd/38-global-store-and-project-state.md`
