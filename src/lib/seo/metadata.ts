import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config/site';

interface PageMetadataInput {
  title: string;
  description: string;
  path?: string;
  images?: string[];
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path = '/',
  images,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = new URL(path, siteConfig.url).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url,
      siteName: siteConfig.name,
      title,
      description,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}
