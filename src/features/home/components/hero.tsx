'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Scissors, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/shared/section';
import { MediaFrame } from '@/components/shared/media-frame';
import { media } from '@/lib/data/media';
import { siteConfig } from '@/lib/config/site';

const transition = { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };

export function Hero() {
  return (
    <section className="relative isolate grain overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <div className="absolute inset-0 -z-10">
        <MediaFrame
          src={media.hero}
          alt="Atendimento na Barbearia Falcão"
          priority
          sizes="100vw"
          className="size-full rounded-none"
          imageClassName="scale-105 object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-canvas/70 via-canvas/85 to-canvas" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-canvas to-transparent" />
        <div
          className="absolute -left-24 top-1/3 size-[30rem] rounded-full bg-falcao-700/20 blur-[120px]"
          aria-hidden
        />
      </div>

      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-tint px-4 py-1.5 text-xs font-medium tracking-wide text-muted"
            >
              <Scissors className="size-3.5 text-falcao-400" />
              Desde {siteConfig.foundedIn} em Curitiba · {siteConfig.address.district}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.08 }}
              className="mt-7 text-balance text-4xl font-semibold leading-[1.05] text-content sm:text-6xl lg:text-7xl"
            >
              Está na cara quando o corte é{' '}
              <span className="text-gradient-metal">bem feito</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.16 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
            >
              Corte, barba e cuidado para todas as idades, com hora marcada. Barbeiros
              especialistas, ambiente pensado no detalhe e uma agenda que respeita o seu tempo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.24 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg">
                <Link href="/agendar">
                  Agendar agora
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/barbeiros">Conheça nossos barbeiros</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...transition, delay: 0.36 }}
              className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['R', 'L', 'D', 'M'].map((letter) => (
                    <span
                      key={letter}
                      className="grid size-9 place-items-center rounded-full border-2 border-canvas bg-tint-strong text-xs font-semibold text-muted"
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-falcao-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {siteConfig.reputation.rating.toLocaleString('pt-BR')} no{' '}
                    {siteConfig.reputation.source} ·{' '}
                    {siteConfig.reputation.reviewsCount} avaliações
                  </p>
                </div>
              </div>

              <div className="h-10 w-px bg-line" aria-hidden />

              <div>
                <p className="font-display text-2xl text-content">
                  {new Date().getFullYear() - siteConfig.foundedIn} anos
                </p>
                <p className="text-xs text-muted">de tradição em {siteConfig.address.district}</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ...transition, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <MediaFrame
              src={media.heroPortrait}
              alt="Barbeiro finalizando um corte"
              className="aspect-[4/5] w-full shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
              sizes="(max-width: 1024px) 0px, 40vw"
              priority
            />
            <div className="glass absolute -bottom-6 -left-8 w-56 rounded-2xl border border-line p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Próximo horário</p>
              <p className="mt-1 font-display text-xl text-content">Hoje, 16:00</p>
              <p className="mt-1 text-xs text-muted">Corte + Barba · 1h10</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
