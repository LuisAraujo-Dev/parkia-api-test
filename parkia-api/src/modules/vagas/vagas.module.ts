import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VagasController } from './vagas.controller';
import { VagasService } from './vagas.service';
import { VagaEntity } from './entities/vaga.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VagaEntity])],
  controllers: [VagasController],
  providers: [VagasService],
  exports: [VagasService],
})
export class VagasModule {}
