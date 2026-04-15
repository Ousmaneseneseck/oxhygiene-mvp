import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export type MeasureType = 'tension' | 'glycemie' | 'oxygenation' | 'poids' | 'temperature' | 'cardiaque';

@Entity('health_measures')
export class HealthMeasure {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'varchar' })
  type: MeasureType;

  @Column({ type: 'float', nullable: true })
  value: number;

  @Column({ nullable: true })
  systolic: number;

  @Column({ nullable: true })
  diastolic: number;

  @Column({ nullable: true })
  unit: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  measuredAt: Date;
}