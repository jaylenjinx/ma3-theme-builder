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

/* ---------- colour maths ---------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const hx = n => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0').toUpperCase();
function parse(h) { return {r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16), a: parseInt(h.slice(6,8),16)}; }
function rgb2hsv(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h/=6;if(h<0)h+=1;}return[h,mx?d/mx:0,mx];}
function hsv2rgb(h,s,v){const i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);const m=[[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][((i%6)+6)%6];return m.map(x=>x*255);}
function mapHex(h, fn) { const c = parse(h); let [hh,s,v] = rgb2hsv(c.r,c.g,c.b); [s,v] = fn(s,v); const [r,g,b] = hsv2rgb(hh, clamp(s,0,1), clamp(v,0,1)); return hx(r)+hx(g)+hx(b)+h.slice(6,8).toUpperCase(); }
const nightFn = (s, v) => [v > 0.6 ? s*0.9 : s, v <= 0.3 ? v*0.6 : 0.18 + (v-0.3)*0.857];
function master(h) {
  if (state.dim === 100 && state.sat === 100) return h.toUpperCase();
  return mapHex(h, (s, v) => [s*state.sat/100, v*state.dim/100]);
}
const css = h => { const c = parse(h); return `rgba(${c.r},${c.g},${c.b},${(c.a/255).toFixed(3)})`; };

/* ---------- theme model ---------- */
let SRC = '', defs = [], defMap = {}, elems = [], usedBy = {};
const state = { vals: {}, dim: 100, sat: 100 };
function load(text) {
  SRC = text.replace(/^﻿/, '');
  const split = SRC.indexOf('<ColorGroups>');
  if (!/<ColorTheme/.test(SRC) || split < 0) throw new Error('This file is not a grandMA3 colour theme (no ColorTheme / ColorGroups found).');
  defs = []; defMap = {}; elems = []; usedBy = {};
  let g = '';
  SRC.slice(0, split).replace(/<ColorDefGroup Name="([^"]+)">|<ColorDef Name="([^"]+)"\s+RGBA="([0-9A-Fa-f]{8})"/g, (m, grp, n, rgba) => {
    if (grp) g = grp; else { const d = {g, n, key: g+'.'+n, orig: rgba.toUpperCase()}; defs.push(d); defMap[d.key] = d; }
    return m;
  });
  SRC.slice(split).replace(/<ColorGroup Name="([^"]+)">|<Color Name="([^"]+)"([^>]*?)\/>/g, (m, grp, n, attrs) => {
    if (grp) { g = grp; return m; }
    const ref = (attrs.match(/ColorDefRef="([^"]+)"/) || [])[1];
    const rgba = (attrs.match(/RGBA="([0-9A-Fa-f]{8})"/) || [])[1];
    if (ref && defMap[ref]) (usedBy[ref] = usedBy[ref] || []).push(g + ' › ' + n);
    else if (!ref && rgba) elems.push({g, n, key: 'el:'+g+'.'+n, orig: rgba.toUpperCase()});
    return m;
  });
  for (const d of [...defs, ...elems]) defMap[d.key] = d;
  state.vals = {};
}
const val = k => state.vals[k] || defMap[k].orig;

function buildXml(get = k => master(val(k)), fname = $('#fname').value) {
  const name = (fname.trim() || 'theme_custom.xml').replace(/[^\w.\- ]/g, '_');
  const split = SRC.indexOf('<ColorGroups>');
  let g = '';
  const head = SRC.slice(0, split).replace(/<ColorDefGroup Name="([^"]+)">|(<ColorDef Name="([^"]+)"\s+RGBA=")([0-9A-Fa-f]{8})(")/g, (m, grp, pre, n, rgba, post) => {
    if (grp) { g = grp; return m; }
    return pre + get(g+'.'+n) + post;
  }).replace(/(<ColorTheme FileName=")[^"]*(")/, `$1${name}$2`);
  const tail = SRC.slice(split).replace(/<ColorGroup Name="([^"]+)">|<Color Name="([^"]+)"([^>]*?)\/>/g, (m, grp, n, attrs) => {
    if (grp) { g = grp; return m; }
    const ref = (attrs.match(/ColorDefRef="([^"]+)"/) || [])[1];
    let k = ref && defMap[ref] ? ref : (!ref ? 'el:'+g+'.'+n : null);
    if (!k || !defMap[k]) return m;
    return m.replace(/RGBA="[0-9A-Fa-f]{8}"/, `RGBA="${get(k)}"`);
  });
  return '﻿' + head + tail;
}

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
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
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

/* ---------- gallery: editor colour schemes mapped onto the MA3 theme ---------- */
// Each scheme gives a neutral ramp (deepest background to text) plus its accent hues.
// Greys in the loaded theme move along the ramp by brightness; coloured entries take the
// scheme's colour of the nearest hue, blended toward the background as dark as the original was.
const SCHEMES = [
  {id:'dracula', name:'Dracula', ramp:['191A21','282A36','343746','44475A','6272A4','F8F8F2'], accent:'F1FA8C', red:'FF5555', orange:'FFB86C', yellow:'F1FA8C', green:'50FA7B', cyan:'8BE9FD', blue:'BD93F9', purple:'BD93F9', pink:'FF79C6'},
  {id:'one-dark', name:'One Dark', ramp:['1B1F24','282C34','2C313A','3E4451','5C6370','ABB2BF'], accent:'61AFEF', red:'E06C75', orange:'D19A66', yellow:'E5C07B', green:'98C379', cyan:'56B6C2', blue:'61AFEF', purple:'C678DD', pink:'C678DD'},
  {id:'monokai', name:'Monokai', ramp:['1E1F1C','272822','3E3D32','49483E','75715E','F8F8F2'], accent:'E6DB74', red:'F92672', orange:'FD971F', yellow:'E6DB74', green:'A6E22E', cyan:'66D9EF', blue:'66D9EF', purple:'AE81FF', pink:'F92672'},
  {id:'dark-plus', name:'VS Code Dark+', ramp:['181818','1E1E1E','252526','333333','858585','D4D4D4'], accent:'3794FF', red:'F44747', orange:'CE9178', yellow:'DCDCAA', green:'6A9955', cyan:'4EC9B0', blue:'569CD6', purple:'C586C0', pink:'C586C0'},
  {id:'github-dark', name:'GitHub Dark', ramp:['010409','0D1117','161B22','21262D','7D8590','E6EDF3'], accent:'58A6FF', red:'FF7B72', orange:'FFA657', yellow:'D29922', green:'3FB950', cyan:'39C5CF', blue:'58A6FF', purple:'D2A8FF', pink:'F778BA'},
  {id:'nord', name:'Nord', ramp:['242933','2E3440','3B4252','434C5E','616E88','ECEFF4'], accent:'88C0D0', red:'BF616A', orange:'D08770', yellow:'EBCB8B', green:'A3BE8C', cyan:'88C0D0', blue:'81A1C1', purple:'B48EAD', pink:'B48EAD'},
  {id:'gruvbox', name:'Gruvbox Dark', ramp:['1D2021','282828','3C3836','504945','928374','EBDBB2'], accent:'FABD2F', red:'FB4934', orange:'FE8019', yellow:'FABD2F', green:'B8BB26', cyan:'8EC07C', blue:'83A598', purple:'D3869B', pink:'D3869B'},
  {id:'solarized-dark', name:'Solarized Dark', ramp:['00212B','002B36','073642','0A4250','586E75','93A1A1'], accent:'B58900', red:'DC322F', orange:'CB4B16', yellow:'B58900', green:'859900', cyan:'2AA198', blue:'268BD2', purple:'6C71C4', pink:'D33682'},
  {id:'tokyo-night', name:'Tokyo Night', ramp:['16161E','1A1B26','24283B','292E42','565F89','C0CAF5'], accent:'7AA2F7', red:'F7768E', orange:'FF9E64', yellow:'E0AF68', green:'9ECE6A', cyan:'7DCFFF', blue:'7AA2F7', purple:'BB9AF7', pink:'BB9AF7'},
  {id:'catppuccin-mocha', name:'Catppuccin Mocha', ramp:['11111B','1E1E2E','313244','45475A','7F849C','CDD6F4'], accent:'CBA6F7', red:'F38BA8', orange:'FAB387', yellow:'F9E2AF', green:'A6E3A1', cyan:'94E2D5', blue:'89B4FA', purple:'CBA6F7', pink:'F5C2E7'},
  {id:'night-owl', name:'Night Owl', ramp:['010E1A','011627','0B2942','1D3B53','637777','D6DEEB'], accent:'7FDBCA', red:'EF5350', orange:'F78C6C', yellow:'ECC48D', green:'ADDB67', cyan:'7FDBCA', blue:'82AAFF', purple:'C792EA', pink:'C792EA'},
  {id:'ayu-mirage', name:'Ayu Mirage', ramp:['1A1F29','1F2430','242936','323A4C','707A8C','CCCAC2'], accent:'FFCC66', red:'F28779', orange:'FFAD66', yellow:'FFD173', green:'D5FF80', cyan:'95E6CB', blue:'73D0FF', purple:'DFBFFF', pink:'F29E74'},
  {id:'rose-pine', name:'Rosé Pine', ramp:['13111C','191724','1F1D2E','26233A','6E6A86','E0DEF4'], accent:'EBBCBA', red:'EB6F92', orange:'F6C177', yellow:'F6C177', green:'9CCFD8', cyan:'9CCFD8', blue:'31748F', purple:'C4A7E7', pink:'EBBCBA'},
  {id:'solarized-light', name:'Solarized Light', light:true, ramp:['EEE8D5','FDF6E3','EEE8D5','E4DDC8','93A1A1','586E75'], accent:'268BD2', red:'DC322F', orange:'CB4B16', yellow:'B58900', green:'859900', cyan:'2AA198', blue:'268BD2', purple:'6C71C4', pink:'D33682'},
  {id:'github-light', name:'GitHub Light', light:true, ramp:['F6F8FA','FFFFFF','F6F8FA','EAEEF2','6E7781','1F2328'], accent:'0969DA', red:'CF222E', orange:'BC4C00', yellow:'9A6700', green:'1A7F37', cyan:'1B7C83', blue:'0969DA', purple:'8250DF', pink:'BF3989'},
  {id:'catppuccin-latte', name:'Catppuccin Latte', light:true, ramp:['DCE0E8','EFF1F5','E6E9EF','CCD0DA','8C8FA1','4C4F69'], accent:'8839EF', red:'D20F39', orange:'FE640B', yellow:'DF8E1D', green:'40A02B', cyan:'179299', blue:'1E66F5', purple:'8839EF', pink:'EA76CB'}
];
const RAMP_AT = [0, 0.08, 0.17, 0.3, 0.55, 0.9];
const ACCENT_KEYS = new Set(['Global.Selected', 'Global.SelectedRowBorder', 'Global.ActiveIcon', 'Global.SelectedEdge']);
const rgbOf = h => [0,2,4].map(i => parseInt(h.slice(i, i+2), 16));
const mixRgb = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t);
function hueName(h) {
  const d = h * 360;
  return d < 15 || d >= 345 ? 'red' : d < 40 ? 'orange' : d < 70 ? 'yellow' : d < 165 ? 'green' : d < 195 ? 'cyan' : d < 255 ? 'blue' : d < 290 ? 'purple' : 'pink';
}
function schemeHex(sc, key, orig) {
  const c = parse(orig), [h, s, v] = rgb2hsv(c.r, c.g, c.b);
  let a = orig.slice(6, 8);
  // Half-transparent dark panels look muddy grey over the console's black desktop on a light scheme, so make them solid.
  if (sc.light && v < 0.3 && c.a >= 0x80 && !/Transparent|Shadow|Lasso|DeskLock|Overlay/.test(key)) a = 'FF';
  let rgb;
  if (ACCENT_KEYS.has(key)) rgb = rgbOf(sc.accent);
  else if (s < 0.2 || v < 0.08) {
    const ramp = sc.ramp.map(rgbOf);
    let i = 0; while (i < RAMP_AT.length - 2 && v > RAMP_AT[i+1]) i++;
    rgb = mixRgb(ramp[i], ramp[i+1], clamp((v - RAMP_AT[i]) / (RAMP_AT[i+1] - RAMP_AT[i]), 0, 1));
  } else rgb = mixRgb(rgbOf(sc.ramp[1]), rgbOf(sc[hueName(h)]), clamp(v * 1.15, 0, 1));
  return hx(rgb[0]) + hx(rgb[1]) + hx(rgb[2]) + a.toUpperCase();
}
const GALLERY = [
  {id:'loaded', name:'Loaded theme', note:'The theme you started from', fn:(k, o) => o},
  {id:'night', name:'Night', note:'Loaded theme, darker and dimmer', fn:(k, o) => mapHex(o, nightFn)},
  ...SCHEMES.map(sc => ({id: sc.id, name: sc.name, note: sc.light ? 'Light scheme' : 'Dark scheme', fn: (k, o) => schemeHex(sc, k, o)}))
];
function galleryVals(t) { const out = {}; for (const d of [...defs, ...elems]) out[d.key] = t.fn(d.key, d.orig); return out; }
function renderGallery() {
  const grid = $('#galleryGrid');
  grid.innerHTML = GALLERY.map(t => {
    const g = k => css(defMap[k] ? t.fn(k, defMap[k].orig) : '00000000');
    return `<article class="gcard" data-id="${t.id}">
      <div class="gprev" style="background:${g('Global.BackgroundDark')}">
        <div class="gwin" style="background:${g('Global.Background')};border-color:${g('Global.IndicatorBar')}">
          <div class="gtiles">
            <span class="gpt" style="background:${g('PoolDefault.Group')};color:${g('Global.Text')};font-weight:bold">Groups</span>
            <span style="background:${g('Global.ButtonBackground')};color:${g('Global.Text')}">Spots</span>
            <span style="background:${g('Global.ButtonBackground')};color:${g('Global.Selected')};box-shadow:inset 0 0 0 1px ${g('Global.Selected')}">Wash</span>
            <span style="background:${g('Global.Background')};color:${g('Global.TextDefault')}">4</span>
            <span class="gpt" style="background:${g('PoolDefault.PresetColor')};color:${g('Global.Text')};font-weight:bold">Color</span>
            <span style="background:${g('Global.ButtonBackground')};color:${g('Global.SelectivePreset')};text-align:right">S</span>
            <span style="background:${g('PoolDefault.Sequence')};color:${g('Global.TextDark')}">Look</span>
            <span style="background:${g('Playback.ActiveCue')};color:${g('Global.Text')}">Cue 2</span>
          </div>
          <div class="grow"><i style="background:${g('SheetColor.Absolute')};color:${g('SheetColor.AbsoluteText')}">100</i><i style="background:${g('SheetColor.Fade')};color:${g('SheetColor.FadeText')}">2s</i><i style="background:${g('SheetColor.Phaser')};color:${g('SheetColor.PhaserText')}">Sine</i><i style="background:${g('Global.DefaultCellBackground')};color:${g('Global.TextDefault')}">0</i></div>
          <div class="gfader" style="background:${g('Playback.FaderBarBack')}"><b style="background:${g('Playback.FaderBar')}"></b></div>
        </div>
      </div>
      <div class="gmeta"><div><h3>${esc(t.name)}</h3><p>${esc(t.note)}</p></div>
        <div class="gbtns"><button class="btn primary" type="button" data-act="use">Edit</button><button class="btn" type="button" data-act="dl" aria-label="Download ${esc(t.name)} as XML">.xml</button></div></div>
    </article>`;
  }).join('');
}
$('#galleryGrid').addEventListener('click', e => {
  const b = e.target.closest('button[data-act]'); if (!b) return;
  const t = GALLERY.find(x => x.id === b.closest('.gcard').dataset.id);
  const vals = galleryVals(t), fname = t.id === 'loaded' ? 'theme.xml' : `theme_${t.id}.xml`;
  if (b.dataset.act === 'dl') { download(buildXml(k => vals[k], fname), fname); return; }
  state.vals = {}; for (const k in vals) if (vals[k] !== defMap[k].orig) state.vals[k] = vals[k];
  state.dim = 100; state.sat = 100; $('#fname').value = fname;
  syncMasters(); paintDemo(); renderList(); persist();
  if (!$('#exportBox').hidden) $('#xmlOut').value = buildXml();
  say(`${t.name} is loaded into the editor. Fine-tune any colour below, then Export.`);
  $('.grid').scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
});

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
    try { load(String(r.result)); state.dim = 100; state.sat = 100; syncMasters(); $('#fname').value = f.name.replace(/\.xml$/i,'') + '_custom.xml'; paintDemo(); renderList(); renderGallery(); persist(); say(`Loaded ${f.name}: ${defs.length} shared colours, ${elems.length} element colours.`); }
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
  let base = '';
  try { const r = await fetch('theme.xml'); if (!r.ok) throw 0; base = await r.text(); load(base); }
  catch { say('Could not load the bundled theme.xml. Use Load theme.xml to open one, or serve this folder over http.'); return; }
  try {
    const s = JSON.parse(localStorage.getItem(LS) || 'null');
    if (s) { if (s.src) { try { load(s.src); } catch { load(base); } } state.vals = {}; for (const k in s.vals || {}) if (defMap[k]) state.vals[k] = s.vals[k]; state.dim = s.dim || 100; state.sat = s.sat || 100; if (s.fname) $('#fname').value = s.fname; }
  } catch {}
  syncMasters(); paintDemo(); renderList(); renderGallery();
  say(`${defs.length} shared colours and ${elems.length} element colours loaded.` + (Object.keys(state.vals).length ? ` Your ${Object.keys(state.vals).length} earlier changes are restored.` : ''));
})();
})();
