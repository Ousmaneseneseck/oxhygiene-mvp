import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @Column()
  doctorId: number;

  @Column()
  date: string;

  @Column()
  timeSlot: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: AppointmentStatus;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  symptoms: string;

  @Column({ nullable: true, type: 'text' })
  doctorNotes: string;

  @Column({ nullable: true, type: 'text' })
  prescription: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}