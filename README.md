### Hatongsu backend

##### TODO

- 환경변수값 typescript 처리

##### Protocol buffers

```bash
sudo apt install -y protobuf-compiler
protoc --version

protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto \
--ts_proto_out=./libs/common/src/grpc \
--ts_proto_opt=nestJs=true,addGrpcMetadata=true \
./proto/album.proto
```

##### Architecture

```mermaid
graph TD
    subgraph K8sCluster[Kubernetes Cluster]
        subgraph MicroServices[MicroServices]
            Gateway[Gateway]
            Album[Album]
            User[User]
        end
    end

    subgraph NAS[NAS]
        subgraph Storages[Storage]
            Postgres[(PostgreSQL)]
            Minio[(MinIO)]
        end
        subgraph Queue[Queue]
            Rabbitmq[(Rabbitmq)]
        end
    end

    Gateway ---|REST/HTTP| External[External API]
    Gateway ---|gRPC| User
    Gateway ---|gRPC| Album
    Gateway ---|Message Queue| Rabbitmq

    Album ---|Database Connection| Postgres
    Album ---|Object Storage| Minio
    Album ---|Message Queue| Rabbitmq

    User ---|Database Connection| Postgres
    User ---|gRPC| Album
```

##### TODO

- cursor 에서 ISO 변환이 꼭 필요한 것인가?
