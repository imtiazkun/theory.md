These are the only settings. They live in the plugin's data, never in the vault. Remote (CFG-29) is the one exception: it lives in the vault's git config, because that is where git reads it.

## Author

**CFG-1.** Full name and email address sign the engineer's revisions. Both are empty by default.

**CFG-2.** An empty value falls back to the git config.

**CFG-3.** An email that doesn't look like `name@domain.tld` shows "This doesn't look like a valid email address."

## Vault

**CFG-4.** A Setup vault button runs [[Setup vault]]. When the vault is already a git repository and no starter file is missing (SET-15), it says "Already set up" and is disabled.

**CFG-20.** When the vault is already a git repository but starter files are missing, the button says "Create missing files". Below it, the settings list each missing file by its path, and each missing `.gitignore` line. Why: a vault set up by an older version, or one where a starter file was deleted, must be able to catch up without setting up again.

**CFG-21.** Create missing files writes only the missing files, with the same starter text Setup writes, and adds only the missing `.gitignore` lines. It never changes a file that exists. Why: those files belong to the engineer now.

**CFG-22.** Create missing files then commits only the files it wrote or changed, as "Add missing starter files", signed by the author. Other uncommitted changes in the vault stay uncommitted. Why: one intent per commit. It needs an author first, like Setup (SET-3).

**CFG-23.** After it runs, the notice "Added {n} missing files." appears and the button says "Already set up" again. Any failure shows "Couldn't add the missing files: {reason}", and nothing is committed.

**CFG-24.** The settings check for missing files each time the settings tab opens, and again after the button runs. Nothing is stored.

## Project folder

**CFG-5.** The project folder is empty by default. Compile can't start without it.

**CFG-6.** Browse… opens the system folder picker.

**CFG-7.** Below the path, the settings list the git repositories found: the folder itself, or its direct subfolders. They warn when there are none. A refresh button looks again. The list is for information only.

## Claude Code command

**CFG-8.** The Claude Code CLI, as a command name or an absolute path. Default: `claude`. Used when Agent is "Claude Code" (AGT-4), and always for Expand, commit messages and pull request bodies (AGT-2).

## Compile model and effort

**CFG-17.** Model is a dropdown: "Claude Code default", "Fable", "Opus", "Sonnet" and "Haiku". The default is "Claude Code default". Compile passes the choice to Claude Code as `--model fable`, `opus`, `sonnet` or `haiku`. "Claude Code default" passes nothing, and Claude Code decides. Why aliases: an alias always means the latest model of that kind, so the setting never goes stale.

**CFG-18.** Effort is a dropdown: "Claude Code default", "Low", "Medium", "High", "Extra high" and "Max". The default is "Claude Code default". Compile passes the choice to Claude Code as `--effort low`, `medium`, `high`, `xhigh` or `max`. "Claude Code default" passes nothing.

**CFG-19.** A change to model or effort applies from the next compile. A running compile keeps the model and effort it started with.

Why: the engineer decides how much thinking turning the theory into code deserves, and the compile must not change model because Claude Code's own default changed.

## Permission mode

**CFG-9.** Three options:
- "Edit files, run only allowed commands" (default)
- "Auto: Claude decides what is safe"
- "Run anything (no checks)"

**CFG-10.** Anything this mode and Allowed commands don't allow becomes a permission request for the engineer (see [[Compile]]). Why the default: Claude may change code, but runs only the commands the engineer has allowed.

## Allowed commands

**CFG-11.** Claude Code permission rules, separated by spaces. Default: `Bash(git *)`.

**CFG-12.** Writes to the model are always denied, whatever this says. See [[Model protection]].

**CFG-16.** Always allow on a permission card adds the request's rules to the end of this list. A rule already in the list is never added twice.
- For a command, the rules are every rule Claude Code suggests with the request, like `Bash(npm run:*)`. A compound command like `cd app && npm test` may get one rule per part, and all of them are added. A rule may cover a family of commands. When Claude Code suggests none, the rule is the exact command, like `Bash(npm run build)`. Why: one click must cover the whole request, so the same command never asks twice.
- For a file tool (Edit, Write, NotebookEdit), the rule is that tool on that exact file, like `Edit(//Users/imtiaz/.zshrc)`. It must never be the bare tool name, and never Claude Code's suggestion. Why: a file outside the project folder is the engineer's, and one approval must open one file only.
- For any other tool, the rule is Claude Code's suggestion, else the tool's name.

The card must show every rule before the engineer clicks Always allow. Why: the engineer must see how much one click allows.

## Pull

**CFG-25.** Pull automatically is on by default. Off stops the pulls on launch, on focus and on the timer (PULL-5). Pull now and the pull before a compile still run (PULL-11, PULL-15).

**CFG-26.** Check every is a dropdown: 1, 5, 15 or 30 minutes. The default is 5 minutes.

**CFG-27.** Also pull code repositories is on by default (PULL-12).

**CFG-28.** When the vault has no `origin`, the section says "This vault has no remote, so its notes are never pulled. Add one below." Why: the engineer must know why nothing pulls, and how to fix it.

**CFG-29.** Remote is the first setting in the Pull section. It is a text field with the URL of the vault's `origin`, like `git@github.com:team/model.git` or `https://github.com/team/model.git`, and a Save button beside it. The field shows the current URL, or is empty when there is no `origin`.

**CFG-30.** Save adds `origin` when the vault has none. When the vault already has a different `origin`, Save first asks "Replace the remote {old URL} with {new URL}? Pulls will come from the new remote." and changes nothing without a yes. Why: replacing a shared vault's remote by mistake would quietly pull someone else's model.

**CFG-31.** After the remote is saved, the notice "Remote saved. Pulling…" appears and a pull runs at once (PULL-11). Save never pushes and never touches the code repositories. Why: the engineer sees at once whether the remote works.

**CFG-32.** Save is refused, and nothing changes, when:
- The field is empty or has spaces: "Enter the remote's URL." Clearing the field never removes the remote. Why: removing the remote by mistake would silently stop every pull.
- The URL has a password or token in it, like `https://ana:token@github.com/…`: "Don't put a password or token in the remote. Git asks your credential helper instead." Why: git config is plain text and gets copied around (SYNC-8).
- Git refuses it: "Couldn't save the remote: {git's message}".

**CFG-33.** When the vault isn't set up, Remote can't be edited, and says "Set up the vault first."

## Show compile button

**CFG-13.** Shows or hides the floating bar. On by default.

## Older settings

**CFG-14.** When the project folder is empty and the saved data has `codeRepoPath` from an older version, that path becomes the project folder.

**CFG-15.** Problems that older versions saved as plain text become problems without anchors.

Why: upgrading theory.md must never lose an engineer's settings or reports.
