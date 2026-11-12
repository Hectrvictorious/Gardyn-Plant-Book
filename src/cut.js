/* The cut-size guide: what "ready" measures, for every plant in the book.
   Sizes are Gardyn's (its Help Center plant articles, as paraphrased in each plant's Harvest notes); for plants
   outside Gardyn's catalog they come from the sellers and growers cited on the plant's page.
   r: a range in inches · from: this size and up · about: about this size (fruit) · of/dim: what to measure
   obj: the everyday thing drawn under the ruler, to the same scale · like: the comparison in words
   cue: the signal when size isn't the point (color, flowers) · sw: a color swatch for that cue · tip: one more line
   say: the whole size sentence, when "what, size" doesn't read right · head: the headline, when "Cut at …" doesn't fit */
(function () {
const P = window.PB;
P.objs = {
  quarter: { len: 0.955, name: 'a quarter' },
  egg: { len: 1.75, name: 'a large egg' },
  battery: { len: 1.97, name: 'a AA battery' },
  card: { len: 3.37, name: 'a credit card' },
  playing: { len: 3.5, name: 'a playing card' },
  bill: { len: 6.14, name: 'a dollar bill' },
  pencil: { len: 7.5, name: 'a new pencil' },
  paper: { len: 8.5, name: 'printer paper, short side' }
};
const LEAF23 = { r: [2, 3], of: 'Outer leaves', dim: 'tall', obj: 'card', like: 'A little shorter than a credit card.' };
const LEAF4 = { from: 4, of: 'Outer leaves', dim: 'tall', obj: 'card', like: 'A bit longer than a credit card.' };
const MINT = { head: 'Cut above a node', cue: 'No set size: up to a third of its height at a time.' };
P.cut = {
  /* ----- Your towers ----- */
  'perpetual-spinach': LEAF23,
  'pink-celery': { from: 6, of: 'Stalks', dim: 'tall', obj: 'bill', like: 'About a dollar bill, or taller. The longer you wait, the thicker they get.', tip: 'Take the big outer stalks at the base; leaves can come sooner.' },
  'red-tatsoi': LEAF23,
  'green-tatsoi': LEAF23,
  'bulls-blood': LEAF4,
  'buttercrunch': LEAF4,
  'butterhead': LEAF4,
  'green-salanova': LEAF4,
  'lollo-rossa': LEAF23,
  'romaine': LEAF4,
  'flashy-trout-back': LEAF4,
  'red-sorrel': { from: 4, of: 'Outer leaves', dim: 'tall', obj: 'card', like: 'A bit longer than a credit card.', tip: 'Cut about an inch above the base, never more than a third at once.' },
  'purslane': { head: 'Harvest often', cue: 'No set size. Pinch leaves or cut above a node, a third of its height at a time, so it stays compact.' },
  'salad-burnet': { head: 'Pick young leaves, often', cue: 'No set size: the tender new leaves are the ones you want.' },
  'dill': { head: 'Take it from the top down', cue: 'Smaller fronds as you need them. Once it’s mature, cut back the top third every couple of months.' },
  'mint': MINT,
  'chocolate-mint': MINT,
  'nasturtium': { head: 'Pick flowers fully open', r: [4, 6], say: 'Leaves once the plant is 4–6 inches long, with healthy roots.', obj: 'bill', like: 'A credit card to a dollar bill. After that, pick often.' },
  'borage': { head: 'Pick flowers once they open', cue: 'About 6–8 weeks after sprouting. Leaves: snip where they meet the main stem.' },
  'tam-jalapeno': { about: 3, of: 'Peppers', dim: 'long', obj: 'card', like: 'About a credit card.', cue: 'Firm. The longer it stays on, the hotter and redder it gets.', sw: '#3f7a2c' },
  'strawberry': { head: 'Pick by color', cue: 'Red right up to the stem. Color tells ripeness, not size; a day or two more adds flavor.', sw: '#c3202e' },
  'yellow-cherry-tomato': { about: 1, of: 'Tomatoes', dim: 'across', obj: 'quarter', like: 'About a quarter.', cue: 'Evenly yellow and a little soft, just before it looks fully ripe. Overripe fruit cracks.', sw: '#f0bf2a' },
  'cucumber': { r: [3, 6], of: 'Cucumbers', dim: 'long', obj: 'bill', like: 'A credit card to a dollar bill.', cue: 'Dark green, with the yellow flower dropped off the tip. Overgrown ones turn bitter.', sw: '#2f5a2a' },
  'green-beans': { about: 5, of: 'Pods', dim: 'long', obj: 'bill', like: 'A bit shorter than a dollar bill.', cue: 'Pencil-thick and still tender, usually 1–2 weeks after flowering.' },
  'ground-cherry': { head: 'Let it drop', cue: 'It falls when it’s ripe, or drops with a gentle shake. The husk dries to tan.', sw: '#cfb07a' },
  'cucamelon': { about: 1, of: 'Fruit', dim: 'long', obj: 'quarter', like: 'About a quarter.', cue: 'Still firm. Older fruit turns sour.' },
  /* ----- Ideas ----- */
  'arugula': Object.assign({}, LEAF23, { tip: 'Smaller leaves are milder. Cut yellow flower stems as they appear.' }),
  'wasabi-greens': Object.assign({}, LEAF4, { tip: 'Take the stalk too.' }),
  'breen': LEAF4,
  'watercress': { head: 'Harvest often', cue: 'No set size. Pinch leaves or cut above a node, and leave a third.' },
  'tokyo-bekana': LEAF4,
  'hon-tsai-tai': { r: [8, 10], of: 'Flower stems', dim: 'long', obj: 'paper', like: 'About the short side of printer paper.', cue: 'Just as the flowers open. They should snap; if they won’t, they’re overgrown.', tip: 'Leaves: the outer ones from 4 inches.' },
  'rouge-dhiver': LEAF4,
  'red-amaranth': { head: 'Pick young leaves', cue: 'Young leaves for eating raw, older ones for cooking. Leave a third of the plant.' },
  'wheatgrass': { from: 4, of: 'Grass', dim: 'tall', obj: 'card', like: 'A bit taller than a credit card.', tip: 'Leave at least 2 inches and it grows back.' },
  'ice-plant': { head: 'At seven to eight weeks', cue: 'That’s when it’s usually harvested.' },
  'oyster-leaf': { head: 'Pick in the early morning', cue: 'No set size: morning is when the flavor is best.' },
  'miners-lettuce': { about: 2, of: 'Young leaves', dim: 'long', obj: 'battery', like: 'About a AA battery.', tip: 'Cut just above the crown; it regrows up to three times.' },
  'minutina': { about: 5, of: 'Blades', dim: 'long', obj: 'bill', like: 'A bit shorter than a dollar bill.', tip: 'It regrows after cutting.' },
  'catalogna': { head: 'Pick young', cue: 'Young leaves are the mildest. Cut the whole plant near the base and it regrows, or take outer leaves.' },
  'spigarello': { head: 'Bottom up, again and again', cue: 'Pick leaves from the bottom of the stem up. The little flower shoots count too.' },
  'magenta-lettuce': Object.assign({}, LEAF4, { tip: 'The same as Gardyn’s rule for Muir, another summer crisp.' }),
  'rex-lettuce': Object.assign({}, LEAF4, { tip: 'The same as Gardyn’s rule for its Butterhead.' }),
  'land-cress': { from: 4, of: 'The plant', dim: 'tall', obj: 'card', like: 'A bit taller than a credit card, usually seven to eight weeks from sowing.', cue: 'Before it flowers; after that the leaves turn tough and bitter.', tip: 'Pick leaves and leave the crown.' },
  'cilantro': { from: 6, of: 'The plant', dim: 'tall', obj: 'bill', like: 'About a dollar bill.', tip: 'Cut outer stalks at the base or pinch leaves; leave a third.' },
  'chervil': { head: 'Pick young', cue: 'Before it flowers: whole outer branches at the base, a third at a time.' },
  'catnip': { head: 'Cut above a node', cue: 'No set size. Cut ¼–½ inch above a node, just above the two largest leaves on a stem.' },
  'lemon-balm': { from: 10, of: 'The plant', dim: 'tall', obj: 'paper', like: 'A bit taller than printer paper is wide.', tip: 'Trim the larger outer leaves or cut above a node, a third at a time.' },
  'italian-parsley': { from: 6, of: 'The plant', dim: 'tall', obj: 'bill', like: 'About a dollar bill.', tip: 'Trim the larger outer leaves, never more than a third at a time.' },
  'shiso': { head: 'Start young', cue: 'Leave a third of the leaves, and pinch flower buds to delay bolting.' },
  'lime-basil': { head: 'Cut above a node', cue: 'No set size. Cut ¼–½ inch above a node, and pinch flower buds as they appear.' },
  'thai-basil': { head: 'Cut above a node', cue: 'Cut ¼–½ inch above a node, leaving 4–6 inches of plant so it keeps growing.' },
  'chives': { from: 4, of: 'Leaves', dim: 'tall', obj: 'card', like: 'A bit taller than a credit card.', tip: 'Cut back to 1–2 inches above the base.' },
  'bunching-onions': { r: [6, 8], of: 'Stalks', dim: 'tall', obj: 'pencil', like: 'About a new pencil.', tip: 'Cut about 2 inches above the base; they grow back in a week or two.' },
  'stevia': { from: 8, of: 'The plant', dim: 'tall', obj: 'paper', like: 'About the short side of printer paper.', tip: 'Trim the larger outer leaves, leaving a third of the plant.' },
  'lemongrass': { head: 'Cut at ¼ inch thick', cue: 'Stalks at least ¼ inch thick, about a pencil’s thickness. Cut or snap them close to the yCube.' },
  'vietnamese-coriander': { head: 'Pick young tips', cue: 'Young leaves and tips. Older, redder leaves get too peppery.' },
  'african-blue-basil': { head: 'Any time', cue: 'Leaves and flower spikes, whenever you want them.' },
  'viola': { head: 'Pick fully open', cue: 'Cut flowers at the stem.' },
  'calendula': { head: 'Pick fully open', cue: 'Fully open for petals; half open if they’re going in a vase.' },
  'cornflower': { head: 'Pick open blooms', cue: 'Pinch or cut at the base of the flower head.' },
  'signet-marigold': { head: 'Pick as they open', cue: 'Pull the petals and scatter them.' },
  'spilanthes': { head: 'Pick as they open', cue: 'Flower buttons as they open; young leaves any time.' },
  'peas': { about: 3, of: 'Pods', dim: 'long', obj: 'card', like: 'About a credit card.', cue: 'Plump. Pick every few days to keep new ones coming.' },
  'shishito': { r: [3.5, 4], of: 'Peppers', dim: 'long', obj: 'playing', like: 'A playing card, or a hair longer.', cue: 'Green for mild, red for more heat.' },
  'lemon-pepper': { about: 1, of: 'Peppers', dim: 'long', obj: 'quarter', like: 'About a quarter, and half as wide.', cue: 'Lemon-yellow, for peak heat.', sw: '#f1cf3b' },
  'yellow-mini-strawberry': { head: 'Pick by color', cue: 'Creamy yellow all the way to the stem. Color tells ripeness, not size.', sw: '#f1e2a4' },
  'fairytale-eggplant': { r: [2, 4], of: 'Eggplants', dim: 'long', obj: 'card', like: 'A AA battery to a bit longer than a credit card.', cue: 'Glossy skin, about an inch across. Dull skin means it’s overripe.', sw: '#6b2d6b' },
  'mascotte-bean': { r: [5, 6], of: 'Pods', dim: 'long', obj: 'bill', like: 'About a dollar bill.', cue: 'Slim and crisp. Pick every few days.' },
  /* ----- Retired ----- */
  'muir': LEAF4,
  'monte-carlo': LEAF23,
  'purple-bok-choy': { from: 5, of: 'Outer leaves', dim: 'tall', obj: 'bill', like: 'A bit shorter than a dollar bill.', tip: 'Or the whole head at 6–8 inches tall.' },
  'mini-broccoli': { r: [1.5, 2], of: 'The main head', dim: 'wide', obj: 'egg', like: 'About the size of a large egg, Gardyn’s own comparison.', tip: 'Side stems come 15–20 days later; take them at 4–6 inches long.' },
  'green-mustard': LEAF23,
  'sunflower': { head: 'Pick open flowers', cue: 'Open flowers for petals. For a vase, cut just before they open.' },
  'garlic-chives': { r: [4, 6], of: 'Leaves', dim: 'tall', obj: 'bill', like: 'A credit card to a dollar bill.', tip: 'Cut back to 1–2 inches above the base; it regrows in a week or two.' },
  'thyme': { r: [8, 10], of: 'Stems', dim: 'tall', obj: 'paper', like: 'About the short side of printer paper.', tip: 'Snip the green tops only, never the woody base, and leave 5 inches.' },
  'banana-pepper': { r: [8, 9], of: 'Peppers', dim: 'long', obj: 'paper', like: 'About the short side of printer paper.', cue: 'Firm, at any color.' }
};
/* Microgreens Kit pads all follow one rule; their days come from each pad's own entry. */
Object.keys(P.plants).forEach(id => { const pl = P.plants[id]; if (pl.gb && pl.gb.micro && !P.cut[id]) P.cut[id] = { head: 'When the seed leaves open', cue: 'The first pair fully open, about ' + pl.gb.mature + ' days in. Cut just above the seed pad.' }; });
})();
