import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AlbumMicroservice } from '@app/common';
import { join } from 'path';
import { AppConfig } from './config/app-config.type';
import { ALBUM_QUEUE } from '@app/common/const/queues';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<{ app: AppConfig }>);

  // gRPC 마이크로서비스 설정
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: AlbumMicroservice.protobufPackage,
      protoPath: join(process.cwd(), 'proto/album.proto'),
      url: configService.getOrThrow('app.grpcUrl', { infer: true }),
    },
  });

  // RabbitMQ 마이크로서비스 설정
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.getOrThrow<string>('app.rabbitmqUrl', { infer: true }),
      ],
      queue: ALBUM_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  console.log('test');

  await app.init();
  await app.startAllMicroservices();
}
bootstrap();
