import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/app-config.type';
import { ResolvePromisesInterceptor } from '@app/common/utils/serializer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<{ app: AppConfig }>);

  app.enableCors({
    origin: configService.getOrThrow('app.frontendUrl', { infer: true }),
    credentials: false,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  await app.listen(process.env.HTTP_PORT ?? 4000);
}
bootstrap();
