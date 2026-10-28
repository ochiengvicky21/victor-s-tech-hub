import { z } from "zod";
import { PROFILE } from "./profile";

const httpsUrl = z
  .string()
  .url()
  .max(1_000)
  .refine((value) => new URL(value).protocol === "https:", "Use an HTTPS URL.");

const sourceUrl = z
  .string()
  .url()
  .max(1_000)
  .refine((value) => {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.port || url.username || url.password) return false;
    if (url.hostname === "github.com") return /^\/[^/]+\/[^/]+\/blob\/[^/]+\/.+/.test(url.pathname);
    if (url.hostname === "gitlab.com") return /^\/.+\/-\/blob\/[^/]+\/.+/.test(url.pathname);
    return false;
  }, "Use a public GitHub or GitLab file URL.");

export const siteSectionSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  kind: z.enum(["hero", "story", "client-work", "resume-summary", "custom"]),
  eyebrow: z.string().max(100),
  title: z.string().trim().min(1).max(300),
  description: z.string().max(1_500),
  body: z.string().max(10_000),
});

export const portfolioProjectSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  client: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2_000),
  capabilities: z.array(z.string().trim().min(1).max(80)).max(12),
  links: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(80),
        href: httpsUrl,
        icon: z.enum(["globe", "facebook", "tiktok"]).optional(),
      }),
    )
    .max(8),
});

export const codeSnippetSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500),
  sourceUrl,
  license: z.string().trim().min(1).max(80),
  licenseUrl: httpsUrl,
});

export const siteContentSchema = z
  .object({
    sections: z.array(siteSectionSchema).max(12),
    projects: z.array(portfolioProjectSchema).max(20),
    snippets: z.array(codeSnippetSchema).max(8),
  })
  .superRefine((content, context) => {
    for (const [field, values] of [
      ["sections", content.sections],
      ["projects", content.projects],
      ["snippets", content.snippets],
    ] as const) {
      const ids = new Set<string>();
      values.forEach((value, index) => {
        if (ids.has(value.id)) {
          context.addIssue({
            code: "custom",
            path: [field, index, "id"],
            message: "IDs must be unique.",
          });
        }
        ids.add(value.id);
      });
    }
  });

export type SiteSection = z.infer<typeof siteSectionSchema>;
export type PortfolioProject = z.infer<typeof portfolioProjectSchema>;
export type CodeSnippetSource = z.infer<typeof codeSnippetSchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;

export type FetchedCodeSnippet = CodeSnippetSource & {
  code: string | null;
  error: string | null;
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  sections: [
    {
      id: "hero",
      kind: "hero",
      eyebrow: "Available for select projects",
      title: "Hi, I'm Victor\nFull Stack Engineer",
      description:
        "I'm Victor Otieno Ochieng, a software engineer building and shipping websites and business systems for hospitality and education.",
      body: "",
    },
    {
      id: "story",
      kind: "story",
      eyebrow: "// the story",
      title: "Software, treated like infrastructure.",
      description: "",
      body: "I build software the way good architects build buildings — for the people who'll live inside it, and for the decades after launch. Every line of code is in service of a business outcome.\n\nMy work spans hotel and resort management, property and real-estate platforms, educational systems, school ERPs, library systems, AI dashboards, business automation, booking platforms, payment systems, role-based access, multi-tenant SaaS, administrative dashboards and analytics.\n\nLong term, I'm building enterprise-grade SaaS products used by businesses across Africa and beyond.",
    },
    {
      id: "client-work",
      kind: "client-work",
      eyebrow: "// selected client work",
      title: "Selected client work, delivered.",
      description: "Websites and business systems delivered for hospitality and education clients.",
      body: "",
    },
    {
      id: "resume-summary",
      kind: "resume-summary",
      eyebrow: "// resume summary",
      title: "Professional summary",
      description: PROFILE.summary,
      body: "",
    },
  ],
  projects: [
    {
      id: "abila-kamwalimu",
      client: "Abila Kamwalimu Hotel",
      category: "Hospitality · Website",
      title: "A welcoming online home for Homa Bay dining.",
      description:
        "Built and shipped the hotel website, bringing its dining experience, menu highlights, gallery, and visitor contact details together.",
      capabilities: ["Restaurant website", "Menu & gallery", "Visitor information"],
      links: [{ label: "Visit website", href: "https://abilakamwalimu.vercel.app", icon: "globe" }],
    },
    {
      id: "profia-institute",
      client: "Profia Institute",
      category: "Education · Website & information system",
      title: "A digital front door for professional learning.",
      description:
        "Built and shipped the institute website and information management system. Its public site introduces the Homa Bay TVET college, published programmes, and admissions.",
      capabilities: ["Institute website", "Information management", "Admissions"],
      links: [{ label: "Visit website", href: "https://profiainstitute.com", icon: "globe" }],
    },
    {
      id: "sentari-schools",
      client: "Sentari Schools",
      category: "Education · School information system",
      title: "A more connected view of the school day.",
      description:
        "Built and shipped a school information management system designed around academic insight, fee workflows, and role-based views for school teams.",
      capabilities: ["Academic insights", "Fee workflows", "Role-based views"],
      links: [
        { label: "Explore Sentari", href: "https://sentarischools.vercel.app", icon: "globe" },
      ],
    },
    {
      id: "kamwalimu-hotel-social",
      client: "Kamwalimu Hotel",
      category: "Hospitality · Social media",
      title: "Social media management across two channels.",
      description: "Managed the hotel’s social media presence on TikTok and Facebook.",
      capabilities: ["TikTok", "Facebook"],
      links: [
        {
          label: "@kamwalimu.hotel",
          href: "https://www.tiktok.com/@kamwalimu.hotel",
          icon: "tiktok",
        },
        {
          label: "Facebook",
          href: "https://www.facebook.com/kamwalimuhotel",
          icon: "facebook",
        },
      ],
    },
  ],
  snippets: [],
};

export function getSiteSection(content: SiteContent, id: string) {
  return content.sections.find((section) => section.id === id);
}
