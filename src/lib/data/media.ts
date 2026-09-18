/**
 * Identidade visual: aponte `logoSrc` para o arquivo oficial (ex.: '/logo.png'
 * em public/) e ele passa a ser usado no cabeçalho, no rodapé e nas áreas
 * logadas. Vazio = brasão vetorial de `LogoMark`.
 */
export const brand = {
  logoSrc: '',
  colors: {
    red: '#C1272D',
    cream: '#F2E4C9',
    ink: '#121212',
  },
} as const;

/**
 * Ponto único de troca das imagens do site.
 * Substituir pelas fotos oficiais da barbearia (Supabase Storage ou /public).
 */
export const media = {
  hero: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1920&q=80',
  heroPortrait:
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80',
  shopWide:
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1600&q=80',
  chair:
    'https://images.unsplash.com/photo-1521490683712-35a1cb32ec5c?auto=format&fit=crop&w=1200&q=80',
  tools:
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1200&q=80',
  /**
   * Trabalhos executados pela equipe. Substituir pelas fotos reais do
   * Instagram @barbeariia_falcao: basta salvar os arquivos em
   * public/galeria/ e apontar os caminhos aqui (ex.: '/galeria/corte-01.jpg').
   */
  gallery: [
    'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1521490683712-35a1cb32ec5c?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80',
  ],
} as const;

export interface GalleryItem {
  src: string;
  title: string;
  description: string;
  /** Slug do serviço relacionado, usado no atalho de agendamento. */
  serviceSlug?: string;
  barberSlug?: string;
}

/** Vitrine de cortes exibida em /galeria e na home. */
export const galleryItems: GalleryItem[] = [
  {
    src: media.gallery[0],
    title: 'Fade com acabamento na navalha',
    description: 'Degradê alto, transição limpa e contorno fechado na navalha.',
    serviceSlug: 'corte-masculino',
  },
  {
    src: media.gallery[1],
    title: 'Barba desenhada',
    description: 'Toalha quente, modelagem na navalha e finalização com bálsamo.',
    serviceSlug: 'barba-terapia',
  },
  {
    src: media.gallery[2],
    title: 'Corte social',
    description: 'Discreto, alinhado e fácil de manter no dia a dia.',
    serviceSlug: 'corte-masculino',
  },
  {
    src: media.gallery[3],
    title: 'Combo corte + barba',
    description: 'O atendimento mais pedido da casa, do shampoo ao acabamento.',
    serviceSlug: 'corte-e-barba',
  },
  {
    src: media.gallery[4],
    title: 'Texturizado com franja',
    description: 'Movimento no topo com laterais controladas.',
    serviceSlug: 'corte-masculino',
  },
  {
    src: media.gallery[5],
    title: 'Platinado',
    description: 'Descoloração em etapas, matização e reconstrução do fio.',
    serviceSlug: 'platinado',
  },
];
