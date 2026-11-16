import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function localApiPlugin(): Plugin {
  return {
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();

        if (req.url.startsWith('/api/productos')) {
          try {
            const enhancedRes: any = res;
            if (!enhancedRes.status) {
              enhancedRes.status = function(code: number) {
                this.statusCode = code;
                return this;
              };
            }
            if (!enhancedRes.json) {
              enhancedRes.json = function(data: any) {
                this.setHeader('Content-Type', 'application/json; charset=utf-8');
                this.end(JSON.stringify(data));
              };
            }
            // @ts-ignore
            const { default: handler } = await import('./api/productos.js');
            return handler(req, enhancedRes);
          } catch (e: any) {
            console.error('[Vite Dev API] Error en /api/productos:', e.message);
            next();
          }
        } else if (req.url.startsWith('/api/pedidos')) {
          try {
            const chunks: Buffer[] = [];
            req.on('data', (chunk: Buffer) => chunks.push(chunk));
            req.on('end', async () => {
              const bodyStr = Buffer.concat(chunks).toString('utf-8');
              const enhancedReq: any = req;
              try {
                enhancedReq.body = bodyStr ? JSON.parse(bodyStr) : {};
              } catch {
                enhancedReq.body = bodyStr;
              }
              const enhancedRes: any = res;
              if (!enhancedRes.status) {
                enhancedRes.status = function(code: number) {
                  this.statusCode = code;
                  return this;
                };
              }
              if (!enhancedRes.json) {
                enhancedRes.json = function(data: any) {
                  this.setHeader('Content-Type', 'application/json; charset=utf-8');
                  this.end(JSON.stringify(data));
                };
              }
              // @ts-ignore
              const { default: handler } = await import('./api/pedidos.js');
              return handler(enhancedReq, enhancedRes);
            });
          } catch (e: any) {
            console.error('[Vite Dev API] Error en /api/pedidos:', e.message);
            next();
          }
        } else {
          next();
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localApiPlugin()],
})
