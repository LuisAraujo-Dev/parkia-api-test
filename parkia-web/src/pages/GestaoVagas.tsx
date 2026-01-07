import { useEffect, useState, useCallback, type FormEvent } from 'react';
import axios, { isAxiosError } from 'axios';
import { Plus, X } from 'lucide-react';
import { VagaCard } from '../components/VagaCard';
import { type Vaga, VagaTipo } from '../types/vaga';

interface NovaVagaForm {
  numero: string;
  tipo: VagaTipo;
}

export function GestaoVagas() {
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [novaVaga, setNovaVaga] = useState<NovaVagaForm>({ numero: '', tipo: 'carro' as VagaTipo });

  const fetchVagas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<Vaga[]>('http://localhost:3000/vagas');
      setVagas(response.data);
    } catch (error: unknown) {
      console.error("Erro ao carregar vagas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVagas();
  }, [fetchVagas]);

  const handleDeleteVaga = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta vaga?")) return;

    try {
      await axios.delete(`http://localhost:3000/vagas/${id}`);
      await fetchVagas();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || "Erro ao excluir vaga");
      }
    }
  };

  const handleCreateVaga = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/vagas', novaVaga);
      setNovaVaga({ numero: '', tipo: 'carro' as VagaTipo });
      setShowForm(false);
      await fetchVagas();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || "Erro ao criar vaga");
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mapa de Vagas</h1>
          <p className="text-slate-500">Gerencie a infraestrutura do pátio</p>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer shadow-md"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancelar' : 'Nova Vaga'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-2xl border border-blue-100 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">Cadastrar Nova Vaga</h2>
          <form onSubmit={handleCreateVaga} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-200px">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Identificação</label>
              <input 
                type="text" 
                className="w-full p-2.5 border border-slate-200 rounded-xl uppercase outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="Ex: A-01"
                value={novaVaga.numero}
                onChange={e => setNovaVaga({...novaVaga, numero: e.target.value})}
                required
              />
            </div>
            <div className="flex-1 min-w-200px">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tipo de Vaga</label>
              <select 
                className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                value={novaVaga.tipo}
                onChange={e => setNovaVaga({...novaVaga, tipo: e.target.value as VagaTipo})}
              >
                <option value="carro">Vaga para Carro</option>
                <option value="moto">Vaga para Moto</option>
                <option value="deficiente">Vaga Acessível (PCD)</option>
              </select>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 cursor-pointer shadow-md">
              Salvar Vaga
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20 text-slate-400 italic">Carregando mapa...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {vagas.map(vaga => (
            <VagaCard 
              key={vaga.id} 
              vaga={vaga} 
              onDelete={handleDeleteVaga}
            />
          ))}
        </div>
      )}
    </div>
  );
}