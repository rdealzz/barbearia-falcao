import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(6, 'A senha precisa ter ao menos 6 caracteres.'),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Informe seu nome completo.'),
    email: z.string().email('Informe um e-mail válido.'),
    phone: z.string().min(14, 'Informe um telefone válido.'),
    password: z.string().min(6, 'A senha precisa ter ao menos 6 caracteres.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  name: z.string().min(3, 'Informe seu nome completo.'),
  email: z.string().email('Informe um e-mail válido.'),
  phone: z.string().min(14, 'Informe um telefone válido.'),
  birthDate: z.string().optional(),
  document: z.string().optional(),
  avatarUrl: z.string().optional(),
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Informe a senha atual.'),
    newPassword: z.string().min(6, 'A nova senha precisa ter ao menos 6 caracteres.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
  });

export const recoverySchema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
