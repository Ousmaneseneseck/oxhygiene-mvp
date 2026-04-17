import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Laboratory } from './laboratory.entity';
import { User } from '../users/user.entity';

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type SampleType = 'blood' | 'urine' | 'stool' | 'saliva' | 'other';

@Entity('lab_analyses')
export class LabAnalysis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column()
  laboratoryId: number;

  @ManyToOne(() => Laboratory)
  @JoinColumn({ name: 'laboratoryId' })
  laboratory: Laboratory;

  @Column()
  analysisType: string; // 'blood_test', 'urinalysis', 'biopsy', etc.

  @Column({ type: 'text', nullable: true })
  prescription: string; // Ordonnance du médecin

  @Column({ type: 'date' })
  appointmentDate: Date;

  @Column({ nullable: true })
  appointmentTime: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: AnalysisStatus;

  @Column({ nullable: true })
  sampleType: SampleType;

  @Column({ type: 'text', nullable: true })
  results: string; // Résultats JSON ou texte

  @Column({ nullable: true })
  resultFileUrl: string;

  @Column({ nullable: true })
  resultDate: Date;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  qrCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}