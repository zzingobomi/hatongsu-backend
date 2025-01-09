import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AlbumMicroservice } from '@app/common';
import { join } from 'path';
import { AppConfig } from './config/app-config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<{ app: AppConfig }>);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: AlbumMicroservice.protobufPackage,
      protoPath: join(process.cwd(), 'proto/album.proto'),
      url: configService.getOrThrow('app.grpcUrl', { infer: true }),
    },
  });

  await app.init();

  await app.startAllMicroservices();
}
bootstrap();
