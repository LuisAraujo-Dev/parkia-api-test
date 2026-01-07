import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VagaEntity, VagaTipo } from '../../vagas/entities/vaga.entity';

@Entity('movimentacoes')
export class MovimentacaoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vaga_id: string;

  // Relacionamento com a vaga
  @ManyToOne(() => VagaEntity)
  @JoinColumn({ name: 'vaga_id' })
  vaga: VagaEntity;

  @Column()
  placa: string;

  @Column({
    type: 'enum',
    enum: VagaTipo,
  })
  tipo_veiculo: VagaTipo;

  @CreateDateColumn()
  entrada: Date;

  @Column({ type: 'timestamp', nullable: true })
  saida: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_pago: number;
}
