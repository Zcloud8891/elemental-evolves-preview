# Elemental Evolves — unit-art preview (box build)

This is a copy of the 2026-11-08 phase-1 preview with Hark's 25 unit sprites wired in, MOTION.md tweens, team-color ground rings, and a game-feel pass. The live GitHub preview was not changed or pushed.

## Play it locally
Serve this folder over HTTP (opening the HTML file as `file://` will not load modules reliably):

```
python3 -m http.server 8765
```

Then open `http://localhost:8765/?boot=fire&seed=4`.

Useful query flags:
- `?gallery=1` — all 25 units, idle breathe, rings
- `?boot=fire&seed=4&demo=35&pause=1&sheet=0` — mid-battle, paused
- `?sfx=1` — start with sound on (default is muted)
- `?focuspause=0` — do not pause when the tab blurs

Sound is muted by default. Use the in-game Sound toggle, or `?sfx=1`.

## Publish the live preview (needs Jeremy's OK)
Do not push until Jeremy asks. Then, from a machine with the `elemental-evolves-preview` repo:

1. Replace the live preview files with the contents of this folder (keep the existing `.git`, do not copy this folder's missing git history blindly if you use a fresh checkout).
2. Commit `assets/units/`, `assets/sfx/`, the updated `assets/index.js`, `sw.js`, `CREDITS.md`, and this note.
3. Push to `https://github.com/zcloud8891/elemental-evolves-preview` on `main`.
4. GitHub Pages should update `https://zcloud8891.github.io/elemental-evolves-preview/` in a minute or two. Hard-refresh once; the service worker cache name is now `ee-preview-unit-art-v1`.

Hark does not need to change the art pack for this to go live. Later, drop replacement PNGs into `assets/units/` with the same names and re-optimize if they are still 512px masters.
