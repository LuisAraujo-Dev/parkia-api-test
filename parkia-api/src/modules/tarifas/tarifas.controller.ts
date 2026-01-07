import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { TarifasService } from './tarifas.service';
import { UpdateTarifaDto } from './dto/update-tarifa.dto';

@Controller('tarifas')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  @Get()
  findAll() {
    return this.tarifasService.findAll();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTarifaDto) {
    return this.tarifasService.update(id, dto);
  }
}
