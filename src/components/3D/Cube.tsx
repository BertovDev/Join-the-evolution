import { MeshProps, useFrame } from "@react-three/fiber";
import React, { createRef, useRef } from "react";
import { Mesh } from "three";

interface CubeProps {
  gestures: string | undefined;
}

export default function Cube({ gestures }: CubeProps) {
  const cubeRef = useRef<Mesh>(null!);

  useFrame(() => {
    if (cubeRef.current) {
      if (gestures === "Open_Palm") {
        cubeRef.current.position.z -= 0.11;
      } else if (gestures === "Closed_Fist") {
        cubeRef.current.position.z += 0.11;
      }
    }
  });

  return (
    <mesh position={[0, 0, 0]} ref={cubeRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}
