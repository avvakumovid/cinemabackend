import { Controller, HttpCode, Post, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
    constructor(private readonly FileService: FileService) { }

    @Post()
    @HttpCode(200)
    @Auth('admin')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFiles(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
        return this.FileService.saveFiles([file], folder)
    }
}
