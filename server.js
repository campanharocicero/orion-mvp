const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
      res.json({status: 'ok', message: 'ORION Backend'});
});

app.get('/health', (req, res) => {
      res.json({status: 'ok'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
      console.log('ORION running on ' + PORT);
});
