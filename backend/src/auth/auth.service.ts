import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(phone: string): Promise<{ message: string }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      user = await this.usersService.createUser(phone);
    }
    
    await this.usersService.saveOtp(phone, otp);
    console.log(`📱 OTP pour ${phone}: ${otp}`);
    
    return { message: 'OTP envoyé avec succès' };
  }

  async verifyOtp(phone: string, otp: string): Promise<{ access_token: string }> {
    // CODE DE TEST - Accepter 000000 pour tous les numéros en test
    const isTestCode = otp === '000000';
    
    let isValid = false;
    
    if (isTestCode) {
      isValid = true;
      console.log(`🔓 CODE TEST utilisé pour ${phone}`);
    } else {
      isValid = await this.usersService.verifyOtp(phone, otp);
    }
    
    if (!isValid) {
      throw new UnauthorizedException('OTP invalide ou expiré');
    }
    
    const user = await this.usersService.findByPhone(phone);
    
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
    
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}