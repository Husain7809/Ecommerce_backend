import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';

@Injectable()
export class WatchlistService {

  constructor(
    @InjectRepository(Watchlist)
    private readonly watchlsitRepositiory: Repository<Watchlist>,
    private readonly productServices: ProductService
  ) { }

  async create(createWatchlist: CreateWatchlistDto) {
    try {

      const { product_id, user_id } = createWatchlist;
      const product = await this.productServices.getProduct(product_id);
      if (!product) {
        throw new NotFoundException("No record found");
      }

      const isExits = await this.watchlsitRepositiory.findOne({
        where: {
          product_id: {
            id: product_id
          },
          user_id: {
            id: user_id
          }
        }
      })

      if (!isExits) {
        const watchlist_product = await this.watchlsitRepositiory.save({
          product_id: {
            id: product_id
          },
          user_id: {
            id: user_id
          }
        });
        return watchlist_product;
      }

      // return "already watched";

    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findAll() {
    try {
      const watchlist = await this.watchlsitRepositiory.createQueryBuilder('watchlist').
        innerJoinAndSelect('watchlist.product_id', 'product').
        getMany();
      if (!watchlist) {
        throw new NotFoundException("No record found");
      }
      return watchlist;

    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async findOne(id: number) {
    try {
      const watchlist = await this.watchlsitRepositiory.find();
      if (!watchlist) {
        throw new NotFoundException("No record found");
      }
      return watchlist;

    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  // async deleteAll() {
  //   try {
  //     const watchlist = await this.watchlsitRepositiory.delete();
  //     if (!watchlist) {
  //       throw new NotFoundException("No record found");
  //     }
  //     return watchlist;
  //   } catch (e) {
  //     throw new InternalServerErrorException(e.message);
  //   }
  // }
}
