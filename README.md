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
  pod, and how many plantings each has had); on the Picking view, fruit pods show when the flowers
  you've logged should ripen. The Today strip counts care jobs due, steps ready now and pods due a
  picking (plus fruit that should be ripe), with a tip a day underneath, and a backup reminder
  when one is due.
- **The picking round** (`#pick`): tick each leafy pod as you pick it, say roughly how much came
  off (in 5-oz boxes of salad greens, or ounces off a scale), and count flowers and fruit on the
  fruiting tower. That's the harvest log: from each flower's date it works out when the fruit should
  be ripe (strawberries about 30 days, cherry tomatoes six to eight weeks, jalapeños 45–55, beans
  7–10, cucumbers 8–10; sourced on each plant page), and after three matched pickings it goes by
  your towers' own timing. *Share tonight's picture* draws the bowl, what was picked and what's
  ready as an image to send.
- **Plants**: a Gardyn-style page for every plant on the towers, the microgreens, the planned
  plants, the ideas and the retired ones: a tasting note, "Before you eat it", a cat check (ASPCA: careful, safe, or *not listed* when the ASPCA doesn't rate it either way),
  how it gives (*keeps giving*, *for a while*, *one harvest*, or a microgreen's *quick cut*, and what
  earns a plant that doesn't keep giving its seat),
  taste and texture, pairings, your verdict, growing basics, harvest, care, origin, your notes, a
  journal with photos, a seed box (yCubes or seed pads on hand, packets with source and year,
  flagged when low or getting old) with **Ask Muse to buy seeds**, sources.
- **Salad**: build tonight's bowl from what's growing (flavor balance, texture, heads-ups, a matched
  dressing, what it's missing), save it, share it as a picture, count it; six house salads, island plates, taste
  tests, Gardyn's microgreens with a finish-together planner, and the cautions.
- **Care**: a catch-up sheet for jobs with no date yet, the rhythm with due dates, the campaigns,
  the next steps, a **Plant Doctor** (what you see → what Gardyn says it usually is and what to do),
  and your fixes.
- **Ideas**: the house rule at the top (grow what keeps giving; one-harvest crops are better bought
  unless they earn a seat another way, and which plants on the towers are the exceptions); 43 plants
  to try: Gardyn's catalog, plus 14 from outside it (ice plant, oyster leaf and miner's lettuce, then
  on Nov 7 minutina, Vietnamese coriander, Catalogna chicory, spigarello, Magenta and Rex lettuce, Lemon
  Gem marigold, African blue basil, spilanthes, land cress and the Mascotte bean, each checked against
  Gardyn's help-center plant list, Maine's Do Not Sell list and the ASPCA), with filters (including *Keeps giving*) and a starred shortlist; gear, open
  questions, the watch list; **the seed box** (what's on hand, and a to-buy list from low packets
  and the shortlist, ready to share or to hand to Muse in one request); and the door to the Forbidden Shelf.
- **The Forbidden Shelf** (`#forbidden`): 42 plants on six shelves (controlled plants, legal ones
  with a reputation, the dark side of the plants already on the towers, a poison cabinet with the
  cat in mind, what Maine and the USDA ban, and plants that were once banned), each with the law,
  the Gardyn angle and sources, plus *Legal in Maine?*, a ten-card game that keeps your best score.
  History and law only, never a grow guide. Plant pages link to their shelf entries.
- **Greener**: what the towers cost in power at your rate; **harvest against power**, the month's
  logged harvest priced like the store (USDA national averages for Oct 23, 2026, editable to the
  island's prices) against the month's electricity, with the day the towers paid for their power and
  earlier months; what they use in water, yCube and
  rockwool end of life, then **the printer**: three rules for when a print is actually green, an
  *Off rockwool* card (seats in printed pods, plantings, money, trash and a carbon balance), parts
  worth printing with their payback, a print log with your own numbers, the habits that keep a
  printer green, scrap and spools. Then *Beyond the yCube* (the trail from rockwool to a printed PETG
  pod), seed saving and plants that keep giving.

Everything you log (ticks, dates, picks, the harvest log, flowers, verdicts, stars, bowls, notes,
seeds, Muse requests, printed-pod seats, the print log) is stored on the phone, with photos in its IndexedDB.
**Care → Your data** backs it all up as one file, photos included, through the phone's share sheet
(Drive, Gmail, Files), and restores it from a file, with an undo. A reminder appears on the Towers
tab when there's something new and no backup for a week, and turns firmer after two. The app also
asks Chrome to mark its storage as persistent. Copy-as-text and paste remain under *Other ways*.

**Ask Muse** (Nov 6, 2026): every plant's seed box can ask Muse, Meta's shopping agent, to buy its
seed, and the Ideas seed box can ask for its whole To buy list (up to five plants a request). Seeds
only, since Josh is moving off yCubes to printed pods; the chocolate mint and the Albion strawberries
ask for live plants, because neither comes true from seed (`buy` in `src/data.js`). The request is
written in Josh's voice: the plant and its Latin name, how many, where the last packet came from,
an optional note, and "show me the seller, price and shipping, and wait for my OK."
*Send to Claude* posts it to the phone remote listener on shadowfax (`/api/plantbook/ask`, through
Tailscale, with the phone key), which opens Claude there with the prompt in the Nexus Kit's
`engine\plantbook.json` and presses Enter; Claude passes it to Muse at muse.ai and never approves or
pays, and Muse checks with Josh before it buys. The app polls the request and says when Enter was
pressed (or that the PC is locked, or that Claude wasn't in front). If the phone can't reach the
listener directly, it offers *Send through the Nexus app* (`plantbook.html` on the remote's own
address), and *Share it* sends the same text anywhere. The connection comes from the QR code that
`Connect Plant Book.cmd` in the Nexus Kit shows; it's kept on the phone (`pb:nexus`) and never goes
into a backup file. What was asked, and when, is in `pb:asks`.

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
| `src/harvest.js` | The harvest log's store prices and item weights, flower-to-ripe windows with sources, and how long seed keeps |
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
