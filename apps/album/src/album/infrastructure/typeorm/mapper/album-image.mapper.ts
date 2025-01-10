import { AlbumImageEntity } from '../entity/album-image.entity';
import { AlbumImageDomain } from 'apps/album/src/album/domain/album-image.domain';

export class AlbumImageMapper {
  constructor(private readonly album: AlbumImageEntity) {}

  toDomain() {
    const album = new AlbumImageDomain({
      dateTime: this.album.dateTime,
    });

    album.assignId(this.album.id);
    album.setPath(this.album.path);

    return album;
  }
}
