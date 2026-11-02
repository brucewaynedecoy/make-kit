# Step 0 Evidence Report

This report is the central evidence record of the [Make Kit Step 0 Work Backlog](00-index.md). It follows the Acceptance-Case Evidence Retention section of the coverage pass contract (`make-docs://system/contract/coverage-pass-contract.md`). Each phase has one section. Inside a phase, each stage has one section, and each acceptance case has one entry.

## Summary

Phase 1 (Copy Day) is complete on 2026-11-02. 15 of its 15 acceptance cases pass: A101 to A115 all pass. Nothing is committed.

- A101 to A103, A105 to A107, A109, A111, A112, A114 and A115 pass.
- A108 passes by owner decision on 2026-11-02. The file-list compare ignores the content-hash part of the hashed `dist/` file names ([R-008](../../prd/03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206)).
- A110 passes with `make-docs project checkout-register`, by owner decision on 2026-11-02. A `checkout-move` was blocked ([Q-017](../../prd/03-open-questions-and-risk-register.md#q-017-make-docs-store-identity)).
- A113 passes with one recorded exception: 6 code anchors link to GitHub, not into `kits/make-docs/`.
- A104 passes. The scan found 344 home-folder paths in one test fixture archive, and one evidence screenshot also showed a home path. The client-term scan found a 4th client name in 27 kit files and 7 file names, and 13 external-drive paths in 9 kit files. The owner accepted all fixes on 2026-11-02, and the rescan finds 0 hits. Client names in already committed files and earlier commits are outside this commit ([Q-040](../../prd/03-open-questions-and-risk-register.md#q-040-client-names-in-the-committed-history)).

## Phase 1: Copy Day

Phase file: [01 Copy Day](01-copy-day.md).

### Test Environment

- Date: 2026-11-02.
- Machine: the maintainer machine, macOS on arm64.
- Tools: Node v24.19.0, npm 11.17.0 and Make Docs CLI 2.0.6. `gitleaks` and `trufflehog` are not installed.
- Tested revision: branch `w1-r0-p1-copy-day` at commit `a5ebdfb`, plus the uncommitted working tree of this phase. Nothing is committed, so no commit ID identifies the tested tree. This limit applies to every case below.
- Copy source: the local clone `<repo>/../make-docs` at the tag `v2.0.6`, commit `ff0b97dc71e50428d73ba7810c4bdb2bfa093680`.
- Place names: `<repo>` is the repository root, `<user-home>` is the home folder of the maintainer and `<scratchpad>` is the session scratch folder. All commands run from `<repo>` unless an entry says otherwise.
- Reviewer: the implementing coding agent, for every case in this phase. The owner made the decisions that the entries name.
- Retained captures: this report holds the facts. The raw command outputs stayed in `<scratchpad>` and are not kept, because some of them hold home-folder paths. The only kept file is the lockfile compare script [evidence/p1-lockfile-compare.mjs](evidence/p1-lockfile-compare.mjs).

### Stage 1 - Freeze and Extraction

Tasks t1 to t6 are done.

#### Task Records t1 to t3

- t1: `git -C ../make-docs rev-parse "v2.0.6^{commit}"` printed `ff0b97dc71e50428d73ba7810c4bdb2bfa093680`. `git ls-remote --tags https://github.com/brucewaynedecoy/make-docs "v*"` showed no release tag later than `v2.0.6`.
- t2: before the copy, `git -C ../make-docs rev-parse HEAD` printed `ff0b97dc71e50428d73ba7810c4bdb2bfa093680`, and `git -C ../make-docs status --porcelain` printed 0 lines. This record is the input for A102.
- t3: the agent announced the freeze to the owner in chat on 2026-11-02. The freeze starts on 2026-11-02. The old repository stays the Make Docs release source until [Phase 5](05-switch-point.md). An urgent fix before the switch goes into the old repository first, and a maintainer then ports it to `kits/make-docs/` by hand ([R-007](../../prd/03-open-questions-and-risk-register.md#r-007-urgent-fix-during-the-freeze)). The agent made no change to the old repository or to its local clone.

#### A101 Extracted File List

- Claim: the extracted tree equals the `v2.0.6` file list, and `kits/make-docs/` has no `.git` folder.
- Result: pass.
- Commands: `test -e kits/make-docs` before the copy (exit 1). `mkdir -p kits/make-docs && git -C ../make-docs archive v2.0.6 | tar -x -C kits/make-docs` (exit 0). `(cd kits/make-docs && find . -type f | sed 's|^\./||' | LC_ALL=C sort)` and `git -C ../make-docs ls-tree -r --name-only v2.0.6 | LC_ALL=C sort`, then a `diff` of the two lists. `git hash-object --no-filters` on each extracted file. `test -e kits/make-docs/.git`.
- Facts: `find` lists 2767 regular files, and `ls-tree` lists 2771 entries. The 4 differences are the 4 symlinks (mode `120000`) `.claude/skills/backlog-review`, `.claude/skills/factory`, `.claude/skills/human-experience` and `.claude/skills/preflight`. `git archive` writes them as symlinks, not as regular files. Each one points to `../../.agents/skills/<name>`, the same target as in the tag, and each one resolves. All 2767 files have the same blob ID as in `git ls-tree -r v2.0.6`. The tag has 2760 entries with mode `100644`, 7 with `100755` and 4 with `120000`, and all 7 executable files keep their executable bit. `.gitattributes` has no `export-ignore` entry, and the tag has no submodule. `test -e kits/make-docs/.git` exited 1. Commit note: `git ls-files --others --exclude-standard kits/make-docs` lists 2771 paths: 2768 of the 2771 tag paths plus the 3 draft files of W28 R0 (see [Follow-Up](#follow-up)). The 3 tag paths that it does not list are `package.json` and `package-lock.json`, which Stage 2 merged into the root files, and the ignored `.pyc` file, which the commit adds with `git add -f` (see [Choices Made During the Phase](#choices-made-during-the-phase)).
- Conclusion: the extracted tree equals the tag: 2767 regular files plus 4 symlinks, 2771 entries in all.

#### A102 Old Clone Unchanged

- Claim: `git -C ../make-docs rev-parse HEAD` and `git -C ../make-docs status --porcelain` give the same output at the end of the phase as in t2.
- Result: pass.
- Commands: `git -C ../make-docs rev-parse HEAD` and `git -C ../make-docs status --porcelain`, at the end of the phase on 2026-11-02.
- Facts: `rev-parse` printed `ff0b97dc71e50428d73ba7810c4bdb2bfa093680`, and `status --porcelain` printed 0 lines. Both are the same as the t2 record. Earlier checks after t4, in Stage 2 and in Stage 4 also found the same `HEAD` and an empty status.

#### A103 Work Folder and Project ID

- Claim: `kits/make-docs/docs/work/` exists, and `kits/make-docs/.make-docs/config.yaml` holds the `projectId` `831ddb50-b97a-47e2-9f2c-f491b27b8759`.
- Result: pass.
- Commands and facts: `test -d kits/make-docs/docs/work` exited 0. `grep -n projectId kits/make-docs/.make-docs/config.yaml` printed `1:projectId: 831ddb50-b97a-47e2-9f2c-f491b27b8759`.

#### A104 Pre-Commit Scan

- Claim: the pre-commit scan of `kits/make-docs/` reports zero findings after the fixes, and the evidence lists each fix with its file.
- Result: pass. The first scan before the fixes found one real finding group, and one evidence screenshot also showed a home path. The client-term scan before the fixes found a 4th client name and external-drive paths. The owner accepted all fixes on 2026-11-02, and the rescan after the fixes finds 0 hits.
- Commands: one `rg -uuu -a -n -o` search for each rule, from a scan script in `<scratchpad>`. The search reads hidden, ignored and binary files and does not follow symlinks. The 4 symlinks point into `.agents/skills/`, which the scan reads directly.
- Scope: all 2767 regular files under `kits/make-docs/`, and the 314 files inside the 3 test fixture archives `kits/make-docs/packages/cli/tests/fixtures/legacy-packages/*.tgz`, extracted into `<scratchpad>`.
- Rules: npm token, GitHub token or PAT, AWS key, private key block, Slack token, generic secret assignment (case-insensitive), special files (`.env`, `.npmrc` with `_authToken`, `*.pem`), home-folder paths for macOS, Linux and Windows, the work email address and its domain (case-insensitive), and email addresses. Extra checks found nothing: JSON-key secret assignments, `sk-` and `sk-ant-` keys, `Bearer` tokens, and the owner's surname outside `LICENSE`.

Counts per rule, before the fixes:

| Rule | Kit tree | Fixture archives | Real |
| --- | --- | --- | --- |
| npm token | 0 | 0 | 0 |
| GitHub token or PAT | 0 | 0 | 0 |
| AWS key | 0 | 0 | 0 |
| Private key block | 0 | 0 | 0 |
| Slack token | 0 | 0 | 0 |
| Generic secret assignment | 7 | 3 | 0 |
| Special files | 0 | 0 | 0 |
| macOS home path | 10 | 352 | 344 |
| Linux home path | 10 | 0 | 0 |
| Windows home path | 3 | 3 | 0 |
| Work email address or its domain | 0 | 0 | 0 |
| Email address | 6 | 0 | 0 |

Real findings: all 344 real hits are in one test fixture, `kits/make-docs/packages/cli/tests/fixtures/legacy-packages/brucewaynedecoy-make-docs-2.0.0-rc-f5fd5579.tgz`. Each hit is the owner's build path `<user-home>/Developer/Source/Tyler/Projects/make-docs/node_modules/...` for `zod`, `yaml`, `@clack` or `sisteransi`. The paths are in esbuild module comments and in the `sources` entries of source maps.

| File inside the archive | Hits | Lines |
| --- | --- | --- |
| `package/dist/chunk-5B5JOUKS.js` | 80 | 245 to 14756 |
| `package/dist/chunk-5B5JOUKS.js.map` | 78 | 1 |
| `package/dist/chunk-UJ47MLFV.js` | 69 | 38 to 6260 |
| `package/dist/chunk-UJ47MLFV.js.map` | 69 | 1 |
| `package/dist/chunk-ZY6Z7PDS.js.map` | 44 | 1 |
| `package/dist/chunk-ZY6Z7PDS.js` | 4 | 7 to 486 |

The archive is not in the npm package: the `files` list of `kits/make-docs/packages/cli/package.json` does not include `tests/`. The archive SHA-256 is pinned in `kits/make-docs/packages/cli/tests/fixtures/legacy-packages/README.md` and at line 97 of `kits/make-docs/packages/cli/tests/w22-r0-p7-authentic-upgrade.test.ts`. The tests check the digest before they run the archive, so a fix must change the digest in both places.

Synthetic hits (not real findings):

| Rule | Hits | Where | Why it is not a finding |
| --- | --- | --- | --- |
| Generic secret assignment | 10 | The path-hygiene allow marker at `kits/make-docs/packages/cli/src/path-hygiene.ts:6` and in 3 fixture archives; 6 test values in `kits/make-docs/packages/cli/tests/` | Rule text and test values, not secrets |
| macOS home path | 18 | 10 in `kits/make-docs/packages/cli/tests/`; 8 in old `check_path_hygiene.py` copies in 2 fixture archives | The names `test`, `tester`, `alice` and `example`, and regex rule text |
| Linux home path | 10 | 9 in `kits/make-docs/packages/cli/tests/`; 1 in an evidence file of the w19-r5 work record | Test names, and a `home` folder inside an already-redacted `<LOCAL_TEMP>` path |
| Windows home path | 6 | Rule text `<name>` in the 2 copies of `path-and-link-hygiene.md` and in 3 fixture archives; the name `alice` in one test | Rule text and a test name |
| Email address | 6 | 3 on `example.com`, 2 on `example.invalid`, 1 on `registry.example.test` | Reserved example domains |

Not scanned by these rules: the client terms, which have their own scan below, and the visual content of 54 images (33 `.jpg` and 20 `.png` under `kits/make-docs/docs/work/2026-09-24-w25-r0-live-backlog-review-mcp-app/evidence/`, and 1 `.svg` under `kits/make-docs/docs/assets/project/`). The image metadata holds only the pixel size, the orientation and a user comment.

Fixes: on 2026-11-02 the owner decided to remove the home path from the 2.0.0-rc fixture archive and from one evidence screenshot, and to update their digests. The owner accepted both fixes on 2026-11-02. Neither file is in the npm package.

Fix 1, the fixture archive `kits/make-docs/packages/cli/tests/fixtures/legacy-packages/brucewaynedecoy-make-docs-2.0.0-rc-f5fd5579.tgz`:

| Field | Before | After |
| --- | --- | --- |
| SHA-256 | `6008ee431f8e42d3714da8df512a934aa5e3f5d930a7a0c8104a17768a0fb878` | `698442bd4f974232ee20aadccdccf9dedfbad0b684ae188ce092214f97947144` |
| Bytes | 1508366 | 1502750 |
| Hits of the owner's account name | 344 | 0 |

- Change: the build-path prefix under `<user-home>` became `/build/make-docs` in 6 members: `package/dist/chunk-5B5JOUKS.js`, `package/dist/chunk-UJ47MLFV.js`, `package/dist/chunk-ZY6Z7PDS.js` and their `.js.map` files.
- Facts: one replaced string was the module label key of an esbuild `__commonJS` wrapper (`sisteransi`). It is a label only, and `node --check` passes on the 3 changed chunks. Only the size and checksum fields of the 6 changed tar headers changed. The other 133 members and the end padding are byte-identical. The source-map `sourcesContent`, `mappings` and `names` did not change. The gzip header uses mtime 0. Two macOS home-path placeholders with the name `<name>` stay in the rule text of the packed `path-and-link-hygiene.md` in the archive. They are synthetic.
- Digest pins: the pin changed at line 97 of `kits/make-docs/packages/cli/tests/w22-r0-p7-authentic-upgrade.test.ts` and at line 23 of `kits/make-docs/packages/cli/tests/fixtures/legacy-packages/README.md`. Line 29 of that README has a new note. Line 1264 of the dated record `kits/make-docs/docs/work/2026-09-18-w22-r0-store-architecture-recovery-and-platform-neutral-foundation/evidence.md` keeps the old digest and size, because it records history.
- Test: `npm test -w kits/make-docs/packages/cli -- tests/w22-r0-p7-authentic-upgrade.test.ts` exited 0, with 9 of 9 tests passed.

Fix 2, the screenshot `kits/make-docs/docs/work/2026-09-24-w25-r0-live-backlog-review-mcp-app/evidence/data-modal/live-retained-final.jpg`:

| Field | Before | After |
| --- | --- | --- |
| SHA-256 | `972de18f6e691abf9885512c317e38ac4bdba4f2676f3fff19b8dd353c05963c` | `f3708da21a6845c3e5926951dd7b86b160b5f197ed78235cb864f146402414a4` |
| Bytes | 91770 | 91317 |
| Image size | 742x1314 | 742x1314 |

- Change: a code panel in the image showed the `targetRoot` home path as pixels. The panel now shows the text `<user-home>/Developer/Source/Tyler/Projects/make-docs`.
- Facts: only one 480x16 pixel band was re-encoded. All other JPEG blocks are unchanged. The record for the image in `data-modal-artifacts.json` (the same folder), lines 64 and 65, has the new bytes and the new SHA-256. No test reads the image.

Rescan after the fixes: a case-insensitive search for the owner's account name over all files in `kits/make-docs/`, with hidden, ignored and binary files, and inside the 3 fixture archives finds 0 hits. A search for the work email address and its domain finds 0 hits.

Client-term scan: on 2026-11-02 the owner gave 3 client terms to the scan as local input only. No repository file holds them. The scan covered all 2,917 files that the commit holds: the tracked files, the untracked files that are not ignored, and the one forced `.pyc` file. It also read binary files, file names and the contents of the 3 fixture archives in `kits/make-docs/packages/cli/tests/fixtures/legacy-packages/`. It does not read the visual content of images.

Results of the client-term scan, before the fixes:

- The 3 client terms: 0 hits in `kits/make-docs/`. 3 lines of this report named one term as a scan rule: the Rules line, one row of the rule table and the rescan line above. Those 3 lines now name the rule as the work email address and its domain.
- A 4th client name: in 27 `kits/make-docs/` files and in 7 file names. The 7 file names hold the old client slug.
- External-drive paths: 13 paths below `/Volumes` in 9 kit files. 11 are full paths into the client project, and 2 name only the drive. The home-path rules covered only paths below `/Users` and `/home`, and Windows paths below `C:\Users`, so they did not find these paths.

Rule change: the home-path rules now also cover external-drive paths: paths below `/Volumes` (macOS), below `/mnt` and `/media` (Linux), and Windows paths that start with a drive letter.

Fix 3, the client name and the external-drive paths: the owner accepted this fix on 2026-11-02.

- Each full path into the client project became `<client-project>`, and the rest of the path stayed. For example, the path of the project `docs` folder became `<client-project>/docs`. The 2 paths that name only the drive became `<external-drive>`. This change also removed the folder name and the drive name in those paths.
- The old client slug became `client-project`, for example in `client-project-buildos`.
- In prose, the client name became "client" or "the client project", and the agent reworded the sentence where necessary. Examples: "the full client BuildOS project" and the title "Client BuildOS Markdown path count".
- The evidence files are machine output. In them, only the name and path parts changed. The 2 review files of the w24-r0 work record quote lines of other files as excerpts. Their excerpts changed in the same way as the quoted lines. Their line numbers did not change, and no changed file has a different line count.

Fixed files. All paths are below `kits/make-docs/`, and each path is the path after the rename:

| File | What changed |
| --- | --- |
| `.make-docs/archive/history/2026-09-26-w18-r16-p1-prd-authority-source-selection.md` | Client name in prose |
| `.make-docs/archive/history/2026-09-26-w18-r16-p2-prd-authority-guidance-and-proof.md` | Client name in prose, links to renamed files |
| `docs/designs/2026-09-26-prd-authority-source-scope.md` | Client name in prose |
| `docs/plans/2026-09-18-w22-r0-store-architecture-recovery-and-platform-neutral-foundation/00-overview.md` | Client name in prose |
| `docs/plans/2026-09-18-w22-r0-store-architecture-recovery-and-platform-neutral-foundation/07-setup-bridge-order-and-recovery-loop-repair.md` | Client name in prose |
| `docs/plans/2026-09-18-w22-r0-store-architecture-recovery-and-platform-neutral-foundation/08-router-ownership-and-reviewed-reinstall-repair.md` | Client name in prose |
| `docs/plans/2026-09-26-w18-r16-prd-authority-scan-scope/00-overview.md` | Client name in prose, a link to a renamed file |
| `docs/plans/2026-09-26-w18-r16-prd-authority-scan-scope/02-guidance-and-project-proof.md` | Client name in prose |
| `docs/plans/2026-09-26-w18-r16-prd-authority-scan-scope/03-markdown-evidence-source-selection.md` | Client name in prose, a link to a renamed file |
| `docs/prd/03-open-questions-and-risk-register.md` | Client name in prose, links to renamed files |
| `docs/work/2026-08-14-w19-r2-performance-evidence-governance/02-governance-resources-and-routing.md` | Old client slug |
| `docs/work/2026-09-18-w22-r0-store-architecture-recovery-and-platform-neutral-foundation/00-index.md` | Client name in prose |
| `docs/work/2026-09-18-w22-r0-store-architecture-recovery-and-platform-neutral-foundation/07-setup-bridge-order-and-recovery-loop-repair.md` | Client name in prose |
| `docs/work/2026-09-18-w22-r0-store-architecture-recovery-and-platform-neutral-foundation/08-router-ownership-and-reviewed-reinstall-repair.md` | Client name in prose |
| `docs/work/2026-09-18-w22-r0-store-architecture-recovery-and-platform-neutral-foundation/evidence.md` | Client name in prose |
| `docs/work/2026-09-24-w24-r0-mcp-tool-profiles/evidence/p4/review/performance-structure-attempt-1.json` | Excerpts: client name, 1 client path, links to renamed files |
| `docs/work/2026-09-24-w24-r0-mcp-tool-profiles/evidence/p4/review/performance-structure-attempt-1.txt` | Excerpts: client name, 1 client path, links to renamed files |
| `docs/work/2026-09-26-w18-r16-prd-authority-scan-scope/00-index.md` | Client name in prose |
| `docs/work/2026-09-26-w18-r16-prd-authority-scan-scope/01-validator-selection-and-regression.md` | Client name in prose |
| `docs/work/2026-09-26-w18-r16-prd-authority-scan-scope/02-guidance-and-project-proof.md` | Client name in prose, 1 client path, links to renamed files |
| `docs/work/2026-09-26-w18-r16-prd-authority-scan-scope/03-markdown-evidence-source-selection.md` | Client name in prose, links to renamed files |
| `docs/work/2026-09-26-w18-r16-prd-authority-scan-scope/evidence/2026-09-26-client-project-authority-report.json` | 2 client paths |
| `docs/work/2026-09-26-w18-r16-prd-authority-scan-scope/evidence/2026-09-26-client-project-markdown-path-counts.txt` | 2 client paths, client name in the title |
| `docs/work/2026-09-26-w18-r16-prd-authority-scan-scope/evidence/2026-09-27-client-project-authority-report.json` | 2 client paths |
| `docs/work/2026-09-26-w18-r16-prd-authority-scan-scope/evidence/2026-09-27-client-project-authority-run.txt` | 1 drive path, client name in a placeholder and in prose |
| `docs/work/2026-09-26-w18-r16-prd-authority-scan-scope/evidence/2026-09-28-client-project-authority-final-report.json` | 2 client paths |
| `docs/work/2026-09-26-w18-r16-prd-authority-scan-scope/evidence/2026-09-28-client-project-authority-final-run.txt` | 1 drive path, client name in a placeholder and in prose |

Renamed files: `mv` renamed the 7 evidence files in `kits/make-docs/docs/work/2026-09-26-w18-r16-prd-authority-scan-scope/evidence/`. In each name, only the old client slug changed to `client-project`. Every link and file-name mention in the repository now uses the new name.

| Old name | New name |
| --- | --- |
| `2026-09-26-<old client slug>-authority-report.json` | `2026-09-26-client-project-authority-report.json` |
| `2026-09-26-<old client slug>-authority-run.txt` | `2026-09-26-client-project-authority-run.txt` |
| `2026-09-26-<old client slug>-markdown-path-counts.txt` | `2026-09-26-client-project-markdown-path-counts.txt` |
| `2026-09-27-<old client slug>-authority-report.json` | `2026-09-27-client-project-authority-report.json` |
| `2026-09-27-<old client slug>-authority-run.txt` | `2026-09-27-client-project-authority-run.txt` |
| `2026-09-28-<old client slug>-authority-final-report.json` | `2026-09-28-client-project-authority-final-report.json` |
| `2026-09-28-<old client slug>-authority-final-run.txt` | `2026-09-28-client-project-authority-final-run.txt` |

The file `2026-09-26-client-project-authority-run.txt` has only a new name. Its content did not change.

- Digest and size records: before the edits, the agent calculated the SHA-256 of the 28 changed or renamed files. A search of the whole repository for each digest (in hex, in base64 and as the first 12 hex characters) and for the old file names found no digest or byte-size record of these files. So no record changed. The only records of the old names were links and file-name mentions, and Fix 3 changed them. The review file `performance-structure-attempt-1.json` records only the path, the line, the kind and the excerpt of each candidate.
- Checks after Fix 3: the 4 changed JSON files parse. `make-docs run prd authority validate --target-root kits/make-docs` exits 0. The link check of the 23 changed Markdown files finds only the 36 known broken links of the copied Make Docs register (see [Choices Made During the Phase](#choices-made-during-the-phase)). Without that file, it gives `bad: 0`.

Rescan after Fix 3: the searches for the 3 client terms, the 4th client name, the old client slug and the home-path rules with the external-drive paths, over all files that the commit holds, with binary files, file names and the 3 fixture archives, find 0 hits.

Outside this commit: 14 `kits/make-blueprint/` files that are already committed hold client names, and all 8 commits on `main` hold client data. The first 5 commits also hold an old root `README.md` with client names, client folder paths and the owner's home-folder path. On 2026-11-02 the owner asked to remove them from the files and from the git history before the repository goes public. On the same day, the owner chose to rewrite the history ([Q-040](../../prd/03-open-questions-and-risk-register.md#q-040-client-names-in-the-committed-history)). This finding is not part of A104, because A104 covers `kits/make-docs/`.

### Stage 2 - Root Workspace and Lockfile

Tasks t7 to t10 are done.

Changes in this stage:

- t7: the new root `package.json` comes from the old `kits/make-docs/package.json`. It has the name `make-kit`, the version `0.0.0`, `"private": true`, `type: module`, the Node engine `>=24.0.0` and the workspaces `packages/*` and `kits/*/packages/*`. It keeps the old scripts `build`, `dev`, `test`, `test:smoke-harness`, `validate:defaults`, `smoke:pack`, `smoke:pack:local` and `smoke:pack:runners`. The workspace arguments changed from `-w packages/cli` to `-w kits/make-docs/packages/cli`, and the script paths changed from `scripts/...` to `kits/make-docs/scripts/...`. The old root had no dev dependencies. `kits/make-docs/package.json` is deleted. No script uses `process.cwd()` as the old root, so no root script needs `cd kits/make-docs`. The root `.gitignore` now ignores `node_modules/`.
- t8: `kits/make-docs/package-lock.json` (the same bytes as `v2.0.6:package-lock.json`) moved to the root. The top-level `name`, the `""` entry, the 3 workspace keys and the `resolved` values of the 3 workspace links changed to the `kits/make-docs/packages/...` paths. Then `npm install --package-lock-only --ignore-scripts` exited 0, and its only change was the sort order of the 3 workspace entries. `lockfileVersion` stays 3.
- t9: the compare script is [evidence/p1-lockfile-compare.mjs](evidence/p1-lockfile-compare.mjs). It uses plain Node and no dependencies. It compares each lockfile entry under `node_modules/` that is not a workspace link, on `version` and `integrity`. It exits 0 with no differences, 1 with differences, and 2 on a usage or read error.

#### A105 Root Manifest and Lockfiles

- Claim: the root `package.json` has `"private": true` and only the workspaces `packages/*` and `kits/*/packages/*`. No lockfile is below the root, and no `package.json` below the root has a `workspaces` field.
- Result: pass.
- Commands: a `node -e` check of `private` and `workspaces` in `package.json` (exit 0). `find kits packages -name package-lock.json -not -path '*/node_modules/*'`. `grep -rl '"workspaces"' --include=package.json kits packages | grep -v node_modules`. `git -C ../make-docs ls-tree -r --name-only v2.0.6`, filtered for lockfiles and `package.json` files.
- Facts: the `node -e` check printed `private=true workspaces=["packages/*","kits/*/packages/*"] PASS`. The `find` printed nothing. Its exit code is 1 only because `packages/` does not exist yet, and `find kits -name package-lock.json -not -path '*/node_modules/*'` printed nothing with exit 0. The `grep` printed nothing. The tag tracks only `package-lock.json`, `package.json` and the 3 workspace `package.json` files, so no fixture lockfile and no fixture `package.json` with `workspaces` exists.

#### A106 Lockfile Compare and Clean Install

- Claim: the lockfile compare script exits 0 and reports zero version or integrity differences. `npm ci` from the repository root exits 0.
- Result: pass.
- Commands: `node docs/work/2026-11-01-w1-r0-make-kit-monorepo/evidence/p1-lockfile-compare.mjs`. A negative test of the script with `--new-file` set to a scratch copy of the root lockfile. `npm ci`. `npm ls --workspaces --depth=0`.
- Facts: the compare printed `entries=252` for `v2.0.6:package-lock.json` and for `package-lock.json`, both with `lockfileVersion 3`, and `differences=0`, with exit 0. The same result came from `kits/make-docs/`. In the negative test, a scratch lockfile with one changed version, one removed entry and one added entry gave 3 differences (`version differs`, `missing in new`, `extra in new`) and exit 1. An unknown argument and a run outside a git repository each exit 2. `npm ci` printed `added 182 packages, and audited 186 packages` and exited 0. `npm ls` shows the 3 workspace links into `./kits/make-docs/packages/`. The root and the 3 workspaces have no install scripts. Of the dependencies, `esbuild@0.27.4` ran its `postinstall` and installed the native `darwin-arm64` binary, and `fsevents@2.3.3` built nothing. npm 11.17 printed an `allow-scripts` notice for these 2 packages, and in the default mode the scripts still run. npm reported 2 audit findings (1 low, 1 moderate) from the unchanged `v2.0.6` dependency set.

### Stage 3 - Build, Tests and Repository Links

Tasks t11 to t14 are done.

#### A107 Build and Tests From the Repository Root

- Claim: `npm run build` and `npm test` from the repository root exit 0 on the maintainer machine.
- Result: pass. The final run after all fixes on 2026-11-02 supports this result.
- Commands: `npm run build`, `npm run test:smoke-harness` and `npm test -w kits/make-docs/packages/cli` for the first run. `npm run build` and `npm test` for the full run after the t13 change, and again for the final run after all fixes, including the A104 fixes.
- Facts, first run: the build passed. node --test had 19 passes. Vitest exited 1 with 7 failures. One failure, in `tests/mcp-app-contract.test.ts`, came from a fixed `<kit>/node_modules/tsx/dist/loader.mjs` path. This is an old-root path assumption ([R-006](../../prd/03-open-questions-and-risk-register.md#r-006-make-docs-tests-that-assume-the-repository-root)). Six failures, in `tests/consistency.test.ts` and `tests/template-links.test.ts`, came from the missing git-ignored `kits/make-docs/packages/cli/template/` copy that the `prepack` script makes. This is not an old-root path assumption, and the v2.0.6 CI also runs `prepack` before `npm test`.
- Fixes: t11 changed [`kits/make-docs/packages/cli/tsup.config.ts`](../../../kits/make-docs/packages/cli/tsup.config.ts). The `yaml-browser-entry` plugin now resolves `yaml/package.json` with `createRequire(import.meta.url).resolve(...)` and joins `browser/index.js` to that folder. The `yaml` package `exports` map does not list `./browser/index.js`, so a direct resolve fails with `ERR_PACKAGE_PATH_NOT_EXPORTED`. The built source maps list 69 sources under `node_modules/yaml/browser/`, so the build still bundles the browser entry. t12 changed [`kits/make-docs/packages/cli/tests/mcp-app-contract.test.ts`](../../../kits/make-docs/packages/cli/tests/mcp-app-contract.test.ts) to resolve the `tsx` loader with `createRequire(import.meta.url).resolve("tsx")`. The agent ran `npm run prepack -w kits/make-docs/packages/cli` once (exit 0). Re-runs of the failed suites passed: 40 tests in `mcp-app-contract.test.ts`, and 50 tests in the other 2 files.
- Facts, final run after all fixes, including the client-data fixes: on 2026-11-02, from the repository root, `npm run build` exited 0 and `npm test` exited 0. node --test had 19 passes and 0 failures. Vitest had 111 passed files and 1 skipped file, with 1996 tests passed, 6 skipped and 0 failed.
- Facts, files changed since the Store step: the 5 home-path fix files and the 28 client-data fix files changed. The 28 client-data fix files are 27 edited files, of which 6 also have a new name, and 1 file that has only a new name and no content change. All 33 are docs and evidence files. No code changed. The earlier run after the home-path fixes had a SHA-256 compare, and it showed that the build and the tests changed no file that the commit holds. The final run had no new SHA-256 compare.
- Facts, full run after the t13 change: `npm run build` exited 0. `npm test` exited 0. node --test had 19 passes, 0 failures and 0 skips. Vitest had 1996 passes, 0 failures and 6 skips, in 111 passed files and 1 skipped file, in 461.61 s. The 6 skips are opt-in suites that need an environment variable: 5 tests in `tests/w19-r8-installed-upgrade-matrix.test.ts` (`MAKE_DOCS_R8_UPGRADE_TEST_CLI`) and 1 test in `tests/w22-r1-ownership.test.ts` (`MAKE_DOCS_RELEASED_205_BINARY`). The legacy-package tests passed. No file under `tests/fixtures/legacy-packages/` and no SHA-256 pin changed.
- Limits: on a fresh checkout, `npm run prepack -w kits/make-docs/packages/cli` must run once before `npm test`, as in v2.0.6. Without it, 6 tests fail with `ENOENT`.

#### A108 Package File List

- Claim: the `npm pack --dry-run` file list for `@brucewaynedecoy/make-docs` equals the 2.0.6 file list when the content-hash part of each `dist/<name>-<hash>.js` and `dist/<name>-<hash>.js.map` name is ignored.
- Result: pass by owner decision on 2026-11-02 ([R-008](../../prd/03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206)). The criterion first said "equals the 2.0.6 file list", and the lists failed that text only on the hashed names. The owner accepted that the compare ignores the hash part. No build setting changed to force a match.
- Commands: `npm pack --dry-run --json -w kits/make-docs/packages/cli --pack-destination <scratchpad>/pack-local` (exit 0; it runs `prepack`). `npm pack @brucewaynedecoy/make-docs@2.0.6 --dry-run --json` from an empty scratch folder (exit 0; it reads the npm registry). A compare script that matches the `files[].path` lists and reports each size difference over 1%. No `.tgz` file was written.
- Facts: both lists have `entryCount` 141 and 141 files. The local `unpackedSize` is 14,035,439 and the published one is 14,033,295. 103 paths are in both lists: every path outside `dist/`, plus `dist/index.js` and `dist/index.js.map`. All 103 have the same size, except `package.json` (+3.14%, from the t13 repository links) and `README.md` (+1.12%, from the t13 GitHub links). 38 paths are only in the local list and 38 only in the published list: 19 `.js` files and 19 `.js.map` files on each side, all hashed names under `dist/`. They pair one-to-one by name stem and size:

| Published 2.0.6 | Local | Size |
| --- | --- | --- |
| `backup-P5NUPAJL` | `backup-PAVC53FB` | same |
| `chunk-2WC74W66` | `chunk-7LW632N6` | same |
| `chunk-3EXHM5L2` | `chunk-KJFPU72N` | `.js` +54 B, `.map` +42 B |
| `chunk-B7QF7XZT` | `chunk-ATGOL6C2` | same |
| `chunk-DNPFQB24` | `chunk-2VOLRDF5` | same |
| `chunk-EF47XIIR` | `chunk-GN6S5T2H` | `.js` +570 B, `.map` +564 B |
| `chunk-KFYUB4AX` | `chunk-VSZDUHCQ` | same |
| `chunk-LK6BLVZA` | `chunk-LIGUPELE` | same |
| `chunk-PI7W5QDB` | `chunk-VVDTGWX3` | same |
| `chunk-SFKYGFUV` | `chunk-SGF4ISJJ` | `.js` +414 B, `.map` +414 B |
| `chunk-TDB6UW4M` | `chunk-HJLNW5DX` | same |
| `chunk-XFFESINU` | `chunk-YKVPOAVY` | same |
| `registry-44WLX4F5` | `registry-SUG4AJB7` | same |
| `self-WRWI5XNE` | `self-FD7IVQ4K` | same |
| `server-FYRDPOBR` | `server-BZOFPADO` | same |
| `setup-system-XX6NSVXZ` | `setup-system-A7V752NM` | same |
| `skills-command-YAQP24JM` | `skills-command-BFB3IO4Z` | same |
| `uninstall-3YJKZ6UF` | `uninstall-AQCY66OF` | same |
| `virtual_make-docs-first-party-skills-5TYTCD5U` | `virtual_make-docs-first-party-skills-VPBEWOUC` | same |

- Causes: (1) esbuild writes a comment with the relative input path for each bundled module, such as `// ../../../../node_modules/@clack/core/dist/index.mjs`. Under `kits/make-docs/packages/cli/`, each such path is 6 characters (`../../`) longer than at v2.0.6. The 3 size changes match this: `chunk-GN6S5T2H.js` has 95 such paths (570 B), `chunk-SGF4ISJJ.js` has 69 (414 B) and `chunk-KJFPU72N.js` has 9 (54 B). The `.map` changes come from the same longer `sources` entries. (2) The embedded first-party skills bundle stores the SHA-256 of `packages/cli/package.json` as `packageDigest` ([`kits/make-docs/packages/cli/scripts/embedded-skills.ts:90`](../../../kits/make-docs/packages/cli/scripts/embedded-skills.ts)). The t13 change thus changes that chunk but not its size. Before t13, the chunk built with the published name `5TYTCD5U`. (3) An esbuild chunk hash covers the names of the chunks that it imports. So one changed chunk renames every chunk that imports it, also when its size stays the same.
- Limits: this case compares file lists and sizes, not file content. The content compare is a Phase 5 task ([R-008](../../prd/03-open-questions-and-risk-register.md#r-008-build-output-of-207-differs-from-206)).

#### A109 Package Metadata and README Links

- Claim: `kits/make-docs/packages/cli/package.json` differs from `v2.0.6:packages/cli/package.json` only in `repository`, `homepage` and `bugs`, and the package README has no GitHub link to the old repository.
- Result: pass.
- Commands: `diff <(git -C ../make-docs show v2.0.6:packages/cli/package.json) kits/make-docs/packages/cli/package.json` (exit 1, because the files differ). `grep -n "brucewaynedecoy/make-docs" kits/make-docs/packages/cli/README.md`.
- Facts: the diff shows only these changes:

```text
8c8,9
<     "url": "git+https://github.com/brucewaynedecoy/make-docs.git"
---
>     "url": "git+https://github.com/brucewaynedecoy/make-kit.git",
>     "directory": "kits/make-docs/packages/cli"
10c11
<   "homepage": "https://github.com/brucewaynedecoy/make-docs#readme",
---
>   "homepage": "https://github.com/brucewaynedecoy/make-kit#readme",
12c13
<     "url": "https://github.com/brucewaynedecoy/make-docs/issues"
---
>     "url": "https://github.com/brucewaynedecoy/make-kit/issues"
```

The name `@brucewaynedecoy/make-docs`, the version `2.0.6`, `bin`, `files` and `engines` did not change. The `grep` matches only lines 10, 11, 16 and 20 of the README. All 4 are the npm package name in `npx @brucewaynedecoy/make-docs@latest ...`, not GitHub links. The README GitHub links on lines 50 to 53 point to 3 user guides under `https://github.com/brucewaynedecoy/make-kit/blob/main/kits/make-docs/docs/assets/user/` and to `https://github.com/brucewaynedecoy/make-kit`. The 3 guide files exist under `kits/make-docs/docs/assets/user/`.

### Stage 4 - Store Identity, Root Map and Make Docs Register

Tasks t15 to t18 are done.

#### A110 Store Checkout for the Kit Folder

- Claim: after the apply step, `make-docs project checkout-register preview --target-root kits/make-docs --json` shows `status` `bound` for `projectId` `831ddb50-b97a-47e2-9f2c-f491b27b8759`, and the apply output shows `projectFilesChanged` `false`.
- Result: pass, with `make-docs project checkout-register`. The owner accepted this command in place of `checkout-move` on 2026-11-02 ([Q-017](../../prd/03-open-questions-and-risk-register.md#q-017-make-docs-store-identity)).
- Commands, in order: `make-docs project checkout-move preview --target-root kits/make-docs --json`, two times (exit 0). `make-docs project checkout-register preview --target-root kits/make-docs --json`. A SHA-256 list of all files under `kits/make-docs/` without `node_modules`. `make-docs project checkout-register apply --review <digest> --target-root kits/make-docs --json`, with the `separateReviewDigest` from the preview. The same SHA-256 list again, and a compare of the two lists. `make-docs project checkout-register preview --target-root kits/make-docs --json` again.
- Facts for the blocked move: both move previews gave the same result. They named the `projectId` `831ddb50-b97a-47e2-9f2c-f491b27b8759`, the source checkout `fb3f0042-91fa-445b-bfec-16e3dde15fc2` at `<repo>/../make-docs` and the target `<repo>/kits/make-docs`. They returned `status` `blocked`, `available` `false` and `reviewDigest` `null`, with 2 blockers. Blocker 1 is "The source path still exists." A move expects the old folder to be gone ([`kits/make-docs/packages/cli/src/store/installation-state.ts:853`](../../../kits/make-docs/packages/cli/src/store/installation-state.ts)), but the old clone `../make-docs` stays because of the freeze and the read-only rule. Blocker 2 is "The saved managed-snapshot hash does not match .agents/skills/backlog-review/assets/backlog-review-report.html." That file has the same SHA-256 in `kits/make-docs/`, in the old clone and at the `v2.0.6` tag, so the hash that the Store saved for the old checkout is stale. The copy did not cause it. The move apply step did not run.
- Facts for the register: the register preview gave the same JSON as the move preview, with the `separateReviewDigest` `7c1012b1ab2110b998ae1c33682f5af94afdf1db385bdf86b68467fe19442b98`. The apply step returned `status` `registered`, `projectId` `831ddb50-b97a-47e2-9f2c-f491b27b8759`, the new `checkoutId` `99188529-0b18-42b0-84ef-554d001afd79`, `effect` `new-checkout-binding` and `projectFilesChanged` `false`. The SHA-256 lists before and after the apply step have 2904 files each and are the same. The second register preview returned `status` `bound`, no candidates, and "This checkout is already bound. Continue setup." The old checkout `fb3f0042-91fa-445b-bfec-16e3dde15fc2` stays bound to the old clone. `git -C ../make-docs status --porcelain` was empty before and after.
- Limits: the apply output's `nextAction` says "Run setup for this target to review its own installation state." This phase does not run setup.

#### A111 Root Map Rows

- Claim: the root map tables in `AGENTS.md` and `CLAUDE.md` have the same rows. The `kits/make-docs/` row in each file names the kit router with that file's own name and holds no "not here yet" text.
- Result: pass.
- Commands: `git diff -- AGENTS.md CLAUDE.md`. A script that compares the two map tables with the router file name replaced by one placeholder. The link-check script on `AGENTS.md` and `CLAUDE.md`.
- Facts: the new rows are:

```text
| `kits/make-docs/` | Make Docs, copied from the `v2.0.6` tag | `kits/make-docs/AGENTS.md` |
| `kits/make-docs/` | Make Docs, copied from the `v2.0.6` tag | `kits/make-docs/CLAUDE.md` |
```

Both kit routers exist. The two tables are the same apart from the router file name, with the rows `docs/`, `packages/core/`, `packages/kit/`, `kits/make-blueprint/` and `kits/make-docs/`. The `git diff` shows one changed line in each file. The rules, the numbered workarounds and the Make Docs managed blocks did not change. The link check gave `bad: 0`.

#### A112 Make Docs Register Items

- Claim: the Make Docs register holds one item for the Naive UAT removal, one for the PRD 16 text, one for the PRD 21 text and one for each unmerged branch. Each item names its root register number with the root register path.
- Result: pass. No branch item is needed, because no unmerged work branch exists.
- Commands: `make-docs run prd authority validate --target-root kits/make-docs`. The link-check script on the Make Docs register. `git ls-remote --heads https://github.com/brucewaynedecoy/make-docs`, `git -C ../make-docs branch -r --no-merged v2.0.6`, `git -C ../make-docs branch --no-merged v2.0.6`, and `git -C ../make-docs merge-base --is-ancestor <sha> v2.0.6` for each branch tip. All git commands are read-only.
- Facts: the agent added these items to [the Make Docs register](../../../kits/make-docs/docs/prd/03-open-questions-and-risk-register.md). The diff against the `v2.0.6` version of the file adds 47 lines and removes none.

| Item | Title | Section and status | Root item |
| --- | --- | --- | --- |
| O-003 | Naive UAT Removal | Deferred Obligations, `Deferred`, with an owner-routed target | [Q-009](../../prd/03-open-questions-and-risk-register.md#q-009-naive-uat-removal) and [D-010](../../prd/03-open-questions-and-risk-register.md#d-010-uat-validators-exit-0-when-not-passed) |
| D-050 | PRD 16 Says Uninstall Removes the Store | Confirmed Drift, `Open` | [D-002](../../prd/03-open-questions-and-risk-register.md#d-002-uninstall-text-disagrees-with-store-removal) and [Q-035](../../prd/03-open-questions-and-risk-register.md#q-035-scope-of-the-uninstall-fix-in-220) |
| D-051 | PRD 21 Lists a Retired Project Skill Root | Confirmed Drift, `Open` | [D-036](../../prd/03-open-questions-and-risk-register.md#d-036-prd-21-lists-a-project-skill-root) |

The Naive UAT removal is an accepted future outcome, so it goes in `## Deferred Obligations`. The PRD 16 and PRD 21 subjects are drift between a Make Docs PRD and the code, so they use the `D-###` shape. Each item links the root register as `../../../../docs/prd/03-open-questions-and-risk-register.md` with the root anchor.

Branches of the old repository:

| Branch | Where | Tip | Ancestor of `v2.0.6` |
| --- | --- | --- | --- |
| `main` | GitHub and local | `ff0b97dc71e5` | yes |
| `docs/v206-security-review` | GitHub and local | `6acebdffaff5` | yes |
| `w27-r0-github-copilot-cli-desktop-support` | GitHub and local | `1f0da1e859d1` | yes |
| `docs/install-setup-cli-mcp-guide-review` | local only | `180f3da0aa9b` | yes |
| `v205-dependency-security-followup` | local only | `7aa82a16fb88` | yes |
| `dependabot/npm_and_yarn/body-parser-2.4.0` | GitHub | `a55c697c3222` | no |
| `dependabot/npm_and_yarn/fast-uri-3.1.9` | GitHub | `05286438f7a1` | no |
| `dependabot/npm_and_yarn/hono/node-server-2.1.5` | GitHub | `f3ab418a6291` | no |
| `dependabot/npm_and_yarn/multi-96daff8dcb` | GitHub | `a3eb32389566` | no |
| `dependabot/npm_and_yarn/proxy-addr-2.0.8` | GitHub | `5feaa23d1415` | no |
| `dependabot/npm_and_yarn/source-map-js-1.2.2` | GitHub | `8dab7fc08303` | no |
| `dependabot/npm_and_yarn/types/node-26.6.4` | GitHub | `55435fbb4c79` | no |
| `dependabot/npm_and_yarn/typescript-7.0.2` | GitHub | `d68b0514bed7` | no |

The `git ls-remote` tips are the same as the remote-tracking tips in the clone. All work branches are merged at `v2.0.6`. The only unmerged branches are the 8 Dependabot branches, and the register records none of them (see [Choices Made During the Phase](#choices-made-during-the-phase)). The Make Docs PRD validation exited 0 with `status` `passed`, 35 PRD files, 1206 links and 0 diagnostics. The link check of the 13 links in the added register lines gave `bad: 0`. The added lines hold no home-folder path and no email address.

- Limits: 3 local branches are checked out in separate worktrees below `<user-home>/.codex/worktrees/`. This check did not read the uncommitted state of those worktrees.

#### Human Experience Review of the Root Map

- Surface: the root map in `AGENTS.md` and in `CLAUDE.md`.
- Observations: the `kits/make-docs/` row gives an agent the kit router file in one step. The "Where to read first" cell names `kits/make-docs/AGENTS.md` in `AGENTS.md` and `kits/make-docs/CLAUDE.md` in `CLAUDE.md`. Each name agrees with the file that the agent reads, and both files exist. The middle cell says that Make Docs is present and names its source tag, so an agent does not think that the folder is missing. The rule for kit work, below the table, agrees with the row.
- Conclusion: the row supports the routing promise of [02 Architecture Overview, Several Docs Roots](../../prd/02-architecture-overview.md#several-docs-roots).
- Reviewer and limits: the implementing coding agent. The review reads the text and does not measure agent behavior. [Phase 4](04-routing-check-baseline.md) measures it with the routing check.

### Stage 5 - PRD Code Anchors and Validation

Tasks t19 to t21 are done.

- t19: the `make-docs v2.0.6:` code anchors in the root PRDs are now Markdown links, with the anchor text kept as the link text. A113 checks them.
- t20: [R-006](../../prd/03-open-questions-and-risk-register.md#r-006-make-docs-tests-that-assume-the-repository-root) is `Closed`, and its resolution cites A106 and A107.

#### A113 Code Anchor Links

- Claim: a search of `docs/prd/*.md` finds no `make-docs v2.0.6:` anchor outside a Markdown link, and each link target exists in `kits/make-docs/`.
- Result: pass, with one recorded exception (see [Choices Made During the Phase](#choices-made-during-the-phase)).
- Commands: `node <scratchpad>/a113.mjs docs/prd/*.md` (exit 0). For each `make-docs v2.0.6:` text, the script checks that the text is inside the text of a Markdown link and not in a code fence, that a relative target exists, and that the line number is not past the end of the target file. A `grep` that groups the link targets by location.
- Facts: the root PRDs hold 691 anchors: 1 in 00, 5 in 01, 12 in 02, 110 in 03, 287 in 05, 129 in 06, 31 in 07 and 116 in 08. All 691 are inside link text, none is in a code fence, and no line number is past the end of its file. 685 anchors link to a file in `kits/make-docs/` that exists. 6 anchors link to `https://github.com/brucewaynedecoy/make-docs/blob/v2.0.6/package.json`: 2 in [02 Architecture Overview](../../prd/02-architecture-overview.md) (lines 259 and 270) and 4 in [08 Build and Release](../../prd/08-build-and-release.md) (line 99).

#### A114 PRD Authority Validation

- Claim: `make-docs run prd authority validate --target-root .` and `make-docs run prd authority validate --target-root kits/make-docs` each exit 0.
- Result: pass.
- Commands: `make-docs run prd authority validate --target-root .` and `make-docs run prd authority validate --target-root kits/make-docs`, from the repository root (t21).
- Facts: each command exited 0 with `status` `passed` and 0 diagnostics.

#### A115 Link Check and Backlog Snapshot

- Claim: the link-check script reports 0 broken links and 0 missing anchors. `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root .` exits 0, and its only diagnostic is the information code `BACKLOG-VAL-010`.
- Result: pass.
- Commands: the link-check script on the root PRDs, the root `AGENTS.md` and `CLAUDE.md`, and this backlog. `GIT_DIR=/dev/null make-docs run work backlog snapshot --target-root .` ([O-005](../../prd/03-open-questions-and-risk-register.md#o-005-backlog-snapshot-works-below-the-git-root)). Both run from the repository root (t21).
- Facts: the link check reported `bad: 0`. The backlog snapshot exited 0, and its only diagnostic was `BACKLOG-VAL-010`.

### Choices Made During the Phase

- The tag tracks `kits/make-docs/packages/skills/decompose-codebase/scripts/__pycache__/validate_output.cpython-314.pyc`, but line 87 of `kits/make-docs/.gitignore` (`__pycache__`) ignores it. A plain `git add kits/make-docs` leaves it out, so the commit adds it with `git add -f` to match the tag.
- The Make Docs register records no Dependabot branch for porting. [Q-003](../../prd/03-open-questions-and-risk-register.md#q-003-copy-source-and-freeze) closes those pull requests, and Dependabot opens them again in this repository.
- The copied Make Docs register has 36 broken links to the Make Docs PRDs 20, 43 and 44, which v2.0.6 does not have. The same links are in the `v2.0.6` version of the register, so they came with the tag. They stay out of scope for this phase.
- In `kits/make-docs/docs/work/2026-09-24-w25-r0-live-backlog-review-mcp-app/evidence/data-modal/data-modal-artifacts.json`, 3 other entries (`data-modal-final-technical-packet.json`, `data-modal-final-built-resource-proof.json` and `static-small-proof.json`) record byte sizes that do not agree with their files. The files have the same sizes at the `v2.0.6` tag, so the mismatch came with the tag. They stay out of scope for this phase.
- The A113 exception: 6 `package.json` anchors (02 lines 259 and 270, 08 line 99 four times) link to `https://github.com/brucewaynedecoy/make-docs/blob/v2.0.6/package.json`. Stage 2 merged that file into the root `package.json`, so it is not in `kits/make-docs/`. The other 685 anchors link into `kits/make-docs/`.
- On a fresh checkout, `npm run prepack -w kits/make-docs/packages/cli` must run before `npm test`, as in the v2.0.6 CI. This fact is input for [Phase 3](03-ci.md).

### Requirement History

None for this phase. The PRD edits change copy-day facts, methods and code-anchor links, not product requirements. The [root register](../../prd/03-open-questions-and-risk-register.md) keeps the lineage.

### Follow-Up

A separate session drafted the Make Docs work item [W28 R0 Portable Paths](../../../kits/make-docs/docs/work/2026-11-02-w28-r0-portable-paths/00-index.md). It is the permanent fix for home-folder paths: a guard that rejects home paths before a commit, and path writers that record project-relative paths. It follows up the home-path cleanup in A104. It is a draft and is not part of W1 R0 P1.
