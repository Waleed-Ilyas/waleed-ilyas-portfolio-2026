"use client";

import { PerformanceMonitor, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const stages = [
  { lat: 34, lon: -50, color: "#a7f0cf" },
  { lat: 16, lon: 35, color: "#a7f0cf" },
  { lat: -26, lon: 48, color: "#a7f0cf" },
  { lat: -34, lon: -35, color: "#b5a8ff" },
];

function pointOnGlobe(lat: number, lon: number, radius: number) {
  const latitude = THREE.MathUtils.degToRad(lat);
  const longitude = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    radius * Math.cos(latitude) * Math.sin(longitude),
    radius * Math.sin(latitude),
    radius * Math.cos(latitude) * Math.cos(longitude),
  );
}

function GlobeGrid() {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const radius = 1.508;
    const steps = 72;
    for (const latitude of [-60, -30, 0, 30, 60]) {
      const points = Array.from({ length: steps + 1 }, (_, index) =>
        pointOnGlobe(latitude, (index / steps) * 360 - 180, radius),
      );
      for (let i = 0; i < points.length - 1; i++) positions.push(...points[i].toArray(), ...points[i + 1].toArray());
    }
    for (let longitude = -150; longitude < 180; longitude += 30) {
      const points = Array.from({ length: steps + 1 }, (_, index) =>
        pointOnGlobe((index / steps) * 180 - 90, longitude, radius),
      );
      for (let i = 0; i < points.length - 1; i++) positions.push(...points[i].toArray(), ...points[i + 1].toArray());
    }
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return buffer;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#b4f2d7" transparent opacity={0.2} depthWrite={false} />
    </lineSegments>
  );
}

function GlobeStages() {
  const path = useMemo(() => {
    const route = stages.map(({ lat, lon }) => pointOnGlobe(lat, lon, 1.526));
    const curve = new THREE.CatmullRomCurve3(route, true, "centripetal", 0.25);
    const points = curve.getPoints(160);
    const positions: number[] = [];
    for (let index = 0; index < points.length - 1; index++) {
      positions.push(...points[index].toArray(), ...points[index + 1].toArray());
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return { geometry, markers: route };
  }, []);

  useEffect(() => () => path.geometry.dispose(), [path]);

  return (
    <group>
      <lineSegments geometry={path.geometry}>
        <lineBasicMaterial color="#9be9c6" transparent opacity={0.47} depthWrite={false} />
      </lineSegments>
      {path.markers.map((point, index) => (
        <group key={index} position={point.toArray()}>
          <mesh>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color={stages[index].color} />
          </mesh>
          <mesh scale={1.7}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color={stages[index].color} transparent opacity={0.2} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RotatingEarth({ pointer }: { pointer: { current: { x: number; y: number } } }) {
  const group = useRef<THREE.Group>(null);
  const landTexture = useTexture("/images/globe-land-dots.png");
  landTexture.colorSpace = THREE.SRGBColorSpace;

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      clock.elapsedTime * 0.075 + pointer.current.x * 0.28,
      1.8,
      delta,
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      0.12 + pointer.current.y * 0.12,
      1.8,
      delta,
    );
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.49, 56, 40]} />
        <meshStandardMaterial color="#0b1714" roughness={0.8} metalness={0.12} />
      </mesh>
      <mesh scale={1.003}>
        <sphereGeometry args={[1.49, 64, 48]} />
        <meshBasicMaterial
          map={landTexture}
          transparent
          opacity={0.95}
          depthWrite={false}
          side={THREE.FrontSide}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={1.04}>
        <sphereGeometry args={[1.49, 40, 28]} />
        <meshBasicMaterial color="#73dfb4" transparent opacity={0.045} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <GlobeGrid />
      <GlobeStages />
    </group>
  );
}

function GlobeScene() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const art = document.querySelector<HTMLElement>(".hero-art");
    const onPointerMove = (event: PointerEvent) => {
      if (!art || event.pointerType === "touch") return;
      const bounds = art.getBoundingClientRect();
      pointer.current.x = THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - 0.5) * 2, -1, 1);
      pointer.current.y = THREE.MathUtils.clamp((0.5 - (event.clientY - bounds.top) / bounds.height) * 2, -1, 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return (
    <group>
      <ambientLight intensity={0.8} />
      <directionalLight position={[-3, 2, 5]} intensity={1.1} color="#e0fff0" />
      <RotatingEarth pointer={pointer} />
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
          <GlobeScene />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
