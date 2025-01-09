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
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    tcpPort: parseInt(process.env.TCP_PORT, 10),
    grpcUrl: process.env.GRPC_URL,
    dbUrl: process.env.DB_URL,
  };
});
