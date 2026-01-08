import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, ArrowLeftRight, Settings, Car } from 'lucide-react';

// Importação das Páginas
import { Dashboard } from './pages/Dashboard';
import { Movimentacoes } from './pages/Movimentacoes';
import { GestaoVagas } from './pages/GestaoVagas';

/**
 * Componente de Navegação Lateral (Sidebar)
 * Renderiza os links e destaca o ativo baseado na rota atual.
 */
function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/movimentacoes', label: 'Movimentações', icon: ArrowLeftRight },
    { path: '/vagas', label: 'Gestão de Vagas', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Car size={24} />
        </div>
        <span className="text-xl font-black text-slate-800 tracking-tight">PARKIA</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-50">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Operador</p>
          <p className="text-sm font-bold text-slate-700">Luis Araujo</p>
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px'
            },
            success: {
              iconTheme: {
                primary: '#3b82f6',
                secondary: '#fff',
              },
            },
          }}
        />
        <Sidebar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movimentacoes" element={<Movimentacoes />} />
            <Route path="/vagas" element={<GestaoVagas />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}