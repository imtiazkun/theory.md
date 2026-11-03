The server hosts each vault as a bare git repository. Engineers push and pull it like any git remote. Why: every engineer must push and pull the model through one shared remote (SYNC-1 in [[obsidian-plugin/Team sync|Team sync]]).

## Vaults

**GIT-1.** An admin creates a vault with `theory-server vault create <name>`. The name must use only lowercase letters, digits and hyphens. The plugin never creates vaults. Why: which models exist is the team's decision.

**GIT-2.** A vault's URL is `https://<server>/git/<name>.git`. The vault lives at `/data/vaults/<name>.git`.

**GIT-3.** The server must serve git through git's own `git http-backend`, over smart HTTP. It must never implement the git protocol itself. Why: the protocol is large, and git's own implementation is tested by everyone.

## Push rules

Every push is checked before any ref moves. When one rule fails, the whole push is rejected and nothing changes. The message names the rule and the commit.

**GIT-4.** Every commit new to the server must have the pusher's email as its author email, ignoring case. Otherwise: "Rejected: commit <short hash> is authored by <author email>, but you are <member email>. Push only your own commits." Why: the history must show which person wrote each line, and anyone can type someone else's name into git.

A commit is new when no ref on the server already reaches it. Why: pulling a teammate's commits and pushing on top of them must still work.

**GIT-5.** Only `main` may be pushed. A push to any other branch is rejected: "Rejected: only main can be pushed." Why: the model has one line of history.

**GIT-6.** `main` only moves forward. Force pushes and deleting `main` are rejected: "Rejected: main can't be rewritten. Pull, then push again." Why: the history is the record of who wrote what, and rewriting it erases that.

**GIT-7.** Nobody may push tags or refs under `refs/theory/`. They are rejected: "Rejected: only the server moves tags." Why: a marker moved by hand would skip or repeat revisions. The server moves `theory/compiled` itself (LOCK-7).

**GIT-8.** A push that adds or changes `.obsidian/plugins/theory-md/data.json` is rejected: "Rejected: <commit> contains the plugin's data file, which holds your token. Remove it from the commit." Why: that file holds the member's token.

**GIT-9.** The push rules run in a pre-receive hook. The hook is the server's own program, `theory-server hook pre-receive`. It learns who is pushing from the authenticated request.

## Running the server

**GIT-10.** The server is one Go program, shipped as a Docker image that includes git. All its state lives in one volume mounted at `/data`: the vaults and one SQLite database.

**GIT-11.** The server listens on plain HTTP and must run behind a reverse proxy that serves HTTPS. The repository ships a `compose.yaml` that puts Caddy in front of it. Why: tokens must never travel unencrypted.

**GIT-12.** Copying `/data` while the server is stopped is a full backup.
