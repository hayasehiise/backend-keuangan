import { z } from 'zod';

export const LoginScheme = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});
export const RegisterScheme = z.object({
  name: z.string(),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'OWNER', 'KASIR']),
});

export type LoginDto = z.infer<typeof LoginScheme>;
export type RegisterDto = z.infer<typeof RegisterScheme>;
