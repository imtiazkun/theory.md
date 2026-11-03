The writing rules in [the root Instructions](../Instructions.md) apply here. Rules for Claude that apply only to this repository go below.

## Code

**SDEV-1.** The server uses Go's standard library, plus `modernc.org/sqlite` for the database. Any other dependency needs a rule in the model. Why: every dependency is code nobody on the team has read.

## Tests

**SDEV-2.** Before every commit, Claude must run `go vet ./...` and `go test ./...`, and both must pass. Claude never commits past a failing test.

**SDEV-3.** Every push rule (GIT-4 to GIT-8) and every lock and marker rule (LOCK-1 to LOCK-9) must have a test that would fail without it.

**SDEV-4.** Tests that need git must use real git repositories in a new temporary folder, and delete it afterwards. Tests must never use the network beyond localhost. Why: a test must never be able to damage real work, and tests must work offline.

**SDEV-5.** `AGENTS.md` must say how to run the tests, a single test, and the server on a laptop.
