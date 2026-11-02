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
- Every code commit ends with `Model-Revision: <vault commit>`.
- When there are several repositories, every change and problem starts with the repository name in brackets, like "[mobile] …".
- Anything that went wrong goes in problems.
- A problem that comes from the model carries anchors: the note, the heading and a quote copied exactly from the note, under 200 characters.
- Claude reports failed when the code doesn't match the model at the end.

## How Claude runs

**CMP-13.** Claude Code runs in the project folder, with no chat. It uses the permission mode, allowed commands, model and effort from [[Settings]]. When Claude needs something the settings don't allow, it asks the engineer with a permission card (see "Permission requests" below).

**CMP-14.** Claude's tool calls stream into the report's activity log while it runs.

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

## Cancel

**CMP-24.** The Cancel button in the compile report stops Claude. Turning the plugin off also cancels a running compile.

## Never

**CMP-25.** Compile must never send uncommitted text, write to the vault, or move the marker on cancel.
