import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProdukModule } from './produk/produk.module';
import { PenjualanModule } from './penjualan/penjualan.module';
import { JenisPengeluaranModule } from './jenis-pengeluaran/jenis-pengeluaran.module';
import { ConfigModule } from '@nestjs/config';
import { TokoModule } from './toko/toko.module';
import { PengeluaranModule } from './pengeluaran/pengeluaran.module';

@Module({
  imports: [
    // Importing other modules
    AuthModule,
    UserModule,
    ProdukModule,
    PenjualanModule,
    JenisPengeluaranModule,
    TokoModule,
    PengeluaranModule,
    // Config module for global configuration
    // This allows us to use environment variables throughout the application
    // and can be configured to load from a .env file or other sources.
    // The isGlobal option makes the configuration available in all modules without needing to import it again
    // in each module.
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
