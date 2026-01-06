
import React, { useState, useEffect } from 'react';
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

  const currentIndicators = indicators[product]?.[sector] || [];

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
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <h2 className="text-xl font-bold text-slate-800">Lançamento de Registro</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Produto</label>
              <div className="relative">
                <select 
                  value={product} 
                  onChange={(e) => setProduct(e.target.value as Product)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                >
                  {PRODUCTS.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Setor</label>
              <div className="relative">
                <select 
                  value={sector} 
                  onChange={(e) => setSector(e.target.value as Sector)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                >
                  {SECTORS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Data</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-300"
                  />
                  {ind.type === 'moeda' && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">BRL</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </form>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-end items-center gap-6">
          <button 
            type="button" 
            onClick={onClose} 
            className="text-sm font-bold text-slate-500 hover:text-slate-700 transition"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-10 py-3.5 bg-[#4F46E5] text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
          >
            Salvar Dados
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataEntryModal;
