import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { Vector3 } from 'three';
import type { Hatch } from '../creatures';
import Chicken3D, { type Mood } from './Chicken3D';
import Pot3D, { type Heat } from './Pot3D';
import IncubatingEgg from './IncubatingEgg';
import FitCamera from './FitCamera';

// Layout in world units: Cocotte on the left, the pot on the right
const CHICKEN_POS: [number, number, number] = [-1.4, 0, 0];
const POT_POS: [number, number, number] = [1.3, 0, 0];
const BUBBLE_ANCHOR: [number, number, number] = [-0.8, 2.75, 0];
const HEARTS_ANCHOR: [number, number, number] = [POT_POS[0], 1.9, 0];
// In front of the pot's base, so it reads like a label on the pot
const CLOCK_ANCHOR: [number, number, number] = [POT_POS[0], 0.15, 0.9];

type Pin = (x: number, y: number) => void;

// Reports where a point of the 3D scene lands on screen, every frame
function FollowPoint({ at, onMove }: { at: [number, number, number]; onMove: Pin }) {
  const v = useMemo(() => new Vector3(), []);
  useFrame(({ camera, size }) => {
    v.set(...at).project(camera);
    onMove(((v.x + 1) / 2) * size.width, ((1 - v.y) / 2) * size.height);
  });
  return null;
}

// Keeps a DOM element (outside the canvas) above that point
function place(el: HTMLDivElement | null, x: number, y: number) {
  if (el) el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
}

interface SceneProps {
  mood: Mood;
  heat: Heat | null;
  flame: number;
  speech: string | null;
  /** Cook + serve stages: the egg incubating in the pot */
  incubating: boolean;
  progress: number;
  cuddles: number;
  onCuddle: () => void;
  hatch: Hatch | null;
  revealed: boolean;
  onRevealed: () => void;
  /** Time left, shown on the pot while the egg cooks */
  clock: string | null;
}

// The kitchen: Cocotte, the pot, and the egg incubating then hatching
export default function Scene(props: SceneProps) {
  const { mood, heat, flame, speech, incubating, progress, cuddles, onCuddle, hatch, revealed, onRevealed, clock } = props;
  const bubble = useRef<HTMLDivElement>(null);
  const hearts = useRef<HTMLDivElement>(null);
  const pinBubble: Pin = (x, y) => place(bubble.current, x, y);
  const pinHearts: Pin = (x, y) => place(hearts.current, x, y);
  const clockEl = useRef<HTMLDivElement>(null);
  const pinClock: Pin = (x, y) => place(clockEl.current, x, y);
  const evolving = Boolean(hatch) && !revealed;

  // One floating heart per tap (keys change, so each new one animates)
  const recent = Array.from({ length: Math.min(cuddles, 6) }, (_, i) => cuddles - i);

  const className = ['scene', evolving && 'evolving', revealed && 'revealed', hatch?.shiny && revealed && 'shiny']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className}>
      <Canvas
        camera={{ fov: 35 }}
        dpr={[1, 2]}
        fallback={<p className="scene-fallback">La 3D n'est pas disponible sur cet appareil.</p>}
      >
        <FitCamera width={5.8} height={4} lookY={1.5} elevation={0.2} />
        <FollowPoint at={BUBBLE_ANCHOR} onMove={pinBubble} />
        <FollowPoint at={HEARTS_ANCHOR} onMove={pinHearts} />
        <FollowPoint at={CLOCK_ANCHOR} onMove={pinClock} />
        <ambientLight intensity={2} />
        <directionalLight position={[3, 6, 5]} intensity={2.2} />

        <Chicken3D mood={mood} position={CHICKEN_POS} />
        <Pot3D position={POT_POS} heat={heat} flame={flame} />
        {incubating && (
          <IncubatingEgg position={POT_POS} progress={progress} hatch={hatch} revealed={revealed} onTap={onCuddle} onRevealed={onRevealed} />
        )}

        <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={8} blur={2.2} far={3} />
      </Canvas>

      <div ref={hearts} className="hearts-anchor" aria-hidden="true">
        {recent.map((key) => (
          <span key={key} className="heart" style={{ left: `${((key * 37) % 60) - 30}px` }}>
            ❤
          </span>
        ))}
        {revealed && hatch?.shiny && <span className="sparkle">✨</span>}
      </div>

      <div ref={clockEl} className="clock-anchor" aria-hidden="true">
        {clock && <span className="pot-clock">⏱ {clock}</span>}
      </div>

      <div ref={bubble} className="bubble-anchor" aria-live="polite">
        {speech && (
          <div key={speech} className="bubble">
            {speech}
          </div>
        )}
      </div>
    </div>
  );
}
