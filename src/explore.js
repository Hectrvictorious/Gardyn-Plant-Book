/* Explore: the plant scout, the Forbidden Shelf, the Plant Doctor and the Greener page.
   Gardyn facts paraphrase Gardyn's Help Center plant articles (linked on each entry); pet safety is the ASPCA's list.
   Scout plants are ideas only: nothing here changes a map. */
(function () {
const P = window.PB;
const GH = id => 'https://help.mygardyn.com/en/articles/' + id;
const ASPCA = 'https://www.aspca.org/pet-care/aspca-poison-control/toxic-and-non-toxic-plants/';
const ASPCA_CATS = 'https://www.aspca.org/pet-care/animal-poison-control/cats-plant-list';

/* ---------- Plant scout ---------- */
const S = (id, o) => { P.plants[id] = Object.assign({ status: 'idea', scout: true, tags: [] }, o); };

S('tokyo-bekana', { name: 'Tokyo Bekana', latin: 'Brassica rapa var. chinensis', group: 'greens', glyph: 'frill', tint: 'lime', fit: ['salad'],
  gb: { sprout: '7–14', mature: '45–55', zone: 'high', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube' },
  about: 'Frilly, lime-green leaves ruffled at the edges. It looks and eats like a mild, delicate lettuce, but grows faster and doesn’t turn bitter in heat. High in fiber and vitamins A, C and K.',
  origin: 'A descendant of Chinese loose-heading cabbage that reached Japan with soldiers coming home from war. It matures so fast and takes heat so well that the International Space Station tested it: “space cabbage.”',
  harvest: ['Snip outer leaves at 4 inches, just above the base, and leave about a third of the plant so it keeps growing.', 'Or let it mature and cut the whole head at the base.'],
  care: ['Monthly root check: trim brown roots and any growing past the yPod.', 'Remove yellow or brown leaves as they appear.'],
  why: 'A lettuce stand-in that holds up when the tower runs warm: mild, crunchy and quick, for a high-light seat where lettuce would bolt.',
  src: [['Gardyn Help: Tokyo Bekana', GH(1795969)]],
  flav: { flavor: ['mild', 'sweet'], w: { sweet: 1, cool: 2 }, texture: ['crunchy', 'frilly'], roles: ['base', 'crunch'], eat: 'Raw in salads and slaws, as a lettuce wrap, or quick-cooked in a stir-fry.', pairs: ['red-tatsoi', 'cucumber', 'green-salanova'], kitchen: 'Slaws, lettuce wraps, a sesame-ginger dressing.' } });

S('hon-tsai-tai', { name: 'Hon Tsai Tai', latin: 'Brassica rapa', group: 'greens', glyph: 'broccoli', tint: 'purple', fit: ['salad'],
  gb: { sprout: '7–14', mature: '40–50', zone: 'medium', size: '1 ft', care: 'Intermediate', thin: '1 per yCube' },
  about: 'Purple stems, dark green leaves and yellow flowers, and every part is edible. It’s like broccoli rabe, but sweeter and more delicate. Also called purple choy sum or flowering broccoli.',
  origin: 'A descendant of Chinese flowering cabbage, close kin to yu choy.',
  harvest: ['Leaves: cut the outer ones at about 4 inches, just above the base, leaving a third of the plant.', 'Flower stems: pick at 8–10 inches as the flowers just open. They should snap; if they won’t, they’re overgrown and fibrous.'],
  care: ['Monthly root check.', 'Needs little pruning if you harvest regularly.'],
  why: 'Color and crunch from one yCube: purple stems that snap, sweet flower shoots, and leaves for the bowl.',
  src: [['Gardyn Help: Hon Tsai Tai', GH(1796929)]],
  flav: { flavor: ['sweet', 'mild mustard'], w: { sweet: 1, pepper: 1, earthy: 1 }, texture: ['snappy stems', 'tender leaves'], roles: ['crunch', 'color'], eat: 'Raw or cooked: salads, stir-fries, pasta.', pairs: ['green-tatsoi', 'red-sorrel', 'romaine'], kitchen: 'A hot pan with garlic and chili flakes; sesame-ginger dressing.', warn: ['Flower stems that won’t snap are overgrown and fibrous.'] } });

S('rouge-dhiver', { name: 'Rouge d’Hiver', latin: 'Lactuca sativa', group: 'greens', glyph: 'cos', tint: 'red', fit: ['salad'],
  gb: { sprout: '7–14', mature: '30–50', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '1 per yCube' },
  about: 'Red-tinted, delicate, buttery leaves with a rich flavor. Big mature leaves make lettuce wraps.',
  origin: 'A French romaine heirloom from the 1800s, named “red of winter” for its cold tolerance.',
  harvest: ['Snip outer leaves at 4 inches, leaving a third of the plant.', 'Or cut the whole head at maturity.'],
  care: ['Keep it cool, 60–70°F: heat turns it bitter and makes it bolt.'],
  why: 'A red romaine that eats like your butterhead: buttery rather than crunchy, with color.',
  src: [['Gardyn Help: Rouge d’Hiver', GH(1798401)]],
  flav: { flavor: ['rich', 'buttery'], w: { sweet: 1, cool: 1 }, texture: ['buttery', 'delicate'], roles: ['base', 'color'], eat: 'Raw: salads, sandwiches, wraps.', pairs: ['butterhead', 'red-sorrel', 'borage'], kitchen: 'Wraps, sandwiches, a Caesar with color.', warn: ['Turns bitter once it starts to bolt.'] } });

S('red-amaranth', { name: 'Red Amaranth', latin: 'Amaranthus cruentus', group: 'greens', glyph: 'leaf', tint: 'beet', fit: ['salad'],
  gb: { sprout: '7–10', mature: '100–120', zone: 'medium', size: 'Under 2 ft', care: 'Moderate', thin: '1 per yCube' },
  about: 'Tender leaves with a rich, earthy, grassy taste, eaten raw or cooked like spinach. The flowers are decorative, and the grain they make is nutty.',
  origin: 'Native to Central and South America; sometimes called Chinese spinach.',
  harvest: ['Pick younger leaves for eating raw, and leave a third of the plant.', 'For grain, wait until the flowers turn brown.'],
  care: ['Plant Belts as it grows tall.', 'Thrips are common: harvest often and leave room for air.'],
  why: 'Magenta leaves like the Bull’s Blood, but grassier: a colored base green that likes warmth.',
  src: [['Gardyn Help: Red Amaranth', GH(1797761)]],
  flav: { flavor: ['earthy', 'grassy'], w: { earthy: 2, sweet: 1 }, texture: ['tender'], roles: ['color', 'base'], eat: 'Young leaves raw; older ones cooked like spinach.', pairs: ['yellow-cherry-tomato', 'purslane', 'green-tatsoi'], kitchen: 'Stir-fries, soups, a warm wilted salad.' } });

S('italian-parsley', { name: 'Italian Parsley', latin: 'Petroselinum crispum', group: 'herbs', glyph: 'sprig', tint: 'leaf', fit: ['salad', 'herb'],
  gb: { sprout: '10–30', mature: '70–90', zone: 'medium', size: '1 ft', care: 'Intermediate', thin: '3 per yCube' },
  about: 'Bright, flat leaves. Gardyn notes it’s usually dried into Italian herb mixes with rosemary, thyme and oregano, or added fresh at the end of cooking.',
  origin: 'The ancient Greeks and Romans grew it first as a medicine; the kitchen came later.',
  harvest: ['Harvest often: pinch leaves or cut stems above a growth node.', 'From 6 inches, trim the larger outer leaves, never more than a third of the plant at a time.'],
  care: ['Keep it cooler, about 60–70°F, and remove leaves with brown spots.', 'Slow to sprout: 10–30 days.', 'Monthly root check.'],
  why: 'The backbone herb of a salad, and one of the seven Frankfurt green-sauce herbs. You already grow three of the seven.',
  src: [['Gardyn Help: Italian Parsley', GH(1784321)]],
  flav: { flavor: ['fresh', 'grassy', 'peppery'], w: { herbal: 2, cool: 1 }, texture: ['flat leaves'], roles: ['herb'], eat: 'Raw and chopped into almost anything; added last when cooking.', pairs: ['red-sorrel', 'salad-burnet', 'cucumber', 'yellow-cherry-tomato'], kitchen: 'Tabbouleh, chimichurri, gremolata, green sauce.' } });

S('shiso', { name: 'Shiso', latin: 'Perilla frutescens', group: 'herbs', glyph: 'mint', tint: 'leaf', fit: ['salad', 'herb'],
  gb: { sprout: '7–14', mature: '50–60', zone: 'medium', size: '1 ft', care: 'Intermediate', thin: '3 per yCube' },
  about: 'Broad, tender leaves with a bold, complex flavor: warm, savory notes of cumin, black pepper and nutmeg, with lighter hints of mint and anise. It grows like basil and likes it warm.',
  origin: 'A mint-family herb from China and India, long used in Chinese herbal medicine and loved in Japanese cooking.',
  harvest: ['Harvest often, leaving about a third of the leaves.', 'Pinch the main growing tip of each stem for a bushier plant, and pinch flower buds to delay bolting.'],
  care: ['Remove leaves with brown spots.', 'Monthly root check.'],
  why: 'You’ve met it as a microgreen. The full plant gives big leaves to wrap rice or fish, and shiso with cucumber is a classic.',
  src: [['Gardyn Help: Shiso', GH(1785025)]],
  flav: { flavor: ['minty', 'anise', 'savory'], w: { herbal: 3, earthy: 1 }, texture: ['broad, tender'], roles: ['herb'], eat: 'Fresh, a little at a time, in place of basil or mint.', pairs: ['cucumber', 'cucamelon', 'red-sorrel'], kitchen: 'Sushi rice, noodles, grilled fish, torn over cucumbers.', warn: ['Strong: a little goes a long way.'], flag: 'strong' } });

S('lime-basil', { name: 'Lime Basil', latin: 'Ocimum americanum', group: 'herbs', glyph: 'mint', tint: 'lime', fit: ['salad', 'herb'],
  gb: { sprout: '7–21', mature: '55–65', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '3 per yCube' },
  about: 'Smooth green leaves with a bright citrus scent and a peppery-lime flavor from citral. The small white flowers are edible.',
  origin: 'An heirloom mint-family herb from tropical Africa and Southeast Asia that reached the Americas in the 1700s.',
  harvest: ['Pinch leaves, or cut stems just above a growth node, for a bushier plant.', 'Pinch flower buds as they appear to delay bolting.'],
  care: ['Remove leaves with brown spots; monthly root check.', 'Aphids are its common pest.'],
  why: 'Strawberries, basil and balsamic is a classic, and the lime version brightens the yellow tomatoes too.',
  src: [['Gardyn Help: Lime Basil', GH(1783681)]],
  flav: { flavor: ['lime', 'peppery', 'sweet'], w: { herbal: 2, tang: 1, sweet: 1 }, texture: ['smooth'], roles: ['herb'], eat: 'Fresh: torn, muddled or whole.', pairs: ['strawberry', 'yellow-cherry-tomato', 'cucumber'], kitchen: 'Seafood, rice and noodle dishes, fruit salads, drinks.' } });

S('thai-basil', { name: 'Sweet Thai Basil', latin: 'Ocimum basilicum var. thyrsiflora', group: 'herbs', glyph: 'mint', tint: 'purple', fit: ['salad', 'herb'],
  gb: { sprout: '5–10', mature: '64', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '3 per yCube' },
  about: 'A spicy, anise-like flavor with a hint of clove. The flowers are edible.',
  origin: 'Native to Southeast Asia and grown there for more than 5,000 years.',
  harvest: ['Harvest often: cut stems ¼–½ inch above a growth node, leaving 4–6 inches so it keeps growing.', 'Pinch flower buds as they appear.'],
  care: ['Keep it warm, ideally 70–85°F.', 'Remove leaves with brown spots.'],
  why: 'The licorice-pepper herb for pho and noodles, and a natural partner for the TAM’s heat.',
  src: [['Gardyn Help: Sweet Thai Basil', GH(1785089)]],
  flav: { flavor: ['anise', 'spicy', 'clove'], w: { herbal: 3, pepper: 1 }, texture: ['tender'], roles: ['herb'], eat: 'Fresh, torn into hot food at the end.', pairs: ['tam-jalapeno', 'cucumber', 'mint'], kitchen: 'Pho, noodles, rice dishes, green curry.' } });

S('chives', { name: 'Chives', latin: 'Allium schoenoprasum', group: 'herbs', glyph: 'blades', tint: 'leaf', fit: ['salad', 'herb', 'regrows'],
  gb: { sprout: '7–21', mature: '75–85', zone: 'low', size: '1 ft', care: 'Intermediate', thin: 'Do not thin' },
  about: 'A mild oniony taste for nearly any dish, best fresh. The flowers are edible too.',
  origin: 'Native to Asia and Europe; the botanical name comes from a Greek phrase meaning “reed-like leek.”',
  harvest: ['Let leaves reach at least 4 inches, then cut back to 1–2 inches above the base.', 'Cut flowering stalks as they appear to delay bolting.'],
  care: ['Monthly root check.', 'Thrips are its common pest. Store cut chives loosely wrapped in a paper towel in the fridge.'],
  why: 'A low-light regrower for row 1 or row 10, and another of the Frankfurt green-sauce seven. The milder cousin of the garlic chives you retired.',
  src: [['Gardyn Help: Chives', GH(1784193)]],
  flav: { flavor: ['mild onion'], w: { herbal: 1, pepper: 1 }, texture: ['hollow, tender'], roles: ['herb'], eat: 'Snipped fresh over anything.', pairs: ['butterhead', 'dill', 'cucumber'], kitchen: 'Eggs, cream soups, potato salad, seafood; the flowers in vinegar.' } });

S('bunching-onions', { name: 'Bunching Onions', latin: 'Allium fistulosum', group: 'herbs', glyph: 'blades', tint: 'lime', fit: ['salad', 'herb', 'regrows'],
  gb: { sprout: '7–21', mature: '60', zone: 'low', size: '1 ft', care: 'Intermediate', thin: '3 per yCube' },
  about: 'Green onions with a deep purple-red base and the flavor of their bulbing cousins. Also called scallions, spring onions or Welsh onions.',
  origin: 'Thought to have come from China.',
  harvest: ['Cut at 6–8 inches, about 2 inches above the base.', 'They grow back in 1–2 weeks.'],
  care: ['Slow to sprout: keep them at 65–70°F and expect 21 days or more.', 'Monthly root check.'],
  why: 'Scallions on a loop: cut them and they’re back in a week or two, so one yCube keeps giving.',
  src: [['Gardyn Help: Bunching Onions', GH(1783745)]],
  flav: { flavor: ['onion', 'sweet'], w: { pepper: 1, herbal: 1 }, texture: ['crisp'], roles: ['herb'], eat: 'Raw or cooked, chopped.', pairs: ['tokyo-bekana', 'green-tatsoi', 'cucumber'], kitchen: 'Soups, salads, omelets, stir-fries.' } });

S('stevia', { name: 'Stevia', latin: 'Stevia rebaudiana', group: 'herbs', glyph: 'sprig', tint: 'lime', fit: ['herb', 'fun'],
  gb: { sprout: '14–21', mature: '40–60', zone: 'high', size: '1 ft', care: 'Beginner', thin: '3 per yCube' },
  about: 'Leaves reported to be 200–300 times sweeter than sugar, with no carbohydrates or calories. Mostly used as a sugar substitute, fresh or steeped.',
  origin: 'Native to Paraguay, where the Guarani added it to hot maté as early as 500 AD.',
  harvest: ['Pinch leaves or cut stems above a growth node.', 'From 8 inches, trim the larger outer leaves, leaving a third of the plant.'],
  care: ['Remove leaves with brown spots; monthly root check.', 'Spider mites are its common pest.'],
  why: 'The fun one: chew a leaf and taste sugar. Steep a few with the mint for tea.',
  src: [['Gardyn Help: Stevia', GH(1785153)]],
  flav: { flavor: ['very sweet'], w: { sweet: 3 }, texture: ['soft'], roles: ['herb'], eat: 'A leaf or two, fresh or steeped.', pairs: ['mint', 'chocolate-mint', 'strawberry'], kitchen: 'Iced tea, lemonade, mint tea.', warn: ['Very sweet: one leaf goes a long way.'] } });

S('lemongrass', { name: 'Lemongrass', latin: 'Cymbopogon citratus', group: 'herbs', glyph: 'blades', tint: 'lime', fit: ['herb'],
  gb: { sprout: '10–21', mature: '100', zone: 'low', size: '2 ft', care: 'Intermediate', thin: '3 per yCube' },
  about: 'Citrusy without sourness; young stalks smell sweet and tropical. It pairs with ginger, chicken and seafood.',
  origin: 'Native to Africa, Asia and Oceania, long used as a traditional herbal medicine.',
  harvest: ['Take stalks at least ¼ inch thick, cut or snapped near the yCube.', 'Brown outer leaves as it matures are normal: trim them.'],
  care: ['Monthly root check.', 'Watch for spider mites.'],
  why: 'A low-light plant for row 1 or row 10 that makes tea and Thai soups. It reaches 2 feet.',
  src: [['Gardyn Help: Lemongrass', GH(1784449)]],
  flav: { flavor: ['citrus', 'sweet'], w: { tang: 1, herbal: 2 }, texture: ['fibrous stalks'], roles: ['herb'], eat: 'Stalks bruised and simmered, then fished out.', pairs: ['mint', 'thai-basil', 'tam-jalapeno'], kitchen: 'Tea, Thai soups, marinades.', warn: ['The stalks are fibrous: simmer them and fish them out rather than eating them.'] } });

S('viola', { name: 'Viola', latin: 'Viola', group: 'flowers', glyph: 'star', tint: 'purple', fit: ['flower'],
  gb: { sprout: '7–14', mature: '50', zone: 'medium', size: 'Under 1 ft', care: 'Beginner', thin: '3 per yCube' },
  about: 'A popular edible flower with a subtle, sweet flavor and a delicate scent.',
  origin: 'Native to Europe, grown for thousands of years for remedies, wine and perfume.',
  harvest: ['Cut flowers at the stem once they’re fully open.', 'Pinch faded flowers below the head for more blooms.'],
  care: ['The seeds need darkness: leave the rockwool undisturbed while they sprout.', 'Likes it cooler, 65–70°F. Watch for aphids.'],
  why: 'Edible color that isn’t peppery: a sweet flower for fruit and the Strawberry Patch, where nasturtium would be too hot.',
  src: [['Gardyn Help: Viola', GH(1783617)]],
  flav: { flavor: ['sweet', 'delicate'], w: { sweet: 1, cool: 1 }, texture: ['soft petals'], roles: ['color'], eat: 'Fresh flowers, scattered at the end.', pairs: ['strawberry', 'butterhead', 'mint'], kitchen: 'Fruit, salads, soups, desserts; pressed into soft cheese or onto cookies.' } });

S('calendula', { name: 'Radio Calendula', latin: 'Calendula officinalis', group: 'flowers', glyph: 'sunflower', tint: 'orange', fit: ['flower'],
  gb: { sprout: '6–14', mature: '50–55', zone: 'medium', size: '2 ft', care: 'Intermediate', thin: '3 per yCube' },
  about: 'Petals with a tangy-sweet taste; the leaves are more bitter. A natural dye and a first-aid-kit classic. This variety dates from the 1930s.',
  origin: 'Native to the Mediterranean and used medicinally since at least the 12th century.',
  harvest: ['Deadhead spent flowers, and trim the bare stem left behind so it doesn’t rot.', 'Pinch the tops of stalks to keep it bushy and under the light.'],
  care: ['Monthly root check.'],
  why: 'Saffron-orange petals with a tang, for color. It reaches 2 feet, so it needs headroom.',
  src: [['Gardyn Help: Radio Calendula', GH(1783297)]],
  flav: { flavor: ['tangy', 'sweet'], w: { tang: 1, sweet: 1, earthy: 1 }, texture: ['petals'], roles: ['color'], eat: 'Petals pulled and scattered; young leaves in salads.', pairs: ['bulls-blood', 'perpetual-spinach', 'romaine'], kitchen: 'Salads, drinks, rice.', warn: ['The leaves are more bitter than the petals.'] } });

S('cornflower', { name: 'Blue Cornflower', latin: 'Centaurea cyanus', group: 'flowers', glyph: 'star', tint: 'blue', fit: ['flower'],
  gb: { sprout: '5–10', mature: '70', zone: 'medium', size: '1 ft+', care: 'Beginner', thin: '1 per yCube' },
  about: 'Deep blue edible flowers whose flavor runs from mild cucumber to sharply bitter. Dried heads make tea.',
  origin: 'Native to Europe.',
  harvest: ['Deadhead spent flowers and trim the bare stem.', 'Pinch the tops of stalks to keep it bushy and under the light.'],
  care: ['Monthly root check.', 'Watch for aphids.'],
  why: 'True blue for the bowl, beside the borage stars.',
  src: [['Gardyn Help: Blue Cornflower', GH(1782465)]],
  flav: { flavor: ['cucumber', 'bitter'], w: { cool: 1, earthy: 1 }, texture: ['petals'], roles: ['color'], eat: 'Petals as a garnish; dried heads for tea.', pairs: ['borage', 'butterhead', 'salad-burnet'], kitchen: 'Garnish, cake decoration, tea.', warn: ['Flavor varies flower to flower, from mild to sharply bitter: taste one first.'] } });

S('peas', { name: 'Peas', latin: 'Pisum sativum', group: 'fruit', glyph: 'pod', tint: 'lime', fit: ['fruit'],
  gb: { sprout: '7–14', mature: '60–80', zone: 'medium', size: 'Under 2 ft', care: 'Advanced', thin: '1 per yCube' },
  about: 'Crunchy-sweet edible pods about 3 inches long, with minimal strings. Eat them whole as a snack or lightly sautéed.',
  harvest: ['Once pods look plump, pick every few days to keep new ones coming.', 'Eat them right away, or refrigerate and use within a week.'],
  care: ['They climb with tendrils: Gardyn recommends the Trellis and Plant Belts.', 'Hand-pollinate by gently shaking the plant or touching inside the blossoms.', 'Aphids and thrips are common pests.'],
  why: 'Snap and sweetness for the bowl, raw: a medium-light climber for the fruiting tower, with the Trellis.',
  src: [['Gardyn Help: Peas', GH(1786433)]],
  flav: { flavor: ['sweet', 'green'], w: { sweet: 2, cool: 1 }, texture: ['snappy', 'crunchy'], roles: ['crunch', 'sweet'], eat: 'Raw and whole, or a quick sauté.', pairs: ['mint', 'butterhead', 'red-sorrel'], kitchen: 'Snacking, salads, Gardyn’s quick Asian peas.' } });

S('shishito', { name: 'Shishito Pepper', latin: 'Capsicum annuum', group: 'fruit', glyph: 'pepper', tint: 'leaf', fit: ['fruit', 'fun'],
  gb: { sprout: '10–28', mature: '75–100', zone: 'high', size: '2 ft', care: 'Advanced', thin: '1 per yCube' },
  about: 'Mild, thin-walled, wrinkly peppers, up to about 200 Scoville. Roughly one in 10–20 is surprisingly spicy, up to about 1,000. The seeds are soft enough to eat, so cook them whole.',
  harvest: ['Pick at 3.5–4 inches: green for mild, red for more heat. Cut at the stem.'],
  care: ['Keep it 70–85°F.', 'Pinch the first set of flower buds; hand-pollinate later ones by shaking or brushing.', 'A Plant Belt once the fruit gets heavy.'],
  why: 'Blistered in a hot pan with flaky salt: the snack version of your TAM, mild with the occasional surprise.',
  src: [['Gardyn Help: Shishito Pepper', GH(2644353)]],
  flav: { flavor: ['mild', 'grassy'], w: { pepper: 1, earthy: 1 }, texture: ['thin-walled'], roles: ['pepper'], eat: 'Cooked fast and whole: blistered, tempura or grilled.', pairs: ['tam-jalapeno', 'green-tatsoi'], kitchen: 'Blistered with salt and lemon; with sesame, yogurt and fresh herbs.', warn: ['About one in 10–20 is spicy.'], flag: 'surprise heat' } });

S('lemon-pepper', { name: 'Lemon Hot Pepper', latin: 'Capsicum annuum', group: 'fruit', glyph: 'pepper', tint: 'yellow', fit: ['fruit'],
  gb: { sprout: '7–21', mature: '100–115', zone: 'high', size: '1 ft', care: 'Advanced', thin: '1 per yCube' },
  about: 'Teardrop peppers that ripen lemon-yellow, about 40,000 Scoville: cayenne heat.',
  harvest: ['Pick at about an inch long and half an inch wide, once yellow, for peak heat.'],
  care: ['Keep it warm, 70–85°F.', 'Pinch the first flower buds; hand-pollinate later ones.', 'A Plant Belt for the heavy fruit.'],
  why: 'Golden fruit to match the yellow tomatoes and ground cherries, with real heat for salsa and hot sauce.',
  src: [['Gardyn Help: Lemon Hot Pepper', GH(1786049)]],
  flav: { flavor: ['hot'], w: { pepper: 3 }, texture: ['crisp'], roles: ['pepper', 'color'], eat: 'Raw or cooked, finely chopped.', pairs: ['yellow-cherry-tomato', 'ground-cherry', 'cucumber'], kitchen: 'Fresh salsa, hot sauce.', warn: ['Cayenne-hot. Wear gloves to chop it, and keep your hands away from your eyes.'], flag: 'hot' } });

S('yellow-mini-strawberry', { name: 'Yellow Mini Strawberry', latin: 'Fragaria vesca', group: 'fruit', glyph: 'berry', tint: 'yellow', fit: ['fruit'],
  gb: { sprout: '10–15', mature: '100–120', zone: 'high', size: 'Under 1 ft', care: 'Advanced', thin: '3 per yCube' },
  about: 'Sweet, golden-yellow alpine berries; ripe ones feel soft, not firm. The white blossoms are edible too.',
  origin: 'An alpine, or wild, strawberry native to temperate regions, including parts of the Americas.',
  harvest: ['Pick when creamy yellow all the way to the stem: color tells ripeness, not size. A day or two longer gives more flavor.', 'They don’t keep, so eat them soon.'],
  care: ['65–85°F and 60–75% humidity.', 'Pollinate by swirling each flower 2–3 times with your thumb.', 'Remove all runners, and never take more than a third of the leaves at once.'],
  why: 'A strawberry from a seeded yCube, unlike your bare-root Albions: a sweet golden berry for the Strawberry Patch salad.',
  src: [['Gardyn Help: Yellow Mini Strawberry', GH(4367169)]],
  flav: { flavor: ['sweet', 'fragrant'], w: { sweet: 3, tang: 1 }, texture: ['soft', 'juicy'], roles: ['sweet', 'color'], eat: 'Fresh, soon after picking.', pairs: ['mint', 'lime-basil', 'butterhead', 'strawberry'], kitchen: 'Greens, granola, cheese, desserts, drinks.' } });

S('fairytale-eggplant', { name: 'Fairytale Eggplant', latin: 'Solanum melongena', group: 'fruit', glyph: 'cuke', tint: 'purple', fit: ['fruit'],
  gb: { sprout: '10–21', mature: '65–85', zone: 'high', size: '2 ft', care: 'Advanced', thin: '1 per yCube' },
  about: 'White fruit striped violet and purple that stays tender, sweet and never bitter as it grows. Marinate and grill it whole.',
  harvest: ['Pick at 2–4 inches long and about an inch across, while the skin is glossy; dull skin means it’s overripe.'],
  care: ['Hand-pollinate the purple flowers by shaking the plant or brushing the blossoms.', 'Trim branches to keep it within the light; monthly root check.'],
  why: 'A fruiting-tower idea for when the one-tomato-or-two question settles.',
  src: [['Gardyn Help: Fairytale Eggplant', GH(1785601)]],
  flav: { flavor: ['sweet', 'mild'], w: { sweet: 1, earthy: 1 }, texture: ['tender'], roles: ['color'], eat: 'Cooked: marinated and grilled whole.', pairs: [], kitchen: 'Grilled, roasted, curries.' } });

S('wheatgrass', { name: 'Wheatgrass', latin: 'Triticum aestivum', group: 'greens', glyph: 'blades', tint: 'lime', fit: ['fun', 'regrows'],
  gb: { sprout: '5–7', mature: '21', zone: 'low', size: 'Under 1 ft', care: 'Beginner', thin: 'Do not thin' },
  about: 'A mildly sweet, grassy flavor. Mostly juiced into wellness shots and smoothies, or dried into powder.',
  origin: 'Used for over 5,000 years; popularized in the 1930s by the agricultural chemist Charles Schnabel.',
  harvest: ['Cut with clean scissors once it’s at least 4 inches tall.', 'Leave at least 2 inches and it grows back.'],
  care: ['Monthly root check.'],
  why: 'Often sold as cat grass: a low-light yCube your cat can call its own, ready in three weeks and regrowing after every cut. Maybe a reason to leave the mint alone.',
  src: [['Gardyn Help: Wheatgrass', GH(1795713)]],
  flav: { flavor: ['grassy', 'sweet'], w: { herbal: 1, sweet: 1 }, texture: ['blades'], roles: ['herb'], eat: 'Juiced or blended.', pairs: [], kitchen: 'Juice, smoothies.' } });

S('ice-plant', { name: 'Ice Plant', latin: 'Mesembryanthemum crystallinum', group: 'greens', glyph: 'succulent', tint: 'lime', fit: ['salad', 'fun'], notGardyn: true,
  gb: { sprout: '—', mature: '49–56', zone: 'high', size: '—', care: 'Untested', thin: '1 per yCube', note: 'Not in Gardyn’s catalog. Harvest at 7–8 weeks from sowing. Wants 68–86°F, 30–70% humidity and full light.' },
  about: 'Leaves and stems covered in water-filled bladder cells that glitter like frost. The taste is succulent and savory, with a salty crunch.',
  harvest: ['Usually harvested at seven to eight weeks old.'],
  care: ['Start it in rockwool and transplant at 3–4 weeks, with four or five true leaves.', 'High humidity invites rot: keep air moving.', 'Never add salt to the Tank. Commercial growers salt the water for bigger plants, but your strawberries and beans are salt-sensitive. Without salt it grows smaller, but it grows.'],
  why: 'The texture plant: a salty, glassy crunch no other green on your towers has.',
  src: [['Greenhouse Grower: Ice Plant, a novel salad green', 'https://www.greenhousegrower.com/crops/ice-plant-a-novel-salad-green-for-greenhouse-and-indoor-growers/']],
  flav: { flavor: ['salty', 'savory'], w: { cool: 2, tang: 1 }, texture: ['crystalline', 'succulent', 'crunchy'], roles: ['crunch'], eat: 'Raw, in salads or as a garnish.', pairs: ['butterhead', 'yellow-cherry-tomato', 'red-sorrel'], kitchen: 'Raw in salads; beside fish.' } });

S('oyster-leaf', { name: 'Oyster Leaf', latin: 'Mertensia maritima', group: 'greens', glyph: 'leaf', tint: 'sage', fit: ['fun'], notGardyn: true,
  gb: { sprout: '14–80', mature: '98–126', zone: 'low', size: '—', care: 'Advanced', thin: '1 per yCube', note: 'Not in Gardyn’s catalog, and untested in one as far as I know. Germination is slow and erratic even after a month of cold.' },
  about: 'Thick, tender, blue-gray leaves that taste like oysters, with a hint of seaweed. It grows wild on cobble and gravel beaches along Maine’s Atlantic coast, where it’s called seaside bluebells.',
  harvest: ['Pick in the early morning, when the flavor is best.'],
  care: ['The seed wants cold first: 30 days on a damp paper towel in a sealed bag in the fridge.', 'Then expect 14–80 days to sprout, unevenly.', 'It likes it cool (it’s hardy to zone 3) and suffers in hot, bright spots.'],
  why: 'The island plant: an oyster you can grow. It’s a project rather than a sure thing. Buy seed instead of digging it from the shore: it’s uncommon in Maine and endangered in Massachusetts.',
  src: [['Baker Creek: How to grow oyster leaf', 'https://www.rareseeds.com/blog/post/how-to-grow-oyster-leaf'], ['Go Botany: Mertensia maritima', 'https://gobotany.nativeplanttrust.org/species/Mertensia/maritima']],
  flav: { flavor: ['oyster', 'briny'], w: { cool: 2, earthy: 1 }, texture: ['thick', 'tender'], roles: ['herb'], eat: 'Raw, a leaf at a time.', pairs: ['red-sorrel', 'butterhead', 'dill'], kitchen: 'Beside fish, or on a cracker with a squeeze of lemon.' } });

S('miners-lettuce', { name: 'Miner’s Lettuce', latin: 'Claytonia perfoliata', group: 'greens', glyph: 'shield', tint: 'leaf', fit: ['salad'], notGardyn: true,
  gb: { sprout: '—', mature: '55', zone: 'medium', size: '—', care: 'Untested', thin: '1 per yCube', note: 'Not in Gardyn’s catalog. Full sun to partial shade; cold-hardy.' },
  about: 'Sweet, succulent leaves and stems, with heart-shaped leaf pairs wrapped around a white-flowered stem. Not tart like purslane.',
  harvest: ['Cut leaves with scissors just above the crown while they’re young, about 2 inches long.', 'It regrows up to three times.'],
  care: ['Don’t let it flower unless you want seed.'],
  why: 'Purslane’s texture without the tang: succulent and mild, and it comes back after cutting.',
  src: [['West Coast Seeds: Miner’s Lettuce', 'https://www.westcoastseeds.com/collections/pea-seed-companions/products/miners-lettuce-claytonia'], ['Johnny’s: Claytonia', 'https://www.johnnyseeds.com/vegetables/greens/specialty-greens/claytonia-specialty-green-seed-388.11.html']],
  flav: { flavor: ['sweet', 'mild'], w: { sweet: 1, cool: 2 }, texture: ['succulent'], roles: ['base', 'crunch'], eat: 'Raw.', pairs: ['red-sorrel', 'borage', 'yellow-cherry-tomato'], kitchen: 'Salads and sandwiches.' } });

/* ---------- Outside the catalog, round two (Nov 7, 2026) ----------
   Checked against Gardyn's own plant list (help center: 52 greens, 26 herbs, 30 fruiting plants, 32 flowers)
   and Maine's Do Not Sell list. Picked by Josh's rules: keeps giving (or earns a seat as a garnish), salad first,
   and the cat. Full write-up in the project: "Beyond Gardyn's Catalog". */
const KGS = 'https://www.kitchengardenseeds.com/';
S('minutina', { name: 'Minutina', latin: 'Plantago coronopus', group: 'greens', glyph: 'blades', tint: 'leaf', fit: ['salad'], notGardyn: true,
  gb: { sprout: '2–15', mature: '50', zone: 'medium', size: 'Under 1 ft', care: 'Untested', thin: '1 per pod', note: 'Not in Gardyn’s catalog. Also sold as erba stella or buck’s-horn plantain. Sow a quarter inch deep; it sprouts at 45–70°F.' },
  about: 'Narrow, serrated, grass-like blades, shaped a little like a skinny mizuna, with a crunchy texture and a mild taste Kitchen Garden Seeds calls “a sweet, complex taste of nuts and salt.” A cold-hardy Italian salad green.',
  harvest: ['Cut the blades at about 5 inches long; it regrows after cutting.', 'For the best blades, Kitchen Garden Seeds sows a little more every few weeks.'],
  care: ['Thin to one plant per pod.', 'It takes cool rooms in stride and doesn’t turn bitter in warm ones.'],
  why: 'Crunch from a green: nutty and a little salty, a texture nothing on the towers has, and it grows back after a cut.',
  src: [['Kitchen Garden Seeds: Erba Stella Minutina', KGS + 'erba-stella-minutina.html'], ['Wikipedia: Plantago coronopus', 'https://en.wikipedia.org/wiki/Plantago_coronopus']],
  flav: { flavor: ['nutty', 'salty-sweet'], w: { sweet: 1, earthy: 1, cool: 1 }, texture: ['crunchy', 'blades'], roles: ['crunch', 'base'], eat: 'Raw: young blades whole, or a handful chopped into the bowl.', pairs: ['butterhead', 'yellow-cherry-tomato', 'red-sorrel'], kitchen: 'Salads.' } });

S('vietnamese-coriander', { name: 'Vietnamese Coriander', latin: 'Persicaria odorata', group: 'herbs', glyph: 'mint', tint: 'beet', fit: ['herb', 'salad'], notGardyn: true,
  gb: { sprout: '3–5 (a cutting roots)', mature: '—', zone: 'medium', size: 'Trails 1–3 ft', care: 'Untested', thin: '1 cutting per pod', note: 'Not in Gardyn’s catalog. Rau răm. Grown from cuttings or a nursery plant; it rarely flowers in cool climates. Legal in Maine: the Do Not Sell list’s one Persicaria is mile-a-minute, a different plant.' },
  about: 'A short-lived perennial with a hot, peppery, refreshing taste and a coriander aroma (PFAF). It likes its roots wet, even in shallow water, and struggles below about 45°F.',
  origin: 'Southeast Asia, where it’s rau răm in Vietnam and daun kesum in Malaysia.',
  harvest: ['Young leaves and tips, raw; older, redder leaves get too peppery.', 'Cut stems back and it bushes out.'],
  care: ['Root a tip cutting with four to six leaf joints, about 3–4 inches long, in water or a Rapid Rooter: it roots in 3–5 days when warm.', 'Pinch the tips to keep it bushy and inside the light; left alone it trails.', 'Plants in pots stop producing once they outgrow them (The Growers Exchange). A pod on the Column shouldn’t have that problem, but trim the roots at the monthly root check.'],
  why: 'Cilantro flavor that never bolts. Gardyn’s cilantro gives a few cuttings and quits; this one is a perennial that likes wet roots, which a Column has plenty of.',
  src: [['PFAF: Persicaria odorata', 'https://pfaf.org/user/Plant.aspx?LatinName=Persicaria+odorata'], ['The Growers Exchange: Vietnamese Coriander (live plant)', 'https://thegrowers-exchange.com/products/her-cor01']],
  flav: { flavor: ['peppery', 'cilantro-like'], w: { herbal: 2, pepper: 1, cool: 1 }, texture: ['tender'], roles: ['herb'], eat: 'Young leaves raw, torn into the bowl at the end.', pairs: ['cucumber', 'mint', 'romaine'], kitchen: 'Vietnamese chicken salad, summer rolls, laksa.' } });

S('catalogna', { name: 'Catalogna Chicory', latin: 'Cichorium intybus', group: 'greens', glyph: 'frill', tint: 'lime', fit: ['salad'], notGardyn: true,
  gb: { sprout: '5–12', mature: '60–65', zone: 'medium', size: 'Up to 1 ft', care: 'Untested', thin: '1 per pod', note: 'Not in Gardyn’s catalog: Gardyn sells radicchio and endive, which make one head each. Sold as Italian dandelion; Johnny’s Italiko Red is the red-ribbed sister. Sprouts best at 45–60°F.' },
  about: 'Long, deeply cut, frilly bright-green leaves on an upright plant up to a foot tall, “pleasantly bitter,” the way Italians like their salad greens (Kitchen Garden Seeds).',
  harvest: ['Cut the whole plant near the base and it regrows (chicory is a perennial), or pick outer leaves.', 'Pick young for the mildest leaves.'],
  care: ['Fast growth and steady moisture keep it mild.', 'Heat makes it bolt and turn harsh, so it suits a cool room.'],
  why: 'The bitter note your bowl doesn’t have yet, to set off sweet tomatoes and cucumbers, from a chicory that regrows after you cut it.',
  src: [['Kitchen Garden Seeds: Catalogna dandelion greens', KGS + 'dandelion-greens-catalogna.html'], ['Johnny’s: Italiko Red Italian Dandelion', 'https://www.johnnyseeds.com/vegetables/chicory/italian-dandelion/italiko-red-italian-dandelion-seed-3358.html']],
  flav: { flavor: ['bitter', 'green'], w: { earthy: 2, herbal: 1 }, texture: ['crisp', 'frilly'], roles: ['pepper', 'base'], eat: 'Raw, sliced thin with a lemony dressing, or wilted a minute in olive oil.', pairs: ['yellow-cherry-tomato', 'perpetual-spinach', 'romaine'], kitchen: 'Italian salads, quick sautés, soups.', warn: ['Bitter by design: young leaves are the mildest.'] } });

S('spigarello', { name: 'Spigarello', latin: 'Brassica oleracea', group: 'greens', glyph: 'broccoli', tint: 'sage', fit: ['salad'], notGardyn: true,
  gb: { sprout: '—', mature: '45–70', zone: 'high', size: 'Up to 2½ ft', care: 'Untested', thin: '1 per pod', note: 'Not in Gardyn’s catalog. Leaf broccoli (Spigariello Liscia). It can reach about 30 inches, so it needs a top pod, a Cap, or steady picking.' },
  about: 'An Italian heirloom grown for its leaves, the ancestor of broccoli raab. Blue-green leaves with a crisp, tender texture and a full, subtly sweet broccoli flavor, slightly peppery and nutty.',
  harvest: ['Cut-and-come-again: pick leaves from the bottom up, again and again. The little flower shoots are good too.'],
  care: ['Pick often to keep it short and inside the light.', 'Cool-season: it takes a chilly room happily.'],
  why: 'Broccoli flavor without waiting for a head: you eat the leaves, again and again. Your mini broccoli never headed; this one doesn’t have to.',
  src: [['Specialty Produce: Spigarello', 'https://specialtyproduce.com/produce/Broccoli_Spigarello_4117.php'], ['Friends School Plant Sale: Spigariello Liscia', 'https://friendsschoolplantsale.com/variety/8499'], ['Restoration Seeds: Spigariello Liscia', 'https://restorationseeds.com/products/spigariello-liscia-broccoli']],
  flav: { flavor: ['broccoli', 'sweet'], w: { sweet: 1, earthy: 1, pepper: 1 }, texture: ['crisp', 'tender'], roles: ['base'], eat: 'Raw, sliced thin into the bowl, or a quick sauté.', pairs: ['yellow-cherry-tomato', 'romaine', 'pink-celery'], kitchen: 'Pasta with garlic and chili, soups, grain bowls.' } });

S('magenta-lettuce', { name: 'Magenta Lettuce', latin: 'Lactuca sativa', group: 'greens', glyph: 'head', tint: 'red', fit: ['salad'], notGardyn: true,
  gb: { sprout: '—', mature: '—', zone: 'medium', size: 'Under 1 ft', care: 'Untested', thin: '1 per pod', note: 'Not in Gardyn’s catalog, though the type is: Muir is a summer crisp too. Johnny’s Cherokee is the same look in a much darker red.' },
  about: 'A red summer crisp (Batavian) lettuce from Johnny’s: shiny, slightly puckered, red-tinged leaves around a crispy green heart. Johnny’s tags it slow-bolting and tipburn-resistant, with resistance to downy mildew and lettuce mosaic virus.',
  harvest: ['Outer leaves, like your other lettuces, or the whole crisp heart at the end.'],
  care: ['Slow to bolt, so it holds in a warm spot better than most.'],
  why: 'Muir’s crunch in red: summer crisps are the crunchiest leaf lettuces, and this one shrugs off tipburn.',
  src: [['Johnny’s: Magenta lettuce', 'https://www.johnnyseeds.com/vegetables/lettuce/summer-crisp-lettuce-batavia/magenta-lettuce-seed-2382.html'], ['Johnny’s: Cherokee lettuce', 'https://www.johnnyseeds.com/vegetables/lettuce/summer-crisp-lettuce-batavia/cherokee-lettuce-seed-2741.html']],
  flav: { flavor: ['sweet', 'mild'], w: { sweet: 1, cool: 2 }, texture: ['crisp', 'crunchy'], roles: ['base', 'crunch', 'color'], eat: 'Raw.', pairs: ['cucumber', 'yellow-cherry-tomato', 'red-sorrel'], kitchen: 'Salads, wraps.' } });

S('rex-lettuce', { name: 'Rex Lettuce', latin: 'Lactuca sativa', group: 'greens', glyph: 'head', tint: 'lime', fit: ['salad'], notGardyn: true,
  gb: { sprout: '—', mature: '—', zone: 'medium', size: 'Under 1 ft', care: 'Untested', thin: '1 per pod', note: 'Not in Gardyn’s catalog. Johnny’s sells it pelleted, which makes one-seed-per-pod sowing easy.' },
  about: 'A green butterhead that Johnny’s calls “the standard for hydroponic growing”: slow to bolt and tolerant of tipburn, the calcium problem that browns leaf edges.',
  harvest: ['Outer leaves, or the whole head.'],
  care: ['A good test of a new pod: if Rex sulks, it isn’t the lettuce.'],
  why: 'The butterhead hydroponic growers rely on. If your butterheads keep bolting, this is the one bred not to.',
  src: [['Johnny’s: Rex pelleted lettuce', 'https://www.johnnyseeds.com/vegetables/lettuce/butterhead-lettuce-boston/rex-pelleted-lettuce-seed-2967JP.html']],
  flav: { flavor: ['buttery', 'mild'], w: { sweet: 1, cool: 2 }, texture: ['tender'], roles: ['base'], eat: 'Raw.', pairs: ['cucumber', 'salad-burnet', 'red-sorrel'], kitchen: 'Salads, lettuce cups.' } });

S('signet-marigold', { name: 'Lemon Gem Marigold', latin: 'Tagetes tenuifolia', group: 'flowers', glyph: 'star', tint: 'yellow', fit: ['flower'], notGardyn: true,
  gb: { sprout: '—', mature: '68', zone: 'high', size: '10–12 in', care: 'Untested', thin: '1 per pod', note: 'Not in Gardyn’s catalog: Gardyn’s marigold is Red Marietta, a French marigold grown for looks. Signet marigolds are the edible kind.' },
  about: 'A compact, mounded signet marigold with ferny leaves and masses of small lemon-yellow single flowers, edible, with a citrusy fragrance. It blooms early and keeps going (Fedco).',
  harvest: ['Pick flowers as they open; pull the petals and scatter them.'],
  care: ['A light shearing now and then keeps it blooming.'],
  why: 'Citrus-scented confetti for the bowl from a small plant that blooms for months: a garnish that earns its seat.',
  src: [['Fedco Seeds: Lemon Gem Signet Marigold', 'https://fedcoseeds.com/seeds/lemon-gem-signet-marigold-5243'], ['Gardyn Help: Marietta Marigold', GH(1782849)]],
  flav: { flavor: ['citrusy'], w: { tang: 1, herbal: 1 }, texture: ['petals'], roles: ['color', 'tang'], eat: 'Petals scattered over the bowl.', pairs: ['butterhead', 'cucumber', 'bulls-blood'], kitchen: 'Salads and garnishes.' } });

S('african-blue-basil', { name: 'African Blue Basil', latin: 'Ocimum kilimandscharicum × basilicum', group: 'herbs', glyph: 'sprig', tint: 'purple', fit: ['herb', 'flower'], notGardyn: true,
  gb: { sprout: '—', mature: '—', zone: 'high', size: '1–3 ft', care: 'Untested', thin: '1 cutting per pod', note: 'Not in Gardyn’s catalog. A sterile hybrid, so it comes only as a cutting or a nursery plant, never as seed.' },
  about: 'A cross of camphor basil and ‘Dark Opal’ basil that can’t make seed, so it blooms nonstop and lives on as a perennial. All of it is edible, purple flower spikes included. The flavor is basil with a camphor note (about a fifth of its aroma) that some people don’t care for.',
  harvest: ['Leaves and flower spikes, any time.'],
  care: ['No need to pinch it to stop it flowering, as with other basils; trim it to keep it under the light.', 'Root a tip in water to start the next one.'],
  why: 'A basil that never goes to seed, so it never quits. Taste a leaf before you commit: it’s camphor-tinged, not Genovese.',
  src: [['UF/IFAS Santa Rosa County: African Blue Basil', 'https://sfyl.ifas.ufl.edu/media/sfylifasufledu/santa-rosa/docs/pdfs/demo-garden/African-Blue-Basil.pdf'], ['Wikipedia: African blue basil', 'https://en.wikipedia.org/wiki/African_blue_basil']],
  flav: { flavor: ['basil', 'camphor'], w: { herbal: 3, cool: 1 }, texture: ['tender'], roles: ['herb', 'color'], eat: 'A few leaves, or the flower spikes, torn over the bowl.', pairs: ['yellow-cherry-tomato', 'strawberry', 'cucumber'], kitchen: 'Fruit teas and cocktails; with tomatoes.', warn: ['The camphor note is strong: taste first.'] } });

S('spilanthes', { name: 'Spilanthes', latin: 'Acmella oleracea', group: 'flowers', glyph: 'round', tint: 'gold', fit: ['flower', 'fun'], notGardyn: true,
  gb: { sprout: '—', mature: '—', zone: 'high', size: '1–1½ ft', care: 'Untested', thin: '1 per pod', note: 'Not in Gardyn’s catalog. Buzz buttons, toothache plant. Grown from seed or cuttings; highly frost-tender, which doesn’t matter indoors.' },
  about: 'Yellow flower buttons with red-orange centers on bronzy leaves. The leaves add a sharp, peppery taste to salads; the flowers make your mouth tingle, water and then go numb for a while (NC State).',
  harvest: ['Pick buttons as they open, and young leaves any time.'],
  care: ['Keep it in a warm, bright seat.'],
  why: 'Buzz buttons: a flower that makes your mouth tingle. Pure fun for guests, and the leaves give a salad some pepper.',
  src: [['NC State Extension: Acmella oleracea', 'https://plants.ces.ncsu.edu/plants/acmella-oleracea/'], ['Fedco Seeds: Spilanthes', 'https://fedcoseeds.com/seeds/spilanthes-4682']],
  flav: { flavor: ['peppery', 'tingling'], w: { pepper: 2 }, texture: ['tingling'], roles: ['pepper', 'color'], eat: 'A few leaves in the bowl; a button, sparingly, as a party trick.', pairs: ['cucumber', 'butterhead'], kitchen: 'Salads, cocktails.', warn: ['The flowers numb your mouth for a while: one at a time.'], flag: 'tingles' } });

S('land-cress', { name: 'Land Cress', latin: 'Barbarea verna', group: 'greens', glyph: 'spoon', tint: 'leaf', fit: ['salad'], notGardyn: true,
  gb: { sprout: '—', mature: '49–56', zone: 'medium', size: 'Under 1 ft', care: 'Untested', thin: '1 per pod', note: 'Not in Gardyn’s catalog (Gardyn sells watercress). Also called upland cress.' },
  about: 'Looks and tastes very much like watercress, with a stronger pepper (Gardening Know How). Small, somewhat square, slightly toothed leaves.',
  harvest: ['Start at about 4 inches tall, seven to eight weeks from sowing.', 'Pick leaves and leave the crown: cutting brings more growth.', 'Harvest before it flowers; after that the leaves turn tough and bitter.'],
  care: ['Likes it cool and evenly moist; heat makes it bolt.'],
  why: 'Watercress pepper without the watercress: easier, and not on the ASPCA’s toxic list for cats, which watercress is.',
  src: [['Gardening Know How: Growing upland cress', 'https://www.gardeningknowhow.com/edible/vegetables/cress/growing-upland-cress.htm']],
  flav: { flavor: ['peppery'], w: { pepper: 2, cool: 1 }, texture: ['tender'], roles: ['pepper'], eat: 'Raw: a handful in the bowl, like watercress.', pairs: ['butterhead', 'yellow-cherry-tomato', 'buttercrunch'], kitchen: 'Salads and sandwiches, or cooked like kale.' } });

S('mascotte-bean', { name: 'Mascotte Bean', latin: 'Phaseolus vulgaris', group: 'fruit', glyph: 'pod', tint: 'leaf', fit: ['fruit'], notGardyn: true,
  gb: { sprout: '—', mature: '50–55', zone: 'high', size: '16–18 in', care: 'Untested', thin: '1 per pod', note: 'Not in Gardyn’s catalog: Gardyn sells green, yellow, purple and dragon beans, but not this compact bush bean. 2014 All-America Selections winner.' },
  about: 'A compact, upright bush bean bred for containers: about 16–18 inches tall and 8–10 wide, with bundles of slim, stringless 5–6 inch filet pods held above the leaves (Horticulture).',
  harvest: ['Pick the pods slim and crisp, every few days.'],
  care: ['Fruiting tower. Sow another every few weeks for a steady supply.', 'Pods held up above the leaves are easy to see and pick.'],
  why: 'Beans back in your salads, bred for small spaces: a bush bean that keeps its pods up where you can find them.',
  src: [['Horticulture: Mascotte bush bean', 'https://www.hortmag.com/plants-we-love-2/mascotte-bush-bean-is-perfect-for-containers-and-small-gardens'], ['True Leaf Market: Mascotte', 'https://trueleafmarket.com/products/bean-bush-mascotte']],
  flav: { flavor: ['sweet', 'green'], w: { sweet: 1, cool: 1 }, texture: ['crunchy', 'snappy'], roles: ['crunch'], eat: 'Blanched a minute and chilled, then into the bowl.', pairs: ['yellow-cherry-tomato', 'cucumber', 'dill'], kitchen: 'Niçoise salads, quick pickles, sautéed with garlic.' } });

/* Cat checks for the new ideas. "Unlisted" means the ASPCA's lists don't include the plant either way. */
Object.assign(P.pets, {
  minutina: { unlisted: true, text: 'Not on the ASPCA’s lists for cats either way.', src: ASPCA_CATS },
  'vietnamese-coriander': { unlisted: true, text: 'Not on the ASPCA’s lists for cats either way.', src: ASPCA_CATS },
  catalogna: { unlisted: true, text: 'Chicory isn’t on the ASPCA’s toxic list for cats.', src: ASPCA_CATS },
  spigarello: { unlisted: true, text: 'Not on the ASPCA’s lists for cats either way.', src: ASPCA_CATS },
  'signet-marigold': { unlisted: true, text: 'Marigolds aren’t on the ASPCA’s toxic list for cats.', src: ASPCA_CATS },
  'african-blue-basil': { unlisted: true, text: 'The ASPCA lists basil as non-toxic; this hybrid’s other parent, camphor basil, isn’t listed either way.', src: ASPCA + 'basil' },
  spilanthes: { unlisted: true, text: 'Not on the ASPCA’s lists for cats either way.', src: ASPCA_CATS },
  'land-cress': { unlisted: true, text: 'Not on the ASPCA’s lists for cats, unlike watercress, which is on its toxic list.', src: ASPCA_CATS },
  watercress: { toxic: true, text: 'The ASPCA’s toxic list for cats includes watercress (Nasturtium officinale, filed as “Nasturtium (Watercress)”). Garden nasturtium is a different plant, and safe.', src: ASPCA_CATS }
});

/* The older ideas get scout tags too, so the filters work on the whole list */
const FIT = { arugula: ['salad'], 'wasabi-greens': ['salad'], breen: ['salad'], watercress: ['salad'], cilantro: ['salad', 'herb'], chervil: ['salad', 'herb'], catnip: ['herb', 'fun'], 'lemon-balm': ['herb'] };
Object.keys(FIT).forEach(id => { if (P.plants[id]) P.plants[id].fit = FIT[id]; });
P.scoutFilters = [['all', 'All'], ['short', 'Shortlist'], ['salad', 'Salad tower'], ['herb', 'Herbs'], ['flower', 'Edible flowers'], ['fruit', 'Fruiting tower'], ['keeps', 'Keeps giving'], ['fun', 'Just for fun'], ['outside', 'Outside Gardyn']];

/* ---------- More cat checks ---------- */
Object.assign(P.pets, {
  strawberry: { toxic: false, text: 'Cat-safe: the ASPCA lists strawberries as non-toxic.', src: ASPCA + 'strawberry' },
  'yellow-mini-strawberry': { toxic: false, text: 'Cat-safe: the ASPCA lists strawberries as non-toxic.', src: ASPCA + 'strawberry' },
  'italian-parsley': { toxic: true, text: 'The ASPCA lists parsley as toxic to cats: its furanocoumarins can cause sun sensitivity, though it takes a lot.', src: ASPCA + 'parsley' },
  chives: { toxic: true, text: 'The ASPCA lists chives as toxic to cats: they can damage red blood cells.', src: ASPCA + 'chives' },
  'bunching-onions': { toxic: true, text: 'Onions and chives are on the ASPCA’s toxic list for cats: the whole onion family can damage red blood cells.', src: ASPCA_CATS },
  lemongrass: { toxic: true, text: 'The ASPCA lists lemongrass as toxic to cats: mostly an upset stomach.', src: ASPCA + 'lemon-grass' },
  'lime-basil': { toxic: false, text: 'Cat-safe: the ASPCA lists basil as non-toxic.', src: ASPCA + 'basil' },
  'thai-basil': { toxic: false, text: 'Cat-safe: the ASPCA lists basil as non-toxic.', src: ASPCA + 'basil' },
  calendula: { toxic: false, text: 'Cat-safe: the ASPCA lists pot marigold (calendula) as non-toxic.', src: ASPCA + 'pot-marigold' },
  cornflower: { toxic: false, text: 'Cat-safe: the ASPCA lists cornflower as non-toxic.', src: ASPCA + 'cornflower' },
  stevia: { toxic: false, text: 'Cat-safe: the ASPCA lists stevia as non-toxic.', src: ASPCA + 'stevia' },
  'fairytale-eggplant': { toxic: true, text: 'Eggplant isn’t on the ASPCA list, but it’s a nightshade like the tomatoes: treat the leaves the same way.', src: ASPCA_CATS }
});

/* ---------- From the island kitchen: two more ---------- */
P.island.push(
  { name: 'Frankfurt green sauce', plants: ['borage', 'red-sorrel', 'salad-burnet'], how: 'Frankfurt’s seven herbs are parsley, chives, chervil, borage, sorrel, garden cress and salad burnet, chopped fine into sour cream with sieved hard-boiled egg, a little oil, vinegar and mustard. Served cold with boiled potatoes and eggs. You grow three of the seven; parsley, chives, chervil and watercress (standing in for garden cress) are all on your Ideas list.' },
  { name: 'Nasturtium capers', plants: ['nasturtium'], how: 'Pick the green seed pods while they’re still unripe, and steep them in seasoned vinegar in the fridge. They’re a peppery stand-in for capers.' }
);
P.islandSources = [['Wikipedia: Green sauce', 'https://en.wikipedia.org/wiki/Green_sauce'], ['Wikipedia: Tropaeolum majus', 'https://en.wikipedia.org/wiki/Tropaeolum_majus']];

/* The Forbidden Shelf lives in forbidden.js. */

/* ---------- Plant Doctor: what you see → what Gardyn says to do ---------- */
P.doctor = [
  { id: 'tips', label: 'Dry, brown, crispy edges', title: 'Dry or brown leaf tips and edges',
    likely: ['Tank Top-offs or Tank Refreshes running late: the plants keep recycling the same water and the nutrients drift out of balance.', 'Plant Food that isn’t Gardyn’s, or isn’t measured and dissolved first.', 'Dry room air.', 'If it’s whole outer or lowest leaves fading, that’s just age; on peppers and tomatoes the lowest leaves shrivel as a matter of course.'],
    todo: ['Top off and Refresh on schedule instead of waiting (see Care).', 'Dissolve Gardyn Plant Food in water before it goes in, at the amount Kelby gives.', 'Aim for 65–82°F and 50–75% humidity; a small humidifier helps if the air stays dry.', 'Harvest regularly, leaving a third of the plant, and trim faded leaves.'],
    note: 'Gardyn says the lights being too bright is rarely the cause.',
    src: [['Gardyn Help: dried, burnt or crispy leaves', GH(4414465)]], fix: 'air' },
  { id: 'yellow', label: 'Yellowing leaves', title: 'Yellow leaves',
    likely: ['Lowest or outermost leaves on a mature plant: natural aging as the plant moves energy to new growth.', 'Yellowing between the veins, or leaf-edge burn along with it: the Tank.'],
    todo: ['Trim faded leaves and keep harvesting.', 'Gardyn’s Tank Refresh guide says to Refresh sooner than every 4 weeks if you see yellowing leaves, leaf-edge burn or yellowing between veins.'],
    src: [['Gardyn Help: Tank Refresh', GH(1788097)], ['Gardyn Help: dried, burnt or crispy leaves', GH(4414465)]], fix: 'yellow' },
  { id: 'sprouts', label: 'Sprouts yellowing or dying', title: 'Sprouts turning yellow, shriveling or dying',
    likely: ['Only the first pair of leaves yellowing: normal. Once roots feed the plant, it no longer needs its seed leaves.', 'The whole sprout shriveling: Plant Food too early, or too much water in the first weeks.', 'A few never making it: natural die-off.'],
    todo: ['Too-early Plant Food: rinse the yCubes with tap water (from the side, if unsprouted), set them in the Nursery with no water and the lid on, add water only when they look mostly light green, and return them once they’re ready.', 'Too much water: check that the sow date in Kelby is right, so it waters sprouts on its seedling schedule.', 'Die-off: about a week after the first Plant Food, thin each yCube to its healthiest sprouts.'],
    src: [['Gardyn Help: sprouts turning yellow or dying', GH(4329473)], ['Gardyn Help: reviving yCubes from early Plant Food', GH(1778561)]] },
  { id: 'nosprout', label: 'It never sprouted', title: 'A yCube that never sprouted',
    likely: ['Plant Food stops seeds from sprouting.', 'Some seeds are just late: up to about six weeks.'],
    todo: ['Move it to the Nursery, away from Plant Food, and give it time.', 'Gardyn’s sprout guarantee: yCubes that haven’t grown after 21 days earn replacement credits. Email support@mygardyn.com or use the site chat.', 'Retired rockwool can go into houseplant pots, but never back into the Gardyn once it has touched soil.'],
    src: [['Gardyn Help: my yCube didn’t sprout', GH(1777921)]] },
  { id: 'bolt', label: 'Tall, bitter, flowering', title: 'Bolting',
    likely: ['Heat, age or the light schedule. The stem stretches, the leaves dull and space out, and they turn tougher and more bitter.'],
    todo: ['Cut flower stems the moment they appear to slow it down; on herbs, pinch buds as they form.', 'Once it’s truly bolting it can’t be reversed: start a replacement yCube and enjoy the last of it.', 'Keep established plants at 68–82°F.'],
    src: [['Gardyn Help: Bolting', GH(1770881)], ['Gardyn Help: temperature and humidity', GH(1777089)]] },
  { id: 'blisters', label: 'Blisters under leaves', title: 'Edema: small blisters or corky patches',
    likely: ['The plant takes up more water than it can release, so cells swell and burst. High humidity, low light, cool air and still air all make it likelier. Gardyn names peppers, tomatoes and tatsoi.'],
    todo: ['It isn’t a disease, and most plants keep growing.', 'Keep it above 65°F and at or below 60% humidity, make sure the plant isn’t shaded, and run a small fan on low.', 'Remove only badly damaged leaves.'],
    src: [['Gardyn Help: Edema', GH(1777409)]] },
  { id: 'fuzz', label: 'White fuzz on roots', title: 'White fuzz on the roots',
    likely: ['Root hairs. Gardyn says they’re often mistaken for mold and are “a good sign of your plant’s vigor.”'],
    todo: ['Nothing to do. Healthy roots are creamy white, and dark tips are normal.'],
    src: [['Gardyn Help: Root hairs', GH(1781953)], ['Gardyn Help: checking and trimming roots', GH(1771393)]] },
  { id: 'rot', label: 'Brown, slimy roots', title: 'Brown, slimy, sour roots',
    likely: ['Root rot: brown to black roots that feel slimy, fall apart and often smell rotten.', 'Not rot: Swiss chard and Bull’s Blood beets have naturally colorful roots, and bare-root strawberries start out brown.'],
    todo: ['Pinch away the rotting parts, cleaning the scissors between plants.', 'If the whole root mass is rotten, retire the plant.', 'HydroBoost regularly helps prevent rot and can treat a minor case; small, regular root trims beat big rare ones.'],
    src: [['Gardyn Help: checking and trimming roots', GH(1771393)]] },
  { id: 'algae', label: 'Green on the rockwool', title: 'Green on the rockwool or yPods',
    likely: ['Algae: light reaching wet rockwool or open slots.'],
    todo: ['HydroBoost regularly; Caps on every open slot; yCovers once plants have true leaves and are thinned.', 'Rub existing algae off a yCube under running water without squashing the rockwool, or just add a yCover.', 'Clean the Columns with citric acid and water (gloves on).'],
    src: [['Gardyn Help: Green algae', GH(1777217)]], fix: 'algae' },
  { id: 'stemroots', label: 'Roots on the stems', title: 'Bumps or roots growing from stems',
    likely: ['Adventitious roots: natural on peppers, eggplants, tomatoes, cucumbers, strawberries and basil.'],
    todo: ['Leave them. Gardyn says they help the plant take up water and nutrients.'],
    src: [['Gardyn Help: Adventitious roots', GH(1785729)]] },
  { id: 'bugs', label: 'Tiny bugs', title: 'Tiny bugs',
    likely: ['Aphids: clusters, usually green but also red, pink, yellow, white, grey or black, under leaves, on stems, near flowers and on new growth.', 'Whiteflies: little white fliers that lift off when you brush the leaves.', 'Thrips, spider mites and fungus gnats: see your fixes for mites and the gnat campaign on the Care tab.'],
    todo: ['The Castile soap dunk: 2.5 tablespoons of Castile soap per gallon of warm (not hot) water, about 4 gallons. Lights off, towel over the lid, then dip each plant up to the rockwool and shake it; keep the rockwool and roots out. Lights stay off 4 hours; wait 24 hours before harvesting, and rinse before eating.', 'Aphids: dunk every 4 days, 4 times. Thrips: every 4–5 days, at least 4–6 times. Whiteflies: yellow sticky traps, a spray of 1 tablespoon per quart, and dunks every 4–5 days.', 'No dish or hand soap.'],
    src: [['Gardyn Help: Aphids', GH(1779521)], ['Gardyn Help: Thrips', GH(1779585)], ['Gardyn Help: Whiteflies', GH(1779713)], ['Gardyn Help: Castile soap dunk', GH(1779393)]], fix: 'pests' },
  { id: 'crown', label: 'Soft strawberry crown', title: 'A soft or brown strawberry crown',
    likely: ['Crown rot: the crown sitting wet on the rockwool.'],
    todo: ['Your Strawberry Mold Triage notes are in the Care tab’s fixes.'],
    src: [], fix: 'crowns' }
];

/* ---------- Greener: the footprint of two towers ---------- */
P.greener = {
  kwh: 54, kwhRange: '26–68', hours: '14–16', rate: 0.3035, tank: 5,
  rateNote: 'Versant Power’s Bangor Hydro District residential rate as of July 1, 2026: 17.4¢ delivery plus 12.954¢ standard-offer supply per kWh. Swan’s Island moved to Versant (then Emera Maine) when the island co-op was bought in 2017. Check a bill and change it here.',
  kwhNote: 'Gardyn puts its devices at 26–68 kWh a month, depending on the model, with Kelby recommending 14–16 hours of light a day at full intensity. Digital Trends put a Gardyn at about 54 kWh a month on the recommended schedule.',
  heat: 'Nearly every watt the lights use ends up as heat in the room. In a Swan’s Island winter that’s a little help with heating; in August it’s heat you’re paying to vent.',
  water: 'Gardyn’s instructions only say to pour the old water out. Many growers give it to houseplants or the garden instead, since it’s dilute Plant Food; skip that right after HydroBoost or if the Tank had root rot. On a well, every gallon you reuse is a gallon you don’t pump.',
  waste: [
    ['yCube casings', 'Gardyn makes them from corn-based plastic and is moving to tapioca. Both compost only in industrial composters, so on the island they’re trash.'],
    ['Rockwool', 'Not compostable, but Gardyn says it adds nothing harmful and you can work spent rockwool straight into the ground, where it holds water.'],
    ['Never-sprouted yCubes', 'The rockwool can go into houseplant pots. Once it has touched soil it never goes back in the Gardyn.'],
    ['The real fix', 'Reusable printed pods: see The printer and Beyond the yCube, below.']
  ],
  seeds: [
    ['The easy four', 'Beans, peas, lettuce and tomatoes pollinate themselves, so their seed comes true. Skip hybrids: their seed may not.'],
    ['Your beans', 'Leave the pods on the plant until they’re brown and rattle, as your notes say.'],
    ['Your lettuces', 'Let one bolted head finish flowering and go to seed. It holds a seat for weeks, so pick the seat.'],
    ['Dry and store', 'Dry seed without heat. Label each packet with the variety and date, keep it cool, dark and dry (beans and peas like a breathable bag), and use it within three years.'],
    ['Back into a yCube', 'Gardyn says any plant in its catalog grows from your own seed in a Seedless yCube.']
  ],
  regrow: [
    ['Bunching onions', 'Back 1–2 weeks after each cut.'],
    ['Wheatgrass', 'Leave 2 inches and it regrows.'],
    ['Cut-and-come-again', 'Gardyn’s rule for leafy greens and herbs: harvest outer leaves and leave a third of the plant, and it keeps producing.'],
    ['Your long-haulers', 'Red sorrel, salad burnet, perpetual spinach and both mints keep giving from one yCube for months.'],
    ['Runners and rhizomes', 'Strawberry runners root into new plants, and you’ve already started mint from rhizome pieces in rockwool.']
  ],
  src: [
    ['Gardyn FAQ', 'https://mygardyn.com/pages/faq'],
    ['Digital Trends: the true cost of a smart garden', 'https://qa2.www.digitaltrends.com/home/true-cost-smart-garden'],
    ['Maine PUC: residential delivery rates', 'https://www11.maine.gov/mpuc/regulated-utilities/electricity/delivery-rates'],
    ['Verrill: Emera’s acquisition of Swan’s Island Electric Cooperative', 'https://www.verrill-law.com/experience/emeras-acquisition-of-swans-island-electric-cooperative/'],
    ['Gardyn Help: Tank Refresh', GH(1788097)],
    ['Gardyn Help: What Gardyn products are made of', GH(1773121)],
    ['Gardyn Help: my yCube didn’t sprout', GH(1777921)],
    ['Gardyn Help: Choosing your own seeds', GH(1778945)],
    ['Oregon State Extension: Saving seeds', 'https://extension.oregonstate.edu/sites/default/files/documents/12281/savingseeds.pdf'],
    ['Gardyn Help: Bunching Onions', GH(1783745)], ['Gardyn Help: Wheatgrass', GH(1795713)], ['Gardyn Help: Harvesting leafy greens', GH(1770945)]
  ]
};
/* ---------- A tip a day (Gardyn's guidance and your own notes) ---------- */
P.tips = [
  { t: 'Fuzzy white roots are root hairs, not mold. Gardyn calls them a sign of vigor.', go: { doctor: 'fuzz' } },
  { t: 'Never germinate yCubes on a tower with Plant Food in the Tank: Plant Food stops seeds from sprouting.', go: { doctor: 'nosprout' } },
  { t: 'Harvest outer leaves and leave a third of the plant, and it keeps producing.' },
  { t: 'Cut flower stems the moment they appear; it slows bolting.', go: { doctor: 'bolt' } },
  { t: 'Little blisters under pepper, tomato or tatsoi leaves are edema, not a disease. More light and a fan on low help.', go: { doctor: 'blisters' } },
  { t: 'Small, regular root trims are gentler than big, rare ones.', go: { doctor: 'rot' } },
  { t: 'Keep the day-to-night temperature swing under 5°F.' },
  { t: 'Run a small fan on low near the towers, not pointed at the plants.' },
  { t: 'Caps on every open slot keep out algae and debris.', go: { doctor: 'algae' } },
  { t: 'yCovers go on once plants have true leaves and have been thinned.', go: { doctor: 'algae' } },
  { t: 'For bugs, Castile soap only: 2.5 tablespoons per gallon of warm water. Never dish soap.', go: { doctor: 'bugs' } },
  { t: 'After a soap dunk, lights off for 4 hours, and wait 24 hours before you harvest.', go: { doctor: 'bugs' } },
  { t: 'Refresh a Tank early if you see yellowing between the veins or leaf-edge burn.', go: { doctor: 'yellow' } },
  { t: 'Gardyn’s sprout guarantee: a yCube that hasn’t grown in 21 days earns replacement credits.', go: { doctor: 'nosprout' } },
  { t: 'Spent rockwool can go straight into garden soil, where it helps hold water.', go: { view: 'diy' } },
  { t: 'Green nasturtium seed pods steeped in seasoned vinegar make a peppery stand-in for capers.', go: { plant: 'nasturtium' } },
  { t: 'Borage: eat the flowers, pulled from their hairy green cups, and go easy on the leaves.', go: { plant: 'borage' } },
  { t: 'Red sorrel’s tang is oxalic acid: four or five leaves are plenty for two people.', go: { plant: 'red-sorrel' } },
  { t: 'Mint and purslane are on the ASPCA’s toxic list for cats; nasturtium and dill are cat-safe.', go: { plant: 'mint' } },
  { t: 'Red roots on the Bull’s Blood are just Bull’s Blood. Slimy, brown and sour is rot.', go: { doctor: 'rot' } },
  { t: 'Crispy leaves? Gardyn says the lights being too bright is rarely the cause.', go: { doctor: 'tips' } },
  { t: 'Some seeds are late bloomers and take up to about six weeks to sprout.', go: { doctor: 'nosprout' } },
  { t: 'Frankfurt green sauce takes seven herbs, and you already grow three of them.', go: { view: 'salad' } },
  { t: 'Microgreen cover paper comes off when it’s ready. Gardyn: “If you have to tug, it’s not ready!”', go: { view: 'salad' } },
  { t: 'Bunching onions grow back a week or two after each cut: scallions from one yCube, on repeat.', go: { plant: 'bunching-onions' } },
  { t: 'A bowl from the towers is a clamshell of greens that didn’t have to ride the ferry. Tap “We ate this” to count it.', go: { view: 'salad' } },
  { t: 'All of Hancock County is inside Maine’s blister rust quarantine: no currants or gooseberries on Swan’s Island.', go: { forb: 'currants' } },
  { t: 'Lilies and daylilies can kill a cat, even the pollen or the water in the vase.', go: { forb: 'lilies' } },
  { t: 'Your purslane carries more oxalic acid, by weight, than rhubarb leaves. The dose makes the poison.', go: { forb: 'oxalic' } },
  { t: 'An A1 mini left on for a month uses about as much power as printing all 70 pods. Switch it off between runs.', go: { view: 'diy', anchor: 'printSec' } },
  { t: 'A printed pod pays back its price at the first planting, its trash by the second, its carbon after about eleven.', go: { view: 'diy', anchor: 'printSec' } }
];
P.tipSources = [['Gardyn Help: Soak Method', GH(1778497)]];
})();
