import { useEffect, useMemo, useRef } from "react";
import { useCMS } from "@/context/CMSContext";
import { LocationWithFlag } from "@/components/common/LocationWithFlag";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutStrip() {
  const { data } = useCMS();
  const root = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);

  // Pre-split into characters preserving spaces
  const words = useMemo(() => data.about.story.split(/(\s+)/), [data.about.story]);

  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      // Character-by-character typing scroll-reveal
      const els = headlineRef.current?.querySelectorAll<HTMLElement>("[data-char]");
      if (els && els.length) {
        gsap.set(els, { opacity: 0.08, y: 0 });
        gsap.to(els, {
          opacity: 1,
          stagger: { each: 0.015, from: "start" },
          ease: "none",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%",
            end: "bottom 40%",
            scrub: 0.6,
          },
        });
      }

      // 3D cube rotation on scroll
      if (cubeRef.current) {
        gsap.to(cubeRef.current, {
          rotateX: 360,
          rotateY: 540,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, root);
    return () => ctx.revert();
  }, [words.length]);

  return (
    <section id="about" ref={root} className="relative overflow-hidden bg-background py-32">
      {/* Floating 3D wireframe cube */}
      <div className="pointer-events-none absolute right-[-140px] top-20 hidden xl:block" style={{ perspective: "1000px" }}>
        <div
          ref={cubeRef}
          className="relative h-64 w-64"
          style={{ transformStyle: "preserve-3d" }}
        >
          {[
            { t: "translateZ(128px)" },
            { t: "rotateY(180deg) translateZ(128px)" },
            { t: "rotateY(90deg) translateZ(128px)" },
            { t: "rotateY(-90deg) translateZ(128px)" },
            { t: "rotateX(90deg) translateZ(128px)" },
            { t: "rotateX(-90deg) translateZ(128px)" },
          ].map((f, i) => (
            <div
              key={i}
              className="absolute inset-0 border"
              style={{
                transform: f.t,
                borderColor: "color-mix(in oklab, var(--color-neon) 60%, transparent)",
                background:
                  "linear-gradient(135deg, color-mix(in oklab, var(--color-neon) 8%, transparent), transparent 60%)",
                boxShadow: "inset 0 0 60px color-mix(in oklab, var(--color-neon) 20%, transparent)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1500px] px-6 md:px-10">
        <div className="mb-12 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="inline-block h-px w-12 bg-neon" style={{ background: "var(--color-neon)" }} />
          05 — The Studio
        </div>
        <h2
          ref={headlineRef}
          className="max-w-[min(72rem,calc(100%-2rem))] pr-4 font-display text-4xl font-medium leading-[1.15] tracking-tight text-balance break-words md:text-5xl lg:text-6xl xl:max-w-4xl"
        >
          {words.map((w, i) =>
            /^\s+$/.test(w) ? (
              <span key={i}> </span>
            ) : (
              <span key={i} data-char className="inline-block">
                {w}
              </span>
            )
          )}
          <span
            aria-hidden
            className="ml-1 inline-block h-[0.9em] w-[0.08em] translate-y-[0.1em] animate-pulse bg-neon"
            style={{ background: "var(--color-neon)" }}
          />
        </h2>

        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-8 md:grid-cols-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Founded</div>
            <div className="mt-2 font-display text-3xl">{data.about.founded}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Studios</div>
            <div className="mt-2 font-display text-xl leading-tight">
              <LocationWithFlag text={data.about.headquarters} flagClassName="h-3.5 w-5" />
            </div>
          </div>
          <div className="col-span-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Mission</div>
            <div className="mt-2 font-display text-xl leading-snug">{data.about.mission}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
