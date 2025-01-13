import { AlbumImageDomain } from '../../domain/album-image.domain';
import { AlbumImageRequestDto } from '../../dto/album-image-request.dto';

export interface AlbumImageDatabaseOutputPort {
  getAlbumImages(
    query: AlbumImageRequestDto,
  ): Promise<[AlbumImageDomain[], number]>;
  saveAlbumImage(albumImage: AlbumImageDomain): Promise<AlbumImageDomain>;
  updateAlbumImage(albumImage: AlbumImageDomain): Promise<AlbumImageDomain>;
}
