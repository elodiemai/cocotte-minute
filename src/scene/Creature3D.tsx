import { useContext, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { SpeciesId } from '../creatures';
import { INK, Toon } from './Toon';
import { Silhouette } from './silhouette';

const ORANGE = '#ff7a45';
const CREAM = '#fff3e0';

type Vec3 = [number, number, number];

// Big cute eyes and cheeks on the front (+z) of a head centred at (0, y, 0)
function Face({ y, r, z = 0 }: { y: number; r: number; z?: number }) {
  const silhouette = useContext(Silhouette);
  return (
    <group position={[0, y, z]}>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.36 * r, 0.12 * r, 0.86 * r]}>
          <Toon color={INK} outline={0}>
            <sphereGeometry args={[0.2 * r, 16, 12]} />
          </Toon>
          <Toon color="#ffffff" position={[0.06 * r, 0.07 * r, 0.15 * r]} outline={0}>
            <sphereGeometry args={[0.07 * r, 8, 8]} />
          </Toon>
        </group>
      ))}
      {!silhouette && [-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.6 * r, -0.18 * r, 0.74 * r]}>
          <sphereGeometry args={[0.13 * r, 12, 8]} />
          <meshBasicMaterial color="#ff8a80" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Smile({ position, width = 0.08 }: { position: Vec3; width?: number }) {
  return (
    <Toon color={INK} position={position} rotation={[0, 0, Math.PI]} outline={0}>
      <torusGeometry args={[width, 0.015, 8, 16, Math.PI]} />
    </Toon>
  );
}

function Feet({ color }: { color: string }) {
  return (
    <>
      {[-1, 1].map((side) => (
        <Toon key={side} color={color} position={[side * 0.18, 0.05, 0.15]} scale={[1, 0.6, 1.3]} outline={0.02}>
          <sphereGeometry args={[0.1, 12, 10]} />
        </Toon>
      ))}
    </>
  );
}

/** Round body + head shared by most species */
function Chibi({ color, belly }: { color: string; belly?: string }) {
  return (
    <>
      <Toon color={color} position={[0, 0.38, 0]}>
        <sphereGeometry args={[0.4, 32, 24]} />
      </Toon>
      {belly && (
        <Toon color={belly} position={[0, 0.36, 0.2]} scale={[0.75, 0.8, 0.5]} outline={0}>
          <sphereGeometry args={[0.4, 24, 16]} />
        </Toon>
      )}
      <Toon color={color} position={[0, 0.92, 0]}>
        <sphereGeometry args={[0.36, 32, 24]} />
      </Toon>
      <Face y={0.92} r={0.36} />
    </>
  );
}

function Body({ species, color }: { species: SpeciesId; color: string }) {
  switch (species) {
    case 'axolotl':
      return (
        <>
          <Chibi color={color} belly="#ffd1e3" />
          {[-1, 1].map((side) =>
            [-1, 0, 1].map((i) => (
              <Toon
                key={`${side}${i}`}
                color="#e91e63"
                position={[side * 0.36, 1 + i * 0.11, -0.02]}
                rotation={[0, 0, -side * (Math.PI / 2 - i * 0.45)]}
                outline={0.015}
              >
                <coneGeometry args={[0.05, 0.22, 10]} />
              </Toon>
            ))
          )}
          <Smile position={[0, 0.84, 0.33]} />
          <Feet color={color} />
        </>
      );
    case 'pingouin':
      return (
        <>
          <Chibi color={color} belly="#ffffff" />
          <Toon color={ORANGE} position={[0, 0.86, 0.38]} rotation={[Math.PI / 2, 0, 0]} outline={0.015}>
            <coneGeometry args={[0.07, 0.16, 12]} />
          </Toon>
          {[-1, 1].map((side) => (
            <Toon key={side} color={color} position={[side * 0.4, 0.42, 0]} rotation={[0, 0, side * 0.4]} scale={[0.3, 1, 0.6]}>
              <sphereGeometry args={[0.25, 16, 12]} />
            </Toon>
          ))}
          <Feet color={ORANGE} />
        </>
      );
    case 'grenouille':
      return (
        <>
          <Toon color={color} position={[0, 0.38, 0]}>
            <sphereGeometry args={[0.4, 32, 24]} />
          </Toon>
          <Toon color={color} position={[0, 0.85, 0]} scale={[1.15, 0.8, 1]}>
            <sphereGeometry args={[0.36, 32, 24]} />
          </Toon>
          {/* Eyes on top of the head */}
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.2, 1.12, 0.08]}>
              <Toon color={color}>
                <sphereGeometry args={[0.14, 16, 12]} />
              </Toon>
              <Toon color="#ffffff" position={[0, 0.02, 0.07]} outline={0}>
                <sphereGeometry args={[0.1, 16, 12]} />
              </Toon>
              <Toon color={INK} position={[0, 0.02, 0.15]} outline={0}>
                <sphereGeometry args={[0.05, 12, 8]} />
              </Toon>
            </group>
          ))}
          <Smile position={[0, 0.8, 0.3]} width={0.17} />
          <Feet color={color} />
        </>
      );
    case 'singe':
      return (
        <>
          <Chibi color={color} belly={CREAM} />
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.38, 1, 0]}>
              <Toon color={color}>
                <sphereGeometry args={[0.14, 16, 12]} />
              </Toon>
              <Toon color={CREAM} position={[0, 0, 0.07]} scale={[1, 1, 0.5]} outline={0}>
                <sphereGeometry args={[0.09, 12, 10]} />
              </Toon>
            </group>
          ))}
          <Toon color={CREAM} position={[0, 0.82, 0.24]} scale={[1.2, 0.8, 0.6]} outline={0.015}>
            <sphereGeometry args={[0.18, 16, 12]} />
          </Toon>
          <Smile position={[0, 0.8, 0.35]} width={0.06} />
          <Toon color={color} position={[0.32, 0.4, -0.3]} rotation={[0, Math.PI / 2, 0]} outline={0.015}>
            <torusGeometry args={[0.15, 0.04, 8, 24, Math.PI * 1.5]} />
          </Toon>
          <Feet color={color} />
        </>
      );
    case 'licorne':
      return (
        <>
          <Chibi color={color} />
          <Toon color="#ffca28" position={[0, 1.32, 0.12]} rotation={[0.3, 0, 0]} outline={0.015}>
            <coneGeometry args={[0.07, 0.36, 16]} />
          </Toon>
          {[-1, 1].map((side) => (
            <Toon key={side} color={color} position={[side * 0.22, 1.2, -0.05]} rotation={[0, 0, -side * 0.4]} outline={0.015}>
              <coneGeometry args={[0.07, 0.18, 12]} />
            </Toon>
          ))}
          {['#f48fb1', '#ce93d8', '#90caf9', '#f48fb1'].map((c, i) => (
            <Toon key={i} color={c} position={[0, 1.22 - i * 0.16, -0.24 - i * 0.03]} outline={0.015}>
              <sphereGeometry args={[0.11, 12, 10]} />
            </Toon>
          ))}
          <Feet color={color} />
        </>
      );
    case 'poussin':
      return (
        <>
          <Chibi color={color} />
          <Toon color={ORANGE} position={[0, 0.86, 0.37]} rotation={[Math.PI / 2, 0, 0]} outline={0.015}>
            <coneGeometry args={[0.06, 0.13, 12]} />
          </Toon>
          {/* Still wearing a bit of eggshell */}
          <Toon color="#f7ead2" position={[0, 1.02, 0]}>
            <sphereGeometry args={[0.39, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
          </Toon>
          <Feet color={ORANGE} />
        </>
      );
    case 'dinosaure':
    case 'dragon': {
      const spikes = species === 'dinosaure' ? '#ff9800' : '#ffd54f';
      return (
        <>
          <Chibi color={color} belly={species === 'dragon' ? '#fff59d' : '#c5e1a5'} />
          {(
            [
              [1.27, -0.06, 0.2],
              [1.13, -0.27, 0.7],
              [0.78, -0.4, 1.3],
              [0.5, -0.42, 1.6],
            ] as const
          ).map(([y, z, tilt]) => (
            <Toon key={y} color={spikes} position={[0, y, z]} rotation={[-tilt, 0, 0]} outline={0.015}>
              <coneGeometry args={[0.07, 0.18, 10]} />
            </Toon>
          ))}
          <Toon color={color} position={[0, 0.22, -0.45]} rotation={[-1.9, 0, 0]}>
            <coneGeometry args={[0.15, 0.5, 16]} />
          </Toon>
          {species === 'dragon' && (
            <>
              {[-1, 1].map((side) => (
                <Toon key={side} color="#7e57c2" position={[side * 0.42, 0.62, -0.22]} rotation={[0, side * 0.6, side * 0.5]} scale={[1, 0.7, 0.12]}>
                  <sphereGeometry args={[0.32, 16, 12]} />
                </Toon>
              ))}
              {[-1, 1].map((side) => (
                <Toon key={`h${side}`} color="#fff59d" position={[side * 0.17, 1.27, 0]} rotation={[0, 0, -side * 0.35]} outline={0.015}>
                  <coneGeometry args={[0.05, 0.18, 10]} />
                </Toon>
              ))}
            </>
          )}
          <Feet color={color} />
        </>
      );
    }
    case 'tortue':
      return (
        <>
          <Toon color="#8d6e63" position={[0, 0.38, -0.05]} scale={[1.1, 0.75, 1.1]}>
            <sphereGeometry args={[0.45, 32, 24]} />
          </Toon>
          {[0, 1, 2].map((i) => (
            <Toon key={i} color="#a1887f" position={[(i - 1) * 0.22, 0.62, 0.08]} scale={[1, 0.5, 1]} outline={0.015}>
              <sphereGeometry args={[0.1, 12, 8]} />
            </Toon>
          ))}
          <Toon color={color} position={[0, 0.62, 0.42]}>
            <sphereGeometry args={[0.28, 32, 24]} />
          </Toon>
          <Face y={0.62} r={0.28} z={0.42} />
          <Smile position={[0, 0.55, 0.69]} width={0.05} />
          <Feet color={color} />
        </>
      );
  }
}

// Happy idle: a little bounce with squash and stretch
export default function Creature3D({ species, color }: { species: SpeciesId; color: string }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const s = Math.sin(clock.elapsedTime * 5);
    ref.current.position.y = Math.max(0, s) * 0.08;
    ref.current.scale.set(1 + Math.min(0, s) * -0.05, 1 + Math.min(0, s) * 0.06, 1);
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 1.3) * 0.25;
  });
  return (
    <group ref={ref}>
      <Body species={species} color={color} />
    </group>
  );
}
