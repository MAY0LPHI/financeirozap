#!/usr/bin/env node

// Demo script to populate test data

const {
    addOrUpdateUser,
    addTransaction,
    getUserTransactions,
    calculateBalance,
    getExpensesByCategory
} = require('./utils/helpers');

console.log('=== FinanceiroZap - Demo Data Setup ===\n');

// Create test user
console.log('1. Criando usuário de teste...');
const user = addOrUpdateUser('5511999999999', 'Usuário Teste');
console.log(`   ✓ Usuário criado: ${user.name} (ID: ${user.id})\n`);

// Add some income transactions
console.log('2. Adicionando receitas...');
addTransaction(user.id, 'income', 3000, 'Receita', 'Salário mensal');
addTransaction(user.id, 'income', 500, 'Receita', 'Freelance');
console.log('   ✓ 2 receitas adicionadas\n');

// Add some expense transactions
console.log('3. Adicionando despesas...');
addTransaction(user.id, 'expense', 800, 'Moradia', 'Aluguel');
addTransaction(user.id, 'expense', 250, 'Alimentação', 'Supermercado');
addTransaction(user.id, 'expense', 150, 'Transporte', 'Gasolina');
addTransaction(user.id, 'expense', 100, 'Lazer', 'Cinema e restaurante');
addTransaction(user.id, 'expense', 80, 'Saúde', 'Farmácia');
addTransaction(user.id, 'expense', 200, 'Educação', 'Curso online');
addTransaction(user.id, 'expense', 50, 'Outros', 'Diversos');
console.log('   ✓ 7 despesas adicionadas\n');

// Display summary
console.log('4. Resumo financeiro:');
const balance = calculateBalance(user.id);
const transactions = getUserTransactions(user.id);
const incomes = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

console.log(`   💰 Saldo Total: R$ ${balance.toFixed(2)}`);
console.log(`   📈 Total de Receitas: R$ ${incomes.toFixed(2)}`);
console.log(`   📉 Total de Despesas: R$ ${expenses.toFixed(2)}`);
console.log(`   📊 Número de Transações: ${transactions.length}\n`);

// Display expenses by category
console.log('5. Despesas por categoria:');
const now = new Date();
const expensesByCategory = getExpensesByCategory(user.id, now.getMonth(), now.getFullYear());
Object.entries(expensesByCategory).forEach(([category, amount]) => {
    console.log(`   📁 ${category}: R$ ${amount.toFixed(2)}`);
});

console.log('\n✅ Dados de demonstração criados com sucesso!');
console.log('   Acesse http://localhost:3000 para visualizar no painel web.\n');
