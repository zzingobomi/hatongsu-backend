import { Inject, Injectable } from '@nestjs/common';
import { AlbumMicroservice } from '@app/common';
import { ALBUM_IMAGE_DATABASE_OUTPUT_PORT } from '../const';
import { AlbumImageDatabaseOutputPort } from '../port/output/album-image-database.output-port';
import { GallerySpotType } from '../type/gallery-spot-type';

@Injectable()
export class UpdateGallerySpotUseCase {
  constructor(
    @Inject(ALBUM_IMAGE_DATABASE_OUTPUT_PORT)
    private readonly albumImageDatabaseOutputPort: AlbumImageDatabaseOutputPort,
  ) {}

  async execute(
    request: AlbumMicroservice.UpdateGallerySpotRequest,
  ): Promise<AlbumMicroservice.UpdateGallerySpotResponse> {
    const { imageId, spotType } = request;
    const gallerySpotType = spotType as GallerySpotType;

    const image =
      await this.albumImageDatabaseOutputPort.findAlbumImageById(imageId);
    if (!image) {
      throw new Error(`Image with id ${imageId} not found`);
    }

    if (gallerySpotType === GallerySpotType.None) {
      await this.albumImageDatabaseOutputPort.updateAlbumImageSpot(
        imageId,
        GallerySpotType.None,
      );
    } else {
      const imageWithSameSpot =
        await this.albumImageDatabaseOutputPort.findAlbumImageBySpot(
          gallerySpotType,
        );

      if (imageWithSameSpot && imageWithSameSpot.id !== imageId) {
        await this.albumImageDatabaseOutputPort.updateAlbumImageSpot(
          imageWithSameSpot.id,
          GallerySpotType.None,
        );
      }

      await this.albumImageDatabaseOutputPort.updateAlbumImageSpot(
        imageId,
        gallerySpotType,
      );
    }

    return { success: true };
  }
}
