import { AlbumMicroservice, FILE_UPLOADED_EVENT } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AlbumImageUploadUseCase } from '../../usecase/album-image-upload.usecase';
import { AlbumImageUploadDto } from '../../dto/album-image-upload.dto';
import { GetAlbumImagesUseCase } from '../../usecase/get-album-images.usecase';
import { GetAlbumImagesCursorUseCase } from '../../usecase/get-album-images-cursor.usecase';
import { GetAlbumImagesInfiniteUseCase } from '../../usecase/get-album-images-infinite.usecase';
import { GetAlbumImageFerrisNextUseCase } from '../../usecase/get-album-image-ferris-next.usecase';
import { GetAlbumImageCountDateUseCase } from '../../usecase/get-album-image-count-date.usecase';
import { GetAlbumImagesGallerySpotUseCase } from '../../usecase/get-album-images-gallery-spot.usecase';
import { DeleteAlbumImagesUseCase } from '../../usecase/delete-album-images.usecase';
import { UpdateGallerySpotUseCase } from '../../usecase/update-gallery-spot.usecase';

@Controller('album')
@AlbumMicroservice.AlbumServiceControllerMethods()
export class AlbumController
  implements AlbumMicroservice.AlbumServiceController
{
  constructor(
    private readonly imageUploadUseCase: AlbumImageUploadUseCase,
    private readonly getAlbumImagesUseCase: GetAlbumImagesUseCase,
    private readonly getAlbumImagesCursorUseCase: GetAlbumImagesCursorUseCase,
    private readonly getAlbumImagesInfiniteUseCase: GetAlbumImagesInfiniteUseCase,
    private readonly getAlbumImageFerrisNextUseCase: GetAlbumImageFerrisNextUseCase,
    private readonly getAlbumImageCountDateUseCase: GetAlbumImageCountDateUseCase,
    private readonly deleteAlbumImagesUseCase: DeleteAlbumImagesUseCase,
    private readonly getAlbumImagesGallerySpotUseCase: GetAlbumImagesGallerySpotUseCase,
    private readonly updateGallerySpotUseCase: UpdateGallerySpotUseCase,
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

  async getAlbumImagesInfinite(
    request: AlbumMicroservice.AlbumImageInfiniteRequest,
    metadata?: Metadata,
  ) {
    const result = await this.getAlbumImagesInfiniteUseCase.execute(request);
    return result;
  }

  async getAlbumImageFerrisNext(
    request: AlbumMicroservice.AlbumImageFerrisNextRequest,
    metadata?: Metadata,
  ) {
    const result = await this.getAlbumImageFerrisNextUseCase.execute(request);
    return result;
  }

  async getAlbumImageCountDate(
    request: AlbumMicroservice.AlbumImageCountDateRequest,
    metadata?: Metadata,
  ) {
    const result = await this.getAlbumImageCountDateUseCase.execute(request);
    return result;
  }

  async getAlbumImagesGallerySpot(
    request: AlbumMicroservice.AlbumImageGallerySpotRequest,
    metadata?: Metadata,
  ) {
    const result = await this.getAlbumImagesGallerySpotUseCase.execute(request);
    return result;
  }

  async deleteAlbumImages(
    request: AlbumMicroservice.DeleteAlbumImagesRequest,
    metadata?: Metadata,
  ) {
    const result = await this.deleteAlbumImagesUseCase.execute(request);
    return result;
  }

  async updateGallerySpot(
    request: AlbumMicroservice.UpdateGallerySpotRequest,
    metadata?: Metadata,
  ) {
    const result = await this.updateGallerySpotUseCase.execute(request);
    return result;
  }
}
