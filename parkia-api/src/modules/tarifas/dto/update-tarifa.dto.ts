import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateTarifaDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  valor_primeira_hora?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  valor_hora_adicional?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  tolerancia_minutos?: number;
}
