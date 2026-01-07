import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Vaga } from '../types/vaga';
import { VagaCard } from '../components/VagaCard';
import { Plus } from 'lucide-react';

export function GestaoVagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVagas();
  }, []);

  const fetchVagas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/vagas');
      setVagas(response.data);
    } catch (error) {
      console.error("Erro ao carregar vagas", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mapa de Vagas</h1>
          <p className="text-slate-500">Visualize e gerencie a ocupação em tempo real</p>
        </div>
        
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={20} />
          Nova Vaga
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-slate-400">Carregando mapa...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {vagas.map(vaga => (
            <VagaCard key={vaga.id} vaga={vaga} />
          ))}
        </div>
      )}

      {vagas.length === 0 && !loading && (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500">Nenhuma vaga cadastrada no sistema.</p>
        </div>
      )}
    </div>
  );
}