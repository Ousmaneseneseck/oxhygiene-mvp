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
}