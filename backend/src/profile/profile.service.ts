import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async createOrUpdateProfile(userId: number, data: Partial<Profile>): Promise<Profile> {
    let profile = await this.profileRepository.findOne({ where: { userId } });
    
    if (profile) {
      // Update existing
      Object.assign(profile, data);
      return this.profileRepository.save(profile);
    } else {
      // Create new
      const newProfile = this.profileRepository.create({ userId, ...data });
      return this.profileRepository.save(newProfile);
    }
  }

  async getProfile(userId: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({ 
      where: { userId },
      relations: ['user']
    });
    
    if (!profile) {
      throw new NotFoundException('Profil non trouvé');
    }
    
    return profile;
  }

  async updateProfile(userId: number, data: Partial<Profile>): Promise<Profile> {
    const profile = await this.getProfile(userId);
    Object.assign(profile, data);
    return this.profileRepository.save(profile);
  }
}