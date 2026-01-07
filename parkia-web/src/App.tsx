import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { GestaoVagas } from './pages/GestaoVagas';
import { Movimentacoes } from './pages/Movimentacoes';
import { LayoutDashboard, Map, ArrowLeftRight } from 'lucide-react';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="font-bold text-xl tracking-tight text-slate-900 uppercase">Parkia</span>
          </div>
          <div className="flex gap-6">
            <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link to="/vagas" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors">
              <Map size={18} /> Vagas
            </Link>
            <Link to="/movimentacoes" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors">
              <ArrowLeftRight size={18} /> Movimentações
            </Link>
          </div>
        </nav>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vagas" element={<GestaoVagas />} />
            <Route path="/movimentacoes" element={<Movimentacoes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;