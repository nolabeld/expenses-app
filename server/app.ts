import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { exprensesRoute } from './routes/expenses';

// Init app
const app = new Hono();
// Use logger
app.use('*', logger());

// Routes
app.get('/', (c) => c.text('Hono!'));
app.get('/test', (c) => {
  return c.json({
    message: 'Hello World',
  });
});

app.route('/api/expenses', exprensesRoute);

export default app;
