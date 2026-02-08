
import { GoogleGenAI } from "@google/genai";

// AI service to generate romantic chocolate-themed notes
export const generateLoveNote = async (context?: string) => {
  // Always use a named parameter for the API key as per rules
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = context 
    ? `Generate a very short, deeply romantic secret note (max 2 sentences) inspired by: ${context}. Use metaphors related to chocolate, sweetness, or luxury.`
    : "Generate a short, unique, and deeply romantic love quote (one sentence) that uses chocolate as a metaphor. Make it elegant and evocative.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.9,
      },
    });
    
    // Using the .text property (not a method) as per strict SDK guidelines
    const text = response.text;
    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Your love is sweeter than any words I could ever generate.";
  }
};
