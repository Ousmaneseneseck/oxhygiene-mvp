import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get()
  async getUserAppointments(@Req() req) {
    return this.appointmentsService.getUserAppointments(req.user.id, req.user.role);
  }

  @Get('stats')
  async getStats(@Req() req) {
    return this.appointmentsService.getStats(req.user.id, req.user.role);
  }

  @Post()
  async createAppointment(@Req() req, @Body() body) {
    return this.appointmentsService.createAppointment(
      req.user.id,
      body.doctorId,
      body.date,
      body.timeSlot,
      body.reason,
      body.symptoms,
    );
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: number, @Body('status') status: string, @Req() req) {
    const validStatus = status as 'pending' | 'confirmed' | 'cancelled' | 'completed';
    return this.appointmentsService.updateAppointmentStatus(
      id,
      validStatus,
      req.user.id,
      req.user.role,
    );
  }

  @Put(':id/notes')
  async addNotes(@Param('id') id: number, @Body('notes') notes: string, @Body('prescription') prescription: string, @Req() req: any) {
    return this.appointmentsService.addNotes(id, req.user.id, notes, prescription);
  }
}