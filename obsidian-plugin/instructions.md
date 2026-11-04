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
- the snapshot: hidden folders, hidden notes, `.obsidian/` and the root Instructions are left out
- the welcome note: written and renamed to `_welcome.md` when `Welcome.md` exists, not written when it doesn't, left alone when `_welcome.md` exists, and never counted as a missing starter file (SET-16 to SET-18)
- the index and instructions highlight: exactly the right paths match
- missing starter files: which ones count as missing, that existing files are never changed, and that only the files written are committed (SET-15, CFG-20 to CFG-22)
- pull request states: only draft and open ones are checked, a failed check keeps the saved state, and a focus refresh within 30 seconds is skipped (REP-35, REP-37, REP-39)
- Expand: the context it sends (EXP-4, EXP-5), the tools it allows (EXP-6), and that Create note writes an empty note and never commits (EXP-14 to EXP-16)
- the templates for `index.md` and `instructions.md`: placeholders filled, lines of empty fields left out, and the built-in text when a template is missing or empty (REPO-19 to REPO-22)
- the login PATH: used when the shell answers, the fallback when the shell fails or takes over 5 seconds, and the extra folders added after it (CMP-44 to CMP-47)
- ACP agents: model writes denied without a card, other requests reaching a card, the answer read from the last JSON block, and a missing agent command (AGT-10 to AGT-15, AGT-19)
- pull: a fast-forward only when it's safe, waiting revisions, a needed sync, a compile branch left alone, no pull during a compile, each way the pull before a compile can stop it or carry on offline (PULL-1 to PULL-17), the sync status and menu lines (PULL-9, PULL-19 to PULL-21), and saving the remote: added, never replaced, refused (CFG-30 to CFG-32)
- the rule count: what counts as a rule, code blocks and front matter left out, and duplicate IDs (HDR-10, HDR-13)
- comments: the file each note's comments go to (CMNT-9), reading and writing the file with its format kept (CMNT-10, CMNT-11), a broken file never overwritten (CMNT-12), only the comment file committed (CMNT-13), and the file moving with its note (CMNT-15)
- dot folders: left out of the snapshot and the compile diff (INV-13), left out of the vault check (INV-6), and a revision that only changes them never pending
- the change dots: which files get which dot, orange winning over the accent colour, folders at any depth, and no accent-coloured dot for hidden notes, hidden folders and the root Instructions (UI-24 to UI-27)
- the git identity: read from the vault's config before the global one, missing git, a missing name or email, and an older saved author written only into the vault's config (CFG-34 to CFG-37)

**TEST-5.** Tests that need git must use real git repositories in a new temporary folder, and delete it afterwards. They must never touch the vault, the project folder or the engineer's own repositories. Why: a test must never be able to damage real work.

**TEST-6.** Tests must never call Claude Code, GitHub or the network. Calls to `claude` and `gh` are replaced with fakes. ACP tests run a small fake agent made in the test's temporary folder, never a real one. Why: tests must be fast, free and work offline.

**TEST-7.** The `obsidian` module is replaced with a small stub in tests. Views, modals and the file explorer are not tested automatically; a person checks them in Obsidian. Why: mocking Obsidian costs more than it catches.

**TEST-8.** `CLAUDE.md` and `AGENTS.md` must say how to run the tests and how to run a single test.
