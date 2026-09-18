import { Phone, StickyNote } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/shared/status-badge';
import { StatusActions } from './status-actions';
import { formatCurrency } from '@/lib/utils/format';
import type { Appointment, Service, User } from '@/types';

interface ClientRowProps {
  appointment: Appointment;
  client?: User;
  service?: Service;
  showActions?: boolean;
}

export function ClientRow({ appointment, client, service, showActions = true }: ClientRowProps) {
  return (
    <article className="surface-card rounded-3xl p-5 transition-colors duration-300 hover:border-white/15">
      <div className="flex flex-wrap items-start gap-4">
        <div className="text-center">
          <p className="font-display text-2xl text-white">{appointment.startTime}</p>
          <p className="text-xs text-ink-600">até {appointment.endTime}</p>
        </div>

        <span className="hidden h-14 w-px bg-white/[0.08] sm:block" aria-hidden />

        <Avatar name={client?.name ?? 'Cliente'} src={client?.avatarUrl} size="lg" ring />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-medium text-white">{client?.name ?? 'Cliente'}</p>
            <StatusBadge status={appointment.status} />
          </div>

          <p className="mt-1 text-sm text-ink-400">
            {service?.name ?? 'Serviço'} ·{' '}
            {appointment.priceInCents === 0
              ? 'Incluso no plano'
              : formatCurrency(appointment.priceInCents)}
          </p>

          {client?.phone ? (
            <a
              href={`tel:${client.phone.replace(/\D/g, '')}`}
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-white"
            >
              <Phone className="size-3.5" />
              {client.phone}
            </a>
          ) : null}

          {appointment.notes || client?.notes ? (
            <p className="mt-3 flex items-start gap-2 rounded-2xl bg-white/[0.03] px-4 py-3 text-sm text-ink-400">
              <StickyNote className="mt-0.5 size-3.5 shrink-0 text-falcao-400" />
              <span>{[appointment.notes, client?.notes].filter(Boolean).join(' · ')}</span>
            </p>
          ) : null}
        </div>
      </div>

      {showActions ? (
        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <StatusActions appointmentId={appointment.id} status={appointment.status} />
        </div>
      ) : null}
    </article>
  );
}
