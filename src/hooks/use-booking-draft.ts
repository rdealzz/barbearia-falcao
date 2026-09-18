'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'falcao:booking-draft';

export interface BookingDraft {
  serviceId?: string;
  barberId?: string;
  date?: string;
  startTime?: string;
  notes?: string;
}

function readStoredDraft(): string | null {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    // sessionStorage indisponível (modo privado, por exemplo).
    return null;
  }
}

function writeStoredDraft(draft: BookingDraft): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Falha de persistência não bloqueia o agendamento.
  }
}

const noopSubscribe = () => () => {};

/**
 * Mantém o rascunho do agendamento no sessionStorage para que o cliente
 * não perca as etapas já preenchidas ao passar pelo login.
 */
export function useBookingDraft(initial: BookingDraft = {}) {
  // Lido apenas no cliente: no servidor o valor é sempre null, o que mantém
  // a primeira renderização consistente com o HTML enviado.
  const stored = useSyncExternalStore(
    noopSubscribe,
    readStoredDraft,
    () => null,
  );

  const [overrides, setOverrides] = useState<BookingDraft>(initial);
  const [cleared, setCleared] = useState(false);

  const restoredDraft: BookingDraft = (() => {
    if (cleared || !stored) return {};
    try {
      return JSON.parse(stored) as BookingDraft;
    } catch {
      return {};
    }
  })();

  const draft: BookingDraft = { ...restoredDraft, ...overrides };

  const update = useCallback(
    (patch: BookingDraft) => {
      setOverrides((current) => {
        const next = { ...restoredDraft, ...current, ...patch };
        writeStoredDraft(next);
        return next;
      });
    },
    [restoredDraft],
  );

  const clear = useCallback(() => {
    setCleared(true);
    setOverrides({});
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignora falha de limpeza.
    }
  }, []);

  return { draft, update, clear, restored: stored !== null || cleared };
}
