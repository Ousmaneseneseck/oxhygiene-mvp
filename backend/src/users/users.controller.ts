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
    // Utiliser l'ID de l'utilisateur authentifié
    const userId = req.user.id;
    await this.usersService.updateRole(userId, role);
    return { message: `Rôle mis à jour en tant que ${role}`, userId };
  }

  @Post('fix-doctor-role')
  @UseGuards(AuthGuard('jwt'))
  async fixDoctorRole(@Req() req: any) {
    // Forcer le rôle 'doctor' pour l'utilisateur ID 2 (médecin)
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
    // Supprimer les doublons du médecin
    await this.usersService.cleanDuplicateDoctors();
    return { message: 'Doublons nettoyés, rôle médecin corrigé' };
  }
}