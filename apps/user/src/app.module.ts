import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import { AppConfig } from './config/app-config.type';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath:
        process.env.NODE_ENV === 'local' ? `./apps/user/.env.local` : undefined,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<{ app: AppConfig }>) => ({
        type: 'postgres',
        url: configService.getOrThrow('app.dbUrl', { infer: true }),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
