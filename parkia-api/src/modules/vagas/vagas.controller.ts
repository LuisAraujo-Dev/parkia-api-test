import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { VagasService } from './vagas.service';
import { CreateVagaDto } from './dto/create-vaga.dto';
import { VagaStatus, VagaTipo } from './entities/vaga.entity';

@Controller('vagas')
export class VagasController {
  constructor(private readonly vagasService: VagasService) {}

  @Post()
  create(@Body() dto: CreateVagaDto) {
    return this.vagasService.create(dto);
  }

  @Get('estatisticas')
  getStats() {
    return this.vagasService.getStats();
  }

  @Get()
  findAll(
    @Query('status') status?: VagaStatus,
    @Query('tipo') tipo?: VagaTipo,
  ) {
    return this.vagasService.findAll(status, tipo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vagasService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateVagaDto>) {
    return this.vagasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vagasService.remove(id);
  }
}
