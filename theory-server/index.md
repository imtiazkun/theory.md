## What this repository is

`theory-server` is the backend that lets a team of engineers hold one theoretical model together. It is one Go program, shipped as a Docker image. It hosts the vaults as git repositories, checks every push against the model's rules, and holds the shared compile lock, marker and reports. Its code is the `theory-server` folder in the project folder.

Why: theory.md is single-user today. A theory held by one person isn't shared, and the team must hold the theory together.

## Its place in the system

- [[obsidian-plugin/index|obsidian-plugin]] is its only client. The plugin pushes and pulls the vault through it, and calls its API to take the compile lock, move the marker and share reports. The plugin's side is in [[obsidian-plugin/Team sync|Team sync]].
- The server holds vaults only. Code repositories stay where they are, and Create PR keeps using `gh`.
- The plugin works without a server. With no server set, it behaves exactly as it does today.

## What it does not do

**SRV-1.** The server must never run Claude and must never compile. Compile runs on the engineer's machine. Why: Claude works in the engineer's project folder, with their tools and their permission cards.

**SRV-2.** The server must never write to a model. It never creates, edits, merges or rebases commits in a vault. The only refs it moves itself are the marker and the refs under `refs/theory/`. Why: only humans write the model.

**SRV-3.** The server must not host code repositories. Why: teams already host code, and Create PR works with GitHub.

**SRV-4.** There is no live co-editing of notes. See [[live-collaboration]].

**SRV-5.** There is no messaging. See [[messaging]].

## Version 1

Version 1 is self-hosted, with one team per server. It is built in this order, and each step must work on its own:

1. Hosting and tokens: [[authentication]] and the vaults in [[git-server]]. Two engineers can share a vault.
2. Push rules in [[git-server]]. Authorship is enforced.
3. The lock and the marker in [[compile-metadata]]. Only one engineer compiles at a time, and everyone sees the same last compile.
4. Shared reports in [[compile-metadata]]. The whole team sees Claude's questions.

## Notes

- [[authentication]] (AUTH): who the members are, and how tokens work.
- [[git-server]] (GIT): hosting vaults, the rules every push must pass, and running the server.
- [[compile-metadata]] (LOCK, SHR): the shared compile lock, the shared marker and shared reports.
- [[plugin-sync]] (API): the HTTP API the plugin calls.
- [[live-collaboration]] and [[messaging]]: what the server won't do, and why.

## Not built yet

%% The notes marked realized: false. %%

- [[access-control]]: roles per vault.
- [[admin-ui]]: a web page for managing members.
- [[commenting]]: comments on notes.
- [[shared-setup]]: one compile setup for the whole team.
- [[teams-and-vaults]]: more than one team per server.
