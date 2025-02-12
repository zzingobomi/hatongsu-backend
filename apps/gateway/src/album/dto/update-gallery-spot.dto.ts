import { IsEnum, IsString } from 'class-validator';
import { GallerySpotType } from '../type/gallery-spot-type';

export class UpdateGallerySpotDto {
  @IsString()
  imageId: string;

  @IsEnum(GallerySpotType)
  spotType: GallerySpotType;
}
