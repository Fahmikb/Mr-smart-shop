import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { Storage } from './src/server/storage';

const ADMIN_TOKEN = 'mss_session_' + Buffer.from('smart2025_authorized').toString('base64');

async function createServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Request logger for API calls
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // --- Public API Routes ---

  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'Mister Smart Shop AI Server', time: new Date().toISOString() });
  });

  app.get('/api/categories', (req: Request, res: Response) => {
    res.json(Storage.getCategories());
  });

  app.get('/api/products', (req: Request, res: Response) => {
    res.json(Storage.getProducts());
  });

  app.get('/api/products/:slug', (req: Request, res: Response) => {
    const product = Storage.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.get('/api/settings', (req: Request, res: Response) => {
    res.json(Storage.getSettings());
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const result = Storage.createOrder(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.status(201).json(result);
  });

  app.post('/api/contact', (req: Request, res: Response) => {
    const { fullName, phone, email, subject, message } = req.body;
    if (!fullName || !phone || !message) {
      return res.status(400).json({ error: 'الرجاء إكمال كافة الحقول المطلوبة' });
    }
    const contact = Storage.createContact({ fullName, phone, email, subject, message });
    res.status(201).json({ success: true, contact });
  });

  // Admin login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { password } = req.body;
    if (Storage.verifyAdminKey(password)) {
      res.json({ success: true, token: ADMIN_TOKEN });
    } else {
      res.status(401).json({ success: false, error: 'رمز الدخول غير صحيح / Mot de passe incorrect' });
    }
  });

  // Admin Auth Middleware
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '') || req.headers['x-admin-token'];
    if (token === ADMIN_TOKEN || Storage.verifyAdminKey(token as string)) {
      next();
    } else {
      res.status(401).json({ error: 'غير مصرح / Non autorisé' });
    }
  };

  // --- Admin API Routes ---

  app.get('/api/admin/stats', requireAdmin, (req: Request, res: Response) => {
    const orders = Storage.getOrders();
    const products = Storage.getProducts();
    const contacts = Storage.getContacts();

    const stats = {
      totalOrders: orders.length,
      newOrders: orders.filter(o => o.status === 'New').length,
      pendingOrders: orders.filter(o => o.status === 'Pending').length,
      contactedOrders: orders.filter(o => o.status === 'Contacted').length,
      completedOrders: orders.filter(o => o.status === 'Completed').length,
      cancelledOrders: orders.filter(o => o.status === 'Cancelled').length,
      totalProducts: products.length,
      totalContacts: contacts.length
    };
    res.json(stats);
  });

  app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
    res.json(Storage.getOrders());
  });

  app.patch('/api/admin/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
    const { status } = req.body;
    const updated = Storage.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, order: updated });
  });

  app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
    const product = req.body;
    if (!product.id) {
      product.id = `prod-${Date.now()}`;
    }
    const saved = Storage.saveProduct(product);
    res.status(201).json({ success: true, product: saved });
  });

  app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    const product = req.body;
    product.id = req.params.id;
    const saved = Storage.saveProduct(product);
    res.json({ success: true, product: saved });
  });

  app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    const deleted = Storage.deleteProduct(req.params.id);
    res.json({ success: deleted });
  });

  app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
    const updated = Storage.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  });

  // --- Frontend Dev / Prod Serving ---
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Mister Smart Shop AI server running at http://0.0.0.0:${PORT}`);
  });
}

createServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
