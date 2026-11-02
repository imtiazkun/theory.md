---
realized: false
---
Not built yet. theory.md is single-user today: one engineer, one vault, one project folder, one machine. Why build it: a theory held by one person isn't shared, and the team must hold the theory together.

## Shared remote

**SYNC-1.** A server holds a shared git remote for the vault. Every engineer pushes and pulls the model through it.

## Shared marker

**SYNC-2.** The `theory/compiled` tag is pushed to the remote. Every engineer sees the same last compile.

## Shared lock

**SYNC-3.** The compile lock moves to the remote. A second engineer must wait while a compile runs.
