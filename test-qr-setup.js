#!/usr/bin/env node
/**
 * Test script to verify QR Code generation setup
 * This script checks if all prerequisites are met for QR code generation
 */

const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════');
console.log('  FinanceiroZap - Verificação de Configuração QR Code');
console.log('═══════════════════════════════════════════════════════════\n');

let allChecksPass = true;

// Check 1: Node.js version
console.log('✓ Verificando Node.js...');
const nodeVersion = process.version;
console.log(`  Node.js versão: ${nodeVersion}`);
if (parseInt(nodeVersion.slice(1).split('.')[0]) < 14) {
    console.log('  ⚠️  AVISO: Node.js 14 ou superior é recomendado\n');
    allChecksPass = false;
} else {
    console.log('  ✅ Node.js versão OK\n');
}

// Check 2: Required dependencies
console.log('✓ Verificando dependências...');
const requiredDeps = ['express', 'qrcode-terminal', 'whatsapp-web.js'];
const packageJson = require('./package.json');
const installedDeps = packageJson.dependencies || {};

requiredDeps.forEach(dep => {
    if (installedDeps[dep]) {
        console.log(`  ✅ ${dep}: ${installedDeps[dep]}`);
    } else {
        console.log(`  ❌ ${dep}: NÃO ENCONTRADO`);
        allChecksPass = false;
    }
});

// Check 3: node_modules installed
console.log('\n✓ Verificando instalação de pacotes...');
if (fs.existsSync('./node_modules')) {
    console.log('  ✅ node_modules existe');
    
    // Check specific packages
    const criticalPackages = ['whatsapp-web.js', 'qrcode-terminal', 'puppeteer'];
    criticalPackages.forEach(pkg => {
        const pkgPath = path.join('./node_modules', pkg);
        if (fs.existsSync(pkgPath)) {
            console.log(`  ✅ ${pkg} instalado`);
        } else {
            console.log(`  ⚠️  ${pkg} não encontrado`);
        }
    });
} else {
    console.log('  ❌ node_modules não encontrado - Execute: npm install');
    allChecksPass = false;
}

// Check 4: Chrome/Chromium availability
console.log('\n✓ Verificando Chrome/Chromium...');
const possibleChromePaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.CHROME_PATH
];

let chromeFound = false;
let foundPath = null;

for (const checkPath of possibleChromePaths) {
    if (checkPath && fs.existsSync(checkPath)) {
        console.log(`  ✅ Chrome/Chromium encontrado: ${checkPath}`);
        chromeFound = true;
        foundPath = checkPath;
        break;
    }
}

if (!chromeFound) {
    console.log('  ❌ Chrome/Chromium NÃO encontrado');
    console.log('  Instale o Chrome:');
    console.log('    - Ubuntu/Debian: sudo apt install chromium-browser');
    console.log('    - Windows: https://www.google.com/chrome/');
    console.log('    - macOS: brew install --cask google-chrome');
    console.log('  Ou defina CHROME_PATH no arquivo .env');
    allChecksPass = false;
}

// Check 5: .env file (optional but recommended)
console.log('\n✓ Verificando arquivo .env...');
if (fs.existsSync('./.env')) {
    console.log('  ✅ Arquivo .env encontrado');
} else {
    console.log('  ℹ️  Arquivo .env não encontrado (opcional)');
    console.log('  Você pode criar um baseado no .env.example');
}

// Check 6: Project structure
console.log('\n✓ Verificando estrutura do projeto...');
const requiredFiles = ['index.js', 'bot/bot.js', 'server.py', 'package.json'];
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  ✅ ${file}`);
    } else {
        console.log(`  ❌ ${file} NÃO encontrado`);
        allChecksPass = false;
    }
});

// Final summary
console.log('\n═══════════════════════════════════════════════════════════');
if (allChecksPass) {
    console.log('  ✅ SUCESSO: Todas as verificações críticas passaram!');
    console.log('\n  Próximos passos:');
    console.log('  1. Execute: npm start (ou use start.sh/start.bat)');
    console.log('  2. Aguarde o QR Code aparecer no terminal');
    console.log('  3. Escaneie com seu WhatsApp');
} else {
    console.log('  ⚠️  ATENÇÃO: Algumas verificações falharam');
    console.log('\n  Corrija os problemas acima antes de executar o sistema.');
}
console.log('═══════════════════════════════════════════════════════════\n');

process.exit(allChecksPass ? 0 : 1);
