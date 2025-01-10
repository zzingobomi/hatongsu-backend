export class AlbumImageDomain {
  id: string;
  path: string;
  dateTime: Date; // 찍힌 시간
  originFileName?: string;

  constructor(param: { dateTime: Date; originFileName?: string }) {
    this.dateTime = param.dateTime;
    this.originFileName = param.originFileName;
  }

  assignId(id: string) {
    this.id = id;
  }

  setPath(path: string) {
    this.path = path;
  }
}
