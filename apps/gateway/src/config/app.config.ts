import { registerAs } from '@nestjs/config';
import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';
import { AppConfig } from './app-config.type';
import validateConfig from '@app/common/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(0)
  @Max(65535)
  HTTP_PORT: number;

  @IsString()
  USER_GRPC_URL: string;

  @IsString()
  ALBUM_GRPC_URL: string;

  @IsString()
  ALBUM_RABBITMQ_URL: string;

  @IsString()
  FRONTEND_URL: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    httpPort: parseInt(process.env.HTTP_PORT, 10),
    userGrpcUrl: process.env.USER_GRPC_URL,
    albumGrpcUrl: process.env.ALBUM_GRPC_URL,
    albumRabbitmqUrl: process.env.ALBUM_RABBITMQ_URL,
    frontendUrl: process.env.FRONTEND_URL,
  };
});
