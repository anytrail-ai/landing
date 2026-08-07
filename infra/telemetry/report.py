"""Turn raw DynamoDB telemetry into a summary plus a standalone heatmap page.

Usage: report.py <raw.json> <page> <out.html>
"""
import json
import sys
from collections import Counter

raw_path, page, out_path = sys.argv[1], sys.argv[2], sys.argv[3]

with open(raw_path) as fh:
    items = json.load(fh).get("Items", [])


def val(item, key):
    cell = item.get(key)
    if not cell:
        return None
    if "S" in cell:
        return cell["S"]
    if "N" in cell:
        return float(cell["N"])
    return None


events = Counter()
cta = Counter()
depth = Counter()
sessions = set()
clicks = []

for it in items:
    ev = val(it, "event")
    events[ev] += 1
    if s := val(it, "session"):
        sessions.add(s)
    if ev in ("demo_cta_click", "whatsapp_cta_click"):
        cta[f"{ev}:{val(it, 'location') or '?'}"] += 1
    if ev == "scroll_depth":
        depth[int(val(it, "depth") or 0)] += 1
    if ev == "click":
        x, y = val(it, "x"), val(it, "y")
        if x is not None and y is not None:
            clicks.append((round(x, 4), round(y, 4)))

views = events.get("pageview", 0)

print(f"\n=== {page} ===")
print(f"  pageviews        {views}")
print(f"  unique sessions  {len(sessions)}")
print(f"  clicks recorded  {len(clicks)}")

print("\n  CTA clicks by location:")
if cta:
    for k, n in cta.most_common():
        rate = f"{n / views * 100:.1f}%" if views else "n/a"
        print(f"    {k:<34} {n:>5}  ({rate} of views)")
else:
    print("    (none yet)")

print("\n  Scroll depth reach:")
if depth:
    for m in (25, 50, 75, 100):
        n = depth.get(m, 0)
        pct = f"{n / views * 100:.0f}%" if views else "n/a"
        bar = "#" * int((n / views * 30)) if views else ""
        print(f"    {m:>3}%  {n:>5}  {pct:>5}  {bar}")
else:
    print("    (none yet)")
print()

# Self-contained viewer. Drop a full-page screenshot next to this file as
# page.png and it renders underneath the click density layer.
html = """<!doctype html>
<meta charset="utf-8">
<title>Heatmap - __PAGE__</title>
<style>
  body { margin:0; background:#111; color:#eee; font:14px/1.5 system-ui, sans-serif; }
  header { padding:12px 16px; position:sticky; top:0; background:#111; border-bottom:1px solid #333; }
  #wrap { position:relative; width:min(1200px, 100%); margin:0 auto; }
  #shot { width:100%; display:block; }
  #layer { position:absolute; inset:0; width:100%; height:100%; }
  .miss { padding:16px; color:#f88; }
</style>
<header>
  <strong>__PAGE__</strong> &middot; __N__ clicks
  &middot; put a full-page screenshot at <code>page.png</code> to see it underneath
</header>
<div id="wrap">
  <img id="shot" src="page.png" alt="" onerror="this.style.display='none';document.getElementById('miss').style.display='block'">
  <canvas id="layer"></canvas>
</div>
<div id="miss" class="miss" style="display:none">
  No <code>page.png</code> found. The heatmap still renders on a blank canvas.
</div>
<script>
const points = __POINTS__;
const wrap = document.getElementById('wrap');
const shot = document.getElementById('shot');
const cv = document.getElementById('layer');

function draw() {
  const w = wrap.clientWidth;
  const h = shot.complete && shot.naturalHeight
    ? shot.clientHeight
    : Math.round(w * 2.2);
  wrap.style.height = h + 'px';
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  for (const [x, y] of points) {
    const g = ctx.createRadialGradient(x * w, y * h, 0, x * w, y * h, 34);
    g.addColorStop(0, 'rgba(255,64,0,0.55)');
    g.addColorStop(1, 'rgba(255,64,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x * w, y * h, 34, 0, Math.PI * 2);
    ctx.fill();
  }
}
shot.addEventListener('load', draw);
window.addEventListener('resize', draw);
draw();
</script>
"""
html = (
    html.replace("__PAGE__", page)
    .replace("__N__", str(len(clicks)))
    .replace("__POINTS__", json.dumps(clicks))
)
with open(out_path, "w") as fh:
    fh.write(html)
