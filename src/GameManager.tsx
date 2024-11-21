import React from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

export default function GameManager() {
  return (
    <Canvas
      camera={{
        fov: 45,
        far: 200,
        near: 0.1,
      }}
    >
      <OrbitControls />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      <ambientLight intensity={1} />
    </Canvas>
  );
}
