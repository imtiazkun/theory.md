The server holds what every engineer must agree on about compiles: who is compiling, the last compiled revision and the compile reports. Why: everyone must see the same last compile (SYNC-2), and only one engineer may compile at a time (SYNC-3).

## Compile lock

**LOCK-1.** Each vault has at most one compile lock. A member takes it before a compile starts. When it is already held, the server answers with who holds it and since when.

**LOCK-2.** Taking the lock returns a lock id. Only that id can renew or release the lock.

**LOCK-3.** The lock is a lease of 5 minutes. The holder renews it every 60 seconds while the compile runs. A lock that isn't renewed for 5 minutes expires. Why: a crashed Obsidian must not block the team, and 5 minutes rides out a short network drop.

**LOCK-4.** When a lock expires, the marker doesn't move. Why: it's the same as Obsidian closing mid-compile (see [[obsidian-plugin/Compile|Compile]]).

**LOCK-5.** An admin can break a lock with `theory-server lock break <vault>`. The marker doesn't move.

**LOCK-6.** Renewing or releasing an expired or broken lock is refused with status 410: "Your compile lock expired. The marker didn't move."

## Shared marker

**LOCK-7.** The server keeps the marker as the tag `theory/compiled` in each vault. Members read it by fetching tags.

**LOCK-8.** The marker moves only when its lock is released, in the same request. The release names the commit to mark, or none. Moving the marker and releasing the lock happen together or not at all. Why: the marker must never move while someone else could be compiling.

**LOCK-9.** The commit to mark must be on `main` of that vault, and it must come after the current marker. Otherwise the release is refused and the lock stays held. Why: the marker only moves forward.

## Shared reports

**SHR-1.** A release may carry the compile report. The server stores the report JSON unchanged. Why: the plugin defines the report (see [[obsidian-plugin/Compile report|Compile report]]), and the server must not need changing when the report grows.

**SHR-2.** The server keeps every report. Members list a vault's reports newest first, 20 at a time.

**SHR-3.** Reports must never be written into the vault repository. Why: anything in the vault becomes part of the model (INV-8).

**SHR-4.** Every member can read every report of every vault on the server (AUTH-1).
