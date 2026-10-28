const badges = [
  {
    name: "JavaScript",
    icon: "javascript",
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  { name: "Python", icon: "python", href: "https://www.python.org/" },
  {
    name: "TypeScript",
    icon: "typescript",
    href: "https://www.typescriptlang.org/",
  },
  { name: "React", icon: "react", href: "https://react.dev/" },
  { name: "Next.js", icon: "nextjs", variant: "colored-dark", href: "https://nextjs.org/" },
  { name: "Node.js", icon: "nodejs", href: "https://nodejs.org/" },
  {
    name: "Tailwind CSS",
    icon: "tailwindcss",
    href: "https://tailwindcss.com/",
  },
  { name: "PHP", icon: "php", href: "https://www.php.net/" },
  { name: "Java", icon: "java", href: "https://www.java.com/" },
  { name: "C++", icon: "cplusplus", href: "https://isocpp.org/" },
  { name: "Firebase", icon: "firebase", href: "https://firebase.google.com/" },
  { name: "MongoDB", icon: "mongodb", href: "https://www.mongodb.com/" },
  {
    name: "PostgreSQL",
    icon: "postgresql",
    href: "https://www.postgresql.org/",
  },
  { name: "Supabase", icon: "supabase", href: "https://supabase.com/" },
  { name: "Git", icon: "git", href: "https://git-scm.com/" },
  { name: "Linux", icon: "linux", href: "https://www.linux.org/" },
];

const iconRoot =
  "https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills";

export function TechBadges() {
  return (
    <div
      aria-label="Technology badges from Victor's GitHub portfolio"
      className="github-tech-badges flex max-w-xl flex-wrap items-center gap-2.5"
    >
      {badges.map((badge) => (
        <a
          key={badge.name}
          aria-label={badge.name}
          className="tech-badge inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition duration-200 hover:-translate-y-1 hover:border-electric/60 hover:bg-white/[0.08] focus-visible:outline-electric"
          href={badge.href}
          rel="noreferrer"
          target="_blank"
          title={badge.name}
        >
          <img
            alt=""
            aria-hidden="true"
            className="h-6 w-6 object-contain"
            decoding="async"
            src={`${iconRoot}/${badge.icon}-${badge.variant ?? "colored"}.svg`}
          />
        </a>
      ))}
    </div>
  );
}
