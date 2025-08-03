import { z } from 'zod';

const BaseScheme = z.object({
  produkId: z.uuid(),
  date: z.iso.datetime(),
  quantity: z.number().int().min(1),
  diskon: z.number().int().min(0).max(100),
  createdBy: z.uuid(),
});

export const CreatePenjualanScheme = BaseScheme;
export type CreatePenjualanDto = z.infer<typeof CreatePenjualanScheme>;

export const UpdatePenjualanScheme = BaseScheme.partial();
export type UpdatePenjualanDto = z.infer<typeof UpdatePenjualanScheme>;

export const QueryPenjualanScheme = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
export type QueryPenjualanDto = z.infer<typeof QueryPenjualanScheme>;
