import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCMS, cmsUid } from "@/context/CMSContext";
import { CTABanner } from "@/components/sections/CTABanner";
import { saveContactSubmission } from "@/lib/supabase";
import * as Icons from "lucide-react";
import { ArrowLeft, ArrowUpRight, Check, Code, Cpu, Sparkles, Terminal, Wrench } from "lucide-react";

export const Route = createFileRoute("/services_/$serviceId")({
  head: ({ params }) => ({
    meta: [
      { title: `Service Practice — Motion In Tech` },
      { name: "description", content: "Capabilities, tech stack, and engineering execution by Motion In Tech." },
    ],
  }),
  component: ServiceDetailPage,
});

export function ServiceDetailPage() {
  const { serviceId } = Route.useParams();
  const { data } = useCMS();

  const allServices = data.services.filter((s) => s.visible);
  const serviceIndex = allServices.findIndex((s) => s.id === serviceId || s.title.toLowerCase().replace(/\s+/g, "-") === serviceId.toLowerCase());
  const service = allServices[serviceIndex] ?? allServices.find((s) => s.id === serviceId) ?? allServices[0];

  if (!service) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="font-display text-4xl font-bold">Service Not Found</h1>
        <p className="mt-3 text-muted-foreground">The practice area you requested is unavailable.</p>
        <Link to="/services" className="btn-neon-hover mt-8 inline-flex items-center gap-2 border border-neon px-6 py-3 font-mono text-xs uppercase tracking-widest text-neon">
          <ArrowLeft size={14} /> Back to all services
        </Link>
      </main>
    );
  }

  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[service.icon] || Icons.Sparkles;
  const nextService = allServices[(serviceIndex + 1) % allServices.length];
  const prevService = allServices[(serviceIndex - 1 + allServices.length) % allServices.length];

  // Find matching projects for this service
  const relatedProjects = data.projects.filter((p) => p.visible).slice(0, 2);

  return (
    <main className="bg-background text-foreground">
      {/* Service Hero */}
      <section className="relative overflow-hidden border-b border-border pb-[80px] pt-36 md:pb-28 md:pt-44">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
        <div
          className="pointer-events-none absolute left-10 top-20 h-96 w-96 rounded-full blur-[140px] opacity-25"
          style={{ background: "var(--color-neon)" }}
        />

        <div className="relative mx-auto w-full max-w-[1500px] px-6 text-center md:px-10 md:text-left">
          <Link
            to="/services"
            data-cursor="hover"
            className="group mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-neon"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Back to Capabilities
          </Link>

          <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div className="mb-6 flex items-center justify-center gap-3 md:justify-start">
                <div className="flex h-12 w-12 items-center justify-center border border-neon bg-neon/10 text-neon" style={{ borderColor: "var(--color-neon)", color: "var(--color-neon)" }}>
                  <IconComponent size={22} strokeWidth={1.5} />
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-neon" style={{ color: "var(--color-neon)" }}>
                  Practice Area 0{serviceIndex + 1}
                </span>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl md:text-8xl">
                {service.title}<span className="text-neon" style={{ color: "var(--color-neon)" }}>.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:mx-0 md:text-2xl">
                {service.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <a
                href="#inquire"
                data-cursor="hover"
                className="inline-flex items-center gap-2 border border-neon bg-neon px-8 py-4 font-mono text-xs uppercase tracking-widest font-semibold text-background transition-opacity hover:opacity-90"
                style={{ background: "var(--color-neon)", borderColor: "var(--color-neon)" }}
              >
                Start a {service.title} Project <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities & Sub-Services Breakdown */}
      <section className="relative mx-auto w-full max-w-[1500px] px-6 py-20 md:px-10 md:py-28">
        <div className="mb-14">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">01 — What We Deliver</div>
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
            Core Disciplines & Sub-Practices<span className="text-neon" style={{ color: "var(--color-neon)" }}>.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.subServices.map((sub, idx) => (
            <div
              key={sub}
              className="group relative border border-border bg-surface p-8 transition-all hover:border-neon hover:-translate-y-1"
              style={{ background: "var(--color-surface)" }}
            >
              <div className="font-mono text-xs uppercase tracking-widest text-neon mb-6" style={{ color: "var(--color-neon)" }}>
                0{idx + 1} / PRACTICE
              </div>
              <h3 className="font-display text-2xl font-bold tracking-tight">{sub}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Rigorous specification, rapid prototyping, production hardening, and continuous validation.
              </p>
              <div className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground group-hover:text-neon transition-colors">
                <Check size={14} className="text-neon" style={{ color: "var(--color-neon)" }} /> Production Grade
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Technologies & Architecture Stack */}
      <section className="border-t border-border bg-surface py-20 md:py-28" style={{ background: "var(--color-surface)" }}>
        <div className="mx-auto w-full max-w-[1500px] px-6 md:px-10">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">02 — The Stack</div>
              <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                Built on battle-tested technologies<span className="text-neon" style={{ color: "var(--color-neon)" }}>.</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                We select our engineering tools for speed, determinism, and durability. No speculative churn — only technology stacks proven at scale.
              </p>
            </div>

            <div className="md:col-span-7">
              <div className="flex flex-wrap gap-3">
                {service.technologies?.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-3 border border-border bg-background px-6 py-4 font-mono text-sm uppercase tracking-widest text-foreground hover:border-neon hover:text-neon transition-colors"
                  >
                    <Terminal size={16} className="text-neon" style={{ color: "var(--color-neon)" }} />
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Work Spotlight for this discipline */}
      {relatedProjects.length > 0 && (
        <section className="border-t border-border bg-background py-20 md:py-28">
          <div className="mx-auto w-full max-w-[1500px] px-6 md:px-10">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">03 — Case Studies</div>
                <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                  Recent Work in this Practice<span className="text-neon" style={{ color: "var(--color-neon)" }}>.</span>
                </h2>
              </div>
              <Link to="/work" className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-neon md:block">
                View all work →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {relatedProjects.map((p) => (
                <Link
                  key={p.id}
                  to="/work/$projectId"
                  params={{ projectId: p.id }}
                  data-cursor="view"
                  className="group relative aspect-[16/10] overflow-hidden border border-border bg-elevated block"
                  style={{ background: "var(--color-elevated)" }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-neon" style={{ color: "var(--color-neon)" }}>
                      {p.category}
                    </span>
                    <h3 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md line-clamp-2">{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dedicated Service Inquiry Form */}
      <ServiceInquirySection service={service} />

      {/* Next / Previous Service Navigation */}
      <section className="border-y border-border bg-surface py-12" style={{ background: "var(--color-surface)" }}>
        <div className="mx-auto flex w-full max-w-[1500px] flex-col justify-between gap-6 px-6 sm:flex-row sm:items-center md:px-10">
          <Link
            to="/services/$serviceId"
            params={{ serviceId: prevService.id }}
            data-cursor="hover"
            className="group flex flex-col"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1 group-hover:text-neon">
              <ArrowLeft size={12} /> Previous Practice
            </span>
            <span className="font-display text-2xl font-bold tracking-tight mt-1 group-hover:text-neon transition-colors">
              {prevService.title}
            </span>
          </Link>

          <Link
            to="/services"
            data-cursor="hover"
            className="self-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
          >
            [ All Services ]
          </Link>

          <Link
            to="/services/$serviceId"
            params={{ serviceId: nextService.id }}
            data-cursor="hover"
            className="group flex flex-col text-right"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground flex items-center justify-end gap-1 group-hover:text-neon">
              Next Practice <ArrowUpRight size={12} />
            </span>
            <span className="font-display text-2xl font-bold tracking-tight mt-1 group-hover:text-neon transition-colors">
              {nextService.title}
            </span>
          </Link>
        </div>
      </section>

      <CTABanner />
    </main>
  );
}

function ServiceInquirySection({ service }: { service: { id: string; title: string } }) {
  const { setData } = useCMS();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    budget: "$10k – $25k",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const budgetOptions = ["< $10k", "$10k – $25k", "$25k – $50k", "$50k+", "Undetermined"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    setErrorMessage(null);

    // 1. Record in local CMS state
    setData((d) => ({
      ...d,
      submissions: [
        ...(d.submissions || []),
        {
          id: cmsUid(),
          name: form.name,
          email: form.email,
          company: form.company,
          service: service.title,
          budget: form.budget,
          message: form.message,
          createdAt: Date.now(),
          read: false,
        },
      ],
    }));

    // 2. Dispatch email to developer@motionintech.com via FormSubmit and save in Supabase
    try {
      const emailPromise = fetch("https://formsubmit.co/ajax/developer@motionintech.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company || "Not provided",
          service: service.title,
          budget: form.budget,
          message: form.message,
          _subject: `New [${service.title}] Project Inquiry from ${form.name} (${form.company || "Individual"}) - Motion In Tech`,
          _replyto: form.email,
          _template: "table",
          _captcha: "false",
        }),
      });

      const supabasePromise = saveContactSubmission({
        name: form.name,
        email: form.email,
        company: form.company,
        service: service.title,
        budget: form.budget,
        message: form.message,
      });

      const [emailRes] = await Promise.all([emailPromise, supabasePromise]);
      const emailData = await emailRes.json().catch(() => null);

      if (emailData && emailData.success === "false") {
        setErrorMessage(emailData.message || "Email dispatch needs verification. Please check your inbox.");
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      console.error("Service inquiry error:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ name: "", email: "", company: "", budget: "$10k – $25k", message: "" });
    setSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <section id="inquire" className="relative scroll-mt-20 border-t border-border bg-elevated/40 py-20 md:py-28" style={{ background: "color-mix(in oklab, var(--color-surface) 70%, transparent)" }}>
      <div className="mx-auto w-full max-w-[1500px] px-6 md:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="mb-3 inline-flex items-center gap-2 border border-neon/40 bg-neon/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-neon" style={{ color: "var(--color-neon)", borderColor: "color-mix(in oklab, var(--color-neon) 40%, transparent)" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
              Service Practice: {service.title}
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Initiate your <span className="text-neon" style={{ color: "var(--color-neon)" }}>{service.title}</span> build.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              Share your project vision, challenges, and requirements below. Our lead engineering team will respond within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="border border-neon/40 bg-surface/80 p-10 text-center" style={{ borderColor: "color-mix(in oklab, var(--color-neon) 40%, transparent)" }}>
              <div className="inline-flex items-center gap-2 border border-neon/30 bg-neon/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-neon" style={{ color: "var(--color-neon)" }}>
                <span className="h-1.5 w-1.5 rounded-full bg-neon animate-ping" />
                Inquiry Received
              </div>
              <h3 className="mt-4 font-display text-3xl font-bold">
                Thanks, {form.name.split(" ")[0] || "partner"}!
              </h3>
              <p className="mt-3 text-muted-foreground">
                Your <span className="text-foreground font-semibold">{service.title}</span> inquiry has been received and routed to <span className="text-foreground font-medium">developer@motionintech.com</span>.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">We&apos;ll be in touch with a roadmap or preliminary proposal within one business day.</p>
              <button
                type="button"
                onClick={handleReset}
                data-cursor="hover"
                className="btn-neon-hover mt-8 inline-flex items-center gap-2 border border-border px-6 py-3 font-mono text-[11px] uppercase tracking-widest hover:border-neon hover:text-neon"
              >
                ← Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border border-border bg-surface/90 p-8 sm:p-12 shadow-2xl backdrop-blur">
              {errorMessage && (
                <div className="mb-6 border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
                  {errorMessage}
                </div>
              )}

              {/* Service name badge inside form */}
              <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Inquiring For:
                </div>
                <div className="font-mono text-xs uppercase tracking-widest text-neon font-semibold flex items-center gap-2" style={{ color: "var(--color-neon)" }}>
                  <Check size={14} /> {service.title}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                    Your Name <span style={{ color: "var(--color-neon)" }}>*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Alex Morgan"
                    className="w-full border-b border-border bg-transparent py-2.5 font-display text-xl outline-none transition-colors focus:border-neon"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                      Work Email <span style={{ color: "var(--color-neon)" }}>*</span>
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full border-b border-border bg-transparent py-2.5 font-display text-xl outline-none transition-colors focus:border-neon"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Acme Corp"
                      className="w-full border-b border-border bg-transparent py-2.5 font-display text-xl outline-none transition-colors focus:border-neon"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">
                    Target Budget Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {budgetOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm({ ...form, budget: opt })}
                        className={`border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                          form.budget === opt
                            ? "border-neon text-neon bg-neon/10"
                            : "border-border text-muted-foreground hover:border-foreground/40"
                        }`}
                        style={form.budget === opt ? { borderColor: "var(--color-neon)", color: "var(--color-neon)" } : undefined}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                    Project Scope & Objectives <span style={{ color: "var(--color-neon)" }}>*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={`Describe your vision for this ${service.title} project, goals, key requirements, or existing tech stack...`}
                    className="w-full resize-none border-b border-border bg-transparent py-2.5 font-display text-lg outline-none transition-colors focus:border-neon"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    data-cursor="hover"
                    className="btn-neon-hover inline-flex w-full items-center justify-center gap-3 border border-neon py-4 font-mono text-xs uppercase tracking-widest text-neon disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto sm:px-10"
                    style={{ borderColor: "var(--color-neon)" }}
                  >
                    {loading ? (
                      <>
                        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-neon border-t-transparent" style={{ borderColor: "var(--color-neon)", borderTopColor: "transparent" }} />
                        <span>Submitting {service.title} inquiry...</span>
                      </>
                    ) : (
                      <span>Submit {service.title} Inquiry →</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
