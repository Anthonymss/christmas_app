import { Controller, Get, Patch, Body, Req, UseGuards, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req) {
    return this.usersRepo.findOne({ where: { id: req.user.userId } });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(@Req() req, @Body() dto: UpdateUserDto) {
    const userId = req.user.userId;
    const username = dto.username.trim().toLowerCase();

    const exists = await this.usersRepo.findOne({ where: { username } });
    if (exists && exists.id !== userId) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    await this.usersRepo.update(userId, { username });
    return { message: 'Usuario actualizado', username };
  }
}
