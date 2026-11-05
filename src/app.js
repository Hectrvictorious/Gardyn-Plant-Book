/* Swan's Island Plant Book: the app. Reads window.PB (data.js). No libraries. */
(function () {
  'use strict';
  const P = window.PB;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const APP_VERSION = P.version;
  const NEWS = ''; // one line per release, shown once to returning users; empty = nothing new to announce

  /* ----- Storage (this phone only) ----- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('pb:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('pb:' + k, JSON.stringify(v)); } catch (e) { /* storage off: the page still works */ } }
  };
  const KEYS = ['done', 'care', 'camp', 'notes', 'trail', 'ui', 'seenVersion', 'installLater'];
  let DONE = store.get('done', {});
  let CARE = store.get('care', {});
  let CAMP = store.get('camp', {});
  let NOTES = store.get('notes', {});
  let TRAIL = store.get('trail', {});
  const UI = Object.assign({ tower: 'S', mode: 'now', filter: 'tower' }, store.get('ui', {}));
  const saveUI = () => store.set('ui', UI);

  /* ----- Dates (Maine time) ----- */
  function todayISO() { const d = new Date(); const y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate(); return y + '-' + String(m).padStart(2, '0') + '-' + String(day).padStart(2, '0'); }
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function fmtDate(iso) { if (!iso) return ''; const [y, m, d] = iso.split('-').map(Number); return MONTHS[m - 1] + ' ' + d; }
  function dayNum(iso) { const [y, m, d] = iso.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 86400000); }
  function addDays(iso, n) { const t = new Date((dayNum(iso) + n) * 86400000); return t.getUTCFullYear() + '-' + String(t.getUTCMonth() + 1).padStart(2, '0') + '-' + String(t.getUTCDate()).padStart(2, '0'); }

  /* ----- Seats ----- */
  const COL = { L: 'left', C: 'center', R: 'right' };
  const ZONE = { high: 'High light', medium: 'Medium light', low: 'Low light' };
  const ZRANK = { low: 0, medium: 1, high: 2 };
  function parse(s) { const m = /^([SF])(\d+)([LCR])$/.exec(s || ''); return m ? { t: m[1], r: +m[2], c: m[3] } : null; }
  function zoneOf(s) { const p = parse(s); if (!p) return null; const { r, c } = p; if (r === 1 || r === 10) return 'low'; if (r === 2 || r === 9) return 'medium'; if (c === 'C') return 'high'; if (c === 'L') return r % 2 ? 'high' : 'medium'; return r % 2 ? 'medium' : 'high'; }
  function facing(s) { return parse(s).r % 2 ? 'right' : 'left'; }
  function seatName(s, tower) { const p = parse(s); if (!p) return s === 'dome' ? 'the dome' : s === 'sow' ? 'not sown yet' : s === 'out' ? 'comes out' : s; const base = 'row ' + p.r + ' ' + COL[p.c]; return tower ? (p.t === 'S' ? 'salad ' : 'fruiting ') + base : base; }
  function seatTitle(s) { const p = parse(s); return (p.t === 'S' ? 'Salad tower' : 'Fruiting tower') + ', row ' + p.r + ' ' + COL[p.c]; }
  function leanText(s) {
    const { r, c } = parse(s); const out = r % 2 ? 'R' : 'L';
    if (c === out) return 'Leans off the tower into open air.';
    if (c === 'C') return 'Leans toward the ' + (r % 2 ? 'right' : 'left') + ' pod.';
    return 'Leans across, toward the center pod.';
  }

  /* ----- Moves ----- */
  const POD = {}; P.pods.forEach(p => { POD[p.id] = p; });
  const MOVE_BY_POD = {}; P.moves.forEach(m => { if (m.pod) MOVE_BY_POD[m.pod] = m; });
  const mkey = m => m.pod ? 'm:' + m.pod : m.at ? 'c:' + m.at : 't:' + m.id;
  const isDone = m => !!DONE[mkey(m)];
  function cur(pod) { const m = MOVE_BY_POD[pod.id]; return (m && isDone(m)) ? pod.plan : pod.now; }
  function onTowerNow(pod) { return !!parse(cur(pod)); }
  function occupants(slot, except) { return P.pods.filter(p => p.id !== except && cur(p) === slot); }
  function capOnNow(slot) {
    const capMove = P.moves.find(m => m.kind === 'cap' && m.at === slot);
    if (capMove && isDone(capMove)) return P.holds.plan[slot] || { cap: true, note: 'Cap' };
    const h = P.holds.now[slot]; return h || null;
  }
  function readiness(m) {
    if (m.kind === 'task' || m.kind === 'out') return { ready: true };
    const slot = m.kind === 'cap' ? m.at : POD[m.pod].plan;
    const occ = occupants(slot, m.pod);
    if (occ.length) return { ready: false, why: occ.map(o => o.label).join(' and ') + ' still ' + (occ.length > 1 ? 'sit' : 'sits') + ' in ' + seatName(slot, true) };
    return { ready: true };
  }
  function setDone(m, on) { const k = mkey(m); if (on) DONE[k] = todayISO(); else delete DONE[k]; store.set('done', DONE); }

  function layout(t, mode) {
    const L = {};
    for (let r = 1; r <= 10; r++) for (const c of ['L', 'C', 'R']) L[t + r + c] = { pods: [], hold: null, next: [] };
    if (mode === 'plan') {
      P.pods.forEach(p => { if (L[p.plan]) L[p.plan].pods.push(p); });
      Object.keys(P.holds.plan).forEach(s => { if (L[s]) L[s].hold = P.holds.plan[s]; });
    } else {
      P.pods.forEach(p => { const s = cur(p); if (L[s]) L[s].pods.push(p); });
      Object.keys(L).forEach(s => { L[s].hold = capOnNow(s); });
      P.pods.forEach(p => { const m = MOVE_BY_POD[p.id]; if (m && !isDone(m) && L[p.plan] && m.kind === 'move') L[p.plan].next.push(p); });
      P.moves.forEach(m => { if (m.kind === 'cap' && !isDone(m) && L[m.at]) L[m.at].capNext = true; });
    }
    return L;
  }

  /* ----- Plant glyphs (32 x 32, drawn for this app) ----- */
  const petals = [0, 45, 90, 135, 180, 225, 270, 315].map(a => '<ellipse cx="16" cy="5.6" rx="2.5" ry="4.1" transform="rotate(' + a + ' 16 13)"/>').join('');
  const G = {
    leaf: '<path class="f" d="M6.5 25.5C7 15 13.5 7.5 25.5 6.5 25 18 17.5 25 6.5 25.5Z"/><path class="v" d="M4.5 27.5 9 23M8.6 23.4 21.5 10.5"/>',
    celery: '<path class="k" d="M12 29 13 13M16 29V11M20 29 19 13"/><circle class="f2" cx="12.5" cy="10" r="3.6"/><circle class="f2" cx="16" cy="7.4" r="3.9"/><circle class="f2" cx="19.5" cy="10" r="3.6"/>',
    spoon: '<path class="k2" d="M16 28 9.6 13.6M16 28V9M16 28l6.4-14.4"/><ellipse class="f" cx="8.6" cy="11" rx="4.2" ry="5.2" transform="rotate(-28 8.6 11)"/><ellipse class="f" cx="16" cy="7" rx="4.2" ry="5.2"/><ellipse class="f" cx="23.4" cy="11" rx="4.2" ry="5.2" transform="rotate(28 23.4 11)"/>',
    beet: '<path class="f" d="M16 19C10.5 15.5 9 9.5 11.5 4.5 15.5 7.5 17 13 16 19Z"/><path class="f" d="M16 19C21.5 15.5 23 9.5 20.5 4.5 16.5 7.5 15 13 16 19Z"/><circle class="f" cx="16" cy="23.5" r="5"/><path class="s" d="M16 28.5V31"/>',
    head: '<path class="f" d="M4.5 20.5C4.5 12.5 9.5 7 16 7s11.5 5.5 11.5 13.5c0 4.5-5 7-11.5 7S4.5 25 4.5 20.5Z"/><path class="s" d="M16 27.5c-2.5-4-2.5-10 0-15M16 27.5c2.5-4 2.5-10 0-15M9.5 25.5c-1-4 0-7.5 3-10M22.5 25.5c1-4 0-7.5-3-10"/>',
    frill: '<path class="f" d="M5 20c-1.5-2 0-4.5 2-5-.5-2.5 1.5-4.5 4-4.5.5-2.5 3-3.5 5-2.5 2-1 4.5 0 5 2.5 2.5 0 4.5 2 4 4.5 2 .5 3.5 3 2 5 1 2-.5 4.5-3 4.5-1 2-3.5 3-6 2.5-2.5.5-5-.5-6-2.5-2.5 0-4-2.5-3-4.5Z"/><path class="s" d="M16 26V13M11 24l3-6M21 24l-3-6"/>',
    cos: '<path class="f" d="M13.5 28.5C8.5 26 6 18.5 8 10.5c3.5 3.5 5.5 10 5.5 18Z"/><path class="f" d="M18.5 28.5C23.5 26 26 18.5 24 10.5c-3.5 3.5-5.5 10-5.5 18Z"/><path class="f" d="M16 28.5C11 24 11 12 16 3.5c5 8.5 5 20.5 0 25Z"/><path class="s" d="M16 27V8"/>',
    burnet: '<path class="s" d="M16 30V4"/><g class="f"><ellipse cx="11.5" cy="8.5" rx="3.2" ry="2.3"/><ellipse cx="20.5" cy="8.5" rx="3.2" ry="2.3"/><ellipse cx="11" cy="14.5" rx="3.4" ry="2.4"/><ellipse cx="21" cy="14.5" rx="3.4" ry="2.4"/><ellipse cx="10.5" cy="20.5" rx="3.6" ry="2.5"/><ellipse cx="21.5" cy="20.5" rx="3.6" ry="2.5"/><ellipse cx="16" cy="4" rx="2.4" ry="2.2"/></g>',
    shield: '<circle class="f2" cx="12.5" cy="19" r="8.5"/><path class="s" d="M12.5 19V10.5M12.5 19 5 15M12.5 19l-6 5.5M12.5 19l3 8M12.5 19l8-2.5"/><circle class="f" cx="24" cy="9" r="4.6"/><circle class="s0" cx="24" cy="9" r="1.3"/>',
    star: '<path class="s" d="M16 19v10.5M16 25.5l-4.5-2"/><path class="f" d="M16 3.5l2.6 7.4 7.8.2-6.2 4.8 2.3 7.5L16 19l-6.5 4.4 2.3-7.5-6.2-4.8 7.8-.2Z"/><circle class="s0" cx="16" cy="13" r="1.9"/>',
    feather: '<path class="kf" d="M16 30c-.5-8 .5-17 2.5-26M16.2 23 10 18M16.3 22.5 22.5 18.5M16.6 16.5 11 12M16.8 16 23 12.5M17.4 10.5 13 6.5M17.6 10 22 6.5"/>',
    mint: '<path class="s" d="M16 30V5"/><ellipse class="f" cx="10.5" cy="22" rx="5" ry="3.2" transform="rotate(-25 10.5 22)"/><ellipse class="f" cx="21.5" cy="22" rx="5" ry="3.2" transform="rotate(25 21.5 22)"/><ellipse class="f" cx="11" cy="13.5" rx="4.6" ry="3" transform="rotate(-25 11 13.5)"/><ellipse class="f" cx="21" cy="13.5" rx="4.6" ry="3" transform="rotate(25 21 13.5)"/><ellipse class="f" cx="16" cy="5.5" rx="2.6" ry="3.4"/>',
    succulent: '<path class="kr" d="M16 30c0-6-3-10-7-14M16 24c1.5-4 4.5-7 8-10M16 30V17"/><ellipse class="f" cx="8" cy="13.5" rx="2.6" ry="3.8" transform="rotate(-40 8 13.5)"/><ellipse class="f" cx="11.5" cy="20" rx="2.4" ry="3.4" transform="rotate(60 11.5 20)"/><ellipse class="f" cx="24.5" cy="12" rx="2.6" ry="3.8" transform="rotate(40 24.5 12)"/><ellipse class="f" cx="21" cy="19" rx="2.4" ry="3.4" transform="rotate(-60 21 19)"/><ellipse class="f" cx="16" cy="13.5" rx="2.6" ry="3.8"/>',
    pepper: '<path class="s" d="M16 9c0-2.5 1.2-4.5 3.5-5.5"/><path class="f" d="M12.5 10c-2.5 6-1.5 13.5 2.5 18.5 2 2 4.5 1 4.3-2.5-.2-5.5 1.2-10.5.7-16Z"/><path class="f2" d="M11.5 10.5c1.5-2.5 6.5-2.5 8.5-.5-2.5 1-5.5 1.2-8.5.5Z"/>',
    berry: '<path class="s" d="M16 9.5V4.5"/><path class="f" d="M16 28.5C9 24.5 6 17 9 11.5c2-2.5 12-2.5 14 0 3 5.5 0 13-7 17Z"/><path class="f2" d="M9.5 11.5 12 6.5l4 3.5 4-3.5 2.5 5c-2 1.5-10.5 1.5-13 0Z"/><g class="seed"><circle cx="13" cy="16" r=".85"/><circle cx="19" cy="16" r=".85"/><circle cx="16" cy="19.5" r=".85"/><circle cx="12.5" cy="21.5" r=".85"/><circle cx="19.5" cy="21.5" r=".85"/><circle cx="16" cy="24.5" r=".85"/></g>',
    tomato: '<path class="s" d="M5.5 6c4 0 8 2 11 6M16.5 12c1.5-2 4-3 7-3"/><circle class="f" cx="12" cy="20" r="6.3"/><circle class="f" cx="22" cy="17.5" r="5.3"/><path class="s" d="M12 13.7v2M10 14.5l2 1.2 2-1.2M22 12.2v1.8"/>',
    cuke: '<path class="s" d="M25.5 9 28.5 5"/><path class="f" d="M6.5 25.5c-2.5-3 3.5-13 12-18 4.5-2.7 8.5-1.5 7.5 2.5-1 3.5-7 11-13 15-2.5 1.7-5 2-6.5.5Z"/><g class="s0"><circle cx="13" cy="17" r=".8"/><circle cx="17.5" cy="13" r=".8"/><circle cx="21.5" cy="10" r=".8"/><circle cx="11.5" cy="21.5" r=".8"/><circle cx="16.5" cy="18" r=".8"/></g>',
    pod: '<path class="s" d="M6 8 4.5 4"/><path class="f" d="M6 8c4 0 7 4 9.5 9s6 8.5 11 9c.5 2.5-4.5 3.5-9 .5S8.5 17.5 6 8Z"/><path class="s" d="M10 12.5c.8 1 1.5 2 2 3M14.5 19c.8.9 1.6 1.8 2.5 2.5M19.5 24c1 .5 2 .9 3 1.1"/>',
    lantern: '<path class="s" d="M16 6V2.5"/><path class="f" d="M16 6c6 3.5 9 10.5 6.5 17C20.5 27.5 11.5 27.5 9.5 23 7 16.5 10 9.5 16 6Z"/><path class="s" d="M16 6c-3 5.5-3 14.5 0 21.5M16 6c3 5.5 3 14.5 0 21.5"/>',
    melon: '<path class="s" d="M16 8.5 17 4"/><ellipse class="f" cx="16" cy="18" rx="7.5" ry="9.5"/><path class="s" d="M16 8.5c-2.5 5-2.5 14 0 19M11 10.5c-2 4.5-2 11 0 15M21 10.5c2 4.5 2 11 0 15"/>',
    round: '<path class="s" d="M16 30V20M16 22 10 17M16 21l6-5M16 20v-6"/><circle class="f" cx="9.5" cy="15.5" r="3.8"/><circle class="f" cx="22.5" cy="14.5" r="3.8"/><circle class="f" cx="16" cy="10.5" r="4"/><circle class="f" cx="11" cy="23" r="3.2"/><circle class="f" cx="21.5" cy="22.5" r="3.2"/>',
    broccoli: '<path class="k" d="M13.5 21 12.5 29M18.5 21l1 8"/><circle class="f" cx="10.5" cy="13" r="5"/><circle class="f" cx="19" cy="10" r="5.2"/><circle class="f" cx="22.5" cy="17" r="4.5"/><circle class="f" cx="14" cy="18.5" r="5"/>',
    sunflower: '<path class="s" d="M16 21v9M16 26l4-2"/><g class="f">' + petals + '</g><circle class="s0b" cx="16" cy="13" r="4.2"/>',
    blades: '<path class="k" d="M16 29 10 6M16 29 14 4M16 29l3-24M16 29l7-21"/><path class="fw" d="M19 1.5l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3Z"/>',
    sprig: '<path class="s" d="M7 29C11 21 17 12 25 5"/><g class="f"><ellipse cx="8.2" cy="23.5" rx="2" ry="1.2" transform="rotate(-30 8.2 23.5)"/><ellipse cx="12.4" cy="24" rx="2" ry="1.2" transform="rotate(30 12.4 24)"/><ellipse cx="11.6" cy="18" rx="2" ry="1.2" transform="rotate(-30 11.6 18)"/><ellipse cx="15.8" cy="18.6" rx="2" ry="1.2" transform="rotate(30 15.8 18.6)"/><ellipse cx="15.3" cy="12.6" rx="2" ry="1.2" transform="rotate(-30 15.3 12.6)"/><ellipse cx="19.6" cy="13.2" rx="2" ry="1.2" transform="rotate(30 19.6 13.2)"/><ellipse cx="19.4" cy="7.6" rx="2" ry="1.2" transform="rotate(-30 19.4 7.6)"/><ellipse cx="23.4" cy="8.6" rx="2" ry="1.2" transform="rotate(30 23.4 8.6)"/></g>',
    cap: '<circle class="cap1" cx="16" cy="16" r="9.5"/><path class="cap2" d="M10.5 13.5a6.5 6.5 0 0 1 6.5-5"/>'
  };
  const SPECKLE = '<g class="dots"><circle cx="14.2" cy="13" r=".95"/><circle cx="17.6" cy="17" r=".95"/><circle cx="14.6" cy="21.2" r=".95"/><circle cx="10" cy="18.4" r=".85"/><circle cx="22" cy="19.4" r=".85"/><circle cx="17" cy="9.5" r=".8"/></g>';
  function glyph(kind, tint) { return '<svg class="gl t-' + (tint || 'leaf') + '" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' + (G[kind] || G.leaf) + (tint === 'speckle' ? SPECKLE : '') + '</svg>'; }
  const plantGlyph = pl => glyph(pl.glyph, pl.tint);
  const TAGS = { fav: '★', giant: '▲', bloom: '✿' };
  const tagStr = pl => (pl.tags || []).map(t => TAGS[t] || '').join('');

  /* ----- Masthead ----- */
  function renderDate() { const d = new Date(); $('mastDate').textContent = DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate(); }

  /* ----- Towers ----- */
  function renderTower() {
    const t = UI.tower, mode = UI.mode;
    document.querySelectorAll('[data-tower]').forEach(b => b.setAttribute('aria-pressed', b.dataset.tower === t ? 'true' : 'false'));
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false'));
    const L = layout(t, mode);
    const planted = Object.values(L).filter(c => c.pods.length).length;
    const caps = Object.values(L).filter(c => !c.pods.length && c.hold && c.hold.cap).length;
    $('towerName').textContent = P.towers[t].name;
    $('towerCount').textContent = planted + ' planted' + (caps ? ' · ' + caps + (caps === 1 ? ' Cap' : ' Caps') : '') + ' · ' + (30 - planted - caps) + ' open';
    $('towerSub').textContent = mode === 'plan'
      ? (t === 'S' ? 'The Nov 2 re-seating by light and space. The dots show plants that moved here; "new" ones come from the dome.' : 'The Nov 2 re-seating: strawberries out of dim row 10, a bean lane up the center, the TAM with headroom.')
      : 'Where everything sat on Oct 27, plus any moves you’ve ticked off. A pink arrow means the plant has a move waiting.';
    let pods = '';
    for (let r = 1; r <= 10; r++) for (const c of ['L', 'C', 'R']) pods += podHTML(t + r + c, L[t + r + c], mode);
    let bars = ''; for (let r = 1; r <= 10; r++) bars += '<span>' + r + '</span>';
    let barsR = ''; for (let r = 1; r <= 10; r++) barsR += '<span aria-hidden="true">' + (r % 2 ? '►' : '◄') + '</span>';
    $('towerWrap').innerHTML =
      '<div class="colhead" aria-hidden="true"><span></span><span>Left</span><span>Center</span><span>Right</span><span></span></div>' +
      '<div class="tower"><div class="bar" aria-hidden="true">' + bars + '</div><div class="cols">' + pods + '</div><div class="bar r" aria-hidden="true">' + barsR + '</div>' +
      '<div class="tank"><b>Tank</b><span>' + (t === 'S' ? 'Salad Tank · lighter feeding' : 'Fruiting Tank · Refresh every two weeks') + '</span></div></div>';
    $('legendMove').innerHTML = mode === 'plan' ? '<i class="chip" style="background:var(--band);color:var(--band-ink)">↥</i>&nbsp;moved here' : '<i class="chip acc">→</i>&nbsp;move waiting';
    renderDome();
  }

  function podHTML(slot, cell, mode) {
    const z = zoneOf(slot), f = facing(slot), p = parse(slot);
    const cls = ['pod', 'z-' + z, 'f-' + f];
    const where = 'Row ' + p.r + ' ' + COL[p.c] + ', ' + ZONE[z].toLowerCase() + ', faces ' + f;
    let inner = '', label = '';
    if (cell.pods.length) {
      const pod = cell.pods[0], pl = P.plants[pod.p];
      const m = MOVE_BY_POD[pod.id];
      let badge = '';
      if (mode === 'now' && m && !isDone(m)) { badge = m.kind === 'out' ? '<span class="mv out" aria-hidden="true">✕</span>' : '<span class="mv" aria-hidden="true">→</span>'; cls.push('moving'); }
      if (mode === 'plan' && pod.now !== pod.plan) badge = '<span class="mv from" aria-hidden="true">' + (parse(pod.now) ? '↥' : 'new') + '</span>';
      if (cell.pods.length > 1) cls.push('clash');
      const tg = tagStr(pl);
      inner = '<span class="top">' + plantGlyph(pl) + '<span class="t">' + tg + (cell.pods.length > 1 ? ' +' + (cell.pods.length - 1) : '') + '</span></span><span class="n">' + esc(pod.label) + '</span>' + badge;
      label = where + ': ' + cell.pods.map(x => x.label).join(' and ') + (badge ? (mode === 'now' ? ', move waiting' : ', moved here') : '');
      return '<button class="' + cls.join(' ') + '" data-slot="' + slot + '" data-pod="' + pod.id + '" aria-label="' + esc(label) + '">' + inner + '</button>';
    }
    if (cell.hold && cell.hold.cap) {
      cls.push('cap');
      inner = '<span class="top">' + glyph('cap', 'leaf') + '</span><span class="n">Cap</span>';
      label = where + ': Cap';
    } else {
      cls.push('open');
      let txt = 'open';
      if (cell.next && cell.next.length) txt = 'next: <i>' + esc(cell.next[0].label) + '</i>';
      else if (cell.capNext) txt = 'open · <i>Cap next</i>';
      else if (cell.hold && cell.hold.note) txt = esc(cell.hold.note.split(':')[0].toLowerCase());
      inner = '<span class="n">' + txt + '</span>';
      label = where + ': ' + txt.replace(/<[^>]+>/g, '');
    }
    return '<button class="' + cls.join(' ') + '" data-slot="' + slot + '" aria-label="' + esc(label) + '">' + inner + '</button>';
  }

  function renderDome() {
    const t = UI.tower;
    const list = P.pods.filter(p => (p.now === 'dome' || p.now === 'sow') && parse(p.plan) && parse(p.plan).t === t && !(MOVE_BY_POD[p.id] && isDone(MOVE_BY_POD[p.id])));
    $('domeSec').hidden = !list.length;
    $('domeTitle').textContent = t === 'S' ? 'In the dome, headed here' : 'In the dome or still to sow';
    $('dome').innerHTML = list.map(p => { const pl = P.plants[p.p]; return '<button data-pod="' + p.id + '" data-open="plant">' + plantGlyph(pl) + esc(p.label) + ' <small>' + (p.now === 'sow' ? 'to sow · ' : '') + '→ ' + esc(seatName(p.plan)) + '</small></button>'; }).join('');
  }

  /* ----- Today strip ----- */
  function careStatus(task) {
    const last = CARE[task.id];
    if (!last) return { state: 'none', text: 'Not logged yet', due: null };
    const next = addDays(last, task.every); const d = dayNum(next) - dayNum(todayISO());
    if (d < 0) return { state: 'over', text: (-d) + (d === -1 ? ' day' : ' days') + ' overdue', due: next };
    if (d === 0) return { state: 'due', text: 'Due today', due: next };
    return { state: 'ok', text: 'Due ' + (d === 1 ? 'tomorrow' : 'in ' + d + ' days'), due: next };
  }
  function renderToday() {
    const due = P.care.filter(c => { const s = careStatus(c).state; return s === 'over' || s === 'due'; });
    const unlogged = P.care.filter(c => careStatus(c).state === 'none').length;
    const ready = P.moves.filter(m => !isDone(m) && readiness(m).ready && !(P.phases[m.phase] || {}).gate).length;
    const done = P.moves.filter(isDone).length;
    $('today').innerHTML =
      '<button data-go="care" data-anchor="rhythm" class="' + (due.length ? 'hot' : '') + '"><span class="big">' + due.length + '</span><span class="lbl">care jobs due</span><span class="sub">' + (due.length ? esc(due.slice(0, 2).map(c => c.title).join(', ')) : unlogged ? unlogged + ' not logged yet' : 'All caught up') + '</span></button>' +
      '<button data-go="care" data-anchor="moves"><span class="big">' + ready + '</span><span class="lbl">moves ready now</span><span class="sub">' + done + ' of ' + P.moves.length + ' done</span></button>';
  }

  /* ----- Plant sheet ----- */
  function statTiles(pl) {
    const g = pl.gb || {};
    const tiles = [
      ['Sprouts in', g.sprout && /\d/.test(g.sprout) ? g.sprout + ' <small>days</small>' : esc(g.sprout || '—')],
      ['Matures in', g.mature && /^[\d≈–]+$/.test(g.mature) ? g.mature + ' <small>days</small>' : esc(g.mature || '—')],
      ['Light zone', g.zone ? '<span class="chip z-' + g.zone + '">' + ZONE[g.zone] + '</span>' : '—'],
      ['Plant size', esc(g.size || '—')],
      ['Care level', esc(g.care || '—')],
      ['Thin to', esc(g.thin || '—')]
    ];
    if (g.temp) tiles.push(['Likes', esc(g.temp)]);
    if (g.humidity) tiles.push(['Humidity', esc(g.humidity)]);
    if (g.sprout && /\d/.test(g.sprout) && !pl.notGardyn) tiles.push(['Standard dose', '<small>at true leaves or ½-in roots</small>']);
    while (tiles.length % 3) tiles.push(['', '']);
    return '<div class="stats">' + tiles.map(([k, v]) => '<div>' + (k ? '<span class="k">' + k + '</span><span class="v">' + v + '</span>' : '') + '</div>').join('') + '</div>';
  }
  function seatCheck(pl, slot) {
    const seat = zoneOf(slot), want = pl.gb && pl.gb.zone; if (!want) return '';
    const d = ZRANK[seat] - ZRANK[want];
    if (d === 0) return 'Gardyn’s own zone for it.';
    if (d === 1) return 'One zone brighter than Gardyn lists; its kit layouts do the same.';
    if (d === -1) return 'One zone dimmer than Gardyn lists, which its fallback rule allows.';
    if (d >= 2) return 'Two zones brighter than Gardyn lists.';
    return 'Two zones dimmer than Gardyn lists.';
  }
  function twoUp(slot, mode) {
    const p = parse(slot); if (p.r <= 2) return 'Two rows up: the top of the tower, open air.';
    const up = p.t + (p.r - 2) + p.c; const L = layout(p.t, mode); const c = L[up];
    if (c.pods.length) return 'Two rows up on its side: ' + c.pods.map(x => x.label).join(' and ') + '.';
    if (c.hold && c.hold.cap) return 'Two rows up on its side: a Cap, kept clear for its headroom.';
    return 'Two rows up on its side: an open pod.';
  }
  function partnerOf(pod) {
    const m = / ([AB])$/.exec(pod.label); if (!m) return null;
    const want = pod.label.slice(0, -1) + (m[1] === 'A' ? 'B' : 'A');
    return P.pods.find(x => x.label === want) || null;
  }
  function seatCard(pod) {
    const pl = P.plants[pod.p]; const m = MOVE_BY_POD[pod.id];
    const here = UI.mode === 'plan' ? pod.plan : cur(pod);
    const onTower = parse(here);
    let h = '<div class="seat' + (m && !isDone(m) ? ' acc' : '') + '">';
    h += '<div class="eyebrow">' + esc(pod.label) + (UI.mode === 'plan' ? ' · Nov 2 plan' : ' · now') + '</div>';
    if (onTower) {
      const z = zoneOf(here);
      h += '<h3>' + esc(seatTitle(here)) + '</h3><div class="btnrow"><span class="chip z-' + z + '">' + ZONE[z] + '</span><span class="chip">Faces ' + facing(here) + ' ' + (facing(here) === 'right' ? '►' : '◄') + '</span></div>';
      const lines = [seatCheck(pl, here), leanText(here), twoUp(here, UI.mode)];
      const partner = partnerOf(pod); if (partner) { const ps = UI.mode === 'plan' ? partner.plan : cur(partner); lines.push('Its pair, ' + partner.label + ', is ' + (parse(ps) ? 'at ' + seatName(ps, parse(ps).t !== parse(here).t) : 'in ' + seatName(ps)) + '.'); }
      if (pod.seat) lines.push(pod.seat);
      h += '<ul>' + lines.filter(Boolean).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    } else {
      h += '<h3>' + (here === 'dome' ? 'In the dome' : here === 'sow' ? 'Not sown yet' : 'Out') + '</h3>';
    }
    if (pod.unsure) h += '<p class="small" style="margin:0"><b>To confirm:</b> ' + esc(pod.unsure) + '</p>';
    if (pod.note) h += '<p class="small" style="margin:0">' + esc(pod.note) + '</p>';
    if (m) {
      const done = isDone(m);
      const dest = m.kind === 'out' ? 'Comes out' : 'Moves to ' + seatName(pod.plan, true);
      const ph = P.phases[m.phase];
      const rd = readiness(m);
      h += '<div class="callout"><b>' + esc(done ? (m.kind === 'out' ? 'Out since ' : 'Moved on ') + fmtDate(DONE[mkey(m)]) : dest) + '</b>' +
        (done ? '' : '<div class="small">' + esc(ph ? ph.title : '') + (m.when ? ' · ' + esc(m.when) : '') + '</div>' + (rd.ready ? '' : '<div class="small" style="color:var(--warn)">Waiting: ' + esc(rd.why) + '.</div>')) +
        '<div class="btnrow" style="margin-top:8px"><button class="btn small ' + (done ? 'ghost' : 'primary') + '" data-act="toggleMove" data-pod="' + pod.id + '">' + (done ? 'Undo' : (m.kind === 'out' ? 'Mark it out' : 'Mark it moved')) + '</button></div></div>';
    }
    return h + '</div>';
  }
  function plantSheet(pid, podId) {
    const pl = P.plants[pid]; if (!pl) return;
    const pods = P.pods.filter(p => p.p === pid);
    let h = '<div class="ph"><div class="gwrap">' + plantGlyph(pl) + '</div><div><div class="eyebrow">' + esc(P.groups[pl.group]) + (pl.notGardyn ? ' · not in Gardyn’s catalog' : ' · Gardyn Plant Book') + statusWord(pl) + '</div><h2 id="sheetTitle">' + esc(pl.name) + (tagStr(pl) ? ' <span class="muted" style="font-size:18px">' + tagStr(pl) + '</span>' : '') + '</h2><div class="latin">' + esc(pl.latin) + '</div></div></div>';
    if (podId && POD[podId]) h += seatCard(POD[podId]);
    if (pl.why) h += '<div class="callout"><b>Why it’s on the list.</b> ' + esc(pl.why) + '</div>';
    if (pl.gone) h += '<div class="callout"><b>Why it’s retired.</b> ' + esc(pl.gone) + '</div>';
    h += '<div class="block"><h3>Growing basics</h3>' + statTiles(pl) + (pl.gb && pl.gb.zoneNote ? '<p class="small">' + esc(pl.gb.zoneNote) + '</p>' : '') + (pl.gb && pl.gb.note ? '<p class="small">' + esc(pl.gb.note) + '</p>' : '') + '</div>';
    if (pods.length) {
      h += '<div class="block"><h3>On your towers</h3><ul>' + pods.map(p => { const c = cur(p), m = MOVE_BY_POD[p.id]; const now = parse(c) ? seatName(c, true) : seatName(c); const plan = p.plan === 'out' ? 'comes out' : seatName(p.plan, true); return '<li><button class="btn small ghost" data-open="pod" data-pod="' + p.id + '">' + esc(p.label) + '</button> ' + esc(now) + (m && !isDone(m) ? ' → ' + esc(plan) : '') + '</li>'; }).join('') + '</ul></div>';
    }
    if (pl.yours && pl.yours.length) h += '<div class="block"><h3>Your notes</h3><ul>' + pl.yours.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>';
    if (pl.harvest) h += '<div class="block"><h3>Harvest</h3><ul>' + pl.harvest.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>';
    if (pl.care || pl.pests) h += '<div class="block"><h3>Care</h3><ul>' + (pl.care || []).map(x => '<li>' + esc(x) + '</li>').join('') + (pl.pests ? '<li><b>Common pests:</b> ' + esc(pl.pests) + '</li>' : '') + '</ul></div>';
    if (pl.taste) h += '<div class="block"><h3>Taste and use</h3><p>' + esc(pl.taste) + '</p></div>';
    if (pl.about || pl.origin) h += '<div class="block"><h3>Qualities and origin</h3>' + (pl.about ? '<p>' + esc(pl.about) + '</p>' : '') + (pl.origin ? '<p class="small" style="margin-top:6px">' + esc(pl.origin) + '</p>' : '') + '</div>';
    h += journalHTML(pid);
    h += '<p class="src">Sources: ' + (pl.src || []).map(s => '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + '</a>').join(' · ') + '</p>';
    showSheet(h, { kind: 'plant', pid, podId });
  }
  function statusWord(pl) { return { dome: ' · in the dome', planned: ' · planned', idea: ' · an idea', retired: ' · retired' }[pl.status] || ''; }
  function journalHTML(pid) {
    const list = NOTES[pid] || [];
    return '<div class="block journal"><h3>Your journal</h3><textarea id="jText" placeholder="First harvest, a root trim, a pest sighting…" aria-label="Add a note"></textarea><div class="btnrow"><button class="btn small primary" data-act="addNote" data-pid="' + pid + '">Add note</button></div>' +
      (list.length ? '<ul class="jlist">' + list.slice().reverse().map((n, i) => '<li><div><div class="d">' + esc(fmtDate(n.d)) + '</div>' + esc(n.t) + '</div><button data-act="delNote" data-pid="' + pid + '" data-i="' + (list.length - 1 - i) + '" aria-label="Delete note">Delete</button></li>').join('') + '</ul>' : '') + '</div>';
  }
  function seatSheet(slot) {
    const mode = UI.mode, L = layout(parse(slot).t, mode), cell = L[slot], z = zoneOf(slot);
    let h = '<div><div class="eyebrow">' + (mode === 'plan' ? 'Nov 2 plan' : 'Now') + '</div><h2 id="sheetTitle">' + esc(seatTitle(slot)) + '</h2></div>';
    h += '<div class="seat"><div class="btnrow"><span class="chip z-' + z + '">' + ZONE[z] + '</span><span class="chip">Faces ' + facing(slot) + '</span></div><ul>';
    if (cell.hold && cell.hold.note) h += '<li>' + esc(cell.hold.note) + '.</li>';
    else if (cell.hold && cell.hold.cap) h += '<li>A Cap keeps this pod clear.</li>';
    else h += '<li>Open.</li>';
    if (cell.next && cell.next.length) h += '<li>Next in: ' + esc(cell.next.map(p => p.label).join(', ')) + ' (from ' + esc(seatName(cell.next[0].now, true)) + ').</li>';
    if (cell.capNext) h += '<li>A Cap goes on here in the Nov 2 plan.</li>';
    h += '<li>' + esc(leanText(slot)) + '</li><li>' + esc(twoUp(slot, mode)) + '</li></ul></div>';
    const fits = Object.entries(P.plants).filter(([id, pl]) => pl.status === 'idea' && pl.gb && pl.gb.zone && Math.abs(ZRANK[pl.gb.zone] - ZRANK[z]) <= (z === 'low' ? 0 : 1)).slice(0, 4);
    if (fits.length && !cell.hold?.cap) h += '<div class="block"><h3>Ideas that suit this light</h3><div class="dome">' + fits.map(([id, pl]) => '<button data-open="plant" data-pid="' + id + '">' + plantGlyph(pl) + esc(pl.name) + '</button>').join('') + '</div></div>';
    showSheet(h, { kind: 'seat', slot });
  }

  /* ----- Plant list ----- */
  const FILTERS = [['tower', 'On the towers'], ['dome', 'Dome and planned'], ['idea', 'Ideas'], ['retired', 'Retired'], ['all', 'All']];
  const inFilter = (pl, f) => f === 'all' || (f === 'dome' ? (pl.status === 'dome' || pl.status === 'planned') : pl.status === f);
  function plantWhere(pid) {
    const pods = P.pods.filter(p => p.p === pid); if (!pods.length) return '';
    const onS = pods.filter(p => parse(cur(p)) && parse(cur(p)).t === 'S').length, onF = pods.filter(p => parse(cur(p)) && parse(cur(p)).t === 'F').length;
    const waiting = pods.filter(p => !parse(cur(p))).length;
    const moving = pods.filter(p => { const m = MOVE_BY_POD[p.id]; return m && !isDone(m) && parse(cur(p)); }).length;
    const bits = [];
    if (onS) bits.push(onS + ' on the salad tower');
    if (onF) bits.push(onF + ' on the fruiting tower');
    if (waiting) bits.push(pods.length === 1 ? (pods[0].now === 'sow' ? 'to sow' : 'in the dome') + ' → ' + seatName(pods[0].plan, true) : waiting + ' to sow or in the dome');
    if (moving) bits.push(moving + ' moving');
    return bits.join(' · ');
  }
  function renderPlants() {
    const q = ($('q').value || '').trim().toLowerCase();
    const ids = Object.keys(P.plants);
    const counts = {}; FILTERS.forEach(([f]) => { counts[f] = ids.filter(id => inFilter(P.plants[id], f)).length; });
    $('filters').innerHTML = FILTERS.map(([f, l]) => '<button data-filter="' + f + '" aria-pressed="' + (UI.filter === f) + '">' + l + '<span class="n">' + counts[f] + '</span></button>').join('');
    const match = id => { if (!q) return true; const pl = P.plants[id]; const hay = [pl.name, pl.latin, pl.pests, pl.about, pl.taste, (pl.gb && pl.gb.zone) + ' light', P.groups[pl.group], (pl.yours || []).join(' '), pl.why, pl.gone].join(' ').toLowerCase(); return q.split(/\s+/).every(w => hay.includes(w)); };
    const list = ids.filter(id => (q ? true : inFilter(P.plants[id], UI.filter)) && match(id));
    const order = { tower: 0, dome: 1, planned: 1, idea: 2, retired: 3 };
    list.sort((a, b) => (order[P.plants[a].status] - order[P.plants[b].status]) || P.plants[a].name.localeCompare(P.plants[b].name));
    $('plist').innerHTML = list.length ? list.map(id => { const pl = P.plants[id]; const g = pl.gb || {}; const where = plantWhere(id); return '<button class="prow" data-open="plant" data-pid="' + id + '"><span class="gwrap">' + plantGlyph(pl) + '</span><span style="min-width:0"><span class="nm">' + esc(pl.name) + (tagStr(pl) ? ' <span class="muted" style="font-size:13px">' + tagStr(pl) + '</span>' : '') + '</span><span class="lt" style="display:block">' + esc(pl.latin) + '</span>' + (where ? '<span class="wh" style="display:block">' + esc(where) + '</span>' : pl.why ? '<span class="wh" style="display:block">An idea to try</span>' : pl.gone ? '<span class="wh" style="display:block">Retired</span>' : '') + '</span><span class="rt">' + (g.zone ? '<span class="chip z-' + g.zone + '">' + g.zone + '</span>' : '') + (/\d/.test(g.mature || '') ? '<span class="days">' + esc(g.mature) + ' days</span>' : '') + '</span></button>'; }).join('') : '<div class="card small">No plant matches “' + esc(q) + '”. Try a pest, a light zone, or part of a name.</div>';
  }

  /* ----- Care ----- */
  function renderCare() {
    const rows = P.care.map(c => ({ c, s: careStatus(c) }));
    const rank = { over: 0, due: 1, none: 2, ok: 3 };
    rows.sort((a, b) => (rank[a.s.state] - rank[b.s.state]) || (a.c.every - b.c.every));
    const dueN = rows.filter(r => r.s.state === 'over' || r.s.state === 'due').length;
    $('dueCount').textContent = dueN ? dueN + ' due' : '';
    $('rhythm').innerHTML = rows.map(({ c, s }) => {
      const chip = s.state === 'over' ? 'due' : s.state === 'due' ? 'due' : s.state === 'ok' ? 'ok' : '';
      const doneToday = CARE[c.id] === todayISO();
      return '<div class="task"><div><h4>' + esc(c.title) + '</h4><div class="where">' + esc(c.where) + ' · every ' + everyText(c.every) + '</div></div><div class="st"><span class="chip ' + chip + '">' + esc(s.text) + '</span>' +
        (doneToday ? '<button class="btn small ghost" data-act="careUndo" data-id="' + c.id + '">Undo</button>' : '<button class="btn small' + (s.state === 'over' || s.state === 'due' ? ' primary' : '') + '" data-act="careDone" data-id="' + c.id + '">Done today</button>') + '</div><div class="txt">' + esc(c.text) + '<label class="last">Last done <input type="date" data-care-date="' + c.id + '" value="' + (CARE[c.id] || '') + '" max="' + todayISO() + '" aria-label="Last done: ' + esc(c.title) + ', ' + esc(c.where) + '"></label></div></div>';
    }).join('');
    renderCamps(); renderMoves(); renderFixes();
  }
  function everyText(n) { return n === 7 ? 'week' : n === 14 ? '2 weeks' : n === 30 ? 'month' : n === 90 ? '3 months' : n + ' days'; }
  function renderCamps() {
    $('camps').innerHTML = P.campaigns.map(c => {
      const st = CAMP[c.id] || [];
      let body = '';
      if (c.id === 'gnats') {
        body = '<div class="camp-rounds">' + [0, 1, 2].map(i => { const d = st[i]; const prev = st[i - 1]; const next = !d && (i === 0 || prev) ? (i === 0 ? '' : ' · due ' + fmtDate(addDays(prev, 7))) : ''; return '<button class="btn small ' + (d ? 'ghost' : (i === 0 || prev) ? 'primary' : '') + '" data-act="camp" data-id="gnats" data-i="' + i + '"' + (!d && i > 0 && !prev ? ' disabled' : '') + '>' + (d ? 'Round ' + (i + 1) + ' · ' + fmtDate(d) : 'Round ' + (i + 1) + next) + '</button>'; }).join('') + '</div>' + (st.length === 3 ? '<p class="small" style="margin:6px 0 0">Three rounds done. Keep the sticky cards up; if the catch keeps climbing, run another round.</p>' : '');
      } else {
        const start = st[0];
        if (start) { const back = addDays(start, c.weeks * 7); const d = dayNum(back) - dayNum(todayISO()); body = '<p class="small" style="margin:6px 0 0">Off since ' + fmtDate(start) + '. ' + (d > 0 ? 'Reassess on ' + fmtDate(back) + ' (' + d + ' days).' : 'Three weeks are up: check the hygrometer before turning it back on.') + '</p><div class="btnrow" style="margin-top:6px"><button class="btn small ghost" data-act="camp" data-id="humidifier" data-i="clear">Clear</button></div>'; }
        else body = '<div class="btnrow" style="margin-top:8px"><button class="btn small primary" data-act="camp" data-id="humidifier" data-i="0">I turned it off today</button></div>';
      }
      return '<div class="card"><h4>' + esc(c.title) + '</h4><p class="small">' + esc(c.text) + '</p>' + body + '</div>';
    }).join('');
  }
  function moveLine(m) {
    if (m.kind === 'task' || m.kind === 'cap') return '<span class="mv-t">' + esc(m.text) + '</span>';
    const pod = POD[m.pod];
    if (m.kind === 'out') return '<span class="mv-t"><b>' + esc(pod.label) + '</b> comes out of ' + esc(seatName(pod.now, true)) + '</span>';
    const from = pod.now === 'dome' ? 'dome' : pod.now === 'sow' ? 'Nursery' : seatName(pod.now, true);
    return '<span class="mv-t"><b>' + esc(pod.label) + '</b> ' + esc(from) + ' → ' + esc(seatName(pod.plan, true)) + (m.when ? '<span class="when">' + esc(m.when) + '</span>' : '') + '</span>';
  }
  function renderMoves() {
    const total = P.moves.length, done = P.moves.filter(isDone).length;
    $('moveCount').textContent = done + ' of ' + total + ' done';
    $('moveBar').style.width = Math.round(done / total * 100) + '%';
    $('moves').innerHTML = P.phaseOrder.map(ph => {
      const items = P.moves.filter(m => m.phase === ph); if (!items.length) return '';
      const meta = P.phases[ph];
      return '<div class="phase"><h4>' + esc(meta.title) + '</h4><p>' + esc(meta.sub) + '</p>' + items.map(m => {
        const d = isDone(m), rd = readiness(m);
        const gate = (P.phases[m.phase] || {}).gate;
        const status = d ? '<span class="chip ok">Done ' + fmtDate(DONE[mkey(m)]) + '</span>' : !rd.ready ? '<span class="chip wait">Waiting</span>' : gate ? (m.kind === 'move' || m.kind === 'cap' ? '<span class="chip ok">Seat is free</span><span class="small muted">At ' + esc(gate) + '</span>' : '<span class="chip">At ' + esc(gate) + '</span>') : '<span class="chip ok">Ready</span>';
        const pod = m.pod ? POD[m.pod] : null;
        return '<div class="mv-item' + (d ? ' done' : '') + '"><button class="tick" aria-pressed="' + d + '" data-act="toggleMoveKey" data-key="' + esc(mkey(m)) + '" aria-label="' + (d ? 'Mark not done' : 'Mark done') + '"><svg viewBox="0 0 16 16"><path d="M3 8.5l3 3 7-7"/></svg></button><div>' + moveLine(m) +
          '<div class="mv-meta">' + status + (!d && !rd.ready ? '<span class="small" style="color:var(--warn)">' + esc(rd.why) + '</span>' : '') + (pod ? '<button class="btn small ghost" data-open="pod" data-pod="' + pod.id + '">Open</button>' : '') + '</div></div></div>';
      }).join('') + '</div>';
    }).join('');
  }
  function renderFixes() {
    $('fixes').innerHTML = P.fixes.map(f => '<button class="fix" data-open="fix" data-id="' + f.id + '"><span><h4>' + esc(f.title) + '</h4><span class="small">' + esc(f.sub) + '</span></span><span class="go" aria-hidden="true">›</span></button>').join('');
  }

  /* ----- Ideas ----- */
  function renderIdeas() {
    const ideas = Object.entries(P.plants).filter(([, pl]) => pl.status === 'idea');
    $('ideaPlants').innerHTML = ideas.map(([id, pl]) => { const g = pl.gb || {}; return '<button class="idea" data-open="plant" data-pid="' + id + '"><span class="gwrap">' + plantGlyph(pl) + '</span><span style="min-width:0"><h4>' + esc(pl.name) + '</h4><p>' + esc(pl.why) + '</p><span class="chips"><span class="chip z-' + g.zone + '">' + ZONE[g.zone] + '</span><span class="chip">' + esc(g.sprout) + ' days to sprout</span><span class="chip">' + esc(g.mature) + ' to harvest</span></span></span></button>'; }).join('');
    $('gear').innerHTML = P.gear.map(g => '<div><b>' + esc(g.title) + '</b><p>' + esc(g.why) + '</p></div>').join('');
    $('questions').innerHTML = P.questions.map(q => '<div><b>' + esc(q.q) + '</b><p>' + esc(q.a) + '</p></div>').join('');
    $('watch').innerHTML = P.watch.map(w => '<div><b>' + esc(w.title) + '</b><p>' + esc(w.text) + '</p></div>').join('');
    $('aboutVersion').textContent = 'Version ' + APP_VERSION + (window.__BUILD__ ? ' · build ' + window.__BUILD__ : '');
  }

  /* ----- DIY ----- */
  function trailState(id) { return TRAIL[id] || 'todo'; }
  function renderTrail() {
    const stops = P.trail; const firstOpen = stops.findIndex(s => trailState(s.id) !== 'done');
    const W = Math.max(200, Math.round(($('trail').clientWidth || 320) - 8));
    let h = '';
    stops.forEach((s, i) => {
      const st = trailState(s.id); const alt = i % 2 === 1;
      if (i > 0) { const prevDone = trailState(stops[i - 1].id) === 'done'; const x0 = 26, x1 = W - 26; const a = alt ? 'M' + x0 + ' 0 C ' + x0 + ' 24, ' + x1 + ' 16, ' + x1 + ' 40' : 'M' + x1 + ' 0 C ' + x1 + ' 24, ' + x0 + ' 16, ' + x0 + ' 40'; h += '<svg class="link' + (prevDone ? ' done' : '') + '" viewBox="0 0 ' + W + ' 40" preserveAspectRatio="none" aria-hidden="true"><path d="' + a + '"/></svg>'; }
      h += '<button class="stn ' + st + (alt ? ' alt' : '') + '" data-open="stop" data-id="' + s.id + '"><span class="node">' + (st === 'done' ? '✓' : i) + '</span><span style="min-width:0"><h4>' + esc(s.title) + '</h4><span class="when">' + esc(s.when) + (st === 'doing' ? ' · underway' : '') + '</span>' + (i === firstOpen ? '<br><span class="chip acc here">You are here</span>' : '') + '</span></button>';
    });
    $('trail').innerHTML = h;
  }
  function renderDIY() {
    renderTrail();
    $('why').innerHTML = P.why.map(([t, x]) => '<div class="card"><h4>' + esc(t) + '</h4><p>' + esc(x) + '</p></div>').join('');
    $('fillList').innerHTML = P.fill.map(f => '<div><div class="rowtop"><b>' + esc(f.crop) + '</b><span class="chip">' + esc(f.cost) + ' each</span></div><p><span class="fillname">' + esc(f.fill) + '.</span> ' + esc(f.note) + '</p></div>').join('');
    $('briefTbl').innerHTML = '<tbody>' + P.brief.map(([k, v]) => '<tr><td class="k">' + esc(k) + '</td><td>' + esc(v) + '</td></tr>').join('') + '</tbody>';
    $('cleanPods').innerHTML = P.cleanPods;
    $('mediaList').innerHTML = P.media.map(m => '<div><div class="rowtop"><b>' + esc(m.name) + '</b><span class="chip' + (/Dries|Drier/.test(m.top) ? ' ok' : '') + '">' + esc(m.top) + '</span></div><p>' + esc(m.note) + '</p><div class="facts"><span>Water held <b class="num">' + esc(m.water) + '</b></span><span>Each <b class="num">' + esc(m.cost) + '</b></span></div></div>').join('');
    $('models').innerHTML = P.models.map(([t, u, n]) => '<div><b><a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(t) + '</a></b><p>' + esc(n) + '</p></div>').join('') + P.shop.map(([t, u, n]) => '<div><b><a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(t) + '</a></b><p>' + esc(n) + '</p></div>').join('');
    $('bench').innerHTML = P.bench.map(b => '<div><b>' + esc(b.title) + '</b><p>' + esc(b.text) + '</p></div>').join('');
    renderCalc();
  }
  const CALC = { slots: 60, rot: 2, ycube: 5.99, plug: 0.21, berries: 11 };
  function renderCalc() {
    const el = $('calc');
    if (!el.dataset.ready) {
      el.innerHTML = '<div class="fields">' +
        '<label for="cYc">yCube price<select id="cYc"><option value="5.99">$5.99, non-member with shipping</option><option value="3.40">$3.40, member credit ($408 a year ÷ 120)</option><option value="1.99">$1.99, member extra yCube</option></select></label>' +
        '<label for="cPlug">Plug in the printed pod<select id="cPlug"><option value="0.21">Rapid Rooter, $0.21</option><option value="0.06">Jiffy-7C coir, $0.06</option><option value="0.16">Grodan A-OK rockwool, $0.16</option><option value="0.23">Root Riot, $0.23</option></select></label>' +
        '<label for="cRot">Plantings per pod per year<input id="cRot" type="number" min="1" max="6" step="1" value="2" inputmode="numeric"></label>' +
        '<label for="cBer">Strawberry pods on pebbles<input id="cBer" type="number" min="0" max="30" step="1" value="11" inputmode="numeric"></label>' +
        '</div><div class="bars" id="cBars"></div><div class="save" id="cSave"></div><p class="small" style="margin:0" id="cNote"></p>';
      el.dataset.ready = '1';
      ['cYc', 'cPlug', 'cRot', 'cBer'].forEach(id => $(id).addEventListener('input', renderCalc));
    }
    const yc = +$('cYc').value, plug = +$('cPlug').value; const rot = Math.max(1, Math.min(6, +$('cRot').value || 2)); const ber = Math.max(0, Math.min(30, +$('cBer').value || 0));
    const plantings = CALC.slots * rot;
    const ycYear = plantings * yc;
    const pods = 21, reprint = 5, leca = ber > 0 ? 12.05 : 0;
    const plugsYear = (CALC.slots - ber) * rot * plug;
    const ppYear1 = pods + leca + plugsYear, pp5 = pods + leca + plugsYear * 5 + reprint, yc5 = ycYear * 5;
    const max = Math.max(yc5, 1);
    const bar = (lbl, a, b) => '<div class="barrow"><span class="lbl">' + lbl + '</span><span class="track"><span class="b yc" style="width:' + (a / max * 100).toFixed(1) + '%"></span><span class="v">yCubes $' + Math.round(a).toLocaleString() + '</span><span class="b pp" style="width:' + Math.max(0.6, b / max * 100).toFixed(1) + '%"></span><span class="v">Printed pods $' + Math.round(b).toLocaleString() + '</span></span></div>';
    $('cBars').innerHTML = bar('First year', ycYear, ppYear1) + bar('Five years', yc5, pp5);
    $('cSave').innerHTML = 'Saves about <span>$' + Math.round(ycYear - ppYear1).toLocaleString() + '</span> the first year and <span>$' + Math.round(ycYear - plugsYear).toLocaleString() + '</span> a year after';
    $('cNote').textContent = 'Two towers, 60 pods, ' + plantings + ' plantings a year. Printed pods: 70 pods at 15 g of $20/kg PETG ($21 once, $5 of reprints over five years), ' + (ber ? 'one $12 bag of clay pebbles for the strawberries, ' : '') + 'and plugs for the other ' + (CALC.slots - ber) + ' pods. Seeds not counted on either side; the membership also buys Smart Watering.';
  }
  function stopSheet(id) {
    const s = P.trail.find(x => x.id === id); const i = P.trail.indexOf(s); const st = trailState(id);
    const h = '<div><div class="eyebrow">Beyond the yCube · stop ' + i + ' of ' + (P.trail.length - 1) + '</div><h2 id="sheetTitle">' + esc(s.title) + '</h2><div class="small">' + esc(s.when) + '</div></div><div class="card prose">' + s.body + '</div>' +
      '<div class="seg" role="group" aria-label="Status">' + [['todo', 'To do'], ['doing', 'Underway'], ['done', 'Done']].map(([k, l]) => '<button data-act="stop" data-id="' + id + '" data-st="' + k + '" aria-pressed="' + (st === k) + '">' + l + '</button>').join('') + '</div>';
    showSheet(h, { kind: 'stop', id });
  }
  function fixSheet(id) { const f = P.fixes.find(x => x.id === id); showSheet('<div><div class="eyebrow">Fixes</div><h2 id="sheetTitle">' + esc(f.title) + '</h2><div class="small">' + esc(f.sub) + '</div></div><div class="card prose">' + f.body + '</div>', { kind: 'fix', id }); }

  /* ----- Sheet ----- */
  let SHEET = null;
  const sheetOpen = () => !$('sheet').hidden;
  function showSheet(html, state) {
    const s = $('sheet'), b = $('sheetBack');
    const was = sheetOpen();
    $('sheetIn').innerHTML = html; SHEET = state || {};
    s.hidden = false; b.hidden = false;
    if (!was) { s.scrollTop = 0; requestAnimationFrame(() => { s.classList.add('show'); b.classList.add('show'); }); try { history.pushState({ sheet: 1 }, '', location.href); } catch (e) {} }
    const t = $('sheetTitle'); if (t && !was) { t.setAttribute('tabindex', '-1'); try { t.focus({ preventScroll: true }); } catch (e) {} }
  }
  function hideSheet(fromPop) {
    const s = $('sheet'), b = $('sheetBack');
    s.classList.remove('show'); b.classList.remove('show'); SHEET = null;
    setTimeout(() => { if (!SHEET) { s.hidden = true; b.hidden = true; $('sheetIn').innerHTML = ''; } }, 230);
    if (!fromPop && history.state && history.state.sheet) { try { history.back(); } catch (e) {} }
  }
  function refreshSheet() {
    if (!SHEET) return; const top = $('sheet').scrollTop;
    if (SHEET.kind === 'plant') plantSheet(SHEET.pid, SHEET.podId);
    else if (SHEET.kind === 'stop') stopSheet(SHEET.id);
    $('sheet').scrollTop = top;
  }

  /* ----- Toast ----- */
  let toastT; function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2000); }

  /* ----- Views ----- */
  const VIEWS = ['towers', 'plants', 'care', 'ideas', 'diy'];
  function showView(v, anchor) {
    if (!VIEWS.includes(v)) v = 'towers';
    VIEWS.forEach(k => { $('view-' + k).hidden = (k !== v); });
    document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', t.dataset.view === v ? 'true' : 'false'));
    if (v === 'plants') renderPlants();
    if (v === 'care') renderCare();
    if (v === 'ideas') renderIdeas();
    if (v === 'diy') renderDIY();
    if (v === 'towers') { renderToday(); renderTower(); }
    if (location.hash !== '#' + v) { try { history.replaceState(history.state, '', '#' + v); } catch (e) {} }
    const el = anchor ? $(anchor) : null;
    if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 70; window.scrollTo({ top: Math.max(0, top), behavior: 'auto' }); }
    else window.scrollTo({ top: 0, behavior: 'auto' });
  }
  function renderAll() { renderToday(); renderTower(); if (!$('view-care').hidden) renderCare(); if (!$('view-plants').hidden) renderPlants(); }

  /* ----- Boxes: preview copy, install, news ----- */
  const SITE = 'https://hectrvictorious.github.io/gardyn-plant-book/';
  const standalone = () => window.matchMedia && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);
  let deferredInstall = null;
  function setupBoxes() {
    if (!window.__STANDALONE_SITE__) {
      $('movedBox').innerHTML = '<b>This is the preview copy</b><div class="small">The phone app lives at <a href="' + SITE + '" target="_blank" rel="noopener">hectrvictorious.github.io/gardyn-plant-book</a>. Open it on your phone and add it to your home screen. Ticks and notes saved here stay in this browser.</div>';
      $('movedBox').hidden = false;
      return;
    }
    const box = $('installBox');
    if (standalone() || store.get('installLater', false)) return;
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; box.hidden = false; $('installBtn').hidden = false; });
    const iOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    if (iOS) { $('installHint').textContent = 'On iPhone: tap Share, then Add to Home Screen. It opens like an app, with no address bar.'; $('installBtn').hidden = true; box.hidden = false; }
    $('installBtn').addEventListener('click', async () => { if (!deferredInstall) return; deferredInstall.prompt(); try { await deferredInstall.userChoice; } catch (e) {} deferredInstall = null; box.hidden = true; });
    $('installLater').addEventListener('click', () => { store.set('installLater', true); box.hidden = true; });
    window.addEventListener('appinstalled', () => { box.hidden = true; toast('Installed. Look for the Plant Book on your home screen.'); });
  }
  function renderNews() {
    const box = $('newsBox'), seen = store.get('seenVersion', null);
    const returning = Object.keys(DONE).length || Object.keys(CARE).length || Object.keys(NOTES).length;
    if (!NEWS || seen === APP_VERSION || !returning) { store.set('seenVersion', APP_VERSION); box.hidden = true; return; }
    box.innerHTML = '<b>New in the Plant Book</b><div class="small">' + NEWS + '</div><div class="btnrow"><button class="btn small" data-act="newsOk">Got it</button></div>';
    box.hidden = false;
  }

  /* ----- Updates (installed app only) ----- */
  function setupWorker() {
    if (!window.__STANDALONE_SITE__ || !('serviceWorker' in navigator)) return;
    const mine = 'plantbook-' + (window.__BUILD__ || '');
    let reloading = false;
    const reload = () => {
      if (reloading) return;
      const now = Date.now(), recent = (store.get('swReloads', []) || []).filter(t => now - t < 120000);
      if (recent.length >= 2) return;
      recent.push(now); store.set('swReloads', recent); reloading = true; location.reload();
    };
    let pending = null;
    const consider = v => { if (!v || !window.__BUILD__ || v === mine) return; if (document.hidden || !sheetOpen()) reload(); else pending = reload; };
    const hello = () => { try { const c = navigator.serviceWorker.controller; if (c) c.postMessage({ type: 'pb-hello' }); } catch (e) {} };
    navigator.serviceWorker.addEventListener('message', e => {
      const d = e.data || {};
      if (d.type === 'pb-updated') { try { e.source && e.source.postMessage({ type: 'pb-ack' }); } catch (err) {} consider(d.version); }
      else if (d.type === 'pb-version') consider(d.version);
    });
    navigator.serviceWorker.addEventListener('controllerchange', hello);
    hello();
    document.addEventListener('visibilitychange', () => { if (document.hidden && pending) pending(); });
    try {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        let last = Date.now();
        document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - last > 10 * 60000) { last = Date.now(); reg.update().catch(() => {}); } });
      }).catch(() => {});
    } catch (e) {}
  }

  /* ----- Backup ----- */
  function backup() {
    const data = {}; KEYS.forEach(k => { data[k] = store.get(k, null); });
    const txt = JSON.stringify({ app: 'plant-book', v: 1, at: new Date().toISOString(), data });
    const fallback = () => { $('restoreBox').hidden = false; $('restoreText').value = txt; $('restoreText').select(); toast('Selected. Copy it from the box.'); };
    try { navigator.clipboard.writeText(txt).then(() => toast('Backup copied. Paste it somewhere safe.'), fallback); } catch (e) { fallback(); }
  }
  function restore() {
    try {
      const o = JSON.parse($('restoreText').value); if (!o || o.app !== 'plant-book' || !o.data) throw new Error('not a backup');
      KEYS.forEach(k => { if (o.data[k] != null) store.set(k, o.data[k]); });
      DONE = store.get('done', {}); CARE = store.get('care', {}); CAMP = store.get('camp', {}); NOTES = store.get('notes', {}); TRAIL = store.get('trail', {});
      $('restoreBox').hidden = true; renderAll(); renderCare(); toast('Restored.');
    } catch (e) { toast('That doesn’t look like a Plant Book backup. Paste the whole thing.'); }
  }

  /* ----- Wire up ----- */
  function openPod(podId) { const pod = POD[podId]; plantSheet(pod.p, podId); }
  function init() {
    renderDate(); setupBoxes(); renderNews();
    const start = (location.hash || '').slice(1);
    showView(VIEWS.includes(start) ? start : 'towers');
    if (/^p-/.test(start) && P.plants[start.slice(2)]) { showView('plants'); plantSheet(start.slice(2)); }
    setupWorker();
    window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (VIEWS.includes(h)) { if (sheetOpen()) hideSheet(true); showView(h); } });
    window.addEventListener('popstate', () => { if (sheetOpen()) hideSheet(true); });
    document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { if (sheetOpen()) hideSheet(); showView(t.dataset.view); }));
    $('sheetBack').addEventListener('click', () => hideSheet());
    $('sheetX').addEventListener('click', () => hideSheet());
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && sheetOpen()) hideSheet(); });
    $('q').addEventListener('input', renderPlants);
    $('backupBtn').addEventListener('click', backup);
    $('restoreBtn').addEventListener('click', () => { $('restoreBox').hidden = !$('restoreBox').hidden; if (!$('restoreBox').hidden) { $('restoreText').value = ''; $('restoreText').focus(); } });
    $('restoreGo').addEventListener('click', restore);
    let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (!$('view-diy').hidden) renderTrail(); }, 150); });
    document.addEventListener('change', e => {
      const inp = e.target.closest && e.target.closest('input[data-care-date]'); if (!inp) return;
      const id = inp.dataset.careDate, v = inp.value;
      if (v && v <= todayISO()) CARE[id] = v; else if (!v) delete CARE[id];
      store.set('care', CARE); renderCare(); renderToday();
    });
    document.addEventListener('click', e => {
      const t = e.target;
      const tw = t.closest('[data-tower]'); if (tw) { UI.tower = tw.dataset.tower; saveUI(); renderTower(); return; }
      const md = t.closest('[data-mode]'); if (md) { UI.mode = md.dataset.mode; saveUI(); renderTower(); return; }
      const fl = t.closest('[data-filter]'); if (fl) { UI.filter = fl.dataset.filter; saveUI(); $('q').value = ''; renderPlants(); return; }
      const go = t.closest('[data-go]'); if (go) { showView(go.dataset.go, go.dataset.anchor); return; }
      const pd = t.closest('.pod'); if (pd) { if (pd.dataset.pod) openPod(pd.dataset.pod); else seatSheet(pd.dataset.slot); return; }
      const op = t.closest('[data-open]');
      if (op) {
        const k = op.dataset.open;
        if (k === 'plant') { if (op.dataset.pod) openPod(op.dataset.pod); else plantSheet(op.dataset.pid); }
        else if (k === 'pod') openPod(op.dataset.pod);
        else if (k === 'fix') fixSheet(op.dataset.id);
        else if (k === 'stop') stopSheet(op.dataset.id);
        return;
      }
      const a = t.closest('[data-act]'); if (!a || a.disabled) return;
      const act = a.dataset.act;
      if (act === 'toggleMove') { const m = MOVE_BY_POD[a.dataset.pod]; const on = !isDone(m); setDone(m, on); toast(on ? (m.kind === 'out' ? 'Marked out.' : 'Marked moved. The Now map follows.') : 'Undone.'); renderAll(); refreshSheet(); }
      else if (act === 'toggleMoveKey') { const m = P.moves.find(x => mkey(x) === a.dataset.key); const on = !isDone(m); setDone(m, on); renderMoves(); renderToday(); renderTower(); }
      else if (act === 'careDone') { CARE[a.dataset.id] = todayISO(); store.set('care', CARE); renderCare(); renderToday(); toast('Logged for today.'); }
      else if (act === 'careUndo') { delete CARE[a.dataset.id]; store.set('care', CARE); renderCare(); renderToday(); }
      else if (act === 'camp') { const id = a.dataset.id, i = a.dataset.i; const st = (CAMP[id] || []).slice(); if (i === 'clear') CAMP[id] = []; else { const n = +i; if (st[n]) st.length = n; else st[n] = todayISO(); CAMP[id] = st; } store.set('camp', CAMP); renderCamps(); }
      else if (act === 'stop') { TRAIL[a.dataset.id] = a.dataset.st; store.set('trail', TRAIL); renderTrail(); stopSheet(a.dataset.id); }
      else if (act === 'addNote') { const txt = ($('jText').value || '').trim(); if (!txt) { $('jText').focus(); return; } const pid = a.dataset.pid; (NOTES[pid] = NOTES[pid] || []).push({ d: todayISO(), t: txt.slice(0, 600) }); store.set('notes', NOTES); refreshSheet(); toast('Note saved on this phone.'); }
      else if (act === 'delNote') { const pid = a.dataset.pid; (NOTES[pid] || []).splice(+a.dataset.i, 1); store.set('notes', NOTES); refreshSheet(); }
      else if (act === 'newsOk') { store.set('seenVersion', APP_VERSION); $('newsBox').hidden = true; }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
