export type AppConfig = {
  tcpPort: number;
  grpcUrl: string;
  dbUrl: string;
  accessTokenSecret: string;
  refreshTokenSecret: string;
  tokenExpireTime: string;
  google: {
    clientId: string;
    clientSecret: string;
  };
};
