import { Module, forwardRef } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Watchlist]),
    forwardRef(() => ProductModule)
  ],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule { }
