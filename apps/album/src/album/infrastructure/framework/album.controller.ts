import { AlbumMicroservice } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';

@Controller('album')
@AlbumMicroservice.AlbumServiceControllerMethods()
export class AlbumController
  implements AlbumMicroservice.AlbumServiceController
{
  uploadImage(
    request: Observable<AlbumMicroservice.ImageUploadRequest>,
    metadata?: Metadata,
  ):
    | Promise<AlbumMicroservice.UploadResponse>
    | Observable<AlbumMicroservice.UploadResponse>
    | AlbumMicroservice.UploadResponse {
    throw new Error('Method not implemented.');
  }
}
