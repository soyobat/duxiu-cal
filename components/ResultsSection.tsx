
import React from 'react';
import { FinancialData, IndexResult, Language } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { translations } from '../utils/i18n';

interface ResultsSectionProps {
  data: FinancialData;
  result: IndexResult;
  language: Language;
  currencySymbol: string;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ data, result, language, currencySymbol }) => {
  const t = translations[language].results;
  const categories = translations[language].input.categories;

  // Prepare chart data based on mode
  let chartData: { name: string; value: number; color: string }[] = [];

  if (data.expenseMode === 'total') {
     if (result.totalExpenses > 0) {
        chartData = [{ 
            name: categories.uncategorized || 'Total Expenses', 
            value: result.totalExpenses, 
            color: '#64748B' 
        }];
     }
  } else {
    chartData = [
        { name: categories.housing, value: data.expenses.housing, color: '#3B82F6' },
        { name: categories.food, value: data.expenses.food, color: '#10B981' },
        { name: categories.transport, value: data.expenses.transport, color: '#F97316' },
        { name: categories.utilities, value: data.expenses.utilities, color: '#EAB308' },
        { name: categories.entertainment, value: data.expenses.entertainment, color: '#A855F7' },
        { name: categories.others, value: data.expenses.others, color: '#64748B' },
      ].filter(item => item.value > 0);
  }

  const hasData = result.totalExpenses > 0 || data.salary > 0;

  const getStatusIcon = () => {
    switch (result.status) {
      case 'Excellent': return <TrendingUp className="w-6 h-6 text-white" />;
      case 'Good': return <CheckCircle className="w-6 h-6 text-white" />;
      case 'Poor': return <AlertTriangle className="w-6 h-6 text-white" />;
      default: return <HelpCircle className="w-6 h-6 text-white" />;
    }
  };

  const getStatusText = () => {
      switch (result.status) {
          case 'Excellent': return t.status.Excellent;
          case 'Good': return t.status.Good;
          case 'Poor': return t.status.Poor;
          default: return t.status.Poor;
      }
  };

  const getStatusLabel = () => {
    switch (result.status) {
        case 'Excellent': return t.status.label_Excellent;
        case 'Good': return t.status.label_Good;
        case 'Poor': return t.status.label_Poor;
        default: return '';
    }
  };

  const getGradient = () => {
      switch (result.status) {
        case 'Excellent': return "from-emerald-500 to-teal-600 shadow-emerald-500/30";
        case 'Good': return "from-blue-500 to-indigo-600 shadow-blue-500/30";
        case 'Poor': return "from-rose-500 to-orange-600 shadow-rose-500/30";
        default: return "from-slate-400 to-slate-500 shadow-slate-400/30";
      }
  };

  return (
    <div className="space-y-4">
      {/* Hero Score Card */}
      <div className={`relative overflow-hidden rounded-[2rem] p-6 text-white shadow-xl bg-gradient-to-br ${getGradient()}`}>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-5 -mb-5"></div>
        
        <div className="relative z-10 flex justify-between items-start">
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{t.scoreTitle}</h3>
                <p className="text-sm opacity-90 mb-4">{hasData ? getStatusText() : t.waitingData}</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tighter">
                        {hasData ? result.index.toFixed(2) : '-.--'}
                    </span>
                    {hasData && (
                        <span className="text-lg font-bold bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                            {getStatusLabel()}
                        </span>
                    )}
                </div>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/10">
                {getStatusIcon()}
            </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-sm">
             <div>
                <span className="block opacity-60 text-xs mb-0.5">{t.totalExpenses}</span>
                <span className="font-bold font-mono">{currencySymbol}{result.totalExpenses.toFixed(0)}</span>
             </div>
             <div className="text-right">
                <span className="block opacity-60 text-xs mb-0.5">{t.balance}</span>
                <span className="font-bold font-mono">{currencySymbol}{(data.salary - result.totalExpenses).toFixed(0)}</span>
             </div>
        </div>
      </div>

      {/* Chart Section */}
      {hasData && chartData.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-6 border border-slate-100 dark:border-slate-700/50">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-6">{t.chartTitle}</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-48 w-48 shrink-0 relative">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={data.expenseMode === 'total' ? 0 : 4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={4}
                    >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value: number) => `${currencySymbol}${value}`}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px 12px' }}
                    />
                </PieChart>
               </ResponsiveContainer>
               {/* Center Text Overlay */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t.chartTop}</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[80px]">
                    {chartData.length > 0 ? chartData.sort((a,b) => b.value - a.value)[0].name : '-'}
                  </span>
               </div>
            </div>
            
            <div className="w-full space-y-3">
                {chartData.sort((a,b) => b.value - a.value).map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{currencySymbol}{item.value}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
