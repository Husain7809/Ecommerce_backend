import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Cart } from './entities/cart.entity';


// @UseGuards(AuthGuard('jwt'))
@Controller('cart')
@ApiTags('Cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  create(@Body() createCartDto: CreateCartDto, @Request() req): object {
    return this.cartService.create(createCartDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.cartService.findAll(req.user);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body('qty') qty: number) {
    return this.cartService.update(id, qty);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return this.cartService.remove(id);
  }
}
