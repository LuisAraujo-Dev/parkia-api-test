import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SaidaVeiculoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$/i, {
    message: 'Placa deve estar no formato ABC-1234 ou ABC1D23 (Mercosul)',
  })
  placa: string;
}
