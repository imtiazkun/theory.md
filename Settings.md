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

## Permission mode

**CFG-9.** Three options:
- "Edit files, run only allowed commands" (default)
- "Auto: Claude decides what is safe"
- "Run anything (no checks)"

**CFG-10.** Compile runs unattended, so anything not allowed is refused. Why the default: Claude may change code, but runs only the commands the engineer has allowed.

## Allowed commands

**CFG-11.** Claude Code permission rules, separated by spaces. Default: `Bash(git *)`.

**CFG-12.** Writes to the model are always denied, whatever this says. See [[Model protection]].

## Show compile button

**CFG-13.** Shows or hides the floating bar. On by default.
