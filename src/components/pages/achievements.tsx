import { Check, LockKeyhole, Trophy } from "lucide-react"
import HappyCat from "@/assets/mascots/happy-cat.webp"
import { useAchievements, ACHIEVEMENTS } from "@/components/achievement-context"
import AnimatedContent from "@/components/AnimatedContent"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Achievements() {
  const { unlocked } = useAchievements()
  const total = ACHIEVEMENTS.length
  const count = ACHIEVEMENTS.filter((achievement) => unlocked.has(achievement.id)).length
  const pct = Math.round((count / total) * 100)

  return (
    <div className="mx-auto max-w-4xl space-y-8 pixel-text">
      <header className="text-center">
        <AnimatedContent scale={0.82} ease="back.out(1.7)" className="inline-block">
          <img src={HappyCat} alt="" className="mx-auto mb-4 h-24 w-24 object-contain" />
        </AnimatedContent>
        <h1 className="pixel-title mb-2 text-3xl font-bold">Achievements</h1>
        <p className="opacity-80">Explore the portfolio to unlock them all.</p>
      </header>

      <section aria-labelledby="achievement-progress-title">
        <h2 id="achievement-progress-title" className="portfolio-section-title">Your progress</h2>
        <Card className="pixel-card gap-4 py-5">
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold">
                <Trophy className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{count} of {total} unlocked</span>
              </div>
              <Badge variant="secondary">{pct}% complete</Badge>
            </div>
            <div
              role="progressbar"
              aria-label="Achievements unlocked"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={count}
              aria-valuetext={`${count} of ${total} achievements unlocked`}
              className="h-3 overflow-hidden bg-[var(--cute-highlight)]"
            >
              <div className="h-full bg-[var(--cute-text)] transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${pct}%` }} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="achievement-collection-title">
        <h2 id="achievement-collection-title" className="portfolio-section-title">Trophy case</h2>
        <ul className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))" }}>
          {ACHIEVEMENTS.map((achievement) => {
            const done = unlocked.has(achievement.id)
            const StatusIcon = done ? Check : LockKeyhole
            return (
              <li key={achievement.id}>
                <Card className="pixel-card h-full gap-0 py-5">
                  <CardContent className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--cute-border)] bg-[var(--cute-highlight)]">
                      <StatusIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-xs opacity-80">{done ? "Unlocked" : "Locked"}</p>
                      <h3 className="font-bold">{done ? achievement.name : "Hidden achievement"}</h3>
                      <p className="mt-2 text-sm leading-relaxed opacity-80">
                        {done ? achievement.description : "Keep exploring..."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
