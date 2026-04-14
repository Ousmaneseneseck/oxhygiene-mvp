import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import * as fs from 'fs';
import * as path from 'path';

// Définition manuelle du type MulterFile pour éviter l'erreur TypeScript
type MulterFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

@Injectable()
export class DocumentsService {
  private uploadDir = './uploads';

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {
    // Créer le dossier uploads s'il n'existe pas
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      console.log('📁 Dossier uploads créé');
    }
  }

  async uploadDocument(
    userId: number,
    appointmentId: number,
    file: MulterFile,
    fileType: string,
    description: string,
  ): Promise<Document> {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, uniqueName);
    fs.writeFileSync(filePath, file.buffer);

    const document = new Document();
    document.userId = userId;
    document.appointmentId = appointmentId;
    document.fileName = uniqueName;
    document.originalName = file.originalname;
    document.fileUrl = `/uploads/${uniqueName}`;
    document.fileType = fileType;
    document.mimeType = file.mimetype;
    document.fileSize = file.size;
    document.description = description;

    return this.documentRepository.save(document);
  }

  async getUserDocuments(userId: number): Promise<Document[]> {
    return this.documentRepository.find({
      where: { userId },
      order: { uploadedAt: 'DESC' },
    });
  }

  async getAppointmentDocuments(appointmentId: number, userId: number): Promise<Document[]> {
    return this.documentRepository.find({
      where: { appointmentId, userId },
      order: { uploadedAt: 'DESC' },
    });
  }

  async getDocument(id: number, userId: number): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id, userId },
    });

    if (!document) {
      throw new NotFoundException('Document non trouvé');
    }

    return document;
  }

  async deleteDocument(id: number, userId: number): Promise<void> {
    const document = await this.getDocument(id, userId);

    const filePath = path.join(this.uploadDir, document.fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.documentRepository.delete(id);
  }
}