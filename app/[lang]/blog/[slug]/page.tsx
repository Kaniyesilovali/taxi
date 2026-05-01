import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale, type Locale } from '@/app/[lang]/dictionaries'
import { getPost, getPostsByLocale, posts } from '@/content/blog/posts'

interface Props {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateStaticParams() {
  return posts.map((p) => ({ lang: p.locale, slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  if (!hasLocale(lang)) return {}
  const post = getPost(slug, lang as Locale)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: { type: 'article', publishedTime: post.date },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = await params
  if (!hasLocale(lang)) notFound()

  const post = getPost(slug, lang as Locale)
  if (!post) notFound()

  const dict = await getDictionary(lang as Locale)
  const t = dict.blog

  const { default: PostContent } = await import(
    `@/content/blog/${lang}/${slug}.mdx`
  )

  return (
    <div className="min-h-screen bg-sand">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link href={`/${lang}/blog`} className="text-sm text-gold hover:text-gold-dark transition-colors">
          {t.backToBlog}
        </Link>

        <p className="mt-6 text-sm text-clay">
          {new Date(post.date).toLocaleDateString(
            lang === 'ru' ? 'ru-RU' : lang === 'tr' ? 'tr-TR' : 'en-GB',
            { year: 'numeric', month: 'long', day: 'numeric' }
          )}
        </p>

        <article className="prose prose-stone mt-6 max-w-none [&_h1]:font-display [&_h1]:font-light [&_h1]:italic [&_h1]:text-ink [&_h2]:font-display [&_h2]:font-light [&_h2]:italic [&_h2]:text-ink [&_p]:text-clay [&_a]:text-gold [&_a:hover]:text-gold-dark [&_strong]:text-ink">
          <PostContent />
        </article>

        <div className="mt-12 rounded-xl border border-warm bg-cream p-6 text-center">
          <Link
            href={`/${lang}/book`}
            className="font-medium text-gold hover:text-gold-dark transition-colors"
          >
            {t.bookCta}
          </Link>
        </div>
      </div>
    </div>
  )
}
