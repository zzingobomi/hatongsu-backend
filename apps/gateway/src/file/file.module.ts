import { Module, UnprocessableEntityException } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/app-config.type';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<{ all: AppConfig }>) => {
        return {
          fileFilter: (request, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|ico)$/i)) {
              // TODO: Exception
              return callback(
                new UnprocessableEntityException('cantUploadFileType'),
                false,
              );
            }

            callback(null, true);
          },
          storage: memoryStorage(),
          // storage: diskStorage({
          //   destination: './file',
          //   filename: (request, file, callback) => {
          //     const path = request.params.path ?? 'public';
          //     callback(
          //       null,
          //       `${path}/${randomStringGenerator()}.${file.originalname
          //         .split('.')
          //         .pop()
          //         ?.toLowerCase()}`,
          //     );
          //   },
          // }),
          // limits: {
          //   fileSize: configService.get('file.maxFileSize', { infer: true }),
          // },
        };
      },
    }),
  ],
  controllers: [FileController],
  providers: [ConfigModule, ConfigService, FileService],
})
export class FileModule {}
