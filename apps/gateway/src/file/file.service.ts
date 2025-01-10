import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/app-config.type';
import { ClientProxy } from '@nestjs/microservices';
import {
  ALBUM_QUEUE_SERVICE,
  FILE_UPLOADED_EVENT,
  SUCCESS_MESSAGES,
} from '@app/common';

interface AlbumImageUploadPayload {
  filename: string;
  size: number;
  mimetype: string;
  buffer: string;
}

@Injectable()
export class FileService {
  constructor(
    @Inject(ALBUM_QUEUE_SERVICE) private readonly client: ClientProxy,
  ) {}

  async uploadFiles(files: Express.Multer.File[]) {
    files.forEach((file) => {
      const payload: AlbumImageUploadPayload = {
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        buffer: file.buffer.toString('base64'),
      };

      this.client.emit(FILE_UPLOADED_EVENT, payload);
    });

    return { message: SUCCESS_MESSAGES.FILE_UPLOADED_SUCCESS };
  }
}
