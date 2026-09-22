import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mx = -100, my = -100, rx = -100, ry = -100;
    let isVisible = false;
    let currentHover = false;
    let currentLabel = "";
    let raf = 0;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const labelEl = labelRef.current;

    if (!dot || !ring) return;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      // Check cursor target only if target changed
      const t = e.target as HTMLElement | null;
      const cursorEl = t?.closest?.("[data-cursor]") as HTMLElement | null;
      const nextHover = !!cursorEl;
      let nextLabel = "";
      if (cursorEl) {
        const tag = cursorEl.getAttribute("data-cursor");
        nextLabel = tag === "view" ? "VIEW" : tag === "explore" ? "EXPLORE" : "";
      }

      if (nextHover !== currentHover || nextLabel !== currentLabel) {
        currentHover = nextHover;
        currentLabel = nextLabel;
        ring.style.backgroundColor = currentLabel ? "var(--color-neon)" : "transparent";

        if (labelEl) {
          labelEl.textContent = currentLabel;
          labelEl.style.display = currentLabel ? "inline-block" : "none";
        }
      }
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    let ringScale = 1;
    const tick = () => {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;

      // Smooth scale interpolation (no layout reflow!)
      const targetScale = currentHover ? 1.8 : 1;
      ringScale += (targetScale - ringScale) * 0.2;

      dot.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
      ring.style.transform = `translate3d(${rx - 20}px, ${ry - 20}px, 0) scale(${ringScale})`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full opacity-0 will-change-transform"
        style={{
          background: "var(--color-neon)",
          boxShadow: "0 0 8px var(--color-neon)",
          transition: "opacity 0.2s ease",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex h-10 w-10 items-center justify-center rounded-full border opacity-0 will-change-transform"
        style={{
          borderColor: "var(--color-neon)",
          transition: "background-color 0.2s ease, opacity 0.2s ease",
        }}
      >
        <span
          ref={labelRef}
          style={{ display: "none" }}
          className="font-mono text-[9px] font-semibold tracking-widest text-background"
        />
      </div>
    </>
  );
}
