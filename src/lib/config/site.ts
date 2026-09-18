interface ContactChannels {
  phone: string;
  /** Formato internacional, usado nos links wa.me. */
  whatsapp: string;
  email: string;
}

const contact: ContactChannels = {
  phone: '(41) 99936-0911',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5541999360911',
  // E-mail oficial ainda não divulgado publicamente pela barbearia.
  email: '',
};

export const siteConfig = {
  name: 'Barbearia Falcão',
  shortName: 'Falcão',
  legalName: 'Barbearia Falcão Cuts & Shave',
  foundedIn: 2018,
  tagline: 'Cuts & Shave',
  slogan: 'Está na cara quando o corte é bem feito',
  sloganSupport: 'Corte, barba e cuidado para todas as idades — do primeiro corte ao de sempre.',
  description:
    'Barbearia premium em Curitiba. Cortes, barba e cuidados masculinos com hora marcada, barbeiros especialistas e planos de assinatura.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'pt-BR',
  contact,
  address: {
    street: 'Rua Pedro Gusso',
    number: '281',
    district: 'Novo Mundo',
    city: 'Curitiba',
    state: 'PR',
    country: 'BR',
    zipCode: '81050-200',
    mapsQuery: 'Barbearia Falcão, Rua Pedro Gusso 281, Novo Mundo, Curitiba - PR',
  },
  social: {
    instagram: 'https://www.instagram.com/barbeariia_falcao/',
    instagramHandle: '@barbeariia_falcao',
    facebook: 'https://www.facebook.com/barbearia.falcao18/',
    googleMaps: 'https://www.google.com/maps/search/?api=1&query=Barbearia+Falc%C3%A3o+Rua+Pedro+Gusso+281+Curitiba',
  },
  /** Avaliação pública do perfil no Google. */
  reputation: {
    rating: 4.9,
    reviewsCount: 397,
    source: 'Google',
  },
  openingHours: [
    { label: 'Segunda a sexta', value: '08:30 — 20:30' },
    // Sábado e domingo ainda não confirmados pela barbearia.
    { label: 'Sábado', value: 'Sob consulta' },
    { label: 'Domingo', value: 'Fechado' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export const navigation = {
  main: [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Cortes', href: '/galeria' },
    { label: 'Barbeiros', href: '/barbeiros' },
    { label: 'Planos', href: '/planos' },
    { label: 'Contato', href: '/contato' },
  ],
  account: [
    { label: 'Início', href: '/conta' },
    { label: 'Agendamentos', href: '/conta/agendamentos' },
    { label: 'Clube Falcão', href: '/conta/clube' },
    { label: 'Plano', href: '/conta/plano' },
    { label: 'Perfil', href: '/conta/perfil' },
  ],
  staff: [
    { label: 'Agenda do dia', href: '/painel' },
    { label: 'Semana', href: '/painel/semana' },
    { label: 'Clientes', href: '/painel/clientes' },
  ],
} as const;
