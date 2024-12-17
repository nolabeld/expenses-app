import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { getUser } from "../kinde"
import { db } from "../db"
import {
  expenses as expensesTable,
  insertExpensesSchema,
} from "../db/schema/expenses"
import { eq, desc, sum, and } from "drizzle-orm"
import { createExpenseSchema, validateExpenseSchema } from "../sharedTypes"

export const exprensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.date))
      .limit(100)
    return c.json({
      expenses: expenses,
    })
  })
  .post("/", getUser, zValidator("json", createExpenseSchema), async (c) => {
    const expense = await c.req.valid("json")
    const user = c.var.user

    const validatedExpense = insertExpensesSchema
      .omit({
        id: true,
        createdAt: true,
      })
      .parse({
        ...expense,
        userId: user.id,
      })
    const result = await db
      .insert(expensesTable)
      .values(validatedExpense)
      .returning()
      .then((res) => res[0])
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
