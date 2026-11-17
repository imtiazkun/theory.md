Build turns the issues a compile created into code: one issue into one pull request, or an epic into an epic branch holding every sub-issue's work. Why: the engineer decides when code changes, and each piece of work lands on its own branch with its own record on GitHub.

## Starting a build

**BLD-1.** A build starts from the Build button in the report of a compile that created issues, or the command "Build", which builds the issues of the newest such compile. When a compile succeeds, the report asks "{n} issues are ready. Build them now?" with Build and Later. There are no other triggers. Why: Compile only plans, and the engineer chooses when the plan becomes code.

**BLD-2.** A build builds the issues of one compile. Only one compile or build may run at a time (CMP-3).

**BLD-3.** The build shows in that compile's report. Each issue shows its state: waiting, building, built, skipped or failed.

## Before it starts

These checks run in this order. When one fails, the build doesn't start. Why: a build that starts must be able to finish every issue it touches.

**BLD-4.** The build pulls the vault and the code repositories first, as PULL-15 to PULL-17 in [[Pull]] say.

**BLD-5.** Claude Code, `gh` and the GitHub Project must be ready, as CMP-54, CMP-55 and CMP-57 in [[Compile]] say. The messages start with "Build failed:" instead of "Compile failed:".

**BLD-6.** Every repository with an issue must have no uncommitted changes. Otherwise: "Build failed: These repositories have uncommitted changes: {repos}. Commit or stash them first." Why: the engineer's unfinished work must never end up on a build branch.

**BLD-7.** Each such repository's default branch must not be behind its upstream. When it is behind and has no commits of its own, the plugin fast-forwards it first. When it has commits of its own too: "Build failed: {branch} in {repo} and origin/{branch} both have new commits. Pull with rebase in git, then build again." Why: Claude must build on the newest code.

**BLD-8.** No repository with an issue may have an open epic branch or an open pull request from an earlier build. Otherwise: "Build failed: Finish the open work in {repo} first: {branch or pull request}." Why: new work must start from code that holds every earlier change, or Claude redoes it or the two conflict.

**BLD-9.** Every issue to build must still be open. A closed issue is skipped, and the report says "Skipped {repo}#{number}: the issue is closed."

## Branches

The plugin makes and switches every branch. Claude never does.

**BLD-10.** An issue branch is named `theory/{issue number}-{short name}`, like `theory/57-sparkle-long-folders`. The short name comes from the plan (CMP-61). Why: the name says what changes, and the number finds the issue.

**BLD-11.** An epic branch is named `theory/epic-{epic number}-{short name}`. It has the same name in every repository with a sub-issue. Why: the same name shows which branches belong to one epic, and the epic has one number.

**BLD-12.** When a branch of that name already exists, the plugin adds `-2`, `-3` and so on. It never reuses or overwrites a branch.

## One issue

**BLD-13.** The plugin creates the issue branch from the repository's default branch and checks it out. Claude builds the issue on it.

**BLD-14.** When Claude succeeds, the plugin pushes the branch and opens a pull request into the default branch. Its title is the issue's title. Its body is Claude's summary, then "Closes #{number}". The engineer reviews and merges it, and merging closes the issue. Why: code reaches the default branch only through a pull request a person reviews.

## An epic

**BLD-15.** The plugin creates the epic branch from the default branch in every repository with a sub-issue, and pushes it.

**BLD-16.** Sub-issues are built one at a time, in the plan's order (CMP-60). For each one:
1. The plugin creates its issue branch from the epic branch, and Claude builds the sub-issue on it.
2. The plugin pushes the branch and opens a pull request into the epic branch. Its title is the sub-issue's title. Its body is Claude's summary, then "Part of #{epic number}" and "Resolves #{number}".
3. The plugin merges that pull request with a merge commit, then closes the sub-issue.

Why: GitHub keeps a reviewed record of each piece of work. GitHub closes an issue by itself only when a pull request merges into the default branch, so the plugin closes sub-issues itself.

**BLD-17.** After the last sub-issue, the report says "Epic #{number} is built on {branch}. Open a pull request into {default branch} when you're ready." It offers Create PR for the epic branches (REP-25 in [[Compile report]]).

**BLD-18.** The engineer merges the epic branch into the default branch and deletes it. The plugin never does either. Why: the whole epic reaches the default branch only through a person.

## How Claude runs

**BLD-19.** Claude runs as CMP-13 and CMP-14 say, in the issue's repository, with the permission mode and allowed commands from [[Settings]]. Permission requests work as CMP-27 to CMP-35 say.

**BLD-20.** For each issue, Claude receives the snapshot, the issue's repository, number, title and body, the rule IDs it covers, and the branch it is on.

**BLD-21.** Claude must follow these rules in every build:
- The model is read-only. Writing to the model is forbidden.
- The model is the source of truth. When the code disagrees, the code changes.
- Claude builds only what the issue covers, and changes files only in the issue's repository.
- Before changing the repository, Claude reads its `AGENTS.md` (and `CLAUDE.md`, if there is one) and `instructions.md` in its model folder, and follows them, including how to test. When they disagree, the model's `instructions.md` wins.
- Every code commit ends with `Model-Revision: <vault commit>` and `Refs #{issue number}`.
- When the model is unclear, Claude asks a question naming the notes. Claude never guesses.
- Anything that went wrong goes in problems, with anchors when it comes from the model.
- Claude reports failed when the code doesn't match the issue's rules at the end.
- Claude commits on the branch the plugin checked out. Claude never creates, switches, merges or pushes branches, and never touches GitHub.

## When something goes wrong

**BLD-22.** When an issue fails, the build stops and asks the engineer what to do:
- **Retry** builds the issue again on the same branch.
- **Skip** leaves the issue open and its branch as it is, and moves to the next sub-issue. A single issue has no Skip.
- **Stop** ends the build. Issues not built yet stay open.

An issue fails when Claude reports failed, gives no structured answer, or the push, pull request or merge fails.

**BLD-23.** Cancel stops Claude, then asks the engineer whether to keep the current issue's branch or delete it. Issues not built stay open.

**BLD-24.** When Obsidian closes mid-build, the issue being built shows as failed on the next load, with the problem "Obsidian closed before this issue was built." Its branch stays.

## Never

**BLD-25.** Build never writes to the vault, never moves the last compile marker, never pushes with force, and never merges into a default branch. It deletes a branch only when the engineer chooses so (BLD-23).
