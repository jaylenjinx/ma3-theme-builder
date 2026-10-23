// Checks or adds a "Submit a theme" issue. Run by .github/workflows/gallery.yml.
//   node scripts/gallery-submission.cjs check   -> writes comment.md with the result and a preview link
//   node scripts/gallery-submission.cjs add     -> also appends the theme to gallery/themes.json
// The issue comes from GITHUB_EVENT_PATH, so nothing from it is ever pasted into a shell command.
'use strict';
const fs = require('fs');
const path = require('path');
const MA3 = require('../core.js');

const SITE = 'https://themes.sulfurdesign.com/';
const ROOT = path.join(__dirname, '..');
const LIST = path.join(ROOT, 'gallery', 'themes.json');

// Issue forms render each field as "### Label\n\nvalue"; empty optional fields are "_No response_".
function fields(body) {
  const out = {};
  const parts = String(body || '').replace(/\r\n/g, '\n').split(/^### /m).slice(1);
  for (const p of parts) {
    const nl = p.indexOf('\n');
    let v = p.slice(nl + 1).trim().replace(/^```\w*\n?|\n?```$/g, '').trim();
    if (v === '_No response_') v = '';
    out[p.slice(0, nl).trim()] = v;
  }
  return out;
}
// Plain text for markdown comments: no links, tags or formatting from the submitter.
const plain = s => String(s).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/[\\`*_{}[\]()<>#!|~@]/g, '').replace(/\s+/g, ' ').trim();

function check(issue, model) {
  const f = fields(issue.body), errors = [];
  const name = plain(f['Theme name'] || '').slice(0, 40);
  const author = plain(f['Your name'] || '').slice(0, 40) || issue.user.login;
  const description = plain(f['Description'] || '').slice(0, 200);
  const code = String(f['Theme code'] || '').replace(/\s+/g, '');
  if (!name) errors.push('The theme needs a name.');
  try { MA3.unpackCode(model, code); } catch (e) { errors.push(e.message); }
  return {name, author, description, code, errors};
}

function main() {
  const mode = process.argv[2];
  const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const issue = event.issue;
  const model = MA3.parseTheme(fs.readFileSync(path.join(ROOT, 'theme.xml'), 'utf8'));
  const sub = check(issue, model);
  const out = (k, v) => process.env.GITHUB_OUTPUT && fs.appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`);
  let comment;
  if (sub.errors.length) {
    comment = `This submission can't be added yet:\n\n${sub.errors.map(e => '- ' + e).join('\n')}\n\nThe easiest fix is to press **Share to gallery** in the [editor](${SITE}) again, or edit this issue with a fresh code.`;
    out('added', 'false');
  } else if (mode === 'add') {
    const list = JSON.parse(fs.readFileSync(LIST, 'utf8'));
    if (list.some(t => t.issue === issue.number)) {
      comment = 'This theme is already in the gallery.';
      out('added', 'false');
    } else {
      let id = MA3.slug(sub.name), n = 2;
      while (list.some(t => t.id === id)) id = MA3.slug(sub.name) + '-' + n++;
      list.push({id, name: sub.name, author: sub.author, description: sub.description, code: sub.code, issue: issue.number, added: new Date().toISOString().slice(0, 10)});
      fs.writeFileSync(LIST, JSON.stringify(list, null, 2) + '\n');
      comment = `**${sub.name}** is in the [gallery](${SITE}gallery.html) now (it can take a few minutes to show up). Thanks for sharing it!`;
      out('added', 'true');
    }
  } else {
    comment = `Thanks! **${sub.name}** by ${sub.author} checks out.\n\n[Preview it in the editor](${SITE}index.html?code=${sub.code})\n\nIt goes into the gallery once it's approved.`;
  }
  fs.writeFileSync(path.join(ROOT, 'comment.md'), comment + '\n');
  console.log(comment);
}
main();
