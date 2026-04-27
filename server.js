const express = require('express');
const app = express();

app.get('/', (req,res) => res.send('OK ROOT'));
app.get('/health', (req,res) => res.send('OK HEALTH'));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('LISTENING ON ' + PORT);
});

server.on('error', (err) => {
    console.error('SERVER ERROR:', err);
});

process.on('uncaughtException', err => console.error(err));
process.on('unhandledRejection', err => console.error(err));
