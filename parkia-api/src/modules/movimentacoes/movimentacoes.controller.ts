import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { MovimentacoesService } from './movimentacoes.service';
import { EntradaVeiculoDto } from './dto/entrada-veiculo.dto';
import { SaidaVeiculoDto } from './dto/saida-veiculo.dto';
import { MovimentacaoEntity } from './entities/movimentacao.entity';

@Controller('movimentacoes')
export class MovimentacoesController {
  constructor(private readonly movimentacoesService: MovimentacoesService) {}

  @Post('entrada')
  async registrarEntrada(
    @Body() dto: EntradaVeiculoDto,
  ): Promise<MovimentacaoEntity> {
    return await this.movimentacoesService.registrarEntrada(dto);
  }

  @Post('saida')
  async registrarSaida(
    @Body() dto: SaidaVeiculoDto,
  ): Promise<MovimentacaoEntity> {
    return await this.movimentacoesService.registrarSaida(dto.placa);
  }

  @Get()
  async listarAtivas(): Promise<MovimentacaoEntity[]> {
    return await this.movimentacoesService.listarAtivas();
  }

  @Get('historico')
  async listarHistorico(
    @Query('inicio') inicio?: string,
    @Query('fim') fim?: string,
  ): Promise<MovimentacaoEntity[]> {
    return await this.movimentacoesService.listarHistorico(inicio, fim);
  }
}
