import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config';
import { AppConfig } from './config/app-config.type';
import { AlbumModule } from './album/album.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath:
        process.env.NODE_ENV === 'local'
          ? `./apps/album/.env.local`
          : undefined,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<{ app: AppConfig }>) => ({
        type: 'postgres',
        url: configService.getOrThrow('app.dbUrl', { infer: true }),
        autoLoadEntities: true,
        synchronize: true,
        timezone: 'Z',
      }),
      inject: [ConfigService],
    }),
    AlbumModule,
  ],
})
export class AppModule {}
