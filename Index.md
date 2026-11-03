## What it is
Theory.md is a collaboration tool for teams of engineers to build software in an AI-assisted workflow. It runs inside obsidian as a desktop plugin. It requires git and claude code cli to function. Today it is used by one engineer, with one vault for one project (one or more repositories). With theory-server, a team shares one vault.

## Why it exists

When AI writes the code, the bigger risk is no longer messy code. The bigger risk is that the team stops understanding what the system does and why. Margaret-Anne Storey calls this cognitive debt: technical debt lives in the code, cognitive debt lives in developers' minds.

Peter Naur's *Programming as Theory Building* says a program is a theory held in its developers' heads. The code is only a by-product of that theory. When agents write the code and nobody holds the theory, the system becomes a black box.

theory.md keeps the theory on the page:

- Humans write the theoretical model.
- AI builds the code from the model.
- The AI never writes to the model.

The people who understand the system stay the source of truth.

## The loop

1. The engineer edits notes in the vault.
2. The engineer commits a note. The plugin records it as a git commit signed with the engineer's name and email.
3. The engineer clicks Compile. The plugin sends every revision committed since the last compile to Claude Code.
4. Claude Code changes the code in the project folder to match the model.
5. The plugin shows a compile report in Obsidian: summary, changes, questions and problems.
6. The engineer answers Claude's questions by editing the model and compiling again.

## Scope

**INV-1.** Code behaviour this model doesn't describe must be raised as a question in the compile report. Claude must never remove it in the same compile. Why: the model was written after the code, so a gap in the model is more likely than unwanted code. An engineer decides whether the behaviour goes into the model or out of the code.

INV-1 applies only to compiling this model into theory.md's own code. It is not a feature of theory.md, and the plugin must not add it to the prompt for other vaults. Claude reads it here, in the snapshot.

## Repositories

Each repository in the project folder has a folder of the same name here, with its own index and instructions.

- [[obsidian-plugin/index|obsidian-plugin]]: the Obsidian plugin.
- [[theory-server/index|theory-server]]: the server that lets a team share a vault.
