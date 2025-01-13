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
import { parseExifTime } from '../utility/date.helper';

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
    const dateTime = parseExifTime(exifMetaData.dateTime);
    const dateTimeOriginal = parseExifTime(exifMetaData.dateTimeOriginal);
    const dateTimeDigitized = parseExifTime(exifMetaData.dateTimeDigitized);

    // AlbumImage 생성
    const albumImage = new AlbumImageDomain();
    albumImage.originFileName = data.filename;
    albumImage.dateTime = dateTime;
    albumImage.dateTimeOriginal = dateTimeOriginal;
    albumImage.dateTimeDigitized = dateTimeDigitized;

    // ObjectStorage 저장
    const resultStorage =
      await this.albumImageStorageOutputPort.uploadAlbumImage(
        albumImage,
        buffer,
      );
    albumImage.path = resultStorage;

    // Database 저장
    const resultDatabase =
      await this.albumImageDatabaseOutputPort.saveAlbumImage(albumImage);
    albumImage.id = resultDatabase.id;

    return albumImage;
  }
}
