import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { Order } from './entities/order.entity';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/helpers/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(AuthGuard('jwt'))
@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('/new')
  create(@Body() createOrder: CreateOrderDto, @Request() req): Promise<any> {
    createOrder.user_id = req.user.id;
    return this.orderService.create(createOrder);
  }

  @Get('/')
  findAll(@Request() req): Promise<object | Order[]> {
    return this.orderService.findAll(req.user.id);
  }


  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrder: UpdateOrderDto): Promise<object | Order[]> {
    return this.orderService.update(id, updateOrder);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}
