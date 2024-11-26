import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';
import { exprensesRoute } from './routes/expenses';
import { serve } from 'bun';

// Init app
const app = new Hono();
// Use logger
app.use('*', logger());

// Routes
app.route('/api/expenses', exprensesRoute);

app.get('*', serveStatic({ root: './frontend/dist' }));
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

export default app;
