import { type Vaga, VagaStatus } from '../types/vaga';
import { Car, Bike, Accessibility, Trash2 } from 'lucide-react';

interface Props {
  vaga: Vaga;
  onDelete: (id: string) => void;
}

export function VagaCard({ vaga, onDelete }: Props) {
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

  const podeDeletar = vaga.status === VagaStatus.LIVRE;

  return (
    <div className={`relative p-5 rounded-2xl border-2 transition-all ${statusStyles[vaga.status]} flex flex-col items-center gap-3 shadow-sm`}>
      
      {podeDeletar && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(vaga.id);
          }}
          className="absolute top-2 right-2 bg-white text-rose-600 p-1.5 rounded-lg shadow-sm border border-rose-100 cursor-pointer hover:bg-rose-600 hover:text-white transition-colors"
          title="Excluir Vaga"
        >
          <Trash2 size={16} />
        </button>
      )}

      <span className="text-xs font-black uppercase tracking-widest opacity-60">{vaga.numero}</span>
      
      <div className="p-2 bg-white/50 rounded-full">
        <Icon size={32} strokeWidth={2} />
      </div>

      <div className="flex flex-col items-center">
        <span className="text-[10px] font-bold uppercase tracking-tighter">{vaga.status}</span>
        <span className="text-[9px] opacity-50 uppercase">{vaga.tipo}</span>
      </div>
    </div>
  );
}