## Model

The model is the set of Markdown notes and assets in the vault. It says what the software does, why, and sometimes how. Only humans write it. The AI may read it and must never change it.

Obsidian's config folder `.obsidian/` is not part of the model. Git ignores it, so it is never counted as a change, never committed and never sent to Claude. It is a dot folder.

## Vault

The vault is the Obsidian vault folder that holds the model. The vault is its own git repository, on branch `main`. The vault is separate from the code.

## Index and Instructions

`Index.md` is the entry note at the vault root.

`Instructions.md` at the vault root holds the human-only rules and the writing doctrine. It is for humans. Compile never sends it to Claude, and Compile doesn't need it. The names `instruction.md` and `instructions.md` count as the same file, ignoring case.

Each model folder has its own `index.md` and `instructions.md`. A model folder's `instructions.md` holds rules for Claude about that repository, and Compile sends it. Only the root Instructions stays human-only. See [[Repositories]].

## Model folder

A model folder is a folder at the vault root named exactly like a repository in the project folder. Its notes describe that repository only. See [[Repositories]].

## Project folder

The project folder holds the code. It is one git repository, or a folder whose direct subfolders are git repositories. Claude works in the project folder and nowhere else.

## Revision

A revision is one git commit in the vault repository. Every revision has a human author.

## Last compile marker

The last compile marker is the git tag `theory/compiled` in the vault repository. It points at the last compiled revision. It is a tag so that nothing is written into the notes.

## Compile branch

A compile branch is a branch named `theory/compile-{revision}` in a code repository. Compiles commit there, never on the base directly. It stays open until it is merged into its base or its pull request is closed. See [[Compile]].

## Pending revisions

Pending revisions are the revisions committed after the marker. When there is no marker, every revision is pending. A revision that changes only files in dot folders, like a comment, is never pending. Why: it changes no theory, so there is nothing to compile.

## Snapshot

The snapshot is a read-only copy of the vault at its latest commit, in a temporary folder outside the vault. Claude reads the model only from the snapshot. See [[Model protection]].

## Compile report

A compile report is the record of one compile: status, summary, changes, questions and problems. It lives in the plugin's data, never in the vault. See [[Compile report]].

## Anchor

An anchor points at a spot in the model: a note path, an optional heading and an optional exact quote. Claude proposes anchors. The plugin checks every anchor before keeping it.

## Realized

A note is realized unless its front matter says `realized: false`. An unrealized note describes something not built yet. Claude must leave unrealized notes alone.

## Hidden folder

A hidden folder is a folder whose name starts with `_`, like `_templates`. Hidden folders are greyed out and listed last in the file explorer. They are still part of the vault's git history but must never be sent to claude.

## Hidden note

A hidden note is a note whose name starts with `_`, like `_welcome.md`, in any folder. It is shown like any other note in the file explorer. It is still part of the vault's git history but must never be sent to claude. Why: a note for people, like the welcome note, is not theory.

## Dot folder

A dot folder is a folder whose name starts with `.`, like `.obsidian/` or `.comments/`, anywhere in the vault. Dot folders hold files for theory.md's own workings, like comments, or for external services, like Obsidian's config. They are never theory.
- Their files are never sent to any agent (INV-13).
- Obsidian never shows them in the file explorer.
- Their changes never count as changes to the model: not in the commit button, the commit modal, the compile button or the note header.
- theory.md commits the dot folders it owns by itself, like `.comments/` (CMNT-13). Others, like `.obsidian/`, git ignores.

Why: the model must hold theory only, while theory.md still needs somewhere in the vault to keep what the team shares.

## Comment

A comment is text an engineer writes on part of a note, which the AI ignores. Comments live in `.comments/` dot folders. See [[Comments]].

## Templates

The templates are the notes in `_templates/` at the vault root. A new model folder's `index.md` starts as a copy of `_templates/index.md`, and its `instructions.md` as a copy of `_templates/instructions.md`. Engineers edit the templates like any note.
