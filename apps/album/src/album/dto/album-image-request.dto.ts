import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class AlbumImageCursorRequestDto {
  @IsString()
  @IsOptional()
  cursor?: string;

  @IsNumber()
  limit: number;
}

export class AlbumImageInfiniteRequestDto {
  @IsString()
  @IsOptional()
  nextCursor?: string;

  // @IsString()
  // @IsOptional()
  // prevCursor?: string;

  @IsNumber()
  limit: number;
}
