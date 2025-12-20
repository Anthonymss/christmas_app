import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req) {
    return {
      id: req.user.userId,
      username: req.user.username,
    };
  }
}
