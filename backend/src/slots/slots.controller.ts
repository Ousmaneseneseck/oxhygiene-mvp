import { Controller, Get, Query } from '@nestjs/common';
import { SlotsService } from './slots.service';

@Controller('slots')
export class SlotsController {
  constructor(private slotsService: SlotsService) {}

  @Get('available')
  getAvailableSlots(@Query('doctorId') doctorId: number, @Query('date') date: string) {
    return this.slotsService.getAvailableSlots(doctorId, date);
  }
}