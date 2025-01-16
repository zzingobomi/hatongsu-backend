import { Get, Module } from '@nestjs/common';
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

@Module({
  imports: [TypeOrmModule.forFeature([AlbumImageEntity])],
  controllers: [AlbumController],
  providers: [
    AlbumImageUploadUseCase,
    GetAlbumImagesUseCase,
    GetAlbumImagesCursorUseCase,
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
