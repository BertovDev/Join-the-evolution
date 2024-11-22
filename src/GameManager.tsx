import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Cube from "./components/3D/Cube";

interface GameManagerProps {
  gestures: string | undefined;
}

export default function GameManager({ gestures }: GameManagerProps) {
  return (
    <Canvas
      camera={{
        fov: 45,
        far: 200,
        near: 0.1,
      }}
    >
      <OrbitControls />
      <Cube gestures={gestures} />
      <ambientLight intensity={1} />
    </Canvas>
  );
}
