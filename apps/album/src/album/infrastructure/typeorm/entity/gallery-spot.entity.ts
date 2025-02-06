import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AlbumImageEntity } from './album-image.entity';

export enum GallerySpotType {
  FLOOR_1_1 = 'FLOOR_1_1',
  FLOOR_1_2 = 'FLOOR_1_2',
}

@Entity('gallery_spot')
export class GallerySpotEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: GallerySpotType,
  })
  type: GallerySpotType;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => AlbumImageEntity, (image) => image.gallerySpot)
  images: AlbumImageEntity[];
}
