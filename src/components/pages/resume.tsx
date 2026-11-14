import { useRef, useContext } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { ScrollContainerContext } from "@/components/animated-section"
import { animateTextReveal } from "@/lib/animations"
import AnimatedContent from "@/components/AnimatedContent"
import { PROFILE, SKILL_CATEGORIES, INTERESTS } from "@/data/profile"
import Timeline1 from "@/components/ui/8bit/blocks/timeline1"

export default function Resume({ windowWidth }: { windowWidth?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useContext(ScrollContainerContext)

  useGSAP(() => {
    if (!containerRef.current) return
    const c = containerRef.current
    const root = scrollContainerRef?.current ?? null
    const ios = [
      ...animateTextReveal(gsap.utils.toArray('[data-anim="text"]', c), root),
    ]
    return () => ios.forEach(io => io.disconnect())
  }, { scope: containerRef, dependencies: [] })

  const education = [
    {
      degree: "Bachelor in Computer science",
      institution: "Lebanese University Tripoli, Lebanon",
      year: "",
      description: "",
    },
  ]

  const experience = [
    {
      role: "Full Stack Developer",
      company: "Sword group",
      period: "Aug 2025 - Present",
      achievements: [
        "Contributed to multiple Spring Boot and React projects using PostgreSQL, delivering scalable and maintainable enterprise applications.",
        "Integrated OpenAI to automate backend class generation, reducing manual development time by 20%.",
        "Enhanced report generation performance by 35% within an Islamic institute management system.",
      ],
    },
    {
      role: "Full Stack Developer",
      company: "Anchor holdings",
      period: "Jun 2021 - Aug 2025",
      achievements: [
        "Developed and implemented innovative backend and frontend solutions for multiple projects, resulting in a 30% increase in website traffic and a 20% decrease in page loading time.",
        "Led cross-functional teams of 5-7 developers and designers to deliver 3 high-profile projects on time and within budget, achieving 95%+ client satisfaction.",
        "Developed and implemented coding patterns to accelerate development, reducing project timelines by an average of 15% per project.",
      ],
    },
    {
      role: "Full Stack Developer",
      company: "Afaq",
      period: "Jan 2021 - Jun 2021",
      achievements: [
        "Rebuilt company website with React and Node.js, improving load time by 60% and reducing bounce rate by 25%.",
        "Developed real-time task management dashboard using WebSocket, increasing user satisfaction by 50% and reducing support tickets by 30%.",
        "Collaborated with cross-functional teams to integrate new design elements into the website, resulting in a visually appealing interface that contributed to a 20% increase in conversion rates.",
      ],
    },
  ]

  const leadership = [
    {
      role: "Mentor",
      company: "Anchor venture holdings",
      period: "Jun 2021 - Aug 2025",
      achievements: [
        "Mentored 10+ junior developers on React, Spring Boot, and company workflows, reducing onboarding time by 30% and increasing team productivity by 20%.",
        "Led technical planning for 4 major projects, managing sprints and architecture decisions, achieving 95% client satisfaction and 15% increase in profitability.",
        "Created training curriculum for Spring Boot and React, delivering workshops to 15+ employees with 90% proficiency rate.",
      ],
    },
  ]

  const skillCategories = SKILL_CATEGORIES
  const interests = INTERESTS.map((i) => i.name)

  return (
    <div ref={containerRef} className="space-y-8 max-w-4xl mx-auto pixel-text">
      <div className="flex justify-between items-center">
        <h1 data-anim="text" className="text-3xl font-bold pixel-title">Resume</h1>
        <AnimatedContent distance={0}>
          <Button className="border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]" variant="outline" size="sm" asChild >
            <a href={PROFILE.resumePdf} download>
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </a>
          </Button>
        </AnimatedContent>
      </div>

      <div className={(windowWidth ?? 0) >= 760 ? "grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 items-start" : "space-y-8"}>
        <div className="space-y-8 min-w-0">
      <div>
        <h2 data-anim="text" className="portfolio-section-title pixel-title">Work Experience</h2>
        <div className="space-y-3">
          {experience.map((exp, index) => (
            <AnimatedContent key={index} delay={index * 0.09} distance={55} ease="back.out(1.4)">
              <Card className="pixel-card border-0 gap-3 py-4">
                <CardContent>
                  <div className="flex flex-col justify-between items-start gap-2 mb-1">
                    <div>
                      <h3 className="font-bold text-lg pixel-text">{exp.role}</h3>
                      <p className="opacity-85">{exp.company}</p>
                    </div>
                    <Badge variant="outline" className="mt-1 pixel-badge">{exp.period}</Badge>
                  </div>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {exp.achievements.map((a, i) => <li key={i} className="text-sm opacity-85">{a}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </AnimatedContent>
          ))}
        </div>
      </div>

      <div>
        <h2 data-anim="text" className="portfolio-section-title pixel-title">Leadership Experience</h2>
        <div className="space-y-3">
          {leadership.map((lead, index) => (
            <AnimatedContent key={index} delay={index * 0.09} distance={55} ease="back.out(1.4)">
              <Card className="pixel-card border-0 gap-3 py-4">
                <CardContent>
                  <div className="flex flex-col justify-between items-start gap-2 mb-1">
                    <div>
                      <h3 className="font-bold text-lg pixel-text">{lead.role}</h3>
                      <p className="opacity-85">{lead.company}</p>
                    </div>
                    <Badge variant="outline" className="mt-1 pixel-badge">{lead.period}</Badge>
                  </div>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {lead.achievements.map((a, i) => <li key={i} className="text-sm opacity-85">{a}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </AnimatedContent>
          ))}
        </div>
      </div>

        </div>
        <div className="space-y-8 min-w-0">
      <div>
        <h2 data-anim="text" className="portfolio-section-title pixel-title">Career path</h2>
        <Timeline1
          title=""
          description=""
          className="px-0 py-0"
          steps={experience.map((exp, i) => ({
            icon: exp.company.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
            title: exp.company,
            description: `${exp.role} · ${exp.period}`,
            badge: i === 0 ? "NOW" : undefined,
          }))}
        />
      </div>
      <div>
        <h2 data-anim="text" className="portfolio-section-title pixel-title">Education</h2>
        <div className="space-y-3">
          {education.map((edu, index) => (
            <AnimatedContent key={index} delay={index * 0.09} distance={55} ease="back.out(1.4)">
              <Card className="pixel-card border-0 gap-3 py-4">
                <CardContent>
                  <div className="flex flex-col justify-between items-start gap-2 mb-1">
                    <div>
                      <h3 className="font-bold text-lg pixel-text">{edu.degree}</h3>
                      <p className="opacity-85">{edu.institution}</p>
                    </div>
                    {edu.year && <Badge variant="outline" className="mt-1 pixel-badge">{edu.year}</Badge>}
                  </div>
                  {edu.description && <p className="text-sm opacity-85">{edu.description}</p>}
                </CardContent>
              </Card>
            </AnimatedContent>
          ))}
        </div>
      </div>

      <div>
        <h2 data-anim="text" className="portfolio-section-title pixel-title">Skills</h2>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {skillCategories.map((cat, index) => (
            <AnimatedContent key={index} delay={index * 0.07} distance={18} scale={0.78} ease="back.out(1.7)">
              <Card className="pixel-card border-0 gap-3 py-4 h-full">
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-2xl">{cat.icon}</div>
                    <h3 className="text-xl font-bold pixel-text">{cat.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-sm py-1 pixel-badge hover:bg-[var(--cute-highlight)]">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedContent>
          ))}
        </div>
      </div>

      <AnimatedContent distance={55} ease="back.out(1.4)">
        <h2 className="portfolio-section-title pixel-title">Interests</h2>
        <Card className="pixel-card border-0 gap-3 py-4">
          <CardContent>
            <ul className="space-y-2">
              {interests.map((interest, index) => (
                <li key={index} className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-[var(--cute-text)]" />
                  <span className="pixel-text">{interest}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </AnimatedContent>
        </div>
      </div>
    </div>
  )
}
