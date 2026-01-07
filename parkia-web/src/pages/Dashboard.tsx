import { useEffect, useState } from 'react';
import axios from 'axios';
import { Car, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import type { DashboardStats } from '../types/vaga';

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/vagas/estatisticas')
      .then(res => setStats(res.data))
      .catch(err => console.error("Erro ao buscar stats", err));
  }, []);

  if (!stats) return <div className="p-8 text-slate-500">Carregando painel...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Parkia Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Vagas" 
          value={stats.total} 
          icon={<BarChart3 className="text-blue-600" />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Vagas Ocupadas" 
          value={stats.ocupadas} 
          icon={<Car className="text-red-600" />} 
          color="bg-red-50" 
        />
        <StatCard 
          title="Vagas Livres" 
          value={stats.livres} 
          icon={<CheckCircle className="text-green-600" />} 
          color="bg-green-50" 
        />
        <StatCard 
          title="Ocupação" 
          value={`${stats.percentualOcupacao}%`} 
          icon={<AlertCircle className="text-purple-600" />} 
          color="bg-purple-50" 
        />
      </div>
    </div>
  );
}