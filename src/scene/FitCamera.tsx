import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

const FIT = 0.63; // 2 · tan(fov / 2) for the 35° fov both scenes use

interface FitCameraProps {
  width: number; // world units that must stay visible horizontally
  height: number; // …and vertically
  lookY: number;
  elevation: number; // camera height gained per unit of distance
}

// Keep a width × height box in frame whatever the canvas aspect ratio
export default function FitCamera({ width, height, lookY, elevation }: FitCameraProps) {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    const distance = Math.max(height / FIT, width / (FIT * aspect));
    camera.position.set(0, lookY + 0.1 + distance * elevation, distance);
    camera.lookAt(0, lookY, 0);
  }, [camera, size, width, height, lookY, elevation]);
  return null;
}
