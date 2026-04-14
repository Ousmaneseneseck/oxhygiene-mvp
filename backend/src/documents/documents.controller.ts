import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';

// Définition manuelle du type MulterFile pour éviter l'erreur TypeScript
type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@Controller('documents')
@UseGuards(AuthGuard('jwt'))
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Req() req,
    @UploadedFile() file: MulterFile,
    @Body('appointmentId') appointmentId: number,
    @Body('fileType') fileType: string,
    @Body('description') description: string,
  ) {
    console.log('📄 Fichier reçu:', file?.originalname);
    console.log('📅 AppointmentId:', appointmentId);
    return this.documentsService.uploadDocument(
      req.user.id,
      appointmentId,
      file,
      fileType,
      description,
    );
  }

  @Get()
  async getUserDocuments(@Req() req) {
    return this.documentsService.getUserDocuments(req.user.id);
  }

  @Get('appointment/:id')
  async getAppointmentDocuments(@Req() req, @Param('id') appointmentId: number) {
    return this.documentsService.getAppointmentDocuments(appointmentId, req.user.id);
  }

  @Delete(':id')
  async deleteDocument(@Req() req, @Param('id') id: number) {
    return this.documentsService.deleteDocument(id, req.user.id);
  }
}