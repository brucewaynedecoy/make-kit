---
title: "12 Source Intake and Conversion"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 12 Source Intake and Conversion

## Purpose

Make Blueprint turns each original file that a person brings to a project into a source record and a converted text. The source record names the file, holds its hash, says where the file lives, and tracks how far the file has moved through conversion and extraction. The converted text is one main Markdown file that people and agents read, plus one CSV file for each table that the converter extracts from the original. The Markdown file carries one stable anchor for each heading, paragraph, row and extracted table. Evidence links point to those anchors, or to a row, a column or a cell inside an extracted table. For a complex PDF, an agent can read the pages and write the text through a guided route, while the CLI adds the anchors and checks the text.

This subsystem owns the intake stage of the workflow, the converters built into the CLI, the agent route for complex PDFs, the anchor format and algorithm, the source git levels, and change detection for sources. It exists so that every extracted fact can point to one exact place in its source, and so that a person sees a clear flag when a source changed after a link to it was made.

## Scope

This PRD covers:

- The `run source` commands that register, convert, read and show sources.
- The type-specific fields of the source record and the values they take.
- The source git levels `all`, `converted` and `none`, which decide what git keeps of each source, and the missing state.
- Hashing of original files.
- Git LFS (a git add-on for big files) rules for large originals.
- Built-in converters for docx, xlsx, pptx, pdf, csv, md and txt files, with no outside tools.
- What happens to file types with no built-in converter, and to conversions that fail.
- The agent route for complex PDFs: when it is allowed, page batches, the CLI checks on the agent's text, and the conversion states before review accepts the text.
- Where converted text sits, the front matter it carries, and the CSV files that hold extracted tables.
- Anchors: their format, the rules every conversion follows to make them, positions inside extracted tables, and how a link to one is resolved.
- Change detection for sources, and the source part of the `project check` command.

These subjects are covered elsewhere:

- The evidence link format `SRC-<code>#<anchor>`, its validation, the shape of the `evidence` field on records, and how `project check` grades its findings belong to [10 Records and Identity](10-records-and-identity.md).
- The full field reference for the source record belongs to [11 Record Types Reference](11-record-types-reference.md).
- Turning a converted source into draft records, and the values of `extraction_status`, belong to [13 Extraction and Review](13-extraction-and-review.md).
- The review commands that accept an agent conversion or send its pages back belong to [13 Extraction and Review](13-extraction-and-review.md).
- The `blueprint-convert` skill, which guides an agent through the agent route, belongs to [16 Workflow and Skills](16-workflow-and-skills.md).
- The command grammar, the full `run source` verb list, the MCP tool list and the `project status` output belong to [08 CLI and MCP](08-cli-and-mcp.md).
- The `blueprint/sources/` folder, its routers and the project config file belong to [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md).
- Record writes, the short lock and the write journal belong to [09 Storage and Indexing](09-storage-and-indexing.md).
- Bundling the converters into the npm package and the signed single file belongs to [07 Installation and Distribution](07-installation-and-distribution.md).
- Turning v1 `references.json` entries into source records belongs to [17 v1 Import](17-v1-import.md).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 10: data model, evidence links, original files and local-only sources; section 11: conversion; section 16: Q-026, Q-028, Q-029, Q-038, Q-044, Q-061 and Q-080)
- `docs/prd/03-open-questions-and-risk-register.md` (Q-080, Q-082, Q-083, Q-084, R-024)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/05-intake-and-conversion.md`
- `blueprint/sources/`

## Component and Capability Map

| Component | What it does | Release |
| --- | --- | --- |
| Source intake | `run source add` registers original files as source records, hashes them and converts supported types | v2.0 |
| Built-in converters | One converter for each supported file type, compiled into the CLI | v2.0 |
| Supplied-text intake | Takes converted text from an agent or a person for a file the CLI cannot convert, and anchors it | v2.0 |
| Agent conversion route | Hands out the pages of a complex PDF in batches, takes the agent's Markdown and table CSV files, adds the anchors, and checks the text against the PDF's text layer | v2.0 |
| Anchor writer | Gives each heading, paragraph, row and extracted table its anchor during every conversion, and writes each extracted table to its own CSV file | v2.0 |
| Source reader | Reads a converted text one part or one anchor range at a time, and resolves one evidence link to its exact place | v2.0 |
| Change detector | Compares originals with their recorded hashes and flags evidence links that point to an old version | v2.0 |
| Source git levels | One project setting, which each source can override, that decides whether git keeps a source's original and its converted text | v2.0 |
| Git rules for sources | The managed `blueprint/sources/.gitignore`, which keeps files out of git by name or, at the project levels `converted` and `none`, by pattern, and the Git LFS rules in `blueprint/sources/.gitattributes` | v2.0 |

Each command named below is a `run source` verb or a `project` command. [08 CLI and MCP](08-cli-and-mcp.md) publishes the full verb list. The tools that add and convert sources, and the tools of the agent route, sit in the `intake` MCP profile.

### Source Intake

A person or agent puts original files in `blueprint/sources/`, or points `run source add` at files elsewhere. The command creates one source record for each original, records its hash, and converts it at once when the CLI has a converter for its type. A source record states that a file exists, not a claim about a system, so it is `active` from the start and does not wait for review. Its title defaults to the original file name.

Requirements:

- `run source add` accepts one or more files or folders. For a folder, it registers every file inside it that is not already a source.
- A file already under `blueprint/sources/` is registered where it is. A file outside `blueprint/sources/` is copied into it, keeping its file name. The command never moves or deletes the file outside the project. When the copy would clash with an existing file name, the command stops for that file and names the clash.
- The command never registers router files (`AGENTS.md`, `CLAUDE.md`), git rule files, or converted text files as sources. It recognizes a converted Markdown file by its front matter, and a table CSV file by the converted Markdown file that links to it, not by file name alone.
- Running `run source add` again on an original that is already a source, with the same bytes, changes nothing and reports the existing source by `ref`.
- When a file's hash matches an existing source at another path, the command creates no second record. It reports the existing source and the matching path.
- When one call registers many files, the call is one journaled change (see [09 Storage and Indexing](09-storage-and-indexing.md)). After a crash, the next command finishes or undoes it, so no source record is left without its original, and no original is left half-registered.
- The command reports, for each file, the source `ref`, its title, and its conversion status. It ends with a count by conversion status and the next useful action, such as supplying text for files that need it.

### Source Git Levels and the Missing State

A source's git level decides what git keeps of that source. The project sets one level, and each source can override it. All three levels ship in v2.0.

| Level | Original in git | Converted text in git | Use it for |
| --- | --- | --- | --- |
| `all` | Yes | Yes | The default. Every clone of the project holds the source. |
| `converted` | No | Yes | Originals that a client does not allow in git, or that are too large for it. People still read and link the converted text on every clone. |
| `none` | No | No | Content that must not reach git at all, such as secret content |

Files kept out of git stay at their normal paths under `blueprint/sources/`. Make Blueprint keeps them out of git with a managed `blueprint/sources/.gitignore`, a git ignore file that Make Blueprint writes and owns. At the project level `all`, it lists by name each file that a source's own level keeps out of git. At the project levels `converted` and `none`, it ignores originals by pattern and lists only the files to keep, so a file that a person copies into `blueprint/sources/` by hand is ignored at once, before `run source add` registers it. It uses no symlinks, so the same rule works on Windows, macOS and Linux.

Two limits apply. First, `converted` keeps the original's bytes out of git, but it does not keep the content secret, because the converted text holds the same words as the original. Secret content needs `none`. Second, a new level never removes a file from git history. When a source that git already tracks moves to a level that keeps it out of git, Make Blueprint warns that the file stays in git history, and it never rewrites history.

On a machine that does not hold a file kept out of git, the source shows as "missing". This is a normal state, not an error, because the same project can be cloned to machines that do and do not hold the file.

A person or agent sets a source's own level when the source is registered, with `run source add --git-level <level>`, and changes it later with `run source set-level <source>... <level>`. A level change takes effect at once and does not wait for review. A git level is a storage setting, not a claim from evidence, which is the same reason source records skip review. So a file meant for the level `none`, such as a secret original, is kept out of git as soon as its level is set.

Requirements:

- The project level is the setting `sources.git_level` in `.make/blueprint/config.yaml`, with the values `all`, `converted` and `none`. It is `all` when absent.
- A source's optional `git_level` field overrides the project level for that source. A source without the field follows the project level.
- `run source add --git-level <level>` gives each source it registers that level. It writes the source records and the managed `.gitignore` in the same journaled change, so a file meant for `none` is never registered at the project level first.
- `run source set-level <source>... <level>` writes each named source record and the managed `.gitignore` in one journaled change (see [09 Storage and Indexing](09-storage-and-indexing.md)), at once, with no review. This holds for every source record, because every source record is `active`.
- At the project level `all`, `blueprint/sources/.gitignore` lists by name exactly the files that source overrides keep out of git: the original of each source at `converted`, and the original and the converted text, table CSV files included, of each source at `none`.
- At the project levels `converted` and `none`, `blueprint/sources/.gitignore` ignores every file under `blueprint/sources/` by pattern and lists by name only the files to keep in git: the router files, the git rule files, the converted text and table CSV files of each source whose level is `all` or `converted`, and the original of each source whose level is `all`. A file that is not yet a source is therefore ignored at once.
- The list of files to keep names each file by its path, never by its extension, because an original can itself be a Markdown or CSV file.
- Make Blueprint keeps the `.gitignore` in step with the levels. `run source add`, `run source set-level` and any change to the project level update it in the same change.
- Make Blueprint writes git rules only inside `blueprint/sources/`. It never edits the project's root git files and never changes global git config.
- Availability is worked out on each machine and is never written into the record. A record file in git stays the same whether or not a given machine holds a file kept out of git.
- When a file kept out of git is absent, `project status`, `project check`, `run source list` and `run source show` show the source as missing. `project check` reports it as information, not as an error.
- Under `converted`, a machine without the original still holds the converted text, so evidence links to the source still resolve through the converted text.
- Under `none`, a machine without the files has no converted text either. An evidence link to that source shows as unavailable on this machine, not as broken. [10 Records and Identity](10-records-and-identity.md) owns the link states.
- `run extract next` hands out only `converted` sources whose converted text is on this machine (see [13 Extraction and Review](13-extraction-and-review.md)).
- A source at level `all` whose original is absent is an error. `project check` reports it as `source-file-missing`, because every clone should hold it.
- At the levels `converted` and `none`, a file copied in by hand does not show in `git status`. So `project check` reports each file in `blueprint/sources/` that no source record names, as the information code `source-unregistered`, with `run source add` as the next action. Router files (`AGENTS.md`, `CLAUDE.md`), converted text, table CSV files, files that converted text links to, such as the images that v1 converted text keeps beside it (see [17 v1 Import](17-v1-import.md)), and the managed `.gitignore` and `.gitattributes` files are not reported.

Work phase 05 builds a test for the pattern rule. At the project levels `converted` and `none`, the test copies a file into `blueprint/sources/` by hand, without `run source add`, and confirms that git ignores it.

### Hashing

The hash is the fingerprint that ties a source record, its converted text, its extractions and every evidence link to one exact version of the original.

Requirements:

- The hash is SHA-256 over the exact bytes of the original file, written as 64 lowercase hexadecimal characters.
- The source record keeps the hash in `sha256`. The main converted Markdown file keeps the same value in `source_sha256` in its front matter.
- `run source add` and `run source convert` compute the hash from the file on disk. After a source is registered, no other command changes `sha256`.
- Hashing reads files in a way that works for large originals, such as the 8 MB documents and 226 MB source folders seen on real projects, without loading a whole project into memory.

### Large Originals and Git LFS

Originals of 50 MB or more use Git LFS by default. Make Blueprint writes their Git LFS rules into `blueprint/sources/.gitattributes`, and each project can change the size limit. Git LFS applies only to originals that git tracks, which are the originals of sources at level `all`.

Requirements:

- The size limit is the project setting `sources.lfs_threshold_mb` in `.make/blueprint/config.yaml`, in megabytes, with the default `50`. An original at or above the limit is a large original.
- When Make Blueprint registers a large original that git tracks, it writes a Git LFS rule for that file into the managed `blueprint/sources/.gitattributes`. It never edits the project's root git files, never installs Git LFS, never runs `git lfs install`, and never changes global git config.
- An original that its level keeps out of git gets no Git LFS rule.
- `setup` asks no question about Git LFS, because the default and the size limit apply to every project.
- `project check` reports each large original that git tracks and that no Git LFS rule covers as the warning `source-no-lfs`. The warning names the file and how to track it.
- When an original is a Git LFS pointer file whose content was not fetched, `project check` reports the information code `source-lfs-not-fetched`. It does not report the source as changed.

When a client does not allow Git LFS, the project keeps its large originals out of git with the `converted` or `none` level (see [Source Git Levels and the Missing State](#source-git-levels-and-the-missing-state)).

### Built-In Conversion

The CLI converts docx, xlsx, pptx, pdf, csv, md and txt files with code built into the CLI. It needs no Python, no office suite and no other outside program, so conversion works with the signed single file on a locked-down machine and with no network connection.

Each converter writes one main Markdown file of converted text next to the original, plus one table CSV file for each table it extracts. The Markdown file keeps the content in reading order: headings, paragraphs, list items, the rows of tables that stay in the Markdown file, and a link to each extracted table at the place where the table sits. Each sheet, slide and page starts with a heading, so a reader can tell where each part of the original begins. [Parts and Anchors by File Type](#parts-and-anchors-by-file-type) lists what each converter treats as a part, a heading, a paragraph, a row and a table.

Which tables become CSV files:

- Each sheet of an xlsx original and each csv original always becomes a table CSV file.
- A table inside a document becomes a table CSV file when it has at least `conversion.table_csv_min_rows` rows. This project setting sits in `.make/blueprint/config.yaml`, and work phase 05 sets its default. A smaller table stays a Markdown table with row anchors.
- The built-in pdf converter finds no tables, so a table in a pdf converts as blocks of text. A pdf with tables, scanned pages or a complex layout can take the agent route instead (see [Agent Conversion for Complex PDFs](#agent-conversion-for-complex-pdfs)).

Requirements:

- Each of the seven types converts with no outside program and no network call.
- Each converter writes the converted text next to the original, with the front matter described in [Converted Text File](#converted-text-file), and sets the source's `conversion_status` to `converted`.
- Table CSV files use the same CSV rules as exports: UTF-8 with a byte order mark, commas, RFC 4180 quoting and LF line endings. They are written by the same CSV writer that [15 Exports](15-exports.md) uses.
- Converting the same original bytes with the same built-in converter version writes byte-identical converted text, table CSV files included. The converted text holds no timestamps or other values that change from run to run. This rule covers the built-in converters only. Agent text follows the rules in [Agent Conversion for Complex PDFs](#agent-conversion-for-complex-pdfs).
- `run source convert` on a source whose original and converter version have not changed writes no file, so git shows no diff.
- A converter that cannot read a file sets `conversion_status` to `failed` and records the reason, such as a pdf with no text layer. It writes no partial converted text.
- The built-in pdf converter reports trouble signals: a table, a scanned page with no text layer, or a complex layout. It names each signal with its pages and names the agent route as the next useful action. Work phase 05 sets the exact trouble signals.
- Writing the converted text and updating the source record happen as one change. After a crash, the next command finishes or undoes it, so a source record and its converted text never disagree about the hash.
- A newer converter version, shipped through `update`, does not rewrite existing converted text by itself. `project check` lists sources converted with an older converter version as information, with the command to convert them again. It never lists agent conversions this way.

Built-in pdf and pptx conversion may lose detail compared with outside tools, such as table layout in a pdf or the position of shapes on a slide. Extraction quality depends on it. Work phase 05 plans a Guided Progress Review: a reviewer compares converted pdf and pptx samples with their originals and records what is lost. Each confirmed loss is a current limit of the converters and belongs in this section. Converter fixtures for each file type and anchor stability tests are the automated evidence.

### Unsupported Types and Failed Conversions

Some originals have no built-in converter, such as images, email files, HTML, Visio drawings and older binary office formats. Some supported files fail to convert, such as a scanned pdf with no text layer. Both need an agent or a manual step. The agent or person reads the original, writes its text, and hands that text to the CLI, which adds the front matter and the anchors. A pdf can instead take the agent route, which works page by page and checks the text (see [Agent Conversion for Complex PDFs](#agent-conversion-for-complex-pdfs)).

Requirements:

- `run source add` registers an unsupported file as a source, records its hash, writes no converted text, and sets `conversion_status` to `needs-manual`.
- `run source convert` accepts supplied text for a source whose status is `needs-manual` or `failed`, or for any source when the caller asks to replace a poor conversion. The text arrives through an MCP tool argument or the CLI's standard input, so no side file is needed.
- The CLI anchors supplied text with the same rules as the md converter, writes it next to the original, sets `converter` to `manual`, and sets `conversion_status` to `converted`.
- `project status` counts sources that need manual text and sources whose conversion failed, and names the next useful action for them.
- `run extract next` does not hand out a source until its status is `converted` (see [13 Extraction and Review](13-extraction-and-review.md)).

Fixing a conversion means converting again or supplying new text through `run source convert`. People do not edit converted text by hand, because a hand edit breaks the rule that the same original and converter version give the same anchors.

### Agent Conversion for Complex PDFs

The built-in pdf converter finds no tables and cannot read a scanned page that has no text layer. For such PDFs, Make Blueprint offers a guided agent route. In an agent conversion, an agent reads the pages of the PDF and writes their text, and the CLI does every step that must give the same result each time. The CLI cannot call a model, and it holds no PDF table library. The `blueprint-convert` skill guides the agent through the route (see [16 Workflow and Skills](16-workflow-and-skills.md)).

The route works in page batches. A page batch is a few pages that the CLI hands out together. A large PDF never goes to the model in one piece, and work can resume after a stop.

Page splitting, the text-layer checks, anchors, hashes and change detection stay deterministic. Only reading the page is left to the model.

When the route is allowed:

- The route takes PDF originals only. `run source convert <source> --agent` refuses any other type and says why.
- The route starts without a reason when the built-in pdf converter reports a trouble signal for the file (see [Built-In Conversion](#built-in-conversion)). Otherwise a person asks for it with `--reason <text>`. The CLI refuses `--agent` with no trouble signal and no reason, and it keeps a given reason in the source record body.

Conversion states:

- The source record stays `active` through the whole route, because a source record states only that a file exists.
- Starting the route sets `conversion_status` to `agent-in-progress`. It stays there while page batches are out or still to be handed out.
- When every page is written, `conversion_status` becomes `awaiting-review`. Agent conversions are reviewed like drafts, with "unchecked" and flagged pages shown first (see [13 Extraction and Review](13-extraction-and-review.md#review)). Built-in conversions still skip review.
- Approval sets `conversion_status` to `converted`. Rejection sends the named pages, or every page, back to the agent with the reason, and sets `conversion_status` to `agent-in-progress` again.
- Extraction waits until the status is `converted`, so no record cites agent text that review has not accepted.
- `project status` counts sources in `agent-in-progress` and in `awaiting-review`, and names the next useful action for them: hand out the next page batch, or review the conversion.

Page batches:

- `run source pages-next <source>` hands out the next page batch as page numbers. The agent reads those pages from the original with its own tool.
- When the agent's tool cannot read a page range, `run source pages-next <source> --file` also writes a small PDF of only those pages to the machine folder `~/.make/blueprint/`. The CLI never writes this file into the project or into git.
- The CLI splits pages with the same JavaScript PDF reader that the built-in pdf converter uses, so the same original always gives the same pages.
- The CLI tracks which pages are out and which are written. A batch that was handed out and never written goes out again on a later call. Pages that review sends back go out again with the reviewer's reason.
- Work phase 05 sets the batch size. It also decides where the CLI keeps page progress: in the machine Store under `~/.make/blueprint/` (see [09 Storage and Indexing](09-storage-and-indexing.md)) or in the source record.

Writing pages:

- `run source pages-write <source> --pages <range>` takes the text of one batch: Markdown for the prose, and one CSV file for each table. The range names pages that are out in a batch.
- The agent keeps the meaning, links and footnotes of each page. It writes each table as a table CSV file in the layout of [Converted Text File](#converted-text-file). A nested table becomes one table CSV file for each level, joined by a key column.
- The agent writes no anchor markers and no front matter. The CLI writes the batch into the converted text next to the original, in page order, and starts each page with a heading from its page number. It then numbers the anchors over the whole converted text by the rules in [Anchor Format and Algorithm](#anchor-format-and-algorithm), and writes the table CSV files through the export CSV writer.
- The CLI confirms that the text covers every page in the range, and it refuses a batch that leaves out a page.
- Where a page has a text layer, the CLI compares the numbers and words in the agent's text with that text layer. It flags each value that the agent's text leaves out and each value that the text layer does not hold. A flag does not refuse the batch. Review shows it.
- A page with no text layer cannot be checked against one. The CLI marks it "unchecked".
- The same agent text and the same original always give the same anchors and the same flags.

Provenance:

- The source record names the converter as `agent`. It keeps the model name that the caller gives in `converter_model`, and the date of the last page batch the agent wrote in `converted_at`.

Repeat runs:

- An agent does not give the same text twice, so the same-text rule of the built-in converters does not apply. Accepted agent text is kept as it is, and it counts as `converted` while the original's hash matches `sha256`.
- `run source convert` makes agent text again only when a person asks, or when the original changes. A new model or a new CLI version never makes it again.
- Like all converted text, agent text is never edited by hand. A fix goes through review, which sends pages back to the agent, or through `run source convert`.

### Reading Sources and Following Evidence Links

An evidence link such as `SRC-4hd8x7k2#p-012` names a source by its `id` and a place in its converted text by its anchor, or by a position inside an extracted table, such as `SRC-4hd8x7k2#t-001:r-0012:c-003`. This subsystem owns the anchor half of the promise that a person follows any record's evidence link to the exact place in its source and sees a clear flag when the source changed after the link was made. [10 Records and Identity](10-records-and-identity.md) owns the link format and its validation. The standard behind the promise is the [Human Experience Contract](make-docs://system/contract/human-experience-contract.md).

Requirements:

- `run source show` takes a source or an evidence link. For an evidence link, it returns the source `ref` and title, the path of the original, the path of the converted text, the line number where the anchor sits, the part the anchor belongs to, and the text of the anchored element. For a position inside an extracted table, it also returns the path of the table CSV file and the values at that position.
- Human output prints the converted text location as `path:line`, so a person can open it in an editor. Machine output returns the same facts as fields.
- When the caller names the record the link comes from, as record detail and `run review show` do, and that record's links to the source were made against an older hash or an older converter version, the call says so in plain words, names the version the link was made against, and shows the current text at that anchor, if any, marked as coming from a newer version.
- When the anchor does not exist in the current converted text, the call says the anchor was not found and names the command to see the source's parts.
- When the original is not on this machine, the call says so. Under level `converted`, it still resolves the link through the converted text. Under level `none`, when the converted text is not on this machine either, it says that the link cannot be checked here.
- `run source read` returns the converted text of one part, or of one anchor range, with its anchors. Reading a table anchor returns that table's rows from its table CSV file. An agent can read a large source part by part without loading the whole file.
- Every anchor in an evidence link made against the current hash, converter and converter version resolves to exactly one element, and every table position resolves to exactly one table, row, column or cell.

Automated tests resolve anchors and table positions in converted fixtures of each file type, change a source and expect flagged links, and check the missing state for files kept out of git. Those tests are the planned evidence for this promise.

### Change Detection

A source changes when someone replaces or edits its original. The link between a record and its source stays meaningful only if Make Blueprint notices the change and tells people which links now point to an old version.

Requirements:

- `project check` hashes each available original and compares the result with the source's `sha256`. A difference is reported as "changed since conversion", with the source `ref` and the `run source convert` command that brings it up to date.
- `run source convert` on a changed original updates `sha256`, writes the new converted text, and reports how many evidence links, in how many records, now point to an old version.
- `project check` reports each evidence link whose recorded hash or converter version differs from the source's current values as pointing to an old version. Each finding names the record by `ref`, the link, and the source by `ref`.
- `project check` reports converted text whose front matter `source`, `source_sha256` or `converter_version` disagrees with its source record.
- An agent conversion is checked against `sha256` like any other source. When its original changes, `run source convert` makes its text again under the rules in [Agent Conversion for Complex PDFs](#agent-conversion-for-complex-pdfs). A new model or a new CLI version never flags agent text or the links made against it.
- When agent text takes the place of earlier converted text of the same source, links made against the earlier text point to an old version, as they do after a new converter version.
- `project status` counts sources changed since conversion and evidence links that point to an old version, and names the next useful action.
- A changed source becomes due for extraction again. [13 Extraction and Review](13-extraction-and-review.md) owns how `run extract next` handles it.

To make these checks possible, each record keeps, in `evidence_versions`, the hash, converter and converter version of each source its links were made against. [10 Records and Identity](10-records-and-identity.md) owns that field and the link states such as `old-version` and `broken`. After a person or agent has read the linked text again, `run record confirm-evidence` confirms a record's links to the source (see [08 CLI and MCP](08-cli-and-mcp.md)).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 10: evidence links, original files, local-only sources; section 11: conversion; section 16: Q-028 sources kept out of git, Q-029 Git LFS, Q-038 CSV rules, Q-061 CSV tables, Q-080 complex PDFs; Consequences: conversion quality, Git LFS limits)
- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Human Experience Intent: experience promises)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md` (Human Experience Propagation)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/05-intake-and-conversion.md` (Scope, Human Experience and Evidence, Testing Decisions)
- `docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md` (Human Experience Propagation)
- `blueprint/sources/`
- `blueprint/sources/.gitignore`
- `blueprint/sources/.gitattributes`
- `.make/blueprint/config.yaml`

## Contracts and Data

### Source Record Fields

A source record is a record file at `blueprint/records/source/<id>.md` with the common fields from [10 Records and Identity](10-records-and-identity.md) and the type-specific fields below. [11 Record Types Reference](11-record-types-reference.md) holds the full field reference.

| Field | Meaning | Set by |
| --- | --- | --- |
| `git_level` | Optional: `all`, `converted` or `none`. Overrides the project's `sources.git_level` for this source. Left out when the source follows the project level. See [Source Git Levels and the Missing State](#source-git-levels-and-the-missing-state). | A person or agent, through `run source add --git-level` or `run source set-level`, at once and with no review |
| `path` | Project-relative path of the original, with forward slashes, under `blueprint/sources/`. A file kept out of git keeps this same path. | `run source add` |
| `sha256` | SHA-256 of the original's bytes when it was last converted or registered | `run source add`, `run source convert` |
| `converted_path` | Project-relative path of the main converted Markdown file. The source's table CSV files sit beside it. Left out when there is none. | Conversion |
| `converter` | The converter that wrote the converted text: `docx`, `xlsx`, `pptx`, `pdf`, `csv`, `md`, `txt`, `manual`, `agent` or `v1`. `agent` marks converted text that an agent wrote through the agent route for complex PDFs. `v1` marks converted text that the v1 import keeps. | Conversion, the agent route for `agent`, or the v1 import for `v1` |
| `converter_version` | The version of that converter. For `agent`, the version of the CLI route that anchored and checked the text. A new CLI version does not change it on text that is already written. | Conversion |
| `converter_model` | Only for `agent`: the name of the model that wrote the text, as the caller gives it | The agent route |
| `converted_at` | Only for `agent`: the date of the last page batch the agent wrote | The agent route |
| `conversion_status` | See [Conversion Status Values](#conversion-status-values) | Conversion, the agent route and review |
| `extraction_status` | Where the source stands in extraction. [13 Extraction and Review](13-extraction-and-review.md) owns its values. | Extraction commands |

Paths in records use forward slashes on every operating system, so a record written on Windows reads the same on macOS and Linux.

### Conversion Status Values

| Value | Meaning |
| --- | --- |
| `converted` | Converted text exists and matches the recorded hash. Text from a built-in converter also matches the recorded converter version. |
| `needs-manual` | No built-in converter handles this type. An agent or a person must supply text. |
| `failed` | The built-in converter could not read the file. The reason is in the record body. An agent or a person can supply text. |
| `agent-in-progress` | The agent route is under way. Page batches are out or still to be handed out. Extraction waits. |
| `awaiting-review` | The agent has written every page. Review decides the conversion before extraction can use it (see [13 Extraction and Review](13-extraction-and-review.md#review)). |

The source record stays `active` in every conversion state. Two other states are worked out on each machine and never stored: "missing" for a source whose level keeps a file out of git and whose file is not on this machine, and "changed since conversion" for a source whose original no longer matches `sha256`.

### Converted Text File

The converted text sits next to the original. The main Markdown file's name is the original file name with `.md` after it, so `blueprint/sources/client/pricing.xlsx` converts to `blueprint/sources/client/pricing.xlsx.md`. Each extracted table sits beside it in its own table CSV file, named with the original file name, the table anchor and `.csv`, so the first sheet of that workbook becomes `blueprint/sources/client/pricing.xlsx.t-001.csv`. At the place of each extracted table, the main Markdown file holds an element that starts with the table's anchor and links to its table CSV file.

Converted text comes from a built-in converter, from supplied text, from the agent route for complex PDFs, which sets `converter` to `agent` (see [Agent Conversion for Complex PDFs](#agent-conversion-for-complex-pdfs)), or from the v1 import, which keeps v1 converted text and sets `converter` to `v1` (see [17 v1 Import](17-v1-import.md)). Text with `converter: agent` or `converter: v1` was not written by a built-in converter. Like all converted text, table CSV files included, it is never edited by hand.

Agent text has the same layout as any converted text: one main Markdown file with the CLI's anchors, and one table CSV file for each table. Each level of a nested table is its own table CSV file with its own table anchor, and each file holds the key column that joins it to the level above. The model name and the date stay in the source record, so the converted text holds no date.

A table CSV file carries no front matter and no anchor markers, so its values stay exact. Its first row is the header row.

The main Markdown file's front matter carries:

| Key | Meaning |
| --- | --- |
| `source` | The source record `id` |
| `source_sha256` | The hash of the original this text was made from |
| `converter` | The converter name, as in the source record |
| `converter_version` | The converter version, as in the source record |
| `parts` | The parts of the source in reading order, each with a label (such as a sheet name or slide number) and the anchor that starts it, as [Parts and Anchors by File Type](#parts-and-anchors-by-file-type) defines |

```yaml
---
source: "SRC-4hd8x7k2"
source_sha256: "<64 lowercase hexadecimal characters>"
converter: "xlsx"
converter_version: "1"
parts:
  - label: "Sheet: Pricing"
    anchor: "h-001"
  - label: "Sheet: Terms"
    anchor: "h-002"
---
```

The source record's `id`, not its `ref`, names the source here, because a `ref` can change after a ref clash is fixed.

### Anchor Format and Algorithm

An anchor names one element of a converted text. An evidence link joins a source `id` and an anchor with `#`, as in `SRC-4hd8x7k2#p-012`.

The anchor format is a kind code, a hyphen, and a number. A row number has at least four digits. Every other number has at least three:

| Kind code | Element | Example |
| --- | --- | --- |
| `h` | A heading, including the heading that starts each sheet, slide or page | `h-003` |
| `p` | A paragraph, including a list item, a text box, speaker notes or an image placeholder | `p-012` |
| `r` | A row of a table that stays in the Markdown file | `r-0457` |
| `t` | An extracted table, whose rows sit in its own table CSV file | `t-001` |

Every conversion follows these rules:

- The converter walks the converted text in reading order and numbers each kind on its own, starting at 1. The twelfth paragraph is `p-012`, whatever headings, rows and tables sit around it. Numbers grow past their minimum when a file needs them, as in `p-1204` and `r-10457`.
- Anchors are unique within one converted text.
- Each anchor is written into the main Markdown file at the start of its element, so a plain text search for the anchor's marker finds exactly one place.
- The marker is an empty HTML anchor whose `id` is the anchor, as in `<a id="p-012"></a>`, at the start of each element. Make Blueprint uses this marker only in its converted sources. Make Docs docs never use it.
- The same original bytes and the same converter version always give the same anchors.
- A new converter version may move anchors. Links made with the older version are then flagged by `project check` (see [Change Detection](#change-detection)).
- A changed original may move anchors. Links made against the older hash are then flagged the same way.

A table CSV file holds no markers, so a link reaches a place inside an extracted table by its position:

| Link | Points to |
| --- | --- |
| `SRC-4hd8x7k2#t-001` | The whole table |
| `SRC-4hd8x7k2#t-001:r-0012` | The twelfth data row |
| `SRC-4hd8x7k2#t-001:c-003` | The third column |
| `SRC-4hd8x7k2#t-001:r-0012:c-003` | One cell: the third column of the twelfth data row |

Rows count from the first data row, so the header row is not counted. Columns count from the first column. A row position has at least four digits, like a row anchor, and a column position has at least three. Positions stay valid for the same reason anchors do: the same original bytes and the same converter version always give the same table CSV file, and `project check` flags links made against an older version. [10 Records and Identity](10-records-and-identity.md) owns the link forms and their `malformed` and `broken` states.

### Parts and Anchors by File Type

A part is a natural division of the original, such as a sheet, a slide, a page or a top-level section. Extraction records coverage and outcome for each part (see [13 Extraction and Review](13-extraction-and-review.md)).

| Type | Part | Headings (`h`) | Paragraphs (`p`) | Rows (`r`) | Tables (`t`) |
| --- | --- | --- | --- | --- | --- |
| docx | Each section under the highest heading level used, or the whole file when it has no headings | Document headings | Paragraphs, list items, image placeholders | Rows of tables that stay in the Markdown file | Tables that reach the size setting |
| xlsx | Each sheet, hidden sheets included and marked as hidden | One per sheet, from the sheet name | None | None. The sheet's rows that have a value are row positions in its table CSV file. | One per sheet |
| pptx | Each slide | One per slide, from the slide number and title | Text boxes, list items, speaker notes | Rows of tables that stay in the Markdown file | Tables that reach the size setting |
| pdf | Each page | One per page, from the page number | Blocks of text | None | None. The built-in pdf converter finds no tables. |
| csv | The whole file | None | None | None. The file's records are row positions in its table CSV file. | One, for the whole file |
| md | As docx | Markdown headings | Paragraphs, list items | Rows of tables that stay in the Markdown file | Tables that reach the size setting |
| txt | The whole file | None | Blocks separated by blank lines | None | None |
| manual | As md | As md | As md | As md | As md |
| agent | Each page | One per page, from the page number | Paragraphs, list items, footnotes | None. Every table is a table CSV file. | Each table, one for each level of a nested table |

The size setting is `conversion.table_csv_min_rows` (see [Built-In Conversion](#built-in-conversion)). A file with no headings has one part, labeled with its file name, that starts at its first anchor. That anchor can be a table anchor, as for a csv original, whose one part starts at `t-001`. An extracted table, with every position inside it, belongs to the part that holds its table anchor.

### Commands

| Command | What it does | MCP profile |
| --- | --- | --- |
| `run source add [--git-level <level>]` | Registers files or folders as sources and converts supported types. `--git-level` gives each new source its own git level. | `intake` |
| `run source set-level <source>... <level>` | Sets the git level of one or more sources, and writes the source records and the managed `.gitignore` in one journaled change, at once, with no review | `intake` |
| `run source convert` | Converts a source again, or takes supplied text for it | `intake` |
| `run source convert <source> --agent [--reason <text>]` | Starts the agent route for one PDF. `--reason` is required when the built-in converter reports no trouble signal. | `intake` |
| `run source pages-next <source> [--file]` | Hands out the next page batch. `--file` also writes a PDF of only those pages to `~/.make/blueprint/`. | `intake` |
| `run source pages-write <source> --pages <range>` | Takes one batch's Markdown and table CSV files, writes them into the converted text with anchors, and runs the CLI checks | `intake` |
| `run source list` | Lists sources with git level, availability, conversion status and extraction status, using the shared filter syntax | `intake`, `core` |
| `run source show` | Shows one source, or resolves one evidence link to its exact place | `intake`, `core` |
| `run source read` | Returns the converted text of one part or one anchor range | `intake`, `core` |
| `project check` | Includes the source checks in this PRD | `core` |

[08 CLI and MCP](08-cli-and-mcp.md) owns the final verb names, the MCP tool names and which profiles list each tool. Write tools need `allowWrite`.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 9: identity; section 10: data model; section 16: Q-026 anchor marker, Q-044 v1 converted text, Q-061 CSV tables; Left for planning: the anchor algorithm)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/05-intake-and-conversion.md` (Deliverables: the anchor algorithm)
- `blueprint/records/source/<id>.md`
- `blueprint/sources/`
- `blueprint/sources/<original>.md` and `blueprint/sources/<original>.t-001.csv`
- `~/.make/blueprint/` (page-range PDFs of the agent route)
- `<user-home>/Developer/Source/Tyler/Projects/build-os/toolkits/buildos-intake/internal/intake/convert.go`

## Integrations

| Integration | Connection |
| --- | --- |
| [09 Storage and Indexing](09-storage-and-indexing.md) | Source records are written through the storage interface. Registering many files and writing a converted text with its record are journaled changes. The managed `blueprint/sources/.gitignore` and `.gitattributes` are files that Make Blueprint writes outside `blueprint/records/`. The index can keep the last size and modified time of each original so `project check` can skip hashing files that have not changed. The page-range PDFs of the agent route sit in the machine folder `~/.make/blueprint/`, never in the project. |
| [10 Records and Identity](10-records-and-identity.md) | Owns the evidence link format, including the table, row, column and cell positions, the `evidence` and `evidence_versions` fields, link states, link confirmation and `project check` grading. This PRD supplies anchor and position resolution and each source's current hash, converter and converter version, which `evidence_versions` is compared with. |
| [11 Record Types Reference](11-record-types-reference.md) | Holds the full field reference for the source record, including `git_level`, the `converter` value `agent`, `converter_model` and `converted_at`. |
| [13 Extraction and Review](13-extraction-and-review.md) | Uses the parts list, `run source read` and the resolved evidence text. `run extract next` hands out only sources whose `conversion_status` is `converted` and whose converted text is on this machine. Extraction commands set `extraction_status`. Review decides agent conversions in `awaiting-review`: approval sets `converted`, and rejection sends pages back to the agent. |
| [08 CLI and MCP](08-cli-and-mcp.md) | Owns the command grammar, the final names of the agent route commands and of the MCP tools `source_pages_next`, `source_pages_write` and `source_set_level`, the `intake` and `core` profiles, `allowWrite`, the filter syntax, and the `project status` output that shows the source counts from this PRD. |
| [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) | Owns the `blueprint/sources/` folder, its routers and the project config file `.make/blueprint/config.yaml`, which holds `sources.git_level`, `sources.lfs_threshold_mb` and `conversion.table_csv_min_rows`. |
| [07 Installation and Distribution](07-installation-and-distribution.md) | Bundles the converters into the npm package and the signed single file. Owns `setup`, which asks no Git LFS question, because the Git LFS default and size limit from this PRD apply to every project. |
| [15 Exports](15-exports.md) | Owns the CSV rules and the CSV writer that table CSV files share with exports. |
| [16 Workflow and Skills](16-workflow-and-skills.md) | The intake skill guides people and agents through this subsystem. The `blueprint-convert` skill serves the intake stage and guides an agent through the agent route for complex PDFs. |
| [17 v1 Import](17-v1-import.md) | Turns v1 `references.json` entries and converted twins into source records, and keeps v1 converted text with `converter` set to `v1`. |
| Git and Git LFS | Git holds the originals of sources at level `all` and the converted text of sources at `all` and `converted`. Git LFS holds originals at or above the size limit that git tracks. Make Blueprint writes `blueprint/sources/.gitignore` and `.gitattributes`, and reads git attributes to see which files Git LFS covers. |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 4: project and machine layout; section 8: storage)
- `docs/prd/02-architecture-overview.md` (Configuration Surfaces: git rules for sources)
- `.make/blueprint/`
- `blueprint/sources/`

## Rebuild Notes

A clean-room rebuild must preserve these properties:

- Built-in converted text is a pure function of the original bytes and the converter version. Timestamps, random values, map ordering and locale settings must not reach the output. Without this, anchors move on every run and every evidence link looks stale. The rule covers table CSV files too, which share the CSV writer and CSV rules of exports.
- Agent text is not repeatable, so accepted agent text is kept as it is and made again only when a person asks or the original changes. Page splitting, anchors and the text-layer checks stay pure functions of the original and the agent's text, so the CLI half of the route gives the same result every time.
- Every link can be compared with the exact hash, converter and converter version it was made against, through the record's `evidence_versions`. Without these values, `project check` cannot tell an old link from a current one.
- The missing state is worked out on each machine. Writing it into a record would make record files differ between machines and produce noisy git diffs.
- Make Blueprint writes git rules only inside `blueprint/sources/`, which it owns, and never touches the project's root git files or global git config.
- Converters are plain TypeScript bundled into the CLI. A converter that shells out to an outside program breaks the one-install principle and fails on locked-down machines.

Places where implementers are likely to make mistakes:

- **Counting rows.** Decide and test how header rows, empty rows, merged cells and hidden rows count, for csv, xlsx and document tables alike, and which row of a sheet or table becomes the header row of its table CSV file. Row positions never count the header row. A change to these rules is a new converter version.
- **Table CSV files.** Write them through the export CSV writer, with no anchor markers or other extra text, so a position link reaches the exact value in the original. Write the main Markdown file and every table CSV file of one source in the same change.
- **Cell values.** For xlsx, write the value a person sees, such as a formula's cached result and a formatted date, not the raw formula or serial number.
- **pdf text.** Repeated page headers and footers, two-column layouts and hyphenated line breaks change paragraph counts. A pdf with no text layer is a failed conversion, not an empty success.
- **md originals.** An original Markdown file may carry its own front matter or HTML. Keep that content in the body as text, so the converted text has exactly one front matter block and anchor markers stay unique.
- **Git LFS pointers.** A pointer file whose content was not fetched has a different hash from the real file. Report it as not fetched, not as a changed source.
- **Ignore patterns.** Git cannot keep a file whose folder an ignore pattern already excludes. At the levels `converted` and `none`, ignore files, not folders, so the list of files to keep works for files in subfolders.
- **Agent text on update.** A new model or a new CLI version must not convert agent text again or flag its links. Only a person's request or a changed original makes it again.
- **Large files.** Hash and convert by streaming. A project of 280 sources and 226 MB of originals must not need all of them in memory at once.
- **Windows paths.** Store forward-slash, project-relative paths, and compare file names in a way that handles case-insensitive file systems.

How this differs from BuildOS v1, for readers who know it:

- v1 converted supported types with a separate Go tool and wrote one converted twin for each sheet of a workbook. Make Blueprint converts inside its one CLI and writes one main Markdown file for each source, with each sheet as a part whose rows sit in a table CSV file.
- v1 kept all sources in one index file, `.os/indexes/references.json`, with `REF-NNN` IDs. Make Blueprint keeps one source record file for each source, named by its `id`.
- v1 converted twins carried a conversion timestamp in their front matter. Make Blueprint's converted text carries no timestamp, so the same input gives the same bytes.
- v1 converted HTML. The Make Blueprint built-in set does not include HTML, so an HTML original needs supplied text.
- v1 had a multi-modal model read complex PDFs and write Markdown or CSV, with no skill to guide it and no checks. Make Blueprint keeps the model for reading the page, guides it with the `blueprint-convert` skill, hands out pages in batches, checks the text in the CLI, and sends it to review.
- v1 let an extraction agent repair conversion loss by editing a converted twin. Make Blueprint fixes conversion loss through `run source convert`, either by converting again or by taking supplied text.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Consequences: conversion quality, file count, Git LFS limits)
- `<user-home>/Developer/Source/Tyler/Projects/build-os/toolkits/buildos-intake/internal/intake/convert.go`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/toolkits/buildos-intake/internal/intake/xlsx.go`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/toolkits/buildos-intake/internal/intake/pdf.go`

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/05-intake-and-conversion.md`
- `docs/prd/01-product-overview.md`
- `docs/prd/02-architecture-overview.md`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/toolkits/buildos-intake/internal/intake/convert.go`
- `<user-home>/Developer/Source/Tyler/Projects/build-os/toolkits/buildos-intake/internal/intake/types.go`
