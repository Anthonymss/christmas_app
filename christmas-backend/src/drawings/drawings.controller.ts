import { Controller, Get, Post, Body, Query, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DrawingsService } from './drawings.service';
import { CreateDrawingDto } from './dto/create-drawing.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UploadsService } from '../uploads/uploads.service';

@Controller('drawings')
export class DrawingsController {
  constructor(
    private readonly drawingsService: DrawingsService,
    private readonly uploadsService: UploadsService
  ) { }
  @Get()
  list(@Query('category') category?: 'CONCURSO' | 'NAVIDAD_FEA') {
    return this.drawingsService.list(category);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Req() req, @Body() dto: CreateDrawingDto, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    const imageUrl = await this.uploadsService.uploadFile(file.buffer, file.originalname, file.mimetype);
    return this.drawingsService.create(req.user.userId, dto, imageUrl);
  }
}
