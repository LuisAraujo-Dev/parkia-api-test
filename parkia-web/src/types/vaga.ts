export const VagaStatus = {
  LIVRE: 'livre',
  OCUPADA: 'ocupada',
  MANUTENCAO: 'manutencao',
} as const;

export type VagaStatus = typeof VagaStatus[keyof typeof VagaStatus];

export const VagaTipo = {
  CARRO: 'carro',
  MOTO: 'moto',
  DEFICIENTE: 'deficiente',
} as const;

export type VagaTipo = typeof VagaTipo[keyof typeof VagaTipo];

export interface Vaga {
  id: string;
  numero: string;
  status: VagaStatus;
  tipo: VagaTipo;
  updated_at: string;
}

export interface DashboardStats {
  total: number;
  ocupadas: number;
  livres: number;
  percentualOcupacao: number;
}