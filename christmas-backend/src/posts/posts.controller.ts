import { Controller, Get, Post as HttpPost, Body, UseGuards, Request, Param, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UploadsService } from '../uploads/uploads.service';
import { PostCategory, PostType } from './post.entity';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly uploadsService: UploadsService
    ) { }

    @Get()
    async list(@Query('category') category: PostCategory) {
        return this.postsService.list(category);
    }

    @UseGuards(JwtAuthGuard)
    @HttpPost('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @Request() req,
        @UploadedFile() file: any,
        @Body('category') category: PostCategory,
        @Body('type') type: PostType,
        @Body('description') description?: string
    ) {
        const url = await this.uploadsService.uploadFile(file.buffer, file.originalname, file.mimetype);
        return this.postsService.create(req.user.userId, category, type, url, description);
    }

    @UseGuards(JwtAuthGuard)
    @HttpPost('create')
    async create(
        @Request() req,
        @Body('url') url: string,
        @Body('category') category: PostCategory,
        @Body('type') type: PostType,
        @Body('description') description?: string
    ) {
        return this.postsService.create(req.user.userId, category, type, url, description);
    }

    @UseGuards(JwtAuthGuard)
    @Get('mine')
    async getMyPosts(@Request() req) {
        return this.postsService.getMyPosts(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @HttpPost(':id/replace')
    @UseInterceptors(FileInterceptor('file'))
    async replace(
        @Request() req,
        @Param('id') id: string,
        @UploadedFile() file: any,
        @Body('description') description?: string
    ) {
        const url = await this.uploadsService.uploadFile(file.buffer, file.originalname, file.mimetype);
        return this.postsService.replacePost(req.user.userId, +id, url, description);
    }

    @UseGuards(JwtAuthGuard)
    @HttpPost(':id/comments')
    async comment(
        @Request() req,
        @Param('id') id: string,
        @Body('content') content: string
    ) {
        return this.postsService.addComment(req.user.userId, +id, content);
    }
}
