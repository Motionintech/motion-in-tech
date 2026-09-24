import { createFileRoute } from "@tanstack/react-router";
import { useCMS } from "@/context/CMSContext";
import { PageHero } from "@/components/layout/PageHero";
import { Stats } from "@/components/sections/Stats";
import { CTABanner } from "@/components/sections/CTABanner";
import { LocationWithFlag } from "@/components/common/LocationWithFlag";
import teamAris from "@/assets/team-aris.jpg";
import teamLina from "@/assets/team-lina.jpg";
import teamMarcus from "@/assets/team-marcus.jpg";

const TEAM_FALLBACKS = [teamAris, teamLina, teamMarcus];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Motion In Tech" },
      { name: "description", content: "Motion In Tech is a studio engineered like a product — designers and engineers building the most important digital products on earth." },
      { property: "og:title", content: "About — Motion In Tech" },
      { property: "og:description", content: "A studio engineered like a product." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useCMS();
  return (
    <main>
      <PageHero eyebrow="06 — About" title="A studio" accent="of craft." subtitle={data.about.tagline} />

      <section className="relative bg-background py-[80px] md:py-24">
        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-12 px-6 md:grid-cols-12 md:px-10">
          <div className="text-center md:col-span-7 md:text-left">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Our story</div>
            <p className="font-display text-2xl leading-relaxed text-foreground md:text-3xl">{data.about.story}</p>
            <p className="mx-auto mt-8 max-w-xl text-muted-foreground md:mx-0">
              {data.about.mission}
            </p>
          </div>
          <aside className="space-y-8 text-center md:col-span-4 md:col-start-9 md:text-left">
            <div className="border-t border-border pt-6">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Founded</div>
              <div className="mt-2 font-display text-3xl font-bold">{data.about.founded}</div>
            </div>
            <div className="border-t border-border pt-6">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Headquarters</div>
              <div className="mt-2 font-display text-xl">
                <LocationWithFlag text={data.about.headquarters} flagClassName="h-4 w-6" />
              </div>
            </div>
            <div className="border-t border-border pt-6">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Disciplines</div>
              <div className="mt-2 font-display text-xl">{data.services.filter((s) => s.visible).length} core practices</div>
            </div>
          </aside>
        </div>
      </section>

      <Stats />

      <section className="relative bg-background py-[80px] md:py-32">
        <div className="mx-auto w-full max-w-[1500px] px-6 md:px-10">
          <div className="mb-12 flex items-center justify-center text-center md:mb-16 md:justify-start md:text-left">
            <div>
              <div className="mb-4 flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground md:justify-start">
                <span className="inline-block h-px w-12 bg-neon" style={{ background: "var(--color-neon)" }} />
                The team
              </div>
              <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-7xl">
                People behind it<span style={{ color: "var(--color-neon)" }}>.</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {data.team.map((m, i) => {
              const src = m.photo && !m.photo.includes("pravatar") ? m.photo : (TEAM_FALLBACKS[i] ?? teamAris);
              return (
                <article
                  key={m.id}
                  data-cursor="hover"
                  className="group relative overflow-hidden border border-border bg-elevated transition-all duration-500 hover:border-[color:var(--color-neon)] hover:-translate-y-2 hover:shadow-[0_30px_60px_-20px_color-mix(in_oklab,var(--color-neon)_45%,transparent)]"
                  style={{ background: "var(--color-elevated)" }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={src}
                      alt={m.name}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale brightness-90 transition-all duration-[900ms] ease-out group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-100"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-60" />
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: "radial-gradient(600px circle at 50% 100%, color-mix(in oklab, var(--color-neon) 30%, transparent), transparent 60%)" }}
                    />
                    <span className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t" style={{ borderColor: "var(--color-neon)" }} />
                    <span className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t" style={{ borderColor: "var(--color-neon)" }} />
                    <span className="pointer-events-none absolute left-3 bottom-3 h-4 w-4 border-l border-b" style={{ borderColor: "var(--color-neon)" }} />
                    <span className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 border-r border-b" style={{ borderColor: "var(--color-neon)" }} />
                  </div>
                  <div className="relative p-6">
                    <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: "var(--color-neon)" }}>
                      {m.role}
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{m.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner />
    </main>
  );
}
