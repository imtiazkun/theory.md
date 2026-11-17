Compile turns pending revisions into GitHub issues: one issue, or an epic with sub-issues. [[Build]] then turns those issues into code. Why: the code must follow the model, never the other way round, and a person must see the planned work before any code changes.

## Starting a compile

**CMP-1.** A compile starts from the Compile button in the floating bar, the hammer in the ribbon or the command "Compile". There are no other triggers.

**CMP-2.** The compile report opens in a tab as soon as a compile starts.

## One at a time

**CMP-3.** Only one compile or build may run at a time in the app. A second attempt shows "A compile or build is already running." and opens the compile report.

The lock lives inside the app. It doesn't stop another engineer compiling the same vault on their own machine.

## Before it starts

These checks run in this order. When one fails, the compile doesn't start and the marker doesn't move. Why: a compile that starts must be able to record every issue it plans.

**CMP-48.** Before CMP-4, Compile pulls the vault and the code repositories, as PULL-15 to PULL-17 in [[Pull]] say.

**CMP-4.** The vault must be set up. Otherwise: "Set up the vault before compiling."

**CMP-5.** Uncommitted files are left out, with the notice "N uncommitted files aren't part of this compile." (singular: "1 uncommitted file isn't part of this compile."). This warning doesn't stop the compile.

**CMP-6.** The project folder must be set. Otherwise: "Compile failed: Choose the project folder in theory.md settings first."

**CMP-7.** The project folder must exist. Otherwise: "Compile failed: The project folder doesn't exist: {path}"

**CMP-8.** The vault must have at least one commit. Otherwise: "Compile failed: The vault has no commits yet. Commit your notes first."

**CMP-9.** At least one revision must be pending. Otherwise: "Every committed revision is already compiled."

**CMP-36.** Every repository in the project folder must have no uncommitted changes. Otherwise: "Compile failed: These repositories have uncommitted changes: {repos}. Commit or stash them first." Why: Claude plans from the committed code, and the engineer's unfinished work must never shape an issue.

**CMP-55.** `gh` must be installed and logged in. Otherwise: "Compile failed: Log in to GitHub first. Run gh auth login in a terminal."

**CMP-56.** Every repository in the project folder must have a GitHub `origin`. Otherwise: "Compile failed: These repositories have no GitHub origin: {repos}."

**CMP-57.** The GitHub Project in [[Settings]] (CFG-40) must be set, and `gh` must reach it. Otherwise: "Compile failed: Choose the GitHub Project in theory.md settings first." or "Compile failed: Couldn't reach the GitHub Project {project}: {reason}"

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
- A note with `realized: false` is written ahead of the code. Claude must not plan it and must not count it as a mismatch.
- When the model is unclear, incomplete or contradicts itself, Claude asks a question naming the notes. Claude never guesses. Claude carries on with the parts that are clear.
- Claude reads the code in the project folder to plan the work. Claude never changes a file anywhere.
- Notes at the model root describe the whole system. Notes in a folder named after a repository describe that repository only.
- Before planning work in a repository, Claude reads its `AGENTS.md` (and `CLAUDE.md`, if there is one) and `instructions.md` in that repository's model folder, so the issues fit how that repository is built and tested.
- Claude plans one issue or an epic, as CMP-59 to CMP-62 say.
- Every issue says what to build and why, in the model's words. It lists the rule IDs it covers. Those rules are its acceptance criteria.
- Every issue changes exactly one repository.
- Anything that went wrong goes in problems.
- A problem that comes from the model carries anchors: the note, the heading and a quote copied exactly from the note, under 200 characters.
- Claude reports failed when it can't plan the work.
- Claude never creates issues, branches or pull requests, and never touches GitHub.

## How Claude runs

**CMP-13.** The agent chosen in [[Settings]] runs in the project folder, with no chat: Claude Code by default, or an ACP agent (see [[Agents]]). It uses the model and effort from [[Settings]]. It gets only tools that read: reading files, searching and listing. Every tool that writes or runs a command is denied without a card. Why: a compile only plans, and only [[Build]] changes code.

**CMP-14.** Claude's tool calls stream into the report's activity log while it runs.

## The engineer's tools

**CMP-44.** Every command the plugin runs gets the PATH of the engineer's login shell. This covers git, Claude Code and `gh`, and every command Claude runs in turn. Why: Obsidian opened from the Dock doesn't read the shell's startup files. Tools the engineer installed, like `docker` in `~/.docker/bin`, are then missing, and Claude reports them as not installed.

**CMP-45.** The plugin reads that PATH once, when it loads. It runs the shell named in `$SHELL` (`/bin/zsh` when it isn't set) as a login, interactive shell, and reads the PATH it prints. A PATH changed later counts after the plugin reloads.

**CMP-46.** The plugin waits at most 5 seconds for the shell. Why: a broken shell profile must never hang Obsidian.

**CMP-47.** `/usr/bin`, `/usr/local/bin`, `/opt/homebrew/bin` and `~/.local/bin` are always added after the login PATH. When the shell fails or times out, they are added after Obsidian's own PATH instead. Why: git and Claude Code must still be found.

## Permission requests

These rules apply to [[Build]]. A compile never asks, because it only reads (CMP-13). In this section, a compile means a build.

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

**CMP-15.** Claude answers in a fixed shape: status (succeeded or failed), summary, the plan, questions with the notes they refer to, and problems with anchors. The plan is one issue, or an epic with its sub-issues in build order. Each issue has a repository, a title, a body, the rule IDs it covers and a short name.

## The plan

**CMP-59.** A plan is one issue when all its work changes one repository and carries one intent. Otherwise it is an epic, with one sub-issue for each repository and intent. Why: one issue becomes one pull request that a person can review in one sitting.

**CMP-60.** Sub-issues are listed in build order. Work that other sub-issues depend on comes first. Why: [[Build]] builds them one at a time, each on top of the last.

**CMP-61.** A short name says what changes, like `commit-page-diffs`. It uses lowercase letters, digits and dashes only, and has at most 40 characters. Branches are named from it (see [[Build]]).

**CMP-62.** A title is a short sentence in the imperative, under 70 characters, like "Show a diff for each file on the Commit page".

## Creating the issues

**CMP-63.** After Claude answers succeeded, the plugin creates the issues with `gh`. Claude never creates them.

**CMP-64.** One issue goes in its own repository. An epic goes in the repository with the most sub-issues. With a tie, it goes in the first of those repositories by name. Each sub-issue goes in its own repository, linked as a native sub-issue of the epic. Why: the epic sits where most of the work is.

**CMP-65.** An epic gets the label `epic`. The plugin creates the label in that repository when it is missing.

**CMP-66.** Every issue the compile creates, the epic included, is added to the GitHub Project (CFG-40).

**CMP-67.** Each issue's body ends with the vault revisions it was planned from.

**CMP-68.** When creating an issue fails, the report asks the engineer what to do:
- **Retry** creates the issues still missing.
- **Discard** closes the issues already created as not planned. The compile then counts as failed, and the marker doesn't move.

Why: a GitHub failure says nothing about the model, so the revisions must stay pending and be planned again.

## Outcomes

**CMP-16. Succeeded.** Claude said succeeded, the run wasn't an error and every issue exists. The marker moves. Notice: "Compile finished. {n} issues are ready to build." (singular: "1 issue is ready to build."). The report then offers Build (BLD-1 in [[Build]]).

**CMP-17. Failed.** Claude said failed, or gave no structured answer, or the snapshot changed. No issue is created. The marker moves. Notice: "Compile failed. See the compile report." Without a structured answer, the report's problems include "Claude Code exited with code N." and the error output.

**CMP-18. Cancelled.** No issue is created, and the marker doesn't move. Summary: "You cancelled this compile. The last compile marker didn't move."

**CMP-19. Claude Code can't start.** The report fails with the summary "Claude Code couldn't be started." When the command isn't found: "Couldn't find the Claude Code CLI ("{command}"). Set its path in theory.md settings." The marker doesn't move.

**CMP-54.** When Claude Code fails to sign in, the compile counts as one that can't start (CMP-19). The summary says "Claude Code isn't signed in. Run claude in a terminal, then /login." The marker doesn't move. Why: Claude never read the revisions, so they aren't compiled.

**CMP-20. Obsidian closed mid-compile.** On the next load, the running report becomes failed with the problem "Obsidian closed before this compile finished." The marker never moved.

**CMP-21.** When Claude asked questions, the end notice adds " Claude has N questions about the model." (singular: "1 question").

**CMP-26.** Questions should have a reply button, clicking it will open note at rule that needs updating, if that is unavailable then open at heading. If everything fails then just the top of the note.

## Last compile marker

**CMP-22.** The marker moves to the compiled revision once Claude has run, whether the compile succeeded or failed. Discarding issues (CMP-68) is the one exception. Why: failed revisions must not be retried by themselves. Re-applying a failed revision is a human decision.

**CMP-23.** The marker never moves on cancel, or when the compile can't start.

**CMP-43.** Builds and pull requests never move the marker. A closed pull request leaves the marker where it is. Why: re-applying a revision is a human decision, the same as after a failure.

## Compile branches

CMP-37 to CMP-42 and CMP-49 to CMP-53 are retired. A compile no longer touches code. [[Build]] makes the branches.

## Cancel

**CMP-24.** The Cancel button in the compile report stops Claude. Turning the plugin off also cancels a running compile.

## Never

**CMP-25.** Compile must never send uncommitted text, write to the vault, or move the marker on cancel.

**CMP-69.** Compile never changes a code repository: no file, commit, branch or push. Why: code changes only when the engineer starts a build.
