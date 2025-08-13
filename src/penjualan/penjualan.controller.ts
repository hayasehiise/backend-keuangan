import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PenjualanService } from './penjualan.service';
import {
  CreatePenjualanScheme,
  UpdatePenjualanScheme,
  QueryPenjualanScheme,
  CreatePenjualanDto,
  QueryPenjualanDto,
  UpdatePenjualanDto,
} from './dto/penjualan.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('penjualan')
export class PenjualanController {
  constructor(private readonly penjualanService: PenjualanService) {}

  @Post()
  create(@Body() body: CreatePenjualanDto) {
    const parsed = CreatePenjualanScheme.parse(body);
    return this.penjualanService.create(parsed);
  }

  @Get()
  getPenjualan(@Query() rawQuery: QueryPenjualanDto) {
    const queries = QueryPenjualanScheme.parse(rawQuery);
    return this.penjualanService.getPenjualan(queries);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdatePenjualanDto) {
    const parsed = UpdatePenjualanScheme.parse(body);
    return this.penjualanService.update(id, parsed);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.penjualanService.remove(id);
  }
}
