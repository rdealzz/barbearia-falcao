import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { siteConfig } from '@/lib/config/site';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Barbearia premium em Curitiba`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'barbearia curitiba',
    'barbearia novo mundo',
    'corte masculino curitiba',
    'barboterapia',
    'barbearia falcão',
    'agendamento barbearia',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Cuts & Shave`,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: '#0b0b0b',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
