import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { GallerySpotEntity } from './gallery-spot.entity';

@Entity('album_image')
export class AlbumImageEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  objectKey: string;

  @Column({ nullable: true })
  dateTime: Date;

  @Column({ nullable: true })
  dateTimeOriginal: Date;

  @Column({ nullable: true })
  dateTimeDigitized: Date;

  @ManyToOne(() => GallerySpotEntity, (spot) => spot.images, { nullable: true })
  gallerySpot: GallerySpotEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @VersionColumn({ name: 'version' })
  version: number;
}
