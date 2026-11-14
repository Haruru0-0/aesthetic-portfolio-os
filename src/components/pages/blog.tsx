import { useRef, useContext, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "gsap"
import { MagicCard } from "@/components/ui/magic-card"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ScrollContainerContext } from "@/components/animated-section"
import { animateTextReveal, animateBlurText } from "@/lib/animations"
import AnimatedContent from "@/components/AnimatedContent"
import { useQuery } from "@tanstack/react-query"
import { fetchBlogPosts, type PostNode } from "@/lib/hashnode"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

interface BlogPost {
  id: string
  title: string
  brief: string
  publishedAt: string
  readTimeInMinutes: number
  coverImage?: { url: string }
  tags: Array<{ name: string }>
  url: string
}

export default function Blog({ windowWidth }: { windowWidth?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useContext(ScrollContainerContext)

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

  const [query, setQuery] = useState("")
  const { data: posts, isLoading, isError } = useQuery<PostNode[]>({
    queryKey: ["blogPosts"],
    queryFn: fetchBlogPosts,
  })

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto pixel-text">
        <div className={`flex gap-4 justify-between mb-6 ${(windowWidth ?? 0) >= 760 ? "flex-row items-center" : "flex-col items-start"}`}>
          <div>
            <Skeleton className="h-8 w-48 mb-2 rounded-none" />
            <Skeleton className="h-4 w-64 rounded-none" />
          </div>
          <Skeleton className="h-10 w-64 rounded-none" />
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-8 w-20 rounded-none" />)}
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full rounded-none" />
              <Skeleton className="h-4 w-20 rounded-none" />
              <Skeleton className="h-6 w-full rounded-none" />
              <Skeleton className="h-4 w-full rounded-none" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto pixel-text">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2 pixel-title">Failed to load posts</h2>
          <p className="text-muted-foreground mb-4 opacity-80">We couldn't fetch the blog posts. Please try again later.</p>
          <Button className="border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]" variant="outline" onClick={() => window.location.reload()}
            >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const blogPosts = posts?.map((post: BlogPost) => ({
    id: post.id,
    title: post.title,
    excerpt: post.brief,
    date: format(new Date(post.publishedAt), "MMM dd, yyyy"),
    readTime: `${post.readTimeInMinutes} min read`,
    category: post.tags.length > 0 ? post.tags[0].name : "General",
    image: post.coverImage?.url || "/placeholder.svg",
    url: post.url,
  })) || []

  const q = query.trim().toLowerCase()
  const visiblePosts = q
    ? blogPosts.filter((p) => `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(q))
    : blogPosts

  return (
    <div ref={containerRef} className="space-y-8 max-w-5xl mx-auto pixel-text">
      <div className={`flex gap-4 justify-between mb-6 ${(windowWidth ?? 0) >= 760 ? "flex-row items-center" : "flex-col items-start"}`}>
        <div>
          <h1 data-anim="text" className="text-3xl font-bold mb-1 pixel-title">Blog</h1>
          <p data-anim="fade" className="opacity-80">Thoughts, tutorials, and insights on web development</p>
        </div>
        <div className={`flex items-center ${(windowWidth ?? 0) >= 760 ? "w-64 shrink-0" : "w-full"}`}>
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" aria-label="Search articles" placeholder="Search articles..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8 w-full bg-[var(--card-bg)] border-2 border-[var(--cute-text)] rounded-none focus-visible:ring-2 focus-visible:ring-[var(--cute-text)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card-bg)] focus-visible:border-[var(--cute-text)]" />
          </div>
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {visiblePosts.map((post, index) => (
          <AnimatedContent key={post.id} delay={index * 0.07} distance={18} scale={0.78} ease="back.out(1.7)">
            <MagicCard className="h-full rounded-none pb-4 transition-transform hover:-translate-y-0.5">
              <div className="aspect-video overflow-hidden border-b-2 border-[var(--cute-text)]">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                  <Badge variant="secondary" className="pixel-badge hover:bg-[var(--cute-highlight)]">{post.category}</Badge>
                  <span className="text-xs opacity-80">{post.date}</span>
                </div>
                <CardTitle className="text-xl line-clamp-2 pixel-title">{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <p className="text-sm opacity-80 line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-0">
                <span className="text-xs opacity-80">{post.readTime}</span>
                <Button className="hover:bg-[var(--cute-highlight)] rounded-none" variant="ghost" size="sm" asChild >
                  <a href={post.url} target="_blank" rel="noopener noreferrer">Read More</a>
                </Button>
              </CardFooter>
            </MagicCard>
          </AnimatedContent>
        ))}
      </div>

      {visiblePosts.length === 0 && (
        <p role="status" className="text-center py-8 opacity-90">
          {q ? `No articles match "${query.trim()}".` : "No articles yet."}
        </p>
      )}
    </div>
  )
}
