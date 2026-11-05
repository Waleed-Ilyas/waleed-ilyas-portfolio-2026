"use client";

import { Edges, Html, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const layerY = [1.62, 0.53, -0.56, -1.65];
const layerInfo = [
  { name: "UI", detail: "React / Next.js" },
  { name: "API", detail: "Node / Express" },
  { name: "DATABASE", detail: "MongoDB / SQL" },
  { name: "CHAIN", detail: "Solana / Anchor" },
];

function StackLayer({ index, name, detail }: { index: number; name: string; detail: string }) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const assembledAt = 0.12 + index * 0.13;

  useFrame(({ clock }) => {
    if (!group.current) return;
    const progress = THREE.MathUtils.clamp((clock.elapsedTime - assembledAt) / 0.48, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    group.current.scale.set(0.78 + eased * 0.22, 0.72 + eased * 0.28, 0.78 + eased * 0.22);
    group.current.position.y = layerY[index] + (1 - eased) * 0.3;
    if (material.current) material.current.opacity = 0.24 + eased * 0.13;
  });

  return (
    <group ref={group} position={[index % 2 === 0 ? -0.06 : 0.06, layerY[index] + 0.3, 0]}>
      <mesh>
        <boxGeometry args={[2.78, 0.52, 0.58]} />
        <meshStandardMaterial
          ref={material}
          color="#17372b"
          transparent
          opacity={0.26}
          roughness={0.34}
          metalness={0.25}
          depthWrite={false}
        />
        <Edges color="#77e0b8" opacity={0.82} threshold={1} />
      </mesh>
      <mesh position={[-1.12, 0, 0.301]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color={index === 3 ? "#a99aff" : "#77e0b8"} />
      </mesh>
      <Html transform position={[-0.7, -0.005, 0.31]} distanceFactor={5.8}>
        <span className="hero-scene-label">
          <strong>{name}</strong>
          <small>{detail}</small>
        </span>
      </Html>
      <Html transform position={[1.14, -0.005, 0.31]} distanceFactor={5.8}>
        <span className="hero-scene-index">{String(index + 1).padStart(2, "0")}</span>
      </Html>
    </group>
  );
}

function ChainEnd() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      Math.sin(clock.elapsedTime * 0.42) * 0.16 + clock.elapsedTime * 0.05,
      2,
      delta,
    );
    group.current.position.y = -2.61 + Math.sin(clock.elapsedTime * 0.8) * 0.025;
  });

  return (
    <group ref={group} position={[0, -2.61, 0]}>
      <lineSegments position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([-0.39, 0, 0, -0.23, 0, 0, 0.23, 0, 0, 0.39, 0, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#77e0b8" transparent opacity={0.75} />
      </lineSegments>
      {[-0.59, 0, 0.59].map((x, index) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0.16, index * 0.38, 0]}>
          <boxGeometry args={[0.34, 0.34, 0.34]} />
          <meshStandardMaterial
            color={index === 1 ? "#183a2e" : "#10271f"}
            emissive={index === 1 ? "#a99aff" : "#23644b"}
            emissiveIntensity={index === 1 ? 0.22 : 0.52}
            roughness={0.32}
            metalness={0.38}
          />
          <Edges color={index === 1 ? "#b7aaff" : "#8cf0c9"} opacity={0.95} threshold={10} />
        </mesh>
      ))}
      <pointLight position={[0, 0.12, 0.48]} color="#a99aff" intensity={1.25} distance={2.6} />
    </group>
  );
}

function ParticleStream({
  count,
  pointer,
}: {
  count: number;
  pointer: { current: { x: number; y: number } };
}) {
  const geometry = useRef<THREE.BufferGeometry>(null);
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const lanes = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        stream: index % 3,
        phase: (Math.floor(index / 3) / Math.ceil(count / 3)) % 1,
        x: [-0.44, 0, 0.44][index % 3] + (((index * 17) % 13) / 12 - 0.5) * 0.12,
        speed: 0.38 + ((index * 19) % 35) / 100,
      })),
    [count],
  );

  useFrame(({ clock }) => {
    if (!geometry.current) return;
    const elapsed = clock.elapsedTime;
    lanes.forEach((lane, index) => {
      const phase = (lane.phase + elapsed * lane.speed * 0.28) % 1;
      const upper = layerY[lane.stream] - 0.3;
      const lower = layerY[lane.stream + 1] + 0.3;
      const drift = Math.sin(elapsed * 1.6 + index * 0.7) * 0.045;
      const baseX = lane.x * 1.52 + drift;
      const dx = pointer.current.x * 1.35 - baseX;
      const dy = pointer.current.y * 2.1 - (upper + (lower - upper) * phase);
      const pull = Math.max(0, 1 - Math.hypot(dx, dy) / 1.5) * 0.17;
      positions[index * 3] = baseX + dx * pull;
      positions[index * 3 + 1] = upper + (lower - upper) * phase + dy * pull;
      positions[index * 3 + 2] = 0.31 + Math.sin(elapsed * 2 + index) * 0.045;
    });
    const attribute = geometry.current.attributes.position as THREE.BufferAttribute;
    attribute.needsUpdate = true;
    if (attribute.usage !== THREE.DynamicDrawUsage) attribute.setUsage(THREE.DynamicDrawUsage);
  });

  return (
    <points>
      <bufferGeometry ref={geometry}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#8ff0c8"
        size={0.038}
        sizeAttenuation
        transparent
        opacity={0.94}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function StackScene({ quality }: { quality: "high" | "low" }) {
  const stack = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const count = quality === "high" ? 66 : 30;

  useEffect(() => {
    const art = document.querySelector<HTMLElement>(".hero-art");
    const onPointerMove = (event: PointerEvent) => {
      if (!art) return;
      const bounds = art.getBoundingClientRect();
      pointer.current.x = THREE.MathUtils.clamp(
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
        -1,
        1,
      );
      pointer.current.y = THREE.MathUtils.clamp(
        (0.5 - (event.clientY - bounds.top) / bounds.height) * 2,
        -1,
        1,
      );
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useFrame(({ clock, camera }, delta) => {
    const scroll = THREE.MathUtils.clamp(window.scrollY / Math.max(window.innerHeight, 1), 0, 1);
    const cameraY = -scroll * 0.88;
    camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraY, 1.5, delta);
    camera.lookAt(0, camera.position.y, 0);
    if (stack.current) {
      const scale = 1 - scroll * 0.12;
      stack.current.scale.setScalar(THREE.MathUtils.damp(stack.current.scale.x, scale, 1.8, delta));
      stack.current.position.y = Math.sin(clock.elapsedTime * 0.35) * 0.025;
      stack.current.rotation.x = THREE.MathUtils.damp(
        stack.current.rotation.x,
        pointer.current.y * 0.12,
        2.1,
        delta,
      );
      stack.current.rotation.y = THREE.MathUtils.damp(
        stack.current.rotation.y,
        pointer.current.x * 0.14,
        2.1,
        delta,
      );
    }
  });

  return (
    <group ref={stack}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[-3, 3, 5]} intensity={1.1} color="#d8ffed" />
      {layerInfo.map((layer, index) => (
        <StackLayer key={layer.name} index={index} {...layer} />
      ))}
      <ParticleStream count={count} pointer={pointer} />
      <ChainEnd />
    </group>
  );
}

export default function HeroCanvas() {
  const [quality, setQuality] = useState<"high" | "low">("high");
  const slot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScrollDrift = () => {
      if (!slot.current) return;
      const progress = THREE.MathUtils.clamp(
        window.scrollY / Math.max(window.innerHeight, 1),
        0,
        1,
      );
      const sceneHeight = slot.current.clientHeight;
      const viewHeight = 2 * 7.1 * Math.tan((43 * Math.PI) / 360);
      const drift = -(progress * 0.88 * (sceneHeight / viewHeight));
      slot.current.style.setProperty("--scene-scroll-shift", `${drift}px`);
    };
    window.addEventListener("scroll", updateScrollDrift, { passive: true });
    updateScrollDrift();
    return () => window.removeEventListener("scroll", updateScrollDrift);
  }, []);

  return (
    <div className="hero-canvas-slot" aria-hidden="true" ref={slot}>
      <Canvas
        camera={{ position: [0, 0, 7.1], fov: 43, near: 0.1, far: 30 }}
        dpr={quality === "high" ? [1, 1.5] : [1, 1.1]}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        fallback={null}
      >
        <PerformanceMonitor
          onDecline={() => setQuality("low")}
          onIncline={() => setQuality("high")}
          onFallback={() => setQuality("low")}
          flipflops={2}
        >
          <StackScene quality={quality} />
        </PerformanceMonitor>
      </Canvas>
      <span className="hero-ui-label hero-scene-label">
        <strong>UI</strong>
        <small>React / Next.js</small>
      </span>
    </div>
  );
}
