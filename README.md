# Swan's Island Plant Book

Josh's plant book for his two Gardyn Home v3 towers. It lives at
**https://hectrvictorious.github.io/Gardyn-Plant-Book/** and installs on a phone as its own app.
On Android, install it from Chrome (the in-app Install button, or ⋮ → Install app) so it becomes a
real app with no browser badge; long-press the icon for shortcuts to Salad, the picking round, the
Plant Doctor and Care. On iPhone: Share → Add to Home Screen.

- **Towers**: both towers drawn as they stand, every yPod a button. *Now* is the Nov 2 maps
  (salad v5, fruiting v9), in place as of Nov 5, plus any steps ticked off; *Next* appears while a
  tower still has steps to come (the bean swap). Four views: *Light* (Gardyn's zones), *Flavor*
  (what each plant brings to a salad, one-word heads-ups like bristly or stringy, and your taste-test
  verdicts), *Picking* (days since each leafy pod was picked) and *Pods* (which seats hold a printed
  pod, and how many plantings each has had). The Today strip counts care jobs
  due, steps ready now and pods due a picking, with a tip a day underneath.
- **Plants**: a Gardyn-style page for every plant on the towers, the microgreens, the planned
  plants, the ideas and the retired ones: a tasting note, "Before you eat it", a cat check (ASPCA),
  taste and texture, pairings, your verdict, growing basics, harvest, care, origin, your notes, a
  journal with photos, sources.
- **Salad**: build tonight's bowl from what's growing (flavor balance, texture, heads-ups, a matched
  dressing, what it's missing), save it, share it, count it; six house salads, island plates, taste
  tests, Gardyn's microgreens with a finish-together planner, and the cautions.
- **Care**: a catch-up sheet for jobs with no date yet, the rhythm with due dates, the campaigns,
  the next steps, a **Plant Doctor** (what you see → what Gardyn says it usually is and what to do),
  and your fixes.
- **Ideas**: 32 plants to try, 24 of them researched for this round (Gardyn's catalog plus ice
  plant, oyster leaf and miner's lettuce), with filters and a starred shortlist; gear, open
  questions, the watch list; and the door to the Forbidden Shelf.
- **The Forbidden Shelf** (`#forbidden`): 42 plants on six shelves (controlled plants, legal ones
  with a reputation, the dark side of the plants already on the towers, a poison cabinet with the
  cat in mind, what Maine and the USDA ban, and plants that were once banned), each with the law,
  the Gardyn angle and sources, plus *Legal in Maine?*, a ten-card game that keeps your best score.
  History and law only, never a grow guide. Plant pages link to their shelf entries.
- **Greener**: what the towers cost in power at your rate and what they use in water, yCube and
  rockwool end of life, then **the printer**: three rules for when a print is actually green, an
  *Off rockwool* card (seats in printed pods, plantings, money, trash and a carbon balance), parts
  worth printing with their payback, a print log with your own numbers, the habits that keep a
  printer green, scrap and spools. Then *Beyond the yCube* (the trail from rockwool to a printed PETG
  pod), seed saving and plants that keep giving.

Ticks, dates, picks, verdicts, stars, bowls, notes, printed-pod seats, the print log and the game
score are stored on the phone (Care → Your data makes a backup to paste back). Photos stay in the
phone's storage and aren't in the backup.

**Links into the app**: `#seat-S9R` opens that seat (S salad or F fruiting, row, column); `#p-borage`
opens a plant page; `#pick` the picking round; `#doctor` the Plant Doctor; `#forbidden` the Forbidden
Shelf; `#salad`, `#care` and the other tab names open a tab. **`site/tags.html`** is a printable sheet of QR tags for all 60 seats;
regenerate it with `pip install segno && python3 tools/tags.py`.

## Editing

The page is built from `src/`:

| File | What's in it |
|---|---|
| `src/data.js` | Everything about the towers: plants, pod seats (`pods`), Caps and seat notes (`holds`), the step list, the care rhythm, fixes, ideas, the printed-pod trail |
| `src/taste.js` | Flavor, texture, pairings and heads-ups for each plant; the microgreens; house salads, island plates, dressings, taste tests, cautions and the cat check |
| `src/explore.js` | The plant scout, more cat checks, the Plant Doctor, the Greener figures and the tips |
| `src/forbidden.js` | The Forbidden Shelf: six shelves, 42 plants with law, sources and links to the towers, and the Legal in Maine? cards |
| `src/printer.js` | The printer on the Greener tab: the rules, payback factors, parts worth printing, habits, scrap and spools |
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

**The icon** is Muse's painted open book with herbs and strawberries growing from its pages (Nov 6,
2026): `site/icon-v3-512.png` and `icon-v3-192.png` (rounded, for desktops), `icon-v3-maskable-512.png`
(full bleed, for Android's mask), `apple-touch-icon-v3.png` (made from the full-bleed art so iPhones
don't show black corners), `favicon-v3-32.png`, and the four `shortcut-*-v3-96.png` long-press icons.
The earlier drawn leaf-book icon (v2, SVG sources) is in the git history. Give new art new filenames
so installed apps notice the change.

Plant facts paraphrase Gardyn's Plant Book (Help Center plant articles) and the extension and seed
sources linked on each page; pet safety follows the ASPCA's toxic and non-toxic plant list. Not
affiliated with or endorsed by Gardyn.
