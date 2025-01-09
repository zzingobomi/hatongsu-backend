import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from './infrastructure/typeorm/entity/album.entity';
import { AlbumController } from './infrastructure/framework/album.controller';
import { ImageUploadUseCase } from './usecase/image-upload.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumEntity])],
  controllers: [AlbumController],
  providers: [ImageUploadUseCase],
})
export class AlbumModule {}
