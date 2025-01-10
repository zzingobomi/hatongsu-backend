import { AlbumMicroservice, FILE_UPLOADED_EVENT } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AlbumImageUploadUseCase } from '../../usecase/album-image-upload.usecase';
import { AlbumImageUploadDto } from '../../dto/album-image-upload.dto';

@Controller('album')
@AlbumMicroservice.AlbumServiceControllerMethods()
export class AlbumController
  implements AlbumMicroservice.AlbumServiceController
{
  constructor(private readonly imageUploadUseCase: AlbumImageUploadUseCase) {}

  getImage(
    request: AlbumMicroservice.ImageRequest,
    metadata?: Metadata,
  ):
    | Promise<AlbumMicroservice.ImageResponse>
    | Observable<AlbumMicroservice.ImageResponse>
    | AlbumMicroservice.ImageResponse {
    throw new Error('Method not implemented.');
  }

  @EventPattern(FILE_UPLOADED_EVENT)
  fileUploaded(data: AlbumImageUploadDto) {
    return this.imageUploadUseCase.execute(data);
  }
}
