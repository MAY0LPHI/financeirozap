@echo off
REM =========================================================
REM FinanceiroZap - Sistema de Controle Financeiro WhatsApp
REM Script de Inicialização Automatizada
REM =========================================================

color 0A
title FinanceiroZap - Inicializando...

echo.
echo ============================================================
echo   FinanceiroZap - Sistema de Controle Financeiro WhatsApp
echo ============================================================
echo.

REM Verifica se Node.js está instalado
echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Node.js nao encontrado!
    echo.
    echo Por favor, instale o Node.js em: https://nodejs.org/
    echo Recomendado: Node.js 14 ou superior
    echo.
    pause
    exit /b 1
)
echo [OK] Node.js encontrado!

REM Verifica se Python está instalado
echo [2/4] Verificando Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Python nao encontrado!
    echo.
    echo Por favor, instale o Python em: https://www.python.org/downloads/
    echo Recomendado: Python 3.7 ou superior
    echo.
    pause
    exit /b 1
)
echo [OK] Python encontrado!

REM Instala dependências npm se necessário
echo [3/4] Verificando dependencias Node.js...
if not exist "node_modules" (
    echo Instalando dependencias npm...
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERRO] Falha ao instalar dependencias npm!
        echo.
        pause
        exit /b 1
    )
    echo [OK] Dependencias instaladas!
) else (
    echo [OK] Dependencias ja instaladas!
)

REM Inicia o servidor Python que gerencia tudo
echo [4/4] Iniciando sistema...
echo.
echo ============================================================
echo   Sistema iniciando...
echo   O navegador abrira automaticamente em alguns segundos
echo ============================================================
echo.
echo Pressione Ctrl+C para encerrar o sistema
echo.

REM Inicia o servidor Python
python server.py

REM Se o servidor parar, mostra mensagem
echo.
echo Sistema encerrado.
pause
