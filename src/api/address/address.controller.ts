import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Address')
@UseGuards(AuthGuard('jwt'))
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post('/new')
  create(@Body() createAddress, @Request() req) {
    createAddress.user_id = req.user.id;
    return this.addressService.create(createAddress);
  }

  @Get('/')
  findAll(@Request() req) {
    return this.addressService.findAll(req.user.id);
  }


  @Patch('edit/:id')
  update(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() updateAddress) {
    updateAddress.user_id = req.user.id;
    return this.addressService.update(id, updateAddress);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Address | object> {
    return this.addressService.remove(id);
  }
}
