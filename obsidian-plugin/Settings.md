These are the only settings. They live in the plugin's data, never in the vault. Remote (CFG-29) is the one exception: it lives in the vault's git config, because that is where git reads it.

## Author

CFG-1 to CFG-3 are retired. Older versions took a full name and email here.

**CFG-34.** The Author section shows the name and email git signs the vault's commits with: the vault's own git config, else the global one. They are shown as plain text, with no field to edit them. Why: one identity must sign every revision, whether theory.md or git in a terminal makes it.

**CFG-35.** When git isn't installed, or theory.md can't find it, the section says "theory.md needs git, and can't find it. Install git from git-scm.com, then reopen Obsidian." Setup, Commit, Compile and comments can't run without git.

**CFG-36.** When git has no name or no email, the section still shows the one git has, as plain text. For each one missing, it says so and shows the command that sets it, with a copy button: `git config --global user.name "Your Name"` or `git config --global user.email "you@example.com"`. A Check again button reads git again. Why: theory.md must not guess who the engineer is.

**CFG-37.** A name and email saved by an older version are no longer used. When git lacks a name or email and older saved data has them, the section offers "Use {name} <{email}> for this vault". It writes them into the vault's own git config, never the global one. Why: upgrading must never lose an engineer's settings, and theory.md must not change git for other repositories.

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

**CFG-29.** Remote is the first setting in the Pull section. When the vault has an `origin`, it shows the URL as plain text, with no field and no Save button, and says "To change it, run `git remote set-url origin <url>` in the vault." When the vault has no `origin`, it is an empty text field for a URL, like `git@github.com:team/model.git` or `https://github.com/team/model.git`, with a Save button beside it.

**CFG-30.** Save only adds `origin`. It never replaces or removes one. Why: the whole team pulls through the remote, so changing it must be a deliberate step in git, never a settings tweak that could quietly pull someone else's model.

**CFG-31.** After the remote is saved, the notice "Remote saved. Pulling…" appears and a pull runs at once (PULL-11). Save never pushes and never touches the code repositories. Why: the engineer sees at once whether the remote works.

**CFG-32.** Save is refused, and nothing changes, when:
- The field is empty or has spaces: "Enter the remote's URL." Clearing the field never removes the remote. Why: removing the remote by mistake would silently stop every pull.
- The URL has a password or token in it, like `https://ana:token@github.com/…`: "Don't put a password or token in the remote. Git asks your credential helper instead." Why: git config is plain text and gets copied around (SYNC-8).
- Git refuses it: "Couldn't save the remote: {git's message}".

**CFG-33.** When the vault isn't set up, Remote can't be edited, and says "Set up the vault first."

## Show compile button

**CFG-13.** Shows or hides the floating bar. On by default.

## Rule authors

**CFG-38.** A toggle, on by default, shows or hides rule authors (HDR-14). The change applies at once to every open note. Why: some engineers find inline authors noisy while writing.

## Older settings

**CFG-14.** When the project folder is empty and the saved data has `codeRepoPath` from an older version, that path becomes the project folder.

**CFG-15.** Problems that older versions saved as plain text become problems without anchors.

Why: upgrading theory.md must never lose an engineer's settings or reports.
