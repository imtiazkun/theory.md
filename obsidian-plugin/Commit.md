A commit is how an engineer signs a revision of the model. Why: every line of the theory must have a human author.

## Triggers

**CMT-1.** A commit starts from one of three places:
- the commit button in a note's header
- the commit button in the floating bar
- the command "Commit current note"

**CMT-2.** The header button is marked when its note has uncommitted changes.

**CMT-3.** The floating commit button commits the active note when it has changes. Otherwise it commits all changed files. With nothing changed, it says "No changes to commit".

## Which changes count

**CMT-4.** A file counts as changed when git sees it as modified, new, deleted or renamed. Untracked files count.

**CMT-5.** Committing a note without changes shows "No changes to commit in this note." Committing with no note open shows "Open a note to commit it."

## Commit modal

**CMT-6.** The modal shows the file being committed, or the number of changed files.

**CMT-7.** The message box defaults to "Update {NOTE NAME}" for one note, and "Update model" for all files. There should be a generate icon button represented by a sparkle. Clicking it should prompt claude to generate the message content. Sparkle should have a color fade in and out animation.

**CMT-15.** While Claude writes, the sparkle blinks: it fades out and back in about once a second. It never spins, and no bar or line shows above the box or the button. This holds for every sparkle that asks Claude to write, pull request bodies (REP-28) included. Why: a blink says "working" without moving, and a spinning sparkle with a bar above it looks broken.

**CMT-8** When other files also changed, the toggle "Include all changed files" appears, saying how many other files have changes. It is off by default. Why: one intent per commit.

**CMT-9.** The modal shows who signs: "Signed as Name {EMAIL}", or "Signed with your git identity" when no name is set.

**CMT-10.** Cmd/Ctrl+Enter submits. Cancel closes without committing.


## Author

**CMT-11.** The author's name and email come from [[Settings]], else from the git config. When neither has a name: "Set your full name in theory.md settings first." When neither has an email: "Set your email address in theory.md settings first."

## What gets committed

**CMT-12.** A one-note commit stages and commits only that note. An all-files commit stages and commits every changed file.

## After a commit

**CMT-13.** The notice "Committed {short hash}" appears. The header buttons, the pending count and the commit history refresh.

**CMT-14.** A failed commit shows "Commit failed: {reason}".
