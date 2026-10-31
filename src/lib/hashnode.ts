import { blogPosts } from '@/data/blog-posts'

interface CoverImage {
  url: string
}

interface Tag {
  name: string
}

export interface PostNode {
  id: string
  title: string
  brief: string
  publishedAt: string
  readTimeInMinutes: number
  coverImage?: CoverImage
  tags: Tag[]
  url: string
}

// Posts are downloaded from the Hashnode RSS feed at build time (scripts/fetch-blog.mjs).
// Hashnode's GraphQL API now requires a paid plan, and the feed has no CORS headers for browsers.
export async function fetchBlogPosts(): Promise<PostNode[]> {
  return blogPosts
}
