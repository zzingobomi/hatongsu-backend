import { AlbumImageDomain } from '../../domain/album-image.domain';
import { AlbumImageCountDateDto } from '../../dto/album-image-count-date.dto';
import {
  AlbumImageCursorRequestDto,
  AlbumImageFerrisNextRequestDto,
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
  getAlbumImageFerrisNext(
    query: AlbumImageFerrisNextRequestDto,
  ): Promise<AlbumImageDomain>;
  getAlbumImageCountDate(
    query: AlbumImageCountDateDto,
  ): Promise<{ date: string; count: number }[]>;
  getAlbumImagesGallerySpot(): Promise<AlbumImageDomain[]>;
  saveAlbumImage(albumImage: AlbumImageDomain): Promise<AlbumImageDomain>;
  updateAlbumImage(albumImage: AlbumImageDomain): Promise<AlbumImageDomain>;
}
