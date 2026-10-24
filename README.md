# Cocotte Minute — egg timer prototype

A single-page prototype for timing eggs (à la coque, mollet, dur). React + Vite + TypeScript.

```sh
npm install
npm run dev     # http://localhost:5173
npm run typecheck   # tsc, no emit; also runs as part of npm run build
```

## Structure

| File | Role |
| --- | --- |
| `src/App.tsx` | Page layout; wires the selected egg and size to the timer |
| `src/useEggTimer.ts` | Timer state machine hook (`idle → running ⇄ paused → done`) |
| `src/eggs.ts` | Egg types, cooking times, and size offsets. Edit this to change the options |
| `src/components/Chicken.tsx` | Inline SVG mascot (each body part has a class so it can be animated) |
| `src/components/` | Also `Pot`, `EggPicker`, `SizePicker`, and `TimerRing` |
| `src/cluck.ts` | WebAudio "cot-cot" played when the timer ends |
| `src/style.css` | Theme tokens, mascot animations per state, and the picker/timer UI |

`<Chicken phase panic />` turns the timer phase into a CSS class (`idle`, `cooking`, `panic`, `paused`, `done`).
To swap in another asset (a sprite sheet, Lottie, Rive, or 3D model), reimplement `Chicken.tsx` with the same
props. For example, `@rive-app/react-canvas`, `@lottiefiles/dotlottie-react`, or `@splinetool/react-spline`.

## Asset resources

### 2D sprites and illustrations
- **Kenney "Animal Pack Redux"** (https://opengameart.org/content/animal-pack-redux): CC0; includes a chicken
  and a chick in 8 styles (PNG, sprite sheets, vector). Search Kenney's site for the pack name, not "chicken".
- **OpenGameArt.org**: community sprites; licences vary (CC0, CC-BY, GPL). CC0 chicken examples:
  "Free Flappy Chicken" by Bevouliin (https://opengameart.org/node/35285, animated sprite sheets) and
  "chick" (https://opengameart.org/content/chick).
- **itch.io → Game assets**: search "chicken"; several pay-what-you-want pixel-art chicken sprite sheets
  (e.g. pixelplant's "Free Animated Chicken Sprite Sheet"). Licences aren't always CC0, so check each page.
- **unDraw / Open Peeps / Humaaans**: flat illustrations for empty and success states.

### Animated 2D (best fit for a "fun" character)
- **Rive** (rive.app): interactive vector animations with a state machine. Idle, cooking, and done states map
  directly to Rive inputs. Has a community library and a free web runtime (`@rive-app/canvas`).
- **LottieFiles**: thousands of free JSON animations (search "chicken", "egg", "cooking"). Play them with
  `lottie-web` or `@lottiefiles/dotlottie-web`.

### 3D
- **Spline** (spline.design): browser-based 3D editor. Export a scene as a `<spline-viewer>` web component, with
  hover and click events. This is the fastest route to a cute 3D chicken.
- **Three.js / react-three-fiber + drei**: for full control over a GLB model.
- **Poly Pizza, Quaternius, Kenney 3D**: free low-poly animal and food models (GLB/GLTF), often CC0.
- **Sketchfab**: large model library. Filter by downloadable and licence.
- **Mixamo**: auto-rigging and animations, mainly for humanoid characters (not well suited to a chicken).

### Sound
- **freesound.org** and **Pixabay sound effects**: clucks, bubbling water, and timer dings.
  The prototype currently synthesizes a "cot-cot" with WebAudio, so it needs no audio files.

### UI/UX
- **Figma Community**: search "timer app" or "cooking app" for layout inspiration.
- **Google Fonts**: the prototype uses *Fredoka* for a rounded, playful feel.
