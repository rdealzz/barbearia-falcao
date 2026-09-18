'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/config/site';

/**
 * Botão flutuante de WhatsApp.
 * O número ainda não foi definido: basta preencher NEXT_PUBLIC_WHATSAPP_NUMBER
 * para o botão passar a abrir a conversa automaticamente.
 */
export function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  const number = siteConfig.contact.whatsapp.replace(/\D/g, '');
  const href = number
    ? `https://wa.me/${number}?text=${encodeURIComponent('Olá! Gostaria de agendar um horário na Barbearia Falcão.')}`
    : undefined;

  return (
    <AnimatePresence>
      {mounted ? (
        <motion.div
          className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence>
            {open ? (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="glass w-64 rounded-2xl border border-white/10 p-4 shadow-2xl"
              >
                <p className="text-sm font-medium text-white">Falar com a Falcão</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-400">
                  {href
                    ? 'Tire dúvidas ou confirme seu horário direto no WhatsApp.'
                    : 'Canal em configuração. Por enquanto, agende pelo site — leva menos de um minuto.'}
                </p>
                <a
                  href={href ?? '/agendar'}
                  target={href ? '_blank' : undefined}
                  rel={href ? 'noreferrer' : undefined}
                  className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full bg-[#25D366] text-sm font-medium text-ink-950 transition-transform hover:scale-[1.02]"
                >
                  {href ? 'Abrir conversa' : 'Agendar agora'}
                </a>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Fechar contato' : 'Abrir contato pelo WhatsApp'}
            aria-expanded={open}
            className="group relative flex size-14 items-center justify-center rounded-full bg-[#25D366] text-ink-950 shadow-[0_18px_40px_-12px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:scale-105"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/30 [animation-duration:3s]" />
            {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
