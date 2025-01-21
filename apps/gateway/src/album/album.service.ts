import { ALBUM_SERVICE, AlbumMicroservice } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  QueryAlbumImageCursorDto,
  QueryAlbumImageDto,
  QueryAlbumImageFerrisNextDto,
  QueryAlbumImageInfiniteDto,
} from './dto/query-album-image.dto';
import { AlbumImageCountDateDto } from './dto/album-image-count-date.dto';

@Injectable()
export class AlbumService implements OnModuleInit {
  albumService: AlbumMicroservice.AlbumServiceClient;

  constructor(
    @Inject(ALBUM_SERVICE)
    private readonly albumMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.albumService =
      this.albumMicroservice.getService<AlbumMicroservice.AlbumServiceClient>(
        ALBUM_SERVICE,
      );
  }

  getAlbumImages(query: QueryAlbumImageDto) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    return lastValueFrom(
      this.albumService.getAlbumImages({
        sort: query?.sort,
        page,
        limit,
      }),
    );
  }

  getAlbumImagesCursor(query: QueryAlbumImageCursorDto) {
    const limit = query?.limit ?? 10;

    return lastValueFrom(
      this.albumService.getAlbumImagesCursor({
        cursor: query?.cursor,
        limit,
      }),
    );
  }

  getAlbumImagesInfinite(query: QueryAlbumImageInfiniteDto) {
    const limit = query?.limit ?? 10;

    return lastValueFrom(
      this.albumService.getAlbumImagesInfinite({
        nextCursor: query?.nextCursor,
        //prevCursor: query?.prevCursor,
        limit,
      }),
    );
  }

  getAlbumImageFerrisNext(query: QueryAlbumImageFerrisNextDto) {
    return lastValueFrom(
      this.albumService.getAlbumImageFerrisNext({
        id: query.id,
        skip: query.skip,
      }),
    );
  }

  getImageCountDate(query: AlbumImageCountDateDto) {
    return lastValueFrom(
      this.albumService.getAlbumImageCountDate({
        startDate: query.startDate,
        endDate: query.endDate,
      }),
    );
  }
}
