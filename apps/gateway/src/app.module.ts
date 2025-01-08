import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HealthModule } from './health/health.module';
import { VersionModule } from './version/version.module';
import { USER_SERVICE, UserMicroservice } from '@app/common';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import { AppConfig } from './config/app-config.type';

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
      ],
      isGlobal: true,
    }),
    HealthModule,
    VersionModule,
    AuthModule,
  ],
})
export class AppModule {}
