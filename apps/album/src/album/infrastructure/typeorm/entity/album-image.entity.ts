import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('album_image')
export class AlbumImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @Column()
  dateTime: Date;
}
