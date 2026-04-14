import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async getUserAppointments(userId: number, role: string) {
    const where = role === 'patient' 
      ? { patientId: userId }
      : { doctorId: userId };
    const appointments = await this.appointmentRepository.find({ where });
    return { value: appointments, Count: appointments.length };
  }

  async getStats(userId: number, role: string) {
    const where = role === 'patient' 
      ? { patientId: userId }
      : { doctorId: userId };
    
    const allAppointments = await this.appointmentRepository.find({ where });
    
    const total = allAppointments.length;
    const pending = allAppointments.filter(a => a.status === 'pending').length;
    const confirmed = allAppointments.filter(a => a.status === 'confirmed').length;
    const cancelled = allAppointments.filter(a => a.status === 'cancelled').length;
    const completed = allAppointments.filter(a => a.status === 'completed').length;
    
    return { total, pending, confirmed, cancelled, completed };
  }

  async createAppointment(
    patientId: number,
    doctorId: number,
    date: string,
    timeSlot: string,
    reason: string,
    symptoms: string,
  ): Promise<Appointment> {
    const appointment = this.appointmentRepository.create({
      patientId,
      doctorId,
      date,
      timeSlot,
      reason,
      symptoms,
      status: 'pending',
    });
    return this.appointmentRepository.save(appointment);
  }

  async getAppointment(id: number, userId: number, role: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Rendez-vous non trouvé');
    }

    // Vérifier l'accès
    if (role === 'patient' && appointment.patientId !== userId) {
      throw new NotFoundException('Rendez-vous non trouvé');
    }
    if (role === 'doctor' && appointment.doctorId !== userId) {
      throw new NotFoundException('Rendez-vous non trouvé');
    }

    return appointment;
  }

  async updateAppointmentStatus(
    id: number,
    status: AppointmentStatus,
    userId: number,
    role: string,
  ): Promise<Appointment> {
    const appointment = await this.getAppointment(id, userId, role);
    
    // Seul le médecin peut confirmer/terminer/annuler
    if (role === 'doctor') {
      appointment.status = status;
    } else if (role === 'patient' && status === 'cancelled') {
      appointment.status = status;
    } else {
      throw new BadRequestException('Action non autorisée');
    }

    return this.appointmentRepository.save(appointment);
  }

  async addNotes(
    appointmentId: number,
    doctorId: number,
    notes: string,
    prescription: string,
  ): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({ 
      where: { id: appointmentId, doctorId } 
    });
    
    if (!appointment) {
      throw new NotFoundException('Rendez-vous non trouvé ou vous n\'êtes pas le médecin assigné');
    }
    
    appointment.doctorNotes = notes;
    appointment.prescription = prescription;
    
    return this.appointmentRepository.save(appointment);
  }
}