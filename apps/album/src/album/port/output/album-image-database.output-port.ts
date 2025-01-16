import { AlbumImageDomain } from '../../domain/album-image.domain';
import {
  AlbumImageCursorRequestDto,
  AlbumImageRequestDto,
} from '../../dto/album-image-request.dto';

export interface AlbumImageDatabaseOutputPort {
  getAlbumImages(
    query: AlbumImageRequestDto,
  ): Promise<[AlbumImageDomain[], number]>;
  getAlbumImagesCursor(
    query: AlbumImageCursorRequestDto,
  ): Promise<[AlbumImageDomain[], string | null]>;
  saveAlbumImage(albumImage: AlbumImageDomain): Promise<AlbumImageDomain>;
  updateAlbumImage(albumImage: AlbumImageDomain): Promise<AlbumImageDomain>;
}
