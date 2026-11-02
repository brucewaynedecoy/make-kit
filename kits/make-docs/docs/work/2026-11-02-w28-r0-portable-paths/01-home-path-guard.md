---
title: "Phase 1: Home Path Guard"
kind: "work"
status: "draft"
coordinate: "W28 R0 P1"
source:
  type: "prd"
  path: "docs/prd/10-packaging-validation-and-release-reference.md"
---

# Phase 1: Home Path Guard

## Purpose

Stop home paths before they enter git history. Once a path is committed to a public repository, it stays there.

## Overview

Add one shared detector. Use it in `make-docs paths validate`, in a pre-commit hook, and in CI.

## Human Experience Outcome

- Impact and promise: direct; a commit that contains a home path fails with a clear message.
- Intended human outcome: the user sees the file, the line, and the fix before the path is committed.
- Surface: `make-docs paths validate` diagnostics, the pre-commit output, and the CI log.
- Evidence: negative fixtures and diagnostic snapshots.
- Obligation route: none.
- Authority: [Human Experience Contract](../../../.make-docs/system/contracts/human-experience-contract.md).

## Current Testing Decisions

| Testing type | Current decision | Decision record or `not-needed-now` reason |
| --- | --- | --- |
| Automated Implementation Testing | Planned | Positive and negative fixtures for each pattern and file kind. |
| Performance Testing | not-needed-now | No speed claim. Revisit if the archive scan slows CI. |
| Guided Progress Review | Optional | Offer after the hook works. |
| Unassisted Goal Testing | not-needed-now | Automated proof answers the question. |

## Source PRD Docs

- [10 Packaging, Validation, and Release Reference](../../prd/10-packaging-validation-and-release-reference.md)
- [39 CLI Command Model and Operation Registry](../../prd/39-cli-command-model-and-operation-registry.md)

## Source Obligations, Scenarios, And Findings

- `none`

## Stage 1 - Detector

### Tasks

- [ ] t1: Define the patterns: `/Users/<name>`, `/home/<name>`, `C:\Users\<name>`, and `file://` forms of each. Allow the placeholder `<user-home>`.
- [ ] t2: Add a shared detector that scans text files, `.map` files, and files inside `.tgz` archives.
- [ ] t3: Add an allowlist file for accepted exceptions. Each entry needs a reason.

### Acceptance criteria

- A1: A fixture with each pattern fails, and the message names the file, the line, and the fix.
- A2: `<user-home>` and allowlisted entries pass.
- A3: A home path inside a `.tgz` source map fails.

## Stage 2 - Wiring

### Tasks

- [ ] t4: Add a new code, for example `PATHS-VAL-0xx`, to `make-docs paths validate`.
- [ ] t5: Ship an optional pre-commit hook that runs the detector on staged files only.
- [ ] t6: Add the check to CI for the Make Docs repository and the make-kit monorepo.

### Acceptance criteria

- A4: `make-docs paths validate` reports the new code on a dirty fixture and exits non-zero.
- A5: The pre-commit hook blocks a staged home path and passes a clean commit.

### Dependencies

- P1 needs no other phase.
