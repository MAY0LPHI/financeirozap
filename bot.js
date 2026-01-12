const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs').promises;
const path = require('path');

// Paths to data files
const TRANSACTIONS_FILE = path.join(__dirname, 'data', 'transactions.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Regex patterns
const AMOUNT_REGEX = /R?\$?\s*(\d+(?:[.,]\d{1,2})?)/i;
const CATEGORY_REGEX = /em\s+([a-záàâãéèêíïóôõöúçñ]+)/i;

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// QR Code generation for authentication
client.on('qr', (qr) => {
    console.log('QR Code recebido! Escaneie com seu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Client ready event
client.on('ready', () => {
    console.log('Bot WhatsApp está pronto e conectado!');
});

// Handle incoming messages
client.on('message', async (message) => {
    try {
        const text = message.body.toLowerCase().trim();
        console.log(`Mensagem recebida: ${message.body}`);

        // Command: Register expense
        if (text.includes('registrar despesa') || text.includes('registrar gasto')) {
            await handleRegisterExpense(message);
        }
        // Command: Register income
        else if (text.includes('registrar entrada') || text.includes('registrar receita')) {
            await handleRegisterIncome(message);
        }
        // Command: Check balance
        else if (text.includes('saldo') || text.includes('balanço')) {
            await handleCheckBalance(message);
        }
        // Command: List transactions
        else if (text.includes('listar transações') || text.includes('extrato')) {
            await handleListTransactions(message);
        }
        // Help command
        else if (text.includes('ajuda') || text.includes('help') || text === 'oi' || text === 'olá') {
            await handleHelp(message);
        }
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
        await message.reply('Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.');
    }
});

// Helper function to generate new transaction ID
function generateNewId(transactions) {
    if (transactions.length === 0) {
        return 1;
    }
    
    const validIds = transactions
        .map(t => t.id)
        .filter(id => typeof id === 'number' && !isNaN(id));
    
    if (validIds.length === 0) {
        return 1;
    }
    
    return Math.max(...validIds) + 1;
}

// Helper function to extract amount from text
function extractAmount(text) {
    const amountMatch = text.match(AMOUNT_REGEX);
    if (!amountMatch) {
        return null;
    }
    // Replace comma with dot for decimal parsing (handles Brazilian format like 25,50)
    return parseFloat(amountMatch[1].replace(',', '.'));
}

// Helper function to extract category from text
function extractCategory(text) {
    const categoryMatch = text.match(CATEGORY_REGEX);
    if (categoryMatch) {
        return categoryMatch[1].toLowerCase();
    }
    return 'geral';
}

// Handle expense registration
async function handleRegisterExpense(message) {
    try {
        const text = message.body;
        
        // Extract amount
        const amount = extractAmount(text);
        if (amount === null) {
            await message.reply('Não consegui identificar o valor. Use o formato: "Registrar despesa de R$50 em alimentação"');
            return;
        }
        
        // Extract category
        const category = extractCategory(text);
        
        // Load existing transactions
        const transactions = await loadTransactions();
        
        // Generate new ID
        const newId = generateNewId(transactions);
        
        // Create new transaction
        const newTransaction = {
            id: newId,
            type: 'saida',
            amount: amount,
            category: category,
            date: new Date().toISOString().split('T')[0]
        };
        
        // Add and save
        transactions.push(newTransaction);
        await saveTransactions(transactions);
        
        await message.reply(`✅ Despesa de R$${amount.toFixed(2)} registrada com sucesso na categoria "${category}"!`);
        
    } catch (error) {
        console.error('Erro ao registrar despesa:', error);
        await message.reply('Erro ao registrar despesa. Tente novamente.');
    }
}

// Handle income registration
async function handleRegisterIncome(message) {
    try {
        const text = message.body;
        
        // Extract amount
        const amount = extractAmount(text);
        if (amount === null) {
            await message.reply('Não consegui identificar o valor. Use o formato: "Registrar entrada de R$1000 em salário"');
            return;
        }
        
        // Extract category
        const category = extractCategory(text);
        
        // Load existing transactions
        const transactions = await loadTransactions();
        
        // Generate new ID
        const newId = generateNewId(transactions);
        
        // Create new transaction
        const newTransaction = {
            id: newId,
            type: 'entrada',
            amount: amount,
            category: category,
            date: new Date().toISOString().split('T')[0]
        };
        
        // Add and save
        transactions.push(newTransaction);
        await saveTransactions(transactions);
        
        await message.reply(`✅ Entrada de R$${amount.toFixed(2)} registrada com sucesso na categoria "${category}"!`);
        
    } catch (error) {
        console.error('Erro ao registrar entrada:', error);
        await message.reply('Erro ao registrar entrada. Tente novamente.');
    }
}

// Handle balance check
async function handleCheckBalance(message) {
    try {
        const transactions = await loadTransactions();
        
        if (transactions.length === 0) {
            await message.reply('📊 Você ainda não tem transações registradas.\n\nSeu saldo é: R$0.00');
            return;
        }
        
        // Calculate balance
        const totalIncome = transactions
            .filter(t => t.type === 'entrada')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpense = transactions
            .filter(t => t.type === 'saida')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const balance = totalIncome - totalExpense;
        
        const response = `📊 *Resumo Financeiro*\n\n` +
                        `💰 Total de Entradas: R$${totalIncome.toFixed(2)}\n` +
                        `💸 Total de Despesas: R$${totalExpense.toFixed(2)}\n` +
                        `━━━━━━━━━━━━━━━━\n` +
                        `🏦 Saldo Atual: R$${balance.toFixed(2)}`;
        
        await message.reply(response);
        
    } catch (error) {
        console.error('Erro ao consultar saldo:', error);
        await message.reply('Erro ao consultar saldo. Tente novamente.');
    }
}

// Handle list transactions
async function handleListTransactions(message) {
    try {
        const transactions = await loadTransactions();
        
        if (transactions.length === 0) {
            await message.reply('📋 Você ainda não tem transações registradas.');
            return;
        }
        
        // Get last 10 transactions
        const recentTransactions = transactions.slice(-10).reverse();
        
        let response = '📋 *Últimas Transações:*\n\n';
        
        recentTransactions.forEach(t => {
            const icon = t.type === 'entrada' ? '💰' : '💸';
            const sign = t.type === 'entrada' ? '+' : '-';
            response += `${icon} ${sign}R$${t.amount.toFixed(2)} - ${t.category}\n`;
            response += `   ${t.date}\n\n`;
        });
        
        await message.reply(response);
        
    } catch (error) {
        console.error('Erro ao listar transações:', error);
        await message.reply('Erro ao listar transações. Tente novamente.');
    }
}

// Handle help command
async function handleHelp(message) {
    const helpText = `🤖 *Bot Financeiro WhatsApp*\n\n` +
                    `Comandos disponíveis:\n\n` +
                    `📝 *Registrar Despesa:*\n` +
                    `"Registrar despesa de R$50 em alimentação"\n\n` +
                    `💵 *Registrar Entrada:*\n` +
                    `"Registrar entrada de R$1000 em salário"\n\n` +
                    `💰 *Consultar Saldo:*\n` +
                    `"Qual é o meu saldo?"\n\n` +
                    `📋 *Listar Transações:*\n` +
                    `"Listar transações" ou "Extrato"\n\n` +
                    `❓ *Ajuda:*\n` +
                    `"Ajuda" ou "Help"`;
    
    await message.reply(helpText);
}

// Load transactions from file
async function loadTransactions() {
    try {
        const data = await fs.readFile(TRANSACTIONS_FILE, 'utf8');
        try {
            return JSON.parse(data);
        } catch (parseError) {
            console.error('Erro ao parsear JSON:', parseError);
            // Return empty array if JSON is malformed
            return [];
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, return empty array
            return [];
        }
        throw error;
    }
}

// Save transactions to file
async function saveTransactions(transactions) {
    try {
        // Ensure data directory exists
        const dataDir = path.dirname(TRANSACTIONS_FILE);
        await fs.mkdir(dataDir, { recursive: true });
        
        // Write transactions to file
        await fs.writeFile(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2), 'utf8');
    } catch (error) {
        console.error('Erro ao salvar transações:', error);
        throw error;
    }
}

// Error handling
client.on('auth_failure', (msg) => {
    console.error('Falha na autenticação:', msg);
});

client.on('disconnected', (reason) => {
    console.log('Cliente desconectado:', reason);
});

// Initialize client with error handling
console.log('Iniciando bot WhatsApp...');
console.log('Aguarde enquanto o bot se conecta...\n');

client.initialize().catch(error => {
    console.error('\n❌ Erro ao inicializar o bot:', error.message);
    
    if (error.message.includes('Could not find Chrome')) {
        console.error('\n🔧 SOLUÇÃO:');
        console.error('   O Chrome/Chromium não está instalado.');
        console.error('   Execute um dos seguintes comandos:\n');
        console.error('   1. npm run setup');
        console.error('   2. npx @puppeteer/browsers install chrome@stable\n');
        console.error('   Ou instale o Chrome/Chromium manualmente no sistema.');
    }
    
    process.exit(1);
});
