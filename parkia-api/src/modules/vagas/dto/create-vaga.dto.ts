import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VagaStatus, VagaTipo } from '../entities/vaga.entity';

export class CreateVagaDto {
  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsEnum(VagaTipo)
  @IsNotEmpty()
  tipo: VagaTipo;

  @IsEnum(VagaStatus)
  @IsOptional()
  status?: VagaStatus;
}
