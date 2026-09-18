import type { ID, Timestamped } from './common';

export type ServiceCategory = 'cabelo' | 'barba' | 'combo' | 'estetica' | 'infantil';

export interface Service extends Timestamped {
  id: ID;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: ServiceCategory;
  /** Em centavos, para evitar erro de ponto flutuante. */
  priceInCents: number;
  /** Duração do atendimento em minutos. */
  durationInMinutes: number;
  imageUrl?: string;
  highlights: string[];
  isActive: boolean;
  isFeatured: boolean;
  /** Preparado para o futuro: serviços cobertos por planos de assinatura. */
  includedInPlanIds: ID[];
}
