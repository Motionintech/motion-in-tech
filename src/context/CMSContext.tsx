import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchRemoteCMS, saveRemoteCMS, fetchContactSubmissions } from "@/lib/supabase";
import heroPoster from "@/assets/hero-poster.jpg";
import projectHelios from "@/assets/project-helios.jpg";
import projectOrbit from "@/assets/project-orbit.jpg";
import projectNova from "@/assets/project-nova.jpg";
import projectAtlas from "@/assets/project-atlas.jpg";
import projectVector from "@/assets/project-vector.jpg";
import projectPulse from "@/assets/project-pulse.jpg";
import teamAris from "@/assets/team-aris.jpg";
import teamLina from "@/assets/team-lina.jpg";
import teamMarcus from "@/assets/team-marcus.jpg";

export type Service = {
  id: string;
  icon: string;
  title: string;
  description: string;
  subServices: string[];
  technologies: string[];
  visible: boolean;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string; // url or base64
  visible: boolean;
};

export type Stat = { id: string; value: string; label: string };
export type Testimonial = { id: string; name: string; role: string; company: string; quote: string; photo: string; rating: number };
export type ProcessStep = { id: string; title: string; description: string };
export type TeamMember = { id: string; name: string; role: string; bio: string; photo: string; linkedin?: string; twitter?: string };
export type MediaItem = { id: string; url: string; name: string; type: "image" | "video"; createdAt: number };
export type Submission = {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  createdAt: number;
  read: boolean;
};

export type CMSData = {
  hero: {
    headline: string;
    subHeadline: string;
    cta1: { label: string; link: string };
    cta2: { label: string; link: string };
    backgroundType: "video" | "image";
    backgroundVideo: string;
    backgroundImage: string;
    marquee: string[];
  };
  services: Service[];
  projects: Project[];
  stats: Stat[];
  animateCounters: boolean;
  testimonials: Testimonial[];
  process: ProcessStep[];
  team: TeamMember[];
  about: {
    tagline: string;
    story: string;
    founded: string;
    headquarters: string;
    mission: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    socials: { linkedin: string; twitter: string; instagram: string; github: string; behance: string };
  };
  seo: { title: string; description: string; ogImage: string; keywords: string };
  global: {
    logo: string;
    headerLogo: string;
    footerLogo: string;
    siteName: string;
    accent: string;
    footerCopy: string;
    announcement: { enabled: boolean; text: string; link: string };
    favicon: string;
    gaId: string;
  };
  header: {
    navLinks: { id: string; label: string; href: string }[];
    ctaLabel: string;
    ctaLink: string;
  };
  footer: {
    bigLine1: string;
    bigLine2: string;
    bigCtaLabel: string;
    bigCtaLink: string;
    marqueeWords: string[];
    columns: { id: string; title: string; links: { id: string; label: string; href: string }[] }[];
  };
  media: MediaItem[];
  submissions: Submission[];
};

const uid = () => Math.random().toString(36).slice(2, 10);

const defaultData: CMSData = {
  hero: {
    headline: "We Build Digital Futures.",
    subHeadline: "Motion In Tech — Where Code Meets Craft.",
    cta1: { label: "See Our Work", link: "/work" },
    cta2: { label: "Get In Touch", link: "/contact" },
    backgroundType: "image",
    backgroundVideo: "",
    backgroundImage: heroPoster,
    marquee: [
      "Web Development",
      "Mobile Apps",
      "UI / UX Design",
      "ERP Systems",
      "IT Consulting",
      "Cloud Architecture",
      "AI Engineering",
    ],
  },
  services: [
    {
      id: uid(),
      icon: "Globe",
      title: "Web Development",
      description: "Production-grade web platforms engineered to scale. From bespoke React apps to enterprise commerce stacks.",
      subServices: ["Frontend (React / Vue)", "Backend (Node / Python)", "E-Commerce (Shopify / Woo)", "Headless CMS", "Performance & SEO", "Maintenance"],
      technologies: ["React", "Next.js", "Node", "PostgreSQL", "GraphQL"],
      visible: true,
    },
    {
      id: uid(),
      icon: "Smartphone",
      title: "Mobile App Development",
      description: "Native and cross-platform apps with cinematic UI and rock-solid architecture.",
      subServices: ["Android (Kotlin)", "iOS (Swift)", "Flutter / React Native", "Mobile UI/UX", "Backend Integration", "Post-Launch Support"],
      technologies: ["Swift", "Kotlin", "Flutter", "React Native"],
      visible: true,
    },
    {
      id: uid(),
      icon: "Palette",
      title: "UI / UX Design",
      description: "Design systems and product interfaces engineered for clarity, delight and conversion.",
      subServices: ["User Research", "Wireframing", "Prototyping (Figma)", "Design Systems", "Usability Testing", "WCAG Accessibility"],
      technologies: ["Figma", "Framer", "Principle"],
      visible: true,
    },
    {
      id: uid(),
      icon: "Building2",
      title: "ERP & Custom Software",
      description: "End-to-end business platforms — ERP, CRM, internal tools, integrations and workflow automation.",
      subServices: ["ERP (SAP / Oracle / Odoo)", "CRM (Salesforce / HubSpot)", "Custom Business Tools", "API Integration", "Database Design", "Workflow Automation"],
      technologies: ["Odoo", "SAP", "Salesforce", "Postgres"],
      visible: true,
    },
    {
      id: uid(),
      icon: "Briefcase",
      title: "IT Consulting",
      description: "Senior consultants embedded with your team. Strategy, architecture, audits and team augmentation.",
      subServices: ["Digital Transformation", "Technology Roadmap", "Tech Stack Selection", "Team Augmentation", "Security Audits", "Cloud Strategy"],
      technologies: ["AWS", "GCP", "Azure", "Kubernetes"],
      visible: true,
    },
  ],
  projects: [
    { id: uid(), title: "Helios Banking", category: "Web", description: "Reimagined private banking experience for a tier-1 European bank.", tags: ["Fintech", "React", "Design System"], image: projectHelios, visible: true },
    { id: uid(), title: "Orbit Mobility", category: "Mobile", description: "Cross-platform ride-hailing app shipped in 14 weeks.", tags: ["Flutter", "Realtime"], image: projectOrbit, visible: true },
    { id: uid(), title: "Nova Studios", category: "Design", description: "Brand and product OS for an LA-based creative studio.", tags: ["Brand", "Figma"], image: projectNova, visible: true },
    { id: uid(), title: "Atlas ERP", category: "ERP", description: "Custom ERP replacing 7 legacy systems for a logistics group.", tags: ["Odoo", "Integration"], image: projectAtlas, visible: true },
    { id: uid(), title: "Vector Commerce", category: "Web", description: "Headless commerce platform doing $40M+ ARR.", tags: ["Next.js", "Shopify"], image: projectVector, visible: true },
    { id: uid(), title: "Pulse Health", category: "Mobile", description: "HIPAA-compliant telehealth platform for 200k+ patients.", tags: ["iOS", "Android"], image: projectPulse, visible: true },
  ],
  stats: [
    { id: uid(), value: "150", label: "Projects Delivered" },
    { id: uid(), value: "8", label: "Years of Craft" },
    { id: uid(), value: "40", label: "Engineers & Designers" },
    { id: uid(), value: "98", label: "Client Satisfaction %" },
  ],
  animateCounters: true,
  testimonials: [
    {
      id: uid(),
      name: "Elena Rostova",
      role: "VP of Product",
      company: "Nova Technologies",
      quote: "Motion In Tech delivered our flagship platform in 14 weeks. The craft and performance are unmatched.",
      photo: teamLina,
      rating: 5,
    },
    {
      id: uid(),
      name: "David Chen",
      role: "Founder & CTO",
      company: "Helios Grid",
      quote: "They don't just write code — they think like product owners. Our user retention doubled post-launch.",
      photo: teamAris,
      rating: 5,
    },
    {
      id: uid(),
      name: "Sarah Jenkins",
      role: "Chief Digital Officer",
      company: "Atlas Mobility",
      quote: "The cleanest engineering architecture and design system we've ever had the pleasure of adopting.",
      photo: teamMarcus,
      rating: 5,
    },
  ],
  process: [
    { id: uid(), title: "Strategy", description: "Roadmaps, architecture decisions and a measurable definition of done." },
    { id: uid(), title: "Design", description: "Design systems and prototypes that are already production-aware." },
    { id: uid(), title: "Development", description: "Senior engineers, weekly releases, ruthless code quality." },
    { id: uid(), title: "Launch", description: "Performance, security and SEO hardened. Zero-downtime rollouts." },
    { id: uid(), title: "Support", description: "We stay embedded — monitoring, iterating, evolving with your business." },
  ],
  team: [
    { id: uid(), name: "Aris Vahn", role: "Founder & CEO", bio: "Ex-IDEO, 12 years building digital products at scale.", photo: teamAris },
    { id: uid(), name: "Lina Park", role: "Design Director", bio: "Brand systems and product design for global teams.", photo: teamLina },
    { id: uid(), name: "Marcus Reid", role: "Engineering Lead", bio: "Distributed systems, performance, architecture.", photo: teamMarcus },
  ],
  about: {
    tagline: "A studio engineered like a product.",
    story: "Founded in 2017 in Berlin, Motion In Tech began as a small collective of designers and engineers obsessed with how digital products feel. Today we are a 40-person studio building software for ambitious teams across fintech, mobility and consumer.",
    founded: "2017",
    headquarters: "Berlin · Lisbon · New York",
    mission: "Make the most important digital products on earth feel inevitable.",
  },
  contact: {
    email: "developer@motionintech.com",
    phone: "+49 30 1234 5678",
    address: "Torstraße 110, 10119 Berlin, Germany",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      github: "https://github.com",
      behance: "https://behance.net",
    },
  },
  seo: {
    title: "Motion In Tech — Award-winning Software Studio",
    description: "We design and engineer iconic digital products for ambitious teams. Web, mobile, ERP and design.",
    ogImage: "",
    keywords: "software agency, web development, mobile apps, UI UX, ERP, IT consulting",
  },
  global: {
    logo: "/brand-logo.svg",
    headerLogo: "/brand-logo.svg",
    footerLogo: "/brand-logo.svg",
    siteName: "Motion In Tech",
    accent: "#00FFD1",
    footerCopy: "© 2025 Motion In Tech. All rights reserved.",
    announcement: { enabled: false, text: "We're hiring senior engineers — join us.", link: "/contact" },
    favicon: "",
    gaId: "",
  },
  header: {
    navLinks: [
      { id: uid(), label: "Work", href: "/work" },
      { id: uid(), label: "Services", href: "/services" },
      { id: uid(), label: "About", href: "/about" },
      { id: uid(), label: "Contact", href: "/contact" },
    ],
    ctaLabel: "Start a project",
    ctaLink: "/contact",
  },
  footer: {
    bigLine1: "LET'S",
    bigLine2: "build.",
    bigCtaLabel: "Start a project",
    bigCtaLink: "/contact",
    marqueeWords: ["MOTION", "IN", "TECH", "SHIP", "CRAFT"],
    columns: [
      { id: uid(), title: "Company", links: [
        { id: uid(), label: "About", href: "/about" },
        { id: uid(), label: "Work", href: "/work" },
        { id: uid(), label: "Services", href: "/services" },
        { id: uid(), label: "Contact", href: "/contact" },
      ]},
    ],
  },
  media: [],
  submissions: [],
};

type CMSContextValue = {
  data: CMSData;
  setData: (next: CMSData | ((prev: CMSData) => CMSData)) => void;
  update: <K extends keyof CMSData>(key: K, value: CMSData[K]) => void;
  reset: () => void;
  exportJson: () => void;
  importJson: (file: File) => Promise<void>;
  saved: boolean;
};

const CMSContext = createContext<CMSContextValue | null>(null);

const STORAGE_KEY = "mit-cms-v1";

function cleanUrl(url?: string): string {
  if (!url || url.includes("/__l5e/")) return "/brand-logo.svg";
  return url;
}

export function CMSProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<CMSData>(defaultData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const contactParsed = parsed.contact ?? {};
        const contactEmail = (!contactParsed.email || contactParsed.email === "hello@motionintech.com")
          ? "developer@motionintech.com"
          : contactParsed.email;
        const globalParsed = parsed.global ?? {};
        setDataState({
          ...defaultData,
          ...parsed,
          contact: {
            ...defaultData.contact,
            ...contactParsed,
            email: contactEmail,
          },
          global: {
            ...defaultData.global,
            ...globalParsed,
            logo: cleanUrl(globalParsed.logo),
            headerLogo: cleanUrl(globalParsed.headerLogo),
            footerLogo: cleanUrl(globalParsed.footerLogo),
          },
        });
      }
    } catch {}
    setHydrated(true);

    // Sync from Supabase in the background
    (async () => {
      try {
        const [remoteCms, remoteSubs] = await Promise.allSettled([
          fetchRemoteCMS(),
          fetchContactSubmissions(50),
        ]);

        if (!active) return;

        setDataState((prev) => {
          let updated = prev;

          if (remoteCms.status === "fulfilled" && remoteCms.value) {
            const r = remoteCms.value as Partial<CMSData>;
            updated = {
              ...updated,
              ...r,
              contact: {
                ...updated.contact,
                ...(r.contact ?? {}),
                email: r.contact?.email || "developer@motionintech.com",
              },
            };
          }

          if (remoteSubs.status === "fulfilled" && remoteSubs.value?.success && Array.isArray(remoteSubs.value.data)) {
            const mappedSubs = remoteSubs.value.data.map((s) => ({
              id: s.id,
              name: s.name,
              email: s.email,
              company: s.company || "",
              service: s.service || "",
              budget: s.budget || "",
              message: s.message,
              createdAt: new Date(s.created_at).getTime(),
              read: Boolean(s.read),
            }));

            const existingIds = new Set((updated.submissions || []).map((x) => x.id));
            const newSubs = mappedSubs.filter((x) => !existingIds.has(x.id));
            if (newSubs.length > 0) {
              updated = {
                ...updated,
                submissions: [...newSubs, ...(updated.submissions || [])].slice(0, 200),
              };
            }
          }

          return updated;
        });
      } catch {
        // Fallback gracefully without breaking UI
      }
    })();

    return () => {
      active = false;
    };
  }, []);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !hydrated) return;
    setSaved(false);
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSaved(true);

        // Safe Supabase remote sync (single-row, no bloat)
        saveRemoteCMS({
          hero: data.hero,
          services: data.services,
          projects: data.projects,
          stats: data.stats,
          animateCounters: data.animateCounters,
          testimonials: data.testimonials,
          process: data.process,
          team: data.team,
          about: data.about,
          contact: data.contact,
          seo: data.seo,
          global: data.global,
          header: data.header,
          footer: data.footer,
        }).catch(() => {});
      } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, [data, hydrated]);

  const setData: CMSContextValue["setData"] = (next) => {
    setDataState((prev) => (typeof next === "function" ? (next as (p: CMSData) => CMSData)(prev) : next));
  };

  const update: CMSContextValue["update"] = (key, value) =>
    setDataState((prev) => ({ ...prev, [key]: value }));

  const reset = () => setDataState(defaultData);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `motion-in-tech-cms-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    setDataState({ ...defaultData, ...parsed });
  };

  return (
    <CMSContext.Provider value={{ data, setData, update, reset, exportJson, importJson, saved }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error("useCMS must be used inside CMSProvider");
  return ctx;
}

export { uid as cmsUid };
