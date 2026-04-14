import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from './slot.entity';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,
  ) {}

  async getAvailableSlots(doctorId: number, date: string) {
    return this.slotRepository.find({
      where: { doctorId, date, status: 'available' },
    });
  }
}