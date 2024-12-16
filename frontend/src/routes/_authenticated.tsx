import { Button } from "@/components/ui/button"
import { userQueryOptions } from "@/lib/api"
import { createFileRoute, Outlet } from "@tanstack/react-router"

const Login = () => {
  return (
    <div className="flex items-center gap-2 max-w-xl m-auto py-2">
      <Button className="min-w-6">
        <a href="/api/login">Login</a>
      </Button>
      <span>You have to login</span>
    </div>
  )
}

const Component = () => {
  const { user } = Route.useRouteContext()
  if (!user) {
    return <Login />
  }

  return <Outlet />
}

// src/routes/_authenticated.tsx
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient

    try {
      const data = await queryClient.fetchQuery(userQueryOptions)
      return data
    } catch (e) {
      console.error(e)
      return { user: null }
    }
    // userQueryOptions
    // check if the user is authenticated
    return { user: { name: "John Doe" } }
    // return { user: null }
  },
  component: Component,
})
