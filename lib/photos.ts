// Placeholder Unsplash photography for the marketing surface.
// Each entry is a single source of truth — swap the `url` field once
// commissioned photography arrives. The `credit` field exists to honour
// Unsplash's attribution norm and can be removed alongside the swap.
//
// Tuning:
//   - URLs are passed through `images.unsplash.com` with `w=` widths
//     that match Next.js Image sizes downstream.
//   - `auto=format` lets Unsplash deliver AVIF/WebP where supported.
//   - All photos chosen here lean dark/moody to fit the charcoal +
//     gold aesthetic; brighter shots will need the gradient overlays
//     in Hero/Fleet to be tuned.

export interface Photo {
  url: string
  alt: string
  credit?: { name: string; href: string }
}

const u = (id: string, w = 1920) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`

export const heroPhoto: Photo = {
  url: u('1503376780353-7e6692767b70', 2400),
  alt: 'Black Mercedes-Benz under low light',
  credit: { name: 'Igor Ovsyannykov', href: 'https://unsplash.com' },
}

export const fleetPhotos: Record<'sedan' | 'van' | 'vip', Photo> = {
  sedan: {
    url: u('1492144534655-ae79c964c9d7', 1400),
    alt: 'Executive sedan exterior',
    credit: { name: 'Erik Mclean', href: 'https://unsplash.com' },
  },
  van: {
    url: u('1546614042-7df3c24c9e5d', 1400),
    alt: 'Executive van exterior',
    credit: { name: 'Unsplash', href: 'https://unsplash.com' },
  },
  vip: {
    url: u('1568605114967-8130f3a36994', 1400),
    alt: 'VIP sedan interior detail',
    credit: { name: 'Unsplash', href: 'https://unsplash.com' },
  },
}
