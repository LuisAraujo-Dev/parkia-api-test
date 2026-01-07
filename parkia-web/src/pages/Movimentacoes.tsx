import { useEffect, useState, useCallback, type FormEvent } from 'react'; 
import axios from 'axios';
import { LogIn, LogOut, Car, Bike, Search } from 'lucide-react';
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
  const [entrada, setEntrada] = useState<EntradaForm>({ 
    vaga_id: '', 
    placa: '', 
    tipo_veiculo: VagaTipo.CARRO 
  });
  const [buscaPlaca, setBuscaPlaca] = useState('');
  const [feedbackSaida, setFeedbackSaida] = useState<{ valor: number; placa: string } | null>(null);

  const fetchDados = useCallback(async () => {
    try {
      const [vagasRes, ativasRes] = await Promise.all([
        axios.get('http://localhost:3000/vagas?status=livre'),
        axios.get('http://localhost:3000/movimentacoes')
      ]);
      setVagasLivres(vagasRes.data);
      setAtivas(ativasRes.data);
    } catch (err) {
      console.error("Erro ao buscar dados", err);
    }
  }, []);

  useEffect(() => {
    const inicializar = async () => {
      await fetchDados();
    };
    
    inicializar();
  }, [fetchDados]);

  const handleEntrada = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/movimentacoes/entrada', entrada);
      setEntrada({ vaga_id: '', placa: '', tipo_veiculo: VagaTipo.CARRO });
      await fetchDados();
      alert("Entrada registrada!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Erro na entrada");
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
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Erro na saída");
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <LogIn size={20} />
            <h2 className="font-bold text-lg text-slate-900 uppercase">Entrada</h2>
          </div>
          <form onSubmit={handleEntrada} className="space-y-4">
            <select 
              className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none"
              value={entrada.vaga_id}
              onChange={e => setEntrada({...entrada, vaga_id: e.target.value})}
              required
            >
              <option value="">Selecione a Vaga</option>
              {vagasLivres.map(v => (
                <option key={v.id} value={v.id}>{v.numero} - {v.tipo}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="Placa (ABC-1234)"
              className="w-full p-2 border border-slate-200 rounded-lg text-sm uppercase outline-none"
              value={entrada.placa}
              onChange={e => setEntrada({...entrada, placa: e.target.value})}
              required
            />
            <div className="flex gap-4 px-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input 
                  type="radio" 
                  name="tipo" 
                  checked={entrada.tipo_veiculo === VagaTipo.CARRO} 
                  onChange={() => setEntrada({...entrada, tipo_veiculo: VagaTipo.CARRO})} 
                />
                <Car size={16} /> Carro
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input 
                  type="radio" 
                  name="tipo" 
                  checked={entrada.tipo_veiculo === VagaTipo.MOTO} 
                  onChange={() => setEntrada({...entrada, tipo_veiculo: VagaTipo.MOTO})} 
                />
                <Bike size={16} /> Moto
              </label>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all">
              Confirmar Entrada
            </button>
          </form>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-rose-600">
            <LogOut size={20} />
            <h2 className="font-bold text-lg text-slate-900 uppercase">Saída</h2>
          </div>
          <form onSubmit={handleSaida} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Placa"
              className="flex-1 p-2 border border-slate-200 rounded-lg text-sm uppercase outline-none"
              value={buscaPlaca}
              onChange={e => setBuscaPlaca(e.target.value)}
              required
            />
            <button type="submit" className="bg-rose-600 text-white p-2 rounded-lg hover:bg-rose-700 transition-colors shadow-md">
              <Search size={20} />
            </button>
          </form>
          {feedbackSaida && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center animate-in fade-in zoom-in">
              <p className="text-xs text-amber-800 font-bold mb-1 uppercase tracking-wider">{feedbackSaida.placa}</p>
              <p className="text-3xl font-black text-amber-900">R$ {feedbackSaida.valor.toFixed(2)}</p>
              <button onClick={() => setFeedbackSaida(null)} className="mt-2 text-[10px] font-bold text-amber-600 uppercase hover:underline">Fechar</button>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <h2 className="font-bold text-slate-900 uppercase tracking-tight text-sm">Pátio Atual</h2>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded uppercase">{ativas.length} Veículos</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase text-slate-400 bg-slate-50/30">
                <tr>
                  <th className="px-6 py-4 font-bold">Vaga</th>
                  <th className="px-6 py-4 font-bold">Placa</th>
                  <th className="px-6 py-4 font-bold">Horário Entrada</th>
                  <th className="px-6 py-4 font-bold text-center">Tipo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {ativas.map(at => (
                  <tr key={at.id} className="text-sm hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-black text-blue-600">{at.vaga?.numero}</td>
                    <td className="px-6 py-4 font-medium tracking-widest">{at.placa}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{new Date(at.entrada).toLocaleTimeString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center text-slate-300">
                        {at.tipo_veiculo === 'carro' ? <Car size={18} /> : <Bike size={18} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}