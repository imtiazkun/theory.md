Everything theory.md adds to Obsidian's window that other notes don't cover.

## On launch

**UI-1.** `Index.md` opens when Obsidian launches. It doesn't open when the plugin is turned on mid-session. Why: Index is the entry to the theory, but turning the plugin on must not take the engineer away from their note.

## Compile bar

**UI-2.** A floating bar at the bottom right of the editor holds a commit button and a compile button. Settings can hide it.

**UI-3.** The compile button's state, checked in this order:
1. **Hidden**: the vault isn't set up, or the bar is turned off.
2. **Compiling…**: a compile runs. Tooltip: "A compile is running. Click to follow it."
3. **Set up Compile**: no project folder is set. Tooltip: "Choose the project folder this model compiles into."
4. **Compile**: revisions are pending. A badge shows how many, in the accent colour. Tooltip: "Compile N new revisions into the code."
5. **Last compile failed**: nothing is pending and the newest report failed. Tooltip: "Click to see what went wrong."
6. **Up to date**: nothing to do. Tooltip: "Every committed revision is compiled."

**UI-4.** When files have uncommitted changes, the tooltip adds that they won't be compiled.

## Commit history

**UI-5.** The right sidebar shows the active note's commits, newest first: subject, author, relative time and short hash. It follows renames.

**UI-6.** When the note has uncommitted changes, it says "Uncommitted changes" and offers "Commit…".

**UI-7.** A note without commits shows "No commits yet for this note." A vault that isn't set up shows a Setup vault button.

## Ribbon and status bar

**UI-8.** A hammer in the ribbon runs Compile.

**UI-9.** The status bar shows "Compiling…" while a compile runs.

## Commands

**UI-10.** The commands are: Setup vault, Show commit history, Compile, Show compile report, Commit current note. There are no others.

## Hidden folders

**UI-11.** Folders whose name starts with `_` are greyed out and listed last in the file explorer. Why: they hold helpers like templates, not theory.

**UI-12.** Hidden folders are still committed and sent to Claude.
