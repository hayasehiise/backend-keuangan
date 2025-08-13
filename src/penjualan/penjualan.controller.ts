/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  Req,
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
  create(@Body() body: CreatePenjualanDto, @Req() req: any) {
    const parsed = CreatePenjualanScheme.parse(body);
    const user = req.user;
    return this.penjualanService.create(parsed, user);
  }

  @Get()
  getPenjualan(@Query() rawQuery: QueryPenjualanDto, @Req() req: any) {
    const queries = QueryPenjualanScheme.parse(rawQuery);
    const user = req.user;
    return this.penjualanService.getPenjualan(queries, user);
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
