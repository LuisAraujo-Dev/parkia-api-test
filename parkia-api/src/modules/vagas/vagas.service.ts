import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VagaEntity, VagaStatus, VagaTipo } from './entities/vaga.entity';
import { CreateVagaDto } from './dto/create-vaga.dto';

interface ReceitaRaw {
  total: string | null;
}

@Injectable()
export class VagasService {
  constructor(
    @InjectRepository(VagaEntity)
    private readonly repository: Repository<VagaEntity>,
  ) {}

  async create(dto: CreateVagaDto): Promise<VagaEntity> {
    const numeroNormalizado = dto.numero.toUpperCase();

    const vagaExistente = await this.repository.findOne({
      where: { numero: numeroNormalizado },
    });

    if (vagaExistente) {
      throw new BadRequestException(
        `A vaga número ${numeroNormalizado} já existe.`,
      );
    }

    const novaVaga = this.repository.create({
      ...dto,
      numero: numeroNormalizado,
      status: VagaStatus.LIVRE,
    });

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

    query.orderBy('vaga.numero', 'ASC');
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

    if (dto.numero) {
      vaga.numero = dto.numero.toUpperCase();
    }

    if (dto.tipo) {
      vaga.tipo = dto.tipo;
    }

    return await this.repository.save(vaga);
  }

  async remove(id: string): Promise<void> {
    const vaga = await this.findOne(id);

    if (vaga.status !== VagaStatus.LIVRE) {
      throw new BadRequestException(
        'Regra de Negócio: Não é possível excluir uma vaga que não esteja livre.',
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

    const inicioDoDia = new Date();
    inicioDoDia.setHours(0, 0, 0, 0);

    const resultadoReceita = await this.repository.manager
      .createQueryBuilder()
      .select('SUM(valor_pago)', 'total')
      .from('movimentacoes', 'm')
      .where('m.saida >= :inicioDoDia', { inicioDoDia })
      .getRawOne<ReceitaRaw>();

    const receitaTotal = resultadoReceita?.total
      ? parseFloat(resultadoReceita.total)
      : 0;

    return {
      total,
      ocupadas,
      livres,
      receitaDia: Number(receitaTotal.toFixed(2)),
      percentualOcupacao:
        total > 0 ? Number(((ocupadas / total) * 100).toFixed(2)) : 0,
    };
  }
}
