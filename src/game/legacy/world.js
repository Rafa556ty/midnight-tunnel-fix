// @ts-nocheck
/* eslint-disable */
// Ported from the published Supercar Highway Dash build.
function e(e) {
  return e.coarse || (e.touchPoints > 0 && e.width < 1024) ? `touch` : `pc`;
}
function t(e, t) {
  return e === `auto` ? t : e;
}
function n(e) {
  return e.width >= e.height ? `landscape` : `rotate`;
}
function r(e) {
  return {
    width: e.height,
    height: e.width,
    transform: `translateX(${e.width}px) rotate(90deg)`,
  };
}
function i(e, t, n) {
  return { x: t, y: n - e };
}
function a(e, t, n) {
  if (t)
    return {
      x: 0.15,
      z: ((((e % 24) + 24) % 24) / 24 - 0.5) * 2.4,
      strength: 0.55,
    };
  let r = Math.sin(e / 900) * 0.9 + Math.sin(e / 310) * 0.35,
    i = 0.55 + 0.45 * Math.abs(Math.sin(e / 1400));
  return {
    x: Math.sin(r) * i,
    z: Math.cos(r) * i * 0.5,
    strength: 0.75 * (1 - n * 0.85),
  };
}
var o = (2 / 3) * 0.4,
  s = 0.4,
  c = o * 0.6;
o * s;
var l = o / 2;
(l / 3, l / 2);
function u(e, t, n) {
  return e < 2 && (n === null || Math.abs(t - n) >= 350);
}
var d = new Set([
    `mustang-blue`,
    `mustang-black`,
    `bmw-m3`,
    `porsche-gt3`,
    `bugatti-chiron`,
    `ferrari-sf90`,
  ]),
  f = (e) => !!e && d.has(e),
  p = { gain: 40, spread: 55, top: 235 },
  m = {
    "bugatti-chiron": { gain: 60, spread: 80, top: 300 },
    "ferrari-sf90": { gain: 55, spread: 70, top: 290 },
  };
function h(e, t, n, r, i, a = p) {
  let o = t ? n < 0.25 : n < 0.7;
  return o
    ? {
        push: o,
        cruise: Math.min(a.top, e + a.gain + r * a.spread),
        duration: 2.5 + i * 5,
      }
    : { push: o, cruise: e * (0.88 + r * 0.17), duration: 3.5 + i * 7.5 };
}
var g = {
  m5: [1.8, 4.1],
  hatch: [1.8, 4.1],
  sedan: [1.85, 4.7],
  suv: [1.88, 4.65],
  pickup: [1.9, 5.3],
  bus: [2.55, 12],
  truck: [2.55, 19.8],
  "mustang-blue": [1.92, 4.8],
  "mustang-black": [1.92, 4.8],
  "bmw-m3": [1.9, 4.8],
  "porsche-gt3": [1.85, 4.57],
  "bugatti-chiron": [2.04, 4.54],
  "ferrari-sf90": [1.97, 4.71],
};
function _(e, t, n) {
  if (!f(n)) {
    let n = c;
    if (e < n) return t < 0.5 ? `mustang-blue` : `mustang-black`;
    if (e < (n += 0.10666666666666667)) return `porsche-gt3`;
    if (e < (n += 0.13333333333333333)) return `bmw-m3`;
    if (e < (n += 0.044444444444444446)) return `bugatti-chiron`;
    if (e < (n += 0.06666666666666667)) return `ferrari-sf90`;
  }
  let r = [`hatch`, `sedan`, `suv`, `pickup`, `bus`, `truck`];
  return r[Math.min(r.length - 1, Math.floor(t * r.length))] ?? `hatch`;
}
function v(e, t, n, r) {
  return e - (t - n) * r;
}
function y(e, t, n, r, i, a, o, s) {
  let c = r - e,
    l = i * 0.55,
    u = t + (Math.max(-l, Math.min(l, c * 1.7)) - t) * (1 - Math.exp(-3.5 * s)),
    d = e + u * s,
    f = Math.abs(r - d) < i * 0.008 && Math.abs(u) < i * 0.025,
    p = Math.atan2(u, Math.max(1, (a / 3.6) * o));
  return {
    x: f ? r : d,
    vx: f ? 0 : u,
    rot: n + (p - n) * (1 - Math.exp(-6 * s)),
    arrived: f,
  };
}
var b = [75, 115, 155, 195, 235, 275, 312, 352],
  x = b.length,
  S = 1e3,
  C = 9500,
  w = (e, t) => (C * t) / (b[e] ?? b[x - 1]);
function T(e, t, n) {
  let r = Math.max(0, Math.min(x - 1, e));
  for (; r < x - 1 && w(r, t) >= (n ? 9250 : 9500);) r++;
  let i = n ? 5500 : 3500;
  for (; r > 0 && w(r, t) < i && w(r - 1, t) < 8500;) r--;
  return r;
}
var E = 1400,
  D = 2400,
  O = D,
  k = 5e3,
  A = 5800,
  j = [
    [500, 560],
    [1100, 1160],
    [2800, 2860],
    [4100, 4160],
  ],
  M = [300, 850, 1320, 2550, 3700, 4600],
  N = [750, 2050, 3600, 4750],
  P = (e) => ((e % A) + A) % A,
  F = (e) => {
    let t = P(e);
    return t >= 1400 && t < 2400;
  },
  I = (e) => {
    let t = Math.max(0, Math.min(1, e));
    return t * t * (3 - 2 * t);
  };
function L(e) {
  let t = P(e);
  return t < 2400
    ? 0
    : t < 3400
      ? I((t - O) / 1e3)
      : t < 5e3
        ? 1
        : 1 - I((t - k) / 800);
}
function R(e) {
  if (F(e)) return 0;
  let t = P(e);
  return t < 2450 || t > 3350 ? 0 : I(1 - Math.abs(t - 5800 / 2) / (900 / 2));
}
function z(e) {
  let t = P(e);
  return (t >= 1360 && t < 2415) || L(e) > 0.35 || R(e) > 0.4;
}
export {
  i as A,
  _ as C,
  t as D,
  e as E,
  r as O,
  h as S,
  v as T,
  w as _,
  E as a,
  f as b,
  F as c,
  R as d,
  x as f,
  T as g,
  C as h,
  N as i,
  n as j,
  a as k,
  z as l,
  S as m,
  A as n,
  D as o,
  b as p,
  M as r,
  P as s,
  j as t,
  L as u,
  g as v,
  u as w,
  y as x,
  m as y,
};
