import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { getPostsByLocale } from '@/content/blog/posts'

interface Props {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}
  const dict = await getDictionary(lang as Locale)
  return {
    title: dict.blog.title,
    description: dict.blog.subtitle,
    alternates: { languages: { en: '/en/blog', tr: '/tr/blog', ru: '/ru/blog' } },
  }
}

export default async function BlogIndexPage({ params }: Props) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang as Locale)
  const localePosts = getPostsByLocale(lang as Locale)
  const t = dict.blog

  return (
    <div className="min-h-screen bg-sand">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-4xl font-light italic text-ink">{t.title}</h1>
        <p className="mt-3 text-clay">{t.subtitle}</p>

        {localePosts.length === 0 ? (
          <p className="mt-12 text-clay">{t.noPosts}</p>
        ) : (
          <div className="mt-12 grid gap-6">
            {localePosts.map((post) => (
              <Link
                key={post.slug}
                href={`/${lang}/blog/${post.slug}`}
                className="group rounded-2xl border border-warm bg-cream p-6 transition-colors hover:border-gold/40"
              >
                <p className="text-xs text-clay">
                  {new Date(post.date).toLocaleDateString(
                    lang === 'ru' ? 'ru-RU' : lang === 'tr' ? 'tr-TR' : 'en-GB',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </p>
                <h2 className="mt-2 font-display text-xl font-light italic text-ink group-hover:text-gold transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-clay">{post.description}</p>
                <p className="mt-4 text-sm font-medium text-gold">{t.readMore}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
