'use strict';

var solidJs = require('solid-js');
var web = require('solid-js/web');

// src/index.ts
exports.noop = () => void 0;
exports.isServer = web.isServer;
exports.isClient = !exports.isServer;
exports.isDev = solidJs.DEV && exports.isClient;
exports.isProd = !exports.isDev;
exports.ofClass = (v, c) => v instanceof c || v && v.constructor === c;
function isObject(value) {
  return value !== null && (typeof value === "object" || typeof value === "function");
}
exports.compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
exports.arrayEquals = (a, b) => a === b || a.length === b.length && a.every((e, i) => e === b[i]);
function chain(callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function")
        callback(...args);
    }
  };
}
exports.clamp = (n, min, max) => Math.min(Math.max(n, min), max);
exports.access = (v) => typeof v === "function" && !v.length ? v() : v;
exports.asArray = (value) => Array.isArray(value) ? value : [value];
exports.accessArray = (list) => list.map((v) => exports.access(v));
exports.withAccess = (value, fn) => {
  const _value = exports.access(value);
  typeof _value !== "undefined" && _value !== null && fn(_value);
};
exports.asAccessor = (v) => typeof v === "function" ? v : () => v;
function accessWith(valueOrFn, ...args) {
  return typeof valueOrFn === "function" ? valueOrFn(...args) : valueOrFn;
}
exports.entries = Object.entries;
exports.keys = Object.keys;
exports.onRootCleanup = (fn) => solidJs.getOwner() ? solidJs.onCleanup(fn) : fn;
exports.createCallbackStack = () => {
  let stack = [];
  const clear = () => stack = [];
  return {
    push: (...callbacks) => stack.push(...callbacks),
    execute(arg0, arg1, arg2, arg3) {
      stack.forEach((cb) => cb(arg0, arg1, arg2, arg3));
      clear();
    },
    clear
  };
};
function createMicrotask(fn) {
  let calls = 0;
  let args;
  return (...a) => {
    args = a, calls++;
    queueMicrotask(() => --calls === 0 && fn(...args));
  };
}
function createProxy(traps) {
  return new Proxy(
    {},
    {
      get: (_, k) => traps.get(k),
      set: (_, k, v) => {
        traps.set?.(k, v);
        return false;
      }
    }
  );
}
function createStaticStore(init) {
  const copy = { ...init };
  const store = {};
  const cache = /* @__PURE__ */ new Map();
  const getValue = (key) => {
    const saved = cache.get(key);
    if (saved)
      return saved[0]();
    const signal = solidJs.createSignal(copy[key], {
      name: typeof key === "string" ? key : void 0
    });
    cache.set(key, signal);
    delete copy[key];
    return signal[0]();
  };
  const setValue = (key, value) => {
    const saved = cache.get(key);
    if (saved)
      return saved[1](value);
    if (key in copy)
      copy[key] = accessWith(value, [copy[key]]);
  };
  for (const key of exports.keys(init)) {
    store[key] = void 0;
    Object.defineProperty(store, key, {
      get: getValue.bind(void 0, key)
    });
  }
  const setter = (a, b) => {
    if (isObject(a))
      solidJs.untrack(() => {
        solidJs.batch(() => {
          for (const [key, value] of exports.entries(accessWith(a, store)))
            setValue(key, () => value);
        });
      });
    else
      setValue(a, b);
    return store;
  };
  return [store, setter];
}
function handleDiffArray(current, prev, handleAdded, handleRemoved) {
  const currLength = current.length;
  const prevLength = prev.length;
  let i = 0;
  if (!prevLength) {
    for (; i < currLength; i++)
      handleAdded(current[i]);
    return;
  }
  if (!currLength) {
    for (; i < prevLength; i++)
      handleRemoved(prev[i]);
    return;
  }
  for (; i < prevLength; i++) {
    if (prev[i] !== current[i])
      break;
  }
  let prevEl;
  let currEl;
  prev = prev.slice(i);
  current = current.slice(i);
  for (prevEl of prev) {
    if (!current.includes(prevEl))
      handleRemoved(prevEl);
  }
  for (currEl of current) {
    if (!prev.includes(currEl))
      handleAdded(currEl);
  }
}
exports.forEachEntry = (obj, fn) => Object.entries(obj).forEach(([key, value]) => fn(key, value));

exports.accessWith = accessWith;
exports.chain = chain;
exports.createMicrotask = createMicrotask;
exports.createProxy = createProxy;
exports.createStaticStore = createStaticStore;
exports.handleDiffArray = handleDiffArray;
exports.isObject = isObject;
