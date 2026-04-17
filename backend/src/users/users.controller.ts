import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUsers(@Query('role') role?: string) {
    if (role) {
      return this.usersService.findByRole(role);
    }
    return [];
  }

  @Post('role')
  @UseGuards(AuthGuard('jwt'))
  async updateRole(@Body('role') role: string, @Req() req: any) {
    const userId = req.user.id;
    await this.usersService.updateRole(userId, role);
    return { message: `Rôle mis à jour en tant que ${role}`, userId };
  }

  @Post('fix-doctor-role')
  @UseGuards(AuthGuard('jwt'))
  async fixDoctorRole(@Req() req: any) {
    await this.usersService.updateRole(2, 'doctor');
    return { 
      message: '✅ Rôle médecin corrigé pour ID 2',
      userId: 2,
      newRole: 'doctor'
    };
  }

  @Post('clean-duplicates')
  @UseGuards(AuthGuard('jwt'))
  async cleanDuplicates() {
    await this.usersService.cleanDuplicateDoctors();
    return { message: 'Doublons nettoyés, rôle médecin corrigé' };
  }

  @Post('force-doctor')
  @UseGuards(AuthGuard('jwt'))
  async forceDoctorRole(@Req() req: any) {
    // Chercher l'utilisateur par téléphone
    const user = await this.usersService.findByPhone('+221789999999');
    if (!user) {
      return { message: 'Utilisateur non trouvé' };
    }
    await this.usersService.updateRole(user.id, 'doctor');
    return { message: 'Rôle médecin forcé', userId: user.id, newRole: 'doctor' };
  }
}