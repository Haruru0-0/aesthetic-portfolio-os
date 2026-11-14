import { useRef, useContext, useEffect, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MagicCard } from "@/components/ui/magic-card"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import { ScrollContainerContext } from "@/components/animated-section"
import { animateTextReveal, animateBlurText } from "@/lib/animations"
import AnimatedContent from "@/components/AnimatedContent"
import facilify from "@/assets/projects/Facilify.webp"
import awqafRashaya from "@/assets/projects/AwqadRashaya.webp"
import nebula from "@/assets/projects/Nebula.webp"
import notionCraft from "@/assets/projects/NotionCraft-Ai.webp"
import portagen from "@/assets/projects/Portagen.webp"
import steamGamesAnalysis from "@/assets/projects/SteamGamesAnalysis.webp"
import malwareClassifier from "@/assets/projects/MalwareClassifier.webp"
import { createAutoplay } from "@/lib/autoplay"

export default function Projects({ windowWidth }: { windowWidth?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useContext(ScrollContainerContext)
  const [activeProject, setActiveProject] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [autoplayPlugins] = useState(() => createAutoplay())

  const isNarrow = windowWidth !== undefined && windowWidth < 700

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

  useEffect(() => {
    if (!carouselApi) return
    const onSelect = () => {
      setActiveProject(carouselApi.selectedScrollSnap())
      const idx = carouselApi.selectedScrollSnap()
      const slide = carouselApi.slideNodes()[idx]
      if (slide) {
        const targets = slide.querySelectorAll("h2, p, img, .flex-wrap, .mt-auto")
        gsap.fromTo(targets,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power2.out", overwrite: true }
        )
      }
    }
    onSelect()
    carouselApi.on("select", onSelect)
    return () => { carouselApi.off("select", onSelect) }
  }, [carouselApi])

  const projects = [
    {
      id: 1,
      title: "Facilify",
      description: "A full-featured facilities management platform, it provides owners, general contractors, and specialty contractors with the tools they need to get the job done.",
      image: facilify,
      tags: ["React", "Spring boot", "Postgres"],
      demoUrl: "https://www.facilify.com.au/",
      githubUrl: "https://github.com/hussamkhaled/nufm-web-deploy",
    },
    {
      id: 2,
      title: "Awqaf Rashaya",
      description: "The Awqaf Management System is a platform for managing mosques, cemeteries, religious schools, and imams, with built-in reporting tools to ensure efficient administration and transparency.",
      image: awqafRashaya,
      tags: ["React", "Spring boot", "Postgres", "OpenAi"],
      demoUrl: "https://awqaf-qa.onrender.com",
      // Client system: no public repository.
      githubUrl: undefined as string | { frontend: string; backend: string } | undefined,
    },
    {
      id: 3,
      title: "Nebula",
      description: "Nebula is a modern AI Agent Platform designed for creating, managing, and interacting with specialized AI agents.",
      image: nebula,
      tags: ["React", "Node js", "Postgres"],
      demoUrl: "https://nebula-ai0.vercel.app/",
      githubUrl: "https://github.com/Haruru0-0/Nebula",
    },
    {
      id: 4,
      title: "NotionCraft-ai",
      description: "NotionCraft AI: A Next.js web app mimicking Notion's rich text editor with AI-powered chat and writing features.",
      image: notionCraft,
      tags: ["Next.js", "Supabase", "Vercel ai sdk"],
      demoUrl: "https://notioncraft-ai-silk.vercel.app/",
      githubUrl: "https://github.com/Haruru0-0/notioncraft-ai",
    },
    {
      id: 5,
      title: "Portagen",
      description: "PortaGen is a web-based portfolio generator that allows users to create customizable desktop environments, lock screens, and interactive windows for showcasing projects and content.",
      image: portagen,
      tags: ["Next.js", "Supabase", "Google Drive integration", "Spotify integration"],
      demoUrl: "https://porta-gen-eta.vercel.app/",
      githubUrl: "https://github.com/Haruru0-0/PortaGen",
    },
    {
      id: 6,
      title: "Steam Games Analysis",
      description: "A data analysis of 139,580 Steam games ending in a model that predicts a game's audience before launch. Seven data-quality issues traced and fixed, an accuracy score proven worse than a constant, and a self-caught leakage bug — with an interactive dashboard exploring the findings.",
      image: steamGamesAnalysis,
      tags: ["Python", "Pandas", "Scikit-learn", "Streamlit"],
      demoUrl: "https://steam-games-analysis-demo.streamlit.app/",
      githubUrl: "https://github.com/Haruru0-0/steam-games-analysis",
    },
    {
      id: 7,
      title: "Malware Classifier",
      description: "A static Windows-malware classifier trained on EMBER2024 and tested on files newer than anything it saw in training. It catches 93.8% of malware at a 1% false-positive rate, shows the random split overstating that by 3 points, and explains each verdict with SHAP. The public demo is research only, not antivirus.",
      image: malwareClassifier,
      tags: ["Python", "LightGBM", "SHAP", "Streamlit"],
      demoUrl: "https://malware-classifier-h.streamlit.app",
      githubUrl: "https://github.com/Haruru0-0/malware-classifier",
    },
  ]

  // The carousel highlights the three most recent projects; the grid below lists all of them.
  const featured = [projects[6], projects[5], projects[4]]

  return (
    <div ref={containerRef} className="space-y-8 max-w-5xl mx-auto pixel-text">
      <div className="text-center">
        <h1 data-anim="text" className="text-3xl font-bold mb-2 pixel-title">My Projects</h1>
        <p data-anim="fade" className="opacity-80">A showcase of my best work and side projects</p>
      </div>

      <AnimatedContent scale={0.82} ease="back.out(1.7)" className="relative">
        <Carousel
          setApi={setCarouselApi}
          plugins={autoplayPlugins}
          opts={{ align: "start", loop: true }}
        >
          <div className="flex items-center gap-2">
            {!isNarrow && (
              <div className="flex items-center justify-center shrink-0">
                <CarouselPrevious className="static translate-x-0 translate-y-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
              </div>
            )}
            <CarouselContent className="-ml-4 items-stretch flex-1">
              {featured.map((project) => (
                <CarouselItem key={project.id} className="pl-4">
                  <Card className="pixel-card border-0 gap-3 py-4 shadow-lg overflow-hidden h-full flex flex-col">
                    <div
                      className="grid gap-2 px-4 flex-1"
                      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 400px), 1fr))" }}
                    >
                      <div className="aspect-video overflow-hidden w-full max-w-full mt-4 border-2 border-[var(--cute-text)]">
                        <img
                          src={project.image || `/placeholder.svg?height=300&width=500`}
                          alt={project.title}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      <div className="p-6 flex flex-col">
                        <h2 className="text-2xl font-bold mb-2 pixel-title">{project.title}</h2>
                        <p className="mb-4 opacity-90">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="pixel-badge hover:bg-[var(--cute-highlight)]">{tag}</Badge>
                          ))}
                        </div>
                        <div className="mt-auto flex flex-wrap gap-3">
                          <Button asChild className="flex-grow sm:flex-grow-0 border-2 border-[var(--cute-text)] rounded-none bg-[var(--cute-text)] text-[var(--cute-on-text)] hover:bg-[var(--cute-text)]/90">
                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                            </a>
                          </Button>
                          {!project.githubUrl ? null : typeof project.githubUrl === "string" ? (
                            <Button variant="outline" asChild className="flex-grow sm:flex-grow-0 border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]">
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 h-4 w-4" /> GitHub
                              </a>
                            </Button>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex-grow sm:flex-grow-0 border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]">
                                  <Github className="mr-2 h-4 w-4" /> Code
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="z-[9999] border-2 border-[var(--cute-text)] bg-[var(--card-bg)] rounded-none">
                                <DropdownMenuItem asChild className="rounded-none focus:bg-[var(--cute-highlight)] cursor-pointer">
                                  <a href={project.githubUrl.frontend} target="_blank" rel="noopener noreferrer">Frontend</a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-none focus:bg-[var(--cute-highlight)] cursor-pointer">
                                  <a href={project.githubUrl.backend} target="_blank" rel="noopener noreferrer">Backend</a>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            {!isNarrow && (
              <div className="flex items-center justify-center shrink-0">
                <CarouselNext className="static translate-x-0 translate-y-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
              </div>
            )}
          </div>
          {isNarrow && (
            <div className="flex justify-center gap-4 mt-4">
              <CarouselPrevious className="static translate-x-0 translate-y-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
              <CarouselNext className="static translate-x-0 translate-y-0 border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
            </div>
          )}
        </Carousel>
        <div className="flex justify-center mt-4 gap-2">
          {featured.map((project, index) => (
            <button
              key={project.id}
              aria-label={`Show ${project.title}`}
              aria-current={index === activeProject}
              className={`cursor-pointer w-3 h-3 border border-[var(--cute-text)] ${index === activeProject ? "bg-[var(--cute-text)]" : "bg-transparent"}`}
              onClick={() => carouselApi?.scrollTo(index)}
            />
          ))}
        </div>
      </AnimatedContent>

      <h2 data-anim="text" className="text-2xl font-bold pixel-title border-b-2 border-[var(--cute-text)] inline-block mt-8">All projects</h2>
      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {projects.map((project, index) => (
          <AnimatedContent key={project.id} delay={index * 0.07} distance={18} scale={0.78} ease="back.out(1.7)">
            <MagicCard className="h-full rounded-none pb-4 transition-transform hover:-translate-y-0.5">
              <div className="aspect-video overflow-hidden border-b-2 border-[var(--cute-text)]">
                <img
                  src={project.image || `/placeholder.svg?height=200&width=400`}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <CardContent className="flex-grow">
                <h3 className="text-xl font-bold mb-2 pixel-title">{project.title}</h3>
                <p className="text-sm opacity-85 mb-4 line-clamp-4">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs pixel-badge hover:bg-[var(--cute-highlight)]">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex gap-2 w-full">
                  {!project.githubUrl ? null : typeof project.githubUrl === "string" ? (
                    <Button variant="outline" size="sm" className="flex-1 border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" /> Code
                      </a>
                    </Button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]">
                          <Github className="mr-2 h-4 w-4" /> Code
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="z-[9999] border-2 border-[var(--cute-text)] bg-[var(--card-bg)] rounded-none">
                        <DropdownMenuItem asChild className="rounded-none focus:bg-[var(--cute-highlight)] cursor-pointer">
                          <a href={project.githubUrl.frontend} target="_blank" rel="noopener noreferrer">Frontend</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-none focus:bg-[var(--cute-highlight)] cursor-pointer">
                          <a href={project.githubUrl.backend} target="_blank" rel="noopener noreferrer">Backend</a>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Button size="sm" className="flex-1 border-2 border-[var(--cute-text)] rounded-none bg-[var(--cute-text)] text-[var(--cute-on-text)] hover:bg-[var(--cute-text)]/90" asChild>
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" /> Demo
                    </a>
                  </Button>
                </div>
              </CardFooter>
            </MagicCard>
          </AnimatedContent>
        ))}
      </div>
    </div>
  )
}
