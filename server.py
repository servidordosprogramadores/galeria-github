#!/usr/bin/env python3
"""
Servidor local — serve os arquivos estáticos e faz proxy de /api/github.
Uso: python server.py
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.request
import os

API_URL = 'http://pvk7mklteh7fkzwrmfcpa95p.31.97.28.81.sslip.io/github'
PORT = 3333


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path in ('/api/github', '/api/github/'):
            try:
                with urllib.request.urlopen(API_URL, timeout=10) as r:
                    data = r.read()
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(data)
            except Exception as e:
                self.send_response(502)
                self.send_header('Content-Type', 'text/plain')
                self.end_headers()
                self.wfile.write(str(e).encode())
        else:
            super().do_GET()

    def log_message(self, fmt, *args):
        print(f'  {self.address_string()} — {fmt % args}')


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f'\n  → http://localhost:{PORT}\n')
    HTTPServer(('', PORT), Handler).serve_forever()
