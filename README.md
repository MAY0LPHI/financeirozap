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
- **Gerenciamento de Conexão:** Python HTTP Server
- **Bot WhatsApp:** whatsapp-web.js com QR Code no navegador
- **Frontend:** HTML, CSS, JavaScript
- **Gráficos:** Chart.js
- **Armazenamento:** Arquivos JSON
- **Automação:** Scripts .bat (Windows) e .sh (Linux/Mac)

## ✨ Diferenciais

- 🔄 **Inicialização Automática**: Scripts prontos que fazem tudo por você
- 📱 **QR Code no Navegador**: Não precisa olhar o terminal, tudo visualmente no navegador
- 🚀 **Setup em Um Clique**: Execute um arquivo e pronto!
- 🔌 **Auto-Configuração**: Verifica dependências e instala automaticamente
- 🌐 **Interface Moderna**: Design responsivo e intuitivo
- ⚡ **Conexão em Tempo Real**: Status atualizado a cada 2 segundos

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
│   ├── index.html          # Página principal do dashboard
│   ├── css/
│   │   └── style.css       # Estilos
│   └── js/
│       └── app.js          # Lógica do frontend
├── server.py               # Servidor Python para conexão WhatsApp
├── start.bat               # Script de inicialização (Windows)
├── start.sh                # Script de inicialização (Linux/Mac)
├── index.js                # Servidor Node.js principal
└── package.json            # Dependências
└── package.json            # Dependências
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 14 ou superior)
- Python 3.7 ou superior
- npm ou yarn
- **Google Chrome ou Chromium** (necessário para o bot do WhatsApp)

### 🚀 Início Rápido (Recomendado)

A forma mais fácil de usar o FinanceiroZap é através dos scripts de inicialização automática:

#### Windows:
```bash
# Clone o repositório
git clone https://github.com/MAY0LPHI/financeirozap.git
cd financeirozap

# Execute o script de inicialização
start.bat
```

#### Linux/Mac:
```bash
# Clone o repositório
git clone https://github.com/MAY0LPHI/financeirozap.git
cd financeirozap

# Execute o script de inicialização
./start.sh
```

O script irá automaticamente:
1. ✅ Verificar se Node.js e Python estão instalados
2. ✅ Instalar todas as dependências necessárias
3. ✅ Iniciar o servidor Python que gerencia a conexão
4. ✅ Abrir o navegador com a página de conexão WhatsApp
5. ✅ Exibir o QR Code diretamente no navegador

### 📱 Conectar o WhatsApp

Após executar o script, uma página web será aberta automaticamente mostrando:

1. **QR Code Visual**: O código QR será exibido diretamente no navegador (não é necessário olhar o terminal!)
2. **Status de Conexão**: Indicador em tempo real do status da conexão
3. **Instruções Passo a Passo**: Guia visual de como conectar seu WhatsApp

**Para conectar:**
1. Abra o WhatsApp no seu celular
2. Toque em **Menu (⋮)** ou **Configurações**
3. Toque em **Aparelhos conectados**
4. Toque em **Conectar um aparelho**
5. Aponte seu celular para o QR Code exibido no navegador

Quando conectado, o painel de controle abrirá automaticamente!

### 🔧 Instalação Manual (Avançado)

Se preferir executar manualmente:

1. **Clone o repositório:**
```bash
git clone https://github.com/MAY0LPHI/financeirozap.git
cd financeirozap
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Opção A - Usar o servidor Python (Recomendado):**
```bash
python server.py
# ou no Linux/Mac:
python3 server.py
```

4. **Opção B - Usar apenas Node.js:**
```bash
npm start
```
*Nota: Com esta opção, o QR Code será exibido apenas no terminal*

5. **Acesse o painel:**
   - Com servidor Python: `http://localhost:8080` (página de conexão)
   - Painel de controle: `http://localhost:3000`

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

## 🔧 Solução de Problemas

### Problema: QR Code não é exibido

Se o QR Code do WhatsApp não aparecer, verifique:

1. **Chrome/Chromium está instalado?**
   
   **Linux (Ubuntu/Debian):**
   ```bash
   sudo apt update
   sudo apt install chromium-browser
   # ou
   sudo apt install google-chrome-stable
   ```
   
   **Windows:**
   - Baixe e instale o Google Chrome em: https://www.google.com/chrome/
   
   **macOS:**
   ```bash
   brew install --cask google-chrome
   ```

2. **Configurar caminho do Chrome manualmente:**
   
   Crie um arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` e defina o caminho do Chrome:
   ```
   CHROME_PATH=/usr/bin/google-chrome
   ```
   
   Caminhos comuns:
   - Linux: `/usr/bin/google-chrome`, `/usr/bin/chromium`, `/usr/bin/chromium-browser`
   - Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe`
   - macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`

3. **Reinstalar dependências:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Problema: Erro de conexão ERR_NAME_NOT_RESOLVED

Este erro indica problema de conexão com a internet. Verifique:
- Sua conexão com a internet está funcionando
- Não há firewall bloqueando o acesso ao web.whatsapp.com
- Tente desabilitar proxy ou VPN temporariamente

### Problema: Bot desconecta após algum tempo

- Isso é normal quando o WhatsApp Web expira a sessão
- Escaneie o QR Code novamente quando solicitado
- Os dados das transações não são perdidos

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