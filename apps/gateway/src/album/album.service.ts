import { ALBUM_SERVICE, AlbumMicroservice } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { QueryAlbumImageDto } from './dto/query-album-image.dto';

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

  // TODO: Transform 왜 작동 안하는지 확인하기
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
}
