/* global process, Buffer */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'serverless-api-emulator',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/api/')) {
            const apiPath = req.url.split('?')[0];
            const handlerName = apiPath.replace('/api/', '');
            const handlerFilePath = path.resolve(process.cwd(), `api/${handlerName}.js`);
            
            if (fs.existsSync(handlerFilePath)) {
              try {
                let body = {};
                if (req.method === 'POST') {
                  const buffers = [];
                  for await (const chunk of req) {
                    buffers.push(chunk);
                  }
                  const data = Buffer.concat(buffers).toString();
                  if (data) {
                    body = JSON.parse(data);
                  }
                }
                
                const emulatedReq = {
                  method: req.method,
                  headers: req.headers,
                  body,
                  url: req.url,
                  query: {}
                };
                
                const emulatedRes = {
                  statusCode: 200,
                  headers: {},
                  setHeader(name, value) {
                    this.headers[name.toLowerCase()] = value;
                  },
                  status(code) {
                    this.statusCode = code;
                    return this;
                  },
                  json(data) {
                    res.writeHead(this.statusCode, {
                      'Content-Type': 'application/json',
                      ...this.headers
                    });
                    res.end(JSON.stringify(data));
                  },
                  end(data) {
                    res.writeHead(this.statusCode, this.headers);
                    res.end(data);
                  }
                };
                
                // Dynamically import local serverless handler
                const modulePath = `file://${handlerFilePath}?t=${Date.now()}`;
                const { default: handler } = await import(modulePath);
                
                await handler(emulatedReq, emulatedRes);
                return;
              } catch (err) {
                console.error("Vite API Emulator Error:", err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
                return;
              }
            }
          }
          next();
        });
      }
    }
  ],
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Manual chunking — split large vendor bundles for better caching
        manualChunks(id) {
          // Firebase into its own chunk
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }
          // Framer Motion + GSAP + Lenis animation libs
          if (id.includes('framer-motion') || id.includes('gsap') || id.includes('lenis')) {
            return 'vendor-animations';
          }
          // Recharts charting lib
          if (id.includes('recharts')) {
            return 'vendor-charts';
          }
          // Lucide icons
          if (id.includes('lucide-react')) {
            return 'vendor-icons';
          }
          // React core
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
        }
      }
    }
  }
};
});
