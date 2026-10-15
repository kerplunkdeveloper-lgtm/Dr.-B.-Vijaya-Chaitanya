"use client";

import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import type * as THREE from "three";

/**
 * Real Human 3D Cardiac Vasculature, Internal Chamber & Deep Learning AI Simulator (Three.js)
 * 
 * Hyper-Realistic Human Heart Anatomy & Ultra-Premium UX:
 * 1. Reference Image Exact Reproduction: Classical Gray's Anatomy copperplate etching
 *    with hand-drawn cross-hatching, muscle striations, and vivid arterial/venous color split
 *    (Arterial Crimson Aorta vs Venous Slate-Blue Pulmonary/SVC).
 * 2. Internal 4-Chamber Cross-Section Mode: Coronal anatomical cutaway revealing Left & Right Ventricles,
 *    thick Interventricular Septum (IVS), Mitral & Tricuspid valve fibrous rings, and intracardiac flow.
 * 3. Deep Learning AI Cardiac Neural Scan HUD: Real-time segmentation reticles, holographic grid sweep,
 *    and live hemodynamic telemetry (LVEF 62%, Cardiac Output 5.2 L/min, GLS -18.9%).
 * 4. Realistic Physiological Auscultation Heartbeat Sound: Web Audio API synthesized Lub-Dub (S1 + S2)
 *    double acoustic beat mathematically locked to the systolic/diastolic animation cycle.
 *    Sound is MUTED by default with an elegant speaker toggle & animated EQ visualizer.
 * 5. Full Interventional Angioplasty Simulator: LAD coronary stenosis, balloon dilation, and Nitinol stent.
 * 6. Interactive 3D Landmark Pins & 360° Anatomical Angle Presets.
 */

export type HeartMode = "real" | "internal" | "engraving";

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

    // Critical: MarchingCubes generates polygons into positionArray inside update()
    mc.update();

    const count = mc.count * 3;
    const S = model.MODEL_SCALE;
    const positions = new Float32Array(count);
    const normals = new Float32Array(count);
    for (let i = 0; i < count; i += 3) {
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
  })().catch((err) => {
    assetsPromise = null;
    throw err;
  });
  return assetsPromise;
}

/* ---------- Physiological Heartbeat Audio Synthesizer (Web Audio API) ---------- */
class HeartbeatSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private volume: number = 0.55;

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.init();
    }
  }

  // S1 (Systole / Lub): Mitral & Tricuspid valve closure (resonant 55Hz acoustic thump)
  playLub() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(60, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.12);

      gain.gain.setValueAtTime(this.volume * 0.9, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.15);
    } catch {
      // safe fallback
    }
  }

  // S2 (Diastole / Dub): Aortic & Pulmonic semilunar valve closure (sharper 88Hz snap)
  playDub() {
    if (this.isMuted || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(88, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.11);
    } catch {
      // safe fallback
    }
  }

  dispose() {
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
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

/** 1. Real Living Human Anatomy Shader */
const REAL_HUMAN_FRAGMENT_GLSL = /* glsl */ `
  bool isSVC = (vObjPos.y > 0.18 && vObjPos.x < -0.24 && vObjPos.z < 0.20);
  bool isPulm = (vObjPos.y > 0.14 && vObjPos.x >= -0.36 && vObjPos.x <= 0.08 && vObjPos.z >= 0.04);
  bool isVenous = isSVC || isPulm;
  bool isAorta = (vObjPos.y > 0.22 && !isVenous);

  vec3 muscleBase = vec3(0.70, 0.09, 0.12);     // Living myocardial arterial red
  vec3 muscleDark = vec3(0.34, 0.03, 0.05);     // Deep vascular shadow
  vec3 aortaColor = vec3(0.80, 0.13, 0.14);     // High-pressure arterial crimson
  vec3 venousColor = vec3(0.14, 0.32, 0.48);    // Deoxygenated venous slate blue

  vec3 col = muscleBase;

  if (isVenous) {
    col = mix(venousColor * 0.72, venousColor * 1.15, smoothstep(-0.2, 0.8, vWorldNormal.y));
  } else if (isAorta) {
    col = mix(aortaColor * 0.75, aortaColor * 1.12, smoothstep(-0.2, 0.8, vWorldNormal.y));
  } else {
    float stri = vn(vec3(vObjPos.x * 38.0, vObjPos.y * 10.0, vObjPos.z * 38.0));
    col = mix(muscleDark, col, 0.72 + 0.28 * stri);

    // Epicardial Adipose (Fat buffering coronary sulcus)
    float grooveDist = length(vec2(vObjPos.x + 0.10 + vObjPos.y * 0.22, vObjPos.z - 0.26));
    float fatSulcus = smoothstep(0.19, 0.04, grooveDist) * smoothstep(-0.55, 0.26, vObjPos.y);
    float fatCoronary = smoothstep(0.13, 0.03, abs(vObjPos.y - 0.25)) * smoothstep(-0.15, 0.45, vObjPos.z);
    float fatTotal = clamp(fatSulcus + fatCoronary * 0.75, 0.0, 1.0);
    fatTotal *= (0.75 + 0.25 * fbm2(vObjPos * 12.0));
    
    vec3 fatColor = vec3(0.86, 0.76, 0.45);
    col = mix(col, fatColor, fatTotal * 0.82);

    // Subsurface Scattering (SSS)
    float sss = pow(clamp(dot(-vCamDir, vWorldNormal) + 0.55, 0.0, 1.0), 2.8);
    col += vec3(0.88, 0.15, 0.09) * sss * 0.32;
  }

  diffuseColor.rgb = col;
`;

/** 2. Reference Image Exact Match: Classical Gray's Anatomy Copperplate Etching Shader */
const ETCHING_FRAGMENT_GLSL = /* glsl */ `
  // Anatomical Region Segmentation
  bool isSVC = (vObjPos.y > 0.18 && vObjPos.x < -0.22 && vObjPos.z < 0.22);
  bool isPulm = (vObjPos.y > 0.13 && vObjPos.x >= -0.36 && vObjPos.x <= 0.08 && vObjPos.z >= 0.02);
  bool isVenous = isSVC || isPulm;
  bool isAorta = (vObjPos.y > 0.20 && !isVenous);

  // Exact matching colors from Reference Image
  vec3 venousLight = vec3(0.38, 0.54, 0.64);   // Slate-Blue highlight (#618aa3)
  vec3 venousBase  = vec3(0.28, 0.44, 0.53);   // Slate-Blue primary body (#477087)
  vec3 venousDark  = vec3(0.12, 0.22, 0.28);   // Deep navy shadow (#1f3847)

  vec3 aortaLight  = vec3(0.95, 0.32, 0.28);   // Scarlet arch highlight (#f25247)
  vec3 aortaBase   = vec3(0.85, 0.22, 0.20);   // Cadmium red arch (#d93833)
  vec3 aortaDark   = vec3(0.48, 0.08, 0.08);   // Deep crimson shadow (#7a1414)

  vec3 ventHighlight = vec3(0.98, 0.74, 0.62); // Anterior salmon-peach highlight (#fbbda0)
  vec3 ventBase      = vec3(0.93, 0.46, 0.38); // Warm coral myocardium (#ed7561)
  vec3 ventDark      = vec3(0.56, 0.14, 0.15); // Deep ventricular sulcus shadow (#8f2426)

  // Natural surface lighting orientation
  vec3 lightDir = normalize(vec3(0.35, 0.8, 0.55));
  float NdotL = dot(vWorldNormal, lightDir);
  float diff = smoothstep(-0.25, 0.85, NdotL);

  // Vessel lumen openings (dark cut pipe ends at top of vessels as seen in illustration)
  bool isSVCLumen = (isSVC && vObjPos.y > 0.90);
  bool isAortaBranchLumen = (isAorta && vObjPos.y > 0.84 && vObjPos.z < -0.02);

  vec3 col = ventBase;
  vec3 colDark = ventDark;

  if (isVenous) {
    col = mix(venousDark, venousBase, diff * 0.7 + 0.3);
    col = mix(col, venousLight, smoothstep(0.4, 0.95, diff));
    colDark = venousDark;
    if (isSVCLumen) {
      col = mix(vec3(0.10, 0.16, 0.22), col, smoothstep(0.90, 0.95, vObjPos.y));
    }
  } else if (isAorta) {
    col = mix(aortaDark, aortaBase, diff * 0.65 + 0.35);
    col = mix(col, aortaLight, smoothstep(0.4, 0.95, diff));
    colDark = aortaDark;
    if (isAortaBranchLumen) {
      col = mix(vec3(0.28, 0.05, 0.06), col, smoothstep(0.84, 0.89, vObjPos.y));
    }
  } else {
    // Ventricular body with warm peach center highlight (matching reference image)
    float centerHighlight = smoothstep(0.15, 0.55, vObjPos.z) * smoothstep(-0.45, 0.15, vObjPos.y) * smoothstep(-0.35, 0.25, vObjPos.x);
    col = mix(ventBase, ventHighlight, centerHighlight * 0.75);
    col = mix(ventDark, col, diff * 0.75 + 0.25);

    // Anatomical muscle striations
    float stri = vn(vec3(vObjPos.x * 32.0, vObjPos.y * 8.5, vObjPos.z * 32.0));
    col *= (0.92 + 0.16 * stri);
  }

  // Classical Copperplate Woodcut Engraving Cross-Hatching
  // 1. Primary Hatch Lines along muscle contours
  float hatch1 = abs(sin(vObjPos.y * 145.0 + vObjPos.x * 40.0));
  hatch1 = smoothstep(0.16, 0.84, hatch1);

  // 2. Secondary Cross-Hatch Lines in shadow regions
  float hatch2 = abs(sin((vObjPos.y - vObjPos.x) * 115.0 + vObjPos.z * 35.0));
  hatch2 = smoothstep(0.22, 0.86, hatch2);

  // Apply crosshatching proportional to shadow density
  float shadowDensity = 1.0 - diff;
  float inkPattern = hatch1;
  if (shadowDensity > 0.42) {
    inkPattern = min(hatch1, hatch2);
  }
  float inkFade = smoothstep(0.15, 0.85, shadowDensity);
  col = mix(col, colDark * 0.7, inkFade * (1.0 - inkPattern) * 0.78);

  // Hand-Drawn Dark Ink Contour Silhouettes (Woodcut outer outline)
  float rim = 1.0 - max(dot(vWorldNormal, vCamDir), 0.0);
  float inkOutline = smoothstep(0.46, 0.86, rim);
  vec3 inkBlack = vec3(0.08, 0.03, 0.03);
  col = mix(col, inkBlack, inkOutline * 0.86);

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
  isInternal?: boolean;
}

export const ANATOMICAL_HOTSPOTS: Hotspot[] = [
  {
    id: "aorta",
    name: "Aortic Arch & Branches (Brachiocephalic, Carotid, Subclavian)",
    pos: [0.24, 0.78, -0.06],
    targetRot: [0.22, 0.32],
    tag: "TAVI / Structural Heart",
    desc: "The primary systemic arterial trunk delivering oxygenated blood under high pressure. Gives rise to 3 critical cranial branches.",
    clinical: "Transcatheter Aortic Valve Implantation (TAVI/TAVR) landing zone for severe aortic stenosis without open-heart surgery.",
  },
  {
    id: "lad",
    name: "Left Anterior Descending Artery (LAD)",
    pos: [0.06, 0.02, 0.32],
    targetRot: [0.15, -0.25],
    tag: "Coronary Angioplasty (PCI)",
    desc: "The critical anterior coronary artery perfusing over 50% of left ventricular myocardium down to the cardiac apex.",
    clinical: "Primary target for intravascular imaging (OCT/IVUS), physiological FFR guidance, and drug-eluting stent deployment.",
  },
  {
    id: "pulmonary",
    name: "Pulmonary Trunk & Vena Cava (Deoxygenated Return)",
    pos: [-0.18, 0.60, 0.16],
    targetRot: [0.15, -0.75],
    tag: "Pulmonary Vascular Circuit",
    desc: "Large venous trunk conducting deoxygenated blood into right and left pulmonary arteries for alveolar gas exchange.",
    clinical: "Evaluated in pulmonary hypertension, PE catheter thrombectomy, and structural congenital heart interventions.",
  },
  {
    id: "rca",
    name: "Right Coronary Artery (RCA)",
    pos: [-0.34, 0.12, 0.22],
    targetRot: [-0.05, -0.95],
    tag: "Right Ventricle & SA Node",
    desc: "Traverses the right atrioventricular groove, supplying the RV, posterior LV wall, and cardiac pacemaker conduction system.",
    clinical: "Target in acute inferior wall myocardial infarction; managed via radial-first precision coronary intervention.",
  },
  {
    id: "apex",
    name: "Left Ventricular Apex (Muscular High-Pressure Pump)",
    pos: [-0.22, -0.68, 0.12],
    targetRot: [-0.25, -0.45],
    tag: "Systolic Contraction",
    desc: "The conical muscular tip of the left ventricle generating high systolic stroke volume and peak ejection fraction.",
    clinical: "Assessed via echocardiography and cardiac MRI for apical ballooning, aneurysm, and strain rate index.",
  },
  {
    id: "mitral_valve",
    name: "Mitral Valve Annulus (Internal Cavity)",
    pos: [0.14, 0.18, -0.06],
    targetRot: [0.35, 0.2],
    tag: "Internal 4-Chamber View",
    desc: "Dual-leaflet atrioventricular valve regulating unidirectional oxygenated blood flow from Left Atrium into Left Ventricle.",
    clinical: "Target for MitraClip percutaneous edge-to-edge repair (TEER) in severe mitral regurgitation.",
    isInternal: true,
  },
  {
    id: "ivs_septum",
    name: "Interventricular Septum (IVS)",
    pos: [-0.06, -0.15, -0.04],
    targetRot: [0.2, 0.05],
    tag: "Internal 4-Chamber View",
    desc: "Thick muscular partition separating the high-pressure Left Ventricle from the lower-pressure Right Ventricle.",
    clinical: "Assessed for Ventricular Septal Defects (VSD) closed via percutaneous Amplatzer occluder devices.",
    isInternal: true,
  },
];

export function Heart3D({ className = "", children }: { className?: string; children?: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [mode, setMode] = useState<HeartMode>("engraving");
  const [bpm, setBpm] = useState<number>(72);
  const [isReady, setIsReady] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [hotspotScreenPositions, setHotspotScreenPositions] = useState<
    { id: string; x: number; y: number; visible: boolean }[]
  >([]);
  const [showPins, setShowPins] = useState(true);
  const [isStentDeployed, setIsStentDeployed] = useState(false);
  const [stentProgress, setStentProgress] = useState(0);

  // Audio Auscultation State (Default: MUTED as requested)
  const [isMuted, setIsMuted] = useState(true);

  // AI Deep Learning Neural Scan State
  const [aiScanActive, setAiScanActive] = useState(false);

  // Mutable animation refs
  const bpmRef = useRef(bpm);
  const modeRef = useRef(mode);
  const showPinsRef = useRef(showPins);
  const isStentDeployedRef = useRef(isStentDeployed);
  const stentProgressRef = useRef(0);
  const targetRotRef = useRef<{ x: number; y: number } | null>(null);
  const targetZoomRef = useRef(1.0);
  const audioSynthRef = useRef<HeartbeatSynthesizer | null>(null);
  const aiScanRef = useRef(aiScanActive);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    showPinsRef.current = showPins;
  }, [showPins]);

  useEffect(() => {
    isStentDeployedRef.current = isStentDeployed;
  }, [isStentDeployed]);

  useEffect(() => {
    aiScanRef.current = aiScanActive;
  }, [aiScanActive]);

  // Audio Mute Bridge
  useEffect(() => {
    if (!audioSynthRef.current) {
      audioSynthRef.current = new HeartbeatSynthesizer();
    }
    audioSynthRef.current.setMuted(isMuted);
  }, [isMuted]);

  // Three.js Scene Setup & Loop
  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    (async () => {
      try {
        const [THREE, assets] = await Promise.all([import("three"), getAssets(54)]);
        if (cancelled) return;

        const reduce =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Renderer with Local Clipping enabled for Internal Chamber View
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
        renderer.localClippingEnabled = true;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);

        /* ---------- Surgical Lighting Setup ---------- */
        const keyLight = new THREE.DirectionalLight(0xfff6ee, 3.4);
        keyLight.position.set(-2.8, 3.8, 4.2);

        const fillLight = new THREE.DirectionalLight(0xffb2a5, 1.3);
        fillLight.position.set(3.4, -1.6, 3.2);

        const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
        rimLight.position.set(3.6, 2.2, -3.6);

        const hemiLight = new THREE.HemisphereLight(0x8ecae6, 0x1b2838, 1.4);
        scene.add(keyLight, fillLight, rimLight, hemiLight);

        /* ---------- Geometries ---------- */
        const bodyGeo = new THREE.BufferGeometry();
        bodyGeo.setAttribute("position", new THREE.BufferAttribute(assets.body.positions, 3));
        bodyGeo.setAttribute("normal", new THREE.BufferAttribute(assets.body.normals, 3));
        bodyGeo.computeVertexNormals();
        bodyGeo.computeBoundingSphere();

        const tubeGeo = new THREE.BufferGeometry();
        tubeGeo.setAttribute("position", new THREE.BufferAttribute(assets.tubes.positions, 3));
        tubeGeo.setAttribute("normal", new THREE.BufferAttribute(assets.tubes.normals, 3));
        tubeGeo.setIndex(new THREE.BufferAttribute(assets.tubes.indices, 1));

        // Coronal Anatomical Cutaway Clipping Plane
        const coronalClipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.05);

        /* ---------- High-Fidelity Materials ---------- */
        // 1. Real Living Human Anatomy
        const realBodyMat = new THREE.MeshPhysicalMaterial({
          roughness: 0.28,
          metalness: 0.03,
          clearcoat: 0.95,
          clearcoatRoughness: 0.12,
          sheen: 0.45,
          sheenColor: new THREE.Color(0xdc2626),
          side: THREE.DoubleSide,
          clipShadows: true,
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

        // 2. Reference Image Exact Match: Classical Gray's Anatomy Copperplate Etching
        const etchingBodyMat = new THREE.MeshStandardMaterial({
          roughness: 0.38,
          metalness: 0.04,
          side: THREE.DoubleSide,
          clipShadows: true,
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
          color: 0x3a0a10, // Deep dark ink-maroon matching the reference illustration's branching coronary arteries
          roughness: 0.35,
          metalness: 0.15,
          emissive: new THREE.Color(0x611119),
          emissiveIntensity: 0.28,
        });

        /* ---------- Heart Mesh Group ---------- */
        const heartGroup = new THREE.Group();
        const bodyMesh = new THREE.Mesh(bodyGeo, etchingBodyMat);
        const arteriesMesh = new THREE.Mesh(tubeGeo, etchingTubeMat);
        heartGroup.add(bodyMesh, arteriesMesh);

        /* ---------- Internal 4-Chamber Anatomical Architecture ---------- */
        const internalChamberGroup = new THREE.Group();
        internalChamberGroup.visible = false;

        // 1. Interventricular Septum (IVS) Muscular Wall
        const septumGeo = new THREE.BoxGeometry(0.12, 0.72, 0.38);
        const septumMat = new THREE.MeshStandardMaterial({
          color: 0x881337,
          roughness: 0.35,
          metalness: 0.05,
        });
        const septumMesh = new THREE.Mesh(septumGeo, septumMat);
        septumMesh.position.set(-0.05, -0.16, -0.05);
        septumMesh.rotation.set(0.12, 0.16, 0.28);

        // 2. Mitral Valve Fibrous Annulus & Leaflets
        const valveRingMat = new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          roughness: 0.2,
          metalness: 0.25,
          emissive: new THREE.Color(0xfef08a),
          emissiveIntensity: 0.2,
        });
        const mitralGeo = new THREE.TorusGeometry(0.13, 0.016, 16, 32);
        const mitralMesh = new THREE.Mesh(mitralGeo, valveRingMat);
        mitralMesh.position.set(0.14, 0.18, -0.07);
        mitralMesh.rotation.set(Math.PI / 2.6, 0.3, 0);

        // 3. Tricuspid Valve Fibrous Annulus
        const tricuspidGeo = new THREE.TorusGeometry(0.11, 0.015, 16, 32);
        const tricuspidMesh = new THREE.Mesh(tricuspidGeo, valveRingMat);
        tricuspidMesh.position.set(-0.25, 0.16, -0.04);
        tricuspidMesh.rotation.set(Math.PI / 2.5, -0.2, 0);

        // 4. Papillary Tendinous Chordae
        const chordaeGroup = new THREE.Group();
        const cordMat = new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.25 });
        for (let i = 0; i < 6; i++) {
          const cordGeo = new THREE.CylinderGeometry(0.0035, 0.0035, 0.22, 6);
          const cord = new THREE.Mesh(cordGeo, cordMat);
          const angle = (i / 6) * Math.PI * 2;
          cord.position.set(0.14 + Math.cos(angle) * 0.07, 0.06, -0.07 + Math.sin(angle) * 0.06);
          cord.rotation.set(0.1, 0, (Math.random() - 0.5) * 0.25);
          chordaeGroup.add(cord);
        }

        // 5. Intracardiac Blood Volume Micro-Particles (Red in LV, Slate Blue in RV)
        const chamberParticleCount = 90;
        const chamberPos = new Float32Array(chamberParticleCount * 3);
        for (let i = 0; i < chamberParticleCount; i++) {
          const isLV = i < chamberParticleCount / 2;
          chamberPos[i * 3] = isLV
            ? 0.12 + (Math.random() - 0.5) * 0.22
            : -0.24 + (Math.random() - 0.5) * 0.2;
          chamberPos[i * 3 + 1] = -0.06 + (Math.random() - 0.5) * 0.45;
          chamberPos[i * 3 + 2] = -0.06 + (Math.random() - 0.5) * 0.18;
        }
        const chamberGeo = new THREE.BufferGeometry();
        chamberGeo.setAttribute("position", new THREE.BufferAttribute(chamberPos, 3));
        const chamberMat = new THREE.PointsMaterial({
          color: 0xef4444,
          size: 0.02,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending,
        });
        const chamberPoints = new THREE.Points(chamberGeo, chamberMat);

        internalChamberGroup.add(
          septumMesh,
          mitralMesh,
          tricuspidMesh,
          chordaeGroup,
          chamberPoints,
        );
        heartGroup.add(internalChamberGroup);

        /* ---------- Deep Learning AI Neural Scan Holographic Assembly ---------- */
        const aiScanGroup = new THREE.Group();
        aiScanGroup.visible = false;

        // Holographic Sweeping Plane
        const scanGridGeo = new THREE.PlaneGeometry(1.6, 1.6, 20, 20);
        const scanGridMat = new THREE.MeshBasicMaterial({
          color: 0x06b6d4,
          wireframe: true,
          transparent: true,
          opacity: 0.38,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });
        const scanGridMesh = new THREE.Mesh(scanGridGeo, scanGridMat);
        scanGridMesh.rotation.x = Math.PI / 2;

        // AI Bounding Boxes (LV, Aortic Root, LAD)
        const lvBoxGeo = new THREE.BoxGeometry(0.55, 0.75, 0.55);
        const boxMat = new THREE.MeshBasicMaterial({
          color: 0x10b981,
          wireframe: true,
          transparent: true,
          opacity: 0.45,
        });
        const lvBox = new THREE.Mesh(lvBoxGeo, boxMat);
        lvBox.position.set(0.08, -0.15, 0.05);

        const aortaBoxGeo = new THREE.BoxGeometry(0.45, 0.45, 0.35);
        const aortaBoxMat = new THREE.MeshBasicMaterial({
          color: 0xef4444,
          wireframe: true,
          transparent: true,
          opacity: 0.45,
        });
        const aortaBox = new THREE.Mesh(aortaBoxGeo, aortaBoxMat);
        aortaBox.position.set(0.2, 0.75, -0.06);

        aiScanGroup.add(scanGridMesh, lvBox, aortaBox);
        heartGroup.add(aiScanGroup);

        /* ---------- 3D Stent Angioplasty Assembly (LAD Coronary Artery) ---------- */
        const stentGroup = new THREE.Group();
        stentGroup.position.set(0.065, 0.015, 0.315);
        stentGroup.rotation.set(-0.25, 0.32, -0.65);
        stentGroup.scale.set(0.001, 0.001, 0.001);
        stentGroup.visible = false;

        const stentGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 20, 14, true);
        const stentMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          roughness: 0.2,
          metalness: 0.98,
          wireframe: true,
          emissive: new THREE.Color(0xd97706),
          emissiveIntensity: 0.45,
        });
        const stentMesh = new THREE.Mesh(stentGeo, stentMat);

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

        const wireGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.55, 8);
        const wireMat = new THREE.MeshStandardMaterial({
          color: 0xa1a1aa,
          roughness: 0.25,
          metalness: 0.92,
        });
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);

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

        /* ---------- Luminescent Orbit Ring & Ambient Perfusion Particles ---------- */
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

        /* ---------- Viewport Sizing ---------- */
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

        /* ---------- 360° Drag & Smooth Orbit Inertia ---------- */
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
        let lastMode: string = "";
        const t0 = performance.now();
        let frameCount = 0;
        const tempVec = new THREE.Vector3();

        // Heartbeat Sound Trigger State
        let hasPlayedLubInCycle = false;
        let hasPlayedDubInCycle = false;

        const frame = () => {
          const t = (performance.now() - t0) / 1000;
          const currentMode = modeRef.current;

          // Material & Mode Switcher
          if (currentMode !== lastMode) {
            lastMode = currentMode;
            if (currentMode === "real") {
              bodyMesh.material = realBodyMat as any;
              arteriesMesh.material = realTubeMat as any;
              realBodyMat.clippingPlanes = [];
              realTubeMat.clippingPlanes = [];
              realBodyMat.needsUpdate = true;
              realTubeMat.needsUpdate = true;
              internalChamberGroup.visible = false;
              rimLight.color.setHex(0x38bdf8);
              keyLight.intensity = 3.4;
            } else if (currentMode === "internal") {
              bodyMesh.material = realBodyMat as any;
              arteriesMesh.material = realTubeMat as any;
              realBodyMat.clippingPlanes = [coronalClipPlane];
              realTubeMat.clippingPlanes = [coronalClipPlane];
              realBodyMat.needsUpdate = true;
              realTubeMat.needsUpdate = true;
              internalChamberGroup.visible = true;
              rimLight.color.setHex(0x38bdf8);
              keyLight.intensity = 3.6;
            } else {
              // Gray's Anatomy Reference Engraving
              bodyMesh.material = etchingBodyMat as any;
              arteriesMesh.material = etchingTubeMat as any;
              etchingBodyMat.clippingPlanes = [];
              etchingTubeMat.clippingPlanes = [];
              etchingBodyMat.needsUpdate = true;
              etchingTubeMat.needsUpdate = true;
              internalChamberGroup.visible = false;
              rimLight.color.setHex(0xffffff);
              keyLight.intensity = 3.0;
            }
          }

          // Deep Learning AI Scan Hologram
          aiScanGroup.visible = aiScanRef.current;
          if (aiScanRef.current) {
            scanGridMesh.position.y = Math.sin(t * 2.2) * 0.65;
            scanGridMesh.rotation.z = t * 0.15;
          }

          // Halo Orbit Ring & Micro-Particles
          orbitRing.rotation.z = t * 0.18;
          particles.rotation.y = t * 0.08;

          // Physiological Cardiac Cycle (Lub-Dub Double Beat)
          const currentBpm = bpmRef.current;
          const beatDuration = 60 / currentBpm;
          const phase = (t % beatDuration) / beatDuration;
          const beat = reduce ? 0 : bump(phase, 0.11, 0.05) + 0.65 * bump(phase, 0.35, 0.065);

          // Auscultation Acoustic Heartbeat Sound Synchronization
          if (audioSynthRef.current) {
            // S1 (Lub) Trigger at phase ~0.11
            if (phase >= 0.09 && phase < 0.22 && !hasPlayedLubInCycle) {
              audioSynthRef.current.playLub();
              hasPlayedLubInCycle = true;
            } else if (phase >= 0.22 && hasPlayedLubInCycle) {
              hasPlayedLubInCycle = false;
            }

            // S2 (Dub) Trigger at phase ~0.35
            if (phase >= 0.33 && phase < 0.46 && !hasPlayedDubInCycle) {
              audioSynthRef.current.playDub();
              hasPlayedDubInCycle = true;
            } else if ((phase < 0.33 || phase >= 0.46) && hasPlayedDubInCycle) {
              hasPlayedDubInCycle = false;
            }
          }

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

          // Rotation Kinematics
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

          // Physiological helical systolic twist (apical cardiac torsion)
          const systolicTwist = Math.sin(phase * Math.PI * 2) * 0.038 * beat;
          heartGroup.rotation.set(rotX + systolicTwist * 0.5, rotY + systolicTwist, systolicTwist * 0.7);

          // Levitation drift & cardiac systolic contraction
          rootGroup.position.y = Math.sin(t * 1.2) * 0.018;
          const scaleMultiplier = 1 + 0.038 * beat;
          heartGroup.scale.set(
            scaleMultiplier * (1 + 0.006 * beat),
            scaleMultiplier * (1 - 0.016 * beat),
            scaleMultiplier * (1 + 0.008 * beat),
          );
          realTubeMat.emissiveIntensity = 0.35 + 0.7 * beat;
          etchingTubeMat.emissiveIntensity = 0.28 + 0.65 * beat;

          // Camera Zoom
          const targetZ = baseCameraZ / targetZoomRef.current;
          camera.position.z += (targetZ - camera.position.z) * 0.1;

          // Hotspot 2D Screen Projection
          frameCount++;
          if (frameCount % 2 === 0 && showPinsRef.current) {
            const w = root.clientWidth;
            const h = root.clientHeight;
            const activeSpots = ANATOMICAL_HOTSPOTS.filter(
              (spot) => currentMode === "internal" || !spot.isInternal,
            );
            const projected = activeSpots.map((spot) => {
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
        setIsReady(true);

        cleanup = () => {
          io.disconnect();
          ro.disconnect();
          renderer.setAnimationLoop(null);
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
          septumGeo.dispose();
          mitralGeo.dispose();
          tricuspidGeo.dispose();
          scanGridGeo.dispose();
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
          audioSynthRef.current?.dispose();
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
    targetZoomRef.current = spot.isInternal ? 1.5 : 1.35;
  }, []);

  // Action: Reset View
  const handleReset = useCallback(() => {
    targetRotRef.current = { x: 0.05, y: -0.32 };
    targetZoomRef.current = 1.0;
    setActiveHotspot(null);
  }, []);

  // Action: 360° Viewing Presets
  const handlePresetAngle = useCallback(
    (angle: "front" | "back" | "left" | "right" | "arch" | "coronal") => {
      setActiveHotspot(null);
      switch (angle) {
        case "front":
          targetRotRef.current = { x: 0.05, y: -0.32 };
          targetZoomRef.current = 1.0;
          break;
        case "back":
          targetRotRef.current = { x: 0.05, y: Math.PI - 0.32 };
          targetZoomRef.current = 1.0;
          break;
        case "left":
          targetRotRef.current = { x: 0.08, y: Math.PI / 2 };
          targetZoomRef.current = 1.1;
          break;
        case "right":
          targetRotRef.current = { x: 0.08, y: -Math.PI / 2 };
          targetZoomRef.current = 1.1;
          break;
        case "arch":
          targetRotRef.current = { x: 0.95, y: -0.15 };
          targetZoomRef.current = 1.25;
          break;
        case "coronal":
          setMode("internal");
          targetRotRef.current = { x: 0.05, y: 0.0 };
          targetZoomRef.current = 1.35;
          break;
      }
    },
    [],
  );

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
      {/* ---------- Ultra-Premium Clinical Toolbar ---------- */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-5 py-3.5 backdrop-blur-md sm:px-7">
        {/* Left Title & Status */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
            </span>
            <h3 className="text-xs font-bold tracking-wider text-slate-800 sm:text-sm uppercase">
              3D Cardiac Vasculature & Chamber Simulator
            </h3>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold sm:text-[11px] ${
                mode === "engraving"
                  ? "border-rose-300 bg-rose-50 text-rose-700 shadow-sm"
                  : mode === "internal"
                    ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                    : "border-red-200 bg-red-50 text-red-600"
              }`}
            >
              {mode === "engraving"
                ? "Classical Illustrated 3D (Reference Style)"
                : mode === "internal"
                  ? "Internal 4-Chamber Coronal View"
                  : "Living External 3D"}
            </span>
          </div>
          <span className="mt-0.5 text-[10px] font-medium tracking-wide text-slate-400">
            Hand-Crafted Copperplate Etching · Real-Time Cardiac Torsion · Physiological S1/S2 Auscultation
          </span>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Mode Switchers: Reference Illustration vs Internal vs Living Medical */}
          <div className="flex items-center rounded-full border border-slate-200/90 bg-slate-100/80 p-1">
            <button
              type="button"
              onClick={() => setMode("engraving")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                mode === "engraving"
                  ? "bg-[#c93b33] text-white shadow-sm shadow-red-600/30"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Classic Gray's Anatomy copperplate medical etching (matches reference illustration)"
            >
              <span>🎨</span>
              <span>Illustration 3D</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("internal")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                mode === "internal"
                  ? "bg-cyan-700 text-white shadow-sm shadow-cyan-700/30"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Internal 4-chamber cross-section (Left & Right Ventricles, Septum, Valves)"
            >
              <span>🔬</span>
              <span>4-Chamber View</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("real")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                mode === "real"
                  ? "bg-red-600 text-white shadow-sm shadow-red-600/30"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title="Living photorealistic human myocardial anatomy"
            >
              <span>🫀</span>
              <span className="hidden sm:inline">Living 3D</span>
            </button>
          </div>

          {/* 2. Deep Learning AI Neural Scan Toggle */}
          <button
            type="button"
            onClick={() => setAiScanActive(!aiScanActive)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
              aiScanActive
                ? "border-cyan-400 bg-cyan-500 text-white shadow-sm shadow-cyan-500/30"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
            title="Toggle Deep Learning AI cardiac segmentation & holographic scanner"
          >
            <span className="relative flex h-2 w-2">
              {aiScanActive && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-200 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  aiScanActive ? "bg-white" : "bg-cyan-500"
                }`}
              />
            </span>
            <span>AI Neural Scan</span>
          </button>

          {/* 3. Physiological Heartbeat Sound (Mute/Unmute) */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
              !isMuted
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
            title={
              isMuted
                ? "Auscultation Sound Muted (Click to play realistic Lub-Dub heartbeat)"
                : "Auscultation Sound Active (Click to mute)"
            }
          >
            {!isMuted ? (
              <>
                <svg className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
                {/* Animated EQ soundwave bars */}
                <span className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-emerald-600 rounded-full animate-bounce h-2" />
                  <span className="w-0.5 bg-emerald-600 rounded-full animate-bounce h-3 delay-75" />
                  <span className="w-0.5 bg-emerald-600 rounded-full animate-bounce h-1.5 delay-150" />
                </span>
                <span>Sound On</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
                <span>Sound Muted</span>
              </>
            )}
          </button>

          {/* 4. Deploy Stent Action */}
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

          {/* 5. Pins Toggle */}
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

          {/* 6. Reset View */}
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
      <div className="relative aspect-[4/3] w-full min-h-[490px] sm:min-h-[550px] lg:min-h-[610px] bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#f8fafc_60%,#eef2f6_100%)] overflow-hidden">
        {/* Fallback while compiling / initializing */}
        <div
          style={{ opacity: isReady ? 0 : 1, pointerEvents: isReady ? "none" : "auto" }}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#f8fafc_60%,#eef2f6_100%)]"
        >
          {children || (
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-rose-500 shadow-lg shadow-red-500/30 text-white">
                  <svg className="h-6 w-6 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-xs font-bold tracking-widest text-slate-800 uppercase">
                  Rendering 3D Cardiac Anatomy
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Generating real-time coronary &amp; chamber vasculature...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* WebGL Canvas */}
        <canvas
          ref={canvasRef}
          aria-hidden
          style={{ opacity: isReady ? 1 : 0 }}
          className="absolute inset-0 h-full w-full transition-opacity duration-700"
        />

        {/* 360° Anatomical Angle Presets */}
        <div className="pointer-events-auto absolute left-4 top-4 z-30 hidden sm:flex items-center gap-1 rounded-full border border-slate-200/90 bg-white/90 p-1 text-[10.5px] font-semibold text-slate-700 shadow-sm backdrop-blur-md">
          <span className="px-2 text-[9px] uppercase tracking-wider text-slate-400">Angle:</span>
          <button
            type="button"
            onClick={() => handlePresetAngle("front")}
            className="rounded-full px-2.5 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => handlePresetAngle("coronal")}
            className="rounded-full px-2.5 py-1 text-cyan-700 font-bold hover:bg-cyan-50"
          >
            Coronal Cut
          </button>
          <button
            type="button"
            onClick={() => handlePresetAngle("arch")}
            className="rounded-full px-2.5 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Aortic Arch
          </button>
          <button
            type="button"
            onClick={() => handlePresetAngle("left")}
            className="rounded-full px-2.5 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Left LV
          </button>
          <button
            type="button"
            onClick={() => handlePresetAngle("back")}
            className="rounded-full px-2.5 py-1 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Posterior
          </button>
        </div>

        {/* Deep Learning AI Neural Scan Hologram HUD Overlay */}
        {aiScanActive && (
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-300">
            {/* Top Scanning Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-slate-950/85 px-3.5 py-2 text-cyan-300 shadow-lg backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
                </span>
                <span className="text-[11px] font-bold tracking-wider uppercase">
                  AI Deep Learning: CardioVision-ResNet (v5.2)
                </span>
                <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[9.5px] font-medium text-cyan-400 border border-cyan-800">
                  Inference: 12ms · 60 FPS
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-400/40 bg-slate-950/85 px-3 py-2 text-[10.5px] font-semibold text-emerald-400 shadow-lg backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>0 Stenosis · Normal Perfusion Index</span>
              </div>
            </div>

            {/* Middle Left & Right Telemetry Panels */}
            <div className="flex items-center justify-between">
              {/* Left AI Hemodynamics */}
              <div className="hidden sm:flex flex-col gap-2 rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-3.5 text-xs text-white shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between gap-4 border-b border-cyan-900/60 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  <span>AI Hemodynamics</span>
                  <span>Normal Range</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-300">LVEF (Ejection Fraction):</span>
                  <span className="font-bold text-emerald-400">62.8% [55-70%]</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-300">Stroke Volume:</span>
                  <span className="font-bold text-cyan-300">76 mL</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-300">Cardiac Output (CO):</span>
                  <span className="font-bold text-cyan-300">5.4 L/min</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-300">Myocardial GLS Strain:</span>
                  <span className="font-bold text-emerald-400">-19.2%</span>
                </div>
              </div>

              {/* Right AI Chamber Neural Segmentation */}
              <div className="hidden md:flex flex-col gap-2 rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-3.5 text-xs text-white shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between gap-4 border-b border-cyan-900/60 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  <span>Chamber Neural Segmentation</span>
                  <span>Confidence</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-300">Left Ventricle (LV Cavity):</span>
                  <span className="font-bold text-emerald-400">99.6%</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-300">Right Ventricle (RV Cavity):</span>
                  <span className="font-bold text-emerald-400">98.9%</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-300">Aortic Root / Arch:</span>
                  <span className="font-bold text-cyan-300">99.3%</span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-slate-300">LAD Coronary Bed:</span>
                  <span className="font-bold text-cyan-300">98.4%</span>
                </div>
              </div>
            </div>

            {/* Bottom Cybernetic Sweep Status */}
            <div className="flex items-center justify-center">
              <span className="rounded-full border border-cyan-400/50 bg-slate-950/90 px-4 py-1 text-[10.5px] font-medium tracking-wider text-cyan-300 shadow-md">
                3D VOXEL CLOUD RECONSTRUCTION · 60 FPS REAL-TIME SYNC
              </span>
            </div>
          </div>
        )}

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
                  <span
                    className={`absolute h-7 w-7 rounded-full border transition-transform group-hover:scale-125 ${
                      spot.isInternal
                        ? "border-cyan-400/50 bg-cyan-400/20"
                        : "border-red-400/50 bg-red-400/20"
                    }`}
                  />
                  <span
                    className={`absolute h-5 w-5 rounded-full animate-ping opacity-60 ${
                      spot.isInternal ? "bg-cyan-500/30" : "bg-red-500/25"
                    }`}
                  />
                  <span
                    className={`relative h-2.5 w-2.5 rounded-full border border-white transition-all ${
                      isSelected
                        ? spot.isInternal
                          ? "bg-cyan-500 scale-125 shadow-md shadow-cyan-500/50"
                          : "bg-red-600 scale-125 shadow-md shadow-red-600/50"
                        : "bg-white shadow-sm"
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
              <span
                className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase ${
                  activeHotspot.isInternal
                    ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
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
            <span>
              {mode === "internal"
                ? "Coronal cutaway active: Inspecting 4 internal chambers & valves"
                : "Drag 360° to inspect • Switch to Internal View or AI Neural Scan"}
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Telemetry Strip ---------- */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
        {/* Left Vital Stats */}
        <div className="flex flex-wrap items-center gap-5 text-xs">
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
        <div className="flex items-center gap-2 text-xs">
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
