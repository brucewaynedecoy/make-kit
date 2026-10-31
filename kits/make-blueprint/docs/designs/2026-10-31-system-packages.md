---
title: "Make Blueprint System Packages"
kind: "design"
status: "draft"
follow_on:
  route: "change-plan"
  next_prompt: "make-docs://system/prompt/designs-to-plan-change.prompt.md"
  why: "An active PRD set exists. System packages need one new PRD and small updates to existing owners."
  coordinate_handoff: "New end-to-end work after W1 R1; recommended downstream coordinate W2 R0."
---

# Make Blueprint System Packages

## Purpose

This design records how one Make Blueprint project shares a system, or several systems, with other Make Blueprint projects. The owner settled it in a design interview on 2026-10-31, as register items Q-085 to Q-095. It exists so the `W2 R0` plan and the system packages PRD start from one agreed shape.

This need is why BuildOS v1 became Make Blueprint v2. Much of the v2 data model, such as random permanent ids, one file per record, content versions and pending changes, was shaped so that systems can move between projects.

## Context

A team builds a product that is extensible, configurable and customizable. Other teams use Make Blueprint to map the extra requirements for their own implementation of that product. Some of those teams also compare the product with systems they have today, to replace those systems or to integrate with them. Today each of those teams starts from nothing and models the product again from its documents.

Facts that shape this design:

- Each record has a random, permanent `id` with an 8-character code (see [10 Records and Identity](../prd/10-records-and-identity.md#the-id)). Ids stay unique across projects in practice, so a record can keep its `id` when it moves.
- A `ref` is a number that each project mints, so `CAP-118` can name different records in different projects.
- Each record is one Markdown file with YAML front matter, so a record copies as a file.
- The content version is a hash of the fields that carry a record's meaning (see [09 Storage and Indexing](../prd/09-storage-and-indexing.md#storage-interface)). Tags, facets and owners do not change it.
- A fix to a fact on an `active` record goes through a pending change and review.
- The v1 import already builds a plan, shows it as a dry run, and writes it in one journaled change (see [17 v1 Import](../prd/17-v1-import.md)).
- Evidence links point to anchors in converted text. Source git levels (`all`, `converted`, `none`) say which source files git tracks, and an absent file kept out of git shows as missing, a normal state.
- The CLI makes no network calls.

## Human Experience Intent

Impact: `direct`

Affected humans: `user` people and agents on product teams who share a product baseline, and on implementation teams who take one in; and `maintainer` people and agents who build and test Make Blueprint.

Human goal or effect: An implementation team starts from the product team's model of a system, with its evidence, instead of from nothing. It keeps its own changes when the product team releases a new version.

Experience promises:

- A person takes in a system baseline from one file. They see the full plan, with every record, merge and source, before any file is written.
- A person who takes in a new version keeps every change that their team made. An upstream change to a record that the team changed comes back as a pending change for review.
- A maker sees every source that will leave the project before the bundle is written.

Complexity kept out of the human path:

- Package definitions to keep up to date in the making project.
- Layers and dependencies between packages.
- Id clashes, ref numbering and hash comparison. The plan reports them, and the person does not manage them.

Evidence required:

- Automated tests for each row of the new-version table in [20 System Packages](../prd/20-system-packages.md#a-new-version), on two synthetic making projects with no client data.
- A round-trip test: make a package, take it in, change records in the taking project, take in a new version, and check each result.
- Human Experience Review of the dry-run plans of `run package make` and `run package add`.

## Performance Evidence Candidates

| Candidate | Base maintenance action | Performance applicability | Protected outcome | Decision informed | Canonical owner or next record |
| --- | --- | --- | --- | --- | --- |
| `run package add` of a large product baseline, several thousand records, in one journaled change under the write lock | `create` | `characterize-now` | Other writers in the project are not blocked for long while a package is taken in | Whether one journaled change holds, or the write needs batches like the schema upgrade (see D-012) | Next record: one `PERF-###` profile created by the `W2 R0` work phase that builds `run package add`, before its first measurement |

## Decision

1. **A system package is a versioned bundle of one or more systems.** A person names the systems when they make it. Any system can go into any number of packages, in any mix. The making project keeps no record of the packages it makes, and a project has no default package (Q-085 to Q-091).
2. **A package holds the model, not the analysis.** Only `active` records travel: the systems, their capabilities and requirements, the domains they use, their persona records, and current integrations whose two ends are both in the package. Findings, extractions, comparisons, fit-gap records, placements and planned integrations stay home (Q-085).
3. **Converted text travels; originals never do.** A source at the git level `none` travels as a source record with no text. The maker sees every source that will go out first (Q-086).
4. **The bundle is one zip file that holds a plain folder.** Its name is `<name>-<version>.blueprint.zip`. It holds a `manifest.yaml`, the record files and the converted text. The taking command also reads the folder unzipped. Nobody pulls from another project's live folder (Q-087).
5. **The taking project owns editable copies.** Each record arrives `active` with an `origin` stamp that names the package, the version, the upstream `id` and a hash. A new version writes unchanged records at once and sends changes to records that the team changed through review. Tags, facets and owners do not count as changes (Q-088, Q-092).
6. **Ids stay; refs are local.** A record keeps its upstream `id` when it is free. It gets a new local `ref`, and its upstream ref becomes an alias such as `acme-erp.CAP-118` (Q-089).
7. **Lists merge by code.** Domains join by code. Missing list codes go into config. `audience` slugs get `user` entries through the core. The maker's owners and stakeholders never leave the project (Q-090).
8. **One record tracks each package taken in.** The `package` type, prefix `PKG`, holds the name, version, publisher, systems and bundle hash (Q-091).
9. **The commands are `run package make` and `run package add`,** each a dry run unless `--apply` is given, plus `run package list` and `run package show`. [08 CLI and MCP](../prd/08-cli-and-mcp.md#system-package-commands-v21) owns the names.
10. **System packages are v2.1, in a new wave, `W2 R0`.** The local server and UI move to v2.2, and test records move to v2.3. v2.0 reserves the `run package` domain and the `origin` field name, and the v1 import keeps its plan and write steps apart from its reader so the package import can use them (Q-093, Q-094).

[20 System Packages](../prd/20-system-packages.md) states the full contract.

## Alternatives Considered

- **Bring analysis records too.** Rejected. The analysis states the maker's own decisions, and the taking team makes its own comparisons.
- **Carry original files.** Rejected. Converted text is enough to check evidence, and originals can be large and can hold more than the maker wants to share.
- **A live pull from another project's folder.** Rejected. A version is a fixed snapshot that the maker chose to release. A live pull takes half-done work and gives later versions nothing to compare against.
- **Lock records from a package.** Rejected. Teams must fix and tune a baseline, and local facets and tags must not need workarounds.
- **Mint new ids for every record.** Rejected. Kept ids keep every relation field and evidence link the same.
- **Keep each package's lists apart with a prefix.** Rejected. Teams compare systems by domain, and separate lists break that.
- **A list of packages in config.** Rejected. Config holds settings that people choose, not data that the tool writes.
- **Review every upstream change.** Rejected. One version can change hundreds of records. The plan is the review, and only changes to records that the team changed need more.
- **A new phase in `W1 R1`, so v2.0 ships with packages.** Rejected. v2.0 needs no rebuild for packages, and the new phase would hold back v2.0.
- **Keep the release numbers and make packages v2.3.** Rejected. Packages are the main reason for v2 and need only the CLI and MCP that v2.0 builds.
- **Package definitions, a default package, layers and dependencies, in the way of Dynamics 365 CE solutions.** Rejected for v2.1. The need is to make packages that other projects take in, not to keep a project's own systems in packages. These parts bring the hardest problems of solution systems.

## Consequences

What gets better:

- An implementation team starts from a reviewed model with evidence, not from nothing.
- A product team shares one file per release, and other teams see exactly what changed in each version.
- Two teams that take in the same package share ids, so later cross-project work can match records.

Trade-offs and risks:

- A taking project holds converted text from the maker. The maker must check the source list before the bundle goes out. The dry run lists every source for this reason.
- Bundle hashes find damage, not tampering. v2.1 has no signature.
- A record that a team changed and that changes upstream again needs a review each time.
- A large package holds the write lock for its whole write (see the performance candidate).

Left for later:

- Layers and dependencies between packages, a command that takes a package out, bundle signatures, and a download from a URL.

## Design Lineage

- Update Mode: `new-doc-related`
- Prior Design Docs: [Make Blueprint v2 Architecture](2026-10-29-make-blueprint-v2-architecture.md)
- Reason: System packages build on the v2 data model and storage that the architecture design fixes. They add one record type, one common field and one command domain, and they move the later release labels.

## Intended Follow-On

- Route: `change-plan`
- Next Prompt: [designs-to-plan-change.prompt.md](make-docs://system/prompt/designs-to-plan-change.prompt.md). Read `make-docs://system/prompt/designs-to-plan-change.prompt.md` with `make-docs resource read`.
- Why: An active PRD set exists. System packages need one new PRD, `20-system-packages.md`, and small updates to existing owners, so planning maintains the PRD set instead of starting a new baseline.
- Coordinate Handoff: This is new end-to-end work, not a revision of `W1 R1` ([plan](../plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md)). Recommended downstream coordinate: `W2 R0`. `W1 R1` takes only the reserved names and the release labels, in place, with no new revision.
