/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from 'zod';
import { IsOptional, IsNumberString } from 'class-validator';

export const CreateUserScheme = z.object({
  name: z.string(),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'OWNER', 'KASIR']),
});
export const UpdateUserScheme = z.object({
  name: z.string(),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'OWNER', 'KASIR']),
});
export class GetUserDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}

export type CreateUserDto = z.infer<typeof CreateUserScheme>;
export type UpdateUserDto = z.infer<typeof UpdateUserScheme>;
