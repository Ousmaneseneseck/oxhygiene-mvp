import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Laboratory } from '../laboratory/laboratory.entity';
import { LabAnalysis } from '../laboratory/lab-analysis.entity';
import { User } from '../users/user.entity';
import { Profile } from '../profile/profile.entity';
import { Appointment } from '../appointments/appointment.entity';
import { Document } from '../documents/document.entity';
import { HealthMeasure } from '../health/health.entity';
import { Slot } from '../slots/slot.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DATABASE_URL', 'oxhygiene.db'),
        entities: [
          User,
          Profile,
          Appointment,
          Document,
          HealthMeasure,
          Slot,
          Laboratory,
          LabAnalysis,
        ],
        synchronize: true,
        dropSchema: true, // ⚠️ Supprime et recrée toutes les tables
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}