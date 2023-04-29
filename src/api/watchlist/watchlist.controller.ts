import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) { }

  @Post('/new')
  create(@Body() createWatchlist: CreateWatchlistDto, @Req() req) {
    createWatchlist.user_id = req.user.id;
    return this.watchlistService.create(createWatchlist);
  }

  @Get('/')
  findAll() {
    return this.watchlistService.findAll();
  }

  // @Delete('/delete')
  // deleteAll() {
  //   return this.watchlistService.deleteAll();
  // }

}
