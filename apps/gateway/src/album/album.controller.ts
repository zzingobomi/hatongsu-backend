import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AlbumService } from './album.service';
import {
  QueryAlbumImageCursorDto,
  QueryAlbumImageDto,
  QueryAlbumImageFerrisNextDto,
  QueryAlbumImageInfiniteDto,
} from './dto/query-album-image.dto';
import { TokenGuard } from '../auth/guard/token.huard';
import { AlbumImageCountDateDto } from './dto/album-image-count-date.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @UseGuards(TokenGuard)
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

  @Get('ferris-next')
  async getAlbumImageFerrisNext(@Query() query: QueryAlbumImageFerrisNextDto) {
    return this.albumService.getAlbumImageFerrisNext(query);
  }

  @Get('statistic/count-date')
  async getImageCountDate(@Query() query: AlbumImageCountDateDto) {
    return this.albumService.getImageCountDate(query);
  }
}
