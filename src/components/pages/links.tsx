import { useRef, useContext } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { ArrowUpRight, FileDown, FileText, Github, Linkedin, Mail } from "lucide-react"
import { CardContent } from "@/components/ui/card"
import { MagicCard } from "@/components/ui/magic-card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollContainerContext } from "@/components/animated-section"
import { animateTextReveal, animateBlurText } from "@/lib/animations"
import AnimatedContent from "@/components/AnimatedContent"
import { useAppSound } from "@/components/sound-context"
import { fetchBlogPosts, type PostNode } from "@/lib/hashnode"
import { PROFILE } from "@/data/profile"

const REPOS = [
  { name: "Nebula", repo: "Nebula", blurb: "AI agent platform", tags: ["React", "Node.js"] },
  { name: "NotionCraft AI", repo: "notioncraft-ai", blurb: "Block editor with an AI assistant", tags: ["Next.js", "Supabase"] },
  { name: "PortaGen", repo: "PortaGen", blurb: "Portfolio-OS generator", tags: ["Next.js", "Supabase"] },
  { name: "Steam Games Analysis", repo: "steam-games-analysis", blurb: "Predicting a game's audience", tags: ["Python", "Streamlit"] },
  { name: "Malware Classifier", repo: "malware-classifier", blurb: "Static malware detection with SHAP", tags: ["Python", "LightGBM"] },
]

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cute-text)]"

export default function Links() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useContext(ScrollContainerContext)
  const { playClickSound } = useAppSound()

  useGSAP(() => {
    if (!containerRef.current) return
    const c = containerRef.current
    const root = scrollContainerRef?.current ?? null
    const ios = [
      ...animateBlurText(gsap.utils.toArray('p[data-anim="fade"]', c), root),
      ...animateTextReveal(gsap.utils.toArray('[data-anim="text"]', c), root),
    ]
    return () => ios.forEach(io => io.disconnect())
  }, { scope: containerRef, dependencies: [] })

  const { data: posts, isLoading } = useQuery<PostNode[]>({
    queryKey: ["blogPosts"],
    queryFn: fetchBlogPosts,
  })
  const latestPosts = (posts ?? []).slice(0, 3)

  const mainLinks = [
    { title: "GitHub", detail: PROFILE.github.replace("https://", ""), url: PROFILE.github, icon: Github, kind: "external" },
    { title: "LinkedIn", detail: PROFILE.linkedin.replace("https://", ""), url: PROFILE.linkedin, icon: Linkedin, kind: "external" },
    { title: "Email", detail: PROFILE.email, url: `mailto:${PROFILE.email}`, icon: Mail, kind: "mail" },
    { title: "Blog", detail: PROFILE.blog.replace("https://", "").replace(/\/$/, ""), url: PROFILE.blog, icon: FileText, kind: "external" },
    { title: "Resume (PDF)", detail: "Download my CV", url: PROFILE.resumePdf, icon: FileDown, kind: "download" },
  ]

  const sectionTitle = "self-start portfolio-section-title pixel-title"

  return (
    <div ref={containerRef} className="flex flex-col gap-8 max-w-3xl mx-auto pixel-text">
      <div className="flex flex-col items-center gap-3 text-center">
        <AnimatedContent scale={0.82} ease="back.out(1.7)" className="inline-block">
          <Avatar className="size-24 border-2 border-[var(--cute-text)] rounded-none">
            <AvatarImage src={PROFILE.photo} alt={`Portrait of ${PROFILE.name}`} />
            <AvatarFallback className="rounded-none bg-[var(--cute-highlight)] text-[var(--cute-text)]">AK</AvatarFallback>
          </Avatar>
        </AnimatedContent>
        <h1 data-anim="text" className="text-3xl font-bold pixel-title">Connect With Me</h1>
        <p data-anim="fade" className="opacity-90">{PROFILE.name} · {PROFILE.role} · {PROFILE.location}</p>
        <Badge variant="secondary" className="pixel-badge gap-2">
          <span className="inline-block size-2 bg-green-500" aria-hidden="true" />
          Open to opportunities
        </Badge>
      </div>

      <section aria-labelledby="links-find" className="flex flex-col">
        <h2 id="links-find" data-anim="text" className={sectionTitle}>Find me</h2>
        <ul className="flex flex-col gap-3">
          {mainLinks.map((link, index) => (
            <li key={link.title}>
              <AnimatedContent delay={index * 0.06} distance={18} scale={0.9} ease="back.out(1.7)">
                <a
                  href={link.url}
                  {...(link.kind === "download"
                    ? { download: true }
                    : link.kind === "external"
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  onClick={playClickSound}
                  className={`group block ${focusRing}`}
                >
                  <MagicCard className="h-full rounded-none transition-transform hover:-translate-y-0.5">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="shrink-0 border-2 border-[var(--cute-text)] bg-[var(--cute-highlight)] p-3 text-[var(--cute-text)]">
                        <link.icon className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold">{link.title}</p>
                        <p className="truncate text-sm opacity-90">{link.detail}</p>
                      </div>
                      <ArrowUpRight className="size-5 shrink-0 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </CardContent>
                  </MagicCard>
                </a>
              </AnimatedContent>
            </li>
          ))}
        </ul>
      </section>

      {(isLoading || latestPosts.length > 0) && (
        <section aria-labelledby="links-writing" className="flex flex-col">
          <h2 id="links-writing" data-anim="text" className={sectionTitle}>Latest writing</h2>
          <ul className="flex flex-col gap-3">
            {isLoading
              ? [0, 1, 2].map((i) => (
                  <li key={i}><Skeleton className="h-16 w-full rounded-none" /></li>
                ))
              : latestPosts.map((post, index) => (
                  <li key={post.id}>
                    <AnimatedContent delay={index * 0.06} distance={18} scale={0.9} ease="back.out(1.7)">
                      <a href={post.url} target="_blank" rel="noopener noreferrer" onClick={playClickSound} className={`group block ${focusRing}`}>
                        <MagicCard className="h-full rounded-none transition-transform hover:-translate-y-0.5">
                          <CardContent className="flex flex-col gap-1 p-4">
                            <p className="line-clamp-1 font-bold">{post.title}</p>
                            <p className="text-sm opacity-90">
                              {format(new Date(post.publishedAt), "MMM dd, yyyy")} · {post.readTimeInMinutes} min read
                            </p>
                          </CardContent>
                        </MagicCard>
                      </a>
                    </AnimatedContent>
                  </li>
                ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="links-code" className="flex flex-col">
        <h2 id="links-code" data-anim="text" className={sectionTitle}>Code</h2>
        <ul className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {REPOS.map((repo, index) => (
            <li key={repo.repo}>
              <AnimatedContent delay={index * 0.06} distance={18} scale={0.9} ease="back.out(1.7)" className="h-full">
                <a href={`${PROFILE.github}/${repo.repo}`} target="_blank" rel="noopener noreferrer" onClick={playClickSound} className={`group block h-full ${focusRing}`}>
                  <MagicCard className="h-full rounded-none transition-transform hover:-translate-y-0.5">
                    <CardContent className="flex h-full flex-col gap-3 p-4">
                      <div className="flex items-center gap-2">
                        <Github className="size-4 shrink-0" aria-hidden="true" />
                        <p className="truncate font-bold">{repo.name}</p>
                      </div>
                      <p className="flex-1 text-sm opacity-90">{repo.blurb}</p>
                      <div className="flex flex-wrap gap-1">
                        {repo.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="pixel-badge text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </MagicCard>
                </a>
              </AnimatedContent>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
