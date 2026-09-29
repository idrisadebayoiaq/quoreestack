"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const PLANES = [
  { label: "Interface", z: 0.9, y: 0.55, tint: 0xfff4ea },
  { label: "API", z: 0, y: 0, tint: 0xf1d6c4 },
  { label: "Data", z: -0.9, y: -0.55, tint: 0xe0906a },
] as const;

/** Rounded-rectangle outline with a few "interface rows", drawn once to a canvas texture. */
function makePanelTexture(tint: number, rows: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext("2d")!;
  const color = `#${tint.toString(16).padStart(6, "0")}`;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255, 253, 248, 0.06)";
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.9;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(6, 6, 500, 308, 26);
  ctx.fill();
  ctx.stroke();

  ctx.globalAlpha = 0.55;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(36, 36, 150, 14, 7);
  ctx.fill();

  ctx.globalAlpha = 0.28;
  for (let i = 0; i < rows; i++) {
    const width = 420 - ((i * 67) % 180);
    ctx.beginPath();
    ctx.roundRect(36, 90 + i * 44, width, 12, 6);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(0, 0, 10.5);

    const stack = new THREE.Group();
    stack.position.set(0.9, 0.1, 0);
    stack.rotation.set(-0.42, -0.62, -0.08);
    scene.add(stack);

    const disposables: Array<{ dispose: () => void }> = [];
    const panels = PLANES.map((plane, index) => {
      const texture = makePanelTexture(plane.tint, 4 - index);
      const geometry = new THREE.PlaneGeometry(3.2, 2);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, plane.y, plane.z);
      stack.add(mesh);
      disposables.push(texture, geometry, material);
      return mesh;
    });

    const glowGeometry = new THREE.CircleGeometry(2.6, 48);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xe0906a,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.set(1.2, -0.1, -2.2);
    scene.add(glow);
    disposables.push(glowGeometry, glowMaterial);

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let visible = true;
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) start();
    });
    intersection.observe(mount);

    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const clock = new THREE.Clock(false);
    let elapsed = 0;
    let frame = 0;
    let running = false;
    let firstFrame = true;

    const render = () => {
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      elapsed += Math.min(clock.getDelta(), 0.1);
      const t = elapsed;
      eased.x += (pointer.x - eased.x) * 0.04;
      eased.y += (pointer.y - eased.y) * 0.04;

      stack.rotation.y = -0.62 + eased.x * 0.12;
      stack.rotation.x = -0.42 + eased.y * 0.08;
      panels.forEach((panel, index) => {
        panel.position.y = PLANES[index].y + Math.sin(t * 0.5 + index * 1.3) * 0.06;
      });

      renderer.render(scene, camera);
      if (firstFrame) {
        firstFrame = false;
        setReady(true);
      }
      frame = requestAnimationFrame(render);
    };

    function start() {
      if (running) return;
      running = true;
      clock.getDelta();
      frame = requestAnimationFrame(render);
    }
    start();

    return () => {
      cancelAnimationFrame(frame);
      running = false;
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}
