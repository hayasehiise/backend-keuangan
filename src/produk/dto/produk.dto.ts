import { z } from 'zod';

const BaseProdukScheme = z.object({
  nama: z.string().min(1),
  harga: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  status: z.enum(['TERSEDIA', 'STOK_HABIS']),
});

export const CreateProdukScheme = BaseProdukScheme;
export type CreateProdukDto = z.infer<typeof CreateProdukScheme>;

export const UpdateProdukScheme = BaseProdukScheme.partial();
export type UpdateProdukDto = z.infer<typeof UpdateProdukScheme>;

export const QueryProdukScheme = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});
export type QueryProdukDto = z.infer<typeof QueryProdukScheme>;
