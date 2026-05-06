import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

const progressPlugin = () => ({
  name: 'progress-api',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/progress' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        try {
          const data = fs.readFileSync(path.resolve(__dirname, 'progress.json'), 'utf-8');
          res.end(data);
        } catch (e) {
          res.end(JSON.stringify({ knownQuestions: [], weakQuestions: [], currentIndex: 0 }));
        }
      } else if (req.url === '/api/progress' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
          fs.writeFileSync(path.resolve(__dirname, 'progress.json'), body);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
        });
      } else {
        next();
      }
    });
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), progressPlugin()],
  server: {
    host: true,
  },
})
