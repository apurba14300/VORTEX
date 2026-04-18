
import { GoogleGenAI, Type } from "@google/genai";

// Export service with instantiation inside methods for latest API key access
export const geminiService = {
  async generateProjectGenesis(skills: string[], intent: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional technical project scaffold for a ${skills.join(", ")} stack based on: ${intent}. Provide a complete JSON response with architecture, roadmap, and starter files.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
            architecture: { type: Type.STRING },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  status: { type: Type.STRING }
                }
              }
            },
            starterFiles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  content: { type: Type.STRING },
                  language: { type: Type.STRING }
                }
              }
            }
          },
          required: ["title", "description", "techStack", "architecture", "roadmap", "starterFiles"]
        }
      }
    });

    return JSON.parse(response.text);
  },

  async performArchitectureReview(projectData: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `As a Lead Architect, perform an enterprise-grade review of this project. Identify scalability risks, security vulnerabilities (OWASP), and tech debt. Return a structured JSON report.
      Project: ${projectData}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  severity: { type: Type.STRING },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            optimizationSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    return JSON.parse(response.text);
  },

  async generateTechnicalDocs(files: any[]) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate professional README.md and API documentation for this repository. Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            readme: { type: Type.STRING },
            apiDocs: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text);
  }
};
