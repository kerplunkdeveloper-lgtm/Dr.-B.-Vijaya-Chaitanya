/**
 * Procedural anatomical heart (pure maths — no three.js import).
 *
 * Highly optimized for real-time performance:
 * - Precomputed segment geometric constants
 * - High-speed Math.sqrt evaluation (replaces slow Math.hypot polyfill)
 * - Spatial bounding-box & vertical culling for vessel/chamber SDFs
 */

type Vec = [number, number, number];

/** model-space half extent covered by the marching-cubes grid ([-1,1] grid → [-S,S] model) */
export const MODEL_SCALE = 1.15;
/** vertical offset that centres the heart on the origin */
export const CENTER_Y = 0.17;

/* ---------------- tiny SDF toolkit ---------------- */

const smin = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};
const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

interface EllipsoidDef {
  cx: number;
  cy: number;
  cz: number;
  cosPhi: number;
  sinPhi: number;
  invRu: number;
  invRv: number;
  invRw: number;
  invRu2: number;
  invRv2: number;
  invRw2: number;
  rv: number;
  minR: number;
  taper: number;
}

function makeEllipsoid(
  cx: number, cy: number, cz: number,
  ru: number, rv: number, rw: number,
  phi: number, taper = 0,
): EllipsoidDef {
  return {
    cx, cy, cz,
    cosPhi: Math.cos(phi),
    sinPhi: Math.sin(phi),
    invRu: 1 / ru,
    invRv: 1 / rv,
    invRw: 1 / rw,
    invRu2: 1 / (ru * ru),
    invRv2: 1 / (rv * rv),
    invRw2: 1 / (rw * rw),
    rv,
    minR: Math.min(ru, rv, rw),
    taper,
  };
}

function ellipsoidFast(px: number, py: number, pz: number, e: EllipsoidDef): number {
  const dx = px - e.cx;
  const dy = py - e.cy;
  const dz = pz - e.cz;
  let u = e.cosPhi * dx - e.sinPhi * dy;
  const v = e.sinPhi * dx + e.cosPhi * dy;
  let w = dz;
  if (e.taper > 0) {
    const t = Math.min(1, Math.max(0, (v / e.rv + 1) * 0.8));
    const k = 1 - e.taper * (1 - t * t * (3 - 2 * t));
    u /= k;
    w /= k;
  }
  const u_ru = u * e.invRu;
  const v_rv = v * e.invRv;
  const w_rw = w * e.invRw;
  const k0 = Math.sqrt(u_ru * u_ru + v_rv * v_rv + w_rw * w_rw);

  const u_ru2 = u * e.invRu2;
  const v_rv2 = v * e.invRv2;
  const w_rw2 = w * e.invRw2;
  const k1 = Math.sqrt(u_ru2 * u_ru2 + v_rv2 * v_rv2 + w_rw2 * w_rw2);

  return k1 === 0 ? -e.minR : (k0 * (k0 - 1)) / k1;
}

interface Segment {
  ax: number;
  ay: number;
  az: number;
  bax: number;
  bay: number;
  baz: number;
  invLenSq: number;
  ra: number;
  dra: number;
}

function makeSegments(pts: readonly (readonly [number, number, number, number])[]): Segment[] {
  const segs: Segment[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const bax = b[0] - a[0];
    const bay = b[1] - a[1];
    const baz = b[2] - a[2];
    const lenSq = bax * bax + bay * bay + baz * baz;
    segs.push({
      ax: a[0],
      ay: a[1],
      az: a[2],
      bax,
      bay,
      baz,
      invLenSq: lenSq > 0 ? 1 / lenSq : 0,
      ra: a[3],
      dra: b[3] - a[3],
    });
  }
  return segs;
}

function pathFast(px: number, py: number, pz: number, segs: Segment[]): number {
  let d = Infinity;
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    const pax = px - s.ax;
    const pay = py - s.ay;
    const paz = pz - s.az;
    let h = (pax * s.bax + pay * s.bay + paz * s.baz) * s.invLenSq;
    if (h < 0) h = 0;
    else if (h > 1) h = 1;
    const r = s.ra + s.dra * h;
    const qx = pax - s.bax * h;
    const qy = pay - s.bay * h;
    const qz = paz - s.baz * h;
    const dd = Math.sqrt(qx * qx + qy * qy + qz * qz) - r;
    if (dd < d) d = dd;
  }
  return d;
}

// Precomputed chambers
const LV_ELLIPSE = makeEllipsoid(0.1, -0.08, -0.04, 0.4, 0.68, 0.38, 0.38, 0.5);
const RV_ELLIPSE = makeEllipsoid(-0.25, 0.06, 0.2, 0.3, 0.44, 0.26, 0.34, 0.3);
const RA_ELLIPSE = makeEllipsoid(-0.4, 0.24, 0.02, 0.2, 0.28, 0.2, 0);
const LA_ELLIPSE = makeEllipsoid(0.18, 0.36, -0.3, 0.3, 0.2, 0.2, 0);
const LAU_ELLIPSE = makeEllipsoid(0.4, 0.3, 0.14, 0.12, 0.2, 0.1, -0.3);
const RAU_ELLIPSE = makeEllipsoid(-0.26, 0.4, 0.26, 0.14, 0.12, 0.1, 0.2);

// Precomputed vessel segments
const AORTA_SEGS = makeSegments([
  [0.06, 0.36, -0.02, 0.108],
  [0.07, 0.62, -0.04, 0.102],
  [0.15, 0.81, -0.06, 0.098],
  [0.3, 0.88, -0.08, 0.092],
  [0.42, 0.76, -0.1, 0.086],
  [0.45, 0.52, -0.14, 0.082],
]);
// 3 Aortic Arch Branches (Brachiocephalic, Left Common Carotid, Left Subclavian)
const ARCH_A_SEGS = makeSegments([[0.13, 0.84, -0.05, 0.046], [0.11, 1.06, -0.05, 0.038]]);
const ARCH_B_SEGS = makeSegments([[0.24, 0.88, -0.07, 0.042], [0.25, 1.07, -0.08, 0.035]]);
const ARCH_C_SEGS = makeSegments([[0.34, 0.86, -0.09, 0.040], [0.37, 1.05, -0.11, 0.033]]);

const PULM_TRUNK_SEGS = makeSegments([
  [-0.1, 0.36, 0.14, 0.088],
  [-0.14, 0.6, 0.15, 0.082],
  [-0.26, 0.77, 0.12, 0.076],
]);
const PULM_RIGHT_SEGS = makeSegments([[-0.26, 0.77, 0.12, 0.072], [-0.58, 0.8, -0.02, 0.06]]);
const PULM_LEFT_SEGS = makeSegments([[-0.26, 0.77, 0.12, 0.07], [0.02, 0.84, -0.16, 0.058]]);
const PULM_LAT_TOP_SEGS = makeSegments([[0.36, 0.46, -0.12, 0.044], [0.55, 0.44, -0.14, 0.038]]);
const PULM_LAT_BOT_SEGS = makeSegments([[0.38, 0.32, -0.14, 0.040], [0.56, 0.30, -0.16, 0.035]]);

const SVC_SEGS = makeSegments([[-0.43, 0.38, 0.0, 0.082], [-0.46, 0.98, -0.02, 0.074]]);
const GROOVE_SEGS = makeSegments([
  [0.02, 0.4, 0.3, 0.032],
  [-0.06, 0.05, 0.4, 0.03],
  [-0.2, -0.4, 0.3, 0.026],
  [-0.27, -0.66, 0.12, 0.022],
]);

/** signed distance to the heart (model space; negative inside) */
export function heartSdf(x: number, y: number, z: number): number {
  // cheap bounding-box reject
  if (x < -0.75 || x > 0.7 || y < -0.95 || y > 1.2 || z < -0.6 || z > 0.65) {
    const dx = Math.max(-0.75 - x, 0, x - 0.7);
    const dy = Math.max(-0.95 - y, 0, y - 1.2);
    const dz = Math.max(-0.6 - z, 0, z - 0.65);
    return Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.05;
  }

  // chambers (ventricles + atria)
  let d = ellipsoidFast(x, y, z, LV_ELLIPSE);
  d = smin(d, ellipsoidFast(x, y, z, RV_ELLIPSE), 0.14);
  d = smin(d, ellipsoidFast(x, y, z, RA_ELLIPSE), 0.12);
  d = smin(d, ellipsoidFast(x, y, z, LA_ELLIPSE), 0.12);
  d = smin(d, ellipsoidFast(x, y, z, LAU_ELLIPSE), 0.08);
  d = smin(d, ellipsoidFast(x, y, z, RAU_ELLIPSE), 0.08);

  // great vessels (upper anatomical region y > 0.1)
  if (y > 0.1) {
    let v = pathFast(x, y, z, AORTA_SEGS);
    v = smin(v, pathFast(x, y, z, ARCH_A_SEGS), 0.03);
    v = smin(v, pathFast(x, y, z, ARCH_B_SEGS), 0.03);
    v = smin(v, pathFast(x, y, z, ARCH_C_SEGS), 0.03);
    v = smin(v, pathFast(x, y, z, PULM_TRUNK_SEGS), 0.05);
    v = smin(v, pathFast(x, y, z, PULM_RIGHT_SEGS), 0.04);
    v = smin(v, pathFast(x, y, z, PULM_LEFT_SEGS), 0.04);
    v = smin(v, pathFast(x, y, z, PULM_LAT_TOP_SEGS), 0.035);
    v = smin(v, pathFast(x, y, z, PULM_LAT_BOT_SEGS), 0.035);
    v = smin(v, pathFast(x, y, z, SVC_SEGS), 0.05);
    d = smin(d, v, 0.07);
  }

  // carve the anterior interventricular groove
  if (y > -0.75 && y < 0.45) {
    d = smax(d, -pathFast(x, y, z, GROOVE_SEGS) + 0.012, 0.035);
  }

  return d;
}

/**
 * Fills a marching-cubes field. `size` is the grid resolution; grid cell (ix,iy,iz) sits at
 * ((i − size/2)/(size/2)) ∈ [-1,1), mapped to model space by MODEL_SCALE.
 */
export function fillHeartField(field: Float32Array, size: number, isolation: number, k = 70) {
  const half = size / 2;
  let q = 0;
  for (let z = 0; z < size; z++) {
    const mz = ((z - half) / half) * MODEL_SCALE;
    for (let y = 0; y < size; y++) {
      const my = ((y - half) / half) * MODEL_SCALE + CENTER_Y * 0;
      for (let x = 0; x < size; x++, q++) {
        const mx = ((x - half) / half) * MODEL_SCALE;
        const edge = x < 2 || y < 2 || z < 2 || x > size - 3 || y > size - 3 || z > size - 3;
        field[q] = edge ? 0 : isolation - heartSdf(mx, my, mz) * k;
      }
    }
  }
}

/* ---------------- coronary arteries ---------------- */

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gradient(p: Vec): Vec {
  const e = 0.012;
  const gx = heartSdf(p[0] + e, p[1], p[2]) - heartSdf(p[0] - e, p[1], p[2]);
  const gy = heartSdf(p[0], p[1] + e, p[2]) - heartSdf(p[0], p[1] - e, p[2]);
  const gz = heartSdf(p[0], p[1], p[2] + e) - heartSdf(p[0], p[1], p[2] - e);
  const l = Math.sqrt(gx * gx + gy * gy + gz * gz) || 1;
  return [gx / l, gy / l, gz / l];
}

/** snaps a point onto the heart surface, then lifts it slightly outwards */
function onSurface(p: Vec, lift: number): { p: Vec; n: Vec } {
  let q: Vec = [...p];
  for (let i = 0; i < 6; i++) {
    const d = heartSdf(q[0], q[1], q[2]);
    const g = gradient(q);
    q = [q[0] - g[0] * d, q[1] - g[1] * d, q[2] - g[2] * d];
  }
  const n = gradient(q);
  return { p: [q[0] + n[0] * lift, q[1] + n[1] * lift, q[2] + n[2] * lift], n };
}

export type ArteryPath = { points: Vec[]; radius: number };

/** random surface walk; `bias` pulls the heading toward a target direction */
function walk(
  start: Vec,
  dir: Vec,
  steps: number,
  step: number,
  rand: () => number,
  bias: Vec,
  biasK: number,
  wobble: number,
  radius: number,
): ArteryPath {
  const pts: Vec[] = [];
  let cur = onSurface(start, 0).p;
  let d: Vec = [...dir];
  for (let i = 0; i < steps; i++) {
    const s = onSurface(cur, radius * 0.7);
    pts.push(s.p);
    // tangent heading: bias + wobble, minus the normal component
    let h: Vec = [
      d[0] + bias[0] * biasK + (rand() - 0.5) * wobble,
      d[1] + bias[1] * biasK + (rand() - 0.5) * wobble,
      d[2] + bias[2] * biasK + (rand() - 0.5) * wobble,
    ];
    const dn = h[0] * s.n[0] + h[1] * s.n[1] + h[2] * s.n[2];
    h = [h[0] - s.n[0] * dn, h[1] - s.n[1] * dn, h[2] - s.n[2] * dn];
    const l = Math.sqrt(h[0] * h[0] + h[1] * h[1] + h[2] * h[2]) || 1;
    d = [h[0] / l, h[1] / l, h[2] / l];
    cur = [s.p[0] + d[0] * step, s.p[1] + d[1] * step, s.p[2] + d[2] * step];
  }
  return { points: pts, radius };
}

/** the three main coronary trunks plus a few levels of branches */
export function generateArteries(seed = 7): ArteryPath[] {
  const rand = rng(seed);
  const out: ArteryPath[] = [];
  const apex: Vec = [-0.2, -0.72, 0.1];

  const trunks: ArteryPath[] = [
    // left anterior descending — down the groove to the apex
    walk([0.1, 0.36, 0.2], [-0.15, -1, 0.1], 34, 0.04, rand, [-0.05, -1, 0.05], 0.5, 0.04, 0.034),
    // circumflex — round the left border
    walk([0.12, 0.36, 0.16], [1, -0.15, -0.35], 26, 0.04, rand, [0.1, -0.6, -0.3], 0.18, 0.05, 0.028),
    // right coronary — round the right border
    walk([0.0, 0.4, 0.24], [-1, -0.1, 0.1], 30, 0.04, rand, [-0.2, -0.9, 0.1], 0.2, 0.05, 0.029),
  ];
  out.push(...trunks);

  const branch = (parent: ArteryPath, depth: number, startIdx: number, side: number) => {
    const i = Math.min(parent.points.length - 2, Math.max(1, startIdx));
    const a = parent.points[i], b = parent.points[i + 1];
    const t: Vec = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const n = gradient(a);
    // sideways direction on the surface = n × t
    let s: Vec = [n[1] * t[2] - n[2] * t[1], n[2] * t[0] - n[0] * t[2], n[0] * t[1] - n[1] * t[0]];
    const sl = Math.sqrt(s[0] * s[0] + s[1] * s[1] + s[2] * s[2]) || 1;
    s = [(s[0] / sl) * side, (s[1] / sl) * side, (s[2] / sl) * side];
    const dir: Vec = [s[0] * 0.9 + t[0] * 8, s[1] * 0.9 + t[1] * 8, s[2] * 0.9 + t[2] * 8];
    const steps = Math.round((depth === 1 ? 10 : 7) + rand() * 5);
    const br = walk(a, dir, steps, depth === 1 ? 0.036 : 0.03, rand, apex.map((v, k) => v - a[k]) as Vec, 0.3, 0.1, parent.radius * (depth === 1 ? 0.6 : 0.55));
    out.push(br);
    if (depth < 2 && steps > 7) {
      for (let k = 0; k < 2; k++) branch(br, depth + 1, 2 + Math.floor(rand() * (br.points.length - 3)), rand() > 0.5 ? 1 : -1);
    }
  };

  for (const trunk of trunks) {
    const count = 5 + Math.floor(rand() * 2);
    for (let k = 0; k < count; k++) {
      const idx = 3 + Math.floor((k / count) * (trunk.points.length - 5));
      branch(trunk, 1, idx, k % 2 ? 1 : -1);
    }
  }
  return out;
}

/** merges artery paths into tapered tube geometry buffers */
export function buildTubes(paths: ArteryPath[], radial = 6) {
  const pos: number[] = [];
  const nor: number[] = [];
  const idx: number[] = [];
  let base = 0;

  for (const p of paths) {
    const n = p.points.length;
    if (n < 3) continue;
    // parallel-transport frame
    let ref: Vec = [0, 0, 1];
    for (let i = 0; i < n; i++) {
      const a = p.points[Math.max(0, i - 1)], b = p.points[Math.min(n - 1, i + 1)];
      let t: Vec = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const tl = Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2]) || 1;
      t = [t[0] / tl, t[1] / tl, t[2] / tl];
      // normal = ref minus its tangent component
      const dt = ref[0] * t[0] + ref[1] * t[1] + ref[2] * t[2];
      let nn: Vec = [ref[0] - t[0] * dt, ref[1] - t[1] * dt, ref[2] - t[2] * dt];
      const nl = Math.sqrt(nn[0] * nn[0] + nn[1] * nn[1] + nn[2] * nn[2]) || 1;
      nn = [nn[0] / nl, nn[1] / nl, nn[2] / nl];
      ref = nn;
      const bb: Vec = [t[1] * nn[2] - t[2] * nn[1], t[2] * nn[0] - t[0] * nn[2], t[0] * nn[1] - t[1] * nn[0]];
      const taper = 1 - 0.55 * (i / (n - 1));
      const r = p.radius * taper;
      const c = p.points[i];
      for (let j = 0; j < radial; j++) {
        const th = (j / radial) * Math.PI * 2;
        const cx = Math.cos(th), sy = Math.sin(th);
        const ox = nn[0] * cx + bb[0] * sy, oy = nn[1] * cx + bb[1] * sy, oz = nn[2] * cx + bb[2] * sy;
        pos.push(c[0] + ox * r, c[1] + oy * r, c[2] + oz * r);
        nor.push(ox, oy, oz);
      }
    }
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < radial; j++) {
        const a = base + i * radial + j;
        const b = base + i * radial + ((j + 1) % radial);
        const c = base + (i + 1) * radial + j;
        const d = base + (i + 1) * radial + ((j + 1) % radial);
        idx.push(a, c, b, b, c, d);
      }
    }
    base += n * radial;
  }
  return {
    positions: new Float32Array(pos),
    normals: new Float32Array(nor),
    indices: new Uint32Array(idx),
  };
}
