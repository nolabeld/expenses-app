import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: 'Groceries',
    amount: 50,
  },
  {
    id: 2,
    title: 'Entertainment',
    amount: 100,
  },
  {
    id: 3,
    title: 'Utilities',
    amount: 75,
  },
];

export const exprensesRoute = new Hono()
  .get('/', (c) => {
    return c.json({
      expenses: fakeExpenses,
    });
  })
  .post('/', zValidator('json', createPostSchema), async (c) => {
    const data = await c.req.valid('json');
    const expense = createPostSchema.parse(data);
    fakeExpenses.push({ id: fakeExpenses.length + 1, ...expense });
    c.status(201);
    return c.json(expense);
  })
  .get('/:id{[0-9]+}', (c) => {
    const id = Number.parseInt(c.req.param('id'));
    const expense = fakeExpenses.find((e) => e.id === id);
    if (!expense) {
      return c.notFound();
    }
    return c.json(expense);
  })
  .delete('/:id{[0-9]+}', (c) => {
    const id = Number.parseInt(c.req.param('id'));
    const indexToDelete = fakeExpenses.findIndex((e) => e.id === id);
    if (indexToDelete === -1) {
      return c.notFound();
    }
    const deletedExpenses = fakeExpenses.splice(indexToDelete, 1);
    return c.json({ expense: deletedExpenses });
  });
// .put
