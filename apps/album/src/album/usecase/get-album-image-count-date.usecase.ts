import { Inject, Injectable } from '@nestjs/common';
import { AlbumMicroservice } from '@app/common';
import {
  ALBUM_IMAGE_DATABASE_OUTPUT_PORT,
  ALBUM_IMAGE_STORAGE_OUTPUT_PORT,
} from '../const';
import { AlbumImageDatabaseOutputPort } from '../port/output/album-image-database.output-port';
import { AlbumImageMapper } from '../infrastructure/grpc/mapper/album-image.mapper';
import { AlbumImageStorageOutputPort } from '../port/output/album-image-storage.output-port';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/app-config.type';

@Injectable()
export class GetAlbumImageCountDateUseCase {
  constructor(
    private readonly configService: ConfigService<{ app: AppConfig }>,
    @Inject(ALBUM_IMAGE_DATABASE_OUTPUT_PORT)
    private readonly albumImageDatabaseOutputPort: AlbumImageDatabaseOutputPort,
  ) {}

  async execute(
    request: AlbumMicroservice.AlbumImageCountDateRequest,
  ): Promise<AlbumMicroservice.AlbumImageCountDateResponse> {
    const { startDate, endDate } = request;

    const result =
      await this.albumImageDatabaseOutputPort.getAlbumImageCountDate({
        startDate,
        endDate,
      });

    return { result };
  }
}
