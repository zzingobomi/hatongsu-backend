import {
  Body,
  Controller,
  ParseArrayPipe,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TokenGuard } from '../auth/guard/token.guard';
import { Role } from '../auth/decorator/role.decorator';
import { UserRole } from '../const/user.role';
import { RoleGuard } from '../auth/guard/role.guard';

@UseGuards(TokenGuard)
@Role(UserRole.ADMIN)
@UseGuards(RoleGuard)
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
