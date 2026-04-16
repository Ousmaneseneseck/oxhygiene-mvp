import { Controller, Post, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { Appointment } from './appointments/appointment.entity';
import { HealthMeasure } from './health/health.entity';
import { User } from './users/user.entity';

@Controller('import-full-data')
@UseGuards(AuthGuard('jwt'))
export class ImportFullDataController {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(HealthMeasure)
    private measureRepo: Repository<HealthMeasure>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  @Post()
  async importFullData() {
    console.log('📦 Import des données...');
    
    // 1. Vérifier/créer les utilisateurs
    let patient = await this.userRepo.findOne({ where: { phone: '+221771234567' } });
    if (!patient) {
      patient = await this.userRepo.save({ phone: '+221771234567', role: 'patient' });
      console.log('✅ Patient créé');
    }
    
    let doctor = await this.userRepo.findOne({ where: { phone: '+221789999999' } });
    if (!doctor) {
      doctor = await this.userRepo.save({ phone: '+221789999999', role: 'doctor' });
      console.log('✅ Médecin créé');
    }
    
    // 2. Importer les rendez-vous (avec create + save)
    const appointmentsData = [
      { patientId: patient.id, doctorId: doctor.id, date: '2026-04-20', timeSlot: '10:00-11:00', status: 'pending', reason: 'Consultation générale', symptoms: 'Fatigue' },
      { patientId: patient.id, doctorId: doctor.id, date: '2026-04-21', timeSlot: '11:00-12:00', status: 'confirmed', reason: 'Suivi du traitement', symptoms: 'Amélioration' },
      { patientId: patient.id, doctorId: doctor.id, date: '2026-04-27', timeSlot: '09:00-10:00', status: 'cancelled', reason: 'Consultation générale', symptoms: '' },
      { patientId: patient.id, doctorId: doctor.id, date: '2026-05-04', timeSlot: '10:00-11:00', status: 'cancelled', reason: 'Consultation', symptoms: '' },
    ];
    
    for (const aptData of appointmentsData) {
      const existing = await this.appointmentRepo.findOne({ where: { date: aptData.date, timeSlot: aptData.timeSlot } });
      if (!existing) {
        const appointment = this.appointmentRepo.create(aptData);
        await this.appointmentRepo.save(appointment);
      }
    }
    console.log(`✅ ${appointmentsData.length} rendez-vous importés`);
    
    // 3. Importer les mesures santé
    const measuresData = [
      { userId: patient.id, type: 'tension', systolic: 118, diastolic: 76, unit: 'mmHg', notes: 'À jeun', measuredAt: new Date('2026-04-15 08:15:00') },
      { userId: patient.id, type: 'glycemie', value: 0.92, unit: 'mg/dL', notes: 'À jeun', measuredAt: new Date('2026-04-15 07:30:00') },
      { userId: patient.id, type: 'oxygenation', value: 98, unit: '%', notes: 'Repos', measuredAt: new Date('2026-04-15 08:00:00') },
      { userId: patient.id, type: 'poids', value: 71.2, unit: 'kg', notes: 'À jeun', measuredAt: new Date('2026-04-15 07:30:00') },
      { userId: patient.id, type: 'temperature', value: 36.6, unit: '°C', notes: 'Normal', measuredAt: new Date('2026-04-15 08:00:00') },
      { userId: patient.id, type: 'cardiaque', value: 68, unit: 'bpm', notes: 'Repos', measuredAt: new Date('2026-04-15 08:00:00') },
    ];
    
    for (const measureData of measuresData) {
      const existing = await this.measureRepo.findOne({ where: { userId: patient.id, type: measureData.type as any, measuredAt: measureData.measuredAt } });
      if (!existing) {
        const measure = this.measureRepo.create(measureData);
        await this.measureRepo.save(measure);
      }
    }
    console.log(`✅ ${measuresData.length} mesures importées`);
    
    return { 
      message: 'Import terminé', 
      appointments: appointmentsData.length, 
      measures: measuresData.length,
      patientId: patient.id,
      doctorId: doctor.id
    };
  }
}