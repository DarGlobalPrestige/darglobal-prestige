"use client";

import { useState, useRef, useEffect } from "react";

export function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const ref = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !ref.current || !tooltipRef.current) return;
    const rect = ref.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    setPosition(spaceAbove > spaceBelow ? "top" : "bottom");
  }, [visible]);

  return (
    <div ref={ref} className="relative inline-flex" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 max-w-xs rounded-xl border border-[var(--accent)]/20 bg-white px-4 py-3 text-sm text-[var(--charcoal)] shadow-colored animate-tooltip-in ${
            position === "top" ? "bottom-full left-1/2 -translate-x-1/2 mb-2" : "top-full left-1/2 -translate-x-1/2 mt-2"
          }`}
        >
          <p className="leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
}
