import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: isTouch ? 0 : 1, // Don't hijack native momentum scroll on touch devices
    });

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    // Keep healthy lag smoothing so frame drops don't cause stuttering jumps
    gsap.ticker.lagSmoothing(500, 33);

    const handleResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Refresh ScrollTrigger after initial mount
    const timeout = setTimeout(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
