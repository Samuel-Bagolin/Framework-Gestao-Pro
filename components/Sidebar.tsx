
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isOnline: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOnline }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'sittax', label: 'Sittax', icon: 'fa-rocket' },
    { id: 'openix', label: 'Openix', icon: 'fa-globe' },
    { id: 'comparativo', label: 'Comparativo', icon: 'fa-balance-scale' },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/20">
          <i className="fas fa-layer-group"></i>
        </div>
        <div>
          <h2 className="text-white font-bold tracking-tight">Setup Tech</h2>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              {isOnline ? 'On-line' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-lg transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}></i>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-800 rounded-2xl p-4 text-center">
          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">Versão 3.5 PRO</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
