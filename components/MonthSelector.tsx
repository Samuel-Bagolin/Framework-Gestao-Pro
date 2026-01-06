
import React from 'react';
import { MonthOption } from '../types';

interface MonthSelectorProps {
  currentMonth: string;
  availableMonths: MonthOption[];
  onMonthChange: (month: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ currentMonth, availableMonths, onMonthChange }) => {
  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition">
        <i className="far fa-calendar-alt text-slate-400"></i>
        <select 
          value={currentMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="bg-transparent text-sm font-semibold text-slate-700 outline-none appearance-none pr-8 cursor-pointer"
        >
          {availableMonths.map(m => (
            <option key={m.key} value={m.key}>{m.name}</option>
          ))}
        </select>
        <i className="fas fa-chevron-down text-slate-300 text-[10px] absolute right-3 pointer-events-none"></i>
      </div>
    </div>
  );
};

export default MonthSelector;
