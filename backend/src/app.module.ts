import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { SlotsModule } from './slots/slots.module';
import { DocumentsModule } from './documents/documents.module';
import { HealthModule } from './health/health.module';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    AppointmentsModule,
    SlotsModule,
    DocumentsModule,
    HealthModule,
    LaboratoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}