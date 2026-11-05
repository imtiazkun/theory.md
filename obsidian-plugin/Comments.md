A comment is text an engineer writes on part of a note that the AI ignores. Why: engineers must be able to discuss the theory right where it is written, without the discussion becoming the model.

## Never sent

**CMNT-1.** Comments are never sent to any agent: not by Compile, Expand, commit messages or pull request bodies (INV-13). Why: a comment is discussion, not theory, and the AI builds only from theory.

**CMNT-2.** A comment never changes the note it is on. The note's text, front matter and git history stay as they were. Why: only the engineer's own writing belongs in a note.

## Writing a comment

**CMNT-3.** When text is selected in a note, a small button with a comment icon floats just above the selection. Its tooltip says "Comment". It shows in the editor and in Reading view. It hides when the selection is cleared.

**CMNT-4.** Selecting text in the properties block, or across two notes, shows no button.

**CMNT-5.** Clicking the button opens a popover under it with a text box, a Cancel button and a Comment button. Cmd/Ctrl+Enter comments. Esc cancels. Comment can't be clicked while the box is empty.

**CMNT-6.** The command "Comment on selection" opens the same popover. Without a selection it says "Select the text to comment on first."

**CMNT-7.** A comment is anchored like a problem anchor: the note, the nearest heading above the selection, and the selected text as the quote.

**CMNT-8.** A comment is signed with the name and email git uses (CFG-34). When git has no name or email, nothing is saved and the notice says "Set your name and email in git first. theory.md settings show how." Why: every word in the vault must have a human author, comments included.

## Where comments are saved

**CMNT-9.** A note's comments are saved in one JSON file in the `.comments/` folder of the note's model folder, at the note's path inside that folder, with `.json` instead of `.md`:
- `obsidian-plugin/Compile.md` → `obsidian-plugin/.comments/Compile.json`
- `obsidian-plugin/flows/Login.md` → `obsidian-plugin/.comments/flows/Login.json`
- A note outside every model folder, like `Index.md`, uses the `.comments/` folder at the vault root: `.comments/Index.json`.

`.comments/` is a dot folder (see [[Concepts]]).

**CMNT-10.** The file holds the note's path and its threads. A thread holds its anchor, its comments in the order they were written, and whether it is resolved:

```json
{
  "version": 1,
  "note": "obsidian-plugin/Compile.md",
  "threads": [
    {
      "id": "k3f9a2",
      "anchor": { "heading": "Compile", "quote": "the code must follow the model" },
      "comments": [
        { "id": "p81xq0", "author": { "name": "Ana Lee", "email": "ana@example.com" }, "at": "2026-11-04T08:42:00Z", "text": "What about hotfixes?" }
      ],
      "resolved": null
    }
  ]
}
```

`resolved` is `null`, or who resolved the thread and when: `{ "by": { "name", "email" }, "at" }`. Times are UTC, in ISO 8601.

**CMNT-11.** The file is written with two-space indents and a newline at the end. Why: a comment's diff must be readable in git.

**CMNT-12.** A file the plugin can't read is never overwritten. The Comments view says "The comments on {note} can't be read: {file}." Why: a broken file may still hold someone's words.

## Committing comments

**CMNT-13.** Each new comment, reply, resolve and reopen writes the file and commits only that file at once, signed by the author:
- "Comment on {note name}"
- "Reply on {note name}"
- "Resolve a comment on {note name}"
- "Reopen a comment on {note name}"

Why: a comment must reach the team with the next pull, and must never ride along in a commit of the model.

**CMNT-14.** When that commit fails, the comment stays saved in the file, and the notice says "Comment saved but not committed: {reason}". The next comment on the note commits the file with it.

**CMNT-15.** When a note is renamed or moved in Obsidian, its comment file moves to match, and the move is committed at once as "Move comments on {note name}". When a note is deleted, its comment file is deleted and committed as "Delete comments on {note name}". Earlier comments stay in git history.

## Comments view

**CMNT-16.** The right sidebar has a Comments view beside commit history and compile history (UI-23). It shows the comments on every note in the vault, whichever note is open. Why: a discussion must not hide in a note nobody has open.

**CMNT-17.** Open threads come first, grouped by note. The note with the newest comment comes first. Each group starts with the note's path without `.md`, like `obsidian-plugin/Compile`. Inside a group, threads follow the order their quotes appear in the note. Each thread shows:
- the quote, cut to two lines
- each comment: the author's name, the time ("2 h ago") and the text. The name's tooltip gives the email.
- a Reply box
- a Resolve button

**CMNT-26.** Clicking a thread's quote opens its note in the editor, scrolls to the quote and selects it. Why: the engineer must see exactly the text the comment is about.

**CMNT-27.** When the quote is no longer in the note (CMNT-20), clicking it opens the note at the anchor's heading, else at the top, and selects nothing.

**CMNT-28.** Clicking a group's note path opens the note at the top.

**CMNT-18.** Replies show under the first comment, oldest first. A reply is a comment like any other, signed the same way (CMNT-8).

**CMNT-19.** Anyone may resolve a thread. A resolved thread says "Resolved by {name}, {time}". Resolved threads are folded away under "{n} resolved" at the bottom, grouped by note like open ones. Each has a Reopen button.

**CMNT-20.** When a thread's quote is no longer in the note, the thread says "The text this was on has changed." and still shows the old quote. It stays open until someone resolves it. Why: a changed rule is exactly when the discussion matters.

**CMNT-21.** When the vault has no comments: "No comments yet. Select text in a note to comment."

**CMNT-22.** Comment text is shown as plain text, never as Markdown or HTML. Why: a comment must never run as code or pull content into Obsidian.

**CMNT-23.** After a pull brings new comments, the view shows them.

## In the note

**CMNT-24.** The quoted text of each open thread is underlined in the note in the accent colour. Clicking it opens the Comments view at that thread. Resolved threads aren't underlined.

**CMNT-25.** The underline is display only, like overlays. It never writes to the note.

## Not built yet

Editing and deleting a comment.

When two engineers comment on the same note before either pulls, both commit, and the vault needs a sync (PULL-7). Merging the two files by itself is not built yet.
