# dfupa.github.io

Personal academic and professional portfolio site for **Diego Fuentes Palacios** ([@Dfupa](https://github.com/Dfupa)).

---

## Repository Structure

```
dfupa.github.io/
├── index.html             ← Single-page site (all sections)
├── styles.css             ← Full design system
├── script.js              ← D3.js collaboration network graph logic
├── assets/
│   └── default.png        ← Default image
├── data/
│   └── publications.json  ← Publication metadata + graph nodes/edges (to edit manually)
└── README.md              ← This file
```

---

## Running Locally

No build step needed. Serve the root directory with any static server:

```bash
# After cloning the repo
cd dfupa.github.io/
python -m http.server 8080
# Then → open http://localhost:8080
```

Or with Node.js `serve`:
```bash
cd dfupa.github.io/
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
  "venue":     "Nature Communications",
  "year":      2027,
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

Add a node for any new co-author (skip if they already exist!):
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
