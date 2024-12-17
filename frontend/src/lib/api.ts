import { hc } from "hono/client"
import { type ApiRoutes } from "@server/app"
import { queryOptions } from "@tanstack/react-query"

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
