The compile report is how Claude talks back to the engineer. Why: questions and failures must reach a human without touching the model.

## When it opens

**REP-1.** The report opens in its own tab when a compile starts. The command "Show compile report" and the compile state icon in a note's header also open it.

**REP-2.** With no reports yet, it says "No compiles yet. Commit your changes to the model, then click Compile."

## Layout

**REP-3.** At the top, a dropdown lists past compiles, newest first, with a Compile button beside it.

**REP-12.** The report's Compile button is disabled while a compile runs. Why: only one compile may run at a time (see [[Compile]]).

**REP-4.** Below, in this order:
1. the status and the revision range (`from → to`, with `start` on the first compile)
2. Cancel while running, or Clear highlights when this compile's failure is shown in the notes
3. the summary
4. Problems
5. "Notes changed in this compile", only on a failed compile whose problems have no anchors
6. "Questions about the model"
7. "Changes to the code"
8. "Revisions compiled": subject, author, date and short hash
9. "Activity", folded, except while a permission card waits

**REP-5.** A section with nothing in it is left out.

## Questions

**REP-6.** Each question links to the notes it refers to. Clicking a link opens the note.

**REP-7.** The engineer answers a question by editing the model and compiling again, never in chat. Why: the answer must be in the model for the next reader.

## Suggestions

A suggestion is ideation for the engineer. It is never model text. Why: the words in the model must always be written by a person (see INV-11 in [[Model protection]]).

**REP-16.** Each question has a Suggest button below Reply.

**REP-17.** Suggest sends Claude Code this context and nothing else: the question, its anchors, the current text of every note the question names (uncommitted edits included), and the compile's summary. Why: the suggestion must fit the note as the engineer sees it now.

**REP-18.** Suggest runs Claude Code with no tools, using the model and effort from [[Settings]]. Claude reads nothing beyond that context and writes nothing.

**REP-19.** While Claude works, the button says "Suggesting…" and is disabled. One question has at most one suggestion at a time.

**REP-20.** The suggestion appears under its question. It shows the note and heading it is for, the suggested text in an editable box, and one sentence on why. The engineer may edit the text in the box.

**REP-21.** Accept copies the box's text to the clipboard and opens the note at the spot the question is about, the same way Reply does. It shows "Suggestion copied. Write it in the note in your own words." Accept must never write to a note.

**REP-22.** Reject removes the suggestion.

**REP-23.** A suggestion lives only on screen. It is never saved in the report, in plugin data or in the vault. Closing the report discards it.

**REP-24.** When Claude Code fails or gives no suggestion, the box shows "Couldn't get a suggestion: {reason}" and Suggest works again.

## Problems

**REP-8.** Each problem shows its text and links to its anchors. Clicking a link jumps to the spot. See [[Failure overlay]].

## Activity log

**REP-9.** Activity lists Claude's tool calls, one line each ("Tool: detail"), live while the compile runs. It keeps the last 500 lines.

## Permission cards

**REP-13.** A permission request (see [[Compile]]) appears as a card in Activity, at the point where Claude asked. While a card waits, Activity is open and scrolled to the card.

**REP-14.** The Deny button counts down the time left, from "Deny (2:00)" to "Deny (0:00)". At zero, the request is denied.

**REP-15.** Once answered, the card becomes one line in Activity: "Allowed: {command}", "Always allowed: {command}", "Denied: {command}", "Timed out: {command}" or "Withdrawn: {command}". The answer is kept with the report. Why keep withdrawn cards: the log must show every request Claude made, even one nobody answered.

## Pull requests

**REP-25.** A finished compile shows a Create PR button beside its status when at least one repository has an open compile branch with commits and no pull request yet (see "Compile branches" in [[Compile]]).

**REP-26.** Create PR opens the Create PR page in a new tab. The page has a shared Title and Body, and one section per repository with commits:
- the repository name and `{compile branch} → {base}`
- the commits on the compile branch
- Base, a dropdown of the remote's branches, set to the compile branch's base
- Draft, a toggle, off by default
- Reviewers, GitHub usernames separated by commas, empty by default
- "Use the shared title and body", a toggle, on by default. Turning it off shows that repository's own Title and Body, filled from the shared ones.

**REP-27.** The Title defaults to the subject of the latest compiled revision. The Body defaults to empty.

**REP-28.** Each Body box has a generate button with a sparkle, the same as the commit message (CMT-7). It runs Claude Code with no tools, using the model and effort from [[Settings]]. Claude gets the compile's summary, the revisions compiled, the problems and questions still open, and the changes for that repository (all repositories for the shared Body). The generated text replaces the box's text, and the engineer may edit it. Why no tools: the body is drawn from the report, and generating it must never change code or model.

**REP-29.** Create pushes each compile branch to its repository's `origin` and opens a pull request with `gh`, using that section's title, body, base, draft and reviewers. Once every pull request exists, each body gets a footer linking the vault revisions compiled and the pull requests in the other repositories. Why: a reviewer of one repository must find the rest of the same compile.

**REP-30.** A repository without a GitHub `origin`, or a machine without a logged-in `gh`, shows the reason in its section and has no Create. The other repositories still work.

**REP-31.** When a repository fails, its section shows "Couldn't create the pull request: {reason}" and keeps its fields, so Create can be tried again. Pull requests already created stay.

**REP-32.** Once pull requests exist, the report lists each one with its repository, link and state: draft, open, merged or closed. The state refreshes when the report opens. Create PR is then hidden for those repositories.

**REP-33.** Text on the Create PR page goes only to GitHub. It is never written into the vault. Closing the page discards unsent text.

## Where reports live

**REP-10.** Reports live in the plugin's data file, `.obsidian/plugins/theory-md/data.json`, which git ignores. They are never written into the vault.

**REP-11.** The last 20 reports are kept. Older ones are dropped.
