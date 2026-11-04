A release is how a new version of the plugin reaches engineers. Why: engineers install theory.md from GitHub releases, through `scripts/install.sh`, BRAT or by hand.

## Version

**REL-1.** A version is three numbers, like `0.2.0`, with no "v" in front. Why: Obsidian and BRAT read the version exactly as written.

**REL-2.** The version goes up in the middle number when a release adds behaviour, and in the last number when it only fixes behaviour.

**REL-3.** An engineer chooses the version and writes it into `manifest.json`, `package.json`, the root package in `package-lock.json` and `versions.json`. They must all say the same version.

**REL-4.** `versions.json` lists every released version with the oldest Obsidian version it runs on. That is the same value as `minAppVersion` in `manifest.json`. Why: Obsidian uses it to offer an older release to an older app.

**REL-5.** Compile never changes the version files. Why: choosing a version is the decision to release, and that decision belongs to a person.

## Publishing

**REL-6.** A release is published by pushing a git tag named exactly the version. Nothing else publishes a release.

**REL-7.** The tag must point at a commit on `main`. Why: a release must hold only work that was merged.

**REL-8.** Publishing stops when the tag doesn't match every version file, or when `versions.json` has no entry for it.

**REL-9.** Publishing runs `npm test` and `npm run build`. When either fails, nothing is published. Why: a broken build must never reach an engineer.

**REL-10.** A release holds exactly four files: `main.js`, `manifest.json`, `styles.css` and `checksums.txt`. `checksums.txt` holds the SHA-256 of the other three. Why: `install.sh` checks a download against it and refuses a damaged or swapped file.

**REL-11.** The release notes list the pull requests merged since the last release.

**REL-12.** A published release is never changed or replaced. A fix gets a new version. Why: an engineer must be able to download the same files for a version again.
