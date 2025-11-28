
import React from 'react';
import { HistoryRecord, Language } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Trash2, Calendar, FileQuestion, ChevronRight, MoreHorizontal, Plus } from 'lucide-react';
import { translations } from '../utils/i18n';

interface TrendSectionProps {
  history: HistoryRecord[];
  onDelete: (id: string) => void;
  onLoad: (record: HistoryRecord) => void;
  onCreateNew: () => void;
  language: Language;
  currencySymbol: string;
}

const TrendSection: React.FC<TrendSectionProps> = ({ history, onDelete, onLoad, onCreateNew, language, currencySymbol }) => {
  const t = translations[language].trends;
  const tResults = translations[language].results;

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-8 relative">
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-6 animate-in zoom-in duration-500">
          <FileQuestion className="w-12 h-12 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t.emptyTitle}</h3>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: t.emptyDesc }}>
        </p>

        <button 
            onClick={onCreateNew}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 flex items-center gap-2 transition-all active:scale-95"
        >
            <Plus className="w-5 h-5" />
            {translations[language].input.resetButton}
        </button>
      </div>
    );
  }

  const sortedHistory = [...history].sort((a, b) => a.month.localeCompare(b.month));

  const chartData = sortedHistory.map(record => ({
    month: record.month, // Use full YYYY-MM string
    fullMonth: record.month,
    income: record.data.salary,
    totalExpenses: record.result.totalExpenses,
    index: record.result.index,
    status: record.result.status,
    id: record.id
  }));

  const getStatusLabel = (status: string) => {
    switch (status) {
        case 'Excellent': return tResults.status.label_Excellent;
        case 'Good': return tResults.status.label_Good;
        case 'Poor': return tResults.status.label_Poor;
        default: return '';
    }
  };

  return (
    <div className="space-y-6"> {/* Padding bottom is handled by main container's pb-safe-nav */}
      
      {/* Chart Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-6 border border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-2 mb-6">
           <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
             <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
           </div>
           <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t.title}</h2>
        </div>

        <div className="h-56 w-full -ml-2">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-700" />
                <XAxis 
                  dataKey="month" 
                  tick={{fontSize: 10, fill: '#94a3b8'}} 
                  axisLine={false} 
                  tickLine={false} 
                  interval="preserveStartEnd" 
                  tickMargin={10}
                  tickFormatter={(value) => {
                    // Format YYYY-MM to YY/MM for compactness
                    if (typeof value === 'string' && value.includes('-')) {
                        const [year, month] = value.split('-');
                        return `${year.slice(2)}/${month}`;
                    }
                    return value;
                  }}
                />
                <YAxis hide />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                    itemStyle={{ color: '#1e293b' }}
                    formatter={(value: number) => value.toFixed(2)}
                    labelStyle={{ color: '#64748B', marginBottom: '4px', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="index" 
                  stroke="#4F46E5" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorIndex)" 
                />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* History List (Mobile Cards) */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2">{t.historyTitle}</h3>
        <div className="space-y-3">
            {sortedHistory.slice().reverse().map((record) => (
                <div 
                  key={record.id} 
                  onClick={() => onLoad(record)}
                  className="group bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-between min-h-[80px]"
                >
                    <div className="flex items-center gap-4">
                        {/* Status Indicator */}
                        <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center border-2 ${
                            record.result.status === 'Excellent' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' :
                            record.result.status === 'Good' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400' :
                            'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                        }`}>
                            <span className="text-sm font-black">{record.result.index.toFixed(1)}</span>
                        </div>
                        
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">{record.month}</h4>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    record.result.status === 'Excellent' ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' :
                                    record.result.status === 'Good' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' :
                                    'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'
                                }`}>
                                    {getStatusLabel(record.result.status)}
                                </span>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex gap-3">
                                <span>{t.income} <span className="font-medium text-slate-700 dark:text-slate-200">{currencySymbol}{record.data.salary}</span></span>
                                <span>{t.expense} <span className="font-medium text-slate-700 dark:text-slate-200">{currencySymbol}{record.result.totalExpenses}</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                         <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(record.id);
                            }}
                            className="w-12 h-12 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 active:bg-rose-50 dark:active:bg-rose-900/20 rounded-full transition-colors"
                         >
                            <Trash2 className="w-5 h-5 pointer-events-none" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Floating Add Button for Trends Page */}
      <div 
        className="fixed z-40 px-4 pointer-events-none"
        style={{ right: '0', bottom: 'calc(4rem + env(safe-area-inset-bottom) + 1.5rem)' }}
      >
        <button
            onClick={onCreateNew}
            className="w-14 h-14 rounded-full bg-slate-900 dark:bg-indigo-600 text-white shadow-xl shadow-slate-900/30 dark:shadow-indigo-600/30 pointer-events-auto flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
            <Plus className="w-7 h-7" />
        </button>
      </div>

    </div>
  );
};

export default TrendSection;
