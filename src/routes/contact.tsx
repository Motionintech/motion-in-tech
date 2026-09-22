import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCMS, cmsUid } from "@/context/CMSContext";
import { PageHero } from "@/components/layout/PageHero";
import { saveContactSubmission } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Motion In Tech" },
      { name: "description", content: "Start a project with Motion In Tech. We work with ambitious teams across fintech, mobility, commerce and beyond." },
      { property: "og:title", content: "Contact — Motion In Tech" },
      { property: "og:description", content: "Let's build something iconic." },
    ],
  }),
  component: ContactPage,
});

const services = ["Web", "Mobile", "Design", "ERP", "Consulting"];

function ContactPage() {
  const { data, setData } = useCMS();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", service: services[0], message: "" });
  const targetEmail = "developer@motionintech.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setLoading(true);
    setErrorMessage(null);

    // 1. Record submission in local CMS state
    setData((d) => ({
      ...d,
      submissions: [
        ...(d.submissions || []),
        {
          id: cmsUid(),
          name: form.name,
          email: form.email,
          company: form.company,
          service: form.service,
          budget: "",
          message: form.message,
          createdAt: Date.now(),
          read: false,
        },
      ],
    }));

    // 2. Persist to Supabase and dispatch email via FormSubmit
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
          service: form.service,
          message: form.message,
          _subject: `New Project Inquiry from ${form.name} (${form.company || "Individual"}) - Motion In Tech`,
          _replyto: form.email,
          _template: "table",
          _captcha: "false",
        }),
      });

      const supabasePromise = saveContactSubmission({
        name: form.name,
        email: form.email,
        company: form.company,
        service: form.service,
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
      console.error("Form submit error:", err);
      // Fallback: still show submitted because Supabase recorded it
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ name: "", email: "", company: "", service: services[0], message: "" });
    setSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <main>
      <PageHero
        eyebrow="07 — Contact"
        title="Let's build"
        accent="iconic."
        subtitle="Tell us about your project. We reply within one business day with next steps or a friendly no."
      />

      <section className="relative bg-background pb-[80px] md:pb-32">
        <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-16 px-6 md:grid-cols-12 md:px-10">
          <aside className="text-center md:col-span-4 md:row-start-1 md:text-left">
            <div className="space-y-10">
              <div className="border-t border-border pt-6">
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Email</div>
                <a
                  href={`mailto:${targetEmail}`}
                  data-cursor="hover"
                  className="mt-2 block font-display text-2xl hover:text-neon"
                  style={{}}
                >
                  {targetEmail}
                </a>
              </div>
              <div className="border-t border-border pt-6">
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Phone</div>
                <div className="mt-2 font-display text-2xl">{data.contact.phone}</div>
              </div>
              <div className="border-t border-border pt-6">
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Studio</div>
                <div className="mx-auto mt-2 max-w-xs font-display text-xl md:mx-0">{data.contact.address}</div>
              </div>
              <div className="border-t border-border pt-6">
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Elsewhere</div>
                <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                  {Object.entries(data.contact.socials).map(([k, v]) =>
                    v ? (
                      <a
                        key={k}
                        href={v}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="hover"
                        className="border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest hover:border-neon hover:text-neon"
                      >
                        {k}
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </aside>

          <div className="md:col-span-7 md:col-start-6">
            {submitted ? (
              <div className="border border-neon/40 p-10 text-center" style={{ borderColor: "color-mix(in oklab, var(--color-neon) 40%, transparent)" }}>
                <div className="inline-flex items-center gap-2 border border-neon/30 bg-neon/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-neon" style={{ color: "var(--color-neon)" }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-neon animate-ping" />
                  Message sent
                </div>
                <h3 className="mt-4 font-display text-3xl font-bold">Thanks, {form.name.split(" ")[0] || "friend"}.</h3>
                <p className="mt-3 text-muted-foreground">
                  Your inquiry has been submitted and routed to <span className="text-foreground font-medium">{targetEmail}</span>.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">We&apos;ll be in touch within one business day.</p>
                <button
                  type="button"
                  onClick={handleReset}
                  data-cursor="hover"
                  className="btn-neon-hover mt-8 inline-flex items-center gap-2 border border-border px-6 py-3 font-mono text-[11px] uppercase tracking-widest hover:border-neon hover:text-neon"
                >
                  ← Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {errorMessage && (
                  <div className="border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-400">
                    {errorMessage}
                  </div>
                )}
                <Field label="Your name" required>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border-b border-border bg-transparent py-3 font-display text-2xl outline-none focus:border-neon"
                  />
                </Field>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <Field label="Email" required>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 font-display text-xl outline-none focus:border-neon"
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full border-b border-border bg-transparent py-3 font-display text-xl outline-none focus:border-neon"
                    />
                  </Field>
                </div>

                <Field label="What do you need?">
                  <div className="flex flex-wrap gap-2 pt-2">
                    {services.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, service: s })}
                        className={`border px-4 py-2 font-mono text-[11px] uppercase tracking-widest ${
                          form.service === s ? "border-neon text-neon" : "border-border text-muted-foreground hover:border-foreground/40"
                        }`}
                        style={form.service === s ? { borderColor: "var(--color-neon)", color: "var(--color-neon)" } : undefined}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Tell us about the project" required>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full resize-none border-b border-border bg-transparent py-3 font-display text-xl outline-none focus:border-neon"
                  />
                </Field>

                <button
                  type="submit"
                  disabled={loading}
                  data-cursor="hover"
                  className="btn-neon-hover inline-flex items-center gap-3 border border-neon px-8 py-5 font-mono text-xs uppercase tracking-widest text-neon disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-neon border-t-transparent" style={{ borderColor: "var(--color-neon)", borderTopColor: "transparent" }} />
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <span>Send message →</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        {label} {required && <span style={{ color: "var(--color-neon)" }}>*</span>}
      </div>
      {children}
    </label>
  );
}
