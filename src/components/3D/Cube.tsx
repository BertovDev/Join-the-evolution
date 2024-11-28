import { MeshProps, useFrame } from "@react-three/fiber";
import React, { createRef, useMemo, useRef } from "react";
import { Color, Mesh } from "three";
import vertexShader from "../../shaders/vertex.glsl";
import fragmentShader from "../../shaders/fragment.glsl";
import { useControls } from "leva";
import * as THREE from "three";
import { GestureResult } from "../../types";

interface CubeProps {
  gesture: GestureResult | null;
}

const Cube: React.FC<CubeProps> = ({ gesture }: CubeProps) => {
  const cubeRef = useRef<Mesh>(null!);

  const { amplitude, frequency, timeScale } = useControls({
    amplitude: {
      value: -0.2,
    },
    frequency: {
      value: 0.2,
    },
    timeScale: {
      value: 0.1,
      min: -1,
      max: 2,
      step: 0.1,
    },
  });

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
      uColorA: {
        value: new THREE.Color("#FFE486"),
      },
      uColorB: {
        value: new THREE.Color("#030303"),
      },
      uAmplitude: {
        value: amplitude,
      },
      uDisplacement: {
        value: frequency,
      },
      uTimeScale: {
        value: timeScale,
      },
    }),
    []
  );

  useFrame((state) => {
    if (gesture?.gesture === "Close_Fist") {
      uniforms.uTimeScale.value += 1.6;
    }
    uniforms.uDisplacement.value = frequency;
    uniforms.uAmplitude.value = amplitude;
    uniforms.uTime.value = state.clock.getElapsedTime();
    uniforms.uTimeScale.value = timeScale;
  });

  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={1}
      ref={cubeRef}
    >
      <icosahedronGeometry args={[1, 32]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

export default React.memo(Cube);
