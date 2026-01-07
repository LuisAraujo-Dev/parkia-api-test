import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { VagasModule } from './modules/vagas/vagas.module';
import { TarifasModule } from './modules/tarifas/tarifas.module';

import { TarifaEntity } from './modules/tarifas/entities/tarifa.entity';
import { VagaTipo } from './modules/vagas/entities/vaga.entity';
import { MovimentacoesModule } from './modules/movimentacoes/movimentacoes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT', 5444),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    VagasModule,
    TarifasModule,
    MovimentacoesModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}
  async onModuleInit() {
    const tarifaRepo = this.dataSource.getRepository(TarifaEntity);
    const count = await tarifaRepo.count();

    if (count === 0) {
      console.log('🌱 Criando tarifas iniciais no banco de dados...');

      await tarifaRepo.save([
        {
          tipo_veiculo: VagaTipo.CARRO,
          valor_primeira_hora: 10.0,
          valor_hora_adicional: 5.0,
          tolerancia_minutos: 15,
        },
        {
          tipo_veiculo: VagaTipo.MOTO,
          valor_primeira_hora: 5.0,
          valor_hora_adicional: 2.0,
          tolerancia_minutos: 15,
        },
      ]);

      console.log('✅ Tarifas padrão (Carro/Moto) inseridas com sucesso!');
    }
  }
}
