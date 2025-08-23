import { z } from 'zod';

const baseSceheme = z.object({
  jenisPengeluaranId: z.string(),
  date: z.iso.datetime(),
  nominal: z.number().int().nonnegative(),
  detailPencatatan: z.string().max(500).optional(),
});

export const CreatePengeluaranScheme = baseSceheme;
export type CreatePengeluaranDto = z.infer<typeof CreatePengeluaranScheme>;

export const UpdatePengeluaranScheme = baseSceheme.optional();
export type UpdatePengeluaranDto = z.infer<typeof UpdatePengeluaranScheme>;

export const QueryPengeluaranScheme = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});
export type QueryPengeluaranDto = z.infer<typeof QueryPengeluaranScheme>;
