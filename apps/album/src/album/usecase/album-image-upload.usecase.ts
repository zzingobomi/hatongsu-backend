import { Inject, Injectable } from '@nestjs/common';
import { AlbumImageDatabaseOutputPort } from '../port/output/album-image-database.output-port';
import {
  ALBUM_IMAGE_DATABASE_OUTPUT_PORT,
  ALBUM_IMAGE_STORAGE_OUTPUT_PORT,
} from '../const';
import { AlbumImageDomain } from '../domain/album-image.domain';
import { AlbumImageUploadDto } from '../dto/album-image-upload.dto';
import { extractExifMetaData } from '../utility/exif.helper';
import { AlbumImageStorageOutputPort } from '../port/output/album-image-storage.output-port';
import { parseExifDateTime } from '../utility/date.helper';

@Injectable()
export class AlbumImageUploadUseCase {
  constructor(
    @Inject(ALBUM_IMAGE_DATABASE_OUTPUT_PORT)
    private readonly albumImageDatabaseOutputPort: AlbumImageDatabaseOutputPort,
    @Inject(ALBUM_IMAGE_STORAGE_OUTPUT_PORT)
    private readonly albumImageStorageOutputPort: AlbumImageStorageOutputPort,
  ) {}

  async execute(data: AlbumImageUploadDto) {
    const buffer = Buffer.from(data.buffer, 'base64');
    const exifMetaData = await extractExifMetaData(buffer);
    const dateTime = parseExifDateTime(exifMetaData.dateTime);

    // AlbumImage 생성
    const albumImage = new AlbumImageDomain({
      dateTime,
      originFileName: data.filename,
    });

    // ObjectStorage 저장
    const resultStorage =
      await this.albumImageStorageOutputPort.uploadAlbumImage(
        albumImage,
        buffer,
      );
    albumImage.setPath(resultStorage);

    // Database 저장
    const resultDatabase =
      await this.albumImageDatabaseOutputPort.saveAlbumImage(albumImage);
    albumImage.assignId(resultDatabase.id);

    return albumImage;
  }
}
