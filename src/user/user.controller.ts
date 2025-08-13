/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserScheme,
  QueryUserScheme,
} from './dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Roles('ADMIN')
  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @Roles('ADMIN')
  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Roles('ADMIN')
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const parsed = UpdateUserScheme.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error.flatten());

    return this.userService.update(id, parsed.data);
  }

  @Roles('ADMIN', 'OWNER')
  @Get()
  getUsers(@Query() rawQuery: unknown, @Req() req: any) {
    const query = QueryUserScheme.parse(rawQuery);
    return this.userService.getUsers(query, req.user);
  }
}
