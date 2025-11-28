
import { Language, Currency } from '../types';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  JPY: '¥',
  GBP: '£'
};

export const translations = {
  zh: {
    appTitle: '独秀指数',
    tabs: {
      calculator: '计算',
      trends: '趋势',
      advisor: '顾问',
      settings: '设置'
    },
    input: {
      monthLabel: '核算月份',
      incomeLabel: '月税后收入',
      expensesTitle: '生活开支',
      expensesSubtitle: '请输入各项生活成本',
      modeDetailed: '细分项',
      modeTotal: '总额',
      totalExpenseLabel: '月总支出',
      saveButton: '保存本月记录',
      resetButton: '重置 / 新建',
      resetConfirm: '确定要清空所有输入并开始新记录吗？',
      placeholder: '0',
      categories: {
        housing: '房租 / 房贷',
        food: '餐饮食品',
        transport: '交通出行',
        utilities: '水电煤网',
        entertainment: '休闲娱乐',
        others: '其他杂项',
        uncategorized: '未分类支出'
      },
      saveSuccess: '已保存记录！',
      enterDataAlert: '请先输入数据',
    },
    results: {
      scoreTitle: '独秀指数',
      waitingData: '等待数据输入...',
      status: {
        Excellent: '财务状况极佳',
        Good: '财务状况健康',
        Poor: '存在财务压力',
        label_Excellent: '优秀',
        label_Good: '良好',
        label_Poor: '欠佳'
      },
      totalExpenses: '月总支出',
      balance: '月结余',
      chartTitle: '支出构成',
      chartTop: 'Top'
    },
    trends: {
      emptyTitle: '暂无历史记录',
      emptyDesc: '请在“计算”页面保存您的月度数据，<br/>这里将为您生成精美的财务趋势图。',
      title: '趋势概览',
      historyTitle: '历史记录',
      income: '收',
      expense: '支',
      deleteConfirm: '确定要删除这条记录吗？'
    },
    advisor: {
      title: 'AI 财务顾问',
      emptyTitle: 'AI 财务顾问就绪',
      emptyDesc: '请先在计算器页面输入您的收入和支出数据，<br/>AI 才能为您提供个性化分析。',
      startButton: '开始分析',
      loadingTitle: '正在分析您的财务模型...',
      loadingDesc: '这通常需要几秒钟',
      regenerate: '重新生成分析',
      snapshotTitle: '当前数据快照',
      income: '月收入',
      score: '独秀指数',
      hint: '点击上方按钮，AI 将基于上述数据为您生成 3 条切实可行的财务改进建议。',
      errorApiKey: '缺少 API Key。请在设置页面配置您的 Gemini API Key 以使用此功能。',
      errorGeneric: '抱歉，目前无法生成建议。请稍后再试。'
    },
    settings: {
      title: '设置',
      apiKeyTitle: 'Gemini API Key',
      apiKeyDesc: '用于启用 AI 财务顾问功能',
      apiKeyPlaceholder: '粘贴您的 API Key',
      appearanceTitle: '外观',
      languageTitle: '语言',
      themeLight: '浅色模式',
      themeDark: '深色模式',
      currencyTitle: '货币单位',
      aboutTitle: '关于',
      version: '版本 v1.1.0',
      clearData: '清除所有数据',
      clearDataConfirm: '确定要清除所有本地存储的数据吗？此操作无法撤销。',
      clearDataSuccess: '所有数据已清除'
    }
  },
  en: {
    appTitle: 'Duxiu Index',
    tabs: {
      calculator: 'Calc',
      trends: 'Trends',
      advisor: 'Advisor',
      settings: 'Settings'
    },
    input: {
      monthLabel: 'Month',
      incomeLabel: 'Monthly Income (Net)',
      expensesTitle: 'Expenses',
      expensesSubtitle: 'Enter your living costs',
      modeDetailed: 'Detailed',
      modeTotal: 'Total',
      totalExpenseLabel: 'Total Expenses',
      saveButton: 'Save Record',
      resetButton: 'New / Reset',
      resetConfirm: 'Are you sure you want to clear all inputs and start a new record?',
      placeholder: '0',
      categories: {
        housing: 'Housing',
        food: 'Food',
        transport: 'Transport',
        utilities: 'Utilities',
        entertainment: 'Entertainment',
        others: 'Others',
        uncategorized: 'Uncategorized'
      },
      saveSuccess: 'Record saved!',
      enterDataAlert: 'Please enter data first',
    },
    results: {
      scoreTitle: 'Duxiu Index',
      waitingData: 'Waiting for input...',
      status: {
        Excellent: 'Excellent Financial Health',
        Good: 'Good Financial Health',
        Poor: 'Financial Pressure',
        label_Excellent: 'Excellent',
        label_Good: 'Good',
        label_Poor: 'Poor'
      },
      totalExpenses: 'Total Expenses',
      balance: 'Balance',
      chartTitle: 'Composition',
      chartTop: 'Top'
    },
    trends: {
      emptyTitle: 'No History',
      emptyDesc: 'Save your monthly data in the Calculator tab<br/>to generate financial trend charts.',
      title: 'Trend Overview',
      historyTitle: 'History',
      income: 'In',
      expense: 'Out',
      deleteConfirm: 'Are you sure you want to delete this record?'
    },
    advisor: {
      title: 'AI Advisor',
      emptyTitle: 'AI Advisor Ready',
      emptyDesc: 'Please enter your income and expenses in the Calculator tab<br/>for personalized AI analysis.',
      startButton: 'Analyze',
      loadingTitle: 'Analyzing your model...',
      loadingDesc: 'This usually takes a few seconds',
      regenerate: 'Regenerate',
      snapshotTitle: 'Current Snapshot',
      income: 'Income',
      score: 'Index',
      hint: 'Click the button above for 3 actionable financial tips based on your data.',
      errorApiKey: 'Missing API Key. Please configure your Gemini API Key in Settings.',
      errorGeneric: 'Sorry, unable to generate advice at the moment.'
    },
    settings: {
      title: 'Settings',
      apiKeyTitle: 'Gemini API Key',
      apiKeyDesc: 'Required for AI Advisor features',
      apiKeyPlaceholder: 'Paste your API Key here',
      appearanceTitle: 'Appearance',
      languageTitle: 'Language',
      themeLight: 'Light Mode',
      themeDark: 'Dark Mode',
      currencyTitle: 'Currency',
      aboutTitle: 'About',
      version: 'Version v1.1.0',
      clearData: 'Clear All Data',
      clearDataConfirm: 'Are you sure? This will remove all local data.',
      clearDataSuccess: 'All data cleared'
    }
  },
  ja: {
    appTitle: '独秀指数',
    tabs: {
      calculator: '計算',
      trends: '推移',
      advisor: 'AI助言',
      settings: '設定'
    },
    input: {
      monthLabel: '対象月',
      incomeLabel: '月収 (手取り)',
      expensesTitle: '生活費',
      expensesSubtitle: '各項目の費用を入力してください',
      modeDetailed: '詳細',
      modeTotal: '合計',
      totalExpenseLabel: '月間総支出',
      saveButton: '記録を保存',
      resetButton: '新規 / リセット',
      resetConfirm: 'すべての入力を消去して新しい記録を開始しますか？',
      placeholder: '0',
      categories: {
        housing: '住居費',
        food: '食費',
        transport: '交通費',
        utilities: '光熱費・通信費',
        entertainment: '娯楽費',
        others: 'その他',
        uncategorized: '未分類'
      },
      saveSuccess: '記録しました！',
      enterDataAlert: '先にデータを入力してください',
    },
    results: {
      scoreTitle: '独秀指数',
      waitingData: 'データ入力待ち...',
      status: {
        Excellent: '極めて健全な家計',
        Good: '健全な家計',
        Poor: '家計圧迫',
        label_Excellent: '優秀',
        label_Good: '良好',
        label_Poor: '要注意'
      },
      totalExpenses: '総支出',
      balance: '残金',
      chartTitle: '支出構成',
      chartTop: '最大'
    },
    trends: {
      emptyTitle: '履歴なし',
      emptyDesc: '計算タブで月次データを保存すると、<br/>ここに財務推移グラフが表示されます。',
      title: '推移概要',
      historyTitle: '履歴一覧',
      income: '収',
      expense: '支',
      deleteConfirm: 'この記録を削除しますか？'
    },
    advisor: {
      title: 'AIファイナンシャル・アドバイザー',
      emptyTitle: 'AIアドバイザー準備完了',
      emptyDesc: 'AIによる分析を受けるには、<br/>まず計算タブで収支を入力してください。',
      startButton: '分析開始',
      loadingTitle: '財務モデルを分析中...',
      loadingDesc: '数秒かかります',
      regenerate: '再生成',
      snapshotTitle: '現在のスナップショット',
      income: '月収',
      score: '指数',
      hint: '上のボタンを押すと、AIがあなたのデータに基づいた3つの具体的なアドバイスを提案します。',
      errorApiKey: 'APIキーがありません。設定ページでGemini APIキーを設定してください。',
      errorGeneric: '申し訳ありませんが、現在アドバイスを生成できません。'
    },
    settings: {
      title: '設定',
      apiKeyTitle: 'Gemini API キー',
      apiKeyDesc: 'AI機能を使用するために必要です',
      apiKeyPlaceholder: 'APIキーを貼り付け',
      appearanceTitle: '外観',
      languageTitle: '言語',
      themeLight: 'ライトモード',
      themeDark: 'ダークモード',
      currencyTitle: '通貨単位',
      aboutTitle: 'アプリについて',
      version: 'バージョン v1.1.0',
      clearData: '全データを消去',
      clearDataConfirm: '本当によろしいですか？保存されたデータはすべて削除されます。',
      clearDataSuccess: 'データを消去しました'
    }
  }
};
