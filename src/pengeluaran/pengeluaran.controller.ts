/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { PengeluaranService } from './pengeluaran.service';
import {
  CreatePengeluaranScheme,
  UpdatePengeluaranScheme,
  QueryPengeluaranScheme,
  QueryPengeluaranDto,
  CreatePengeluaranDto,
  UpdatePengeluaranDto,
} from './dto/pengeluaran.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pengeluaran')
export class PengeluaranController {
  constructor(private readonly pengeluaranService: PengeluaranService) {}

  @Roles('KASIR', 'OWNER')
  @Post()
  create(@Body() body: CreatePengeluaranDto, @Req() req: any) {
    const parsed = CreatePengeluaranScheme.parse(body);
    const user = req.user;
    return this.pengeluaranService.create(parsed, user);
  }

  @Get()
  getPengeluaran(@Query() rawQuery: QueryPengeluaranDto, @Req() req: any) {
    const queries = QueryPengeluaranScheme.parse(rawQuery);
    const user = req.user;
    return this.pengeluaranService.getPengeluaran(queries, user);
  }

  @Roles('ADMIN', 'OWNER')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdatePengeluaranDto) {
    const parsed = UpdatePengeluaranScheme.parse(body);
    return this.pengeluaranService.update(id, parsed);
  }

  @Roles('ADMIN', 'OWNER')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pengeluaranService.remove(id);
  }
}
