-- =====================================================================
-- Barbearia Falcão — usuários de acesso e agenda de demonstração
-- Dois níveis de login para a equipe:
--   barbeiro@falcao.com → barbeiro-chefe (dono)
--   lucas@falcao.com    → barbeiro funcionário
-- =====================================================================

insert into barbearia.profiles
  (id, role, staff_role, name, email, phone, birth_date, address, barber_id,
   notes, email_verified, marketing_opt_in, password_hash)
values
  ('usr_cliente_1','client',null,'Erick Jesus','cliente@falcao.com','(41) 99677-2138','2006-05-16',
   '{"city":"Curitiba","state":"PR","district":"Novo Mundo"}'::jsonb,null,null,true,true,
   barbearia.hash_password('falcao123')),

  ('usr_cliente_2','client',null,'André Ribeiro','andre@exemplo.com','(41) 98812-4410','1994-02-08',
   null,null,'Prefere máquina 1 nas laterais.',true,false,null),

  ('usr_cliente_3','client',null,'Bruno Carvalho','bruno@exemplo.com','(41) 99120-7788',null,
   null,null,'Alérgico a produtos com mentol.',true,true,null),

  ('usr_cliente_4','client',null,'Thiago Nunes','thiago@exemplo.com','(41) 99655-1020',null,
   null,null,null,true,false,null),

  ('usr_barbeiro_1','barber','owner','Rafael Falcão','barbeiro@falcao.com','(41) 99000-0001',null,
   null,'brb_falcao',null,true,false, barbearia.hash_password('falcao123')),

  ('usr_barbeiro_2','barber','barber','Lucas Moreira','lucas@falcao.com','(41) 99000-0002',null,
   null,'brb_lucas',null,true,false, barbearia.hash_password('falcao123'))
on conflict (id) do update set
  role = excluded.role, staff_role = excluded.staff_role, name = excluded.name,
  email = excluded.email, phone = excluded.phone, barber_id = excluded.barber_id,
  notes = excluded.notes,
  password_hash = coalesce(barbearia.profiles.password_hash, excluded.password_hash);

-- ------------------------- Agenda de demonstração ---------------------
-- Datas relativas a current_date para a agenda nunca nascer vencida.
insert into barbearia.appointments
  (id, code, client_id, barber_id, service_id, date, start_time, end_time, status,
   price_in_cents, payment_method, payment_status, payment_amount, notes)
values
  ('apt_1001','FLC-1000','usr_cliente_1','brb_falcao','svc_corte_barba',current_date,'10:00','11:10','confirmed',9000,'cash','pending',9000,'Degradê baixo, barba alinhada.'),
  ('apt_1002','FLC-1001','usr_cliente_2','brb_falcao','svc_corte',current_date,'11:30','12:10','in_progress',5500,'cash','pending',5500,null),
  ('apt_1003','FLC-1002','usr_cliente_3','brb_falcao','svc_barba',current_date,'14:00','14:40','confirmed',4500,'cash','pending',4500,'Alérgico a mentol.'),
  ('apt_1004','FLC-1003','usr_cliente_4','brb_falcao','svc_corte',current_date,'16:00','16:40','pending',5500,'cash','pending',5500,null),
  ('apt_1005','FLC-1004','usr_cliente_2','brb_lucas','svc_corte',current_date,'09:30','10:10','completed',5500,'credit_card','paid',5500,null),
  ('apt_1006','FLC-1005','usr_cliente_1','brb_falcao','svc_corte',current_date + 3,'15:00','15:40','confirmed',5500,'cash','pending',5500,null),
  ('apt_1007','FLC-1006','usr_cliente_3','brb_lucas','svc_corte_barba',current_date + 1,'10:30','11:40','confirmed',9000,'cash','pending',9000,null),
  ('apt_1008','FLC-1007','usr_cliente_4','brb_diego','svc_platinado',current_date + 2,'13:00','16:00','confirmed',22000,'cash','pending',22000,null),
  ('apt_1009','FLC-1008','usr_cliente_1','brb_falcao','svc_corte_barba',current_date - 14,'10:00','11:10','completed',9000,'credit_card','paid',9000,null),
  ('apt_1010','FLC-1009','usr_cliente_1','brb_falcao','svc_corte',current_date - 30,'18:00','18:40','completed',5500,'credit_card','paid',5500,null),
  ('apt_1011','FLC-1010','usr_cliente_1','brb_lucas','svc_pezinho',current_date - 44,'09:00','09:20','no_show',2500,'cash','pending',2500,null)
on conflict (id) do nothing;

-- ------------------------- Bloqueios ----------------------------------
insert into barbearia.time_off (id, barber_id, reason, start_date, end_date, start_time, end_time, note)
values
  ('off_1','brb_lucas','ferias',current_date + 10,current_date + 17,null,null,'Férias programadas.'),
  ('off_2','brb_falcao','ausencia',current_date + 4,current_date + 4,'09:00','13:00','Compromisso pessoal pela manhã.')
on conflict (id) do nothing;

-- ------------------------- Assinatura de demonstração -----------------
insert into barbearia.subscriptions
  (id, user_id, plan_id, status, started_at, current_period_start, current_period_end,
   next_charge_at, auto_renew, haircuts_used, beards_used)
values
  ('sub_1','usr_cliente_1','plan_corte_barba_ilimitado','active',
   now() - interval '102 days', now() - interval '12 days', now() + interval '18 days',
   now() + interval '18 days', true, 2, 1)
on conflict (id) do nothing;

insert into barbearia.subscription_invoices
  (id, subscription_id, amount_in_cents, status, due_date, paid_at, method)
values
  ('inv_3','sub_1',12990,'paid',current_date - 12, now() - interval '12 days','credit_card'),
  ('inv_2','sub_1',12990,'paid',current_date - 42, now() - interval '42 days','pix'),
  ('inv_1','sub_1',12990,'paid',current_date - 72, now() - interval '72 days','pix')
on conflict (id) do nothing;
