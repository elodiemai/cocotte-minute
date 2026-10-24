import { useContext, useLayoutEffect, useRef, type ReactNode } from 'react';
import type { ThreeElements } from '@react-three/fiber';
import { BackSide, type Mesh } from 'three';
import { Silhouette } from './silhouette';

export const INK = '#3b2a1a';
export const SHELL = '#f7ead2';

type GroupProps = ThreeElements['group'];

interface ToonProps extends Omit<GroupProps, 'children'> {
  color: string;
  /** Outline width in world units; 0 disables it */
  outline?: number;
  children: ReactNode; // the geometry
}

// "Inverted hull" outline: an ink copy of the geometry, grown by `thickness`
// and drawn back-faces only, so it peeks out around the silhouette.
// (drei's <Outlines> renders nothing with the current three.js release.)
function Hull({ thickness, children }: { thickness: number; children: ReactNode }) {
  const ref = useRef<Mesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.geometry.computeBoundingSphere();
    const radius = mesh.geometry.boundingSphere?.radius || 1;
    mesh.scale.setScalar(1 + thickness / radius);
  }, [thickness]);

  return (
    <mesh ref={ref}>
      {children}
      <meshBasicMaterial color={INK} side={BackSide} />
    </mesh>
  );
}

// Cartoon look shared by every part: toon shading + ink outline, like the 2D logo style
export function Toon({ color, outline = 0.03, children, ...group }: ToonProps) {
  const silhouette = useContext(Silhouette);
  return (
    <group {...group}>
      <mesh castShadow>
        {children}
        {silhouette ? <meshBasicMaterial color="#ffffff" /> : <meshToonMaterial color={color} />}
      </mesh>
      {outline > 0 && <Hull thickness={outline}>{children}</Hull>}
    </group>
  );
}

// An egg is a slightly stretched sphere
export function EggMesh(props: Omit<GroupProps, 'children'>) {
  return (
    <Toon color={SHELL} scale={[1, 1.28, 1]} {...props}>
      <sphereGeometry args={[0.22, 32, 24]} />
    </Toon>
  );
}
