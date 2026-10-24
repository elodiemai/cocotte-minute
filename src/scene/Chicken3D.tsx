import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { INK, Toon } from './Toon';

export type Mood = 'idle' | 'done';

const WHITE = '#ffffff';
const FEATHER = '#f3ece0';
const RED = '#e53935';
const ORANGE = '#ff7a45';

interface Pose {
  y: number;
  peck: number; // head, negative = forward
  flap: number; // wings up
}

function pose(mood: Mood, t: number): Pose {
  if (mood === 'idle') return { y: Math.sin(t * 2.6) * 0.04, peck: Math.sin(t * 1.3) * 0.08, flap: 0 };
  // done: happy hops
  return {
    y: Math.abs(Math.sin(t * 6)) * 0.35,
    peck: Math.sin(t * 6) * 0.15,
    flap: (Math.sin(t * 24) * 0.5 + 0.5) * 1.2,
  };
}

interface Chicken3DProps {
  mood?: Mood;
  position?: [number, number, number];
}

// Cocotte, built from primitives. She faces +x; every pose is procedural.
export default function Chicken3D({ mood = 'idle', position }: Chicken3DProps) {
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  const eyes = useRef<Group>(null);
  const wingL = useRef<Group>(null);
  const wingR = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (!root.current || !head.current || !eyes.current || !wingL.current || !wingR.current) return;

    const p = pose(mood, t);
    root.current.position.y = p.y;
    head.current.rotation.z = p.peck;
    wingL.current.rotation.x = -p.flap;
    wingR.current.rotation.x = p.flap;
    eyes.current.scale.y = t % 4 > 3.85 ? 0.15 : 1; // blink
  });

  return (
    <group position={position}>
      <group ref={root}>
        {[0.18, -0.18].map((z) => (
          <group key={z} position={[0, 0.53, z]}>
            <Toon color={ORANGE} position={[0, -0.25, 0]} outline={0.015}>
              <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
            </Toon>
            <Toon color={ORANGE} position={[0.08, -0.5, 0]} scale={[1.6, 0.4, 1]} outline={0.015}>
              <sphereGeometry args={[0.1, 16, 12]} />
            </Toon>
          </group>
        ))}

        <Toon color={WHITE} position={[0, 1, 0]} scale={[1.15, 0.9, 0.9]}>
          <sphereGeometry args={[0.75, 48, 32]} />
        </Toon>
        <Toon color={FEATHER} position={[-0.85, 1.35, 0]} rotation={[0, 0, 0.9]}>
          <coneGeometry args={[0.28, 0.55, 24]} />
        </Toon>

        {/* Wings pivot from the shoulder so they flap outwards */}
        <group ref={wingL} position={[-0.05, 1.2, 0.62]}>
          <Toon color={FEATHER} position={[0, -0.2, 0]} scale={[1, 0.6, 0.25]}>
            <sphereGeometry args={[0.42, 32, 16]} />
          </Toon>
        </group>
        <group ref={wingR} position={[-0.05, 1.2, -0.62]}>
          <Toon color={FEATHER} position={[0, -0.2, 0]} scale={[1, 0.6, 0.25]}>
            <sphereGeometry args={[0.42, 32, 16]} />
          </Toon>
        </group>

        {/* Head pivots at the neck for pecking */}
        <group ref={head} position={[0.55, 1.45, 0]}>
          <group position={[0.15, 0.3, 0]}>
            <Toon color={WHITE}>
              <sphereGeometry args={[0.45, 48, 32]} />
            </Toon>
            {[-0.17, 0, 0.17].map((x, i) => (
              <Toon key={x} color={RED} position={[x, 0.42 + (i === 1 ? 0.06 : 0), 0]} outline={0.02}>
                <sphereGeometry args={[0.12, 16, 12]} />
              </Toon>
            ))}
            <Toon color={ORANGE} position={[0.5, -0.02, 0]} rotation={[0, 0, -Math.PI / 2]} outline={0.02}>
              <coneGeometry args={[0.12, 0.3, 16]} />
            </Toon>
            <Toon color={RED} position={[0.4, -0.2, 0]} scale={[1, 1.4, 1]} outline={0.02}>
              <sphereGeometry args={[0.08, 16, 12]} />
            </Toon>
            <group ref={eyes} position={[0.3, 0.12, 0]}>
              {[-0.3, 0.3].map((z) => (
                <group key={z} position={[0, 0, z]}>
                  <mesh>
                    <sphereGeometry args={[0.07, 16, 12]} />
                    <meshBasicMaterial color={INK} />
                  </mesh>
                  <mesh position={[0.04, 0.03, z > 0 ? 0.04 : -0.04]}>
                    <sphereGeometry args={[0.022, 8, 8]} />
                    <meshBasicMaterial color={WHITE} />
                  </mesh>
                </group>
              ))}
            </group>
            {[-0.33, 0.33].map((z) => (
              <mesh key={z} position={[0.26, -0.1, z]}>
                <sphereGeometry args={[0.06, 12, 8]} />
                <meshBasicMaterial color="#ff8a80" transparent opacity={0.7} />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}
