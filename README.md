# Swan's Island Plant Book

Josh's plant book for his two Gardyn Home v3 towers. It lives at
**https://hectrvictorious.github.io/Gardyn-Plant-Book/** and installs on a phone as its own app
(Share → Add to Home Screen on iPhone).

- **Towers** — both towers drawn as they stand, every yPod a button. *Now* is where plants sat on
  Oct 27 (salad map v4, fruiting map v8) plus any moves ticked off; *Nov 2 plan* is the re-seating
  (salad v5, fruiting v9). Light zones, facing, headroom and pairs are worked out per pod.
- **Plants** — a Gardyn-style page for every plant on the towers, in the dome, on the idea list and
  retired: growing basics, harvest, care, taste and use, origin, your notes, a journal, sources.
- **Care** — the rhythm (Tank Top-off, HydroBoost, Tank Refresh, root prunes…) with due dates, the
  gnat and humidifier campaigns, the move list with what each move is waiting on, and the fixes.
- **Ideas** — plants to try, gear, open questions, the watch list.
- **DIY** — *Beyond the yCube*: the trail from rockwool to a printed PETG pod, fillings by crop,
  a cost calculator, the pod brief, media compared, models and shops.

Ticks, dates and notes are stored on the phone (Care → Your data makes a backup to paste back).

## Editing

The page is built from `src/`:

| File | What's in it |
|---|---|
| `src/data.js` | Everything you'd change: plants, pod seats (`pods`), Caps and notes (`holds`), the move list, the care rhythm, fixes, ideas, the DIY trail |
| `src/app.js` | The app itself |
| `src/style.css` | The look |
| `src/body.html` | The page skeleton |
| `src/sw.js` | The offline/update service worker |

`python3 tools/build.py` writes `site/index.html` and `site/sw.js`; add `--artifact` for a claude.ai
preview copy in `artifact/`. Push to `main` and the workflow builds and publishes; installed phones pick
up the new build the next time the app opens. Bump `version` in `src/data.js` (and set `NEWS` in
`src/app.js`) when there's something worth a one-time "New in the Plant Book" note.

**A new map version** = edit `pods` (each plant's `now` and `plan` seat), `holds` and `moves` in
`src/data.js`. Seats are tower + row + column: `S3L` is salad row 3 left, `F10C` is fruiting row 10 center.

Plant facts paraphrase Gardyn's Plant Book (Help Center plant articles) and the extension and seed
sources linked on each page. Not affiliated with or endorsed by Gardyn.
