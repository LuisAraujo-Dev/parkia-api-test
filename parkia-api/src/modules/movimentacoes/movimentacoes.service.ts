import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Between } from 'typeorm';
import { MovimentacaoEntity } from './entities/movimentacao.entity';
import { VagasService } from '../vagas/vagas.service';
import { TarifasService } from '../tarifas/tarifas.service';
import { EntradaVeiculoDto } from './dto/entrada-veiculo.dto';
import { VagaStatus, VagaTipo } from '../vagas/entities/vaga.entity';

@Injectable()
export class MovimentacoesService {
  constructor(
    @InjectRepository(MovimentacaoEntity)
    private readonly repository: Repository<MovimentacaoEntity>,
    private readonly vagasService: VagasService,
    private readonly tarifasService: TarifasService,
  ) {}

  async registrarEntrada(dto: EntradaVeiculoDto): Promise<MovimentacaoEntity> {
    const vaga = await this.vagasService.findOne(dto.vaga_id);

    if (vaga.status === VagaStatus.MANUTENCAO) {
      throw new BadRequestException('Vaga em manutenção não pode ser ocupada.');
    }

    if (vaga.status === VagaStatus.OCUPADA) {
      throw new BadRequestException('Esta vaga já está ocupada.');
    }

    if (dto.tipo_veiculo === VagaTipo.CARRO && vaga.tipo === VagaTipo.MOTO) {
      throw new BadRequestException('Carros não podem ocupar vagas de moto.');
    }

    const novaMovimentacao = this.repository.create({
      ...dto,
      placa: dto.placa.replace('-', '').toUpperCase(),
    });

    await this.vagasService.update(vaga.id, { status: VagaStatus.OCUPADA });

    return await this.repository.save(novaMovimentacao);
  }

  async registrarSaida(placa: string): Promise<MovimentacaoEntity> {
    const placaNormalizada = placa.replace('-', '').toUpperCase();

    const movimentacao = await this.repository.findOne({
      where: { placa: placaNormalizada, saida: IsNull() },
      relations: ['vaga'],
    });

    if (!movimentacao) {
      throw new NotFoundException('Veículo não encontrado ou já saiu.');
    }

    const agora = new Date();
    movimentacao.saida = agora;

    const tarifas = await this.tarifasService.findAll();
    const tarifa = tarifas.find(
      (t) => t.tipo_veiculo === movimentacao.tipo_veiculo,
    );

    if (!tarifa) {
      throw new BadRequestException(
        'Tarifa não configurada para este tipo de veículo.',
      );
    }

    const diffMs = agora.getTime() - movimentacao.entrada.getTime();
    const diffMinutos = Math.floor(diffMs / (1000 * 60));

    let valorFinal = 0;

    if (diffMinutos > tarifa.tolerancia_minutos) {
      valorFinal = Number(tarifa.valor_primeira_hora);

      if (diffMinutos > 60) {
        const horasAdicionais = Math.ceil((diffMinutos - 60) / 60);
        valorFinal += horasAdicionais * Number(tarifa.valor_hora_adicional);
      }
    }

    movimentacao.valor_pago = valorFinal;

    await this.vagasService.update(movimentacao.vaga_id, {
      status: VagaStatus.LIVRE,
    });

    return await this.repository.save(movimentacao);
  }

  async listarAtivas(): Promise<MovimentacaoEntity[]> {
    return await this.repository.find({
      where: { saida: IsNull() },
      relations: ['vaga'],
    });
  }

  async listarHistorico(
    inicio?: string,
    fim?: string,
  ): Promise<MovimentacaoEntity[]> {
    if (inicio && fim) {
      return await this.repository.find({
        where: {
          entrada: Between(new Date(inicio), new Date(fim)),
        },
        relations: ['vaga'],
        order: { entrada: 'DESC' },
      });
    }

    return await this.repository.find({
      relations: ['vaga'],
      order: { entrada: 'DESC' },
    });
  }
}
