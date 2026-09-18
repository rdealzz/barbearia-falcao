import { siteConfig } from '@/lib/config/site';
import type { Barber, Service } from '@/types';

export function barbershopJsonLd(services: Service[]) {
  const { address, social, openingHours } = siteConfig;

  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/og.png`,
    priceRange: '$$',
    sameAs: [social.instagram],
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${address.street}, ${address.number}`,
      addressLocality: address.city,
      addressRegion: address.state,
      addressCountry: address.country,
    },
    openingHours: openingHours
      .filter((entry) => entry.value !== 'Fechado')
      .map((entry) => `${entry.label} ${entry.value}`),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        name: service.name,
        description: service.shortDescription,
        price: (service.priceInCents / 100).toFixed(2),
        priceCurrency: 'BRL',
      })),
    },
  };
}

export function barberJsonLd(barber: Barber) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: barber.name,
    jobTitle: barber.role,
    description: barber.headline,
    worksFor: { '@type': 'HairSalon', name: siteConfig.name },
    url: `${siteConfig.url}/barbeiros/${barber.slug}`,
    sameAs: barber.instagramUrl ? [barber.instagramUrl] : undefined,
  };
}
