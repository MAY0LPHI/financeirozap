const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const {
    addTransaction,
    calculateBalance,
    getExpensesByCategory,
    addOrUpdateUser,
    getUserByPhone,
    checkBudgetLimit,
    getUserTransactions,
    readJSON
} = require('../utils/helpers');

let client = null;

function initializeBot() {
    try {
        // Try to find system Chrome/Chromium
        const fs = require('fs');
        const possiblePaths = [
            '/usr/bin/google-chrome',
            '/usr/bin/chromium',
            '/usr/bin/chromium-browser',
            process.env.CHROME_PATH
        ];
        
        let executablePath = null;
        for (const path of possiblePaths) {
            if (path && fs.existsSync(path)) {
                executablePath = path;
                console.log(`Usando Chrome/Chromium em: ${executablePath}`);
                break;
            }
        }
        
        const puppeteerConfig = {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        };
        
        // Use system Chrome if found
        if (executablePath) {
            puppeteerConfig.executablePath = executablePath;
        }
        
        client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: puppeteerConfig
        });

        client.on('qr', (qr) => {
            console.log('QR Code recebido! Escaneie com seu WhatsApp:');
            qrcode.generate(qr, { small: true });
        });

        client.on('ready', () => {
            console.log('Bot do WhatsApp está pronto!');
        });

        client.on('authenticated', () => {
            console.log('WhatsApp autenticado com sucesso!');
        });

        client.on('auth_failure', (msg) => {
            console.error('Falha na autenticação:', msg);
        });

        client.on('message', async (message) => {
            await handleMessage(message);
        });

        client.on('disconnected', (reason) => {
            console.log('Bot desconectado:', reason);
        });

        client.on('loading_screen', (percent, message) => {
            console.log(`Carregando WhatsApp: ${percent}% - ${message}`);
        });

        client.initialize().catch(err => {
            console.error('Erro ao inicializar WhatsApp Web:', err.message);
            if (err.message.includes('ERR_NAME_NOT_RESOLVED')) {
                console.error('Verifique sua conexão com a internet.');
            } else if (err.message.includes('Chrome')) {
                console.error('Verifique se o Chrome/Chromium está instalado corretamente.');
            }
        });
    } catch (error) {
        console.error('Erro ao configurar cliente WhatsApp:', error.message);
        throw error;
    }
}

async function handleMessage(message) {
    const phoneNumber = message.from;
    const text = message.body.toLowerCase().trim();

    // Ensure user exists
    let user = getUserByPhone(phoneNumber);
    if (!user) {
        user = addOrUpdateUser(phoneNumber);
    }

    if (!user) {
        await message.reply('Erro ao processar sua solicitação. Tente novamente.');
        return;
    }

    // Command: Register expense
    if (text.includes('registrar despesa') || text.includes('registrar gasto')) {
        await handleRegisterExpense(message, user.id);
    }
    // Command: Register income
    else if (text.includes('registrar receita') || text.includes('registrar entrada')) {
        await handleRegisterIncome(message, user.id);
    }
    // Command: Check balance
    else if (text.includes('saldo') || text.includes('qual é o meu saldo')) {
        await handleCheckBalance(message, user.id);
    }
    // Command: Category summary
    else if (text.includes('quanto gasto') || text.includes('quanto gastei')) {
        await handleCategorySummary(message, user.id);
    }
    // Command: Weekly report
    else if (text.includes('relatório') || text.includes('resumo')) {
        await handleReport(message, user.id);
    }
    // Help command
    else if (text.includes('ajuda') || text.includes('help')) {
        await handleHelp(message);
    }
}

async function handleRegisterExpense(message, userId) {
    const text = message.body;
    
    // Extract amount: look for R$ followed by number
    const amountMatch = text.match(/r\$\s*(\d+(?:[.,]\d+)?)/i);
    if (!amountMatch) {
        await message.reply('❌ Não consegui identificar o valor. Use o formato: "Registrar despesa de R$50 em alimentação"');
        return;
    }

    const amount = parseFloat(amountMatch[1].replace(',', '.'));

    // Extract category
    const settings = readJSON('settings.json');
    const categories = settings?.categories || [];
    
    let category = 'Outros';
    for (const cat of categories) {
        if (text.toLowerCase().includes(cat.toLowerCase())) {
            category = cat;
            break;
        }
    }

    // Add transaction
    const success = addTransaction(userId, 'expense', amount, category, text);
    
    if (success) {
        const newBalance = calculateBalance(userId);
        await message.reply(`✅ Despesa registrada!\n💰 Valor: R$ ${amount.toFixed(2)}\n📁 Categoria: ${category}\n💵 Saldo atual: R$ ${newBalance.toFixed(2)}`);
        
        // Check budget limit
        const budgetCheck = checkBudgetLimit(userId, category);
        if (budgetCheck && budgetCheck.exceeded) {
            await message.reply(`⚠️ ALERTA: Você excedeu o limite de orçamento para ${category}!\n📊 Limite: R$ ${budgetCheck.limit.toFixed(2)}\n💸 Gasto: R$ ${budgetCheck.spent.toFixed(2)}`);
        }
    } else {
        await message.reply('❌ Erro ao registrar despesa. Tente novamente.');
    }
}

async function handleRegisterIncome(message, userId) {
    const text = message.body;
    
    // Extract amount
    const amountMatch = text.match(/r\$\s*(\d+(?:[.,]\d+)?)/i);
    if (!amountMatch) {
        await message.reply('❌ Não consegui identificar o valor. Use o formato: "Registrar receita de R$1000"');
        return;
    }

    const amount = parseFloat(amountMatch[1].replace(',', '.'));

    // Extract category (optional for income)
    const category = 'Receita';

    // Add transaction
    const success = addTransaction(userId, 'income', amount, category, text);
    
    if (success) {
        const newBalance = calculateBalance(userId);
        await message.reply(`✅ Receita registrada!\n💰 Valor: R$ ${amount.toFixed(2)}\n💵 Saldo atual: R$ ${newBalance.toFixed(2)}`);
    } else {
        await message.reply('❌ Erro ao registrar receita. Tente novamente.');
    }
}

async function handleCheckBalance(message, userId) {
    const balance = calculateBalance(userId);
    const transactions = getUserTransactions(userId);
    
    const incomes = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    await message.reply(
        `💰 *Seu Saldo Financeiro*\n\n` +
        `💵 Saldo Total: R$ ${balance.toFixed(2)}\n` +
        `📈 Total de Receitas: R$ ${incomes.toFixed(2)}\n` +
        `📉 Total de Despesas: R$ ${expenses.toFixed(2)}\n` +
        `📊 Total de Transações: ${transactions.length}`
    );
}

async function handleCategorySummary(message, userId) {
    const text = message.body.toLowerCase();
    const now = new Date();
    
    // Get current month expenses by category
    const expenses = getExpensesByCategory(userId, now.getMonth(), now.getFullYear());
    
    // Check if user asked for specific category
    const settings = readJSON('settings.json');
    const categories = settings?.categories || [];
    
    let specificCategory = null;
    for (const cat of categories) {
        if (text.includes(cat.toLowerCase())) {
            specificCategory = cat;
            break;
        }
    }

    if (specificCategory) {
        const amount = expenses[specificCategory] || 0;
        await message.reply(`📊 Gastos com *${specificCategory}* este mês: R$ ${amount.toFixed(2)}`);
    } else {
        // Show all categories
        let response = '📊 *Gastos por Categoria (Mês Atual)*\n\n';
        
        if (Object.keys(expenses).length === 0) {
            response += 'Nenhuma despesa registrada este mês.';
        } else {
            for (const [category, amount] of Object.entries(expenses)) {
                response += `📁 ${category}: R$ ${amount.toFixed(2)}\n`;
            }
            const total = Object.values(expenses).reduce((sum, val) => sum + val, 0);
            response += `\n💰 Total: R$ ${total.toFixed(2)}`;
        }
        
        await message.reply(response);
    }
}

async function handleReport(message, userId) {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const transactions = getUserTransactions(userId, weekAgo.toISOString(), now.toISOString());
    
    const incomes = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    let response = '📊 *Relatório Semanal*\n\n';
    response += `📅 Período: Últimos 7 dias\n\n`;
    response += `📈 Receitas: R$ ${incomes.toFixed(2)}\n`;
    response += `📉 Despesas: R$ ${expenses.toFixed(2)}\n`;
    response += `💰 Resultado: R$ ${(incomes - expenses).toFixed(2)}\n\n`;
    
    // Show expenses by category
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const byCategory = {};
    expenseTransactions.forEach(t => {
        if (!byCategory[t.category]) byCategory[t.category] = 0;
        byCategory[t.category] += t.amount;
    });
    
    if (Object.keys(byCategory).length > 0) {
        response += '📁 *Despesas por Categoria:*\n';
        for (const [category, amount] of Object.entries(byCategory)) {
            response += `  • ${category}: R$ ${amount.toFixed(2)}\n`;
        }
    }
    
    await message.reply(response);
}

async function handleHelp(message) {
    const helpText = `
🤖 *FinanceiroZap - Comandos Disponíveis*

📝 *Registrar Transações:*
• "Registrar despesa de R$50 em alimentação"
• "Registrar receita de R$1000"

💰 *Consultas:*
• "Qual é o meu saldo?"
• "Quanto gasto com alimentação este mês?"

📊 *Relatórios:*
• "Relatório semanal"
• "Resumo mensal"

❓ *Ajuda:*
• "Ajuda" - Mostra esta mensagem

💡 *Dica:* Use categorias como: Alimentação, Transporte, Lazer, Saúde, Educação, Moradia.
    `.trim();
    
    await message.reply(helpText);
}

function getClient() {
    return client;
}

module.exports = {
    initializeBot,
    getClient
};
