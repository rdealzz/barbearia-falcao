'use client';

import { CalendarClock, Loader2, MapPin, Scissors, X } from 'lucide-react';
import { useActionState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/status-badge';
import { cancelBookingAction } from '@/features/booking/actions';
import { initialActionState } from '@/features/auth/state';
import { formatCurrency, formatDateTime, formatDuration } from '@/lib/utils/format';
import { siteConfig } from '@/lib/config/site';
import type { Appointment, Barber, Service } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
  service?: Service;
  barber?: Barber;
  cancellable?: boolean;
}

export function AppointmentCard({
  appointment,
  service,
  barber,
  cancellable = false,
}: AppointmentCardProps) {
  const [state, formAction, pending] = useActionState(cancelBookingAction, initialActionState);

  return (
    <article className="surface-card rounded-3xl p-5 transition-colors duration-300 hover:border-white/15">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={barber?.name ?? 'Barbearia Falcão'} src={barber?.avatarUrl} size="md" />
          <div>
            <p className="font-medium text-white">{service?.name ?? 'Serviço'}</p>
            <p className="text-sm text-ink-500">com {barber?.name ?? 'a equipe'}</p>
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <div className="flex items-center gap-2 text-ink-300">
          <CalendarClock className="size-4 shrink-0 text-falcao-400" />
          {formatDateTime(appointment.date, appointment.startTime)}
        </div>
        <div className="flex items-center gap-2 text-ink-300">
          <Scissors className="size-4 shrink-0 text-falcao-400" />
          {service ? formatDuration(service.durationInMinutes) : '—'}
          <span className="text-ink-600">·</span>
          {appointment.priceInCents === 0
            ? 'Incluso no plano'
            : formatCurrency(appointment.priceInCents)}
        </div>
        <div className="flex items-center gap-2 text-ink-300">
          <MapPin className="size-4 shrink-0 text-falcao-400" />
          {siteConfig.address.street}, {siteConfig.address.number}
        </div>
      </dl>

      {appointment.notes ? (
        <p className="mt-4 rounded-2xl bg-white/[0.03] px-4 py-3 text-sm text-ink-400">
          {appointment.notes}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
        <span className="font-mono text-xs tracking-widest text-ink-600">{appointment.code}</span>

        {cancellable ? (
          <form action={formAction}>
            <input type="hidden" name="appointmentId" value={appointment.id} />
            <Button type="submit" variant="danger" size="sm" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
              Cancelar
            </Button>
          </form>
        ) : null}
      </div>

      {state.status === 'error' && state.message ? (
        <p role="alert" className="mt-3 text-sm text-falcao-300">
          {state.message}
        </p>
      ) : null}
    </article>
  );
}
