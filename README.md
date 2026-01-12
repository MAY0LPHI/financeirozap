# FinanceiroZap 💰📱

Bot de WhatsApp para gerenciamento financeiro pessoal. Registre suas despesas e receitas, consulte seu saldo e acompanhe suas transações diretamente pelo WhatsApp!

## 📋 Funcionalidades

- ✅ **Autenticação via QR Code**: Conecte facilmente sua conta do WhatsApp
- 💸 **Registro de Despesas**: Registre gastos com categoria
- 💰 **Registro de Receitas**: Registre entradas/receitas
- 🏦 **Consulta de Saldo**: Veja seu saldo atual em tempo real
- 📊 **Extrato de Transações**: Liste suas últimas transações
- 🤖 **Interface Conversacional**: Comandos em linguagem natural

## 🚀 Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Conta do WhatsApp

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/MAY0LPHI/financeirozap.git
cd financeirozap
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o bot:
```bash
npm start
```

4. Escaneie o QR Code que aparecerá no terminal com seu WhatsApp:
   - Abra o WhatsApp no celular
   - Vá em **Configurações** > **Aparelhos conectados**
   - Toque em **Conectar um aparelho**
   - Escaneie o QR Code exibido no terminal

## 💬 Como Usar

### Comandos Disponíveis

#### 📝 Registrar Despesa
```
Registrar despesa de R$50 em alimentação
Registrar gasto de R$100 em transporte
```

#### 💵 Registrar Entrada/Receita
```
Registrar entrada de R$1000 em salário
Registrar receita de R$500 em freelance
```

#### 💰 Consultar Saldo
```
Qual é o meu saldo?
Saldo
Balanço
```

#### 📋 Listar Transações
```
Listar transações
Extrato
```

#### ❓ Ajuda
```
Ajuda
Help
Oi
```

## 📂 Estrutura do Projeto

```
financeirozap/
├── bot.js                    # Arquivo principal do bot
├── data/
│   ├── transactions.json     # Armazenamento de transações
│   └── users.json           # Armazenamento de usuários (futuro)
├── package.json             # Dependências do projeto
├── .gitignore              # Arquivos ignorados pelo git
└── README.md               # Documentação
```

## 💾 Formato dos Dados

### Transações (data/transactions.json)

```json
[
  {
    "id": 1,
    "type": "saida",
    "amount": 50,
    "category": "alimentação",
    "date": "2026-01-12"
  },
  {
    "id": 2,
    "type": "entrada",
    "amount": 1000,
    "category": "salário",
    "date": "2026-01-12"
  }
]
```

## 🛠️ Tecnologias Utilizadas

- **Node.js**: Plataforma de execução JavaScript
- **whatsapp-web.js**: Biblioteca para integração com WhatsApp Web
- **qrcode-terminal**: Geração de QR Code no terminal
- **JSON**: Armazenamento de dados local

## 🔒 Segurança e Privacidade

- Os dados são armazenados localmente no seu computador
- A sessão do WhatsApp é salva localmente (pasta `.wwebjs_auth/`)
- Nenhum dado é enviado para servidores externos

## 🚧 Desenvolvimento Futuro

- [ ] Suporte a múltiplos usuários
- [ ] Categorias personalizáveis
- [ ] Relatórios mensais
- [ ] Gráficos e estatísticas
- [ ] Integração com bancos de dados
- [ ] Deploy em produção (AWS, Heroku, etc.)
- [ ] Lembretes de pagamentos
- [ ] Metas de economia

## 📝 Notas

- Este é um projeto para uso local/desenvolvimento
- Para produção, considere usar um banco de dados real
- A autenticação QR Code precisa ser feita a cada execução inicial
- Para manter a sessão ativa, não delete a pasta `.wwebjs_auth/`

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

ISC

---

Desenvolvido com ❤️ para facilitar o controle financeiro pessoal