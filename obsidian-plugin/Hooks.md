Hooks run the engineer's own commands when something happens in theory.md, like posting to Slack. Why: each team wants its news somewhere different, and the plugin must not know every service.

## Hooks and events

**HOOK-1.** A hook is a shell command tied to one event. The settings hold a list of hooks, each with an event and a command.

**HOOK-2.** The events are:
- `comment`: an engineer posts a comment, reply, resolve or reopen (see [[Comments]]). It fires as soon as the comment is saved, even when its own commit fails (CMNT-13). Its details say whether the comment was committed.
- `commit`: theory.md commits a revision of the model, from the Commit page (see [[Commit]]), Setup vault or Create missing files. Commits of comment files never fire it; they fire `comment`. Moving or deleting a comment file (CMNT-15) fires no event.
- `push`: a push to `origin` finishes, pushed or failed (CMT-30). A vault without `origin` never fires it (CMT-36).
- `compile-start`: a compile starts (see [[Compile]])
- `compile-end`: a compile succeeds, fails or is cancelled
- `build-start`: a build starts (see [[Build]])
- `build-end`: a build ends: finished, stopped by the engineer (BLD-22) or cancelled (BLD-23). A build that doesn't start (BLD-5 to BLD-9) fires neither build event.
- `permission-request`: Claude asks for permission during a build (CMP-28)

**HOOK-3.** The command gets the event as JSON on stdin: the event, the vault name, the author, the time and the event's details. Details are the note and comment text, the commit hash and subject, or the compile status, summary, number of questions and the issues it created. For a recompile (CMP-72 in [[Compile]]), `compile-start` and `compile-end` also say that it is a recompile and name the earlier compile (its date and revision range), and `compile-end` lists the issues it created, continued and closed, each in its own list. For `build-start`, the details are the issues to build and the epic, if there is one. For `build-end`, they are how the build ended, each issue's state (BLD-3), the pull requests it opened and the epic branch, if there is one. For `push`, the details are whether it pushed and git's message when it failed. For `permission-request`, they are the tool, the exact command or file, and Claude's reason.

## Running

**HOOK-4.** Hooks run after their event, never before. A hook never stops, changes or delays what triggered it. Why: a broken Slack link must never block a commit or a compile.

**HOOK-5.** Hooks run with the login PATH (CMP-44), in the vault folder.

**HOOK-6.** A hook gets at most 10 seconds, then it is stopped.

**HOOK-7.** A hook that fails or times out shows the notice "Hook for {event} failed: {reason}".

## Storing

**HOOK-8.** Hooks live in the plugin's data, never in the vault. Why: a hook often holds a secret, like a Slack webhook URL, and the vault is pushed to a public repo (CMT-30).

## Testing a hook

**HOOK-9.** Each hook has a Test button that sends it a sample event.
