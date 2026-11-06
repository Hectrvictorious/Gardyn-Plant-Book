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
    strawberry: { lo: 25, hi: 35, give: 45, say: 'about 30 days', src: 'Penn State Extension gives about 30 days from flower to ripe berry; Oklahoma State, 18 to 45 depending on variety and warmth.' },
    'yellow-cherry-tomato': { lo: 42, hi: 56, give: 70, say: 'six to eight weeks', src: 'Cornell’s Stephen Reiners: six to eight weeks from pollination, ripening best at 70–75°F and stalling above 85.' },
    'tam-jalapeno': { lo: 45, hi: 55, give: 75, say: '45–55 days, green; 60–70 to red', src: 'University of Georgia, via Michigan State Extension: 45–55 days from pollination to a full-size green pepper, 60–70 to red.' },
    cucumber: { lo: 8, hi: 12, give: 20, say: '8–10 days', src: 'Seminis: the first fruit is ready 8–10 days after the first fully open female flowers.' },
    'green-beans': { lo: 7, hi: 10, give: 18, say: '7–10 days', src: 'University of Georgia, via Michigan State Extension: 7–10 days from pollination.' },
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

  src: [
    ['USDA AMS National Retail Report, Oct 23, 2026', 'https://www.ams.usda.gov/mnreports/fvwretail.pdf'],
    ['USDA FoodData Central', 'https://fdc.nal.usda.gov/'],
    ['Penn State Extension (Fronk): Do berries open after being picked?', 'https://www.lewistownsentinel.com/news/agriculture/2023/06/do-berries-open-after-being-picked/'],
    ['Oklahoma State: Growing strawberries in the home garden', 'https://pods.okstate.edu/fact-sheets/HLA-6214pod.pdf'],
    ['Cornell ENYCHP: What’s the deal with tomatoes this year? (Aug 2013)', 'https://rvpadmin.cce.cornell.edu/pdf/enych_newsletter/pdf66_pdf.pdf'],
    ['Michigan State Extension: When will my vegetables be ready to harvest?', 'https://www.canr.msu.edu/news/when_will_my_vegetables_be_ready_to_harvest'],
    ['Seminis: Cucumber harvest and storage', 'https://seminisus.s3.amazonaws.com/app/uploads/2019/08/7057_SE_S1_Cucumber-Harvest-and-Storage.pdf'],
    ['Penn State Extension: Growing ground cherries', 'https://extension.psu.edu/growing-ground-cherries'],
    ['University of Delaware: Storage conditions for carryover seed (2025)', 'https://sites.udel.edu/weeklycropupdate/?p=27183']
  ]
};
})();
