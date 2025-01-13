export class AlbumImageDomain {
  id: string;
  path: string;

  originFileName?: string;

  // Time info
  dateTime?: Date;
  dateTimeOriginal?: Date;
  dateTimeDigitized?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
