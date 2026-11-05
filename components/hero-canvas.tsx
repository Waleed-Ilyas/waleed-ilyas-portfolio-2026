"use client";

import { Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

function ParticleField() {
  const group = useRef<THREE.Group>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const count = 300;
  const network = useMemo(() => {
    const nodeCount = 76;
    const nodes = new Float32Array(nodeCount * 3);
    const edges: number[] = [];
    let seed = 2026;
    const random = () => {
      seed = (seed * 1_664_525 + 1_013_904_223) % 4_294_967_296;
      return seed / 4_294_967_296;
    };
    for (let index = 0; index < nodeCount; index += 1) {
      const angle = random() * Math.PI * 2;
      const vertical = random() * 2 - 1;
      const radius = 1.05 + random() * 0.85;
      const planar = Math.sqrt(1 - vertical * vertical);
      nodes[index * 3] = Math.cos(angle) * planar * radius;
      nodes[index * 3 + 1] = vertical * radius * 0.72;
      nodes[index * 3 + 2] = Math.sin(angle) * planar * radius * 0.5;
    }
    for (let a = 0; a < nodeCount; a += 1) {
      for (let b = a + 1; b < nodeCount; b += 1) {
        const dx = nodes[a * 3] - nodes[b * 3];
        const dy = nodes[a * 3 + 1] - nodes[b * 3 + 1];
        const dz = nodes[a * 3 + 2] - nodes[b * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < 0.19) {
          edges.push(
            nodes[a * 3],
            nodes[a * 3 + 1],
            nodes[a * 3 + 2],
            nodes[b * 3],
            nodes[b * 3 + 1],
            nodes[b * 3 + 2],
          );
        }
      }
    }
    return { nodes, links: new Float32Array(edges) };
  }, []);
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
      const radius = 1.35 + random() * 1.15;
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
          color="#9be6c8"
          size={0.014}
          sizeAttenuation
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[network.links, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#77e0b8" transparent opacity={0.28} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[network.nodes, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#c5f7e2" size={0.035} sizeAttenuation transparent opacity={0.78} />
      </points>
      <Float speed={0.3} rotationIntensity={0.06} floatIntensity={0.04}>
        <mesh>
          <icosahedronGeometry args={[0.44, 1]} />
          <meshBasicMaterial color="#77e0b8" wireframe transparent opacity={0.12} />
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
