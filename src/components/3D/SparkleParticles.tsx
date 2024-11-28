import * as THREE from "three";
import React, { createRef, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

function Particles() {
  const { pulse } = useControls({
    pulse: false,
  });

  const particlesRef = createRef<THREE.Points>();
  const [pulsing, setPulsing] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);

  const particleCount = 400;

  let positions = [];

  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 1.2 + Math.random() * 0.3;

    positions.push(radius * Math.sin(phi) * Math.cos(theta));
    positions.push(radius * Math.sin(phi) * Math.sin(theta));
    positions.push(radius * Math.cos(phi));
  }

  let floatArray = new Float32Array(positions);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;

      // Add pulsing effect
      if (pulsing) {
        const scale = 1 + 0.08 + Math.sin(Date.now() / 1000) * 2.0;
        // scale = 0.08 + 0.01;
        setScale(() => scale);
        console.log(scale);
        particlesRef.current.scale.set(scale, scale, scale);
        if (particlesRef.current.scale.x > 2.5) {
          setPulsing(false);
        }
      }
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={floatArray}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color={new THREE.Color(0x4080ff)}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export { Particles };
