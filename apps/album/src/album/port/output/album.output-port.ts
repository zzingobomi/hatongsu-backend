import { AlbumDomain } from '../../domain/album.domain';

export interface AlbumOutputPort {
  saveAlbum(album: AlbumDomain): Promise<AlbumDomain>;
  updateAlbum(album: AlbumDomain): Promise<AlbumDomain>;
}
