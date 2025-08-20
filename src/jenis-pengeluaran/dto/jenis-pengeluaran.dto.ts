import { z } from 'zod';

const baseSceheme = z.object({
  name: z.string().min(1),
});

export const CreateJenisPengeluaranScheme = baseSceheme;
export type CreateJenisPengeluaranDto = z.infer<
  typeof CreateJenisPengeluaranScheme
>;

export const QueryJenisPengeluaranScheme = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});
export type QueryJenisPengeluaranDto = z.infer<
  typeof QueryJenisPengeluaranScheme
>;
