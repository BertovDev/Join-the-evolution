import { Canvas } from "@react-three/fiber";
import { Loader, OrbitControls } from "@react-three/drei";
import Cube from "./components/3D/Cube";
import { GestureResult } from "./types";
import React from "react";
import { Particles } from "./components/3D/SparkleParticles";
import { useControls } from "leva";

interface GameManagerProps {
  gesture: GestureResult | null;
}

const GameManager: React.FC<GameManagerProps> = ({
  gesture,
}: GameManagerProps) => {
  const { activate } = useControls({
    activate: false,
  });

  return (
    <Canvas
      className="z-20"
      camera={{
        fov: 45,
        far: 200,
        near: 0.1,
      }}
    >
      <OrbitControls />
      <Cube gesture={gesture} />
      <Particles gesture={gesture} activate={activate} />
      <ambientLight intensity={1} />
    </Canvas>
  );
};

export default React.memo(GameManager);
