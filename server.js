const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req,res) => res.send('OK ROOT'));
app.get('/health', (req,res) => res.send('OK HEALTH'));

// Webhook endpoint para receber mensagens e responder com Claude API
app.post('/webhook', async (req, res) => {
      try {
              const { message } = req.body;

              if (!message) {
                        return res.status(400).json({ error: 'message field is required' });
              }

              const response = await fetch('https://api.anthropic.com/v1/messages', {
                        method: 'POST',
                        headers: {
                                    'Content-Type': 'application/json',
                                    'x-api-key': process.env.CLAUDE_API_KEY,
                                    'anthropic-version': '2023-06-01',
                        },
                        body: JSON.stringify({
                                    model: 'claude-opus-4-6',
                                    max_tokens: 1024,
                                          system: `Você é ORION, conselheiro estratégico privado de Cícero. Especialista em: relações societárias, Daniel e Alexandre, política interna, gestão hospitalar, timing decisório, comunicação executiva.

                                          Responda SEMPRE neste formato:
                                          1. OBJETIVO: [síntese do desafio/oportunidade]
                                          2. LEITURA POLÍTICA: [análise da dinâmica entre atores]
                                          3. MELHOR ABORDAGEM: [estratégia recomendada]
                                          4. FRASE SUGERIDA: [mensagem-chave para comunicar]
                                          5. PRÓXIMO PASSO: [ação imediata recomendada]`,
                                          messages: [
                                        {
                                                        role: 'user',
                                                        content: message,
                                        },
                                                ],
                        }),
              });

              const data = await response.json();

              if (!response.ok) {
                        throw new Error(data.error?.message || 'Claude API error');
              }

              const reply = data.content[0].text;
              res.json({ reply });
      } catch (error) {
              console.error('Webhook error:', error);
              res.status(500).json({ error: error.message });
      }
});


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('LISTENING ON ' + PORT);
});

server.on('error', (err) => {
    console.error('SERVER ERROR:', err);
});

process.on('uncaughtException', err => console.error(err));
process.on('unhandledRejection', err => console.error(err));
