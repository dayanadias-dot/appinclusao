import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI lazily
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// AI Pedagogical Assistant Route for specialized neurodiversity adaptations
app.post("/api/ai/pedagogy-assistant", async (req, res) => {
  try {
    const ai = getAIClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY não configurada no servidor. O app utilizará o banco de conhecimento offline.",
        fallback: true,
      });
    }

    const { prompt, studentProfile, activityContext } = req.body;

    const systemInstruction = `Você é um Pedagogo e Neuropsicopedagogo especialista em Educação Especial e Inclusiva, focado na inclusão escolar de alunos neurodivergentes (TEA, TDAH, Dislexia, TOD, Altas Habilidades/Superdotação, Transtorno do Processamento Sensorial, Dispraxia).
Sua abordagem é estritamente pautada no Desenho Universal para a Aprendizagem (DUA), Neuroafirmação (não patologizante, valorizando potencialidades), Suporte Positivo do Comportamento (PBS) e legislação brasileira (LBI nº 13.146/15).
Responda sempre em português brasileiro de forma acolhedora, prática, estruturada e didática para professores de sala comum e salas de recursos multifuncionais (AEE).
Forneça:
1. Adaptações pedagógicas concretas (como apresentar o conteúdo, tempo, formato de resposta).
2. Manejo socioemocional e sensorial sugerido (antecipações, pausas, apoios visuais).
3. Critérios de avaliação flexíveis e respeitosos ao nível de suporte.`;

    const fullPrompt = `${prompt || "Gere uma proposta de adaptação pedagógica detalhada."}

Perfil do Aluno:
${JSON.stringify(studentProfile, null, 2)}

Contexto da Atividade ou Situação Escolar:
${activityContext || "Atividade de sala de aula regular"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    return res.json({
      success: true,
      text: response.text,
    });
  } catch (error: any) {
    console.error("Erro no assistente pedagógico AI:", error);
    return res.status(500).json({
      error: error.message || "Erro ao processar consulta pedagógica com IA.",
      fallback: true,
    });
  }
});

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Inclui+ servidor rodando em http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Falha ao iniciar servidor:", err);
});
