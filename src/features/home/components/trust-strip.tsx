import { CalendarCheck, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Container } from '@/components/shared/section';
import { Stagger, StaggerItem } from '@/components/shared/reveal';

const items = [
  { icon: Users, value: '+1.000', label: 'clientes atendidos' },
  { icon: CalendarCheck, value: '98%', label: 'horários cumpridos no minuto' },
  { icon: Sparkles, value: '4,9', label: 'nota média dos barbeiros' },
  { icon: ShieldCheck, value: '7 anos', label: 'de casa aberta em Curitiba' },
];

export function TrustStrip() {
  return (
    <section className="border-y border-white/[0.06] bg-ink-900/40 py-10">
      <Container>
        <Stagger className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {items.map((item) => (
            <StaggerItem key={item.label}>
              <div className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-falcao-400">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <p className="font-display text-xl text-white">{item.value}</p>
                  <p className="text-xs leading-tight text-ink-500">{item.label}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
