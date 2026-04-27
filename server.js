const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// Log all requests
app.use((req,res,next)=>{ console.log(req.method + ' ' + req.url); next(); });

app.get('/', (req, res) => { console.log('GET / reached'); res.status(200).send('ORION ONLINE'); });

app.get('/health', (req, res) => {
  res.status(200).send('OK');
        });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
      console.log('ORION running on ' + PORT);
});
