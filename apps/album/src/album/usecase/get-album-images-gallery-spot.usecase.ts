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
import { GallerySpotType } from '../type/gallery-spot-type';

@Injectable()
export class GetAlbumImagesGallerySpotUseCase {
  constructor(
    private readonly configService: ConfigService<{ app: AppConfig }>,
    @Inject(ALBUM_IMAGE_DATABASE_OUTPUT_PORT)
    private readonly albumImageDatabaseOutputPort: AlbumImageDatabaseOutputPort,
    @Inject(ALBUM_IMAGE_STORAGE_OUTPUT_PORT)
    private readonly albumImageStorageOutputPort: AlbumImageStorageOutputPort,
  ) {}

  async execute(
    request: AlbumMicroservice.AlbumImageGallerySpotRequest,
  ): Promise<AlbumMicroservice.AlbumImageGallerySpotResponse> {
    const groupedImages =
      await this.albumImageDatabaseOutputPort.getAlbumImagesGallerySpot();

    const spotImages: Record<string, AlbumMicroservice.AlbumImageList> = {};

    const bucketName = this.configService.getOrThrow('app.minio.bucketName', {
      infer: true,
    });

    for (const [spotType, images] of Object.entries(groupedImages)) {
      if (spotType === GallerySpotType.None) continue;

      const imagesWithUrls = await Promise.all(
        images.map(async (image) => ({
          ...AlbumImageMapper.toProto(
            image,
            await this.albumImageStorageOutputPort.generatePresignedUrl(
              bucketName,
              image.objectKey,
            ),
          ),
        })),
      );

      spotImages[spotType] = { images: imagesWithUrls };
    }

    return { spotImages };
  }
}
