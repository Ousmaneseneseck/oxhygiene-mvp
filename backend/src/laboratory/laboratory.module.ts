import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaboratoryService } from './laboratory.service';
import { LaboratoryController } from './laboratory.controller';
import { Laboratory } from './laboratory.entity';
import { LabAnalysis } from './lab-analysis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Laboratory, LabAnalysis])],
  controllers: [LaboratoryController],
  providers: [LaboratoryService],
  exports: [LaboratoryService],
})
export class LaboratoryModule {}