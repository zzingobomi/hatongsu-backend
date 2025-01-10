import { AlbumImageDomain } from '../../domain/album-image.domain';

export interface AlbumImageStorageOutputPort {
  uploadAlbumImage(
    albumImage: AlbumImageDomain,
    buffer: Buffer,
  ): Promise<string>;
}
