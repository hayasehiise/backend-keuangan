import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProdukModule } from './produk/produk.module';
import { PenjualanModule } from './penjualan/penjualan.module';
import { JenisPengeluaranModule } from './jenis-pengeluaran/jenis-pengeluaran.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProdukModule,
    PenjualanModule,
    JenisPengeluaranModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
