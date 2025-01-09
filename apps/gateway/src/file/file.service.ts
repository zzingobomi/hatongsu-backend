import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/app-config.type';
import { exiftool } from 'exiftool-vendored';

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService<{ app: AppConfig }>,
  ) {}

  async uploadFiles(files: Express.Multer.File[]) {
    // if (!files || files.length === 0) {
    //   throw new UnprocessableEntityException('No files provided');
    // }
    // try {
    //   const results = await Promise.all(
    //     files.map(async (file) => {
    //       if (!file || !file.buffer) {
    //         console.error('Invalid file object or missing buffer:', file);
    //         return {
    //           originalname: file?.originalname || 'unknown',
    //           error: 'Invalid file or missing buffer',
    //         };
    //       }
    //       try {
    //         // buffer로부터 EXIF 데이터 추출
    //         const metadata = await exiftool.readFromBuffer(file);
    //         return {
    //           filename: file.originalname,
    //           size: file.size,
    //           metadata: {
    //             dateTaken: metadata.DateTimeOriginal,
    //             location: {
    //               latitude: metadata.GPSLatitude,
    //               longitude: metadata.GPSLongitude,
    //               altitude: metadata.GPSAltitude,
    //               locationName: metadata.LocationName,
    //             },
    //             camera: {
    //               make: metadata.Make,
    //               model: metadata.Model,
    //               lens: metadata.LensModel,
    //               software: metadata.Software,
    //             },
    //             imageSize: {
    //               width: metadata.ImageWidth,
    //               height: metadata.ImageHeight,
    //             },
    //             settings: {
    //               iso: metadata.ISO,
    //               shutterSpeed: metadata.ShutterSpeed,
    //               aperture: metadata.Aperture,
    //               focalLength: metadata.FocalLength,
    //             },
    //           },
    //         };
    //       } catch (error) {
    //         console.error(`Error processing file ${file.originalname}:`, error);
    //         return {
    //           filename: file.originalname,
    //           size: file.size,
    //           error: `Failed to extract EXIF data: ${error.message}`,
    //         };
    //       }
    //     }),
    //   );
    //   // 작업이 모두 끝나면 exiftool 프로세스를 종료
    //   await exiftool.end();
    //   return results;
    // } catch (error) {
    //   console.error('Error in uploadFiles:', error);
    //   throw new UnprocessableEntityException('Failed to process files');
    // }
  }
}
