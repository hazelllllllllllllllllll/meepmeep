import { DEV, getOwner, onCleanup, createSignal, untrack, batch } from 'solid-js';
import { isServer as isServer$1 } from 'solid-js/web';

// src/index.ts
var noop = () => void 0;
var isServer = isServer$1;
var isClient = !isServer;
var isDev = DEV && isClient;
var isProd = !isDev;
var ofClass = (v, c) => v instanceof c || v && v.constructor === c;
function isObject(value) {
  return value !== null && (typeof value === "object" || typeof value === "function");
}
var compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
var arrayEquals = (a, b) => a === b || a.length === b.length && a.every((e, i) => e === b[i]);
function chain(callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function")
        callback(...args);
    }
  };
}
var clamp = (n, min, max) => Math.min(Math.max(n, min), max);
var access = (v) => typeof v === "function" && !v.length ? v() : v;
var asArray = (value) => Array.isArray(value) ? value : [value];
var accessArray = (list) => list.map((v) => access(v));
var withAccess = (value, fn) => {
  const _value = access(value);
  typeof _value !== "undefined" && _value !== null && fn(_value);
};
var asAccessor = (v) => typeof v === "function" ? v : () => v;
function accessWith(valueOrFn, ...args) {
  return typeof valueOrFn === "function" ? valueOrFn(...args) : valueOrFn;
}
var entries = Object.entries;
var keys = Object.keys;
var onRootCleanup = (fn) => getOwner() ? onCleanup(fn) : fn;
var createCallbackStack = () => {
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
    const signal = createSignal(copy[key], {
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
  for (const key of keys(init)) {
    store[key] = void 0;
    Object.defineProperty(store, key, {
      get: getValue.bind(void 0, key)
    });
  }
  const setter = (a, b) => {
    if (isObject(a))
      untrack(() => {
        batch(() => {
          for (const [key, value] of entries(accessWith(a, store)))
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
var forEachEntry = (obj, fn) => Object.entries(obj).forEach(([key, value]) => fn(key, value));

export { access, accessArray, accessWith, arrayEquals, asAccessor, asArray, chain, clamp, compare, createCallbackStack, createMicrotask, createProxy, createStaticStore, entries, forEachEntry, handleDiffArray, isClient, isDev, isObject, isProd, isServer, keys, noop, ofClass, onRootCleanup, withAccess };
