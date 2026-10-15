# VelnoriCo HQ · Orbital Station

Public, informational status board for the VelnoriCo bot team: https://bdd433.github.io/velnorico-hq/

- `index.html` is the 3D orbital station (premium sci-fi look: PBR materials, RoomEnvironment reflections, ACES; one hub with a central atrium and glass corridors to a room per area) (three.js r147 vendored in `vendor/`, WebGL2/WebGL1); `2d.html` is the 2D/text fallback. Both render from `status.json` via `panels.js` + `world.js`.
- Written only by `hq.py` on the operator's box.
- **No money, ever.** `ci/money_check.py` runs in hq.py on every save, in the git pre-commit hook (`git config core.hooksPath .githooks`) and in GitHub Actions. Sales/order/download counts appear only as ranges.
