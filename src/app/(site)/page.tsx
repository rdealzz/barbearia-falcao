import { db } from '@/services';
import { barbershopJsonLd } from '@/lib/seo/structured-data';
import {
  BarbersPreview,
  CtaSection,
  GalleryPreview,
  Hero,
  LocationSection,
  PlansPreview,
  ProcessSection,
  ServicesPreview,
  Reputation,
  TrustStrip,
} from '@/features/home/components';

export default async function HomePage() {
  const [services, featured, barbers, plans] = await Promise.all([
    db.services.list(),
    db.services.list({ featured: true }),
    db.barbers.list(),
    db.plans.list(),
  ]);

  const highlightedPlans = [...plans]
    .sort((a, b) => Number(b.isPopular) - Number(a.isPopular))
    .slice(0, 3)
    .sort((a, b) => a.priceInCents - b.priceInCents);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(barbershopJsonLd(services)) }}
      />
      <Hero />
      <TrustStrip />
      <ServicesPreview services={featured.slice(0, 3)} />
      <ProcessSection />
      <GalleryPreview />
      <BarbersPreview barbers={barbers} />
      <PlansPreview plans={highlightedPlans} />
      <Reputation />
      <LocationSection />
      <CtaSection />
    </>
  );
}
