/* Swan's Island Plant Book: taste, texture and pairing, plus the microgreens.
   Flavor weights run 0–3 on six axes (sweet, pepper, tang, herbal, earthy, cool). roles say what a plant does in a bowl.
   warn = "before you eat it" notes (texture and safety). pairs = partners on the towers; kitchen = partners from the kitchen.
   Gardyn-sourced notes are marked in the plant's own sources; the rest is ordinary kitchen knowledge, written for this app. */
(function () {
const P = window.PB;

P.axes = [
  ['sweet', 'Sweet'], ['pepper', 'Pepper'], ['tang', 'Tang'], ['herbal', 'Herbal'], ['earthy', 'Earthy'], ['cool', 'Cool and fresh']
];
P.roles = {
  base: { name: 'Base greens', hint: 'the soft bulk of the bowl' },
  crunch: { name: 'Crunch', hint: 'ribs, stalks and juicy bites' },
  pepper: { name: 'Pepper', hint: 'heat and bite' },
  tang: { name: 'Tang', hint: 'sour, lemony lift' },
  herb: { name: 'Herbs', hint: 'aroma, used by the pinch' },
  sweet: { name: 'Sweet', hint: 'fruit from the fruiting tower' },
  color: { name: 'Color', hint: 'reds, purples and flowers' },
  topper: { name: 'Toppers', hint: 'microgreens, scattered last' }
};
P.roleOrder = ['base', 'crunch', 'pepper', 'tang', 'herb', 'sweet', 'color', 'topper'];

const T = {
'perpetual-spinach': { flavor: ['mild', 'earthy'], w: { earthy: 2, sweet: 0.5 }, texture: ['tender when young', 'sturdy when older'], roles: ['base'], eat: 'Young leaves raw; bigger ones cooked.', pairs: ['strawberry', 'bulls-blood', 'red-sorrel'], kitchen: 'Strawberries, feta, toasted nuts, eggs, a warm bacon dressing.', warn: ['Older leaves turn sturdy and a little bitter raw; cook those. It’s a chard, so it’s high in oxalate.'] },
'pink-celery': { flavor: ['savory', 'herbal', 'strong raw'], w: { herbal: 2, earthy: 1 }, texture: ['crisp stalks', 'stringy when thick'], roles: ['crunch', 'color'], eat: 'Cooked, or raw sliced paper-thin or pickled.', pairs: ['romaine', 'cucumber', 'dill'], kitchen: 'Grain bowls, quick pickles, stir-fries, chicken soup.', warn: ['Strong and herbal raw: slice it very thin. Thick outer stalks get stringy.'] },
'red-tatsoi': { flavor: ['mild', 'peppery'], w: { pepper: 1, earthy: 1 }, texture: ['glossy', 'tender-crisp stems'], roles: ['color', 'pepper'], eat: 'Raw, or stirred in at the very end of cooking.', pairs: ['green-tatsoi', 'strawberry', 'ground-cherry'], kitchen: 'Citrus, sesame, soy and ginger.' },
'green-tatsoi': { flavor: ['earthy-sweet', 'mustardy'], w: { earthy: 1, sweet: 1, pepper: 1 }, texture: ['glossy', 'tender-crisp stems'], roles: ['base', 'pepper'], eat: 'Fresh or barely wilted.', pairs: ['ground-cherry', 'strawberry', 'lollo-rossa'], kitchen: 'Citrus and anything sweet (Gardyn’s pairing), sesame, salmon.' },
'bulls-blood': { flavor: ['earthy', 'sweet'], w: { earthy: 2, sweet: 1 }, texture: ['tender baby leaves'], roles: ['color', 'base'], eat: 'Baby leaves raw; big ones cooked like chard.', pairs: ['red-tatsoi', 'lollo-rossa', 'perpetual-spinach'], kitchen: 'Goat cheese, walnuts, orange, a sherry vinaigrette.', warn: ['The red bleeds onto everything, cutting boards included. Beet greens are high in oxalate.'] },
'buttercrunch': { flavor: ['mild', 'bright'], w: { sweet: 1, cool: 1 }, texture: ['soft', 'crunchy rib'], roles: ['base'], eat: 'Raw.', pairs: ['red-sorrel', 'nasturtium', 'mint'], kitchen: 'Any vinaigrette; tender enough for a lettuce wrap.', warn: ['Turns bitter once it starts to bolt; keep picking from the outside.'] },
'butterhead': { flavor: ['buttery', 'mild'], w: { sweet: 1, cool: 1 }, texture: ['buttery soft'], roles: ['base'], eat: 'Raw; dress it just before serving.', pairs: ['red-sorrel', 'salad-burnet', 'borage', 'dill'], kitchen: 'Light vinaigrettes, herbs, soft cheese. Heavy dressing flattens it.', warn: ['Turns bitter once it starts to bolt.'] },
'green-salanova': { flavor: ['sweet', 'mild'], w: { sweet: 2, cool: 1 }, texture: ['crunchy frills'], roles: ['base', 'crunch'], eat: 'Raw.', pairs: ['strawberry', 'bulls-blood', 'chocolate-mint'], kitchen: 'Anything: sandwiches, wraps, mixed salads.', warn: ['Turns bitter once it starts to bolt; it wants regular outer-leaf picking.'] },
'lollo-rossa': { flavor: ['mild'], w: { cool: 1, sweet: 0.5 }, texture: ['frilly', 'holds dressing'], roles: ['color', 'base'], eat: 'Raw.', pairs: ['nasturtium', 'green-tatsoi', 'bulls-blood'], kitchen: 'A nut-oil vinaigrette and edible flowers, as on Gardyn’s Lollo Rossa page; burgers.', warn: ['Turns bitter once it starts to bolt.'] },
'romaine': { flavor: ['sweet', 'mild'], w: { sweet: 1, cool: 2 }, texture: ['crunchy rib', 'firm'], roles: ['crunch', 'base'], eat: 'Raw.', pairs: ['purslane', 'dill', 'pink-celery', 'yellow-cherry-tomato'], kitchen: 'Caesar, tacos, anything that wants crunch.', warn: ['Turns bitter once it starts to bolt.'] },
'flashy-trout-back': { flavor: ['mild', 'sweet'], w: { sweet: 1, cool: 1 }, texture: ['tender', 'buttery for a romaine'], roles: ['base', 'color'], eat: 'Raw.', pairs: ['ground-cherry', 'nasturtium', 'mint'], kitchen: 'Use it like romaine; the speckles look great whole.', warn: ['Turns bitter once it starts to bolt.'] },
'red-sorrel': { flavor: ['tart', 'lemony'], w: { tang: 3 }, texture: ['tender when young', 'stringy ribs when mature'], roles: ['tang', 'color'], eat: 'Young leaves raw, a few at a time; mature leaves cooked.', pairs: ['butterhead', 'buttercrunch', 'salad-burnet'], kitchen: 'Fish, eggs and potatoes, as Gardyn suggests; a sorrel sauce; soup.', warn: ['A few leaves go a long way: the tang is oxalic acid, and it’s high in oxalate.', 'Strip the stringy stems and ribs from big leaves.'] },
'salad-burnet': { flavor: ['cucumber', 'nutty'], w: { cool: 2, herbal: 1 }, texture: ['lacy'], roles: ['herb'], eat: 'Raw, young leaves only.', pairs: ['cucumber', 'borage', 'butterhead'], kitchen: 'Herb butter, vinaigrette, a cold drink.', warn: ['Young growth only; older leaves go tough and bitter.'] },
'nasturtium': { flavor: ['peppery', 'sweet'], w: { pepper: 2, sweet: 1 }, texture: ['smooth', 'tender'], roles: ['pepper', 'color'], eat: 'Leaves and flowers raw.', pairs: ['lollo-rossa', 'buttercrunch', 'romaine'], kitchen: 'Soft cheese in the flowers (Gardyn’s idea), pesto from the leaves, peppery vinegar.', warn: ['Aphids find it first and hide in the flowers: swish them in water before they go in the bowl.'] },
'borage': { flavor: ['cucumber', 'honeydew (flowers)'], w: { cool: 2, sweet: 1 }, texture: ['bristly leaves', 'soft flowers'], roles: ['color', 'herb'], eat: 'Flowers raw; only very young leaves, chopped fine, or cooked.', pairs: ['cucumber', 'strawberry', 'salad-burnet'], kitchen: 'Flowers frozen in ice cubes, on desserts and in cold drinks; leaves in a cooked filling, the Italian way.', warn: ['Bristly: the leaves and stems are covered in stiff hairs. In a salad, use the flowers (pull the blue star out of its hairy green cup) and only the youngest leaves.', 'The leaves carry small amounts of pyrrolizidine alkaloids, which are hard on the liver in quantity. Treat them as an occasional garnish or a cooked filling, not an everyday green.'] },
'dill': { flavor: ['herbal', 'grassy-anise'], w: { herbal: 3 }, texture: ['feathery'], roles: ['herb'], eat: 'Raw, snipped right before serving.', pairs: ['cucumber', 'cucamelon', 'romaine', 'green-beans'], kitchen: 'Yogurt sauces, salmon and herring, zucchini, every pickle (Gardyn’s list).', warn: ['Wilts within minutes of cutting; snip it last.'] },
'mint': { flavor: ['cool', 'bright'], w: { herbal: 2, cool: 3 }, texture: ['soft'], roles: ['herb'], eat: 'Raw, torn.', pairs: ['strawberry', 'cucumber', 'cucamelon'], kitchen: 'Peas, lamb, feta, watermelon, tea.', warn: ['Strong: a few torn leaves per bowl, or it takes over.'] },
'chocolate-mint': { flavor: ['minty', 'cocoa'], w: { herbal: 2, cool: 2, sweet: 1 }, texture: ['soft'], roles: ['herb'], eat: 'Raw, torn; or in hot water.', pairs: ['strawberry', 'ground-cherry', 'green-salanova'], kitchen: 'Desserts, hot chocolate, fruit salad, tea.', warn: ['Strong: a little goes a long way.'] },
'purslane': { flavor: ['lemony', 'salty', 'peppery'], w: { tang: 1, pepper: 1, cool: 1 }, texture: ['succulent', 'juicy crunch'], roles: ['crunch', 'tang'], eat: 'Raw leaves and tender stems. Cooked, it turns a little slippery, like okra, which is why it thickens soups.', pairs: ['yellow-cherry-tomato', 'cucumber', 'romaine'], kitchen: 'Tomatoes, cucumber and feta (a fattoush-style bowl), yogurt, soups.', warn: ['Pick young, tender stems; harvest often or they go leggy.'] },
'tam-jalapeno': { flavor: ['mild heat', 'green'], w: { pepper: 2 }, texture: ['crisp'], roles: ['pepper', 'crunch'], eat: 'Raw in thin rings, or roasted.', pairs: ['yellow-cherry-tomato', 'cucamelon', 'ground-cherry'], kitchen: 'Salsa, tacos, pickled rings, a cilantro-yogurt sauce.', warn: ['Mild, but the seeds and ribs still carry heat. Wash your hands before you touch your eyes.'] },
'strawberry': { flavor: ['sweet', 'bright'], w: { sweet: 3, tang: 1 }, texture: ['juicy'], roles: ['sweet', 'color'], eat: 'Raw, red to the stem.', pairs: ['perpetual-spinach', 'mint', 'green-salanova', 'borage'], kitchen: 'Balsamic, poppy seed dressing (Gardyn’s strawberry salad), basil, goat cheese.' },
'yellow-cherry-tomato': { flavor: ['sweet'], w: { sweet: 3, tang: 1 }, texture: ['juicy'], roles: ['sweet', 'color'], eat: 'Raw, straight off the vine.', pairs: ['purslane', 'tam-jalapeno', 'romaine'], kitchen: 'Basil, mozzarella, olive oil, pasta.', warn: ['Tomato leaves and stems aren’t for eating.'] },
'cucumber': { flavor: ['cool', 'fresh'], w: { cool: 3 }, texture: ['crisp', 'watery'], roles: ['crunch'], eat: 'Raw, skin on (that’s where the nutrition is).', pairs: ['dill', 'borage', 'salad-burnet', 'mint'], kitchen: 'Yogurt and dill, rice vinegar, tomatoes and onion.', warn: ['Older plants of Gardyn’s variety can set fruit with small spines; rub them off.'] },
'cucamelon': { flavor: ['cucumber', 'lime-sour'], w: { cool: 2, tang: 2 }, texture: ['crunchy', 'firm skin'], roles: ['crunch', 'tang'], eat: 'Raw and whole, or halved.', pairs: ['dill', 'mint', 'tam-jalapeno'], kitchen: 'Salsa, quick pickles, a gin and tonic.', warn: ['Pick at about an inch; the skin turns sour and tough as it ages.'] },
'ground-cherry': { flavor: ['sweet', 'pineapple-tomato', 'vanilla'], w: { sweet: 3, tang: 1 }, texture: ['juicy', 'sticky skin'], roles: ['sweet', 'color'], eat: 'Raw, husk off, rinsed.', pairs: ['green-tatsoi', 'flashy-trout-back', 'arugula'], kitchen: 'Goat cheese, salsa, jam, pie.', warn: ['Only fully golden fruit. Green fruit, the leaves and the husks are not for eating.'] },
'green-beans': { flavor: ['grassy-sweet'], w: { sweet: 1, earthy: 1 }, texture: ['snappy'], roles: ['crunch'], eat: 'Fresh or lightly steamed (Gardyn’s pick); a quick blanch keeps them bright.', pairs: ['dill', 'yellow-cherry-tomato'], kitchen: 'Garlic and parmesan, dilly beans, a niçoise.' },
'arugula': { flavor: ['peppery', 'nutty'], w: { pepper: 2, earthy: 1 }, texture: ['tender'], roles: ['pepper', 'base'], eat: 'Raw, added just before serving.', pairs: ['strawberry', 'ground-cherry', 'yellow-cherry-tomato'], kitchen: 'Pizza, shaved parmesan, lemon, pears.', warn: ['Bigger leaves get hotter, then bitter.'] },
'wasabi-greens': { flavor: ['wasabi heat'], w: { pepper: 3 }, texture: ['serrated', 'tender'], roles: ['pepper'], eat: 'Raw for heat; lightly cooked for sweetness.', pairs: ['red-tatsoi', 'green-tatsoi'], kitchen: 'Ginger, sesame, spring rolls, salmon.', warn: ['Heat builds as the leaves grow.'] },
'breen': { flavor: ['mild', 'sweet'], w: { sweet: 1, cool: 1 }, texture: ['crisp'], roles: ['color', 'crunch'], eat: 'Raw.', pairs: ['nasturtium', 'purslane'], kitchen: 'Tacos, burgers, a braise.', warn: ['Turns bitter once it starts to bolt.'] },
'watercress': { flavor: ['peppery'], w: { pepper: 2 }, texture: ['tender', 'spindly stems'], roles: ['pepper'], eat: 'Raw or barely steamed.', pairs: ['butterhead', 'ground-cherry'], kitchen: 'Eggs, soups, sandwiches.', warn: ['Turns more bitter as it ages.'] },
'cilantro': { flavor: ['bright', 'citrusy'], w: { herbal: 3 }, texture: ['tender'], roles: ['herb'], eat: 'Raw, leaves and tender stems.', pairs: ['tam-jalapeno', 'yellow-cherry-tomato', 'cucumber'], kitchen: 'Salsa, rice, stir-fries, lime.', warn: ['Tastes like soap to people with a common gene variant; ask before loading a shared bowl.'] },
'chervil': { flavor: ['parsley', 'anise'], w: { herbal: 2 }, texture: ['delicate'], roles: ['herb'], eat: 'Raw, added at the end.', pairs: ['butterhead', 'strawberry'], kitchen: 'Eggs, fish, spring vegetables, potatoes.', warn: ['Heat and drying kill the flavor; add it last.'] },
'catnip': { flavor: ['minty', 'herbal'], w: { herbal: 2 }, texture: ['downy leaves'], roles: ['herb'], eat: 'Tea, or for the cat.', pairs: [], kitchen: 'Tea with lemon or a sprig of mint.', warn: ['Soft, downy leaves: better as tea (or for the cat) than in a salad. Gardyn notes its safety in large amounts is unclear.'] },
'lemon-balm': { flavor: ['lemony', 'herbal'], w: { herbal: 1, tang: 1 }, texture: ['soft'], roles: ['herb'], eat: 'Raw, torn; or as tea.', pairs: ['strawberry', 'cucumber'], kitchen: 'Fruit salads, fish, iced tea.' }
};
Object.keys(T).forEach(id => { if (P.plants[id]) P.plants[id].flav = T[id]; });
/* One-word flags for the plants that need a heads-up before they hit a bowl: shown on the map's flavor view and in the plant list. */
const FLAG = { borage: 'bristly', catnip: 'downy', 'red-sorrel': 'go easy', 'pink-celery': 'stringy', 'bulls-blood': 'stains', 'ground-cherry': 'golden only', 'yellow-cherry-tomato': 'fruit only', 'tam-jalapeno': 'heat', mint: 'strong', 'chocolate-mint': 'strong', 'wasabi-greens': 'heat', cilantro: 'soapy to some' };
Object.keys(FLAG).forEach(id => { if (P.plants[id] && P.plants[id].flav) P.plants[id].flav.flag = FLAG[id]; });

/* ---------- Microgreens (Gardyn's Microgreens Kit, grown in the Sprout Nursery) ---------- */
P.groups.micro = 'Microgreen';
const MG = [
  ['mg-spicy', 'Spicy Blend', 'Arugula, mustards and Asian greens', '2–5', '10–14', 'Bold and zesty, with a peppery kick.', 'Feathery leaves.', { pepper: 3 }, ['peppery', 'zesty'], 'https://help.mygardyn.com/en/articles/1787393'],
  ['mg-mild', 'Mild Blend', 'Broccoli, kale, kohlrabi, arugula and cabbage', '3–7', '10–14', 'Gentle and mild.', 'Rounded leaves.', { earthy: 1, cool: 1 }, ['mild'], 'https://help.mygardyn.com/en/articles/1787137'],
  ['mg-arugula', 'Arugula Microgreens', 'Eruca sativa', '2–5', '7–10', 'Peppery and nutty; the fastest pad in the kit.', 'Small paddle leaves.', { pepper: 2, earthy: 1 }, ['peppery', 'nutty'], 'https://help.mygardyn.com/en/articles/1787009'],
  ['mg-sango', 'Purple Sango Radish', 'Raphanus sativus', '3–7', '10–14', 'Bold and earthy with a peppery finish; stands up to rich pasta and meat.', 'Crunchy magenta stems, deep purple leaves; can grow a little tall.', { pepper: 2, earthy: 2 }, ['peppery', 'earthy'],'https://help.mygardyn.com/en/articles/1787329'],
  ['mg-kalefetti', 'Kalefetti', 'A multicolor kale mix', '3–7', '10–14', 'Mild and earthy.', 'Confetti of kale colors.', { earthy: 1 }, ['mild', 'earthy'], 'https://help.mygardyn.com/en/articles/1786753'],
  ['mg-redlace', 'Red Lace Mustard', 'Brassica juncea', '2–4', '10–14', 'Mild with a little mustard spice.', 'Feathery maroon leaves.', { pepper: 1 }, ['mild spice'], 'https://help.mygardyn.com/en/articles/1787265'],
  ['mg-broccoli', 'Broccoli Microgreens', 'Brassica oleracea', '3–7', '10–14', 'Mild, earthy, a touch bitter.', 'Classic green seed leaves.', { earthy: 1 }, ['mild', 'earthy'], 'https://help.mygardyn.com/en/articles/1786817'],
  ['mg-kohlrabi', 'Purple Kohlrabi', 'Brassica oleracea', '3–7', '10–14', 'Sweet and mild.', 'Vivid violet stalks, green seed leaves, fine and tender.', { sweet: 1, cool: 1 }, ['sweet', 'mild'], 'https://help.mygardyn.com/en/articles/1787073'],
  ['mg-carrot', 'Carrot Microgreens', 'Daucus carota', '5–8', '18–23', 'Mildly sweet with a hint of parsley. The slowest pad: start it first.', 'Long thin leaves, often with seed hulls on the tips. Orange-brown staining on the pad is harmless, not mold.', { sweet: 1, herbal: 1 }, ['sweet', 'parsley'], 'https://help.mygardyn.com/en/articles/1786881'],
  ['mg-shiso', 'Shiso Microgreens', 'Perilla frutescens', '4–7', '15–20', 'Bold and earthy with an anise-like zing; good against hearty pasta and meat.', 'Crunchy, slightly wider leaves.', { herbal: 3, earthy: 1 }, ['anise', 'bold'], 'https://help.mygardyn.com/en/articles/1787457'],
  ['mg-redacre', 'Red Acre Cabbage', 'Brassica oleracea', '3–7', '10–14', 'Mild with a slight peppery bite.', 'Red-purple stems, green seed leaves edged in red.', { pepper: 1 }, ['mild', 'peppery'], 'https://help.mygardyn.com/en/articles/1787201'],
  ['mg-lemonbasil', 'Lemon Basil Microgreens', 'Ocimum × citriodorum', '4–7', '15–20', 'A sweet, lemony take on basil.', 'Stays very short as a microgreen; grow it on to baby greens for a bigger harvest. Wet seeds turn jelly-like: mist the cover paper to peel it.', { herbal: 2, tang: 1, sweet: 1 }, ['lemony', 'basil'], 'https://help.mygardyn.com/en/articles/1786945'],
  ['mg-wasabi', 'Wasabi Microgreens', 'Brassica juncea', '3–7', '10–14', 'Sharp mustard heat with a fresh finish.', 'Lime-green leaves.', { pepper: 3 }, ['hot', 'zesty'], 'https://help.mygardyn.com/en/articles/2525889']
];
const MICRO_PAIRS = {
  'mg-spicy': 'Eggs, tacos, a rich sandwich.', 'mg-mild': 'Anything: smoothies, wraps, a kid’s plate.', 'mg-arugula': 'Pizza and pasta straight from the oven.',
  'mg-sango': 'Rich pasta, steak, tacos.', 'mg-kalefetti': 'Smoothies, grain bowls.', 'mg-redlace': 'Sandwiches and burgers.', 'mg-broccoli': 'Eggs, avocado toast.',
  'mg-kohlrabi': 'Fruit salads and sweet bowls.', 'mg-carrot': 'Soup and pasta garnish.', 'mg-shiso': 'Hearty pasta, meats, rice.', 'mg-redacre': 'Slaws and tacos.',
  'mg-lemonbasil': 'Strawberries, yellow tomatoes, mozzarella.', 'mg-wasabi': 'Salmon, sushi rice, noodles.'
};
const MICRO_TEX = { 'mg-spicy': ['feathery'], 'mg-redlace': ['feathery'], 'mg-sango': ['crunchy stems'], 'mg-shiso': ['crunchy'], 'mg-carrot': ['fine and threadlike'], 'mg-kohlrabi': ['fine and tender'] };
MG.forEach(([id, name, latin, sprout, harvest, about, looks, w, flavor, url]) => {
  P.plants[id] = {
    name, latin, group: 'micro', glyph: 'micro', tint: /Purple|Red|Sango|Kalefetti/.test(name) ? 'beet' : /Carrot|Lemon|Wasabi|Arugula/.test(name) ? 'lime' : 'leaf', status: 'micro', tags: [],
    gb: { sprout: sprout, mature: harvest, zone: null, size: 'Seed pad', care: 'Beginner', thin: 'No thinning', micro: true },
    about: about + ' ' + looks,
    flav: { flavor, w, texture: MICRO_TEX[id] || ['tender'], roles: ['topper'], eat: 'Raw, scattered last.', pairs: [], kitchen: MICRO_PAIRS[id] },
    harvest: ['Cut with clean scissors just above the seed pad once the first pair of seed leaves is fully open. Harvest the whole pad at once.', 'Pads rarely regrow; start a fresh one. Or move the plate to the Gardyn at about 2-inch roots and let it grow on into baby greens.'],
    care: ['No Plant Food and no thinning.', 'Keep water in the Nursery tray high enough for the bamboo wicks to reach.', 'Leave the cover paper until the sprouts lift it (usually days 3–10); if one patch is stuck, mist it and peel it wet. Lid off once the paper’s off.'],
    src: [['Gardyn Help: ' + name, url], ['Gardyn Help: Sprouting microgreens in the Nursery', 'https://help.mygardyn.com/en/articles/1787585']]
  };
});

/* How Gardyn grows them */
P.microHow = [
  ['The kit', 'Gardyn’s Microgreens Kit uses the Sprout Nursery: a tray of 10 squares, each with a support plate threaded with a bamboo wick and topped with a seed pad under cover paper.'],
  ['Start', 'Water to the line in each tray square, thread a wick through each plate, set the plates in, lay the seed pads paper-side up and soak the paper. Lid on, and the Nursery sits on the Gardyn’s lid (or a warm, sunny windowsill).'],
  ['Cover paper', 'Leave it until the sprouts push it loose, usually days 3–10. If one patch is stuck, mist it and peel it wet. If it lifts before every seed has sprouted, turn the plate and cover the bare patch for another 24 hours.'],
  ['Grow', 'Lid off once the paper’s off, for airflow. Keep water touching the wicks. No Plant Food, no thinning.'],
  ['Harvest', 'When the first pair of seed leaves is fully open: as soon as 7 days for arugula, 10–14 for most, 15–23 for shiso, lemon basil and carrot. Clean scissors, just above the pad, the whole pad at once.'],
  ['Baby greens', 'Or skip the cut: at about 2-inch roots, move the plate onto the Gardyn and harvest when true leaves open or the plants reach 4–6 inches, usually 1–2 weeks later.'],
  ['Share the Nursery', 'Gardyn says regular yCubes and microgreens share the Nursery happily. The beans are different: the Soak Method drains the base, and a drained Nursery leaves microgreen wicks dry. Start pads once the beans move up to the tower, or run them in a second Nursery. Hand-wash it monthly or between uses.'],
  ['A steady supply', 'Start two pads a week. Most are ready in 10–14 days, so four or five squares stay busy and there is always a pad coming in.']
];

/* House salads: bowls built from what's on the towers. */
P.house = [
  { id: 'lemon-lift', name: 'Lemon Lift', plants: ['butterhead', 'buttercrunch', 'red-sorrel', 'salad-burnet', 'borage'], dressing: 'Good olive oil, flaky salt and pepper. The sorrel is the acid, so skip the vinegar.', note: 'Tear in the sorrel last, four or five leaves for two people. Borage flowers only.' },
  { id: 'pepper-crunch', name: 'Pepper and Crunch', plants: ['romaine', 'flashy-trout-back', 'nasturtium', 'purslane', 'mg-sango'], dressing: 'Honey-lemon vinaigrette: the honey softens the nasturtium and radish heat.', note: 'Swish the nasturtium flowers before they go in.' },
  { id: 'beet-burgundy', name: 'Beet and Burgundy', plants: ['bulls-blood', 'red-tatsoi', 'lollo-rossa', 'pink-celery'], dressing: 'Sherry vinegar with a little walnut oil; goat cheese and toasted walnuts on top.', note: 'Shave the pink celery paper-thin. Dress at the table, or the beet greens tint everything.' },
  { id: 'strawberry-patch', name: 'Strawberry Patch', plants: ['green-salanova', 'perpetual-spinach', 'strawberry', 'mint', 'mg-lemonbasil'], dressing: 'Balsamic, or a poppy seed dressing like Gardyn’s strawberry salad.', note: 'Young spinach only. Mint or chocolate mint, a few torn leaves.' },
  { id: 'cucumber-cooler', name: 'Cucumber Cooler', plants: ['butterhead', 'cucumber', 'cucamelon', 'dill', 'salad-burnet', 'borage'], dressing: 'Yogurt, lemon, dill and salt, thinned with a little water.', note: 'Halve the cucamelons. Snip the dill last.' },
  { id: 'golden-hour', name: 'Golden Hour', plants: ['green-tatsoi', 'yellow-cherry-tomato', 'ground-cherry', 'purslane', 'tam-jalapeno'], dressing: 'Lime juice, honey and olive oil. Tatsoi likes citrus and sweet.', note: 'Only fully golden ground cherries, husks off. Thin rings of TAM; leave the seeds out for less heat.' }
];

/* Texture and cautions, all in one place */
P.cautions = [
  ['Bristly or fuzzy', 'Borage leaves and stems are covered in stiff hairs: eat the flowers and only the youngest leaves, chopped fine, or cook them. Catnip’s downy leaves are for tea or the cat.'],
  ['Stringy', 'Red sorrel’s stems and ribs once leaves are big; thick outer stalks of pink celery; big perpetual spinach stems. Strip, slice thin, or cook.'],
  ['Bitter when', 'Any lettuce once it starts to bolt; arugula, watercress and the mustards as leaves get big; broccoli microgreens a touch. Pick young and often.'],
  ['Strong: use a pinch', 'Mint and chocolate mint, raw pink celery, red sorrel, wasabi greens and the Spicy Blend.'],
  ['Not for eating', 'Tomato leaves and stems; ground cherry leaves, husks and any green fruit.'],
  ['Go easy', 'Borage leaves carry small amounts of liver-toxic pyrrolizidine alkaloids: an occasional garnish, not a daily green. Red sorrel, beet greens and chard-family perpetual spinach are high in oxalate; if you’re prone to kidney stones, keep portions moderate.'],
  ['For the cat', 'The ASPCA lists mint and chocolate mint, purslane, sorrel, borage, catnip and tomato plants (not the ripe fruit) as toxic to cats; Gardyn warns ground cherry leaves, husks and green fruit are toxic. Nasturtium, dill and lemon balm are on its non-toxic list. Keep trimmings off the floor and the tower out of reach.'],
  ['Check first', 'Nasturtium flowers hide aphids; cucamelons go sour and tough past an inch; dill wilts within minutes of cutting.']
];
P.cautionSources = [['ASPCA toxic and non-toxic plants', 'https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants'], ['Wikipedia: Borage', 'https://en.wikipedia.org/wiki/Borage'], ['UBC Stone Centre: Oxalate and stone disease', 'https://med-fom-stonecentre2017.sites.olt.ubc.ca/?p=3988'], ['Gardyn Help: Cape Gooseberry', 'https://help.mygardyn.com/en/articles/1785281']];
/* ---------- For the cat (ASPCA's toxic and non-toxic plant list; Gardyn for the ground cherry) ---------- */
const ASPCA = 'https://www.aspca.org/pet-care/aspca-poison-control/toxic-and-non-toxic-plants/';
P.pets = {
  mint: { toxic: true, text: 'The ASPCA lists mint as toxic to cats: its essential oils cause vomiting and diarrhea if a cat eats a lot.', src: ASPCA + 'mint' },
  'chocolate-mint': { toxic: true, text: 'Still a mint: the ASPCA lists mint as toxic to cats (essential oils; vomiting and diarrhea if a cat eats a lot).', src: ASPCA + 'mint' },
  purslane: { toxic: true, text: 'The ASPCA lists purslane as toxic to cats: soluble calcium oxalates.', src: ASPCA + 'purslane' },
  'red-sorrel': { toxic: true, text: 'The ASPCA lists sorrel as toxic to cats: soluble oxalates, the same acid that makes it tart. Small nibbles mean an upset stomach; large or repeated amounts are worse.', src: ASPCA + 'sorrel' },
  borage: { toxic: true, text: 'The ASPCA lists borage as toxic to cats, dogs and horses.', src: ASPCA + 'borage' },
  'yellow-cherry-tomato': { toxic: true, text: 'The ASPCA lists tomato plants as toxic to cats: solanine in the leaves and stems. The ripe fruit is non-toxic.', src: ASPCA + 'tomato-plant' },
  'ground-cherry': { toxic: true, text: 'Gardyn warns the leaves, husks and green fruit are toxic; keep the cat off it the way you would a tomato plant.', src: 'https://help.mygardyn.com/en/articles/1785281' },
  catnip: { toxic: true, text: 'The ASPCA lists catnip as toxic to cats in quantity: it can cause vomiting and diarrhea, and it sedates some cats and winds others up.', src: ASPCA + 'catnip' },
  nasturtium: { toxic: false, text: 'Cat-safe: the ASPCA lists nasturtium as non-toxic.', src: ASPCA + 'nasturtium' },
  dill: { toxic: false, text: 'Cat-safe: the ASPCA lists dill as non-toxic (long skin contact can irritate).', src: ASPCA + 'dill' },
  'lemon-balm': { toxic: false, text: 'Cat-safe: the ASPCA lists lemon balm as non-toxic.', src: ASPCA + 'lemon-balm' }
};

/* Taste a microgreen pad before an idea gets a yPod */
P.audition = { arugula: 'mg-arugula', 'wasabi-greens': 'mg-wasabi' };

/* Taste tests: a leaf of each, plain, side by side */
P.flights = [
  { id: 'lettuce', name: 'The lettuces', note: 'Six heads, one family: which ones earn their seats?', plants: ['butterhead', 'buttercrunch', 'green-salanova', 'romaine', 'flashy-trout-back', 'lollo-rossa'] },
  { id: 'bite', name: 'Bite and pepper', note: 'From gentle to hot. Taste in this order.', plants: ['red-tatsoi', 'green-tatsoi', 'purslane', 'nasturtium'] },
  { id: 'tang', name: 'Sour and bright', note: 'Three kinds of tart.', plants: ['red-sorrel', 'purslane', 'cucamelon'] },
  { id: 'herbs', name: 'The herbs', note: 'Crush a leaf between your fingers first, then taste.', plants: ['dill', 'salad-burnet', 'mint', 'chocolate-mint'] },
  { id: 'reds', name: 'The reds', note: 'Color is easy; flavor decides.', plants: ['bulls-blood', 'red-tatsoi', 'lollo-rossa', 'pink-celery'] }
];

/* From the island kitchen */
P.island = [
  { name: 'Lobster roll', plants: ['butterhead', 'pink-celery', 'dill'], how: 'Line the toasted roll with a butterhead leaf, fold paper-thin pink celery and a little snipped dill into the lobster, and keep the mayonnaise light.' },
  { name: 'Haddock with sorrel sauce', plants: ['red-sorrel'], how: 'Melt a handful of shredded sorrel into butter and a splash of cream; it collapses into a lemony green sauce in a minute. Spoon it over baked haddock. It turns khaki when cooked; the flavor stays bright.' },
  { name: 'Wild blueberries, mint and borage', plants: ['mint', 'borage'], how: 'Maine wild blueberries with a few torn mint leaves, a drizzle of honey and borage flowers scattered on top just before serving.' },
  { name: 'Chowder garnish', plants: ['pink-celery', 'dill', 'mg-sango'], how: 'Chopped pink celery leaves and dill over fish chowder, with a pinch of Sango radish microgreens for color and bite.' },
  { name: 'Strawberry shortcake', plants: ['strawberry', 'mint'], how: 'Albion strawberries over a warm biscuit with whipped cream, and the smallest mint leaves on top.' }
];

/* Dressings, matched to what is in the bowl */
P.dressings = {
  oil: { name: 'Just oil and salt', how: 'Good olive oil, flaky salt and black pepper. No vinegar.', why: 'The bowl already brings its own acid.' },
  honeyLemon: { name: 'Honey-lemon vinaigrette', how: '1 tablespoon lemon juice, 1 teaspoon honey, 3 tablespoons olive oil, a pinch of salt.', why: 'Honey softens nasturtium, tatsoi and radish heat.' },
  balsamic: { name: 'Strawberry balsamic', how: '1 tablespoon balsamic, 3 tablespoons olive oil and black pepper; mash in a spare strawberry if you have one.', why: 'Fruit wants something dark and sharp.' },
  yogurt: { name: 'Yogurt and dill', how: '3 tablespoons plain yogurt, 1 tablespoon lemon juice, snipped dill and salt, thinned with water until it pours.', why: 'Cool, creamy, and made for cucumber.' },
  sherry: { name: 'Sherry-walnut', how: '1 tablespoon sherry vinegar, 2 tablespoons walnut oil, 1 tablespoon olive oil, salt. Goat cheese and toasted walnuts on top.', why: 'Earthy greens like nutty and rich.' },
  sesame: { name: 'Sesame-ginger', how: '1 tablespoon rice vinegar, 1 teaspoon soy sauce, 1 teaspoon toasted sesame oil, ½ teaspoon grated ginger, 1 tablespoon neutral oil.', why: 'Tatsoi is an Asian green; it tastes like home in this.' },
  lime: { name: 'Lime-honey', how: '1 tablespoon lime juice, 1 teaspoon honey, 3 tablespoons olive oil, salt.', why: 'Golden fruit and a little heat both like lime.' },
  buttermilk: { name: 'Buttermilk herb', how: '¼ cup buttermilk, 1 tablespoon mayonnaise, a squeeze of lemon, snipped dill or burnet, salt and pepper.', why: 'Soft lettuces want something creamy to cling to.' },
  dijon: { name: 'Dijon vinaigrette', how: '1 tablespoon red wine vinegar, 1 teaspoon Dijon, 3 tablespoons olive oil, salt.', why: 'The all-rounder for a mixed bowl.' }
};
})();
