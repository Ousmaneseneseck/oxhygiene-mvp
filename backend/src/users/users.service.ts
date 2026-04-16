import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByRole(role: string): Promise<User[]> {
    return this.usersRepository.find({ where: { role } });
  }

  async createUser(phone: string, role: string = 'patient'): Promise<User> {
    const user = this.usersRepository.create({ phone, role });
    return this.usersRepository.save(user);
  }

  async updateRole(userId: number, role: string): Promise<void> {
    await this.usersRepository.update({ id: userId }, { role });
  }

  async cleanDuplicateDoctors(): Promise<void> {
    // Supprimer les doublons du médecin (+221789999999)
    const users = await this.usersRepository.find({ where: { phone: '+221789999999' } });
    
    if (users.length > 1) {
      // Garder le premier, supprimer les autres
      const toKeep = users[0];
      const toDelete = users.slice(1);
      for (const user of toDelete) {
        await this.usersRepository.delete(user.id);
      }
    }
    
    // Mettre à jour le rôle restant en 'doctor'
    await this.usersRepository.update({ phone: '+221789999999' }, { role: 'doctor' });
  }

  async saveOtp(phone: string, otp: string): Promise<void> {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    
    await this.usersRepository.update(
      { phone },
      { otpCode: otp, otpExpires: expires }
    );
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const user = await this.findByPhone(phone);
    if (!user || !user.otpCode || !user.otpExpires) return false;
    
    const isValid = user.otpCode === otp && new Date() < user.otpExpires;
    
    if (isValid) {
      await this.usersRepository.update(
        { phone },
        { otpCode: null, otpExpires: null }
      );
    }
    
    return isValid;
  }
}