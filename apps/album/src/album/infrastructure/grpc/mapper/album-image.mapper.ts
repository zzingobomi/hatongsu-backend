import { AlbumImageProto } from '@app/common/grpc/proto/album';
import { AlbumImageDomain } from '../../../domain/album-image.domain';
import { GallerySpotType } from '../../../type/gallery-spot-type';

export class AlbumImageMapper {
  static toProto(domain: AlbumImageDomain, path: string): AlbumImageProto {
    return {
      id: domain.id,
      filename: domain.filename,
      path: path,
      dateTime: domain.dateTime?.toISOString(),
      dateTimeOriginal: domain.dateTimeOriginal?.toISOString(),
      dateTimeDigitized: domain.dateTimeDigitized?.toISOString(),
      gallerySpotType: domain.gallerySpotType,
      createdAt: domain.createdAt.toISOString(),
      updatedAt: domain.updatedAt.toISOString(),
    };
  }

  static fromProto(proto: AlbumImageProto): AlbumImageDomain {
    const albumDomain = new AlbumImageDomain();

    albumDomain.id = proto.id;
    albumDomain.filename = proto.filename;
    albumDomain.dateTime = proto.dateTime ? new Date(proto.dateTime) : null;
    albumDomain.dateTimeOriginal = proto.dateTimeOriginal
      ? new Date(proto.dateTimeOriginal)
      : null;
    albumDomain.dateTimeDigitized = proto.dateTimeDigitized
      ? new Date(proto.dateTimeDigitized)
      : null;
    albumDomain.gallerySpotType = proto.gallerySpotType as GallerySpotType;
    albumDomain.createdAt = new Date(proto.createdAt);
    albumDomain.updatedAt = new Date(proto.updatedAt);

    return albumDomain;
  }
}
