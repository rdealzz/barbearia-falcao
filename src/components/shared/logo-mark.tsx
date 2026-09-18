import { cn } from '@/lib/utils/cn';

interface LogoMarkProps {
  className?: string;
  /** Oculta os textos internos, para uso em tamanhos muito pequenos. */
  compact?: boolean;
}

/**
 * Brasão da Barbearia Falcão desenhado em SVG: disco vermelho, aro preto,
 * anéis creme, tipografia script e poste de barbeiro.
 * Para usar o arquivo oficial, defina `brand.logoSrc` em src/lib/data/media.ts.
 */
export function LogoMark({ className, compact = false }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('shrink-0', className)}
      role="img"
      aria-label="Barbearia Falcão — Cuts and Shave"
    >
      <defs>
        <path id="falcao-arc-bottom" d="M 15.5 56 A 35.5 35.5 0 0 0 84.5 56" fill="none" />
      </defs>

      <circle cx="50" cy="50" r="50" fill="#121212" />
      <circle cx="50" cy="50" r="46.5" fill="#C1272D" />
      <circle cx="50" cy="50" r="43.5" fill="none" stroke="#F2E4C9" strokeWidth="1.6" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="#F2E4C9" strokeWidth="0.7" opacity="0.75" />

      {!compact ? (
        <>
          <text
            x="50"
            y="34"
            textAnchor="middle"
            fill="#F2E4C9"
            fontSize="16"
            fontFamily="var(--font-script), cursive"
          >
            Barbearia
          </text>

          <text
            x="50"
            y="56"
            textAnchor="middle"
            fill="#F2E4C9"
            fontSize="19"
            fontWeight="700"
            letterSpacing="0.5"
            stroke="#121212"
            strokeWidth="0.9"
            paintOrder="stroke"
            fontFamily="var(--font-display), sans-serif"
          >
            FALCÃO
          </text>

          <g transform="translate(50 69.5)">
            <rect x="-2.4" y="-6.5" width="4.8" height="13" rx="2.4" fill="#F2E4C9" />
            <path
              d="M-2.4 -3 L2.4 -6 M-2.4 0.5 L2.4 -2.5 M-2.4 4 L2.4 1 M-2.4 7 L2.4 4.5"
              stroke="#C1272D"
              strokeWidth="1.5"
            />
            <rect x="-3.2" y="-8.4" width="6.4" height="2" rx="1" fill="#F2E4C9" />
            <rect x="-3.2" y="6.4" width="6.4" height="2" rx="1" fill="#F2E4C9" />
          </g>

          <text x="30" y="68" textAnchor="middle" fill="#F2E4C9" fontSize="4.6" letterSpacing="0.4">
            EST.
          </text>
          <text x="70" y="68" textAnchor="middle" fill="#F2E4C9" fontSize="4.6" letterSpacing="0.4">
            2018
          </text>

          <text fill="#F2E4C9" fontSize="5" letterSpacing="1.5">
            <textPath href="#falcao-arc-bottom" startOffset="50%" textAnchor="middle">
              - CUTS AND SHAVE -
            </textPath>
          </text>
        </>
      ) : (
        <g transform="translate(50 50) scale(1.6)">
          <rect x="-2.6" y="-8" width="5.2" height="16" rx="2.6" fill="#F2E4C9" />
          <path
            d="M-2.6 -4 L2.6 -7.5 M-2.6 0 L2.6 -3.5 M-2.6 4 L2.6 0.5 M-2.6 8 L2.6 4.5"
            stroke="#C1272D"
            strokeWidth="1.5"
          />
        </g>
      )}
    </svg>
  );
}
