import { AlbumImageDomain } from '../../domain/album-image.domain';

export interface AlbumImageDatabaseOutputPort {
  saveAlbumImage(albumImage: AlbumImageDomain): Promise<AlbumImageDomain>;
  updateAlbumImage(albumImage: AlbumImageDomain): Promise<AlbumImageDomain>;
}
