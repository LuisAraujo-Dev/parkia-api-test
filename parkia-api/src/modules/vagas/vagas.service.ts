import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VagaEntity, VagaStatus, VagaTipo } from './entities/vaga.entity';
import { CreateVagaDto } from './dto/create-vaga.dto';

@Injectable()
export class VagasService {
  constructor(
    @InjectRepository(VagaEntity)
    private readonly repository: Repository<VagaEntity>,
  ) {}

  async create(dto: CreateVagaDto): Promise<VagaEntity> {
    const vagaExistente = await this.repository.findOne({
      where: { numero: dto.numero },
    });

    if (vagaExistente) {
      throw new BadRequestException('Já existe uma vaga com este número.');
    }

    const novaVaga = this.repository.create(dto);
    return await this.repository.save(novaVaga);
  }

  async findAll(status?: VagaStatus, tipo?: VagaTipo): Promise<VagaEntity[]> {
    const query = this.repository.createQueryBuilder('vaga');

    if (status) {
      query.andWhere('vaga.status = :status', { status });
    }

    if (tipo) {
      query.andWhere('vaga.tipo = :tipo', { tipo });
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<VagaEntity> {
    const vaga = await this.repository.findOne({ where: { id } });
    if (!vaga) {
      throw new NotFoundException(`Vaga com ID ${id} não encontrada.`);
    }
    return vaga;
  }

  async update(id: string, dto: Partial<CreateVagaDto>): Promise<VagaEntity> {
    const vaga = await this.findOne(id);
    Object.assign(vaga, dto);
    return await this.repository.save(vaga);
  }

  async remove(id: string): Promise<void> {
    const vaga = await this.findOne(id);

    // REGRA DE NEGÓCIO: Só pode excluir se estiver livre
    if (vaga.status !== VagaStatus.LIVRE) {
      throw new BadRequestException(
        'Não é possível excluir uma vaga que não esteja livre.',
      );
    }

    await this.repository.remove(vaga);
  }

  async getStats() {
    const total = await this.repository.count();
    const ocupadas = await this.repository.count({
      where: { status: VagaStatus.OCUPADA },
    });
    const livres = await this.repository.count({
      where: { status: VagaStatus.LIVRE },
    });

    const percentualOcupacao = total > 0 ? (ocupadas / total) * 100 : 0;

    return {
      total,
      ocupadas,
      livres,
      percentualOcupacao: Number(percentualOcupacao.toFixed(2)),
    };
  }
}
