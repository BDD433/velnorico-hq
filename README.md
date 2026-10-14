# VelnoriCo HQ · Farm Campus

Public, informational status board for the VelnoriCo bot team: https://bdd433.github.io/velnorico-hq/

- `index.html` renders everything from `status.json` (buildings per line, rooms per instance, pipelines, routines, feed).
- Written only by `hq.py` on the operator's box.
- **No money, ever.** `ci/money_check.py` runs in hq.py on every save, in the git pre-commit hook (`git config core.hooksPath .githooks`) and in GitHub Actions. Sales/order/download counts appear only as ranges.
