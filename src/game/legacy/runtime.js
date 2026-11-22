// @ts-nocheck
// Stand-ins for the helpers the published bundle imported from its entry chunk.
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as JSXRuntime from "react/jsx-runtime";

const withDefault = (m) => (m && m.default ? m : { ...m, default: m });
// __toESM interop: the bundle wraps CommonJS factories with this.
export const i = (m) => withDefault(m);
// jsx-runtime factory
export const n = () => JSXRuntime;
// react factory
export const r = () => React;
// vite preload helper: just run the dynamic import.
export const t = (load) => load();
export { ReactDOM };
