---
title: "03 Open Questions and Risk Register"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md"
---

# 03 Open Questions and Risk Register

## Purpose

This register keeps the confirmed drift, the open and closed questions, the rebuild risks and the deferred obligations of the repo-wide PRD set in one place. Each item names the PRD that owns it.

This is the living register of the root PRD namespace. When agents find or settle a gap, drift, open question, risk, decision or closeout finding for repo-wide work, they record it here directly. They do not create separate question, decision, risk, gap or architecture-decision files unless the user asks.

Each item under `## Confirmed Drift`, `## Open Questions` and `## Rebuild Risks` has one numbered `###` heading, a `Status` / `Decision` / `Follow-Up` table, and the fields **Question** or **Issue**, **Why it matters**, **Recommendation** and **To close**. A closed item also has **Resolution**. Drift items use `D-001`, `D-002` and so on, open questions use `Q-001`, and rebuild risks use `R-001`. A new item takes the next free number in its section. Numbers never change, also when an item moves to `Closed`.

Numbering rules in this register:

- `D-###` items are confirmed drift. Each one is a gap between a target rule in [05 Kit Conventions](05-kit-conventions.md) and Make Docs at the tag `v2.0.6`, with the same number and title as in 05.
- `Q-001` to `Q-026` are the decisions of the Step 0 design interview, held from 2026-10-31 to 2026-11-01. Each one has the same number that it had in the interview. Later questions take the next free number.
- `O-###` records under [Deferred Obligations](#deferred-obligations) follow the [Deferred Obligation Contract](make-docs://system/contract/deferred-obligation-contract.md).
- The Make Blueprint register, `kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md`, has its own Q, R, D and O numbers. For example, both registers have an O-001. A doc that cites a number from either register names that register's path with the number.

Status meanings in this register:

- `Open`: no accepted answer yet, or the fix has not shipped.
- `Confirming`: a recommended answer is stated. The owner confirms it or chooses another.
- `Deferred`: the answer belongs to a later wave and does not block the Step 0 backlog.
- `Closed`: settled, with a resolution.

A code anchor names a file in the Make Docs source tree at the tag `v2.0.6` (commit `ff0b97dc`), for example [`make-docs v2.0.6: packages/cli/src/cli.ts:3673`](../../kits/make-docs/packages/cli/src/cli.ts). The link text has the tag, the path and, where given, the line. Make Docs is in `kits/make-docs/`, copied from that tag, so each anchor is a link to its file in `kits/make-docs/`. The link goes to the file, not to the line. The line number is a fact of the tag `v2.0.6`, also after a later release changes the file. The old root `package.json` is not in `kits/make-docs/`, because the root `package.json` of this repository replaces it. An anchor to that file links to the file at the tag in the old repository.

## Confirmed Drift

Each item is a place where Make Docs at `v2.0.6` differs from a target rule in [05 Kit Conventions](05-kit-conventions.md). An item names the Make Docs release that fixes it only where an accepted decision sets one. Every other item has no release set yet, and this register tracks it. An item moves to `Closed` when a Make Docs release ships the fix, or when the owner accepts an exception.

Code anchors:

- [`make-docs v2.0.6: packages/cli/src/cli.ts`](../../kits/make-docs/packages/cli/src/cli.ts)
- [`make-docs v2.0.6: packages/cli/src/run/`](../../kits/make-docs/packages/cli/src/run/)
- [`make-docs v2.0.6: packages/cli/src/operations/`](../../kits/make-docs/packages/cli/src/operations/)
- [`make-docs v2.0.6: packages/cli/src/mcp/`](../../kits/make-docs/packages/cli/src/mcp/)
- [`make-docs v2.0.6: packages/cli/src/managed-block.ts`](../../kits/make-docs/packages/cli/src/managed-block.ts)
- [`make-docs v2.0.6: packages/cli/src/config.ts`](../../kits/make-docs/packages/cli/src/config.ts)
- [`make-docs v2.0.6: packages/cli/src/store/`](../../kits/make-docs/packages/cli/src/store/)

### D-001 Top-Level Help Hides Project Commands

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, CLI Top Level](05-kit-conventions.md#cli-top-level). |

**Issue**: The top-level help lists only four `project` paths ([`make-docs v2.0.6: packages/cli/src/cli.ts:3673`](../../kits/make-docs/packages/cli/src/cli.ts)). `project --help` lists only path hygiene ([`make-docs v2.0.6: packages/cli/src/cli.ts:3547`](../../kits/make-docs/packages/cli/src/cli.ts)). The CLI also admits `project persona list`, the four `project layout` verbs, `project checkout-move` and `project checkout-register` ([`make-docs v2.0.6: packages/cli/src/run/root-operations.ts:220`](../../kits/make-docs/packages/cli/src/run/root-operations.ts), [`make-docs v2.0.6: packages/cli/src/operations/registry.ts:190`](../../kits/make-docs/packages/cli/src/operations/registry.ts)).

**Why it matters**: A person or an agent who reads the help cannot find commands that the CLI admits. The target rule says that the help of each group lists every admitted command path.

**Recommendation**: Build the top-level help and the `project` help from the operation registry, as the `run` help is built.

**To close**: `make-docs --help` and `make-docs project --help` list every admitted `project` path, and a test compares the help with the registry.

### D-002 Uninstall Text Disagrees With Store Removal

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | Fix in Make Docs 2.2.0 on the core ([Q-035](#q-035-scope-of-the-uninstall-fix-in-220)) | Part of the uninstall fix. Step 0 work phase `07-shared-core`. Owner: [05 Kit Conventions, CLI Top Level](05-kit-conventions.md#cli-top-level). |

**Issue**: The `uninstall` help says that it removes "the global store at ~/.make-docs/" ([`make-docs v2.0.6: packages/cli/src/cli.ts:3652`](../../kits/make-docs/packages/cli/src/cli.ts)). Its options list leaves out `--remove-store` ([`make-docs v2.0.6: packages/cli/src/cli.ts:3662`](../../kits/make-docs/packages/cli/src/cli.ts)). The command prints "The global Store is preserved" also when `--remove-store` is set ([`make-docs v2.0.6: packages/cli/src/self/uninstall-tool.ts:126`](../../kits/make-docs/packages/cli/src/self/uninstall-tool.ts)). Make Docs PRD 16 says that `uninstall` removes the Store ([`make-docs v2.0.6: docs/prd/16-package-runtime-and-deployment-boundaries.md:18`](../../kits/make-docs/docs/prd/16-package-runtime-and-deployment-boundaries.md)), but the Make Docs rule R-SELF-1 keeps it.

**Why it matters**: A person can think that `uninstall` deletes their Store, or that `--remove-store` did nothing. The help, the message and PRD 16 disagree with the code.

**Recommendation**: The help, the options list and the message state the R-SELF-1 rule: `uninstall` keeps the Store unless `--remove-store` is set. After copy day, the Make Docs register `kits/make-docs/docs/prd/03-open-questions-and-risk-register.md` tracks the PRD 16 text, because the Make Docs PRDs describe live code.

**To close**: `make-docs uninstall --help` lists `--remove-store`, the message matches the result, and Make Docs PRD 16 agrees with R-SELF-1.

### D-003 Package README Names an Old Version

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, CLI Top Level](05-kit-conventions.md#cli-top-level). |

**Issue**: The README in the 2.0.6 package says "Make Docs 2.0.4 needs Node.js 24". [`make-docs v2.0.6: packages/cli/README.md:7`](../../kits/make-docs/packages/cli/README.md).

**Why it matters**: The npm package page shows a wrong version to every user.

**Recommendation**: Fix it in Make Docs 2.1.0 or later, not in 2.0.7, because the switch point allows only repository-link changes ([08 Build and Release, Switch Point](08-build-and-release.md#switch-point)). Check the README version against `package.json` in the package proof.

**To close**: The README in the published tarball names the package version, and a check fails when the two differ.

### D-004 Run Help Names a Retired Domain

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Run Command Paths](05-kit-conventions.md#run-command-paths). |

**Issue**: The hand-written `run` help shows the example `make-docs run package plan --harness codex ...` ([`make-docs v2.0.6: packages/cli/src/cli.ts:3591`](../../kits/make-docs/packages/cli/src/cli.ts)). Make Docs R-GRAM-1 says that `run package` is not a current surface ([`make-docs v2.0.6: docs/prd/39-cli-command-model-and-operation-registry.md:275`](../../kits/make-docs/docs/prd/39-cli-command-model-and-operation-registry.md)).

**Why it matters**: An agent that copies the example runs a command that fails.

**Recommendation**: Take each help example from a current identifier in the registry.

**To close**: No help text names `run package`, and a test checks each help example against the registry.

### D-005 CLI Source Notes Name Retired Domains

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Run Command Paths](05-kit-conventions.md#run-command-paths). |

**Issue**: The CLI source README names `playbook` and `package` as the registered domains. It leaves out `prd`, `performance`, `backlog`, `resource`, `project`, `lifecycle` and `uat` ([`make-docs v2.0.6: packages/cli/src/README.md:41`](../../kits/make-docs/packages/cli/src/README.md)). It says that the `lifecycle` dispatcher was pruned, but `lifecycle` is a live domain ([`make-docs v2.0.6: packages/cli/src/README.md:47`](../../kits/make-docs/packages/cli/src/README.md)). A code comment points to the removed `src/operations/cli.ts` ([`make-docs v2.0.6: packages/cli/src/operations/cli-options.ts:5`](../../kits/make-docs/packages/cli/src/operations/cli-options.ts)). The type `OperationDomainName` lists only `closeout`, `work`, `lifecycle` and `prd` ([`make-docs v2.0.6: packages/cli/src/operations/types.ts:16`](../../kits/make-docs/packages/cli/src/operations/types.ts)).

**Why it matters**: Maintainers and agents read the source notes to find the domains. Wrong notes lead to wrong changes, also during the core slices.

**Recommendation**: The source README lists the live domains, no comment names a removed file, and `OperationDomainName` comes from the registry.

**To close**: The source README, the comment and the type agree with the registry.

### D-006 Run Usage Shows Two Segments

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Run Command Paths](05-kit-conventions.md#run-command-paths). |

**Issue**: The usage text shows `make-docs run <domain> <verb>` ([`make-docs v2.0.6: packages/cli/src/cli.ts:3586`](../../kits/make-docs/packages/cli/src/cli.ts), [`make-docs v2.0.6: packages/cli/src/cli.ts:2547`](../../kits/make-docs/packages/cli/src/cli.ts)). Most `run` paths have three segments.

**Why it matters**: The usage text does not match most real command paths.

**Recommendation**: The usage text shows both shapes: `make-docs run <domain> <verb>` and `make-docs run <domain> <object> <verb>`.

**To close**: The usage text shows both shapes.

### D-007 MCP Tool Names Change the Operation Verb

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner decision on the live names. Owner: [05 Kit Conventions, Run Command Paths](05-kit-conventions.md#run-command-paths). |

**Issue**: Some MCP tool names change or drop the verb of their identifier. `work.backlog-cache.lookup` is `backlog_cache_read`, and `project.persona.list` is `personas`. [`make-docs v2.0.6: packages/cli/src/mcp/tools.ts:137`](../../kits/make-docs/packages/cli/src/mcp/tools.ts).

**Why it matters**: An agent cannot predict a tool name from its identifier. A rename of a live tool breaks the agent-tool rules and the Skills that name it.

**Recommendation**: New kits take each tool name from its identifier and keep the verb. Make Docs keeps its live names in 2.x as an accepted exception, unless the owner chooses a rename with aliases.

**To close**: The owner accepts the exception or chooses the rename, and the core name-map rule follows that choice.

### D-008 No Single Exit-Code Table

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Outcomes and Exit Codes](05-kit-conventions.md#outcomes-and-exit-codes). |

**Issue**: Four places set exit codes: [`make-docs v2.0.6: packages/cli/src/run/entry.ts:21`](../../kits/make-docs/packages/cli/src/run/entry.ts), [`make-docs v2.0.6: packages/cli/src/run/cli.ts:583`](../../kits/make-docs/packages/cli/src/run/cli.ts), [`make-docs v2.0.6: packages/cli/src/cli.ts:1845`](../../kits/make-docs/packages/cli/src/cli.ts) and [`make-docs v2.0.6: packages/cli/src/run/root-operations.ts:485`](../../kits/make-docs/packages/cli/src/run/root-operations.ts).

**Why it matters**: Each command can choose its own codes, so scripts and agents cannot rely on one meaning for each code.

**Recommendation**: One function sets the exit code from the result status, with the 0, 1 and 2 rows of the [Exit-Code Table](05-kit-conventions.md#exit-code-table). The core holds that function.

**To close**: One function maps each result status to its exit code, and a test covers each row of the table.

### D-009 Update and Uninstall Exit 0 When Not Finished

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Outcomes and Exit Codes](05-kit-conventions.md#outcomes-and-exit-codes). |

**Issue**: `update` and `uninstall` return `refused-non-interactive`, `cancelled`, `manual-binary-removal-required`, `delegate-failed` or `manual-update-required` without an error. The CLI does not use the result for the exit code, so they exit 0. [`make-docs v2.0.6: packages/cli/src/cli.ts:389`](../../kits/make-docs/packages/cli/src/cli.ts), [`make-docs v2.0.6: packages/cli/src/self/uninstall-tool.ts:103`](../../kits/make-docs/packages/cli/src/self/uninstall-tool.ts), [`make-docs v2.0.6: packages/cli/src/self/update-tool.ts:189`](../../kits/make-docs/packages/cli/src/self/update-tool.ts).

**Why it matters**: A script or an agent sees success when the update or the uninstall did not finish.

**Recommendation**: Each of these results exits 1.

**To close**: Each listed result exits 1, and a test covers each one.

### D-010 UAT Validators Exit 0 When Not Passed

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. The Naive UAT removal can close it ([Q-009](#q-009-naive-uat-removal)). Owner: [05 Kit Conventions, Outcomes and Exit Codes](05-kit-conventions.md#outcomes-and-exit-codes). |

**Issue**: The six `uat.*.validate` operations exit 0 when the status is not `passed`. [`make-docs v2.0.6: packages/cli/src/run/cli.ts:583`](../../kits/make-docs/packages/cli/src/run/cli.ts).

**Why it matters**: A failed check looks like a pass in a script or in CI.

**Recommendation**: Close this item with the Naive UAT removal in a later Make Docs wave. Do not make a separate fix for it.

**To close**: The `uat.*.validate` operations are gone, or each one exits 1 when the status is not `passed`.

### D-011 Input Errors Exit 1 Outside Path Hygiene

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Outcomes and Exit Codes](05-kit-conventions.md#outcomes-and-exit-codes). |

**Issue**: Outside path hygiene, an input error throws and exits 1 ([`make-docs v2.0.6: packages/cli/src/run/entry.ts:21`](../../kits/make-docs/packages/cli/src/run/entry.ts)). Path hygiene exits 2 on read errors and also on every other thrown error ([`make-docs v2.0.6: packages/cli/src/cli.ts:1848`](../../kits/make-docs/packages/cli/src/cli.ts)).

**Why it matters**: Code 2 has two meanings in path hygiene and no use in other commands, so a caller cannot tell an input error from a failure.

**Recommendation**: Each command exits 2 only for an input error, and 1 for every other thrown error.

**To close**: A bad flag exits 2 in each command group, and an operation error in path hygiene exits 1.

### D-012 Path Hygiene Errors Skip the JSON Error Shape

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Outcomes and Exit Codes](05-kit-conventions.md#outcomes-and-exit-codes). |

**Issue**: A path-hygiene error prints the plain text `Path check error: ...`, also in JSON mode. [`make-docs v2.0.6: packages/cli/src/cli.ts:1847`](../../kits/make-docs/packages/cli/src/cli.ts).

**Why it matters**: A caller in JSON mode cannot parse the error.

**Recommendation**: In JSON mode, path hygiene prints the CLI error shape from [Result and Error Shapes](05-kit-conventions.md#result-and-error-shapes) on stderr.

**To close**: A path-hygiene error in JSON mode prints `{ok:false, code, message}` on stderr, and a test covers it.

### D-013 Success JSON Has No `ok` Field

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Outcomes and Exit Codes](05-kit-conventions.md#outcomes-and-exit-codes). |

**Issue**: `run` prints the raw result with no `ok` field ([`make-docs v2.0.6: packages/cli/src/run/cli.ts:578`](../../kits/make-docs/packages/cli/src/run/cli.ts)). Only the error shape has `ok`.

**Why it matters**: A caller must tell success from an error by the stream alone.

**Recommendation**: Each JSON success result has `ok: true`, then the result fields, as [Result and Error Shapes](05-kit-conventions.md#result-and-error-shapes) sets. A new field keeps old callers working.

**To close**: Each `--json` success result has `ok: true`, and a test covers it.

### D-014 Gate Errors Share One Code

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Outcomes and Exit Codes](05-kit-conventions.md#outcomes-and-exit-codes). |

**Issue**: A refused write and a missing approval each have their own error class but no `code`, so both serialize as `operation-error` ([`make-docs v2.0.6: packages/cli/src/operations/context.ts:110`](../../kits/make-docs/packages/cli/src/operations/context.ts), [`make-docs v2.0.6: packages/cli/src/operations/context.ts:117`](../../kits/make-docs/packages/cli/src/operations/context.ts), [`make-docs v2.0.6: packages/cli/src/operations/registry.ts:520`](../../kits/make-docs/packages/cli/src/operations/registry.ts)). A pending operation has its own code, `operation-pending` ([`make-docs v2.0.6: packages/cli/src/operations/context.ts:130`](../../kits/make-docs/packages/cli/src/operations/context.ts)).

**Why it matters**: A caller cannot tell a refused write from a missing approval without a parse of the message text.

**Recommendation**: The refused write and the missing approval each get their own stable `code`.

**To close**: Each gate error serializes with its own code, and a test covers each one.

### D-015 Resource Commands Use a Format Flag for JSON

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, JSON Output and Dry Run](05-kit-conventions.md#json-output-and-dry-run). |

**Issue**: `resource list` uses `--format table|json`, and `resource read` uses `--format raw|json`. The defaults are `table` and `raw`. Neither command prints JSON on a non-TTY. [`make-docs v2.0.6: packages/cli/src/run/root-operations.ts:69`](../../kits/make-docs/packages/cli/src/run/root-operations.ts), [`make-docs v2.0.6: packages/cli/src/run/root-operations.ts:143`](../../kits/make-docs/packages/cli/src/run/root-operations.ts).

**Why it matters**: Agents need a second flag spelling for one command group, and a non-TTY caller gets a table.

**Recommendation**: Both commands take `--json` and print JSON on a non-TTY. `--format` keeps working until a major release, because live scripts and Skills use it.

**To close**: `--json` and a non-TTY stdout give JSON for both commands.

### D-016 Setup Backup and Remove Lack JSON and Dry Run

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, JSON Output and Dry Run](05-kit-conventions.md#json-output-and-dry-run). |

**Issue**: `setup backup` and `setup remove` reject `--json` ([`make-docs v2.0.6: packages/cli/src/cli.ts:2749`](../../kits/make-docs/packages/cli/src/cli.ts)) and `--dry-run` ([`make-docs v2.0.6: packages/cli/src/cli.ts:2787`](../../kits/make-docs/packages/cli/src/cli.ts)).

**Why it matters**: Both commands write project files, but a caller cannot preview them or read their result as JSON.

**Recommendation**: Both commands take `--json` and `--dry-run`.

**To close**: Both flags work on both commands, and tests cover them.

### D-017 Run Has No Dry Run

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, JSON Output and Dry Run](05-kit-conventions.md#json-output-and-dry-run). |

**Issue**: `--dry-run` is not in `BOOLEAN_FLAGS` ([`make-docs v2.0.6: packages/cli/src/operations/cli-options.ts:17`](../../kits/make-docs/packages/cli/src/operations/cli-options.ts)), so `run` reads it as a flag that needs a value. Dry run is off unless a command spelling sets it ([`make-docs v2.0.6: packages/cli/src/run/cli.ts:555`](../../kits/make-docs/packages/cli/src/run/cli.ts)).

**Why it matters**: A person or an agent cannot preview a `run` command that writes.

**Recommendation**: `--dry-run` is a boolean flag for `run`, and it sets `dryRun` in the execution context.

**To close**: `make-docs run <write path> --dry-run` writes nothing and reports the result, and a test covers it.

### D-018 Setup Skills Has No JSON Output

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, JSON Output and Dry Run](05-kit-conventions.md#json-output-and-dry-run). |

**Issue**: `setup skills` takes `--dry-run` but rejects `--json`. [`make-docs v2.0.6: packages/cli/src/cli.ts:2749`](../../kits/make-docs/packages/cli/src/cli.ts).

**Why it matters**: A caller cannot read the result of a Skills install as JSON.

**Recommendation**: `setup skills` takes `--json` and prints JSON on a non-TTY.

**To close**: `make-docs setup skills --json` prints JSON, and a test covers it.

### D-019 Update and Uninstall Lack JSON and Dry Run

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, JSON Output and Dry Run](05-kit-conventions.md#json-output-and-dry-run). |

**Issue**: The `update` and `uninstall` parser accepts only `--help`, `--yes`, `--remove-store` and `--target`. [`make-docs v2.0.6: packages/cli/src/cli.ts:2252`](../../kits/make-docs/packages/cli/src/cli.ts).

**Why it matters**: A caller cannot preview an update or an uninstall, or read its result as JSON. [D-009](#d-009-update-and-uninstall-exit-0-when-not-finished) is the related exit-code gap.

**Recommendation**: Both commands take `--json` and `--dry-run`. Fix D-009 and D-019 in the same release, because both touch the same result code.

**To close**: Both flags work on both commands, and tests cover them.

### D-020 Project Commands Ignore a Non-TTY

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, JSON Output and Dry Run](05-kit-conventions.md#json-output-and-dry-run). |

**Issue**: `project` commands print JSON only with an explicit `--json` ([`make-docs v2.0.6: packages/cli/src/run/root-operations.ts:307`](../../kits/make-docs/packages/cli/src/run/root-operations.ts), `:361`, `:408`, `:486`, `:567`). On a non-TTY, their success output is text, but their error output is JSON ([`make-docs v2.0.6: packages/cli/src/run/entry.ts:34`](../../kits/make-docs/packages/cli/src/run/entry.ts)).

**Why it matters**: An agent that runs a `project` command without `--json` gets text on success and JSON on an error.

**Recommendation**: `project` commands print JSON on a non-TTY, as `run` does.

**To close**: Each `project` command prints JSON on a non-TTY, and a test covers it.

### D-021 Path Hygiene Uses Its Own Output and Write Flags

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | `repair` stays preview-first ([Q-036](#q-036-preview-first-write-commands)) | No release is set yet. Owner: [05 Kit Conventions, JSON Output and Dry Run](05-kit-conventions.md#json-output-and-dry-run), [05 Kit Conventions, CLI Write Intent](05-kit-conventions.md#cli-write-intent). |

**Issue**: Path hygiene uses `--format text|json`, with JSON as the default also on a TTY ([`make-docs v2.0.6: packages/cli/src/cli.ts:1770`](../../kits/make-docs/packages/cli/src/cli.ts), [`make-docs v2.0.6: packages/cli/src/cli.ts:1802`](../../kits/make-docs/packages/cli/src/cli.ts)). `repair` meets the preview-first rule in [CLI Write Intent](05-kit-conventions.md#cli-write-intent). It previews by default, writes only with `--apply`, takes `--dry-run` for the preview and fails when both flags are set ([`make-docs v2.0.6: packages/cli/src/cli.ts:1806`](../../kits/make-docs/packages/cli/src/cli.ts), [`make-docs v2.0.6: packages/cli/src/cli.ts:1814`](../../kits/make-docs/packages/cli/src/cli.ts)). Its MCP tool `paths_repair` writes only with `apply: true` and `allowWrite` ([`make-docs v2.0.6: packages/cli/src/operations/project/ops.ts:415`](../../kits/make-docs/packages/cli/src/operations/project/ops.ts)). But the Make Docs PRDs do not name `project path-hygiene repair` as a preview-first command. PRD 39 names the path-hygiene operations only as a group ([`make-docs v2.0.6: docs/prd/39-cli-command-model-and-operation-registry.md:96`](../../kits/make-docs/docs/prd/39-cli-command-model-and-operation-registry.md)).

**Why it matters**: Path hygiene has a third output rule. An agent that reads only the Make Docs PRDs cannot tell that `repair` writes nothing without `--apply`.

**Recommendation**: Path hygiene follows the `--json` and TTY rule. `repair` keeps its preview-first default and its `--apply` flag. After copy day, the Make Docs PRDs name `project path-hygiene repair` as a preview-first command.

**To close**: Path hygiene follows the JSON rule, and the Make Docs PRDs name `repair` as a preview-first command.

### D-022 CLI Write Permission Works Three Ways

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, CLI Write Intent](05-kit-conventions.md#cli-write-intent). |

**Issue**: `run` always allows writes ([`make-docs v2.0.6: packages/cli/src/run/cli.ts:553`](../../kits/make-docs/packages/cli/src/run/cli.ts)). `project` commands decide by verb ([`make-docs v2.0.6: packages/cli/src/run/root-operations.ts:302`](../../kits/make-docs/packages/cli/src/run/root-operations.ts)). `resource ensure` needs `--allow-write` ([`make-docs v2.0.6: packages/cli/src/run/root-operations.ts:195`](../../kits/make-docs/packages/cli/src/run/root-operations.ts)). The path-hygiene `repair --apply` flag meets the preview-first rule ([Q-036](#q-036-preview-first-write-commands)), so it is not part of this gap. [D-021](#d-021-path-hygiene-uses-its-own-output-and-write-flags) tracks what still differs in path hygiene.

**Why it matters**: A person or an agent cannot know whether a write command needs a flag.

**Recommendation**: The command is the write intent. `resource ensure` writes without `--allow-write` and previews with `--dry-run`. `--allow-write` stays accepted with no effect until a major release. Release notes say that `resource ensure` writes by default.

**To close**: Each CLI write command writes without a separate permission flag and previews with `--dry-run`, and tests cover it.

### D-023 Target Flags Have Different Names

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Project Target](05-kit-conventions.md#project-target). |

**Issue**: The CLI uses `--target` ([`make-docs v2.0.6: packages/cli/src/cli.ts:2306`](../../kits/make-docs/packages/cli/src/cli.ts)), `--target-root` ([`make-docs v2.0.6: packages/cli/src/run/cli.ts:215`](../../kits/make-docs/packages/cli/src/run/cli.ts)) and `--repo-root` ([`make-docs v2.0.6: packages/cli/src/run/cli.ts:89`](../../kits/make-docs/packages/cli/src/run/cli.ts)). MCP uses `targetDir` ([`make-docs v2.0.6: packages/cli/src/mcp/tools.ts:63`](../../kits/make-docs/packages/cli/src/mcp/tools.ts)) and `targetRoot`.

**Why it matters**: Agents must learn several names for one input. In a repository with nested projects, a wrong name sends a command to the wrong project.

**Recommendation**: Each CLI command takes `--target-root`, and each MCP tool takes `targetRoot`. `--target`, `--repo-root` and `targetDir` stay as aliases in Make Docs 2.x, because live agent configs and Skills use them.

**To close**: Each command and tool accepts the target names, and a test covers each surface.

### D-024 Two Project Root Searches

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | Fix in Make Docs 2.1.0, with the nested-project fixes ([Q-014](#q-014-nested-project-fixes)) | The code cause of [O-001](#o-001-upward-project-search-stops-at-the-nearest-project). Owner: [05 Kit Conventions, Project Target](05-kit-conventions.md#project-target). |

**Issue**: The `run` default stops at the nearest `.make-docs/config.yaml` ([`make-docs v2.0.6: packages/cli/src/run/cli.ts:73`](../../kits/make-docs/packages/cli/src/run/cli.ts)). `findRepoRoot` stops at the nearest `docs/work` folder or `.git` ([`make-docs v2.0.6: packages/cli/src/operations/shared.ts:6`](../../kits/make-docs/packages/cli/src/operations/shared.ts)).

**Why it matters**: A nested project with no `docs/work/` folder resolves to its parent project. Every kit in this repository keeps an empty `docs/work/` folder to avoid this (O-001).

**Recommendation**: Every command and every MCP tool uses one search: walk up to the nearest project config, and use the working folder when none is found.

**To close**: Make Docs 2.1.0 ships one search with a nested-project test, and O-001 is `Fulfilled`.

### D-025 Agent-Tool Entry Name Has Two Spellings

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, MCP Server](05-kit-conventions.md#mcp-server). |

**Issue**: Codex uses `mcp_servers.make_docs` ([`make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:50`](../../kits/make-docs/packages/cli/src/harness-access/registry.ts), [`make-docs v2.0.6: packages/cli/src/harness-access/native.ts:617`](../../kits/make-docs/packages/cli/src/harness-access/native.ts)). Claude Code, Copilot and generic clients use `mcpServers.make-docs` ([`make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:74`](../../kits/make-docs/packages/cli/src/harness-access/registry.ts), [`make-docs v2.0.6: packages/cli/src/harness-access/registry.ts:104`](../../kits/make-docs/packages/cli/src/harness-access/registry.ts), [`make-docs v2.0.6: packages/cli/src/generic-mcp-setup.ts:110`](../../kits/make-docs/packages/cli/src/generic-mcp-setup.ts)).

**Why it matters**: The entry name differs between agent tools, so the core cannot build it from one kit name.

**Recommendation**: New kits use `<kit-cli>` as the entry name in every agent tool. Make Docs changes its Codex entry name only together with a setup step that removes the old `make_docs` entry, so no machine has two Make Docs entries.

**To close**: The Codex entry is `make-docs`, setup removes the old entry, and a test covers a machine with the old entry.

### D-026 MCP Server Name Is the npm Package Name

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, MCP Server](05-kit-conventions.md#mcp-server). |

**Issue**: The MCP server name is `@brucewaynedecoy/make-docs`, not `make-docs`. [`make-docs v2.0.6: packages/cli/src/mcp/server.ts:35`](../../kits/make-docs/packages/cli/src/mcp/server.ts).

**Why it matters**: The target rule names each server `<kit-cli>`. A scoped package name differs from the CLI name that agents see in their config.

**Recommendation**: The server name is `make-docs`. The server version stays the package version.

**To close**: The MCP initialize result names the server `make-docs`, and a test covers it.

### D-027 Agent-Tool Entries Always Run Profile All

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, MCP Server](05-kit-conventions.md#mcp-server). |

**Issue**: Each agent-tool entry writes `args = ["mcp"]` with no `--profile`, so every entry runs the default profile `all`. [`make-docs v2.0.6: packages/cli/src/harness-access/native.ts:619`](../../kits/make-docs/packages/cli/src/harness-access/native.ts).

**Why it matters**: The intent profiles have no effect for agent-tool entries, so every agent session lists every tool.

**Recommendation**: Setup writes `--profile <name>` into each entry. The profile is `all` unless the person chooses another one.

**To close**: Each entry has `--profile <name>`, and a test covers each agent tool.

### D-028 Manifest Tool Description Names a Legacy File

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, MCP Server](05-kit-conventions.md#mcp-server). |

**Issue**: The `manifest` tool says that it reads `.make-docs/manifest.json` ([`make-docs v2.0.6: packages/cli/src/mcp/tools.ts:102`](../../kits/make-docs/packages/cli/src/mcp/tools.ts)). `loadManifest` reads the Store installation ledger ([`make-docs v2.0.6: packages/cli/src/manifest.ts:155`](../../kits/make-docs/packages/cli/src/manifest.ts)).

**Why it matters**: An agent that reads the description looks for a legacy project file that the kit does not write.

**Recommendation**: The tool description names the Store installation ledger.

**To close**: The description matches the code.

### D-029 Block Markers Are Not Tag-Aware

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | Fix in Make Docs 2.2.0 on the core, with tag-aware managed blocks ([Q-007](#q-007-make-docs-changes-in-step-0)) | Step 0 work phase `07-shared-core`. Owner: [05 Kit Conventions, Routers and Managed Blocks](05-kit-conventions.md#routers-and-managed-blocks), [06 Shared Core](06-shared-core.md#core-versions-and-the-exact-pin). |

**Issue**: The markers are fixed strings ([`make-docs v2.0.6: packages/cli/src/managed-block.ts:1`](../../kits/make-docs/packages/cli/src/managed-block.ts)). Callers such as [`make-docs v2.0.6: packages/cli/src/planner.ts:1780`](../../kits/make-docs/packages/cli/src/planner.ts) and [`make-docs v2.0.6: packages/cli/src/operations/project/ops.ts:272`](../../kits/make-docs/packages/cli/src/operations/project/ops.ts) pass no markers. A second kit that uses this code writes `make-docs` markers.

**Why it matters**: Two kits cannot share one instruction file safely.

**Recommendation**: The core block code takes each kit's tag as input, as [06 Shared Core](06-shared-core.md#core-versions-and-the-exact-pin) sets. Make Docs keeps its live markers.

**To close**: Make Docs 2.2.0 ships tag-aware blocks, and a test keeps a `make-docs` block and a `make-blueprint` block in one file.

### D-030 Setup Remove Keeps the Kit Block

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | Fix in Make Docs 2.2.0 on the core, with the uninstall fix ([Q-007](#q-007-make-docs-changes-in-step-0)) | The uninstall fix also covers D-002 and D-039 ([Q-035](#q-035-scope-of-the-uninstall-fix-in-220)). Owner: [05 Kit Conventions, Routers and Managed Blocks](05-kit-conventions.md#routers-and-managed-blocks), [06 Shared Core](06-shared-core.md#core-versions-and-the-exact-pin). |

**Issue**: When a router also holds user text, `setup remove` keeps the whole file, the Make Docs block included ([`make-docs v2.0.6: packages/cli/src/audit.ts:330`](../../kits/make-docs/packages/cli/src/audit.ts)). Sync removal strips only the block ([`make-docs v2.0.6: packages/cli/src/planner.ts:716`](../../kits/make-docs/packages/cli/src/planner.ts)).

**Why it matters**: After `setup remove`, the project still has a Make Docs block that tells agents to use a kit that is gone.

**Recommendation**: `setup remove` strips only the Make Docs block and keeps the user text. It deletes the file only when nothing is left.

**To close**: Make Docs 2.2.0 ships the fix, and a test removes the block from a file with user text and keeps that text byte for byte.

### D-031 Block Library Reasserts Malformed Blocks

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Routers and Managed Blocks](05-kit-conventions.md#routers-and-managed-blocks). |

**Issue**: The block library reasserts a malformed block ([`make-docs v2.0.6: packages/cli/src/managed-block.ts:136`](../../kits/make-docs/packages/cli/src/managed-block.ts)). The setup planner skips the file with "Repair it before setup can continue" ([`make-docs v2.0.6: packages/cli/src/planner.ts:367`](../../kits/make-docs/packages/cli/src/planner.ts)).

**Why it matters**: The library and the planner disagree. A caller that uses the library directly can overwrite user text near a malformed block.

**Recommendation**: The core block library stops and names the file, as the planner does today. [06 Shared Core](06-shared-core.md#rebuild-notes) keeps the setup behavior.

**To close**: No caller can reassert a malformed block, and a test covers it.

### D-032 Codex TOML Uses a Second Block Format

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Routers and Managed Blocks](05-kit-conventions.md#routers-and-managed-blocks). |

**Issue**: The Codex config uses `# make-docs:begin harness-access codex mcp` and `# make-docs:end harness-access codex mcp`, outside the block library. [`make-docs v2.0.6: packages/cli/src/harness-access/native.ts:102`](../../kits/make-docs/packages/cli/src/harness-access/native.ts).

**Why it matters**: Two block formats need two parsers with two sets of rules.

**Recommendation**: The core block code also handles the TOML markers in [Block Markers](05-kit-conventions.md#block-markers). The live Codex markers already fit that form, so they stay the same.

**To close**: The Codex TOML block uses the core block code, and a test covers it.

### D-033 Make Docs Project Folder Name

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | A later Make Docs wave sets the folder to `.make/docs/` ([Q-007](#q-007-make-docs-changes-in-step-0)) | No release is set yet. Owner: [05 Kit Conventions, Project Config](05-kit-conventions.md#project-config). |

**Issue**: The project tool directory is `.make-docs/`, not `.make/docs/`. [`make-docs v2.0.6: packages/cli/src/tool-directory.ts:7`](../../kits/make-docs/packages/cli/src/tool-directory.ts).

**Why it matters**: Make Docs differs from every other kit. A folder change touches every live Make Docs project.

**Recommendation**: The later wave reads `.make-docs/` as input and writes `.make/docs/`. Tool discovery finds both folders ([06 Shared Core](06-shared-core.md#tool-discovery)). Fix [D-034](#d-034-config-key-styles-are-mixed) in the same release, so projects change their config once.

**To close**: A Make Docs release uses `.make/docs/`, reads `.make-docs/` as input, and tests cover both.

### D-034 Config Key Styles Are Mixed

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. The gap covers top-level keys only ([Q-038](#q-038-nested-config-key-style)). Related: [D-041](#d-041-make-docs-sets-no-nested-config-key-style). Owner: [05 Kit Conventions, Project Config](05-kit-conventions.md#project-config). |

**Issue**: The top-level key `prd_authority` uses snake_case, and the other top-level keys use camelCase. [`make-docs v2.0.6: packages/cli/src/config.ts:161`](../../kits/make-docs/packages/cli/src/config.ts).

**Why it matters**: The target rule says that top-level config keys use camelCase. A live project config uses `prd_authority`.

**Recommendation**: Make Docs accepts `prdAuthority` and reads `prd_authority` as a retired key with a diagnostic, in the same release as D-033.

**To close**: Make Docs accepts `prdAuthority`, and a test covers the retired key.

### D-035 Shared and Kit-Only Settings Share One File

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | The setup tool wave owns the shared files ([Q-001](#q-001-step-0-backlog-scope), [Q-007](#q-007-make-docs-changes-in-step-0)) | No release is set yet. Related: [Q-027](#q-027-persona-list-move-for-existing-projects), [Q-028](#q-028-shared-file-schema-details), [Q-029](#q-029-agent-tool-choices-for-existing-make-docs-projects). Owner: [05 Kit Conventions, Project Config](05-kit-conventions.md#project-config), [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md). |

**Issue**: `harnessIntegrations` and `harnessCapabilities`, which belong in `.make/config.yaml`, and `personas`, which belongs in `.make/personas.yaml`, sit beside the kit-only `labels`, `generatedProse` and `prd_authority`. [`make-docs v2.0.6: packages/cli/src/config.ts:95`](../../kits/make-docs/packages/cli/src/config.ts).

**Why it matters**: A second kit cannot read the shared choices without a read of the Make Docs config.

**Recommendation**: In the setup tool wave, Make Docs reads its agent-tool choices from `.make/config.yaml` and its Personas from `.make/personas.yaml`, through the core.

**To close**: Make Docs reads the shared files through the core, and `.make-docs/config.yaml` holds kit-only settings.

### D-036 PRD 21 Lists a Project Skill Root

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. After copy day, the Make Docs register tracks the PRD text. Owner: [05 Kit Conventions, Project Config](05-kit-conventions.md#project-config). |

**Issue**: The folder model in Make Docs PRD 21 lists `.make-docs/agentics/skills/` ([`make-docs v2.0.6: docs/prd/21-project-tool-directory-and-resource-tiers.md:29`](../../kits/make-docs/docs/prd/21-project-tool-directory-and-resource-tiers.md)). The code treats that root as retired ([`make-docs v2.0.6: packages/cli/src/tool-directory.ts:24`](../../kits/make-docs/packages/cli/src/tool-directory.ts)), and the skills README says "Never create an active `.make-docs/agentics` Skill root" ([`make-docs v2.0.6: packages/skills/README.md:5`](../../kits/make-docs/packages/skills/README.md)).

**Why it matters**: An agent that reads PRD 21 can make a Skill root that the code treats as retired.

**Recommendation**: After copy day, record this item in `kits/make-docs/docs/prd/03-open-questions-and-risk-register.md`, and correct PRD 21 there, because the Make Docs PRDs describe live code.

**To close**: Make Docs PRD 21 agrees with the code and the skills README.

### D-037 Make Docs Machine Folder Name

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | A later Make Docs wave sets the folder to `~/.make/docs/` ([Q-007](#q-007-make-docs-changes-in-step-0)) | No release is set yet. Related: [R-010](#r-010-store-schema-locked-at-version-6). Owner: [05 Kit Conventions, Machine Folders](05-kit-conventions.md#machine-folders). |

**Issue**: The Store root is `~/.make-docs/`, not `~/.make/docs/`. [`make-docs v2.0.6: packages/cli/src/store/paths.ts:12`](../../kits/make-docs/packages/cli/src/store/paths.ts).

**Why it matters**: A new Store root moves the Store of every live user. Make Docs 2.0.x looks only in `~/.make-docs/`.

**Recommendation**: Fix it in the same later wave as D-033. `MAKE_DOCS_HOME` keeps its meaning, and the Store keeps schema version 6.

**To close**: A Make Docs release uses `~/.make/docs/`, finds an existing `~/.make-docs/` Store, and tests cover Linux, macOS and Windows.

### D-038 Help and README Give One Store Path for Every OS

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Machine Folders](05-kit-conventions.md#machine-folders). |

**Issue**: The help and the Store README give `~/.make-docs` for every operating system. [`make-docs v2.0.6: packages/cli/src/cli.ts:3652`](../../kits/make-docs/packages/cli/src/cli.ts), [`make-docs v2.0.6: packages/cli/src/store/README.md:16`](../../kits/make-docs/packages/cli/src/store/README.md).

**Why it matters**: A Windows user looks in the wrong folder. On Windows the Store root is below `LOCALAPPDATA`, then `APPDATA`, then the home folder.

**Recommendation**: The help and the Store README name the Store root for each operating system.

**To close**: The help and the README match the code on each operating system.

### D-039 Setup Remove Guard Uses a Fixed Store Path

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | Fix in Make Docs 2.2.0 on the core ([Q-035](#q-035-scope-of-the-uninstall-fix-in-220)) | Part of the uninstall fix. Step 0 work phase `07-shared-core`. Owner: [05 Kit Conventions, Machine Folders](05-kit-conventions.md#machine-folders). |

**Issue**: `setup remove` skips the pruning of `<home>/.make-docs` by a fixed path and ignores `MAKE_DOCS_HOME`. [`make-docs v2.0.6: packages/cli/src/uninstall.ts:161`](../../kits/make-docs/packages/cli/src/uninstall.ts).

**Why it matters**: When `MAKE_DOCS_HOME` names another folder, the guard does not protect that Store root.

**Recommendation**: The guard uses the resolved Store root and the content check in [Machine Folders](05-kit-conventions.md#machine-folders).

**To close**: The guard protects the Store root that `MAKE_DOCS_HOME` names, and a test covers it.

### D-040 Store README Calls the Project Manifest Canonical

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Owner: [05 Kit Conventions, Store Boundary](05-kit-conventions.md#store-boundary). |

**Issue**: The Store README calls `.make-docs/manifest.json` the canonical install record ([`make-docs v2.0.6: packages/cli/src/store/README.md:37`](../../kits/make-docs/packages/cli/src/store/README.md), again at `:104`). It says that the identity is minted into the manifest (`:41`). It also names a v5 backup file (`:14`), cites the missing `operations/playbook-packaging/registration-seam.ts` (`:36`) and says that the model "stays on schema version 1" (`:59`).

**Why it matters**: Maintainers read the Store README before the Store slices of the core work. Wrong notes can lead to a write of a legacy project record.

**Recommendation**: The Store README names the Store installation ledger as the install record and states schema version 6.

**To close**: The Store README agrees with the code.

### D-041 Make Docs Sets No Nested Config Key Style

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | No release is set yet. Related: [Q-038](#q-038-nested-config-key-style), [D-034](#d-034-config-key-styles-are-mixed). Owner: [05 Kit Conventions, Project Config](05-kit-conventions.md#project-config). |

**Issue**: The Make Docs PRDs set no style for nested config keys, and the nested keys use two styles. `prd_authority.markdown_sources` uses snake_case ([`make-docs v2.0.6: docs/prd/24-project-configuration-and-convention-overlay.md:57`](../../kits/make-docs/docs/prd/24-project-configuration-and-convention-overlay.md)). `labels.documentKinds` ([`make-docs v2.0.6: packages/cli/src/config.ts:163`](../../kits/make-docs/packages/cli/src/config.ts)), `reviewStatus` in `harnessCapabilities` ([`make-docs v2.0.6: packages/cli/src/config.ts:167`](../../kits/make-docs/packages/cli/src/config.ts)) and `accessCeiling` in `harnessIntegrations` ([`make-docs v2.0.6: packages/cli/src/config.ts:172`](../../kits/make-docs/packages/cli/src/config.ts)) use camelCase.

**Why it matters**: The target rule says that each kit sets the style of its nested keys in its own PRDs. Without that rule, a new nested Make Docs key can take either style.

**Recommendation**: After copy day, Make Docs PRD 24 states one style for nested keys. If the style is camelCase, as for most nested keys, `markdown_sources` changes in the same release as [D-034](#d-034-config-key-styles-are-mixed) and [D-033](#d-033-make-docs-project-folder-name), with the old key read as a retired key, so projects change their config once.

**To close**: The Make Docs PRDs state the nested key style, and the code agrees with it.

## Open Questions

`Q-001` to `Q-026` are the decisions of the Step 0 design interview. Each one records the question as the interview asked it, the recommendation, and the owner's answer. The [Make Kit Monorepo](../designs/2026-10-30-make-kit-monorepo.md) design records the same decisions in its sections. Later questions start at `Q-027`.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md`
- `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md`
- `AGENTS.md` and `CLAUDE.md` (the root map)

### Q-001 Step 0 Backlog Scope

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | The `W1 R0` backlog covers Step 0 only. The setup tool gets a later wave. | Owner: [01 Product Overview, Release Scope](01-product-overview.md#release-scope). |

**Question**: The baseline plan `W1 R0` writes the root PRDs for all repo-wide work. Does its work backlog cover Step 0 only (option A), or Step 0 and the setup tool (option B)?

**Why it matters**: Step 0 is already large. The backlog scope decides when Make Blueprint phase `01-shared-core-adoption` can start.

**Recommendation**: Option A. A smaller backlog lets Make Blueprint phase 01 start sooner.

**To close**: The owner chooses the backlog scope.

**Resolution**: The owner accepted option A on 2026-10-31. The `W1 R0` backlog covers Step 0 only. The setup tool and the shared files get a later repo-wide wave.

### Q-002 Switch Point Before the Core

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Copy, CI, then the switch with 2.0.7 (same code). The core comes after. | Owner: [01 Product Overview, Release Scope](01-product-overview.md#release-scope), [08 Build and Release, Switch Point](08-build-and-release.md#switch-point). |

**Question**: Does the switch point come before the core (option A: copy, CI, then the switch with release 2.0.7 with the same code, then the core and Make Docs on the core), or after the core is out (option B)?

**Why it matters**: The old repository is frozen from copy day to the switch point. A core bug must not hold the switch.

**Recommendation**: Option A. The old repository stays frozen for days, not weeks, and a core bug cannot block the switch.

**To close**: The owner chooses the order.

**Resolution**: The owner accepted option A on 2026-10-31. Design section 11 has the order.

### Q-003 Copy Source and Freeze

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Copy the latest release tag (today `v2.0.6`) with `git archive`. Freeze the old repository on copy day. Port unmerged branch work later. Close the old Dependabot pull requests. | Owner: [08 Build and Release, Source Home](08-build-and-release.md#source-home). |

**Question**: The `v2.0.6` tag is on the old `main` commit `ff0b97dc`. The old repository has 7 open Dependabot pull requests and 3 work branches. Copy the tree at the tag and freeze the old repository on copy day (option A), or land the open branches, release, and then copy (option B)?

**Why it matters**: The copy source decides which code comes into this repository and how long the freeze lasts.

**Recommendation**: Option A. Close the old Dependabot pull requests, and Dependabot opens them again in this repository. For an urgent fix before the switch, fix the old repository and port the fix by hand ([R-007](#r-007-urgent-fix-during-the-freeze)).

**To close**: The owner chooses the copy source.

**Resolution**: The owner accepted option A on 2026-10-31.

### Q-004 Public Repository Before the Switch

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Make `make-kit` public before the switch, after a scan. History: the owner first chose to stay private, then chose public on the same day. | Owner: [08 Build and Release, Public Repository](08-build-and-release.md#public-repository). |

**Question**: npm makes provenance only from a public repository, and `make-kit` is private on the free GitHub plan. Make the repository public before the switch, after a scan for secrets, client data and local paths (option A), or keep it private, buy a paid plan, and publish without provenance (option B)?

**Why it matters**: Provenance, branch and tag rulesets, and the CI minutes for macOS and Windows depend on the repository visibility.

**Recommendation**: Option A. Users keep provenance and a public source, and the rulesets work.

**To close**: The owner chooses the visibility.

**Resolution**: The owner first accepted option A on 2026-10-31. Later the same day, during the license question, the owner chose to keep the repository private. The question was then asked again with the facts for a private repository: no provenance, no rulesets and limited Actions minutes. On the same day, the owner chose to make the repository public before the switch point.

### Q-005 One Root npm Workspace

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | One private root `package.json`, workspaces `packages/*` and `kits/*/packages/*`, one lockfile. Fix the `tsup` path. | Owner: [02 Architecture Overview, Configuration Surfaces](02-architecture-overview.md#configuration-surfaces). |

**Question**: npm cannot nest one workspace root inside another. The Make Docs file `packages/cli/tsup.config.ts` loads `yaml` by a fixed path, and that path breaks when the packages move. Use one private root `package.json` with the workspaces `packages/*` and `kits/*/packages/*` and one root lockfile (option A), or one npm root and lockfile for each kit, with the core linked by a `file:` path (option B)?

**Why it matters**: The workspace shape decides how the core links into each kit and how many installs a maintainer runs.

**Recommendation**: Option A. One install, one lockfile and a real workspace link for the core.

**To close**: The owner chooses the workspace shape.

**Resolution**: The owner accepted option A on 2026-10-31.

### Q-006 Root PRD Set

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | `00` to `04`, then `05` to `08`. Root PRDs own the shared rules. R-001 and R-002 are root register items. A Make Blueprint change plan turns its shared rules into links. | Owner: [00 Index](00-index.md). The Make Blueprint change plan is plan phase [05 Make Blueprint Links](../plans/2026-11-01-w1-r0-make-kit-monorepo/05-make-blueprint-links.md). |

**Question**: Do the root PRDs own the shared rules, with the fixed files `00` to `04`, then `05-kit-conventions`, `06-shared-core`, `07-setup-tool-and-shared-files` and `08-build-and-release`, and with R-001 and R-002 in the root register (option A)? Or do the root PRDs copy the rules while Make Blueprint keeps its text (option B)?

**Why it matters**: Two copies of one rule drift apart.

**Recommendation**: Option A. Each rule gets one owner. After the root PRDs pass validation, a small Make Blueprint change plan turns the shared parts of Make Blueprint PRDs 05 to 09 into links.

**To close**: The owner chooses the PRD set.

**Resolution**: The owner accepted option A on 2026-10-31. R-001 and R-002 are in [Rebuild Risks](#rebuild-risks).

### Q-007 Make Docs Changes in Step 0

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | In Step 0: the core release, Make Docs on the core with tag-aware managed blocks and the uninstall fix, the link read command, and the O-fixes. Later: the handoff line, shared choices, the Persona move, the `.make/docs/` move and the Azure export. | Owner: [01 Product Overview, Release Scope](01-product-overview.md#release-scope). The scope of the uninstall fix is [Q-035](#q-035-scope-of-the-uninstall-fix-in-220). |

**Question**: Which Make Docs changes are in Step 0? Option A: the core release, Make Docs on the core with tag-aware managed blocks and the uninstall fix, the link read command and the fixes for O-001 to O-005. Later: the handoff line, shared choices, the Persona move, the `.make/docs/` move and the Azure export. Option B: only the core release and Make Docs on the core.

**Why it matters**: Make Blueprint stages 1 to 3 need these changes.

**Recommendation**: Option A. Make Blueprint has a path for a Make Docs that is too old to write the handoff line, so the handoff line can wait.

**To close**: The owner chooses the Step 0 changes.

**Resolution**: The owner accepted option A on 2026-10-31.

### Q-008 Routing Check Method

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | The script method in design section 14. Naive UAT is not used. | Owner: [02 Architecture Overview, Routing Check](02-architecture-overview.md#routing-check). |

**Question**: How does the project measure whether agents that start at the repository root land in the right docs? The second version of the question asked: a script in `scripts/routing-check/` (option A), or a manual checklist (option B)?

**Why it matters**: No baseline shows how agents behave in a repository with several docs roots. The same tasks each time let the second check compare with the first.

**Recommendation**: Option A. The script starts fresh read-only agents with `claude -p` and `codex exec` at the repository root. It runs 9 tasks, 3 for Make Docs, 3 for Make Blueprint and 3 repo-wide, and 2 runs per tool. A run passes when the agent reads the right router and names the right docs root. Results go in `docs/assets/maintainer/routing-check/<date>-baseline.md`, and each miss goes in this register. The check runs after copy day and again after the nested-project fixes.

**To close**: The owner chooses the method.

**Resolution**: The first version of the question framed the check with the Make Docs Naive UAT format. The owner did not accept it, because Naive UAT came from a misunderstanding (see [Q-009](#q-009-naive-uat-removal)). The second version left Naive UAT out, and the owner accepted option A on 2026-10-31.

### Q-009 Naive UAT Removal

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Out of Step 0. After the copy, record it in `kits/make-docs/docs/prd/03-open-questions-and-risk-register.md`. A later Make Docs wave removes it. The owner notes that the capability came from a misunderstanding and would likely not be missed. | Owner: [01 Product Overview, Release Scope](01-product-overview.md#release-scope). Step 0 work phase `01-copy-day` records it in the Make Docs register. |

**Question**: Naive UAT is still public in Make Docs: the `run uat` commands, the UAT tools in the MCP `quality` profile, and its system files. A removal of public commands can need a major version. Keep it out of Step 0 and record it for a later wave (option A), or remove it in the Make Docs release on the core (option B)?

**Why it matters**: The switch release and the core release must stay easy to check.

**Recommendation**: Option A.

**To close**: The owner chooses when Naive UAT goes.

**Resolution**: The owner accepted option A on 2026-10-31. The owner notes that the capability came from a misunderstanding and would likely not be missed. [D-010](#d-010-uat-validators-exit-0-when-not-passed) can close with the removal.

### Q-010 CI Layout and Release Tags

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | `make-docs-ci.yml`, one shared `publish-npm.yml`, package-named tags, digests in `.github/release-candidates/`. | Owner: [08 Build and Release, CI](08-build-and-release.md#ci), [Publish](08-build-and-release.md#publish). Related: [Q-034](#q-034-ci-for-the-core-and-the-setup-tool). |

**Question**: GitHub reads workflows only at the git root, and the old tags are `v<version>`. Use `.github/workflows/make-docs-ci.yml` on changes under `kits/make-docs/`, under `packages/core/` or to the root lockfile, one shared `publish-npm.yml` for every package, package-named tags such as `make-docs-v2.0.7` and `make-core-v0.1.0`, and digests in `.github/release-candidates/<tag>.sha256` (option A)? Or the same with one publish workflow for each package (option B)?

**Why it matters**: npm trusted publishing trusts one workflow file for each package.

**Recommendation**: Option A. All packages share one publish path, and each npm package can trust the same workflow file.

**To close**: The owner chooses the CI layout.

**Resolution**: The owner accepted option A on 2026-10-31.

### Q-011 Switch Test

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | The six steps in design section 3, with `2.0.7-rc.0` on `next` before `2.0.7` on `latest`. | Owner: [08 Build and Release, Switch Point](08-build-and-release.md#switch-point), [Release Gate](08-build-and-release.md#release-gate). Related: [Q-032](#q-032-release-gate-scope). |

**Question**: Does the switch test use six steps, with `2.0.7-rc.0` on the `next` dist-tag and an install check before `2.0.7` goes to `latest` (option A)? Or does 2.0.7 go straight to `latest` after a dry run (option B)?

**Why it matters**: A broken release at the switch point hurts live Make Docs users ([R-003](#r-003-broken-release-at-the-switch-point)).

**Recommendation**: Option A. Users on `latest` get nothing until the new path works. If the release candidate fails, the owner sets the trusted publisher back to the repository `make-docs`.

**To close**: The owner chooses the switch test.

**Resolution**: The owner accepted option A on 2026-10-31.

### Q-012 Old Repository Freeze

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Option B: the README banner, no `publish-npm.yml` or `dependabot.yml`, the Dependabot pull requests closed, and no archive. | Owner: [08 Build and Release, Old Repository](08-build-and-release.md#old-repository). |

**Question**: After `2.0.7` is on `latest`, the old repository gets a README banner that points to `kits/make-docs/` in `make-kit`, loses `publish-npm.yml`, and has its Dependabot pull requests closed. Is it also archived on GitHub (option A), or not archived (option B)?

**Why it matters**: The freeze must be clear to people who find the old repository, and the old history must stay readable.

**Recommendation**: Option A. An archived repository shows clearly that it is frozen, and the archive can be undone.

**To close**: The owner chooses the freeze.

**Resolution**: The owner chose option B on 2026-10-31, not the recommendation. The old repository is not archived. A later default, accepted with the round 3 decisions on the same day, also removes `dependabot.yml` from the old repository, so no new Dependabot pull requests open.

### Q-013 Code Owners

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Option B: the owner is the only code owner. | Owner: [08 Build and Release, Rulesets and Ownership](08-build-and-release.md#rulesets-and-ownership). |

**Question**: The old `CODEOWNERS` lists the owner and two other people. A code owner needs write access to `make-kit`. Does `kits/make-docs/` keep all three code owners while the rest of the repository has only the owner (option A), or is the owner the only code owner for the whole repository (option B)?

**Why it matters**: The code owners decide who reviews changes, and each code owner needs write access to the repository.

**Recommendation**: Option A. Make Docs reviews stay as they are today.

**To close**: The owner chooses the code owners.

**Resolution**: The owner chose option B on 2026-10-31, not the recommendation. `.github/CODEOWNERS` names only the owner.

### Q-014 Nested-Project Fixes

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | One Make Docs plan with one work item and one nested-project test for each O-number. Ship in 2.1.0 after the switch and before the core. Then clean up. | Owner: [Deferred Obligations](#deferred-obligations), [01 Product Overview, Release Scope](01-product-overview.md#release-scope). Step 0 work phase `06-nested-project-fixes`. |

**Question**: Do the fixes for O-001 to O-005 ship in one Make Docs plan and release after the switch and before the core work (option A), or inside the core work (option B)?

**Why it matters**: Until the fixes ship, every agent in this repository needs the numbered workarounds in the root map.

**Recommendation**: Option A. Small tested fixes come first, so agents have the fixes during the long core work. One Make Docs plan and backlog in `kits/make-docs/docs/` holds one work item for each O-number, and each work item has a nested-project test, because none exists today.

**To close**: The owner chooses how the fixes ship.

**Resolution**: The owner accepted option A on 2026-10-31. The fixes ship in Make Docs 2.1.0. After the owner installs 2.1.0, the cleanup removes each numbered item from the root `AGENTS.md` and `CLAUDE.md` and from the validation steps, and marks each obligation `Fulfilled` with its version and proof command.

### Q-015 Kit Conventions Source

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Rules from the Make Docs code. One target rule and a listed gap where Make Docs differs. Each gap gets a `D-###` item. | Owner: [05 Kit Conventions](05-kit-conventions.md). The gaps are [Confirmed Drift](#confirmed-drift). |

**Question**: Make Docs uses `.make-docs/` and `~/.make-docs/`, but the design sets `.make/<kit>/` and `~/.make/<kit>/`. Make Docs also has no single exit-code table, and `run` has no `--dry-run`. Take each rule from the Make Docs code, with one target rule and a listed gap where Make Docs differs (option A)? Or write only what Make Docs does today, so that Make Blueprint copies it (option B)?

**Why it matters**: Every kit follows these rules. Option B undoes the accepted `.make/` design.

**Recommendation**: Option A.

**To close**: The owner chooses the source of the rules.

**Resolution**: The owner accepted option A on 2026-10-31. [05 Kit Conventions](05-kit-conventions.md) lists 41 gaps, D-001 to D-041.

### Q-016 Core Extraction Order

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Slices from easy to hard, all tests green, kit names as inputs, Store schema version 6, core `0.1.0` with all eight areas, then Make Docs 2.2.0 with an exact pin. | Owner: [06 Shared Core, Slice Order](06-shared-core.md#slice-order). Related: [Q-031](#q-031-store-version-counter-for-base-and-kit-tables). |

**Question**: The easy parts of the core are resource reading, the block library, and tool update and uninstall. The hard parts are the operation registry, the Store migrations, and the block merge and remove code. Tool discovery is new code. Build the core in slices from easy to hard (option A), or take all eight areas in one change (option B)?

**Why it matters**: Live Make Docs users depend on every part that the core takes over.

**Recommendation**: Option A. Each slice is small enough to review and test.

**To close**: The owner chooses the extraction order.

**Resolution**: The owner accepted option A on 2026-10-31.

### Q-017 Make Docs Store Identity

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Keep `projectId` `831ddb50-b97a-47e2-9f2c-f491b27b8759`. Copy day used `make-docs project checkout-register`, not `checkout-move`, by owner decision on 2026-11-02. | Owner: [08 Build and Release, Source Home](08-build-and-release.md#source-home). |

**Question**: Does `kits/make-docs/` keep the Make Docs `projectId` `831ddb50-b97a-47e2-9f2c-f491b27b8759`, with `make-docs project checkout-move` from the old folder on copy day (option A), or get a new `projectId` (option B)?

**Why it matters**: The Store history and the pending runs of the Make Docs project are keyed by its `projectId`.

**Recommendation**: Option A. The Store history and pending runs stay with the project.

**To close**: The owner chooses the identity.

**Resolution**: The owner accepted option A on 2026-10-31. On copy day, `make-docs project checkout-move preview` returned `status` `blocked` with 2 blockers, and the move apply step did not run. A move expects the source folder to be gone, but the old clone `../make-docs` stays because of the freeze and the read-only rule. The saved Store hash for `.agents/skills/backlog-review/assets/backlog-review-report.html` is stale, because that file has the same SHA-256 in `kits/make-docs/`, in the old clone and at the `v2.0.6` tag. The owner accepted `make-docs project checkout-register` on 2026-11-02. Its apply step returned `status` `registered` with the new checkout ID `99188529-0b18-42b0-84ef-554d001afd79` for the same `projectId`. It returned `projectFilesChanged` `false`, and a SHA-256 list of the files under `kits/make-docs/` was the same before and after. The old checkout ID `fb3f0042-91fa-445b-bfec-16e3dde15fc2` stays bound to the old clone ([01 Copy Day, Stage 4](../work/2026-11-01-w1-r0-make-kit-monorepo/01-copy-day.md#stage-4---store-identity-root-map-and-make-docs-register)).

### Q-018 License

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | One root MIT `LICENSE` for the whole stack. `kits/make-docs/LICENSE` stays. History: the owner first asked to remove MIT, then chose MIT for the whole stack. | Owner: [08 Build and Release, License](08-build-and-release.md#license). |

**Question**: Make Docs is MIT. `make-kit` has no root `LICENSE`, and Make Blueprint has no license. A public repository with no license gives people no right to reuse the code. The core comes from MIT code. Add one root MIT `LICENSE` for the whole repository and keep `kits/make-docs/LICENSE` (option A), or keep MIT only for Make Docs and set the other licenses later (option B)?

**Why it matters**: People need a license to use each npm package, and the core must stay compatible with the MIT code that it comes from.

**Recommendation**: Option A. One license is simple.

**To close**: The owner chooses the license.

**Resolution**: The owner first asked to remove the MIT license while the repository was still private. A follow-up question offered an all-rights-reserved notice outside `kits/make-docs/`. The owner did not accept it. On 2026-10-31 the owner chose a public repository and MIT for the whole Make Kit stack.

### Q-019 Make Docs PRDs and Kit Conventions

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | The Make Docs PRDs keep their text and add a link to the root Kit Conventions PRD, in the nested-project fix plan. | Owner: [05 Kit Conventions](05-kit-conventions.md). Ships with Make Docs 2.1.0. |

**Question**: The Make Docs PRDs, such as PRD 39 for the CLI, already state many rules that Kit Conventions states. Do they keep their text and only add a link to the root Kit Conventions PRD, in the nested-project fix plan (option A)? Or do they replace the shared rules with links, as Make Blueprint does (option B)?

**Why it matters**: The Make Docs PRDs describe live code.

**Recommendation**: Option A. A link-only change is low risk. Kit Conventions names Make Docs as the reference kit.

**To close**: The owner chooses the change to the Make Docs PRDs.

**Resolution**: The owner accepted option A on 2026-10-31.

### Q-020 Release of the Link Read Command

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Ship it in 2.1.0 with the O-004 fix. | Owner: [01 Product Overview, Release Scope](01-product-overview.md#release-scope). Related: [O-004](#o-004-link-checks-cover-links-between-projects). |

**Question**: Make Blueprint needs a Make Docs command that reads Make Docs links (Make Blueprint register `kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md`, [Q-024](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-024-make-docs-link-check-interface)). The O-004 fix needs the same link code. Ship the command in the nested-project fix release with O-004 (option A), or in the Make Docs release on the core (option B)?

**Why it matters**: Make Blueprint `project check` skips Make Docs links until the command ships (Make Blueprint register [O-001](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check)).

**Recommendation**: Option A. It uses the same code, and Make Blueprint gets it sooner.

**To close**: The owner chooses the release.

**Resolution**: The owner accepted option A on 2026-10-31.

### Q-021 Step 0 Sequence

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | The 10 steps in design section 11. | Owner: [01 Product Overview, Release Scope](01-product-overview.md#release-scope). |

**Question**: Does Step 0 follow these 10 steps in order: the root docs, the Step 0 work backlog, copy day, the public repository, CI, the first routing check, the switch point, Make Docs 2.1.0, the core with Make Docs 2.2.0, and closeout (option A)? Or does copy day come before the docs (option B)?

**Why it matters**: The freeze of the old repository starts on copy day.

**Recommendation**: Option A. A short gap from copy day to the switch point keeps the freeze short.

**To close**: The owner chooses the sequence.

**Resolution**: The owner accepted option A on 2026-10-31.

### Q-022 Work Email in Commit History

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Rewrite the `make-kit` commits to the owner's personal email before the repository goes public. Done on 2026-11-01. | Owner: [08 Build and Release, Public Repository](08-build-and-release.md#public-repository). Related: [Q-025](#q-025-commit-email-on-the-maintainer-machine), [Q-026](#q-026-old-commit-ids-on-github). |

**Question**: All 6 `make-kit` commits use a work email. After the repository goes public, anyone can see it. Rewrite the 6 commits to the owner's personal email before the repository goes public (option A), or keep the history as it is (option B)?

**Why it matters**: The work email is private data. A rewrite changes every commit ID and needs a force push to `main`, and other agents in the repository must then start again from the new `main`.

**Recommendation**: Option A. The repository is new and private, so now is the cheapest time.

**To close**: The owner chooses, and the rewrite is on GitHub.

**Resolution**: The owner chose option A on 2026-10-31. The owner said that the work account must never be used for these commits and that the fix must happen at once. Done on 2026-11-01: the 6 commits on GitHub `main` use the owner's personal email, and their files did not change.

### Q-023 Persona Entry Fields

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | `slug`, `label`, `description`, `primitive`, `kind`, `kits`. No `name` field. | Owner: [07 Setup Tool and Shared Files, People and Roles Entry Fields](07-setup-tool-and-shared-files.md#people-and-roles-entry-fields). The Make Blueprint wording is in plan phase [05 Make Blueprint Links](../plans/2026-11-01-w1-r0-make-kit-monorepo/05-make-blueprint-links.md). |

**Question**: Which fields does an entry in `.make/personas.yaml` have? Make Blueprint PRD 05 gives each entry a `name` and also says that the entry holds a Make Docs `label` and `description`, so two fields overlap.

**Why it matters**: Every kit reads the same entries. Two identifier fields could disagree.

**Recommendation**: The fields are `slug` (the identifier), `label` (the name that people read), `description` (what the entry is for, mainly for agents), `primitive`, `kind` and `kits`. There is no separate `name` field. Make Blueprint text that uses `name` as a display name uses `label`.

**To close**: The owner chooses the fields.

**Resolution**: The first version of the question deferred the choice to the setup tool wave. The owner did not agree with its framing: a name is a data-friendly identifier, a label is a human-friendly label, and a description says what the entry is for, mainly for agents. The second version used these definitions, with `slug` as the identifier. The owner accepted it on 2026-11-01. How a project moves its list is [Q-027](#q-027-persona-list-move-for-existing-projects).

### Q-024 Old Make Docs History

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Leave the old history as it is. | Owner: [08 Build and Release, Old Repository](08-build-and-release.md#old-repository). |

**Question**: 452 public commits in the old `make-docs` repository use the work email. Leave the old history as it is (option A), or rewrite it (option B)? A rewrite changes every commit ID and breaks the v2.0.x release tags, the GitHub releases and the npm provenance links.

**Why it matters**: The copy brings no history, so this repository stays clean in both cases. A rewrite breaks real links and cannot remove the copies that already exist.

**Recommendation**: Option A.

**To close**: The owner chooses.

**Resolution**: The owner accepted option A on 2026-11-01.

### Q-025 Commit Email on the Maintainer Machine

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | A git `includeIf` rule gives the owner's personal projects folder the personal email. Done on 2026-11-01. No PRD owns it, because it is machine setup. | None. No PRD owns it. |

**Question**: The cause of Q-022 is a global git setting that gives every repository on the maintainer machine the work email. Add a rule that gives each repository in the owner's personal projects folder the personal email (option A), or keep only the setting in this repository (option B)?

**Why it matters**: Without a fix of the cause, new commits in this repository or in the old repository can use the work email again.

**Recommendation**: Option A. It fixes the cause, also for the old `make-docs` repository.

**To close**: The owner chooses, and a test commit shows the personal email.

**Resolution**: The owner accepted option A on 2026-11-01. Done on 2026-11-01: a git `includeIf` rule gives the owner's personal projects folder the personal email. A check showed the personal email in this repository and in the old `make-docs` repository.

### Q-026 Old Commit IDs on GitHub

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | The owner deletes the GitHub repository and creates it again with the same name, while it holds only `main` and no issues, pull requests, CI runs or settings. The other option was to wait until the public step. Done on 2026-11-01: the new repository is private, and each of the 6 old commit IDs returns "No commit found" on GitHub. | Owner: [08 Build and Release, Public Repository](08-build-and-release.md#public-repository). Step 0 work phase `02-go-public` checks the old IDs again. |

**Question**: After the force push of Q-022, GitHub still opens the 6 old commits by their old IDs, with the work email. Delete the GitHub repository and create it again now, while it holds only `main` (option A)? Or wait until the public step (option B), when a delete would lose CI runs and publish settings?

**Why it matters**: The old commits become public with the repository unless GitHub drops them.

**Recommendation**: Option A. Now the delete costs nothing.

**To close**: The owner chooses, and each old commit ID returns "No commit found" on GitHub.

**Resolution**: The owner accepted option A on 2026-11-01 and deleted and created the repository the same day.

### Q-027 Persona List Move for Existing Projects

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | None yet | The setup tool wave answers it. Owner: [07 Setup Tool and Shared Files, Make Docs Personas](07-setup-tool-and-shared-files.md#make-docs-personas). |

**Question**: How does a project that keeps its Personas in `.make-docs/config.yaml` move them to `.make/personas.yaml`?

**Why it matters**: Live Make Docs projects keep their Personas in `.make-docs/config.yaml`. A move that loses or doubles an entry changes the effective Persona set and the asset folders that depend on it.

**Recommendation**: None yet. Answer it together with [Q-028](#q-028-shared-file-schema-details) and [Q-029](#q-029-agent-tool-choices-for-existing-make-docs-projects).

**To close**: 07 states the move, and a test shows that `make-docs project persona list` gives the same effective set before and after the move.

### Q-028 Shared File Schema Details

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | None yet | The setup tool wave answers it. Owner: [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md#contracts-and-data). |

**Question**: What are the key names and the top-level shape of `.make/config.yaml` and `.make/personas.yaml`? How are the `kits` values spelled? Which fields are required? Is the Make Docs `harnessIntegrations` access ceiling a shared setting? Does each file have a format version field?

**Why it matters**: Two kits that pin different core versions read and write the same files ([R-002](#r-002-two-core-versions-in-one-project)). A format change after the first release is a breaking core change.

**Recommendation**: None yet.

**To close**: 07 states the schema of both files, and the core has a test for each field.

### Q-029 Agent-Tool Choices for Existing Make Docs Projects

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | None yet | The setup tool wave answers it. Related: [Q-027](#q-027-persona-list-move-for-existing-projects). Owner: [07 Setup Tool and Shared Files, Shared Setup Choices](07-setup-tool-and-shared-files.md#shared-setup-choices). |

**Question**: How do the `harnessIntegrations` choices in an existing `.make-docs/config.yaml` reach `.make/config.yaml`?

**Why it matters**: A person who set up Make Docs before the setup tool wave expects to see the same agent-tool choices when they set up a second kit.

**Recommendation**: None yet.

**To close**: 07 states how the choices reach `.make/config.yaml`, and a test covers an existing Make Docs project.

### Q-030 Setup With a Missing or Failed Kit

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Deferred | None yet | The setup tool wave answers it. Owner: [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md#make-kit-setup). |

**Question**: What does `make-kit setup` do when a chosen kit is not installed, or when the setup of one kit fails?

**Why it matters**: The setup tool states a result for each kit. A failed kit must not leave the shared choices or the other kits out of step.

**Recommendation**: None yet.

**To close**: 07 states the result for each case, and the install test covers a missing kit and a failed kit.

### Q-031 Store Version Counter for Base and Kit Tables

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Must close before the Store slice of the core work, in Step 0 work phase `07-shared-core`. Owner: [06 Shared Core, Store Base and Schema Version 6](06-shared-core.md#store-base-and-schema-version-6). |

**Question**: Make Docs has one migration list and one `PRAGMA user_version` counter ([`make-docs v2.0.6: packages/cli/src/store/database.ts:86`](../../kits/make-docs/packages/cli/src/store/database.ts)), and the counter must stay at 6, because Make Docs 2.0.x refuses a Store above 6 ([`make-docs v2.0.6: packages/cli/src/store/database.ts:575`](../../kits/make-docs/packages/cli/src/store/database.ts)). How does the core split the base migrations from the kit migrations without a new version?

**Why it matters**: A wrong split can raise `user_version` and lock every Make Docs 2.0.x user out of their Store ([R-010](#r-010-store-schema-locked-at-version-6)).

**Recommendation**: For Step 0, keep the single counter at 6. The core owns the counter and the base migrations, and each kit registers its own migrations in a fixed order after the base ones, so a Store at version 6 keeps its tables and shapes. Decide on a separate kit counter only together with R-010.

**To close**: 06 states the split, and a test opens one Store with Make Docs 2.0.6 and 2.2.0 in turn.

### Q-032 Release Gate Scope

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Option A: the gate applies to every stable release of every package. | Owner: [08 Build and Release, Release Gate](08-build-and-release.md#release-gate). Related: [Q-011](#q-011-switch-test). |

**Question**: Does the release gate (a dry run, a release candidate on `next`, the install check, then `latest`) apply to every stable release of every package (option A), or only to the 2.0.7 switch (option B)? How does the install check work for the core, which has no CLI?

**Why it matters**: 08 says that the gate applies to each stable release from the shared publish workflow. Design section 3 and Q-011 describe the gate only for the switch. The answer sets the cost of every later release.

**Recommendation**: Option A. Keep the rule in 08: the gate applies to every stable release of every package. For the core, the install check installs the release candidate from npm into a temporary project and loads the package entry point, in place of `<cli> --version`.

**To close**: The owner decides, and 08 states the scope and the install check for a library package.

**Resolution**: Owner accepted on 2026-11-01. [08 Build and Release](08-build-and-release.md#release-gate) states the scope and the install check for the core.

### Q-033 First Trusted Publish of a New Package

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Confirm before the core release. Owner: [08 Build and Release, Trusted Publisher Settings](08-build-and-release.md#trusted-publisher-settings). |

**Question**: Can npm trusted publishing be set up for a package before it exists on npm? `@brucewaynedecoy/make-core`, `@brucewaynedecoy/make-kit` and `@brucewaynedecoy/make-blueprint` do not exist on npm yet.

**Why it matters**: 08 says that no workflow and no repository secret holds an npm token. If npm needs a first publish before a trusted publisher can be set, the first release of each new package needs another path.

**Recommendation**: Confirm the npm rule on npmjs.com before Step 0 work phase `07-shared-core` publishes core `0.1.0`. If a first publish is needed, 08 states that one step and its owner gate.

**To close**: The npm rule is confirmed, and 08 states the first-publish path for a new package.

### Q-034 CI for the Core and the Setup Tool

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [08 Build and Release, CI](08-build-and-release.md#ci). Related: [Q-010](#q-010-ci-layout-and-release-tags). |

**Question**: The design names only `make-docs-ci.yml`, which also runs on changes under `packages/core/`. Do the core and the setup tool get their own CI workflows?

**Why it matters**: When a second kit uses the core, a core change must run the tests of every kit on the core.

**Recommendation**: In Step 0, `make-docs-ci.yml` covers `packages/core/`, because Make Docs is the only kit on the core. The core gets its own workflow when a second kit depends on it, and the setup tool gets its own workflow in the setup tool wave.

**To close**: 08 states the CI workflow for the core and for the setup tool.

### Q-035 Scope of the Uninstall Fix in 2.2.0

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Option A: the 2.2.0 uninstall fix covers D-030, D-002 and D-039. | Step 0 work phase `07-shared-core`. Owner: [05 Kit Conventions](05-kit-conventions.md#routers-and-managed-blocks), [06 Shared Core, Core Versions and the Exact Pin](06-shared-core.md#core-versions-and-the-exact-pin). |

**Question**: [Q-007](#q-007-make-docs-changes-in-step-0) names "the uninstall fix" for Make Docs 2.2.0. 05 maps it to [D-030](#d-030-setup-remove-keeps-the-kit-block) (`setup remove` keeps the kit block) only. [D-002](#d-002-uninstall-text-disagrees-with-store-removal) (the uninstall text disagrees with Store removal) and [D-039](#d-039-setup-remove-guard-uses-a-fixed-store-path) (the `setup remove` guard uses a fixed Store path) touch the same code and have no release. Does the 2.2.0 fix also cover D-002 and D-039 (option A), or only D-030 (option B)?

**Why it matters**: The three gaps sit in the same removal code that the core takes over. A fix of one without the others leaves the core with known faults.

**Recommendation**: Option A. The 2.2.0 uninstall fix also covers D-002 and D-039.

**To close**: The owner decides, and 05 and 06 state the scope of the fix.

**Resolution**: Owner accepted on 2026-11-01. [05 Kit Conventions](05-kit-conventions.md#routers-and-managed-blocks) and [06 Shared Core](06-shared-core.md#core-versions-and-the-exact-pin) state the scope of the fix.

### Q-036 Preview-First Write Commands

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Option B: a kit can make a write command preview-first. The command writes only with `--apply`, the one flag name for every kit. | Owner: [05 Kit Conventions, CLI Write Intent](05-kit-conventions.md#cli-write-intent). Related: [D-021](#d-021-path-hygiene-uses-its-own-output-and-write-flags), [D-022](#d-022-cli-write-permission-works-three-ways). Source: Make Blueprint register [Q-097](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-097-preview-first-write-commands). |

**Question**: Make Blueprint has three write commands that are dry runs by default and write only with `--apply`: `run import v1`, `run package make` and `run package add`. Their MCP tools write only with `apply: true` and `allowWrite` ([Make Blueprint 08 CLI and MCP](../../kits/make-blueprint/docs/prd/08-cli-and-mcp.md)). Do these commands follow the general write rule of [CLI Write Intent](05-kit-conventions.md#cli-write-intent), so that they write by default, `--dry-run` previews and the skills run the dry run first (option A)? Or does 05 add a rule for a write whose plan is the review step, with one flag name for every kit (option B)? This item comes from Make Blueprint register [Q-097](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-097-preview-first-write-commands).

**Why it matters**: Under the general write rule, a person who runs the import or a package take-in with no flag writes at once and skips the plan review. The plan review is a promise of Make Blueprint PRDs 17 and 20. The Make Docs path-hygiene `repair` command has the same preview-first form ([D-021](#d-021-path-hygiene-uses-its-own-output-and-write-flags)).

**Recommendation**: Option B. A kit can make a write command preview-first when a person must review a plan before a large write. The command shows its plan and writes nothing by default, and it writes only with `--apply`. `--dry-run` is accepted and does the same as the default. The MCP tool writes only with `apply: true` and `allowWrite`. The kit's own PRDs name each preview-first command. Every other write command keeps the general rule. Check D-021 again under the new rule.

**To close**: The owner decides, 05 states the rule, and D-021 names only what still differs.

**Resolution**: Owner accepted on 2026-11-01. [05 Kit Conventions, CLI Write Intent](05-kit-conventions.md#cli-write-intent) states the preview-first rule, and [Flags and Tool Inputs](05-kit-conventions.md#flags-and-tool-inputs) lists `--apply` and `apply`. A check of the Make Docs `v2.0.6` code shows that path-hygiene `repair` meets the rule on the CLI and on MCP. D-021 stays `Open` for two differences only: the `--format` output flag, and the Make Docs PRDs, which do not name `repair` as a preview-first command. D-022 no longer counts the `--apply` flag. Make Blueprint register [Q-097](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-097-preview-first-write-commands) records the kit side.

### Q-037 Router Places in Kit Terms

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Option B: 05 states the router places in kit terms, and 07 owns the shared `.make/` router. | Owner: [05 Kit Conventions, Routers and Managed Blocks](05-kit-conventions.md#routers-and-managed-blocks), [07 Setup Tool and Shared Files, Project Files](07-setup-tool-and-shared-files.md#project-files). Related: [D-033](#d-033-make-docs-project-folder-name). Source: Make Blueprint register [Q-099](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-099-router-places-in-kit-terms). |

**Question**: Make Docs writes routers in the project root, `docs/`, its project tool directory, `system/` and its four type folders, and each selected docs folder. Make Blueprint writes routers in the project root, `.make/`, `.make/blueprint/`, and `blueprint/` and its top sub-folders, and none in `.make/blueprint/system/` ([Make Blueprint 06 Routers](../../kits/make-blueprint/docs/prd/06-project-layout-and-instruction-files.md#routers)). Each kit with a `.make/<kit>/` folder writes a block in the `.make/` router. Does Make Blueprint add routers in `.make/blueprint/system/` and its four type folders (option A)? Or does 05 state the router places in kit terms, and 07 add the `.make/` router to its project files (option B)? This item comes from Make Blueprint register [Q-099](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-099-router-places-in-kit-terms).

**Why it matters**: A rule that lists the Make Docs places reads as the rule for every kit. The `.make/` router holds the blocks of more than one kit, so one root PRD must own it.

**Recommendation**: Option B. Make Blueprint keeps its list.

**To close**: The owner decides, 05 states the router places in kit terms, and 07 lists the `.make/` router.

**Resolution**: Owner accepted on 2026-11-01. [05 Kit Conventions, Routers and Managed Blocks](05-kit-conventions.md#routers-and-managed-blocks) states the router places in kit terms: the project root, the kit's project tool directory, and the content folders that the kit's own PRDs name. The Make Docs list is the Make Docs case of that rule. [07 Setup Tool and Shared Files, Project Files](07-setup-tool-and-shared-files.md#project-files) owns `.make/AGENTS.md` and `.make/CLAUDE.md`, with one tag-aware managed block for each kit that has a `.make/<kit>/` folder. Make Docs writes no block there until its project tool directory is `.make/docs/` ([D-033](#d-033-make-docs-project-folder-name)). Make Docs at `v2.0.6` meets the rule, so the change adds no gap. Make Blueprint register [Q-099](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-099-router-places-in-kit-terms) records the kit side.

### Q-038 Nested Config Key Style

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Option B: the camelCase rule covers top-level keys. Each kit sets the style of its nested keys in its own PRDs. | Owner: [05 Kit Conventions, Project Config](05-kit-conventions.md#project-config). Related: [D-034](#d-034-config-key-styles-are-mixed), [D-041](#d-041-make-docs-sets-no-nested-config-key-style). Source: Make Blueprint register [Q-100](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-100-nested-config-key-style). |

**Question**: Make Blueprint uses snake_case nested keys in `.make/blueprint/config.yaml`, such as `sources.git_level` and `review.second_reviewer`, to match record fields such as `git_level` ([Make Blueprint 06 Project Config](../../kits/make-blueprint/docs/prd/06-project-layout-and-instruction-files.md#project-config)). Its top-level keys are single words. Does the camelCase key rule in [05 Kit Conventions, Project Config](05-kit-conventions.md#project-config) cover nested keys, so that these keys change to a form such as `sources.gitLevel` (option A)? Or does the rule cover top-level keys only, with each kit setting the style of its nested keys (option B)? This item comes from Make Blueprint register [Q-100](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-100-nested-config-key-style).

**Why it matters**: When the rule covers nested keys, seven Make Blueprint settings change, with every PRD and task that names them.

**Recommendation**: Option B. Check D-034 again, so that it holds only top-level differences.

**To close**: The owner decides, and 05 states the scope of the key rule.

**Resolution**: Owner accepted on 2026-11-01. [05 Kit Conventions, Project Config](05-kit-conventions.md#project-config) says that top-level keys use camelCase and that each kit sets the style of its nested keys in its own PRDs. D-034 keeps only the top-level key `prd_authority`. The Make Docs PRDs set no nested key style, and the Make Docs nested keys use two styles, so [D-041](#d-041-make-docs-sets-no-nested-config-key-style) records that gap. Make Blueprint register [Q-100](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-100-nested-config-key-style) records the kit side.

### Q-039 Long-Running Lifecycle Command

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Option B: a kit can add one top-level lifecycle command that starts a long-running process, when its own PRDs name it. | Owner: [05 Kit Conventions, CLI Top Level](05-kit-conventions.md#cli-top-level), [06 Shared Core, Core Boundary](06-shared-core.md#core-boundary). Source: Make Blueprint register [Q-101](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-101-long-running-lifecycle-command). |

**Question**: Make Blueprint adds `make-blueprint serve` beside `mcp` in v2.2 ([Make Blueprint 08 The `serve` Command (v2.2)](../../kits/make-blueprint/docs/prd/08-cli-and-mcp.md#the-serve-command-v22)). The help rule in [05 Kit Conventions, CLI Top Level](05-kit-conventions.md#cli-top-level) lists seven top-level commands, and the core reserves no command name ([06 Shared Core, Core Boundary](06-shared-core.md#core-boundary)). Does the server go under an existing command, such as `mcp` (option A)? Or can a kit add a top-level lifecycle command that starts a long-running process, named in that kit's PRDs (option B)? This item comes from Make Blueprint register [Q-101](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-101-long-running-lifecycle-command).

**Why it matters**: With `serve`, the v2.2 help of Make Blueprint lists eight top-level commands. The v2.0 help lists seven.

**Recommendation**: Option B, with at most one such command for each kit.

**To close**: The owner decides, and 05 states the rule.

**Resolution**: Owner accepted on 2026-11-01. [05 Kit Conventions, CLI Top Level](05-kit-conventions.md#cli-top-level) lets a kit add at most one more top-level command: a lifecycle command that starts a long-running process, such as a local server, when its own PRDs name it. The help lists the seven commands and that command. [06 Shared Core, Core Boundary](06-shared-core.md#core-boundary) keeps the rule that the core reserves no command name, and calls `serve` the Make Blueprint long-running lifecycle command. Make Docs has no such command, so the change adds no gap. Make Blueprint register [Q-101](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-101-long-running-lifecycle-command) records the kit side.

### Q-040 Client Names in the Committed History

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | The owner asked on 2026-11-02 to remove all client names and client data from the files and the git history before the public step. On 2026-11-02 the owner chose option A: rewrite every commit with `git-filter-repo`, then delete and create the GitHub repository again. | Owner: [08 Build and Release, Public Repository](08-build-and-release.md#public-repository). Step 0 work phase `02-go-public` checks the history again. |

**Question**: The copy-day scan on 2026-11-02 found client names in 14 committed `kits/make-blueprint/` files, and all 8 commits on `main` hold client data. The first 5 commits also hold an old root `README.md` with client names, client folder paths and the owner's home-folder path. Rewrite the history now, and delete and create the GitHub repository again, as in [Q-026](#q-026-old-commit-ids-on-github) (option A)? Or wait until the Phase 2 scan (option B)?

**Why it matters**: A public commit cannot be taken back ([R-004](#r-004-exposed-history-in-the-public-repository)). After a force push, GitHub keeps the old commits open by their IDs ([Q-026](#q-026-old-commit-ids-on-github)).

**Recommendation**: Option A. The repository is private and holds only `main`, with no pull requests.

**To close**: The files and every commit on `main` hold no client names, and each old commit ID returns "No commit found" on GitHub.

**Resolution**: The owner chose option A on 2026-11-02. A test rewrite on a scratch copy found 0 hits in all 8 commits. The item closes when the rewritten history is on GitHub and each old commit ID returns "No commit found".

## Rebuild Risks

Each item is a place where Step 0 or a later rebuild can go wrong. R-001 and R-002 came from the Make Blueprint register. The other items come from the design trade-offs and from the PRD workers.

Code anchors:

- `docs/designs/2026-10-30-make-kit-monorepo.md` (Consequences: trade-offs and risks)
- `kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md` (R-001, R-002)
- [`make-docs v2.0.6: packages/cli/src/store/database.ts`](../../kits/make-docs/packages/cli/src/store/database.ts)
- [`make-docs v2.0.6: packages/cli/tsup.config.ts`](../../kits/make-docs/packages/cli/tsup.config.ts)

### R-001 Core Release Friction

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [06 Shared Core, Core Versions and the Exact Pin](06-shared-core.md#core-versions-and-the-exact-pin). Step 0 work phase `07-shared-core`. |

This item came from R-001 in the Make Blueprint register, `kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md` ([R-001](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#r-001-core-release-friction)). Its four fields below come from that item. This register owns the risk ([Q-006](#q-006-root-prd-set)). The kit item keeps its number, has the status `Closed`, and points to this item.

**Issue**: A core change needs a core release of `@brucewaynedecoy/make-core`, from `packages/core/` in the make-kit monorepo, before a Make Blueprint release can use it. Step 0, which is repo-wide work, and the Make Docs changes that Make Blueprint needs sit on the critical path for v2.0.

**Why it matters**: A late core release holds every v2.0 release build.

**Recommendation**: Plan core work first, use the workspace link only in development, and have release builds fail on a workspace link or an unpublished core.

**To close**: The pinned core is published before v2.0 release work starts.

### R-002 Two Core Versions in One Project

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [06 Shared Core, Core Versions and the Exact Pin](06-shared-core.md#core-versions-and-the-exact-pin), [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md#rebuild-notes). |

This item came from R-002 in the Make Blueprint register, `kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md` ([R-002](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#r-002-two-core-versions-in-one-project)). Its four fields below come from that item. This register owns the risk ([Q-006](#q-006-root-prd-set)). The kit item keeps its number, has the status `Closed`, and points to this item.

**Issue**: Each tool pins its own core, so Make Docs and Make Blueprint can run different core versions in one project.

**Why it matters**: A change to the block tag format, block order, the handoff-line rule, the presence rule, the `.make/` layout or the format of the shared `.make/config.yaml` and `.make/personas.yaml` in one core version breaks the other tool.

**Recommendation**: Treat those on-disk contracts as breaking changes, and test both tools on different core versions.

**To close**: A cross-version test runs in the install matrix.

### R-003 Broken Release at the Switch Point

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Mitigation: the release gate. Owner: [08 Build and Release, Release Gate](08-build-and-release.md#release-gate). Step 0 work phase `05-switch-point`. |

**Issue**: Make Docs 2.0.7 is the first release from a new repository, a new CI and a new publish workflow. A fault in any of them can publish a broken package.

**Why it matters**: Live Make Docs users install from `latest`. A broken release hurts them directly.

**Recommendation**: Use the release gate in 08: a dry run in the pull request, the tarball compare with 2.0.6, `2.0.7-rc.0` on `next` with the install check, then `2.0.7` on `latest` with the install check again. If the release candidate fails, set the trusted publisher back to the repository `make-docs`.

**To close**: `2.0.7` is on `latest`, and its install check passed on Linux, macOS and Windows.

### R-004 Exposed History in the Public Repository

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Mitigation: the scan, [Q-022](#q-022-work-email-in-commit-history) and [Q-026](#q-026-old-commit-ids-on-github). Owner: [08 Build and Release, Public Repository](08-build-and-release.md#public-repository). Step 0 work phase `02-go-public`. |

**Issue**: A public repository shows its whole git history. A secret, client data, a local home-folder path or the work email in any commit becomes public. A known finding: client names are in committed files and in earlier commits on `main` ([Q-040](#q-040-client-names-in-the-committed-history)).

**Why it matters**: A public commit cannot be taken back. Copies and forks keep it.

**Recommendation**: Before the public step, scan every tracked file and every commit for secrets, client data, local home-folder paths and the work email. Check again that each of the 6 old commit IDs returns "No commit found" on GitHub.

**To close**: The scan report has no findings, the old commit IDs do not open, and the repository is public.

### R-005 Agents Pick the Wrong Project

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Mitigation: the root map and the routing check. Owner: [02 Architecture Overview, Several Docs Roots](02-architecture-overview.md#several-docs-roots), [Routing Check](02-architecture-overview.md#routing-check). Step 0 work phases `04-routing-check-baseline` and `06-nested-project-fixes`. |

**Issue**: This repository has several docs roots. An agent can read the root docs for kit work, or a kit's docs for repo-wide work, and write files in the wrong project.

**Why it matters**: Kit docs in the root `docs/`, or root docs in a kit, mix two product authorities.

**Recommendation**: Keep the hand-written root map current. Run the routing check after copy day and again after the nested-project fixes, and record each miss in this register.

**To close**: Both routing checks are recorded, and each miss has a register item with an owner.

### R-006 Make Docs Tests That Assume the Repository Root

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Closed | Fix each path that assumes the old root. Done on 2026-11-02: acceptance criteria `A106` and `A107` passed. | Owner: [02 Architecture Overview, Configuration Surfaces](02-architecture-overview.md#configuration-surfaces), [08 Build and Release, Build in the Root Workspace](08-build-and-release.md#build-in-the-root-workspace). |

**Issue**: Some Make Docs tests, scripts and build files find the repository root from their own folder. Under `kits/make-docs/`, that root is the kit folder, not the git root. The `tsup` config is one example ([`make-docs v2.0.6: packages/cli/tsup.config.ts:7`](../../kits/make-docs/packages/cli/tsup.config.ts), [`make-docs v2.0.6: packages/cli/tsup.config.ts:27`](../../kits/make-docs/packages/cli/tsup.config.ts)).

**Why it matters**: The build or the tests fail after copy day, and copy day cannot finish.

**Recommendation**: On copy day, run the build and all Make Docs tests from the repository root, and fix each path that assumes the old root.

**To close**: `npm ci`, the build and all Make Docs tests pass from the repository root.

**Resolution**: Closed on 2026-11-02. In Phase 1 of the Step 0 backlog, acceptance `A106` passed on 2026-11-02: `npm ci` from the repository root exits 0, and the lockfile compare script reports 0 version or integrity differences ([01 Copy Day, Stage 2](../work/2026-11-01-w1-r0-make-kit-monorepo/01-copy-day.md#stage-2---root-workspace-and-lockfile)). Acceptance `A107` passed on 2026-11-02 ([01 Copy Day, Stage 3](../work/2026-11-01-w1-r0-make-kit-monorepo/01-copy-day.md#stage-3---build-tests-and-repository-links)). `npm run build` and `npm test` from the repository root exit 0. `node --test` has 19 passes. Vitest has 1996 passes, 0 failures and 6 skipped env-gated suites. One test assumed the old root: [`kits/make-docs/packages/cli/tests/mcp-app-contract.test.ts`](../../kits/make-docs/packages/cli/tests/mcp-app-contract.test.ts) loaded the `tsx` loader from a fixed `node_modules` path below that root. The test now resolves the loader through Node module resolution. The build path for `yaml` in [`kits/make-docs/packages/cli/tsup.config.ts`](../../kits/make-docs/packages/cli/tsup.config.ts) changed the same way.

### R-007 Urgent Fix During the Freeze

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Source: [Q-003](#q-003-copy-source-and-freeze). Owner: [08 Build and Release, Source Home](08-build-and-release.md#source-home). |

**Issue**: From copy day to the switch point, the old repository is frozen but is still the Make Docs release source. An urgent fix can be needed in that time.

**Why it matters**: A fix that lands in only one repository is lost at the switch point, or ships from the wrong repository.

**Recommendation**: Fix the old repository first, with the owner's clear yes, and port the fix to `kits/make-docs/` by hand.

**To close**: The switch point passes, and no fix is in one repository only.

### R-008 Build Output of 2.0.7 Differs From 2.0.6

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | The owner accepted on 2026-11-02 that file-list compares ignore the content-hash part of `dist/` chunk names. | Owner: [08 Build and Release, Switch Point](08-build-and-release.md#switch-point). Step 0 work phase `05-switch-point`. |

**Issue**: The Make Docs build bundles `yaml`, `zod` and `@clack/*` code and writes source maps ([`make-docs v2.0.6: packages/cli/tsup.config.ts:20`](../../kits/make-docs/packages/cli/tsup.config.ts)). The bundle and map text hold `node_modules` paths and dependency versions. A root lockfile can change them. The switch test compares the file list, but the file content can still differ. On copy day, the `npm pack --dry-run` file list differed from the 2.0.6 list only in the content-hash part of 38 `dist/` chunk names on each side (19 `.js` and 19 `.js.map`), and the chunks pair one-to-one by name stem and size, within a few hundred bytes ([01 Copy Day, Stage 3](../work/2026-11-01-w1-r0-make-kit-monorepo/01-copy-day.md#stage-3---build-tests-and-repository-links)). The causes are the `node_modules` path comments that esbuild writes, which are 6 characters longer under `kits/make-docs/packages/cli/`, the `packageDigest` of `packages/cli/package.json` in the embedded skills bundle ([`kits/make-docs/packages/cli/scripts/embedded-skills.ts:90`](../../kits/make-docs/packages/cli/scripts/embedded-skills.ts)), and chunk hashes that include the names of the chunks they import. No build setting was changed to force a match.

**Why it matters**: 08 says that the 2.0.7 files differ from 2.0.6 only in the version and the repository links. A changed bundle can break that rule or change behavior.

**Recommendation**: Build the root lockfile from the old lockfile, so the dependency versions stay the same. In each file-list compare with 2.0.6, ignore the content-hash part of each `dist/<name>-<hash>.js` and `dist/<name>-<hash>.js.map` name. At the switch point, compare the file content of the two tarballs, not only the file list. Expect two known differences: the longer `node_modules` path comments and the changed `packageDigest`. Review every other difference that is not a repository link.

**To close**: The content compare of 2.0.7 with 2.0.6 shows only the version and repository links, or the owner accepts each other difference.

### R-009 Urgent Make Docs Fix During the Core Slices

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [06 Shared Core, Slice Order](06-shared-core.md#slice-order), [08 Build and Release](08-build-and-release.md). Step 0 work phase `07-shared-core`. |

**Issue**: During the core slices, Make Docs imports the unpublished core through the workspace link. A release build fails when the core resolves to a workspace link or an unpublished version ([06 Shared Core](06-shared-core.md#core-versions-and-the-exact-pin)). So a Make Docs 2.1.x fix cannot ship from `main` until core `0.1.0` is published.

**Why it matters**: An urgent fix for live Make Docs users can wait for the whole core work.

**Recommendation**: Cut an urgent 2.1.x fix from the `make-docs-v2.1.0` tag, which does not import the core, release it through the release gate, and port the fix to `main`.

**To close**: 08 states the patch path during the core slices, or Make Docs 2.2.0 ships.

### R-010 Store Schema Locked at Version 6

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [06 Shared Core, Store Base and Schema Version 6](06-shared-core.md#store-base-and-schema-version-6). Related: [Q-031](#q-031-store-version-counter-for-base-and-kit-tables). |

**Issue**: Make Docs 2.0.x refuses a Store whose `user_version` is above 6 ([`make-docs v2.0.6: packages/cli/src/store/database.ts:575`](../../kits/make-docs/packages/cli/src/store/database.ts)). No path exists to version 7 that keeps Make Docs 2.0.x users in their Store.

**Why it matters**: A base-table change that needs a new version locks every Make Docs 2.0.x user out of their Store.

**Recommendation**: Keep every Step 0 change inside version 6. Before a change needs version 7, write a design that sets how users of older Make Docs releases move to the new version.

**To close**: A design sets the path to version 7, or the owner accepts version 6 as permanent.

### R-011 Project and Machine Folders Overlap

| Status | Decision | Follow-Up |
| --- | --- | --- |
| Open | None yet | Owner: [05 Kit Conventions, Machine Folders](05-kit-conventions.md#machine-folders), [07 Setup Tool and Shared Files](07-setup-tool-and-shared-files.md#rebuild-notes). |

**Issue**: When the project root is the home folder, the project tool directory `.make/<kit>/` and the machine folder `~/.make/<kit>/` are the same folder. Make Docs has the same overlap today with `.make-docs` and tells the two apart with a marker check ([`make-docs v2.0.6: packages/cli/src/store/lifecycle.ts:131`](../../kits/make-docs/packages/cli/src/store/lifecycle.ts)).

**Why it matters**: A kit can read project config as machine state, or remove project files with the Store.

**Recommendation**: Keep the content check in the core, and test each kit with the project root at the home folder.

**To close**: A core test with the project root at the home folder passes for each kit.

## Deferred Obligations

Each record below is a temporary workaround for the nested-project weak spots of Make Docs. Each temporary workaround stays visible, numbered and owned until it is removed. The root map in `AGENTS.md` and `CLAUDE.md` lists each one as a short numbered rule, labels it as temporary, names its O-number and links this section. This section holds the full records. Design section 9 is the source of the records ([Make Kit Monorepo, section 9](../designs/2026-10-30-make-kit-monorepo.md#9-temporary-workarounds-as-deferred-obligations)).

The Make Blueprint register has its own O-001, [Confirm Make Docs Links in Project Check](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check). Docs that cite an O-number name the register path with it.

### O-001 Upward Project Search Stops at the Nearest Project

| Field | Value |
| --- | --- |
| ID | O-001 |
| Title | Upward project search stops at the nearest project |
| Status | Deferred |
| Summary | The upward search of Make Docs stops at the nearest `.make-docs/config.yaml`, so a nested project with no `docs/work/` folder resolves to itself. Until then, every kit keeps a `docs/work/` folder, also when it is empty, so the search stops at the kit (root map item 1). |
| Source authority | [Design section 9](../designs/2026-10-30-make-kit-monorepo.md#9-temporary-workarounds-as-deferred-obligations); the root map in [AGENTS.md](../../AGENTS.md) and [CLAUDE.md](../../CLAUDE.md), item 1; [Q-014](#q-014-nested-project-fixes). The code cause is [D-024](#d-024-two-project-root-searches). |
| Owner | The repository owner |
| Target coordinate | The Make Docs nested-project fix plan in `kits/make-docs/docs/plans/`, which sets its own coordinate, for release 2.1.0 |
| Future trigger | Make Docs 2.1.0 ships with the fix |
| Dependencies | Copy day and the switch point |
| Acceptance exit criteria | The fix ships with a nested-project test. The matching item is gone from the root map, from kit setup and from the validation steps. The record is `Fulfilled` with its version and proof command. |
| Related requirements and findings | `02-architecture-overview.md` ([Several Docs Roots](02-architecture-overview.md#several-docs-roots)); `05-kit-conventions.md` ([Project Target](05-kit-conventions.md#project-target)); [D-024](#d-024-two-project-root-searches) |
| History / disposition note | Recorded on 2026-11-01 from design section 9 and the root map. The workaround is temporary and must not become the normal way of working. |

### O-002 Commands Resolve the Nearest Project

| Field | Value |
| --- | --- |
| ID | O-002 |
| Title | Commands resolve the nearest project |
| Status | Deferred |
| Summary | Every Make Docs command resolves the nearest project from the working folder. Until then, run `make-docs` commands for a kit from inside the kit folder, or pass the kit folder with `--repo-root` or `--target-root` (root map item 2). |
| Source authority | [Design section 9](../designs/2026-10-30-make-kit-monorepo.md#9-temporary-workarounds-as-deferred-obligations); the root map in [AGENTS.md](../../AGENTS.md) and [CLAUDE.md](../../CLAUDE.md), item 2; [Q-014](#q-014-nested-project-fixes) |
| Owner | The repository owner |
| Target coordinate | The Make Docs nested-project fix plan in `kits/make-docs/docs/plans/`, which sets its own coordinate, for release 2.1.0 |
| Future trigger | Make Docs 2.1.0 ships with the fix |
| Dependencies | Copy day and the switch point |
| Acceptance exit criteria | The fix ships with a nested-project test. The matching item is gone from the root map, from kit setup and from the validation steps. The record is `Fulfilled` with its version and proof command. |
| Related requirements and findings | `02-architecture-overview.md` ([Several Docs Roots](02-architecture-overview.md#several-docs-roots)); `05-kit-conventions.md` ([Project Target](05-kit-conventions.md#project-target)); [D-023](#d-023-target-flags-have-different-names) |
| History / disposition note | Recorded on 2026-11-01 from design section 9 and the root map. The workaround is temporary and must not become the normal way of working. |

### O-003 MCP Server Resolves the Project From a Path

| Field | Value |
| --- | --- |
| ID | O-003 |
| Title | MCP server resolves the project from a path |
| Status | Deferred |
| Summary | The Make Docs MCP server resolves the project from a path argument or from the nearest project config, not from the folder it started in. Until then, pass the kit folder as `targetRoot` on every Make Docs MCP call for a kit (root map item 3). |
| Source authority | [Design section 9](../designs/2026-10-30-make-kit-monorepo.md#9-temporary-workarounds-as-deferred-obligations); the root map in [AGENTS.md](../../AGENTS.md) and [CLAUDE.md](../../CLAUDE.md), item 3; [Q-014](#q-014-nested-project-fixes) |
| Owner | The repository owner |
| Target coordinate | The Make Docs nested-project fix plan in `kits/make-docs/docs/plans/`, which sets its own coordinate, for release 2.1.0 |
| Future trigger | Make Docs 2.1.0 ships with the fix |
| Dependencies | Copy day and the switch point |
| Acceptance exit criteria | The fix ships with a nested-project test. The matching item is gone from the root map, from kit setup and from the validation steps. The record is `Fulfilled` with its version and proof command. |
| Related requirements and findings | `02-architecture-overview.md` ([Several Docs Roots](02-architecture-overview.md#several-docs-roots)); `05-kit-conventions.md` ([Project Target](05-kit-conventions.md#project-target), [MCP Server](05-kit-conventions.md#mcp-server)) |
| History / disposition note | Recorded on 2026-11-01 from design section 9 and the root map. The workaround is temporary and must not become the normal way of working. |

### O-004 Link Checks Cover Links Between Projects

| Field | Value |
| --- | --- |
| ID | O-004 |
| Title | Link checks cover links between projects |
| Status | Deferred |
| Summary | The Make Docs link checks validate links that leave a project and land in another known project. Until then, links between a kit's docs and the root docs use `../` paths, and validation checks them by hand or by script (root map item 4). |
| Source authority | [Design section 9](../designs/2026-10-30-make-kit-monorepo.md#9-temporary-workarounds-as-deferred-obligations); the root map in [AGENTS.md](../../AGENTS.md) and [CLAUDE.md](../../CLAUDE.md), item 4; [Q-014](#q-014-nested-project-fixes); [Q-020](#q-020-release-of-the-link-read-command) |
| Owner | The repository owner |
| Target coordinate | The Make Docs nested-project fix plan in `kits/make-docs/docs/plans/`, which sets its own coordinate, for release 2.1.0 |
| Future trigger | Make Docs 2.1.0 ships with the fix |
| Dependencies | Copy day and the switch point |
| Acceptance exit criteria | The fix ships with a nested-project test. The matching item is gone from the root map, from kit setup and from the validation steps. The record is `Fulfilled` with its version and proof command. |
| Related requirements and findings | `02-architecture-overview.md` ([Several Docs Roots](02-architecture-overview.md#several-docs-roots)); `05-kit-conventions.md`; the link read command for Make Blueprint (Make Blueprint register `kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md`, [Q-024](../../kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md#q-024-make-docs-link-check-interface)) |
| History / disposition note | Recorded on 2026-11-01 from design section 9 and the root map. The workaround is temporary and must not become the normal way of working. |

### O-005 Backlog Snapshot Works Below the Git Root

| Field | Value |
| --- | --- |
| ID | O-005 |
| Title | Backlog snapshot works below the git root |
| Status | Deferred |
| Summary | The backlog snapshot and the `backlog_snapshot` MCP tool take a work record's last-updated time from git history when the git root sits above the project. Until then, check a kit's backlog from the repository root with `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root kits/<kit>` (root map item 5). A valid backlog exits 0, and its only diagnostic is the information code `BACKLOG-VAL-010`. |
| Source authority | [Design section 9](../designs/2026-10-30-make-kit-monorepo.md#9-temporary-workarounds-as-deferred-obligations); the root map in [AGENTS.md](../../AGENTS.md) and [CLAUDE.md](../../CLAUDE.md), item 5; [Q-014](#q-014-nested-project-fixes) |
| Owner | The repository owner |
| Target coordinate | The Make Docs nested-project fix plan in `kits/make-docs/docs/plans/`, which sets its own coordinate, for release 2.1.0 |
| Future trigger | Make Docs 2.1.0 ships with the fix |
| Dependencies | Copy day and the switch point |
| Acceptance exit criteria | The fix ships with a nested-project test. The matching item is gone from the root map, from kit setup and from the validation steps. The record is `Fulfilled` with its version and proof command. `make-docs run work backlog snapshot --target-root kits/make-blueprint` exits 0 from the repository root without `GIT_DIR`. |
| Related requirements and findings | `02-architecture-overview.md` ([Several Docs Roots](02-architecture-overview.md#several-docs-roots)); `05-kit-conventions.md` |
| History / disposition note | Recorded on 2026-11-01 from design section 9 and the root map. The workaround is temporary and must not become the normal way of working. The fix comes after Make Docs is in `kits/make-docs/`. |

## Source Anchors

- `docs/designs/2026-10-30-make-kit-monorepo.md`
- `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/00-overview.md`
- `docs/plans/2026-11-01-w1-r0-make-kit-monorepo/04-register-and-assembly.md`
- `AGENTS.md` and `CLAUDE.md` (the root map and its numbered workarounds)
- `kits/make-blueprint/docs/prd/03-open-questions-and-risk-register.md` (R-001, R-002 and its own O-001)
- `docs/prd/05-kit-conventions.md` (the gaps D-001 to D-041)
- [`make-docs v2.0.6: packages/cli/src/`](../../kits/make-docs/packages/cli/src/)
- [`make-docs v2.0.6: docs/prd/`](../../kits/make-docs/docs/prd/)
