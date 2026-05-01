import type { MetadataRoute } from 'next'
import { locales } from '@/app/[lang]/dictionaries'
import { posts } from '@/content/blog/posts'

const base = 'https://taxsi.cy'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/book', '/routes', '/about', '/contact', '/blog', '/faq', '/privacy', '/terms']

  const staticEntries = locales.flatMap((lang) =>
    staticPaths.map((path) => ({
      url: `${base}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
    }))
  )

  const blogEntries = posts.map((post) => ({
    url: `${base}/${post.locale}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticEntries, ...blogEntries]
}
