import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type LabStatus = 'active' | 'inactive' | 'pending';

@Entity('laboratories')
export class Laboratory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'simple-array', nullable: true })
  services: string[]; // Analyses disponibles

  @Column({ type: 'simple-array', nullable: true })
  cities: string[]; // Villes de couverture

  @Column({ type: 'varchar', default: 'pending' })
  status: LabStatus;

  @Column({ nullable: true })
  apiKey: string; // Clé API pour le partenaire

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  orderCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}