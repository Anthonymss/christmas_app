import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadsModule } from '../uploads/uploads.module';
import { DrawingsService } from './drawings.service';
import { DrawingsController } from './drawings.controller';
import { Drawing } from './drawing.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Drawing, User]), UploadsModule],
  providers: [DrawingsService],
  controllers: [DrawingsController],
})
export class DrawingsModule { }
