The plugin keeps the vault and the code up to date with their git remotes by itself. Why: an engineer must never write theory on top of an old model, and a compile must never build on old code.

## What a pull may do

**PULL-1.** A pull fetches, then fast-forwards. It never merges, never rebases, never commits and never pushes. Why: an automatic step must never lose work or rewrite history.

**PULL-2.** A pull never changes a file that has uncommitted changes. Why: unfinished work belongs to the engineer.

**PULL-3.** A pull never waits for a password or passphrase. Git runs with its prompts turned off. When git needs credentials, the pull fails with git's message. Why: a hidden prompt would hang Obsidian.

**PULL-4.** No pull runs while a compile runs. A pull that falls due during a compile waits until the compile ends. Why: the vault check (INV-6) would report pulled notes as changed by the compile.

## When the vault pulls

**PULL-5.** The vault pulls `main` from its `origin` when Obsidian opens, when the Obsidian window gets focus, and on the timer set in [[Settings]] (CFG-26). A focus pull is skipped when the last pull was under 30 seconds ago. Why: switching windows often must not fetch every time.

**PULL-6.** A vault without an `origin` never pulls. The sync status (PULL-9) says "No remote". Why: one engineer on their own must not need a remote, but must see that the vault isn't shared, and where to add one (CFG-29).

## What a vault pull does

**PULL-7.** After the fetch, the vault pull ends in exactly one of these:
- Nothing new on the remote: nothing changes.
- Only the remote has new commits, and none of them touch a file with uncommitted changes: `main` fast-forwards to the remote. Obsidian shows the new note text from disk.
- Only the remote has new commits, and some touch a file with uncommitted changes: nothing changes. Those revisions are waiting.
- Both the vault and the remote have new commits: nothing changes. A sync is needed.
- The fetch fails: nothing changes.

**PULL-8.** After a fast-forward, a notice names who wrote the pulled revisions and which notes changed: "Pulled 3 revisions by Ana Lee. Changed: Compile, Agents." The engineer's own revisions are left out of the names. Why: the engineer must know the model changed under them.

## Sync status

**PULL-9.** The floating bar (UI-2) shows the sync status to the left of the commit button. It has these states:
- "No remote" when the vault has no `origin`.
- "Not pulled yet" before the first pull since Obsidian opened, for example when automatic pulls are off.
- "Pulling…" while a pull runs.
- "Synced {time} ago" when the vault has every revision on the remote. When the vault also has revisions the remote doesn't, it adds " · {n} not pushed".
- "{n} waiting" when PULL-7 held revisions back. Its tooltip names the files with uncommitted changes.
- "Sync needed" when both sides have new commits. Its tooltip: "Your revisions and the remote's both moved. Pull with rebase in git, then pull again."
- "Offline, {time} ago" when the last fetch failed. The time is the last pull that worked. Its tooltip gives git's message.

**PULL-10.** The sync status never says "Up to date". Why: the compile button already uses those words for "nothing to compile".

**PULL-11.** The command "Pull now", and Pull now in the sync menu (PULL-19), pull at once. Pull now works even when automatic pulls are off.

When [[Team sync]] is built, the sync menu will offer Sync when a sync is needed (SYNC-9).

## Sync menu

**PULL-19.** Clicking the sync status opens the sync menu. From top to bottom:
- When the remote was last checked: "Checked the remote 2 min ago". Before any fetch has worked: "Not checked yet".
- The last pull that brought revisions: "Last pulled 3 revisions 1 h ago". When none has: "Nothing pulled since Obsidian opened".
- Pull now.
- Pull settings…, which opens the settings.

The first two lines are information and can't be clicked. Why: the engineer must see how fresh the vault is without guessing from one label.

**PULL-20.** With no remote, the menu says "This vault has no remote." and offers "Add a remote…", which opens the settings at Remote (CFG-29). It offers no Pull now. Code repositories still pull on the timer (PULL-12).

**PULL-21.** While a pull runs, Pull now says "Pulling…" and can't be clicked.

**PULL-22.** The times in the menu are kept only while Obsidian runs. They are never stored. Why: state lives only in git, front matter and plugin data, and these times are worth nothing after a restart.

## Code repositories

**PULL-12.** When "Also pull code repositories" is on (CFG-27), each pull also fetches every repository in the project folder that has an upstream. This doesn't need the vault to have an `origin`.

**PULL-13.** A repository fast-forwards only when all of these hold: its checked-out branch is not a compile branch, it has no uncommitted changes, and its branch is behind its upstream with nothing of its own. Otherwise only the fetch happens. Why: compile branches belong to their pull requests, and unfinished work belongs to the engineer.

**PULL-14.** Code pulls never show a notice. The Repositories page shows each repository's ahead and behind counts (REPO-10).

## Before a compile

**PULL-15.** Compile pulls the vault and the code repositories before the checks in CMP-4, as PULL-7 and PULL-13 say. This happens even when automatic pulls are off. Why: a compile must build the newest model into the newest code.

**PULL-16.** The compile doesn't start, and the marker doesn't move, when the pull before it ends in one of these:
- A sync is needed: "Compile failed: The vault and its remote both have new commits. Pull with rebase in git, then compile again."
- Revisions are waiting: "Compile failed: New revisions on the remote change notes you haven't committed: {files}. Commit or discard them, then compile again."
- A repository that isn't on a compile branch is behind and can't fast-forward: "Compile failed: Pull these repositories first: {repos}." A compile branch's base is checked by CMP-50 to CMP-52.

Why: compiling a model the team has moved on from makes code nobody asked for.

**PULL-17.** When a fetch fails before a compile, the compile carries on with what is local. The notice says: "Couldn't reach the remote, so this compile uses the local vault and code." Why: an engineer must be able to compile offline.

## Never

**PULL-18.** Pulling never pushes, commits, merges, rebases, stashes or switches branches, in the vault or in any repository. It never moves the last compile marker.
