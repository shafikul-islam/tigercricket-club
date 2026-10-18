# Baton Rouge Tigers — Cricket Club Website

A fast, animated, **static** website for the Baton Rouge Tigers cricket club.
Built with plain HTML / CSS / JavaScript — no frameworks, no build step — so it
runs anywhere, including **free GitHub Pages hosting**.

---

## 1. What's in here

```
index.html            The whole page (structure only)
assets/
  css/styles.css      All styling + cricket animations (LSU purple & gold)
  js/data.js          ← YOUR CONTENT lives here. Edit this, nothing else.
  js/main.js          Renders data.js into the page + runs the UI
  img/                Team photos
README.md             This file
```

**Golden rule:** to change players, alumni, results, donate links, text, or
photos, you only edit **`assets/js/data.js`**. It's plain English with comments.

---

## 2. How to edit content (no coding)

Open `assets/js/data.js`. Examples:

- **Add a player** → add a line to the `squad` list:
  ```js
  { name: "New Player", role: "Bowler" },
  ```
- **Add a match result** → add to the `results` list (newest first).
- **Set your real donate links** → fill in `donate.methods` (Zelle / Venmo / GoFundMe).
- **Change the club email / Facebook** → edit the `links` block.
- **Add a photo** → drop the file in `assets/img/`, then add it to `gallery`.

Save the file, refresh the page. Done.

---

## 3. Hosting — my recommendation

**Use GitHub Pages + your own domain.** Here's why, compared to the options you mentioned:

| Option | Cost | Good for you? |
|--------|------|---------------|
| **GitHub Pages** ✅ | **Free** (you already use it for your personal site) | **Best.** You know the workflow, it's fast, free, and this site is built for it. |
| WordPress | ~$5–15/mo hosting + plugins | Overkill. Heavier, slower, recurring cost, more to maintain. |
| Wix | ~$16+/mo | Easy drag-and-drop but locked-in, monthly fee, harder to customize deeply. |

You only pay for the **domain** (~$12/yr). The GoDaddy `tigercricket.club`
you were looking at works great. `.club` is cheap and on-theme; `.com` or
`.org` are more "official" if you prefer — any of them points to GitHub Pages
the same way.

### Deploy steps (one time, ~15 min)

1. **Create a repo** on GitHub, e.g. `baton-rouge-tigers`.
2. **Push these files** to it (the whole folder contents at the repo root):
   ```bash
   git init
   git add .
   git commit -m "Initial Tigers website"
   git branch -M main
   git remote add origin https://github.com/<you>/baton-rouge-tigers.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build from branch → `main` / root → Save.**
   Your site goes live at `https://<you>.github.io/baton-rouge-tigers/`.
4. **Connect your domain:**
   - Add a file named `CNAME` at the repo root containing just your domain
     (e.g. `tigercricket.club`).
   - At your domain registrar (GoDaddy), add DNS records:
     - Four `A` records pointing to GitHub: `185.199.108.153`,
       `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
     - A `CNAME` record for `www` → `<you>.github.io`
   - Back in Settings → Pages, enter the custom domain and tick
     **Enforce HTTPS**. (DNS can take up to an hour.)

To update the site later: edit `data.js`, `git commit`, `git push`. Live in ~30s.

---

## 4. Adding dynamic content (live scores, standings, stats)

GitHub Pages is static, but the site can still pull live data **from the
browser**. Three ways, easiest first:

### A) Google Sheet as your "database" (recommended to start)
Let teammates update scores in a spreadsheet instead of editing code.
1. Make a Google Sheet, **File → Share → Publish to web → CSV**.
2. In `main.js`, fetch that CSV and render it (the `loadLiveScore()` function
   already shows the pattern — swap the data source).
No server, no cost, non-technical teammates can update it.

### B) A cricket data API
Services like **CricAPI**, **Cricket Data API**, or **RapidAPI** cricket feeds
return JSON of live matches. In `assets/js/main.js`, set:
```js
const LIVE_FEED_URL = "https://your-api-endpoint...";
```
The live-score card already fetches it and falls back to your static data if
the call fails. (Note: most of these APIs cover international/pro cricket, not
local LCA matches — great for a "Cricket News / Live Internationals" widget,
but you'll enter LCA results yourself via option A.)

### C) Serverless function (later, if needed)
If you ever need to hide an API key or scrape the LCA site, add a small
**Cloudflare Worker** or **Netlify Function**. Only needed for advanced cases.

---

## 5. Connect the Join form

The form currently opens the visitor's email app (no backend needed). To collect
submissions properly, use a free service:
- **Formspree** (formspree.io): create a form, put its URL in the `<form action>`
  in `index.html`, remove the `preventDefault` in `main.js`.
- Or link a **Google Form** instead of the custom form.

---

## 6. Suggested roadmap

- [x] Starting template with all sections live
- [ ] Fill in real donate links (Zelle/Venmo/GoFundMe)
- [ ] Add player photos (replace initials avatars)
- [ ] Connect Google Sheet for live results/standings
- [ ] Add a "Cricket News / Live Internationals" API widget
- [ ] Register domain + deploy to GitHub Pages
- [ ] Add fixtures/schedule section
- [ ] Add individual player stats (runs, wickets) when you collect them

---

Built as a starting point — designed to grow one section at a time. 🐯
