import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { MediaFrame } from '@/components/shared/media-frame';
import { Stagger, StaggerItem } from '@/components/shared/reveal';
import { cn } from '@/lib/utils/cn';
import type { GalleryItem } from '@/lib/data/media';

interface GalleryGridProps {
  items: GalleryItem[];
  className?: string;
}

export function GalleryGrid({ items, className }: GalleryGridProps) {
  return (
    <Stagger className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((item, index) => (
        <StaggerItem key={item.title} className="h-full">
          <article className="group relative h-full overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow-card)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-falcao-500/40">
            <MediaFrame
              src={item.src}
              alt={item.title}
              fallbackLabel={item.title}
              className="aspect-[4/5] w-full rounded-none"
              imageClassName="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index < 3}
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#121212] via-[#121212]/70 to-transparent p-5 pt-16">
              <p className="font-display text-lg text-[#F2E4C9]">{item.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#F2E4C9]/70">{item.description}</p>
            </div>

            {item.serviceSlug ? (
              <Link
                href={`/agendar?servico=${item.serviceSlug}`}
                className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-falcao-600 px-4 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 focus-visible:opacity-100"
              >
                Agendar
                <ArrowUpRight className="size-3.5" />
              </Link>
            ) : null}
          </article>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
