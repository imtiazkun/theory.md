The model mirrors the project folder: one folder of notes per repository. Why: each repository's theory must be found in one place, and Claude must know which notes describe which code.

## Model layout

**REPO-1.** The vault root always has `Index.md` and `Instructions.md`. The root Index describes the whole system and links every repository. The root Instructions holds the writing rules for humans. It is never sent to Claude.

**REPO-2.** Each repository in the project folder has a model folder at the vault root with exactly the same name. Notes in a model folder describe that repository only. Notes at the vault root describe the whole system.

**REPO-3.** Every model folder always has an `index.md` and an `instructions.md`.
- `index.md` is the entry note for that repository.
- `instructions.md` starts with one line pointing to the root Instructions: "The writing rules in [the root Instructions](../Instructions.md) apply here. Rules for Claude that apply only to this repository go below." The engineer adds that repository's rules for Claude below it.

**REPO-4.** Compile sends every model folder's `instructions.md` to Claude, and Claude must follow it when changing that repository (see [[Compile]]). Why: a repository may need rules the others don't, like "never add a dependency".

**REPO-5.** Index and instructions files stand out in the file explorer (see UI-19 in [[Workspace]]).

## Repositories page

**REPO-6.** A Repositories button in the ribbon and the command "Show repositories" open the Repositories page in a tab.

**REPO-7.** The page lists every git repository directly inside the project folder, one card each, sorted by name. Clicking a card's name opens that repository's model `index.md`.

**REPO-8.** With no repositories, the page says "No repositories yet. Create one to start." and shows a New repository button.

**REPO-9.** When no project folder is set, the page says "Choose the project folder in theory.md settings first." with a button that opens the settings. When the project folder is itself a git repository, the page says "The project folder is a single repository. Choose a folder that holds repositories side by side to add more." and New repository is disabled.

## Repository KPIs

**REPO-10.** Each card shows four groups:
- **Code**: the current branch, the last commit (when and who), and the number of files with uncommitted changes.
- **Compile**: the result and time of the last compile that changed this repository, or "Never compiled", and its open compile branch with the pull request state, if any.
- **Model**: the number of notes in its model folder, how many are not realized, and how many are waiting for a compile.
- **Remote**: a link to the GitHub `origin`, and how many commits the current branch is ahead of and behind it. Without an `origin`, it says "No remote".

**REPO-11.** KPIs are worked out from git, `gh` and the compile reports each time. They are never stored.

**REPO-12.** Opening the page never fetches. The page's Refresh action runs `git fetch` in every repository first, then recomputes. Why: opening the page must be fast and work offline.

**REPO-13.** A repository without a model folder shows "No model folder" and an Add model folder button. It creates the folder with `index.md` ("Manifesting {name}") and `instructions.md` (REPO-3), and commits only those two files as "Add model folder for {name}", signed by the author.

## New repository

**REPO-14.** New repository opens a form:
- **Name** (required): lowercase letters, digits and dashes. It must not exist in the project folder or the vault. Otherwise: "Use lowercase letters, digits and dashes." or "{name} already exists."
- **Description** (required): one sentence.
- **Purpose**: what the repository does and why. Several lines.
- **Stack**: languages and frameworks, like "TypeScript, React".
- **Build command**, **Test command** and **Run command**.
- **Conventions**: rules for working in this repository. Several lines.
- **Create GitHub repository**: a toggle, off by default. When on, **Visibility** is Private (default) or Public.

**REPO-15.** The form's text goes into the files exactly as typed. Lines for empty fields are left out. No AI writes any of it.
- `README.md`: the name as the title, the description, the purpose, the stack, and a "Getting started" section with the build, run and test commands.
- `AGENTS.md`: the stack, the build, test and run commands, the conventions, and the line "The theoretical model in the {vault name} vault, folder {name}/, is the source of truth for this repository."
- Model `index.md`: a "What this repository is" heading, the description and the purpose.
- Model `instructions.md`: the line from REPO-3.

**REPO-16.** Create runs these steps in order:
1. Check the name, that the author is set, and, when the GitHub toggle is on, that `gh` is logged in.
2. Create `{name}/` in the project folder, run `git init -b main`, write `README.md` and `AGENTS.md`, and commit them as "Initial commit", signed by the author.
3. Create `{name}/` in the vault with `index.md` and `instructions.md`, and commit only those two files as "Add repository {name}", signed by the author. Why only those: one intent per commit, whatever else is changed in the vault.
4. When the GitHub toggle is on, create the GitHub repository with `gh` at the chosen visibility, set it as `origin` and push `main`.

**REPO-17.** When a step fails, Create stops there. It shows "Couldn't create the repository: {reason}" and lists the steps already done. It never deletes what it created. Why: nothing git recorded may be thrown away silently.

**REPO-18.** After Create, the notice "Created repository {name}." appears, the page shows the new card, and the new model `index.md` opens.
