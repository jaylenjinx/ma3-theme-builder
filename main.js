(() => {
const $ = s => document.querySelector(s);
const statusEl = $('#status');
const say = t => { statusEl.textContent = t; };

/* ---------- descriptions ---------- */
const D = {
'Global.Text':'Main text colour on buttons, pools, sheets and window titles.',
'Global.TextDefault':'Values that are still at their default, and empty items. Usually a dim grey so changed values stand out.',
'Global.TextDark':'Dark text on bright backgrounds, for example an active title button.',
'Global.Background':'Window background behind content. Partly transparent so the screen shows through.',
'Global.BackgroundDark':'Solid backing where content must be fully opaque, such as the command line.',
'Global.Header':'Column header background in grids and sheets.',
'Global.AltHeader':'Every other column header, so columns are easier to tell apart.',
'Global.DefaultCellBackground':'Sheet and grid cell background (odd rows).',
'Global.DefaultCellAltBackground':'Alternate row background in sheets, and the outline of empty pool slots.',
'Global.SelectedCellBackground':'Background of the cell you have selected in a grid.',
'Global.Selected':'The main selection colour: selected fixtures, selected pool objects, active button text. MA default is gold.',
'Global.SelectedInverted':'Selection highlight where the selection is drawn inverted.',
'Global.SelectedEdge':'Edge drawn around selected items.',
'Global.InvalidGridPosition':'Fixtures at an invalid position in the Selection Grid.',
'Global.MainMultiPatchSelected':'Selected main fixture of a multipatch.',
'Global.PartlySelected':'Something is partly selected, for example only some sub-fixtures.',
'Global.SelectedPreset':'Frame on presets whose values the current selection already has.',
'Global.PartlySelectedPreset':'Frame on presets that only part of the selection has.',
'Global.BackgroundSelected':'Background of a button that is switched on or active.',
'Global.BackgroundInvalidGridPosition':'Background behind invalid grid positions.',
'Global.BackgroundMainMultiPatchSelected':'Background behind a selected multipatch main fixture.',
'Global.BackgroundSelectedInverted':'Background used with the inverted selection highlight.',
'Global.Connected':'Status colour for connected devices and stations.',
'Global.Lasso':'The rectangle you drag to lasso-select.',
'Global.FocusFrame':'Frame around the window or input that has keyboard focus. Animates when focused.',
'Global.WindowFocus':'Background tint of the focused window.',
'Global.Hover':'Button background under the mouse or finger.',
'Global.SelectedFrameBackground':'Background of selected rows in grids and sheets. Dark blue by default.',
'Global.SelectedRowBorder':'Line above and below the selected row.',
'Global.Pressed':'Button background while it is held down.',
'Global.ButtonBackground':'The standard button colour: pool tiles, executors, popup items, fader knobs. The biggest single area on screen.',
'Global.ButtonBackgroundTransparent75':'Button background at 75% opacity, used over other content.',
'Global.ButtonBackgroundDarker':'Darker button shade, e.g. the selected item in a popup list.',
'Global.ButtonIndicatorIcon':'Small indicator icons drawn on buttons and pool objects.',
'Global.ButtonAdditionalText':'Extra small text on buttons, such as counts or secondary info. Green by default.',
'Global.ActiveIcon':'Icons on buttons that are switched on.',
'Global.Inactive':'Greyed-out items that are inactive.',
'Global.Bright':'Bright labels, such as executor names.',
'Global.TitleGray':'Window title bars and title buttons.',
'Global.LabelText':'Labels and numbers, such as pool object numbers and executor numbers.',
'Global.IndicatorBar':'Neutral bars and window borders, fader "off" state, unchanged executor config.',
'Global.PropertyBackground':'Background of property fields in editors.',
'Global.PropertyBackgroundActive':'Property field background while you edit it.',
'Global.Fixed':'Fixed executors and fixed items. Orange by default.',
'Global.Icon':'Default icon colour.',
'Global.RedIndicator':'Red status indicator, e.g. system-locked objects and flashed fader knob.',
'Global.DarkRedIndicator':'Dim red indicator.',
'Global.GreenIndicator':'Green status indicator, e.g. fader on.',
'Global.DarkGreenIndicator':'Dim green indicator, also the edit mix-in tint on windows.',
'Global.YellowIndicator':'Yellow status indicator.',
'Global.DarkOrangeIndicator':'Dim orange indicator, also the tint when someone else is editing.',
'Global.OrangeIndicator':'Orange indicator, e.g. user-locked objects.',
'Global.CyanIndicator':'Cyan indicator.',
'Global.PreviewIndicator':'Marks things shown in Preview (blind) mode.',
'Global.UpdateIndicator':'Marks objects that Update would change.',
'Global.UpdateAddIndicator':'Marks objects where Update would add values.',
'Global.UpdateIntegrated':'Update into an integrated (embedded) preset.',
'Global.UpdateAddIntegrated':'Update-add into an integrated preset.',
'Global.Warning':'Warning messages.',
'Global.Error':'Error messages.',
'Global.Alert':'Alerts and critical states, e.g. a disabled fader or a loaded cue.',
'Global.Success':'Success messages.',
'Global.RedBackground':'Background of destructive buttons such as Clear.',
'Global.OverlayBackground':'Background behind overlays and pop-up menus.',
'Global.GreenBackground':'Background of confirm buttons such as Please.',
'Global.Shadow':'Text shadow behind labels.',
'Global.ShadowDark':'Stronger shadow.',
'Global.ShadowBright':'Shadow for text on bright backgrounds (fully transparent by default).',
'Global.DeskLock':'Tint over the screen when the desk is locked.',
'Global.Disabled':'Text and icons of disabled controls.',
'Global.Referenced':'Marks objects that reference another (e.g. a preset used in a cue).',
'Global.GlobalPreset':'Marker for global presets.',
'Global.SelectivePreset':'Marker for selective presets.',
'Global.UniversalPreset':'Marker for universal presets.',
'Global.ForSome':'Applies to some of the selection.',
'Global.ForAll':'Applies to all of the selection.',
'Global.ForNone':'Applies to none of the selection.',
'Global.Darkened':'Areas that are darkened out.',
'Global.Transparent':'Fully transparent. Leave alone unless you know where it is used.',
'Global.Transparent25':'Black at 25% opacity, used for subtle overlays.',
'Global.Transparent50':'Black at 50% opacity, e.g. default cue background on executors.',
'Global.Transparent75':'Black at 75% opacity.',
'Global.TransparentWhite':'White at 40% opacity, e.g. grid resize lines.',
'Global.TransparentWhite25':'White at 25% opacity.',
'Global.Parked':'Parked attributes.',
'Global.RemoteInputLock':'Tint shown when remote input is locked.',
'Global.TextViewSelectedRow':'Selected line in text views such as the command line history.',
'Global.TextViewBackground':'Background of text views.',
'Global.TextViewFixedBackground':'Fixed lines in text views.',
'Global.Collected':'Collected items.',
'Global.UserChanged':'Values the user has changed.',
'Global.ClonedHint':'Hint shown on cloned objects.',
'Global.WaveForm':'Audio waveform in timecode and sound views.',
'Global.Cooked':'Cooked values and MAtricks markers on pool objects.',
'SheetColor.Text':'Normal value text in sheets.',
'SheetColor.TextTracked':'Values tracked from an earlier cue. Magenta by default.',
'SheetColor.TextOtherUser':'Values from another user.',
'SheetColor.TextPlayback':'Values coming from a playback.',
'SheetColor.TextPlaybackTracked':'Tracked values coming from a playback.',
'SheetColor.TextOtherPlayback':'Values from another playback.',
'SheetColor.TextOtherPlaybackTracked':'Tracked values from another playback.',
'SheetColor.TextOtherProgrammer':'Values in another user’s programmer.',
'SheetColor.BackgroundOtherProgrammer':'Cell background for another user’s programmer values.',
'SheetColor.TextSelectedPlayback':'Values from the selected playback.',
'SheetColor.Background':'Default sheet background.',
'SheetColor.OtherUser':'Marks things owned by another user.',
'SheetColor.Fade':'Cell background for fade times.',
'SheetColor.FadeText':'Text of fade times.',
'SheetColor.Delay':'Cell background for delay times.',
'SheetColor.DelayText':'Text of delay times.',
'SheetColor.DelayTextBlocked':'Text of blocked delay times.',
'SheetColor.Absolute':'Cell background for absolute values in the programmer. Dark red by default.',
'SheetColor.AbsoluteText':'Text of absolute values in the programmer.',
'SheetColor.AbsoluteTextBlocked':'Text of blocked absolute values.',
'SheetColor.Relative':'Cell background for relative values.',
'SheetColor.RelativeText':'Text of relative values.',
'SheetColor.Phaser':'Cell background for phaser values. Also the Info title-button icon.',
'SheetColor.PhaserText':'Text of phaser values and multi-step markers.',
'SheetColor.GridPos':'Cell background for grid positions.',
'SheetColor.GridPosText':'Text of grid positions.',
'SheetColor.ID':'Background of the fixture ID column.',
'SheetColor.IDText':'Text in the fixture ID column.',
'SheetColor.IDTextBlocked':'ID text when blocked.',
'SheetColor.PresetAbs':'Cell background for values that come from an absolute preset.',
'SheetColor.PresetRel':'Cell background for values from a relative preset.',
'SheetColor.Integrated':'Cell background for integrated (embedded) presets.',
'SheetColor.PresetText':'Text of preset references in sheets.',
'SheetColor.RelPresetText':'Text of relative preset references.',
'SheetColor.IntegratedText':'Text of integrated preset references.',
'SheetColor.Update':'Values that an Update would change.',
'SheetColor.NotAvailable':'Attributes a fixture doesn’t have.',
'SheetColor.DownGoingText':'Values going down in the next cue.',
'SheetColor.UpGoingText':'Values going up in the next cue.',
'SheetColor.TextMIB':'Text of Move In Black values.',
'SheetColor.BackMIB':'Background of Move In Black values.',
'SheetColor.TextMIBFade':'Text of MIB values while fading.',
'SheetColor.BackMIBFade':'Background of MIB values while fading.',
'SheetColor.GroupMasterActive':'Values affected by an active group master.',
'SheetColor.AdditiveMasterActive':'Values affected by an active additive master.',
'SheetColor.PreviewMixIn':'Tint mixed into windows in Preview mode.',
'Playback.Off':'Playback off indicator.',
'Playback.On':'Playback running indicator.',
'Playback.Paused':'Playback paused indicator.',
'Playback.Forwards':'Playback running forwards.',
'Playback.Backwards':'Playback running backwards.',
'Playback.FastForwards':'Fast forward indicator.',
'Playback.FastBackwards':'Fast backward indicator.',
'Playback.Recording':'Recording indicator (timecode, sound).',
'Playback.ActiveCue':'Highlight of the active cue on executors and sequence sheets.',
'Playback.FaderBarBack':'Empty part of executor and pool fader bars.',
'Playback.FaderBar':'Filled part of executor fader bars (the level).',
'Playback.FaderBarText':'Text drawn on fader bars, e.g. the percentage.',
'Playback.Blue50':'Blue at 50%, for playback highlights.',
'Playback.Blue75':'Blue at 75%.',
'Playback.Yellow25':'Yellow at 25%.',
'Playback.Yellow50':'Yellow at 50%.',
'Playback.Yellow75':'Yellow at 75%.',
'Playback.White25':'White at 25%.',
'Playback.White50':'White at 50%.',
'Playback.White75':'White at 75%.',
'Playback.Cyan25':'Cyan at 25%.'
};
const POOLNOTE = {Preset:'all preset pools', PresetAll:'the All preset pool', Matricks:'MAtricks', Gels:'gel', Quickey:'Quickey'};
const human = s => s.replace(/([a-z0-9])([A-Z])/g,'$1 $2').replace(/([A-Z])([A-Z][a-z])/g,'$1 $2');
function describe(def) {
  if (D[def.key]) return D[def.key];
  if (def.g === 'PoolDefault') return 'Default tile and title colour for ' + (POOLNOTE[def.n] || human(def.n).replace(/^Preset /,'') + (def.n.startsWith('Preset') ? ' presets' : ' pool objects')) + '. Objects with their own appearance keep theirs.';
  return human(def.n) + '.';
}

/* ---------- colour maths + theme model (shared code in core.js) ---------- */
const {hx, parse, mapHex, css, esc} = MA3;
function master(h) {
  if (state.dim === 100 && state.sat === 100) return h.toUpperCase();
  return mapHex(h, (s, v) => [s*state.sat/100, v*state.dim/100]);
}
let model = null, base = null, SRC = '', defs = [], defMap = {}, elems = [], usedBy = {};
const state = { vals: {}, dim: 100, sat: 100 };
function load(text) {
  model = MA3.parseTheme(text);
  ({src: SRC, defs, defMap, elems, usedBy} = model);
  state.vals = {};
}
const val = k => state.vals[k] || defMap[k].orig;
const buildXml = (get = k => master(val(k)), fname = $('#fname').value) => MA3.buildXml(model, get, fname);

/* ---------- demo ---------- */
const screen = $('#screen');
const varName = k => '--c-' + k.replace(/[^\w]/g, '-');
function paintDemo(useOrig) {
  for (const d of defs) screen.style.setProperty(varName(d.key), css(useOrig ? d.orig : master(val(d.key))));
}

/* ---------- list ---------- */
const TABS = [
  {id:'Global', label:'Global', note:'The core colours. Most of the screen is built from these, and each one feeds many elements.'},
  {id:'SheetColor', label:'Sheets', note:'Value colours in the fixture, sequence and DMX sheets: absolute, relative, fades, delays, tracking.'},
  {id:'Playback', label:'Playback', note:'Executor fader bars, cue highlight and run-state indicators.'},
  {id:'PoolDefault', label:'Pools', note:'Default colours of pool objects and their window titles.'},
  {id:'el', label:'Elements', note:'Colours fixed to a single element instead of a shared colour. Change these for fine control.'},
  {id:'changed', label:'Changed', note:'Everything you have changed from the loaded theme.'}
];
let tab = 'Global';
function itemsFor(t) {
  if (t === 'el') return elems;
  if (t === 'changed') return [...defs, ...elems].filter(d => state.vals[d.key] && state.vals[d.key] !== d.orig);
  return defs.filter(d => d.g === t);
}
function renderTabs() {
  $('#tabs').innerHTML = TABS.map(t => `<button class="tab" role="tab" type="button" data-t="${t.id}" aria-selected="${t.id===tab}">${t.label}<span class="n">${itemsFor(t.id).length}</span></button>`).join('');
  $('#tabNote').textContent = TABS.find(t => t.id === tab).note;
}
function rowHtml(d) {
  const v = val(d.key), changed = v !== d.orig, a = parse(v).a;
  const isEl = d.key.startsWith('el:');
  const desc = isEl ? `Fixed colour for ${human(d.n).toLowerCase()} in the ${human(d.g)} area. Only this element uses it.` : describe(d);
  const used = usedBy[d.key] || [];
  return `<div class="row" id="row-${esc(d.key)}" data-key="${esc(d.key)}">
    <label class="sw" title="Pick colour"><i style="background:${css(v)}"></i><input type="color" value="#${v.slice(0,6)}" aria-label="${esc(d.n)} colour"></label>
    <div class="meta"><div class="nm">${changed?'<span class="dot" title="Changed"></span>':''}${esc(human(d.n))}<span class="g">${esc(isEl ? d.g : d.g === 'SheetColor' ? 'Sheet' : d.g)}</span></div>
      <p class="desc">${esc(desc)}</p>
      ${used.length ? `<details class="used"><summary>Used by ${used.length} element${used.length>1?'s':''}</summary><div>${used.map(u=>`<span>${esc(u)}</span>`).join('')}</div></details>` : ''}
    </div>
    <div class="vals"><input class="hex" value="${v}" maxlength="8" spellcheck="false" aria-label="${esc(d.n)} RGBA hex">
      <span class="alpha">A<input type="range" min="0" max="255" value="${a}" aria-label="${esc(d.n)} opacity"><output>${Math.round(a/2.55)}%</output></span>
      <button class="reset" type="button" ${changed?'':'hidden'}>Reset</button></div>
  </div>`;
}
function renderList() {
  renderTabs();
  const q = $('#search').value.trim().toLowerCase();
  let items = q ? [...defs, ...elems] : itemsFor(tab);
  if (q) items = items.filter(d => (d.key + ' ' + human(d.n) + ' ' + (d.key.startsWith('el:') ? '' : describe(d)) + ' ' + (usedBy[d.key]||[]).join(' ')).toLowerCase().includes(q));
  let html = '', lastG = null;
  for (const d of items) {
    if ((tab === 'el' || q || tab === 'changed') && d.g !== lastG) { html += `<div class="sect">${esc(human(d.g))}</div>`; lastG = d.g; }
    html += rowHtml(d);
  }
  $('#list').innerHTML = html || `<div class="empty">${tab==='changed' && !q ? 'Nothing changed yet. Pick a colour in any tab, or click something on the live screen.' : 'No colours match that search.'}</div>`;
}
function setVal(key, hex, rowEl) {
  hex = hex.toUpperCase();
  if (hex === defMap[key].orig) delete state.vals[key]; else state.vals[key] = hex;
  if (rowEl) {
    rowEl.querySelector('.sw i').style.background = css(hex);
    rowEl.querySelector('input[type=color]').value = '#' + hex.slice(0,6);
    const hexIn = rowEl.querySelector('.hex'); if (document.activeElement !== hexIn) hexIn.value = hex;
    rowEl.querySelector('input[type=range]').value = parse(hex).a;
    rowEl.querySelector('output').textContent = Math.round(parse(hex).a/2.55) + '%';
    rowEl.querySelector('.reset').hidden = !state.vals[key];
    const nm = rowEl.querySelector('.nm'), dot = nm.querySelector('.dot');
    if (state.vals[key] && !dot) nm.insertAdjacentHTML('afterbegin','<span class="dot" title="Changed"></span>'); else if (!state.vals[key] && dot) dot.remove();
  }
  if (!key.startsWith('el:')) screen.style.setProperty(varName(key), css(master(hex)));
  changedCount(); persist();
}
function changedCount() {
  const n = Object.keys(state.vals).length;
  const b = document.querySelector('.tab[data-t="changed"] .n'); if (b) b.textContent = n;
}

/* ---------- events ---------- */
$('#list').addEventListener('input', e => {
  const row = e.target.closest('.row'); if (!row) return;
  const key = row.dataset.key, cur = val(key);
  if (e.target.type === 'color') setVal(key, e.target.value.slice(1) + cur.slice(6), row);
  else if (e.target.type === 'range') setVal(key, cur.slice(0,6) + hx(+e.target.value), row);
  else if (e.target.classList.contains('hex')) {
    let v = e.target.value.replace(/^#/, '').trim();
    if (/^[0-9a-f]{6}$/i.test(v)) v += cur.slice(6);
    const ok = /^[0-9a-f]{8}$/i.test(v); e.target.classList.toggle('bad', !ok);
    if (ok) setVal(key, v, row);
  }
});
$('#list').addEventListener('click', e => {
  if (!e.target.classList.contains('reset')) return;
  const row = e.target.closest('.row'); setVal(row.dataset.key, defMap[row.dataset.key].orig, row);
});
$('#tabs').addEventListener('click', e => { const b = e.target.closest('.tab'); if (!b) return; tab = b.dataset.t; $('#search').value = ''; renderList(); });
$('#search').addEventListener('input', renderList);
screen.addEventListener('click', e => {
  const el = e.target.closest('[data-k]'); if (!el || !defMap[el.dataset.k]) return;
  e.preventDefault();
  const k = el.dataset.k; tab = defMap[k].g; $('#search').value = ''; renderList();
  const row = document.getElementById('row-' + k);
  if (row) { row.scrollIntoView({block:'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); row.classList.remove('flash'); void row.offsetWidth; row.classList.add('flash'); }
});
screen.addEventListener('mouseover', e => { const el = e.target.closest('[data-k]'); if (el && !el.title) el.title = human(el.dataset.k.split('.')[1]) + ' (click to edit)'; });

function syncMasters() { $('#oDim').textContent = state.dim + '%'; $('#oSat').textContent = state.sat + '%'; $('#mDim').value = state.dim; $('#mSat').value = state.sat; }
$('#mDim').addEventListener('input', e => { state.dim = +e.target.value; syncMasters(); paintDemo(); persist(); });
$('#mSat').addEventListener('input', e => { state.sat = +e.target.value; syncMasters(); paintDemo(); persist(); });

const resetBtn = $('#btnReset'); let resetArmed = false;
resetBtn.addEventListener('click', () => {
  if (!resetArmed) { resetArmed = true; resetBtn.textContent = 'Click again to reset'; setTimeout(() => { resetArmed = false; resetBtn.textContent = 'Reset all'; }, 3000); return; }
  resetArmed = false; resetBtn.textContent = 'Reset all';
  state.vals = {}; state.dim = 100; state.sat = 100; syncMasters(); paintDemo(); renderList(); persist(); say('All colours are back to the loaded theme.');
});

/* ---------- gallery hand-off and sharing ---------- */
// Replace the editor's colours with a full set of values (from the gallery or a share code).
function applyVals(vals, fname, name) {
  state.vals = {}; for (const k in vals) if (defMap[k] && vals[k] !== defMap[k].orig) state.vals[k] = vals[k];
  state.dim = 100; state.sat = 100; $('#fname').value = fname;
  syncMasters(); paintDemo(); renderList(); persist();
  if (!$('#exportBox').hidden) $('#xmlOut').value = buildXml();
  say(`${name} is loaded into the editor. Fine-tune any colour below, then Export.`);
}
// Share codes are made against the bundled theme, so a different loaded theme can't be shared.
const sameBase = () => base && model.all.length === base.all.length && model.all.every((d, i) => d.key === base.all[i].key);
$('#btnShare').addEventListener('click', () => {
  if (!sameBase()) { say('Sharing only works for themes built on the bundled theme, not on a theme file you loaded. Download the XML instead.'); return; }
  const name = $('#fname').value.trim().replace(/\.xml$/i, '').replace(/^theme_/, '').replace(/[_-]+/g, ' ').trim().replace(/\b\w/g, c => c.toUpperCase()) || 'My theme';
  const code = MA3.packCode(model, k => master(val(k)));
  window.open(MA3.submitUrl(name, code), '_blank', 'noopener');
  say('GitHub opened with your theme filled in. Submit the form there; it shows up in the gallery once it is approved.');
});
// Links from the gallery: ?scheme=<built-in id>, ?theme=<community id> or ?code=<share code>.
// Returns a message when the link couldn't be opened, so the saved draft stays as it was.
async function fromLink() {
  const q = new URLSearchParams(location.search);
  if (![...q.keys()].some(k => ['scheme', 'theme', 'code'].includes(k))) return '';
  history.replaceState(null, '', location.pathname);
  let vals, fname, name;
  try {
    if (q.get('scheme')) {
      const t = MA3.BUILTINS.find(x => x.id === q.get('scheme')); if (!t) throw new Error('That gallery theme no longer exists.');
      vals = MA3.valsFrom(base, t.fn); fname = t.id === 'default' ? 'theme.xml' : `theme_${t.id}.xml`; name = t.name;
    } else if (q.get('theme')) {
      const r = await fetch('gallery/themes.json', {cache: 'no-cache'}); if (!r.ok) throw new Error('Could not load the community gallery.');
      const t = (await r.json()).find(x => x.id === q.get('theme')); if (!t) throw new Error('That community theme no longer exists.');
      vals = MA3.unpackCode(base, t.code); fname = `theme_${t.id}.xml`; name = t.name;
    } else { vals = MA3.unpackCode(base, q.get('code')); fname = 'theme_shared.xml'; name = 'The shared theme'; }
  } catch (err) { return err.message; }
  load(base.src); applyVals(vals, fname, name);
  return null;
}

const cmp = $('#btnCompare');
const showOrig = on => { paintDemo(on); cmp.textContent = on ? 'Showing original' : 'Hold to see original'; };
cmp.addEventListener('pointerdown', () => showOrig(true));
['pointerup','pointerleave','pointercancel','blur'].forEach(ev => cmp.addEventListener(ev, () => showOrig(false)));
cmp.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); showOrig(true); } });
cmp.addEventListener('keyup', () => showOrig(false));

$('#fileIn').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    const keep = SRC;
    try { load(String(r.result)); state.dim = 100; state.sat = 100; syncMasters(); $('#fname').value = f.name.replace(/\.xml$/i,'') + '_custom.xml'; paintDemo(); renderList(); persist(); say(`Loaded ${f.name}: ${defs.length} shared colours, ${elems.length} element colours.`); }
    catch (err) { load(keep); say(err.message + ' Kept the previous theme.'); }
    e.target.value = '';
  };
  r.readAsText(f);
});

$('#btnExport').addEventListener('click', () => {
  const box = $('#exportBox'); box.hidden = !box.hidden;
  if (!box.hidden) { $('#xmlOut').value = buildXml(); box.scrollIntoView({block:'nearest'}); }
});
$('#fname').addEventListener('input', () => { $('#xmlOut').value = buildXml(); });
$('#btnCopy').addEventListener('click', () => {
  const xml = buildXml(); const ta = $('#xmlOut'); ta.value = xml;
  const fallback = () => { ta.focus(); ta.select(); say('Copy was blocked here. The XML is selected: press Cmd+C (or Ctrl+C).'); };
  try { navigator.clipboard.writeText(xml.replace(/^﻿/,'')).then(() => say(`Copied. Paste it into a new file named ${$('#fname').value}.`), fallback); } catch { fallback(); }
});
function download(xml, fname) {
  const name = (fname.trim() || 'theme_custom.xml').replace(/(\.xml)?$/i, '.xml');
  const url = URL.createObjectURL(new Blob([xml], {type: 'application/xml'}));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000); say(`Downloaded ${name}. Put it in gma3_library/colorthemes and import it from the Color Theme menu.`);
}
$('#btnSave').addEventListener('click', () => download(buildXml(), $('#fname').value));

/* ---------- storage (per-viewer draft) ---------- */
const LS = 'ma3-theme-builder-v1';
let saveT;
function persist() { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(LS, JSON.stringify({vals: state.vals, dim: state.dim, sat: state.sat, src: SRC.length < 1500000 ? SRC : null, fname: $('#fname').value})); } catch {} }, 300); }

/* ---------- boot ---------- */
(async () => {
  try { const r = await fetch('theme.xml'); if (!r.ok) throw 0; load(await r.text()); base = model; }
  catch { say('Could not load the bundled theme.xml. Use Load theme.xml to open one, or serve this folder over http.'); return; }
  try {
    const s = JSON.parse(localStorage.getItem(LS) || 'null');
    if (s) { if (s.src) { try { load(s.src); } catch { load(base.src); } } state.vals = {}; for (const k in s.vals || {}) if (defMap[k]) state.vals[k] = s.vals[k]; state.dim = s.dim || 100; state.sat = s.sat || 100; if (s.fname) $('#fname').value = s.fname; }
  } catch {}
  const linkErr = await fromLink();
  if (linkErr === null) return;
  syncMasters(); paintDemo(); renderList();
  if (linkErr) { say(linkErr + ' Your own theme is still open.'); return; }
  say(`${defs.length} shared colours and ${elems.length} element colours loaded.` + (Object.keys(state.vals).length ? ` Your ${Object.keys(state.vals).length} earlier changes are restored.` : ''));
})();
})();
