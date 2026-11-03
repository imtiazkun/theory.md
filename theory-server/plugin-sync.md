The HTTP API the plugin calls, besides git. Why: the plugin and the server must agree on one small surface.

## Shape

**API-1.** The API lives under `/api/v1`. Requests and answers are JSON.

**API-2.** Every request needs a token (AUTH-8).

**API-3.** An error answers with a 4xx or 5xx status and `{"error": "<message>"}`. The message is written for the engineer, and the plugin shows it unchanged. Why: the server knows best what went wrong.

**API-4.** A change that breaks the plugin gets a new path, like `/api/v2`. Why: engineers update the plugin at different times.

## Endpoints

**API-5.** These are all the endpoints in version 1:

| Request | Answer |
| --- | --- |
| `GET /api/v1/me` | `{name, email}` of the token's member |
| `GET /api/v1/vaults/{vault}/lock` | `{holder: {name, email}, since}`, or `{holder: null}` |
| `POST /api/v1/vaults/{vault}/lock` | `{lockId, expiresAt}`, or 409 with `{error, holder, since}` (LOCK-1) |
| `POST /api/v1/vaults/{vault}/lock/{lockId}/renew` | `{expiresAt}`, or 410 (LOCK-6) |
| `POST /api/v1/vaults/{vault}/lock/{lockId}/release` with `{marker?, report?}` | `{marker}`, or 410 (LOCK-6) |
| `GET /api/v1/vaults/{vault}/reports?before={reportId}` | `{reports: [...]}`, newest first, 20 at a time (SHR-2) |

`marker` is a full commit hash. `report` is the compile report JSON.
