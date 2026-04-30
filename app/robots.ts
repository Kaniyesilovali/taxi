import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/confirm/', '/track/'],
    },
    sitemap: 'https://taxsi.cy/sitemap.xml',
  }
}
