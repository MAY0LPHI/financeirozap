const express = require('express');
const path = require('path');
const { initializeBot } = require('./bot/bot');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', apiRoutes);

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize WhatsApp Bot
console.log('Iniciando bot do WhatsApp...');
try {
    initializeBot();
} catch (error) {
    console.error('Erro ao inicializar bot do WhatsApp:', error.message);
    console.log('O servidor web continuará funcionando normalmente.');
    console.log('Para usar o bot, certifique-se de que o Chrome/Chromium está instalado.');
}

// Start server
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse o painel em: http://localhost:${PORT}`);
});
