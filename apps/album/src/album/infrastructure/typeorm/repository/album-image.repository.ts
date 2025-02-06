import { InjectRepository } from '@nestjs/typeorm';
import { AlbumImageDomain } from 'apps/album/src/album/domain/album-image.domain';
import { AlbumImageDatabaseOutputPort } from 'apps/album/src/album/port/output/album-image-database.output-port';
import { AlbumImageEntity } from '../entity/album-image.entity';
import { Repository } from 'typeorm';
import { AlbumImageMapper } from '../mapper/album-image.mapper';
import {
  AlbumImageCursorRequestDto,
  AlbumImageFerrisNextRequestDto,
  AlbumImageInfiniteRequestDto,
  AlbumImageRequestDto,
} from '../../../dto/album-image-request.dto';
import * as dayjs from 'dayjs';
import { NotFoundException } from '@nestjs/common';
import { AlbumImageCountDateDto } from '../../../dto/album-image-count-date.dto';

export class AlbumImageRepository implements AlbumImageDatabaseOutputPort {
  constructor(
    @InjectRepository(AlbumImageEntity)
    private readonly albumRepository: Repository<AlbumImageEntity>,
  ) {}

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

  async getAlbumImagesInfinite(
    query: AlbumImageInfiniteRequestDto,
  ): Promise<[AlbumImageDomain[], { nextCursor: string }]> {
    const queryBuilder = this.albumRepository.createQueryBuilder('albumImage');
    const limit = query.limit || 10;

    if (query.nextCursor) {
      const decodedCursor = Buffer.from(query.nextCursor, 'base64').toString(
        'utf-8',
      );
      const [cursorDate, cursorId] = decodedCursor.split('_');
      const isoCursorDate = dayjs(cursorDate).toISOString();

      queryBuilder.where(
        `(albumImage.dateTimeOriginal < :cursorDate) OR 
       (albumImage.dateTimeOriginal = :cursorDate AND albumImage.id < :cursorId)`,
        { cursorDate: isoCursorDate, cursorId },
      );
    }

    queryBuilder
      .orderBy('albumImage.dateTimeOriginal', 'DESC')
      .addOrderBy('albumImage.id', 'DESC')
      .take(limit);

    let entities = await queryBuilder.getMany();

    // 데이터가 부족한 경우 처음부터 나머지 데이터를 가져옴
    if (entities.length < limit) {
      const remainingLimit = limit - entities.length;

      const wrappingQuery = this.albumRepository
        .createQueryBuilder('albumImage')
        .orderBy('albumImage.dateTimeOriginal', 'DESC')
        .addOrderBy('albumImage.id', 'DESC')
        .take(remainingLimit);

      const wrappingEntities = await wrappingQuery.getMany();
      entities = [...entities, ...wrappingEntities];
    }

    let nextCursor = '';
    if (entities.length > 0) {
      const lastItem = entities[entities.length - 1];
      nextCursor = Buffer.from(
        `${dayjs(lastItem.dateTimeOriginal).format('YYYY-MM-DD HH:mm:ss.SSS')}_${lastItem.id}`,
      ).toString('base64');
    }

    return [
      entities.map((entity) => AlbumImageMapper.toDomain(entity)),
      { nextCursor },
    ];
  }

  async getAlbumImageFerrisNext(
    query: AlbumImageFerrisNextRequestDto,
  ): Promise<AlbumImageDomain> {
    const totalCount = await this.albumRepository.count();

    if (totalCount === 0) {
      throw new NotFoundException('No images found in the album');
    }

    const currentImage = await this.albumRepository.findOne({
      where: { id: query.id },
    });

    if (!currentImage) {
      throw new NotFoundException(`Image with id ${query.id} not found`);
    }

    const currentIndex = await this.albumRepository
      .createQueryBuilder('albumImage')
      .where(
        `(albumImage.dateTimeOriginal > :dateTimeOriginal) OR 
       (albumImage.dateTimeOriginal = :dateTimeOriginal AND albumImage.id > :id)`,
        {
          dateTimeOriginal: currentImage.dateTimeOriginal,
          id: currentImage.id,
        },
      )
      .getCount();

    const nextIndex = (currentIndex + query.skip) % totalCount;

    const nextImage = await this.albumRepository
      .createQueryBuilder('albumImage')
      .orderBy('albumImage.dateTimeOriginal', 'DESC')
      .addOrderBy('albumImage.id', 'DESC')
      .skip(nextIndex)
      .take(1)
      .getOne();

    if (!nextImage) {
      throw new NotFoundException('Failed to fetch next image');
    }

    return AlbumImageMapper.toDomain(nextImage);
  }

  async getAlbumImageCountDate(
    dto: AlbumImageCountDateDto,
  ): Promise<{ date: string; count: number }[]> {
    const queryBuilder = this.albumRepository
      .createQueryBuilder('albumImage')
      .select('DATE(albumImage.dateTimeOriginal)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('DATE(albumImage.dateTimeOriginal) >= :startDate', {
        startDate: dto.startDate,
      })
      .andWhere('DATE(albumImage.dateTimeOriginal) <= :endDate', {
        endDate: dto.endDate,
      })
      .groupBy('DATE(albumImage.dateTimeOriginal)')
      .orderBy('date', 'ASC');

    const results = await queryBuilder.getRawMany();

    return results.map((result) => ({
      date: dayjs(result.date).format('YYYY-MM-DD'),
      count: parseInt(result.count),
    }));
  }

  // TODO: 추후 GallerySpotEntity 를 이용해서 관리할 수 있도록 수정
  async getAlbumImagesGallerySpot(): Promise<AlbumImageDomain[]> {
    const entities = await this.albumRepository.find({
      take: 10,
      order: {
        dateTimeOriginal: 'DESC',
      },
    });

    return entities.map((entity) => AlbumImageMapper.toDomain(entity));
  }
}
