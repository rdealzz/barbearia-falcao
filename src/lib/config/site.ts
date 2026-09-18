interface ContactChannels {
  phone: string;
  whatsapp: string;
  email: string;
}

/** Preenchido quando a barbearia confirmar os canais oficiais. */
const contact: ContactChannels = {
  phone: '',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
  email: '',
};

export const siteConfig = {
  name: 'Barbearia Falcão',
  shortName: 'Falcão',
  legalName: 'Barbearia Falcão Cuts & Shave',
  foundedIn: 2018,
  tagline: 'Cuts & Shave',
  slogan: 'Está na cara a diferença entre homens e meninos',
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
    zipCode: '' as string,
    mapsQuery: 'Barbearia Falcão, Rua Pedro Gusso 281, Novo Mundo, Curitiba - PR',
  },
  social: {
    instagram: 'https://www.instagram.com/barbeariia_falcao/',
    instagramHandle: '@barbeariia_falcao',
  },
  openingHours: [
    { label: 'Segunda a sexta', value: '09:00 — 20:00' },
    { label: 'Sábado', value: '09:00 — 18:00' },
    { label: 'Domingo', value: 'Fechado' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

export const navigation = {
  main: [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Serviços', href: '/servicos' },
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
