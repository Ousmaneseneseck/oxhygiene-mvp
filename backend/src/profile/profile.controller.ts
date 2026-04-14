import { Controller, Get, Post, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async getProfile(@Req() req) {
    return this.profileService.getProfile(req.user.id);
  }

  @Post()
  async createProfile(@Req() req, @Body() data) {
    return this.profileService.createOrUpdateProfile(req.user.id, data);
  }

  @Put()
  async updateProfile(@Req() req, @Body() data) {
    return this.profileService.updateProfile(req.user.id, data);
  }
}