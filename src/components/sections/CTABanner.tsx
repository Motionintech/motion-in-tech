import { useCMS } from "@/context/CMSContext";

export function CTABanner() {
  const { data } = useCMS();
  return (
    <section id="contact" className="relative overflow-hidden bg-background py-[80px] md:py-48">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: "var(--color-neon)" }}
      />
      <div className="relative mx-auto w-full max-w-[1500px] px-6 text-center md:px-10">
        <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">— Let&apos;s build —</div>
        <h2 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl md:text-[12vw] md:leading-[0.85]">
          Ready to build something <span className="text-neon" style={{ color: "var(--color-neon)" }}>iconic</span>?
        </h2>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/contact"
            data-cursor="hover"
            className="liquid-fill inline-flex items-center gap-3 border border-neon px-8 py-5 font-mono text-xs uppercase tracking-widest text-neon"
            style={{ borderColor: "var(--color-neon)" }}
          >
            Start a project →
          </a>
          <a
            href={`mailto:${data.contact.email}`}
            data-cursor="hover"
            className="inline-flex items-center gap-3 px-6 py-5 font-mono text-xs uppercase tracking-widest text-foreground/80 hover:text-foreground"
          >
            {data.contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}
