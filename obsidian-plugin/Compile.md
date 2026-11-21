Compile turns pending revisions into GitHub issues: one issue, or an epic with sub-issues. [[Build]] then turns those issues into code. Why: the code must follow the model, never the other way round, and a person must see the planned work before any code changes.

## Starting a compile

**CMP-1.** A compile starts from the Compile button in the floating bar, the hammer in the ribbon, the command "Compile", or Recompile in a compile report (CMP-72). There are no other triggers.

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
- the diff from the marker to the latest commit, with a summary of changed files (a recompile starts it at the earlier compile's start and also gets its open issues, CMP-76)

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
- In a recompile, Claude continues an earlier issue whenever the same work is still asked for in the same repository, as CMP-77 says.
- Anything that went wrong goes in problems.
- A problem that comes from the model carries anchors: the note, the heading and a quote copied exactly from the note, under 200 characters.
- Claude reports failed when it can't plan the work.
- Claude never creates issues, branches or pull requests, and never touches GitHub.

## How Claude runs

**CMP-13.** The agent chosen in the Compile row of [[Settings]] (CFG-41) runs in the project folder, with no chat: Claude Code by default, or an ACP agent (see [[Agents]]). It uses that row's model and effort. It gets only tools that read: reading files, searching and listing. Every tool that writes or runs a command is denied without a card. Why: a compile only plans, and only [[Build]] changes code.

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

**CMP-15.** Claude answers in a fixed shape: status (succeeded or failed), summary, the plan, questions with the notes they refer to, and problems with anchors. The plan is one issue, an epic with its sub-issues in build order, or empty when the code already matches the model. Each issue has a repository, a title, a body, the rule IDs it covers and a short name. In a recompile, an issue may also name the earlier issue it continues and say what changed (CMP-77, CMP-79).

## The plan

**CMP-59.** A plan is one issue when all its work changes one repository and carries one intent. Otherwise it is an epic, with one sub-issue for each repository and intent. Why: one issue becomes one pull request that a person can review in one sitting.

**CMP-60.** Sub-issues are listed in build order. Work that other sub-issues depend on comes first. Why: [[Build]] builds them one at a time, each on top of the last.

**CMP-61.** A short name says what changes, like `commit-page-diffs`. It uses lowercase letters, digits and dashes only, and has at most 40 characters. Branches are named from it (see [[Build]]).

**CMP-62.** A title is a short sentence in the imperative, under 70 characters, like "Show a diff for each file on the Commit page".

**CMP-70.** Before creating any issue, the plugin checks the plan:
- every issue names a repository in the project folder
- one issue changes one repository, and an epic has at least two sub-issues
- every issue lists at least one rule ID
- every short name follows CMP-61, and no two in one plan are the same
- every title has under 70 characters

When a check fails, the compile fails as CMP-17 says, and no issue is created. Problems list each broken check with the issue it is about. Why: a plan the plugin can't build from must never reach GitHub, and the engineer must see what Claude got wrong.

## Creating the issues

**CMP-63.** After Claude answers succeeded and the plan passes CMP-70, the plugin creates the issues with `gh`. Claude never creates them.

**CMP-64.** One issue goes in its own repository. An epic goes in the repository with the most sub-issues. With a tie, it goes in the first of those repositories by name. Each sub-issue goes in its own repository, linked as a native sub-issue of the epic. Why: the epic sits where most of the work is. A continued epic (CMP-77) stays in its repository, even when another repository now has more sub-issues. Why: moving it would close it and open a new one, which loses what continuing keeps.

**CMP-65.** An epic gets the label `epic`. The plugin creates the label in that repository when it is missing.

**CMP-66.** Every issue the compile creates, the epic included, is added to the GitHub Project (CFG-40).

**CMP-67.** Each issue's body ends with the vault revisions it was planned from.

**CMP-68.** When creating an issue fails, the report asks the engineer what to do:
- **Retry** creates the issues still missing.
- **Discard** closes the issues already created as not planned. The compile then counts as failed, and the marker doesn't move.

Why: a GitHub failure says nothing about the model, so the revisions must stay pending and be planned again.

## Outcomes

**CMP-16. Succeeded.** Claude said succeeded, the run wasn't an error and every issue exists. The marker moves. Notice: "Compile finished. {n} issues are ready to build." (singular: "1 issue is ready to build."). The report then offers Build (BLD-1 in [[Build]]).

**CMP-71. Nothing to build.** Claude said succeeded with an empty plan. No issue is created, and the marker moves. Notice: "Compile finished. The code already matches the model." The report offers no Build. Why: revisions that change no code, like a reworded reason, are still compiled.

**CMP-17. Failed.** Claude said failed, or gave no structured answer, or the plan broke CMP-70, or the snapshot changed. No issue is created. The marker moves. Notice: "Compile failed. See the compile report." Without a structured answer, the report's problems include "Claude Code exited with code N." and the error output.

**CMP-18. Cancelled.** No issue is created, and the marker doesn't move. Summary: "You cancelled this compile. The last compile marker didn't move."

**CMP-19. Claude Code can't start.** The report fails with the summary "Claude Code couldn't be started." When the command isn't found: "Couldn't find the Claude Code CLI ("{command}"). Set its path in theory.md settings." The marker doesn't move.

**CMP-54.** When Claude Code fails to sign in, the compile counts as one that can't start (CMP-19). The summary says "Claude Code isn't signed in. Run claude in a terminal, then /login." The marker doesn't move. Why: Claude never read the revisions, so they aren't compiled.

**CMP-20. Obsidian closed mid-compile.** On the next load, the running report becomes failed with the problem "Obsidian closed before this compile finished." The marker never moved.

**CMP-21.** When Claude asked questions, the end notice adds " Claude has N questions about the model." (singular: "1 question").

**CMP-26.** Questions should have a reply button, clicking it will open note at rule that needs updating, if that is unavailable then open at heading. If everything fails then just the top of the note.

## Recompile

Recompile plans a compile's work again, with the revisions committed since. It updates that compile's issues where it can, and replaces them only where it must. Why: a compile's questions and problems are answered in the model after the issues exist. Without Recompile, the old issues go stale, and the next compile plans the same work a second time.

### When it's offered

**CMP-72.** The report of a compile that created issues shows Recompile next to Build, while that compile can be recompiled (CMP-73). It is the only way to start a recompile.

**CMP-73.** A compile can be recompiled while:
- no compile after it succeeded
- no issue of its plan has been built: no build branch exists and no pull request was opened
- it hasn't been recompiled already

Otherwise Recompile is hidden. Why: a later compile's work would be planned twice, and built code would be left with no issue.

**CMP-74.** Recompile is disabled until at least one revision is pending (CMP-9). Its tooltip then says "Commit your answers to the model first." Why: with the same model, Claude would plan the same work again.

**CMP-75.** A recompile runs the same checks as a compile (CMP-48 to CMP-57), then checks CMP-73 again. Their messages start with "Recompile failed:" instead of "Compile failed:", as BLD-5 does for a build. When CMP-73 no longer holds: "Recompile failed: {reason}". Why: a build may have started since the report was drawn.

### What Claude receives and answers

**CMP-76.** A recompile is a compile, with these differences. Every other Compile rule applies.
- The revisions and the diff Claude receives start where the earlier compile started, not at the marker. They cover the earlier compile's revisions and every pending revision.
- Claude also receives the earlier compile's issues that are still open: number, repository, kind (epic or issue), title, body, rule IDs and short name.

**CMP-77.** Claude plans all the work again, then matches it to the earlier issues. An issue in the new plan may continue one earlier issue, by naming its number. Claude is told to continue an earlier issue whenever the same work is still asked for in the same repository, even when its title, body or rules change. A new issue is only for work no earlier issue covers. Why: an issue that keeps its number keeps its links, its place in the GitHub Project, and everything people wrote on it.

**CMP-78.** Continuing has limits. The plugin checks them with CMP-70, and a plan that breaks one fails the compile as CMP-17 says:
- it continues an issue from the earlier compile that is still open
- an issue stays in the same repository (an epic has no repository in the plan, and CMP-64 keeps it where it is)
- an epic continues an epic, and an issue continues an issue (a sub-issue counts as an issue)
- no earlier issue is continued twice

**CMP-79.** For each issue it continues, Claude says in one sentence what changed and why, like "Now names the description of each check, answered in STAT-10."

### What happens on GitHub

**CMP-80.** Once Claude's plan passes CMP-70, the plugin brings GitHub in line with it, in this order:
1. **Create** each new issue as CMP-63 to CMP-67 say.
2. **Update** each continued issue: its title, body, rules and short name become the new plan's, and it gets a comment with CMP-79's sentence and the revision it was planned from. An issue whose title and body don't change gets no comment.
3. **Link** sub-issues to match the new plan. A continued issue moves under the new plan's epic, and leaves an epic that isn't in the plan.
4. **Close** each earlier issue the new plan doesn't continue, as not planned, with the comment "No longer planned after {revision}. The new plan is {epic or issues}." When the new plan is empty (CMP-71), the comment is "The model no longer asks for this work ({revision})."

Why: updating first keeps every issue that can be kept. Closing comes last, so no work is closed before its new issue exists.

**CMP-81.** When a step fails, the report lists what's still to do and offers Retry, which carries on from there. Discard (CMP-68) is offered only while no earlier issue has been changed. Once one has, Discard is gone, because an edit on GitHub can't be undone. The marker moves once every step is done.

**CMP-82.** When a recompile fails, is cancelled or can't start before step 1, the earlier compile's issues stay as they were, and it can still be built or recompiled. The marker follows CMP-22 and CMP-23. Why: a failed plan must never throw away a good one.

**CMP-83.** After a recompile, its report owns every issue it created or continued. Build builds them from the new report, in the new plan's order.

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
