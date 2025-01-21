import { registerAs } from '@nestjs/config';
import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';
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
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  TOKEN_EXPIRE_TIME: string;

  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    tcpPort: parseInt(process.env.TCP_PORT, 10),
    grpcUrl: process.env.GRPC_URL,
    dbUrl: process.env.DB_URL,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    tokenExpireTime: process.env.TOKEN_EXPIRE_TIME,
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  };
});
