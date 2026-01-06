
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getDashboardInsights(dataSummary: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Você é um Auditor Sênior de Operações (BI). 
        Analise o resumo de KPIs e forneça 2 observações estratégicas em português sobre Churn e Retenção.
        Dados Atuais: ${dataSummary}
      `,
    });
    return response.text || "Insights indisponíveis.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Falha ao gerar insights.";
  }
}
