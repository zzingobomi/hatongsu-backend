import { GallerySpotType } from '../type/gallery-spot-type';

export class AlbumImageDomain {
  id: string;
  filename: string;
  objectKey: string;

  // Time info
  dateTime?: Date;
  dateTimeOriginal?: Date;
  dateTimeDigitized?: Date;

  // Gallery
  gallerySpotType: GallerySpotType;

  createdAt?: Date;
  updatedAt?: Date;
}
