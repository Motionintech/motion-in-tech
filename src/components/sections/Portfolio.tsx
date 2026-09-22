import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useCMS } from "@/context/CMSContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Portfolio() {
  const { data } = useCMS();
  const root = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const torusRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const projects = data.projects.filter((p) => p.visible);

  useEffect(() => {
    if (!root.current || !trackRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");

      // Horizontal pin scroll
      const totalScroll = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -totalScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${totalScroll() + window.innerHeight}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      // Subtle image parallax per card (lightweight GPU transform)
      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>("[data-img]");
        if (img) {
          gsap.to(img, {
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: 0.5,
            },
          });
        }
      });

      // Marquee infinite drift
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 35,
          repeat: -1,
        });
      }

      // 3D torus & ring float (GPU-friendly)
      if (torusRef.current) {
        gsap.to(torusRef.current, {
          rotateY: 360,
          ease: "none",
          duration: 25,
          repeat: -1,
        });
      }
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          rotate: 360,
          ease: "none",
          duration: 40,
          repeat: -1,
        });
      }
    }, root);
    return () => ctx.revert();
  }, [projects.length]);

  return (
    <section id="work" ref={root} className="relative overflow-hidden bg-background py-[80px] md:h-screen md:py-0">
      {/* Background grid + radial */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 30%, color-mix(in oklab, var(--color-neon) 12%, transparent), transparent 60%)" }} />

      {/* Floating 3D torus (Lightweight CSS) */}
      <div className="pointer-events-none absolute right-[6%] top-[14%] hidden md:block" style={{ perspective: 1000 }}>
        <div ref={torusRef} className="relative h-64 w-64 will-change-transform" style={{ transformStyle: "preserve-3d" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="absolute inset-0 rounded-full border will-change-transform"
              style={{
                borderColor: "color-mix(in oklab, var(--color-neon) 35%, transparent)",
                transform: `rotateY(${i * 30}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating concentric ring */}
      <div ref={ringRef} className="pointer-events-none absolute -left-32 bottom-[8%] h-[420px] w-[420px]">
        {[0.4, 0.6, 0.8, 1].map((s, i) => (
          <div key={i} className="absolute inset-0 rounded-full border"
            style={{
              transform: `scale(${s})`,
              borderColor: i === 3 ? "color-mix(in oklab, var(--color-neon) 60%, transparent)" : "color-mix(in oklab, var(--color-foreground) 12%, transparent)",
              borderStyle: i % 2 ? "dashed" : "solid",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-20 mx-auto w-full max-w-[1500px] px-6 text-center md:absolute md:left-0 md:right-0 md:top-0 md:px-10 md:pt-14 md:text-left">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground md:justify-start">
              <span className="inline-block h-px w-12 bg-neon" style={{ background: "var(--color-neon)" }} />
              03 — Selected Work
            </div>
            <h2 className="font-display text-4xl font-bold leading-none tracking-tighter sm:text-5xl md:text-6xl">
              Recent projects<span style={{ color: "var(--color-neon)" }}>.</span>
            </h2>
          </div>
          <div className="hidden font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground md:block">
            <span className="text-foreground">{String(active + 1).padStart(2, "0")}</span> / {String(projects.length).padStart(2, "0")}
            <span className="ml-4">Scroll →</span>
          </div>
        </div>
      </div>

      {/* Card track — horizontal pin on desktop, vertical stack on mobile */}
      <div className="relative mt-10 px-6 md:absolute md:inset-x-0 md:bottom-20 md:top-64 md:mt-0 md:flex md:items-center md:px-0" style={{ perspective: 1600 }}>
        <div ref={trackRef} className="flex flex-col gap-6 md:h-full md:flex-row md:items-center md:gap-8 md:pl-[10vw] md:pr-[10vw]" style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
          {projects.map((p, i) => (
            <Link
              key={p.id}
              to="/work/$projectId"
              params={{ projectId: p.id }}
              data-card
              data-cursor="view"
              className="group relative aspect-[4/5] w-full shrink-0 overflow-hidden border border-border bg-elevated md:aspect-auto md:h-full md:max-h-[560px] md:w-[52vw] lg:w-[44vw] block"
              style={{ background: "var(--color-elevated)", transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <img data-img src={p.image} alt={p.title} className="h-full w-full object-cover will-change-transform" />
              </div>
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, color-mix(in oklab, var(--color-background) 85%, transparent) 100%)" }} />

              {/* Corner brackets */}
              <span className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l border-t border-neon" style={{ borderColor: "var(--color-neon)" }} />
              <span className="pointer-events-none absolute right-3 top-3 h-5 w-5 border-r border-t border-neon" style={{ borderColor: "var(--color-neon)" }} />
              <span className="pointer-events-none absolute left-3 bottom-3 h-5 w-5 border-l border-b border-neon" style={{ borderColor: "var(--color-neon)" }} />
              <span className="pointer-events-none absolute right-3 bottom-3 h-5 w-5 border-r border-b border-neon" style={{ borderColor: "var(--color-neon)" }} />

              <div className="absolute left-6 top-6 overflow-hidden">
                <div data-num className="font-mono text-[11px] uppercase tracking-[0.3em] text-neon" style={{ color: "var(--color-neon)" }}>
                  {String(i + 1).padStart(2, "0")} — {p.category}
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <div className="overflow-hidden">
                  <h3 data-title className="font-display text-4xl font-bold leading-[0.95] tracking-tighter sm:text-5xl md:text-7xl">
                    {p.title}
                  </h3>
                </div>
                <p className="mt-4 max-w-md text-sm text-foreground/80 md:text-base">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="border border-border bg-background/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}

          {/* Tail card: archive CTA */}
          <Link
            to="/work"
            data-card
            data-cursor="hover"
            className="relative flex aspect-[4/5] w-full shrink-0 flex-col items-start justify-end border border-dashed border-neon p-8 md:aspect-auto md:h-full md:max-h-[560px] md:w-[36vw] md:p-10 block"
            style={{ borderColor: "var(--color-neon)", transformStyle: "preserve-3d" }}
          >
            <div data-num className="font-mono text-[11px] uppercase tracking-[0.3em] text-neon" style={{ color: "var(--color-neon)" }}>
              ∞ — Archive
            </div>
            <h3 data-title className="mt-4 font-display text-4xl font-bold leading-[0.9] tracking-tighter sm:text-5xl md:text-7xl">
              View<br/>full<br/>archive →
            </h3>
          </Link>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="relative z-20 mt-10 overflow-hidden border-t border-border bg-background/70 py-4 backdrop-blur md:absolute md:inset-x-0 md:bottom-0 md:mt-0">
        <div ref={marqueeRef} className="flex whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 items-center gap-10 px-10 font-display text-2xl font-bold tracking-tight md:text-3xl">
              {projects.map((p) => (
                <span key={p.id + k} className="flex items-center gap-10">
                  <span>{p.title}</span>
                  <span className="text-neon" style={{ color: "var(--color-neon)" }}>✦</span>
                  <span className="text-muted-foreground">{p.category}</span>
                  <span className="text-neon" style={{ color: "var(--color-neon)" }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
