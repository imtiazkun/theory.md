These rules must hold in every compile. Why: the model is the source of truth only while humans alone write it (see [the root Index](../Index.md)).

## Read-only snapshot

**INV-2.** Claude must never work in the vault. Compile copies the latest commit into a new temporary folder outside the vault and removes write permission from it. Claude reads the model only from that copy.

**INV-3.** Compile must use committed revisions only, never the working tree. Why: only text a human has signed may become code.

## Deny rules

**INV-4.** Claude must be denied Edit, Write and NotebookEdit on the vault and on the snapshot. This must hold whatever the Allowed commands setting says.

## Snapshot check

**INV-5.** Compile must hash the snapshot before Claude runs and again after. If the hash changed, the compile must fail, every anchor must be dropped, and the report must say: "Claude tried to change the model snapshot. Those changes were thrown away."

## Vault check

**INV-6.** Compile must record the state of every vault file before Claude runs and compare it after. Any file that changed must be named in the report's problems: "These vault files changed while the compile ran: {files}. If you didn't edit them, revert them."

This check must not fail the compile on its own. Why: the engineer may be editing notes while a compile runs.

Files in dot folders are left out of this check. Why: an engineer may comment while a compile runs.

## When the checks run

**INV-12.** The snapshot check (INV-5) and the vault check (INV-6) run after every compile in which an agent started, cancelled ones included, whatever the agent. They never change a cancelled compile's status and never move the marker. Why: a cancelled agent may already have written somewhere.

## Snapshot cleanup

**INV-7.** Compile must always delete the snapshot when it ends, whatever the outcome.

## Reports stay outside

**INV-8.** Compile reports must never be written into the vault. They live in the plugin's data file, which git ignores. Why: anything in the vault becomes part of the model.

## Dot folders stay out

**INV-13.** Files in dot folders must never be sent to any agent. They are left out of the snapshot, the compile diff, Expand, commit messages and pull request bodies. Why: comments and theory.md's own files are not theory, and anything an agent reads can become code.

## Signed revisions

**INV-9.** Every revision must have a human author. The author's name and email are the ones git uses (CFG-34). A commit without an author must fail.

**INV-11.** The plugin must never put Claude's text into a note: not from a compile, not from a suggestion, not from Expand. A suggestion reaches the model only when the engineer writes it into the note themselves. Why: a human signature must mean a human wrote the words.

## Link from code to model

**INV-10.** Every code commit Claude makes must end with the trailer `Model-Revision: <vault commit>`. Why: anyone reading the code history can find the theory it came from.
