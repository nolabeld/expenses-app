import { Hono } from "hono"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import { getUser } from "../kinde"
import { db } from "../db"
import { expenses as expensesTable } from "../db/schema/expenses"
import { eq, desc, sum, and } from "drizzle-orm"

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.string(),
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({ id: true })

const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: "Groceries",
    amount: "50",
  },
  {
    id: 2,
    title: "Entertainment",
    amount: "100",
  },
  {
    id: 3,
    title: "Utilities",
    amount: "75",
  },
]

export const exprensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100)
    return c.json({
      expenses: expenses,
    })
  })
  .post("/", getUser, zValidator("json", createPostSchema), async (c) => {
    const expense = await c.req.valid("json")
    const user = c.var.user
    const result = await db
      .insert(expensesTable)
      .values({
        ...expense,
        userId: user.id,
      })
      .returning()
    c.status(201)
    return c.json(result)
  })
  .get("/getTotalSpent", getUser, async (c) => {
    const user = c.var.user
    const result = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
      .then((r) => r[0])
    return c.json(result)
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const user = c.var.user

    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .then((r) => r[0])

    if (!expense) {
      return c.notFound()
    }
    return c.json({ expense })
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const user = c.var.user

    const deletedExpense = await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .returning()
      .then((r) => r[0])

    if (!deletedExpense) {
      return c.notFound()
    }

    return c.json({ expense: deletedExpense })
  })
// .put
