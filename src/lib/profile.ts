// Single source of truth for personal/brand data.
export const PROFILE = {
  name: "Victor Otieno Ochieng",
  shortName: "Victor Ochieng",
  initials: "VOO",
  titles: [
    "Full Stack Engineer",
    "AI Systems Builder",
    "SaaS Architect",
    "Business Systems Developer",
    "Digital Transformation Consultant",
  ],
  headline: "Full Stack Engineer · AI Systems · SaaS Architect",
  summary:
    "Full Stack Engineer and SaaS Architect with hands-on experience designing, building and scaling production web systems for hospitality, education, real estate and small-to-mid-size enterprises. Combines deep engineering across the modern TypeScript / React / Node stack with AI integration, cloud infrastructure, database design and SEO — delivering measurable digital transformation for businesses across Africa and beyond.",
  location: "Nairobi, Kenya",
  email: "ochiengvicky21@gmail.com",
  phone: "+254 742 676 542",
  whatsapp: "https://wa.me/254742676542",
  github: "https://github.com/ochiengvicky21",
  githubUsername: "ochiengvicky21",
  tiktok: "https://www.tiktok.com/@v_o_otoday",
  photo: "/ochieng-victor.jpg",
  siteUrl: "",
  skills: {
    "Languages": ["TypeScript", "JavaScript", "Python", "SQL", "HTML5", "CSS3"],
    "Frontend": ["React", "TanStack Start", "Next.js", "Tailwind CSS", "Vite", "shadcn/ui"],
    "Backend": ["Node.js", "Server Functions", "REST", "Edge Workers", "Supabase", "PostgreSQL"],
    "AI / Data": ["OpenAI APIs", "RAG pipelines", "LLM integration", "Embeddings", "Prompt engineering"],
    "Cloud / DevOps": ["Cloudflare", "Netlify", "Vercel", "GitHub Actions", "CI/CD"],
    "Other": ["SEO", "Database design", "Web revamps", "Social media management", "Technical writing"],
  } as Record<string, string[]>,
  experience: [
    {
      role: "Full Stack Engineer & SaaS Architect (Independent)",
      org: "Self-employed",
      period: "2023 — Present",
      location: "Nairobi, Kenya",
      bullets: [
        "Design and ship production SaaS systems for hospitality, real estate and SME clients across the modern TypeScript/React/Node stack.",
        "Integrate AI features (LLM chat, summarisation, RAG) into business workflows to automate operations and customer engagement.",
        "Lead end-to-end delivery: discovery, architecture, UI/UX, implementation, deployment and post-launch optimisation.",
      ],
    },
    {
      role: "Web Developer & Social Media Manager",
      org: "Munglu Eco Village Resort",
      period: "2024 — Present",
      location: "Homa Bay, Kenya",
      bullets: [
        "Designed, built and maintain the resort's official website (mungluecovillage.co.ke) with booking and SEO foundations.",
        "Manage Facebook (MungluEcoVillageResort) and TikTok (@mungluecovillage), growing organic reach through consistent branded content.",
        "Own content strategy, copy, visuals and analytics — translating engagement into direct guest enquiries.",
      ],
    },
    {
      role: "Teacher of English & Literature",
      org: "Sango Academy",
      period: "Prior",
      location: "Homa Bay, Kenya",
      bullets: [
        "Taught English Language and Literature, building strong communication and analytical foundations for secondary learners.",
        "Designed lesson plans, assessments and reading programmes aligned to the national curriculum.",
      ],
    },
  ],
  education: [
    { school: "Self-directed & continuous professional study", detail: "Software engineering, AI systems, cloud architecture, SEO and SaaS design." },
  ],
  certifications: [
    "Continuous learning across modern web, AI, and cloud platforms (GitHub portfolio as living evidence).",
  ],
  achievements: [
    "Built and launched mungluecovillage.co.ke end-to-end.",
    "Managing live multi-channel social presence for a hospitality brand.",
    "Public open-source portfolio actively maintained on GitHub (@ochiengvicky21).",
  ],
} as const;

export type Profile = typeof PROFILE;
