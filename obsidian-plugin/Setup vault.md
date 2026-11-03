Setup vault turns an Obsidian vault into a model. Why: the model needs history and signed authors, and git gives both.

## When it runs

**SET-1.** Setup runs only from the command "Setup vault", or the Setup vault button in [[Settings]] or the commit history. It never runs on its own.

## Before it runs

**SET-2.** A vault that already has a `.git` folder counts as set up. Setup then shows "This vault is already set up." and changes nothing. Why: an existing repository belongs to someone; setup must not rewrite it.

**SET-3.** Setup needs an author name and email, from [[Settings]] or the git config. It checks this before touching anything, so a failure never leaves a half set-up vault.

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

**SET-10.** Setup then shows "Vault set up as a git repository with an initial commit." and opens `Index.md`.
