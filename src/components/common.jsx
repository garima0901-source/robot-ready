import { useEffect, useState } from "react";
import { SOURCES } from "../data/sources.js";

const ORDER = Object.keys(SOURCES);

export function Cite({ ids }) {
  return (
    <span className="cite">
      {ids.map((id) => (
        <a key={id} href={`#src-${id}`} title={SOURCES[id].short}>
          [{ORDER.indexOf(id) + 1}]
        </a>
      ))}
    </span>
  );
}

// Per-viewer convenience only: answers survive a reload. Everything works without it.
export function useLocal(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable */
    }
  }, [key, value]);
  return [value, setValue];
}

export function Section({ id, eyebrow, title, lede, children }) {
  return (
    <section id={id} className="section">
      <div className="wrap">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </section>
  );
}

export const eur = (n, digits = 0) =>
  n === null || !Number.isFinite(n)
    ? "—"
    : new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: digits }).format(n);

export const num = (n, digits = 1) =>
  n === null || !Number.isFinite(n)
    ? "—"
    : new Intl.NumberFormat("en-IE", { maximumFractionDigits: digits }).format(n);
