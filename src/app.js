/* Swan's Island Plant Book: the app. Reads window.PB (data.js). No libraries. */
(function () {
  'use strict';
  const P = window.PB;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const APP_VERSION = P.version;
  const NEWS = 'Every plant now has a photo of what ready looks like, and a ruler marked at the size Gardyn says to cut or pick it, with a credit card or a dollar bill drawn to the same scale. Open any plant to see it; the lists show the photos too.'; // shown once to returning users

  /* ----- Storage (this phone only) ----- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('pb:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('pb:' + k, JSON.stringify(v)); } catch (e) { /* storage off: the page still works */ } if (TRACKED.has(k)) touched(); },
    raw(k, v) { try { if (v == null) localStorage.removeItem('pb:' + k); else localStorage.setItem('pb:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  const KEYS = ['done', 'care', 'camp', 'notes', 'trail', 'ui', 'seenVersion', 'installLater', 'bowl', 'bowls', 'mgsel', 'pick', 'verdict', 'scout', 'ate', 'foot', 'podseats', 'prints', 'printer', 'fgame', 'harv', 'hamt', 'flow', 'hprice', 'seeds', 'asks'];
  /* What counts as something worth backing up: everything but view settings and the game score. */
  const TRACKED = new Set(KEYS.filter(k => !['ui', 'seenVersion', 'installLater', 'bowl', 'mgsel', 'fgame'].includes(k)));
  function touched() { const d = store.get('dirty', null) || { n: 0, since: todayISO() }; d.n++; store.raw('dirty', d); }
  let DONE = store.get('done', {});
  let CARE = store.get('care', {});
  let CAMP = store.get('camp', {});
  let NOTES = store.get('notes', {});
  let TRAIL = store.get('trail', {});
  const UI = Object.assign({ tower: 'S', mode: 'now', filter: 'tower', lens: 'light' }, store.get('ui', {}));
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
  function seatName(s, tower) { const p = parse(s); if (!p) return s === 'dome' ? 'the dome' : s === 'sow' ? 'not sown yet' : s === 'out' ? 'comes out' : s === 'tbd' ? 'a seat you’ll choose' : s; const base = 'row ' + p.r + ' ' + COL[p.c]; return tower ? (p.t === 'S' ? 'salad ' : 'fruiting ') + base : base; }
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
    if (capMove && isDone(capMove)) return (P.holds.plan || P.holds.now)[slot] || { cap: true, note: 'Cap' };
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
      const H = P.holds.plan || P.holds.now; Object.keys(H).forEach(s => { if (L[s]) L[s].hold = H[s]; });
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
    micro: '<path class="s" d="M4.5 28.5h23"/><path class="s" d="M8.5 28.5V19.6M16 28.5V13.4M23.5 28.5V19.6"/><g class="f"><ellipse cx="5.9" cy="18.3" rx="3" ry="1.65" transform="rotate(32 5.9 18.3)"/><ellipse cx="11.1" cy="18.3" rx="3" ry="1.65" transform="rotate(-32 11.1 18.3)"/><ellipse cx="13.4" cy="12.1" rx="3" ry="1.65" transform="rotate(32 13.4 12.1)"/><ellipse cx="18.6" cy="12.1" rx="3" ry="1.65" transform="rotate(-32 18.6 12.1)"/><ellipse cx="20.9" cy="18.3" rx="3" ry="1.65" transform="rotate(32 20.9 18.3)"/><ellipse cx="26.1" cy="18.3" rx="3" ry="1.65" transform="rotate(-32 26.1 18.3)"/></g>',
    umbel: '<path class="s" d="M16 30V15M16 15 7 9.4M16 15l-4.4-7.6M16 15V6.6M16 15l4.4-7.6M16 15l9-5.6"/><g class="f"><circle cx="6.6" cy="8.8" r="2.3"/><circle cx="11.2" cy="6.4" r="2.3"/><circle cx="16" cy="5.4" r="2.3"/><circle cx="20.8" cy="6.4" r="2.3"/><circle cx="25.4" cy="8.8" r="2.3"/></g><path class="f2" d="M16 25.5c-3.8.4-6.8-1.2-8.2-4.2 3.8-.5 6.8 1.1 8.2 4.2Z"/>',
    bell: '<path class="s" d="M13 30V3.5"/><g class="f"><ellipse cx="17.6" cy="8.2" rx="4.2" ry="2.6" transform="rotate(28 17.6 8.2)"/><ellipse cx="18.4" cy="14.4" rx="4.7" ry="2.9" transform="rotate(28 18.4 14.4)"/><ellipse cx="19.2" cy="20.8" rx="5.1" ry="3.1" transform="rotate(28 19.2 20.8)"/></g><g class="s0"><circle cx="19.6" cy="9.4" r=".75"/><circle cx="20.7" cy="15.8" r=".75"/><circle cx="21.7" cy="22.4" r=".75"/></g><path class="f2" d="M13 27.5c-3.6-.1-6.2-1.9-7.3-4.9 3.6 0 6.2 1.8 7.3 4.9Z"/>',
    nberry: '<path class="s" d="M16 10.5c0-3 1.4-5.2 4.2-6.6"/><path class="f2" d="M16 9.6 17.9 12.4 21.3 11.9 19.2 14.6 21.3 17.3 17.9 16.8 16 19.6 14.1 16.8 10.7 17.3 12.8 14.6 10.7 11.9 14.1 12.4Z"/><circle class="f" cx="16" cy="19" r="7.2"/><circle class="fw" cx="13.4" cy="16.6" r="1.5"/>',
    palmate: '<path class="s" d="M16 19v11"/><path class="f" d="M15.6 19.2 9.8 27.3 10.1 20.7 3.8 18.8 9 14.7 6.5 8.6 13 10.1 16 4.2 19 10.1 25.5 8.6 23 14.7 28.2 18.8 21.9 20.7 22.2 27.3 16.4 19.2Z"/><path class="s" stroke-opacity=".5" d="M16 16.6 11.8 23.9M16 16.6 7.7 18.1M16 16.6 9.6 11.2M16 16.6V8.2M16 16.6l6.4-5.4M16 16.6l8.3 1.5M16 16.6l4.2 7.3"/>',
    glory: '<path class="s" d="M5.5 30c2.5-2.6 4.8-6.2 6.7-11.2"/><circle class="f" cx="18.5" cy="12.5" r="9"/><path class="s" stroke-opacity=".45" d="M18.5 12.5V3.5M18.5 12.5l8.6-2.8M18.5 12.5l5.3 7.3M18.5 12.5l-5.3 7.3M18.5 12.5 9.9 9.7"/><circle class="fw" cx="18.5" cy="12.5" r="2.4"/><path class="f2" d="M8.8 26c-2.8.3-4.9-1.1-5.4-3.4 1.3-1 3.2-.9 4.1.4.2-1.6 1.9-2.6 3.4-2 .2 2.5-.6 4.4-2.1 5Z"/>',
    lily: '<g class="f"><ellipse cx="16" cy="7.6" rx="2.7" ry="6.2" transform="rotate(0 16 14)"/><ellipse cx="16" cy="7.6" rx="2.7" ry="6.2" transform="rotate(60 16 14)"/><ellipse cx="16" cy="7.6" rx="2.7" ry="6.2" transform="rotate(120 16 14)"/><ellipse cx="16" cy="7.6" rx="2.7" ry="6.2" transform="rotate(180 16 14)"/><ellipse cx="16" cy="7.6" rx="2.7" ry="6.2" transform="rotate(240 16 14)"/><ellipse cx="16" cy="7.6" rx="2.7" ry="6.2" transform="rotate(300 16 14)"/></g><path class="s" d="M16 14 12.6 9.8M16 14l3.4-4.2M16 14v-5.6"/><g class="s0"><circle cx="12.4" cy="9.5" r="1"/><circle cx="19.6" cy="9.5" r="1"/><circle cx="16" cy="8.2" r="1"/></g><circle class="s0b" cx="16" cy="14" r="1.7"/>',
    lotus: '<g class="f"><path d="M16 23c-4.8-1-8.6-3.8-10.8-7.8 4.6.3 8.4 3 10.8 7.8Z"/><path d="M16 23c4.8-1 8.6-3.8 10.8-7.8-4.6.3-8.4 3-10.8 7.8Z"/><path d="M16 23c-3.6-2.6-6-7-6.6-11.6 3.6 2.2 6 6.6 6.6 11.6Z"/><path d="M16 23c3.6-2.6 6-7 6.6-11.6-3.6 2.2-6 6.6-6.6 11.6Z"/><path d="M16 23c-2.2-5-2-11.5 0-17 2 5.5 2.2 12 0 17Z"/></g><path class="s" d="M3.5 27c4-1.6 8.3-1.6 12.5 0s8.5 1.6 12.5 0"/>',
    cactus: '<path class="f" d="M12.8 21H9.6A2.6 2.6 0 0 1 7 18.4v-4.6a1.8 1.8 0 0 1 3.6 0v3.6h2.2Z"/><path class="f" d="M19.2 18h2.6a1.8 1.8 0 0 0 1.8-1.8v-4.4a1.8 1.8 0 0 1 3.6 0v5.2a4.6 4.6 0 0 1-4.6 4.6h-3.4Z"/><path class="f" d="M12.8 29V8.4a3.2 3.2 0 0 1 6.4 0V29Z"/><path class="s" d="M16 9.5V28M5 29.2h22"/>',
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
  let FMC = {};
  const fmCached = pid => pid in FMC ? FMC[pid] : (FMC[pid] = P.plants[pid] && P.plants[pid].group === 'fruit' ? fruitModel(pid) : null);
  function renderTower() {
    const t = UI.tower; FMC = {};
    const pending = P.pods.some(p => { const m = MOVE_BY_POD[p.id]; return m && !isDone(m) && [p.now, p.plan].some(x => parse(x) && parse(x).t === t); });
    if (!pending && UI.mode === 'plan') UI.mode = 'now';
    const mode = UI.mode;
    document.querySelector('[data-mode]').parentElement.hidden = !pending;
    document.querySelectorAll('[data-tower]').forEach(b => b.setAttribute('aria-pressed', b.dataset.tower === t ? 'true' : 'false'));
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false'));
    const L = layout(t, mode);
    const planted = Object.values(L).filter(c => c.pods.length).length;
    const caps = Object.values(L).filter(c => !c.pods.length && c.hold && c.hold.cap).length;
    $('towerName').textContent = P.towers[t].name;
    $('towerCount').textContent = planted + ' planted' + (caps ? ' · ' + caps + (caps === 1 ? ' Cap' : ' Caps') : '') + ' · ' + (30 - planted - caps) + ' open';
    $('towerSub').textContent = mode === 'plan'
      ? 'After the steps still to come, with each plant in the seat it moves to.'
      : (pending ? 'The tower as it stands: the Nov 2 map, in place as of Nov 5. A pink mark means a step is still to come.' : 'The tower as it stands: the Nov 2 map, in place as of Nov 5. Tap any pod.');
    if (UI.lens === 'pick') $('towerSub').textContent = mode === 'plan' ? 'Picking shows on the Now map.' : 'Colored by picking: about once a week keeps leafy plants from bolting. Fruit shows when the flowers you’ve logged should ripen. Tap a pod to log it, or open the picking round from the Today strip.';
    else if (UI.lens === 'flavor') $('towerSub').textContent = 'Colored by what each plant brings to a salad. The word on each pod is its taste, or a heads-up marked ! before you eat it. Tap a pod for texture and pairings.';
    else if (UI.lens === 'pods') { const n = Object.keys(PODS.seats).filter(x => x[0] === t).length; $('towerSub').textContent = mode === 'plan' ? 'Printed pods show on the Now map.' : n + ' of 30 seats on this tower ' + (n === 1 ? 'is' : 'are') + ' in a printed pod. Tap a pod to mark one, or to count a replanting.'; }
    let pods = '';
    for (let r = 1; r <= 10; r++) for (const c of ['L', 'C', 'R']) pods += podHTML(t + r + c, L[t + r + c], mode);
    let bars = ''; for (let r = 1; r <= 10; r++) bars += '<span>' + r + '</span>';
    let barsR = ''; for (let r = 1; r <= 10; r++) barsR += '<span aria-hidden="true">' + (r % 2 ? '►' : '◄') + '</span>';
    $('towerWrap').innerHTML =
      '<div class="colhead" aria-hidden="true"><span></span><span>Left</span><span>Center</span><span>Right</span><span></span></div>' +
      '<div class="tower"><div class="bar" aria-hidden="true">' + bars + '</div><div class="cols">' + pods + '</div><div class="bar r" aria-hidden="true">' + barsR + '</div>' +
      '<div class="tank"><b>Tank</b><span>' + (t === 'S' ? 'Salad Tank · Refresh monthly' : 'Fruiting Tank · Refresh every two weeks') + '</span></div></div>';
    document.querySelectorAll('[data-lens]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lens === (UI.lens || 'light') ? 'true' : 'false'));
    const lensNow = UI.lens || 'light';
    $('legendLight').hidden = lensNow !== 'light'; $('legendFlavor').hidden = lensNow !== 'flavor'; $('legendPick').hidden = lensNow !== 'pick'; $('legendPods').hidden = lensNow !== 'pods';
    if (lensNow === 'pods') $('legendPods').innerHTML = '<span><i class="sw k-printed"></i>printed pod (× plantings)</span><span><i class="sw k-rock"></i>yCube</span><span><i class="sw k-none" style="border-style:dashed"></i>open</span>';
    if (lensNow === 'pick') $('legendPick').innerHTML = '<span><i class="sw k-fresh"></i>picked this week</span><span><i class="sw k-due"></i>due a picking</span><span><i class="sw k-none"></i>not logged</span><span><i class="sw k-ripe"></i>ripe? some of this plant’s fruit should be</span><span><i class="sw k-fruit"></i>fruit: ~ when its logged flowers ripen</span>';
    if (UI.lens === 'flavor') $('legendFlavor').innerHTML = P.roleOrder.filter(r => r !== 'topper').map(r => '<span><i class="sw ax-' + r + '"></i>' + esc(P.roles[r].name) + '</span>').join('') + '<span><b class="flagk" aria-hidden="true">!</b>a heads-up before you eat it</span>';
    const pendKind = k => P.pods.some(p => { const m = MOVE_BY_POD[p.id]; return m && m.kind === k && !isDone(m) && parse(cur(p)) && parse(cur(p)).t === t; });
    const outs = pendKind('out'), mvs = pendKind('move');
    $('legendMove').innerHTML = !pending ? '' : mode === 'plan' ? '<span><i class="chip" style="background:var(--band);color:var(--band-ink)">new</i>&nbsp;planted next</span>' : (mvs ? '<span><i class="chip acc">→</i>&nbsp;moves next</span>' : '') + (outs ? '<span><i class="chip" style="background:var(--ink-2);color:var(--surface)">✕</i>&nbsp;comes out</span>' : '');
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
      if (badge) cls.push(/>new</.test(badge) ? 'hasnew' : 'hasmv');
      if (cell.pods.length > 1) cls.push('clash');
      const lens = UI.lens === 'flavor' && pl.flav;
      if (lens) cls.push('r-' + pl.flav.roles[0]);
      const pk = UI.lens === 'pick' && mode === 'now';
      const pz = UI.lens === 'pods' && mode === 'now';
      let pkTag = '';
      if (pz) { const ps = PODS.seats[slot]; cls.push(ps ? 'k-printed' : 'k-rock'); pkTag = ps ? (ps.n ? 'printed ×' + ps.n : 'printed') : ''; }
      if (pk) { if (!pickable(pod)) { const fm = fmCached(pod.p); if (fm && fm.now.length) { cls.push('k-ripe'); pkTag = 'ripe?'; } else { cls.push('k-fruit'); pkTag = fm && fm.next ? '~' + fmtDate(fm.next) : fm && fm.open.length ? 'in flower' : 'fruit'; } } else { const last = PICK[pod.id], d = last ? dayNum(todayISO()) - dayNum(last) : null; cls.push(d === null ? 'k-none' : d >= PICK_EVERY ? 'k-due' : 'k-fresh'); pkTag = d === null ? 'not logged' : d === 0 ? 'today' : d >= PICK_EVERY ? d + 'd · due' : d + 'd ago'; } }
      const tg = (pk || pz) ? esc(pkTag) : lens ? esc(pl.flav.flag || (pl.flav.flavor.find(x => x !== 'mild' && x.length <= 9) || pl.flav.flavor.find(x => x !== 'mild') || pl.flav.flavor[0]).replace(/ \(.*\)/, '')) : tagStr(pl);
      const vd = lens && VERD[pod.p] ? VERD[pod.p].v : '';
      inner = '<span class="top">' + plantGlyph(pl) + '<span class="t' + ((pk || pz) ? ' fwt' : lens ? ' fwt' + (pl.flav.flag ? ' flagged' : '') : '') + '">' + tg + (cell.pods.length > 1 ? ' +' + (cell.pods.length - 1) : '') + '</span></span><span class="n">' + esc(pod.label) + (vd ? ' <span class="vb vd-' + vd + '" title="Your verdict: ' + VNAME[vd] + '">' + ({ keep: '✓', retry: '↻', retire: '✕' })[vd] + '</span>' : '') + '</span>' + badge;
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
      else if (cell.hold && (cell.hold.tag || cell.hold.note)) { txt = esc(cell.hold.tag || cell.hold.note.split(':')[0].toLowerCase()); if (cell.hold.free) cls.push('free'); }
      if (UI.lens === 'pods' && mode === 'now' && PODS.seats[slot]) { cls.push('k-printed'); txt = 'printed pod'; }
      inner = '<span class="n">' + txt + '</span>';
      label = where + ': ' + txt.replace(/<[^>]+>/g, '');
    }
    return '<button class="' + cls.join(' ') + '" data-slot="' + slot + '" aria-label="' + esc(label) + '">' + inner + '</button>';
  }

  function renderDome() {
    const t = UI.tower;
    const list = P.pods.filter(p => (p.now === 'dome' || p.now === 'sow') && parse(p.plan) && parse(p.plan).t === t && !(MOVE_BY_POD[p.id] && isDone(MOVE_BY_POD[p.id])));
    $('domeSec').hidden = !list.length;
    $('domeTitle').textContent = list.some(p => p.now === 'dome') ? 'In the dome, headed here' : 'Still to sow';
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
      '<button data-go="care" data-anchor="rhythm" class="' + (due.length ? 'hot' : '') + '"><span class="big">' + due.length + '</span><span class="lbl">' + (due.length === 1 ? 'care job due' : 'care jobs due') + '</span><span class="sub">' + (due.length ? esc(due.slice(0, 2).map(c => c.title).join(', ')) : unlogged ? unlogged + ' not logged' : 'All caught up') + '</span></button>' +
      '<button data-go="care" data-anchor="moves"><span class="big">' + ready + '</span><span class="lbl">' + (ready === 1 ? 'step ready now' : 'steps ready now') + '</span><span class="sub">' + done + ' of ' + P.moves.length + ' done</span></button>' +
      (() => { const pk = pickList(), n = pk.filter(x => x.due).length, rp = ripeNow(); const fr = rp.length ? rp.map(m => fw(m.pid, 2)).join(', ') + ' ripe' : ''; return '<button data-act="pickRound" class="' + ((n && pk.some(x => x.last)) || rp.length ? 'hot' : '') + '"><span class="big">' + (n + rp.length) + '</span><span class="lbl">to pick</span><span class="sub">' + esc(fr || (!pk.length ? 'nothing leafy' : pk.some(x => x.last) ? (n ? 'a week or more' : 'all picked') : 'start a round')) + '</span></button>'; })();
    renderBackupNote();
  }

  function renderTip() {
    const n = P.tips.length, i = ((dayNum(todayISO()) + (UI.tipShift || 0)) % n + n) % n, tp = P.tips[i];
    $('tipBox').innerHTML = '<div class="tip-t"><span class="eyebrow">Tip</span><p>' + esc(tp.t) + '</p></div><div class="tip-b">' + (tp.go ? '<button class="btn small ghost" data-act="tipGo" data-i="' + i + '">More</button>' : '') + '<button class="btn small ghost" data-act="tipNext" aria-label="Another tip">Another</button></div>';
  }

  /* ----- Plant sheet ----- */
  function statTiles(pl) {
    const g = pl.gb || {};
    if (g.micro) {
      const mt = [['Sprouts in', g.sprout + ' <small>days</small>'], ['Harvest at', g.mature + ' <small>days</small>'], ['Grown in', 'Sprout Nursery'], ['Grows on', 'Seed pad'], ['Care level', 'Beginner'], ['Plant Food', 'None']];
      return '<div class="stats">' + mt.map(([k, v]) => '<div><span class="k">' + k + '</span><span class="v">' + v + '</span></div>').join('') + '</div>';
    }
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
    h += '<div class="eyebrow">' + esc(pod.label) + (UI.mode === 'plan' ? ' · next' : ' · now') + '</div>';
    if (onTower) {
      const z = zoneOf(here);
      h += '<h3>' + esc(seatTitle(here)) + '</h3><div class="btnrow"><span class="chip z-' + z + '">' + ZONE[z] + '</span><span class="chip">Faces ' + facing(here) + ' ' + (facing(here) === 'right' ? '►' : '◄') + '</span></div>';
      const lines = [seatCheck(pl, here), leanText(here), twoUp(here, UI.mode)];
      const partner = partnerOf(pod); if (partner) { const ps = UI.mode === 'plan' ? partner.plan : cur(partner); lines.push('Its pair, ' + partner.label + ', is ' + (parse(ps) ? 'at ' + seatName(ps, parse(ps).t !== parse(here).t) : 'in ' + seatName(ps)) + '.'); }
      if (pod.seat) lines.push(pod.seat);
      if (pod.was && UI.mode === 'now') lines.push(pod.was === 'dome' ? 'Planted from the dome in the Nov 2 re-seating.' : 'Moved here from ' + seatName(pod.was, parse(pod.was).t !== parse(here).t) + ' in the Nov 2 re-seating.');
      h += '<ul>' + lines.filter(Boolean).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
    } else {
      h += '<h3>' + (here === 'dome' ? 'In the dome' : here === 'sow' ? 'Not sown yet' : here === 'tbd' ? 'Seat to choose' : 'Out') + '</h3>';
    }
    if (pod.unsure) h += '<p class="small" style="margin:0"><b>To confirm:</b> ' + esc(pod.unsure) + '</p>';
    if (pod.note) h += '<p class="small" style="margin:0">' + esc(pod.note) + '</p>';
    if (onTower && UI.mode !== 'plan') { const pk = pickable(pod), last = PICK[pod.id], td = last === todayISO(); h += '<div class="pickrow">' + (pk ? '<span class="small">' + (td ? 'Picked today' : last ? 'Last picked ' + fmtDate(last) : 'No picking logged yet') + '</span>' : '<span></span>') + '<span class="btnrow">' + (pk ? '<button class="btn small' + (td ? ' ghost' : '') + '" data-act="pickToggle" data-pod="' + pod.id + '">' + (td ? 'Undo' : 'Picked today') + '</button>' : '') + '<button class="btn small ghost" data-act="copyLink" data-slot="' + here + '">Copy link</button></span></div>' + podRow(here); }
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
    let h = '<div class="ph"><div class="gwrap">' + plantGlyph(pl) + '</div><div><div class="eyebrow">' + esc(P.groups[pl.group]) + (pl.notGardyn ? ' · not in Gardyn’s catalog' : ' · Gardyn Plant Book') + statusWord(pl) + '</div><h2 id="sheetTitle">' + esc(pl.name) + (tagStr(pl) ? ' <span class="muted" style="font-size:18px">' + tagStr(pl) + '</span>' : '') + '</h2><div class="latin">' + esc(pl.latin) + '</div>' + (pl.flav ? '<div class="tnote">' + esc(pl.flav.flavor.join(', ').replace(/^./, c => c.toUpperCase())) + (pl.flav.texture && pl.flav.texture[0] ? ' · ' + esc(pl.flav.texture[0]) : '') + '</div>' : '') + '</div></div>';
    h += readyBlock(pid, pl);
    const fv = pl.flav;
    if (fv && fv.warn && fv.warn.length) h += '<div class="warn"><b>Before you eat it</b><ul>' + fv.warn.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>';
    const pet = P.pets[pid]; if (pet && pet.toxic) h += '<div class="petnote"><b>For the cat.</b> ' + esc(pet.text) + ' <a href="' + esc(pet.src) + '" target="_blank" rel="noopener">Source</a></div>';
    if (podId && POD[podId]) h += seatCard(POD[podId]);
    if (pl.group === 'fruit' && fruitPlants().includes(pid)) h += fruitBlock(pid);
    h += givesBlock(pid);
    if (pl.why) h += '<div class="callout"><b>Why it’s on the list.</b> ' + esc(pl.why) + (pl.status === 'idea' ? '<div class="btnrow" style="margin-top:8px"><button class="btn small' + (SCOUT[pid] ? ' ghost' : ' primary') + '" data-act="scoutStar" data-pid="' + pid + '">' + (SCOUT[pid] ? '★ On your shortlist · remove' : '☆ Add to your shortlist') + '</button></div>' : '') + '</div>';
    if (P.audition[pid] && P.plants[P.audition[pid]]) h += '<div class="callout"><b>Taste it first.</b> Gardyn’s ' + esc(P.plants[P.audition[pid]].name) + ' pad is the same plant, ready in ' + esc(P.plants[P.audition[pid]].gb.mature) + ' days in the Sprout Nursery. If you love it, it earns a yPod. <button class="btn small" style="margin-top:6px" data-open="plant" data-pid="' + P.audition[pid] + '">Open the pad</button></div>';
    const aud = Object.keys(P.audition).find(k => P.audition[k] === pid); if (aud && P.plants[aud]) h += '<div class="callout"><b>An audition.</b> ' + esc(P.plants[aud].name) + ' is on your Ideas list for a yPod. This pad lets you taste it first, in under two weeks.</div>';
    if (pl.gone) h += '<div class="callout"><b>Why it’s retired.</b> ' + esc(pl.gone) + '</div>';
    if (fv) h += tasteBlock(pid, pl);
    const fb = P.forbidden.items.filter(x => (x.plants || []).includes(pid));
    if (fb.length) h += '<div class="forblinks">' + fb.map(x => '<button class="forblink" data-act="forbItem" data-id="' + x.id + '"><span class="eyebrow">Forbidden Shelf</span><b>' + esc(x.name) + '</b><span aria-hidden="true">›</span></button>').join('') + '</div>';
    h += '<div class="block"><h3>Growing basics</h3>' + statTiles(pl) + (pl.gb && pl.gb.zoneNote ? '<p class="small">' + esc(pl.gb.zoneNote) + '</p>' : '') + (pl.gb && pl.gb.note ? '<p class="small">' + esc(pl.gb.note) + '</p>' : '') + '</div>';
    if (pods.length) {
      h += '<div class="block"><h3>On your towers</h3><ul>' + pods.map(p => { const c = cur(p), m = MOVE_BY_POD[p.id]; const now = parse(c) ? seatName(c, true) : seatName(c); const plan = p.plan === 'out' ? 'comes out' : seatName(p.plan, true); return '<li><button class="btn small ghost" data-open="pod" data-pod="' + p.id + '">' + esc(p.label) + '</button> ' + esc(now) + (m && !isDone(m) ? ' → ' + esc(plan) : '') + '</li>'; }).join('') + '</ul></div>';
    }
    if (pl.yours && pl.yours.length) h += '<div class="block"><h3>Your notes</h3><ul>' + pl.yours.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>';
    if (pl.harvest) h += '<div class="block"><h3>Harvest</h3><ul>' + pl.harvest.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>';
    if (pl.care || pl.pests) h += '<div class="block"><h3>Care</h3><ul>' + (pl.care || []).map(x => '<li>' + esc(x) + '</li>').join('') + (pl.pests ? '<li><b>Common pests:</b> ' + esc(pl.pests) + '</li>' : '') + '</ul></div>';
    if (pl.taste && typeof pl.taste === 'string') h += '<div class="block"><h3>Taste and use</h3><p>' + esc(pl.taste) + '</p></div>';
    if (pl.about || pl.origin) h += '<div class="block"><h3>Qualities and origin</h3>' + (pl.about ? '<p>' + esc(pl.about) + '</p>' : '') + (pl.origin ? '<p class="small" style="margin-top:6px">' + esc(pl.origin) + '</p>' : '') + '</div>';
    h += seedBlock(pid);
    h += journalHTML(pid);
    h += '<p class="src">Sources: ' + (pl.src || []).map(s => '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + '</a>').join(' · ') + '</p>';
    showSheet(h, { kind: 'plant', pid, podId });
    paintPhotos(pid);
  }
  function statusWord(pl) { return { dome: ' · in the dome', planned: ' · planned', idea: ' · an idea', retired: ' · retired', micro: ' · Microgreens Kit' }[pl.status] || ''; }
  function tasteBlock(pid, pl) {
    const fv = pl.flav, pet = P.pets[pid];
    let h = '<div class="block"><h3>Taste and texture</h3><div class="tchips">' + fv.flavor.map(x => '<span class="fl">' + esc(x) + '</span>').join('') + (fv.texture || []).map(x => '<span class="tx' + (/bristly|downy|stringy|tough/.test(x) ? ' bad' : '') + '">' + esc(x) + '</span>').join('') + '</div>';
    h += '<p class="small" style="margin:6px 0 0"><b>In a bowl:</b> ' + esc(fv.roles.map(r => P.roles[r].name.toLowerCase()).join(', ')) + '. <b>Best eaten:</b> ' + esc(fv.eat) + '</p>';
    const pairs = (fv.pairs || []).filter(x => P.plants[x]);
    if (pairs.length) h += '<p class="small" style="margin:6px 0 0"><b>Pairs with, on your towers:</b></p><div class="dome" style="margin-top:4px">' + pairs.map(x => '<button data-open="plant" data-pid="' + x + '">' + plantGlyph(P.plants[x]) + esc(P.plants[x].name) + '</button>').join('') + '</div>';
    if (fv.kitchen) h += '<p class="small" style="margin:6px 0 0"><b>From the kitchen:</b> ' + esc(fv.kitchen) + '</p>';
    if (bowlable(pid)) { const inB = BOWL.includes(pid); h += '<div class="btnrow" style="margin-top:8px"><button class="btn small ' + (inB ? 'ghost' : 'primary') + '" data-act="bowlToggle" data-pid="' + pid + '">' + (inB ? 'In tonight\u2019s bowl · remove' : 'Add to tonight\u2019s bowl') + '</button></div>'; }
    if (pet && !pet.toxic) h += '<p class="small" style="margin:6px 0 0">' + esc(pet.text) + '</p>';
    if (pl.status === 'tower' || pl.status === 'micro') h += '<div class="verdict"><span class="small"><b>Your verdict</b></span>' + verdictSeg(pid) + '</div>';
    return h + '</div>';
  }
  /* ----- Photos: kept in this phone's IndexedDB, not in the backup ----- */
  const PH = { db: null, ok: (() => { try { return typeof indexedDB !== 'undefined' && !!indexedDB; } catch (e) { return false; } })(), urls: [] };
  function phDB() {
    if (PH.db) return Promise.resolve(PH.db);
    return new Promise((res, rej) => {
      try {
        const r = indexedDB.open('plantbook', 1);
        r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains('photos')) d.createObjectStore('photos', { keyPath: 'id', autoIncrement: true }).createIndex('pid', 'pid'); };
        r.onsuccess = () => { PH.db = r.result; res(PH.db); };
        r.onerror = () => rej(r.error);
      } catch (e) { rej(e); }
    });
  }
  const phList = pid => phDB().then(d => new Promise((res, rej) => { const out = [], rq = d.transaction('photos').objectStore('photos').index('pid').openCursor(IDBKeyRange.only(pid)); rq.onsuccess = () => { const c = rq.result; if (c) { out.push(c.value); c.continue(); } else res(out); }; rq.onerror = () => rej(rq.error); }));
  const phWrite = (fn) => phDB().then(d => new Promise((res, rej) => { const tx = d.transaction('photos', 'readwrite'); fn(tx.objectStore('photos')); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); }));
  const phAdd = (pid, blob, d, t) => phWrite(st => st.add({ pid, d: d || todayISO(), t: t || Date.now(), blob })).then(() => { touched(); BK.photos = null; });
  const phDel = id => phWrite(st => st.delete(id)).then(() => { touched(); BK.photos = null; });
  const phAll = () => phDB().then(d => new Promise((res, rej) => { const rq = d.transaction('photos').objectStore('photos').getAll(); rq.onsuccess = () => res(rq.result || []); rq.onerror = () => rej(rq.error); }));
  function shrink(file) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file), img = new Image();
      img.onload = () => { const sc = Math.min(1, 1280 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * sc); c.height = Math.round(img.naturalHeight * sc); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); c.toBlob(b => b ? res(b) : rej(new Error('no image')), 'image/jpeg', 0.82); };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('bad image')); };
      img.src = url;
    });
  }
  function phFree() { PH.urls.forEach(u => { try { URL.revokeObjectURL(u); } catch (e) {} }); PH.urls = []; }
  function paintPhotos(pid) {
    if (!PH.ok || !$('photos')) return;
    phList(pid).then(list => {
      const el = $('photos'); if (!el || !SHEET || SHEET.pid !== pid) return;
      phFree(); list.sort((a, b) => b.t - a.t);
      el.innerHTML = list.map(x => { const u = URL.createObjectURL(x.blob); PH.urls.push(u); return '<button class="ph-t" data-act="photoOpen" data-id="' + x.id + '" data-src="' + u + '" data-d="' + x.d + '"><img src="' + u + '" alt="Photo from ' + esc(fmtDate(x.d)) + '"><span>' + esc(fmtDate(x.d)) + '</span></button>'; }).join('');
    }).catch(() => {});
  }
  function openLight(id, src, d) {
    const L = $('lightbox');
    L.innerHTML = '<div class="lb-in" role="dialog" aria-label="Photo"><img src="' + src + '" alt="Photo from ' + esc(fmtDate(d)) + '"><div class="lb-bar"><b>' + esc(fmtDate(d)) + '</b><span class="btnrow"><button class="btn small ghost" data-act="photoDel" data-id="' + id + '">Delete</button><button class="btn small primary" data-act="lightClose">Close</button></span></div></div>';
    L.hidden = false;
  }
  function journalHTML(pid) {
    const list = NOTES[pid] || [];
    return '<div class="block journal"><h3>Your journal</h3><textarea id="jText" placeholder="First harvest, a root trim, a pest sighting…" aria-label="Add a note"></textarea><div class="btnrow"><button class="btn small primary" data-act="addNote" data-pid="' + pid + '">Add note</button>' + (PH.ok ? '<label class="btn small">Add a photo<input type="file" accept="image/*" data-photo="' + pid + '" hidden></label>' : '') + '</div><div class="photos" id="photos"></div>' +
      (list.length ? '<ul class="jlist">' + list.slice().reverse().map((n, i) => '<li><div><div class="d">' + esc(fmtDate(n.d)) + '</div>' + esc(n.t) + '</div><button data-act="delNote" data-pid="' + pid + '" data-i="' + (list.length - 1 - i) + '" aria-label="Delete note">Delete</button></li>').join('') + '</ul>' : '') + '</div>';
  }
  /* ----- Reference photos and the cut-size guide (photos.js, cut.js) -----
     Every plant gets a freely licensed photo at harvest size, credited under it, and a ruler marked with
     the size Gardyn says to cut or pick at, with an everyday thing drawn to the same scale. */
  const IMGBASE = window.__IMG_BASE__ || '';
  const PHOTO = P.photos || {};
  const picURL = (id, small) => IMGBASE + 'img/' + (small ? 't/' : '') + id + '.webp' + (IMGBASE ? '' : '?v=' + PHOTO[id].v);
  function plantPic(id) {
    const pl = P.plants[id];
    if (!PHOTO[id]) return plantGlyph(pl);
    return '<img class="pt" src="' + picURL(id, true) + '" alt="" loading="lazy" decoding="async" data-g="' + esc(pl.glyph || '') + '" data-t="' + esc(pl.tint || '') + '">';
  }
  const FRAC = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
  function inch(n) { const w = Math.floor(n), f = Math.round((n - w) * 100) / 100; return (w || !FRAC[f] ? String(w) : '') + (FRAC[f] || ''); }
  const inches = n => inch(n) + (n === 1 ? ' inch' : ' inches');
  const pickVerb = pl => (pl.group === 'fruit' || pl.group === 'flowers') ? 'Pick' : 'Cut';
  function cutHead(pl, c) {
    if (c.head) return c.head;
    const v = pickVerb(pl);
    if (c.r) return v + ' at ' + inch(c.r[0]) + '–' + inch(c.r[1]) + ' inches';
    if (c.from) return v + ' from ' + inches(c.from);
    if (c.about) return v + ' at about ' + inches(c.about);
    return 'When it’s ready';
  }
  function cutSay(c) {
    if (c.say) return c.say;
    if (!c.of) return '';
    const d = c.dim ? ' ' + c.dim : '';
    if (c.r) return c.of + ', ' + inch(c.r[0]) + '–' + inch(c.r[1]) + ' inches' + d + '.';
    if (c.from) return c.of + ', ' + inches(c.from) + d + ' or more.';
    if (c.about) return c.of + ', about ' + inches(c.about) + d + '.';
    return '';
  }
  function rulerSVG(c) {
    const o = c.obj && P.objs[c.obj];
    const hi = c.r ? c.r[1] * 1.12 : c.from ? c.from * 1.5 : c.about * 1.25;
    const R = [2, 3, 4, 5, 6, 8, 10, 12].find(x => x >= Math.max(hi, o ? o.len * 1.1 : 0)) || 12;
    const W = 320, L = 12, Rx = W - 12, sc = (Rx - L) / R, X = n => +(L + n * sc).toFixed(1);
    const step = R <= 6 ? 0.25 : 0.5, every = R >= 10 ? 2 : 1;
    const oname = o ? o.name.replace(/^an? /, '') : '';
    const what = c.r ? inch(c.r[0]) + ' to ' + inch(c.r[1]) + ' inches' : c.from ? inch(c.from) + ' inches and up' : 'about ' + inches(c.about);
    let s = '<svg class="ruler" viewBox="0 0 ' + W + ' ' + (o ? 66 : 46) + '" role="img" aria-label="Ruler marked at ' + esc(what) + (o ? ', with ' + esc(o.name) + ' drawn to the same scale' : '') + '">';
    if (c.from) s += '<defs><linearGradient id="rlFade" x1="0" x2="1" y1="0" y2="0"><stop offset="0" class="rl-s0"/><stop offset="1" class="rl-s1"/></linearGradient></defs>';
    s += '<rect class="rl-body" x="' + (L - 7) + '" y="16" width="' + (Rx - L + 14) + '" height="24" rx="4"/>';
    if (c.r) s += '<rect class="rl-band" x="' + X(c.r[0]) + '" y="16" width="' + (X(c.r[1]) - X(c.r[0])).toFixed(1) + '" height="24"/>';
    if (c.from) s += '<rect x="' + X(c.from) + '" y="16" width="' + (X(R) - X(c.from)).toFixed(1) + '" height="24" fill="url(#rlFade)"/>';
    for (let t = 0; t <= R + 1e-9; t += step) {
      const whole = Math.abs(t - Math.round(t)) < 1e-9, half = Math.abs(t * 2 - Math.round(t * 2)) < 1e-9;
      s += '<line class="rl-tk" x1="' + X(t) + '" x2="' + X(t) + '" y1="16" y2="' + (16 + (whole ? 10 : half ? 6.5 : 4)) + '"/>';
      if (whole && Math.round(t) % every === 0) s += '<text class="rl-n" x="' + X(t) + '" y="36.5" text-anchor="middle">' + Math.round(t) + '</text>';
    }
    const lab = c.r ? inch(c.r[0]) + '–' + inch(c.r[1]) + ' in' : c.from ? inch(c.from) + ' in and up' : 'about ' + inch(c.about) + ' in';
    const ends = c.r ? [c.r[0], c.r[1]] : [c.from || c.about];
    ends.forEach(e => { s += '<line class="rl-edge" x1="' + X(e) + '" x2="' + X(e) + '" y1="13" y2="28.5"/>'; });
    if (c.about) s += '<circle class="rl-dot" cx="' + X(c.about) + '" cy="13" r="2.6"/>';
    const mid = c.r ? (X(c.r[0]) + X(c.r[1])) / 2 : X(ends[0]);
    const anchor = c.from ? 'start' : 'middle';
    const lx = c.from ? Math.min(X(c.from) + 3, W - 70) : Math.max(28, Math.min(W - 28, mid));
    s += '<text class="rl-lab" x="' + lx + '" y="10" text-anchor="' + anchor + '">' + esc(lab) + '</text>';
    if (o) {
      const ow = X(o.len) - X(0);
      s += '<rect class="rl-obj" x="' + X(0) + '" y="48" width="' + ow.toFixed(1) + '" height="14" rx="3.5"/>';
      s += '<text class="rl-ot" x="' + (X(0) + ow / 2).toFixed(1) + '" y="58.3" text-anchor="middle">' + esc(oname) + '</text>';
    }
    return s + '</svg>';
  }
  function cutGuide(pl, c) {
    const sized = !!(c.r || c.from || c.about), say = cutSay(c);
    const sw = c.sw ? '<i class="cut-sw" style="background:' + esc(c.sw) + '" aria-hidden="true"></i>' : '';
    let h = '<div class="cutg"><div class="cutg-h">' + esc(cutHead(pl, c)) + '</div>';
    if (sized) h += '<p>' + esc(say) + (c.like ? ' ' + esc(c.like) : '') + '</p>' + rulerSVG(c);
    if (c.cue) h += '<p class="cut-cue">' + sw + '<span>' + esc(c.cue) + '</span></p>';
    if (c.tip) h += '<p class="small">' + esc(c.tip) + '</p>';
    return h + '</div>';
  }
  function credit(ph) {
    return 'Photo: <a href="' + esc(ph.page) + '" target="_blank" rel="noopener">' + esc(ph.by || 'unknown') + ', ' + esc(ph.at) + '</a> · ' + (ph.licurl ? '<a href="' + esc(ph.licurl) + '" target="_blank" rel="noopener">' + esc(ph.lic) + '</a>' : esc(ph.lic)) + ' · cropped';
  }
  function readyBlock(id, pl) {
    const ph = PHOTO[id], c = P.cut && P.cut[id];
    if (!ph && !c) return '';
    let h = '<div class="ready">';
    if (ph) h += '<figure class="pp"><div class="pp-img"><img src="' + picURL(id) + '" alt="' + esc(pl.name + (ph.alt ? ': ' + ph.alt : '')) + '" width="1024" height="768" decoding="async"><span class="pp-tag">' + esc(ph.tag || ('Ready to ' + pickVerb(pl).toLowerCase())) + '</span></div><figcaption class="pp-cr">' + (ph.stand ? '<b>Shown:</b> ' + esc(ph.stand) + '<br>' : '') + credit(ph) + '</figcaption></figure>';
    if (c) h += cutGuide(pl, c);
    return h + '</div>';
  }
  function creditsSheet() {
    const ids = Object.keys(PHOTO).filter(id => P.plants[id]).sort((a, b) => P.plants[a].name.localeCompare(P.plants[b].name));
    const h = '<div><div class="eyebrow">About this app</div><h2 id="sheetTitle">Photo credits</h2><div class="small">Every plant photo is freely licensed, from Wikimedia Commons or Flickr, and cropped and resized for this book. Tap a name for its plant page, or a photographer for the original.</div></div>' +
      '<div class="card"><ul class="credits">' + ids.map(id => { const ph = PHOTO[id]; return '<li><button class="linkish" data-open="plant" data-pid="' + id + '">' + esc(P.plants[id].name) + '</button><span class="small">' + (ph.title ? '“' + esc(ph.title) + '” · ' : '') + credit(ph).replace(/^Photo: /, '') + '</span></li>'; }).join('') + '</ul></div>';
    showSheet(h, { kind: 'credits' });
  }
  document.addEventListener('error', e => {
    const t = e.target; if (!t || t.tagName !== 'IMG') return;
    if (t.classList.contains('pt')) { const g = document.createElement('span'); g.innerHTML = glyph(t.dataset.g, t.dataset.t); t.replaceWith(g.firstChild); }
    else if (t.closest && t.closest('.pp')) t.closest('.pp').hidden = true;
  }, true);
  function seatSheet(slot) {
    const mode = UI.mode, L = layout(parse(slot).t, mode), cell = L[slot], z = zoneOf(slot);
    let h = '<div><div class="eyebrow">' + (mode === 'plan' ? 'Next' : 'Now') + '</div><h2 id="sheetTitle">' + esc(seatTitle(slot)) + '</h2></div>';
    h += '<div class="seat"><div class="btnrow"><span class="chip z-' + z + '">' + ZONE[z] + '</span><span class="chip">Faces ' + facing(slot) + '</span></div><ul>';
    if (cell.hold && cell.hold.note) h += '<li>' + esc(cell.hold.note) + '.</li>';
    else if (cell.hold && cell.hold.cap) h += '<li>A Cap keeps this pod clear.</li>';
    else h += '<li>Open.</li>';
    if (cell.next && cell.next.length) h += '<li>Next in: ' + esc(cell.next.map(p => p.label).join(', ')) + ' (from ' + esc(seatName(cell.next[0].now, true)) + ').</li>';
    if (cell.capNext) h += '<li>A Cap goes on here next.</li>';
    h += '<li>' + esc(leanText(slot)) + '</li><li>' + esc(twoUp(slot, mode)) + '</li></ul></div>';
    const fits = Object.entries(P.plants).filter(([id, pl]) => pl.status === 'idea' && pl.gb && pl.gb.zone && (pl.group === 'fruit') === (parse(slot).t === 'F') && Math.abs(ZRANK[pl.gb.zone] - ZRANK[z]) <= (z === 'low' ? 0 : 1)).slice(0, 4);
    if (fits.length && !cell.hold?.cap) h += '<div class="block"><h3>Ideas that suit this light</h3><div class="dome">' + fits.map(([id, pl]) => '<button data-open="plant" data-pid="' + id + '">' + plantGlyph(pl) + esc(pl.name) + '</button>').join('') + '</div></div>';
    if (mode !== 'plan' && !(cell.hold && cell.hold.cap)) h += '<div class="seat">' + podRow(slot) + '</div>';
    h += '<div class="btnrow"><button class="btn small ghost" data-act="copyLink" data-slot="' + slot + '">Copy a link to this seat</button></div>';
    showSheet(h, { kind: 'seat', slot });
  }

  /* ----- Plant list ----- */
  const FILTERS = [['tower', 'On the towers'], ['micro', 'Microgreens'], ['dome', 'Planned'], ['idea', 'Ideas'], ['retired', 'Retired'], ['all', 'All']];
  const inFilter = (pl, f) => f === 'all' || (f === 'dome' ? (pl.status === 'dome' || pl.status === 'planned') : pl.status === f);
  function plantWhere(pid) {
    const pods = P.pods.filter(p => p.p === pid); if (!pods.length) return '';
    const onS = pods.filter(p => parse(cur(p)) && parse(cur(p)).t === 'S').length, onF = pods.filter(p => parse(cur(p)) && parse(cur(p)).t === 'F').length;
    const waiting = pods.filter(p => !parse(cur(p))).length;
    const pend = pods.filter(p => { const m = MOVE_BY_POD[p.id]; return m && !isDone(m) && parse(cur(p)); });
    const outN = pend.filter(p => MOVE_BY_POD[p.id].kind === 'out').length, moving = pend.length - outN;
    const bits = [];
    if (onS) bits.push(onS + ' on the salad tower');
    if (onF) bits.push(onF + ' on the fruiting tower');
    if (waiting) bits.push(pods.length === 1 ? (pods[0].now === 'sow' ? 'to sow' : 'in the dome') + ' → ' + seatName(pods[0].plan, true) : waiting + ' to sow or in the dome');
    if (moving) bits.push(moving + ' moving');
    if (outN) bits.push(outN + ' coming out');
    return bits.join(' · ');
  }
  function renderPlants() {
    const q = ($('q').value || '').trim().toLowerCase();
    const ids = Object.keys(P.plants);
    const counts = {}; FILTERS.forEach(([f]) => { counts[f] = ids.filter(id => inFilter(P.plants[id], f)).length; });
    $('filters').innerHTML = FILTERS.map(([f, l]) => '<button data-filter="' + f + '" aria-pressed="' + (UI.filter === f) + '">' + l + '<span class="n">' + counts[f] + '</span></button>').join('');
    const match = id => { if (!q) return true; const pl = P.plants[id]; const fv = pl.flav || {}; const hay = [pl.name, pl.latin, pl.pests, pl.about, typeof pl.taste === 'string' ? pl.taste : '', (pl.gb && pl.gb.zone) + ' light', P.groups[pl.group], (pl.yours || []).join(' '), pl.why, pl.gone, (fv.flavor || []).join(' '), (fv.texture || []).join(' '), (fv.roles || []).map(r => P.roles[r].name).join(' '), fv.kitchen, (fv.warn || []).join(' '), fv.flag, /bristly|downy/.test(fv.flag || '') ? 'fuzzy hairy prickly' : '', P.pets[id] && P.pets[id].toxic ? 'cat pet toxic' : '', (VERD[id] || {}).v].join(' ').toLowerCase(); return q.split(/\s+/).every(w => hay.includes(w)); };
    const list = ids.filter(id => (q ? true : inFilter(P.plants[id], UI.filter)) && match(id));
    const order = { tower: 0, micro: 1, dome: 2, planned: 2, idea: 3, retired: 4 };
    list.sort((a, b) => (order[P.plants[a].status] - order[P.plants[b].status]) || P.plants[a].name.localeCompare(P.plants[b].name));
    $('plist').innerHTML = list.length ? list.map(id => { const pl = P.plants[id]; const g = pl.gb || {}; const where = plantWhere(id); return '<button class="prow" data-open="plant" data-pid="' + id + '"><span class="gwrap">' + plantPic(id) + '</span><span style="min-width:0"><span class="nm">' + esc(pl.name) + (tagStr(pl) ? ' <span class="muted" style="font-size:13px">' + tagStr(pl) + '</span>' : '') + (() => { const gv = pl.status === 'micro' ? null : givesOf(id); return gv && gv.k !== 'keeps' ? ' ' + givesPill(gv) : ''; })() + '</span>' + (pl.flav ? '<span class="fw" style="display:block">' + esc(pl.flav.flavor.join(', ')) + (pl.flav.texture && pl.flav.texture[0] ? ' · ' + esc(pl.flav.texture[0]) : '') + '</span>' : '<span class="lt" style="display:block">' + esc(pl.latin) + '</span>') + (where ? '<span class="wh" style="display:block">' + esc(where) + '</span>' : pl.status === 'micro' ? '<span class="wh" style="display:block">Microgreens Kit · Sprout Nursery</span>' : pl.why ? '<span class="wh" style="display:block">An idea to try</span>' : pl.gone ? '<span class="wh" style="display:block">Retired</span>' : '') + '</span><span class="rt">' + (g.zone ? '<span class="chip z-' + g.zone + '">' + g.zone + '</span>' : '') + (/\d/.test(g.mature || '') ? '<span class="days">' + esc(g.mature) + ' days</span>' : '') + (pl.flav && pl.flav.flag ? '<span class="flag">' + esc(pl.flav.flag) + '</span>' : '') + (VERD[id] ? '<span class="vd vd-' + VERD[id].v + '">' + VNAME[VERD[id].v] + '</span>' : '') + '</span></button>'; }).join('') : '<div class="card small">No plant matches “' + esc(q) + '”. Try a pest, a light zone, or part of a name.</div>';
  }

  /* ----- Care ----- */
  function renderCare() {
    const rows = P.care.map(c => ({ c, s: careStatus(c) }));
    const rank = { over: 0, due: 1, none: 2, ok: 3 };
    rows.sort((a, b) => (rank[a.s.state] - rank[b.s.state]) || (a.c.every - b.c.every));
    const dueN = rows.filter(r => r.s.state === 'over' || r.s.state === 'due').length;
    $('dueCount').textContent = dueN ? dueN + ' due' : '';
    const unN = rows.filter(r => r.s.state === 'none').length;
    $('rhythm').innerHTML = (unN ? '<div class="card catch"><div class="rowtop"><b>' + unN + (unN === 1 ? ' job has' : ' jobs have') + ' no date yet</b><button class="btn small primary" data-act="catchUp">Catch up</button></div><p class="small">Say roughly when you last did each one, a tap apiece, and the app works out what’s due.</p></div>' : '') + rows.map(({ c, s }) => {
      const chip = s.state === 'over' ? 'due' : s.state === 'due' ? 'due' : s.state === 'ok' ? 'ok' : '';
      const doneToday = CARE[c.id] === todayISO();
      return '<div class="task"><div><h4>' + esc(c.title) + '</h4><div class="where">' + esc(c.where) + ' · every ' + everyText(c.every) + '</div></div><div class="st"><span class="chip ' + chip + '">' + esc(s.text) + '</span>' +
        (doneToday ? '<button class="btn small ghost" data-act="careUndo" data-id="' + c.id + '">Undo</button>' : '<button class="btn small' + (s.state === 'over' || s.state === 'due' ? ' primary' : '') + '" data-act="careDone" data-id="' + c.id + '">Done today</button>') + '</div><div class="txt">' + esc(c.text) + (c.id === 'pollinate' ? ' <button class="linkish" data-act="fruitRound">Count the flowers while you’re there</button>' : '') + '<label class="last">Last done <input type="date" data-care-date="' + c.id + '" value="' + (CARE[c.id] || '') + '" max="' + todayISO() + '" aria-label="Last done: ' + esc(c.title) + ', ' + esc(c.where) + '"></label></div></div>';
    }).join('');
    renderCamps(); renderMoves(); renderFixes(); renderDoctor(); renderData();
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
    $('moves').innerHTML = (P.done ? '<div class="card small" style="padding:10px 14px"><b style="font-family:var(--font-display)">Done ' + esc(P.done.date) + ':</b> ' + esc(P.done.text) + '</div>' : '') + P.phaseOrder.map(ph => {
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

  function renderDoctor() {
    $('doctorChips').innerHTML = P.doctor.map(d => '<button data-act="doctor" data-id="' + d.id + '">' + esc(d.label) + '</button>').join('');
  }
  function doctorSheet(id) {
    const d = P.doctor.find(x => x.id === id); if (!d) return;
    const li = x => '<li>' + esc(x) + '</li>';
    let h = '<div><div class="eyebrow">Plant Doctor</div><h2 id="sheetTitle">' + esc(d.title) + '</h2></div>';
    h += '<div class="block"><h3>Most likely</h3><ul>' + d.likely.map(li).join('') + '</ul></div>';
    h += '<div class="block"><h3>What to do</h3><ul>' + d.todo.map(li).join('') + '</ul></div>';
    if (d.note) h += '<p class="small" style="margin:0">' + esc(d.note) + '</p>';
    const fx = d.fix && P.fixes.find(x => x.id === d.fix);
    if (fx) h += '<div class="btnrow"><button class="btn small" data-open="fix" data-id="' + fx.id + '">Your notes: ' + esc(fx.title) + ' ›</button></div>';
    h += '<div class="block"><h3>Something else?</h3><div class="dchips">' + P.doctor.filter(x => x.id !== id).map(x => '<button data-act="doctor" data-id="' + x.id + '">' + esc(x.label) + '</button>').join('') + '</div></div>';
    if (d.src && d.src.length) h += '<p class="src">Sources: ' + d.src.map(x => '<a href="' + esc(x[1]) + '" target="_blank" rel="noopener">' + esc(x[0]) + '</a>').join(' · ') + '</p>';
    showSheet(h, { kind: 'doctor', id });
  }
  /* ----- The Forbidden Shelf: its own page, a sheet per plant, and a game ----- */
  const FB = P.forbidden;
  const FBI = {}; FB.items.forEach(x => { FBI[x.id] = x; });
  function frow(x) {
    return '<button class="frow" data-act="forbItem" data-id="' + x.id + '"><span class="gwrap">' + glyph(x.glyph, x.tint) + '</span><span class="ft"><b>' + esc(x.name) + '</b><span class="latin">' + esc(x.latin) + '</span><span class="chip ' + x.tone + '">' + esc(x.status) + '</span></span><span class="go" aria-hidden="true">›</span></button>';
  }
  function renderForbidden() {
    $('forbIntro').textContent = FB.intro;
    $('forbJumps').innerHTML = FB.shelves.map(sh => '<button data-jump="shelf-' + sh.id + '">' + esc(sh.name) + '</button>').join('');
    $('forbShelves').innerHTML = FB.shelves.map(sh => { const items = FB.items.filter(x => x.shelf === sh.id); return '<div class="sec" id="shelf-' + sh.id + '"><h3>' + esc(sh.name) + ' <span class="count">' + items.length + '</span></h3><p class="small" style="margin:-2px 0 0">' + esc(sh.blurb) + '</p><div class="flist">' + items.map(frow).join('') + '</div></div>'; }).join('');
    $('forbNote').textContent = FB.note;
    renderGame();
  }
  const WHY_LABEL = { towers: 'What’s going on', history: 'The story', poison: 'Why it’s on the shelf', maine: 'Why', glass: 'Why it’s on the shelf', reputation: 'Why it’s on the shelf' };
  function forbSheet(id) {
    const x = FBI[id]; if (!x) return;
    const sh = FB.shelves.find(v => v.id === x.shelf);
    const blk = (k, v) => v ? '<div class="block"><h3>' + k + '</h3><p>' + esc(v) + '</p></div>' : '';
    let h = '<div class="ph"><div class="gwrap">' + glyph(x.glyph, x.tint) + '</div><div><div class="eyebrow">Forbidden Shelf · ' + esc(sh.name) + '</div><h2 id="sheetTitle">' + esc(x.name) + '</h2><div class="latin">' + esc(x.latin) + '</div></div></div>';
    h += '<div><span class="chip fchip ' + x.tone + '">' + esc(x.status) + '</span></div>';
    h += blk('The law', x.law) + blk(WHY_LABEL[x.shelf], x.why) + blk('In a Gardyn?', x.gardyn);
    if (x.cat) h += '<div class="petnote"><b>For the cat.</b> ' + esc(x.cat) + '</div>';
    if (x.fun) h += '<p class="small fun">' + esc(x.fun) + '</p>';
    const pl = (x.plants || []).filter(q => P.plants[q]);
    if (pl.length) h += '<div class="block"><h3>' + (pl.some(q => P.plants[q].status === 'tower') ? 'On your towers' : 'In the Plant Book') + '</h3><div class="dome">' + pl.map(q => '<button data-open="plant" data-pid="' + q + '">' + plantGlyph(P.plants[q]) + esc(P.plants[q].name) + '</button>').join('') + '</div></div>';
    const list = FB.items.filter(i => i.shelf === x.shelf), k = list.indexOf(x);
    h += '<div class="btnrow fnav">' + (k > 0 ? '<button class="btn small ghost" data-act="forbItem" data-id="' + list[k - 1].id + '">‹ ' + esc(list[k - 1].name) + '</button>' : '<span></span>') + (k < list.length - 1 ? '<button class="btn small ghost" data-act="forbItem" data-id="' + list[k + 1].id + '">' + esc(list[k + 1].name) + ' ›</button>' : '') + '</div>';
    h += '<p class="src">' + esc(FB.note) + (x.src && x.src.length ? ' Sources: ' + x.src.map(v => '<a href="' + esc(v[1]) + '" target="_blank" rel="noopener">' + esc(v[0]) + '</a>').join(' · ') : '') + '</p>';
    showSheet(h, { kind: 'forb', id });
  }
  /* Legal in Maine? Ten cards a round, four answers, the best score kept on this phone. */
  const FGS = Object.assign({ best: null, plays: 0 }, store.get('fgame', {}));
  let FG = null;
  function fgRound() { const idx = FB.game.map((_, i) => i); for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } FG = { q: idx.slice(0, 10), i: 0, score: 0, pick: null }; }
  const fgRight = (c, k) => k === c.a || (c.also || []).includes(k);
  function renderGame() {
    if (!FG) fgRound();
    const el = $('fgame'), A = FB.answers, L = {}; A.forEach(([k, l]) => { L[k] = l; });
    const best = FGS.best != null ? 'best ' + FGS.best + ' of 10' : 'ten cards a round';
    if (FG.i >= FG.q.length) {
      const v = FB.verdicts.find(([n]) => FG.score >= n);
      el.innerHTML = '<div class="fg-top"><span class="eyebrow">Legal in Maine?</span><span class="small fg-meta">' + esc(best) + '</span></div><p class="fg-q">' + FG.score + ' of ' + FG.q.length + ' right.</p><p class="fg-r">' + esc(v ? v[1] : '') + '</p><div class="btnrow"><button class="btn primary" data-act="fgNew">Deal ten more</button></div>';
      return;
    }
    const c = FB.game[FG.q[FG.i]];
    let h = '<div class="fg-top"><span class="eyebrow">Legal in Maine? · ' + (FG.i + 1) + ' of ' + FG.q.length + '</span><span class="small fg-meta">' + FG.score + ' right · ' + esc(best) + '</span></div>';
    h += '<p class="fg-q">' + esc(c.q) + '</p><div class="fg-a" role="group" aria-label="Your answer">' + A.map(([k, l]) => { let cls = 'fg-b'; if (FG.pick) { if (fgRight(c, k)) cls += ' right'; else if (k === FG.pick) cls += ' wrong'; } return '<button class="' + cls + '" data-act="fgPick" data-k="' + k + '"' + (FG.pick ? ' disabled' : '') + '>' + esc(l) + '</button>'; }).join('') + '</div>';
    if (FG.pick) {
      const ok = fgRight(c, FG.pick);
      h += '<p class="fg-r ' + (ok ? 'ok' : 'no') + '"><b>' + (ok ? (FG.pick === c.a ? 'Right.' : 'Close enough: ' + esc(L[c.a].toLowerCase()) + '.') : 'Not quite: ' + esc(L[c.a].toLowerCase()) + '.') + '</b> ' + esc(c.why) + '</p><div class="btnrow"><button class="btn small primary" data-act="fgNext">' + (FG.i === FG.q.length - 1 ? 'See your score' : 'Next card') + '</button><button class="btn small ghost" data-act="forbItem" data-id="' + c.item + '">Read the shelf entry</button></div>';
    }
    el.innerHTML = h;
  }

  /* ----- Ideas ----- */
  let SCOUT = store.get('scout', {});
  const inScout = (id, pl, f) => f === 'all' ? true : f === 'short' ? !!SCOUT[id] : f === 'outside' ? !!pl.notGardyn : f === 'keeps' ? (givesOf(id) || {}).k === 'keeps' : (pl.fit || []).includes(f);
  function ideaCard(id, pl) {
    const g = pl.gb || {}, on = !!SCOUT[id], pet = P.pets[id], fv = pl.flav;
    return '<div class="idea' + (on ? ' starred' : '') + '"><button class="idea-main" data-open="plant" data-pid="' + id + '"><span class="gwrap">' + plantPic(id) + '</span><span style="min-width:0"><h4>' + esc(pl.name) + (pl.notGardyn ? ' <span class="og">outside Gardyn</span>' : '') + '</h4>' +
      (fv ? '<span class="fw">' + esc(fv.flavor.join(', ')) + (fv.texture && fv.texture[0] ? ' · ' + esc(fv.texture[0]) : '') + '</span>' : '') + '<p>' + esc(pl.why || '') + '</p><span class="chips">' +
      (() => { const gv = givesOf(id); return gv ? '<span class="chip gv-' + gv.k + '">' + HV.givesWord[gv.k] + '</span>' : ''; })() + (g.zone ? '<span class="chip z-' + g.zone + '">' + ZONE[g.zone] + '</span>' : '') + (/\d/.test(g.mature || '') ? '<span class="chip">' + esc(g.mature) + ' days</span>' : '') + (g.size && g.size !== '—' ? '<span class="chip">' + esc(g.size) + '</span>' : '') +
      (pet ? '<span class="chip' + (pet.toxic ? ' wait' : pet.unlisted ? '' : ' ok') + '">' + (pet.toxic ? 'cat: careful' : pet.unlisted ? 'cat: not listed' : 'cat-safe') + '</span>' : '') + '</span></span></button>' +
      '<button class="star" data-act="scoutStar" data-pid="' + id + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Take ' + esc(pl.name) + ' off the shortlist' : 'Add ' + esc(pl.name) + ' to the shortlist') + '">' + (on ? '★' : '☆') + '</button></div>';
  }
  function renderIdeas() {
    const ideas = Object.entries(P.plants).filter(([, pl]) => pl.status === 'idea');
    const f = P.scoutFilters.some(([k]) => k === UI.scout) ? UI.scout : 'all';
    const starred = ideas.filter(([id]) => SCOUT[id]).length;
    $('scoutFilters').innerHTML = P.scoutFilters.map(([k, l]) => { const n = ideas.filter(([id, pl]) => inScout(id, pl, k)).length; return (k === 'short' && !n && f !== 'short') ? '' : '<button data-scout="' + k + '" aria-pressed="' + (f === k) + '">' + l + '<span class="n">' + n + '</span></button>'; }).join('');
    $('scoutCount').textContent = starred ? starred + ' starred' : ideas.length + ' ideas';
    const list = ideas.filter(([id, pl]) => inScout(id, pl, f)).sort((a, b) => ((SCOUT[b[0]] ? 1 : 0) - (SCOUT[a[0]] ? 1 : 0)) || a[1].name.localeCompare(b[1].name));
    $('ideaPlants').innerHTML = list.length ? list.map(([id, pl]) => ideaCard(id, pl)).join('') : '<div class="card small">Nothing starred yet. Tap ☆ on any idea to shortlist it.</div>';
    $('shelfCard').innerHTML = '<button class="fshelf" data-go="forbidden"><span class="fs-glyphs" aria-hidden="true">' + ['cannabis', 'foxglove', 'currants', 'lettuce', 'blue-lotus'].map(id => { const x = FBI[id]; return glyph(x.glyph, x.tint); }).join('') + '</span><span class="fs-t"><b>The Forbidden Shelf</b><span>' + FB.items.length + ' plants on six shelves: the controlled ones, the poison cabinet, what Maine bans, and what’s hiding on your own towers. Plus a game: Legal in Maine?</span></span><span class="go" aria-hidden="true">›</span></button>';
    $('gear').innerHTML = P.gear.map(g => '<div><b>' + esc(g.title) + '</b><p>' + esc(g.why) + '</p></div>').join('');
    $('questions').innerHTML = P.questions.map(q => '<div><b>' + esc(q.q) + '</b><p>' + esc(q.a) + '</p></div>').join('');
    $('watch').innerHTML = P.watch.map(w => '<div><b>' + esc(w.title) + '</b><p>' + esc(w.text) + '</p></div>').join('');
    $('aboutVersion').textContent = 'Version ' + APP_VERSION + (window.__BUILD__ ? ' · build ' + window.__BUILD__ : '');
    renderSeedBox(); renderGiveRule();
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
  const FOOT = Object.assign({ towers: 2, kwh: P.greener.kwh, rate: P.greener.rate }, store.get('foot', {}));
  let ATE = store.get('ate', []);
  const bowlsThisMonth = () => ATE.filter(a => a.d.slice(0, 7) === todayISO().slice(0, 7)).length;
  function paintFoot() {
    const kwh = FOOT.towers * FOOT.kwh, m = kwh * FOOT.rate, n = bowlsThisMonth();
    $('footOut').innerHTML = '<div class="stats"><div><span class="k">Electricity</span><span class="v">' + Math.round(kwh) + ' <small>kWh a month</small></span></div><div><span class="k">Costs</span><span class="v">$' + m.toFixed(2) + ' <small>a month</small></span></div><div><span class="k">A year</span><span class="v">$' + Math.round(m * 12) + '</span></div></div>' +
      '<p class="small" style="margin:0">' + esc(P.greener.heat) + '</p>' +
      (PRINTS.length ? (() => { const t = printTotals(); return '<p class="small" style="margin:0"><b>The printer so far:</b> ' + t.kwh.toFixed(2) + ' kWh, ' + usd(t.pow) + '. Switched off between runs, it stays that small.</p>'; })() : '') +
      '<p class="small" style="margin:0"><b>' + n + (n === 1 ? ' bowl' : ' bowls') + ' from the towers this month</b>' + (n ? ', each one a clamshell of greens that didn’t have to ride the ferry.' : '. Tap “We ate this” on the Salad tab and they’ll count here.') + '</p>';
    paintHarvest();
  }

  /* ----- The scoreboard: the month's harvest at store prices, against the month's power ----- */
  function renderHarvest() {
    const el = $('harvest'); if (!el) return;
    if (!el.dataset.ready) {
      el.dataset.ready = '1';
      el.innerHTML = '<div id="hvOut" class="stack"></div><details class="pset" id="hvSet"><summary>Store prices, and how it’s counted</summary>' +
        '<div class="fields">' + HV.prices.map(x => '<label for="hp-' + x.id + '">' + esc(x.label) + '<input id="hp-' + x.id + '" data-hprice="' + x.id + '" type="number" min="0" max="100" step="0.01" inputmode="decimal"></label>').join('') + '</div>' +
        '<p class="small" style="margin:0">These are the USDA’s national average advertised prices for Oct 23, 2026: sale prices, mostly, and a ferry ride cheaper than the island. Put in what you actually pay and the tally follows.</p>' +
        '<div class="list hv-notes">' + HV.prices.map(x => '<div><b>' + esc(x.label.split(',')[0]) + '</b><p>' + esc(x.note) + '</p></div>').join('') + '<div><b>Leafy pickings</b><p id="hvCal"></p></div><div><b>Not priced</b><p>' + esc(HV.unpriced) + '</p></div></div>' +
        '<div class="btnrow"><button class="btn small ghost" data-act="hpReset">Back to the USDA prices</button></div>' +
        '<p class="src" style="margin:0">Sources: ' + HV.src.map(s => '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + '</a>').join(' · ') + '</p></details>';
      fillPrices();
      el.querySelectorAll('[data-hprice]').forEach(inp => inp.addEventListener('input', () => { const v = parseFloat(inp.value); if (isFinite(v) && v >= 0) PRICE[inp.dataset.hprice] = Math.min(100, v); store.set('hprice', PRICE); paintHarvest(); }));
    }
    paintHarvest();
  }
  function fillPrices() { HV.prices.forEach(x => { const i = $('hp-' + x.id); if (i) i.value = PRICE[x.id]; }); }
  function paintHarvest() {
    const el = $('hvOut'); if (!el) return;
    const today = todayISO(), ym = today.slice(0, 7), y = +ym.slice(0, 4), m = +ym.slice(5), t = tally(ym + '-01', today), pow = powerMonth();
    const dim = new Date(Date.UTC(y, m, 0)).getUTCDate(), dom = +today.slice(8);
    let run = 0, paid = null; Object.keys(t.byDay).sort().forEach(d => { run += t.byDay[d]; if (!paid && pow > 0 && run >= pow) paid = d; });
    const pct = pow > 0 ? Math.min(100, t.total / pow * 100) : 100, pace = dom >= 5 && t.total > 0 ? t.total / dom * dim : 0;
    let h = '<div class="hv-head"><span class="eyebrow">' + MONTHS_LONG[m - 1] + ' so far</span><span class="hv-big num">' + usd(t.total) + '</span><span class="small">of groceries from the towers, at store prices, against <b>' + usd(pow) + '</b> of power for the whole month</span></div>';
    h += '<div class="hv-bar" role="img" aria-label="' + Math.round(pct) + ' percent of the month’s power covered"><i style="width:' + pct.toFixed(1) + '%"></i></div>';
    h += '<p class="small" style="margin:0">' + (paid ? '<b>The towers paid for the month’s power on ' + fmtDate(paid) + '.</b> Everything since is ahead.' : t.total > 0 ? usd(Math.max(0, pow - t.total)) + ' to go to cover it.' + (pace ? ' On pace for about ' + usd(pace) + ' by the end of ' + MONTHS_LONG[m - 1] + '.' : '') : 'Nothing logged yet this month. Tick pods on the picking round and count fruit as you pick it.') + '</p>';
    const rows = [];
    if (t.leafOz > 0) rows.push(['Greens and herbs', ozStr(t.leafOz) + ', about ' + boxWord(t.leafOz / HV.boxOz) + ' · ' + plural(t.picks, 'picking', 'pickings'), usd(t.leafV)]);
    Object.keys(t.fruit).forEach(pid => { const x = t.fruit[pid]; rows.push([P.plants[pid] ? P.plants[pid].name : pid, x.n + ' ' + fw(pid, x.n), eachPrice(pid) > 0 ? usd(x.v) : 'not priced']); });
    if (rows.length) h += '<div class="hv-rows">' + rows.map(r => '<div><span>' + esc(r[0]) + '<small>' + esc(r[1]) + '</small></span><b class="num">' + esc(r[2]) + '</b></div>').join('') + '</div>';
    const past = [];
    for (let i = 1; i <= 6; i++) { const dt = new Date(Date.UTC(y, m - 1 - i, 1)), k = dt.getUTCFullYear() + '-' + String(dt.getUTCMonth() + 1).padStart(2, '0'), tt = tally(k + '-01', monthEnd(k)); if (tt.total > 0) past.push([dt.getUTCMonth(), tt.total]); }
    if (past.length) h += '<div class="hv-months"><span class="eyebrow">Earlier months, against ' + usd(pow) + ' of power</span>' + past.map(([mi, v]) => '<div><span>' + MONTHS_LONG[mi] + '</span><span class="num">' + usd(v) + '</span><span class="num ' + (v >= pow ? 'up' : 'down') + '">' + (v >= pow ? '+' : '−') + usd(Math.abs(v - pow)) + '</span></div>').join('') + '</div>';
    el.innerHTML = h;
    const cal = leafCal(), c = $('hvCal');
    if (c) c.textContent = 'Until you size a round, a leafy picking counts as about ' + ozStr(HV.leafOz.greens) + ' of greens, or ' + ozStr(HV.leafOz.herbs) + ' of an herb: a starting guess, not a measurement. ' + (cal.n >= 2 ? 'From the ' + cal.n + ' rounds you’ve sized, yours run about ' + (Math.round(cal.f * 10) / 10) + ' times that, so that’s what the unsized days use.' : 'Size two rounds on the picking round, by eye or on a kitchen scale, and the app goes by yours.');
  }
  function renderGreener() {
    const el = $('footprint');
    if (!el.dataset.ready) {
      el.dataset.ready = '1';
      el.innerHTML = '<div class="fields"><label for="fTow">Towers<input id="fTow" type="number" min="1" max="6" step="1" inputmode="numeric"></label><label for="fKwh">kWh per tower, per month<input id="fKwh" type="number" min="5" max="200" step="1" inputmode="numeric"></label><label for="fRate">Your rate, $ per kWh<input id="fRate" type="number" min="0.05" max="1" step="0.0001" inputmode="decimal"></label></div><div id="footOut" class="stack"></div><p class="small" style="margin:0">' + esc(P.greener.kwhNote) + '</p><p class="small" style="margin:0">' + esc(P.greener.rateNote) + '</p>';
      $('fTow').value = FOOT.towers; $('fKwh').value = FOOT.kwh; $('fRate').value = FOOT.rate;
      ['fTow', 'fKwh', 'fRate'].forEach(i => $(i).addEventListener('input', () => { FOOT.towers = Math.max(0, +$('fTow').value || 0); FOOT.kwh = Math.max(0, +$('fKwh').value || 0); FOOT.rate = Math.max(0, +$('fRate').value || 0); store.set('foot', FOOT); paintFoot(); }));
    }
    paintFoot(); renderHarvest();
    const ref = P.care.filter(c => /^refresh-/.test(c.id)), tank = P.greener.tank;
    const gal = ref.reduce((g, c) => g + tank * 30 / c.every, 0);
    $('waterCard').innerHTML = '<p style="margin:0"><b>About ' + Math.round(gal) + ' gallons a month</b> leave the towers at Tank Refresh time: ' + tank + ' gallons per Tank, ' + ref.map(c => esc(c.where.toLowerCase()) + ' every ' + everyText(c.every)).join(', ') + '.</p><p>' + esc(P.greener.water) + '</p>';
    const rows = a => a.map(([k, v]) => '<div><b>' + esc(k) + '</b><p>' + esc(v) + '</p></div>').join('');
    $('wasteList').innerHTML = rows(P.greener.waste); $('seedList').innerHTML = rows(P.greener.seeds); $('regrowList').innerHTML = rows(P.greener.regrow);
    $('greenSrc').innerHTML = 'Sources: ' + P.greener.src.map(x => '<a href="' + esc(x[1]) + '" target="_blank" rel="noopener">' + esc(x[0]) + '</a>').join(' · ');
  }
  function renderDIY() {
    renderGreener();
    renderPrinter();
    renderTrail();
    $('why').innerHTML = P.why.map(([t, x]) => '<div class="card"><h4>' + esc(t) + '</h4><p>' + esc(x) + '</p></div>').join('');
    $('fillList').innerHTML = P.fill.map(f => '<div><div class="rowtop"><b>' + esc(f.crop) + '</b><span class="chip">' + esc(f.cost) + ' each</span></div><p><span class="fillname">' + esc(f.fill) + '.</span> ' + esc(f.note) + '</p></div>').join('');
    $('briefTbl').innerHTML = '<tbody>' + P.brief.map(([k, v]) => '<tr><td class="k">' + esc(k) + '</td><td>' + esc(v) + '</td></tr>').join('') + '</tbody>';
    $('cleanPods').innerHTML = P.cleanPods;
    $('mediaList').innerHTML = P.media.map(m => '<div><div class="rowtop"><b>' + esc(m.name) + '</b><span class="chip' + (/Dries|Drier/.test(m.top) ? ' ok' : '') + '">' + esc(m.top) + '</span></div><p>' + esc(m.note) + '</p><div class="facts"><span>Water held <b class="num">' + esc(m.water) + '</b></span><span>Each <b class="num">' + esc(m.cost) + '</b></span></div></div>').join('');
    $('models').innerHTML = P.models.map(([t, u, n]) => '<div><b><a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(t) + '</a></b><p>' + esc(n) + '</p></div>').join('') + P.shop.map(([t, u, n]) => '<div><b><a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(t) + '</a></b><p>' + esc(n) + '</p></div>').join('');
    $('bench').innerHTML = P.bench.map(b => '<div><b>' + esc(b.title) + '</b><p>' + esc(b.text) + '</p>' + (/QR tags/.test(b.title) ? '<p><a class="btn small" href="' + SITE + 'tags.html" target="_blank" rel="noopener">Open the printable tags</a></p>' : '') + '</div>').join('');
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
  /* ----- The printer: a ledger where every print has to earn its plastic back ----- */
  const PR = P.printer;
  const PSET = Object.assign({ w: 75, kg: 20, yc: 5.99, plug: 0.21, casing: 4, wool: 4 }, store.get('printer', {}));
  let PRINTS = store.get('prints', []);
  const PODS = { seats: {}, past: 0 }; { const pz = store.get('podseats', {}); PODS.seats = pz.seats || {}; PODS.past = pz.past || 0; }
  const savePods = () => store.set('podseats', { seats: PODS.seats, past: PODS.past });
  const usd = n => (n < -0.005 ? '−$' : '$') + Math.abs(n).toFixed(Math.abs(n) >= 100 ? 0 : 2);
  const carbon = k => k < 1 ? Math.round(k * 1000) + ' g' : k.toFixed(k < 10 ? 2 : 1) + ' kg';
  const partCost = p => p.g / 1000 * PSET.kg + p.min / 60 * PSET.w / 1000 * FOOT.rate;
  const partCarbon = (p, ef) => p.g / 1000 * ef + p.min / 60 * PSET.w / 1000 * PR.grid;
  function printTotals() {
    const t = { g: 0, gBad: 0, kwh: 0, co2: 0, parts: 0, failed: 0, covers: 0, unknown: 0 };
    PRINTS.forEach(e => {
      const gg = e.n * e.g; t.g += gg; t.kwh += e.n * e.min / 60 * PSET.w / 1000;
      if (e.ok) { t.parts += e.n; if (e.part === 'cover') t.covers += e.n; } else { t.gBad += gg; t.failed += e.n; }
      const ef = PR.ef[e.mat]; if (ef == null) t.unknown += gg; else t.co2 += gg / 1000 * ef;
    });
    t.co2 += t.kwh * PR.grid; t.fil = t.g / 1000 * PSET.kg; t.pow = t.kwh * FOOT.rate; t.cost = t.fil + t.pow;
    return t;
  }
  function podTotals() { const s = Object.keys(PODS.seats); return { seats: s.length, S: s.filter(x => x[0] === 'S').length, F: s.filter(x => x[0] === 'F').length, plantings: PODS.past + s.reduce((a, x) => a + (PODS.seats[x].n || 0), 0) }; }
  function partPayback(p) {
    const cost = partCost(p);
    if (p.kind === 'ycube') {
      const save = PSET.yc - PSET.plug, m = save > 0 ? Math.max(1, Math.ceil(cost / save)) : '—', tr = Math.max(1, Math.ceil(p.g / Math.max(0.5, PSET.casing + PSET.wool)));
      return 'About ' + usd(cost) + ' to print. Money back at planting ' + m + ', trash by planting ' + tr + ', carbon at about planting ' + Math.ceil(partCarbon(p, PR.ef.petg) / PR.netPerPlanting) + ' (' + Math.ceil(partCarbon(p, PR.ef.rpetg) / PR.netPerPlanting) + ' in recycled PETG).';
    }
    if (p.kind === 'cap') return 'About ' + usd(cost) + ' to print, against ' + usd(PR.capEach) + ' for a Gardyn Cap ($29.99 for five): it pays back the day it goes in.';
    if (p.kind === 'repair') return 'About ' + usd(cost) + ' to print. It pays back by keeping a tower running: no overfilled Tank, no pump run dry.';
    return 'About ' + usd(cost) + ' to print, with nothing to replace.';
  }
  function podRow(slot) {
    const ps = PODS.seats[slot];
    if (!ps) return '<div class="podrow"><span class="small">In a yCube.</span><button class="btn small ghost" data-act="podMark" data-slot="' + slot + '">It’s in a printed pod</button></div>';
    return '<div class="podrow on"><span class="small"><b>Printed pod</b> since ' + esc(fmtDate(ps.since)) + ' · ' + ps.n + (ps.n === 1 ? ' planting' : ' plantings') + '</span><span class="btnrow"><button class="btn small" data-act="podReplant" data-slot="' + slot + '">Replanted +1</button>' + (ps.n > 0 ? '<button class="btn small ghost" data-act="podUndo" data-slot="' + slot + '" aria-label="Take one planting off">−1</button>' : '') + '<button class="btn small ghost" data-act="podOut" data-slot="' + slot + '">Take it out</button></span></div>';
  }
  function podChanged() { if (!$('view-towers').hidden) renderTower(); if (!$('view-diy').hidden) paintOff(); refreshSheet(); }
  function renderPrinter() {
    $('printRules').innerHTML = PR.rules.map(([t, x]) => '<div class="card"><h4>' + esc(t) + '</h4><p>' + esc(x) + '</p></div>').join('');
    $('printSkip').textContent = PR.skip;
    buildLog(); paintOff(); paintParts(); paintLogSum();
    const rows = a => a.map(([k, v]) => '<div><b>' + esc(k) + '</b><p>' + esc(v) + '</p></div>').join('');
    const sb = PR.standbyW * 24 * 30 / 1000 * FOOT.rate;
    $('printHabits').innerHTML = rows(PR.habits.map(([k, v]) => [k, v.replace('STANDBY', usd(sb))]));
    $('printScrap').innerHTML = rows(PR.scrap);
    $('printNot').textContent = PR.notCounted;
    $('printSrc').innerHTML = 'Sources: ' + PR.src.map(x => '<a href="' + esc(x[1]) + '" target="_blank" rel="noopener">' + esc(x[0]) + '</a>').join(' · ');
  }
  function paintOff() {
    const pt = podTotals(), t = printTotals();
    const net = pt.plantings * (PSET.yc - PSET.plug) + t.covers * PR.capEach - t.cost;
    const saved = pt.plantings * PR.netPerPlanting, pct = Math.round(pt.seats / 60 * 100);
    let h = '<div class="or-head"><div class="or-bar" role="img" aria-label="' + pt.seats + ' of 60 seats in printed pods"><i style="width:' + pct + '%"></i></div><p class="small" style="margin:0"><b class="num">' + pt.seats + '</b> of 60 seats in printed pods' + (pt.seats ? ' (salad ' + pt.S + ', fruiting ' + pt.F + ')' : ': every plant is still in a yCube') + '</p></div>';
    h += '<div class="stats"><div><span class="k">Plantings</span><span class="v">' + pt.plantings + ' <small>yCubes not bought</small></span></div><div><span class="k">Money</span><span class="v">' + usd(net) + ' <small>after printing</small></span></div><div><span class="k">Trash</span><span class="v">' + Math.round(pt.plantings * (PSET.casing + PSET.wool)) + ' g <small>kept out</small></span></div></div>';
    if (!PRINTS.length && pt.plantings) {
      h += '<p class="small" style="margin:0"><b>Carbon:</b> these plantings have saved about ' + carbon(saved) + '. Log the prints that made the pods, and this weighs their carbon against it.</p>';
    } else if (!t.co2 && !pt.plantings) {
      const pod = PR.parts[0];
      h += '<p class="small" style="margin:0"><b>Carbon:</b> a virgin-PETG pod starts about ' + carbon(partCarbon(pod, PR.ef.petg)) + ' of carbon in debt, plastic plus print power, and pays back about ' + carbon(PR.netPerPlanting) + ' each time it replaces a yCube. Recycled PETG halves the debt.</p>';
    } else {
      const left = Math.max(0, Math.ceil((t.co2 - saved) / PR.netPerPlanting)), cp = t.co2 ? Math.min(100, Math.round(saved / t.co2 * 100)) : 100;
      h += '<div class="cbal"><div class="or-bar c" role="img" aria-label="Carbon paid back: ' + cp + ' percent"><i style="width:' + cp + '%"></i></div><p class="small" style="margin:0"><b>Carbon:</b> printing so far ≈ ' + carbon(t.co2) + '; plantings have saved ≈ ' + carbon(saved) + '. ' + (left ? 'Paid back after about ' + left + ' more ' + (left === 1 ? 'planting' : 'plantings') + ' in printed pods.' : 'Paid back.') + (t.unknown ? ' Prints in “something else” aren’t counted.' : '') + '</p></div>';
    }
    h += '<p class="small muted" style="margin:0">Mark a seat when a printed pod goes in, from the Pods view on the map or any pod’s page, and tap Replanted each time it takes a new plant.</p>';
    $('offRock').innerHTML = h;
  }
  function paintParts() {
    $('printParts').innerHTML = PR.parts.map(p => '<div class="part"><div class="rowtop"><b>' + esc(p.name) + '</b><span class="chip ' + p.verdict[0] + '">' + esc(p.verdict[1]) + '</span></div><p>' + esc(p.what) + '</p><p class="pay">' + esc(partPayback(p)) + '</p><div class="facts"><span>About <b class="num">' + p.g + ' g</b></span><span><b class="num">' + p.min + ' min</b></span>' + (p.model ? '<span><a href="' + esc(p.model[1]) + '" target="_blank" rel="noopener">' + esc(p.model[0]) + '</a></span>' : '<span>' + (p.id === 'dipstick' ? 'No model needed' : 'No free model: the pod brief below') + '</span>') + '</div><p class="small how">' + esc(p.how) + '</p><div class="btnrow"><button class="btn small ghost" data-act="plogFor" data-part="' + p.id + '">Log a print of this</button></div></div>').join('');
  }
  function buildLog() {
    const el = $('printLog'); if (el.dataset.ready) return; el.dataset.ready = '1';
    const opt = (v, l) => '<option value="' + v + '">' + esc(l) + '</option>';
    el.innerHTML = '<div id="logSum" class="stack"></div><div class="btnrow"><button class="btn small primary" data-act="plogOpen">Log a print</button></div>' +
      '<div class="plform" id="plForm" hidden><div class="fields">' +
      '<label for="plPart">What<select id="plPart">' + PR.parts.map(p => opt(p.id, p.name)).join('') + opt('custom', 'Something else') + '</select></label>' +
      '<label for="plName" id="plNameL" hidden>Name it<input id="plName" type="text" maxlength="60" autocomplete="off"></label>' +
      '<label for="plN">How many<input id="plN" type="number" min="1" max="200" step="1" inputmode="numeric" value="1"></label>' +
      '<label for="plG">Grams each<input id="plG" type="number" min="0.1" max="2000" step="0.1" inputmode="decimal"></label>' +
      '<label for="plMin">Minutes each<input id="plMin" type="number" min="1" max="6000" step="1" inputmode="numeric"></label>' +
      '<label for="plMat">Filament<select id="plMat">' + PR.mats.map(([k, l]) => opt(k, l)).join('') + '</select></label>' +
      '<label for="plOk">How it went<select id="plOk">' + opt('1', 'Printed fine') + opt('0', 'Failed: into the scrap jar') + '</select></label>' +
      '</div><p class="small" style="margin:0">Use the grams and minutes your slicer shows before you print.</p><div class="btnrow"><button class="btn small primary" data-act="plogAdd">Add to the log</button><button class="btn small ghost" data-act="plogCancel">Cancel</button></div></div>' +
      '<div class="list plist" id="plList"></div>' +
      '<details class="pset"><summary>Your numbers</summary><div class="fields">' +
      '<label for="psW">Printer watts, printing<input id="psW" type="number" min="5" max="2000" step="1" inputmode="numeric"></label>' +
      '<label for="psKg">Filament, $ per kg<input id="psKg" type="number" min="1" max="200" step="0.01" inputmode="decimal"></label>' +
      '<label for="psYc">yCube price<select id="psYc">' + PR.ycOptions.map(([v, l]) => opt(v, l)).join('') + '</select></label>' +
      '<label for="psPlug">Plug in the pod<select id="psPlug">' + PR.plugOptions.map(([v, l]) => opt(v, l)).join('') + '</select></label>' +
      '<label for="psCas">yCube casing, grams<input id="psCas" type="number" min="0" max="50" step="0.1" inputmode="decimal"></label>' +
      '<label for="psWool">Rockwool plug, grams<input id="psWool" type="number" min="0" max="50" step="0.1" inputmode="decimal"></label>' +
      '</div><p class="small" style="margin:0">75 W is Bambu’s own measurement for the A1 mini printing PETG, and $20 a kilogram is PETG on sale. Gardyn doesn’t publish what a yCube weighs, so 4 grams each is a guess: weigh a dry, used casing and its wool on a kitchen scale and put your numbers in. Power uses your rate from the footprint above.</p></details>';
    $('plPart').addEventListener('change', plPrefill);
    ['psW', 'psKg', 'psYc', 'psPlug', 'psCas', 'psWool'].forEach(i => $(i).addEventListener('input', readSet));
    fillSet();
  }
  function fillSet() { $('psW').value = PSET.w; $('psKg').value = PSET.kg; $('psYc').value = String(PSET.yc); $('psPlug').value = String(PSET.plug); $('psCas').value = PSET.casing; $('psWool').value = PSET.wool; }
  function readSet() {
    const num = (id, d, lo, hi) => { const v = parseFloat($(id).value); return isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d; };
    PSET.w = num('psW', 75, 5, 2000); PSET.kg = num('psKg', 20, 1, 200); PSET.yc = num('psYc', 5.99, 0, 50); PSET.plug = num('psPlug', 0.21, 0, 5); PSET.casing = num('psCas', 4, 0, 50); PSET.wool = num('psWool', 4, 0, 50);
    store.set('printer', PSET); paintOff(); paintParts(); paintLogSum(); paintFoot();
  }
  const MAT = {}; PR.mats.forEach(([k, l]) => { MAT[k] = l; });
  const mins = m => m < 60 ? Math.round(m) + ' min' : (m / 60).toFixed(m < 600 ? 1 : 0).replace(/\.0$/, '') + ' h';
  function paintLogSum() {
    if (!$('logSum')) return;
    const t = printTotals();
    $('logCount').textContent = PRINTS.length ? PRINTS.length + (PRINTS.length === 1 ? ' entry' : ' entries') : '';
    $('logSum').innerHTML = !PRINTS.length ? '<p class="small" style="margin:0">Nothing logged yet. Log each batch as it comes off the plate: the app adds up the plastic, the power and the scrap, and the Off rockwool card weighs them against what the pods replace.</p>' :
      '<div class="stats"><div><span class="k">Printed</span><span class="v">' + t.parts + ' <small>' + (t.parts === 1 ? 'part' : 'parts') + (t.failed ? ', ' + t.failed + ' failed' : '') + '</small></span></div><div><span class="k">Filament</span><span class="v">' + Math.round(t.g) + ' g <small>' + usd(t.fil) + '</small></span></div><div><span class="k">Power</span><span class="v">' + t.kwh.toFixed(2) + ' <small>kWh, ' + usd(t.pow) + '</small></span></div></div>' +
      (t.gBad ? '<p class="small" style="margin:0"><b>Scrap jar:</b> ' + Math.round(t.gBad) + ' g of failed prints, ' + Math.round(t.gBad / t.g * 100) + '% of the filament so far.</p>' : '');
    $('plList').innerHTML = PRINTS.slice().reverse().map(e => '<div class="plrow' + (e.ok ? '' : ' bad') + '"><span><b>' + esc(e.name) + (e.n > 1 ? ' ×' + e.n : '') + '</b><span class="small">' + esc(fmtDate(e.d)) + ' · ' + Math.round(e.n * e.g * 10) / 10 + ' g ' + esc(MAT[e.mat] || '') + ' · ' + mins(e.n * e.min) + (e.ok ? '' : ' · failed') + '</span></span><button class="btn small ghost" data-act="plogDel" data-id="' + esc(e.id) + '">Delete</button></div>').join('');
  }
  function plPrefill() { const p = PR.parts.find(x => x.id === $('plPart').value); $('plNameL').hidden = !!p; if (p) { $('plG').value = p.g; $('plMin').value = p.min; } }
  function plOpen(part) {
    buildLog(); const f = $('plForm'); f.hidden = false;
    if (part) $('plPart').value = part;
    $('plN').value = 1; $('plOk').value = '1'; plPrefill();
    const top = f.getBoundingClientRect().top + window.scrollY - 90; window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
  function plAdd() {
    const part = $('plPart').value, p = PR.parts.find(x => x.id === part);
    const n = Math.round(parseFloat($('plN').value)), g = parseFloat($('plG').value), m = parseFloat($('plMin').value);
    const name = p ? p.name : ($('plName').value || '').trim();
    if (!p && !name) { $('plName').focus(); toast('Give it a name.'); return; }
    if (!(n >= 1 && n <= 200)) { $('plN').focus(); toast('How many: 1 to 200.'); return; }
    if (!(g > 0 && g <= 2000)) { $('plG').focus(); toast('Grams each, from the slicer.'); return; }
    if (!(m > 0 && m <= 6000)) { $('plMin').focus(); toast('Minutes each, from the slicer.'); return; }
    PRINTS.push({ id: Date.now().toString(36), d: todayISO(), part, name: name.slice(0, 60), n, g: Math.round(g * 10) / 10, min: Math.round(m), mat: $('plMat').value, ok: $('plOk').value === '1' });
    PRINTS = PRINTS.slice(-500); store.set('prints', PRINTS);
    $('plForm').hidden = true; paintLogSum(); paintOff(); paintFoot(); toast($('plOk').value === '1' ? 'Logged.' : 'Logged, into the scrap jar.');
  }
  function stopSheet(id) {
    const s = P.trail.find(x => x.id === id); const i = P.trail.indexOf(s); const st = trailState(id);
    const h = '<div><div class="eyebrow">Beyond the yCube · stop ' + i + ' of ' + (P.trail.length - 1) + '</div><h2 id="sheetTitle">' + esc(s.title) + '</h2><div class="small">' + esc(s.when) + '</div></div><div class="card prose">' + s.body + '</div>' +
      '<div class="seg" role="group" aria-label="Status">' + [['todo', 'To do'], ['doing', 'Underway'], ['done', 'Done']].map(([k, l]) => '<button data-act="stop" data-id="' + id + '" data-st="' + k + '" aria-pressed="' + (st === k) + '">' + l + '</button>').join('') + '</div>';
    showSheet(h, { kind: 'stop', id });
  }
  function fixSheet(id) { const f = P.fixes.find(x => x.id === id); showSheet('<div><div class="eyebrow">Fixes</div><h2 id="sheetTitle">' + esc(f.title) + '</h2><div class="small">' + esc(f.sub) + '</div></div><div class="card prose">' + f.body + '</div>', { kind: 'fix', id }); }

  /* ----- Salad: build a bowl ----- */
  const BOWL = store.get('bowl', []).filter(id => P.plants[id]);
  const SAVED = store.get('bowls', []);
  const MGSEL = store.get('mgsel', ['mg-spicy', 'mg-sango', 'mg-lemonbasil']);
  const saveBowl = () => store.set('bowl', BOWL);
  const bowlable = id => { const pl = P.plants[id]; return !!(pl && pl.flav && (pl.status === 'tower' || pl.status === 'micro')); };
  const AX = () => P.axes;
  function bowlTotals() { const t = {}; P.axes.forEach(([k]) => { t[k] = 0; }); BOWL.forEach(id => { const w = P.plants[id].flav.w || {}; Object.keys(w).forEach(k => { t[k] += w[k]; }); }); return t; }
  function dressingFor(t) {
    const has = id => BOWL.includes(id), D = P.dressings;
    const sourGreen = BOWL.some(id => (P.plants[id].flav.w.tang || 0) >= 2);
    if (t.sweet >= 4 && (has('ground-cherry') || has('yellow-cherry-tomato')) && t.pepper >= 1) return D.lime;
    if (t.tang >= 3 && sourGreen) return D.oil;
    if (t.sweet >= 4) return D.balsamic;
    if (t.earthy >= 3) return D.sherry;
    if ((has('green-tatsoi') || has('red-tatsoi')) && t.pepper + t.earthy >= 3) return D.sesame;
    if (t.pepper >= 3) return D.honeyLemon;
    if (t.cool >= 3 && (has('cucumber') || has('cucamelon') || has('dill'))) return D.yogurt;
    if (t.herbal >= 1 && (has('butterhead') || has('buttercrunch'))) return D.buttermilk;
    return D.dijon;
  }
  const TEXC = [['soft', /soft|tender|buttery|smooth|delicate|glossy/], ['crunch', /crunch|crisp|snappy|firm/], ['juicy', /juic|watery|succulent/], ['airy', /lacy|feather|frill/]];
  function textureLine() {
    const by = { soft: [], crunch: [], juicy: [], airy: [] };
    BOWL.forEach(id => { const pl = P.plants[id]; (pl.flav.texture || []).filter(x => !/bristly|stringy|tough|downy|sticky/.test(x)).forEach(x => TEXC.forEach(([k, re]) => { if (re.test(x) && !by[k].includes(pl.name)) by[k].push(pl.name); })); });
    const nm = a => a.length > 3 ? a.slice(0, 2).join(', ') + ' and ' + (a.length - 2) + ' more' : a.length === 3 ? a[0] + ', ' + a[1] + ' and ' + a[2] : a.join(' and ');
    const parts = [];
    if (by.soft.length) parts.push('soft from ' + nm(by.soft));
    if (by.crunch.length) parts.push('crunch from ' + nm(by.crunch));
    if (by.juicy.length) parts.push('juicy from ' + nm(by.juicy));
    if (by.airy.length) parts.push('airy from ' + nm(by.airy));
    return { text: parts.join('; '), crunch: by.crunch.length > 0 };
  }
  const ROLE_FILL = { base: ['butterhead', 'buttercrunch', 'green-salanova', 'romaine', 'perpetual-spinach'], crunch: ['romaine', 'purslane', 'green-salanova', 'cucumber', 'cucamelon'], pepper: ['nasturtium', 'red-tatsoi', 'green-tatsoi', 'mg-sango', 'mg-spicy'], tang: ['red-sorrel', 'purslane', 'cucamelon'], herb: ['dill', 'salad-burnet', 'mint', 'chocolate-mint'], color: ['lollo-rossa', 'bulls-blood', 'borage', 'nasturtium', 'red-tatsoi'] };
  function suggestions() {
    if (!BOWL.length) return [];
    const have = new Set(); BOWL.forEach(id => P.plants[id].flav.roles.forEach(r => have.add(r)));
    const out = [];
    ['base', 'crunch', 'tang', 'pepper', 'herb', 'color'].forEach(r => {
      if (have.has(r) || out.length >= 3) return;
      const cands = (ROLE_FILL[r] || []).filter(id => bowlable(id) && !BOWL.includes(id));
      if (!cands.length) return;
      const score = id => BOWL.reduce((n, b) => n + ((P.plants[b].flav.pairs || []).includes(id) ? 2 : 0) + ((P.plants[id].flav.pairs || []).includes(b) ? 2 : 0), 0);
      cands.sort((a, b) => score(b) - score(a));
      out.push([r, cands[0]]);
    });
    return out;
  }
  function pairHits() {
    const hits = [];
    for (let i = 0; i < BOWL.length; i++) for (let j = i + 1; j < BOWL.length; j++) {
      const a = P.plants[BOWL[i]], b = P.plants[BOWL[j]];
      if ((a.flav.pairs || []).includes(BOWL[j]) || (b.flav.pairs || []).includes(BOWL[i])) hits.push(a.name + ' + ' + b.name);
    }
    return hits;
  }
  const amount = v => v <= 0 ? 'none' : v < 1.5 ? 'a hint' : v < 3 ? 'some' : v < 5 ? 'plenty' : 'a lot';
  function renderBowl() {
    const t = bowlTotals();
    let h = '<div class="bowl-head"><div><div class="eyebrow">Tonight’s bowl</div><h4>' + (BOWL.length ? BOWL.length + (BOWL.length === 1 ? ' plant' : ' plants') : 'Empty') + '</h4></div>' + (BOWL.length ? '<button class="btn small ghost" data-act="bowlClear">Clear</button>' : '') + '</div>';
    if (!BOWL.length) h += '<p class="small" style="margin:0">Tap plants below, or make one of the house salads. The bowl shows its balance, its texture, any heads-ups and a dressing to match.</p>';
    else {
      h += '<div class="dome">' + BOWL.map(id => '<button data-act="bowlToggle" data-pid="' + id + '" aria-label="Remove ' + esc(P.plants[id].name) + '">' + plantGlyph(P.plants[id]) + esc(P.plants[id].name) + ' <small>✕</small></button>').join('') + '</div>';
      h += '<div class="balance">' + P.axes.map(([k, l]) => '<div class="ax"><span class="axl">' + l + '</span><span class="axt"><i class="ax-' + k + '" style="width:' + Math.min(100, t[k] / 6 * 100).toFixed(0) + '%"></i></span><span class="axv">' + amount(t[k]) + '</span></div>').join('') + '</div>';
      const tx = textureLine();
      h += '<p class="small" style="margin:8px 0 0"><b>Texture:</b> ' + esc(tx.text ? tx.text.replace(/^./, c => c.toUpperCase()) : 'Mixed') + '.' + (tx.crunch ? '' : ' <span class="nudge">Nothing crunchy yet.</span>') + '</p>';
      const hits = pairHits(); if (hits.length) h += '<p class="small" style="margin:4px 0 0"><b>Good together:</b> ' + esc(hits.slice(0, 3).join(' · ')) + (hits.length > 3 ? ' · and ' + (hits.length - 3) + ' more' : '') + '</p>';
      const flagged = BOWL.filter(id => P.plants[id].flav.flag);
      if (flagged.length) h += '<div class="warn" style="margin-top:8px"><b>Before you eat it</b><ul>' + flagged.map(id => { const fv = P.plants[id].flav; return '<li><b>' + esc(P.plants[id].name) + ', ' + esc(fv.flag) + ':</b> ' + esc((fv.warn || [''])[0]) + '</li>'; }).join('') + '</ul></div>';
      const d = dressingFor(t);
      h += '<div class="callout" style="margin-top:8px"><b>' + esc(d.name) + '.</b> ' + esc(d.how) + ' <span class="muted">' + esc(d.why) + '</span></div>';
      const sug = suggestions(); if (sug.length) h += '<div class="sug"><span class="small"><b>It could use:</b></span>' + sug.map(([r, id]) => '<button class="btn small" data-act="bowlToggle" data-pid="' + id + '">' + plantGlyph(P.plants[id]) + '+ ' + esc(P.plants[id].name) + ' <span class="muted">(' + esc(P.roles[r].name.toLowerCase()) + ')</span></button>').join('') + '</div>';
      h += '<div class="btnrow" style="margin-top:2px"><button class="btn small" data-act="bowlAte">We ate this</button><button class="btn small ghost" data-act="bowlShare">Share</button></div>';
      const nb = bowlsThisMonth(); if (nb) h += '<p class="small muted" style="margin:0">' + nb + (nb === 1 ? ' bowl' : ' bowls') + ' from the towers this month.</p>';
      h += '<div class="saverow"><input id="bowlName" class="search" placeholder="Name it to save it" aria-label="Bowl name" maxlength="60"><button class="btn small primary" data-act="bowlSave">Save</button></div>';
    }
    $('bowl').innerHTML = h;
    renderPickers();
  }
  function renderPickers() {
    const ids = Object.keys(P.plants).filter(bowlable);
    $('pickers').innerHTML = P.roleOrder.map(r => {
      const list = ids.filter(id => P.plants[id].flav.roles[0] === r);
      if (!list.length) return '';
      return '<div class="pick"><div class="pick-h"><span class="sw2 ax-' + r + '"></span><b>' + esc(P.roles[r].name) + '</b> <span class="muted small">' + esc(P.roles[r].hint) + '</span></div><div class="dome">' + list.map(id => '<button data-act="bowlToggle" data-pid="' + id + '" aria-pressed="' + BOWL.includes(id) + '">' + plantGlyph(P.plants[id]) + esc(P.plants[id].name) + '</button>').join('') + '</div></div>';
    }).join('');
  }
  function renderSaved() {
    $('saved').hidden = !SAVED.length;
    $('savedList').innerHTML = SAVED.map((b, i) => '<div><div class="rowtop"><b>' + esc(b.name) + '</b><span class="btnrow"><button class="btn small" data-act="bowlLoad" data-i="' + i + '">Load</button><button class="btn small ghost" data-act="bowlDel" data-i="' + i + '" aria-label="Delete ' + esc(b.name) + '">Delete</button></span></div><p>' + esc(b.plants.filter(id => P.plants[id]).map(id => P.plants[id].name).join(', ')) + '</p></div>').join('');
  }
  function renderHouse() {
    $('house').innerHTML = P.house.map(hs => '<div class="card house"><div class="rowtop"><h4>' + esc(hs.name) + '</h4><button class="btn small primary" data-act="bowlLoad" data-house="' + hs.id + '">Make this</button></div><div class="glyphs">' + hs.plants.map(id => P.plants[id] ? '<button data-open="plant" data-pid="' + id + '" title="' + esc(P.plants[id].name) + '" aria-label="' + esc(P.plants[id].name) + '">' + plantGlyph(P.plants[id]) + '</button>' : '').join('') + '</div><p class="small">' + esc(hs.plants.filter(id => P.plants[id]).map(id => P.plants[id].name).join(', ')) + '</p><p class="small"><b>Dressing:</b> ' + esc(hs.dressing) + '</p><p class="small muted">' + esc(hs.note) + '</p></div>').join('');
  }
  const VNAME = { keep: 'Keep', retry: 'Retry', retire: 'Retire' };
  function verdictSeg(pid) { const vd = (VERD[pid] || {}).v; return '<div class="seg sm" role="group" aria-label="Verdict on ' + esc(P.plants[pid].name) + '">' + Object.keys(VNAME).map(k => '<button data-act="verdict" data-pid="' + pid + '" data-v="' + k + '" aria-pressed="' + (vd === k) + '">' + VNAME[k] + '</button>').join('') + '</div>'; }
  function renderFlights() {
    $('flights').innerHTML = P.flights.map(f => {
      const ids = f.plants.filter(id => P.plants[id] && P.plants[id].status === 'tower'); if (ids.length < 2) return '';
      const rated = ids.filter(id => VERD[id]).length;
      return '<div class="card flight"><div class="rowtop"><h4>' + esc(f.name) + '</h4><span class="small muted">' + rated + ' of ' + ids.length + ' rated</span></div><p class="small">' + esc(f.note) + '</p><div class="list">' + ids.map(id => '<div class="fl-row"><button class="fl-name" data-open="plant" data-pid="' + id + '">' + plantGlyph(P.plants[id]) + '<span><b>' + esc(P.plants[id].name) + '</b><span class="small">' + esc(P.plants[id].flav.flavor.join(', ')) + '</span></span></button>' + verdictSeg(id) + '</div>').join('') + '</div></div>';
    }).join('');
  }
  function renderIsland() {
    $('islandSrc').innerHTML = 'Sources: ' + (P.islandSources || []).map(x => '<a href="' + esc(x[1]) + '" target="_blank" rel="noopener">' + esc(x[0]) + '</a>').join(' · ');
    $('island').innerHTML = P.island.map(x => '<div><div class="rowtop"><b>' + esc(x.name) + '</b><span class="glyphs sm">' + x.plants.filter(id => P.plants[id]).map(id => '<button data-open="plant" data-pid="' + id + '" title="' + esc(P.plants[id].name) + '" aria-label="' + esc(P.plants[id].name) + '">' + plantGlyph(P.plants[id]) + '</button>').join('') + '</span></div><p>' + esc(x.how) + '</p></div>').join('');
  }
  function nurseryNote() {
    const sow = P.moves.find(m => m.id === 'sow-beans'), b1 = P.moves.find(m => m.pod === 'bean-1');
    if (!sow || !b1 || isDone(b1)) return '';
    return (isDone(sow) ? 'The beans are sprouting in the Nursery now' : 'The beans are next in the Nursery') + ', by the Soak Method, which drains the base and leaves microgreen wicks dry. Pick a date after they move up to the tower, or use a second Nursery.';
  }
  function midDays(range) { const m = String(range).match(/(\d+)\D+(\d+)/); return m ? Math.round((+m[1] + +m[2]) / 2) : +range; }
  function renderPlanner() {
    const mgs = Object.keys(P.plants).filter(id => P.plants[id].status === 'micro');
    const el = $('mgPlan');
    if (!el.dataset.ready) { el.dataset.ready = '1'; $('mgDate').value = addDays(todayISO(), Math.max(14, ...MGSEL.filter(id => P.plants[id]).map(id => midDays(P.plants[id].gb.mature)))); $('mgDate').min = todayISO(); $('mgDate').addEventListener('change', renderPlanner); }
    $('mgChips').innerHTML = mgs.map(id => '<button data-act="mgPick" data-pid="' + id + '" aria-pressed="' + MGSEL.includes(id) + '">' + plantGlyph(P.plants[id]) + esc(P.plants[id].name.replace(' Microgreens', '')) + '</button>').join('');
    const target = $('mgDate').value || addDays(todayISO(), 14);
    const rows = MGSEL.filter(id => P.plants[id]).map(id => { const d = midDays(P.plants[id].gb.mature); return { id, d, start: addDays(target, -d) }; }).sort((a, b) => a.start < b.start ? -1 : 1);
    const today = todayISO();
    const nn = nurseryNote();
    el.innerHTML = (nn ? '<p class="small nudge" style="margin:0 0 8px">' + esc(nn) + '</p>' : '') + (rows.length ? '<div class="list">' + rows.map(r => '<div><div class="rowtop"><b>' + esc(P.plants[r.id].name) + '</b><span class="chip' + (r.start < today ? ' wait' : r.start === today ? ' due' : '') + '">' + (r.start < today ? 'Too late for this date' : r.start === today ? 'Start today' : 'Start ' + fmtDate(r.start)) + '</span></div><p>Harvests ' + esc(P.plants[r.id].gb.mature) + ' days after starting; planned at day ' + r.d + '.</p></div>').join('') + '</div><p class="small" style="margin:6px 0 0">' + rows.length + ' of the Nursery’s 10 squares.</p>' : '<p class="small">Pick a variety or two.</p>');
  }
  function renderMicroHow() {
    $('mgHow').innerHTML = P.microHow.map(([k, v]) => '<div><b>' + esc(k) + '</b><p>' + esc(v) + '</p></div>').join('');
    const mgs = Object.keys(P.plants).filter(id => P.plants[id].status === 'micro');
    const heat = id => { const w = P.plants[id].flav.w || {}; return (w.pepper || 0) >= 2 ? 'hot' : (w.herbal || 0) >= 1 && !w.pepper ? 'aroma' : 'mild'; };
    const auditionOf = id => Object.keys(P.audition).find(k => P.audition[k] === id);
    const row = id => { const pl = P.plants[id], au = auditionOf(id); return '<button class="prow" data-open="plant" data-pid="' + id + '"><span class="gwrap">' + plantPic(id) + '</span><span style="min-width:0"><span class="nm">' + esc(pl.name) + '</span><span class="fw" style="display:block">' + esc(pl.flav.flavor.join(', ')) + '</span><span class="wh" style="display:block">' + esc(pl.flav.kitchen) + (au && P.plants[au] ? ' <b class="aud">Audition for ' + esc(P.plants[au].name) + '</b>' : '') + '</span></span><span class="rt"><span class="days">' + esc(pl.gb.mature) + ' days</span></span></button>'; };
    $('mgList').innerHTML = [['hot', 'Hot and peppery'], ['mild', 'Mild'], ['aroma', 'Aromatic']].map(([g, l]) => { const ids = mgs.filter(id => heat(id) === g); return ids.length ? '<h4 class="mg-h">' + l + '</h4>' + ids.map(row).join('') : ''; }).join('');
  }
  function renderCautions() {
    $('cautions').innerHTML = P.cautions.map(([k, v]) => '<div><b>' + esc(k) + '</b><p>' + esc(v) + '</p></div>').join('') + '<div><p class="src" style="margin:0">Sources: ' + P.cautionSources.map(s => '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + '</a>').join(' · ') + '</p></div>';
  }
  let saladReady = false;
  function renderSalad() {
    renderBowl(); renderSaved(); renderPlanner();
    renderFlights();
    if (!saladReady) { saladReady = true; renderHouse(); renderIsland(); renderMicroHow(); renderCautions(); }
  }

  /* ----- Picking round ----- */
  let PICK = store.get('pick', {});
  let VERD = store.get('verdict', {});
  const PICK_EVERY = 7;
  const pickable = p => { if (!parse(cur(p))) return false; const pl = P.plants[p.p]; return !!pl && ['greens', 'herbs', 'flowers'].includes(pl.group); };
  function pickList() { const today = dayNum(todayISO()); return P.pods.filter(pickable).map(p => { const last = PICK[p.id] || null; const days = last ? today - dayNum(last) : null; return { p, last, days, due: days === null || days >= PICK_EVERY }; }); }
  function setPicked(ids, on) {
    const today = todayISO();
    ids.forEach(id => {
      if (on) { PICK[id] = today; if (!HARV.some(h => h.k === 'leaf' && h.pod === id && h.d === today)) HARV.push({ d: today, pod: id, p: POD[id].p, k: 'leaf', n: 1 }); }
      else {
        HARV = HARV.filter(h => !(h.k === 'leaf' && h.pod === id && h.d === today));
        const prev = HARV.filter(h => h.k === 'leaf' && h.pod === id).map(h => h.d).sort().pop();
        if (prev) PICK[id] = prev; else delete PICK[id];
      }
    });
    store.set('pick', PICK); saveHarv();
  }

  /* ----- The harvest log: leafy pickings, fruit and flowers, and what they'd cost at the store ----- */
  const HV = P.harvest;
  const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let HARV = store.get('harv', null);
  if (!Array.isArray(HARV)) {   // first run: one picking for each pod's last logged pick, so this month isn't blank
    HARV = []; Object.keys(PICK).forEach(id => { if (POD[id] && PICK[id]) HARV.push({ d: PICK[id], pod: id, p: POD[id].p, k: 'leaf', n: 1 }); });
    if (HARV.length) store.raw('harv', HARV);
  }
  let HAMT = store.get('hamt', {});
  let FLOW = store.get('flow', []);
  const PRICE = {};
  const priceDefaults = () => { HV.prices.forEach(x => { PRICE[x.id] = x.v; }); };
  priceDefaults(); Object.assign(PRICE, store.get('hprice', {}));
  const saveHarv = () => { HARV = HARV.slice(-6000); store.set('harv', HARV); };
  const saveFlow = () => { FLOW = FLOW.slice(-3000); store.set('flow', FLOW); };
  const saveHamt = () => store.set('hamt', HAMT);
  function harvestChanged() { renderToday(); refreshSheet(); paintHarvest(); if (!$('view-towers').hidden && UI.lens === 'pick') renderTower(); }
  const byD = (a, b) => a.d < b.d ? -1 : a.d > b.d ? 1 : 0;
  const plural = (n, a, b) => n + ' ' + (n === 1 ? a : b);
  const fw = (pid, n) => { const w = HV.fruitWord[pid] || ['fruit', 'fruit']; return n === 1 ? w[0] : w[1]; };
  const ozStr = oz => (oz < 10 ? Math.round(oz * 4) / 4 : Math.round(oz)).toString().replace(/\.25$/, '¼').replace(/\.5$/, '½').replace(/\.75$/, '¾').replace(/^0(?=[¼½¾])/, '') + ' oz';
  const boxWord = b => { const r = Math.round(b * 2) / 2; if (!r) return 'under half a box'; return (r === 0.5 ? '½' : String(r).replace(/\.5$/, '½')) + (r <= 1 ? ' box' : ' boxes'); };

  /* Leafy pickings: a starting guess per pod, scaled to your own sizing once you've sized two rounds. */
  const leafEst = h => (HV.leafOz[(P.plants[h.p] || {}).group] || HV.leafOz.greens) * (h.n || 1);
  const dayEst = d => HARV.reduce((s, h) => s + (h.k === 'leaf' && h.d === d ? leafEst(h) : 0), 0);
  function leafCal() {
    let a = 0, b = 0, n = 0;
    Object.keys(HAMT).forEach(d => { const est = dayEst(d); if (est > 0 && HAMT[d] > 0) { a += HAMT[d]; b += est; n++; } });
    return { f: n >= 2 ? Math.min(4, Math.max(0.25, a / b)) : 1, n };
  }
  const leafDay = (d, f) => HAMT[d] != null ? HAMT[d] : dayEst(d) * f;
  const ozPrice = () => (PRICE.greens || 0) / HV.boxOz;
  function eachPrice(pid) { const c = HV.prices.find(x => x.id === pid), v = PRICE[pid]; if (!c || !(v > 0)) return 0; return c.count ? v / c.count : c.pkgG ? v / c.pkgG * c.g : 0; }
  function monthEnd(ym) { const [y, m] = ym.split('-').map(Number); return ym + '-' + String(new Date(Date.UTC(y, m, 0)).getUTCDate()).padStart(2, '0'); }
  const powerMonth = () => FOOT.towers * FOOT.kwh * FOOT.rate;
  function tally(from, to) {
    const f = leafCal().f, days = new Set(), byDay = {};
    HARV.forEach(h => { if (h.k === 'leaf' && h.d >= from && h.d <= to) days.add(h.d); });
    Object.keys(HAMT).forEach(d => { if (d >= from && d <= to) days.add(d); });
    let leafOz = 0; days.forEach(d => { const oz = leafDay(d, f); leafOz += oz; byDay[d] = (byDay[d] || 0) + oz * ozPrice(); });
    const fruit = {}; let fruitV = 0;
    HARV.forEach(h => { if (h.k !== 'fruit' || h.d < from || h.d > to) return; const x = fruit[h.p] = fruit[h.p] || { n: 0, v: 0 }, v = h.n * eachPrice(h.p); x.n += h.n; x.v += v; fruitV += v; byDay[h.d] = (byDay[h.d] || 0) + v; });
    const picks = HARV.filter(h => h.k === 'leaf' && h.d >= from && h.d <= to).length;
    return { leafOz, leafV: leafOz * ozPrice(), fruit, fruitV, total: leafOz * ozPrice() + fruitV, picks, byDay };
  }

  /* Flowers to fruit. Each picked fruit is matched to the oldest logged flower that could have made it;
     a flower past the "give" day without fruit didn't set. Three matches, and your own timing takes over. */
  const median = a => { const s = a.slice().sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2); };
  function fruitModel(pid) {
    const R = HV.ripe[pid] || {}, flowers = [], picks = [];
    FLOW.filter(x => x.p === pid).sort(byD).forEach(x => { for (let i = 0; i < x.n; i++) flowers.push(x.d); });
    HARV.filter(h => h.k === 'fruit' && h.p === pid).sort(byD).forEach(h => { for (let i = 0; i < h.n; i++) picks.push(h.d); });
    const minLag = R.lo ? Math.max(3, Math.floor(R.lo / 2)) : 5, maxLag = R.give || 120;
    const used = flowers.map(() => false), lags = [];
    picks.forEach(pd => { const p = dayNum(pd); for (let i = 0; i < flowers.length; i++) { if (used[i]) continue; const lag = p - dayNum(flowers[i]); if (lag < minLag) break; if (lag > maxLag) continue; used[i] = true; lags.push(lag); break; } });
    const mine = lags.length >= 3 ? median(lags) : null;
    const win = mine ? { lo: Math.round(mine * 0.85), hi: Math.round(mine * 1.15), give: Math.max(R.give || 0, Math.round(mine * 1.6)), mid: mine } : R.lo ? { lo: R.lo, hi: R.hi, give: R.give, mid: Math.round((R.lo + R.hi) / 2) } : null;
    const today = dayNum(todayISO());
    const open = flowers.filter((d, i) => !used[i]).map(d => ({ d, age: today - dayNum(d) })).filter(x => x.age <= (win ? win.give : 120));
    const now = win ? open.filter(x => x.age >= win.lo) : [];
    const next = win && open.length ? addDays(open[0].d, win.mid) : null;
    return { pid, R, win, mine, lags: lags.length, open, now, next };
  }
  function fruitPlants() {
    const at = {}; P.pods.forEach(p => { const pl = P.plants[p.p], q = parse(cur(p)); if (pl && pl.group === 'fruit' && q) at[p.p] = Math.min(at[p.p] || 99, q.r); });
    return Object.keys(at).sort((a, b) => at[a] - at[b]);
  }
  const ripeNow = () => fruitPlants().map(fruitModel).filter(m => m.now.length);
  function fruitStatus(m) {
    const fl = n => plural(n, 'flower', 'flowers');
    if (m.now.length) return m.now.length + ' ' + fw(m.pid, m.now.length) + ' should be ripe' + (m.open.length > m.now.length ? ' · ' + (m.open.length - m.now.length) + ' more on the way' : '');
    if (m.open.length && m.next) return fl(m.open.length) + ' on the way · first ripe about ' + fmtDate(m.next);
    if (m.open.length) return fl(m.open.length) + ' since ' + fmtDate(m.open[0].d);
    return 'No flowers logged';
  }
  const todayN = (arr, pid, k) => arr.reduce((s, x) => s + (x.p === pid && x.d === todayISO() && (!k || x.k === k) ? x.n : 0), 0);
  function bump(kind, pid, by) {
    const today = todayISO(), arr = kind === 'flower' ? FLOW : HARV;
    let e = arr.find(x => x.p === pid && x.d === today && (kind === 'flower' || (x.k === 'fruit' && !x.pod)));
    if (!e && by > 0) { e = kind === 'flower' ? { d: today, p: pid, n: 0 } : { d: today, p: pid, k: 'fruit', n: 0 }; arr.push(e); }
    if (!e) return;
    e.n = Math.max(0, e.n + by);
    if (!e.n) arr.splice(arr.indexOf(e), 1);
    if (kind === 'flower') saveFlow(); else saveHarv();
  }
  function stepper(kind, pid, n, label, aria) {
    const a = esc(aria || label + ' today');
    return '<span class="step' + (n ? ' on' : '') + '">' + (label ? '<span class="st-l">' + label + '</span>' : '') + '<button class="st-b" data-act="' + kind + 'Del" data-pid="' + pid + '" aria-label="' + a + ': one fewer"' + (n ? '' : ' disabled') + '>−</button><span class="st-v num">' + n + '</span><button class="st-b" data-act="' + kind + 'Add" data-pid="' + pid + '" aria-label="' + a + ': one more">+</button></span>';
  }
  function fruitRow(pid) {
    const pl = P.plants[pid], m = fruitModel(pid);
    return '<div class="fr"><button class="fr-n" data-open="plant" data-pid="' + pid + '"><span class="gwrap">' + plantPic(pid) + '</span><span class="fr-t"><b>' + esc(pl.name) + '</b><span class="small' + (m.now.length ? ' ripe' : '') + '">' + esc(fruitStatus(m)) + '</span></span></button>' +
      '<span class="fr-b">' + stepper('flower', pid, todayN(FLOW, pid), 'Flowers') + stepper('fruit', pid, todayN(HARV, pid, 'fruit'), 'Picked') + '</span></div>';
  }
  function fruitBlock(pid) {
    const m = fruitModel(pid), R = m.R, ym = todayISO().slice(0, 7);
    const all = HARV.filter(h => h.k === 'fruit' && h.p === pid), month = all.filter(h => h.d.slice(0, 7) === ym).reduce((s, h) => s + h.n, 0), total = all.reduce((s, h) => s + h.n, 0);
    let h = '<div class="block fruitblk"><h3>Flowers and fruit</h3><div class="fr solo"><span class="fr-t"><span class="small' + (m.now.length ? ' ripe' : '') + '">' + esc(fruitStatus(m)) + '</span></span><span class="fr-b">' + stepper('flower', pid, todayN(FLOW, pid), 'Flowers') + stepper('fruit', pid, todayN(HARV, pid, 'fruit'), 'Picked') + '</span></div>';
    h += '<p class="small">' + (m.mine ? '<b>Your towers:</b> about ' + m.mine + ' days from flower to picking, from ' + m.lags + ' ' + fw(pid, m.lags) + '.' + (R.say ? ' The books say ' + esc(R.say) + '.' : '') : R.say ? '<b>Flower to ripe:</b> ' + esc(R.say) + '. ' + esc(R.src) + ' After three matched pickings, the app goes by your own.' : esc(R.sign || '')) + '</p>';
    if (total) h += '<p class="small" style="margin-top:4px"><b>Picked:</b> ' + month + ' this month, ' + total + ' in all' + (eachPrice(pid) > 0 ? ', about ' + usd(total * eachPrice(pid)) + ' at the store.' : '.') + '</p>';
    return h + '</div>';
  }
  function sizeBlock() {
    const d = todayISO(), have = HAMT[d], est = dayEst(d), cal = leafCal();
    if (!est && have == null) return '';
    const said = have != null ? 'You said ' + ozStr(have) + '.' : 'Until you say, it’s counted as about ' + ozStr(est * cal.f) + (cal.n >= 2 ? ', going by the rounds you’ve sized.' : ', a starting guess.');
    return '<div class="block size"><h3>How much came off today?</h3><p class="small">By eye, in 5-ounce boxes of salad greens. ' + said + '</p><div class="dchips">' + HV.sizes.map(b => '<button data-act="hSize" data-b="' + b + '" aria-pressed="' + (have != null && Math.abs(have - b * HV.boxOz) < 0.01) + '">' + boxWord(b) + '</button>').join('') + '</div><label class="last">Or weigh it <input id="hOz" type="number" min="0" max="400" step="0.1" inputmode="decimal" value="' + (have != null ? have : '') + '" aria-label="Today’s picking, in ounces"> oz' + (have != null ? ' <button class="btn small ghost" data-act="hSizeClear">Clear</button>' : '') + '</label></div>';
  }
  function tallyLine() {
    const ym = todayISO().slice(0, 7), t = tally(ym + '-01', todayISO()), pow = powerMonth();
    return '<b>' + MONTHS_LONG[+ym.slice(5) - 1] + ' so far: about ' + usd(t.total) + ' of groceries</b> from the towers, against ' + usd(pow) + ' of power for the month. <button class="linkish" data-go="diy" data-anchor="harvSec">Open the scoreboard</button>';
  }
  function pickSheet(focus) {
    const L = pickList(), today = todayISO();
    const order = x => { const q = parse(cur(x.p)); return (q.t === 'S' ? 0 : 100) + q.r * 3 + 'LCR'.indexOf(q.c); };
    L.sort((a, b) => order(a) - order(b));
    const fps = fruitPlants(), ripe = fps.map(fruitModel).filter(m => m.now.length);
    let h = '<div><div class="eyebrow">Picking round</div><h2 id="sheetTitle">What to pick</h2><p class="small" style="margin:4px 0 0">A pick about once a week keeps leafy plants from bolting or crowding the pod two rows up. Walk the tower top to bottom and tick each one as you go; fruit gets counted below.</p></div>';
    if (ripe.length) h += '<div class="callout ripe"><b>Should be ripe now:</b> ' + esc(ripe.map(m => m.now.length + ' ' + fw(m.pid, m.now.length)).join(', ')) + ', going by the flowers you logged. Color and feel decide.</div>';
    ['S', 'F'].forEach(t => {
      const rows = L.filter(x => parse(cur(x.p)).t === t); if (!rows.length) return;
      h += '<div class="block"><h3>' + esc(P.towers[t].name) + '</h3><div class="list picks">' + rows.map(x => { const pl = P.plants[x.p.p], done = x.last === today; return '<div class="pk' + (x.days !== null && x.days >= PICK_EVERY ? ' due' : '') + '"><span class="gwrap">' + plantPic(x.p.p) + '</span><span class="pk-t"><b>' + esc(x.p.label) + '</b><span class="small">' + esc(seatName(cur(x.p))) + ' · ' + (done ? 'picked today' : x.last ? 'picked ' + (x.days === 1 ? 'yesterday' : x.days + ' days ago') : 'not logged') + '</span></span><button class="tick" data-act="pickToggle" data-pod="' + x.p.id + '" aria-pressed="' + done + '" aria-label="Picked ' + esc(x.p.label) + ' today"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button></div>'; }).join('') + '</div></div>';
    });
    h += L.length ? '<div class="btnrow"><button class="btn primary" data-act="pickAll">Picked them all today</button></div>' + sizeBlock() : '<div class="card small">Nothing leafy on the towers right now.</div>';
    if (fps.length) h += '<div class="block" id="fruitSec"><h3>Flowers and fruit</h3><p class="small">Count flowers as they open (the pollinating round is a good time) and fruit as you pick it. The app works out when each should be ripe, and learns your towers’ own timing.</p><div class="list fruits">' + fps.map(fruitRow).join('') + '</div></div>';
    h += '<div class="callout tally">' + tallyLine() + '</div><div class="btnrow"><button class="btn small" data-act="shareCard">Share tonight’s picture</button></div>';
    showSheet(h, { kind: 'pick' });
    if (focus === 'fruit' && $('fruitSec')) { const s = $('sheet'); s.scrollTop = Math.max(0, $('fruitSec').offsetTop - 12); }
  }
  const AGO = [[0, 'Today'], [3, 'A few days ago'], [7, 'A week ago'], [14, 'Two weeks ago'], [30, 'A month or more']];
  function catchSheet() {
    const un = P.care.filter(c => careStatus(c).state === 'none');
    let h = '<div><div class="eyebrow">Care</div><h2 id="sheetTitle">When did you last…</h2><p class="small" style="margin:4px 0 0">Rough is fine: the app only needs a starting point. You can fix any date later on the Care tab.</p></div>';
    h += un.length ? '<div class="stack">' + un.map(c => '<div class="card"><h4>' + esc(c.title) + '</h4><div class="small muted">' + esc(c.where) + ' · every ' + everyText(c.every) + '</div><div class="dome" style="margin-top:8px">' + AGO.map(([d, l]) => '<button data-act="catchSet" data-id="' + c.id + '" data-d="' + d + '">' + l + '</button>').join('') + '</div></div>').join('') + '</div>' : '<div class="card"><b>All caught up.</b><p class="small">Every job has a date now.</p></div>';
    showSheet(h, { kind: 'catch' });
  }
  function copyLink(slot) {
    const url = SITE + '#seat-' + slot;
    const shown = () => toast(url.replace('https://', ''));
    try { navigator.clipboard.writeText(url).then(() => toast('Link copied: #seat-' + slot), shown); } catch (e) { shown(); }
  }
  function openSeat(slot) {
    UI.tower = slot[0]; UI.mode = 'now'; saveUI(); showView('towers');
    const cell = layout(slot[0], 'now')[slot]; if (!cell) return;
    if (cell.pods.length) openPod(cell.pods[0].id); else seatSheet(slot);
  }

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
    if (MU.open && MU.open !== 'box') { MU.open = null; MU.busy = false; }
    setTimeout(() => { if (!SHEET) { s.hidden = true; b.hidden = true; $('sheetIn').innerHTML = ''; phFree(); } }, 230);
    $('lightbox').hidden = true;
    if (!fromPop && history.state && history.state.sheet) { try { history.back(); } catch (e) {} }
  }
  function refreshSheet() {
    if (!SHEET) return; const top = $('sheet').scrollTop;
    if (SHEET.kind === 'plant') plantSheet(SHEET.pid, SHEET.podId);
    else if (SHEET.kind === 'stop') stopSheet(SHEET.id);
    else if (SHEET.kind === 'pick') pickSheet();
    else if (SHEET.kind === 'catch') catchSheet();
    else if (SHEET.kind === 'doctor') doctorSheet(SHEET.id);
    else if (SHEET.kind === 'seat') seatSheet(SHEET.slot);
    else if (SHEET.kind === 'forb') forbSheet(SHEET.id);
    $('sheet').scrollTop = top;
  }

  /* ----- Toast ----- */
  let toastT; function toast(msg, ms) { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), ms || 2000); }

  /* ----- Views ----- */
  const VIEWS = ['towers', 'plants', 'salad', 'care', 'ideas', 'diy', 'forbidden'];
  function showView(v, anchor) {
    if (!VIEWS.includes(v)) v = 'towers';
    VIEWS.forEach(k => { $('view-' + k).hidden = (k !== v); });
    const tabV = v === 'forbidden' ? 'ideas' : v;
    document.querySelectorAll('.tab').forEach(t => t.setAttribute('aria-selected', t.dataset.view === tabV ? 'true' : 'false'));
    if (v === 'forbidden') renderForbidden();
    if (v === 'plants') renderPlants();
    if (v === 'care') renderCare();
    if (v === 'ideas') renderIdeas();
    if (v === 'diy') renderDIY();
    if (v === 'salad') renderSalad();
    if (v === 'towers') { renderToday(); renderTip(); renderTower(); }
    if (location.hash !== '#' + v) { try { history.replaceState(history.state, '', '#' + v); } catch (e) {} }
    const el = anchor ? $(anchor) : null;
    if (el) { const top = el.getBoundingClientRect().top + window.scrollY - 70; window.scrollTo({ top: Math.max(0, top), behavior: 'auto' }); }
    else window.scrollTo({ top: 0, behavior: 'auto' });
  }
  function renderAll() { renderToday(); renderTower(); if (!$('view-care').hidden) renderCare(); if (!$('view-plants').hidden) renderPlants(); }

  /* ----- Boxes: preview copy, install, news ----- */
  const SITE = 'https://hectrvictorious.github.io/Gardyn-Plant-Book/';
  const standalone = () => window.matchMedia && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);
  let deferredInstall = null;
  function setupBoxes() {
    if (!window.__STANDALONE_SITE__) {
      $('movedBox').innerHTML = '<b>This is the preview copy</b><div class="small">The phone app lives at <a href="' + SITE + '" target="_blank" rel="noopener">hectrvictorious.github.io/Gardyn-Plant-Book</a>. Open it on your phone and add it to your home screen. Ticks and notes saved here stay in this browser.</div>';
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
    const st = bkState(), due = bkLevel(st) || (!LASTBK && st.dirty ? 'never' : null);   // the update note is the moment to make the first backup
    box.innerHTML = '<b>New in the Plant Book</b><div class="small">' + NEWS + (due ? (LASTBK ? ' And a backup is due.' : ' Nothing here is backed up yet, so that’s the place to start.') : '') + '</div><div class="btnrow">' + (due ? '<button class="btn small primary" data-act="bkNow">Back up now</button>' : '') + '<button class="btn small' + (due ? ' ghost' : '') + '" data-act="newsOk">Got it</button></div>';
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

  /* ----- Backup: one file with everything, photos included, sent wherever the share sheet goes ----- */
  const BK = { photos: null, gen: 0, packing: null, pending: null, cardPending: null, persist: null, parsed: null, busy: false };
  let LASTBK = store.get('lastBackup', null);
  const isSite = () => !!window.__STANDALONE_SITE__;
  function snapshot() { const data = {}; KEYS.forEach(k => { data[k] = store.get(k, null); }); return data; }
  function hasData() { for (const k of TRACKED) { const v = store.get(k, null); if (v && (typeof v !== 'object' || Object.keys(v).length)) return true; } return false; }
  function earliestDate() { const t = todayISO(), d = snapshot(); delete d.care; const m = JSON.stringify(d).match(/20\d\d-[01]\d-[0-3]\d/g) || []; return m.filter(x => x <= t).sort()[0] || t; }   // care dates can be backdated, so they don't count
  function bkState() {
    const dirty = store.get('dirty', null), since = LASTBK ? LASTBK.d : dirty ? dirty.since : null;
    return { dirty: !!(dirty && dirty.n), age: since ? dayNum(todayISO()) - dayNum(since) : 0, since, unsaved: dirty ? dirty.since : null };
  }
  function bkLevel(s) {
    if (!s.dirty) return null;
    if (s.age >= 14) return 'firm';
    if (!LASTBK) return s.age >= 1 ? 'never' : null;
    return s.age >= 7 ? 'soft' : null;
  }
  const fmtWhen = iso => { const d = new Date(iso); if (isNaN(d)) return ''; const h = d.getHours(), mm = String(d.getMinutes()).padStart(2, '0'); return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + ((h % 12) || 12) + ':' + mm + (h < 12 ? ' am' : ' pm'); };
  const sizeStr = b => b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
  function blobToB64(b) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1] || ''); r.onerror = () => rej(r.error); r.readAsDataURL(b); }); }
  function b64ToBlob(s, type) { const bin = atob(s), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new Blob([u], { type: type || 'image/jpeg' }); }
  const phPut = rec => phDB().then(d => new Promise((res, rej) => { const tx = d.transaction('photos', 'readwrite'); let id; const rq = tx.objectStore('photos').add(rec); rq.onsuccess = () => { id = rq.result; }; tx.oncomplete = () => res(id); tx.onerror = () => rej(tx.error); }));
  /* Photos are packed ahead of time, so a tap on Back up goes straight to the share sheet. */
  function packPhotos() {
    if (!PH.ok) return Promise.resolve([]);
    if (BK.photos) return Promise.resolve(BK.photos);
    if (BK.packing) return BK.packing;
    const gen = BK.gen;
    BK.packing = phAll().then(async all => { const out = []; for (const x of all) { try { out.push({ pid: x.pid, d: x.d, t: x.t, type: x.blob.type || 'image/jpeg', b64: await blobToB64(x.blob) }); } catch (e) {} } if (gen === BK.gen) BK.photos = out; return out; }).catch(() => []).then(r => { BK.packing = null; return r; });
    return BK.packing;
  }
  function download(file) { const u = URL.createObjectURL(file), a = document.createElement('a'); a.href = u; a.download = file.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 5000); }
  function copyText(t, ok, fail) { const f = fail || (() => toast('Couldn’t copy it here.')); try { navigator.clipboard.writeText(t).then(ok, f); } catch (e) { f(); } }
  function markBacked(meta) {
    LASTBK = { at: meta.at || new Date().toISOString(), d: meta.d || todayISO(), how: meta.how, photos: meta.photos, bytes: meta.bytes };
    store.raw('lastBackup', LASTBK); store.raw('dirty', null); store.raw('bkSnooze', null);
    renderBackupNote(); renderNews(); if (!$('view-care').hidden) renderData();
  }
  async function backupNow() {
    if (BK.busy) return;
    if (!isSite()) return bkCopy();
    if (BK.pending && Date.now() - BK.pending.t < 120000) { const p = BK.pending; BK.pending = null; return sendBackup(p.file, p.meta); }
    BK.busy = true;
    try {
      if (!BK.photos && PH.ok) toast('Packing the photos…');
      const photos = await packPhotos();
      const o = { app: 'plant-book', v: 2, at: new Date().toISOString(), d: todayISO(), version: APP_VERSION, data: snapshot(), photos };
      const file = new File([JSON.stringify(o)], 'Plant Book backup ' + todayISO() + '.txt', { type: 'text/plain' });
      await sendBackup(file, { at: o.at, d: o.d, photos: photos.length, bytes: file.size });
    } catch (e) { toast('The backup couldn’t be made. Try Copy as text, under Other ways.'); }
    finally { BK.busy = false; }
  }
  async function sendBackup(file, meta) {
    let can = false; try { can = !!(navigator.canShare && navigator.share && navigator.canShare({ files: [file] })); } catch (e) {}
    if (can) {
      try { await navigator.share({ files: [file], title: 'Plant Book backup' }); markBacked(Object.assign({ how: 'share' }, meta)); toast('Backed up.'); return; }
      catch (e) {
        if (e && e.name === 'AbortError') { toast('Closed without sending it anywhere.'); return; }
        if (e && e.name === 'NotAllowedError') { BK.pending = { file, meta, t: Date.now() }; toast('Ready. Tap Back up now once more to send it.'); return; }
      }
    }
    download(file); markBacked(Object.assign({ how: 'download' }, meta)); toast('Saved to Downloads. Send it to Drive or your email to keep it off the phone.');
  }
  function bkCopy() {
    const o = { app: 'plant-book', v: 2, at: new Date().toISOString(), d: todayISO(), version: APP_VERSION, data: snapshot(), photos: [] }, txt = JSON.stringify(o);
    copyText(txt, () => { markBacked({ at: o.at, d: o.d, how: 'copy', photos: 0, bytes: txt.length }); toast('Copied, without photos. Paste it somewhere safe.'); }, () => { const b = $('pasteBox'); if (b) { b.hidden = false; $('restoreText').value = txt; $('restoreText').select(); toast('Selected. Copy it from the box.'); } });
  }
  function parseBackup(txt) {
    const s = String(txt || ''), a = s.indexOf('{'), b = s.lastIndexOf('}'); if (a < 0 || b <= a) return null;
    let o; try { o = JSON.parse(s.slice(a, b + 1)); } catch (e) { return null; }
    if (!o || o.app !== 'plant-book' || !o.data || typeof o.data !== 'object') return null;
    o.photos = Array.isArray(o.photos) ? o.photos.filter(x => x && x.b64 && x.pid) : []; if (!o.at) o.at = new Date().toISOString(); if (!o.d) o.d = String(o.at).slice(0, 10);
    return o;
  }
  function bkSummary(o) {
    const d = o.data, n = x => x ? (Array.isArray(x) ? x.length : Object.keys(x).length) : 0;
    const notes = d.notes ? Object.values(d.notes).reduce((s, l) => s + ((l || []).length || 0), 0) : 0;
    const parts = [[n(d.care), 'care date', 'care dates'], [n(d.done), 'step done', 'steps done'], [notes, 'note', 'notes'], [n(d.harv) || n(d.pick), 'picking', 'pickings'], [n(d.flow), 'day of flowers', 'days of flowers'], [n(d.ate), 'bowl eaten', 'bowls eaten'], [n(d.prints), 'print', 'prints'], [n(d.seeds), 'seed entry', 'seed entries'], [o.photos.length, 'photo', 'photos']];
    return parts.filter(p => p[0]).map(p => plural(p[0], p[1], p[2])).join(', ') || 'Nothing logged in it.';
  }
  function offerRestore(txt) {
    const o = parseBackup(txt);
    if (!o) { toast('That isn’t a Plant Book backup. It needs the whole file or the whole text.'); return; }
    BK.parsed = o; showView('care', 'dataSec'); renderData();
  }
  function loadAll() {
    DONE = store.get('done', {}); CARE = store.get('care', {}); CAMP = store.get('camp', {}); NOTES = store.get('notes', {}); TRAIL = store.get('trail', {});
    PICK = store.get('pick', {}); VERD = store.get('verdict', {}); SCOUT = store.get('scout', {}); ATE = store.get('ate', []);
    Object.assign(FOOT, { towers: 2, kwh: P.greener.kwh, rate: P.greener.rate }, store.get('foot', {}));
    PRINTS = store.get('prints', []); Object.assign(PSET, { w: 75, kg: 20, yc: 5.99, plug: 0.21, casing: 4, wool: 4 }, store.get('printer', {}));
    { const pz = store.get('podseats', {}); PODS.seats = pz.seats || {}; PODS.past = pz.past || 0; }
    Object.assign(FGS, { best: null, plays: 0 }, store.get('fgame', {}));
    BOWL.splice(0, BOWL.length, ...store.get('bowl', []).filter(id => P.plants[id])); SAVED.splice(0, SAVED.length, ...store.get('bowls', [])); MGSEL.splice(0, MGSEL.length, ...store.get('mgsel', []));
    HARV = store.get('harv', []); HAMT = store.get('hamt', {}); FLOW = store.get('flow', []); SEEDS = store.get('seeds', []);
    priceDefaults(); Object.assign(PRICE, store.get('hprice', {}));
    Object.assign(UI, store.get('ui', {}));
    if ($('psW')) fillSet(); if ($('fTow')) { $('fTow').value = FOOT.towers; $('fKwh').value = FOOT.kwh; $('fRate').value = FOOT.rate; } fillPrices();
  }
  async function doRestore() {
    const o = BK.parsed; if (!o) return;
    const before = { at: new Date().toISOString(), data: snapshot(), last: LASTBK, added: [] };
    KEYS.forEach(k => { if (o.data[k] != null) store.set(k, o.data[k]); });
    loadAll();
    if (PH.ok && o.photos.length) {
      try {
        const have = new Set((await phAll()).map(x => x.pid + '|' + x.t));
        for (const x of o.photos) { if (have.has(x.pid + '|' + x.t)) continue; try { before.added.push(await phPut({ pid: x.pid, d: x.d || todayISO(), t: x.t || Date.now(), blob: b64ToBlob(x.b64, x.type) })); } catch (e) {} }
        BK.photos = null; BK.gen++;
      } catch (e) {}
    }
    store.raw('preRestore', before);
    LASTBK = { at: o.at, d: o.d, how: 'restored', photos: o.photos.length }; store.raw('lastBackup', LASTBK); store.raw('dirty', null);
    BK.parsed = null;
    renderAll(); renderCare(); renderData();
    toast('Restored' + (before.added.length ? ', with ' + plural(before.added.length, 'photo', 'photos') : '') + '.');
  }
  async function undoRestore() {
    const b = store.get('preRestore', null); if (!b || !b.data) return;
    KEYS.forEach(k => { const v = b.data[k]; if (v == null) store.raw(k, null); else store.set(k, v); });
    for (const id of (b.added || [])) { try { await phDel(id); } catch (e) {} }
    LASTBK = b.last || null; store.raw('lastBackup', LASTBK); store.raw('preRestore', null); touched();
    loadAll(); renderAll(); renderCare(); renderData(); toast('Undone: everything is as it was before the restore.');
  }
  function renderData() {
    const el = $('dataCard'); if (!el) return;
    const s = bkState(), lv = bkLevel(s), pre = store.get('preRestore', null);
    if (isSite() && PH.ok && !BK.photos) packPhotos();
    const when = !LASTBK ? '' : s.age <= 0 ? 'today' : s.age === 1 ? 'yesterday' : s.age + ' days ago';
    const how = LASTBK ? { share: 'sent from the share sheet', download: 'saved to Downloads', copy: 'copied as text, no photos', restored: 'restored on this phone' }[LASTBK.how] || '' : '';
    const meta = LASTBK ? [fmtWhen(LASTBK.at), how, LASTBK.photos ? plural(LASTBK.photos, 'photo', 'photos') : '', LASTBK.bytes ? sizeStr(LASTBK.bytes) : ''].filter(Boolean).join(' · ') + '. ' + (s.dirty ? 'You’ve logged more since.' : 'Nothing new since.') : 'Everything you’ve logged' + (s.unsaved ? ' since ' + fmtDate(s.unsaved) : '') + ' lives only on this phone.';
    let h = '<div class="bk-stat ' + (lv === 'firm' ? 'firm' : lv || !LASTBK ? 'soft' : 'ok') + '"><span class="bk-dot" aria-hidden="true"></span><div><b>' + (LASTBK ? 'Last backup ' + when : 'Not backed up yet') + '</b><div class="small">' + esc(meta) + '</div></div></div>';
    if (BK.parsed) {
      const o = BK.parsed;
      h += '<div class="restore-q"><b>Restore the backup from ' + esc(fmtWhen(o.at) || fmtDate(o.d)) + '?</b><p class="small">It holds ' + esc(bkSummary(o)) + '.</p><p class="small">What’s on this phone now is replaced by what’s in the backup; photos in it are added to the ones here. You can undo it afterward.</p><div class="btnrow"><button class="btn small primary" data-act="bkRestoreGo">Restore it</button><button class="btn small ghost" data-act="bkRestoreNo">Cancel</button></div></div>';
    } else {
      h += '<p class="small" style="margin:0">One file holds everything: ticks, dates, notes, harvests, bowls, prints and photos. Send it to Drive or your email; on a new phone, restore it here. Back up before uninstalling the app or clearing Chrome’s data: either can take everything here with it.</p>';
      h += '<div class="btnrow"><button class="btn small primary" data-act="bkNow">Back up now</button><label class="btn small ghost">Restore from a file<input type="file" accept=".txt,.json,text/plain,application/json" data-restore hidden></label></div>';
    }
    if (pre && pre.at && Date.now() - new Date(pre.at).getTime() < 7 * 86400000 && !BK.parsed) h += '<div class="undo-r"><span class="small">Restored a backup ' + esc(fmtWhen(pre.at)) + '.</span><button class="btn small ghost" data-act="bkUndo">Undo the restore</button></div>';
    if (BK.persist != null) h += '<p class="small muted" style="margin:0">' + (BK.persist ? 'Storage is marked to keep: Chrome won’t clear it on its own to make room.' : 'Chrome could clear this storage if the phone runs short of space. Installing the app usually protects it; a backup covers it either way.') + '</p>';
    h += '<details class="pset"><summary>Other ways</summary><div class="stack"><p class="small" style="margin:0">As text, without the photos: copy it into a note or an email, and paste it back here.</p><div class="btnrow"><button class="btn small" data-act="bkCopy">Copy as text</button><button class="btn small ghost" data-act="bkPaste">Paste a backup</button></div><div id="pasteBox" class="stack" hidden><textarea id="restoreText" class="search" rows="3" aria-label="Paste a backup"></textarea><div class="btnrow"><button class="btn small primary" data-act="bkPasteGo">Check it</button></div></div></div></details>';
    el.innerHTML = h;
  }
  function renderBackupNote() {
    const box = $('bkBox'); if (!box) return;
    const s = bkState(), lv = bkLevel(s), sn = store.get('bkSnooze', null);
    if (!lv || (sn && sn > todayISO()) || !$('newsBox').hidden) { box.hidden = true; return; }
    if (isSite() && PH.ok && !BK.photos) packPhotos();
    const since = fmtDate(s.unsaved || s.since);
    const T = {
      never: ['Nothing here is backed up yet', 'Everything you’ve logged since ' + since + ' lives only on this phone. One tap sends a copy to Drive or your email, photos and all.'],
      soft: ['Last backup: ' + s.age + ' days ago', 'You’ve logged more since. A fresh copy takes one tap.'],
      firm: [LASTBK ? 'It’s been ' + s.age + ' days since a backup' : 'Two weeks, and still no backup', 'Everything since ' + since + ' lives only on this phone. If it’s lost or reset, that goes with it.']
    }[lv];
    box.className = 'note bk ' + lv;
    box.innerHTML = '<div><b>' + esc(T[0]) + '</b><div class="small">' + esc(T[1]) + '</div></div><div class="btnrow"><button class="btn small primary" data-act="bkNow">Back up now</button><button class="btn small ghost" data-act="bkLater">Later</button></div>';
    box.hidden = false;
  }
  function askPersist() {
    try {
      if (!isSite() || !navigator.storage || !navigator.storage.persisted) return;
      navigator.storage.persisted().then(p => p || !navigator.storage.persist ? p : navigator.storage.persist()).then(p => { BK.persist = !!p; if (!$('view-care').hidden) renderData(); }).catch(() => {});
    } catch (e) {}
  }

  /* ----- Tonight's picture: the bowl and what's ready, drawn for sending ----- */
  const CARD = { paper: '#fbfcfa', band: '#1b3929', bandInk: '#f1f6f0', ink: '#142019', ink2: '#3c4d42', muted: '#66786d', line: '#cdd8cd', tile: '#e3e9e1', accent: '#a3205a', pink: '#ff8fbb' };
  const GLC = { ink: '#22352a', seed: '#f7ecb8', leaf: '#5d9c4c', lime: '#a2c64a', beet: '#8d2352', red: '#d23c3c', yellow: '#efb926', pink: '#de6aa0', blue: '#5370d4', orange: '#ea7a24', gold: '#d6a42a', cocoa: '#6f4532', sage: '#8ea888', purple: '#7a4aa4', husk: '#d4b26a', bronze: '#9b5b3b', tile: '#e3e9e1' };
  function glyphURL(kind, tint) {
    const tc = GLC[{ sorrel: 'leaf', speckle: 'leaf' }[tint] || tint] || GLC.leaf, ink = GLC.ink, vein = tint === 'sorrel' ? GLC.beet : ink;
    const S = { f: 'fill="' + tc + '" stroke="' + ink + '" stroke-width="1.3" stroke-linejoin="round"', f2: 'fill="' + GLC.leaf + '" stroke="' + ink + '" stroke-width="1.3" stroke-linejoin="round"', s: 'fill="none" stroke="' + ink + '" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"', v: 'fill="none" stroke="' + vein + '" stroke-width="1.5" stroke-linecap="round"', k: 'fill="none" stroke="' + tc + '" stroke-width="2.6" stroke-linecap="round"', kf: 'fill="none" stroke="' + tc + '" stroke-width="1.7" stroke-linecap="round"', kr: 'fill="none" stroke="' + GLC.beet + '" stroke-width="1.8" stroke-linecap="round"', k2: 'fill="none" stroke="' + GLC.lime + '" stroke-width="2" stroke-linecap="round"', s0: 'fill="' + ink + '"', s0b: 'fill="' + GLC.cocoa + '" stroke="' + ink + '" stroke-width="1.2"', seed: 'fill="' + GLC.seed + '"', dots: 'fill="' + GLC.beet + '"', fw: 'fill="#ffffff" stroke="' + ink + '" stroke-width="1"', cap1: 'fill="' + GLC.tile + '" stroke="' + ink + '" stroke-width="1.3"', cap2: 'fill="none" stroke="' + ink + '" stroke-width="1.3" stroke-linecap="round" opacity=".55"' };
    const body = ((G[kind] || G.leaf) + (tint === 'speckle' ? SPECKLE : '')).replace(/class="([a-z0-9]+)"/g, (m, c) => S[c] || '');
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 34 34" width="136" height="136">' + body + '</svg>');
  }
  const loadImg = src => new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = src; });
  function wrapText(g, text, x, y, maxW, lh, maxLines) {
    const words = String(text).split(/\s+/); let line = '', lines = [];
    words.forEach(w => { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; });
    if (line) lines.push(line);
    if (maxLines && lines.length > maxLines) { lines = lines.slice(0, maxLines); let l = lines[maxLines - 1]; while (l && g.measureText(l + '…').width > maxW) l = l.slice(0, -1); lines[maxLines - 1] = l.replace(/[\s,;:.]+$/, '') + '…'; }
    lines.forEach((l, i) => g.fillText(l, x, y + i * lh));
    return y + lines.length * lh;
  }
  const listWords = a => a.length <= 1 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  function cardFacts() {
    const today = todayISO(), bowl = BOWL.filter(id => P.plants[id]);
    const picked = [...new Set(HARV.filter(h => h.d === today).map(h => h.p))].filter(id => P.plants[id]);
    const due = [...new Set(pickList().filter(x => x.due && x.last).map(x => x.p.p))];
    const fruitToday = {}; HARV.forEach(h => { if (h.d === today && h.k === 'fruit') fruitToday[h.p] = (fruitToday[h.p] || 0) + h.n; });
    const leafOz = HAMT[today] != null ? HAMT[today] : dayEst(today) * leafCal().f;
    const got = (leafOz > 0 ? ['about ' + ozStr(leafOz) + ' of greens'] : []).concat(Object.keys(fruitToday).map(pid => fruitToday[pid] + ' ' + fw(pid, fruitToday[pid])));
    const ym = today.slice(0, 7);
    return { bowl, picked, due, got, ripe: ripeNow(), t: tally(ym + '-01', today), bowls: bowlsThisMonth(), month: MONTHS_LONG[+ym.slice(5) - 1] };
  }
  function cardText() {
    const f = cardFacts(), out = [];
    if (f.bowl.length) { const d = dressingFor(bowlTotals()); out.push('Tonight’s bowl from the towers: ' + listWords(f.bowl.map(id => P.plants[id].name)) + '. Dressing: ' + d.name.toLowerCase() + '.'); }
    if (f.got.length) out.push('Picked today: ' + listWords(f.got) + '.');
    if (f.due.length) out.push('Ready to pick: ' + listWords(f.due.map(id => P.plants[id].name)) + '.');
    if (f.ripe.length) out.push('Should be ripe: ' + listWords(f.ripe.map(m => m.now.length + ' ' + fw(m.pid, m.now.length))) + '.');
    return out.join(' ') || 'From the towers on Swan’s Island: everything’s picked for now.';
  }
  async function makeCard() {
    const W = 1080, H0 = 1700, c = document.createElement('canvas'); c.width = W; c.height = H0; const g = c.getContext('2d');
    const FD = '"Barlow Semi Condensed", "Arial Narrow", Arial, sans-serif', FB = 'Literata, Georgia, serif';
    try { await Promise.race([Promise.all(['700 54px "Barlow Semi Condensed"', '600 30px "Barlow Semi Condensed"', '600 74px Literata', 'italic 400 34px Literata', '400 38px Literata'].map(x => document.fonts.load(x))), new Promise(r => setTimeout(r, 1200))]); } catch (e) {}
    const f = cardFacts(), now = new Date();
    const mode = f.bowl.length ? 'bowl' : f.picked.length ? 'picked' : 'due';
    const tiles = (mode === 'bowl' ? f.bowl : mode === 'picked' ? f.picked : f.due).slice(0, 8);
    const imgs = await Promise.all(tiles.map(id => loadImg(glyphURL(P.plants[id].glyph, P.plants[id].tint)).catch(() => null)));
    const track = px => { try { g.letterSpacing = px; } catch (e) {} };
    g.fillStyle = CARD.paper; g.fillRect(0, 0, W, H0);
    g.fillStyle = CARD.band; g.fillRect(0, 0, W, 214);
    g.fillStyle = CARD.pink; g.fillRect(80, 186, 56, 6);
    g.fillStyle = CARD.bandInk; g.globalAlpha = 0.78; g.font = '600 28px ' + FD; track('5px'); g.fillText('PLANT BOOK · SWAN’S ISLAND', 80, 84); track('0px'); g.globalAlpha = 1;
    g.font = '700 56px ' + FD; g.fillText(DAYS[now.getDay()] + ', ' + MONTHS_LONG[now.getMonth()] + ' ' + now.getDate(), 80, 152);
    g.fillStyle = CARD.ink; g.font = '600 74px ' + FB; g.fillText('Tonight from the towers', 80, 318);
    let y = 396;
    const eyebrow = txt => { g.fillStyle = CARD.muted; g.font = '600 28px ' + FD; track('4px'); g.fillText(txt.toUpperCase(), 80, y); track('0px'); y += 26; };
    const rule = () => { g.fillStyle = CARD.line; g.fillRect(80, y - 4, W - 160, 2); y += 50; };
    const para = (txt, lines) => { g.fillStyle = CARD.ink; g.font = '400 38px ' + FB; y = wrapText(g, txt, 80, y + 26, 920, 52, lines) + 30; };
    if (tiles.length) {
      eyebrow({ bowl: 'In the bowl', picked: 'Picked today', due: 'Ready to pick' }[mode]);
      const cols = 4, tw = 232, th = 206;
      tiles.forEach((id, i) => {
        const x = 80 + (i % cols) * tw, ty = y + Math.floor(i / cols) * th;
        g.fillStyle = CARD.tile; g.beginPath(); if (g.roundRect) g.roundRect(x, ty, 204, 132, 28); else g.rect(x, ty, 204, 132); g.fill();
        if (imgs[i]) g.drawImage(imgs[i], x + 102 - 50, ty + 66 - 50, 100, 100);
        g.fillStyle = CARD.ink; const nm = P.plants[id].name; let fs = 31; g.font = '600 31px ' + FD; while (fs > 24 && g.measureText(nm).width > 210) { fs -= 2; g.font = '600 ' + fs + 'px ' + FD; } wrapText(g, nm, x + 2, ty + 172, 210, 32, 1);
      });
      y += Math.ceil(tiles.length / cols) * th + 12;
      const extra = { bowl: f.bowl, picked: f.picked, due: f.due }[mode].length - tiles.length;
      if (extra > 0) { g.fillStyle = CARD.muted; g.font = '600 30px ' + FD; g.fillText('and ' + extra + ' more', 80, y + 4); y += 44; }
    }
    if (mode === 'bowl') { const d = dressingFor(bowlTotals()); g.fillStyle = CARD.ink2; g.font = 'italic 400 34px ' + FB; y = wrapText(g, 'Dressing: ' + d.name.toLowerCase() + '. ' + d.how, 80, y + 24, 920, 46, 3) + 34; }
    if (mode === 'picked' && f.got.length) { g.fillStyle = CARD.ink2; g.font = 'italic 400 34px ' + FB; y = wrapText(g, listWords(f.got).replace(/^./, x => x.toUpperCase()) + '.', 80, y + 24, 920, 46, 2) + 34; }
    const sections = [];
    if (mode === 'bowl' && f.got.length) sections.push(['Picked today', listWords(f.got) + '.', 2]);
    if (mode !== 'due' && f.due.length) sections.push(['Ready to pick', listWords(f.due.map(id => P.plants[id].name)) + '.', 3]);
    if (f.ripe.length) sections.push(['Should be ripe', listWords(f.ripe.map(m => m.now.length + ' ' + fw(m.pid, m.now.length))) + ', by the flowers logged.', 2]);
    sections.forEach(([k, txt, n], i) => { if (i === 0 && tiles.length) rule(); eyebrow(k); para(txt.replace(/^./, x => x.toUpperCase()), n); });
    if (!tiles.length && !sections.length) { g.fillStyle = CARD.ink2; g.font = 'italic 400 38px ' + FB; y = wrapText(g, 'Everything’s picked for now. The towers are catching up.', 80, y + 20, 920, 52, 2) + 20; }
    const H = Math.max(760, Math.min(H0, Math.round(y + 170)));
    g.fillStyle = CARD.line; g.fillRect(80, H - 140, W - 160, 2);
    g.fillStyle = CARD.ink2; g.font = '600 32px ' + FD;
    const foot = [f.bowls ? plural(f.bowls, 'bowl', 'bowls') + ' from the towers' : '', f.t.total >= 1 ? 'about ' + usd(f.t.total) + ' of groceries' : ''].filter(Boolean);
    wrapText(g, f.month + (foot.length ? ': ' + foot.join(', ') + '.' : ' on Swan’s Island.'), 80, H - 76, 920, 40, 1);
    const out = document.createElement('canvas'); out.width = W; out.height = H; out.getContext('2d').drawImage(c, 0, 0);
    return out;
  }
  async function shareCard() {
    if (BK.cardBusy) return;
    if (!isSite()) { const t = cardText(); copyText(t, () => toast('Copied tonight’s rundown. Paste it anywhere.'), () => toast(t)); return; }
    if (BK.cardPending && Date.now() - BK.cardPending.t < 120000) { const f = BK.cardPending.file; BK.cardPending = null; return sendCard(f); }
    BK.cardBusy = true;
    try {
      const c = await makeCard(), blob = await new Promise(r => c.toBlob(r, 'image/png'));
      if (!blob) throw new Error('no image');
      await sendCard(new File([blob], 'Tonight from the towers.png', { type: 'image/png' }));
    } catch (e) { const t = cardText(); copyText(t, () => toast('Copied tonight’s rundown instead.'), () => toast(t)); }
    finally { BK.cardBusy = false; }
  }
  async function sendCard(file) {
    let can = false; try { can = !!(navigator.canShare && navigator.share && navigator.canShare({ files: [file] })); } catch (e) {}
    if (can) {
      try { await navigator.share({ files: [file], title: 'Tonight from the towers' }); return; }
      catch (e) { if (e && e.name === 'AbortError') return; if (e && e.name === 'NotAllowedError') { BK.cardPending = { file, t: Date.now() }; toast('Ready. Tap Share once more to send it.'); return; } }
    }
    download(file); toast('Saved the picture to Downloads.');
  }

  /* ----- How a plant gives: Josh grows for perpetual harvests ----- */
  function givesOf(pid) {
    const pl = P.plants[pid], G = HV.gives; if (!pl) return null;
    if (pl.status === 'micro') return { k: 'quick', note: HV.givesGroup.micro };
    if (pid in G.keeps) return { k: 'keeps', note: G.keeps[pid] || HV.givesGroup[pl.group] || '' };
    const x = G.while[pid] || G.once[pid]; if (!x) return null;
    return { k: G.while[pid] ? 'while' : 'once', note: x[0], earns: x[1], short: x[2] };
  }
  const givesPill = g => g ? '<span class="gv gv-' + g.k + '">' + HV.givesWord[g.k] + '</span>' : '';
  function givesBlock(pid) {
    const g = givesOf(pid); if (!g) return '';
    return '<div class="gives">' + givesPill(g) + '<p class="small">' + esc(g.note) + (g.earns ? ' <b>Earns its seat:</b> ' + esc(g.earns) : g.k === 'once' ? ' By your rule, better bought, unless it earns a seat another way.' : '') + '</p></div>';
  }
  function renderGiveRule() {
    const el = $('giveRule'); if (!el) return;
    const ex = Object.keys(P.plants).filter(id => P.plants[id].status === 'tower').map(id => [id, givesOf(id)]).filter(([, g]) => g && g.k !== 'keeps');
    el.innerHTML = '<b>' + esc(HV.rule.title) + '</b><p class="small">' + esc(HV.rule.text) + '</p>' +
      '<p class="small"><b>On the towers now,</b> ' + (ex.length ? 'everything keeps giving except ' + esc(listWords(ex.map(([id, g]) => { const n = P.pods.filter(x => x.p === id && parse(cur(x))).length, nm = n > 1 && HV.fruitWord[id] ? fw(id, 2) : P.plants[id].name.toLowerCase(); return 'the ' + nm + (g.short ? ' (' + g.short + ')' : ''); }))) + '.' : 'everything keeps giving.') + '</p>' +
      '<p class="small muted">' + esc(HV.rule.micro) + '</p>';
  }

  /* ----- The seed box: yCubes, seed pads and packets on hand ----- */
  let SEEDS = store.get('seeds', []);
  const saveSeeds = () => store.set('seeds', SEEDS);
  const KEEP = {}; Object.keys(HV.keep).forEach(k => HV.keep[k].ids.forEach(id => { KEEP[id] = HV.keep[k]; }));
  const cubeWord = pid => P.plants[pid].status === 'micro' ? ['seed pad', 'seed pads'] : ['yCube', 'yCubes'];
  const hasCubes = pid => !P.plants[pid].notGardyn;
  const seedsOf = pid => SEEDS.filter(s => s.p === pid);
  const cubeOf = pid => SEEDS.find(s => s.p === pid && s.kind === 'cube');
  const seedOut = s => s.kind === 'cube' ? !(s.n > 0) : s.st === 'out';
  const seedLow = s => s.kind === 'cube' ? !(s.n > 1) : s.st !== 'ok';
  const seedOld = s => { const k = KEEP[s.p]; return s.kind === 'pack' && k && s.yr && (+todayISO().slice(0, 4) - s.yr) >= k.yrs; };
  function seedLine(s) {   // HTML: the warnings stand out, not the whole line
    const flag = t => ' · <span class="nudge">' + t + '</span>';
    if (s.kind === 'cube') { const w = cubeWord(s.p); return esc(plural(s.n || 0, w[0], w[1])) + (s.n === 1 ? flag('the last one') : ''); }
    return 'Packet' + esc((s.src ? ', ' + s.src : '') + (s.yr ? ', packed for ' + s.yr : '')) + (s.st === 'low' ? flag('running low') : s.st === 'out' ? flag('out') : '') + (seedOld(s) ? flag('getting old') : '');
  }
  function seedBlock(pid) {
    const pl = P.plants[pid], c = cubeOf(pid), w = cubeWord(pid), packs = seedsOf(pid).filter(s => s.kind === 'pack');
    let h = '<div class="block seedblk" id="seedBlk"><h3>In the seed box</h3><div class="list sb">';
    if (hasCubes(pid)) h += '<div class="sb-row"><span><b>' + esc(/^y/.test(w[1]) ? w[1] : w[1].replace(/^./, x => x.toUpperCase())) + '</b><span class="small">' + (c && c.n > 1 ? 'on hand' : c && c.n === 1 ? 'the last one' : 'none on hand') + '</span></span>' + stepper('cube', pid, c ? c.n : 0, '', w[1] + ' on hand') + '</div>';
    packs.forEach(s => { h += '<div class="sb-row"><span><b>Seed packet</b><span class="small">' + esc([s.src, s.yr ? 'packed for ' + s.yr : ''].filter(Boolean).join(', ') || 'no details') + (seedOld(s) ? ' · <span class="nudge">getting old</span>' : '') + '</span></span><span class="btnrow"><span class="seg sm" role="group" aria-label="How much is left">' + [['ok', 'Plenty'], ['low', 'Low'], ['out', 'Out']].map(([k, l]) => '<button data-act="packSt" data-id="' + s.id + '" data-st="' + k + '" aria-pressed="' + (s.st === k) + '">' + l + '</button>').join('') + '</span><button class="btn small ghost" data-act="packDel" data-id="' + s.id + '">Remove</button></span></div>'; });
    h += '</div><div class="sb-add stack calc" id="packForm" hidden><div class="fields"><label for="pkSrc">From<input id="pkSrc" type="text" maxlength="40" placeholder="Baker Creek, saved seed, a friend" autocomplete="off"></label><label for="pkYr">Packed for<input id="pkYr" type="number" min="1990" max="2100" step="1" inputmode="numeric" value="' + todayISO().slice(0, 4) + '"></label></div><div class="btnrow"><button class="btn small primary" data-act="packAdd" data-pid="' + pid + '">Add the packet</button><button class="btn small ghost" data-act="packCancel">Cancel</button></div></div>';
    h += '<div class="btnrow">' + (MU.open === pid ? '' : museBtn(pid)) + '<button class="btn small ghost" data-act="packOpen">Add a seed packet</button></div>';
    if (MU.open === pid) h += musePanel(); else h += askNote(pid);
    if (KEEP[pid]) h += '<p class="small muted" style="margin:0">' + esc(KEEP[pid].say) + '</p>';
    return h + '</div>';
  }
  function seedBuyList() {
    const out = [], pids = [...new Set(SEEDS.map(s => s.p))].filter(id => P.plants[id]);
    pids.forEach(pid => { const es = seedsOf(pid); if (es.length && es.every(seedLow)) out.push([pid, es.every(seedOut) ? 'out' : 'running low']); });
    Object.keys(SCOUT).forEach(pid => { if (P.plants[pid] && !seedsOf(pid).some(s => !seedOut(s)) && !out.some(b => b[0] === pid)) out.push([pid, 'on your shortlist']); });
    return out;
  }
  function renderSeedBox() {
    const el = $('seedBox'); if (!el) return;
    const pids = [...new Set(SEEDS.filter(s => !seedOut(s)).map(s => s.p))].filter(id => P.plants[id]).sort((a, b) => P.plants[a].name.localeCompare(P.plants[b].name));
    const buy = seedBuyList();
    $('seedCount').textContent = pids.length ? pids.length + ' on hand' : '';
    const row = (pid, subHTML) => '<button class="prow" data-open="plant" data-pid="' + pid + '" data-seeds="1"><span class="gwrap">' + plantPic(pid) + '</span><span style="min-width:0"><span class="nm">' + esc(P.plants[pid].name) + '</span><span class="wh" style="display:block">' + subHTML + '</span></span></button>';
    let h = pids.length ? '<div class="stack">' + pids.map(pid => row(pid, seedsOf(pid).filter(s => !seedOut(s)).map(seedLine).join(' · '))).join('') + '</div>' : '<p class="small" style="margin:0">Nothing logged yet. Every plant’s page has a seed box: yCubes and seed pads by count, packets with where they came from and the year.</p>';
    if (buy.length) {
      const more = buy.length > BUYX.maxItems ? 'Muse gets the first ' + BUYX.maxItems + ' of these; ask for the rest after.' : '';
      h += '<div class="sb-buy"><h4>To buy</h4><div class="stack">' + buy.map(([pid, why]) => { const a = lastAsk(pid); return row(pid, (why === 'on your shortlist' ? esc(why) : '<span class="nudge">' + esc(why) + '</span>') + (a ? ' · ' + esc(askWord(a)) : '')); }).join('') + '</div>' +
        (MU.open === 'box' ? musePanel(more) : '<div class="btnrow"><button class="btn small" data-act="museBox">Ask Muse for these</button><button class="btn small ghost" data-act="seedShare">Share the list</button></div>') + '</div>';
    }
    const opts = Object.keys(P.plants).filter(id => ['tower', 'micro', 'idea', 'dome', 'planned'].includes(P.plants[id].status)).sort((a, b) => P.plants[a].name.localeCompare(P.plants[b].name));
    h += '<label class="last sb-pick">Add seeds for <select id="sbPick"><option value="">a plant…</option>' + opts.map(id => '<option value="' + id + '">' + esc(P.plants[id].name) + '</option>').join('') + '</select></label>';
    el.innerHTML = h;
  }
  function seedShare() {
    const buy = seedBuyList(); if (!buy.length) return;
    const text = 'Seeds to buy: ' + buy.map(([pid, why]) => { const c = cubeOf(pid), what = c || (hasCubes(pid) && !seedsOf(pid).length) ? cubeWord(pid)[1] : 'seed'; return P.plants[pid].name + ' (' + what + ', ' + why + ')'; }).join('; ') + '.';
    if (isSite() && navigator.share) navigator.share({ title: 'Seeds to buy', text }).catch(e => { if (!e || e.name !== 'AbortError') copyText(text, () => toast('Copied the list.'), () => toast(text)); });
    else copyText(text, () => toast('Copied the list.'), () => toast(text));
  }
  function seedsChanged() { refreshSheet(); if (!$('view-ideas').hidden) renderSeedBox(); }

  /* ----- Ask Muse: seed bought by Muse (Meta's agent), handed over by Claude on shadowfax -----
     The Plant Book writes the request; the phone remote listener on shadowfax opens Claude with it;
     Claude passes it to Muse at muse.ai; Muse checks with Josh before it pays. No yCubes: Josh is
     moving to printed pods. The connection ({ u, k, pc }) comes from the Connect Plant Book QR code
     and is kept out of backup files. */
  const BUYX = P.buy;
  let NEXUS = store.get('nexus', null);
  let ASKS = store.get('asks', []);
  const MU = { open: null, items: [], note: '', busy: false, msg: '', kind: '', fallback: false, done: false, poll: 0 };
  const buyKind = pid => BUYX.live[pid] ? 'live' : P.plants[pid].status === 'micro' ? 'micro' : 'seed';
  const buyRule = pid => { const k = buyKind(pid); return k === 'live' ? BUYX.live[pid] : BUYX[k]; };
  const buyUnit = (pid, n) => { const u = buyRule(pid).unit; return plural(n, u[0], u[1]); };
  const askLabel = pid => buyKind(pid) === 'live' ? 'Ask Muse to buy plants' : 'Ask Muse to buy seeds';
  const lastSrc = pid => { const ps = SEEDS.filter(s => s.p === pid && s.kind === 'pack' && s.src); return ps.length ? ps[ps.length - 1].src : ''; };
  const lastAsk = pid => { for (let i = ASKS.length - 1; i >= 0; i--) if ((ASKS[i].items || []).some(x => x.p === pid)) return ASKS[i]; return null; };
  const askWord = a => (a.via === 'share' ? 'shared with Muse ' : 'asked Muse ') + fmtDate(a.d);
  const clockNow = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const pcName = () => (NEXUS && NEXUS.pc ? NEXUS.pc : 'shadowfax').toLowerCase();
  const muLive = () => MU.items.filter(i => i.n > 0);
  /* What Muse reads, in Josh's voice. Straight apostrophes: it travels in a link with a length limit. */
  function museText(items, note) {
    const live = items.some(i => buyKind(i.p) === 'live');
    const line = i => { const pl = P.plants[i.p], s = lastSrc(i.p); return pl.name + ' (' + pl.latin + '), ' + buyUnit(i.p, i.n) + (s ? ', from ' + s + ' last time' : BUYX.from && BUYX.from[i.p] ? ', from ' + BUYX.from[i.p] + ' if they have it' : ''); };
    const kind = live ? '' : 'seeds ';
    const head = items.length === 1 ? 'Please buy ' + kind + 'for me: ' + line(items[0]) + '.' : 'Please buy these ' + kind + 'for me, from one seller if you can: ' + items.map(line).join('; ') + '.';
    const n = String(note || '').replace(/\s+/g, ' ').trim();
    return [head, "They're for my indoor hydroponic towers (Gardyn). Get the exact variety named; ask me before swapping.", n ? 'Note: ' + n.replace(/([^.!?])$/, '$1.') : '', 'Ship to my usual address. Before you pay, show me the seller, price and shipping, and wait for my OK. Thanks!'].filter(Boolean).join(' ');
  }
  function museOpen(where, pids) {
    clearTimeout(MU.poll);
    Object.assign(MU, { open: where, items: pids.slice(0, BUYX.maxItems).map(p => ({ p, n: buyRule(p).n })), note: '', busy: false, msg: '', kind: '', fallback: false, done: false });
  }
  function museRefresh() { if (!$('view-ideas').hidden) renderSeedBox(); if (SHEET && SHEET.kind === 'plant') refreshSheet(); }
  function museBtn(pid) { return '<button class="btn small" data-act="museOpen" data-pid="' + pid + '">' + askLabel(pid) + '</button>'; }
  function askNote(pid) { const a = lastAsk(pid); return a ? '<p class="small muted" style="margin:0">' + esc(askWord(a).replace(/^./, c => c.toUpperCase())) + '.</p>' : ''; }
  function musePanel(extra) {
    const site = isSite(), conn = !!NEXUS && site, live = MU.items.some(i => buyKind(i.p) === 'live'), seeds = MU.items.some(i => buyKind(i.p) !== 'live');
    let h = '<div class="muse" id="musePanel"><div class="mu-h"><b>' + (live && !seeds ? 'Ask Muse to buy plants' : 'Ask Muse to buy seeds') + '</b><span class="small">Claude, on ' + esc(pcName()) + ', passes it to Muse. Muse checks with you before it pays.</span></div>';
    h += '<div class="list sb">' + MU.items.map(i => '<div class="sb-row"><span><b>' + esc(P.plants[i.p].name) + '</b><span class="small">' + esc(buyRule(i.p).unit[1]) + '</span></span>' + (MU.done ? '<span class="num mu-n">' + i.n + '</span>' : stepper('mu', i.p, i.n, '', buyRule(i.p).unit[1])) + '</div>').join('') + '</div>';
    MU.items.forEach(i => { const L = BUYX.live[i.p]; if (L && L.why) h += '<p class="small" style="margin:0">' + esc(L.why) + '</p>'; });
    if (extra) h += '<p class="small muted" style="margin:0">' + esc(extra) + '</p>';
    if (!MU.done) h += '<label class="mu-note" for="muNote"><span>A note for Muse <span class="muted">(optional)</span></span><input id="muNote" type="text" maxlength="100" placeholder="Organic if they have it" autocomplete="off" value="' + esc(MU.note) + '"></label>';
    const items = muLive();
    h += '<details class="mu-msg"><summary>What Muse will read</summary><p class="small" id="muText">' + esc(items.length ? museText(items, MU.note) : 'Nothing yet: every count is zero.') + '</p></details>';
    if (MU.msg) h += '<p class="mu-st' + (MU.kind ? ' ' + MU.kind : '') + '" role="status">' + esc(MU.msg) + '</p>';
    h += '<div class="btnrow">';
    if (MU.done) h += '<button class="btn small primary" data-act="museDone">Done</button>';
    else {
      if (conn) h += '<button class="btn small primary" data-act="museSend"' + (MU.busy || !items.length ? ' disabled' : '') + '>' + (MU.busy ? 'Sending…' : 'Send to Claude') + '</button>';
      if (conn && MU.fallback) h += '<button class="btn small" data-act="museNexus">Send through the Nexus app</button>';
      h += '<button class="btn small' + (conn ? ' ghost' : '') + '" data-act="museShare"' + (items.length ? '' : ' disabled') + '>' + (site ? (conn ? 'Share it instead' : 'Share it') : 'Copy it') + '</button><button class="btn small ghost" data-act="museCancel">Cancel</button>';
    }
    h += '</div>';
    if (!site) h += '<p class="small muted mu-foot">Sending it through Claude works in the Plant Book on your phone. Here, copy it and paste it into Muse.</p>';
    else if (!NEXUS) h += '<p class="small muted mu-foot">To send it through Claude, connect once: on shadowfax, double-click <b>Connect Plant Book</b> in the Nexus Kit folder and scan the code with your Fold. Until then, share it to the Muse app or WhatsApp.</p>';
    else if (!MU.done) h += '<p class="small muted mu-foot">Connected to ' + esc(pcName()) + ' since ' + esc(fmtDate(NEXUS.at)) + ' · <button class="linkish" data-act="nexusForget">Disconnect</button></p>';
    return h + '</div>';
  }
  async function nexusCall(method, path, body) {
    const c = NEXUS; if (!c) throw new Error('not connected');
    const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 9000);
    try {
      const headers = { 'X-Nexus-Key': c.k }; if (body) headers['Content-Type'] = 'application/json';
      const res = await fetch(c.u + path, { method, headers, body: body ? JSON.stringify(body) : undefined, cache: 'no-store', credentials: 'omit', signal: ctl.signal });
      let data = {}; try { data = await res.json(); } catch (e) { data = {}; }
      return { status: res.status, data: data || {} };
    } finally { clearTimeout(tm); }
  }
  function logAsk(items, via) { ASKS.push({ d: todayISO(), at: Date.now(), items: items.map(i => ({ p: i.p, n: i.n })), note: String(MU.note || '').slice(0, 100), via }); ASKS = ASKS.slice(-60); store.set('asks', ASKS); }
  const muWhat = items => listWords(items.map(i => P.plants[i.p].name)).slice(0, 150);
  async function museSend() {
    const items = muLive(); if (MU.busy || !items.length || !NEXUS) return;
    MU.busy = true; MU.msg = 'Sending to ' + pcName() + '…'; MU.kind = ''; MU.fallback = false; museRefresh();
    let r = null;
    try { r = await nexusCall('POST', 'api/plantbook/ask', { text: museText(items, MU.note), what: muWhat(items), items: items.map(i => ({ p: i.p, n: i.n, k: buyKind(i.p) })), v: APP_VERSION }); } catch (e) { r = null; }
    MU.busy = false;
    if (!r) { MU.msg = 'Couldn’t reach ' + pcName() + ' from here. If Tailscale is on (on this phone) and the PC is awake, send it through the Nexus app instead, or share it.'; MU.kind = 'err'; MU.fallback = true; museRefresh(); return; }
    if (r.status === 401) { MU.msg = pcName().replace(/^./, c => c.toUpperCase()) + ' didn’t take this phone’s key (it may have been replaced). Connect again: double-click Connect Plant Book on the PC and scan the code.'; MU.kind = 'err'; museRefresh(); return; }
    if (r.status !== 200 || !r.data.ok) { MU.msg = r.data.error || pcName().replace(/^./, c => c.toUpperCase()) + ' answered, but didn’t take the request.'; MU.kind = 'err'; MU.fallback = r.status >= 500; museRefresh(); return; }
    if (!r.data.skipped) logAsk(items, 'claude');
    MU.done = true; MU.kind = r.data.warning ? 'warn' : 'ok';
    MU.msg = [r.data.skipped ? 'That request went to Claude a moment ago.' : 'Sent at ' + clockNow() + '. Claude is opening on ' + pcName() + ' to pass it to Muse.', r.data.warning || ''].filter(Boolean).join(' ');
    museRefresh(); toast('Sent to ' + pcName() + '.');
    if (r.data.id) musePoll(r.data.id);
  }
  function musePoll(id) {
    clearTimeout(MU.poll); const open = MU.open; let tries = 0, gone = 0;
    const tick = async () => {
      tries++; let r = null;
      try { r = await nexusCall('GET', 'api/plantbook/ask?id=' + encodeURIComponent(id)); } catch (e) { r = null; }
      if (r && r.status === 404 && ++gone >= 3) return;
      const st = r && r.status === 200 && r.data ? r.data.state : '';
      const fin = { sent: 'ok', 'needs-enter': 'warn', locked: 'warn', typed: 'warn', failed: 'err' }[st];
      if (fin) {
        if (MU.open === open && MU.done) { MU.msg = r.data.detail || MU.msg; MU.kind = fin; museRefresh(); }
        toast(st === 'sent' ? 'Claude has your request.' : st === 'failed' ? pcName().replace(/^./, c => c.toUpperCase()) + ' couldn’t open Claude.' : 'Claude is waiting for Enter on ' + pcName() + '.', 3200);
        return;
      }
      if (tries < 25) MU.poll = setTimeout(tick, 2000);
    };
    MU.poll = setTimeout(tick, 2000);
  }
  const b64url = s => { const by = new TextEncoder().encode(s); let bin = ''; by.forEach(b => { bin += String.fromCharCode(b); }); return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64url = s => { const b = s.replace(/-/g, '+').replace(/_/g, '/'), bin = atob(b + '==='.slice((b.length + 3) % 4)); return new TextDecoder().decode(Uint8Array.from(bin, x => x.charCodeAt(0))); };
  function museNexus() {
    const items = muLive(); if (!items.length || !NEXUS) return;
    const pay = { text: museText(items, MU.note), what: muWhat(items), items: items.map(i => ({ p: i.p, n: i.n })), k: NEXUS.k, b: MU.open === 'box' ? '#ideas' : '#p-' + MU.open };
    logAsk(items, 'nexus');
    location.href = NEXUS.u + 'plantbook.html#ask=' + b64url(JSON.stringify(pay));
  }
  function museShare() {
    const items = muLive(); if (!items.length) return;
    const text = museText(items, MU.note), copied = () => toast('Copied. Paste it into Muse.', 3000);
    if (isSite() && navigator.share) navigator.share({ title: 'For Muse', text }).then(() => { logAsk(items, 'share'); MU.done = true; MU.kind = 'ok'; MU.msg = 'Shared. Muse takes it from there, and checks with you before it pays.'; museRefresh(); }).catch(e => { if (!e || e.name !== 'AbortError') copyText(text, copied, () => toast(text)); });
    else copyText(text, copied, () => toast('Couldn’t copy it here.'));
  }
  /* The Connect Plant Book QR code opens the app with #nexus=<this PC's Tailscale address and phone key>. */
  function nexusFromHash() {
    const m = /(?:^#|&)nexus=([A-Za-z0-9_-]+)/.exec(location.hash || ''); if (!m) return false;
    let c = null; try { c = JSON.parse(unb64url(m[1])); } catch (e) { c = null; }
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    const local = /^(127\.0\.0\.1|localhost)$/.test(location.hostname);
    const okUrl = c && typeof c.u === 'string' && (/^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.ts\.net\/$/i.test(c.u) || (local && /^http:\/\/(127\.0\.0\.1|localhost):\d+\/$/.test(c.u)));
    if (!okUrl || !/^[0-9a-f]{32,128}$/i.test(String(c.k || ''))) { toast('That connect code didn’t look right. Run Connect Plant Book on the PC again.', 4000); return true; }
    NEXUS = { u: c.u, k: String(c.k).toLowerCase(), pc: String(c.pc || 'shadowfax').slice(0, 40), at: todayISO() };
    store.raw('nexus', NEXUS);
    nexusCall('GET', 'api/plantbook/ping')
      .then(r => toast(r.status === 200 && r.data.keyOk ? 'Connected to ' + pcName() + '. Ask Muse can reach it now.' : 'Saved, but ' + pcName() + ' didn’t accept the key yet. Run Connect Plant Book again.', 4500))
      .catch(() => toast('Saved. ' + pcName().replace(/^./, x => x.toUpperCase()) + ' didn’t answer yet; check that Tailscale is on.', 4500));
    if (SHEET && SHEET.kind === 'plant') refreshSheet();
    return true;
  }

  /* ----- Wire up ----- */
  function openPod(podId) { const pod = POD[podId]; plantSheet(pod.p, podId); }
  function init() {
    if (!LASTBK && hasData()) { const d = store.get('dirty', null), e = earliestDate(); if (!d || e < d.since) store.raw('dirty', { n: (d && d.n) || 1, since: e }); }
    renderDate(); setupBoxes(); renderNews(); askPersist();
    nexusFromHash();
    const start = (location.hash || '').slice(1);
    showView(VIEWS.includes(start) ? start : 'towers');
    if (/^p-/.test(start) && P.plants[start.slice(2)]) { showView('plants'); plantSheet(start.slice(2)); }
    const sm = /^seat-([SF](?:10|[1-9])[LCR])$/.exec(start); if (sm) openSeat(sm[1]);
    if (start === 'pick') { showView('towers'); pickSheet(); }
    if (start === 'doctor') showView('care', 'doctorSec');
    setupWorker();
    window.addEventListener('hashchange', () => { if (/(?:^#|&)nexus=/.test(location.hash)) { nexusFromHash(); return; } const h = location.hash.slice(1); if (VIEWS.includes(h)) { if (sheetOpen()) hideSheet(true); showView(h); } else if (h === 'pick') { if (sheetOpen()) hideSheet(true); showView('towers'); pickSheet(); } else if (h === 'doctor') { if (sheetOpen()) hideSheet(true); showView('care', 'doctorSec'); } else if (/^p-/.test(h) && P.plants[h.slice(2)]) { if (sheetOpen()) hideSheet(true); showView('plants'); plantSheet(h.slice(2)); } else { const sm2 = /^seat-([SF](?:10|[1-9])[LCR])$/.exec(h); if (sm2) { if (sheetOpen()) hideSheet(true); openSeat(sm2[1]); } } });
    window.addEventListener('popstate', () => { if (sheetOpen()) hideSheet(true); });
    document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => { if (sheetOpen()) hideSheet(); showView(t.dataset.view); }));
    $('sheetBack').addEventListener('click', () => hideSheet());
    $('sheetX').addEventListener('click', () => hideSheet());
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (!$('lightbox').hidden) { $('lightbox').hidden = true; return; } if (sheetOpen()) hideSheet(); } });
    $('lightbox').addEventListener('click', e => { if (e.target === $('lightbox')) $('lightbox').hidden = true; });
    $('q').addEventListener('input', renderPlants);
    document.addEventListener('input', e => { if (e.target && e.target.id === 'muNote') { MU.note = e.target.value.slice(0, 100); const p = $('muText'), items = muLive(); if (p) p.textContent = items.length ? museText(items, MU.note) : 'Nothing yet: every count is zero.'; } });
    let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (!$('view-diy').hidden) renderTrail(); }, 150); });
    document.addEventListener('change', e => {
      const rs = e.target.closest && e.target.closest('input[data-restore]');
      if (rs) { const f = rs.files && rs.files[0]; rs.value = ''; if (!f) return; const r = new FileReader(); r.onload = () => offerRestore(r.result); r.onerror = () => toast('That file couldn’t be read.'); r.readAsText(f); return; }
      if (e.target.id === 'hOz') { const v = parseFloat(e.target.value), d = todayISO(); if (isFinite(v) && v > 0) HAMT[d] = Math.min(400, Math.round(v * 10) / 10); else delete HAMT[d]; saveHamt(); harvestChanged(); return; }
      if (e.target.id === 'sbPick') { const pid = e.target.value; e.target.value = ''; if (P.plants[pid]) { plantSheet(pid); setTimeout(() => { const b = $('seedBlk'); if (b) $('sheet').scrollTop = Math.max(0, b.offsetTop - 12); }, 60); } return; }
      const ph = e.target.closest && e.target.closest('input[data-photo]');
      if (ph) { const f = ph.files && ph.files[0], pid = ph.dataset.photo; ph.value = ''; if (!f) return; toast('Saving the photo…'); shrink(f).then(b => phAdd(pid, b)).then(() => { toast('Photo saved on this phone.'); paintPhotos(pid); }).catch(() => toast('That photo couldn’t be saved.')); return; }
      const inp = e.target.closest && e.target.closest('input[data-care-date]'); if (!inp) return;
      const id = inp.dataset.careDate, v = inp.value;
      if (v && v <= todayISO()) CARE[id] = v; else if (!v) delete CARE[id];
      store.set('care', CARE); renderCare(); renderToday();
    });
    document.addEventListener('click', e => {
      const t = e.target;
      const tw = t.closest('[data-tower]'); if (tw) { UI.tower = tw.dataset.tower; saveUI(); renderTower(); return; }
      const ln = t.closest('[data-lens]'); if (ln) { UI.lens = ln.dataset.lens; saveUI(); renderTower(); return; }
      const sc = t.closest('[data-scout]'); if (sc) { UI.scout = sc.dataset.scout; saveUI(); renderIdeas(); return; }
      const jump = t.closest('[data-jump]'); if (jump) { const el = $(jump.dataset.jump); if (el) window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 70), behavior: 'smooth' }); return; }
      const md = t.closest('[data-mode]'); if (md) { UI.mode = md.dataset.mode; saveUI(); renderTower(); return; }
      const fl = t.closest('[data-filter]'); if (fl) { UI.filter = fl.dataset.filter; saveUI(); $('q').value = ''; renderPlants(); return; }
      const go = t.closest('[data-go]'); if (go) { if (sheetOpen()) hideSheet(true); showView(go.dataset.go, go.dataset.anchor); return; }
      const pd = t.closest('.pod'); if (pd) { if (pd.dataset.pod) openPod(pd.dataset.pod); else seatSheet(pd.dataset.slot); return; }
      const op = t.closest('[data-open]');
      if (op) {
        const k = op.dataset.open;
        if (k === 'plant') { if (op.dataset.pod) openPod(op.dataset.pod); else plantSheet(op.dataset.pid); if (op.dataset.seeds) setTimeout(() => { const b = $('seedBlk'); if (b) $('sheet').scrollTop = Math.max(0, b.offsetTop - 12); }, 60); }
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
      else if (act === 'bowlToggle') { const id = a.dataset.pid; const i = BOWL.indexOf(id); if (i >= 0) BOWL.splice(i, 1); else BOWL.push(id); saveBowl(); if (!$('view-salad').hidden) renderBowl(); if (SHEET) refreshSheet(); else if (i < 0 && $('view-salad').hidden) toast('Added to tonight\u2019s bowl.'); }
      else if (act === 'bowlClear') { BOWL.length = 0; saveBowl(); renderBowl(); }
      else if (act === 'bowlLoad') { const src = a.dataset.house ? P.house.find(x => x.id === a.dataset.house).plants : SAVED[+a.dataset.i].plants; BOWL.length = 0; src.filter(bowlable).forEach(x => BOWL.push(x)); saveBowl(); renderBowl(); const el = $('bowlSec'); window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 70), behavior: 'smooth' }); toast('Loaded into the bowl.'); }
      else if (act === 'bowlSave') { if (!BOWL.length) return; const nm = ($('bowlName').value || '').trim() || 'Bowl of ' + fmtDate(todayISO()); SAVED.unshift({ name: nm.slice(0, 60), plants: BOWL.slice(), d: todayISO() }); store.set('bowls', SAVED.slice(0, 30)); $('bowlName').value = ''; renderSaved(); toast('Saved.'); }
      else if (act === 'bowlDel') { SAVED.splice(+a.dataset.i, 1); store.set('bowls', SAVED); renderSaved(); }
      else if (act === 'mgPick') { const id = a.dataset.pid; const i = MGSEL.indexOf(id); if (i >= 0) MGSEL.splice(i, 1); else MGSEL.push(id); store.set('mgsel', MGSEL); renderPlanner(); }
      else if (act === 'bowlAte') { const ids = P.pods.filter(p => BOWL.includes(p.p) && pickable(p)).map(p => p.id); setPicked(ids, true); ATE.push({ d: todayISO(), p: BOWL.slice() }); ATE = ATE.slice(-300); store.set('ate', ATE); renderToday(); renderBowl(); toast('Counted' + (ids.length ? ', and ' + ids.length + (ids.length === 1 ? ' pod' : ' pods') + ' logged as picked today.' : '.')); }
      else if (act === 'bowlShare' || act === 'shareCard') shareCard();
      else if (act === 'bkNow') backupNow();
      else if (act === 'bkLater') { const lv = bkLevel(bkState()); store.raw('bkSnooze', addDays(todayISO(), lv === 'firm' ? 1 : lv === 'soft' ? 3 : 2)); $('bkBox').hidden = true; toast(lv === 'firm' ? 'Tomorrow, then.' : 'Later, then.'); }
      else if (act === 'bkCopy') bkCopy();
      else if (act === 'bkPaste') { const b = $('pasteBox'); b.hidden = !b.hidden; if (!b.hidden) { $('restoreText').value = ''; $('restoreText').focus(); } }
      else if (act === 'bkPasteGo') offerRestore($('restoreText').value);
      else if (act === 'bkRestoreGo') doRestore();
      else if (act === 'bkRestoreNo') { BK.parsed = null; renderData(); }
      else if (act === 'bkUndo') { if (!a.dataset.armed) { a.dataset.armed = '1'; a.textContent = 'Tap again to undo it'; return; } undoRestore(); }
      else if (act === 'flowerAdd' || act === 'flowerDel' || act === 'fruitAdd' || act === 'fruitDel') { const kind = /^flower/.test(act) ? 'flower' : 'fruit'; bump(kind, a.dataset.pid, /Add$/.test(act) ? 1 : -1); harvestChanged(); }
      else if (act === 'fruitRound') pickSheet('fruit');
      else if (act === 'hSize') { HAMT[todayISO()] = +a.dataset.b * HV.boxOz; saveHamt(); harvestChanged(); }
      else if (act === 'hSizeClear') { delete HAMT[todayISO()]; saveHamt(); harvestChanged(); }
      else if (act === 'hpReset') { priceDefaults(); store.set('hprice', {}); fillPrices(); paintHarvest(); toast('Back to the USDA prices.'); }
      else if (act === 'cubeAdd' || act === 'cubeDel') { const pid = a.dataset.pid; let c = cubeOf(pid); if (!c && act === 'cubeAdd') { c = { id: Date.now().toString(36), p: pid, kind: 'cube', n: 0 }; SEEDS.push(c); } if (c) { c.n = Math.max(0, (c.n || 0) + (act === 'cubeAdd' ? 1 : -1)); saveSeeds(); seedsChanged(); } }
      else if (act === 'packOpen') { const f = $('packForm'); if (f) { f.hidden = false; a.hidden = true; $('pkSrc').focus(); } }
      else if (act === 'packCancel') { refreshSheet(); }
      else if (act === 'packAdd') { const yr = parseInt($('pkYr').value, 10); SEEDS.push({ id: Date.now().toString(36), p: a.dataset.pid, kind: 'pack', src: ($('pkSrc').value || '').trim().slice(0, 40), yr: yr >= 1990 && yr <= 2100 ? yr : null, st: 'ok' }); saveSeeds(); seedsChanged(); toast('In the seed box.'); }
      else if (act === 'packSt') { const s = SEEDS.find(x => x.id === a.dataset.id); if (s) { s.st = a.dataset.st; saveSeeds(); seedsChanged(); } }
      else if (act === 'packDel') { if (!a.dataset.armed) { a.dataset.armed = '1'; a.textContent = 'Tap again'; return; } SEEDS = SEEDS.filter(x => x.id !== a.dataset.id); saveSeeds(); seedsChanged(); }
      else if (act === 'seedShare') seedShare();
      else if (act === 'museOpen') { museOpen(a.dataset.pid, [a.dataset.pid]); refreshSheet(); setTimeout(() => { const m = $('musePanel'); if (m && SHEET) $('sheet').scrollTop = Math.max(0, m.offsetTop - 60); }, 30); }
      else if (act === 'museBox') { museOpen('box', seedBuyList().map(b => b[0])); renderSeedBox(); }
      else if (act === 'muAdd' || act === 'muDel') { const it = MU.items.find(x => x.p === a.dataset.pid); if (it && !MU.done && !MU.busy) { it.n = Math.max(0, Math.min(50, it.n + (act === 'muAdd' ? 1 : -1))); museRefresh(); } }
      else if (act === 'museSend') museSend();
      else if (act === 'museNexus') museNexus();
      else if (act === 'museShare') museShare();
      else if (act === 'museCancel' || act === 'museDone') { MU.open = null; MU.busy = false; museRefresh(); }
      else if (act === 'nexusForget') { if (!a.dataset.armed) { a.dataset.armed = '1'; a.textContent = 'Tap again to disconnect'; return; } NEXUS = null; store.raw('nexus', null); museRefresh(); toast('Disconnected from shadowfax.'); }
      else if (act === 'scoutStar') { const id = a.dataset.pid; if (SCOUT[id]) delete SCOUT[id]; else SCOUT[id] = todayISO(); store.set('scout', SCOUT); if (!$('view-ideas').hidden) renderIdeas(); if (SHEET) refreshSheet(); toast(SCOUT[id] ? 'On the shortlist.' : 'Off the shortlist.'); }
      else if (act === 'doctor') doctorSheet(a.dataset.id);
      else if (act === 'photoOpen') openLight(+a.dataset.id, a.dataset.src, a.dataset.d);
      else if (act === 'lightClose') $('lightbox').hidden = true;
      else if (act === 'photoCredits') creditsSheet();
      else if (act === 'photoDel') { if (!a.dataset.armed) { a.dataset.armed = '1'; a.textContent = 'Tap again to delete'; return; } phDel(+a.dataset.id).then(() => { $('lightbox').hidden = true; if (SHEET && SHEET.pid) paintPhotos(SHEET.pid); toast('Photo deleted.'); }).catch(() => toast('Couldn’t delete it.')); }
      else if (act === 'tipNext') { UI.tipShift = (UI.tipShift || 0) + 1; renderTip(); }
      else if (act === 'tipGo') { const g = P.tips[+a.dataset.i].go || {}; if (g.doctor) doctorSheet(g.doctor); else if (g.plant) plantSheet(g.plant); else if (g.forb) forbSheet(g.forb); else if (g.view) showView(g.view, g.anchor); }
      else if (act === 'forbidden') showView('forbidden');
      else if (act === 'forbItem') { forbSheet(a.dataset.id); $('sheet').scrollTop = 0; }
      else if (act === 'fgPick') { if (FG && !FG.pick) { FG.pick = a.dataset.k; if (fgRight(FB.game[FG.q[FG.i]], FG.pick)) FG.score++; renderGame(); } }
      else if (act === 'fgNext') { FG.i++; FG.pick = null; if (FG.i >= FG.q.length) { FGS.plays++; FGS.best = Math.max(FGS.best || 0, FG.score); store.set('fgame', FGS); } renderGame(); const g = $('fgame'); if (g.getBoundingClientRect().top < 60) window.scrollTo({ top: Math.max(0, g.getBoundingClientRect().top + window.scrollY - 70), behavior: 'smooth' }); }
      else if (act === 'fgNew') { fgRound(); renderGame(); }
      else if (act === 'podMark') { const sl = a.dataset.slot, cell = layout(sl[0], 'now')[sl]; PODS.seats[sl] = { since: todayISO(), n: cell && cell.pods.length ? 1 : 0 }; savePods(); podChanged(); toast('Marked: a printed pod at ' + seatName(sl, true) + '.'); }
      else if (act === 'podReplant') { const ps = PODS.seats[a.dataset.slot]; if (ps) { ps.n = (ps.n || 0) + 1; savePods(); podChanged(); toast('Counted: one more yCube you didn’t buy.'); } }
      else if (act === 'podUndo') { const ps = PODS.seats[a.dataset.slot]; if (ps && ps.n > 0) { ps.n--; savePods(); podChanged(); } }
      else if (act === 'podOut') { if (!a.dataset.armed) { a.dataset.armed = '1'; a.textContent = 'Tap again to take it out'; return; } const sl = a.dataset.slot, ps = PODS.seats[sl]; if (ps) { PODS.past += ps.n || 0; delete PODS.seats[sl]; savePods(); podChanged(); toast('Taken out. Its plantings stay counted.'); } }
      else if (act === 'plogOpen') plOpen();
      else if (act === 'plogFor') plOpen(a.dataset.part);
      else if (act === 'plogAdd') plAdd();
      else if (act === 'plogCancel') $('plForm').hidden = true;
      else if (act === 'plogDel') { if (!a.dataset.armed) { a.dataset.armed = '1'; a.textContent = 'Tap again'; return; } PRINTS = PRINTS.filter(e => e.id !== a.dataset.id); store.set('prints', PRINTS); paintLogSum(); paintOff(); paintFoot(); }
      else if (act === 'pickRound') pickSheet();
      else if (act === 'pickToggle') { const id = a.dataset.pod; setPicked([id], PICK[id] !== todayISO()); harvestChanged(); }
      else if (act === 'pickAll') { setPicked(pickList().map(x => x.p.id), true); harvestChanged(); toast('Picking round logged. Say how much came off, if you like.'); }
      else if (act === 'catchUp') catchSheet();
      else if (act === 'catchSet') { CARE[a.dataset.id] = addDays(todayISO(), -(+a.dataset.d)); store.set('care', CARE); renderCare(); renderToday(); refreshSheet(); }
      else if (act === 'copyLink') copyLink(a.dataset.slot);
      else if (act === 'verdict') { const id = a.dataset.pid, v = a.dataset.v; if ((VERD[id] || {}).v === v) delete VERD[id]; else VERD[id] = { v, d: todayISO() }; store.set('verdict', VERD); if (!$('view-salad').hidden) renderFlights(); if (!$('view-plants').hidden) renderPlants(); if (SHEET) refreshSheet(); }
      else if (act === 'newsOk') { store.set('seenVersion', APP_VERSION); $('newsBox').hidden = true; renderBackupNote(); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
