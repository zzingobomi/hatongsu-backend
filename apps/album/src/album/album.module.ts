import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumImageEntity } from './infrastructure/typeorm/entity/album-image.entity';
import { AlbumController } from './infrastructure/framework/album.controller';
import { AlbumImageUploadUseCase } from './usecase/album-image-upload.usecase';
import {
  ALBUM_IMAGE_DATABASE_OUTPUT_PORT,
  ALBUM_IMAGE_STORAGE_OUTPUT_PORT,
} from './const';
import { AlbumImageRepository } from './infrastructure/typeorm/repository/album-image.repository';
import { AlbumImageStorage } from './infrastructure/minio/album-image.storage';
import { GetAlbumImagesUseCase } from './usecase/get-album-images.usecase';
import { GetAlbumImagesCursorUseCase } from './usecase/get-album-images-cursor.usecase';
import { GetAlbumImagesInfiniteUseCase } from './usecase/get-album-images-infinite.usecase';
import { GetAlbumImageFerrisNextUseCase } from './usecase/get-album-image-ferris-next.usecase';
import { GetAlbumImageCountDateUseCase } from './usecase/get-album-image-count-date.usecase';
import { GetAlbumImagesGallerySpotUseCase } from './usecase/get-album-images-gallery-spot.usecase';
import { DeleteAlbumImagesUseCase } from './usecase/delete-album-images.usecase';
import { UpdateGallerySpotUseCase } from './usecase/update-gallery-spot.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumImageEntity])],
  controllers: [AlbumController],
  providers: [
    AlbumImageUploadUseCase,
    GetAlbumImagesUseCase,
    GetAlbumImagesCursorUseCase,
    GetAlbumImagesInfiniteUseCase,
    GetAlbumImageFerrisNextUseCase,
    GetAlbumImageCountDateUseCase,
    DeleteAlbumImagesUseCase,
    GetAlbumImagesGallerySpotUseCase,
    UpdateGallerySpotUseCase,
    {
      provide: ALBUM_IMAGE_DATABASE_OUTPUT_PORT,
      useClass: AlbumImageRepository,
    },
    {
      provide: ALBUM_IMAGE_STORAGE_OUTPUT_PORT,
      useClass: AlbumImageStorage,
    },
  ],
})
export class AlbumModule {}
