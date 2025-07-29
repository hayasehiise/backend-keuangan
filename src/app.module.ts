import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProdukModule } from './produk/produk.module';

@Module({
  imports: [AuthModule, UserModule, ProdukModule],
})
export class AppModule {}
