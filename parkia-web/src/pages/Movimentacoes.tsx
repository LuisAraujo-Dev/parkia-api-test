import { useEffect, useState, useCallback, type FormEvent } from 'react';
import axios, { isAxiosError } from 'axios';
import { LogIn, LogOut, Car, Bike, Search, ArrowLeftRight } from 'lucide-react';
import { type Vaga, VagaTipo } from '../types/vaga';

interface Movimentacao {
  id: string;
  placa: string;
  tipo_veiculo: VagaTipo;
  entrada: string;
  vaga: Vaga;
}

interface EntradaForm {
  vaga_id: string;
  placa: string;
  tipo_veiculo: VagaTipo;
}

export function Movimentacoes() {
  const [vagasLivres, setVagasLivres] = useState<Vaga[]>([]);
  const [ativas, setAtivas] = useState<Movimentacao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [entrada, setEntrada] = useState<EntradaForm>({ 
    vaga_id: '', 
    placa: '', 
    tipo_veiculo: 'carro' as VagaTipo 
  });
  
  const [buscaPlaca, setBuscaPlaca] = useState<string>('');
  const [feedbackSaida, setFeedbackSaida] = useState<{ valor: number; placa: string } | null>(null);

  const fetchDados = useCallback(async () => {
    try {
      setLoading(true);
      const [vagasRes, ativasRes] = await Promise.all([
        axios.get<Vaga[]>('http://localhost:3000/vagas?status=livre'),
        axios.get<Movimentacao[]>('http://localhost:3000/movimentacoes')
      ]);
      setVagasLivres(vagasRes.data);
      setAtivas(ativasRes.data);
    } catch (error: unknown) {
      console.error("Erro ao sincronizar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  const handleEntrada = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/movimentacoes/entrada', entrada);
      setEntrada({ vaga_id: '', placa: '', tipo_veiculo: 'carro' as VagaTipo });
      await fetchDados();
      alert("Entrada registrada com sucesso!");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || "Falha ao registrar entrada");
      }
    }
  };

  const handleSaida = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/movimentacoes/saida', { placa: buscaPlaca });
      setFeedbackSaida({ valor: Number(res.data.valor_pago), placa: res.data.placa });
      setBuscaPlaca('');
      await fetchDados();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || "Veículo não encontrado ou erro na saída");
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <ArrowLeftRight size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Central de Movimentações</h1>
          <p className="text-slate-500">Controle de entradas e saídas do pátio em tempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6 text-blue-600">
              <LogIn size={20} />
              <h2 className="font-bold text-lg text-slate-900 uppercase tracking-tight">Check-in</h2>
            </div>
            
            <form onSubmit={handleEntrada} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Vaga Livre</label>
                <select 
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer bg-slate-50"
                  value={entrada.vaga_id}
                  onChange={e => setEntrada({...entrada, vaga_id: e.target.value})}
                  required
                >
                  <option value="">-- Selecionar Vaga Disponível --</option>
                  {vagasLivres.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.numero} ({v.tipo.toUpperCase()})
                    </option>
                  ))}
                </select>
                {vagasLivres.length === 0 && !loading && (
                  <p className="text-[10px] text-rose-500 mt-1 font-medium italic">* Não há vagas livres no momento</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Placa do Veículo</label>
                <input 
                  type="text" 
                  placeholder="Ex: ABC-1234"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={entrada.placa}
                  onChange={e => setEntrada({...entrada, placa: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-4 p-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600">
                  <input type="radio" checked={entrada.tipo_veiculo === 'carro'} onChange={() => setEntrada({...entrada, tipo_veiculo: 'carro' as VagaTipo})} />
                  <Car size={16} /> Carro
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-600">
                  <input type="radio" checked={entrada.tipo_veiculo === 'moto'} onChange={() => setEntrada({...entrada, tipo_veiculo: 'moto' as VagaTipo})} />
                  <Bike size={16} /> Moto
                </label>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95 cursor-pointer">
                Registrar Entrada
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6 text-rose-600">
              <LogOut size={20} />
              <h2 className="font-bold text-lg text-slate-900 uppercase tracking-tight">Check-out</h2>
            </div>
            
            <form onSubmit={handleSaida} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Placa para saída..."
                className="flex-1 p-2.5 border border-slate-200 rounded-xl text-sm uppercase outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                value={buscaPlaca}
                onChange={e => setBuscaPlaca(e.target.value)}
                required
              />
              <button type="submit" className="bg-rose-600 text-white p-3 rounded-xl hover:bg-rose-700 transition-colors shadow-md cursor-pointer">
                <Search size={20} />
              </button>
            </form>

            {feedbackSaida && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center animate-in zoom-in duration-300">
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Pagamento Pendente: {feedbackSaida.placa}</p>
                <p className="text-4xl font-black text-amber-900">R$ {feedbackSaida.valor.toFixed(2)}</p>
                <button onClick={() => setFeedbackSaida(null)} className="mt-3 text-xs font-bold text-amber-600 uppercase hover:underline cursor-pointer">Concluir e Fechar</button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-900 uppercase tracking-tight text-sm">Veículos no Pátio</h2>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black">{ativas.length} VEÍCULOS</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase text-slate-400 bg-slate-50/30">
                  <tr>
                    <th className="px-6 py-4 font-bold">Vaga</th>
                    <th className="px-6 py-4 font-bold">Placa</th>
                    <th className="px-6 py-4 font-bold">Entrada</th>
                    <th className="px-6 py-4 font-bold text-center">Tipo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {ativas.map(at => (
                    <tr key={at.id} className="text-sm hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-black text-blue-600">{at.vaga?.numero}</td>
                      <td className="px-6 py-4 font-medium tracking-widest">{at.placa}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">{new Date(at.entrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-6 py-4 flex justify-center text-slate-300">
                        {at.tipo_veiculo === 'carro' ? <Car size={18} /> : <Bike size={18} />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ativas.length === 0 && !loading && (
                <div className="py-20 text-center text-slate-300 italic text-sm">Nenhum veículo estacionado no momento.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}