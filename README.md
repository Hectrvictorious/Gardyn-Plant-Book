# Swan's Island Plant Book

Josh's plant book for his two Gardyn Home v3 towers. It lives at
**https://hectrvictorious.github.io/Gardyn-Plant-Book/** and installs on a phone as its own app
(Share → Add to Home Screen on iPhone).

- **Towers**: both towers drawn as they stand, every yPod a button. *Now* is the Nov 2 maps
  (salad v5, fruiting v9), in place as of Nov 5, plus any steps ticked off; *Next* appears while a
  tower still has steps to come (the bean swap) and shows the tower after them. A *Flavor* view
  recolors the pods by what each plant brings to a salad, with one-word heads-ups (bristly, stringy,
  go easy…). Light zones, facing, headroom and pairs are worked out per pod. The Today strip counts
  care jobs due, steps ready now, and pods due a picking.
- **Plants**: a Gardyn-style page for every plant on the towers, the microgreens, the planned
  plants, the idea list and the retired ones: a tasting note under the name, "Before you eat it",
  a cat check (ASPCA), taste and texture, pairings, your verdict, growing basics, harvest, care,
  origin, your notes, a journal, sources.
- **Salad**: build tonight's bowl from what's growing (flavor balance, texture, heads-ups, a matched
  dressing, what it's missing), save bowls, log a bowl as picked; six house salads, island plates,
  a taste test that records Keep / Retry / Retire, Gardyn's microgreens with a finish-together
  planner, and the cautions.
- **Care**: a catch-up sheet for jobs with no date yet, the rhythm (Tank Top-off, HydroBoost,
  Tank Refresh, root prunes…) with due dates, the gnat and humidifier campaigns, the next steps with
  what each is waiting on, and the fixes.
- **Ideas**: plants to try, gear, open questions, the watch list.
- **DIY**: *Beyond the yCube*: the trail from rockwool to a printed PETG pod, fillings by crop,
  a cost calculator, the pod brief, media compared, models and shops.

Ticks, dates, picks, verdicts, bowls and notes are stored on the phone (Care → Your data makes a
backup to paste back).

**Links into the app**: `#seat-S9R` opens that seat (S salad or F fruiting, row, column), handy for
QR tags on the yPods; `#p-borage` opens a plant page; `#salad`, `#care` and the other tab names open
a tab.

## Editing

The page is built from `src/`:

| File | What's in it |
|---|---|
| `src/data.js` | Everything about the towers: plants, pod seats (`pods`), Caps and seat notes (`holds`), the step list, the care rhythm, fixes, ideas, the DIY trail |
| `src/taste.js` | Flavor, texture, pairings and heads-ups for each plant; the microgreens; house salads, island plates, dressings, taste tests, cautions and the cat check |
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
sources linked on each page; pet safety follows the ASPCA's toxic and non-toxic plant list. Not
affiliated with or endorsed by Gardyn.
