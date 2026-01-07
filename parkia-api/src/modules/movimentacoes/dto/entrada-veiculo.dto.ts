import { IsEnum, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';
import { VagaTipo } from '../../vagas/entities/vaga.entity';

export class EntradaVeiculoDto {
  @IsUUID()
  @IsNotEmpty()
  vaga_id: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$/, {
    message: 'Placa deve estar no formato ABC-1234 ou ABC1D23',
  })
  placa: string;

  @IsEnum(VagaTipo)
  @IsNotEmpty()
  tipo_veiculo: VagaTipo;
}
