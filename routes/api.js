const express = require('express');
const router = express.Router();
const {
    readJSON,
    writeJSON,
    getUserTransactions,
    calculateBalance,
    getExpensesByCategory,
    addTransaction,
    deleteTransaction,
    updateTransaction
} = require('../utils/helpers');

// Get all transactions
router.get('/transactions', (req, res) => {
    try {
        const data = readJSON('transactions.json');
        res.json(data.transactions || []);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Get transactions for a specific user
router.get('/transactions/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = getUserTransactions(userId);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user transactions' });
    }
});

// Add new transaction
router.post('/transactions', (req, res) => {
    try {
        const { userId, type, amount, category, description } = req.body;
        
        if (!userId || !type || !amount || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const success = addTransaction(userId, type, amount, category, description);
        
        if (success) {
            res.json({ message: 'Transaction added successfully' });
        } else {
            res.status(500).json({ error: 'Failed to add transaction' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add transaction' });
    }
});

// Update transaction
router.put('/transactions/:id', (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const success = updateTransaction(id, updates);
        
        if (success) {
            res.json({ message: 'Transaction updated successfully' });
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});

// Delete transaction
router.delete('/transactions/:id', (req, res) => {
    try {
        const { id } = req.params;
        const success = deleteTransaction(id);
        
        if (success) {
            res.json({ message: 'Transaction deleted successfully' });
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
});

// Get balance for a user
router.get('/balance/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const balance = calculateBalance(userId);
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate balance' });
    }
});

// Get expenses by category for a user
router.get('/expenses/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const { month, year } = req.query;
        
        const expenses = getExpensesByCategory(
            userId,
            month ? parseInt(month) : null,
            year ? parseInt(year) : null
        );
        
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

// Get dashboard statistics
router.get('/dashboard/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = getUserTransactions(userId);
        
        const balance = calculateBalance(userId);
        const incomes = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        
        const now = new Date();
        const expensesByCategory = getExpensesByCategory(userId, now.getMonth(), now.getFullYear());
        
        res.json({
            balance,
            totalIncome: incomes,
            totalExpenses: expenses,
            transactionCount: transactions.length,
            expensesByCategory
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Get all users
router.get('/users', (req, res) => {
    try {
        const data = readJSON('users.json');
        res.json(data.users || []);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get settings
router.get('/settings', (req, res) => {
    try {
        const settings = readJSON('settings.json');
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Update settings
router.put('/settings', (req, res) => {
    try {
        const settings = req.body;
        const success = writeJSON('settings.json', settings);
        
        if (success) {
            res.json({ message: 'Settings updated successfully' });
        } else {
            res.status(500).json({ error: 'Failed to update settings' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

module.exports = router;
