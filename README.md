# FinanceiroZap 💰

Sistema de controle financeiro simples, integrando um bot de WhatsApp com um painel de controle acessível via navegador.

## 📋 Funcionalidades

### Bot do WhatsApp
- **Registro de Transações:**
  - Registrar despesas: "Registrar despesa de R$50 em alimentação"
  - Registrar receitas: "Registrar receita de R$1000"
  - Categorização automática
  
- **Consulta de Dados:**
  - Consultar saldo: "Qual é o meu saldo?"
  - Resumo por categoria: "Quanto gasto com alimentação este mês?"
  
- **Relatórios:**
  - Relatórios semanais automáticos
  - Alertas de limites de orçamento excedidos

### Painel Web
- **Dashboard:**
  - Visualização de saldo total, receitas e despesas
  - Gráficos de pizza para despesas por categoria
  - Gráficos de barras para comparação receitas vs despesas
  
- **Gerenciamento de Transações:**
  - Visualização detalhada do histórico
  - Adicionar, editar e excluir transações
  - Busca e filtros
  
- **Configurações:**
  - Criar e gerenciar categorias personalizadas
  - Definir limites de orçamento mensal por categoria

## 🚀 Tecnologias Utilizadas

- **Backend:** Node.js com Express.js
- **Bot WhatsApp:** whatsapp-web.js
- **Frontend:** HTML, CSS, JavaScript
- **Gráficos:** Chart.js
- **Armazenamento:** Arquivos JSON

## 📁 Estrutura do Projeto

```
financeirozap/
├── bot/
│   └── bot.js              # Lógica do bot WhatsApp
├── routes/
│   └── api.js              # Endpoints da API REST
├── data/
│   ├── users.json          # Dados dos usuários
│   ├── transactions.json   # Transações financeiras
│   └── settings.json       # Configurações do sistema
├── utils/
│   └── helpers.js          # Funções auxiliares
├── public/
│   ├── index.html          # Página principal
│   ├── css/
│   │   └── style.css       # Estilos
│   └── js/
│       └── app.js          # Lógica do frontend
├── index.js                # Servidor principal
└── package.json            # Dependências
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/MAY0LPHI/financeirozap.git
cd financeirozap
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor:**
```bash
npm start
```

4. **Configure o WhatsApp:**
   - Ao iniciar o servidor, um QR Code será exibido no terminal
   - Abra o WhatsApp no seu celular
   - Vá em Configurações > Aparelhos conectados
   - Escaneie o QR Code exibido no terminal

5. **Acesse o painel:**
   - Abra o navegador em: `http://localhost:3000`

## 📱 Comandos do Bot WhatsApp

### Registrar Transações
- `Registrar despesa de R$50 em alimentação`
- `Registrar receita de R$1000`

### Consultas
- `Qual é o meu saldo?`
- `Quanto gasto com alimentação este mês?`
- `Quanto gastei este mês?`

### Relatórios
- `Relatório semanal`
- `Resumo mensal`

### Ajuda
- `Ajuda` - Mostra todos os comandos disponíveis

## 🎨 Categorias Padrão

- Alimentação
- Transporte
- Lazer
- Saúde
- Educação
- Moradia
- Outros

*Novas categorias podem ser adicionadas pelo painel web.*

## 🔐 Segurança

- Os dados são armazenados localmente em arquivos JSON
- Não há exposição de credenciais
- Recomenda-se uso em ambiente controlado para testes

## 📊 API Endpoints

### Transações
- `GET /api/transactions` - Lista todas as transações
- `GET /api/transactions/:userId` - Lista transações de um usuário
- `POST /api/transactions` - Adiciona nova transação
- `PUT /api/transactions/:id` - Atualiza transação
- `DELETE /api/transactions/:id` - Exclui transação

### Dashboard
- `GET /api/dashboard/:userId` - Obtém estatísticas do usuário
- `GET /api/balance/:userId` - Obtém saldo do usuário
- `GET /api/expenses/:userId` - Obtém despesas por categoria

### Configurações
- `GET /api/settings` - Obtém configurações
- `PUT /api/settings` - Atualiza configurações

### Usuários
- `GET /api/users` - Lista todos os usuários

## 🛠️ Desenvolvimento

Para modo de desenvolvimento com recarga automática:
```bash
npm run dev
```

## 📝 Notas

- Este é um protótipo para testes
- Armazenamento em JSON não é recomendado para produção
- Para uso em produção, considere migrar para um banco de dados robusto

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

ISC

## 👤 Autor

MAY0LPHI