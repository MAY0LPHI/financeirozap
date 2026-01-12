let currentUserId = null;
let allTransactions = [];
let settings = {};
let categoryChart = null;
let balanceChart = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadUsers();
    await loadSettings();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('addTransactionForm').addEventListener('submit', handleAddTransaction);
    document.getElementById('editTransactionForm').addEventListener('submit', handleEditTransaction);
    document.getElementById('searchTransaction').addEventListener('input', filterTransactions);
}

// Tab navigation
function showTab(tabName, event) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // Fallback: find button by text content
        buttons.forEach(btn => {
            if (btn.textContent.toLowerCase().includes(tabName.toLowerCase())) {
                btn.classList.add('active');
            }
        });
    }
}

// Load users
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        
        const select = document.getElementById('userSelect');
        select.innerHTML = '<option value="">Selecione um usuário</option>';
        
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name || user.phoneNumber;
            select.appendChild(option);
        });

        // Select first user by default if available
        if (users.length > 0) {
            select.value = users[0].id;
            currentUserId = users[0].id;
            await loadUserData();
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Load user data
async function loadUserData() {
    const select = document.getElementById('userSelect');
    currentUserId = select.value;
    
    if (!currentUserId) return;
    
    await Promise.all([
        loadDashboard(),
        loadTransactions()
    ]);
}

// Load dashboard data
async function loadDashboard() {
    if (!currentUserId) return;
    
    try {
        const response = await fetch(`/api/dashboard/${currentUserId}`);
        const data = await response.json();
        
        // Update stats
        document.getElementById('balance').textContent = `R$ ${data.balance.toFixed(2)}`;
        document.getElementById('income').textContent = `R$ ${data.totalIncome.toFixed(2)}`;
        document.getElementById('expenses').textContent = `R$ ${data.totalExpenses.toFixed(2)}`;
        document.getElementById('transactionCount').textContent = data.transactionCount;
        
        // Update charts
        updateCategoryChart(data.expensesByCategory);
        updateBalanceChart(data.totalIncome, data.totalExpenses);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Update category chart
function updateCategoryChart(expensesByCategory) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    const labels = Object.keys(expensesByCategory);
    const data = Object.values(expensesByCategory);
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    categoryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#f093fb',
                    '#4facfe',
                    '#43e97b',
                    '#fa709a',
                    '#feca57'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Update balance chart
function updateBalanceChart(income, expenses) {
    const ctx = document.getElementById('balanceChart').getContext('2d');
    
    if (balanceChart) {
        balanceChart.destroy();
    }
    
    balanceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Receitas', 'Despesas'],
            datasets: [{
                label: 'Valor (R$)',
                data: [income, expenses],
                backgroundColor: [
                    'rgba(74, 222, 128, 0.8)',
                    'rgba(248, 113, 113, 0.8)'
                ],
                borderColor: [
                    'rgb(74, 222, 128)',
                    'rgb(248, 113, 113)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Load transactions
async function loadTransactions() {
    if (!currentUserId) return;
    
    try {
        const response = await fetch(`/api/transactions/${currentUserId}`);
        allTransactions = await response.json();
        displayTransactions(allTransactions);
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Display transactions
function displayTransactions(transactions) {
    const tbody = document.getElementById('transactionTableBody');
    
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhuma transação encontrada</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    // Sort by date (most recent first)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    transactions.forEach(t => {
        const row = document.createElement('tr');
        const date = new Date(t.date).toLocaleDateString('pt-BR');
        const typeBadge = t.type === 'income' ? 'type-income' : 'type-expense';
        const typeText = t.type === 'income' ? 'Receita' : 'Despesa';
        
        row.innerHTML = `
            <td>${date}</td>
            <td><span class="type-badge ${typeBadge}">${typeText}</span></td>
            <td>R$ ${t.amount.toFixed(2)}</td>
            <td>${t.category}</td>
            <td>${t.description || '-'}</td>
            <td>
                <button class="btn-edit" onclick="openEditModal('${t.id}')">Editar</button>
                <button class="btn-danger" onclick="deleteTransaction('${t.id}')">Excluir</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Filter transactions
function filterTransactions() {
    const searchTerm = document.getElementById('searchTransaction').value.toLowerCase();
    const filtered = allTransactions.filter(t => 
        t.category.toLowerCase().includes(searchTerm) ||
        t.description.toLowerCase().includes(searchTerm) ||
        t.amount.toString().includes(searchTerm)
    );
    displayTransactions(filtered);
}

// Handle add transaction
async function handleAddTransaction(e) {
    e.preventDefault();
    
    if (!currentUserId) {
        alert('Selecione um usuário primeiro');
        return;
    }
    
    const type = document.getElementById('transactionType').value;
    const amount = document.getElementById('transactionAmount').value;
    const category = document.getElementById('transactionCategory').value;
    const description = document.getElementById('transactionDescription').value;
    
    try {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUserId,
                type,
                amount: parseFloat(amount),
                category,
                description
            })
        });
        
        if (response.ok) {
            alert('Transação adicionada com sucesso!');
            document.getElementById('addTransactionForm').reset();
            await loadUserData();
        } else {
            alert('Erro ao adicionar transação');
        }
    } catch (error) {
        console.error('Error adding transaction:', error);
        alert('Erro ao adicionar transação');
    }
}

// Open edit modal
function openEditModal(transactionId) {
    const transaction = allTransactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    document.getElementById('editTransactionId').value = transaction.id;
    document.getElementById('editTransactionType').value = transaction.type;
    document.getElementById('editTransactionAmount').value = transaction.amount;
    document.getElementById('editTransactionCategory').value = transaction.category;
    document.getElementById('editTransactionDescription').value = transaction.description || '';
    
    // Populate category select in edit modal
    const select = document.getElementById('editTransactionCategory');
    select.innerHTML = '';
    settings.categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
    select.value = transaction.category;
    
    document.getElementById('editModal').style.display = 'block';
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Handle edit transaction
async function handleEditTransaction(e) {
    e.preventDefault();
    
    const id = document.getElementById('editTransactionId').value;
    const type = document.getElementById('editTransactionType').value;
    const amount = document.getElementById('editTransactionAmount').value;
    const category = document.getElementById('editTransactionCategory').value;
    const description = document.getElementById('editTransactionDescription').value;
    
    try {
        const response = await fetch(`/api/transactions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type,
                amount: parseFloat(amount),
                category,
                description
            })
        });
        
        if (response.ok) {
            alert('Transação atualizada com sucesso!');
            closeEditModal();
            await loadUserData();
        } else {
            alert('Erro ao atualizar transação');
        }
    } catch (error) {
        console.error('Error updating transaction:', error);
        alert('Erro ao atualizar transação');
    }
}

// Delete transaction
async function deleteTransaction(transactionId) {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return;
    
    try {
        const response = await fetch(`/api/transactions/${transactionId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Transação excluída com sucesso!');
            await loadUserData();
        } else {
            alert('Erro ao excluir transação');
        }
    } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Erro ao excluir transação');
    }
}

// Load settings
async function loadSettings() {
    try {
        const response = await fetch('/api/settings');
        settings = await response.json();
        
        // Populate category selects
        const selects = [
            document.getElementById('transactionCategory'),
            document.getElementById('editTransactionCategory')
        ];
        
        selects.forEach(select => {
            if (select) {
                select.innerHTML = '';
                settings.categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat;
                    option.textContent = cat;
                    select.appendChild(option);
                });
            }
        });
        
        displayCategories();
        displayBudgets();
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Display categories
function displayCategories() {
    const container = document.getElementById('categoriesList');
    container.innerHTML = '';
    
    settings.categories.forEach((cat, index) => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = `
            <span>${cat}</span>
            <button class="btn-danger" onclick="removeCategory(${index})">Remover</button>
        `;
        container.appendChild(div);
    });
}

// Display budgets
function displayBudgets() {
    const container = document.getElementById('budgetsList');
    container.innerHTML = '';
    
    settings.categories.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'budget-item';
        div.innerHTML = `
            <label>${cat}:</label>
            <input type="number" id="budget-${cat}" value="${settings.budgets[cat] || ''}" 
                   placeholder="Limite mensal (R$)" step="0.01">
        `;
        container.appendChild(div);
    });
}

// Add category
function addCategory() {
    const input = document.getElementById('newCategory');
    const newCat = input.value.trim();
    
    if (!newCat) {
        alert('Digite o nome da categoria');
        return;
    }
    
    if (settings.categories.includes(newCat)) {
        alert('Categoria já existe');
        return;
    }
    
    settings.categories.push(newCat);
    input.value = '';
    displayCategories();
    displayBudgets();
}

// Remove category
function removeCategory(index) {
    if (!confirm('Tem certeza que deseja remover esta categoria?')) return;
    
    const category = settings.categories[index];
    settings.categories.splice(index, 1);
    delete settings.budgets[category];
    
    displayCategories();
    displayBudgets();
}

// Save settings
async function saveSettings() {
    // Update budgets from inputs
    settings.categories.forEach(cat => {
        const input = document.getElementById(`budget-${cat}`);
        if (input && input.value) {
            settings.budgets[cat] = parseFloat(input.value);
        } else {
            delete settings.budgets[cat];
        }
    });
    
    try {
        const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        
        if (response.ok) {
            alert('Configurações salvas com sucesso!');
            await loadSettings();
        } else {
            alert('Erro ao salvar configurações');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Erro ao salvar configurações');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
}
