import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {

  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>
  ) { }

  // create address
  async create(createAddress: CreateAddressDto): Promise<Address | object> {
    try {
      const result = await this.addressRepository.save(createAddress);
      return { msg: result }
    } catch (e) {
      return e.mesaage;
    }
  }

  // show all address
  async findAll(id: number): Promise<Address | object> {
    try {
      const result = await this.addressRepository.find({ where: { user_id: id } });
      return { msg: result }
    } catch (e) {
      return e.mesaage;
    }
  }

  //update address 
  async update(id: number, updateAddress: UpdateAddressDto) {
    try {
      const address = await this.addressRepository.findOne({ where: { id } });
      if (!address) {
        return { msg: "Not found" }
      }
      await this.addressRepository.update(id, updateAddress);
      return { msg: "Updated successFully." }
    } catch (e) {
      return e.mesaage;
    }
  }


  // delete address 
  async remove(id: number): Promise<Address | object> {
    try {
      const address = await this.addressRepository.findOne({ where: { id } });
      if (!address) {
        return { msg: "Not found" }
      }
      await this.addressRepository.delete({ id });
      return { msg: "Deleted successFully." }
    } catch (e) {
      return e.mesaage;
    }
  }
}
