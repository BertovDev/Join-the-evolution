import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Cube from "./components/3D/Cube";
import { GestureResult } from "./types";
import React from "react";
import { Particles } from "./components/3D/SparkleParticles";

interface GameManagerProps {
  gesture: GestureResult | null;
}

const GameManager: React.FC<GameManagerProps> = ({
  gesture,
}: GameManagerProps) => {
  return (
    <Canvas
      camera={{
        fov: 45,
        far: 200,
        near: 0.1,
      }}
    >
      <OrbitControls />
      <Cube gesture={gesture} />
      <Particles />
      <ambientLight intensity={1} />
    </Canvas>
  );
};

export default React.memo(GameManager);
