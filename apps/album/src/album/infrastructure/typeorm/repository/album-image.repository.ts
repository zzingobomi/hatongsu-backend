import { InjectRepository } from '@nestjs/typeorm';
import { AlbumImageDomain } from 'apps/album/src/album/domain/album-image.domain';
import { AlbumImageDatabaseOutputPort } from 'apps/album/src/album/port/output/album-image-database.output-port';
import { AlbumImageEntity } from '../entity/album-image.entity';
import { Repository } from 'typeorm';
import { AlbumImageMapper } from '../mapper/album-image.mapper';

export class AlbumImageRepository implements AlbumImageDatabaseOutputPort {
  constructor(
    @InjectRepository(AlbumImageEntity)
    private readonly albumRepository: Repository<AlbumImageEntity>,
  ) {}

  async saveAlbumImage(album: AlbumImageDomain): Promise<AlbumImageDomain> {
    const result = await this.albumRepository.save(album);

    return new AlbumImageMapper(result).toDomain();
  }
  async updateAlbumImage(album: AlbumImageDomain): Promise<AlbumImageDomain> {
    await this.albumRepository.update(album.id, album);

    const result = await this.albumRepository.findOne({
      where: { id: album.id },
    });

    return new AlbumImageMapper(result).toDomain();
  }
}
