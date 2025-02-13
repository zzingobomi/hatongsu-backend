import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class DeleteAlbumImageDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'imageIds 배열은 비어있을 수 없습니다.' })
  @IsString({ each: true, message: '각 이미지 ID는 문자열이어야 합니다.' })
  imageIds: string[];
}
