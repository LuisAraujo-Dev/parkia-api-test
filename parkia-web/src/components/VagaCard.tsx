import { type Vaga, VagaStatus } from '../types/vaga';
import { Car, Bike, Accessibility } from 'lucide-react';

interface Props {
  vaga: Vaga;
}

export function VagaCard({ vaga }: Props) {
  const statusStyles: Record<string, string> = {
    [VagaStatus.LIVRE]: 'bg-green-100 border-green-200 text-green-700',
    [VagaStatus.OCUPADA]: 'bg-red-100 border-red-200 text-red-700',
    [VagaStatus.MANUTENCAO]: 'bg-slate-100 border-slate-200 text-slate-500',
  };

  const icons = {
    carro: Car,
    moto: Bike,
    deficiente: Accessibility,
  };

  const Icon = icons[vaga.tipo as keyof typeof icons] || Car;

  return (
    <div className={`p-4 rounded-xl border-2 transition-all ${statusStyles[vaga.status]} flex flex-col items-center gap-2 shadow-sm`}>
      <span className="text-xs font-bold uppercase tracking-wider">{vaga.numero}</span>
      <Icon size={32} strokeWidth={1.5} />
      <span className="text-[10px] font-medium uppercase">{vaga.status}</span>
    </div>
  );
}