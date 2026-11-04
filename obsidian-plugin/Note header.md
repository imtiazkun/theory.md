Each note's header carries the rule count, a commit button (see [[Commit]]), a realized box and a compile state icon.

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

## Rule count

**HDR-9.** The header shows how many rules the open note declares, as "12 rules", left of the other header icons. A note with one rule shows "1 rule". A note without rules shows nothing. Why: the engineer must see at a glance how much a note claims.

**HDR-10.** A rule is a paragraph or list item that starts with a bold ID: capital letters, a dash and a number, with or without a period, like `**PULL-6.**` or `**CMT-8**`. Text in code blocks and in front matter never counts.

**HDR-11.** The count is worked out from the note's text as it is now, uncommitted edits included, and updates as the engineer types. It is never stored.

**HDR-12.** The count's tooltip lists each prefix with its count and its lowest and highest number: "PULL: 22 rules, PULL-1 to PULL-22".

**HDR-13.** When the note declares one ID more than once, the count shows in the warning colour, and the tooltip adds "PULL-6 is declared twice." Why: a reused ID makes failure pointers point at the wrong rule (see [the root Instructions](../Instructions.md)).
