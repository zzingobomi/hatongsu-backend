export type AppConfig = {
  tcpPort: number;
  grpcUrl: string;
  dbUrl: string;
  rabbitmqUrl: string;
  minio: {
    endPoint: string;
    port: number;
    accessKey: string;
    secretKey: string;
    bucketName: string;
  };
};
