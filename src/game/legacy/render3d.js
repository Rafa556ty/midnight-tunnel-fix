// @ts-nocheck
/* eslint-disable */
// Ported from the published Supercar Highway Dash build.
import {
  Box3 as e,
  BoxGeometry as t,
  BufferAttribute as n,
  BufferGeometry as r,
  CanvasTexture as i,
  CatmullRomCurve3 as a,
  CircleGeometry as o,
  ClampToEdgeWrapping as s,
  Color as c,
  ConeGeometry as l,
  CylinderGeometry as u,
  DirectionalLight as d,
  DynamicDrawUsage as f,
  Euler as p,
  Float32BufferAttribute as m,
  Fog as h,
  Group as g,
  HemisphereLight as _,
  InstancedMesh as v,
  LineBasicMaterial as y,
  LineSegments as b,
  Matrix4 as x,
  Mesh as S,
  MeshBasicMaterial as C,
  MeshStandardMaterial as w,
  Object3D as T,
  PMREMGenerator as ee,
  PerspectiveCamera as te,
  PlaneGeometry as E,
  PointLight as ne,
  Quaternion as D,
  Raycaster as re,
  RepeatWrapping as ie,
  SRGBColorSpace as O,
  Scene as ae,
  ShaderMaterial as oe,
  SpotLight as se,
  Sprite as ce,
  SpriteMaterial as le,
  TextureLoader as ue,
  TubeGeometry as de,
  Vector3 as k,
  WebGLRenderer as fe,
} from "three";
import { l as pe } from "./car-custom.js";
import { applyCarCustom as me } from "./car-paint.js";
import {
  i as he,
  loadCar as ge,
  n as _e,
  r as ve,
  t as ye,
  trimChironForTrack as be,
} from "./models3d.js";
import {
  _ as xe,
  a as Se,
  c as Ce,
  d as we,
  g as Te,
  h as Ee,
  i as De,
  k as Oe,
  l as ke,
  m as Ae,
  n as je,
  o as Me,
  r as Ne,
  s as Pe,
  t as Fe,
  u as Ie,
  v as A,
} from "./world.js";
import { GLTFLoader as WBLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// Bridge over water built from the player's bridge model (flattened + aligned to the road).
var WB_URL = `/__l5e/assets-v1/4e32c0a7-2471-4f2c-a8b2-ffcc16ad531e/water-bridge.glb`,
  WB_START = 3650,
  WB_LEN = 663,
  WB_LOOP = 5800,
  onWaterBridge = (z) => {
    let p = ((z % WB_LOOP) + WB_LOOP) % WB_LOOP;
    return p > WB_START - 40 && p < WB_START + WB_LEN + 40;
  };
import { i as Le, n as Re, r as ze, t as Be } from "./quality.js";
var Ve = () => ({
    roll: 0,
    rollV: 0,
    pitch: 0,
    pitchV: 0,
    lastRot: 0,
    lastSpeed: 0,
  }),
  He = 0.55,
  Ue = 0.045,
  We = 0.03,
  Ge = 90,
  Ke = 13;
function qe(e, t, n, r, i) {
  let a = Math.min(i, 0.05);
  if (a <= 0) return e;
  let o = (n - e.lastSpeed) / a,
    s = Math.min(1, n / 120),
    c = j(t * He * s, -0.045, Ue),
    l = j((r ? -0.022 : 0) + j(o / 60, -1, 1) * 0.008, -0.03, We),
    u = e.rollV + (Ge * (c - e.roll) - Ke * e.rollV) * a,
    d = e.pitchV + (Ge * (l - e.pitch) - Ke * e.pitchV) * a;
  return {
    roll: j(e.roll + u * a, -0.045 * 1.3, Ue * 1.3),
    rollV: u,
    pitch: j(e.pitch + d * a, -0.039, We * 1.3),
    pitchV: d,
    lastRot: t,
    lastSpeed: n,
  };
}
function j(e, t, n) {
  return e < t ? t : e > n ? n : e;
}
var Je = () => ({
    x: 0,
    vx: 0,
    z: 0,
    vz: 0,
    y: 0,
    vy: 0,
    yaw: 0,
    roll: 0,
    pitch: 0,
    lastRot: 0,
    lastSpeed: 0,
    t: 0,
  }),
  M = {
    STIFF: 55,
    DAMP: 11,
    LAT_PER_G: 0.045,
    LONG_PER_G: 0.045,
    MAX_LAT: 0.07,
    MAX_LONG: 0.06,
    MAX_BACK: 0.012,
    LOOK_INTO_TURN: 0.16,
    LOOK_RATE: 4.5,
    TILT_PER_M: 0.9,
    NOD_PER_M: 0.55,
    BUZZ: 0.0028,
    BUMP: 0.012,
  },
  Ye = 9.81,
  Xe = 1 / 240;
function Ze(e, t) {
  let n = Math.min(t.dt, 0.05);
  if (n <= 0) return e;
  let r = t.speedKmh / 3.6,
    i = N(
      (t.speedKmh - e.lastSpeed) / 3.6 / n / Ye + (t.braking ? -0.35 : 0),
      -1.6,
      1.4,
    ),
    a = N(
      -N(
        (r * ((t.rot - e.lastRot) / n)) / Ye +
          t.rot * Math.min(1, t.speedKmh / 140) * 1.2,
        -1.5,
        1.5,
      ) * M.LAT_PER_G,
      -M.MAX_LAT,
      M.MAX_LAT,
    ),
    o = N(i * M.LONG_PER_G, -M.MAX_LONG, M.MAX_BACK),
    s = Math.ceil(n / Xe),
    c = n / s,
    { x: l, vx: u, z: d, vz: f, y: p, vy: m, t: h } = e,
    g = Math.min(1, t.speedKmh / 320);
  for (let e = 0; e < s; e++) {
    ((u += (M.STIFF * (a - l) - M.DAMP * u) * c),
      (f += (M.STIFF * (o - d) - M.DAMP * f) * c),
      (l += u * c),
      (d = Math.min(M.MAX_BACK, d + f * c)),
      d >= M.MAX_BACK && f > 0 && (f = 0),
      (h += c));
    let e =
        M.BUZZ *
        g *
        (Math.sin(h * 37.1) * 0.6 + Math.sin(h * 23.3 + 1.3) * 0.4),
      n = M.BUMP * t.shake * Math.sin(h * 61.7);
    ((m += (420 * (e + n - p) - 30 * m) * c), (p += m * c));
  }
  let _ =
      -N(t.steer, -1, 1) *
      M.LOOK_INTO_TURN *
      (0.35 + 0.65 * Math.min(1, t.speedKmh / 60)),
    v = e.yaw + (_ - e.yaw) * (1 - Math.exp(-M.LOOK_RATE * n)),
    y = -l * M.TILT_PER_M,
    b = d * M.NOD_PER_M;
  return {
    x: l,
    vx: u,
    z: d,
    vz: f,
    y: p,
    vy: m,
    yaw: v,
    roll: y,
    pitch: b,
    lastRot: t.rot,
    lastSpeed: t.speedKmh,
    t: h,
  };
}
function N(e, t, n) {
  return e < t ? t : e > n ? n : e;
}
var Qe = `/__l5e/assets-v1/960cf388-ccbe-42b0-b8ea-fda515c686fd/highway-sky-BGIxHKeS.jpg`,
  $e = `/__l5e/assets-v1/8ed82cd4-91ec-4d17-8398-9499e193f7f7/highway-asphalt-CTjUyYqg.jpg`;
async function et(e) {
  let t = new ue(),
    [n, r] = await Promise.all([t.loadAsync(Qe), t.loadAsync($e)]);
  ((n.colorSpace = r.colorSpace = O), (n.mapping = 303));
  let a = new ee(e),
    o = a.fromEquirectangular(n),
    s = (e) => {
      let t = document.createElement(`canvas`);
      ((t.width = 512), (t.height = 256));
      let n = t.getContext(`2d`);
      if (!n) throw Error(`Reflection canvas unavailable`);
      let r = n.createLinearGradient(0, 0, 0, 256);
      if (
        (r.addColorStop(0, e ? `#292724` : `#101c30`),
        r.addColorStop(0.5, e ? `#4a4236` : `#344255`),
        r.addColorStop(0.65, `#17191c`),
        r.addColorStop(1, `#080a0d`),
        (n.fillStyle = r),
        n.fillRect(0, 0, 512, 256),
        e)
      ) {
        n.fillStyle = `#e6c69d`;
        for (let e = 20; e < 512; e += 64) n.fillRect(e, 55, 28, 6);
      }
      let o = new i(t);
      ((o.colorSpace = O), (o.mapping = 303));
      let s = a.fromEquirectangular(o);
      return (o.dispose(), s);
    },
    c = s(!1),
    l = s(!0);
  return (a.dispose(), { sky: n, asphalt: r, day: o, night: c, tunnel: l });
}
function tt() {
  let e = document.createElement(`canvas`);
  ((e.width = 128), (e.height = 256));
  let t = e.getContext(`2d`);
  if (!t) throw Error(`Contact canvas unavailable`);
  let n = t.createImageData(128, 256);
  for (let e = 0; e < 256; e++)
    for (let t = 0; t < 128; t++) {
      let r = (t - 64) / 64,
        i = (e - 128) / 128,
        a = Math.exp(-3.4 * ((r / 0.82) ** 4 + (i / 0.82) ** 4)),
        o = 0;
      for (let e of [-0.77, 0.77])
        for (let t of [-0.62, 0.62])
          o += Math.exp(-((r - e) ** 2 / 0.022 + (i - t) ** 2 / 0.015));
      n.data[(e * 128 + t) * 4 + 3] = Math.min(230, a * 170 + o * 150);
    }
  t.putImageData(n, 0, 0);
  let r = new i(e);
  return ((r.colorSpace = O), r);
}
var P = (e) => e.flatMap((e) => [e, { ...e, x: -e.x }]),
  nt = {
    bugatti: {
      front: P(
        [0.42, 0.52, 0.62, 0.72].map((e, t) => ({
          x: e,
          y: 0.5 + t * 0.012,
          w: 0.07,
          h: 0.06,
        })),
      ),
      rear: [
        { x: 0, y: 0.66, w: 1.7, h: 0.035 },
        ...P([{ x: 0.85, y: 0.6, w: 0.035, h: 0.16 }]),
      ],
    },
    ferrari: {
      front: P([{ x: 0.66, y: 0.52, w: 0.42, h: 0.035, tilt: 0.18 }]),
      rear: P([
        { x: 0.55, y: 0.6, w: 0.17, h: 0.06 },
        { x: 0.76, y: 0.6, w: 0.17, h: 0.06 },
      ]),
    },
    porsche: {
      front: P([{ x: 0.66, y: 0.58, w: 0.2, h: 0.2, round: !0 }]),
      rear: [{ x: 0, y: 0.7, w: 1.6, h: 0.035 }],
    },
    mustang: {
      front: P([
        { x: 0.68, y: 0.6, w: 0.3, h: 0.05, tilt: 0.12 },
        ...[0.6, 0.68, 0.76].map((e) => ({
          x: e,
          y: 0.52,
          w: 0.03,
          h: 0.07,
          tilt: 0.4,
        })),
      ]),
      rear: P([0.5, 0.6, 0.7].map((e) => ({ x: e, y: 0.6, w: 0.05, h: 0.14 }))),
    },
    bmw: {
      front: P([
        { x: 0.66, y: 0.58, w: 0.28, h: 0.035 },
        { x: 0.66, y: 0.53, w: 0.24, h: 0.03 },
      ]),
      rear: P([
        { x: 0.7, y: 0.66, w: 0.32, h: 0.04 },
        { x: 0.84, y: 0.61, w: 0.04, h: 0.12 },
      ]),
    },
  },
  rt = {
    front: P([{ x: 0.7, y: 0.5, w: 0.3, h: 0.12 }]),
    rear: P([{ x: 0.75, y: 0.55, w: 0.22, h: 0.12 }]),
  },
  it = (e) => nt[e] ?? rt;
function at(e) {
  return { front: e ? 1 : 0.18, rear: +!!e, glow: +!!e };
}
function ot(e, t, n = 0) {
  if (t < 0.08) return 0;
  let r = t > 0.55 ? 2.4 : 1.4;
  return ((Math.sin((e + n) * r * Math.PI) + 1) / 2) * 1.75;
}
var F = null;
function st() {
  if (F) return F;
  let e = document.createElement(`canvas`);
  e.width = e.height = 64;
  let t = e.getContext(`2d`),
    n = t.createRadialGradient(32, 32, 0, 32, 32, 32);
  return (
    n.addColorStop(0, `rgba(255,255,255,1)`),
    n.addColorStop(0.35, `rgba(255,255,255,0.45)`),
    n.addColorStop(1, `rgba(255,255,255,0)`),
    (t.fillStyle = n),
    t.fillRect(0, 0, 64, 64),
    (F = new i(e)),
    F
  );
}
function ct(e, t) {
  e.updateMatrixWorld(!0);
  let n = [];
  return (
    e.traverse((e) => {
      let r = e;
      if (!r.isMesh || e.parent?.name === `active-wing`) return;
      let i = Array.isArray(r.material) ? r.material : [r.material];
      if (!t(`${r.name} ${i.map((e) => e.name).join(` `)}`.toLowerCase()))
        return;
      let a = r.geometry.getAttribute(`position`),
        o = r.geometry.getIndex(),
        s = o ? o.count : a.count,
        c = (e) =>
          new k()
            .fromBufferAttribute(a, o ? o.getX(e) : e)
            .applyMatrix4(r.matrixWorld);
      for (let e = 0; e + 2 < s; e += 3) {
        let t = c(e),
          r = c(e + 1),
          i = c(e + 2),
          a = new k().subVectors(r, t).cross(new k().subVectors(i, t)),
          o = a.length() / 2;
        o < 1e-7 ||
          n.push({
            a: t,
            b: r,
            c: i,
            n: a.normalize(),
            area: o,
            center: t.clone().add(r).add(i).divideScalar(3),
          });
      }
    }),
    n
  );
}
var lt = (e) =>
    /window|windshield|windscreen|glass/.test(e) &&
    !/light|red|lamp|mirror/.test(e),
  ut = (e) =>
    /light|lamp|red_glass|redglass/.test(e) && !/amber|beacon|window/.test(e);
function dt(e, t) {
  let n = t.getSize(new k()),
    r = n.x / 2,
    i = (t.min.z + t.max.z) / 2,
    a = ct(e, lt).filter((e) => {
      let t = e.n.z > 0 ? e.n.clone().negate() : e.n;
      return (
        e.center.z < i &&
        t.z < -0.3 &&
        Math.abs(e.center.x) < r * 0.55 &&
        e.center.y > n.y * 0.35
      );
    });
  if (a.length) {
    let e = new k(),
      t = 1 / 0,
      n = 0,
      i = 0;
    for (let o of a) {
      let a = o.n.z > 0 ? o.n.clone().negate() : o.n;
      e.addScaledVector(a, o.area);
      for (let e of [o.a, o.b, o.c])
        ((i = Math.max(i, Math.abs(e.x))),
          Math.abs(e.x) < r * 0.4 && e.y < t && ((t = e.y), (n = e.z)));
    }
    if (!Number.isFinite(t))
      for (let e of a)
        for (let r of [e.a, e.b, e.c]) r.y < t && ((t = r.y), (n = r.z));
    (e.normalize(), console.log(`WSDBG`, t, n, e.toArray(), a.length));
    let o = Math.atan2(Math.max(e.y, 0), -e.z),
      s = new k(0, Math.cos(o), Math.sin(o)),
      c = new k(0, t, n).addScaledVector(s, 0.035).addScaledVector(e, 0.018);
    return {
      baseZ: c.z,
      baseY: c.y,
      halfW: Math.min(i, r),
      tilt: o,
      found: !0,
    };
  }
  let o = new re(),
    s = new k(0, -1, 0),
    c = n.x * 0.12,
    l = (n) => {
      o.set(new k(c, t.max.y + 1, n), s);
      let r = o.intersectObject(e, !0)[0];
      return r ? r.point.y : null;
    };
  for (let e = t.min.z + n.z * 0.12; e < i + n.z * 0.1; e += 0.04) {
    let t = l(e),
      i = l(e + 0.12);
    if (t === null || i === null) continue;
    let a = (i - t) / 0.12;
    if (
      (console.log(`WSP`, e.toFixed(2), t.toFixed(3), a.toFixed(2)),
      a > 0.7 && t > n.y * 0.45)
    ) {
      let n = Math.atan2(1, a),
        i = new k(0, Math.sin(n), -Math.cos(n)),
        o = new k(0, Math.cos(n), Math.sin(n)),
        s = new k(0, t, e).addScaledVector(o, 0.06).addScaledVector(i, 0.018);
      return { baseZ: s.z, baseY: s.y, halfW: r * 0.62, tilt: n, found: !0 };
    }
  }
  return {
    baseZ: t.min.z + n.z * 0.3,
    baseY: n.y * 0.66,
    halfW: r,
    tilt: 1.05,
    found: !1,
  };
}
function ft(t, i, a) {
  let o = i.max.z - i.min.z,
    s = Math.min(o * 0.25, 1.4),
    c = ct(t, ut).filter((e) =>
      a ? e.center.z > i.max.z - s : e.center.z < i.min.z + s,
    );
  if (c.length < 4) return null;
  let l = new Float32Array(c.length * 9);
  c.forEach((e, t) => {
    let n = e.n.clone().multiplyScalar(0.004);
    [e.a, e.b, e.c].forEach((e, r) =>
      e
        .clone()
        .add(n)
        .toArray(l, t * 9 + r * 3),
    );
  });
  let u = new r();
  return (
    u.setAttribute(`position`, new n(l, 3)),
    {
      geo: u,
      sides: [-1, 1]
        .map((t) => {
          let n = new k(),
            r = new e(),
            i = 0;
          for (let e of c)
            Math.sign(e.center.x || 1) === t &&
              (n.addScaledVector(e.center, e.area),
              (i += e.area),
              r.expandByPoint(e.a).expandByPoint(e.b).expandByPoint(e.c));
          return i ? { c: n.divideScalar(i), size: r.getSize(new k()) } : null;
        })
        .filter((e) => !!e),
    }
  );
}
function pt(e, t, n, r, i, a, s = 1) {
  let c = new re(),
    l = new k(0, 0, a ? -1 : 1),
    u = e.map((e) => {
      let u = e.round ? new o((e.w / 2) * s, 20) : new E(e.w * s, e.h * s);
      e.tilt && u.rotateZ(e.tilt * Math.sign(e.x || 1));
      let d = e.x * r,
        f = e.y * i;
      c.set(new k(d, f, a ? n.max.z + 1 : n.min.z - 1), l);
      let p = c.intersectObject(t, !0)[0],
        m = p
          ? p.point.z + (a ? 0.01 : -0.01)
          : a
            ? n.max.z - 0.05
            : n.min.z + 0.05;
      return (u.translate(d, f, m), u);
    });
  return he(u) ?? u[0];
}
function mt(n, r, i, a) {
  let o = new e().setFromObject(r),
    s = (o.max.x - o.min.x) / 2,
    c = a ? Math.min(o.max.y, 1.35) : o.max.y,
    l = it(n),
    u = (e, t, n = i) => {
      let r = new v(e, t, n);
      return (
        r.instanceMatrix.setUsage(f),
        (r.frustumCulled = !1),
        (r.count = 0),
        (r.renderOrder = 2),
        r
      );
    };
  r.updateMatrixWorld(!0);
  let d = ft(r, o, !1),
    p = ft(r, o, !0),
    m = (e) =>
      new C({
        color: e,
        toneMapped: !1,
        transparent: !0,
        side: 2,
        polygonOffset: !0,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      }),
    h = u(d?.geo ?? pt(l.front, r, o, s, c, !1), m(15922943)),
    g = u(p?.geo ?? pt(l.rear, r, o, s, c, !0), m(16716294)),
    _ = (e) =>
      new C({
        color: e,
        map: st(),
        transparent: !0,
        depthWrite: !1,
        blending: 2,
        toneMapped: !1,
        side: 2,
      }),
    y = (e, t, n) => {
      if (e?.sides.length) {
        let t = e.sides.map(({ c: e, size: t }) => {
          let r = Math.min(Math.max(t.x, 0.15) * 2.2 + 0.3, 1.4),
            i = Math.min(Math.max(t.y, 0.1) * 2.6 + 0.3, 0.9);
          return new E(r, i).translate(e.x, e.y, e.z + (n ? 0.06 : -0.06));
        });
        return he(t) ?? t[0];
      }
      return pt(
        t.map((e) => ({
          ...e,
          w: Math.max(e.w, 0.12) * 2.6 + 0.3,
          h: Math.max(e.h, 0.12) * 2.6 + 0.3,
          round: !1,
          tilt: 0,
        })),
        r,
        o,
        s,
        c,
        n,
      );
    },
    b = u(y(d, l.front, !1), _(14674175)),
    x = u(y(p, l.rear, !0), _(16719888)),
    S = dt(r, o);
  console.log(
    `WS`,
    n,
    JSON.stringify(S),
    JSON.stringify(o.min.toArray()),
    JSON.stringify(o.max.toArray()),
  );
  let T = Math.min(0.62, S.halfW * 0.6) * (a ? 1.4 : 1),
    ee = u(
      new t(T, 0.018, 0.025).translate(T / 2, 0.012, 0),
      new w({ color: 723724, roughness: 0.5, metalness: 0.3 }),
      i * 2,
    ),
    te = [
      new k(-S.halfW * 0.62, S.baseY, S.baseZ),
      new k(S.halfW * 0.02, S.baseY, S.baseZ),
    ],
    ne = [h, g, b, x, ee];
  return {
    front: h,
    rear: g,
    frontGlow: b,
    rearGlow: x,
    wipers: ee,
    wiper: {
      pivots: te,
      tilt: S.found ? S.tilt : a ? 0.15 : S.tilt,
      length: T,
    },
    all: ne,
  };
}
var ht = new x(),
  gt = new D(),
  _t = new D(),
  vt = new p(),
  yt = new k(1, 1, 1),
  bt = new x();
function xt(e, t, n, r, i = bt) {
  return (
    vt.set(n, 0, 0),
    gt.setFromEuler(vt),
    _t.setFromAxisAngle(new k(0, 0, 1), r * 0.95),
    gt.multiply(_t),
    ht.compose(t, gt, yt),
    i.multiplyMatrices(e, ht)
  );
}
var St = {
  "mustang-rtr": { lamp: /LightB_Material1$/, tail: /^red_glass$/ },
  m2: { lamp: /LightD_Material1$/, tail: /^red_glass$/ },
  laferrari: { lamp: /^uv1MAT_Light1$|^glass_lishgt$/, tail: /^red_glass$/ },
  "huracan-evo": {
    lamp: /LightA_Material1$|^glass_light$|^emiss$/,
    tail: /^red_glass$/,
  },
  tourbillon: { lamp: /LightA_Material1$/, tail: /^red_glass$/ },
  "utopia-roadster": { lamp: /LightA_Material1$/, tail: /^utopiared_glass$/ },
  huayra: {
    lamp: /^pag_lights$|^pag_runninglight$/,
    tail: /^pag_taillight_L$/,
    brake: /^pag_brakelight$/,
  },
  demon: { lamp: /^lightglass$/, tail: /^redglass$/ },
  "chiron-ss300": {
    lamp: /^CSR2_Light$|^headlight$|^Park_light$/,
    tail: /^GlassRed$|^brake_park_light$/,
    brake: /^brake_light$/,
  },
  "m8-competition": {
    lamp: /^m8f92_lowbeam$|^m8f92_runninglight3$/,
    tail: /^m8f92_taillight$|^m8f92_glass_red$/,
  },
  "m4-competition": { lamp: /^m4car_emissive1$/, tail: /$^/ },
  jesko: { lamp: /^Lights$|^light_ref$/, tail: /^GlassRedMtl$/ },
  "voiture-noire": { lamp: /2019LightA_Material$/, tail: /^RED_GLASS$/ },
  revuelto: { lamp: /2024LightA_Material$/, tail: /^RED_GLASS$/ },
  svj: {
    lamp: /^svj_glow_pos$/,
    tail: /^svj_glow_back$/,
    brake: /^svj_glow_brake$/,
  },
};
function Ct(e, t) {
  let n = St[e];
  return n
    ? n.brake?.test(t)
      ? `brake`
      : n.tail.test(t)
        ? `tail`
        : n.lamp.test(t)
          ? `lamp`
          : null
    : null;
}
var wt = new Set([`svj`, `mustang-rtr`, `m2`, `revuelto`]);
function Tt(e, t, n = !1) {
  return {
    head: e ? 3.2 : n ? 0 : 0.5,
    tail: t ? 3 : e ? 1.6 : n ? 0 : 0.15,
    brake: t ? 4 : 0,
  };
}
var Et = [`chase`, `hood`, `cockpit`, `left`, `right`, `reverse`],
  Dt = {
    hood: {
      pos: { dx: 0, y: 1.06, z: -1.95 },
      look: { dx: 0, y: 0.85, z: -32 },
    },
    left: {
      pos: { dx: -4.6, y: 1.35, z: 2.4 },
      look: { dx: 0.9, y: 0.75, z: -7 },
    },
    right: {
      pos: { dx: 4.6, y: 1.35, z: 2.4 },
      look: { dx: -0.9, y: 0.75, z: -7 },
    },
    reverse: {
      pos: { dx: 0, y: 1.75, z: -8.2 },
      look: { dx: 0, y: 0.9, z: 26 },
    },
  };
function Ot(e, t = !0) {
  let n = t ? Et : Et.filter((e) => e !== `cockpit`);
  return n[(n.indexOf(e) + 1) % n.length] ?? `chase`;
}
var kt = {
    version: 1,
    asset_id: `b8a269cc-6e6e-4ff1-9b0e-d4985d2c2ee0`,
    project_id: `3faf2f0c-3a05-4196-b312-8cecb1673b3a`,
    url: `/__l5e/assets-v1/d9b9c771-f09b-4cee-a114-4a3698ab672c/revuelto-infotainment.webp`,
    r2_key: `a/v1/3faf2f0c-3a05-4196-b312-8cecb1673b3a/b8a269cc-6e6e-4ff1-9b0e-d4985d2c2ee0/revuelto-infotainment.webp`,
    original_filename: `revuelto-infotainment.webp`,
    size: 75732,
    content_type: `image/webp`,
    created_at: `2026-11-18T18:49:33Z`,
  },
  At = [740 / 768, 276 / 768, 763 / 768, 293 / 768];
function I(e) {
  let t = Math.max(0, Math.min(1e4, e)) / 1e3;
  return (
    ((t <= 7 ? 90 + (t / 7) * 180 : 270 + ((t - 7) / 3) * 90) * Math.PI) / 180
  );
}
function jt(e, t) {
  let n = new k(),
    r = new k(),
    i = new k(),
    a = new k(),
    o = new k(),
    s = new k(),
    c = e.length / 9;
  for (let c = 0; c < e.length; c += 9)
    (n.fromArray(e, c),
      r.fromArray(e, c + 3),
      i.fromArray(e, c + 6),
      s.subVectors(i, r).cross(r.clone().sub(n)),
      s.dot(t.clone().sub(n)) < 0 && s.negate(),
      a.add(s),
      o.add(n).add(r).add(i));
  (a.normalize(), o.multiplyScalar(1 / (c * 3)));
  let l = new k(0, 1, 0).projectOnPlane(a);
  (l.lengthSq() < 1e-6 && l.set(0, 0, -1).projectOnPlane(a), l.normalize());
  let u = new k().crossVectors(l, a).normalize(),
    d = 1 / 0,
    f = -1 / 0,
    p = 1 / 0,
    m = -1 / 0,
    h = new k();
  for (let t = 0; t < e.length; t += 3) {
    h.fromArray(e, t);
    let n = h.dot(u),
      r = h.dot(l);
    ((d = Math.min(d, n)),
      (f = Math.max(f, n)),
      (p = Math.min(p, r)),
      (m = Math.max(m, r)));
  }
  let g = [],
    _ = [],
    v = a.clone().multiplyScalar(0.0012);
  for (let t = 0; t < e.length; t += 3)
    (h.fromArray(e, t),
      _.push((h.dot(u) - d) / (f - d || 1), (h.dot(l) - p) / (m - p || 1)),
      h.add(v),
      g.push(h.x, h.y, h.z));
  return { positions: g, uvs: _, aspect: (f - d) / (m - p || 1), triangles: c };
}
function Mt(e, t) {
  e.updateMatrixWorld(!0);
  let n = e.matrixWorld.clone().invert(),
    r = [],
    i = [],
    [a, o, s, c] = At,
    l = new k(),
    u = new x();
  return (
    e.traverse((e) => {
      let t = e;
      if (
        !t.isMesh ||
        Array.isArray(t.material) ||
        !/InteriorA_Material/.test(t.material.name)
      )
        return;
      let d = t.geometry,
        f = d.attributes.position,
        p = d.attributes.uv;
      if (!f || !p) return;
      u.multiplyMatrices(n, t.matrixWorld);
      let m = d.index,
        h = m ? m.count : f.count;
      for (let e = 0; e < h; e += 3) {
        let t = !0,
          n = [],
          d = 0,
          h = 0,
          g = 0;
        for (let r = 0; r < 3 && t; r++) {
          let i = m ? m.getX(e + r) : e + r,
            _ = p.getX(i),
            v = p.getY(i);
          ((_ < a || _ > s || v < o || v > c) && (t = !1),
            l.fromBufferAttribute(f, i).applyMatrix4(u),
            n.push(l.x, l.y, l.z),
            (d += l.x),
            (h += l.y),
            (g += l.z));
        }
        t &&
          ((d /= 3),
          (h /= 3),
          (g /= 3),
          d < -0.15 && d > -0.65 && h > 0.7 && h < 0.95 && g > -0.8 && g < -0.5
            ? r.push(...n)
            : Math.abs(d) < 0.14 &&
              h > 0.35 &&
              h < 0.82 &&
              g > -0.75 &&
              g < -0.3 &&
              i.push(...n));
      }
    }),
    { cluster: r.length ? jt(r, t) : null, center: i.length ? jt(i, t) : null }
  );
}
var Nt = new k(...(ye.revuelto?.eye ?? [-0.4, 0.98, 0.1])),
  L = 1140,
  Pt = 430,
  R = 560,
  z = 215,
  B = `#ff2b1c`,
  Ft = `#3ee6ff`,
  V = `#f4f6f8`,
  H = `#8d939b`,
  U = `Barlow, 'Barlow Condensed', Arial, sans-serif`;
function It(e, t) {
  let n = new r();
  (n.setAttribute(`position`, new m(e.positions, 3)),
    n.setAttribute(`uv`, new m(e.uvs, 2)),
    n.computeVertexNormals());
  let i = new S(n, t);
  return ((i.userData.cabinOnly = !0), (i.renderOrder = 2), i);
}
function Lt(e) {
  return new C({
    map: e,
    toneMapped: !1,
    polygonOffset: !0,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}
function Rt(e, t, n, r) {
  let i = new S(new E(e, t), r);
  return (i.position.set(...n), i.lookAt(Nt), (i.userData.cabinOnly = !0), i);
}
var zt = class {
  group = new g();
  canvas;
  ctx;
  bg;
  tex;
  clusterMesh;
  gear = 0;
  acc = 1;
  rpm = Ae;
  shown = Ae;
  t = 0;
  trip = 0;
  waterT = 62;
  oilT = 70;
  power = 0;
  interval;
  constructor(e, t = !1) {
    ((this.group.name = `revuelto-dash`), (this.interval = 1 / (t ? 15 : 24)));
    let n = t ? 1 : 1.4;
    ((this.canvas = document.createElement(`canvas`)),
      (this.canvas.width = Math.round(L * n)),
      (this.canvas.height = Math.round(Pt * n)),
      (this.ctx = this.canvas.getContext(`2d`)),
      (this.bg = document.createElement(`canvas`)),
      (this.bg.width = this.canvas.width),
      (this.bg.height = this.canvas.height),
      this.drawBackground(this.bg.getContext(`2d`), n),
      (this.tex = new i(this.canvas)),
      (this.tex.colorSpace = O),
      (this.tex.anisotropy = 8));
    let r = Mt(e, Nt),
      a = Lt(this.tex);
    ((this.clusterMesh = r.cluster
      ? It(r.cluster, a)
      : Rt(0.28, 0.105, [-0.36, 0.81, -0.63], a)),
      this.group.add(this.clusterMesh));
    let o = new ue().load(kt.url, (e) => {
      let t = e.image,
        n = r.center?.aspect ?? 0.625,
        i = t.width / t.height;
      (i > n
        ? (e.repeat.set(n / i, 1), e.offset.set((1 - n / i) / 2, 0))
        : (e.repeat.set(1, i / n), e.offset.set(0, (1 - i / n) / 2)),
        (e.needsUpdate = !0));
    });
    ((o.colorSpace = O), (o.anisotropy = 8));
    let s = Lt(o);
    this.group.add(
      r.center ? It(r.center, s) : Rt(0.12, 0.19, [0, 0.66, -0.55], s),
    );
  }
  update(e, t, n) {
    ((this.t += n), (this.acc += n));
    let r = Math.abs(e);
    ((this.trip += (r / 3600) * n), (this.gear = Te(this.gear, r, t)));
    let i =
      Math.max(Ae, Math.min(Ee, xe(this.gear, r))) + (t && r < 5 ? 2500 : 0);
    ((this.rpm += (i - this.rpm) * Math.min(1, n * 10)),
      (this.power +=
        ((t ? 0.35 + 0.65 * (this.rpm / Ee) : 0.05) - this.power) *
        Math.min(1, n * 3)),
      (this.waterT += (88 - this.waterT) * Math.min(1, n * 0.02)),
      (this.oilT += (104 - this.oilT) * Math.min(1, n * 0.015)),
      !(this.acc < this.interval || !this.clusterMesh.visible) &&
        ((this.acc = 0),
        (this.shown += (this.rpm - this.shown) * 0.6),
        this.drawCluster(r, t)));
  }
  dispose() {
    (this.tex.dispose(),
      this.group.traverse((e) => {
        let t = e;
        if (!t.isMesh) return;
        t.geometry.dispose();
        let n = t.material;
        (n.map && n.map !== this.tex && n.map.dispose(), n.dispose());
      }));
  }
  drawBackground(e, t) {
    (e.setTransform(t, 0, 0, t, 0, 0),
      (e.fillStyle = `#050607`),
      e.fillRect(0, 0, L, Pt));
    let n = (t, n, r) => {
      e.beginPath();
      for (let i = 0; i < 6; i++) {
        let a = Math.PI / 6 + (i * Math.PI) / 3;
        e.lineTo(t + r * Math.cos(a), n + r * Math.sin(a));
      }
      (e.closePath(), e.fill());
    };
    for (let t = 0, r = 4; r < 440; t++, r += 13)
      for (let i = t % 2 ? 8 : 0; i < 1150; i += 16) {
        let t = Math.hypot((i - 190) / 260, (r - 215) / 230),
          a = Math.hypot((i - 925) / 260, (r - 215) / 230),
          o = Math.max(0, 1 - Math.min(t, a)),
          s = Math.min(1, Math.min(i, L - i) / 60, Math.min(r, Pt - r) / 40);
        ((e.fillStyle = `rgba(150,156,164,${((0.07 + 0.32 * o) * s).toFixed(3)})`),
          n(i, r, 5.6));
      }
    let r = e.createRadialGradient(R, z, 150, R, z, 240);
    (r.addColorStop(0, `rgba(4,5,6,1)`),
      r.addColorStop(1, `rgba(4,5,6,0)`),
      (e.fillStyle = r),
      e.fillRect(300, 0, 520, Pt),
      e.save(),
      (e.lineCap = `round`),
      (e.shadowColor = `#7fd2ff`),
      (e.shadowBlur = 14));
    for (let [t, n] of [
      [7, `rgba(120,200,255,0.55)`],
      [2.4, `#e8f6ff`],
    ])
      ((e.strokeStyle = n),
        (e.lineWidth = t),
        e.beginPath(),
        e.moveTo(312, 36),
        e.lineTo(394, 146),
        e.stroke(),
        e.beginPath(),
        e.moveTo(392, 302),
        e.lineTo(302, 384),
        e.stroke(),
        e.beginPath(),
        e.moveTo(812, 36),
        e.lineTo(730, 146),
        e.stroke(),
        e.beginPath(),
        e.moveTo(732, 302),
        e.lineTo(828, 384),
        e.stroke());
    (e.restore(), (e.lineCap = `butt`));
    let i = e.createRadialGradient(R, 185, 20, R, z, 170);
    (i.addColorStop(0, `#15181c`),
      i.addColorStop(1, `#08090b`),
      (e.fillStyle = i),
      e.beginPath(),
      e.arc(R, z, 168, 0, Math.PI * 2),
      e.fill());
    for (let t = 0; t <= 1e4; t += 200) {
      let n = I(t),
        r = t % 1e3 == 0,
        i = t >= 9e3,
        a = r ? 146 : 156;
      ((e.strokeStyle = i ? B : r ? V : `rgba(220,224,230,0.75)`),
        (e.lineWidth = r ? 3.2 : i ? 3 : 1.4),
        e.beginPath(),
        e.moveTo(R + Math.cos(n) * a, z + Math.sin(n) * a),
        e.lineTo(R + Math.cos(n) * 166, z + Math.sin(n) * 166),
        e.stroke());
    }
    ((e.strokeStyle = B), (e.lineWidth = 2.2));
    for (let t = 9e3; t <= 1e4; t += 100) {
      let n = I(t);
      (e.beginPath(),
        e.moveTo(R + Math.cos(n) * 128, z + Math.sin(n) * 128),
        e.lineTo(R + Math.cos(n) * 146, z + Math.sin(n) * 146),
        e.stroke());
    }
    ((e.textAlign = `center`), (e.textBaseline = `middle`));
    for (let t = 0; t <= 10; t++) {
      let n = I(t * 1e3);
      ((e.fillStyle = t >= 10 ? B : V),
        (e.font = `italic 800 ${t >= 10 ? 30 : 33}px ${U}`),
        e.fillText(String(t), R + Math.cos(n) * 124, z + Math.sin(n) * 124));
    }
    ((e.strokeStyle = `rgba(160,166,174,0.55)`),
      (e.lineWidth = 2),
      e.beginPath(),
      e.arc(R, z, 104, Math.PI * 0.62, Math.PI * 2.38),
      e.stroke(),
      (e.fillStyle = V),
      (e.font = `700 9px ${U}`),
      e.fillText(`RPM x1000`, 600, 362),
      (e.fillStyle = H),
      (e.font = `700 8px ${U}`),
      e.fillText(`% BATTERIA x10`, 602, 337),
      this.sideFrame(e, 190, 212),
      (e.font = `700 15px ${U}`));
    let a = (t, n, r, i = V) => {
      ((e.fillStyle = i), e.fillText(t, n, r));
    };
    (a(`130`, 156, 122, B),
      a(`50`, 224, 120),
      a(`50`, 100, 232),
      a(`170`, 300, 236, B),
      a(`10`, 130, 293, B),
      a(`0`, 258, 293),
      a(`bar`, 190, 272, H),
      a(`°C`, 152, 166, H),
      a(`°C`, 236, 166, H),
      (e.strokeStyle = `rgba(220,224,230,0.4)`),
      (e.lineWidth = 1.5),
      e.strokeRect(32, 128, 10, 184),
      a(`100`, 52, 118),
      a(`0`, 30, 322, B),
      this.sideFrame(e, 925, 215),
      (e.fillStyle = `#0b0d10`),
      e.beginPath(),
      e.arc(925, 215, 58, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = `rgba(210,214,220,0.55)`),
      (e.lineWidth = 2),
      e.stroke());
    for (let [e, t] of [
      [`0%`, 130],
      [`20`, 175],
      [`40`, 230],
      [`60`, 290],
      [`80`, 345],
      [`100`, 45],
    ]) {
      let n = (t * Math.PI) / 180;
      a(e, 925 + Math.cos(n) * 100, 215 + Math.sin(n) * 100);
    }
    ((e.strokeStyle = V),
      (e.lineWidth = 2),
      e.strokeRect(916, 186, 14, 18),
      e.beginPath(),
      e.moveTo(930, 192),
      e.lineTo(936, 196),
      e.lineTo(936, 204),
      e.stroke(),
      (e.strokeStyle = `rgba(220,224,230,0.4)`),
      (e.lineWidth = 1.5),
      e.strokeRect(1096, 128, 10, 184),
      a(`100`, 1086, 118),
      a(`0`, 1112, 322, B));
    for (let [t, n] of [
      [372, `STRADA`],
      [768, `SPORT`],
    ]) {
      ((e.strokeStyle = `rgba(220,224,230,0.6)`),
        (e.lineWidth = 2),
        e.beginPath(),
        e.arc(t, 432, 56, Math.PI * 1.08, Math.PI * 1.92),
        e.stroke());
      for (let n = 0; n <= 12; n++) {
        let r = Math.PI * (1.1 + (n / 12) * 0.8);
        ((e.strokeStyle = n < 5 ? B : `rgba(230,232,236,0.8)`),
          (e.lineWidth = 2),
          e.beginPath(),
          e.moveTo(t + Math.cos(r) * 44, 432 + Math.sin(r) * 44),
          e.lineTo(t + Math.cos(r) * 52, 432 + Math.sin(r) * 52),
          e.stroke());
      }
      ((e.fillStyle = V), (e.font = `800 9px ${U}`), e.fillText(n, t, 404));
    }
    ((e.textAlign = `left`),
      (e.font = `600 15px ${U}`),
      (e.fillStyle = V),
      e.fillText(`♫  We are Lamborghini`, 104, 358),
      (e.textAlign = `center`),
      e.fillText(`20.5°C`, 392, 38),
      e.setTransform(1, 0, 0, 1, 0, 0));
  }
  sideFrame(e, t, n) {
    ((e.strokeStyle = `rgba(210,214,220,0.35)`), (e.lineWidth = 1.2));
    for (let r = 0; r < 72; r++) {
      let i = (r / 72) * Math.PI * 2;
      (e.beginPath(),
        e.moveTo(t + Math.cos(i) * 80, n + Math.sin(i) * 80),
        e.lineTo(t + Math.cos(i) * 88, n + Math.sin(i) * 88),
        e.stroke());
    }
    ((e.strokeStyle = `rgba(210,214,220,0.5)`),
      (e.lineWidth = 1.5),
      e.beginPath(),
      e.arc(t, n, 90, 0, Math.PI * 2),
      e.stroke());
  }
  drawCluster(e, t) {
    let n = this.ctx,
      r = this.canvas.width / L;
    (n.setTransform(1, 0, 0, 1, 0, 0),
      n.drawImage(this.bg, 0, 0),
      n.setTransform(r, 0, 0, r, 0, 0));
    let i = Math.max(0, Math.min(1e4, this.shown)),
      a = I(0),
      o = I(i),
      s = I(1e4);
    ((n.lineCap = `butt`),
      (n.strokeStyle = `#2c3036`),
      (n.lineWidth = 15),
      n.beginPath(),
      n.arc(R, z, 177, o, s),
      n.stroke(),
      (n.strokeStyle = V),
      (n.lineWidth = 15),
      n.beginPath(),
      n.arc(R, z, 177, a, o),
      n.stroke(),
      n.save(),
      (n.shadowColor = Ft),
      (n.shadowBlur = 16),
      (n.strokeStyle = Ft),
      (n.lineWidth = 6),
      n.beginPath(),
      n.arc(R, z, 188, a, o),
      n.stroke(),
      n.restore(),
      n.save(),
      (n.shadowColor = B),
      (n.shadowBlur = 12),
      (n.strokeStyle = B),
      (n.lineWidth = 6),
      n.beginPath(),
      n.moveTo(R + Math.cos(o) * 140, z + Math.sin(o) * 140),
      n.lineTo(R + Math.cos(o) * 190, z + Math.sin(o) * 190),
      n.stroke(),
      n.restore(),
      (n.textAlign = `center`),
      (n.textBaseline = `alphabetic`));
    let c = e < 1 && !t,
      l = c ? `N` : String(this.gear + 1);
    ((n.lineJoin = `round`),
      (n.font = `italic 900 118px ${U}`),
      (n.strokeStyle = B),
      (n.lineWidth = 4.5),
      (n.fillStyle = `rgba(255,43,28,0.08)`),
      n.fillText(l, 562, 238),
      n.strokeText(l, 562, 238),
      (n.font = `italic 900 58px ${U}`),
      (n.lineWidth = 3.5),
      n.strokeText(`S`, 612, 240),
      c ||
        ((n.font = `italic 800 26px ${U}`),
        (n.fillStyle = V),
        this.gear > 0 && n.fillText(String(this.gear), 502, 200),
        this.gear < 7 && n.fillText(String(this.gear + 2), 618, 200)),
      (n.font = `800 9px ${U}`),
      (n.fillStyle = V),
      n.fillText(`SPORT`, R, 128),
      (n.fillStyle = H),
      (n.font = `700 7px ${U}`),
      n.fillText(`ANIMA`, R, 118),
      (n.fillStyle = V),
      (n.font = `800 62px ${U}`),
      n.fillText(String(Math.round(e)), R, 302),
      (n.font = `700 13px ${U}`),
      n.fillText(`km/h`, R, 320),
      (n.font = `800 24px ${U}`),
      (n.textAlign = `right`),
      n.fillText((i / 1e3).toFixed(1), 574, 371),
      (n.textAlign = `center`),
      (n.fillStyle = Ft),
      (n.font = `800 9px ${U}`),
      n.fillText(`% ${Math.round(this.power * 10)} · POTENZA x10`, 620, 408));
    let u = (e, t, r, i, a, o, s, c = 10) => {
      let l = (i * Math.PI) / 180,
        u = (a * Math.PI) / 180;
      ((n.strokeStyle = `rgba(60,64,70,0.9)`),
        (n.lineWidth = c),
        n.beginPath(),
        n.arc(e, t, r, l, u),
        n.stroke(),
        (n.strokeStyle = s),
        n.beginPath(),
        n.arc(e, t, r, l, l + (u - l) * Math.max(0, Math.min(1, o))),
        n.stroke());
    };
    (u(190, 212, 66, 200, 300, (this.waterT - 50) / 80, V),
      u(190, 212, 66, 320, 400, (this.oilT - 50) / 120, V),
      u(190, 212, 66, 160, 60, 0.15 + (i / 1e4) * 0.75, V),
      u(190, 212, 66, 285, 300, 1, B),
      u(190, 212, 66, 385, 400, 1, B),
      u(190, 212, 66, 160, 140, 1, B),
      (n.fillStyle = V),
      (n.font = `800 20px ${U}`),
      n.fillText(String(Math.round(this.waterT)), 190, 206),
      (n.font = `700 11px ${U}`),
      (n.fillStyle = H),
      n.fillText(`°C`, 190, 222));
    let d = this.power;
    (n.save(),
      (n.shadowColor = B),
      (n.shadowBlur = 8),
      u(925, 215, 76, 130, 410, d, d > 0.75 ? B : V, 9),
      n.restore());
    let f = ((130 + 280 * Math.min(1, d + 0.06)) * Math.PI) / 180;
    ((n.strokeStyle = B),
      (n.lineWidth = 5),
      n.beginPath(),
      n.moveTo(925 + Math.cos(f) * 66, 215 + Math.sin(f) * 66),
      n.lineTo(925 + Math.cos(f) * 88, 215 + Math.sin(f) * 88),
      n.stroke());
    let p = Math.max(0, 10 - (Math.floor(this.trip * 2) % 11));
    ((n.fillStyle = V),
      (n.font = `700 15px ${U}`),
      n.fillText(`${p} km`, 925, 240));
    let m = 0.55 + 0.25 * Math.sin(this.t * 0.15),
      h = Math.max(0.2, 0.86 - this.trip * 0.004);
    for (let [e, t] of [
      [32, m],
      [1096, h],
    ]) {
      let r = 180 * t;
      ((n.fillStyle = V),
        n.fillRect(e + 2, 310 - r, 6, r),
        (n.fillStyle = B),
        n.fillRect(e + 2, 296, 6, 14));
    }
    let g = new Date(),
      _ = g.getHours() % 12 || 12,
      v = g.getMinutes().toString().padStart(2, `0`);
    ((n.fillStyle = V),
      (n.font = `600 15px ${U}`),
      n.fillText(`${_}:${v} ${g.getHours() < 12 ? `AM` : `PM`}`, 740, 38),
      (n.textAlign = `right`),
      n.fillText(
        `${String(350 + Math.floor(this.trip)).padStart(6, `0`)} km  |  ${this.trip.toFixed(1)} km`,
        1040,
        358,
      ),
      n.setTransform(1, 0, 0, 1, 0, 0),
      (this.tex.needsUpdate = !0));
  }
};
function Bt(e, t, n, r) {
  let i = t > 120 ? 1 : t < 65 ? 0 : e.lift,
    a = e.lift + (i - e.lift) * (1 - Math.exp(-1.2 * r)),
    o = n && t > 15 ? -0.18 : 0;
  return { lift: a, tilt: e.tilt + (o - e.tilt) * (1 - Math.exp(-2 * r)) };
}
var Vt = 0.05;
function Ht(e, t, n, r, i) {
  let a = n && !r && t > 5 ? 1 : 0,
    o = a > e.lift ? 2.2 : 1.1,
    s = e.lift + (a - e.lift) * (1 - Math.exp(-o * i)),
    c = r && t > 15 ? -0.18 : -0.05 * s;
  return { lift: s, tilt: e.tilt + (c - e.tilt) * (1 - Math.exp(-2 * i)) };
}
var Ut = 0.2,
  Wt = -0.16;
function Gt(e, t, n) {
  return e + (+!!t - e) * (1 - Math.exp(-(t ? 1.6 : 1.1) * n));
}
function Kt(e, t, n) {
  return t ? 0 : e / 3.6 / Math.max(0.05, n);
}
var qt = 0.49;
function Jt(e) {
  return -Math.max(-1, Math.min(1, e)) * qt;
}
var Yt = 3.6,
  W = 1.6,
  Xt = 14,
  Zt = 260,
  G = 110,
  K = 24,
  q = 370,
  Qt = {
    m5: `hatch`,
    "mustang-blue": `mustang`,
    "mustang-black": `mustang`,
    "bmw-m3": `bmw`,
    "porsche-gt3": `porsche`,
    "bugatti-chiron": `bugatti`,
    "ferrari-sf90": `ferrari`,
    bus: `bus`,
    truck: `truck`,
    suv: `suv`,
    sedan: `sedan`,
    hatch: `hatch`,
    pickup: `pickup`,
  },
  $t = {
    hatch: A.hatch,
    sedan: A.sedan,
    suv: A.suv,
    pickup: A.pickup,
    bus: A.bus,
    truck: A.truck,
    mustang: A[`mustang-blue`],
    bmw: A[`bmw-m3`],
    porsche: A[`porsche-gt3`],
    bugatti: A[`bugatti-chiron`],
    ferrari: A[`ferrari-sf90`],
  },
  J = (e) => {
    let t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  },
  Y = (e, t, n) => e + (t - e) * n;
function X(e, t, n) {
  let r = document.createElement(`canvas`);
  ((r.width = e), (r.height = t));
  let a = r.getContext(`2d`);
  if (!a) throw Error(`Canvas context unavailable`);
  n(a);
  let o = new i(r);
  return ((o.colorSpace = O), (o.wrapS = o.wrapT = ie), (o.anisotropy = 8), o);
}
function Z(e, t, n, r, i, a) {
  for (let o = 0; o < r; o++) {
    e.fillStyle = i[o % i.length] ?? `#45474c`;
    let r = a[0] + Math.random() * (a[1] - a[0]);
    e.fillRect(Math.random() * t, Math.random() * n, r, r);
  }
}
function en(e) {
  let t = 1024,
    n = 2048;
  return X(t, n, (r) => {
    if (((r.fillStyle = `#3a3c40`), r.fillRect(0, 0, t, n), e)) {
      for (let i = 0; i < n; i += 256)
        for (let n = 0; n < t; n += 256) r.drawImage(e, n, i, 256, 256);
      ((r.fillStyle = `rgba(10,12,15,0.22)`), r.fillRect(0, 0, t, n));
    } else
      Z(
        r,
        t,
        n,
        38e3,
        [`#3d3f42`, `#36383b`, `#414346`, `#383a3d`],
        [0.5, 1.5],
      );
    let i = t / Xt;
    for (let e = 0; e < 3; e++) {
      let t = (W + Yt * (e + 0.5)) * i;
      for (let e of [-0.85, 0.85]) {
        let a = r.createLinearGradient(t + e * i - 18, 0, t + e * i + 18, 0);
        (a.addColorStop(0, `rgba(20,20,22,0)`),
          a.addColorStop(0.5, `rgba(20,20,22,0.22)`),
          a.addColorStop(1, `rgba(20,20,22,0)`),
          (r.fillStyle = a),
          r.fillRect(t + e * i - 18, 0, 36, n));
      }
    }
    ((r.fillStyle = `#ece8dc`),
      r.fillRect(W * i - 6, 0, 8, n),
      r.fillRect(12.4 * i - 2, 0, 8, n));
    let a = n / K;
    for (let e of [1, 2]) {
      let t = (W + Yt * e) * i - 3;
      for (let e = 0; e < K; e += 12) r.fillRect(t, e * a, 6, 4 * a);
    }
    r.fillStyle = `rgba(230,230,220,0.35)`;
    for (let e = 0; e < n; e += 14)
      (r.fillRect(W * i - 22, e, 12, 6),
        r.fillRect(916.9714285714285, e, 12, 6));
  });
}
function tn() {
  return X(512, 512, (e) => {
    ((e.fillStyle = `#3f5f2a`),
      e.fillRect(0, 0, 512, 512),
      Z(
        e,
        512,
        512,
        3e4,
        [`#4c6f32`, `#36521f`, `#5a7e3a`, `#2f4a1b`, `#6a7f3c`],
        [1, 4],
      ));
  });
}
function nn() {
  return X(256, 256, (e) => {
    ((e.fillStyle = `#8d8a84`),
      e.fillRect(0, 0, 256, 256),
      Z(e, 256, 256, 9e3, [`#9a978f`, `#7f7c76`, `#a5a29a`], [1, 3]));
  });
}
function rn(e) {
  return X(512, 192, (t) => {
    ((t.fillStyle = `#0f6b3a`),
      t.fillRect(0, 0, 512, 192),
      (t.strokeStyle = `#f2f2f2`),
      (t.lineWidth = 6),
      t.strokeRect(8, 8, 496, 176),
      (t.fillStyle = `#f7f7f7`),
      (t.font = `bold 46px Arial, sans-serif`),
      (t.textBaseline = `middle`),
      e.forEach((e, n) => t.fillText(e, 30, 60 + n * 70)));
  });
}
function Q(e) {
  let t = X(128, 128, (t) => {
    let n = t.createRadialGradient(64, 64, 0, 64, 64, 64);
    for (let [t, r] of e) n.addColorStop(t, r);
    ((t.fillStyle = n), t.fillRect(0, 0, 128, 128));
  });
  return ((t.wrapS = t.wrapT = s), t);
}
var $ = { x: 0.275, y: 0.68, z: 2.37 },
  an = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSeed;
  void main() {
    vUv = uv;
    vec3 p = position;
    // turbulent wobble grows toward the tip
    float t = uv.y;
    p.x += sin(uTime * 41.0 + t * 9.0 + uSeed) * 0.02 * t;
    p.y += cos(uTime * 37.0 + t * 7.0 + uSeed * 2.0) * 0.02 * t;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`,
  on = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uSeed;
  uniform float uCore;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float n(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y);
  }
  void main() {
    float t = vUv.y; // 0 = exhaust tip, 1 = flame end
    float ang = vUv.x * 6.2831;
    float turb = n(vec2(ang * 1.5 + uSeed, t * 6.0 - uTime * 28.0)) * 0.6
               + n(vec2(ang * 3.0, t * 14.0 - uTime * 45.0)) * 0.4;
    float body = pow(1.0 - t, 1.3) * (0.55 + turb * 0.9);
    body *= smoothstep(0.0, 0.06, t);
    vec3 blue = vec3(0.45, 0.65, 1.0);
    vec3 white = vec3(1.0, 0.95, 0.85);
    vec3 orange = vec3(1.0, 0.45, 0.08);
    vec3 red = vec3(0.7, 0.08, 0.02);
    vec3 col = mix(blue, white, smoothstep(0.02, 0.15, t));
    col = mix(col, orange, smoothstep(0.15, 0.45, t));
    col = mix(col, red, smoothstep(0.55, 0.95, t));
    col = mix(col, mix(blue, white, t * 3.0), uCore);
    float a = clamp(body * uIntensity, 0.0, 1.0);
    gl_FragColor = vec4(col * (1.6 + uCore), a);
  }
`,
  sn = class {
    canvas;
    overlay;
    onReady;
    playerKey = `revuelto`;
    playerLoad = 0;
    chironRig = null;
    playerLocal = new x();
    async selectPlayerCar(e) {
      let t = ++this.playerLoad,
        n = await ge(e);
      if (this.disposed || t !== this.playerLoad) return;
      try {
        await this.renderer.compileAsync(n, this.camera, this.scene);
      } catch {}
      if (this.disposed || t !== this.playerLoad) return;
      (this.player?.removeFromParent(),
        this.playerShadow?.removeFromParent(),
        this.sunShadow?.removeFromParent(),
        (this.playerTail = []),
        (this.playerHead = []),
        (this.playerBrakeOnly = []),
        (this.playerWipers = []),
        (this.playerWheels = []),
        (this.lightHalos = []),
        (this.flames = []),
        (this.engineBrakeLight = null),
        (this.wing = void 0),
        (this.chironRig = null),
        (this.steeringWheel = null),
        (this.cabinOnly = []),
        (this.playerKey = e));
      let r = n.clone(!0);
      (this.revDash?.dispose(),
        (this.revDash = null),
        e === `revuelto` &&
          ((this.revDash = new zt(r, this.low)), r.add(this.revDash.group)),
        this.setupPlayer(r),
        this.refreshCarCustom(),
        (this.canvas.dataset.playerCar = e));
    }
    refreshCarCustom() {
      if (this.player)
        try {
          me(this.player, this.playerKey, pe(localStorage)[this.playerKey]);
        } catch (e) {
          console.warn(`car custom`, e);
        }
    }
    setupChiron(e) {
      (be(e, this.low),
        e.traverse((e) => {
          e.userData.cabinOnly && this.cabinOnly.push(e);
        }));
      let t = mt(`bugatti`, e, 1, !1);
      this.chironRig = t;
      for (let n of t.all) ((n.count = n === t.wipers ? 2 : 1), e.add(n));
      (e.traverse((e) => {
        e instanceof S &&
          e.userData.wheel &&
          ((e.rotation.order = `YXZ`),
          this.playerWheels.push({
            mesh: e,
            radius: e.userData.radius || 0.34,
            front: e.userData.front === !0 || /_[LR]F$/.test(e.name),
          }));
      }),
        this.headL.position.set(-0.8, 0.7, -1.95),
        this.headR.position.set(0.8, 0.7, -1.95),
        this.headL.target.position.set(-0.9, 0, -30),
        this.headR.target.position.set(0.9, 0, -30),
        this.low ||
          e.add(this.headL, this.headR, this.headL.target, this.headR.target),
        (this.playerShadow = this.addContactShadow(this.scene, 2.3, 4.6)),
        (this.sunShadow = this.addContactShadow(this.scene, 2.9, 5.5)),
        (this.sunShadow.position.y = 0.016),
        (this.wing = e.getObjectByName(`active-wing`)),
        (this.steeringWheel = e.getObjectByName(`steering-wheel`) ?? null),
        (this.wingBaseY = this.wing?.position.y ?? 0),
        (this.wingRise = 0.14),
        (this.player = e),
        this.scene.add(e),
        (this.canvas.dataset.playerCar = `chiron`));
    }
    low = Le({
      userAgent: navigator.userAgent,
      memory: navigator.deviceMemory,
      cores: navigator.hardwareConcurrency || 4,
      touch: navigator.maxTouchPoints > 0,
    });
    quality = new Be();
    width = 1;
    height = 1;
    lastFrame = 0;
    baseDpr = 1;
    rainColor = new c(7371398);
    matrix = new x();
    quaternion = new D();
    scaleVector = new k();
    positionVector = new k();
    renderer;
    scene = new ae();
    camera = new te(62, 1, 0.1, 900);
    sun;
    hemi;
    fog;
    sky = new c();
    daySky;
    dayColor = new c(11127784);
    duskColor = new c(3814736);
    nightColor = new c(329485);
    tunnelColor = new c(1315343);
    roadTex;
    grassTex;
    roadMat;
    reflectionMaps;
    contactTex;
    roadDetail;
    disposed = !1;
    lightHalos = [];
    playerShadow;
    sunShadow;
    posts;
    trunks;
    crowns;
    lampPoles;
    lampHeads;
    lampPools;
    lampHeadMat;
    lampPoolMat;
    tunnel;
    tunnelLightMat;
    tunnelLamp;
    bridges = [];
    waterBridge = null;
    oncoming = [];
    gantries = [];
    radars = [];
    player = null;
    wing;
    steeringWheel = null;
    revDash = null;
    cabinOnly = [];
    eyeVector = new k();
    lookVector = new k();
    wingBaseY = 0.96;
    wingRise = 0.17;
    aero = { lift: 0, tilt: 0 };
    buildings;
    rooftops;
    cityMaterial;
    playerTail = [];
    playerHead = [];
    playerBrakeOnly = [];
    playerWheels = [];
    body = Ve();
    head = Je();
    headEuler = new p(0, 0, 0, `YXZ`);
    headQuat = new D();
    engineBrakeLight = null;
    rimWarm = new d(16757575, 1.5);
    rimCool = new d(8368895, 0.8);
    roadBeamMesh = null;
    headL;
    headR;
    flames = [];
    flameAmt = 0;
    flameLen = 0;
    popT = 0;
    templates = new Map();
    policeCar = null;
    policeRed = null;
    policeBlue = null;
    sprites = [];
    smokeTex;
    sparkTex;
    rain;
    rainPos;
    time = 0;
    camX = 0;
    camPull = 0;
    camView = `chase`;
    ready = !1;
    constructor(e, t, i) {
      ((this.canvas = e), (this.overlay = t), (this.onReady = i));
      let a = Re(window.devicePixelRatio, this.low);
      ((this.baseDpr = a),
        (this.quality = new Be(ze(a))),
        (this.renderer = new fe({
          canvas: e,
          antialias: !0,
          powerPreference: `high-performance`,
          stencil: !1,
          precision: `highp`,
        })),
        this.renderer.setPixelRatio(a),
        (this.renderer.outputColorSpace = O),
        (this.renderer.toneMapping = 4),
        (this.renderer.toneMappingExposure = 1.05),
        (this.renderer.shadowMap.enabled = !this.low),
        (this.renderer.shadowMap.type = 1),
        (this.fog = new h(11127784, 60, 250)),
        (this.scene.fog = this.fog),
        (this.scene.background = this.sky));
      let o = X(1024, 512, (e) => {
        let t = e.createLinearGradient(0, 0, 0, 512);
        (t.addColorStop(0, `#598fc4`),
          t.addColorStop(0.48, `#a8cbe5`),
          t.addColorStop(0.7, `#e5e9e9`),
          t.addColorStop(1, `#94a287`),
          (e.fillStyle = t),
          e.fillRect(0, 0, 1024, 512));
        for (let t = 0; t < 45; t++) {
          let n = J(t * 3) * 1024,
            r = 160 + J(t * 7) * 90,
            i = e.createRadialGradient(n, r, 0, n, r, 70);
          (i.addColorStop(0, `rgba(255,255,255,0.22)`),
            i.addColorStop(1, `rgba(255,255,255,0)`),
            (e.fillStyle = i),
            e.save(),
            e.translate(n, r),
            e.scale(1, 0.22),
            e.translate(-n, -r),
            e.fillRect(n - 70, r - 70, 140, 140),
            e.restore());
        }
      });
      ((o.mapping = 303),
        (this.daySky = o),
        (this.hemi = new _(14675711, 3885610, 0.9)),
        this.scene.add(this.hemi),
        this.rimWarm.position.set(-6, 3, -5),
        this.rimCool.position.set(5, 2, -6),
        this.scene.add(this.rimWarm, this.rimCool),
        (this.sun = new d(16773596, 2.4)),
        (this.sun.castShadow = !0),
        this.sun.shadow.mapSize.set(1024, 1024));
      let s = this.sun.shadow.camera;
      ((s.left = -14),
        (s.right = 14),
        (s.top = 22),
        (s.bottom = -22),
        (s.near = 1),
        (s.far = 80),
        (this.sun.shadow.bias = -5e-4),
        this.scene.add(this.sun, this.sun.target),
        (this.tunnelLamp = new ne(16763274, 0, 26, 1.6)),
        this.scene.add(this.tunnelLamp),
        (this.headL = this.makeHeadlight()),
        (this.headR = this.makeHeadlight()),
        (this.roadTex = en()),
        this.roadTex.repeat.set(1, q / K),
        (this.grassTex = tn()),
        this.grassTex.repeat.set(10, q / 8),
        (this.roadMat = new w({
          map: this.roadTex,
          roughness: 0.88,
          metalness: 0.02,
          bumpMap: this.roadTex,
          bumpScale: 0.012,
        })),
        (this.smokeTex = Q([
          [0, `rgba(255,255,255,0.9)`],
          [0.5, `rgba(255,255,255,0.35)`],
          [1, `rgba(255,255,255,0)`],
        ])),
        (this.sparkTex = Q([
          [0, `rgba(255,255,255,1)`],
          [0.25, `rgba(255,200,90,0.9)`],
          [1, `rgba(255,90,0,0)`],
        ])),
        (this.contactTex = tt()),
        this.buildWorld());
      let c = this.low ? 80 : 500;
      this.rainPos = new Float32Array(c * 6);
      for (let e = 0; e < c; e++) this.resetDrop(e, !0);
      let l = new r();
      (l.setAttribute(`position`, new n(this.rainPos, 3)),
        (this.rain = new b(
          l,
          new y({
            color: 13624063,
            transparent: !0,
            opacity: 0,
            depthWrite: !1,
          }),
        )),
        (this.rain.frustumCulled = !1),
        this.scene.add(this.rain));
      for (let e = 0; e < (this.low ? 12 : 96); e++) {
        let e = new ce(
          new le({ map: this.smokeTex, transparent: !0, depthWrite: !1 }),
        );
        ((e.visible = !1), this.sprites.push(e), this.scene.add(e));
      }
      (this.loadModels(),
        et(this.renderer)
          .then((e) => {
            if (this.disposed) {
              (e.day.dispose(),
                e.night.dispose(),
                e.tunnel.dispose(),
                e.sky.dispose(),
                e.asphalt.dispose());
              return;
            }
            (this.daySky.dispose(),
              (this.daySky = e.sky),
              (this.reflectionMaps = e),
              (this.scene.environment = e.day.texture));
            let t = en(e.asphalt.image);
            (t.repeat.set(1, q / K),
              (this.roadMat.map = t),
              this.roadTex.dispose(),
              (this.roadTex = t));
            let n = e.asphalt.clone();
            ((n.colorSpace = ``),
              (n.wrapS = n.wrapT = ie),
              n.repeat.set(Xt / 3.5, q / 3.5),
              (n.anisotropy = 8),
              (n.needsUpdate = !0),
              (this.roadDetail = n),
              (this.roadMat.bumpMap = this.roadMat.roughnessMap = n),
              (this.roadMat.bumpScale = 0.008),
              (this.roadMat.needsUpdate = !0),
              (this.canvas.dataset.roadLightingReady = `true`));
          })
          .catch((e) => console.error(`Road lighting failed`, e)));
    }
    makeHeadlight() {
      let e = new se(16774368, 0, 90, 0.42, 0.55, 1.2);
      return (this.low || this.scene.add(e, e.target), e);
    }
    resetDrop(e, t) {
      let n = (Math.random() - 0.5) * 40,
        r = -Math.random() * 60 + 8,
        i = t ? Math.random() * 18 : 18,
        a = e * 6;
      this.rainPos.set([n, i, r, n - 0.05, i - 0.9, r + 0.25], a);
    }
    buildWorld() {
      let e = new S(new E(Xt, q), this.roadMat);
      ((e.rotation.x = -Math.PI / 2),
        (e.position.z = -75),
        (e.receiveShadow = !0),
        this.scene.add(e));
      let n = new w({ color: 7827562, roughness: 1 }),
        r = new w({ map: this.grassTex, roughness: 1 });
      for (let e of [-1, 1]) {
        let i = new S(new E(2.2, q), n);
        ((i.rotation.x = -Math.PI / 2),
          i.position.set(e * 8.1, -0.02, -75),
          (i.receiveShadow = !0));
        let a = new S(new E(160, q), r);
        ((a.rotation.x = -Math.PI / 2),
          a.position.set(e * 89.2, -0.05, -75),
          (a.receiveShadow = !0),
          this.scene.add(i, a));
        let o = new S(
          new t(0.08, 0.32, q),
          new w({ color: 12896460, metalness: 0.85, roughness: 0.35 }),
        );
        (o.position.set(e * 7.45, 0.62, -75),
          (o.castShadow = !0),
          this.scene.add(o));
      }
      let i = new t(0.12, 0.75, 0.12);
      (i.translate(0, 0.37, 0),
        (this.posts = new v(
          i,
          new w({ color: 6975092, metalness: 0.6, roughness: 0.5 }),
          160,
        )),
        this.scene.add(this.posts));
      let a = new u(0.2, 0.32, 3, 7);
      a.translate(0, 1.5, 0);
      let s = new l(2.35, 2.7, 7);
      s.translate(0, 3.2, 0);
      let c = new l(1.85, 2.3, 7);
      c.translate(0, 4.7, 0);
      let d = new l(1.25, 1.9, 7);
      d.translate(0, 6, 0);
      let f = he([s, c, d]) || s;
      (f.computeVertexNormals(),
        s.dispose(),
        c.dispose(),
        d.dispose(),
        (this.trunks = new v(
          a,
          new w({ color: 4007702, roughness: 0.95 }),
          140,
        )),
        (this.crowns = new v(
          f,
          new w({ color: 1916184, roughness: 0.82, flatShading: !1 }),
          140,
        )),
        (this.crowns.castShadow = !0),
        this.scene.add(this.trunks, this.crowns));
      let p = new u(0.09, 0.14, 9, 8);
      (p.translate(0, 4.5, 0),
        (this.lampPoles = new v(
          p,
          new w({ color: 9080726, metalness: 0.7, roughness: 0.4 }),
          24,
        )));
      let m = new t(1.8, 0.18, 0.5);
      (m.translate(0, 9, 0),
        (this.lampHeadMat = new w({
          color: 7829367,
          emissive: 16767392,
          emissiveIntensity: 0,
        })),
        (this.lampHeads = new v(m, this.lampHeadMat, 24)));
      let h = new o(5.5, 24);
      (h.rotateX(-Math.PI / 2),
        h.translate(0, 0.02, 0),
        (this.lampPoolMat = new C({
          map: Q([
            [0, `rgba(255,210,150,0.8)`],
            [1, `rgba(255,210,150,0)`],
          ]),
          transparent: !0,
          opacity: 0,
          blending: 2,
          depthWrite: !1,
        })),
        (this.lampPools = new v(h, this.lampPoolMat, 24)),
        this.scene.add(this.lampPoles, this.lampHeads, this.lampPools),
        this.buildTunnel());
      let _ = X(256, 512, (e) => {
        ((e.fillStyle = `#a8afb0`),
          e.fillRect(0, 0, 256, 512),
          Z(e, 256, 512, 7e3, [`#9aa3a5`, `#b6bbba`, `#8f999e`], [1, 2]));
        for (let t = 14; t < 512; t += 32)
          for (let n = 12; n < 256; n += 32)
            ((e.fillStyle = J(n + t * 2) > 0.73 ? `#d1c8a1` : `#3c5965`),
              e.fillRect(n, t, 17, 22),
              (e.fillStyle = `#ccd1d0`),
              e.fillRect(n - 1, t + 22, 19, 2));
      });
      ((this.cityMaterial = new w({
        map: _,
        roughness: 0.72,
        metalness: 0.12,
        emissiveMap: _,
        emissive: 16777215,
        emissiveIntensity: 0,
      })),
        (this.buildings = new v(
          new t(1, 1, 1).translate(0, 0.5, 0),
          this.cityMaterial,
          72,
        )),
        (this.rooftops = new v(
          new t(1, 1, 1),
          new w({ color: 6911100, roughness: 0.8 }),
          72,
        )),
        (this.buildings.frustumCulled = this.rooftops.frustumCulled = !1),
        this.scene.add(this.buildings, this.rooftops));
      let y = new w({ map: nn(), roughness: 0.9 });
      for (let e = 0; e < 2; e++) {
        let e = new g(),
          n = new S(new t(44, 1.2, 12), y);
        ((n.position.y = 6.6), (n.castShadow = !0), e.add(n));
        let r = new S(new t(44, 0.9, 0.3), y);
        (r.position.set(0, 7.6, 5.8), e.add(r, r.clone().translateZ(-11.6)));
        for (let n of [-9.4, 0, 9.4]) {
          let r = new S(new t(n === 0 ? 0.6 : 1.2, 6.2, 3), y);
          (r.position.set(n, 3, 0), (r.castShadow = !0), n !== 0 && e.add(r));
        }
        ((e.visible = !1), this.bridges.push(e), this.scene.add(e));
      }
      let b = new w({ color: 10133670, metalness: 0.8, roughness: 0.35 }),
        x = [
          [`São Paulo  42 km`, `Campinas  96 km`],
          [`Saída 23  →`, `Interlagos`],
          [`Rodovia dos`, `Bandeirantes`],
        ];
      for (let e = 0; e < 3; e++) {
        let n = new g();
        for (let e of [-1, 1]) {
          let t = new S(new u(0.2, 0.2, 7.2, 8), b);
          (t.position.set(e * 7.9, 3.6, 0), n.add(t));
        }
        let r = new S(new t(16, 0.5, 0.5), b);
        ((r.position.y = 6.9), n.add(r));
        let i = new S(
          new t(6.5, 2.4, 0.15),
          new w({
            map: rn(x[e] ?? []),
            roughness: 0.5,
            emissive: 16777215,
            emissiveIntensity: 0,
            emissiveMap: null,
          }),
        );
        (i.position.set(-1.8, 6.2, 0.35),
          n.add(i),
          n.traverse((e) => (e.castShadow = !0)),
          (n.visible = !1),
          this.gantries.push(n),
          this.scene.add(n));
      }
      for (let e = 0; e < 2; e++) {
        let e = new g(),
          n = new S(new u(0.12, 0.12, 5.2, 8), b);
        n.position.y = 2.6;
        let r = new S(
          new t(0.6, 0.5, 0.7),
          new w({ color: 15658734, roughness: 0.5 }),
        );
        r.position.set(-0.3, 5.2, 0);
        let i = new S(new o(0.15, 16), new C({ color: 1118481 }));
        (i.position.set(-0.3, 5.2, -0.36),
          (i.rotation.y = Math.PI),
          e.add(n, r, i),
          (e.position.x = 8.6),
          (e.visible = !1),
          this.radars.push(e),
          this.scene.add(e));
      }
    }
    buildTunnel() {
      // Closed tunnel: overlapping wall/ceiling/shell pieces so no gaps are visible from any angle.
      let e = Me - Se,
        L = e + 2,
        n = new g(),
        r = new w({ color: 12169892, roughness: 0.75, side: 2 }),
        i = new w({ color: 15262420, roughness: 0.35 }),
        a = new w({ color: 2828840, roughness: 0.9, side: 2 }),
        sh = new w({ color: 3355443, roughness: 1, side: 2 });
      for (let k of [-1, 1]) {
        let o = new S(new t(1.6, 7.6, L), r);
        o.position.set(k * 8.2, 3.6, -e / 2);
        let s2 = new S(new t(0.1, 2.2, L), i);
        s2.position.set(k * 7.36, 1.4, -e / 2);
        let hn = new S(new t(2.4, 1.2, L), r);
        hn.position.set(k * 6.6, 6.4, -e / 2);
        hn.rotation.z = k * 0.6;
        let ow = new S(new t(3, 12, L), sh);
        ow.position.set(k * 10.4, 5.8, -e / 2);
        n.add(o, s2, hn, ow);
      }
      let o = new S(new t(18.2, 1.2, L), a);
      o.position.set(0, 7.2, -e / 2);
      let top = new S(new t(23.8, 4.4, L), sh);
      top.position.set(0, 9.9, -e / 2);
      n.add(o, top);
      let pm = new w({ map: nn(), roughness: 0.9, side: 2 }),
        s = new S(new t(34, 10, 1.6), pm);
      s.position.set(0, 11.5, 0.8);
      let c = new S(new t(9, 7.2, 1.6), pm);
      c.position.set(-12.3, 3.6, 0.8);
      let l = c.clone();
      l.position.x *= -1;
      let u = s.clone();
      u.position.z = -e - 0.8;
      let d = c.clone();
      d.position.z = -e - 0.8;
      let f = l.clone();
      f.position.z = -e - 0.8;
      n.add(s, c, l, u, d, f);
      this.tunnelLightMat = new w({
        color: 16777215,
        emissive: 16766880,
        emissiveIntensity: 2.5,
      });
      let p = Math.floor(e / 8),
        m = new v(new t(0.25, 0.08, 3.2), this.tunnelLightMat, p * 2),
        h = new x();
      for (let e = 0; e < p; e++)
        (h.makeTranslation(-2.2, 6.55, -e * 8 - 4),
          m.setMatrixAt(e * 2, h),
          h.makeTranslation(2.2, 6.55, -e * 8 - 4),
          m.setMatrixAt(e * 2 + 1, h));
      for (let c2 of n.children) c2.frustumCulled = !1;
      (n.add(m), (n.visible = !1), (this.tunnel = n), this.scene.add(n));
    }
    async loadModels() {
      await this.selectPlayerCar(this.playerKey).catch((e) =>
        console.error(`Player model failed`, e),
      );
      let e = [
          `hatch`,
          `sedan`,
          `suv`,
          `pickup`,
          `bus`,
          `truck`,
          `mustang`,
          `bmw`,
          `porsche`,
          `bugatti`,
          `ferrari`,
        ],
        t = ge(`police-aventador`)
          .then((e) => this.setupPoliceAventador(e.clone(!0)))
          .catch((e) => console.error(`police model failed`, e));
      (await Promise.all([
        t,
        this.loadWaterBridge(),
        ...e.map((e) =>
          ge(e)
            .then((t) => {
              (this.templates.set(e, t), this.setupTrafficBatch(e, t));
            })
            .catch((t) => console.error(`model ${e} failed`, t)),
        ),
      ]),
        this.setupOncoming(),
        await this.precompileAll(),
        (this.canvas.dataset.modelsReady = `true`));
    }
    async loadWaterBridge() {
      try {
        let e = await new WBLoader().loadAsync(WB_URL),
          n = new g();
        (e.scene.traverse((e) => {
          e instanceof S && ((e.receiveShadow = !0), (e.castShadow = !this.low));
        }),
          n.add(e.scene));
        let r = new S(
          new E(900, WB_LEN - 30),
          new w({
            color: 1919582,
            roughness: 0.12,
            metalness: 0.35,
            polygonOffset: !0,
            polygonOffsetUnits: -4,
          }),
        );
        ((r.rotation.x = -Math.PI / 2),
          r.position.set(0, -0.045, -WB_LEN / 2),
          (r.receiveShadow = !0),
          n.add(r),
          (n.visible = !1),
          (this.waterBridge = n),
          this.scene.add(n));
      } catch (e) {
        console.error(`water bridge failed`, e);
      }
    }
    setupOncoming() {
      if (!this.waterBridge) return;
      let e = [`sedan`, `hatch`, `suv`, `bmw`, `pickup`, `mustang`, `bus`, `porsche`],
        n = this.low ? 4 : 8,
        r = new t(0.35, 0.18, 0.08),
        i = new C({ color: 16774368 });
      for (let a = 0; a < n; a++) {
        let o = this.templates.get(e[a % e.length]);
        if (!o) continue;
        let s = o.clone(!0);
        for (let e of [-0.7, 0.7]) {
          let t = new S(r, i);
          (t.position.set(e, 0.7, -2.05), s.add(t));
        }
        ((s.rotation.y = Math.PI),
          (s.visible = !1),
          this.scene.add(s),
          this.oncoming.push({
            obj: s,
            lane: a % 2 ? -19.6 : -11.9,
            speed: 20 + J(a * 3.1) * 12,
            base: a * ((WB_LEN + 240) / n),
          }));
      }
    }
    async precompileAll() {
      let e = [];
      this.scene.traverse((t) => {
        t.visible ||= (e.push(t), !0);
      });
      let t = this.scene.environment;
      try {
        (await this.renderer.compileAsync(this.scene, this.camera),
          this.reflectionMaps &&
            ((this.scene.environment = this.reflectionMaps.tunnel.texture),
            await this.renderer.compileAsync(this.scene, this.camera),
            (this.scene.environment = this.reflectionMaps.night.texture),
            await this.renderer.compileAsync(this.scene, this.camera)));
      } catch {
      } finally {
        this.scene.environment = t;
        for (let t of e) t.visible = !1;
      }
    }
    setupPlayer(n) {
      if (this.playerKey === `chiron`) {
        this.setupChiron(n);
        return;
      }
      let r = [],
        i = new e();
      n.updateMatrixWorld(!0);
      let o = [];
      n.traverse((e) => {
        let t = e;
        if (!t.isMesh) return;
        let n = Array.isArray(t.material) ? t.material : [t.material];
        for (let e of n) e.forceSinglePass = !0;
        if (!Array.isArray(t.material)) {
          let e = Ct(this.playerKey, t.material.name || ``);
          if (e) {
            o.push({ mesh: t, role: e });
            return;
          }
        }
        n.forEach((e, n) => {
          let a = (e.name || ``).toLowerCase();
          if (a === `tail_light_brake` || a.includes(`brake_light`)) {
            let r = e.clone();
            ((r.emissive = new c(16713216)),
              (r.emissiveIntensity = 0),
              (r.toneMapped = !1),
              Array.isArray(t.material)
                ? (t.material[n] = r)
                : (t.material = r),
              this.playerBrakeOnly.push(r));
          } else if (
            a.startsWith(`tail`) ||
            a === `taillight_rear` ||
            a === `taillight_glass`
          ) {
            let r = e.clone();
            ((r.emissive = new c(16714242)),
              (r.emissiveIntensity = 0.8),
              (r.toneMapped = !1),
              Array.isArray(t.material)
                ? (t.material[n] = r)
                : (t.material = r),
              this.playerTail.push(r));
          } else if (
            a.includes(`headlight`) ||
            a.includes(`daylight`) ||
            a === `light`
          ) {
            let r = e.clone();
            ((r.emissive = new c(16774892)),
              (r.emissiveIntensity = 0.6),
              Array.isArray(t.material)
                ? (t.material[n] = r)
                : (t.material = r),
              this.playerHead.push(r));
          } else if (a === `exhaust`) {
            i.setFromObject(t);
            let e = i.getCenter(new k());
            ((e.z = i.max.z), r.push(e));
          }
        });
      });
      let s = this.setupRealLamps(n, o),
        l = [
          new k(-0.46, 0.94, 1.25),
          new k(-0.4, 0.955, 1.48),
          new k(-0.28, 0.965, 1.62),
          new k(0, 0.968, 1.64),
          new k(0.28, 0.965, 1.62),
          new k(0.4, 0.955, 1.48),
          new k(0.46, 0.94, 1.25),
        ],
        u = new a(l),
        d = new de(u, 32, 0.016, 8, !1),
        f = new C({
          color: 16717061,
          transparent: !0,
          opacity: 0.98,
          toneMapped: !1,
        }),
        p = new S(d, f);
      ((p.name = `engine-cowl-brake-strip`), (p.visible = !1));
      {
        let r = dt(n, new e().setFromObject(n)),
          i = Math.min(0.62, r.halfW * 0.6),
          a = new t(i, 0.018, 0.025).translate(i / 2, 0.012, 0),
          o = new w({ color: 723724, roughness: 0.5, metalness: 0.3 });
        for (let e of [-r.halfW * 0.62, r.halfW * 0.02]) {
          let t = new S(a, o);
          ((t.name = `wiper`),
            (t.rotation.order = `XYZ`),
            t.position.set(e, r.baseY, r.baseZ),
            n.add(t),
            this.playerWipers.push({ mesh: t, tilt: r.tilt }));
        }
      }
      let m = [];
      (n.traverse((t) => {
        let n = t;
        if (
          !n.isMesh ||
          m.length ||
          (
            (Array.isArray(n.material) ? n.material[0] : n.material)?.name || ``
          ).toLowerCase() !== `exhaust`
        )
          return;
        let r = n.geometry.getAttribute(`position`),
          i = new k(),
          a = [new e(), new e()];
        for (let e = 0; e < r.count; e++)
          (i.fromBufferAttribute(r, e).applyMatrix4(n.matrixWorld),
            a[i.x < 0 ? 0 : 1].expandByPoint(i));
        for (let e of a) {
          if (e.isEmpty()) continue;
          let t = e.getCenter(new k());
          ((t.z = e.max.z), m.push(t));
        }
      }),
        this.playerKey === `svj` &&
          ((m.length = 0), m.push(new k(-$.x, $.y, $.z), new k($.x, $.y, $.z))),
        m.length !== 2 &&
          ((m.length = 0),
          m.push(new k(-0.14, 0.78, 2.45), new k(0.14, 0.78, 2.45))));
      for (let e of m) this.flames.push(this.makeFlame(n, e));
      (this.headL.position.set(-0.7, 0.75, -2.2),
        this.headR.position.set(0.7, 0.75, -2.2),
        this.low || n.add(this.headL, this.headR),
        this.headL.target.position.set(-0.9, 0, -30),
        this.headR.target.position.set(0.9, 0, -30),
        this.low || n.add(this.headL.target, this.headR.target),
        (this.playerShadow = this.addContactShadow(this.scene, 2.25, 5)),
        (this.sunShadow = this.addContactShadow(this.scene, 2.9, 5.9)),
        (this.sunShadow.position.y = 0.016));
      let h = Q([
          [0, `rgba(255,255,255,0.5)`],
          [0.18, `rgba(255,255,255,0.22)`],
          [0.55, `rgba(255,255,255,0.06)`],
          [1, `rgba(255,255,255,0)`],
        ]),
        g = (e, t, r, i, a) => {
          let o = new C({
              map: h,
              color: i === `head` ? 16774374 : 16714242,
              transparent: !0,
              opacity: 0,
              depthWrite: !1,
              blending: 2,
              toneMapped: !1,
            }),
            s = new S(new E(a, a * 0.65), o);
          (s.position.set(e, t, r),
            i === `head` && (s.rotation.y = Math.PI),
            n.add(s),
            this.lightHalos.push({ mesh: s, kind: i }));
        };
      if (s.head.length || s.tail.length) {
        let e = (e) => Math.min(0.7, Math.max(0.28, (e.max.x - e.min.x) * 1.4));
        for (let t of s.head) {
          let n = t.getCenter(new k());
          g(n.x, n.y, t.min.z - 0.03, `head`, e(t));
        }
        for (let t of s.tail) {
          let n = t.getCenter(new k());
          g(n.x, n.y, t.max.z + 0.03, `tail`, e(t));
        }
        let [t, n] = s.head;
        if (t && n) {
          let e = t.getCenter(new k()),
            r = n.getCenter(new k()),
            [i, a] = e.x < r.x ? [e, r] : [r, e];
          (this.headL.position.set(i.x, i.y, t.min.z - 0.05),
            this.headR.position.set(a.x, a.y, n.min.z - 0.05));
        }
      } else
        for (let e of [-0.79, 0.79])
          (g(e, 0.73, 2.43, `tail`, 0.72), g(e, 0.56, -2.47, `head`, 0.56));
      let _ = X(512, 1024, (e) => {
          e.clearRect(0, 0, 512, 1024);
          for (let t of [185, 327]) {
            let n = e.createRadialGradient(t, 160, 20, t, 520, 480);
            (n.addColorStop(0, `rgba(255, 248, 225, 0.85)`),
              n.addColorStop(0.35, `rgba(255, 238, 195, 0.45)`),
              n.addColorStop(0.72, `rgba(230, 215, 175, 0.16)`),
              n.addColorStop(1, `rgba(200, 190, 160, 0)`),
              (e.fillStyle = n),
              e.beginPath(),
              e.ellipse(t, 480, 165, 460, 0, 0, Math.PI * 2),
              e.fill());
          }
        }),
        v = new S(
          new E(8.2, 52),
          new C({
            map: _,
            color: 16775914,
            transparent: !0,
            opacity: 0.52,
            depthWrite: !1,
            blending: 2,
          }),
        );
      ((v.rotation.x = -Math.PI / 2),
        v.position.set(0, 0.025, -27),
        (v.name = `road-beam`),
        (v.visible = !1),
        n.add(v),
        (this.roadBeamMesh = v),
        (this.playerWheels.length = 0),
        n.traverse((e) => {
          let t = e;
          t.isMesh &&
            t.userData.wheel &&
            ((t.rotation.order = `YXZ`),
            this.playerWheels.push({
              mesh: t,
              radius: t.userData.radius || 0.34,
              front: t.userData.front === !0 || /_[LR]F$/.test(t.name),
            }));
        }),
        (this.player = n),
        (this.steeringWheel = n.getObjectByName(`steering-wheel`) ?? null),
        (this.wing = n.getObjectByName(`active-wing`)),
        (this.wingBaseY = this.wing?.position.y ?? 0.96),
        (this.wingRise = this.playerKey === `revuelto` ? Vt : 0.17),
        this.scene.add(n));
    }
    setupRealLamps(t, n) {
      let r = { head: [], tail: [] };
      if (!n.length) return r;
      t.updateMatrixWorld(!0);
      let i = new x().copy(t.matrixWorld).invert(),
        a = { head: [new e(), new e()], tail: [new e(), new e()] },
        o = (e, t) => {
          let n = e.clone();
          return (
            (n.emissive = new c(t === `head` ? 16774376 : 16714242)),
            t !== `head` && n.map && !n.emissiveMap && (n.emissiveMap = n.map),
            t === `head` &&
              ((n.emissiveMap = null),
              this.playerKey === `svj` &&
                ((n.map = null),
                (n.alphaMap = null),
                (n.transparent = !1),
                (n.opacity = 1),
                (n.alphaTest = 0),
                n.color.set(2763824),
                (n.polygonOffset = !0),
                (n.polygonOffsetFactor = -8),
                (n.polygonOffsetUnits = -40))),
            this.playerKey === `svj` &&
              t !== `head` &&
              n.color.multiplyScalar(0.12),
            (n.toneMapped = t === `head`),
            (n.emissiveIntensity = 0),
            (t === `head`
              ? this.playerHead
              : t === `tail`
                ? this.playerTail
                : this.playerBrakeOnly
            ).push(n),
            n
          );
        },
        s = new k();
      for (let { mesh: e, role: r } of n) {
        let n = new x().multiplyMatrices(i, e.matrixWorld),
          c = e.geometry,
          l = c.getAttribute(`position`),
          u = c.getIndex(),
          d = (u ? u.count : l.count) / 3,
          f = (e, t) => (u ? u.getX(e * 3 + t) : e * 3 + t),
          p = [],
          m = [];
        for (let e = 0; e < d; e++) {
          let t = 0;
          for (let r = 0; r < 3; r++)
            t += s.fromBufferAttribute(l, f(e, r)).applyMatrix4(n).z;
          (t < 0 ? p : m).push(f(e, 0), f(e, 1), f(e, 2));
        }
        let h =
            r === `lamp`
              ? [
                  [p, `head`],
                  [m, `tail`],
                ]
              : [
                  [m, r],
                  [p, r],
                ],
          g = e.parent ?? t;
        for (let [t, r] of h) {
          if (!t.length) continue;
          let i = c.clone();
          i.setIndex(t);
          let u = new S(i, o(e.material, r));
          if (
            ((u.name = `${e.name}-${r}`),
            u.position.copy(e.position),
            u.quaternion.copy(e.quaternion),
            u.scale.copy(e.scale),
            (u.renderOrder = e.renderOrder),
            g.add(u),
            r !== `brake`)
          )
            for (let e of t)
              (s.fromBufferAttribute(l, e).applyMatrix4(n),
                a[r][s.x < 0 ? 0 : 1].expandByPoint(s));
        }
        g.remove(e);
      }
      for (let e of [`head`, `tail`])
        for (let t of a[e]) t.isEmpty() || r[e].push(t);
      return r;
    }
    makeFlame(e, t) {
      let n = new g();
      n.position.copy(t);
      let r = (e, t) => {
          let r = new u(
            e * 0.25,
            e,
            1,
            this.low ? 10 : 20,
            this.low ? 5 : 12,
            !0,
          );
          (r.translate(0, 0.5, 0), r.rotateX(Math.PI / 2));
          let i = new oe({
              vertexShader: an,
              fragmentShader: on,
              uniforms: {
                uTime: { value: 0 },
                uIntensity: { value: 0 },
                uSeed: { value: Math.random() * 10 },
                uCore: { value: t },
              },
              transparent: !0,
              depthWrite: !1,
              blending: 2,
              side: 2,
            }),
            a = new S(r, i);
          return ((a.frustumCulled = !1), n.add(a), { mesh: a, mat: i });
        },
        i = r(0.11, 0),
        a = r(0.05, 1);
      a.mesh.scale.set(1, 1, 0.45);
      let o = new ce(
        new le({
          map: Q([
            [0, `rgba(255,190,110,1)`],
            [0.35, `rgba(255,110,30,0.45)`],
            [1, `rgba(255,60,0,0)`],
          ]),
          transparent: !0,
          depthWrite: !1,
          blending: 2,
        }),
      );
      (o.scale.setScalar(0.6), (o.position.z = 0.15), n.add(o));
      let s = new ne(16742954, 0, 7, 2);
      return (
        (s.position.z = 0.4),
        this.low || n.add(s),
        (n.visible = !1),
        e.add(n),
        { group: n, outer: i.mat, core: a.mat, glow: o, light: s }
      );
    }
    trafficBatches = new Map();
    trafficLights = new Map();
    playerWipers = [];
    wiperTmp = new x();
    trafficSignals = new Map();
    trafficWings = new Map();
    wingLift = new WeakMap();
    wingLocal = new x();
    wingWorld = new x();
    wingEuler = new p();
    wingQuat = new D();
    wingPos = new k();
    unitScale = new k(1, 1, 1);
    setupPoliceAventador(e) {
      ((this.policeRed = new w({
        color: 3342336,
        emissive: 16715792,
        emissiveIntensity: 0,
        toneMapped: !1,
      })),
        (this.policeBlue = new w({
          color: 2099,
          emissive: 1723903,
          emissiveIntensity: 0,
          toneMapped: !1,
        })),
        e.updateMatrixWorld(!0));
      let t = new x().copy(e.matrixWorld).invert(),
        n = [];
      e.traverse((e) => {
        let t = e;
        t.isMesh &&
          !Array.isArray(t.material) &&
          t.material.name === `CP_Light` &&
          n.push(t);
      });
      let r = new k();
      for (let i of n) {
        let n = new x().multiplyMatrices(t, i.matrixWorld),
          a = i.geometry,
          o = a.getAttribute(`position`),
          s = a.getIndex(),
          c = (s ? s.count : o.count) / 3,
          l = (e, t) => (s ? s.getX(e * 3 + t) : e * 3 + t),
          u = [],
          d = [];
        for (let e = 0; e < c; e++) {
          let t = 0;
          for (let i = 0; i < 3; i++)
            t += r.fromBufferAttribute(o, l(e, i)).applyMatrix4(n).x;
          (t < 0 ? u : d).push(l(e, 0), l(e, 1), l(e, 2));
        }
        let f = i.parent ?? e;
        for (let [e, t] of [
          [u, this.policeRed],
          [d, this.policeBlue],
        ]) {
          if (!e.length) continue;
          let n = a.clone();
          n.setIndex(e);
          let r = new S(n, t);
          (r.position.copy(i.position),
            r.quaternion.copy(i.quaternion),
            r.scale.copy(i.scale),
            f.add(r));
        }
        f.remove(i);
      }
      (e.traverse((e) => {
        let t = e;
        if (t.isMesh)
          for (let e of Array.isArray(t.material) ? t.material : [t.material])
            e.forceSinglePass = !0;
      }),
        this.addContactShadow(e, 2.15, 4.9),
        (e.visible = !1),
        this.scene.add(e),
        (this.policeCar = e));
    }
    setupTrafficBatch(e, n) {
      let r = [],
        i = [],
        a = null;
      (n.traverse((e) => {
        if (!(e instanceof S)) return;
        let t = Array.isArray(e.material) ? e.material : [e.material];
        for (let e of t) e.forceSinglePass = !0;
        let n = new v(e.geometry, e.material, 128);
        (n.instanceMatrix.setUsage(f),
          (n.frustumCulled = !1),
          (n.count = 0),
          this.scene.add(n),
          e.parent?.name === `active-wing`
            ? ((a = e.parent.position.clone()),
              i.push({ mesh: n, strut: !!e.userData.strut }))
            : r.push(n));
      }),
        a && i.length && this.trafficWings.set(e, { pivot: a, parts: i }));
      let [o, s] = $t[e] ?? [2, 4.6],
        c = new v(
          new E(o + 0.15, s + 0.2).rotateX(-Math.PI / 2).translate(0, 0.018, 0),
          new C({
            map: this.contactTex,
            color: 0,
            transparent: !0,
            opacity: 0.86,
            depthWrite: !1,
          }),
          128,
        );
      ((c.frustumCulled = !1),
        this.scene.add(c),
        r.push(c),
        this.trafficBatches.set(e, r));
      let l = mt(e, n, 128, e === `bus` || e === `truck`);
      for (let e of l.all) this.scene.add(e);
      this.trafficLights.set(e, l);
      let u = new v(new t(0.13, 0.08, 0.04), new C({ color: 16752640 }), 256);
      ((u.frustumCulled = !1),
        u.instanceMatrix.setUsage(f),
        this.scene.add(u),
        this.trafficSignals.set(e, u));
    }
    resize(e, t) {
      ((this.width = e),
        (this.height = t),
        this.renderer.setSize(e, t, !1),
        (this.camera.aspect = e / t),
        this.camera.updateProjectionMatrix());
    }
    cycleCamera() {
      return (
        (this.camView = Ot(this.camView, _e(this.playerKey))),
        (this.canvas.dataset.camMode = this.camView),
        this.camView
      );
    }
    get cameraView() {
      return this.camView;
    }
    render = (e) => {
      let t = performance.now();
      (this.lastFrame &&
        this.low &&
        this.quality.sample((t - this.lastFrame) / 1e3, document.hidden) &&
        (this.renderer.setPixelRatio(this.baseDpr * this.quality.scale),
        this.renderer.setSize(this.width, this.height, !1)),
        (this.lastFrame = t));
      let n = Math.min(e.dt, 0.05);
      this.time += n;
      let { ppm: r } = e,
        i = (t) => (t - e.roadCenterX) / r,
        a = (t) => (t - e.baseY) / r,
        o = e.pz,
        s = Ie(o),
        c = we(o),
        l = Ce(o),
        u = ke(o) || e.highBeam,
        d = Math.min(1, s * 2) * (1 - s);
      (this.sky
        .copy(this.dayColor)
        .lerp(this.duskColor, d * 0.8)
        .lerp(this.nightColor, s),
        this.sky.lerp(this.rainColor, c * 0.6 * (1 - s)));
      let f = this.tunnelFactor(o);
      ((this.scene.background =
        s < 0.05 && c < 0.05 && f < 0.05 ? this.daySky : this.sky),
        this.fog.color.copy(this.sky).lerp(this.tunnelColor, f),
        (this.fog.near = Y(60, 25, Math.max(c, s * 0.5))),
        (this.fog.far = Y(250, 150, c)),
        (this.sun.intensity = Y(2.9, 0.04, s) * (1 - c * 0.6) * (1 - f)),
        (this.hemi.intensity =
          Y(0.95, 0.38, s) * (1 - c * 0.2) * Y(1, 0.65, f)),
        (this.scene.environmentIntensity = Y(1.15, 0.18, s) * Y(1, 0.35, f)),
        this.reflectionMaps &&
          (this.scene.environment =
            f > 0.5
              ? this.reflectionMaps.tunnel.texture
              : s > 0.45
                ? this.reflectionMaps.night.texture
                : this.reflectionMaps.day.texture));
      let p = Y(1, 0.3, Math.max(s, f));
      ((this.rimWarm.intensity = 0.22 * p),
        (this.rimCool.intensity = 0.32 * p),
        (this.roadMat.roughness = Y(0.96, 0.38, c)),
        this.roadMat.color.setScalar(Y(1, 0.55, c)),
        (this.tunnelLamp.intensity = l
          ? 28 + Math.sin(((o % 8) / 8) * Math.PI * 2) * 10
          : 0));
      let m = e.player.x,
        h = i(m);
      if (
        ((this.roadTex.offset.y = (o / K) % 1),
        this.roadDetail && (this.roadDetail.offset.y = (o / 3.5) % 1),
        (this.grassTex.offset.y = (o / 8) % 1),
        this.layoutScenery(o, s),
        this.placeLandmarks(o),
        this.sun.position.set(h + 8, 22, -6),
        this.sun.target.position.set(h, 0, -8),
        this.player)
      ) {
        let t = this.player;
        if (
          (t.position.set(h, 0, 0),
          this.playerShadow &&
            ((this.playerShadow.position.x = h),
            (this.playerShadow.rotation.z = e.player.rot)),
          this.sunShadow)
        ) {
          let t = Oe(o, l, s);
          ((this.sunShadow.position.x = h + t.x),
            (this.sunShadow.position.z = t.z),
            (this.sunShadow.rotation.z = e.player.rot),
            (this.sunShadow.material.opacity = t.strength));
        }
        ((t.rotation.y = -e.player.rot),
          (this.body = qe(
            this.body,
            e.player.rot,
            e.player.speed,
            e.braking,
            n,
          )),
          (t.rotation.z = this.body.roll),
          (t.rotation.x = this.body.pitch));
        for (let t of this.playerWheels)
          ((t.mesh.rotation.x -= Kt(e.player.speed, e.braking, t.radius) * n),
            t.front && (t.mesh.rotation.y = Jt(e.steer ?? 0)));
        if (this.steeringWheel) {
          let t = this.steeringWheel.userData.axis;
          this.steeringWheel.quaternion.setFromAxisAngle(t, -ve(e.steer ?? 0));
        }
        if (
          (this.revDash?.update(e.player.speed, e.gas, n),
          (this.aero =
            this.playerKey === `revuelto`
              ? Ht(this.aero, e.player.speed, e.gas, e.braking, n)
              : Bt(this.aero, e.player.speed, e.braking, n)),
          this.wing)
        ) {
          this.wing.position.y =
            this.wingBaseY + this.aero.lift * this.wingRise;
          for (let e of this.wing.children)
            e.userData.strut
              ? (e.position.y = -this.aero.lift * this.wingRise * 0.45)
              : this.playerKey === `chiron` && (e.rotation.x = this.aero.tilt);
          this.playerKey !== `chiron` &&
            (this.wing.rotation.x = this.aero.tilt);
          for (let e of t.children.filter((e) => e.name === `wing-support`))
            ((e.visible = this.aero.lift > 0.02),
              (e.scale.y = this.aero.lift),
              (e.position.y = 0.8 + this.aero.lift * 0.085));
        }
        let r = e.braking;
        this.engineBrakeLight && (this.engineBrakeLight.visible = r);
        for (let e of this.playerBrakeOnly) e.emissiveIntensity = r ? 4 : 0;
        if (this.playerKey === `chiron`) {
          for (let e of this.playerTail)
            e.emissiveIntensity = r ? 2.6 : u ? 1.5 : 0.2;
          for (let e of this.playerHead) e.emissiveIntensity = u ? 3.8 : 0.6;
        } else {
          let e = Tt(u, r, wt.has(this.playerKey));
          for (let t of this.playerTail) t.emissiveIntensity = e.tail;
          for (let t of this.playerHead) t.emissiveIntensity = e.head;
          for (let t of this.playerBrakeOnly) t.emissiveIntensity = e.brake;
        }
        let i = wt.has(this.playerKey);
        for (let { mesh: e, kind: t } of this.lightHalos)
          ((e.material.opacity =
            t === `brake`
              ? r
                ? 0.65
                : 0
              : t === `tail`
                ? r
                  ? 0.65
                  : u
                    ? 0.44
                    : i
                      ? 0
                      : 0.035
                : u
                  ? 0.35
                  : i
                    ? 0
                    : 0.015),
            (e.visible = e.material.opacity > 0));
        this.roadBeamMesh &&
          ((this.roadBeamMesh.visible = u),
          (this.roadBeamMesh.material.opacity = e.highBeam
            ? 0.85
            : l
              ? 0.72
              : 0.52));
        for (let e of t.children) e.name === `road-beam` && (e.visible = u);
        let a = e.highBeam ? 260 : u ? 140 : 0;
        ((this.headL.intensity = this.headR.intensity = a),
          (this.headL.distance = this.headR.distance = e.highBeam ? 160 : 90));
        let d = ot(this.time, c);
        for (let e of this.playerWipers)
          (e.mesh.rotation.set(e.tilt, 0, d * 0.95), (e.mesh.visible = !0));
        if (this.chironRig) {
          let e = this.chironRig;
          this.playerLocal.identity();
          for (let t of [e.front, e.rear, e.frontGlow, e.rearGlow])
            (t.setMatrixAt(0, this.playerLocal),
              (t.instanceMatrix.needsUpdate = !0));
          ((e.front.material.opacity = u ? 1 : 0.18),
            (e.rear.material.opacity = r ? 1 : u ? 0.8 : 0),
            (e.frontGlow.material.opacity = u ? 0.35 : 0),
            (e.rearGlow.material.opacity = r ? 0.5 : u ? 0.25 : 0),
            e.wiper.pivots.forEach((t, n) =>
              e.wipers.setMatrixAt(
                n,
                xt(this.playerLocal, t, e.wiper.tilt, d, this.wiperTmp),
              ),
            ),
            (e.wipers.instanceMatrix.needsUpdate = !0));
        }
        (this.playerKey === `revuelto` || this.playerKey === `svj`) &&
          this.updateFlames(e, n);
      }
      for (let [t, r] of this.trafficBatches) {
        let o = 0,
          s = 0,
          d = this.trafficSignals.get(t),
          f = this.trafficWings.get(t);
        for (let l of e.traffic) {
          let e = a(l.y);
          if (Qt[l.type] !== t || e < -285 || e > G || o >= 128) continue;
          (this.positionVector.set(i(l.x), 0, e),
            this.quaternion.setFromAxisAngle(T.DEFAULT_UP, -l.rot),
            this.scaleVector.set(1, 1, 1),
            this.matrix.compose(
              this.positionVector,
              this.quaternion,
              this.scaleVector,
            ));
          for (let e of r) e.setMatrixAt(o, this.matrix);
          let u = this.trafficLights.get(t);
          if (u) {
            (u.front.setMatrixAt(o, this.matrix),
              u.rear.setMatrixAt(o, this.matrix),
              u.frontGlow.setMatrixAt(o, this.matrix),
              u.rearGlow.setMatrixAt(o, this.matrix));
            let e = ot(this.time, c, (o * 0.37) % 1);
            u.wiper.pivots.forEach((t, n) =>
              u.wipers.setMatrixAt(
                o * 2 + n,
                xt(this.matrix, t, u.wiper.tilt, e, this.wiperTmp),
              ),
            );
          }
          if (f) {
            let e =
                !l.hit && (!!l.sportPush || l.yieldState === `accelerating`),
              t = Gt(this.wingLift.get(l) ?? 0, e, n);
            this.wingLift.set(l, t);
            for (let { mesh: e, strut: n } of f.parts)
              (this.wingPos.copy(f.pivot),
                (this.wingPos.y += t * Ut * (n ? 0.55 : 1)),
                this.wingEuler.set(n ? 0 : t * Wt, 0, 0),
                this.wingQuat.setFromEuler(this.wingEuler),
                this.wingLocal.compose(
                  this.wingPos,
                  this.wingQuat,
                  this.unitScale,
                ),
                this.wingWorld.multiplyMatrices(this.matrix, this.wingLocal),
                e.setMatrixAt(o, this.wingWorld));
          }
          if (d && l.signal !== 0 && Math.floor(l.signalTimer * 2.6) % 2 == 0) {
            let [t, n] = A[l.type];
            (this.positionVector.set(
              i(l.x) + l.signal * (t / 2 - 0.12),
              l.type === `bus` || l.type === `truck` ? 1.1 : 0.82,
              e + n / 2 + 0.03,
            ),
              this.matrix.compose(
                this.positionVector,
                this.quaternion,
                this.scaleVector,
              ),
              d.setMatrixAt(s++, this.matrix));
          }
          o++;
        }
        for (let e of f ? [...r, ...f.parts.map((e) => e.mesh)] : r)
          ((e.count = o),
            (e.visible = o > 0),
            (e.instanceMatrix.needsUpdate = !0));
        let p = this.trafficLights.get(t);
        if (p) {
          let e = at(u);
          ((p.front.material.opacity = e.front),
            (p.rear.material.opacity = e.rear),
            (p.frontGlow.material.opacity = e.glow * (l ? 0.9 : 0.75)),
            (p.rearGlow.material.opacity = e.glow * 0.6));
          for (let e of p.all)
            ((e.count = e === p.wipers ? o * 2 : o),
              (e.instanceMatrix.needsUpdate = !0));
          ((p.front.visible = o > 0),
            (p.wipers.visible = o > 0),
            (p.rear.visible = p.rearGlow.visible = o > 0 && e.rear > 0),
            (p.frontGlow.visible = o > 0 && e.glow > 0));
        }
        d &&
          ((d.count = s),
          (d.visible = s > 0),
          (d.instanceMatrix.needsUpdate = !0));
      }
      if (this.policeCar) {
        let t = e.police,
          n = a(t.y),
          r = e.mode === `police` && t.active && n > -285 && n < G;
        if (((this.policeCar.visible = r), r)) {
          (this.policeCar.position.set(i(t.x), 0, n),
            (this.policeCar.rotation.y = -t.rot));
          let e = (this.time * 2.2) % 1,
            r = (t) =>
              (e > t && e < t + 0.09) || (e > t + 0.15 && e < t + 0.24);
          (this.policeRed &&
            (this.policeRed.emissiveIntensity = r(0) ? 6 : 0.15),
            this.policeBlue &&
              (this.policeBlue.emissiveIntensity = r(0.5) ? 6 : 0.15));
        }
      }
      (this.updateParticles(e, i, a),
        this.updateRain(c, n, e.player.speed, l),
        (this.camX = Y(this.camX, h, 1 - Math.exp(-6 * n))));
      let g = Math.min(1, e.player.speed / 340),
        _ = e.gas && e.player.speed < 345 ? (e.boostActive ? 1 : 0.7) : 0;
      this.camPull = Y(
        this.camPull,
        _,
        1 - Math.exp(-(_ > this.camPull ? 1.6 : 2.4) * n),
      );
      let v =
          this.camView === `cockpit` && this.player
            ? ye[this.playerKey]
            : void 0,
        y = v ? 70 + g * 8 : 60 + g * 12,
        b = v ? 0.03 : 0.1;
      (Math.abs(this.camera.fov - y) > 0.05 || this.camera.near !== b) &&
        ((this.camera.fov = y),
        (this.camera.near = b),
        this.camera.updateProjectionMatrix());
      for (let e of this.cabinOnly) e.visible = !!v;
      let x = e.shake * 0.012,
        S = this.camView === `cockpit` && !v ? `hood` : this.camView,
        C = S === `chase` || S === `cockpit` ? null : Dt[S];
      if (v && this.player) {
        let t = this.player;
        (t.updateMatrixWorld(),
          (this.head = Ze(this.head, {
            rot: e.player.rot,
            speedKmh: e.player.speed,
            steer: e.steer ?? 0,
            braking: e.braking,
            shake: Math.min(1, e.shake),
            dt: n,
          })));
        let r = this.head,
          [i, a, o] = v.eye;
        (this.eyeVector
          .set(i + r.x, a + r.y, o + r.z)
          .applyMatrix4(t.matrixWorld),
          this.lookVector
            .set(i + r.x, a + r.y - (v.drop ?? 0.9), o + r.z - 30)
            .applyMatrix4(t.matrixWorld),
          this.camera.position.copy(this.eyeVector),
          this.camera.up.set(0, 1, 0),
          this.camera.lookAt(this.lookVector),
          this.headEuler.set(r.pitch, r.yaw, this.body.roll * 0.45 + r.roll),
          this.camera.quaternion.multiply(
            this.headQuat.setFromEuler(this.headEuler),
          ));
      } else if (!C)
        (this.camera.position.set(
          this.camX * 0.9 + (Math.random() - 0.5) * x,
          2.05 - g * 0.25 + this.camPull * 0.14 + (Math.random() - 0.5) * x,
          6.6 - g * 0.8 + this.camPull * 0.75,
        ),
          this.camera.lookAt(this.camX * 0.95, 0.85, -16));
      else {
        let e = x * 0.5;
        (this.camera.position.set(
          this.camX + C.pos.dx + (Math.random() - 0.5) * e,
          C.pos.y + (Math.random() - 0.5) * e,
          C.pos.z,
        ),
          this.camera.lookAt(this.camX + C.look.dx, C.look.y, C.look.z));
      }
      (this.overlay &&
        (this.overlay.style.opacity = String(Math.min(0.6, e.flash * 0.6))),
        this.renderer.render(this.scene, this.camera),
        !this.ready &&
          this.player &&
          this.canvas.dataset.modelsReady === `true` &&
          ((this.ready = !0), this.onReady?.()));
    };
    tunnelFactor(e) {
      let t = Pe(e);
      if (t < 1395 || t > 2405) return 0;
      let n = Math.min(1, (t - Se + 5) / 25),
        r = Math.min(1, (Me + 5 - t) / 25);
      return Math.max(0, Math.min(n, r));
    }
    nearest(e, t) {
      let n = e - Pe(e) + t;
      return (n < e - G - 40 && (n += je), -(n - e));
    }
    placeLandmarks(e) {
      let t = Me - Se,
        n = e - Pe(e) + Se;
      n + t < e - G && (n += je);
      let r = -(n - e);
      ((this.tunnel.position.z = r),
        (this.tunnel.visible = r > -320 && r - t < G + 40));
      if (this.waterBridge) {
        let t = e - Pe(e) + WB_START;
        t + WB_LEN < e - G && (t += WB_LOOP);
        let n = e - t,
          r = this.waterBridge;
        ((r.position.z = n), (r.visible = n > -300 && n - WB_LEN < G));
        for (let i of this.oncoming) {
          let a = WB_LEN + 240,
            o = WB_LEN + 120 - ((i.base + i.speed * this.time) % a),
            s = n - o;
          ((i.obj.visible = r.visible && o > 0 && o < WB_LEN && s > -300 && s < G),
            i.obj.position.set(i.lane, 0, s));
        }
      }
      let i = (t, n) => {
        let r = n
          .map((t) => this.nearest(e, t))
          .filter((z) => z > -260 && z < G && !onWaterBridge(e - z))
          .sort((e, t) => t - e);
        t.forEach((e, t) => {
          let n = r[t];
          ((e.visible = n !== void 0), n !== void 0 && (e.position.z = n));
        });
      };
      (i(
        this.bridges,
        Fe.map(([e, t]) => (e + t) / 2),
      ),
        i(this.gantries, Ne),
        i(this.radars, De));
    }
    layoutScenery(e, t) {
      let n = this.matrix,
        r = this.quaternion,
        i = this.scaleVector,
        a = this.positionVector,
        o = (e) => Ce(e) || onWaterBridge(e);
      if (this.buildings && this.rooftops) {
        let s = 0;
        for (
          let t = Math.floor((e - G) / 28);
          t * 28 < e + Zt + 90 && s < 72;
          t++
        )
          for (let c of [-1, 1]) {
            let l = t * 28;
            if (o(l)) continue;
            let u = J(t * 13 + c),
              d = 12 + J(t * 5 + c) * 42,
              f = c * (42 + u * 48),
              p = 12 + J(t * 7) * 9,
              m = 12 + J(t * 8) * 12;
            (a.set(f, 0, -(l - e)),
              i.set(p, d, m),
              r.identity(),
              n.compose(a, r, i),
              this.buildings.setMatrixAt(s, n),
              a.set(f, d + 0.4, -(l - e)),
              i.set(p + 0.4, 0.8, m + 0.4),
              n.compose(a, r, i),
              this.rooftops.setMatrixAt(s, n),
              s++);
          }
        ((this.buildings.count = this.rooftops.count = s),
          (this.buildings.instanceMatrix.needsUpdate =
            this.rooftops.instanceMatrix.needsUpdate =
              !0),
          this.cityMaterial &&
            (this.cityMaterial.emissiveIntensity = t * 0.55));
      }
      let s = 0,
        c = Math.floor((e - G) / 4);
      for (let t = c; s < 159; t++) {
        let r = t * 4;
        if (r > e + 160) break;
        for (let t of [-1, 1])
          (n.makeTranslation(t * 7.55, 0, -(r - e)),
            this.posts.setMatrixAt(s++, n));
      }
      ((this.posts.count = s),
        (this.posts.instanceMatrix.needsUpdate = !0),
        (s = 0));
      let l = Math.floor((e - G) / 7);
      for (let t = l; s < 139; t++) {
        let c = t * 7;
        if (c > e + (this.low ? 120 : Zt)) break;
        for (let l of [-1, 1]) {
          let u = J(t * 2 + +(l > 0));
          if (u < 0.25 || o(c)) continue;
          let d = l * (13 + u * 26),
            f = 0.7 + J(t * 7.3 + l) * 0.9;
          (a.set(d, 0, -(c - e)),
            i.set(f, f * (0.9 + u * 0.5), f),
            r.setFromAxisAngle(T.DEFAULT_UP, u * 6),
            n.compose(a, r, i),
            this.trunks.setMatrixAt(s, n),
            this.crowns.setMatrixAt(s, n),
            s++);
        }
      }
      ((this.trunks.count = this.crowns.count = s),
        (this.trunks.instanceMatrix.needsUpdate =
          this.crowns.instanceMatrix.needsUpdate =
            !0),
        (s = 0));
      let u = Math.floor((e - G) / 45);
      for (let t = u; s < 24; t++) {
        let c = t * 45;
        if (c > e + (this.low ? 120 : Zt)) break;
        if (Ce(c)) continue;
        let l = t % 2 == 0 ? -1 : 1,
          u = l * 8.4;
        (a.set(u, 0, -(c - e)),
          r.setFromAxisAngle(T.DEFAULT_UP, 0),
          i.set(1, 1, 1),
          n.compose(a, r, i),
          this.lampPoles.setMatrixAt(s, n),
          n.makeTranslation(u - l * 0.8, 0, -(c - e)),
          this.lampHeads.setMatrixAt(s, n),
          n.makeTranslation(u - l * 3.2, 0, -(c - e)),
          this.lampPools.setMatrixAt(s, n),
          s++);
      }
      ((this.lampPoles.count = this.lampHeads.count = this.lampPools.count = s),
        (this.lampPoles.instanceMatrix.needsUpdate =
          this.lampHeads.instanceMatrix.needsUpdate =
          this.lampPools.instanceMatrix.needsUpdate =
            !0));
      let d = Math.max(0, (t - 0.25) / 0.75);
      ((this.lampHeadMat.emissiveIntensity = d * 4),
        (this.lampPoolMat.opacity = d * 0.55));
    }
    updateFlames(e, t) {
      let n = 0,
        r = 0,
        i = this.playerKey === `svj`;
      (e.boostActive && !i
        ? ((n = 1), (r = 1.05 + Math.random() * 0.45))
        : e.exhaustFlame > 0
          ? ((n = Math.min(1, e.exhaustFlame / 0.18)),
            (r = 0.9 + Math.random() * 0.7))
          : !e.gas &&
            e.player.speed > 120 &&
            e.phase === `playing` &&
            ((this.popT -= t),
            this.popT <= 0 &&
              ((this.popT = 0.08 + Math.random() * 0.35),
              Math.random() < 0.45 &&
                ((n = 0.55), (r = 0.3 + Math.random() * 0.3)))),
        i && (r *= 0.6),
        (this.flameAmt =
          n > this.flameAmt ? n : this.flameAmt * Math.exp(-14 * t)),
        (this.flameLen = r > 0 ? r : this.flameLen * Math.exp(-8 * t)));
      let a = this.flameAmt > 0.02;
      for (let e of this.flames) {
        if (((e.group.visible = a), !a)) continue;
        let t = 0.75 + Math.random() * 0.5,
          n = Math.max(0.12, this.flameLen * t);
        (e.group.scale.set(1 + this.flameAmt * 0.3, 1 + this.flameAmt * 0.3, n),
          e.glow.scale.set(0.55 * t, 0.55 * t, 0.55 / n));
        for (let n of [e.outer, e.core]) {
          let e = n.uniforms.uTime,
            r = n.uniforms.uIntensity;
          (e && (e.value = this.time),
            r && (r.value = this.flameAmt * t * 1.4));
        }
        e.light.intensity = this.flameAmt * t * 14;
      }
    }
    updateParticles(e, t, n) {
      let r = 0;
      for (let i of e.particles) {
        if (r >= this.sprites.length) break;
        if (i.kind === `flame`) continue;
        let a = this.sprites[r++];
        if (!a) break;
        let o = a.material,
          s = i.life / i.max;
        ((a.visible = !0),
          a.position.set(
            t(i.x),
            i.kind === `rubber`
              ? (i.h ?? 0.02)
              : 0.4 +
                  (i.kind === `smoke`
                    ? s * 2.4
                    : i.kind === `spark`
                      ? 0.4
                      : 0.15),
            n(i.y),
          ));
        let c =
          (i.size / e.ppm) *
          (i.kind === `smoke` ? 2.2 : i.kind === `spark` ? 3 : 1.6);
        (a.scale.setScalar(Math.max(0.05, c)),
          i.kind === `spark`
            ? ((o.map = this.sparkTex),
              (o.blending = 2),
              o.color.setHex(16777215))
            : ((o.map = this.smokeTex),
              (o.blending = 1),
              o.color.setHex(
                i.kind === `spray`
                  ? 14015974
                  : i.dark
                    ? 2763308
                    : i.kind === `debris` || i.kind === `rubber`
                      ? 1118481
                      : 10132126,
              )),
          (o.opacity =
            i.kind === `rubber`
              ? i.alpha * Math.min(1, (1 - s) * 3)
              : i.alpha * (1 - s)));
      }
      for (; r < this.sprites.length; r++) {
        let e = this.sprites[r];
        e && (e.visible = !1);
      }
    }
    updateRain(e, t, n, r) {
      let i = this.rain.material;
      if (
        ((i.opacity = r ? 0 : e * 0.55),
        (this.rain.visible = i.opacity > 0.01),
        !this.rain.visible)
      )
        return;
      this.rain.position.x = this.camX;
      let a = 22 * t,
        o = (n / 3.6) * t,
        s = this.rainPos;
      for (let e = 0; e < s.length / 6; e++) {
        let t = e * 6;
        ((s[t + 1] = (s[t + 1] ?? 0) - a),
          (s[t + 4] = (s[t + 4] ?? 0) - a),
          (s[t + 2] = (s[t + 2] ?? 0) + o),
          (s[t + 5] = (s[t + 5] ?? 0) + o),
          ((s[t + 1] ?? 0) < 0 || (s[t + 2] ?? 0) > 10) &&
            this.resetDrop(e, !1));
      }
      this.rain.geometry.attributes.position.needsUpdate = !0;
    }
    addContactShadow(e, t, n) {
      let r = new S(
        new E(t, n),
        new C({
          map: this.contactTex,
          color: 0,
          transparent: !0,
          opacity: 0.86,
          depthWrite: !1,
        }),
      );
      return (
        (r.rotation.x = -Math.PI / 2),
        (r.position.y = 0.018),
        e.add(r),
        r
      );
    }
    dispose() {
      ((this.disposed = !0),
        this.reflectionMaps?.day.dispose(),
        this.reflectionMaps?.night.dispose(),
        this.reflectionMaps?.tunnel.dispose(),
        this.reflectionMaps?.asphalt.dispose(),
        this.roadDetail?.dispose(),
        this.daySky.dispose(),
        this.contactTex.dispose(),
        this.roadTex.dispose(),
        this.renderer.dispose(),
        this.scene.traverse((e) => {
          e.geometry?.dispose?.();
        }));
    }
  };
export { sn as Scene3D };
