import { Controller, Get, Query } from '@nestjs/common';
import { AlbumService } from './album.service';
import {
  QueryAlbumImageCursorDto,
  QueryAlbumImageDto,
  QueryAlbumImageInfiniteDto,
} from './dto/query-album-image.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async getAlbumImages(@Query() query: QueryAlbumImageDto) {
    return this.albumService.getAlbumImages(query);
  }

  @Get('cursor')
  async getAlbumImagesCursor(@Query() query: QueryAlbumImageCursorDto) {
    return this.albumService.getAlbumImagesCursor(query);
  }

  @Get('infinite')
  async getAlbumImagesInfinite(@Query() query: QueryAlbumImageInfiniteDto) {
    return this.albumService.getAlbumImagesInfinite(query);
  }
}
