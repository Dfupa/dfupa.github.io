# dfupa-portfolio

Personal academic and professional portfolio site for **Diego Fuentes Palacios** ([@Dfupa](https://github.com/Dfupa)).

Dark, Matrix-inspired cogitator terminal aesthetic built with plain **HTML / CSS / JavaScript** and **D3.js** — no frameworks, no build step required.

---

## Repository Structure

```
dfupa-portfolio/
├── index.html             ← Single-page site (all sections)
├── styles.css             ← Full design system: dark theme, Roboto Mono, cogitator headings
├── script.js              ← D3.js collaboration network graph logic
├── data/
│   └── publications.json  ← Publication metadata + graph nodes/edges (edit manually)
└── README.md              ← This file
```

---

## Running Locally

No build step needed. Serve the root directory with any static server:

```bash
# Python 3 (simplest)
cd dfupa-portfolio
python -m http.server 8080
# → open http://localhost:8080
```

Or with Node.js `serve`:
```bash
npx serve .
```

> **Important:** You must use a local server (not `file://`) because `script.js`
> uses `fetch()` to load `data/publications.json`. Opening `index.html` directly
> from the filesystem will block that request in most browsers.

---

## Updating Publications

Edit `data/publications.json` directly. The file has two top-level keys:

### `publications` array

Each entry:

```jsonc
{
  "id":        "p7",                          // unique string, must match graph node id
  "title":     "My New Paper",
  "venue":     "Nature Methods",
  "year":      2025,
  "coauthors": ["Diego Fuentes-Palacios", "Collaborator Name"],
  "doi":       "https://doi.org/10.xxxx/...", // optional but recommended
  "url":       "https://..."                  // optional fallback URL
}
```

### `graph` object

Add a node for the paper:
```jsonc
{ "id": "p7", "label": "My New Paper (NatMeth 2025)", "type": "paper" }
```

Add a node for any new co-author (skip if they already exist):
```jsonc
{ "id": "c6", "label": "New Collaborator", "type": "coauthor" }
```

Add edges:
```jsonc
{ "source": "me",  "target": "p7" },
{ "source": "c6",  "target": "p7" }
```

Save the file — the graph reloads automatically on next page load.

---

## Enabling GitHub Pages

### Option A — Deploy from `main` branch root

1. Push all files to the `main` branch of your repo.
2. Go to **Settings → Pages** in the repository.
3. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**.
5. After ~60 seconds, your site will be live at:
   ```
   https://dfupa.github.io/dfupa-portfolio/
   ```
   or if you rename the repo to `dfupa.github.io`, at:
   ```
   https://dfupa.github.io/
   ```

### Option B — Custom domain

1. Add a `CNAME` file to the root with your domain (e.g., `diegofuentespalacios.dev`).
2. Configure DNS: add a CNAME record pointing your subdomain to `dfupa.github.io`.
3. Enable **Enforce HTTPS** in Pages settings once DNS propagates.

### ⚠ Private repo + GitHub Pages

GitHub Pages for private repositories requires a **GitHub Pro, Team, or Enterprise** plan.
If you're on the free plan, either:
- Make the repository **public**, or
- Use [Cloudflare Pages](https://pages.cloudflare.com/) or [Netlify](https://netlify.com/) (both support private repos on free tiers).

---

## Step-by-Step: Repo Setup from Scratch

```bash
# 1. Create the repo on GitHub (private)
#    → github.com/new → name: dfupa-portfolio → Private → Create

# 2. Clone locally
git clone https://github.com/Dfupa/dfupa-portfolio.git
cd dfupa-portfolio

# 3. Copy the generated files here:
#    index.html, styles.css, script.js, data/publications.json, README.md

# 4. Initial commit
git add .
git commit -m "feat: initial portfolio site"
git push origin main

# 5. Enable Pages (see above)
```

---

## Customisation Notes

| Element | Location |
|---|---|
| Section content (bio, experience, projects) | `index.html` — edit text directly |
| Colors / fonts | `styles.css` — see `:root` CSS variables at the top |
| Graph behaviour (forces, colors, radii) | `script.js` — `NODE_COLORS`, `NODE_RADIUS`, simulation params |
| Publication data | `data/publications.json` |
| Contact email | `index.html` — update `mailto:contact@dfupa.dev` |

---

## Tech Stack

- **HTML5** — semantic, accessible markup
- **CSS3** — custom properties, clamp() fluid type, grid, no preprocessor
- **D3.js v7** — force-directed collaboration graph
- **Roboto Mono** — Google Fonts monospace, loaded via CDN
- **No build tools** — open and edit directly, serve instantly

---

*// COGITATOR ONLINE — DATA STREAM ACTIVE*
