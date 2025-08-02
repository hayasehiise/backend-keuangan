import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProdukModule } from './produk/produk.module';
import { PenjualanModule } from './penjualan/penjualan.module';

@Module({
  imports: [AuthModule, UserModule, ProdukModule, PenjualanModule],
})
export class AppModule {}
