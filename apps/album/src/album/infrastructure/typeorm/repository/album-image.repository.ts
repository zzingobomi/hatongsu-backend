import { InjectRepository } from '@nestjs/typeorm';
import { AlbumImageDomain } from 'apps/album/src/album/domain/album-image.domain';
import { AlbumImageDatabaseOutputPort } from 'apps/album/src/album/port/output/album-image-database.output-port';
import { AlbumImageEntity } from '../entity/album-image.entity';
import { Repository } from 'typeorm';
import { AlbumImageMapper } from '../mapper/album-image.mapper';
import {
  AlbumImageCursorRequestDto,
  AlbumImageRequestDto,
} from '../../../dto/album-image-request.dto';
import * as dayjs from 'dayjs';

export class AlbumImageRepository implements AlbumImageDatabaseOutputPort {
  constructor(
    @InjectRepository(AlbumImageEntity)
    private readonly albumRepository: Repository<AlbumImageEntity>,
  ) {}

  async getAlbumImages(
    query: AlbumImageRequestDto,
  ): Promise<[AlbumImageDomain[], number]> {
    // const where: FindOptionsWhere<UserEntity> = {};
    // if (filterOptions?.roles?.length) {
    //   where.role = filterOptions.roles.map((role) => ({
    //     id: Number(role.id),
    //   }));
    // }

    const [entities, totalCount] = await this.albumRepository.findAndCount({
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      //where: where,
      order: query.sort?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return [
      entities.map((entity) => AlbumImageMapper.toDomain(entity)),
      totalCount,
    ];
  }

  async getAlbumImagesCursor(
    query: AlbumImageCursorRequestDto,
  ): Promise<[AlbumImageDomain[], string | null]> {
    const queryBuilder = this.albumRepository.createQueryBuilder('albumImage');

    if (query.cursor) {
      const decodedCursor = Buffer.from(query.cursor, 'base64').toString(
        'utf-8',
      );
      const [cursorDate, cursorId] = decodedCursor.split('_');

      // TODO: ISO 변환이 꼭 필요한 것인가?
      const isoCursorDate = dayjs(cursorDate).toISOString();

      queryBuilder.where(
        `(albumImage.dateTimeOriginal < :cursorDate) OR 
         (albumImage.dateTimeOriginal = :cursorDate AND albumImage.id < :cursorId)`,
        { cursorDate: isoCursorDate, cursorId },
      );
    }

    queryBuilder
      .orderBy('albumImage.dateTimeOriginal', 'DESC')
      .addOrderBy('albumImage.id', 'DESC');

    const entities = await queryBuilder.take(query.limit + 1).getMany();

    let nextCursor: string | null = null;
    if (entities.length > query.limit) {
      const lastItem = entities[query.limit - 1];
      nextCursor = Buffer.from(
        `${lastItem.dateTimeOriginal}_${lastItem.id}`,
      ).toString('base64');

      entities.pop();
    }

    return [
      entities.map((entity) => AlbumImageMapper.toDomain(entity)),
      nextCursor,
    ];
  }

  async saveAlbumImage(album: AlbumImageDomain): Promise<AlbumImageDomain> {
    const result = await this.albumRepository.save(album);

    return AlbumImageMapper.toDomain(result);
  }
  async updateAlbumImage(album: AlbumImageDomain): Promise<AlbumImageDomain> {
    await this.albumRepository.update(album.id, album);

    const result = await this.albumRepository.findOne({
      where: { id: album.id },
    });

    return AlbumImageMapper.toDomain(result);
  }
}
