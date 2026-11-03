The people on a server are its members. Each member has a name, an email and one or more tokens. Why: the server must know who pushes, so it can check who wrote each commit (GIT-4).

## Members

**AUTH-1.** A server has one team in version 1. Every member can read and push every vault on it. Why: one team keeps permissions simple. Roles come later, in [[access-control]].

**AUTH-2.** An admin adds and removes members with commands on the server: `theory-server member add --name "<name>" --email <email>` and `theory-server member remove --email <email>`. There is no web page for this in version 1. Why: a small team doesn't need one. See [[admin-ui]].

**AUTH-3.** A member's email must be unique on the server, ignoring case. It must be the same email the member sets as their author email in the plugin. Why: GIT-4 compares it with each commit's author email.

**AUTH-4.** Removing a member revokes all their tokens at once. Their commits stay in every vault's history.

## Tokens

**AUTH-5.** `theory-server token create --email <email>` creates a token for that member and prints it once. A token is 32 random bytes, written with the prefix `theory_`. Why: the prefix lets secret scanners spot a leaked token.

**AUTH-6.** The server must store only a SHA-256 hash of each token, never the token. Why: a leaked database must not leak working tokens.

**AUTH-7.** `theory-server token revoke --email <email>` revokes every token of that member. Tokens never expire on their own in version 1. Why: revoking covers a lost token, and expiry would make every engineer rotate tokens.

**AUTH-8.** Every git request and every API request must carry a valid token. Git sends it as the password in HTTP Basic auth, and the user name is ignored. The API takes it as `Authorization: Bearer <token>`. A request without a valid token gets status 401 and no content. Why: nobody may read a vault without a member's token.
