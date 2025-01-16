import { AlbumMicroservice, FILE_UPLOADED_EVENT } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AlbumImageUploadUseCase } from '../../usecase/album-image-upload.usecase';
import { AlbumImageUploadDto } from '../../dto/album-image-upload.dto';
import { GetAlbumImagesUseCase } from '../../usecase/get-album-images.usecase';
import { GetAlbumImagesCursorUseCase } from '../../usecase/get-album-images-cursor.usecase';

@Controller('album')
@AlbumMicroservice.AlbumServiceControllerMethods()
export class AlbumController
  implements AlbumMicroservice.AlbumServiceController
{
  constructor(
    private readonly imageUploadUseCase: AlbumImageUploadUseCase,
    private readonly getAlbumImagesUseCase: GetAlbumImagesUseCase,
    private readonly getAlbumImagesCursorUseCase: GetAlbumImagesCursorUseCase,
  ) {}

  @EventPattern(FILE_UPLOADED_EVENT)
  fileUploaded(data: AlbumImageUploadDto) {
    return this.imageUploadUseCase.execute(data);
  }

  async getAlbumImages(
    request: AlbumMicroservice.AlbumImageRequest,
    metadata?: Metadata,
  ) {
    const result = await this.getAlbumImagesUseCase.execute(request);
    return result;
  }

  async getAlbumImagesCursor(
    request: AlbumMicroservice.AlbumImageCursorRequest,
    metadata?: Metadata,
  ) {
    const result = await this.getAlbumImagesCursorUseCase.execute(request);
    return result;
  }
}
