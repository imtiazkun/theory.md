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

## Git repository

**SET-7.** Setup creates a git repository on branch `main`.

## Ignored files

**SET-8.** Setup adds these lines to `.gitignore` when they're missing, and keeps every other line:
- `.DS_Store`
- `.trash/`
- `.obsidian/workspace*.json`
- `.obsidian/plugins/theory-md/data.json`

Why: these files are personal or machine state, not theory. The plugin's data holds the compile reports, which must stay out of the model.

## Initial commit

**SET-9.** Setup commits everything as "Initial commit", signed by the author, even when there is nothing to commit.

**SET-10.** Setup then shows "Vault set up as a git repository with an initial commit." and opens `Index.md`.
