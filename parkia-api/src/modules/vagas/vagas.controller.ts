import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { VagasService } from './vagas.service';
import { CreateVagaDto } from './dto/create-vaga.dto';
import { VagaStatus, VagaTipo } from './entities/vaga.entity';

@Controller('vagas')
export class VagasController {
  constructor(private readonly vagasService: VagasService) {}

  @Post()
  create(@Body() createVagaDto: CreateVagaDto) {
    return this.vagasService.create(createVagaDto);
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
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vagasService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVagaDto: Partial<CreateVagaDto>,
  ) {
    return this.vagasService.update(id, updateVagaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vagasService.remove(id);
  }
}
