These are the only settings. They live in the plugin's data, never in the vault.

## Author

**CFG-1.** Full name and email address sign the engineer's revisions. Both are empty by default.

**CFG-2.** An empty value falls back to the git config.

**CFG-3.** An email that doesn't look like `name@domain.tld` shows "This doesn't look like a valid email address."

## Vault

**CFG-4.** A Setup vault button runs [[Setup vault]]. When the vault is already a git repository, it says "Already set up" and is disabled.

## Project folder

**CFG-5.** The project folder is empty by default. Compile can't start without it.

**CFG-6.** Browse… opens the system folder picker.

**CFG-7.** Below the path, the settings list the git repositories found: the folder itself, or its direct subfolders. They warn when there are none. A refresh button looks again. The list is for information only.

## Claude Code command

**CFG-8.** The Claude Code CLI, as a command name or an absolute path. Default: `claude`.

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

**CFG-16.** Always allow on a permission card adds one rule to the end of this list. For a command, the rule is the exact command, like `Bash(npm run build)`, never a wildcard. For any other tool, the rule is the tool's name. A rule already in the list is never added twice. Why: the engineer approved one command, not a family of commands.

## Show compile button

**CFG-13.** Shows or hides the floating bar. On by default.

## Older settings

**CFG-14.** When the project folder is empty and the saved data has `codeRepoPath` from an older version, that path becomes the project folder.

**CFG-15.** Problems that older versions saved as plain text become problems without anchors.

Why: upgrading theory.md must never lose an engineer's settings or reports.
