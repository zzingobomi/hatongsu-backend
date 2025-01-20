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
import { v4 as uuidv4 } from 'uuid';

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

    // fallback 순서: dateTimeOriginal -> dateTime -> dateTimeDigitized
    const resolvedDateTime = dateTimeOriginal || dateTime || dateTimeDigitized;

    // AlbumImage 생성
    const albumImage = new AlbumImageDomain();
    albumImage.id = uuidv4();
    albumImage.filename = data.filename;
    albumImage.objectKey = `${albumImage.id}-${albumImage.filename}`;
    albumImage.dateTime = dateTime;
    albumImage.dateTimeOriginal = resolvedDateTime;
    albumImage.dateTimeDigitized = dateTimeDigitized;

    // ObjectStorage 저장
    await this.albumImageStorageOutputPort.uploadAlbumImage(albumImage, buffer);

    // Database 저장
    const resultDatabase =
      await this.albumImageDatabaseOutputPort.saveAlbumImage(albumImage);

    return albumImage;
  }
}
