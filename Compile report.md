The compile report is how Claude talks back to the engineer. Why: questions and failures must reach a human without touching the model.

## When it opens

**REP-1.** The report opens in its own tab when a compile starts. The command "Show compile report" and the compile state icon in a note's header also open it.

**REP-2.** With no reports yet, it says "No compiles yet. Commit your changes to the model, then click Compile."

## Layout

**REP-3.** At the top, a dropdown lists past compiles, newest first, with a Compile button beside it.

**REP-4.** Below, in this order:
1. the status and the revision range (`from → to`, with `start` on the first compile)
2. Cancel while running, or Clear highlights when this compile's failure is shown in the notes
3. the summary
4. Problems
5. "Notes changed in this compile", only on a failed compile whose problems have no anchors
6. "Questions about the model"
7. "Changes to the code"
8. "Revisions compiled": subject, author, date and short hash
9. "Activity", folded

**REP-5.** A section with nothing in it is left out.

## Questions

**REP-6.** Each question links to the notes it refers to. Clicking a link opens the note.

**REP-7.** The engineer answers a question by editing the model and compiling again, never in chat. Why: the answer must be in the model for the next reader.

## Problems

**REP-8.** Each problem shows its text and links to its anchors. Clicking a link jumps to the spot. See [[Failure overlay]].

## Activity log

**REP-9.** Activity lists Claude's tool calls, one line each ("Tool: detail"), live while the compile runs. It keeps the last 500 lines.

## Where reports live

**REP-10.** Reports live in the plugin's data file, `.obsidian/plugins/theory-md/data.json`, which git ignores. They are never written into the vault.

**REP-11.** The last 20 reports are kept. Older ones are dropped.
