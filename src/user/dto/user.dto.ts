/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from 'zod';

export const UserScheme = z.object({
  name: z.string(),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'OWNER', 'KASIR']),
  tokoId: z.uuid().optional(),
});
export const CreateUserScheme = UserScheme.refine(
  (data) => {
    if (['OWNER', 'KASIR'].includes(data.role)) {
      return !!data.tokoId;
    }
    return true;
  },
  {
    message: 'Toko Wajib Diisi untuk Role OWNER dan KASIR',
    path: ['tokoId'],
  },
);
export type CreateUserDto = z.infer<typeof CreateUserScheme>;

export const UpdateUserScheme = UserScheme.partial().refine(
  (data) => {
    if (data.role && ['OWNER', 'KASIR'].includes(data.role)) {
      return !!data.tokoId;
    }
    return true;
  },
  {
    message: 'Toko Wajib Diisi untuk Role OWNER dan KASIR',
    path: ['tokoId'],
  },
);
export type UpdateUserDto = z.infer<typeof UpdateUserScheme>;

export const QueryUserScheme = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});
export type QueryUserDto = z.infer<typeof QueryUserScheme>;
