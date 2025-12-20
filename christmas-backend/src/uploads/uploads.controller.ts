import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('presign')
  async presign(@Body() body: { mimeType: string }) {
    return this.uploadsService.getPresignedUrl(body.mimeType);
  }
}
