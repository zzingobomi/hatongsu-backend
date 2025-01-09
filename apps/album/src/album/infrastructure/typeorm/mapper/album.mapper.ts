import { AlbumEntity } from '../entity/album.entity';
import { AlbumDomain } from 'apps/album/src/album/domain/album.domain';

export class AlbumMapper {
  constructor(private readonly album: AlbumEntity) {}

  toDomain() {
    const album = new AlbumDomain({
      path: this.album.path,
      dateTime: this.album.dateTime,
      userId: this.album.userId,
    });

    album.assignId(this.album.id);

    return album;
  }
}
