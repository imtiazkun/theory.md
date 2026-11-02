## Model

The model is the set of Markdown notes and assets in the vault. It says what the software does, why, and sometimes how. Only humans write it. The AI may read it and must never change it.

Obsidian's config folder `.obsidian/` is not part of the model. Git ignores it, so it is never counted as a change, never committed and never sent to Claude.

## Vault

The vault is the Obsidian vault folder that holds the model. The vault is its own git repository, on branch `main`. The vault is separate from the code.

## Index and Instructions

`Index.md` is the entry note at the vault root.

`Instructions.md` at the vault root holds the human-only rules and the writing doctrine. It is for humans. Compile never sends it to Claude, and Compile doesn't need it. The names `instruction.md` and `instructions.md` count as the same file, ignoring case.

## Project folder

The project folder holds the code. It is one git repository, or a folder whose direct subfolders are git repositories. Claude works in the project folder and nowhere else.

## Revision

A revision is one git commit in the vault repository. Every revision has a human author.

## Last compile marker

The last compile marker is the git tag `theory/compiled` in the vault repository. It points at the last compiled revision. It is a tag so that nothing is written into the notes.

## Pending revisions

Pending revisions are the revisions committed after the marker. When there is no marker, every revision is pending.

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
