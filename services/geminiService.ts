
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and should not appear in production
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const suggestRelatedRoles = async (baseRole: string): Promise<string[]> => {
  if (!baseRole.trim()) {
    return [];
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Given the job role "${baseRole}", suggest 5 similar or related job titles.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "A suggested job title."
              }
            }
          }
        },
        temperature: 0.5,
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (result && Array.isArray(result.suggestions)) {
      return result.suggestions;
    }
    
    return [];

  } catch (error) {
    console.error("Error suggesting related roles:", error);
    // In case of an API error, return an empty array to avoid breaking the UI
    return [];
  }
};
