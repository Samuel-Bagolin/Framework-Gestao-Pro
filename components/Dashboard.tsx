
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthData, IndicatorConfig, Product } from '../types';
import { LOSS_TARGETS } from '../constants';

interface DashboardProps {
  monthData: MonthData;
  currentMonth: string;
  indicatorConfig: IndicatorConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ monthData, currentMonth, indicatorConfig }) => {
  const productMetrics = useMemo(() => {
    const init = () => ({
      ativos: 0,
      solicitacoes: 0,
      cancelados: 0,
      mrrCancelado: 0,
      canceladoAuto: 0,
      revertidos: 0
    });

    const metrics = {
      sittax: init(),
      openix: init()
    };

    const processProduct = (p: Product) => {
      Object.values(monthData[p] || {}).forEach(sectorData => {
        Object.values(sectorData).forEach(dayData => {
          metrics[p].ativos += dayData['Quantidades de Clientes'] || 0;
          metrics[p].solicitacoes += dayData['Solicitações de Cancelamento'] || 0;
          metrics[p].cancelados += dayData['Cancelados'] || 0;
          metrics[p].mrrCancelado += dayData['MRR Cancelado (R$)'] || 0;
          metrics[p].canceladoAuto += dayData['Cancelamento Automático'] || 0;
          metrics[p].revertidos += dayData['Reversão de Cancelamentos'] || dayData['Revertidos'] || 0;
        });
      });
    };

    processProduct('sittax');
    processProduct('openix');

    return metrics;
  }, [monthData]);

  const renderProductSection = (name: string, productId: Product, data: any, primaryColor: string, icon: string) => {
    const totalLoss = data.mrrCancelado;
    const target = LOSS_TARGETS[productId];
    const percentage = target > 0 ? (totalLoss / target) * 100 : 0;
    const isOverTarget = totalLoss > target;

    const cards = [
      { label: 'Clientes Ativos', value: data.ativos.toLocaleString('pt-BR'), icon: 'fa-users' },
      { label: 'Solicit. Cancelamento', value: data.solicitacoes, icon: 'fa-file-invoice' },
      { label: 'Cancelados', value: data.cancelados, icon: 'fa-user-minus' },
      { label: 'MRR Perda Total', value: `R$ ${totalLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: 'fa-money-bill-wave', highlight: isOverTarget },
      { label: 'Cancelamento Auto', value: data.canceladoAuto, icon: 'fa-robot' },
      { label: 'Revertidos', value: data.revertidos, icon: 'fa-undo' },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${primaryColor} rounded-xl flex items-center justify-center text-white shadow-lg`}>
              <i className={`fas ${icon}`}></i>
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{name}</h2>
          </div>

          <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm min-w-[320px]">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Acompanhamento de MRR</p>
                <p className="text-lg font-bold text-slate-800">
                  {percentage.toFixed(1)}% <span className="text-slate-400 text-sm font-normal">do limite</span>
                </p>
              </div>
              <div className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${isOverTarget ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                {isOverTarget ? 'Meta Excedida' : 'Meta OK'}
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ease-out ${isOverTarget ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-emerald-500'}`} 
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <div key={i} className={`bg-white p-5 rounded-2xl shadow-sm border ${card.highlight ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100'} flex flex-col justify-between hover:border-slate-300 transition-all group`}>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-[9px] font-black uppercase tracking-widest ${card.highlight ? 'text-rose-500' : 'text-slate-400'}`}>{card.label}</p>
                <i className={`fas ${card.icon} ${card.highlight ? 'text-rose-300' : 'text-slate-200 group-hover:text-indigo-400'} text-xs transition-colors`}></i>
              </div>
              <h3 className={`text-xl font-bold ${card.highlight ? 'text-rose-700' : 'text-slate-800'}`}>{card.value}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const trendData = useMemo(() => {
    return [
      { name: 'Semana 1', sittax: (productMetrics.sittax.mrrCancelado) * 0.2, openix: (productMetrics.openix.mrrCancelado) * 0.15 },
      { name: 'Semana 2', sittax: (productMetrics.sittax.mrrCancelado) * 0.5, openix: (productMetrics.openix.mrrCancelado) * 0.4 },
      { name: 'Semana 3', sittax: (productMetrics.sittax.mrrCancelado) * 0.8, openix: (productMetrics.openix.mrrCancelado) * 0.85 },
      { name: 'Atual', sittax: (productMetrics.sittax.mrrCancelado), openix: (productMetrics.openix.mrrCancelado) },
    ];
  }, [productMetrics]);

  return (
    <div className="space-y-12 pb-10">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
            <i className="fas fa-bullseye text-indigo-400"></i>
            Resumo de Metas de Perda (MRR)
          </h3>
          <div className="px-3 py-1 bg-slate-800 rounded-lg text-[10px] font-black text-slate-400 tracking-widest uppercase">
            Visão Geral Mensal
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {(['sittax', 'openix'] as Product[]).map(p => {
             const total = productMetrics[p].mrrCancelado;
             const target = LOSS_TARGETS[p];
             const isOver = total > target;
             const colors = {
               sittax: 'text-amber-600',
               openix: 'text-emerald-600'
             };
             return (
               <div key={p} className="p-8 flex flex-col items-center text-center group hover:bg-slate-50 transition-colors">
                 <span className={`text-[11px] font-black ${colors[p]} uppercase tracking-[0.25em] mb-3`}>{p}</span>
                 <div className={`text-2xl font-black mb-1 ${isOver ? 'text-rose-600' : 'text-slate-800'}`}>
                   R$ {target.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                 </div>
                 <div className="text-[10px] font-bold text-slate-400">META MÁXIMA DE PERDA</div>
                 
                 <div className="mt-6 w-full flex flex-col items-center">
                    <div className="flex justify-between w-full text-[9px] font-black text-slate-400 uppercase mb-1">
                      <span>Realizado</span>
                      <span className={isOver ? 'text-rose-500' : 'text-emerald-500'}>
                        R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((total/target)*100, 100)}%` }}></div>
                    </div>
                 </div>

                 <div className="mt-4 flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${isOver ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                   <span className={`text-[11px] font-black ${isOver ? 'text-rose-600' : 'text-emerald-600'}`}>
                     {isOver ? 'LIMITE EXCEDIDO' : 'DENTRO DA MARGEM'}
                   </span>
                 </div>
               </div>
             )
          })}
        </div>
      </div>

      {renderProductSection('Sittax', 'sittax', productMetrics.sittax, 'bg-amber-500', 'fa-rocket')}
      <hr className="border-slate-200" />
      {renderProductSection('Openix', 'openix', productMetrics.openix, 'bg-emerald-600', 'fa-globe')}

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Acúmulo de MRR Perdido</h3>
            <p className="text-xs text-slate-400">Tendência de perda total no mês</p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sittax</span>
             </div>
             <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Openix</span>
             </div>
          </div>
        </div>
        <div className="h-[320px]">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="gradSittax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gradOp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dx={-10} tickFormatter={(v) => `R$ ${v}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
                  formatter={(value: any) => [`R$ ${parseFloat(value).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, '']}
                />
                <Area type="monotone" dataKey="sittax" name="Sittax" stroke="#f59e0b" fill="url(#gradSittax)" strokeWidth={3} />
                <Area type="monotone" dataKey="openix" name="Openix" stroke="#10b981" fill="url(#gradOp)" strokeWidth={3} />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
