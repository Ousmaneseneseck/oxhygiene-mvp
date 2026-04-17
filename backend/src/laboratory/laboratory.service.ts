import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Laboratory, LabStatus } from './laboratory.entity';
import { LabAnalysis, AnalysisStatus } from './lab-analysis.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LaboratoryService {
  constructor(
    @InjectRepository(Laboratory)
    private labRepository: Repository<Laboratory>,
    @InjectRepository(LabAnalysis)
    private analysisRepository: Repository<LabAnalysis>,
  ) {}

  // ==================== LABORATOIRES ====================
  async getAllLaboratories(city?: string, service?: string): Promise<Laboratory[]> {
    const query = this.labRepository.createQueryBuilder('lab');
    
    if (city) {
      query.andWhere('lab.cities LIKE :city', { city: `%${city}%` });
    }
    if (service) {
      query.andWhere('lab.services LIKE :service', { service: `%${service}%` });
    }
    
    return query.getMany();
  }

  async getLaboratory(id: number): Promise<Laboratory> {
    const lab = await this.labRepository.findOne({ where: { id } });
    if (!lab) throw new NotFoundException('Laboratoire non trouvé');
    return lab;
  }

  async createLaboratory(data: Partial<Laboratory>): Promise<Laboratory> {
    const apiKey = uuidv4();
    const lab = this.labRepository.create({ ...data, apiKey });
    return this.labRepository.save(lab);
  }

  async updateLaboratory(id: number, data: Partial<Laboratory>): Promise<Laboratory> {
    await this.getLaboratory(id);
    await this.labRepository.update(id, data);
    return this.getLaboratory(id);
  }

  // ==================== ANALYSES ====================
  async createAnalysis(
    patientId: number,
    laboratoryId: number,
    analysisType: string,
    prescription: string,
    appointmentDate: Date,
    appointmentTime?: string,
  ): Promise<LabAnalysis> {
    const lab = await this.getLaboratory(laboratoryId);
    
    const analysis = this.analysisRepository.create({
      patientId,
      laboratoryId,
      analysisType,
      prescription,
      appointmentDate,
      appointmentTime,
      status: 'pending',
    });
    
    return this.analysisRepository.save(analysis);
  }

  async getPatientAnalyses(patientId: number): Promise<LabAnalysis[]> {
    return this.analysisRepository.find({
      where: { patientId },
      relations: ['laboratory'],
      order: { createdAt: 'DESC' },
    });
  }

  async getLaboratoryAnalyses(laboratoryId: number): Promise<LabAnalysis[]> {
    return this.analysisRepository.find({
      where: { laboratoryId },
      relations: ['patient'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateAnalysisStatus(id: number, status: AnalysisStatus, results?: string): Promise<LabAnalysis> {
    const analysis = await this.analysisRepository.findOne({ where: { id } });
    if (!analysis) throw new NotFoundException('Analyse non trouvée');
    
    analysis.status = status;
    if (results) {
      analysis.results = results;
      analysis.resultDate = new Date();
    }
    
    return this.analysisRepository.save(analysis);
  }

  async uploadResults(id: number, resultFileUrl: string, results: string): Promise<LabAnalysis> {
    const analysis = await this.analysisRepository.findOne({ where: { id } });
    if (!analysis) throw new NotFoundException('Analyse non trouvée');
    
    analysis.resultFileUrl = resultFileUrl;
    analysis.results = results;
    analysis.resultDate = new Date();
    analysis.status = 'completed';
    
    return this.analysisRepository.save(analysis);
  }

  async getAnalysis(id: number, patientId?: number): Promise<LabAnalysis> {
    const where: any = { id };
    if (patientId) where.patientId = patientId;
    
    const analysis = await this.analysisRepository.findOne({
      where,
      relations: ['laboratory', 'patient'],
    });
    
    if (!analysis) throw new NotFoundException('Analyse non trouvée');
    return analysis;
  }
}