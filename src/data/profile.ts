// Single source of truth for personal details shown across windows
// (About, Resume, Contact, Links, Terminal). Edit here, not in each page.

export const PROFILE = {
  name: "Ahmad Kanaan",
  role: "Full-Stack Developer",
  years: "5+ years",
  email: "ahmad.w.kanaan@proton.me",
  phone: "+961 81 849 055",
  phoneHref: "tel:+96181849055",
  location: "Beirut, Lebanon",
  github: "https://github.com/Haruru0-0",
  // TODO: confirm this is the real LinkedIn URL.
  linkedin: "https://linkedin.com/in/ahmad-kanaan",
  blog: "https://ahmadkanaan.hashnode.dev/",
  // Drop these two files into /public to activate them.
  resumePdf: "/resume.pdf",
  photo: "/profile-photo.webp",
}

export const SKILL_CATEGORIES = [
  { name: "DevOps / Cloud", skills: ["Docker", "Azure", "Google Cloud", "AWS", "Kubernetes"], icon: "☁️" },
  { name: "Backend Development", skills: ["Spring Boot", "Node.js", "Express", "NestJS", "Laravel", "Django"], icon: "⚙️" },
  { name: "Frontend Development", skills: ["React", "Next.js", "TypeScript"], icon: "🎨" },
  { name: "Databases", skills: ["MongoDB", "PostgreSQL", "Redis"], icon: "🗄️" },
  { name: "Data Science / ML", skills: ["pandas", "scikit-learn", "NumPy", "Matplotlib", "Data visualization"], icon: "📊" },
]

export const INTERESTS = [
  { name: "Reading manga", icon: "📖" },
  { name: "UI/UX design", icon: "🎨" },
  { name: "Technical blogging", icon: "✍️" },
  { name: "3D modeling", icon: "🧊" },
  { name: "Chess", icon: "♟️" },
  { name: "Data science", icon: "📊" },
]
