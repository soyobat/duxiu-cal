
import React from 'react';
import { FinancialData, Language } from '../types';
import { Wallet, Home, ShoppingCart, Car, Zap, Coffee, ShoppingBag, Save, Calendar, ChevronRight, Layers, CreditCard, RotateCcw } from 'lucide-react';
import { translations } from '../utils/i18n';

interface InputSectionProps {
  data: FinancialData;
  onChange: (newData: FinancialData) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onSave: () => void;
  onReset: () => void;
  isEditing: boolean;
  language: Language;
  currencySymbol: string;
}

const InputSection: React.FC<InputSectionProps> = ({ data, onChange, selectedMonth, onMonthChange, onSave, onReset, isEditing, language, currencySymbol }) => {
  const t = translations[language].input;

  // Format month for display based on language
  const formatMonthDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + '-01'); // Append day to make it valid
    if (isNaN(date.getTime())) return dateStr;

    if (language === 'zh' || language === 'ja') {
        return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    } else {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  const handleExpenseChange = (key: keyof FinancialData['expenses'], value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    onChange({
      ...data,
      expenses: {
        ...data.expenses,
        [key]: numValue
      }
    });
  };

  const handleTotalExpenseChange = (value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    onChange({
      ...data,
      totalExpenseInput: numValue
    });
  };

  const handleSalaryChange = (value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    onChange({
      ...data,
      salary: numValue
    });
  };

  const toggleMode = (mode: 'detailed' | 'total') => {
    onChange({
      ...data,
      expenseMode: mode
    });
  };

  return (
    <div className="space-y-6"> {/* Bottom padding is handled by main container's pb-safe-nav */}
      
      {/* Date & Income Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-5 border border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50 relative">
             <div className="flex items-center gap-3">
               <div className="p-2 rounded-xl transition-colors bg-slate-100 dark:bg-slate-700">
                 <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-300" />
               </div>
               <div>
                 <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{t.monthLabel}</p>
                 <div className="relative">
                   {/* Visual Text Layer */}
                   <span className="block font-bold text-sm pointer-events-none absolute inset-0 z-10 bg-white dark:bg-slate-800 pt-0.5 whitespace-nowrap text-slate-800 dark:text-slate-100">
                     {formatMonthDisplay(selectedMonth)}
                   </span>
                   {/* Hidden Real Input */}
                   <input 
                    type="month" 
                    value={selectedMonth}
                    onChange={(e) => onMonthChange(e.target.value)}
                    className="opacity-0 relative z-20 w-32 h-6 cursor-pointer"
                   />
                 </div>
               </div>
               <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 -ml-1" />
             </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
            <Wallet className="w-4 h-4 text-indigo-500" />
            {t.incomeLabel}
          </label>
          <div className="flex items-baseline gap-1 relative">
             <span className="text-2xl font-semibold text-slate-400 dark:text-slate-600 absolute left-0 top-1.5">{currencySymbol}</span>
             <input
              type="number"
              inputMode="decimal"
              enterKeyHint="done"
              min="0"
              value={data.salary || ''}
              onChange={(e) => handleSalaryChange(e.target.value)}
              placeholder={t.placeholder}
              className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl py-4 pl-8 pr-4 text-3xl font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:bg-indigo-50/10 outline-none transition-all placeholder:text-slate-200 dark:placeholder:text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-700/50 overflow-hidden">
        
        {/* Card Header with Toggle */}
        <div className="p-5 border-b border-slate-50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              {t.expensesTitle}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t.expensesSubtitle}</p>
          </div>

          {/* Mode Switcher */}
          <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-xl flex items-center">
             <button
                onClick={() => toggleMode('detailed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  data.expenseMode === 'detailed' 
                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
             >
               {t.modeDetailed}
             </button>
             <button
                onClick={() => toggleMode('total')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  data.expenseMode === 'total' 
                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
             >
               {t.modeTotal}
             </button>
          </div>
        </div>
        
        {/* Conditional Content based on Mode */}
        {data.expenseMode === 'total' ? (
           <div className="p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
                <CreditCard className="w-4 h-4 text-rose-500" />
                {t.totalExpenseLabel}
              </label>
              <div className="flex items-baseline gap-1 relative">
                 <span className="text-2xl font-semibold text-slate-400 dark:text-slate-600 absolute left-0 top-1.5">{currencySymbol}</span>
                 <input
                  type="number"
                  inputMode="decimal"
                  enterKeyHint="done"
                  min="0"
                  value={data.totalExpenseInput || ''}
                  onChange={(e) => handleTotalExpenseChange(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl py-4 pl-8 pr-4 text-3xl font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-rose-500/20 focus:bg-rose-50/10 outline-none transition-all placeholder:text-slate-200 dark:placeholder:text-slate-700"
                />
              </div>
           </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            <ExpenseRow 
              icon={<Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />} 
              label={t.categories.housing} 
              value={data.expenses.housing} 
              onChange={(v) => handleExpenseChange('housing', v)} 
              bg="bg-blue-100 dark:bg-blue-900/30"
              currencySymbol={currencySymbol}
            />
            <ExpenseRow 
              icon={<ShoppingCart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />} 
              label={t.categories.food} 
              value={data.expenses.food} 
              onChange={(v) => handleExpenseChange('food', v)} 
              bg="bg-emerald-100 dark:bg-emerald-900/30"
              currencySymbol={currencySymbol}
            />
            <ExpenseRow 
              icon={<Car className="w-5 h-5 text-orange-600 dark:text-orange-400" />} 
              label={t.categories.transport} 
              value={data.expenses.transport} 
              onChange={(v) => handleExpenseChange('transport', v)} 
              bg="bg-orange-100 dark:bg-orange-900/30"
              currencySymbol={currencySymbol}
            />
            <ExpenseRow 
              icon={<Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />} 
              label={t.categories.utilities} 
              value={data.expenses.utilities} 
              onChange={(v) => handleExpenseChange('utilities', v)} 
              bg="bg-yellow-100 dark:bg-yellow-900/30"
              currencySymbol={currencySymbol}
            />
            <ExpenseRow 
              icon={<Coffee className="w-5 h-5 text-purple-600 dark:text-purple-400" />} 
              label={t.categories.entertainment} 
              value={data.expenses.entertainment} 
              onChange={(v) => handleExpenseChange('entertainment', v)} 
              bg="bg-purple-100 dark:bg-purple-900/30"
              currencySymbol={currencySymbol}
            />
            <ExpenseRow 
              icon={<ShoppingBag className="w-5 h-5 text-slate-600 dark:text-slate-400" />} 
              label={t.categories.others} 
              value={data.expenses.others} 
              onChange={(v) => handleExpenseChange('others', v)} 
              bg="bg-slate-100 dark:bg-slate-700"
              currencySymbol={currencySymbol}
            />
          </div>
        )}
      </div>

      {/* 
         SPACER: Crucial for Safe Area Adaptation.
         This ensures the last input field scrolls ABOVE the floating Save button.
         Height = Floating Button Height (~4rem) + Breathing Room (2rem) + Safe Area buffer 
      */}
      <div className="h-24 w-full" aria-hidden="true"></div>

      {/* Floating Action Area - Positioned above Nav Bar with Safe Area */}
      {/* Formula: Bottom = NavHeight(4rem) + SafeBottom + 1rem Gap */}
      <div 
        className="fixed left-0 right-0 z-40 px-4 pointer-events-none"
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom) + 1rem)' }}
      >
        <div className="max-w-md mx-auto pointer-events-auto flex items-center gap-3">
             {/* Small Circular Reset Button */}
             <button 
                onClick={onReset}
                className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 flex items-center justify-center transition-all active:scale-90 active:bg-rose-50 dark:active:bg-rose-900/20"
                title={t.resetButton}
             >
                <RotateCcw className="w-6 h-6 stroke-[2.5px]" />
             </button>

             {/* Main Save Button */}
             <button 
             onClick={onSave}
             className="flex-1 h-14 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 active:scale-95 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 dark:shadow-indigo-900/30 flex items-center justify-center gap-2 transition-all"
           >
             <Save className="w-5 h-5" />
             {t.saveButton}
           </button>
        </div>
      </div>

    </div>
  );
};

interface ExpenseRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (val: string) => void;
  bg: string;
  currencySymbol: string;
}

// Changed from div to label for better touch handling (clicking text focuses input)
const ExpenseRow: React.FC<ExpenseRowProps> = ({ icon, label, value, onChange, bg, currencySymbol }) => (
  <label className="flex items-center p-4 active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors cursor-pointer min-h-[56px]">
    <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center mr-4 shrink-0`}>
      {icon}
    </div>
    <div className="flex-1 mr-4">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 block">{label}</span>
    </div>
    <div className="relative w-28">
      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 text-sm font-medium">{currencySymbol}</span>
      <input
        type="number"
        inputMode="decimal"
        enterKeyHint="done"
        min="0"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full py-2 pl-4 text-right bg-transparent focus:bg-slate-50 dark:focus:bg-slate-700/50 rounded-lg outline-none font-bold text-slate-800 dark:text-white text-lg placeholder:text-slate-200 dark:placeholder:text-slate-700 transition-colors"
      />
    </div>
  </label>
);

export default InputSection;
