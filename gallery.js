/* Gallery page: community themes from gallery/themes.json plus the built-in schemes, all applied to the bundled theme.xml. */
(() => {
const $ = s => document.querySelector(s);
const say = t => { $('#status').textContent = t; };
const {esc} = MA3;
let model = null, items = [], filter = 'all';

async function builtinVals(t) {
  if (!t.file) return MA3.valsFrom(model, t.fn);
  const r = await fetch(t.file); if (!r.ok) throw new Error('Could not load ' + t.file);
  return MA3.valsFromTheme(model, MA3.parseTheme(await r.text()));
}
function card(t) {
  const edit = t.kind === 'community' ? `index.html?theme=${encodeURIComponent(t.id)}` : `index.html?scheme=${encodeURIComponent(t.id)}`;
  return `<article class="gcard" data-id="${esc(t.kind + ':' + t.id)}">
      ${MA3.previewHtml(k => t.vals[k])}
      <div class="gmeta"><div><h3>${esc(t.name)}</h3>${t.author ? `<span class="gby">by ${esc(t.author)}</span>` : ''}<p class="gdesc">${esc(t.note)}</p></div>
        <div class="gbtns"><a class="btn primary" href="${edit}">Edit</a><button class="btn" type="button" data-act="dl" aria-label="Download ${esc(t.name)} as XML">.xml</button></div></div>
    </article>`;
}
function render() {
  const q = $('#search').value.trim().toLowerCase();
  const match = t => !q || (t.name + ' ' + (t.author || '') + ' ' + t.note).toLowerCase().includes(q);
  const com = items.filter(t => t.kind === 'community' && match(t)), bi = items.filter(t => t.kind === 'builtin' && match(t));
  const total = items.filter(t => t.kind === 'community').length;
  $('#gridCommunity').innerHTML = com.length ? com.map(card).join('') : total
    ? `<div class="gempty"><strong>No community themes match "${esc(q)}"</strong></div>`
    : `<div class="gempty"><strong>No community themes yet</strong><p>Be the first. Build a theme in the editor, then press Share to gallery under Export.</p><a class="btn primary" href="#share">How sharing works</a></div>`;
  $('#gridBuiltin').innerHTML = bi.length ? bi.map(card).join('') : `<div class="gempty"><strong>No built-in themes match "${esc(q)}"</strong></div>`;
  $('#secCommunity').hidden = filter === 'builtin';
  $('#secBuiltin').hidden = filter === 'community' || (q && !bi.length && filter === 'all');
}

$('#filters').addEventListener('click', e => {
  const b = e.target.closest('.tab'); if (!b) return;
  filter = b.dataset.f;
  for (const t of document.querySelectorAll('#filters .tab')) t.setAttribute('aria-selected', String(t === b));
  render();
});
$('#search').addEventListener('input', render);
document.addEventListener('click', e => {
  const b = e.target.closest('button[data-act="dl"]'); if (!b) return;
  const t = items.find(x => x.kind + ':' + x.id === b.closest('.gcard').dataset.id);
  // MA's own themes download as the original file.
  const fname = t.file ? t.file.split('/').pop() : t.id === 'default' ? 'theme.xml' : `theme_${t.id}.xml`;
  const url = t.file || URL.createObjectURL(new Blob([MA3.buildXml(model, k => t.vals[k], fname)], {type: 'application/xml'}));
  const a = document.createElement('a'); a.href = url; a.download = fname; document.body.appendChild(a); a.click(); a.remove();
  if (!t.file) setTimeout(() => URL.revokeObjectURL(url), 1000);
  say(`Downloaded ${fname}. Put it in gma3_library/colorthemes and import it from the Color Theme menu.`);
});

(async () => {
  try { const r = await fetch('theme.xml'); if (!r.ok) throw 0; model = MA3.parseTheme(await r.text()); }
  catch { say('Could not load the bundled theme.xml. Serve this folder over http to see the gallery.'); return; }
  items = [];
  for (const t of MA3.BUILTINS) {
    try { items.push({kind: 'builtin', id: t.id, name: t.name, note: t.note, file: t.file, vals: await builtinVals(t)}); }
    catch (err) { console.warn('Skipped built-in theme', t.id, err.message); }
  }
  try {
    const r = await fetch('gallery/themes.json', {cache: 'no-cache'}); if (!r.ok) throw 0;
    const list = await r.json(), com = [];
    for (const t of list) {
      try { com.push({kind: 'community', id: t.id, name: t.name, author: t.author, note: t.description || '', vals: MA3.unpackCode(model, t.code)}); }
      catch (err) { console.warn('Skipped community theme', t.id, err.message); }
    }
    items = [...com.reverse(), ...items]; // newest first
  } catch { say('Could not load the community themes. Built-in themes are below.'); }
  $('#nCommunity').textContent = items.filter(t => t.kind === 'community').length;
  $('#nBuiltin').textContent = items.filter(t => t.kind === 'builtin').length;
  render();
})();
})();
