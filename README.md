# Wildlight — A Cozy Creature Adventure

Wildlight is an original creature-collecting RPG built for desktop and mobile browsers. This rework is focused on making exploration and visible creatures the main experience—not a dialogue-led text adventure.

## Play

Open the [GitHub Pages build](https://diglethooks-cpu.github.io/Creature-RPG/) or run the repository with any static web server. Progress is saved locally in the browser on the device where you play.

## Current rework

- Large connected isometric world spanning five regions: Sunmeadow, Whisperwood, Tideglass Coast, Emberfall Ridge, and Frostveil Peaks
- Real-time movement with a camera that follows the explorer, tap-to-walk, keyboard support, and a mobile analog joystick
- Roaming wild creatures that wander through their home habitats and return to the world over time
- **40 original creature species**, eight elemental affinities, 26 moves, rarity levels, stats, and five evolution lines
- Turn-based encounters, move selection, type matchups, lure-based recruiting, experience, leveling, and evolution
- Six-creature party, collection overflow, field guide, region map, and local save/load
- Customizable explorer appearance and three starter companions
- A soft storybook palette and illustrated isometric scenery

## Controls

- **Desktop:** WASD or arrow keys to move; E or Space to interact; click/tap the ground to walk there.
- **Mobile:** Use the on-screen joystick to move, tap the world to walk, and use the Interact button near a creature.

## Project structure

- `index.html` — game interface and overlays
- `styles.css` — responsive desktop/mobile interface
- `src/creatures.js` — creature species, regions, types, and moves
- `src/game.js` — world generation, rendering, movement, encounters, battles, and saves

## Development status

This is a substantial playable prototype and an active work in progress—not a finished commercial game. The Figma rework board documents the visual direction and HUD layout. Next priorities are deeper world landmarks and interiors, richer individual creature animations/art, quest and progression depth, and hands-on mobile playtesting.
