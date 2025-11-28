import { GoogleGenAI } from "@google/genai";
import { FinancialData, IndexResult, Language } from "../types";

const PROMPT_TEMPLATES = {
  zh: `
    你是一位专业的财务顾问。请分析以下个人财务数据。
    
    **财务快照:**
    - 月税后收入: {{salary}}
    - 月总支出: {{totalExpenses}}
    - "独秀指数" (收入/支出): {{index}}
    - 状态评价: {{status}}
    
    **支出明细:**
    - 房租/房贷: {{housing}}
    - 餐饮食品: {{food}}
    - 交通出行: {{transport}}
    - 水电煤网: {{utilities}}
    - 休闲娱乐: {{entertainment}}
    - 其他杂项: {{others}}
    
    **背景知识:**
    "独秀指数" 衡量财务健康状况:
    - 指数 >= 2: 优秀 (储蓄潜力大)
    - 1 <= 指数 < 2: 良好 (收支平衡)
    - 指数 < 1: 欠佳 (财务压力大)
    
    **任务:**
    请提供一份简洁、鼓励性强且可操作的 Markdown 格式分析报告。
    1. 简要点评当前的指数得分。
    2. 指出相对于收入而言最大的支出类别。
    3. 给出 3 个具体的、可操作的建议来提高独秀指数（增加收入或优化特定支出）。
    
    保持语气专业但富有同理心。适当使用 emoji 使阅读更轻松。请使用中文回答。
  `,
  en: `
    You are a professional financial advisor. Please analyze the following personal financial data.
    
    **Financial Snapshot:**
    - Monthly Net Income: {{salary}}
    - Total Monthly Expenses: {{totalExpenses}}
    - "Duxiu Index" (Income/Expenses): {{index}}
    - Status: {{status}}
    
    **Expense Breakdown:**
    - Housing: {{housing}}
    - Food: {{food}}
    - Transport: {{transport}}
    - Utilities: {{utilities}}
    - Entertainment: {{entertainment}}
    - Others: {{others}}
    
    **Context:**
    The "Duxiu Index" measures financial health:
    - Index >= 2: Excellent (High savings potential)
    - 1 <= Index < 2: Good (Balanced)
    - Index < 1: Poor (Financial pressure)
    
    **Task:**
    Please provide a concise, encouraging, and actionable analysis report in Markdown format.
    1. Briefly comment on the current index score.
    2. Identify the largest expense category relative to income.
    3. Give 3 specific, actionable tips to improve the Duxiu Index (increase income or optimize specific expenses).
    
    Keep the tone professional yet empathetic. Use emojis appropriately. Please answer in English.
  `,
  ja: `
    あなたはプロのファイナンシャル・アドバイザーです。以下の個人の財務データを分析してください。
    
    **財務スナップショット:**
    - 月の手取り収入: {{salary}}
    - 月の総支出: {{totalExpenses}}
    - "独秀指数" (収入/支出): {{index}}
    - 評価: {{status}}
    
    **支出の内訳:**
    - 住居費: {{housing}}
    - 食費: {{food}}
    - 交通費: {{transport}}
    - 光熱費: {{utilities}}
    - 娯楽費: {{entertainment}}
    - その他: {{others}}
    
    **背景知識:**
    "独秀指数" は財務の健全性を測る指標です:
    - 指数 >= 2: 優秀 (貯蓄の可能性が高い)
    - 1 <= 指数 < 2: 良好 (収支バランスが良い)
    - 指数 < 1: 要注意 (財務的プレッシャーが大きい)
    
    **タスク:**
    簡潔で励ましになり、かつ実践的な分析レポートをMarkdown形式で提供してください。
    1. 現在の指数スコアについて簡単にコメントしてください。
    2. 収入に対して最も大きな割合を占める支出カテゴリーを指摘してください。
    3. 独秀指数を向上させるための具体的かつ実践的な3つのアドバイス（収入を増やす、または特定の支出を最適化するなど）を提示してください。
    
    プロフェッショナルでありながら共感的なトーンを維持してください。読みやすくするために絵文字を適切に使用してください。日本語で回答してください。
  `
};

export const generateFinancialAdvice = async (
  data: FinancialData, 
  result: IndexResult, 
  userApiKey?: string,
  language: Language = 'zh'
): Promise<string> => {
  // Prioritize user provided key, fallback to env key
  const apiKey = userApiKey || process.env.API_KEY || '';

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const ai = new GoogleGenAI({ apiKey });

  let prompt = PROMPT_TEMPLATES[language];
  
  // Replace placeholders
  prompt = prompt
    .replace('{{salary}}', data.salary.toString())
    .replace('{{totalExpenses}}', result.totalExpenses.toString())
    .replace('{{index}}', result.index.toFixed(2))
    .replace('{{status}}', result.status)
    .replace('{{housing}}', data.expenses.housing.toString())
    .replace('{{food}}', data.expenses.food.toString())
    .replace('{{transport}}', data.expenses.transport.toString())
    .replace('{{utilities}}', data.expenses.utilities.toString())
    .replace('{{entertainment}}', data.expenses.entertainment.toString())
    .replace('{{others}}', data.expenses.others.toString());

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
