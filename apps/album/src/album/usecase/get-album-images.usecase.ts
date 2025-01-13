import { Inject, Injectable } from '@nestjs/common';
import { AlbumMicroservice } from '@app/common';
import { ALBUM_IMAGE_DATABASE_OUTPUT_PORT } from '../const';
import { AlbumImageDatabaseOutputPort } from '../port/output/album-image-database.output-port';
import { AlbumImageMapper } from '../infrastructure/grpc/mapper/album-image.mapper';

@Injectable()
export class GetAlbumImagesUseCase {
  constructor(
    @Inject(ALBUM_IMAGE_DATABASE_OUTPUT_PORT)
    private readonly albumImageDatabaseOutputPort: AlbumImageDatabaseOutputPort,
  ) {}

  async execute(
    request: AlbumMicroservice.AlbumImageRequest,
  ): Promise<AlbumMicroservice.AlbumImageResponse> {
    const { sort, page, limit } = request;

    const result = await this.albumImageDatabaseOutputPort.getAlbumImages({
      sort,
      page,
      limit,
    });

    return {
      albumImages: result[0].map((albumImage) =>
        AlbumImageMapper.toProto(albumImage),
      ),
      totalCount: result[1],
    };
  }
}
