import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VagaTipo } from '../../vagas/entities/vaga.entity';

@Entity('tarifas')
export class TarifaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: VagaTipo,
    unique: true,
  })
  tipo_veiculo: VagaTipo;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor_primeira_hora: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor_hora_adicional: number;

  @Column({ type: 'int', default: 15 })
  tolerancia_minutos: number;

  @UpdateDateColumn()
  updated_at: Date;
}
