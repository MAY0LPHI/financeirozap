#!/bin/bash
# =========================================================
# FinanceiroZap - Sistema de Controle Financeiro WhatsApp
# Script de Inicialização Automatizada (Linux/Mac)
# =========================================================

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "============================================================"
echo "  FinanceiroZap - Sistema de Controle Financeiro WhatsApp"
echo "============================================================"
echo ""

# Check if Node.js is installed
echo -e "${BLUE}[1/4] Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERRO] Node.js não encontrado!${NC}"
    echo ""
    echo "Por favor, instale o Node.js em: https://nodejs.org/"
    echo "Recomendado: Node.js 14 ou superior"
    echo ""
    exit 1
fi
echo -e "${GREEN}[OK] Node.js encontrado!${NC}"

# Check if Python is installed
echo -e "${BLUE}[2/4] Verificando Python...${NC}"
PYTHON_CMD=""
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    # Check if python is version 3
    PYTHON_VERSION=$(python --version 2>&1 | grep -oP '(?<=Python )\d+' | head -1)
    if [ "$PYTHON_VERSION" = "3" ]; then
        PYTHON_CMD="python"
    fi
fi

if [ -z "$PYTHON_CMD" ]; then
    echo -e "${RED}[ERRO] Python 3 não encontrado!${NC}"
    echo ""
    echo "Por favor, instale o Python em: https://www.python.org/downloads/"
    echo "Recomendado: Python 3.7 ou superior"
    echo ""
    exit 1
fi
echo -e "${GREEN}[OK] Python encontrado: $PYTHON_CMD${NC}"

# Install npm dependencies if needed
echo -e "${BLUE}[3/4] Verificando dependências Node.js...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências npm..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERRO] Falha ao instalar dependências npm!${NC}"
        echo ""
        exit 1
    fi
    echo -e "${GREEN}[OK] Dependências instaladas!${NC}"
else
    echo -e "${GREEN}[OK] Dependências já instaladas!${NC}"
fi

# Start the Python server that manages everything
echo -e "${BLUE}[4/4] Iniciando sistema...${NC}"
echo ""
echo "============================================================"
echo "  Sistema iniciando..."
echo "  O navegador abrirá automaticamente em alguns segundos"
echo "============================================================"
echo ""
echo -e "${YELLOW}Pressione Ctrl+C para encerrar o sistema${NC}"
echo ""

# Start the Python server
$PYTHON_CMD server.py

# If the server stops, show message
echo ""
echo "Sistema encerrado."
