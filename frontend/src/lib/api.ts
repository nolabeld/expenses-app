import { hc } from "hono/client"
import { type ApiRoutes } from "@server/app"
import { queryOptions } from "@tanstack/react-query"
import { type CreateExpense } from "@server/sharedTypes"

const client = hc<ApiRoutes>("/")

export const api = client.api

async function getCurrentUser() {
  const result = await api.me.$get()
  if (!result.ok) {
    throw new Error("error")
  }
  const data = await result.json()
  return data
}

export const userQueryOptions = queryOptions({
  queryKey: ["getCurrentUser"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
})

export async function getTotalSpent() {
  const result = await api.expenses["getTotalSpent"].$get()
  if (!result.ok) {
    throw new Error("error")
  }
  const data = await result.json()
  return data
}

export async function getAllExpenses() {
  const result = await api.expenses.$get()
  if (!result.ok) {
    throw new Error("error")
  }
  const data = await result.json()
  return data
}

export const getAllExpensesQueryOptions = queryOptions({
  queryKey: ["getAllExpenses"],
  queryFn: getAllExpenses,
  staleTime: 1000 * 60 * 5,
})

export async function createExpense({ value }: { value: CreateExpense }) {
  const res = await api.expenses.$post({ json: value })
  if (!res.ok) {
    throw new Error("server error")
  }

  const newExpense = await res.json()
  return newExpense
}

export const loadingCreateExpenseQueryOptions = queryOptions<{
  expense?: CreateExpense
}>({
  queryKey: ["loading-create-expense"],
  queryFn: async () => {
    return {}
  },
  staleTime: Infinity,
})

export async function deleteExpense(id: number) {
  const res = await api.expenses[":id{[0-9]+}"].$delete({
    param: { id: id.toString() },
  })

  if (!res.ok) {
    throw new Error("server error")
  }
}
