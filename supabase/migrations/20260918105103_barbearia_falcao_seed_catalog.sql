-- =====================================================================
-- Barbearia Falcão — carga inicial do catálogo (serviços, barbeiros, planos, cupons)
-- =====================================================================

insert into barbearia.services
  (id, slug, name, short_description, description, category, price_in_cents,
   duration_in_minutes, highlights, is_featured, included_in_plan_ids, sort_order)
values
  ('svc_corte','corte-masculino','Corte Masculino','Corte sob medida, finalização e styling.',
   'Consultoria de visagismo rápida, corte executado com máquina e tesoura, acabamento na navalha e finalização com produtos profissionais.',
   'cabelo',5500,40,
   array['Consultoria de visagismo','Acabamento na navalha','Finalização inclusa'],true,
   array['plan_corte_ilimitado','plan_corte_basic','plan_corte_barba_ilimitado','plan_corte_barba_basic'],1),

  ('svc_corte_barba','corte-e-barba','Corte + Barba','O combo completo da casa.',
   'Corte completo seguido de barboterapia: toalha quente, óleo, navalha e finalização com bálsamo. O atendimento mais pedido da Falcão.',
   'combo',9000,70,
   array['Toalha quente','Navalha tradicional','Bálsamo finalizador'],true,
   array['plan_corte_barba_ilimitado','plan_corte_barba_basic'],2),

  ('svc_barba','barba-terapia','Barboterapia','Barba desenhada com ritual completo.',
   'Modelagem da barba com navalha, toalha quente, esfoliação, massagem facial e hidratação. Ritual completo de cuidado masculino.',
   'barba',4500,40,
   array['Esfoliação','Massagem facial','Hidratação'],true,
   array['plan_barba_ilimitada','plan_corte_barba_ilimitado','plan_corte_barba_basic'],3),

  ('svc_pezinho','pezinho','Pezinho / Acabamento','Manutenção entre um corte e outro.',
   'Acabamento de nuca, contornos e costeletas para manter o corte no ponto entre as visitas.',
   'cabelo',2500,20,array['Rápido','Manutenção semanal','Navalha'],false,'{}',4),

  ('svc_infantil','corte-infantil','Corte Infantil','Para os pequenos, sem estresse.',
   'Atendimento paciente e lúdico para crianças até 12 anos, com corte adaptado ao tipo de cabelo e à rotina do dia a dia.',
   'infantil',4500,40,array['Até 12 anos','Ambiente tranquilo','Finalização leve'],false,'{}',5),

  ('svc_sobrancelha','sobrancelha','Sobrancelha','Design masculino com navalha ou pinça.',
   'Alinhamento discreto que respeita o traço natural e valoriza o olhar.',
   'estetica',2000,15,array['Design natural','Navalha ou pinça','Rápido'],false,'{}',6),

  ('svc_platinado','platinado','Platinado / Global','Descoloração completa com matização.',
   'Descoloração em etapas com produtos profissionais, matização e tratamento reconstrutor para preservar o fio. Requer avaliação prévia.',
   'cabelo',22000,180,array['Avaliação prévia','Matização inclusa','Reconstrução do fio'],false,'{}',7),

  ('svc_hidratacao','hidratacao','Hidratação Capilar','Recuperação de brilho e maciez.',
   'Protocolo de hidratação profunda com máscara profissional, indicado após química ou exposição solar.',
   'estetica',4000,30,array['Máscara profissional','Brilho imediato','Pós-química'],false,'{}',8)
on conflict (id) do update set
  slug = excluded.slug, name = excluded.name,
  short_description = excluded.short_description, description = excluded.description,
  category = excluded.category, price_in_cents = excluded.price_in_cents,
  duration_in_minutes = excluded.duration_in_minutes, highlights = excluded.highlights,
  is_featured = excluded.is_featured, included_in_plan_ids = excluded.included_in_plan_ids,
  sort_order = excluded.sort_order;

-- ------------------------- Barbeiros ----------------------------------
insert into barbearia.barbers
  (id, slug, name, nickname, role, staff_role, headline, bio, specialties,
   experience_since, instagram_url, service_ids, working_hours, schedule_settings, sort_order)
values
  ('brb_falcao','rafael-falcao','Rafael Falcão','Falcão','Barbeiro-chefe e fundador','owner',
   'Degradês milimétricos e barba desenhada na navalha.',
   'Fundador da Falcão em 2018, Rafael construiu a casa em cima de uma ideia simples: barbearia é ofício, não pressa. Referência em degradê e no acabamento com navalha, atende clientes que voltam há anos pela mesma cadeira.',
   array['Degradê','Navalha','Barba desenhada','Visagismo'],2012,
   'https://www.instagram.com/barbeariia_falcao/',
   array['svc_corte','svc_corte_barba','svc_barba','svc_pezinho','svc_infantil','svc_sobrancelha','svc_hidratacao','svc_platinado'],
   '[{"weekday":0,"shifts":[]},
     {"weekday":1,"shifts":[{"start":"08:30","end":"20:30"}]},
     {"weekday":2,"shifts":[{"start":"08:30","end":"20:30"}]},
     {"weekday":3,"shifts":[{"start":"08:30","end":"20:30"}]},
     {"weekday":4,"shifts":[{"start":"08:30","end":"20:30"}]},
     {"weekday":5,"shifts":[{"start":"08:30","end":"20:30"}]},
     {"weekday":6,"shifts":[{"start":"08:30","end":"18:00"}]}]'::jsonb,
   '{"slotIntervalInMinutes":30,"bufferInMinutes":10,"dailyAppointmentLimit":12,"minimumNoticeInMinutes":60,"bookingHorizonInDays":45}'::jsonb,
   1),

  ('brb_lucas','lucas-moreira','Lucas Moreira',null,'Barbeiro sênior','barber',
   'Cortes sociais, texturizados e finalização impecável.',
   'Especialista em cortes sociais e texturizados, Lucas tem mão leve na tesoura e obsessão por simetria. É o nome certo para quem quer um corte discreto e perfeito para o ambiente de trabalho.',
   array['Corte social','Texturizado','Tesoura','Sobrancelha'],2016,
   'https://www.instagram.com/barbeariia_falcao/',
   array['svc_corte','svc_corte_barba','svc_barba','svc_pezinho','svc_infantil','svc_sobrancelha','svc_hidratacao'],
   '[{"weekday":0,"shifts":[]},
     {"weekday":1,"shifts":[{"start":"08:30","end":"13:00"},{"start":"14:30","end":"20:30"}]},
     {"weekday":2,"shifts":[{"start":"08:30","end":"13:00"},{"start":"14:30","end":"20:30"}]},
     {"weekday":3,"shifts":[{"start":"08:30","end":"13:00"},{"start":"14:30","end":"20:30"}]},
     {"weekday":4,"shifts":[{"start":"08:30","end":"13:00"},{"start":"14:30","end":"20:30"}]},
     {"weekday":5,"shifts":[{"start":"08:30","end":"13:00"},{"start":"14:30","end":"20:30"}]},
     {"weekday":6,"shifts":[{"start":"08:30","end":"17:00"}]}]'::jsonb,
   '{"slotIntervalInMinutes":30,"bufferInMinutes":10,"dailyAppointmentLimit":10,"minimumNoticeInMinutes":60,"bookingHorizonInDays":45}'::jsonb,
   2),

  ('brb_diego','diego-santos','Diego Santos',null,'Barbeiro e colorista','barber',
   'Platinado, luzes e química com preservação do fio.',
   'Diego é o responsável pelos trabalhos de cor da casa. Trabalha em etapas, com avaliação prévia do fio e protocolo de reconstrução, para entregar platinado e luzes sem comprometer a saúde do cabelo.',
   array['Platinado','Luzes','Coloração','Reconstrução'],2018,
   'https://www.instagram.com/barbeariia_falcao/',
   array['svc_corte','svc_corte_barba','svc_barba','svc_pezinho','svc_infantil','svc_sobrancelha','svc_hidratacao','svc_platinado'],
   '[{"weekday":0,"shifts":[]},
     {"weekday":1,"shifts":[]},
     {"weekday":2,"shifts":[{"start":"11:00","end":"20:30"}]},
     {"weekday":3,"shifts":[{"start":"11:00","end":"20:30"}]},
     {"weekday":4,"shifts":[{"start":"11:00","end":"20:30"}]},
     {"weekday":5,"shifts":[{"start":"11:00","end":"20:30"}]},
     {"weekday":6,"shifts":[{"start":"08:30","end":"18:00"}]}]'::jsonb,
   '{"slotIntervalInMinutes":60,"bufferInMinutes":10,"dailyAppointmentLimit":8,"minimumNoticeInMinutes":60,"bookingHorizonInDays":45}'::jsonb,
   3),

  ('brb_matheus','matheus-lima','Matheus Lima',null,'Barbeiro','barber',
   'Atendimento infantil e cortes clássicos.',
   'Paciente com os pequenos e preciso nos clássicos, Matheus atende famílias inteiras — do primeiro corte do filho ao corte do avô.',
   array['Infantil','Clássico','Pezinho','Barba'],2019,
   'https://www.instagram.com/barbeariia_falcao/',
   array['svc_corte','svc_corte_barba','svc_barba','svc_pezinho','svc_infantil','svc_sobrancelha','svc_hidratacao'],
   '[{"weekday":0,"shifts":[]},
     {"weekday":1,"shifts":[{"start":"08:30","end":"20:30"}]},
     {"weekday":2,"shifts":[{"start":"08:30","end":"20:30"}]},
     {"weekday":3,"shifts":[{"start":"08:30","end":"20:30"}]},
     {"weekday":4,"shifts":[{"start":"08:30","end":"20:30"}]},
     {"weekday":5,"shifts":[{"start":"08:30","end":"20:30"}]},
     {"weekday":6,"shifts":[{"start":"08:30","end":"18:00"}]}]'::jsonb,
   '{"slotIntervalInMinutes":30,"bufferInMinutes":10,"dailyAppointmentLimit":12,"minimumNoticeInMinutes":60,"bookingHorizonInDays":45}'::jsonb,
   4)
on conflict (id) do update set
  slug = excluded.slug, name = excluded.name, role = excluded.role,
  staff_role = excluded.staff_role, headline = excluded.headline, bio = excluded.bio,
  specialties = excluded.specialties, service_ids = excluded.service_ids,
  working_hours = excluded.working_hours, schedule_settings = excluded.schedule_settings,
  sort_order = excluded.sort_order;

-- ------------------------- Planos -------------------------------------
insert into barbearia.plans
  (id, slug, name, tier, tagline, description, price_in_cents, haircuts_per_cycle,
   beards_per_cycle, discount_percentage, priority, seats_available, is_popular, benefits, sort_order)
values
  ('plan_corte_basic','corte-basic','Corte BASIC','bronze','A manutenção do mês, no preço fechado.',
   'Ideal para quem corta o cabelo duas vezes por mês e quer previsibilidade no custo.',
   6490,2,0,10,1,27,false,
   '[{"label":"2 cortes por mês","included":true},
     {"label":"10% de desconto nos demais serviços","included":true},
     {"label":"Agendamento pelo app","included":true},
     {"label":"Barba inclusa","included":false},
     {"label":"Prioridade na agenda","included":false}]'::jsonb,1),

  ('plan_corte_ilimitado','corte-ilimitado','Corte ILIMITADO','silver','Cabelo sempre no ponto, sem contar corte.',
   'Cortes ilimitados dentro do ciclo, respeitando o intervalo técnico entre atendimentos.',
   7990,null,0,10,2,null,false,
   '[{"label":"Cortes ilimitados","included":true},
     {"label":"Pezinho incluso","included":true},
     {"label":"10% de desconto nos demais serviços","included":true},
     {"label":"Barba inclusa","included":false},
     {"label":"Prioridade na agenda","included":false}]'::jsonb,2),

  ('plan_barba_ilimitada','barba-ilimitada','Barba ILIMITADA','silver','Barba desenhada quantas vezes quiser.',
   'Para quem mantém a barba como assinatura pessoal e precisa dela sempre alinhada.',
   8990,0,null,10,2,null,false,
   '[{"label":"Barboterapia ilimitada","included":true},
     {"label":"Toalha quente e hidratação","included":true},
     {"label":"10% de desconto nos demais serviços","included":true},
     {"label":"Corte incluso","included":false},
     {"label":"Prioridade na agenda","included":false}]'::jsonb,3),

  ('plan_corte_barba_basic','corte-e-barba-basic','Corte e Barba BASIC','gold','O combo completo, com cota mensal.',
   'Dois cortes e duas barbas por mês, com desconto estendido aos demais serviços.',
   11490,2,2,15,3,45,false,
   '[{"label":"2 cortes por mês","included":true},
     {"label":"2 barboterapias por mês","included":true},
     {"label":"15% de desconto nos demais serviços","included":true},
     {"label":"Prioridade na agenda","included":true},
     {"label":"Cortes ilimitados","included":false}]'::jsonb,4),

  ('plan_corte_barba_ilimitado','corte-e-barba-ilimitado','Corte e Barba ILIMITADO','vip','O plano mais vendido da casa.',
   'Cortes e barbas ilimitados, prioridade máxima na agenda e vantagens exclusivas no Clube Falcão.',
   12990,null,null,20,4,null,true,
   '[{"label":"Cortes ilimitados","included":true},
     {"label":"Barboterapia ilimitada","included":true},
     {"label":"20% de desconto nos demais serviços","included":true},
     {"label":"Prioridade máxima na agenda","included":true},
     {"label":"Cupons exclusivos do Clube Falcão","included":true}]'::jsonb,5)
on conflict (id) do update set
  slug = excluded.slug, name = excluded.name, tier = excluded.tier,
  tagline = excluded.tagline, description = excluded.description,
  price_in_cents = excluded.price_in_cents, haircuts_per_cycle = excluded.haircuts_per_cycle,
  beards_per_cycle = excluded.beards_per_cycle, discount_percentage = excluded.discount_percentage,
  priority = excluded.priority, seats_available = excluded.seats_available,
  is_popular = excluded.is_popular, benefits = excluded.benefits, sort_order = excluded.sort_order;

-- ------------------------- Cupons do clube ----------------------------
insert into barbearia.club_coupons
  (id, title, description, discount_type, discount_value, required_tier, expires_in_hours, usage_limit, sort_order)
values
  ('cpn_pomada','20% em pomadas e finalizadores','Desconto na linha de produtos da casa, válido na loja física.','percentage',20,null,48,1,1),
  ('cpn_amigo','Traga um amigo: primeiro corte com 30% off','Cupom para indicar alguém que ainda não conhece a Falcão.','percentage',30,null,72,2,2),
  ('cpn_sobrancelha','Sobrancelha cortesia','Design de sobrancelha sem custo junto ao seu próximo corte.','fixed',2000,'gold',24,1,3),
  ('cpn_hidratacao','Hidratação capilar por conta da casa','Exclusivo para assinantes do plano ilimitado.','fixed',4000,'vip',24,1,4)
on conflict (id) do update set
  title = excluded.title, description = excluded.description,
  discount_type = excluded.discount_type, discount_value = excluded.discount_value,
  required_tier = excluded.required_tier, expires_in_hours = excluded.expires_in_hours,
  usage_limit = excluded.usage_limit, sort_order = excluded.sort_order;
