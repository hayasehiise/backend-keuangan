import { z } from 'zod';

export const AuthBaseScheme = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});
export const LoginScheme = AuthBaseScheme;
export type LoginDto = z.infer<typeof LoginScheme>;

export const RegisterScheme = AuthBaseScheme.extend({
  name: z.string(),
  role: z.enum(['ADMIN', 'OWNER', 'KASIR']),
});
export type RegisterDto = z.infer<typeof RegisterScheme>;
