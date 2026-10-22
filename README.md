# MA3 Theme Builder

![MA3 Theme Builder](images/screenshot.jpg)

A browser tool for editing grandMA3 colour themes. Pick colours, read what each one does, and watch a mock console screen update as you go.

**Live:** https://jaylenjinx.github.io/ma3-theme-builder/

## What it does

- Loads a grandMA3 `ColorTheme` XML (a dark theme exported from MA 2.5.1 is bundled as `theme.xml`).
- Lists every shared colour (Global, Sheets, Playback, Pools) with a colour picker, hex box, opacity slider and a short note on where it shows up, plus which screen elements use it.
- Lists the element colours that aren't linked to a shared colour, for fine control.
- A live screen with pools, a fixture sheet, executors, buttons and the command line. Click anything on it to jump to its colour.
- Master dimmer and saturation sliders, a one-click night look, and a hold-to-compare button.
- Exports the theme with the original file's structure untouched, so it imports straight back into MA3. Exporting with no changes gives back the original file byte for byte.

Edits are kept in your browser between visits.

## Using a theme on the console

Save the exported `.xml` into `gma3_library/colorthemes` (on a USB stick for a console, or in the MA library folder on onPC), then import it from the Color Theme menu.

## Running locally

```
python3 -m http.server
```

Then open http://localhost:8000. Opening `index.html` straight from disk won't load the bundled theme, because browsers block `fetch` from `file://`; use **Load theme.xml** instead.

## Deploying

`.github/workflows/pages.yml` publishes the site to GitHub Pages on every push to `main`. In the repo's Settings > Pages, set Source to **GitHub Actions** once.
