Compile may run an agent other than Claude Code. Why: the engineer picks the agent that compiles their project best, and theory.md must not depend on one vendor.

## Which agent

**AGT-1.** Compile runs either Claude Code or an agent that speaks the Agent Client Protocol (ACP) over stdio. Examples: Gemini CLI, Codex, and Claude Code through its ACP adapter.

**AGT-2.** Only Compile uses the chosen agent. Expand, commit messages and pull request bodies always use Claude Code. Why: they are one-shot text tasks, and moving them is a separate decision.

**AGT-3.** Claude Code is the default. Why: an upgrade must never change how an existing vault compiles.

**AGT-21.** The plugin must never install or download an agent. The engineer installs it. Why: the plugin must never run code the engineer didn't choose.

## Settings

**AGT-4.** Agent is a dropdown in [[Settings]]: "Claude Code" (default) and "ACP agent".

**AGT-5.** With "ACP agent" chosen, an Agent command field appears. It holds the command that starts the agent, with its arguments, like `gemini --experimental-acp`. It is empty by default. Compile can't start while it is empty: "Compile failed: Set the agent command in theory.md settings first." The marker doesn't move.

**AGT-6.** With "ACP agent" chosen, Model and Effort (CFG-17, CFG-18) are replaced by two text fields: "Agent model" and "Agent thinking level". Both are empty by default. Empty means the agent's default. Why: ACP agents name their own models, and the plugin can't know the list without starting the agent.

**AGT-23.** At compile, each field is matched against the choices the agent offers, by value or by name. The activity log names the choice picked, or says the agent had no match and uses its default.

**AGT-24.** The agent fields are stored apart from Claude Code's model and effort. Why: switching agents must never lose either.

**AGT-25.** Settings must never start the agent, not even to read its model list. Why: opening settings must not start programs, ask for a sign-in or cost anything.

**AGT-7.** Permission mode and Allowed commands (CFG-9 to CFG-11) apply to Claude Code only. An ACP agent decides by itself what to ask about.

**AGT-26.** With "ACP agent" chosen, Permission mode and Allowed commands are hidden. Why: they don't change an ACP compile, and a setting that does nothing misleads.

**AGT-27.** With "ACP agent" chosen, the Claude Code command (CFG-8) stays, and its description says "Used for Expand, commit messages and pull request bodies." Why: those still run Claude Code (AGT-2).

**AGT-28.** The Compile section of the settings names the chosen agent: Claude Code, or the ACP agent. It never says Claude Code while an ACP agent is chosen.

## What the agent receives

**AGT-8.** An ACP agent gets the same prompt as Claude Code (CMP-10 to CMP-12). Its working folder is the project folder. The snapshot is added as an extra folder.

**AGT-9.** ACP has no fixed answer shape. The prompt must end with the shape of CMP-15 as a JSON Schema. It must ask for the answer as one JSON block at the end of the agent's last message.

**AGT-10.** The plugin reads the last JSON block in the agent's messages. When there is none, or it lacks status, summary, changes, questions or problems, the compile has no structured answer and fails (CMP-17).

## Permission requests

**AGT-11.** Every permission request from an ACP agent becomes a card. CMP-27 to CMP-35 apply: same buttons, same 120 seconds, denials named in problems.

**AGT-12.** A request to edit, delete or move a file in the vault or the snapshot is denied before any card is shown. It is named in problems. Why: same as CMP-32.

**AGT-13.** Each button is sent as the agent's matching option. Allow is "allow once". Always allow is "allow always", else "allow once". Deny is "reject once", else "reject always".

**AGT-14.** Always allow on an ACP card lasts for this compile only. It never changes Allowed commands. Why: Allowed commands holds Claude Code rules, and ACP agents share no rule format.

## File access

**AGT-15.** The plugin offers the agent file reading and writing through ACP. It must refuse every write outside the project folder, and every write to the vault or the snapshot. Each refused write is named in problems.

**AGT-16.** The plugin doesn't offer the agent a terminal. The agent runs commands itself, and asks first when it wants to.

## Model protection

**AGT-17.** An ACP agent has no deny rules like INV-4. Its own shell can write anywhere the engineer can. The snapshot check (INV-5) and the vault check (INV-6) are therefore the protection that holds for every agent. When they run is INV-12 in [[Model protection]].

## Running and stopping

**AGT-18.** Cancel sends ACP's cancel to the agent and answers every open request as cancelled. When the agent hasn't stopped 5 seconds later, the plugin stops it.

**AGT-19.** When the agent command isn't found, the report fails with "Couldn't find the agent ("{command}"). Set its command in theory.md settings." The marker doesn't move. Why: same as CMP-19.

**AGT-20.** The report has no token count for an ACP agent. Why: ACP reports how full the context is, not the tokens used.

**AGT-22.** For an ACP agent, the report says "The agent couldn't be started." instead of CMP-19's text. Without a structured answer, it says "The agent gave no structured answer. It stopped because: {reason}." followed by the end of the agent's error output. It never shows the exit code. Why: the plugin stops the agent itself, so the code means nothing.
