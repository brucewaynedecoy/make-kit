---
title: "Phase 3: Backlog Wording and Validation"
kind: "plan"
status: "draft"
coordinate: "W1 R2 P3"
---

# Phase 3: Backlog Wording and Validation

## Purpose

This phase brings the [W1 R1 work backlog](../../work/2026-10-30-w1-r1-make-blueprint-v2/00-index.md) into step with the PRDs that Phases 1 and 2 change, and then validates the whole change. The backlog has no started task: every task is still `- [ ]`. So the backlog worker edits the affected tasks in place, and this plan makes no delta backlog (see [Backlog Scope](00-overview.md#backlog-scope)).

## Rules for This Phase

- Keep every task ID and every acceptance criterion ID. Do not renumber, and do not add or remove a stage.
- Change only the words that the rows below name. Each changed task keeps its PRD link, and the link points to the updated section.
- Write each root link from a backlog phase file with five `../` steps, for example `../../../../../docs/prd/01-product-overview.md#release-scope`, as the backlog already does for the root design.
- A row with a gate waits for that owner answer. Apply it in the same run only when the matching Phase 1 row was applied.
- Write in ASD-STE100 Simplified Technical English. Use no semantic line breaks.

## Backlog Matrix

| ID | Backlog file and passage | Decision | Root owner | What changes and what stays |
| --- | --- | --- | --- | --- |
| C82 | [01 Shared Core Adoption](../../work/2026-10-30-w1-r1-make-blueprint-v2/01-shared-core-adoption.md#stage-4---tool-discovery-and-the-handoff-line), Stage 4 Dependencies: "A Make Docs release on the core that writes its own handoff line ... from repo-wide Step 0" | `update-existing` | [root Q-007](../../../../../docs/prd/03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0), [root 01 Release Scope](../../../../../docs/prd/01-product-overview.md#release-scope) | Core tool discovery stays a Step 0 dependency (core 0.1.0). The Make Docs handoff line and its answer to the refresh request come from a later Make Docs release with no number yet, not from Step 0. Keep "until it ships, the too-old path in t23 applies". The scope file names Stage 3 for this passage. The current text is in Stage 4, and Stage 3 names only the block code and the uninstall fix, which root 06 puts in Step 0. |
| C83 | [02 CLI and Packaging](../../work/2026-10-30-w1-r1-make-blueprint-v2/02-cli-and-packaging.md#stage-8---install-matrix-and-first-run-review), Stage 8 Dependencies: "A Make Docs release on the core that writes its handoff line ... from repo-wide Step 0" | `update-existing` | [root Q-007](../../../../../docs/prd/03-open-questions-and-risk-register.md#q-007-make-docs-changes-in-step-0), [root 01 Release Scope](../../../../../docs/prd/01-product-overview.md#release-scope) | The same wording change as C82. Keep "the matrix runs the Make Docs cases against the Phase 1 stub and the too-old path, and those cases stay open". |
| C84 | [01 Shared Core Adoption](../../work/2026-10-30-w1-r1-make-blueprint-v2/01-shared-core-adoption.md#stage-5---shared-project-files-through-the-core), task t26: "Each entry has a `slug`, a `name`, ..." | `update-existing` | [root 07 People and Roles Entry Fields](../../../../../docs/prd/07-setup-tool-and-shared-files.md#people-and-roles-entry-fields) | Read the fields that root 07 names: `slug`, `label`, `description`, `primitive`, `kind` and `kits`. Remove `name`. Add the root 07 link beside the 05 link. |
| C85 | [09 v1 Import and Release](../../work/2026-10-30-w1-r1-make-blueprint-v2/09-v1-import-and-release.md), task t11: "with its v1 slug, name and kind" and "with the slug as its name" | `update-existing` | [root 07 People and Roles Entry Fields](../../../../../docs/prd/07-setup-tool-and-shared-files.md#people-and-roles-entry-fields) | The v1 name becomes the entry's `label`, and an unnamed owner slug becomes its own `label`, as C79 states in 17. |
| C86 | [02 CLI and Packaging](../../work/2026-10-30-w1-r1-make-blueprint-v2/02-cli-and-packaging.md#stage-3---project-layout-machine-folder-and-routers), task t18: "read `~` as the user's profile folder on Windows" | `update-existing` | [root 05 Machine Folders](../../../../../docs/prd/05-kit-conventions.md#machine-folders) | Find the Store root in the root 05 order. On Windows the user data root is `LOCALAPPDATA`, then `APPDATA`, then the home folder. Add one acceptance criterion to Stage 3 with the next free `A` number for this order. |
| C87 | [02 CLI and Packaging](../../work/2026-10-30-w1-r1-make-blueprint-v2/02-cli-and-packaging.md#stage-6---setup-and-agent-tool-setup), task t31 and criterion A234: `make_blueprint` and `args = ["mcp"]` | `update-existing` | [root 05 MCP Server](../../../../../docs/prd/05-kit-conventions.md#mcp-server) | The entry is `make-blueprint` in every agent tool, and its arguments are `["mcp", "--profile", "<name>"]`, with `all` by default. A234 checks `[mcp_servers.make-blueprint]` and `args = ["mcp", "--profile", "all"]`. Add to t31: a Codex run loads the entry and lists the Make Blueprint tools, which is the planned evidence for the hyphen in the TOML key. |
| C88 | [02 CLI and Packaging](../../work/2026-10-30-w1-r1-make-blueprint-v2/02-cli-and-packaging.md), tasks t7, t14 and t39 and criterion A242: `--target-root` on catalog commands only, and `uninstall` with no `--dry-run` | `update-existing` | [root 05 Project Target](../../../../../docs/prd/05-kit-conventions.md#project-target), [root 05 JSON Output and Dry Run](../../../../../docs/prd/05-kit-conventions.md#json-output-and-dry-run) | t7: `--target-root` works on every command that acts on a project. t14: `setup` and `setup remove` take `--target-root`, and `uninstall` takes `--dry-run`. t39 and A242: `uninstall --dry-run` reports what it would remove and removes nothing. |
| C89 | [04 Record Types](../../work/2026-10-30-w1-r1-make-blueprint-v2/04-record-types.md) Dependencies: "The Make Docs read command from the repo-wide Step 0 Make Docs changes" | `update-existing` | [root Q-020](../../../../../docs/prd/03-open-questions-and-risk-register.md#q-020-release-of-the-link-read-command) | Name Make Docs 2.1.0. Keep "This phase does not wait for it". OQ-7 asks whether phase 04 builds the confirmation path. Until the owner answers, t33 and A429 stay as they are. |
| C90 | [01 Shared Core Adoption](../../work/2026-10-30-w1-r1-make-blueprint-v2/01-shared-core-adoption.md) "Risks this phase addresses" and [02 CLI and Packaging](../../work/2026-10-30-w1-r1-make-blueprint-v2/02-cli-and-packaging.md) "Risks this phase addresses": the kit R-001 and R-002 links | `link-only` | [root R-001](../../../../../docs/prd/03-open-questions-and-risk-register.md#r-001-core-release-friction), [root R-002](../../../../../docs/prd/03-open-questions-and-risk-register.md#r-002-two-core-versions-in-one-project) | Point the R-001 and R-002 links to the root items, because the kit items close (C63, C64). Keep the R-003 and R-004 links. Keep the links in t19 and t42, because the 05 Rebuild Notes heading stays. |
| C91 | The [backlog index](../../work/2026-10-30-w1-r1-make-blueprint-v2/00-index.md) and [01 Shared Core Adoption](../../work/2026-10-30-w1-r1-make-blueprint-v2/01-shared-core-adoption.md) Purpose and Stage 1, 2, 3 and 5 Dependencies: links to the root design only | `link-only` | [root 01 Release Scope](../../../../../docs/prd/01-product-overview.md#release-scope), [root 06 Core Versions and the Exact Pin](../../../../../docs/prd/06-shared-core.md#core-versions-and-the-exact-pin), [root 07 Shared People and Roles](../../../../../docs/prd/07-setup-tool-and-shared-files.md#shared-people-and-roles) | Add the root PRD link beside each design link: root 01 for the order of Step 0 and the setup tool wave, root 06 for the core and the pin, root 07 for the shared files. Keep the design links. |
| C92 | [02 CLI and Packaging](../../work/2026-10-30-w1-r1-make-blueprint-v2/02-cli-and-packaging.md) t5, t12 and A212; the exit-code-3 criteria A434 in 04, A538 in 05, A604 and A621 in 06, and A812 in 08 | `update-existing` | [root 05 Exit-Code Table](../../../../../docs/prd/05-kit-conventions.md#exit-code-table), [root 05 CLI Top Level](../../../../../docs/prd/05-kit-conventions.md#cli-top-level) | Gates: OQ-1 for t5 and the exit-code criteria; OQ-3 for t12 and A212. Recommended: t5 maps the outcomes as C50 states; each listed criterion expects exit code 1 for `blocked`; t12 and A212 test guided setup on a TTY and the hint with exit 0 off a TTY. Before the edit, search every backlog file for "exit code 3" and "exit codes are 0, 1, 3 and 2", and change each hit. |
| C93 | [09 v1 Import and Release](../../work/2026-10-30-w1-r1-make-blueprint-v2/09-v1-import-and-release.md) t22, A923, A926 and the experience handoff that runs `--apply` | `none` | [root 05 CLI Write Intent](../../../../../docs/prd/05-kit-conventions.md#cli-write-intent) | Gate: OQ-2. Recommended: no change. If the owner drops the preview-first form, these passages follow C53. |

## Validation Steps

The validation worker runs these steps from the repository root after every writer finishes. A finding goes back to the writer of that file, or the validation worker makes a fix-only edit inside that writer's scope.

1. `make-docs run prd authority validate --target-root kits/make-blueprint` exits 0 (workaround O-002 in the root map).
2. `make-docs run performance evidence validate --target-root kits/make-blueprint` exits 0, because 07 and 09 hold performance candidates.
3. `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root kits/make-blueprint` exits 0, and its only diagnostic is the information code `BACKLOG-VAL-010` (workaround O-005).
4. The Make Docs MCP tool `paths_validate`, with `targetRoot` set to `kits/make-blueprint` (workaround O-003), reports no finding for any changed file.
5. A link-check script resolves every relative link and heading anchor in each changed file, including every `../` link into the root docs (workaround O-004), and reports no broken link.
6. The same script runs on the root files `docs/prd/00-index.md`, `01-product-overview.md`, `06-shared-core.md` and `07-setup-tool-and-shared-files.md`, because they link to Make Blueprint headings. It reports no broken link.
7. A text search of `kits/make-blueprint/docs/prd/` and `kits/make-blueprint/docs/work/` finds none of these: `make_blueprint` (outside Requirement History), "profile folder", a `name` field on a `.make/personas.yaml` entry, "reserves the name `serve`" or "reserves the top-level `serve`", and a Make Docs handoff line "from repo-wide Step 0".
8. For each `link-only` and `update-existing` row in Phases 1 and 2, the worker reads the changed passage beside its root section and records "pointer only" or "Make Blueprint detail only". No shared rule is stated in full in both PRD sets.
9. Each changed file has no local home-folder path and no email address. A code anchor that starts with `<user-home>` is not a local path.
10. The Human Experience checks in the [overview](00-overview.md#human-experience-propagation) pass.

## Exit Criteria

- Every row from C82 to C93 is done as stated, or waits for its gate with no change.
- No task ID or acceptance criterion ID changed, apart from the one new criterion that C86 adds.
- All ten validation steps pass, and the worker reports each result to the coordinator.
