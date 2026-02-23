"use client";

import { useRef, useEffect } from "react";

export function BlobBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className="blob blob-gold blob-animate-1"
        style={{
          width: "min(50vw, 600px)",
          height: "min(50vw, 600px)",
          top: "-10%",
          right: "-5%",
        }}
      />
      <div
        className="blob blob-cream blob-animate-2"
        style={{
          width: "min(40vw, 450px)",
          height: "min(40vw, 450px)",
          bottom: "-15%",
          left: "-8%",
        }}
      />
      <div
        className="blob blob-charcoal blob-animate-3"
        style={{
          width: "min(35vw, 400px)",
          height: "min(35vw, 400px)",
          top: "40%",
          left: "30%",
        }}
      />
    </div>
  );
}
