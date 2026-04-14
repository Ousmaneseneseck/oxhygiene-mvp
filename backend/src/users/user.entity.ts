import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  phone: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'varchar', default: 'patient' })
  role: string;

  @Column({ nullable: true, type: 'varchar' })
  otpCode: string | null;  // ✅ Permettre null

  @Column({ nullable: true, type: 'datetime' })
  otpExpires: Date | null;  // ✅ Permettre null

  @CreateDateColumn()
  createdAt: Date;
}