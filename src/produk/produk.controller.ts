/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  Req,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import {
  CreateProdukScheme,
  UpdateProdukScheme,
  QueryProdukScheme,
  QueryProdukDto,
  CreateProdukDto,
  UpdateProdukDto,
} from './dto/produk.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  @Post()
  create(@Body() body: CreateProdukDto) {
    const parsed = CreateProdukScheme.parse(body);
    return this.produkService.create(parsed);
  }

  @Get()
  getProduk(@Query() rawQuery: QueryProdukDto, @Req() req: any) {
    const query = QueryProdukScheme.parse(rawQuery);
    const user = req.user;
    return this.produkService.getProduk(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produkService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateProdukDto) {
    const parsed = UpdateProdukScheme.parse(body);
    return this.produkService.update(id, parsed);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produkService.remove(id);
  }
}
