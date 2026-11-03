Compile turns pending revisions into code. Why: the code must follow the model, never the other way round.

## Starting a compile

**CMP-1.** A compile starts from the Compile button in the floating bar, the hammer in the ribbon or the command "Compile". There are no other triggers.

**CMP-2.** The compile report opens in a tab as soon as a compile starts.

## One at a time

**CMP-3.** Only one compile may run at a time in the app. A second attempt shows "A compile is already running." and opens the compile report.

The lock lives inside the app. Why: theory.md is single-user for now. [[Team sync]] moves the lock to a shared server.

## Before it starts

These checks run in this order. When one fails, the compile doesn't start and the marker doesn't move.

**CMP-4.** The vault must be set up. Otherwise: "Set up the vault before compiling."

**CMP-5.** Uncommitted files are left out, with the notice "N uncommitted files aren't part of this compile." (singular: "1 uncommitted file isn't part of this compile."). This warning doesn't stop the compile.

**CMP-6.** The project folder must be set. Otherwise: "Compile failed: Choose the project folder in theory.md settings first."

**CMP-7.** The project folder must exist. Otherwise: "Compile failed: The project folder doesn't exist: {path}"

**CMP-8.** The vault must have at least one commit. Otherwise: "Compile failed: The vault has no commits yet. Commit your notes first."

**CMP-9.** At least one revision must be pending. Otherwise: "Every committed revision is already compiled."

**CMP-36.** Every repository in the project folder must have no uncommitted changes. Otherwise: "Compile failed: These repositories have uncommitted changes: {repos}. Commit or stash them first." Why: the engineer's unfinished work must never end up on a compile branch.

## What Claude receives

**CMP-10.** Claude receives:
- the path of the snapshot
- the git repositories in the project folder (or that the folder is a single repository, or has none yet)
- the last compiled revision, or the statement that this is the first compile
- every pending revision, oldest first: hash, author, date and subject
- the diff from the marker to the latest commit, with a summary of changed files

On the first compile the diff starts from an empty model.

**CMP-11.** The diff is cut at 200,000 characters. Why: it keeps the prompt within reach of the model. Claude can read the full model from the snapshot.

## What Claude is told

**CMP-12.** The plugin gives Claude these rules in every compile, for every vault. This list is complete. A vault may add its own rules in its notes, and Claude reads them from the snapshot. The plugin must not copy a vault's rules into this list.

Claude must follow these rules:
- The model is read-only. Writing to the model is forbidden.
- The model is the source of truth. When the code disagrees, the code changes.
- A note with `realized: false` is written ahead of the code. Claude must not build it and must not count it as a mismatch.
- When the model is unclear, incomplete or contradicts itself, Claude asks a question naming the notes. Claude never guesses. Claude carries on with the parts that are clear.
- Claude changes files only inside the project folder.
- Before changing a repository, Claude reads its `AGENTS.md` (and `CLAUDE.md`, if there is one) and follows it, including how to test.
- Notes at the model root describe the whole system. Notes in a folder named after a repository describe that repository only.
- Before changing a repository, Claude also reads `instructions.md` in that repository's model folder and follows it. When it disagrees with `AGENTS.md`, the model's `instructions.md` wins, because the model is the source of truth.
- Every code commit ends with `Model-Revision: <vault commit>`.
- When there are several repositories, every change and problem starts with the repository name in brackets, like "[mobile] …".
- Anything that went wrong goes in problems.
- A problem that comes from the model carries anchors: the note, the heading and a quote copied exactly from the note, under 200 characters.
- Claude reports failed when the code doesn't match the model at the end.
- Claude commits on the branch the plugin checked out. Claude never creates, switches, merges or pushes branches.

## How Claude runs

**CMP-13.** The agent chosen in [[Settings]] runs in the project folder, with no chat: Claude Code by default, or an ACP agent (see [[Agents]]). It uses the permission mode, allowed commands, model and effort from [[Settings]]. When Claude needs something the settings don't allow, it asks the engineer with a permission card (see "Permission requests" below).

**CMP-14.** Claude's tool calls stream into the report's activity log while it runs.

## The engineer's tools

**CMP-44.** Every command the plugin runs gets the PATH of the engineer's login shell. This covers git, Claude Code and `gh`, and every command Claude runs in turn. Why: Obsidian opened from the Dock doesn't read the shell's startup files. Tools the engineer installed, like `docker` in `~/.docker/bin`, are then missing, and Claude reports them as not installed.

**CMP-45.** The plugin reads that PATH once, when it loads. It runs the shell named in `$SHELL` (`/bin/zsh` when it isn't set) as a login, interactive shell, and reads the PATH it prints. A PATH changed later counts after the plugin reloads.

**CMP-46.** The plugin waits at most 5 seconds for the shell. Why: a broken shell profile must never hang Obsidian.

**CMP-47.** `/usr/bin`, `/usr/local/bin`, `/opt/homebrew/bin` and `~/.local/bin` are always added after the login PATH. When the shell fails or times out, they are added after Obsidian's own PATH instead. Why: git and Claude Code must still be found.

## Permission requests

**CMP-27.** A tool call that Allowed commands doesn't cover must become a permission request. It must never be refused without asking. Why: a refused build or test leaves the change unchecked, and an engineer at the keyboard can say yes in seconds.

**CMP-28.** Each request shows as a card in the compile report (see [[Compile report]]). The card shows the tool, the exact command or file, and the reason Claude gives.

**CMP-29.** The engineer answers with one of three buttons:
- **Allow** allows this one request.
- **Always allow** allows this request and adds its rule to Allowed commands. CFG-16 in [[Settings]] says which rule.
- **Deny** refuses this request.

**CMP-30.** A request with no answer after 120 seconds is denied. Why: a compile must never hang because nobody is watching.

**CMP-31.** After a denial or a timeout, Claude carries on without that step. Every denied or timed-out request must appear in the report's problems, naming the command. Why: the engineer must know which check didn't run.

**CMP-32.** Writes to the vault and the snapshot are denied before any card is shown. A card must never offer them, and Always allow must never add them. See INV-4 in [[Model protection]].

**CMP-33.** When a compile is cancelled, or Obsidian closes, every open request is denied.

**CMP-34.** Each request gets its own card and its own 120 seconds. Requests are never answered in bulk.

**CMP-35.** Claude Code may withdraw a request before anyone answers. Its card closes and its countdown stops. A withdrawn request is not a problem, because nobody refused it.

## Claude's answer

**CMP-15.** Claude answers in a fixed shape: status (succeeded or failed), summary, changes, questions with the notes they refer to, and problems with anchors.

## Outcomes

**CMP-16. Succeeded.** Claude said succeeded and the run wasn't an error. The marker moves. Notice: "Compile finished."

**CMP-17. Failed.** Claude said failed, or gave no structured answer, or the snapshot changed. The marker moves. Notice: "Compile failed. See the compile report." Without a structured answer, the report's problems include "Claude Code exited with code N." and the error output.

**CMP-18. Cancelled.** The marker doesn't move. Summary: "You cancelled this compile. The last compile marker didn't move."

**CMP-19. Claude Code can't start.** The report fails with the summary "Claude Code couldn't be started." When the command isn't found: "Couldn't find the Claude Code CLI ("<command>"). Set its path in theory.md settings." The marker doesn't move.

**CMP-20. Obsidian closed mid-compile.** On the next load, the running report becomes failed with the problem "Obsidian closed before this compile finished." The marker never moved.

**CMP-21.** When Claude asked questions, the end notice adds " Claude has N questions about the model." (singular: "1 question").

**CMP-26.** Questions should have a reply button, clicking it will open note at rule that needs updating, if that is unavailable then open at heading. If everything fails then just the top of the note. Later after [[Team sync]] is implemented it will archive decisions for team.

## Last compile marker

**CMP-22.** The marker moves to the compiled revision once Claude has run, whether the compile succeeded or failed. Why: failed revisions must not be retried by themselves. Re-applying a failed revision is a human decision.

**CMP-23.** The marker never moves on cancel, or when the compile can't start.

**CMP-43.** Pull requests never move the marker. A closed pull request leaves the marker where it is. Why: re-applying a revision is a human decision, the same as after a failure.

## Compile branches

Each compile is a branch. Why: code changes from the model reach the main line only through a pull request a person reviews.

**CMP-37.** Before Claude runs, the plugin checks out a compile branch in every repository in the project folder. The plugin does this, never Claude. Why: every compile must land on a branch, whatever Claude does.

**CMP-38.** A new compile branch is named `theory/compile-{revision}`, after the short hash of the latest revision being compiled. Every repository gets the same name. Its base is the branch that was checked out when the compile started. Why: the same name shows which branches in different repositories came from the same compile.

**CMP-39.** A repository may have at most one open compile branch. A compile branch is open until it is merged into its base or its pull request is closed. When a repository already has an open compile branch, the compile checks it out and adds commits to it. It never starts a second one. Why: a new compile from the base would not see the earlier unmerged changes, and Claude would redo them or the two would conflict.

**CMP-40.** After Claude finishes, whatever the outcome, a compile branch created by this compile that got no commits is deleted, and its repository goes back to its base. A repository whose compile branch has commits stays on that branch, so the engineer can try the result.

**CMP-41.** The report records, for each repository, the compile branch, its base and the commits this compile added.

**CMP-42.** Compile never pushes. Branches are pushed only from Create PR (see [[Compile report]]).

## Cancel

**CMP-24.** The Cancel button in the compile report stops Claude. Turning the plugin off also cancels a running compile.

## Never

**CMP-25.** Compile must never send uncommitted text, write to the vault, or move the marker on cancel.
