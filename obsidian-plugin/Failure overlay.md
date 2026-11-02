The failure overlay shows a failed compile on the notes it came from. Why: failures point back to the theory, and fixing them is a human decision.

## Checking anchors

**OVL-1.** An anchor is kept only when its file is inside the snapshot, after following links.

**OVL-2.** An anchor's heading and quote are kept only when they appear in that file.

**OVL-3.** A problem keeps at most 5 anchors. Problem text is cut at 2,000 characters.

**OVL-4.** When the snapshot changed, every anchor is dropped.

Why: Claude's pointers are untrusted, and a wrong pointer would blame the wrong part of the theory.

## Highlights

**OVL-5.** In every note a failed compile points at, the anchored lines are highlighted and the quoted text gets a wavy underline.

**OVL-6.** Hovering the highlight shows the problem.

**OVL-7.** Highlights follow the note's current text, quote first, then heading, and update as the engineer edits.

## Banner

**OVL-8.** A banner above the note says "The last compile failed here (n)", with Report and Dismiss buttons and the list of problems.

**OVL-9.** Clicking a problem jumps to its spot: it selects the text when editing and scrolls to it when reading.

**OVL-10.** When the quote or heading is gone from the note, the banner says "This spot has changed since the compile." A jump then shows "Couldn't find this spot. The note has changed since the compile." When the note itself is gone: "<path> isn't in the vault any more."

## When nothing is anchored

**OVL-11.** When no problem has anchors, every note changed in that compile gets a banner saying it may be the cause. The report lists those notes too: "Claude didn't say where in the model the compile failed. One of these notes may be the cause."

## Dismiss and clear

**OVL-12.** Dismiss removes the highlights and banners. The report stays. Clear highlights in the report does the same.

**OVL-13.** The overlay shows only the newest finished compile. A newer compile that didn't fail clears it.

## Display only

**OVL-14.** The overlay never writes to a note.

**OVL-15.** Claude's text is always shown as plain text, never rendered as HTML or Markdown. Why: Claude's text is untrusted.
