#!/usr/bin/env python3
"""
Python server for WhatsApp QR Code connection management.
This server provides a web interface to display the WhatsApp QR Code
and manage the connection status.
"""

import http.server
import socketserver
import json
import os
import subprocess
import threading
import time
import webbrowser
from urllib.parse import parse_qs, urlparse

# Port configuration with validation
PORT = 8080
NODE_PORT = 3000

# Validate ports are in acceptable range
if not (1024 <= PORT <= 65535):
    raise ValueError(f"PORT must be between 1024 and 65535, got {PORT}")
if not (1024 <= NODE_PORT <= 65535):
    raise ValueError(f"NODE_PORT must be between 1024 and 65535, got {NODE_PORT}")

qr_code_data = {"qr": None, "status": "Iniciando...", "timestamp": 0}
node_process = None

class WhatsAppServerHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler for WhatsApp connection management."""
    
    def do_GET(self):
        """Handle GET requests."""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/':
            # Serve the QR Code display page
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            html_content = self.get_qr_page()
            self.wfile.write(html_content.encode('utf-8'))
            
        elif parsed_path.path == '/api/qr-status':
            # API endpoint to get QR code status
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            response = json.dumps(qr_code_data)
            self.wfile.write(response.encode('utf-8'))
            
        elif parsed_path.path == '/api/open-dashboard':
            # Open the dashboard in browser
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            try:
                webbrowser.open(f'http://localhost:{NODE_PORT}')
                response = json.dumps({"success": True})
            except Exception as e:
                response = json.dumps({"success": False, "error": str(e)})
            self.wfile.write(response.encode('utf-8'))
            
        else:
            self.send_error(404, "Not Found")
    
    def get_qr_page(self):
        """Generate the QR Code display page HTML."""
        return '''<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FinanceiroZap - Conexão WhatsApp</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }
        
        .status-indicator {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 25px;
            margin: 20px 0;
            font-weight: bold;
            font-size: 1em;
        }
        
        .status-waiting {
            background-color: #ffeaa7;
            color: #2d3436;
        }
        
        .status-connected {
            background-color: #55efc4;
            color: #00b894;
        }
        
        .status-error {
            background-color: #ff7675;
            color: #d63031;
        }
        
        .qr-container {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            min-height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        #qr-code {
            font-family: monospace;
            font-size: 8px;
            line-height: 8px;
            white-space: pre;
            background: white;
            padding: 20px;
            border-radius: 10px;
            display: none;
        }
        
        .loading {
            font-size: 1.2em;
            color: #666;
        }
        
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .instructions {
            background: #e8f4f8;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            text-align: left;
        }
        
        .instructions h3 {
            color: #2c3e50;
            margin-bottom: 15px;
        }
        
        .instructions ol {
            margin-left: 20px;
            color: #34495e;
            line-height: 1.8;
        }
        
        .button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 1.1em;
            cursor: pointer;
            transition: transform 0.2s;
            margin: 10px;
        }
        
        .button:hover {
            transform: translateY(-2px);
        }
        
        .button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .success-message {
            display: none;
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>💰 FinanceiroZap</h1>
        <p class="subtitle">Sistema de Controle Financeiro via WhatsApp</p>
        
        <div id="status-indicator" class="status-indicator status-waiting">
            ⏳ Aguardando conexão...
        </div>
        
        <div class="qr-container">
            <div class="spinner" id="spinner"></div>
            <div class="loading" id="loading-text">Iniciando sistema...</div>
            <pre id="qr-code"></pre>
        </div>
        
        <div class="instructions">
            <h3>📱 Como conectar:</h3>
            <ol>
                <li>Abra o WhatsApp no seu celular</li>
                <li>Toque em <strong>Menu (⋮)</strong> ou <strong>Configurações</strong></li>
                <li>Toque em <strong>Aparelhos conectados</strong></li>
                <li>Toque em <strong>Conectar um aparelho</strong></li>
                <li>Aponte seu celular para o QR Code acima</li>
            </ol>
        </div>
        
        <div class="success-message" id="success-message">
            <strong>✅ Conectado com sucesso!</strong>
            <p>Seu WhatsApp está conectado e pronto para uso.</p>
        </div>
        
        <button class="button" id="open-dashboard-btn" disabled onclick="openDashboard()">
            🖥️ Abrir Painel de Controle
        </button>
        
        <button class="button" onclick="location.reload()">
            🔄 Atualizar
        </button>
    </div>
    
    <script>
        let isConnected = false;
        
        function updateStatus() {
            fetch('/api/qr-status')
                .then(response => response.json())
                .then(data => {
                    const statusDiv = document.getElementById('status-indicator');
                    const qrCodeDiv = document.getElementById('qr-code');
                    const spinner = document.getElementById('spinner');
                    const loadingText = document.getElementById('loading-text');
                    const successMessage = document.getElementById('success-message');
                    const dashboardBtn = document.getElementById('open-dashboard-btn');
                    
                    if (data.status === 'connected' || data.status.includes('pronto')) {
                        statusDiv.textContent = '✅ Conectado!';
                        statusDiv.className = 'status-indicator status-connected';
                        qrCodeDiv.style.display = 'none';
                        spinner.style.display = 'none';
                        loadingText.style.display = 'none';
                        successMessage.style.display = 'block';
                        dashboardBtn.disabled = false;
                        
                        if (!isConnected) {
                            isConnected = true;
                            // Auto-open dashboard after 2 seconds
                            setTimeout(() => {
                                openDashboard();
                            }, 2000);
                        }
                    } else if (data.qr) {
                        statusDiv.textContent = '📱 Escaneie o QR Code';
                        statusDiv.className = 'status-indicator status-waiting';
                        qrCodeDiv.textContent = data.qr;
                        qrCodeDiv.style.display = 'block';
                        spinner.style.display = 'none';
                        loadingText.textContent = 'Aguardando leitura do QR Code...';
                    } else {
                        statusDiv.textContent = '⏳ ' + data.status;
                        statusDiv.className = 'status-indicator status-waiting';
                        loadingText.textContent = data.status;
                    }
                })
                .catch(error => {
                    console.error('Erro ao obter status:', error);
                });
        }
        
        function openDashboard() {
            const dashboardUrl = 'http://localhost:''' + str(NODE_PORT) + '''';
            window.open(dashboardUrl, '_blank');
        }
        
        // Update status every 2 seconds
        updateStatus();
        setInterval(updateStatus, 2000);
    </script>
</body>
</html>'''
    
    def log_message(self, format, *args):
        """Override to suppress request logging."""
        # Only log errors
        if args[1] != '200':
            super().log_message(format, *args)


def read_qr_from_node_output():
    """Monitor Node.js output for QR code data."""
    global qr_code_data, node_process
    
    current_qr_lines = []
    in_qr_block = False
    
    try:
        while node_process and node_process.poll() is None:
            line = node_process.stdout.readline()
            if not line:
                continue
                
            line = line.strip()
            print(line)  # Print to console
            
            # Detect QR code start
            if 'QR Code recebido' in line or 'Escaneie com seu WhatsApp' in line:
                in_qr_block = True
                current_qr_lines = []
                qr_code_data["status"] = "QR Code disponível"
                continue
            
            # Detect ready state
            if 'pronto' in line.lower() or 'ready' in line.lower():
                qr_code_data["status"] = "connected"
                qr_code_data["qr"] = None
                print("\n✅ WhatsApp conectado com sucesso!")
                continue
            
            # Collect QR code lines
            if in_qr_block:
                if line and ('█' in line or '▄' in line or '▀' in line):
                    current_qr_lines.append(line)
                elif current_qr_lines:
                    # QR block ended
                    qr_code_data["qr"] = '\n'.join(current_qr_lines)
                    qr_code_data["timestamp"] = int(time.time())
                    in_qr_block = False
                    print("\n📱 QR Code atualizado!")
                    
    except Exception as e:
        print(f"Erro ao ler saída do Node.js: {e}")


def start_node_server():
    """Start the Node.js server."""
    global node_process, qr_code_data
    
    print("Iniciando servidor Node.js...")
    qr_code_data["status"] = "Iniciando servidor Node.js..."
    
    try:
        # Validate we're in the correct directory
        if not os.path.exists('index.js'):
            raise FileNotFoundError("index.js not found. Please run from the project root directory.")
        
        # Check if npm packages are installed
        if not os.path.exists('node_modules'):
            print("Instalando dependências npm...")
            qr_code_data["status"] = "Instalando dependências..."
            # Use shell=False for security, provide explicit command
            result = subprocess.run(['npm', 'install'], 
                                   check=True,
                                   cwd=os.getcwd(),
                                   capture_output=True,
                                   text=True)
        
        # Start Node.js server with explicit path validation
        node_path = 'node'
        index_path = os.path.join(os.getcwd(), 'index.js')
        
        node_process = subprocess.Popen(
            [node_path, index_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            universal_newlines=True,
            cwd=os.getcwd()
        )
        
        # Start monitoring thread
        monitor_thread = threading.Thread(target=read_qr_from_node_output, daemon=True)
        monitor_thread.start()
        
        print(f"✅ Servidor Node.js iniciado na porta {NODE_PORT}")
        qr_code_data["status"] = "Servidor iniciado, aguardando QR Code..."
        
    except Exception as e:
        print(f"❌ Erro ao iniciar servidor Node.js: {e}")
        qr_code_data["status"] = f"Erro: {str(e)}"


def main():
    """Main function to start the Python server."""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("=" * 60)
    print("  FinanceiroZap - Sistema de Controle Financeiro WhatsApp")
    print("=" * 60)
    print()
    
    # Start Node.js server in background
    node_thread = threading.Thread(target=start_node_server, daemon=True)
    node_thread.start()
    
    # Give Node.js a moment to start
    time.sleep(2)
    
    # Start Python HTTP server
    try:
        with socketserver.TCPServer(("", PORT), WhatsAppServerHandler) as httpd:
            print(f"\n🌐 Servidor Python rodando em http://localhost:{PORT}")
            print(f"🌐 Painel de controle em http://localhost:{NODE_PORT}")
            print("\n📱 Abrindo navegador para conexão WhatsApp...")
            
            # Open browser
            time.sleep(1)
            webbrowser.open(f'http://localhost:{PORT}')
            
            print("\n⌨️  Pressione Ctrl+C para encerrar\n")
            
            # Serve forever
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Encerrando servidores...")
        if node_process:
            node_process.terminate()
            node_process.wait()
        print("✅ Servidores encerrados com sucesso!")
    except Exception as e:
        print(f"\n❌ Erro: {e}")
        if node_process:
            node_process.terminate()


if __name__ == "__main__":
    main()
