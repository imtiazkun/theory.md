Everything theory.md adds to Obsidian's window that other notes don't cover.

## On launch

**UI-1.** `Index.md` opens when Obsidian launches. It doesn't open when the plugin is turned on mid-session. Why: Index is the entry to the theory, but turning the plugin on must not take the engineer away from their note.

## Compile bar

**UI-2.** A floating bar at the bottom right of the editor holds a commit button and a compile button. Settings can hide it.

**UI-13.** While the bar shows, Obsidian's status bar moves to the bottom left of the editor. When the bar hides or the plugin turns off, the status bar goes back. Why: the bar and the status bar must never cover each other.

**UI-3.** The compile button's state, checked in this order:
1. **Hidden**: the vault isn't set up, or the bar is turned off.
2. **Compiling…**: a compile runs. Tooltip: "A compile is running. Click to follow it."
3. **Set up Compile**: no project folder is set. Tooltip: "Choose the project folder this model compiles into."
4. **Compile**: revisions are pending. A badge shows how many, in the accent colour. Tooltip: "Compile N new revisions into the code."
5. **Last compile failed**: nothing is pending and the newest report failed. Tooltip: "Click to see what went wrong."
6. **Up to date**: nothing to do. Tooltip: "Every committed revision is compiled." followed by "Commit changes to the model to compile them." when no file has uncommitted changes.

**UI-4.** When files have uncommitted changes, the tooltip adds that they won't be compiled.

**UI-17.** While a permission card waits, the compile button says "Claude is asking (1:47)", counting down with the card. Clicking it opens the compile report at the card. Why: the engineer may be editing a note with the report tab hidden.

## Commit history

**UI-5.** The right sidebar shows the active note's commits, newest first: subject, author, relative time and short hash. It follows renames.

**UI-6.** When the note has uncommitted changes, it says "Uncommitted changes" and offers "Commit…".

**UI-7.** A note without commits shows "No commits yet for this note." A vault that isn't set up shows a Setup vault button.

**UI-14.** With no note open, it says "Open a note to see its commit history."

**UI-15.** The view has a Refresh action. Why: git can change outside Obsidian, and the view must be refreshable by hand.

## Ribbon and status bar

**UI-8.** A hammer in the ribbon runs Compile. A Repositories button in the ribbon opens the Repositories page (see [[Repositories]]).

**UI-9.** The status bar shows "Compiling…" while a compile runs.

## Commands

**UI-10.** The commands are: Setup vault, Show commit history, Compile, Show compile report, Commit current note, Show repositories. There are no others.

## Hidden folders

**UI-11.** Folders whose name starts with `_` are greyed out and listed last in the file explorer. Why: they hold helpers like templates, not theory.

**UI-12.** Hidden folders are still committed and must not be sent to Claude.

## Index and instructions files

**UI-19.** In the file explorer, `index.md` and `instructions.md` at the vault root and directly inside a model folder are shown in bold, with an icon to the left of the name: a house for index, a scroll for instructions. Names match ignoring case. Why: they are the entry point and the rules of each part of the model, and must be found at a glance.

## Compile History

**UI-16.** Beside commit history in the right sidebar should show list of compiles along with when, by who and total amount of token spent in that compile. 

**UI-18.** Each compile in that list shows the state of its pull requests: none, draft, open, merged or closed. With several repositories, it shows each one.