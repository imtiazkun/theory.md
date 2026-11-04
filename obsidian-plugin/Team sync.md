---
realized: false
---
Not built yet. theory.md is single-user today: one engineer, one vault, one project folder, one machine. Why build it: a theory held by one person isn't shared, and the team must hold the theory together.

The server's side is in [[theory-server/index|theory-server]]. This note is the plugin's side.

## Connecting

**SYNC-4.** Settings get a Server section with three settings: Server URL, Token and Vault name. The token is shown as a password field. It is stored in the plugin's data file, which git ignores.

**SYNC-5.** With no server URL set, the plugin must behave exactly as it does today, [[Pull]] included. Why: one engineer on their own must not need a server.

**SYNC-6.** A Connect button checks the token with the server (API-5, `GET /me`). The member's email must match the email git uses (CFG-34). Otherwise: "This token belongs to <member email>, but git signs as <author email>." Why: the server rejects commits whose author isn't the pusher (GIT-4).

**SYNC-7.** Connect sets the vault's remote `origin` to the vault's URL (GIT-2). When the vault already has a different `origin`, Connect asks before replacing it.

**SYNC-8.** The token must never be written into the remote URL or into git config. Each git command gets it as an HTTP header for that command only. Why: git config is plain text and gets copied around.

## Shared remote

**SYNC-1.** A server holds a shared git remote for the vault. Every engineer pushes and pulls the model through it.

**SYNC-9.** A Sync button in the floating bar, and the command "Sync", pull `main` from the server with rebase, then push it. Why: rebasing keeps one line of history, and the server never accepts a rewritten `main` (GIT-6).

**SYNC-10.** When anything conflicts, Sync puts the vault back exactly as it was before and says: "Sync stopped: these notes changed on the server too: <files>. Resolve them with git, then Sync again."

**SYNC-11.** Sync never commits. Uncommitted edits stay uncommitted.

**SYNC-12.** Committing never pushes. Why: an engineer may commit several revisions before sharing them.

**SYNC-13.** When the server rejects a push, Sync shows the server's message unchanged.

## Shared marker

**SYNC-2.** The `theory/compiled` tag is pushed to the remote. Every engineer sees the same last compile.

**SYNC-14.** With a server, the plugin takes the marker from the server's tag after a fetch, never from the local tag alone. The local tag is moved to match.

## Shared lock

**SYNC-3.** The compile lock moves to the remote. A second engineer must wait while a compile runs.

**SYNC-15.** With a server, these checks run before CMP-4, in this order. When one fails, the lock is released, the compile doesn't start and the marker doesn't move.
1. Take the lock (LOCK-1). When someone holds it: "<name> has been compiling since <time>. Try again when it's done."
2. Fetch the vault. The local `main` must be the same commit as the server's. Otherwise: "Sync before compiling: the vault isn't up to date with the server."
3. Fetch every repository in the project folder. None may be behind its upstream. Otherwise: "Pull these repositories first: <repos>." Why: a compile on old code makes pull requests that conflict.

**SYNC-16.** While the compile runs, the plugin renews the lock every 60 seconds (LOCK-3).

**SYNC-17.** When the compile ends, the plugin releases the lock (LOCK-8). It names the compiled commit as the marker when the compile succeeded or failed, and no marker when it was cancelled. Why: the marker rules stay the same as in [[Compile]].

**SYNC-18.** When the release fails because the lock expired, the report gets the problem: "Your compile lock expired, so the marker didn't move. The next compile will include these revisions again."

## Shared reports

**SYNC-19.** The release carries the compile report (SHR-1).

**SYNC-20.** With a server, the compile history view lists the vault's reports from every member, newest first (SHR-2). Reports from before connecting stay in plugin data.
