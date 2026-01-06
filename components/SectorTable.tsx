
import React, { useMemo, useState } from 'react';
import { Product, Sector, SectorData, Indicator } from '../types';

interface SectorTableProps {
  product: Product;
  sector: Sector;
  data: SectorData;
  indicators: Indicator[];
  monthKey: string;
  isEditMode: boolean;
  onUpdateValue: (product: Product, sector: Sector, date: string, indicatorName: string, value: number) => void;
  onAddIndicator: (product: Product, sector: Sector, name: string) => void;
  onDeleteIndicator: (product: Product, sector: Sector, id: string) => void;
}

const SectorTable: React.FC<SectorTableProps> = ({ 
  product, sector, data, indicators, monthKey, isEditMode, onUpdateValue, onAddIndicator, onDeleteIndicator 
}) => {
  const [newIndicatorName, setNewIndicatorName] = useState('');

  const days = useMemo(() => {
    const [year, month] = monthKey.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = (i + 1).toString().padStart(2, '0');
      return `${year}-${month.toString().padStart(2, '0')}-${day}`;
    });
  }, [monthKey]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400 sticky left-0 bg-slate-50 z-10 w-64 shadow-sm">
                KPI / Indicador
              </th>
              {days.map(day => (
                <th key={day} className="p-4 text-[10px] font-bold text-center text-slate-400 border-l border-slate-100 min-w-[60px]">
                  {day.split('-')[2]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {indicators.map((indicator) => (
              <tr key={indicator.id} className="hover:bg-slate-50/50 transition border-b border-slate-50 group">
                <td className="p-4 text-sm font-semibold text-slate-700 sticky left-0 bg-white z-10 shadow-sm flex items-center justify-between">
                  <span>{indicator.name}</span>
                  {isEditMode && (
                    <button 
                      onClick={() => onDeleteIndicator(product, sector, indicator.id)}
                      className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  )}
                </td>
                {days.map(day => {
                  const val = data[day]?.[indicator.name];
                  const displayVal = val !== undefined ? val : '-';
                  
                  return (
                    <td key={day} className="p-2 text-xs text-center border-l border-slate-50">
                      <input
                        type="number"
                        defaultValue={val}
                        onBlur={(e) => {
                          const newVal = parseFloat(e.target.value);
                          if (!isNaN(newVal) && newVal !== val) {
                            onUpdateValue(product, sector, day, indicator.name, newVal);
                          }
                        }}
                        className={`w-14 p-1 text-center bg-transparent border-none focus:bg-indigo-50 focus:outline-none rounded transition ${val !== undefined ? 'text-slate-900 font-bold' : 'text-slate-300'}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isEditMode && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Nome do novo indicador..."
            value={newIndicatorName}
            onChange={(e) => setNewIndicatorName(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={() => {
              if (newIndicatorName) {
                onAddIndicator(product, sector, newIndicatorName);
                setNewIndicatorName('');
              }
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md"
          >
            Adicionar Indicador
          </button>
        </div>
      )}
    </div>
  );
};

export default SectorTable;
