/* The printer on the Greener tab: when a print pays back its plastic, the parts worth printing,
   the habits that keep a desktop printer green, and what to do with scrap and spools.
   Payback figures follow the Oct 30 report "yCube Alternatives: Media and Printed Pod". */
(function () {
const P = window.PB;
P.printer = {
  /* The view, in three rules */
  rules: [
    ['It replaces something you’d throw away', 'A printed pod takes the place of a yCube casing at every planting. Money pays back at the first planting, trash by the second, carbon after about eleven.'],
    ['It keeps a tower running', 'A Tank level float, a cover, a clip: a small part made here instead of a new one shipped over on the ferry, or a tower given up early. The towers themselves are the biggest footprint in the room.'],
    ['It lasts', 'A pod that cracks at its second planting never pays back its carbon. Solid walls, opaque PETG, and a gentle soak instead of the dishwasher.']
  ],
  skip: 'What never pays back: spares “just in case,” test prints you won’t use, and gadgets. That’s plastic with nothing to replace.',

  /* Factors. PETG: Prusa's life-cycle figures. Grid: New England, EPA eGRID2023 (539 lb/MWh).
     yCube vs plug, per planting: 5–30 g against 0.3–7 g CO2e in the report; the middle is about 10 g saved. */
  ef: { petg: 5.85, rpetg: 2.55 },       // kg CO2e per kg of filament
  grid: 0.2445,                           // kg CO2e per kWh
  netPerPlanting: 0.010,                  // kg CO2e saved each time a printed pod replaces a yCube
  standbyW: 6.5,                          // A1 mini sitting on: 6.1–7.3 W
  capEach: 6.00,                          // a Gardyn Cap: $29.99 for 5
  mats: [['petg', 'PETG'], ['rpetg', 'Recycled PETG'], ['other', 'Something else']],
  ycOptions: [[5.99, '$5.99, non-member with shipping'], [3.40, '$3.40, member credit'], [1.99, '$1.99, member extra yCube']],
  plugOptions: [[0.21, 'Rapid Rooter, $0.21'], [0.06, 'Jiffy-7C coir, $0.06'], [0.16, 'Grodan A-OK rockwool, $0.16'], [0.23, 'Root Riot, $0.23']],

  /* Parts worth printing. Grams and minutes are starting points: use what the slicer says. */
  parts: [
    { id: 'pod', name: 'Plug pod', g: 15, min: 60, kind: 'ycube', verdict: ['ok', 'Pays back'],
      what: 'Takes the place of the yCube casing at every planting, holding a Rapid Rooter or coir plug.',
      how: 'Mark its seat on the map when it goes in, and tap Replanted each time it takes a new plant.',
      model: ['jhalye’s Gardyn yCube Cup', 'https://makerworld.com/en/models/1134849-gardyn-ycube-cup'] },
    { id: 'berry', name: 'Strawberry pod', g: 18, min: 75, kind: 'ycube', verdict: ['wait', 'Trial first'],
      what: 'The plug pod with a collar that holds the crown above rinsed clay pebbles.',
      how: 'Two runners first, as the Strawberry trial stop says. Same payback as the plug pod once it works.',
      model: null },
    { id: 'cover', name: 'Cover for an open seat', g: 19, min: 70, kind: 'cap', verdict: ['ok', 'Pays back'],
      what: 'A printed cup with jhalye’s Cap in its mouth does a Gardyn Cap’s job on a seat you’re keeping clear: light and dust stay out.',
      how: 'Worth it for seats you would otherwise buy Caps for, like the headroom seats on the salad tower.',
      model: ['jhalye’s Gardyn yCube Cap', 'https://makerworld.com/en/models/1138174-gardyn-ycube-cap'] },
    { id: 'float', name: 'Tank level float', g: 8, min: 30, kind: 'repair', verdict: ['rep', 'A repair'],
      what: 'Both towers lost their level sensors, and Gardyn’s help center lists no replacement. A float with magnets, read by a reed switch or Hall sensor taped outside the Tank, tells you when it’s low without drilling anything.',
      how: 'Needs a couple of magnets, glue and a sensor. Set the sensor at the Tank Top-off line.',
      model: ['Water level float sensor (Printables)', 'https://www.printables.com/model/596924-water-level-sensor-float-sensor'] },
    { id: 'dipstick', name: 'Tank dipstick', g: 6, min: 25, kind: 'repair', verdict: ['rep', 'A repair'],
      what: 'The no-electronics fix: a flat strip that hooks over the Tank rim, notched at full and at the Tank Top-off line.',
      how: 'Design your own: measure the Tank depth with a ruler and mark both lines from one honest fill.',
      model: null },
    { id: 'standoff', name: 'Standoff cover', g: 5, min: 20, kind: 'health', verdict: ['wait', 'Only if it saves crowns'],
      what: 'An opaque disc on three short legs that shades the medium without pressing on a strawberry crown.',
      how: 'It replaces nothing you’d buy, so it earns its plastic only by keeping crowns dry.',
      model: null }
  ],

  /* Habits: what the research says about desktop printers */
  habits: [
    ['Batch it, then switch it off', 'Electricity is most of a desktop printer’s footprint, and idling is the waste. A printer left on all week to make one part has about ten times the impact of one kept busy; switched fully off between runs it does nearly as well. The A1 mini draws 6–7 W just sitting there, which comes to STANDBY a month at your rate: roughly what printing all 70 pods costs.'],
    ['No supports', 'jhalye’s cup prints without supports, so a pod wastes almost nothing. Keep any design you change that way.'],
    ['One pod first', 'Print one, check its fit in a yPod and under a yCover, then batch the rest.'],
    ['One color', 'Color changes purge filament. One opaque PETG for everything on the towers.'],
    ['Use it, or share it', 'A printer’s own manufacturing only shrinks into the background when it’s used. Neighbors need knobs, clips and brackets too, and every part printed on the island is one that doesn’t ride the ferry.']
  ],
  scrap: [
    ['Keep a PETG jar', 'Failed prints, brims and test pieces go in one jar: PETG only, nothing painted, glued or coated in bed adhesive.'],
    ['Not the recycling bin', 'Printed parts carry no resin code, so sorting facilities can’t identify them and reject them, and a stray lump of one plastic can jam a melt of another.'],
    ['Mail it back', 'Printerior, a filament maker in St. Louis, takes PLA and PETG scraps sorted by type and turns them back into filament. You pay the postage, or buy their prepaid bin ($114.99 for a 10-gallon PETG or PLA bin). A year of pod-making is a small box, not a bin.'],
    ['Spools', 'Buy refills that fit a reusable spool (Bambu’s is $10.99), or filament on cardboard spools, which go out with the cardboard.']
  ],
  notCounted: 'Not counted: the printer itself, and the parcels. Research on desktop printers finds a printer’s own manufacturing matters most when it sits idle; used often and switched off between jobs, it’s a small share. And every yCube that isn’t ordered is a box that doesn’t cross on the ferry, which the report calls the biggest lever and couldn’t put a number on.',
  src: [
    ['Bambu Lab wiki: power consumption', 'https://wiki.bambulab.com/en/general/power-consumption'],
    ['Faludi (Trellis): Is 3D printing an environmental win?', 'https://trellis.net/article/3d-printing-environmental-win/'],
    ['VentureWell: Environmental impacts of 3D printing', 'https://sustainabilityworkshop.venturewell.org/blog/environmental-impacts-3d-printing.html'],
    ['Prusa: PETG life-cycle assessment', 'https://blog.prusa3d.com/introducing-prusament-petg-recycled-with-calculated-life-cycle-assessment_65806/'],
    ['EPA eGRID2023 summary tables', 'https://www.epa.gov/system/files/documents/2025-06/summary_tables_rev2.pdf'],
    ['Tom’s Hardware: Can desktop recycling fix 3D printer waste? (Feb 2026)', 'https://www.tomshardware.com/3d-printing/can-desktop-recycling-fix-the-3d-printer-waste-problem'],
    ['Plastics Engineering: Printerior’s recycling program', 'https://plasticsengineering.org/2024/04/3d-printing-waste-printerior-designs-recycling-program-004215'],
    ['Printerior: 3D filament recycling bin', 'https://reach.dog/shop/printerior/products/3d-filament-recycling-bin'],
    ['Bambu Lab reusable spool', 'https://3dprintingusa.com/products/bambu-lab-reusable-spool'],
    ['Gardyn: Gardyn Cap', 'https://mygardyn.com/product/gardyn-cap/'],
    ['Gardyn Help: Water level troubleshooting', 'https://help.mygardyn.com/en/articles/1788737']
  ]
};
})();
