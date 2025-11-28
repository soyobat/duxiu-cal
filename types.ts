
export interface Expenses {
  housing: number;
  food: number;
  transport: number;
  utilities: number;
  entertainment: number;
  others: number;
}

export type ExpenseMode = 'detailed' | 'total';

export interface FinancialData {
  salary: number;
  expenseMode: ExpenseMode;
  totalExpenseInput: number;
  expenses: Expenses;
}

export interface IndexResult {
  index: number;
  totalExpenses: number;
  status: 'Excellent' | 'Good' | 'Poor';
  color: string;
}

export enum IndexStatus {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  POOR = 'Poor'
}

export interface HistoryRecord {
  id: string;
  month: string; // YYYY-MM
  data: FinancialData;
  result: IndexResult;
  timestamp: number;
}

export type Language = 'zh' | 'en' | 'ja';
export type Theme = 'light' | 'dark';
export type Currency = 'CNY' | 'USD' | 'EUR' | 'JPY' | 'GBP';

export interface AppSettings {
  apiKey: string;
  language: Language;
  theme: Theme;
  currency: Currency;
}
