const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const ORION_PROMPT = 'Você é um conselheiro estratégico privado de Cicero. Especialista em: sócios, política interna, gestão hospitalar, Daniel, Alexandre, estratégia. Responda em português, direto e inteligente.';

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'ORION Backend' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/webhook', async (req, res) => {
    try {
          const { message, user_name = 'Cicero' } = req.body;
          const r = await axios.post('https://api.anthropic.com/v1/messages', 
                                           [{ role: 'user', content: message }], 
                                     {
                                               headers: {
                                                           'x-api-key': process.env.CLAUDE_API_KEY,
                                                           'anthropic-version': '2023-06-01',
                                                           'content-type': 'application/json'
                                               }
                                     }
                                         );
          const reply = r.data.content[0].text;
          res.json({ reply });
    } catch(e) {
          console.error(e);
          res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ORION running on ${PORT}`));
