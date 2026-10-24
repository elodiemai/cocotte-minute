import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, type Group, type Mesh, type MeshBasicMaterial } from 'three';
import { Toon } from './Toon';

export type Heat = 'cold' | 'simmer' | 'boil';

const POT = '#5b6b7a';
const WATER = '#9fd8f0';
export const WATER_Y = 1.05;

const BUBBLE_SPEED: Record<Heat, number> = { cold: 0, simmer: 0.35, boil: 1.3 };

// Random spots on the water surface
const SPOTS = Array.from({ length: 10 }, () => {
  const a = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * 0.6;
  return { x: Math.cos(a) * r, z: Math.sin(a) * r, phase: Math.random() };
});

interface Pot3DProps {
  position: [number, number, number];
  heat: Heat | null;
  flame: number; // 0–1
}

export default function Pot3D({ heat, flame, ...props }: Pot3DProps) {
  const bubbles = useRef<Mesh[]>([]);
  const steam = useRef<Mesh[]>([]);
  const flames = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const speed = heat ? BUBBLE_SPEED[heat] : 0;

    bubbles.current.forEach((b, i) => {
      const p = (SPOTS[i].phase + t * speed) % 1;
      b.visible = speed > 0;
      b.position.y = WATER_Y + p * (heat === 'boil' ? 0.35 : 0.15);
      b.scale.setScalar((heat === 'boil' ? 1.4 : 0.8) * (0.4 + p));
      (b.material as MeshBasicMaterial).opacity = 1 - p;
    });

    steam.current.forEach((s, i) => {
      const p = (i / steam.current.length + t * 0.35) % 1;
      s.visible = heat === 'boil';
      s.position.set(Math.sin(t + i * 2) * 0.25, WATER_Y + 0.3 + p * 1.2, 0);
      s.scale.setScalar(0.6 + p);
      (s.material as MeshBasicMaterial).opacity = 0.5 * (1 - p);
    });

    if (flames.current) {
      flames.current.visible = flame > 0.02;
      flames.current.children.forEach((f, i) => {
        f.scale.y = (0.25 + flame) * (0.85 + Math.sin(t * 18 + i * 1.7) * 0.15);
      });
    }
  });

  return (
    <group {...props}>
      {/* Burner + flames */}
      <Toon color="#444" position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]} outline={0}>
        <torusGeometry args={[0.5, 0.06, 12, 40]} />
      </Toon>
      <group ref={flames} position={[0, 0.08, 0]}>
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.45, 0, Math.sin(a) * 0.45]}>
              <coneGeometry args={[0.07, 0.3, 12]} />
              <meshBasicMaterial color={i % 2 ? '#ffb300' : '#ff7043'} />
            </mesh>
          );
        })}
      </group>

      {/* Pot body (open cylinder) + bottom, rim, handles */}
      <Toon color={POT} position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.85, 0.75, 1, 48, 1, true]} />
      </Toon>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.84, 0.74, 1, 48, 1, true]} />
        <meshToonMaterial color="#3e4a55" side={DoubleSide} />
      </mesh>
      <Toon color={POT} position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]} outline={0}>
        <circleGeometry args={[0.75, 48]} />
      </Toon>
      <Toon color={POT} position={[0, 1.25, 0]} rotation={[Math.PI / 2, 0, 0]} outline={0.02}>
        <torusGeometry args={[0.85, 0.05, 12, 48]} />
      </Toon>
      {[-1, 1].map((side) => (
        <Toon key={side} color={POT} position={[side * 0.98, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]} outline={0.02}>
          <torusGeometry args={[0.13, 0.05, 10, 24]} />
        </Toon>
      ))}

      {/* Water */}
      <mesh position={[0, WATER_Y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 48]} />
        <meshToonMaterial color={WATER} />
      </mesh>

      {SPOTS.map((s, i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) bubbles.current[i] = m;
          }}
          position={[s.x, WATER_Y, s.z]}
        >
          <sphereGeometry args={[0.05, 12, 8]} />
          <meshBasicMaterial color="#e6f7ff" transparent />
        </mesh>
      ))}

      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) steam.current[i] = m;
          }}
        >
          <sphereGeometry args={[0.18, 16, 12]} />
          <meshBasicMaterial color="#ffffff" transparent depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
