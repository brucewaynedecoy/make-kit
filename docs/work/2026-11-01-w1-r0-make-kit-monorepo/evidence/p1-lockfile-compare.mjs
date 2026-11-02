#!/usr/bin/env node
// Compare the dependency entries of the Make Docs v2.0.6 lockfile with the
// make-kit root lockfile (W1 R0 P1, task t9, acceptance A106).
//
// An entry is a lockfile `packages` entry whose key holds `node_modules/` and
// that is not a link to a workspace. Workspace entries (the "" root and the
// workspace folders) and workspace links are left out. Entries are matched by
// their `node_modules/...` key. When a key sits below a workspace folder, the
// folder part is replaced by the workspace package name, so the moved
// workspace folders still match.
//
// Usage:
//   node p1-lockfile-compare.mjs [--old-file <path>] [--old-repo <dir>]
//                                [--old-ref <ref>] [--new-file <path>]
//
// Defaults, resolved from `git rev-parse --show-toplevel`:
//   --old-repo  <toplevel>/../make-docs
//   --old-ref   v2.0.6 (read with `git -C <old-repo> show <ref>:package-lock.json`)
//   --new-file  <toplevel>/package-lock.json
// --old-file reads the old lockfile from a file instead of from git.
//
// Exit codes: 0 when both sides hold the same entries with the same version
// and integrity; 1 when any difference is found; 2 on a usage or read error.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

function fail(message) {
  console.error(`p1-lockfile-compare: ${message}`);
  process.exit(2);
}

function parseArgs(argv) {
  const options = {};
  const names = new Set(["--old-file", "--old-repo", "--old-ref", "--new-file"]);
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      console.log("Usage: node p1-lockfile-compare.mjs [--old-file <path>] [--old-repo <dir>] [--old-ref <ref>] [--new-file <path>]");
      process.exit(0);
    }
    if (!names.has(arg)) fail(`unknown argument: ${arg}`);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) fail(`missing value for ${arg}`);
    options[arg.slice(2)] = value;
    i += 1;
  }
  return options;
}

function repositoryRoot() {
  try {
    return execFileSync("git", ["rev-parse", "--show-toplevel"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    fail("cannot find the repository root with `git rev-parse --show-toplevel`");
  }
}

function parseLock(text, label) {
  let lock;
  try {
    lock = JSON.parse(text);
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
  if (!lock || typeof lock.packages !== "object" || lock.packages === null) {
    fail(`${label} has no "packages" map`);
  }
  return lock;
}

function readOldLock(options, root) {
  if (options["old-file"]) {
    const file = path.resolve(options["old-file"]);
    return { label: options["old-file"], lock: parseLock(readFileSync(file, "utf8"), options["old-file"]) };
  }
  const repo = path.resolve(options["old-repo"] ?? path.join(root, "..", "make-docs"));
  const ref = options["old-ref"] ?? "v2.0.6";
  let text;
  try {
    text = execFileSync("git", ["-C", repo, "show", `${ref}:package-lock.json`], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch {
    fail(`cannot read ${ref}:package-lock.json from the old repository (--old-repo)`);
  }
  return { label: `${ref}:package-lock.json`, lock: parseLock(text, `${ref}:package-lock.json`) };
}

function readNewLock(options, root) {
  const file = path.resolve(options["new-file"] ?? path.join(root, "package-lock.json"));
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    fail(`cannot read the new lockfile (--new-file)`);
  }
  const label = options["new-file"] ?? path.relative(root, file);
  return { label, lock: parseLock(text, label) };
}

// Workspace folders are the entries that are not the "" root and whose key
// holds no `node_modules/` part. Map each folder to its package name.
function workspaceFolders(packages) {
  const folders = new Map();
  for (const [key, value] of Object.entries(packages)) {
    if (key === "" || key.includes("node_modules/")) continue;
    folders.set(key, value.name ?? key);
  }
  return folders;
}

function dependencyEntries(lock) {
  const folders = workspaceFolders(lock.packages);
  const entries = new Map();
  for (const [key, value] of Object.entries(lock.packages)) {
    if (key === "" || !key.includes("node_modules/")) continue;
    if (value.link === true) continue;
    let matchKey = key;
    if (!key.startsWith("node_modules/")) {
      const cut = key.indexOf("/node_modules/");
      const folder = key.slice(0, cut);
      const name = folders.get(folder) ?? folder;
      matchKey = `<workspace ${name}>${key.slice(cut)}`;
    }
    entries.set(matchKey, { key, version: value.version, integrity: value.integrity });
  }
  return entries;
}

const options = parseArgs(process.argv.slice(2));
const root = repositoryRoot();
const oldSide = readOldLock(options, root);
const newSide = readNewLock(options, root);
const oldEntries = dependencyEntries(oldSide.lock);
const newEntries = dependencyEntries(newSide.lock);

const differences = [];
for (const [matchKey, oldEntry] of oldEntries) {
  const newEntry = newEntries.get(matchKey);
  if (!newEntry) {
    differences.push(`missing in new: ${matchKey} version=${oldEntry.version} integrity=${oldEntry.integrity}`);
    continue;
  }
  if (oldEntry.version !== newEntry.version) {
    differences.push(`version differs: ${matchKey} old=${oldEntry.version} new=${newEntry.version}`);
  }
  if (oldEntry.integrity !== newEntry.integrity) {
    differences.push(`integrity differs: ${matchKey} old=${oldEntry.integrity} new=${newEntry.integrity}`);
  }
}
for (const [matchKey, newEntry] of newEntries) {
  if (!oldEntries.has(matchKey)) {
    differences.push(`extra in new: ${matchKey} version=${newEntry.version} integrity=${newEntry.integrity}`);
  }
}

console.log(`old: ${oldSide.label} (lockfileVersion ${oldSide.lock.lockfileVersion}) entries=${oldEntries.size}`);
console.log(`new: ${newSide.label} (lockfileVersion ${newSide.lock.lockfileVersion}) entries=${newEntries.size}`);
for (const line of differences) console.log(line);
console.log(`differences=${differences.length}`);
process.exit(differences.length === 0 ? 0 : 1);
