'use client';

import { useActionState, useState } from 'react';
import {
  CalendarOff,
  Check,
  Loader2,
  Lock,
  LockOpen,
  Phone,
  StickyNote,
  UserPlus,
  X,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/status-badge';
import { initialActionState } from '@/features/auth/state';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Service } from '@/types';
import {
  blockSlotAction,
  createManualBookingAction,
  releaseBlockAction,
} from '../schedule.actions';
import type { PanelDay, PanelSlot, SlotState } from '../schedule';

interface SlotGridProps {
  barberId: string;
  date: string;
  day: PanelDay;
  services: Service[];
  /** Falso quando o chefe está só observando a agenda de outro barbeiro. */
  canManage?: boolean;
}

const stateStyles: Record<SlotState, string> = {
  free: 'border-line bg-tint hover:border-falcao-500/50 hover:bg-tint-strong text-content',
  booked:
    'border-falcao-600/30 bg-falcao-600/10 text-falcao-700 dark:text-falcao-200 hover:border-falcao-500/60',
  blocked: 'border-line-strong bg-tint-strong text-subtle hover:border-line-strong',
  past: 'border-dashed border-line bg-transparent text-subtle',
};

const stateDot: Record<SlotState, string> = {
  free: 'bg-emerald-500',
  booked: 'bg-falcao-500',
  blocked: 'bg-amber-500',
  past: 'bg-line-strong',
};

function slotLabel(slot: PanelSlot): string {
  if (slot.state === 'booked') {
    return slot.appointment?.manualClientName ?? slot.client?.name ?? 'Reservado';
  }
  if (slot.state === 'blocked') return slot.block?.note ?? 'Bloqueado';
  if (slot.state === 'past') return 'Passou';
  return 'Livre';
}

export function SlotGrid({ barberId, date, day, services, canManage = true }: SlotGridProps) {
  // Guardamos só o horário: o slot em si é sempre lido do `day` recém-vindo
  // do servidor, senão o painel continuaria mostrando o estado anterior
  // depois de bloquear ou liberar.
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selected =
    day.shifts.flatMap((shift) => shift.slots).find((slot) => slot.startTime === selectedTime) ??
    null;

  if (!day.isWorkingDay) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line px-6 py-14 text-center">
        <CalendarOff className="size-6 text-muted" />
        <p className="font-medium text-content">Dia de folga na jornada</p>
        <p className="max-w-sm text-sm text-muted">
          Este dia não faz parte dos horários de trabalho cadastrados, então nada é oferecido aos
          clientes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
        {(['free', 'booked', 'blocked', 'past'] as SlotState[]).map((state) => (
          <span key={state} className="inline-flex items-center gap-1.5">
            <span className={cn('size-2 rounded-full', stateDot[state])} aria-hidden />
            {state === 'free'
              ? 'Livre'
              : state === 'booked'
                ? 'Marcado'
                : state === 'blocked'
                  ? 'Bloqueado'
                  : 'Passou'}
          </span>
        ))}
      </div>

      {day.shifts.map((shift) => (
        <section key={shift.start} className="space-y-3">
          {day.shifts.length > 1 ? (
            <p className="text-xs uppercase tracking-[0.18em] text-subtle">
              Turno {shift.start}–{shift.end}
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {shift.slots.map((slot) => {
              const isSelected = selectedTime === slot.startTime;
              return (
                <button
                  key={slot.startTime}
                  type="button"
                  onClick={() => setSelectedTime(isSelected ? null : slot.startTime)}
                  aria-pressed={isSelected}
                  className={cn(
                    'flex flex-col gap-1 rounded-2xl border px-3 py-2.5 text-left transition-all duration-200',
                    stateStyles[slot.state],
                    isSelected && 'ring-2 ring-falcao-600/30',
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display text-base leading-none">{slot.startTime}</span>
                    <span className={cn('size-1.5 rounded-full', stateDot[slot.state])} aria-hidden />
                  </span>
                  <span className="truncate text-xs opacity-80">{slotLabel(slot)}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {selected ? (
        <SlotActions
          key={`${date}-${selected.startTime}-${selected.state}`}
          slot={selected}
          barberId={barberId}
          date={date}
          services={services}
          canManage={canManage}
          onClose={() => setSelectedTime(null)}
        />
      ) : null}
    </div>
  );
}

interface SlotActionsProps {
  slot: PanelSlot;
  barberId: string;
  date: string;
  services: Service[];
  canManage: boolean;
  onClose: () => void;
}

function SlotActions({ slot, barberId, date, services, canManage, onClose }: SlotActionsProps) {
  const [mode, setMode] = useState<'idle' | 'manual'>('idle');
  const [blockState, blockForm, blocking] = useActionState(blockSlotAction, initialActionState);
  const [releaseState, releaseForm, releasing] = useActionState(
    releaseBlockAction,
    initialActionState,
  );
  const [manualState, manualForm, saving] = useActionState(
    createManualBookingAction,
    initialActionState,
  );

  const feedback = [blockState, releaseState, manualState].find(
    (state) => state.status !== 'idle' && state.message,
  );

  return (
    <div className="surface-card space-y-4 rounded-3xl p-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-2xl text-content">
            {slot.startTime} <span className="text-base text-muted">– {slot.endTime}</span>
          </p>
          <p className="mt-0.5 text-sm text-muted">
            {slot.state === 'booked'
              ? 'Horário com cliente marcado'
              : slot.state === 'blocked'
                ? 'Horário bloqueado na sua agenda'
                : slot.state === 'past'
                  ? 'Horário que já passou'
                  : 'Horário livre para agendamento'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="text-muted transition-colors hover:text-content"
        >
          <X className="size-5" />
        </button>
      </header>

      {slot.state === 'booked' && slot.appointment ? (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-tint p-4">
          <Avatar
            name={slot.appointment.manualClientName ?? slot.client?.name ?? 'Cliente'}
            src={slot.client?.avatarUrl}
            size="md"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-content">
                {slot.appointment.manualClientName ?? slot.client?.name ?? 'Cliente'}
              </p>
              <StatusBadge status={slot.appointment.status} />
              {slot.appointment.isManual ? (
                <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-subtle">
                  reserva manual
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-muted">
              {slot.service?.name ?? 'Serviço'} ·{' '}
              {slot.appointment.priceInCents === 0
                ? 'Incluso no plano'
                : formatCurrency(slot.appointment.priceInCents)}
            </p>
            {slot.client?.phone ? (
              <a
                href={`tel:${slot.client.phone.replace(/\D/g, '')}`}
                className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-content"
              >
                <Phone className="size-3.5" />
                {slot.client.phone}
              </a>
            ) : null}
            {slot.appointment.notes ? (
              <p className="mt-2 flex items-start gap-2 text-sm text-muted">
                <StickyNote className="mt-0.5 size-3.5 shrink-0 text-falcao-400" />
                {slot.appointment.notes}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {canManage && slot.state === 'blocked' && slot.block ? (
        <form action={releaseForm}>
          <input type="hidden" name="blockId" value={slot.block.id} />
          <Button type="submit" variant="outline" size="sm" disabled={releasing}>
            {releasing ? <Loader2 className="animate-spin" /> : <LockOpen />}
            Liberar este horário
          </Button>
        </form>
      ) : null}

      {canManage && (slot.state === 'free' || slot.state === 'past') ? (
        <div className="space-y-4">
          {mode === 'idle' ? (
            <div className="flex flex-wrap gap-2">
              <form action={blockForm}>
                <input type="hidden" name="barberId" value={barberId} />
                <input type="hidden" name="date" value={date} />
                <input type="hidden" name="startTime" value={slot.startTime} />
                <input type="hidden" name="endTime" value={slot.endTime} />
                <input type="hidden" name="reason" value="bloqueio" />
                <Button type="submit" variant="outline" size="sm" disabled={blocking}>
                  {blocking ? <Loader2 className="animate-spin" /> : <Lock />}
                  Bloquear horário
                </Button>
              </form>

              <Button type="button" variant="ghost" size="sm" onClick={() => setMode('manual')}>
                <UserPlus />
                Marcar como já ocupado
              </Button>
            </div>
          ) : (
            <form action={manualForm} className="space-y-3">
              <input type="hidden" name="barberId" value={barberId} />
              <input type="hidden" name="date" value={date} />
              <input type="hidden" name="startTime" value={slot.startTime} />

              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  name="clientName"
                  placeholder="Nome de quem vai ocupar"
                  required
                  maxLength={80}
                  aria-label="Nome do cliente"
                />
                <select
                  name="serviceId"
                  required
                  aria-label="Serviço"
                  defaultValue={services[0]?.id}
                  className="h-12 w-full rounded-2xl border border-line bg-tint px-4 text-content transition-all focus:border-falcao-500/60 focus:outline-none focus:ring-4 focus:ring-falcao-600/15"
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} · {service.durationInMinutes} min
                    </option>
                  ))}
                </select>
              </div>

              <Input name="notes" placeholder="Observação (opcional)" maxLength={160} aria-label="Observação" />

              <div className="flex flex-wrap gap-2">
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? <Loader2 className="animate-spin" /> : <Check />}
                  Confirmar reserva
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setMode('idle')}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </div>
      ) : null}

      {feedback?.message ? (
        <p
          role="status"
          className={cn(
            'text-sm',
            feedback.status === 'error' ? 'text-falcao-700 dark:text-falcao-300' : 'text-emerald-700 dark:text-emerald-300',
          )}
        >
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}
