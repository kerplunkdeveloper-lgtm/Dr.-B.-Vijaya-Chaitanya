"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";

/**
 * Real Human 3D Cardiac Vasculature & Interventional Simulator (Three.js)
 * 
 * Hyper-Realistic Human Heart Anatomy & Ultra-Premium UX:
 * 1. Real Human 3D Mode: Living human myocardium with wet pericardial sheen,
 *    subsurface scattering, adipose tissue (fat deposits) along coronary sulci,
 *    striated muscle fibers, and true anatomical vessel split (Arterial Red vs Venous Slate Blue).
 * 2. Vintage Anatomical Etching Mode: Exact reproduction of classic Gray's Anatomy copperplate
 *    engraving with fine cross-hatching, muscle fiber lines, and ink contours.
 * 3. 3-Branch Aortic Arch: Brachiocephalic, Left Common Carotid, and Left Subclavian arteries.
 * 4. Pulmonary Trunk & Lateral Branches with anatomical fidelity.
 * 5. Full Interventional Angioplasty Simulator: LAD stenosis, catheter guidewire traversal,
 *    expanding balloon, Nitinol micro-lattice stent dilation, and oxygenated blood perfusion rush.
 * 6. Interactive 3D Landmark Pins with smooth camera focus and clinical procedure notes.
 * 7. Multi-angle 360° Presets (Anterior, Posterior, Left Lateral, Right Lateral, Superior Arch).
 * 8. Real Physiological Cardiac Cycle (Lub-Dub Double Beat) with interactive BPM controls (60, 72, 98, 115).
 */

export type HeartMode = "real" | "engraving";

type Assets = {
  body: { positions: Float32Array; normals: Float32Array };
  tubes: { positions: Float32Array; normals: Float32Array; indices: Uint32Array };
};

let assetsPromise: Promise<Assets> | null = null;

function getAssets(resolution: number): Promise<Assets> {
  if (assetsPromise) return assetsPromise;
  assetsPromise = (async () => {
    const [THREE, { MarchingCubes }, model] = await Promise.all([
      import("three"),
      import("three/examples/jsm/objects/MarchingCubes.js"),
      import("@/lib/heartModel"),
    ]);

    await new Promise((r) => setTimeout(r, 20));

    const mc = new MarchingCubes(resolution, new THREE.MeshBasicMaterial(), false, false, 180000);
    mc.isolation = 80;
    model.fillHeartField(mc.field, resolution, mc.isolation);
    mc.update();

    const n = mc.count * 3;
    const S = model.MODEL_SCALE;
    const positions = new Float32Array(n);
    const normals = new Float32Array(n);
    for (let i = 0; i < n; i += 3) {
      positions[i] = mc.positionArray[i] * S;
      positions[i + 1] = mc.positionArray[i + 1] * S - model.CENTER_Y;
      positions[i + 2] = mc.positionArray[i + 2] * S;
      normals[i] = mc.normalArray[i];
      normals[i + 1] = mc.normalArray[i + 1];
      normals[i + 2] = mc.normalArray[i + 2];
    }

    const tubes = model.buildTubes(model.generateArteries(7));
    for (let i = 1; i < tubes.positions.length; i += 3) tubes.positions[i] -= model.CENTER_Y;

    return { body: { positions, normals }, tubes };
  })();
  return assetsPromise;
}

/* ---------------- High-Fidelity Anatomical Shaders ---------------- */
const NOISE_GLSL = /* glsl */ `
varying vec3 vObjPos;
varying vec3 vWorldNormal;
varying vec3 vCamDir;

float h31(vec3 p){
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float vn(vec3 x){
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(h31(i), h31(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(h31(i + vec3(0.0, 1.0, 0.0)), h31(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(h31(i + vec3(0.0, 0.0, 1.0)), h31(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(h31(i + vec3(0.0, 1.0, 1.0)), h31(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
    f.z
  );
}
float fbm2(vec3 p){
  return 0.65 * vn(p) + 0.35 * vn(p * 2.03 + vec3(1.7, 9.2, 3.1));
}
`;

/** 1. Real Human Living Myocardium Shader (Subsurface Scattering + Epicardial Adipose Fat) */
const REAL_HUMAN_FRAGMENT_GLSL = /* glsl */ `
  // Anatomical Vessel Classification
  bool isSVC = (vObjPos.y > 0.18 && vObjPos.x < -0.24 && vObjPos.z < 0.20);
  bool isPulm = (vObjPos.y > 0.14 && vObjPos.x >= -0.36 && vObjPos.x <= 0.08 && vObjPos.z >= 0.04);
  bool isVenous = isSVC || isPulm;
  bool isAorta = (vObjPos.y > 0.22 && !isVenous);

  // Living Cardiac Colors
  vec3 muscleBase = vec3(0.68, 0.08, 0.11);     // Deep living myocardial red
  vec3 muscleDark = vec3(0.32, 0.03, 0.05);     // Deep vascular shadow
  vec3 aortaColor = vec3(0.78, 0.12, 0.13);     // Arterial crimson
  vec3 venousColor = vec3(0.12, 0.29, 0.44);    // Deoxygenated venous slate-blue

  vec3 col = muscleBase;

  if (isVenous) {
    col = mix(venousColor * 0.7, venousColor * 1.15, smoothstep(-0.2, 0.8, vWorldNormal.y));
  } else if (isAorta) {
    col = mix(aortaColor * 0.75, aortaColor * 1.1, smoothstep(-0.2, 0.8, vWorldNormal.y));
  } else {
    // Helical myocardial fiber striations
    float stri = vn(vec3(vObjPos.x * 38.0, vObjPos.y * 10.0, vObjPos.z * 38.0));
    col = mix(muscleDark, col, 0.72 + 0.28 * stri);

    // Epicardial Adipose (Fat Tissue) buffering the coronary grooves
    float grooveDist = length(vec2(vObjPos.x + 0.10 + vObjPos.y * 0.22, vObjPos.z - 0.26));
    float fatSulcus = smoothstep(0.19, 0.04, grooveDist) * smoothstep(-0.55, 0.26, vObjPos.y);
    float fatCoronary = smoothstep(0.13, 0.03, abs(vObjPos.y - 0.25)) * smoothstep(-0.15, 0.45, vObjPos.z);
    float fatTotal = clamp(fatSulcus + fatCoronary * 0.75, 0.0, 1.0);
    fatTotal *= (0.75 + 0.25 * fbm2(vObjPos * 12.0));
    
    vec3 fatColor = vec3(0.85, 0.75, 0.44); // Natural yellowish-cream adipose tissue
    col = mix(col, fatColor, fatTotal * 0.82);

    // Subsurface Scattering (SSS) translucent edge glow
    float sss = pow(clamp(dot(-vCamDir, vWorldNormal) + 0.55, 0.0, 1.0), 2.8);
    col += vec3(0.85, 0.14, 0.08) * sss * 0.32;
  }

  diffuseColor.rgb = col;
`;

/** 2. Vintage Gray's Anatomy Copperplate Etching Shader (Matching User Reference Image) */
const ETCHING_FRAGMENT_GLSL = /* glsl */ `
  bool isSVC = (vObjPos.y > 0.18 && vObjPos.x < -0.24 && vObjPos.z < 0.20);
  bool isPulm = (vObjPos.y > 0.14 && vObjPos.x >= -0.36 && vObjPos.x <= 0.08 && vObjPos.z >= 0.04);
  bool isVenous = isSVC || isPulm;
  bool isAorta = (vObjPos.y > 0.22 && !isVenous);

  // Exact Gray's Anatomy Etching Palette (Warm coral muscle, blue venous, red aorta)
  vec3 venousBase = vec3(0.15, 0.32, 0.48);     // Steel / Slate Blue
  vec3 venousDark = vec3(0.04, 0.12, 0.20);
  vec3 aortaBase  = vec3(0.84, 0.16, 0.14);     // Terracotta / Arterial Red
  vec3 aortaDark  = vec3(0.42, 0.05, 0.06);
  vec3 ventBase   = vec3(0.90, 0.35, 0.28);     // Warm fleshy coral / salmon
  vec3 ventDark   = vec3(0.48, 0.08, 0.08);

  vec3 col = ventBase;
  vec3 colDark = ventDark;

  if (isVenous) {
    col = venousBase;
    colDark = venousDark;
  } else if (isAorta) {
    col = aortaBase;
    colDark = aortaDark;
  }

  // Copperplate Cross-Hatching & Fine Muscle Contour Lines
  float hatch1 = sin(vObjPos.y * 130.0 + vObjPos.x * 25.0) * 0.5 + 0.5;
  float hatch2 = sin((vObjPos.x - vObjPos.y) * 95.0) * 0.5 + 0.5;
  float etch = mix(hatch1, hatch2, 0.35);
  etch = smoothstep(0.2, 0.85, etch);

  // Muscle fiber striations
  float stri = vn(vec3(vObjPos.x * 34.0, vObjPos.y * 8.0, vObjPos.z * 34.0));
  col *= 0.86 + 0.28 * stri;
  col = mix(colDark, col, 0.62 + 0.38 * etch);

  // Hand-drawn Black Ink Silhouette Rim
  float inkRim = pow(1.0 - max(dot(vWorldNormal, vCamDir), 0.0), 2.8);
  col = mix(col, vec3(0.06, 0.02, 0.02), clamp(inkRim * 0.72, 0.0, 1.0));

  diffuseColor.rgb = col;
`;

export interface Hotspot {
  id: string;
  name: string;
  pos: [number, number, number];
  targetRot: [number, number];
  tag: string;
  desc: string;
  clinical: string;
}

export const ANATOMICAL_HOTSPOTS: Hotspot[] = [
  {
    id: "aorta",
    name: "Aortic Arch & Valve (TAVI Landing Zone)",
    pos: [0.24, 0.78, -0.06],
    targetRot: [0.22, 0.32],
    tag: "TAVI / Structural Heart",
    desc: "The primary systemic arterial trunk delivering oxygenated blood under high systolic pressure to the brain and entire human body.",
    clinical: "Transcatheter Aortic Valve Implantation (TAVI/TAVR) landing zone deployed across calcified aortic stenosis without open-heart surgery.",
  },
  {
    id: "lad",
    name: "Left Anterior Descending Artery (LAD)",
    pos: [0.06, 0.02, 0.32],
    targetRot: [0.15, -0.25],
    tag: "Coronary Angioplasty (PCI)",
    desc: "The critical coronary artery ('Widowmaker') supplying 50%+ of the left ventricular myocardium down to the apex.",
    clinical: "Target for fractional flow reserve (FFR), OCT plaque morphology, and drug-eluting stent deployment with high procedural success.",
  },
  {
    id: "rca",
    name: "Right Coronary Artery (RCA)",
    pos: [-0.34, 0.12, 0.22],
    targetRot: [-0.05, -0.95],
    tag: "Right Ventricle & SA Node",
    desc: "Traverses the right atrioventricular groove, perfusing the right ventricle, inferior LV wall, and cardiac conduction system.",
    clinical: "Crucial in inferior myocardial infarction; treated via radial access coronary angioplasty with bioresorbable polymers.",
  },
  {
    id: "pulmonary",
    name: "Pulmonary Trunk & Bifurcation",
    pos: [-0.18, 0.60, 0.16],
    targetRot: [0.15, -0.75],
    tag: "Pulmonary Vascular Circuit",
    desc: "Large venous trunk crossing anterior to the ascending aorta, conducting deoxygenated blood into right and left pulmonary arteries.",
    clinical: "Inspected for pulmonary thromboembolism, pulmonary hypertension, and congenital structural abnormalities.",
  },
  {
    id: "svc",
    name: "Superior Vena Cava (SVC)",
    pos: [-0.44, 0.74, -0.02],
    targetRot: [0.10, -1.05],
    tag: "Venous Conduit",
    desc: "Major venous vessel returning blood from the upper half of the body directly into the right atrium.",
    clinical: "Key venous corridor for transvenous dual-chamber pacemaker leads, CRT-D device implantation, and central vascular access.",
  },
  {
    id: "apex",
    name: "Left Ventricular Apex",
    pos: [-0.22, -0.68, 0.12],
    targetRot: [-0.25, -0.45],
    tag: "High-Pressure Systolic Pump",
    desc: "The muscular apex formed by the left ventricle, generating maximum stroke volume and ejection fraction (>55-60%).",
    clinical: "Monitored for regional wall motion abnormalities, left ventricular aneurysm, and apical ballooning (Takotsubo cardiomyopathy).",
  },
];

export function Heart3D({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State
  const [isReady, setIsReady] = useState(false);
  const [mode, setMode] = useState<HeartMode>("real");
  const [showPins, setShowPins] = useState(true);
  const [isStentDeployed, setIsStentDeployed] = useState(false);
  const [stentProgress, setStentProgress] = useState(0);
  const [bpm, setBpm] = useState<number>(72);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [hotspotScreenPositions, setHotspotScreenPositions] = useState<
    Array<{ id: string; x: number; y: number; visible: boolean }>
  >([]);

  // Refs for requestAnimationFrame loop
  const modeRef = useRef<HeartMode>(mode);
  const bpmRef = useRef<number>(bpm);
  const targetRotRef = useRef<{ x: number; y: number } | null>(null);
  const targetZoomRef = useRef<number>(1.0);
  const isStentDeployedRef = useRef<boolean>(isStentDeployed);
  const stentProgressRef = useRef<number>(0);
  const showPinsRef = useRef<boolean>(showPins);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    showPinsRef.current = showPins;
  }, [showPins]);

  useEffect(() => {
    isStentDeployedRef.current = isStentDeployed;
  }, [isStentDeployed]);

  // Three.js Scene Setup & Loop
  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    (async () => {
      try {
        // High resolution MarchingCubes (62) for smooth real-human anatomical curvature
        const [THREE, assets] = await Promise.all([import("three"), getAssets(62)]);
        if (cancelled) return;

        const reduce =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);

        /* ---------- Surgical Lighting Setup ---------- */
        // Clinical overhead key light
        const keyLight = new THREE.DirectionalLight(0xfff6ee, 3.4);
        keyLight.position.set(-2.8, 3.8, 4.2);

        // Soft warm tissue fill light
        const fillLight = new THREE.DirectionalLight(0xffb2a5, 1.3);
        fillLight.position.set(3.4, -1.6, 3.2);

        // Crisp anatomical rim light
        const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
        rimLight.position.set(3.6, 2.2, -3.6);

        // Deep cavity ambient light
        const hemiLight = new THREE.HemisphereLight(0x8ecae6, 0x1b2838, 1.4);
        scene.add(keyLight, fillLight, rimLight, hemiLight);

        /* ---------- Geometries ---------- */
        const bodyGeo = new THREE.BufferGeometry();
        bodyGeo.setAttribute("position", new THREE.BufferAttribute(assets.body.positions, 3));
        bodyGeo.setAttribute("normal", new THREE.BufferAttribute(assets.body.normals, 3));
        bodyGeo.computeBoundingSphere();

        const tubeGeo = new THREE.BufferGeometry();
        tubeGeo.setAttribute("position", new THREE.BufferAttribute(assets.tubes.positions, 3));
        tubeGeo.setAttribute("normal", new THREE.BufferAttribute(assets.tubes.normals, 3));
        tubeGeo.setIndex(new THREE.BufferAttribute(assets.tubes.indices, 1));

        /* ---------- High-Fidelity Materials ---------- */
        // 1. Real Human Living Myocardium Material
        const realBodyMat = new THREE.MeshPhysicalMaterial({
          roughness: 0.28,
          metalness: 0.03,
          clearcoat: 0.95,
          clearcoatRoughness: 0.12,
          sheen: 0.45,
          sheenColor: new THREE.Color(0xdc2626),
        });
        realBodyMat.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader
            .replace("#include <common>", "#include <common>\nvarying vec3 vObjPos;\nvarying vec3 vWorldNormal;\nvarying vec3 vCamDir;")
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
              vObjPos = position;
              vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
              vec4 wP = modelMatrix * vec4(position, 1.0);
              vCamDir = normalize(cameraPosition - wP.xyz);`,
            );
          shader.fragmentShader = shader.fragmentShader
            .replace("#include <common>", `#include <common>\n${NOISE_GLSL}`)
            .replace("#include <color_fragment>", `#include <color_fragment>\n${REAL_HUMAN_FRAGMENT_GLSL}`);
        };

        const realTubeMat = new THREE.MeshPhysicalMaterial({
          color: 0x9b1b1b,
          roughness: 0.2,
          clearcoat: 0.9,
          emissive: new THREE.Color(0xef4444),
          emissiveIntensity: 0.35,
        });

        // 2. Vintage Gray's Anatomy Copperplate Etching Material
        const etchingBodyMat = new THREE.MeshStandardMaterial({
          roughness: 0.38,
          metalness: 0.04,
        });
        etchingBodyMat.onBeforeCompile = (shader) => {
          shader.vertexShader = shader.vertexShader
            .replace("#include <common>", "#include <common>\nvarying vec3 vObjPos;\nvarying vec3 vWorldNormal;\nvarying vec3 vCamDir;")
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
              vObjPos = position;
              vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
              vec4 wP = modelMatrix * vec4(position, 1.0);
              vCamDir = normalize(cameraPosition - wP.xyz);`,
            );
          shader.fragmentShader = shader.fragmentShader
            .replace("#include <common>", `#include <common>\n${NOISE_GLSL}`)
            .replace("#include <color_fragment>", `#include <color_fragment>\n${ETCHING_FRAGMENT_GLSL}`);
        };

        const etchingTubeMat = new THREE.MeshStandardMaterial({
          color: 0x8b1818,
          roughness: 0.32,
          metalness: 0.1,
          emissive: new THREE.Color(0xdc2626),
          emissiveIntensity: 0.28,
        });

        /* ---------- Heart Mesh Group ---------- */
        const heartGroup = new THREE.Group();
        const bodyMesh = new THREE.Mesh(bodyGeo, realBodyMat);
        const arteriesMesh = new THREE.Mesh(tubeGeo, realTubeMat);
        heartGroup.add(bodyMesh, arteriesMesh);

        /* ---------- 3D Stent Angioplasty Assembly (LAD Coronary Artery) ---------- */
        const stentGroup = new THREE.Group();
        stentGroup.position.set(0.065, 0.015, 0.315);
        stentGroup.rotation.set(-0.25, 0.32, -0.65);
        stentGroup.scale.set(0.001, 0.001, 0.001);
        stentGroup.visible = false;

        // Precision Nitinol micro-lattice diamond stent
        const stentGeo = new THREE.CylinderGeometry(0.040, 0.040, 0.20, 20, 14, true);
        const stentMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b, // Medical Platinum/Gold alloy
          roughness: 0.2,
          metalness: 0.98,
          wireframe: true,
          emissive: new THREE.Color(0xd97706),
          emissiveIntensity: 0.45,
        });
        const stentMesh = new THREE.Mesh(stentGeo, stentMat);

        // Angioplasty Balloon
        const balloonGeo = new THREE.CylinderGeometry(0.036, 0.036, 0.21, 18, 1, false);
        const balloonMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.1,
          transmission: 0.88,
          thickness: 0.05,
          transparent: true,
          opacity: 0.78,
        });
        const balloonMesh = new THREE.Mesh(balloonGeo, balloonMat);

        // Catheter Guidewire
        const wireGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.55, 8);
        const wireMat = new THREE.MeshStandardMaterial({
          color: 0xa1a1aa,
          roughness: 0.25,
          metalness: 0.92,
        });
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);

        // Accelerated oxygenated blood perfusion stream
        const streamCount = 50;
        const streamPos = new Float32Array(streamCount * 3);
        for (let i = 0; i < streamCount * 3; i += 3) {
          streamPos[i] = (Math.random() - 0.5) * 0.024;
          streamPos[i + 1] = (Math.random() - 0.5) * 0.22;
          streamPos[i + 2] = (Math.random() - 0.5) * 0.024;
        }
        const streamGeo = new THREE.BufferGeometry();
        streamGeo.setAttribute("position", new THREE.BufferAttribute(streamPos, 3));
        const streamMat = new THREE.PointsMaterial({
          color: 0xff3b30,
          size: 0.017,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
        });
        const streamPoints = new THREE.Points(streamGeo, streamMat);

        stentGroup.add(wireMesh, balloonMesh, stentMesh, streamPoints);
        heartGroup.add(stentGroup);

        /* ---------- Luminescent Halo Orbit Ring ---------- */
        const ringGeo = new THREE.TorusGeometry(0.92, 0.006, 16, 96);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.65,
          blending: THREE.AdditiveBlending,
        });
        const orbitRing = new THREE.Mesh(ringGeo, ringMat);
        orbitRing.rotation.x = Math.PI / 2.25;

        const outerRingGeo = new THREE.TorusGeometry(0.95, 0.012, 16, 96);
        const outerRingMat = new THREE.MeshBasicMaterial({
          color: 0x0284c7,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
        });
        const outerOrbitRing = new THREE.Mesh(outerRingGeo, outerRingMat);
        orbitRing.add(outerOrbitRing);

        /* ---------- Floating Hemodynamic Perfusion Micro-Particles ---------- */
        const particleCount = 110;
        const particlePos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          const r = 0.68 + Math.random() * 0.55;
          particlePos[i] = r * Math.sin(phi) * Math.cos(theta);
          particlePos[i + 1] = r * Math.cos(phi);
          particlePos[i + 2] = r * Math.sin(phi) * Math.sin(theta);
        }
        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
        const particleMat = new THREE.PointsMaterial({
          color: 0xef4444,
          size: 0.02,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending,
        });
        const particles = new THREE.Points(particleGeo, particleMat);

        const rootGroup = new THREE.Group();
        rootGroup.add(heartGroup, orbitRing, particles);
        scene.add(rootGroup);

        /* ---------- Responsive Viewport Sizing ---------- */
        let baseCameraZ = 1.0;
        const resize = () => {
          const w = Math.max(1, root.clientWidth);
          const h = Math.max(1, root.clientHeight);
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          const half = (26 * Math.PI) / 360;
          const needH = 1.0;
          const needW = 0.95;
          baseCameraZ = Math.max(needH / Math.tan(half), needW / (Math.tan(half) * camera.aspect)) * 1.05;
          camera.position.set(0, 0, baseCameraZ / targetZoomRef.current);
          camera.updateProjectionMatrix();
        };
        resize();
        requestAnimationFrame(resize);
        const ro = new ResizeObserver(resize);
        ro.observe(root);

        /* ---------- Unconstrained 360° Drag & Smooth Orbit Inertia ---------- */
        let dragging = false;
        let lastX = 0;
        let lastY = 0;
        let rotY = -0.32;
        let rotX = 0.05;
        let velX = 0;
        let velY = 0;

        const onDown = (e: PointerEvent) => {
          dragging = true;
          targetRotRef.current = null;
          lastX = e.clientX;
          lastY = e.clientY;
          canvas.setPointerCapture(e.pointerId);
        };

        const onMove = (e: PointerEvent) => {
          if (!dragging) return;
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          lastX = e.clientX;
          lastY = e.clientY;

          const sens = 0.0085;
          rotY += dx * sens;
          rotX += dy * sens;
          velX = dx * sens;
          velY = dy * sens;
          rotX = Math.max(-1.3, Math.min(1.3, rotX));
        };

        const onUp = () => {
          dragging = false;
        };

        canvas.style.cursor = "grab";
        canvas.style.touchAction = "none";
        canvas.addEventListener("pointerdown", onDown);
        canvas.addEventListener("pointermove", onMove);
        canvas.addEventListener("pointerup", onUp);
        canvas.addEventListener("pointercancel", onUp);

        /* ---------- High-Performance Animation Loop ---------- */
        const bump = (x: number, c: number, w: number) => Math.exp(-(((x - c) / w) ** 2));
        let lastMode: HeartMode = "real";
        const t0 = performance.now();
        let frameCount = 0;
        const tempVec = new THREE.Vector3();

        const frame = () => {
          const t = (performance.now() - t0) / 1000;
          const currentMode = modeRef.current;

          // Material Switcher
          if (currentMode !== lastMode) {
            lastMode = currentMode;
            if (currentMode === "real") {
              bodyMesh.material = realBodyMat;
              arteriesMesh.material = realTubeMat;
              rimLight.color.setHex(0x38bdf8);
              keyLight.intensity = 3.4;
            } else {
              bodyMesh.material = etchingBodyMat;
              arteriesMesh.material = etchingTubeMat;
              rimLight.color.setHex(0xffffff);
              keyLight.intensity = 3.0;
            }
          }

          // Luminescent Halo Orbit Ring & Ambient Perfusion Float
          orbitRing.rotation.z = t * 0.18;
          particles.rotation.y = t * 0.08;

          // Physiological Cardiac Cycle (Lub-Dub Double Beat)
          const currentBpm = bpmRef.current;
          const beatDuration = 60 / currentBpm;
          const phase = (t % beatDuration) / beatDuration;
          // Lub (Systole) + Dub (Diastole)
          const beat = reduce ? 0 : bump(phase, 0.11, 0.05) + 0.65 * bump(phase, 0.35, 0.065);

          // Stent Angioplasty Deployment
          if (isStentDeployedRef.current) {
            stentGroup.visible = true;
            if (stentProgressRef.current < 1.0) {
              stentProgressRef.current = Math.min(1.0, stentProgressRef.current + 0.025);
              setStentProgress(stentProgressRef.current);
            }
            const s = 0.001 + 0.999 * stentProgressRef.current;
            stentGroup.scale.set(s, 1.0, s);
            balloonMesh.scale.set(
              Math.sin(stentProgressRef.current * Math.PI) * 1.1 + 0.9,
              1.0,
              Math.sin(stentProgressRef.current * Math.PI) * 1.1 + 0.9,
            );
            // Particle blood perfusion rush
            const pArr = streamGeo.attributes.position.array as Float32Array;
            for (let i = 1; i < streamCount * 3; i += 3) {
              pArr[i] -= 0.016;
              if (pArr[i] < -0.11) pArr[i] = 0.11;
            }
            streamGeo.attributes.position.needsUpdate = true;
          } else {
            if (stentProgressRef.current > 0) {
              stentProgressRef.current = Math.max(0, stentProgressRef.current - 0.04);
              setStentProgress(stentProgressRef.current);
              const s = 0.001 + 0.999 * stentProgressRef.current;
              stentGroup.scale.set(s, 1.0, s);
              if (stentProgressRef.current === 0) stentGroup.visible = false;
            }
          }

          // Smooth 360° Rotation Kinematics
          if (targetRotRef.current) {
            rotY += (targetRotRef.current.y - rotY) * 0.08;
            rotX += (targetRotRef.current.x - rotX) * 0.08;
            if (
              Math.abs(targetRotRef.current.y - rotY) < 0.005 &&
              Math.abs(targetRotRef.current.x - rotX) < 0.005
            ) {
              targetRotRef.current = null;
            }
          } else if (!dragging) {
            rotY += velX;
            rotX += velY;
            velX *= 0.92;
            velY *= 0.92;
          }

          heartGroup.rotation.set(rotX, rotY, 0);

          // Subtle levitation drift
          rootGroup.position.y = Math.sin(t * 1.2) * 0.018;

          // Living Ventricular Myocardial Contraction & Systolic Torsion
          const scaleMultiplier = 1 + 0.035 * beat;
          heartGroup.scale.set(
            scaleMultiplier,
            scaleMultiplier * (1 - 0.008 * beat),
            scaleMultiplier,
          );
          realTubeMat.emissiveIntensity = 0.35 + 0.7 * beat;
          etchingTubeMat.emissiveIntensity = 0.28 + 0.65 * beat;

          // Smooth Camera Zoom
          const targetZ = baseCameraZ / targetZoomRef.current;
          camera.position.z += (targetZ - camera.position.z) * 0.1;

          // Project 3D Hotspot Pins to 2D Screen
          frameCount++;
          if (frameCount % 2 === 0 && showPinsRef.current) {
            const w = root.clientWidth;
            const h = root.clientHeight;
            const projected = ANATOMICAL_HOTSPOTS.map((spot) => {
              tempVec.set(spot.pos[0], spot.pos[1], spot.pos[2]);
              tempVec.applyEuler(heartGroup.rotation);
              tempVec.add(rootGroup.position);
              tempVec.project(camera);

              const x = (tempVec.x * 0.5 + 0.5) * w;
              const y = (-tempVec.y * 0.5 + 0.5) * h;
              const visible = tempVec.z < 1.0 && x > 20 && x < w - 20 && y > 20 && y < h - 20;
              return { id: spot.id, x, y, visible };
            });
            setHotspotScreenPositions(projected);
          }

          renderer.render(scene, camera);
        };

        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && !reduce) {
              renderer.setAnimationLoop(frame);
            } else {
              renderer.setAnimationLoop(null);
              if (entry.isIntersecting && reduce) frame();
            }
          },
          { threshold: 0.02 },
        );
        io.observe(root);

        frame();
        if (!cancelled) setIsReady(true);

        cleanup = () => {
          renderer.setAnimationLoop(null);
          io.disconnect();
          ro.disconnect();
          canvas.removeEventListener("pointerdown", onDown);
          canvas.removeEventListener("pointermove", onMove);
          canvas.removeEventListener("pointerup", onUp);
          canvas.removeEventListener("pointercancel", onUp);
          bodyGeo.dispose();
          tubeGeo.dispose();
          stentGeo.dispose();
          balloonGeo.dispose();
          wireGeo.dispose();
          streamGeo.dispose();
          ringGeo.dispose();
          outerRingGeo.dispose();
          particleGeo.dispose();
          realBodyMat.dispose();
          realTubeMat.dispose();
          etchingBodyMat.dispose();
          etchingTubeMat.dispose();
          stentMat.dispose();
          balloonMat.dispose();
          wireMat.dispose();
          streamMat.dispose();
          ringMat.dispose();
          outerRingMat.dispose();
          particleMat.dispose();
          renderer.dispose();
        };
      } catch (err) {
        console.warn("Heart3D initialization error:", err);
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  // Action: Select Anatomical Landmark
  const handleSelectHotspot = useCallback((spot: Hotspot) => {
    setActiveHotspot(spot);
    targetRotRef.current = { x: spot.targetRot[0], y: spot.targetRot[1] };
    targetZoomRef.current = 1.35;
  }, []);

  // Action: Reset View
  const handleReset = useCallback(() => {
    targetRotRef.current = { x: 0.05, y: -0.32 };
    targetZoomRef.current = 1.0;
    setActiveHotspot(null);
  }, []);

  // Action: 360° Viewing Presets
  const handlePresetAngle = useCallback((angle: "front" | "back" | "left" | "right" | "arch") => {
    setActiveHotspot(null);
    switch (angle) {
      case "front":
        targetRotRef.current = { x: 0.05, y: -0.32 };
        break;
      case "back":
        targetRotRef.current = { x: 0.05, y: Math.PI - 0.32 };
        break;
      case "left":
        targetRotRef.current = { x: 0.08, y: Math.PI / 2 };
        break;
      case "right":
        targetRotRef.current = { x: 0.08, y: -Math.PI / 2 };
        break;
      case "arch":
        targetRotRef.current = { x: 0.95, y: -0.15 };
        break;
    }
  }, []);

  // Action: Stent Angioplasty Simulation
  const handleToggleStent = useCallback(() => {
    if (isStentDeployed) {
      setIsStentDeployed(false);
      targetZoomRef.current = 1.0;
    } else {
      setIsStentDeployed(true);
      targetRotRef.current = { x: 0.15, y: -0.25 };
      targetZoomRef.current = 1.6;
    }
  }, [isStentDeployed]);

  return (
    <div
      ref={rootRef}
      className={`relative select-none overflow-hidden rounded-3xl bg-white shadow-[0_24px_70px_-15px_rgba(16,42,67,0.14)] border border-slate-200/90 ${className}`}
    >
      {/* ---------- Ultra-Premium Header Bar ---------- */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur-md sm:px-7">
        {/* Left Clinical Title & Status */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
            </span>
            <h3 className="font-mono text-xs font-bold tracking-wider text-slate-800 sm:text-sm uppercase">
              Anatomical 3D Vasculature Model
            </h3>
            <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[10px] font-semibold text-red-600 sm:text-[11px]">
              {mode === "real" ? "Living Anatomy 3D" : "Gray's Anatomy Etching"}
            </span>
          </div>
          <span className="mt-1 font-mono text-[9.5px] font-semibold tracking-widest text-slate-400 uppercase">
            Physiological Cardiac Cycle & Coronary Angioplasty
          </span>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Real Human 3D Mode */}
          <button
            type="button"
            onClick={() => setMode("real")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              mode === "real"
                ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span>🫀</span>
            <span>Real Human 3D</span>
          </button>

          {/* Gray's Anatomy Reference Engraving Mode */}
          <button
            type="button"
            onClick={() => setMode("engraving")}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              mode === "engraving"
                ? "bg-[#b34728] text-white shadow-md shadow-[#b34728]/30"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span>📖</span>
            <span>Gray&apos;s Etching</span>
          </button>

          {/* Deploy Stent Action Button */}
          <button
            type="button"
            onClick={handleToggleStent}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
              isStentDeployed
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                : "border-blue-400 bg-blue-50/70 text-blue-600 hover:bg-blue-100/70"
            }`}
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span>{isStentDeployed ? "Reset Stent" : "Deploy Stent"}</span>
          </button>

          {/* Pins Toggle */}
          <button
            type="button"
            onClick={() => setShowPins(!showPins)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
              showPins
                ? "border-slate-300 bg-slate-100 text-slate-800"
                : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
            }`}
            title="Toggle anatomical landmark markers"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Pins</span>
          </button>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={handleReset}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            title="Reset view rotation"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>

      {/* ---------- 3D Viewport ---------- */}
      <div className="relative aspect-[4/3] w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[590px] bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#f8fafc_60%,#eef2f6_100%)] overflow-hidden">
        {/* Fallback while compiling */}
        <div
          style={{ opacity: isReady ? 0 : 1, pointerEvents: isReady ? "none" : "auto" }}
          className="absolute inset-0 transition-opacity duration-700"
        >
          {children}
        </div>

        {/* WebGL Canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden
          style={{ opacity: isReady ? 1 : 0 }}
          className="absolute inset-0 h-full w-full transition-opacity duration-700"
        />

        {/* 360° Anatomical Angle Presets (Top Left Quick Switch) */}
        <div className="pointer-events-auto absolute left-4 top-4 z-30 hidden sm:flex items-center gap-1 rounded-full border border-slate-200/90 bg-white/90 p-1 text-[10.5px] font-semibold text-slate-700 shadow-sm backdrop-blur-md">
          <span className="px-2 font-mono text-[9px] uppercase tracking-wider text-slate-400">Angle:</span>
          <button
            type="button"
            onClick={() => handlePresetAngle("front")}
            className="rounded-full px-2.5 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => handlePresetAngle("back")}
            className="rounded-full px-2.5 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => handlePresetAngle("left")}
            className="rounded-full px-2.5 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Left
          </button>
          <button
            type="button"
            onClick={() => handlePresetAngle("right")}
            className="rounded-full px-2.5 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Right
          </button>
          <button
            type="button"
            onClick={() => handlePresetAngle("arch")}
            className="rounded-full px-2.5 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Arch
          </button>
        </div>

        {/* Live Interactive 3D Landmark Pins */}
        {showPins &&
          hotspotScreenPositions.map((p) => {
            if (!p.visible) return null;
            const spot = ANATOMICAL_HOTSPOTS.find((s) => s.id === p.id);
            if (!spot) return null;
            const isSelected = activeHotspot?.id === spot.id;

            return (
              <div
                key={spot.id}
                style={{
                  transform: `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`,
                }}
                className="pointer-events-auto absolute left-0 top-0 z-30 transition-transform duration-75"
              >
                <button
                  type="button"
                  onClick={() => handleSelectHotspot(spot)}
                  aria-label={spot.name}
                  className="group relative flex items-center justify-center focus:outline-none"
                >
                  <span className="absolute h-7 w-7 rounded-full border border-red-400/50 bg-red-400/20 transition-transform group-hover:scale-125" />
                  <span className="absolute h-5 w-5 rounded-full border border-red-500/70 bg-red-500/25 animate-ping opacity-60" />
                  <span
                    className={`relative h-2.5 w-2.5 rounded-full border border-white transition-all ${
                      isSelected ? "bg-red-600 scale-125 shadow-md shadow-red-600/50" : "bg-white shadow-sm"
                    }`}
                  />
                  <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 shadow transition-opacity group-hover:opacity-100">
                    {spot.name}
                  </span>
                </button>
              </div>
            );
          })}

        {/* Active Pin Detailed Clinical Info Card */}
        {activeHotspot && (
          <div className="absolute right-5 top-5 z-40 max-w-xs animate-in fade-in slide-in-from-top-2 rounded-2xl border border-slate-200/90 bg-white/95 p-4 text-left shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="rounded-full bg-red-50 px-2 py-0.5 font-mono text-[9.5px] font-bold text-red-600 uppercase">
                {activeHotspot.tag}
              </span>
              <button
                type="button"
                onClick={() => setActiveHotspot(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <h4 className="mt-2 text-sm font-bold text-slate-900">{activeHotspot.name}</h4>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{activeHotspot.desc}</p>
            <div className="mt-2.5 rounded-xl bg-slate-50 p-2.5 text-[11px] leading-relaxed text-slate-700">
              <span className="font-semibold text-slate-900">Clinical Focus: </span>
              {activeHotspot.clinical}
            </div>
          </div>
        )}

        {/* Live Stent Deployment Progress Banner */}
        {isStentDeployed && (
          <div className="absolute left-1/2 top-4 z-40 -translate-x-1/2 animate-in fade-in slide-in-from-top-2 flex items-center gap-2.5 rounded-full border border-emerald-300 bg-white/95 px-4.5 py-2 text-xs font-semibold text-emerald-800 shadow-lg backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              LAD Angioplasty Active: {Math.round(stentProgress * 100)}% Dilation — 100% Lumen Restored
            </span>
          </div>
        )}

        {/* Bottom Left Drag Hint */}
        <div className="pointer-events-none absolute bottom-4 left-5 z-20">
          <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-3.5 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            <span>Drag 360° to inspect • Click pins for anatomical details</span>
          </div>
        </div>
      </div>

      {/* ---------- Telemetry Strip ---------- */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
        {/* Left Vital Stats */}
        <div className="flex flex-wrap items-center gap-5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-red-600 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span className="font-bold text-slate-500 uppercase">Heart Rate:</span>
            <span className="rounded-md border border-red-200 bg-red-50 px-2.5 py-0.5 font-bold text-red-600">
              {bpm} BPM
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-teal-700">
            <span className="font-bold text-slate-400 uppercase">Rhythm:</span>
            <span className="font-bold">NORMAL SINUS RHYTHM</span>
          </div>

          <div className="flex items-center gap-1.5 text-teal-700">
            <span className="font-bold text-slate-400 uppercase">Perfusion:</span>
            <span className="font-bold">
              {isStentDeployed ? "OPTIMAL (100%)" : "NORMAL (98%)"}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-600">
            <span className="font-bold text-slate-400 uppercase">BP:</span>
            <span className="font-bold">120/80 mmHg</span>
          </div>
        </div>

        {/* Right Set BPM Controls */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="font-bold text-slate-400 uppercase">Set BPM:</span>
          {[60, 72, 98, 115].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setBpm(val)}
              className={`rounded-md px-2.5 py-1 text-xs font-bold transition-all ${
                bpm === val
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
