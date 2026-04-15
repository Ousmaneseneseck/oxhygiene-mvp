import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { HealthService } from './health.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('health')
@UseGuards(AuthGuard('jwt'))
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Post('measure')
  async addMeasure(@Req() req, @Body() body) {
    return this.healthService.addMeasure(req.user.id, body.type, body);
  }

  @Get('measures')
  async getUserMeasures(@Req() req, @Query('type') type: string, @Query('days') days: number) {
    return this.healthService.getUserMeasures(req.user.id, type as any, days || 30);
  }

  @Get('stats')
  async getStats(@Req() req, @Query('type') type: string) {
    return this.healthService.getStats(req.user.id, type as any);
  }

  @Get('latest')
  async getLatest(@Req() req, @Query('type') type: string) {
    return this.healthService.getLatestMeasure(req.user.id, type as any);
  }
}