#!/usr/bin/env python3
"""Money-leak guard for the PUBLIC VelnoriCo HQ site. Used by tools/hq.py (on every save),
the git pre-commit hook and the GitHub Actions check.  Exit 1 = leak found.

  python3 ci/money_check.py [files...]   (default: status.json index.html characters/*.md)

Rules: no money-looking keys; no currency symbols/amounts in values; sales/orders/downloads
counts only as range strings like "0", "1-5", "6-20", "21-50", "51+".
"""
import json, os, re, sys

BAD_KEY = re.compile(r"(revenue|sale_?amount|sales_?total|profit|payout|royalt|price|usd|eur|gbp|balance|earn|income|amount|cost|fee|margin|money|cash|\$)", re.I)
BAD_VAL = re.compile(r"[$€£¥¢]|\b\d[\d,.]*\s?(k\s?)?(usd|eur|gbp|dollars?|bucks|cents?)\b|\b(usd|eur|gbp)\s?\d", re.I)
RANGE_KEY = re.compile(r"(sales|orders|downloads)", re.I)
RANGE_VAL = re.compile(r"^(0|\d+\s?[-–]\s?\d+|\d+\+)$")

def check_obj(o, path="$", errs=None):
    errs = [] if errs is None else errs
    if isinstance(o, dict):
        for k, v in o.items():
            p = "%s.%s" % (path, k)
            if BAD_KEY.search(k): errs.append("%s: forbidden money key" % p)
            if RANGE_KEY.search(k) and not (isinstance(v, str) and RANGE_VAL.match(v.strip())):
                errs.append("%s: sales-type counts must be a range string like '1-5'" % p)
            check_obj(v, p, errs)
    elif isinstance(o, list):
        for i, v in enumerate(o): check_obj(v, "%s[%d]" % (path, i), errs)
    elif isinstance(o, str):
        m = BAD_VAL.search(o)
        if m: errs.append("%s: money-looking value %r" % (path, m.group(0)))
    return errs

def check_text(name, text):
    # Strip <script>/<style> code tokens that legitimately use $ (none expected, but be strict on prose)
    errs = []
    for n, line in enumerate(text.splitlines(), 1):
        m = BAD_VAL.search(line)
        if m: errs.append("%s:%d: money-looking text %r" % (name, n, m.group(0)))
    return errs

def check_file(f):
    if f.endswith(".json"):
        try: return check_obj(json.load(open(f, encoding="utf-8")), os.path.basename(f))
        except ValueError as e: return ["%s: invalid JSON (%s)" % (f, e)]
    if f.endswith((".html", ".md", ".txt", ".csv")):
        return check_text(f, open(f, encoding="utf-8", errors="replace").read())
    return []

def default_files(root):
    out = [os.path.join(root, x) for x in ("status.json", "index.html", "2d.html", "README.md") if os.path.exists(os.path.join(root, x))]
    cd = os.path.join(root, "characters")
    if os.path.isdir(cd): out += [os.path.join(cd, x) for x in sorted(os.listdir(cd))]
    return out

if __name__ == "__main__":
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    files = sys.argv[1:] or default_files(root)
    errs = []
    for f in files: errs += check_file(f)
    for f in files:
        if os.path.basename(f).lower() in ("money.html", "money.json") or "/private/" in f.replace("\\", "/"):
            errs.append("%s: private money file must never be committed" % f)
    if errs:
        print("MONEY CHECK FAILED (public HQ must never show money):"); print("\n".join("  " + e for e in errs[:50])); sys.exit(1)
    print("money check: OK (%d files)" % len(files))
