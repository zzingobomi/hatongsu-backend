export class AlbumImageDomain {
  id: string;
  filename: string;
  objectKey: string;

  // Time info
  dateTime?: Date;
  dateTimeOriginal?: Date;
  dateTimeDigitized?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
