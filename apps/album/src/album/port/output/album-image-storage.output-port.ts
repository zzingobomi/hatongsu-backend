import { AlbumImageDomain } from '../../domain/album-image.domain';

export interface AlbumImageStorageOutputPort {
  uploadAlbumImage(albumImage: AlbumImageDomain, buffer: Buffer);
  deleteObject(bucketName: string, objectKey: string): Promise<void>;
  generatePresignedUrl(bucketName: string, objectKey: string): Promise<string>;
}
