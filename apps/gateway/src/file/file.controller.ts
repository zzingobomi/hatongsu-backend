import {
  Body,
  Controller,
  ParseArrayPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files', 100))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body(
      'lastModifiedTimestamps',
      new ParseArrayPipe({ items: Number, separator: ',' }),
    )
    lastModifiedTimestamps: number[],
  ) {
    return this.fileService.uploadFiles(files, lastModifiedTimestamps);
  }
}
