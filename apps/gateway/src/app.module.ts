import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HealthModule } from './health/health.module';
import { VersionModule } from './version/version.module';
import {
  ALBUM_QUEUE_SERVICE,
  ALBUM_SERVICE,
  AlbumMicroservice,
  USER_SERVICE,
  UserMicroservice,
} from '@app/common';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import { AppConfig } from './config/app-config.type';
import { UserModule } from './user/user.module';
import { BearerTokenMiddleware } from './auth/middleware/bearer-token.middleware';
import { FileModule } from './file/file.module';
import { ALBUM_QUEUE } from '@app/common/const/queues';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath:
        process.env.NODE_ENV === 'local'
          ? `./apps/gateway/.env.local`
          : undefined,
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: USER_SERVICE,
          useFactory: (configService: ConfigService<{ app: AppConfig }>) => ({
            transport: Transport.GRPC,
            options: {
              package: UserMicroservice.protobufPackage,
              protoPath: join(process.cwd(), 'proto/user.proto'),
              url: configService.getOrThrow('app.userGrpcUrl', { infer: true }),
            },
          }),
          inject: [ConfigService],
        },
        {
          name: ALBUM_QUEUE_SERVICE,
          useFactory: (configService: ConfigService<{ app: AppConfig }>) => ({
            transport: Transport.RMQ,
            options: {
              urls: [
                configService.getOrThrow<string>('app.albumRabbitmqUrl', {
                  infer: true,
                }),
              ],
              queue: ALBUM_QUEUE,
            },
          }),
          inject: [ConfigService],
        },
        {
          name: ALBUM_SERVICE,
          useFactory: (configService: ConfigService<{ app: AppConfig }>) => ({
            transport: Transport.GRPC,
            options: {
              package: AlbumMicroservice.protobufPackage,
              protoPath: join(process.cwd(), 'proto/album.proto'),
              url: configService.getOrThrow('app.albumGrpcUrl', {
                infer: true,
              }),
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
    HealthModule,
    VersionModule,
    AuthModule,
    UserModule,
    FileModule,
    AlbumModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BearerTokenMiddleware).forRoutes('album', 'user');
  }
}
