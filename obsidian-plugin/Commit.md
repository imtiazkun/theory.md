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

## Commit page

**CMT-17.** A commit opens the Commit page in a new tab. It never opens a modal. Why: the engineer must read every change before signing it, and a modal has no room for a diff.

**CMT-18.** Only one Commit page for new changes may be open. Starting another commit brings it to the front.

**CMT-6.** The page lists every changed file, each with a checkbox, its path and how it changed: modified, new, deleted or renamed.

**CMT-19.** A commit started from a note ticks only that note. A commit started from the floating bar with no note changed ticks every file. Why: one intent per commit.

**CMT-20.** Each file shows its diff under its name: removed lines in red, added lines in green, with 3 unchanged lines around each change. Longer unchanged stretches are folded.

**CMT-21.** Above its diff, each note lists the rules it adds, changes and removes, by ID, like "Adds CMT-16. Changes CMT-7." Why: rules are what a compile acts on, so they must be seen first.

**CMT-22.** A new file shows every line as added. A deleted file shows every line as removed. A renamed file shows "{old path} → {new path}" above its diff. A file that isn't text, like an image, shows only its name and how it changed.

**CMT-23.** The page shows the files as they are now. When a listed file changes, its diff updates.

**CMT-24.** The diff shows raw text. It is never rendered as Markdown, and it never writes to a note. Why: the engineer must see exactly what git will store.

**CMT-7.** The message box starts empty. The Commit button stays disabled until the box holds text. Why: a ready-made message like "Update Refunds" gets committed as it is, and it never says why. A sparkle button sits in the message box. Clicking it asks Claude to write the message from the files this commit includes. Claude's message replaces the text in the box. While Claude writes, the sparkle blinks (CMT-15).

**CMT-15.** While Claude writes, the sparkle blinks: it fades out and back in about once a second. It never spins, and no bar or line shows above the box or the button. This holds for every sparkle that asks Claude to write, pull request bodies (REP-28) included. Why: a blink says "working" without moving, and a spinning sparkle with a bar above it looks broken.

**CMT-16.** The message box's placeholder says "Say why. Git already shows what changed." Why: every commit must carry one intent with a message that says why (see [the root Instructions](../Instructions.md)), and the diff already records what changed.

**CMT-9.** The page shows who signs, as git reports it: "Signed as {name} <{email}>".

**CMT-10.** Cmd/Ctrl+Enter commits. Commit stays disabled while no file is ticked. Cancel closes the page without committing, and discards the message.

CMT-8 is retired. It was the "Include all changed files" toggle, which the checkboxes replace (CMT-6, CMT-19).

## Past commits

**CMT-25.** Clicking a commit in commit history opens it on the Commit page, read-only (UI-31 in [[Workspace]]). Why: the engineer must see exactly what was signed, the same way they saw it before signing.

**CMT-26.** A read-only Commit page shows the commit's full message, author, date and short hash. Below them it lists every file the commit changed, with the diffs as CMT-20 to CMT-22 and CMT-24 say. The note whose history was clicked comes first.

**CMT-27.** The diff is the commit's own, against the commit before it. It never changes.

**CMT-28.** A read-only Commit page has no checkboxes, no message box and no Commit button. It never changes the vault.

**CMT-29.** A read-only Commit page opens in its own tab, apart from the Commit page for new changes. Clicking another commit reuses that tab. Why: looking at history must never discard a message being written.


## Author

**CMT-11.** The author's name and email are the ones git uses (CFG-34). When git has no name or email, nothing is committed and the notice says "Set your name and email in git first. theory.md settings show how." When git isn't installed: "theory.md needs git, and can't find it. Install git from git-scm.com, then reopen Obsidian."

## What gets committed

**CMT-12.** A commit stages and commits exactly the ticked files.

## After a commit

**CMT-13.** The Commit page closes, and the notice "Committed and pushed {short hash}" appears. The header buttons, the pending count, the sync status and the commit history refresh.

**CMT-14.** A failed commit shows "Commit failed: {reason}".

## Push

**CMT-30.** Every commit pushes the vault's `main` to `origin` straight after it. Why: a revision that lives on one machine is lost with that machine, and nobody else can pull it.

**CMT-31.** Comments that commit themselves (CMNT-13) push the same way.

**CMT-32.** A push never forces and never pushes tags. The last compile marker stays on this machine. Why: a forced push can delete someone else's revisions.

**CMT-33.** A push must never wait for a password or a passphrase. When git asks for one, the push fails. Why: Obsidian has no terminal to type it into, and a waiting push would hang the commit.

**CMT-34.** When the push fails, the commit stays. The notice says "Committed {short hash}, but couldn't push: {reason}". The sync status then shows how many revisions aren't pushed (PULL-9). Why: a commit is a signed revision, and a network failure must never undo it.

**CMT-35.** When the remote has revisions the vault doesn't, the push is refused. The notice says "Committed {short hash}, but couldn't push: the remote has new revisions. Pull with rebase in git, then push." Why: the plugin never merges or rebases (PULL-18), so a person must join the two histories.

**CMT-36.** When the vault has no `origin`, a commit doesn't push, and the notice stays "Committed {short hash}". Why: a vault may live on one machine on purpose.

**CMT-37.** The next commit, or Push now in the sync menu (PULL-19), pushes every revision that isn't pushed yet.
