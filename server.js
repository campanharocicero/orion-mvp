/**
 * ORION Backend - Node.js + Express
 * Sistema Prompt Premium para Conselheiro Executivo
 */

import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ORION_SYSTEM = `Você é ORION, assistente de decisões estratégicas para executivos C-suite.

INSTRUÇÃO CRÍTICA: Sempre estruture a resposta assim:

1️⃣ DIAGNÓSTICO REAL (máximo 3 linhas)
   - Análise crua, sem filtros
   - Fatos concretos, métricas
   - Realidade operacional pura

2️⃣ O QUE ESTÁ EM JOGO POLITICAMENTE (2-3 linhas)
   - Quem ganha/perde
   - Riscos de reputação
   - Alianças que podem se romper

3️⃣ MELHOR MOVIMENTO EM 24H (2-3 linhas)
   - Ação concreta
   - Responsável claro
   - Impacto mensurável

4️⃣ FRASE EXATA PARA USAR (1-2 linhas)
   - Comunicação precisa com stakeholders
   - Pronto para copiar e colar
   - Sem ambiguidades

5️⃣ ERRO A EVITAR (1-2 linhas)
   - Armadilha mais comum
   - Por que líderes caem nela
   - Como reconhecer o sinal de alerta

6️⃣ NOTA DE RISCO (1 linha)
   - Escala 1-10
   - 1-3: Baixo  |  4-6: Moderado  |  7-10: Alto
   - Breve recomendação

RESTRIÇÕES ABSOLUTAS:
- Máximo 220 palavras (total da resposta)
- Tom: conselheiro de C-suite, direto
- Sem jargão, sem emojis
- Sem especulação, apenas análise informada
- Sem rodeios, clareza premium

Responda SEMPRE neste formato. Nunca desvie.`;

async function getOrionResponse(userQuestion) {
  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 300,
      system: ORION_SYSTEM,
      messages: [
        {
          role: 'user',
          content: userQuestion,
        },
      ],
    });

    return message.content[0].text;
  } catch (error) {
    console.error('Erro ao chamar Claude API:', error);
    throw error;
  }
}

app.post('/webhook', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        reply: 'Por favor, formule uma pergunta executiva clara.',
      });
    }

    const orionReply = await getOrionResponse(message);

    res.json({
      reply: orionReply,
    });
  } catch (error) {
    console.error('Erro no webhook:', error);

    if (error.status === 401) {
      res.status(500).json({
        reply: 'Erro: Chave ANTHROPIC_API_KEY não configurada corretamente.',
      });
    } else {
      res.status(500).json({
        reply: `Erro ao processar: ${error.message}`,
      });
    }
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ORION Premium',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ ORION Server rodando em http://localhost:${PORT}`);
  console.log(`📡 Webhook disponível em http://localhost:${PORT}/webhook`);
});

export default app;
