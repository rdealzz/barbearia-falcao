import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buildMetadata } from '@/lib/seo/metadata';
import { Button } from '@/components/ui/button';
import { Container, Section, SectionHeading } from '@/components/shared/section';
import { InstagramIcon } from '@/components/shared/icons';
import { GalleryGrid } from '@/features/gallery/components/gallery-grid';
import { galleryItems } from '@/lib/data/media';
import { siteConfig } from '@/lib/config/site';

export const metadata: Metadata = buildMetadata({
  title: 'Cortes',
  description:
    'Galeria de cortes, barbas e trabalhos executados pela equipe da Barbearia Falcão em Curitiba.',
  path: '/galeria',
});

export default function GalleryPage() {
  return (
    <>
      <Section spacing="pageTight">
        <Container>
          <SectionHeading
            eyebrow="Cortes"
            title="O trabalho da equipe, de perto"
            description="Referências reais executadas na cadeira da Falcão. Viu um corte que combina com você? Agende direto pela foto."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/agendar">
                Agendar meu horário
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer">
                <InstagramIcon className="size-4" />
                Ver mais no Instagram
              </a>
            </Button>
          </div>
        </Container>
      </Section>

      <Section spacing="tight">
        <Container>
          <GalleryGrid items={galleryItems} />
        </Container>
      </Section>
    </>
  );
}
