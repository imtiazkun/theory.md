"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => TheoryPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian9 = require("obsidian");

// src/commit.ts
var import_obsidian = require("obsidian");

// src/vault.ts
var import_child_process = require("child_process");
var import_fs = require("fs");
var import_promises = require("fs/promises");
var import_path = require("path");
var import_util = require("util");
var run = (0, import_util.promisify)(import_child_process.execFile);
var TOOL_PATH = [
  process.env.PATH,
  "/usr/bin",
  "/usr/local/bin",
  "/opt/homebrew/bin",
  process.env.HOME && `${process.env.HOME}/.local/bin`
].filter(Boolean).join(":");
var GITIGNORE_LINES = [
  ".DS_Store",
  ".trash/",
  ".obsidian/workspace*.json",
  // Holds each person's own author details.
  ".obsidian/plugins/theory-md/data.json"
];
function isVaultSetUp(basePath) {
  return (0, import_fs.existsSync)((0, import_path.join)(basePath, ".git"));
}
async function git(basePath, args) {
  return run("git", args, {
    cwd: basePath,
    env: { ...process.env, PATH: TOOL_PATH },
    // Diffs of a large model can exceed the 1 MB default.
    maxBuffer: 64 * 1024 * 1024
  });
}
async function hasGitConfig(basePath, key) {
  try {
    const { stdout } = await git(basePath, ["config", "--get", key]);
    return stdout.trim() !== "";
  } catch {
    return false;
  }
}
async function ensureGitignore(basePath) {
  const path = (0, import_path.join)(basePath, ".gitignore");
  const existing = (0, import_fs.existsSync)(path) ? await (0, import_promises.readFile)(path, "utf8") : "";
  const present = new Set(existing.split("\n").map((line) => line.trim()));
  const missing = GITIGNORE_LINES.filter((line) => !present.has(line));
  if (missing.length === 0) return;
  const prefix = existing === "" || existing.endsWith("\n") ? existing : existing + "\n";
  await (0, import_promises.writeFile)(path, prefix + missing.join("\n") + "\n");
}
async function identityArgs(basePath, author) {
  if (!author.fullName && !await hasGitConfig(basePath, "user.name")) {
    throw new Error("Set your full name in theory.md settings first.");
  }
  if (!author.email && !await hasGitConfig(basePath, "user.email")) {
    throw new Error("Set your email address in theory.md settings first.");
  }
  const args = [];
  if (author.fullName) args.push("-c", `user.name=${author.fullName}`);
  if (author.email) args.push("-c", `user.email=${author.email}`);
  return args;
}
async function addStarterFiles(basePath, files) {
  const existing = new Set((await (0, import_promises.readdir)(basePath)).map((name) => name.toLowerCase()));
  for (const file of files) {
    if (file.sameAs.some((name) => existing.has(name.toLowerCase()))) continue;
    await (0, import_promises.writeFile)((0, import_path.join)(basePath, file.path), file.content);
  }
}
async function setUpVault(basePath, author, starterFiles2) {
  if (isVaultSetUp(basePath)) return;
  const identity = await identityArgs(basePath, author);
  await addStarterFiles(basePath, starterFiles2);
  await git(basePath, ["init", "-b", "main"]);
  await ensureGitignore(basePath);
  await git(basePath, ["add", "-A"]);
  await git(basePath, [...identity, "commit", "--allow-empty", "-m", "Initial commit"]);
}
async function changedFiles(basePath) {
  const { stdout } = await git(basePath, ["status", "--porcelain", "-z", "--untracked-files=all"]);
  const entries = stdout.split("\0").filter((entry) => entry !== "");
  const paths = [];
  for (let i = 0; i < entries.length; i++) {
    const status = entries[i].slice(0, 2);
    paths.push(entries[i].slice(3));
    if (status.includes("R") || status.includes("C")) i++;
  }
  return paths;
}
async function commit(basePath, author, message, paths) {
  const identity = await identityArgs(basePath, author);
  if (paths === "all") {
    await git(basePath, ["add", "-A"]);
    await git(basePath, [...identity, "commit", "-m", message]);
  } else {
    await git(basePath, ["add", "-A", "--", ...paths]);
    await git(basePath, [...identity, "commit", "-m", message, "--", ...paths]);
  }
  const { stdout } = await git(basePath, ["rev-parse", "--short", "HEAD"]);
  return stdout.trim();
}
var FIELD = "";
async function fileHistory(basePath, filePath) {
  const format = ["%H", "%an", "%ae", "%aI", "%s"].join(FIELD);
  let stdout;
  try {
    ({ stdout } = await git(basePath, [
      "log",
      "--follow",
      `--format=${format}`,
      "--",
      filePath
    ]));
  } catch (error) {
    if (String(error).includes("does not have any commits")) return [];
    throw error;
  }
  return stdout.split("\n").filter((line) => line !== "").map((line) => {
    const [hash, author, email, date, subject] = line.split(FIELD);
    return { hash, author, email, date: new Date(date), subject };
  });
}
async function hasUncommittedChanges(basePath, filePath) {
  const { stdout } = await git(basePath, ["status", "--porcelain", "--", filePath]);
  return stdout.trim() !== "";
}

// src/commit.ts
function commitIcon() {
  return (0, import_obsidian.getIconIds)().includes("lucide-git-commit-horizontal") ? "git-commit-horizontal" : "git-commit";
}
var CommitModal = class extends import_obsidian.Modal {
  constructor(app, plugin, file, otherChanges) {
    super(app);
    this.plugin = plugin;
    this.file = file;
    this.otherChanges = otherChanges;
  }
  plugin;
  file;
  otherChanges;
  includeAll = false;
  onOpen() {
    const { contentEl } = this;
    this.setTitle("Commit changes");
    contentEl.addClass("theory-commit");
    const { file } = this;
    const count = this.otherChanges.length;
    const chip = contentEl.createDiv({ cls: "theory-commit-file" });
    (0, import_obsidian.setIcon)(chip.createSpan({ cls: "theory-commit-file-icon" }), file ? "file-text" : "files");
    chip.createSpan({ text: file ? file.path : `${count} changed ${count === 1 ? "file" : "files"}` });
    if (!file) chip.setAttr("title", this.otherChanges.join("\n"));
    const message = contentEl.createEl("textarea", {
      cls: "theory-commit-message",
      attr: { rows: "3", placeholder: "Describe what changed", "aria-label": "Commit message" }
    });
    message.value = file ? `Update ${file.basename}` : "Update model";
    if (file && count > 0) {
      new import_obsidian.Setting(contentEl).setName("Include all changed files").setDesc(`${count} other ${count === 1 ? "file has" : "files have"} uncommitted changes.`).addToggle(
        (toggle) => toggle.setValue(this.includeAll).onChange((value) => this.includeAll = value)
      );
    }
    const footer = contentEl.createDiv({ cls: "theory-commit-footer" });
    const { fullName, email } = this.plugin.settings;
    footer.createDiv({
      cls: "theory-commit-author",
      text: fullName ? `Signed as ${fullName}${email ? ` <${email}>` : ""}` : "Signed with your git identity"
    });
    const buttons = footer.createDiv({ cls: "modal-button-container" });
    buttons.createEl("button", { text: "Cancel" }).addEventListener("click", () => this.close());
    const submit = buttons.createEl("button", {
      cls: "mod-cta",
      text: "Commit",
      attr: { "aria-label": "Commit (\u2318/Ctrl + Enter)" }
    });
    const updateSubmit = () => submit.disabled = message.value.trim() === "";
    message.addEventListener("input", updateSubmit);
    message.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        submit.click();
      }
    });
    submit.addEventListener("click", async () => {
      if (submit.disabled) return;
      submit.disabled = true;
      submit.setText("Committing\u2026");
      const done = await this.plugin.commitChanges(
        message.value.trim(),
        this.includeAll || !file ? "all" : [file.path]
      );
      if (done) {
        this.close();
      } else {
        submit.setText("Commit");
        updateSubmit();
      }
    });
    updateSubmit();
    message.focus();
    message.select();
  }
  onClose() {
    this.contentEl.empty();
  }
};
var CommitButtons = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  plugin;
  buttons = /* @__PURE__ */ new Map();
  // Ignores results from an older sync that finishes after a newer one.
  syncId = 0;
  async sync() {
    const id = ++this.syncId;
    const setUp = this.plugin.isVaultSetUp();
    const basePath = setUp ? this.plugin.getVaultPath() : "";
    for (const [view, button] of this.buttons) {
      if (!button.isConnected) this.buttons.delete(view);
    }
    for (const leaf of this.plugin.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (!(view instanceof import_obsidian.MarkdownView)) continue;
      let button = this.buttons.get(view);
      if (!button) {
        button = view.addAction(commitIcon(), "Commit changes", () => this.plugin.openCommitModal(view.file));
        button.addClass("theory-commit-button");
        this.buttons.set(view, button);
      }
      button.toggle(setUp && view.file !== null);
      if (!setUp || !view.file) continue;
      const file = view.file;
      const dirty = await hasUncommittedChanges(basePath, file.path).catch(() => false);
      if (id !== this.syncId) return;
      if (view.file !== file) continue;
      button.toggleClass("is-dirty", dirty);
      button.setAttr("aria-label", dirty ? "Commit changes" : "No changes to commit");
    }
  }
  removeAll() {
    for (const button of this.buttons.values()) button.remove();
    this.buttons.clear();
  }
};

// src/compile-button.ts
var import_obsidian2 = require("obsidian");

// src/compile.ts
var import_child_process2 = require("child_process");
var import_crypto = require("crypto");
var import_fs3 = require("fs");
var import_promises3 = require("fs/promises");
var import_os = require("os");
var import_path4 = require("path");

// src/anchor.ts
var import_promises2 = require("fs/promises");
var import_path2 = require("path");
var MAX_PROBLEM_CHARS = 2e3;
var MAX_ANCHOR_CHARS = 300;
var MAX_ANCHORS = 5;
function plainProblem(text) {
  return { text, anchors: [] };
}
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function normalizeHeading(heading) {
  return heading.replace(/^#+/, "").trim().replace(/\s+/g, " ").toLowerCase();
}
function findAnchor(text, anchor) {
  if (anchor.quote) {
    const words = anchor.quote.trim().split(/\s+/).filter(Boolean).map(escapeRegExp);
    const match = words.length > 0 ? new RegExp(words.join("\\s+")).exec(text) : null;
    if (match) return { from: match.index, to: match.index + match[0].length };
  }
  if (anchor.heading) {
    const wanted = normalizeHeading(anchor.heading);
    for (const match of text.matchAll(/^#{1,6}[ \t]+(.*)$/gm)) {
      if (normalizeHeading(match[1]) === wanted) return { from: match.index, to: match.index + match[0].length };
    }
  }
  return null;
}
async function checkAnchor(snapshot, claimed) {
  const { path, heading, quote } = claimed ?? {};
  if (typeof path !== "string") return null;
  const relative3 = import_path2.posix.normalize(path.trim().replace(/^\.?\//, ""));
  if (relative3 === "." || relative3 === ".." || relative3.startsWith("../") || import_path2.posix.isAbsolute(relative3)) return null;
  const full = await (0, import_promises2.realpath)((0, import_path2.join)(snapshot, relative3)).catch(() => null);
  if (!full || !full.startsWith(snapshot + import_path2.sep) || !(await (0, import_promises2.stat)(full)).isFile()) return null;
  const text = await (0, import_promises2.readFile)(full, "utf8");
  const anchor = { path: relative3 };
  if (typeof heading === "string" && heading.trim()) {
    const candidate = heading.trim().slice(0, MAX_ANCHOR_CHARS);
    if (findAnchor(text, { path: relative3, heading: candidate })) anchor.heading = candidate;
  }
  if (typeof quote === "string" && quote.trim()) {
    const candidate = quote.trim().slice(0, MAX_ANCHOR_CHARS);
    if (findAnchor(text, { path: relative3, quote: candidate })) anchor.quote = candidate;
  }
  return anchor;
}
async function checkProblems(snapshot, claimed) {
  if (!Array.isArray(claimed)) return [];
  const problems = [];
  for (const item of claimed) {
    const { problem, anchors } = typeof item === "string" ? { problem: item } : item ?? {};
    if (typeof problem !== "string" || !problem.trim()) continue;
    const checked = [];
    if (snapshot && Array.isArray(anchors)) {
      for (const claimedAnchor of anchors.slice(0, MAX_ANCHORS)) {
        const anchor = await checkAnchor(snapshot, claimedAnchor).catch(() => null);
        if (anchor) checked.push(anchor);
      }
    }
    problems.push({ text: problem.trim().slice(0, MAX_PROBLEM_CHARS), anchors: checked });
  }
  return problems;
}

// src/project.ts
var import_fs2 = require("fs");
var import_path3 = require("path");
function isRepo(path) {
  return (0, import_fs2.existsSync)((0, import_path3.join)(path, ".git"));
}
function findProjectRepos(folder) {
  if (!folder || !(0, import_fs2.existsSync)(folder) || !(0, import_fs2.statSync)(folder).isDirectory()) return { kind: "missing" };
  if (isRepo(folder)) return { kind: "root", repos: [folder] };
  const repos = (0, import_fs2.readdirSync)(folder, { withFileTypes: true }).filter((entry) => entry.isDirectory() && !entry.name.startsWith(".")).map((entry) => (0, import_path3.join)(folder, entry.name)).filter(isRepo).sort((a, b) => (0, import_path3.basename)(a).localeCompare((0, import_path3.basename)(b)));
  return repos.length > 0 ? { kind: "children", repos } : { kind: "none" };
}
async function pickFolder(defaultPath) {
  const dialog = window.electron?.remote?.dialog;
  if (!dialog) throw new Error("The folder picker is only available in the desktop app.");
  const result = await dialog.showOpenDialog({
    title: "Choose the project folder",
    defaultPath: defaultPath || void 0,
    buttonLabel: "Choose",
    properties: ["openDirectory", "createDirectory", "dontAddToRecent"]
  });
  return result.canceled || result.filePaths.length === 0 ? null : result.filePaths[0];
}

// src/compile.ts
var COMPILED_TAG = "theory/compiled";
var EMPTY_TREE = "4b825dc642cb6eb9a060e54bf8d69288fbee4904";
var MAX_DIFF_CHARS = 2e5;
var MAX_LOG_LINES = 500;
async function pendingRevisionCount(vaultPath) {
  const head = await headCommit(vaultPath).catch(() => null);
  if (!head) return 0;
  const from = await tagCommit(vaultPath);
  if (from === head) return 0;
  const { stdout } = await git(vaultPath, ["rev-list", "--count", from ? `${from}..${head}` : head]);
  return Number(stdout.trim()) || 0;
}
var NothingToCompileError = class extends Error {
};
var REPORT_SCHEMA = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["succeeded", "failed"] },
    summary: { type: "string", description: "What this compile did, in two or three sentences." },
    changes: { type: "array", items: { type: "string" }, description: "Each change made to the code." },
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          notes: {
            type: "array",
            items: { type: "string" },
            description: "Model file paths the question is about, relative to the model directory."
          }
        },
        required: ["question", "notes"]
      }
    },
    problems: {
      type: "array",
      items: {
        type: "object",
        properties: {
          problem: { type: "string" },
          anchors: {
            type: "array",
            description: "Where in the model the problem comes from. Empty when it isn't about the model.",
            items: {
              type: "object",
              properties: {
                path: { type: "string", description: "Model file path, relative to the model directory." },
                heading: { type: "string", description: "Heading the problem sits under, as written." },
                quote: {
                  type: "string",
                  description: "Short text copied exactly from the note, Markdown included. One sentence at most."
                }
              },
              required: ["path"]
            }
          }
        },
        required: ["problem", "anchors"]
      }
    }
  },
  required: ["status", "summary", "changes", "questions", "problems"]
};
async function tagCommit(vaultPath) {
  try {
    const { stdout } = await git(vaultPath, ["rev-parse", "--verify", "--quiet", `refs/tags/${COMPILED_TAG}^{commit}`]);
    return stdout.trim() || null;
  } catch {
    return null;
  }
}
async function headCommit(vaultPath) {
  try {
    const { stdout } = await git(vaultPath, ["rev-parse", "--verify", "HEAD"]);
    return stdout.trim();
  } catch {
    throw new Error("The vault has no commits yet. Commit your notes first.");
  }
}
var FIELD2 = "";
async function revisionsBetween(vaultPath, from, to) {
  const format = ["%H", "%an", "%aI", "%s"].join(FIELD2);
  const { stdout } = await git(vaultPath, ["log", "--reverse", `--format=${format}`, from ? `${from}..${to}` : to]);
  return stdout.split("\n").filter((line) => line !== "").map((line) => {
    const [hash, author, date, subject] = line.split(FIELD2);
    return { hash, author, date, subject };
  });
}
async function modelDiff(vaultPath, from, to) {
  const { stdout } = await git(vaultPath, ["diff", "--stat", "--patch", from ?? EMPTY_TREE, to]);
  if (stdout.length <= MAX_DIFF_CHARS) return stdout;
  return stdout.slice(0, MAX_DIFF_CHARS) + "\n\n[Diff cut short. Read the changed files in the model directory.]\n";
}
async function changedNotes(vaultPath, from, to) {
  const { stdout } = await git(vaultPath, ["diff", "--name-only", "-z", "--diff-filter=d", from ?? EMPTY_TREE, to]);
  return stdout.split("\0").filter((path) => path.toLowerCase().endsWith(".md"));
}
async function workingTreeState(vaultPath) {
  const { stdout } = await git(vaultPath, ["status", "--porcelain", "-z", "--untracked-files=all"]);
  const state = /* @__PURE__ */ new Map();
  for (const entry of stdout.split("\0")) {
    if (entry === "") continue;
    const path = entry.slice(3);
    const full = (0, import_path4.join)(vaultPath, path);
    state.set(path, (0, import_fs3.existsSync)(full) ? String((0, import_fs3.statSync)(full).mtimeMs) : "deleted");
  }
  return state;
}
async function createSnapshot(vaultPath, commit2) {
  const dir = await (0, import_promises3.realpath)(await (0, import_promises3.mkdtemp)((0, import_path4.join)((0, import_os.tmpdir)(), "theory-model-")));
  const archive = `${dir}.tar`;
  await git(vaultPath, ["archive", "--format=tar", "-o", archive, commit2]);
  await runTool("tar", ["-xf", archive, "-C", dir]);
  await (0, import_promises3.rm)(archive, { force: true });
  await runTool("chmod", ["-R", "a-w", dir]);
  return dir;
}
async function removeSnapshot(dir) {
  await runTool("chmod", ["-R", "u+w", dir]).catch(() => {
  });
  await (0, import_promises3.rm)(dir, { recursive: true, force: true });
}
async function hashTree(dir) {
  const hash = (0, import_crypto.createHash)("sha256");
  const walk = async (sub) => {
    const entries = await (0, import_promises3.readdir)((0, import_path4.join)(dir, sub), { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const path = (0, import_path4.join)(sub, entry.name);
      hash.update(path + "\0");
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile()) hash.update(await (0, import_promises3.readFile)((0, import_path4.join)(dir, path)));
    }
  };
  await walk("");
  return hash.digest("hex");
}
function runTool(command, args) {
  return new Promise((resolve, reject) => {
    const child = (0, import_child_process2.spawn)(command, args, { env: { ...process.env, PATH: TOOL_PATH } });
    let stderr = "";
    child.stderr.on("data", (chunk) => stderr += chunk);
    child.on("error", reject);
    child.on(
      "close",
      (code) => code === 0 ? resolve() : reject(new Error(`${command} failed: ${stderr.trim() || `exit ${code}`}`))
    );
  });
}
function buildPrompt(params) {
  const { snapshot, projectFolder, head, from, revisions, diff } = params;
  const found = findProjectRepos(projectFolder);
  const repoList = found.kind === "root" ? "The project folder is a single git repository." : found.kind === "children" ? `Git repositories in the project folder:
${found.repos.map((repo) => `- ${(0, import_path4.relative)(projectFolder, repo)}`).join("\n")}` : "The project folder has no git repositories yet.";
  const revisionList = revisions.map((r) => `- ${r.hash.slice(0, 7)} ${r.date} ${r.author}: ${r.subject}`).join("\n");
  return `You are compiling a theoretical model into software.

The theoretical model is a set of notes, written only by humans, that describes a software ecosystem: what it does and why. Your job is to change the code in the project folder (the current directory) so that it matches the model. A model change may touch one repository, several, or none.

The model at revision ${head} is in this directory: ${snapshot}

${repoList}

Rules:
- The model is read-only. Never create, edit, move or delete anything in the model directory, and never write to the Obsidian vault it came from. Writing to the model is forbidden.
- The model is the source of truth. If the code disagrees with the model, change the code.
- A note whose front matter has \`realized: false\` is written ahead of the code. Don't build what it describes yet, and don't count it as a mismatch.
- If the model is unclear, incomplete or contradicts itself, don't guess. Add a question to \`questions\`, naming the model files it is about with paths relative to the model directory. Carry on with the parts that are clear.
- Only change files inside the project folder.
- Before changing a repository, read its AGENTS.md (and CLAUDE.md, if there is one) and follow its rules, including how to test.
- When you commit in a code repository, end each commit message with the trailer \`Model-Revision: ${head}\`.
- When the project has several repositories, start each entry in \`changes\` and \`problems\` with the repository name in brackets, e.g. "[mobile] ...".
- Put anything that went wrong (steps you couldn't do) in \`problems\`.
- When a problem comes from something in the model, give it \`anchors\`: the model file, the heading it sits under, and a short quote copied exactly from the note (under 200 characters). Engineers see these as highlights in the note. Leave \`anchors\` empty when the problem isn't about the model.
- Set \`status\` to "failed" if the code doesn't match the model at the end.

## Revisions since the last compile

${from ? `Last compiled revision: ${from}` : "This is the first compile, so the whole model is new."}

${revisionList}

## Changes to the model

\`\`\`diff
${diff}
\`\`\`
`;
}
function describeToolUse(name, input) {
  const detail = input.command ?? input.file_path ?? input.path ?? input.pattern ?? input.description ?? "";
  const text = String(detail).split("\n")[0];
  return text ? `${name}: ${text.length > 160 ? text.slice(0, 157) + "\u2026" : text}` : name;
}
async function startCompile(options, onUpdate) {
  const { vaultPath, projectFolder } = options;
  if (!projectFolder) throw new Error("Choose the project folder in theory.md settings first.");
  if (!(0, import_fs3.existsSync)(projectFolder) || !(0, import_fs3.statSync)(projectFolder).isDirectory()) {
    throw new Error(`The project folder doesn't exist: ${projectFolder}`);
  }
  const head = await headCommit(vaultPath);
  const from = await tagCommit(vaultPath);
  if (from === head) throw new NothingToCompileError("Every committed revision is already compiled.");
  const revisions = await revisionsBetween(vaultPath, from, head);
  const diff = await modelDiff(vaultPath, from, head);
  const notes = await changedNotes(vaultPath, from, head);
  const snapshot = await createSnapshot(vaultPath, head);
  const snapshotHash = await hashTree(snapshot);
  const vaultBefore = await workingTreeState(vaultPath);
  const report = {
    id: `${Date.now()}`,
    status: "running",
    startedAt: (/* @__PURE__ */ new Date()).toISOString(),
    fromCommit: from,
    toCommit: head,
    revisions,
    summary: "",
    changes: [],
    questions: [],
    problems: [],
    log: []
  };
  const protectedPaths = [vaultPath, snapshot];
  const disallowed = protectedPaths.flatMap(
    (path) => ["Edit", "Write", "NotebookEdit"].map((tool) => `${tool}(//${path.replace(/^\//, "")}/**)`)
  );
  const args = [
    "-p",
    "--output-format",
    "stream-json",
    "--verbose",
    "--no-session-persistence",
    "--permission-mode",
    options.permissionMode,
    "--add-dir",
    snapshot,
    "--json-schema",
    JSON.stringify(REPORT_SCHEMA),
    "--disallowedTools",
    ...disallowed
  ];
  const allowed = options.allowedTools.trim();
  if (allowed) args.push("--allowedTools", allowed);
  let child;
  try {
    child = (0, import_child_process2.spawn)(options.claudeCommand || "claude", args, {
      cwd: projectFolder,
      env: { ...process.env, PATH: TOOL_PATH }
    });
  } catch (error) {
    await removeSnapshot(snapshot);
    throw error;
  }
  let cancelled = false;
  const log = (line) => {
    report.log.push(line);
    if (report.log.length > MAX_LOG_LINES) report.log.shift();
    onUpdate(report);
  };
  const claudeDone = new Promise(
    (resolve) => {
      let result = null;
      let buffer = "";
      let stderr = "";
      const handleLine = (line) => {
        if (!line.trim()) return;
        let event;
        try {
          event = JSON.parse(line);
        } catch {
          return;
        }
        if (event.type === "assistant") {
          for (const block of event.message?.content ?? []) {
            if (block.type === "tool_use" && block.name !== "StructuredOutput") {
              log(describeToolUse(block.name, block.input ?? {}));
            }
          }
        } else if (event.type === "result") {
          result = {
            isError: Boolean(event.is_error) || event.subtype !== "success",
            text: typeof event.result === "string" ? event.result : "",
            structured: event.structured_output
          };
        }
      };
      child.stdout?.on("data", (chunk) => {
        buffer += chunk;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        lines.forEach(handleLine);
      });
      child.stderr?.on("data", (chunk) => stderr += chunk);
      child.on("error", (error) => resolve({ result, code: null, error, stderr }));
      child.on("close", (code) => {
        handleLine(buffer);
        resolve({ result, code, stderr });
      });
      child.stdin?.end(buildPrompt({ snapshot, projectFolder, head, from, revisions, diff }));
    }
  );
  const done = (async () => {
    const { result, code, error, stderr } = await claudeDone;
    try {
      if (cancelled) {
        report.status = "cancelled";
        report.summary = "You cancelled this compile. The last compile marker didn't move.";
        return report;
      }
      if (error) {
        report.status = "failed";
        report.summary = "Claude Code couldn't be started.";
        report.problems.push(
          plainProblem(
            error.code === "ENOENT" ? `Couldn't find the Claude Code CLI ("${options.claudeCommand}"). Set its path in theory.md settings.` : error.message
          )
        );
        return report;
      }
      report.suspectNotes = notes;
      const structured = result?.structured;
      let claimedProblems = [];
      if (structured) {
        report.status = structured.status === "succeeded" && !result?.isError ? "succeeded" : "failed";
        report.summary = structured.summary;
        report.changes = structured.changes ?? [];
        report.questions = (structured.questions ?? []).map((q) => ({
          question: q.question,
          notes: (q.notes ?? []).map((note) => note.replace(/^\.?\//, ""))
        }));
        claimedProblems = structured.problems;
      } else {
        report.status = "failed";
        report.summary = result?.text || "Claude Code finished without a report.";
        if (code !== 0) {
          report.problems.push(plainProblem(`Claude Code exited with code ${code}. ${stderr.trim()}`.trim()));
        }
      }
      const intact = await hashTree(snapshot).catch(() => "") === snapshotHash;
      report.problems.push(...await checkProblems(intact ? snapshot : null, claimedProblems));
      if (!intact) {
        report.status = "failed";
        report.problems.unshift(plainProblem("Claude tried to change the model snapshot. Those changes were thrown away."));
      }
      const vaultAfter = await workingTreeState(vaultPath);
      const touched = [...vaultAfter].filter(([path, mark]) => vaultBefore.get(path) !== mark).map(([path]) => path);
      if (touched.length > 0) {
        report.problems.unshift(
          plainProblem(
            `These vault files changed while the compile ran: ${touched.join(", ")}. If you didn't edit them, revert them.`
          )
        );
      }
      await git(vaultPath, ["tag", "-f", COMPILED_TAG, head]);
      return report;
    } finally {
      report.finishedAt = (/* @__PURE__ */ new Date()).toISOString();
      await removeSnapshot(snapshot);
      onUpdate(report);
    }
  })();
  return {
    report,
    done,
    cancel() {
      if (report.status !== "running" || cancelled) return;
      cancelled = true;
      child.kill("SIGTERM");
    }
  };
}

// src/compile-button.ts
var COMPILE_KINDS = ["running", "setup", "ready", "failed", "idle"];
function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}
var CompileButton = class {
  constructor(plugin) {
    this.plugin = plugin;
    this.barEl = createDiv({ cls: "theory-action-bar" });
    this.commitEl = this.barEl.createEl("button", { cls: "theory-fab theory-commit-fab" });
    (0, import_obsidian2.setIcon)(this.commitEl, commitIcon());
    this.commitEl.addEventListener("click", () => this.onCommitClick());
    this.compileEl = this.barEl.createEl("button", { cls: "theory-fab theory-compile-fab" });
    this.iconEl = this.compileEl.createSpan({ cls: "theory-compile-fab-icon" });
    this.labelEl = this.compileEl.createSpan({ cls: "theory-compile-fab-label" });
    this.badgeEl = this.compileEl.createSpan({ cls: "theory-compile-fab-badge" });
    this.compileEl.addEventListener("click", () => this.onCompileClick());
    this.render();
  }
  plugin;
  barEl;
  commitEl;
  compileEl;
  iconEl;
  labelEl;
  badgeEl;
  state = { compile: { kind: "hidden" }, changed: [] };
  // Ignores results from an older refresh that finishes after a newer one.
  refreshId = 0;
  observed = null;
  movedStatusBar = null;
  resizeObserver = new ResizeObserver(() => this.position());
  onWindowResize = () => this.position();
  /**
   * Floats the bar over the bottom right of the editor area. It lives on the body,
   * because inside the editor's flex layout Obsidian treats it as another pane.
   */
  attach() {
    if (!this.barEl.isConnected) {
      document.body.appendChild(this.barEl);
      window.addEventListener("resize", this.onWindowResize);
    }
    const root = this.plugin.app.workspace.rootSplit;
    if (this.observed !== root.containerEl) {
      if (this.observed) this.resizeObserver.unobserve(this.observed);
      this.observed = root.containerEl;
      this.resizeObserver.observe(root.containerEl);
    }
    this.position();
  }
  detach() {
    this.resizeObserver.disconnect();
    this.observed = null;
    window.removeEventListener("resize", this.onWindowResize);
    this.restoreStatusBar();
    this.barEl.remove();
  }
  /** Keeps the bar in the editor area's corner as sidebars open, close and resize. */
  position() {
    if (!this.observed) return;
    const rect = this.observed.getBoundingClientRect();
    const shown = this.state.compile.kind !== "hidden";
    if (shown) this.moveStatusBar(rect.left);
    else this.restoreStatusBar();
    let bottom = rect.bottom;
    const bar = document.body.querySelector(".status-bar");
    if (bar && bar.getClientRects().length > 0) {
      const barRect = bar.getBoundingClientRect();
      const left = rect.right - this.barEl.offsetWidth - 32;
      if (barRect.top < bottom && barRect.right > left) bottom = barRect.top;
    }
    this.barEl.style.right = `${window.innerWidth - rect.right}px`;
    this.barEl.style.bottom = `${window.innerHeight - bottom}px`;
    this.barEl.toggleClass("is-offscreen", rect.width === 0 || rect.height === 0);
  }
  /** Moves Obsidian's status bar to the editor's bottom left, so the right corner is free. */
  moveStatusBar(left) {
    const bar = document.body.querySelector(".status-bar");
    if (!bar) return;
    if (this.movedStatusBar && this.movedStatusBar !== bar) this.restoreStatusBar();
    this.movedStatusBar = bar;
    bar.style.setProperty("inset-inline-end", "auto");
    bar.style.setProperty("right", "auto");
    bar.style.setProperty("left", `${left}px`);
    bar.style.setProperty("--status-bar-radius", "0 var(--radius-m) 0 0");
    bar.style.setProperty("--status-bar-border-width", "1px 1px 0 0");
  }
  restoreStatusBar() {
    const bar = this.movedStatusBar;
    if (!bar) return;
    for (const property of ["inset-inline-end", "right", "left", "--status-bar-radius", "--status-bar-border-width"]) {
      bar.style.removeProperty(property);
    }
    this.movedStatusBar = null;
  }
  async refresh() {
    const id = ++this.refreshId;
    const state = await this.readState().catch(() => ({ compile: { kind: "hidden" }, changed: [] }));
    if (id !== this.refreshId) return;
    this.state = state;
    this.render();
    this.position();
  }
  async readState() {
    const { plugin } = this;
    if (!plugin.settings.showCompileButton || !plugin.isVaultSetUp()) {
      return { compile: { kind: "hidden" }, changed: [] };
    }
    const vaultPath = plugin.getVaultPath();
    const changed = (await changedFiles(vaultPath)).filter((path) => !path.startsWith(".obsidian/"));
    if (plugin.isCompiling()) return { compile: { kind: "running" }, changed };
    if (!plugin.settings.projectFolder) return { compile: { kind: "setup" }, changed };
    const pending = await pendingRevisionCount(vaultPath);
    if (pending > 0) return { compile: { kind: "ready", pending }, changed };
    if (plugin.reports[0]?.status === "failed") return { compile: { kind: "failed" }, changed };
    return { compile: { kind: "idle" }, changed };
  }
  render() {
    const { compile } = this.state;
    this.barEl.toggle(compile.kind !== "hidden");
    if (compile.kind === "hidden") return;
    this.renderCommit();
    this.renderCompile(compile);
  }
  renderCommit() {
    const { changed } = this.state;
    const active = this.activeChangedFile();
    const dirty = changed.length > 0;
    this.commitEl.toggleClass("is-dirty", dirty);
    this.commitEl.setAttr("aria-disabled", String(!dirty));
    (0, import_obsidian2.setTooltip)(
      this.commitEl,
      active ? `Commit changes to ${active.basename}` : dirty ? `Commit ${plural(changed.length, "changed file", "changed files")}` : "No changes to commit",
      { placement: "top" }
    );
  }
  renderCompile(compile) {
    for (const kind of COMPILE_KINDS) this.compileEl.toggleClass(`is-${kind}`, compile.kind === kind);
    this.badgeEl.empty();
    this.badgeEl.hide();
    const uncommitted = this.state.changed.length;
    const uncommittedNote = uncommitted > 0 ? `
${plural(uncommitted, "file has", "files have")} uncommitted changes, which won't be compiled.` : "";
    switch (compile.kind) {
      case "running":
        this.show("loader", "Compiling\u2026", "A compile is running. Click to follow it.");
        break;
      case "setup":
        this.show("settings", "Set up Compile", "Choose the project folder this model compiles into.");
        break;
      case "ready":
        this.show(
          "hammer",
          "Compile",
          `Compile ${plural(compile.pending, "new revision", "new revisions")} into the code.${uncommittedNote}`
        );
        this.badgeEl.setText(String(compile.pending));
        this.badgeEl.show();
        break;
      case "failed":
        this.show("alert-triangle", "Last compile failed", `Click to see what went wrong.${uncommittedNote}`);
        break;
      case "idle":
        this.show(
          "check",
          "Up to date",
          `Every committed revision is compiled.${uncommittedNote || "\nCommit changes to the model to compile them."}`
        );
        break;
    }
  }
  show(icon2, label, tooltip) {
    (0, import_obsidian2.setIcon)(this.iconEl, icon2);
    this.labelEl.setText(label);
    (0, import_obsidian2.setTooltip)(this.compileEl, tooltip, { placement: "top" });
  }
  /** The open note, when it has uncommitted changes. */
  activeChangedFile() {
    const file = this.plugin.app.workspace.getActiveFile();
    return file && this.state.changed.includes(file.path) ? file : null;
  }
  onCommitClick() {
    const active = this.activeChangedFile();
    if (active) this.plugin.openCommitModal(active);
    else if (this.state.changed.length > 0) this.plugin.openCommitAllModal();
  }
  onCompileClick() {
    switch (this.state.compile.kind) {
      case "ready":
        this.plugin.compile();
        break;
      case "setup":
        this.plugin.openSettings();
        break;
      default:
        this.plugin.showReportView();
    }
  }
};

// src/report-view.ts
var import_obsidian3 = require("obsidian");
var REPORT_VIEW_TYPE = "theory-compile-report";
var STATUS_TEXT = {
  running: "Compiling\u2026",
  succeeded: "Compiled",
  failed: "Failed",
  cancelled: "Cancelled"
};
var STATUS_ICON = {
  running: "loader",
  succeeded: "check-circle",
  failed: "alert-triangle",
  cancelled: "x-circle"
};
function shortHash(hash) {
  return hash ? hash.slice(0, 7) : "start";
}
var CompileReportView = class extends import_obsidian3.ItemView {
  plugin;
  // The report on screen; null follows the newest one.
  selectedId = null;
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return REPORT_VIEW_TYPE;
  }
  getDisplayText() {
    return "Compile report";
  }
  getIcon() {
    return "hammer";
  }
  async onOpen() {
    this.refresh();
  }
  /** Shows the newest report, e.g. when a compile starts. */
  showLatest() {
    this.selectedId = null;
    this.refresh();
  }
  refresh() {
    const reports = this.plugin.reports;
    const report = reports.find((r) => r.id === this.selectedId) ?? reports[0];
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("theory-report");
    const toolbar = contentEl.createDiv({ cls: "theory-report-toolbar" });
    if (reports.length > 0) {
      const select = toolbar.createEl("select", { cls: "dropdown", attr: { "aria-label": "Past compiles" } });
      for (const r of reports) {
        const label = `${new Date(r.startedAt).toLocaleString()} \xB7 ${STATUS_TEXT[r.status]}`;
        select.createEl("option", { value: r.id, text: label });
      }
      select.value = report.id;
      select.addEventListener("change", () => {
        this.selectedId = select.value === reports[0].id ? null : select.value;
        this.refresh();
      });
    }
    const compile = toolbar.createEl("button", { cls: "mod-cta", text: "Compile" });
    compile.disabled = this.plugin.isCompiling();
    compile.addEventListener("click", () => this.plugin.compile());
    if (!report) {
      contentEl.createDiv({
        cls: "theory-report-empty",
        text: "No compiles yet. Commit your changes to the model, then click Compile."
      });
      return;
    }
    this.renderReport(report);
  }
  renderReport(report) {
    const { contentEl } = this;
    const header = contentEl.createDiv({ cls: `theory-report-status is-${report.status}` });
    (0, import_obsidian3.setIcon)(header.createSpan({ cls: "theory-report-status-icon" }), STATUS_ICON[report.status]);
    header.createSpan({ text: STATUS_TEXT[report.status] });
    header.createSpan({
      cls: "theory-report-range",
      text: `${shortHash(report.fromCommit)} \u2192 ${shortHash(report.toCommit)}`
    });
    if (report.status === "running") {
      header.createEl("button", { cls: "theory-report-cancel", text: "Cancel" }).addEventListener("click", () => this.plugin.cancelCompile());
    } else if (this.plugin.overlay.report() === report) {
      header.createEl("button", { cls: "theory-report-cancel", text: "Clear highlights" }).addEventListener("click", () => this.plugin.overlay.dismiss());
    }
    if (report.summary) contentEl.createEl("p", { cls: "theory-report-summary", text: report.summary });
    if (report.problems.length > 0) {
      const section = this.section("Problems", report.problems.length);
      const list = section.createEl("ul", { cls: "theory-report-problems" });
      for (const problem of report.problems) {
        const item = list.createEl("li");
        item.createDiv({ text: problem.text });
        if (problem.anchors.length > 0) this.anchorLinks(item, problem.anchors);
      }
    }
    const anchored = report.problems.some((p) => p.anchors.length > 0);
    if (report.status === "failed" && !anchored && report.suspectNotes?.length) {
      const section = this.section("Notes changed in this compile", report.suspectNotes.length);
      section.createDiv({
        cls: "theory-report-meta",
        text: "Claude didn't say where in the model the compile failed. One of these notes may be the cause."
      });
      this.anchorLinks(section, report.suspectNotes.map((path) => ({ path })));
    }
    if (report.questions.length > 0) {
      const section = this.section("Questions about the model", report.questions.length);
      for (const q of report.questions) {
        const item = section.createDiv({ cls: "theory-report-question" });
        item.createDiv({ text: q.question });
        if (q.notes.length === 0) continue;
        const notes = item.createDiv({ cls: "theory-report-notes" });
        for (const note of q.notes) {
          const link = notes.createEl("a", { cls: "internal-link", text: note, href: note });
          link.addEventListener("click", (event) => {
            event.preventDefault();
            this.app.workspace.openLinkText(note, "", false);
          });
        }
      }
    }
    if (report.changes.length > 0) {
      const section = this.section("Changes to the code", report.changes.length);
      const list = section.createEl("ul");
      for (const change of report.changes) list.createEl("li", { text: change });
    }
    const revisions = this.section("Revisions compiled", report.revisions.length);
    for (const r of report.revisions) {
      const item = revisions.createDiv({ cls: "theory-report-revision" });
      item.createDiv({ text: r.subject });
      item.createDiv({
        cls: "theory-report-meta",
        text: `${r.author} \xB7 ${new Date(r.date).toLocaleString()} \xB7 ${r.hash.slice(0, 7)}`
      });
    }
    const details = contentEl.createEl("details", { cls: "theory-report-log" });
    if (report.status === "running") details.open = true;
    details.createEl("summary", { text: `Activity (${report.log.length})` });
    const log = details.createEl("pre");
    log.setText(report.log.length > 0 ? report.log.join("\n") : "Waiting for Claude\u2026");
  }
  /** Links that open each anchor's note at the spot it names. */
  anchorLinks(container, anchors) {
    const links = container.createDiv({ cls: "theory-report-notes" });
    for (const anchor of anchors) {
      const text = anchor.heading ? `${anchor.path} \u203A ${anchor.heading}` : anchor.path;
      const link = links.createEl("a", { cls: "internal-link", text, href: anchor.path });
      if (anchor.quote) link.setAttr("title", anchor.quote);
      link.addEventListener("click", (event) => {
        event.preventDefault();
        this.plugin.overlay.jump(anchor);
      });
    }
  }
  section(title, count) {
    const section = this.contentEl.createDiv({ cls: "theory-report-section" });
    section.createEl("h4", { text: `${title} (${count})` });
    return section;
  }
};

// src/settings.ts
var import_obsidian4 = require("obsidian");
var import_path5 = require("path");
var DEFAULT_SETTINGS = {
  fullName: "",
  email: "",
  projectFolder: "",
  claudeCommand: "claude",
  permissionMode: "acceptEdits",
  allowedTools: "Bash(git *)",
  showCompileButton: true
};
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(email) {
  return EMAIL_PATTERN.test(email);
}
var TheorySettingTab = class extends import_obsidian4.PluginSettingTab {
  plugin;
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian4.Setting(containerEl).setName("Author").setDesc("Used to sign the revisions you make in this vault.").setHeading();
    new import_obsidian4.Setting(containerEl).setName("Full name").setDesc("Your name as it should appear in signatures.").addText(
      (text) => text.setPlaceholder("Jane Doe").setValue(this.plugin.settings.fullName).onChange(async (value) => {
        this.plugin.settings.fullName = value.trim();
        await this.plugin.saveSettings();
      })
    );
    const emailSetting = new import_obsidian4.Setting(containerEl).setName("Email address").setDesc("Contact address shown next to your name.");
    emailSetting.addText((text) => {
      text.inputEl.type = "email";
      text.setPlaceholder("jane@example.com").setValue(this.plugin.settings.email).onChange(async (value) => {
        const email = value.trim();
        const valid = email === "" || isValidEmail(email);
        text.inputEl.toggleClass("theory-invalid", !valid);
        emailSetting.setDesc(
          valid ? "Contact address shown next to your name." : "This doesn't look like a valid email address."
        );
        if (valid) {
          this.plugin.settings.email = email;
          await this.plugin.saveSettings();
        }
      });
    });
    new import_obsidian4.Setting(containerEl).setName("Vault").setHeading();
    const setUp = this.plugin.isVaultSetUp();
    new import_obsidian4.Setting(containerEl).setName("Setup vault").setDesc(
      setUp ? "This vault is already a git repository." : "Turn this vault into a git repository and make the initial commit."
    ).addButton((button) => {
      button.setButtonText(setUp ? "Already set up" : "Setup vault").setDisabled(setUp);
      if (setUp) return;
      button.setCta().onClick(async () => {
        button.setDisabled(true).setButtonText("Setting up\u2026");
        await this.plugin.setUpVault();
        this.display();
      });
    });
    this.displayProject(containerEl.createDiv({ cls: "theory-project" }));
    new import_obsidian4.Setting(containerEl).setName("Compile").setDesc("Compile hands new revisions of the model to Claude Code, which updates the code to match.").setHeading();
    new import_obsidian4.Setting(containerEl).setName("Show compile button").setDesc("A button at the bottom right of the editor that shows how many revisions are waiting to compile.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.showCompileButton).onChange(async (value) => {
        this.plugin.settings.showCompileButton = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName("Claude Code command").setDesc("The Claude Code CLI, as a command name or an absolute path.").addText(
      (text) => text.setPlaceholder("claude").setValue(this.plugin.settings.claudeCommand).onChange(async (value) => {
        this.plugin.settings.claudeCommand = value.trim() || DEFAULT_SETTINGS.claudeCommand;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName("Permission mode").setDesc(
      "How much Claude may do without asking. Compile runs unattended, so anything not allowed here is refused."
    ).addDropdown(
      (dropdown) => dropdown.addOption("acceptEdits", "Edit files, run only allowed commands").addOption("auto", "Auto: Claude decides what is safe").addOption("bypassPermissions", "Run anything (no checks)").setValue(this.plugin.settings.permissionMode).onChange(async (value) => {
        this.plugin.settings.permissionMode = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName("Allowed commands").setDesc(
      "Claude Code permission rules, separated by spaces, for the commands Claude may run, e.g. Bash(npm run *). Writes to the model are always denied."
    ).addText(
      (text) => text.setPlaceholder("Bash(git *) Bash(npm run *)").setValue(this.plugin.settings.allowedTools).onChange(async (value) => {
        this.plugin.settings.allowedTools = value.trim();
        await this.plugin.saveSettings();
      })
    );
  }
  /** The project folder, with the git repositories found in it. */
  displayProject(containerEl) {
    containerEl.empty();
    const folder = this.plugin.settings.projectFolder;
    const setting = new import_obsidian4.Setting(containerEl).setName("Project folder");
    if (folder) {
      setting.descEl.createDiv({ cls: "theory-project-path", text: folder });
    } else {
      setting.setDesc("The folder holding this project's code. Compile runs Claude Code here.");
    }
    if (folder) {
      setting.addExtraButton(
        (button) => button.setIcon("refresh-cw").setTooltip("Look for repositories again").onClick(() => this.displayProject(containerEl))
      );
    }
    setting.addButton((button) => {
      button.setButtonText(folder ? "Change\u2026" : "Browse\u2026");
      if (!folder) button.setCta();
      button.onClick(async () => {
        try {
          const picked = await pickFolder(folder);
          if (!picked) return;
          this.plugin.settings.projectFolder = picked;
          await this.plugin.saveSettings();
          this.displayProject(containerEl);
        } catch (error) {
          new import_obsidian4.Notice(error instanceof Error ? error.message : String(error));
        }
      });
    });
    if (!folder) return;
    const found = findProjectRepos(folder);
    if (found.kind === "missing" || found.kind === "none") {
      const warning = containerEl.createDiv({ cls: "theory-project-warning" });
      (0, import_obsidian4.setIcon)(warning.createSpan({ cls: "theory-project-warning-icon" }), "alert-triangle");
      warning.createSpan({
        text: found.kind === "missing" ? "This folder doesn't exist anymore. Choose the project folder again." : "No git repositories found in the project folder."
      });
      return;
    }
    const list = containerEl.createDiv({ cls: "theory-project-repos" });
    list.createDiv({
      cls: "theory-project-repos-title",
      text: found.kind === "root" ? "Project repository" : `Project repositories (${found.repos.length})`
    });
    for (const repo of found.repos) {
      const row = list.createDiv({ cls: "theory-project-repo" });
      (0, import_obsidian4.setIcon)(row.createSpan({ cls: "theory-project-repo-icon" }), "git-branch");
      row.createSpan({ cls: "theory-project-repo-name", text: (0, import_path5.basename)(repo) });
      row.setAttr("title", repo);
    }
  }
};

// src/history-view.ts
var import_obsidian5 = require("obsidian");
var HISTORY_VIEW_TYPE = "theory-commit-history";
var UNITS = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60]
];
var relative2 = new Intl.RelativeTimeFormat(void 0, { numeric: "auto" });
function timeAgo(date) {
  const seconds = (date.getTime() - Date.now()) / 1e3;
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return relative2.format(Math.round(seconds / size), unit);
  }
  return "just now";
}
var CommitHistoryView = class extends import_obsidian5.ItemView {
  plugin;
  // Ignores results from an older refresh that finishes after a newer one.
  refreshId = 0;
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return HISTORY_VIEW_TYPE;
  }
  getDisplayText() {
    return "Commit history";
  }
  getIcon() {
    return "history";
  }
  async onOpen() {
    this.addAction("refresh-cw", "Refresh", () => this.refresh());
    const refreshSoon = (0, import_obsidian5.debounce)(() => this.refresh(), 1e3, true);
    this.registerEvent(this.app.workspace.on("file-open", () => this.refresh()));
    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        if (file === this.app.workspace.getActiveFile()) refreshSoon();
      })
    );
    this.registerEvent(this.app.vault.on("rename", () => this.refresh()));
    await this.refresh();
  }
  async refresh() {
    const id = ++this.refreshId;
    const file = this.app.workspace.getActiveFile();
    const { contentEl } = this;
    if (!this.plugin.isVaultSetUp()) {
      this.renderVaultNotSetUp();
      return;
    }
    if (!file) {
      this.renderMessage("Open a note to see its commit history.");
      return;
    }
    let commits;
    let dirty;
    try {
      const basePath = this.plugin.getVaultPath();
      [commits, dirty] = await Promise.all([
        fileHistory(basePath, file.path),
        hasUncommittedChanges(basePath, file.path)
      ]);
    } catch (error) {
      if (id !== this.refreshId) return;
      const message = error instanceof Error ? error.message : String(error);
      this.renderMessage(`Couldn't read history: ${message}`);
      return;
    }
    if (id !== this.refreshId) return;
    contentEl.empty();
    contentEl.addClass("theory-history");
    this.renderHeader(file, dirty);
    if (commits.length === 0) {
      contentEl.createDiv({ cls: "theory-history-empty", text: "No commits yet for this note." });
      return;
    }
    const list = contentEl.createDiv({ cls: "theory-history-list" });
    for (const commit2 of commits) {
      const item = list.createDiv({ cls: "theory-history-item" });
      item.setAttr("title", `${commit2.hash}
${commit2.author} <${commit2.email}>
${commit2.date.toLocaleString()}`);
      item.createDiv({ cls: "theory-history-subject", text: commit2.subject });
      const meta = item.createDiv({ cls: "theory-history-meta" });
      meta.createSpan({ text: commit2.author });
      meta.createSpan({ text: " \xB7 " });
      meta.createSpan({ text: timeAgo(commit2.date) });
      meta.createSpan({ text: " \xB7 " });
      meta.createSpan({ cls: "theory-history-hash", text: commit2.hash.slice(0, 7) });
    }
  }
  renderHeader(file, dirty) {
    const header = this.contentEl.createDiv({ cls: "theory-history-header" });
    header.createDiv({ cls: "theory-history-title", text: file.basename });
    if (dirty) {
      const status = header.createDiv({ cls: "theory-history-dirty" });
      status.createSpan({ text: "Uncommitted changes" });
      status.createEl("button", { cls: "mod-cta theory-history-commit", text: "Commit\u2026" }).addEventListener("click", () => this.plugin.openCommitModal(file));
    }
  }
  renderMessage(text) {
    this.contentEl.empty();
    this.contentEl.addClass("theory-history");
    this.contentEl.createDiv({ cls: "theory-history-empty", text });
  }
  renderVaultNotSetUp() {
    this.renderMessage("This vault isn't a git repository yet.");
    const button = this.contentEl.createEl("button", { cls: "mod-cta", text: "Setup vault" });
    button.addEventListener("click", async () => {
      button.disabled = true;
      await this.plugin.setUpVault();
      await this.refresh();
    });
  }
};

// src/overlay.ts
var import_state = require("@codemirror/state");
var import_view = require("@codemirror/view");
var import_obsidian6 = require("obsidian");
var refreshMarks = import_state.StateEffect.define();
var FailureOverlay = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  plugin;
  banners = /* @__PURE__ */ new Map();
  /** The failed compile shown in the notes: the newest finished one, unless it was dismissed. */
  report() {
    const latest = this.plugin.reports.find((r) => r.status !== "running");
    return latest?.status === "failed" && !latest.dismissed ? latest : null;
  }
  marks(path) {
    const report = this.report();
    if (!report) return [];
    return report.problems.flatMap(
      (p) => p.anchors.filter((anchor) => anchor.path === path).map((anchor) => ({ problem: p.text, anchor }))
    );
  }
  /** True when the failed compile named no spot at all, and this note changed in it. */
  isSuspect(path) {
    const report = this.report();
    if (!report || report.problems.some((p) => p.anchors.length > 0)) return false;
    return report.suspectNotes?.includes(path) ?? false;
  }
  /** Highlights each anchored spot in the editor, with the problem as its tooltip. */
  editorExtension() {
    const overlay = this;
    return import_view.ViewPlugin.fromClass(
      class {
        decorations;
        constructor(view) {
          this.decorations = overlay.decorations(view);
        }
        update(update) {
          const refreshed = update.transactions.some((tr) => tr.effects.some((effect) => effect.is(refreshMarks)));
          if (update.docChanged || refreshed) this.decorations = overlay.decorations(update.view);
        }
      },
      { decorations: (value) => value.decorations }
    );
  }
  decorations(view) {
    const file = view.state.field(import_obsidian6.editorInfoField, false)?.file;
    const marks = file ? this.marks(file.path) : [];
    if (marks.length === 0) return import_view.Decoration.none;
    const doc = view.state.doc;
    const text = doc.toString();
    const ranges = [];
    const lineStarts = /* @__PURE__ */ new Set();
    for (const { problem, anchor } of marks) {
      const found = findAnchor(text, anchor);
      if (!found) continue;
      const mark = import_view.Decoration.mark({ class: "theory-fail-mark", attributes: { title: problem } });
      if (found.to > found.from) ranges.push(mark.range(found.from, found.to));
      for (let n = doc.lineAt(found.from).number; n <= doc.lineAt(found.to).number; n++) {
        lineStarts.add(doc.line(n).from);
      }
    }
    for (const from of lineStarts) ranges.push(import_view.Decoration.line({ class: "theory-fail-line" }).range(from));
    return import_view.Decoration.set(ranges, true);
  }
  /** Redraws the highlights and banners, e.g. after a compile, an edit or a dismiss. */
  sync() {
    for (const [view, banner] of this.banners) {
      if (!banner.isConnected) this.banners.delete(view);
    }
    for (const leaf of this.plugin.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (!(view instanceof import_obsidian6.MarkdownView)) continue;
      view.editor.cm?.dispatch({ effects: refreshMarks.of(null) });
      const file = view.file;
      const marks = file ? this.marks(file.path) : [];
      if (!file || marks.length === 0 && !this.isSuspect(file.path)) {
        this.banners.get(view)?.remove();
        this.banners.delete(view);
        continue;
      }
      this.renderBanner(view, marks);
    }
  }
  renderBanner(view, marks) {
    let banner = this.banners.get(view);
    if (!banner?.isConnected) {
      banner = createDiv({ cls: "theory-fail-banner" });
      view.containerEl.insertBefore(banner, view.contentEl);
      this.banners.set(view, banner);
    }
    banner.empty();
    const head = banner.createDiv({ cls: "theory-fail-banner-head" });
    (0, import_obsidian6.setIcon)(head.createSpan({ cls: "theory-fail-banner-icon" }), "alert-triangle");
    head.createSpan({
      cls: "theory-fail-banner-title",
      text: marks.length > 0 ? `The last compile failed here (${marks.length})` : "The last compile failed. This note changed in it, so it may be the cause."
    });
    const actions = head.createDiv({ cls: "theory-fail-banner-actions" });
    actions.createEl("button", { text: "Report" }).addEventListener("click", () => this.plugin.showReportView());
    actions.createEl("button", { text: "Dismiss" }).addEventListener("click", () => this.dismiss());
    if (marks.length === 0) return;
    const text = view.getViewData();
    const list = banner.createEl("ul", { cls: "theory-fail-banner-list" });
    for (const { problem, anchor } of marks) {
      const item = list.createEl("li");
      if (!anchor.quote && !anchor.heading) {
        item.setText(problem);
        continue;
      }
      const link = item.createEl("a", { text: problem, href: "#" });
      link.addEventListener("click", (event) => {
        event.preventDefault();
        this.jump(anchor);
      });
      if (!findAnchor(text, anchor)) {
        item.createDiv({ cls: "theory-fail-banner-moved", text: "This spot has changed since the compile." });
      }
    }
  }
  /** Clears the failed compile's highlights. The report itself stays. */
  async dismiss() {
    const report = this.report();
    if (!report) return;
    report.dismissed = true;
    await this.plugin.saveSettings();
    this.sync();
    this.plugin.refreshReportViews();
  }
  /** Opens the note an anchor points to and selects the spot, when it can still be found. */
  async jump(anchor) {
    const { vault, workspace } = this.plugin.app;
    const file = vault.getAbstractFileByPath(anchor.path);
    if (!(file instanceof import_obsidian6.TFile)) {
      new import_obsidian6.Notice(`${anchor.path} isn't in the vault any more.`);
      return;
    }
    const existing = workspace.getLeavesOfType("markdown").find((leaf2) => leaf2.view instanceof import_obsidian6.MarkdownView && leaf2.view.file === file);
    const leaf = existing ?? workspace.getLeaf(false);
    if (existing) workspace.setActiveLeaf(existing, { focus: true });
    else await leaf.openFile(file);
    const view = leaf.view;
    if (!(view instanceof import_obsidian6.MarkdownView) || !anchor.quote && !anchor.heading) return;
    const found = findAnchor(view.getViewData(), anchor);
    if (!found) {
      new import_obsidian6.Notice("Couldn't find this spot. The note has changed since the compile.");
      return;
    }
    const { editor } = view;
    const from = editor.offsetToPos(found.from);
    const to = editor.offsetToPos(found.to);
    if (view.getMode() === "source") {
      editor.setSelection(from, to);
      editor.scrollIntoView({ from, to }, true);
      editor.focus();
    } else {
      view.setEphemeralState({ line: from.line });
    }
  }
  removeAll() {
    for (const banner of this.banners.values()) banner.remove();
    this.banners.clear();
  }
};

// src/note-status.ts
var import_obsidian7 = require("obsidian");
var REALIZED_KEY = "realized";
var COMPILE_STATE = {
  new: { icons: ["circle-dashed"], label: "Not committed yet" },
  pending: { icons: ["clock"], label: "Committed, waiting for a compile" },
  running: { icons: ["loader"], label: "Compiling\u2026" },
  failed: { icons: ["circle-x", "x-circle"], label: "The last compile of this note failed. Click for the report." },
  compiled: { icons: ["circle-check", "check-circle"], label: "Compiled" }
};
function icon(names) {
  const ids = (0, import_obsidian7.getIconIds)();
  return names.find((name) => ids.includes(`lucide-${name}`)) ?? names[names.length - 1];
}
var NoteStatus = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  plugin;
  buttons = /* @__PURE__ */ new Map();
  // Ignores results from an older sync that finishes after a newer one.
  syncId = 0;
  isRealized(file) {
    return this.plugin.app.metadataCache.getFileCache(file)?.frontmatter?.[REALIZED_KEY] !== false;
  }
  async toggleRealized(file) {
    if (!file) return;
    const realized = this.isRealized(file);
    await this.plugin.app.fileManager.processFrontMatter(file, (frontmatter) => {
      if (realized) frontmatter[REALIZED_KEY] = false;
      else delete frontmatter[REALIZED_KEY];
    });
  }
  async sync() {
    const id = ++this.syncId;
    const setUp = this.plugin.isVaultSetUp();
    const state = setUp ? await this.readGitState().catch(() => null) : null;
    if (id !== this.syncId) return;
    for (const [view, buttons] of this.buttons) {
      if (!buttons.realized.isConnected) this.buttons.delete(view);
    }
    for (const leaf of this.plugin.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (!(view instanceof import_obsidian7.MarkdownView)) continue;
      let buttons = this.buttons.get(view);
      if (!buttons) {
        const compile = view.addAction("clock", "", () => this.plugin.showReportView());
        compile.addClass("theory-state-button");
        const realized2 = view.addAction("square", "", () => this.toggleRealized(view.file));
        realized2.addClass("theory-realized-button");
        buttons = { realized: realized2, compile };
        this.buttons.set(view, buttons);
      }
      const file = view.file;
      const shown = setUp && file !== null && file.extension === "md";
      buttons.realized.toggle(shown);
      buttons.compile.toggle(shown && state !== null);
      if (!shown || !file) continue;
      const realized = this.isRealized(file);
      (0, import_obsidian7.setIcon)(buttons.realized, icon(realized ? ["square-check", "check-square"] : ["square"]));
      buttons.realized.toggleClass("is-realized", realized);
      buttons.realized.setAttr(
        "aria-label",
        realized ? "Realized. Click to mark as written ahead of the code." : "Not realized yet. Click to mark as realized."
      );
      if (!state) continue;
      const compileState = this.compileState(file.path, state);
      const { icons, label } = COMPILE_STATE[compileState];
      (0, import_obsidian7.setIcon)(buttons.compile, icon(icons));
      for (const kind of Object.keys(COMPILE_STATE)) buttons.compile.toggleClass(`is-${kind}`, kind === compileState);
      buttons.compile.setAttr("aria-label", label);
    }
  }
  async readGitState() {
    const vaultPath = this.plugin.getVaultPath();
    const { stdout: files } = await git(vaultPath, ["ls-files", "-z"]);
    const tracked = new Set(files.split("\0").filter(Boolean));
    try {
      const { stdout } = await git(vaultPath, ["diff", "--name-only", "-z", `refs/tags/${COMPILED_TAG}`, "HEAD"]);
      return { tracked, pending: new Set(stdout.split("\0").filter(Boolean)) };
    } catch {
      return { tracked, pending: "all" };
    }
  }
  compileState(path, { tracked, pending }) {
    if (!tracked.has(path)) return "new";
    if (pending === "all" || pending.has(path)) return this.plugin.isCompiling() ? "running" : "pending";
    const report = this.plugin.reports.find(
      (r) => r.status !== "running" && (r.suspectNotes?.includes(path) || r.problems.some((p) => p.anchors.some((a) => a.path === path)))
    );
    return report?.status === "failed" ? "failed" : "compiled";
  }
  removeAll() {
    for (const { realized, compile } of this.buttons.values()) {
      realized.remove();
      compile.remove();
    }
    this.buttons.clear();
  }
};

// src/explorer.ts
var import_obsidian8 = require("obsidian");
var HIDDEN_PREFIX = "_";
function isHiddenFolder(file) {
  return file instanceof import_obsidian8.TFolder && file.name.startsWith(HIDDEN_PREFIX);
}
var HiddenFolders = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  plugin;
  patched = /* @__PURE__ */ new Set();
  /** Wraps any file explorer that isn't wrapped yet, e.g. after the layout changes. */
  attach() {
    for (const leaf of this.plugin.app.workspace.getLeavesOfType("file-explorer")) {
      const view = leaf.view;
      if (this.patched.has(view) || typeof view.getSortedFolderItems !== "function") continue;
      const original = view.getSortedFolderItems;
      view.getSortedFolderItems = function(folder) {
        const items = original.call(this, folder);
        return [
          ...items.filter((item) => !isHiddenFolder(item.file)),
          ...items.filter((item) => isHiddenFolder(item.file))
        ];
      };
      this.patched.add(view);
      view.requestSort?.();
    }
  }
  detach() {
    for (const view of this.patched) {
      delete view.getSortedFolderItems;
      view.requestSort?.();
    }
    this.patched.clear();
  }
};

// src/starter.ts
var INSTRUCTIONS = `Theoretical model is the textual representation of a software: what it does, why and in some cases how. It should be detailed enough that an AI can replicate a whole software following this and easy enough so that a new recruit can understand.

## Human Only
- Only humans write the model. AI may read it, but must never create, edit, move or delete anything in it.
- The model is the source of truth. When the code disagrees with the model, the code changes.
- If the model is unclear or contradicts itself, AI asks a question in the compile report. It never guesses, and never suggests new wording.

## Doctrine
- Use AI for ideation but always **write by hand.** The words should be yours.
- **Make important statements crude**. "A refund is reject after 30 days", not 'refunds are handled carefully'
- **One claim per sentence.** A failed compile can then point at exactly one claim.
- **Use firm words.** *Must*, *never* and *always* for rules, *may* for options. Avoid *should* and *usually*.
- **Say why.** A rule without a reason gets "improved" away.
- **Say what the system must not do.** Behaviour the model doesn't describe shouldn't exist in the code.
- **Keep headings stable and give rules IDs** (\`INV-3\`, \`AC-7\`). Failure pointers anchor to them. Retire an ID; never reuse it.
- **Mark what isn't built yet**.
- **Answer Claude's questions in the model**, not in chat.
- **One intent per commit**, and the commit message says why.
`;
function starterFiles(vaultName) {
  return [
    { path: "Index.md", sameAs: ["index.md"], content: `Manifesting ${vaultName}
` },
    { path: "Instructions.md", sameAs: ["instruction.md", "instructions.md"], content: INSTRUCTIONS }
  ];
}

// src/main.ts
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
var MAX_REPORTS = 20;
var TheoryPlugin = class extends import_obsidian9.Plugin {
  settings = { ...DEFAULT_SETTINGS };
  /** Compile reports, newest first. */
  reports = [];
  commitButtons = new CommitButtons(this);
  compileButton = new CompileButton(this);
  overlay = new FailureOverlay(this);
  noteStatus = new NoteStatus(this);
  hiddenFolders = new HiddenFolders(this);
  // Single user for now, so the compile lock only has to hold within this app.
  compileRun = null;
  statusBar = null;
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new TheorySettingTab(this.app, this));
    this.addCommand({
      id: "setup-vault",
      name: "Setup vault",
      callback: () => this.setUpVault()
    });
    this.registerView(HISTORY_VIEW_TYPE, (leaf) => new CommitHistoryView(leaf, this));
    this.addCommand({
      id: "show-commit-history",
      name: "Show commit history",
      callback: () => this.showHistoryView(true)
    });
    this.registerView(REPORT_VIEW_TYPE, (leaf) => new CompileReportView(leaf, this));
    this.addCommand({
      id: "compile",
      name: "Compile",
      callback: () => this.compile()
    });
    this.addCommand({
      id: "show-compile-report",
      name: "Show compile report",
      callback: () => this.showReportView()
    });
    this.addRibbonIcon("hammer", "Compile the model", () => this.compile());
    this.statusBar = this.addStatusBarItem();
    this.statusBar.addClass("theory-status");
    this.statusBar.hide();
    const launching = !this.app.workspace.layoutReady;
    this.app.workspace.onLayoutReady(async () => {
      if (launching) await this.openIndex();
      await this.showHistoryView(false);
      await this.commitButtons.sync();
      this.compileButton.attach();
      await this.compileButton.refresh();
      this.overlay.sync();
      await this.noteStatus.sync();
      this.hiddenFolders.attach();
    });
    this.registerEvent(this.app.workspace.on("layout-change", () => this.hiddenFolders.attach()));
    const syncStatus = () => this.noteStatus.sync();
    const syncStatusSoon = (0, import_obsidian9.debounce)(syncStatus, 800, true);
    this.registerEvent(this.app.workspace.on("layout-change", syncStatus));
    this.registerEvent(this.app.workspace.on("file-open", syncStatus));
    this.registerEvent(this.app.metadataCache.on("changed", syncStatusSoon));
    this.registerDomEvent(window, "focus", syncStatusSoon);
    this.registerEditorExtension(this.overlay.editorExtension());
    const syncOverlay = () => this.overlay.sync();
    this.registerEvent(this.app.workspace.on("layout-change", syncOverlay));
    this.registerEvent(this.app.workspace.on("file-open", syncOverlay));
    this.registerEvent(this.app.vault.on("modify", (0, import_obsidian9.debounce)(syncOverlay, 1e3, true)));
    this.addCommand({
      id: "commit-current-note",
      name: "Commit current note",
      callback: () => this.openCommitModal(this.app.workspace.getActiveFile())
    });
    const syncButtons = () => this.commitButtons.sync();
    const syncButtonsSoon = (0, import_obsidian9.debounce)(syncButtons, 1e3, true);
    this.registerEvent(this.app.workspace.on("layout-change", syncButtons));
    this.registerEvent(this.app.workspace.on("file-open", syncButtons));
    this.registerEvent(this.app.vault.on("modify", syncButtonsSoon));
    this.registerEvent(this.app.vault.on("rename", syncButtons));
    const refreshCompileSoon = (0, import_obsidian9.debounce)(() => this.compileButton.refresh(), 800, true);
    this.registerEvent(this.app.workspace.on("layout-change", () => this.compileButton.attach()));
    this.registerEvent(this.app.workspace.on("file-open", refreshCompileSoon));
    for (const event of ["modify", "create", "delete", "rename"]) {
      this.registerEvent(this.app.vault.on(event, refreshCompileSoon));
    }
    this.registerDomEvent(window, "focus", refreshCompileSoon);
  }
  onunload() {
    this.commitButtons.removeAll();
    this.compileButton.detach();
    this.overlay.removeAll();
    this.noteStatus.removeAll();
    this.hiddenFolders.detach();
    this.compileRun?.cancel();
  }
  isCompiling() {
    return this.compileRun !== null;
  }
  /** Compiles every revision committed since the last compile. */
  async compile() {
    if (this.compileRun) {
      new import_obsidian9.Notice("A compile is already running.");
      await this.showReportView();
      return;
    }
    let vaultPath;
    try {
      vaultPath = this.getVaultPath();
      if (!this.isVaultSetUp()) {
        new import_obsidian9.Notice("Set up the vault before compiling.");
        return;
      }
      const uncommitted = await changedFiles(vaultPath);
      if (uncommitted.length > 0) {
        const count = uncommitted.length;
        new import_obsidian9.Notice(`${count} uncommitted ${count === 1 ? "file isn't" : "files aren't"} part of this compile.`);
      }
    } catch (error) {
      new import_obsidian9.Notice(`Compile failed: ${errorMessage(error)}`, 1e4);
      return;
    }
    const { projectFolder, claudeCommand, permissionMode, allowedTools } = this.settings;
    let run2;
    try {
      run2 = await startCompile(
        { vaultPath, projectFolder, claudeCommand, permissionMode, allowedTools },
        () => this.refreshReportViews()
      );
    } catch (error) {
      new import_obsidian9.Notice(
        error instanceof NothingToCompileError ? error.message : `Compile failed: ${errorMessage(error)}`,
        error instanceof NothingToCompileError ? 4e3 : 1e4
      );
      return;
    }
    this.compileRun = run2;
    this.reports = [run2.report, ...this.reports].slice(0, MAX_REPORTS);
    this.statusBar?.setText("Compiling\u2026");
    this.statusBar?.show();
    this.compileButton.refresh();
    this.noteStatus.sync();
    await this.saveSettings();
    await this.showReportView();
    for (const view of this.reportViews()) view.showLatest();
    const report = await run2.done;
    this.compileRun = null;
    this.statusBar?.hide();
    await this.saveSettings();
    this.refreshReportViews();
    this.compileButton.refresh();
    this.overlay.sync();
    this.noteStatus.sync();
    const questions = report.questions.length;
    const extra = questions > 0 ? ` Claude has ${questions} question${questions === 1 ? "" : "s"} about the model.` : "";
    if (report.status === "succeeded") new import_obsidian9.Notice(`Compile finished.${extra}`);
    else if (report.status === "failed") new import_obsidian9.Notice(`Compile failed. See the compile report.${extra}`, 1e4);
  }
  cancelCompile() {
    this.compileRun?.cancel();
  }
  /** Opens theory.md's tab in Obsidian settings. */
  openSettings() {
    const setting = this.app.setting;
    setting.open();
    setting.openTabById(this.manifest.id);
  }
  /** Opens the compile report in a main tab, reusing it if it's already open. */
  async showReportView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(REPORT_VIEW_TYPE)[0];
    if (!leaf) {
      leaf = workspace.getLeaf("tab");
      await leaf.setViewState({ type: REPORT_VIEW_TYPE, active: true });
    }
    await workspace.revealLeaf(leaf);
  }
  reportViews() {
    return this.app.workspace.getLeavesOfType(REPORT_VIEW_TYPE).map((leaf) => leaf.view).filter((view) => view instanceof CompileReportView);
  }
  refreshReportViews() {
    for (const view of this.reportViews()) view.refresh();
  }
  async openCommitModal(file) {
    if (!file) {
      new import_obsidian9.Notice("Open a note to commit it.");
      return;
    }
    try {
      const changed = await changedFiles(this.getVaultPath());
      if (!changed.includes(file.path)) {
        new import_obsidian9.Notice("No changes to commit in this note.");
        return;
      }
      const others = changed.filter((path) => path !== file.path);
      new CommitModal(this.app, this, file, others).open();
    } catch (error) {
      new import_obsidian9.Notice(`Couldn't read changes: ${errorMessage(error)}`, 1e4);
    }
  }
  /** Opens the commit modal for every changed file in the vault. */
  async openCommitAllModal() {
    try {
      const changed = await changedFiles(this.getVaultPath());
      if (changed.length === 0) {
        new import_obsidian9.Notice("No changes to commit.");
        return;
      }
      new CommitModal(this.app, this, null, changed).open();
    } catch (error) {
      new import_obsidian9.Notice(`Couldn't read changes: ${errorMessage(error)}`, 1e4);
    }
  }
  /** Returns true when the commit was made. */
  async commitChanges(message, paths) {
    try {
      const hash = await commit(this.getVaultPath(), this.settings, message, paths);
      new import_obsidian9.Notice(`Committed ${hash}`);
      this.refreshGitState();
      return true;
    } catch (error) {
      new import_obsidian9.Notice(`Commit failed: ${errorMessage(error)}`, 1e4);
      return false;
    }
  }
  /** Opens the vault's root Index.md, reusing its tab if it's already open. */
  async openIndex() {
    const { vault, workspace } = this.app;
    const index = vault.getRoot().children.find((child) => child instanceof import_obsidian9.TFile && child.name.toLowerCase() === "index.md");
    if (!(index instanceof import_obsidian9.TFile)) return;
    const existing = workspace.getLeavesOfType("markdown").find((leaf) => leaf.view instanceof import_obsidian9.MarkdownView && leaf.view.file === index);
    if (existing) {
      workspace.setActiveLeaf(existing, { focus: true });
    } else {
      await workspace.getLeaf(false).openFile(index);
    }
  }
  /** Opens Index.md, waiting for Obsidian to notice it when setup has only just written it. */
  openIndexWhenReady() {
    const isIndex = (file) => file.parent?.isRoot() === true && file.name.toLowerCase() === "index.md";
    if (this.app.vault.getRoot().children.some(isIndex)) {
      this.openIndex();
      return;
    }
    const ref = this.app.vault.on("create", (file) => {
      if (!isIndex(file)) return;
      this.app.vault.offref(ref);
      this.openIndex();
    });
    this.registerEvent(ref);
  }
  /** Adds the commit history tab to the right sidebar if it isn't there yet. */
  async showHistoryView(reveal) {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(HISTORY_VIEW_TYPE)[0];
    if (!leaf) {
      const right = workspace.getRightLeaf(false);
      if (!right) return;
      await right.setViewState({ type: HISTORY_VIEW_TYPE, active: false });
      leaf = right;
    }
    if (reveal) await workspace.revealLeaf(leaf);
  }
  /** Updates everything that shows git state after the repository changes. */
  refreshGitState() {
    this.commitButtons.sync();
    this.compileButton.refresh();
    this.noteStatus.sync();
    for (const leaf of this.app.workspace.getLeavesOfType(HISTORY_VIEW_TYPE)) {
      if (leaf.view instanceof CommitHistoryView) leaf.view.refresh();
    }
  }
  async loadSettings() {
    const { reports, codeRepoPath, repos, ...settings } = await this.loadData() ?? {};
    this.settings = Object.assign({}, DEFAULT_SETTINGS, settings);
    if (!this.settings.projectFolder && typeof codeRepoPath === "string") this.settings.projectFolder = codeRepoPath;
    this.reports = Array.isArray(reports) ? reports : [];
    for (const report of this.reports) {
      report.problems = report.problems.map(
        (problem) => typeof problem === "string" ? plainProblem(problem) : problem
      );
      if (report.status !== "running") continue;
      report.status = "failed";
      report.problems.unshift(plainProblem("Obsidian closed before this compile finished."));
    }
  }
  /** Saves the settings together with the compile reports. */
  async saveSettings() {
    await this.saveData({ ...this.settings, reports: this.reports });
    this.compileButton.refresh();
  }
  getVaultPath() {
    const adapter = this.app.vault.adapter;
    if (!(adapter instanceof import_obsidian9.FileSystemAdapter)) {
      throw new Error("Setup vault is only available on desktop.");
    }
    return adapter.getBasePath();
  }
  isVaultSetUp() {
    return isVaultSetUp(this.getVaultPath());
  }
  /** Returns true when the vault ends up as a git repository. */
  async setUpVault() {
    try {
      if (this.isVaultSetUp()) {
        new import_obsidian9.Notice("This vault is already set up.");
        return true;
      }
      await setUpVault(this.getVaultPath(), this.settings, starterFiles(this.app.vault.getName()));
      this.refreshGitState();
      new import_obsidian9.Notice("Vault set up as a git repository with an initial commit.");
      this.openIndexWhenReady();
      return true;
    } catch (error) {
      new import_obsidian9.Notice(`Setup vault failed: ${errorMessage(error)}`, 1e4);
      return false;
    }
  }
};
