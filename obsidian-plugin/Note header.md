Each note's header carries the rule count, a commit button (see [[Commit]]), a realized box and a compile state icon. In the editor, each rule shows who last changed it (see Rule authors).

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

**HDR-9.** The header shows how many rules the open note declares, as "12 rules", left of the other header icons. A note with one rule shows "1 rule". A note without rules shows nothing. Each declaration counts, so an ID declared twice counts as 2. Why count both: the duplicate is a mistake, and HDR-13 must show it, not hide it. Why: the engineer must see at a glance how much a note claims.

**HDR-10.** A rule is a paragraph or list item that starts with a bold ID: capital letters, a dash and a number, with or without a period, like `**PULL-6.**` or `**CMT-8**`. Text in code blocks and in front matter never counts.

**HDR-11.** The count is worked out from the note's text as it is now, uncommitted edits included, and updates as the engineer types. It is never stored.

**HDR-12.** The count's tooltip lists each prefix with its count and its lowest and highest number: "PULL: 22 rules, PULL-1 to PULL-22". A prefix with one rule shows its only ID: "CMT: 1 rule, CMT-8".

**HDR-13.** When the note declares one ID more than once, the count shows in the warning colour, and the tooltip adds "PULL-6 is declared twice." Why: a reused ID makes failure pointers point at the wrong rule (see [the root Instructions](../Instructions.md)).

## Rule authors

**HDR-14.** In the editor, every rule shows grey text after its first line: who last changed it and when, like "Imtiaz · 2026-11-03 17:20". Why: every claim must have a human behind it, and the engineer must see who without opening the history.

**HDR-15.** "Who" is the author of the newest commit that changed any line of the rule. A rule ends where its paragraph or list item ends (HDR-10). Why: a fix on a rule's last line is still a change to the rule.

**HDR-16.** "When" is that commit's author date, in local time, as `YYYY-MM-DD HH:mm`. Why absolute: it can be compared against the compile history, and it never goes stale on screen.

**HDR-17.** A rule with any uncommitted line shows "Not committed yet" instead. Why: unsigned text has no author, and the label must never give someone else credit for it.

**HDR-18.** The tooltip shows the commit's subject and short hash.

**HDR-19.** The text is worked out from git each time: when the note opens, after a commit, after a pull, and shortly after the engineer stops typing. It is never stored.

**HDR-20.** The text is display only. It is never written into the note, and never sent to any agent. Why: anything in the note becomes theory.

## Not built yet

Reading view shows no rule authors.
