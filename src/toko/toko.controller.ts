import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateTokoScheme,
  UpdateTokoScheme,
  QueryTokoScheme,
  UpdateTokoDto,
  CreateTokoDto,
  QueryTokoDto,
} from './dto/toko.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { TokoService } from './toko.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('toko')
export class TokoController {
  constructor(private readonly tokoService: TokoService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() body: CreateTokoDto) {
    const parsed = CreateTokoScheme.parse(body);
    return this.tokoService.create(parsed);
  }

  @Roles('ADMIN')
  @Put(':id')
  update(@Param(':id') id: string, @Body() body: UpdateTokoDto) {
    const parsed = UpdateTokoScheme.parse(body);
    return this.tokoService.update(id, parsed);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param(':id') id: string) {
    return this.tokoService.remove(id);
  }

  @Roles('ADMIN')
  @Get()
  getToko(@Query() rawQuery: QueryTokoDto) {
    const query = QueryTokoScheme.parse(rawQuery);
    return this.tokoService.getToko(query);
  }

  @Get('/list')
  getTokoList() {
    return this.tokoService.getTokoList();
  }
}
