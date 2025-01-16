import { Injectable } from '@nestjs/common';
import { AlbumImageStorageOutputPort } from '../../port/output/album-image-storage.output-port';
import { AlbumImageDomain } from '../../domain/album-image.domain';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'apps/album/src/config/app-config.type';
import * as Minio from 'minio';

@Injectable()
export class AlbumImageStorage implements AlbumImageStorageOutputPort {
  private minioClient: Minio.Client;

  constructor(
    private readonly configService: ConfigService<{ app: AppConfig }>,
  ) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.getOrThrow('app.minio.endPoint', {
        infer: true,
      }),
      port: this.configService.getOrThrow('app.minio.port', { infer: true }),
      useSSL: false,
      accessKey: this.configService.getOrThrow('app.minio.accessKey', {
        infer: true,
      }),
      secretKey: this.configService.getOrThrow('app.minio.secretKey', {
        infer: true,
      }),
    });
  }

  async uploadAlbumImage(albumImage: AlbumImageDomain, buffer: Buffer) {
    const bucketName = this.configService.getOrThrow('app.minio.bucketName', {
      infer: true,
    });
    const filePath = `/${albumImage.objectKey}`;

    try {
      await this.minioClient.putObject(bucketName, filePath, buffer);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async generatePresignedUrl(
    bucketName: string,
    objectKey: string,
  ): Promise<string> {
    return await this.minioClient.presignedGetObject(
      bucketName,
      objectKey,
      60 * 60, // 1시간 유효
    );
  }
}
