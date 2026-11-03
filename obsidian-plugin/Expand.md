Expand asks Claude which notes a repository's model is missing before its code can be built. Claude only suggests. The engineer decides which notes exist and writes every word in them. Why: deciding what the system is is the theory, and the theory must stay in human heads (see INV-11 in [[Model protection]]).

## The button

**EXP-1.** When the active note is a model folder's `index.md`, the compile bar shows an Expand button beside the commit button. On any other note, including the root `Index.md`, it doesn't show. Why: the root Index describes the whole system, and which repositories a system needs is a different question.

**EXP-2.** Expand opens the Expand view for that repository in a new tab, and asks Claude at once.

**EXP-3.** While Claude works, the button and the view say "Expanding…", and Expand for that repository is disabled. Expand runs at most once per repository at a time.

## What Claude gets

**EXP-4.** Expand sends Claude Code this context and nothing else:
- the model folder's `index.md` and `instructions.md`
- the current text of every other note in that model folder
- the root `Index.md`
- the names of all notes in the model folder

The notes are read as they are now, uncommitted edits included. Why: Expand compiles nothing, and the engineer is asking about the index as it stands.

**EXP-5.** Hidden folders and the root Instructions are never sent.

**EXP-6.** When the repository exists in the project folder, Claude may read its code with Read, Glob and Grep, inside that repository only. Claude gets no other tools. It can't write, edit or run anything. Why: in a repository that already exists, code that no note describes is the most useful gap Expand can find.

**EXP-7.** Expand uses the model and effort from [[Settings]].

## What Claude must return

**EXP-8.** Claude returns at most 10 suggested notes. Why: a short list gets read; a long list gets accepted without thought.

**EXP-9.** Each suggestion has:
- a note name
- the question the note must answer
- why it is needed: the line of the index, or the file of code, that calls for it
- two or three headings it might have

**EXP-10.** Claude must only suggest notes that the index or the code calls for, and must name the line or file. Claude must never suggest a feature the index doesn't mention. Why: whatever the model describes, Compile builds, so a suggested feature becomes code nobody asked for.

**EXP-11.** Claude must never suggest a note that already exists in the model folder.

**EXP-12.** When nothing is missing, the view says "No missing notes found." When Claude Code fails or returns nothing usable, it says "Couldn't expand: {reason}", and Expand works again.

## The view

**EXP-13.** The view shows each suggestion as a card: the name, the question, the reason with its line or file, and the headings. Each card has Create note, Copy and Dismiss.

**EXP-14.** Create note asks for the note's name in a box filled with the suggested name. The engineer confirms or retypes it. The plugin then creates an empty note with that name in the model folder and opens it. The note's body stays empty. The suggested question and headings are never written into it. Why: a name the engineer confirmed is theirs, but every sentence in a note must be typed by a person (INV-11).

**EXP-15.** When a note with that name already exists in the model folder, Create note says "{name} already exists." and creates nothing.

**EXP-16.** Create note never commits. The new note shows as uncommitted, like any new note.

**EXP-17.** Copy copies the card's name, question and headings to the clipboard as plain text, and shows "Copied. Write the note in your own words."

**EXP-18.** Dismiss removes the card. A card whose note was created shows "Created" and keeps only Dismiss.

**EXP-19.** Suggestions live only on screen. They are never saved in plugin data or in the vault. Closing the view discards them. Running Expand again replaces them.
