import { Controller, Get, Query } from '@nestjs/common';
import { AlbumService } from './album.service';
import {
  QueryAlbumImageCursorDto,
  QueryAlbumImageDto,
} from './dto/query-album-image.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  async getAlbumImages(@Query() query: QueryAlbumImageDto) {
    return this.albumService.getAlbumImages(query);
  }

  @Get('infinite')
  async getAlbumImagesCursor(@Query() query: QueryAlbumImageCursorDto) {
    return this.albumService.getAlbumImagesCursor(query);
  }
}
