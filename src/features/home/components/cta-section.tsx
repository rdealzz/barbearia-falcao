import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/shared/section';
import { Reveal } from '@/components/shared/reveal';
import { MediaFrame } from '@/components/shared/media-frame';
import { media } from '@/lib/data/media';

export function CtaSection() {
  return (
    <section className="pb-24">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-4xl border border-line px-6 py-16 text-center sm:px-16 sm:py-24">
            <MediaFrame
              src={media.shopWide}
              alt=""
              className="absolute inset-0 -z-10 rounded-none"
              imageClassName="opacity-25"
              sizes="100vw"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-canvas via-canvas/90 to-falcao-600/15 dark:to-falcao-950/70" />

            <h2 className="text-balance font-display text-3xl text-content sm:text-5xl">
              Sua próxima cadeira já está esperando
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
              Escolha o serviço, o barbeiro e o horário. Em menos de um minuto seu lugar está
              garantido.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/agendar">
                  Agendar agora
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/planos">Ver planos de assinatura</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
