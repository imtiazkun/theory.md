Hooks run the engineer's own commands when something happens in theory.md, like posting to Slack. Why: each team wants its news somewhere different, and the plugin must not know every service.

## Hooks and events

**HOOK-1.** A hook is a shell command tied to one event. The settings hold a list of hooks, each with an event and a command.

**HOOK-2.** The events are:
- `comment`: a comment, reply, resolve or reopen is committed (CMNT-13 in [[Comments]])
- `commit`: a revision of the model is committed (see [[Commit]])
- `push`: a push finishes, pushed or failed (CMT-30)
- `compile-start`: a compile starts (see [[Compile]])
- `compile-end`: a compile succeeds, fails or is cancelled
- `permission-request`: Claude asks for permission during a compile (CMP-28)

**HOOK-3.** The command gets the event as JSON on stdin: the event, the vault name, the author, the time and the event's details. Details are the note and comment text, the commit hash and subject, or the compile status, summary and number of questions.

## Running

**HOOK-4.** Hooks run after their event, never before. A hook never stops, changes or delays what triggered it. Why: a broken Slack link must never block a commit or a compile.

**HOOK-5.** Hooks run with the login PATH (CMP-44), in the vault folder.

**HOOK-6.** A hook gets at most 10 seconds, then it is stopped.

**HOOK-7.** A hook that fails or times out shows the notice "Hook for {event} failed: {reason}".

## Storing

**HOOK-8.** Hooks live in the plugin's data, never in the vault. Why: a hook often holds a secret, like a Slack webhook URL, and the vault is pushed to a public repo (CMT-30).

## Testing a hook

**HOOK-9.** Each hook has a Test button that sends it a sample event.
