import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AlbumImageDomain } from '../domain/album-image.domain';

// export class FilterDto {
//   @IsString()
//   field: string;

//   @IsString()
//   value: string;
// }

export class SortAlbumImageDto {
  @IsString()
  orderBy: string;

  @IsNumber()
  order: string;
}

export class AlbumImageRequestDto {
  // @ValidateNested({ each: true })
  // @Type(() => FilterDto)
  // filters: FilterDto[];

  @ValidateNested()
  @Type(() => SortAlbumImageDto)
  sort?: SortAlbumImageDto[];

  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;
}
