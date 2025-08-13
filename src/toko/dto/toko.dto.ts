import { z } from 'zod';

export const TokoScheme = z.object({
  nama: z.string().min(1),
});

export const CreateTokoScheme = TokoScheme;
export type CreateTokoDto = z.infer<typeof CreateTokoScheme>;

export const UpdateTokoScheme = TokoScheme.partial();
export type UpdateTokoDto = z.infer<typeof UpdateTokoScheme>;

export const QueryTokoScheme = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});
export type QueryTokoDto = z.infer<typeof QueryTokoScheme>;
