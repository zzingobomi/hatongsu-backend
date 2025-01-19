import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// export class FilterAlbumImageDto {
//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => RoleDto)
//   roles?: RoleDto[] | null;
// }

export class SortAlbumImageDto {
  @Type(() => String)
  @IsString()
  orderBy: string;

  @IsString()
  order: string;
}

export class QueryAlbumImageDto {
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  //   @IsOptional()
  //   @Transform(({ value }) =>
  //     value ? plainToInstance(FilterUserDto, JSON.parse(value)) : undefined,
  //   )
  //   @ValidateNested()
  //   @Type(() => FilterUserDto)
  //   filters?: FilterUserDto | null;

  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortAlbumImageDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortAlbumImageDto)
  sort?: SortAlbumImageDto[] | null;
}

export class QueryAlbumImageCursorDto {
  @IsString()
  @IsOptional()
  cursor?: string;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class QueryAlbumImageInfiniteDto {
  @IsString()
  @IsOptional()
  nextCursor?: string;

  // @IsString()
  // @IsOptional()
  // prevCursor?: string;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;
}
