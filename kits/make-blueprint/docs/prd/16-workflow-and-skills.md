---
title: "16 Workflow and Skills"
kind: "prd"
status: "active"
source:
  type: "plan"
  path: "docs/plans/2026-10-30-w1-r1-make-blueprint-v2-maintenance/00-overview.md"
---

# 16 Workflow and Skills

## Purpose

Make Blueprint organizes project work into seven stages: intake, extract, review, model, compare, place and hand off. Each stage has one skill. Two more skills serve stages without being stages of their own. `blueprint-convert` serves the intake stage: it guides the agent through converting a complex PDF. `blueprint-report` serves the model, compare and place stages: it turns their records into export files. A skill is a short guide, installed into the person's agent tool, that tells the agent how to do one job with Make Blueprint commands. The agent tool is the main way people use Make Blueprint, so the skills are the main path through the product.

This PRD owns the seven stages as a workflow, the job of each of the nine skills, and the rules every skill follows. It exists so that every skill owns one clear job, works on a locked-down machine, and reaches the product only through the Make Blueprint CLI or MCP server.

## Scope

This PRD covers:

- The seven workflow stages, their order, and when each one can start.
- One skill for each stage, and the `blueprint-convert` and `blueprint-report` skills: each skill's job, its inputs, the commands and MCP profile it uses, and when it is done.
- The rules every skill follows: no scripts, only CLI or MCP calls, shipped inside the CLI, installed by `setup`.
- The rule that the BuildOS v1 skills are input only, used to list the jobs worth keeping.

These subjects are covered elsewhere:

- What each stage does to records belongs to the stage's owning PRD: intake to [12 Source Intake and Conversion](12-source-intake-and-conversion.md); extract and review to [13 Extraction and Review](13-extraction-and-review.md); model, compare, place and the hand-off boundary to [14 Fit-Gap and Placement](14-fit-gap-and-placement.md). How integration records are used across the stages belongs to [19 System Integrations](19-system-integrations.md).
- Make Docs links, their format and their check belong to [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md).
- The command grammar, the verbs of each `run` domain, MCP tool names, profile membership, `allowWrite` and `project status` belong to [08 CLI and MCP](08-cli-and-mcp.md).
- Installing, updating and removing skills in each agent tool belongs to [07 Installation and Distribution](07-installation-and-distribution.md).
- The routers and managed blocks that point agents to the skills belong to [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md).
- Export files belong to [15 Exports](15-exports.md).
- The v1 import, which no skill owns, belongs to [17 v1 Import](17-v1-import.md).

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 1: Northstar principles 2 and 6; section 11: workflow and skills)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/08-mcp-skills-and-status.md`

## Component and Capability Map

### The Seven Stages

| Stage | What happens | Starts when | Main records | Owner |
| --- | --- | --- | --- | --- |
| Intake | Add sources and convert them to text with anchors | A person has original files | source | [12 Source Intake and Conversion](12-source-intake-and-conversion.md) |
| Extract | Turn one source at a time into draft records, with coverage for each part | A source is converted and due | extraction, system, domain, capability, requirement, persona, finding, and `integration` for current integrations | [13 Extraction and Review](13-extraction-and-review.md) |
| Review | Make draft records `active` or `rejected`, and approve or reject pending changes to active records | Drafts or pending changes are waiting | any draft record; any record with a pending change | [13 Extraction and Review](13-extraction-and-review.md) |
| Model | Clean up systems, capabilities and domains | Active records exist for the systems in scope | system, capability, domain | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) |
| Compare | Create fit-gap records inside a comparison | The target and baseline systems have active capabilities | comparison, fit-gap, and `integration` for planned integrations | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), [19 System Integrations](19-system-integrations.md) |
| Place | Create placement records | Active fit-gap records exist | placement, and `integration` for planned integrations | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), [19 System Integrations](19-system-integrations.md) |
| Hand off | Link placements to Make Docs work items and docs | Active placement records exist | placement | [14 Fit-Gap and Placement](14-fit-gap-and-placement.md), [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) |

The stages run in this order the first time through a project. After that, people return to any stage at any time. New sources arrive in the middle of a comparison, and a model clean-up can follow a fresh review. The `project status` command (see [08 CLI and MCP](08-cli-and-mcp.md)) names the next useful action, so a person or agent can always tell which stage to run next.

Every task in the seven stages completes with no server and no UI running.

A pending change is a proposed fix to a fact on an `active` record. The record keeps its old value until a reviewer decides. An approved change is written into the same record file, so its `id`, `ref` and links stay the same. [13 Extraction and Review](13-extraction-and-review.md) owns pending changes.

### Stage Skills

Make Blueprint ships exactly nine skills in v2.0: one for each of the seven stages, `blueprint-convert` and `blueprint-report`. Neither `blueprint-convert` nor `blueprint-report` is a stage of its own. `blueprint-convert` serves the intake stage: it guides the agent route, which converts a complex PDF a few pages at a time and which [12 Source Intake and Conversion](12-source-intake-and-conversion.md) owns. `blueprint-report` serves the model, compare and place stages: it drafts the prose that the exports show into records, and it writes the export files from those records. Each skill name starts with `blueprint-`, so no Make Blueprint skill folder has the same name as a Make Docs skill folder. The nine names below are fixed.

| Stage | Skill | Job | MCP profiles |
| --- | --- | --- | --- |
| Intake | `blueprint-intake` | Get each original file to a source record with converted, anchored text | `intake`, `core` |
| Intake (complex PDFs) | `blueprint-convert` | Take one complex PDF through the agent route, one page batch at a time, until every page is written and the converted text waits for review | `intake`, `core` |
| Extract | `blueprint-extract` | Work through one source at a time and record draft records and coverage for every part | `extract`, `core` |
| Review | `blueprint-review` | Bring each draft, pending change and agent conversion in scope to a decision, on a person's word | `extract`, `analyze`, `core` |
| Model | `blueprint-model` | Make systems, capabilities and domains clean enough to compare | `analyze`, `core` |
| Compare | `blueprint-compare` | Score every baseline capability in a comparison with the fit-gap method and list target-only capabilities | `analyze`, `core` |
| Place | `blueprint-place` | Record the owning system and delivery for each fit-gap in scope | `analyze`, `core` |
| Hand off | `blueprint-hand-off` | Link placements to Make Docs work items and docs | `analyze`, `core` |
| Model, compare and place (their exports) | `blueprint-report` | Draft export prose into records, with a checklist that matches the export layout, and write the exports | `analyze`, `core` |

The `all` profile, which is the default, holds every tool each skill needs. A skill names narrower profiles so that a person who configured a short tool list knows what to turn on.

The commands named in each skill below are `run` verbs and `project` commands. [08 CLI and MCP](08-cli-and-mcp.md) publishes the final verb list and the matching MCP tool names. Skill content is written against that list.

### Intake Skill

- **Job:** take the files a person names and get each one to a source record whose converted text has anchors, or tell the person clearly why it cannot be converted yet.
- **Inputs:** files or folders the person names, inside or outside `blueprint/sources/`.
- **Commands:** `run source add`, `run source convert` (including supplied text for unsupported types), `run source list`, `run source show`, `project check`, `project status`.
- **Agent work:** for a file with no built-in converter, or a failed conversion, the agent reads the original if it can, writes its text, and passes that text to `run source convert`. The CLI adds the front matter and anchors. When the built-in converter reports a trouble signal on a PDF, or the person asks for the agent route, the skill hands that source to `blueprint-convert`.
- **Done when:** every named file has a source record; each one is `converted`, is on the agent route with `blueprint-convert`, or is reported to the person as needing manual text or as failed, with the next step; and `project check` reports no source errors for those files.

### Convert Skill

- **Job:** take one complex PDF through the agent route, so that its converted text keeps the meaning, links, footnotes and table data of the original, and then hand the text to review. The CLI cannot call a model. So the agent reads the pages, and the CLI does the rest: it splits the pages, tracks which pages are done, adds the anchors and checks the text. [12 Source Intake and Conversion](12-source-intake-and-conversion.md) owns the route.
- **When the route is allowed:** only for a PDF, and only when the built-in converter reported a trouble signal or the person asks for the route. A trouble signal is a table, a scanned page with no text layer, or a complex layout, and 12 owns the exact signals. With no trouble signal, the skill starts the route only on the person's word, and it passes on the person's reason, because `run source convert --agent` then needs `--reason`. For any other file type, the skill hands back to the intake skill.
- **Inputs:** one PDF source that the intake skill hands over, or that the person names.
- **Commands:** `run source convert <source> --agent [--reason <text>]`, `run source pages-next <source> [--file]`, `run source pages-write <source> --pages <range>`, `run source show`, `project status`.
- **Page batches:** the agent works on one page batch at a time. A page batch is the few pages that `run source pages-next` hands out. The agent reads only those pages from the original with its own tool, and it writes their text with `run source pages-write` before it takes the next batch. It never sends the whole PDF to the model at once. When its tool cannot read a page range, the agent calls `run source pages-next` with `--file`, and the CLI writes a small PDF of only those pages to `~/.make/blueprint/`, never into git. While batches are out, the source's `conversion_status` is `agent-in-progress`, and the source record stays `active`. The CLI tracks which pages are done, so after a stop the agent, or a new session, calls `run source pages-next` again and carries on from the next page that is not done.
- **Keeping meaning:** the agent writes what each page says, in reading order: Markdown for prose and CSV for tables. It does not summarize, reword, correct or add values. It keeps every heading, list, link and footnote, with each link's target and each footnote's marker and text. It writes no anchors and no front matter, because the CLI adds them.
- **Nested tables:** each table becomes a table CSV file, as 12 defines. A nested table becomes one CSV file for each level, joined by a key column, so each row of an inner table names the row of the outer table that holds it.
- **CLI checks:** `run source pages-write` adds the anchors and confirms that the batch covers its pages. Where the PDF has a text layer, it compares numbers and words against that layer and flags missing or invented values. A page with no text layer cannot be checked, so the CLI marks it "unchecked". The agent passes every flag and every "unchecked" page on to the person.
- **Hand-off to review:** when every page is written, the source's `conversion_status` is `awaiting-review`, and the skill hands over to `blueprint-review`. The agent never approves its own conversion. Review shows "unchecked" and flagged pages first. Approval sets the source `converted`, and extraction can start only then. A rejection sends the named pages, or every page, back to the agent route with the reviewer's reason. The skill takes those pages up again from `run source pages-next` and writes them again with the reason in mind. [13 Extraction and Review](13-extraction-and-review.md) owns the review.
- **Done when:** every page of the PDF is written, the source is `awaiting-review`, and the skill has reported the flagged and "unchecked" pages and handed over to the review skill. After a rejection, the skill is done when the pages sent back are written again and the source is `awaiting-review` once more.

### Extract Skill

- **Job:** take one source at a time from `run extract next`, read it part by part, create draft records with evidence links to anchors, add evidence to existing records where they already cover a claim, and record coverage and outcome for every part.
- **Inputs:** the source and parts that `run extract next` hands out, or a source the person names. For bulk work, the number of sources the person asks for.
- **Commands:** `run extract next`, `run extract show`, `run source read`, `run extract add`, `run extract link`, `run extract part`, `run extract finish`, `project status`.
- **Agent work:** the agent reads each part, decides what is a requirement, a capability, a persona, a system, a domain, a finding or a current integration, and weighs the duplicate hints the CLI shows before each new record. Open questions become finding drafts of kind `question`. A flow of data or events that one system sends to another today becomes an `integration` draft with state `current` and evidence links, one draft for each direction (see [19 System Integrations](19-system-integrations.md)).
- **Done when:** each extraction the skill opened is finished and `run extract finish` accepted it, and the skill has reported parts by coverage, drafts by type and records that gained evidence. In bulk work, the skill is done when the requested number of sources is finished or no source is due.

Several agents can run the extract skill at once. Each one calls `run extract next` under its own name and gets a different source. An agent that calls it again under the same name gets its own open extraction back, so it resumes rather than starting a second source.

### Review Skill

- **Job:** show a person each draft, and each pending change to an active record, beside the source text its evidence points to, and record the person's decision to approve or reject it.
- **Inputs:** the drafts and pending changes waiting for review, from one extraction, from a filter, or from the compare, place and report work, which also create drafts and pending changes. Also the sources whose agent conversion waits for review, from `blueprint-convert`.
- **Commands:** `run review list`, `run review show`, `run review approve`, `run review reject`, `run source show`, `project status`. The review commands decide drafts and pending changes alike; [13 Extraction and Review](13-extraction-and-review.md) owns their exact shape for pending changes.
- **Agent work:** the agent may recommend a decision and point out duplicate hints and weak evidence. For a pending change, it shows the old value beside the proposed one. It takes flagged records first, and for a fit-gap draft it shows the rubric that `run review show` returns. It calls approve or reject only on a person's decision, or when the person has told it to decide. It records the person's name as reviewer, or its own name when the person delegated the decision. A rejection always carries the person's reason.
- **Agent conversions:** `run review list` shows a source in `awaiting-review` beside the drafts. The agent shows its converted text beside the original pages, with "unchecked" and flagged pages first. `run review approve <source>` sets the source `converted`. `run review reject` sends the named pages, or every page, back to `blueprint-convert` with the person's reason (see [13 Extraction and Review](13-extraction-and-review.md)).
- **Done when:** every draft in the scope the person chose is `active` or `rejected`, or is reported as waiting for a second reviewer; every pending change in that scope is approved or rejected; every agent conversion in that scope is approved or sent back; and the skill has reported the counts by type.

### Model Skill

- **Job:** make the systems, capabilities and domains in scope ready to compare. It merges duplicates, re-parents capabilities, assigns domains, and sets each capability's status from its system's status list.
- **Inputs:** the systems the person names, usually the target and baseline systems of a planned comparison.
- **Commands:** `run model tree`, `run model merge`, `run model move`, `run model set-domain` (see [14 Fit-Gap and Placement](14-fit-gap-and-placement.md)), `run record show`, `run record list`, `project check`, `project status`.
- **Done when:** every active capability in scope belongs to one system, has a domain and has a status from its system's list; the duplicates the person chose to merge are merged; and `project check` reports no errors for those records.

### Compare Skill

- **Job:** create a comparison of one target system against one or more baseline systems, score each active baseline capability with a fit-gap record by the fit-gap method, and create `target-only` records for target capabilities that no fit-gap record uses. The skill only scores. It writes no export files.
- **Inputs:** the target system and baseline systems the person names.
- **Commands:** `run compare create`, `run compare next`, `run compare score`, `run compare target-only`, `run compare show` for the coverage read (see [14 Fit-Gap and Placement](14-fit-gap-and-placement.md)), `run record create` for planned integration drafts, `project check`, `project status`.
- **Agent work:** the skill follows the fit-gap method that [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) owns, in this order:
   1. Take one baseline capability at a time from `run compare next`, with its requirements and its candidate target matches. The command also hands out capabilities whose marks are out of date, so the agent scores them again.
   2. Mark every baseline requirement with evidence. A requirement mark is `met`, `configured`, `unreleased`, `partly` or `not-met`. Its evidence is target capability `id` values or source links, never target requirements. A capability with no requirements of its own gets one mark for the whole capability. A `not-met` mark carries a note on where the agent looked.
   3. Take the verdict from the verdict table, which reads it off the marks, and the confidence and effort from the written rubric. Write the fields the verdict needs, such as `gap_detail` for `partial`, `unreleased` and `gap`, and the migration note. `run compare score` refuses a draft without them.
   4. Treat the candidate matches as hints only. The agent can cite any target capability.
   5. After the baseline pass, run the target-only pass with `run compare target-only`.
- **Integrations:** when a fit-gap calls for a new flow between systems, or the coverage read lists a current integration that touches a baseline system and has no replacement, the agent creates a planned `integration` draft. The draft cites the fit-gap record or evidence and names the current integrations it `replaces` (see [19 System Integrations](19-system-integrations.md)).
- **Done when:** the coverage read says the comparison is fully scored, every fit-gap record has a mark with evidence for every baseline requirement, the target-only pass is done, and `project check` reports no errors for the comparison. When the person asks for files, the skill hands over to `blueprint-report`.

### Place Skill

- **Job:** create one placement record for each fit-gap record in scope, naming the owning system and the delivery value (`configure`, `extend`, `build` or `integrate`).
- **Inputs:** a comparison and the fit-gap records the person puts in scope.
- **Commands:** `run place next`, `run place set`, `run compare show` for the coverage read (see [14 Fit-Gap and Placement](14-fit-gap-and-placement.md)), `run record create` for planned integration drafts, `run record link` for the `integrations` field, `project check`, `project status`.
- **Integrations:** a placement with delivery `integrate` links its integration records in its `integrations` field. For each flow the placement delivers, the agent links the planned integration record that already exists, or creates a planned `integration` draft that cites the fit-gap or placement record, and then links it (see [19 System Integrations](19-system-integrations.md)).
- **Done when:** the coverage read lists no active fit-gap record in scope without a current placement, every `integrate` placement in scope links at least one integration record, and `project check` reports no errors for those placements.

### Hand-Off Skill

- **Job:** link placement records to Make Docs work items and docs. It stores Make Docs work item IDs in a placement's `work_items` field and Make Docs doc paths in its `docs` field. It also links integration records to the Make Docs designs, plans and work items for their interface work, in the same two fields, as [19 System Integrations](19-system-integrations.md#make-docs-links) describes. It only links.
- **Inputs:** the placements that the coverage read lists as waiting for hand-off, and the integration records that those placements list in `integrations`.
- **Commands:** `run place link`, which takes a placement or an integration record and stores `work_items` and `docs` on it at once, also on an `active` record, because Make Docs links are not facts and need no review; `run compare show` for the coverage read; `project check`; `project status`.
- **Make Docs work:** creating, changing or closing a work item, and writing any doc, is a Make Docs job. The skill tells the agent to do that work with Make Docs, through its own skills and commands, and then to come back and store the resulting IDs and paths through Make Blueprint. The skill can hand the agent the placement, fit-gap and integration records, by `ref`, as input for that Make Docs work.
- **Link check:** until Make Docs ships its read command for work item IDs and doc paths, `project check` skips Make Docs links and reports how many it skipped. That skip is a temporary workaround, tracked as obligation O-001 in [03 Open Questions and Risk Register](03-open-questions-and-risk-register.md), and [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) owns the check. The skill tells the person which Make Docs links it stored and how many `project check` skipped, so the person knows they are not yet confirmed.
- **When Make Docs is absent:** the skill tells the person that Make Docs owns the backlog. It can still store work item IDs or doc paths the person already knows, and it says that `project check` does not confirm them.
- **Done when:** the coverage read lists no active placement in scope as waiting for hand-off, `project check` reports no errors for those placements, and the skill has reported the Make Docs links that `project check` skipped, with their count.

### Report Skill

- **Job:** draft the prose that the exports show into records, and write the export files from those records. The CLI builds every export file, prose included, from the records alone (see [15 Exports](15-exports.md)). So the skill writes prose only into records, never into an export file.
- **Inputs:** the systems and comparisons the person wants exports for. This is usually a comparison whose fit-gap and placement records are reviewed, or a system whose model is clean.
- **Commands:** `run record show`, `run record list`, `run record create` for finding drafts, `run record update` for prose on draft records and, for prose on active records, the pending-change proposal that [13 Extraction and Review](13-extraction-and-review.md) defines, `run compare show` for the coverage read, `run export system`, `run export fit-gap`, `run export all`, `project check`, `project status`.
- **Agent work:** the skill carries a checklist that follows the export layout in [15 Exports](15-exports.md) part by part. For each part, the checklist names the record that holds its prose. The system record body gives the about part. Each domain record body opens its part. Capability and requirement bodies fill the sections. Finding records give the cross-cutting principles, the recorded contradictions and the reading notes. The agent drafts missing prose from the records and their evidence, cites that evidence, and leaves facts it cannot support out of the prose. A new finding is a draft, and new prose on an active record is a pending change, so all prose goes through review before an export shows it. Exports read only the records that pass the status filter, which is `active` by default.
- **Done when:** every checklist part for the systems and comparisons in scope has its prose in a record, and the skill has reported the prose that waits for review; the exports the person asked for are written from the current records; the skill has passed on any warning in the export output, such as values that start with `=`; and `project check` reports no errors for those records.

### Skill Rules

Requirements:

- Each skill owns one job: a stage's job; for `blueprint-convert`, the agent route for complex PDFs; or for `blueprint-report`, the export prose and the export files. No two skills cover the same job. There is no separate router skill; the routers in instruction files and the next action from `project status` point to the right skill.
- A skill folder holds only `SKILL.md`, optional reference files in Markdown, and agent-tool metadata files in YAML or JSON. It holds no script or program in any language, no file with an executable bit, and no file that starts with a `#!` line.
- Every step that reads or writes Make Blueprint data uses a Make Blueprint CLI command or MCP tool. A skill never tells the agent to write or edit record files, converted text or config by hand, and never tells it to create side files such as scratch notes, worker briefs or decision files.
- Each step names its CLI command and its MCP tool, so the skill works whether the agent tool reaches Make Blueprint through MCP or through the shell.
- A skill names no command or MCP tool that the CLI does not have.
- Each skill names the MCP profiles it needs, and says what to tell the person when a tool it needs is not in the configured profile, or when a write tool is refused because `allowWrite` is off.
- A skill keeps no state of its own. Its progress lives in records, and on the agent route in the page progress that the CLI tracks, so another agent or a new session can pick up the work from `project status` and the records.
- Each skill ends by running `project status` and passing on the next useful action that status names.
- In what the agent tells a person, a skill names records by `ref` and title. It keeps the permanent `id`, the index, locks, the journal and MCP profiles out of the person's way unless the person asks or an error needs a decision.
- Skill steps avoid shell-specific syntax such as pipes and here-documents, so they work the same in PowerShell, bash and zsh. Text that an agent supplies goes in an MCP tool argument or on the CLI's standard input.
- No skill creates, changes or closes Make Docs work items, or writes under `docs/`. The hand-off skill sends that work to Make Docs.
- No skill stages or commits in git unless the person asks.
- The same skill content serves Claude Code, Codex and GitHub Copilot CLI.
- Skills ship inside the CLI package, both the npm package and each signed single file, and carry the CLI's version. `setup` installs them into a project. Running `setup` again in that project refreshes them to the installed CLI's version, and `setup remove` removes them from the project. `update` updates only the tool, so a project's skills stay at their version until `setup` runs again there. `uninstall` takes the tool off the machine and never touches a project (see [07 Installation and Distribution](07-installation-and-distribution.md)).
- With the signed single file installed, every skill works on a machine with no Python and no Node, and with no network connection.

Evidence planned for these rules: automated skill lint tests that fail on any script file, executable bit or `#!` line, and on any command or tool name the CLI does not have; profile membership tests (work phase 08); a Guided Progress Review in which a reviewer runs all nine skills end to end with an agent on a sample project (work phase 08); and an end-to-end run of all seven stages and all nine skills in a clean container with no Python and no Node (work phase 09).

### Release Scope

| Release | Workflow and skills |
| --- | --- |
| v2.0 | The seven stages and nine skills: the seven stage skills, `blueprint-convert` and `blueprint-report` |
| v2.1 | No new skill. The web app and MCP App views are optional, and no skill needs them (see [18 Local Server and UI](18-local-server-and-ui.md)). |
| v2.2 | Test case, run, result and playbook records arrive (see [11 Record Types Reference](11-record-types-reference.md)). Any stage or skill for them is designed with that release. |
| v3 | No change to stage jobs. Setup C changes where data lives, below the CLI and MCP surface. |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 1: Northstar principles; section 6: skills ship inside the CLI package; section 7: MCP profiles; section 11: workflow and skills; section 12: relationship with Make Docs; section 16: decisions on skills, the fit-gap method, repeatable exports and integration records)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/08-mcp-skills-and-status.md` (Scope, Testing Decisions)
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/09-v1-import-and-release.md` (Scope: end-to-end run)
- `docs/prd/14-fit-gap-and-placement.md` (Coverage Read, Hand-Off Boundary)
- `.agents/skills/`

## Contracts and Data

### Skill Folder

Each skill is one folder that `setup` installs into the agent tool's skill folders:

```text
blueprint-<name>/
  SKILL.md                 front matter (name, description) and the guide
  references/*.md          optional longer guidance, in Markdown
  agents/*.yaml            optional agent-tool metadata
```

The `name` in `SKILL.md` front matter matches the folder name. The `description` says when an agent should use the skill, in words a person would use, such as "convert these files" or "review the drafts".

### Skill Content

Every `SKILL.md` has these parts, in this order:

| Part | What it says |
| --- | --- |
| Job | The one job the skill owns |
| When to use | The requests and project states that call for it, and the neighbouring skill to use instead when another stage fits better |
| Inputs | What the skill needs from the person or the project |
| Steps | Each step with its CLI command and MCP tool |
| Done when | The observable state that ends the skill |
| Report | What the agent tells the person, ending with the next useful action from `project status` |

### Commands and Profiles by Skill

| Skill | `run` domains it writes | Read calls it uses | MCP profiles |
| --- | --- | --- | --- |
| `blueprint-intake` | `source` | `run source list`, `run source show`, `project check`, `project status` | `intake`, `core` |
| `blueprint-convert` | `source` (`run source convert --agent`, `run source pages-next` and `run source pages-write`) | `run source show`, `project status` | `intake`, `core` |
| `blueprint-extract` | `extract` | `run extract show`, `run source read`, `project status` | `extract`, `core` |
| `blueprint-review` | `review` | `run review list`, `run review show`, `run source show`, `project status` | `extract`, `analyze`, `core` |
| `blueprint-model` | `model` | `run model tree`, `run record show`, `run record list`, `project check`, `project status` | `analyze`, `core` |
| `blueprint-compare` | `compare`; `record` (only `run record create` for planned integrations) | `run compare show`, `run compare next`, `project check`, `project status` | `analyze`, `core` |
| `blueprint-place` | `place` (`run place set`); `record` (`run record create` and `run record link` for integrations) | `run compare show`, `run place next`, `project check`, `project status` | `analyze`, `core` |
| `blueprint-hand-off` | `place` (only `run place link`, on placements and integration records) | `run compare show`, `project check`, `project status` | `analyze`, `core` |
| `blueprint-report` | `record` (prose drafts and pending changes), `export` | `run record show`, `run record list`, `run compare show`, `project check`, `project status` | `analyze`, `core` |

The `run export` tools sit in the `analyze` profile, as [08 CLI and MCP](08-cli-and-mcp.md) sets. The page tools `source_pages_next` and `source_pages_write` sit in the `intake` profile. The review approve and reject tools sit in both `extract` and `analyze`, because analysis drafts and pending changes use the same review.

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Decision, section 7: CLI and MCP profiles; Left for planning: the skill for each stage and its content)
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/skills/naive-uat/SKILL.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/cli/skill-registry.json`

## Integrations

| Integration | Connection |
| --- | --- |
| [08 CLI and MCP](08-cli-and-mcp.md) | Skills call only the commands and MCP tools that 08 publishes. Skill lint checks every named command and tool against that list. `project status` supplies the next useful action that every skill passes on. |
| [07 Installation and Distribution](07-installation-and-distribution.md) | Ships the skills in the npm package and the signed single file, and installs, refreshes and removes them for Claude Code, Codex and GitHub Copilot CLI. |
| [06 Project Layout and Instruction Files](06-project-layout-and-instruction-files.md) | The root block and routers tell agents which skill fits which request. |
| [12 Source Intake and Conversion](12-source-intake-and-conversion.md) | Owns what the intake and convert skills do to sources, including the agent route for complex PDFs: its trouble signals, page batches, CLI checks and `agent` converter value. |
| [13 Extraction and Review](13-extraction-and-review.md) | Owns what the extract and review skills do to extractions, drafts and pending changes, and the review of agent conversions. |
| [14 Fit-Gap and Placement](14-fit-gap-and-placement.md) | Owns what the model, compare, place and hand-off skills do, the fit-gap method and rubric the compare skill follows, and the coverage read they use. |
| [19 System Integrations](19-system-integrations.md) | Owns how integration records are used: the current ones the extract skill records and the planned ones the compare and place skills create. |
| [15 Exports](15-exports.md) | Owns the export files, their layout and the rule that the CLI builds them from records alone. `blueprint-report` follows that layout in its checklist and writes the files with `run export`. |
| [05 Ecosystem and Shared Core](05-ecosystem-and-shared-core.md) | Owns the Make Docs link format and its check, which the hand-off skill relies on. |
| Make Docs | Creates and changes work items and docs. The hand-off skill sends that work there and never does it through Make Blueprint. |
| [17 v1 Import](17-v1-import.md) | No skill owns the import. All nine skills work on an imported project. |

Code anchors:

- `docs/prd/05-ecosystem-and-shared-core.md`
- `docs/prd/07-installation-and-distribution.md` (Skills Install)
- `docs/prd/14-fit-gap-and-placement.md`

## Rebuild Notes

A clean-room rebuild must preserve these properties:

- A skill is guidance only. Every capability a skill uses exists as a CLI command and an MCP tool first. If a skill seems to need a script, the missing piece is a command.
- One skill, one job. Overlapping skills are the failure this design rules out.
- Skills are written after the command list exists, so they never describe commands that are planned but not built.
- Progress lives in records, not in skill state, so stopping a skill part way loses nothing.

Places where implementers are likely to make mistakes:

- **Helper scripts creeping back.** A skill that grows a "small helper" breaks the one-install principle on machines that allow no Python or Node. The lint test must fail the build.
- **Hand edits as a shortcut.** A skill that tells the agent to edit a record file "just this once" skips the lock, the journal, ref minting and duplicate hints.
- **Doing Make Docs work.** The hand-off skill must not write work items or docs, even when it would be quicker. Make Docs owns the backlog.
- **Agent approving its own work.** The review skill must record a person's decision, or a decision the person delegated. When the project turns the second reviewer on, the CLI enforces it.
- **Writing prose at export time.** The report skill drafts prose into records, and the CLI builds the files. An agent that writes text straight into an export file breaks the rule that the same records give the same files on every run.
- **Picking the verdict first.** The compare skill marks every baseline requirement and then takes the verdict from the marks. A verdict chosen first and backed by marks afterwards defeats the method, most of all for `native`, which nobody looks at again.
- **Superseding to fix a fact.** A wrong fact on an active record is fixed through a pending change on the same record. `run record supersede` is only for a real replacement, such as one requirement split into two.
- **Shell-specific steps.** A step that uses a pipe or a here-document fails in PowerShell. Use MCP arguments or standard input.

The BuildOS v1 skills are input only. A fresh v1 project carried 19 skills, 18 of which had no source in the `build-os` repository, and they overlapped heavily. None is ported, and no v1 skill text or script is copied. They were read only to list the jobs worth keeping. The inventory below is the input that work phase 08 reviews.

| v1 skill | Its job | Where the job lives in Make Blueprint |
| --- | --- | --- |
| `buildos-workflow` | Route a request to the right skill | Routers in instruction files and the next action from `project status`; no skill |
| `buildos-preflight` | Inspect the workspace before work | `project status` and `project check`; no skill |
| `buildos-intake` | Convert assets into converted text | Intake skill; conversion is built into the CLI |
| `buildos-intake-convert` | Classify and convert files, with manual fallbacks | Intake skill |
| `buildos-reference-review` | Find missing, stale, duplicate or empty converted files | `project check` and the intake skill |
| `buildos-extraction-plan` | Plan what to extract from a source before extracting | Extract skill; `run extract next` returns the parts to cover |
| `buildos-extract` | Turn converted text into records | Extract skill |
| `buildos-row-drafting` | Draft new records behind an approval gate | Extract skill for drafts, review skill for approval |
| `buildos-bulk-extract` | Extract many sources with staged review | Extract and review skills (see [13 Extraction and Review](13-extraction-and-review.md)) |
| `buildos-row-maintenance` | Update, deduplicate or supersede records | Model skill for merges; pending changes, decided by the review skill, for fixes to active records; `run record supersede` only for real replacements |
| `buildos-reporting` | Progress reports and gap tables | `blueprint-report` for export prose and export files; `project status` and the coverage read for progress |
| `buildos-validation-reporting` | Validate records, links and reports | `project check`; no skill |
| `buildos-docs-handoff` | Route knowledge into Make Docs documents | Hand-off skill for links; writing docs is a Make Docs job |
| `buildos-design-planning` | Turn qualified findings into designs and plans | Hand-off skill for links; designs and plans are Make Docs jobs |
| `buildos-export-azure-boards` | Turn a backlog into Azure Boards import files | Make Docs, which owns the backlog |
| `buildos-discovery` | Record discovery runs and their findings | Run and result records in v2.2 |
| `buildos-discovery-qualification` | Qualify findings with run evidence | Run and result records in v2.2; findings are v2.0 records |
| `buildos-browser-to-playwright` | Browser discovery and test drafting | Test case, run and result records in v2.2 |
| `buildos-playbook-drafting` | Draft playbooks | Playbook records in v2.2 |

Code anchors:

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md` (Context: v1 facts, 19 skills; Alternatives Considered: port the old skills or the bulk-extract script)
- `<v1-project>/.agents/skills/` (in the client-c-implementation project; reference only)
- `<user-home>/Developer/Source/Tyler/Projects/build-os/skills/buildos-export-azure-boards/SKILL.md`

## Source Anchors

- `docs/designs/2026-10-29-make-blueprint-v2-architecture.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/00-overview.md`
- `.make-docs/archive/plans/2026-10-29-w1-r0-make-blueprint-v2/08-mcp-skills-and-status.md`
- `docs/prd/01-product-overview.md`
- `docs/prd/02-architecture-overview.md`
- `<user-home>/Developer/Source/Tyler/Projects/make-docs/packages/skills/naive-uat/SKILL.md`
