import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { GalleryGrid } from '@/features/gallery/components/gallery-grid';
import { galleryItems } from '@/lib/data/media';

export function GalleryPreview() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Cortes"
            title="Trabalhos executados na cadeira"
            description="Uma amostra do que sai daqui todo dia — e o atalho para agendar o mesmo corte."
          />
          <Button asChild variant="ghost" size="sm" className="shrink-0">
            <Link href="/galeria">
              Ver a galeria completa
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <GalleryGrid items={galleryItems.slice(0, 3)} className="mt-14" />
      </Container>
    </Section>
  );
}
