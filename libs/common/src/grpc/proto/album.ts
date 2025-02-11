// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v5.29.0
// source: proto/album.proto

/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "album";

export interface AlbumImageProto {
  /** 이미지 ID */
  id: string;
  /** 이미지 파일명 */
  filename: string;
  /** 이미지 경로 */
  path: string;
  /** 이미지 촬영 시간 */
  dateTime?:
    | string
    | undefined;
  /** 원본 촬영 시간 */
  dateTimeOriginal?:
    | string
    | undefined;
  /** 디지털화 시간 */
  dateTimeDigitized?:
    | string
    | undefined;
  /** 생성 시간 */
  createdAt: string;
  /** 수정 시간 */
  updatedAt: string;
}

export interface Sort {
  orderBy: string;
  order: string;
}

export interface AlbumImageRequest {
  /** Filter filters = 1; */
  sort: Sort[];
  page: number;
  limit: number;
}

export interface AlbumImageResponse {
  albumImages: AlbumImageProto[];
  totalCount: number;
}

export interface AlbumImageCursorRequest {
  cursor?: string | undefined;
  limit: number;
}

export interface AlbumImageCursorResponse {
  albumImages: AlbumImageProto[];
  nextCursor: string;
  hasNextPage: boolean;
}

export interface AlbumImageInfiniteRequest {
  nextCursor?:
    | string
    | undefined;
  /** optional string prev_cursor = 2; */
  limit: number;
}

export interface AlbumImageInfiniteResponse {
  albumImages: AlbumImageProto[];
  /** string prev_cursor = 3; */
  nextCursor: string;
}

export interface AlbumImageFerrisNextRequest {
  id: string;
  skip: number;
}

export interface AlbumImageFerrisNextResponse {
  albumImage: AlbumImageProto | undefined;
}

export interface AlbumImageCountDateRequest {
  startDate: string;
  endDate: string;
}

export interface CountDateResponse {
  date: string;
  count: number;
}

export interface AlbumImageCountDateResponse {
  result: CountDateResponse[];
}

export interface DeleteAlbumImagesRequest {
  imageIds: string[];
}

export interface DeleteAlbumImagesResponse {
  success: boolean;
  deletedCount: number;
}

export interface AlbumImageGallerySpotRequest {
}

export interface AlbumImageGallerySpotResponse {
  albumImages: AlbumImageProto[];
}

export const ALBUM_PACKAGE_NAME = "album";

export interface AlbumServiceClient {
  /** MainPage, Dashboard */

  getAlbumImages(request: AlbumImageRequest, metadata?: Metadata): Observable<AlbumImageResponse>;

  getAlbumImagesCursor(request: AlbumImageCursorRequest, metadata?: Metadata): Observable<AlbumImageCursorResponse>;

  getAlbumImagesInfinite(
    request: AlbumImageInfiniteRequest,
    metadata?: Metadata,
  ): Observable<AlbumImageInfiniteResponse>;

  getAlbumImageFerrisNext(
    request: AlbumImageFerrisNextRequest,
    metadata?: Metadata,
  ): Observable<AlbumImageFerrisNextResponse>;

  getAlbumImageCountDate(
    request: AlbumImageCountDateRequest,
    metadata?: Metadata,
  ): Observable<AlbumImageCountDateResponse>;

  deleteAlbumImages(request: DeleteAlbumImagesRequest, metadata?: Metadata): Observable<DeleteAlbumImagesResponse>;

  /** Gallery */

  getAlbumImagesGallerySpot(
    request: AlbumImageGallerySpotRequest,
    metadata?: Metadata,
  ): Observable<AlbumImageGallerySpotResponse>;
}

export interface AlbumServiceController {
  /** MainPage, Dashboard */

  getAlbumImages(
    request: AlbumImageRequest,
    metadata?: Metadata,
  ): Promise<AlbumImageResponse> | Observable<AlbumImageResponse> | AlbumImageResponse;

  getAlbumImagesCursor(
    request: AlbumImageCursorRequest,
    metadata?: Metadata,
  ): Promise<AlbumImageCursorResponse> | Observable<AlbumImageCursorResponse> | AlbumImageCursorResponse;

  getAlbumImagesInfinite(
    request: AlbumImageInfiniteRequest,
    metadata?: Metadata,
  ): Promise<AlbumImageInfiniteResponse> | Observable<AlbumImageInfiniteResponse> | AlbumImageInfiniteResponse;

  getAlbumImageFerrisNext(
    request: AlbumImageFerrisNextRequest,
    metadata?: Metadata,
  ): Promise<AlbumImageFerrisNextResponse> | Observable<AlbumImageFerrisNextResponse> | AlbumImageFerrisNextResponse;

  getAlbumImageCountDate(
    request: AlbumImageCountDateRequest,
    metadata?: Metadata,
  ): Promise<AlbumImageCountDateResponse> | Observable<AlbumImageCountDateResponse> | AlbumImageCountDateResponse;

  deleteAlbumImages(
    request: DeleteAlbumImagesRequest,
    metadata?: Metadata,
  ): Promise<DeleteAlbumImagesResponse> | Observable<DeleteAlbumImagesResponse> | DeleteAlbumImagesResponse;

  /** Gallery */

  getAlbumImagesGallerySpot(
    request: AlbumImageGallerySpotRequest,
    metadata?: Metadata,
  ): Promise<AlbumImageGallerySpotResponse> | Observable<AlbumImageGallerySpotResponse> | AlbumImageGallerySpotResponse;
}

export function AlbumServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getAlbumImages",
      "getAlbumImagesCursor",
      "getAlbumImagesInfinite",
      "getAlbumImageFerrisNext",
      "getAlbumImageCountDate",
      "deleteAlbumImages",
      "getAlbumImagesGallerySpot",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AlbumService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AlbumService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ALBUM_SERVICE_NAME = "AlbumService";
