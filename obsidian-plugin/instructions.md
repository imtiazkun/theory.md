The writing rules in [the root Instructions](../Instructions.md) apply here. Rules for Claude that apply only to this repository go below.

## Tests

**TEST-1.** The repository must have an automated test suite run by `npm test`, using Vitest. Why: `tsc` only catches type errors, and several bugs in this plugin type-checked fine.

**TEST-2.** Before every commit, Claude must run `npm run build` and `npm test`, and both must pass. When one fails, Claude fixes it or reports it as a problem. Claude never commits past a failing test.

**TEST-3.** Every change to branch, commit, compile or anchor logic must come with a test that would have failed before the change.

**TEST-4.** These must always have tests:
- compile branches: creating, reusing, deleting an empty branch, and starting fresh after a merge, across several repositories
- changed files and commits: one note, all files, with `.obsidian/` ignored and with it tracked
- anchors: kept when the file, heading and quote are in the snapshot, dropped otherwise
- Always allow: which rules a request saves (CFG-16)
- the snapshot: hidden folders, `.obsidian/` and the root Instructions are left out
- the index and instructions highlight: exactly the right paths match
- missing starter files: which ones count as missing, that existing files are never changed, and that only the files written are committed (SET-15, CFG-20 to CFG-22)
- pull request states: only draft and open ones are checked, a failed check keeps the saved state, and a focus refresh within 30 seconds is skipped (REP-35, REP-37, REP-39)
- Expand: the context it sends (EXP-4, EXP-5), the tools it allows (EXP-6), and that Create note writes an empty note and never commits (EXP-14 to EXP-16)
- the templates for `index.md` and `instructions.md`: placeholders filled, lines of empty fields left out, and the built-in text when a template is missing or empty (REPO-19 to REPO-22)
- the login PATH: used when the shell answers, the fallback when the shell fails or takes over 5 seconds, and the extra folders added after it (CMP-44 to CMP-47)
- ACP agents: model writes denied without a card, other requests reaching a card, the answer read from the last JSON block, and a missing agent command (AGT-10 to AGT-15, AGT-19)

**TEST-5.** Tests that need git must use real git repositories in a new temporary folder, and delete it afterwards. They must never touch the vault, the project folder or the engineer's own repositories. Why: a test must never be able to damage real work.

**TEST-6.** Tests must never call Claude Code, GitHub or the network. Calls to `claude` and `gh` are replaced with fakes. ACP tests run a small fake agent made in the test's temporary folder, never a real one. Why: tests must be fast, free and work offline.

**TEST-7.** The `obsidian` module is replaced with a small stub in tests. Views, modals and the file explorer are not tested automatically; a person checks them in Obsidian. Why: mocking Obsidian costs more than it catches.

**TEST-8.** `CLAUDE.md` and `AGENTS.md` must say how to run the tests and how to run a single test.
