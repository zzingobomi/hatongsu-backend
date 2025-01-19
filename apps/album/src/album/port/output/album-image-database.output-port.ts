import { AlbumImageDomain } from '../../domain/album-image.domain';
import {
  AlbumImageCursorRequestDto,
  AlbumImageInfiniteRequestDto,
  AlbumImageRequestDto,
} from '../../dto/album-image-request.dto';

export interface AlbumImageDatabaseOutputPort {
  getAlbumImages(
    query: AlbumImageRequestDto,
  ): Promise<[AlbumImageDomain[], number]>;
  getAlbumImagesCursor(
    query: AlbumImageCursorRequestDto,
  ): Promise<[AlbumImageDomain[], string | null]>;
  getAlbumImagesInfinite(
    query: AlbumImageInfiniteRequestDto,
  ): Promise<[AlbumImageDomain[], { nextCursor: string }]>;
  saveAlbumImage(albumImage: AlbumImageDomain): Promise<AlbumImageDomain>;
  updateAlbumImage(albumImage: AlbumImageDomain): Promise<AlbumImageDomain>;
}
