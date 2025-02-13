import { Inject, Injectable } from '@nestjs/common';
import { AlbumMicroservice } from '@app/common';
import {
  ALBUM_IMAGE_DATABASE_OUTPUT_PORT,
  ALBUM_IMAGE_STORAGE_OUTPUT_PORT,
} from '../const';
import { AlbumImageDatabaseOutputPort } from '../port/output/album-image-database.output-port';
import { AlbumImageStorageOutputPort } from '../port/output/album-image-storage.output-port';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/app-config.type';

@Injectable()
export class DeleteAlbumImagesUseCase {
  constructor(
    private readonly configService: ConfigService<{ app: AppConfig }>,
    @Inject(ALBUM_IMAGE_DATABASE_OUTPUT_PORT)
    private readonly albumImageDatabaseOutputPort: AlbumImageDatabaseOutputPort,
    @Inject(ALBUM_IMAGE_STORAGE_OUTPUT_PORT)
    private readonly albumImageStorageOutputPort: AlbumImageStorageOutputPort,
  ) {}

  async execute(
    request: AlbumMicroservice.DeleteAlbumImagesRequest,
  ): Promise<AlbumMicroservice.DeleteAlbumImagesResponse> {
    const { imageIds } = request;

    const images =
      await this.albumImageDatabaseOutputPort.getAlbumImagesByIds(imageIds);
    if (images.length === 0) {
      return { success: false, deletedCount: 0 };
    }

    const bucketName = this.configService.getOrThrow('app.minio.bucketName', {
      infer: true,
    });

    try {
      await Promise.all(
        images.map((image) =>
          this.albumImageStorageOutputPort.deleteObject(
            bucketName,
            image.objectKey,
          ),
        ),
      );
    } catch (error) {
      console.error('Failed to delete images from storage:', error);
    }

    const existingIds = images.map((img) => img.id);
    const deletedCount =
      await this.albumImageDatabaseOutputPort.deleteAlbumImages(existingIds);

    return {
      success: deletedCount > 0,
      deletedCount,
    };
  }
}
