import { InjectRepository } from '@nestjs/typeorm';
import { AlbumDomain } from 'apps/album/src/album/domain/album.domain';
import { AlbumOutputPort } from 'apps/album/src/album/port/output/album.output-port';
import { AlbumEntity } from '../entity/album.entity';
import { Repository } from 'typeorm';
import { AlbumMapper } from '../mapper/album.mapper';

export class AlbumRepository implements AlbumOutputPort {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
  ) {}

  async saveAlbum(album: AlbumDomain): Promise<AlbumDomain> {
    const result = await this.albumRepository.save(album);

    return new AlbumMapper(result).toDomain();
  }
  async updateAlbum(album: AlbumDomain): Promise<AlbumDomain> {
    await this.albumRepository.update(album.id, album);

    const result = await this.albumRepository.findOne({
      where: { id: album.id },
    });

    return new AlbumMapper(result).toDomain();
  }
}
