import { type QueryClient } from "@tanstack/react-query"
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
})

function NavBar() {
  const [isLight, setIsLight] = useState(false)
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    setIsLight(!isLight)
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 mt-2 border rounded-xl backdrop-blur-sm max-w-xl m-auto ">
      <Link to="/" className="text-xl font-bold">
        <h1>Expenses App</h1>
      </Link>
      <div className="flex gap-2">
        {/* <Link to="/about" className="[&.active]:font-bold">
          About
        </Link> */}
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
        <Link to="/create-expense" className="[&.active]:font-bold">
          Create
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
        <Switch
          className="mt-0.5"
          checked={isLight}
          onCheckedChange={toggleTheme}
        />
      </div>
    </div>
  )
}

function Root() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}
