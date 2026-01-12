const fs = require('fs');
const path = require('path');

// Read JSON file
function readJSON(filename) {
    try {
        const filePath = path.join(__dirname, '..', 'data', filename);
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return null;
    }
}

// Write to JSON file
function writeJSON(filename, data) {
    try {
        const filePath = path.join(__dirname, '..', 'data', filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
        return false;
    }
}

// Add transaction
function addTransaction(userId, type, amount, category, description = '') {
    const transactions = readJSON('transactions.json');
    if (!transactions) return false;

    const transaction = {
        id: Date.now().toString(),
        userId,
        type, // 'income' or 'expense'
        amount: parseFloat(amount),
        category,
        description,
        date: new Date().toISOString()
    };

    transactions.transactions.push(transaction);
    return writeJSON('transactions.json', transactions);
}

// Get user transactions
function getUserTransactions(userId, startDate = null, endDate = null) {
    const transactions = readJSON('transactions.json');
    if (!transactions) return [];

    let userTransactions = transactions.transactions.filter(t => t.userId === userId);

    if (startDate) {
        userTransactions = userTransactions.filter(t => new Date(t.date) >= new Date(startDate));
    }
    if (endDate) {
        userTransactions = userTransactions.filter(t => new Date(t.date) <= new Date(endDate));
    }

    return userTransactions;
}

// Calculate balance
function calculateBalance(userId) {
    const transactions = getUserTransactions(userId);
    let balance = 0;

    transactions.forEach(t => {
        if (t.type === 'income') {
            balance += t.amount;
        } else if (t.type === 'expense') {
            balance -= t.amount;
        }
    });

    return balance;
}

// Get expenses by category
function getExpensesByCategory(userId, month = null, year = null) {
    let transactions = getUserTransactions(userId);

    if (month !== null && year !== null) {
        transactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === month && date.getFullYear() === year;
        });
    }

    const expenses = transactions.filter(t => t.type === 'expense');
    const byCategory = {};

    expenses.forEach(e => {
        if (!byCategory[e.category]) {
            byCategory[e.category] = 0;
        }
        byCategory[e.category] += e.amount;
    });

    return byCategory;
}

// Add or update user
function addOrUpdateUser(phoneNumber, name = '') {
    const users = readJSON('users.json');
    if (!users) return false;

    let user = users.users.find(u => u.phoneNumber === phoneNumber);
    
    if (!user) {
        user = {
            id: Date.now().toString(),
            phoneNumber,
            name,
            createdAt: new Date().toISOString()
        };
        users.users.push(user);
    }

    return writeJSON('users.json', users) ? user : null;
}

// Get user by phone number
function getUserByPhone(phoneNumber) {
    const users = readJSON('users.json');
    if (!users) return null;

    return users.users.find(u => u.phoneNumber === phoneNumber);
}

// Check budget limit
function checkBudgetLimit(userId, category) {
    const settings = readJSON('settings.json');
    if (!settings || !settings.budgets[category]) return null;

    const limit = settings.budgets[category];
    const now = new Date();
    const expenses = getExpensesByCategory(userId, now.getMonth(), now.getFullYear());
    const spent = expenses[category] || 0;

    return {
        limit,
        spent,
        remaining: limit - spent,
        exceeded: spent > limit
    };
}

// Delete transaction
function deleteTransaction(transactionId) {
    const transactions = readJSON('transactions.json');
    if (!transactions) return false;

    const index = transactions.transactions.findIndex(t => t.id === transactionId);
    if (index === -1) return false;

    transactions.transactions.splice(index, 1);
    return writeJSON('transactions.json', transactions);
}

// Update transaction
function updateTransaction(transactionId, updates) {
    const transactions = readJSON('transactions.json');
    if (!transactions) return false;

    const transaction = transactions.transactions.find(t => t.id === transactionId);
    if (!transaction) return false;

    Object.assign(transaction, updates);
    return writeJSON('transactions.json', transactions);
}

module.exports = {
    readJSON,
    writeJSON,
    addTransaction,
    getUserTransactions,
    calculateBalance,
    getExpensesByCategory,
    addOrUpdateUser,
    getUserByPhone,
    checkBudgetLimit,
    deleteTransaction,
    updateTransaction
};
