import { MeshProps, useFrame } from "@react-three/fiber";
import React, { createRef, useMemo, useRef } from "react";
import { Color, Mesh } from "three";
import vertexShader from "../../shaders/vertex.glsl";
import fragmentShader from "../../shaders/fragment.glsl";
import { useControls } from "leva";
import * as THREE from "three";

interface CubeProps {
  gestures: string | undefined;
}

export default function Cube({ gestures }: CubeProps) {
  const cubeRef = useRef<Mesh>(null!);

  const { amplitude, frequency, colorB } = useControls({
    amplitude: {
      value: -0.2,
    },
    frequency: {
      value: 1,
    },
    colorB: {
      value: new THREE.Color("#9c1f32"),
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
      uFrequency: {
        value: frequency,
      },
    }),
    []
  );

  useFrame((state) => {
    if (cubeRef.current) {
      if (gestures === "Open_Palm") {
        cubeRef.current.position.z -= 0.11;
      } else if (gestures === "Closed_Fist") {
        uniforms.uFrequency.value += 0.04;
      }
    }

    // uniforms.uFrequency.value = frequency;
    uniforms.uAmplitude.value = amplitude;
    // uniforms.uColorB.value = colorB;
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
}
