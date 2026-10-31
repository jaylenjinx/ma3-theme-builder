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
// links: every element colour (ColorGroups > Color) in file order, with the shared colour it uses
// (ref) or null for its own colour. A name used twice in one group gets a "#2" key.
function eachColor(text, fn) {
  let g = '', seen = {};
  return text.replace(/<ColorGroup Name="([^"]+)">|<Color Name="([^"]+)"([^>]*?)\/>/g, (m, grp, n, attrs) => {
    if (grp) { g = grp; return m; }
    let key = 'el:' + g + '.' + n;
    seen[key] = (seen[key] || 0) + 1; if (seen[key] > 1) key += '#' + seen[key];
    return fn(m, {g, n, key, attrs}) ?? m;
  });
}
function parseTheme(text) {
  const src = text.replace(/^﻿/, '');
  const split = src.indexOf('<ColorGroups>');
  if (!/<ColorTheme/.test(src) || split < 0) throw new Error('This file is not a grandMA3 colour theme (no ColorTheme / ColorGroups found).');
  const defs = [], elems = [], links = [], defMap = {}, linkMap = {}, usedBy = {}, refs = {};
  let g = '';
  src.slice(0, split).replace(/<ColorDefGroup Name="([^"]+)">|<ColorDef Name="([^"]+)"\s+RGBA="([0-9A-Fa-f]{8})"/g, (m, grp, n, rgba) => {
    if (grp) g = grp; else { const d = {g, n, key: g+'.'+n, orig: rgba.toUpperCase()}; defs.push(d); defMap[d.key] = d; }
    return m;
  });
  eachColor(src.slice(split), (m, {g, n, key, attrs}) => {
    const ref = (attrs.match(/ColorDefRef="([^"]+)"/) || [])[1];
    const rgba = ((attrs.match(/RGBA="([0-9A-Fa-f]{8})"/) || [])[1] || '').toUpperCase();
    if (ref) refs[key] = ref;
    const l = {g, n, key, ref: ref && defMap[ref] ? ref : null, orig: rgba || null, fixed: !!ref && !defMap[ref]};
    links.push(l); linkMap[key] = l;
    if (l.ref) (usedBy[ref] = usedBy[ref] || []).push(g + ' › ' + n);
    else if (!ref && rgba) elems.push({g, n, key, orig: rgba});
  });
  for (const d of elems) defMap[d.key] = d;
  return {src, defs, elems, all: [...defs, ...elems], links, linkMap, defMap, usedBy, refs};
}

// get(key) returns the RGBA hex to write for a shared colour or an element's own colour.
// links (optional) maps element keys to a new shared colour key, or '' for the element's own colour.
function buildXml(model, get, fname, links = {}) {
  const name = (fname.trim() || 'theme_custom.xml').replace(/[^\w.\- ]/g, '_');
  const {src, defMap, linkMap} = model;
  const split = src.indexOf('<ColorGroups>');
  let g = '';
  const head = src.slice(0, split).replace(/<ColorDefGroup Name="([^"]+)">|(<ColorDef Name="([^"]+)"\s+RGBA=")([0-9A-Fa-f]{8})(")/g, (m, grp, pre, n, rgba, post) => {
    if (grp) { g = grp; return m; }
    return pre + get(g+'.'+n) + post;
  }).replace(/(<ColorTheme FileName=")[^"]*(")/, `$1${name}$2`);
  const tail = eachColor(src.slice(split), (m, {key}) => {
    const l = linkMap[key]; if (!l || l.fixed) return m;
    const ref = key in links && (links[key] === '' || defMap[links[key]]) ? links[key] : l.ref;
    if (ref === l.ref) {
      if (ref) return m.replace(/RGBA="[0-9A-Fa-f]{8}"/, `RGBA="${get(ref)}"`);
      return l.orig ? m.replace(/RGBA="[0-9A-Fa-f]{8}"/, `RGBA="${get(key)}"`) : m;
    }
    // Relinked: rewrite the attributes, keeping the file's column padding.
    return m.replace(/(<Color Name="[^"]+"\s*)[^]*?\/>/, (x, pre) => pre + (ref ? `ColorDefRef="${ref}" RGBA="${get(ref)}"` : `RGBA="${get(key)}"`) + '/>');
  });
  return '﻿' + head + tail;
}

/* ---------- gallery schemes ---------- */
// Each scheme gives a neutral ramp (deepest background to text) plus its accent hues.
// Greys in the base theme move along the ramp by brightness; coloured entries take the
// scheme's colour of the nearest hue, blended toward the background as dark as the original was.
const SCHEMES = [
  {set:'editor', id:'dracula', name:'Dracula', ramp:['191A21','282A36','343746','44475A','6272A4','F8F8F2'], accent:'F1FA8C', red:'FF5555', orange:'FFB86C', yellow:'F1FA8C', green:'50FA7B', cyan:'8BE9FD', blue:'BD93F9', purple:'BD93F9', pink:'FF79C6'},
  {set:'editor', id:'one-dark', name:'One Dark', ramp:['1B1F24','282C34','2C313A','3E4451','5C6370','ABB2BF'], accent:'61AFEF', red:'E06C75', orange:'D19A66', yellow:'E5C07B', green:'98C379', cyan:'56B6C2', blue:'61AFEF', purple:'C678DD', pink:'C678DD'},
  {set:'editor', id:'monokai', name:'Monokai', ramp:['1E1F1C','272822','3E3D32','49483E','75715E','F8F8F2'], accent:'E6DB74', red:'F92672', orange:'FD971F', yellow:'E6DB74', green:'A6E22E', cyan:'66D9EF', blue:'66D9EF', purple:'AE81FF', pink:'F92672'},
  {set:'editor', id:'dark-plus', name:'VS Code Dark+', ramp:['181818','1E1E1E','252526','333333','858585','D4D4D4'], accent:'3794FF', red:'F44747', orange:'CE9178', yellow:'DCDCAA', green:'6A9955', cyan:'4EC9B0', blue:'569CD6', purple:'C586C0', pink:'C586C0'},
  {set:'editor', id:'github-dark', name:'GitHub Dark', ramp:['010409','0D1117','161B22','21262D','7D8590','E6EDF3'], accent:'58A6FF', red:'FF7B72', orange:'FFA657', yellow:'D29922', green:'3FB950', cyan:'39C5CF', blue:'58A6FF', purple:'D2A8FF', pink:'F778BA'},
  {set:'editor', id:'nord', name:'Nord', ramp:['242933','2E3440','3B4252','434C5E','616E88','ECEFF4'], accent:'88C0D0', red:'BF616A', orange:'D08770', yellow:'EBCB8B', green:'A3BE8C', cyan:'88C0D0', blue:'81A1C1', purple:'B48EAD', pink:'B48EAD'},
  {set:'editor', id:'gruvbox', name:'Gruvbox Dark', ramp:['1D2021','282828','3C3836','504945','928374','EBDBB2'], accent:'FABD2F', red:'FB4934', orange:'FE8019', yellow:'FABD2F', green:'B8BB26', cyan:'8EC07C', blue:'83A598', purple:'D3869B', pink:'D3869B'},
  {set:'editor', id:'solarized-dark', name:'Solarized Dark', ramp:['00212B','002B36','073642','0A4250','586E75','93A1A1'], accent:'B58900', red:'DC322F', orange:'CB4B16', yellow:'B58900', green:'859900', cyan:'2AA198', blue:'268BD2', purple:'6C71C4', pink:'D33682'},
  {set:'editor', id:'tokyo-night', name:'Tokyo Night', ramp:['16161E','1A1B26','24283B','292E42','565F89','C0CAF5'], accent:'7AA2F7', red:'F7768E', orange:'FF9E64', yellow:'E0AF68', green:'9ECE6A', cyan:'7DCFFF', blue:'7AA2F7', purple:'BB9AF7', pink:'BB9AF7'},
  {set:'editor', id:'catppuccin-mocha', name:'Catppuccin Mocha', ramp:['11111B','1E1E2E','313244','45475A','7F849C','CDD6F4'], accent:'CBA6F7', red:'F38BA8', orange:'FAB387', yellow:'F9E2AF', green:'A6E3A1', cyan:'94E2D5', blue:'89B4FA', purple:'CBA6F7', pink:'F5C2E7'},
  {set:'editor', id:'night-owl', name:'Night Owl', ramp:['010E1A','011627','0B2942','1D3B53','637777','D6DEEB'], accent:'7FDBCA', red:'EF5350', orange:'F78C6C', yellow:'ECC48D', green:'ADDB67', cyan:'7FDBCA', blue:'82AAFF', purple:'C792EA', pink:'C792EA'},
  {set:'editor', id:'ayu-mirage', name:'Ayu Mirage', ramp:['1A1F29','1F2430','242936','323A4C','707A8C','CCCAC2'], accent:'FFCC66', red:'F28779', orange:'FFAD66', yellow:'FFD173', green:'D5FF80', cyan:'95E6CB', blue:'73D0FF', purple:'DFBFFF', pink:'F29E74'},
  {set:'editor', id:'rose-pine', name:'Rosé Pine', ramp:['13111C','191724','1F1D2E','26233A','6E6A86','E0DEF4'], accent:'EBBCBA', red:'EB6F92', orange:'F6C177', yellow:'F6C177', green:'9CCFD8', cyan:'9CCFD8', blue:'31748F', purple:'C4A7E7', pink:'EBBCBA'},
  {set:'editor', id:'solarized-light', name:'Solarized Light', light:true, ramp:['EEE8D5','FDF6E3','EEE8D5','E4DDC8','93A1A1','586E75'], accent:'268BD2', red:'DC322F', orange:'CB4B16', yellow:'B58900', green:'859900', cyan:'2AA198', blue:'268BD2', purple:'6C71C4', pink:'D33682'},
  {set:'editor', id:'github-light', name:'GitHub Light', light:true, ramp:['F6F8FA','FFFFFF','F6F8FA','EAEEF2','6E7781','1F2328'], accent:'0969DA', red:'CF222E', orange:'BC4C00', yellow:'9A6700', green:'1A7F37', cyan:'1B7C83', blue:'0969DA', purple:'8250DF', pink:'BF3989'},
  {set:'editor', id:'catppuccin-latte', name:'Catppuccin Latte', light:true, ramp:['DCE0E8','EFF1F5','E6E9EF','CCD0DA','8C8FA1','4C4F69'], accent:'8839EF', red:'D20F39', orange:'FE640B', yellow:'DF8E1D', green:'40A02B', cyan:'179299', blue:'1E66F5', purple:'8839EF', pink:'EA76CB'},
  {id:'everforest', name:'Everforest', set:'editor', ramp:['232A2E','2D353B','343F44','3D484D','859289','D3C6AA'], accent:'A7C080', red:'E67E80', orange:'E69875', yellow:'DBBC7F', green:'A7C080', cyan:'83C092', blue:'7FBBB3', purple:'D699B6', pink:'D699B6'},
  {id:'kanagawa', name:'Kanagawa', set:'editor', ramp:['16161D','1F1F28','2A2A37','363646','727169','DCD7BA'], accent:'7E9CD8', red:'E46876', orange:'FFA066', yellow:'E6C384', green:'98BB6C', cyan:'7AA89F', blue:'7E9CD8', purple:'957FB8', pink:'D27E99'},
  {id:'palenight', name:'Material Palenight', set:'editor', ramp:['1B1E2B','292D3E','32374D','444267','676E95','A6ACCD'], accent:'C792EA', red:'F07178', orange:'F78C6C', yellow:'FFCB6B', green:'C3E88D', cyan:'89DDFF', blue:'82AAFF', purple:'C792EA', pink:'FF5370'},
  {id:'material-ocean', name:'Material Ocean', set:'editor', ramp:['090B10','0F111A','1A1C25','232637','464B5D','8F93A2'], accent:'84FFFF', red:'F07178', orange:'F78C6C', yellow:'FFCB6B', green:'C3E88D', cyan:'89DDFF', blue:'82AAFF', purple:'C792EA', pink:'FF5370'},
  {id:'synthwave', name:'SynthWave \'84', set:'editor', ramp:['171520','262335','2A2139','34294F','848BBD','FFFFFF'], accent:'FF7EDB', red:'FE4450', orange:'FF8B39', yellow:'FEDE5D', green:'72F1B8', cyan:'36F9F6', blue:'2EE2FA', purple:'B893CE', pink:'FF7EDB'},
  {id:'cobalt2', name:'Cobalt2', set:'editor', ramp:['15232D','193549','1F4662','234E6D','0088FF','FFFFFF'], accent:'FFC600', red:'FF628C', orange:'FF9D00', yellow:'FFC600', green:'3AD900', cyan:'80FCFF', blue:'0088FF', purple:'FB94FF', pink:'FF628C'},
  {id:'horizon', name:'Horizon', set:'editor', ramp:['16161C','1C1E26','232530','2E303E','6C6F93','D5D8DA'], accent:'E95678', red:'E95678', orange:'FAB795', yellow:'FAC29A', green:'29D398', cyan:'59E1E3', blue:'26BBD9', purple:'EE64AC', pink:'F09383'},
  {id:'poimandres', name:'Poimandres', set:'editor', ramp:['171922','1B1E28','252B37','303340','767C9D','E4F0FB'], accent:'5DE4C7', red:'D0679D', orange:'F087BD', yellow:'FFFAC2', green:'5DE4C7', cyan:'89DDFF', blue:'ADD7FF', purple:'A6ACCD', pink:'FCC5E9'},
  {id:'oxocarbon', name:'Oxocarbon', set:'editor', ramp:['0B0B0B','161616','262626','393939','6F6F6F','F2F4F8'], accent:'78A9FF', red:'EE5396', orange:'FF832B', yellow:'FAD565', green:'42BE65', cyan:'3DDBD9', blue:'78A9FF', purple:'BE95FF', pink:'FF7EB6'},
  {id:'tomorrow-night', name:'Tomorrow Night', set:'editor', ramp:['161719','1D1F21','282A2E','373B41','969896','C5C8C6'], accent:'81A2BE', red:'CC6666', orange:'DE935F', yellow:'F0C674', green:'B5BD68', cyan:'8ABEB7', blue:'81A2BE', purple:'B294BB', pink:'B294BB'},
  {id:'zenburn', name:'Zenburn', set:'editor', ramp:['2B2B2B','3F3F3F','4F4F4F','5F5F5F','7F9F7F','DCDCCC'], accent:'F0DFAF', red:'CC9393', orange:'DFAF8F', yellow:'F0DFAF', green:'7F9F7F', cyan:'93E0E3', blue:'8CD0D3', purple:'DC8CC3', pink:'DC8CC3'},
  {id:'iceberg', name:'Iceberg', set:'editor', ramp:['0F1117','161821','1E2132','2E313F','6B7089','C6C8D1'], accent:'84A0C6', red:'E27878', orange:'E2A478', yellow:'E2A478', green:'B4BE82', cyan:'89B8C2', blue:'84A0C6', purple:'A093C7', pink:'A093C7'},
  {id:'moonlight', name:'Moonlight', set:'editor', ramp:['191A2A','222436','2F334D','3B3F5C','7A88CF','C8D3F5'], accent:'82AAFF', red:'FF757F', orange:'FF966C', yellow:'FFC777', green:'C3E88D', cyan:'86E1FC', blue:'82AAFF', purple:'C099FF', pink:'FCA7EA'},
  {id:'nightfox', name:'Nightfox', set:'editor', ramp:['131A24','192330','212E3F','29394F','738091','CDCECF'], accent:'719CD6', red:'C94F6D', orange:'F4A261', yellow:'DBC074', green:'81B29A', cyan:'63CDCF', blue:'719CD6', purple:'9D79D6', pink:'D67AD2'},
  {id:'vesper', name:'Vesper', set:'editor', ramp:['0B0B0B','101010','1C1C1C','232323','505050','FFFFFF'], accent:'FFC799', red:'FF8080', orange:'FFC799', yellow:'FFC799', green:'99FFE4', cyan:'99FFE4', blue:'99D1FF', purple:'C9A0FF', pink:'FF99C9'},
  {id:'ayu-dark', name:'Ayu Dark', set:'editor', ramp:['05070A','0B0E14','11151C','1E232B','565B66','BFBDB6'], accent:'E6B450', red:'F07178', orange:'FF8F40', yellow:'E6B450', green:'AAD94C', cyan:'95E6CB', blue:'59C2FF', purple:'D2A6FF', pink:'F29668'},
  {id:'one-light', name:'One Light', set:'editor', light:true, ramp:['E5E5E6','FAFAFA','F0F0F1','DBDBDC','A0A1A7','383A42'], accent:'4078F2', red:'E45649', orange:'B76B01', yellow:'C18401', green:'50A14F', cyan:'0184BC', blue:'4078F2', purple:'A626A4', pink:'A626A4'},
  {id:'rose-pine-dawn', name:'Rosé Pine Dawn', set:'editor', light:true, ramp:['F2E9E1','FAF4ED','FFFAF3','DFDAD9','9893A5','575279'], accent:'D7827E', red:'B4637A', orange:'EA9D34', yellow:'EA9D34', green:'56949F', cyan:'56949F', blue:'286983', purple:'907AA9', pink:'D7827E'},
  {id:'gruvbox-light', name:'Gruvbox Light', set:'editor', light:true, ramp:['EBDBB2','FBF1C7','F2E5BC','D5C4A1','928374','3C3836'], accent:'B57614', red:'9D0006', orange:'AF3A03', yellow:'B57614', green:'79740E', cyan:'427B58', blue:'076678', purple:'8F3F71', pink:'8F3F71'},
  {id:'everforest-light', name:'Everforest Light', set:'editor', light:true, ramp:['EFEBD4','FDF6E3','F4F0D9','E6E2CC','939F91','5C6A72'], accent:'8DA101', red:'F85552', orange:'F57D26', yellow:'DFA000', green:'8DA101', cyan:'35A77C', blue:'3A94C5', purple:'DF69BA', pink:'DF69BA'},
  {id:'tokyo-day', name:'Tokyo Day', set:'editor', light:true, ramp:['D0D5E3','E1E2E7','D5D6DB','C4C8DA','8990B3','3760BF'], accent:'2E7DE9', red:'F52A65', orange:'B15C00', yellow:'8C6C3E', green:'587539', cyan:'007197', blue:'2E7DE9', purple:'9854F1', pink:'9854F1'},
  {id:'ember', name:'Ember', set:'palette', ramp:['120C0A','1A1210','241915','33241D','8A6F60','F2E3D5'], accent:'FF8A3D', red:'FF5A4E', orange:'FF8A3D', yellow:'FFC857', green:'9BC46D', cyan:'6CC3B8', blue:'6FA3D9', purple:'C08AD9', pink:'FF7FA8'},
  {id:'tungsten', name:'Tungsten', set:'palette', ramp:['120D07','1A130B','23190F','302215','8C7350','FFE7C2'], accent:'FFB45C', red:'FF6A45', orange:'FFB45C', yellow:'FFD68A', green:'B8C46A', cyan:'8EC2A8', blue:'8FA8C8', purple:'B898C0', pink:'E8A0A0'},
  {id:'amber-mono', name:'Amber Mono', set:'palette', ramp:['0D0A04','140F06','1C1509','271D0D','8A6A2E','FFC766'], accent:'FFB000', red:'FF7A3D', orange:'FFB000', yellow:'FFC766', green:'D9B44A', cyan:'C9A15A', blue:'B88F4F', purple:'C2884E', pink:'E09060'},
  {id:'red-night', name:'Red Night', set:'palette', ramp:['0A0000','120202','1A0404','260707','7A2222','FF5A5A'], accent:'FF2A2A', red:'FF3B3B', orange:'FF5533', yellow:'FF7A5C', green:'C24848', cyan:'B04040', blue:'A03838', purple:'B83A4A', pink:'E0485A'},
  {id:'sunset', name:'Sunset', set:'palette', ramp:['140C14','1E121C','281824','36202F','8E6A80','F5E1E8'], accent:'FF9E6B', red:'FF5E7A', orange:'FF9E6B', yellow:'FFD07A', green:'9FD08A', cyan:'7ACFC8', blue:'7FA7E8', purple:'C08BE8', pink:'FF7AB6'},
  {id:'sandstone', name:'Sandstone', set:'palette', ramp:['17130F','201B16','2A231C','372E25','948572','EDE3D3'], accent:'D9A066', red:'D46A5A', orange:'D9894F', yellow:'D9B866', green:'9DB073', cyan:'7FB0A4', blue:'7F9FBF', purple:'A88CB0', pink:'C98C9F'},
  {id:'forest', name:'Forest', set:'palette', ramp:['0C120D','121A13','19231A','233024','6F806F','DDE6D5'], accent:'A3D977', red:'E0705C', orange:'E59A57', yellow:'E2C76A', green:'A3D977', cyan:'6CC2A6', blue:'6FA8C9', purple:'A88FC9', pink:'D58FB0'},
  {id:'mint', name:'Mint', set:'palette', ramp:['0B1312','111B1A','172422','203230','6A8A85','DDF2EE'], accent:'5EEAD4', red:'F87171', orange:'FB923C', yellow:'FACC15', green:'4ADE80', cyan:'5EEAD4', blue:'60A5FA', purple:'A78BFA', pink:'F472B6'},
  {id:'glacier', name:'Glacier', set:'palette', ramp:['0A1016','0F1720','15202B','1E2B38','6D8597','E3EEF5'], accent:'7FD4FF', red:'FF6B7A', orange:'FFA866', yellow:'F4E08A', green:'7FE0B0', cyan:'7FD4FF', blue:'6FA8FF', purple:'A99BFF', pink:'E59BD8'},
  {id:'deep-ocean', name:'Deep Ocean', set:'palette', ramp:['050B14','0A1420','0F1C2D','16283D','5B7491','D6E4F2'], accent:'2EC4E6', red:'F2637E', orange:'F59E62', yellow:'F2D36B', green:'4FD1A1', cyan:'2EC4E6', blue:'4D8DF7', purple:'8E7CF2', pink:'E07CC4'},
  {id:'congo-blue', name:'Congo Blue', set:'palette', ramp:['06041A','0B0826','110D33','1A1545','5E5791','DCD8FF'], accent:'6A5CFF', red:'FF4F7B', orange:'FF8F5A', yellow:'FFD35A', green:'5AE0A0', cyan:'4FD8F0', blue:'6A5CFF', purple:'A35CFF', pink:'E05CE0'},
  {id:'lavender', name:'Lavender', set:'palette', ramp:['110F17','18151F','201C29','2B2636','7F7896','E8E3F5'], accent:'B79CFF', red:'F28B9C', orange:'F5B38A', yellow:'EDD99A', green:'A6D9A6', cyan:'92D5D9', blue:'94B4F2', purple:'B79CFF', pink:'EFA3D6'},
  {id:'neon', name:'Neon', set:'palette', ramp:['07060B','0D0B14','15121F','201B2E','6E6890','EDEAFF'], accent:'00F0FF', red:'FF2E63', orange:'FF8A00', yellow:'F7FF00', green:'39FF14', cyan:'00F0FF', blue:'2979FF', purple:'B026FF', pink:'FF2BD6'},
  {id:'slate', name:'Slate', set:'palette', ramp:['0E1013','15181C','1C2026','262B33','7A8391','E6E9EE'], accent:'4C9AFF', red:'F2545B', orange:'F79A3E', yellow:'F2CC3D', green:'3DCC85', cyan:'3DC7D9', blue:'4C9AFF', purple:'9B7BFF', pink:'E86BB8'},
  {id:'high-contrast', name:'High Contrast', set:'palette', ramp:['000000','000000','0A0A0A','1F1F1F','A0A0A0','FFFFFF'], accent:'FFFF00', red:'FF3030', orange:'FF9900', yellow:'FFFF00', green:'00FF66', cyan:'00FFFF', blue:'3399FF', purple:'CC66FF', pink:'FF66CC'},
  {id:'paper', name:'Paper', set:'palette', light:true, ramp:['E8E6E1','F7F6F3','EFEDE8','DEDBD3','8E8A80','2B2A27'], accent:'D9480F', red:'C92A2A', orange:'D9480F', yellow:'B08800', green:'2B8A3E', cyan:'0B7285', blue:'1864AB', purple:'6741D9', pink:'A61E4D'},
  {id:'daylight-blue', name:'Daylight Blue', set:'palette', light:true, ramp:['DCE6F0','F2F6FA','E6EDF4','CFDAE6','7D8FA3','1F2D3D'], accent:'0066CC', red:'D0312D', orange:'D9730D', yellow:'B58900', green:'2F8F46', cyan:'0E8A99', blue:'0066CC', purple:'7048E8', pink:'C2255C'}
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
// OLED: every dark grey goes pure black so the panel's pixels switch off. A few state greys
// (hover, pressed, selected, focus) stay just above black so they still read. Sheet cells keep
// their meaning in their coloured text on a black cell; other coloured fills become deep tints;
// bright colours (text, selection, indicators) stay as they are. Alpha never changes.
const OLED_KEEP = /^(Global\.(Hover|Pressed|BackgroundSelected|PropertyBackgroundActive|SelectedCellBackground|WindowFocus|IndicatorBar|TitleGray|BackgroundOtherProgrammer)|el:.*\.(Hover|Pressed|Focus|Selected\w*Background)$)/;
function oledHex(key, orig, has) {
  const c = parse(orig), [h, s, v] = rgb2hsv(c.r, c.g, c.b), a = orig.slice(6, 8).toUpperCase();
  if (s < 0.2) {
    if (v >= 0.45) return orig.toUpperCase();
    return (OLED_KEEP.test(key) ? '1C1C1C' : '000000') + a;
  }
  if (v >= 0.7) return orig.toUpperCase();
  if (/^SheetColor\./.test(key) && has(key + 'Text')) return '000000' + a;
  const [r, g, b] = hsv2rgb(h, s, v * 0.4);
  return hx(r) + hx(g) + hx(b) + a;
}

// Built-in gallery entries: fn(key, baseValue) gives that entry's colour.
const BUILTINS = [
  {id:'default', group:'MA', name:'MA default', note:'The bundled theme, unchanged', fn:(k, o) => o},
  {id:'night', group:'MA', name:'Night', note:'Default theme, darker and dimmer', fn:(k, o) => mapHex(o, nightFn)},
  // MA's own themes, shipped as files. Edit maps them onto the base theme; .xml downloads the file as it is.
  {id:'legacy', group:'MA', name:'MA Legacy', note:'grandMA3 default_legacy theme', file:'themes/default_legacy.xml'},
  {id:'daylight', group:'MA', name:'MA Daylight', note:'grandMA3 default_daylight theme', file:'themes/default_daylight.xml'},
  ...SCHEMES.map(sc => ({id: sc.id, group: sc.set, name: sc.name,
    note: (sc.light ? 'Light ' : 'Dark ') + (sc.set === 'palette' ? 'palette' : 'editor scheme'), fn: (k, o) => schemeHex(sc, k, o)})),
  {id:'oled', group:'palette', name:'OLED Black', note:'Pure black everywhere it can be, for OLED screens', fn:(k, o, model) => oledHex(k, o, x => !!(model && model.defMap[x]))}
];
const GROUPS = {MA: 'MA themes', editor: 'Code editor schemes', palette: 'Palettes'};
function valsFrom(model, fn) { const out = {}; for (const d of model.all) out[d.key] = fn(d.key, d.orig, model); return out; }
// Another theme file on the base theme's keys: {vals, links}. Elements take the other file's link
// to a shared colour (or its own colour); anything the other file doesn't set keeps the base colour.
function fromTheme(model, other) {
  const shared = k => other.defMap[k] && !k.startsWith('el:') ? other.defMap[k].orig : null;
  const vals = valsFrom(model, (k, o) => {
    if (!k.startsWith('el:')) return shared(k) || o;
    return (other.defMap[k] && other.defMap[k].orig) || (other.refs[k] && shared(other.refs[k])) || o;
  });
  const links = {};
  for (const l of model.links) {
    const ol = other.linkMap[l.key]; if (!ol || l.fixed || ol.fixed) continue;
    if (ol.ref && ol.ref !== l.ref && model.defMap[ol.ref]) links[l.key] = ol.ref;
    else if (!ol.ref && l.ref && ol.orig) { links[l.key] = ''; vals[l.key] = ol.orig; }
  }
  return {vals, links};
}

/* ---------- share codes ---------- */
// "MA3T1-" + base64url of: 2-byte fingerprint of the base theme's colour keys, then 4 RGBA bytes
// per colour in the base theme's order. Fits in a link (~2.4k characters).
// "MA3T2-" adds relinked elements after that: a 2-byte count, then per element its 2-byte index in
// the base theme's element list, the 2-byte index of its new shared colour (FFFF = own colour) and,
// for an own colour, its 4 RGBA bytes.
const CODE_PREFIX = 'MA3T1-', CODE_PREFIX2 = 'MA3T2-';
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
// links: {elementKey: sharedKey or ''} for elements whose shared colour changed; get also answers
// for an element's own colour.
function packCode(model, get, links = {}) {
  const defIdx = {}; model.defs.forEach((d, i) => { defIdx[d.key] = i; });
  const changed = model.links.map((l, i) => [l, i]).filter(([l]) => l.key in links && links[l.key] !== (l.ref || '') && (links[l.key] === '' || defIdx[links[l.key]] !== undefined));
  const out = [];
  const fp = fingerprint(model); out.push(fp >> 8, fp & 0xff);
  const rgba = h => { for (let j = 0; j < 4; j++) out.push(parseInt(h.slice(j*2, j*2+2), 16)); };
  model.all.forEach(d => rgba(get(d.key)));
  if (!changed.length) return CODE_PREFIX + toB64url(out);
  out.push(changed.length >> 8, changed.length & 0xff);
  for (const [l, i] of changed) {
    const to = links[l.key], di = to ? defIdx[to] : 0xffff;
    out.push(i >> 8, i & 0xff, di >> 8, di & 0xff);
    if (!to) rgba(get(l.key));
  }
  return CODE_PREFIX2 + toB64url(out);
}
// Returns {vals: {key: RGBA hex}, links: {elementKey: sharedKey or ''}}, or throws with a reason a person can act on.
function unpackCode(model, code) {
  code = String(code || '').replace(/\s+/g, '');
  const v2 = code.startsWith(CODE_PREFIX2);
  if (!(v2 || code.startsWith(CODE_PREFIX)) || !/^[A-Za-z0-9_-]+$/.test(code.slice(CODE_PREFIX.length))) throw new Error('That is not a theme code. Codes start with ' + CODE_PREFIX.slice(0, 4));
  let bytes;
  try { bytes = fromB64url(code.slice(CODE_PREFIX.length)); } catch (e) { throw new Error('The theme code is damaged. Copy it again from the editor.'); }
  const base = 2 + model.all.length * 4;
  if (v2 ? bytes.length < base + 2 : bytes.length !== base) throw new Error('The theme code is incomplete or was made from a different base theme.');
  if (((bytes[0] << 8) | bytes[1]) !== fingerprint(model)) throw new Error('The theme code was made from a different base theme.');
  const hex4 = at => { let h = ''; for (let j = 0; j < 4; j++) h += hx(bytes[at + j]); return h; };
  const vals = {}, links = {};
  model.all.forEach((d, i) => { vals[d.key] = hex4(2 + i*4); });
  if (v2) {
    let at = base + 2;
    const n = (bytes[base] << 8) | bytes[base + 1];
    for (let k = 0; k < n; k++) {
      if (at + 4 > bytes.length) throw new Error('The theme code is incomplete.');
      const li = (bytes[at] << 8) | bytes[at+1], di = (bytes[at+2] << 8) | bytes[at+3]; at += 4;
      const l = model.links[li]; if (!l) throw new Error('The theme code was made from a different base theme.');
      if (di === 0xffff) { if (at + 4 > bytes.length) throw new Error('The theme code is incomplete.'); links[l.key] = ''; vals[l.key] = hex4(at); at += 4; }
      else { const d = model.defs[di]; if (!d) throw new Error('The theme code was made from a different base theme.'); links[l.key] = d.key; }
    }
    if (at !== bytes.length) throw new Error('The theme code is damaged. Copy it again from the editor.');
  }
  return {vals, links};
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

const API = {clamp, hx, parse, rgb2hsv, hsv2rgb, mapHex, nightFn, css, esc, parseTheme, buildXml, SCHEMES, schemeHex, BUILTINS, GROUPS, valsFrom, fromTheme,
  CODE_PREFIX, CODE_PREFIX2, packCode, unpackCode, slug, previewHtml, submitUrl};
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.MA3 = API;
})(typeof self !== 'undefined' ? self : this);
