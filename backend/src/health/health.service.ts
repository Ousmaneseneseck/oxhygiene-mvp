import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { HealthMeasure, MeasureType } from './health.entity';

@Injectable()
export class HealthService {
  constructor(
    @InjectRepository(HealthMeasure)
    private measureRepository: Repository<HealthMeasure>,
  ) {}

  async addMeasure(
    userId: number,
    type: MeasureType,
    data: any,
  ): Promise<HealthMeasure> {
    const measure = this.measureRepository.create({
      userId,
      type,
      systolic: data.systolic,
      diastolic: data.diastolic,
      value: data.value,
      unit: data.unit,
      notes: data.notes,
    });
    return await this.measureRepository.save(measure);
  }

  async getUserMeasures(userId: number, type?: MeasureType, days: number = 30) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const where: any = { userId, measuredAt: Between(dateLimit, new Date()) };
    if (type) where.type = type;

    return await this.measureRepository.find({
      where,
      order: { measuredAt: 'DESC' },
    });
  }

  async getLatestMeasure(userId: number, type: MeasureType) {
    return await this.measureRepository.findOne({
      where: { userId, type },
      order: { measuredAt: 'DESC' },
    });
  }

  async getStats(userId: number, type: MeasureType) {
    const measures = await this.getUserMeasures(userId, type, 90);
    
    if (measures.length === 0) return null;

    // Pour la tension, c'est un objet
    if (type === 'tension') {
      const systolicValues = measures.map(m => m.systolic).filter(v => v);
      const diastolicValues = measures.map(m => m.diastolic).filter(v => v);
      
      if (systolicValues.length === 0) return null;
      
      const avgSystolic = systolicValues.reduce((a, b) => a + b, 0) / systolicValues.length;
      const avgDiastolic = diastolicValues.reduce((a, b) => a + b, 0) / diastolicValues.length;
      
      return {
        count: measures.length,
        average: `${Math.round(avgSystolic)}/${Math.round(avgDiastolic)}`,
        minSystolic: Math.min(...systolicValues),
        maxSystolic: Math.max(...systolicValues),
        minDiastolic: Math.min(...diastolicValues),
        maxDiastolic: Math.max(...diastolicValues),
        lastValue: {
          systolic: measures[0]?.systolic,
          diastolic: measures[0]?.diastolic,
        },
        lastDate: measures[0]?.measuredAt,
      };
    }
    
    // Pour les autres types
    const values = measures.map(m => m.value).filter(v => v !== undefined && v !== null);
    if (values.length === 0) return null;
    
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    return {
      count: measures.length,
      average: Math.round(avg * 10) / 10,
      min: Math.min(...values),
      max: Math.max(...values),
      lastValue: measures[0]?.value,
      lastDate: measures[0]?.measuredAt,
    };
  }
}