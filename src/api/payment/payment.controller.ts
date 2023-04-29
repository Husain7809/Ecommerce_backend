import { Controller, Get, Post, Body, Patch, Param, Delete, Response, Render, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('/checkout')
  create(@Body() createPayment: CreatePaymentDto): Promise<object> {
    return this.paymentService.create(createPayment);
  }
}
