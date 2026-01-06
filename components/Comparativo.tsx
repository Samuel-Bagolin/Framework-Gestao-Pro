
import React from 'react';
import { MonthData, IndicatorConfig, Product } from '../types';
import { SECTORS, PRODUCTS } from '../constants';

interface ComparativoProps {
  monthData: MonthData;
  indicatorConfig: IndicatorConfig;
}

const Comparativo: React.FC<ComparativoProps> = ({ monthData, indicatorConfig }) => {
  const getLatestValue = (p: Product, s: string, ind: string) => {
    const sData = monthData[p]?.[s];
    if (!sData) return '-';
    const dates = Object.keys(sData).sort();
    if (dates.length === 0) return '-';
    const val = sData[dates[dates.length - 1]][ind];
    return val !== undefined ? val : '-';
  };

  // Get a unique list of all indicator names across both products for a specific sector
  const getUniqueIndicatorsForSector = (sector: string) => {
    const names = new Set<string>();
    const typeMap = new Map<string, string>();
    
    PRODUCTS.forEach(p => {
      (indicatorConfig[p]?.[sector] || []).forEach(ind => {
        // We clean up names like "Migração Sittax" to just "Migração" if possible for better matching,
        // but the user asked for "same indicators that are in each tool".
        // To be safe, we'll list all indicators found in config.
        names.add(ind.name);
        typeMap.set(ind.name, ind.type);
      });
    });
    
    return Array.from(names).map(name => ({ name, type: typeMap.get(name) }));
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      {SECTORS.map((sector) => (
        <div key={sector} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 capitalize flex items-center gap-3">
              <i className="fas fa-chart-line text-indigo-500"></i>
              {sector}
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comparativo de Performance</span>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.15em] border-b border-slate-100">
                  <th className="p-4 text-left">Indicador</th>
                  <th className="p-4 text-center text-amber-600">Sittax</th>
                  <th className="p-4 text-center text-emerald-600">Openix</th>
                </tr>
              </thead>
              <tbody>
                {getUniqueIndicatorsForSector(sector).map((ind, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition">
                    <td className="p-4 text-slate-600 font-bold">{ind.name}</td>
                    <td className="p-4 text-center text-slate-900 font-black">
                      {getLatestValue('sittax', sector, ind.name)}{ind.type === 'percentual' && getLatestValue('sittax', sector, ind.name) !== '-' ? '%' : ''}
                    </td>
                    <td className="p-4 text-center text-slate-900 font-black">
                       {getLatestValue('openix', sector, ind.name)}{ind.type === 'percentual' && getLatestValue('openix', sector, ind.name) !== '-' ? '%' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comparativo;
