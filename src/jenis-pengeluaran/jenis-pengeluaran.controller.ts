import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { JenisPengeluaranService } from './jenis-pengeluaran.service';
import {
  CreateJenisPengeluaranScheme,
  QueryJenisPengeluaranScheme,
} from './dto/jenis-pengeluaran.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('jenis-pengeluaran')
export class JenisPengeluaranController {
  constructor(
    private readonly jenisPengeluaranService: JenisPengeluaranService,
  ) {}

  @Post()
  create(@Body() body: unknown) {
    const parsed = CreateJenisPengeluaranScheme.parse(body);
    return this.jenisPengeluaranService.create(parsed);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jenisPengeluaranService.remove(id);
  }

  @Get()
  getData(@Query() rawQuery: unknown) {
    const queries = QueryJenisPengeluaranScheme.parse(rawQuery);
    return this.jenisPengeluaranService.getData(queries);
  }
}
