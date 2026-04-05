/**
 * Model picker dropdown rendered via React portal to avoid overflow clipping.
 */

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

export default function ModelSelector({ model, models, open, onToggle, onSelect, btnRef }: {
  model: string;
  models: string[];
  open: boolean;
  onToggle: () => void;
  onSelect: (m: string) => void;
  btnRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const short = model.split(":")[0].slice(0, 16);
  const [dropPos, setDropPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropPos({ top: r.top - 4, right: window.innerWidth - r.right });
    }
  }, [open]);

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button
        ref={btnRef}
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", gap: 3,
          padding: "2px 7px", borderRadius: 5, fontSize: 11,
          background: "transparent", border: "1px solid var(--border-faint)",
          color: "var(--text-dim)", cursor: "pointer", whiteSpace: "nowrap",
          transition: "all 120ms", height: 22,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-faint)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-dim)";
        }}
      >
        {short} <ChevronDown size={9} strokeWidth={2} />
      </button>

      {open && createPortal(
        <div data-model-dropdown style={{
          position: "fixed",
          bottom: `calc(100vh - ${dropPos.top}px)`,
          right: dropPos.right,
          background: "var(--bg-raised)", border: "1px solid var(--border-default)",
          borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          minWidth: 190, maxHeight: 220, overflowY: "auto", zIndex: 999999,
        }}>
          {models.map(m => (
            <button key={m} onClick={() => onSelect(m)} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "7px 12px", fontSize: 11.5,
              background: m === model ? "var(--bg-active)" : "transparent",
              border: "none", color: m === model ? "var(--text-white)" : "var(--text-dim)",
              cursor: "pointer", transition: "all 80ms",
            }}
              onMouseEnter={e => {
                if (m !== model) {
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={e => {
                if (m !== model) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-dim)";
                }
              }}
            >{m}</button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
