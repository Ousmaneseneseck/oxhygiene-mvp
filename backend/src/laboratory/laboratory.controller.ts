import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('laboratory')
export class LaboratoryController {
  constructor(private laboratoryService: LaboratoryService) {}

  // ==================== LABORATOIRES ====================
  @Get('labs')
  @UseGuards(AuthGuard('jwt'))
  async getAllLaboratories(@Query('city') city?: string, @Query('service') service?: string) {
    return this.laboratoryService.getAllLaboratories(city, service);
  }

  @Get('labs/:id')
  @UseGuards(AuthGuard('jwt'))
  async getLaboratory(@Param('id') id: number) {
    return this.laboratoryService.getLaboratory(id);
  }

  @Post('labs')
  @UseGuards(AuthGuard('jwt'))
  async createLaboratory(@Body() body: any) {
    return this.laboratoryService.createLaboratory(body);
  }

  // ==================== ANALYSES ====================
  @Post('analyses')
  @UseGuards(AuthGuard('jwt'))
  async createAnalysis(@Req() req, @Body() body: any) {
    return this.laboratoryService.createAnalysis(
      req.user.id,
      body.laboratoryId,
      body.analysisType,
      body.prescription,
      new Date(body.appointmentDate),
      body.appointmentTime,
    );
  }

  @Get('analyses/my')
  @UseGuards(AuthGuard('jwt'))
  async getMyAnalyses(@Req() req) {
    return this.laboratoryService.getPatientAnalyses(req.user.id);
  }

  @Get('analyses/lab/:id')
  @UseGuards(AuthGuard('jwt'))
  async getLabAnalyses(@Param('id') id: number) {
    return this.laboratoryService.getLaboratoryAnalyses(id);
  }

  @Put('analyses/:id/status')
  @UseGuards(AuthGuard('jwt'))
  async updateStatus(@Param('id') id: number, @Body('status') status: string, @Body('results') results?: string) {
    return this.laboratoryService.updateAnalysisStatus(id, status as any, results);
  }

  @Get('analyses/:id')
  @UseGuards(AuthGuard('jwt'))
  async getAnalysis(@Param('id') id: number, @Req() req) {
    return this.laboratoryService.getAnalysis(id, req.user.id);
  }
}