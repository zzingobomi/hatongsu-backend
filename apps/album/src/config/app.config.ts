import { registerAs } from '@nestjs/config';
import { IsInt, IsString, Max, Min } from 'class-validator';
import { AppConfig } from './app-config.type';
import validateConfig from '@app/common/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(0)
  @Max(65535)
  TCP_PORT: number;

  @IsString()
  GRPC_URL: string;

  @IsString()
  DB_URL: string;

  @IsString()
  RABBITMQ_URL: string;

  @IsString()
  MINIO_ENDPOINT: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  MINIO_PORT: number;

  @IsString()
  MINIO_ACCESS_KEY: string;

  @IsString()
  MINIO_SECRET_KEY: string;

  @IsString()
  MINIO_BUCKET_NAME: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    tcpPort: parseInt(process.env.TCP_PORT, 10),
    grpcUrl: process.env.GRPC_URL,
    dbUrl: process.env.DB_URL,
    rabbitmqUrl: process.env.RABBITMQ_URL,
    minio: {
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT, 10),
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
      bucketName: process.env.MINIO_BUCKET_NAME,
    },
  };
});
