---
title: "08 CLI and MCP"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 08 CLI and MCP

## Purpose

This PRD owns the two surfaces through which people and agents reach Make Blueprint: the `make-blueprint` command-line tool (the CLI) and its stdio MCP server (a Model Context Protocol server that an agent tool starts as a child process and talks to over standard input and output). It fixes the command grammar and the current command catalog, how output and outcomes work, the MCP profiles and the `allowWrite` gate, how agent tools register the server, the shared filter syntax, read-only SQL on the local index, the `resource` surface, and the `project status` command.

The agent tool is the main way people use Make Blueprint. Every capability in the seven workflow stages is a CLI command, and almost every command is also an MCP tool with the same meaning. Skills call these commands and hold no logic of their own. A person who knows the Make Docs CLI finds the same group names, the same `run <domain> <verb>` shape, the same profile model and the same write gate here.

## Scope

This PRD covers:

- the seven top-level command groups, the nine `run` domains and the full v2.0 command catalog that other PRDs link to;
- human output and machine output, outcomes and exit codes;
- the stdio MCP server, its profiles, tool naming, the `allowWrite` gate and the server entry that each agent tool gets;
- the shared filter syntax and read-only SQL;
- the `resource` surface and the `make-blueprint://system/<type>/<path>` URI scheme;
- `project status`, the owner of the plan promise that one status command shows project state and the next useful action;
- the names of the lifecycle commands `setup`, `setup remove`, `update`, `uninstall` and `mcp`, and their main flags;
- the names in the `run package` domain (v2.1);
- where the `serve` command (v2.2) sits in the grammar, and the names of view-model calls (v2.2).

Covered elsewhere:

| Topic | Owner |
| --- | --- |
| What `setup`, `update` and `uninstall` do, skills install, and where each agent tool keeps its MCP config | [07 Installation and Distribution](07-installation-and-distribution.md) |
| Where a local copy of system resources lives, routers and managed blocks | [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) |
| The CLI and MCP rules for every kit: the top level, outcomes and exit codes, JSON output and dry run, write intent, the project target, the MCP server, its profiles and `allowWrite`, and system resources | Root [05 Kit Conventions](../../../../docs/prd/05-kit-conventions.md#purpose) |
| What `packages/core` holds, including the base code of the MCP server, profiles and resource reading | Root [06 Shared Core](../../../../docs/prd/06-shared-core.md#core-boundary), with Make Blueprint's use in [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |
| The local index, its location and tables, locks, the write journal and record format versions | [09 Storage and Indexing](09-storage-and-indexing.md) |
| What `project check` checks, ref clashes and ref fixes, evidence link rules and facets | [10 Records and Identity](10-records-and-identity.md) |
| Fields and links for each record type | [11 Record Types Reference](11-record-types-reference.md) |
| The behavior of each `run` verb | [12 Source Intake and Conversion](12-source-intake-and-conversion.md), [13 Extraction and Review](13-extraction-and-review.md), [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), [15 Exports](15-exports.md), [17 v1 Import](17-v1-import.md) |
| The stage skills and how they use commands | [16 Workflow and Skills](16-workflow-and-skills.md) |
| The local server, the web app, MCP App views and view-model calls | [18 Local Server and UI](18-local-server-and-ui.md) |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 7: CLI and MCP; Consequences: left for planning)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/08-mcp-skills-and-status.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Human Experience Propagation)

## Component and Capability Map

### Command Groups

The CLI has the seven top-level commands of the root [CLI Top Level](../../../../docs/prd/05-kit-conventions.md#cli-top-level) section. An operation is one unit of work with a stable ID, a typed input and a typed result. Operations live in one operation catalog, and both the CLI and the MCP server are built from it. `setup`, `mcp`, `update` and `uninstall` are lifecycle commands outside the catalog, as in Make Docs.

| Group | What it does | Typical commands | In the operation catalog | Detail owner |
| --- | --- | --- | --- | --- |
| `setup` | Installs Make Blueprint in a project: folders, routers, managed blocks, skills, and MCP config for each selected agent tool. Run again, it brings the project, including its record files, to the installed version. `setup remove` takes it out of the project again. | `make-blueprint setup`, `make-blueprint setup --dry-run`, `make-blueprint setup remove` | No, a lifecycle command | [07 Installation and Distribution](07-installation-and-distribution.md), [09 Storage and Indexing](09-storage-and-indexing.md) |
| `project` | Reads and repairs project-wide state | `project status`, `project check`, `project reindex`, `project recover` | Yes | This PRD, [09 Storage and Indexing](09-storage-and-indexing.md), [10 Records and Identity](10-records-and-identity.md) |
| `resource` | Lists, reads and copies system resources | `resource list`, `resource read <uri>`, `resource ensure <uri>` | Yes | This PRD |
| `run <domain> <verb>` | Runs one record operation in one of nine domains | `run source add`, `run extract next`, `run review approve` | Yes | This PRD for names, subject PRDs for behavior |
| `mcp` | Starts the stdio MCP server | `make-blueprint mcp`, `make-blueprint mcp --profile extract` | No, a lifecycle command | This PRD |
| `update` | Updates the installed tool only. It changes no project; running `setup` again brings a project to the installed version. | `make-blueprint update` | No, a lifecycle command | [07 Installation and Distribution](07-installation-and-distribution.md) |
| `uninstall` | Takes the installed CLI off the machine. It never changes a project folder. | `make-blueprint uninstall` | No, a lifecycle command | [07 Installation and Distribution](07-installation-and-distribution.md) |

The design's shorthand `make-blueprint check` and `make-blueprint status` mean `make-blueprint project check` and `make-blueprint project status`. The CLI has no top-level aliases for them. Project uninstall is `setup remove` and tool uninstall is the top-level `uninstall`, as the root [CLI Top Level](../../../../docs/prd/05-kit-conventions.md#cli-top-level) section states, so the two scopes cannot be confused.

Requirements:

- In v2.0, `make-blueprint --help` lists the seven top-level commands of the root [CLI Top Level](../../../../docs/prd/05-kit-conventions.md#cli-top-level) section: `setup`, `project`, `resource`, `run`, `mcp`, `update` and `uninstall`.
- `make-blueprint run` with no domain lists the nine domains. `make-blueprint run <domain>` with no verb lists that domain's verbs, each with a one-line description.
- Every command accepts `--help` and prints usage, options and at least one example. `--help` and `--version` work in any folder and need no project and no machine Store.
- An unknown group, domain or verb returns the `failed` outcome, changes nothing, and names the closest valid command. For example, `make-blueprint status` names `make-blueprint project status`.
- `make-blueprint` with no command follows the root [CLI Top Level](../../../../docs/prd/05-kit-conventions.md#cli-top-level) rules for the bare command ([Q-098](03-open-questions-and-risk-register.md#q-098-bare-command-with-no-install)). Inside a project that is set up, it prints the same output as `make-blueprint project status` and changes no file. In a folder that is not set up, on a TTY, it starts guided `setup`, which shows the full plan and asks before it writes. In a folder that is not set up, with no TTY, it says what Make Blueprint is, names `make-blueprint setup` as the next action, writes nothing and exits 0. [07 Installation and Distribution](07-installation-and-distribution.md) owns what `setup` does.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 7: CLI and MCP; section 8: storage; section 9: identity)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/cli.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/39-cli-command-model-and-operation-registry.md`

### Command Catalog

This is the current v2.0 command catalog. Other PRDs link here for command and tool names, and each subject PRD owns the detailed behavior of its verbs. Every command runs as `make-blueprint <command>`.

How to read the tables:

- `<record>` accepts a record's permanent `id` (such as `REQ-7kq2m7k2`), its friendly `ref` (such as `REQ-042`) or one of its aliases. `<source>`, `<extraction>`, `<comparison>` and the other named arguments are records of that type and accept the same three forms.
- Kind `read` changes nothing. Kind `derived` changes only the derived local index, which can always be rebuilt. Kind `write` changes record files, source files, exports or machine Store state. It also covers the shared core adding an entry to `.make/personas.yaml` when a persona record is approved.
- Profiles name the MCP profiles that hold the tool. `all` holds every tool and is not repeated. "Every profile" means the tool is in all five intent profiles.

#### `project`

| Command | What it does | Kind | MCP tool | Profiles |
| --- | --- | --- | --- | --- |
| `project status` | Shows project state and names the next useful action. See [Project Status](#project-status). | read | `project_status` | every profile |
| `project check [--filter <expr>]` | Runs every record check, such as bad hand edits, ref clashes, broken links, stale evidence links, older record formats and Make Docs links, and names a fix for each problem | read | `project_check` | `core`, `setup` |
| `project reindex` | Rebuilds the derived local index from the record files | derived | `project_reindex` | `setup` |
| `project recover` | Finishes or undoes a change to many records that stopped part-way | write | `project_recover` | `setup` |

Behavior owners: this PRD for `project status`; [10 Records and Identity](10-records-and-identity.md) for what `project check` checks; [09 Storage and Indexing](09-storage-and-indexing.md) for `project reindex` and `project recover`.

#### `resource`

| Command | What it does | Kind | MCP tool | Profiles |
| --- | --- | --- | --- | --- |
| `resource list [--type <type>]` | Lists system resources with URI, type, version and origin | read | `resource_list` | `core` |
| `resource read <uri>` | Prints one system resource | read | `resource_read` | `core` |
| `resource ensure <uri>` | Writes a local copy of one system resource into the project | write | `resource_ensure` | `setup` |

Behavior owner: this PRD, with the local copy location in [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md).

#### `run source`

| Command | What it does | Kind | MCP tool | Profiles |
| --- | --- | --- | --- | --- |
| `run source add <path>... [--git-level <level>]` | Registers files or folders as source records, records each file's hash, and converts supported types at once. `--git-level` gives each new source its own git level, `all`, `converted` or `none`, in the same change, so a file meant for `none` is never registered at the project level first. | write | `source_add` | `intake` |
| `run source set-level <source>... <level>` | Sets the git level of one or more sources to `all`, `converted` or `none`. It writes each source record and the managed `blueprint/sources/.gitignore` in one journaled change, at once and with no review, because a git level is a storage setting, not a claim from evidence. | write | `source_set_level` | `intake` |
| `run source convert <source>...` | Converts a source again, for example after its original changed, or takes text that an agent or a person supplies on standard input for a type the CLI does not convert | write | `source_convert` | `intake` |
| `run source convert <source> --agent [--reason <text>]` | Starts the agent route for one PDF source. In this guided route, an agent writes the converted text a few pages at a time, and the CLI checks it. The source moves to `agent-in-progress`. `--reason` is required when the built-in converter reported no trouble signal for the PDF, such as a table or a page with no text layer; without it, the command returns `blocked` and names `--reason`. A source that is not a PDF returns `failed`. | write | `source_convert`, with `agent: true` | `intake` |
| `run source pages-next <source> [--file]` | Hands out the next batch of page numbers for a source in `agent-in-progress`. The CLI tracks which pages are out and which are written, so work can resume after a stop. With `--file`, it also writes a PDF of only those pages to `~/.make/blueprint/`, never into the project, for an agent tool that cannot read a page range. | write | `source_pages_next` | `intake` |
| `run source pages-write <source> --pages <range>` | Takes the Markdown and table CSV files that the agent wrote for one batch, such as `--pages 9-12`, and runs the CLI checks: it adds the anchors, confirms that every page in the range is covered, compares numbers and words with each page's text layer and flags missing or invented values, and marks a page with no text layer "unchecked". When every page is written, the source moves to `awaiting-review`. | write | `source_pages_write` | `intake` |
| `run source list [--filter <expr>]` | Lists sources with git level, availability, conversion status and extraction status | read | `source_list` | `core`, `intake` |
| `run source show <source-or-link>` | Shows one source, or resolves an evidence link to its exact place and text, and says whether the source changed after the link was made. A link can name an anchor, such as `SRC-4hd8x7k2#p-012`, or a table position, such as `SRC-4hd8x7k2#t-001:r-0012:c-003`. | read | `source_show` | `core`, `intake`, `extract`, `analyze` |
| `run source read <source> [<part-or-range>]` | Returns the converted text of one part or one anchor range, with its anchors | read | `source_read` | `core`, `intake`, `extract`, `analyze` |

Behavior owner: [12 Source Intake and Conversion](12-source-intake-and-conversion.md), with the review of agent conversions in [13 Extraction and Review](13-extraction-and-review.md) and the `blueprint-convert` skill, which guides the agent route, in [16 Workflow and Skills](16-workflow-and-skills.md).

#### `run record`

| Command | What it does | Kind | MCP tool | Profiles |
| --- | --- | --- | --- | --- |
| `run record create --type <type>` | Creates one `draft` record and mints its `id` and `ref`. It refuses the types that have their own create command and names that command: `run source add` for `source`, `run extract next` for `extraction`, `run compare create` for `comparison`, `run compare score` or `run compare target-only` for `fit-gap`, and `run place set` for `placement`. | write | `record_create` | `extract`, `analyze` |
| `run record show <record>` | Shows one record: its fields, body, links, and the records that link to it | read | `record_show` | every profile |
| `run record list [--filter <expr>]` | Lists records that match a filter | read | `record_list` | every profile |
| `run record update <record> [--map-status <old>=<new>]...` | Changes fields or the body of one record. On an `active` record, the change becomes a pending change: a proposed fix that waits for review while the record keeps its old value. When an update drops values from a system's `capability_statuses`, the repeatable `--map-status` (MCP `statusMap`) maps each dropped value to a value that stays in the list, as [14 Fit-Gap and Placement](14-fit-gap-and-placement.md#system-status-lists) defines. | write | `record_update` | `extract`, `analyze` |
| `run record link <record> <field> <target>` | Adds a link from one record to another | write | `record_link` | `extract`, `analyze` |
| `run record unlink <record> <field> <target>` | Takes a link off a record | write | `record_unlink` | `extract`, `analyze` |
| `run record archive <record>` | Sets a record's status to `archived` | write | `record_archive` | `extract`, `analyze` |
| `run record supersede <record> --by <record>` | Sets a record's status to `superseded` and names the record that replaces it. It is only for a real replacement, such as one requirement split into two; a wrong fact is fixed through a pending change. | write | `record_supersede` | `analyze` |
| `run record confirm-evidence <record> <source>` | Confirms a record's evidence links to one source after a person or agent has read the linked text again, and moves those links to the source's current version | write | `record_confirm_evidence` | `extract`, `analyze` |
| `run record ref-fix <ref>` | The record created first (earliest `created_at`, then lower `id`) keeps the clashing `ref`. Each other record gets a new `ref` and keeps the old one as an alias, and a lookup by the old `ref` returns the holder and names the renamed records. | write | `record_ref_fix` | `setup` |
| `run record query <sql>` | Runs one read-only SQL statement on the local index. See [Read-Only SQL](#read-only-sql). | read | `record_query` | `core` |
| `run record schema [<type>]` | Shows the fields and links of each record type and the project's facet lists | read | `record_schema` | `core`, `extract`, `analyze` |

Behavior owners: [10 Records and Identity](10-records-and-identity.md) for identity, status, aliases, evidence confirmation and ref fixes; [11 Record Types Reference](11-record-types-reference.md) for fields and links; [13 Extraction and Review](13-extraction-and-review.md) for pending changes.

#### `run extract`

| Command | What it does | Kind | MCP tool | Profiles |
| --- | --- | --- | --- | --- |
| `run extract next` | Hands out the next due source and opens an extraction record for it | write | `extract_next` | `extract` |
| `run extract show <extraction>` | Shows an extraction with its parts, the coverage and outcome of each part, and the records it created or updated | read | `extract_show` | `core`, `extract` |
| `run extract add <extraction> --type <type>` | Creates a `draft` record inside an open extraction, with evidence links, after showing duplicate hints | write | `extract_add` | `extract` |
| `run extract link <extraction> <record>` | Adds evidence from the extraction's source to an existing record without changing its status | write | `extract_link` | `extract` |
| `run extract part <extraction> <part>` | Records coverage, outcome and a note for one part of the source | write | `extract_part` | `extract` |
| `run extract finish <extraction>` | Checks every part and finishes the extraction | write | `extract_finish` | `extract` |

Behavior owner: [13 Extraction and Review](13-extraction-and-review.md).

#### `run review`

| Command | What it does | Kind | MCP tool | Profiles |
| --- | --- | --- | --- | --- |
| `run review list [--filter <expr>]` | Lists drafts, pending changes and sources in `awaiting-review` that wait for review. Extraction drafts are grouped by extraction, and analysis drafts by comparison, then by type. A source shows its "unchecked" pages and its pages with flagged values first. | read | `review_list` | `core`, `extract`, `analyze` |
| `run review show <record>` | Shows one draft, or one pending change with its old and new values, with each evidence link resolved to its source text, its current duplicate hints and the records it links to. For a source in `awaiting-review`, it shows the converted text and the CLI check results by page, with "unchecked" and flagged pages first. | read | `review_show` | `core`, `extract`, `analyze` |
| `run review approve <record>...` or `--extraction <extraction>` | Makes draft records `active`, or writes approved pending changes into the same record files; a change to many records goes through the write journal. For a source in `awaiting-review`, it accepts the agent's text and sets `conversion_status` to `converted`, so extraction can start. | write | `review_approve` | `extract`, `analyze` |
| `run review reject <record>... [--pages <range>] --reason <text>` | Makes draft records `rejected`, or rejects pending changes and leaves their records unchanged, and keeps the reason. For a source in `awaiting-review`, it sends the pages that `--pages` names, or every page when `--pages` is not given, back to the agent, with the reason. | write | `review_reject` | `extract`, `analyze` |

Behavior owner: [13 Extraction and Review](13-extraction-and-review.md), including the optional second reviewer, pending changes and the review of agent conversions. Pending changes and sources in `awaiting-review` use these same review verbs, and [12 Source Intake and Conversion](12-source-intake-and-conversion.md) owns the conversion statuses. The exact command shape for naming a pending change is set before work phase 06 ends. `review_list`, `review_show`, `review_approve` and `review_reject` sit in `analyze` too, because compare, `target-only` generation and place create drafts that these verbs list, show and decide.

#### `run model`

| Command | What it does | Kind | MCP tool | Profiles |
| --- | --- | --- | --- | --- |
| `run model tree <system>` | Shows a system's capability tree with domains and capability statuses | read | `model_tree` | `analyze` |
| `run model merge <record> --into <record> [--map-status <old>=<new>]...` | Merges a duplicate system, capability or domain into another one and moves its links. In a system merge, the repeatable `--map-status` (MCP `statusMap`) maps each `capability_status` of a moving capability that the survivor's list lacks to a value in that list. | write | `model_merge` | `analyze` |
| `run model move <capability>... --parent <capability>`, or `--top` in place of `--parent` | Moves one or more capabilities under another parent capability of the same system. With `--top`, it moves them to the top of their system's tree. `--top` and `--parent` cannot be used together. | write | `model_move` | `analyze` |
| `run model set-domain <capability>... <domain>`, or `--none` in place of `<domain>` | Sets the domain of one or more capabilities. `--none` clears it. | write | `model_set_domain` | `analyze` |

Behavior owner: [14 Fit-Gap and Placement](14-fit-gap-and-placement.md).

#### `run compare`

| Command | What it does | Kind | MCP tool | Profiles |
| --- | --- | --- | --- | --- |
| `run compare create --target <system> --baseline <system>...` | Creates an `active` comparison of one target system with one or more baseline systems. A comparison states the scope a person chose, not a claim from evidence, so it skips review. | write | `compare_create` | `analyze` |
| `run compare show <comparison>` | Shows the comparison's coverage: scored and unscored baseline capabilities, target-only candidates, stale `target-only` records, counts by verdict and domain, and current integrations that touch a baseline system and that no planned integration replaces | read | `compare_show` | `analyze` |
| `run compare next <comparison>` | Hands out the next baseline capability that has no fit-gap record, or whose fit-gap marks are out of date because what they marked has a new content version, with its requirements and candidate target matches. Each requirement comes with its content version: a hash of the fields that carry its meaning, which a mark keeps and which [09 Storage and Indexing](09-storage-and-indexing.md) defines. A capability with no requirements comes with its own content version. | read | `compare_next` | `analyze` |
| `run compare score <comparison> <capability>` | Creates or updates the fit-gap record for one baseline capability. It takes a mark, with evidence, for every baseline requirement, and refuses a draft that lacks the fields its verdict requires. An update to an `active` fit-gap record becomes a pending change. | write | `compare_score` | `analyze` |
| `run compare target-only <comparison>` | Creates `target-only` records for target capabilities that no fit-gap record uses | write | `compare_target_only` | `analyze` |

Behavior owners: [14 Fit-Gap and Placement](14-fit-gap-and-placement.md); [19 System Integrations](19-system-integrations.md) for integrations.

#### `run place`

| Command | What it does | Kind | MCP tool | Profiles |
| --- | --- | --- | --- | --- |
| `run place next <comparison>` | Hands out the next fit-gap record that has no placement | read | `place_next` | `analyze` |
| `run place set <fit-gap>` | Creates or updates the placement for one fit-gap record: the owning system and the delivery value | write | `place_set` | `analyze` |
| `run place link <placement-or-integration>` | Links a placement or an integration record to Make Docs work item IDs or doc paths, which is the hand-off stage. It stores `work_items` and `docs` at once on either record type, also on an `active` record, because a Make Docs link is not a fact about a system. | write | `place_link` | `analyze` |

Behavior owners: [14 Fit-Gap and Placement](14-fit-gap-and-placement.md); [19 System Integrations](19-system-integrations.md#make-docs-links) for links on integration records; [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) for Make Docs links.

#### `run export`

| Command | What it does | Kind | MCP tool | Profiles |
| --- | --- | --- | --- | --- |
| `run export fit-gap <comparison> [--include-drafts]` | Writes one comparison's exports: the fit-gap detail CSV, the summaries by verdict and by domain, the fit-gap requirements, placements and integrations CSV files, the comparison data dictionary and the xlsx workbook. It also writes the system files of its target system and each baseline system: their capability and requirement CSV files, capability model documents and data dictionaries. | write | `export_fit_gap` | `analyze` |
| `run export system <system> [--include-drafts]` | Writes the capability CSV, the requirement CSV, the capability model document and the data dictionary for one system | write | `export_system` | `analyze` |
| `run export all [--include-drafts]` | Writes every comparison's and every system's exports again from the current records, and deletes stale export files | write | `export_all` | `analyze` |

Behavior owner: [15 Exports](15-exports.md), which defines the three export scopes these verbs match and the status filter. By default, an export holds only `active` records. `--include-drafts` (MCP `includeDrafts: true`) on any of the three verbs adds `draft` records. Exports go to `blueprint/exports/` and are never the truth.

#### `run import`

| Command | What it does | Kind | MCP tool | Profiles |
| --- | --- | --- | --- | --- |
| `run import v1 <v1-project> [--apply]` | Imports one BuildOS v1 project. Without `--apply` it is a dry run that writes nothing. | write | `import_v1` | `setup` |

Behavior owner: [17 v1 Import](17-v1-import.md). `<v1-project>` must be the current project folder, the one that holds `.make/blueprint/`, because the import writes into the v1 project folder itself, beside the v1 files, and a person runs `setup` there first. The command refuses any other folder. `run import v1` is the one preview-first command in v2.0: its default is the dry-run report, and `--apply` performs the write. The root [CLI Write Intent](../../../../docs/prd/05-kit-conventions.md#cli-write-intent) section allows this preview-first form, with `--apply` as its flag. The MCP tool takes `apply: true` for the write, and that call also needs `allowWrite: true`.

#### Lifecycle Commands

These commands sit outside the operation catalog. [07 Installation and Distribution](07-installation-and-distribution.md) owns what they do; this table fixes their names and main flags.

| Command | What it does | Main flags | MCP |
| --- | --- | --- | --- |
| `setup` | Installs Make Blueprint in the current project, or, run again, brings it to the installed version: blocks, routers, skills, handoff lines, record upgrades and new folders | `--agent <claude-code,codex,copilot-cli>` for the agent tools, which defaults to the choices in `.make/config.yaml`, `--scope <project,machine>` for skills and MCP entries, `--mcp-profile <name>` for the entry's profile, `--generic-mcp-client <label>` to print an entry for another MCP client, `--dry-run` to preview, `--yes` to approve a fully specified plan with no terminal, `--target-root <path>`, `--json` | `setup_plan` returns the same plan as `setup --dry-run --json` |
| `setup remove` | Project uninstall: takes Make Blueprint's blocks, routers, skills and MCP entries out of one project and keeps all project knowledge | `--dry-run`, `--yes`, `--target-root <path>`, `--json` | None |
| `update` | Tool update only. It changes no project. | `--dry-run`, `--yes`, `--json` | None |
| `uninstall` | Tool uninstall: takes the installed CLI off the machine and never touches a project | `--remove-store` to also remove `~/.make/blueprint/`, `--dry-run` to report what it would remove and remove nothing, `--yes`, `--json` | None |
| `mcp` | Starts the stdio MCP server | `--profile <name>` | Not applicable |

The root [Flags and Tool Inputs](../../../../docs/prd/05-kit-conventions.md#flags-and-tool-inputs) table, with the root [JSON Output and Dry Run](../../../../docs/prd/05-kit-conventions.md#json-output-and-dry-run) and [Project Target](../../../../docs/prd/05-kit-conventions.md#project-target) sections, owns the flags that every kit shares.

Common options:

| Option | Applies to | Meaning |
| --- | --- | --- |
| `--json` | Every command | Print the full machine result. See [Human and Machine Output](#human-and-machine-output). |
| `--target-root <path>` | Every command that acts on a project: every catalog command, `setup` and `setup remove` | The project root. The default is the nearest folder, from the current folder upward, that holds `.make/blueprint/`. This is the root project-target search for the kit's project config. |
| `--dry-run` | Every write command | Report exactly what would change and write nothing |
| `--filter <expr>` | `run record list`, `run source list`, `run review list`, `project check` | Select records with the [Filter Syntax](#filter-syntax). The option can repeat, and every term from every `--filter` must match. |
| `--sort <field>` and `--limit <n>` | `run record list` | Order and count the results. A leading `-` sorts in descending order, as in `--sort -updated_at`. |
| `--fields <field>,...` | `run record list` | Name the fields each result shows, beyond `id`, `ref`, `type`, `title` and `status` |

Requirements:

- Every catalog operation has exactly one CLI command and exactly one MCP tool. Automated tests check the catalog against the CLI and against the MCP tool list in both directions.
- Every argument that names a record accepts its `id`, its `ref` or an alias. When a `ref` matches more than one record, the command returns `blocked` with the problem code `ambiguous-ref`, names the records by `id` and title, and names `run record ref-fix` as the fix. A permanent `id` is never ambiguous.
- Every write command accepts `--dry-run`. A dry run returns the same changes list the write would produce and changes no file and no Store state.
- No command waits for input when standard input is not a terminal or when `--json` is set. Every choice a command can ask for is also a flag. When a needed choice is missing, the command returns `blocked` and names the flag.
- On an `active` record, `run record update` changes no field at once. It records a pending change, and the record keeps its old value until review.
- `run source set-level` and `run place link` write at once, also on `active` records, with no pending change. A git level is a storage setting and a Make Docs link is not a fact about a system, so neither is a claim from evidence that review must check.
- `run model move` and `run model set-domain` take one or more capabilities. A call that changes more than one record file is one journaled change.
- `run record update` does not change `id`, `ref`, `type` or `status`. Status changes go through `run review approve`, `run review reject`, `run record archive`, `run record supersede` and `run model merge`. A `ref` changes only through `run record ref-fix`.
- A list result reports the total number of matches and whether it was cut short. The default limit is 50.
- The CLI and the MCP server make no network calls and send no usage data. Every catalog command works offline.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 9: identity; section 10: data model; section 11: workflow and skills; section 13: exports; section 15: release plan and v1; section 16: Q-009, Q-019, Q-028, Q-032, Q-034, Q-041, Q-060, Q-061, Q-062, Q-065, Q-068, Q-072, Q-073, Q-076 and Q-080)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/04-record-types.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/05-intake-and-conversion.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/06-extraction-and-review.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/07-analysis-and-exports.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/09-v1-import-and-release.md`
- `docs/prd/03-open-questions-and-risk-register.md` (Q-083 and Q-084)
- `blueprint/records/<type>/<id>.md`
- `blueprint/sources/`
- `blueprint/exports/`

### Human and Machine Output

Every command produces one result. The CLI shows it in one of two forms. Human output is short text for a person at a terminal. Machine output is the full result as JSON. The MCP server returns the same result object as machine output. Only the form differs; the facts are the same.

Requirements:

- The CLI chooses human output or machine output by the root [JSON Output and Dry Run](../../../../docs/prd/05-kit-conventions.md#json-output-and-dry-run) rule for `--json` and a standard output that is not a TTY.
- Human output and machine output for the same input carry the same outcome, the same changes, the same problems and the same next action.
- With `--json`, the CLI prints exactly one JSON document: on standard output for a `success`, `partial` or `blocked` result, and on standard error for a `failed` result (see [Outcomes and Exit Codes](#outcomes-and-exit-codes)). Progress and diagnostic text go to standard error.
- Human output names records by `ref` and title. Machine output carries both `id` and `ref` for every record it names.
- Human output leads with the outcome and what changed, then any problems, then the next action. It describes problems in terms of the person's work. Words for internal parts, such as index, lock, journal or hash, appear only in diagnostic detail or in an error that needs a person's decision.
- Paths in every output are project-relative and use `/` on macOS, Windows and Linux.
- The MCP result for a tool call is the same object that `--json` prints for the matching command and input, apart from fields that the result schema marks as specific to one surface.
- No output, log or error message contains an MCP connection key.

Code anchors:

- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Acceptance Criteria Guidance)
- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Human Experience Intent: complexity kept out of the human path)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/39-cli-command-model-and-operation-registry.md` (Render Layer)

### Outcomes and Exit Codes

Every result has exactly one of four outcomes. The outcome tells a person or an agent whether the goal was met and what to do next.

| Outcome | Meaning | Exit code | MCP result |
| --- | --- | --- | --- |
| `success` | The command did everything it was asked. Any problems it lists are warnings. | 0 | Normal result |
| `partial` | The command finished, but some items were not done or have errors. Each such item is named, with its next action. | 1 | Normal result |
| `blocked` | The command stopped before changing anything, because a person's decision or another command must come first. The blocker and the command that clears it are named. | 1 | Normal result |
| `failed` | The command could not run: bad input, an unknown record, an unreadable file or an internal fault. Nothing changed, or the change was undone. | 2 when the command could not start its work: a flag or an argument that is not valid, an unknown record, or a file that cannot be read. 1 for an internal fault. | Error flag set |

The exit codes follow the root [Exit-Code Table](../../../../docs/prd/05-kit-conventions.md#exit-code-table) ([Q-096](03-open-questions-and-risk-register.md#q-096-exit-codes-follow-the-root-table)). The root [Outcomes and Exit Codes](../../../../docs/prd/05-kit-conventions.md#outcomes-and-exit-codes) section owns the streams: a machine-readable result goes to standard output, and a machine-readable error goes to standard error. On the CLI, a `failed` result is that error, in the root [Result and Error Shapes](../../../../docs/prd/05-kit-conventions.md#result-and-error-shapes), with the fields of the [Result Envelope](#result-envelope) beside `ok`, `code` and `message`.

Examples:

- `run source add` on a folder of 10 files registers all 10 but cannot convert the tenth: `partial`, with the tenth source named and `run source convert` with supplied text as its next action.
- `run review approve --extraction EXT-014` while an earlier change to many records stopped part-way and one of its files has since changed by hand, so the file is in neither its before state nor its after state: `blocked`, with code `recovery-needed`, nothing approved, and `project recover` as the next action. An interrupted change whose files are all in their before or after state needs no person: the next write finishes or undoes it by itself, as [09 Storage and Indexing](09-storage-and-indexing.md) defines.
- `project check` finds two broken links: `partial`, with each link named. It finds only warnings: `success`, with the warnings listed.
- A write tool called without `allowWrite: true`: `blocked`, with code `write-not-allowed`.
- `run record show REQ-999` when no such record exists: `failed`, with code `unknown-record`.

Requirements:

- Every result carries exactly one outcome, and the CLI exit code matches it as in the table.
- One journaled change to many records ends either `success` or `failed`, because the journal finishes or undoes the whole change. A large approval runs in batches, and each batch is one journaled change that ends `success` or `failed`. A large approval that stops before its last batch reports `partial`, names the records it wrote and the records still waiting, and can be run again. [09 Storage and Indexing](09-storage-and-indexing.md) owns the journal and the batches.
- Every `partial`, `blocked` and `failed` result names at least one next action. A `success` result names a next action when the workflow has a next step.
- Agents read the `outcome` field. A nonzero exit code is not a crash; the result still holds the full facts.

Code anchors:

- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/run/root-operations.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/run/cli.ts`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/08-mcp-skills-and-status.md`

### MCP Server and Profiles

`make-blueprint mcp [--profile <name>]` starts one stdio MCP server. A profile filters which tools a client sees, so each agent session gets a short tool list. The root [MCP Server](../../../../docs/prd/05-kit-conventions.md#mcp-server) and [MCP Profiles and Write Permission](../../../../docs/prd/05-kit-conventions.md#mcp-profiles-and-write-permission) sections own the default profile `all`, the stop on an unknown profile, the rule that a profile filters tools and never grants access, and the stdio transport. The server code and profile system come from `packages/core` ([root Core Boundary](../../../../docs/prd/06-shared-core.md#core-boundary)). This PRD owns Make Blueprint's tool set and profile assignments.

| Profile | Tools for | Command families |
| --- | --- | --- |
| `core` | Reading records, search, status and resources | `project status`, `project check`, the read verbs of `run record`, `run source`, `run extract` and `run review`, and `resource list` and `resource read` |
| `setup` | Project and agent-tool setup, and repair | The setup plan, `project check`, `project reindex`, `project recover`, `run record ref-fix`, `resource ensure`, `run import v1` |
| `intake` | Adding and converting sources, setting their git levels, and the page batches of the agent route for complex PDFs | `run source`, including `source_set_level`, `source_pages_next` and `source_pages_write` |
| `extract` | Extraction and review | `run extract`, `run review`, source reads, and the record writes and schema reads that extraction needs |
| `analyze` | Model, compare and place, and the exports built from them | `run model`, `run compare`, `run place`, `run export`, `run review list`, `run review show`, `run review approve` and `run review reject`, source reads, and the record writes and schema reads that analysis needs |
| `all` | Every tool (the default) | Every tool above |

Review of pending changes sits wherever review sits: in `extract` and in `analyze`. Every intent profile also holds `project_status`, `record_show` and `record_list`, so an agent on any one profile can see where it is and read the records it works on. The `setup` profile holds one tool outside the operation catalog: `setup_plan` returns the same plan that `make-blueprint setup --dry-run --json` prints. Applying `setup`, `setup remove`, `update` and `uninstall` stays a CLI action that a person runs.

MCP tool names are snake_case and come from the operation ID by one rule: replace each `.` and `-` with `_`. For example, `project.status` becomes `project_status`, `compare.target-only` becomes `compare_target_only` and `record.ref-fix` becomes `record_ref_fix`. Tool arguments use camelCase, like Make Docs, such as `allowWrite`, `dryRun`, `targetRoot`, `filter`, `sort` and `limit`.

Requirements:

- `--profile` accepts only `core`, `setup`, `intake`, `extract`, `analyze` and `all`. Another value is an input error, with exit code 2.
- Every tool belongs to at least one of the five intent profiles. `all` is exactly the union of the five, with no extra tools. Tests fail when a tool has no profile.
- A tool in several profiles has one name, one input schema, one description and one behavior in all of them.
- Every tool title starts with "Make Blueprint", so an agent that also has the Make Docs server can tell tools such as the two `project_status` tools apart.
- Read tools carry the MCP read-only hint. Write tools do not.
- A `failed` outcome sets the MCP error flag. `success`, `partial` and `blocked` results do not.
- The server opens no network port. It writes only protocol messages to standard output; logs go to standard error.
- The server also lists and reads system resources as native MCP resources, in every profile, through the same resolver as `resource list` and `resource read`.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 7: CLI and MCP; Alternatives Considered: separate MCP servers for each domain)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/operations/mcp-metadata.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp/tools.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/operations/resource/mcp-profiles.ts`

### Write Permission (`allowWrite`)

Every MCP tool of kind `write` takes a boolean argument, `allowWrite`, as the root [MCP Profiles and Write Permission](../../../../docs/prd/05-kit-conventions.md#mcp-profiles-and-write-permission) section states. The agent must set it to `true` on each call that should change something.

Requirements:

- Read tools and `derived` tools take no `allowWrite`.
- A write tool called without `allowWrite: true` changes nothing and returns `blocked` with the code `write-not-allowed`. The result says which argument to set and what the call would have changed.
- A write tool called with `dryRun: true` needs no `allowWrite`. It returns the changes it would make and writes nothing.
- `allowWrite` covers only the call that carries it. The server keeps no write session between calls.
- The CLI has no `allowWrite` flag. The command that a person runs is the write intent, as the root [CLI Write Intent](../../../../docs/prd/05-kit-conventions.md#cli-write-intent) section states, and `--dry-run` previews it. `run import v1` is preview-first, as the catalog states and as the root rule for preview-first write commands allows ([Q-097](03-open-questions-and-risk-register.md#q-097-preview-first-write-commands)).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 7: CLI and MCP)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp/tools.ts` (`allowWriteSchema`, `dryRunSchema`)

### Agent-Tool Registration

`setup` writes one MCP server entry for each selected agent tool, by the rules of the root [MCP Server](../../../../docs/prd/05-kit-conventions.md#mcp-server) section. Each entry starts `make-blueprint mcp` and passes a connection ID and a connection key in its environment. The connection ID names one reviewed connection between one agent tool and Make Blueprint. The connection key proves that the caller is that connection.

| Agent tool | Entry | Shape |
| --- | --- | --- |
| Codex | TOML table `[mcp_servers.make-blueprint]` | `command`, `args = ["mcp", "--profile", "<name>"]`, and a `[mcp_servers.make-blueprint.env]` table with both connection variables |
| Claude Code | JSON key `mcpServers.make-blueprint` | `command`, `args: ["mcp", "--profile", "<name>"]`, and `env` with both connection variables |
| GitHub Copilot CLI | JSON key `mcpServers.make-blueprint` | `type: "local"`, `command`, `args: ["mcp", "--profile", "<name>"]`, `env` with both connection variables, and `tools: ["*"]` |
| Another MCP client | Printed by `setup` for the person to copy | The same `command`, `args` and `env` |

The entry name is `make-blueprint` in every agent tool. The connection variables are `MAKE_BLUEPRINT_MCP_CONNECTION_ID` and `MAKE_BLUEPRINT_MCP_CONNECTION_KEY`. Every entry runs `["mcp", "--profile", "<name>"]`, and `setup` writes `all` as the name when the person picks no profile.

Requirements:

- The connection ID is a random UUID. The root [MCP Server](../../../../docs/prd/05-kit-conventions.md#mcp-server) section owns the form of the connection key, the key hash in the machine config and the constant-time key check.
- The machine Store under `~/.make/blueprint/` keeps the key hash with the connection ID, the agent tool and whether the connection is active. The key itself lives only in the agent tool's own config.
- `setup` output, logs and Store records show the key as a redacted value. The one exception is the entry printed for another MCP client, which the person must copy.
- When the server is started without a recognized connection ID and key, tools that need the machine Store return `blocked` with the code `connection-not-recognized` and name `make-blueprint setup` as the fix. `resource_list` and `resource_read` still work. The server does not crash.
- A person who runs the CLI directly needs no connection key.
- [07 Installation and Distribution](07-installation-and-distribution.md) owns the setup flow that writes and takes out these entries, and where each agent tool keeps its config.

Code anchors:

- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp-connection.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/harness-access/native.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/generic-mcp-setup.ts`
- `~/.make/blueprint/`

### Filter Syntax

The CLI and MCP share one filter syntax. A filter is a short text expression that selects records by type, field, facet, status and link. The CLI takes it in `--filter`, and MCP tools take it in a `filter` argument. One parser serves both.

A filter is a list of terms separated by spaces. A record matches when every term matches.

| Term | Matches | Example |
| --- | --- | --- |
| `type:<type>` | Records of one type | `type:requirement` |
| `status:<status>` | Records with one status | `status:draft` |
| `<field>:<value>` | Records whose front matter field has the value | `kind:rule` |
| `<link-field>:<record>` | Records whose link field points at the record | `capability:CAP-012` |
| `facet.<name>:<value>` | Records that carry the facet value | `facet.release:R2` |
| `links:<record>` | Records that link to the record through any link field or evidence link | `links:SRC-4hd8x7k2` |
| `links:<source>#<anchor>` | Records with that exact evidence link | `links:SRC-4hd8x7k2#p-012` |
| `links:<source>#<table-position>` | Records with that exact evidence link to a table, row, column or cell in a converted CSV file | `links:SRC-4hd8x7k2#t-001:r-0012:c-003` |
| `has:<field>` | Records where the field has a value | `has:gap_detail` |
| `text:<words>` | Records whose title or summary contains the words, ignoring case | `text:"credit hold"` |
| `<field>:>=<value>` | Dates and numbers compared with `>`, `>=`, `<` or `<=` | `updated_at:>=2026-10-01` |

Modifiers:

- A comma lists alternatives inside one term: `verdict:gap,partial` matches either value.
- A leading `-` negates a term: `-status:rejected`, `-has:evidence`.
- Double quotes hold a value with spaces: `text:"credit hold"`.

Examples:

| Question | Filter |
| --- | --- |
| Draft requirements that came from one source | `type:requirement status:draft links:SRC-4hd8x7k2` |
| Capabilities of one system in one domain | `type:capability system:SYS-002 domain:DOM-007` |
| Gaps and partial fits with low confidence in one comparison | `type:fit-gap comparison:CMP-001 verdict:gap,partial confidence:low` |
| Fit-gap records with no migration note yet | `type:fit-gap -has:migration_note` |
| Records for one legal entity in one release | `facet.legal_entity:EU-01 facet.release:R2` |
| Active findings that are risks | `type:finding kind:risk status:active` |
| Placements not yet linked to Make Docs work items | `type:placement -has:work_items` |
| Records changed since a date, other than rejected ones | `updated_at:>=2026-10-01 -status:rejected` |

On the CLI, a quoted filter is one argument: `make-blueprint run record list --filter 'type:requirement status:draft'`. The same filter can also be split over repeated flags: `--filter type:requirement --filter status:draft`.

Requirements:

- The CLI and MCP give the same records, in the same order, for the same filter.
- A link field, `id`, `ref` and `links` accept a record's `id`, `ref` or alias. Matching always uses the permanent `id`, so a filter keeps working after a ref fix.
- A field term with no `type` term applies to every record type that has the field.
- Values match exactly. Enumerated values, such as statuses and verdicts, match without regard to case.
- An unknown key, facet or value returns `failed` with the code `unknown-filter-key` or `unknown-filter-value`, names the bad term, and lists the valid keys or values for the types in the filter.
- The filter syntax avoids characters that common shells treat specially outside quotes. Negation uses `-`, not `!`.
- The syntax is published as a system resource, `make-blueprint://system/reference/filter-syntax.md`, so skills point to it instead of copying it.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 7: CLI and MCP; section 10: facets and evidence links)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/04-record-types.md`

### Read-Only SQL

For questions the filter syntax cannot answer, a person or an agent runs one SQL statement on the local index: `make-blueprint run record query '<statement>'` on the CLI, or the `record_query` tool with a `sql` argument. The index is SQLite, derived from the record files. [09 Storage and Indexing](09-storage-and-indexing.md) owns its tables and publishes them as a reference resource. The tables are also readable through `SELECT name, sql FROM sqlite_schema`.

Requirements:

- A query cannot write. The CLI opens the index through a separate read-only connection, and it accepts only one statement, which must be a `SELECT` or a `WITH` that ends in a `SELECT`.
- A statement that would change data or schema, attach another database, load an extension or change a setting, such as `INSERT`, `UPDATE`, `DELETE`, `REPLACE`, `CREATE`, `DROP`, `ALTER`, `ATTACH`, `VACUUM` or a `PRAGMA` that sets a value, returns `failed` with the code `sql-not-read-only` and runs nothing.
- Tests run every such statement and confirm that the index file and every record file are byte for byte unchanged.
- Before a query runs, the index is brought up to date with the record files, as for status and filters.
- A query returns at most 1,000 rows by default, and `--limit` changes the cap. The result says when rows were cut.
- Human output shows a table. Machine output returns column names and rows.
- A query reads only the derived index. It never reads or writes record files, the machine Store tables or any file outside the index.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 7: CLI and MCP; section 8: storage)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/03-storage-and-identity.md`

### System Resources

Make Blueprint serves its system docs (contracts, templates, references and prompts) from inside the CLI, so a project needs no copy of them. Each resource has a stable URI in the scheme `make-blueprint://system/<type>/<path>`. The root [System Resources and Project Records](../../../../docs/prd/05-kit-conventions.md#system-resources-and-project-records) section and its [Resource Identity](../../../../docs/prd/05-kit-conventions.md#resource-identity) tables own the URI form, the four types, the origins and the URI families. Examples are `make-blueprint://system/reference/filter-syntax.md` and `make-blueprint://system/template/requirement.md`. The subject PRDs own what each resource says.

`resource read` reads a valid local copy first, when the project has one, and otherwise reads the copy built into the installed CLI. `resource ensure` writes a local copy of one resource. [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) owns where local copies live (`.make/blueprint/system/`).

Requirements:

- `resource list` is sorted by URI and shows each resource's type, version and origin (local or installed). `--type` narrows the list.
- `resource read <uri>` prints only the resource's bytes in human output. Machine output returns the URI, origin, version and content.
- `resource list` and `resource read` change nothing, need no machine Store and work offline.
- `resource ensure <uri>` writes exactly one local copy. Through MCP it needs `allowWrite: true`.
- A URI with an unknown scheme, type or path returns `failed` with the code `unknown-resource` and the valid form, and changes nothing.
- Files that Make Blueprint writes, such as routers and skills, cite `make-blueprint://` URIs in inline code, not as Markdown link targets, because Make Docs link rules accept only `http`, `https`, `mailto` and `make-docs` links.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 4: project and machine layout)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/operations/resource/identity.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/template-links.ts`
- `.make/blueprint/system/`

### Project Status

`project status` owns the plan promise "one status command shows project state and the next useful action". It is the first command a person or a stage skill runs, and the command that the bare `make-blueprint` runs. It reads the project and answers three questions: where things stand, what needs attention, and what to do next. This promise follows the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md).

What status shows:

| Section | What it reports |
| --- | --- |
| Project | The optional project display `name` from `.make/config.yaml`, the project root, the setup (A in v2.0), the CLI version, whether record files are at the current format, whether Make Docs is installed and whether its block carries the handoff line |
| Sources | The total, counts for each conversion status and each git level, originals that their git level keeps out of git and that are missing on this machine, and sources whose original changed after conversion |
| Extraction | Sources not started, in progress and done, and for each extraction in progress, its source and how many parts are covered out of the total |
| Review | Drafts waiting for review, by record type and by extraction or comparison, pending changes waiting for review, sources in `awaiting-review`, and when a second reviewer is on, the drafts waiting for the second review |
| Comparisons | For each comparison, baseline capabilities scored out of the total, target-only candidates, fit-gap counts by verdict, placements made and placements linked to Make Docs |
| Needs attention | Ref clashes, broken links, stale evidence links by source, missing originals that git tracks, record files that fail checks, failed conversions, broken Make Docs links, records in an older format, and a missing handoff line in the Make Docs block, with the fix: update Make Docs with its own update command, then run `make-blueprint setup` again, as [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md#handoff-line) defines |
| Next action | One action, with its reason, its exact CLI command and its MCP tool and arguments |

An original that its git level (`converted` or `none`) keeps out of git and that is not on this machine shows as "missing", as information and not as a problem, as [12 Source Intake and Conversion](12-source-intake-and-conversion.md) defines. Under `converted`, its evidence links still resolve through the converted text in git. A missing original that git tracks is an error, as [10 Records and Identity](10-records-and-identity.md) defines.

How status names the next useful action: it goes down this list and picks the first rule that applies. Machine output also lists the remaining applicable actions in the same order.

| Order | When | Next action |
| --- | --- | --- |
| 1 | The folder is not a set-up Make Blueprint project | `make-blueprint setup` |
| 2 | A change to many records stopped part-way and waits for a person's decision, because a file in it changed afterwards | `make-blueprint project recover` |
| 3 | Record files use a newer format than this CLI knows | `make-blueprint update` |
| 4 | The machine Store or the index cannot be used | The command that clears it, as [09 Storage and Indexing](09-storage-and-indexing.md) defines |
| 5 | Two or more records share a `ref` | `make-blueprint run record ref-fix <ref>` |
| 6 | An original changed after it was converted | `make-blueprint run source convert <source>` |
| 7 | Other errors from checks: broken links, stale evidence links, record files that fail checks, broken Make Docs links | `make-blueprint project check`, narrowed with `--filter` to the first affected source or record |
| 8 | A source failed to convert | `make-blueprint run source convert <source>`, again or with supplied text |
| 9 | Records use an older format | `make-blueprint setup` |
| 10 | The project has no sources | `make-blueprint run source add <path>` |
| 11 | An extraction is open and not finished | `make-blueprint run extract show <extraction>`, to continue it |
| 12 | Drafts, pending changes or sources in `awaiting-review` are waiting for review | `make-blueprint run review list` |
| 13 | Sources need text from an agent or a person, because the CLI has no converter for their type, or a source in `agent-in-progress` has pages still to write | `make-blueprint run source convert <source>` with supplied text, or `make-blueprint run source pages-next <source>` for a source in `agent-in-progress` |
| 14 | Converted sources are due for extraction | `make-blueprint run extract next` |
| 15 | Active capabilities exist in two or more systems and no comparison exists | `make-blueprint run compare create`, after the model stage cleans up systems, capabilities and domains |
| 16 | A comparison has unscored baseline capabilities, or fit-gap records whose marks are out of date | `make-blueprint run compare next <comparison>` |
| 17 | A comparison has target-only candidates or stale `target-only` records | `make-blueprint run compare target-only <comparison>` |
| 18 | Fit-gap records have no placement | `make-blueprint run place next <comparison>` |
| 19 | Placements have no Make Docs link | `make-blueprint run place link <placement>` |
| 20 | Nothing above applies | `make-blueprint run export all` |

How the three states read:

| State | Outcome | When | What the person sees |
| --- | --- | --- | --- |
| Ready | `success` | Status read the whole project and found no errors. Normal work, such as drafts waiting for review, may still be open. | Each section's counts, any warnings, and the next workflow step |
| Needs attention | `partial` | Status read the project and found errors that make some records untrustworthy | Each section's counts, a "Needs attention" list with each problem and its count, and the first repair as the next action |
| Blocked | `blocked` | Status cannot give a trustworthy picture, or no change is safe, until one action happens | What is blocked, why, and the one command that clears it |

If status itself cannot run, for example because a file cannot be read, it returns `failed`, says what failed and how to retry.

A ready result:

```text
Make Blueprint status: ready
Project: sample-project (file mode, setup A)

Sources       42 total, 42 converted
Extraction    42 of 42 sources done
Review        no drafts waiting
Comparisons   CMP-001: 98 of 112 baseline capabilities scored

Next: score the next baseline capability in CMP-001
  make-blueprint run compare next CMP-001
```

A result that needs attention:

```text
Make Blueprint status: needs attention
Project: sample-project (file mode, setup A)

Sources       42 total: 38 converted, 3 waiting, 1 failed (SRC-031)
Extraction    17 of 38 converted sources done, 1 in progress (SRC-018)
Review        23 drafts waiting: 14 requirements, 6 capabilities, 3 findings

Needs attention
  Ref clash         REQ-088 is used by 2 records
  Broken links      4
  Changed sources   SRC-012 changed after 6 evidence links were made

Next: give one of the two REQ-088 records a new ref
  make-blueprint run record ref-fix REQ-088
Then: continue the extraction of SRC-018
```

A blocked result:

```text
Make Blueprint status: blocked
Project: sample-project (file mode, setup A)

An approval of 40 drafts from EXT-014 stopped part-way,
and REQ-061 changed by hand after it stopped.
Make Blueprint can finish it, undo it, or keep the files as they are.

Next: finish or undo the approval
  make-blueprint project recover
```

Requirements:

- `project status` reports every section in the table above, in that order, in both human and machine output. The Comparisons section appears when the project has at least one comparison.
- Status names exactly one next action, chosen by the first applicable rule in the order table. Tests build one fixture project for each rule and check the chosen action.
- Each next action carries a plain sentence that says what to do and why, the exact CLI command with its arguments filled in, and the matching MCP tool name and arguments.
- Human output starts with one of the words "ready", "needs attention", "blocked" or "failed", and the machine `outcome` is `success`, `partial`, `blocked` or `failed` to match.
- A person can tell the three states apart from the first line alone, and in the needs-attention and blocked states, find the action that clears the state without reading further than the "Next" line.
- For ref clashes, broken links and stale evidence links, status reports the same counts that `project check` reports on the same files.
- Status names records by `ref` and title, and it never asks a person to manage the index, locks, the journal or block hashes.
- Status changes no project file and no Store state, apart from bringing the derived index up to date.
- Status works offline, without Make Docs and without a server.
- Status is one of the workloads measured in the [index rebuild and query characterization](09-storage-and-indexing.md#index-rebuild-and-query-characterization) that 09 owns, on a synthetic project the size of client-b-v3 (about 280 sources and several thousand records). That baseline sets no pass or fail target, and this PRD sets no time limit for status until the owner approves a target and 09 states it.
- `project_status` is in every MCP profile and returns the same result as `project status --json`.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Human Experience Intent: experience promises; Performance Evidence Candidates; section 16: Q-009, Q-028, Q-032, Q-080 and D-011)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Human Experience Propagation)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/08-mcp-skills-and-status.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/39-cli-command-model-and-operation-registry.md` (Installation State Commands)

### System Package Commands (v2.1)

In v2.1, the `run package` domain makes and takes in system packages. [20 System Packages](20-system-packages.md) owns what the commands do.

| Command | What it does | Kind | MCP tool | Profile |
| --- | --- | --- | --- | --- |
| `run package make <name> --system <system>... --version <version> [--title <text>] [--publisher <text>] [--facet <facet>]... [--tags] [--out <folder>] [--apply]` | Writes one bundle file from the named systems. Without `--apply`, a dry run that lists every source that will go out. | write | `package_make` | `analyze` |
| `run package add <bundle> [--apply]` | Takes a package in, or a new version of one. Without `--apply`, a dry run that shows the plan. | write | `package_add` | `intake` |
| `run package list` | Lists the packages that the project holds, with version, publisher and systems | read | `package_list` | `core` |
| `run package show <package>` | Shows one package: its records by type, and the records that the team changed | read | `package_show` | `core` |

Requirements:

- v2.0 has no `package` domain. The name is reserved: `make-blueprint run package` in v2.0 returns `failed` and says system packages come in v2.1.
- `package_make` and `package_add` are dry runs by default. A write needs both `apply: true` and `allowWrite`, as `import_v1` does. `run package make` and `run package add` are preview-first commands, as the root [CLI Write Intent](../../../../docs/prd/05-kit-conventions.md#cli-write-intent) section allows.

Code anchors:

- `docs/designs/2026-10-31-system-packages.md` (Decision)

### The `serve` Command (v2.2)

In v2.2, a person starts the local server for setup B, and later setup C, with the `serve` command. [18 Local Server and UI](18-local-server-and-ui.md) owns what the server does.

`make-blueprint serve` is a top-level lifecycle command beside `mcp`. Like `mcp`, it starts a long-running process, and a per-user server in setups B and C is not tied to one project folder. It sits outside the operation catalog and has no MCP tool. `serve` is a Make Blueprint command, and the core reserves no command name ([root Core Boundary](../../../../docs/prd/06-shared-core.md#core-boundary)). The root [CLI Top Level](../../../../docs/prd/05-kit-conventions.md#cli-top-level) section lets a kit add one top-level lifecycle command that starts a long-running process ([Q-101](03-open-questions-and-risk-register.md#q-101-long-running-lifecycle-command)).

Requirements:

- v2.0 has no `serve` command, option or MCP tool. `make-blueprint serve` in v2.0 returns `failed` and says the local server comes in v2.2.
- In v2.2, `serve` starts a server that listens only on the user's own machine and asks for no login, as [18 Local Server and UI](18-local-server-and-ui.md) defines.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 2: setups; section 7: CLI and MCP; section 14: UI; section 16: Q-049)
- `docs/prd/02-architecture-overview.md` (Topology)

### View-Model Calls (v2.2)

In v2.2, each UI view gets its data from one view-model read call. [18 Local Server and UI](18-local-server-and-ui.md) owns the list of views and the shape of a view model. The calls form one more `run` domain, `view`:

| Form | Pattern | Example |
| --- | --- | --- |
| CLI | `make-blueprint run view <view> [--filter <expr>] [--sort <field>] [--limit <n>] [--page <n>]` | `make-blueprint run view fit-gap --filter 'comparison:CMP-001 verdict:gap'` |
| Operation ID | `view.<view>` | `view.fit-gap` |
| MCP tool | `view_<view>`, in the `core` profile | `view_fit_gap` |
| MCP App resource | `ui://make-blueprint/<view>/v<N>.html`, in the `ui://<kit-cli>/` family of the root [Resource Identity](../../../../docs/prd/05-kit-conventions.md#resource-identity) tables, versioned like Make Docs' MCP App views | `ui://make-blueprint/fit-gap/v1.html` |

Requirements:

- v2.0 has no `view` domain.
- In v2.2, every view-model call is a `read` operation in the `core` profile and needs no `allowWrite`.
- A view-model call takes the shared filter syntax, and the CLI, the MCP tool and the local server return the same result object for the same input.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 14: UI)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp/resource-profiles.ts`

## Contracts and Data

### Operation Catalog Entry

Each catalog operation declares these facts. The CLI command, the MCP tool and the tests all come from them.

| Fact | Rule | Example |
| --- | --- | --- |
| Operation ID | `<domain>.<verb>`. The root [Run Command Paths](../../../../docs/prd/05-kit-conventions.md#run-command-paths) section owns the identifier form and the rule that identifiers are stable and append-only. | `compare.target-only` |
| CLI command | `project <verb>` or `resource <verb>` for those groups, and `run <domain> <verb>` for the nine run domains | `run compare target-only` |
| MCP tool name | The operation ID with each `.` and `-` replaced by `_`, which keeps the verb. This rule gives the one name map that the root [Run Command Paths](../../../../docs/prd/05-kit-conventions.md#run-command-paths) section asks for. | `compare_target_only` |
| Kind | `read`, `derived` or `write` | `write` |
| Profiles | One or more of `core`, `setup`, `intake`, `extract`, `analyze` | `analyze` |
| Input schema | Typed arguments shared by the CLI and MCP | `comparison` |
| Result schema | The typed `data` part of the result | the `target-only` records created and the stale ones marked `superseded` |
| Behavior owner | The PRD that defines what the operation does | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |

### Result Envelope

Every result, from the CLI or MCP, carries these fields. Envelope field names use camelCase, like Make Docs. Record fields inside `data` keep their front matter names, which are snake_case.

| Field | Holds |
| --- | --- |
| `ok` | `true` for `success`, `partial` and `blocked`, and `false` for `failed`, as in the root [Result and Error Shapes](../../../../docs/prd/05-kit-conventions.md#result-and-error-shapes). An MCP result of a `failed` call has no `ok` field and sets the MCP error flag. |
| `resultVersion` | The version of the envelope shape |
| `operation` | The operation ID, such as `project.status` |
| `outcome` | `success`, `partial`, `blocked` or `failed` |
| `summary` | One plain sentence that states the result |
| `dryRun` | Whether the call was a dry run |
| `changes` | Each record or file created, updated or taken out, with `id`, `ref`, project-relative path and the kind of change |
| `problems` | Each problem with a stable code, a severity (`error` or `warning`), a message, the record or path it concerns, and its fix when one exists |
| `nextAction` | A plain sentence, the reason, the exact CLI command, and the MCP tool name with its arguments |
| `data` | The operation's own result |

Problem codes are stable kebab-case strings. Each subject PRD names the codes for its checks, such as a ref clash or a broken link. This PRD names the surface codes: `unknown-command`, `unknown-record`, `ambiguous-ref`, `write-not-allowed`, `connection-not-recognized`, `not-set-up`, `unknown-filter-key`, `unknown-filter-value`, `sql-not-read-only` and `unknown-resource`. A `failed` result also carries `code`, the code of the problem that stopped the command, and `message`, as the root error shape needs. The envelope is published as a reference resource, so agents and tests can check results against it.

### Filter Grammar

```text
filter      = term { " " term }
term        = [ "-" ] ( match | link-match | presence | search )
match       = key ":" [ compare ] values
key         = "type" | "status" | "id" | "ref" | field | "facet." name
link-match  = "links:" link { "," link }
link        = record [ "#" position ]
position    = anchor { ":" anchor }
anchor      = kind "-" digits
compare     = ">" | ">=" | "<" | "<="
values      = value { "," value }
value       = word | '"' text '"'
presence    = "has:" field
search      = "text:" value
```

A `links` value may end in `#<anchor>` or in a table position to name one evidence link. A table position joins anchors with `:`, as in `#t-001:r-0012:c-003`. Only the first `:` of a term ends its key, so the `:` characters inside a table position belong to the value. `compare` applies only to date and number fields.

### Status Result

The `data` part of the `project.status` result holds one object for each section in [Project Status](#project-status): `project`, `sources`, `extraction`, `review`, `comparisons`, `needsAttention` and `nextActions`. Each count in it comes with the filter or command that lists the counted records, so an agent can go from a number to the records behind it in one call. `nextActions` is ordered, and its first entry is the result's `nextAction`.

### MCP Server Entry

These examples show the profile `all`, which `setup` writes when the person picks no profile.

Codex, in TOML:

```toml
[mcp_servers.make-blueprint]
command = "<path-to-make-blueprint>"
args = ["mcp", "--profile", "all"]
[mcp_servers.make-blueprint.env]
MAKE_BLUEPRINT_MCP_CONNECTION_ID = "<connection-id>"
MAKE_BLUEPRINT_MCP_CONNECTION_KEY = "<connection-key>"
```

Claude Code, in JSON:

```json
{
  "mcpServers": {
    "make-blueprint": {
      "command": "<path-to-make-blueprint>",
      "args": ["mcp", "--profile", "all"],
      "env": {
        "MAKE_BLUEPRINT_MCP_CONNECTION_ID": "<connection-id>",
        "MAKE_BLUEPRINT_MCP_CONNECTION_KEY": "<connection-key>"
      }
    }
  }
}
```

GitHub Copilot CLI uses the same JSON entry with `"type": "local"` and `"tools": ["*"]` added. The Store record for each connection holds the connection ID, the agent tool, whether it is active and the SHA-256 hash of the key.

### Resource URI

The root [Resource Identity](../../../../docs/prd/05-kit-conventions.md#resource-identity) tables own this form for every kit.

```text
make-blueprint://system/<type>/<path>
  type = contract | template | reference | prompt
  path = relative POSIX path with no "." or ".." segments
```

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 7: CLI and MCP; section 9: identity)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp/tools.ts` (`MCP_TOOL_NAME_BY_OPERATION`)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/harness-access/native.ts` (`desiredEntry`)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/operations/resource/identity.ts`

## Integrations

| Party | How this subsystem connects |
| --- | --- |
| Root [05 Kit Conventions](../../../../docs/prd/05-kit-conventions.md#purpose) | Owns the CLI and MCP rules for every kit. This PRD states the Make Blueprint commands, tools, profiles and output detail that follow those rules. |
| `packages/core` | Provides the MCP server base, the profile system, resource reading, the Store base and agent-tool setup, as the root [Core Boundary](../../../../docs/prd/06-shared-core.md#core-boundary) section states. Make Blueprint passes its own CLI name, tool names, profiles and URI scheme. See [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md). |
| Agent tools | Claude Code, Codex and GitHub Copilot CLI start `make-blueprint mcp` from the entry that `setup` writes, or run CLI commands in a shell. See [07 Installation and Distribution](07-installation-and-distribution.md). |
| Storage and index | Every write command goes through the storage interface, its lock and its journal. Filters, SQL and status read the derived index. In every file setup, each checkout has one write lock, shared by the CLI, the MCP server and the local server, which setup B adds. See [09 Storage and Indexing](09-storage-and-indexing.md). |
| Records and checks | `project check` runs the checks that [10 Records and Identity](10-records-and-identity.md) defines, and record arguments resolve `id`, `ref` and aliases by its rules. |
| Workflow PRDs | Each `run` domain's verbs behave as their subject PRD defines: [12 Source Intake and Conversion](12-source-intake-and-conversion.md), [13 Extraction and Review](13-extraction-and-review.md), [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), [15 Exports](15-exports.md) and [17 v1 Import](17-v1-import.md). |
| Stage skills | Each stage skill starts from `project status`, calls the commands of its stage, and points to resources by URI. Skills ship no scripts. See [16 Workflow and Skills](16-workflow-and-skills.md). |
| Make Docs | `project check` confirms work item IDs and doc paths through one Make Docs read command, as [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) defines. Make Docs 2.1.0 ships that command ([root Q-020](../../../../docs/prd/03-open-questions-and-risk-register.md#q-020-release-of-the-link-read-command)). Until `project check` uses that command, and whenever `make-docs` is not installed, it skips Make Docs links and reports how many it skipped. The skip is temporary and is tracked as [O-001](03-open-questions-and-risk-register.md#o-001-confirm-make-docs-links-in-project-check). Creating or changing work items stays a Make Docs job. Both servers can sit in one agent tool, and some tool names, such as `project_status` and `resource_read`, exist on both; tool titles and the server name tell them apart. |
| Local server and UI (v2.2) | `serve` starts the local server. Each view gets its data from one `run view` call (see [View-Model Calls (v2.2)](#view-model-calls-v22)), and [18 Local Server and UI](18-local-server-and-ui.md) names the views. MCP App views are served as `ui://make-blueprint/` resources by the same MCP server. |
| Later record types (v2.3) | Test case, run, result and playbook records use the `run record` verbs. Any stage verbs they need join this catalog with the v2.3 design. |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 6: runtime and shared core; section 12: relationship with Make Docs; section 14: UI)
- `docs/prd/02-architecture-overview.md` (Module Map, Runtime Boundaries)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp/server.ts`

## Rebuild Notes

- Build the CLI and the MCP tool list from one operation catalog, and test the match in both directions. Hand-written MCP handlers drift from the CLI.
- Keep operation logic in typed handlers that neither surface owns. The human renderer is CLI-only. MCP output and `--json` output are the same object.
- The MCP server must write only protocol messages to standard output. One stray log line on standard output breaks the agent tool's connection.
- Enforce the SQL guarantee twice: reject non-`SELECT` statements before they run, and open the index read-only so a statement that slips past the first check still cannot write.
- Status and `project check` must read the same problem facts. If status counts its own way, the two disagree and people stop trusting status.
- Status must stay fast, because agents call it often. Read counts from the index, and leave anchor-by-anchor resolution to `project check`, unless the index already holds what status needs.
- Agent tools may show a nonzero exit code as an error. The `outcome` field and the next action carry the meaning, so skills must read them rather than stop on the exit code.
- A `ref` can clash after a git merge. Every command that takes a record argument must handle an ambiguous `ref` with `blocked` and a fix, never by picking one record.
- Shell quoting differs across bash, zsh, PowerShell and cmd. Keep filter characters plain, allow repeated `--filter` flags, and test examples on all three operating systems.
- Never print or store the MCP connection key outside the agent tool's own config, and never compare keys with a plain string comparison.
- `make-blueprint://` is a new URI scheme. Keep it out of Markdown link targets in files that Make Docs also checks.
- Agent start time matters, because an agent may call the CLI many times in one task. The single-file start-time performance profile from the packaging work bounds it; see [07 Installation and Distribution](07-installation-and-distribution.md).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Performance Evidence Candidates; Consequences: trade-offs and risks)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp/tools.ts` (`verifyDerivedMcpToolParity`)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp-connection.ts` (`matchMcpConnection`)

## Requirement History

### 2026-11-01 — W1 R2

- Affected requirement or section: `Agent-Tool Registration`
- Previous contract: The Codex entry was the TOML table `[mcp_servers.make_blueprint]`. Every entry ran `["mcp"]`, and its arguments became `["mcp", "--profile", "<name>"]` only when the person picked a profile.
- Replacement contract: The entry name is `make-blueprint` in every agent tool, Codex included. Every entry runs `["mcp", "--profile", "<name>"]`, and `setup` writes `all` when the person picks no profile.
- Rationale: The root [MCP Server](../../../../docs/prd/05-kit-conventions.md#mcp-server) rule gives every kit one entry name and one argument form in every agent tool ([root D-025](../../../../docs/prd/03-open-questions-and-risk-register.md#d-025-agent-tool-entry-name-has-two-spellings), [root D-027](../../../../docs/prd/03-open-questions-and-risk-register.md#d-027-agent-tool-entries-always-run-profile-all)). A TOML bare key can hold `-`, so `[mcp_servers.make-blueprint]` is valid TOML.
- Source: [Make Blueprint Shared Rule Links Maintenance Plan](../plans/2026-11-01-w1-r2-shared-rules-links/00-overview.md)

### 2026-11-01 — W1 R2

- Affected requirement or section: `Outcomes and Exit Codes`
- Previous contract: `success` exited 0, `partial` 1, `failed` 2 and `blocked` 3 ([Q-010](03-open-questions-and-risk-register.md#q-010-exit-codes)). The result envelope had no `ok` field.
- Replacement contract: The exit codes follow the root [Exit-Code Table](../../../../docs/prd/05-kit-conventions.md#exit-code-table): `success` 0; `partial` and `blocked` 1; `failed` 2 when the command could not start its work and 1 for an internal fault. The envelope has `ok`, and a `failed` result on the CLI uses the root error shape on standard error.
- Rationale: A script that runs two kits reads one exit-code table. Skills read the `outcome` field, so a separate code for `blocked` adds little ([Q-096](03-open-questions-and-risk-register.md#q-096-exit-codes-follow-the-root-table)).
- Source: [Make Blueprint Shared Rule Links Maintenance Plan](../plans/2026-11-01-w1-r2-shared-rules-links/00-overview.md)

### 2026-11-01 — W1 R2

- Affected requirement or section: `Command Groups`
- Previous contract: Bare `make-blueprint` in a folder that is not set up named `make-blueprint setup`, never wrote and never offered to start setup.
- Replacement contract: On a TTY, bare `make-blueprint` in a folder that is not set up starts guided `setup`, which shows the full plan and asks before it writes. With no TTY, it prints a hint that names `make-blueprint setup` and exits 0.
- Rationale: A person who knows Make Docs gets the same first step from every kit, as the root [CLI Top Level](../../../../docs/prd/05-kit-conventions.md#cli-top-level) section states ([Q-098](03-open-questions-and-risk-register.md#q-098-bare-command-with-no-install)).
- Source: [Make Blueprint Shared Rule Links Maintenance Plan](../plans/2026-11-01-w1-r2-shared-rules-links/00-overview.md)

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/02-cli-and-packaging.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/08-mcp-skills-and-status.md`
- `docs/plans/2026-11-01-w1-r2-shared-rules-links/00-overview.md`
- `docs/prd/01-product-overview.md`
- `docs/prd/02-architecture-overview.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/cli.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/operations/mcp-metadata.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp/tools.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/mcp-connection.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/src/harness-access/native.ts`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/docs/prd/39-cli-command-model-and-operation-registry.md`
