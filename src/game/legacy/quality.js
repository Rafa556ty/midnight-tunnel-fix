// @ts-nocheck
/* eslint-disable */
// Ported from the published Supercar Highway Dash build.
function e(e) {
  return (
    /SM-A115|Galaxy A11/i.test(e.userAgent) ||
    (e.touch && (e.memory === void 0 || e.memory <= 4 || e.cores <= 8))
  );
}
function t(e, t) {
  return Math.min(Math.max(1, e || 1), t ? 2 : 1.5);
}
function n(e) {
  return Math.min(1, Math.max(0.6, 1 / e));
}
var r = class {
  floor;
  scale = 1;
  constructor(e = 0.8) {
    this.floor = e;
  }
  elapsed = 0;
  frames = 0;
  stable = 0;
  sample(e, t = !1) {
    if (
      t ||
      e <= 0 ||
      e > 0.25 ||
      ((this.elapsed += e), this.frames++, this.elapsed < 3)
    )
      return !1;
    let n = this.elapsed / this.frames;
    ((this.elapsed = 0), (this.frames = 0));
    let r = this.scale;
    return (
      n > 1 / 26
        ? ((this.scale = Math.max(
            this.floor,
            Math.round((this.scale - 0.1) * 100) / 100,
          )),
          (this.stable = 0))
        : n < 1 / 50
          ? (this.stable++,
            this.stable >= 5 &&
              ((this.scale = Math.min(
                1,
                Math.round((this.scale + 0.1) * 100) / 100,
              )),
              (this.stable = 0)))
          : (this.stable = 0),
      r !== this.scale
    );
  }
};
export { e as i, t as n, n as r, r as t };
