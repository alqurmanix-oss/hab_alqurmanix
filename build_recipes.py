#!/usr/bin/env python3
"""يقرأ فيد بلوجر ويطلع recipes-data.json (مكتبات بايثون القياسية فقط)."""
import json, re, html, urllib.request, urllib.parse

BLOG = "https://aqxfood.blogspot.com"
FEED = BLOG + "/feeds/posts/default?alt=json&max-results=500"

def text_of(h):
    h = re.sub(r"(?i)<br\s*/?>|</(div|p|li|h[1-6]|tr|span)>", "\n", h)
    h = html.unescape(re.sub(r"<[^>]+>", "", h))
    return re.sub(r"[ \t\u00a0]+", " ", h)

def first_int(pat, t):
    m = re.search(pat, t)
    return int(m.group(1)) if m else None

def minutes(t):
    m = re.search(r"وقت (?:الطهي|التحضير)\s*[:：]?\s*\n?\s*([^\n]{0,40})", t)
    if not m: return None
    s = m.group(1)
    n = re.search(r"\d+", s)
    if "ساعة" in s or "ساعات" in s:
        h = int(n.group()) if n else 1
        return h * 60 + (30 if "نصف" in s else 0)
    return int(n.group()) if n else None

def ingredients(t):
    m = re.search(r"المكونات(.*?)(?:طريقة التحضير|الخطوة الأولى)", t, re.S)
    if not m: return []
    out = []
    for ln in m.group(1).split("\n"):
        ln = ln.strip()
        if len(ln) > 2 and not ln.startswith(("لتحضير", "🥩 المكونات", "🧂", "🥣")) and re.search(r"\d|حسب", ln):
            out.append(ln)
    return out[:40]

def main():
    req = urllib.request.Request(FEED, headers={"User-Agent": "aqx-hub-builder"})
    feed = json.load(urllib.request.urlopen(req, timeout=60))
    items = []
    for e in feed["feed"].get("entry", []):
        raw = e.get("content", {}).get("$t", "")
        t = text_of(raw)
        mins = minutes(t)
        ing = ingredients(t)
        if mins is None and not ing:        # مش وصفة (مقال أو صفحة)
            continue
        url = next(l["href"] for l in e["link"] if l["rel"] == "alternate")
        img = ""
        if "media$thumbnail" in e:
            img = re.sub(r"/s\d+(-c)?/", "/s640/", e["media$thumbnail"]["url"])
        else:
            m = re.search(r'<img[^>]+src="([^"]+)"', raw)
            img = m.group(1) if m else ""
        diff = re.search(r"مستوى الصعوبة\s*[:：]?\s*\n?\s*([^\n]+)", t)
        items.append({
            "title": e["title"]["$t"],
            "url": url,
            "image": img,
            "date": e["published"]["$t"][:10],
            "categories": [c["term"] for c in e.get("category", [])],
            "minutes": mins,
            "servings": first_int(r"(?:الكمية تكفي|تكفي)\s*[:：]?\s*\n?\s*(\d+)", t),
            "difficulty": diff.group(1).split()[0] if diff else None,
            "kcal": first_int(r"السعرات(?: الحرارية)?\s*[:：]?\s*\n?\s*(\d{2,4})", t),
            "ingredients": ing,
        })
    items.sort(key=lambda x: x["date"], reverse=True)
    with open("recipes-data.json", "w", encoding="utf-8") as f:
        json.dump({"updated": __import__("datetime").datetime.utcnow().isoformat() + "Z",
                   "count": len(items), "recipes": items}, f, ensure_ascii=False, indent=1)
    miss = [i["title"] for i in items if i["minutes"] is None or i["servings"] is None or i["kcal"] is None]
    print(f"{len(items)} وصفة | ناقصة بيانات: {len(miss)}")
    for m in miss: print(" -", m)

if __name__ == "__main__":
    main()
