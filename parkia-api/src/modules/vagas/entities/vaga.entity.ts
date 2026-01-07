import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
export enum VagaStatus {
  LIVRE = 'livre',
  OCUPADA = 'ocupada',
  MANUTENCAO = 'manutencao',
}

export enum VagaTipo {
  CARRO = 'carro',
  MOTO = 'moto',
  DEFICIENTE = 'deficiente',
}

@Entity('vagas')
export class VagaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numero: string;

  @Column({
    type: 'enum',
    enum: VagaStatus,
    default: VagaStatus.LIVRE,
  })
  status: VagaStatus;

  @Column({
    type: 'enum',
    enum: VagaTipo,
  })
  tipo: VagaTipo;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
