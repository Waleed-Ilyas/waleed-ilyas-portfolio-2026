"use client";

import { Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

function ParticleField() {
  const group = useRef<THREE.Group>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const count = window.innerWidth < 640 ? 360 : 800;
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    let seed = 42;
    const random = () => {
      seed = (seed * 1_664_525 + 1_013_904_223) % 4_294_967_296;
      return seed / 4_294_967_296;
    };
    for (let index = 0; index < count; index += 1) {
      const azimuth = random() * Math.PI * 2;
      const vertical = random() * 2 - 1;
      const radius = 1.05 + random() * 1.35;
      const planar = Math.sqrt(1 - vertical * vertical);
      values[index * 3] = Math.cos(azimuth) * planar * radius;
      values[index * 3 + 1] = vertical * radius * 0.72;
      values[index * 3 + 2] = Math.sin(azimuth) * planar * radius * 0.55;
    }
    return values;
  }, [count]);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.current.x = (event.clientX / window.innerWidth - 0.5) * 0.28;
      pointerTarget.current.y = (event.clientY / window.innerHeight - 0.5) * 0.18;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      state.clock.elapsedTime * 0.025 + pointerTarget.current.x,
      1.8,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      pointerTarget.current.y,
      1.8,
      delta,
    );
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#aa9cff"
          size={0.012}
          sizeAttenuation
          transparent
          opacity={0.68}
          depthWrite={false}
        />
      </points>
      <Float speed={0.5} rotationIntensity={0.13} floatIntensity={0.08}>
        <mesh>
          <torusKnotGeometry args={[0.48, 0.004, 140, 5, 2, 3]} />
          <meshBasicMaterial color="#00d9ff" wireframe transparent opacity={0.28} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroCanvas() {
  return (
    <div className="hero-canvas-slot" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 48 }}
        dpr={[1, 1.25]}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        fallback={null}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
}
