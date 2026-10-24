# Cocotte Minute — egg timer prototype

An egg timer where the egg you cook hatches into a surprise creature. React + Vite + TypeScript, 3D with
three.js (React Three Fiber).

```sh
npm install
npm run dev         # http://localhost:5173, test mode on (30 s cook)
npm run lint        # ESLint: typescript-eslint, React Hooks, React Refresh
npm run typecheck   # tsc, no emit; also runs as part of npm run build
```

**Test mode:** every cook lasts 30 seconds, so you can try the hatching without waiting. It's on by default with
`npm run dev` and off in production builds. Force it with `?test=1` or turn it off with `?test=0` in the URL.

## How it plays

1. **Choose a starter egg**: each cooking style is a creature type. *À la coque* is Coulant, *Mollet* is
   Crémeux, and *Dur* is Costaud.
2. **Follow the steps**: each step is a checkbox. Tick the first two (boil the water, put the egg in
   simmering water), then press *C'est parti !* in the "Laisse cuire" step: the timer runs inside that step.
3. **Incubation**: the egg cracks more as the timer runs. Tap it to comfort it: each hug raises the
   chance of a shiny ("chromatique") creature, from 3 % up to 50 %.
4. **Hatching**: when the timer rings, white silhouettes flash faster and faster (like a Pokémon evolution),
   then the creature is revealed. Each type has three creatures; there is a 15 % chance of one from
   another type. The final cooking step (serve, or plunge into cold water) still shows.

## Structure

| File | Role |
| --- | --- |
| `src/App.tsx` | Page flow: maps the timer phase to the stage (`prep → cook → serve`) and rolls the creature |
| `src/useEggTimer.ts` | Timer state machine hook (`idle → running ⇄ paused → done`) |
| `src/eggs.ts` | Egg types, cooking times, size offsets, serving step, and starter type |
| `src/creatures.ts` | The nine species, hatch odds, and shiny odds |
| `src/steps.ts` | The cooking instructions |
| `src/testMode.ts` | 30-second test mode switch |
| `src/scene/Scene.tsx` | Kitchen scene: Cocotte, the pot, speech bubble, hearts |
| `src/scene/IncubatingEgg.tsx` | Egg in the pot: cracks, tap to wiggle, hatching sequence |
| `src/scene/Creature3D.tsx` | The creatures, built from primitives |
| `src/scene/Toon.tsx` | Shared cartoon look: toon shading + "inverted hull" ink outlines |
| `src/components/` | Starter picker, size picker, timer ring, steps checklist (hosts the timer) |

All characters are built from primitives, so a modelled GLB (e.g. from Spline or Poly Pizza) can replace any of
them as long as it reads the same props.

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
