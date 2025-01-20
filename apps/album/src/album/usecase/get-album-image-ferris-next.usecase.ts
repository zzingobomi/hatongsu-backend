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
export class GetAlbumImageFerrisNextUseCase {
  constructor(
    private readonly configService: ConfigService<{ app: AppConfig }>,
    @Inject(ALBUM_IMAGE_DATABASE_OUTPUT_PORT)
    private readonly albumImageDatabaseOutputPort: AlbumImageDatabaseOutputPort,
    @Inject(ALBUM_IMAGE_STORAGE_OUTPUT_PORT)
    private readonly albumImageStorageOutputPort: AlbumImageStorageOutputPort,
  ) {}

  async execute(
    request: AlbumMicroservice.AlbumImageFerrisNextRequest,
  ): Promise<AlbumMicroservice.AlbumImageFerrisNextResponse> {
    const { id, skip } = request;

    const albumImage =
      await this.albumImageDatabaseOutputPort.getAlbumImageFerrisNext({
        id,
        skip,
      });

    const bucketName = this.configService.getOrThrow('app.minio.bucketName', {
      infer: true,
    });

    const albumImageWithUrl = AlbumImageMapper.toProto(
      albumImage,
      await this.albumImageStorageOutputPort.generatePresignedUrl(
        bucketName,
        albumImage.objectKey,
      ),
    );

    return {
      albumImage: albumImageWithUrl,
    };
  }
}
