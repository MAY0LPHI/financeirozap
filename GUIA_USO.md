# FinanceiroZap - Guia de Uso

## 🚀 Como Usar

### Para Usuários Windows

1. **Baixe o projeto**
   - Clone o repositório ou baixe como ZIP
   - Extraia para uma pasta de sua escolha

2. **Execute o sistema**
   - Dê um duplo clique no arquivo `start.bat`
   - O script irá verificar e instalar tudo automaticamente

3. **Conecte o WhatsApp**
   - Uma página web será aberta automaticamente
   - Escaneie o QR Code com seu WhatsApp
   - Aguarde a confirmação de conexão

4. **Pronto!**
   - O painel de controle abrirá automaticamente
   - Comece a usar o bot enviando mensagens no WhatsApp

### Para Usuários Linux/Mac

1. **Baixe o projeto**
   ```bash
   git clone https://github.com/MAY0LPHI/financeirozap.git
   cd financeirozap
   ```

2. **Execute o sistema**
   ```bash
   ./start.sh
   ```
   
3. **Conecte o WhatsApp**
   - Uma página web será aberta automaticamente
   - Escaneie o QR Code com seu WhatsApp
   - Aguarde a confirmação de conexão

4. **Pronto!**
   - O painel de controle abrirá automaticamente
   - Comece a usar o bot enviando mensagens no WhatsApp

## 📱 Interface de Conexão

O sistema oferece uma interface web moderna para conexão WhatsApp:

### Recursos da Interface:
- ✅ **QR Code Visual**: Exibido diretamente no navegador (grande e claro)
- 🔄 **Status em Tempo Real**: Atualização automática a cada 2 segundos
- 📱 **Instruções Passo a Passo**: Guia visual completo
- 🎨 **Design Moderno**: Interface responsiva e bonita
- ⚡ **Auto-Redirect**: Abre o painel automaticamente quando conectado

### Estados de Conexão:
1. **Aguardando Conexão** (amarelo): Sistema iniciando
2. **Escaneie o QR Code** (amarelo): QR Code disponível
3. **Conectado** (verde): WhatsApp conectado com sucesso

## 🛠️ Resolução de Problemas

### "Node.js não encontrado"
- Baixe e instale: https://nodejs.org/
- Recomendado: Versão LTS (Long Term Support)
- Reinicie o terminal após a instalação

### "Python não encontrado"
- Baixe e instale: https://www.python.org/downloads/
- Durante instalação, marque "Add Python to PATH"
- Reinicie o terminal após a instalação

### "Erro ao instalar dependências"
- Verifique sua conexão com a internet
- Execute como administrador (Windows) ou com sudo (Linux/Mac)
- Tente executar manualmente: `npm install`

### QR Code não aparece
- Aguarde alguns segundos (o sistema precisa inicializar)
- Clique em "Atualizar" na página
- Verifique se as portas 8080 e 3000 estão livres

### WhatsApp não conecta
- Certifique-se de ter escaneado o QR Code correto
- Tente gerar um novo QR Code (clique em "Atualizar")
- Verifique se seu celular tem internet

## 💡 Dicas

1. **Mantenha o Terminal Aberto**: Não feche a janela do terminal/console enquanto usar o sistema
2. **Primeira Execução**: Pode demorar mais devido à instalação das dependências
3. **QR Code Expira**: Se demorar muito, clique em "Atualizar" para gerar novo código
4. **Salvar Sessão**: O sistema salva sua sessão automaticamente (não precisa escanear toda vez)

## 🔒 Segurança

- Todos os dados são armazenados localmente
- Nenhuma informação é enviada para servidores externos
- Use em ambiente confiável para testes
- Não compartilhe seu QR Code com ninguém

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs no terminal
2. Consulte a documentação no README.md
3. Abra uma issue no GitHub: https://github.com/MAY0LPHI/financeirozap/issues
