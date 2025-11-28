
import React, { useState, useEffect, useMemo } from 'react';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import AIAdvisor from './components/AIAdvisor';
import TrendSection from './components/TrendSection';
import SettingsSection from './components/SettingsSection';
import { FinancialData, IndexResult, HistoryRecord, AppSettings } from './types';
import { BarChart3, Calculator, LineChart, Sparkles, Settings as SettingsIcon } from 'lucide-react';
import { translations, CURRENCY_SYMBOLS } from './utils/i18n';

const STORAGE_KEY = 'duxiu_history_v1';
const SETTINGS_KEY = 'duxiu_settings_v1';

const INITIAL_DATA: FinancialData = {
  salary: 0,
  expenseMode: 'detailed',
  totalExpenseInput: 0,
  expenses: {
    housing: 0,
    food: 0,
    transport: 0,
    utilities: 0,
    entertainment: 0,
    others: 0
  }
};

type Tab = 'calculator' | 'trends' | 'advisor' | 'settings';

const App: React.FC = () => {
  // Current Date Helper
  const getCurrentMonth = () => new Date().toISOString().slice(0, 7); // YYYY-MM

  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [data, setData] = useState<FinancialData>(INITIAL_DATA);

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // New State: Tracks if we are editing an existing historical record
  const [isEditing, setIsEditing] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    language: 'zh',
    theme: 'light',
    currency: 'CNY'
  });

  // Load settings
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply Theme & Status Bar Color
  useEffect(() => {
    // 1. Apply CSS Class
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // 2. Sync Meta Theme Color for Notch/Status Bar
    // We match the header color: White for light mode, Slate-900 for dark mode
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const color = settings.theme === 'dark' ? '#0f172a' : '#ffffff'; 
      metaThemeColor.setAttribute('content', color);
    }
  }, [settings.theme]);

  // Load history from localStorage or set initial dummy data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    } else {
      // Mock Data for Demo
      const mockHistory: HistoryRecord[] = [
        {
          id: 'mock-1',
          month: '2023-08',
          timestamp: Date.now() - 5184000000,
          data: { 
            salary: 12000, 
            expenseMode: 'detailed',
            totalExpenseInput: 8000,
            expenses: { housing: 4000, food: 2000, transport: 500, utilities: 300, entertainment: 1000, others: 200 } 
          },
          result: { index: 1.5, totalExpenses: 8000, status: 'Good', color: 'text-blue-600' }
        },
        {
          id: 'mock-2',
          month: '2023-09',
          timestamp: Date.now() - 2592000000,
          data: { 
            salary: 12000, 
            expenseMode: 'detailed',
            totalExpenseInput: 8800,
            expenses: { housing: 4000, food: 2200, transport: 500, utilities: 400, entertainment: 1200, others: 500 } 
          },
          result: { index: 1.36, totalExpenses: 8800, status: 'Good', color: 'text-blue-600' }
        },
        {
          id: 'mock-3',
          month: '2023-10',
          timestamp: Date.now(),
          data: { 
            salary: 13000, 
            expenseMode: 'detailed',
            totalExpenseInput: 7600,
            expenses: { housing: 4000, food: 1800, transport: 500, utilities: 300, entertainment: 800, others: 200 } 
          },
          result: { index: 1.71, totalExpenses: 7600, status: 'Good', color: 'text-blue-600' }
        }
      ];
      setHistory(mockHistory);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  const result = useMemo<IndexResult>(() => {
    let totalExpenses = 0;
    
    // Calculate based on mode
    if (data.expenseMode === 'total') {
        totalExpenses = data.totalExpenseInput;
    } else {
        totalExpenses = (Object.values(data.expenses) as number[]).reduce((a, b) => a + b, 0);
    }
    
    const index = totalExpenses === 0 ? (data.salary > 0 ? 100 : 0) : data.salary / totalExpenses;
    
    const safeIndex = totalExpenses === 0 && data.salary > 0 ? 100 : index;

    let status: IndexResult['status'] = 'Poor';
    let color = 'text-rose-600';

    if (safeIndex >= 2) {
      status = 'Excellent';
      color = 'text-emerald-600';
    } else if (safeIndex >= 1) {
      status = 'Good';
      color = 'text-blue-600';
    }

    if (data.salary === 0 && totalExpenses === 0) {
        color = 'text-slate-300';
    }

    return {
      index: safeIndex,
      totalExpenses,
      status,
      color
    };
  }, [data]);

  const handleSave = () => {
    const t = translations[settings.language].input;
    if (result.totalExpenses === 0 && data.salary === 0) {
      alert(t.enterDataAlert);
      return;
    }

    const newRecord: HistoryRecord = {
      id: `${selectedMonth}`, // ID is now just the month, enforcing one record per month
      month: selectedMonth,
      data: { ...data },
      result: { ...result },
      timestamp: Date.now()
    };

    setHistory(prev => {
      // Remove any existing record for this month
      const filtered = prev.filter(r => r.month !== selectedMonth);
      return [...filtered, newRecord].sort((a, b) => a.month.localeCompare(b.month));
    });
    
    alert(t.saveSuccess);
    
    // After saving, we treat it as "editing" this month
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    const t = translations[settings.language].trends;
    if (window.confirm(t.deleteConfirm)) {
      setHistory(prev => prev.filter(r => r.id !== id));
      
      // If we deleted the current month being viewed, reset input
      if (id === selectedMonth) {
          setData(INITIAL_DATA);
          setIsEditing(false);
      }
    }
  };

  const handleLoad = (record: HistoryRecord) => {
    const loadedData: FinancialData = {
        salary: record.data.salary,
        expenseMode: record.data.expenseMode || 'detailed',
        totalExpenseInput: record.data.totalExpenseInput || 0,
        expenses: record.data.expenses
    };
    
    setData(loadedData);
    setSelectedMonth(record.month);
    setIsEditing(true); // Lock the month input (conceptually, but user can now switch away)
    setActiveTab('calculator'); 
  };
  
  // New Logic: Allow switching months freely. 
  // If target month has data, load it. If not, keep current inputs but treat as new record.
  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
    
    const existingRecord = history.find(h => h.month === newMonth);
    if (existingRecord) {
        // Automatically load existing data for this month and switch to editing mode
        const loadedData: FinancialData = {
            salary: existingRecord.data.salary,
            expenseMode: existingRecord.data.expenseMode || 'detailed',
            totalExpenseInput: existingRecord.data.totalExpenseInput || 0,
            expenses: existingRecord.data.expenses
        };
        setData(loadedData);
        setIsEditing(true);
    } else {
        // Month has no data. Keep current inputs (as a template) but switch to "New" mode.
        setIsEditing(false);
    }
  };

  const handleResetData = () => {
    const t = translations[settings.language].input;
    if (window.confirm(t.resetConfirm)) {
      setData(INITIAL_DATA);
      setSelectedMonth(getCurrentMonth());
      setIsEditing(false);
    }
  };

  const handleCreateNew = () => {
      // Explicit action to create a new record
      setData(INITIAL_DATA);
      setSelectedMonth(getCurrentMonth());
      setIsEditing(false);
      setActiveTab('calculator');
  };

  const handleClearData = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    setData(INITIAL_DATA);
    setIsEditing(false);
  };

  // Translation Helper
  const t = translations[settings.language];
  const currencySymbol = CURRENCY_SYMBOLS[settings.currency];

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      
      {/* Top Navigation / Header - Floating Glass with Safe Area Top Padding */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 pt-safe transition-all duration-300">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg shadow-sm shadow-indigo-500/30">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              {t.appTitle}
            </h1>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
               {activeTab === 'calculator' ? t.tabs.calculator : activeTab === 'trends' ? t.tabs.trends : activeTab === 'advisor' ? t.tabs.advisor : t.tabs.settings}
             </span>
          </div>
        </div>
      </header>

      {/* Main Content Area with Safe Area aware padding */}
      <main className="flex-1 overflow-y-auto overscroll-y-contain pt-safe-header pb-safe-nav scroll-smooth touch-pan-y">
        <div className="max-w-md mx-auto p-4 space-y-6">
          
          {/* TAB 1: CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ResultsSection 
                data={data} 
                result={result} 
                language={settings.language} 
                currencySymbol={currencySymbol}
              />
               <InputSection 
                data={data} 
                onChange={setData} 
                selectedMonth={selectedMonth}
                onMonthChange={handleMonthChange}
                onSave={handleSave}
                onReset={handleResetData}
                isEditing={isEditing}
                language={settings.language}
                currencySymbol={currencySymbol}
              />
            </div>
          )}

          {/* TAB 2: TRENDS */}
          {activeTab === 'trends' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <TrendSection 
                history={history} 
                onDelete={handleDelete} 
                onLoad={handleLoad} 
                onCreateNew={handleCreateNew}
                language={settings.language}
                currencySymbol={currencySymbol}
              />
            </div>
          )}

          {/* TAB 3: ADVISOR */}
          {activeTab === 'advisor' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AIAdvisor 
                data={data} 
                result={result} 
                apiKey={settings.apiKey} 
                language={settings.language} 
                currencySymbol={currencySymbol}
              />
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SettingsSection settings={settings} onUpdate={setSettings} onClearData={handleClearData} />
            </div>
          )}

        </div>
      </main>

      {/* Bottom Navigation Bar - Floating Glass with Safe Area Bottom Padding */}
      <nav className="fixed bottom-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/60 pb-safe z-50 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.03)] dark:shadow-none transition-colors duration-300">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          
          <NavButton 
            id="calculator" 
            activeId={activeTab} 
            onClick={setActiveTab} 
            icon={Calculator} 
            label={t.tabs.calculator} 
          />
          <NavButton 
            id="trends" 
            activeId={activeTab} 
            onClick={setActiveTab} 
            icon={LineChart} 
            label={t.tabs.trends} 
          />
          <NavButton 
            id="advisor" 
            activeId={activeTab} 
            onClick={setActiveTab} 
            icon={Sparkles} 
            label={t.tabs.advisor} 
          />
          <NavButton 
            id="settings" 
            activeId={activeTab} 
            onClick={setActiveTab} 
            icon={SettingsIcon} 
            label={t.tabs.settings} 
          />

        </div>
      </nav>
    </div>
  );
};

const NavButton: React.FC<{id: Tab, activeId: Tab, onClick: (id: Tab) => void, icon: any, label: string}> = ({ id, activeId, onClick, icon: Icon, label }) => (
    <button 
    onClick={() => onClick(id)}
    className={`flex flex-col items-center justify-center w-full h-full transition-all active:scale-95 group ${
      activeId === id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-300'
    }`}
  >
    <div className={`mb-1 transition-transform duration-300 ${activeId === id ? '-translate-y-0.5' : ''}`}>
       <Icon className={`w-6 h-6 ${activeId === id ? 'fill-indigo-600/20 dark:fill-indigo-400/20 stroke-[2.5px]' : 'stroke-2'}`} />
    </div>
    <span className="text-xs font-bold tracking-wide">{label}</span>
  </button>
);

export default App;
