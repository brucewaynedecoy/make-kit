---
title: "Phase 5: Make Blueprint Links"
kind: "plan"
status: "draft"
coordinate: "W1 R0 P5"
---

# Phase 5: Make Blueprint Links

## Purpose

Set the scope of one small Make Blueprint change plan. That plan makes the Make Blueprint docs link to the root PRDs for the shared rules, so each rule has one owner (Q-006). It also carries the Make Blueprint wording that Q-007 and Q-023 change.

## Plan Decision

- Path: `kits/make-blueprint/docs/plans/<date>-w1-r2-shared-rules-links/`, with `00-overview.md` and one phase file.
- Coordinate: `W1 R2` in the Make Blueprint project. The change revises the shared-rule text of the `W1 R1` PRDs, so it keeps wave 1 and takes the next unused revision. `W2 R0` (system packages) is unrelated.
- Template and prompt: `plan-prd-change.md` and `make-docs://system/prompt/designs-to-plan-change.prompt.md`, read with `make-docs resource read`. Run every Make Docs command with `--target-root kits/make-blueprint`, and pass `targetRoot` on every MCP call (O-002, O-003).
- Start condition: [Phase 4](04-register-and-assembly.md) passes, so the root PRDs and anchors are stable.

## Candidate Changes

| Candidate | Make Blueprint owner | Decision | Reason |
| --- | --- | --- | --- |
| Shared-core boundary, version pin and core release rules | `docs/prd/05-ecosystem-and-shared-core.md` | `link-only` | Root `06-shared-core.md` owns them (Q-006). Keep what Make Blueprint itself needs from the core. |
| `.make/config.yaml` and `.make/personas.yaml` rules | `docs/prd/05-ecosystem-and-shared-core.md`, `docs/prd/06-project-layout-and-instruction-files.md` | `link-only` | Root `07-setup-tool-and-shared-files.md` owns them. Keep the Make Blueprint use of `owners`, `stakeholders` and `audience`. |
| Persona entry `name` used as a display name | `docs/prd/05-ecosystem-and-shared-core.md`, and Q-072 in `docs/prd/03-open-questions-and-risk-register.md` | `update-existing` | Q-023 sets `slug`, `label` and `description`, with no `name` field. Make Blueprint Q-072 also lists only three entry kinds; the root `07-setup-tool-and-shared-files.md` has four. |
| CLI shape, MCP profiles, routers, managed blocks, machine folders and the Store boundary | `docs/prd/06-project-layout-and-instruction-files.md`, `docs/prd/07-installation-and-distribution.md`, `docs/prd/08-cli-and-mcp.md`, `docs/prd/09-storage-and-indexing.md` | `link-only` | Root `05-kit-conventions.md` owns the shared rules. Keep the Make Blueprint commands, record types and settings. |
| R-001 and R-002 | `docs/prd/03-open-questions-and-risk-register.md` | `update-existing` | They move to the root register. The kit items keep their numbers and link to the root items. |
| O-001 Confirm Make Docs Links in Project Check | `docs/prd/03-open-questions-and-risk-register.md` | `update-existing` | Its trigger becomes Make Docs 2.1.0, which ships the link read command (Q-020). |
| Make Docs handoff line said to come from Step 0 | `docs/prd/05-ecosystem-and-shared-core.md` (component map row "Step 0 (core)"), `docs/work/2026-10-30-w1-r1-make-blueprint-v2/01-shared-core-adoption.md` (stage 3 dependencies), `docs/work/2026-10-30-w1-r1-make-blueprint-v2/02-cli-and-packaging.md` (stage dependencies) | `update-existing` | Q-007 moves the handoff line to a later Make Docs release. The "too-old" path stays until it ships. |
| Make Blueprint release scope row for Step 0 | `docs/prd/01-product-overview.md` | `update-existing` | The Step 0 row links the root release scope in root `01-product-overview.md` and its release order (Q-002, Q-021). Today the row puts the core before the switch point and the setup tool inside Step 0, which Q-001 and Q-002 change. |
| Shared-core part list | `docs/prd/05-ecosystem-and-shared-core.md` | `link-only` | The kit lists 10 parts, including the shared files and a reserved `serve` command. Root `06-shared-core.md` owns the core boundary. The `serve` command stays a Make Blueprint command. |

The change plan confirms each row against the current text before it writes. It adds no `## Requirement History` sections unless the Make Blueprint change-management rules call for them.

## Exit Criteria

- `make-docs run prd authority validate --target-root kits/make-blueprint` exits 0.
- Every `../` link from the Make Blueprint docs into the root docs resolves, checked by script (O-004).
- `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root kits/make-blueprint` exits 0 from the repository root, with only the information code `BACKLOG-VAL-010` (O-005).
- No shared rule is stated in full in both the root PRDs and the Make Blueprint PRDs.
