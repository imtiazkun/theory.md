Each note's header carries a commit button (see [[Commit]]), a realized box and a compile state icon.

## Realized box

**HDR-1.** The box is ticked unless the note's front matter says `realized: false`.

**HDR-2.** Clicking it toggles. Unticking writes `realized: false`. Ticking deletes the key. Why: most notes are realized, so they must carry no extra text.

**HDR-3.** Its tooltip says "Realized. Click to mark as written ahead of the code." or "Not realized yet. Click to mark as realized."

**HDR-4.** The `realized` property is hidden in the editor. When it is the only property, the whole properties block is hidden. Source mode still shows it. Why: it is bookkeeping, not theory.

Why the box exists: writing ahead is allowed. A note may describe something not built yet, and Claude leaves it for later.

## Compile state

**HDR-5.** The icon is worked out from git and the reports. It is never stored.

**HDR-6.** The states, checked in this order:
- **Not committed yet**: git doesn't track the note.
- **Committed, waiting for a compile**: the note changed since the marker, or there is no marker yet. While a compile runs, it shows "Compiling…".
- **Failed**: the newest finished report that names the note failed. Tooltip: "The last compile of this note failed. Click for the report."
- **Compiled**: otherwise.

**HDR-7.** A report names a note when the note is among its changed notes or its anchors.

**HDR-8.** Clicking the icon opens the compile report.
