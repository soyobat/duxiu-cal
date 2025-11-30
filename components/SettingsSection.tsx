
import React, { useState } from 'react';
import { AppSettings, Language, Theme, Currency, HistoryRecord } from '../types';
import { translations } from '../utils/i18n';
import { Moon, Sun, Globe, Key, Trash2, Info, ChevronRight, Coins, Eye, EyeOff, Database, Download, Upload, Copy, Check } from 'lucide-react';

interface SettingsSectionProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
  onClearData: () => void;
  history: HistoryRecord[];
  onImportHistory: (history: HistoryRecord[]) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ settings, onUpdate, onClearData, history, onImportHistory }) => {
  const t = translations[settings.language].settings;
  const [showApiKey, setShowApiKey] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...settings, apiKey: e.target.value });
  };

  const handleLanguageChange = (lang: Language) => {
    onUpdate({ ...settings, language: lang });
  };

  const handleThemeChange = (theme: Theme) => {
    onUpdate({ ...settings, theme: theme });
  };
  
  const handleCurrencyChange = (currency: Currency) => {
    onUpdate({ ...settings, currency: currency });
  };

  const handleClearData = () => {
    if (window.confirm(t.clearDataConfirm)) {
      onClearData();
      alert(t.clearDataSuccess);
    }
  };

  const handleExportFile = () => {
    const backup = {
      version: 1,
      timestamp: Date.now(),
      history,
      settings
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Duxiu_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyData = async () => {
    const backup = {
      version: 1,
      timestamp: Date.now(),
      history,
      settings
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(backup, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Basic validation
        if (json.history && Array.isArray(json.history)) {
           if (window.confirm(t.importConfirm)) {
             onImportHistory(json.history);
             if (json.settings) {
                // Merge settings to avoid breaking changes if keys are missing in old backups
                onUpdate({...settings, ...json.settings});
             }
             alert(t.importSuccess);
           }
        } else {
            alert(t.importError);
        }
      } catch (err) {
        alert(t.importError);
        console.error(err);
      }
      // Reset input value so same file can be selected again if needed
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6"> {/* Padding bottom is handled by main container's pb-safe-nav */}
      
      {/* API Key Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-5 border border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
            <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{t.apiKeyTitle}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">{t.apiKeyDesc}</p>
          </div>
        </div>
        
        <div className="relative">
          <input 
            type={showApiKey ? "text" : "password"}
            value={settings.apiKey}
            onChange={handleApiKeyChange}
            placeholder={t.apiKeyPlaceholder}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
            autoCorrect="off" 
            autoCapitalize="off" 
            autoComplete="off"
            spellCheck="false"
            enterKeyHint="done"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Data Backup & Restore */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none p-5 border border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-xl">
                <Database className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{t.dataTitle}</h3>
            </div>
        </div>

        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={handleExportFile}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                >
                    <Download className="w-5 h-5 text-indigo-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.exportButton}</span>
                </button>

                <button 
                    onClick={handleCopyData}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
                >
                    {copySuccess ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-500" />}
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {copySuccess ? t.copySuccess : t.copyButton}
                    </span>
                </button>
            </div>

            <div className="relative">
                 <input 
                    type="file" 
                    id="backup-upload" 
                    className="hidden" 
                    accept=".json" 
                    onChange={handleImportFile}
                />
                <label 
                    htmlFor="backup-upload"
                    className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">{t.importButton}</span>
                </label>
            </div>
        </div>
      </div>

      {/* Appearance & Language & Currency */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-700/50 overflow-hidden">
        <div className="p-5 border-b border-slate-50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800">
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.appearanceTitle}</h3>
        </div>

        {/* Theme Toggle */}
        <div className="p-5 border-b border-slate-50 dark:border-slate-700/50 flex items-center justify-between min-h-[56px]">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                    {settings.theme === 'light' ? 
                        <Sun className="w-5 h-5 text-orange-500" /> : 
                        <Moon className="w-5 h-5 text-indigo-400" />
                    }
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {settings.theme === 'light' ? t.themeLight : t.themeDark}
                </span>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
                <button 
                    onClick={() => handleThemeChange('light')}
                    className={`p-2 rounded-md transition-all ${settings.theme === 'light' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-400'}`}
                >
                    <Sun className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => handleThemeChange('dark')}
                    className={`p-2 rounded-md transition-all ${settings.theme === 'dark' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-400'}`}
                >
                    <Moon className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Currency Selector */}
        <div className="p-5 border-b border-slate-50 dark:border-slate-700/50">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t.currencyTitle}</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {(['CNY', 'USD', 'EUR', 'JPY', 'GBP'] as Currency[]).map(currency => (
                    <button
                        key={currency}
                        onClick={() => handleCurrencyChange(currency)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 min-h-[44px] min-w-[50px] ${
                            settings.currency === currency 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/20' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        {currency}
                    </button>
                ))}
            </div>
        </div>

        {/* Language Selector */}
        <div className="p-5">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t.languageTitle}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {(['zh', 'en', 'ja'] as Language[]).map(lang => (
                    <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 min-h-[44px] ${
                            settings.language === lang 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        {lang === 'zh' ? '中文' : lang === 'en' ? 'English' : '日本語'}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* About & Data */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-700/50 overflow-hidden">
        <div className="p-5 border-b border-slate-50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-800">
          <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t.aboutTitle}</h3>
        </div>
        
        <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            <div className="p-5 flex items-center justify-between min-h-[56px]">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                        <Info className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t.version}</span>
                </div>
            </div>

            <button 
                onClick={handleClearData}
                className="w-full p-5 flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors group min-h-[56px]"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 dark:bg-rose-900/30 rounded-xl group-hover:bg-rose-100 dark:group-hover:bg-rose-900/50 transition-colors">
                        <Trash2 className="w-5 h-5 text-rose-500" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{t.clearData}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            </button>
        </div>
      </div>

    </div>
  );
};

export default SettingsSection;
