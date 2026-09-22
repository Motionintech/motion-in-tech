import { useEffect, useRef } from "react";
import { useCMS } from "@/context/CMSContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const { data } = useCMS();
  const root = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const shardRef = useRef<HTMLDivElement>(null);
  const cubeWrapRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.4, defaults: { ease: "expo.out" } });
      if (!reduced) {
        tl.from("[data-anim='eyebrow']", { y: 30, opacity: 0, duration: 1 })
          .from("[data-anim='word'] > span", { yPercent: 110, duration: 1.2, stagger: 0.08 }, "-=0.7")
          .from("[data-anim='sub']", { y: 30, opacity: 0, duration: 0.9 }, "-=0.6")
          .from("[data-anim='cta']", { y: 20, opacity: 0, stagger: 0.08, duration: 0.7 }, "-=0.5")
          .from("[data-anim='meta']", { opacity: 0, y: 10, stagger: 0.05, duration: 0.6 }, "-=0.4");
      } else {
        gsap.set("[data-anim]", { opacity: 1, y: 0 });
      }
      if (reduced) return;

      if (orbRef.current) {
        gsap.to(orbRef.current, {
          xPercent: 60, yPercent: 50, scale: 1.4, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
        });
      }
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          xPercent: -60, yPercent: 40, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1.2 },
        });
        gsap.to(ringRef.current, { rotate: 360, duration: 40, ease: "none", repeat: -1 });
      }
      if (shardRef.current) {
        gsap.to(shardRef.current, {
          yPercent: -140, xPercent: 30, rotate: -55, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 },
        });
        gsap.to(shardRef.current, { rotateY: 360, duration: 14, ease: "none", repeat: -1 });
      }

      // Center 3D cube — scroll-driven rotation + parallax
      if (cubeRef.current && cubeWrapRef.current) {
        gsap.to(cubeRef.current, {
          rotateX: 360, rotateY: 540, rotateZ: 90, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
        });
        gsap.to(cubeWrapRef.current, {
          yPercent: 30, scale: 1.15, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1.2 },
        });
        // Ambient float
        gsap.to(cubeRef.current, { y: -16, duration: 3.5, yoyo: true, repeat: -1, ease: "sine.inOut" });

        // Mouse-hover tilt (RAF-throttled and bounded)
        const wrap = cubeWrapRef.current;
        const cube = cubeRef.current;
        let rect = root.current!.getBoundingClientRect();
        const onEnter = () => {
          if (root.current) rect = root.current.getBoundingClientRect();
        };
        let moveRaf = 0;
        const onMove = (e: MouseEvent) => {
          if (moveRaf) return;
          moveRaf = requestAnimationFrame(() => {
            moveRaf = 0;
            const w = rect.width || window.innerWidth;
            const h = rect.height || window.innerHeight;
            const x = (e.clientX - rect.left) / w - 0.5;
            const y = (e.clientY - rect.top) / h - 0.5;
            gsap.to(cube, { rotationY: x * 24, rotationX: -y * 24, duration: 0.6, ease: "power2.out", overwrite: "auto" });
            gsap.to(wrap, { x: x * 25, y: y * 25, duration: 0.7, ease: "power2.out" });
          });
        };
        const onLeave = () => {
          if (moveRaf) {
            cancelAnimationFrame(moveRaf);
            moveRaf = 0;
          }
          gsap.to(cube, { rotationY: 0, rotationX: 0, duration: 0.8, ease: "power2.out" });
          gsap.to(wrap, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
        };
        root.current!.addEventListener("mouseenter", onEnter);
        root.current!.addEventListener("mousemove", onMove, { passive: true });
        root.current!.addEventListener("mouseleave", onLeave);
      }
    }, root);
    return () => ctx.revert();
  }, []);

  const words = data.hero.headline.split(/\s+/);

  return (
    <section ref={root} className="relative min-h-[100svh] w-full overflow-hidden bg-background">
      {/* background */}
      {data.hero.backgroundType === "video" && data.hero.backgroundVideo ? (
        <video
          key={data.hero.backgroundVideo}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
          src={data.hero.backgroundVideo}
        />
      ) : data.hero.backgroundImage ? (
        <img alt="" src={data.hero.backgroundImage} className="absolute inset-0 h-full w-full object-cover opacity-60" />
      ) : null}

      {/* Centered 3D cube — scroll + mouse driven */}
      <div
        ref={cubeWrapRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2 will-change-transform opacity-40 sm:opacity-100"
        style={{ perspective: "1400px" }}
      >
        <div
          ref={cubeRef}
          className="relative h-[200px] w-[200px] md:h-[340px] md:w-[340px] will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          {[
            "translateZ(170px)",
            "rotateY(180deg) translateZ(170px)",
            "rotateY(90deg) translateZ(170px)",
            "rotateY(-90deg) translateZ(170px)",
            "rotateX(90deg) translateZ(170px)",
            "rotateX(-90deg) translateZ(170px)",
          ].map((t, i) => (
            <div
              key={i}
              className="absolute inset-0 border-2 will-change-transform"
              style={{
                transform: t,
                borderColor: "color-mix(in oklab, var(--color-neon) 75%, transparent)",
                background:
                  "linear-gradient(135deg, color-mix(in oklab, var(--color-neon) 12%, transparent), color-mix(in oklab, var(--color-background) 70%, transparent) 70%)",
                boxShadow:
                  "inset 0 0 80px color-mix(in oklab, var(--color-neon) 28%, transparent), 0 0 60px -10px color-mix(in oklab, var(--color-neon) 50%, transparent)",
              }}
            />
          ))}
          {/* Inner core */}
          <div
            className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl pointer-events-none"
            style={{
              background: "radial-gradient(circle, var(--color-neon), transparent 70%)",
              transform: "translate3d(-50%, -50%, 0)",
            }}
          />
        </div>
      </div>

      {/* Scroll-driven moving objects */}
      <div
        ref={orbRef}
        aria-hidden
        className="pointer-events-none absolute left-[-12%] top-[18%] h-[520px] w-[520px] rounded-full blur-3xl will-change-transform"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-neon) 55%, transparent), transparent 65%)",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-[14%] h-[360px] w-[360px] will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border"
            style={{
              borderColor: "color-mix(in oklab, var(--color-neon) 60%, transparent)",
              transform: `scale(${1 - i * 0.18}) rotateX(${i * 30}deg) rotateY(${i * 20}deg)`,
              borderStyle: i % 2 ? "dashed" : "solid",
              boxShadow: "0 0 60px color-mix(in oklab, var(--color-neon) 25%, transparent)",
            }}
          />
        ))}
      </div>
      <div
        ref={shardRef}
        aria-hidden
        className="pointer-events-none absolute bottom-[22%] right-[22%] h-40 w-40 will-change-transform"
        style={{ transformStyle: "preserve-3d", perspective: "800px" }}
      >
        <div
          className="absolute inset-0 rotate-45 border"
          style={{
            borderColor: "color-mix(in oklab, var(--color-neon) 70%, transparent)",
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--color-neon) 18%, transparent), transparent 70%)",
            boxShadow: "inset 0 0 40px color-mix(in oklab, var(--color-neon) 30%, transparent)",
          }}
        />
        <div
          className="absolute inset-4 -rotate-12 border border-foreground/20"
          style={{ transform: "translateZ(40px) rotate(-12deg)" }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />

      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1500px] flex-col justify-end px-5 pb-[100px] pt-28 sm:px-6 md:px-10 md:pb-36 md:pt-32">
        <div data-anim="eyebrow" className="mb-6 flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:mb-8 md:justify-start md:text-[11px]">
          <span className="inline-block h-px w-8 bg-neon md:w-12" style={{ background: "var(--color-neon)" }} />
          A software studio · est. {data.about.founded}
        </div>

        <h1 className="text-center font-display text-[clamp(2.75rem,11vw,11rem)] font-bold leading-[0.88] tracking-[-0.04em] text-balance md:text-left md:leading-[0.85]">
          {words.map((w, i) => (
            <span key={i} data-anim="word" className="reveal-word mr-[0.18em]">
              <span>
                {w.includes(".") || w.includes("?") || w.includes("!") ? (
                  <>
                    {w.replace(/[.!?]/g, "")}
                    <span className="text-neon" style={{ color: "var(--color-neon)" }}>{w.match(/[.!?]/g)?.[0]}</span>
                  </>
                ) : (
                  w
                )}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col items-center gap-6 text-center md:mt-12 md:flex-row md:items-end md:justify-between md:gap-8 md:text-left">
          <p data-anim="sub" className="mx-auto max-w-md text-balance text-base text-muted-foreground sm:text-lg md:mx-0 md:text-xl">
            {data.hero.subHeadline}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <a
              data-anim="cta"
              data-cursor="hover"
              href={data.hero.cta1.link}
              className="liquid-fill group inline-flex items-center gap-3 border border-neon px-5 py-3.5 font-mono text-[10px] uppercase tracking-widest text-neon sm:px-7 sm:py-4 sm:text-[11px]"
              style={{ borderColor: "var(--color-neon)" }}
            >
              {data.hero.cta1.label}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              data-anim="cta"
              data-cursor="hover"
              href={data.hero.cta2.link}
              className="inline-flex items-center gap-3 border border-foreground/20 px-5 py-3.5 font-mono text-[10px] uppercase tracking-widest transition-colors hover:border-foreground sm:px-7 sm:py-4 sm:text-[11px]"
            >
              {data.hero.cta2.label}
            </a>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:mt-16">
          <span data-anim="meta">Scroll</span>
          <span data-anim="meta" className="hidden md:inline">Berlin · Lisbon · NYC</span>
          <span data-anim="meta">{new Date().getFullYear()} ©</span>
        </div>
      </div>

      {/* Marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden border-t border-border bg-background/60 py-3 backdrop-blur md:py-4">
        <div className="marquee-track whitespace-nowrap font-display text-xl tracking-tight sm:text-2xl md:text-3xl">
          {[...data.hero.marquee, ...data.hero.marquee].map((m, i) => (
            <span key={i} className="inline-flex items-center gap-16">
              {m}
              <span className="text-neon" style={{ color: "var(--color-neon)" }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
