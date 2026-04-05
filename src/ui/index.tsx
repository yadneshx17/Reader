/**
 * Shared primitive UI components used across the app.
 * Keep this file to stateless, style-only building blocks only.
 */

import type { CSSProperties, ReactNode } from "react";

// ── Toggle switch ─────────────────────────────────────────────────────────────

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 40, height: 22, borderRadius: 11, border: "none",
        background: value ? "#4A9B7F" : "var(--bg-active)",
        position: "relative", cursor: "pointer", flexShrink: 0,
        transition: "background 200ms var(--ease-out)",
      }}
    >
      <div style={{
        position: "absolute", top: 2, left: value ? 20 : 2,
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        transition: "left 200ms var(--ease-out)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      }} />
    </button>
  );
}

// ── Segmented control ─────────────────────────────────────────────────────────

export function SegmentedControl<T extends string>({ options, value, onChange }: {
  options: { value: T; label: string; icon?: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 2, background: "var(--bg-active)", borderRadius: 8, padding: 2 }}>
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500,
          background: value === opt.value ? "var(--bg-raised)" : "transparent",
          border: value === opt.value ? "1px solid var(--border-soft)" : "1px solid transparent",
          color: value === opt.value ? "var(--text-white)" : "var(--text-dim)",
          cursor: "pointer", transition: "all var(--duration-fast) var(--ease-out)",
          boxShadow: value === opt.value ? "0 1px 4px rgba(0,0,0,0.25)" : "none",
        }}>
          {opt.icon}{opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Info box ──────────────────────────────────────────────────────────────────

export function InfoBox({ icon, accent, children }: { icon: ReactNode; accent?: string; children: ReactNode }) {
  return (
    <div style={{
      display: "flex", gap: 11, alignItems: "flex-start",
      padding: "12px 14px", marginBottom: 8,
      background: accent ? `${accent}0c` : "var(--bg-raised)",
      border: `1px solid ${accent ? `${accent}25` : "var(--border-faint)"}`,
      borderRadius: 9,
    }}>
      <div style={{ flexShrink: 0, paddingTop: 1 }}>{icon}</div>
      <p style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.65, margin: 0 }}>{children}</p>
    </div>
  );
}

// ── Link button ───────────────────────────────────────────────────────────────

export function LinkBtn({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "5px 11px", borderRadius: 6,
        background: "var(--bg-raised)", border: "1px solid var(--border-faint)",
        color: "var(--text-dim)", fontSize: 12, fontWeight: 500,
        transition: "all var(--duration-fast) var(--ease-out)",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--bg-hover)";
        el.style.borderColor = "var(--border-default)";
        el.style.color = "var(--text-primary)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--bg-raised)";
        el.style.borderColor = "var(--border-faint)";
        el.style.color = "var(--text-dim)";
      }}
    >
      {children}
    </button>
  );
}

// ── Icon button (small square) ────────────────────────────────────────────────

export const iconBtnStyle: CSSProperties = {
  width: 26, height: 26, borderRadius: 6, flexShrink: 0,
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "transparent", border: "1px solid transparent",
  color: "var(--text-muted)", cursor: "pointer", transition: "all 120ms",
};

export function IconBtn({ onClick, title, children, style }: {
  onClick: () => void; title?: string; children: ReactNode; style?: CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{ ...iconBtnStyle, ...style }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--bg-hover)";
        el.style.borderColor = "var(--border-faint)";
        el.style.color = "var(--text-primary)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "transparent";
        el.style.borderColor = "transparent";
        el.style.color = "var(--text-muted)";
      }}
    >
      {children}
    </button>
  );
}

// ── Pill button (text + icon) ─────────────────────────────────────────────────

export const pillBtnStyle: CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 5,
  padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500,
  background: "var(--bg-active)", border: "1px solid var(--border-faint)",
  color: "var(--text-dim)", cursor: "pointer", transition: "all 120ms",
};

// ── Hover button: stateless overlay-style button ──────────────────────────────

export function HoverBtn({
  onClick, active = false, children, style, title,
}: {
  onClick: () => void; active?: boolean; children: ReactNode;
  style?: CSSProperties; title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        background: active ? "var(--bg-active)" : "var(--bg-raised)",
        border: `1px solid ${active ? "var(--border-default)" : "var(--border-faint)"}`,
        color: active ? "var(--text-white)" : "var(--text-dim)",
        cursor: "pointer",
        transition: "all var(--duration-fast) var(--ease-out)",
        ...style,
      }}
      onMouseEnter={e => {
        if (active) return;
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--bg-hover)";
        el.style.borderColor = "var(--border-default)";
        el.style.color = "var(--text-primary)";
      }}
      onMouseLeave={e => {
        if (active) return;
        const el = e.currentTarget as HTMLElement;
        el.style.background = "var(--bg-raised)";
        el.style.borderColor = "var(--border-faint)";
        el.style.color = "var(--text-dim)";
      }}
    >
      {children}
    </button>
  );
}
