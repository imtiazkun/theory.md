Setup vault turns an Obsidian vault into a model. Why: the model needs history and signed authors, and git gives both.

## When it runs

**SET-1.** Setup runs only from the command "Setup vault", or the Setup vault button in [[Settings]] or the commit history. It never runs on its own.

## Before it runs

**SET-2.** A vault that already has a `.git` folder counts as set up. Setup then shows "This vault is already set up." and changes nothing. Why: an existing repository belongs to someone; setup must not rewrite it.

**SET-3.** Setup needs git, and the name and email git uses (CFG-34). It checks this before touching anything, so a failure never leaves a half set-up vault.

**SET-4.** Any failure shows "Setup vault failed: <reason>".

## Starter notes

**SET-5.** Setup writes `Index.md` with the text "Manifesting <vault name>", unless the vault root already has a file of that name, ignoring case.

**SET-6.** Setup writes `Instructions.md` with the human-only rules and the doctrine, unless the root already has `Instructions.md`, `instruction.md` or `instructions.md`, ignoring case. The starter text is owned by the code. Compile must not change it.

## Templates

**SET-11.** Setup writes two templates into `_templates/`, each unless that file already exists, ignoring case. Why: every model folder starts from the same headings, and engineers change the starting point by editing a note, not the code.
- `_templates/index.md`: the starting text of a model folder's `index.md` (REPO-19).
- `_templates/instructions.md`: the starting text of a model folder's `instructions.md`. Its starter text is the line from REPO-3 in [[Repositories]].

**SET-12.** `_templates` is a hidden folder, so the templates are committed but never sent to Claude.

**SET-13.** The starter text of `_templates/index.md` is exactly this:

```
## What this repository is

{{description}}

{{purpose}}

## Its place in the system

%% What it depends on, and what depends on it. Link the other repositories' index notes. %%

## What it does not do

%% What people might expect here but lives elsewhere, or nowhere. %%

## Notes

%% One line per note: the question it answers and its rule prefix. Concepts first, then the main flows, then UI and settings. %%

## Not built yet

%% The notes marked realized: false. %%
```

**SET-14.** A vault set up before the templates existed doesn't get them from Setup, because setup never runs twice (SET-2). The engineer adds them with Create missing files in [[Settings]] (CFG-20).

## Starter files

**SET-15.** The starter files are everything Setup writes:
- `Index.md` (SET-5)
- `Instructions.md` (SET-6)
- `_templates/index.md` and `_templates/instructions.md` (SET-11)
- the `.gitignore` lines (SET-8)

A starter file counts as present under the same names Setup accepts, ignoring case. Setup and Create missing files use this one list. Why: a starter file added later must reach old vaults too.

## Git repository

**SET-7.** Setup creates a git repository on branch `main`.

## Ignored files

**SET-8.** Setup adds these lines to `.gitignore` when they're missing, and keeps every other line:
- `.DS_Store`
- `.trash/`
- `.obsidian/`

Why: these files are personal or machine state, not theory. `.obsidian/` holds Obsidian's settings, the plugin's build and the plugin's data with the compile reports, and none of it is model.

## Initial commit

**SET-9.** Setup commits everything as "Initial commit", signed by the author, even when there is nothing to commit.

**SET-10.** Setup then shows "Vault set up as a git repository with an initial commit." It opens `_welcome.md` when it wrote one (SET-16), and `Index.md` otherwise. Why: the welcome note tells a new engineer what to do first.

## Welcome note

**SET-16.** Obsidian creates a `Welcome.md` note in every new vault. When the vault root has `Welcome.md`, ignoring case, Setup replaces its text with the welcome text (SET-19) and renames it to `_welcome.md`. Why: Obsidian's welcome says nothing about theory.md, and a new engineer needs to know where to start.

**SET-17.** When the vault root has no `Welcome.md`, Setup writes no welcome note. When the root already has `_welcome.md`, ignoring case, Setup leaves both notes alone. Why: setup must never overwrite a welcome note the engineer kept.

**SET-18.** `_welcome.md` is not a starter file (SET-15). Create missing files never writes it back. Why: the engineer deletes it once read, and it must stay deleted.

**SET-19.** `_welcome.md` is committed with everything else (SET-9). Its name starts with `_`, so it is never sent to the agent (see Hidden note in [[Concepts]]). The welcome text is owned by the code. Compile must not change it. It is exactly this:

```
# Welcome to theory.md

This vault is your model. Its notes say what your software does and why, and the agent builds the code from them. Only people write here. Read `Instructions.md` before you start: it has the rules for writing the model.

## You already have a project
1. Go to Settings → theory.md and set **Project folder** to the folder that holds your repositories. Choose your **Agent** there too.
2. Make a model folder for each repository, with the same name as the repository. Open the **Repositories** page from the ribbon to see them.
3. Open a repository's `index.md` and click **Expand**. The agent lists the notes that are missing. Write them yourself.
4. Click **Commit**, then **Compile**. Answer the report's questions by editing your notes, then compile again.

### Too big to write by hand?
If there's too much code to describe from scratch, let the agent draft the theory for you. Treat the draft as raw material, not as the model.

Give the agent this prompt. Replace VAULT with your vault's folder and REPOSITORY with the repository's folder.

> Read `VAULT/Instructions.md` and `VAULT/_templates/index.md`. From the code in `REPOSITORY`, draft the theory of one feature into `VAULT/_drafts/`. Write one note per feature. Give every rule an ID made of a short prefix for the note and a number, like `AUTH-1`, `AUTH-2`. Each ID is used once in the whole vault. Write one claim per sentence, use *must*, *never* and *always*, and give the reason for each rule. Write only what the code shows. List anything unclear as a question at the end instead of guessing.

Then:
- Check every sentence against the code and delete anything you can't vouch for.
- Rewrite what's left into a model note in your own words, keeping the rule IDs.
- Commit only what you understand. The commit is signed with your name.

A folder whose name starts with `_`, like `_drafts/`, is never sent to the agent, so a draft can't change your code.

## You're starting a new project
1. Make an empty project folder and set it as the **Project folder** in Settings.
2. Describe the whole system in `Index.md`.
3. Add a model folder for each repository you plan to have, and write its notes. Untick **realized** on any note that isn't ready to build.
4. Click **Commit**, then **Compile**. The agent writes the code to match.

When you've read this, delete it. Its name starts with `_`, so it is never sent to the agent.
```
