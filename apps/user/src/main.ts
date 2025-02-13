import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserMicroservice } from '@app/common';
import { join } from 'path';
import { AppConfig } from './config/app-config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<{ app: AppConfig }>);

  console.log('user');

  // gRPC 마이크로서비스 설정
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: UserMicroservice.protobufPackage,
      protoPath: join(process.cwd(), 'proto/user.proto'),
      url: configService.getOrThrow('app.grpcUrl', { infer: true }),
    },
  });

  await app.init();
  await app.startAllMicroservices();
}
bootstrap();
