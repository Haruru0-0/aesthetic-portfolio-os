import { useContext } from "react"
import HappyCat from "@/assets/mascots/happy-cat.webp"
import { useAchievements, ACHIEVEMENTS } from "@/components/achievement-context"
import { ScrollContainerContext } from "@/components/animated-section"
import AnimatedContent from "@/components/AnimatedContent"
import XpBar from "@/components/ui/8bit/xp-bar"
import { QuestLog, type Quest } from "@/components/ui/8bit/blocks/quest-log"

export default function Achievements() {
  const scrollContainerRef = useContext(ScrollContainerContext)
  const { unlocked } = useAchievements()
  const total = ACHIEVEMENTS.length
  const count = unlocked.size
  const pct = Math.round((count / total) * 100)
  const quests: Quest[] = ACHIEVEMENTS.map((a) => {
    const done = unlocked.has(a.id)
    return {
      id: a.id,
      title: done ? a.name : "??? ??? ???",
      description: done ? a.description : "Keep exploring...",
      status: done ? "completed" : "pending",
    }
  })

  return (
    <div className="pixel-achievement-screen min-h-full p-4 space-y-5">

      <AnimatedContent
        scale={0.82}
        ease="back.out(1.7)"
        className="relative p-5 text-center"
        style={{ border: "4px solid var(--cute-text)", boxShadow: "7px 7px 0 var(--cute-text)", background: "var(--card-bg)" }}
      >
        <div className="absolute pointer-events-none" style={{ inset: 5, border: "1px solid var(--cute-text)", opacity: 0.3 }} />
        <p className="text-xs tracking-[0.35em] uppercase font-bold opacity-80 mb-3">— PORTFOLIO OS v1.0 —</p>
        <div className="flex justify-center mb-3">
          <div style={{ border: "3px solid var(--cute-text)", boxShadow: "4px 4px 0 var(--cute-text)", lineHeight: 0, display: "inline-block" }}>
            <img src={HappyCat} alt="" className="w-16 h-16 block" style={{ imageRendering: "pixelated" }} />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-widest mb-1">★ ACHIEVEMENTS ★</h1>
        <p className="text-xs tracking-wider opacity-85 mb-4">EXPLORE THE PORTFOLIO TO UNLOCK THEM ALL</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <div className="px-3 py-1 text-xs font-bold tracking-wider"
            style={{ border: "2px solid var(--cute-text)", background: "var(--cute-text)", color: "var(--cute-on-text)", boxShadow: "2px 2px 0 rgba(0,0,0,0.2)" }}>
            SCORE: {count} / {total}
          </div>
          <div className="px-3 py-1 text-xs font-bold tracking-wider"
            style={{ border: "2px solid var(--cute-text)", background: "var(--cute-highlight)", color: "var(--cute-text)", boxShadow: "2px 2px 0 rgba(0,0,0,0.1)" }}>
            {pct}% COMPLETE
          </div>
        </div>
      </AnimatedContent>

      <AnimatedContent distance={55} ease="back.out(1.4)">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold tracking-widest" style={{ color: "var(--cute-text)" }}>▸ EXP POINTS</span>
          <span className="text-xs font-bold opacity-85">{count} / {total}</span>
        </div>
        <XpBar value={pct} variant="retro" aria-label={`Achievements ${count} of ${total} unlocked`} />
      </AnimatedContent>

      <AnimatedContent distance={55} ease="back.out(1.4)">
        <QuestLog title="Trophy Case" quests={quests} />
      </AnimatedContent>

      <AnimatedContent
        distance={0}
        className="text-center py-2 text-xs tracking-[0.3em] uppercase opacity-80"
        style={{ borderTop: "2px solid var(--cute-text)" }}
      >
        © AHMAD KANAAN — ALL RIGHTS RESERVED
      </AnimatedContent>
    </div>
  )
}
