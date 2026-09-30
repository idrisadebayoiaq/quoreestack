"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type PortraitDepthProps = {
  src: string;
  /** Pointer position in [-1, 1]; `active` is false when there is no mouse (touch, left window). */
  pointer: { current: { x: number; y: number; active: boolean } };
  onReady?: () => void;
};

/*
 * The cut-out photo is mapped onto a dense plane and pushed into relief in the vertex shader:
 * a blurred copy of the alpha mask rounds the body's edges, and an ellipsoid plus a nose bump
 * (hand-placed for this portrait, texture space with origin bottom-left) shape the head.
 * Rotating the mesh toward the pointer then reads as the figure turning in 3D.
 */
const vertexShader = /* glsl */ `
  uniform sampler2D uImage;
  uniform float uDepth;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;

  float ellipsoid(vec2 p, vec2 c, vec2 r) {
    vec2 e = (p - c) / r;
    return sqrt(max(1.0 - dot(e, e), 0.0));
  }

  float mask(vec2 p) {
    float sum = 0.0;
    for (int i = 0; i < 12; i++) {
      float a = float(i) * 0.5236;
      sum += texture2D(uImage, p + vec2(cos(a), sin(a)) * 0.045).a;
      sum += texture2D(uImage, p + vec2(cos(a), sin(a)) * 0.022).a;
    }
    return sum / 24.0;
  }

  float depthAt(vec2 p) {
    float body = smoothstep(0.0, 1.0, mask(p)) * 0.35;
    float head = ellipsoid(p, uHead.xy, uHead.zw);
    vec2 n = (p - uNose) / 0.055;
    float nose = exp(-dot(n, n)) * 0.22 * step(0.001, head);
    return body + (head * 0.45 + nose) * texture2D(uImage, p).a;
  }

  void main() {
    vUv = uv;
    float e = 0.004;
    float d = depthAt(uv);
    float dx = depthAt(uv + vec2(e, 0.0)) - d;
    float dy = depthAt(uv + vec2(0.0, e)) - d;
    vec3 displaced = position + vec3(0.0, 0.0, d * uDepth);
    vec3 localNormal = normalize(vec3(-dx * uDepth / (e * 2.0), -dy * uDepth / (e * 2.0), 1.0));
    vNormal = normalize(normalMatrix * localNormal);
    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uImage;
  uniform vec3 uLight;
  uniform vec3 uRim;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec4 tex = texture2D(uImage, vUv);
    float alpha = tex.a * smoothstep(0.0, 0.12, vUv.y)
      * smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
    if (alpha < 0.02) discard;
    vec3 n = normalize(vNormal);
    float diffuse = max(dot(n, normalize(uLight)), 0.0);
    float rim = pow(1.0 - max(dot(n, normalize(vView)), 0.0), 3.0) * smoothstep(0.85, 1.0, tex.a);
    vec3 color = tex.rgb * (0.9 + diffuse * 0.16) + uRim * rim * 0.12;
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`;

// The figure turns around a point behind the photo so it swings toward the
// pointer; pivoting at the photo plane makes it read as leaning away.
const PIVOT_OFFSET = 0.6;

function makeDotTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export default function PortraitDepth({ src, pointer, onReady }: PortraitDepthProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(18, 1, 0.1, 40);
    const disposables: Array<{ dispose: () => void }> = [];

    const uniforms = {
      uImage: { value: null as THREE.Texture | null },
      uDepth: { value: 0.5 },
      uHead: { value: new THREE.Vector4(0.435, 0.684, 0.19, 0.28) },
      uNose: { value: new THREE.Vector2(0.398, 0.589) },
      uLight: { value: new THREE.Vector3(-0.5, 0.6, 1) },
      uRim: { value: new THREE.Color(0xff7a2e) },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `uniform vec4 uHead;\nuniform vec2 uNose;\n${vertexShader}`,
      fragmentShader,
      transparent: true,
    });
    disposables.push(material);

    const figure = new THREE.Group();
    scene.add(figure);
    let mesh: THREE.Mesh | null = null;
    let planeSize = { w: 2, h: 2 };

    const dotTexture = makeDotTexture();
    const particleCount = 140;
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3.6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
      positions[i * 3 + 2] = -0.4 - Math.random() * 1.8;
      speeds[i] = 0.04 + Math.random() * 0.08;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff8a3d,
      size: 0.035,
      map: dotTexture,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    disposables.push(dotTexture, particleGeometry, particleMaterial);

    const fitCamera = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
      const fitHeight = planeSize.h / 2 / Math.tan(halfFov);
      const fitWidth = planeSize.w / 2 / (Math.tan(halfFov) * camera.aspect);
      camera.position.set(0, 0, Math.max(fitHeight, fitWidth) * 1.06 + 0.3 + PIVOT_OFFSET);
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(fitCamera);
    resizeObserver.observe(mount);

    let disposed = false;
    new THREE.TextureLoader().load(src, (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      uniforms.uImage.value = texture;
      disposables.push(texture);

      const image = texture.image as { width: number; height: number };
      const aspect = image.width / image.height;
      planeSize = aspect >= 1 ? { w: 2, h: 2 / aspect } : { w: 2 * aspect, h: 2 };
      const geometry = new THREE.PlaneGeometry(planeSize.w, planeSize.h, 200, 200);
      disposables.push(geometry);
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, -planeSize.h * 0.08, PIVOT_OFFSET);
      figure.add(mesh);
      fitCamera();
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
      if (!visible || document.hidden || !mesh) {
        running = false;
        return;
      }
      const delta = Math.min((now - (last || now)) / 1000, 0.1);
      elapsed += delta;
      last = now;

      const target = pointer.current.active
        ? pointer.current
        : { x: Math.sin(elapsed * 0.5) * 0.5, y: Math.sin(elapsed * 0.37) * 0.25 };
      eased.x += (target.x - eased.x) * 0.07;
      eased.y += (target.y - eased.y) * 0.07;

      figure.rotation.y = eased.x * 0.36;
      figure.rotation.x = -eased.y * 0.18;
      figure.position.y = Math.sin(elapsed * 0.9) * 0.025;
      uniforms.uLight.value.set(-0.5 + eased.x * 0.6, 0.6 + eased.y * 0.4, 1);

      const array = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        array[i * 3 + 1] += speeds[i] * delta;
        if (array[i * 3 + 1] > 1.6) array[i * 3 + 1] = -1.6;
      }
      particleGeometry.attributes.position.needsUpdate = true;
      particles.rotation.y = eased.x * 0.12;

      renderer.render(scene, camera);
      if (firstFrame) {
        firstFrame = false;
        setReady(true);
        onReadyRef.current?.();
      }
      frame = requestAnimationFrame(render);
    };

    function start() {
      if (running || disposed || !mesh) return;
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
      disposables.forEach((item) => item.dispose());
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
