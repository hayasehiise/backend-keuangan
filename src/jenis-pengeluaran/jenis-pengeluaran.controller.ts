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
  CreateJenisPengeluaranDto,
  CreateJenisPengeluaranScheme,
  QueryJenisPengeluaranDto,
  QueryJenisPengeluaranScheme,
} from './dto/jenis-pengeluaran.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('jenis-pengeluaran')
export class JenisPengeluaranController {
  constructor(
    private readonly jenisPengeluaranService: JenisPengeluaranService,
  ) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() body: CreateJenisPengeluaranDto) {
    const parsed = CreateJenisPengeluaranScheme.parse(body);
    return this.jenisPengeluaranService.create(parsed);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jenisPengeluaranService.remove(id);
  }

  @Get()
  getData(@Query() rawQuery: QueryJenisPengeluaranDto) {
    const queries = QueryJenisPengeluaranScheme.parse(rawQuery);
    return this.jenisPengeluaranService.getData(queries);
  }

  @Get('list')
  getList() {
    return this.jenisPengeluaranService.getList();
  }
}
