import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  Controller,
  UseGuards,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import {
  CreateProdukScheme,
  UpdateProdukScheme,
  QueryProdukScheme,
} from './dto/produk.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  @Post()
  create(@Body() body: unknown) {
    const parsed = CreateProdukScheme.parse(body);
    return this.produkService.create(parsed);
  }

  @Get()
  getProduk(@Query() rawQuery: unknown) {
    const query = QueryProdukScheme.parse(rawQuery);
    return this.produkService.getProduk(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produkService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const parsed = UpdateProdukScheme.parse(body);
    return this.produkService.update(id, parsed);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produkService.remove(id);
  }
}
