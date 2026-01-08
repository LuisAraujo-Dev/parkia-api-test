import { useEffect, useState, useCallback, type FormEvent } from 'react';
import axios, { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
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
      toast.error(`Erro ao sincronizar dados com o servidor. Erro: ${error}`);
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
      const payload = { ...entrada, placa: entrada.placa.toUpperCase().trim() };
      await axios.post('http://localhost:3000/movimentacoes/entrada', payload);
      
      toast.success(`Entrada registrada: ${payload.placa}`);
      setEntrada({ vaga_id: '', placa: '', tipo_veiculo: 'carro' as VagaTipo });
      fetchDados();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Erro ao registrar entrada");
      }
    }
  };

  const handleSaida = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const placaSaida = buscaPlaca.toUpperCase().trim();
      const res = await axios.post('http://localhost:3000/movimentacoes/saida', { placa: placaSaida });
      
      setFeedbackSaida({ valor: Number(res.data.valor_pago), placa: res.data.placa });
      setBuscaPlaca('');
      toast.success("Checkout realizado!");
      fetchDados();
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Veículo não encontrado");
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <ArrowLeftRight size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Central de Movimentações</h1>
          <p className="text-slate-500">Gestão de fluxo e pátio em tempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6 text-blue-600 font-bold uppercase text-xs tracking-widest">
              <LogIn size={18} /> Check-in
            </div>
            <form onSubmit={handleEntrada} className="space-y-4">
              <select 
                className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={entrada.vaga_id}
                onChange={e => setEntrada({...entrada, vaga_id: e.target.value})}
                required
              >
                <option value="">-- Selecionar Vaga Disponível --</option>
                {vagasLivres.map(v => (
                  <option key={v.id} value={v.id}>{v.numero} ({v.tipo.toUpperCase()})</option>
                ))}
              </select>
              <input 
                type="text" 
                placeholder="Placa (Ex: ABC1D23)"
                className="w-full p-3 border border-slate-200 rounded-xl uppercase outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={entrada.placa}
                onChange={e => setEntrada({...entrada, placa: e.target.value})}
                required
              />
              <div className="flex gap-4 px-1">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input type="radio" checked={entrada.tipo_veiculo === 'carro'} onChange={() => setEntrada({...entrada, tipo_veiculo: 'carro' as VagaTipo})} />
                  Carro
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <input type="radio" checked={entrada.tipo_veiculo === 'moto'} onChange={() => setEntrada({...entrada, tipo_veiculo: 'moto' as VagaTipo})} />
                  Moto
                </label>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all cursor-pointer active:scale-95 shadow-lg shadow-blue-100">
                Confirmar Entrada
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6 text-rose-600 font-bold uppercase text-xs tracking-widest">
              <LogOut size={18} /> Check-out
            </div>
            <form onSubmit={handleSaida} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Placa para saída..."
                className="flex-1 p-3 border border-slate-200 rounded-xl uppercase outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                value={buscaPlaca}
                onChange={e => setBuscaPlaca(e.target.value)}
                required
              />
              <button type="submit" className="bg-rose-600 text-white p-3 rounded-xl hover:bg-rose-700 cursor-pointer shadow-md">
                <Search size={20} />
              </button>
            </form>

            {feedbackSaida && (
              <div className="mt-6 p-6 bg-slate-900 text-white rounded-2xl text-center animate-in zoom-in duration-300">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Valor Calculado ({feedbackSaida.placa})</p>
                <p className="text-4xl font-black text-blue-400">R$ {feedbackSaida.valor.toFixed(2)}</p>
                <button onClick={() => setFeedbackSaida(null)} className="mt-4 text-xs font-bold text-slate-400 hover:text-white uppercase cursor-pointer">Fechar</button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 bg-slate-50/50 flex justify-between items-center border-b border-slate-100">
              <h2 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Veículos no Pátio</h2>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black">{ativas.length} NO MOMENTO</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase text-slate-400 bg-slate-50/30">
                  <tr>
                    <th className="px-6 py-4">Vaga</th>
                    <th className="px-6 py-4">Placa</th>
                    <th className="px-6 py-4">Entrada</th>
                    <th className="px-6 py-4 text-center">Tipo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {ativas.map(at => (
                    <tr key={at.id} className="text-sm hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-black text-blue-600">{at.vaga?.numero}</td>
                      <td className="px-6 py-4 font-medium tracking-widest">{at.placa}</td>
                      <td className="px-6 py-4 text-slate-400">{new Date(at.entrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="px-6 py-4 flex justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                        {at.tipo_veiculo === 'carro' ? <Car size={18} /> : <Bike size={18} />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ativas.length === 0 && !loading && (
                <div className="py-20 text-center text-slate-300 italic text-sm">Pátio vazio.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}