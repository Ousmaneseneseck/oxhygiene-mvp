import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('slots')
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  doctorId: number;

  @Column()
  date: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ default: 'available' })
  status: string;

  @Column({ nullable: true })
  appointmentId: number;
}