/* The harvest: what a picking is worth at the store, when fruit should be ripe once its flower opens,
   and how long seeds keep. Store prices are the USDA's national weighted average advertised prices for
   Oct 23, 2026; item weights are USDA FoodData Central portions. Everything here is editable or learned:
   the Greener tab takes your own store prices, and the ripening and picking estimates give way to your
   own numbers once you've logged a few. */
(function () {
const P = window.PB;
P.harvest = {
  /* A leafy picking, in ounces, until you size a few rounds yourself: a starting guess, not a measurement. */
  leafOz: { greens: 1, herbs: 0.25, flowers: 0.2 },
  boxOz: 5,
  sizes: [0.5, 1, 1.5, 2, 3, 4],   // boxes of salad greens, for "how much came off?"

  /* Store prices. pkgG: grams in the package; g: grams in one; count: how many to the package. */
  prices: [
    { id: 'greens', label: 'Salad greens, a 5-oz box', v: 3.30, note: 'Spring mix: $3.30 for a 5–9 oz box, counted as the usual 5-oz box (66¢ an ounce). Herbs and edible flowers count at this rate too; the report has no price for mint or dill, so they’re undersold.' },
    { id: 'strawberry', label: 'Strawberries, a 1-lb box', v: 3.22, pkgG: 453.6, g: 12, note: 'A medium berry is about 12 g, so about 9¢ a berry.' },
    { id: 'yellow-cherry-tomato', label: 'Cherry tomatoes, a 10-oz box', v: 3.00, pkgG: 283.5, g: 17, note: 'A cherry tomato is about 17 g, so about 18¢ each.' },
    { id: 'tam-jalapeno', label: 'Jalapeños, a pound', v: 1.51, pkgG: 453.6, g: 14, note: 'A jalapeño is about 14 g: 5¢ each. The cheapest thing on the tower, and the hottest.' },
    { id: 'cucumber', label: 'Persian cucumbers, a tray of 5–6', v: 3.00, count: 5.5, note: 'A Gardyn cucumber picked at 3–6 inches is about a Persian cucumber: 55¢ each.' },
    { id: 'green-beans', label: 'Green beans, a pound', v: 2.75, pkgG: 453.6, g: 5.5, note: 'Ten 4-inch beans weigh about 55 g: 3¢ a bean.' }
  ],
  unpriced: 'Ground cherries and cucamelons are counted but not priced: no store on the report sells them, and none on the island does either.',

  /* Days from a flower opening (or being pollinated) to ripe fruit. lo–hi is "ripe about now";
     past give, a flower that hasn't turned into fruit is counted as one that didn't set. */
  ripe: {
    strawberry: { lo: 25, hi: 35, give: 45, say: 'about 30 days', src: 'Penn State Extension puts it at about 30 days from blossom to ripe fruit for later varieties; Oklahoma State gives 18 to 45 days from bloom to first harvest, depending on variety and weather.' },
    'yellow-cherry-tomato': { lo: 42, hi: 56, give: 70, say: 'six to eight weeks', src: 'Cornell’s Stephen Reiners: six to eight weeks from pollination to full maturity, ripening best at 70–75°F and slowing or stopping above 85–90.' },
    'tam-jalapeno': { lo: 45, hi: 55, give: 75, say: '45–55 days, green; 60–70 to red', src: 'University of Georgia, via Michigan State Extension: 45–55 days from pollination to a full-size green pepper, 60–70 to red, in warm conditions.' },
    cucumber: { lo: 8, hi: 12, give: 20, say: '8–10 days', src: 'Seminis: the first fruit is ready 8–10 days after the first fully open female flowers.' },
    'green-beans': { lo: 7, hi: 10, give: 18, say: '7–10 days', src: 'University of Georgia, via Michigan State Extension: 7–10 days from pollination, in warm conditions.' },
    'ground-cherry': { sign: 'No count from the flower to go on: ripe when the husk dries papery tan and the fruit drops. Log flowers and pickings and the app learns your own timing.' },
    cucamelon: { sign: 'No count from the flower to go on: pick at about an inch, still firm. Log flowers and pickings and the app learns your own timing.' }
  },
  fruitWord: { strawberry: ['berry', 'berries'], 'yellow-cherry-tomato': ['tomato', 'tomatoes'], 'tam-jalapeno': ['jalapeño', 'jalapeños'], cucumber: ['cucumber', 'cucumbers'], 'green-beans': ['bean', 'beans'], 'ground-cherry': ['ground cherry', 'ground cherries'], cucamelon: ['cucamelon', 'cucamelons'] },

  /* How long seed keeps at room temperature, by the University of Delaware's 2025 ratings. */
  keep: {
    short: { say: 'Short-lived seed: a year or two at room temperature. Past that, sprout a few on a damp paper towel before trusting a packet.', yrs: 2,
      ids: ['buttercrunch', 'butterhead', 'romaine', 'green-salanova', 'lollo-rossa', 'flashy-trout-back', 'pink-celery', 'dill', 'tam-jalapeno', 'shishito', 'lemon-pepper', 'italian-parsley', 'bunching-onions'] },
    long: { say: 'Long-lived seed: five years or more, kept cool, dry and dark.', yrs: 5,
      ids: ['bulls-blood', 'perpetual-spinach', 'yellow-cherry-tomato', 'peas', 'lime-basil', 'thai-basil'] },
    mid: { say: 'Seed that keeps a few years, cool, dry and dark.', yrs: 4,
      ids: ['cucumber', 'green-beans', 'fairytale-eggplant'] }
  },

  /* How each plant gives. Josh's rule (Nov 6, 2026): grow what keeps giving; one-harvest crops are better
     bought unless they earn a seat another way. keeps: pickings for months; while: several pickings, then it
     bolts, flowers out or tires; once: one cut; microgreens are a quick cut on a seed pad. A plant missing here
     makes no claim either way. Notes come from each plant's Gardyn harvest guidance. */
  rule: {
    title: 'Your rule: grow what keeps giving',
    text: 'Pickings for months beat one big cut. One-harvest crops are better bought: kohlrabi (great, but cut and done), broccoli (it never headed here), cauliflower, cabbage and the root crops. The exception is a plant that earns its seat another way, as a garnish or as something your salads can’t do without.',
    micro: 'Microgreens are one cut too, but in a week or two, on a seed pad rather than a tower seat.'
  },
  givesWord: { keeps: 'keeps giving', while: 'for a while', once: 'one harvest', quick: 'quick cut' },
  givesGroup: {
    greens: 'Pick outer leaves, leave a third, and it keeps coming until it bolts. Cutting the whole head ends it.',
    herbs: 'Cut above a node and it branches and keeps coming.',
    flowers: 'Pick or deadhead the flowers and more buds follow.',
    fruit: 'Picking keeps it setting more.',
    micro: 'One cut, in a week or two, on a seed pad. Start a fresh pad for the next round.'
  },
  gives: {
    keeps: {
      'bulls-blood': 'Pick outer leaves and it keeps coming. Gardyn’s one-time option, cutting every leaf with the little root, ends it.',
      buttercrunch: '', butterhead: '', 'flashy-trout-back': '', 'green-salanova': '', 'lollo-rossa': '', romaine: '', breen: '', 'rouge-dhiver': '', 'monte-carlo': '', muir: '',
      'green-tatsoi': 'Outer leaves until it bolts. Cutting the whole rosette ends it.', 'red-tatsoi': 'Outer leaves until it bolts. Cutting the whole rosette ends it.',
      'tokyo-bekana': '', 'wasabi-greens': '', watercress: '', 'red-amaranth': 'Young leaves, a third at a time, until it flowers.', 'green-mustard': '',
      'hon-tsai-tai': 'Outer leaves, then flower shoots, again and again.',
      'perpetual-spinach': 'Months of outer leaves: it’s in the name.',
      'pink-celery': 'Take the big outer stalks and leave a third; new ones keep coming from the middle.',
      purslane: 'Pinch it often and it stays compact and keeps coming.',
      'red-sorrel': 'A perennial: outer leaves for months, even years.',
      mint: 'A perennial: cut it back and it comes back harder.', 'chocolate-mint': 'A perennial: cut it back and it comes back harder.',
      'salad-burnet': 'A perennial: tender new leaves, again and again.',
      dill: 'Cut from the top and pinch the flowers, and it keeps going for months.',
      nasturtium: 'Leaves and flowers, often, for months.',
      'italian-parsley': '', 'lemon-balm': 'A perennial.', lemongrass: 'A perennial: stalks, one at a time, as they thicken.', 'lime-basil': '', 'thai-basil': '', shiso: '', stevia: '', thyme: '', 'garlic-chives': 'Cut to an inch or two and it regrows in a week or two.',
      chives: 'Cut to an inch or two and it regrows.', 'bunching-onions': 'Cut two inches above the base and it grows back in a week or two.', catnip: 'Cut often; it comes back bushier.', 'oyster-leaf': 'A perennial.',
      calendula: 'Deadhead and it keeps blooming.', viola: 'Pinch faded flowers and it keeps blooming.',
      strawberry: 'Day-neutral: it keeps flowering and fruiting, flush after flush.', 'yellow-mini-strawberry': 'Keeps flowering and fruiting through the year.',
      'yellow-cherry-tomato': 'Keeps setting trusses for months while it’s picked.', 'tam-jalapeno': 'Keeps setting peppers for months; picking pushes more.',
      'lemon-pepper': '', shishito: '', 'banana-pepper': '', 'fairytale-eggplant': '',
      'ground-cherry': 'Fruits over a long season, dropping each one as it ripens.', cucamelon: 'Fruits all season; a perennial with tuberous roots.'
    },
    while: {
      borage: ['An annual whose flowers come in a run of several weeks, then it’s spent: growers sow it every four weeks to keep flowers coming. The big leaves are bristly and not for salads.', 'the flowers, as a garnish. If you aren’t using them, the seat would do more with something that keeps giving.', 'worth its seat if you use the flowers'],
      cucumber: ['Fruits for weeks, then tires; a fresh plant in the same pod keeps cucumbers coming.', 'a crisp cucumber, too central to your salads to give up.', 'staying: a crisp cucumber is too central to your salads'],
      'green-beans': ['Sets most of its crop at once; regular picking keeps a few more coming.'],
      arugula: ['A few cuttings, then it bolts.'], chervil: ['Best young; it bolts once it flowers.'], cilantro: ['A few cuttings before it bolts.'],
      'miners-lettuce': ['Regrows up to three times.'], peas: ['Weeks of picking every few days, then it’s done.'], wheatgrass: ['Grows back after a cut, a couple of times.'],
      cornflower: ['An annual: weeks of flowers if you deadhead it.', 'the flowers, as a garnish.'], 'purple-bok-choy': ['Outer leaves for a few weeks before it bolts, or the whole head at once.'],
      sunflower: ['Deadheading brings more buds for a while.', 'the flowers.']
    },
    once: {
      'mini-broccoli': ['One small head, then a few side shoots. Here it never headed.']
    }
  },

  src: [
    ['USDA AMS National Retail Report, Oct 23, 2026', 'https://www.ams.usda.gov/mnreports/fvwretail.pdf'],
    ['USDA FoodData Central', 'https://fdc.nal.usda.gov/'],
    ['Penn State Extension (Fronk): Do berries open after being picked?', 'https://www.lewistownsentinel.com/news/agriculture/2023/06/do-berries-open-after-being-picked/'],
    ['Oklahoma State: Growing strawberries in the home garden', 'https://pods.okstate.edu/fact-sheets/HLA-6214pod.pdf'],
    ['Cornell ENYCHP: What’s the deal with tomatoes this year? (Aug 2013)', 'https://rvpadmin.cce.cornell.edu/pdf/enych_newsletter/pdf66_pdf.pdf'],
    ['Michigan State Extension: When will my vegetables be ready to harvest?', 'https://www.canr.msu.edu/news/when_will_my_vegetables_be_ready_to_harvest'],
    ['Seminis: Cucumber harvest and storage', 'https://seminisus.s3.amazonaws.com/app/uploads/2019/08/7057_SE_S1_Cucumber-Harvest-and-Storage.pdf'],
    ['Penn State Extension: Growing ground cherries', 'https://extension.psu.edu/growing-ground-cherries'],
    ['University of Delaware: Storage conditions for carryover seed (2025)', 'https://sites.udel.edu/weeklycropupdate/?p=27183'],
    ['University of Maryland Extension: Borage', 'https://extension.umd.edu/resource/borage'],
    ['NC State Extension: Borago officinalis', 'https://plants.ces.ncsu.edu/plants/borago-officinalis/common-name/borage/']
  ]
};
})();
