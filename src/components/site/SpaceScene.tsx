import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OrthographicCamera,
  PointLight,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  WebGLRenderer,
} from "three";

function createPlanetTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create the planet texture canvas.");

  const bands = context.createLinearGradient(0, 0, 0, canvas.height);
  bands.addColorStop(0, "#31263d");
  bands.addColorStop(0.14, "#d4c6d6");
  bands.addColorStop(0.21, "#6e5d78");
  bands.addColorStop(0.31, "#e5dbe6");
  bands.addColorStop(0.39, "#a18da8");
  bands.addColorStop(0.47, "#eee8ee");
  bands.addColorStop(0.56, "#59485f");
  bands.addColorStop(0.66, "#d9cbdc");
  bands.addColorStop(0.73, "#8f7b99");
  bands.addColorStop(0.84, "#e7dce8");
  bands.addColorStop(0.93, "#76667f");
  bands.addColorStop(1, "#261d30");
  context.fillStyle = bands;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += 2) {
    const wave = Math.sin(y * 0.037) * 4 + Math.sin(y * 0.011) * 8;
    const opacity = 0.08 + ((Math.sin(y * 0.083) + 1) / 2) * 0.15;
    context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    context.fillRect(wave, y, canvas.width - wave * 2, 1);
  }

  for (let index = 0; index < 38; index += 1) {
    const y = index * 14 + Math.sin(index * 2.17) * 8;
    context.beginPath();
    context.moveTo(0, y);
    context.bezierCurveTo(
      canvas.width * 0.28,
      y + Math.sin(index) * 22,
      canvas.width * 0.68,
      y - Math.cos(index * 1.4) * 18,
      canvas.width,
      y + Math.sin(index * 0.7) * 12,
    );
    context.strokeStyle = index % 3 === 0 ? "rgba(54, 38, 67, 0.22)" : "rgba(255, 255, 255, 0.12)";
    context.lineWidth = index % 4 === 0 ? 8 : 3;
    context.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function createStars(width: number, height: number) {
  const count = 420;
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * width;
    positions[index * 3 + 1] = (Math.random() - 0.5) * height;
    positions[index * 3 + 2] = -12 - Math.random() * 9;
  }
  return positions;
}

export function SpaceScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    return mountSpaceScene(host);
  }, []);

  return <div ref={hostRef} aria-hidden="true" className="space-scene" />;
}

function mountSpaceScene(host: HTMLDivElement): () => void {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch (error) {
    console.error("Could not initialize the portfolio's 3D space scene.", error);
    return () => {};
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.className = "space-scene-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.set(0, 0, 12);

  scene.add(new AmbientLight(0xc9bbda, 1.3));
  const sunlight = new DirectionalLight(0xfff5ff, 2.3);
  sunlight.position.set(-4, 5, 7);
  scene.add(sunlight);
  const rimLight = new PointLight(0x8e47ff, 28, 14);
  rimLight.position.set(3.2, 1.7, -1.5);
  scene.add(rimLight);

  const positions = createStars(18, 12);
  const starGeometry = new BufferGeometry();
  starGeometry.setAttribute("position", new BufferAttribute(positions, 3));
  const starMaterial = new PointsMaterial({
    color: 0xe9e3f2,
    size: 1.5,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0.68,
    depthWrite: false,
  });
  const stars = new Points(starGeometry, starMaterial);
  scene.add(stars);

  const planetSystem = new Group();
  scene.add(planetSystem);

  const planetTexture = createPlanetTexture();
  const planet = new Mesh(
    new SphereGeometry(0.76, 96, 64),
    new MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.8,
      metalness: 0.08,
    }),
  );
  planet.rotation.z = -0.12;
  planetSystem.add(planet);

  const atmosphere = new Mesh(
    new SphereGeometry(0.8, 48, 32),
    new MeshBasicMaterial({
      color: 0xcda7ff,
      side: BackSide,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    }),
  );
  planetSystem.add(atmosphere);

  const ringGeometry = new RingGeometry(1.02, 2.05, 192, 8);
  const ringColors: number[] = [];
  const ringPositions = ringGeometry.getAttribute("position");
  for (let index = 0; index < ringPositions.count; index += 1) {
    const radius = Math.hypot(ringPositions.getX(index), ringPositions.getY(index));
    const band = Math.sin(radius * 44) * 0.18 + Math.sin(radius * 103) * 0.12;
    const lightness = MathUtils.clamp(0.44 + band, 0.2, 0.68);
    const color = new Color().setHSL(0.78, 0.12, lightness);
    const opacity = 0.38 + (Math.sin(radius * 137) + 1) * 0.2;
    ringColors.push(color.r, color.g, color.b, opacity);
  }
  ringGeometry.setAttribute("color", new Float32BufferAttribute(ringColors, 4));
  const ringMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    vertexColors: true,
    side: DoubleSide,
    transparent: true,
    opacity: 0.72,
    roughness: 0.8,
    metalness: 0.1,
    depthWrite: false,
  });
  const rings = new Group();
  rings.rotation.z = -0.46;
  const ringPlane = new Group();
  ringPlane.rotation.set(1.14, 0.08, 0);
  const ring = new Mesh(ringGeometry, ringMaterial);
  ringPlane.add(ring);
  rings.add(ringPlane);
  planetSystem.add(rings);

  const moonOrbit = new Group();
  const moon = new Mesh(
    new SphereGeometry(0.075, 24, 18),
    new MeshStandardMaterial({
      color: 0xe9dcff,
      roughness: 0.55,
      emissive: 0x25113e,
      emissiveIntensity: 0.2,
    }),
  );
  moon.position.set(2.8, 0.16, 0.12);
  moonOrbit.add(moon);
  planetSystem.add(moonOrbit);

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frameId = 0;
  let previousTime = 0;
  let isVisible = document.visibilityState === "visible";
  let isInViewport = true;
  let viewWidth = 0;
  let viewHeight = 0;

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    const aspect = width / height;
    viewHeight = 9;
    viewWidth = viewHeight * aspect;
    camera.left = -viewWidth / 2;
    camera.right = viewWidth / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);

    for (let index = 0; index < positions.length / 3; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * viewWidth;
      positions[index * 3 + 1] = (Math.random() - 0.5) * viewHeight;
    }
    starGeometry.attributes.position.needsUpdate = true;

    const scale = aspect < 0.7 ? 0.78 : aspect < 1.2 ? 0.92 : 1;
    planetSystem.scale.setScalar(scale);
    planetSystem.position.set(viewWidth * 0.1, viewHeight * 0.2, 0);
    renderer.render(scene, camera);
  };

  const animate = (time: number) => {
    frameId = window.requestAnimationFrame(animate);
    if (!isVisible || motionPreference.matches) return;
    if (time - previousTime < 1000 / 30) return;

    const delta = Math.min((time - previousTime) / 16.67 || 1, 2);
    previousTime = time;
    planet.rotation.y += 0.0024 * delta;
    rings.rotation.z += 0.0006 * delta;
    moonOrbit.rotation.y += 0.006 * delta;
    moon.rotation.y += 0.003 * delta;
    stars.rotation.z += 0.000035 * delta;
    starMaterial.opacity = 0.69 + (Math.sin(time * 0.00075) + 1) * 0.08;
    renderer.render(scene, camera);
  };

  const startAnimation = () => {
    if (!frameId && !motionPreference.matches && isVisible) {
      frameId = window.requestAnimationFrame(animate);
    }
  };
  const stopAnimation = () => {
    window.cancelAnimationFrame(frameId);
    frameId = 0;
    renderer.render(scene, camera);
  };
  const updateMotion = () => {
    if (motionPreference.matches) stopAnimation();
    else startAnimation();
  };
  const updateVisibility = () => {
    isVisible = document.visibilityState === "visible" && isInViewport;
    if (isVisible) startAnimation();
    else stopAnimation();
  };

  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    isInViewport = entry.isIntersecting;
    updateVisibility();
  });
  intersectionObserver.observe(host);
  motionPreference.addEventListener("change", updateMotion);
  document.addEventListener("visibilitychange", updateVisibility);
  startAnimation();

  return () => {
    window.cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    motionPreference.removeEventListener("change", updateMotion);
    document.removeEventListener("visibilitychange", updateVisibility);

    planet.geometry.dispose();
    planet.material.dispose();
    atmosphere.geometry.dispose();
    atmosphere.material.dispose();
    ringGeometry.dispose();
    ringMaterial.dispose();
    moon.geometry.dispose();
    moon.material.dispose();
    starGeometry.dispose();
    starMaterial.dispose();
    planetTexture.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
