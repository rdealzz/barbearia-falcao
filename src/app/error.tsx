'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Ponto de integração com o serviço de monitoramento (Sentry, etc.).
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-content">Algo saiu do lugar</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Tivemos um problema ao carregar esta página. Tente novamente — se persistir, fale com a
          equipe da barbearia.
        </p>
        <Button onClick={reset} className="mt-8">
          <RotateCcw className="size-4" />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
