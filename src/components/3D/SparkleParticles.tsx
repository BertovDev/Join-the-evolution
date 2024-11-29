import * as THREE from "three";
import React, { createRef, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { GestureResult } from "../../types";

type ParticleProps = {
  gesture: GestureResult | null;
  activate: boolean;
};

const Particles: React.FC<ParticleProps> = ({
  gesture,
  activate,
}: ParticleProps) => {
  const { pulse, velocity } = useControls({
    pulse: false,
    velocity: {
      value: 1,
      max: 2,
      step: 0.1,
    },
  });

  const particlesRef = createRef<THREE.Points>();
  const [pulsing, setPulsing] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);

  const clock = useRef<THREE.Clock>(new THREE.Clock(false));

  const particleCount = 1000;

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
    const elapse = state.clock.getElapsedTime();

    if (particlesRef.current) {
      if (gesture?.gesture === "Open_Palm") {
        particlesRef.current.rotation.x = elapse * velocity * 2;
        particlesRef.current.rotation.y = elapse * velocity * 2;
      } else {
        particlesRef.current.rotation.x = elapse * velocity;
        particlesRef.current.rotation.y = elapse * velocity;
      }

      // Add pulsing effect
      if (
        gesture?.gesture === "Close_Fist" &&
        particlesRef.current.scale.x < 2.5
      ) {
        if (clock.current.running === false) {
          clock.current.start();
        }

        const scale = 1 - Math.sin(clock.current.getElapsedTime()) * 2.0;
        setScale((prev) => scale);
        particlesRef.current.scale.set(scale, scale, scale);
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
};

export { Particles };
