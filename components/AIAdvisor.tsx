
import React, { useState } from 'react';
import { FinancialData, IndexResult, Language } from '../types';
import { generateFinancialAdvice } from '../services/geminiService';
import { Sparkles, Loader2, MessageSquareQuote, ArrowRight, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { translations } from '../utils/i18n';

interface AIAdvisorProps {
  data: FinancialData;
  result: IndexResult;
  apiKey: string;
  language: Language;
  currencySymbol: string;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ data, result, apiKey, language, currencySymbol }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language].advisor;
  const tResults = translations[language].results;

  const hasData = result.totalExpenses > 0 || data.salary > 0;

  const handleGenerateAdvice = async () => {
    if (!hasData) return;
    
    // Allow trying if apiKey is provided (either from settings or env)
    // We pass the settings API key, if it's empty, service falls back to Env
    // But if both are empty, service throws.
    
    setLoading(true);
    setAdvice(null);
    setError(null);

    try {
      const text = await generateFinancialAdvice(data, result, apiKey, language);
      setAdvice(text);
    } catch (err: any) {
      if (err.message === 'MISSING_API_KEY') {
        setError(t.errorApiKey);
      } else {
        setError(t.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hasData) {
     return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6 space-y-6">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-indigo-400" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t.emptyTitle}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.emptyDesc }}>
                </p>
            </div>
        </div>
     );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] shadow-xl border border-indigo-800/50 p-6 text-white relative overflow-hidden min-h-[500px]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 pb-20">
        <div className="flex items-center justify-between mb-8 border-b border-indigo-700/50 pb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            {t.title}
          </h3>
          {!advice && !loading && !error && (
             <button
             onClick={handleGenerateAdvice}
             className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2 animate-pulse active:scale-95"
           >
             {t.startButton}
             <ArrowRight className="w-4 h-4" />
           </button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-indigo-200 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-white" />
            <p className="animate-pulse text-sm font-medium">{t.loadingTitle}</p>
            <p className="text-xs text-indigo-400">{t.loadingDesc}</p>
          </div>
        )}

        {error && (
           <div className="bg-rose-500/10 border border-rose-500/50 rounded-2xl p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-rose-400" />
              </div>
              <p className="text-rose-200 font-medium">{error}</p>
              {!apiKey && (
                  <p className="text-xs text-rose-300 opacity-80">
                      Settings &gt; Gemini API Key
                  </p>
              )}
           </div>
        )}

        {advice && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="prose prose-invert prose-sm max-w-none leading-relaxed text-indigo-100">
              <ReactMarkdown 
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-4 border-b border-indigo-700 pb-2" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg font-semibold text-yellow-300 mt-6 mb-3 flex items-center gap-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-base font-semibold text-white mt-4 mb-2" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 space-y-2 bg-indigo-900/30 p-4 rounded-xl border border-indigo-800/50" {...props} />,
                  li: ({node, ...props}) => <li className="text-indigo-100" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                }}
              >
                {advice}
              </ReactMarkdown>
            </div>
            <div className="pt-6 border-t border-indigo-700/50 flex justify-center">
              <button
                onClick={handleGenerateAdvice}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white rounded-xl transition-all flex items-center gap-2 text-sm font-medium active:scale-95"
              >
                <MessageSquareQuote className="w-4 h-4" />
                {t.regenerate}
              </button>
            </div>
          </div>
        )}

        {!advice && !loading && !error && (
          <div className="space-y-6">
            <div className="bg-indigo-900/40 p-5 rounded-2xl border border-indigo-700/50 backdrop-blur-sm">
                <h4 className="text-white font-semibold mb-3">{t.snapshotTitle}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-indigo-950/30 rounded-xl">
                        <span className="text-indigo-300 block text-xs mb-1">{t.income}</span>
                        <span className="text-white font-mono text-lg font-bold">{currencySymbol}{data.salary}</span>
                    </div>
                    <div className="p-3 bg-indigo-950/30 rounded-xl">
                        <span className="text-indigo-300 block text-xs mb-1">{t.score}</span>
                        <span className={`font-mono text-lg font-bold ${
                            result.status === 'Excellent' ? 'text-emerald-400' : 
                            result.status === 'Good' ? 'text-blue-400' : 'text-rose-400'
                        }`}>{result.index.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <p className="text-indigo-200 text-sm leading-relaxed text-center opacity-80 px-4">
                {t.hint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;
