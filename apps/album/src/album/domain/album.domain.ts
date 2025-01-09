export class AlbumDomain {
  id: string;
  path: string;
  dateTime: Date; // 찍힌 시간
  userId: string; // 등록 유저

  constructor(param: { path: string; dateTime: Date; userId: string }) {
    this.path = param.path;
    this.dateTime = param.dateTime;
    this.userId = param.userId;
  }

  assignId(id: string) {
    this.id = id;
  }
}
