/* Swan's Island Plant Book: the data.
   Plants (the book), the two towers (Oct 27 "now" seats and the Nov 2 plan), the moves between them,
   the care rhythm, the fixes, the ideas and the DIY trail. Plant facts paraphrase Gardyn's Plant Book
   (Help Center plant articles); seats and notes come from Josh's maps v4/v5 (salad) and v8/v9 (fruiting).
   Slot codes: tower letter + row + column, e.g. S3L = salad tower, row 3, left; F10C = fruiting, row 10, center. */
window.PB = {
version: '2026.11.06c',

/* ---------- The book ---------- */
groups: { greens: 'Leafy green', herbs: 'Herb', flowers: 'Edible flower', fruit: 'Fruiting plant' },

plants: {

'perpetual-spinach': { name: 'Perpetual Spinach', latin: 'Beta vulgaris', group: 'greens', glyph: 'leaf', tint: 'leaf', status: 'tower', tags: ['giant', 'staple'],
  gb: { sprout: '7–10', mature: '40–50', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–70°F' },
  about: `A chard-family heirloom that tastes like true spinach. The leaves are flatter and more pointed than chard, the stems slimmer, and it keeps producing for months. It takes warmth better than ordinary spinach. Good for vitamins K, A and C and folate.`,
  taste: `Young leaves raw in salads and sandwiches. Older leaves for sautés, soups and stews, anywhere you would use spinach.`,
  origin: `Same family as chard and beets. An heirloom that most likely came from England.`,
  harvest: [`Snip outer leaves just above the base once they are 2–3 inches tall. Never take more than a third of the plant.`, `One-time harvest: wait for maturity and cut the whole plant at the base.`],
  care: [`Monthly root check: trim anything brown or reaching past the yPod.`, `Snip yellow or brown leaves as they show up.`],
  yours: [`The salad tower's staple: four plants. Never pull two at once.`, `Since the Nov 2 re-seating, two sit in the bright seats at row 3 (with Caps above them in row 1), one at row 2 center, and one at row 6 left.`, `Rolling restart: when the oldest one's leaves shrink or it bolts, start its successor in the dome about four weeks ahead. Sow duplicates ½ inch deep; it's a beet-family seed cluster, so keep the strongest sprout.`],
  src: [['Gardyn Help: Perpetual Spinach', 'https://help.mygardyn.com/en/articles/1797377']] },

'pink-celery': { name: 'Pink Celery', latin: 'Apium graveolens', group: 'greens', glyph: 'celery', tint: 'pink', status: 'tower', tags: ['fav', 'giant'],
  gb: { sprout: '12–20', mature: '75–100', zone: 'medium', size: '1 ft', care: 'Intermediate', thin: '1 per yCube', temp: '70–75°F' },
  about: `A small Chinese celery with slender pink-to-fuchsia stalks and frilly leaves. Slow to get going, then a heavy producer. Strong and herbal raw; sweet, tender and crisp once cooked. Rarely grown commercially now.`,
  taste: `Mostly a cooking celery: stir-fries, braises, soups. Raw stalks are strong, so slice them thin into salads or grain bowls, or pickle them.`,
  origin: `Northern China, from wild celery. It traveled the trade routes to Europe and had a brief fashion in the 1800s.`,
  harvest: [`Cut stalks at the base once they are 6 inches or taller; the longer you wait, the thicker they get.`, `Take the big outer stalks and leave about a third of the plant. Leaves can be picked earlier.`, `Gardyn's yCube page puts the first stalks around 60 days, with harvests for about seven months.`],
  care: [`Early growth is slow. Gardyn says Plant Food can start as early as 10 days after it sprouts.`, `Monthly root check.`],
  yours: [`Your pair: A and B. The new ones replace the old pair (ordered in September).`, `Both sit in row 2, where the light is medium. A came down out of dim row 1 in the Nov 2 re-seating and shares the row with B and a spinach.`, `Surface-sow duplicate seed; celery needs light to germinate. Start B about two weeks behind A.`],
  src: [['Gardyn Help: Pink Celery', 'https://help.mygardyn.com/en/articles/1797441'], ['Gardyn yCube page: Pink Celery', 'https://mygardyn.com/plant-book/pink-celery/']] },

'red-tatsoi': { name: 'Red Tatsoi', latin: 'Brassica narinosa', group: 'greens', glyph: 'spoon', tint: 'beet', status: 'tower', tags: ['fav'],
  gb: { sprout: '5–12', mature: '45–55', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube' },
  about: `A red descendant of green tatsoi: glossy, spoon-shaped burgundy leaves on bright green stems, laid out in a flat rosette. Mild and peppery raw, spinach-like when cooked. Vitamins A, C and K, folate and calcium.`,
  taste: `Raw in salads, or stirred into stir-fries and soups at the very end, like spinach.`,
  origin: `Bred from Chinese green tatsoi. Its exact origin is unknown; France and other parts of Europe keep many cultivars.`,
  harvest: [`Snip outer leaves at 2–3 inches, just above the base, and leave a third.`, `Or wait for maturity and cut the whole rosette.`],
  care: [`Needs almost no pruning. Outer leaves yellow if you don't pick them.`, `Strong roots: check them monthly.`, `Cut flower stems the moment they appear to hold off bolting.`],
  yours: [`Your pair: B at row 5 center and A at row 6 right since the Nov 2 re-seating. That's a diagonal, so the two grow apart instead of into each other.`],
  src: [['Gardyn Help: Red Tatsoi', 'https://help.mygardyn.com/en/articles/1798273']] },

'green-tatsoi': { name: 'Green Tatsoi', latin: 'Brassica rapa var. narinosa', group: 'greens', glyph: 'spoon', tint: 'leaf', status: 'tower', tags: [],
  gb: { sprout: '5–21', mature: '21–45', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–70°F' },
  about: `Glossy dark green spoon leaves with an earthy-sweet, mustardy flavor; stems and leaves are both good. Also called spinach mustard or rosette bok choy. High in vitamins A and C, fiber, calcium and folate.`,
  taste: `Fresh or barely cooked. Wilt it, don't stew it. Good with citrus and sweet flavors.`,
  origin: `China, where it has been grown since about 500 A.D.`,
  harvest: [`Snip outer leaves at 2–3 inches and leave a third.`, `Or cut the whole head at maturity.`],
  care: [`Heat turns it bitter and pushes it to bolt.`, `Monthly root check.`],
  yours: [`Your pair shares row 4 (center and right), both bright seats. It stays put in the Nov 2 plan.`],
  src: [['Gardyn Help: Green Tatsoi', 'https://help.mygardyn.com/en/articles/1796865']] },

'bulls-blood': { name: `Bull's Blood Beets`, latin: 'Beta vulgaris', group: 'greens', glyph: 'beet', tint: 'beet', status: 'tower', tags: [],
  gb: { sprout: '5–10', mature: '35', zone: 'medium', size: '1 ft', care: 'Beginner', thin: '1 per yCube' },
  about: `A deep red-purple beet grown for its leaves. The greens are earthy-sweet and get stronger when cooked. Rich in vitamin K, iron, calcium and manganese.`,
  taste: `Young leaves raw for color in a salad; bigger leaves cooked like chard. The small root is edible too.`,
  origin: `First bred in the Netherlands in 1840, from Crapaudine, the oldest known beet.`,
  harvest: [`Snip outer leaves at 4 inches and leave a third.`, `One-time harvest: cut all the leaves and the little root together.`],
  care: [`Monthly root check.`],
  yours: [`A back-burner pick from the September map that made it aboard; baby leaves from about 35 days.`, `Your pair shares row 8: A at center, and B at right since it came up out of dim row 10 on Nov 2.`],
  src: [[`Gardyn Help: Bull's Blood Beets`, 'https://help.mygardyn.com/en/articles/1796225']] },

'buttercrunch': { name: 'Buttercrunch', latin: 'Lactuca sativa', group: 'greens', glyph: 'head', tint: 'leaf', status: 'tower', tags: ['fav'],
  gb: { sprout: '7–21', mature: '45', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–70°F' },
  about: `Soft, cupped leaves with a bright flavor and a little crunch at the rib. Like all lettuce, high in vitamin A and potassium.`,
  taste: `A salad base, and a good sandwich or wrap leaf.`,
  origin: `Lettuce began in the Middle East. Egyptian art shows it around 2700 BC, already bred to be less bitter than wild lettuce.`,
  harvest: [`Snip outer leaves just above the base once they reach 4 inches; leave a third.`, `Or wait for the head to mature and cut it at the base.`],
  care: [`Warmth makes it bitter and bolty.`, `Monthly root check.`],
  yours: [`At row 5 left, a bright seat, since the Nov 2 re-seating (up from row 9).`],
  src: [['Gardyn Help: Buttercrunch', 'https://help.mygardyn.com/en/articles/1796417']] },

'butterhead': { name: 'Butterhead', latin: 'Lactuca sativa', group: 'greens', glyph: 'head', tint: 'lime', status: 'tower', tags: ['fav'],
  gb: { sprout: '7–21', mature: '45', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–70°F' },
  about: `Soft, wrapping leaves with a bright, buttery flavor. Vitamin A and potassium.`,
  taste: `The classic salad base; a soft leaf for sandwiches and wraps.`,
  origin: `Lettuce began in the Middle East; Egyptians bred it to be less bitter, and used wild-lettuce oil for, among other things, mummification.`,
  harvest: [`Snip outer leaves once they reach 4 inches; leave a third.`, `Or cut the whole head at maturity.`],
  care: [`Bolts and turns bitter in heat.`, `Monthly root check.`],
  yours: [`A favorite from the July map that bolted in the August heat. This is the retry, now that the house is cool.`, `At row 7 center, one of the brightest seats, since the Nov 2 re-seating (up from row 10).`],
  src: [['Gardyn Help: Butterhead', 'https://help.mygardyn.com/en/articles/1780481']] },

'green-salanova': { name: 'Green Salanova', latin: 'Lactuca sativa', group: 'greens', glyph: 'frill', tint: 'lime', status: 'tower', tags: ['fav'],
  gb: { sprout: '7–14', mature: '55', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–70°F' },
  about: `Frilled, lime-green, crunchy-sweet leaves that grow into a compact rosette. Gardyn says the Salanova types yield about 40% more than ordinary baby-leaf lettuce.`,
  taste: `Anywhere lettuce goes: mixed salads, sandwiches, wraps.`,
  origin: `Lettuce began in the Middle East. Salanova is a recent line, bred so one head gives many uniform leaves.`,
  harvest: [`Snip outer leaves from 4 inches; leave a third.`, `Or wait for maturity and cut the head at the base.`],
  care: [`Bolts in heat.`, `Monthly root check.`],
  yours: [`You pulled the old one on Oct 27 because it hadn't been trimmed. Salanova wants regular outer-leaf picking.`, `Planted from the dome at row 3 right: compact, leaning off the tower.`],
  src: [['Gardyn Help: Green Salanova', 'https://help.mygardyn.com/en/articles/2349057'], [`Johnny's Seeds: Salanova`, 'https://www.johnnyseeds.com/vegetables/lettuce/salanova-lettuce/']] },

'lollo-rossa': { name: 'Lollo Rossa', latin: 'Lactuca sativa', group: 'greens', glyph: 'frill', tint: 'beet', status: 'tower', tags: [],
  gb: { sprout: '7–10', mature: '40', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–70°F' },
  about: `Tightly ruffled leaves edged in burgundy; tender and mild, never bitter. Anthocyanins, vitamins A and C, folate and iron.`,
  taste: `A showy base for salads, and a crunchy leaf for burgers and sandwiches.`,
  origin: `Probably descended from wild prickly lettuce of Europe, North Africa and Asia.`,
  harvest: [`Snip outer leaves at 2–3 inches; leave a third.`, `Or cut the whole head at maturity.`],
  care: [`Heat makes it bitter and bolty.`, `Monthly root check.`],
  yours: [`Planted from the dome at row 5 right, leaning off the tower.`],
  src: [['Gardyn Help: Lollo Rossa', 'https://help.mygardyn.com/en/articles/1797121']] },

'romaine': { name: 'Romaine', latin: `Lactuca sativa 'Paris Island Cos'`, group: 'greens', glyph: 'cos', tint: 'leaf', status: 'tower', tags: [],
  gb: { sprout: '7–10', mature: '68', zone: 'medium', size: '1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–70°F' },
  about: `Firm, crunchy, mild and sweet. The other name, cos, may come from the Greek island of Kos.`,
  taste: `Salads, tacos, sandwiches, wraps, anything that wants crunch.`,
  origin: `An old Mediterranean type; this one is the American variety Paris Island Cos.`,
  harvest: [`Snip outer leaves at 4 inches; leave a third.`, `Or cut the head at maturity.`],
  care: [`Bolts in heat.`, `Monthly root check.`],
  yours: [`Planted from the dome at row 6 center, a bright seat.`, `It grows upright under other plants, so keep harvesting outer leaves so it never reaches the pod two rows up.`],
  src: [['Gardyn Help: Romaine', 'https://help.mygardyn.com/en/articles/1798337']] },

'flashy-trout-back': { name: 'Flashy Trout Back', latin: `Lactuca sativa 'Forellenschluss'`, group: 'greens', glyph: 'cos', tint: 'speckle', status: 'tower', tags: [],
  gb: { sprout: '5–10', mature: '27–55', zone: 'medium', size: '1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–70°F' },
  about: `An heirloom romaine splashed with red, like the back of a trout; the speckles are normal. More tender and buttery than most romaines.`,
  taste: `Use it wherever you'd use romaine.`,
  origin: `Austria, where it was bred as Forellenschluss.`,
  harvest: [`Snip outer leaves at 4 inches; leave a third.`, `Or cut the head at maturity.`],
  care: [`Cut yellow flower stems as they appear to hold off bolting.`, `Monthly root check.`],
  pests: 'Aphids',
  yours: [`Your "flashy lettuce," planted from the dome at row 7 left, a bright seat.`],
  src: [['Gardyn Help: Flashy Trout Back', 'https://help.mygardyn.com/en/articles/1796737']] },

'red-sorrel': { name: 'Red Sorrel', latin: 'Rumex', group: 'greens', glyph: 'leaf', tint: 'sorrel', status: 'tower', tags: ['fav', 'giant'],
  gb: { sprout: '7–14', mature: '60–75', zone: 'medium', size: 'Under 1 ft', care: 'Intermediate', thin: '3 per yCube', temp: '60–70°F' },
  about: `Long leaves with deep red veins and a sharp lemon tang from oxalic acid. A cup covers a day's vitamins A and C.`,
  taste: `Young leaves raw: a few lemon up a whole bowl. Mature leaves mellow when cooked; good with fish, eggs and potatoes, in sauces and soups. Strip the stringy ribs from big leaves.`,
  origin: `Grasslands of Europe and Central Asia. Rarely sold because it wilts so soon after picking.`,
  harvest: [`Snip outer leaves at 4 inches, about an inch above the base. Never more than a third at once.`],
  care: [`Snip yellow or brown leaves.`, `Monthly root check.`],
  pests: 'Thrips',
  yours: [`Planted from the dome at row 1 right, once Pink Celery A moved down to row 2.`, `It's the one giant that can hold a dim seat at no cost (Gardyn's own Salad Lover layout puts it in row 1), leaning off the top corner with nothing above it.`],
  src: [['Gardyn Help: Red Sorrel', 'https://help.mygardyn.com/en/articles/1798209'], ['Gardyn yCube page: Red Sorrel', 'https://mygardyn.com/plant-book/red-sorrel/']] },

'salad-burnet': { name: 'Salad Burnet', latin: 'Poterium sanguisorba', group: 'herbs', glyph: 'burnet', tint: 'leaf', status: 'tower', tags: [], notGardyn: true,
  gb: { sprout: '—', mature: 'Perennial', zone: 'medium', zoneNote: `Not in Gardyn's catalog; seated as a medium-light plant.`, size: '12–15 in', care: '—', thin: '—' },
  about: `A perennial herb that grows a loose mound of lacy, fern-like leaflets. It tastes nutty and cucumber-like. The young growth is the good part; old leaves turn tough and bitter.`,
  taste: `Fresh in salads, herb butter, vinegars and cold drinks.`,
  origin: `Europe; an old kitchen-garden herb.`,
  harvest: [`Pick the tender new leaves, often.`],
  care: [`Snip the small round pink flower heads as they form, so it keeps making leaves.`, `It resents being moved, so its rockwool goes straight into its permanent pod.`],
  yours: [`Planted from the dome at row 9 left, rockwool straight into its permanent pod.`],
  src: [['Illinois Extension: Salad Burnet', 'https://extension.illinois.edu/herbs/salad-burnet'], ['Quickcrop: Salad Burnet', 'https://www.quickcrop.ie/learning/plant/salad-burnet']] },

'nasturtium': { name: 'Nasturtium', latin: 'Tropaeolum majus', group: 'flowers', glyph: 'shield', tint: 'orange', status: 'tower', tags: ['bloom'],
  gb: { sprout: '7–18', mature: '55–65', zone: 'medium', size: '2 ft', care: 'Intermediate', thin: '3 per yCube' },
  about: `Round, shield-like leaves and red, orange or yellow flowers. Leaves and flowers are both edible, mildly sweet and peppery. This variety mounds at first, then trails over the edge of its yPod.`,
  taste: `Flowers as a garnish or filled with soft cheese; leaves for pesto or tea; both make a peppery infused vinegar.`,
  origin: `Wild in Peru; carried to Europe in the 1550s, where Danish botanists bred today's trailing kinds.`,
  harvest: [`Cut flowers at the stem once fully open.`, `Take foliage once the plant is 4–6 inches with healthy roots, then often.`],
  care: [`Germinate it off the Gardyn with the Soak Method; the seed wants a well-drained start.`, `It trails, so Gardyn suggests outer Columns in medium or low light, or the Trellis and Plant Belts to send it up.`, `Strong roots: check them twice a month.`, `Pinch faded flowers just below the head for more blooms.`],
  yours: [`Planted from the dome at row 10 left, trailing off the bottom corner.`, `Expect more leaves than flowers on Plant Food. Aphids find it first, which makes it your early-warning plant.`],
  src: [['Gardyn Help: Nasturtium', 'https://help.mygardyn.com/en/articles/1783169']] },

'borage': { name: 'Borage', latin: 'Borago officinalis', group: 'flowers', glyph: 'star', tint: 'blue', status: 'tower', tags: ['bloom', 'giant'],
  gb: { sprout: '5–10', mature: '50–60', zone: 'medium', size: '2 ft', care: 'Beginner', thin: '1 per yCube' },
  about: `Also called starflower or bee bush: clusters of indigo star flowers with dark pointed centers, on a hairy, sprawling plant. Grown to bring in pollinators.`,
  taste: `Everything tastes faintly of cucumber, and the flowers of honeydew. Flowers raw as a garnish or frozen into ice cubes; leaves boiled; stems into soups.`,
  origin: `The eastern Mediterranean; naturalized across Europe and North America.`,
  harvest: [`Flowers come 6–8 weeks after sprouting. Pinch them off at the base once open.`, `Snip leaves where they meet the main stem.`],
  care: [`A Plant Belt if it gets top-heavy.`, `Snip older leaves as they yellow, where they meet the stem.`, `Monthly root check.`],
  yours: [`On Oct 27 it sat at row 6 center, where it would have grown into the tatsoi above it.`, `Since Nov 2 it's at row 9 right: it leans off the lower right corner, with a Cap two rows up at row 7 right. Pinch the tips.`],
  src: [['Gardyn Help: Borage', 'https://help.mygardyn.com/en/articles/1782657']] },

'dill': { name: 'Dill', latin: 'Anethum graveolens', group: 'herbs', glyph: 'feather', tint: 'lime', status: 'tower', tags: [],
  gb: { sprout: '7–21', mature: '40–50', zone: 'low', size: '1 ft', care: 'Beginner', thin: '3 per yCube' },
  about: `Feathery and delicate, and quick to bolt. High in vitamin A.`,
  taste: `Use it right after cutting: zucchini, yogurt sauces, salmon and herring, and every pickle.`,
  origin: `The eastern Mediterranean and western Asia; it shows up in Egyptian texts from about 3000 BC.`,
  harvest: [`Harvest often, taking fronds from the top down for bushier growth.`, `Once mature, cut back the top third every couple of months.`, `Pinch flowers when they appear to keep it leafy.`],
  care: [`Remove leaves with brown spots.`, `Monthly root check.`],
  pests: 'Aphids',
  yours: [`At row 10 right since the Nov 2 re-seating, its own low-light zone.`, `Treat it as a sprint crop: cut often and re-sow in the dome rather than letting it climb toward Bull's Blood B.`],
  src: [['Gardyn Help: Dill', 'https://help.mygardyn.com/en/articles/1784065']] },

'mint': { name: 'Mint', latin: 'Mentha', group: 'herbs', glyph: 'mint', tint: 'leaf', status: 'tower', tags: [],
  gb: { sprout: '10–21', mature: '60–75', zone: 'low', size: 'Under 1 ft', care: 'Intermediate', thin: '3 per yCube', temp: '60–70°F' },
  about: `Cool and bright. Slow to sprout, fast once it's established.`,
  taste: `Tea, lemonade, mojitos; salads, herb blends, fruit and preserves. Freeze crushed leaves in ice cubes.`,
  origin: `Native across much of the world, and in stories as old as the Bible and Greek myth.`,
  harvest: [`Pinch leaves, or cut stems just above a growth node. Up to a third of its height at a time.`],
  care: [`Remove brown-spotted leaves and the red runners; they steal energy from leaf growth.`, `It regrows fast, so prune hard when it needs it.`, `Root-trim monthly; mint will try to take over the Column.`],
  pests: 'Spider mites',
  yours: [`At row 8 left since the Nov 2 re-seating, hanging off the side.`],
  src: [['Gardyn Help: Mint', 'https://help.mygardyn.com/en/articles/1784513']] },

'chocolate-mint': { name: 'Chocolate Mint', latin: `Mentha × piperita f. citrata 'Chocolate'`, group: 'herbs', glyph: 'mint', tint: 'cocoa', status: 'tower', tags: [], notGardyn: true,
  gb: { sprout: 'Live plant', mature: 'Perennial', zone: 'low', zoneNote: `Not in Gardyn's catalog; seated like Gardyn's Mint, a low-light herb.`, size: 'Under 1 ft here', care: '—', thin: '—' },
  about: `A peppermint form with dark leaves tinged reddish-purple and a minty-chocolate smell. Vigorous and spreading.`,
  taste: `Tea, hot chocolate, desserts and fruit.`,
  origin: `A garden selection of peppermint, itself a cross of water mint and spearmint.`,
  harvest: [`Same as mint: cut stems above a node, up to a third at a time.`],
  care: [`Root-trim monthly so it doesn't colonize the Column.`, `The Royal Horticultural Society lists powdery mildew and mint rust as its diseases; keep air moving.`],
  yours: [`It arrived wilted by mail. You cut it back and planted it bare-root under a yCover on Oct 24, with the rhizome stubs laid flat. New growth was due in one to two weeks.`, `At row 9 center since the Nov 2 re-seating.`],
  src: [['RHS: Chocolate Peppermint', 'https://rhs.org.uk/plants/104628/mentha-piperita-f-citrata-chocolate/details'], ['Gardyn Help: Mint', 'https://help.mygardyn.com/en/articles/1784513']] },

'purslane': { name: 'Golden Purslane', latin: 'Portulaca oleracea', group: 'greens', glyph: 'succulent', tint: 'gold', status: 'tower', tags: [],
  gb: { sprout: '7–14', mature: '50–70', zone: 'low', size: 'Under 1 ft', care: 'Beginner', thin: '3 per yCube', temp: '60–70°F' },
  about: `A succulent "weed" eaten all over the world: juicy leaves on red-tinted stems, lemony and salty with an arugula-like bite. Gardyn notes it's unusually high in omega-3s and beta-carotene.`,
  taste: `Raw in salads, cooked like spinach, stirred into soups and stews, or made into pesto. Stems, leaves, buds and seeds are all edible.`,
  origin: `From Southeast Asia to southeastern Europe; nicknamed little hogweed and pigweed.`,
  harvest: [`Harvest often so it stays compact: pinch leaves or cut above a node, a third at a time.`],
  care: [`Remove leaves with brown spots.`, `Monthly root check.`],
  yours: [`You bought "golden purslane," which is the right plant (Portulaca oleracea, small yellow flowers), not the ornamental moss rose.`, `At row 10 center since the Nov 2 re-seating, its own low-light zone.`],
  src: [['Gardyn Help: Purslane', 'https://help.mygardyn.com/en/articles/1797633']] },

'tam-jalapeno': { name: 'TAM Jalapeño', latin: 'Capsicum annuum', group: 'fruit', glyph: 'pepper', tint: 'leaf', status: 'tower', tags: [], notGardyn: true,
  gb: { sprout: '10–28', mature: '65–80', zone: 'high', size: '18–30 in', care: 'Advanced', thin: '1 per yCube', temp: '70–85°F', note: `Sprout time, care level and temperature are Gardyn's for its Jalapeño; maturity and size are the TAM seed listing's.` },
  about: `A mild jalapeño bred at Texas A&M for heat, drought and disease tolerance. Compact and upright, with dark green fruit about 2½–3 inches long that turns red. Seed sellers put it around 1,000–2,500 Scoville units, well under a standard jalapeño.`,
  taste: `Salsa, tacos, poppers, pickled rings. Take out the seeds and ribs for even less heat.`,
  origin: `Jalapeños come from Mexico (the first pepper in space, on the Space Shuttle Columbia in 1982); this one from Texas A&M.`,
  harvest: [`Pick when firm and about 3 inches long; cut each at its own stem.`, `The longer it stays on, the hotter and redder it gets.`],
  care: [`Pinch off the first flower buds so roots and leaves come first.`, `Flowers arrive 4–6 weeks after sprouting: shake the plant or swirl the blossoms to pollinate.`, `A Plant Belt for the fruit; trim branches to keep it inside the light.`, `Gardyn says the small blisters called edema are harmless.`],
  pests: 'Aphids',
  yours: [`Sown after you pulled the banana peppers. One seedling lost its top to a stuck seed coat.`, `On the fruiting tower at row 4 right (bright) since the Nov 2 re-seating, with row 2 right kept open above it for headroom.`],
  src: [['Gardyn Help: Jalapeños', 'https://help.mygardyn.com/en/articles/1799809'], ['True Leaf Market: TAM Jalapeño', 'https://www.trueleafmarket.com/a/amp/products/pepper-hot-tam-jalapeno-seeds'], ['Reimer Seeds: TAM Jalapeño', 'https://www.reimerseeds.com/tam-jalapeno-pepper-seeds']] },

'strawberry': { name: 'Albion Strawberry', latin: `Fragaria × ananassa 'Albion'`, group: 'fruit', glyph: 'berry', tint: 'red', status: 'tower', tags: [],
  gb: { sprout: 'Bare root', mature: '60–90', zone: 'high', size: '1 ft', care: 'Advanced', thin: 'Do not thin', temp: '60–85°F', humidity: '60–75%' },
  about: `A day-neutral (everbearing) strawberry from the University of California, prized for flavor: long, conical, firm berries, dark red inside and out. Resistant to verticillium wilt and Phytophthora crown rot, fairly resistant to anthracnose crown rot. It throws a lot of runners.`,
  taste: `Fresh, in desserts and smoothies, or as jam.`,
  origin: `Garden strawberries were bred in France from two wild American species and came back to the Americas by the 1700s.`,
  harvest: [`Pick when red right up to the stem; color tells ripeness, not size.`, `Give a ripe berry an extra day or two for flavor; it should feel soft.`, `Pinch off or snip with clean scissors.`],
  care: [`Swirl each open flower 2–3 times with your thumb to pollinate; the berry forms about two weeks after the petals drop.`, `Remove flowers until a plant has at least six open leaves.`, `Cut runners for the plant's whole life (root one or two first if you want clones).`, `Never more than a third of the leaves at once.`, `Root-prune twice a month: brown, black or slimy roots, and anything past the yPod.`, `Keep Germination Mode off so they get full waterings; don't put unsprouted yCubes on the same unit.`],
  pests: 'Aphids, spider mites (Albion tolerates two-spotted mites), fungus gnats in wet rockwool',
  yours: [`Eleven on the fruiting tower. Your first batch was lost to root rot; this batch was chosen for disease resistance.`, `Crowns: green algae on the wet rockwool around them, and gnats on a wilting one (Nov 2). The crown plan lives in Care, under Fixes.`, `Tank Refresh every two weeks while they're active; HydroBoost weekly, up to every three days with big fruiting plants.`, `Since the Nov 2 re-seating, strawberries 9, 10 and 11 sit in center rows 5, 6 and 8, out of dim row 10. If one comes out, row 8 center goes back to air.`],
  src: [['Gardyn Help: Strawberries', 'https://help.mygardyn.com/en/articles/1786241'], ['Gardyn Help: Strawberry Care Guide', 'https://help.mygardyn.com/en/articles/1782145'], ['UC ANR: Albion', 'https://ccfruitandnuts.ucanr.edu/sites/default/files/2018-03/281247.pdf']] },

'yellow-cherry-tomato': { name: 'Yellow Cherry Tomato', latin: 'Solanum lycopersicum', group: 'fruit', glyph: 'tomato', tint: 'yellow', status: 'tower', tags: ['giant'],
  gb: { sprout: '7–21', mature: '60–75', zone: 'high', size: '2 ft', care: 'Advanced', thin: '1 per yCube' },
  about: `A compact hybrid with lots of sweet, inch-round golden fruit. Compared with red tomatoes: less lycopene and vitamin C, more folate, iron, potassium and zinc.`,
  taste: `Best straight off the vine; salads, pasta, pizza.`,
  origin: `A hybrid bred for flavor and a compact plant.`,
  harvest: [`Pick when evenly yellow and a little soft, just before it looks fully ripe; overripe fruit cracks on the plant.`, `Twist until it snaps off, or snip the stem.`],
  care: [`Pinch off the first set of flower buds, then shake the plant or swirl blossoms to pollinate (flowers come 4–6 weeks after sprouting).`, `Plant Belts hold the vine and fruit.`, `Gardyn calls for light pruning only. Yours grow much bigger than Gardyn's 2 feet, so: top each plant at the last good cluster, prune suckers weekly, and belt the vines down the light bars.`, `Monthly root trim; it protects every plant below it in the Column.`],
  yours: [`Two plants in the top corners: #2 at row 1 right, #1 at row 2 left, trained down the light bars.`, `Leave the roots alone for a month after the Oct 27 cleanout (until about Nov 27).`, `Rolled, leathery leaves read as physiological leaf roll: cosmetic, not catching. Fine speckling would mean mites instead.`, `Escape hatch at the next replant: one tomato instead of two frees four outer pods.`],
  src: [['Gardyn Help: Yellow Cherry Tomato', 'https://help.mygardyn.com/en/articles/1786561'], ['Gardyn blog: cherry tomatoes indoors', 'https://mygardyn.com/blog/grow-cherry-tomatoes-indoors-summer/']] },

'cucumber': { name: 'Cucumber', latin: 'Cucumis sativus', group: 'fruit', glyph: 'cuke', tint: 'leaf', status: 'tower', tags: [],
  gb: { sprout: '10–14', mature: '65–75', zone: 'high', size: '2 ft', care: 'Advanced', thin: '1 per yCube', temp: '70–85°F' },
  about: `Gardyn's cucumber carries only female flowers and sets seedless fruit without pollination, so there's no seed to save. Most of the nutrition is in the skin.`,
  taste: `Raw, baked, sautéed or steamed; slices in water.`,
  origin: `India, cultivated for over 3,000 years; spread west through the Greeks and Romans.`,
  harvest: [`Pick at 3–6 inches, dark green, once the yellow flower has dropped off the tip.`, `Cut each fruit at its own stem; overgrown ones turn bitter.`],
  care: [`Remove the lowest five flowers, then keep no more than five fruits on the plant.`, `Trim the main stem to keep it inside the light.`, `Trellis and Plant Belts; keep the Tank above 60% and top off weekly.`],
  pests: 'Thrips',
  yours: [`Both are fading; you cut them back on Oct 27.`, `Staying: on Nov 6 you vetoed pulling them. A good crisp cucumber is too central to your salads to give up. When these give out, fresh cucumbers take the same pods: Gardyn's again, or a type that fits a Gardyn better.`, `Gardyn's cucumber only comes as a seeded yCube.`],
  src: [['Gardyn Help: Cucumbers', 'https://help.mygardyn.com/en/articles/1785537']] },

'green-beans': { name: 'Green Beans', latin: 'Phaseolus vulgaris', group: 'fruit', glyph: 'pod', tint: 'leaf', status: 'planned', tags: [],
  gb: { sprout: '10–14', mature: '50–75', zone: 'high', size: '2 ft', care: 'Advanced', thin: '1 per yCube', temp: '70–85°F' },
  about: `A compact bush bean with wide heart-shaped leaves and white, pink or purple flowers. Folate, vitamins A, C and K, and fiber.`,
  taste: `Fresh or lightly steamed for the most nutrition; also sautéed, roasted, grilled or pickled.`,
  origin: `Peru; spread through the Americas and grown in the Three Sisters with corn and squash.`,
  harvest: [`Pick pods about 5 inches long and pencil-thick while still tender, usually 1–2 weeks after flowering.`, `It sets most of its crop at once but keeps going if you pick regularly. Overgrown pods tell it to quit.`],
  care: [`Germinate off the unit with the Soak Method: 5-minute soak to the top of the plastic, into the Nursery with no extra water, lid on, apart from other germinating seeds.`, `Seat the seed about an inch down in the rockwool.`, `Flowers 4–6 weeks after sprouting: shake or swirl to pollinate.`, `Trellis and Plant Belts; keep leaves dry.`],
  pests: 'Aphids, mites',
  yours: [`All three rotted on Oct 27: each sat below a tomato's root mat, beans (like strawberries) are rated salt-sensitive, and one hung in the humidifier plume.`, `The rule since: nothing salt-sensitive sits in an outer pod of rows 3–6 while the tomato above it stands. The strawberries in rows 7–9 already live under the tomatoes and do well; the beans and the cucamelon stay in the center Column.`, `One bean growing as of Nov 6, and the cucumbers are staying, so the old bean lane (center rows 3 and 4 after the cucumbers) is off. Row 2 center, the staggered third bean's seat on the v9 map, is still open: your call.`, `Seed saving: leave pods on until brown and rattling. Gardyn's bush variety is bred for the Columns; store-bought beans aren't a substitute.`],
  src: [['Gardyn Help: Green Beans', 'https://help.mygardyn.com/en/articles/1785665'], ['Gardyn: How to grow green beans indoors', 'https://mygardyn.com/pages/grow-green-beans']] },

'ground-cherry': { name: 'Ground Cherry', latin: 'Physalis pruinosa', group: 'fruit', glyph: 'lantern', tint: 'husk', status: 'tower', tags: [], notGardyn: true,
  gb: { sprout: '14–21', mature: '70–75', zone: 'high', zoneNote: `Not in Gardyn's catalog. Its cousin Cape Gooseberry is a high-light plant there (10–28 days to sprout, 80+ to mature, Advanced, 70–85°F).`, size: '1½–3 ft', care: '—', thin: '1 per yCube' },
  about: `Sweet golden berries inside papery husks, with notes of pineapple, cherry tomato and vanilla. A low, sprawling, self-fertile bush.`,
  taste: `Fresh, in salads and salsa, baked into pies and scones, made into jam, or dried like raisins.`,
  origin: `The Americas; a nightshade, like tomatoes.`,
  harvest: [`Ripe fruit falls on its own, or drops when you shake the branch. The husk dries to tan.`, `Green fruit that falls early can finish ripening on a windowsill. In their husks they keep for weeks in the fridge.`],
  care: [`A gentle shake helps it pollinate.`, `Plant Belts, and a tray underneath to catch what drops.`, `Eat only fully golden fruit. Gardyn warns that the green fruit and leaves of its cousin are poisonous to people, cats and dogs.`],
  yours: [`Planted from the dome at fruiting row 6 left, leaning off the tower with row 4 left kept open above it. Plant Belts, and a tray underneath to catch what drops.`],
  src: [['Savvy Gardening: Ground cherries', 'https://savvygardening.com/grow-ground-cherries-in-a-garden/'], ['Gardyn Help: Cape Gooseberry', 'https://help.mygardyn.com/en/articles/1785281'], ['Epic Gardening: Ground cherry', 'https://www.epicgardening.com/?p=116920']] },

'cucamelon': { name: 'Cucamelon', latin: 'Melothria scabra', group: 'fruit', glyph: 'melon', tint: 'leaf', status: 'tower', tags: [], notGardyn: true,
  gb: { sprout: '—', mature: '≈75', zone: 'high', zoneNote: `Not in Gardyn's catalog; seated in Gardyn's cucumber seat, the bottom of the middle column.`, size: 'Long vines', care: '—', thin: '1 per yCube' },
  about: `Grape-sized fruit that look like tiny watermelons and taste like cucumber with a lime tang. Vigorous vines with male and female flowers on the same plant, and tuberous roots.`,
  taste: `Off the vine, in salads and salsa, pickled, or dropped in a gin and tonic.`,
  origin: `Mexico and Central America; also called the Mexican sour gherkin or mouse melon.`,
  harvest: [`Pick at about an inch, still firm. Start checking a week or two after the first flowers; older fruit gets sourer.`],
  care: [`Indoors you're the bee: move pollen from a male flower to a female one (the female has a tiny fruit behind the bloom).`, `Weave the vine up the Trellis.`, `Keep leaves dry; it's mildew-prone.`, `Its roots dislike strong feeding. If it sulks at fruiting-tower strength, the salad tower's lighter Tank is the fallback.`],
  yours: [`Planted from the dome at fruiting row 10 center, Gardyn's vine seat; it climbs the Trellis up the face of the tower toward the high light.`],
  src: [['Savvy Gardening: Cucamelons', 'https://savvygardening.com/growing-cucamelons-in-a-garden/'], ['Epic Gardening: Cucamelon', 'https://www.epicgardening.com/?p=104763']] },

/* ---------- Ideas ---------- */
'arugula': { name: 'Arugula', latin: 'Eruca sativa', group: 'greens', glyph: 'leaf', tint: 'leaf', status: 'idea', tags: [],
  gb: { sprout: '4–21', mature: '30–40', zone: 'low', size: '1 ft', care: 'Beginner', thin: 'Do not thin', temp: '60–70°F' },
  about: `Young leaves are sweet and nutty; bigger ones turn peppery, then bitter. Vitamins A, C and K, calcium and folate.`,
  taste: `A salad base, or piled fresh on pizza and eggs just before serving.`,
  origin: `The Mediterranean; the Egyptians and Romans grew it.`,
  harvest: [`Snip outer leaves at 2–3 inches. Smaller leaves are milder.`, `Cut yellow flower stems as they appear to hold off bolting.`],
  care: [`Monthly root check.`], pests: 'Aphids',
  why: `The peppery bite the green mustard used to bring, without the mustard’s habit of outgrowing its listing. A low-light plant, so it fits row 1 or row 10.`,
  src: [['Gardyn Help: Arugula', 'https://help.mygardyn.com/en/articles/1795649']] },

'wasabi-greens': { name: 'Wasabi Greens', latin: 'Brassica juncea', group: 'greens', glyph: 'leaf', tint: 'lime', status: 'idea', tags: [],
  gb: { sprout: '5–10', mature: '45', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–70°F' },
  about: `Serrated, bright green mustard leaves with a sharp, wasabi-like heat once you bite. No relation to true wasabi.`,
  taste: `Salad mixes, spring rolls, anything with ginger and sesame. Light cooking turns the heat sweet.`,
  origin: `Eurasia; brown mustard has been grown for over 4,000 years.`,
  harvest: [`Snip outer leaves at 4 inches, stalk and all; leave a third.`],
  care: [`Bolts to yellow flowers in heat; the flowers are edible.`, `Monthly root check.`],
  why: `Horseradish heat in a compact rosette.`,
  src: [['Gardyn Help: Wasabi Greens', 'https://help.mygardyn.com/en/articles/1795905']] },

'breen': { name: 'Breen', latin: 'Lactuca sativa', group: 'greens', glyph: 'cos', tint: 'bronze', status: 'idea', tags: [],
  gb: { sprout: '7–21', mature: '45', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–70°F' },
  about: `A bronze-red mini romaine with light veins; firm, crisp, and higher in antioxidants than green romaine.`,
  taste: `Holds its shape raw in salads, tacos and burgers; can be braised.`,
  origin: `A modern romaine bred for color.`,
  harvest: [`Snip outer leaves at 4 inches; leave a third.`],
  care: [`Monthly root check.`],
  why: `A bronze mini romaine that has never bolted on you.`,
  src: [['Gardyn Help: Breen', 'https://help.mygardyn.com/en/articles/1796161']] },

'watercress': { name: 'Watercress', latin: 'Nasturtium officinale', group: 'greens', glyph: 'round', tint: 'leaf', status: 'idea', tags: [],
  gb: { sprout: '7–21', mature: '60', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: 'Do not thin', temp: '60–70°F' },
  about: `Small, round, peppery leaves that turn bitter as they age. Vitamins A, C and K. In the wild it grows in running water.`,
  taste: `Raw or barely steamed: salads, sandwiches, eggs, and on top of soup.`,
  origin: `Europe and Asia. The Romans called it nasturtium, "twisted nose," for the bite.`,
  harvest: [`Harvest often: pinch leaves or cut above a node; leave a third.`],
  care: [`If it gets spindly, cut every branch back by at least a third.`, `Remove brown-spotted leaves.`],
  pests: 'Spider mites',
  why: `It loves running water, which is exactly what the Columns give it.`,
  src: [['Gardyn Help: Watercress', 'https://help.mygardyn.com/en/articles/1795777']] },

'cilantro': { name: 'Cilantro', latin: 'Coriandrum sativum', group: 'herbs', glyph: 'feather', tint: 'leaf', status: 'idea', tags: [],
  gb: { sprout: '5–21', mature: '50–55', zone: 'low', size: '1 ft', care: 'Beginner', thin: '3 per yCube', temp: '60–70°F' },
  about: `Bright and citrusy (or soapy, for people with a common gene variant). Bolts in heat; the flowers are edible and the seeds are coriander.`,
  taste: `Salsas, salads, rice dishes and stir-fries.`,
  origin: `The Mediterranean; one of the first herbs carried to the New World.`,
  harvest: [`Start at 6 inches tall: cut outer stalks at the base or pinch leaves; leave a third.`],
  care: [`Monthly root check.`], pests: 'Aphids',
  why: `A dressing herb that bolts fast, so treat it as a sprint crop. Low light suits row 10.`,
  src: [['Gardyn Help: Cilantro', 'https://help.mygardyn.com/en/articles/1784129']] },

'chervil': { name: 'Chervil', latin: 'Anthriscus cerefolium', group: 'herbs', glyph: 'feather', tint: 'lime', status: 'idea', tags: [],
  gb: { sprout: '10–14', mature: '60–70', zone: 'low', size: 'Under 1 ft', care: 'Intermediate', thin: '3 per yCube', temp: '55–65°F' },
  about: `Somewhere between parsley and tarragon, with a hint of anise. Part of the French fines herbes; drying or long cooking kills the flavor.`,
  taste: `Eggs, fish, spring vegetables, potatoes, soft cheese. Add it at the end.`,
  origin: `The Mediterranean.`,
  harvest: [`Cut whole outer branches at the base, a third at a time; best young, before it flowers.`],
  care: [`It has a long taproot: check roots at least monthly.`, `Snip flowers to extend its life; replace it when leaves go brown or purple.`],
  pests: 'Thrips',
  why: `The coolest-loving herb in the catalog (55–65°F), which suits an island winter.`,
  src: [['Gardyn Help: Chervil', 'https://help.mygardyn.com/en/articles/1783809']] },

'catnip': { name: 'Catnip', latin: 'Nepeta cataria', group: 'herbs', glyph: 'mint', tint: 'sage', status: 'idea', tags: [],
  gb: { sprout: '10–14', mature: '40–50', zone: 'low', size: '1 ft', care: 'Beginner', thin: '3 per yCube', temp: '60–70°F' },
  about: `A mint-family herb that makes nepetalactone, the compound cats react to. It's also a strong insect repellent.`,
  taste: `Mostly for the cat; small amounts make a calming tea.`,
  origin: `Europe, Asia and Africa; brewed as tea in Europe before Chinese tea arrived.`,
  harvest: [`Harvest often: cut stems ¼–½ inch above the nodes, just above the two largest leaves.`],
  care: [`Remove brown-spotted leaves; monthly root check.`],
  why: `You wanted to keep catnip going for the cat; it came off the tower before Oct 27. Start the next one five weeks into the last so there's never a gap.`,
  src: [['Gardyn Help: Catnip', 'https://help.mygardyn.com/en/articles/1783937']] },

'lemon-balm': { name: 'Lemon Balm', latin: 'Melissa officinalis', group: 'herbs', glyph: 'mint', tint: 'lime', status: 'idea', tags: [],
  gb: { sprout: '7–14', mature: '70', zone: 'low', zoneNote: `Gardyn's placement guide lists it as low light; its plant article says medium.`, size: '2 ft', care: 'Intermediate', thin: '3 per yCube' },
  about: `A mint-family herb with heart-shaped leaves that smell of lemon when rubbed.`,
  taste: `Tea, drinks, fruit salads, fish and poultry.`,
  origin: `Southern Europe and North Africa; Melissa is Greek for honey bee.`,
  harvest: [`From 10 inches, trim larger outer leaves or cut above a node; a third at a time.`],
  care: [`Monthly root check.`],
  why: `One of the citrus-flavored herbs in Gardyn's catalog you had noted, with lemongrass and lime basil.`,
  src: [['Gardyn Help: Lemon Balm', 'https://help.mygardyn.com/en/articles/1784385']] },

/* ---------- Retired ---------- */
'muir': { name: 'Muir', latin: 'Lactuca sativa', group: 'greens', glyph: 'frill', tint: 'lime', status: 'retired', tags: ['fav'],
  gb: { sprout: '5–14', mature: '80', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–70°F' },
  about: `A crunchy, juicy Batavia with frilled lime leaves and a small dense head; takes heat well. Wants direct light with nothing blocking it.`,
  gone: `On the July and September maps as a pair; off the tower by Oct 27.`,
  src: [['Gardyn Help: Muir', 'https://help.mygardyn.com/en/articles/5249729']] },
'monte-carlo': { name: 'Monte Carlo', latin: 'Lactuca sativa', group: 'greens', glyph: 'cos', tint: 'leaf', status: 'retired', tags: ['fav'],
  gb: { sprout: '7–10', mature: '46', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–70°F' },
  about: `A compact romaine with crisp, sweet, dark green leaves. Poor heat tolerance, so it wanted an outer pod.`,
  gone: `A double on the July map; off the tower by Oct 27.`,
  src: [['Gardyn Help: Monte Carlo', 'https://help.mygardyn.com/en/articles/1797313']] },
'purple-bok-choy': { name: 'Purple Bok Choy', latin: 'Brassica rapa subsp. chinensis', group: 'greens', glyph: 'spoon', tint: 'purple', status: 'retired', tags: [],
  gb: { sprout: '7–12', mature: '40–50', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–80°F' },
  about: `Fast-growing, maroon-leaved and sweeter than green bok choy; bolts in heat and draws aphids.`,
  gone: `A pair on the September map; off the tower by Oct 27.`,
  src: [['Gardyn Help: Purple Bok Choy', 'https://help.mygardyn.com/en/articles/1797505']] },
'mini-broccoli': { name: 'Mini Broccoli', latin: 'Brassica oleracea', group: 'greens', glyph: 'broccoli', tint: 'leaf', status: 'retired', tags: [],
  gb: { sprout: '5–10', mature: '85–100', zone: 'high', size: '2 ft', care: 'Advanced', thin: '1 per yCube', temp: '65–70°F' },
  about: `An egg-sized head on a long stem, then side shoots. Cut the head at 1½–2 inches across.`,
  gone: `It stretched taller and taller in the brightest crown and never made a head; removed in September.`,
  src: [['Gardyn Help: Mini Broccoli', 'https://help.mygardyn.com/en/articles/2644225']] },
'green-mustard': { name: 'Green Mustard', latin: 'Brassica rapa var. japonica', group: 'greens', glyph: 'leaf', tint: 'leaf', status: 'retired', tags: ['giant'],
  gb: { sprout: '5–21', mature: '21–40', zone: 'medium', size: '1 ft', care: 'Beginner', thin: '1 per yCube', temp: '60–70°F' },
  about: `Peppery, earthy leaves that keep their shape raw.`,
  gone: `It grew far bigger than its listing on the tower; phased out for size in the fall.`,
  src: [['Gardyn Help: Green Mustard', 'https://help.mygardyn.com/en/articles/1796801']] },
'sunflower': { name: 'Sunflower', latin: 'Helianthus annuus', group: 'flowers', glyph: 'sunflower', tint: 'yellow', status: 'retired', tags: ['bloom'],
  gb: { sprout: '10–14', mature: '65–75', zone: 'high', size: '1 ft', care: 'Intermediate', thin: '1 per yCube' },
  about: `A pollen-free dwarf with edible, slightly nutty petals. Deadhead spent flowers for more buds; aphids like it.`,
  gone: `Two on the September map; both off the tower by Oct 27.`,
  src: [['Gardyn Help: Sunflower', 'https://help.mygardyn.com/en/articles/1783489']] },
'garlic-chives': { name: 'Garlic Chives', latin: 'Allium tuberosum', group: 'herbs', glyph: 'blades', tint: 'leaf', status: 'retired', tags: [],
  gb: { sprout: '10–21', mature: '90', zone: 'low', size: 'Under 1 ft', care: 'Intermediate', thin: 'Do not thin' },
  about: `Mild garlic-and-onion leaves and white star flowers. Cut at 4–6 inches down to 1–2; it regrows in a week or two.`,
  gone: `On the July and September maps; off the tower by Oct 27.`,
  src: [['Gardyn Help: Garlic Chives', 'https://help.mygardyn.com/en/articles/1784001']] },
'thyme': { name: 'Thyme', latin: 'Thymus vulgaris', group: 'herbs', glyph: 'sprig', tint: 'sage', status: 'retired', tags: [],
  gb: { sprout: '7–21', mature: '90–95', zone: 'low', size: 'Under 1 ft', care: 'Intermediate', thin: '3 per yCube' },
  about: `Earthy, sweet and citrusy. Snip green tops once stems reach 8–10 inches, never into the woody base; spider mites like it.`,
  gone: `Trailed off row 10 on the July and September maps; off the tower by Oct 27.`,
  src: [['Gardyn Help: Thyme', 'https://help.mygardyn.com/en/articles/1784961']] },
'banana-pepper': { name: 'Banana Pepper', latin: 'Capsicum annuum', group: 'fruit', glyph: 'pepper', tint: 'yellow', status: 'retired', tags: [],
  gb: { sprout: '7–14', mature: '60–90', zone: 'high', size: '2 ft', care: 'Advanced', thin: '1 per yCube', temp: '70–85°F' },
  about: `Mild, sweet peppers up to 8–9 inches long, yellow-green turning yellow and then red.`,
  gone: `Bought as Gardyn's Lemon Hot Pepper (a 1-inch, very hot teardrop); they grew into foot-long, sweet banana peppers with no heat. Pulled in October for the TAM jalapeños.`,
  src: [['Gardyn Help: Banana Peppers', 'https://help.mygardyn.com/en/articles/1785345']] }
},

/* ---------- The towers ---------- */
towers: {
  S: { name: 'Salad tower', short: 'Salad', also: 'the vegetative tower' },
  F: { name: 'Fruiting tower', short: 'Fruiting', also: '' }
},

/* Each plant on (or headed for) a tower. now = its seat today ('sow' = not sown yet); plan = its seat after the steps
   still to come ('out' = comes out); was = its Oct 27 seat, before the Nov 2 re-seating ('dome' = planted from the dome).
   Today's seats are the Nov 2 maps (salad v5, fruiting v9), in place as of Nov 5. */
pods: [
  // Salad tower (v5)
  { id: 'spin-l1', p: 'perpetual-spinach', label: 'Perpetual Spinach', now: 'S3L', plan: 'S3L', was: 'S1L' },
  { id: 'spin-c1', p: 'perpetual-spinach', label: 'Perpetual Spinach', now: 'S3C', plan: 'S3C', was: 'S1C' },
  { id: 'spin-c2', p: 'perpetual-spinach', label: 'Perpetual Spinach', now: 'S2C', plan: 'S2C' },
  { id: 'spin-r2', p: 'perpetual-spinach', label: 'Perpetual Spinach', now: 'S6L', plan: 'S6L', was: 'S2R' },
  { id: 'celery-a', p: 'pink-celery', label: 'Pink Celery A', now: 'S2R', plan: 'S2R', was: 'S1R' },
  { id: 'celery-b', p: 'pink-celery', label: 'Pink Celery B', now: 'S2L', plan: 'S2L' },
  { id: 'rtat-a', p: 'red-tatsoi', label: 'Red Tatsoi A', now: 'S6R', plan: 'S6R', was: 'S3L' },
  { id: 'rtat-b', p: 'red-tatsoi', label: 'Red Tatsoi B', now: 'S5C', plan: 'S5C', was: 'S3C' },
  { id: 'gtat-a', p: 'green-tatsoi', label: 'Green Tatsoi A', now: 'S4C', plan: 'S4C' },
  { id: 'gtat-b', p: 'green-tatsoi', label: 'Green Tatsoi B', now: 'S4R', plan: 'S4R' },
  { id: 'dill', p: 'dill', label: 'Dill', now: 'S10R', plan: 'S10R', was: 'S5R' },
  { id: 'borage', p: 'borage', label: 'Borage', now: 'S9R', plan: 'S9R', was: 'S6C' },
  { id: 'mint', p: 'mint', label: 'Mint', now: 'S8L', plan: 'S8L', was: 'S7L' },
  { id: 'purslane', p: 'purslane', label: 'Golden Purslane', now: 'S10C', plan: 'S10C', was: 'S7R' },
  { id: 'bb-a', p: 'bulls-blood', label: `Bull's Blood A`, now: 'S8C', plan: 'S8C' },
  { id: 'buttercrunch', p: 'buttercrunch', label: 'Buttercrunch', now: 'S5L', plan: 'S5L', was: 'S9C' },
  { id: 'chocmint', p: 'chocolate-mint', label: 'Chocolate Mint', now: 'S9C', plan: 'S9C', was: 'S9R' },
  { id: 'bb-b', p: 'bulls-blood', label: `Bull's Blood B`, now: 'S8R', plan: 'S8R', was: 'S10L' },
  { id: 'butterhead', p: 'butterhead', label: 'Butterhead', now: 'S7C', plan: 'S7C', was: 'S10C' },
  { id: 'sorrel', p: 'red-sorrel', label: 'Red Sorrel', now: 'S1R', plan: 'S1R', was: 'dome' },
  { id: 'salanova', p: 'green-salanova', label: 'Green Salanova', now: 'S3R', plan: 'S3R', was: 'dome' },
  { id: 'lollo', p: 'lollo-rossa', label: 'Lollo Rossa', now: 'S5R', plan: 'S5R', was: 'dome' },
  { id: 'romaine', p: 'romaine', label: 'Romaine', now: 'S6C', plan: 'S6C', was: 'dome' },
  { id: 'flashy', p: 'flashy-trout-back', label: 'Flashy Trout Back', now: 'S7L', plan: 'S7L', was: 'dome' },
  { id: 'burnet', p: 'salad-burnet', label: 'Salad Burnet', now: 'S9L', plan: 'S9L', was: 'dome' },
  { id: 'nasturtium', p: 'nasturtium', label: 'Nasturtium', now: 'S10L', plan: 'S10L', was: 'dome' },
  // Fruiting tower (v9)
  { id: 'tom-2', p: 'yellow-cherry-tomato', label: 'Tomato #2', now: 'F1R', plan: 'F1R', seat: 'A corner seat with nothing above it; the vine is belted down the right light bar into the bright band.' },
  { id: 'tom-1', p: 'yellow-cherry-tomato', label: 'Tomato #1', now: 'F2L', plan: 'F2L', seat: 'A corner seat leaning off the tower; the vine is belted down the left light bar into the bright band.' },
  { id: 'cuke-1', p: 'cucumber', label: 'Cucumber #1', now: 'F3C', plan: 'F3C', fading: true, note: 'Fading, and staying (your call, Nov 6). When it gives out, a fresh cucumber takes this pod.' },
  { id: 'cuke-2', p: 'cucumber', label: 'Cucumber #2', now: 'F4C', plan: 'F4C', fading: true, note: 'Fading, and staying (your call, Nov 6). When it gives out, a fresh cucumber takes this pod.' },
  { id: 'tam-1', p: 'tam-jalapeno', label: 'TAM Jalapeño', now: 'F4R', plan: 'F4R', was: 'S7C' },
  { id: 's1', p: 'strawberry', label: 'Strawberry 1', now: 'F7L', plan: 'F7L' },
  { id: 's2', p: 'strawberry', label: 'Strawberry 2', now: 'F7C', plan: 'F7C' },
  { id: 's3', p: 'strawberry', label: 'Strawberry 3', now: 'F7R', plan: 'F7R' },
  { id: 's4', p: 'strawberry', label: 'Strawberry 4', now: 'F8L', plan: 'F8L' },
  { id: 's5', p: 'strawberry', label: 'Strawberry 5', now: 'F8R', plan: 'F8R' },
  { id: 's6', p: 'strawberry', label: 'Strawberry 6', now: 'F9L', plan: 'F9L' },
  { id: 's7', p: 'strawberry', label: 'Strawberry 7', now: 'F9C', plan: 'F9C' },
  { id: 's8', p: 'strawberry', label: 'Strawberry 8', now: 'F9R', plan: 'F9R' },
  { id: 's9', p: 'strawberry', label: 'Strawberry 9', now: 'F5C', plan: 'F5C', was: 'F10L' },
  { id: 's10', p: 'strawberry', label: 'Strawberry 10', now: 'F6C', plan: 'F6C', was: 'F10C' },
  { id: 's11', p: 'strawberry', label: 'Strawberry 11', now: 'F8C', plan: 'F8C', was: 'F10R', note: 'If a strawberry comes out, this seat goes back to air.' },
  { id: 'gcherry', p: 'ground-cherry', label: 'Ground Cherry', now: 'F6L', plan: 'F6L', was: 'dome' },
  { id: 'cucamelon', p: 'cucamelon', label: 'Cucamelon', now: 'F10C', plan: 'F10C', was: 'dome', seat: 'Gardyn’s vine seat: it starts low and climbs the Trellis up the face of the tower toward the high light.' },
  { id: 'bean-1', p: 'green-beans', label: 'Green Bean', now: 'dome', plan: 'tbd', note: 'The one bean growing (Nov 6). Its seat is yours to choose; row 2 center is the bean seat still open from the v9 map.' }
],

/* Empty seats with a job. */
holds: {
  now: {
    S1L: { cap: true, note: 'Cap: headroom for the spinach at row 3 left' },
    S1C: { cap: true, note: 'Cap: headroom for the spinach at row 3 center' },
    S4L: { cap: true, note: 'Cap: headroom for the spinach at row 6 left' },
    S7R: { cap: true, note: 'Cap: headroom for the borage at row 9 right' },
    F1L: { tag: 'low light', note: 'Open: low light at the top of the tower' },
    F1C: { tag: 'low light', note: 'Open: low light at the top of the tower' },
    F2C: { tag: 'bean seat', note: 'Open: the bean seat left on the v9 map, in the center Column the salt rule asks for. Your one bean could go here: your call.' },
    F2R: { tag: 'headroom', note: 'Open: headroom for the TAM at row 4 right' },
    F3L: { tag: 'canopy', note: 'Open: tomato canopy and root zone' },
    F3R: { tag: 'canopy', note: 'Open: tomato canopy and root zone' },
    F4L: { tag: 'headroom', note: 'Open: headroom for the ground cherry at row 6 left' },
    F5L: { tag: 'canopy', note: 'Open: tomato canopy and root zone' },
    F5R: { tag: 'free seat', free: true, note: 'Open: the one truly free seat on the tower; a second TAM would fit here' },
    F6R: { tag: 'canopy', note: 'Open: tomato canopy and root zone' },
    F10L: { tag: 'low light', note: 'Open: low light at the bottom of the tower' },
    F10R: { tag: 'low light', note: 'Open: low light at the bottom of the tower' }
  }
},

/* The steps still to come. kind: move (a plant changes seat), cap (a Cap goes on), out (a plant comes out), task (a job, no seat change). */
moves: [
  { phase: 'beans', kind: 'task', id: 'bean-seat', text: 'Choose the bean’s seat once it has true leaves. The cucumbers are staying; row 2 center is the bean seat still open from the v9 map' }
],
phases: {
  now: { title: 'Now', sub: '' },
  beans: { title: 'When the bean has true leaves', sub: 'About 2–3 weeks after sowing. The cucumbers stay put (your call, Nov 6).', gate: 'a bean seedling with true leaves' }
},
phaseOrder: ['beans'],
done: { date: 'Nov 5', text: 'The Nov 2 re-seating is done: 22 salad moves, every dome plant planted, the TAM over to the fruiting tower, strawberries 9–11 out of row 10, and the Caps on.' },

/* ---------- Care rhythm ---------- */
care: [
  { id: 'topoff', title: 'Tank Top-off', every: 7, where: 'Both towers', text: 'Water plus Plant Food per gallon. With both water-level sensors gone, check the level by eye or a dipstick; Gardyn\u2019s cucumber guide says keep it above 60%.' },
  { id: 'hb-fruit', title: 'HydroBoost', every: 7, where: 'Fruiting tower', text: 'Weekly, up to every 3 days with big fruiting plants. Per full Tank: 2 tsp standard water, 4 tsp hard, 1 tsp filtered or naturally soft. Never with softened water.' },
  { id: 'hb-salad', title: 'HydroBoost', every: 7, where: 'Salad tower', text: 'Weekly, with the Tank Top-off or Tank Refresh. It keeps algae, biofilm and salt crust down; it doesn’t remove growth that’s already there.' },
  { id: 'refresh-fruit', title: 'Tank Refresh', every: 14, where: 'Fruiting tower', text: 'Every two weeks while the strawberries are active. Baking soda and a soft sponge; no soap. Never lift a full Tank.' },
  { id: 'refresh-salad', title: 'Tank Refresh', every: 30, where: 'Salad tower', text: 'Gardyn’s minimum is monthly; HydroBoost in between keeps the Columns clean.' },
  { id: 'straw-roots', title: 'Strawberry root prune', every: 14, where: 'Fruiting tower', text: 'Twice a month: brown, black or slimy roots, and anything past the yPod. Feel every crown while you’re there.' },
  { id: 'roots', title: 'Root check, everyone else', every: 30, where: 'Both towers', text: 'Trim brown roots and anything past the yPod. Mints and tomatoes first; nasturtium wants it twice a month. Tomatoes skip it until about Nov 27, a month after the cleanout.' },
  { id: 'debris', title: 'Debris out', every: 7, where: 'Both towers', text: 'Dead leaves, spent flower stalks, runner stubs, any berry resting on the wool. The trimmings tub leaves the room.' },
  { id: 'tomato', title: 'Tomato suckers and belts', every: 7, where: 'Fruiting tower', text: 'Suckers off, vines belted down the light bars, top each plant at its last good cluster.' },
  { id: 'runners', title: 'Strawberry runners', every: 7, where: 'Fruiting tower', text: 'Cut them; if you want clones, root one or two into a yPod first with the crown above the cube.' },
  { id: 'pollinate', title: 'Pollinate', every: 3, where: 'Fruiting tower', text: 'Swirl strawberry flowers 2–3 times; shake the TAM and the tomatoes; later, beans and cucamelon by hand.' },
  { id: 'light-clean', title: 'Light Cleaning', every: 90, where: 'Both towers', text: 'About four times a year with citric acid, or skip it with regular HydroBoost. Plants come out of the Columns first.' }
],
campaigns: [
  { id: 'gnats', title: 'Gnat campaign', weeks: 3, text: 'Larvae take about three weeks to become adults, so it’s three weekly rounds: soak 4 tablespoons of Mosquito Bits (BTi) in a gallon of water for 30 minutes, skim the granules, and drench the rockwool tops. Yellow sticky cards catch the adults and double as a counter: when the catch stops climbing, the cycle is broken.' },
  { id: 'humidifier', title: 'Humidifier off', weeks: 3, text: 'Off for three weeks so the strawberry tier dries. Then reassess with a separate hygrometer at strawberry height: about 60% if it comes back, aimed into the room, distilled water.' }
],

/* ---------- Fixes ---------- */
fixes: [
  { id: 'crowns', title: 'Strawberry crowns', sub: 'Green film, fuzz, gnats, a wilting plant', body: `
<h4>Feel the crown first</h4>
<ul><li><b>Firm, with green film or fuzz on the surface:</b> save it.</li><li><b>Soft, mushy, brown or black, or sour-smelling:</b> rot is inside. Pull it so it doesn't spread.</li><li><b>Wilting with gnats around it:</b> check its roots in the yPod. Brown, slimy or sour means it comes out and takes its gnat nursery with it.</li></ul>
<h4>Why peroxide can't win alone</h4>
<p>The Column stream refills every cube to the top several times a day, rockwool holds water right to its surface, and the lights land on it. Algae regrows in days and feeds the gnat larvae. The fix is geometry and light.</p>
<h4>The plan</h4>
<ol><li><b>Lift each crown</b> clear of the wool: tease or cut it back 5–10 mm around the crown. The roots keep their water.</li><li><b>Darken the wool:</b> a yCover with the slit held open around the crown, a printed standoff cover, or a foil tent.</li><li><b>Fans</b> across the strawberry tier, low and steady.</li><li><b>Debris out weekly.</b></li><li><b>Humidifier off for three weeks.</b></li><li><b>Gnats:</b> the three-week BTi campaign, plus sticky cards.</li></ol>
<h4>Foil tent rules</h4>
<ul><li>Tent it, don't wrap it: a low dome with a finger-width gap all around the crown, never touching it.</li><li>Crimp the edge under the yCube's flange so the fans don't lift it; slope it so splash runs off.</li><li>Cube top only. Keep it out of the yPod and the Tank; swap any piece that goes dull and crumbly.</li><li>Dull side out if Kelby's photos start looking blown out.</li></ul>
<h4>Peroxide's job now</h4>
<p>A spot treatment for actual fuzz on a firm crown: 1 part 3% peroxide to 3 parts water, lights off. Not the weekly bath, and never in place of HydroBoost.</p>` },
  { id: 'algae', title: 'Algae or mold?', sub: 'How to tell, and why the fix is the same', body: `
<ul><li><b>Algae:</b> a flat, slick, even green film with no height, only where light reaches wet medium. Wipes off as a green smear. Harmless to the plant itself, but it feeds fungus gnats.</li><li><b>Mold:</b> raised, fuzzy or cottony, white to grey. Grows on dead leaf and flower bits and on the crown, light or no light. In the crown, tissue pulls away easily, and that's rot.</li></ul>
<p>Both start on a wet surface. Dry it, darken it, lift the crown out of it, and keep the air moving.</p>` },
  { id: 'yellow', title: 'Yellow or crispy leaves', sub: 'Read the pattern before treating', body: `
<ul><li><b>Older leaves fading, new ones green:</b> the plant is moving food into its pods, or the Tank drifted. Judge any fix by new growth; crispy tissue never recovers.</li><li><b>New leaves coming in yellow with green veins:</b> something the plant can't move around, like iron. Often a pH timing issue.</li><li><b>A stem dying from the tip:</b> something local, like mist landing on it, damage, or roots.</li><li><b>Several crops at once:</b> look at the Tank, not a disease. Yellow between the veins on older tomato leaves is the classic short-on-magnesium look.</li></ul>
<h4>Salt-sensitive first</h4>
<p>Beans and strawberries are rated "sensitive" on crop salt charts; tomatoes, cucumbers and peppers "moderately sensitive." In a shared Tank, beans and strawberries warn you first.</p>
<h4>Checks, in order</h4>
<ol><li>Roots.</li><li>Spider mite tap test.</li><li>Nothing misting or blowing onto the leaves.</li><li>Snip yellow and brown leaves.</li><li>Pick beans before they get fat.</li><li>Water: no softened water. CAL-MAG (1 teaspoon per gallon, weekly) only if the well test says your water is soft.</li></ol>` },
  { id: 'mites', title: 'Spider mites', sub: 'The tap test and Gardyn’s soap dunk', body: `
<p><b>Tap test:</b> hold white paper under a leaf and tap. Specks that start walking are mites. Also look for pale pin-dot speckling on top and fine webbing underneath. Dry, dusty air favors them.</p>
<h4>Castile Soap Dunk</h4>
<ul><li>2½ tablespoons of Castile soap per gallon of warm (not hot) water; mix four gallons so big plants fit.</li><li>One plant at a time, dunk up to the rockwool (never into it or the roots) and shake it under water.</li><li>Lights off for four hours while the soap dries. Wait 24 hours before harvesting, and rinse before eating.</li></ul>
<ul><li><b>Light:</b> rinse, then dunk every 4–5 days, at least four times.</li><li><b>Moderate:</b> remove the most susceptible plants, trim the worst leaves, rinse, at least six dunks.</li><li><b>Severe:</b> throw out the worst, trim the rest, at least four dunks.</li></ul>` },
  { id: 'pests', title: 'Who gets which pest', sub: 'Gardyn’s plant-by-plant list', body: `
<ul><li><b>Aphids:</b> dill, Flashy Trout Back, the TAM, green beans, arugula, cilantro. Nasturtium is the early-warning plant.</li><li><b>Thrips:</b> red sorrel, cucumbers, chervil, and the ground cherry's cousin.</li><li><b>Spider mites:</b> both mints, strawberries, green beans, watercress.</li><li><b>Fungus gnats:</b> wet, lit rockwool, mostly around the strawberry crowns.</li></ul>
<p>Check leaf undersides when you prune. Gardyn's pest pages have the treatments: <a href="https://help.mygardyn.com/en/articles/1779329" target="_blank" rel="noopener">identifying pests</a>, <a href="https://help.mygardyn.com/en/categories/457537" target="_blank" rel="noopener">prevention and treatment</a>.</p>` },
  { id: 'air', title: 'Humidifier and fans', sub: 'Air for the strawberry tier', body: `
<h4>Fans</h4>
<p>Two small fans at the base, low or medium: steady air across the strawberry tier that flutters the leaves, never blowing mist onto the tower.</p>
<h4>Humidifier (the Nov 2 advice: off for three weeks)</h4>
<ul><li>Low and a few feet from the tower, nozzle into open air. The mist should vanish before it reaches a leaf; never at the crowns.</li><li>About 60% at strawberry height, the low end of Gardyn's 60–75% for strawberries. Read it with a separate hygrometer at plant level; the humidifier's own reading sits in its mist.</li><li>On while the lights are on; let the room dry a bit at night.</li><li>Distilled water. Cool-mist units throw tap-water minerals into the air; white dust on dark surfaces means it's happening.</li><li>Watch windows for condensation. The EPA's comfort guidance for the house itself is 50% or less.</li></ul>
<p>If the hygrometer reads about 60% and new strawberry leaves still brown at the edges, look at the Tank, not the air.</p>` },
  { id: 'clean', title: 'Cleaning', sub: 'Which cleaner for which grime', body: `
<ul><li><b>Green, brown or slimy</b> (algae, biofilm, root bits) is organic: OxiClean Free off the unit, or Gardyn's citric soak and a brush.</li><li><b>White and crusty</b> is mineral: citric acid. OxiClean won't touch it.</li></ul>
<h4>Gardyn's methods</h4>
<ul><li><b>Tank Refresh:</b> top half on a towel; Tank cleaned with water, a soft sponge and a sprinkle of baking soda.</li><li><b>Light or Deep Cleaning:</b> plants out of the Columns first. At least 3 gallons in the Tank, 1 cup citric acid dissolved in 2 cups water, run a watering cycle; spray inside the Columns (2 tablespoons per 2 cups), brush the slots, cycle again, drain, rinse cycle.</li><li><b>yPods and Caps:</b> soak in 2 tablespoons citric acid per 2 cups water, 15 minutes to overnight.</li></ul>
<h4>OxiClean rules</h4>
<ul><li>OxiClean Free only, and never with plants on the unit or through the Columns.</li><li>Not a Tank additive: it adds sodium and raises pH.</li><li>Off the wood; don't soak the metal light bars.</li><li>Never in a capped container (pressure builds), never mixed with citric acid. Gloves.</li></ul>` },
  { id: 'water', title: 'Water', sub: 'The well, softeners, CAL-MAG', body: `
<ul><li><b>Well test:</b> sodium and chloride (saltwater intrusion), arsenic (Maine bedrock), bacteria, and baseline minerals.</li><li><b>Never softened water:</b> softener salt builds sodium in the Tank, and beans and strawberries feel it first.</li><li><b>CAL-MAG</b> is for naturally soft, filtered or distilled water: 1 teaspoon per gallon, once a week, straight into the Tank. Hold it until the test says soft.</li><li><b>HydroBoost dose</b> follows the water type: 2 teaspoons per full Tank standard, 4 hard, 1 soft or filtered.</li><li><b>Distilled</b> water in the humidifier.</li></ul>` }
],

/* ---------- Ideas ---------- */
gear: [
  { title: 'A separate hygrometer', why: 'Read humidity at strawberry height; the humidifier’s own number sits inside its mist.' },
  { title: 'Yellow sticky cards and Mosquito Bits', why: 'The gnat campaign: cards for adults and as a counter, BTi for the larvae in the wool.' },
  { title: 'Plant Belts and the Trellis', why: 'Beans, cucamelon, ground cherry and both tomatoes all want them this winter.' },
  { title: 'A shallow tray', why: 'Under the ground cherry at fruiting row 6 left; ripe fruit drops.' },
  { title: 'An EC pen', why: 'Optional. Ohio State’s strawberry root-zone ceiling is 1.2 dS/m; useful if beans and strawberries keep warning you about salt.' },
  { title: 'Castile soap and a 4-gallon bucket', why: 'Gardyn’s Soap Dunk, ready before mites show up.' },
  { title: 'Citric acid and OxiClean Free', why: 'Mineral crust and organic slime, respectively.' },
  { title: 'Distilled water', why: 'For the humidifier when it comes back.' },
  { title: 'Digital calipers', why: 'Step one of the printed pod: measure a real yCube and yPod.' }
],
questions: [
  { q: 'Which side of the salad tower faces the window?', a: 'The maps assume the right. If it’s the left, the outer columns swap so the light-hungry plants stay on the window side.' },
  { q: 'Where did strawberries 7–11 come from?', a: 'Rooted runners or new bare roots? It changes how much they’ll lean on the Tank.' },
  { q: 'Two yellow cherry tomatoes, or one, at the next replant?', a: 'Two vines claim the outer pods of rows 3–6: four stay open as canopy and root zone, and the rest can only take hardy plants like the TAM and the ground cherry. One tomato, trained down the right bar, frees left rows 3 and 5 (both high light) for peppers and a second bean lane.' },
  { q: 'Seat for the strawberry pod trial?', a: 'The first weak strawberry’s pod, once it comes out. Right row 6 is open, but it’s an outer pod under Tomato #2, which the salt rule keeps clear of strawberries.' },
  { q: 'Well-water results', a: 'Sodium and chloride decide CAL-MAG and how hard to push Plant Food on the salt-sensitive crops.' }
],
watch: [
  { title: 'Maygrove AI Growbot Verti 30', text: 'The Gardyn look-alike on Kickstarter: auto-dosing, a fan, a 7-gallon tank, no subscription, shipping December 2026. No independent reviews yet, and its light is lettuce-grade for tomatoes and peppers. Not a reason to replace the v3s; revisit when real growers post results, probably early 2027.' },
  { title: 'A printer for the pods', text: 'Recommended Nov 2: the Bambu Lab A1 mini. Its bed is far bigger than a 51 mm pod, the textured plate suits PETG, and it opens MakerWorld files directly. It was $199 in Bambu’s sale running through Dec 1; check the store for today’s price. The full-size A1 if you’ll print bigger things.' }
],

/* ---------- DIY: beyond the yCube ---------- */
trail: [
  { id: 'printer', title: 'Get a printer', when: 'Before you start', body: `<p>The Nov 2 pick was the <b>Bambu Lab A1 mini</b>: plenty of bed for a 51 mm pod, a textured plate that suits PETG, easy setup, and MakerWorld built in (where the starting model lives). It was $199 in Bambu's sale through Dec 1. The full-size A1 if you expect bigger prints.</p>` },
  { id: 'measure', title: 'Measure a yCube and a yPod', when: 'Week 1', body: `<p>Gardyn publishes no dimensions, so caliper the real parts before changing any numbers in a model:</p><ul><li><b>yCube casing:</b> flange diameter and thickness, mouth across the flats, foot across the flats, overall height, slot width, floor hole, corner-rib span.</li><li><b>yPod:</b> rim inside diameter, bore below the rim, depth, how far the front cut-out sits below the rim, and the standing-water level after a cycle (dip a skewer).</li></ul>` },
  { id: 'print', title: 'Print and bench-test', when: 'Weeks 1–2', body: `<p>Start from jhalye's <b>Gardyn yCube Cup</b>; the designer says it fits exactly and prints without supports. Keep the 51 mm flange, square mouth and 46 mm height so yCovers, Caps and the Nursery tray still fit.</p><ul><li>Print four plug pods and two strawberry pods in opaque PETG.</li><li>Check the fit in a yPod, under a yCover, and in the Nursery tray.</li><li>Put an empty pod in a yPod and run a manual watering cycle (it stops itself after 15 minutes). Watch where the stream lands; the strawberry collar must stand above the splash.</li></ul>` },
  { id: 'salad', title: 'Salad trial', when: 'Weeks 2–6', body: `<p>Your next duplicate goes into a printed pod with a Rapid Rooter plug instead of an old yPod with fresh rockwool. Sow it in the Nursery by the Soak Method with the base drained, and move it at true leaves and ½-inch roots as usual.</p><p>Watch for wilting between watering cycles in the first two weeks. If it wilts, the plug isn't reaching the stream: add a wick or use a taller plug.</p>` },
  { id: 'berry', title: 'Strawberry trial', when: 'Weeks 2–8', body: `<p>Root two runners into the two strawberry pods: rinsed clay pebbles, the crown held by a collar so its middle sits 10–15 mm above the pebbles, an opaque standoff cover, and a polyester wick to the yPod chamber for the first weeks. Check daily for wilting.</p><p>This design is reasoned from the research, not tested in a Gardyn. That's why it's two runners and not your established plants.</p>` },
  { id: 'switch', title: 'Switch over', when: 'After 4–6 good weeks', body: `<p>When the trial plants have gone four to six weeks with firm crowns, dry pebble tops and roots visible in the yPod chamber, move the established plants. Stop buying Seedless yCubes; keep buying seeded ones only for Gardyn-only varieties like the cucumber, plus Plant Food, HydroBoost and CAL-MAG as the water test says.</p>` }
],
fill: [
  { crop: 'Salad greens and herbs', fill: 'Rapid Rooter bonded bark plug', cost: '$0.21', note: 'Home-compostable, kept moist but not soaked by design. Budget option on this tower only: Jiffy-7C buffered coir at $0.06.' },
  { crop: 'Tomatoes and cucumbers', fill: 'Rapid Rooter in the same pod', cost: '$0.21', note: 'After the first month the root mat carries the plant; the pod’s job is grip. Gardyn’s cucumber only comes as a seeded yCube.' },
  { crop: 'Bush beans', fill: 'The deepest bonded plug', cost: '$0.06–0.32', note: 'Root Riot (1½ in), Q-Plug 40/40, or Jiffy-7C (45 mm wet), seed an inch down. Not pebbles: a bean seed would sit in air.' },
  { crop: 'Strawberries', fill: 'Rinsed clay pebbles, crown raised on a collar', cost: '≈$0.05, reused', note: 'Trial on two pods first. Fallback: a Rapid Rooter plug with the crown still lifted. No coir on the fruiting tower: it leaks sodium and potassium.' }
],
media: [
  { name: 'Rockwool (yCube)', water: '60–85%', top: 'Wet to the top', note: 'Fastest germination; algae-prone; never composts.', cost: '$0.13–0.16 a plug' },
  { name: 'Phenolic foam', water: '80–86%', top: 'Wet to the top', note: 'Clean, but petroleum-based and not compostable.', cost: '$0.06–0.12' },
  { name: 'Buffered coir (Jiffy-7C)', water: '73–79%', top: 'Wet to the top', note: 'Releases sodium and potassium unless washed and buffered.', cost: '$0.06–0.27' },
  { name: 'Peat pellet', water: '≈70%', top: 'Wet to the top', note: 'Gnats love peat.', cost: '$0.07–0.12' },
  { name: 'Bonded bark (Rapid Rooter)', water: 'Peat class', top: 'Drier by design', note: 'Low crumbs, home-compostable.', cost: '$0.21–0.23' },
  { name: 'Clay pebbles (Hydroton)', water: '21–35% by weight', top: 'Dries between cycles', note: 'Reusable forever after a rinse; a seed sits in air.', cost: '≈$0.05 once' },
  { name: 'Perlite, vermiculite, rice hulls', water: 'Varies', top: '—', note: 'Ruled out: they float and shed fines that clog the lines.', cost: '—' }
],
brief: [
  ['Flange', '51 mm round, 1.5–2 mm thick, chamfered underneath so it sits level in the yPod'],
  ['Mouth', 'Square, 33–34 mm across the flats, so yCovers and Caps still fit'],
  ['Body', 'Square, tapering from about 34 to 30 mm, with the original’s corner clips; about 45 mL inside'],
  ['Height', '46 mm and never taller downward: the floor has to stay above the yPod’s standing water'],
  ['Floor', 'A 4 mm center hole plus a 3 mm grid, stiffened by a diagonal rib'],
  ['Side slots', '2.5–3 mm wide between slats at least 2 mm wide, full height, chamfered tops'],
  ['Walls', '3 solid perimeters (about 1.35 mm), no sparse infill; 4–5 at the flange'],
  ['Print', '0.4 mm nozzle, 0.16–0.20 mm layers, PETG at 240–250 °C, 102–105% flow, open end up with a small brim. No annealing, no sealer'],
  ['Strawberry version', 'A collar 12–15 mm above the flange, 20–25 mm inside, holding the crown 10–15 mm above the pebbles; vent slots; a wick slot in the floor'],
  ['Standoff cover', 'An opaque disc on three legs, 5–8 mm above the medium, with a stem slot and an air gap'],
  ['Material', 'Opaque PETG only (black blocks light best, white is easiest to inspect). Not PLA, not translucent, silk, glitter, wood or metal-filled'],
  ['Each pod', '12–18 g, 45–75 minutes, $0.17–0.36 of filament; 70 pods is about a kilogram']
],
cleanPods: `<ul><li>Knock out roots and medium.</li><li>Gardyn's citric soak (2 tablespoons per 2 cups water) at room temperature, 15 minutes to overnight; bottle-brush the slots.</li><li>OxiClean Free is fine if the water is warm, not hot (under about 105°F), at the line-2 dose for 1–2 hours, followed by a rinse and a short citric rinse.</li><li>No dishwasher: PETG starts to soften around 160°F (70°C).</li><li>Pebbles: rinse, soak 24 hours in 3% peroxide, rinse, dry.</li></ul>`,
models: [
  ['Gardyn yCube Cup (jhalye)', 'https://makerworld.com/en/models/1134849-gardyn-ycube-cup', 'The starting model'],
  ['Gardyn yCube Cap (jhalye)', 'https://makerworld.com/en/models/1138174-gardyn-ycube-cap', 'Seats in the same mouth'],
  ['Gardyn Y-Cube (slimicus)', 'https://cults3d.com/en/3d-model/tool/gardyn-y-cube', 'Second reference: 51.43 × 51.43 × 44.67 mm'],
  ['Gridfinity Nursery (jonnydev13)', 'https://makerworld.com/en/models/1541873', 'A Nursery tray and a 51.6 mm top adapter'],
  ['Double Split yPod (ProjectSkyDroid)', 'https://makerworld.com/en/models/82032-gardyn-double-split-ypod', 'Source of the yPod bore estimate']
],
shop: [
  ['Rapid Rooter plugs, 100', 'https://hydrobuilder.com/products/general-hydroponics-rapid-rooter-plugs', '$21.42 on Oct 30'],
  ['Hydroton clay pebbles, 10 L', 'https://monstergardens.com/products/mother-earth-hydroton-8-16mm-10-liters', '$12.05 on Oct 30'],
  ['Prusament PETG (food-contact colors)', 'https://blog.prusa3d.com/how-to-make-food-grade-3d-printed-models_40666/', 'Jet Black, Signal White, Urban Grey, Galaxy Black, Terracotta Light'],
  ['Bambu filament', 'https://us.store.bambulab.com/collections/bambu-lab-3d-printer-filament', 'PETG HF from $19.99/kg on Oct 30']
],
bench: [
  { title: 'Water-level alarm', text: 'Both units’ level sensors are gone. Three ways around it: ask Gardyn support (support@mygardyn.com) for a replacement part; a printed dipstick marked at full and at the Tank Top-off line; or a printed float read by a reed switch outside the Tank, wired to a small microcontroller that beeps or pings your phone. The two printed ones are under Worth printing.' },
  { title: 'QR tags for the yPods', text: 'A small printed tag on each yPod whose QR code opens that seat in this app. The link is the app’s address plus #seat- and the seat, like hectrvictorious.github.io/Gardyn-Plant-Book/#seat-S9R for the borage (S for salad, F for fruiting, then row and column). Every seat page has a Copy link button, and the printable sheet below has a code for all 60 seats.' }
],
why: [
  ['Wet to the top', 'Every plug medium Gardyn’s cascade was built around (rockwool, foam, coir, peat) holds 60–86% water right to its surface. A crown resting on it is rewetted at every watering cycle. Coarse pebbles hold 21–35% and dry on top between cycles.'],
  ['Algae, then gnats', 'A wet, lit surface grows algae; algae feeds gnat larvae; a wet crown with dead bits on it grows mold. Dry, dark and lifted fixes all three.'],
  ['Rockwool and the planet', '“Can’t be composted” is right. “Bad for the environment” is overstated: a plug is a few grams of carbon, non-hazardous, and Gardyn and Grodan both say it can go into garden soil. Its usual fate is still the landfill.'],
  ['Money', 'Two towers at two rotations a year use about 120 yCubes: roughly $400–720 a year. Printed pods and plugs run about $20–35 a year after a one-time $20 of filament.']
]
};
