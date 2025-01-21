import { IsDateString } from 'class-validator';

export class AlbumImageCountDateDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
