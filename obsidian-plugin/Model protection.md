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

## Snapshot cleanup

**INV-7.** Compile must always delete the snapshot when it ends, whatever the outcome.

## Reports stay outside

**INV-8.** Compile reports must never be written into the vault. They live in the plugin's data file, which git ignores. Why: anything in the vault becomes part of the model.

## Signed revisions

**INV-9.** Every revision must have a human author. The author's name and email come from [[Settings]], else from the git config. A commit without an author must fail.

**INV-11.** The plugin must never put Claude's text into a note: not from a compile, not from a suggestion, not from Expand. A suggestion reaches the model only when the engineer writes it into the note themselves. Why: a human signature must mean a human wrote the words.

## Link from code to model

**INV-10.** Every code commit Claude makes must end with the trailer `Model-Revision: <vault commit>`. Why: anyone reading the code history can find the theory it came from.
