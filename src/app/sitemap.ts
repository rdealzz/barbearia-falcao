import type { MetadataRoute } from 'next';
import { db } from '@/services';
import { siteConfig } from '@/lib/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [barbers, plans] = await Promise.all([db.barbers.list(), db.plans.list()]);
  const now = new Date();

  const staticRoutes = [
    { path: '/', priority: 1 },
    { path: '/sobre', priority: 0.7 },
    { path: '/servicos', priority: 0.9 },
    { path: '/galeria', priority: 0.8 },
    { path: '/barbeiros', priority: 0.8 },
    { path: '/planos', priority: 0.8 },
    { path: '/contato', priority: 0.6 },
    { path: '/agendar', priority: 0.9 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: new URL(route.path, siteConfig.url).toString(),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: route.priority,
    })),
    ...barbers.map((barber) => ({
      url: new URL(`/barbeiros/${barber.slug}`, siteConfig.url).toString(),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...plans.map((plan) => ({
      url: new URL(`/planos/${plan.slug}`, siteConfig.url).toString(),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
