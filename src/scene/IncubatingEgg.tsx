import { useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import type { Group } from 'three';
import type { Hatch } from '../creatures';
import { WATER_Y } from './Pot3D';
import { EggMesh, INK, Toon } from './Toon';
import { Silhouette } from './silhouette';
import Creature3D from './Creature3D';

const HATCH_SECONDS = 3.4;

// Cracks appear on the front of the shell as the timer progresses
const CRACKS: { from: number; at: [number, number]; tilt: number }[] = [
  { from: 0.33, at: [-0.05, 0.06], tilt: 0.6 },
  { from: 0.66, at: [0.06, -0.02], tilt: -0.5 },
  { from: 0.9, at: [0, 0.12], tilt: 0.1 },
];

function Crack({ at, tilt }: { at: [number, number]; tilt: number }) {
  return (
    <group position={[at[0], at[1], 0.215]} rotation={[0, 0, tilt]}>
      {[-1, 0, 1].map((i) => (
        <Toon key={i} color={INK} position={[i * 0.04, i % 2 ? 0.012 : -0.012, 0]} rotation={[0, 0, i % 2 ? 0.7 : -0.7]} outline={0}>
          <boxGeometry args={[0.05, 0.012, 0.01]} />
        </Toon>
      ))}
    </group>
  );
}

interface IncubatingEggProps {
  position: [number, number, number];
  progress: number; // 0–1 through the cooking time
  hatch: Hatch | null;
  revealed: boolean;
  onTap: () => void;
  onRevealed: () => void;
}

type Phase = 'egg' | 'silhouette' | 'revealed';

// The egg in the pot: restless as it nears hatching, wiggles when tapped,
// then hatches with an evolution-style sequence of flashing silhouettes.
export default function IncubatingEgg({ position, progress, hatch, revealed, onTap, onRevealed }: IncubatingEggProps) {
  const egg = useRef<Group>(null);
  const creature = useRef<Group>(null);
  const wiggle = useRef(0);
  // When the current phase began, in clock time
  const started = useRef<{ phase: Phase; at: number } | null>(null);
  const phase: Phase = !hatch ? 'egg' : revealed ? 'revealed' : 'silhouette';

  useFrame(({ clock }, delta) => {
    const e = egg.current;
    const c = creature.current;
    if (!e) return;
    const t = clock.elapsedTime;

    if (phase === 'egg') {
      e.visible = true;
      wiggle.current = Math.max(0, wiggle.current - delta * 2);
      // Restless bursts that grow as hatching gets closer
      const restless = (0.03 + progress * 0.2) * (Math.sin(t * 2) > 0.5 ? 1 : 0.2);
      e.rotation.z = Math.sin(t * 14) * (restless + wiggle.current * 0.4);
      e.position.y = WATER_Y - 0.1 + Math.abs(Math.sin(t * 14)) * wiggle.current * 0.15;
      return;
    }
    if (!c) return;

    if (started.current?.phase !== phase) started.current = { phase, at: t };
    const elapsed = t - started.current.at;

    if (phase === 'silhouette') {
      // Alternate egg / creature silhouettes, faster and faster
      const k = Math.min(1, elapsed / HATCH_SECONDS);
      const flips = elapsed * (2 + k * k * 28);
      const showCreature = Math.floor(flips) % 2 === 1;
      e.visible = !showCreature;
      c.visible = showCreature;
      e.rotation.z = 0;
      c.scale.setScalar(0.9);
      if (k >= 1) onRevealed();
      return;
    }

    // Revealed: pop out of the pot with a springy overshoot
    e.visible = false;
    c.visible = true;
    const p = Math.min(1, elapsed / 0.6);
    c.scale.setScalar(0.9 * (1 + Math.sin(p * Math.PI) * 0.35));
    c.position.y = WATER_Y - 0.25 + Math.sin(p * Math.PI) * 0.5;
  });

  function onClick(e: ThreeEvent<MouseEvent>) {
    if (phase !== 'egg') return;
    e.stopPropagation();
    wiggle.current = 1;
    onTap();
  }

  return (
    <group position={position}>
      <Silhouette.Provider value={phase === 'silhouette'}>
        <group
          ref={egg}
          position={[0, WATER_Y - 0.1, 0]}
          scale={1.5}
          onClick={onClick}
          onPointerOver={() => phase === 'egg' && (document.body.style.cursor = 'pointer')}
          onPointerOut={() => (document.body.style.cursor = '')}
        >
          <EggMesh />
          {/* Invisible, larger tap target so the egg is easy to hit on a phone */}
          <mesh>
            <sphereGeometry args={[0.45, 12, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          {phase === 'egg' && CRACKS.filter((c) => progress >= c.from).map((c) => <Crack key={c.from} {...c} />)}
        </group>

        {hatch && (
          <group ref={creature} position={[0, WATER_Y - 0.25, 0]} visible={false}>
            <Creature3D
              species={hatch.species.id}
              color={hatch.shiny ? hatch.species.shinyColor : hatch.species.color}
            />
          </group>
        )}
      </Silhouette.Provider>
    </group>
  );
}
