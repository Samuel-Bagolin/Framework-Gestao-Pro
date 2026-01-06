
import React, { useState } from 'react';
import { Product, Sector, IndicatorConfig } from '../types';
import { PRODUCTS, SECTORS } from '../constants';

interface DataEntryModalProps {
  onClose: () => void;
  onSave: (product: Product, sector: Sector, date: string, indicators: any) => void;
  indicators: IndicatorConfig;
}

const DataEntryModal: React.FC<DataEntryModalProps> = ({ onClose, onSave, indicators }) => {
  const [product, setProduct] = useState<Product>('sittax');
  const [sector, setSector] = useState<Sector>('retencao');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [values, setValues] = useState<Record<string, number>>({});

  const currentIndicators = indicators[product][sector];

  const handleValueChange = (name: string, val: string) => {
    setValues(prev => ({ ...prev, [name]: parseFloat(val) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(product, sector, date, values);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Lançamento de Registro</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Produto</label>
              <select 
                value={product} 
                onChange={(e) => setProduct(e.target.value as Product)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none"
              >
                {PRODUCTS.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Setor</label>
              <select 
                value={sector} 
                onChange={(e) => setSector(e.target.value as Sector)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none"
              >
                {SECTORS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Data</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {currentIndicators.map((ind) => (
              <div key={ind.id} className="space-y-2">
                <label className="text-sm font-bold text-slate-600">{ind.name}</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => handleValueChange(ind.name, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {ind.type === 'moeda' && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">BRL</span>}
                </div>
              </div>
            ))}
          </div>
        </form>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition">Cancelar</button>
          <button onClick={handleSubmit} className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition">Salvar Dados</button>
        </div>
      </div>
    </div>
  );
};

export default DataEntryModal;
