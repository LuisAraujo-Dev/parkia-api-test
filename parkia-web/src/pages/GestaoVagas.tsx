import { useEffect, useState, useCallback, type FormEvent } from 'react';
import axios, { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { Plus, X, Settings } from 'lucide-react';
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
      toast.error(`Erro ao carregar o mapa de vagas. Erro: ${error}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVagas();
  }, [fetchVagas]);

  const handleCreateVaga = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...novaVaga, numero: novaVaga.numero.toUpperCase().trim() };
      await axios.post('http://localhost:3000/vagas', payload);
      
      toast.success(`Vaga ${payload.numero} criada com sucesso!`);
      setNovaVaga({ numero: '', tipo: 'carro' as VagaTipo });
      setShowForm(false);
      fetchVagas();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Falha ao criar vaga");
      }
    }
  };

  const handleDeleteVaga = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta vaga permanentemente?")) return;

    try {
      await axios.delete(`http://localhost:3000/vagas/${id}`);
      toast.success("Vaga removida!");
      fetchVagas();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Apenas vagas livres podem ser removidas");
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2 rounded-lg text-white">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mapa de Vagas</h1>
            <p className="text-slate-500">Infraestrutura e disponibilidade</p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer shadow-lg shadow-blue-100 active:scale-95"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Fechar' : 'Nova Vaga'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-8 bg-white rounded-3xl border border-blue-50 shadow-xl animate-in slide-in-from-top-4 duration-300">
          <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6">Configurar Nova Vaga</h2>
          <form onSubmit={handleCreateVaga} className="flex flex-wrap gap-6 items-end">
            <div className="flex-1 min-w-250px">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Identificador</label>
              <input 
                type="text" 
                className="w-full p-3 border border-slate-200 rounded-xl uppercase outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all font-bold" 
                placeholder="Ex: A-01"
                value={novaVaga.numero}
                onChange={e => setNovaVaga({...novaVaga, numero: e.target.value})}
                required
              />
            </div>
            <div className="flex-1 min-w-250px">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Tipo de Veículo Permitido</label>
              <select 
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={novaVaga.tipo}
                onChange={e => setNovaVaga({...novaVaga, tipo: e.target.value as VagaTipo})}
              >
                <option value="carro">Carro</option>
                <option value="moto">Moto</option>
                <option value="deficiente">Acessível (PCD)</option>
              </select>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-blue-700 cursor-pointer transition-all shadow-md">
              Salvar Vaga
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20 text-slate-300 italic">Carregando mapa...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {vagas.map(vaga => (
            <VagaCard key={vaga.id} vaga={vaga} onDelete={handleDeleteVaga} />
          ))}
        </div>
      )}

      {!loading && vagas.length === 0 && (
        <div className="text-center py-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium italic">Nenhuma vaga configurada no pátio.</p>
        </div>
      )}
    </div>
  );
}