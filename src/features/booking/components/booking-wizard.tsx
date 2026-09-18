'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  LogIn,
  QrCode,
  Scissors,
  Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/field';
import { useBookingDraft } from '@/hooks/use-booking-draft';
import { formatCurrency, formatDuration, formatLongDate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { AvailabilityDay, Barber, PaymentMethod, Service, Weekday } from '@/types';
import { createBookingAction, fetchAvailabilityAction } from '../actions';
import { DatePicker } from './date-picker';
import { SelectionCard } from './selection-card';
import { SlotPicker } from './slot-picker';
import { StepIndicator } from './step-indicator';

interface BookingWizardProps {
  services: Service[];
  barbers: Barber[];
  user: { id: string; name: string; email: string; avatarUrl?: string } | null;
  initialServiceId?: string;
  initialBarberId?: string;
}

const STEPS = ['Serviço', 'Barbeiro', 'Data e horário', 'Confirmação'];

const paymentOptions: Array<{ value: PaymentMethod; label: string; hint: string; icon: typeof QrCode }> = [
  { value: 'cash', label: 'Pagar na barbearia', hint: 'Dinheiro, cartão ou Pix no balcão', icon: Wallet },
  { value: 'pix', label: 'Pix online', hint: 'Disponível em breve', icon: QrCode },
  { value: 'credit_card', label: 'Cartão online', hint: 'Disponível em breve', icon: CreditCard },
];

export function BookingWizard({
  services,
  barbers,
  user,
  initialServiceId,
  initialBarberId,
}: BookingWizardProps) {
  const { draft, update, clear, restored } = useBookingDraft({
    serviceId: initialServiceId,
    barberId: initialBarberId,
  });

  const [step, setStep] = useState(0);
  const [dateOffset, setDateOffset] = useState(0);
  const [availability, setAvailability] = useState<{ key: string; day: AvailabilityDay } | null>(
    null,
  );
  const [loadingSlots, startLoadingSlots] = useTransition();
  const [submitting, startSubmitting] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [confirmation, setConfirmation] = useState<{ code: string } | null>(null);

  const service = services.find((item) => item.id === draft.serviceId);
  const barber = barbers.find((item) => item.id === draft.barberId);

  const eligibleBarbers = useMemo(
    () => (service ? barbers.filter((item) => item.serviceIds.includes(service.id)) : barbers),
    [barbers, service],
  );

  const unavailableWeekdays = useMemo<Weekday[]>(() => {
    if (!barber) return [];
    return barber.workingHours
      .filter((day) => day.shifts.length === 0)
      .map((day) => day.weekday);
  }, [barber]);

  const availabilityKey =
    draft.barberId && draft.serviceId && draft.date
      ? `${draft.barberId}|${draft.serviceId}|${draft.date}`
      : null;

  // Retoma o rascunho salvo antes do login, ajustando a etapa na renderização.
  const [resumed, setResumed] = useState(false);
  if (!resumed && restored && step === 0 && draft.serviceId && draft.barberId && draft.date) {
    setResumed(true);
    setStep(2);
  }

  useEffect(() => {
    if (!availabilityKey) return;
    const [barberId, serviceId, date] = availabilityKey.split('|') as [string, string, string];

    startLoadingSlots(async () => {
      const result = await fetchAvailabilityAction(barberId, serviceId, date);
      setAvailability({ key: availabilityKey, day: result });
    });
  }, [availabilityKey]);

  // Descarta resultado de uma consulta anterior enquanto a nova carrega.
  const currentAvailability =
    availability && availability.key === availabilityKey ? availability.day : null;

  const goTo = (next: number) => {
    setError(null);
    setStep(next);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirm = () => {
    if (!service || !barber || !draft.date || !draft.startTime) return;

    const formData = new FormData();
    formData.set('serviceId', service.id);
    formData.set('barberId', barber.id);
    formData.set('date', draft.date);
    formData.set('startTime', draft.startTime);
    if (draft.notes) formData.set('notes', draft.notes);

    startSubmitting(async () => {
      const result = await createBookingAction({ status: 'idle' }, formData);
      if (result.status === 'success') {
        setConfirmation({ code: result.message ?? '' });
        clear();
      } else {
        setError(result.message ?? 'Não foi possível concluir o agendamento.');
      }
    });
  };

  if (confirmation) {
    return <BookingSuccess code={confirmation.code} />;
  }

  const canAdvance =
    (step === 0 && Boolean(draft.serviceId)) ||
    (step === 1 && Boolean(draft.barberId)) ||
    (step === 2 && Boolean(draft.date && draft.startTime));

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
      <div>
        <StepIndicator steps={STEPS} current={step} onSelect={goTo} />

        <div className="mt-8 min-h-[26rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 ? (
                <section className="space-y-3" aria-label="Escolha o serviço">
                  <h2 className="font-display text-2xl text-white">Qual serviço você quer?</h2>
                  <p className="pb-3 text-sm text-ink-500">
                    O tempo de cada atendimento define os horários disponíveis na agenda.
                  </p>
                  {services.map((item) => (
                    <SelectionCard
                      key={item.id}
                      selected={draft.serviceId === item.id}
                      onSelect={() => {
                        const barberStillValid = barbers.some(
                          (b) => b.id === draft.barberId && b.serviceIds.includes(item.id),
                        );
                        update({
                          serviceId: item.id,
                          barberId: barberStillValid ? draft.barberId : undefined,
                          startTime: undefined,
                        });
                        goTo(1);
                      }}
                      title={item.name}
                      subtitle={item.shortDescription}
                      media={
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-falcao-400">
                          <Scissors className="size-4" />
                        </span>
                      }
                      meta={
                        <>
                          <p className="font-display text-lg text-white">
                            {formatCurrency(item.priceInCents)}
                          </p>
                          <p className="text-xs text-ink-500">
                            {formatDuration(item.durationInMinutes)}
                          </p>
                        </>
                      }
                    />
                  ))}
                </section>
              ) : null}

              {step === 1 ? (
                <section className="space-y-3" aria-label="Escolha o barbeiro">
                  <h2 className="font-display text-2xl text-white">Com quem você quer cortar?</h2>
                  <p className="pb-3 text-sm text-ink-500">
                    Cada barbeiro tem agenda própria — o horário fica reservado só com ele.
                  </p>
                  {eligibleBarbers.map((item) => (
                    <SelectionCard
                      key={item.id}
                      selected={draft.barberId === item.id}
                      onSelect={() => {
                        update({ barberId: item.id, startTime: undefined });
                        goTo(2);
                      }}
                      disabled={!item.acceptsNewClients}
                      disabledLabel="Agenda fechada para novos clientes"
                      title={item.name}
                      subtitle={item.headline}
                      media={<Avatar name={item.name} src={item.avatarUrl} size="md" />}
                      meta={<Badge variant="muted">{item.specialties[0]}</Badge>}
                    />
                  ))}
                </section>
              ) : null}

              {step === 2 ? (
                <section className="space-y-8" aria-label="Escolha data e horário">
                  <div>
                    <h2 className="font-display text-2xl text-white">Quando fica bom para você?</h2>
                    <p className="mt-1 text-sm text-ink-500">
                      A grade mostra apenas o que está livre na agenda de {barber?.name ?? 'cada barbeiro'}.
                    </p>
                  </div>

                  <DatePicker
                    value={draft.date}
                    onChange={(date) => update({ date, startTime: undefined })}
                    offset={dateOffset}
                    onOffsetChange={setDateOffset}
                    horizonInDays={barber?.scheduleSettings.bookingHorizonInDays ?? 30}
                    unavailableWeekdays={unavailableWeekdays}
                  />

                  {draft.date ? (
                    <SlotPicker
                      slots={currentAvailability?.slots ?? []}
                      value={draft.startTime}
                      onChange={(startTime) => update({ startTime })}
                      loading={loadingSlots || currentAvailability === null}
                    />
                  ) : (
                    <p className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-ink-500">
                      Escolha uma data para ver os horários disponíveis.
                    </p>
                  )}
                </section>
              ) : null}

              {step === 3 ? (
                <section className="space-y-6" aria-label="Confirmação">
                  <div>
                    <h2 className="font-display text-2xl text-white">Confirme seu agendamento</h2>
                    <p className="mt-1 text-sm text-ink-500">
                      Revise os dados antes de fechar o horário.
                    </p>
                  </div>

                  {!user ? (
                    <div className="surface-card space-y-4 rounded-3xl p-6">
                      <p className="flex items-center gap-2 font-medium text-white">
                        <LogIn className="size-4 text-falcao-400" />
                        Entre para finalizar
                      </p>
                      <p className="text-sm leading-relaxed text-ink-400">
                        Sua escolha fica salva. Depois de entrar, você volta exatamente para esta
                        etapa.
                      </p>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button asChild block>
                          <Link href="/entrar?redirect=/agendar">Entrar na minha conta</Link>
                        </Button>
                        <Button asChild variant="outline" block>
                          <Link href="/cadastrar?redirect=/agendar">Criar conta</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Observações para o barbeiro (opcional)</Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={draft.notes ?? ''}
                          onChange={(event) => update({ notes: event.target.value })}
                          placeholder="Ex.: máquina 1 nas laterais, manter o comprimento em cima."
                          maxLength={280}
                        />
                      </div>

                      <fieldset className="space-y-3">
                        <legend className="mb-1 text-xs font-medium uppercase tracking-[0.12em] text-ink-500">
                          Forma de pagamento
                        </legend>
                        {paymentOptions.map((option) => {
                          const disabled = option.value !== 'cash';
                          return (
                            <label
                              key={option.value}
                              className={cn(
                                'flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-colors',
                                paymentMethod === option.value
                                  ? 'border-falcao-500/60 bg-falcao-950/30'
                                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20',
                                disabled && 'cursor-not-allowed opacity-45',
                              )}
                            >
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={option.value}
                                checked={paymentMethod === option.value}
                                disabled={disabled}
                                onChange={() => setPaymentMethod(option.value)}
                                className="sr-only"
                              />
                              <span className="grid size-10 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-falcao-400">
                                <option.icon className="size-4" />
                              </span>
                              <span className="flex-1">
                                <span className="block text-sm font-medium text-white">
                                  {option.label}
                                </span>
                                <span className="block text-xs text-ink-500">{option.hint}</span>
                              </span>
                            </label>
                          );
                        })}
                      </fieldset>

                      {error ? (
                        <p
                          role="alert"
                          className="rounded-2xl border border-falcao-500/30 bg-falcao-950/40 px-4 py-3 text-sm text-falcao-200"
                        >
                          {error}
                        </p>
                      ) : null}

                      <Button size="lg" block onClick={handleConfirm} disabled={submitting}>
                        {submitting ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Confirmando…
                          </>
                        ) : (
                          <>
                            <CalendarCheck2 className="size-4" />
                            Confirmar agendamento
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </section>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/[0.06] pt-6">
          <Button
            variant="ghost"
            onClick={() => goTo(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Button>

          {step < 3 ? (
            <Button onClick={() => goTo(step + 1)} disabled={!canAdvance}>
              Continuar
              <ArrowRight className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>

      <aside className="surface-card sticky top-28 rounded-3xl p-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-600">Resumo</p>

        <dl className="mt-5 space-y-4 text-sm">
          <SummaryRow label="Serviço" value={service?.name} />
          <SummaryRow label="Barbeiro" value={barber?.name} />
          <SummaryRow label="Data" value={draft.date ? formatLongDate(draft.date) : undefined} />
          <SummaryRow
            label="Horário"
            value={
              draft.startTime && service
                ? `${draft.startTime} · ${formatDuration(service.durationInMinutes)}`
                : undefined
            }
          />
        </dl>

        <div className="mt-6 flex items-end justify-between border-t border-white/[0.06] pt-5">
          <span className="text-sm text-ink-500">Total</span>
          <span className="font-display text-2xl text-white">
            {service ? formatCurrency(service.priceInCents) : '—'}
          </span>
        </div>

        {user ? (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3">
            <Avatar name={user.name} src={user.avatarUrl} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm text-white">{user.name}</p>
              <p className="truncate text-xs text-ink-500">{user.email}</p>
            </div>
          </div>
        ) : (
          <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-ink-500">
            <Clock className="mt-0.5 size-3.5 shrink-0" />O login é pedido apenas na última etapa.
          </p>
        )}
      </aside>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-ink-500">{label}</dt>
      <dd className={cn('text-right', value ? 'text-ink-100' : 'text-ink-700')}>
        {value ?? 'A definir'}
      </dd>
    </div>
  );
}

function BookingSuccess({ code }: { code: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="surface-card mx-auto max-w-xl rounded-4xl p-10 text-center"
    >
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
        <CheckCircle2 className="size-8" />
      </span>
      <h2 className="mt-6 font-display text-3xl text-white">Horário confirmado</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-400">
        Seu agendamento está salvo e já aparece na agenda do barbeiro. Guarde o código abaixo
        para qualquer alteração.
      </p>
      <p className="mt-6 inline-flex rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 font-mono text-sm tracking-widest text-white">
        {code}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild block>
          <Link href="/conta/agendamentos">Ver meus agendamentos</Link>
        </Button>
        <Button asChild variant="outline" block>
          <Link href="/">Voltar ao início</Link>
        </Button>
      </div>
    </motion.div>
  );
}
