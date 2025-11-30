
import React, { useState } from 'react';
import { AppSettings, Language, Theme, Currency } from '../types';
import { translations } from '../utils/i18n';
import { Moon, Sun, Globe, Key, Trash2, Info, ChevronRight, Coins, Eye, EyeOff } from 'lucide-react';

interface SettingsSectionProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
  onClearData: () => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ settings, onUpdate, onClearData }) => {
  const t = translations[settings.language].settings;
  const [showApiKey, setShowApiKey] = useState(false);

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
