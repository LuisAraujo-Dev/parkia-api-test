import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TarifaEntity } from './entities/tarifa.entity';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';

@Injectable()
export class TarifasService {
  constructor(
    @InjectRepository(TarifaEntity)
    private readonly repository: Repository<TarifaEntity>,
  ) {}

  findAll(): Promise<TarifaEntity[]> {
    return this.repository.find();
  }

  async update(id: string, dto: UpdateTarifaDto): Promise<TarifaEntity> {
    const tarifa = await this.repository.findOne({ where: { id } });
    if (!tarifa) {
      throw new NotFoundException('Tarifa não encontrada.');
    }

    Object.assign(tarifa, dto);
    return await this.repository.save(tarifa);
  }
}
