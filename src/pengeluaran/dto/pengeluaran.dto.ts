import { z } from 'zod';

const baseSceheme = z.object({
  jenisPengeluaranId: z.uuid(),
  date: z.iso.datetime(),
  nominal: z.number().int().nonnegative(),
  createdBy: z.uuid(),
});

export const CreatePengeluaranScheme = baseSceheme;
export type CreatePengeluaranDto = z.infer<typeof CreatePengeluaranScheme>;

export const UpdatePengeluaranScheme = baseSceheme.optional();
export type UpdatePengeluaranDto = z.infer<typeof UpdatePengeluaranScheme>;

export const QueryPengeluaranScheme = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
export type QueryPengeluaranDto = z.infer<typeof QueryPengeluaranScheme>;
