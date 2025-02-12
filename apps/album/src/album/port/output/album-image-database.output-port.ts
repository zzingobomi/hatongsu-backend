import { AlbumImageDomain } from '../../domain/album-image.domain';
import { AlbumImageCountDateDto } from '../../dto/album-image-count-date.dto';
import {
  AlbumImageCursorRequestDto,
  AlbumImageFerrisNextRequestDto,
  AlbumImageInfiniteRequestDto,
  AlbumImageRequestDto,
} from '../../dto/album-image-request.dto';
import { GallerySpotType } from '../../type/gallery-spot-type';

export interface AlbumImageDatabaseOutputPort {
  findAlbumImageById(imageId: string): Promise<AlbumImageDomain | null>;
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
  getAlbumImagesByIds(imageIds: string[]): Promise<AlbumImageDomain[]>;
  deleteAlbumImages(imageIds: string[]): Promise<number>;
  getAlbumImagesGallerySpot(): Promise<Record<string, AlbumImageDomain[]>>;
  saveAlbumImage(albumImage: AlbumImageDomain): Promise<AlbumImageDomain>;
  updateAlbumImage(albumImage: AlbumImageDomain): Promise<AlbumImageDomain>;
  findAlbumImageBySpot(
    gallerySpotType: GallerySpotType,
  ): Promise<AlbumImageDomain | null>;
  updateAlbumImageSpot(
    imageId: string,
    gallerySpotType: GallerySpotType,
  ): Promise<AlbumImageDomain>;
}
