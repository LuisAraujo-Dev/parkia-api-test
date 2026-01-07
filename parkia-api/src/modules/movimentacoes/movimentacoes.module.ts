// parkia-api/src/modules/movimentacoes/movimentacoes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimentacoesController } from './movimentacoes.controller';
import { MovimentacoesService } from './movimentacoes.service';
import { MovimentacaoEntity } from './entities/movimentacao.entity';
import { VagasModule } from '../vagas/vagas.module';
import { TarifasModule } from '../tarifas/tarifas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovimentacaoEntity]),
    VagasModule,
    TarifasModule,
  ],
  controllers: [MovimentacoesController],
  providers: [MovimentacoesService],
})
export class MovimentacoesModule {}
