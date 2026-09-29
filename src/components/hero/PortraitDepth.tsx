"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PortraitDepthProps = {
  src: string;
  /** Pointer position in [-1, 1], shared with the frame tilt so both move together. */
  pointer: { current: { x: number; y: number; active: boolean } };
};

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/*
 * The depth field is modelled by hand for this portrait (texture space, origin bottom-left):
 * an ellipsoid head, a nose bump, and lower, flatter shoulders. Pixels are displaced toward
 * the pointer in proportion to their depth, so the face turns while the wall stays put.
 */
const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D uImage;
  uniform vec2 uCover;
  uniform vec2 uPointer;
  uniform float uStrength;
  varying vec2 vUv;

  float ellipsoid(vec2 p, vec2 c, vec2 r) {
    vec2 e = (p - c) / r;
    float d = 1.0 - dot(e, e);
    return d > 0.0 ? pow(d, 0.65) : 0.0;
  }

  float depthAt(vec2 p) {
    float head = ellipsoid(p, vec2(0.495, 0.585), vec2(0.2, 0.3));
    vec2 n = (p - vec2(0.475, 0.555)) / 0.06;
    float nose = exp(-dot(n, n)) * 0.3 * step(0.001, head);
    float shoulders = ellipsoid(p, vec2(0.56, -0.02), vec2(0.5, 0.4)) * 0.4;
    return max(head + nose, shoulders);
  }

  void main() {
    vec2 uv = (vUv - 0.5) * uCover + 0.5;
    float depth = depthAt(uv);
    vec2 shifted = uv - uPointer * depth * uStrength;
    gl_FragColor = texture2D(uImage, clamp(shifted, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`;

export default function PortraitDepth({ src, pointer }: PortraitDepthProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "low-power" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
      uImage: { value: null as THREE.Texture | null },
      uCover: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uStrength: { value: 0.045 },
    };
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    scene.add(new THREE.Mesh(geometry, material));

    let imageAspect = 1;
    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      const boxAspect = clientWidth / clientHeight;
      uniforms.uCover.value.set(
        boxAspect < imageAspect ? boxAspect / imageAspect : 1,
        boxAspect < imageAspect ? 1 : imageAspect / boxAspect,
      );
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    let disposed = false;
    let texture: THREE.Texture | null = null;
    new THREE.TextureLoader().load(src, (loaded) => {
      if (disposed) {
        loaded.dispose();
        return;
      }
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.minFilter = THREE.LinearFilter;
      loaded.generateMipmaps = false;
      texture = loaded;
      uniforms.uImage.value = loaded;
      const image = loaded.image as { width: number; height: number };
      imageAspect = image.width / image.height;
      resize();
      start();
    });

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

    const eased = { x: 0, y: 0 };
    let elapsed = 0;
    let last = 0;
    let frame = 0;
    let running = false;
    let firstFrame = true;

    const render = (now: number) => {
      if (!visible || document.hidden || !uniforms.uImage.value) {
        running = false;
        return;
      }
      elapsed += Math.min((now - (last || now)) / 1000, 0.1);
      last = now;

      const target = pointer.current.active
        ? pointer.current
        : { x: Math.sin(elapsed * 0.55) * 0.45, y: Math.sin(elapsed * 0.4) * 0.25 };
      eased.x += (target.x - eased.x) * 0.06;
      eased.y += (target.y - eased.y) * 0.06;
      uniforms.uPointer.value.set(eased.x, eased.y);

      renderer.render(scene, camera);
      if (firstFrame) {
        firstFrame = false;
        setReady(true);
      }
      frame = requestAnimationFrame(render);
    };

    function start() {
      if (running || disposed) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(render);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      texture?.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [src, pointer]);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}
