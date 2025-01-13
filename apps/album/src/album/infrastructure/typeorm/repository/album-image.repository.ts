import { InjectRepository } from '@nestjs/typeorm';
import { AlbumImageDomain } from 'apps/album/src/album/domain/album-image.domain';
import { AlbumImageDatabaseOutputPort } from 'apps/album/src/album/port/output/album-image-database.output-port';
import { AlbumImageEntity } from '../entity/album-image.entity';
import { Repository } from 'typeorm';
import { AlbumImageMapper } from '../mapper/album-image.mapper';
import { AlbumImageRequestDto } from '../../../dto/album-image-request.dto';

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
