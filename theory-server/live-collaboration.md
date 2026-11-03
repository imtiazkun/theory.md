theory-server doesn't let several engineers edit a note at the same time (SRV-4).

Why: every revision of the model must be one engineer's signed commit, with one intent. When two people type into the same note at once, no single person wrote the result, and the history can't say who did.

Engineers share their work by committing and syncing (see [[obsidian-plugin/Team sync|Team sync]]).
