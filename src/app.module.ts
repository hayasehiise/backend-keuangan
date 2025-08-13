import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProdukModule } from './produk/produk.module';
import { PenjualanModule } from './penjualan/penjualan.module';
import { JenisPengeluaranModule } from './jenis-pengeluaran/jenis-pengeluaran.module';
import { ConfigModule } from '@nestjs/config';
import { TokoModule } from './toko/toko.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ProdukModule,
    PenjualanModule,
    JenisPengeluaranModule,
    TokoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
