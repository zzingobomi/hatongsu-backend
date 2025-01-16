import { AlbumImageProto } from '@app/common/grpc/proto/album';
import { AlbumImageEntity } from '../entity/album-image.entity';
import { AlbumImageDomain } from 'apps/album/src/album/domain/album-image.domain';

export class AlbumImageMapper {
  static toDomain(entity: AlbumImageEntity): AlbumImageDomain {
    const albumDomain = new AlbumImageDomain();

    albumDomain.id = entity.id;
    albumDomain.filename = entity.filename;
    albumDomain.objectKey = entity.objectKey;
    albumDomain.dateTime = entity.dateTime;
    albumDomain.dateTimeOriginal = entity.dateTimeOriginal;
    albumDomain.dateTimeDigitized = entity.dateTimeDigitized;
    albumDomain.createdAt = entity.createdAt;
    albumDomain.updatedAt = entity.updatedAt;

    return albumDomain;
  }

  static toPersistence(domain: AlbumImageDomain): AlbumImageEntity {
    const albumEntity = new AlbumImageEntity();

    albumEntity.id = domain.id;
    albumEntity.filename = domain.filename;
    albumEntity.objectKey = domain.objectKey;
    albumEntity.dateTime = domain.dateTime;
    albumEntity.dateTimeOriginal = domain.dateTimeOriginal;
    albumEntity.dateTimeDigitized = domain.dateTimeDigitized;

    return albumEntity;
  }
}
