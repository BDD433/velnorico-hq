# VelnoriCo HQ · Command Deck

Public, informational status board for the VelnoriCo bot team: https://bdd433.github.io/velnorico-hq/

- `index.html` is the 3D ship command deck (camera inside: central holo-table, panoramic window onto a ringed planet, one crew bay per area; PBR + RoomEnvironment, and on High an EffectComposer bloom/grade/FXAA pipeline with a Reflector floor). Design refs: REFERENCES.md (three.js r147 vendored in `vendor/`, WebGL2/WebGL1); `2d.html` is the 2D/text fallback. Both render from `status.json` via `panels.js` + `world.js`.
- **Game Studio Dome** (`?b=game`): a glass dome off the deck, reached through a walkable glass hallway (`?b=hall`), home of the Stormhook (Roblox) crew Lolki, Reef and Tide. Holo displays: island map table, boat ladder, fish collection wall, storm sim, build/playtest board. Character models follow `characters/lolki.md`, `reef.md` and `tide.md`; tweak them in `world.js` (`CREWPAL` colours, `CREW.<id>.build`/`anim`).
- **Data-driven bays:** `status.json` → `places` lists each area's state (active/live/paused/hold/waiting/draft/planned), integer counts, titles, niche bars and small local thumbnails (`thumbs/*.jpg`, ≤60 KB each). Paused/on-hold bays show a half-closed shutter and an amber beacon. Refresh with `hq.py scan`. Counts and titles only; no prices or revenue.
- Written only by `hq.py` on the operator's box.
- **No money, ever.** `ci/money_check.py` runs in hq.py on every save, in the git pre-commit hook (`git config core.hooksPath .githooks`) and in GitHub Actions. Sales/order/download counts appear only as ranges.
