/* Theme model, colour maths, gallery schemes and share codes.
   Shared by the editor (main.js), the gallery page (gallery.js) and the gallery Action (scripts/gallery-submission.cjs). */
(function (root) {
'use strict';

/* ---------- colour maths ---------- */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const hx = n => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0').toUpperCase();
function parse(h) { return {r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16), a: parseInt(h.slice(6,8),16)}; }
function rgb2hsv(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;let h=0;if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h/=6;if(h<0)h+=1;}return[h,mx?d/mx:0,mx];}
function hsv2rgb(h,s,v){const i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);const m=[[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]][((i%6)+6)%6];return m.map(x=>x*255);}
function mapHex(h, fn) { const c = parse(h); let [hh,s,v] = rgb2hsv(c.r,c.g,c.b); [s,v] = fn(s,v); const [r,g,b] = hsv2rgb(hh, clamp(s,0,1), clamp(v,0,1)); return hx(r)+hx(g)+hx(b)+h.slice(6,8).toUpperCase(); }
const nightFn = (s, v) => [v > 0.6 ? s*0.9 : s, v <= 0.3 ? v*0.6 : 0.18 + (v-0.3)*0.857];
const css = h => { const c = parse(h); return `rgba(${c.r},${c.g},${c.b},${(c.a/255).toFixed(3)})`; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- theme model ---------- */
function parseTheme(text) {
  const src = text.replace(/^﻿/, '');
  const split = src.indexOf('<ColorGroups>');
  if (!/<ColorTheme/.test(src) || split < 0) throw new Error('This file is not a grandMA3 colour theme (no ColorTheme / ColorGroups found).');
  const defs = [], elems = [], defMap = {}, usedBy = {};
  let g = '';
  src.slice(0, split).replace(/<ColorDefGroup Name="([^"]+)">|<ColorDef Name="([^"]+)"\s+RGBA="([0-9A-Fa-f]{8})"/g, (m, grp, n, rgba) => {
    if (grp) g = grp; else { const d = {g, n, key: g+'.'+n, orig: rgba.toUpperCase()}; defs.push(d); defMap[d.key] = d; }
    return m;
  });
  src.slice(split).replace(/<ColorGroup Name="([^"]+)">|<Color Name="([^"]+)"([^>]*?)\/>/g, (m, grp, n, attrs) => {
    if (grp) { g = grp; return m; }
    const ref = (attrs.match(/ColorDefRef="([^"]+)"/) || [])[1];
    const rgba = (attrs.match(/RGBA="([0-9A-Fa-f]{8})"/) || [])[1];
    if (ref && defMap[ref]) (usedBy[ref] = usedBy[ref] || []).push(g + ' › ' + n);
    else if (!ref && rgba) elems.push({g, n, key: 'el:'+g+'.'+n, orig: rgba.toUpperCase()});
    return m;
  });
  for (const d of elems) defMap[d.key] = d;
  return {src, defs, elems, all: [...defs, ...elems], defMap, usedBy};
}

// get(key) returns the RGBA hex to write for a shared colour or element colour.
function buildXml(model, get, fname) {
  const name = (fname.trim() || 'theme_custom.xml').replace(/[^\w.\- ]/g, '_');
  const {src, defMap} = model;
  const split = src.indexOf('<ColorGroups>');
  let g = '';
  const head = src.slice(0, split).replace(/<ColorDefGroup Name="([^"]+)">|(<ColorDef Name="([^"]+)"\s+RGBA=")([0-9A-Fa-f]{8})(")/g, (m, grp, pre, n, rgba, post) => {
    if (grp) { g = grp; return m; }
    return pre + get(g+'.'+n) + post;
  }).replace(/(<ColorTheme FileName=")[^"]*(")/, `$1${name}$2`);
  const tail = src.slice(split).replace(/<ColorGroup Name="([^"]+)">|<Color Name="([^"]+)"([^>]*?)\/>/g, (m, grp, n, attrs) => {
    if (grp) { g = grp; return m; }
    const ref = (attrs.match(/ColorDefRef="([^"]+)"/) || [])[1];
    const k = ref && defMap[ref] ? ref : (!ref ? 'el:'+g+'.'+n : null);
    if (!k || !defMap[k]) return m;
    return m.replace(/RGBA="[0-9A-Fa-f]{8}"/, `RGBA="${get(k)}"`);
  });
  return '﻿' + head + tail;
}

/* ---------- gallery schemes ---------- */
// Each scheme gives a neutral ramp (deepest background to text) plus its accent hues.
// Greys in the base theme move along the ramp by brightness; coloured entries take the
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
// Built-in gallery entries: fn(key, baseValue) gives that entry's colour.
const BUILTINS = [
  {id:'default', name:'MA default', note:'The bundled theme, unchanged', fn:(k, o) => o},
  {id:'night', name:'Night', note:'Default theme, darker and dimmer', fn:(k, o) => mapHex(o, nightFn)},
  ...SCHEMES.map(sc => ({id: sc.id, name: sc.name, note: sc.light ? 'Light editor scheme' : 'Dark editor scheme', fn: (k, o) => schemeHex(sc, k, o)}))
];
function valsFrom(model, fn) { const out = {}; for (const d of model.all) out[d.key] = fn(d.key, d.orig); return out; }

/* ---------- share codes ---------- */
// "MA3T1-" + base64url of: 2-byte fingerprint of the base theme's colour keys, then 4 RGBA bytes
// per colour in the base theme's order. Fits in a link (~2.4k characters).
const CODE_PREFIX = 'MA3T1-';
function fingerprint(model) {
  let h = 0x811c9dc5;
  for (const d of model.all) for (let i = 0; i < d.key.length; i++) { h ^= d.key.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h & 0xffff;
}
function toB64url(bytes) {
  let bin = ''; for (const b of bytes) bin += String.fromCharCode(b);
  const b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}
function packCode(model, get) {
  const bytes = new Uint8Array(2 + model.all.length * 4), fp = fingerprint(model);
  bytes[0] = fp >> 8; bytes[1] = fp & 0xff;
  model.all.forEach((d, i) => { const h = get(d.key); for (let j = 0; j < 4; j++) bytes[2 + i*4 + j] = parseInt(h.slice(j*2, j*2+2), 16); });
  return CODE_PREFIX + toB64url(bytes);
}
// Returns {key: RGBA hex} for every colour, or throws with a reason a person can act on.
function unpackCode(model, code) {
  code = String(code || '').replace(/\s+/g, '');
  if (!code.startsWith(CODE_PREFIX) || !/^[A-Za-z0-9_-]+$/.test(code.slice(CODE_PREFIX.length))) throw new Error('That is not a theme code. Codes start with ' + CODE_PREFIX);
  let bytes;
  try { bytes = fromB64url(code.slice(CODE_PREFIX.length)); } catch (e) { throw new Error('The theme code is damaged. Copy it again from the editor.'); }
  if (bytes.length !== 2 + model.all.length * 4) throw new Error('The theme code is incomplete or was made from a different base theme.');
  if (((bytes[0] << 8) | bytes[1]) !== fingerprint(model)) throw new Error('The theme code was made from a different base theme.');
  const out = {};
  model.all.forEach((d, i) => { let h = ''; for (let j = 0; j < 4; j++) h += hx(bytes[2 + i*4 + j]); out[d.key] = h; });
  return out;
}

const slug = s => String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'theme';

// Small preview of a theme, built from a value getter. Shared by the gallery page.
function previewHtml(get) {
  const g = k => css(get(k) || '00000000');
  return `<div class="gprev" style="background:${g('Global.BackgroundDark')}">
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
      </div>`;
}

const SUBMIT_URL = 'https://github.com/jaylenjinx/ma3-theme-builder/issues/new';
// Opens the "Submit a theme" issue form with the name and code filled in.
function submitUrl(name, code) {
  const q = new URLSearchParams({template: 'submit-theme.yml', title: 'Theme: ' + name, 'theme-name': name, code});
  return SUBMIT_URL + '?' + q.toString();
}

const API = {clamp, hx, parse, rgb2hsv, hsv2rgb, mapHex, nightFn, css, esc, parseTheme, buildXml, SCHEMES, schemeHex, BUILTINS, valsFrom,
  CODE_PREFIX, packCode, unpackCode, slug, previewHtml, submitUrl};
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.MA3 = API;
})(typeof self !== 'undefined' ? self : this);
