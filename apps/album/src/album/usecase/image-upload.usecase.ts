import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageUploadUseCase {
  async execute() {
    console.log('ImageUploadUseCase');
  }
}
