
import React, { useState, useEffect } from 'react';
import { Product, Sector, MonthData, MonthOption, IndicatorConfig, Indicator } from './types';
import { PRODUCTS, SECTORS, INITIAL_INDICATORS } from './constants';
import { syncData, updateData } from './services/firebase';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SectorTable from './components/SectorTable';
import Comparativo from './components/Comparativo';
import DataEntryModal from './components/DataEntryModal';
import MonthSelector from './components/MonthSelector';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sittax' | 'openix' | 'comparativo'>('dashboard');
  const [activeSector, setActiveSector] = useState<Sector>('retencao');
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [monthData, setMonthData] = useState<MonthData>({ sittax: {}, openix: {} });
  const [indicatorConfig, setIndicatorConfig] = useState<IndicatorConfig>(INITIAL_INDICATORS);
  const [availableMonths, setAvailableMonths] = useState<MonthOption[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const months: MonthOption[] = [];
    const now = new Date();
    // Gerar 24 meses (12 passados e 12 futuros para facilitar testes como o de 2026)
    for (let i = -12; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      const name = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      months.push({ key, name });
    }
    // Ordenar para o mais recente primeiro (baseado na data atual)
    months.sort((a, b) => b.key.localeCompare(a.key));
    setAvailableMonths(months);
    
    const currentKey = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    setCurrentMonth(currentKey);
  }, []);

  useEffect(() => {
    if (!currentMonth) return;
    const unsubData = syncData(`frameworkGestao/${currentMonth}`, (data) => {
      if (data) {
        setMonthData({
          sittax: data.sittax || {},
          openix: data.openix || {}
        });
      } else {
        setMonthData({ sittax: {}, openix: {} });
      }
    });
    return () => unsubData();
  }, [currentMonth]);

  useEffect(() => {
    const unsubConfig = syncData(`config/indicators`, (data) => {
      if (data) setIndicatorConfig(data);
    });
    return () => unsubConfig();
  }, []);

  const handleSaveData = async (product: Product, sector: Sector, date: string, indicators: any) => {
    try {
      const dateObj = new Date(date + 'T12:00:00');
      const dateMonthKey = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
      
      // Salva apenas no nó específico da data para não apagar outros dias
      await updateData(`frameworkGestao/${dateMonthKey}/${product}/${sector}/${date}`, indicators);
      
      // Se salvou em um mês diferente do atual, muda o filtro para o usuário ver o dado
      if (dateMonthKey !== currentMonth) {
        setCurrentMonth(dateMonthKey);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar dados no Firebase. Verifique sua conexão.");
    }
  };

  const handleUpdateCellValue = async (product: Product, sector: Sector, date: string, indicatorName: string, value: number) => {
    const dateObj = new Date(date + 'T12:00:00');
    const dateMonthKey = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
    await updateData(`frameworkGestao/${dateMonthKey}/${product}/${sector}/${date}`, { [indicatorName]: value });
  };

  const handleAddIndicator = async (product: Product, sector: Sector, name: string) => {
    const newConfig = { ...indicatorConfig };
    const newIndicator: Indicator = {
      id: Date.now().toString(),
      name,
      type: 'numerico'
    };
    if (!newConfig[product]) newConfig[product] = INITIAL_INDICATORS[product];
    newConfig[product][sector].push(newIndicator);
    await updateData(`config/indicators/${product}/${sector}`, newConfig[product][sector]);
  };

  const handleDeleteIndicator = async (product: Product, sector: Sector, id: string) => {
    const newConfig = { ...indicatorConfig };
    newConfig[product][sector] = newConfig[product][sector].filter(i => i.id !== id);
    await updateData(`config/indicators/${product}/${sector}`, newConfig[product][sector]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOnline={isOnline} />
      
      <main className="flex-1 p-4 md:p-8 ml-0 md:ml-64 transition-all duration-300">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Framework Gestão Pro</h1>
            <p className="text-slate-500 text-sm">Monitoramento Estratégico Sittax & Openix</p>
          </div>
          
          <div className="flex items-center gap-3">
            <MonthSelector currentMonth={currentMonth} availableMonths={availableMonths} onMonthChange={setCurrentMonth} />
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              <span>Lançar Registro</span>
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <Dashboard monthData={monthData} currentMonth={currentMonth} indicatorConfig={indicatorConfig} />
        )}

        {(activeTab === 'sittax' || activeTab === 'openix') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex overflow-x-auto no-scrollbar gap-2">
                {SECTORS.map(s => (
                  <button
                    key={s}
                    onClick={() => setActiveSector(s)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                      activeSector === s ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200/50'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
                  isEditMode ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {isEditMode ? 'Finalizar Edição' : 'Modo Estrutura'}
              </button>
            </div>

            <SectorTable 
              product={activeTab as Product} 
              sector={activeSector} 
              data={monthData[activeTab as Product]?.[activeSector] || {}}
              indicators={indicatorConfig[activeTab as Product]?.[activeSector] || []}
              monthKey={currentMonth}
              isEditMode={isEditMode}
              onUpdateValue={handleUpdateCellValue}
              onAddIndicator={handleAddIndicator}
              onDeleteIndicator={handleDeleteIndicator}
            />
          </div>
        )}

        {activeTab === 'comparativo' && (
          <Comparativo monthData={monthData} indicatorConfig={indicatorConfig} />
        )}
      </main>

      {isModalOpen && (
        <DataEntryModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveData}
          indicators={indicatorConfig}
        />
      )}
    </div>
  );
};

export default App;
