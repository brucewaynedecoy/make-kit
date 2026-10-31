---
title: "20 System Packages"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-31-w2-r0-system-packages/00-overview.md"
---

# 20 System Packages

## Purpose

This PRD owns system packages. A system package is a versioned bundle of one or more systems and the records that describe them. One Make Blueprint project makes a package. Other projects take it in, on the same machine or on another one, so they start from a baseline instead of from nothing.

The main case is a product team. The team models its own product as one or more systems in its own project. Other teams then use Make Blueprint to map how they will implement the product for their own needs, or to compare it with the systems they have today. With a package, those teams get the product's capabilities, requirements, personas and integrations, with their evidence, from one file.

Every capability in this PRD is planned scope for v2.1. v2.0 has no system packages. It reserves the `run package` domain and the `origin` field name (see [08 CLI and MCP](08-cli-and-mcp.md#system-package-commands-v21) and [10 Records and Identity](10-records-and-identity.md#common-fields)).

## Scope

Covered here:

- What a package holds, and which fields travel.
- The bundle file and its manifest.
- `run package make`, which writes a bundle from the systems that a person names.
- `run package add`, which takes a package in, or a new version of a package that the project holds.
- The `origin` stamp on each record from a package, and the `package` record.
- How sources and evidence travel.
- How domains, lists and people merge.
- The `project check` codes for records from packages.
- What v2.1 leaves out.

Covered elsewhere:

- Common fields, statuses, `id` and `ref`, aliases, pending changes and the check catalog: [10 Records and Identity](10-records-and-identity.md).
- The fields of each record type, including `package`: [11 Record Types Reference](11-record-types-reference.md).
- Source records, git levels and the missing state: [12 Source Intake and Conversion](12-source-intake-and-conversion.md).
- Where pending changes are kept and how review approves them: [13 Extraction and Review](13-extraction-and-review.md).
- The write lock, the write journal, the content version and schema upgrades: [09 Storage and Indexing](09-storage-and-indexing.md).
- Command grammar, MCP tool names, profiles and `allowWrite`: [08 CLI and MCP](08-cli-and-mcp.md).
- Writes to `.make/personas.yaml` through the core: [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- The plan-then-write steps that the v1 import also uses: [17 v1 Import](17-v1-import.md).

Code anchors:

- `docs/designs/2026-10-31-system-packages.md` (Decision)
- `docs/prd/03-open-questions-and-risk-register.md` (Q-085 to Q-095)
- `blueprint/records/package/<id>.md`
- `blueprint/sources/packages/<name>/`

## Component and Capability Map

| Component | What it does | Main records | Release |
| --- | --- | --- | --- |
| Make | Writes one bundle file from the systems that a person names. The project that makes it keeps no record of it. | None | v2.1 |
| Take in | Shows a plan for a package, then writes its records in one journaled change | `package`, and each type that a package holds | v2.1 |
| New version | Takes a later version of a package that the project holds, and keeps the team's own changes | `package`, and each type that a package holds | v2.1 |
| Origin stamp | Marks each record that came from a package, so that a new version finds it | Each type that a package holds | v2.1 |
| Package checks | Report records whose stamp no longer fits | Each type that a package holds | v2.1 |

These outcomes are human-facing results under the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md):

- A person takes in a system baseline from one file. They see the full plan, with every record, merge and source, before any file is written.
- A person who takes in a new version keeps every change that their team made. An upstream change to a record that the team changed comes back as a pending change for review.
- A maker sees every source that will leave the project before the bundle is written.

Requirements:

- A package holds one or more systems, which a person names when they make it. Any system can go into any number of packages, in any mix.
- The project that makes a package keeps no record of it. A project has no default package, and a record that no package names is a plain local record.
- Only a project that takes a package in keeps a `package` record.
- Every package command works offline. No command pulls records from another project's folder or from the network.

Code anchors:

- `docs/designs/2026-10-31-system-packages.md` (Human Experience Intent; Decision)

## Contracts and Data

### What a Package Holds

A package holds the model of its systems, not the analysis. Only `active` records travel.

| Type | Records that travel |
| --- | --- |
| `system` | Each named system |
| `capability` | Each `active` capability of a named system |
| `requirement` | Each `active` requirement of a capability that travels |
| `domain` | Each domain that a capability that travels names |
| `persona` | Each `active` persona record that names at least one named system. Its `systems` list keeps only the named systems. |
| `integration` | Each `active` integration with `state: current` whose `from_system` and `to_system` are both named |
| `source` | Each source that the evidence of a record that travels names (see [Sources and Evidence](#sources-and-evidence)) |

Requirements:

- `draft`, `rejected`, `superseded` and `archived` records stay in the making project.
- Findings, extractions, comparisons, fit-gap records, placements and planned integrations stay in the making project. They hold the maker's own analysis and plans, and the taking project makes its own.
- An integration with one end outside the package stays in the making project. A maker who needs it to travel names both systems.
- A system that came into the making project from another package can go into a new package like any other system.

### Fields That Travel

| Field | In the bundle |
| --- | --- |
| `id`, `type`, `title`, `status`, `summary`, the body and the type's own fields | Travel unchanged, except for the rules below |
| `ref` | Travels, so that the taking project can keep it as an alias |
| `evidence`, `evidence_versions` | Travel |
| `audience`, persona `slug` | Travel |
| `related` | Only the entries that name records that travel |
| integration `replaces` | Only the entries that name integrations that travel |
| `facets` | Only the facets that the maker names with `--facet`, with their definitions in the manifest |
| `tags` | Only when the maker passes `--tags` |
| `aliases`, `owners`, `stakeholders`, `work_items`, `docs`, `origin` | Never travel |
| `schema_version` | Travels, so that the taking project can upgrade older records |
| `created_at`, `updated_at` | Travel in the bundle. The taking project sets its own when it writes the record. |

Requirements:

- The maker's people never leave the project. `owners` and `stakeholders` name the maker's people, so they stay.
- Make Docs links stay, because they point to docs in the making project.
- The `origin` stamp never travels. A project that takes a package in stamps each record with that package.

### Bundle File

A bundle is one zip file named `<name>-<version>.blueprint.zip`, such as `acme-erp-2.3.0.blueprint.zip`. It holds one folder with the same name:

```text
acme-erp-2.3.0/
  manifest.yaml
  records/
    system/SYS-8ce4r7k2.md
    capability/CAP-9xw3p7k2.md
    requirement/REQ-7kq2m7k2.md
    domain/DOM-5bl1t7k2.md
    persona/PER-2mx9c7k2.md
    integration/INT-4tz6b7k2.md
    source/SRC-4hd8x7k2.md
  sources/
    workshops/billing-workshop.docx.md
    workshops/billing-workshop.docx.t-001.csv
```

Record files use the format in [09 Storage and Indexing](09-storage-and-indexing.md#record-files). Converted text keeps its path under `blueprint/sources/` in the making project.

The manifest names the package and lists every other file with its hash:

```yaml
format: 1
name: acme-erp
version: 2.3.0
title: ACME ERP baseline
publisher: ACME product team
made_at: 2026-12-01T09:00:00Z
made_with: make-blueprint 2.1.0
systems:
  - id: SYS-8ce4r7k2
    name: ACME ERP
counts:
  system: 1
  capability: 214
  requirement: 1180
  domain: 9
  persona: 6
  integration: 4
  source: 37
facets:
  edition:
    label: Edition
    values: [standard, enterprise]
tags: false
files:
  records/system/SYS-8ce4r7k2.md: 3b1f0c...
```

Requirements:

- `format` is the bundle format version, and it starts at 1. `run package add` stops with `blocked` on a format that the installed CLI does not know, and names `make-blueprint update`.
- `name` uses lowercase letters, digits and hyphens, and starts with a letter.
- `version` is three whole numbers, `MAJOR.MINOR.PATCH`, compared number by number. So `2.10.0` is higher than `2.9.0`.
- `files` names every file in the bundle except the manifest, with the SHA-256 of its bytes. `run package add` stops with `blocked` and the code `package-damaged` when a file is missing, when a file is not listed, or when a hash differs.
- The hashes find damage, not tampering. v2.1 has no bundle signature.
- `run package add` reads the zip file or the same folder unzipped, so a team can keep packages in git or on a shared drive.

### Making a Package

`run package make <name> --system <system>... --version <version> [--title <text>] [--publisher <text>] [--facet <facet>]... [--tags] [--out <folder>] [--apply]`

Requirements:

- Without `--apply`, the command is a dry run. It shows the systems, the count of each type, every source that will go out with its git level, and what stays and why, such as drafts, planned integrations and integrations with one end outside the package. It writes nothing.
- With `--apply`, it writes `<name>-<version>.blueprint.zip` into `--out`, or into the current folder when `--out` is not given. The write is atomic.
- The command reads the records under the write lock, so the bundle is one consistent snapshot.
- It changes no record, no config and no Store state in the making project.
- `--publisher` defaults to the project `name` in `.make/config.yaml`. With neither, the command stops with `blocked` and names `--publisher`.
- `--title` defaults to the names of the systems.
- The command stops with `blocked` when a named system is not `active`, and when `project check` reports an Error on a record that would travel. It names each record and its code.
- The MCP tool `package_make` is a dry run by default. Its write needs both `apply: true` and `allowWrite`, as `import_v1` does.

### Taking a Package In

`run package add <bundle> [--apply]`

`<bundle>` is a `.blueprint.zip` file or an unzipped bundle folder. The same command takes in a first package and a new version of a package that the project holds.

Requirements:

- Without `--apply`, the command is a dry run. It shows the plan and writes nothing.
- With `--apply`, it writes the plan in one journaled change under the write lock (see [09 Storage and Indexing](09-storage-and-indexing.md#write-journal)). The plan that `--apply` writes is the same plan that the dry run shows.
- The plan names the package, its version and publisher, and the version that the project holds, if any. For each type, it counts the records that are new, written at once, sent to review as pending changes, unchanged, archived, and kept with a Warning. It lists each `id` clash with the new `id`, each new `ref` and alias, each domain merge, each code and facet value that goes into config, each entry that goes into `.make/personas.yaml`, and each source with its path.
- Records from a package arrive `active`. The person's `--apply` after the plan is the review, as in the v1 import. Drafts never travel, so nothing arrives as a draft.
- A bundle record with a lower `schema_version` than the installed CLI is upgraded with the rules in [09 Storage and Indexing](09-storage-and-indexing.md#schema-versions) before it is written. A higher `schema_version` stops the command with `blocked`, and names `make-blueprint update`.
- The command stops with `blocked` and the code `package-version-not-newer` when the project holds the same package `name` at the same or a higher version.
- The MCP tool `package_add` is a dry run by default. Its write needs both `apply: true` and `allowWrite`.

#### Identity

- A record keeps its upstream `id` when no record in the project uses it. Otherwise it gets a new `id`. The plan lists each clash.
- When an `id` changes, every relation field and evidence link in the package that names it is written with the new `id`.
- Each record gets a new `ref` from the project's own counters (see [10 Records and Identity](10-records-and-identity.md#the-ref)).
- The upstream `ref` becomes an alias with the package name and a dot in front, such as `acme-erp.CAP-118`. It is kept for good, like any alias.
- The command matches each incoming record to a record in the project whose `origin` stamp holds the same upstream `id`, from any package. A matched record follows the rules in [A New Version](#a-new-version), and its stamp then names this package.

#### Merges

- A domain joins the project's current domain with the same `code`, and each capability's `domain` names the local domain. When no current domain has the code, the package's domain is written as a record. When the two names differ, the plan shows both with a Warning, and the local name stays.
- A `capability_type`, `option_scope` or integration `method` code that the project does not list is appended to the matching `lists.*` setting in `.make/blueprint/config.yaml` (see [11 Record Types Reference](11-record-types-reference.md#lists-the-project-can-extend)).
- A facet or facet value from the manifest that the project config does not define is appended to `facets` in `.make/blueprint/config.yaml`. On each record, facet values and tags from the package are added to the record's own values, and none are taken away.
- Each `audience` slug and persona `slug` that `.make/personas.yaml` does not hold gets a `user` entry, written through the core as in the v1 import (see [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md)). A slug that the file already holds names the same role, and no entry is written.
- When a persona record in the project already claims a slug, the incoming persona record with that slug is not written. The plan names both records. `audience` lists that name the slug still resolve.

### A New Version

A package whose `name` matches a `package` record is a new version of that package.

| Upstream record | The team changed the record | Result |
| --- | --- | --- |
| New | Not applicable | Written `active`, with a stamp |
| Changed | No | Written at once |
| Changed | Yes | A pending change on the record, for review (see [13 Extraction and Review](13-extraction-and-review.md)) |
| Unchanged | Yes or no | Not written |
| Gone | No, and no record outside this package links to it | `archived` |
| Gone | Yes, or a record outside this package links to it | Stays `active`. `project check` reports `origin-withdrawn`. |

Requirements:

- The team changed a record when the hash of its fields that travel, without `facets` and `tags`, differs from the `hash` in its stamp. So a new tag, facet value or owner never counts as a change.
- A record is gone when its stamp names this package and the new version does not hold its upstream `id`.
- "A record outside this package" is a current record whose stamp does not name this package, or that has no stamp.
- Approval of a pending change writes the upstream values of the fields that travel. Rejection keeps the team's values.
- Every stamp that the new version touches gets the new `version` and `hash` in the same journaled change, and so does the `package` record.
- Fit-gap marks on changed requirements and capabilities show through the `marks-out-of-date` Warning (see [14 Fit-Gap and Placement](14-fit-gap-and-placement.md)), so the team sees which comparison results to check again.
- Records that the team made itself, such as new capabilities and requirements under a system from a package, are never written by a new version.

### The `origin` Stamp

```yaml
origin:
  package: PKG-3fj8w7k2
  version: 2.3.0
  id: CAP-9xw3p7k2
  hash: 6c4e1a...
```

| Key | Value |
| --- | --- |
| `package` | The `id` of the project's `package` record |
| `version` | The package version that last wrote the record |
| `id` | The record's upstream `id`, which never changes |
| `hash` | SHA-256 of the record's fields that travel, without `facets` and `tags`, as that version wrote them |

Requirements:

- Only `run package add` writes `origin`. Every other write keeps it unchanged, and `run record update` refuses a change to it.
- The serializer writes `origin` after `tags` (see [11 Record Types Reference](11-record-types-reference.md#common-fields-and-field-order)).
- A record with no stamp is a plain local record.

### The `package` Record

One `package` record, with the prefix `PKG`, stands for each package that the project took in. [11 Record Types Reference](11-record-types-reference.md#package-v21) holds its fields. `run package add` creates it `active`, with no review, and writes it again for each new version, so the git diff shows the change. v2.1 has no command that takes a package out of a project.

[08 CLI and MCP](08-cli-and-mcp.md#system-package-commands-v21) lists the four commands of the `run package` domain, with their MCP tools and profiles: `run package make`, `run package add`, `run package list` and `run package show`.

### Sources and Evidence

Requirements:

- A package carries the source record of each source that the evidence of a record that travels names. For a source whose git level is `all` or `converted`, it also carries the converted Markdown file and its table CSV files.
- A package never carries an original file.
- A source at the git level `none` travels as a source record with no text. Its evidence links stay.
- In the taking project, the files go under `blueprint/sources/packages/<name>/`, with the maker's path under `blueprint/sources/` after it. The command writes `path` and `converted_path` to match.
- Each source from a package takes the git level `converted`, or keeps `none`. Its original never arrives, so the source shows as missing, the normal state in [12 Source Intake and Conversion](12-source-intake-and-conversion.md#source-git-levels-and-the-missing-state). The missing message names the package.
- The source keeps its `sha256`, so evidence versions still compare.
- `run extract next` never hands out a source from a package, and `project status` counts these sources apart from the project's own.

### Package Check Codes

[10 Records and Identity](10-records-and-identity.md#check-catalog) lists these codes in the check catalog.

| Code | Meaning | Severity |
| --- | --- | --- |
| `origin-unknown-package` | A record whose `origin` names no `package` record | Error |
| `origin-withdrawn` | A record from a package that the last version of that package no longer holds, which stayed `active` because the team changed it or a record outside the package links to it. Names `run record archive` as the next action when nothing links to it. | Warning |

### Left Out of v2.1

- A default package, or a kept definition of each package that a project makes.
- Layers, in which one package changes another, and dependencies, in which one package needs another.
- A command that takes a package out of a project.
- A pull from another project's live folder, or a download from a URL.
- A bundle signature.
- A package skill. The MCP tools return the plan and the next action.

Code anchors:

- `docs/designs/2026-10-31-system-packages.md` (Decision; Alternatives Considered)
- `blueprint/records/package/<id>.md`
- `blueprint/sources/packages/<name>/`

## Integrations

| Module | How system packages use it |
| --- | --- |
| [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) | The core writes the new `user` entries in `.make/personas.yaml`, in the same journaled change as the records. |
| [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) | Owns `blueprint/records/package/` and `blueprint/sources/packages/`, and the `lists.*` and `facets` settings that a package can extend. |
| [08 CLI and MCP](08-cli-and-mcp.md) | Owns the grammar of the `run package` domain, the MCP tools, their profiles and `allowWrite`. |
| [09 Storage and Indexing](09-storage-and-indexing.md) | The write lock, the write journal, record files and the schema upgrade of older bundle records. |
| [10 Records and Identity](10-records-and-identity.md) | The `origin` common field, aliases, pending changes and the check codes. |
| [11 Record Types Reference](11-record-types-reference.md) | The `package` type and the field order. |
| [12 Source Intake and Conversion](12-source-intake-and-conversion.md) | Source records, git levels and the missing state. |
| [13 Extraction and Review](13-extraction-and-review.md) | Pending changes from a new version, and `run extract next`, which skips sources from a package. |
| [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) | Comparisons with systems from a package, and `marks-out-of-date` after a new version. |
| [17 v1 Import](17-v1-import.md) | Shares the plan-then-write steps, the `id` and `ref` mapping and the writes through the core. |

## Rebuild Notes

- Build `run package add` on the same plan and write steps as the v1 import, so the dry run and the write share one plan.
- Fixtures: two synthetic making projects with no client data. Cover a bundle with one system, a bundle with two systems and the integrations between them, and a new version with each row of [A New Version](#a-new-version). Also cover an `id` clash, a domain code with two names, a persona slug that a local persona record claims, a source at `none`, a damaged bundle, an older and a newer `schema_version`, and a lower version.
- Likely mistakes: a hash that covers fields the taking project changes on its own, such as `facets`, `tags`, `owners` or timestamps, which makes every record look changed; the maker's `ref` written as the local `ref`; an `origin` stamp that travels; relation fields left with an old `id` after a clash.
- A large package holds the write lock for its whole write. The `W2 R0` work characterizes this before it ships (see the [design](../designs/2026-10-31-system-packages.md#performance-evidence-candidates)).

## Source Anchors

- `docs/designs/2026-10-31-system-packages.md`
- `docs/plans/2026-10-31-w2-r0-system-packages/00-overview.md`
- `docs/prd/03-open-questions-and-risk-register.md`
