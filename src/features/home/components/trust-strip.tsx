import { CalendarCheck, MapPin, ShieldCheck, Star } from 'lucide-react';
import { Container } from '@/components/shared/section';
import { Stagger, StaggerItem } from '@/components/shared/reveal';
import { siteConfig } from '@/lib/config/site';

const { reputation, foundedIn, address } = siteConfig;

const items = [
  {
    icon: Star,
    value: reputation.rating.toLocaleString('pt-BR'),
    label: `de nota no ${reputation.source}`,
  },
  {
    icon: ShieldCheck,
    value: reputation.reviewsCount.toLocaleString('pt-BR'),
    label: 'avaliações de clientes',
  },
  {
    icon: CalendarCheck,
    value: `${new Date().getFullYear() - foundedIn} anos`,
    label: `de casa aberta desde ${foundedIn}`,
  },
  { icon: MapPin, value: address.district, label: `${address.city}/${address.state}` },
];

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-canvas-subtle py-10">
      <Container>
        <Stagger className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {items.map((item) => (
            <StaggerItem key={item.label}>
              <div className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-line bg-tint text-falcao-400">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <p className="font-display text-xl text-content">{item.value}</p>
                  <p className="text-xs leading-tight text-muted">{item.label}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
