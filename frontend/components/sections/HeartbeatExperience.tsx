"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const HEART_IMAGE = "/heart.png";
const BPM_OPTIONS = [60, 72, 98, 115];

export function HeartbeatExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualRef = useRef<HTMLElement>(null);
  const bpmRef = useRef(72);
  const playingRef = useRef(false);
  const [bpm, setBpm] = useState(72);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(45);
  const audioRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextBeatRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = visualRef.current;
    if (!canvas || !host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 8);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    scene.add(new THREE.AmbientLight(0xffffff, 1.9));
    const key = new THREE.DirectionalLight(0xffd2d0, 2.2);
    key.position.set(-3, 4, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0xff183b, 8, 15);
    rim.position.set(2, -1, 4);
    scene.add(rim);

    const heart = new THREE.Group();
    scene.add(heart);
    let heartMesh: THREE.Mesh | undefined;
    const texture = new THREE.TextureLoader().load(HEART_IMAGE, (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace;
      const aspect = loaded.image.width / loaded.image.height;
      heartMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(4.35 * aspect, 4.35),
        new THREE.MeshBasicMaterial({
          map: loaded,
          transparent: true,
          alphaTest: 0.015,
          side: THREE.DoubleSide,
          toneMapped: false,
        }),
      );
      heart.add(heartMesh);
    });

    const particles: number[] = [];
    for (let i = 0; i < 420; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.1 + Math.random() * 2.9;
      particles.push(Math.cos(angle) * radius, (Math.random() - 0.5) * 5, Math.sin(angle) * radius - 1.4);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(particles, 3));
    const dust = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0xff6674, size: 0.018, transparent: true, opacity: 0.48, depthWrite: false }),
    );
    scene.add(dust);

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = window.innerWidth < 850 ? 8.8 : 8;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let phase = 0;
    let previous = performance.now();
    let frame = 0;
    const beatShape = (time: number) => {
      const period = 60 / bpmRef.current;
      const x = (time % period) / period;
      const pulse = (center: number, width: number) => Math.exp(-Math.pow((x - center) / width, 2));
      return 1 + 0.055 * pulse(0.05, 0.035) + 0.105 * pulse(0.105, 0.045) + 0.038 * pulse(0.18, 0.065);
    };
    const animate = (now: number) => {
      frame = requestAnimationFrame(animate);
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      if (playingRef.current) phase += dt;
      const pulse = beatShape(phase);
      heart.scale.setScalar(pulse);
      heart.rotation.y = Math.sin(now * 0.00035) * 0.055;
      heart.rotation.z = Math.sin(now * 0.0005) * 0.012;
      dust.rotation.y += dt * 0.025;
      rim.intensity = playingRef.current ? 7 + Math.max(0, pulse - 1) * 32 : 3.8;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      texture.dispose();
      heartMesh?.geometry.dispose();
      (heartMesh?.material as THREE.Material | undefined)?.dispose();
      particleGeometry.dispose();
      (dust.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  const setBpmValue = (value: number) => {
    bpmRef.current = value;
    setBpm(value);
    if (playingRef.current && audioRef.current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      nextBeatRef.current = audioRef.current.currentTime + 0.04;
      scheduleLoop();
    }
  };

  const thump = (when: number, frequency: number, duration: number, gain: number, cutoff: number) => {
    const context = audioRef.current;
    const master = masterRef.current;
    if (!context || !master) return;
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const amplitude = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, when);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, frequency * 0.48), when + duration);
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    amplitude.gain.setValueAtTime(0.0001, when);
    amplitude.gain.exponentialRampToValueAtTime(gain, when + 0.012);
    amplitude.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(filter).connect(amplitude).connect(master);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.02);
  };

  const scheduleBeat = (time: number) => {
    thump(time, 78, 0.18, 0.8, 155);
    thump(time + 0.16, 58, 0.22, 0.48, 115);
  };

  const scheduleLoop = () => {
    const context = audioRef.current;
    if (!context || !playingRef.current) return;
    while (nextBeatRef.current < context.currentTime + 0.12) {
      scheduleBeat(nextBeatRef.current);
      nextBeatRef.current += 60 / bpmRef.current;
    }
    timerRef.current = setTimeout(scheduleLoop, 35);
  };

  const togglePlayback = async () => {
    if (playingRef.current) {
      playingRef.current = false;
      setPlaying(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    if (!audioRef.current) {
      const context = new AudioContext();
      const master = context.createGain();
      master.gain.value = volume / 100;
      master.connect(context.destination);
      audioRef.current = context;
      masterRef.current = master;
    }
    await audioRef.current.resume();
    playingRef.current = true;
    setPlaying(true);
    nextBeatRef.current = audioRef.current.currentTime + 0.07;
    scheduleLoop();
  };

  const changeVolume = (value: number) => {
    setVolume(value);
    const context = audioRef.current;
    const master = masterRef.current;
    if (context && master) master.gain.setTargetAtTime(value / 100, context.currentTime, 0.04);
  };

  return (
    <section id="heartbeat-experience" className={`pulse-app${playing ? " is-playing" : ""} bg-[#000000]`}>
      <div className="pulse-noise" />
     <div></div>

      <main className="pulse-main">
        <section className="pulse-copy">
          <div className="pulse-eyebrow">A study in rhythm</div>
          <h1>
            Feel the<br />
            <span>life within.</span>
          </h1>
          <p className="pulse-sub">
            An anatomical heartbeat, brought to life. Choose a rhythm and listen to every beat.
          </p>
          <div className="pulse-label">SET HEART RATE · BPM</div>
          <div className="pulse-bpm-options" role="group" aria-label="Set beats per minute">
            {BPM_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={bpm === option ? "active" : ""}
                aria-pressed={bpm === option}
                onClick={() => setBpmValue(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <section className="pulse-visual" ref={visualRef} aria-label="Animated anatomical heart">
          <div className="pulse-halo" />
          <canvas ref={canvasRef} />
          <div className="pulse-visual-label">CARDIAC CYCLE · {bpm} BPM</div>
        </section>
      </main>

      <footer className="pulse-footer">
        <div className="pulse-readout">
          <div>
            <div className="pulse-number">
              {bpm}<span> BPM</span>
            </div>
            <div className="pulse-caption">beats per minute</div>
          </div>
          <div className="pulse-wave" aria-hidden="true">
            {Array.from({ length: 31 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${i * 0.019}s` }} />
            ))}
          </div>
        </div>
        <div className="pulse-controls">
          <label className="pulse-volume" aria-label="Volume">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(event) => changeVolume(Number(event.target.value))}
            />
          </label>
          <span className="pulse-state">{playing ? "SOUND ON" : "SOUND OFF"}</span>
          <button
            className="pulse-play"
            type="button"
            onClick={togglePlayback}
            aria-label={playing ? "Pause heartbeat" : "Start heartbeat"}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 5h4v14H7zM15 5h4v14h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="m8 5 12 7-12 7V5Z" />
              </svg>
            )}
          </button>
        </div>
      </footer>
      <style>{`
        .pulse-app {
          --red: #ff334e;
          min-height: 650px;
          height: auto;
          display: grid;
          grid-template-rows: 78px 1fr 102px;
          padding: 0 5.5vw;
          overflow: hidden;
          background: #000000;
          color: #f4f2f4;
          font-family: var(--font-poppins), 'Poppins', sans-serif !important;
          position: relative;
          isolation: isolate;
        }
        .pulse-app * {
          box-sizing: border-box;
          font-family: var(--font-poppins), 'Poppins', sans-serif !important;
        }
        .pulse-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .08;
          z-index: -1;
        }
        .pulse-top,
        .pulse-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #ffffff18;
        }
        .pulse-footer {
          border: 0;
          border-top: 1px solid #ffffff18;
        }
        .pulse-brand,
        .pulse-live,
        .pulse-readout,
        .pulse-controls,
        .pulse-volume,
        .pulse-bpm-options {
          display: flex;
          align-items: center;
        }
        .pulse-brand {
          gap: 12px;
          font-size: 13px;
          letter-spacing: .2em;
          font-weight: 700;
        }
        .pulse-mark {
          width: 30px;
          height: 30px;
          border: 1px solid #ff46576b;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: var(--red);
        }
        .pulse-brand-muted {
          color: #77747d;
        }
        .pulse-live {
          gap: 9px;
          color: #a5a2aa;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .12em;
        }
        .pulse-live i {
          width: 6px;
          height: 6px;
          background: var(--red);
          border-radius: 50%;
          box-shadow: 0 0 12px var(--red);
          animation: pulseBlink 1.5s infinite;
        }
        @keyframes pulseBlink {
          50% { opacity: .35; }
        }
        .pulse-main {
          display: grid;
          grid-template-columns: minmax(310px, .82fr) minmax(420px, 1.18fr);
          align-items: center;
          max-width: 1300px;
          width: 100%;
          margin: auto;
          padding: 24px 0;
        }
        .pulse-copy {
          padding: 0 0 18px 3vw;
          position: relative;
          z-index: 2;
        }
        .pulse-eyebrow,
        .pulse-label,
        .pulse-state,
        .pulse-visual-label {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: .16em;
        }
        .pulse-eyebrow {
          color: var(--red);
          text-transform: uppercase;
          margin-bottom: 23px;
        }
        .pulse-eyebrow:before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 1px;
          background: var(--red);
          vertical-align: middle;
          margin-right: 11px;
        }
        .pulse-copy h1 {
          font-size: clamp(44px, 6vw, 82px);
          line-height: .99;
          letter-spacing: -.03em;
          font-weight: 600;
          margin: 0 0 20px;
        }
        .pulse-copy h1 span {
          color: #77747d;
        }
        .pulse-sub {
          color: #99969f;
          line-height: 1.7;
          font-size: 14px;
          max-width: 340px;
          margin: 0 0 34px;
        }
        .pulse-label {
          color: #88858e;
          margin-bottom: 12px;
        }
        .pulse-bpm-options {
          gap: 8px;
        }
        .pulse-bpm-options button {
          width: 55px;
          height: 42px;
          border: 1px solid #ffffff24;
          border-radius: 9px;
          background: #ffffff08;
          color: #bbb8c0;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pulse-bpm-options button.active {
          background: var(--red);
          color: #fff;
          border-color: var(--red);
          box-shadow: 0 5px 20px #ff334e3b;
        }
        .pulse-visual {
          height: min(70vh, 680px);
          min-height: 420px;
          position: relative;
          display: grid;
          place-items: center;
        }
        .pulse-visual:before {
          content: '';
          position: absolute;
          width: min(39vw, 490px);
          height: min(39vw, 490px);
          border-radius: 50%;
          background: radial-gradient(circle, #bd142b30, transparent 70%);
          filter: blur(12px);
        }
        .pulse-visual canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .pulse-halo {
          position: absolute;
          width: min(34vw, 415px);
          height: min(34vw, 415px);
          border-radius: 50%;
          border: 1px solid #ff3e5618;
          box-shadow: 0 0 65px #fa314012, inset 0 0 45px #fa314009;
        }
        .pulse-halo:before,
        .pulse-halo:after {
          content: '';
          position: absolute;
          border: 1px solid #ffffff10;
          border-radius: 50%;
          inset: 13%;
        }
        .pulse-halo:after {
          inset: -10%;
          border-color: #ff3e5610;
        }
        .pulse-visual-label {
          position: absolute;
          bottom: 5%;
          color: #77737d;
        }
        .pulse-readout {
          gap: 15px;
        }
        .pulse-number {
          font-size: 36px;
          letter-spacing: -.03em;
          font-weight: 600;
          line-height: 1;
        }
        .pulse-number span {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .13em;
          color: #88858e;
        }
        .pulse-caption {
          font-size: 11px;
          color: #a6a3ab;
          margin-top: 5px;
        }
        .pulse-wave {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 35px;
          margin-left: 12px;
        }
        .pulse-wave i {
          display: block;
          width: 2px;
          height: 5px;
          background: #ff4056;
          border-radius: 2px;
          opacity: .7;
        }
        .is-playing .pulse-wave i {
          animation: pulseWave .72s ease-in-out infinite alternate;
        }
        .pulse-wave i:nth-child(3n) { animation-delay: .12s; }
        .pulse-wave i:nth-child(3n + 1) { animation-delay: .25s; }
        .pulse-wave i:nth-child(4n) { animation-delay: .36s; }
        @keyframes pulseWave {
          to {
            height: 25px;
            opacity: 1;
          }
        }
        .pulse-controls {
          gap: 20px;
        }
        .pulse-volume {
          gap: 10px;
          color: #aaa7b0;
        }
        .pulse-volume svg {
          width: 16px;
          height: 16px;
        }
        .pulse-volume input {
          width: 92px;
          accent-color: var(--red);
          height: 3px;
        }
        .pulse-state {
          font-size: 9px;
          font-weight: 600;
          color: #68656f;
        }
        .pulse-play {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 0;
          background: #f6f3f5;
          color: #111;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: transform .2s;
        }
        .pulse-play:hover {
          transform: scale(1.06);
        }
        .pulse-play svg {
          width: 18px;
          height: 18px;
        }
        @media (max-width: 850px) {
          .pulse-app {
            min-height: 720px;
            height: auto;
            padding: 24px 7vw;
            grid-template-rows: auto 1fr auto;
            gap: 20px;
          }
          .pulse-main {
            grid-template-columns: 1fr;
            grid-template-rows: auto minmax(280px, 1fr);
            padding-top: 16px;
          }
          .pulse-copy {
            padding: 0;
            grid-row: 1;
          }
          .pulse-eyebrow { margin-bottom: 14px; }
          .pulse-copy h1 {
            font-size: clamp(38px, 9vw, 56px);
            margin-bottom: 12px;
          }
          .pulse-sub {
            font-size: 13px;
            margin-bottom: 22px;
          }
          .pulse-visual {
            grid-row: 2;
            min-height: 280px;
            height: 340px;
            margin-top: 10px;
          }
          .pulse-halo {
            width: min(68vw, 320px);
            height: min(68vw, 320px);
          }
          .pulse-visual:before {
            width: min(72vw, 360px);
            height: min(72vw, 360px);
          }
          .pulse-visual-label { bottom: 1%; }
          .pulse-state { display: none; }
          .pulse-wave { margin-left: 0; }
        }
        @media (max-width: 440px) {
          .pulse-app { padding: 20px 5vw; }
          .pulse-copy h1 { font-size: 38px; }
          .pulse-visual { min-height: 260px; height: 300px; }
          .pulse-controls { gap: 12px; }
          .pulse-volume input { width: 60px; }
          .pulse-readout { gap: 8px; }
          .pulse-number { font-size: 28px; }
        }
      `}</style>
    </section>
  );
}

export default HeartbeatExperience;
